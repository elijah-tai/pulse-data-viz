'use strict'

if (!d3.chart) d3.chart = {}


d3.chart.table2 = function() {
	var g
	var svg
	var data
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
			tableWidth = 1000 - margin.left - margin.right,
			tableHeight,
			elmHeight = 10,
			pfamHeight = 10

	var tip
	var elmTip
	var pfamTip

	var xScale,
			widthScale,
			yScale

	var clickData = {
		isActive: false,
		prevClicked: null
	}

	var dispatch = d3.dispatch(chart, "clicked")

	function chart(container) {
		g = container

		// g.append("g")
		// 	.classed("y table-axis", true)

		// Initialize tooltips
		elmTip = d3.tip()
			.attr("class", "d3-tip-table")
			.offset([-10, 0])
			.html(
				function(d) {
					return "elm_id: " + d.elm.elm_id + "<br>" 
					+ "start: " + d.elm.start + "<br>" 
					+ "end: " + d.elm.end
				}
			)

		pfamTip = d3.tip()
			.attr("class", "d3-tip-table")
			.offset([-10, 0])
			.html(
				function(d) {
					return "pfam_id: " + d.pfam.pfam_id + "<br>"
					+ "start: " + d.pfam.start + "<br>" 
					+ "end: " + d.pfam.end + "<br>"
					+ "Click to go to website"
				}
			)
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

		// TODO: Need to implement d3.scale for transcript widths
		function refreshTable(d) {
			if (svg) {
				svg.selectAll("rect").remove()
				svg.selectAll("text").remove()
			}
			if (d != null) {
				data = data.filter(p => d["protein"] === p["protein"])

				// dynamic tableHeight and scales
				tableHeight = data.length * 60
				svg.attr("height", tableHeight)

				svg.call(elmTip)
				svg.call(pfamTip)

				var widthMax = d3.max(data, d => d.width)
				var xMin = d3.min(data, d => d.start)
				var xMax = d3.max(data, d => d.end)

				xScale = d3.scale.linear()
									.domain([xMin, xMax])
									.range([0, tableWidth])
									.nice()
				widthScale = d3.scale.linear()
									.domain([0, widthMax])
									.range([0, tableWidth])
				yScale = d3.scale.linear()
									.domain([0, data.length])
									.range([margin.top, tableHeight])

				// xAxis
				var xAxis = d3.svg.axis()
										.scale(xScale)
										.orient("bottom")
										.ticks(10)

				svg.selectAll("g.x-table-axis").remove()
				svg.selectAll("line").remove()
				svg.append("g")
					.classed("x-table-axis", true)

				var xg = g.select(".x-table-axis")
						.attr("transform", "translate(0," + (tableHeight - margin.bottom) + ")")
						.call(xAxis)

				svg.append("line")
					.classed("axisLine hAxisLine", true)
					.attr("x1", 0)
					.attr("y1", tableHeight - margin.bottom)
					.attr("x2", tableWidth)
					.attr("y2", tableHeight - margin.bottom)
					.attr("transform", "translate(0," + tableWidth + ")")

				// // yAxis
				// var yAxis = d3.svg.axis()
				// 					.scale(yScale)
				// 					.orient("left")

				// var yg = g.select(".y.table-axis")
				// 	 					.call(yAxis)

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

				svg.selectAll("text").remove()
				var labels = svg.selectAll("text")
					.data(data)
					.enter()
					.append("text")
						.attr("x", 0)
						.attr("y", (d, i) => yScale(i))
						.text(d => d.entry)

				// overlay pfam and elm data in red
				data.forEach(function(d, index) {
					// console.log(d)
					d.elms.forEach(function(elm) {
						svg.datum(function() {
							// console.log(index, elm)
							return {index: index, elm: elm}
						})
							.append("rect").classed("elm-label", true)
							.attr("x", function(d) {
								return d.elm.start
							})
							.attr("y", function(d, index) {
								return yScale(d.index) + 10
							})
							.attr("width", function(d) {
								return d.elm.end - d.elm.start
							})
							.attr("rx", 6)
							.attr("ry", 6)
							.on("mouseover", elmTip.show)
							.on("mouseout", elmTip.hide)
							.attr("height", "10")
							.attr("fill", "#1B9AF7")
					})
					
					d.pfam.forEach(function(pfam) {
						svg.datum(function() {
							return {index: index, pfam: pfam}
						})
							.append("rect").classed("pfam-label", true)
							.attr("x", function(d) {
								return d.pfam.start
							})
							.attr("y", function(d, index) {
								return yScale(d.index) + 20
							})
							.attr("width", function(d) {
								return d.pfam.end - d.pfam.start
							})
							.attr("rx", 6)
							.attr("ry", 6)
							.on("mouseover", pfamTip.show)
							.on("mousedown", function(d) {
								window.open('http://pfam.xfam.org/family/' +  d.pfam.pfam_id, '_blank')
							})
							.on("mouseout", pfamTip.hide)
							.attr("height", "10")
							.attr("fill", "#49E845")
					})
				})
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