(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gamepads = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libGamepadsJs = require('./lib/gamepads.js');

var _libGamepadsJs2 = _interopRequireDefault(_libGamepadsJs);

exports['default'] = _libGamepadsJs2['default'];
module.exports = exports['default'];

},{"./lib/gamepads.js":3}],2:[function(require,module,exports){
/**
 * A simple event-emitter class. Like Node's but much simpler.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._listeners = {};
  }

  _createClass(EventEmitter, [{
    key: "emit",
    value: function emit(name) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // console.log('emit', name, args, this._listeners);
      (this._listeners[name] || []).forEach(function (func) {
        return func.apply(_this, args);
      });
      return this;
    }
  }, {
    key: "on",
    value: function on(name, func) {
      if (name in this._listeners) {
        this._listeners[name].push(func);
      } else {
        this._listeners[name] = [func];
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(name) {
      if (name) {
        this._listeners[name] = [];
      } else {
        this._listeners = {};
      }
      return this;
    }
  }]);

  return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _event_emitterJs = require('./event_emitter.js');

var _event_emitterJs2 = _interopRequireDefault(_event_emitterJs);

var _utilsJs = require('./utils.js');

var _utilsJs2 = _interopRequireDefault(_utilsJs);

var utils = new _utilsJs2['default']();

var DEFAULT_CONFIG = {
  'axisThreshold': 0.15,
  'gamepadAttributesEnabled': true,
  'gamepadIndicesEnabled': true,
  'keyEventsEnabled': true,
  'nonstandardEventsEnabled': true,
  'indices': undefined,
  'keyEvents': undefined
};

var DEFAULT_STATE = {
  // The standard gamepad has 4 axes and 17 buttons.
  // Some gamepads have 5-6 axes and 18-20 buttons.
  buttons: new Array(20),
  axes: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
};

for (var i = 0; i < 20; i++) {
  DEFAULT_STATE.buttons[i] = {
    pressed: false,
    value: 0.0
  };
}

var Gamepads = (function (_EventEmitter) {
  _inherits(Gamepads, _EventEmitter);

  function Gamepads(config) {
    var _this = this;

    _classCallCheck(this, Gamepads);

    _get(Object.getPrototypeOf(Gamepads.prototype), 'constructor', this).call(this);

    this.polyfill();

    this._gamepadApis = ['getGamepads', 'webkitGetGamepads', 'webkitGamepads'];
    this._gamepadDOMEvents = ['gamepadconnected', 'gamepaddisconnected'];
    this._gamepadInternalEvents = ['gamepadconnected', 'gamepaddisconnected', 'gamepadbuttondown', 'gamepadbuttonup', 'gamepadaxismove'];
    this._seenEvents = {};

    this.dataSource = this.getGamepadDataSource();
    this.gamepadsSupported = this._hasGamepads();
    this.indices = {};
    this.keyEvents = {};
    this.previousState = {};
    this.state = {};

    // Mark the events we see (keyed off gamepad index)
    // so we don't fire the same event twice.
    this._gamepadDOMEvents.forEach(function (eventName) {
      window.addEventListener(eventName, function (e) {
        _this.addSeenEvent(e.gamepad, eventName, 'dom');

        // Let the events fire again, if they've been disconnected/reconnected.
        if (eventName === 'gamepaddisconnected') {
          _this.removeSeenEvent(e.gamepad, 'gamepadconnected', 'dom');
        } else if (eventName === 'gamepadconnected') {
          _this.removeSeenEvent(e.gamepad, 'gamepaddisconnected', 'dom');
        }
      });
    });
    this._gamepadInternalEvents.forEach(function (eventName) {
      _this.on(eventName, function (gamepad) {
        _this.addSeenEvent(gamepad, eventName, 'internal');

        if (eventName === 'gamepaddisconnected') {
          _this.removeSeenEvent(gamepad, 'gamepadconnected', 'internal');
        } else {
          _this.removeSeenEvent(gamepad, 'gamepaddisconnected', 'internal');
        }
      });
    });

    config = config || {};
    Object.keys(DEFAULT_CONFIG).forEach(function (key) {
      _this[key] = typeof config[key] === 'undefined' ? DEFAULT_CONFIG[key] : utils.clone(config[key]);
    });

    if (this.gamepadIndicesEnabled) {
      this.on('gamepadconnected', this._onGamepadConnected.bind(this));
      this.on('gamepaddisconnected', this._onGamepadDisconnected.bind(this));
      this.on('gamepadbuttondown', this._onGamepadButtonDown.bind(this));
      this.on('gamepadbuttonup', this._onGamepadButtonUp.bind(this));
      this.on('gamepadaxismove', this._onGamepadAxisMove.bind(this));
    }
  }

  _createClass(Gamepads, [{
    key: 'polyfill',
    value: function polyfill() {
      if (this._polyfilled) {
        return;
      }

      if (!('performance' in window)) {
        window.performance = {};
      }

      if (!('now' in window.performance)) {
        window.performance.now = function () {
          return +new Date();
        };
      }

      if (!('GamepadButton' in window)) {
        var GamepadButton = window.GamepadButton = function (obj) {
          return {
            pressed: obj.pressed,
            value: obj.value
          };
        };
      }

      this._polyfilled = true;
    }
  }, {
    key: '_getVendorProductIds',
    value: function _getVendorProductIds(gamepad) {
      var bits = gamepad.id.split('-');
      var match;

      if (bits.length < 2) {
        match = gamepad.id.match(/vendor: (\w+) product: (\w+)/i);
        if (match) {
          return match.slice(1).map(utils.stripLeadingZeros);
        }
      }

      match = gamepad.id.match(/(\w+)-(\w+)/);
      if (match) {
        return match.slice(1).map(utils.stripLeadingZeros);
      }

      return bits.slice(0, 2).map(utils.stripLeadingZeros);
    }
  }, {
    key: '_hasGamepads',
    value: function _hasGamepads() {
      for (var i = 0, len = this._gamepadApis.length; i < len; i++) {
        if (this._gamepadApis[i] in navigator) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: '_getGamepads',
    value: function _getGamepads() {
      for (var i = 0, len = this._gamepadApis.length; i < len; i++) {
        if (this._gamepadApis[i] in navigator) {
          return navigator[this._gamepadApis[i]]();
        }
      }
      return [];
    }
  }, {
    key: 'updateGamepad',
    value: function updateGamepad(gamepad) {
      this.previousState[gamepad.index] = utils.clone(this.state[gamepad.index] || DEFAULT_STATE);
      this.state[gamepad.index] = gamepad ? utils.clone(gamepad) : DEFAULT_STATE;

      // Fire connection event, if gamepad was actually connected.
      this.fireConnectionEvent(this.state[gamepad.index], true);
    }
  }, {
    key: 'removeGamepad',
    value: function removeGamepad(gamepad) {
      delete this.state[gamepad.index];

      // Fire disconnection event.
      this.fireConnectionEvent(gamepad, false);
    }
  }, {
    key: 'observeButtonChanges',
    value: function observeButtonChanges(gamepad) {
      var _this2 = this;

      var previousPad = this.previousState[gamepad.index];
      var currentPad = this.state[gamepad.index];

      if (!previousPad || !Object.keys(previousPad).length || !currentPad || !Object.keys(currentPad).length) {
        return;
      }

      currentPad.buttons.forEach(function (button, buttonIdx) {
        if (button.value !== previousPad.buttons[buttonIdx].value) {
          // Fire button events.
          _this2.fireButtonEvent(currentPad, buttonIdx, button.value);

          // Fire synthetic keyboard events, if needed.
          _this2.fireKeyEvent(currentPad, buttonIdx, button.value);
        }
      });
    }
  }, {
    key: 'observeAxisChanges',
    value: function observeAxisChanges(gamepad) {
      var _this3 = this;

      var previousPad = this.previousState[gamepad.index];
      var currentPad = this.state[gamepad.index];

      if (!previousPad || !Object.keys(previousPad).length || !currentPad || !Object.keys(currentPad).length) {
        return;
      }

      currentPad.axes.forEach(function (axis, axisIdx) {
        // Fire axis events.
        if (axis !== previousPad.axes[axisIdx]) {
          _this3.fireAxisMoveEvent(currentPad, axisIdx, axis);
        }
      });
    }

    /**
     * @function
     * @name Gamepads#update
     * @description
     *   Update the current and previous states of the gamepads.
     *   This must be called every frame for events to work.
     */
  }, {
    key: 'update',
    value: function update() {
      var _this4 = this;

      var activePads = {};

      this.poll().forEach(function (pad) {
        // Keep track of which gamepads are still active (not disconnected).
        activePads[pad.index] = true;

        // Add/update connected gamepads
        // (and fire internal events + polyfilled events, if needed).
        _this4.updateGamepad(pad);

        // Never seen this actually be the case, but if a pad is still in the
        // `navigator.getGamepads()` list and it's disconnected, emit the event.
        if (!pad.connected) {
          _this4.removeGamepad(_this4.state[padIdx]);
        }

        // Fire internal events + polyfilled non-standard events, if needed.
        _this4.observeButtonChanges(pad);
        _this4.observeAxisChanges(pad);
      });

      Object.keys(this.state).forEach(function (padIdx) {
        if (!(padIdx in activePads)) {
          // Remove disconnected gamepads
          // (and fire internal events + polyfilled events, if needed).
          _this4.removeGamepad(_this4.state[padIdx]);
        }
      });
    }

    /**
     * @function
     * @name Gamepads#getGamepadDataSource
     * @description Get gamepad data source (e.g., linuxjoy, hid, dinput, xinput).
     * @returns {String} A string of gamepad data source.
     */
  }, {
    key: 'getGamepadDataSource',
    value: function getGamepadDataSource() {
      var dataSource;
      if (navigator.platform.match(/^Linux/)) {
        dataSource = 'linuxjoy';
      } else if (navigator.platform.match(/^Mac/)) {
        dataSource = 'hid';
      } else if (navigator.platform.match(/^Win/)) {
        var m = navigator.userAgent.match('Gecko/(..)');
        if (m && parseInt(m[1]) < 32) {
          dataSource = 'dinput';
        } else {
          dataSource = 'hid';
        }
      }
      return dataSource;
    }

    /**
     * @function
     * @name Gamepads#poll
     * @description Poll for the latest data from the gamepad API.
     * @returns {Array} An array of gamepads and mappings for the model of the connected gamepad.
     * @example
     *   var gamepads = new Gamepads();
     *   var pads = gamepads.poll();
     */
  }, {
    key: 'poll',
    value: function poll() {
      var pads = [];

      if (this.gamepadsSupported) {
        var padsRaw = this._getGamepads();
        var pad;

        for (var i = 0, len = padsRaw.length; i < len; i++) {
          pad = padsRaw[i];

          if (!pad) {
            continue;
          }

          pad = this.extend(pad);

          pads.push(pad);
        }
      }

      return pads;
    }

    /**
     * @function
     * @name Gamepads#extend
     * @description Set new properties on a gamepad object.
     * @param {Object} gamepad The original gamepad object.
     * @returns {Object} An extended copy of the gamepad.
     */
  }, {
    key: 'extend',
    value: function extend(gamepad) {
      if (gamepad._extended) {
        return gamepad;
      }

      var pad = utils.clone(gamepad);

      pad._extended = true;

      if (this.gamepadAttributesEnabled) {
        pad.attributes = this._getAttributes(pad);
      }

      if (!pad.timestamp) {
        pad.timestamp = window.performance.now();
      }

      if (this.gamepadIndicesEnabled) {
        pad.indices = this._getIndices(pad);
      }

      return pad;
    }

    /**
     * @function
     * @name Gamepads#_getAttributes
     * @description Generate and return the attributes of a gamepad.
     * @param {Object} gamepad The gamepad object.
     * @returns {Object} The attributes for this gamepad.
     */
  }, {
    key: '_getAttributes',
    value: function _getAttributes(gamepad) {
      var padIds = this._getVendorProductIds(gamepad);
      return {
        vendorId: padIds[0],
        productId: padIds[1],
        name: gamepad.id,
        dataSource: this.dataSource
      };
    }

    /**
     * @function
     * @name Gamepads#_getIndices
     * @description Return the named indices of a gamepad.
     * @param {Object} gamepad The gamepad object.
     * @returns {Object} The named indices for this gamepad.
     */
  }, {
    key: '_getIndices',
    value: function _getIndices(gamepad) {
      return this.indices[gamepad.id] || this.indices.standard || {};
    }

    /**
     * @function
     * @name Gamepads#_mapAxis
     * @description Set the value for one of the analogue axes of the pad.
     * @param {Number} axis The button to get the value of.
     * @returns {Number} The value of the axis between -1 and 1.
     */
  }, {
    key: '_mapAxis',
    value: function _mapAxis(axis) {
      if (Math.abs(axis) < this.axisThreshold) {
        return 0;
      }

      return axis;
    }

    /**
     * @function
     * @name Gamepads#_mapButton
     * @description Set the value for one of the buttons of the pad.
     * @param {Number} button The button to get the value of.
     * @returns {Object} An object resembling a `GamepadButton` object.
     */
  }, {
    key: '_mapButton',
    value: function _mapButton(button) {
      if (typeof button === 'number') {
        // Old versions of the API used to return just numbers instead
        // of `GamepadButton` objects.
        button = new GamepadButton({
          pressed: button === 1,
          value: button
        });
      }

      return button;
    }
  }, {
    key: 'setIndices',
    value: function setIndices(indices) {
      this.indices = utils.clone(indices);
    }
  }, {
    key: 'fireConnectionEvent',
    value: function fireConnectionEvent(gamepad, connected) {
      var name = connected ? 'gamepadconnected' : 'gamepaddisconnected';

      if (!this.hasSeenEvent(gamepad, name, 'internal')) {
        // Fire internal event.
        this.emit(name, gamepad);
      }

      // Don't fire the 'gamepadconnected'/'gamepaddisconnected' events if the
      // browser has already fired them. (Unfortunately, we can't feature detect
      // if they'll get fired.)
      if (!this.hasSeenEvent(gamepad, name, 'dom')) {
        var data = {
          bubbles: false,
          cancelable: false,
          detail: {
            gamepad: gamepad
          }
        };

        utils.triggerEvent(window, name, data);
      }
    }
  }, {
    key: 'fireButtonEvent',
    value: function fireButtonEvent(gamepad, button, value) {
      var name = value === 1 ? 'gamepadbuttondown' : 'gamepadbuttonup';

      // Fire internal event.
      this.emit(name, gamepad, button, value);

      if (this.nonstandardEventsEnabled && !('GamepadButtonEvent' in window)) {
        var data = {
          bubbles: false,
          cancelable: false,
          detail: {
            button: button,
            gamepad: gamepad
          }
        };
        utils.triggerEvent(window, name, data);
      }
    }
  }, {
    key: 'fireAxisMoveEvent',
    value: function fireAxisMoveEvent(gamepad, axis, value) {
      var name = 'gamepadaxismove';

      // Fire internal event.
      this.emit(name, gamepad, axis, value);

      if (!this.nonstandardEventsEnabled || 'GamepadAxisMoveEvent' in window) {
        return;
      }

      if (Math.abs(value) < this.axisThreshold) {
        return;
      }

      var data = {
        bubbles: false,
        cancelable: false,
        detail: {
          axis: axis,
          gamepad: gamepad,
          value: value
        }
      };
      utils.triggerEvent(window, name, data);
    }
  }, {
    key: 'fireKeyEvent',
    value: function fireKeyEvent(gamepad, button, value) {
      if (!this.keyEventsEnabled || !this.keyEvents) {
        return;
      }

      var buttonName = utils.swap(gamepad.indices)[button];

      if (typeof buttonName === 'undefined') {
        return;
      }

      var names = value === 1 ? ['keydown', 'keypress'] : ['keyup'];
      var data = this.keyEvents[buttonName];

      if (!data) {
        return;
      }

      if (!('bubbles' in data)) {
        data.bubbles = true;
      }
      if (!data.detail) {
        data.detail = {};
      }
      data.detail.button = button;
      data.detail.gamepad = gamepad;

      names.forEach(function (name) {
        utils.triggerEvent(data.target || document.activeElement, name, data);
      });
    }
  }, {
    key: 'addSeenEvent',
    value: function addSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      this._seenEvents[key] = true;
    }
  }, {
    key: 'hasSeenEvent',
    value: function hasSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      return !!this._seenEvents[key];
    }
  }, {
    key: 'removeSeenEvent',
    value: function removeSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      delete this._seenEvents[key];
    }
  }, {
    key: 'buttonEvent2axisEvent',
    value: function buttonEvent2axisEvent(e) {
      if (e.type === 'gamepadbuttondown') {
        e.axis = e.button;
        e.value = 1.0;
      } else if (e.type === 'gamepadbuttonup') {
        e.axis = e.button;
        e.value = 0.0;
      }
      return e;
    }

    /**
     * Returns whether a `button` index equals the supplied `key`.
     *
     * Useful for determining whether ``navigator.getGamepads()[0].buttons[`$button`]``
     * has any bindings defined (in `FrameManager`).
     *
     * @param {Number} button Index of gamepad button (e.g., `4`).
     * @param {String} key Human-readable format for button binding (e.g., 'b4').
     */
  }, {
    key: '_buttonDownEqualsKey',
    value: function _buttonDownEqualsKey(button, key) {
      return 'b' + button + '.down' === key.trim().toLowerCase();
    }
  }, {
    key: '_buttonUpEqualsKey',
    value: function _buttonUpEqualsKey(button, key) {
      var keyClean = key.trim().toLowerCase();
      return 'b' + button + '.up' === keyClean || 'b' + button === keyClean;
    }

    /**
     * Returns whether an `axis` index equals the supplied `key`.
     *
     * Useful for determining whether ``navigator.getGamepads()[0].axes[`$button`]``
     * has any bindings defined (in `FrameManager`).
     *
     * @param {Number} button Index of gamepad axis (e.g., `1`).
     * @param {String} key Human-readable format for button binding (e.g., 'a1').
     */
  }, {
    key: '_axisMoveEqualsKey',
    value: function _axisMoveEqualsKey(axis, key) {
      return 'a' + axis === key.trim().toLowerCase();
    }

    /**
     * Calls any bindings defined for 'connected' (in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     */
  }, {
    key: '_onGamepadConnected',
    value: function _onGamepadConnected(gamepad) {
      if ('connected' in gamepad.indices) {
        gamepad.indices.connected(gamepad);
      }
    }

    /**
     * Calls any bindings defined for 'disconnected' (in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     */
  }, {
    key: '_onGamepadDisconnected',
    value: function _onGamepadDisconnected(gamepad) {
      if ('disconnected' in gamepad.indices) {
        gamepad.indices.disconnected(gamepad);
      }
    }

    /**
     * Calls any bindings defined for buttons (e.g., 'b4.up' in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} button Index of gamepad button (integer) being pressed
     *                        (per `gamepadbuttondown` event).
     */
  }, {
    key: '_onGamepadButtonDown',
    value: function _onGamepadButtonDown(gamepad, button) {
      for (var key in gamepad.indices) {
        if (this._buttonDownEqualsKey(button, key)) {
          gamepad.indices[key](gamepad, button);
        }
      }
    }

    /**
     * Calls any bindings defined for buttons (e.g., 'b4.down' in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} button Index of gamepad button (integer) being released
     *                        (per `gamepadbuttonup` event).
     */
  }, {
    key: '_onGamepadButtonUp',
    value: function _onGamepadButtonUp(gamepad, button) {
      for (var key in gamepad.indices) {
        if (this._buttonUpEqualsKey(button, key)) {
          gamepad.indices[key](gamepad, button);
        }
      }
    }

    /**
     * Calls any bindings defined for axes (e.g., 'a1' in `FrameManager`).
     *
     * (Called by event listener for `gamepadaxismove`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} axis Index of gamepad axis (integer) being changed
     *                      (per `gamepadaxismove` event).
     * @param {Number} value Value of gamepad axis (from -1.0 to 1.0) being
     *                       changed (per `gamepadaxismove` event).
     */
  }, {
    key: '_onGamepadAxisMove',
    value: function _onGamepadAxisMove(gamepad, axis, value) {
      for (var key in gamepad.indices) {
        if (this._axisMoveEqualsKey(axis, key)) {
          gamepad.indices[key](gamepad, axis, value);
        }
      }
    }
  }]);

  return Gamepads;
})(_event_emitterJs2['default']);

exports['default'] = Gamepads;

Gamepads.utils = utils;
module.exports = exports['default'];

},{"./event_emitter.js":2,"./utils.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);

    this.browser = this.getBrowser();
    this.engine = this.getEngine(this.browser);
  }

  _createClass(Utils, [{
    key: 'clone',
    value: function clone(obj) {
      if (obj === null || typeof obj === 'function' || !(obj instanceof Object)) {
        return obj;
      }

      var ret = '';

      if (obj instanceof Date) {
        ret = new Date();
        ret.setTime(obj.getTime());
        return ret;
      }

      if (obj instanceof Array) {
        ret = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          ret[i] = this.clone(obj[i]);
        }
        return ret;
      }

      if (obj instanceof Object) {
        ret = {};
        for (var attr in obj) {
          if (attr in obj) {
            ret[attr] = this.clone(obj[attr]);
          }
        }
        return ret;
      }

      throw new Error('Unable to clone object of unexpected type!');
    }
  }, {
    key: 'swap',
    value: function swap(obj) {
      var ret = {};
      for (var attr in obj) {
        if (attr in obj) {
          ret[obj[attr]] = attr;
        }
      }
      return ret;
    }
  }, {
    key: 'getBrowser',
    value: function getBrowser() {
      if (typeof window === 'undefined') {
        return;
      }

      if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera).
        return 'opera';
      } else if ('chrome' in window) {
        // Chrome 1+.
        return 'chrome';
      } else if (typeof InstallTrigger !== 'undefined') {
        // Firefox 1.0+.
        return 'firefox';
      } else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        // At least Safari 3+: "[object HTMLElementConstructor]".
        return 'safari';
      } else if ( /*@cc_on!@*/false || !!document.documentMode) {
        // At least IE6.
        return 'ie';
      }
    }
  }, {
    key: 'getEngine',
    value: function getEngine(browser) {
      browser = browser || this.getBrowser();

      if (browser === 'firefox') {
        return 'gecko';
      } else if (browser === 'opera' || browser === 'chrome' || browser === 'safari') {
        return 'webkit';
      } else if (browser === 'ie') {
        return 'trident';
      }
    }
  }, {
    key: 'stripLeadingZeros',
    value: function stripLeadingZeros(str) {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/^0+(?=\d+)/g, '');
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(el, name, data) {
      data = data || {};
      data.detail = data.detail || {};

      var event;

      if ('CustomEvent' in window) {
        event = new CustomEvent(name, data);
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, data.bubbles, data.cancelable, data.detail);
      }

      Object.keys(data.detail).forEach(function (key) {
        event[key] = data.detail[key];
      });

      el.dispatchEvent(event);
    }
  }]);

  return Utils;
})();

exports['default'] = Utils;
module.exports = exports['default'];

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2Vhbi9Qcm9ncmFtbWluZy9GdWxsc3RhY2svZ2FtZXBhZC1wbHVzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9zZWFuL1Byb2dyYW1taW5nL0Z1bGxzdGFjay9nYW1lcGFkLXBsdXMvc3JjL2xpYi9ldmVudF9lbWl0dGVyLmpzIiwiL1VzZXJzL3NlYW4vUHJvZ3JhbW1pbmcvRnVsbHN0YWNrL2dhbWVwYWQtcGx1cy9zcmMvbGliL2dhbWVwYWRzLmpzIiwiL1VzZXJzL3NlYW4vUHJvZ3JhbW1pbmcvRnVsbHN0YWNrL2dhbWVwYWQtcGx1cy9zcmMvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7NkJDQXFCLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0luQixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxHQUNqQjswQkFESyxZQUFZOztBQUU3QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUFIa0IsWUFBWTs7V0FLM0IsY0FBQyxJQUFJLEVBQVc7Ozt3Q0FBTixJQUFJO0FBQUosWUFBSTs7OztBQUVoQixPQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsT0FBTyxDQUFDLFVBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxLQUFLLFFBQU8sSUFBSSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3RFLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVDLFlBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNiLFVBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbEMsTUFBTTtBQUNMLFlBQUksQ0FBQyxV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QUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZDOzs7V0FFVyxzQkFBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUMzQixVQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDOztBQUVoQyxVQUFJLEtBQUssQ0FBQzs7QUFFVixVQUFJLGFBQWEsSUFBSSxNQUFNLEVBQUU7QUFDM0IsYUFBSyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNyQyxNQUFNO0FBQ0wsYUFBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUMsYUFBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN6RTs7QUFFRCxZQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDeEMsYUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDL0IsQ0FBQyxDQUFDOztBQUVILFFBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7OztTQTlHa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWVwYWRzIGZyb20gJy4vbGliL2dhbWVwYWRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXBhZHM7XG4iLCIvKipcbiAqIEEgc2ltcGxlIGV2ZW50LWVtaXR0ZXIgY2xhc3MuIExpa2UgTm9kZSdzIGJ1dCBtdWNoIHNpbXBsZXIuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gIH1cblxuICBlbWl0KG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnZW1pdCcsIG5hbWUsIGFyZ3MsIHRoaXMuX2xpc3RlbmVycyk7XG4gICAgKHRoaXMuX2xpc3RlbmVyc1tuYW1lXSB8fCBbXSkuZm9yRWFjaChmdW5jID0+IGZ1bmMuYXBwbHkodGhpcywgYXJncykpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb24obmFtZSwgZnVuYykge1xuICAgIGlmIChuYW1lIGluIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdLnB1c2goZnVuYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IFtmdW5jXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbbmFtZV0gPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4vZXZlbnRfZW1pdHRlci5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cblxudmFyIHV0aWxzID0gbmV3IFV0aWxzKCk7XG5cbmNvbnN0IERFRkFVTFRfQ09ORklHID0ge1xuICAnYXhpc1RocmVzaG9sZCc6IDAuMTUsXG4gICdnYW1lcGFkQXR0cmlidXRlc0VuYWJsZWQnOiB0cnVlLFxuICAnZ2FtZXBhZEluZGljZXNFbmFibGVkJzogdHJ1ZSxcbiAgJ2tleUV2ZW50c0VuYWJsZWQnOiB0cnVlLFxuICAnbm9uc3RhbmRhcmRFdmVudHNFbmFibGVkJzogdHJ1ZSxcbiAgJ2luZGljZXMnOiB1bmRlZmluZWQsXG4gICdrZXlFdmVudHMnOiB1bmRlZmluZWRcbn07XG5cbnZhciBERUZBVUxUX1NUQVRFID0ge1xuICAvLyBUaGUgc3RhbmRhcmQgZ2FtZXBhZCBoYXMgNCBheGVzIGFuZCAxNyBidXR0b25zLlxuICAvLyBTb21lIGdhbWVwYWRzIGhhdmUgNS02IGF4ZXMgYW5kIDE4LTIwIGJ1dHRvbnMuXG4gIGJ1dHRvbnM6IG5ldyBBcnJheSgyMCksXG4gIGF4ZXM6IFswLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wXVxufTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gIERFRkFVTFRfU1RBVEUuYnV0dG9uc1tpXSA9IHtcbiAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICB2YWx1ZTogMC4wXG4gfTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lcGFkcyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnBvbHlmaWxsKCk7XG5cbiAgICB0aGlzLl9nYW1lcGFkQXBpcyA9IFsnZ2V0R2FtZXBhZHMnLCAnd2Via2l0R2V0R2FtZXBhZHMnLCAnd2Via2l0R2FtZXBhZHMnXTtcbiAgICB0aGlzLl9nYW1lcGFkRE9NRXZlbnRzID0gWydnYW1lcGFkY29ubmVjdGVkJywgJ2dhbWVwYWRkaXNjb25uZWN0ZWQnXTtcbiAgICB0aGlzLl9nYW1lcGFkSW50ZXJuYWxFdmVudHMgPSBbJ2dhbWVwYWRjb25uZWN0ZWQnLCAnZ2FtZXBhZGRpc2Nvbm5lY3RlZCcsXG4gICAgICAnZ2FtZXBhZGJ1dHRvbmRvd24nLCAnZ2FtZXBhZGJ1dHRvbnVwJywgJ2dhbWVwYWRheGlzbW92ZSddO1xuICAgIHRoaXMuX3NlZW5FdmVudHMgPSB7fTtcblxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IHRoaXMuZ2V0R2FtZXBhZERhdGFTb3VyY2UoKTtcbiAgICB0aGlzLmdhbWVwYWRzU3VwcG9ydGVkID0gdGhpcy5faGFzR2FtZXBhZHMoKTtcbiAgICB0aGlzLmluZGljZXMgPSB7fTtcbiAgICB0aGlzLmtleUV2ZW50cyA9IHt9O1xuICAgIHRoaXMucHJldmlvdXNTdGF0ZSA9IHt9O1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcblxuICAgIC8vIE1hcmsgdGhlIGV2ZW50cyB3ZSBzZWUgKGtleWVkIG9mZiBnYW1lcGFkIGluZGV4KVxuICAgIC8vIHNvIHdlIGRvbid0IGZpcmUgdGhlIHNhbWUgZXZlbnQgdHdpY2UuXG4gICAgdGhpcy5fZ2FtZXBhZERPTUV2ZW50cy5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGUgPT4ge1xuICAgICAgICB0aGlzLmFkZFNlZW5FdmVudChlLmdhbWVwYWQsIGV2ZW50TmFtZSwgJ2RvbScpO1xuXG4gICAgICAgIC8vIExldCB0aGUgZXZlbnRzIGZpcmUgYWdhaW4sIGlmIHRoZXkndmUgYmVlbiBkaXNjb25uZWN0ZWQvcmVjb25uZWN0ZWQuXG4gICAgICAgIGlmIChldmVudE5hbWUgPT09ICdnYW1lcGFkZGlzY29ubmVjdGVkJykge1xuICAgICAgICAgIHRoaXMucmVtb3ZlU2VlbkV2ZW50KGUuZ2FtZXBhZCwgJ2dhbWVwYWRjb25uZWN0ZWQnLCAnZG9tJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnZ2FtZXBhZGNvbm5lY3RlZCcpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVNlZW5FdmVudChlLmdhbWVwYWQsICdnYW1lcGFkZGlzY29ubmVjdGVkJywgJ2RvbScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLl9nYW1lcGFkSW50ZXJuYWxFdmVudHMuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgdGhpcy5vbihldmVudE5hbWUsIGdhbWVwYWQgPT4ge1xuICAgICAgICB0aGlzLmFkZFNlZW5FdmVudChnYW1lcGFkLCBldmVudE5hbWUsICdpbnRlcm5hbCcpO1xuXG4gICAgICAgIGlmIChldmVudE5hbWUgPT09ICdnYW1lcGFkZGlzY29ubmVjdGVkJykge1xuICAgICAgICAgIHRoaXMucmVtb3ZlU2VlbkV2ZW50KGdhbWVwYWQsICdnYW1lcGFkY29ubmVjdGVkJywgJ2ludGVybmFsJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVTZWVuRXZlbnQoZ2FtZXBhZCwgJ2dhbWVwYWRkaXNjb25uZWN0ZWQnLCAnaW50ZXJuYWwnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgT2JqZWN0LmtleXMoREVGQVVMVF9DT05GSUcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXNba2V5XSA9IHR5cGVvZiBjb25maWdba2V5XSA9PT0gJ3VuZGVmaW5lZCcgPyBERUZBVUxUX0NPTkZJR1trZXldIDogdXRpbHMuY2xvbmUoY29uZmlnW2tleV0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZ2FtZXBhZEluZGljZXNFbmFibGVkKSB7XG4gICAgICB0aGlzLm9uKCdnYW1lcGFkY29ubmVjdGVkJywgdGhpcy5fb25HYW1lcGFkQ29ubmVjdGVkLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5vbignZ2FtZXBhZGRpc2Nvbm5lY3RlZCcsIHRoaXMuX29uR2FtZXBhZERpc2Nvbm5lY3RlZC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMub24oJ2dhbWVwYWRidXR0b25kb3duJywgdGhpcy5fb25HYW1lcGFkQnV0dG9uRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMub24oJ2dhbWVwYWRidXR0b251cCcsIHRoaXMuX29uR2FtZXBhZEJ1dHRvblVwLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5vbignZ2FtZXBhZGF4aXNtb3ZlJywgdGhpcy5fb25HYW1lcGFkQXhpc01vdmUuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgcG9seWZpbGwoKSB7XG4gICAgaWYgKHRoaXMuX3BvbHlmaWxsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoISgncGVyZm9ybWFuY2UnIGluIHdpbmRvdykpIHtcbiAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZSA9IHt9O1xuICAgIH1cblxuICAgIGlmICghKCdub3cnIGluIHdpbmRvdy5wZXJmb3JtYW5jZSkpIHtcbiAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiArbmV3IERhdGUoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCEoJ0dhbWVwYWRCdXR0b24nIGluIHdpbmRvdykpIHtcbiAgICAgIHZhciBHYW1lcGFkQnV0dG9uID0gd2luZG93LkdhbWVwYWRCdXR0b24gPSAob2JqKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcHJlc3NlZDogb2JqLnByZXNzZWQsXG4gICAgICAgICAgdmFsdWU6IG9iai52YWx1ZVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLl9wb2x5ZmlsbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIF9nZXRWZW5kb3JQcm9kdWN0SWRzKGdhbWVwYWQpIHtcbiAgICB2YXIgYml0cyA9IGdhbWVwYWQuaWQuc3BsaXQoJy0nKTtcbiAgICB2YXIgbWF0Y2g7XG5cbiAgICBpZiAoYml0cy5sZW5ndGggPCAyKSB7XG4gICAgICBtYXRjaCA9IGdhbWVwYWQuaWQubWF0Y2goL3ZlbmRvcjogKFxcdyspIHByb2R1Y3Q6IChcXHcrKS9pKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4gbWF0Y2guc2xpY2UoMSkubWFwKHV0aWxzLnN0cmlwTGVhZGluZ1plcm9zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtYXRjaCA9IGdhbWVwYWQuaWQubWF0Y2goLyhcXHcrKS0oXFx3KykvKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXRjaC5zbGljZSgxKS5tYXAodXRpbHMuc3RyaXBMZWFkaW5nWmVyb3MpO1xuICAgIH1cblxuICAgIHJldHVybiBiaXRzLnNsaWNlKDAsIDIpLm1hcCh1dGlscy5zdHJpcExlYWRpbmdaZXJvcyk7XG4gIH1cblxuICBfaGFzR2FtZXBhZHMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2dhbWVwYWRBcGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fZ2FtZXBhZEFwaXNbaV0gaW4gbmF2aWdhdG9yKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBfZ2V0R2FtZXBhZHMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2dhbWVwYWRBcGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fZ2FtZXBhZEFwaXNbaV0gaW4gbmF2aWdhdG9yKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3JbdGhpcy5fZ2FtZXBhZEFwaXNbaV1dKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHVwZGF0ZUdhbWVwYWQoZ2FtZXBhZCkge1xuICAgIHRoaXMucHJldmlvdXNTdGF0ZVtnYW1lcGFkLmluZGV4XSA9IHV0aWxzLmNsb25lKHRoaXMuc3RhdGVbZ2FtZXBhZC5pbmRleF0gfHwgREVGQVVMVF9TVEFURSk7XG4gICAgdGhpcy5zdGF0ZVtnYW1lcGFkLmluZGV4XSA9IGdhbWVwYWQgPyB1dGlscy5jbG9uZShnYW1lcGFkKSA6IERFRkFVTFRfU1RBVEU7XG5cbiAgICAvLyBGaXJlIGNvbm5lY3Rpb24gZXZlbnQsIGlmIGdhbWVwYWQgd2FzIGFjdHVhbGx5IGNvbm5lY3RlZC5cbiAgICB0aGlzLmZpcmVDb25uZWN0aW9uRXZlbnQodGhpcy5zdGF0ZVtnYW1lcGFkLmluZGV4XSwgdHJ1ZSk7XG4gIH1cblxuICByZW1vdmVHYW1lcGFkKGdhbWVwYWQpIHtcbiAgICBkZWxldGUgdGhpcy5zdGF0ZVtnYW1lcGFkLmluZGV4XTtcblxuICAgIC8vIEZpcmUgZGlzY29ubmVjdGlvbiBldmVudC5cbiAgICB0aGlzLmZpcmVDb25uZWN0aW9uRXZlbnQoZ2FtZXBhZCwgZmFsc2UpO1xuICB9XG5cbiAgb2JzZXJ2ZUJ1dHRvbkNoYW5nZXMoZ2FtZXBhZCkge1xuICAgIHZhciBwcmV2aW91c1BhZCA9IHRoaXMucHJldmlvdXNTdGF0ZVtnYW1lcGFkLmluZGV4XTtcbiAgICB2YXIgY3VycmVudFBhZCA9IHRoaXMuc3RhdGVbZ2FtZXBhZC5pbmRleF07XG5cbiAgICBpZiAoIXByZXZpb3VzUGFkIHx8ICFPYmplY3Qua2V5cyhwcmV2aW91c1BhZCkubGVuZ3RoIHx8XG4gICAgICAgICFjdXJyZW50UGFkIHx8ICFPYmplY3Qua2V5cyhjdXJyZW50UGFkKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjdXJyZW50UGFkLmJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBidXR0b25JZHgpID0+IHtcbiAgICAgIGlmIChidXR0b24udmFsdWUgIT09IHByZXZpb3VzUGFkLmJ1dHRvbnNbYnV0dG9uSWR4XS52YWx1ZSkge1xuICAgICAgICAvLyBGaXJlIGJ1dHRvbiBldmVudHMuXG4gICAgICAgIHRoaXMuZmlyZUJ1dHRvbkV2ZW50KGN1cnJlbnRQYWQsIGJ1dHRvbklkeCwgYnV0dG9uLnZhbHVlKTtcblxuICAgICAgICAvLyBGaXJlIHN5bnRoZXRpYyBrZXlib2FyZCBldmVudHMsIGlmIG5lZWRlZC5cbiAgICAgICAgdGhpcy5maXJlS2V5RXZlbnQoY3VycmVudFBhZCwgYnV0dG9uSWR4LCBidXR0b24udmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb2JzZXJ2ZUF4aXNDaGFuZ2VzKGdhbWVwYWQpIHtcbiAgICB2YXIgcHJldmlvdXNQYWQgPSB0aGlzLnByZXZpb3VzU3RhdGVbZ2FtZXBhZC5pbmRleF07XG4gICAgdmFyIGN1cnJlbnRQYWQgPSB0aGlzLnN0YXRlW2dhbWVwYWQuaW5kZXhdO1xuXG4gICAgaWYgKCFwcmV2aW91c1BhZCB8fCAhT2JqZWN0LmtleXMocHJldmlvdXNQYWQpLmxlbmd0aCB8fFxuICAgICAgICAhY3VycmVudFBhZCB8fCAhT2JqZWN0LmtleXMoY3VycmVudFBhZCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3VycmVudFBhZC5heGVzLmZvckVhY2goKGF4aXMsIGF4aXNJZHgpID0+IHtcbiAgICAgIC8vIEZpcmUgYXhpcyBldmVudHMuXG4gICAgICBpZiAoYXhpcyAhPT0gcHJldmlvdXNQYWQuYXhlc1theGlzSWR4XSkge1xuICAgICAgICB0aGlzLmZpcmVBeGlzTW92ZUV2ZW50KGN1cnJlbnRQYWQsIGF4aXNJZHgsIGF4aXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbmFtZSBHYW1lcGFkcyN1cGRhdGVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqICAgVXBkYXRlIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBzdGF0ZXMgb2YgdGhlIGdhbWVwYWRzLlxuICAgKiAgIFRoaXMgbXVzdCBiZSBjYWxsZWQgZXZlcnkgZnJhbWUgZm9yIGV2ZW50cyB0byB3b3JrLlxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHZhciBhY3RpdmVQYWRzID0ge307XG5cbiAgICB0aGlzLnBvbGwoKS5mb3JFYWNoKHBhZCA9PiB7XG4gICAgICAvLyBLZWVwIHRyYWNrIG9mIHdoaWNoIGdhbWVwYWRzIGFyZSBzdGlsbCBhY3RpdmUgKG5vdCBkaXNjb25uZWN0ZWQpLlxuICAgICAgYWN0aXZlUGFkc1twYWQuaW5kZXhdID0gdHJ1ZTtcblxuICAgICAgLy8gQWRkL3VwZGF0ZSBjb25uZWN0ZWQgZ2FtZXBhZHNcbiAgICAgIC8vIChhbmQgZmlyZSBpbnRlcm5hbCBldmVudHMgKyBwb2x5ZmlsbGVkIGV2ZW50cywgaWYgbmVlZGVkKS5cbiAgICAgIHRoaXMudXBkYXRlR2FtZXBhZChwYWQpO1xuXG4gICAgICAvLyBOZXZlciBzZWVuIHRoaXMgYWN0dWFsbHkgYmUgdGhlIGNhc2UsIGJ1dCBpZiBhIHBhZCBpcyBzdGlsbCBpbiB0aGVcbiAgICAgIC8vIGBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKWAgbGlzdCBhbmQgaXQncyBkaXNjb25uZWN0ZWQsIGVtaXQgdGhlIGV2ZW50LlxuICAgICAgaWYgKCFwYWQuY29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlR2FtZXBhZCh0aGlzLnN0YXRlW3BhZElkeF0pO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXJlIGludGVybmFsIGV2ZW50cyArIHBvbHlmaWxsZWQgbm9uLXN0YW5kYXJkIGV2ZW50cywgaWYgbmVlZGVkLlxuICAgICAgdGhpcy5vYnNlcnZlQnV0dG9uQ2hhbmdlcyhwYWQpO1xuICAgICAgdGhpcy5vYnNlcnZlQXhpc0NoYW5nZXMocGFkKTtcbiAgICB9KTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMuc3RhdGUpLmZvckVhY2gocGFkSWR4ID0+IHtcbiAgICAgIGlmICghKHBhZElkeCBpbiBhY3RpdmVQYWRzKSkge1xuICAgICAgICAvLyBSZW1vdmUgZGlzY29ubmVjdGVkIGdhbWVwYWRzXG4gICAgICAgIC8vIChhbmQgZmlyZSBpbnRlcm5hbCBldmVudHMgKyBwb2x5ZmlsbGVkIGV2ZW50cywgaWYgbmVlZGVkKS5cbiAgICAgICAgdGhpcy5yZW1vdmVHYW1lcGFkKHRoaXMuc3RhdGVbcGFkSWR4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBuYW1lIEdhbWVwYWRzI2dldEdhbWVwYWREYXRhU291cmNlXG4gICAqIEBkZXNjcmlwdGlvbiBHZXQgZ2FtZXBhZCBkYXRhIHNvdXJjZSAoZS5nLiwgbGludXhqb3ksIGhpZCwgZGlucHV0LCB4aW5wdXQpLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBBIHN0cmluZyBvZiBnYW1lcGFkIGRhdGEgc291cmNlLlxuICAgKi9cbiAgZ2V0R2FtZXBhZERhdGFTb3VyY2UoKSB7XG4gICAgdmFyIGRhdGFTb3VyY2U7XG4gICAgaWYgKG5hdmlnYXRvci5wbGF0Zm9ybS5tYXRjaCgvXkxpbnV4LykpIHtcbiAgICAgIGRhdGFTb3VyY2UgPSAnbGludXhqb3knO1xuICAgIH0gZWxzZSBpZiAobmF2aWdhdG9yLnBsYXRmb3JtLm1hdGNoKC9eTWFjLykpIHtcbiAgICAgIGRhdGFTb3VyY2UgPSAnaGlkJztcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci5wbGF0Zm9ybS5tYXRjaCgvXldpbi8pKSB7XG4gICAgICB2YXIgbSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goJ0dlY2tvLyguLiknKTtcbiAgICAgIGlmIChtICYmIHBhcnNlSW50KG1bMV0pIDwgMzIpIHtcbiAgICAgICAgZGF0YVNvdXJjZSA9ICdkaW5wdXQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YVNvdXJjZSA9ICdoaWQnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVNvdXJjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG5hbWUgR2FtZXBhZHMjcG9sbFxuICAgKiBAZGVzY3JpcHRpb24gUG9sbCBmb3IgdGhlIGxhdGVzdCBkYXRhIGZyb20gdGhlIGdhbWVwYWQgQVBJLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IEFuIGFycmF5IG9mIGdhbWVwYWRzIGFuZCBtYXBwaW5ncyBmb3IgdGhlIG1vZGVsIG9mIHRoZSBjb25uZWN0ZWQgZ2FtZXBhZC5cbiAgICogQGV4YW1wbGVcbiAgICogICB2YXIgZ2FtZXBhZHMgPSBuZXcgR2FtZXBhZHMoKTtcbiAgICogICB2YXIgcGFkcyA9IGdhbWVwYWRzLnBvbGwoKTtcbiAgICovXG4gIHBvbGwoKSB7XG4gICAgdmFyIHBhZHMgPSBbXTtcblxuICAgIGlmICh0aGlzLmdhbWVwYWRzU3VwcG9ydGVkKSB7XG4gICAgICB2YXIgcGFkc1JhdyA9IHRoaXMuX2dldEdhbWVwYWRzKCk7XG4gICAgICB2YXIgcGFkO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFkc1Jhdy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYWQgPSBwYWRzUmF3W2ldO1xuXG4gICAgICAgIGlmICghcGFkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBwYWQgPSB0aGlzLmV4dGVuZChwYWQpO1xuXG4gICAgICAgIHBhZHMucHVzaChwYWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYWRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbmFtZSBHYW1lcGFkcyNleHRlbmRcbiAgICogQGRlc2NyaXB0aW9uIFNldCBuZXcgcHJvcGVydGllcyBvbiBhIGdhbWVwYWQgb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZ2FtZXBhZCBUaGUgb3JpZ2luYWwgZ2FtZXBhZCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIGV4dGVuZGVkIGNvcHkgb2YgdGhlIGdhbWVwYWQuXG4gICAqL1xuICBleHRlbmQoZ2FtZXBhZCkge1xuICAgIGlmIChnYW1lcGFkLl9leHRlbmRlZCkge1xuICAgICAgcmV0dXJuIGdhbWVwYWQ7XG4gICAgfVxuXG4gICAgdmFyIHBhZCA9IHV0aWxzLmNsb25lKGdhbWVwYWQpO1xuXG4gICAgcGFkLl9leHRlbmRlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5nYW1lcGFkQXR0cmlidXRlc0VuYWJsZWQpIHtcbiAgICAgIHBhZC5hdHRyaWJ1dGVzID0gdGhpcy5fZ2V0QXR0cmlidXRlcyhwYWQpO1xuICAgIH1cblxuICAgIGlmICghcGFkLnRpbWVzdGFtcCkge1xuICAgICAgcGFkLnRpbWVzdGFtcCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nYW1lcGFkSW5kaWNlc0VuYWJsZWQpIHtcbiAgICAgIHBhZC5pbmRpY2VzID0gdGhpcy5fZ2V0SW5kaWNlcyhwYWQpO1xuICAgIH1cblxuICAgIHJldHVybiBwYWQ7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBuYW1lIEdhbWVwYWRzI19nZXRBdHRyaWJ1dGVzXG4gICAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBhdHRyaWJ1dGVzIG9mIGEgZ2FtZXBhZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGdhbWVwYWQgVGhlIGdhbWVwYWQgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYXR0cmlidXRlcyBmb3IgdGhpcyBnYW1lcGFkLlxuICAgKi9cbiAgX2dldEF0dHJpYnV0ZXMoZ2FtZXBhZCkge1xuICAgIHZhciBwYWRJZHMgPSB0aGlzLl9nZXRWZW5kb3JQcm9kdWN0SWRzKGdhbWVwYWQpO1xuICAgIHJldHVybiB7XG4gICAgICB2ZW5kb3JJZDogcGFkSWRzWzBdLFxuICAgICAgcHJvZHVjdElkOiBwYWRJZHNbMV0sXG4gICAgICBuYW1lOiBnYW1lcGFkLmlkLFxuICAgICAgZGF0YVNvdXJjZTogdGhpcy5kYXRhU291cmNlXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG5hbWUgR2FtZXBhZHMjX2dldEluZGljZXNcbiAgICogQGRlc2NyaXB0aW9uIFJldHVybiB0aGUgbmFtZWQgaW5kaWNlcyBvZiBhIGdhbWVwYWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBnYW1lcGFkIFRoZSBnYW1lcGFkIG9iamVjdC5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIG5hbWVkIGluZGljZXMgZm9yIHRoaXMgZ2FtZXBhZC5cbiAgICovXG4gIF9nZXRJbmRpY2VzKGdhbWVwYWQpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRpY2VzW2dhbWVwYWQuaWRdIHx8IHRoaXMuaW5kaWNlcy5zdGFuZGFyZCB8fCB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG5hbWUgR2FtZXBhZHMjX21hcEF4aXNcbiAgICogQGRlc2NyaXB0aW9uIFNldCB0aGUgdmFsdWUgZm9yIG9uZSBvZiB0aGUgYW5hbG9ndWUgYXhlcyBvZiB0aGUgcGFkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYXhpcyBUaGUgYnV0dG9uIHRvIGdldCB0aGUgdmFsdWUgb2YuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSB2YWx1ZSBvZiB0aGUgYXhpcyBiZXR3ZWVuIC0xIGFuZCAxLlxuICAgKi9cbiAgX21hcEF4aXMoYXhpcykge1xuICAgIGlmIChNYXRoLmFicyhheGlzKSA8IHRoaXMuYXhpc1RocmVzaG9sZCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBuYW1lIEdhbWVwYWRzI19tYXBCdXR0b25cbiAgICogQGRlc2NyaXB0aW9uIFNldCB0aGUgdmFsdWUgZm9yIG9uZSBvZiB0aGUgYnV0dG9ucyBvZiB0aGUgcGFkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYnV0dG9uIFRoZSBidXR0b24gdG8gZ2V0IHRoZSB2YWx1ZSBvZi5cbiAgICogQHJldHVybnMge09iamVjdH0gQW4gb2JqZWN0IHJlc2VtYmxpbmcgYSBgR2FtZXBhZEJ1dHRvbmAgb2JqZWN0LlxuICAgKi9cbiAgX21hcEJ1dHRvbihidXR0b24pIHtcbiAgICBpZiAodHlwZW9mIGJ1dHRvbiA9PT0gJ251bWJlcicpIHtcbiAgICAgIC8vIE9sZCB2ZXJzaW9ucyBvZiB0aGUgQVBJIHVzZWQgdG8gcmV0dXJuIGp1c3QgbnVtYmVycyBpbnN0ZWFkXG4gICAgICAvLyBvZiBgR2FtZXBhZEJ1dHRvbmAgb2JqZWN0cy5cbiAgICAgIGJ1dHRvbiA9IG5ldyBHYW1lcGFkQnV0dG9uKHtcbiAgICAgICAgcHJlc3NlZDogYnV0dG9uID09PSAxLFxuICAgICAgICB2YWx1ZTogYnV0dG9uXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgc2V0SW5kaWNlcyhpbmRpY2VzKSB7XG4gICAgdGhpcy5pbmRpY2VzID0gdXRpbHMuY2xvbmUoaW5kaWNlcyk7XG4gIH1cblxuICBmaXJlQ29ubmVjdGlvbkV2ZW50KGdhbWVwYWQsIGNvbm5lY3RlZCkge1xuICAgIHZhciBuYW1lID0gY29ubmVjdGVkID8gJ2dhbWVwYWRjb25uZWN0ZWQnIDogJ2dhbWVwYWRkaXNjb25uZWN0ZWQnO1xuXG4gICAgaWYgKCF0aGlzLmhhc1NlZW5FdmVudChnYW1lcGFkLCBuYW1lLCAnaW50ZXJuYWwnKSkge1xuICAgICAgLy8gRmlyZSBpbnRlcm5hbCBldmVudC5cbiAgICAgIHRoaXMuZW1pdChuYW1lLCBnYW1lcGFkKTtcbiAgICB9XG5cbiAgICAvLyBEb24ndCBmaXJlIHRoZSAnZ2FtZXBhZGNvbm5lY3RlZCcvJ2dhbWVwYWRkaXNjb25uZWN0ZWQnIGV2ZW50cyBpZiB0aGVcbiAgICAvLyBicm93c2VyIGhhcyBhbHJlYWR5IGZpcmVkIHRoZW0uIChVbmZvcnR1bmF0ZWx5LCB3ZSBjYW4ndCBmZWF0dXJlIGRldGVjdFxuICAgIC8vIGlmIHRoZXknbGwgZ2V0IGZpcmVkLilcbiAgICBpZiAoIXRoaXMuaGFzU2VlbkV2ZW50KGdhbWVwYWQsIG5hbWUsICdkb20nKSkge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgZ2FtZXBhZDogZ2FtZXBhZFxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB1dGlscy50cmlnZ2VyRXZlbnQod2luZG93LCBuYW1lLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBmaXJlQnV0dG9uRXZlbnQoZ2FtZXBhZCwgYnV0dG9uLCB2YWx1ZSkge1xuICAgIHZhciBuYW1lID0gdmFsdWUgPT09IDEgPyAnZ2FtZXBhZGJ1dHRvbmRvd24nIDogJ2dhbWVwYWRidXR0b251cCc7XG5cbiAgICAvLyBGaXJlIGludGVybmFsIGV2ZW50LlxuICAgIHRoaXMuZW1pdChuYW1lLCBnYW1lcGFkLCBidXR0b24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLm5vbnN0YW5kYXJkRXZlbnRzRW5hYmxlZCAmJiAhKCdHYW1lcGFkQnV0dG9uRXZlbnQnIGluIHdpbmRvdykpIHtcbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGJ1dHRvbjogYnV0dG9uLFxuICAgICAgICAgIGdhbWVwYWQ6IGdhbWVwYWRcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHV0aWxzLnRyaWdnZXJFdmVudCh3aW5kb3csIG5hbWUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGZpcmVBeGlzTW92ZUV2ZW50KGdhbWVwYWQsIGF4aXMsIHZhbHVlKSB7XG4gICAgdmFyIG5hbWUgPSAnZ2FtZXBhZGF4aXNtb3ZlJztcblxuICAgIC8vIEZpcmUgaW50ZXJuYWwgZXZlbnQuXG4gICAgdGhpcy5lbWl0KG5hbWUsIGdhbWVwYWQsIGF4aXMsIHZhbHVlKTtcblxuICAgIGlmICghdGhpcy5ub25zdGFuZGFyZEV2ZW50c0VuYWJsZWQgfHwgJ0dhbWVwYWRBeGlzTW92ZUV2ZW50JyBpbiB3aW5kb3cpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoTWF0aC5hYnModmFsdWUpIDwgdGhpcy5heGlzVGhyZXNob2xkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGF4aXM6IGF4aXMsXG4gICAgICAgIGdhbWVwYWQ6IGdhbWVwYWQsXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfVxuICAgIH07XG4gICAgdXRpbHMudHJpZ2dlckV2ZW50KHdpbmRvdywgbmFtZSwgZGF0YSk7XG4gIH1cblxuICBmaXJlS2V5RXZlbnQoZ2FtZXBhZCwgYnV0dG9uLCB2YWx1ZSkge1xuICAgIGlmICghdGhpcy5rZXlFdmVudHNFbmFibGVkIHx8ICF0aGlzLmtleUV2ZW50cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBidXR0b25OYW1lID0gdXRpbHMuc3dhcChnYW1lcGFkLmluZGljZXMpW2J1dHRvbl07XG5cbiAgICBpZiAodHlwZW9mIGJ1dHRvbk5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5hbWVzID0gdmFsdWUgPT09IDEgPyBbJ2tleWRvd24nLCAna2V5cHJlc3MnXSA6IFsna2V5dXAnXTtcbiAgICB2YXIgZGF0YSA9IHRoaXMua2V5RXZlbnRzW2J1dHRvbk5hbWVdO1xuXG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCEoJ2J1YmJsZXMnIGluIGRhdGEpKSB7XG4gICAgICBkYXRhLmJ1YmJsZXMgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWRhdGEuZGV0YWlsKSB7XG4gICAgICBkYXRhLmRldGFpbCA9IHt9O1xuICAgIH1cbiAgICBkYXRhLmRldGFpbC5idXR0b24gPSBidXR0b247XG4gICAgZGF0YS5kZXRhaWwuZ2FtZXBhZCA9IGdhbWVwYWQ7XG5cbiAgICBuYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgdXRpbHMudHJpZ2dlckV2ZW50KGRhdGEudGFyZ2V0IHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsIG5hbWUsIGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkU2VlbkV2ZW50KGdhbWVwYWQsIGV2ZW50VHlwZSwgbmFtZXNwYWNlKSB7XG4gICAgdmFyIGtleSA9IFtnYW1lcGFkLmluZGV4LCBldmVudFR5cGUsIG5hbWVzcGFjZV0uam9pbignLicpO1xuXG4gICAgdGhpcy5fc2VlbkV2ZW50c1trZXldID0gdHJ1ZTtcbiAgfVxuXG4gIGhhc1NlZW5FdmVudChnYW1lcGFkLCBldmVudFR5cGUsIG5hbWVzcGFjZSkge1xuICAgIHZhciBrZXkgPSBbZ2FtZXBhZC5pbmRleCwgZXZlbnRUeXBlLCBuYW1lc3BhY2VdLmpvaW4oJy4nKTtcblxuICAgIHJldHVybiAhIXRoaXMuX3NlZW5FdmVudHNba2V5XTtcbiAgfVxuXG4gIHJlbW92ZVNlZW5FdmVudChnYW1lcGFkLCBldmVudFR5cGUsIG5hbWVzcGFjZSkge1xuICAgIHZhciBrZXkgPSBbZ2FtZXBhZC5pbmRleCwgZXZlbnRUeXBlLCBuYW1lc3BhY2VdLmpvaW4oJy4nKTtcblxuICAgIGRlbGV0ZSB0aGlzLl9zZWVuRXZlbnRzW2tleV07XG4gIH1cblxuICBidXR0b25FdmVudDJheGlzRXZlbnQoZSkge1xuICAgIGlmIChlLnR5cGUgPT09ICdnYW1lcGFkYnV0dG9uZG93bicpIHtcbiAgICAgIGUuYXhpcyA9IGUuYnV0dG9uO1xuICAgICAgZS52YWx1ZSA9IDEuMDtcbiAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ2dhbWVwYWRidXR0b251cCcpIHtcbiAgICAgIGUuYXhpcyA9IGUuYnV0dG9uO1xuICAgICAgZS52YWx1ZSA9IDAuMDtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIGEgYGJ1dHRvbmAgaW5kZXggZXF1YWxzIHRoZSBzdXBwbGllZCBga2V5YC5cbiAgICpcbiAgICogVXNlZnVsIGZvciBkZXRlcm1pbmluZyB3aGV0aGVyIGBgbmF2aWdhdG9yLmdldEdhbWVwYWRzKClbMF0uYnV0dG9uc1tgJGJ1dHRvbmBdYGBcbiAgICogaGFzIGFueSBiaW5kaW5ncyBkZWZpbmVkIChpbiBgRnJhbWVNYW5hZ2VyYCkuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBidXR0b24gSW5kZXggb2YgZ2FtZXBhZCBidXR0b24gKGUuZy4sIGA0YCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgSHVtYW4tcmVhZGFibGUgZm9ybWF0IGZvciBidXR0b24gYmluZGluZyAoZS5nLiwgJ2I0JykuXG4gICAqL1xuICBfYnV0dG9uRG93bkVxdWFsc0tleShidXR0b24sIGtleSkge1xuICAgIHJldHVybiAnYicgKyBidXR0b24gKyAnLmRvd24nID09PSBrZXkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBfYnV0dG9uVXBFcXVhbHNLZXkoYnV0dG9uLCBrZXkpIHtcbiAgICB2YXIga2V5Q2xlYW4gPSBrZXkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIChcbiAgICAgICdiJyArIGJ1dHRvbiArICcudXAnID09PSBrZXlDbGVhbiB8fFxuICAgICAgJ2InICsgYnV0dG9uID09PSBrZXlDbGVhblxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIGFuIGBheGlzYCBpbmRleCBlcXVhbHMgdGhlIHN1cHBsaWVkIGBrZXlgLlxuICAgKlxuICAgKiBVc2VmdWwgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgYGBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKVswXS5heGVzW2AkYnV0dG9uYF1gYFxuICAgKiBoYXMgYW55IGJpbmRpbmdzIGRlZmluZWQgKGluIGBGcmFtZU1hbmFnZXJgKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJ1dHRvbiBJbmRleCBvZiBnYW1lcGFkIGF4aXMgKGUuZy4sIGAxYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgSHVtYW4tcmVhZGFibGUgZm9ybWF0IGZvciBidXR0b24gYmluZGluZyAoZS5nLiwgJ2ExJykuXG4gICAqL1xuICBfYXhpc01vdmVFcXVhbHNLZXkoYXhpcywga2V5KSB7XG4gICAgcmV0dXJuICdhJyArIGF4aXMgPT09IGtleS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBhbnkgYmluZGluZ3MgZGVmaW5lZCBmb3IgJ2Nvbm5lY3RlZCcgKGluIGBGcmFtZU1hbmFnZXJgKS5cbiAgICpcbiAgICogKENhbGxlZCBieSBldmVudCBsaXN0ZW5lciBmb3IgYGdhbWVwYWRjb25uZWN0ZWRgLilcbiAgICpcbiAgICogQHBhcmFtIHtHYW1lcGFkfSBnYW1lcGFkIEdhbWVwYWQgb2JqZWN0IChhZnRlciBpdCdzIGJlZW4gd3JhcHBlZCBieSBnYW1lcGFkLXBsdXMpLlxuICAgKi9cbiAgX29uR2FtZXBhZENvbm5lY3RlZChnYW1lcGFkKSB7XG4gICAgaWYgKCdjb25uZWN0ZWQnIGluIGdhbWVwYWQuaW5kaWNlcykge1xuICAgICAgZ2FtZXBhZC5pbmRpY2VzLmNvbm5lY3RlZChnYW1lcGFkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYW55IGJpbmRpbmdzIGRlZmluZWQgZm9yICdkaXNjb25uZWN0ZWQnIChpbiBgRnJhbWVNYW5hZ2VyYCkuXG4gICAqXG4gICAqIChDYWxsZWQgYnkgZXZlbnQgbGlzdGVuZXIgZm9yIGBnYW1lcGFkY29ubmVjdGVkYC4pXG4gICAqXG4gICAqIEBwYXJhbSB7R2FtZXBhZH0gZ2FtZXBhZCBHYW1lcGFkIG9iamVjdCAoYWZ0ZXIgaXQncyBiZWVuIHdyYXBwZWQgYnkgZ2FtZXBhZC1wbHVzKS5cbiAgICovXG4gIF9vbkdhbWVwYWREaXNjb25uZWN0ZWQoZ2FtZXBhZCkge1xuICAgIGlmICgnZGlzY29ubmVjdGVkJyBpbiBnYW1lcGFkLmluZGljZXMpIHtcbiAgICAgIGdhbWVwYWQuaW5kaWNlcy5kaXNjb25uZWN0ZWQoZ2FtZXBhZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIGFueSBiaW5kaW5ncyBkZWZpbmVkIGZvciBidXR0b25zIChlLmcuLCAnYjQudXAnIGluIGBGcmFtZU1hbmFnZXJgKS5cbiAgICpcbiAgICogKENhbGxlZCBieSBldmVudCBsaXN0ZW5lciBmb3IgYGdhbWVwYWRjb25uZWN0ZWRgLilcbiAgICpcbiAgICogQHBhcmFtIHtHYW1lcGFkfSBnYW1lcGFkIEdhbWVwYWQgb2JqZWN0IChhZnRlciBpdCdzIGJlZW4gd3JhcHBlZCBieSBnYW1lcGFkLXBsdXMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYnV0dG9uIEluZGV4IG9mIGdhbWVwYWQgYnV0dG9uIChpbnRlZ2VyKSBiZWluZyBwcmVzc2VkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgKHBlciBgZ2FtZXBhZGJ1dHRvbmRvd25gIGV2ZW50KS5cbiAgICovXG4gIF9vbkdhbWVwYWRCdXR0b25Eb3duKGdhbWVwYWQsIGJ1dHRvbikge1xuICAgIGZvciAodmFyIGtleSBpbiBnYW1lcGFkLmluZGljZXMpIHtcbiAgICAgIGlmICh0aGlzLl9idXR0b25Eb3duRXF1YWxzS2V5KGJ1dHRvbiwga2V5KSkge1xuICAgICAgICBnYW1lcGFkLmluZGljZXNba2V5XShnYW1lcGFkLCBidXR0b24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBhbnkgYmluZGluZ3MgZGVmaW5lZCBmb3IgYnV0dG9ucyAoZS5nLiwgJ2I0LmRvd24nIGluIGBGcmFtZU1hbmFnZXJgKS5cbiAgICpcbiAgICogKENhbGxlZCBieSBldmVudCBsaXN0ZW5lciBmb3IgYGdhbWVwYWRjb25uZWN0ZWRgLilcbiAgICpcbiAgICogQHBhcmFtIHtHYW1lcGFkfSBnYW1lcGFkIEdhbWVwYWQgb2JqZWN0IChhZnRlciBpdCdzIGJlZW4gd3JhcHBlZCBieSBnYW1lcGFkLXBsdXMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYnV0dG9uIEluZGV4IG9mIGdhbWVwYWQgYnV0dG9uIChpbnRlZ2VyKSBiZWluZyByZWxlYXNlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIChwZXIgYGdhbWVwYWRidXR0b251cGAgZXZlbnQpLlxuICAgKi9cbiAgX29uR2FtZXBhZEJ1dHRvblVwKGdhbWVwYWQsIGJ1dHRvbikge1xuICAgIGZvciAodmFyIGtleSBpbiBnYW1lcGFkLmluZGljZXMpIHtcbiAgICAgIGlmICh0aGlzLl9idXR0b25VcEVxdWFsc0tleShidXR0b24sIGtleSkpIHtcbiAgICAgICAgZ2FtZXBhZC5pbmRpY2VzW2tleV0oZ2FtZXBhZCwgYnV0dG9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYW55IGJpbmRpbmdzIGRlZmluZWQgZm9yIGF4ZXMgKGUuZy4sICdhMScgaW4gYEZyYW1lTWFuYWdlcmApLlxuICAgKlxuICAgKiAoQ2FsbGVkIGJ5IGV2ZW50IGxpc3RlbmVyIGZvciBgZ2FtZXBhZGF4aXNtb3ZlYC4pXG4gICAqXG4gICAqIEBwYXJhbSB7R2FtZXBhZH0gZ2FtZXBhZCBHYW1lcGFkIG9iamVjdCAoYWZ0ZXIgaXQncyBiZWVuIHdyYXBwZWQgYnkgZ2FtZXBhZC1wbHVzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGF4aXMgSW5kZXggb2YgZ2FtZXBhZCBheGlzIChpbnRlZ2VyKSBiZWluZyBjaGFuZ2VkXG4gICAqICAgICAgICAgICAgICAgICAgICAgIChwZXIgYGdhbWVwYWRheGlzbW92ZWAgZXZlbnQpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgVmFsdWUgb2YgZ2FtZXBhZCBheGlzIChmcm9tIC0xLjAgdG8gMS4wKSBiZWluZ1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCAocGVyIGBnYW1lcGFkYXhpc21vdmVgIGV2ZW50KS5cbiAgICovXG4gIF9vbkdhbWVwYWRBeGlzTW92ZShnYW1lcGFkLCBheGlzLCB2YWx1ZSkge1xuICAgIGZvciAodmFyIGtleSBpbiBnYW1lcGFkLmluZGljZXMpIHtcbiAgICAgIGlmICh0aGlzLl9heGlzTW92ZUVxdWFsc0tleShheGlzLCBrZXkpKSB7XG4gICAgICAgIGdhbWVwYWQuaW5kaWNlc1trZXldKGdhbWVwYWQsIGF4aXMsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5HYW1lcGFkcy51dGlscyA9IHV0aWxzO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJyb3dzZXIgPSB0aGlzLmdldEJyb3dzZXIoKTtcbiAgICB0aGlzLmVuZ2luZSA9IHRoaXMuZ2V0RW5naW5lKHRoaXMuYnJvd3Nlcik7XG4gIH1cblxuICBjbG9uZShvYmopIHtcbiAgICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicgfHwgIShvYmogaW5zdGFuY2VvZiBPYmplY3QpKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHZhciByZXQgPSAnJztcblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICByZXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgcmV0LnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHJldFtpXSA9IHRoaXMuY2xvbmUob2JqW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgcmV0ID0ge307XG4gICAgICBmb3IgKHZhciBhdHRyIGluIG9iaikge1xuICAgICAgICBpZiAoYXR0ciBpbiBvYmopIHtcbiAgICAgICAgICByZXRbYXR0cl0gPSB0aGlzLmNsb25lKG9ialthdHRyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY2xvbmUgb2JqZWN0IG9mIHVuZXhwZWN0ZWQgdHlwZSEnKTtcbiAgfVxuXG4gIHN3YXAob2JqKSB7XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIGZvciAodmFyIGF0dHIgaW4gb2JqKSB7XG4gICAgICBpZiAoYXR0ciBpbiBvYmopIHtcbiAgICAgICAgcmV0W29ialthdHRyXV0gPSBhdHRyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZ2V0QnJvd3NlcigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoISF3aW5kb3cub3BlcmEgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCcgT1BSLycpID49IDApIHtcbiAgICAgIC8vIE9wZXJhIDguMCsgKFVBIGRldGVjdGlvbiB0byBkZXRlY3QgQmxpbmsvdjgtcG93ZXJlZCBPcGVyYSkuXG4gICAgICByZXR1cm4gJ29wZXJhJztcbiAgICB9IGVsc2UgaWYgKCdjaHJvbWUnIGluIHdpbmRvdykge1xuICAgICAgLy8gQ2hyb21lIDErLlxuICAgICAgcmV0dXJuICdjaHJvbWUnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIEluc3RhbGxUcmlnZ2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gRmlyZWZveCAxLjArLlxuICAgICAgcmV0dXJuICdmaXJlZm94JztcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh3aW5kb3cuSFRNTEVsZW1lbnQpLmluZGV4T2YoJ0NvbnN0cnVjdG9yJykgPiAwKSB7XG4gICAgICAvLyBBdCBsZWFzdCBTYWZhcmkgMys6IFwiW29iamVjdCBIVE1MRWxlbWVudENvbnN0cnVjdG9yXVwiLlxuICAgICAgcmV0dXJuICdzYWZhcmknO1xuICAgIH0gZWxzZSBpZiAoLypAY2Nfb24hQCovZmFsc2UgfHwgISFkb2N1bWVudC5kb2N1bWVudE1vZGUpIHtcbiAgICAgIC8vIEF0IGxlYXN0IElFNi5cbiAgICAgIHJldHVybiAnaWUnO1xuICAgIH1cbiAgfVxuXG4gIGdldEVuZ2luZShicm93c2VyKSB7XG4gICAgYnJvd3NlciA9IGJyb3dzZXIgfHwgdGhpcy5nZXRCcm93c2VyKCk7XG5cbiAgICBpZiAoYnJvd3NlciA9PT0gJ2ZpcmVmb3gnKSB7XG4gICAgICByZXR1cm4gJ2dlY2tvJztcbiAgICB9IGVsc2UgaWYgKGJyb3dzZXIgPT09ICdvcGVyYScgfHwgYnJvd3NlciA9PT0gJ2Nocm9tZScgfHwgYnJvd3NlciA9PT0gJ3NhZmFyaScpIHtcbiAgICAgIHJldHVybiAnd2Via2l0JztcbiAgICB9IGVsc2UgaWYgKGJyb3dzZXIgPT09ICdpZScpIHtcbiAgICAgIHJldHVybiAndHJpZGVudCc7XG4gICAgfVxuICB9XG5cbiAgc3RyaXBMZWFkaW5nWmVyb3Moc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL14wKyg/PVxcZCspL2csICcnKTtcbiAgfVxuXG4gIHRyaWdnZXJFdmVudChlbCwgbmFtZSwgZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgIGRhdGEuZGV0YWlsID0gZGF0YS5kZXRhaWwgfHwge307XG5cbiAgICB2YXIgZXZlbnQ7XG5cbiAgICBpZiAoJ0N1c3RvbUV2ZW50JyBpbiB3aW5kb3cpIHtcbiAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUsIGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgZXZlbnQuaW5pdEN1c3RvbUV2ZW50KG5hbWUsIGRhdGEuYnViYmxlcywgZGF0YS5jYW5jZWxhYmxlLCBkYXRhLmRldGFpbCk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoZGF0YS5kZXRhaWwpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgZXZlbnRba2V5XSA9IGRhdGEuZGV0YWlsW2tleV07XG4gICAgfSk7XG5cbiAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxufVxuIl19
