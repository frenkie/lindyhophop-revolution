app.config(function ($stateProvider) {

    $stateProvider.state('highScores', {
        url: '/highScores',
        templateUrl: 'js/highScores/highScores.html',
        controller: 'HighScoresCtrl',
        resolve: {
          highScores: function() {
            // return with a promise that will resolve with the highScores;
          }
        }
    });

});

app.controller('HighScoresCtrl', function ($scope, $state, highScores) {
  $scope.highScores = highScores;
  console.log("This are the highScores: ", highScores);
});
