/*global PIXI*/

app.config(function ($stateProvider) {
    $stateProvider.state('pixi', {
        url: '/pixi',
        templateUrl: '/js/pixi/pixi.html',
        controller: function () {
            var container = new PIXI.Container();
            var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
            renderer.backgroundColor = 0xDDDDDD;

            document.body.appendChild(renderer.view);

            var texture = PIXI.Texture.fromImage("/img/left.svg");

            var up = new PIXI.Sprite(texture);
            var right = new PIXI.Sprite(texture);
            var down = new PIXI.Sprite(texture);
            var left = new PIXI.Sprite(texture);
            up.rotation += Math.PI/2;
            right.rotation += Math.PI;
            down.rotation -= Math.PI/2;

            var arrows = [left, down, up, right];

            arrows.forEach(function (arrow, index) {
                arrow.height = 100;
                arrow.width = 100;
                arrow.anchor.x = 0.5;
                arrow.anchor.y = 0.5;
                arrow.position.x = 200 + index * 120;
                arrow.position.y = 80;
                container.addChild(arrow);
            })

            // for (var i = 0; i < 5; i++) {
            //     var arrow = new PIXI.Sprite(texture);
            //     upArrows.push()

            // }



            window.container = container;
            // container.alpha = 0;


            function animate() {
                requestAnimationFrame(animate);

                up.position.x += 1;
                up.position.y += 1;


                renderer.render(container);
            }

            requestAnimationFrame(animate);

        }
    });
});
