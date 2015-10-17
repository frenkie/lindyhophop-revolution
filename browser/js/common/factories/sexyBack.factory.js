app.factory('SexyBackFactory', function () {

    var scene;

    function SexyBack() {
      if(!scene) throw Error("make a scene first");
    }

    SexyBack.init = function() {

        // attempt to create a material for the ocean effect
        // var material = new THREE.ShaderMaterial( {
        //
        //     uniforms: {
        //       time: { type: "f", value: 1.0 },
        //       resolution: { type: "v2", value: new THREE.Vector2() }
        //     },
        //     attributes: {
        //       vertexOpacity: { type: 'f', value: [] }
        //     },
        //     vertexShader: document.getElementById( 'vertexShader' ).textContent,
        //     fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        //
        // } );

        window.audio = new Audio();
        audio.src = '/audio/Sandstorm.mp3';
        audio.autoplay = true;
        audio.loop = true;

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

        // create a WebGL renderer
        var renderer = new THREE.WebGLRenderer();

        // get the DOM element to attach to - assume we've got jQuery to hand
        var $container = $('#landingPageAnimationContainer');
        $container.append(renderer.domElement);

        // var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        var camera = new THREE.OrthographicCamera( WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, -2000, 4000);

        scene = new THREE.Scene();
        scene.add(camera);

        camera.position.z = 500;
        camera.position.x = 0;
        camera.position.y = 300;

        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor( 0x2c3338, 1);

        var cubes = [];
        var groupCubes = new THREE.Object3D();
        var context = new AudioContext();
        var analyser = context.createAnalyser();
        var radius = 400;
        var angle = (2 * Math.PI)/numBars;
        var formations = [circleFormation, lineFormation];

        function circleFormation() {
            cubes.forEach(function(cube, i) {
                cube.position.x = radius * Math.sin(angle * i);
                cube.position.z = radius * Math.cos(angle * i);
            });
        }

        function lineFormation() {
            var numCubes = cubes.length;
            var cubeOffset = 20;
            cubes.forEach(function(cube, i) {
                var j = i - numCubes/2
                cube.position.x += j * cubeOffset;
            });
        };

        var makeCubes = function(numBars) {
            for(var i = 0; i < numBars; i++) {
              var geometry = new THREE.BoxGeometry( 5, 1, 5 );
              var material = new THREE.MeshBasicMaterial( {color: 0xea4c88} );
              var cube = new THREE.Mesh( geometry, material );
              groupCubes.add(cube)
              cubes.push(cube);
            }
            formations[Math.floor(Math.random() * formations.length)]();
            scene.add( groupCubes );
        }

        // make the cubes in the selected formations
        // then reposition the camera to look at the cubes
        makeCubes(numBars);
        camera.lookAt(groupCubes.position);

        function RenderScene() {

          var OFFSET = 100;
          var freqByteData = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(freqByteData);
          for (var i = 0; i < numBars; ++i) {
            var magnitude = freqByteData[i * 2 + OFFSET];
            cubes[i].scale.y = magnitude;
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

        // code for debugging => in the console type 'group' to see groupCubes
        window.group = groupCubes;
    };

    return SexyBack;
});

// create a point light
// var pointLight = new THREE.PointLight(0xFFFFFF);
//
// // set its position
// pointLight.position.x = 10;
// pointLight.position.y = 50;
// pointLight.position.z = 130;
//
// // add to the scene
// scene.add(pointLight);

// var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
// directionalLight.position.set( 0, 1, 0 );
// scene.add( directionalLight );
