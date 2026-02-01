/**
 * TRASHTALK — Your Waste Wingman
 * Futuristic UI logic with pre-fill capability for listing
 */

document.addEventListener('DOMContentLoaded', () => {
    // [Bugfix] Disable TrashTalk on Marketplace page
    if (window.location.pathname.includes('marketplace.html')) return;

    // Global state for sharing with listing page
    let lastAnalysisResult = null;

    // 1. Inject HTML
    const chatTemplate = `
        <div id="tt-launcher">
            <span style="font-size: 0.65rem; color: #fff; line-height: 1;">TRASH</span>
            <span style="font-size: 0.8rem; line-height: 1; margin-top:-2px;">TALK</span>
        </div>

        <div id="tt-window">
            <div id="tt-header">
                <h3>TRASHTALK — Your Waste Wingman</h3>
                <button id="tt-close">×</button>
            </div>
            <div id="tt-body">
                <div class="tt-bubble bot-bubble">
                    So… what are we not throwing away today? 🗑️✨
                </div>
            </div>
            <div id="tt-footer">
                <div id="tt-quick-actions">
                    <div class="tt-chip" data-cmd="classify">Classify my waste</div>
                    <div class="tt-chip" data-cmd="price">Price this item</div>
                    <div class="tt-chip" data-cmd="nearest">Find nearest buyer</div>
                    <div class="tt-chip" data-cmd="collector">Talk to a collector</div>
                </div>
                <div id="tt-input-box">
                    <button class="tt-btn" id="tt-img-btn" title="Upload Image">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </button>
                    <input type="text" id="tt-input" placeholder="Speak to TRASHTALK...">
                    <button class="tt-btn" id="tt-voice-btn" title="Voice Input">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                </div>
            </div>
            <input type="file" id="tt-hidden-file" style="display:none" accept="image/*">
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatTemplate);

    // 2. Elements
    const launcher = document.getElementById('tt-launcher');
    const win = document.getElementById('tt-window');
    const close = document.getElementById('tt-close');
    const input = document.getElementById('tt-input');
    const body = document.getElementById('tt-body');
    const imgBtn = document.getElementById('tt-img-btn');
    const voiceBtn = document.getElementById('tt-voice-btn');
    const fileInput = document.getElementById('tt-hidden-file');

    // 3. UI Interactions
    launcher.addEventListener('click', () => win.classList.add('active'));
    close.addEventListener('click', () => win.classList.remove('active'));

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            handleUserMsg(input.value.trim());
            input.value = '';
        }
    });

    // Quick Action Buttons
    document.querySelectorAll('.tt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.innerText;
            handleUserMsg(cmd);
        });
    });

    // 4. Sassy Logic (Mocked)
    function handleUserMsg(msg) {
        appendMsg(msg, 'user');

        const typingId = showTyping();

        setTimeout(() => {
            removeTyping(typingId);
            const response = getSassyResponse(msg);
            appendMsg(response, 'bot');

            if (msg.toLowerCase().includes('price') || msg.toLowerCase().includes('worth')) {
                showPriceCard();
            }
        }, 800);
    }

    function getSassyResponse(msg) {
        const text = msg.toLowerCase();
        if (text.includes('classify')) return "My sensors are ready. Show me what you've got! (Upload an image, unless you want me to guess using cosmic telepathy).";
        if (text.includes('price') || text.includes('worth')) return "Money on your mind? I like that. Let's see... depends on the quality, but I can definitely find you some coin.";
        if (text.includes('joke')) return "Why did the trash can go to space? To find a little 'space' for itself. Okay, that was terrible.";
        if (text.includes('nearest')) return "Buyer? I've got a list. Let's find someone who actually appreciates your 'trash'.";
        if (text.includes('hello') || text.includes('hi')) return "Back for more eco-glory? What's the mission today?";

        return "Intriguing query. But let's stay focused. Saving the planet requires precision, Earthling.";
    }

    // 5. Image Interaction (Advanced Brain)
    imgBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            appendMsg(`📷 Analyzing ${file.name}...`, 'user');
            const typingId = showTyping();

            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch('/api/ai/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error("Sensor failure");

                const result = await response.json();
                removeTyping(typingId);

                const aiData = result.data || {};
                lastAnalysisResult = aiData; // Store globally for Sell Now

                const primary = (aiData.primaryCategory || 'Unknown').toUpperCase();
                const material = (aiData.subCategory || 'Waste').toUpperCase();
                const score = aiData.quality_score || 5;
                const canSell = aiData.isSellingAdvisable === 'Yes';

                let sassyReply = "";
                if (!canSell || primary.includes('RESIDUAL') || primary.includes('HAZARDOUS')) {
                    sassyReply = `Ugh, that's ${primary} (${material}). Pure trash. 🗑️ Level ${score} contamination. Landfill material at best.`;
                    appendMsg(sassyReply, 'bot');
                } else {
                    let basePrice = 8;
                    if (material.includes('PLASTIC')) basePrice = 14;
                    if (material.includes('METAL')) basePrice = 28;
                    if (primary.includes('E-WASTE')) basePrice = 75;

                    const estPrice = (basePrice * (score / 10)).toFixed(2);

                    sassyReply = `Hmm… that’s ${material} (${primary}). Quality: ${score}/10. Respect. Let’s get you ₹${estPrice}/kg.`;
                    appendMsg(sassyReply, 'bot');
                    showPriceCard(`${material} — ${primary}`, `₹${estPrice}`);
                }

            } catch (err) {
                removeTyping(typingId);
                appendMsg("My cosmic sensors are failing. 🔌", 'bot');
                console.error("Trashtalk AI Error:", err);
            }
        }
    });

    // 6. Voice Simulation
    voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.toggle('mic-listening');
        if (voiceBtn.classList.contains('mic-listening')) {
            input.placeholder = "Speak now...";
            setTimeout(() => {
                if (voiceBtn.classList.contains('mic-listening')) {
                    voiceBtn.classList.remove('mic-listening');
                    input.placeholder = "Speak to TRASHTALK...";
                    handleUserMsg("How much for plastic bottles?");
                }
            }, 3000);
        }
    });

    // 7. Helpers
    function appendMsg(text, sender) {
        const div = document.createElement('div');
        div.className = `tt-bubble ${sender}-bubble`;
        div.innerText = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'tt-bubble bot-bubble';
        div.innerHTML = '<i>. . .</i>';
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function showPriceCard(title = "Estimated Value", price = "₹12.50") {
        const card = document.createElement('div');
        card.className = 'tt-price-card';
        card.innerHTML = `
            <div>
                <small style="color:rgba(255,255,255,0.6)">${title}</small>
                <div style="color:var(--tt-mint); font-weight:bold">${price} / kg</div>
            </div>
            <button class="tt-chip tt-sell-btn" style="margin:0">Sell Now</button>
        `;

        card.querySelector('.tt-sell-btn').addEventListener('click', () => {
            if (!lastAnalysisResult) return;

            // If on listing page, fill directly
            if (window.location.pathname.includes('listing.html')) {
                if (typeof window.handleAIResult === 'function') {
                    window.handleAIResult(lastAnalysisResult);
                    win.classList.remove('active');
                }
            } else {
                localStorage.setItem('tt_prefill', JSON.stringify(lastAnalysisResult));
                window.location.href = 'listing.html';
            }
        });

        body.appendChild(card);
        body.scrollTop = body.scrollHeight;
    }
});
