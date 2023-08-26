document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const purchaseBtn = document.getElementById("purchase-btn");
  const purchaseModal = document.getElementById("purchase-modal");
  const managerPage = document.getElementById("manager-page");
  const logoutButton = document.getElementById("logoutBtn");

  logoutButton.addEventListener("click", () => {
    // Show login form, hide content
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "index.html";
  });

  const username = localStorage.username;
  let userCartItems = [];

  if (localStorage.isManager) {
    managerPage.classList.remove("hidden");
  }
  // get user's items from server
  fetch("http://localhost:3000/user/cart/" + username, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((itemsIds) => {
      localStorage.setItem("itemsIds", JSON.stringify(itemsIds));
      const fetchPromises = [];

      // Iterate over item IDs and send a fetch request for each
      itemsIds.forEach((id) => {
        const fetchPromise = fetch("http://localhost:3000/item/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const foundItem = userCartItems.find((item) => item.id === id);
            if (foundItem) {
              foundItem.quantity++;
            } else {
              const cartItem = {
                id: id,
                title: data.title,
                price: data.price,
                quantity: 1,
                image: data.img,
                size: data.size,
                color: data.color,
              };
              userCartItems.push(cartItem);
            }
          });

        fetchPromises.push(fetchPromise);
      });

      return Promise.all(fetchPromises);
    })
    .then(() => {
      localStorage.setItem("cart", JSON.stringify(userCartItems));
      displayCartItems();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Function to display items in the cart
  function displayCartItems() {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    userCartItems.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <div class="item-details">
  <p class="item-detail"><span class="detail-label">Price:</span> $${item.price.toFixed(
    2
  )}</p>
  <p class="item-detail"><span class="detail-label">Quantity:</span> ${
    item.quantity
  }</p>
  <p class="item-detail"><span class="detail-label">Size:</span> ${
    item.size
  }</p>
  <p class="item-detail"><span class="detail-label">Color:</span> ${
    item.color
  }</p>
  <p class="item-detail"><span class="detail-label">Total:</span> $${(
    item.price * item.quantity
  ).toFixed(2)}</p>
</div>
            `;

      cartItems.appendChild(itemDiv);

      totalPrice += item.price * item.quantity;
    });

    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }

  // Show purchase modal when the "Purchase" button is clicked
  purchaseBtn.addEventListener("click", function () {
    purchaseModal.style.display = "flex";
    purchaseModal.classList.remove("hidden");
  });

  // Get the <span> element that closes the modal
  const closeButton = document.getElementsByClassName("close-button")[0];

  // When the user clicks on <span> (x), close the modal
  closeButton.onclick = function () {
    purchaseModal.style.display = "none";
  };

  // Credit Card validations
  const cardNumberInput = document.getElementById("card-number");
  const expiryInput = document.getElementById("expiry");
  const cvvInput = document.getElementById("cvv");

  // Regular expressions for validation
  const cardNumberRegex = /^\d{16}$/; // 16 digits
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/; // MM/YYYY format
  const cvvRegex = /^\d{3}$/; // 3 digits

  // Function to validate the credit card number
  function validateCardNumber() {
    if (!cardNumberRegex.test(cardNumberInput.value)) {
      alert("Please enter a valid 16-digit credit card number.");
      cardNumberInput.focus();
      return false;
    }
    return true;
  }

  // Function to validate the expiry date
  function validateExpiry() {
    if (!expiryRegex.test(expiryInput.value)) {
      alert("Please enter a valid expiry date in MM/YYYY format.");
      expiryInput.focus();
      return false;
    }
    return true;
  }

  // Function to validate the CVV
  function validateCVV() {
    if (!cvvRegex.test(cvvInput.value)) {
      alert("Please enter a valid 3-digit CVV.");
      cvvInput.focus();
      return false;
    }
    return true;
  }

  // Handle form submission (you can add validation and submission logic here)
  const checkoutForm = document.getElementById("checkout-form");

  checkoutForm.addEventListener("submit", function (e) {
    if (!validateCardNumber() || !validateExpiry() || !validateCVV()) {
      e.preventDefault(); // Prevent form submission if validation fails
    } else {
      itemIds = localStorage.itemsIds;
      itemIds = JSON.parse(itemIds);
      const userCart = {
        username: localStorage.username,
        itemIds: itemIds,
      };
      const addressTextArea = document.getElementById("user-address");
      const userAddress = addressTextArea.value;
      const cartTotalText = cartTotal.textContent;
      const purchaseBody = {
        address: userAddress,
        buyer: localStorage.username,
        items: JSON.parse(localStorage.itemsIds),
        total: parseInt(cartTotalText.replace(/[^0-9]/g, ""), 10) / 100,
      };
      fetch("http://localhost:3000/purchase/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Call .json() once
        })
        .then((purchase) => {
          const userPurchase = {
            username: localStorage.username,
            purchaseId: purchase._id,
          };
          return fetch("http://localhost:3000/user/purchase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userPurchase),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Call .json() once again if needed
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      fetch("http://localhost:3000/user/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCart),
      });
      window.alert("Thank you! Your delivery will arrive as soon as possible");
    }
  });
});
