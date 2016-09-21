(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

  peer2package.controller('uploadController', [
    '$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
      $scope.upload = function(dataUrl, name) {
        Upload.upload({
          url: '/public/img/uploads',
          data: {
            file: Upload.dataUrltoBlob(dataUrl, name)
          }
        }).then((function(response) {
          $timeout(function() {
            $scope.result = response.data;
          });
        }), (function(response) {
          if (response.status > 0) {
            $scope.errorMsg = response.status + ': ' + response.data;
          }
        }), function(evt) {
          $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
      };
    }
  ]);

}).call(this);
