(function() {
  var peer2package;

  peer2package = angular.module('peer2package', ['ui.router', 'ngStorage', 'ngGeolocation', 'ngFileUpload', 'ngImgCrop']);

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
    }).state('photoUpload', {
      templateUrl: 'photo_upload.html',
      controller: 'uploadController'
    }).state('gps', {
      templateUrl: 'gps.html',
      controller: 'gpsController'
    });
  });

}).call(this);
