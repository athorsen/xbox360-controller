## xbox360-controller ##

This is a Node.js module that allows you to use Xbox 360 controllers in your applications.

It wraps [Gamepad](https://github.com/creationix/node-gamepad "Gamepad"), but takes things a step further by mapping the button and axis control Ids to meaningful/humand-readable names.

It also disregards any controller connected to your system that isn't an Xbox 360 controller.

Of course, with some updates to the **config.json** file, you can make this module work with other types of controllers from other vendors.

## Installation ##

After cloning the repo:

    git clone https://github.com/athorsen/xbox360-controller.git

you can install all of the dependent packages by running the NPM install command:

    npm install

## Usage ##

You first need to require the module in your application and create a new instance:

    var Xbox360Controller = require("./xbox360-controller.js");
	var controller = new Xbox360Controller();

Then, you can add event handlers for any of the following events:

- initialized
- move
- pressed
- released
- on
- off
- connected
- disconnected

**Sample event handlers:**

    controller.on("initialized", function() {
		console.log("Controller initialized");
	});

	controller.on("move", function(axisName, value) {
		console.log(axisName + ":move =>", value);
	});

	controller.on("pressed", function(buttonName) {
		console.log(buttonName + ":pressed");
	});

	controller.on("released", function(buttonName) {
		console.log(buttonName + ":released");
	});

	controller.on("on", function() {
		console.log("The status is " + controller.status);
	});

	controller.on("off", function() {
		console.log("The status is " + controller.status);
	});

	controller.on("connected", function(controllerIds) {
		console.log("Connected controllers: " + controllerIds);
	});

	controller.on("disconnected", function(controllerIds) {
		console.log("Disconnected controllers: " + controllerIds);
	});

And finally, you need to call the *init* function to ensure all of the underlying modules are initialized before use:

	controller.init();

**Full sample:**

    var Xbox360Controller = require("./xbox360-controller.js");
	var controller = new Xbox360Controller();

    controller.on("initialized", function() {
		console.log("Controller initialized");
	});

	controller.on("move", function(axisName, value) {
		console.log(axisName + ":move =>", value);
	});

	controller.on("pressed", function(buttonName) {
		console.log(buttonName + ":pressed");
	});

	controller.on("released", function(buttonName) {
		console.log(buttonName + ":released");
	});

	controller.on("on", function() {
		console.log("The status is " + controller.status);
	});

	controller.on("off", function() {
		console.log("The status is " + controller.status);
	});

	controller.on("connected", function(controllerIds) {
		console.log("Connected controllers: " + controllerIds);
	});

	controller.on("disconnected", function(controllerIds) {
		console.log("Disconnected controllers: " + controllerIds);
	});

	controller.init();