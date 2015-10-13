app.config(function ($stateProvider) {
    $stateProvider.state('key-binding', {
        url: '/key-binding',
        templateUrl: 'js/key-binding/key-binding.html',
        controller: 'keyBindingCtrl'
    });
});

app.controller('keyBindingCtrl', function ($scope, keyIdentity) {

    var keyCodeToDir = {
        '37': 'left',
        '40': 'down',
        '38': 'up',
        '39': 'right',
        '27': 'escape',
        '13': 'enter'
    };

    $scope.keys = {
        left: {},
        down: {},
        up: {},
        right: {},
        back: {},
        enter: {},
        escape: {}
    };

    $scope.pointer = 0;

    var keyKeys = Object.keys($scope.keys);

    $scope.currKey = keyKeys[$scope.pointer];

    var detectKey = function (e) {
        if ($scope.pointer >= keyKeys.length) {
            document.removeEventListener('keydown', detectKey);
            return;
        }
        // e.preventDefault();
        console.log('pressing key', e);
        $scope.keys[$scope.currKey].keyCode = e.keyCode;
        $scope.keys[$scope.currKey].name = keyIdentity(e.keyCode);
        $scope.pointer++;
        $scope.currKey = keyKeys[$scope.pointer];
        $scope.$digest();
    }

    var detectPad = function (e) {
        if ($scope.pointer >= keyKeys.length) {
            document.removeEventListener('keydown', detectPad);
            return;
        }
        window.e = e;
        e.preventDefault();
        console.log('pressing pad', e);
        $scope.keys[$scope.currKey].padCode = e.button;
        $scope.keys[$scope.currKey].padIndex = e.gamepad.index;
        $scope.keys[$scope.currKey].button = _.findKey(e.gamepad.indices, function (button) {
            return button === e.button;
        });
        $scope.keys[$scope.currKey].name = `${$scope.keys[$scope.currKey].button}, Gamepad ${e.gamepad.index}.`
        $scope.pointer++;
        $scope.currKey = keyKeys[$scope.pointer];
        $scope.$digest();
    }
    window.addEventListener('keydown', detectKey);

    window.addEventListener('gamepadbuttondown', detectPad);


    $scope.restart = function () {
        $scope.pointer = 0;
        $scope.currKey = keyKeys[$scope.pointer];
        document.addEventListener('keydown', detectKey);
    }





});
