const https = require('https');

// Store URL
const store = 'a92tz2-nt.myshopify.com';

// Pages to create
const pages = [
  {
    title: 'Shipping Info',
    handle: 'shipping',
    body_html: '<p>Shipping information will be displayed here.</p>',
    template_suffix: 'shipping'
  },
  {
    title: 'FAQ',
    handle: 'faq',
    body_html: '<p>FAQ content will be displayed here.</p>',
    template_suffix: 'faq'
  }
];

console.log('To create these pages, please:');
console.log('\n1. Go to: https://a92tz2-nt.myshopify.com/admin/pages');
console.log('\n2. Click "Add page" for each of the following:\n');

pages.forEach((page, index) => {
  console.log(`Page ${index + 1}:`);
  console.log(`  - Title: ${page.title}`);
  console.log(`  - Content: Leave empty (the template will handle it)`);
  console.log(`  - In the right sidebar under "Template", select: page.${page.template_suffix}`);
  console.log(`  - Click "Save"\n`);
});

console.log('The page handles (URLs) will be automatically created from the titles:');
console.log('  - /pages/shipping');
console.log('  - /pages/faq');
