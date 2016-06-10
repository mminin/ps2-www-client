// This function will get the WCPS query value for all the bands of clicked coordinate
function Chart_getQueryResponseAndSetChart(query) {
    if(currentOpenDock === "mainChartDock") {
	    MainChart_getQueryResponseAndSetChart(query);
    } else if(currentOpenDock === "bandRatioDock") {
	    RatioChart_getQueryResponseAndSetChart(query);
    }
}

// Parse float from string of float values in CSV ('{"0.2323 0.342 0.436"}')
function Chart_parseFloats(input) {
    var floatsArray = [];
    input = input.match(/"([^"]+)"/)[1];
    floatsArray = input.split(" ");

    // convert string value to float
    for(var i = 0; i < floatsArray.length; i++) {
	floatsArray[i] = parseFloat(floatsArray[i]);
    }

    //console.log("after filter null values:");
    //console.log(floatsArray);
    return floatsArray;
}