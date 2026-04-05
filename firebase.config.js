// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCO__4Gwuoud453POKQJL8PZOIGtVe3RxI",
  authDomain: "payhaus-4c96c.firebaseapp.com",
  databaseURL: "https://payhaus-4c96c-default-rtdb.firebaseio.com",
  projectId: "payhaus-4c96c",
  storageBucket: "payhaus-4c96c.firebasestorage.app",
  messagingSenderId: "232090660321",
  appId: "1:232090660321:web:cd8affa277cc6dfd12b6a0",
  measurementId: "G-74T6T0SBPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getDatabase(app)

export{analytics, auth, db}
