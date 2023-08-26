document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const purchaseBtn = document.getElementById("purchase-btn");
  const purchaseModal = document.getElementById("purchase-modal");
  const username = localStorage.username;
  let userCartItems = [];

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
              };
              userCartItems.push(cartItem);
            }
          });

        fetchPromises.push(fetchPromise);
      });

      return Promise.all(fetchPromises);
    })
    .then(() => {
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

  // Event listener for form submission
  document
    .querySelector("form")
    .addEventListener("submit", function (event) {});

  // Handle form submission (you can add validation and submission logic here)
  const checkoutForm = document.getElementById("checkout-form");

  checkoutForm.addEventListener("submit", function (e) {
    if (!validateCardNumber() || !validateExpiry() || !validateCVV()) {
      e.preventDefault(); // Prevent form submission if validation fails
    } else {
      // Replace this with your purchase logic (e.g., sending data to a server)
      alert("Purchase Successful!");
      checkoutForm.reset();
      purchaseForm.classList.add("hidden");
    }
  });
});
