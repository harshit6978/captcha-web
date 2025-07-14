// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgOThv_1NRh4FjTiCtX5ydAmEYarqyCcA",
  authDomain: "captcha-a1415.firebaseapp.com",
  projectId: "captcha-a1415",
  storageBucket: "captcha-a1415.firebasestorage.app",
  messagingSenderId: "170842423099",
  appId: "1:170842423099:web:4a43b05fb6a3fd6ce4411e",
  measurementId: "G-RYQW31MNN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app); 
