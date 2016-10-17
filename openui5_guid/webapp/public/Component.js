sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demo/wt/controller/HelloDialog"],
	function(UIComponent, JSONModel, HelloDialog){
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

				//set dialog
				this.helloDialog = new HelloDialog();
			},
			exit : function () {
				this.helloDialog.destroy();
			}

		});
	}
);