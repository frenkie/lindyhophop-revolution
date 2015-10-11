app.config(function ($stateProvider) {

    $stateProvider.state('results', {
        url: '/results',
        templateUrl: 'js/results/results.html',
        controller: 'ResultsCtrl',
        resolve: {
          results: function(ScoreFactory) {
            return ScoreFactory.getScore();
          },
          maxCombo: function(ScoreFactory) {
            return ScoreFactory.getMaxCombo();
          }
        }
    });

});

app.controller('ResultsCtrl', function ($scope, $state, results) {
  $scope.results = results;
  console.log("This are the results: ", results);

});
