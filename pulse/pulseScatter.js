'use strict'

if (!d3.chart) d3.chart = {}

d3.chart.scatter = function() {
  var g
  var data
  var margin = { top: 50, right: 30, bottom: 50, left: 50}
  var width = scatterWidth - margin.left - margin.right,
      height = scatterHeight - margin.top - margin.bottom

  var dispatch = d3.dispatch(chart, "clicked")

  function chart(container) {
    g = container
    g.append("g")
      .classed("xaxis", true)

    g.append("g")
      .classed("yaxis", true)

    update()
  }

  chart.update = update

  function update() {

    // Build x axis
    // predefined category and label
    var xCat = "index",
        xLabel = "protein number"

    // calculate range for x axis
    var xMax = d3.max(data, d => d[xCat]) * 1.05,
        xMin = d3.min(data, d => d[xCat]),
        // If xMin > 0, set xMin = 0, else xMin
        xMin = xMin > 0 ? 0 : xMin

    // build scale for x axis
    var xScale = d3.scale.linear().range([0, width]).nice()
    xScale.domain([xMin, xMax])

    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")

    // Attach x axis and label
    var xg = g.select(".xaxis")
        .classed("x axis", true)
        .attr("transform", "translate(0," + scatterHeight + ")")
        .call(xAxis)
      .append("text")
        .classed("label", true)
        .attr("text-anchor", "end")
        .attr("x", scatterWidth)
        .attr("y", margin.bottom - 10)
        .text(xLabel)

    // Build y axis
    // predefined category and label
    var yCat = "probability",
        yLabel = "probability"

    // calculate range for y axis
    var yMax = d3.max(data, d => d[yCat]) * 1.05,
        // If yMax < 1, set yMax = 1, else, yMax
        yMax = yMax < 1 ? 1 : yMax,
        yMin = d3.min(data, d => d[yCat]),
        yMin = yMin > 0 ? 0 : yMin

    // Build scale for y axis
    var yScale = d3.scale.linear().range([height, 0])
    yScale.domain([yMin, yMax])

    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")

    // Attach y axis and label
    var yg = d3.select(".yaxis")
       .classed("y axis", true)
       .call(yAxis)
      .append("text")
       .classed("label", true)
       .attr("text-anchor", "end")
       .attr("y", -margin.left)
       .attr("dy", ".75em")
       .attr("transform", "rotate(-90)")
       .text(yCat)

    // Initialize tooltip
    var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(
                  d => "transcript: " + d["transcript"] + "<br>" 
                  + "protein: " + d["protein"] + "<br>" 
                  + yCat + ": " + d[yCat]
                )

    // Initialize zoom behaviour
    var zoomBehavior = d3.behavior.zoom()
          .x(xScale)
          .y(yScale)
          .scaleExtent([0, 500])
          .on("zoom", zoom)

    g.call(zoomBehavior)

    var objects = g.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height)

    var clickData = {
      isActive: false
    }

    var drawnData = objects.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .classed("dot", true)
        .attr("r", 2)
        .attr("transform", transform)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", d => showSameProteins(d, clickData))

    function showSameProteins(d, clickData) {
      // hasn't been clicked before
      if (!clickData.isActive) {
        objects.selectAll(".dot")
            .filter(p => d["protein"] !== p["protein"])
            .attr("r", 0.25)
        objects.selectAll(".dot")
            .filter(p => d["protein"] === p["protein"])
            .attr("r", 5)
            .transition().ease()
        clickData.isActive = !clickData.isActive
      } else { // has been clicked before
        objects.selectAll(".dot")
            .attr("r", 2)
        clickData.isActive = !clickData.isActive
      }
    }

    d3.select("#xAxis").on("click", change)

    // Reset zoom
    function change() {
      xCat = "index"
      xMax = d3.max(data, d => d[xCat])
      xMin = d3.min(data, d => d[xCat])

      zoomBehavior.x(xScale.domain([xMin, xMax]))
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
  }

  //combination getter and setter for the data attribute of the global chart variable
  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
    
  //combination getter and setter for the width attribute of the global chart variable
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
    
  //combination getter and setter for the height attribute of the global chart variable
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on")
}