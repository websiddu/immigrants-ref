(function(){

    var tilesUrl = "https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",
        options = {
            maxZoom: 5,
            minZoom: 3,
            zoomControl: false
        },
        attributions = {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'examples.map-20v6611k'
        };

    var init = function() {
        var map = L.map('map', options).setView([36.421, -71.411], 4)
        var tiles = L.tileLayer(tilesUrl, attributions)

        tiles.addTo(map)
    };


    init();

})();