/* ============================================
   SHIVANI JEWELLERY — Firebase v9 Modular Config
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0Gkk0cPod4E7mmDfhWhltiPAkzqazV1I",
  authDomain: "sajhnaa-96080.firebaseapp.com",
  projectId: "sajhnaa-96080",
  storageBucket: "sajhnaa-96080.firebasestorage.app",
  messagingSenderId: "1046201730791",
  appId: "1:1046201730791:web:be30bb22749484b7af4442",
  measurementId: "G-VVB0LW28DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

console.log('✓ Firebase v9 Modular Initialized');

// Export for Modules
export { app, auth, db, storage, analytics };

// Provide Global compatibility for older scripts
window.ShivaniFirebase = {
  init: () => true, // Already auto-init via module load
  getAuth: () => auth,
  getDb: () => db,
  getStorage: () => storage,
  isInitialized: () => !!app
};
