/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"in/compass/vim/ZVIM_APPROVAL/ZVIM_APPROVAL/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});