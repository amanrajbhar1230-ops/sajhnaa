/* ============================================
   SHIVANI JEWELLERY — Product Detail Module
   ============================================ */

const ShivaniProductDetail = (() => {
  'use strict';

  let activeImageIdx = 0;

  const init = () => {
    const productId = ShivaniUtils.getParam('id');
    if (!productId) { window.location.href = 'products.html'; return; }
    const product = ShivaniProducts.getById(productId);
    if (!product) { window.location.href = 'products.html'; return; }
    ShivaniUtils.addRecentlyViewed(product);
    renderProduct(product);
    renderReviews(product);
    renderRelated(product);
  };

  const renderProduct = (product) => {
    const price = product.salePrice || product.price;
    const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
    const inWishlist = ShivaniWishlist.isInWishlist(product.id);
    const stockClass = product.stock <= 0 ? 'out' : product.stock <= 5 ? 'low' : '';
    const stockText = product.stock <= 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock';

    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `<a href="../index.html">Home</a><span class="separator">›</span><a href="products.html?category=${product.category}">${product.category}</a><span class="separator">›</span><span class="current">${ShivaniUtils.truncate(product.name, 40)}</span>`;
    }

    // Gallery
    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
      mainImg.src = product.images[0];
      mainImg.alt = product.name;
      // Zoom on hover
      mainImg.parentElement.addEventListener('mousemove', (e) => {
        const rect = mainImg.parentElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
      });
    }

    // Thumbnails
    const thumbs = document.getElementById('thumbsContainer');
    if (thumbs) {
      // Use same image for demo with slight variations
      const images = [product.images[0], product.images[0], product.images[0]];
      thumbs.innerHTML = images.map((img, i) => `
        <div class="product-gallery__thumb ${i === 0 ? 'active' : ''}" onclick="ShivaniProductDetail.setActiveImage(${i}, '${img}')">
          <img src="${img}" alt="View ${i + 1}">
        </div>
      `).join('');
    }

    // Product Info
    const info = document.getElementById('productInfo');
    if (info) {
      info.innerHTML = `
        <div class="product-info__category">${product.category} / ${product.subcategory || ''}</div>
        <h1 class="product-info__title">${product.name}</h1>
        <div class="product-info__rating">${ShivaniUtils.getStarsHTML(product.rating)} <span class="product-info__rating-text">${product.rating} (${product.reviews} reviews)</span></div>
        <div class="product-info__price">
          <span class="product-info__current">${ShivaniUtils.formatPrice(price)}</span>
          ${discount > 0 ? `<span class="product-info__original">${ShivaniUtils.formatPrice(product.price)}</span><span class="product-info__discount">${discount}% off</span>` : ''}
        </div>
        <div class="product-info__stock ${stockClass}"><span class="product-info__stock-dot"></span> ${stockText}</div>
        <p class="product-info__description">${product.description}</p>
        <div class="product-info__meta">
          <div class="product-info__meta-item"><span class="product-info__meta-label">Material</span><span class="product-info__meta-value">${product.material}</span></div>
          <div class="product-info__meta-item"><span class="product-info__meta-label">Color</span><span class="product-info__meta-value">${product.color}</span></div>
          <div class="product-info__meta-item"><span class="product-info__meta-label">Occasion</span><span class="product-info__meta-value">${product.occasion}</span></div>
        </div>
        <div class="product-info__actions">
          <button class="btn btn-primary btn-lg" onclick="ShivaniCart.addItem(ShivaniProducts.getById('${product.id}'))" ${product.stock <= 0 ? 'disabled' : ''}>
            ${product.stock <= 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
          <button class="btn btn-secondary btn-lg product-info__wishlist-btn ${inWishlist ? 'active' : ''}" data-wishlist-btn="${product.id}" onclick="ShivaniWishlist.toggle(ShivaniProducts.getById('${product.id}'))">
            ${inWishlist ? '♥' : '♡'}
          </button>
        </div>
        <div style="display:flex;gap:var(--space-4);margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-gray-500)">
          <span>🚚 Free delivery on ₹999+</span>
          <span>↩️ Easy 7-day returns</span>
        </div>
      `;
    }

    document.title = `${product.name} — Shivani Jewellery`;
  };

  const setActiveImage = (idx, src) => {
    activeImageIdx = idx;
    const mainImg = document.getElementById('mainImage');
    if (mainImg) mainImg.src = src;
    document.querySelectorAll('.product-gallery__thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  };

  const renderReviews = (product) => {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    const sampleReviews = [
      { author: 'Priya S.', rating: 5, date: '2026-03-10', text: 'Absolutely beautiful! The quality exceeded my expectations. Got so many compliments at the wedding.' },
      { author: 'Meera R.', rating: 4, date: '2026-02-28', text: 'Lovely design and fast delivery. The gold plating is very rich. Only giving 4 stars because packaging could be better.' },
      { author: 'Ananya K.', rating: 5, date: '2026-02-15', text: 'Perfect for the price! Looks exactly like the pictures. Will definitely buy more from Shivani.' }
    ];
    container.innerHTML = `
      <div class="reviews-summary">
        <div class="reviews-summary__avg">
          <div class="reviews-summary__number">${product.rating}</div>
          <div>${ShivaniUtils.getStarsHTML(product.rating)}</div>
          <div class="reviews-summary__count">${product.reviews} reviews</div>
        </div>
      </div>
      ${sampleReviews.map(r => `
        <div class="review-item">
          <div class="review-item__header"><span class="review-item__author">${r.author} ${ShivaniUtils.getStarsHTML(r.rating)}</span><span class="review-item__date">${ShivaniUtils.formatDate(r.date)}</span></div>
          <p class="review-item__text">${r.text}</p>
        </div>
      `).join('')}
    `;
  };

  const renderRelated = (product) => {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    const related = ShivaniProducts.getRelated(product, 4);
    container.innerHTML = related.map(p => ShivaniProducts.renderCard(p)).join('');
    ShivaniUtils.initLazyImages();
  };

  return { init, setActiveImage };
})();
