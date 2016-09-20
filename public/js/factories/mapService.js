(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.service('mapService', [
    '$rootScope', '$geolocation', 'socket', '$interval', 'userService', '$http', function($rootScope, $geolocation, socket, $interval, userService, $http) {
      var latitude, longitude;
      $rootScope.mapOff = function(arg) {
        return $interval.cancel(arg);
      };
      $rootScope.loading = true;
      longitude = null;
      latitude = null;
      return $rootScope.$on('$viewContentLoaded', function() {
        var moveCenter;
        $geolocation.getCurrentPosition({
          timeout: 60000
        }).then(function(position) {
          var geojson, map, url;
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;
          $rootScope.myPosition = position;
          $rootScope.myInterval = $interval((function() {
            $geolocation.getCurrentPosition({
              timeout: 60000
            }).then(function(position) {
              var currentUser, url, yourPosition;
              $rootScope.myPosition = position;
              currentUser = userService.currentUser();
              console.log(currentUser);
              longitude = position.coords.longitude;
              latitude = position.coords.latitude;
              url = 'http://localhost:8000/locations';
              yourPosition = currentUser.email + ', ' + longitude + ', ' + latitude;
              socket.emit('LngLat', yourPosition);
            });
          }), 1000);
          mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw';
          if (document.getElementById('map')) {
            map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
              zoom: 19
            });
          }
          url = 'http://localhost:8000/locations';
          geojson = null;
          $http.get(url).then(function(response) {
            return geojson = response.data;
          });
          if (document.getElementById('map')) {
            return map.on('load', function() {
              $rootScope.loading = false;
              map.addSource('Locations', {
                "type": 'geojson',
                "data": geojson
              });
              map.addLayer({
                "id": "Locations",
                "type": "symbol",
                "source": "Locations",
                "layout": {
                  "icon-image": "{icon}"
                },
                "paint": {}
              });
              map.setCenter([longitude, latitude]);
              return map.on('click', function(e) {
                var feature, features, popup;
                features = map.queryRenderedFeatures(e.point, {
                  layers: ['Locations']
                });
                if (!features.length) {
                  return;
                }
                feature = features[0];
                return popup = new mapboxgl.Popup({
                  closeButton: false
                }).setLngLat([longitude, latitude]).setHTML(feature.properties.description).addTo(map);
              });
            });
          }
        });
        return moveCenter = function() {
          return map.flyTo({
            center: [longitude, latitude]
          });
        };
      });
    }
  ]);

}).call(this);
