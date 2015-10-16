/* global Tone */

app.config(function($stateProvider) {
    $stateProvider.state('versus', {
        url: '/versus/:songId/?chosenLevel&chosenLevelP2',
        templateUrl: 'js/versus/versus.html',
        resolve: {
            song: function(SongFactory, $stateParams) {
                return SongFactory.getSongById($stateParams.songId);
            }
        },
        params: {
            mod1: 1,
            mod2: 1
        },
        controller: function($scope, ArrowFactory, ToneFactory, song, SongFactory, $stateParams, ScoreFactory, $state, $timeout, WorkerFactory) {
            


            $scope.ready = false;
            var currentSong = song;

            const TIMING_WINDOW = ScoreFactory.TIMINGWINDOWS.Great;

            currentSong.offset = parseFloat(currentSong.offset);

            var P1difficulty = $stateParams.chosenLevel, P2difficulty = $stateParams.chosenLevelP2;
            var P1chartId = currentSong.Charts[P1difficulty].stepChart;
            var P2chartId = currentSong.Charts[P2difficulty].stepChart;
            var mainBPM = currentSong.bpms[0].bpm;
            //idea for cleanup of config/currentsong ES6 syntax thingie
            // var {Charts, bpms} = currentSong;


            var config1 = {
                TIMING_WINDOW: TIMING_WINDOW,
                ARROW_TIME: ((ArrowFactory.SPEED_1X/$stateParams.mod1) * 4 / mainBPM), //Factor for timing how fast arrow takes (this number / bpm for seconds)
                BEAT_TIME: 1/(mainBPM/60/4)/4, //Number of seconds per measure
                SPEED_MOD: $stateParams.mod1,
            };
            config1.BEAT_VH = 100/(((ArrowFactory.SPEED_1X/$stateParams.mod1) * 4)/mainBPM) * config1.BEAT_TIME;

            var config2 = {
                TIMING_WINDOW: TIMING_WINDOW,
                ARROW_TIME: ((ArrowFactory.SPEED_1X/$stateParams.mod2) * 4 / mainBPM), //Factor for timing how fast arrow takes (this number / bpm for seconds)
                BEAT_TIME: 1/(mainBPM/60/4)/4, //Number of seconds per measure
                SPEED_MOD: $stateParams.mod2,
            };
            config2.BEAT_VH = 100/(((ArrowFactory.SPEED_1X/$stateParams.mod2) * 4)/mainBPM) * config2.BEAT_TIME;


            var arrowWorker1, arrowWorker2, tone;


            //This is only so the user can read the loading screen and have heightened anticipation!
            setTimeout(function () {
                SongFactory.getChartById(P1chartId)
                .then(function(P1chart) {
                    SongFactory.getChartById(P2chartId)
                    .then(function(P2chart) {
                        console.log('have chartIds, running prepsong with charts');
                        prepSong(P1chart, P2chart);
                    });
                });
            }, 2000);


            function prepSong(P1stepChart, P2stepChart) {
                var playerOffset = config1.ARROW_TIME - config2.ARROW_TIME;
                console.log('playerOffset', playerOffset);
                var configForTone = playerOffset >= 0 ? config1 : config2;
                console.log('configForTone:');
                console.log(configForTone);
                tone = new ToneFactory("/audio/"+currentSong.music, mainBPM, currentSong.offset, configForTone);
                //to set the stepChart on the player object
                ScoreFactory.setStepChart(P1stepChart, 1);
                ScoreFactory.setStepChart(P2stepChart, 2);

                var player1Offset = playerOffset >= 0 ? 0 : playerOffset*-1;
                var player2Offset = playerOffset >= 0 ? playerOffset : 0;
                config1.animationOffset = player1Offset;
                config2.animationOffset = player2Offset;
                //when prepping song, score factory will get the total number of arrows in the stepchart
                //for score calculation purposes
                ScoreFactory.setTotalArrows(1);
                ScoreFactory.setTotalArrows(2);


                // functions defined in arrow


                // sets up arrow for animating
                var arrows1 = ArrowFactory.makeArrows(P1stepChart.chart, mainBPM, config1, currentSong, 1);
                var arrows2 = ArrowFactory.makeArrows(P2stepChart.chart, mainBPM, config2, currentSong, 2);


                // gives arrowWorker first chart
                arrowWorker1 = new WorkerFactory('/js/animation/animationWorker.js', 1);
                arrowWorker2 = new WorkerFactory('/js/animation/animationWorker.js', 2);

                arrowWorker1.prepStepChart(currentSong, configForTone, mainBPM, P1stepChart.chart);
                // arrowWorker2.prepStepChart(currentSong, {
                //     ARROW_TIME: config2.ARROW_TIME - (4/mainBPM)*((ArrowFactory.SPEED_1X/config2.SPEED_MOD) - (ArrowFactory.SPEED_1X/config1.SPEED_MOD)),
                //     TIMING_WINDOW: config2.TIMING_WINDOW
                // }, 
                arrowWorker2.prepStepChart(currentSong, configForTone, mainBPM, P2stepChart.chart);


                arrowWorker1.handleMessages($scope, arrows1, tone, 2);
                arrowWorker2.handleMessages($scope, arrows2, tone, 2);


                Tone.Buffer.onload = runInit;

            };

            function runInit () {
                ArrowFactory.resumeTimeline();
                tone.start();
                var startTime = Date.now() - currentSong.offset*1000;
                arrowWorker1.worker.postMessage({
                  type: 'startTime',
                  startTime
                });
                arrowWorker2.worker.postMessage({
                  type: 'startTime',
                  startTime
                });
                arrowWorker1.addListener(tone, startTime);
                arrowWorker2.addListener(tone, startTime);



                // videofactory please Jay, put into models
                var videoOffset = (config1.ARROW_TIME + Number(currentSong.offset))*1000;

                if (currentSong.title === 'Caramelldansen') {
                    $scope.videoSrc = '/video/Caramelldansen.mp4';
                    videoOffset += 1000;
                }
                else if (currentSong.title === 'Sandstorm') {
                    $scope.videoSrc = '/video/Darude - Sandstorm.mp4';
                }
                else {
                    $scope.imageSrc = `/img/background/${song.background}`;               
                }
                setTimeout(function() {
                    var video = document.getElementById('bg-video');
                    video.play();
                }, videoOffset);

                $scope.ready = true;
                $scope.$digest();
            }
        }
    });
});
