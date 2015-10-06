app.factory('ArrowFactory', function () {
    var Arrow = function (direction, player) {
        this.direction = direction;
        // this.el = $(`<div class="arrow"></div>`);
        this.el = $(`<div class="arrow"><img src="/img/${direction}.svg"></img></div>`);
        $(`.player-${player} .${direction}-arrow-col`).append(this.el);
    };

    var tl;

    /** Arrow constants */
    Arrow.SPEED_1X = 100;
    /** */





    /** Arrow settings (chosen by the player) */
    Arrow.speedModifier = 1;
    /** */

    Arrow.speed = Arrow.SPEED_1X / Arrow.speedModifier;

    Arrow.makeTimeline = function (params) {
        if (!tl) tl = new TimelineLite(params);
        tl.pause();
        TweenMax.delayedCall(0, TweenMax.globalTimeScale, [1])
    };

    Arrow.resumeTimeline = function () {
        tl.resume();
    }

    Arrow.prototype.animate = function (bpm, chIndex, mIndex, mNotes) {
        if (!tl) throw Error('Make a timeline first');
        var animationLength = (Arrow.speed * 4)/bpm;
        var measureTime = 240 / bpm;
        var timePerBeat = measureTime / mNotes;
        var startTime = chIndex * measureTime + mIndex * timePerBeat;
        this.startTime = startTime;
        //console.log('animationLength is', animationLength);
        //console.log('measureTime is ',measureTime)
        tl.to(this.el, animationLength * 1.5, {top: '-50vh', ease:Linear.easeNone}, startTime);
    }

    Arrow.addStop = function(timestamp, duration) {
        tl.addPause(timestamp, TweenMax.delayedCall, [duration, function(){tl.play()}]);
        console.log('paused at',timestamp);
    }

    Arrow.addBPMChange = function(timestamp, tempoScale) {
        console.log(`bpm changed by ${tempoScale} times at ${timestamp}`);
        TweenMax.delayedCall(timestamp, TweenMax.globalTimeScale, [tempoScale]);
    }


    Arrow.indexToDir = function (n) {
        var dict = {
            0: 'left',
            1: 'down',
            2: 'up',
            3: 'right'
        }
        return dict[n]
    }

    Arrow.ARROW_KEYS = {
      left: '37',
      down: '40',
      up: '38',
      right: '39'
    };

    return Arrow;
})
