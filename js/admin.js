/* ============================================
   SHIVANI JEWELLERY — Admin Module (v9)
   Full Firestore v9 integration (Modular)
   ============================================ */

import { db, auth } from './firebase-config.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// --- Dashboard Stats Logic ---
const loadStats = async () => {
  try {
    const ordersSnap = await getDocs(collection(db, "orders"));
    const productsSnap = await getDocs(collection(db, "products"));
    
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
      { label: 'Admin Status', value: 'Active', icon: '🔑' }
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

    // Recent Orders Summary
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
      const recentSnap = await getDocs(q);
      const recentRecords = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderOrderTable(recentRecords, 'recentOrders');
    } catch(e) {
      console.error('Recent orders query failed (might need index):', e);
      const ordersSnapFallback = await getDocs(collection(db, "orders"));
      const fallbackRecords = ordersSnapFallback.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 5);
      renderOrderTable(fallbackRecords, 'recentOrders');
    }
    
  } catch (e) {
    console.error('Stats load error:', e);
  }
};

// --- Orders Management ---
const loadOrders = async () => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderOrderTable(orders, 'adminOrderTable');
  } catch (e) {
    console.warn('Orders fetch error with orderBy, falling back to all:', e);
    const snap = await getDocs(collection(db, "orders"));
    const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderOrderTable(orders, 'adminOrderTable');
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    ShivaniUtils.showToast(`Order status updated to ${newStatus}`, 'success');
    loadOrders(); // Refresh table
  } catch (e) {
    ShivaniUtils.showToast(e.message, 'error');
  }
};

const renderOrderTable = (orders, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--admin-text-muted)">No orders found</div>';
    return;
  }

  container.innerHTML = `
    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update Status</th>
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
              <td>${o.items?.length || 0}</td>
              <td style="color:var(--admin-gold);font-weight:600">${ShivaniUtils.formatPrice(o.total)}</td>
              <td><span class="admin-status status-${o.status}">${o.status}</span></td>
              <td>
                <select class="admin-select" style="padding:4px 8px;font-size:12px;width:auto" onchange="window.ShivaniAdmin.updateOrderStatus('${o.id}', this.value)">
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

// --- Products CRUD ---
const loadProducts = async () => {
  try {
    const snap = await getDocs(collection(db, "products"));
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProductTable(products);
  } catch (e) {
    console.error('Products fetch error:', e);
  }
};

const renderProductTable = (products) => {
  const container = document.getElementById('adminProductTable');
  if (!container) return;

  container.innerHTML = `
    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px"></td>
              <td style="font-weight:600;color:var(--admin-text-main)">${p.name}</td>
              <td>${p.category}</td>
              <td>${ShivaniUtils.formatPrice(p.price)}</td>
              <td>
                <div style="display:flex;gap:8px">
                  <button class="admin-btn admin-btn-outline" style="padding:4px 8px;font-size:12px" onclick="window.ShivaniAdmin.editProduct('${p.id}')">Edit</button>
                  <button class="admin-btn admin-btn-danger" style="padding:4px 8px;font-size:12px" onclick="window.ShivaniAdmin.deleteProduct('${p.id}')">Delete</button>
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
  const idValue = document.getElementById('prodId').value;
  const id = idValue || ShivaniUtils.generateId('PROD');
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
    const prodRef = doc(db, "products", id);
    await setDoc(prodRef, product, { merge: true });
    ShivaniUtils.showToast(idValue ? 'Product Updated' : 'Product Added', 'success');
    toggleModal('productModal');
    loadProducts();
  } catch (e) {
    ShivaniUtils.showToast(e.message, 'error');
  }
};

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await deleteDoc(doc(db, "products", id));
    ShivaniUtils.showToast('Product Deleted', 'success');
    loadProducts();
  } catch (e) {
    ShivaniUtils.showToast(e.message, 'error');
  }
};

const editProduct = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, "products", id));
    const p = docSnap.data();
    
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
  } catch (e) {
    ShivaniUtils.showToast('Error loading product data', 'error');
  }
};

const initAddProduct = () => {
  document.getElementById('productForm').reset();
  document.getElementById('prodId').value = '';
  document.getElementById('modalTitle').textContent = 'Add New Product';
  toggleModal('productModal');
};

const toggleModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.toggle('active');
};

const init = () => {
  if (!checkAuth()) return;
  const page = window.location.pathname.split('/').pop();
  if (page === 'index.html' || page === '') {
    loadStats();
  } else if (page === 'products.html') {
    loadProducts();
  } else if (page === 'orders.html') {
    loadOrders();
  }
};

// Global for accessibility
window.ShivaniAdmin = { 
  init, logout, updateOrderStatus, loadOrders, saveProduct, initAddProduct, toggleModal, editProduct, deleteProduct 
};

export { init, logout, updateOrderStatus, loadOrders, saveProduct, initAddProduct, toggleModal };
