// Sin terminar


require([
    "esri/map",
    "esri/graphic",
    "esri/tasks/locator",
    "esri/config",
    "esri/tasks/GeometryService",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/geometry/Circle",
    "esri/geometry/Point",

    "dojo/_base/Color",
    "dojo/_base/array",
    "esri/tasks/BufferParameters",

    "dojo/dom",
    "dojo/on",
    "dojo/parser",
    "dojo/ready",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"],

    function (Map, Graphic, Locator, config, GeometryService,
            SimpleMarkerSymbol, TextSymbol, Font, Circle, Point,
            Color, array, BufferParameters,
            dom, on, parser, ready,
            BorderContainer, ContentPane) {

        ready(function () {

            parser.parse();

            var mapMain = new Map("cpCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });

            var localizador = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            config.defaults.geometryService = new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");

            var boton = on(dom.byId("boton"), "click", doAddressToLocations);

            function doAddressToLocations() {
                mapMain.graphics.clear();
                // alert("Funciona!")
                var objAddress = {"SingleLine": dom.byId("input1").value}
                var params = {
                    address: objAddress,
                    // outFields : ["Loc_name"]
                }
                localizador.addressToLocations(params)
            }

            localizador.on("address-to-locations-complete", showResults)

            function showResults(candidates) {
                console.log(candidates)

                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");
            
                var localizacion;
                array.every(candidates.addresses, function (candidate) {

                    // if the candidate was a good match
                    if (candidate.score > 80) {

                        // retrieve attribute info from the candidate
                        var attributesCandidate = {
                            address: candidate.address,
                            score: candidate.score,
                        };

                        /*
                         * Step: Retrieve the result's geometry
                         */
                        var localizacion = candidate.location

                        // Center and zoom the map on the result (Se puede hacer de dos maneras:)
                        // mapMain.centerAt(localizacion)
                        // mapMain.setZoom(15)
                        mapMain.centerAndZoom(localizacion, 15)


                        //Display the geocoded location on the map (poner el círculo en el mapa)
                        mapMain.graphics.add(new Graphic(localizacion, symbolMarker));


                        // display the candidate's address as text
                        // var sAddress = candidate.address;
                        // var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                        // textSymbol.setOffset(0, -22);
                        // mapMain.graphics.add(new Graphic(localizacion, textSymbol));

                    // exit the loop after displaying the first good match
                    return false;

         
            
            
            





                        var params = new BufferParameters();
                        params.distances = [ dom.byId("input2").value ];
                        params.outSpatialReference = mapMain.spatialReference;
                        params.unit = params.unit = GeometryService.UNIT_METER;

                        config.defaults.geometryService.buffer(params, showBuffer);


                        function showBuffer(bufferedGeometries) {
                            var symbol = new SimpleFillSymbol(
                                SimpleFillSymbol.STYLE_SOLID,
                                new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([255,0,0,0.65]), 2
                                ),
                                new Color([255,0,0,0.35])
                            );
                            array.forEach(bufferedGeometries, function(geometry) {
                                var graphic = new Graphic(geometry, symbol);
                                map.graphics.add(graphic);
                                });
            
                    }

            }
                });
            }
        })
    }
)
