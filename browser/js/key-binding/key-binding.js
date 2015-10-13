app.config(function ($stateProvider) {
    $stateProvider.state('key-binding', {
        url: '/key-binding',
        templateUrl: 'js/key-binding/key-binding.html',
        controller: 'keyBindingCtrl'
    });
});

app.controller('keyBindingCtrl', function ($scope, $on) {
    $scope.keys = {};

    $on('keydown', function (e) {
        console.log('pressing key', e);
    });

})
