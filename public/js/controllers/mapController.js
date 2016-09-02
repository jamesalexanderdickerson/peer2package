(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('mapController', [
    '$scope', 'mapService', 'socket', 'userService', function($scope, mapService, socket, userService) {
      $scope.moveToPosition = function() {
        return mapService.moveCenter();
      };
      $scope.chat_open = false;
      $scope.open_chat = function() {
        return $scope.chat_open = true;
      };
      $scope.close_chat = function() {
        return $scope.chat_open = false;
      };
      $scope.submitChat = function(message) {
        socket.emit('chat message', {
          message: message
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
