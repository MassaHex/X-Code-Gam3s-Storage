/*
 * Copyright 2012 Priit Kallas <kallaspriit@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(exports) {
	'use strict';

	/**
	 * A null function - does nothing, returns nothing
	 */
	var nullFunction = function() {};

	/**
	 * The null platform, which doesn't support anything
	 */
	var nullPlatform = {
		getType: function() {
			return 'null';
		},
		isSupported: function() {
			return false;
		},
		update: nullFunction
	};

	/**
	 * This strategy uses a timer function to call an update function.
	 * The timer (re)start function can be provided or the strategy reverts to
	 * one of the window.*requestAnimationFrame variants.
	 *
	 * @class AnimFrameUpdateStrategy
	 * @constructor
	 * @param {Function} [requestAnimationFrame] function to use for timer creation
	 * @module apppad
	 */
	var AnimFrameUpdateStrategy = function(requestAnimationFrame) {
		var that = this;
		var win = window;

		this.update = nullFunction;

		this.requestAnimationFrame = requestAnimationFrame || win.requestAnimationFrame ||
			win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame;

		/**
		 * This method calls the (user) update and restarts itself
		 * @method tickFunction
		 */
		this.tickFunction = function() {
			that.update();
			that.startTicker();
		};

		/**
		 * (Re)Starts the ticker
		 * @method startTicker
		 */
		this.startTicker = function() {
			that.requestAnimationFrame.apply(win, [that.tickFunction]);
		};
	};

	/**
	 * Starts the update strategy using the given function
	 *
	 * @method start
	 * @param {Function} updateFunction the function to call at each update
	 */
	AnimFrameUpdateStrategy.prototype.start = function(updateFunction) {
		this.update = updateFunction || nullFunction;
		this.startTicker();
	};

	/**
	 * This strategy gives the user the ability to call the library internal
	 * update function on request. Use this strategy if you already have a
	 * timer function running by requestAnimationFrame and you need fine control
	 * over when the apppads are updated.
	 *
	 * @class ManualUpdateStrategy
	 * @constructor
	 * @module apppad
	 */
	var ManualUpdateStrategy = function() {

	};

	/**
	 * Calls the update function in the started state. Does nothing otherwise.
	 * @method update
	 */
	ManualUpdateStrategy.prototype.update = nullFunction;

	/**
	 * Starts the update strategy using the given function
	 *
	 * @method start
	 * @param {Function} updateFunction the function to call at each update
	 */
	ManualUpdateStrategy.prototype.start = function(updateFunction) {
		this.update = updateFunction || nullFunction;
	};

	/**
	 * This platform is for webkit based environments that need to be polled
	 * for updates.
	 *
	 * @class WebKitPlatform
	 * @constructor
	 * @param {Object} listener the listener to provide _connect and _disconnect callbacks
	 * @param {Function} apppadGetter the poll function to return an array of connected apppads
	 * @module apppad
	 */
	var WebKitPlatform = function(listener, apppadGetter) {
		this.listener = listener;
		this.apppadGetter = apppadGetter;
		this.knownapppads = [];
	};

	/**
	 * Provides a platform object that returns true for is isSupported() if valid.
	 * @method factory
	 * @static
	 * @param {Object} listener the listener to use
	 * @return {Object} a platform object
	 */
	WebKitPlatform.factory = function(listener) {
		var platform = nullPlatform;
		var navigator = window && window.navigator;

		if (navigator) {
			if (typeof(navigator.webkitapppads) !== 'undefined') {
				platform = new WebKitPlatform(listener, function() {
					return navigator.webkitapppads;
				});
			} else if (typeof(navigator.webkitGetapppads) !== 'undefined') {
				platform = new WebKitPlatform(listener, function() {
					return navigator.webkitGetapppads();
				});
			}
		}

		return platform;
	};

	/**
	 * @method getType()
	 * @static
	 * @return {String} 'WebKit'
	 */
	WebKitPlatform.getType = function() {
		return 'WebKit';
	},

	/**
	 * @method getType()
	 * @return {String} 'WebKit'
	 */
	WebKitPlatform.prototype.getType = function() {
		return WebKitPlatform.getType();
	},

	/**
	 * @method isSupported
	 * @return {Boolean} true
	 */
	WebKitPlatform.prototype.isSupported = function() {
		return true;
	};

	/**
	 * Queries the currently connected apppads and reports any changes.
	 * @method update
	 */
	WebKitPlatform.prototype.update = function() {
		var that = this;
		var apppads = Array.prototype.slice.call(this.apppadGetter(), 0);
		var apppad;
		var i;

		for (i = this.knownapppads.length - 1; i >= 0; i--) {
			apppad = this.knownapppads[i];
			if (apppads.indexOf(apppad) < 0) {
				this.knownapppads.splice(i, 1);
				this.listener._disconnect(apppad);
			}
		}

		for (i = 0; i < apppads.length; i++) {
			apppad = apppads[i];
			if (apppad && (that.knownapppads.indexOf(apppad) < 0)) {
				that.knownapppads.push(apppad);
				that.listener._connect(apppad);
			}
		}
	};

	/**
	 * This platform is for mozilla based environments that provide apppad
	 * updates via events.
	 *
	 * @class FirefoxPlatform
	 * @constructor
	 * @module apppad
	 */
	var FirefoxPlatform = function(listener) {
		this.listener = listener;

		window.addEventListener('apppadconnected', function(e) {
			listener._connect(e.apppad);
		});
		window.addEventListener('apppaddisconnected', function(e) {
			listener._disconnect(e.apppad);
		});
	};

	/**
	 * Provides a platform object that returns true for is isSupported() if valid.
	 * @method factory
	 * @static
	 * @param {Object} listener the listener to use
	 * @return {Object} a platform object
	 */
	FirefoxPlatform.factory = function(listener) {
		var platform = nullPlatform;

		if (window && (typeof(window.addEventListener) !== 'undefined')) {
			platform = new FirefoxPlatform(listener);
		}

		return platform;
	};

	/**
	 * @method getType()
	 * @static
	 * @return {String} 'Firefox'
	 */
	FirefoxPlatform.getType = function() {
		return 'Firefox';
	},

	/**
	 * @method getType()
	 * @return {String} 'Firefox'
	 */
	FirefoxPlatform.prototype.getType = function() {
		return FirefoxPlatform.getType();
	},

	/**
	 * @method isSupported
	 * @return {Boolean} true
	 */
	FirefoxPlatform.prototype.isSupported = function() {
		return true;
	};

	/**
	 * Does nothing on the Firefox platform
	 * @method update
	 */
	FirefoxPlatform.prototype.update = nullFunction;

	/**
	 * Provides simple interface and multi-platform support for the apppad API.
	 *
	 * You can change the deadzone and maximizeThreshold parameters to suit your
	 * taste but the defaults should generally work fine.
	 *
	 * @class apppad
	 * @constructor
	 * @param {Object} [updateStrategy] an update strategy, defaulting to
	 *		{{#crossLink "AnimFrameUpdateStrategy"}}{{/crossLink}}
	 * @module apppad
	 * @author Priit Kallas <kallaspriit@gmail.com>
	 */
	var apppad = function(updateStrategy) {
		this.updateStrategy = updateStrategy || new AnimFrameUpdateStrategy();
		this.apppads = [];
		this.listeners = {};
		this.platform = nullPlatform;
		this.deadzone = 0.03;
		this.maximizeThreshold = 0.97;
	};

	/**
	 * The available update strategies
	 * @property UpdateStrategies
	 * @param {AnimFrameUpdateStrategy} AnimFrameUpdateStrategy
	 * @param {ManualUpdateStrategy} ManualUpdateStrategy
	 */
	apppad.UpdateStrategies = {
		AnimFrameUpdateStrategy: AnimFrameUpdateStrategy,
		ManualUpdateStrategy: ManualUpdateStrategy
	};

	/**
	 * List of factories of supported platforms. Currently available platforms:
	 * {{#crossLink "WebKitPlatform"}}{{/crossLink}},
	 * {{#crossLink "FirefoxPlatform"}}{{/crossLink}},
	 * @property PlatformFactories
	 * @type {Array}
	 */
	apppad.PlatformFactories = [WebKitPlatform.factory, FirefoxPlatform.factory];

	/**
	 * List of supported controller types.
	 *
	 * @property Type
	 * @param {String} Type.PLAYSTATION Playstation controller
	 * @param {String} Type.LOGITECH Logitech controller
	 * @param {String} Type.XBOX XBOX controller
	 * @param {String} Type.UNKNOWN Unknown controller
	 */
	apppad.Type = {
		PLAYSTATION: 'playstation',
		LOGITECH: 'logitech',
		XBOX: 'xbox',
		UNKNOWN: 'unknown'
	};

	/*
	 * List of events you can expect from the library.
	 *
	 * CONNECTED, DISCONNECTED and UNSUPPORTED events include the apppad in
	 * question and tick provides the list of all connected apppads.
	 *
	 * BUTTON_DOWN and BUTTON_UP events provide an alternative to polling button states at each tick.
	 *
	 * AXIS_CHANGED is called if a value of some specific axis changes.
	 */
	apppad.Event = {
		/**
		 * Triggered when a new controller connects.
		 *
		 * @event connected
		 * @param {Object} device
		 */
		CONNECTED: 'connected',

		/**
		 * Called when an unsupported controller connects.
		 *
		 * @event unsupported
		 * @param {Object} device
		 * @deprecated not used anymore. Any controller is supported.
		 */
		UNSUPPORTED: 'unsupported',

		/**
		 * Triggered when a controller disconnects.
		 *
		 * @event disconnected
		 * @param {Object} device
		 */
		DISCONNECTED: 'disconnected',

		/**
		 * Called regularly with the latest controllers info.
		 *
		 * @event tick
		 * @param {Array} apppads
		 */
		TICK: 'tick',

		/**
		 * Called when a apppad button is pressed down.
		 *
		 * @event button-down
		 * @param {Object} event
		 * @param {Object} event.apppad The apppad object
		 * @param {String} event.control Control name
		 */
		BUTTON_DOWN: 'button-down',

		/**
		 * Called when a apppad button is released.
		 *
		 * @event button-up
		 * @param {Object} event
		 * @param {Object} event.apppad The apppad object
		 * @param {String} event.control Control name
		 */
		BUTTON_UP: 'button-up',

		/**
		 * Called when apppad axis value changed.
		 *
		 * @event axis-changed
		 * @param {Object} event
		 * @param {Object} event.apppad The apppad object
		 * @param {String} event.axis Axis name
		 * @param {Number} event.value New axis value
		 */
		AXIS_CHANGED: 'axis-changed'
	};

	/**
	 * List of standard button names. The index is the according standard button
	 * index as per standard.
	 *
	 * @property StandardButtons
	 */
	apppad.StandardButtons = [
		'FACE_1', 'FACE_2', 'FACE_3', 'FACE_4',
		'LEFT_TOP_SHOULDER', 'RIGHT_TOP_SHOULDER', 'LEFT_BOTTOM_SHOULDER', 'RIGHT_BOTTOM_SHOULDER',
		'SELECT_BACK', 'START_FORWARD', 'LEFT_STICK', 'RIGHT_STICK',
		'DPAD_UP', 'DPAD_DOWN', 'DPAD_LEFT', 'DPAD_RIGHT',
		'HOME'
	];

	/**
	 * List of standard axis names. The index is the according standard axis
	 * index as per standard.
	 *
	 * @property StandardAxes
	 */
	apppad.StandardAxes = ['LEFT_STICK_X', 'LEFT_STICK_Y', 'RIGHT_STICK_X', 'RIGHT_STICK_Y'];

	var getControlName = function(names, index, extraPrefix) {
		return (index < names.length) ? names[index] : extraPrefix + (index - names.length + 1);
	};

	/**
	 * The standard mapping that represents the mapping as per definition.
	 * Each button and axis map to the same index.
	 *
	 * @property StandardMapping
	 */
	apppad.StandardMapping = {
		env: {},
		buttons: {
			byButton: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
		},
		axes: {
			byAxis: [0, 1, 2, 3]
		}
	};

	/**
	 * Mapping of various apppads that differ from the standard mapping on
	 * different platforms too unify their buttons and axes.
	 *
	 * Each mapping should have an 'env' object, which describes the environment
	 * in which the mapping is active. The more entries such an environment has,
	 * the more specific it is.
	 *
	 * Mappings are expressed for both buttons and axes. Buttons might refer to
	 * axes if they are notified as such.
	 *
	 * @property Mappings
	 */
	apppad.Mappings = [
		// PS3 controller on Firefox
		{
			env: {
				platform: FirefoxPlatform.getType(),
				type: apppad.Type.PLAYSTATION
			},
			buttons: {
				byButton: [14, 13, 15, 12, 10, 11, 8, 9, 0, 3, 1, 2, 4, 6, 7, 5, 16]
			},
			axes: {
				byAxis: [0, 1, 2, 3]
			}
		},
		// Logitech apppad on WebKit
		{
			env: {
				platform: WebKitPlatform.getType(),
				type: apppad.Type.LOGITECH
			},
			buttons: { // TODO: This can't be right - LEFT/RIGHT_STICK have same mappings as HOME/DPAD_UP
				byButton: [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14, 10]
			},
			axes: {
				byAxis: [0, 1, 2, 3]
			}
		},
		// Logitech apppad on Firefox
		{
			env: {
				platform: FirefoxPlatform.getType(),
				type: apppad.Type.LOGITECH
			},
			buttons: {
				byButton: [0, 1, 2, 3, 4, 5, -1, -1, 6, 7, 8, 9, 11, 12, 13, 14, 10],
				byAxis: [-1, -1, -1, -1, -1, -1, [2, 0, 1],
					[2, 0, -1]
				]
			},
			axes: {
				byAxis: [0, 1, 3, 4]
			}
		}
	];

	/**
	 * Initializes the apppad.
	 *
	 * You usually want to bind to the events first and then initialize it.
	 *
	 * @method init
	 * @return {Boolean} true if a supporting platform was detected, false otherwise.
	 */
	apppad.prototype.init = function() {
		var platform = apppad.resolvePlatform(this);
		var that = this;

		this.platform = platform;
		this.updateStrategy.start(function() {
			that._update();
		});

		return platform.isSupported();
	};

	/**
	 * Binds a listener to a apppad event.
	 *
	 * @method bind
	 * @param {String} event Event to bind to, one of apppad.Event..
	 * @param {Function} listener Listener to call when given event occurs
	 * @return {apppad} Self
	 */
	apppad.prototype.bind = function(event, listener) {
		if (typeof(this.listeners[event]) === 'undefined') {
			this.listeners[event] = [];
		}

		this.listeners[event].push(listener);

		return this;
	};

	/**
	 * Removes listener of given type.
	 *
	 * If no type is given, all listeners are removed. If no listener is given, all
	 * listeners of given type are removed.
	 *
	 * @method unbind
	 * @param {String} [type] Type of listener to remove
	 * @param {Function} [listener] The listener function to remove
	 * @return {Boolean} Was unbinding the listener successful
	 */
	apppad.prototype.unbind = function(type, listener) {
		if (typeof(type) === 'undefined') {
			this.listeners = {};

			return;
		}

		if (typeof(listener) === 'undefined') {
			this.listeners[type] = [];

			return;
		}

		if (typeof(this.listeners[type]) === 'undefined') {
			return false;
		}

		for (var i = 0; i < this.listeners[type].length; i++) {
			if (this.listeners[type][i] === listener) {
				this.listeners[type].splice(i, 1);

				return true;
			}
		}

		return false;
	};

	/**
	 * Returns the number of connected apppads.
	 *
	 * @method count
	 * @return {Number}
	 */
	apppad.prototype.count = function() {
		return this.apppads.length;
	};

	/**
	 * Fires an internal event with given data.
	 *
	 * @method _fire
	 * @param {String} event Event to fire, one of apppad.Event..
	 * @param {*} data Data to pass to the listener
	 * @private
	 */
	apppad.prototype._fire = function(event, data) {
		if (typeof(this.listeners[event]) === 'undefined') {
			return;
		}

		for (var i = 0; i < this.listeners[event].length; i++) {
			this.listeners[event][i].apply(this.listeners[event][i], [data]);
		}
	};

	/**
	 * @method getNullPlatform
	 * @static
	 * @return {Object} a platform that does not support anything
	 */
	apppad.getNullPlatform = function() {
		return Object.create(nullPlatform);
	};

	/**
	 * Resolves platform.
	 *
	 * @method resolvePlatform
	 * @static
	 * @param listener {Object} the listener to handle _connect() or _disconnect() calls
	 * @return {Object} A platform instance
	 */
	apppad.resolvePlatform = function(listener) {
		var platform = nullPlatform;
		var i;

		for (i = 0; !platform.isSupported() && (i < apppad.PlatformFactories.length); i++) {
			platform = apppad.PlatformFactories[i](listener);
		}

		return platform;
	};

	/**
	 * Registers given apppad.
	 *
	 * @method _connect
	 * @param {Object} apppad apppad to connect to
	 * @private
	 */
	apppad.prototype._connect = function(apppad) {
		var mapping = this._resolveMapping(apppad);
		var count;
		var i;

		//apppad.mapping = this._resolveMapping(apppad);
		apppad.state = {};
		apppad.lastState = {};
		apppad.updater = [];

		count = mapping.buttons.byButton.length;
		for (i = 0; i < count; i++) {
			this._addButtonUpdater(apppad, mapping, i);
		}

		count = mapping.axes.byAxis.length;
		for (i = 0; i < count; i++) {
			this._addAxisUpdater(apppad, mapping, i);
		}

		this.apppads[apppad.index] = apppad;

		this._fire(apppad.Event.CONNECTED, apppad);
	};

	/**
	 * Adds an updater for a button control
	 *
	 * @method _addButtonUpdater
	 * @private
	 * @param {Object} apppad the apppad for which to create the updater
	 * @param {Object} mapping the mapping on which to work on
	 * @param {Number} index button index
	 */
	apppad.prototype._addButtonUpdater = function(apppad, mapping, index) {
		var updater = nullFunction;
		var controlName = getControlName(apppad.StandardButtons, index, 'EXTRA_BUTTON_');
		var getter = this._createButtonGetter(apppad, mapping.buttons, index);
		var that = this;
		var buttonEventData = {
			apppad: apppad,
			control: controlName
		};

		apppad.state[controlName] = 0;
		apppad.lastState[controlName] = 0;

		updater = function() {
			var value = getter();
			var lastValue = apppad.lastState[controlName];
			var isDown = value > 0.5;
			var wasDown = lastValue > 0.5;

			apppad.state[controlName] = value;

			if (isDown && !wasDown) {
				that._fire(apppad.Event.BUTTON_DOWN, Object.create(buttonEventData));
			} else if (!isDown && wasDown) {
				that._fire(apppad.Event.BUTTON_UP, Object.create(buttonEventData));
			}

			if ((value !== 0) && (value !== 1) && (value !== lastValue)) {
				that._fireAxisChangedEvent(apppad, controlName, value);
			}

			apppad.lastState[controlName] = value;
		};

		apppad.updater.push(updater);
	};

	/**
	 * Adds an updater for an axis control
	 *
	 * @method _addAxisUpdater
	 * @private
	 * @param {Object} apppad the apppad for which to create the updater
	 * @param {Object} mapping the mapping on which to work on
	 * @param {Number} index axis index
	 */
	apppad.prototype._addAxisUpdater = function(apppad, mapping, index) {
		var updater = nullFunction;
		var controlName = getControlName(apppad.StandardAxes, index, 'EXTRA_AXIS_');
		var getter = this._createAxisGetter(apppad, mapping.axes, index);
		var that = this;

		apppad.state[controlName] = 0;
		apppad.lastState[controlName] = 0;

		updater = function() {
			var value = getter();
			var lastValue = apppad.lastState[controlName];

			apppad.state[controlName] = value;

			if ((value !== lastValue)) {
				that._fireAxisChangedEvent(apppad, controlName, value);
			}

			apppad.lastState[controlName] = value;
		};

		apppad.updater.push(updater);
	};

	/**
	 * Fires an AXIS_CHANGED event
	 * @method _fireAxisChangedEvent
	 * @private
	 * @param {Object} apppad the apppad to notify for
	 * @param {String} controlName name of the control that changes its value
	 * @param {Number} value the new value
	 */
	apppad.prototype._fireAxisChangedEvent = function(apppad, controlName, value) {
		var eventData = {
			apppad: apppad,
			axis: controlName,
			value: value
		};

		this._fire(apppad.Event.AXIS_CHANGED, eventData);
	};

	/**
	 * Creates a getter according to the mapping entry for the specific index.
	 * Currently supported entries:
	 *
	 * buttons.byButton[index]: Number := Index into apppad.buttons; -1 tests byAxis
	 * buttons.byAxis[index]: Array := [Index into apppad.axes; Zero Value, One Value]
	 *
	 * @method _createButtonGetter
	 * @private
	 * @param {Object} apppad the apppad for which to create a getter
	 * @param {Object} buttons the mappings entry for the buttons
	 * @param {Number} index the specific button entry
	 * @return {Function} a getter returning the value for the requested button
	 */
	apppad.prototype._createButtonGetter = (function() {
		var nullGetter = function() {
			return 0;
		};

		var createRangeGetter = function(valueGetter, from, to) {
			var getter = nullGetter;

			if (from < to) {
				getter = function() {
					var range = to - from;
					var value = valueGetter();

					value = (value - from) / range;

					return (value < 0) ? 0 : value;
				};
			} else if (to < from) {
				getter = function() {
					var range = from - to;
					var value = valueGetter();

					value = (value - to) / range;

					return (value > 1) ? 0 : (1 - value);
				};
			}

			return getter;
		};

		var isArray = function(thing) {
			return Object.prototype.toString.call(thing) === '[object Array]';
		};

		return function(apppad, buttons, index) {
			var getter = nullGetter;
			var entry;
			var that = this;

			entry = buttons.byButton[index];
			if (entry !== -1) {
				if ((typeof(entry) === 'number') && (entry < apppad.buttons.length)) {
					getter = function() {
						return apppad.buttons[entry];
					};
				}
			} else if (buttons.byAxis && (index < buttons.byAxis.length)) {
				entry = buttons.byAxis[index];
				if (isArray(entry) && (entry.length == 3) && (entry[0] < apppad.axes.length)) {
					getter = function() {
						var value = apppad.axes[entry[0]];

						return that._applyDeadzoneMaximize(value);
					};

					getter = createRangeGetter(getter, entry[1], entry[2]);
				}
			}

			return getter;
		};
	})();

	/**
	 * Creates a getter according to the mapping entry for the specific index.
	 * Currently supported entries:
	 *
	 * axes.byAxis[index]: Number := Index into apppad.axes; -1 ignored
	 *
	 * @method _createAxisGetter
	 * @private
	 * @param {Object} apppad the apppad for which to create a getter
	 * @param {Object} axes the mappings entry for the axes
	 * @param {Number} index the specific axis entry
	 * @return {Function} a getter returning the value for the requested axis
	 */
	apppad.prototype._createAxisGetter = (function() {
		var nullGetter = function() {
			return 0;
		};

		return function(apppad, axes, index) {
			var getter = nullGetter;
			var entry;
			var that = this;

			entry = axes.byAxis[index];
			if (entry !== -1) {
				if ((typeof(entry) === 'number') && (entry < apppad.axes.length)) {
					getter = function() {
						var value = apppad.axes[entry];

						return that._applyDeadzoneMaximize(value);
					};
				}
			}

			return getter;
		};
	})();

	/**
	 * Disconnects from given apppad.
	 *
	 * @method _disconnect
	 * @param {Object} apppad apppad to disconnect
	 * @private
	 */
	apppad.prototype._disconnect = function(apppad) {
		var newapppads = [],
			i;

		if (typeof(this.apppads[apppad.index]) !== 'undefined') {
			delete this.apppads[apppad.index];
		}

		for (i = 0; i < this.apppads.length; i++) {
			if (typeof(this.apppads[i]) !== 'undefined') {
				newapppads[i] = this.apppads[i];
			}
		}

		this.apppads = newapppads;

		this._fire(apppad.Event.DISCONNECTED, apppad);
	};

	/**
	 * Resolves controller type from its id.
	 *
	 * @method _resolveControllerType
	 * @param {String} id Controller id
	 * @return {String} Controller type, one of apppad.Type
	 * @private
	 */
	apppad.prototype._resolveControllerType = function(id) {
		id = id.toLowerCase();

		if (id.indexOf('playstation') !== -1) {
			return apppad.Type.PLAYSTATION;
		} else if (
			id.indexOf('logitech') !== -1 || id.indexOf('wireless apppad') !== -1) {
			return apppad.Type.LOGITECH;
		} else if (id.indexOf('xbox') !== -1 || id.indexOf('360') !== -1) {
			return apppad.Type.XBOX;
		} else {
			return apppad.Type.UNKNOWN;
		}
	};

	/**
	 * @method _resolveMapping
	 * @private
	 * @param {Object} apppad the apppad for which to resolve the mapping
	 * @return {Object} a mapping object for the given apppad
	 */
	apppad.prototype._resolveMapping = function(apppad) {
		var mappings = apppad.Mappings;
		var mapping = null;
		var env = {
			platform: this.platform.getType(),
			type: this._resolveControllerType(apppad.id)
		};
		var i;
		var test;

		for (i = 0; !mapping && (i < mappings.length); i++) {
			test = mappings[i];
			if (apppad.envMatchesFilter(test.env, env)) {
				mapping = test;
			}
		}

		return mapping || apppad.StandardMapping;
	};

	/**
	 * @method envMatchesFilter
	 * @static
	 * @param {Object} filter the filter object describing properties to match
	 * @param {Object} env the environment object that is matched against filter
	 * @return {Boolean} true if env is covered by filter
	 */
	apppad.envMatchesFilter = function(filter, env) {
		var result = true;
		var field;

		for (field in filter) {
			if (filter[field] !== env[field]) {
				result = false;
			}
		}

		return result;
	};

	/**
	 * Updates the controllers, triggering TICK events.
	 *
	 * @method _update
	 * @private
	 */
	apppad.prototype._update = function() {
		this.platform.update();

		this.apppads.forEach(function(apppad) {
			if (apppad) {
				apppad.updater.forEach(function(updater) {
					updater();
				});
			}
		});

		if (this.apppads.length > 0) {
			this._fire(apppad.Event.TICK, this.apppads);
		}
	},

	/**
	 * Applies deadzone and maximization.
	 *
	 * You can change the thresholds via deadzone and maximizeThreshold members.
	 *
	 * @method _applyDeadzoneMaximize
	 * @param {Number} value Value to modify
	 * @param {Number} [deadzone] Deadzone to apply
	 * @param {Number} [maximizeThreshold] From which value to maximize value
	 * @private
	 */
	apppad.prototype._applyDeadzoneMaximize = function(
		value,
		deadzone,
		maximizeThreshold) {
		deadzone = typeof(deadzone) !== 'undefined' ? deadzone : this.deadzone;
		maximizeThreshold = typeof(maximizeThreshold) !== 'undefined' ? maximizeThreshold : this.maximizeThreshold;

		if (value >= 0) {
			if (value < deadzone) {
				value = 0;
			} else if (value > maximizeThreshold) {
				value = 1;
			}
		} else {
			if (value > -deadzone) {
				value = 0;
			} else if (value < -maximizeThreshold) {
				value = -1;
			}
		}

		return value;
	};

	exports.apppad = apppad;

})(((typeof(module) !== 'undefined') && module.exports) || window);
