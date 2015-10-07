/* global Tone */

app.factory('ToneFactory', function (ArrowFactory) {
    var ToneFactory = function (path, bpm, offset, config) {

        this.config = config;
        this.path = path;
        this.bpm = bpm;
        this.syncOffset = config.ARROW_SPEED/bpm + Number(offset);
        this.player = new Tone.Player(this.path).toMaster();
        this.transport = Tone.Transport;
        this.transport.bpm.value = this.bpm;
        this.buffer = Tone.Buffer;

    }

    ToneFactory.prototype.start = function () {
        this.player.start(`+${this.syncOffset}`);
        // this.transport.start(this.measureOffset, "0:0:0");
    }

    var indexToDir = {
        0: 'left',
        1: 'down',
        2: 'up',
        3: 'right'
    }

    ToneFactory.prototype.timeCharts = function (stepChart, bpms, stops) {
        var bpm = this.bpm;
        var measureTime = this.config.MEASURE_TIME;    // number of seconds per measure
        var timeSoFar = this.syncOffset;
        var measureOffset = this.measureOffset*-1;
        console.log('measureTime:', measureTime);

        var obj = {
            right: [],
            left: [],
            up:[],
            down: []
        }


        stepChart.forEach(function (measure, measureIndex) {
            var notes = measure.length;
            var noteTime = measureTime / measure.length;
            measure.forEach(function (line, lineIndex) {
                var timeStamp = measureTime*measureIndex + noteTime*lineIndex + timeSoFar;
                line.forEach(function (maybeArrow, index) {
                    if (maybeArrow !== "0") { //FIX to account for freezes : D
                        var dir = ArrowFactory.indexToDir(index);
                        var arrow = new ArrowFactory(dir, 1);
                        arrow.animate(bpm, measureIndex, lineIndex, notes);
                        obj[indexToDir[index]].unshift({arrow: arrow, time: timeStamp, attempted: false });
                    }
                });
            });
        });

        console.log('arrow height offset',ArrowFactory.speed*4/bpm);
        stops.forEach(function(stop) {
            ArrowFactory.addStop(measureOffset + ((ArrowFactory.speed*4)/bpm) + (measureTime/4)*stop.beat, stop.duration);
        })
        bpms.forEach(function(bpmChange) {
            if (bpmChange.beat === 0) return;
            ArrowFactory.addBPMChange(measureOffset + ((ArrowFactory.speed*4)/bpm) + (measureTime/4)*bpmChange.beat, bpmChange.bpm/bpm);
        })


        return obj;
    };


    return ToneFactory;
})
