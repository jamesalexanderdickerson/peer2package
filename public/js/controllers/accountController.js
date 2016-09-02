(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('accountController', [
    '$scope', 'userService', '$location', function($scope, userService, $location, mapService) {
      $scope.killMap = function() {
        return $scope.mapOff($scope.myInterval);
      };
      $scope.killMap();
      $scope.currentUser = userService.currentUser();
      $scope.name = $scope.currentUser.fname + ' ' + $scope.currentUser.lname;
      $scope.balance = 0.00;
      return $scope.deleteAccount = function(user) {
        return userService["delete"](user).then(function(response) {
          $localStorage.$reset();
          return $location.path('/');
        });
      };
    }
  ]);

}).call(this);
