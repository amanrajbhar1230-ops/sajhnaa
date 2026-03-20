/* ============================================
   SHIVANI JEWELLERY — Products Module (v9)
   ============================================ */

import { db } from './firebase-config.js';
import { collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const ShivaniProducts = (() => {
  'use strict';

  // --- Sample Fallback Data (Ensures site never looks empty) ---
  const SAMPLE_PRODUCTS = [
    {
      id: 'FALLBACK_1',
      name: 'Royal Gold Plated Necklace',
      price: 1299,
      originalPrice: 2499,
      category: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      featured: true,
      description: 'Handcrafted royal gold plated necklace with intricate traditional patterns.'
    },
    {
      id: 'FALLBACK_2',
      name: 'Kundan Drop Earrings',
      price: 599,
      originalPrice: 999,
      category: 'Earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
      featured: true,
      description: 'Elegant Kundan drop earrings for weddings and special occasions.'
    },
    {
      id: 'FALLBACK_3',
      name: 'Crystal Studded Ring',
      price: 349,
      originalPrice: 699,
      category: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
      featured: true,
      description: 'Modern crystal studded ring for daily wear.'
    },
    {
      id: 'FALLBACK_4',
      name: 'Bridal Maang Tikka Set',
      price: 2499,
      originalPrice: 4500,
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400',
      featured: true,
      description: 'Complete heavy bridal set with Maang Tikka and matching earrings.'
    }
  ];

  // --- Fetch Products ---
  const fetchAll = async (constraints = []) => {
    try {
      const q = query(collection(db, "products"), ...constraints);
      const snap = await getDocs(q);
      const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fallback if DB is empty
      if (products.length === 0 && constraints.length === 0) {
        console.log("Using sample fallback products");
        return SAMPLE_PRODUCTS;
      }
      
      // Fallback for featured filter specifically
      if (products.length === 0 && constraints.length > 0) {
        return SAMPLE_PRODUCTS.filter(p => p.featured).slice(0, 4);
      }

      return products;
    } catch (e) {
      console.warn('Products fetch error (probably permissions):', e);
      return SAMPLE_PRODUCTS;
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
          <button class="product-card__quick-add" onclick="ShivaniCart.addItem(${JSON.stringify(p).replace(/"/g, '&quot;')})">+ Add to Cart</button>
        </div>
        <div class="product-card__content">
          <div class="product-card__category">${p.category}</div>
          <h3 class="product-card__title">${p.name}</h3>
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
