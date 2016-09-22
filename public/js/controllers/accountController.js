(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('accountController', [
    '$scope', 'userService', '$location', '$localStorage', function($scope, userService, $location, mapService, $localStorageProvider, $localStorage) {
      var storePhoto;
      $scope.photo = './img/profile.gif';
      storePhoto = function() {
        var photoTemp, photoTempFirstPass;
        photoTemp = localStorage.getItem('ngStorage-photo');
        photoTempFirstPass = photoTemp.replace(/public/g, '');
        $scope.photo = photoTempFirstPass.replace(/"/g, '');
        return console.log($scope.photo);
      };
      if (localStorage.getItem('ngStorage-photo') !== null) {
        storePhoto();
      }
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
          return $location.state('main');
        });
      };
    }
  ]);

}).call(this);
