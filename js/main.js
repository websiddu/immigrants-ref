(function(){

    // Global variables
    var tilesUrl = "https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",
        map = null,
        tiles = null,
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

    // Init function to bootstrap the app.
    var init = function() {
        map = L.map('map', options).setView([36.421, -71.411], 4);
        tiles = L.tileLayer(tilesUrl, attributions);
        tiles.addTo(map);
        getData();
    };

    // Get the data from the json file
    var getData = function(){
        $.getJSON('data/usa.json', renderDataToMap);
    };

    // Render the data to the map
    var renderDataToMap = function(data) {
        L.geoJson(data).addTo(map);
    };

    // Initialize our application.
    init();

})();