peer2package = angular.module 'peer2package'
peer2package.service 'mapService', ['$rootScope', '$geolocation', 'socket', '$interval', ($rootScope, $geolocation, socket, $interval) ->
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
          longitude = position.coords.longitude
          latitude = position.coords.latitude
          url = 'http://localhost:8000/user_location'
          # url2 = 'http://localhost:8000/other_positions'
          yourPosition = longitude + ', ' + latitude
          source.setData(url)
          # source2.setData(url2)
          socket.emit 'LngLat', yourPosition
          return
        return
      ), 1000
      mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw'
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
        zoom: 19
      }) if document.getElementById 'map'
      url = 'http://localhost:8000/user_location'
      # url2 = 'http://localhost:8000/other_positions'
      source = new mapboxgl.GeoJSONSource {data:url}
      # source2 = new mapboxgl.GeoJSONSource {data:url2}
      if document.getElementById 'map'
        map.on 'load', () ->
          $rootScope.loading = false
          map.addSource 'You', source
          # map.addSource 'Others', source2
          map.addLayer({
            "id": "You",
            "type": "symbol",
            "source": "You",
            "layout": {
              "icon-image": "car",
            },
            "paint": {}
          })
          # map.addLayer({
          #   "id": "Others",
          #   "type": "symbol",
          #   "source": "Others",
          #   "layout": {
          #     "icon-image": "packages",
          #   },
          #   "paint": {}
          #   })
          map.setCenter([longitude, latitude])
          console.log(longitude + ',' + latitude)
          map.on 'click', (e) ->
            features = map.queryRenderedFeatures e.point, {layers:['You']}
            if (!features.length)
              return
            feature = features[0]
            popup = new mapboxgl.Popup({closeButton:false}).setLngLat([longitude, latitude]).setHTML(feature.properties.description).addTo(map)


    moveCenter = () ->
      return map.flyTo {center:[longitude,latitude]}


  )
]
