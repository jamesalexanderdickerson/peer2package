(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.service('gpsService', [
    '$rootScope', '$geolocation', function($rootScope, $geolocation) {
      var latitude, longitude;
      longitude = null;
      latitude = null;
      return $rootScope.$on('$viewContentLoaded', function() {
        var map;
        $geolocation.getCurrentPosition({
          timeout: 60000
        }).then(function(position) {
          $rootScope.myPosition = position;
          $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
          });
          $rootScope.myPosition = $geolocation.position;
          $rootScope.$watch('myPosition.coords', function(newValue, oldValue) {
            $rootScope.longitude = newValue.longitude;
            longitude = $rootScope.longitude;
            $rootScope.latitude = newValue.latitude;
            latitude = $rootScope.latitude;
            return map.setCenter([$rootScope.longitude, $rootScope.latitude]);
          });
          return $rootScope.loading = false;
        });
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw';
        map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
          zoom: 19,
          pitch: 45
        });
        map.addControl(new mapboxgl.Directions());
        return map.setCenter([longitude, latitude]);
      });
    }
  ]);

}).call(this);
