app.config(function ($stateProvider) {

    $stateProvider.state('tonestuff', {
        url: '/tonestuff',
        templateUrl: 'js/tonestuff/tonestuff.html',
        controller: 'ToneStuffCtrl'
    });

});


app.controller('ToneStuffCtrl', function ($scope) {


var player = new Tone.Player("/audio/321 STARS.mp3").toMaster();
      Tone.Buffer.onload = function () {
        player.start();
        Tone.Transport.start(".6724", "1:0:0");
      }

      Tone.Transport.bpm.value = 191.940;

      // document.body.style['background-color'] = "blue";
      var count = 3;

      Tone.Transport.setInterval(function(time){
        document.body.innerHTML = '';
        var str = {
            //0: '<span style="color: red;">.</span>|||',
            0: ".|||",
            1: "|.||",
            2: "||.|",
            3: "|||."
        };
        document.body.innerHTML = "<h1>" + str[count % 4] + "</h1>";
        count++;
        // console.log(time);
    }, "4n");
      // Tone.Transport.setTimeline(function (time) {
      //   document.body.style['background-color'] = "blue"
      //   console.log(time);
      // }, "5:0:0");

});