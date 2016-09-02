peer2package = angular.module 'peer2package'
peer2package.controller 'accountController', ['$scope', 'userService', '$location', ($scope, userService, $location, mapService) ->
  $scope.killMap = () ->
    $scope.mapOff($scope.myInterval)
  $scope.killMap()
  $scope.currentUser = userService.currentUser()
  $scope.name = $scope.currentUser.fname + ' ' + $scope.currentUser.lname
  $scope.balance = 0.00
  $scope.deleteAccount = (user) ->
    userService.delete(user).then((response) ->
      $localStorage.$reset()
      $location.path '/'
    )

]
