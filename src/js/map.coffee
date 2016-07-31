guid = () ->
  g = ""
  for i in [32..0] by -1
    g += Math.floor(Math.random() * 0xF)
  return g

mapId = location.hash.replace /^#/, ''

if !mapId
  mapId = (Math.random() + 1).toString(36).substring(2, 12)
  location.hash = mapId

myUuid = localStorage.getItem 'myUuid'

if !myUuid
  myUuid = guid()
  console.log myUuid
  localStorage.setItem 'myUuid', myUuid
