'use strict'

if (!d3.chart) d3.chart = {}

d3.chart.table2 = function() {
	var g
	var data
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
			tableWidth = 900 - margin.left - margin.right,
			tableHeight = 500 - margin.top - margin.bottom

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

	function update() {
		var table = g.attr("width", tableWidth + margin.left + margin.right)
				.attr("height", tableHeight + margin.top + margin.bottom)

		var headerGrp = table.append("table").attr("class", "headerGrp")
		var headerRow = headerGrp.append("thead")

		var rowsDiv = table.append("div").attr("class", "table-scroll-2")
			.attr("width", tableWidth)
		var rowsGrp = rowsDiv.append("table").attr("class", "rowsGrp")
		var rows, cells

		var seqIdFieldWidth = 150,
			transcriptFieldWidth = 140,
			proteinFieldWidth = 105,
			probabilityFieldWidth = 70,
			elmFieldWidth = 70

		var	fieldHeight = 30
		var prevSort = null
		refreshTable(null)

		function refreshTable(sortOn) {
			table.selectAll("th").remove()
			table.selectAll("tr").remove()

			// Draw header
			var header = headerRow.selectAll("thead")
				.data(d3.keys(data[0]))
				.enter().append("th")
				.attr("class", (d, i) => "header" + i)
				.on("click", function(d, i) {
					refreshTable(d)
				})
				.text(d => d)

			// start filling the table
			rows = rowsGrp.selectAll("g.row")
				.data(data)
				.enter().append("tr")
				.attr("class", "row")

			cells = rows.selectAll("td")
				.data(d => d3.values(d))
				.enter().append("td")
				.attr("class", (d, i) => "cell" + i)
				.append("text")
				.text(d => d)

			// Let's reformat some of the columns by index value
			// Might be best to move this CSS
			// Column 0
			headerGrp.selectAll(".header0")
				.attr("width", seqIdFieldWidth)
			rowsGrp.selectAll(".cell0")
				.attr("width", seqIdFieldWidth)

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
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell3")
				.attr("width", elmFieldWidth)

			// Column 4
			headerGrp.selectAll(".header4")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell4")
				.attr("width", elmFieldWidth)

			// Column 5
			headerGrp.selectAll(".header5")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell5")
				.attr("width", elmFieldWidth)

			// Column 6
			headerGrp.selectAll(".header6")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell6")
				.attr("width", elmFieldWidth)
		
		}			

		function sort(a, b, prevSort, sortOn) {
			
			if (prevSort == null) {
				if (sortOn == "index" || sortOn == "probability") {
					return a[sortOn] < b[sortOn] ? 1 : a[sortOn] == b[sortOn] ? 0 : -1
				} else if (sortOn == "transcript" || sortOn == "protein") {
					return a[sortOn].localeCompare(b[sortOn])
				}
			} else if ((prevSort == "index" && sortOn == "index") || (prevSort == "probability" && sortOn == "probability")) {
				return a[sortOn] > b[sortOn] ? 1 : a[sortOn] == b[sortOn] ? 0 : -1
			} else if ((prevSort == "transcript" && sortOn == "transcript") || (prevSort == "protein" && sortOn == "protein")) {
				return b[sortOn].localeCompare(a[sortOn])
			} else {
				if (typeof a[sortOn] == "string") {
					return a[sortOn].localeCompare(b[sortOn])
				} else if (typeof a[sortOn] == "number") {
					return a[sortOn] > b[sortOn] ? 1 : a[sortOn] == b[sortOn] ? 0 : -1
				}
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