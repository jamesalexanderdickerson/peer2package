peer2package = angular.module 'peer2package'
peer2package.controller 'uploadController', ['$scope', 'Upload', '$timeout', ($scope, Upload, $timeout) ->
  $scope.upload = (dataUrl, name) ->
      Upload.upload(
        url: '/public/img/uploads'
        data: file: Upload.dataUrltoBlob(dataUrl, name)).then ((response) ->
        $timeout ->
          $scope.result = response.data
          return
        return
      ), ((response) ->
        if response.status > 0
          $scope.errorMsg = response.status + ': ' + response.data
        return
      ), (evt) ->
        $scope.progress = parseInt(100.0 * evt.loaded / evt.total)
        return
      return

    return
]
