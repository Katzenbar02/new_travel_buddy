// Retrieve JWT token from localStorage
const token = localStorage.getItem("token");

if (!token) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

// Load itineraries for the logged-in user
async function loadItineraries() {
  try {
    const response = await fetch("http://localhost:5000/itineraries", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const itineraries = await response.json();
    displayItineraries(itineraries);
  } catch (error) {
    console.error("Error loading itineraries:", error);
  }
}

function displayItineraries(itineraries) {
  const container = document.getElementById("itineraryList");
  container.innerHTML = "";
  itineraries.forEach(itinerary => {
    const div = document.createElement("div");
    div.classList.add("itinerary-item");
    div.innerHTML = `
      <h3>${itinerary.name}</h3>
      <p>Destinations: ${itinerary.destinations.map(dest => dest.name).join(", ")}</p>
      <button onclick="deleteItinerary('${itinerary._id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

// Handle itinerary creation form submission
document.getElementById("itineraryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("itineraryName").value;
  const destinationsInput = document.getElementById("destinations").value;
  // For simplicity, expecting destination IDs separated by commas.
  const destIds = destinationsInput.split(",").map(id => id.trim());
  
  try {
    const response = await fetch("http://localhost:5000/itineraries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ name, destinations: destIds })
    });
    const data = await response.json();
    if (response.ok) {
      alert("Itinerary created!");
      loadItineraries();
    } else {
      alert("Error creating itinerary: " + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Delete itinerary by ID
async function deleteItinerary(id) {
  try {
    const response = await fetch("http://localhost:5000/itineraries/" + id, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const data = await response.json();
    if (response.ok) {
      alert("Itinerary deleted!");
      loadItineraries();
    } else {
      alert("Error deleting itinerary: " + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayItineraries(itineraries) {
  const container = document.getElementById("itineraryList");
  container.innerHTML = "";
  itineraries.forEach(itinerary => {
    const div = document.createElement("div");
    div.classList.add("itinerary-item");
    div.innerHTML = `
      <h3>${itinerary.name}</h3>
      <p>Destinations: ${itinerary.destinations.map(dest => dest.name).join(", ")}</p>
      <button onclick="deleteItinerary('${itinerary._id}')">Delete</button>
      <button onclick="shareItinerary('${itinerary._id}')">Share</button>
    `;
    container.appendChild(div);
  });
}

function shareItinerary(itineraryId) {
  const shareLink = `${window.location.origin}/public-itinerary.html?id=${itineraryId}`;
  window.prompt("Share this itinerary link:", shareLink);
}


window.addEventListener("load", loadItineraries);
