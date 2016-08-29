(function() {
  var peer2package;

  peer2package = angular.module('peer2package', ['ui.router', 'ngStorage', 'ngGeolocation']);

  peer2package.config(function($stateProvider, $urlRouterProvider) {
    return $stateProvider.state('main', {
      templateUrl: 'home.html',
      controller: 'mainController'
    }).state('account', {
      templateUrl: 'account.html',
      controller: 'accountController'
    }).state('map', {
      templateUrl: 'map.html',
      controller: 'mapController'
    }).state('map2', {
      templateUrl: 'map2.html',
      controller: 'mapController'
    }).state('photoUpload', {
      templateUrl: 'photo_upload.html',
      controller: 'photoController'
    }).state('gps', {
      templateUrl: 'gps.html',
      controller: 'gpsController'
    });
  });

  peer2package.controller('mainController', function($scope, $localStorage) {
    if ($localStorage.token) {
      return $scope.token = $localStorage.token;
    }
  });

  peer2package.factory('userService', function($http) {
    var currentUser;
    currentUser = {};
    return {
      login: function(user) {
        var $postedUser;
        $postedUser = $http.post('/login', user);
        $postedUser.then(function(response) {
          currentUser = response.data.user;
          return console.log(currentUser);
        });
        return $postedUser;
      },
      register: function(user) {
        var $postedUser;
        $postedUser = $http.post('/register', user);
        $postedUser.then(function(response) {
          return currentUser = response.data.user;
        });
        return $postedUser;
      },
      "delete": function(user) {
        var $postedUser;
        $postedUser = $http.post('/delete', user);
        return $postedUser.then(function(response) {
          return currentUser = '';
        });
      },
      logout: function() {},
      isLoggedIn: function() {},
      currentUser: function() {
        return currentUser;
      }
    };
  });

  peer2package.controller('menuController', [
    '$scope', '$http', '$localStorage', 'userService', function($scope, $http, $localStorage, userService) {
      var arrow, btn_home, btn_logout, menu, menubox, sidenavmenu;
      $scope.message = null;
      menu = document.getElementById('menu');
      arrow = document.getElementById('arrow');
      btn_logout = document.getElementById('logout');
      btn_home = document.getElementById('home');
      menubox = document.getElementById('menubox');
      sidenavmenu = document.getElementById('side-nav-menu');
      $scope.loggedIn = function() {
        return menubox.classList.add('loggedIn');
      };
      $scope.submitReg = function(user) {
        return userService.register(user).then(function(response) {
          btn_home.classList.add('active');
          arrow.classList.remove('logoout');
          btn_logout.classList.remove('active');
          $scope.token = response.data.token || null;
          $scope.messageReg = response.data.message;
          if (response.data.token) {
            $localStorage.token = response.data.token;
            return $scope.loggedIn();
          }
        });
      };
      $scope.submitLog = function(user) {
        return userService.login(user).then(function(response) {
          btn_home.classList.add('active');
          arrow.classList.remove('logout');
          btn_logout.classList.remove('active');
          $scope.token = response.data.token || null;
          $scope.messageLog = response.data.message;
          if (response.data.token) {
            $localStorage.token = response.data.token;
            return $scope.loggedIn();
          }
        });
      };
      return $scope.logout = function() {
        $scope.regForm.user = {};
        $scope.loginForm.user = {};
        menubox.classList.remove('loggedIn');
        $localStorage.$reset();
        return setTimeout(function() {
          menu.classList.toggle('open');
          return sidenavmenu.classList.toggle('nav-open');
        }, 500);
      };
    }
  ]);

  peer2package.service('mapService', [
    '$rootScope', '$geolocation', 'socket', '$interval', function($rootScope, $geolocation, socket, $interval) {
      var latitude, longitude;
      $rootScope.loading = true;
      longitude = null;
      latitude = null;
      return $rootScope.$on('$viewContentLoaded', function() {
        var moveCenter;
        $geolocation.getCurrentPosition({
          timeout: 60000
        }).then(function(position) {
          var map, source, url;
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;
          $rootScope.myPosition = position;
          $interval((function() {
            $geolocation.getCurrentPosition({
              timeout: 60000
            }).then(function(position) {
              $rootScope.myPosition = position;
              longitude = position.coords.longitude;
              latitude = position.coords.latitude;
            });
          }), 1000);
          $rootScope.$watch('myPosition.coords', function(newValue, oldValue) {
            var url, yourPosition;
            longitude = newValue.longitude;
            latitude = newValue.latitude;
            url = 'http://localhost:8000/user_location';
            yourPosition = longitude + ', ' + latitude;
            source.setData(url);
            return socket.emit('LngLat', yourPosition);
          });
          mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw';
          map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
            zoom: 19
          });
          url = 'http://localhost:8000/user_location';
          source = new mapboxgl.GeoJSONSource({
            data: url
          });
          return map.on('load', function() {
            $rootScope.loading = false;
            map.addSource('You', source);
            map.addLayer({
              "id": "You",
              "type": "circle",
              "source": "You",
              "paint": {
                "circle-radius": 20,
                "circle-color": "#E65D5D"
              }
            });
            map.setCenter([longitude, latitude]);
            console.log(longitude + ',' + latitude);
            return map.on('click', function(e) {
              var feature, features, popup;
              features = map.queryRenderedFeatures(e.point, {
                layers: ['You']
              });
              if (!features.length) {
                return;
              }
              feature = features[0];
              return popup = new mapboxgl.Popup({
                closeButton: false
              }).setLngLat([longitude, latitude]).setHTML(feature.properties.description).addTo(map);
            });
          });
        });
        return moveCenter = function() {
          return map.flyTo({
            center: [longitude, latitude]
          });
        };
      });
    }
  ]);

  peer2package.controller('mapController', [
    '$scope', 'mapService', 'socket', function($scope, mapService, socket) {
      $scope.moveToPosition = function() {
        return mapService.moveCenter();
      };
      $scope.chat_open = false;
      $scope.open_chat = function() {
        return $scope.chat_open = true;
      };
      $scope.close_chat = function() {
        return $scope.chat_open = false;
      };
      return $scope.submitChat = function() {
        $scope.user.sent = $scope.user.message;
        return $scope.user.message = '';
      };
    }
  ]);

  peer2package.service('gpsService', [
    '$rootScope', '$geolocation', function($rootScope, $geolocation) {
      var latitude, longitude;
      longitude = null;
      latitude = null;
      return $rootScope.$on('$viewContentLoaded', function() {
        var map;
        $geolocation.getCurrentPosition({
          timeout: 60000
        }).then(function(position) {
          $rootScope.myPosition = position;
          $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
          });
          $rootScope.myPosition = $geolocation.position;
          $rootScope.$watch('myPosition.coords', function(newValue, oldValue) {
            $rootScope.longitude = newValue.longitude;
            longitude = $rootScope.longitude;
            $rootScope.latitude = newValue.latitude;
            latitude = $rootScope.latitude;
            return map.setCenter([$rootScope.longitude, $rootScope.latitude]);
          });
          return $rootScope.loading = false;
        });
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNhZGlja2Vyc29uIiwiYSI6ImNpbmNidGJqMzBwYzZ2OGtxbXljY3FrNGwifQ.5pIvQjtuO31x4OZm84xycw';
        map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/jamesadickerson/ciq1h3u9r0009b1lx99e6eujf',
          zoom: 19,
          pitch: 45
        });
        map.addControl(new mapboxgl.Directions());
        return map.setCenter([longitude, latitude]);
      });
    }
  ]);

  peer2package.controller('gpsController', ['$scope', 'gpsService', function($scope, gpsService) {}]);

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

  peer2package.controller('accountController', [
    '$scope', 'userService', '$location', function($scope, userService, $location) {
      $scope.currentUser = userService.currentUser();
      $scope.name = $scope.currentUser.fname + ' ' + $scope.currentUser.lname;
      $scope.balance = 0.00;
      return $scope.deleteAccount = function(user) {
        return userService["delete"](user).then(function(response) {
          $localStorage.$reset();
          return $location.path('/');
        });
      };
    }
  ]);

  peer2package.controller('photoController', function($scope) {});

  peer2package.factory('socket', function($rootScope) {
    var socket;
    socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args;
          args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args;
          args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });

  peer2package.directive('menuChange', function() {
    return {
      restrict: 'AE',
      link: function() {
        var arrow, btn_account, btn_home, btn_logout, btn_map, menu, sidenavmenu;
        menu = document.getElementById('menu');
        sidenavmenu = document.getElementById('side-nav-menu');
        arrow = document.getElementById('arrow');
        btn_home = document.getElementById('home');
        btn_account = document.getElementById('account');
        btn_map = document.getElementById('gps');
        btn_logout = document.getElementById('logout');
        menu.addEventListener('click', function() {
          menu.classList.toggle('open');
          return sidenavmenu.classList.toggle('nav-open');
        });
        btn_account.addEventListener('click', function() {
          arrow.classList.add('account');
          arrow.classList.remove('home');
          arrow.classList.remove('map');
          arrow.classList.remove('logout');
          btn_account.classList.add('active');
          btn_home.classList.remove('active');
          btn_map.classList.remove('active');
          btn_logout.classList.remove('active');
          return setTimeout(function() {
            menu.classList.toggle('open');
            return sidenavmenu.classList.toggle('nav-open');
          }, 500);
        });
        btn_home.addEventListener('click', function() {
          arrow.classList.add('home');
          arrow.classList.remove('account');
          arrow.classList.remove('map');
          arrow.classList.remove('logout');
          btn_home.classList.add('active');
          btn_account.classList.remove('active');
          btn_map.classList.remove('active');
          btn_logout.classList.remove('active');
          return setTimeout(function() {
            menu.classList.toggle('open');
            return sidenavmenu.classList.toggle('nav-open');
          }, 500);
        });
        btn_map.addEventListener('click', function() {
          arrow.classList.add('map');
          arrow.classList.remove('account');
          arrow.classList.remove('home');
          arrow.classList.remove('logout');
          btn_map.classList.add('active');
          btn_home.classList.remove('active');
          btn_account.classList.remove('active');
          btn_logout.classList.remove('active');
          return setTimeout(function() {
            menu.classList.toggle('open');
            return sidenavmenu.classList.toggle('nav-open');
          }, 500);
        });
        return btn_logout.addEventListener('click', function() {
          arrow.classList.add('logout');
          arrow.classList.remove('map');
          arrow.classList.remove('account');
          arrow.classList.remove('home');
          btn_logout.classList.add('active');
          btn_map.classList.remove('active');
          btn_home.classList.remove('active');
          return btn_account.classList.remove('active');
        });
      }
    };
  });

}).call(this);
