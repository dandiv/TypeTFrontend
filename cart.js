// script.js

// Function to add an item to the cart
function addToCart(productName, productPrice) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = { name: productName, price: productPrice };
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Function to remove an item from the cart
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Function to display cart items and total
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsElement = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  let total = 0;

  cartItemsElement.innerHTML = "";

  cart.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${item.name} - $${item.price.toFixed(
      2
    )} <button onclick="removeFromCart(${index})">Remove</button>`;
    cartItemsElement.appendChild(listItem);
    total += item.price;
  });

  cartTotalElement.textContent = total.toFixed(2);
}

// Initialize the page
displayCart();
