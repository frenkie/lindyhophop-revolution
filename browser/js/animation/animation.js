app.config(function($stateProvider) {
    $stateProvider.state('animation', {
        url: '/animation',
        templateUrl: 'js/animation/animation.html',
        resolve: {
            songs: function(SongFactory) {
                return SongFactory.getSongs();
            }
        },
        controller: function($scope, ArrowFactory, ToneFactory, songs, SongFactory) {
            $scope.songs = songs;

            function findSong(name) {
                return _.find($scope.songs, song => song.title === name);
            }

            console.log('songs:');
            console.log(songs);
            var currentSong = findSong('CaramellDansen');
            console.log(currentSong);
            var difficulty = "Hard";
            var chartId = currentSong.Charts[difficulty].stepChart;
            var mainBPM = currentSong.bpms[0].bpm;
            console.log(`mainBPM: ${mainBPM}`);
 

            SongFactory.getChartById(chartId)
                .then(function(chart) {

                    console.log(chart);
   

                var syncOffset = currentSong.offset;
                console.log('syncOffset:',syncOffset);  
                var tone = new ToneFactory("/audio/"+currentSong.music, mainBPM, (ArrowFactory.speed * 4)/mainBPM + Number(syncOffset), syncOffset);

            var dirToKeyCode = {
              left: '37',
              down: '40',
              up: '38',
              right: '39'
            };

            var keyCodeToDir = {
              '37': 'left',
              '40': 'down',
              '38': 'up',
              '39': 'right'
            };
            var TIMING_WINDOW = 0.15;
            var startTime = 0;
            ArrowFactory.makeTimeline();
            var charts = tone.timeCharts(chart.chart, currentSong.bpms, currentSong.stops);
            console.log('charts:', charts);
            var addListener = function () {
                document.body.addEventListener('keydown', function (e) {
                    if (keyCodeToDir[e.which]) e.preventDefault();
                    else return;
                    var timeStamp = (Date.now() - startTime) / 1000;
                    var thisChart = charts[keyCodeToDir[e.which]];
                    console.log(keyCodeToDir[e.which], "pressed on", timeStamp)
                    var pointer = thisChart.length - 1;
                    var lastOne = thisChart[thisChart.length - 1];
                    while (lastOne.time < timeStamp - TIMING_WINDOW) {
                        thisChart.pop();
                        lastOne = thisChart[thisChart.length - 1];
                    }
                    var diff = Math.abs(lastOne.time - timeStamp);
                    console.log(`diff: ${diff}`);
                    if (diff < TIMING_WINDOW) {
                        lastOne.arrow.el.remove();
                    }

                });
            }
            
            $scope.runInit = function () {
                console.log('arrows starting', Date.now());
                ArrowFactory.resumeTimeline();

                tone.start();
                startTime = Date.now() - currentSong.offset*1000;
                addListener();
            }


            });



        }
    });
});
