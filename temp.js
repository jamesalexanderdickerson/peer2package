window.setInterval(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords["latitude"];	
      lng = position.coords["longitude"];
    });
    var yourPosition = lng + ',' + lat;
    socket.emit('LngLat', yourPosition);
    source.setData(url);
    }, 1000);
