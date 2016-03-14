// Build svg
var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBehavior)

svg.call(tip)

// Build box for chart
svg.append("rect")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight)

// Attach x axis and label
svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + scatterHeight + ")")
    .call(xAxis)
  .append("text")
    .classed("label", true)
    .attr("text-anchor", "end")
    .attr("x", scatterWidth)
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
    .attr("width", scatterWidth)
    .attr("height", scatterHeight)

svg.append("svg:line")
  .classed("axisLine hAxisLine", true)
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", scatterWidth)
  .attr("y2", 0)
  .attr("transform", "translate(0," + scatterHeight + ")")

objects.append("svg:line")
    .classed("axisLine vAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", scatterHeight)