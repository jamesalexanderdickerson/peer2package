(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.factory('userService', function($http) {
    var currentUser;
    currentUser = {};
    return {
      login: function(user) {
        var $postedUser;
        $postedUser = $http.post('/login', user);
        $postedUser.then(function(response) {
          return currentUser = response.data.user;
        });
        return $postedUser;
      },
      register: function(user) {
        var $postedUser;
        $postedUser = $http.post('/register', user);
        $postedUser.then(function(response) {
          return currentUser = response.data.user;
        });
        return $postedUser;
      },
      "delete": function(user) {
        var $postedUser;
        $postedUser = $http.post('/delete', user);
        return $postedUser.then(function(response) {
          return currentUser = '';
        });
      },
      isLoggedIn: function() {},
      currentUser: function() {
        return currentUser;
      }
    };
  });

}).call(this);
