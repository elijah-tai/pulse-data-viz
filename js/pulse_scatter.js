d3.csv("data/protein_to_score.txt", function(data) {
  var w = 1000
  var h = 300

  var dataset = []
  var padding = 30

  var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h)

  data.forEach(function(object) {
      dataset.push([parseInt(object.index), object.protein, parseFloat(object.probability)])
  })

  var xScale = d3.scale.linear()
                       .domain([0, d3.max(dataset, d => d[0])])
                       .range([padding, w - padding])

  var yScale = d3.scale.linear()
                       .domain([0, 1])
                       .range([h - padding, padding])

  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(10)

  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5)

  console.log(dataset[2][1])

  var circles = svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[2]))
      .attr("r", 0.75)

  showName = function(dataset, index) {
      return dataset[index];
  }

  // svg.selectAll("text")
  //    .data(dataset)
  //    .enter()
  //    .append("text")
  //    .text(d => d[1])
  //    .attr("x", d => xScale(d[0]))
  //    .attr("y", d => yScale(d[2]))
  //    .attr("font-family", "sans-serif")
  //    .attr("font-size", "11px")
  //    .attr("fill", "red")

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (h - padding) + ")")
     .call(xAxis)

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + padding + ", 0)")
     .call(yAxis)

  var xLabel = svg.append("text")
     .attr("class", "x label")
     .attr("text-anchor", "end")
     .attr("x", (w / 2) + 20)
     .attr("y", h - 3)
     .text("protein number")

  var yLabel = svg.append("text")
     .attr("class", "y label")
     .attr("text-anchor", "end")
     .attr("y", 0)
     .attr("x", -(h / 2) + padding)
     .attr("dy", ".75em")
     .attr("transform", "rotate(-90)")
     .text("probability")
})