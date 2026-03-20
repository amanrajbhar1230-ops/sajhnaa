/* ============================================
   SHIVANI JEWELLERY — Search Module
   ============================================ */

const ShivaniSearch = (() => {
  'use strict';

  const init = () => {
    const searchInputs = document.querySelectorAll('[data-search-input]');
    searchInputs.forEach(input => {
      input.addEventListener('input', ShivaniUtils.debounce((e) => {
        showSuggestions(e.target.value, input.closest('.header__search') || input.parentElement);
      }, 200));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          goToSearch(input.value);
        }
      });
    });
  };

  const showSuggestions = (query, parent) => {
    let dropdown = parent.querySelector('.search-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      parent.style.position = 'relative';
      parent.appendChild(dropdown);
    }
    if (query.length < 2) { dropdown.classList.remove('active'); return; }
    const results = ShivaniProducts.search(query).slice(0, 6);
    if (results.length === 0) {
      dropdown.innerHTML = '<div style="padding:var(--space-4);text-align:center;font-size:var(--text-sm);color:var(--color-gray-400)">No results found</div>';
    } else {
      dropdown.innerHTML = results.map(p => `
        <a href="${window.location.pathname.includes('pages') ? '' : 'pages/'}product-detail.html?id=${p.id}" class="search-dropdown__item">
          <img src="${p.images[0]}" alt="${p.name}" class="search-dropdown__item-img">
          <div><div class="search-dropdown__item-name">${p.name}</div><div class="search-dropdown__item-price">${ShivaniUtils.formatPrice(p.salePrice || p.price)}</div></div>
        </a>
      `).join('');
    }
    dropdown.classList.add('active');
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) dropdown.classList.remove('active');
    }, { once: true });
  };

  const goToSearch = (query) => {
    if (query.trim()) {
      const prefix = window.location.pathname.includes('pages') ? '' : 'pages/';
      window.location.href = `${prefix}search.html?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const renderSearchResults = () => {
    const query = ShivaniUtils.getParam('q');
    if (!query) return;
    document.getElementById('searchQuery') && (document.getElementById('searchQuery').textContent = query);
    const results = ShivaniProducts.search(query);
    ShivaniProducts.renderGrid('searchResults', results);
  };

  return { init, goToSearch, renderSearchResults };
})();
