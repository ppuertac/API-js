require(["esri/map", "esri/geometry/Extent", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/dijit/BasemapToggle", "esri/dijit/OverviewMap", "dojo/dom", "dojo/domReady!"], function(Mapa, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, BasemapToggle, OverviewMap, dom){
    var myMap = new Mapa("divMap", {
        basemap: "topo-vector",
        extent: new Extent({
            "xmin" : -14374651.058794111,
            "ymin" : 3597572.9883619756,
            "xmax" : -12408079.19507362,
            "ymax" : 5441845.606826218,
            "spatialReference" : {
              "wkid" : 102100
            }
        })
    })

    var layer = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
        "opacity": 0.5
    });
    myMap.addLayer(layer);

    var terremotos = new FeatureLayer("https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0");
    terremotos.setDefinitionExpression("MAGNITUDE >= 2")
    
    myMap.addLayer(terremotos);
    
    layer.setVisibleLayers([0, 2, 3]) //Para ocultar la capa de highways

 
    var toggle = new BasemapToggle({
        map: myMap,
        basemap: "dark-gray"}, "toggle"); 

    toggle.startup();  

    var overview = new OverviewMap({
        map: myMap,
        attachTo: "bottom-right",
        position: "absolute",
        basemap: "gray"
    }, "divoverview");
    overview.startup();
});
