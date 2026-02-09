
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


let app;
let db;


try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('Please check your Firebase configuration in src/config/firebaseConfig.js');
}


export { db };

