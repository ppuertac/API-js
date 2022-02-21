var mapMain;

require([
        "esri/map",
        "esri/graphic",
        "esri/tasks/locator",

        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/symbols/Font",

        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],

    function (Map, Graphic, Locator,
              SimpleMarkerSymbol, TextSymbol, Font,
              Color, array,
              dom, on, parser, ready,
              BorderContainer, ContentPane) {

        ready(function () {

            parser.parse();

            var mapMain = new Map("cpCenter", {
                basemap: "topo",
                center: [-117.19, 34.05],
                zoom: 13
            });


              /*
             * Step: Construct and bind the Locator task
             */
            var localizador = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer")

            /*
             * Step: Wire the button's onclick event handler
             */
            // on(dom.byId("btnLocate"), "click", console.log("Has hecho click"))
            //También se puede hacer como abajo:
            // function hashechoclick(){
            //     console.log("Has hecho click")
            // }

            var boton = on(dom.byId("btnLocate"), "click", doAddressToLocations)
            

            function doAddressToLocations() {
                mapMain.graphics.clear();
                // alert("Funciona!")

                /*
                 * Step: Complete the Locator input parameters
                 */
                var objAddress = {"SingleLine": dom.byId("taAddress").value}
                var params = {
                    address: objAddress,
                    outFields : ["Loc_name"]
                }


                /*
                 * Step: Execute the task
                 */
                localizador.addressToLocations(params)
            }

              /*
             * Step: Wire the task's completion event handler
             */
            localizador.on("address-to-locations-complete", showResults)
            

            function showResults(candidates) {
                console.log(candidates)
                // Define the symbology used to display the results
                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

                // loop through the array of AddressCandidate objects
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
                        var sAddress = candidate.address;
                        var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                        textSymbol.setOffset(0, -22);
                        mapMain.graphics.add(new Graphic(localizacion, textSymbol));


                        // exit the loop after displaying the first good match
                        return false;
                    }
                });
            }

        });

    });