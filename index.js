const contentDiv = document.getElementById("catalog");
const firstEnterDiv = document.getElementById("firstEnter");
const loginButton = document.getElementById("loginBtn");
const logoutButton = document.getElementById("logoutBtn");

// Login section

// Check if the user is already logged in on page load
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn === "true") {
  // User is logged in, show content, hide login form
  contentDiv.classList.remove("hidden");
  firstEnterDiv.classList.add("hidden");
}

// login for existing users
function loginUser(username, password) {
  const bodyData = {
    username: username,
    password: password,
  };
  $.ajax({
    url: "http://localhost:3000/user/login",
    method: "POST",
    dataType: "json",
    data: bodyData,
    success: function (data) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      contentDiv.classList.remove("hidden");
      firstEnterDiv.classList.add("hidden");
      location.reload();
    },
    error: function (xhr, status, error) {
      if (error == "Unauthorized") {
        window.alert(xhr.responseJSON.error);
      } else {
        console.error("Error:", error);
      }
    },
  });
}

//TODO: create sign up
function createUser(username, password) {
  const bodyData = {
    username: username,
    password: password,
  };
  $.ajax({
    url: "http://localhost:3000/user",
    method: "POST",
    dataType: "json",
    data: bodyData,
    success: function (data) {
      alert("User was created successfully");
      return data;
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}

// Add click event listener to the login button
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  loginUser(username, password);
});

// Add click event listener to the logout button
logoutButton.addEventListener("click", () => {
  // Show login form, hide content
  firstEnterDiv.style.display = "block";
  contentDiv.style.display = "none";
  localStorage.setItem("isLoggedIn", "false");
});

//-------------------------------------------------------------------
// Catalog Section

let cards = [];

// get items from server
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

// create catalog
function createGridItems(cardsData) {
  var currentRow = document.createElement("div");
  currentRow.classList.add("row", "m-4");
  container.appendChild(currentRow);

  cardsData.forEach((result, idx) => {
    var colDiv = document.createElement("div");
    colDiv.classList.add("col-md-3", "d-flex", "align-items-stretch");

    if (idx % 4 === 0 && idx > 0) {
      container.appendChild(currentRow);
      currentRow = document.createElement("div");
      currentRow.classList.add("row", "m-4");
    }

    // Construct card content
    colDiv.innerHTML = `
      <div class="col p-3 d-flex align-items-stretch">
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

  container.appendChild(currentRow);
}

// Add item to cart
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
      console.error("Error:", error);
    },
  });
}

function navigateToSection(url) {
  window.location.href = url;
}

// Filter items
document.addEventListener("DOMContentLoaded", function () {
  const applyFiltersBtn = document.getElementById("applyFilters");

  applyFiltersBtn.addEventListener("click", function () {
    const colorFilter = document.getElementById("colorFilter").value;
    const sizeFilter = document.getElementById("sizeFilter").value;
    const minPrice = parseFloat(document.getElementById("minPrice").value);
    const maxPrice = parseFloat(document.getElementById("maxPrice").value);

    fetch(
      `http://localhost:3000/item/price/${minPrice}/${maxPrice}?color=${colorFilter}&size=${sizeFilter}`
    )
      .then((response) => response.json())
      .then((data) => {
        createGridItems(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
