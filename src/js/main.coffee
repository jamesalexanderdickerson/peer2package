peer2package = angular.module 'peer2package', ['ui.router']

peer2package.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
    .state 'main', {templateUrl: 'home.html', controller: 'mainController'}
    .state 'about', {templateUrl: 'about.html', controller: 'aboutController'}

peer2package.controller 'mainController', ($scope) ->

peer2package.controller 'menuController', ($scope) ->
  $scope.authStatus = false

peer2package.controller 'mapController', ($scope) ->

peer2package.controller 'aboutController', ($scope) ->

peer2package.directive 'menuChange', () ->
  return {
    restrict: 'AE',
    link: () ->
      menu = document.getElementById 'menu'
      sidenavmenu = document.getElementById 'side-nav-menu'
      arrow = document.getElementById 'arrow'
      btn_home = document.getElementById 'home'
      btn_about = document.getElementById 'about'

      menu.addEventListener 'click', () ->
        menu.classList.toggle 'open'
        sidenavmenu.classList.toggle('nav-open')

      btn_about.addEventListener 'click', () ->
        arrow.classList.add 'about'
        arrow.classList.remove 'home'
        btn_about.classList.add 'active'
        btn_home.classList.remove 'active'

      btn_home.addEventListener 'click', () ->
        arrow.classList.add 'home'
        arrow.classList.remove 'about'
        btn_home.classList.add 'active'
        btn_about.classList.remove 'active'
  }
