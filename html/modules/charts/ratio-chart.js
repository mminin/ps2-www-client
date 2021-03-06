requirejs(['../band-ratio/band-ratio']);

// This function will get the WCPS query value for all the bands of clicked coordinate
valuesClickedCoordinateArrayRatioChart = null;

// All the obj for line charts are stored (not for the spectral library)
// store the data provider for multiple charts
dataProviderChartsArrayRatioChart = [];

// Number of line charts and spectral library
lineChartsCountRatioChart = { count: 0 };

// All the obj for spectral library charts (not for clicked chart)
spectralLibrarydataProviderChartsArrayRatioChart = [];

// This array has all objects for drawing chart with default range charts (i.e: 1-4 in wavelength)
var defaultCombinedArrayChartsRatioChart = [];

// check if a line chart is drawn
var isAddedALineChartRatioChart = { isDrawn: false };

// store the clicked coordinates to add the place markers
placeMarkersArray = [];

// Handle change event of range charts text box (only after drawing chart)
$('#txtRangeChartsRatioChart').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        Chart_filterRangeCharts("RatioChart", defaultCombinedArrayChartsRatioChart, dataProviderChartsArrayRatioChart, selectedProductValuesSpectralLibraryRatioChart, spectralLibrarydataProviderChartsArrayRatioChart);
    }
});


$(function() {
    // clear all the drawn charts, with the spectral library charts
    $("#btnClearChartsRatioChart").click(function() {
        if (!isAddedALineChartRatioChart.isDrawn) {
            alert("Please click on a footprint to retrieve the spectra first!");
            return;
        }

        // If a line chart is drawn
        var ret = confirm("Do you want to remove all charts?");
        if (ret) {


            // remove all the place markers from the band ratio (numerators and denomintators)
            Landings_removePlaceMarker(placeMarkersBandRatio[0].layer);
            Landings_removePlaceMarker(placeMarkersBandRatio[1].layer);

            // clear all the spectral library charts (selected color from <li> of selected category and product)
            for (var i = 0; i < selectedSpectralLibraryArrayRatioChart.length; i++) {
                var productID = selectedSpectralLibraryArrayRatioChart[i];
                var categoryID = productID.split("_")[0];

                $("#" + categoryID).css("background-color", "white");
                $("#" + productID).css("background-color", "white");
            }

            // then clear this selected color array
            selectedSpectralLibraryArrayRatioChart = [];

            // remove the data provider array for clicked charts
            dataProviderChartsArrayRatioChart = [];

            // remove the data provider array for spectral library charts
            spectralLibrarydataProviderChartsArrayRatioChart = [];

            // remove all the clicked drawn charts
            isAddedALineChartRatioChart.isDrawn = false;

            // remove the drawn line charts by remove all the data, and the spectral line charts
            valuesClickedCoordinateArrayRatioChart = null;
            selectedProductValuesSpectralLibraryRatioChart = null;

            // clear all the drawn line charts here
            Chart_drawChart([], "RatioChartDiv", dataProviderChartsArrayRatioChart, selectedProductValuesSpectralLibraryRatioChart, spectralLibrarydataProviderChartsArrayRatioChart);

            // clear all the clicked points
            placemarkLayer.removeAllRenderables();
        }
    });

});


// This function will get the WCPS query value for all the bands of clicked coordinate
function RatioChart_getQueryResponseAndSetChart(query) {
    $.ajax({
        type: "get",
        url: query,
        success: function(data) {
            var parsedFloats = [];
            parsedFloats = Chart_parseFloats(data);
            console.log("Get values for band ratio values");
            BandRatio_setFraction(parsedFloats);

            // Notify user about other radio button
            BandRatio_getNotifyFraction();

            // Numerator and Denominator has values then draw chart
            if (BandRatio_isSetAllValues()) {
                // containerID is "" then it is test (not from the dock)
                // Here it need to calculate the band-ratio from Numerator and Denominator
                var parsedFloats = [];
                for (var i = 0; i < bandRatioNumeratorValues.length; i++) {
                    if ((bandRatioDenominatorValues[i] !== 0) && (bandRatioNumeratorValues[i] != null && bandRatioDenominatorValues[i] != null)) {
                        parsedFloats[i] = bandRatioNumeratorValues[i] / bandRatioDenominatorValues[i];
                    } else {
                        // cannot divide for 0 then set it to null
                        parsedFloats[i] = null;
                    }
                }

                valuesClickedCoordinateArrayRatioChart = parsedFloats;

                // only click on the footprint to get values from coordinate (these parameters from main-chart and spectral-library file)
                Chart_implementChart(false, valuesClickedCoordinateArrayRatioChart, selectedProductValuesSpectralLibraryRatioChart, "RatioChart", selectedWaveLengthSpectralLibraryArrayRatioChart, dataProviderChartsArrayRatioChart, spectralLibrarydataProviderChartsArrayRatioChart, defaultCombinedArrayChartsRatioChart, dataProviderChartsArrayRatioChart, selectedProductValuesSpectralLibraryRatioChart, lineChartsCountRatioChart, isAddedALineChartRatioChart);
            }
        }
    });
}


// When select product library, it will call function implement chart to draw spectral library charts with clicked coordinate chart
function RatioChart_implementSpectralLibraryChart(isChangeSpectralLibrary, floatsArray, spectralFloatsArray) {
    Chart_implementChart(isChangeSpectralLibrary, floatsArray, spectralFloatsArray, "RatioChart", selectedWaveLengthSpectralLibraryArrayRatioChart, dataProviderChartsArrayRatioChart, spectralLibrarydataProviderChartsArrayRatioChart, defaultCombinedArrayChartsRatioChart, dataProviderChartsArrayRatioChart, selectedProductValuesSpectralLibraryRatioChart, lineChartsCountRatioChart, isAddedALineChartRatioChart);
}



/*
//Implementation function of the graph
function RatioChart_implementChart(containerID, chartDivID, floatsArray) {

    var xDist = 3.0 / floatsArray.length; // Value for setting the equidistance Band wavelength which should be between 1 and 4
    var xPrev = 1.0; // Value used for storing the Band wavelength of the previous Band
    var Ymin = Infinity,
        Ymax = -Infinity; // Values for getting the minimum and maximum out of the array

    var spectraDataProviderChart = [];


    function SpectraDataConstructor(bandIndex, bandValue) {
        this.bandIndex = bandIndex;
        this.value = bandValue;
    }

    for (var i = 0; i < floatsArray.length; i++) {
        // Only get points with valid value
        var relectance = 0;

        if (floatsArray[i] != 65535 && floatsArray[i] != 0 && floatsArray[i] < 20 && floatsArray[i] > 0.0001) {
            relectance = floatsArray[i];
        } else {
            relectance = null;
        }

        var spectraObj = new SpectraDataConstructor(parseFloat(xPrev).toFixed(3), relectance);
        spectraDataProviderChart.push(spectraObj);

        if (Ymin > floatsArray[i]) { // Getting the minimum of value to draw chart
            Ymin = floatsArray[i];
        } else if (Ymax < floatsArray[i]) { // Getting the maximum of value to draw chart
            Ymax = floatsArray[i];
            // console.log("max: " + Ymax);
        }

        // If point value is valid or not valid still need to calculate the X coordinate for it.
        xPrev = xPrev + xDist; // Setting the correct X-axis wavelength of the current Band/point
    }

    // Only add chart div when it does not exist and CONTAINERID is not empty
    //if(!$("#" + chartDivID).length) {
    //	    $("#" + containerID).append("<div class='chartdiv' id='" + chartDivID + "' style='width:100%; height:560px;'></div>");
    //}

    var chart = AmCharts.makeChart("#" + chartDivID, {
        "type": "serial",
        "theme": "light",
        "marginRight": 10,
        "marginLeft": 10,
        "backgroundColor": "#2F5597",
        "backgroundAlpha": 1,
        "autoMarginOffset": 20,
        "mouseWheelZoomEnabled": true,
        "dataProvider": spectraDataProviderChart,
        "fontSize": 14,
        "color": "#ffffff",
        "marginTop": 50,
        "valueAxes": [{
            "axisAlpha": 0,
            "guides": [{
                "fillAlpha": 0.1,
                "fillColor": "#888888",
                "lineAlpha": 0,
                "toValue": 16,
                "value": 10
            }],
            "position": "left",
            "tickLength": 0,
            "title": "Reflectance"
        }],
        "categoryAxis": {
            "title": "Wavelength (µm)"
        },
        "graphs": [{
            "id": "g2",
            "balloonText": "<span style='font-size:14px; color: #ff0000'> Wavelength:[[bandIndex]]<br><b> Reflectance:[[value]]</span></b>",
            //  "bullet": "round",
            //  "bulletSize": 0,
            "dashLength": 0,
            "lineThickness": 2,
            "colorField": "color",
            "valueField": "value",
            "connect": false,
        }],

        "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": false,
            "cursorAlpha": 1,
            "cursorColor": "#258cbb",
            "limitToGraph": "g1",
            "valueLineAlpha": 0.2,
            "valueZoomable": true,
            "valueBalloonsEnabled": true,
            "categoryBalloonEnabled": true
        },
        "categoryField": "bandIndex",
        "categoryAxis": {
            //"parseDates": true,
            "axisAlpha": 0,
            "gridAlpha": 0.1,
            "minorGridAlpha": 0.1,
            "minorGridEnabled": true,
            "title": "Wavelength (µm)"
        },
        "export": {
            "enabled": true,
            "fileName": "ps2_" + drawCoverageID + "_lat_" + drawLat + "_lon_" + drawLon
        }
    });

    // it needs to resize the chart and write it when it is hidden
    chart.invalidateSize();
    chart.write(chartDivID);

    $(".ratio-dock").css("background", "#2F5597");
}
*/