# Environment Setup

This project requires a `.env` file with Shopify credentials.

## Create .env file

Create a `.env` file in the project root with the following contents:

```
SHOPIFY_STORE_URL=a92tz2-nt.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
```

## Get Your Access Token

1. Go to your Shopify Admin: https://a92tz2-nt.myshopify.com/admin/settings/apps/development
2. Click on your app
3. Go to "API credentials" tab
4. Copy the Admin API access token

## Important Notes

- **Never commit the .env file to Git** - it's already in .gitignore
- The access token must have the appropriate scopes for the operations you want to perform
- All upload scripts (create-products.js, upload-images.js, etc.) use environment variables for credentials
