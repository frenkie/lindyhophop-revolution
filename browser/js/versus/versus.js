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
        controller: function($scope, $q, ArrowFactory, ToneFactory, song, SongFactory, $stateParams, ScoreFactory, $state, $timeout, WorkerFactory) {



            $scope.ready = false;
            var currentSong = song;

            const TIMING_WINDOW = ScoreFactory.TIMINGWINDOWS.Great;

            currentSong.offset = parseFloat(currentSong.offset);

            var P1difficulty = $stateParams.chosenLevel, P2difficulty = $stateParams.chosenLevelP2;
            var P1chartId = currentSong.Charts[P1difficulty].stepChart;
            var P2chartId = currentSong.Charts[P2difficulty].stepChart;
            var mainBPM = currentSong.bpms[0].bpm;


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
                $q.all([SongFactory.getChartById(P1chartId), SongFactory.getChartById(P2chartId)])
                .then(function (charts) {
                    prepSong(charts[0], charts[1]);
                })
            }, 2000);


            function prepSong(P1stepChart, P2stepChart) {
                // we need to know which player has a slower modifier--we will start the slower player's arrows first
                // we also need to use the slower player's config in the Tone Factory
                var playerOffset = config1.ARROW_TIME - config2.ARROW_TIME;
                var configForTone = playerOffset >= 0 ? config1 : config2;

                tone = new ToneFactory("/audio/"+currentSong.music, mainBPM, currentSong.offset, configForTone);
                //to set the stepChart on the player object
                ScoreFactory.setStepChart(P1stepChart, 1);
                ScoreFactory.setStepChart(P2stepChart, 2);

                // if player 1 is slower, her offset is 0, and player 2's
                var player1Offset, player2Offset;
                if (playerOffset >= 0) { // player 1's arrows start first
                    player1Offset = 0;
                    player2Offset = playerOffset;
                } else { // player 2's arrows start first
                    player1Offset = -playerOffset;
                    player2Offset = 0;
                }
                // this allows us to pass the offset on to the arrow factory in the config object
                config1.animationOffset = player1Offset;
                config2.animationOffset = player2Offset;
                ScoreFactory.setTotalArrows(1);
                ScoreFactory.setTotalArrows(2);


                var arrows1 = ArrowFactory.makeArrows(P1stepChart.chart, mainBPM, config1, currentSong, 1);
                var arrows2 = ArrowFactory.makeArrows(P2stepChart.chart, mainBPM, config2, currentSong, 2);


                // gives arrowWorker first chart
                arrowWorker1 = new WorkerFactory('/js/animation/animationWorker.js', 1);
                arrowWorker2 = new WorkerFactory('/js/animation/animationWorker.js', 2);

                // important to use the same config as the one that started the music to calculate timeStamps on the worker
                arrowWorker1.prepStepChart(currentSong, configForTone, mainBPM, P1stepChart.chart);
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
