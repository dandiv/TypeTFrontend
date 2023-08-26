// Mark image
let map;
// initMap is now async
async function initMap() {
  // Request libraries when needed, not in the script tag.
  const { Map } = await google.maps.importLibrary("maps");
  // Short namespaces can be used.
  map = new Map(document.getElementById("map"), {
    center: { lat: 32.0853, lng: 34.7818 },
    zoom: 8,
  });

  // Get mark from DB
  fetch("http://localhost:3000/storeLocation/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Couldn't get stores location - request failed with Response status code:",
          response.status
        );
      }
      return response.json();
    })
    .then((marks) => {
      marks.forEach((mark) => {
        newMark = new google.maps.Marker({
          title: mark.address,
          position: { lat: mark.lat, lng: mark.lng },
          map,
          // icon: image,
        });
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Update map
initMap();
