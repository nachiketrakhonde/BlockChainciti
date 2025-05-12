// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSnkAxprANPEQr_WqzUM0HFSF7jJAt43Q",
  authDomain: "blockchainciti-d634d.firebaseapp.com",
  projectId: "blockchainciti-d634d",
  storageBucket: "blockchainciti-d634d.firebasestorage.app",
  messagingSenderId: "958367731097",
  appId: "1:958367731097:web:0bf74ab67a9c4b59089708"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
