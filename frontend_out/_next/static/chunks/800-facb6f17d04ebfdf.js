"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[800],{8867:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(7401).A)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},1719:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(7401).A)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},1902:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(7401).A)("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]])},1786:(e,t,n)=>{n.d(t,{q:()=>r});function r(e,[t,n]){return Math.min(n,Math.max(t,e))}},2576:(e,t,n)=>{n.d(t,{N:()=>i});var r=n(2115),o=n(5155),l=n(8068),a=n(2317);function i(e){let t=e+"CollectionProvider",[n,i]=function(e,t=[]){let n=[],l=()=>{let t=n.map(e=>r.createContext(e));return function(n){let o=n?.[e]||t;return r.useMemo(()=>({[`__scope${e}`]:{...n,[e]:o}}),[n,o])}};return l.scopeName=e,[function(t,l){let a=r.createContext(l),i=n.length;function c(t){let{scope:n,children:l,...c}=t,u=n?.[e][i]||a,s=r.useMemo(()=>c,Object.values(c));return(0,o.jsx)(u.Provider,{value:s,children:l})}return n=[...n,l],c.displayName=t+"Provider",[c,function(n,o){let c=o?.[e][i]||a,u=r.useContext(c);if(u)return u;if(void 0!==l)return l;throw Error(`\`${n}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let n=()=>{let n=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let o=n.reduce((t,{useScope:n,scopeName:r})=>{let o=n(e)[`__scope${r}`];return{...t,...o}},{});return r.useMemo(()=>({[`__scope${t.scopeName}`]:o}),[o])}};return n.scopeName=t.scopeName,n}(l,...t)]}(t),[c,u]=n(t,{collectionRef:{current:null},itemMap:new Map}),s=e=>{let{scope:t,children:n}=e,l=r.useRef(null),a=r.useRef(new Map).current;return(0,o.jsx)(c,{scope:t,itemMap:a,collectionRef:l,children:n})};s.displayName=t;let d=e+"CollectionSlot",f=r.forwardRef((e,t)=>{let{scope:n,children:r}=e,i=u(d,n),c=(0,l.s)(t,i.collectionRef);return(0,o.jsx)(a.DX,{ref:c,children:r})});f.displayName=d;let p=e+"CollectionItemSlot",v="data-radix-collection-item",h=r.forwardRef((e,t)=>{let{scope:n,children:i,...c}=e,s=r.useRef(null),d=(0,l.s)(t,s),f=u(p,n);return r.useEffect(()=>(f.itemMap.set(s,{ref:s,...c}),()=>void f.itemMap.delete(s))),(0,o.jsx)(a.DX,{[v]:"",ref:d,children:i})});return h.displayName=p,[{Provider:s,Slot:f,ItemSlot:h},function(t){let n=u(e+"CollectionConsumer",t);return r.useCallback(()=>{let e=n.collectionRef.current;if(!e)return[];let t=Array.from(e.querySelectorAll("[".concat(v,"]")));return Array.from(n.itemMap.values()).sort((e,n)=>t.indexOf(e.ref.current)-t.indexOf(n.ref.current))},[n.collectionRef,n.itemMap])},i]}},4256:(e,t,n)=>{n.d(t,{jH:()=>l});var r=n(2115);n(5155);var o=r.createContext(void 0);function l(e){let t=r.useContext(o);return e||t||"ltr"}},7683:(e,t,n)=>{n.d(t,{UC:()=>tr,YJ:()=>tl,In:()=>tt,q7:()=>ti,VF:()=>tu,p4:()=>tc,JU:()=>ta,ZL:()=>tn,bL:()=>e4,wn:()=>td,PP:()=>ts,wv:()=>tf,l9:()=>e9,WT:()=>te,LM:()=>to});var r=n(2115),o=n(7650),l=n(1786),a=n(3610),i=n(2576),c=n(8068),u=n(8166),s=n(4256),d=n(3741),f=n(2292),p=n(196),v=n(7668),h=n(2793),m=n(7323),g=n(3360),w=n(2317),y=n(1524),x=n(1488),b=n(6611),C=n(858),S=n(3543),R=n(5587),k=n(6476),E="right-scroll-bar-position",N="width-before-scroll-bar",T=n(2607),j=(0,n(4577).f)(),M=function(){},P=r.forwardRef(function(e,t){var n=r.useRef(null),o=r.useState({onScrollCapture:M,onWheelCapture:M,onTouchMoveCapture:M}),l=o[0],a=o[1],i=e.forwardProps,c=e.children,u=e.className,s=e.removeScrollBar,d=e.enabled,f=e.shards,p=e.sideCar,v=e.noIsolation,h=e.inert,m=e.allowPinchZoom,g=e.as,w=e.gapMode,y=(0,k.Tt)(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),x=(0,T.S)([n,t]),b=(0,k.Cl)((0,k.Cl)({},y),l);return r.createElement(r.Fragment,null,d&&r.createElement(p,{sideCar:j,removeScrollBar:s,shards:f,noIsolation:v,inert:h,setCallbacks:a,allowPinchZoom:!!m,lockRef:n,gapMode:w}),i?r.cloneElement(r.Children.only(c),(0,k.Cl)((0,k.Cl)({},b),{ref:x})):r.createElement(void 0===g?"div":g,(0,k.Cl)({},b,{className:u,ref:x}),c))});P.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1},P.classNames={fullWidth:N,zeroRight:E};var I=n(6377),L=n(5219),D={left:0,top:0,right:0,gap:0},A=function(e){return parseInt(e||"",10)||0},B=function(e){var t=window.getComputedStyle(document.body),n=t["padding"===e?"paddingLeft":"marginLeft"],r=t["padding"===e?"paddingTop":"marginTop"],o=t["padding"===e?"paddingRight":"marginRight"];return[A(n),A(r),A(o)]},_=function(e){if(void 0===e&&(e="margin"),"undefined"==typeof window)return D;var t=B(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},H=(0,L.T0)(),W="data-scroll-locked",O=function(e,t,n,r){var o=e.left,l=e.top,a=e.right,i=e.gap;return void 0===n&&(n="margin"),"\n  .".concat("with-scroll-bars-hidden"," {\n   overflow: hidden ").concat(r,";\n   padding-right: ").concat(i,"px ").concat(r,";\n  }\n  body[").concat(W,"] {\n    overflow: hidden ").concat(r,";\n    overscroll-behavior: contain;\n    ").concat([t&&"position: relative ".concat(r,";"),"margin"===n&&"\n    padding-left: ".concat(o,"px;\n    padding-top: ").concat(l,"px;\n    padding-right: ").concat(a,"px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(i,"px ").concat(r,";\n    "),"padding"===n&&"padding-right: ".concat(i,"px ").concat(r,";")].filter(Boolean).join(""),"\n  }\n  \n  .").concat(E," {\n    right: ").concat(i,"px ").concat(r,";\n  }\n  \n  .").concat(N," {\n    margin-right: ").concat(i,"px ").concat(r,";\n  }\n  \n  .").concat(E," .").concat(E," {\n    right: 0 ").concat(r,";\n  }\n  \n  .").concat(N," .").concat(N," {\n    margin-right: 0 ").concat(r,";\n  }\n  \n  body[").concat(W,"] {\n    ").concat("--removed-body-scroll-bar-size",": ").concat(i,"px;\n  }\n")},V=function(){var e=parseInt(document.body.getAttribute(W)||"0",10);return isFinite(e)?e:0},F=function(){r.useEffect(function(){return document.body.setAttribute(W,(V()+1).toString()),function(){var e=V()-1;e<=0?document.body.removeAttribute(W):document.body.setAttribute(W,e.toString())}},[])},G=function(e){var t=e.noRelative,n=e.noImportant,o=e.gapMode,l=void 0===o?"margin":o;F();var a=r.useMemo(function(){return _(l)},[l]);return r.createElement(H,{styles:O(a,!t,l,n?"":"!important")})},K=!1;if("undefined"!=typeof window)try{var X=Object.defineProperty({},"passive",{get:function(){return K=!0,!0}});window.addEventListener("test",X,X),window.removeEventListener("test",X,X)}catch(e){K=!1}var U=!!K&&{passive:!1},q=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return"hidden"!==n[t]&&!(n.overflowY===n.overflowX&&"TEXTAREA"!==e.tagName&&"visible"===n[t])},z=function(e,t){var n=t.ownerDocument,r=t;do{if("undefined"!=typeof ShadowRoot&&r instanceof ShadowRoot&&(r=r.host),Y(e,r)){var o=Z(e,r);if(o[1]>o[2])return!0}r=r.parentNode}while(r&&r!==n.body);return!1},Y=function(e,t){return"v"===e?q(t,"overflowY"):q(t,"overflowX")},Z=function(e,t){return"v"===e?[t.scrollTop,t.scrollHeight,t.clientHeight]:[t.scrollLeft,t.scrollWidth,t.clientWidth]},$=function(e,t,n,r,o){var l,a=(l=window.getComputedStyle(t).direction,"h"===e&&"rtl"===l?-1:1),i=a*r,c=n.target,u=t.contains(c),s=!1,d=i>0,f=0,p=0;do{var v=Z(e,c),h=v[0],m=v[1]-v[2]-a*h;(h||m)&&Y(e,c)&&(f+=m,p+=h),c instanceof ShadowRoot?c=c.host:c=c.parentNode}while(!u&&c!==document.body||u&&(t.contains(c)||t===c));return d&&(o&&1>Math.abs(f)||!o&&i>f)?s=!0:!d&&(o&&1>Math.abs(p)||!o&&-i>p)&&(s=!0),s},J=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Q=function(e){return[e.deltaX,e.deltaY]},ee=function(e){return e&&"current"in e?e.current:e},et=0,en=[];let er=(0,I.m)(j,function(e){var t=r.useRef([]),n=r.useRef([0,0]),o=r.useRef(),l=r.useState(et++)[0],a=r.useState(L.T0)[0],i=r.useRef(e);r.useEffect(function(){i.current=e},[e]),r.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(l));var t=(0,k.fX)([e.lockRef.current],(e.shards||[]).map(ee),!0).filter(Boolean);return t.forEach(function(e){return e.classList.add("allow-interactivity-".concat(l))}),function(){document.body.classList.remove("block-interactivity-".concat(l)),t.forEach(function(e){return e.classList.remove("allow-interactivity-".concat(l))})}}},[e.inert,e.lockRef.current,e.shards]);var c=r.useCallback(function(e,t){if("touches"in e&&2===e.touches.length||"wheel"===e.type&&e.ctrlKey)return!i.current.allowPinchZoom;var r,l=J(e),a=n.current,c="deltaX"in e?e.deltaX:a[0]-l[0],u="deltaY"in e?e.deltaY:a[1]-l[1],s=e.target,d=Math.abs(c)>Math.abs(u)?"h":"v";if("touches"in e&&"h"===d&&"range"===s.type)return!1;var f=z(d,s);if(!f)return!0;if(f?r=d:(r="v"===d?"h":"v",f=z(d,s)),!f)return!1;if(!o.current&&"changedTouches"in e&&(c||u)&&(o.current=r),!r)return!0;var p=o.current||r;return $(p,t,e,"h"===p?c:u,!0)},[]),u=r.useCallback(function(e){if(en.length&&en[en.length-1]===a){var n="deltaY"in e?Q(e):J(e),r=t.current.filter(function(t){var r;return t.name===e.type&&(t.target===e.target||e.target===t.shadowParent)&&(r=t.delta)[0]===n[0]&&r[1]===n[1]})[0];if(r&&r.should){e.cancelable&&e.preventDefault();return}if(!r){var o=(i.current.shards||[]).map(ee).filter(Boolean).filter(function(t){return t.contains(e.target)});(o.length>0?c(e,o[0]):!i.current.noIsolation)&&e.cancelable&&e.preventDefault()}}},[]),s=r.useCallback(function(e,n,r,o){var l={name:e,delta:n,target:r,should:o,shadowParent:function(e){for(var t=null;null!==e;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}(r)};t.current.push(l),setTimeout(function(){t.current=t.current.filter(function(e){return e!==l})},1)},[]),d=r.useCallback(function(e){n.current=J(e),o.current=void 0},[]),f=r.useCallback(function(t){s(t.type,Q(t),t.target,c(t,e.lockRef.current))},[]),p=r.useCallback(function(t){s(t.type,J(t),t.target,c(t,e.lockRef.current))},[]);r.useEffect(function(){return en.push(a),e.setCallbacks({onScrollCapture:f,onWheelCapture:f,onTouchMoveCapture:p}),document.addEventListener("wheel",u,U),document.addEventListener("touchmove",u,U),document.addEventListener("touchstart",d,U),function(){en=en.filter(function(e){return e!==a}),document.removeEventListener("wheel",u,U),document.removeEventListener("touchmove",u,U),document.removeEventListener("touchstart",d,U)}},[]);var v=e.removeScrollBar,h=e.inert;return r.createElement(r.Fragment,null,h?r.createElement(a,{styles:"\n  .block-interactivity-".concat(l," {pointer-events: none;}\n  .allow-interactivity-").concat(l," {pointer-events: all;}\n")}):null,v?r.createElement(G,{gapMode:e.gapMode}):null)});var eo=r.forwardRef(function(e,t){return r.createElement(P,(0,k.Cl)({},e,{ref:t,sideCar:er}))});eo.classNames=P.classNames;var el=n(5155),ea=[" ","Enter","ArrowUp","ArrowDown"],ei=[" ","Enter"],ec="Select",[eu,es,ed]=(0,i.N)(ec),[ef,ep]=(0,u.A)(ec,[ed,h.Bk]),ev=(0,h.Bk)(),[eh,em]=ef(ec),[eg,ew]=ef(ec),ey=e=>{let{__scopeSelect:t,children:n,open:o,defaultOpen:l,onOpenChange:a,value:i,defaultValue:c,onValueChange:u,dir:d,name:f,autoComplete:p,disabled:m,required:g,form:w}=e,y=ev(t),[b,C]=r.useState(null),[S,R]=r.useState(null),[k,E]=r.useState(!1),N=(0,s.jH)(d),[T=!1,j]=(0,x.i)({prop:o,defaultProp:l,onChange:a}),[M,P]=(0,x.i)({prop:i,defaultProp:c,onChange:u}),I=r.useRef(null),L=!b||w||!!b.closest("form"),[D,A]=r.useState(new Set),B=Array.from(D).map(e=>e.props.value).join(";");return(0,el.jsx)(h.bL,{...y,children:(0,el.jsxs)(eh,{required:g,scope:t,trigger:b,onTriggerChange:C,valueNode:S,onValueNodeChange:R,valueNodeHasChildren:k,onValueNodeHasChildrenChange:E,contentId:(0,v.B)(),value:M,onValueChange:P,open:T,onOpenChange:j,dir:N,triggerPointerDownPosRef:I,disabled:m,children:[(0,el.jsx)(eu.Provider,{scope:t,children:(0,el.jsx)(eg,{scope:e.__scopeSelect,onNativeOptionAdd:r.useCallback(e=>{A(t=>new Set(t).add(e))},[]),onNativeOptionRemove:r.useCallback(e=>{A(t=>{let n=new Set(t);return n.delete(e),n})},[]),children:n})}),L?(0,el.jsxs)(e7,{"aria-hidden":!0,required:g,tabIndex:-1,name:f,autoComplete:p,value:M,onChange:e=>P(e.target.value),disabled:m,form:w,children:[void 0===M?(0,el.jsx)("option",{value:""}):null,Array.from(D)]},B):null]})})};ey.displayName=ec;var ex="SelectTrigger",eb=r.forwardRef((e,t)=>{let{__scopeSelect:n,disabled:o=!1,...l}=e,i=ev(n),u=em(ex,n),s=u.disabled||o,d=(0,c.s)(t,u.onTriggerChange),f=es(n),p=r.useRef("touch"),[v,m,w]=e3(e=>{let t=f().filter(e=>!e.disabled),n=t.find(e=>e.value===u.value),r=e8(t,e,n);void 0!==r&&u.onValueChange(r.value)}),y=e=>{s||(u.onOpenChange(!0),w()),e&&(u.triggerPointerDownPosRef.current={x:Math.round(e.pageX),y:Math.round(e.pageY)})};return(0,el.jsx)(h.Mz,{asChild:!0,...i,children:(0,el.jsx)(g.sG.button,{type:"button",role:"combobox","aria-controls":u.contentId,"aria-expanded":u.open,"aria-required":u.required,"aria-autocomplete":"none",dir:u.dir,"data-state":u.open?"open":"closed",disabled:s,"data-disabled":s?"":void 0,"data-placeholder":e2(u.value)?"":void 0,...l,ref:d,onClick:(0,a.m)(l.onClick,e=>{e.currentTarget.focus(),"mouse"!==p.current&&y(e)}),onPointerDown:(0,a.m)(l.onPointerDown,e=>{p.current=e.pointerType;let t=e.target;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),0===e.button&&!1===e.ctrlKey&&"mouse"===e.pointerType&&(y(e),e.preventDefault())}),onKeyDown:(0,a.m)(l.onKeyDown,e=>{let t=""!==v.current;e.ctrlKey||e.altKey||e.metaKey||1!==e.key.length||m(e.key),(!t||" "!==e.key)&&ea.includes(e.key)&&(y(),e.preventDefault())})})})});eb.displayName=ex;var eC="SelectValue",eS=r.forwardRef((e,t)=>{let{__scopeSelect:n,className:r,style:o,children:l,placeholder:a="",...i}=e,u=em(eC,n),{onValueNodeHasChildrenChange:s}=u,d=void 0!==l,f=(0,c.s)(t,u.onValueNodeChange);return(0,b.N)(()=>{s(d)},[s,d]),(0,el.jsx)(g.sG.span,{...i,ref:f,style:{pointerEvents:"none"},children:e2(u.value)?(0,el.jsx)(el.Fragment,{children:a}):l})});eS.displayName=eC;var eR=r.forwardRef((e,t)=>{let{__scopeSelect:n,children:r,...o}=e;return(0,el.jsx)(g.sG.span,{"aria-hidden":!0,...o,ref:t,children:r||"▼"})});eR.displayName="SelectIcon";var ek=e=>(0,el.jsx)(m.Z,{asChild:!0,...e});ek.displayName="SelectPortal";var eE="SelectContent",eN=r.forwardRef((e,t)=>{let n=em(eE,e.__scopeSelect),[l,a]=r.useState();return((0,b.N)(()=>{a(new DocumentFragment)},[]),n.open)?(0,el.jsx)(eM,{...e,ref:t}):l?o.createPortal((0,el.jsx)(eT,{scope:e.__scopeSelect,children:(0,el.jsx)(eu.Slot,{scope:e.__scopeSelect,children:(0,el.jsx)("div",{children:e.children})})}),l):null});eN.displayName=eE;var[eT,ej]=ef(eE),eM=r.forwardRef((e,t)=>{let{__scopeSelect:n,position:o="item-aligned",onCloseAutoFocus:l,onEscapeKeyDown:i,onPointerDownOutside:u,side:s,sideOffset:v,align:h,alignOffset:m,arrowPadding:g,collisionBoundary:y,collisionPadding:x,sticky:b,hideWhenDetached:C,avoidCollisions:S,...k}=e,E=em(eE,n),[N,T]=r.useState(null),[j,M]=r.useState(null),P=(0,c.s)(t,e=>T(e)),[I,L]=r.useState(null),[D,A]=r.useState(null),B=es(n),[_,H]=r.useState(!1),W=r.useRef(!1);r.useEffect(()=>{if(N)return(0,R.Eq)(N)},[N]),(0,f.Oh)();let O=r.useCallback(e=>{let[t,...n]=B().map(e=>e.ref.current),[r]=n.slice(-1),o=document.activeElement;for(let n of e)if(n===o||(null==n||n.scrollIntoView({block:"nearest"}),n===t&&j&&(j.scrollTop=0),n===r&&j&&(j.scrollTop=j.scrollHeight),null==n||n.focus(),document.activeElement!==o))return},[B,j]),V=r.useCallback(()=>O([I,N]),[O,I,N]);r.useEffect(()=>{_&&V()},[_,V]);let{onOpenChange:F,triggerPointerDownPosRef:G}=E;r.useEffect(()=>{if(N){let e={x:0,y:0},t=t=>{var n,r,o,l;e={x:Math.abs(Math.round(t.pageX)-(null!==(o=null===(n=G.current)||void 0===n?void 0:n.x)&&void 0!==o?o:0)),y:Math.abs(Math.round(t.pageY)-(null!==(l=null===(r=G.current)||void 0===r?void 0:r.y)&&void 0!==l?l:0))}},n=n=>{e.x<=10&&e.y<=10?n.preventDefault():N.contains(n.target)||F(!1),document.removeEventListener("pointermove",t),G.current=null};return null!==G.current&&(document.addEventListener("pointermove",t),document.addEventListener("pointerup",n,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",t),document.removeEventListener("pointerup",n,{capture:!0})}}},[N,F,G]),r.useEffect(()=>{let e=()=>F(!1);return window.addEventListener("blur",e),window.addEventListener("resize",e),()=>{window.removeEventListener("blur",e),window.removeEventListener("resize",e)}},[F]);let[K,X]=e3(e=>{let t=B().filter(e=>!e.disabled),n=t.find(e=>e.ref.current===document.activeElement),r=e8(t,e,n);r&&setTimeout(()=>r.ref.current.focus())}),U=r.useCallback((e,t,n)=>{let r=!W.current&&!n;(void 0!==E.value&&E.value===t||r)&&(L(e),r&&(W.current=!0))},[E.value]),q=r.useCallback(()=>null==N?void 0:N.focus(),[N]),z=r.useCallback((e,t,n)=>{let r=!W.current&&!n;(void 0!==E.value&&E.value===t||r)&&A(e)},[E.value]),Y="popper"===o?eI:eP,Z=Y===eI?{side:s,sideOffset:v,align:h,alignOffset:m,arrowPadding:g,collisionBoundary:y,collisionPadding:x,sticky:b,hideWhenDetached:C,avoidCollisions:S}:{};return(0,el.jsx)(eT,{scope:n,content:N,viewport:j,onViewportChange:M,itemRefCallback:U,selectedItem:I,onItemLeave:q,itemTextRefCallback:z,focusSelectedItem:V,selectedItemText:D,position:o,isPositioned:_,searchRef:K,children:(0,el.jsx)(eo,{as:w.DX,allowPinchZoom:!0,children:(0,el.jsx)(p.n,{asChild:!0,trapped:E.open,onMountAutoFocus:e=>{e.preventDefault()},onUnmountAutoFocus:(0,a.m)(l,e=>{var t;null===(t=E.trigger)||void 0===t||t.focus({preventScroll:!0}),e.preventDefault()}),children:(0,el.jsx)(d.qW,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:i,onPointerDownOutside:u,onFocusOutside:e=>e.preventDefault(),onDismiss:()=>E.onOpenChange(!1),children:(0,el.jsx)(Y,{role:"listbox",id:E.contentId,"data-state":E.open?"open":"closed",dir:E.dir,onContextMenu:e=>e.preventDefault(),...k,...Z,onPlaced:()=>H(!0),ref:P,style:{display:"flex",flexDirection:"column",outline:"none",...k.style},onKeyDown:(0,a.m)(k.onKeyDown,e=>{let t=e.ctrlKey||e.altKey||e.metaKey;if("Tab"===e.key&&e.preventDefault(),t||1!==e.key.length||X(e.key),["ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=B().filter(e=>!e.disabled).map(e=>e.ref.current);if(["ArrowUp","End"].includes(e.key)&&(t=t.slice().reverse()),["ArrowUp","ArrowDown"].includes(e.key)){let n=e.target,r=t.indexOf(n);t=t.slice(r+1)}setTimeout(()=>O(t)),e.preventDefault()}})})})})})})});eM.displayName="SelectContentImpl";var eP=r.forwardRef((e,t)=>{let{__scopeSelect:n,onPlaced:o,...a}=e,i=em(eE,n),u=ej(eE,n),[s,d]=r.useState(null),[f,p]=r.useState(null),v=(0,c.s)(t,e=>p(e)),h=es(n),m=r.useRef(!1),w=r.useRef(!0),{viewport:y,selectedItem:x,selectedItemText:C,focusSelectedItem:S}=u,R=r.useCallback(()=>{if(i.trigger&&i.valueNode&&s&&f&&y&&x&&C){let e=i.trigger.getBoundingClientRect(),t=f.getBoundingClientRect(),n=i.valueNode.getBoundingClientRect(),r=C.getBoundingClientRect();if("rtl"!==i.dir){let o=r.left-t.left,a=n.left-o,i=e.left-a,c=e.width+i,u=Math.max(c,t.width),d=window.innerWidth-10,f=(0,l.q)(a,[10,Math.max(10,d-u)]);s.style.minWidth=c+"px",s.style.left=f+"px"}else{let o=t.right-r.right,a=window.innerWidth-n.right-o,i=window.innerWidth-e.right-a,c=e.width+i,u=Math.max(c,t.width),d=window.innerWidth-10,f=(0,l.q)(a,[10,Math.max(10,d-u)]);s.style.minWidth=c+"px",s.style.right=f+"px"}let a=h(),c=window.innerHeight-20,u=y.scrollHeight,d=window.getComputedStyle(f),p=parseInt(d.borderTopWidth,10),v=parseInt(d.paddingTop,10),g=parseInt(d.borderBottomWidth,10),w=p+v+u+parseInt(d.paddingBottom,10)+g,b=Math.min(5*x.offsetHeight,w),S=window.getComputedStyle(y),R=parseInt(S.paddingTop,10),k=parseInt(S.paddingBottom,10),E=e.top+e.height/2-10,N=x.offsetHeight/2,T=p+v+(x.offsetTop+N);if(T<=E){let e=a.length>0&&x===a[a.length-1].ref.current;s.style.bottom="0px";let t=Math.max(c-E,N+(e?k:0)+(f.clientHeight-y.offsetTop-y.offsetHeight)+g);s.style.height=T+t+"px"}else{let e=a.length>0&&x===a[0].ref.current;s.style.top="0px";let t=Math.max(E,p+y.offsetTop+(e?R:0)+N);s.style.height=t+(w-T)+"px",y.scrollTop=T-E+y.offsetTop}s.style.margin="".concat(10,"px 0"),s.style.minHeight=b+"px",s.style.maxHeight=c+"px",null==o||o(),requestAnimationFrame(()=>m.current=!0)}},[h,i.trigger,i.valueNode,s,f,y,x,C,i.dir,o]);(0,b.N)(()=>R(),[R]);let[k,E]=r.useState();(0,b.N)(()=>{f&&E(window.getComputedStyle(f).zIndex)},[f]);let N=r.useCallback(e=>{e&&!0===w.current&&(R(),null==S||S(),w.current=!1)},[R,S]);return(0,el.jsx)(eL,{scope:n,contentWrapper:s,shouldExpandOnScrollRef:m,onScrollButtonChange:N,children:(0,el.jsx)("div",{ref:d,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:k},children:(0,el.jsx)(g.sG.div,{...a,ref:v,style:{boxSizing:"border-box",maxHeight:"100%",...a.style}})})})});eP.displayName="SelectItemAlignedPosition";var eI=r.forwardRef((e,t)=>{let{__scopeSelect:n,align:r="start",collisionPadding:o=10,...l}=e,a=ev(n);return(0,el.jsx)(h.UC,{...a,...l,ref:t,align:r,collisionPadding:o,style:{boxSizing:"border-box",...l.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})});eI.displayName="SelectPopperPosition";var[eL,eD]=ef(eE,{}),eA="SelectViewport",eB=r.forwardRef((e,t)=>{let{__scopeSelect:n,nonce:o,...l}=e,i=ej(eA,n),u=eD(eA,n),s=(0,c.s)(t,i.onViewportChange),d=r.useRef(0);return(0,el.jsxs)(el.Fragment,{children:[(0,el.jsx)("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:o}),(0,el.jsx)(eu.Slot,{scope:n,children:(0,el.jsx)(g.sG.div,{"data-radix-select-viewport":"",role:"presentation",...l,ref:s,style:{position:"relative",flex:1,overflow:"hidden auto",...l.style},onScroll:(0,a.m)(l.onScroll,e=>{let t=e.currentTarget,{contentWrapper:n,shouldExpandOnScrollRef:r}=u;if((null==r?void 0:r.current)&&n){let e=Math.abs(d.current-t.scrollTop);if(e>0){let r=window.innerHeight-20,o=Math.max(parseFloat(n.style.minHeight),parseFloat(n.style.height));if(o<r){let l=o+e,a=Math.min(r,l),i=l-a;n.style.height=a+"px","0px"===n.style.bottom&&(t.scrollTop=i>0?i:0,n.style.justifyContent="flex-end")}}}d.current=t.scrollTop})})})]})});eB.displayName=eA;var e_="SelectGroup",[eH,eW]=ef(e_),eO=r.forwardRef((e,t)=>{let{__scopeSelect:n,...r}=e,o=(0,v.B)();return(0,el.jsx)(eH,{scope:n,id:o,children:(0,el.jsx)(g.sG.div,{role:"group","aria-labelledby":o,...r,ref:t})})});eO.displayName=e_;var eV="SelectLabel",eF=r.forwardRef((e,t)=>{let{__scopeSelect:n,...r}=e,o=eW(eV,n);return(0,el.jsx)(g.sG.div,{id:o.id,...r,ref:t})});eF.displayName=eV;var eG="SelectItem",[eK,eX]=ef(eG),eU=r.forwardRef((e,t)=>{let{__scopeSelect:n,value:o,disabled:l=!1,textValue:i,...u}=e,s=em(eG,n),d=ej(eG,n),f=s.value===o,[p,h]=r.useState(null!=i?i:""),[m,w]=r.useState(!1),y=(0,c.s)(t,e=>{var t;return null===(t=d.itemRefCallback)||void 0===t?void 0:t.call(d,e,o,l)}),x=(0,v.B)(),b=r.useRef("touch"),C=()=>{l||(s.onValueChange(o),s.onOpenChange(!1))};if(""===o)throw Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");return(0,el.jsx)(eK,{scope:n,value:o,disabled:l,textId:x,isSelected:f,onItemTextChange:r.useCallback(e=>{h(t=>{var n;return t||(null!==(n=null==e?void 0:e.textContent)&&void 0!==n?n:"").trim()})},[]),children:(0,el.jsx)(eu.ItemSlot,{scope:n,value:o,disabled:l,textValue:p,children:(0,el.jsx)(g.sG.div,{role:"option","aria-labelledby":x,"data-highlighted":m?"":void 0,"aria-selected":f&&m,"data-state":f?"checked":"unchecked","aria-disabled":l||void 0,"data-disabled":l?"":void 0,tabIndex:l?void 0:-1,...u,ref:y,onFocus:(0,a.m)(u.onFocus,()=>w(!0)),onBlur:(0,a.m)(u.onBlur,()=>w(!1)),onClick:(0,a.m)(u.onClick,()=>{"mouse"!==b.current&&C()}),onPointerUp:(0,a.m)(u.onPointerUp,()=>{"mouse"===b.current&&C()}),onPointerDown:(0,a.m)(u.onPointerDown,e=>{b.current=e.pointerType}),onPointerMove:(0,a.m)(u.onPointerMove,e=>{if(b.current=e.pointerType,l){var t;null===(t=d.onItemLeave)||void 0===t||t.call(d)}else"mouse"===b.current&&e.currentTarget.focus({preventScroll:!0})}),onPointerLeave:(0,a.m)(u.onPointerLeave,e=>{if(e.currentTarget===document.activeElement){var t;null===(t=d.onItemLeave)||void 0===t||t.call(d)}}),onKeyDown:(0,a.m)(u.onKeyDown,e=>{var t;(null===(t=d.searchRef)||void 0===t?void 0:t.current)!==""&&" "===e.key||(ei.includes(e.key)&&C()," "===e.key&&e.preventDefault())})})})})});eU.displayName=eG;var eq="SelectItemText",ez=r.forwardRef((e,t)=>{let{__scopeSelect:n,className:l,style:a,...i}=e,u=em(eq,n),s=ej(eq,n),d=eX(eq,n),f=ew(eq,n),[p,v]=r.useState(null),h=(0,c.s)(t,e=>v(e),d.onItemTextChange,e=>{var t;return null===(t=s.itemTextRefCallback)||void 0===t?void 0:t.call(s,e,d.value,d.disabled)}),m=null==p?void 0:p.textContent,w=r.useMemo(()=>(0,el.jsx)("option",{value:d.value,disabled:d.disabled,children:m},d.value),[d.disabled,d.value,m]),{onNativeOptionAdd:y,onNativeOptionRemove:x}=f;return(0,b.N)(()=>(y(w),()=>x(w)),[y,x,w]),(0,el.jsxs)(el.Fragment,{children:[(0,el.jsx)(g.sG.span,{id:d.textId,...i,ref:h}),d.isSelected&&u.valueNode&&!u.valueNodeHasChildren?o.createPortal(i.children,u.valueNode):null]})});ez.displayName=eq;var eY="SelectItemIndicator",eZ=r.forwardRef((e,t)=>{let{__scopeSelect:n,...r}=e;return eX(eY,n).isSelected?(0,el.jsx)(g.sG.span,{"aria-hidden":!0,...r,ref:t}):null});eZ.displayName=eY;var e$="SelectScrollUpButton",eJ=r.forwardRef((e,t)=>{let n=ej(e$,e.__scopeSelect),o=eD(e$,e.__scopeSelect),[l,a]=r.useState(!1),i=(0,c.s)(t,o.onScrollButtonChange);return(0,b.N)(()=>{if(n.viewport&&n.isPositioned){let e=function(){a(t.scrollTop>0)},t=n.viewport;return e(),t.addEventListener("scroll",e),()=>t.removeEventListener("scroll",e)}},[n.viewport,n.isPositioned]),l?(0,el.jsx)(e1,{...e,ref:i,onAutoScroll:()=>{let{viewport:e,selectedItem:t}=n;e&&t&&(e.scrollTop=e.scrollTop-t.offsetHeight)}}):null});eJ.displayName=e$;var eQ="SelectScrollDownButton",e0=r.forwardRef((e,t)=>{let n=ej(eQ,e.__scopeSelect),o=eD(eQ,e.__scopeSelect),[l,a]=r.useState(!1),i=(0,c.s)(t,o.onScrollButtonChange);return(0,b.N)(()=>{if(n.viewport&&n.isPositioned){let e=function(){let e=t.scrollHeight-t.clientHeight;a(Math.ceil(t.scrollTop)<e)},t=n.viewport;return e(),t.addEventListener("scroll",e),()=>t.removeEventListener("scroll",e)}},[n.viewport,n.isPositioned]),l?(0,el.jsx)(e1,{...e,ref:i,onAutoScroll:()=>{let{viewport:e,selectedItem:t}=n;e&&t&&(e.scrollTop=e.scrollTop+t.offsetHeight)}}):null});e0.displayName=eQ;var e1=r.forwardRef((e,t)=>{let{__scopeSelect:n,onAutoScroll:o,...l}=e,i=ej("SelectScrollButton",n),c=r.useRef(null),u=es(n),s=r.useCallback(()=>{null!==c.current&&(window.clearInterval(c.current),c.current=null)},[]);return r.useEffect(()=>()=>s(),[s]),(0,b.N)(()=>{var e;let t=u().find(e=>e.ref.current===document.activeElement);null==t||null===(e=t.ref.current)||void 0===e||e.scrollIntoView({block:"nearest"})},[u]),(0,el.jsx)(g.sG.div,{"aria-hidden":!0,...l,ref:t,style:{flexShrink:0,...l.style},onPointerDown:(0,a.m)(l.onPointerDown,()=>{null===c.current&&(c.current=window.setInterval(o,50))}),onPointerMove:(0,a.m)(l.onPointerMove,()=>{var e;null===(e=i.onItemLeave)||void 0===e||e.call(i),null===c.current&&(c.current=window.setInterval(o,50))}),onPointerLeave:(0,a.m)(l.onPointerLeave,()=>{s()})})}),e5=r.forwardRef((e,t)=>{let{__scopeSelect:n,...r}=e;return(0,el.jsx)(g.sG.div,{"aria-hidden":!0,...r,ref:t})});e5.displayName="SelectSeparator";var e6="SelectArrow";function e2(e){return""===e||void 0===e}r.forwardRef((e,t)=>{let{__scopeSelect:n,...r}=e,o=ev(n),l=em(e6,n),a=ej(e6,n);return l.open&&"popper"===a.position?(0,el.jsx)(h.i3,{...o,...r,ref:t}):null}).displayName=e6;var e7=r.forwardRef((e,t)=>{let{value:n,...o}=e,l=r.useRef(null),a=(0,c.s)(t,l),i=(0,C.Z)(n);return r.useEffect(()=>{let e=l.current,t=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,"value").set;if(i!==n&&t){let r=new Event("change",{bubbles:!0});t.call(e,n),e.dispatchEvent(r)}},[i,n]),(0,el.jsx)(S.s,{asChild:!0,children:(0,el.jsx)("select",{...o,ref:a,defaultValue:n})})});function e3(e){let t=(0,y.c)(e),n=r.useRef(""),o=r.useRef(0),l=r.useCallback(e=>{let r=n.current+e;t(r),function e(t){n.current=t,window.clearTimeout(o.current),""!==t&&(o.current=window.setTimeout(()=>e(""),1e3))}(r)},[t]),a=r.useCallback(()=>{n.current="",window.clearTimeout(o.current)},[]);return r.useEffect(()=>()=>window.clearTimeout(o.current),[]),[n,l,a]}function e8(e,t,n){var r;let o=t.length>1&&Array.from(t).every(e=>e===t[0])?t[0]:t,l=(r=Math.max(n?e.indexOf(n):-1,0),e.map((t,n)=>e[(r+n)%e.length]));1===o.length&&(l=l.filter(e=>e!==n));let a=l.find(e=>e.textValue.toLowerCase().startsWith(o.toLowerCase()));return a!==n?a:void 0}e7.displayName="BubbleSelect";var e4=ey,e9=eb,te=eS,tt=eR,tn=ek,tr=eN,to=eB,tl=eO,ta=eF,ti=eU,tc=ez,tu=eZ,ts=eJ,td=e0,tf=e5},858:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(2115);function o(e){let t=r.useRef({value:e,previous:e});return r.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}},3543:(e,t,n)=>{n.d(t,{b:()=>i,s:()=>a});var r=n(2115),o=n(3360),l=n(5155),a=r.forwardRef((e,t)=>(0,l.jsx)(o.sG.span,{...e,ref:t,style:{position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal",...e.style}}));a.displayName="VisuallyHidden";var i=a}}]);