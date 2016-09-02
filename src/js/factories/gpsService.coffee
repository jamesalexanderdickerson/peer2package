peer2package = angular.module 'peer2package'
peer2package.service 'gpsService', ['$rootScope', '$geolocation', ($rootScope, $geolocation) ->
  longitude = null
  latitude = null
  $rootScope.$on('$viewContentLoaded', () ->
    $geolocation.getCurrentPosition({
      timeout: 60000
    })
    .then (position) ->
      $rootScope.myPosition = position
      $geolocation.watchPosition({
        timeout: 60000,
        maximumAge: 250,
        enableHighAccuracy: true
      })
      $rootScope.myPosition = $geolocation.position
      $rootScope.$watch('myPosition.coords', (newValue, oldValue) ->
        $rootScope.longitude = newValue.longitude
        longitude = $rootScope.longitude
        $rootScope.latitude = newValue.latitude
        latitude = $rootScope.latitude
        map.setCenter([$rootScope.longitude, $rootScope.latitude])
      )
      $rootScope.loading = false
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw'
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
      zoom: 19,
      pitch: 45
    })
    map.addControl(new mapboxgl.Directions())
    map.setCenter([longitude, latitude])
  )
]
