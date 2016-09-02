peer2package = angular.module 'peer2package'
peer2package.controller 'mainController', ($scope, $localStorage, mapService) ->
  $scope.killMap = () ->
    $scope.mapOff($scope.myInterval)
  $scope.killMap()
  if $localStorage.token
    $scope.token = $localStorage.token
