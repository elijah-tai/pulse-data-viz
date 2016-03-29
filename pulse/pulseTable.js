'use strict'

if (!d3.chart) d3.chart = {}

d3.chart.table = function() {
	var g
	var data
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
			tableWidth = 600 - margin.left - margin.right,
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

		var rowsDiv = table.append("div").attr("class", "table-scroll-1")
			.attr("width", tableWidth)
		var rowsGrp = rowsDiv.append("table").attr("class", "rowsGrp")
		var rows, cells

		var	fieldHeight = 30
		var prevSort = null

		refreshTable(null)

		function refreshTable(sortOn) {
			console.log(sortOn)
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
				.text(function (d) {
					return d
				})

			resizeWidths()

			if (sortOn !== null) {
				if (sortOn != prevSort) {
					rows.sort((a, b) => sort(a, b, prevSort, sortOn))
					prevSort = sortOn
				}
				else {
					rows.sort((a, b) => sort(a, b, prevSort, sortOn))
					prevSort = null
				}

				rows.selectAll("td")
					.select("text").text(String)

				// rows.exit().remove()

			}

			// When row clicked, dispatch data clicked
			rows.on("click", function(d) {
				// if d not in previously clicked data, change colour
				if (clickData.isActive == false) {
					d3.select(this).style("background-color", "#ffff99")
					clickData.prevClicked = d3.select(this)
					clickData.isActive = !clickData.isActive
					dispatch.clicked([d])
				}
				// clicked the same thing twice --> erase highlight
				else if (clickData.isActive == true && (clickData.prevClicked[0][0].__data__ == d3.select(this)[0][0].__data__)) {
					d3.select(this).style("background-color", "#ffffff")
					clickData.prevClicked = d3.select(this)
					clickData.isActive = false
					dispatch.clicked([])
				} 
				// clicked again, but different thing --> erase highlight of old, highlight new
				else if (clickData.isActive == true && (clickData.prevClicked[0][0].__data__ != d3.select(this)[0][0].__data__)) {
					clickData.prevClicked.style("background-color", "#ffffff")
					d3.select(this).style("background-color", "#ffff99")
					clickData.prevClicked = d3.select(this)
					clickData.isActive = true
					dispatch.clicked([d])
				}
			})		
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

		function resizeWidths() {
			var indexFieldWidth = 60,
					transcriptFieldWidth = 140,
					proteinFieldWidth = 105,
					probabilityFieldWidth = 70

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