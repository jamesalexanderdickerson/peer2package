(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.factory('userService', function($http, $localStorage) {
    var currentUser;
    currentUser = {};
    return {
      login: function(user) {
        var $postedUser;
        $postedUser = $http.post('/login', user);
        $postedUser.then(function(response) {
          $localStorage.token = response.data.token;
          return currentUser = jwt_decode($localStorage.token);
        });
        return $postedUser;
      },
      register: function(user) {
        var $postedUser;
        $postedUser = $http.post('/register', user);
        $postedUser.then(function(response) {
          $localStorage.token = response.data.token;
          return currentUser = jwt_decode($localStorage.token);
        });
        return $postedUser;
      },
      "delete": function(user) {
        var $postedUser;
        $postedUser = $http.post('/delete', user);
        return $postedUser.then(function(response) {
          return $localStorage.$reset();
        });
      },
      logout: function() {
        return currentUser = '';
      },
      isLoggedIn: function() {},
      currentUser: function() {
        currentUser = jwt_decode($localStorage.token);
        return currentUser;
      }
    };
  });

}).call(this);
