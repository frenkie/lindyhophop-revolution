app.config(function($stateProvider) {

    $stateProvider.state('tonestuff', {
        url: '/tonestuff',
        templateUrl: 'js/tonestuff/tonestuff.html',
        controller: 'ToneStuffCtrl'
    });

});


app.controller('ToneStuffCtrl', function($scope) {

  var str = {
      0: ".|||",
      1: "|.||",
      2: "||.|",
      3: "|||."
  };

    $scope.metronome = str[0];

    var player = new Tone.Player("/audio/Sandstorm.mp3").toMaster();
    Tone.Buffer.onload = function() {
        player.start();
        Tone.Transport.start(".979", "0:0:0");
    }

    Tone.Transport.bpm.value = 136.34;

    // document.body.style['background-color'] = "blue";
    var count = 0;

    Tone.Transport.setInterval(function(time) {
        // document.body.innerHTML = '';

        // document.body.innerHTML = "<h1>" + str[count % 4] + "</h1>";
        $scope.metronome = str[count % 4];
        count++;
        // console.log(time);
    }, "4n");
    // Tone.Transport.setTimeline(function (time) {
    //   document.body.style['background-color'] = "blue"
    //   console.log(time);
    // }, "5:0:0");

});
