/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Bar','./Dialog','./InputBase','./List','./Popover','./StandardListItem','./Table','./Toolbar','./ToolbarSpacer','./library','sap/ui/core/IconPool','jquery.sap.strings'],function(q,B,D,I,L,P,S,T,a,b,l,c){"use strict";var d=I.extend("sap.m.Input",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.InputType",group:"Data",defaultValue:sap.m.InputType.Text},maxLength:{type:"int",group:"Behavior",defaultValue:0},dateFormat:{type:"string",group:"Misc",defaultValue:'YYYY-MM-dd',deprecated:true},showValueHelp:{type:"boolean",group:"Behavior",defaultValue:false},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpOnly:{type:"boolean",group:"Behavior",defaultValue:false},filterSuggests:{type:"boolean",group:"Behavior",defaultValue:true},maxSuggestionWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},startSuggestion:{type:"int",group:"Behavior",defaultValue:1},showTableSuggestionValueHelp:{type:"boolean",group:"Behavior",defaultValue:true},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'50%'},valueLiveUpdate:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"suggestionItems",aggregations:{suggestionItems:{type:"sap.ui.core.Item",multiple:true,singularName:"suggestionItem"},suggestionColumns:{type:"sap.m.Column",multiple:true,singularName:"suggestionColumn",bindable:"bindable"},suggestionRows:{type:"sap.m.ColumnListItem",multiple:true,singularName:"suggestionRow",bindable:"bindable"}},events:{liveChange:{parameters:{value:{type:"string"}}},valueHelpRequest:{parameters:{fromSuggestions:{type:"boolean"}}},suggest:{parameters:{suggestValue:{type:"string"},suggestionColumns:{type:"sap.m.ListBase"}}},suggestionItemSelected:{parameters:{selectedItem:{type:"sap.ui.core.Item"},selectedRow:{type:"sap.m.ColumnListItem"}}},submit:{parameters:{value:{type:"string"}}}}}});c.insertFontFaceStyle();d._DEFAULTFILTER=function(v,i){return q.sap.startsWithIgnoreCase(i.getText(),v);};d._DEFAULTFILTER_TABULAR=function(v,C){var e=C.getCells(),i=0;for(;i<e.length;i++){if(e[i].getText){return q.sap.startsWithIgnoreCase(e[i].getText(),v);}}return false;};d._DEFAULTRESULT_TABULAR=function(C){var e=C.getCells(),i=0;for(;i<e.length;i++){if(e[i].getText){return e[i].getText();}}return"";};d.prototype.init=function(){I.prototype.init.call(this);this._fnFilter=d._DEFAULTFILTER;this._bUseDialog=sap.ui.Device.system.phone;this._bFullScreen=sap.ui.Device.system.phone;this._iSetCount=0;};d.prototype.exit=function(){this._deregisterEvents();this.cancelPendingSuggest();if(this._iRefreshListTimeout){q.sap.clearDelayedCall(this._iRefreshListTimeout);this._iRefreshListTimeout=null;}if(this._oSuggestionPopup){this._oSuggestionPopup.destroy();this._oSuggestionPopup=null;}if(this._oList){this._oList.destroy();this._oList=null;}if(this._oValueHelpIcon){this._oValueHelpIcon.destroy();this._oValueHelpIcon=null;}if(this._oSuggestionTable){this._oSuggestionTable.destroy();this._oSuggestionTable=null;}if(this._oButtonToolbar){this._oButtonToolbar.destroy();this._oButtonToolbar=null;}if(this._oShowMoreButton){this._oShowMoreButton.destroy();this._oShowMoreButton=null;}};d.prototype._resizePopup=function(){var t=this;if(this._oList&&this._oSuggestionPopup){if(this.getMaxSuggestionWidth()){this._oSuggestionPopup.setContentWidth(this.getMaxSuggestionWidth());}else{this._oSuggestionPopup.setContentWidth((this.$().outerWidth())+"px");}setTimeout(function(){if(t._oSuggestionPopup&&t._oSuggestionPopup.isOpen()&&t._oSuggestionPopup.$().outerWidth()<t.$().outerWidth()){t._oSuggestionPopup.setContentWidth((t.$().outerWidth())+"px");}},0);}};d.prototype.onBeforeRendering=function(){I.prototype.onBeforeRendering.call(this);this._deregisterEvents();};d.prototype.onAfterRendering=function(){var t=this;I.prototype.onAfterRendering.call(this);if(!this._bFullScreen){this._resizePopup();this._sPopupResizeHandler=sap.ui.core.ResizeHandler.register(this.getDomRef(),function(){t._resizePopup();});}if(this._bUseDialog){this.$().on("click",q.proxy(function(e){if(this.getShowSuggestion()&&this._oSuggestionPopup&&e.target.id!=this.getId()+"__vhi"){this._oSuggestionPopup.open();}},this));}};d.prototype._getValueHelpIcon=function(){var t=this;if(!this._oValueHelpIcon){var u=c.getIconURI("value-help");this._oValueHelpIcon=c.createControlByURI({id:this.getId()+"__vhi",src:u,useIconTooltip:false,noTabStop:true});this._oValueHelpIcon.addStyleClass("sapMInputValHelpInner");this._oValueHelpIcon.attachPress(function(e){if(!t.getValueHelpOnly()){t.fireValueHelpRequest({fromSuggestions:false});}});}return this._oValueHelpIcon;};d.prototype._fireValueHelpRequestForValueHelpOnly=function(){if(this.getEnabled()&&this.getEditable()&&this.getShowValueHelp()&&this.getValueHelpOnly()){this.fireValueHelpRequest({fromSuggestions:false});}};d.prototype.ontap=function(e){I.prototype.ontap.call(this,e);this._fireValueHelpRequestForValueHelpOnly();};d.prototype.setWidth=function(w){return I.prototype.setWidth.call(this,w||"100%");};d.prototype.getWidth=function(){return this.getProperty("width")||"100%";};d.prototype.setFilterFunction=function(f){if(f===null||f===undefined){this._fnFilter=d._DEFAULTFILTER;return this;}this._fnFilter=f;return this;};d.prototype.setRowResultFunction=function(f){if(f===null||f===undefined){this._fnRowResultFilter=d._DEFAULTRESULT_TABULAR;return this;}this._fnRowResultFilter=f;return this;};d.prototype.setShowValueHelp=function(s){this.setProperty("showValueHelp",s);if(s&&!d.prototype._sAriaValueHelpLabelId){d.prototype._sAriaValueHelpLabelId=new sap.ui.core.InvisibleText({text:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("INPUT_VALUEHELP")}).toStatic().getId();}return this;};d.prototype.setValueHelpOnly=function(v){this.setProperty("valueHelpOnly",v);if(v&&!d.prototype._sAriaInputDisabledLabelId){d.prototype._sAriaInputDisabledLabelId=new sap.ui.core.InvisibleText({text:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("INPUT_DISABLED")}).toStatic().getId();}return this;};d.prototype._doSelect=function(s,e){if(sap.ui.Device.support.touch){return;}var o=this._$input[0];if(o){var r=this._$input;o.focus();r.selectText(s?s:0,e?e:r.val().length);}return this;};d.prototype._scrollToItem=function(i){var p=this._oSuggestionPopup,o=this._oList,s,e,f,t,g;if(!(p instanceof P)||!o){return;}s=p.getScrollDelegate();if(!s){return;}var h=o.getItems()[i],j=h&&h.getDomRef();if(!j){return;}e=p.getDomRef("cont").getBoundingClientRect();f=j.getBoundingClientRect();t=e.top-f.top;g=f.bottom-e.bottom;if(t>0){s.scrollTo(s._scrollX,Math.max(s._scrollY-t,0));}else if(g>0){s.scrollTo(s._scrollX,s._scrollY+g);}};d.prototype._isSuggestionItemSelectable=function(i){return i.getVisible()&&(this._hasTabularSuggestions()||i.getType()!==sap.m.ListType.Inactive);};d.prototype._onsaparrowkey=function(e,s,i){if(!this.getEnabled()||!this.getEditable()){return;}if(!this._oSuggestionPopup||!this._oSuggestionPopup.isOpen()){return;}if(s!=="up"&&s!=="down"){return;}e.preventDefault();e.stopPropagation();var f=false,o=this._oList,g=this.getSuggestionItems(),h=o.getItems(),j=this._iPopupListSelectedIndex,n,O=j;if(s==="up"&&j===0){return;}if(s=="down"&&j===h.length-1){return;}var k;if(i>1){if(s=="down"&&j+i>=h.length){s="up";i=1;h[j].setSelected(false);k=j;j=h.length-1;f=true;}else if(s=="up"&&j-i<0){s="down";i=1;h[j].setSelected(false);k=j;j=0;f=true;}}if(j===-1){j=0;if(this._isSuggestionItemSelectable(h[j])){O=j;f=true;}else{s="down";}}if(s==="down"){while(j<h.length-1&&(!f||!this._isSuggestionItemSelectable(h[j]))){h[j].setSelected(false);j=j+i;f=true;i=1;if(k===j){break;}}}else{while(j>0&&(!f||!h[j].getVisible()||!this._isSuggestionItemSelectable(h[j]))){h[j].setSelected(false);j=j-i;f=true;i=1;if(k===j){break;}}}if(!this._isSuggestionItemSelectable(h[j])){if(O>=0){h[O].setSelected(true).updateAccessibilityState();this.$("inner").attr("aria-activedescendant",h[O].getId());}return;}else{h[j].setSelected(true).updateAccessibilityState();this.$("inner").attr("aria-activedescendant",h[j].getId());}if(sap.ui.Device.system.desktop){this._scrollToItem(j);}if(sap.m.ColumnListItem&&h[j]instanceof sap.m.ColumnListItem){n=this._getInputValue(this._fnRowResultFilter(h[j]));}else{var m=(g[0]instanceof sap.ui.core.ListItem?true:false);if(m){n=this._getInputValue(h[j].getLabel());}else{n=this._getInputValue(h[j].getTitle());}}this._$input.val(n);this._sSelectedSuggViaKeyboard=n;this._doSelect();this._iPopupListSelectedIndex=j;};d.prototype.onsapup=function(e){this._onsaparrowkey(e,"up",1);};d.prototype.onsapdown=function(e){this._onsaparrowkey(e,"down",1);};d.prototype.onsappageup=function(e){this._onsaparrowkey(e,"up",5);};d.prototype.onsappagedown=function(e){this._onsaparrowkey(e,"down",5);};d.prototype.onsaphome=function(e){if(this._oList){this._onsaparrowkey(e,"up",this._oList.getItems().length);}};d.prototype.onsapend=function(e){if(this._oList){this._onsaparrowkey(e,"down",this._oList.getItems().length);}};d.prototype.onsapescape=function(e){var f;if(this._oSuggestionPopup&&this._oSuggestionPopup.isOpen()){e.originalEvent._sapui_handledByControl=true;this._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();if(this._sBeforeSuggest!==undefined){if(this._sBeforeSuggest!==this.getValue()){f=this._lastValue;this.setValue(this._sBeforeSuggest);this._lastValue=f;}this._sBeforeSuggest=undefined;}return;}if(I.prototype.onsapescape){I.prototype.onsapescape.apply(this,arguments);}};d.prototype.onsapenter=function(e){if(I.prototype.onsapenter){I.prototype.onsapenter.apply(this,arguments);}this.cancelPendingSuggest();if(this._oSuggestionPopup&&this._oSuggestionPopup.isOpen()){if(this._iPopupListSelectedIndex>=0){this._fireSuggestionItemSelectedEvent();this._doSelect();this._iPopupListSelectedIndex=-1;}this._closeSuggestionPopup();}if(this.getEnabled()&&this.getEditable()&&!(this.getValueHelpOnly()&&this.getShowValueHelp())){this.fireSubmit({value:this.getValue()});}};d.prototype.onsapfocusleave=function(e){var p=this._oSuggestionPopup;if(p instanceof P){if(e.relatedControlId&&q.sap.containsOrEquals(p.getDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){this._bPopupHasFocus=true;this.focus();}else{if(this._$input.val()===this._sSelectedSuggViaKeyboard){this._sSelectedSuggViaKeyboard=null;}}}var f=sap.ui.getCore().byId(e.relatedControlId);if(!(p&&f&&q.sap.containsOrEquals(p.getDomRef(),f.getFocusDomRef()))){I.prototype.onsapfocusleave.apply(this,arguments);}};d.prototype.onmousedown=function(e){var p=this._oSuggestionPopup;if((p instanceof P)&&p.isOpen()){e.stopPropagation();}};d.prototype._deregisterEvents=function(){if(this._sPopupResizeHandler){sap.ui.core.ResizeHandler.deregister(this._sPopupResizeHandler);this._sPopupResizeHandler=null;}if(this._bUseDialog&&this._oSuggestionPopup){this.$().off("click");}};d.prototype.updateSuggestionItems=function(){this.updateAggregation("suggestionItems");this._refreshItemsDelayed();return this;};d.prototype.cancelPendingSuggest=function(){if(this._iSuggestDelay){q.sap.clearDelayedCall(this._iSuggestDelay);this._iSuggestDelay=null;}};d.prototype._triggerSuggest=function(v){this.cancelPendingSuggest();if(!v){v="";}if(v.length>=this.getStartSuggestion()){this._iSuggestDelay=q.sap.delayedCall(300,this,function(){this._bBindingUpdated=false;this.fireSuggest({suggestValue:v});if(!this._bBindingUpdated){this._refreshItemsDelayed();}});}else if(this._bUseDialog){if(this._oList instanceof T){this._oList.addStyleClass("sapMInputSuggestionTableHidden");}else if(this._oList&&this._oList.destroyItems){this._oList.destroyItems();}}else if(this._oSuggestionPopup&&this._oSuggestionPopup.isOpen()){this._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}};(function(){d.prototype.setShowSuggestion=function(v){this.setProperty("showSuggestion",v,true);this._iPopupListSelectedIndex=-1;if(v){this._lazyInitializeSuggestionPopup(this);}else{g(this);}return this;};d.prototype.setShowTableSuggestionValueHelp=function(v){this.setProperty("showTableSuggestionValueHelp",v,true);if(!this._oSuggestionPopup){return this;}if(v){this._addShowMoreButton();}else{this._removeShowMoreButton();}return this;};d.prototype._getShowMoreButton=function(){var t=this,m=sap.ui.getCore().getLibraryResourceBundle("sap.m");return this._oShowMoreButton||(this._oShowMoreButton=new sap.m.Button({text:m.getText("INPUT_SUGGESTIONS_SHOW_ALL"),press:function(){if(t.getShowTableSuggestionValueHelp()){t.fireValueHelpRequest({fromSuggestions:true});t._iPopupListSelectedIndex=-1;t._closeSuggestionPopup();}}}));};d.prototype._getButtonToolbar=function(){var s=this._getShowMoreButton();return this._oButtonToolbar||(this._oButtonToolbar=new a({content:[new b(),s]}));};d.prototype._addShowMoreButton=function(t){if(!this._oSuggestionPopup||!t&&!this._hasTabularSuggestions()){return;}if(this._oSuggestionPopup instanceof D){var s=this._getShowMoreButton();this._oSuggestionPopup.setEndButton(s);}else{var h=this._getButtonToolbar();this._oSuggestionPopup.setFooter(h);}};d.prototype._removeShowMoreButton=function(){if(!this._oSuggestionPopup||!this._hasTabularSuggestions()){return;}if(this._oSuggestionPopup instanceof D){this._oSuggestionPopup.setEndButton(null);}else{this._oSuggestionPopup.setFooter(null);}};d.prototype.oninput=function(E){I.prototype.oninput.call(this,E);if(E.isMarked("invalid")){return;}var v=this._$input.val();if(this.getMaxLength()>0&&this.getType()!==sap.m.InputType.Number&&v.length>this.getMaxLength()){v=v.substring(0,this.getMaxLength());this._$input.val(v);}if(this.getValueLiveUpdate()){this.setProperty("value",v,true);}this.fireLiveChange({value:v,newValue:v});if(this.getShowSuggestion()&&!this._bUseDialog){this._triggerSuggest(v);}};d.prototype.getValue=function(){return this.getDomRef("inner")&&this._$input?this._$input.val():this.getProperty("value");};d.prototype._refreshItemsDelayed=function(){q.sap.clearDelayedCall(this._iRefreshListTimeout);this._iRefreshListTimeout=q.sap.delayedCall(0,this,r,[this]);};d.prototype.addSuggestionItem=function(i){this.addAggregation("suggestionItems",i,true);this._refreshItemsDelayed();f(this);return this;};d.prototype.insertSuggestionItem=function(i,h){this.insertAggregation("suggestionItems",h,i,true);this._refreshItemsDelayed();f(this);return this;};d.prototype.removeSuggestionItem=function(i){var h=this.removeAggregation("suggestionItems",i,true);this._refreshItemsDelayed();return h;};d.prototype.removeAllSuggestionItems=function(){var h=this.removeAllAggregation("suggestionItems",true);this._refreshItemsDelayed();return h;};d.prototype.destroySuggestionItems=function(){this.destroyAggregation("suggestionItems",true);this._refreshItemsDelayed();return this;};d.prototype.addSuggestionRow=function(i){i.setType(sap.m.ListType.Active);this.addAggregation("suggestionRows",i);this._refreshItemsDelayed();f(this);return this;};d.prototype.insertSuggestionRow=function(i,h){i.setType(sap.m.ListType.Active);this.insertAggregation("suggestionRows",h,i);this._refreshItemsDelayed();f(this);return this;};d.prototype.removeSuggestionRow=function(i){var h=this.removeAggregation("suggestionRows",i);this._refreshItemsDelayed();return h;};d.prototype.removeAllSuggestionRows=function(){var h=this.removeAllAggregation("suggestionRows");this._refreshItemsDelayed();return h;};d.prototype.destroySuggestionRows=function(){this.destroyAggregation("suggestionRows");this._refreshItemsDelayed();return this;};d.prototype.bindAggregation=function(){var h=Array.prototype.slice.call(arguments);if(h[0]==="suggestionRows"||h[0]==="suggestionColumns"||h[0]==="suggestionItems"){f(this,h[0]==="suggestionRows"||h[0]==="suggestionColumns");this._bBindingUpdated=true;}this._callMethodInManagedObject.apply(this,["bindAggregation"].concat(h));return this;};d.prototype._lazyInitializeSuggestionPopup=function(){if(!this._oSuggestionPopup){e(this);}};d.prototype._closeSuggestionPopup=function(){if(this._oSuggestionPopup){this.cancelPendingSuggest();this._oSuggestionPopup.close();this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-haspopup");this.$("inner").removeAttr("aria-activedescendant");}};function e(i){var m=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(i._bUseDialog){i._oPopupInput=new d(i.getId()+"-popup-input",{width:"100%",valueLiveUpdate:true,showValueHelp:i.getShowValueHelp(),valueHelpRequest:function(E){i.fireValueHelpRequest({fromSuggestions:true});i._iPopupListSelectedIndex=-1;i._closeSuggestionPopup();},liveChange:function(E){var v=E.getParameter("newValue");i._$input.val(i._getInputValue(i._oPopupInput.getValue()));i._triggerSuggest(v);i.fireLiveChange({value:v,newValue:v});}}).addStyleClass("sapMInputSuggInDialog");}i._oSuggestionPopup=!i._bUseDialog?(new P(i.getId()+"-popup",{showArrow:false,showHeader:false,placement:sap.m.PlacementType.Vertical,initialFocus:i}).attachAfterClose(function(){if(i._iPopupListSelectedIndex>=0){i._fireSuggestionItemSelectedEvent();}if(i._oList instanceof T){i._oList.removeSelections(true);}else{i._oList.destroyItems();}}).attachBeforeOpen(function(){i._sBeforeSuggest=i.getValue();})):(new D(i.getId()+"-popup",{beginButton:new sap.m.Button(i.getId()+"-popup-closeButton",{text:m.getText("MSGBOX_CLOSE"),press:function(){i._closeSuggestionPopup();}}),stretch:i._bFullScreen,contentHeight:i._bFullScreen?undefined:"20rem",customHeader:new B(i.getId()+"-popup-header",{contentMiddle:i._oPopupInput.addEventDelegate({onsapenter:function(){if(!(sap.m.MultiInput&&i instanceof sap.m.MultiInput)){i._closeSuggestionPopup();}}},this)}),horizontalScrolling:false,initialFocus:i._oPopupInput}).attachBeforeOpen(function(){i._oPopupInput.setPlaceholder(i.getPlaceholder());i._oPopupInput.setMaxLength(i.getMaxLength());}).attachBeforeClose(function(){i._$input.val(i._getInputValue(i._oPopupInput.getValue()));i.onChange();if(i instanceof sap.m.MultiInput){i._validateCurrentText();}}).attachAfterClose(function(){if(i instanceof sap.m.MultiInput&&i._isMultiLineMode){i._updateTokenizerInMultiInput();i._tokenizerInPopup.destroy();i._showIndicator();setTimeout(function(){i._setContainerSizes();},0);}if(i._oList){if(T&&!(i._oList instanceof T)){i._oList.destroyItems();}else{i._oList.removeSelections(true);}}}).attachAfterOpen(function(){var v=i.getValue();i._oPopupInput.setValue(v);i._triggerSuggest(v);r(i);}));i._oSuggestionPopup.addStyleClass("sapMInputSuggestionPopup");i.addDependent(i._oSuggestionPopup);if(!i._bUseDialog){o(i._oSuggestionPopup,i);}if(i._oList){i._oSuggestionPopup.addContent(i._oList);}if(i.getShowTableSuggestionValueHelp()){i._addShowMoreButton();}}function f(i,t){if(i._oList){return;}if(!i._hasTabularSuggestions()&&!t){i._oList=new L(i.getId()+"-popup-list",{width:"100%",showNoData:false,mode:sap.m.ListMode.SingleSelectMaster,rememberSelections:false,itemPress:function(E){var j=E.getParameter("listItem"),C=i._iSetCount,n;i.fireSuggestionItemSelected({selectedItem:j._oItem});if(C!==i._iSetCount){n=i.getValue();}else if(j instanceof sap.m.DisplayListItem){n=j.getLabel();}else{n=j.getTitle();}if(i._bUseDialog){i._oPopupInput.setValue(n);i._oPopupInput._doSelect();}else{i._$input.val(i._getInputValue(n));i.onChange();}i._iPopupListSelectedIndex=-1;if(!(i._bUseDialog&&i instanceof sap.m.MultiInput&&i._isMultiLineMode)){i._closeSuggestionPopup();}if(!sap.ui.Device.support.touch){i._doSelect();}}});}else{if(i._fnFilter===d._DEFAULTFILTER){i._fnFilter=d._DEFAULTFILTER_TABULAR;}if(!i._fnRowResultFilter){i._fnRowResultFilter=d._DEFAULTRESULT_TABULAR;}i._oList=i._getSuggestionsTable();if(i.getShowTableSuggestionValueHelp()){i._addShowMoreButton(t);}}if(i._oSuggestionPopup){if(i._bUseDialog){i._oSuggestionPopup.addAggregation("content",i._oList,true);var R=i._oSuggestionPopup.$("scrollCont")[0];if(R){var h=sap.ui.getCore().createRenderManager();h.renderControl(i._oList);h.flush(R);h.destroy();}}else{i._oSuggestionPopup.addContent(i._oList);}}}function g(i){if(i._oSuggestionPopup){if(i._oList instanceof T){i._oSuggestionPopup.removeAllContent();i._removeShowMoreButton();}i._oSuggestionPopup.destroy();i._oSuggestionPopup=null;}if(i._oList instanceof L){i._oList.destroy();i._oList=null;}}function o(p,i){p.open=function(){this.openBy(i,false,true);};p.oPopup.setAnimations(function(R,h,O){O();},function(R,h,C){C();});}function r(h){var s=h.getShowSuggestion();h._iPopupListSelectedIndex=-1;if(!(s&&h.getDomRef()&&(h._bUseDialog||h.$().hasClass("sapMInputFocused")))){return false;}var j,k=h.getSuggestionItems(),t=h.getSuggestionRows(),m=h._$input.val()||"",n=h._oList,F=h.getFilterSuggests(),H=[],p=0,u=h._oSuggestionPopup,v={ontouchstart:function(E){(E.originalEvent||E)._sapui_cancelAutoClose=true;}},w,i;if(h._oList){if(h._oList instanceof T){n.removeSelections(true);}else{n.destroyItems();}}if(m.length<h.getStartSuggestion()){if(!h._bUseDialog){h._iPopupListSelectedIndex=-1;this.cancelPendingSuggest();u.close();}else{if(h._hasTabularSuggestions()&&h._oList){h._oList.addStyleClass("sapMInputSuggestionTableHidden");}}h.$("SuggDescr").text("");h.$("inner").removeAttr("aria-haspopup");h.$("inner").removeAttr("aria-activedescendant");return false;}if(h._hasTabularSuggestions()){if(h._bUseDialog&&h._oList){h._oList.removeStyleClass("sapMInputSuggestionTableHidden");}for(i=0;i<t.length;i++){if(!F||h._fnFilter(m,t[i])){t[i].setVisible(true);H.push(t[i]);}else{t[i].setVisible(false);}}}else{var x=(k[0]instanceof sap.ui.core.ListItem?true:false);for(i=0;i<k.length;i++){j=k[i];if(!F||h._fnFilter(m,j)){if(x){w=new sap.m.DisplayListItem(j.getId()+"-dli");w.setLabel(j.getText());w.setValue(j.getAdditionalText());}else{w=new S(j.getId()+"-sli");w.setTitle(j.getText());}w.setType(j.getEnabled()?sap.m.ListType.Active:sap.m.ListType.Inactive);w._oItem=j;w.addEventDelegate(v);H.push(w);}}}p=H.length;var A="";if(p>0){if(p==1){A=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("INPUT_SUGGESTIONS_ONE_HIT");}else{A=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("INPUT_SUGGESTIONS_MORE_HITS",p);}h.$("inner").attr("aria-haspopup","true");if(!h._hasTabularSuggestions()){for(i=0;i<p;i++){n.addItem(H[i]);}}if(!h._bUseDialog){if(h._sCloseTimer){clearTimeout(h._sCloseTimer);h._sCloseTimer=null;}if(!u.isOpen()&&!h._sOpenTimer&&(this.getValue().length>=this.getStartSuggestion())){h._sOpenTimer=setTimeout(function(){h._resizePopup();h._sOpenTimer=null;u.open();},0);}}}else{A=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("INPUT_SUGGESTIONS_NO_HIT");h.$("inner").removeAttr("aria-haspopup");h.$("inner").removeAttr("aria-activedescendant");if(!h._bUseDialog){if(u.isOpen()){h._sCloseTimer=setTimeout(function(){h._iPopupListSelectedIndex=-1;h.cancelPendingSuggest();u.close();},0);}}else{if(h._hasTabularSuggestions()&&h._oList){h._oList.addStyleClass("sapMInputSuggestionTableHidden");}}}h.$("SuggDescr").text(A);}})();d.prototype.onfocusin=function(e){I.prototype.onfocusin.apply(this,arguments);this.$().addClass("sapMInputFocused");if(!this._bPopupHasFocus&&!this.getStartSuggestion()&&!this.getValue()){this._triggerSuggest(this.getValue());}this._bPopupHasFocus=undefined;};d.prototype.onsapshow=function(e){if(!this.getEnabled()||!this.getEditable()||!this.getShowValueHelp()){return;}this.fireValueHelpRequest({fromSuggestions:false});e.preventDefault();e.stopPropagation();};d.prototype.onsaphide=d.prototype.onsapshow;d.prototype.onsapselect=function(e){this._fireValueHelpRequestForValueHelpOnly();};d.prototype.onfocusout=function(e){I.prototype.onfocusout.apply(this,arguments);this.$().removeClass("sapMInputFocused");this.closeValueStateMessage(this);};d.prototype._hasTabularSuggestions=function(){return!!(this.getAggregation("suggestionColumns")&&this.getAggregation("suggestionColumns").length);};d.prototype._getSuggestionsTable=function(){var t=this;if(!this._oSuggestionTable){this._oSuggestionTable=new T(this.getId()+"-popup-table",{mode:sap.m.ListMode.SingleSelectMaster,showNoData:false,showSeparators:"All",width:"100%",enableBusyIndicator:false,rememberSelections:false,selectionChange:function(e){var i=t,C=i._iSetCount,s=e.getParameter("listItem"),n;t.fireSuggestionItemSelected({selectedRow:s});if(C!==i._iSetCount){n=i.getValue();}else{n=t._fnRowResultFilter(s);}if(t._bUseDialog){t._oPopupInput.setValue(n);t._oPopupInput._doSelect();}else{t._$input.val(t._getInputValue(n));t.onChange();}t._iPopupListSelectedIndex=-1;if(!(i._bUseDialog&&i instanceof sap.m.MultiInput&&i._isMultiLineMode)){i._closeSuggestionPopup();}if(!sap.ui.Device.support.touch){t._doSelect();}}});if(this._bUseDialog){this._oSuggestionTable.addStyleClass("sapMInputSuggestionTableHidden");}this._oSuggestionTable.updateItems=function(){T.prototype.updateItems.apply(this,arguments);t._refreshItemsDelayed();return this;};}return this._oSuggestionTable;};d.prototype._fireSuggestionItemSelectedEvent=function(){if(this._iPopupListSelectedIndex>=0){var s=this._oList.getItems()[this._iPopupListSelectedIndex];if(s){if(sap.m.ColumnListItem&&s instanceof sap.m.ColumnListItem){this.fireSuggestionItemSelected({selectedRow:s});}else{this.fireSuggestionItemSelected({selectedItem:s._oItem});}}this._iPopupListSelectedIndex=-1;}};d.prototype._callMethodInManagedObject=function(f,A){var e=Array.prototype.slice.call(arguments),s;if(A==="suggestionColumns"){s=this._getSuggestionsTable();return s[f].apply(s,["columns"].concat(e.slice(2)));}else if(A==="suggestionRows"){s=this._getSuggestionsTable();return s[f].apply(s,["items"].concat(e.slice(2)));}else{return sap.ui.core.Control.prototype[f].apply(this,e.slice(1));}};d.prototype.validateAggregation=function(A,o,m){return this._callMethodInManagedObject("validateAggregation",A,o,m);};d.prototype.setAggregation=function(A,o,s){this._callMethodInManagedObject("setAggregation",A,o,s);return this;};d.prototype.getAggregation=function(A,o){return this._callMethodInManagedObject("getAggregation",A,o);};d.prototype.indexOfAggregation=function(A,o){return this._callMethodInManagedObject("indexOfAggregation",A,o);};d.prototype.insertAggregation=function(A,o,i,s){this._callMethodInManagedObject("insertAggregation",A,o,i,s);return this;};d.prototype.addAggregation=function(A,o,s){this._callMethodInManagedObject("addAggregation",A,o,s);return this;};d.prototype.removeAggregation=function(A,o,s){return this._callMethodInManagedObject("removeAggregation",A,o,s);};d.prototype.removeAllAggregation=function(A,s){return this._callMethodInManagedObject("removeAllAggregation",A,s);};d.prototype.destroyAggregation=function(A,s){this._callMethodInManagedObject("destroyAggregation",A,s);return this;};d.prototype.getBinding=function(A){return this._callMethodInManagedObject("getBinding",A);};d.prototype.getBindingInfo=function(A){return this._callMethodInManagedObject("getBindingInfo",A);};d.prototype.getBindingPath=function(A){return this._callMethodInManagedObject("getBindingPath",A);};d.prototype.clone=function(){var i=sap.ui.core.Control.prototype.clone.apply(this,arguments),e;e=this.getBindingInfo("suggestionColumns");if(e){i.bindAggregation("suggestionColumns",e);}else{this.getSuggestionColumns().forEach(function(C){i.addSuggestionColumn(C.clone(),true);});}e=this.getBindingInfo("suggestionRows");if(e){i.bindAggregation("suggestionRows",e);}else{this.getSuggestionRows().forEach(function(r){i.addSuggestionRow(r.clone(),true);});}return i;};d.prototype.setValue=function(v){this._iSetCount++;I.prototype.setValue.call(this,v);return this;};d.prototype.getAccessibilityInfo=function(){var i=I.prototype.getAccessibilityInfo.apply(this,arguments);i.description=((i.description||"")+" "+this.getDescription()).trim();return i;};return d;},true);
