/* global Tone */

app.config(function ($stateProvider) {

    $stateProvider.state('chooseSong', {
        url: '/chooseSong',
        templateUrl: 'js/chooseSong/chooseSong.html',
        resolve: {
            songs: function(SongFactory) {
                return SongFactory.getSongs();
            }
        },
        params: {
            players: 1
        },
        controller: 'ChooseSongCtrl'
    });

});


app.controller('ChooseSongCtrl', function ($scope, CarouselFactory, $state, songs, $timeout, ToneFactory, ScoreFactory, $stateParams) {

    console.log(`players:`);
    console.log($stateParams);

    $scope.songs = songs;

	$scope.choice = {};

    $scope.songPreview;

    //add a new player for testing purposes
    if ($stateParams.players === 2) ScoreFactory.addPlayer();

    // $scope.speedMod = ArrowFactory.speedModifier;
    // ArrowFactory.setSpeed($scope.speedMod);
    console.log(`All songs: (Count: ${songs.length})`);
    console.log(songs.map(s => s.title).sort().join(', '));

    function viewSongInfo() {
        var $selected1 = $('.selected1');
        var $selected2 = $('.selected2');
        if (!$selected2.length) $selected2 = null;
        console.log(`$selected1:`)
        console.log($selected1);
        console.log(`$selected2:`)
        console.log($selected2);
        if ($selected1) $scope.selectedDifficulty1 = $selected1[0].textContent.trim();
        if ($selected2) $scope.selectedDifficulty2 = $selected2[0].textContent.trim();
        console.log('selectedDifficulty1:', $scope.selectedDifficulty1);
        console.log('selectedDifficulty2:', $scope.selectedDifficulty2);

        console.log('numPlayers:', _.range($stateParams.players).map(p=>p+1));



        console.log('selected song:', $scope.choice.song);
        var {title, artist, displayBpm, music, offset, sampleStart, sampleLength, Charts} = $scope.choice.song;

        console.log('sampleStart:', sampleStart);
        console.log('sampleLength:', sampleLength);

        _.range($stateParams.players).map(p=>p+1).forEach(num => {
            $scope['selectedChart'+num] = Charts[$scope['selectedDifficulty'+num]];
            $scope['level'+num] = $scope['selectedChart'+num].level;
            $scope['grooveRadar'+num] = $scope['selectedChart'+num].grooveRadar;      
        })

        // $scope.selectedChart1 = Charts[$scope.selectedDifficulty1];
        // $scope.selectedChart2 = Charts[$scope.selectedDifficulty2];

        // var {level1, grooveRadar1} = $scope.selectedChart1;
        // var {level2, grooveRadar2} = $scope.selectedChart2;


        // console.log(`Selected chart:`);
        // console.log($scope.selectedChart1);
        console.log(`${title} - ${artist}`);
        console.log(`BPM: ${displayBpm}`);
        console.log(`Preview audio: ${music}`);
        console.log(`Difficulty P1: ${$scope.selectedDifficulty1}; Feet: ${$scope.level1}`);
        console.log(`Difficulty P2: ${$scope.selectedDifficulty2}; Feet: ${$scope.level2}`);

        // console.log(Object.keys(grooveRadar).reduce((output, category) => {
        //     return output.concat(`${category}: ${grooveRadar[category]}`);
        // }, []).join(' | '));

        if (!$scope.songPreview) {
            $scope.songPreview = new ToneFactory("/audio/"+music, null, offset, null, sampleStart, sampleLength);
            $scope.songPreview.previewStart();           
        }

    }

    function chooseLevel(e) {
        if ($scope.choice.levels < 2) return;
        CarouselFactory.chooseLevel(e);
        if (e.keyCode === 38 || e.keyCode === 40 || 
            (ScoreFactory.allPlayerGuys.length > 1 && (e.keyCode === 87 || e.keyCode === 83 ))) {
            ToneFactory.play('blop');
            viewSongInfo();      
        }
        else if (e.keyCode === 27) {
            window.removeEventListener("keydown", chooseLevel, false);
            if ($scope.songPreview) {
                $scope.songPreview.previewStop();
                $scope.songPreview = null;
            }
        }
        else if (e.keyCode === 13) {
            if ($scope.songPreview) {
                $scope.songPreview.previewStop();
                $scope.songPreview = null;
            }    
        }
    }


    $scope.selectedDifficulty1, $scope.selectedDifficulty2;
    $scope.selectedChart1, $scope.selectedChart2;



    $(document).ready(
        $timeout ( function () {
            CarouselFactory.init();
            window.addEventListener("keydown", CarouselFactory.carouselMove, false);
            // window.addEventListener("click", CarouselFactory.freezeCarousel);
        })
    );

    $scope.getDifficulties = function(song) {
        $('.choose-level').css("visibility", "visible");
        //change below once we know have many players
        ScoreFactory.allPlayerGuys.forEach(function (guy, index) {
            $(`.selectedArrow${index+1}`).css("visibility", "visible");
        });
        $timeout(function() {
            ScoreFactory.allPlayerGuys.forEach(function (guy, index) {
                $('#level0').addClass(`selected${index+1}`).children(`.player${index+1}Arrow`).addClass(`selectedArrow${index+1}`);
            })
            viewSongInfo();   
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

        console.log('$scope.choice:', $scope.choice);

        window.removeEventListener("keydown", CarouselFactory.carouselMove, false);
        window.addEventListener("keydown", chooseLevel, false);
    };


    $scope.loadSong = function(chart) {
        ToneFactory.play('start');
        window.removeEventListener("keydown", chooseLevel, false);
        if($stateParams.players===2) $state.go('versus', {songId: $scope.choice.song._id, chosenLevel: $scope.selectedDifficulty1, chosenLevelP2: $scope.selectedDifficulty2});
        else $state.go('animation', {songId: $scope.choice.song._id, chosenLevel: $scope.selectedDifficulty1});
        
    };


});
