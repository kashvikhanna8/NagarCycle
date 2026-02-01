// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxGqZK03fi--8tqk42WdK_1Ie-fbc465U",
    authDomain: "nsuthackathon.firebaseapp.com",
    projectId: "nsuthackathon",
    storageBucket: "nsuthackathon.firebasestorage.app",
    messagingSenderId: "971787825936",
    appId: "1:971787825936:web:b8888654a7c12edf49eb95",
    measurementId: "G-NNV27VFM32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup };
