// GRIPPED.PL - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#cart' || href === '#account') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Quick Add to Cart
  const quickAddButtons = document.querySelectorAll('.quick-add');
  quickAddButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('.product-name').textContent;

      // Get translated alert message
      const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
      const message = typeof t === 'function' ? t('alert_added_to_cart', lang).replace('{product}', productName) : `Added "${productName}" to cart!`;

      alert(message);

      // Update cart count
      updateCartCount();
    });
  });

  // Color Swatch Selection (Product Page)
  const colorSwatches = document.querySelectorAll('[style*="border-radius: 50%"]');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
      colorSwatches.forEach(s => {
        s.style.border = '1px solid var(--color-gray-light)';
      });
      this.style.border = '2px solid var(--color-black)';
    });
  });

  // Size Selection
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      sizeOptions.forEach(opt => {
        opt.style.border = '1px solid var(--color-gray-light)';
      });
      this.style.border = '2px solid var(--color-black)';
    });
  });

  // Quantity Controls
  const quantityDecrease = document.querySelector('button:has(+ span + button)');
  const quantityIncrease = document.querySelector('span:has(+ button):not(button)');

  if (quantityDecrease && quantityIncrease) {
    const quantityDisplay = quantityDecrease.nextElementSibling;
    let quantity = 1;

    quantityDecrease.addEventListener('click', function() {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
      }
    });

    quantityIncrease.nextElementSibling.addEventListener('click', function() {
      quantity++;
      quantityDisplay.textContent = quantity;
    });
  }

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;

      const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
      const message = typeof t === 'function' ? t('alert_subscribed', lang).replace('{email}', email) : `Thank you for subscribing with: ${email}`;

      alert(message);
      this.reset();
    });
  }

  // Search Toggle
  const searchToggle = document.querySelector('.search-toggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', function() {
      const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
      const message = typeof t === 'function' ? t('alert_search', lang) : 'Search functionality would be implemented here';
      alert(message);
    });
  }

  // Smooth Scroll for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Product Gallery Thumbnails
  const thumbnails = document.querySelectorAll('[style*="aspect-ratio: 1"]');
  const mainImage = document.querySelector('.main-product-image img');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img && mainImage) {
        mainImage.src = img.src.replace('w=200', 'w=800');

        // Update active thumbnail
        thumbnails.forEach(t => {
          t.style.border = '1px solid var(--color-gray-light)';
        });
        this.style.border = '2px solid var(--color-black)';
      }
    });
  });

  // Add to Cart Button
  const addToCartBtn = document.querySelector('.btn-primary:not(.btn-large)');
  if (addToCartBtn && addToCartBtn.hasAttribute('data-i18n')) {
    addToCartBtn.addEventListener('click', function() {
      const productName = document.querySelector('h1').textContent;

      const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
      const message = typeof t === 'function' ? t('alert_added_to_cart', lang).replace('{product}', productName) : `Added "${productName}" to cart!`;

      alert(message);
      updateCartCount();
    });
  }

  // Buy Now Button
  const buyNowBtn = document.querySelectorAll('.btn-secondary');
  buyNowBtn.forEach(btn => {
    if (btn.hasAttribute('data-i18n')) {
      btn.addEventListener('click', function() {
        const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
        const message = typeof t === 'function' ? t('alert_checkout', lang) : 'Proceeding to checkout...';
        alert(message);
      });
    }
  });

  // Helper function to update cart count
  function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      let count = parseInt(cartCount.textContent) || 0;
      count++;
      cartCount.textContent = count;
    }
  }

  // Video hover effect for Classic White product
  const classicWhiteProduct = document.querySelector('.product-card:first-child .product-image');
  if (classicWhiteProduct) {
    // Create video element
    const video = document.createElement('video');
    video.src = 'https://cdn.shopify.com/s/files/1/1012/5639/7145/t/2/assets/white-socks-video.mp4?v=1769274273';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.opacity = '0';
    video.style.transition = 'opacity 0.3s ease';
    video.style.zIndex = '1';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    classicWhiteProduct.appendChild(video);

    classicWhiteProduct.addEventListener('mouseenter', function() {
      video.style.opacity = '1';
      video.play();
    });

    classicWhiteProduct.addEventListener('mouseleave', function() {
      video.style.opacity = '0';
      video.pause();
      video.currentTime = 0;
    });
  }

  // Video hover effect for Soft Lavender product
  const lavenderProduct = document.querySelector('.product-card:nth-child(2) .product-image');
  if (lavenderProduct) {
    // Create video element
    const video = document.createElement('video');
    video.src = 'https://cdn.shopify.com/s/files/1/1012/5639/7145/t/2/assets/pink-socks-video.mov?v=1769274273';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.opacity = '0';
    video.style.transition = 'opacity 0.3s ease';
    video.style.zIndex = '1';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    lavenderProduct.appendChild(video);

    lavenderProduct.addEventListener('mouseenter', function() {
      video.style.opacity = '1';
      video.play();
    });

    lavenderProduct.addEventListener('mouseleave', function() {
      video.style.opacity = '0';
      video.pause();
      video.currentTime = 0;
    });
  }

  // Video hover effect for Petal Pink product
  const pinkProduct = document.querySelector('.product-card:nth-child(3) .product-image');
  if (pinkProduct) {
    // Create video element
    const video = document.createElement('video');
    video.src = 'https://cdn.shopify.com/s/files/1/1012/5639/7145/t/2/assets/lavender-socks-video.mov?v=1769274271';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.opacity = '0';
    video.style.transition = 'opacity 0.3s ease';
    video.style.zIndex = '1';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    pinkProduct.appendChild(video);

    pinkProduct.addEventListener('mouseenter', function() {
      video.style.opacity = '1';
      video.play();
    });

    pinkProduct.addEventListener('mouseleave', function() {
      video.style.opacity = '0';
      video.pause();
      video.currentTime = 0;
    });
  }

  // Video hover effect for Warm Brown product
  const brownProduct = document.querySelector('.product-card:nth-child(4) .product-image');
  if (brownProduct) {
    // Create video element
    const video = document.createElement('video');
    video.src = 'https://cdn.shopify.com/s/files/1/1012/5639/7145/t/2/assets/brown-socks-video.mov?v=1769274270';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.opacity = '0';
    video.style.transition = 'opacity 0.3s ease';
    video.style.zIndex = '1';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    brownProduct.appendChild(video);

    brownProduct.addEventListener('mouseenter', function() {
      video.style.opacity = '1';
      video.play();
    });

    brownProduct.addEventListener('mouseleave', function() {
      video.style.opacity = '0';
      video.pause();
      video.currentTime = 0;
    });
  }

  // Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.feature-item, .product-card, .collection-showcase');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Parallax effect for hero image
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      heroImage.style.transform = `translateY(${rate}px)`;
    });
  }

  // Parallax scroll animation for collection showcases
  const collectionShowcases = document.querySelectorAll('.collection-showcase');

  function updateParallaxEffect() {
    collectionShowcases.forEach((showcase) => {
      const rect = showcase.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) when section is in viewport
      const totalDistance = windowHeight;
      let progress = (windowHeight - rect.top) / totalDistance;

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Get child elements
      const image = showcase.querySelector('.collection-image');
      const content = showcase.querySelector('.collection-content');

      if (image && content) {
        // Image animations
        // Opacity: 0 to 1 (completes at 70% of scroll progress)
        const imageOpacity = Math.min(progress / 0.7, 1);
        image.style.opacity = imageOpacity;

        // Clip path: horizontal wipe reveal
        const clipProgress = Math.min(progress / 0.7, 1) * 100;
        image.style.clipPath = `inset(0 ${100 - clipProgress}% 0 0)`;

        // Content animations
        // Opacity: 0 to 1
        const contentOpacity = Math.min(progress / 0.7, 1);
        content.style.opacity = contentOpacity;

        // Translate: from -50px to 0px upward
        const translateY = -50 * (1 - progress);
        content.style.transform = `translateY(${translateY}px)`;
      }
    });
  }

  // Initialize collection showcases with starting states
  collectionShowcases.forEach(showcase => {
    const image = showcase.querySelector('.collection-image');
    const content = showcase.querySelector('.collection-content');

    if (image) {
      image.style.opacity = '0';
      image.style.clipPath = 'inset(0 100% 0 0)';
      image.style.transition = 'none';
    }

    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(-50px)';
      content.style.transition = 'none';
    }
  });

  // Update on scroll with throttling for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateParallaxEffect();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial call to set proper state
  updateParallaxEffect();

  // Infinite scroll for reviews section
  const reviewsTrack = document.querySelector('.reviews-track');
  if (reviewsTrack) {
    // Clone all review cards and append them to create seamless infinite scroll
    const reviewCards = Array.from(reviewsTrack.children);
    reviewCards.forEach(card => {
      const clone = card.cloneNode(true);
      reviewsTrack.appendChild(clone);
    });

    // Update cloned cards with current language
    if (typeof updatePageLanguage === 'function') {
      updatePageLanguage();
    }
  }

});

// Mobile menu styles (injected)
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .main-nav {
      position: fixed;
      top: 64px;
      left: -100%;
      width: 100%;
      height: calc(100vh - 64px);
      background-color: var(--color-white);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
      transition: left 0.3s ease;
      z-index: 999;
    }

    .main-nav.active {
      left: 0;
    }

    .main-nav a {
      font-size: 24px;
    }

    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;
document.head.appendChild(style);
