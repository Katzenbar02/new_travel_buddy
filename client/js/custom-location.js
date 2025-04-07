document.getElementById("customLocationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Ensure the user is logged in by checking for a token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a custom location.");
      window.location.href = "login.html";
      return;
    }
  
    // Retrieve form values
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const pictures = [
      document.getElementById("picture1").value.trim(),
      document.getElementById("picture2").value.trim(),
      document.getElementById("picture3").value.trim()
    ];
    const longitude = parseFloat(document.getElementById("longitude").value);
    const latitude = parseFloat(document.getElementById("latitude").value);
    const location = { coordinates: [longitude, latitude] };
  
    // Build the payload
    const payload = { name, description, pictures, location };
  
    try {
      const response = await fetch("http://localhost:5000/destinations/custom", {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           "Authorization": "Bearer " + token
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Custom location submitted successfully!");
        // Redirect to the destinations page (or update the UI as desired)
        window.location.href = "awesome-places.html";
      } else {
        alert("Submission failed: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting custom location:", error);
      alert("An error occurred. Please try again later.");
    }
  });
  