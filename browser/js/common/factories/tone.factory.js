/* global Tone */

app.factory('ToneFactory', function ($q) {
    var ToneFactory = function (path, bpm, offset, config, startTime, length) {

        this.config = config;
        this.path = path;
        this.bpm = bpm;
        this.syncOffset = config ? config.ARROW_SPEED/bpm + parseFloat(offset) : offset;
        this.player = new Tone.Player(this.path).toMaster();
        this.transport = Tone.Transport;
        this.transport.bpm.value = this.bpm;
        this.buffer = Tone.Buffer;
        this.startTime = startTime;
        this.length = length;

        this.preview = new Tone.Player({
            url: this.path,
            loop: true,
            loopStart: this.startTime || 0,
            loopEnd: (this.startTime || 0) + (length || 12)
        }).toMaster();

    }

    ToneFactory.prototype.start = function () {
        this.player.start(`+${this.syncOffset}`);
        // this.transport.start(this.measureOffset, "0:0:0");
    }

    ToneFactory.prototype.stop = function () {
        this.player.stop();
    }

    ToneFactory.play = function (fx) {
      var audio = new Audio(`/audio/soundEffects/${fx}.mp3`);
      audio.play();
    };

    ToneFactory.prototype.previewStart = function() {
        var self = this;
        Tone.Buffer.onload = function() {
            self.preview.start();
        }
    }
    ToneFactory.prototype.previewStop = function() {
        this.preview.stop();
    }

    ToneFactory.prototype.tonePromise = $q(function(resolve, reject) {
        var bufferLoaded = false;
        console.log('in promise');
        Tone.Buffer.onload = function () {
            bufferLoaded = true;
            console.log('tone resolved and buffer loaded');
            resolve();
        };
                
    });
    

    return ToneFactory;
})
