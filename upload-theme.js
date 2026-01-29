const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL?.replace('.myshopify.com', '') || 'a92tz2-nt';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const THEME_ID = '194000781657';

function uploadFile(filePath, assetKey) {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(filePath, 'utf8');

    const data = JSON.stringify({
      asset: {
        key: assetKey,
        value: content
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
          resolve({ key: assetKey, success: true });
        } else {
          reject(new Error(`Failed to upload ${assetKey}: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function uploadAllFiles() {
  const files = [
    { path: 'layout/theme.liquid', key: 'layout/theme.liquid' },
    { path: 'templates/index.liquid', key: 'templates/index.liquid' },
    { path: 'templates/product.liquid', key: 'templates/product.liquid' },
    { path: 'assets/style.css', key: 'assets/style.css' },
    { path: 'assets/cart.js', key: 'assets/cart.js' },
    { path: 'assets/theme.js', key: 'assets/theme.js' },
    { path: 'assets/translations.js', key: 'assets/translations.js' },
  ];

  console.log('Uploading theme files...\\n');

  for (const file of files) {
    try {
      const filePath = path.join(__dirname, file.path);
      if (fs.existsSync(filePath)) {
        await uploadFile(filePath, file.key);
        console.log(`✓ Uploaded: ${file.key}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log(`✗ Skipped (not found): ${file.path}`);
      }
    } catch (error) {
      console.error(`✗ Failed: ${file.key}`, error.message);
    }
  }

  console.log('\\nUpload complete!');
  console.log('View your store: https://a92tz2-nt.myshopify.com');
}

uploadAllFiles();
