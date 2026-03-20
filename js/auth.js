/* ============================================
   SHIVANI JEWELLERY — Authentication Module
   ============================================ */

const ShivaniAuth = (() => {
  'use strict';

  let currentUser = null;

  /* ---- Initialize Auth State Listener ---- */
  const init = () => {
    if (!ShivaniFirebase.isInitialized()) {
      // Offline mode - check localStorage
      currentUser = ShivaniUtils.storage.get('mockUser', null);
      updateUI();
      return;
    }
    ShivaniFirebase.getAuth().onAuthStateChanged(user => {
      currentUser = user;
      if (user) {
        ShivaniUtils.storage.set('mockUser', { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL });
      } else {
        ShivaniUtils.storage.remove('mockUser');
      }
      updateUI();
    });
  };

  /* ---- Email/Password Sign Up ---- */
  const signUp = async (email, password, name) => {
    if (!ShivaniFirebase.isInitialized()) {
      const user = { uid: ShivaniUtils.generateId('U'), email, displayName: name, photoURL: null };
      currentUser = user;
      ShivaniUtils.storage.set('mockUser', user);
      updateUI();
      ShivaniUtils.showToast('Account created successfully!');
      return user;
    }
    try {
      const cred = await ShivaniFirebase.getAuth().createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      // Create user document in Firestore
      await ShivaniFirebase.getDb().collection('users').doc(cred.user.uid).set({
        name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'customer'
      });
      ShivaniUtils.showToast('Account created successfully!');
      return cred.user;
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
      throw e;
    }
  };

  /* ---- Email/Password Sign In ---- */
  const signIn = async (email, password) => {
    if (!ShivaniFirebase.isInitialized()) {
      const user = { uid: ShivaniUtils.generateId('U'), email, displayName: email.split('@')[0], photoURL: null };
      currentUser = user;
      ShivaniUtils.storage.set('mockUser', user);
      updateUI();
      ShivaniUtils.showToast('Welcome back!');
      return user;
    }
    try {
      const cred = await ShivaniFirebase.getAuth().signInWithEmailAndPassword(email, password);
      ShivaniUtils.showToast('Welcome back!');
      return cred.user;
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
      throw e;
    }
  };

  /* ---- Google Sign In ---- */
  const signInWithGoogle = async () => {
    if (!ShivaniFirebase.isInitialized()) {
      const user = { uid: ShivaniUtils.generateId('U'), email: 'user@gmail.com', displayName: 'Google User', photoURL: null };
      currentUser = user;
      ShivaniUtils.storage.set('mockUser', user);
      updateUI();
      ShivaniUtils.showToast('Welcome!');
      return user;
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const cred = await ShivaniFirebase.getAuth().signInWithPopup(provider);
      // Create/update user doc
      await ShivaniFirebase.getDb().collection('users').doc(cred.user.uid).set({
        name: cred.user.displayName,
        email: cred.user.email,
        photoURL: cred.user.photoURL,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      ShivaniUtils.showToast('Welcome!');
      return cred.user;
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
      throw e;
    }
  };

  /* ---- Forgot Password ---- */
  const resetPassword = async (email) => {
    if (!ShivaniFirebase.isInitialized()) {
      ShivaniUtils.showToast('Password reset email sent (demo mode)');
      return;
    }
    try {
      await ShivaniFirebase.getAuth().sendPasswordResetEmail(email);
      ShivaniUtils.showToast('Password reset email sent!');
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
      throw e;
    }
  };



  /* ---- Sign Out ---- */
  const signOut = async () => {
    if (!ShivaniFirebase.isInitialized()) {
      currentUser = null;
      ShivaniUtils.storage.remove('mockUser');
      updateUI();
      ShivaniUtils.showToast('Signed out');
      return;
    }
    try {
      await ShivaniFirebase.getAuth().signOut();
      ShivaniUtils.showToast('Signed out');
    } catch (e) {
      ShivaniUtils.showToast(e.message, 'error');
    }
  };

  /* ---- Update UI Based on Auth State ---- */
  const updateUI = () => {
    const userMenus = document.querySelectorAll('[data-auth]');
    userMenus.forEach(el => {
      const when = el.dataset.auth;
      if (when === 'logged-in') el.style.display = currentUser ? '' : 'none';
      else if (when === 'logged-out') el.style.display = currentUser ? 'none' : '';
    });
    // Update user name displays
    document.querySelectorAll('[data-user-name]').forEach(el => {
      el.textContent = currentUser?.displayName || 'Guest';
    });
    // Update cart/wishlist badges
    if (typeof ShivaniCart !== 'undefined') ShivaniCart.updateBadge();
    if (typeof ShivaniWishlist !== 'undefined') ShivaniWishlist.updateBadge();
  };

  const getUser = () => currentUser;
  const isLoggedIn = () => !!currentUser;
  const isAdmin = () => {
    const mockUser = ShivaniUtils.storage.get('mockUser');
    return mockUser?.role === 'admin' || mockUser?.email === 'admin@shivani.com';
  };

  /* ---- Require Auth (redirect if not logged in) ---- */
  const requireAuth = (redirectUrl = '/pages/login.html') => {
    if (!isLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  };

  return { init, signUp, signIn, signInWithGoogle, resetPassword, signOut, getUser, isLoggedIn, isAdmin, requireAuth, updateUI };
})();
