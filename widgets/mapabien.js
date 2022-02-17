// require(["esri/map", "esri/geometry/Extent", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/dijit/BasemapToggle", "esri/dijit/OverviewMap", "esri/dijit/Legend", "dojo/domReady!"], function(Mapa, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, BasemapToggle, OverviewMap, Legend){
//     var myMap = new Mapa("divMap", {
//         basemap: "topo-vector",
//         extent: new Extent({
//             "xmin" : -14374651.058794111,
//             "ymin" : 3597572.9883619756,
//             "xmax" : -12408079.19507362,
//             "ymax" : 5441845.606826218,
//             "spatialReference" : {
//               "wkid" : 102100
//             }
//         })
//     })
//     var layer = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
//         "opacity": 0.5
//     });
//     myMap.addLayer(layer);
    
//     var terremotos = new FeatureLayer("https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");
//     terremotos.setDefinitionExpression("MAGNITUDE >= 2")
    
//     myMap.addLayer(terremotos);

//     layer.setVisibleLayers([0, 2, 3]) //Para ocultar la capa de highways

//     var toggle = new BasemapToggle({
//         map: myMap}, "toggle"); 

//     toggle.startup();  

//     var overview = new OverviewMap({
//         map: myMap,
//         basemap: "gray",
//     }, "divoverview");
//     overview.startup();

//     var leyenda = new Legend({
//         map: myMap,
//         arrangement : Legend.ALIGN_LEFT}, "divlegend")
//     leyenda.startup();
// })




var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/geometry/Extent",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/dijit/BasemapToggle",
        "esri/dijit/Legend",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, Extent,ArcGISDynamicMapServiceLayer,FeatureLayer,BasemapToggle,Legend,
              ready, parser, on,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            /*
             * Step: Specify the initial extent
             * Note: Exact coordinates may vary slightly from snippet/solution
             * Reference: https://developers.arcgis.com/javascript/jssamples/fl_any_projection.html
             */
            extentInitial = new Extent(
                {"xmin":-14385844.055243533,
                    "ymin":3797385.5935797184,
                    "xmax":-13886863.134598035,
                    "ymax":5309004.264946962,
                    "spatialReference":{
                        "wkid":102100,
                        "latestWkid":3857}}
            );

              // Create the map
            mapMain = new Map("cpCenter", {
                basemap: "satellite",
                extent:extentInitial
            });

            /*
             * Step: Add the USA map service to the map
             */

            var lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity : 0.5
            });
            //mapMain.addLayer(lyrUSA);

            /*
             * Step: Add the earthquakes layer to the map
             */
            var lyrQuakes = new FeatureLayer("http://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");
            lyrQuakes.setDefinitionExpression("MAGNITUDE >= 2.0")

            /*
            * Step: Revise code to use the addLayers() method
            */
            mapMain.addLayers([lyrUSA,lyrQuakes]);

            /*
             * Step: Add the BaseMapToggle widget to the map
             */
            var toggle = new BasemapToggle({
                map: mapMain,
                basemap: "topo"
            }, "BasemapToggle");
            toggle.startup();

            /*
             * Step: Add a legend once all layers have been added to the map
             */
            //mapMain.on(); // stub
            mapMain.on("layers-add-result", function() {
                var dijitLegend = new Legend({
                    map : mapMain,
                    arrangement : Legend.ALIGN_RIGHT,
                    layerInfos: [{
                        layer: lyrUSA,
                        title: "EEUU",
                    }]
                }, "divLegend");
                dijitLegend.startup();
            }); 

            var overview = new OverviewMap({
                        map: myMap,
                        basemap: "gray",
                        visible: true, 
                        attachTo: "bottom-right",
                    }, "overview");
            overview.startup();


        });
    });