app.factory('FreqOpacAnimFactory', function () {

    function init(numBars, $gameplayContainer, tone) {
        var childDivs = $gameplayContainer[0].children;
        var context2 = tone.player._source.context;
        var audioBufferSourceNode = tone.player._source;
        var analyser2 = context2.createAnalyser();

        function RenderDivScene() {

          var OFFSET = 100;
          var freqByteData = new Uint8Array(analyser2.frequencyBinCount);
          analyser2.getByteFrequencyData(freqByteData);
          for (var i = 0; i < childDivs.length; ++i) {
            var maxMag = 200;
            var magnitude = 100 - ((freqByteData[i * 2 + OFFSET]) / maxMag * 100);
            childDivs[i].style.height = `${magnitude}%`;
          };
          setTimeout(function() {
            RenderDivScene();
          }, 50)
        };

        (function () {
            audioBufferSourceNode.connect(analyser2);
            analyser2.connect(context2.destination);
            RenderDivScene();
        })();
    }

    return { init };

});
