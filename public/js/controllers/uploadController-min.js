(function(){var t;t=angular.module("peer2package"),t.controller("uploadController",["$scope","Upload","$timeout","userService","$state",function(t,o,a,e,n){return t.pictureOn=!1,e.getPhoto(),t.upload=function(e,r){o.upload({url:"/photoUpload",data:{file:o.dataUrltoBlob(e,r)}}).then(function(o){n.go("account"),a(function(){t.result=o.data})},function(o){o.status>0&&(t.pictureOn=!0,t.errorMsg=o.status+": "+o.data)},function(o){t.progress=parseInt(100*o.loaded/o.total)})}}])}).call(this);