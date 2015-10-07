app.config(function ($stateProvider) {

    $stateProvider.state('chooseSong', {
        url: '/chooseSong',
        templateUrl: 'js/chooseSong/chooseSong.html',
        resolve: {
            songs: function(SongFactory) {
                return SongFactory.getSongs();
            }
        },
        controller: 'ChooseSongCtrl'
    });

});

app.controller('ChooseSongCtrl', function ($scope, CarouselFactory, $state, songs, $timeout) {

	$scope.songs = songs;

    $scope.loadSong = function() {
      $scope.loading = true;
      setTimeout(function(){
        $state.go('confirmSong');
      }, 5000);
    };

    $(document).ready(
    	$timeout ( function () {
    		CarouselFactory.init()
    	})
    );

});
