/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ComboBox','./library','sap/ui/core/History','sap/ui/core/SeparatorItem'],function(q,C,a,H,S){"use strict";var D=C.extend("sap.ui.commons.DropdownBox",{metadata:{library:"sap.ui.commons",properties:{searchHelpEnabled:{type:"boolean",group:"Behavior",defaultValue:false},searchHelpText:{type:"string",group:"Appearance",defaultValue:null},searchHelpAdditionalText:{type:"string",group:"Appearance",defaultValue:null},searchHelpIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},maxHistoryItems:{type:"int",group:"Behavior",defaultValue:0}},events:{searchHelp:{parameters:{value:{type:"string"}}}}}});D.prototype.init=function(){C.prototype.init.apply(this,arguments);this._oValueBeforePaste=null;this._oValueBeforeOpen=null;this.__aItems=null;this._iCursorPosBeforeBackspace=null;this._searchHelpItem=null;this._iItemsForHistory=10;this._oHistory=new H(this.getId());};D.prototype.exit=function(){var I=this.getId()+"-h-";if(this._searchHelpItem){this._searchHelpItem[0].destroy();this._searchHelpItem[1].destroy();this._searchHelpItem=null;}C.prototype.exit.apply(this,arguments);function r(b){var o=sap.ui.getCore().byId(b);if(o){o.destroy();}}for(var i=0;i<this.getMaxHistoryItems();i++){r(I+i);}if(this.__oSeparator){this.__oSeparator.destroy();this.__oSeparator=null;}this._oHistory=null;this.__aItems=null;this._sWantedValue=undefined;};D.prototype.onAfterRendering=function(e){C.prototype.onAfterRendering.apply(this,arguments);if(!this._sHandleItemsChanged){this.checkValueInItems();}};D.prototype.getItems=function(){if(this.oPopup&&this.oPopup.isOpen()){return this.__aItems;}else{return C.prototype.getItems.apply(this,arguments);}};D.prototype.insertItem=function(i,I){if(this.oPopup&&this.oPopup.isOpen()){this.__aItems.splice(I,0,i);if(this.__aItems.length<=this._iItemsForHistory&&!this._searchHelpItem){this._getListBox().insertItem(i,I);}if(!this._bNoItemCheck){var r=q(this.getInputDomRef());var c=r.cursorPos();this._doTypeAhead(r.val().substr(0,c),"");}return this;}else{return C.prototype.insertItem.apply(this,arguments);}};D.prototype.addItem=function(i){if(this.oPopup&&this.oPopup.isOpen()){this.__aItems.push(i);if(this.__aItems.length<=this._iItemsForHistory&&!this._searchHelpItem){this._getListBox().addItem(i);}if(!this._bNoItemCheck){var r=q(this.getInputDomRef());var c=r.cursorPos();this._doTypeAhead(r.val().substr(0,c),"");}return this;}else{return C.prototype.addItem.apply(this,arguments);}};D.prototype.removeItem=function(e){if(this.oPopup&&this.oPopup.isOpen()){var I=null;var o=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){for(var i=0;i<this.__aItems.length;i++){if(this.__aItems[i]==e){e=i;break;}}}if(typeof(e)=="number"){if(e<0||e>=this.__aItems.length){q.sap.log.warning("Element.removeAggregation called with invalid index: Items, "+e);}else{I=this.__aItems[e];this.__aItems.splice(e,1);}}if(this.__aItems.length<=this._iItemsForHistory&&!this._searchHelpItem){this._getListBox().removeItem(o);}if(!this._bNoItemCheck){var r=q(this.getInputDomRef());var c=r.cursorPos();this._doTypeAhead(r.val().substr(0,c),"");}return I;}else{return C.prototype.removeItem.apply(this,arguments);}};D.prototype.removeAllItems=function(){if(this.oPopup&&this.oPopup.isOpen()){var i=this.__aItems;if(!i){return[];}C.prototype.removeAllItems.apply(this,arguments);this.__aItems=[];return i;}else{return C.prototype.removeAllItems.apply(this,arguments);}};D.prototype.indexOfItem=function(I){if(this.oPopup&&this.oPopup.isOpen()){if(this.__aItems){if(this.__aItems.length==undefined){return-2;}for(var i=0;i<this.__aItems.length;i++){if(this.__aItems[i]==I){return i;}}}return-1;}else{return C.prototype.indexOfItem.apply(this,arguments);}};D.prototype.destroyItems=function(){if(this.oPopup&&this.oPopup.isOpen()){if(!this.__aItems){return this;}this._getListBox().removeAllItems();for(var i=0;i<this.__aItems.length;i++){if(this.__aItems[i]){this.__aItems[i].destroy();}}this.__aItems=[];return this;}else{return C.prototype.destroyItems.apply(this,arguments);}};D.prototype.updateItems=function(){C.prototype.updateItems.apply(this,arguments);if(this.oPopup&&this.oPopup.isOpen()){var r=q(this.getInputDomRef());var c=r.cursorPos();this._doTypeAhead(r.val().substr(0,c),"");}};D.prototype._handleItemsChanged=function(e,d){if(d){this._sHandleItemsChanged=null;this._bNoItemCheck=undefined;}if(this._bNoItemCheck){return;}if(this.__aItems&&(!this.oPopup||!this.oPopup.isOpen())){throw new Error("DropdownBox "+this.getId()+" : this.__aItems is not empty!");}if(this.getListBox()&&this.oPopup&&this.oPopup.isOpen()){if(this.__aItems.length>this._iItemsForHistory||this._searchHelpItem){var I;var i=0;switch(e.getParameter("event")){case"destroyItems":for(i=0;i<this.__aItems.length;i++){I=this.__aItems[i];if(!I.bIsDestroyed){I.destroy();}}this.__aItems=[];if(this.getSearchHelpEnabled()){this._searchHelpItem=null;this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),this.getSearchHelpAdditionalText(),this.getSearchHelpIcon());}break;case"removeAllItems":this.__aItems=[];break;case"removeItem":I=e.getParameter("item");for(i=0;i<this.__aItems.length;i++){if(this.__aItems[i]==I){this.__aItems.splice(i,1);break;}}if(this.__aItems.length<=this._iItemsForHistory){this._getListBox().setItems(this.__aItems,false,true);}break;case"insertItem":this.__aItems.splice(e.getParameter("index"),0,e.getParameter("item"));break;case"addItem":this.__aItems.push(e.getParameter("item"));break;case"setItems":this.__aItems=e.getParameter("items");break;case"updateItems":for(i=0;i<this.__aItems.length;i++){I=this.__aItems[i];if(!I.bIsDestroyed){I.destroy();}}if(this.getSearchHelpEnabled()){this._searchHelpItem=null;this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),this.getSearchHelpAdditionalText(),this.getSearchHelpIcon());}this.__aItems=this._getListBox().getItems();break;default:break;}}else{this.__aItems=this._getListBox().getItems();}var r=q(this.getInputDomRef());var c=r.cursorPos();this._doTypeAhead(r.val().substr(0,c),"");}C.prototype._handleItemsChanged.apply(this,arguments);this.checkValueInItems();};D.prototype.onclick=function(e){if(!this.mobile&&this.getEnabled&&this.getEnabled()&&this.getEditable()){if(this.oPopup&&this.oPopup.isOpen()){this._close();this._doSelect();}else if(!this._F4ForClose){this._open();}this.focus();}this._F4ForClose=false;};D.prototype.onmousedown=function(e){if(!this.getEnabled()||!this.getEditable()){return;}if(this.oPopup&&this.oPopup.isOpen()){this._F4ForClose=true;}else{this._F4ForOpen=true;}C.prototype.onmousedown.apply(this,arguments);};D.prototype.onsapshow=function(e){if(this.mobile){return;}if(!this.getEnabled()||!this.getEditable()){e.preventDefault();e.stopImmediatePropagation();return;}if(e.which===q.sap.KeyCodes.F4&&this._searchHelpItem){this._close();this.fireSearchHelp({value:q(this.getInputDomRef()).val()});e.preventDefault();e.stopImmediatePropagation();return;}if(this.oPopup&&this.oPopup.isOpen()){this._close();}else{this._open();var l=this._getListBox();l.scrollToIndex(l.getSelectedIndex());this._doSelect();}e.preventDefault();e.stopImmediatePropagation();};D.prototype.onkeydown=function(e){if(e.target.id==this.getId()+"-select"){return;}if(!!sap.ui.Device.browser.webkit&&(e.which==q.sap.KeyCodes.DELETE||e.which==q.sap.KeyCodes.BACKSPACE)){this.onkeypress(e);}if(!sap.ui.Device.browser.internet_explorer||e.which!==q.sap.KeyCodes.BACKSPACE){return;}this._iCursorPosBeforeBackspace=q(this.getInputDomRef()).cursorPos();};D.prototype.onpaste=function(e){if(e.target.id==this.getId()+"-select"){return;}if(this._oValueBeforePaste===null){this._oValueBeforePaste=q(this.getInputDomRef()).val();}};D.prototype.oncut=D.prototype.onpaste;D.prototype.oninput=function(e){if(this.mobile){return;}if(!this._realOninput(e)){return;}var r=q(this.getInputDomRef());var v=r.val();if(!this.oPopup||!this.oPopup.isOpen()){this.noTypeAheadByOpen=true;this._open();this.noTypeAheadByOpen=undefined;}var V=this._doTypeAhead(v,"");if(!V&&this._oValueBeforePaste){this._doTypeAhead("",this._oValueBeforePaste);}this._oValueBeforePaste=null;this._fireLiveChange(e);};D.prototype.onkeyup=function(e){if(e.target.id==this.getId()+"-select"){return;}if(!this.getEnabled()||!this.getEditable()){return;}var k=e.which,K=q.sap.KeyCodes;sap.ui.commons.TextField.prototype.onkeyup.apply(this,arguments);if(!(!!sap.ui.Device.browser.internet_explorer&&k===K.BACKSPACE)&&this._oValueBeforePaste===null||k===K.TAB){return;}if(!this.oPopup||!this.oPopup.isOpen()){this.noTypeAheadByOpen=true;this._open();this.noTypeAheadByOpen=undefined;}var r=q(this.getInputDomRef()),v=false;if(k===K.BACKSPACE&&this._iCursorPosBeforeBackspace!==null){var c=r.cursorPos();if(this._iCursorPosBeforeBackspace!==c){c++;}this._iCursorPosBeforeBackspace=null;v=this._doTypeAhead(r.val().substr(0,c-1),"");}else if(!(v=this._doTypeAhead("",r.val()))){r.val(this._oValueBeforePaste);}if(v){this._getListBox().rerender();}this._oValueBeforePaste=null;};D.prototype.onsaphome=function(e){if(e.target.id==this.getId()+"-select"){return;}if((!this.oPopup||!this.oPopup.isOpen())&&this.getEditable()&&this.getEnabled()){sap.ui.commons.TextField.prototype.onsaphome.apply(this,arguments);var r=q(this.getInputDomRef());r.cursorPos(0);this._updateSelection();e.preventDefault();}else{C.prototype.onsaphome.apply(this,arguments);}};D.prototype.onsapdelete=function(e){if(e.target.id==this.getId()+"-select"){return;}if(!this.oPopup||!this.oPopup.isOpen()){return;}var l=this._getListBox(),i=l.getSelectedItem(),m=i.getId().match(/\-h\-([0-4])/),I=l.getSelectedIndex();if(m&&m.length===2){this._oHistory.remove(i.getText());l.removeItem(I);var L=this._oHistory.get().length;if(L===0){l.removeItem(0);}l.rerender();var n=I+(this._searchHelpItem?2:0);if(n==L){n++;}l.setSelectedIndex(n);this.setValue(l.getSelectedItem().getText());}};D.prototype.onkeypress=function(e){if(e.target.id==this.getId()+"-select"){return;}if(!this.getEnabled()||!this.getEditable()){return;}var k=e.which,K=e.keyCode,o=q.sap.KeyCodes;if((C._isHotKey(e)||(!!sap.ui.Device.browser.firefox&&K===o.HOME)||K===o.F4&&e.which===0)&&!(e.ctrlKey&&e.which==120)){return;}else if(K==o.ESCAPE){var v=this.getProperty("value");var i=this.getInputDomRef();if(i&&i.value!==v){q(i).val(v);}return;}var n=String.fromCharCode(k),r=q(this.getInputDomRef()),c=r.cursorPos(),V=r.val();if(!this.oPopup||!this.oPopup.isOpen()){this.noTypeAheadByOpen=true;this._open();this.noTypeAheadByOpen=undefined;}if(k===o.BACKSPACE){this._doTypeAhead(V.substr(0,c-1),"");}else{this._doTypeAhead(V.substr(0,c),n);}if(V!=r.val()){this._fireLiveChange(e);}this._bFocusByOpen=undefined;e.preventDefault();};D.prototype.onsapright=function(e){if(e.target.id==this.getId()+"-select"){return;}if(!this.getEnabled()||!this.getEditable()){return;}var r=sap.ui.getCore().getConfiguration().getRTL();if(!r){this._updateSelection(1);}else{this._updateSelection(-1);}e.preventDefault();};D.prototype.onsapleft=function(e){if(e.target.id==this.getId()+"-select"){return;}if(!this.getEnabled()||!this.getEditable()){return;}var r=sap.ui.getCore().getConfiguration().getRTL();if(!r){this._updateSelection(-1);}else{this._updateSelection(1);}e.preventDefault();};D.prototype.onfocusin=function(e){if(!this.oPopup||!this.oPopup.isOpen()||this._bFocusByOpen){var r=q(this.getInputDomRef()),l=r.val().length;if(l>0&&!this.mobile){this._doSelect(0,l);}this._bFocusByOpen=undefined;}C.prototype.onfocusin.apply(this,arguments);};D.prototype.onselect=function(e){var t=new Date().getTime();if(this._bIgnoreSelect){this._bIgnoreSelect=false;this.iOldTimestamp=t;return;}if(this.iOldTimestamp&&t-this.iOldTimestamp<50){return;}this.iOldTimestamp=undefined;if(!this.getEnabled()||!this.getEditable()){return;}var r=q(this.getInputDomRef()),n=r.cursorPos(),v=r.val();if(v.length>0&&n>0){this._doTypeAhead(v.substr(0,n),"");if(!this.oPopup||!this.oPopup.isOpen()){this._cleanupClose(this._getListBox());}}e.preventDefault();};D.prototype._determinePosinset=function(i,n){var p=n+1;if(this.oPopup&&this.oPopup.isOpen()){this.dontSetPoisinset=undefined;var I=i[n];var h=i[0].getId().search(this.getId()+"-h-")!=-1;if(I.getId().search(this.getId()+"-h-")==-1){if(h){p=p-1;}if(this._searchHelpItem){p=p-2;}}}return p;};D.prototype._doSelect=function(s,e){this._bIgnoreSelect=true;var d=this.getInputDomRef();if(d){var r=q(d);r.selectText(s?s:0,e?e:r.val().length);}return this;};D.prototype._updateSelection=function(m){var r=q(this.getInputDomRef()),n=r.cursorPos()+(m||0),v=r.val();this._doTypeAhead(v.substr(0,n),"");if(!this.oPopup||!this.oPopup.isOpen()){this._cleanupClose(this._getListBox());}else{this._getListBox().rerender();}};D.prototype._doTypeAhead=function(v,n,N,I){if(this.__doTypeAhead===true){return;}this.__doTypeAhead=true;this._sWantedSelectedKey=undefined;this._sWantedSelectedItemId=undefined;this._sWantedValue=undefined;var l=this._getListBox(),m=this.getMaxPopupItems(),b=this.__aItems||l.getItems(),V=b.length,h=this.getMaxHistoryItems()>0&&b.length>this._iItemsForHistory,f=!N&&h,o=v+n,s=new RegExp("[.*+?|()\\[\\]{}\\\\]","g"),r=o.toLowerCase().replace(s,"\\$&"),c=RegExp("^"+r+".*$"),M=n&&n.length||0,R=q(this.getInputDomRef());this.__aItems=b;if(V<=0){this.__doTypeAhead=false;return false;}var d,F=this._getFilteredItems(b,c),e=F.length>0;if(!e){f=false;}if(f){d=F;}else{d=b.slice(0);}var g=[];if(h){g=this._addHistoryItems(d,f&&c);l.setItems(d,false,true);V=d.length;}l.setVisibleItems(m<V?m:-1);var j,k=g.length;var i=0;if(I>=0){j=b[I];}if(!f&&k>0&&e){g=this._getFilteredItems(g,c);j=g[0];}if(f){j=F[0];}else if(!j){if(F.length>0){j=F[0];}else{var O=R.val();var p=0;for(i=0;i<d.length;i++){var t=d[i];if(t.getEnabled()){if(!p){p=i;}if(t.getText()==O){j=t;break;}}}if(!j){j=d[p];}}}var u=this._searchHelpItem;if(u){d.splice(k++,0,u[0],u[1]);l.setItems(d,false,true);}i=l.indexOfItem(j);var T=j.getText();var P=i+1;var w=d.length;if(g.length>0){w=w-1;}if(u){w=w-2;}if(P>g.length){if(g.length>0){P=P-1;}if(u){P=P-2;}}this._updatePosInSet(R,P,(j.getAdditionalText?j.getAdditionalText():""));R.attr("aria-setsize",w);R.val(T);this._sTypedChars=o;this._doSelect(v.length+M,T.length);l.setSelectedIndex(i);if(u&&i==2){l.scrollToIndex(0);}else{l.scrollToIndex(i);}this._iClosedUpDownIdx=i;if(!e){R=this.$();R.addClass("sapUiTfErr");q.sap.delayedCall(300,R,"removeClass",["sapUiTfErr"]);R.cursorPos(v.length);this._doSelect(v.length,T.length);}this.__doTypeAhead=false;return e;};D.prototype._prepareOpen=function(l,p){this._oValueBeforeOpen=q(this.getInputDomRef()).val();this._bOpening=true;if(!this.noTypeAheadByOpen){var i;if(this._iClosedUpDownIdx>=0){i=this._iClosedUpDownIdx;}else if(this.getSelectedItemId()){i=this.indexOfItem(sap.ui.getCore().byId(this.getSelectedItemId()));}this._doTypeAhead("",q(this.getInputDomRef()).val(),true,i);this._doSelect();}return this;};D.prototype._handleOpened=function(){C.prototype._handleOpened.apply(this,arguments);if(!sap.ui.Device.browser.internet_explorer){q(this.getInputDomRef()).focus();}else{this._bFocusByOpen=true;}};D.prototype._cleanupClose=function(l){if(this.__aItems){var s=l.getSelectedItem();l.setItems(this.__aItems,false,true);this._iClosedUpDownIdx=l.indexOfItem(s);l.setSelectedIndex(this._iClosedUpDownIdx);this.__aItems=undefined;}this._oValueBeforeOpen=null;this._bOpening=undefined;return this;};D.prototype._getFilteredItems=function(I,r){var t=I.slice(0),o;for(var i=t.length-1;i>=0;i--){o=t[i];if(!r.test(o.getText().toLowerCase())||!o.getEnabled()){t.splice(i,1);}}return t;};D.prototype._addHistoryItems=function(I,r){var s=this.getId()+"-h-",o,h=this._oHistory.get(),l=h.length,n=[];for(var i=0,j=0;j<this.getMaxHistoryItems()&&i<l;i++){if(!r||r.test(h[i])){o=(o=sap.ui.getCore().byId(s+j))&&o.setText(h[i])||new sap.ui.core.ListItem(s+j,{text:h[i]});n.push(o);j++;}}if(n.length>0){var b=s+"separator",c=this._getSeparator(b);n.push(c);}I.unshift.apply(I,n);return n;};D.prototype._getSeparator=function(s){if(!this.__oSeparator&&s){this.__oSeparator=sap.ui.getCore().byId(s)||new S(s);}return this.__oSeparator||null;};D.prototype.fireChange=function(A){this.fireEvent("change",A);if(A.newValue&&(this.getMaxHistoryItems()>0)){this._oHistory.add(A.newValue);}this._sWantedValue=undefined;return this;};D.prototype.setValue=function(v,n){v=(v===undefined||v===null||v==="")?"":v;var I=this.getItems(),t,V=false,f;for(var i=0,l=I.length;i<l&&!V;i++){var o=I[i];var e=o.getEnabled();t=o.getText();if(e&&!f){f=t;}V=t===v&&e;}if(V){C.prototype.setValue.call(this,v,n);this._sWantedValue=undefined;}else if(v===""&&I.length>0){C.prototype.setValue.call(this,f,n);}else{this._sWantedValue=v;}return this;};D.prototype.applyFocusInfo=function(f){C.prototype.applyFocusInfo.apply(this,arguments);if(!this._bOpening&&(!this.oPopup||!this.oPopup.isOpen())){this._cleanupClose(this._getListBox());}return this;};D.prototype.onsapfocusleave=function(e){var l=this._getListBox();if(e.relatedControlId&&q.sap.containsOrEquals(l.getFocusDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){this.focus();}else{if(this.oPopup&&this.oPopup.isOpen()){this._close();}sap.ui.commons.TextField.prototype.onsapfocusleave.apply(this,arguments);}};D.prototype.getTooltip_AsString=function(){var t=C.prototype.getTooltip_AsString.apply(this,arguments);if(!this._searchHelpItem){return t;}else{var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");var s=r.getText("DDBX_SHI_ARIA");s=s==="DDBX_SHI_ARIA"?"Open search help via {0}":s;var A=this._searchHelpItem[0]&&this._searchHelpItem[0].getAdditionalText()||r.getText("DDBX_SHIF4");A=A==="DDBX_SHIF4"?"F4":A;s=s.replace("{0}",A);return(t?t+" - ":"")+s;}};D.prototype._handleSelect=function(c){if(this._searchHelpItem&&c.getParameter("selectedItem")===this._searchHelpItem[0]){var e=new q.Event("sapshow");e.which=q.sap.KeyCodes.F4;this.onsapshow(e);}else{var i=c.getParameter("selectedItem");if(!i){i=sap.ui.getCore().byId(c.getParameter("selectedId"));}if(i.getId().search(this.getId()+"-h-")!=-1){var l=this._getListBox(),I=l.getItems();var L=this._oHistory.get().length;if(L>this.getMaxHistoryItems()){L=Math.max(this.getMaxHistoryItems(),0);}for(var b=L;b<I.length;b++){if(I[b].getText()==i.getText()&&I[b].getEnabled()){c.mParameters.selectedIndex=b;if(!c.getParameter("selectedIndices")){c.mParameters.selectedIndices=new Array(1);c.mParameters.aSelectedIndices=new Array(1);}c.mParameters.selectedIndices[0]=b;c.mParameters.aSelectedIndices[0]=b;c.mParameters.selectedItem=I[b];break;}}}this._sWantedValue=undefined;return C.prototype._handleSelect.apply(this,arguments);}};D.prototype.setSearchHelpEnabled=function(e,t,A,i){this.setProperty("searchHelpEnabled",e);if(t){this.setProperty("searchHelpText",t);}else{t=this.getSearchHelpText();}if(A){this.setProperty("searchHelpAdditionalText",A);}else{A=this.getSearchHelpAdditionalText();}if(i){this.setProperty("searchHelpIcon",i);}else{i=this.getSearchHelpIcon();}if(e){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");if(r){t=t||r.getText("DDBX_SHI");t=t==="DDBX_SHI"?"Search Help":t;A=A||r.getText("DDBX_SHIF4");A=A==="DDBX_SHIF4"?"F4":A;}i=i||sap.ui.resource("sap.ui.commons","images/dropdown/ico12_f4.gif");if(!this._searchHelpItem){this._searchHelpItem=[new sap.ui.core.ListItem(this.getId()+"_shi",{text:t,additionalText:A,enabled:true,icon:i}),new S()];}else{this._searchHelpItem[0].setText(t).setAdditionalText(A).setIcon(i);}}else{if(this._searchHelpItem){this._searchHelpItem[0].destroy();this._searchHelpItem[1].destroy();this._searchHelpItem=null;}}return this;};D.prototype.setSearchHelpText=function(s){this.setProperty("searchHelpText",s);this.setSearchHelpEnabled(this.getSearchHelpEnabled(),s,this.getSearchHelpAdditionalText(),this.getSearchHelpIcon());return this;};D.prototype.setSearchHelpAdditionalText=function(s){this.setProperty("searchHelpAdditionalText",s);this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),s,this.getSearchHelpIcon());return this;};D.prototype.setSearchHelpIcon=function(s){this.setProperty("searchHelpIcon",s);this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),this.getSearchHelpAdditionalText(),s);return this;};D.prototype.checkValueInItems=function(){var v=this.getValue();var I=C.prototype.getItems.apply(this);var w=this._sWantedSelectedKey;var W=this._sWantedSelectedItemId;if(I&&I.length>0){var V=false;var f;var i=0,l=0;var o;var e=false;var t="";if(this._sWantedValue){for(i=0,l=I.length;i<l&&!V;i++){o=I[i];e=o.getEnabled();t=o.getText();if(e&&!f){f=t;}V=t===this._sWantedValue&&e;}if(V){v=this._sWantedValue;this._sWantedValue=undefined;w=undefined;W=undefined;C.prototype.setValue.call(this,v);}}if(!V){for(i=0,l=I.length;i<l&&!V;i++){o=I[i];e=o.getEnabled();t=o.getText();if(e&&!f){f=t;}V=t===v&&e;}}if(!V){v=f;C.prototype.setValue.call(this,v);}}else{v="";C.prototype.setValue.call(this,v);}this._sWantedSelectedKey=w;this._sWantedSelectedItemId=W;return v;};D.prototype.setMaxHistoryItems=function(m){var o=this.getMaxHistoryItems();var I=this.getId()+"-h-";var b;this.setProperty('maxHistoryItems',m,true);if(m<o){var l=this._getListBox();for(var i=Math.max(m,0);i<o;i++){b=sap.ui.getCore().byId(I+i);if(b){l.removeItem(b);b.destroy();}}if(m<=0&&this.__oSeparator){l.removeItem(this.__oSeparator);}}};D.prototype.clearHistory=function(){this._oHistory.clear();var I=this.getId()+"-h-";var l=this._getListBox();var o;for(var i=0;i<this.getMaxHistoryItems();i++){o=sap.ui.getCore().byId(I+i);if(o){l.removeItem(o);o.destroy();}}if(this.__oSeparator){l.removeItem(this.__oSeparator);}};D.prototype.ondrop=function(e){e.preventDefault();};D.prototype._isSetEmptySelectedKeyAllowed=function(){return false;};return D;},true);
