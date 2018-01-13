'use strict';

var gamepad = require('gamepad');
var path = require('path');
var config = require(path.join(__dirname, 'config.json'));
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var currentStatus = "off";
var connectedControllerIds = [];
var initializingControllerIds = []; // This is a 'hack' to swallow up random events fired by gamepad when a new controller is connected/attached

/**
 *
 * @constructor
 */

function Xbox360Controller() {
    Object.defineProperty(this, 'status', {
        get: function() {
            return currentStatus;
        }
    });
}

util.inherits(Xbox360Controller, EventEmitter);

/**
 * init  Initializes the gamepad and sets intervals to check for new devices and events
 */

Xbox360Controller.prototype.init = function() {
    var self = this;

    gamepad.init();

    var getConnectedControllerIds = function() {
        var controllerIds = [];

        gamepad.detectDevices();

        for (var i = 0, count = gamepad.numDevices(); i < count; i++) {
            var device = gamepad.deviceAtIndex(i);

            if (device.vendorID === config.vendorId &&
                device.productID === config.productId) {
                controllerIds.push(device.deviceID);
            }
        }

        return controllerIds;
    };

    var isXbox360Controller = function(deviceId) {
        return isDeviceInArray(deviceId, connectedControllerIds);
    };

    var isInitializing = function(deviceId) {
        return isDeviceInArray(deviceId, initializingControllerIds);
    };

    var isDeviceInArray = function(deviceId, arr) {
        return !_.isUndefined(_.find(arr, function(arrId) { return arrId === deviceId; }));
    };

    var updateControllerIds = function(controllerIds) {
		var connectedIds = _.difference(controllerIds, connectedControllerIds);		
		var disconnectedIds = _.difference(connectedControllerIds, controllerIds);
		
		if (connectedIds.length > 0) {
			Array.prototype.push.apply(initializingControllerIds, connectedIds);
			
			setTimeout(function() {
				_.pullAll(initializingControllerIds, connectedIds);
			}, 1000);
			
			self.emit("connected", connectedIds);
		}
	
		if (disconnectedIds.length > 0) {
			self.emit("disconnected", disconnectedIds);
		}
	
		connectedControllerIds = controllerIds;
    };

    var updateStatus = function() {
        var controllerIds = getConnectedControllerIds();

        updateControllerIds(controllerIds);

        var updatedStatus = controllerIds.length > 0 ? "on" : "off";

        if (currentStatus !== updatedStatus) {
            currentStatus = updatedStatus;

			self.emit(updatedStatus);
        }
    };

    var getControlName = function(controlId, controlGroup) {
        return _.find(config.mappings[controlGroup], { 'id': controlId }).name;
    };

    var handleAxisMove = function(id, axisId, value) {
        if (isXbox360Controller(id) && !isInitializing(id)) {
            var axisName = getControlName(axisId, "axes");

            self.emit("move", _.toLower(axisName), value);
        }
    };

    var handleButtonReleased = function(id, buttonId) {
		handleButton(id, buttonId, "released");
    };

    var handleButtonPressed = function(id, buttonId) {
		handleButton(id, buttonId, "pressed");
    };

	var handleButton = function(id, buttonId, eventName) {
	    if (isXbox360Controller(id) && !isInitializing(id)) {
            var buttonName = getControlName(buttonId, "buttons");

            self.emit(eventName, _.toLower(buttonName));
        }
	};

    gamepad.on("move", handleAxisMove);
    gamepad.on("up", handleButtonReleased);
    gamepad.on("down", handleButtonPressed);
	
	setInterval(gamepad.processEvents, 25);
    setInterval(updateStatus, 500);

    self.emit("initialized");
};

/**
 * shutdown  Cleans up any resources being consumed
 */

Xbox360Controller.prototype.shutdown = function() {
    gamepad.shutdown();
};

module.exports = Xbox360Controller;