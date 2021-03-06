// store the json object for landing sites
var landingSitesArray = null;

// check if landing sites are shown
var isShowLandingSites = false;

// map layer
landingSitesLayer = null;

// change to ps2EndPoint later
var endPoint = ps2EndPoint;

$(document).ready(function() {
    var jsonFile = "";
    if (clientName === MARS_CLIENT) {
        // change here with "ps2EndPoint" later
        jsonFile = endPoint + "/html/data/landing-sites/mars/data.json";
    } else if (clientName === MOON_CLIENT) {
        jsonFile = endPoint + "/html/data/landing-sites/moon/data.json";
    }


    // load the x_axis for charts from file
    $.ajax({
            type: "GET",
            dataType: "json",
            url: jsonFile,
            cache: false,
            async: true,
            success: function(data) {
                landingSitesArray = data;
            }
    });
});


 $('#checkboxLandingSites').on('switchChange.bootstrapSwitch', function(event, state) {        
    console.log(state); // true | false
    // show
    if (state === true) {            
        isShowLandingSites = true;         
        // load the records from shapefile
        addPlaceMarks();            
    } else {
        // hide            
        isShowLandingSites = false;  
        // hide the layer
        addPlaceMarks();            
    }
});

// Load all the landing sites as place markers
function addPlaceMarks() {
    if (landingSitesLayer == null) {
        // create a new layer
        landingSitesLayer = new WorldWind.RenderableLayer("landingSitesLayer");

        for (var i = 0; i < landingSitesArray.length; i++) {
            var obj = landingSitesArray[i];

            var placemark = new WorldWind.Placemark(new WorldWind.Position(obj.latitude, obj.longitude, 1e2), true, null);
            placemark.label = "Name: " + obj.name + "\n"
                            + "Date: " + obj.date + "\n"
                            + "Lat: " + obj.latitude + "\n"
                            + "Lon: " + obj.longitude;

            var placemarkAttributes = new WorldWind.PlacemarkAttributes();   
            placemark.alwaysOnTop = true;             
            placemark.eyeDistanceScalingLabelThreshold = 1.312e7;
            placemark.eyeDistanceScalingThreshold = 1.312e7;
            placemarkAttributes.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;        
            placemarkAttributes.labelAttributes.depthTest = false;
            placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

            if (obj.type === "1") {
                placemarkAttributes.imageSource = endPoint + "/html/images/icons/landing-sites-1.png";
            } else if (obj.type === "2") {
                placemarkAttributes.imageSource = endPoint + "/html/images/icons/landing-sites-2.png";
            } else {
                placemarkAttributes.imageSource = endPoint + "/html/images/icons/landing-sites-3.png";
            }

            placemark.attributes = placemarkAttributes;

            landingSitesLayer.addRenderable(placemark);
        }

        // Marker layer
        wwd.insertLayer(11, landingSitesLayer);    
    } else {
        if (isShowLandingSites === false) {
                landingSitesLayer.enabled = false;           
            } else {
                landingSitesLayer.enabled = true;                
        }
    }

    
}
