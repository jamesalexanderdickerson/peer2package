peer2package = angular.module 'peer2package'
peer2package.controller 'menuController', ['$scope', '$http', '$localStorage', 'userService', 'socket', ($scope, $http, $localStorage, userService, socket, mapService) ->
  $scope.message = null
  menu = document.getElementById 'menu'
  arrow = document.getElementById 'arrow'
  btn_logout = document.getElementById 'logout'
  btn_home = document.getElementById 'home'
  menubox = document.getElementById 'menubox'
  sidenavmenu = document.getElementById 'side-nav-menu'

  $scope.loggedIn = () ->
    menubox.classList.add 'loggedIn'
    userService.currentUser()

  if ($localStorage.token)
    $scope.loggedIn()

  $scope.submitReg = (user) ->
    userService.register(user).then((response) ->
      console.log user
      btn_home.classList.add 'active'
      arrow.classList.remove 'logout'
      btn_logout.classList.remove 'active'
      $scope.messageReg = response.data.message
      if (response.data)
        $scope.token = response.data.token || null
        $localStorage.token = response.data.token || null
        $scope.loggedIn()
      )
  $scope.submitLog = (user) ->
    userService.login(user).then((response) ->
      btn_home.classList.add 'active'
      arrow.classList.remove 'logout'
      btn_logout.classList.remove 'active'
      $scope.messageLog = response.data.message
      if (response.data)
        $scope.token = response.data.token || null
        $localStorage.token = response.data.token || null
        $scope.loggedIn()
      )

  $scope.logout = () ->
    $scope.token = ''
    userService.logout()
    $scope.mapOff($scope.myInterval)
    $scope.regForm.user = {}
    $scope.loginForm.user = {}
    menubox.classList.remove 'loggedIn'
    $localStorage.$reset()
    setTimeout ->
      menu.classList.toggle 'open'
      sidenavmenu.classList.toggle 'nav-open'
    , 500
]
