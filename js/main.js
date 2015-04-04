(function () {

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
  var init = function () {
    map = L.map('map', options).setView([36.421, -71.411], 4);
    tiles = L.tileLayer(tilesUrl, attributions);
    tiles.addTo(map);
    getData();
  };

  // Get the data from the json file
  var getData = function () {
    $.getJSON('data/immigrants.geo.json', renderDataToMap);
  };

  // Render the data to the map
  var renderDataToMap = function (data) {
    L.geoJson(data, {
      style: getStyle,
      onEachFeature: onEachFeature
    }).addTo(map);
  };

  var onEachFeature = function (feature, layer) {
    layer.on({
      click: updateSidebar
    })
  };

  var updateSidebar = function (e) {
    var layer = e.target;
    $('.current-state').text(layer.feature.properties.name)
    barGraph(layer.feature.properties.name);
  };

  var barGraph = function (state) {
    $.getJSON('data/split.json', function (data) {
      renderBarGraph(data[0][state]);
    });
  };

  // Render the bar graph on the side
  var renderBarGraph = function (stateData) {
    nv.addGraph(function () {
      var chart = nv.models.discreteBarChart()
          .x(function (d) { return d.label })
          .y(function (d) { return d.value })
          .staggerLabels(false)
          .tooltips(true)
          .showValues(true);

      chart.yAxis
        .tickFormat(d3.format(',.0f'));

      d3.select('#bar-chart svg')
        .datum(formatData(stateData))
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  };

  var formatData = function (data) {

    var output = [
      {
        key: "Number of immigrants",
        values: []
      }
    ];

    for (var key in data) {
      output[0].values.push({
        "label": key,
        "value": data[key]
      })
    }

    return output;
  };

  // Util Methods
  var getStyle = function (feature) {
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
  var getColor = function (value) {
    return d3.scale.linear()
      .domain([18568, 4314692]) // Min and Max values
      .range(['#fdbb84', '#d7301f'])(value)
  };

  // Initialize our application.
  init();

})();