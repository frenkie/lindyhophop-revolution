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
      'left-0': {
        el: $('.arrow-keys .left-0 img')[0],
        dir: "left",
        start: "0",
        end: "-20px"
      },
      'right-0': {
        el: $('.arrow-keys .right-0 img')[0],
        dir: "left",
        start: "0",
        end: "20px"
      },
      'down-0': {
        el: $('.arrow-keys .down-0 img')[0],
        dir: "top",
        start: "0",
        end: "20px"
      },
      'up-0': {
        el: $('.arrow-keys .up-0 img')[0],
        dir: "top",
        start: "0",
        end: "-20px"
      },
    'left-1': {
      el: $('.arrow-keys .left-1 img')[0],
      dir: "left",
      start: "0",
      end: "-20px"
    },
    'right-1': {
      el: $('.arrow-keys .right-1 img')[0],
      dir: "left",
      start: "0",
      end: "20px"
    },
    'down-1': {
      el: $('.arrow-keys .down-1 img')[0],
      dir: "top",
      start: "0",
      end: "20px"
    },
    'up-1': {
      el: $('.arrow-keys .up-1 img')[0],
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

    var a = arrows[button.name+'-'+button.player];
    if (!a) return;

    a.el.style[a.dir] = a.end;
    a.el.style['-webkit-filter'] = "grayscale(1) brightness(200%)";
  }
  function replaceArrows (e) {
    var button = keyConfigFactory.getButton(e);
    if (!button) return;

    var a = arrows[button.name+'-'+button.player];
    if (!a) return;

    a.el.style[a.dir] = a.start;
    a.el.style['-webkit-filter'] = "";
  }

  function onArrowKey(event) {
    var button = keyConfigFactory.getButton(event);
    if (!button) return;

    if (button.name === 'enter') {
      SexyBackFactory.pause();
      play('start');
      $document.off('keydown', onArrowKey);
      window.removeEventListener('gamepadbuttondown', onArrowKey);
      $document.off('keydown', moveArrows);
      window.removeEventListener('gamepadbuttondown', moveArrows);
      $document.off('keydown', replaceArrows);
      window.removeEventListener('gamepadbuttondown', replaceArrows);
      $state.go('mainMenu');
  	};
  };

  function logout() {
      AuthService.logout().then(function () {
        setUser();
      });
  };

});
