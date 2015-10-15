app.factory('SexyBackFactory', function () {

    var scene;
    var tl2;
    // set up the sphere vars
    var radius = 50,
        segments = 16,
        rings = 16;

    var sphereMaterial = new THREE.MeshLambertMaterial(
        {
          color: 0xFF3399
        });

    var SexyBack = function() {
      if(!scene) throw Error("make a scene first");
      this.sphere = new THREE.Mesh(new THREE.SphereGeometry(radius,segments,rings),sphereMaterial);
      scene.add(this.sphere);
    }

    SexyBack.init = function() {
        // set the scene size
        var WIDTH = window.outerWidth,
          HEIGHT = window.outerHeight;

        // set some camera attributes
        var VIEW_ANGLE = 45,
          ASPECT = WIDTH / HEIGHT,
          NEAR = 0.1,
          FAR = 10000;

        // get the DOM element to attach to
        // - assume we've got jQuery to hand
        var $container = $('#outerContainer');

        // create a WebGL renderer, camera
        // and a scene
        var renderer = new THREE.WebGLRenderer();
        var camera =
          new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);

        scene = new THREE.Scene();

        // add the camera to the scene
        scene.add(camera);

        // the camera starts at 0,0,0
        // so pull it back
        camera.position.z = 500;

        // start the renderer
        renderer.setSize(WIDTH, HEIGHT);
        // setClearColor below is used to set the background of the threeJS canvas to be white
        // renderer.setClearColor( 0xffffff, 1);

        // attach the render-supplied DOM element
        $container.append(renderer.domElement);

        // add the sphere to the scene
        // scene.add(sphere);

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

        // // Setup a timeline object with 0.2s stagger. Also reverse on complete.
        // var tl2 = new TimelineLite({ onComplete:reverse }),
        //     tweens = [];
        //
        // var geometry = new THREE.BoxGeometry( 50, 50, 50 );
        // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        // // Create 10 objects to tween.
        // for(var i=0; i < 10; i++) {
        //
        //   // Create a mesh and add to three.js scene
        //   var mesh = new THREE.Mesh( geometry, material );
        //   scene.add( mesh );
        //
        //   // Push our tween on to an array for later.
        //   tweens.push( TweenLite.to(mesh.rotation, 2, {
        //     y: -Math.PI,
        //     ease: Bounce.easeOut})
        //   );
        // }
        //
        // // Insert our tweens. The sequence will auto start, and stagger with a 0.2s delay in between.
        // tl2.insertMultiple(tweens, 0, 'start', 0.2);
        //
        // // Reverse the timeline when complete.
        // function reverse() {
        //   tl2.reverse();
        // }

        function RenderScene() {
          // draw!
          renderer.render(scene, camera);
          window.requestAnimationFrame(RenderScene);
        };

        RenderScene();
    };

    SexyBack.resumeTimeline = function () {
        tl2.resume();
    };

    SexyBack.makeTimeline = function () {
        tl2 = new TimelineLite();
        tl2.pause();
        // TweenMax.delayedCall(0, TweenMax.globalTimeScale, [1])
    };

    SexyBack.prototype.animate = function (bpm, chIndex, mIndex, mNotes) {
        if (!tl2) throw Error('Make a timeline first');
        var animationLength = 400/bpm;
        var measureTime = 240 / bpm;
        var timePerBeat = measureTime / mNotes;
        var startTime = chIndex * measureTime + mIndex * timePerBeat;
        tl2.to(this.sphere.scale, 0.02, {x: Math.random() * 3, y: Math.random() * 3}, startTime + animationLength);
    }

    SexyBack.addStops = function (stops, animationOffset, beatTime) {
        stops.forEach(stop => {
            this.addStop(animationOffset + beatTime * stop.beat, stop.duration);
        })
    }

    SexyBack.addBpmChanges = function (bpms, animationOffset, beatTime) {
        bpms.forEach(bpm => {
            if (bpm.beat === 0) return;
            this.addBPMChange(animationOffset + beatTime * bpm.beat, bpm.bpm/bpms[0].bpm);
        })
    }

    SexyBack.addStop = function(timestamp, duration) {
        tl2.addPause(timestamp, TweenMax.delayedCall, [duration, function(){tl2.play()}]);
    }

    SexyBack.addBPMChange = function(timestamp, tempoScale) {
        tl2.add(function () {
            tl2.timeScale(tempoScale);
        }, timestamp);
    }

    SexyBack.makeShapes = function (stepChart, bpm, config, currentSong) {

        SexyBack.makeTimeline();
        var shape = new SexyBack();
        console.log("SHAPE: ", shape)
        stepChart.forEach(function (measure, measureIndex) {
            var notes = measure.length;
            if(measureIndex < 3) return;
            measure.forEach(function (line, lineIndex) {
                line.forEach(function (maybeShape, index) {
                    var dir = indexToDir[index];
                    var thisBeat = measureIndex * 4 + (lineIndex / notes) * 4;
                    // if (maybeShape === "1" || maybeShape === "2") {
                    //     var color;
                    //     var note = lineIndex / notes;
                    //
                    //     var shape;
                    //     if (maybeShape === "1") {
                    //         shape = new SexyBack();
                    //     } else if (maybeShape === "2") {
                    //         shape = new SexyBack();
                    //     }
                    // }
                    shape.animate(bpm, measureIndex, lineIndex, notes);
                    // else if (maybeShape === "3") {
                    //     var length = config.BEAT_VH * (thisBeat - freezes[dir].firstBeat);
                    //     freezes[dir].arrow.el[0].children[1].style.height = `${length}vh`;
                    // }
                });
            });
        });

        SexyBack.addStops(currentSong.stops, config.ARROW_TIME, config.BEAT_TIME);
        SexyBack.addBpmChanges(currentSong.bpms, config.ARROW_TIME, config.BEAT_TIME, currentSong.stops);

    };

    return SexyBack;
});
