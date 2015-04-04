(function () {

  // Global variables
  var tilesUrl = "https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",
    map = null,
    tiles = null,
    closeTooltip = null,
    options = {
      maxZoom: 5,
      minZoom: 3,
      zoomControl: false
    },
    statesLayer = null,
    popup = new L.Popup({ autoPan: false }),
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
    statesLayer = L.geoJson(data, {
      style: getStyle,
      onEachFeature: onEachFeature
    }).addTo(map);

    barGraph("USA");
    setTimeout(function(){bindEvents();}, 100);
  };


  var onEachFeature = function (feature, layer) {
    layer.on({
      click: updateSidebar,
      mousemove: showTooltip,
      mouseout: resetHighlight
    })
  };

  var resetHighlight = function() {
    closeTooltip = window.setTimeout(function() { map.closePopup(); }, 100);
  };

  var showTooltip = function(e) {
    var layer = e.target;
    popup.setLatLng(e.latlng);
    popup.setContent(getMapTooltip(layer.feature.properties));
    if(!popup._map) {
      popup.openOn(map);
    }
    window.clearTimeout(closeTooltip);
    layer.bringToFront();
  };

  var getMapTooltip = function(properties) {
    return "<h3>" + properties.name + "</h3> <h4> <small>Immigrants count – </small>"+ properties.total +"</h4>"
  };

  // Update the sidebar graph
  var updateSidebar = function (e) {
    if(e.target.feature.properties['isActive'] != true) {
      statesLayer.eachLayer(function(layer) {
        layer.feature.properties.isActive = false
      });

      statesLayer.setStyle(setDisableStyle);

      $('.current-state').text(e.target.feature.properties.name);
      e.target.setStyle(highlightOnClick(e));
      barGraph(e.target.feature.properties.name);
      e.target.feature.properties['isActive'] = true;
      pieChart($('.current-continent').text(), e.target.feature.properties.name);
    }
    else {
      statesLayer.eachLayer(function(layer) {
        layer.setStyle(getStyle(layer.feature))
      });
      $('.current-state').text("USA");
      e.target.feature.properties['isActive'] = false;
      barGraph("USA");
    }
  };

  var bindEvents = function() {

    $('.nv-bar').on('click', function(e){
      var index = $('.nv-bar').index(this);
      var continents = ['Europe', 'Asia', 'Africa', 'Americans', 'Oceania'];
      var currentContinent = continents[index];
      $('.current-continent').text(currentContinent);
      pieChart(currentContinent, $('.current-state').text());
    });
  };

  var pieChart = function(cont, state) {
    $.getJSON('data/sub-split.json', function(data){
      var filteredData = data[0][state][cont];
      renderPieChart(filteredData);
    });
  };


  var renderPieChart = function(data) {
    console.log(formatData(data));
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true);

      d3.select("#pie-chart svg")
        .datum(formatData(data)[0].values)
        .transition().duration(350)
        .call(chart);

      return chart;
    });

  };

  // Disabled styles
  var setDisableStyle = function() {
    return {
      weight: 0,
      dashArray: '',
      fillOpacity: 0.3
    }
  };

  // Highlight styles
  var highlightOnClick = function() {
    return {
      weight: 1,
      color: '#fff',
      dashArray: '',
      fillOpacity: 1
    }
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

  // Prepare our data in a certain format
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
