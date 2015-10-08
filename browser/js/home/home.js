app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function($rootScope, $scope, AuthService, AUTH_EVENTS) {
  $scope.user = null;

  var setUser = function () {
      AuthService.getLoggedInUser().then(function (user) {
        console.log("SetUser: ", user)
          $scope.user = user;
      });
  };

  var removeUser = function () {
      $scope.user = null;
  };

  setUser();

  $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);

  window.addEventListener('keydown', onArrowKey);

  function play() {
    var audio = document.getElementById("blop");
    audio.play();
  };

  function onArrowKey(event) {
      var active = $('.activeHome');
      var activeNumber = parseInt(active[0].id.slice(-1));

    if(event.which === 39) { //right
      play();
      activeNumber = activeNumber === 5? 1 : activeNumber + 1;
      active.removeClass("activeHome");
      $('#option' + activeNumber).addClass("activeHome");
    } else if(event.which === 37) { //left
      play();
      activeNumber = activeNumber === 1? 5 : activeNumber - 1;
      active.removeClass("activeHome");
      $('#option' + activeNumber).addClass("activeHome");
    } else if(event.keyCode === 13) {
      var uiState = active[0].outerHTML.split('"');
      window.removeEventListener('keydown', onArrowKey);
      $state.go(uiState[5]);
    } else if(event.keyCode === 27) {
      window.removeEventListener('keydown', onArrowKey);
      $state.go('home');
    };
  };

});
