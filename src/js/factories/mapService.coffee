peer2package = angular.module 'peer2package'
peer2package.service 'mapService', ['$rootScope', '$geolocation', 'socket', '$interval', 'userService', '$http', ($rootScope, $geolocation, socket, $interval, userService, $http) ->
  $rootScope.mapOff = (arg) ->
    $interval.cancel(arg)

  $rootScope.loading = true
  longitude = null
  latitude = null
  $rootScope.$on('$viewContentLoaded', () ->
    $geolocation.getCurrentPosition({
      timeout: 60000
    })
    .then (position) ->
      longitude = position.coords.longitude
      latitude = position.coords.latitude
      $rootScope.myPosition = position
      $rootScope.myInterval = $interval (->
        $geolocation.getCurrentPosition(timeout: 60000).then (position) ->
          $rootScope.myPosition = position
          currentUser = userService.currentUser()
          console.log(currentUser);
          longitude = position.coords.longitude
          latitude = position.coords.latitude
          url = 'http://localhost:8000/locations'
          yourPosition = currentUser.email + ', ' + longitude + ', ' + latitude
          socket.emit 'LngLat', yourPosition
          # source.setData(url)
          return
        return
      ), 1000
      mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw'
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
        zoom: 19
      }) if document.getElementById 'map'
      url = 'http://localhost:8000/locations'
      geojson = null
      $http.get(url).then((response) ->
        geojson = response.data
      )
      # source = new mapboxgl.GeoJSONSource {data:url}
      if document.getElementById 'map'
        map.on 'load', () ->
          $rootScope.loading = false
          map.addSource 'Locations', {
            "type": 'geojson',
            "data": geojson
          }
          map.addLayer({
            "id": "Locations",
            "type": "symbol",
            "source": "Locations",
            "layout": {
              "icon-image": "{icon}",
            },
            "paint": {}
          })
          map.setCenter([longitude, latitude])
          map.on 'click', (e) ->
            features = map.queryRenderedFeatures e.point, {layers:['Locations']}
            if (!features.length)
              return
            feature = features[0]
            popup = new mapboxgl.Popup({closeButton:false}).setLngLat([longitude, latitude]).setHTML(feature.properties.description).addTo(map)


    moveCenter = () ->
      return map.flyTo {center:[longitude,latitude]}


  )
]
