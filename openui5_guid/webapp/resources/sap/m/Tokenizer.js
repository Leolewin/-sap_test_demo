/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/delegate/ScrollEnablement'],function(q,l,C,S){"use strict";var T=C.extend("sap.m.Tokenizer",{metadata:{library:"sap.m",properties:{editable:{type:"boolean",group:"Misc",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null}},defaultAggregation:"tokens",aggregations:{tokens:{type:"sap.m.Token",multiple:true,singularName:"token"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tokenChange:{parameters:{type:{type:"string"},token:{type:"sap.m.Token"},tokens:{type:"sap.m.Token[]"},addedTokens:{type:"sap.m.Token[]"},removedTokens:{type:"sap.m.Token[]"}}}}}});var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");T.prototype._sAriaTokenizerLabelId=new sap.ui.core.InvisibleText({text:r.getText("TOKENIZER_ARIA_LABEL")}).toStatic().getId();T.prototype.init=function(){this._bScrollToEndIsActive=false;this._aTokenValidators=[];this._oScroller=new S(this,this.getId()+"-scrollContainer",{horizontal:true,vertical:false,nonTouchScrolling:true});};T.prototype.getScrollDelegate=function(){return this._oScroller;};T.prototype.scrollToEnd=function(){if(!this._bScrollToEndIsActive){this._bScrollToEndIsActive=true;var t=this;var d=this.getDomRef();if(d){this._sResizeHandlerId=sap.ui.core.ResizeHandler.register(d,function(){t._doScrollToEnd();});}}this._doScrollToEnd();};T.prototype.setWidth=function(w){this.setProperty("width",w,true);this.$().css("width",this.getWidth());return this;};T.prototype.setPixelWidth=function(n){this._truncateLastToken(n);var w=(n/parseFloat(sap.m.BaseFontSize))+"rem";this.$().css("width",w);if(this._oScroller){this._oScroller.refresh();}};T.prototype._truncateLastToken=function(n){var a=this._removeLastTokensTruncation();if(a===null){return;}var t=this;var L=a.$();var s=null;s=function(){a.removeStyleClass("sapMTokenTruncate");this.$().removeAttr("style");this.detachSelect(s);t.scrollToEnd();};var w=L.width();if(!a.getSelected()&&n>=0&&w>=0&&n<w){L.outerWidth(n,true);a.addStyleClass("sapMTokenTruncate");a.attachSelect(s);}else{a.detachSelect(s);}this.scrollToEnd();};T.prototype._doScrollToEnd=function(){var t=this.getDomRef();if(!t){return;}var $=this.$();var s=$.find(".sapMTokenizerScrollContainer")[0];$[0].scrollLeft=s.scrollWidth;};T.prototype.scrollToStart=function(){this._deactivateScrollToEnd();var t=this.getDomRef();if(!t){return;}var m=q(t);m[0].scrollLeft=0;};T.prototype._deactivateScrollToEnd=function(){this._deregisterResizeHandler();this._bScrollToEndIsActive=false;};T.prototype._removeLastTokensTruncation=function(){var t=this.getTokens();var L=null;if(t.length>0){L=t[t.length-1];var $=L.$();if($.length>0){$[0].style.cssText="";}}return L;};T.prototype.getScrollWidth=function(){if(!this.getDomRef()){return 0;}this._removeLastTokensTruncation();return this.$().children(".sapMTokenizerScrollContainer")[0].scrollWidth;};T.prototype.onBeforeRendering=function(){this._deregisterResizeHandler();};T.prototype.onAfterRendering=function(){if(C.prototype.onAfterRendering){C.prototype.onAfterRendering.apply(this,arguments);}var t=this;if(this._bScrollToEndIsActive){this._sResizeHandlerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),function(){t._doScrollToEnd();});}if(this._bCopyToClipboardSupport){this.$().on("copy",function(e){t.oncopy(e);});}};T.prototype.oncopy=function(e){var s=this.getSelectedTokens();var a="";for(var i=0;i<s.length;i++){a=a+(i>0?"\r\n":"")+s[i].getText();}if(!a){return;}if(window.clipboardData){window.clipboardData.setData("text",a);}else{e.originalEvent.clipboardData.setData('text/plain',a);}e.preventDefault();};T.prototype.onsapfocusleave=function(e){if(!this._checkFocus()){this.selectAllTokens(false);}};T.prototype.saptabnext=function(e){this.selectAllTokens(false);};T.prototype.isAllTokenSelected=function(){if(this.getTokens().length===this.getSelectedTokens().length){return true;}return false;};T.prototype.onkeydown=function(e){if(e.which===q.sap.KeyCodes.TAB){this.selectAllTokens(false);}if((e.ctrlKey||e.metaKey)&&e.which===q.sap.KeyCodes.A){this._iSelectedToken=this.getSelectedTokens().length;if(this.getTokens().length>0){this.focus();this.selectAllTokens(true);e.preventDefault();}}};T.prototype.onsapbackspace=function(e){if(this.getSelectedTokens().length===0){this.onsapprevious(e);}else if(this.getEditable()){this.removeSelectedTokens();}e.preventDefault();e.stopPropagation();};T.prototype.onsapdelete=function(e){if(this.getEditable()){this.removeSelectedTokens();}};T.prototype.onsapnext=function(e){if(e.which===q.sap.KeyCodes.ARROW_DOWN){return;}var L=this.getTokens().length;if(L===0){return;}this.selectAllTokens(false);var f=q(document.activeElement).control()[0];if(f===this){return;}var i=f?this.getTokens().indexOf(f):-1;if(i<L-1){var n=this.getTokens()[i+1];n.setSelected(true);this._ensureTokenVisible(n);e.preventDefault();}else if(i===L-1){this.scrollToEnd();return;}this._deactivateScrollToEnd();e.setMarked();};T.prototype._ensureTokenVisible=function(t){var i=this.$().offset().left,a=t.$().offset().left;if(a<i){this.$().scrollLeft(this.$().scrollLeft()-i+a);}};T.prototype.onsapprevious=function(e){if(e.which===q.sap.KeyCodes.ARROW_UP){return;}if(this.getSelectedTokens().length===this.getTokens().length){return;}if(this.getTokens().length===0){return;}var f=sap.ui.getCore().byId(q(document.activeElement).attr("id"));var i=f?this.getTokens().indexOf(f):-1;if(i>0){var p=this.getTokens()[i-1];p.setSelected(true);this._ensureTokenVisible(p);}else if(i===-1){this.getTokens()[this.getTokens().length-1].setSelected(true);}this._deactivateScrollToEnd();e.setMarked();};T.prototype.addValidator=function(v){if(typeof(v)==="function"){this._aTokenValidators.push(v);}};T.prototype.removeValidator=function(v){var i=this._aTokenValidators.indexOf(v);if(i!==-1){this._aTokenValidators.splice(i,1);}};T.prototype.removeAllValidators=function(){this._aTokenValidators=[];};T.prototype._validateToken=function(p,v){var t=p.token;var s;if(t&&t.getText()){s=t.getText();}else{s=p.text;}var V=p.validationCallback;var o=p.suggestionObject;var i,a,b;if(!v){v=this._aTokenValidators;}b=v.length;if(b===0){if(!t&&V){V(false);}return t;}for(i=0;i<b;i++){a=v[i];t=a({text:s,suggestedToken:t,suggestionObject:o,asyncCallback:this._getAsyncValidationCallback(v,i,s,o,V)});if(!t){if(V){V(false);}return null;}if(t===T.WaitForAsyncValidation){return null;}}return t;};T.prototype._getAsyncValidationCallback=function(v,V,i,s,f){var t=this;return function(o){if(o){v=v.slice(V+1);o=t._validateToken({text:i,token:o,suggestionObject:s,validationCallback:f},v);t._addUniqueToken(o,f);}else{if(f){f(false);}}};};T.prototype.addValidateToken=function(p){var t=this._validateToken(p);this._addUniqueToken(t,p.validationCallback);};T.prototype._addUniqueToken=function(t,v){if(!t){return;}var a=this._tokenExists(t);if(a){return;}this.addToken(t);if(v){v(true);}this.fireTokenChange({addedTokens:[t],removedTokens:[],type:T.TokenChangeType.TokensChanged});};T.prototype._parseString=function(s){return s.split(/\r\n|\r|\n/g);};T.prototype._checkFocus=function(){return this.getDomRef()&&q.sap.containsOrEquals(this.getDomRef(),document.activeElement);};T.prototype._tokenExists=function(t){var a=this.getTokens();if(!(a&&a.length)){return false;}var k=t.getKey();if(!k){return false;}var b=a.length;for(var i=0;i<b;i++){var c=a[i];var d=c.getKey();if(d===k){return true;}}return false;};T.prototype.addToken=function(t,s){var p=this.getParent();if(p instanceof sap.m.MultiInput){if(p.getMaxTokens()!==undefined&&p.getTokens().length>=p.getMaxTokens()){return;}}this.addAggregation("tokens",t,s);t.attachDelete(this._onDeleteToken,this);t.attachPress(this._onTokenPress,this);t.setEditable=function(e){sap.m.Token.prototype.setEditable.apply(t,arguments);};this._bScrollToEndIsActive=true;this.fireTokenChange({token:t,type:T.TokenChangeType.Added});};T.prototype.removeToken=function(t){t=this.removeAggregation("tokens",t);if(t){t.detachDelete(this._onDeleteToken,this);t.detachPress(this._onTokenPress,this);}this._bScrollToEndIsActive=true;this.fireTokenChange({token:t,type:T.TokenChangeType.Removed});return t;};T.prototype.setTokens=function(t){var o=this.getTokens();this.removeAllTokens(false);var i;for(i=0;i<t.length;i++){this.addToken(t[i],true);}this.invalidate();this._bScrollToEndIsActive=true;this.fireTokenChange({addedTokens:t,removedTokens:o,type:T.TokenChangeType.TokensChanged});};T.prototype.removeAllTokens=function(f){var i,a,t,b;b=this.getTokens();a=b.length;for(i=0;i<a;i++){t=b[i];t.detachDelete(this._onDeleteToken,this);t.detachPress(this._onTokenPress,this);}this.removeAllAggregation("tokens");if(typeof(f)==="boolean"&&!f){return;}this.fireTokenChange({addedTokens:[],removedTokens:b,type:T.TokenChangeType.TokensChanged});this.fireTokenChange({tokens:b,type:T.TokenChangeType.RemovedAll});};T.prototype.removeSelectedTokens=function(){var t=this.getSelectedTokens();var a,i,b;b=t.length;if(b===0){return this;}for(i=0;i<b;i++){a=t[i];this.removeToken(a);}this.scrollToEnd();this.fireTokenChange({addedTokens:[],removedTokens:t,type:T.TokenChangeType.TokensChanged});this._doSelect();return this;};T.prototype.selectAllTokens=function(s){if(s===undefined){s=true;}var t=this.getTokens();var a,i,b;b=t.length;for(i=0;i<b;i++){a=t[i];a.setSelected(s,true);}this._doSelect();return this;};T.prototype.getSelectedTokens=function(){var s=[];var i,a,t,b;b=this.getTokens();a=b.length;for(i=0;i<a;i++){t=b[i];if(t.getSelected()){s.push(t);}}return s;};T.prototype._onDeleteToken=function(e){var t=e.getParameter("token");if(t){t.destroy();this.fireTokenChange({addedTokens:[],removedTokens:[t],type:T.TokenChangeType.TokensChanged});if(this.getParent()&&this.getParent()instanceof sap.m.MultiInput&&!this.getParent()._bUseDialog){var $=this.getParent().$();$.find("input").focus();}}};T.prototype._onTokenPress=function(e){};T.prototype.setEditable=function(e){this.setProperty("editable",e);var t=this.getTokens();var a=t.length;for(var i=0;i<a;i++){var c=t[i];c.setEditable(e);}return this;};T.prototype.onsaphome=function(e){this.scrollToStart();};T.prototype.onsapend=function(e){this.scrollToEnd();};T.prototype.exit=function(){this._deregisterResizeHandler();};T.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){sap.ui.core.ResizeHandler.deregister(this._sResizeHandlerId);delete this._sResizeHandlerId;}};T.prototype._doSelect=function(){if(this._checkFocus()&&this._bCopyToClipboardSupport){var f=document.activeElement;var s=window.getSelection();s.removeAllRanges();if(this.getSelectedTokens().length){var R=document.createRange();R.selectNodeContents(this.getDomRef("clip"));s.addRange(R);}if(window.clipboardData&&document.activeElement.id==this.getId()+"-clip"){q.sap.focus(f.id==this.getId()+"-clip"?this.getDomRef():f);}}};T.TokenChangeType={Added:"added",Removed:"removed",RemovedAll:"removedAll",TokensChanged:"tokensChanged"};T.WaitForAsyncValidation="sap.m.Tokenizer.WaitForAsyncValidation";return T;},true);
