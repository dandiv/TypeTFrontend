const contentDiv = document.getElementById("content");
const firstEnterDiv = document.getElementById("firstEnter");
const loginButton = document.getElementById("loginBtn");
const logoutButton = document.getElementById("logoutBtn");

// Handle login and navigation

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
  const username = document.getElementById("username").value;
  // const password = document.getElementById("password").value;
  if (true) {
    //if (isValidLogin(username, password)) {
    // Hide login form, show content
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
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

let cards = [];

$(document).ready(function () {
  $.get("http://localhost:3000/item", function (data) {
    // Handle the successful response here
    cards = data;
    createGridItems();

    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Extract product information from the clicked element
        const itemElement = button.parentElement.parentElement;
        const itemId = itemElement.id;
        addItemToCart(itemId);
      });
    });
  }).fail(function (xhr, status, error) {
    // Handle any errors here
    console.error(error);
  });
});

const container = document.getElementById("cardsInfo");
const gridRow = document.getElementById("cardsInfo");

function createGridItems() {
  var currentRow = document.createElement("div");
  currentRow.classList.add("row", "m-4");
  container.appendChild(currentRow);

  cards.forEach((result, idx) => {
    const colDiv = document.createElement("div");
    colDiv.classList.add("col-md-3");

    // Construct card content
    colDiv.innerHTML = `
      <div class="col p-3">
        <div id=${result._id} class="card">
          <img src=${result.img} class="card-img-top" alt="itemInage">
          <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="card-text">${result.description}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${result.price} ₪</li>
          </ul>
          <div class="card-body">
            <button type="button" class="btn btn-secondary">Buy Now</button>
            <button type="button" class="btn btn-secondary add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    currentRow.appendChild(colDiv);
  });
}

function addItemToCart(itemId) {
  const bodyData = {
    username: localStorage.username,
    itemId: itemId,
  };
  $.ajax({
    url: "http://localhost:3000/user/cart",
    method: "POST",
    dataType: "json",
    data: bodyData,
    success: function (data) {
      // Alert the user that the product was added to the cart
      alert(`This Item was added to the cart!`);
    },
    error: function (xhr, status, error) {
      // Handle any errors here
      console.error("Error:", error);
    },
  });
}

function navigateToSection(url) {
  window.location.href = url;
}
