function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}
updateChart('King');
const svg = d3.select("#map"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(400)
  .center([-100,50])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1])
  .range(d3.schemeBlues[9]);

//color legend
var colorLegend = [];
for (let i = 0; i < 9; i++) {
  colorLegend.push(d3.schemeBlues[9][i]);
  let b = document.querySelector(".b" + i);
  b.style.backgroundColor = colorLegend[i];
}

// Load external data and boot
Promise.all([
d3.json("states.geojson"),
d3.csv("checker.csv", function(d) {
    data.set(d.code, +d.pop)
})]).then(function(loadData){

    let topo = loadData[0]
    let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
      
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )

      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .text(function(d){ return d.id})
      .attr("text-anchor", "middle")
      .style("stroke", "black")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )

      svg.append("g")
      .selectAll("labels")
      .data(topo.features)
      .enter()
      .append("text")
        .attr("x", function(d){return d3.geoPath()
            .projection(projection).centroid(d)[0];})
        .attr("y", function(d){return d3.geoPath()
            .projection(projection).centroid(d)[1];})
        .text(function(d){ return d.id})
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 7)
        .style("fill", "black")
  
})



// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width1 = 460 - margin.left - margin.right,
    height1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg1 = d3.select("#bar")
  .append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


function updateChart(countyName){
    console.log(countyName);
    // Parse the Data
    d3.csv("SVI-Washington.csv").then( function(data) {
    var temp = []; 
    for(var i = 0; i < data.length; i++) {
        if (data[i].county === countyName) {
            temp.push(data[i]);
        }
    }
    console.log(temp);

    // X axis
    const x = d3.scaleBand()
      .range([ 0, width1 ])
      .domain(temp.map(d => d.country))
      .padding(0.2);
    svg1.append("g")
      .attr("transform", `translate(0, ${height1})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(15,0)rotate(-15)")
        .style("text-anchor", "end");
    
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([ height1, 0]);
    svg1.append("g")
      .call(d3.axisLeft(y));

    var u = svg1.selectAll("rect")
        .data(temp)
    
      u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
          .attr("x", function(d) { return x(d.country); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height1 - y(d.value); })
          .attr("fill", "#69b3a2")
    
    })
    
    
}   


