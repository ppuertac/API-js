require(["esri/map", "esri/geometry/Extent", "dojo/domReady!"], function(Map, Extent){
    var myMap = new Map("divMap", {
        basemap: "satellite",
        center: [-4.69, 40.65],
        zoom: 12
    })
});

require(["esri/map", "esri/geometry/Extent", "dojo/domReady!"], function(Mapa, Extent){
    var mapa2 = new Mapa("div2", {
        basemap: "topo-vector",
        center: [-122.45, 37.75],
        zoom: 12
        // extent: new Extent({
        //     xmin:-2290762.5378059917, 
        //     ymin: 3949746.9193043225, 
        //     xmax: 1466270.2764659931, 
        //     ymax: 5794019.537768565, 
        //     SpatialReference: {wkid: 102100}
        // })
    })
});