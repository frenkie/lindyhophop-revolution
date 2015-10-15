app.config(function($stateProvider) {

    $stateProvider.state('results', {
        url: '/results',
        templateUrl: 'js/results/results.html',
        controller: 'ResultsCtrl',
        params: {
            songId: null
        },
        resolve: {
            player: function(ScoreFactory) {
                return ScoreFactory.getPlayer(1);
            },
            percent: function(ScoreFactory) {
                return ScoreFactory.getPercent(1);
            },
            score: function(ScoreFactory) {
                return ScoreFactory.finalScore(1);
            },
            highScores: function(ScoreFactory, $stateParams) {
                return ScoreFactory.getHighScores($stateParams.songId);
            }
        }
    });

});

app.controller('ResultsCtrl', function($scope, player, percent, score, ScoreFactory, $state, ToneFactory, keyConfigFactory, highScores) {
    console.log('the song id', $stateParams.songId)
    $scope.player1 = player;
    $scope.percent = percent;
    $scope.score = parseInt(score);
    console.log('The high scores!!!!!', highScores);

    function play(fx) {
      ToneFactory.play(fx);
    };

    function leaveResults(event) {
        var button = keyConfigFactory.getButton(event);
        if (!button) return;
        if (button.name === "escape") {
            play('back');
            window.removeEventListener('keydown', leaveResults);
            window.removeEventListener('gamepadbuttondown', leaveResults);
            ScoreFactory.resetPlayers();
            $state.go('mainMenu');
        }
        else if (button.name === "enter") {
            play('start');
            window.removeEventListener('keydown', leaveResults);
            window.removeEventListener('gamepadbuttondown', leaveResults);
            ScoreFactory.resetPlayers();
            $state.go('chooseSong');
        }
    }

    window.addEventListener('keydown', leaveResults);
    window.addEventListener('gamepadbuttondown', leaveResults);

});
