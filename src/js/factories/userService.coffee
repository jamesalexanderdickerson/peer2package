peer2package = angular.module 'peer2package'
peer2package.factory 'userService', ($http) ->
  currentUser = {}
  return {
    login: (user) ->
      $postedUser = $http.post('/login', user)
      $postedUser.then((response) ->
        currentUser = response.data.user
      )
      return $postedUser

    register: (user) ->
      $postedUser = $http.post('/register', user)
      $postedUser.then((response) ->
        currentUser = response.data.user
      )
      return $postedUser

    delete: (user) ->
      $postedUser = $http.post('/delete', user)
      $postedUser.then((response) ->
        currentUser = ''
      )

    isLoggedIn: () ->

    currentUser: () ->
      return currentUser
  }
