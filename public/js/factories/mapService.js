(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.service('mapService', [
    '$rootScope', '$geolocation', 'socket', '$interval', 'userService', function($rootScope, $geolocation, socket, $interval, userService) {
      var currentUser, latitude, longitude;
      currentUser = userService.currentUser();
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
          var map, source, url;
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;
          $rootScope.myPosition = position;
          $rootScope.myInterval = $interval((function() {
            $geolocation.getCurrentPosition({
              timeout: 60000
            }).then(function(position) {
              var url, yourPosition;
              $rootScope.myPosition = position;
              longitude = position.coords.longitude;
              latitude = position.coords.latitude;
              url = 'http://localhost:8000/user_location';
              yourPosition = currentUser.email + ', ' + longitude + ', ' + latitude;
              socket.emit('LngLat', yourPosition);
              source.setData(url);
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
          url = 'http://localhost:8000/user_location';
          source = new mapboxgl.GeoJSONSource({
            data: url
          });
          if (document.getElementById('map')) {
            return map.on('load', function() {
              $rootScope.loading = false;
              map.addSource('You', source);
              map.addLayer({
                "id": "You",
                "type": "symbol",
                "source": "You",
                "layout": {
                  "icon-image": "car"
                },
                "paint": {}
              });
              map.setCenter([longitude, latitude]);
              console.log(longitude + ',' + latitude);
              return map.on('click', function(e) {
                var feature, features, popup;
                features = map.queryRenderedFeatures(e.point, {
                  layers: ['You']
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
