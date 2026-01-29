#!/usr/bin/env node

const https = require('https');

// Store configuration
const SHOP = 'a92tz2-nt.myshopify.com';

// Pages to create
const pages = [
  {
    title: 'Shipping Info',
    handle: 'shipping',
    body_html: '',
    template_suffix: 'shipping'
  },
  {
    title: 'FAQ',
    handle: 'faq',
    body_html: '',
    template_suffix: 'faq'
  }
];

// We need to use Shopify CLI's authentication
// This will use the session from the theme dev command

async function createPage(page) {
  console.log(`\nAttempting to create page: ${page.title}`);
  console.log(`Handle: ${page.handle}`);
  console.log(`Template: page.${page.template_suffix}`);

  const mutation = `
    mutation {
      pageCreate(page: {
        title: "${page.title}"
        handle: "${page.handle}"
        body: ""
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

  console.log('\n⚠️  Note: This requires authentication with Shopify Admin API');
  console.log('Since we cannot authenticate from this script, please create the pages manually:');
  console.log(`\n1. Go to: https://${SHOP}/admin/pages`);
  console.log(`2. Click "Add page"`);
  console.log(`3. Title: "${page.title}"`);
  console.log(`4. Leave content empty`);
  console.log(`5. On the right sidebar, under "Theme template", select "page.${page.template_suffix}"`);
  console.log(`6. Click "Save"\n`);
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  Shopify Pages Setup');
  console.log('════════════════════════════════════════════════════════════════\n');

  for (const page of pages) {
    await createPage(page);
  }

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('  Summary');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('\nAfter creating these pages, they will be available at:');
  console.log(`  • https://${SHOP}/pages/shipping`);
  console.log(`  • https://${SHOP}/pages/faq`);
  console.log('\nThe templates are already in place at:');
  console.log('  • templates/page.shipping.liquid');
  console.log('  • templates/page.faq.liquid');
  console.log('\n✓ All translations are ready in assets/translations.js');
}

main().catch(console.error);
