app.factory('SexyBackFactory', function () {

    var scene;

    function SexyBack() {
      if(!scene) throw Error("make a scene first");
    }

    SexyBack.init = function() {
        // set the scene size
        var WIDTH = window.outerWidth,
          HEIGHT = window.outerHeight;

        //set the number of bars that can fit on the screen
        var numBars = 50;

        // set some camera attributes
        var VIEW_ANGLE = 80,
          ASPECT = WIDTH/ HEIGHT,
          NEAR = 0.1,
          FAR = 10000;

        // get the DOM element to attach to
        // - assume we've got jQuery to hand
        var $container = $('#outerContainer');

        // create a WebGL renderer, camera
        // and a scene
        var renderer = new THREE.WebGLRenderer();
        // var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        var camera = new THREE.OrthographicCamera( WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, -2000, 4000);

        scene = new THREE.Scene();

        // add the camera to the scene
        scene.add(camera);

        // the camera starts at 0,0,0
        // so pull it back
        camera.position.z = 500;
        camera.position.x = 0;
        camera.position.y = 200;

        // start the renderer
        renderer.setSize(WIDTH, HEIGHT);
        // setClearColor below is used to set the background of the threeJS canvas to be white
        renderer.setClearColor( 0x2c3338, 1);

        // attach the render-supplied DOM element
        $container.append(renderer.domElement);

        // // create a point light
        // var pointLight = new THREE.PointLight(0xFFFFFF);
        //
        // // set its position
        // pointLight.position.x = 10;
        // pointLight.position.y = 50;
        // pointLight.position.z = 130;
        //
        // // add to the scene
        // scene.add(pointLight);

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        directionalLight.position.set( 0, 1, 0 );
        scene.add( directionalLight );

        window.audio = new Audio();
        audio.src = '/audio/Sandstorm.mp3';
        // audio.controls = true;
        // audio.defaultMuted = true;
        audio.autoplay = true;
        audio.loop = true;
        var cubes = [];
        var groupCubes;
        var context = new AudioContext();
        var analyser = context.createAnalyser();
        var radius = 400;
        var angle = (2 * Math.PI)/numBars;
        makeCubes(numBars);
        camera.lookAt(groupCubes.position);

        function makeCubes(numBars) {
            groupCubes = new THREE.Object3D();
            for(var i = 0; i < numBars; i++) {
              var geometry = new THREE.BoxGeometry( 5, 1, 5 );
              var material = new THREE.MeshBasicMaterial( {color: 0xea4c88} );
              var cube = new THREE.Mesh( geometry, material );
              console.log(cube)
              groupCubes.add(cube)
              cube.castShadow = true;
              cube.position.x = radius * Math.sin(angle * i)
              cube.position.z = radius * Math.cos(angle * i)
              console.log(angle);
              // cube.position.x += i * 20;
              cubes.push(cube);
            }
            scene.add( groupCubes );
        }

        window.group = groupCubes;


        function RenderScene() {

          var OFFSET = 100;
          var freqByteData = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(freqByteData);
          for (var i = 0; i < numBars; ++i) {
            var magnitude = freqByteData[i * 2 + OFFSET];

            cubes[i].scale.y = magnitude * 1;
            cubes[i].position.y = magnitude / 2;
          };

          // groupCubes.rotation.x += 0.01;
          groupCubes.rotation.y -= 0.001;
          // groupCubes.rotation.z -= 0.01;

          // camera.rotation.x -= 0.015;
          // camera.updateProjectionMatrix();

          // draw!
          renderer.render(scene, camera);
          window.requestAnimationFrame(RenderScene);
        };

        (function onLoad(e) {
            var source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);
            RenderScene();
        })();

    };

    return SexyBack;
});
