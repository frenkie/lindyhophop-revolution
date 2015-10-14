app.factory('WorkerFactory', function (ScoreFactory, $timeout, ToneFactory, ArrowFactory, $state, keyConfigFactory) {

    var TheWorker = function (route, player) {
        this.worker = new Worker(route);
        this.player = player;
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

    TheWorker.prototype.handleRemoval = function ($scope, time) {
        var self = this;
        if (time.timing) {
            $timeout.cancel(time.timer);
        }
        time.timing = true;
        time.timer = $timeout(function() {
            time.timing = false;
            $scope['accuracy'+self.player] = null;
        }, 1000);
}

    TheWorker.prototype.handleHit = function(arrows, $scope, e, time) {
        var self = this;
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
        $scope['score'+self.player] = ScoreFactory.addScore(e.data.diff, self.player);
        console.log('Player '+self.player+'score: ',$scope['score'+self.player]);
        $scope['combo'+self.player] = ScoreFactory.addCombo(e.data.diff, self.player);
        console.log('Player '+self.player+'combo: ',$scope['combo'+self.player]);
        //as long as there is a combo to show, make it so
        $scope['combo'+self.player] > 1 ? $scope['showCombo'+self.player] = true : $scope['showCombo'+self.player] = false;
        //as long as there is a measure of accuracy to show, make it so
        $scope['accuracy'+self.player] = ScoreFactory.getAccuracy(e.data.diff);
        $scope['accuracyCol'+self.player] = ScoreFactory.getAccuracyColors($scope['accuracy'+self.player]);
        //only show accuracy feedback for 1 sec

        this.handleRemoval($scope, time);


    }

    TheWorker.prototype.handleMessages = function ($scope, arrows, tone) {
        var self = this;
        var time = {
            timer: null,
            timing: false
        }
        this.worker.onmessage = function (e) {
            if (e.data.hit) {
                self.handleHit(arrows, $scope, e, time);
            } else if (e.data.freezeUp) {
                // removing freeze eater class (this gets sent from worker on a '3' or when freeze is over)
                faders[e.data.dir][0].className = "fader";
                // removing arrow with freeze from dom so it doesn't show up again
                var domArrow = arrows[e.data.dir][e.data.index].el[0];
                domArrow.innerHTML = "";
            } else if (e.data.brokeFreeze) {
                $scope['combo'+self.player] = ScoreFactory.resetCombo(e.data.accuracy, self.player);
                $scope['showCombo'+self.player] = false;
                $scope['accuracy'+self.player] = "Bad";
                $scope['accuracyCol'+self.player] = '#FF0000';
                //only show accuracy feedback for 1 sec

                self.handleRemoval($scope, time);

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
                $scope['combo'+self.player] = ScoreFactory.resetCombo(e.data.accuracy, self.player);
                $scope['showCombo'+self.player] = false;
                $scope['accuracy'+self.player] = "Boo";
                $scope['accuracyCol'+self.player] = '#ED3DED';
                //only show accuracy feedback for 800 msec

                self.handleRemoval($scope, time);
            };
            $scope.$digest();
        }
    }
    var keyCodeToDir = {
        '37': 'left',
        '40': 'down',
        '38': 'up',
        '39': 'right',
        '27': 'escape',
        '65': 'left', //a
        '87': 'up', //w
        '83': 'down', //s
        '68': 'right' //d
    };

    var placeArrows = {
        left: $(`.left-arrow-col .arrowPlace`),
        right: $(`.right-arrow-col .arrowPlace`),
        up: $(`.up-arrow-col .arrowPlace`),
        down: $(`.down-arrow-col .arrowPlace`),
        leftP1: $(`.left-arrow-col .arrowPlace.arrowP1`),
        rightP1: $(`.right-arrow-col .arrowPlace.arrowP1`),
        upP1: $(`.up-arrow-col .arrowPlace.arrowP1`),
        downP1: $(`.down-arrow-col .arrowPlace.arrowP1`),
        leftP2: $(`.left-arrow-col .arrowPlace.arrowP2`),
        rightP2: $(`.right-arrow-col .arrowPlace.arrowP2`),
        upP2: $(`.up-arrow-col .arrowPlace.arrowP2`),
        downP2: $(`.down-arrow-col .arrowPlace.arrowP2`)
    };

    var allPlaceArrows = $(`.arrowPlace`);

    TheWorker.prototype.handleKeyPress = function (e, tone, startTime) {
        // var button = keyConfigFactory.getButton(e); // {player: 1, name: 'up'}, where 1 is player 2 and up is the direction
        // if (button) e.preventDefault();
        // else return;
        // // var player = button.player; // for players!
        // if(button.name === 'escape') {
        var num = e.keyCode;
        if(e.keyCode === 48) {
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

        // if (placeArrows[button.name]) placeArrows[button.name].addClass('arrowPlacePressed');
        if((this.player===1 && e.keyCode >= 65) || (this.player===2 && e.keyCode < 65)) return;
        //This is temp logic, waiting for key binding state. will pass in keybinding object for player


        if (placeArrows[dir]) {
            if (num === 37 || num === 40 || num === 38 || num === 39)
                placeArrows[dir+'P1'].addClass('arrowPlacePressed');
            else if (num === 65 || num === 87 || num === 83 || num === 68)
                placeArrows[dir+'P2'].addClass('arrowPlacePressed');
        }
        //figure out for 2 player

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
