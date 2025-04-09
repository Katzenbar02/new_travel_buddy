// awesome-places.js

let map;
let places = [];
let markers = [];

// Initialize the Leaflet map, centered on Rexburg (or your default coordinates)
function initMap() {
  map = L.map('map').setView([43.826, -111.787], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);
}

// Load destinations with optional filters
async function loadFilteredDestinations() {
  const type = document.getElementById("filterType").value;
  const lat = document.getElementById("userLat").value;
  const lng = document.getElementById("userLng").value;
  const maxDistance = document.getElementById("maxDistance").value;

  // Build query string from provided parameters
  let queryParams = [];
  if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
  if (lat && lng && maxDistance) {
    queryParams.push(`lat=${encodeURIComponent(lat)}`);
    queryParams.push(`lng=${encodeURIComponent(lng)}`);
    queryParams.push(`maxDistance=${encodeURIComponent(maxDistance)}`);
  }
  const queryString = queryParams.length ? "?" + queryParams.join("&") : "";

  try {
    const response = await fetch("http://localhost:5000/destinations" + queryString);
    places = await response.json();
    console.log("Filtered Destinations:", places);

    // Clear the select and repopulate with the filtered destinations
    const select = document.getElementById('placeSelect');
    select.innerHTML = '<option value="">-- Select a Place --</option>';
    places.forEach((place, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = place.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading destinations:", err);
  }
}

function showSelectedPlace() {
  const select = document.getElementById('placeSelect');
  const index = select.value;
  if (index === "") return;

  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const place = places[index];
  const lat = place.location.coordinates[1];
  const lng = place.location.coordinates[0];

  // Center map on selected place and add marker
  map.setView([lat, lng], 10);
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`
    <h3>${place.name}</h3>
    <p>${place.description}</p>
    <div>
      ${place.pictures.map(url => `<img src="${url}" style="width:80px;margin-right:5px;">`).join('')}
    </div>
  `);
  markers.push(marker);
}

// Event Listener for the Filter Button
document.getElementById("filterBtn").addEventListener("click", loadFilteredDestinations);

// Event Listener for the "Show on Map" button
document.getElementById("showPlaceBtn").addEventListener("click", showSelectedPlace);

// Initialize the map and load destinations on page load
window.addEventListener('load', () => {
  initMap();
  loadFilteredDestinations();
});
