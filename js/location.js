// Google Maps Implementation

// Initialize Map function (Global callback for Google Maps API)
window.initMap = async function () {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Default to New Delhi if location fails
    let userLat = 28.6139;
    let userLng = 77.2090;

    // Try to get actual user location
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
        } catch (error) {
            console.error("Geolocation denied or error:", error);
        }
    }

    // Initialize Google Map
    // Fixed view, custom styles can be added here (mapId)
    const map = new google.maps.Map(mapContainer, {
        center: { lat: userLat, lng: userLng },
        zoom: 12,
        // disableDefaultUI: true, // Commented out to allow controls
        gestureHandling: "auto", // Allowed interaction
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{ "color": "#212121" }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#757575" }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#212121" }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{ "color": "#757575" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#2c2c2c" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#000000" }]
            }
        ]
    });

    // Global InfoWindow
    const infoWindow = new google.maps.InfoWindow({
        disableAutoPan: true // Prevent map moving on hover
    });

    // 1. Draw User Location (Blue Marker)
    new google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: map,
        title: "You are here",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
        }
    });

    // Fetch and Display Landfills as Red Zones
    try {
        const response = await fetch('data/landfills.json');
        const landfills = await response.json();
        const listContainer = document.querySelector('.landfill-grid');

        if (listContainer) listContainer.innerHTML = '';

        landfills.forEach(site => {
            // Draw Red "Hazard" Circle for Landfill
            const circle = new google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                map,
                center: { lat: site.lat, lng: site.lng },
                radius: 1500, // 1.5km
                clickable: true // Enable mouse events
            });

            // Hover Events for InfoWindow
            // Simplified content: Name, Address, Type/Status only
            const contentString = `
                <div style="padding: 5px; max-width: 250px;">
                    <h3 style="margin: 0 0 5px; color: #d32f2f; font-size: 16px;">${site.name}</h3>
                    <p style="margin: 0 0 5px; font-size: 13px; color: #555;">${site.address}</p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #777;">Type: ${site.type} • Status: ${site.status}</p>
                </div>
            `;

            google.maps.event.addListener(circle, 'mouseover', function (ev) {
                // Position at the edge of the circle or center? Center is cleaner.
                infoWindow.setPosition(circle.getCenter());
                infoWindow.setContent(contentString);
                infoWindow.open(map);
            });

            google.maps.event.addListener(circle, 'mouseout', function () {
                infoWindow.close();
            });

            // Calculate Distance
            const dist = getDistanceFromLatLonInKm(userLat, userLng, site.lat, site.lng);

            // Add to List (Dynamic Rendering)
            if (listContainer) {
                const card = document.createElement('div');
                card.className = 'landfill-card';
                card.innerHTML = `
                    <div class="landfill-header">
                        <div class="landfill-name">${site.name}</div>
                        <span class="landfill-distance">${dist.toFixed(1)} km</span>
                    </div>
                    <div class="waste-types">
                        <span class="tag" style="background: rgba(255,0,0,0.1); color: #ef5350;">${site.type}</span>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                            <span style="color: var(--text-light);">Current Load</span>
                            <span style="color: ${getStatusColor(site.status)};">${site.status}</span>
                        </div>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${getCapacityWidth(site.status)}%; background: ${getStatusColor(site.status)};"></div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                        <button class="btn btn-primary btn-block" style="font-size: 0.9rem;">Schedule Drop</button>
                        <button class="btn btn-secondary btn-block" style="font-size: 0.9rem;" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}')">Navigate</button>
                    </div>
                `;
                listContainer.appendChild(card);
            }
        });

    } catch (error) {
        console.error("Error loading landfill data:", error);
    }
};

// Helper: Calculate Distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getStatusColor(status) {
    if (status === 'Available') return 'var(--primary-color)';
    if (status === 'Moderate') return 'var(--warning-color)';
    return 'var(--danger-color)';
}

function getCapacityWidth(status) {
    if (status === 'Available') return 30;
    if (status === 'Moderate') return 60;
    return 90;
}
