// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import authentication

const firebaseConfig = {
  apiKey: "AIzaSyAcnjHEYTN1jt7vwoy4pxOiUxTHPXeUZo0",
  authDomain: "made2polish-sample.firebaseapp.com",
  projectId: "made2polish-sample",
  storageBucket: "made2polish-sample.firebasestorage.app",
  messagingSenderId: "733241409642",
  appId: "1:733241409642:web:1a3d81576a538955888a13",
  measurementId: "G-1TVWFHS3Y8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// If you don't need analytics right now, you can remove it:
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);

// Initialize and export the auth object so it can be used in your app
const auth = getAuth(app);
export { auth };
