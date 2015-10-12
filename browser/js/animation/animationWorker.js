var startTime = 0;
var indexToDir = {
    '0': 'left',
    '1': 'down',
    '2': 'up',
    '3': 'right'
};

var keysPressed = {
    up: false,
    right: false,
    down: false,
    left: false
}

var chart = {
    right: {
        list: [],
        pointer: 0
    },
    left: {
        list: [],
        pointer: 0
    },
    up: {
        list: [],
        pointer: 0
    },
    down: {
        list: [],
        pointer: 0
    }
};

var timeouts = [];

// add last timeout

var TIMING_WINDOW;


var getStopTime = function(thisBeat, stops) {
    return stops.reduce(function(time, stop) {
        if (thisBeat > stop.beat) {
            time += stop.duration;
        }
        return time;
    }, 0);
};

var getBPMTime = function(thisBeat, bpms) {
    var addedTime = 0;
    for (var i = 1; i < bpms.length && thisBeat > bpms[i].beat; i++) {
        var oldBeatTime = 60 / bpms[i - 1].bpm;
        var newBeatTime = 60 / bpms[i].bpm;
        var timeAtBeatWithOldBPM = (thisBeat - bpms[i].beat) * oldBeatTime;
        var timeAtBeatWithNewBPM = (thisBeat - bpms[i].beat) * newBeatTime;
        addedTime += timeAtBeatWithNewBPM - timeAtBeatWithOldBPM;
    }
    return addedTime;
}

var inFreeze = {
    left: {
        freeze: false,
        fromArrow: null,
    },
    down: {
        freeze: false,
        fromArrow: null,
    },
    up: {
        freeze: false,
        fromArrow: null,
    },
    right: {
        freeze: false,
        fromArrow: null,
    }
}

var checkArrow = function(arrowTime) {
    if (!arrowTime.hit) {
        postMessage({
            hit: false,
            index: arrowTime.index,
            dir: arrowTime.dir
        })
    }
    if (arrowTime.freezeUp) {
        postMessage({
            freezeUp: true,
            dir: arrowTime.dir,
            index: arrowTime.index
        });
        inFreeze[arrowTime.dir].freeze = false;
    }
}

var preChart = function(stepChart, bpm, arrowOffset, songOffset, timing, bpms, stops) {
    TIMING_WINDOW = timing;
    var measureTime = 1 / (bpm / 60 / 4); // number of seconds per measure

    stepChart.forEach(function(measure, measureIndex) {
        var notes = measure.length;
        var noteTime = measureTime / measure.length;
        measure.forEach(function(line, lineIndex) {
            var timeStamp = measureTime * measureIndex + noteTime * lineIndex + arrowOffset;
            var thisBeat = measureIndex * 4 + (lineIndex / notes) * 4;
            var stopTime = getStopTime(thisBeat, stops);
            var extraBPMTime = getBPMTime(thisBeat, bpms);
            timeStamp += stopTime + extraBPMTime;
            line.forEach(function(maybeArrow, index) {
                var arrowTime,
                    thisTimeout;
                if (maybeArrow === "1" || maybeArrow === "2") {
                    arrowTime = {
                        dir: indexToDir[index],
                        time: timeStamp,
                        attempted: false,
                        hit: false,
                        // this 'freeze' property is used to turn on the freeze eater (fader opaque) on a successful keypress
                        // at the top of a freeze arrow
                        freeze: maybeArrow === "2" ? true : false,
                    };
                    var arrowIndex = chart[indexToDir[index]].list.push(arrowTime) - 1;
                    arrowTime.index = arrowIndex;
                    // this stores a reference to the arrow with the additional freeze div, used at number 3 to signal freeze div removal
                    if (maybeArrow === "2") inFreeze[indexToDir[index]].fromArrow = arrowIndex;
                    thisTimeout = function() {
                        setTimeout(function() {
                            checkArrow(arrowTime);
                        }, (timeStamp + TIMING_WINDOW - songOffset) * 1000)
                    };
                    timeouts.push(thisTimeout);
                } else if (maybeArrow === "3") {
                    arrowTime = {
                        dir: indexToDir[index],
                        time: timeStamp,
                        freezeUp: true,
                        // signal to checkArrow to specify which arrow to remove freeze from
                        index: inFreeze[indexToDir[index]].fromArrow
                    };
                    thisTimeout = function() {
                        setTimeout(function() {
                            checkArrow(arrowTime);
                        }, (timeStamp - songOffset) * 1000)
                    };
                    timeouts.push(thisTimeout);
                }

            });
        });
    });

    console.log('chart is ready', chart);
};

// checks on keyup whether we were in a freeze at that dir or not
var checkIfFreeze = function (dir) {
    if (inFreeze[dir].freeze) {
        postMessage({
            dir,
            brokeFreeze: true
        })
    }
}

var respondToKey = function(time, dir) {
    var thisChart = chart[dir];
    if (thisChart.pointer === thisChart.list.length) return;
    var nextOne = thisChart.list[thisChart.pointer];
    while (nextOne.time < time - TIMING_WINDOW) {
        thisChart.pointer++;
        nextOne = thisChart.list[thisChart.pointer];
    }
    var diff = Math.abs(nextOne.time - time);
    if (diff < TIMING_WINDOW) {
        nextOne.hit = true;
        postMessage({
            dir,
            index: thisChart.pointer,
            hit: true,
            freeze: nextOne.freeze,
            diff: diff
        });
        if (nextOne.freeze) inFreeze[dir].freeze = true;
    }
}

self.onmessage = function(e) {
    if (e.data.type === 'preChart') {
        preChart(e.data.chart, e.data.bpm, e.data.arrowOffset, e.data.songOffset, e.data.timing, e.data.bpms, e.data.stops);
    } else if (e.data.type === 'keyDown') {
        respondToKey(e.data.timeStamp, e.data.dir);
        keysPressed[e.data.dir] = true;
    } else if (e.data.type === 'startTime') {
        startTime = e.data.startTime;
        timeouts.forEach(function(func) {
            func();
        })
    } else if (e.data.type === 'keyUp') {
        checkIfFreeze(e.data.dir);
    }
};
