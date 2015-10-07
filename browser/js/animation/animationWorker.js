/* global onmessage */

var indexToDir = {
  '0': 'left',
  '1': 'down',
  '2': 'up',
  '3': 'right'
};

var chart = {
    right: [],
    left: [],
    up:[],
    down: []
};

var TIMING_WINDOW;

var preChart = function (stepChart, bpm, offset, timing) {
    TIMING_WINDOW = timing;
    var measureTime = 1/(bpm/60/4);    // number of seconds per measure

    stepChart.forEach(function (measure, measureIndex) {
        var noteTime = measureTime / measure.length;
        measure.forEach(function (line, lineIndex) {
            var timeStamp = measureTime*measureIndex + noteTime*lineIndex + offset;
            line.forEach(function (maybeArrow, index) {
                if (maybeArrow !== "0") { //FIX to account for freezes : D
                    chart[indexToDir[index]].unshift({ time: timeStamp, attempted: false });
                }
            });
        });
    });
};

var respondToKey = function (time, dir) {
    var thisChart = chart[dir];
    var lastOne = thisChart[thisChart.length - 1];
    while (lastOne && lastOne.time < time - TIMING_WINDOW) {
        thisChart.pop();
        lastOne = thisChart[thisChart.length - 1];
    }
    var diff = Math.abs(lastOne.time - time);
    if (diff < TIMING_WINDOW) {
        postMessage({dir, index: thisChart.length - 1})
    }
}

onmessage = function (e) {
    if (e.data.type === 'preChart') {
        preChart(e.data.chart, e.data.bpm, e.data.offset, e.data.timing);
    }
    else if (e.data.type === 'keyPress') {
        respondToKey(e.data.timeStamp, e.data.dir);
    }
};


