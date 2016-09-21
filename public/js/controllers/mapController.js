(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('mapController', [
    '$scope', 'mapService', 'socket', 'userService', '$http', function($scope, mapService, socket, userService, $http) {
      $scope.chat_open = false;
      $scope.selectedUser = null;
      $scope.Users = null;
      $scope.currentUser = userService.currentUser();
      $http.get('/users').success(function(result) {
        return $scope.Users = result.names;
      });
      $scope.open_chat = function() {
        return $scope.chat_open = true;
      };
      $scope.close_chat = function() {
        return $scope.chat_open = false;
      };
      $scope.submitChat = function(message) {
        socket.emit('chat message', {
          from: $scope.currentUser.fname + ' ' + $scope.currentUser.lname,
          message: message,
          to: $scope.selectedUser
        });
        $scope.sent = message;
        return $scope.message = '';
      };
      return socket.on('chat message', function(message) {
        var messagelist;
        messagelist = angular.element(document.querySelector('#messages > ul'));
        return messagelist.append('<li>' + message + '</li>');
      });
    }
  ]);

}).call(this);
