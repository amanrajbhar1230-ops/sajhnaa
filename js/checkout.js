/* ============================================
   SHIVANI JEWELLERY — Checkout Module
   Multi-step checkout flow
   ============================================ */

const ShivaniCheckout = (() => {
  'use strict';

  let currentStep = 1;
  let orderData = { address: {}, payment: 'cod' };

  const init = () => {
    if (ShivaniCart.getItems().length === 0) {
      window.location.href = 'cart.html';
      return;
    }
    renderSteps();
    renderStep1();
    renderOrderSummary();
  };

  const renderSteps = () => {
    const stepsEl = document.getElementById('checkoutSteps');
    if (!stepsEl) return;
    const steps = ['Address', 'Payment', 'Review'];
    stepsEl.innerHTML = steps.map((s, i) => `
      <div class="step ${i + 1 < currentStep ? 'completed' : ''} ${i + 1 === currentStep ? 'active' : ''}">
        <span class="step__number">${i + 1 < currentStep ? '✓' : i + 1}</span>
        <span class="step__label">${s}</span>
      </div>
      ${i < steps.length - 1 ? `<div class="step__connector ${i + 1 < currentStep ? 'completed' : ''}"></div>` : ''}
    `).join('');
  };

  const goToStep = (step) => {
    if (step === 2 && !validateAddress()) return;
    currentStep = step;
    renderSteps();
    document.querySelectorAll('.checkout-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`)?.classList.add('active');
    window.scrollTo(0, 0);
  };

  const validateAddress = () => {
    const fields = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pincode'];
    let valid = true;
    fields.forEach(f => {
      const el = document.getElementById(f);
      if (!el || !el.value.trim()) { valid = false; el && (el.style.borderColor = 'var(--color-error)'); }
      else { el.style.borderColor = ''; }
    });
    if (!valid) ShivaniUtils.showToast('Please fill all required fields', 'error');
    else {
      orderData.address = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
      };
    }
    return valid;
  };

  const setPayment = (method) => {
    orderData.payment = method;
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`[data-payment="${method}"]`)?.classList.add('selected');
  };

  const renderStep1 = () => { /* Address form is static HTML */ };

  const renderOrderSummary = () => {
    const container = document.getElementById('checkoutSummary');
    if (!container) return;
    const items = ShivaniCart.getItems();
    const totals = ShivaniCart.getTotals();
    container.innerHTML = `
      <h3 class="cart-summary__title">Order Summary</h3>
      <div style="max-height:240px;overflow-y:auto;margin-bottom:var(--space-4)">
        ${items.map(i => `
          <div style="display:flex;gap:var(--space-3);padding:var(--space-3) 0;border-bottom:1px solid var(--color-gray-100)">
            <img src="${i.image}" style="width:48px;height:60px;border-radius:var(--radius-md);object-fit:cover">
            <div style="flex:1"><div style="font-size:var(--text-sm);font-weight:500">${ShivaniUtils.truncate(i.name, 30)}</div><div style="font-size:var(--text-xs);color:var(--color-gray-500)">Qty: ${i.qty}</div></div>
            <div style="font-weight:600;font-size:var(--text-sm)">${ShivaniUtils.formatPrice(i.price * i.qty)}</div>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary__row"><span>Subtotal</span><span>${ShivaniUtils.formatPrice(totals.subtotal)}</span></div>
      ${totals.discount > 0 ? `<div class="cart-summary__row discount"><span>Discount</span><span>-${ShivaniUtils.formatPrice(totals.discount)}</span></div>` : ''}
      <div class="cart-summary__row"><span>Shipping</span><span>${totals.shipping === 0 ? 'FREE' : ShivaniUtils.formatPrice(totals.shipping)}</span></div>
      <div class="cart-summary__row total"><span>Total</span><span>${ShivaniUtils.formatPrice(totals.total)}</span></div>
    `;
  };

  /* ---- Place Order ---- */
  const placeOrder = async () => {
    const items = ShivaniCart.getItems();
    const totals = ShivaniCart.getTotals();
    const orderId = ShivaniUtils.generateId('ORD');
    const order = {
      id: orderId,
      items: items,
      address: orderData.address,
      payment: orderData.payment,
      ...totals,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: ShivaniAuth.getUser()?.uid || 'guest'
    };

    // Save to localStorage (always works)
    const orders = ShivaniUtils.storage.get('shivaniOrders', []);
    orders.unshift(order);
    ShivaniUtils.storage.set('shivaniOrders', orders);

    // Save to Firestore if available
    if (ShivaniFirebase.isInitialized()) {
      try {
        await ShivaniFirebase.getDb().collection('orders').doc(orderId).set(order);
      } catch (e) { console.error('Firestore save error:', e); }
    }

    ShivaniCart.clearCart();
    window.location.href = `order-confirmation.html?id=${orderId}`;
  };

  const renderReviewStep = () => {
    const container = document.getElementById('reviewContent');
    if (!container) return;
    const a = orderData.address;
    container.innerHTML = `
      <div class="checkout-card">
        <h4 class="checkout-card__title">Delivery Address</h4>
        <p><strong>${a.fullName}</strong></p>
        <p>${a.address}, ${a.city}, ${a.state} - ${a.pincode}</p>
        <p>Phone: ${a.phone} | Email: ${a.email}</p>
      </div>
      <div class="checkout-card">
        <h4 class="checkout-card__title">Payment Method</h4>
        <p>${orderData.payment === 'cod' ? '💵 Cash on Delivery' : orderData.payment === 'upi' ? '📱 UPI' : '💳 Card'}</p>
      </div>
    `;
  };

  return { init, goToStep, setPayment, placeOrder, renderReviewStep };
})();
