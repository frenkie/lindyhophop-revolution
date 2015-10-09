/* global Tone */

app.config(function($stateProvider) {
    $stateProvider.state('animation', {
        url: '/animation/:songId/:chosenLevel',
        templateUrl: 'js/animation/animation.html',
        resolve: {
            songs: function(SongFactory) {
                return SongFactory.getSongs();
            }
        },
        controller: function($scope, ArrowFactory, ToneFactory, songs, SongFactory, $stateParams) {
            $scope.songs = songs;
            $scope.choice = {};

            function findSong() {
                return SongFactory.getSongById($stateParams.songId)
                .exec()
                .then( function (song) {
                    console.log('found song', song);
                    return song;
                });
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
                SongFactory.getSongById($stateParams.songId)
                .then( function (currentSong) {
                    $scope.currentSong = currentSong;
                    $scope.currentSong.offset = Number($scope.currentSong.offset);
                    var difficulty = $stateParams.chosenLevel;
                    console.log($scope.currentSong);
                    console.log(difficulty);

                    var chartId = $scope.currentSong.Charts[difficulty].stepChart;
                    console.log(chartId);

                    $scope.mainBPM = $scope.currentSong.bpms[0].bpm;

                    $scope.config = {
                    TIMING_WINDOW: 0.15,
                    ARROW_SPEED: ArrowFactory.speed * 4, //Factor for timing how fast arrow takes (this number / bpm for seconds)
                    MEASURE_TIME: 1/($scope.mainBPM/60/4) //Number of seconds per measure
                    };
                    $scope.config.ARROW_TIME = $scope.config.ARROW_SPEED/$scope.mainBPM;
                    $scope.config.BEAT_TIME = $scope.config.MEASURE_TIME/4;

                    return chartId;
                })
                .then( function (chartId) {
                    SongFactory.getChartById(chartId)
                    .then(prepSong);
                });


                function prepSong(stepChart) {

                    var tone = new ToneFactory("/audio/"+$scope.currentSong.music, $scope.mainBPM, $scope.currentSong.offset, $scope.config);

                    var keyCodeToDir = {
                      '37': 'left',
                      '40': 'down',
                      '38': 'up',
                      '39': 'right'
                    };

                    var startTime = 0;
                    ArrowFactory.makeTimeline();
                    var arrows = ArrowFactory.makeArrows(stepChart.chart, $scope.mainBPM);
                    ArrowFactory.addStops($scope.currentSong.stops, $scope.config.ARROW_TIME, $scope.config.BEAT_TIME);
                    ArrowFactory.addBpmChanges($scope.currentSong.bpms, $scope.config.ARROW_TIME, $scope.config.BEAT_TIME, $scope.currentSong.stops);
                    var arrowWorker = new Worker('/js/animation/animationWorker.js');
                    arrowWorker.postMessage({
                        type: 'preChart',
                        chart: stepChart.chart,
                        bpm: $scope.mainBPM,
                        arrowOffset: $scope.config.ARROW_TIME + $scope.currentSong.offset,
                        songOffset: $scope.currentSong.offset,
                        timing: $scope.config.TIMING_WINDOW,
                        bpms: $scope.currentSong.bpms,
                        stops: $scope.currentSong.stops
                    });
                    arrowWorker.onmessage = function (e) {
                      if(e.data.hit) {
                        arrows[e.data.dir][e.data.index].el.remove();
                      } else {
                        arrows[e.data.dir][e.data.index].el.css("opacity", 0.1);
                      };
                    };
                    var addListener = function () {
                        document.body.addEventListener('keydown', function (e) {
                            var dir = keyCodeToDir[e.keyCode];
                            if (dir) e.preventDefault();
                            else return;
                            var timeStamp = (Date.now() - startTime) / 1000;
                            arrowWorker.postMessage({type: 'keyPress', timeStamp, dir});
                        });
                    }

                    $scope.runInit = function () {
                        ArrowFactory.resumeTimeline();
                        tone.start();
                        startTime = Date.now() - $scope.currentSong.offset*1000;
                        arrowWorker.postMessage({
                          type: 'startTime',
                          startTime
                        });
                        addListener();
                    }

                    Tone.Buffer.onload = function () {
                        $scope.ready = true;
                        $scope.$digest();
                    };
                };
            };
        }
    });
});
