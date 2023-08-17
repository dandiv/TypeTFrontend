const contentDiv = document.getElementById("content");
const firstEnterDiv = document.getElementById("firstEnter");
const loginButton = document.getElementById("loginBtn");
const logoutButton = document.getElementById("logoutBtn");

// Check if the user is already logged in on page load
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn === "true") {
  // User is logged in, show content, hide login form
  contentDiv.style.display = "block";
  firstEnterDiv.style.display = "none";
} else {
  // User is not logged in, show login form, hide content
  contentDiv.style.display = "none";
  firstEnterDiv.style.display = "block";
}

// Add click event listener to the login button
loginButton.addEventListener("click", () => {
  // const username = document.getElementById("username").value;
  // const password = document.getElementById("password").value;
  if (true) {
    //if (isValidLogin(username, password)) {
    // Hide login form, show content
    localStorage.setItem("isLoggedIn", "true");
    firstEnterDiv.style.display = "none";
    contentDiv.style.display = "block";
  } else {
    alert("Invalid login credentials");
  }
});

// Add click event listener to the logout button
logoutButton.addEventListener("click", () => {
  // Show login form, hide content
  firstEnterDiv.style.display = "block";
  contentDiv.style.display = "none";
  localStorage.setItem("isLoggedIn", "false");
});

// Placeholder function for login validation
function isValidLogin(username, password) {
  // Implement your own logic to validate the login
  // For demonstration purposes, return true
  return true;
}
