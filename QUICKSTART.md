# 🚀 Quick Start Guide - gripped.pl

Your minimalist grip socks e-commerce website is ready!

## 🌐 Access Your Website

**Your website is now running at:**

### Local URLs:
- **Homepage**: http://localhost:8000
- **Product Page**: http://localhost:8000/product.html

## 📁 Project Location

```
/Users/krzysztof/gripped-pl/
```

## 🎨 What's Included

### Pages:
1. **index.html** - Homepage with hero, product grid, features
2. **product.html** - Product detail page with gallery

### Design System:
- **assets/style.css** - Complete CSS design system
- **assets/theme.js** - Interactive functionality
- **Color palette**: Black, white, coral accent (#E8A598)
- **Typography**: Inter font family
- **Fully responsive**: Mobile, tablet, desktop

### Shopify Ready:
- **layout/theme.liquid** - Main theme layout
- **templates/index.liquid** - Homepage template
- **templates/product.liquid** - Product template

## 🛠️ Server Commands

### Stop the server:
```bash
# Find the process
lsof -ti:8000 | xargs kill -9
```

### Restart the server:
```bash
cd ~/gripped-pl
python3 -m http.server 8000
```

### Alternative servers:
```bash
# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

## ✨ Features

✓ Minimalist design with maximum impact
✓ Responsive on all devices
✓ Interactive product cards with "quick add"
✓ Color and size selectors
✓ Shopping cart functionality (demo)
✓ Newsletter signup form
✓ Mobile hamburger menu
✓ Smooth animations and transitions
✓ Product image gallery with thumbnails
✓ Accordion details sections

## 🎯 Next Steps

1. **View the website**: Open http://localhost:8000 in your browser
2. **Test mobile**: Use browser dev tools (F12) to test responsive design
3. **Customize colors**: Edit `assets/style.css` CSS variables
4. **Add products**: Update product data in HTML files
5. **Deploy to Shopify**: Upload Liquid templates to your Shopify store

## 🎨 Design Customization

### Change accent color:
```css
/* In assets/style.css */
--color-accent: #E8A598; /* Change this hex code */
```

### Change fonts:
```html
<!-- In index.html and product.html, update Google Fonts link -->
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

### Update spacing:
```css
/* In assets/style.css */
--space-lg: 48px; /* Adjust spacing variables */
```

## 📱 Test Checklist

- [ ] Homepage loads correctly
- [ ] Product page loads correctly
- [ ] Mobile menu works
- [ ] "Quick add" buttons work
- [ ] Cart count updates
- [ ] Newsletter form submits
- [ ] Color swatches selectable
- [ ] Size options selectable
- [ ] Quantity controls work
- [ ] Responsive on mobile
- [ ] Responsive on tablet

## 🚀 Deploy to Production

### Option 1: Shopify
1. Create a new Shopify store
2. Upload files from `/layout` and `/templates`
3. Upload assets to theme assets
4. Configure products and collections

### Option 2: Static Hosting
- Netlify: Drag and drop the folder
- Vercel: Connect git repository
- GitHub Pages: Push to repository

## 📞 Support

For questions or issues with the design:
- Check README.md for full documentation
- Review assets/style.css for design system
- Inspect assets/theme.js for functionality

---

**Enjoy your new minimalist e-commerce website!**

gripped. - stay grounded.
