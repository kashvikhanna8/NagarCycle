/**
 * Eco-Quotes Notification System
 * Witty, sassy, and rewarding feedback for sustainable actions.
 */

const ecoQuotes = [
    "Plot twist: you didn’t trash it. 🌱",
    "Landfill just lost a customer. 📉",
    "Trash? In this economy? 💅",
    "Garbage truck in shambles. 🚛💨",
    "Earth just sent you a friend request. 🌍",
    "Eco-warrior energy. Respect. 🛡️",
    "Your carbon footprint just shrank a size. 👣",
    "Nature is literally vibing right now. ✨",
    "Recycling level: Professional. 🏆",
    "That waste never stood a chance. 🔥"
];

const toastHTML = `
<div id="ecoToast" class="eco-toast">
    <span class="eco-toast-icon">🍃</span>
    <span id="ecoToastText" class="eco-toast-text"></span>
</div>
`;

// Inject Toast Container
document.body.insertAdjacentHTML('beforeend', toastHTML);

/**
 * Shows a random sassy eco-quote
 * @param {string} action - Optional action trigger for future context-aware quotes
 */
window.showEcoQuote = function (action = 'default') {
    const toast = document.getElementById('ecoToast');
    const textEl = document.getElementById('ecoToastText');

    // Pick random quote
    const randomQuote = ecoQuotes[Math.floor(Math.random() * ecoQuotes.length)];
    textEl.innerText = randomQuote;

    // Show Toast
    toast.classList.add('active');

    // Auto-hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
};

// Listen for custom events if needed
window.addEventListener('eco-action-complete', (e) => {
    window.showEcoQuote(e.detail?.action);
});

// [NEW] Global Listener for Mission/Order updates
window.addEventListener('storage', (e) => {
    if (e.key === 'mission_update') {
        const update = JSON.parse(e.newValue);
        if (update && update.status === 'Accepted') {
            const toast = document.getElementById('ecoToast');
            const textEl = document.getElementById('ecoToastText');

            // Customize text for Seller/Buyer awareness
            textEl.innerHTML = `🛡️ <strong>Mission Accepted!</strong><br>${update.collector} is arriving for your <strong>${update.item}</strong>.`;

            toast.classList.add('active');
            setTimeout(() => toast.classList.remove('active'), 6000);

            // Play a subtle sound if possible (optional mockup)
            console.log("Mission accepted notification triggered.");
        }
    }
});
