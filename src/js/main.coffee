peer2package = angular.module 'peer2package', ['ui.router']

peer2package.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
    .state 'main', {templateUrl: 'home.html', controller: 'mainController'}
    .state 'account', {templateUrl: 'account.html', controller: 'accountController'}
    .state 'map', {templateUrl: 'map.html', controller: 'mapController'}
    .state 'map2', {templateUrl: 'map2.html', controller: 'mapController'}
    .state 'gps', {templateUrl: 'gps.html', controller: 'gpsController'}

peer2package.controller 'mainController', ($scope) ->

peer2package.controller 'menuController', ($scope, $http) ->
  $scope.authStatus = false
  $scope.submitReg = () ->
    console.log $scope.regForm.user
    $http.post('/register', $scope.regForm.user)
peer2package.controller 'mapController', ($scope, socket) ->
  $scope.map = null
  $scope.lat = null
  $scope.lng = null


peer2package.controller 'gpsController', ($scope, socket) ->

peer2package.controller 'accountController', ($scope) ->

peer2package.factory 'socket', ($rootScope) ->
  socket = io.connect()
  {
    on: (eventName, callback) ->
      socket.on eventName, ->
        args = arguments
        $rootScope.$apply ->
          callback.apply socket, args
          return
        return
      return
    emit: (eventName, data, callback) ->
      socket.emit eventName, data, ->
        args = arguments
        $rootScope.$apply ->
          if callback
            callback.apply socket, args
          return
        return
      return
  }

peer2package.directive 'menuChange', () ->
  return {
    restrict: 'AE',
    link: () ->
      menu = document.getElementById 'menu'
      sidenavmenu = document.getElementById 'side-nav-menu'
      arrow = document.getElementById 'arrow'
      btn_home = document.getElementById 'home'
      btn_account = document.getElementById 'account'
      btn_map = document.getElementById 'map'

      menu.addEventListener 'click', () ->
        menu.classList.toggle 'open'
        sidenavmenu.classList.toggle('nav-open')


      btn_account.addEventListener 'click', () ->
        arrow.classList.add 'account'
        arrow.classList.remove 'home'
        arrow.classList.remove 'map'
        btn_account.classList.add 'active'
        btn_home.classList.remove 'active'
        btn_map.classList.remove 'active'

      btn_home.addEventListener 'click', () ->
        arrow.classList.add 'home'
        arrow.classList.remove 'account'
        arrow.classList.remove 'map'
        btn_home.classList.add 'active'
        btn_account.classList.remove 'active'
        btn_map.classList.remove 'active'

      btn_map.addEventListener 'click', () ->
        arrow.classList.add 'map'
        arrow.classList.remove 'account'
        arrow.classList.remove 'home'
        btn_map.classList.add 'active'
        btn_home.classList.remove 'active'
        btn_account.classList.remove 'active'
  }
