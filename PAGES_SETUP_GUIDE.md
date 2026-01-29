# Shopify Pages Setup Guide

## Current Status

✅ Template files created and ready:
- `/templates/page.contact.liquid` - Contact page with Polish translations
- `/templates/page.shipping.liquid` - Shipping info with InPost/ORLEN/DPD details
- `/templates/page.faq.liquid` - FAQ with common questions

✅ Translations ready:
- `/assets/translations.js` - 80+ Polish translations with multi-language support

## Problem

The pages need to be created in Shopify's database with the correct template assignments. There are two ways to do this:

---

## Option 1: Automated Script (Recommended)

### Prerequisites

1. **Create a Custom App** (one-time setup):
   - Go to: https://a92tz2-nt.myshopify.com/admin/settings/apps/development
   - Click "Create an app"
   - Name: "Page Creator" (or any name)
   - Click "Create app"

2. **Configure API Permissions**:
   - Click "Configure Admin API scopes"
   - Find and enable: `write_content` (required to create pages)
   - Click "Save"

3. **Install the App**:
   - Click "Install app" button
   - Copy the "Admin API access token" (starts with `shpat_...`)
   - **IMPORTANT**: Save this token securely - it won't be shown again!

### Run the Script

```bash
cd /Users/krzysztof/gripped-pl

# Set your access token (replace YOUR_TOKEN with the actual token)
export SHOPIFY_ACCESS_TOKEN="shpat_xxxxxxxxxxxxxxxxxxxxx"

# Run the script
node create-pages-graphql.js
```

The script will:
- Create all 3 pages (Contact, Shipping Info, FAQ)
- Assign correct templates automatically
- Set pages to Published (visible)
- Print the URLs when done

---

## Option 2: Manual Creation (5 minutes)

### Step 1: Push Templates to Live Theme

```bash
cd /Users/krzysztof/gripped-pl
shopify theme push --theme 194000781657 --only templates/ --allow-live
```

### Step 2: Create Pages in Shopify Admin

Go to: https://a92tz2-nt.myshopify.com/admin/pages

For each page:

#### Contact Page
1. Click "Add page"
2. Title: `Contact`
3. Leave content empty (template handles it)
4. In right sidebar under "Theme template": select `page.contact`
5. Click "Save"

#### Shipping Info Page
1. Click "Add page"
2. Title: `Shipping Info`
3. Leave content empty
4. Theme template: `page.shipping`
5. Click "Save"

#### FAQ Page
1. Click "Add page"
2. Title: `FAQ`
3. Leave content empty
4. Theme template: `page.faq`
5. Click "Save"

---

## Verify Pages Work

After creation (either method), test these URLs:

- https://weargripped.com/pages/contact
- https://weargripped.com/pages/shipping
- https://weargripped.com/pages/faq

Each page should:
- Display in Polish by default
- Support language switching (PL/EN) via header dropdown
- Show correct currency based on country selection
- Use the translation system for all text

---

## Troubleshooting

### "Template not available in dropdown"
- Run: `shopify theme push --theme 194000781657 --only templates/ --allow-live`
- This ensures templates are in the correct theme

### "404 Not Found"
- Check page is Published (not Hidden) in Shopify admin
- Verify correct handle (contact, shipping, faq)

### "Pages show English instead of Polish"
- Check `assets/translations.js` is uploaded to theme
- Polish text is hardcoded in templates as fallback

---

## Files Reference

- **Templates**: `/Users/krzysztof/gripped-pl/templates/page.*.liquid`
- **Translations**: `/Users/krzysztof/gripped-pl/assets/translations.js`
- **Script**: `/Users/krzysztof/gripped-pl/create-pages-graphql.js`
- **Store**: https://a92tz2-nt.myshopify.com/admin
- **Live Site**: https://weargripped.com
- **Theme ID**: 194000781657
