document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      window.location.href = "login.html";
      return;
    }
  
    // Load basic profile info
    fetch("http://localhost:5000/profile", {
      headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("email").value = data.email;
    })
    .catch(err => console.error("Error loading profile:", err));
  
    // Handle profile update form submission
    document.getElementById("profileForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = document.getElementById("password").value.trim();
      const updateData = {};
      if (password) {
        updateData.password = password;
      }
      try {
        const res = await fetch("http://localhost:5000/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify(updateData)
        });
        const data = await res.json();
        if (res.ok) {
          alert("Profile updated successfully!");
          document.getElementById("password").value = "";
        } else {
          alert("Update failed: " + data.error);
        }
      } catch (err) {
        console.error("Error updating profile:", err);
      }
    });
  
    // Load favorites
    function loadFavorites() {
      fetch("http://localhost:5000/favorites", {
        headers: { "Authorization": "Bearer " + token }
      })
      .then(res => res.json())
      .then(data => {
        const favoritesList = document.getElementById("favoritesList");
        favoritesList.innerHTML = "";
        data.favorites.forEach(item => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
          li.textContent = item.name;
          const btn = document.createElement("button");
          btn.className = "btn btn-sm btn-danger";
          btn.textContent = "Remove";
          btn.addEventListener("click", () => removeFavorite(item._id));
          li.appendChild(btn);
          favoritesList.appendChild(li);
        });
      })
      .catch(err => console.error("Error loading favorites:", err));
    }
  
    // Remove a favorite
    async function removeFavorite(id) {
      try {
        const res = await fetch("http://localhost:5000/favorites/" + id, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        if (res.ok) {
          alert("Favorite removed.");
          loadFavorites();
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    }
  
    // Load history
    function loadHistory() {
      fetch("http://localhost:5000/history", {
        headers: { "Authorization": "Bearer " + token }
      })
      .then(res => res.json())
      .then(data => {
        const historyList = document.getElementById("historyList");
        historyList.innerHTML = "";
        data.history.forEach(item => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
          li.textContent = item.name;
          const btn = document.createElement("button");
          btn.className = "btn btn-sm btn-danger";
          btn.textContent = "Remove";
          btn.addEventListener("click", () => removeHistory(item._id));
          li.appendChild(btn);
          historyList.appendChild(li);
        });
      })
      .catch(err => console.error("Error loading history:", err));
    }
  
    // Remove a history item
    async function removeHistory(id) {
      try {
        const res = await fetch("http://localhost:5000/history/" + id, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        if (res.ok) {
          alert("History item removed.");
          loadHistory();
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error("Error removing history item:", err);
      }
    }
  
    // Initial load
    loadFavorites();
    loadHistory();
  });
  