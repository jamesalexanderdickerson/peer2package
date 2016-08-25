(function(){var e;e=angular.module("peer2package",["ui.router","ngStorage","ngGeolocation"]),e.config(function(e,t){return e.state("main",{templateUrl:"home.html",controller:"mainController"}).state("account",{templateUrl:"account.html",controller:"accountController"}).state("map",{templateUrl:"map.html",controller:"mapController"}).state("map2",{templateUrl:"map2.html",controller:"mapController"}).state("photoUpload",{templateUrl:"photo_upload.html",controller:"photoController"}).state("gps",{templateUrl:"gps.html",controller:"gpsController"})}),e.controller("mainController",function(e,t){if(t.token)return e.token=t.token}),e.factory("userService",function(e){var t;return t={},{login:function(n){var o;return o=e.post("/login",n),o.then(function(e){return t=e.data.user,console.log(t)}),o},register:function(n){var o;return o=e.post("/register",n),o.then(function(e){return t=e.data.user}),o},logout:function(){},isLoggedIn:function(){},currentUser:function(){return t}}}),e.controller("menuController",["$scope","$http","$localStorage","userService",function(e,t,n,o){var r,s,a,c,i,l;return e.message=null,c=document.getElementById("menu"),r=document.getElementById("arrow"),a=document.getElementById("logout"),s=document.getElementById("home"),i=document.getElementById("menubox"),l=document.getElementById("side-nav-menu"),e.loggedIn=function(){return i.classList.add("loggedIn")},e.submitReg=function(t){return o.register(t).then(function(t){if(s.classList.add("active"),r.classList.remove("logoout"),a.classList.remove("active"),e.token=t.data.token||null,e.messageReg=t.data.message,t.data.token)return n.token=t.data.token,e.loggedIn()})},e.submitLog=function(t){return o.login(t).then(function(t){if(s.classList.add("active"),r.classList.remove("logout"),a.classList.remove("active"),e.token=t.data.token||null,e.messageLog=t.data.message,t.data.token)return n.token=t.data.token,e.loggedIn()})},e.logout=function(){return e.regForm.user={},e.loginForm.user={},i.classList.remove("loggedIn"),n.$reset(),setTimeout(function(){return c.classList.toggle("open"),l.classList.toggle("nav-open")},500)}}]),e.controller("mapController",function(e,t){}),e.service("gpsService",["$rootScope","$geolocation",function(e,t){var n,o;return o=null,n=null,e.$on("$viewContentLoaded",function(){var r;return t.getCurrentPosition({timeout:6e4}).then(function(s){return e.myPosition=s,t.watchPosition({timeout:6e4,maximumAge:250,enableHighAccuracy:!0}),e.myPosition=t.position,e.$watch("myPosition.coords",function(t,s){return e.longitude=t.longitude,o=e.longitude,e.latitude=t.latitude,n=e.latitude,r.setCenter([e.longitude,e.latitude])}),e.loading=!1}),mapboxgl.accessToken="pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw",r=new mapboxgl.Map({container:"map",style:"mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf",zoom:19,pitch:45}),r.addControl(new mapboxgl.Directions),r.setCenter([o,n])})}]),e.controller("gpsController",["$scope","gpsService",function(e,t){}]),e.directive("loading",["$http",function(e){return{restrict:"A",link:function(t,n,o){return t.loading=!0,t.isLoading=function(){return e.pendingRequests.length>0},t.$watch(t.isLoading,function(e){return e?n.removeClass("hidden"):(n.addClass("hidden"),t.loading=!1)})}}}]),e.controller("accountController",["$scope","userService",function(e,t){return e.currentUser=t.currentUser(),e.name=e.currentUser.fname+" "+e.currentUser.lname,e.deleteAccount=function(){}}]),e.controller("photoController",function(e){}),e.factory("socket",function(e){var t;return t=io.connect(),{on:function(n,o){t.on(n,function(){var n;n=arguments,e.$apply(function(){o.apply(t,n)})})},emit:function(n,o,r){t.emit(n,o,function(){var n;n=arguments,e.$apply(function(){r&&r.apply(t,n)})})}}}),e.directive("menuChange",function(){return{restrict:"AE",link:function(){var e,t,n,o,r,s,a;return s=document.getElementById("menu"),a=document.getElementById("side-nav-menu"),e=document.getElementById("arrow"),n=document.getElementById("home"),t=document.getElementById("account"),r=document.getElementById("gps"),o=document.getElementById("logout"),s.addEventListener("click",function(){return s.classList.toggle("open"),a.classList.toggle("nav-open")}),t.addEventListener("click",function(){return e.classList.add("account"),e.classList.remove("home"),e.classList.remove("map"),e.classList.remove("logout"),t.classList.add("active"),n.classList.remove("active"),r.classList.remove("active"),o.classList.remove("active"),setTimeout(function(){return s.classList.toggle("open"),a.classList.toggle("nav-open")},500)}),n.addEventListener("click",function(){return e.classList.add("home"),e.classList.remove("account"),e.classList.remove("map"),e.classList.remove("logout"),n.classList.add("active"),t.classList.remove("active"),r.classList.remove("active"),o.classList.remove("active"),setTimeout(function(){return s.classList.toggle("open"),a.classList.toggle("nav-open")},500)}),r.addEventListener("click",function(){return e.classList.add("map"),e.classList.remove("account"),e.classList.remove("home"),e.classList.remove("logout"),r.classList.add("active"),n.classList.remove("active"),t.classList.remove("active"),o.classList.remove("active"),setTimeout(function(){return s.classList.toggle("open"),a.classList.toggle("nav-open")},500)}),o.addEventListener("click",function(){return e.classList.add("logout"),e.classList.remove("map"),e.classList.remove("account"),e.classList.remove("home"),o.classList.add("active"),r.classList.remove("active"),n.classList.remove("active"),t.classList.remove("active")})}}})}).call(this);