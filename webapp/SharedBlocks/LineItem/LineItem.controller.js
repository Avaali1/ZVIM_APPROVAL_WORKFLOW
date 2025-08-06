sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var CController = Controller.extend("in.compass.vim.ZVIM_APPROVAL_WORKFLOW.SharedBlocks.LineItem.LineItem", {
		onParentBlockModeChange: function (sMode) {
			// this.oParentBlock is available here
		}
	});

	return CController;
});