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
        $.getJSON('data/immigrants.geo.json', renderDataToMap);
    };

    // Render the data to the map
    var renderDataToMap = function(data) {
        L.geoJson(data, {style: getStyle}).addTo(map);
    };

    // Util Methods
    var getStyle = function(feature) {
        return {
            fillColor: getColor(feature.properties.total),
            weight: 1,
            opacity: 0.9,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.9
        };
    };

    // Returns a color based on the scale
    // Refer https://github.com/mbostock/d3/wiki/Quantitative-Scales
    var getColor = function(value){
        return d3.scale.linear()
            .domain([18568, 4314692]) // Min and Max values
            .range(['#fdbb84', '#d7301f'])(value)
    };

    // Initialize our application.
    init();

})();