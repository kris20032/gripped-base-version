#!/usr/bin/env node

/**
 * This script queries existing pages and updates their handles if needed
 * Run with: SHOPIFY_ACCESS_TOKEN="your_token" node fix-page-handles.js
 */

const https = require('https');

const STORE = process.env.SHOPIFY_STORE || 'a92tz2-nt.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Error: SHOPIFY_ACCESS_TOKEN environment variable is required');
  console.error('\nTo get an access token:');
  console.error('1. Go to https://a92tz2-nt.myshopify.com/admin/settings/apps/development');
  console.error('2. Create a custom app (if not exists)');
  console.error('3. Grant "write_content" permission');
  console.error('4. Install the app and get the Admin API access token');
  console.error('\nThen run: SHOPIFY_ACCESS_TOKEN="your_token" node fix-page-handles.js');
  process.exit(1);
}

function executeGraphQL(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: STORE,
      path: '/admin/api/2024-01/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Shopify-Access-Token': ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getPages() {
  console.log('\n📋 Fetching all pages...');

  const query = `
    query {
      pages(first: 10) {
        edges {
          node {
            id
            title
            handle
            templateSuffix
          }
        }
      }
    }
  `;

  const result = await executeGraphQL(query);
  return result.data?.pages?.edges || [];
}

async function updatePageHandle(pageId, newHandle) {
  console.log(`\n🔧 Updating page handle to: ${newHandle}`);

  const mutation = `
    mutation {
      pageUpdate(id: "${pageId}", page: {
        handle: "${newHandle}"
      }) {
        page {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await executeGraphQL(mutation);

  if (result.data?.pageUpdate?.userErrors?.length > 0) {
    console.error(`❌ Errors:`);
    result.data.pageUpdate.userErrors.forEach(err => {
      console.error(`   - ${err.field}: ${err.message}`);
    });
    return false;
  }

  if (result.data?.pageUpdate?.page) {
    console.log(`✅ Updated: ${result.data.pageUpdate.page.title} -> ${result.data.pageUpdate.page.handle}`);
    return true;
  }

  return false;
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  Shopify Page Handle Fixer');
  console.log('════════════════════════════════════════════════════════════════');

  try {
    const pages = await getPages();

    console.log(`\nFound ${pages.length} pages:`);
    pages.forEach(({ node }) => {
      console.log(`  - ${node.title}: handle="${node.handle}" template="${node.templateSuffix || 'default'}"`);
    });

    const handleMapping = {
      'Contact': 'contact',
      'Shipping Info': 'shipping',
      'FAQ': 'faq'
    };

    let updatedCount = 0;

    for (const { node } of pages) {
      const expectedHandle = handleMapping[node.title];

      if (expectedHandle && node.handle !== expectedHandle) {
        console.log(`\n⚠️  Page "${node.title}" has handle "${node.handle}" but should be "${expectedHandle}"`);
        const success = await updatePageHandle(node.id, expectedHandle);
        if (success) updatedCount++;
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } else if (expectedHandle) {
        console.log(`\n✓ Page "${node.title}" already has correct handle: ${node.handle}`);
      }
    }

    console.log('\n════════════════════════════════════════════════════════════════');
    console.log(`  Summary: ${updatedCount} handles updated`);
    console.log('════════════════════════════════════════════════════════════════\n');

    if (updatedCount > 0) {
      console.log('✅ Pages updated! URLs should now work:');
      console.log('  • https://weargripped.com/pages/contact');
      console.log('  • https://weargripped.com/pages/shipping');
      console.log('  • https://weargripped.com/pages/faq');
      console.log('\n⏳ Note: It may take a few seconds for Shopify cache to clear.');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
