peer2package = angular.module 'peer2package'
peer2package.controller 'mapController', ['$scope', 'mapService', 'socket', 'userService', '$http', ($scope, mapService, socket, userService, $http) ->

  $scope.chat_open = false
  $scope.selectedUser = null
  $scope.Users = null
  $scope.currentUser = userService.currentUser()

  $http.get('/users').success((result) ->
    $scope.Users = result.names
  )

  $scope.open_chat = () ->
    $scope.chat_open = true

  $scope.close_chat = () ->
    $scope.chat_open = false

  $scope.submitChat = (message) ->
    socket.emit 'chat message', {
      from: $scope.currentUser.fname + ' ' + $scope.currentUser.lname,
      message: message,
      to: $scope.selectedUser
    }
    $scope.sent = message
    $scope.message = ''
  socket.on 'chat message', (message) ->
    messagelist = angular.element(document.querySelector('#messages > ul'))
    messagelist.append('<li>' + message + '</li>')
]
