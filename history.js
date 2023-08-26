document.addEventListener("DOMContentLoaded", () => {
  // Replace this with your API endpoint to fetch purchase history
  const username = localStorage.username;
  const logoutButton = document.getElementById("logoutBtn");

  logoutButton.addEventListener("click", () => {
    // Show login form, hide content
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "index.html";
  });

  let purchaseRequest = "http://localhost:3000/purchase/buyerId/" + username;

  if (localStorage.isManager == "true") {
    purchaseRequest = "http://localhost:3000/purchase/";
  }

  fetch(purchaseRequest)
    .then((response) => response.json())
    .then((data) => {
      const purchaseList = document.getElementById("purchase-list");

      // Create an array of promises for fetching item details
      const itemDetailPromises = data.map((purchase) => {
        return Promise.all(
          purchase.items.map((itemId) => {
            return fetch("http://localhost:3000/item/" + itemId).then(
              (response) => response.json()
            );
          })
        );
      });

      // Wait for all item detail requests to complete
      return Promise.all(itemDetailPromises).then((itemsDetails) => {
        data.forEach((purchase, index) => {
          const purchaseItem = document.createElement("li");
          purchaseItem.classList.add("purchase-item");
          const itemsImages = [];
          const itemsDescriptions = [];

          // Now, itemsDetails[index] contains the details of items for this purchase
          purchase.items.forEach((itemId, itemIndex) => {
            const item = itemsDetails[index][itemIndex];
            itemsImages.push(`<img src="${item.img}" alt="${item.name}">`);
            itemsDescriptions.push(`<h2>${item.title}</h2>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Size: ${item.size}</p>
            <p>Color: ${item.color}</p>`);
          });

          if (localStorage.isManager == "true") {
            purchaseItem.innerHTML = `
            <p class="purchase-user">User: ${purchase.buyer} </p>
            <p class="purchase-time">Purchase Time: ${new Date(
              purchase.purchaseDate
            ).toLocaleString()}</p>
            <div class="item-details">
              ${itemsImages.join("")}
              ${itemsDescriptions.join("")}
            </div>
            <p class="purchase-address">Address: ${purchase.address}</p>
            <p class="purchase-total">Total: $${purchase.total.toFixed(2)}</p>
          `;
          } else {
            purchaseItem.innerHTML = `
                <p class="purchase-time">Purchase Time: ${new Date(
                  purchase.purchaseDate
                ).toLocaleString()}</p>
                <div class="item-details">
                ${itemsImages.join("")}
                ${itemsDescriptions.join("")}
                </div>
                <p class="purchase-address">Address: ${purchase.address}</p>
                <p class="purchase-total">Total: $${purchase.total.toFixed(
                  2
                )}</p>
            `;
          }

          purchaseList.appendChild(purchaseItem);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
