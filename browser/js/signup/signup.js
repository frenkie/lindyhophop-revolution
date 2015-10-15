app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, AuthService, $state) {

    $scope.signup = {};
    $scope.error = null;

    $scope.sendSigup = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

    function onArrowKey(event) {
        var button = keyConfigFactory(event);
        if (button.name === 'escape') {
            $(document).off('keydown');
            $(document).off('gamepadbuttondown');
            $state.go('home');
        };
    };

    $(document).on('keydown', onArrowKey);
    $(document).on('gamepadbuttondown', onArrowKey);
});
