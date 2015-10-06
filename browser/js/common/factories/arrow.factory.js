app.factory('ArrowFactory', function () {
    var Arrow = function (direction, player) {
        this.direction = direction;
        // this.el = $(`<div class="arrow"></div>`);
        this.el = $(`<div class="arrow"><img src="/img/${direction}.svg"></img></div>`);
        $(`.player-${player} .${direction}-arrow-col`).append(this.el);
    };

    var tl;

    Arrow.makeTimeline = function (params) {
        if (!tl) tl = new TimelineLite(params);
        tl.pause();
    window.tl = tl;

    };

    Arrow.resumeTimeline = function () {
        tl.resume();
    }

    Arrow.prototype.animate = function (bpm, chIndex, mIndex, mNotes) {
        if (!tl) throw Error('Make a timeline first');
        var animationLength = (130 * 4)/bpm;
        var measureTime = 240 / bpm;
        var timePerBeat = measureTime / mNotes;
        var startTime = chIndex * measureTime + mIndex * timePerBeat;
        this.startTime = startTime;
        console.log('animationLength is', animationLength);
        tl.to(this.el, animationLength * 1.5, {top: '-50vh', ease:Linear.easeNone}, startTime);
        // .to(this.el, animationLength/2, {top: '-50vh', ease:Linear.easeNone}, startTime);
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
                        var arrow = new Arrow(dir, 1);
                        arrow.animate(bpm, measureIndex, lineIndex, notes);
                        obj[indexToDir[index]].unshift(arrow);
                    }
                });
            });
        });

        return obj;
    };

    Arrow.ARROW_KEYS = {
      left: '37',
      down: '40',
      up: '38',
      right: '39'
    };

    return Arrow;
})
