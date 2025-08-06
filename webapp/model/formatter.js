sap.ui.define(["../lib/momentLibrary"], function(Moment) {
  "use strict";

  return {
    /**
     * Rounds the currency value to 2 digits
     *
     * @public
     * @param {string} sValue value to be formatted
     * @returns {string} formatted currency value with 2 digits
     */
	   tabsVisibility:function(Bstae,oThis){
	    	var that = oThis ? oThis : this;
	    	if(Bstae === ""){
	    		return false;
	    	}
	    	else if(Bstae === "Z001"){
	    		var oText = that.getView().getModel('i18n').getResourceBundle().getText('openDWForAck');
	    		that.getView().byId("poAckTabBar").setName(oText);
	    			return true;
	    	}
	    	else if(Bstae === "0001"){
	    			return true;
	    	}
	    	else{
	    		return true;
	    	}
	    },
	     tabsVisibility1:function(Bstae){
	    	if(Bstae === ""){
	    		return false;
	    	}
	    	else if(Bstae === "Z001"){
	    			return false;
	    			
	    	}
	    	else if(Bstae === "0001"){
	    			return true;
	    	}
	    	else{
	    		return false;
	    	}
	    },
	    // nameChange: function(Bstae){
	    
	    // 	if(Bstae === ""){
	    // 		var	nam1: this.getView().getModel('i18n').getResourceBundle().getText('openDWForAck'),
	    // 		this.getView().byId("poAckTabBar").setText(nam1);
	    		
	  	 //   	}
	    // 	else{
	    // 		var	nam2: this.getView().getModel('i18n').getResourceBundle().getText('openPoForAck');
	    // 			this.getView().byId("poAckTabBar").setText(nam1);
	    	
	    // 	}
	    // },
	    columnVisibility: function(Bstae){
	    	if(Bstae === ""){
	    		return false;
	    	}else{
	    		return true;
	    	}
	    },
    currencyValue: function(sValue) {
      if (!sValue) {
        return "";
      }
      return parseFloat(sValue).toFixed(2);
    },

    /**
     * Formats the date value
     *
     * @public
     * @param {string} sValue value to be formatted
     * @returns {string} formatted date
     */
    dateFormatter: function(sValue) {
      const sFormat = this.getOwnerComponent()
        .getModel("appModel")
        .getProperty("/dateDisplayFormat")
        .toUpperCase();
      if (!this.moment) {
        this.moment = new Moment();
      }
      if (this.moment(sValue, "YYYYMMDD", true).isValid()) {
        return this.moment(sValue, "YYYYMMDD", true).format(sFormat);
      } else {
        return "";
      }
    },

    /**
     * Checks if value is empty and returns value state
     *
     * @public
     * @param {string} sValue value to be checked
     * @returns {string} value state "Error", "None"
     */
    highlightEmpty: function(sValue) {
      if (!sValue || !sValue.trim()) {
        return "Error";
      }
      return "None";
    },

    /**
     * Checks if active and value is empty and returns value state
     *
     * @public
     * @param {string} sValue value to be checked
     * @param {Boolean} bActive if selected
     * @returns {string} value state "Error", "None"
     */
    highlightEmptyASNFields: function(sValue, bActive) {
      if (bActive && (!sValue || !sValue.trim())) {
        return "Error";
      }
      return "None";
    },

    /**
     * Checks if value is empty based on qty difference and returns value state
     *
     * @public
     * @param {string} sReason value to be checked
     * @param {string} sPoQty PO quantity
     * @param {string} sAsnQty ASN Quantity
     * @param {Boolean} bActive if selected
     * @returns {string} value state "Error", "None"
     */
    highlightEmptyReason: function(sReason, sPoQty, sAsnQty, bActive) {
      if (
        bActive &&
        Number(sPoQty) !== Number(sAsnQty) &&
        (!sReason || !sReason.trim())
      ) {
        return "Error";
      }
      return "None";
    },

    /**
     * Checks if date range is empty and returns value state
     *
     * @public
     * @param {Date} oVal1 value to be checked
     * @param {Date} oVal2 value to be checked
     * @returns {string} value state "Error", "None"
     */
    highlightEmptyRange: function(oVal1, oVal2) {
      if (!oVal1 || !oVal2) {
        return "Error";
      }
      return "None";
    },

    /**
     * Checks if value is empty and returns value state text
     *
     * @public
     * @param {string} sValue value to be checked
     * @returns {string} value state text "Required", ""
     */
    highlightEmptyText: function(sValue) {
      let oResourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();
      if (!sValue || !sValue.trim()) {
        return oResourceBundle.getText("required");
      }
      return "";
    },

    /**
     * Enables or disables store keeper name based on Reason field
     *
     * @public
     * @param {string} sReason value to be checked
     * @param {Boolean} bEnabled value to be checked
     * @returns {Boolean} true if enabled
     */
    enablePersonName: function(sReason, bEnabled) {
      if (bEnabled && sReason === "Cancelled by site") {
        return true;
      }
      return false;
    },

    /**
     * Enables or disables ASN reason field based on PO qty and ASN qty
     *
     * @public
     * @param {Boolean} bEnabled value to be checked
     * @param {string} sPoQty PO QTY
     * @param {string} sAsnQty Entered ASN qty
     * @returns {Boolean} true if enabled
     */
    enableReasonAsn: function(bEnabled, sPoQty, sAsnQty) {
      if (bEnabled && Number(sAsnQty) !== Number(sPoQty)) {
        return true;
      }
      return false;
    },

    /**
     * Sets value state of the store keeper name field
     *
     * @public
     * @param {string} sReason value to be checked
     * @param {Boolean} bEnabled value to be checked
     * @param {string} sStoreKeeper value to be checked
     * @returns {Boolean} true if enabled
     */
    highlightRequiredPerson: function(sReason, bEnabled, sStoreKeeper) {
      if (bEnabled && sReason === "Cancelled by site" && !sStoreKeeper) {
        return "Error";
      }
      return "None";
    },

    /**
     * Checks if date range is empty and returns value state text
     *
     * @public
     * @param {Date} oVal1 value to be checked
     * @param {Date} oVal2 value to be checked
     * @returns {string} value state text "Required", ""
     */
    highlightEmptyTextRange: function(oVal1, oVal2) {
      let oResourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();
      if (!oVal1 || !oVal2) {
        return oResourceBundle.getText("required");
      }
      return "";
    }
  };
});
