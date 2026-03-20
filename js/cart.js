/* ============================================
   SHIVANI JEWELLERY — Cart Module
   localStorage-based cart with Firestore sync
   ============================================ */

const ShivaniCart = (() => {
  'use strict';

  const STORAGE_KEY = 'shivaniCart';
  const COUPONS = {
    'SHIVANI10': { type: 'percent', value: 10, minOrder: 500 },
    'FLAT200':   { type: 'flat',    value: 200, minOrder: 1500 },
    'WELCOME15': { type: 'percent', value: 15, minOrder: 0 },
    'BRIDAL20':  { type: 'percent', value: 20, minOrder: 3000 }
  };

  let appliedCoupon = null;

  const getItems = () => ShivaniUtils.storage.get(STORAGE_KEY, []);
  const saveItems = (items) => ShivaniUtils.storage.set(STORAGE_KEY, items);

  /* ---- Add Item ---- */
  const addItem = (product, qty = 1) => {
    const items = getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock || 10);
    } else {
      items.push({
        id: product.id, name: product.name, price: product.salePrice || product.price,
        originalPrice: product.price, image: product.images?.[0] || product.image,
        qty: qty, stock: product.stock || 10
      });
    }
    saveItems(items);
    updateBadge();
    renderMiniCart();
    ShivaniUtils.showToast(`${ShivaniUtils.truncate(product.name, 30)} added to cart`);
  };

  /* ---- Remove Item ---- */
  const removeItem = (productId) => {
    let items = getItems().filter(i => i.id !== productId);
    saveItems(items);
    updateBadge();
    renderMiniCart();
    renderCartPage();
  };

  /* ---- Update Quantity ---- */
  const updateQty = (productId, qty) => {
    const items = getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, Math.min(qty, item.stock || 10));
      saveItems(items);
      updateBadge();
      renderMiniCart();
      renderCartPage();
    }
  };

  /* ---- Clear Cart ---- */
  const clearCart = () => {
    saveItems([]);
    appliedCoupon = null;
    updateBadge();
    renderMiniCart();
    renderCartPage();
  };

  /* ---- Get Totals ---- */
  const getTotals = () => {
    const items = getItems();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    let discount = 0;
    if (appliedCoupon && COUPONS[appliedCoupon]) {
      const coupon = COUPONS[appliedCoupon];
      if (subtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent' ? Math.round(subtotal * coupon.value / 100) : coupon.value;
      }
    }
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shipping;
    return { subtotal, discount, shipping, total, itemCount: items.reduce((s, i) => s + i.qty, 0) };
  };

  /* ---- Apply Coupon ---- */
  const applyCoupon = (code) => {
    const upper = code.toUpperCase().trim();
    if (!COUPONS[upper]) {
      ShivaniUtils.showToast('Invalid coupon code', 'error');
      return false;
    }
    const { subtotal } = getTotals();
    if (subtotal < COUPONS[upper].minOrder) {
      ShivaniUtils.showToast(`Min order ₹${COUPONS[upper].minOrder} required`, 'warning');
      return false;
    }
    appliedCoupon = upper;
    ShivaniUtils.showToast(`Coupon "${upper}" applied!`);
    renderCartPage();
    return true;
  };

  const removeCoupon = () => { appliedCoupon = null; renderCartPage(); };

  /* ---- Update Badge ---- */
  const updateBadge = () => {
    const { itemCount } = getTotals();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = itemCount;
      el.style.display = itemCount > 0 ? '' : 'none';
    });
  };

  /* ---- Render Mini Cart ---- */
  const renderMiniCart = () => {
    const container = document.getElementById('miniCartItems');
    if (!container) return;
    const items = getItems();
    const { subtotal } = getTotals();

    if (items.length === 0) {
      container.innerHTML = `<div class="mini-cart__empty"><div class="mini-cart__empty-icon">🛒</div><p>Your cart is empty</p></div>`;
      document.getElementById('miniCartSubtotal') && (document.getElementById('miniCartSubtotal').textContent = '₹0');
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="mini-cart__item">
        <img src="${item.image}" alt="${item.name}" class="mini-cart__item-image">
        <div class="mini-cart__item-info">
          <div class="mini-cart__item-name">${ShivaniUtils.truncate(item.name, 35)}</div>
          <div class="mini-cart__item-price">${ShivaniUtils.formatPrice(item.price)}</div>
          <div class="mini-cart__item-qty">
            <button class="mini-cart__qty-btn" onclick="ShivaniCart.updateQty('${item.id}', ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button class="mini-cart__qty-btn" onclick="ShivaniCart.updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
          <div class="mini-cart__item-remove" onclick="ShivaniCart.removeItem('${item.id}')">Remove</div>
        </div>
      </div>
    `).join('');

    document.getElementById('miniCartSubtotal') && (document.getElementById('miniCartSubtotal').textContent = ShivaniUtils.formatPrice(subtotal));
  };

  /* ---- Toggle Mini Cart ---- */
  const toggleMiniCart = () => {
    document.querySelector('.mini-cart')?.classList.toggle('active');
    document.querySelector('.mini-cart-overlay')?.classList.toggle('active');
    renderMiniCart();
  };

  /* ---- Render Full Cart Page ---- */
  const renderCartPage = () => {
    const container = document.getElementById('cartItems');
    if (!container) return;
    const items = getItems();
    const totals = getTotals();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🛒</div>
          <h3 class="empty-state__title">Your cart is empty</h3>
          <p class="empty-state__text">Looks like you haven't added anything yet</p>
          <a href="products.html" class="btn btn-primary">Start Shopping</a>
        </div>`;
      document.getElementById('cartSummary') && (document.getElementById('cartSummary').style.display = 'none');
      return;
    }

    document.getElementById('cartSummary') && (document.getElementById('cartSummary').style.display = '');
    container.innerHTML = items.map(item => `
      <div class="cart-item animate-fade-in">
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__variant">Qty: ${item.qty}</div>
          <div class="cart-item__bottom">
            <div class="qty-selector">
              <button class="qty-selector__btn" onclick="ShivaniCart.updateQty('${item.id}', ${item.qty - 1})">−</button>
              <span class="qty-selector__value">${item.qty}</span>
              <button class="qty-selector__btn" onclick="ShivaniCart.updateQty('${item.id}', ${item.qty + 1})">+</button>
            </div>
            <span class="cart-item__price">${ShivaniUtils.formatPrice(item.price * item.qty)}</span>
            <span class="cart-item__remove" onclick="ShivaniCart.removeItem('${item.id}')">Remove</span>
          </div>
        </div>
      </div>
    `).join('');

    // Update summary
    const summaryHTML = `
      <div class="cart-summary__row"><span>Subtotal</span><span>${ShivaniUtils.formatPrice(totals.subtotal)}</span></div>
      ${totals.discount > 0 ? `<div class="cart-summary__row discount"><span>Discount (${appliedCoupon})</span><span>-${ShivaniUtils.formatPrice(totals.discount)}</span></div>` : ''}
      <div class="cart-summary__row"><span>Shipping</span><span>${totals.shipping === 0 ? 'FREE' : ShivaniUtils.formatPrice(totals.shipping)}</span></div>
      <div class="cart-summary__row total"><span>Total</span><span>${ShivaniUtils.formatPrice(totals.total)}</span></div>
    `;
    document.getElementById('cartTotals') && (document.getElementById('cartTotals').innerHTML = summaryHTML);
  };

  return { getItems, addItem, removeItem, updateQty, clearCart, getTotals, applyCoupon, removeCoupon, updateBadge, renderMiniCart, toggleMiniCart, renderCartPage, appliedCoupon: () => appliedCoupon };
})();
