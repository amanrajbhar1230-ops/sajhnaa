/* ============================================
   SHIVANI JEWELLERY — Main App Initialization
   Global header/footer, mobile menu, auth state
   ============================================ */

const ShivaniApp = (() => {
  'use strict';

  const isSubPage = window.location.pathname.includes('/pages/');
  const prefix = isSubPage ? '../' : '';

  /* ---- Inject Header ---- */
  const renderHeader = () => {
    const headerEl = document.getElementById('siteHeader');
    if (!headerEl) return;
    headerEl.innerHTML = `
    <div class="top-bar">✨ Free Shipping on orders above ₹999 | Use code <strong>WELCOME15</strong> for 15% off ✨</div>
    <header class="header" id="mainHeader">
      <div class="header__inner">
        <div class="header__hamburger" id="hamburgerBtn" onclick="ShivaniApp.toggleMobileMenu()">
          <span></span><span></span><span></span>
        </div>
        <a href="${prefix}index.html" class="header__logo">
          <span class="header__logo-accent">✦</span> SHIVANI
        </a>
        <nav class="header__nav">
          <a href="${prefix}index.html" class="header__nav-link active">Home</a>
          <div class="nav-dropdown">
            <a href="${prefix}pages/products.html" class="header__nav-link">Shop ▾</a>
            <div class="nav-dropdown__menu">
              <a href="${prefix}pages/products.html?category=Necklaces" class="nav-dropdown__item">Necklaces</a>
              <a href="${prefix}pages/products.html?category=Earrings" class="nav-dropdown__item">Earrings</a>
              <a href="${prefix}pages/products.html?category=Rings" class="nav-dropdown__item">Rings</a>
              <a href="${prefix}pages/products.html?category=Bracelets" class="nav-dropdown__item">Bracelets</a>
              <a href="${prefix}pages/products.html?category=Bridal" class="nav-dropdown__item">Bridal</a>
              <a href="${prefix}pages/products.html?category=Anklets" class="nav-dropdown__item">Anklets</a>
            </div>
          </div>
          <a href="${prefix}pages/products.html?filter=trending" class="header__nav-link">Trending</a>
          <a href="${prefix}pages/products.html?filter=new" class="header__nav-link">New Arrivals</a>
          <a href="${prefix}pages/contact.html" class="header__nav-link">Contact</a>
        </nav>
        <div class="header__search" style="position:relative">
          <span class="header__search-icon">🔍</span>
          <input type="text" class="header__search-input" placeholder="Search jewellery..." data-search-input>
        </div>
        <div class="header__actions">
          <a href="${prefix}pages/search.html" class="header__action-btn" style="display:none" id="mobileSearchBtn">🔍</a>
          <a href="${prefix}pages/wishlist.html" class="header__action-btn" title="Wishlist">♡ <span class="header__action-badge" data-wishlist-count style="display:none">0</span></a>
          <button class="header__action-btn" title="Cart" onclick="ShivaniCart.toggleMiniCart()">🛒 <span class="header__action-badge" data-cart-count style="display:none">0</span></button>
          <a href="${prefix}pages/login.html" class="header__action-btn" data-auth="logged-out" title="Login">👤</a>
          <div class="nav-dropdown" data-auth="logged-in" style="display:none">
            <button class="header__action-btn">👤</button>
            <div class="nav-dropdown__menu" style="right:0;left:auto">
              <span class="nav-dropdown__item" style="font-weight:600;color:var(--color-gray-800)" data-user-name>User</span>
              <a href="${prefix}pages/orders.html" class="nav-dropdown__item">My Orders</a>
              <a href="${prefix}pages/wishlist.html" class="nav-dropdown__item">Wishlist</a>
              <a href="#" class="nav-dropdown__item" onclick="ShivaniAuth.signOut();return false;" style="color:var(--color-error)">Sign Out</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <div class="mobile-menu__search">
        <span>🔍</span>
        <input type="text" placeholder="Search..." data-search-input>
      </div>
      <a href="${prefix}index.html" class="mobile-menu__link">Home</a>
      <a href="${prefix}pages/products.html" class="mobile-menu__link">Shop All</a>
      <a href="${prefix}pages/products.html?category=Necklaces" class="mobile-menu__link">Necklaces</a>
      <a href="${prefix}pages/products.html?category=Earrings" class="mobile-menu__link">Earrings</a>
      <a href="${prefix}pages/products.html?category=Rings" class="mobile-menu__link">Rings</a>
      <a href="${prefix}pages/products.html?category=Bridal" class="mobile-menu__link">Bridal</a>
      <a href="${prefix}pages/products.html?filter=trending" class="mobile-menu__link">Trending</a>
      <a href="${prefix}pages/contact.html" class="mobile-menu__link">Contact</a>
      <div class="mobile-menu__actions">
        <a href="${prefix}pages/login.html" class="btn btn-primary btn-sm" data-auth="logged-out">Sign In</a>
        <a href="${prefix}pages/orders.html" class="btn btn-secondary btn-sm" data-auth="logged-in" style="display:none">My Orders</a>
      </div>
    </div>

    <!-- Mini Cart Sidebar -->
    <div class="mini-cart-overlay" onclick="ShivaniCart.toggleMiniCart()"></div>
    <div class="mini-cart">
      <div class="mini-cart__header">
        <span class="mini-cart__title">Shopping Cart</span>
        <span class="mini-cart__count" data-cart-count>0</span>
        <button onclick="ShivaniCart.toggleMiniCart()" style="font-size:var(--text-xl)">✕</button>
      </div>
      <div class="mini-cart__items" id="miniCartItems"></div>
      <div class="mini-cart__footer">
        <div class="mini-cart__subtotal"><span>Subtotal</span><span id="miniCartSubtotal">₹0</span></div>
        <a href="${prefix}pages/cart.html" class="btn btn-primary">View Cart</a>
        <a href="${prefix}pages/checkout.html" class="btn btn-secondary">Checkout</a>
      </div>
    </div>
    `;
  };

  /* ---- Inject Footer ---- */
  const renderFooter = () => {
    const footerEl = document.getElementById('siteFooter');
    if (!footerEl) return;
    footerEl.innerHTML = `
    <footer class="footer">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo"><span class="footer__logo-accent">✦</span> SHIVANI</span>
          <p class="footer__desc">Discover handcrafted artificial jewellery that celebrates the beauty of Indian craftsmanship. Premium quality, affordable luxury.</p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" title="Instagram">📷</a>
            <a href="#" class="footer__social-link" title="Facebook">📘</a>
            <a href="#" class="footer__social-link" title="WhatsApp">💬</a>
            <a href="#" class="footer__social-link" title="YouTube">📺</a>
          </div>
        </div>
        <div>
          <h4 class="footer__heading">Quick Links</h4>
          <div class="footer__links">
            <a href="${prefix}pages/products.html" class="footer__link">Shop All</a>
            <a href="${prefix}pages/products.html?filter=new" class="footer__link">New Arrivals</a>
            <a href="${prefix}pages/products.html?filter=trending" class="footer__link">Trending</a>
            <a href="${prefix}pages/products.html?category=Bridal" class="footer__link">Bridal</a>
          </div>
        </div>
        <div>
          <h4 class="footer__heading">Help</h4>
          <div class="footer__links">
            <a href="${prefix}pages/delivery.html" class="footer__link">Delivery Info</a>
            <a href="${prefix}pages/faq.html" class="footer__link">FAQs</a>
            <a href="${prefix}pages/contact.html" class="footer__link">Contact Us</a>
            <a href="${prefix}pages/orders.html" class="footer__link">Track Order</a>
          </div>
        </div>
        <div>
          <h4 class="footer__heading">Newsletter</h4>
          <p style="font-size:var(--text-sm);color:var(--color-gray-400);margin-bottom:var(--space-4)">Get exclusive offers & new arrivals straight to your inbox.</p>
          <form class="footer__newsletter-form" onsubmit="event.preventDefault();ShivaniUtils.showToast('Subscribed! 🎉');">
            <input type="email" placeholder="Your email" required>
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copyright">© 2026 Shivani Jewellery. All rights reserved. Made with ♡ in India</p>
        <div class="footer__payment"><span>💳 Cards</span><span>📱 UPI</span><span>💵 COD</span></div>
      </div>
    </footer>
    `;
  };

  /* ---- Inject Chatbot ---- */
  const renderChatbot = () => {
    const existing = document.querySelector('.chatbot-toggle');
    if (existing) return;
    const chatHTML = `
    <button class="chatbot-toggle">💬</button>
    <div class="chatbot">
      <div class="chatbot__header">
        <div class="chatbot__header-info">
          <div class="chatbot__avatar">💎</div>
          <div><div class="chatbot__name">Shivani Assistant</div><div class="chatbot__status">● Online</div></div>
        </div>
        <button onclick="ShivaniChatbot.toggleChat()" style="color:white;font-size:var(--text-xl)">✕</button>
      </div>
      <div class="chatbot__messages"></div>
      <div class="chatbot__suggestions"></div>
      <div class="chatbot__input-area">
        <input type="text" class="chatbot__input" placeholder="Type a message..." onkeydown="if(event.key==='Enter')ShivaniChatbot.sendMessage(this.value)">
        <button class="chatbot__send" onclick="ShivaniChatbot.sendMessage(document.querySelector('.chatbot__input').value)">→</button>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
  };

  /* ---- Mobile Menu Toggle ---- */
  const toggleMobileMenu = () => {
    document.getElementById('hamburgerBtn')?.classList.toggle('active');
    document.getElementById('mobileMenu')?.classList.toggle('active');
    document.body.style.overflow = document.getElementById('mobileMenu')?.classList.contains('active') ? 'hidden' : '';
  };

  /* ---- Sticky Header ---- */
  const initStickyHeader = () => {
    window.addEventListener('scroll', () => {
      document.getElementById('mainHeader')?.classList.toggle('scrolled', window.scrollY > 50);
    });
  };

  /* ---- Global Init ---- */
  const init = () => {
    renderHeader();
    renderFooter();
    renderChatbot();
    ShivaniFirebase.init();
    ShivaniAuth.init();
    ShivaniCart.updateBadge();
    ShivaniWishlist.updateBadge();
    ShivaniSearch.init();
    ShivaniChatbot.init();
    initStickyHeader();
    ShivaniUtils.initLazyImages();
  };

  return { init, toggleMobileMenu };
})();

/* ---- Auto Init on DOM Ready ---- */
document.addEventListener('DOMContentLoaded', ShivaniApp.init);
