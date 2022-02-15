
require(["esri/map", "dojo/dom", "dojo/on", "dojo/fx", "dojo/domReady!"], function(Mapa, dom, on){
    var mapa2 = new Mapa("divMap", {
        basemap: "topo-vector",
        center: [-122.45, 37.75],
        zoom: 12
    })
    var clic = dom.byId("divMap")
    on(clic, "click", function(evt){
        console.log("Has hecho click! " + "El mapa base es:", mapa2.getBasemap())
    })
});