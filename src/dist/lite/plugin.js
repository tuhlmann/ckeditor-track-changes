/* Source version: 1.2.07 */
(function(){var r={Events:{INIT:"lite:init",ACCEPT:"lite:accept",REJECT:"lite:reject",SHOW_HIDE:"lite:showHide",TRACKING:"lite:tracking",CHANGE:"lite:change",HOVER_IN:"lite:hover-in",HOVER_OUT:"lite:hover-out"},Commands:{TOGGLE_TRACKING:"lite-toggletracking",TOGGLE_SHOW:"lite-toggleshow",ACCEPT_ALL:"lite-acceptall",REJECT_ALL:"lite-rejectall",ACCEPT_ONE:"lite-acceptone",REJECT_ONE:"lite-rejectone",TOGGLE_TOOLTIPS:"lite-toggletooltips"}},m={show:true,path:"js/opentip-adapter.js",classPath:"OpentipAdapter",cssPath:"css/opentip.css",delay:500},p="%a by %u %t",f=/^[\s\r\n]*$/,t=[{regex:/[\s]*title=\"[^\"]+\"/g,replace:""},{regex:/[\s]*data-selected=\"[^\"]+\"/g,replace:""}],i=[],s=[CKEDITOR.CTRL+88,CKEDITOR.CTRL+120,CKEDITOR.SHIFT+46];function k(v){return s.indexOf(v)>=0}function h(v){if(v&&v.$&&(typeof v.getDocument==="function")){return v.$}return v}function j(w){for(var v=i.length;v--;){var x=i[v];if(x.editor==w){return v}}return -1}function c(v){var w=j(v);return w>=0?i[w]:null}function l(v){var w=c(v);return w&&w.plugin}function o(v,w){i.push({plugin:w,editor:v})}function q(x,y,v,A){if(null===x||(typeof(x)=="undefined")){x=""}else{x=String(x)}v=String(v);var z=v.length;for(var w=x.length;w<y;w+=z){if(A){x+=padWidth}else{x=v+x}}return x}function u(v,w){return q(v,w,"0")}function n(x,z){var y=x.document,v=y.getBody(),w=false,A=function(){w=true};v.on(z,A);(CKEDITOR.env.version>7?y.$:y.$.selection.createRange())["execCommand"](z);v.removeListener(z,A);return w}function a(x){var v=new Date();var B=v.getDate();var z=v.getMonth();var A=v.getFullYear();var D=typeof(x);if(D=="string"||D=="number"){x=new Date(x)}var w=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];if(B==x.getDate()&&z==x.getMonth()&&A==x.getFullYear()){var y=Math.floor((v.getTime()-x.getTime())/60000);if(y<1){return"now"}else{if(y<2){return"1 minute ago"}else{if(y<60){return(y+" minutes ago")}else{var C=x.getHours();var y=x.getMinutes();return"on "+u(C,2)+":"+u(y,2,"0")}}}}else{if(A==x.getFullYear()){return"on "+w[x.getMonth()]+" "+x.getDate()}else{return"on "+w[x.getMonth()]+" "+x.getDate()+", "+x.getFullYear()}}}CKEDITOR.plugins.add("lite",{icons:"lite-acceptall,lite-acceptone,lite-rejectall,lite-rejectone,lite-toggleshow,lite-toggletracking",hidpi:true,props:{deleteTag:"del",insertTag:"ins",deleteClass:"ice-del",insertClass:"ice-ins",attributes:{changeId:"data-cid",userId:"data-userid",userName:"data-username",sessionId:"data-session-id",changeData:"data-changedata",time:"data-time",lastTime:"data-last-change-time"},stylePrefix:"ice-cts",preserveOnPaste:"p",css:"css/lite.css"},_scriptsLoaded:null,init:function(C){var z=c(C);if(z){return}if(!this._inited){d();this._inited=true}var H=this.path,B=new e(this.props,H),v=CKEDITOR.tools.extend({},C.config.lite||{}),E=v.tooltips;if(undefined==E){E=true}if(E===true){E=m}v.tooltips=E;o(C,B);B.init(C,v);C.on("destroy",(function(I){var J=j(I);if(J>=0){i.splice(J,1)}}).bind(this));if(this._scriptsLoaded){B._onScriptsLoaded();return}else{if(this._scriptsLoaded===false){return}}this._scriptsLoaded=false;var w=(typeof(jQuery)=="function"),G=this,x=v.jQueryPath||"js/jquery.min.js",y=(v.includeType?v["includes_"+v.includeType]:v.includes)||["lite-includes.js"];y=y.slice();for(var A=0,D=y.length;A<D;++A){y[A]=H+y[A]}if(!w){y.splice(0,0,this.path+x)}if(E.path){y.push(this.path+E.path)}var F=function(){if(y.length<1){G._scriptsLoaded=true;if(!w){jQuery.noConflict()}jQuery.each(i,(function(J,K){K.plugin._onScriptsLoaded()}))}else{var I=y.shift();CKEDITOR.scriptLoader.load(I,function(){F()},G)}};F(y)},findPlugin:function(v){return l(v)},startNewSession:function(v){var w=l(v);if(w){w.startNewSession()}else{b("startNewSession: plugin not found")}}});var e=function(v,w){this.props=CKEDITOR.tools.clone(v);this.path=w};e.prototype={init:function(C,y){this._editor=C;this._domLoaded=false;this._editor=null;this._tracker=null;this._isVisible=true;this._liteCommandNames=[];this._canAcceptReject=true;this._removeBindings=[];C.ui.addToolbarGroup("lite");this._setPluginFeatures(C,this.props);this._changeTimeout=null;this._notifyChange=this._notifyChange.bind(this);this._notifyTextChange=this._notifyTextChange.bind(this);this._config=y;var v=y.acceptRejectInReadOnly===true;var w=[{command:r.Commands.TOGGLE_TRACKING,exec:this._onToggleTracking,title:"Toggle Tracking Changes",trackingOnly:false},{command:r.Commands.TOGGLE_SHOW,exec:this._onToggleShow,title:"Toggle Tracking Changes",readOnly:true},{command:r.Commands.ACCEPT_ALL,exec:this._onAcceptAll,title:"Accept all changes",readOnly:v},{command:r.Commands.REJECT_ALL,exec:this._onRejectAll,title:"Reject all changes",readOnly:v},{command:r.Commands.ACCEPT_ONE,exec:this._onAcceptOne,title:"Accept Change",readOnly:v},{command:r.Commands.REJECT_ONE,exec:this._onRejectOne,title:"Reject Change",readOnly:v},{command:r.Commands.TOGGLE_TOOLTIPS,exec:this._onToggleTooltips,readOnly:true}];this._isTracking=y.isTracking!==false;this._eventsBounds=false;C.on("contentDom",(function(G){this._onDomLoaded(G)}).bind(this));C.on("dataReady",(function(G){this._onAfterSetData(G)}).bind(this));var F=this.path;var x=y.commands||[r.Commands.TOGGLE_TRACKING,r.Commands.TOGGLE_SHOW,r.Commands.ACCEPT_ALL,r.Commands.REJECT_ALL,r.Commands.ACCEPT_ONE,r.Commands.REJECT_ONE];var E=this;function B(H){C.addCommand(H.command,{exec:H.exec.bind(E),readOnly:H.readOnly||false});if(H.title&&x.indexOf(H.command)>=0){var G=E._commandNameToUIName(H.command);C.ui.addButton(G,{label:H.title,command:H.command,toolbar:"lite"});if(H.trackingOnly!==false){E._liteCommandNames.push(H.command)}}}for(var A=0,D=w.length;A<D;++A){B(w[A])}if(C.addMenuItems){C.addMenuGroup("lite",50);var z={};z[r.Commands.ACCEPT_ONE]={label:"Accept Change",command:r.Commands.ACCEPT_ONE,group:"lite",order:1,icon:F+"icons/accept_one.png"};z[r.Commands.REJECT_ONE]={label:"Reject Change",command:r.Commands.REJECT_ONE,group:"lite",order:2,icon:F+"icons/reject_one.png"};C.addMenuItems(z)}if(C.contextMenu){C.contextMenu.addListener((function(H,I){if(H&&this._tracker&&this._tracker.currentChangeNode(H)){var G={};G[r.Commands.ACCEPT_ONE]=CKEDITOR.TRISTATE_OFF;G[r.Commands.REJECT_ONE]=CKEDITOR.TRISTATE_OFF;return G}else{return null}}).bind(this))}},toggleTracking:function(v,w){if("boolean"===typeof w){w={notify:w}}w=w||{};var B=(undefined===v)?!this._isTracking:v,A=this._editor,z=w&&w.force;if(!B&&this._isTracking){var x=this._tracker.countChanges({verify:true});if(x){return window.alert("Your document containssome pending changes.\nPlease resolve them before turning off change tracking.")}}this._isTracking=B;this._setCommandsState(this._liteCommandNames,B?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED);this._updateTrackingState();this.toggleShow(B,false);this._setCommandsState(r.Commands.TOGGLE_TRACKING,B?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF);var y=A.ui.get(this._commandNameToUIName(r.Commands.TOGGLE_TRACKING));if(y){this._setButtonTitle(y,B?"Stop tracking changes":"Start tracking changes")}if(w.notify!==false){A.fire(r.Events.TRACKING,{tracking:B,lite:this})}},toggleShow:function(v,w){var y=(typeof(v)=="undefined")?(!this._isVisible):v;this._isVisible=y;if(this._isTracking){this._setCommandsState(r.Commands.TOGGLE_SHOW,y?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)}this._tracker.setShowChanges(y&&this._isTracking);var x=this._editor.ui.get(this._commandNameToUIName(r.Commands.TOGGLE_SHOW));if(x){this._setButtonTitle(x,y?"Hide tracked changes":"Show tracked changes")}if(w!==false){this._editor.fire(r.Events.SHOW_HIDE,{show:y,lite:this})}},isVisible:function(){return this._isVisible},isTracking:function(){return this._isTracking},acceptAll:function(v){this._tracker.acceptAll(v);this._cleanup();this._editor.fire(r.Events.ACCEPT,{lite:this,options:v})},rejectAll:function(v){this._tracker.rejectAll(v);this._cleanup();this._editor.fire(r.Events.REJECT,{lite:this,options:v})},setUserInfo:function(v){v=v||{};this._config.userId=String(v.id);this._config.userName=v.name||"";if(this._tracker){this._tracker.setCurrentUser({id:this._config.userId,name:this._config.userName})}},countChanges:function(v){return((this._tracker&&this._tracker.countChanges(v))||0)},enableAcceptReject:function(v){this._canAcceptReject=!!v;this._onIceChange()},filterIceElement:function(v){if(!v){return true}try{if(v.hasClass(this.props.insertClass)||v.hasClass(this.props.deleteClass)){return false}}catch(v){}return true},startNewSession:function(){var v=new Date();this._sessionId=String.fromCharCode(65+Math.round(Math.random()*26))+v.getDate()+v.getDay()+v.getHours()+v.getMinutes()+v.getMilliseconds();if(this._tracker){this._tracker.setSessionId(this._sessionId)}},getCleanMarkup:function(w){if(null===w||undefined===w){w=(this._editor&&this._editor.getData())||""}for(var v=t.length-1;v>=0;--v){w=w.replace(t[v].regex,t[v].replace)}return w},getCleanText:function(){var v=this._getBody();if(!v){return""}var x=new Array();x.push("");var w=this._tracker.getDeleteClass();this._getCleanText(v,x,w);var y=x.join("\n");y=y.replace(/&nbsp(;)?/ig," ");return y},acceptChange:function(v){v=h(v);if(v&&this._tracker){this._tracker.acceptChange(v);this._cleanup();this._editor.fire(r.Events.ACCEPT,{lite:this});this._onSelectionChanged(null)}},rejectChange:function(v){v=h(v);if(v&&this._tracker){this._tracker.rejectChange(v);this._cleanup();this._editor.fire(r.Events.REJECT,{lite:this});this._onSelectionChanged(null)}},_getCleanText:function(A,z,y){var x=A.getAttribute("class");if(x&&x.indexOf(y)>=0){return}var v;if(v=((A.nodeName&&A.nodeName.toUpperCase()=="BR")||("block"==jQuery(A).css("display")))){if(f.test(z[z.length-1])){z[z.length-1]=""}else{z.push("")}}for(var B=A.firstChild;B;B=B.nextSibling){var w=B.nodeType;if(3==w){z[z.length-1]+=String(B.nodeValue)}else{if(1==w||9==w||11==w){this._getCleanText(B,z,y)}}}if(v){z.push("")}},_onDomLoaded:function(w){this._domLoaded=true;this._editor=w.editor;var v=this._editor.editable();v.attachListener(v,"keypress",this._onKeyPress,this,null,1);this._hideTooltip();this._onReady()},_onScriptsLoaded:function(w,v){this._scriptsLoaded=true;this._onReady()},_loadCSS:function(y,w){var v=y.getElementsByTagName("head")[0];function x(A,B){var z=jQuery(v).find("#"+B);if(!z.length){z=y.createElement("link");z.setAttribute("rel","stylesheet");z.setAttribute("type","text/css");z.setAttribute("id",B);z.setAttribute("href",A);v.appendChild(z)}}x(this.path+w,"__lite__css__");if(this._config.tooltips.cssPath){x(this.path+this._config.tooltips.cssPath,"__lite_tt_css__")}},_onReady:function(){if(!this._scriptsLoaded||!this._domLoaded){return}setTimeout(this._afterReady.bind(this),5)},_getBody:function(){try{return this._editor.editable().$}catch(v){return null}},_afterReady:function(){var C=this._editor,B=C.document.$,v=this._getBody(),y=this._config,w=(y&&y.debug)||{};this._loadCSS(B,(y&&y.cssPath)||"css/lite.css");if(!this._eventsBounds){this._eventsBounds=true;var A=this._onPaste.bind(this);C.on("afterCommandExec",this._onAfterCommand.bind(this));C.on("beforeCommandExec",this._onBeforeCommand.bind(this));if(this._config.handlePaste){C.on("paste",A,null,null,1)}C.on("beforeGetData",this._onBeforeGetData.bind(this));C.on("beoreUndoImage",this._onBeforeGetData.bind(this));C.on("insertHtml",A,null,null,1);C.on("insertText",A,null,null,1);C.on("insertElement",A,null,null,1);C.on("mode",this._onModeChange.bind(this),null,null,1);C.on("readOnly",this._onReadOnly.bind(this))}if(this._tracker){if(v!=this._tracker.getContentElement()){this._tracker.stopTracking(true);jQuery(this._tracker).unbind();this._tracker=null}}if(this._tracker){return}var x={element:v,mergeBlocks:false,currentUser:{id:y.userId||"",name:y.userName||""},userStyles:y.userStyles,changeTypes:{insertType:{tag:this.props.insertTag,alias:this.props.insertClass,action:"Inserted"},deleteType:{tag:this.props.deleteTag,alias:this.props.deleteClass,action:"Deleted"}},hostMethods:{getHostRange:this._getHostRange.bind(this),getHostRangeData:this._getHostRangeData.bind(this),makeHostElement:function(D){return new CKEDITOR.dom.element(D)},getHostNode:function(D){return D&&D.$},setHostRange:this._setHostRange.bind(this),hostCopy:this._hostCopy.bind(this),beforeEdit:this._beforeEdit.bind(this)}};if(w.log){x.hostMethods.logError=b}x.tooltips=y.tooltips.show;if(x.tooltips){var z=this._hideTooltip.bind(this);x.hostMethods.showTooltip=this._showTooltip.bind(this);x.hostMethods.hideTooltip=z;x.hostMethods.beforeDelete=x.hostMethods.beforeInsert=z;if(y.tooltips.classPath){try{this._tooltipsHandler=new window[y.tooltips.classPath]();x.tooltipsDelay=y.tooltips.delay}catch(C){}if(!this._tooltipsHandler){b("Unable to create tooltip handler",y.tooltips.classPath)}else{this._tooltipsHandler.init(y.tooltips)}}}jQuery.extend(x,this.props);this._tracker=new ice.InlineChangeEditor(x);try{this._tracker.startTracking();this.toggleTracking(this._isTracking,false);this._updateTrackingState();jQuery(this._tracker).on("change",this._onIceChange.bind(this)).on("textChange",this._onIceTextChanged.bind(this));C.fire(r.Events.INIT,{lite:this});this._onSelectionChanged(null);this._onIceChange(null)}catch(C){b("ICE plugin init:",C)}},_onToggleShow:function(v){this.toggleShow()},_onToggleTracking:function(v){this.toggleTracking()},_onRejectAll:function(v){this.rejectAll()},_onAcceptAll:function(v){this.acceptAll()},_onAcceptOne:function(w){var v=this._tracker.currentChangeNode();return this.acceptChange(v)},_onRejectOne:function(w){var v=this._tracker.currentChangeNode();return this.rejectChange(v)},_onToggleTooltips:function(v){this._tracker&&this._tracker.toggleTooltips()},_cleanup:function(){var v=this._getBody(),w=jQuery(v).find(self.insertSelector+":empty,"+self.deleteSelector+":empty");w.remove();this._onSelectionChanged(null)},_setButtonTitle:function(v,x){var w=jQuery("#"+v._.id);w.attr("title",x)},_onAfterCommand:function(w){var v=this._tracker&&this._isTracking&&w.data&&w.data.name;if("undo"==v||"redo"==v){this._tracker.reload()}},_onBeforeCommand:function(w){var v=this._tracker&&this._tracker.isTracking()&&w.data&&w.data.name;if("cut"==v){if(g(this._editor,"copy")){this._tracker.prepareToCut()}}else{if("copy"==v){if(g(this._editor,"copy")){this._tracker.prepareToCopy()}}}},_onModeChange:function(v){this._updateTrackingState();setTimeout(this._onIceChange.bind(this),0)},_onKeyPress:function(v){var w=v&&v.data&&v.data.getKeystroke();if(k(w)){v.stop()}},_onKeyDown:function(v){if(!this._tracker||!this._tracker.isTracking()){return}var w=v.data.keyCode;if(k(w)){if(this._tracker.tryToCut()){v.stop()}}},_onBeforeGetData:function(v){this._hideTooltip()},_onAfterSetData:function(v){this._hideTooltip();this._processContent();if(this._tracker){this._tracker.reload()}},_onReadOnly:function(v){this._updateTrackingState()},_updateTrackingState:function(){if(this._tracker){var v=this._isTracking&&this._editor.mode=="wysiwyg"&&!this._editor.readOnly;this._tracker.toggleChangeTracking(v);for(var x=this._removeBindings.length-1;x>=0;--x){this._removeBindings[x].removeListener()}this._removeBindings=[];if(v){var y=this._onSelectionChanged.bind(this),w=this._editor.editable();this._removeBindings.push(w.on("keyup",y));this._removeBindings.push(w.on("click",y));this._removeBindings.push(this._editor.on("selectionChange",y))}}},_onPaste:function(D){if(!this._tracker||!this._isTracking||!D){return true}var x=D.data||{},A=false,y=null,w=(D.name=="insertElement")&&x.$;if(!x){return}if("string"==typeof x){x={dataValue:x,type:"text"}}if(w){A=w.getAttribute("data-track-changes-ignore")}else{if(x.dataValue&&"html"==(x.type||x.mode)){try{w=jQuery(x.dataValue);A=w&&w.attr("data-track-changes-ignore")}catch(z){}}}if(A){return true}if("string"==typeof x.dataValue){try{var C=this._editor.document.$,v=C.createElement("div");v.innerHTML=String(x.dataValue);v=this._tracker.getCleanDOM(v);if(!v.innerHTML){return true}y=jQuery.makeArray(v.childNodes)}catch(z){b("ice plugin paste:",z)}}else{if(w){y=w}else{return true}}if(y){var B=this._editor.focusManager.hasFocus;this._beforeInsert();this._tracker.insert({nodes:y});this._afterInsert();if(B){this._editor.editable().focus()}}D.stop();this._onIceTextChanged();return true},_setCommandsState:function(v,y){if(typeof(v)=="string"){v=v.split(",")}for(var w=v.length-1;w>=0;--w){var x=this._editor.getCommand(v[w]);if(x){x.setState(y)}}},_onSelectionChanged:function(w){var v=this._isTracking&&this._tracker&&this._tracker.isInsideChange();var x=v&&this._canAcceptReject?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED;this._setCommandsState([r.Commands.ACCEPT_ONE,r.Commands.REJECT_ONE],x)},_onIceChange:function(x){var v=this._isTracking&&this._tracker&&this._tracker.hasChanges();var w=v&&this._canAcceptReject?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED;this._setCommandsState([r.Commands.ACCEPT_ALL,r.Commands.REJECT_ALL],w);this._onSelectionChanged();if(x){this._triggerChange()}},_onIceTextChanged:function(v){this._triggerChange()},_triggerChange:function(){if(!this._changeTimeout){this._changeTimeout=setTimeout(this._notifyChange,1)}},_notifyChange:function(){this._changeTimeout=null;this._editor.fire(r.Events.CHANGE,{lite:this})},_notifyTextChange:function(){this._changeTimeout=null;this._editor.fire("change",{lite:this})},_processContent:function(){var v=this._getBody(),y=window.jQuery,B=this.props.insertTag,x=this.props.deleteTag,w,z;if(!v){return}z=v.ownerDocument;function A(F,C){var E=F.parentNode,D=z.createElement(C);y.each(F.attributes,function(H,G){D.setAttribute(G.name,G.value)});D.className=F.className||"";y(F).contents().appendTo(D);E.insertBefore(D,F);E.removeChild(F)}if(B!=="span"){w=y(v).find("span."+this.props.insertClass);w.each(function(C,D){A(D,B)})}if(x!=="span"){w=y(v).find("span."+this.props.deleteClass);w.each(function(C,D){A(D,x)})}},_commandNameToUIName:function(v){return v.replace(".","_")},_setPluginFeatures:function(A,C){if(!A||!A.filter||!A.filter.addFeature){return}try{function y(){var E=[C.deleteClass,C.insertClass,C.stylePrefix+"*"];return E}function v(){var E=["title"];for(var F in C.attributes){if(C.attributes.hasOwnProperty(F)){var G=C.attributes[F];if((typeof G==="string")&&G.indexOf("data-")===0){E.push(G)}}}return E}function x(E){var F={};E.forEach(function(G){F[G]=true});return F}var w=[],D,z;D={};z={};z.classes=x(y());z.attributes=x(v());D[C.insertTag]=z;D[C.deleteTag]=CKEDITOR.tools.clone(z);D.br=CKEDITOR.tools.clone(z);D.br.propertiesOnly=true;D.span=CKEDITOR.tools.clone(z);A.filter.addFeature({name:"lite-features",allowedContent:D})}catch(B){b(B)}},_setHostRange:function(v){var w=this._editor&&this._editor.getSelection();if(w){w.selectRanges([v])}},_beforeEdit:function(){CKEDITOR.iscutting=true;var w=this._editor,v=function(){w.fire("saveSnapshot")};v();setTimeout(function(){CKEDITOR.iscutting=false},100)},_hostCopy:function(){try{if(CKEDITOR.env.ie){n(this._editor,"copy")}else{this._editor.document.$.execCommand("copy",false,null)}}catch(v){b(v)}},_getHostRange:function(){var x=this._editor&&this._editor.getSelection(),v=x&&x.getRanges(),w=v&&v[0];return w||null},_getHostRangeData:function(v){v=v||this._getHostRange();if(!v){return null}return{startContainer:v.startContainer&&v.startContainer.$,endContainer:v.endContainer&&v.endContainer.$,startOffset:v.startOffset,endOffset:v.endOffset}},_showTooltip:function(w,y){var v=this._config.tooltips;if(v.events){return this._editor&&this._editor.fire(r.Events.HOVER_IN,{lite:this,node:w,changeId:y.changeId})}if(v.show){var x=this._makeTooltipTitle(y);if(this._tooltipsHandler){this._tooltipsHandler.hideAll(this._getBody());this._tooltipsHandler.showTooltip(w,x,this._editor.container.$)}else{w.setAttribute("title",x)}}},_hideTooltip:function(x){var w=this._config.tooltips;if(w.events){return this._editor&&this._editor.fire(r.Events.HOVER_OUT,{lite:this,node:x})}if(this._tooltipsHandler){if(x){this._tooltipsHandler.hideTooltip(x)}else{this._tooltipsHandler.hideAll(this._getBody())}}else{if(this._tracker){if(x){x.removeAttribute("title")}else{var v=this._tracker.getIceNodes();if(v){v.removeAttr("title")}}}}},_beforeInsert:function(){this._editor.fire("saveSnapshot")},_afterInsert:function(){var v=this._editor;v.getSelection().scrollIntoView()},_makeTooltipTitle:function(y){var x=this._config.tooltipTemplate||p,w=new Date(y.time),v=new Date(y.lastTime);x=x.replace(/%a/g,"insert"==y.type?"added":"deleted");x=x.replace(/%t/g,a(w));x=x.replace(/%u/g,y.userName);x=x.replace(/%dd/g,u(w.getDate(),2));x=x.replace(/%d/g,w.getDate());x=x.replace(/%mm/g,u(w.getMonth()+1,2));x=x.replace(/%m/g,w.getMonth()+1);x=x.replace(/%yy/g,u(w.getYear()-100,2));x=x.replace(/%y/g,w.getFullYear());x=x.replace(/%nn/g,u(w.getMinutes(),2));x=x.replace(/%n/g,w.getMinutes());x=x.replace(/%hh/g,u(w.getHours(),2));x=x.replace(/%h/g,w.getHours());x=x.replace(/%T/g,a(v));x=x.replace(/%DD/g,u(v.getDate(),2));x=x.replace(/%D/g,v.getDate());x=x.replace(/%MM/g,u(v.getMonth()+1,2));x=x.replace(/%M/g,v.getMonth()+1);x=x.replace(/%YY/g,u(v.getYear()-100,2));x=x.replace(/%Y/g,v.getFullYear());x=x.replace(/%NN/g,u(v.getMinutes(),2));x=x.replace(/%N/g,v.getMinutes());x=x.replace(/%HH/g,u(v.getHours(),2));x=x.replace(/%H/g,v.getHours());return x}};function b(){var v=window.console;if(v&&v.error){v.error.apply(v,[].slice.call(arguments))}}function g(v,x){if(CKEDITOR.env.ie){return n(v,x)}try{return v.document.$.execCommand(x,false,null)}catch(w){return false}}function n(x,A){var y=x.document,v=y.getBody(),w=false,z=false,B=function(){w=true};v.on(A,B);z=(CKEDITOR.env.version>7?y.$:y.$.selection.createRange())["execCommand"](A,false);v.removeListener(A,B);return z||w}function d(){Function.prototype.bind=Function.prototype.bind||function(){var x=this,w=Array.prototype.slice.call(arguments),v=w.shift();return function(){return x.apply(v,w.concat(Array.prototype.slice.call(arguments)))}};Array.prototype.indexOf=Array.prototype.indexOf||function(x){if(this==null){throw new TypeError()}var y=Object(this);var v=y.length>>>0;if(v===0){return -1}var z=0;if(arguments.length>1){z=Number(arguments[1]);if(z!=z){z=0}else{if(z!=0&&z!=Infinity&&z!=-Infinity){z=(z>0||-1)*Math.floo1r(Math.abs(z))}}}if(z>=v){return -1}var w=z>=0?z:Math.max(v-Math.abs(z),0);for(;w<v;w++){if(w in y&&y[w]===x){return w}}return -1};Array.prototype.lastIndexOf=Array.prototype.indexOf||function(w){if(this==null){throw new TypeError()}var x=Object(this);var v=x.length>>>0;while(--v>=0){if(v in x&&x[v]===w){return v}}return -1}}})();
/* Copyright (C) 2014 LoopIndex - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the LoopIndex Comments CKEditor plugin license.
 *
 * You should have received a copy of the LoopIndex Comments CKEditor plugin license with
 * this file. If not, please write to: loopindex@gmail.com, or visit http://www.loopindex.com
 * written by (David *)Frenkiel (https://github.com/imdfl) 
 */