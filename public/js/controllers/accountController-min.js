(function(){var e;e=angular.module("peer2package"),e.controller("accountController",["$scope","userService","$location","$localStorage",function(e,r,t,n,o,l){var a;return e.photo="./img/profile.gif",a=function(){var r,t;return r=localStorage.getItem("ngStorage-photo"),t=r.replace(/public/g,""),e.photo=t.replace(/"/g,""),console.log(e.photo)},null!==localStorage.getItem("ngStorage-photo")&&a(),e.killMap=function(){return e.mapOff(e.myInterval)},e.killMap(),e.currentUser=r.currentUser(),e.name=e.currentUser.fname+" "+e.currentUser.lname,e.balance=0,e.deleteAccount=function(e){return r.delete(e).then(function(e){return l.$reset(),t.state("main")})}}])}).call(this);