import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBeX_q4BUr4q6rNqLj2v6Hp__cN3Teblho",
  authDomain: "suraksha-37230.firebaseapp.com",
  projectId: "suraksha-37230",
  storageBucket: "suraksha-37230.firebasestorage.app",
  messagingSenderId: "763675183954",
  appId: "1:763675183954:web:4eb11703dcd10f7c5e888b"
};

export const VAPID_KEY = "BEsTv-eK9cK1QZFs0Ymi2oZ1JqYCjxIAjKXWaefnPQqESlWwAxvAfDoDld_UJyNVfE2moQiMo--gZWmt6HAptdg";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      console.log('✅ Firebase Messaging initialized');
    } else {
      console.warn('⚠️ Firebase Messaging not supported in this browser');
    }
  });
}

export { app, messaging };
