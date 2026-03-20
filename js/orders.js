/* ============================================
   SHIVANI JEWELLERY — Orders Module
   ============================================ */

const ShivaniOrders = (() => {
  'use strict';

  const getOrders = () => ShivaniUtils.storage.get('shivaniOrders', []);

  const getById = (id) => getOrders().find(o => o.id === id);

  const cancelOrder = (orderId) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'pending') {
      order.status = 'cancelled';
      ShivaniUtils.storage.set('shivaniOrders', orders);
      ShivaniUtils.showToast('Order cancelled');
      renderOrdersPage();
      return true;
    }
    ShivaniUtils.showToast('Cannot cancel this order', 'error');
    return false;
  };

  const STATUS_FLOW = ['pending', 'packed', 'shipped', 'delivered'];
  const STATUS_LABELS = { pending: 'Order Placed', packed: 'Packed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

  const renderOrdersPage = () => {
    const container = document.getElementById('ordersList');
    if (!container) return;
    const orders = getOrders();
    if (orders.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📦</div><h3 class="empty-state__title">No orders yet</h3><p class="empty-state__text">Start shopping to see your orders here</p><a href="products.html" class="btn btn-primary">Shop Now</a></div>';
      return;
    }
    container.innerHTML = orders.map(order => `
      <div class="checkout-card" style="margin-bottom:var(--space-4)">
        <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-4)">
          <div>
            <div style="font-size:var(--text-sm);color:var(--color-gray-500)">Order ${order.id}</div>
            <div style="font-size:var(--text-xs);color:var(--color-gray-400)">${ShivaniUtils.formatDate(order.createdAt)}</div>
          </div>
          <span class="status-badge ${order.status}">${STATUS_LABELS[order.status]}</span>
        </div>
        <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-4)">
          ${order.items.map(i => `<img src="${i.image}" style="width:48px;height:60px;border-radius:var(--radius-md);object-fit:cover" alt="${i.name}" title="${i.name}">`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--space-2)">
          <span style="font-weight:600">${ShivaniUtils.formatPrice(order.total)}</span>
          <div style="display:flex;gap:var(--space-2)">
            <button class="btn btn-sm btn-ghost" onclick="ShivaniOrders.viewTracking('${order.id}')">Track Order</button>
            ${order.status === 'pending' ? `<button class="btn btn-sm btn-ghost" style="color:var(--color-error)" onclick="ShivaniOrders.cancelOrder('${order.id}')">Cancel</button>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  };

  const viewTracking = (orderId) => {
    const order = getById(orderId);
    if (!order) return;
    const statusIdx = order.status === 'cancelled' ? -1 : STATUS_FLOW.indexOf(order.status);
    const modal = document.getElementById('trackingModal');
    if (!modal) return;
    modal.querySelector('.modal__body').innerHTML = `
      <h4 style="margin-bottom:var(--space-4)">Order ${order.id}</h4>
      <div class="timeline">
        ${STATUS_FLOW.map((s, i) => `
          <div class="timeline__item ${i <= statusIdx ? 'completed' : ''} ${i === statusIdx ? 'active' : ''}">
            <div class="timeline__dot"></div>
            <div class="timeline__title">${STATUS_LABELS[s]}</div>
            <div class="timeline__date">${i <= statusIdx ? ShivaniUtils.formatDate(order.createdAt) : 'Pending'}</div>
          </div>
        `).join('')}
      </div>
      ${order.status === 'cancelled' ? '<div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-error-light);border-radius:var(--radius-md);font-size:var(--text-sm);color:var(--color-error)">This order has been cancelled.</div>' : ''}
    `;
    modal.querySelector('.modal-overlay').classList.add('active');
  };

  const renderConfirmation = () => {
    const orderId = ShivaniUtils.getParam('id');
    const container = document.getElementById('confirmationContent');
    if (!container || !orderId) return;
    const order = getById(orderId);
    if (!order) { container.innerHTML = '<p>Order not found</p>'; return; }
    container.innerHTML = `
      <div class="confirmation-card animate-scale-in">
        <div class="confirmation-card__icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <div class="confirmation-card__order-id">Order ID: ${order.id}</div>
        <p>Thank you for shopping with Shivani Jewellery! Your order will be processed shortly.</p>
        <p style="font-size:var(--text-sm)">Total: <strong>${ShivaniUtils.formatPrice(order.total)}</strong> | Payment: ${order.payment.toUpperCase()}</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-6)">
          <a href="orders.html" class="btn btn-primary">View Orders</a>
          <a href="products.html" class="btn btn-secondary">Continue Shopping</a>
        </div>
      </div>
    `;
  };

  return { getOrders, getById, cancelOrder, renderOrdersPage, viewTracking, renderConfirmation };
})();
