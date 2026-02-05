// GRIPPED.PL - Cart Management (Local Storage)

// Initialize cart from localStorage
function initCart() {
  const cart = localStorage.getItem('gripped_cart');
  if (!cart) {
    localStorage.setItem('gripped_cart', JSON.stringify({ items: [], item_count: 0, total_price: 0 }));
  }
  return JSON.parse(localStorage.getItem('gripped_cart'));
}

// Get cart from localStorage
function getCart() {
  return initCart();
}

// Save cart to localStorage
function saveCart(cart) {
  // Recalculate totals
  cart.item_count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.total_price = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  localStorage.setItem('gripped_cart', JSON.stringify(cart));
  updateCartCount();
}

// Clear cart completely
function clearCart() {
  localStorage.setItem('gripped_cart', JSON.stringify({ items: [], item_count: 0, total_price: 0 }));
  updateCartCount();
  renderCart();
}

// Update cart count badge
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.item_count || 0;
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

// Add item to cart (using product object)
function addToCart(product) {
  const cart = getCart();

  // Check if item already exists
  const existingItem = cart.items.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      id: product.id,
      key: product.id, // Use id as key for removal
      product_title: product.name,
      variant_title: product.size || null,
      price: product.price * 100, // Convert to cents
      quantity: product.quantity || 1,
      image: product.image
    });
  }

  saveCart(cart);
  renderCart();

  // Show success message
  showToast(`${product.name} added to cart`, 'View Cart', openCartDrawer);
}

// Remove item from cart (using line item key)
function removeFromCart(lineKey) {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.key !== lineKey);
  saveCart(cart);
  renderCart();
}

// Update item quantity (using line item key)
function updateQuantity(lineKey, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(lineKey);
    return;
  }

  const cart = getCart();
  const item = cart.items.find(item => item.key === lineKey);

  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCart();
  }
}

// Calculate subtotal
function calculateSubtotal(cart) {
  if (!cart || !cart.items) return 0;
  return cart.total_price / 100; // Convert from cents to dollars
}

// Fixed prices per currency (single item)
const CART_FIXED_PRICES = {
  USD: 15.9,
  PLN: 59,
  EUR: 14.9,
  GBP: 14.9,
  AUD: 15.9
};

// Base USD price for calculations
const CART_BASE_USD_PRICE = 15.9;

// Format price with currency - calculates based on quantity
function formatPrice(priceInUSD) {
  const symbol = localStorage.getItem('gripped_currency_symbol') || '$';
  const currency = localStorage.getItem('gripped_currency') || 'USD';

  // Ensure price is a number
  priceInUSD = parseFloat(priceInUSD) || 0;

  // Calculate quantity multiplier (how many items based on USD price)
  const quantity = priceInUSD / CART_BASE_USD_PRICE;

  // Get the fixed price for target currency and multiply by quantity
  const fixedPrice = CART_FIXED_PRICES[currency] || CART_FIXED_PRICES['USD'];
  const convertedPrice = fixedPrice * quantity;

  // Format for PLN (no decimals)
  if (currency === 'PLN') {
    return `${Math.round(convertedPrice)} ${symbol}`;
  }

  return `${symbol}${convertedPrice.toFixed(2)}`;
}

// Show toast notification
function showToast(message, actionText = null, actionCallback = null) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast';

  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;
  toast.appendChild(messageEl);

  if (actionText && actionCallback) {
    const actionEl = document.createElement('button');
    actionEl.className = 'toast-action';
    actionEl.textContent = actionText;
    actionEl.addEventListener('click', () => {
      actionCallback();
      toast.remove();
    });
    toast.appendChild(actionEl);
  }

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('active'), 10);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Render cart drawer
function renderCart() {
  const cart = getCart();
  const cartBody = document.querySelector('.cart-drawer-body');

  if (!cartBody) {
    console.error('Cart body not found!');
    return;
  }

  if (!cart.items || cart.items.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-drawer-empty">
        <div class="cart-empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3H4.5L6.5 13H16.5L18.5 6H6" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="8" cy="17" r="1" fill="currentColor"/>
            <circle cx="15" cy="17" r="1" fill="currentColor"/>
          </svg>
        </div>
        <p data-i18n="cart_empty">Your cart is empty</p>
        <button class="btn btn-primary" onclick="closeCartDrawer()" data-i18n="continue_shopping">Continue Shopping</button>
      </div>
    `;

    // Hide footer
    const footer = document.querySelector('.cart-drawer-footer');
    if (footer) footer.style.display = 'none';

  } else {
    const subtotal = calculateSubtotal(cart);

    cartBody.innerHTML = `
      <div class="cart-items-list">
        ${cart.items.map((item) => {
          const priceInDollars = item.price / 100; // Convert from cents
          const itemTotal = priceInDollars * item.quantity;
          return `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.product_title}">
              </div>
              <div class="cart-item-details">
                <div class="cart-item-header">
                  <h3 class="cart-item-name">${item.product_title}</h3>
                  <button class="cart-item-remove" onclick="removeFromCart('${item.key}')" aria-label="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                ${item.variant_title ? `<div class="cart-item-meta">${item.variant_title}</div>` : ''}
                <div class="cart-item-footer">
                  <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.key}', ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.key}', ${item.quantity + 1})" aria-label="Increase quantity">+</button>
                  </div>
                  <div class="cart-item-price" data-price="${itemTotal}">${formatPrice(itemTotal)}</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="cart-summary">
        <div class="cart-summary-row">
          <span data-i18n="subtotal">Subtotal</span>
          <span class="cart-summary-amount">${formatPrice(subtotal)}</span>
        </div>
        <div class="cart-summary-note" data-i18n="shipping_note">Shipping calculated at checkout</div>
      </div>
    `;

    // Show and update footer
    const footer = document.querySelector('.cart-drawer-footer');
    if (footer) {
      footer.style.display = 'block';
    }
  }

  // Re-apply translations after updating DOM
  if (typeof translatePage === 'function') {
    translatePage();
  }
}

// Ensure cart drawer HTML exists
function ensureCartDrawerExists() {
  if (!document.querySelector('.cart-drawer')) {
    const cartHTML = `
      <div class="cart-drawer-overlay" onclick="closeCartDrawer()"></div>
      <div class="cart-drawer">
        <div class="cart-drawer-header">
          <h2 data-i18n="cart_title">Shopping Cart</h2>
          <button class="cart-drawer-close" onclick="closeCartDrawer()" aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="cart-drawer-body"></div>
        <div class="cart-drawer-footer" style="display: none;">
          <button class="btn btn-primary cart-checkout-btn" onclick="alert('Checkout would proceed here')" data-i18n="checkout">Proceed to Checkout</button>
          <button class="btn btn-secondary cart-continue-btn" onclick="closeCartDrawer()" data-i18n="continue_shopping">Continue Shopping</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);

    // Apply translations after adding HTML
    if (typeof translatePage === 'function') {
      translatePage();
    }
  }
}

// Open cart drawer
function openCartDrawer() {
  ensureCartDrawerExists();

  const overlay = document.querySelector('.cart-drawer-overlay');
  const drawer = document.querySelector('.cart-drawer');

  if (overlay && drawer) {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
  }
}

// Close cart drawer
function closeCartDrawer() {
  const overlay = document.querySelector('.cart-drawer-overlay');
  const drawer = document.querySelector('.cart-drawer');

  if (overlay && drawer) {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart
  initCart();

  // Create cart drawer HTML if it doesn't exist
  ensureCartDrawerExists();

  // Update cart count on load
  updateCartCount();

  // Cart icon click handler
  const cartLinks = document.querySelectorAll('a[href*="/cart"], a[href*="#cart"], .cart-link');
  cartLinks.forEach(cartLink => {
    cartLink.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCartDrawer();
    }
  });
});

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.showToast = showToast;
window.clearCart = clearCart;
