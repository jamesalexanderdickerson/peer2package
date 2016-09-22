peer2package = angular.module 'peer2package'
peer2package.controller 'accountController', ['$scope', 'userService', '$location', '$localStorage', ($scope, userService, $location, mapService, $localStorageProvider, $localStorage) ->
  $scope.photo = './img/profile.gif'

  storePhoto = () ->
    photoTemp = localStorage.getItem('ngStorage-photo')
    photoTempFirstPass = photoTemp.replace /public/g, ''
    $scope.photo = photoTempFirstPass.replace /"/g, ''
    console.log $scope.photo
  if localStorage.getItem('ngStorage-photo') != null then storePhoto()
  $scope.killMap = () ->
    $scope.mapOff($scope.myInterval)
  $scope.killMap()
  $scope.currentUser = userService.currentUser()
  $scope.name = $scope.currentUser.fname + ' ' + $scope.currentUser.lname
  $scope.balance = 0.00
  $scope.deleteAccount = (user) ->
    userService.delete(user).then((response) ->
      $localStorage.$reset()
      $location.state 'main'
    )

]
