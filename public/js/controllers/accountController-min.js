(function(){var e;e=angular.module("peer2package"),e.controller("accountController",["$scope","userService","$location",function(e,r,n,t){return e.killMap=function(){return e.mapOff(e.myInterval)},e.killMap(),e.currentUser=r.currentUser(),e.name=e.currentUser.fname+" "+e.currentUser.lname,e.balance=0,e.deleteAccount=function(e){return r.delete(e).then(function(e){return $localStorage.$reset(),n.path("/")})}}])}).call(this);