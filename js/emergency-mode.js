/**
 * Emergency Waste Mode - Intelligent Reward Optimizer
 * (c) 2026 नगरCYCLE AI System
 */

let emergencyRewardMultiplier = 1;

const festivalCalendar = {
    "01-14": { name: "Makar Sankranti", style: "background: linear-gradient(90deg, #FF9933, #FFFFFF, #138808); color: #000;" },
    "01-26": { name: "Republic Day", style: "background: linear-gradient(90deg, #FF9933, #FFFFFF, #138808); color: #000;" },
    "03-14": { name: "Holi", style: "background: linear-gradient(90deg, #f43f5e, #fbbf24, #38bdf8, #a855f7); color: #fff;" },
    "08-15": { name: "Independence Day", style: "background: linear-gradient(90deg, #FF9933, #FFFFFF, #138808); color: #000;" },
    "10-20": { name: "Diwali", style: "background: linear-gradient(90deg, #78350f, #f59e0b, #78350f); color: #fff;" },
    "12-25": { name: "Christmas", style: "background: linear-gradient(90deg, #b91c1c, #15803d); color: #fff;" }
};

function activateEmergencyMode(areaName) {
    const now = new Date();
    const dateKey = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const festival = festivalCalendar[dateKey];

    // Only activate if it's an official festival day
    if (!festival) return;

    emergencyRewardMultiplier = 1.5;

    // Create UI Elements
    const alertDiv = document.createElement('div');
    alertDiv.id = 'emergency-waste-bar';

    const greeting = `Happy ${festival.name}! `;
    const barStyle = festival.style;

    alertDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 10px 20px;
        text-align: center;
        font-weight: 700;
        font-family: 'Inter', sans-serif;
        z-index: 99999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        letter-spacing: 0.5px;
        font-size: 0.95rem;
        ${barStyle}
    `;

    alertDiv.innerHTML = `
        <span>${greeting} Emergency Waste Mode Active in ${areaName} — 1.5x Bonus Rewards Active! 🚀</span>
    `;

    document.body.prepend(alertDiv);
    document.body.style.paddingTop = alertDiv.offsetHeight + 'px';
}

function getCountdownToNextFestival() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextFestival = null;
    let minDays = Infinity;

    for (const dateKey in festivalCalendar) {
        const [month, day] = dateKey.split('-').map(Number);
        let festivalDate = new Date(currentYear, month - 1, day);

        // If festival passed this year, look at next year
        if (festivalDate < now && (now.getMonth() + 1 !== month || now.getDate() !== day)) {
            festivalDate = new Date(currentYear + 1, month - 1, day);
        }

        const diffTime = festivalDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays < minDays) {
            minDays = diffDays;
            nextFestival = { name: festivalCalendar[dateKey].name, days: diffDays };
        }
    }
    return nextFestival;
}

function calculateFinalPoints(basePoints) {
    return Math.round(basePoints * emergencyRewardMultiplier);
}

function resetEmergencyMode() {
    emergencyRewardMultiplier = 1;
    const bar = document.getElementById('emergency-waste-bar');
    if (bar) {
        document.body.style.paddingTop = '0px';
        bar.remove();
    }
}

// Auto-activate for demo
window.addEventListener('load', () => activateEmergencyMode('Lajpat Nagar'));

window.EmergencySystem = {
    activate: activateEmergencyMode,
    reset: resetEmergencyMode,
    calculate: calculateFinalPoints,
    getMultiplier: () => emergencyRewardMultiplier,
    getCountdown: getCountdownToNextFestival
};
