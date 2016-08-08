peer2package = angular.module 'peer2package', ['ui.router']

peer2package.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
    .state 'main', {templateUrl: 'home.html', controller: 'mainController'}
    .state 'about', {templateUrl: 'about.html', controller: 'aboutController'}

peer2package.controller 'mainController', ($scope) ->

peer2package.controller 'menuController', ($scope) ->
  $scope.authStatus = false
  console.log regForm
peer2package.controller 'mapController', ($scope) ->

peer2package.controller 'aboutController', ($scope) ->
