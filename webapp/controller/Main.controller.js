sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/util/XMLHelper",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/PDFViewer",
	"sap/ui/unified/FileUploaderParameter",
	"jquery.sap.global",
	"sap/ui/core/Core"
], function (
	BaseController,
	Controller,
	JSONModel,
	Filter,
	FilterOperator,
	XMLHelper,
	Fragment,
	MessageToast,
	PDFViewer,
	FileUploaderParameter,
	jQuery,
	Core
) {
	"use strict";

	return BaseController.extend("in.compass.vim.ZVIM_APPROVAL_WORKFLOW.controller.Main", {

		oInputModel: new JSONModel(),
		oHeaderModel: new JSONModel(),
		oItemModel: new JSONModel(),
		oHistoryModel: new JSONModel(),
		oDocModel: new JSONModel(),
		oPDFModel: new JSONModel(),
		oCommentModel: new JSONModel(),
		onInit: function (oEvent) {
			this.sAPPRACT = "";
			this.sNote = "";
			this.docID = "";
			this._aFullItemData = [];
			this.WIID = this.workItemId = this.getOwnerComponent().getComponentData().startupParameters.wfInstanceId[0];
			this._fragmentIds = {};
			this._displayTable();
			this._displayHistory();
			this._displayDocument();
			this._displayComment();
			this.getView().setModel(this.oInputModel, "input");
			this.getView().setModel(this.oHeaderModel, "header");
			this.getView().setModel(this.oItemModel, "item");
			this.getView().setModel(this.oHistoryModel, "history");
			this.getView().setModel(this.oDocModel, "document");
			this.getView().setModel(this.oPDFModel, "pdf");
			this.getView().setModel(this.oCommentModel, "comment");
			//	this._onObjectMatched();
			if (sap.ushell.Container) {
				this.LUser = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				this.LUser = 'ABAP12';
			}
			// this._fullData = this._generateData();
			// const oModel = new JSONModel({
			// 	pagedItems: []
			// });
			// this.getView().setModel(oModel, "viewModel");

			//	this._updatePagedItems(0); // show first 10 items
		},
		_onPageItem: function (oEvent) {
			const sText = oEvent.getSource().getText(); // 10, 20, 30
			if (sText === '20') {
				var oItemData = this.getView().getModel("item").getData();
				this.oItemModel.setSizeLimit(
					oItemData.length > 20 ? 20 : oItemData.length
				);
				const oItemModel = new sap.ui.model.json.JSONModel(oItemData.slice(0, 20));
				this.getView().setModel(oItemModel, "item");
				//		this.oItemModel.setProperty("/", oItemData);
			}
			if (sText === '50') {
				var oItemData = this.getView().getModel("item").getData();
				const aVisible = oItemData.slice(0, 50); // get only first N rows
				this.oItemModel.setSizeLimit(
					oItemData.length > 50 ? 50 : oItemData.length
				);
				const oItemModel = new sap.ui.model.json.JSONModel(oItemData.slice(0, 50));
				this.getView().setModel(oItemModel, "item");
				//	this.oItemModel.setProperty("/", aVisible);
			}
			if (sText === '100') {
				var oItemData = this.getView().getModel("item").getData();
				this.oItemModel.setSizeLimit(
					oItemData.length > 100 ? 100 : oItemData.length
				);
				const oItemModel = new sap.ui.model.json.JSONModel(oItemData.slice(0, 100));
				this.getView().setModel(oItemModel, "item");
				//	this.oItemModel.setProperty("/", oItemData);

			}
		},
		// 	const iPage = parseInt(sText, 10) / 10 - 1;
		// 	this._updatePagedItems(iPage);
		// },

		// _updatePagedItems: function (iPage) {
		// 	const iItemsPerPage = 10;
		// 	const iStart = iPage * iItemsPerPage;
		// 	const iEnd = iStart + iItemsPerPage;
		// 	const aPageData = this._fullData.slice(iStart, iEnd);

		// 	this.getView().getModel("viewModel").setProperty("/pagedItems", aPageData);
		// },

		// _generateData: function () {
		// 	const aData = [];
		// 	for (let i = 1; i <= 30; i++) {
		// 		aData.push({
		// 			Name: "Item " + i,
		// 			CodFlg: "CF" + i,
		// 			CompanyCode: "IN10",
		// 			CostCenter: "CC" + i,
		// 			DebitCredit: i % 2 === 0 ? "DBT" : "CDT",
		// 			GLAccount: "26000" + i,
		// 			Amount: (i * 100).toFixed(2),
		// 			TaxCode: i % 2 === 0 ? "PS" : "TX",
		// 			ShortText: "GR/IR CLR AC-SR " + i
		// 		});
		// 	}
		// 	return aData;
		// },
		/**
		 * Called when view is destroyed
		 * @function
		 * @param {sap.ui.base.Event} oEvent event object.
		 * @public
		 */
		onExit: function (oEvent) {
			this.oInputModel.destroy();
			this.oHeaderModel.destroy();
			this.oItemModel.destroy();
			this.oHistoryModel.destroy();
			this.oDocModel.destroy();
			this.oPDFModel.destroy();
			if (this._pdfDialog) {
				this._pdfDialog.destroy()
			}
		},
		onAfterRendering: function () {
			let that = this;
			// let expandEntities = [];
			// this.oDataModel = this.getView().getModel("oDataModel");
			// that.oDataVDMGenericModel = this.getView().getModel("oDataVDMGenericModel");
			// if (this.oDataModel) {
			// 	that.vendorPortalUrl = this.oDataModel.sServiceUrl;
			// }
			// if (that.oDataVDMGenericModel) {
			// 	that.integrationGenericURL = that.oDataVDMGenericModel.sServiceUrl;
			// }
			//			this._onObjectMatched();
		},
		_onObjectMatched: function () {
			let that = this;
			this.workItemId = this.getOwnerComponent().getComponentData().startupParameters.wfInstanceId[0];
			//		let workflowID = oEvent.getParameter("arguments").wfInstanceId;
			this._loadWorkflowDetails(this.workItemId).then(
				function (oData) {
					this.oHeaderModel.setProperty("/", oData.results);
				}.bind(this))
		},
		_loadWorkflowDetails: function (workItemId) {
			var that = this;
			//	that.showBusyIndicator();
			return new Promise(function (fnResolve, fnReject) {
				let aFilter = {
					"WIID": workItemId
				};
				var URL = "/HeaderDataSet";
				var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
				//		this.getModel().read("/HeaderDataSet", {
				oModel1.read("/HeaderDataSet", {
					filters: [aFilter],
					urlParameters: {
						"$expand": "HdrItmNav"
					},
					success: function (oData, oResp) {
						fnResolve(oData, oResp);
					},
					error: function (oError) {
						fnReject(oError);
					}
				});
				// oModel1.read("/HeaderDataSet", {
				// 	filters: [aFilter],
				// 	urlParameters: {
				// 		"$expand": "hdritmnav"
				// 	},
				// 	success: function (oData, oResp) {
				// 		fnResolve(oData, oResp);
				// 	},
				// 	error: function (oError) {
				// 		fnReject(oError);
				// 	}
				// });

				// oModel1.read(URL, {
				// 	filters: [aFilter],
				// 	success: function (oData, oResp) {
				// 		fnResolve(oData, oResp);
				// 	},
				// 	error: function (oError) {
				// 		fnReject(oError);
				// 	}
				// });
			}.bind(this));

		},
		_displayTable: function () {
			var that = this;
			var oData = {};
			oData.results = []; //'NV202505_16'; //this.getOwnerComponent().getComponentData().startupParameters.REQNO[0].trim();
			var t = [new sap.ui.model.Filter("WIID", "EQ", this.WIID)];
			var URL = "/HeaderDataSet"; // ? $filter = WIID eq '000001207482' & $expand = HdrItmNav;
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
			sap.ui.core.BusyIndicator.show(true);
			oModel1.read(URL, {
				filters: t,
				urlParameters: {
					"$expand": "HdrItmNav"
				},
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide(true);
					if (oData.results.length <= 1) {
						var aItem = oData.results[0].HdrItmNav.results;
						that.docID = oData.results[0].DOCID;
						//	var oItemData = that.getView().getModel("header").getData();
						//	oItemData.Item = aItem;
						that.oHeaderModel.setProperty("/", oData.results[0]);
						//	that.oHeaderModel.setData(oItemData);
						that.oItemModel.setSizeLimit(
							aItem.length > 20 ? 20 : aItem.length
						);
						that.oItemModel.setProperty("/", aItem);
						//if results is empty&nbsp;
						oData.results.push({
							"WIID": that.WIID

						});

					}
					// oData.results.push({
					// 	"ReqNo": 'EV202412_25'
					// });
					// oData.results.push({
					// 	"ReqNo": 'BV202412_5'
					// });
					var oModel = new sap.ui.model.json.JSONModel(oData.results);
					//	that.getView().byId("idProductsTable").setModel(oModel, "tblModel");

				},
				error: function (err) {
					sap.ui.core.BusyIndicator.hide(true);
					sap.m.MessageBox.error(err.message, {
						title: "Error"
					});
				}
			});
		},
		_displayHistory: function () {
			var that = this;
			var oData = {};
			oData.results = [];
			var t = [new sap.ui.model.Filter("WIID", "EQ", this.WIID)];
			var URL = "/HeaderDataSet"; // ? $filter = WIID eq '000001207482' & $expand = HdrItmNav;
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
			sap.ui.core.BusyIndicator.show(true);
			oModel1.read(URL, {
				filters: t,
				urlParameters: {
					"$expand": "HdrHistNav"
				},
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide(true);
					if (oData.results.length <= 1) {
						var aItem = oData.results[0].HdrHistNav.results;
						that.oHistoryModel.setSizeLimit(
							aItem.length > 20 ? 20 : aItem.length
						);
						that.oHistoryModel.setProperty("/", aItem);
						oData.results.push({
							"WIID": that.WIID
						});
					}
				},
				error: function (err) {
					sap.ui.core.BusyIndicator.hide(true);
					sap.m.MessageBox.error(err.message, {
						title: "Error"
					});
				}
			});
		},
		_displayDocument: function () {
			var that = this;
			var oData = {};
			oData.results = [];

			var adocId = new sap.ui.model.Filter("DOCID", "EQ", this.docID)
			var Wiid = new sap.ui.model.Filter("WIID", "EQ", this.WIID)
			var URL = "/HeaderDataSet"; // ? $filter = WIID eq '000001207482' & $expand = HdrItmNav;
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
			sap.ui.core.BusyIndicator.show(true);
			oModel1.read(URL, {
				filters: [adocId, Wiid],
				urlParameters: {
					"$expand": "HdrAttchNav"
				},
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide(true);
					if (oData.results.length <= 1) {
						var aItem = oData.results[0].HdrAttchNav.results;
						that.oDocModel.setProperty("/", aItem);
						oData.results.push({
							"WIID": that.WIID
						});
					}
				},
				error: function (err) {
					sap.ui.core.BusyIndicator.hide(true);
					sap.m.MessageBox.error(err.message, {
						title: "Error"
					});
				}
			});
		},
		_displayComment: function () {
			var that = this;
			var oData = {};
			oData.results = [];

			var adocId = new sap.ui.model.Filter("DOCID", "EQ", this.docID)
			var Wiid = new sap.ui.model.Filter("WIID", "EQ", this.WIID)
			var URL = "/HeaderDataSet"; // ? $filter = WIID eq '000001207482' & $expand = HdrItmNav;
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
			sap.ui.core.BusyIndicator.show(true);
			oModel1.read(URL, {
				filters: [adocId, Wiid],
				urlParameters: {
					"$expand": "HdrCommNav"
				},
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide(true);
					if (oData.results.length <= 1) {
						debugger
						var comment = '';
						var aItems = oData.results[0].HdrCommNav.results;
						for (var i = 0; i < aItems.length; i++) {
							comment = comment + "\n" + aItems[i].Comments
							var sResult = comment;
						}
						that.byId("idText").setValue(sResult);
						that.oCommentModel.setProperty("/", sResult);
						// oData.results.push({
						// 	"WIID": that.WIID
						// });
					}
				},
				error: function (err) {
					sap.ui.core.BusyIndicator.hide(true);
					sap.m.MessageBox.error(err.message, {
						title: "Error"
					});
				}
			});
		},
		onCancelUpload: function () {
			this.pDialog.close();
		},
		onUpload: function (oEvent) {
			var oUploader = this.getView().byId("fileUploader").getValue();
			if (!oUploader) {
				MessageToast.show("Please select a file to upload.");
				return;
			}

			// Example upload — replace with real backend call
			oUploader.upload(); // For actual backend, configure uploadUrl etc.
			MessageToast.show("File upload initiated.");
			this.pDialog.close();
		},
		/**
		 * Called when upload is complete for the file uploader
		 * @function
		 * @param {sap.ui.base.Event} oEvent event object.
		 * @public
		 */
		onUploadComplete: function (oEvent) {
			const oResponse = oEvent.getParameter("responseRaw");
			// POST document
			if (oResponse) {
				oEvent.getSource().setValue(null);
			}
		},
		/**
		 * Called when file is selected for the file uploader
		 * @function
		 * @param {sap.ui.base.Event} oEvent event object.
		 * @public
		 */
		onChangeFile: function (oEvent) {
			oEvent.getSource().removeAllHeaderParameters();
			const oSecurityToken = new FileUploaderParameter({
				name: "x-csrf-token",
				value: this.getModel().getSecurityToken()
			});
			oEvent.getSource().addHeaderParameter(oSecurityToken);
			const oFileSlug = new FileUploaderParameter({
				name: "slug",
				value: oEvent.getParameter("newValue") + "," + this.workItemId + ":" + this.docID + ":" + "AP"
			});

			oEvent.getSource().addHeaderParameter(oFileSlug);
		},
		/**
		 * Submits form data for invoice document saving in backend
		 * @function
		 * @param {XML} oData XML document
		 * @private
		 */
		_onApprove: function (oEvent) {
			debugger
			var that = this;
			if (oEvent.getSource().getText() == "Approve") {
				this.sAPPRACT = 'AP';
				this._onOpenApproveDialog(oEvent);
			} else {
				this.sAPPRACT = 'RJ';
				this._onOpenApproveDialog(oEvent);
				//	this._onOpenRejectDialog(oEvent);
			}
			// if (this.workItemId !== "" && this.docID !== "") {
			// 	// Construct payload
			// 	const oPayload = {
			// 		WIID: this.workItemId,
			// 		DOCID: this.docID,
			// 		APPRACT: sAPPRACT,
			// 		COMMENTS: this.sNote
			// 	};

			// 	// Get OData model
			// 	const oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV"); // this.getView().getModel(); // assuming default model set	var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
			// 	const sEntitySet = "/ApprovalSet"; // your OData entity set

			// 	// Call create
			// 	oModel.create(sEntitySet, oPayload, {
			// 		success: function (oData, response) {
			// 			sap.m.MessageToast.show("Data posted successfully!");
			// 		},
			// 		error: function (oError) {
			// 			sap.m.MessageBox.error("Error posting data.");
			// 		}
			// 	});
			// }
		},
		_onOpenApproveDialog: function (oEvent) {
			debugger
			var that = this;
			// if (!this.pDialog) {
			// 	this.pDialog = sap.ui.xmlfragment("in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.ApproveDialog", this);
			// }
			// // toggle compact style
			// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.pDialog);
			// this.pDialog.setModel(this.getView().addDependent(oDialog); this.pDialog.open();
			if (!this.pDialog) {
				Fragment.load({
					name: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.ApproveDialog",
					controller: this
				}).then(function (oDialog) {
					that._changeDialogValues();
					this.getView().addDependent(oDialog);
					this.pDialog = oDialog;
					this.pDialog.open();
				}.bind(this));
			} else {
				that._changeDialogValues();
				this.pDialog.open();
			}
		},
		_changeDialogValues: function () {
			debugger
			if (this.sAPPRACT === 'AP') {
				Core.byId("decisionDialog").setTitle("Submit Decision");
				Core.byId("lblapp").setText("Decision Note:");
			}
			if (this.sAPPRACT === 'RJ') {
				Core.byId("decisionDialog").setTitle("Reject");
				Core.byId("lblapp").setText("Comment");
			}
		},
		_onOpenRejectDialog: function (oEvent) {
			// if (!this.prejDialog) {
			// 	this.prejDialog = sap.ui.xmlfragment("in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.RejectDialog", this);
			// }
			// // toggle compact style
			// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.prejDialog);
			// this.prejDialog.setModel(this.getView().addDependent(this.prejDialog));
			// this.prejDialog.open();
			// if (!this.prejDialog) {
			// 	Fragment.load({
			// 		name: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.RejectDialog",
			// 		controller: this
			// 	}).then(function (oDialog1) {
			// 		this.getView().addDependent(oDialog1);
			// 		this.prejDialog = oDialog1;
			// 		this.prejDialog.open();
			// 	}.bind(this));
			// } else {
			// 	this.prejDialog.open();
			// }
		},
		onAddDocument: function (oEvent) {
			if (!this.pDialog) {
				Fragment.load({
					name: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.UploadDoc",
					controller: this
				}).then(function (oDialog) {
					this.getView().addDependent(oDialog);
					this.pDialog = oDialog;
					this.pDialog.open();
				}.bind(this));
			} else {
				this.pDialog.open();
			}
		},
		onNoteLiveChange: function (oEvent) {
			this.sNote = oEvent.getSource().getValue();
			//	var oSubmit = this.byId("Submit"); // this.byId works with View ID prefix
			//	oSubmit.setEnabled(true);
		},
		onSubmit: function (oEvent) {
			debugger
			var that = this;
			if (this.sNote !== "" || this.sNote !== " ") {
				sap.m.MessageToast.show("Please Enter the Comment");
			}
			if (this.sNote !== "" || this.sNote !== " " && this.workItemId !== " " && this.docID !== " ") {
				// Construct payload
				const oPayload = {
					WIID: this.workItemId,
					DOCID: this.docID,
					APPRACT: this.sAPPRACT,
					COMMENTS: this.sNote
				};

				// Get OData model
				const oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV"); // this.getView().getModel(); // assuming default model set	var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVIM_APPR_INBOX_SRV");
				const sEntitySet = "/ApprovalSet"; // your OData entity set

				// Call create
				oModel.create(sEntitySet, oPayload, {
					success: function (oData, response) {
						sap.m.MessageToast.show("Data posted successfully!");
						sap.ui.getCore().getEventBus().publish("sap.ui.core", "InboxDataRefresh");
						that.getOwnerComponent().getModel().refresh();
					},
					error: function (oError) {
						sap.m.MessageBox.error("Error posting data.");
					}
				});
			}
			if (this.sNote !== "" || this.sNote !== " ") {
				Core.byId("idText1").setValue(" ");
				this.pDialog.close();
			}
			// if (this.pDialog) {
			// 	this.pDialog.close();
			// 	//	this.pDialog = undefined;
			// 	// if (this.sAPPRACT === 'AP') {
			// 	// 	sap.ui.getCore().byId("idText1").setValue(" ");
			// 	// }
			// }
			// if (this.prejDialog) {
			// 	this.prejDialog.close();
			// 	this.prejDialog = undefined;
			// 	// if (this.sAPPRACT === 'RJ') {
			// 	// 	sap.ui.getCore().byId("idTextArea1").setValue(" ");
			// 	// }
			// }

		},
		onCancel: function (oEvent) {
			debugger
			Core.byId("idText1").setValue(" ");
			this.pDialog.close();
			// if (this.pDialog) {
			// 	this.pDialog.close();
			// 	//		this.pDialog = undefined;
			// 	// 	if (this.sAPPRACT === 'AP') {
			// 	sap.ui.getCore().byId("idText1").setValue(" ");
			// }
			// }
			// if (this.prejDialog) {
			// 	this.prejDialog.close();
			// 	//		this.prejDialog = undefined;
			// 	if (this.sAPPRACT === 'RJ') {
			// 		sap.ui.getCore().byId("idTextArea1").setValue(" ");
			// 	}
			// }
		},

		onDialogAfterClose: function (oEvent) {
			Core.byId("idText1").setValue(" ");
			this.pDialog.close();
			// if (this.pDialog) {
			// 	this.pDialog.close();
			// 	//		this.pDialog = undefined;
			// 	// 	if (this.sAPPRACT === 'AP') {
			// 	sap.ui.getCore().byId("idText1").setValue(" ");
			// 	// 	}
			// 	// 	if (this.sAPPRACT === 'RJ') {
			// 	// // 		sap.ui.getCore().byId("idTextArea1").setValue(" ");
			// 	// // 	}
			// }
			// if (this.prejDialog) {
			// 	this.prejDialog.close();
			// 	//		this.prejDialog = undefined;
			// 	if (this.sAPPRACT === 'RJ') {
			// 		sap.ui.getCore().byId("idTextArea1").setValue(" ");
			// 	}
			// }
			//		this.getView().byId("idText").setValue("");
			//	this.getView().byId("Submit").setEnabled(false);
		},
		_onPressDocument: function (oEvent) {
			debugger
			var oDocData = this.getView().getModel("document");
			var path = oEvent.getSource().getParent().getBindingContextPath();
			var data = oDocData.getProperty(path);
			//String Approach
			/*		var base64pdf = data.XSTRING; // Your Base64 string
					//	var source = "data:application/pdf;base64," + base64pdf;
					//Prachi dev
					var source = "/sap/opu/odata/SAP/ZMM_BP_VENDOR_APP_SRV/Ven_AttachSet(ReqNo='CV202507_7',SrNo=2)/$value"
						//Prachi Dev
						//	var opdfViewer = new PDFViewer();
					var oPDFViewer1 = new sap.m.PDFViewer({
						source: "/sap/opu/odata/SAP/ZMM_BP_VENDOR_APP_SRV/Ven_AttachSet(ReqNo='CV202507_7',SrNo=2)/$value",
						title: "PDF Document"
					});*/
			// Disable source validation for internal SAP URLs
			//	oPDFViewer1.setIsTrustedSource(true);

			// Optional: Set MIME type
			//	oPDFViewer1.setContentType("application/pdf");
			// this.getView().addDependent(oPDFViewer1);
			// oPDFViewer1.open();
			//	window.open(source);
			//		var sServiceURL = this.getView().getModel().sServiceUrl;
			// var sSource = "/sap/opu/odata/SAP/ZVIM_APPR_INBOX_SRV/AttchPDFSet(DOCID='" + data.DOCID +
			// 	"',ARCH_DOC_ID='" + data.ARCH_DOC_ID + "')/$value"
			// opdfViewer.setSource(sSource);
			// opdfViewer.setTitle("My PDF");
			// opdfViewer.open();
			var oPDFViewer = new sap.m.PDFViewer({
				source: "/sap/opu/odata/SAP/ZVIM_APPR_INBOX_SRV/AttchPDFSet(DOCID='" + data.DOCID +
					"',ARCH_DOC_ID='" + data.ARCH_DOC_ID + "')/$value",
				title: "PDF Document",
				isTrustedSource: "true"
			});
			this.getView().addDependent(oPDFViewer);
			oPDFViewer.open();
			if (this.oPDFViewer) {
				this.oPDFViewer.close();
			}
			/*window.open(source);

			const blob = this.base64ToBlob(source, "application/pdf");
			const blobUrl = URL.createObjectURL(blob);

			const oPDFViewer1 = new sap.m.PDFViewer({
				source: blobUrl,
				title: "PDF Preview"
			});
			this.getView().addDependent(oPDFViewer);
			oPDFViewer1.open();
			// ALTERNATIVE: Store in model for use in iframe binding
			var oModel = new sap.ui.model.json.JSONModel({
				pdfSource: source
			});
			this.getView().setModel(oModel);*/

			/*	this.oPDFModel.setProperty("/pdfUrl", source);
				this._openPDFDialog()*/
			/*	this._getPDFPaymentAdvice(data).then(function (e) {
						this.oPDFModel.setProperty("/pdfUrl", e.Url);
						this._openPDFDialog()
					}.bind(this), function () {
						this.getView().setBusy(false)
					}.bind(this))*/

			/*			var oDocData = this.getView().getModel("document");
						var path = oEvent.getSource().getParent().getBindingContextPath();
						var data = oDocData.getProperty(path);
						var sPdfUrl = "/sap/public/7362B4398AAB1FD094EDD812F521F907.PDF"
						this.oPDFModel.setProperty("/pdfUrl", data.URL);
						if (!this._pdfDialog) {
							Fragment.load({
								id: this.getView().getId(),
								name: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.PDFViewer",
								controller: this
							}).then(function (oDialog) {
								this._pdfDialog = oDialog;
								this.getView().addDependent(oDialog);
								this.getView().setBusy(false);
								this._pdfDialog.open()
							}.bind(this))
						} else {
							this.getView().setBusy(false);
							this._pdfDialog.open()
						}*/

		},
		// base64ToBlob: function (base64, mime) {
		// 	const byteCharacters = atob(base64);
		// 	const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
		// 	const byteArray = new Uint8Array(byteNumbers);
		// 	return new Blob([byteArray], {
		// 		type: mime
		// 	});
		// },
		/*_getPDFPaymentAdvice: function (e) {
			return new Promise(function (t, o) {
				let i = "/" + this.getModel().createKey("PayAdvPdfSet", {
					DOCID: e.DOCID,
					ARCH_DOC_ID: e.ARCH_DOC_ID,
					//	PayAdvNo: e.PayAdvNo
				});
				this.getModel().read(i, {
					success: function (e, o) {
						t(e, o)
					},
					error: function (e) {
						o(e)
					}
				})
			}.bind(this))
		},*/
		// _openPDFDialog: function () {
		// 	if (!this._pdfDialog) {
		// 		d.load({
		// 			id: this.getView().getId(),
		// 			name: "in.compass.vim.ZVIM_APPROVAL_WORKFLOW.fragment.PDFViewer",
		// 			controller: this
		// 		}).then(function (e) {
		// 			this._pdfDialog = e;
		// 			this.getView().addDependent(e);
		// 			this.getView().setBusy(false);
		// 			e.open()
		// 		}.bind(this))
		// 	} else {
		// 		this.getView().setBusy(false);
		// 		this._pdfDialog.open()
		// 	}
		// },
		onClosePDFDialog: function () {
			this.getView().setBusy(false);
			this._pdfDialog = null;
			this._pdfDialog.close();
		},
		_onPagehistory: function (oEvent) {
			const sText = oEvent.getSource().getText(); // 10, 20, 30
			if (sText === '20') {
				debugger
				var ohistoryData = this.getView().getModel("history").getData();
				this.oHistoryModel.setSizeLimit(
					ohistoryData.length > 20 ? 20 : ohistoryData.length
				);
				const ohistoryDataModel = new sap.ui.model.json.JSONModel(ohistoryData.slice(0, 20));
				this.getView().setModel(ohistoryDataModel, "history");
				//	this.oHistoryModel.setProperty("/", ohistoryData);

			}
			if (sText === '50') {
				debugger
				var ohistoryData = this.getView().getModel("history").getData();
				this.oHistoryModel.setSizeLimit(
					ohistoryData.length > 50 ? ohistoryData.length : 50
				);
				const ohistoryDataModel = new sap.ui.model.json.JSONModel(ohistoryData.slice(0, 50));
				this.getView().setModel(ohistoryDataModel, "history");
				//	this.oHistoryModel.setProperty("/", ohistoryData);

			}
			if (sText === '100') {
				debugger
				var ohistoryData = this.getView().getModel("history").getData();
				this.oHistoryModel.setSizeLimit(
					ohistoryData.length > 100 ? 100 : ohistoryData.length
				);
				const ohistoryDataModel = new sap.ui.model.json.JSONModel(ohistoryData.slice(0, 100));
				this.getView().setModel(ohistoryDataModel, "history");
				//	this.oHistoryModel.setProperty("/", ohistoryData);

			}
		}
	});

});