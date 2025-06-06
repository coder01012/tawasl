// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// إعدادات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyDFPkNaiaExQZ6D3y0CKxIn6Pi0nrE9Fno",
  authDomain: "tawasal-431a8.firebaseapp.com",
  databaseURL: "https://tawasal-431a8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tawasal-431a8",
  storageBucket: "tawasal-431a8.firebasestorage.app",
  messagingSenderId: "81068658401",
  appId: "1:81068658401:web:b62d4e56a3cdf4108e31a0",
  measurementId: "G-P0Y3K84XL6"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

export { auth, provider, db };
