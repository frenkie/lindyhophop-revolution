app.config(function($stateProvider) {

    $stateProvider.state('results', {
        url: '/results',
        templateUrl: 'js/results/results.html',
        controller: 'ResultsCtrl',
        resolve: {
            player: function(ScoreFactory) {
                return ScoreFactory.getPlayer(1);
            },
            percent: function(ScoreFactory) {
                return ScoreFactory.getPercent(1);
            },
            score: function(ScoreFactory) {
                return ScoreFactory.finalScore(1);
            }
        }
    });

});

app.controller('ResultsCtrl', function($scope, player, percent, score, ScoreFactory, $state, ToneFactory) {
    $scope.player1 = player;
    $scope.percent = percent;
    $scope.score = parseInt(score);

    function play(fx) {
      ToneFactory.play(fx);
    };

    window.addEventListener('keydown', leaveResults);

    function leaveResults(event) {
        if (event.keyCode === 27) {
            play('back');
            window.removeEventListener('keydown', leaveResults);
            ScoreFactory.resetPlayers();
            $state.go('mainMenu');
        }
        else if (event.keyCode === 13) {
            play('start');
            window.removeEventListener('keydown', leaveResults);
            ScoreFactory.resetPlayers();
            $state.go('chooseSong');
        }
    }
});