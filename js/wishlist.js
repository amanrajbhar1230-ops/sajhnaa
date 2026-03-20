/* ============================================
   SHIVANI JEWELLERY — Wishlist Module
   ============================================ */

const ShivaniWishlist = (() => {
  'use strict';
  const STORAGE_KEY = 'shivaniWishlist';

  const getItems = () => ShivaniUtils.storage.get(STORAGE_KEY, []);
  const saveItems = (items) => ShivaniUtils.storage.set(STORAGE_KEY, items);

  const toggle = (product) => {
    let items = getItems();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) {
      items.splice(idx, 1);
      ShivaniUtils.showToast('Removed from wishlist');
    } else {
      items.push({ id: product.id, name: product.name, price: product.salePrice || product.price, originalPrice: product.price, image: product.images?.[0] || product.image, category: product.category });
      ShivaniUtils.showToast('Added to wishlist ♡');
    }
    saveItems(items);
    updateBadge();
    updateButtons(product.id);
  };

  const remove = (productId) => {
    let items = getItems().filter(i => i.id !== productId);
    saveItems(items);
    updateBadge();
    renderWishlistPage();
  };

  const isInWishlist = (productId) => getItems().some(i => i.id === productId);

  const moveToCart = (productId) => {
    const item = getItems().find(i => i.id === productId);
    if (item) {
      ShivaniCart.addItem({ id: item.id, name: item.name, price: item.originalPrice, salePrice: item.price, image: item.image });
      remove(productId);
      ShivaniUtils.showToast('Moved to cart');
    }
  };

  const updateBadge = () => {
    const count = getItems().length;
    document.querySelectorAll('[data-wishlist-count]').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  };

  const updateButtons = (productId) => {
    const inWishlist = isInWishlist(productId);
    document.querySelectorAll(`[data-wishlist-btn="${productId}"]`).forEach(btn => {
      btn.classList.toggle('active', inWishlist);
      btn.innerHTML = inWishlist ? '♥' : '♡';
    });
  };

  const renderWishlistPage = () => {
    const container = document.getElementById('wishlistGrid');
    if (!container) return;
    const items = getItems();
    if (items.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">♡</div><h3 class="empty-state__title">Your wishlist is empty</h3><p class="empty-state__text">Save items you love for later</p><a href="products.html" class="btn btn-primary">Browse Collection</a></div>`;
      return;
    }
    container.innerHTML = items.map(item => `
      <div class="product-card animate-fade-in">
        <div class="product-card__image-wrapper">
          <img src="${item.image}" alt="${item.name}" class="product-card__image">
          <div class="product-card__actions" style="opacity:1;transform:none;">
            <button class="product-card__action-btn" onclick="ShivaniWishlist.remove('${item.id}')" title="Remove">✕</button>
          </div>
        </div>
        <div class="product-card__body">
          <div class="product-card__title">${item.name}</div>
          <div class="product-card__price">
            <span class="product-card__current-price">${ShivaniUtils.formatPrice(item.price)}</span>
            ${item.originalPrice > item.price ? `<span class="product-card__original-price">${ShivaniUtils.formatPrice(item.originalPrice)}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-sm btn-full" style="margin-top:var(--space-3)" onclick="ShivaniWishlist.moveToCart('${item.id}')">Move to Cart</button>
        </div>
      </div>
    `).join('');
  };

  return { toggle, remove, isInWishlist, moveToCart, updateBadge, updateButtons, getItems, renderWishlistPage };
})();
