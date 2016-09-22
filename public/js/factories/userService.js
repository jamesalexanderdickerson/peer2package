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
      getPhoto: function(user) {
        var $userPhoto;
        $userPhoto = $http.get('/photo', user);
        return $userPhoto.then(function(response) {
          var photo;
          if (response.data.photo === null) {
            return photo = './img/profile.gif';
          } else {
            photo = response.data.photo;
            return $localStorage.photo = photo;
          }
        });
      },
      logout: function() {
        return currentUser = '';
      },
      currentUser: function() {
        if ($localStorage.token) {
          currentUser = jwt_decode($localStorage.token);
        } else {
          currentUser = '';
        }
        return currentUser;
      }
    };
  });

}).call(this);
