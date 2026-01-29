const https = require('https');
const fs = require('fs');

require('dotenv').config();
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL?.replace('.myshopify.com', '') || 'a92tz2-nt';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const THEME_ID = '194000781657';

const themeJsContent = fs.readFileSync('assets/theme.js', 'utf8');

const data = JSON.stringify({
  asset: {
    key: 'assets/theme.js',
    value: themeJsContent
  }
});

const options = {
  hostname: `${SHOPIFY_STORE}.myshopify.com`,
  path: `/admin/api/2024-01/themes/${THEME_ID}/assets.json`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ACCESS_TOKEN,
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✓ Successfully uploaded theme.js to live theme');
      console.log('The video hover effects should now work at weargripped.com');
    } else {
      console.error(`✗ Failed: ${res.statusCode}`);
      console.error(body);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
