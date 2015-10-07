/* global $ TweenMax */


app.factory('ArrowFactory', function () {
    var Arrow = function (direction, player, color) {
        this.direction = direction;
        // this.el = $(`<div class="arrow"></div>`);
        this.el = $(`<div class="arrow"><img src="/img/${direction}-${color}.png"></img></div>`);
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

    Arrow.addStops = function (stops, animationOffset, beatTime) {
        stops.forEach(stop => {
            this.addStop(animationOffset + beatTime * stop.beat, stop.duration);
        })
    }

    Arrow.addBpmChanges = function (bpms, animationOffset, beatTime) {
        bpms.forEach(bpm => {
            if (bpm.beat === 0) return;
            this.addBPMChange(animationOffset + beatTime * bpm.beat, bpm.duration);
        })
    }

    // ArrowFactory.addStops(currentSong.stops, config.ARROW_TIME + currentSong.offset);
    // ArrowFactory.addBpmChanges(currentSong.bpms, config.ARROW_TIME + currentSong.offset);

    // console.log('arrow height offset',ArrowFactory.speed*4/bpm);
    //     stops.forEach(function(stop) {
    //         ArrowFactory.addStop(measureOffset + ((ArrowFactory.speed*4)/bpm) + (measureTime/4)*stop.beat, stop.duration);
    //     })
    //     bpms.forEach(function(bpmChange) {
    //         if (bpmChange.beat === 0) return;
    //         ArrowFactory.addBPMChange(measureOffset + ((ArrowFactory.speed*4)/bpm) + (measureTime/4)*bpmChange.beat, bpmChange.bpm/bpm);
    //     })


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
    var indexToDir = {
      '0': 'left',
      '1': 'down',
      '2': 'up',
      '3': 'right'
    };


    Arrow.makeArrows = function (stepChart, bpm) {

        var obj = {
            right: [],
            left: [],
            up:[],
            down: []
        }
        stepChart.forEach(function (measure, measureIndex) {
            var notes = measure.length;
            measure.forEach(function (line, lineIndex) {
                line.forEach(function (maybeArrow, index) {
                    if (maybeArrow !== "0") { //FIX to account for freezes : D
                        var dir = Arrow.indexToDir(index);
                        var color;
                        var thing = lineIndex / notes * 16;
                        if (thing % 4 === 0) {
                            color = 'purple';
                        } else if (thing % 2 === 0) {
                            color = 'orange';
                        } else {
                            color = 'red';
                        }
                        var arrow = new Arrow(dir, 1, color);
                        arrow.animate(bpm, measureIndex, lineIndex, notes);
                        obj[indexToDir[index]].unshift(arrow);
                    }
                });
            });
        });

        Arrow.ARROW_KEYS = {
          left: '37',
          down: '40',
          up: '38',
          right: '39'
        };


        return obj;
    };

    return Arrow;

})
