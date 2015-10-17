app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function ($rootScope, $scope, $state, AuthService, AUTH_EVENTS, ToneFactory, keyConfigFactory, SexyBackFactory) {

  $scope.user = null;

  $('.homeMenu').click( function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
  });

  var setUser = function () {
      AuthService.getLoggedInUser().then(function (user) {
          $scope.user = user;
      });
  };

  var removeUser = function () {
      $scope.user = null;
  };

  setUser();

  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);

  (function landingPageAnimation() {
    SexyBackFactory.init();
  })();

  function play(fx) {
    ToneFactory.play(fx);
  };

  var $document = $(document);
  $document.on('keydown', onArrowKey);
  window.addEventListener('gamepadbuttondown', onArrowKey);
  $document.on('keydown', moveArrows);
  window.addEventListener('gamepadbuttondown', moveArrows);
  $document.on('keyup', replaceArrows);
  window.addEventListener('gamepadbuttonup', replaceArrows);


  var arrows = {
    left: {
      el: $('.arrow-keys .left img')[0],
      dir: "left",
      start: "0",
      end: "-20px"
    },
    right: {
      el: $('.arrow-keys .right img')[0],
      dir: "left",
      start: "0",
      end: "20px"
    },
    down: {
      el: $('.arrow-keys .down img')[0],
      dir: "top",
      start: "0",
      end: "20px"
    },
    up: {
      el: $('.arrow-keys .up img')[0],
      dir: "top",
      start: "0",
      end: "-20px"
    },
    enter: {
      el: $('#home .enter img')[0],
      dir: "top",
      start: "0",
      end: "20px"
    },
  };

  function moveArrows (e) {
    var button = keyConfigFactory.getButton(e);
    if (!button) return;

    var a = arrows[button.name];
    if (!a) return;

    a.el.style[a.dir] = a.end;
    a.el.style['-webkit-filter'] = "grayscale(1) brightness(200%)";
  }
  function replaceArrows (e) {
    var button = keyConfigFactory.getButton(e);
    if (!button) return;

    var a = arrows[button.name];
    if (!a) return;

    a.el.style[a.dir] = a.start;
    a.el.style['-webkit-filter'] = "";
  }

  function onArrowKey(event) {
    var button = keyConfigFactory.getButton(event);
    if (!button) return;

    if (button.name === 'enter') {
      play('start');
      $state.go('mainMenu');
      $document.off('keydown', onArrowKey);
      window.removeEventListener('gamepadbuttondown', onArrowKey);
      $document.off('keydown', moveArrows);
      window.removeEventListener('gamepadbuttondown', moveArrows);
      $document.off('keydown', replaceArrows);
      window.removeEventListener('gamepadbuttondown', replaceArrows);
      // ToneFactory.sandstormAudio.pause();
  	};
  };

  function logout() {
      AuthService.logout().then(function () {
        setUser();
      });
  };

});
