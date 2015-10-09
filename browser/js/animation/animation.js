/* global Tone */

app.config(function($stateProvider) {
    $stateProvider.state('animation', {
        url: '/animation/:songId/:chosenLevel',
        templateUrl: 'js/animation/animation.html',
        resolve: {
            song: function(SongFactory, $stateParams) {
                return SongFactory.getSongById($stateParams.songId);
            }
        },
        controller: function($scope, ArrowFactory, ToneFactory, song, SongFactory, $stateParams, $state) {
            $scope.ready = false;
            $scope.currentSong = song;
            $scope.choice = {};

            function prepSong(stepChart) {

                    var tone = new ToneFactory("/audio/"+$scope.currentSong.music, $scope.mainBPM, $scope.currentSong.offset, $scope.config);

                    var keyCodeToDir = {
                      '37': 'left',
                      '40': 'down',
                      '38': 'up',
                      '39': 'right',
                      '27': 'escape',
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

                    console.log(tone);
                    var activeArrows
                    arrowWorker.onmessage = function (e) {
                        arrows[e.data.dir][e.data.index].el.removeClass('activeArrow');


                        if($('.activeArrow').length === 0) {
                            setTimeout(function() {
                                tone.stop();
                                arrowWorker.terminate();
                                ArrowFactory.killTimeline();
                                $state.go('chooseSong');
                            }, 3000);
                        }

                        if(e.data.hit) {
                            arrows[e.data.dir][e.data.index].el.remove();
                        } else {
                            arrows[e.data.dir][e.data.index].el.css("opacity", 0.1);
                        };
                    };
                    var placeArrows = {
                        left: $(`.left-arrow-col .arrowPlace`),
                        right: $(`.right-arrow-col .arrowPlace`),
                        up: $(`.up-arrow-col .arrowPlace`),
                        down: $(`.down-arrow-col .arrowPlace`)
                    };
                    var allPlaceArrows = $(`.arrowPlace`);

                    var addListener = function () {
                        document.body.addEventListener('keydown', function (e) {
                            var dir = keyCodeToDir[e.keyCode];
                            placeArrows[dir].addClass('arrowPlacePressed');
                            if (dir) e.preventDefault();
                            else return;

                            if (dir === 'escape') {
                                /** kill music (ToneFactory), animation timeline, and worker; go back to select screen */
                                tone.stop();
                                arrowWorker.terminate();
                                ArrowFactory.killTimeline();
                                $state.go('chooseSong');
                            }

                            var timeStamp = (Date.now() - startTime) / 1000;
                            arrowWorker.postMessage({type: 'keyPress', timeStamp, dir});
                        });

                        document.body.addEventListener('keyup', function(e) {
                            var dir = keyCodeToDir[e.keyCode];
                            if (!dir) return;
                            allPlaceArrows.removeClass('arrowPlacePressed');
                        })
                    }

                    var runInit = function () {
                        ArrowFactory.resumeTimeline();
                        tone.start();
                        startTime = Date.now() - $scope.currentSong.offset*1000;
                        arrowWorker.postMessage({
                          type: 'startTime',
                          startTime
                        });
                        addListener();


                        var videoOffset = ($scope.config.ARROW_SPEED/$scope.mainBPM + Number($scope.currentSong.offset))*1000;

                        if ($scope.currentSong.title === 'Caramelldansen') {
                            $scope.videoSrc = '/video/Caramelldansen.mp4';
                            videoOffset += 1000;
                        }
                        else if ($scope.currentSong.title === 'Sandstorm') {
                            $scope.videoSrc = '/video/Darude - Sandstorm.mp4';
                        }
                        setTimeout(function() {
                            var video = document.getElementById('bg-video');
                            video.play();
                        }, videoOffset);


                        $scope.ready = true;
                        $scope.$digest();

                        //This is only so the user can read the loading screen and have heightened anticipation!

                    }

                    Tone.Buffer.onload = function () {
                        runInit();
                    };
                };

            var setUpSong = function() {

                $scope.currentSong.offset = parseFloat($scope.currentSong.offset);

                var difficulty = $stateParams.chosenLevel;

                var chartId = $scope.currentSong.Charts[difficulty].stepChart;

                $scope.mainBPM = $scope.currentSong.bpms[0].bpm;

                $scope.config = {
                    TIMING_WINDOW: 0.15,
                    ARROW_SPEED: ArrowFactory.speed * 4, //Factor for timing how fast arrow takes (this number / bpm for seconds)
                    MEASURE_TIME: 1/($scope.mainBPM/60/4) //Number of seconds per measure
                };
                $scope.config.ARROW_TIME = $scope.config.ARROW_SPEED/$scope.mainBPM;
                $scope.config.BEAT_TIME = $scope.config.MEASURE_TIME/4;


                SongFactory.getChartById(chartId)
                .then(prepSong);


            };


            setTimeout(function() {
                setUpSong();

            }, 2000);

        }
    });
});
