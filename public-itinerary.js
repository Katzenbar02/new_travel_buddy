async function loadItinerary() {
    const params = new URLSearchParams(window.location.search);
    const itineraryId = params.get('id');
    if (!itineraryId) {
      document.getElementById("itineraryDisplay").textContent = "No itinerary ID provided.";
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/public/itineraries/${itineraryId}`);
      if (!res.ok) {
        throw new Error("Itinerary not found");
      }
      const itinerary = await res.json();
      displayItinerary(itinerary);
    } catch (err) {
      document.getElementById("itineraryDisplay").textContent = "Error loading itinerary: " + err.message;
    }
  }
  
  function displayItinerary(itinerary) {
    const container = document.getElementById("itineraryDisplay");
    container.innerHTML = `
      <h2>${itinerary.name}</h2>
      <p><strong>Destinations:</strong> ${itinerary.destinations.map(d => d.name).join(", ")}</p>
    `;
  }
  
  loadItinerary();
  