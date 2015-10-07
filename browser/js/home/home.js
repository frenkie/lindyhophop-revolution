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

});
