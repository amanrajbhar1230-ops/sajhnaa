/* ============================================
   SHIVANI JEWELLERY — Admin Module
   ============================================ */

const ShivaniAdmin = (() => {
  'use strict';

  const init = () => {
    renderDashboard();
  };

  const renderDashboard = () => {
    const orders = ShivaniUtils.storage.get('shivaniOrders', []);
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const products = ShivaniProducts.getAll().length;

    // Stats
    const statsEl = document.getElementById('adminStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-card"><div class="stat-card__label">Total Revenue</div><div class="stat-card__value">${ShivaniUtils.formatPrice(totalRevenue)}</div><div class="stat-card__change">↑ All time</div></div>
        <div class="stat-card"><div class="stat-card__label">Total Orders</div><div class="stat-card__value">${totalOrders}</div></div>
        <div class="stat-card"><div class="stat-card__label">Pending Orders</div><div class="stat-card__value">${pendingOrders}</div></div>
        <div class="stat-card"><div class="stat-card__label">Products</div><div class="stat-card__value">${products}</div></div>
      `;
    }

    // Recent Orders
    const recentEl = document.getElementById('recentOrders');
    if (recentEl) {
      if (orders.length === 0) { recentEl.innerHTML = '<p style="padding:var(--space-4);color:var(--color-gray-500)">No orders yet</p>'; return; }
      recentEl.innerHTML = `<table class="data-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>
        ${orders.slice(0, 10).map(o => `<tr>
          <td style="font-weight:600">${o.id}</td>
          <td>${o.address?.fullName || 'Guest'}</td>
          <td>${ShivaniUtils.formatPrice(o.total)}</td>
          <td><span class="status-badge ${o.status}">${o.status}</span></td>
          <td>${ShivaniUtils.formatDate(o.createdAt)}</td>
        </tr>`).join('')}
      </tbody></table>`;
    }
  };

  /* ---- Admin Products ---- */
  const renderProducts = () => {
    const container = document.getElementById('adminProducts');
    if (!container) return;
    const products = ShivaniProducts.getAll();
    container.innerHTML = `<table class="data-table"><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
      ${products.map(p => `<tr>
        <td><img src="${p.images[0]}" style="width:40px;height:50px;border-radius:var(--radius-sm);object-fit:cover" alt="${p.name}"></td>
        <td style="font-weight:500">${ShivaniUtils.truncate(p.name, 30)}</td>
        <td>${p.category}</td>
        <td>${ShivaniUtils.formatPrice(p.salePrice || p.price)}</td>
        <td>${p.stock}</td>
        <td class="data-table__actions">
          <button class="data-table__action-btn" onclick="ShivaniAdmin.editProduct('${p.id}')" title="Edit">✏️</button>
          <button class="data-table__action-btn delete" onclick="ShivaniAdmin.deleteProduct('${p.id}')" title="Delete">🗑️</button>
        </td>
      </tr>`).join('')}
    </tbody></table>`;
  };

  /* ---- Admin Orders ---- */
  const renderOrders = () => {
    const container = document.getElementById('adminOrdersList');
    if (!container) return;
    const orders = ShivaniUtils.storage.get('shivaniOrders', []);
    if (orders.length === 0) { container.innerHTML = '<p style="padding:var(--space-4)">No orders</p>'; return; }
    container.innerHTML = `<table class="data-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      ${orders.map(o => `<tr>
        <td style="font-weight:600">${o.id}</td>
        <td>${o.address?.fullName || 'Guest'}<br><small style="color:var(--color-gray-400)">${o.address?.phone || ''}</small></td>
        <td>${o.items?.length || 0} items</td>
        <td>${ShivaniUtils.formatPrice(o.total)}</td>
        <td>${o.payment?.toUpperCase()}</td>
        <td><span class="status-badge ${o.status}">${o.status}</span></td>
        <td>
          <select onchange="ShivaniAdmin.updateOrderStatus('${o.id}', this.value)" style="padding:4px 8px;font-size:12px;border-radius:4px;border:1px solid var(--color-gray-200)">
            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="packed" ${o.status === 'packed' ? 'selected' : ''}>Packed</option>
            <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>`).join('')}
    </tbody></table>`;
  };

  const updateOrderStatus = (orderId, status) => {
    const orders = ShivaniUtils.storage.get('shivaniOrders', []);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      ShivaniUtils.storage.set('shivaniOrders', orders);
      ShivaniUtils.showToast(`Order ${orderId} updated to ${status}`);
    }
  };

  const editProduct = (id) => { ShivaniUtils.showToast('Edit product dialog (connect to Firestore for full CRUD)', 'info'); };
  const deleteProduct = (id) => { ShivaniUtils.showToast('Delete product (connect to Firestore for full CRUD)', 'info'); };

  return { init, renderDashboard, renderProducts, renderOrders, updateOrderStatus, editProduct, deleteProduct };
})();
