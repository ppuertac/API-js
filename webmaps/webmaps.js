require([
        "esri/map",
        "esri/arcgis/utils",
        "esri/geometry/Extent",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/dijit/Legend",
        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/dom",
        "esri/dijit/BasemapGallery",
        "esri/dijit/Scalebar"],

    function (Map, arcgisUtils, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, Legend,
              ready, parser, on,
              BorderContainer, ContentPane, dom, BasemapGallery, Scalebar) {

        ready(function () {
            parser.parse();
           var id = "7d987ba67f4640f0869acb82ba064228";
           var mapa = arcgisUtils.createMap(id, "cpCenter").then(function(response){
               console.log(response);
               let capasLeyenda = arcgisUtils.getLegendLayers(response);
               console.log("capasLeyenda", capasLeyenda);

               var leyendaWidget = new Legend({
                   map: response.map,
                   layerInfos: capasLeyenda,
               }, "divLegend");
               leyendaWidget.startup();

               var titulo = response.itemInfo.item.title
               console.log(titulo)
               dom.byId("titulo").innerHTML = titulo

               var basemapsgallery = new BasemapGallery({
                    map: response.map,
                    showArcGISBasemaps: true
               }, "basemapGallery");
               basemapsgallery.startup()

               var escala = new Scalebar({
                   map: response.map,
                   attachTo: "top-right"
               });
           });

        


    




        //    var extentInitial = new Extent({
        //     "xmin": -14462706.515378611,
        //     "ymin": 3626924.807223475,
        //     "xmax": -12496134.65165812,
        //     "ymax": 5471197.425687718,
        //     "spatialReference": {
        //         "wkid": 102100
        //     }
        // });

            // arcgisUtils.createMap(webmapId,"cpCenter").then(function(response){

           

				/*
				 * Step: Get the map from the response
				*/
				
				
				/*
                 * Step: update the Legend
				*/


            // });   


            // //create a map
            // mapMain = new Map("cpCenter", {
            //     basemap: "satellite",
            //     extent: extentInitial
            // });

            // // Add the USA map service to the map
            // var lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
            //     opacity: 0.5
            // });


            // // Add the earthquakes layer to the map
            // var lyrQuakes = new FeatureLayer("http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Earthquakes/MapServer/0");
            // lyrQuakes.setDefinitionExpression("MAGNITUDE >= 2.0");
            // mapMain.addLayers([lyrUSA, lyrQuakes]);


            // // Add the legend to the map
            // mapMain.on("layers-add-result", function () {
            //     var dijitLegend = new Legend({
            //         map: mapMain,
            //         arrangement: Legend.ALIGN_RIGHT
            //     }, "divLegend");
            //     dijitLegend.startup();
            // });


        });

    });
