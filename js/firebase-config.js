/* ============================================
   SHIVANI JEWELLERY — Firebase Configuration
   Replace placeholder values with your project config
   ============================================ */

const ShivaniFirebase = (() => {
  'use strict';

  // LIVE PROD CONFIG: sajhnaa-96080
  const firebaseConfig = {
    apiKey: "AIzaSyD0Gkk0cPod4E7mmDfhWhltiPAkzqazV1I",
    authDomain: "sajhnaa-96080.firebaseapp.com",
    projectId: "sajhnaa-96080",
    storageBucket: "sajhnaa-96080.firebasestorage.app",
    messagingSenderId: "1046201730791",
    appId: "1:1046201730791:web:be30bb22749484b7af4442",
    measurementId: "G-VVB0LW28DJ"
  };

  let app, auth, db, storage;

  const init = () => {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded. Running in offline mode.');
      return false;
    }
    try {
      app = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.firestore();
      storage = firebase.storage();
      if (typeof firebase.analytics === 'function') {
        firebase.analytics();
      }
      console.log('✓ Firebase initialized');
      return true;
    } catch (e) {
      console.error('Firebase init error:', e);
      return false;
    }
  };

  const getAuth = () => auth;
  const getDb = () => db;
  const getStorage = () => storage;
  const isInitialized = () => !!app;

  return { init, getAuth, getDb, getStorage, isInitialized };
})();
