app.config(function($stateProvider) {

    $stateProvider.state('mainMenu', {
        url: '/mainMenu',
        templateUrl: 'js/mainMenu/mainMenu.html',
        controller: 'MainMenuCtrl'
    });

});

app.controller('MainMenuCtrl', function($scope, $state, ToneFactory) {
    console.log("Controller is loaded");
    $('.activeChoice').removeClass("activeChoice");
    $('#option1').addClass("activeChoice");

    function play(fx) {
      ToneFactory.play(fx);
    };

    var menuLength = $('.menuXParent').children().length;
    var $document = $(document);
    $document.on('keydown', onArrowKey)

    function onArrowKey(event) {
        var active = $('.activeChoice');
        var activeNumber = parseInt(active[0].id.slice(-1));

        if (event.which === 40) {
            play('blop');
            activeNumber = activeNumber === menuLength ? 1 : activeNumber + 1;
            active.removeClass("activeChoice");
            $('#option' + activeNumber).addClass("activeChoice");
        } else if (event.which === 38) {
            play('blop');
            activeNumber = activeNumber === 1 ? menuLength : activeNumber - 1;
            active.removeClass("activeChoice");
            $('#option' + activeNumber).addClass("activeChoice");
        } else if (event.keyCode === 13) {
            play('start');
            var uiState = active[0].outerHTML.split('"');
            console.log(uiState);
            
            var arr2 = /(\w+)(?:\(\{\w+\:\s)?(\d)?/.exec(uiState[5]);
            console.log('arr2:',arr2);
            var state = arr2[1], playerNum = arr2[2] ? parseInt(arr2[2], 10) : 1;

            $document.off('keydown', onArrowKey);

            $state.go(state, {players: playerNum});
        } else if (event.keyCode === 27) {
            play('back');
            $document.off('keydown', onArrowKey);
            $state.go('home');
        };
    };
});
