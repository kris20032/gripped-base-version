// GRIPPED.PL - Cart Management (Shopify Integration)

// Get cart from Shopify
async function getCart() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart;
  } catch (e) {
    console.error('Error reading cart:', e);
    return { items: [], item_count: 0 };
  }
}

// Clear cart completely
async function clearCart() {
  try {
    await fetch('/cart/clear.js', { method: 'POST' });
    updateCartCount();
    renderCart();
  } catch (e) {
    console.error('Error clearing cart:', e);
  }
}

// Update cart count badge
async function updateCartCount() {
  const cart = await getCart();
  const totalItems = cart.item_count || 0;
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

// Add item to cart (using Shopify API)
async function addToCart(variantId, quantity = 1) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    });

    if (!response.ok) throw new Error('Failed to add to cart');

    await updateCartCount();
    return await response.json();
  } catch (e) {
    console.error('Error adding to cart:', e);
    throw e;
  }
}

// Remove item from cart (using line item key)
async function removeFromCart(lineKey) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: lineKey,
        quantity: 0
      })
    });

    if (!response.ok) throw new Error('Failed to remove from cart');

    await updateCartCount();
    await renderCart();
  } catch (e) {
    console.error('Error removing from cart:', e);
  }
}

// Update item quantity (using line item key)
async function updateQuantity(lineKey, newQuantity) {
  if (newQuantity < 1) return;

  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: lineKey,
        quantity: newQuantity
      })
    });

    if (!response.ok) throw new Error('Failed to update quantity');

    await updateCartCount();
    await renderCart();
  } catch (e) {
    console.error('Error updating quantity:', e);
  }
}

// Calculate subtotal
function calculateSubtotal(cart) {
  if (!cart || !cart.items) return 0;
  return cart.total_price / 100; // Shopify stores prices in cents
}

// Format price with currency
function formatPrice(price) {
  const symbol = localStorage.getItem('gripped_currency_symbol') || '$';
  const currency = localStorage.getItem('gripped_currency') || 'USD';

  // Ensure price is a number
  price = parseFloat(price) || 0;

  // Convert price if needed
  if (typeof convertPrice === 'function') {
    price = convertPrice(price, currency);
    price = parseFloat(price) || 0;
  }

  // Format for PLN (no decimals)
  if (currency === 'PLN') {
    return `${Math.round(price)} ${symbol}`;
  }

  return `${symbol}${price.toFixed(2)}`;
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
async function renderCart() {
  const cart = await getCart();
  const cartBody = document.querySelector('.cart-drawer-body');

  if (!cartBody) {
    console.error('Cart body not found!');
    return;
  }

  if (!cart.items || cart.items.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-drawer-empty">
        <p data-i18n="cart_empty">Your cart is empty</p>
        <button class="btn btn-primary" onclick="closeCartDrawer()" data-i18n="continue_shopping">Continue Shopping</button>
      </div>
    `;

    // Hide footer
    const footer = document.querySelector('.cart-drawer-footer');
    if (footer) footer.style.display = 'none';

  } else {
    cartBody.innerHTML = cart.items.map((item) => {
      const priceInDollars = item.price / 100; // Shopify uses cents
      return `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.product_title}">
          </div>
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.product_title}</h3>
            <div class="cart-item-meta">
              ${item.variant_title || ''}
            </div>
            <div class="cart-item-price" data-price="${priceInDollars}">${formatPrice(priceInDollars)}</div>
            <div class="cart-item-controls">
              <div class="cart-item-quantity">
                <button onclick="updateQuantity('${item.key}', ${item.quantity - 1})">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.key}', ${item.quantity + 1})">+</button>
              </div>
              <button class="cart-item-remove" onclick="removeFromCart('${item.key}')" data-i18n="remove">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Show and update footer
    const footer = document.querySelector('.cart-drawer-footer');
    if (footer) {
      footer.style.display = 'block';
      const subtotalAmount = footer.querySelector('.cart-subtotal-amount');
      if (subtotalAmount) {
        const subtotal = calculateSubtotal(cart);
        subtotalAmount.textContent = formatPrice(subtotal);
      }
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
          <h2 data-i18n="cart_title">Your Cart</h2>
          <button class="cart-drawer-close" onclick="closeCartDrawer()">&times;</button>
        </div>
        <div class="cart-drawer-body"></div>
        <div class="cart-drawer-footer" style="display: none;">
          <div class="cart-subtotal">
            <span class="cart-subtotal-label" data-i18n="subtotal">Subtotal</span>
            <span class="cart-subtotal-amount">$0.00</span>
          </div>
          <button class="btn btn-primary cart-checkout-btn" onclick="window.location.href='/checkout'" data-i18n="checkout">Checkout</button>
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
async function openCartDrawer() {
  ensureCartDrawerExists();

  const overlay = document.querySelector('.cart-drawer-overlay');
  const drawer = document.querySelector('.cart-drawer');

  if (overlay && drawer) {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    await renderCart();
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
  // Create cart drawer HTML if it doesn't exist
  ensureCartDrawerExists();

  // Update cart count on load
  updateCartCount();

  // Cart icon click handler
  const cartLinks = document.querySelectorAll('a[href*="/cart"], .cart-link');
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
