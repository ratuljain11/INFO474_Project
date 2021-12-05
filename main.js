
const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(400)
  .center([-100,20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("states.geojson"),
d3.csv("data.csv", function(d) {
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

