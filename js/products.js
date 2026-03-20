/* ============================================
   SHIVANI JEWELLERY — Products Module
   Product listing, filtering, sorting
   Sample data included for demo
   ============================================ */

const ShivaniProducts = (() => {
  'use strict';

  /* ---- Sample Product Data ---- */
  const PRODUCTS = [
    { id: 'p001', name: 'Royal Kundan Choker Necklace Set', category: 'Necklaces', subcategory: 'Choker', price: 2999, salePrice: 1999, rating: 4.8, reviews: 124, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop'], material: 'Kundan, Alloy, Gold Plated', color: 'Gold', occasion: 'Bridal', badge: 'trending', stock: 8, description: 'Exquisite handcrafted Kundan choker set featuring intricate meenakari work. Perfect for weddings and traditional celebrations.' },
    { id: 'p002', name: 'Pearl Drop Jhumka Earrings', category: 'Earrings', subcategory: 'Jhumka', price: 899, salePrice: 599, rating: 4.6, reviews: 89, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop'], material: 'Pearl, Alloy, Rhodium Plated', color: 'White', occasion: 'Party', badge: 'sale', stock: 25, description: 'Elegant pearl drop jhumkas with delicate detailing. Lightweight and perfect for both casual and formal wear.' },
    { id: 'p003', name: 'Oxidized Silver Tribal Ring Set', category: 'Rings', subcategory: 'Statement', price: 499, salePrice: 349, rating: 4.3, reviews: 56, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop'], material: 'Oxidized Silver, Alloy', color: 'Silver', occasion: 'Casual', badge: 'new', stock: 40, description: 'Set of 5 boho-chic oxidized silver rings with tribal motifs. Adjustable sizes for perfect fit.' },
    { id: 'p004', name: 'Bridal Polki Diamond Necklace Set', category: 'Necklaces', subcategory: 'Bridal Set', price: 5999, salePrice: 4499, rating: 4.9, reviews: 201, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop'], material: 'Polki, Meenakari, Gold Plated', color: 'Gold', occasion: 'Bridal', badge: 'trending', stock: 3, description: 'Stunning bridal polki necklace set with matching earrings and maang tikka. Handcrafted masterpiece.' },
    { id: 'p005', name: 'Rose Gold Minimalist Bracelet', category: 'Bracelets', subcategory: 'Chain', price: 799, salePrice: null, rating: 4.5, reviews: 67, images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=500&fit=crop'], material: 'Stainless Steel, Rose Gold Plated', color: 'Rose Gold', occasion: 'Daily Wear', badge: null, stock: 50, description: 'Delicate rose gold chain bracelet with tiny crystal charm. Perfect everyday accessory.' },
    { id: 'p006', name: 'Chandbali Temple Earrings', category: 'Earrings', subcategory: 'Chandbali', price: 1299, salePrice: 999, rating: 4.7, reviews: 143, images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=500&fit=crop'], material: 'Alloy, Gold Plated, Stones', color: 'Gold', occasion: 'Party', badge: 'trending', stock: 15, description: 'Traditional chandbali earrings with goddess Lakshmi motif. Rich gold plating with gemstone accents.' },
    { id: 'p007', name: 'Diamond-Look CZ Solitaire Ring', category: 'Rings', subcategory: 'Solitaire', price: 1499, salePrice: 1199, rating: 4.4, reviews: 78, images: ['https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=500&fit=crop'], material: 'Sterling Silver, CZ', color: 'Silver', occasion: 'Party', badge: 'new', stock: 30, description: 'Stunning CZ solitaire ring that rivals real diamonds. Sterling silver band with rhodium plating.' },
    { id: 'p008', name: 'Layered Gold Chain Necklace', category: 'Necklaces', subcategory: 'Layered', price: 1799, salePrice: 1399, rating: 4.6, reviews: 95, images: ['https://images.unsplash.com/photo-1515562141589-67f0d7dbe3c5?w=400&h=500&fit=crop'], material: 'Alloy, 18K Gold Plated', color: 'Gold', occasion: 'Party', badge: 'sale', stock: 20, description: 'Trendy 3-layer gold chain necklace with coin and bar pendants.' },
    { id: 'p009', name: 'Emerald Green Statement Necklace', category: 'Necklaces', subcategory: 'Statement', price: 2499, salePrice: 1899, rating: 4.8, reviews: 112, images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=500&fit=crop'], material: 'Alloy, CZ, Green Stones', color: 'Green', occasion: 'Party', badge: 'trending', stock: 12, description: 'Gorgeous emerald green statement necklace with CZ accents. Perfect for evening events.' },
    { id: 'p010', name: 'Silver Anklet with Ghungroo', category: 'Anklets', subcategory: 'Traditional', price: 599, salePrice: 449, rating: 4.2, reviews: 45, images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=500&fit=crop'], material: 'German Silver', color: 'Silver', occasion: 'Daily Wear', badge: null, stock: 60, description: 'Traditional silver anklet with tiny ghungroo bells. Musical and beautiful.' },
    { id: 'p011', name: 'Bridal Maang Tikka & Earring Set', category: 'Bridal', subcategory: 'Maang Tikka', price: 3499, salePrice: 2799, rating: 4.9, reviews: 88, images: ['https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=500&fit=crop'], material: 'Kundan, Pearls, Gold Plated', color: 'Gold', occasion: 'Bridal', badge: 'trending', stock: 5, description: 'Breathtaking bridal maang tikka set with kundan stones and pearl drops.' },
    { id: 'p012', name: 'Boho Tassel Drop Earrings', category: 'Earrings', subcategory: 'Drop', price: 399, salePrice: 299, rating: 4.1, reviews: 34, images: ['https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=500&fit=crop'], material: 'Thread, Alloy', color: 'Multi', occasion: 'Casual', badge: 'sale', stock: 45, description: 'Colorful tassel earrings perfect for festivals and casual outings.' },
  ];

  const CATEGORIES = ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Bridal'];
  const OCCASIONS = ['Bridal', 'Party', 'Casual', 'Daily Wear'];
  const COLORS = ['Gold', 'Silver', 'Rose Gold', 'White', 'Green', 'Multi'];

  let currentFilters = { categories: [], occasions: [], colors: [], priceRange: [0, 10000], rating: 0 };
  let currentSort = 'featured';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 12;

  const getAll = () => PRODUCTS;

  const getById = (id) => PRODUCTS.find(p => p.id === id);

  const getByCategory = (cat) => PRODUCTS.filter(p => p.category === cat || p.subcategory === cat);

  const getTrending = () => PRODUCTS.filter(p => p.badge === 'trending').slice(0, 8);

  const getNewArrivals = () => PRODUCTS.filter(p => p.badge === 'new').slice(0, 8);

  const getRelated = (product, limit = 4) => PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, limit);

  /* ---- Filter & Sort ---- */
  const getFiltered = () => {
    let items = [...PRODUCTS];
    const f = currentFilters;
    if (f.categories.length) items = items.filter(p => f.categories.includes(p.category));
    if (f.occasions.length) items = items.filter(p => f.occasions.includes(p.occasion));
    if (f.colors.length) items = items.filter(p => f.colors.includes(p.color));
    if (f.rating > 0) items = items.filter(p => p.rating >= f.rating);
    items = items.filter(p => {
      const price = p.salePrice || p.price;
      return price >= f.priceRange[0] && price <= f.priceRange[1];
    });
    // Sort
    switch (currentSort) {
      case 'price-low': items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case 'price-high': items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case 'newest': items.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break;
      case 'rating': items.sort((a, b) => b.rating - a.rating); break;
      case 'bestselling': items.sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }
    return items;
  };

  const setFilters = (filters) => { currentFilters = { ...currentFilters, ...filters }; currentPage = 1; };
  const setSort = (sort) => { currentSort = sort; currentPage = 1; };
  const setPage = (page) => { currentPage = page; };

  /* ---- Search ---- */
  const search = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.occasion.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    );
  };

  /* ---- Render Product Card ---- */
  const renderCard = (product) => {
    const price = product.salePrice || product.price;
    const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
    const inWishlist = ShivaniWishlist.isInWishlist(product.id);
    const isLowStock = product.stock <= 5;
    const isOutOfStock = product.stock <= 0;

    return `
      <div class="product-card animate-fade-in">
        <div class="product-card__image-wrapper">
          <a href="product-detail.html?id=${product.id}">
            <img data-src="${product.images[0]}" alt="${product.name}" class="product-card__image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23F7F3ED'/%3E%3C/svg%3E">
          </a>
          ${product.badge ? `<div class="product-card__badges"><span class="badge badge-${product.badge}">${product.badge}</span></div>` : ''}
          ${isOutOfStock ? '<div class="product-card__badges"><span class="badge badge-out">Out of Stock</span></div>' : ''}
          <div class="product-card__actions">
            <button class="product-card__action-btn ${inWishlist ? 'active' : ''}" data-wishlist-btn="${product.id}" onclick="ShivaniWishlist.toggle(ShivaniProducts.getById('${product.id}'))" title="Wishlist">${inWishlist ? '♥' : '♡'}</button>
          </div>
          ${!isOutOfStock ? `<div class="product-card__quick-add"><button class="btn btn-primary btn-sm btn-full" onclick="ShivaniCart.addItem(ShivaniProducts.getById('${product.id}'))">Add to Cart</button></div>` : ''}
        </div>
        <div class="product-card__body">
          <div class="product-card__category">${product.category}</div>
          <div class="product-card__title"><a href="product-detail.html?id=${product.id}">${product.name}</a></div>
          <div class="product-card__rating">${ShivaniUtils.getStarsHTML(product.rating)} <span class="product-card__rating-count">(${product.reviews})</span></div>
          <div class="product-card__price">
            <span class="product-card__current-price">${ShivaniUtils.formatPrice(price)}</span>
            ${discount > 0 ? `<span class="product-card__original-price">${ShivaniUtils.formatPrice(product.price)}</span><span class="product-card__discount">${discount}% off</span>` : ''}
          </div>
          ${isLowStock && !isOutOfStock ? `<div style="font-size:0.7rem;color:var(--color-warning);margin-top:4px">⚡ Only ${product.stock} left!</div>` : ''}
        </div>
      </div>`;
  };

  /* ---- Render Product Grid ---- */
  const renderGrid = (containerId, products = null) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = products || getFiltered();
    const paged = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (paged.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🔍</div><h3 class="empty-state__title">No products found</h3><p class="empty-state__text">Try adjusting your filters</p></div>';
      return;
    }
    container.innerHTML = paged.map(p => renderCard(p)).join('');
    ShivaniUtils.initLazyImages();

    // Update count
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = `${items.length} product${items.length !== 1 ? 's' : ''}`;
  };

  return {
    getAll, getById, getByCategory, getTrending, getNewArrivals, getRelated,
    getFiltered, setFilters, setSort, setPage, search, renderCard, renderGrid,
    CATEGORIES, OCCASIONS, COLORS, currentFilters: () => currentFilters
  };
})();
