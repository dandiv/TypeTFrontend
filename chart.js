document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.createElement("div");
  navbarContainer.innerHTML = '<object type="text/html" data="navbar.html" />';
  document.body.prepend(navbarContainer);
});
