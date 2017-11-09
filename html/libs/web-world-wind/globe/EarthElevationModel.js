/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports EarthElevationModel
 * @version $Id: EarthElevationModel.js 2936 2015-03-27 22:04:59Z tgaskins $
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/ElevationModel',
        '../util/WmsUrlBuilder'
    ],
    function (Location,
              Sector,
              ElevationModel,
              WmsUrlBuilder) {
        "use strict";

        /**
         * Constructs an Earth elevation model.
         * @alias EarthElevationModel
         * @constructor
         * @augments ElevationModel
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA World Wind elevation service.
         */
        var EarthElevationModel = function () {
            ElevationModel.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 12, "image/bil", "tiles_test", 256, 256);

                if (url.indexOf("moon") > -1) {
                  this.displayName = "Moon Elevation Model";
                  this.minElevation = -9115; // moon deepest point in meters
                  this.maxElevation = 10786; // moon higher point in meters
                  this.pixelIsPoint = false; // World Wind WMS elevation layers return pixel-as-area images

                  /*this.urlBuilder = new WmsUrlBuilder("http://worldwind26.arc.nasa.gov/elev1",
                                      "GEBCO,aster_v2,USGS-NED", "", "1.3.0");*/
                  //var testEndPoint = "http://moon.planetserver.eu:8083/geoserver/WWW_DEM_10km_1file/wms";
                  //var layer = "WWW_DEM_10km_1file:tiles_test";
                  var testEndPoint = "http://moon.planetserver.eu:8083/geoserver/lunar_global/wms";
                  var layer = "lunar_global:tiles_cut";
                  this.urlBuilder = new WmsUrlBuilder(testEndPoint, layer, "", "1.1.0");

                } else {
                  this.displayName = "Mars Elevation Model";
                  this.minElevation = -8201; // mars deepest point in meters
                  this.maxElevation = 21241; // mars deepest point in meters
                  this.pixelIsPoint = false; // World Wind WMS elevation layers return pixel-as-area images

                  /*this.urlBuilder = new WmsUrlBuilder("http://worldwind26.arc.nasa.gov/elev1",
                                      "GEBCO,aster_v2,USGS-NED", "", "1.3.0");*/
                  //var testEndPoint = "http://mars.planetserver.eu:8083/geoserver/WWW_DEM_10km_1file/wms";
                  //var layer = "WWW_DEM_10km_1file:tiles_test";
                  var testEndPoint = "http://mars.planetserver.eu:8083/geoserver/global_dem/wms";
                  var layer = "global_dem:tiles_cut";
                  this.urlBuilder = new WmsUrlBuilder(testEndPoint, layer, "", "1.1.0");
                }

        };

        EarthElevationModel.prototype = Object.create(ElevationModel.prototype);

        return EarthElevationModel;
    });
