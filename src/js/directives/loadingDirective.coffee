peer2package = angular.module 'peer2package'
peer2package.directive 'loading', ['$http', '$rootScope', ($http, $rootScope) ->
  return {
    restrict: 'A',
    link: (scope, element, attributes) ->
      scope.isLoading = () ->
        return $http.pendingRequests.length > 0
      scope.$watch(scope.isLoading, (value) ->
        if (value)
          element.removeClass('hidden')
        else
          element.addClass('hidden')
      )
  }
]
