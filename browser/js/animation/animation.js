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
            $scope.choice = {};

            $scope.getDifficulties = function() {
                $scope.choice.levels = [];
                var currentSong = JSON.parse($scope.choice.song);
                var charts = currentSong.Charts;
                for(var key in charts) {
                    $scope.choice.levels.push(key);
                }
            };


            $scope.setUpSong = function() {

                var currentSong = JSON.parse($scope.choice.song);
                var difficulty = $scope.choice.difficulty;

                var chartId = currentSong.Charts[difficulty].stepChart;
                var mainBPM = Number(currentSong.bpms.match(/=(\d+)/)[1]);

                var config = {
                    TIMING_WINDOW: 0.15,
                    ARROW_SPEED: 520/mainBPM, //Time it takes for the arrow to cross screen
                    MEASURE_TIME: 1/(mainBPM/60/4) //Number of seconds per measure
                };



                SongFactory.getChartById(chartId)
                .then(function(stepchart) {
       
                    var tone = new ToneFactory("/audio/"+currentSong.music, mainBPM, currentSong.offset, config);

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
                    
                    var startTime = 0;
                    ArrowFactory.makeTimeline();
                    var charts = tone.timeCharts(stepchart.chart);

                    var addListener = function () {

                        document.body.addEventListener('keydown', function (e) {
                            if (keyCodeToDir[e.which]) e.preventDefault();
                            else return;

                            var timeStamp = (Date.now() - startTime) / 1000;
                            var thisChart = charts[keyCodeToDir[e.which]];
                            console.log(keyCodeToDir[e.which], "pressed on", timeStamp);
                            var pointer = thisChart.length - 1;
                            var lastOne = thisChart[thisChart.length - 1];

                            while (lastOne.time < timeStamp - config.TIMING_WINDOW) {
                                thisChart.pop();
                                lastOne = thisChart[thisChart.length - 1];
                            }
                            var diff = Math.abs(lastOne.time - timeStamp);
                            console.log(`diff: ${diff}`);
                            if (diff < config.TIMING_WINDOW) {
                                lastOne.arrow.el.remove();
                            }

                        });
                    }
                    
                    $scope.runInit = function () {
                        ArrowFactory.resumeTimeline();
                        tone.start();
                        startTime = Date.now() - currentSong.offset*1000;
                        addListener();
                    }

                    $scope.ready = true;

                });
        
                

            };



        }
    });
});
