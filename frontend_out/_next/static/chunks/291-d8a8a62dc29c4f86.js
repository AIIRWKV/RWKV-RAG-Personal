"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[291],{4858:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(7401).A)("Ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]])},767:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(7401).A)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},5250:(e,t,n)=>{n.d(t,{bm:()=>e8,UC:()=>e5,VY:()=>e7,hJ:()=>e2,ZL:()=>e1,bL:()=>eQ,hE:()=>e6,l9:()=>e0,G$:()=>eq,Hs:()=>eN});var r,o=n(2115);function i(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e?.(r),!1===n||!r.defaultPrevented)return t?.(r)}}function a(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}function l(...e){return t=>{let n=!1,r=e.map(e=>{let r=a(e,t);return n||"function"!=typeof r||(n=!0),r});if(n)return()=>{for(let t=0;t<r.length;t++){let n=r[t];"function"==typeof n?n():a(e[t],null)}}}}function u(...e){return o.useCallback(l(...e),e)}var c=n(8166),s=n(7668),d=n(1488),f=n(7650),v=n(5155),p=o.forwardRef((e,t)=>{let{children:n,...r}=e,i=o.Children.toArray(n),a=i.find(g);if(a){let e=a.props.children,n=i.map(t=>t!==a?t:o.Children.count(e)>1?o.Children.only(null):o.isValidElement(e)?e.props.children:null);return(0,v.jsx)(m,{...r,ref:t,children:o.isValidElement(e)?o.cloneElement(e,void 0,n):null})}return(0,v.jsx)(m,{...r,ref:t,children:n})});p.displayName="Slot";var m=o.forwardRef((e,t)=>{let{children:n,...r}=e;if(o.isValidElement(n)){let e=function(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(n=(t=Object.getOwnPropertyDescriptor(e,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?e.props.ref:e.props.ref||e.ref}(n);return o.cloneElement(n,{...function(e,t){let n={...t};for(let r in t){let o=e[r],i=t[r];/^on[A-Z]/.test(r)?o&&i?n[r]=(...e)=>{i(...e),o(...e)}:o&&(n[r]=o):"style"===r?n[r]={...o,...i}:"className"===r&&(n[r]=[o,i].filter(Boolean).join(" "))}return{...e,...n}}(r,n.props),ref:t?l(t,e):e})}return o.Children.count(n)>1?o.Children.only(null):null});m.displayName="SlotClone";var h=({children:e})=>(0,v.jsx)(v.Fragment,{children:e});function g(e){return o.isValidElement(e)&&e.type===h}var y=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,t)=>{let n=o.forwardRef((e,n)=>{let{asChild:r,...o}=e,i=r?p:t;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,v.jsx)(i,{...o,ref:n})});return n.displayName=`Primitive.${t}`,{...e,[t]:n}},{}),b=n(1524),E=n(5630),w="dismissableLayer.update",C=o.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),N=o.forwardRef((e,t)=>{var n,a;let{disableOutsidePointerEvents:l=!1,onEscapeKeyDown:c,onPointerDownOutside:s,onFocusOutside:d,onInteractOutside:f,onDismiss:p,...m}=e,h=o.useContext(C),[g,N]=o.useState(null),x=null!==(a=null==g?void 0:g.ownerDocument)&&void 0!==a?a:null===(n=globalThis)||void 0===n?void 0:n.document,[,T]=o.useState({}),L=u(t,e=>N(e)),O=Array.from(h.layers),[P]=[...h.layersWithOutsidePointerEventsDisabled].slice(-1),S=O.indexOf(P),I=g?O.indexOf(g):-1,M=h.layersWithOutsidePointerEventsDisabled.size>0,k=I>=S,j=function(e){var t;let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null===(t=globalThis)||void 0===t?void 0:t.document,r=(0,b.c)(e),i=o.useRef(!1),a=o.useRef(()=>{});return o.useEffect(()=>{let e=e=>{if(e.target&&!i.current){let t=function(){D("dismissableLayer.pointerDownOutside",r,o,{discrete:!0})},o={originalEvent:e};"touch"===e.pointerType?(n.removeEventListener("click",a.current),a.current=t,n.addEventListener("click",a.current,{once:!0})):t()}else n.removeEventListener("click",a.current);i.current=!1},t=window.setTimeout(()=>{n.addEventListener("pointerdown",e)},0);return()=>{window.clearTimeout(t),n.removeEventListener("pointerdown",e),n.removeEventListener("click",a.current)}},[n,r]),{onPointerDownCapture:()=>i.current=!0}}(e=>{let t=e.target,n=[...h.branches].some(e=>e.contains(t));!k||n||(null==s||s(e),null==f||f(e),e.defaultPrevented||null==p||p())},x),F=function(e){var t;let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null===(t=globalThis)||void 0===t?void 0:t.document,r=(0,b.c)(e),i=o.useRef(!1);return o.useEffect(()=>{let e=e=>{e.target&&!i.current&&D("dismissableLayer.focusOutside",r,{originalEvent:e},{discrete:!1})};return n.addEventListener("focusin",e),()=>n.removeEventListener("focusin",e)},[n,r]),{onFocusCapture:()=>i.current=!0,onBlurCapture:()=>i.current=!1}}(e=>{let t=e.target;[...h.branches].some(e=>e.contains(t))||(null==d||d(e),null==f||f(e),e.defaultPrevented||null==p||p())},x);return(0,E.U)(e=>{I!==h.layers.size-1||(null==c||c(e),!e.defaultPrevented&&p&&(e.preventDefault(),p()))},x),o.useEffect(()=>{if(g)return l&&(0===h.layersWithOutsidePointerEventsDisabled.size&&(r=x.body.style.pointerEvents,x.body.style.pointerEvents="none"),h.layersWithOutsidePointerEventsDisabled.add(g)),h.layers.add(g),R(),()=>{l&&1===h.layersWithOutsidePointerEventsDisabled.size&&(x.body.style.pointerEvents=r)}},[g,x,l,h]),o.useEffect(()=>()=>{g&&(h.layers.delete(g),h.layersWithOutsidePointerEventsDisabled.delete(g),R())},[g,h]),o.useEffect(()=>{let e=()=>T({});return document.addEventListener(w,e),()=>document.removeEventListener(w,e)},[]),(0,v.jsx)(y.div,{...m,ref:L,style:{pointerEvents:M?k?"auto":"none":void 0,...e.style},onFocusCapture:i(e.onFocusCapture,F.onFocusCapture),onBlurCapture:i(e.onBlurCapture,F.onBlurCapture),onPointerDownCapture:i(e.onPointerDownCapture,j.onPointerDownCapture)})});function R(){let e=new CustomEvent(w);document.dispatchEvent(e)}function D(e,t,n,r){let{discrete:o}=r,i=n.originalEvent.target,a=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:n});(t&&i.addEventListener(e,t,{once:!0}),o)?i&&f.flushSync(()=>i.dispatchEvent(a)):i.dispatchEvent(a)}N.displayName="DismissableLayer",o.forwardRef((e,t)=>{let n=o.useContext(C),r=o.useRef(null),i=u(t,r);return o.useEffect(()=>{let e=r.current;if(e)return n.branches.add(e),()=>{n.branches.delete(e)}},[n.branches]),(0,v.jsx)(y.div,{...e,ref:i})}).displayName="DismissableLayerBranch";var x="focusScope.autoFocusOnMount",T="focusScope.autoFocusOnUnmount",L={bubbles:!1,cancelable:!0},O=o.forwardRef((e,t)=>{let{loop:n=!1,trapped:r=!1,onMountAutoFocus:i,onUnmountAutoFocus:a,...l}=e,[c,s]=o.useState(null),d=(0,b.c)(i),f=(0,b.c)(a),p=o.useRef(null),m=u(t,e=>s(e)),h=o.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;o.useEffect(()=>{if(r){let e=function(e){if(h.paused||!c)return;let t=e.target;c.contains(t)?p.current=t:I(p.current,{select:!0})},t=function(e){if(h.paused||!c)return;let t=e.relatedTarget;null===t||c.contains(t)||I(p.current,{select:!0})};document.addEventListener("focusin",e),document.addEventListener("focusout",t);let n=new MutationObserver(function(e){if(document.activeElement===document.body)for(let t of e)t.removedNodes.length>0&&I(c)});return c&&n.observe(c,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",e),document.removeEventListener("focusout",t),n.disconnect()}}},[r,c,h.paused]),o.useEffect(()=>{if(c){M.add(h);let e=document.activeElement;if(!c.contains(e)){let t=new CustomEvent(x,L);c.addEventListener(x,d),c.dispatchEvent(t),t.defaultPrevented||(function(e){let{select:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=document.activeElement;for(let r of e)if(I(r,{select:t}),document.activeElement!==n)return}(P(c).filter(e=>"A"!==e.tagName),{select:!0}),document.activeElement===e&&I(c))}return()=>{c.removeEventListener(x,d),setTimeout(()=>{let t=new CustomEvent(T,L);c.addEventListener(T,f),c.dispatchEvent(t),t.defaultPrevented||I(null!=e?e:document.body,{select:!0}),c.removeEventListener(T,f),M.remove(h)},0)}}},[c,d,f,h]);let g=o.useCallback(e=>{if(!n&&!r||h.paused)return;let t="Tab"===e.key&&!e.altKey&&!e.ctrlKey&&!e.metaKey,o=document.activeElement;if(t&&o){let t=e.currentTarget,[r,i]=function(e){let t=P(e);return[S(t,e),S(t.reverse(),e)]}(t);r&&i?e.shiftKey||o!==i?e.shiftKey&&o===r&&(e.preventDefault(),n&&I(i,{select:!0})):(e.preventDefault(),n&&I(r,{select:!0})):o===t&&e.preventDefault()}},[n,r,h.paused]);return(0,v.jsx)(y.div,{tabIndex:-1,...l,ref:m,onKeyDown:g})});function P(e){let t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>{let t="INPUT"===e.tagName&&"hidden"===e.type;return e.disabled||e.hidden||t?NodeFilter.FILTER_SKIP:e.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function S(e,t){for(let n of e)if(!function(e,t){let{upTo:n}=t;if("hidden"===getComputedStyle(e).visibility)return!0;for(;e&&(void 0===n||e!==n);){if("none"===getComputedStyle(e).display)return!0;e=e.parentElement}return!1}(n,{upTo:t}))return n}function I(e){let{select:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(e&&e.focus){var n;let r=document.activeElement;e.focus({preventScroll:!0}),e!==r&&(n=e)instanceof HTMLInputElement&&"select"in n&&t&&e.select()}}O.displayName="FocusScope";var M=function(){let e=[];return{add(t){let n=e[0];t!==n&&(null==n||n.pause()),(e=k(e,t)).unshift(t)},remove(t){var n;null===(n=(e=k(e,t))[0])||void 0===n||n.resume()}}}();function k(e,t){let n=[...e],r=n.indexOf(t);return -1!==r&&n.splice(r,1),n}var j=n(6611),F=o.forwardRef((e,t)=>{var n,r;let{container:i,...a}=e,[l,u]=o.useState(!1);(0,j.N)(()=>u(!0),[]);let c=i||l&&(null===(r=globalThis)||void 0===r?void 0:null===(n=r.document)||void 0===n?void 0:n.body);return c?f.createPortal((0,v.jsx)(y.div,{...a,ref:t}),c):null});F.displayName="Portal";var A=e=>{let{present:t,children:n}=e,r=function(e){var t,n;let[r,i]=o.useState(),a=o.useRef({}),l=o.useRef(e),u=o.useRef("none"),[c,s]=(t=e?"mounted":"unmounted",n={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},o.useReducer((e,t)=>{let r=n[e][t];return null!=r?r:e},t));return o.useEffect(()=>{let e=W(a.current);u.current="mounted"===c?e:"none"},[c]),(0,j.N)(()=>{let t=a.current,n=l.current;if(n!==e){let r=u.current,o=W(t);e?s("MOUNT"):"none"===o||(null==t?void 0:t.display)==="none"?s("UNMOUNT"):n&&r!==o?s("ANIMATION_OUT"):s("UNMOUNT"),l.current=e}},[e,s]),(0,j.N)(()=>{if(r){var e;let t;let n=null!==(e=r.ownerDocument.defaultView)&&void 0!==e?e:window,o=e=>{let o=W(a.current).includes(e.animationName);if(e.target===r&&o&&(s("ANIMATION_END"),!l.current)){let e=r.style.animationFillMode;r.style.animationFillMode="forwards",t=n.setTimeout(()=>{"forwards"===r.style.animationFillMode&&(r.style.animationFillMode=e)})}},i=e=>{e.target===r&&(u.current=W(a.current))};return r.addEventListener("animationstart",i),r.addEventListener("animationcancel",o),r.addEventListener("animationend",o),()=>{n.clearTimeout(t),r.removeEventListener("animationstart",i),r.removeEventListener("animationcancel",o),r.removeEventListener("animationend",o)}}s("ANIMATION_END")},[r,s]),{isPresent:["mounted","unmountSuspended"].includes(c),ref:o.useCallback(e=>{e&&(a.current=getComputedStyle(e)),i(e)},[])}}(t),i="function"==typeof n?n({present:r.isPresent}):o.Children.only(n),a=u(r.ref,function(e){var t,n;let r=null===(t=Object.getOwnPropertyDescriptor(e.props,"ref"))||void 0===t?void 0:t.get,o=r&&"isReactWarning"in r&&r.isReactWarning;return o?e.ref:(o=(r=null===(n=Object.getOwnPropertyDescriptor(e,"ref"))||void 0===n?void 0:n.get)&&"isReactWarning"in r&&r.isReactWarning)?e.props.ref:e.props.ref||e.ref}(i));return"function"==typeof n||r.isPresent?o.cloneElement(i,{ref:a}):null};function W(e){return(null==e?void 0:e.animationName)||"none"}A.displayName="Presence";var _=n(2292),B=n(6476),U="right-scroll-bar-position",K="width-before-scroll-bar",X=n(2607),Y=(0,n(4577).f)(),z=function(){},V=o.forwardRef(function(e,t){var n=o.useRef(null),r=o.useState({onScrollCapture:z,onWheelCapture:z,onTouchMoveCapture:z}),i=r[0],a=r[1],l=e.forwardProps,u=e.children,c=e.className,s=e.removeScrollBar,d=e.enabled,f=e.shards,v=e.sideCar,p=e.noIsolation,m=e.inert,h=e.allowPinchZoom,g=e.as,y=e.gapMode,b=(0,B.Tt)(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),E=(0,X.S)([n,t]),w=(0,B.Cl)((0,B.Cl)({},b),i);return o.createElement(o.Fragment,null,d&&o.createElement(v,{sideCar:Y,removeScrollBar:s,shards:f,noIsolation:p,inert:m,setCallbacks:a,allowPinchZoom:!!h,lockRef:n,gapMode:y}),l?o.cloneElement(o.Children.only(u),(0,B.Cl)((0,B.Cl)({},w),{ref:E})):o.createElement(void 0===g?"div":g,(0,B.Cl)({},w,{className:c,ref:E}),u))});V.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1},V.classNames={fullWidth:K,zeroRight:U};var Z=n(6377),H=n(5219),q={left:0,top:0,right:0,gap:0},G=function(e){return parseInt(e||"",10)||0},$=function(e){var t=window.getComputedStyle(document.body),n=t["padding"===e?"paddingLeft":"marginLeft"],r=t["padding"===e?"paddingTop":"marginTop"],o=t["padding"===e?"paddingRight":"marginRight"];return[G(n),G(r),G(o)]},J=function(e){if(void 0===e&&(e="margin"),"undefined"==typeof window)return q;var t=$(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Q=(0,H.T0)(),ee="data-scroll-locked",et=function(e,t,n,r){var o=e.left,i=e.top,a=e.right,l=e.gap;return void 0===n&&(n="margin"),"\n  .".concat("with-scroll-bars-hidden"," {\n   overflow: hidden ").concat(r,";\n   padding-right: ").concat(l,"px ").concat(r,";\n  }\n  body[").concat(ee,"] {\n    overflow: hidden ").concat(r,";\n    overscroll-behavior: contain;\n    ").concat([t&&"position: relative ".concat(r,";"),"margin"===n&&"\n    padding-left: ".concat(o,"px;\n    padding-top: ").concat(i,"px;\n    padding-right: ").concat(a,"px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(l,"px ").concat(r,";\n    "),"padding"===n&&"padding-right: ".concat(l,"px ").concat(r,";")].filter(Boolean).join(""),"\n  }\n  \n  .").concat(U," {\n    right: ").concat(l,"px ").concat(r,";\n  }\n  \n  .").concat(K," {\n    margin-right: ").concat(l,"px ").concat(r,";\n  }\n  \n  .").concat(U," .").concat(U," {\n    right: 0 ").concat(r,";\n  }\n  \n  .").concat(K," .").concat(K," {\n    margin-right: 0 ").concat(r,";\n  }\n  \n  body[").concat(ee,"] {\n    ").concat("--removed-body-scroll-bar-size",": ").concat(l,"px;\n  }\n")},en=function(){var e=parseInt(document.body.getAttribute(ee)||"0",10);return isFinite(e)?e:0},er=function(){o.useEffect(function(){return document.body.setAttribute(ee,(en()+1).toString()),function(){var e=en()-1;e<=0?document.body.removeAttribute(ee):document.body.setAttribute(ee,e.toString())}},[])},eo=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,i=void 0===r?"margin":r;er();var a=o.useMemo(function(){return J(i)},[i]);return o.createElement(Q,{styles:et(a,!t,i,n?"":"!important")})},ei=!1;if("undefined"!=typeof window)try{var ea=Object.defineProperty({},"passive",{get:function(){return ei=!0,!0}});window.addEventListener("test",ea,ea),window.removeEventListener("test",ea,ea)}catch(e){ei=!1}var el=!!ei&&{passive:!1},eu=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return"hidden"!==n[t]&&!(n.overflowY===n.overflowX&&"TEXTAREA"!==e.tagName&&"visible"===n[t])},ec=function(e,t){var n=t.ownerDocument,r=t;do{if("undefined"!=typeof ShadowRoot&&r instanceof ShadowRoot&&(r=r.host),es(e,r)){var o=ed(e,r);if(o[1]>o[2])return!0}r=r.parentNode}while(r&&r!==n.body);return!1},es=function(e,t){return"v"===e?eu(t,"overflowY"):eu(t,"overflowX")},ed=function(e,t){return"v"===e?[t.scrollTop,t.scrollHeight,t.clientHeight]:[t.scrollLeft,t.scrollWidth,t.clientWidth]},ef=function(e,t,n,r,o){var i,a=(i=window.getComputedStyle(t).direction,"h"===e&&"rtl"===i?-1:1),l=a*r,u=n.target,c=t.contains(u),s=!1,d=l>0,f=0,v=0;do{var p=ed(e,u),m=p[0],h=p[1]-p[2]-a*m;(m||h)&&es(e,u)&&(f+=h,v+=m),u instanceof ShadowRoot?u=u.host:u=u.parentNode}while(!c&&u!==document.body||c&&(t.contains(u)||t===u));return d&&(o&&1>Math.abs(f)||!o&&l>f)?s=!0:!d&&(o&&1>Math.abs(v)||!o&&-l>v)&&(s=!0),s},ev=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},ep=function(e){return[e.deltaX,e.deltaY]},em=function(e){return e&&"current"in e?e.current:e},eh=0,eg=[];let ey=(0,Z.m)(Y,function(e){var t=o.useRef([]),n=o.useRef([0,0]),r=o.useRef(),i=o.useState(eh++)[0],a=o.useState(H.T0)[0],l=o.useRef(e);o.useEffect(function(){l.current=e},[e]),o.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(i));var t=(0,B.fX)([e.lockRef.current],(e.shards||[]).map(em),!0).filter(Boolean);return t.forEach(function(e){return e.classList.add("allow-interactivity-".concat(i))}),function(){document.body.classList.remove("block-interactivity-".concat(i)),t.forEach(function(e){return e.classList.remove("allow-interactivity-".concat(i))})}}},[e.inert,e.lockRef.current,e.shards]);var u=o.useCallback(function(e,t){if("touches"in e&&2===e.touches.length||"wheel"===e.type&&e.ctrlKey)return!l.current.allowPinchZoom;var o,i=ev(e),a=n.current,u="deltaX"in e?e.deltaX:a[0]-i[0],c="deltaY"in e?e.deltaY:a[1]-i[1],s=e.target,d=Math.abs(u)>Math.abs(c)?"h":"v";if("touches"in e&&"h"===d&&"range"===s.type)return!1;var f=ec(d,s);if(!f)return!0;if(f?o=d:(o="v"===d?"h":"v",f=ec(d,s)),!f)return!1;if(!r.current&&"changedTouches"in e&&(u||c)&&(r.current=o),!o)return!0;var v=r.current||o;return ef(v,t,e,"h"===v?u:c,!0)},[]),c=o.useCallback(function(e){if(eg.length&&eg[eg.length-1]===a){var n="deltaY"in e?ep(e):ev(e),r=t.current.filter(function(t){var r;return t.name===e.type&&(t.target===e.target||e.target===t.shadowParent)&&(r=t.delta)[0]===n[0]&&r[1]===n[1]})[0];if(r&&r.should){e.cancelable&&e.preventDefault();return}if(!r){var o=(l.current.shards||[]).map(em).filter(Boolean).filter(function(t){return t.contains(e.target)});(o.length>0?u(e,o[0]):!l.current.noIsolation)&&e.cancelable&&e.preventDefault()}}},[]),s=o.useCallback(function(e,n,r,o){var i={name:e,delta:n,target:r,should:o,shadowParent:function(e){for(var t=null;null!==e;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}(r)};t.current.push(i),setTimeout(function(){t.current=t.current.filter(function(e){return e!==i})},1)},[]),d=o.useCallback(function(e){n.current=ev(e),r.current=void 0},[]),f=o.useCallback(function(t){s(t.type,ep(t),t.target,u(t,e.lockRef.current))},[]),v=o.useCallback(function(t){s(t.type,ev(t),t.target,u(t,e.lockRef.current))},[]);o.useEffect(function(){return eg.push(a),e.setCallbacks({onScrollCapture:f,onWheelCapture:f,onTouchMoveCapture:v}),document.addEventListener("wheel",c,el),document.addEventListener("touchmove",c,el),document.addEventListener("touchstart",d,el),function(){eg=eg.filter(function(e){return e!==a}),document.removeEventListener("wheel",c,el),document.removeEventListener("touchmove",c,el),document.removeEventListener("touchstart",d,el)}},[]);var p=e.removeScrollBar,m=e.inert;return o.createElement(o.Fragment,null,m?o.createElement(a,{styles:"\n  .block-interactivity-".concat(i," {pointer-events: none;}\n  .allow-interactivity-").concat(i," {pointer-events: all;}\n")}):null,p?o.createElement(eo,{gapMode:e.gapMode}):null)});var eb=o.forwardRef(function(e,t){return o.createElement(V,(0,B.Cl)({},e,{ref:t,sideCar:ey}))});eb.classNames=V.classNames;var eE=n(5587),ew="Dialog",[eC,eN]=(0,c.A)(ew),[eR,eD]=eC(ew),ex=e=>{let{__scopeDialog:t,children:n,open:r,defaultOpen:i,onOpenChange:a,modal:l=!0}=e,u=o.useRef(null),c=o.useRef(null),[f=!1,p]=(0,d.i)({prop:r,defaultProp:i,onChange:a});return(0,v.jsx)(eR,{scope:t,triggerRef:u,contentRef:c,contentId:(0,s.B)(),titleId:(0,s.B)(),descriptionId:(0,s.B)(),open:f,onOpenChange:p,onOpenToggle:o.useCallback(()=>p(e=>!e),[p]),modal:l,children:n})};ex.displayName=ew;var eT="DialogTrigger",eL=o.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=eD(eT,n),a=u(t,o.triggerRef);return(0,v.jsx)(y.button,{type:"button","aria-haspopup":"dialog","aria-expanded":o.open,"aria-controls":o.contentId,"data-state":eZ(o.open),...r,ref:a,onClick:i(e.onClick,o.onOpenToggle)})});eL.displayName=eT;var eO="DialogPortal",[eP,eS]=eC(eO,{forceMount:void 0}),eI=e=>{let{__scopeDialog:t,forceMount:n,children:r,container:i}=e,a=eD(eO,t);return(0,v.jsx)(eP,{scope:t,forceMount:n,children:o.Children.map(r,e=>(0,v.jsx)(A,{present:n||a.open,children:(0,v.jsx)(F,{asChild:!0,container:i,children:e})}))})};eI.displayName=eO;var eM="DialogOverlay",ek=o.forwardRef((e,t)=>{let n=eS(eM,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,i=eD(eM,e.__scopeDialog);return i.modal?(0,v.jsx)(A,{present:r||i.open,children:(0,v.jsx)(ej,{...o,ref:t})}):null});ek.displayName=eM;var ej=o.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=eD(eM,n);return(0,v.jsx)(eb,{as:p,allowPinchZoom:!0,shards:[o.contentRef],children:(0,v.jsx)(y.div,{"data-state":eZ(o.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),eF="DialogContent",eA=o.forwardRef((e,t)=>{let n=eS(eF,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,i=eD(eF,e.__scopeDialog);return(0,v.jsx)(A,{present:r||i.open,children:i.modal?(0,v.jsx)(eW,{...o,ref:t}):(0,v.jsx)(e_,{...o,ref:t})})});eA.displayName=eF;var eW=o.forwardRef((e,t)=>{let n=eD(eF,e.__scopeDialog),r=o.useRef(null),a=u(t,n.contentRef,r);return o.useEffect(()=>{let e=r.current;if(e)return(0,eE.Eq)(e)},[]),(0,v.jsx)(eB,{...e,ref:a,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:i(e.onCloseAutoFocus,e=>{var t;e.preventDefault(),null===(t=n.triggerRef.current)||void 0===t||t.focus()}),onPointerDownOutside:i(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,n=0===t.button&&!0===t.ctrlKey;(2===t.button||n)&&e.preventDefault()}),onFocusOutside:i(e.onFocusOutside,e=>e.preventDefault())})}),e_=o.forwardRef((e,t)=>{let n=eD(eF,e.__scopeDialog),r=o.useRef(!1),i=o.useRef(!1);return(0,v.jsx)(eB,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var o,a;null===(o=e.onCloseAutoFocus)||void 0===o||o.call(e,t),t.defaultPrevented||(r.current||null===(a=n.triggerRef.current)||void 0===a||a.focus(),t.preventDefault()),r.current=!1,i.current=!1},onInteractOutside:t=>{var o,a;null===(o=e.onInteractOutside)||void 0===o||o.call(e,t),t.defaultPrevented||(r.current=!0,"pointerdown"!==t.detail.originalEvent.type||(i.current=!0));let l=t.target;(null===(a=n.triggerRef.current)||void 0===a?void 0:a.contains(l))&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&i.current&&t.preventDefault()}})}),eB=o.forwardRef((e,t)=>{let{__scopeDialog:n,trapFocus:r,onOpenAutoFocus:i,onCloseAutoFocus:a,...l}=e,c=eD(eF,n),s=o.useRef(null),d=u(t,s);return(0,_.Oh)(),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(O,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:i,onUnmountAutoFocus:a,children:(0,v.jsx)(N,{role:"dialog",id:c.contentId,"aria-describedby":c.descriptionId,"aria-labelledby":c.titleId,"data-state":eZ(c.open),...l,ref:d,onDismiss:()=>c.onOpenChange(!1)})}),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(e$,{titleId:c.titleId}),(0,v.jsx)(eJ,{contentRef:s,descriptionId:c.descriptionId})]})]})}),eU="DialogTitle",eK=o.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=eD(eU,n);return(0,v.jsx)(y.h2,{id:o.titleId,...r,ref:t})});eK.displayName=eU;var eX="DialogDescription",eY=o.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=eD(eX,n);return(0,v.jsx)(y.p,{id:o.descriptionId,...r,ref:t})});eY.displayName=eX;var ez="DialogClose",eV=o.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=eD(ez,n);return(0,v.jsx)(y.button,{type:"button",...r,ref:t,onClick:i(e.onClick,()=>o.onOpenChange(!1))})});function eZ(e){return e?"open":"closed"}eV.displayName=ez;var eH="DialogTitleWarning",[eq,eG]=(0,c.q)(eH,{contentName:eF,titleName:eU,docsSlug:"dialog"}),e$=e=>{let{titleId:t}=e,n=eG(eH),r="`".concat(n.contentName,"` requires a `").concat(n.titleName,"` for the component to be accessible for screen reader users.\n\nIf you want to hide the `").concat(n.titleName,"`, you can wrap it with our VisuallyHidden component.\n\nFor more information, see https://radix-ui.com/primitives/docs/components/").concat(n.docsSlug);return o.useEffect(()=>{t&&!document.getElementById(t)&&console.error(r)},[r,t]),null},eJ=e=>{let{contentRef:t,descriptionId:n}=e,r=eG("DialogDescriptionWarning"),i="Warning: Missing `Description` or `aria-describedby={undefined}` for {".concat(r.contentName,"}.");return o.useEffect(()=>{var e;let r=null===(e=t.current)||void 0===e?void 0:e.getAttribute("aria-describedby");n&&r&&!document.getElementById(n)&&console.warn(i)},[i,t,n]),null},eQ=ex,e0=eL,e1=eI,e2=ek,e5=eA,e6=eK,e7=eY,e8=eV},6195:(e,t,n)=>{n.d(t,{b:()=>l});var r=n(2115),o=n(3360),i=n(5155),a=r.forwardRef((e,t)=>(0,i.jsx)(o.sG.label,{...e,ref:t,onMouseDown:t=>{var n;t.target.closest("button, input, select, textarea")||(null===(n=e.onMouseDown)||void 0===n||n.call(e,t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));a.displayName="Label";var l=a}}]);