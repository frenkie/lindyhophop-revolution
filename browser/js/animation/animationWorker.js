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
var oldChart = {
    right: [],
    left: [],
    up:[],
    down: []
};

var TIMING_WINDOW;

var getStopTime = function (thisBeat, stops) {
    return stops.reduce(function (time, stop) {
        if (thisBeat > stop.beat) {
            time += stop.duration;
        }
        return time;
    }, 0);
};

var getBPMTime = function (thisBeat, bpms) {
    // var currBPM = bpms[0];
    // var prevBPM = bpms[0];
    var addedTime = 0;
    for (var i = 1; thisBeat > bpms[i].beat; i++) {
        var oldBeatTime = 60 / bpms[i - 1].bpm;
        var newBeatTime = 60 / bpms[i].bpm;
        var timeAtBeatWithOldBPM = (thisBeat - bpms[i].beat) * oldBeatTime;
        var timeAtBeatWithNewBPM = (thisBeat - bpms[i].beat) * newBeatTime;
        addedTime += timeAtBeatWithNewBPM - timeAtBeatWithOldBPM;
    }
    return addedTime;
}


var preChart = function (stepChart, bpm, offset, timing, bpms, stops) {
    TIMING_WINDOW = timing;
    var measureTime = 1/(bpm/60/4);    // number of seconds per measure

    // stepChart.forEach(function (measure, measureIndex) {
    //     var notes = measure.length;
    //     var noteTime = measureTime / measure.length;
    //     measure.forEach(function (line, lineIndex) {
    //         var timeStamp = measureTime*measureIndex + noteTime*lineIndex + offset;
    //         var thisBeat = lineIndex / notes + measureIndex;
    //         timeStamp += getStopTime(thisBeat, stops);
    //         timeStamp += getBPMTime(thisBeat, bpms);
    //         line.forEach(function (maybeArrow, index) {
    //             if (maybeArrow !== "0") {
    //                 chart[indexToDir[index]].unshift({ time: timeStamp, attempted: false });
    //             }
    //         });
    //     });
    // });

    stepChart.forEach(function (measure, measureIndex) {
        var noteTime = measureTime / measure.length;
        measure.forEach(function (line, lineIndex) {
            var timeStamp = measureTime*measureIndex + noteTime*lineIndex + offset;
            line.forEach(function (maybeArrow, index) {
                if (maybeArrow !== "0") {
                    chart[indexToDir[index]].unshift({ time: timeStamp, attempted: false });
                }
            });
        });
    });

    // console.log('oldChart:', oldChart);
    // console.log('newChart:', chart);
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

self.onmessage = function (e) {
    if (e.data.type === 'preChart') {
        preChart(e.data.chart, e.data.bpm, e.data.offset, e.data.timing, e.data.bpms, e.data.stops);
    }
    else if (e.data.type === 'keyPress') {
        respondToKey(e.data.timeStamp, e.data.dir);
    }
};


