app.factory('ToneFactory', function () {
    var ToneFactory = function (path, bpm, syncOffset, measureOffset) {
        this.path = path;
        this.bpm = bpm;
        this.syncOffset = syncOffset;
        this.measureOffset = measureOffset;
        this.player = new Tone.Player(this.path).toMaster();
        this.transport = Tone.Transport;

        this.transport.bpm.value = this.bpm;

        Tone.Buffer.onload = function () {
            console.log('Buffer loaded!');
        }
    }

    ToneFactory.prototype.start = function () {

        this.player.start(`+${this.syncOffset}`);
        this.transport.start(this.measureOffset, "0:0:0");
    }


    return ToneFactory;
})
