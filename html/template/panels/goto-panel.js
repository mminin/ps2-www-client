$(function () {
    $.widget("panel.goToPanel", $.dock.panel, {
        options: {
            panelType: "goto"
        },
        _create: function () {
            this._super();
            this.panelBody
                .append(
                    $("<div id='gotoPanel' style='float: background-color: rgba(47, 85, 151, .2); '>"+
                      "Landing Sites: &nbsp; <label class='radio-inline'> <input type='radio' id='radioLandingSitesShow' name='landingSitesOp'>Show </label> <label class='radio-inline'> <input type='radio' id='radioLandingSitesHide' name='landingSitesOp'>Hide </label> <hr/>" +

                      "Gazetteer: &nbsp; &nbsp; &nbsp; &nbsp; <label class='radio-inline'> <input type='radio' id='radioGazetteerShow' name='gazetteerOp'>Show </label> <label class='radio-inline'> <input type='radio' id='radioGazetteerHide' name='gazetteerOp'>Hide </label> <br/>" + 

                      "<div style='margin-top: 10px;'> Size range: <p id='sizeDiameter' style='font-weight:bold; margin-left: 25px; display:inline;'> </p> </div> <br/>" + 

                      "<div id='sliderDiameter' style='margin-top: -10px; display:none;'></div> <hr/>" +

                      " <table style='border-spacing: 10px; border-collapse: separate; width: 400px; color: white;'>"+
			"<tr> <td> <button id='btnGoto' type='button' class='btn btn-success' style='font-size: 10px;'>Goto</button> </td>" + " <td colspan='2'> <input type='text' id ='txtGoto' style='color:blue; font-size:12px; height: 30px;'/>" +
			 " <td style='color: blue;'> <select id='dropdownGoto' style='margin-left: -30px; height: 30px;'> <option value='region'>Region</option> <option value='coverageID'>Footprint ID</option> <option value='latlon'>Lat,Lon</option> </select> </td> </tr>" +
                      "</table>"+
		       "<a href='#' id='linkGoTo' style='color:yellow; font-size:9px;'></a>" +
                    "</div>"
                    )
                );
        }
    })
});
