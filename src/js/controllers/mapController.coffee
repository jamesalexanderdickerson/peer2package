peer2package = angular.module 'peer2package'
peer2package.controller 'mapController', ['$scope', 'mapService', 'socket', 'userService', ($scope, mapService, socket, userService) ->
  $scope.moveToPosition = () ->
    mapService.moveCenter()

  $scope.chat_open = false

  $scope.open_chat = () ->
    $scope.chat_open = true

  $scope.close_chat = () ->
    $scope.chat_open = false
  $scope.submitChat = (message) ->
    socket.emit 'chat message', {
      message: message
    }
    $scope.sent = message
    $scope.message = ''
  socket.on 'chat message', (message) ->
    messagelist = angular.element(document.querySelector('#messages > ul'))
    messagelist.append('<li>' + message + '</li>')
]
