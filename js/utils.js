/* ============================================
   SHIVANI JEWELLERY — Utility Functions
   ============================================ */

const ShivaniUtils = (() => {
  'use strict';

  /* ---- Currency Formatting ---- */
  const formatPrice = (price) => {
    return '₹' + Number(price).toLocaleString('en-IN');
  };

  /* ---- Debounce ---- */
  const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /* ---- Toast Notifications ---- */
  const showToast = (message, type = 'success', duration = 3000) => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${icons[type] || icons.info}</span>
      <span class="toast__message">${message}</span>
      <span class="toast__close" onclick="this.parentElement.remove()">×</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  };

  /* ---- LocalStorage Helpers ---- */
  const storage = {
    get(key, fallback = null) {
      try { return JSON.parse(localStorage.getItem(key)) || fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) { localStorage.removeItem(key); }
  };

  /* ---- Recently Viewed ---- */
  const addRecentlyViewed = (product) => {
    let items = storage.get('recentlyViewed', []);
    items = items.filter(p => p.id !== product.id);
    items.unshift({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] || product.image });
    if (items.length > 10) items = items.slice(0, 10);
    storage.set('recentlyViewed', items);
  };

  const getRecentlyViewed = () => storage.get('recentlyViewed', []);

  /* ---- Generate Unique ID ---- */
  const generateId = (prefix = 'SJ') => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  /* ---- Lazy Image Loading ---- */
  const initLazyImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('animate-fade-in');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      images.forEach(img => observer.observe(img));
    } else {
      images.forEach(img => { img.src = img.dataset.src; });
    }
  };

  /* ---- Star HTML Helper ---- */
  const getStarsHTML = (rating, max = 5) => {
    let html = '<span class="stars">';
    for (let i = 1; i <= max; i++) {
      html += i <= Math.round(rating) ? '★' : '<span class="star-empty">★</span>';
    }
    html += '</span>';
    return html;
  };

  /* ---- Get URL Parameters ---- */
  const getParam = (key) => new URLSearchParams(window.location.search).get(key);

  /* ---- Scroll to Element ---- */
  const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ---- Date Formatting ---- */
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  /* ---- Truncate Text ---- */
  const truncate = (str, len = 50) => str.length > len ? str.substring(0, len) + '...' : str;

  /* ---- Button Loading State ---- */
  const setLoading = (btn, isLoading, loadingText = 'Processing...') => {
    if (!btn) return;
    if (isLoading) {
      btn.dataset.originalContent = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `
        <span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid;border-color:currentColor transparent transparent transparent;border-radius:50%;margin-right:8px;animation:spin 0.6s linear infinite"></span>
        ${loadingText}
      `;
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalContent || btn.innerHTML;
    }
  };

  return {
    formatPrice, debounce, showToast, storage,
    addRecentlyViewed, getRecentlyViewed, generateId,
    initLazyImages, getStarsHTML, getParam, scrollTo,
    formatDate, truncate, setLoading
  };
})();
