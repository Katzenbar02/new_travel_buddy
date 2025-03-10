// awesome-places.js
let map;
let places = [];
let markers = [];

function initMap() {
  // Initialize Leaflet map, centered on Rexburg
  map = L.map('map').setView([43.826, -111.787], 7);
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);
}

async function loadPlaces() {
  try {
    const response = await fetch('http://localhost:5000/destinations');
    places = await response.json();
    console.log("Places loaded:", places);

    const select = document.getElementById('placeSelect');
    places.forEach((place, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = place.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading places:", err);
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

window.addEventListener('load', () => {
  initMap();
  loadPlaces();
  document.getElementById('showPlaceBtn').addEventListener('click', showSelectedPlace);
});
