/* global Tone */

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


            function findSong(name) {
                return _.find($scope.songs, song => song.title === name);
            }

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
                currentSong.offset = Number(currentSong.offset)
                var difficulty = $scope.choice.difficulty;

                var chartId = currentSong.Charts[difficulty].stepChart;
                var mainBPM = currentSong.bpms[0].bpm;

                // console.log('currentSong:');
                // console.log(currentSong);
                // console.log(`mainBPM: ${mainBPM}`);

                var config = {
                    TIMING_WINDOW: 0.15,
                    ARROW_SPEED: ArrowFactory.speed * 4, //Factor for timing how fast arrow takes (this number / bpm for seconds)
                    MEASURE_TIME: 1/(mainBPM/60/4) //Number of seconds per measure
                };
                config.ARROW_TIME = config.ARROW_SPEED/mainBPM;


                function prepSong(stepChart) {

                    var tone = new ToneFactory("/audio/"+currentSong.music, mainBPM, currentSong.offset, config);

                    var keyCodeToDir = {
                      '37': 'left',
                      '40': 'down',
                      '38': 'up',
                      '39': 'right'
                    };

                    var startTime = 0;
                    ArrowFactory.makeTimeline();
                    var arrows = ArrowFactory.makeArrows(stepChart.chart, mainBPM);
                    var arrowWorker = new Worker('/js/animation/animationWorker.js');
                    arrowWorker.postMessage({type: 'preChart', chart: stepChart.chart, bpm: mainBPM, offset: config.ARROW_TIME + currentSong.offset, timing: config.TIMING_WINDOW})
                    arrowWorker.onmessage = function (e) {
                        arrows[e.data.dir][e.data.index].el.remove();
                    };
                    var addListener = function () {
                        document.body.addEventListener('keydown', function (e) {
                            var dir = keyCodeToDir[e.which];
                            if (dir) e.preventDefault();
                            else return;
                            var timeStamp = (Date.now() - startTime) / 1000;
                            arrowWorker.postMessage({type: 'keyPress', timeStamp, dir});
                        });
                    }

                    $scope.runInit = function () {
                        ArrowFactory.resumeTimeline();
                        tone.start();
                        startTime = Date.now() - currentSong.offset*1000;
                        addListener();
                    }

                    Tone.Buffer.onload = function () {
                        $scope.ready = true;
                        $scope.$digest();
                    };
                };

                SongFactory.getChartById(chartId)
                .then(prepSong);
            };
        }
    });
});





