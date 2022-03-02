require([
    "esri/map",
    "esri/graphic",
    "esri/tasks/locator",
    "esri/config",
    "esri/tasks/GeometryService",
    "esri/toolbars/draw",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/geometry/Circle",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/graphic",
    "esri/geometry/webMercatorUtils",

    "dojo/_base/Color",
    "dojo/_base/array",
    "esri/tasks/BufferParameters",

    "dojo/dom",
    "dojo/on",
    "dojo/parser",
    "dojo/ready",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"],

    function (Map, Graphic, Locator, config, GeometryService, Draw,
            SimpleMarkerSymbol, TextSymbol, Font, Circle, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, Graphic, webMercatorUtils,
            Color, array, BufferParameters,
            dom, on, parser, ready,
            BorderContainer, ContentPane) {

        ready(function () {

            parser.parse();

            var mapa1 = new Map("mapa1", {
                basemap: "gray"
            });

            var mapa2 = new Map("mapa2", {
                basemap: "dark-gray"
            })

            var clic = on(dom.byId("mapa1"), "click", createPoint)
            
            function createPoint(evt){
                console.log("evt", evt)
                console.log("evt", evt.mapPoint.x)

                mapa1.graphics.clear();

                //Para añadir el punto clickado al mapa1
                var punto1 = new Point(evt.mapPoint.x, evt.mapPoint.y, mapa1.spatialReference)

                var symbol1 = new SimpleMarkerSymbol();
                symbol1.setSize(12);
                symbol1.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
                symbol1.setColor(new Color([255, 127, 0, 0.5]));

                var graphicpoint = new Graphic(punto1, symbol1);
                mapa1.graphics.add(graphicpoint);

                mapa1.centerAndZoom(punto1, 3)


                //Creamos las antípodas
                var centerLatLong = webMercatorUtils.xyToLngLat(evt.mapPoint.x, evt.mapPoint.y);

                var latitud = - centerLatLong[1];

                var longitud;
                if (centerLatLong[0] < 0){
                    longitud = centerLatLong[0] + 180;
                }
                else{
                    longitud = centerLatLong[0] - 180;
                }

                console.log("latitud", latitud)
                console.log("longitud", longitud)
                

                //Dibujamos el segundo punto
                mapa2.graphics.clear();

                var punto2 = new Point(longitud, latitud)

                var symbol2 = new SimpleMarkerSymbol();
                symbol2.setSize(12);
                symbol2.setColor(new Color([255, 127, 0, 0.5]));

                var graphicpoint = new Graphic(punto2, symbol2);
                mapa2.graphics.add(graphicpoint);

                mapa2.centerAndZoom(punto2, 3);
            }            
        })
    }
)