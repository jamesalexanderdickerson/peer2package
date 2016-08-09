(function() {
  var peer2package;

  peer2package = angular.module('peer2package', ['ui.router']);

  peer2package.config(function($stateProvider, $urlRouterProvider) {
    return $stateProvider.state('main', {
      templateUrl: 'home.html',
      controller: 'mainController'
    }).state('about', {
      templateUrl: 'about.html',
      controller: 'aboutController'
    });
  });

  peer2package.controller('mainController', function($scope) {});

  peer2package.controller('menuController', function($scope) {
    return $scope.authStatus = false;
  });

  peer2package.controller('mapController', function($scope) {});

  peer2package.controller('aboutController', function($scope) {});

  peer2package.directive('menuChange', function() {
    return {
      restrict: 'AE',
      link: function() {
        var arrow, btn_about, btn_home, menu, sidenavmenu;
        menu = document.getElementById('menu');
        sidenavmenu = document.getElementById('side-nav-menu');
        arrow = document.getElementById('arrow');
        btn_home = document.getElementById('home');
        btn_about = document.getElementById('about');
        menu.addEventListener('click', function() {
          menu.classList.toggle('open');
          return sidenavmenu.classList.toggle('nav-open');
        });
        btn_about.addEventListener('click', function() {
          arrow.classList.add('about');
          arrow.classList.remove('home');
          btn_about.classList.add('active');
          return btn_home.classList.remove('active');
        });
        return btn_home.addEventListener('click', function() {
          arrow.classList.add('home');
          arrow.classList.remove('about');
          btn_home.classList.add('active');
          return btn_about.classList.remove('active');
        });
      }
    };
  });

}).call(this);
