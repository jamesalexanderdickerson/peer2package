(function() {
  var getLocation, lat, lng, moveToPosition, showPosition, socket;

  lat = null;

  lng = null;

  socket = io();

  getLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = 'Geolocation is not supported by this browser.';
    }
  };

  showPosition = function(position) {
    var map, preloader, source, url;
    lat = position.coords['latitude'];
    lng = position.coords['longitude'];
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
      zoom: 19,
      center: [lng, lat]
    });
    url = 'http://localhost:8000/user_location';
    source = new mapboxgl.GeoJSONSource({
      data: url
    });
    window.setInterval((function() {
      var yourPosition;
      navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords['latitude'];
        lng = position.coords['longitude'];
      });
      yourPosition = lng + ',' + lat;
      socket.emit('LngLat', yourPosition);
      source.setData(url);
    }), 1000);
    map.on('load', function() {
      map.addSource('You', source);
      map.addLayer({
        'id': 'You',
        'type': 'circle',
        'source': 'You',
        'paint': {
          'circle-radius': 20,
          'circle-color': '#E65D5D'
        }
      });
    });
    map.on('click', function(e) {
      var feature, features, popup;
      features = map.queryRenderedFeatures(e.point, {
        layers: ['You']
      });
      if (!features.length) {
        return;
      }
      feature = features[0];
      popup = (new mapboxgl.Popup).setLngLat(feature.geometry.coordinates).setHTML(feature.properties.description).addTo(map);
    });
    preloader = document.getElementById('preloader');
    setTimeout((function() {
      preloader.classList.add('hidden');
    }), 0);
  };

  moveToPosition = function() {
    map.flyTo({
      center: [lng, lat]
    });
  };

  window.onload = function() {
    getLocation();
  };

}).call(this);
