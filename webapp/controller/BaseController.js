sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("in.compass.vim.ZVIM_APPROVAL_WORKFLOW.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			if (sName) {
				return (
					this.getView().getModel(sName) ||
					this.getOwnerComponent().getModel(sName)
				);
			} else {
				// Global OData model
				return this.getOwnerComponent().getModel(this.getODataModelName());
			}
		},

		/**
		 * Convenience method for getting the ODATA model name.
		 * @public
		 * @returns {string} the model name
		 */
		getODataModelName: function () {
			return "server";
		},
		/**
		 * Convenience method for accessing the service URI of a model
		 * @public
		 * @param {string} sModel the name of the model
		 * @returns {string} the service URI of the model
		 */
		getServiceUri: function (sModel) {
			let sDataSource = this.getOwnerComponent().getManifestEntry(
				"/sap.ui5/models/" + sModel + "/dataSource"
			);
			return this.getOwnerComponent().getManifestEntry(
				"/sap.app/dataSources/" + sDataSource + "/uri"
			);
		},
		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent()
				.getModel("i18n")
				.getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});
});