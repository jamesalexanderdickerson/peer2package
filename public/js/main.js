(function() {
  var peer2package;

  peer2package = angular.module('peer2package', ['ui.router']);

  peer2package.config(function($stateProvider, $urlRouterProvider) {
    return $stateProvider.state('main', {
      templateUrl: 'home.html',
      controller: 'mainController'
    }).state('account', {
      templateUrl: 'account.html',
      controller: 'accountController'
    }).state('map', {
      templateUrl: 'map.html',
      controller: 'mapController'
    }).state('map2', {
      templateUrl: 'map2.html',
      controller: 'mapController'
    }).state('gps', {
      templateUrl: 'gps.html',
      controller: 'gpsController'
    });
  });

  peer2package.controller('mainController', function($scope) {});

  peer2package.controller('menuController', function($scope) {
    return $scope.authStatus = false;
  });

  peer2package.controller('mapController', function($scope, socket) {
    $scope.map = null;
    $scope.lat = null;
    return $scope.lng = null;
  });

  peer2package.controller('gpsController', function($scope, socket) {});

  peer2package.controller('accountController', function($scope) {});

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
      }
    };
  });

  peer2package.directive('menuChange', function() {
    return {
      restrict: 'AE',
      link: function() {
        var arrow, btn_account, btn_home, btn_map, menu, sidenavmenu;
        menu = document.getElementById('menu');
        sidenavmenu = document.getElementById('side-nav-menu');
        arrow = document.getElementById('arrow');
        btn_home = document.getElementById('home');
        btn_account = document.getElementById('account');
        btn_map = document.getElementById('map');
        menu.addEventListener('click', function() {
          menu.classList.toggle('open');
          return sidenavmenu.classList.toggle('nav-open');
        });
        btn_account.addEventListener('click', function() {
          arrow.classList.add('account');
          arrow.classList.remove('home');
          arrow.classList.remove('map');
          btn_account.classList.add('active');
          btn_home.classList.remove('active');
          return btn_map.classList.remove('active');
        });
        btn_home.addEventListener('click', function() {
          arrow.classList.add('home');
          arrow.classList.remove('account');
          arrow.classList.remove('map');
          btn_home.classList.add('active');
          btn_account.classList.remove('active');
          return btn_map.classList.remove('active');
        });
        return btn_map.addEventListener('click', function() {
          arrow.classList.add('map');
          arrow.classList.remove('account');
          arrow.classList.remove('home');
          btn_map.classList.add('active');
          btn_home.classList.remove('active');
          return btn_account.classList.remove('active');
        });
      }
    };
  });

}).call(this);
