sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var BasicData = BlockBase.extend("in.compass.vim.ZVIM_APPROVAL_WORKFLOW.SharedBlocks.Comments.Comment", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.SharedBlocks.Comments.Comment",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.SharedBlocks.Comments.Comment",
					type: ViewType.XML
				}
			}
		}
	});
	return BasicData;
});