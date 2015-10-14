app.factory('WorkerFactory', function (ScoreFactory, $timeout, ToneFactory, ArrowFactory, $state, keyConfigFactory) {

    var TheWorker = function (route) {
        this.worker = new Worker(route)
    }

    TheWorker.prototype.prepStepChart = function (currentSong, config, bpm, stepChart) {

        this.worker.postMessage({
            type: 'preChart',
            chart: stepChart,
            bpm: bpm,
            arrowOffset: config.ARROW_TIME + currentSong.offset,
            songOffset: currentSong.offset,
            timing: config.TIMING_WINDOW,
            bpms: currentSong.bpms,
            stops: currentSong.stops
        });

    };

    var faders = {
        left: $(`.left-arrow-col .fader`),
        right: $(`.right-arrow-col .fader`),
        up: $(`.up-arrow-col .fader`),
        down: $(`.down-arrow-col .fader`)
    };

    var handleRemoval = function ($scope, time) {
        if (time.timing) {
            $timeout.cancel(time.timer);
        }
        time.timing = true;
        time.timer = $timeout(function() {
            time.timing = false;
            $scope.accuracy = null;
        }, 1000);
}

    var handleHit = function(arrows, $scope, e, time) {
        var domArrow = arrows[e.data.dir][e.data.index].el[0];
        //console.dir(domArrow);
        var arrow = domArrow.children[0];
        if (e.data.freeze) {
            var freeze = domArrow.children[1];
            freeze.style.top = '7.5vh';
            // adding freeze eater class to fader (covers up freezes)
            faders[e.data.dir][0].className += " freeze-eater";
        }
        arrow.hidden = true;
        //calculate the score, combo of the successful hit to display
        $scope.score = ScoreFactory.addScore(e.data.diff, 1);
        $scope.combo = ScoreFactory.addCombo(e.data.diff, 1);
        //as long as there is a combo to show, make it so
        $scope.combo > 1 ? $scope.showCombo = true : $scope.showCombo = false;
        //as long as there is a measure of accuracy to show, make it so
        $scope.accuracy = ScoreFactory.getAccuracy(e.data.diff);
        $scope.accuracyCol = ScoreFactory.getAccuracyColors($scope.accuracy);
        //only show accuracy feedback for 1 sec
        handleRemoval($scope, time);
    }

    TheWorker.prototype.handleMessages = function ($scope, arrows, tone) {
        var self = this;
        var time = {
            timer: null,
            timing: false
        }
        this.worker.onmessage = function (e) {
            if (e.data.hit) {
                handleHit(arrows, $scope, e, time);
            } else if (e.data.freezeUp) {
                // removing freeze eater class (this gets sent from worker on a '3' or when freeze is over)
                faders[e.data.dir][0].className = "fader";
                // removing arrow with freeze from dom so it doesn't show up again
                var domArrow = arrows[e.data.dir][e.data.index].el[0];
                domArrow.innerHTML = "";
            } else if (e.data.brokeFreeze) {
                $scope.combo = ScoreFactory.resetCombo(e.data.accuracy, 1);
                $scope.showCombo = false;
                $scope.accuracy = "Bad";
                $scope.accuracyCol = '#FF0000';
                //only show accuracy feedback for 1 sec

                handleRemoval($scope, time);

                faders[e.data.dir][0].className = "fader";
            }else if (e.data.endSong) {
                setTimeout(() => {
                    $state.go('results');
                    tone.stop();
                    self.worker.terminate();
                    ArrowFactory.killTimeline();
                }, 3000);
            } else {
                // arrows[e.data.dir][e.data.index].el.css("opacity", 0.1);
                //reset combo, don't show it and show 'Boo' on miss
                $scope.combo = ScoreFactory.resetCombo(e.data.accuracy, 1);
                $scope.showCombo = false;
                $scope.accuracy = "Boo";
                $scope.accuracyCol = '#ED3DED';
                //only show accuracy feedback for 800 msec

                handleRemoval($scope, time);
            };
            $scope.$digest();
        }
    }
    var keyCodeToDir = {
        '37': 'left',
        '40': 'down',
        '38': 'up',
        '39': 'right',
        '27': 'escape'
    };

    var placeArrows = {
        left: $(`.left-arrow-col .arrowPlace`),
        right: $(`.right-arrow-col .arrowPlace`),
        up: $(`.up-arrow-col .arrowPlace`),
        down: $(`.down-arrow-col .arrowPlace`)
    };

    var allPlaceArrows = $(`.arrowPlace`);

    TheWorker.prototype.handleKeyPress = function (e, tone, startTime) {
        var button = keyConfigFactory.getButton(e); // {player: 1, name: 'up'}, where 1 is player 2 and up is the direction
        if (button) e.preventDefault();
        else return;
        // var player = button.player; // for players!
        if(button.name === 'escape') {
            tone.stop();
            this.worker.terminate();
            ArrowFactory.killTimeline();
            $state.go('results');
        };
        // var dir = keyCodeToDir[e.keyCode];

        // this checks to make sure the key you pressed wasn't logged as undefined


        if (button.name === 'escape') {
            ToneFactory.play('back');
            /** kill music (ToneFactory), animation timeline, and worker; go back to select screen */
            tone.stop();
            this.worker.terminate();
            ArrowFactory.killTimeline();
            this.removeListeners();
            ScoreFactory.resetPlayers();
            $state.go('chooseSong');
        }

        if (placeArrows[button.name]) placeArrows[button.name].addClass('arrowPlacePressed');

        var timeStamp = (Date.now() - startTime) / 1000;
        // sends a note to worker to handle the keypress
        this.worker.postMessage({type: 'keyDown', timeStamp, dir: button.name});
    }

    TheWorker.prototype.handleKeyUp = function (e) {

        var button = keyConfigFactory.getButton(e); // {player: 1, name: 'up'}, where 1 is player 2 and up is the direction
        if (button) e.preventDefault();
        else return;
        // arrow pressed indicator
        allPlaceArrows.removeClass('arrowPlacePressed');
        this.worker.postMessage({type: 'keyUp', dir: button.name});

    }

    TheWorker.prototype.addListener = function (tone, startTime) {

        $(document).on('keydown.keyPressHandler', (e) => {
            this.handleKeyPress(e, tone, startTime);
        });
        $(document).on('gamepadbuttondown.keyPressHandler', (e) => {
            this.handleKeyPress(e, tone, startTime);
        });
        $(document).on('keyup.keyPressHandler', (e) => {
            this.handleKeyUp(e);
        });
        $(document).on('gamepadbuttonup.keyPressHandler', (e) => {
            this.handleKeyUp(e);
        });

    }

    TheWorker.prototype.removeListeners = function () {

        $(document).off('keydown.keyPressHandler');
        $(document).off('gamepadbuttondown.keyPressHandler');
        $(document).off('keyup.keyPressHandler');
        $(document).off('gamepadbuttonup.keyPressHandler');

    }



    return TheWorker;
});
