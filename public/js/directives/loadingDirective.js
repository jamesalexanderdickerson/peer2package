(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.directive('loading', [
    '$http', '$rootScope', function($http, $rootScope) {
      return {
        restrict: 'A',
        link: function(scope, element, attributes) {
          scope.isLoading = function() {
            return $http.pendingRequests.length > 0;
          };
          return scope.$watch(scope.isLoading, function(value) {
            if (value) {
              return element.removeClass('hidden');
            } else {
              return element.addClass('hidden');
            }
          });
        }
      };
    }
  ]);

}).call(this);
