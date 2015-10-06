/*

How much can we outsource to this worker?
-- timing calculations for tap events
-- creation of timechart for arrows

*/

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
    console.log('offset', offset);
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

    console.log('here is de chart', chart);

};

var respondToKey = function (time, dir) {
    console.log('key timestamp', time, 'dir', dir);
    var thisChart = chart[dir];
    var lastOne = thisChart[thisChart.length - 1];
    while (lastOne && lastOne.time < time - TIMING_WINDOW) {
        thisChart.pop();
        lastOne = thisChart[thisChart.length - 1];
    }
    var diff = Math.abs(lastOne.time - time);
    if (diff < TIMING_WINDOW) {
        console.log('removing', dir, 'index', thisChart.length - 1, 'diff', diff);
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

















