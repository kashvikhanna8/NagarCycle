document.addEventListener('DOMContentLoaded', () => {

    // Usability Slider Logic (Listing Page)
    const slider = document.getElementById('usabilitySlider');
    const output = document.getElementById('usabilityValue');
    const values = ['Low', 'Medium', 'High'];

    if (slider && output) {
        slider.addEventListener('input', function () {
            output.textContent = values[this.value - 1];
        });
    }

    // Tab Logic (Dashboard & Others)
    const tabBtns = document.querySelectorAll('.tab-btn');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all styles
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                e.target.classList.add('active');

                // For a real app, we would switch content here.
                // For wireframe, we can just alert or log
                console.log(`Switched to tab: ${e.target.textContent}`);
            });
        });
    }

    // Filter Logic Simulation (Marketplace)
    const applyFiltersBtn = document.querySelector('.filter-section button');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            // Simulate loading effect
            const originalText = applyFiltersBtn.textContent;
            applyFiltersBtn.textContent = 'Applying...';
            applyFiltersBtn.style.opacity = '0.7';

            setTimeout(() => {
                applyFiltersBtn.textContent = originalText;
                applyFiltersBtn.style.opacity = '1';
                alert('Filters applied! (Demo only)');
            }, 500);
        });
    }

    // Chat Send Logic (Tracking)
    const chatInput = document.querySelector('.chat-input input');
    const chatBtn = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatInput && chatBtn && chatMessages) {
        const sendMessage = () => {
            const text = chatInput.value;
            if (text.trim() === '') return;

            const msgDiv = document.createElement('div');
            msgDiv.className = 'message message-out';
            msgDiv.innerHTML = `<p>${text}</p>`;
            chatMessages.appendChild(msgDiv);

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        chatBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Scroll Reveal Animation (How It Works)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible'); // Reset animation when out of view
            }
        });
    }, observerOptions);

    const steps = document.querySelectorAll('.ladder-step, .ladder-line');
    steps.forEach(step => {
        observer.observe(step);
    });

    // Simulate Emergency Mode Detection (Listing Page)
    const emergencyPopup = document.getElementById('emergencyPopup');
    if (emergencyPopup && window.EmergencySystem) {
        setTimeout(() => {
            const nextEvent = window.EmergencySystem.getCountdown();
            const popupText = emergencyPopup.querySelector('p');

            if (nextEvent) {
                if (nextEvent.days === 0) {
                    popupText.innerHTML = `<strong>Emergency Mode is LIVE!</strong> High waste volume expected for <strong>${nextEvent.name}</strong>. Enjoy <strong>1.5x Reward Multipliers</strong> on all actions today! 🚀`;
                } else {
                    popupText.innerHTML = `Upcoming Reward Boost: <strong>${nextEvent.name}</strong> is just <strong>${nextEvent.days} days</strong> away! Prepare your waste listings for a <strong>1.5x point boost</strong>. 🗓️`;
                }
            }

            emergencyPopup.classList.add('active');
        }, 2000); // Trigger after 2 seconds
    }
});

function closeEmergencyPopup() {
    const popup = document.getElementById('emergencyPopup');
    if (popup) {
        popup.classList.remove('active');
    }
}
