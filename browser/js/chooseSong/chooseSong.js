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
	$scope.choice = {};


    $scope.loadSong = function(level) {
        console.log('hi');
        //$scope.loading = true;
        $state.go('animation', {songId: $scope.choice.song._id, chosenLevel: level});
    };

    $(document).ready(
    	$timeout ( function () {
    		CarouselFactory.init();
    		window.addEventListener("keydown", CarouselFactory.carouselMove, false);
    		// window.addEventListener("click", CarouselFactory.freezeCarousel);

    	})
    );

    $scope.getDifficulties = function(song) {
        $('.choose-level').css("visibility", "visible");
        $timeout(function() {
            $('#level0').addClass("selected");   
        });
        
    	$scope.choice.song = song;
        $scope.choice.levels = [];
        // var currentSong = JSON.parse($scope.choice.song);
        var charts = song.Charts;
        $scope.charts = Object.keys(charts);
        //console.log('charts:', song.Charts);
        Object.keys(charts).forEach(function(key) { 
            $scope.choice.levels.push(key);
        });
        console.log('levels:', $scope.choice.levels);
        $scope.choice.levels.reverse();
        window.removeEventListener("keydown", CarouselFactory.carouselMove, false);
        window.addEventListener("keydown", function(e) {
            CarouselFactory.chooseLevel(e);
            viewSongInfo();
        }, false);
    };

    function viewSongInfo() {
        var $selected = $('.selected');
        if ($selected) $scope.selectedDifficulty = $selected[0].textContent.trim();
        console.log('selectedDifficulty:', $scope.selectedDifficulty);
        $scope.selectedChart = $scope.choice.song.Charts[$scope.selectedDifficulty];
        var {level, grooveRadar} = $scope.selectedChart;

        console.log(`Selected chart:`);
        console.log($scope.selectedChart);
        console.log(`Difficulty: ${$scope.selectedDifficulty}; Feet: ${level}`);
        Object.keys(grooveRadar).forEach(category => {
            console.log(`${category}: ${grooveRadar[category]}`);
        });




    }

});
