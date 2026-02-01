import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const authItem = document.getElementById('auth-item');

onAuthStateChanged(auth, (user) => {
    window.currentUser = user; // Expose globally for other scripts
    if (user) {
        // User is signed in - Show Profile Dropdown
        const photoURL = user.photoURL || 'https://ui-avatars.com/api/?name=User&background=8FD8A0&color=000';

        // Add dropdown class for hover effect (assuming .dropdown style exists)
        authItem.classList.add('dropdown');

        authItem.innerHTML = `
            <a href="#" class="profile-link" style="display: flex; align-items: center; gap: 8px; text-decoration: none; padding: 4px 8px;">
                <img src="${photoURL}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-color);">
                <span style="color: var(--text-color); font-weight: 500; font-size: 0.9rem;">▾</span>
            </a>
            <div class="dropdown-content" style="right: 0; left: auto; min-width: 150px;">
                <a href="dashboard.html">My Dashboard</a>
                <a href="#" id="sign-out-btn" style="color: var(--danger-color);">Sign Out</a>
            </div>
        `;

        // Attach Sign Out Listener
        setTimeout(() => {
            const signOutBtn = document.getElementById('sign-out-btn');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await signOut(auth);
                        // Redirect to home or logic handled by onAuthStateChanged
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error("Sign Out Error", error);
                    }
                });
            }
        }, 0); // Slight delay to ensure DOM is ready

    } else {
        // User is signed out - Show Login Button
        authItem.classList.remove('dropdown');
        authItem.innerHTML = `
             <a href="login.html" class="btn btn-primary" style="padding: 4px 12px; font-size: 0.9rem; color: black;">Login</a>
        `;
    }
});
