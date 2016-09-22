(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('menuController', [
    '$scope', '$http', '$localStorage', 'userService', 'socket', function($scope, $http, $localStorage, userService, socket, mapService) {
      var arrow, btn_home, btn_logout, menu, menubox, sidenavmenu;
      $scope.message = null;
      menu = document.getElementById('menu');
      arrow = document.getElementById('arrow');
      btn_logout = document.getElementById('logout');
      btn_home = document.getElementById('home');
      menubox = document.getElementById('menubox');
      sidenavmenu = document.getElementById('side-nav-menu');
      $scope.loggedIn = function() {
        menubox.classList.add('loggedIn');
        userService.currentUser();
        return userService.getPhoto();
      };
      if ($localStorage.token) {
        $scope.loggedIn();
      }
      $scope.submitReg = function(user) {
        return userService.register(user).then(function(response) {
          console.log(user);
          btn_home.classList.add('active');
          arrow.classList.remove('logout');
          btn_logout.classList.remove('active');
          $scope.messageReg = response.data.message;
          if (response.data) {
            $scope.token = response.data.token || null;
            $localStorage.token = response.data.token || null;
            return $scope.loggedIn();
          }
        });
      };
      $scope.submitLog = function(user) {
        return userService.login(user).then(function(response) {
          btn_home.classList.add('active');
          arrow.classList.remove('logout');
          btn_logout.classList.remove('active');
          $scope.messageLog = response.data.message;
          if (response.data) {
            $scope.token = response.data.token || null;
            $localStorage.token = response.data.token || null;
            return $scope.loggedIn();
          }
        });
      };
      return $scope.logout = function() {
        $scope.token = '';
        userService.logout();
        $scope.mapOff($scope.myInterval);
        $scope.regForm.user = {};
        $scope.loginForm.user = {};
        menubox.classList.remove('loggedIn');
        $localStorage.$reset();
        return setTimeout(function() {
          menu.classList.toggle('open');
          return sidenavmenu.classList.toggle('nav-open');
        }, 500);
      };
    }
  ]);

}).call(this);
