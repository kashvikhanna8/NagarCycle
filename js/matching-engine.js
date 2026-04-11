/**
 * AI Collector Matching Engine
 * Responsibilities: Filtering, Ranking, and Assigning collectors to pickup jobs.
 */

const RiderRegistry = [
    { id: 'R1', name: 'Arjun', transport: 'Cycle', maxWeight: 15, minEarning: 20, location: { lat: 28.5672, lng: 77.2435 }, status: 'Available' },
    { id: 'R2', name: 'Suresh', transport: 'Bike', maxWeight: 50, minEarning: 50, location: { lat: 28.5700, lng: 77.2500 }, status: 'Available' },
    { id: 'R3', name: 'Vikram', transport: 'Auto', maxWeight: 200, minEarning: 150, location: { lat: 28.5600, lng: 77.2300 }, status: 'Available' },
    { id: 'R4', name: 'Rajesh', transport: 'Truck', maxWeight: 1000, minEarning: 500, location: { lat: 28.5800, lng: 77.2600 }, status: 'Available' },
    { id: 'R5', name: 'Amit', transport: 'Walking', maxWeight: 5, minEarning: 10, location: { lat: 28.5680, lng: 77.2440 }, status: 'Available' }
];

const MatchingEngine = {
    /**
     * Finds the best rider for a given job
     * @param {Object} job { pickupLoc, weight, payout, type }
     */
    assignBestRider: function (job) {
        console.log("Matching Engine: Processing job...", job);

        // 1. FILTERING
        let candidates = RiderRegistry.filter(rider => {
            // Check Availability
            if (rider.status !== 'Available') return false;

            // Check Weight Capacity
            if (job.weight > rider.maxWeight) return false;

            // Check Earning Feasibility
            if (job.payout < rider.minEarning) return false;

            // Check Distance (Simple Euclidean for simulation)
            const dist = this.calculateDistance(rider.location, job.pickupLoc);
            rider.currentDist = dist; // Attach for ranking

            // Assume 5km max radius for simplicity
            if (dist > 5) return false;

            return true;
        });

        // 2. RANKING
        candidates.sort((a, b) => {
            // Primary: Shortest Distance
            if (a.currentDist !== b.currentDist) {
                return a.currentDist - b.currentDist;
            }
            // Secondary: Payout per weight/effort (simulated preference)
            return b.maxWeight - a.maxWeight;
        });

        console.log("Matching Engine: Candidates found:", candidates);

        return candidates[0] || null; // Return top-ranked or null
    },

    calculateDistance: function (loc1, loc2) {
        // Simple Pythagorean distance for local simulation
        const dx = (loc1.lat - loc2.lat) * 111; // 1 degree ~ 111km
        const dy = (loc1.lng - loc2.lng) * 111;
        return Math.sqrt(dx * dx + dy * dy);
    },

    getETA: function (distance, transportMode) {
        const speeds = {
            'Walking': 5,
            'Cycle': 15,
            'Bike': 30,
            'Auto': 25,
            'Truck': 20
        };
        const speed = speeds[transportMode] || 20;
        const timeHours = distance / speed;
        return Math.round(timeHours * 60) + 2; // +2 mins for prep
    }
};

const initialOrders = [];

const savedOrders = localStorage.getItem('ActiveOrders');
let ActiveOrders = savedOrders ? JSON.parse(savedOrders) : initialOrders;

window.syncOrders = function () {
    localStorage.setItem('ActiveOrders', JSON.stringify(window.ActiveOrders));
};

// 2. MARKETPLACE ITEMS (Seller List)
const savedMarketplace = localStorage.getItem('MarketplaceItems');
const MarketplaceItems = savedMarketplace ? JSON.parse(savedMarketplace) : []; // DEFAULT EMPTY AS REQUESTED


window.syncMarketplace = function () {
    localStorage.setItem('MarketplaceItems', JSON.stringify(window.MarketplaceItems));
};

window.MatchingEngine = MatchingEngine;
window.RiderRegistry = RiderRegistry;
window.ActiveOrders = ActiveOrders;
window.MarketplaceItems = MarketplaceItems;
