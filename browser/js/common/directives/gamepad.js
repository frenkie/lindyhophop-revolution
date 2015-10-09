/* global Gamepads */

app.directive('gamepad', function () {
    return {
        restrict: 'EA',
        link: function () {
            if (window.gamepads) return;

            var gamepadConfig = {
                axisThreshold: 0,
                indices: {
                    'standard': {
                        up: 12,
                        left: 14,
                        down: 13,
                        right: 15,
                        enter: 1,
                        back: 0,
                        start: 9,
                        select: 8
                    }
                }
            };

            var gamepads = new Gamepads(gamepadConfig);

            gamepads.keyEvents = {
                up: {
                    detail: {
                        key: 'Up Arrow',
                        keyCode: 38
                    }
                },
                left: {
                    detail: {
                        key: 'Left Arrow',
                        keyCode: 37
                    }
                },
                down: {
                    detail: {
                        key: 'Down Arrow',
                        keyCode: 40
                    }
                },
                right: {
                    detail: {
                        key: 'Right Arrow',
                        keyCode: 39
                    }
                },
                enter: {
                    detail: {
                        key: 'Enter',
                        keyCode: 13
                    }
                },
                back: {
                    detail: {
                        key: 'Escape',
                        keyCode: 27
                    }
                },
                start: {
                    detail: {
                        key: 'Number 1',
                        keyCode: 49
                    }
                },
                select: {
                    detail: {
                        key: 'Number 2',
                        keyCode: 50
                    }
                }
            }

            gamepads.polling = false;

            if (gamepads.gamepadsSupported) {
                gamepads.updateStatus = function () {
                    gamepads.polling = true;
                    gamepads.update();
                    window.requestAnimationFrame(gamepads.updateStatus);
                };

                gamepads.cancelLoop = function () {
                    gamepads.polling = false;

                    if (gamepads.pollingInterval) {
                        window.clearInterval(gamepads.pollingInterval);
                    }

                    window.cancelAnimationFrame(gamepads.updateStatus);
                };

                window.addEventListener('gamepadconnected', function () {
                    console.log('Gamepad is connected');
                });

                // At the time of this writing, Firefox is the only browser that correctly
                // fires the `gamepadconnected` event. For the other browsers
                // <https://crbug.com/344556>, we start polling every 100ms until the
                // first gamepad is connected.
                if (Gamepads.utils.browser !== 'firefox') {
                    gamepads.pollingInterval = window.setInterval(function () {
                        if (gamepads.poll().length) {
                            gamepads.updateStatus();
                            window.clearInterval(gamepads.pollingInterval);
                        }
                    }, 100);
                }
            }

            window.gamepads = gamepads;
        }
    }
});
