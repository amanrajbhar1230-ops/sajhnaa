/* ============================================
   SHIVANI JEWELLERY — Products Module (v9)
   ============================================ */

import { db } from './firebase-config.js';
import { collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const ShivaniProducts = (() => {
  'use strict';

  // --- Fetch Products ---
  const fetchAll = async (constraints = []) => {
    try {
      const q = query(collection(db, "products"), ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Products fetch error:', e);
      return [];
    }
  };

  const getFeatured = () => fetchAll([where("featured", "==", true), limit(8)]);
  const getByCategory = (category) => fetchAll([where("category", "==", category)]);

  // --- Render Functions ---
  const renderGrid = (products, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (products.length === 0) {
      container.innerHTML = '<div class="text-center" style="grid-column:1/-1;padding:40px;color:var(--color-gray-500)">No products found in this category.</div>';
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="product-card animate-fade-in">
        <div class="product-card__image-wrapper">
          <img src="${p.image}" alt="${p.name}" class="product-card__image" loading="lazy">
          <div class="product-card__badges">
            ${p.originalPrice > p.price ? `<span class="badge badge-sale">-${Math.round((1 - p.price/p.originalPrice)*100)}%</span>` : ''}
            ${p.featured ? `<span class="badge badge-new">Featured</span>` : ''}
          </div>
          <button class="product-card__wishlist-btn" onclick="ShivaniWishlist.toggle('${p.id}')" title="Add to Wishlist">♡</button>
          <button class="product-card__quick-add" onclick="ShivaniCart.addItem('${p.id}')">+ Add to Cart</button>
        </div>
        <div class="product-card__content">
          <a href="pages/product-detail.html?id=${p.id}" class="product-card__category">${p.category}</a>
          <h3 class="product-card__title"><a href="pages/product-detail.html?id=${p.id}">${p.name}</a></h3>
          <div class="product-card__price">
            <span class="price-current">${ShivaniUtils.formatPrice(p.price)}</span>
            ${p.originalPrice > p.price ? `<span class="price-old">${ShivaniUtils.formatPrice(p.originalPrice)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  };

  return { fetchAll, getFeatured, getByCategory, renderGrid };
})();

export default ShivaniProducts;
