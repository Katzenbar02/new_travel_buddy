document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the reset token from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      alert("No reset token provided.");
      return;
    }
    // Save token to hidden field so it can be sent with the form
    document.getElementById("resetToken").value = token;
  
    // Handle the reset password form submission
    document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const newPassword = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("passwordConfirm").value;
      const resetToken = document.getElementById("resetToken").value;
  
      if (newPassword !== passwordConfirm) {
        alert("Passwords do not match.");
        return;
      }
  
      try {
        const res = await fetch("http://localhost:5000/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: resetToken,
            password: newPassword
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert("Password reset successful! You can now log in with your new password.");
          window.location.href = "login.html";
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error("Error during password reset:", err);
        alert("An error occurred. Please try again later.");
      }
    });
  });
  