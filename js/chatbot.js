/* ============================================
   SHIVANI JEWELLERY — AI Chatbot Module
   ============================================ */

const ShivaniChatbot = (() => {
  'use strict';

  let isOpen = false;
  const RESPONSES = {
    'hi': 'Hello! 💎 Welcome to Shivani Jewellery. How can I help you today?',
    'hello': 'Hi there! ✨ Looking for something special? I can help you find the perfect jewellery!',
    'help': 'I can help you with:\n• Finding jewellery by budget or occasion\n• Product recommendations\n• Order tracking\n• Return & exchange info\n• Delivery queries\n\nJust ask away!',
    'return': 'We offer easy 7-day returns! If you\'re not satisfied, just initiate a return from your orders page. Refund will be processed within 5 business days.',
    'delivery': 'We deliver across India! 🚚\n• Metro cities: 2-3 business days\n• Other cities: 4-5 business days\n• Free delivery on orders above ₹999',
    'exchange': 'Exchanges can be done within 7 days. Visit your orders page and select the item you want to exchange.',
    'cod': 'Yes! We accept Cash on Delivery (COD) for orders up to ₹5,000.',
    'payment': 'We accept:\n💵 Cash on Delivery\n📱 UPI (GPay, PhonePe, Paytm)\n💳 Credit/Debit Cards\n🏦 Net Banking',
    'track': 'You can track your order from the "My Orders" page. Just log in and click "Track Order" on your order.',
    'discount': 'Try these coupons:\n🎉 WELCOME15 — 15% off\n💰 SHIVANI10 — 10% off (min ₹500)\n🎁 FLAT200 — ₹200 off (min ₹1,500)\n👰 BRIDAL20 — 20% off (min ₹3,000)',
    'coupon': 'Try these coupons:\n🎉 WELCOME15 — 15% off\n💰 SHIVANI10 — 10% off (min ₹500)\n🎁 FLAT200 — ₹200 off (min ₹1,500)\n👰 BRIDAL20 — 20% off (min ₹3,000)',
    'bridal': 'Our bridal collection is stunning! 👰 We have:\n• Kundan necklace sets from ₹1,999\n• Polki sets from ₹4,499\n• Maang tikka sets from ₹2,799\n\nShall I show you our bridal bestsellers?',
    'wedding': 'Our bridal collection is stunning! 👰 Check out our Bridal category for gorgeous kundan, polki, and traditional sets.',
    'gift': 'Looking for a gift? 🎁 Our most popular gift picks:\n• Pearl earrings (₹599)\n• Rose gold bracelet (₹799)\n• Layered necklace (₹1,399)\n\nAll come in beautiful gift packaging!',
    'budget': 'Tell me your budget range and I\'ll find the perfect piece!\n• Under ₹500: Rings, anklets\n• ₹500-1,000: Earrings, bracelets\n• ₹1,000-3,000: Necklaces, sets\n• ₹3,000+: Bridal collections',
    'default': 'I\'m not sure I understand. Could you try asking about:\n• Products & recommendations\n• Orders & delivery\n• Returns & exchanges\n• Discounts & coupons\n\nOr type "help" for all options!'
  };

  const SUGGESTIONS = ['What\'s trending?', 'Bridal sets', 'Under ₹1000', 'Delivery info', 'Discount codes', 'Track order'];

  const init = () => {
    const toggle = document.querySelector('.chatbot-toggle');
    if (toggle) toggle.addEventListener('click', toggleChat);
  };

  const toggleChat = () => {
    isOpen = !isOpen;
    const chatbot = document.querySelector('.chatbot');
    if (chatbot) {
      chatbot.classList.toggle('active', isOpen);
      if (isOpen && chatbot.querySelector('.chatbot__messages').children.length === 0) {
        addBotMessage('Hello! 💎 Welcome to Shivani Jewellery. How can I help you today?');
        renderSuggestions();
      }
    }
    const toggle = document.querySelector('.chatbot-toggle');
    if (toggle) toggle.innerHTML = isOpen ? '✕' : '💬';
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const input = document.querySelector('.chatbot__input');
    if (input) input.value = '';
    addUserMessage(text);
    // Remove suggestions
    const suggestionsEl = document.querySelector('.chatbot__suggestions');
    if (suggestionsEl) suggestionsEl.innerHTML = '';
    // Process response
    setTimeout(() => {
      const response = getResponse(text);
      addBotMessage(response);
      setTimeout(renderSuggestions, 300);
    }, 500 + Math.random() * 500);
  };

  const getResponse = (input) => {
    const lower = input.toLowerCase().trim();
    // Check for budget queries
    const budgetMatch = lower.match(/(\d+)/);
    if (budgetMatch && (lower.includes('budget') || lower.includes('under') || lower.includes('below'))) {
      const budget = parseInt(budgetMatch[1]);
      const products = ShivaniProducts.getAll().filter(p => (p.salePrice || p.price) <= budget);
      if (products.length > 0) {
        return `Found ${products.length} items under ₹${budget}! 🎉\n\nTop picks:\n${products.slice(0, 3).map(p => `• ${p.name} — ${ShivaniUtils.formatPrice(p.salePrice || p.price)}`).join('\n')}\n\nBrowse all in our shop!`;
      }
      return `Sorry, we don\'t have items under ₹${budget} right now. Our most affordable items start at ₹299.`;
    }
    // Check for occasion queries
    const occasions = ['party', 'casual', 'daily', 'formal'];
    for (const occ of occasions) {
      if (lower.includes(occ)) {
        const products = ShivaniProducts.getAll().filter(p => p.occasion.toLowerCase().includes(occ));
        if (products.length > 0) {
          return `Great choice! Here are our ${occ} wear picks:\n${products.slice(0, 3).map(p => `• ${p.name} — ${ShivaniUtils.formatPrice(p.salePrice || p.price)}`).join('\n')}`;
        }
      }
    }
    // Check for trending
    if (lower.includes('trending') || lower.includes('popular') || lower.includes('best')) {
      const trending = ShivaniProducts.getTrending().slice(0, 3);
      return `🔥 Trending Now:\n${trending.map(p => `• ${p.name} — ${ShivaniUtils.formatPrice(p.salePrice || p.price)}`).join('\n')}\n\nThese are flying off the shelves!`;
    }
    // Check predefined
    for (const [key, val] of Object.entries(RESPONSES)) {
      if (key !== 'default' && lower.includes(key)) return val;
    }
    return RESPONSES.default;
  };

  const addBotMessage = (text) => {
    const messages = document.querySelector('.chatbot__messages');
    if (!messages) return;
    const msg = document.createElement('div');
    msg.className = 'chatbot__message chatbot__message--bot';
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  };

  const addUserMessage = (text) => {
    const messages = document.querySelector('.chatbot__messages');
    if (!messages) return;
    const msg = document.createElement('div');
    msg.className = 'chatbot__message chatbot__message--user';
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  };

  const renderSuggestions = () => {
    const container = document.querySelector('.chatbot__suggestions');
    if (!container) return;
    container.innerHTML = SUGGESTIONS.map(s => `<button class="chatbot__suggestion" onclick="ShivaniChatbot.sendMessage('${s}')">${s}</button>`).join('');
  };

  return { init, toggleChat, sendMessage };
})();
