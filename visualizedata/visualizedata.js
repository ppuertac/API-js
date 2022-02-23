// @formatter:off
require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/geometry/Extent",

        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",

        "esri/renderers/SimpleRenderer",
        "esri/renderers/ClassBreaksRenderer",
        "esri/Color",
        "esri/layers/LayerDrawingOptions",
        "esri/dijit/PopupTemplate",
        "esri/dijit/Popup",
        
        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/dom",

        "dojo/_base/declare",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button"],
    function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer, Extent, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, 
        SimpleRenderer, ClassBreaksRenderer, Color, LayerDrawingOptions, PopupTemplate, Popup, ready, parser, on, dom, declare, array, BorderContainer, ContentPane, Button) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // URL variables
            var urllayerUSA = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
            var urlterremotos = "http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0";

            // Create the map
            // var extension = new Extent ( 
            //     {"xmin":-14385844.055243533,
            //     "ymin":3797385.5935797184,
            //     "xmax":-13886863.134598035,
            //     "ymax":5309004.264946962,
            //     "spatialReference":{
            //         "wkid":102100,
            //         "latestWkid":3857}})

            var mapa = new Map ("divMap",{
                basemap: "satellite",
                // extent: extension
                center: [-119.65, 36.87],
                zoom: 4,
            })

            // Construct and wire a button to apply the renderer
            // on(dom.byId("progButtonNode"), "click", changeCountiesRenderer()) (También se puede hacer así)
            mapa.on("load", function () {
                var boton = new Button({
                    label: "Show County Population Density",
                    onClick: changeCountiesRenderer
                }, "progButtonNode");
                changeQuakesRenderer()
            });


            // Construct the USA layer
            var layerUSA = new ArcGISDynamicMapServiceLayer(urllayerUSA, {
                opacity: 0.5
            });


            //Crear Popup (Ponerlo encima de la capa)
            var template = new PopupTemplate({
                title: "Quake magnitude: {MAGNITUDE}",
                description: "En {PLACE}"
            })

            // Construct the Quakes layer
            var terremotos = new FeatureLayer(urlterremotos, {
                infoTemplate: template
            });
            terremotos.setDefinitionExpression("MAGNITUDE >= 2.0");


            mapa.addLayers([layerUSA, terremotos])
           

            function changeQuakesRenderer() {

                // construct a  symbol for earthquake features
                var quakeSymbol = new SimpleMarkerSymbol();
                quakeSymbol.setColor(new Color([255, 0, 0, 0.5]));
                quakeSymbol.setOutline(null);


                /*
                 * Step: Construct and apply a simple renderer for earthquake features
                 */
                var renderTerremotos = new SimpleRenderer(quakeSymbol);
                terremotos.setRenderer(renderTerremotos);


                /*
                 * Step: Construct symbol size info parameters for the quake renderer
                 */
                var tamaño = [{
                    type: "sizeInfo",
                    field: "MAGNITUDE",
                    minDataValue: 0,
                    maxDataValue: 9,
                    minSize: 1,
                    maxSize: 50,
                }]

                /*
                 * Step: Apply symbol size info to the quake renderer
                 */
                renderTerremotos.setVisualVariables(tamaño);
            }


            function changeCountiesRenderer() {

                var symDefault = new SimpleFillSymbol().setColor(new Color([255, 255, 0]));

                /*
                 * Step: Construct a class breaks renderer
                 */
                var rendercountries = new ClassBreaksRenderer(symDefault, "pop00_sqmi"); //(símbolo, campo al que se le aplica)

                /*
                 * Step: Define the class breaks
                 */
                rendercountries.addBreak({
                    minValue: 0,
                    maxValue: 10,
                    symbol: new SimpleFillSymbol().setColor(new Color([254, 240, 217]))
                });
                rendercountries.addBreak({
                    minValue: 10,
                    maxValue: 100,
                    symbol: new SimpleFillSymbol().setColor(new Color([253, 204, 138]))
                });
                rendercountries.addBreak({
                    minValue: 100,
                    maxValue: 1000,
                    symbol: new SimpleFillSymbol().setColor(new Color([252, 141, 89]))
                });
                rendercountries.addBreak({
                    minValue: 1000,
                    maxValue: 10000,
                    symbol: new SimpleFillSymbol().setColor(new Color([227, 74, 51]))
                });
                rendercountries.addBreak({
                    minValue: 10000,
                    maxValue: 100000,
                    symbol: new SimpleFillSymbol().setColor(new Color([179, 0, 0]))
                });


                /*
                 * Step: Apply the renderer to the Counties layer
                 */
                var arrayDrawingOptions = [];
                var layerDrawingOptionsCiudades = new LayerDrawingOptions();
                layerDrawingOptionsCiudades.renderer = rendercountries;
                arrayDrawingOptions[3] = layerDrawingOptionsCiudades;
                layerUSA.setLayerDrawingOptions(arrayDrawingOptions);
            }
        });
    });

