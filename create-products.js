const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL?.replace('.myshopify.com', '') || 'a92tz2-nt';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const products = [
  {
    title: "Classic White Grip Socks",
    body_html: "<p>Premium grip socks designed for maximum comfort and stability. Featuring our signature anti-slip technology and breathable fabric construction.</p>",
    vendor: "gripped",
    product_type: "Grip Socks",
    tags: "socks, grip socks, white, classic",
    variants: [{
      price: "16.99",
      sku: "GRIPPED-WHITE-001",
      inventory_quantity: 100,
      inventory_management: "shopify"
    }],
    handle: "classic-white-grip-socks"
  },
  {
    title: "Soft Lavender Grip Socks",
    body_html: "<p>Premium grip socks designed for maximum comfort and stability. Featuring our signature anti-slip technology and breathable fabric construction.</p>",
    vendor: "gripped",
    product_type: "Grip Socks",
    tags: "socks, grip socks, lavender, purple",
    variants: [{
      price: "16.99",
      sku: "GRIPPED-LAVENDER-001",
      inventory_quantity: 100,
      inventory_management: "shopify"
    }],
    handle: "soft-lavender-grip-socks"
  },
  {
    title: "Petal Pink Grip Socks",
    body_html: "<p>Premium grip socks designed for maximum comfort and stability. Featuring our signature anti-slip technology and breathable fabric construction.</p>",
    vendor: "gripped",
    product_type: "Grip Socks",
    tags: "socks, grip socks, pink",
    variants: [{
      price: "16.99",
      sku: "GRIPPED-PINK-001",
      inventory_quantity: 100,
      inventory_management: "shopify"
    }],
    handle: "petal-pink-grip-socks"
  },
  {
    title: "Warm Brown Grip Socks",
    body_html: "<p>Premium grip socks designed for maximum comfort and stability. Featuring our signature anti-slip technology and breathable fabric construction.</p>",
    vendor: "gripped",
    product_type: "Grip Socks",
    tags: "socks, grip socks, brown",
    variants: [{
      price: "16.99",
      sku: "GRIPPED-BROWN-001",
      inventory_quantity: 100,
      inventory_management: "shopify"
    }],
    handle: "warm-brown-grip-socks"
  }
];

function createProduct(productData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ product: productData });

    const options = {
      hostname: `${SHOPIFY_STORE}.myshopify.com`,
      path: '/admin/api/2024-01/products.json',
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
        if (res.statusCode === 201) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Failed to create product: ${res.statusCode} ${body}`));
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

async function createAllProducts() {
  console.log('Creating products in Shopify...\n');

  for (const productData of products) {
    try {
      const result = await createProduct(productData);
      console.log(`✓ Created: ${result.product.title} (ID: ${result.product.id})`);

      // Wait 500ms between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Failed to create ${productData.title}:`, error.message);
    }
  }

  console.log('\nProducts creation complete!');
}

createAllProducts();
