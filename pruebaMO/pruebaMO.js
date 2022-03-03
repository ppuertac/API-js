var mapa
var tb;
require(["esri/map",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/dijit/BasemapGallery",
    "esri/dijit/Legend",
    "esri/dijit/Search",
    "esri/dijit/OverviewMap",
    "esri/dijit/Scalebar",
    "esri/dijit/PopupTemplate",
    "esri/toolbars/draw",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/Color",
    "esri/graphic",
    "esri/tasks/query",
    "esri/graphicsUtils",

    "dojo/on",

    "dijit/TitlePane",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"],

  function (
    Map, Extent, ArcGISDynamicMapServiceLayer, FeatureLayer, BasemapGallery, Legend, Search, OverviewMap, Scalebar, PopupTemplate,
    Draw, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, Graphic, Query, graphicsUtils,
    on, TitlePane, TabContainer, ContentPane, BorderContainer, domReady
  ) {

    //Para pintar las ciudades
    on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);

    function fPintaYQuery() {
        estados.hide();
        var dibujar = new Draw(mapa);
        dibujar.activate(Draw.POLYGON)
        dibujar.on("draw-end", displayPolygon);
    }
    function displayPolygon(evt) {

        var geometryInput = evt.geometry;

        var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

        mapa.graphics.clear();

        var poligono = new Graphic(geometryInput, tbDrawSymbol);
        mapa.graphics.add(poligono);

        seleccionarCiudades(geometryInput);
    }
    function seleccionarCiudades(geometryInput){
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
        var myQuery = new Query();
        myQuery.geometry = geometryInput;

        ciudades.selectFeatures(myQuery);

        ciudades.setSelectionSymbol(symbolSelected);
    }


    //Para ir al estado:
    on(dojo.byId("progButtonNode"), "click", fQueryEstados);

        function fQueryEstados() {
          // Guardamos el valor del input
          var inputState = dojo.byId("dtb").value;

          // Definimos una simbología para los estados seleccionados
          var sbState = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            new Color([255,0,0]), 2),new Color([255,255,0,0.5])
          );

          // Aplicamos la simbología a los estados seleccionados
          estados.setSelectionSymbol(sbState);

          // Definimos la consulta
          var queryState = new Query();
          queryState.where = `state_name = '${inputState}'`;
          estados.selectFeatures(
            queryState, // Aplicamos la clausula Where de la consulta
            FeatureLayer.SELECTION_NEW, // Marcamos como nueva selección
            function(selection) { // Función para hacer zoom al estado
              var centerSt = graphicsUtils.graphicsExtent(selection).getCenter();
              var extentSt = esri.graphicsExtent(selection);

              mapa.setExtent(extentSt.getExtent().expand(2));
              mapa.centerAt(centerSt);
          });
        };



    //Crear mapa y widgets
    extension = new Extent(
        {"xmin": -19915505.361930266,
        "ymin": 2695907.2599709085,
        "xmax": -4887374.104842329,
        "ymax": 10072997.733827878,
        "spatialReference": {
            "wkid": 102100}
        }
    );

    mapa = new Map("map", {
        basemap: "topo",
        //   center: [-99.635485, 40.044044], // long, lat
        zoom: 4,
        sliderStyle: "small",
        extent: extension
        });

    mapa.on("load", function (evt) {
      mapa.resize();
      mapa.reposition();
    });

    var basemapsgallery = new BasemapGallery({
        map: mapa,
        showArcGISBasemaps: true,
   }, "basemapGallery");
   basemapsgallery.startup()

   var buscar = new Search({
    map: mapa,
    enableSuggestions: true
    }, "divSearch")
    buscar.startup()

    var overview = new OverviewMap({
        map: mapa,
        basemap: "gray",
        visible: true, 
        attachTo: "bottom-left",
    });
    overview.startup();

    var escala = new Scalebar({
        map: mapa,
        attachTo: "bottom-right"
    });

    var leyendaWidget = new Legend({
        map: mapa,
    }, "legendDiv");
    leyendaWidget.startup();

    // Crear popup
    var popup = new PopupTemplate({
        title: "Estado de {state_name}, {state_abbr}",
        fieldInfos: [{
            fieldName: "pop2000",
            label: "Población:",
            visible: true
          }, {
            fieldName: "pop00_sqmi",
            label: "Población por sqmi:",
            visible: true
          }, {
            fieldName: "ss6.gdb.States.area",
            label: "Área en sqmi:",
            visible: true  
          }]
    })


    //Meter las capas. Se pueden meter así o en un dynamic mapa y ocultar las capas que vamos a usar en las queries. Luego las metemos como Feature Layer.
    var ciudades = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0");
    var carreteras = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1");
    var estados = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {
        outFields: ["*"],
        infoTemplate: popup});
    var paises = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3");

    mapa.addLayers([paises, carreteras, ciudades, estados]);

});