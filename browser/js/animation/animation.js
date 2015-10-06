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
            console.log(songs);
            var currentSong = songs[4];
            console.log(currentSong);
            var difficulty = "Hard";
            var chartId = currentSong.Charts[difficulty].stepChart;
            console.log(chartId);
            // var mainBPM = Number(currentSong.bpms.match(/=(\d+)/)[1]);
            var mainBPM = 150;



            SongFactory.getChartById(chartId)
                .then(function(chart) {

                    console.log(chart);


                var syncOffset = currentSong.offset;
                console.log('syncOffset:',syncOffset);
                var tone = new ToneFactory("/audio/"+currentSong.music, mainBPM, (130 * 4)/mainBPM + Number(syncOffset), syncOffset);

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
            var arrows = ArrowFactory.makeArrows(chart.chart, mainBPM);
            window.arrows = arrows;
            console.log('arrows are', arrows)
            var arrowWorker = new Worker('/js/animation/animationWorker.js');
            arrowWorker.postMessage({type: 'preChart', chart: chart.chart, bpm: mainBPM, offset: (130 * 4)/mainBPM + Number(syncOffset), timing: TIMING_WINDOW})
            arrowWorker.onmessage = function (e) {
                console.log('removing arrow dir', e.data.dir, 'index', e.data.index)
                console.log(arrows[e.data.dir][e.data.index]);
                arrows[e.data.dir][e.data.index].el.remove();
            };
            var addListener = function () {
                console.log('added listener to arows')
                document.body.addEventListener('keydown', function (e) {
                    var dir = keyCodeToDir[e.which];
                    if (dir) e.preventDefault();
                    else return;
                    var timeStamp = (Date.now() - startTime) / 1000;
                    arrowWorker.postMessage({type: 'keyPress', timeStamp, dir});

                    // var thisChart = charts[keyCodeToDir[e.which]];
                    // console.log(keyCodeToDir[e.which], "pressed on", timeStamp)
                    // var pointer = thisChart.length - 1;
                    // var lastOne = thisChart[thisChart.length - 1];
                    // while (lastOne.time < timeStamp - TIMING_WINDOW) {
                    //     thisChart.pop();
                    //     lastOne = thisChart[thisChart.length - 1];
                    // }
                    // var diff = Math.abs(lastOne.time - timeStamp);
                    // console.log(`diff: ${diff}`);
                    // if (diff < TIMING_WINDOW) {
                    //     lastOne.arrow.el.remove();
                    // }

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
