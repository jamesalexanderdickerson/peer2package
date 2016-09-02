(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.factory('socket', function($rootScope) {
    var socket;
    socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args;
          args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args;
          args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      disconnect: function() {
        return socket.disconnect();
      }
    };
  });

}).call(this);
