const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Creating purchases chart

// Declare the x (horizontal position) scale.
const x = d3
  .scaleUtc()
  .domain([new Date("2023-01-01"), new Date("2024-01-01")])
  .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3
  .scaleLinear()
  .domain([0, 100])
  .range([height - marginBottom, marginTop]);

// Create the SVG container.
const purchasesSvg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height);

// Add the x-axis.
purchasesSvg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x));

// Add the y-axis.
purchasesSvg
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y));

purchasesChart.append(purchasesSvg.node());

const svgLogins = d3.create("svg").attr("width", width).attr("height", height);

// Earnings per day

// Add the x-axis.
svgEarnings
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x));

// Add the y-axis.
svgEarnings
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y));

earningsChart.append(svgEarnings.node());

// Getting Alerts data from server
var numberOfPurchases;
var numberOfLogins;

$.get("http://localhost:3000/purchases/count", function (data) {
  numberOfPurchases = data;
  purchases.textContent(numberOfPurchases);
}).fail(function (xhr, status, error) {
  // Handle any errors here
  console.error(error);
});

$.get("http://localhost:3000/users/count", function (data) {
  numberOfUsers = data;
  loggedUsers.textContent(numberOfUsers);
}).fail(function (xhr, status, error) {
  // Handle any errors here
  console.error(error);
});
