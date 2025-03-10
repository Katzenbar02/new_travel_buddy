document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful. Please log in.");
        window.location.href = "login.html";
      } else {
        alert("Registration failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during registration.");
    }
  });
  