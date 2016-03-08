'use strict'

if (!d3.chart) d3.chart = {}

d3.chart.table = function() {
	var g
	var data
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
			width = 600 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom

	var dispatch = d3.dispatch(chart, "clicked")

	function chart(container) {
		g = container
		update()
	}

	chart.update = update

	function update() {
		var table = g.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)

		var headerGrp = table.append("table").attr("class", "headerGrp")
		var headerRow = headerGrp.append("thead")

		var rowsGrp = table.append("table").attr("class", "rowsGrp")

		var indexFieldWidth = 60,
				transcriptFieldWidth = 140,
				proteinFieldWidth = 105,
				probabilityFieldWidth = 50

		var	fieldHeight = 30
		
		transform("index")

		function transform(sortOn) {
			table.selectAll("tr").remove()

			// Draw header
			var header = headerRow.selectAll("thead")
				.data(dataToArray(data[0]))
				.enter().append("th")
				.attr("class", (d, i) => "header" + i)
				.on("click", function(d, i) {
					transform(d[0])
				})
				.text(d => d[0])

			// start filling the table
			var rows = rowsGrp.selectAll("tr")
				.data(data)
				.enter().append("tr")
				.attr("class", "row")

			var rowsSort = rows.transition().duration(500)
				.sort((a, b) => sort(a[sortOn], b[sortOn]))

			var cells = rows.selectAll("td")
				.data(d => dataToArray(d))
				.enter().append("td")
				.attr("class", (d, i) => "cell" + i)
				.on("click", (d, i) => transform(d[0]))
				.append("text")
				.text(d => d[1])

			// Let's reformat some of the columns by index value
			// Might be best to move this CSS
			// Column 0
			headerGrp.selectAll(".header0")
				.attr("width", indexFieldWidth)
			rowsGrp.selectAll(".cell0")
				.attr("width", indexFieldWidth)

			// Column 1
			headerGrp.selectAll(".header1")
				.attr("width", transcriptFieldWidth)
			rowsGrp.selectAll(".cell1")
				.attr("width", transcriptFieldWidth)

			// Column 2
			headerGrp.selectAll(".header2")
				.attr("width", proteinFieldWidth)
			rowsGrp.selectAll(".cell2")
				.attr("width", proteinFieldWidth)

			// Column 3
			headerGrp.selectAll(".header3")
				.attr("width", probabilityFieldWidth)
			rowsGrp.selectAll(".cell3")
				.attr("width", probabilityFieldWidth)	
		}			

		function sort(a, b) {
			if (typeof a == "string") {
				return a.localeCompare(b)
			}
			else if (typeof a == "number") {
				return a > b ? 1 : a == b ? 0 : -1
			}
		}

		function dataKeyValueToArray(k, v) {
			return [k, v]
		}

		function dataToArray(data) {
			var result = new Array()
			var key
			for (key in data) {
				if (data.hasOwnProperty(key)) {
					result.push(dataKeyValueToArray(key, data[key]))
				}
			}
			return result
		}

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

	// returns dispatch method bound to chart (target) 
	// with "on" name
	return d3.rebind(chart, dispatch, "on")
}
