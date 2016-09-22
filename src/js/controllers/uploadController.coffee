peer2package = angular.module 'peer2package'
peer2package.controller 'uploadController', ['$scope', 'Upload', '$timeout', 'userService', '$state', ($scope, Upload, $timeout, userService, $state) ->
  userService.getPhoto()
  $scope.upload = (dataUrl, name) ->
    Upload.upload(
      url: '/photoUpload'
      data: file: Upload.dataUrltoBlob(dataUrl, name)).then ((response) ->
      $state.go 'account'
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
]
