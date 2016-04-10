'use strict'

if (!d3.chart) d3.chart = {}


d3.chart.table2 = function() {
	var g
	var svg
	var data
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
			tableWidth = 1000 - margin.left - margin.right,
			tableHeight = 300 - margin.top - margin.bottom

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

		console.log(data)
		svg = g.append("svg")
			.attr("width", tableWidth)
			.attr("height", tableHeight)

		function refreshTable(d) {
			
			if (d != null) {
				svg.selectAll("rect").remove()
				data = data.filter(p => d["protein"] === p["protein"])
				console.log(data)

				svg.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					.attr("x", (d) => 0)
					.attr("y", (d, i) => (i * (tableHeight / data.length)))
					.attr("width", (d) => d.end - d.start)
					.attr("fill", "rgb(0, 0, 0)")
					.attr("height", "5")
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