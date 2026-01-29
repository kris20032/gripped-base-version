# gripped.pl - Premium Grip Socks E-commerce

A minimalist Shopify theme design for gripped.pl featuring radical simplicity and maximum aesthetic impact.

## Design Philosophy

- **Whitespace First**: Generous spacing and breathing room
- **Typography-Focused**: Clean sans-serif fonts with bold hierarchy
- **Monochromatic Palette**: Black, white, grays with coral accent
- **Product-First**: High-quality photography on clean backgrounds
- **No Clutter**: Every element earns its place

## Color Palette

```css
--color-white: #FFFFFF
--color-black: #000000
--color-gray-dark: #666666
--color-gray-light: #E5E5E5
--color-gray-bg: #F5F5F5
--color-accent: #E8A598 (Soft Coral)
```

## Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Scale**: 14px - 48px with responsive scaling

## Project Structure

```
gripped-pl/
├── index.html          # Homepage
├── product.html        # Product detail page
├── assets/
│   ├── style.css       # Complete design system
│   └── theme.js        # Interactivity & animations
├── layout/
│   └── theme.liquid    # Shopify theme layout
├── templates/
│   ├── index.liquid    # Homepage template
│   └── product.liquid  # Product page template
└── README.md
```

## Local Development

### Start Local Server

```bash
# Using Python 3
cd ~/gripped-pl
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Alternative Servers

```bash
# Using Node.js (if npx is available)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

## Features

✓ Fully responsive design (mobile, tablet, desktop)
✓ Clean, minimal navigation with mobile menu
✓ Hero section with full-width imagery
✓ Product grid with hover effects
✓ Features section with icons
✓ Collection showcases
✓ Product detail page with gallery
✓ Interactive elements (cart, quantity, size selection)
✓ Newsletter signup
✓ Social media integration

## Pages Included

1. **Homepage** (`index.html`)
   - Hero section
   - Product grid
   - Features
   - Collection showcases

2. **Product Page** (`product.html`)
   - Image gallery with thumbnails
   - Color and size selectors
   - Quantity controls
   - Product details accordion
   - Related products

## Shopify Integration

The `/layout` and `/templates` folders contain Shopify Liquid templates ready for integration:

1. Upload theme files to Shopify
2. Customize product data in Liquid templates
3. Connect to Shopify collections and products
4. Configure checkout to match brand colors

## Performance Features

- Lazy loading images
- Optimized CSS with CSS variables
- Minimal JavaScript
- Web-safe fonts with system fallbacks
- Mobile-first responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

Design inspired by:
- Apple's minimalist approach
- Scandinavian design principles
- Everlane's clean aesthetic
- Swiss design typography

---

**gripped.** - stay grounded.
