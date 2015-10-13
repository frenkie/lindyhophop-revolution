app.factory('keyConfigFactory', function () {

    var playerdefault = {
        "1": {
            "left": {
                "keyCode": 37,
                "name": "left"
            },
            "down": {
                "keyCode": 40,
                "name": "down"
            },
            "up": {
                "keyCode": 38,
                "name": "up"
            },
            "right": {
                "keyCode": 39,
                "name": "right"
            },
            "back": {
                "keyCode": 27,
                "name": "esc"
            },
            "enter": {
                "keyCode": 13,
                "name": "enter"
            },
            "escape": {
                "keyCode": 27,
                "name": "esc"
            }
        },
        "2": {
            "left": {
                "keyCode": 65,
                "name": "left"
            },
            "down": {
                "keyCode": 83,
                "name": "down"
            },
            "up": {
                "keyCode": 87,
                "name": "up"
            },
            "right": {
                "keyCode": 68,
                "name": "right"
            },
            "back": {
                "keyCode": 27,
                "name": "esc"
            },
            "enter": {
                "keyCode": 13,
                "name": "enter"
            },
            "escape": {
                "keyCode": 27,
                "name": "esc"
            }
        }
    };

    var gamePadDefault = {
        gamepad: true,
        "left": {
            "padCode": 14,
            "padIndex": 0,
            "button": "left",
            "name": "left, Gamepad 0."
        },
        "down": {
            "padCode": 13,
            "padIndex": 0,
            "button": "down",
            "name": "down, Gamepad 0."
        },
        "up": {
            "padCode": 12,
            "padIndex": 0,
            "button": "up",
            "name": "up, Gamepad 0."
        },
        "right": {
            "padCode": 15,
            "padIndex": 0,
            "button": "right",
            "name": "right, Gamepad 0."
        },
        "back": {
            "padCode": 0,
            "padIndex": 0,
            "button": "B button",
            "name": "B button, Gamepad 0."
        },
        "enter": {
            "padCode": 1,
            "padIndex": 0,
            "button": "A button",
            "name": "A button, Gamepad 0."
        },
        "escape": {
            "padCode": 8,
            "padIndex": 0,
            "button": "select",
            "name": "select, Gamepad 0."
        }
    }

    var config = {
        '0': angular.copy(player1default),
        '1': angular.copy(player2default)
    };

    window.addEventListener('gamepadconnected', function (e) {
        config.setConfig(e.gamepad.index, {
            gamepad: true,
            "left": {
                "padCode": 14,
                "padIndex": e.gamepad.index,
                "button": "left",
                "name": "left, Gamepad " + e.gamepad.index
            },
            "down": {
                "padCode": 13,
                "padIndex": e.gamepad.index,
                "button": "down",
                "name": "down, Gamepad " + e.gamepad.index
            },
            "up": {
                "padCode": 12,
                "padIndex": e.gamepad.index,
                "button": "up",
                "name": "up, Gamepad " + e.gamepad.index
            },
            "right": {
                "padCode": 15,
                "padIndex": e.gamepad.index,
                "button": "right",
                "name": "right, Gamepad " + e.gamepad.index
            },
            "back": {
                "padCode": 0,
                "padIndex": e.gamepad.index,
                "button": "B button",
                "name": "B button, Gamepad " + e.gamepad.index
            },
            "enter": {
                "padCode": 1,
                "padIndex": e.gamepad.index,
                "button": "A button",
                "name": "A button, Gamepad " + e.gamepad.index
            },
            "escape": {
                "padCode": 8,
                "padIndex": e.gamepad.index,
                "button": "select",
                "name": "select, Gamepad " + e.gamepad.index
            }
        });
    });

    window.addEventListener('gamepaddisconnected', function (e) {
        console.log(e.gamepad.index, angular.copy);
        // config.setConfig()
    });

    config.setConfig = function (playerIndex, configObj) {
        config[playerIndex] = configObj;
        console.log('new config set!', configObj)
    }

    return config;

}).run(function (keyConfigFactory) {});






