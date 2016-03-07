'use strict'

if (!d3.chart) d3.chart = {}

d3.chart.table = function() {
	var g
	var data
	var width = 300
	var height = 500
	var dispatch = d3.dispatch(chart, "clicked")

	function chart(container) {
		g = container
		update()
	}

	chart.update = update

	function update() {
		var table = g.append("table"),
				thead = table.append("thead"),
				tbody = table.append("tbody")

		var columns = ["index", "transcript", "protein", "probability"]
		
		// Create the column headers
		thead.append("tr")
			.selectAll("td")
			.data(columns)
			.enter()
			.append("th")
				.text(column => column)

		// create rows for each object
		var rows = tbody.selectAll("tr")
			.data(data)
			.enter()
			.append("tr")

		var cells = rows.selectAll("td")
			.data(row => columns.map(function(column) {
				return {column: column, value: row[column]}
			}))
			.enter()
			.append("td")
			.attr("style", "font-family: Courier")
			.html(d => d.value)
	}

	chart.data = function(value) {
		if (!arguments.length) return data
		data = value
		return chart
	}

	chart.width = function(value) {
		if(!arguments.length) return width
		width = value
		return chart
	}

	chart.height = function(value) {
		if(!arguments.length) return height
		height = value
		return chart
	}

	return d3.rebind(chart, dispatch, "on")
}
