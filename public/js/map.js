(function() {
  var guid, mapId, myUuid;

  guid = function() {
    var g, i, j;
    g = "";
    for (i = j = 32; j >= 0; i = j += -1) {
      g += Math.floor(Math.random() * 0xF);
    }
    return g;
  };

  mapId = location.hash.replace(/^#/, '');

  if (!mapId) {
    mapId = (Math.random() + 1).toString(36).substring(2, 12);
    location.hash = mapId;
  }

  myUuid = localStorage.getItem('myUuid');

  if (!myUuid) {
    myUuid = guid();
    console.log(myUuid);
    localStorage.setItem('myUuid', myUuid);
  }

}).call(this);
