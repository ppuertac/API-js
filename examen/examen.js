var mapa

require(["esri/map",
    "esri/geometry/Extent",
    "esri/layers/FeatureLayer",
    "esri/tasks/ServiceAreaTask",
    "esri/tasks/ServiceAreaParameters",
    "esri/tasks/FeatureSet",
    
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/Color",
    "esri/graphic",
    "esri/tasks/NATypes",

    "esri/tasks/query",
    "esri/tasks/QueryTask",

    "dojo/on",

    "dijit/TitlePane",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"],

  function (
    Map, Extent, FeatureLayer, ServiceAreaTask, ServiceAreaParameters, FeatureSet, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, Graphic, NATypes, Query, QueryTask,
    on, TitlePane, TabContainer, ContentPane, BorderContainer, domReady
  ) {

    extension = new Extent(
        {"xmin": -440566.0543149413,
        "ymin": 4908580.6462827136,
        "xmax": -381862.41659200506,
        "ymax": 4937397.405946185,
        "spatialReference": {
            "wkid": 102100}
        }
    );

    mapa = new Map("mapa", {
        basemap: "topo",
        zoom: 12,
        extent: extension
        });


    var centrosSalud = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_PPC/FeatureServer/0", {
        outFields: ["*"],
        });

    mapa.addLayer(centrosSalud);
    // centrosSalud.hide()

    console.log(centrosSalud)



    var serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");

    
    var query = new Query();
    query.where = "1 = 1";
    query.returnGeometry = true
    query.outFields = ['*']
    var seleccion = centrosSalud.selectFeatures(query, crearFeatureSet());



    function crearFeatureSet(featureSet){

        var entidades = featureSet.features

        for (let centroSalud of entidades){
            var location = new Graphic(centroSalud.geometry, pointSymbol);
            var features = [];
            features.push(location);
            var facilities = new FeatureSet();
            facilities.features = features;

            var parametros = new ServiceAreaParameters();
            parametros.defaultBreaks = [3, 5, 10];
            parametros.impedanceAttribute = "TiempoPie";
            parametros.facilities = facilities
            parametros.outSpatialReference = mapa.spatialReference;
            parametros.outputPolygons = NATypes.OutputPolygon.DETAILED;
            parametros.overlapPolygons = true;
            parametros.travelDirection = NATypes.TravelDirection.TO_FACILITY;
        }
    
    }
    var color1 = new SimpleFillSymbol();
    color1.setColor(new Color([51, 105, 30, 0.5]));
        
    var color2 = new SimpleFillSymbol();
    color2.setColor(new Color([104, 159, 56, 0.5]));   

    var color3 = new SimpleFillSymbol();
    color3.setColor(new Color([156, 204, 101, 0.5]));


    serviceAreaTask.solve(parametros)
});