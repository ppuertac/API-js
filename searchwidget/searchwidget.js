var mapMain;

require([
        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "esri/map",
        "esri/dijit/Search"],

    function (Color, array, dom, on, parser, ready, BorderContainer, ContentPane, Map, Search) {
        ready(function () {
            parser.parse();
            
            var mapa = new Map("cpCenter",{
                    basemap: "topo-vector"
            });
            var buscar = new Search({
                    map: mapa,
                    enableSuggestions: true
            }, "divSearch")
            buscar.startup()
            });
    });