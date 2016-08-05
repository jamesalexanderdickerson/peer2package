(function() {
  var peer2package;

  peer2package = angular.module('peer2package', ['ui.router']);

  peer2package.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    return $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'mainController'
    }).state('about', {
      url: '/about',
      templateUrl: 'about.html',
      controller: 'aboutController'
    });
  });

  peer2package.controller('mainController', function($scope) {});

  peer2package.controller('mapController', function($scope) {});

  peer2package.controller('aboutController', function($scope) {});

}).call(this);
