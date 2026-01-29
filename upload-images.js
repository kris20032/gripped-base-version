const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL?.replace('.myshopify.com', '') || 'a92tz2-nt';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const productImages = [
  { productId: 16068626350425, imagePath: 'assets/white-socks.png' },
  { productId: 16068626415961, imagePath: 'assets/lavender-socks.png' },
  { productId: 16068626481497, imagePath: 'assets/pink-socks.png' },
  { productId: 16068626514265, imagePath: 'assets/brown-socks.png' }
];

function uploadImage(productId, imagePath) {
  return new Promise((resolve, reject) => {
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const data = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: path.basename(imagePath)
      }
    });

    const options = {
      hostname: `${SHOPIFY_STORE}.myshopify.com`,
      path: `/admin/api/2024-01/products/${productId}/images.json`,
      method: 'POST',
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
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Failed to upload image: ${res.statusCode} ${body}`));
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

async function uploadAllImages() {
  console.log('Uploading product images to Shopify...\n');

  for (const { productId, imagePath } of productImages) {
    try {
      const result = await uploadImage(productId, imagePath);
      console.log(`✓ Uploaded: ${imagePath} to product ${productId}`);

      // Wait 1 second between uploads to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`✗ Failed to upload ${imagePath}:`, error.message);
    }
  }

  console.log('\nImage upload complete!');
}

uploadAllImages();
