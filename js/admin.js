/* ============================================
   SHIVANI JEWELLERY — Admin Module
   Full Firestore integration for Stats, Orders, Products
   ============================================ */

const ShivaniAdmin = (() => {
  'use strict';

  // --- Auth Check ---
  const checkAuth = () => {
    const session = localStorage.getItem('shivani_admin_session');
    if (!session || !session.startsWith('active_')) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem('shivani_admin_session');
    window.location.href = 'login.html';
  };

  // --- Stats Logic ---
  const loadStats = async () => {
    if (!ShivaniFirebase.isInitialized()) return;
    const db = ShivaniFirebase.getDb();
    
    try {
      const ordersSnap = await db.collection('orders').get();
      const productsSnap = await db.collection('products').get();
      
      const totalOrders = ordersSnap.size;
      const totalProducts = productsSnap.size;
      let totalRevenue = 0;
      
      ordersSnap.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'cancelled') {
          totalRevenue += (data.total || 0);
        }
      });

      const stats = [
        { label: 'Total Orders', value: totalOrders, icon: '📦' },
        { label: 'Total Revenue', value: ShivaniUtils.formatPrice(totalRevenue), icon: '💰' },
        { label: 'Total Products', value: totalProducts, icon: '💎' },
        { label: 'Active Sessions', value: '4', icon: '👤' }
      ];

      const container = document.getElementById('adminStats');
      if (container) {
        container.innerHTML = stats.map(s => `
          <div class="stat-card">
            <div class="stat-card__icon">${s.icon}</div>
            <div class="stat-card__label">${s.label}</div>
            <div class="stat-card__value">${s.value}</div>
          </div>
        `).join('');
      }

      // Recent Orders for Dashboard
      const recent = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      renderOrderTable(recent, 'recentOrders');
      
    } catch (e) {
      console.error('Stats load error:', e);
    }
  };

  // --- Orders Management ---
  const loadOrders = async () => {
    if (!ShivaniFirebase.isInitialized()) return;
    const db = ShivaniFirebase.getDb();
    
    try {
      const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
      const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderOrderTable(orders, 'adminOrderTable');
    } catch (e) {
      console.error('Orders load error:', e);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!ShivaniFirebase.isInitialized()) return;
    try {
      await ShivaniFirebase.getDb().collection('orders').doc(orderId).update({ status: newStatus });
      ShivaniUtils.showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders(); // Refresh
      loadStats();  // Refresh revenue if dashboard
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
    }
  };

  const renderOrderTable = (orders, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = '<div style="padding:24px;text-align:center;color:var(--admin-text-muted)">No orders found</div>';
      return;
    }

    container.innerHTML = `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td style="font-family:monospace;font-size:12px">${o.id}</td>
                <td>
                  <div style="font-weight:600;color:var(--admin-text-main)">${o.address?.fullName || 'Guest'}</div>
                  <div style="font-size:11px">${o.address?.phone || ''}</div>
                </td>
                <td>${o.items?.length || 0} items</td>
                <td style="color:var(--admin-gold);font-weight:600">${ShivaniUtils.formatPrice(o.total)}</td>
                <td><span class="admin-status status-${o.status}">${o.status}</span></td>
                <td>
                  <select class="admin-select" style="padding:4px 8px;font-size:12px;width:auto" onchange="ShivaniAdmin.updateOrderStatus('${o.id}', this.value)">
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  // --- Products Management ---
  const loadProducts = async () => {
    if (!ShivaniFirebase.isInitialized()) return;
    const db = ShivaniFirebase.getDb();
    
    try {
      const snap = await db.collection('products').get();
      const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderProductTable(products);
    } catch (e) {
      console.error('Products load error:', e);
    }
  };

  const renderProductTable = (products) => {
    const container = document.getElementById('adminProductTable');
    if (!container) return;

    container.innerHTML = `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px"></td>
                <td style="font-weight:600;color:var(--admin-text-main)">${p.name}</td>
                <td>${p.category}</td>
                <td>${ShivaniUtils.formatPrice(p.price)}</td>
                <td>${p.stock || 25}</td>
                <td>
                  <div style="display:flex;gap:8px">
                    <button class="admin-btn admin-btn-outline" style="padding:4px 8px;font-size:12px" onclick="ShivaniAdmin.editProduct('${p.id}')">Edit</button>
                    <button class="admin-btn admin-btn-danger" style="padding:4px 8px;font-size:12px" onclick="ShivaniAdmin.deleteProduct('${p.id}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!ShivaniFirebase.isInitialized()) return;
    
    const id = document.getElementById('prodId').value || ShivaniUtils.generateId('PROD');
    const product = {
      name: document.getElementById('prodName').value,
      price: parseFloat(document.getElementById('prodPrice').value),
      originalPrice: parseFloat(document.getElementById('prodOrigPrice').value),
      category: document.getElementById('prodCategory').value,
      image: document.getElementById('prodImage').value,
      description: document.getElementById('prodDesc').value,
      featured: document.getElementById('prodFeatured').checked,
      updatedAt: new Date().toISOString()
    };

    try {
      await ShivaniFirebase.getDb().collection('products').doc(id).set(product, { merge: true });
      ShivaniUtils.showToast(document.getElementById('prodId').value ? 'Product Updated' : 'Product Added', 'success');
      toggleModal('productModal');
      loadProducts();
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await ShivaniFirebase.getDb().collection('products').doc(id).delete();
      ShivaniUtils.showToast('Product Deleted', 'success');
      loadProducts();
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
    }
  };

  const editProduct = async (id) => {
    const doc = await ShivaniFirebase.getDb().collection('products').doc(id).get();
    const p = doc.data();
    
    document.getElementById('prodId').value = id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodOrigPrice').value = p.originalPrice;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodImage').value = p.image;
    document.getElementById('prodDesc').value = p.description;
    document.getElementById('prodFeatured').checked = p.featured;
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    toggleModal('productModal');
  };

  const initAddProduct = () => {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Product';
    toggleModal('productModal');
  };

  // --- Modal Toggle ---
  const toggleModal = (modalId) => {
    document.getElementById(modalId).classList.toggle('active');
  };

  // --- Global Init ---
  const init = () => {
    if (!checkAuth()) return;
    
    // Determine which page we are on
    const page = window.location.pathname.split('/').pop();
    
    if (page === 'index.html' || page === '') {
      loadStats();
    } else if (page === 'products.html') {
      loadProducts();
    } else if (page === 'orders.html') {
      loadOrders();
    }
  };

  return { init, logout, updateOrderStatus, deleteProduct, editProduct, initAddProduct, toggleModal, saveProduct };
})();
