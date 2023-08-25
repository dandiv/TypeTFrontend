let map;
// initMap is now async
async function initMap() {
  // Request libraries when needed, not in the script tag.
  const { Map } = await google.maps.importLibrary("maps");
  // Short namespaces can be used.
  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

// Get mark from DB
marks = [];

// Mark image
const image =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

// Update map
initMap();
marks.forEach((mark) => {
  newMark = new google.maps.Marker({
    title: mark.address,
    position: { lat: mark.lat, lng: mark.lng },
    map,
    icon: image,
  });
});
