// Firebase configuration for connecting to the database
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCmeFKiW306bxvQULixGlpdvzcwPzOKrpQ",
  authDomain: "peer-together.firebaseapp.com",
  databaseURL: "https://peer-together-default-rtdb.firebaseio.com",
  projectId: "peer-together",
  storageBucket: "peer-together.firebasestorage.app",
  messagingSenderId: "246089277744",
  appId: "1:246089277744:web:6a524ec3f0a1804f03e8f5",
  measurementId: "G-XZKCR2Z0CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

// Initialize Analytics (will only work in browser environment)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  // Analytics might fail in non-browser environments
  console.log('Firebase Analytics not initialized:', error.message);
}

export default app;