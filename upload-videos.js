const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL?.replace('.myshopify.com', '') || 'a92tz2-nt';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const videos = [
  'assets/white-socks-video.mp4',
  'assets/lavender-socks-video.mov',
  'assets/pink-socks-video.mov',
  'assets/brown-socks-video.mov'
];

function uploadToShopify(filePath) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Content = fileBuffer.toString('base64');

    const data = JSON.stringify({
      asset: {
        key: `assets/${fileName}`,
        attachment: base64Content
      }
    });

    const options = {
      hostname: `${SHOPIFY_STORE}.myshopify.com`,
      path: '/admin/api/2024-01/themes/194000781657/assets.json',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(body);
          resolve({
            file: fileName,
            url: response.asset.public_url,
            success: true
          });
        } else {
          reject(new Error(`Failed to upload ${fileName}: ${res.statusCode} ${body}`));
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

async function uploadAllVideos() {
  console.log('Uploading videos to Shopify...\n');

  const results = [];

  for (const videoPath of videos) {
    try {
      const fullPath = path.join(__dirname, videoPath);
      const fileSize = fs.statSync(fullPath).size;
      const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

      console.log(`Uploading ${path.basename(videoPath)} (${fileSizeMB}MB)...`);

      const result = await uploadToShopify(fullPath);
      console.log(`✓ Uploaded: ${result.file}`);
      console.log(`  URL: ${result.url}\n`);

      results.push(result);

      // Wait 1 second between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`✗ Failed to upload ${videoPath}:`, error.message);
    }
  }

  console.log('\n=== Upload Complete ===\n');
  console.log('Video URLs:');
  results.forEach(r => {
    console.log(`${r.file}: ${r.url}`);
  });

  return results;
}

uploadAllVideos();
