'use strict'

if (!d3.chart) d3.chart = {}


d3.chart.table2 = function() {
	var g
	var svg
	var data
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
			tableWidth = 1000 - margin.left - margin.right,
			tableHeight = 400 - margin.top - margin.bottom,
			elmHeight = 10,
			pfamHeight = 10

	var widthScale,
			yScale

	var clickData = {
		isActive: false,
		prevClicked: null
	}

	var dispatch = d3.dispatch(chart, "clicked")

	function chart(container) {
		g = container
		update()
	}

	chart.update = update
	chart.showProteins = showProteins

	function showProteins(filteredData) {
		showSameProteins(filteredData[0])
	}

	function showSameProteins(d) {
		chart.refreshTable(d)
	}

	function update() {
		var prevSort = null
		refreshTable(null)
		chart.refreshTable = refreshTable
		svg = g.append("svg")
			.attr("width", tableWidth)
			.attr("height", tableHeight)

		// TODO: Need to implement d3.scale for transcript widths
		function refreshTable(d) {
			if (svg) {
				svg.selectAll("rect").remove()
			}
			if (d != null) {
				data = data.filter(p => d["protein"] === p["protein"])

				// dynamic tableHeight
				tableHeight = data.length * 30

				var maxWidth = d3.max(data, d => d.width)
				
				widthScale = d3.scale.linear()
									.domain([0, maxWidth])
									.range([0, tableWidth])

				yScale = d3.scale.linear()
									.domain([0, data.length])
									.range([0, tableHeight])

				var xAxis = d3.svg.axis()
											.scale(widthScale)
											.orient("bottom")
				
				var yAxis = d3.svg.axis()
											.scale(yScale)
											.orient("left")

				// console.log(data)

				// draw basic rectangle for protein
				var transcripts = svg.selectAll("rect")
					.data(data)
					.enter()
					.append("rect").classed("table2", true)
					.attr("rx", 6)
					.attr("ry", 6)
					.attr("x", (d) => 0)
					.attr("y", (d, i) => yScale(i))
					.attr("width", function(d) {
						return widthScale(d.end - d.start)
					})
					.attr("fill", "#FE9949")
					.attr("height", "10")

				// overlay pfam data in red
				// data.forEach(function(d, index) {
				// 	d.elms.forEach(function(elm) {
				// 		svg.datum(function() {
				// 			// console.log(index, elm)
				// 			return {index: index, elm: elm}
				// 		})
				// 			.append("rect").classed("elm-label", true)
				// 			.attr("x", function(d) {
				// 				return d.elm.start
				// 			})
				// 			.attr("y", function(d, index) {
				// 				return (d.index * (tableHeight / data.length))
				// 			})
				// 			.attr("width", function(d) {
				// 				return d.elm.end - d.elm.start
				// 			})
				// 			.attr("rx", 6)
				// 			.attr("ry", 6)
				// 			.attr("height", "10")
				// 			.attr("fill", "#1B9AF7")
				// 	})
					
				// 	// d.pfam.forEach(function(pfam) {
				// 	// 	svg.datum(pfam)
				// 	// 		.append("rect").classed("pfam-label", true)
				// 	// 		.attr("x", function(pfam) {
				// 	// 			return pfam.start
				// 	// 		})
				// 	// 		.attr("y", function(pfam, index) {
				// 	// 			return (index * 40 + 20)
				// 	// 		})
				// 	// 		.attr("width", function(pfam) {
				// 	// 			return pfam.end - pfam.start
				// 	// 		})
				// 	// 		.attr("rx", 6)
				// 	// 		.attr("ry", 6)
				// 	// 		.attr("height", "10")
				// 	// 		.attr("fill", "#FC880F")
				// 	// })
				// })

			}
		}
	}

	chart.resetSelection = function() {
		if (clickData.prevClicked) {
			clickData.prevClicked.style("background-color", "#ffffff")	
		}
	}

	chart.data = function(value) {
		if (!arguments.length) return data
		data = value
		return chart
	}

	chart.width = function(value) {
		if(!arguments.length) return tableWidth
		tableWidth = value
		return chart
	}

	chart.height = function(value) {
		if(!arguments.length) return tableHeight
		tableHeight = value
		return chart
	}

	// returns dispatch method bound to chart (target) 
	// with "on" name
	return d3.rebind(chart, dispatch, "on")
}