//const socket = io(); // Connect to the socket server
const BASE_URL = "http://localhost:3000";
const logoutButton = document.getElementById("logoutBtn");

logoutButton.addEventListener("click", () => {
  // Show login form, hide content
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "index.html";
});

// socket.on("stockChange", (data) => {
//   initGraphs();
// });

function initGraphs() {
  // Fetch purchases
  fetch(`${BASE_URL}/purchase/purchaseCountPerDate`)
    .then((response) => response.json())
    .then((purchasesData) => {
      createBarChart(purchasesData, "purchasesChart", "count");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Fetch eanings
  fetch(`${BASE_URL}/purchase/earningsPerDate`)
    .then((response) => response.json())
    .then((earningsData) => {
      createBarChart(earningsData, "earningsChart", "totalEarnings");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Getting Alerts data from server
  var numberOfPurchases = document.getElementById("loggedUsers");
  var numberOfLogins = document.getElementById("purchases");

  $.get(`${BASE_URL}/purchase/count`, function (data) {
    numberOfPurchases.innerHTML = data;
  }).fail(function (xhr, status, error) {
    // Handle any errors here
    console.error(error);
  });

  $.get(`${BASE_URL}/user/count`, function (data) {
    numberOfLogins.innerHTML = data;
  }).fail(function (xhr, status, error) {
    // Handle any errors here
    console.error(error);
  });
}

// Function to create the bar chart
function createBarChart(data, containerId, dataType) {
  const svgWidth = 800;
  const svgHeight = 400;

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3
    .select("#" + containerId)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d._id))
    .range([0, width])
    .padding(0.1);

  let yScale;

  if (dataType === "count") {
    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .nice()
      .range([height, 0]);
  } else if (dataType === "totalEarnings") {
    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.totalEarnings)])
      .nice()
      .range([height, 0]);
  }

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d._id))
    .attr("y", (d) =>
      dataType === "count" ? yScale(d.count) : yScale(d.totalEarnings)
    )
    .attr("width", xScale.bandwidth())
    .attr(
      "height",
      (d) =>
        height -
        (dataType === "count" ? yScale(d.count) : yScale(d.totalEarnings))
    )
    .attr("fill", (d) => colorScale(d._id));

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

  svg
    .selectAll(".x-axis text")
    .attr("transform", "rotate(-45)")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .style("text-anchor", "end");
}

initGraphs();

// Create digital canvas clock
var context;
var d;
var str;
function getClock() {
  d = new Date();
  str = Calculate(d.getHours(), d.getMinutes(), d.getSeconds());

  context = clock.getContext("2d");
  context.clearRect(0, 20, 300, 200);
  context.font = "50pt poppins";
  context.fillStyle = "white";
  context.fillText(str, 20, 100);
}

function Calculate(hour, min, sec) {
  var curTime;
  if (hour < 10) curTime = "0" + hour.toString();
  else curTime = hour.toString();

  if (min < 10) curTime += ":0" + min.toString();
  else curTime += ":" + min.toString();

  if (sec < 10) curTime += ":0" + sec.toString();
  else curTime += ":" + sec.toString();
  return curTime;
}

setInterval(getClock, 100);
