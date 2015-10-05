app.config(function ($stateProvider) {

    $stateProvider.state('chooseSong', {
        url: '/chooseSong',
        templateUrl: 'js/chooseSong/chooseSong.html',
        controller: 'ChooseSongCtrl'
    });

});

app.controller('ChooseSongCtrl', function ($scope, AuthService, $state) {
    console.log("hey Kim")
    // set and cache variables
		$scope.w;
    $scope.container;
    $scope.carousel;
    $scope.item;
    $scope.radius;
    $scope.itemLength;
    $scope.rY;
    $scope.ticker;
    $scope.fps;
		$scope.mouseX = 0;
		$scope.mouseY = 0;
		$scope.mouseZ = 0;
		$scope.addX = 0;


		// fps counter created by: https://gist.github.com/sharkbrainguy/1156092,
		// no need to create my own :)
		$scope.fps_counter = {

			tick: function ()
			{
				// this has to clone the array every tick so that
				// separate instances won't share state
				this.times = this.times.concat(+new Date());
				var seconds, times = this.times;

				if (times.length > this.span + 1)
				{
					times.shift(); // ditch the oldest time
					seconds = (times[times.length - 1] - times[0]) / 1000;
					return Math.round(this.span / seconds);
				}
				else return null;
			},

			times: [],
			span: 20
		};
		$scope.counter = Object.create($scope.fps_counter);



		// $(document).ready( $scope.init )

		$scope.init = function()
		{
			$scope.w = $(window);
			$scope.container = $( '#contentContainer' );
			$scope.carousel = $( '#carouselContainer' );
			$scope.item = $( '.carouselItem' );
			$scope.itemLength = $( '.carouselItem' ).length;
			$scope.fps = $('#fps');
			$scope.rY = 360 / $scope.itemLength;
			$scope.radius = Math.round( (250) / Math.tan( Math.PI / $scope.itemLength ) );

			// set $scope.container 3d props
			TweenMax.set($scope.container, {perspective:600})
			TweenMax.set($scope.carousel, {z:-($scope.radius)})

			// create carousel $scope.item props

			for ( var i = 0; i < $scope.itemLength; i++ )
			{
        console.log("this is the scope.item.eq: ", $scope.item.eq(i))
				var $item = $scope.item.eq(i);
				var $block = $item.find('.carouselItemInner');
        console.log("this is the block: ", $block)

        //thanks @chrisgannon!
        TweenMax.set($item, {rotationY:$scope.rY * i, z:$scope.radius, transformOrigin:"50% 50% " + -$scope.radius + "px"});

				$scope.animateIn( $item, $block )
			}

			// set mouse x and y props and looper $scope.ticker
			window.addEventListener( "mousemove", $scope.onMouseMove, false );
			$scope.ticker = setInterval( $scope.looper, 1000/60 );
		}

		$scope.animateIn = function( $item, $block )
		{
			var $nrX = 360 * $scope.getRandomInt(2);
			var $nrY = 360 * $scope.getRandomInt(2);

			var $nx = -(2000) + $scope.getRandomInt( 4000 )
			var $ny = -(2000) + $scope.getRandomInt( 4000 )
			var $nz = -4000 +  $scope.getRandomInt( 4000 )

			var $s = 1.5 + ($scope.getRandomInt( 10 ) * .1)
			var $d = 1 - ($scope.getRandomInt( 8 ) * .1)

			TweenMax.set( $item, { autoAlpha:1, delay:$d } )
			TweenMax.set( $block, { z:$nz, rotationY:$nrY, rotationX:$nrX, x:$nx, y:$ny, autoAlpha:0} )
			TweenMax.to( $block, $s, { delay:$d, rotationY:0, rotationX:0, z:0,  ease:Expo.easeInOut} )
			TweenMax.to( $block, $s-.5, { delay:$d, x:0, y:0, autoAlpha:1, ease:Expo.easeInOut} )
		}

		$scope.onMouseMove = function(event)
		{
			$scope.mouseX = -(-(window.innerWidth * .5) + event.pageX) * .0025;
			$scope.mouseY = -(-(window.innerHeight * .5) + event.pageY ) * .01;
			$scope.mouseZ = -($scope.radius) - (Math.abs(-(window.innerHeight * .5) + event.pageY ) - 200);
		}

		// loops and sets the carousel 3d properties
		$scope.looper = function()
		{
			$scope.addX += $scope.mouseX
			TweenMax.to( $scope.carousel, 1, { rotationY:$scope.addX, rotationX:$scope.mouseY, ease:Quint.easeOut } )
			TweenMax.set( $scope.carousel, {z:$scope.mouseZ } )
			$scope.fps.text( 'Framerate: ' + $scope.counter.tick() + '/60 FPS' )
		}

		$scope.getRandomInt = function( $n )
		{
			return Math.floor((Math.random()*$n)+1);
		}
    $scope.init();
});
