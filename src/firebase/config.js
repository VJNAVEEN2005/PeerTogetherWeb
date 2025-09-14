// Firebase configuration for connecting to the database
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Full Firebase configuration to ensure proper connection
const firebaseConfig = {
  apiKey: "AIzaSyCmeFKiW306bxvQULixGlpdvzcwPzOKrpQ",
  authDomain: "peer-together.firebaseapp.com",
  databaseURL: "https://peer-together-default-rtdb.firebaseio.com",
  projectId: "peer-together",
  storageBucket: "peer-together.firebasestorage.app", 
  messagingSenderId: "246089277744",
  appId: "1:246089277744:web:6a524ec3f0a1804f03e8f5"
};

// Initialize Firebase with minimal configuration
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database without authentication
export const db = getDatabase(app);

// Note: We're not initializing authentication since we're having configuration issues
// The database should be configured with public read/write rules for this to work

console.log("Firebase initialized with database-only configuration");

export default app;