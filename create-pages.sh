#!/bin/bash

# This script creates the shipping and FAQ pages in Shopify
# You'll need to run this with your Shopify credentials

echo "Creating Shipping Info page..."
curl -X POST "https://a92tz2-nt.myshopify.com/admin/api/2024-01/pages.json" \
  -H "Content-Type: application/json" \
  -d '{
    "page": {
      "title": "Shipping Info",
      "handle": "shipping",
      "body_html": "<p>Shipping information page</p>",
      "template_suffix": "shipping"
    }
  }'

echo -e "\n\nCreating FAQ page..."
curl -X POST "https://a92tz2-nt.myshopify.com/admin/api/2024-01/pages.json" \
  -H "Content-Type: application/json" \
  -d '{
    "page": {
      "title": "FAQ",
      "handle": "faq",
      "body_html": "<p>FAQ page</p>",
      "template_suffix": "faq"
    }
  }'

echo -e "\n\nPages created successfully!"
