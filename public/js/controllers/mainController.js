(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('mainController', function($scope, $localStorage, mapService) {
    $scope.killMap = function() {
      return $scope.mapOff($scope.myInterval);
    };
    $scope.killMap();
    if ($localStorage.token) {
      return $scope.token = $localStorage.token;
    }
  });

}).call(this);
