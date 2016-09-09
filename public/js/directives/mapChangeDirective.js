(function() {
  var peer2package;

  peer2package = angular.module('peer2package');

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