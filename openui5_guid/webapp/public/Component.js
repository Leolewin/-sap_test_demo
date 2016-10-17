sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"],
	function(UIComponent, JSONModel){
		"use strict";
		return UIComponent.extend("sap.ui.demo.wt.Component", {
			metadata : {
				// rootView : "sap.ui.demo.wt.view.App"
				manifest : "json"
			},
			init : function(){
				UIComponent.prototype.init.apply(this, arguments);
				var oData = {recipient:{
					name : "Leon!"
					}
				};
				var oModel = new JSONModel(oData);
				this.setModel(oModel);

				// var i18nModel = new ResourceModel({
				// 	bundleName : "sap.ui.demo.wt.i18n.i18n"
				// });
				// this.setModel(i18nModel, "i18n");
			}
		});
	}
);