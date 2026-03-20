# ✦ Shivani Jewellery — E-commerce Website

Premium artificial jewellery e-commerce platform built with HTML5, CSS3, Vanilla JavaScript, and Firebase.

## 🚀 Quick Start (Run Locally)

**Option 1: VS Code Live Server**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Open the project folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

**Option 2: Python HTTP Server**
```bash
cd shivani
python -m http.server 8080
```
Open http://localhost:8080 in your browser.

**Option 3: Node.js**
```bash
npx serve .
```

> The website works in **offline demo mode** without Firebase. All features (cart, wishlist, checkout, orders) use localStorage for persistence.

---

## 🔥 Firebase Setup (Optional — for full backend)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `shivani-jewellery`)
3. Enable **Authentication** → Email/Password + Google
4. Enable **Cloud Firestore** → Start in production mode
5. Enable **Storage** (for product images)

### 2. Add Firebase Config
Copy your project's config from **Project Settings → General → Your apps → Web app** and paste into `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "shivani-jewellery.firebaseapp.com",
  projectId: "shivani-jewellery",
  storageBucket: "shivani-jewellery.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Add Firebase SDK (add to all HTML files before your scripts)
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
```

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Create Admin User
In Firestore, create a document in `users` collection:
- Document ID: your Firebase Auth UID
- Fields: `{ role: "admin", name: "Admin", email: "admin@shivani.com" }`

---

---

## 🌐 Deploy to Firebase Hosting

```bash
# Login to Firebase
firebase login

# Deploy
npx firebase deploy
```

Your site will be live at: `https://your-project.web.app`

---

## 📁 Project Structure

```
shivani/
├── index.html              # Homepage
├── pages/
│   ├── products.html       # Product listing with filters
│   ├── product-detail.html # Product detail with gallery
│   ├── cart.html           # Shopping cart
│   ├── wishlist.html       # Wishlist
│   ├── checkout.html       # Multi-step checkout
│   ├── order-confirmation.html
│   ├── orders.html         # Order history & tracking
│   ├── login.html          # Login/Register
│   ├── search.html         # Search results
│   ├── contact.html        # Contact form
│   ├── faq.html            # FAQs
│   └── delivery.html       # Delivery & returns
├── admin/
│   ├── index.html          # Admin dashboard
│   ├── products.html       # Product management
│   ├── orders.html         # Order management
│   └── banners.html        # Banner management
├── css/                    # Modular CSS
├── js/                     # Modular JavaScript
├── firebase/               # Firestore rules & schema
├── firebase.json           # Firebase config
└── README.md
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Product listing with filters & sorting | ✅ |
| Product detail with image zoom | ✅ |
| Cart with coupon system | ✅ |
| Wishlist | ✅ |
| Authentication (Email + Google) | ✅ |
| Multi-step checkout | ✅ |
| Order tracking | ✅ |
| Admin panel | ✅ |
| AI Chatbot | ✅ |
| Smart search with suggestions | ✅ |
| Recently viewed products | ✅ |
| Instagram feed section | ✅ |
| Firestore Order Storage | ✅ |
| Mobile responsive | ✅ |
| SEO optimized | ✅ |

---

## 🎨 Coupon Codes (Demo)

| Code | Discount | Min Order |
|------|----------|-----------|
| WELCOME15 | 15% off | None |
| SHIVANI10 | 10% off | ₹500 |
| FLAT200 | ₹200 off | ₹1,500 |
| BRIDAL20 | 20% off | ₹3,000 |

---

## 📝 License

This project is for educational/commercial use. Built with ♡ for Shivani.
