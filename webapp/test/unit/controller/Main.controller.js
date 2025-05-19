/*global QUnit*/

sap.ui.define([
	"in/compass/vim/ZVIM_APPROVAL/ZVIM_APPROVAL/controller/Main.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Main Controller");

	QUnit.test("I should test the Main controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});