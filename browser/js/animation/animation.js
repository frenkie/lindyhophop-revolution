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

        controller: function($scope, ArrowFactory, ToneFactory, song, SongFactory, $stateParams, ScoreFactory, $state) {
            $scope.ready = false;
            $scope.currentSong = song;
            $scope.choice = {};

            const TIMING_WINDOW = 0.10;



            function prepSong(stepChart) {
                    ScoreFactory.setTotalArrows(stepChart);
                    var tone = new ToneFactory("/audio/"+$scope.currentSong.music, $scope.mainBPM, $scope.currentSong.offset, $scope.config);

                    var keyCodeToDir = {
                      '37': 'left',
                      '40': 'down',
                      '38': 'up',
                      '39': 'right',
                      '27': 'escape'
                    };


                    var startTime = 0;
                    ArrowFactory.makeTimeline();
                    var arrows = ArrowFactory.makeArrows(stepChart.chart, $scope.mainBPM, $scope.config);
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
                    var faders = {
                        left: $(`.left-arrow-col .fader`),
                        right: $(`.right-arrow-col .fader`),
                        up: $(`.up-arrow-col .fader`),
                        down: $(`.down-arrow-col .fader`)
                    };
                    var activeArrows;
                    arrowWorker.onmessage = function (e) {
                        // arrows[e.data.dir][e.data.index].el.removeClass('activeArrow');

                        if($('.activeArrow').length === 0) {
                            setTimeout(function() {
                                console.log('exited out here :(')
                                tone.stop();
                                arrowWorker.terminate();
                                ArrowFactory.killTimeline();
                                $state.go('chooseSong');
                            }, 3000);
                        }
                        if (e.data.hit) {
                            var domArrow = arrows[e.data.dir][e.data.index].el[0];
                            console.dir(domArrow);
                            var arrow = domArrow.children[0];
                            if (e.data.freeze) {
                                var freeze = domArrow.children[1];
                                freeze.style.top = '7.5vh';
                                // adding freeze eater class to fader (covers up freezes)
                                faders[e.data.dir][0].className += " freeze-eater";
                            }
                            arrow.hidden = true;
                            $scope.score = ScoreFactory.addScore(e.data.diff);
                            $scope.combo = ScoreFactory.addCombo(e.data.diff);
                        } else if (e.data.freezeUp) {
                            // removing freeze eater class (this gets sent from worker on a '3' or when freeze is over)
                            faders[e.data.dir][0].className = "fader";
                            // removing arrow with freeze from dom so it doesn't show up again
                            var domArrow = arrows[e.data.dir][e.data.index].el[0];
                            domArrow.innerHTML = "";
                        } else {
                            // arrows[e.data.dir][e.data.index].el.css("opacity", 0.1);
                            $scope.combo = ScoreFactory.resetCombo(e.data.accuracy);
                            ScoreFactory.addScore(e.data.diff);
                        };
                        $scope.$digest();

                    };
                    var placeArrows = {
                        left: $(`.left-arrow-col .arrowPlace`),
                        right: $(`.right-arrow-col .arrowPlace`),
                        up: $(`.up-arrow-col .arrowPlace`),
                        down: $(`.down-arrow-col .arrowPlace`)
                    };
                    var allPlaceArrows = $(`.arrowPlace`);

                    var addListener = function () {

                        var stopSong = function (e) {
                            if(e.keyCode === 48) {
                                console.log(ScoreFactory.finalScore());
                                console.log(ScoreFactory.accuracyCountGuy);
                            };
                            var dir = keyCodeToDir[e.keyCode];

                            if (dir) e.preventDefault();
                            else return;

                            if (dir === 'escape') {
                                ToneFactory.play('back');
                                /** kill music (ToneFactory), animation timeline, and worker; go back to select screen */
                                tone.stop();
                                arrowWorker.terminate();
                                ArrowFactory.killTimeline();
                                document.body.removeEventListener('keydown', stopSong);
                                $state.go('chooseSong');
                            }

                            if (placeArrows[dir]) placeArrows[dir].addClass('arrowPlacePressed');

                            var timeStamp = (Date.now() - startTime) / 1000;
                            // sends a note to worker to handle the keypress
                            arrowWorker.postMessage({type: 'keyDown', timeStamp, dir});
                        }
                        document.body.addEventListener('keydown', stopSong);

                        document.body.addEventListener('keyup', function(e) {
                            var dir = keyCodeToDir[e.keyCode];
                            if (!dir) return;
                            allPlaceArrows.removeClass('arrowPlacePressed');
                            arrowWorker.postMessage({type: 'keyUp', dir});

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
                        else {
                            $scope.imageSrc = `/img/background/${$scope.currentSong.title}-bg.png`;
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
                    TIMING_WINDOW: TIMING_WINDOW,
                    ARROW_SPEED: ArrowFactory.speed * 4, //Factor for timing how fast arrow takes (this number / bpm for seconds)
                    MEASURE_TIME: 1/($scope.mainBPM/60/4) //Number of seconds per measure
                };
                $scope.config.ARROW_TIME = $scope.config.ARROW_SPEED/$scope.mainBPM;
                $scope.config.BEAT_TIME = $scope.config.MEASURE_TIME/4;

                $scope.config.BEAT_VH = 100/((ArrowFactory.speed * 4)/$scope.mainBPM) * $scope.config.BEAT_TIME;


                SongFactory.getChartById(chartId)
                .then(prepSong);

            };


            setTimeout(setUpSong, 2000);

        }
    });
});
