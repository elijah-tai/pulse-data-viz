'use strict'

if (!d3.chart) d3.chart = {}

d3.chart.table2 = function() {
	var g
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
		console.log(d)
		data = data.filter(p => d["protein"] === p["protein"])
		console.log(data)
		chart.refreshTable(null)
	}

	function update() {
		var table = g.attr("width", tableWidth + margin.left + margin.right)
				.attr("height", tableHeight + margin.top + margin.bottom)

		var headerGrp = table.append("table").attr("class", "headerGrp")
		var headerRow = headerGrp.append("thead")

		var rowsDiv = table.append("div").attr("class", "table-scroll-2")
			.attr("width", tableWidth)
		var rowsGrp = rowsDiv.append("table").attr("class", "rowsGrp")
		var rows, cells

		var	fieldHeight = 30
		var prevSort = null
		refreshTable(null)

		chart.refreshTable = refreshTable

		function refreshTable(sortOn) {
			table.selectAll("th").remove()
			table.selectAll("tr").remove()

			// Draw header
			var header = headerRow.selectAll("thead")
				.data(d3.keys(data[0]))
				.enter().append("th")
				.attr("class", (d, i) => "header" + i)
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

			resizeWidths()
		}			

		function resizeWidths() {
			var seqIdFieldWidth = 185,
				transcriptFieldWidth = 105,
				proteinFieldWidth = 80,
				elmFieldWidth = 10

			// Column 0
			headerGrp.selectAll(".header0")
				.attr("width", transcriptFieldWidth)
			rowsGrp.selectAll(".cell0")
				.attr("width", transcriptFieldWidth)

			// Column 1
			headerGrp.selectAll(".header1")
				.attr("width", seqIdFieldWidth)
			rowsGrp.selectAll(".cell1")
				.attr("width", seqIdFieldWidth)

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

			// Column 7
			headerGrp.selectAll(".header7")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell7")
				.attr("width", elmFieldWidth)

			// Column 8
			headerGrp.selectAll(".header8")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell8")
				.attr("width", elmFieldWidth)

			// Column 9
			headerGrp.selectAll(".header9")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell9")
				.attr("width", elmFieldWidth)

			// Column 10
			headerGrp.selectAll(".header10")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell10")
				.attr("width", elmFieldWidth)

			// Column 11
			headerGrp.selectAll(".header11")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell11")
				.attr("width", elmFieldWidth)

			// Column 12
			headerGrp.selectAll(".header12")
				.attr("width", elmFieldWidth)
			rowsGrp.selectAll(".cell12")
				.attr("width", elmFieldWidth)
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