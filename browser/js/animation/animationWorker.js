var startTime = 0;
var indexToDir = {
  '0': 'left',
  '1': 'down',
  '2': 'up',
  '3': 'right'
};

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

var TIMING_WINDOW;

var checkArrow = function(arrowTime) {
  if(!arrowTime.hit) {
    postMessage({hit: false, index: arrowTime.index, dir: arrowTime.dir})
  }
}

var getStopTime = function (thisBeat, stops) {
    return stops.reduce(function (time, stop) {
        if (thisBeat > stop.beat) {
            time += stop.duration;
        }
        return time;
    }, 0);
};

var getBPMTime = function (thisBeat, bpms) {
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


var preChart = function (stepChart, bpm, offset, timing, bpms, stops) {
    TIMING_WINDOW = timing;
    var measureTime = 1/(bpm/60/4);    // number of seconds per measure

    stepChart.forEach(function (measure, measureIndex) {
        var notes = measure.length;
        var noteTime = measureTime / measure.length;
        measure.forEach(function (line, lineIndex) {
            var timeStamp = measureTime*measureIndex + noteTime*lineIndex + offset;
            var thisBeat = measureIndex * 4 + (lineIndex / notes) * 4;
            var stopTime = getStopTime(thisBeat, stops);
            var extraBPMTime = getBPMTime(thisBeat, bpms);
            timeStamp += stopTime + extraBPMTime;
            line.forEach(function (maybeArrow, index) {
                if (maybeArrow !== "0") {
                    var dir = indexToDir[index];
                    var arrowTime = {time: timeStamp, attempted: false , hit: false, dir};
                    var arrowIndex = chart[dir].list.push(arrowTime) - 1;
                    arrowTime.index = arrowIndex;
                    var thisTimeout = function() {
                        setTimeout(function () {
                            checkArrow(arrowTime);
                        }, (timeStamp + TIMING_WINDOW) * 1000)
                    };
                    timeouts.push(thisTimeout);
                }
            });
        });
    });

    console.log('chart is ready', chart);
};

var respondToKey = function (time, dir) {
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
        postMessage({dir, index: thisChart.pointer, hit: true})
    }
}

self.onmessage = function (e) {
    if (e.data.type === 'preChart') {
        preChart(e.data.chart, e.data.bpm, e.data.offset, e.data.timing, e.data.bpms, e.data.stops);
    }
    else if (e.data.type === 'keyPress') {
        respondToKey(e.data.timeStamp, e.data.dir);
    }
    else if (e.data.type === 'startTime') {
        startTime = e.data.startTime;
        timeouts.forEach(function(func) {
          func();
        })
    }
};
