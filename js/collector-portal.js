/**
 * Collector Portal - Mission Control Logic
 * Handles transitions between Login, Dashboard, Navigation, and Completion scenes.
 */

const portalHTML = `
<div id="collectorPortal" class="portal-overlay">
    <div class="portal-close" onclick="closeCollectorPortal()">&times;</div>
    
    <div class="portal-content">
        <!-- Scene 1: One-Time Login/Onboarding -->
        <div id="scene-login" class="scene active">
            <div class="mission-card">
                <h2 style="text-align: center; margin-bottom: 2rem;">Mission Initialization</h2>
                <div class="form-group">
                    <label class="form-label" style="color: var(--primary-color)">Operator Identity</label>
                    <input type="text" id="collectorName" class="form-control" placeholder="Enter your name" style="background: rgba(0,0,0,0.3); border-color: rgba(143,216,160,0.3); color: white;">
                </div>
                <div class="form-group">
                    <label class="form-label" style="color: var(--primary-color)">Comm-Link (Phone)</label>
                    <input type="tel" id="collectorPhone" class="form-control" placeholder="+91 XXXX XXX XXX" style="background: rgba(0,0,0,0.3); border-color: rgba(143,216,160,0.3); color: white;">
                </div>
                
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(56,189,248,0.1); border-radius: var(--radius-md); border-left: 3px solid var(--secondary-color)">
                    <small style="color: var(--secondary-color)">GPS COORDINATES ACQUIRED</small>
                    <div style="font-size: 0.9rem;">📍 Lajpat Nagar, Delhi - 110024</div>
                </div>

                <div class="travel-modes">
                    <div class="mode-btn" onclick="selectMode(this, 'Walking')"><span>🚶</span>Walking</div>
                    <div class="mode-btn active" onclick="selectMode(this, 'Cycle')"><span>🚲</span>Cycle</div>
                    <div class="mode-btn" onclick="selectMode(this, 'Bike')"><span>🏍️</span>Bike</div>
                    <div class="mode-btn" onclick="selectMode(this, 'Cart')"><span>🛒</span>Cart</div>
                </div>

                <div class="mic-button" onclick="simulateVoice('Initializing link...')">
                    🎙️
                </div>
                <p style="text-align: center; font-size: 0.8rem; color: var(--text-light); margin-top: 1rem;">"Speak your name / area"</p>

                <button class="btn btn-primary btn-block" style="margin-top: 2rem;" onclick="validateAndEnter()">ENTER MISSION CONTROL</button>
            </div>
        </div>

        <script>
        // Note: Function defined globally below to ensure access from HTML string if needed, 
        // but since this is inside a template literal, we must ensure it's available in global scope.
        // The original file defines functions on window, so we will do the same.
        </script>

        <!-- Scene 2: Job Dashboard (Uber-style) -->
        <div id="scene-dashboard" class="scene">
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="margin: 0;">Active Missions</h2>
                    <p id="collector-location" style="color: var(--primary-color); margin: 0; font-size: 0.9rem;">Location: Detecting...</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary-color);">₹0.00</div>
                    <small style="color: var(--text-light)">Session Earnings</small>
                </div>
            </div>

            <div id="job-list">
                <!-- Dynamic Jobs Loaded Here -->
                <div style="text-align: center; padding: 2rem; color: var(--text-light); opacity: 0.5;">
                    🛰️ Scanning for missions...
                </div>
            </div>

            <div class="mic-button" style="width: 60px; height: 60px; font-size: 1.5rem;" onclick="simulateVoice('Job accepted')">
                🎙️
            </div>
            <p style="text-align: center; font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">"Speak to accept job"</p>
        </div>

        <!-- Scene 3: Navigation Screen -->
        <div id="scene-navigation" class="scene">
            <div class="mission-card" style="padding: 1.5rem;">
                <h3 style="margin-top: 0;">Mission Route</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: var(--radius-sm)">
                        <small style="color: var(--text-light)">PICKUP</small>
                        <div id="navPickupAddr" style="font-size: 0.9rem;">Pending Dispatch</div>
                    </div>
                    <div style="flex: 1; padding: 0.75rem; background: rgba(56,189,248,0.1); border-radius: var(--radius-sm)">
                        <small style="color: var(--secondary-color)">DROP</small>
                        <div id="navDropAddr" style="font-size: 0.9rem;">Buyer Location</div>
                    </div>
                </div>

                <div class="map-view">
                    <!-- Fake Map Element -->
                    <div style="position: absolute; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 20px, transparent 20px, transparent 40px);"></div>
                    <div class="route-path"></div>
                    <div style="position: absolute; top: 40%; left: 20%; font-size: 1.5rem;">📍</div>
                    <div style="position: absolute; top: 60%; right: 20%; font-size: 1.5rem;">🏢</div>
                    <div style="position: absolute; bottom: 1rem; left: 1rem; color: var(--primary-color); font-weight: bold; background: black; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem;">ETA: 4 MINS</div>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-secondary btn-block" onclick="alert('Contacting customer...')">📞 Contact</button>
                    <button class="btn btn-primary btn-block" onclick="nextScene('completion')">Complete Mission</button>
                </div>
            </div>
        </div>

        <!-- Scene 4: Completion Screen -->
        <div id="scene-completion" class="scene">
            <div class="mission-card" style="text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">🌟</div>
                <h2 style="color: var(--primary-color);">Mission Accomplished</h2>
                <p style="color: var(--text-light);">Payload delivered to recovery center.</p>
                
                <div style="background: rgba(255,255,255,0.03); padding: 2rem; border-radius: var(--radius-md); margin: 2rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <div style="color: var(--primary-color); font-size: 1.5rem; font-weight: bold;">₹45.00</div>
                        <small style="color: var(--text-light)">Earnings Added</small>
                    </div>
                    <div>
                        <div style="color: var(--secondary-color); font-size: 1.5rem; font-weight: bold;">+${Math.round(10 * (window.emergencyRewardMultiplier || 1))}</div>
                        <small style="color: var(--text-light)">Mission Points</small>
                    </div>
                </div>

                <div style="font-size: 0.9rem; color: var(--text-color); margin-bottom: 2rem; opacity: 0.8;">
                    Personal Dashboard Updated. Your digital credit score has improved by 0.5%
                </div>

                <button class="btn btn-primary btn-block" onclick="nextScene('dashboard')">NEXT MISSION</button>
                <button class="btn btn-secondary btn-block" style="margin-top: 1rem;" onclick="closeCollectorPortal()">EXIT PORTAL</button>
            </div>
        </div>
    </div>
</div>
`;

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    // Inject Portal into DOM if not already there
    if (!document.getElementById('collectorPortal')) {
        document.body.insertAdjacentHTML('beforeend', portalHTML);
    }

    // [Real-Time] Listen for new orders from Marketplace
    window.addEventListener('storage', (e) => {
        if (e.key === 'ActiveOrders') {
            const updated = JSON.parse(e.newValue);
            if (updated) {
                window.ActiveOrders = updated;
                // If dashboard is active, refresh the list
                const dashboard = document.getElementById('scene-dashboard');
                if (dashboard && dashboard.classList.contains('active')) {
                    loadAvailableJobs();
                }
            }
        }
    });

    window.currentMissionId = null; // Track currently accepted mission
    // Auto-detect location for Collector
    detectCollectorLocation();
});

function detectCollectorLocation() {
    if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || addr.suburb || "Delhi";
                const road = addr.road || addr.suburb || "";
                const display = road ? `${road}, ${city}` : city;

                const locEl = document.getElementById('collector-location');
                if (locEl) locEl.innerText = "Location: " + display;
            })
            .catch(err => {
                const locEl = document.getElementById('collector-location');
                if (locEl) locEl.innerText = `Location: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
            });
    });
}

window.openCollectorPortal = function () {
    const portal = document.getElementById('collectorPortal');
    portal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadAvailableJobs();
};

window.loadAvailableJobs = function () {
    const jobList = document.getElementById('job-list');
    if (!jobList) return;

    // Filter unassigned orders
    const unassigned = (window.ActiveOrders || []).filter(o => o.status === 'Unassigned');

    if (unassigned.length === 0) {
        jobList.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-light); opacity: 0.5;">🛰️ No missions available in area.</div>';
        return;
    }

    jobList.innerHTML = '';
    unassigned.forEach(job => {
        // Use Matching Engine to see if current user (mocked as R1/R2) should see it
        // For simplicity, we show all unassigned jobs but mark distance
        const mockRiderLoc = { lat: 28.5672, lng: 77.2435 };
        const dist = window.MatchingEngine ? window.MatchingEngine.calculateDistance(mockRiderLoc, job.pickupLoc) : 0.7;

        const card = `
            <div class="job-card" id="job-${job.id}" style="display: flex; gap: 1rem; align-items: center; padding: 1.25rem;">
                ${job.img ? `<img src="${job.img}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">` : '<div style="width: 60px; height: 60px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📦</div>'}
                <div class="job-info" style="flex: 1">
                    <div style="font-size: 1.05rem; font-weight: bold; margin-bottom: 0.25rem;">${job.weight}kg ${job.type}</div>
                    <div style="color: var(--text-light); font-size: 0.85rem;">📍 ${(dist * 1000).toFixed(0)}m away • Local Area</div>
                    <div style="color: var(--primary-color); font-weight: bold; font-size: 1rem;">💰 ₹${job.payout || 0} earning</div>
                </div>
                <button class="accept-btn" style="padding: 0.6rem 1rem; font-size: 0.85rem;" onclick="acceptJob('${job.id}')">ACCEPT</button>
            </div>
        `;
        jobList.insertAdjacentHTML('beforeend', card);
    });
};

window.acceptJob = function (jobId) {
    const job = window.ActiveOrders.find(o => o.id === jobId);
    if (job) {
        job.status = 'Assigned'; // LOK JOB
        window.currentMissionId = jobId; // Store for retirement
        console.log(`Job ${jobId} locked and assigned.`);
        if (window.syncOrders) window.syncOrders();

        // [NEW] Notification for Seller & Buyer
        localStorage.setItem('mission_update', JSON.stringify({
            status: 'Accepted',
            jobId: jobId,
            collector: (document.getElementById('collectorName').value || 'Operator Alpha'),
            item: job.type,
            time: new Date().toLocaleTimeString()
        }));

        // Populate Navigation Details
        const pickup = document.getElementById('navPickupAddr');
        const drop = document.getElementById('navDropAddr');
        if (pickup) pickup.innerText = job.pickupAddress || "Unknown Seller";
        if (drop) drop.innerText = job.dropAddress || "Regional Center";

        nextScene('navigation');
    }
};

window.closeCollectorPortal = function () {
    const portal = document.getElementById('collectorPortal');
    portal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

window.selectMode = function (element, mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    console.log("Mode selected:", mode);
};

window.nextScene = function (sceneId) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById('scene-' + sceneId).classList.add('active');

    // Auto-scroll to top of viewport
    const portal = document.getElementById('collectorPortal');
    if (portal) portal.scrollTop = 0;

    // Refresh jobs when entering dashboard
    if (sceneId === 'dashboard') {
        loadAvailableJobs();
    }

    // Trigger Eco-Quote on completion
    if (sceneId === 'completion') {
        if (window.showEcoQuote) window.showEcoQuote('pickup');

        // [NEW] Retire the mission from active list
        if (window.currentMissionId) {
            window.ActiveOrders = window.ActiveOrders.filter(o => o.id !== window.currentMissionId);
            window.syncOrders(); // Ensure it saves to storage
            window.currentMissionId = null; // Reset
            console.log("Mission retired from active pool.");
        }
    }
};

window.simulateVoice = function (commandHint) {
    const activeScene = document.querySelector('.scene.active');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const micBtn = document.querySelector('.mic-button');
    if (micBtn) micBtn.classList.add('mic-pulsing');

    // Show a temporary tooltip or alert to let user know it's listening
    const feedback = document.createElement('div');
    feedback.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--primary-color); color:black; padding:10px 20px; border-radius:30px; z-index:100000; font-weight:bold; box-shadow:0 0 20px rgba(0,0,0,0.5);";
    feedback.innerHTML = "🎙️ Listening for " + (activeScene.id === 'scene-login' ? "Identity..." : "Command...");
    document.body.appendChild(feedback);

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice Transcript:", transcript);

        if (micBtn) micBtn.classList.remove('mic-pulsing');
        feedback.remove();

        if (activeScene.id === 'scene-login') {
            const nameField = document.getElementById('collectorName');
            const phoneField = document.getElementById('collectorPhone');

            if (!nameField.value || nameField.value.trim() === "") {
                nameField.value = transcript;
                alert("Identity Recognized: " + transcript + "\nNow speak your phone number...");
                // Start recognition again for phone after a short delay
                setTimeout(() => window.simulateVoice('phone'), 1000);
            } else {
                // Remove non-numeric characters for phone
                phoneField.value = transcript.replace(/\D/g, '');
                alert("Comm-Link Synchronized: " + phoneField.value);
            }
        } else if (activeScene.id === 'scene-dashboard') {
            alert("Action Recognized: " + transcript);
            if (transcript.toLowerCase().includes('accept')) {
                const firstJob = (window.ActiveOrders || []).find(o => o.status === 'Unassigned');
                if (firstJob) acceptJob(firstJob.id);
                else nextScene('navigation');
            }
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (micBtn) micBtn.classList.remove('mic-pulsing');
        feedback.remove();
        alert("Voice Error: " + event.error + ". Please try again.");
    };

    recognition.onend = () => {
        if (micBtn) micBtn.classList.remove('mic-pulsing');
        if (feedback.parentNode) feedback.remove();
    };

    recognition.start();
};

window.validateAndEnter = function () {
    const name = document.getElementById('collectorName').value.trim();
    const phone = document.getElementById('collectorPhone').value.trim();

    if (!name || !phone) {
        alert("CRITICAL ERROR: Identity and Comm-Link fields are mandatory.");
        return;
    }

    if (phone.length > 10 || !/^\d+$/.test(phone)) {
        alert("LINK ERROR: Invalid Comm-Link. Phone number cannot exceed 10 digits.");
        return;
    }

    // Validation Passed
    nextScene('dashboard');
};
