peer2package = angular.module 'peer2package', ['ui.router']

peer2package.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/home'
  $stateProvider
    .state 'home', {url: '/home', templateUrl: 'home.html', controller: 'mainController'}
    .state 'about', {url: '/about', templateUrl: 'about.html', controller: 'aboutController'}

peer2package.controller 'mainController', ($scope) ->

peer2package.controller 'mapController', ($scope) ->

peer2package.controller 'aboutController', ($scope) ->
