// itinerary.js
let map, routingControl;
let destinations = [];       // All destinations from backend
let selectedDestinations = [];  // User-selected destinations

// Initialize Leaflet map
function initMap() {
  map = L.map('itineraryMap').setView([43.826, -111.787], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);
}

// Load destinations from your backend
async function loadDestinations() {
  try {
    const response = await fetch('http://localhost:5000/destinations');
    destinations = await response.json();
    populateDestinationsList();
  } catch (err) {
    console.error('Error loading destinations:', err);
  }
}

// Populate the checklist with destinations
function populateDestinationsList() {
  const container = document.getElementById('destinationsList');
  container.innerHTML = '';
  destinations.forEach((dest, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <input type="checkbox" id="dest_${index}" data-index="${index}">
      <label for="dest_${index}">${dest.name}</label>
    `;
    container.appendChild(div);
  });
}

// Gather selected destinations from checkboxes
function getSelectedDestinations() {
  selectedDestinations = [];
  const checkboxes = document.querySelectorAll('#destinationsList input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const index = parseInt(checkbox.getAttribute('data-index'));
      selectedDestinations.push(destinations[index]);
    }
  });
  return selectedDestinations;
}

// A simple nearest-neighbor algorithm to order destinations
function optimizeRoute(destArray) {
  if (destArray.length === 0) return [];
  let unvisited = [...destArray];
  const optimized = [];
  // Start with the first destination in the array
  let current = unvisited.shift();
  optimized.push(current);
  
  while (unvisited.length) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const d = distance(current.location.coordinates, unvisited[i].location.coordinates);
      if (d < nearestDistance) {
        nearestDistance = d;
        nearestIndex = i;
      }
    }
    current = unvisited.splice(nearestIndex, 1)[0];
    optimized.push(current);
  }
  return optimized;
}

// Helper function: approximate distance (Euclidean for small areas)
function distance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Display the optimized route on the map
function showOptimizedRoute() {
  getSelectedDestinations();
  if (selectedDestinations.length === 0) {
    alert('Please select at least one destination.');
    return;
  }
  
  // Optimize the order of destinations
  const routeOrder = optimizeRoute(selectedDestinations);
  
  // Remove any existing routing control
  if (routingControl) {
    map.removeControl(routingControl);
  }
  
  // Create waypoints for routing: Leaflet expects [lat, lng]
  const waypoints = routeOrder.map(dest => {
    return L.latLng(dest.location.coordinates[1], dest.location.coordinates[0]);
  });
  
  routingControl = L.Routing.control({
    waypoints: waypoints,
    routeWhileDragging: false,
    createMarker: function(i, waypoint, n) {
      return L.marker(waypoint.latLng).bindPopup(routeOrder[i].name);
    }
  }).addTo(map);
}

// Save itinerary (here we demo saving to localStorage)
function saveItinerary() {
  getSelectedDestinations();
  if (selectedDestinations.length === 0) {
    alert('No destinations selected to save.');
    return;
  }
  const optimized = optimizeRoute(selectedDestinations);
  const itinerary = {
    timestamp: new Date().toISOString(),
    destinations: optimized.map(dest => ({ id: dest._id, name: dest.name }))
  };
  localStorage.setItem('savedItinerary', JSON.stringify(itinerary));
  alert('Itinerary saved!');
}

window.addEventListener('load', () => {
  initMap();
  loadDestinations();
  document.getElementById('optimizeBtn').addEventListener('click', showOptimizedRoute);
  document.getElementById('saveBtn').addEventListener('click', saveItinerary);
});
