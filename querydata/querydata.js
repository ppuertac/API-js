
require([
        "esri/map",
        "esri/geometry/Extent",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/tasks/query",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/dom",

        "dojo/store/Memory",
        "dojo/date/locale",

        "dojo/_base/Color",
        "dojo/_base/declare",
        "dojo/_base/array",

        "dgrid/OnDemandGrid",
        "dgrid/Selection",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button"],

    function (Map, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, Draw, Graphic, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Query, ready, parser, on, dom,
              Memory, locale,
              Color, declare, array,
              Grid, Selection,
              BorderContainer, ContentPane, Button) {


        ready(function () {
            parser.parse();

            var gridQuakes = new (declare([Grid, Selection]))({
                bufferRows: Infinity,
                columns: {
                    EQID: "ID",
                    UTC_DATETIME: {
                        "label": "Date/Time",
                        "formatter": function (dtQuake) {
                            return locale.format(new Date(dtQuake));
                        }
                    },
                    MAGNITUDE: "Mag",
                    PLACE: "Place"
                }
            }, "divGrid");


            // Create the map
            var extension = new Extent ( 
                {"xmin":-14385844.055243533,
                "ymin":3797385.5935797184,
                "xmax":-13886863.134598035,
                "ymax":5309004.264946962,
                "spatialReference":{
                    "wkid":102100,
                    "latestWkid":3857}})

            var mapa = new Map ("divMap",{
                basemap: "satellite",
                extent: extension
            })

            // Construct the USA layer
            var layerUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity: 0.5
            });

    
            /*
             * Step: Specify the output fields
             */
            var campos = ["EQID", "MAGNITUDE", "UTC_DATETIME", "PLACE"];


            // Construct the Quakes layer
            var terremotos = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0", {
                outFields: campos
            });
            terremotos.setDefinitionExpression("MAGNITUDE >= 2.0");
           
            mapa.addLayers([layerUSA, terremotos]);


            /*
             * Step: Wire the draw tool initialization function
             */
            mapa.on("load", initDrawTool);


            function initDrawTool() {
                var dibujar = new Draw(mapa);
                dibujar.activate(Draw.POLYGON)
                dibujar.on("draw-end", displayPolygon);
            }

            function displayPolygon(evt) {

                // Get the geometry from the event object
                var geometryInput = evt.geometry;

                // Define symbol for finished polygon
                var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

                // Clear the map's graphics layer
                mapa.graphics.clear();

                /*
                 * Step: Construct and add the polygon graphic
                 */
                var poligono = new Graphic(geometryInput, tbDrawSymbol);
                mapa.graphics.add(poligono);

                // Call the next function
                selectQuakes(geometryInput);
            }

            function selectQuakes(geometryInput) {

                // Define symbol for selected features
                var symbolSelected = new SimpleMarkerSymbol({
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "color": [0, 255, 0, 128],
                    "size": 6,
                    "outline": {
                        "color": [0, 255, 0, 214],
                        "width": 1
                    }
                });
                


                /*
                 * Step: Initialize the query
                 */
                var myQuery = new Query();
                myQuery.geometry = geometryInput;

                /*
                 * Step: Perform the selection
                 */
                terremotos.selectFeatures(myQuery);

                /*
                 * Step: Set the selection symbol
                 */
                terremotos.setSelectionSymbol(symbolSelected);
                

                /*
                 * Step: Wire the layer's selection complete event
                 */
                terremotos.on("selection-complete", populateGrid);

            }

            function populateGrid(results) {

                console.log("populate", results)

                var gridData;

                dataQuakes = array.map(results.features, function (feature) {
                    console.log("feature", feature)
                    return {
                        
                        /*
                         * Step: Reference the attribute field values
                         */
                        EQID: feature.attributes.EQID,
                        PLACE: feature.attributes.PLACE,
                        MAGNITUDE: feature.attributes.MAGNITUDE,
                        UTC_DATETIME: feature.attributes.UTC_DATETIME
                    }
                });
                console.log("dataQuakes", dataQuakes)
                

                // Pass the data to the grid
                var memStore = new Memory({
                    data: dataQuakes
                });
                gridQuakes.set("store", memStore);
            }

        });
    });
