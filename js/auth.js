import { auth, googleProvider, signInWithPopup } from "./firebaseConfig.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const errorMsg = document.getElementById('error-msg');
const googleBtn = document.getElementById('google-btn');

let isLogin = true;

// Toggle between Login and Signup
toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Login to access your dashboard';
        submitBtn.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join the circular economy today';
        submitBtn.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
    }
    errorMsg.style.display = 'none';
});

// Handle Form Submit
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        // Redirect handled by onAuthStateChanged
    } catch (error) {
        showError(error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
    }
});

// Handle Google Login
googleBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        // Redirect handled by onAuthStateChanged
    } catch (error) {
        showError(error.message);
    }
});

// Auth State Listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('User logged in:', user);
        // Get the ID token to verify backend connection (optional step for now)
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token); // Store for API calls

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});

function showError(message) {
    errorMsg.textContent = message.replace('Firebase: ', '');
    errorMsg.style.display = 'block';
}
