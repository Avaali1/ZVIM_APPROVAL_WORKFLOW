sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createODataModel: function () {
			var sUrl = "/sap/opu/odata/sap/ZMMGW_VDM_SRV/";
			return new ODataModel(sUrl, {
				json: true
			});
		},
		createVDMGenericModel: function () {
			var sUrl = "/sap/opu/odata/sap/ZMMGW_VDM_GENERIC_SRV/";
			return new ODataModel(sUrl, {
				json: true
			});
		}

	};
});