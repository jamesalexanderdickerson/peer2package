peer2package = angular.module 'peer2package'
peer2package.factory 'userService', ($http, $localStorage) ->
  currentUser = {}
  return {
    login: (user) ->
      $postedUser = $http.post('/login', user)
      $postedUser.then((response) ->
        $localStorage.token = response.data.token
        currentUser = jwt_decode($localStorage.token)
      )
      return $postedUser

    register: (user) ->
      $postedUser = $http.post('/register', user)
      $postedUser.then((response) ->
        $localStorage.token = response.data.token
        currentUser = jwt_decode($localStorage.token)
      )
      return $postedUser

    delete: (user) ->
      $postedUser = $http.post('/delete', user)
      $postedUser.then((response) ->
        currentUser = ''
      )

    logout: () ->
      currentUser = ''
    isLoggedIn: () ->

    currentUser: () ->
      currentUser = jwt_decode($localStorage.token)
      return currentUser
  }
