var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/tasks/Geoprocessor",
        "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "esri/graphic",
        "esri/graphicsUtils",
        "esri/tasks/FeatureSet",
        "esri/tasks/LinearUnit",
        
        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array"],
    function (Map, Geoprocessor, Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Graphic, graphicsUtils,
                FeatureSet, LinearUnit, ready, parser, on, array) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // Create the map
            mapMain = new Map("divMap", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });
           

            /*
             * Step: Construct the Geoprocessor
             */
            var gp = new Geoprocessor("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");


            mapMain.on("load", function () {
                /*
                 * Step: Set the spatial reference for output geometries
                 */
                gp.setOutSpatialReference({wkid:102100})
                //gp.outSpacilaReference = mapMain.SpacialReference (También se puede hacer así, para que tenga el mismo sistema de referencia que el mapa)
            });

            // Collect the input observation point
            var tbDraw = new Draw(mapMain);
            tbDraw.on("draw-complete", calculateViewshed);
            tbDraw.activate(Draw.POINT);
         

            function calculateViewshed(evt) {
                console.log("vale!")

                // clear the graphics layer
                mapMain.graphics.clear();

                // marker symbol for drawing viewpoint
                var smsViewpoint = new SimpleMarkerSymbol();
                smsViewpoint.setSize(5);
                smsViewpoint.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
                smsViewpoint.setColor(new Color([0, 0, 0]));

                // add viewpoint to the map
                var graphicViewpoint = new Graphic(evt.geometry, smsViewpoint);
                mapMain.graphics.add(graphicViewpoint);

                /*
                 * Step: Prepare the first input parameter
                 */
                var featureset = new FeatureSet();
                featureset.features.push(graphicViewpoint);


                /*
                 * Step: Prepare the second input parameter
                 */
                var distancia = new LinearUnit();
                distancia.distance = 5;
                distancia.units = "esriKilometers";

                /*
                 * Step: Build the input parameters into a JSON-formatted object
                 */
                var parametros = {
                    "Input_Observation_Point" : featureset,
                    "Viewshed_Distance" : distancia
                };

                /*
                 * Step: Wire and execute the Geoprocessor
                 */
                gp.execute(parametros, displayViewshed);
            }

            function displayViewshed(results, messages) {

                console.log("Funciona!")

                // polygon symbol for drawing results
                var sfsResultPolygon = new SimpleFillSymbol();
                sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
                sfsResultPolygon.setColor(new Color([255, 127, 0, 0.5]));

                /*
                 * Step: Extract the array of features from the results
                 */
                var arrayFeatures = results[0].value.features;
                console.log(arrayFeatures);
                

                // loop through results
                array.forEach(arrayFeatures, function (feature) {
                    /*
                     * Step: Symbolize and add each graphic to the map's graphics layer
                     */
                    feature.setSymbol(sfsResultPolygon);
                    mapMain.graphics.add(feature);
                });

                // update the map extent
                var extentViewshed = graphicsUtils.graphicsExtent(mapMain.graphics.graphics, true);
                mapMain.setExtent = extentViewshed;
                
            }

        });
    });
