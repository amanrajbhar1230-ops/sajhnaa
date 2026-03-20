/* ============================================
   SHIVANI JEWELLERY — Authentication Module (v9)
   ============================================ */

import { auth, db } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

let currentUser = null;

const init = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        currentUser.role = docSnap.data().role || 'user';
      }
    } else {
      currentUser = null;
    }
  });
};

const signUp = async (email, password, name) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name: name,
    email: email,
    role: 'user',
    createdAt: serverTimestamp()
  });
  ShivaniUtils.showToast('Account created successfully!', 'success');
  return cred.user;
};

const signIn = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  ShivaniUtils.showToast('Login successful', 'success');
  return cred.user;
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  await setDoc(doc(db, "users", cred.user.uid), {
    name: cred.user.displayName,
    email: cred.user.email,
    updatedAt: serverTimestamp()
  }, { merge: true });
  ShivaniUtils.showToast('Google Sign-In successful', 'success');
  return cred.user;
};

const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  ShivaniUtils.showToast('Reset email sent!', 'info');
};

const signOut = async () => {
  await firebaseSignOut(auth);
  ShivaniUtils.showToast('Signed out');
  window.location.reload();
};

const getUser = () => currentUser;
const isLoggedIn = () => !!currentUser;
const isAdmin = () => currentUser?.role === 'admin';

// Expose for modules
export { init, signUp, signIn, signInWithGoogle, resetPassword, signOut, getUser, isLoggedIn, isAdmin };

// Expose for Global scripts (backward compatibility)
window.ShivaniAuth = {
  init, signUp, signIn, signInWithGoogle, resetPassword, signOut, getUser, isLoggedIn, isAdmin
};
