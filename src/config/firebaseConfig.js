// Firebase Configuration
// IMPORTANT: Replace these with your actual Firebase credentials from Firebase Console
// Go to: Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGg6XZPrTrEmlymVYpF_4pgTcZFD0skVU",
  authDomain: "sample-firebase-ai-app-9c94d.firebaseapp.com",
  projectId: "sample-firebase-ai-app-9c94d",
  storageBucket: "sample-firebase-ai-app-9c94d.firebasestorage.app",
  messagingSenderId: "843356439965",
  appId: "1:843356439965:web:b9e75e7f428165592b5b74"
};

// Check if Firebase is configured
const isConfigured = firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
                     firebaseConfig.projectId !== "your-project-id";

let app;
let db;

if (isConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    // Initialize Firestore
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Please check your Firebase configuration in src/config/firebaseConfig.js');
  }
} else {
  console.warn('⚠️ Firebase not configured. Please update src/config/firebaseConfig.js with your credentials.');
  console.warn('See SETUP_INSTRUCTIONS.md for detailed setup guide.');
}

export { db, isConfigured };

