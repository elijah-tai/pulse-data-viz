'use strict'

const margin = { top: 50, right: 300, bottom: 50, left: 50},
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom

var xScale = d3.scale.linear()
                     .range([0, width]).nice()

var yScale = d3.scale.linear()
                     .range([height, 0])

var xCat = "index",
    yCat = "probability"

const xLabel = "protein number",
      yLabel = "probability"

d3.csv("data/protein_to_score.txt", function(data) {
  // Build data array
  data.forEach(function(d) {
      d.index = +d.index
      d.protein = d.protein
      d.probability = +d.probability
  })

  // Calculate ranges
  var xMax = d3.max(data, d => d[xCat]) * 1.05,
      xMin = d3.min(data, d => d[xCat]),
      // If xMin > 0, set xMin = 0, else xMin
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, d => d[yCat]) * 1.05,
      // If yMax < 1, set yMax = 1, else, yMax
      yMax = yMax < 1 ? 1 : yMax,
      yMin = d3.min(data, d => d[yCat]),
      yMin = yMin > 0 ? 0 : yMin

  xScale.domain([xMin, xMax])
  yScale.domain([yMin, yMax])

  // Build axis
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")

  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")

  // Initialize tooltip
  var tip = d3.tip()
              .attr("class", "d3-tip")
              .offset([-10, 0])
              .html(
                d => "protein: " + d["protein"] + "<br>" 
                + yCat + ": " + d[yCat]
              )

  var zoomBeh = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([0, 500])
        .on("zoom", zoom)

  // Build svg
  var svg = d3.select("#scatter")
      .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh)

  svg.call(tip)

  // Build box for chart
  svg.append("rect")
      .attr("width", width)
      .attr("height", height)

  // Attach x axis and label
  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .text(xLabel)

  // Attach y axis and label
  svg.append("g")
     .classed("y axis", true)
     .call(yAxis)
    .append("text")
     .classed("label", true)
     .attr("text-anchor", "end")
     .attr("y", -margin.left)
     .attr("dy", ".75em")
     .attr("transform", "rotate(-90)")
     .text(yCat)
  
  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height)

  svg.append("svg")
    .classed("axisLine hAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("transform", "translate(0," + height + ")")

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height)

  function showSameProteins(d) {
    tip.show(d)
    // objects.selectAll(".dot")
    //       .data(data)
    //     .enter().append("circle")
    //       .classed("dot", true)
    //       .filter((d, i) => i["protein"] === d["protein"])
    //       .attr("transform", transform)

  }

  function hideSameProteins(d) {
    tip.hide(d)
  }

  // Draw datapoints
  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", 3)
      .on("mouseover", d => showSameProteins(d))
      .attr("transform", transform)
      .on("mouseout", d => hideSameProteins(d))

  d3.select("input").on("click", change)

  // Reset zoom
  function change() {
    xCat = "index"
    xMax = d3.max(data, d => d[xCat])
    xMin = d3.min(data, d => d[xCat])

    zoomBeh.x(xScale.domain([xMin, xMax]))
           .y(yScale.domain([yMin, yMax]))

    var svg = d3.select("#scatter").transition()

    svg.select(".x.axis")
      .duration(750)
      .call(xAxis)
      .select(".label")
      .text(xLabel)

    objects.selectAll(".dot")
      .transition()
      .duration(1000)
      .attr("transform", transform)
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis)
    svg.select(".y.axis").call(yAxis)

    svg.selectAll(".dot")
        .attr("transform", transform)
  }

  function transform(d) {
    return "translate(" + xScale(d[xCat]) + "," + yScale(d[yCat]) + ")"
  }
})