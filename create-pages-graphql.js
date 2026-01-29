#!/usr/bin/env node

/**
 * This script creates Shopify pages using the Admin GraphQL API
 * Run with: node create-pages-graphql.js
 *
 * Requires SHOPIFY_ACCESS_TOKEN and SHOPIFY_STORE environment variables
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
  console.error('\nThen run: SHOPIFY_ACCESS_TOKEN="your_token" node create-pages-graphql.js');
  process.exit(1);
}

const pages = [
  {
    title: 'Contact',
    handle: 'contact',
    templateSuffix: 'contact'
  },
  {
    title: 'Shipping Info',
    handle: 'shipping',
    templateSuffix: 'shipping'
  },
  {
    title: 'FAQ',
    handle: 'faq',
    templateSuffix: 'faq'
  }
];

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

async function createPage(page) {
  console.log(`\n📄 Creating page: ${page.title}`);

  const mutation = `
    mutation {
      pageCreate(page: {
        title: "${page.title}"
        handle: "${page.handle}"
        body: ""
        templateSuffix: "${page.templateSuffix}"
        isPublished: true
      }) {
        page {
          id
          title
          handle
          onlineStoreUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const result = await executeGraphQL(mutation);

    if (result.data?.pageCreate?.userErrors?.length > 0) {
      console.error(`❌ Errors for ${page.title}:`);
      result.data.pageCreate.userErrors.forEach(err => {
        console.error(`   - ${err.field}: ${err.message}`);
      });
      return false;
    }

    if (result.data?.pageCreate?.page) {
      const createdPage = result.data.pageCreate.page;
      console.log(`✅ Created: ${createdPage.title}`);
      console.log(`   Handle: ${createdPage.handle}`);
      console.log(`   Template: page.${page.templateSuffix}`);
      console.log(`   URL: ${createdPage.onlineStoreUrl || 'https://weargripped.com/pages/' + page.handle}`);
      return true;
    }

    console.error(`❌ Unknown error for ${page.title}`);
    console.error(JSON.stringify(result, null, 2));
    return false;
  } catch (error) {
    console.error(`❌ Failed to create ${page.title}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  Shopify Pages Creator - GraphQL Admin API');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`\nStore: ${STORE}`);
  console.log(`Creating ${pages.length} pages...\n`);

  let successCount = 0;

  for (const page of pages) {
    const success = await createPage(page);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`  Summary: ${successCount}/${pages.length} pages created`);
  console.log('════════════════════════════════════════════════════════════════\n');

  if (successCount === pages.length) {
    console.log('✅ All pages created successfully!');
    console.log('\nPages are now available at:');
    console.log('  • https://weargripped.com/pages/contact');
    console.log('  • https://weargripped.com/pages/shipping');
    console.log('  • https://weargripped.com/pages/faq');
  } else {
    console.log('⚠️  Some pages failed to create. Check errors above.');
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
