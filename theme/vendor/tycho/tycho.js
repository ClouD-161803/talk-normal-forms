/*! TyCHO runtime 0.3.0, Apache-2.0, https://github.com/beeson-group/tycho
 * This bundle contains:
 * mp4-muxer 5.2.2, MIT, Copyright 2023 Vanilagy, https://github.com/Vanilagy/mp4-muxer
 * three 0.187.0, MIT, Copyright 2010-2026 three.js authors, https://github.com/mrdoob/three.js
 * Full license texts: https://github.com/beeson-group/tycho/blob/main/THIRD_PARTY_NOTICES.md */
"use strict";var tycho=(()=>{var dh=Object.defineProperty;var fb=Object.getOwnPropertyDescriptor;var pb=Object.getOwnPropertyNames;var mb=Object.prototype.hasOwnProperty;var gb=(n,e)=>{for(var t in e)dh(n,t,{get:e[t],enumerable:!0})},yb=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of pb(e))!mb.call(n,r)&&r!==t&&dh(n,r,{get:()=>e[r],enumerable:!(i=fb(e,r))||i.enumerable});return n};var bb=n=>yb(dh({},"__esModule",{value:!0}),n);var nA={};gb(nA,{Container:()=>xs,DATA_VERSION:()=>ys,EXPORT_LIMITS:()=>md,SCENE_MAJOR:()=>Nr,SCENE_MINOR:()=>Mo,TychoError:()=>pn,TychoViewerElement:()=>Ka,colormap:()=>Oi,colormapCss:()=>tm,decodeEmbedded:()=>tl,define:()=>ch,evaluate:()=>em,exportVideo:()=>tA,formatNumber:()=>Wt,sizePreset:()=>Yo,validate:()=>Ml});var pn=class extends Error{rule;constructor(e,t){super(`[${e}] ${t}`),this.name="TychoError",this.rule=e}};function M(n,e){throw new pn(n,e)}var ys=2,xb=[84,89,67,68],_o=12,wp={raw:new Set(["dtype","shape","encoding","offset","length"]),"shuffle-delta-deflate":new Set(["dtype","shape","encoding","chunk_rows","chunks"])},vs={int8:Int8Array,uint8:Uint8Array,int16:Int16Array,uint16:Uint16Array,int32:Int32Array,uint32:Uint32Array,float32:Float32Array,float64:Float64Array},Ep=new Uint8Array(new Uint16Array([1]).buffer)[0]===1;function vb(n){return typeof n=="string"&&Object.hasOwn(vs,n)}function bs(n){return vs[n].BYTES_PER_ELEMENT}var So=n=>Number.isSafeInteger(n)&&n>=0,fh=n=>n!==null&&typeof n=="object"&&!Array.isArray(n);function _b(n,e,t,i){let r=new vs[i](t),s=bs(i),o={int8:a=>n.getInt8(a),uint8:a=>n.getUint8(a),int16:a=>n.getInt16(a,!0),uint16:a=>n.getUint16(a,!0),int32:a=>n.getInt32(a,!0),uint32:a=>n.getUint32(a,!0),float32:a=>n.getFloat32(a,!0),float64:a=>n.getFloat64(a,!0)}[i];for(let a=0;a<t;a++)r[a]=o(e+a*s);return r}async function Sb(n,e,t){let i=e.length,r=new DecompressionStream("deflate"),s=r.writable.getWriter();s.write(n).catch(()=>{}),s.close().catch(()=>{});let o=r.readable.getReader(),a=0;try{for(;;){let{done:l,value:c}=await o.read();if(l)break;a+c.length>i&&(o.cancel().catch(()=>{}),M("shuffle-delta-deflate",`${t} inflates to more than the ${i} bytes of its rows`)),e.set(c,a),a+=c.length}}catch(l){if(l instanceof pn)throw l;let c=l.message;M("shuffle-delta-deflate",`${t} does not inflate${c?`: ${c}`:""}`)}a!==i&&M("shuffle-delta-deflate",`${t} inflates to ${a} bytes, not the ${i} of its rows`)}function Mb(n,e,t,i,r,s){let o=e*t;if(i===1){let a=new Uint8Array(r,s,o);a.set(n.subarray(0,Math.min(t,o)));for(let l=t;l<o;l++)a[l]=n[l]+a[l-t]}else if(i===2){let a=new Uint16Array(r,s,o);for(let l=0;l<o;l++){let c=n[l]|n[o+l]<<8;a[l]=l<t?c:c+a[l-t]}}else if(i===4){let a=new Uint32Array(r,s,o),l=2*o,c=3*o;for(let u=0;u<o;u++){let h=(n[u]|n[o+u]<<8|n[l+u]<<16|n[c+u]<<24)>>>0;a[u]=u<t?h:h+a[u-t]}}else{let a=new Uint32Array(r,s,2*o),l=Ep?0:1,c=1-l;for(let u=0;u<o;u++){let h=(n[u]|n[o+u]<<8|n[2*o+u]<<16|n[3*o+u]<<24)>>>0,f=(n[4*o+u]|n[5*o+u]<<8|n[6*o+u]<<16|n[7*o+u]<<24)>>>0;if(u>=t){let d=2*(u-t);h+=a[d+l],f+=a[d+c]+(h>4294967295?1:0)}a[2*u+l]=h,a[2*u+c]=f}}}function wb(n){return Math.min(n.chunk_rows,n.shape[0])*n.shape.slice(1).reduce((e,t)=>e*t,1)*bs(n.dtype)}async function Eb(n,e,t,i){let r=bs(e.dtype),s=e.shape[0],o=e.shape.slice(1).reduce((l,c)=>l*c,1),a=new ArrayBuffer(s*o*r);for(let[l,[c,u]]of e.chunks.entries()){let h=l*e.chunk_rows,f=Math.min(e.chunk_rows,s-h),d=i.subarray(0,f*o*r);await Sb(t.subarray(c,c+u),d,`chunk ${l} of array ${n}`),Mb(d,f,o,r,a,h*o*r)}return new vs[e.dtype](a,0,s*o)}function Tb(n,e,t){fh(e)||M("container",`array ${n} is not an object`);let i=typeof e.encoding=="string"&&Object.hasOwn(wp,e.encoding)?wp[e.encoding]:null;i===null&&M("array-keys",`array ${n} has encoding ${JSON.stringify(e.encoding)}, which this reader does not know`);let r=Object.keys(e).filter(u=>!i.has(u));r.length>0&&M("array-keys",`array ${n} has keys ${r.sort().join(", ")} that this reader does not know`);let s=[...i].filter(u=>!Object.hasOwn(e,u));s.length>0&&M("array-keys",`array ${n} lacks the keys ${s.join(", ")}`),vb(e.dtype)||M("array-dtype",`array ${n} has dtype ${JSON.stringify(e.dtype)}, not one of ${Object.keys(vs).join(", ")}`);let o=e.shape;(!Array.isArray(o)||o.length===0||!o.every(So))&&M("array-keys",`array ${n} has shape ${JSON.stringify(o)}, not a nonempty list of counts`);let a=o.reduce((u,h)=>u*h,1)*bs(e.dtype);if(Number.isSafeInteger(a)||M("array-keys",`array ${n} has shape [${o.join(", ")}], which is too large`),e.encoding==="raw"){(!So(e.offset)||!So(e.length))&&M("array-keys",`array ${n} has an offset or a length that is not a count`),e.offset%8!==0&&M("array-keys",`array ${n} starts at byte ${e.offset}, which is not a multiple of 8`),e.length!==a&&M("array-keys",`array ${n} has length ${e.length}, while shape [${o.join(", ")}] of ${e.dtype} takes ${a} bytes`),e.offset+e.length>t&&M("array-keys",`array ${n} runs past the end of the file, at bytes ${e.offset} to ${e.offset+e.length} of the payload`);return}let l=e.chunk_rows;(!So(l)||l<1)&&M("shuffle-delta-deflate",`array ${n} has chunk_rows ${JSON.stringify(l)}, not a positive integer`),Array.isArray(e.chunks)||M("shuffle-delta-deflate",`the chunks of array ${n} are not a list`);let c=Math.ceil(o[0]/l);e.chunks.length!==c&&M("shuffle-delta-deflate",`array ${n} has ${e.chunks.length} chunks, while ${o[0]} rows in chunks of ${l} take ${c}`),e.chunks.forEach((u,h)=>{(!Array.isArray(u)||u.length!==2||!u.every(So))&&M("shuffle-delta-deflate",`chunk ${h} of array ${n} is not an [offset, length] pair of counts`),u[0]+u[1]>t&&M("shuffle-delta-deflate",`chunk ${h} of array ${n} runs past the end of the file`)})}var xs=class n{header;bytes;payloadStart;cache=new Map;constructor(e,t,i){this.header=e,this.bytes=t,this.payloadStart=i}static async parse(e){let t=ArrayBuffer.isView(e)?new DataView(e.buffer,e.byteOffset,e.byteLength):new DataView(e),i=t.byteLength;(i<_o||xb.some((h,f)=>t.getUint8(f)!==h))&&M("container",'the bytes are not a TyCHO data container, since they lack the 12-byte preamble that starts with the magic "TYCD"');let r=t.getUint32(4,!0);r!==ys&&M("container-version",`data container version ${r} is not supported, since this reader reads only version ${ys}`);let s=t.getUint32(8,!0);_o+s>i&&M("container",`the header length ${s} runs past the end of the file`);let o;try{let h=new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0}).decode(new Uint8Array(t.buffer,t.byteOffset+_o,s));o=JSON.parse(h)}catch(h){M("container",`the header is not JSON: ${h.message}`)}(o===null||typeof o!="object")&&M("container","the header is not a JSON object"),o.format!=="tycho-data"&&M("container",`header format is ${JSON.stringify(o.format)}, not "tycho-data"`),o.version!==ys&&M("container-version",`header version ${JSON.stringify(o.version)} is not supported, since this reader reads only version ${ys}`),o.generator!==void 0&&typeof o.generator!="string"&&M("container","the header generator is not a string"),o.meta!==void 0&&!fh(o.meta)&&M("container","the header meta is not an object"),fh(o.arrays)||M("container",'the header lacks an "arrays" object');let a=_o+s+(8-(_o+s)%8)%8,l=Math.max(0,i-a);for(let[h,f]of Object.entries(o.arrays))Tb(h,f,l);let c=new n(o,t,a),u=Object.entries(o.arrays).filter(h=>h[1].encoding==="shuffle-delta-deflate");if(u.length>0){typeof DecompressionStream>"u"&&M("shuffle-delta-deflate","this runtime lacks DecompressionStream, which encoded arrays need");let h=new Uint8Array(t.buffer,t.byteOffset+a,l),f=new Uint8Array(Math.max(...u.map(([,d])=>wb(d))));for(let[d,p]of u){let g=await Eb(d,p,h,f);c.cache.set(d,{name:d,dtype:p.dtype,shape:[...p.shape],data:g})}}return c}has(e){return Object.hasOwn(this.header.arrays,e)}names(){return Object.keys(this.header.arrays)}array(e){let t=this.cache.get(e);if(t)return t;this.has(e)||M("trajectory-set",`the data container lacks array ${JSON.stringify(e)}`);let i=this.header.arrays[e],r=i.length/bs(i.dtype),s=this.bytes.byteOffset+this.payloadStart+i.offset,o=Ep&&s%bs(i.dtype)===0?new vs[i.dtype](this.bytes.buffer,s,r):_b(this.bytes,this.payloadStart+i.offset,r,i.dtype),a={name:e,dtype:i.dtype,shape:[...i.shape],data:o};return this.cache.set(e,a),a}};function Ab(n){let e=atob(n.replace(/\s+/g,"")),t=new Uint8Array(new ArrayBuffer(e.length));for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return t}function tl(n,e="base64"){return e!=="base64"&&M("container",`data encoding ${e} is not base64`),Ab(n)}var Nr=0,Mo=6,Tp=new Set(["frames.origin_channel","layers.arrows","layers.read_from","layers.inset_box","clock.keyframes","layers.clock","camera.keyframes","camera.keyframes_3d","layers.label","layers.points","inputs.number","inputs.points_2d","layers.morph","layers.surface","controls.action"]),Ap=new Set(["format","version","requires","generator","title","theme","frames","bodies","trajectory_sets","inputs","clock","panels","controls","readouts","initial","steps","overlays"]),nl=/^[A-Za-z0-9_.-]+$/,mt="@index",ki="@index";var wo=8,ph=["linear","smooth","in","out","in-out","hold"];function Ot(n){return n.seconds??wo*(n.revolutions??1)}function Ht(n,e){return e*Ot(n)}function mh(n,e){switch(n??"linear"){case"linear":return e;case"smooth":return e*e*(3-2*e);case"in":return e*e*e;case"out":{let t=1-e;return 1-t*t*t}case"in-out":{if(e<.5)return 4*e*e*e;let t=2-2*e;return 1-t*t*t/2}case"hold":return 0;default:return M("ease",`the ease ${JSON.stringify(n)} is not one of ${ph.join(", ")}`)}}function _i(n,e,t=i=>typeof i=="number"&&Number.isFinite(i)){(!Array.isArray(n)||n.length===0)&&M("keyframes",`${e} has keyframes ${JSON.stringify(n)}, not a list of at least one keyframe`);let i=-1/0;for(let r of n){(!Array.isArray(r)||r.length<2||r.length>3)&&M("keyframes",`${e} has a keyframe ${JSON.stringify(r)}, not [t, v] or [t, v, ease]`);let s=r[0];(typeof s!="number"||!Number.isFinite(s))&&M("keyframes",`${e} has a keyframe at ${JSON.stringify(s)}, not a finite time`),s<i&&M("keyframes",`${e} has keyframes whose times decrease, from ${i} to ${s}`),i=s,t(r[1])||M("keyframes",`${e} has a keyframe whose value is ${JSON.stringify(r[1])}`),r.length===3&&(typeof r[2]!="string"||!ph.includes(r[2]))&&M("ease",`${e} has a keyframe whose ease is ${JSON.stringify(r[2])}, not one of ${ph.join(", ")}`)}return n}function gh(n,e,t,i){let r=-1,s=0,o=e-1;for(;s<=o;){let l=s+o>>1;n(l)<=t?(r=l,s=l+1):o=l-1}if(r<0)return{i:0,e:null};if(r===e-1)return{i:r,e:null};let a=(t-n(r))/(n(r+1)-n(r));return{i:r,e:mh(i(r+1),a)}}function _s(n,e){let{i:t,e:i}=gh(s=>n[s][0],n.length,e,s=>n[s][2]),r=n[t][1];return i===null?r:r+i*(n[t+1][1]-r)}function Eo(n,e,t){return n===void 0?t:typeof n=="number"?n:_s(n.keyframes,e)}function lt(n,e,t=1){return Math.min(1,Math.max(0,Eo(n,e,t)))}function To(n,e,t){return Math.max(0,Eo(n,e,t))}function vt(n,e,t,i="panel"){if(n!==void 0){if(typeof n=="number"){t(n)||M(i,`${e} is ${n}`);return}(n===null||typeof n!="object"||!("keyframes"in n))&&M(i,`${e} is ${JSON.stringify(n)}, not a number or {keyframes}`),_i(n.keyframes,e,t)}}var Et=n=>typeof n=="number"&&n>=0&&n<=1,il=n=>typeof n=="number"&&n>=0&&n<=1,Di=n=>typeof n=="number"&&Number.isFinite(n)&&n>0;function rl(n,e){if(n.keyframes!==void 0)return n.range!==void 0&&M("clock-keyframes","the clock has both a range and keyframes"),_s(n.keyframes,Ht(n,e));n.range===void 0&&M("clock-mode","the clock is in epoch mode but does not have a range of two numbers or keyframes");let[t,i]=n.range;return t+e*(i-t)}function Ss(n){return n.plane==="xz"?[0,2]:n.plane==="yz"?[1,2]:[0,1]}function Cp(n,e,t){let{i,e:r}=gh(u=>n[u].at,n.length,e,u=>n[u].ease),s=n[i],o=t(i);if(o===null)return null;if(r===null)return{center:o,width:s.width,height:s.height??null};let a=n[i+1],l=t(i+1);if(l===null)return null;let c=(u,h)=>Math.exp((1-r)*Math.log(u)+r*Math.log(h));return{center:[(1-r)*o[0]+r*l[0],(1-r)*o[1]+r*l[1]],width:c(s.width,a.width),height:s.height!==void 0&&a.height!==void 0?c(s.height,a.height):null}}function sl(n,e,t){(!Array.isArray(n)||n.length===0)&&M("camera-keyframes",`${t} has keyframes ${JSON.stringify(n)}, not a list of at least one camera keyframe`);let i=-1/0,r=0;for(let s of n){(s===null||typeof s!="object")&&M("camera-keyframes",`${t} has a keyframe ${JSON.stringify(s)}, not an object`),(typeof s.at!="number"||!Number.isFinite(s.at))&&M("camera-keyframes",`${t} has a keyframe at ${JSON.stringify(s.at)}, not a finite time`),s.at<i&&M("camera-keyframes",`${t} has keyframes whose times decrease, from ${i} to ${s.at}`),i=s.at,Di(s.width)||M("camera-keyframes",`${t} has a keyframe of width ${JSON.stringify(s.width)}, not a positive number`),s.height!==void 0&&(e||M("camera-keyframes",`${t} has a keyframe with a height, which only a camera of free aspect takes`),Di(s.height)||M("camera-keyframes",`${t} has a keyframe of height ${JSON.stringify(s.height)}, not a positive number`),r++);for(let o of[s.center,s.offset])o!==void 0&&!(Array.isArray(o)&&o.length===2&&o.every(a=>typeof a=="number"&&Number.isFinite(a)))&&M("camera-keyframes",`${t} has a keyframe whose center or offset is ${JSON.stringify(o)}, not two finite numbers`);if(s.follow===void 0&&s.center===void 0&&M("camera-keyframes",`${t} has a keyframe with neither a center nor follow targets`),s.follow!==void 0){(!Array.isArray(s.follow)||s.follow.length===0)&&M("camera-keyframes",`${t} has a keyframe whose follow is not a list of targets`);for(let o of s.follow)(o===null||typeof o!="object"||!Number.isInteger(o.layer)||o.layer<0||!Number.isInteger(o.member)||o.member<0)&&M("camera-keyframes",`${t} has a follow target ${JSON.stringify(o)}, not {layer, member} of two nonnegative integers`)}s.ease!==void 0&&mh(s.ease,0)}r!==0&&r!==n.length&&M("camera-keyframes",`${t} gives a height in some keys but not in all`)}function Rp(n,e){let{i:t,e:i}=gh(l=>n[l].at,n.length,e,l=>n[l].ease),r=n[t],s=l=>({center:[l.center[0],l.center[1],l.center[2]],width:l.width,azimuth:l.azimuth,elevation:l.elevation});if(i===null)return s(r);let o=n[t+1],a=(l,c)=>(1-i)*l+i*c;return{center:[a(r.center[0],o.center[0]),a(r.center[1],o.center[1]),a(r.center[2],o.center[2])],width:Math.exp(a(Math.log(r.width),Math.log(o.width))),azimuth:a(r.azimuth,o.azimuth),elevation:a(r.elevation,o.elevation)}}function Pp(n,e){let t="camera-keyframes-3d";(!Array.isArray(n)||n.length===0)&&M(t,`${e} has keyframes ${JSON.stringify(n)}, not a list of at least one camera keyframe`);let i=s=>typeof s=="number"&&Number.isFinite(s),r=-1/0;for(let s of n)(s===null||typeof s!="object")&&M(t,`${e} has a keyframe ${JSON.stringify(s)}, not an object`),i(s.at)||M(t,`${e} has a keyframe at ${JSON.stringify(s.at)}, not a finite time`),s.at<r&&M(t,`${e} has keyframes whose times decrease, from ${r} to ${s.at}`),r=s.at,Di(s.width)||M(t,`${e} has a keyframe of width ${JSON.stringify(s.width)}, not a positive number`),(!Array.isArray(s.center)||s.center.length!==3||!s.center.every(i))&&M(t,`${e} has a keyframe whose center is ${JSON.stringify(s.center)}, not three finite numbers`),i(s.azimuth)||M(t,`${e} has a keyframe whose azimuth is ${JSON.stringify(s.azimuth)}, not a finite number of degrees`),(!i(s.elevation)||Math.abs(s.elevation)>90)&&M(t,`${e} has a keyframe whose elevation is ${JSON.stringify(s.elevation)}, not a number of degrees in [-90, 90]`),s.ease!==void 0&&mh(s.ease,0)}function Ip(n,e){return Number.isInteger(e)||M("clock",`the frame index ${String(e)} is not an integer`),(!Number.isInteger(n)||n<1)&&M("clock",`the clock has frame_count ${String(n)}, not a count of at least one`),(e%n+n)%n/n}var Si=class{m;c0;c1;u;constructor(e,t,i){let r=e.count(t);if(this.m=r,this.u=new Float64Array(r),i===mt){this.c0=0,this.c1=r-1;for(let l=0;l<r;l++)this.u[l]=l/(r-1);return}let s=e.channel(i,"clock-channel-carried"),o=e.start(t);this.c0=s[o],this.c1=s[o+r-1];let a=Math.sign(s[o+1]-s[o]);for(let l=0;l<r;l++)(!Number.isFinite(s[o+l])||l>0&&!((s[o+l]-s[o+l-1])*a>0))&&M("monotone-clock-channel",`clock channel ${i} of trajectory set ${e.id} is not both finite and strictly monotone along trajectory ${t}`);Number.isFinite(this.c1-this.c0)||M("monotone-clock-channel",`clock channel ${i} of trajectory set ${e.id} has an infinite span along trajectory ${t}`);for(let l=0;l<r;l++)this.u[l]=(s[o+l]-this.c0)/(this.c1-this.c0)}at(e){return this.u[e]}reading(e,t){return e.mode==="fraction"?t:(rl(e,t)-this.c0)/(this.c1-this.c0)}locate(e){let t=0,i=this.m-2;for(;t<i;){let s=t+i+1>>1;this.u[s]<=e?t=s:i=s-1}let r=t;return{k:r,w:(e-this.u[r])/(this.u[r+1]-this.u[r])}}};function Vt(n){return n.revolutions===void 0?1:(n.mode==="epoch"&&M("revolutions","the clock is in epoch mode but has revolutions"),(!Number.isInteger(n.revolutions)||n.revolutions<1)&&M("revolutions",`the clock has revolutions ${String(n.revolutions)}, not an integer of at least one`),n.revolutions)}function wn(n,e){let t=Math.min(Math.floor(n),e-1);return{revolution:t,u:n-t}}function oi(n,e="clamp",t="clamp"){return n<0?e==="hidden"?null:0:n>1?t==="hidden"?null:1:n}var Lp=new WeakMap;function Ao(n,e){let t=e!==null&&typeof e=="object"?Lp.get(e):void 0;if(t!==void 0&&t.frame_count===n.frame_count&&t.seconds===Ot(n))return t;(e===null||typeof e!="object"||typeof e.channel!="string")&&M("layer-clock",`a layer's clock is ${JSON.stringify(e)}, not {channel, range} or {channel, keyframes}`);let i=e.range!==void 0,r=e.keyframes!==void 0;i===r&&M("layer-clock",`the clock of a layer on channel ${e.channel} has ${i?"both a range and keyframes":"neither a range nor keyframes"}`),i&&!(Array.isArray(e.range)&&e.range.length===2&&e.range.every(o=>typeof o=="number"&&Number.isFinite(o)))&&M("layer-clock",`the clock of a layer on channel ${e.channel} has range ${JSON.stringify(e.range)}, not two finite numbers`),r&&_i(e.keyframes,`the clock of a layer on channel ${e.channel}`);let s={mode:"epoch",channels:[e.channel],frame_count:n.frame_count,seconds:Ot(n)};return i?s.range=[e.range[0],e.range[1]]:s.keyframes=e.keyframes,Lp.set(e,s),s}function nr(n,e){return typeof n=="number"?(Number.isFinite(n)||M("finite-number",`a scalar is ${n}, not finite`),n):((n===null||typeof n!="object")&&M("context-number",`${JSON.stringify(n)} is not a scalar`),"attr"in n?(n.factor??1)*e.set.attr(n.attr)+(n.offset??0):(n.channel===mt&&M("context-number",`${mt} is not allowed in a frame edge`),e.set.channelAt(n.channel,e.trajectory,e.sample,e.shifted,e.revolution??0)))}function yh(n,e,t=!1){if((!Array.isArray(n)||n.length!==3)&&M("origin",`${e} is three scalars, not ${JSON.stringify(n)}`),!t)for(let i of n)i!==null&&typeof i=="object"&&"channel"in i&&M("origin",`${e} takes a number or an attribute, not a channel`);return n}function kp(n,e,t,i){let r=Math.cos(t),s=i?-Math.sin(t):Math.sin(t),[o,a,l]=n;return e==="z"?[r*o-s*a,s*o+r*a,l]:e==="x"?[o,r*a-s*l,s*a+r*l]:[r*o+s*l,a,-s*o+r*l]}var bh=class{frames;depth=new Map;paths=new Map;root;constructor(e){this.frames=e;let t=Object.keys(e),i=t.filter(s=>e[s].parent===void 0);i.length!==1&&M("frame",`the frames have ${i.length} roots, not one: ${JSON.stringify(i)}`),this.root=i[0];let r=e[this.root];(r.origin!==void 0||r.rotation!==void 0||r.scale!==void 0)&&M("frame",`the root frame ${this.root} has an origin, a rotation, or a scale`);for(let s of t){let o=e[s].scale;(o===0||o!==void 0&&typeof o=="object"&&"attr"in o&&(o.factor??1)===0&&(o.offset??0)===0)&&M("origin",`the scale of frame ${s} is zero`)}for(let s of t){let o=0;for(let a=s;a!==this.root;o++){let l=e[a].parent;(l===void 0||!Object.hasOwn(e,l))&&M("frame",`the parent ${l} of frame ${a} is not declared`),o>t.length&&M("frame",`the parents of frame ${s} form a cycle`),a=l}this.depth.set(s,o)}}has(e){return this.depth.has(e)}frame(e){return this.has(e)||M("frame",`frame ${JSON.stringify(e)} is not declared`),this.frames[e]}inSubtree(e,t){for(let i=e;i!==void 0;i=this.frames[i].parent)if(i===t)return!0;return!1}path(e,t){let i=this.paths.get(e),r=i?.get(t);if(r!==void 0)return r;this.frame(e),this.frame(t);let s=[],o=[],a=e,l=t;for(;this.depth.get(a)>this.depth.get(l);)s.push(a),a=this.frames[a].parent;for(;this.depth.get(l)>this.depth.get(a);)o.push(l),l=this.frames[l].parent;for(;a!==l;)s.push(a),o.push(l),a=this.frames[a].parent,l=this.frames[l].parent;let c={up:s,down:o.reverse()};return i===void 0&&this.paths.set(e,i=new Map),i.set(t,c),c}},ol=(n,e)=>{n===void 0||typeof n=="number"||("attr"in n?e.attrs.add(n.attr):e.channels.add(n.channel))},ir=class{tree;scene;active=new Set;edges=new Map;bodies=new Map;constructor(e){this.scene=e,this.tree=new bh(e.frames);for(let t of Object.keys(e.frames))this.requirements(t,this.tree.root)}body(e){let t=this.bodies.get(e);if(t!==void 0)return t;let i=this.scene.bodies??{};Object.hasOwn(i,e)||M("body",`body ${JSON.stringify(e)} is not declared`);let r=i[e];return Object.hasOwn(this.scene.frames,r.frame)||M("body",`body ${e} is in frame ${JSON.stringify(r.frame)}, which is not declared`),yh(r.position,`the position of body ${e}`),this.bodies.set(e,r),r}edgeOf(e){let t=this.edges.get(e);if(t===void 0){let i=this.tree.frame(e),r=Array.isArray(i.origin)?yh(i.origin,`the origin of frame ${e}`,!0):i.origin;t={parent:i.parent,origin:r,rotation:i.rotation,scale:i.scale},this.edges.set(e,t)}return t}transform(e,t,i,r){let{up:s,down:o}=this.tree.path(t,i),a=e;for(let l of s)a=this.edge(l,a,r,!0);for(let l of o)a=this.edge(l,a,r,!1);return a}bodyPosition(e,t,i){let r=this.body(e),s=r.position.map(o=>nr(o,i));return this.transform(s,r.frame,t,i)}edge(e,t,i,r){let s=this.edgeOf(e),o=[0,0,0];if(Array.isArray(s.origin))o=[nr(s.origin[0],i),nr(s.origin[1],i),nr(s.origin[2],i)];else if(s.origin!==void 0){this.active.has(e)&&M("body-origin-cycle",`the origin of frame ${e} depends on itself`),this.active.add(e);try{o=this.bodyPosition(s.origin.body,s.parent,i)}finally{this.active.delete(e)}}let a=s.scale===void 0?1:nr(s.scale,i);a===0&&M("origin",`the scale of frame ${e} is zero`);let l=s.rotation,c=l===void 0?0:nr(l.angle,i);if(!r){let h=[t[0]-o[0],t[1]-o[1],t[2]-o[2]];return l!==void 0&&(h=kp(h,l.axis,c,!1)),[a*h[0],a*h[1],a*h[2]]}let u=[t[0]/a,t[1]/a,t[2]/a];return l!==void 0&&(u=kp(u,l.axis,c,!0)),[o[0]+u[0],o[1]+u[1],o[2]+u[2]]}requirements(e,t,i={channels:new Set,attrs:new Set}){let{up:r,down:s}=this.tree.path(e,t);for(let o of[...r,...s]){this.active.has(o)&&M("body-origin-cycle",`the origin of frame ${o} depends on itself`),this.active.add(o);try{let a=this.tree.frame(o);Array.isArray(a.origin)?yh(a.origin,`the origin of frame ${o}`,!0).forEach(l=>ol(l,i)):a.origin!==void 0&&this.bodyRequirements(a.origin.body,a.parent,i),ol(a.rotation?.angle,i),ol(a.scale,i)}finally{this.active.delete(o)}}return i}bodyRequirements(e,t,i={channels:new Set,attrs:new Set}){let r=this.body(e);return r.position.forEach(s=>ol(s,i)),this.requirements(r.frame,t,i)}};var ht=(n,e=0)=>({re:n,im:e}),Mi=(n,e)=>({re:n.re+e.re,im:n.im+e.im}),Fr=(n,e)=>({re:n.re-e.re,im:n.im-e.im}),mn=(n,e)=>({re:n.re*e.re-n.im*e.im,im:n.re*e.im+n.im*e.re}),Ur=(n,e)=>({re:n.re*e,im:n.im*e}),Br=n=>Math.hypot(n.re,n.im);function Dp(n,e){if(Math.abs(e.re)>=Math.abs(e.im)){let r=e.im/e.re,s=e.re+r*e.im;return{re:(n.re+n.im*r)/s,im:(n.im-n.re*r)/s}}let t=e.re/e.im,i=e.im+t*e.re;return{re:(n.re*t+n.im)/i,im:(n.im*t-n.re)/i}}function Mh(n){let e=Math.exp(n.re);return{re:e*Math.cos(n.im),im:e*Math.sin(n.im)}}var Or=[1,.5,5/44,1/66,1/792,1/15840,1/665280];function rr(n,e,t,i){let r=(1-t)*i+t,s=t*n*i,o=t*e*i,a=Math.hypot(s,o);if(t<1e-5||a<1e-4){let u=ht(s,o),h=ht(n*i/r,e*i/r),f=Mi(ht(1/6,0),Ur(u,1/24)),d=Mi(ht(.5,0),mn(u,f)),p=Mi(ht(1,0),mn(u,d)),g=mn(h,p);return[t+g.re,g.im]}let l=t*r,c=Mh(ht(s,o));return[t+(c.re-1)/l,c.im/l]}function xh(n){let e=[ht(1,0)];for(let t of n){let i=Array.from({length:e.length+1},()=>ht(0,0));for(let r=0;r<e.length;r++)i[r+1]=Mi(i[r+1],e[r]),i[r]=Fr(i[r],mn(t,e[r]));e=i}return e}function Cb(n){return Array.from({length:n},(e,t)=>Array.from({length:n},(i,r)=>ht(t===r?1:0,0)))}function Co(n,e){let t=n.length,i=Array.from({length:t},()=>Array.from({length:t},()=>ht(0,0)));for(let r=0;r<t;r++)for(let s=0;s<t;s++){let o=n[r][s];if(!(o.re===0&&o.im===0))for(let a=0;a<t;a++)i[r][a]=Mi(i[r][a],mn(o,e[s][a]))}return i}function al(n){let e=n[0].m.length,t=Array.from({length:e},()=>Array.from({length:e},()=>ht(0,0)));for(let{w:i,m:r}of n)for(let s=0;s<e;s++)for(let o=0;o<e;o++)t[s][o].re+=i*r[s][o].re,t[s][o].im+=i*r[s][o].im;return t}function Rb(n,e){let t=n.length,i=n.map(s=>s.map(o=>({...o}))),r=e.map(s=>s.map(o=>({...o})));for(let s=0;s<t;s++){let o=s,a=Br(i[s][s]);for(let c=s+1;c<t;c++){let u=Br(i[c][s]);u>a&&(a=u,o=c)}o!==s&&([i[s],i[o]]=[i[o],i[s]],[r[s],r[o]]=[r[o],r[s]]);let l=i[s][s];for(let c=0;c<t;c++){if(c===s)continue;let u=Dp(i[c][s],l);if(!(u.re===0&&u.im===0)){for(let h=s;h<t;h++)i[c][h]=Fr(i[c][h],mn(u,i[s][h]));for(let h=0;h<t;h++)r[c][h]=Fr(r[c][h],mn(u,r[s][h]))}}}for(let s=0;s<t;s++){let o=i[s][s];for(let a=0;a<t;a++)r[s][a]=Dp(r[s][a],o)}return r}function vh(n){let e=n.length;if(e===0)return[];if(e===1)return[[Mh(n[0][0])]];let t=0;for(let g=0;g<e;g++){let m=0;for(let y=0;y<e;y++)m+=Br(n[y][g]);m>t&&(t=m)}let i=t>.25?Math.max(0,Math.ceil(Math.log2(t/.25))):0,r=2**-i,s=n.map(g=>g.map(m=>Ur(m,r))),o=Cb(e),a=Co(s,s),l=Co(a,a),c=Co(l,a),u=Co(s,al([{w:Or[1],m:o},{w:Or[3],m:a},{w:Or[5],m:l}])),h=al([{w:Or[0],m:o},{w:Or[2],m:a},{w:Or[4],m:l},{w:Or[6],m:c}]),f=al([{w:1,m:h},{w:1,m:u}]),d=al([{w:1,m:h},{w:-1,m:u}]),p=Rb(d,f);for(let g=0;g<i;g++)p=Co(p,p);return p}function Np(n,e,t){let i=n.length;if(i<1)throw new Error("companionSystem requires at least one pole");if(e.length>i)throw new Error("companionSystem requires proper rational F(s) with deg(num) <= deg(den)");let r=xh(n),s=xh(e).map(h=>Ur(h,t)),o=Array.from({length:i+1},(h,f)=>f<s.length?s[f]:ht(0,0)),a=o[i],l=Array.from({length:i},(h,f)=>Fr(o[f],mn(a,r[f]))),c=Array.from({length:i},(h,f)=>Array.from({length:i},(d,p)=>f<i-1?ht(p===f+1?1:0,0):ht(-r[p].re,-r[p].im))),u=Array.from({length:i},(h,f)=>ht(f===i-1?1:0,0));return{mat:c,b:u,c:l,dInf:a}}function _h(n,e){let t=n.length;return Array.from({length:t},(i,r)=>{let s=ht(0,0);for(let o=0;o<t;o++)s=Mi(s,mn(n[r][o],e[o]));return s})}function Sh(n,e){let t=ht(0,0);for(let i=0;i<n.length;i++)t=Mi(t,mn(n[i],e[i]));return t}function ll(n,e,t,i){let r=n.map(([b,_])=>ht(b,_)),s=e.map(([b,_])=>ht(b,_)),o=r.length,{mat:a,b:l,c,dInf:u}=Np(r,s,t),h=vh(a.map(b=>b.map(_=>Ur(_,i)))),f=r.map(b=>Mh(Ur(b,i))),d=xh(f),p=Array.from({length:o+1},()=>ht(0,0));p[0]=mn(u,d[0]);let g=l.map(b=>({...b}));for(let b=0;b<o;b++){let _=Sh(c,g);if(p[o-b]=Mi(mn(u,d[o-b]),_),b+1<o){let x=_h(h,g),S=d[o-1-b];g=x.map((w,v)=>Mi(w,mn(S,l[v])))}}let m=Math.max(...r.map(b=>b.re)),y=Math.exp(m*i);return{sigma_max:m,r_max:y,converges:m<-1e-9,z_poles:f.map(b=>[b.re,b.im]),z_num:p.map(b=>[b.re,b.im]),z_den:d.map(b=>[b.re,b.im])}}function Pb(n,e){let t={...n[n.length-1]};for(let i=n.length-2;i>=0;i--)t=Mi(mn(t,e),n[i]);return t}function Ro(n,e,t,i,r){let s=ht(i,r),o=ht(t,0);for(let[u,h]of e)o=mn(o,Fr(s,ht(u,h)));let a=ht(1,0);for(let[u,h]of n)a=mn(a,Fr(s,ht(u,h)));let l=Br(o),c=Br(a);return c<1e-12*Math.max(1,l)?l<1e-12?0:1e12:l/c}function Po(n,e,t,i){let r=ht(t,i),s=Pb(e.map(([c,u])=>ht(c,u)),r),o=ht(1,0);for(let[c,u]of n)o=mn(o,Fr(r,ht(c,u)));let a=Br(s),l=Br(o);return l<1e-12*Math.max(1,a)?a<1e-12?0:1e12:a/l}function Lb(n,e,t){let i=(e-n)/t,r=i>0?i+Math.log1p(Math.exp(-i)):Math.log1p(Math.exp(i)),s=e-t*r;return s>0?s:0}function sr(n,e="linear",t,i=1,r=1){let s=e==="log"?Math.log1p(n):n;return(t!==void 0?Lb(s,t.max,t.softness):s)*i*r}function Op(n,e,t,i,r=8,s=240){let o=n.map(([S,w])=>ht(S,w)),a=e.map(([S,w])=>ht(S,w)),{mat:l,b:c,c:u}=Np(o,a,t),h=r/Math.max(1,s-1),f=vh(l.map(S=>S.map(w=>Ur(w,h)))),d=[],p=[],g=c.map(S=>({...S}));for(let S=0;S<s;S++)d.push(S*h),p.push(Sh(u,g).re),g=_h(f,g);let m=vh(l.map(S=>S.map(w=>Ur(w,i)))),y=Math.floor(r/i+1e-9)+1,b=[],_=[],x=c.map(S=>({...S}));for(let S=0;S<y;S++)b.push(S*i),_.push(Sh(u,x).re),x=_h(m,x);return{t:d,f:p,tk:b,fk:_}}function $e(n,e){return n.inputs!==void 0&&Object.hasOwn(n.inputs,e)?n.inputs[e]:void 0}function Tt(n,e){let t=$e(n.scene,e);t===void 0&&M("input",`input ${JSON.stringify(e)} is not declared`);let i=t.scope==="per_panel"?n.panel.inputs:n.state.inputs,r=i!==void 0&&Object.hasOwn(i,e)?i[e]:void 0;return r===void 0?t.default:r}function cl(n,e){if(n.kind==="parameter")return typeof e=="number"&&Number.isFinite(e);if(n.kind==="number")return typeof e=="number"&&Number.isFinite(e)&&e>=n.min&&e<=n.max;if(n.kind==="toggle")return typeof e=="boolean";if(n.kind==="points_2d"){if(!Array.isArray(e))return!1;let t=n.min_points??0,i=n.max_points??1/0;return e.length<t||e.length>i?!1:e.every(r=>Array.isArray(r)&&r.length===2&&typeof r[0]=="number"&&Number.isFinite(r[0])&&typeof r[1]=="number"&&Number.isFinite(r[1]))}return typeof e=="string"&&n.values.includes(e)}function Ms(n,e){n.clock.channels.includes(e.clock.channel)||M("clock",`the state's clock channel ${JSON.stringify(e.clock.channel)} is not one of the scene's clock channels`);let t=(s,o)=>{for(let[a,l]of Object.entries(s??{})){let c=$e(n,a);c!==void 0&&!cl(c,l)&&M("input",`${o}: ${c.kind} ${a} cannot hold ${JSON.stringify(l)}`)}};t(e.inputs,"the state");let i=Object.keys(e.panels);i.length===0&&M("state","the state does not have a panel");for(let[s,o]of Object.entries(e.panels))Object.hasOwn(n.panels,o.panel)||M("state",`shown panel ${s} names ${JSON.stringify(o.panel)}, which is not a declared panel`),t(o.inputs,`panel ${s}`);let r=zr(e.layout).sort();(r.length!==i.length||r.some((s,o)=>s!==i.slice().sort()[o]))&&M("state",`the layout shows the panels ${r.join(", ")}, while the state has the panels ${i.slice().sort().join(", ")}`)}function zr(n,e=[]){return n.kind==="panel"?e.push(n.id):(zr(n.a,e),zr(n.b,e)),e}function Ib(n,e){return typeof e=="string"?e:Tt(n,e.input)}function Lo(n,e){if("set"in e)return Object.hasOwn(n.scene.trajectory_sets,e.set)||M("set-query",`the set query names ${JSON.stringify(e.set)}, which is not a trajectory set`),[e.set];(e.tags===null||typeof e.tags!="object")&&M("set-query",`a tags query has tags ${JSON.stringify(e.tags)}, not an object`);let t=Object.entries(e.tags).map(([i,r])=>[i,Ib(n,r)]);return Object.entries(n.scene.trajectory_sets).filter(([,i])=>t.every(([r,s])=>Object.hasOwn(i.tags??{},r)&&i.tags[r]===s)).map(([i])=>i)}function Ft(n,e){let t=Lo(n,e);return t.length>1&&M("set-query",`the set query ${JSON.stringify(e)} matches the ${t.length} trajectory sets ${t.join(", ")}, where one is needed`),t[0]??null}function ul(n,e,t){let i=$e(n.scene,e.input);(i===void 0||i.kind!=="parameter")&&M("members",`input ${e.input} is not of kind parameter`);let r=Tt(n,e.input);(typeof r!="number"||!Number.isFinite(r))&&M("input",`input ${e.input} holds ${JSON.stringify(r)}, not a finite number`);let s=t.parameter(i.parameter,"members"),o=0;for(let a=1;a<t.trajectories;a++)Math.abs(s[a]-r)<Math.abs(s[o]-r)&&(o=a);return o}function Fp(n,e){return(!Number.isInteger(n)||n<0)&&M("members",`member index ${JSON.stringify(n)} is not a trajectory index`),n>=e.trajectories&&M("members",`member index ${n} is not below the trajectory count ${e.trajectories} of trajectory set ${e.id}`),n}function kb(n,e){(!Number.isInteger(e)||e<1)&&M("members",`evenly_spaced ${JSON.stringify(e)} is not an integer of at least one`);let t=e>=n?1:Math.floor(n/e+.5),i=[];for(let r=0;r<n;r+=t)i.push(r);return i[i.length-1]!==n-1&&i.push(n-1),i}function Hr(n,e,t){return e==="all"?Array.from({length:t.trajectories},(i,r)=>r):((e===null||typeof e!="object")&&M("members",`a member reference is "all", {index}, {evenly_spaced}, or {input}, not ${JSON.stringify(e)}`),"index"in e?[Fp(e.index,t)]:"evenly_spaced"in e?kb(t.trajectories,e.evenly_spaced):[ul(n,e,t)])}function ws(n,e,t){return e==="all"&&M("members",'the member of the reference trajectory is "all", but a reference resolves to one trajectory'),(e===null||typeof e!="object")&&M("members",`the member of the reference trajectory is {index} or {input}, not ${JSON.stringify(e)}`),"evenly_spaced"in e&&M("members","the member of the reference trajectory is evenly_spaced, but a reference resolves to one trajectory"),"index"in e?Fp(e.index,t):ul(n,e,t)}function hl(n,e){let{scene:t,state:i}=n,r=zr(i.layout).find(s=>i.panels[s]?.panel===e);return r===void 0?null:{shown:r,frame:Vr({scene:t,state:i,panel:i.panels[r]},t.panels[e])}}function Vr(n,e){let t=typeof e.frame=="string"?e.frame:Tt(n,e.frame.input);return(typeof t!="string"||!Object.hasOwn(n.scene.frames,t))&&M("panel",`the panel displays ${JSON.stringify(t)}, which is not a frame`),t}function Es(n,e){if(e.visible===void 0)return!0;let t=$e(n.scene,e.visible.input);(t===void 0||t.kind!=="toggle")&&M("visible",`a layer's visible names ${e.visible.input}, which is not a toggle`);let i=Tt(n,e.visible.input);return typeof i!="boolean"&&M("visible",`toggle ${e.visible.input} holds ${JSON.stringify(i)}, not a boolean`),i}function Gt(n,e,t,i=0){let{k:r,w:s}=n.locate(e);return{k:r,w:s,shifted:t,revolution:i}}function dl(n,e,t,i=0){if(e===t)return[Gt(n,e,!1,i)];let r=[Gt(n,e,!1,i)];for(let s=0;s<n.m;s++){let o=n.at(s);e<o&&o<t&&r.push({sample:s,shifted:!1,revolution:i})}return r.push(Gt(n,t,!1,i)),r}function fl(n,e,t,i){let r=wn(e,i),s=wn(t,i);if(r.revolution===s.revolution)return dl(n,r.u,s.u,r.revolution);let o=dl(n,r.u,1,r.revolution).slice(0,-1);for(let a=r.revolution+1;a<s.revolution;a++)o.push(...dl(n,0,1,a).slice(0,-1));return o.push(...dl(n,0,s.u,s.revolution)),o}function Eh(n,e,t){let i=t?e:1,r=[];for(let s=0;s<i;s++)for(let o=0;o<(s===i-1?n:n-1);o++)r.push({sample:o,shifted:!1,revolution:s});return r}function pl(n,e,t,i,r){let s=e-t*i;return s<0&&!r&&(s=0),fl(n,s,e,t)}function or(n){return n.head===!0||typeof n.head=="object"&&n.head!==null}function Gr(n,e,t,i){let r=n.revolution??0;if("sample"in n)return i({set:e,trajectory:t,sample:n.sample,shifted:n.shifted,revolution:r});let s=i({set:e,trajectory:t,sample:n.k,shifted:n.shifted,revolution:r}),o=i({set:e,trajectory:t,sample:n.k+1,shifted:n.shifted,revolution:r}),a=n.w;return[(1-a)*s[0]+a*o[0],(1-a)*s[1]+a*o[1],(1-a)*s[2]+a*o[2]]}function Ni(n,e){if(e.clock===void 0)return n;let t=n.base??n,i=Ao(t.clock,e.clock);return{...t,clock:i,channel:i.channels[0],base:t}}function Wr(n,e,t){n=n.base??n,t??=new Si(e.set,e.trajectory,n.channel);let i=Vt(n.clock),r=i*oi(t.reading(n.clock,n.q)),s=wn(r,i);return{tc:t,loopReading:r,at:Gt(t,s.u,!1,s.revolution)}}function Ts(n,e){let t=e.revolution??0,{set:i,trajectory:r}=n;return{a:{set:i,trajectory:r,sample:e.k,shifted:!1,revolution:t},b:{set:i,trajectory:r,sample:e.k+1,shifted:!1,revolution:t},w:e.w}}function Up(n,e,t,i=null){if(t===null)return{kind:"trajectories",set:null,members:[]};let r=e.reveal??"none";["none","grow","trail"].includes(r)||M("panel",`a trajectories layer's reveal is ${JSON.stringify(r)}, not none, grow, or trail`);for(let d of["before","after"])e[d]!==void 0&&e[d]!=="clamp"&&e[d]!=="hidden"&&M("before-after",`a trajectories layer's ${d} is ${JSON.stringify(e[d])}, not clamp or hidden`);r==="trail"&&wh(e);let s=e.read_from??"own";s!=="own"&&s!=="reference"&&M("read-from",`a trajectories layer's read_from is ${JSON.stringify(s)}, not own or reference`);let o=Vt(n.clock),a=t.def.frame,l=d=>n.frames.transform(t.position(d.trajectory,d.sample),a,n.display,d),c=s==="reference"&&i!==null?Ts(i,Wr(n,i).at):null;if(c!==null){let{a:d,b:p,w:g}=c;l=m=>{let y=t.position(m.trajectory,m.sample),b=n.frames.transform(y,a,n.display,d),_=n.frames.transform(y,a,n.display,p);return[(1-g)*b[0]+g*_[0],(1-g)*b[1]+g*_[1],(1-g)*b[2]+g*_[2]]}}let u=or(e),h=r!=="none"||u||n.clock.mode==="epoch"&&(e.before==="hidden"||e.after==="hidden");h&&o>1&&!t.periodic&&M("revolutions",`a reading is taken on trajectory set ${t.id}, which is not periodic, and the clock has ${o} revolutions`);let f=[];for(let d of Hr(n.scope,e.members,t)){let p=[],g=null,m=null;h&&(m=new Si(t,d,n.channel),g=oi(m.reading(n.clock,n.q),e.before,e.after));let y=h&&g===null||s==="reference"&&c===null,b=o*(g??0);y||(r==="none"?p.push(...Eh(t.count(d),o,t.periodic)):r==="grow"?p.push(...fl(m,0,b,o)):p.push(...pl(m,b,o,wh(e),t.periodic)));let _={index:d,line:p.map(x=>Gr(x,t,d,l))};if(u){let x=wn(b,o);_.head=y?null:Gr(Gt(m,x.u,!1,x.revolution),t,d,l)}f.push(_)}return{kind:"trajectories",set:t.id,members:f}}function Th(n){let e=n.vector;(!Array.isArray(e)||e.length<2||e.length>3||!e.every(i=>typeof i=="string"))&&M("arrow",`an arrow layer's vector is ${JSON.stringify(e)}, not two or three channel names`),e.includes(mt)&&M("arrow",`${mt} is not allowed in the vector of an arrow layer`);let t=n.scale??1;return typeof t=="object"&&t!==null&&"channel"in t&&M("arrow","the scale of an arrow layer takes a number or an attribute, not a channel"),{vector:e,scale:t}}function ml(n,e,t,i){let{vector:r,scale:s}=Th(e);for(let u of["before","after"])e[u]!==void 0&&e[u]!=="clamp"&&e[u]!=="hidden"&&M("before-after",`an arrow layer's ${u} is ${JSON.stringify(e[u])}, not clamp or hidden`);if(t===null)return{kind:"arrow",set:null,members:[]};for(let u of r)t.hasChannel(u)||M("arrow",`trajectory set ${t.id} lacks channel ${JSON.stringify(u)} of an arrow layer's vector`);let o=Vt(n.clock);o>1&&!t.periodic&&M("revolutions",`a reading is taken on trajectory set ${t.id}, which is not periodic, and the clock has ${o} revolutions`);let a=t.def.frame,l=r.map(u=>t.channel(u)),c=[];for(let u of Hr(n.scope,e.members,t)){let h=i?i(u):new Si(t,u,n.channel),f=oi(h.reading(n.clock,n.q),e.before,e.after);if(f===null){c.push({index:u,base:null,tip:null});continue}let d=nr(s,{set:t,trajectory:u,sample:0,shifted:!1,revolution:0}),p=t.start(u),g=_=>n.frames.transform(t.position(_.trajectory,_.sample),a,n.display,_),m=_=>{let x=t.position(_.trajectory,_.sample);for(let S=0;S<l.length;S++)x[S]+=d*l[S][p+_.sample];return n.frames.transform(x,a,n.display,_)},y=wn(o*f,o),b=Gt(h,y.u,!1,y.revolution);c.push({index:u,base:Gr(b,t,u,g),tip:Gr(b,t,u,m)})}return{kind:"arrow",set:t.id,members:c}}function Ah(n,e,t){let i=t.panel;(typeof i!="string"||!Object.hasOwn(n.panels,i))&&M("inset-box",`an inset_box layer names ${JSON.stringify(i)}, which is not a declared panel`),i===e&&M("inset-box",`an inset_box layer of panel ${e} names its own panel`),(n.panels[i].camera?.kind??"2d")!=="2d"&&M("inset-box",`an inset_box layer names panel ${i}, whose camera is not a 2d camera`)}function gl(n,e,t){Ah(n.scope.scene,n.scope.panel.panel,e);let i={kind:"inset_box",panel:e.panel,shown_panel:null,frame:null,origin:null,axes:null},r=hl(n.scope,e.panel);if(r===null||(i.shown_panel=r.shown,i.frame=r.frame,t===null))return i;let{a:s,b:o,w:a}=Ts(t,Wr(n,t).at),l=h=>{let f=n.frames.transform(h,r.frame,n.display,s),d=n.frames.transform(h,r.frame,n.display,o);return[(1-a)*f[0]+a*d[0],(1-a)*f[1]+a*d[1],(1-a)*f[2]+a*d[2]]},c=l([0,0,0]),u=h=>{let f=l(h);return[f[0]-c[0],f[1]-c[1],f[2]-c[2]]};return i.origin=c,i.axes=[u([1,0,0]),u([0,1,0]),u([0,0,1])],i}function wh(n){n.trail===void 0&&M("panel","a layer draws a trail but lacks a trail fraction");let e=n.trail.fraction;return(typeof e!="number"||!(e>0&&e<=1))&&M("panel",`the trail fraction ${String(e)} is not in (0, 1]`),e}function Bp(n,e,t){let i={kind:"body",body:e.body,position:null};if(t===null)return e.trail!==void 0&&(i.trail=[]),i;let{set:r,trajectory:s}=t,o=Vt(n.clock),{tc:a,loopReading:l,at:c}=Wr(n,t),u=h=>n.frames.bodyPosition(e.body,n.display,h);return i.position=Gr(c,r,s,u),e.trail!==void 0&&(i.trail=pl(a,l,o,wh(e),r.periodic).map(h=>Gr(h,r,s,u))),i}function Db(n,e,t,i){let r=t.def.frame,s=c=>n.frames.transform(t.position(c.trajectory,c.sample),r,n.display,c);if((e.read_from??"own")!=="reference")return{f:s,hidden:!1};if(i===null)return{f:s,hidden:!0};let{a:o,b:a,w:l}=Ts(i,Wr(n,i).at);return{hidden:!1,f:c=>{let u=t.position(c.trajectory,c.sample),h=n.frames.transform(u,r,n.display,o),f=n.frames.transform(u,r,n.display,a);return[(1-l)*h[0]+l*f[0],(1-l)*h[1]+l*f[1],(1-l)*h[2]+l*f[2]]}}}function zp(n,e,t,i){(!Number.isInteger(e)||e<0||e>=n.trajectories)&&M(t,`${i} names member ${String(e)}, which is not a trajectory of trajectory set ${n.id} of ${n.trajectories}`)}function Hp(n,e,t,i){let r=Vt(n.clock);r>1&&!e.periodic&&M("revolutions",`a reading is taken on trajectory set ${e.id}, which is not periodic, and the clock has ${r} revolutions`);let s=new Si(e,t,n.channel),o=wn(r*oi(s.reading(n.clock,n.q)),r);return Gr(Gt(s,o.u,!1,o.revolution),e,t,i)}function Vp(n,e,t,i,r){if(t===null)return null;zp(t,i,"camera-keyframes","a camera keyframe");let s=Ni(n,e),{f:o,hidden:a}=Db(s,e,t,r);return a?null:Hp(s,t,i,o)}function yl(n,e,t,i){let r=e.at;if((r===null||typeof r!="object")&&M("label",`a label's anchor is ${JSON.stringify(r)}, not an object`),"screen"in r)return{kind:"label",position:null};if("point"in r){let c=r.point;(!Array.isArray(c)||c.length!==3||!c.every(m=>typeof m=="number"&&Number.isFinite(m)))&&M("label",`a label's point is ${JSON.stringify(c)}, not three finite numbers`);let u=[c[0],c[1],c[2]];if(r.frame===void 0)return{kind:"label",position:u};if(i===null)return{kind:"label",position:null};let{a:h,b:f,w:d}=Ts(i,Wr(n,i).at),p=n.frames.transform(u,r.frame,n.display,h),g=n.frames.transform(u,r.frame,n.display,f);return{kind:"label",position:[(1-d)*p[0]+d*g[0],(1-d)*p[1]+d*g[1],(1-d)*p[2]+d*g[2]]}}if((!("sets"in r)||!("member"in r))&&M("label",`a label's anchor is ${JSON.stringify(r)}, not a point, a member, or a place on the screen`),t===null)return{kind:"label",position:null};let s=r.member;zp(t,s,"label","a label");let o=Ni(n,e),a=t.def.frame;return{kind:"label",position:Hp(o,t,s,c=>o.frames.transform(t.position(c.trajectory,c.sample),a,o.display,c))}}function bl(n,e,t){let i=e.reveal??"none";i!=="none"&&i!=="grow"&&M("points",`a points layer's reveal is ${JSON.stringify(i)}, not none or grow`);for(let u of["before","after"])e[u]!==void 0&&e[u]!=="clamp"&&e[u]!=="hidden"&&M("before-after",`a points layer's ${u} is ${JSON.stringify(e[u])}, not clamp or hidden`);if(t===null)return{kind:"points",set:null,members:[]};let r=Ni(n,e),s=r.clock.mode==="epoch"&&(e.before==="hidden"||e.after==="hidden"),o=i==="grow"||s,a=Vt(r.clock);o&&a>1&&!t.periodic&&M("revolutions",`a reading is taken on trajectory set ${t.id}, which is not periodic, and the clock has ${a} revolutions`);let l=t.def.frame,c=[];for(let u of Hr(n.scope,e.members,t)){let h=t.count(u),f=h-1;if(o){let p=new Si(t,u,r.channel),g=p.reading(r.clock,r.q);if(oi(g,e.before,e.after)===null)f=-1;else if(i==="grow")for(f=-1;f+1<h&&p.at(f+1)<=g;)f++}let d=[];for(let p=0;p<=f;p++)d.push(r.frames.transform(t.position(u,p),l,r.display,{set:t,trajectory:u,sample:p,shifted:!1,revolution:0}));c.push({index:u,points:d})}return{kind:"points",set:t.id,members:c}}function ai(n,e,t,i,r){let s;if(typeof e=="number")s=e;else{let o=$e(n.scene,e.input);(o===void 0||o.kind!=="number")&&M(t,`${r} names ${JSON.stringify(e.input)}, which is not a number input`),s=Tt(n,e.input)}return(typeof s!="number"||!Number.isFinite(s))&&M(t,`${r} is ${String(s)}, not finite`),i&&s<=0&&M(t,`${r} is ${s}, not positive`),s}function $r(n,e,t,i,r,s){let o=$e(n.scene,e.input);(o===void 0||o.kind!=="points_2d")&&M(t,`${s} names ${JSON.stringify(e.input)}, which is not a points_2d input`);let a=Tt(n,e.input);return(!Array.isArray(a)||a.length<i||a.length>r)&&M(t,`${s} has ${Array.isArray(a)?a.length:"non-list"} points, outside [${i}, ${r}]`),a}function Yt(n,e){return typeof n=="number"?(Number.isFinite(n)||M("morph",`a morph coordinate is ${String(n)}, not finite`),n):(Number.isFinite(n.nyquist)||M("morph",`a morph Nyquist multiple is ${String(n.nyquist)}, not finite`),n.nyquist*Math.PI/e)}function Gp(n,e){e.map!=="conformal_exp"&&M("morph",`a morph layer's map is ${JSON.stringify(e.map)}, not conformal_exp`),vt(e.alpha,"a morph layer's alpha",Et,"morph");let t=Ht(n.clock,n.q),i=lt(e.alpha,t,0),r=ai(n.scope,e.period,"morph",!0,"a morph period"),s=[];for(let o of e.items){if(o.visible!==void 0){let a=$e(n.scope.scene,o.visible.input);if((a===void 0||a.kind!=="toggle")&&M("visible",`a morph item's visible names ${o.visible.input}, which is not a toggle`),Tt(n.scope,o.visible.input)===!1)continue}if(o.kind==="line"){let a=o.samples??64;(!Number.isInteger(a)||a<2)&&M("morph",`a morph line's samples is ${String(a)}, not an integer >= 2`);let l=Yt(o.from[0],r),c=Yt(o.from[1],r),u=Yt(o.to[0],r),h=Yt(o.to[1],r),f=[];for(let d=0;d<a;d++){let p=d/(a-1),[g,m]=rr(l+p*(u-l),c+p*(h-c),i,r);f.push([g,m,0])}s.push({kind:"line",points:f})}else if(o.kind==="region"){let a=o.samples??[24,24],[l,c]=a;(!Number.isInteger(l)||l<1||!Number.isInteger(c)||c<1)&&M("morph",`a morph region's samples are ${JSON.stringify(a)}, not positive integers`);let u=Yt(o.u[0],r),h=Yt(o.u[1],r),f=Yt(o.v[0],r),d=Yt(o.v[1],r),p=[];for(let g=0;g<=c;g++){let m=f+g/c*(d-f);for(let y=0;y<=l;y++){let b=u+y/l*(h-u),[_,x]=rr(b,m,i,r);p.push([_,x,0])}}s.push({kind:"region",grid:[l,c],points:p})}else M("morph",`a morph item has unknown kind ${JSON.stringify(o.kind)}`)}return{kind:"morph",alpha:i,items:s}}function $p(n,e,t){let i=Ht(n.clock,n.q),r="linear";if(e.scale!==void 0){let S=typeof e.scale=="string"?e.scale:Tt(n.scope,e.scale.input);S!=="linear"&&S!=="log"&&M("surface",`a surface's scale is ${JSON.stringify(S)}, not linear or log`),r=S}let s=e.clamp;s!==void 0&&(Number.isFinite(s.max)&&s.max>0&&Number.isFinite(s.softness)&&s.softness>0||M("surface",`a surface's clamp ${JSON.stringify(s)} does not have positive max and softness`));let o=e.height_scale??1;(!Number.isFinite(o)||o<=0)&&M("surface",`a surface's height_scale is ${String(o)}, not positive`),vt(e.grow,"a surface layer's grow",Et,"surface");let a=lt(e.grow,i,1),l=e.source;if(l.kind==="grid"){t.has(l.array)||M("surface",`a surface grid names array ${JSON.stringify(l.array)}, which the data container lacks`);let S=t.array(l.array);S.dtype!=="float32"&&S.dtype!=="float64"&&M("surface",`surface grid ${l.array} has dtype ${S.dtype}, not float32 or float64`),(S.shape.length!==2||S.shape[0]<2||S.shape[1]<2)&&M("surface",`surface grid ${l.array} has shape (${S.shape.join(", ")}), not 2d with at least 2x2 samples`),Number.isFinite(l.x[0])&&Number.isFinite(l.x[1])&&l.x[0]<l.x[1]&&Number.isFinite(l.y[0])&&Number.isFinite(l.y[1])&&l.y[0]<l.y[1]||M("surface",`a surface grid domain x=${JSON.stringify(l.x)}, y=${JSON.stringify(l.y)} is invalid`);let[w,v]=[S.shape[0],S.shape[1]],T=Array.from({length:w*v}),P=r==="log"||s!==void 0;for(let C=0;C<w*v;C++){let I=S.data[C];T[C]=P?sr(r==="log"?Math.max(0,I):I,r,s,o,a):I*o*a}return{kind:"surface",source:"grid",grid:[v,w],heights:T}}l.kind!=="rational_s"&&l.kind!=="rational_z"&&M("surface",`a surface source has unknown kind ${JSON.stringify(l.kind)}`);let c=$r(n.scope,l.poles,"surface",1,6,"a rational surface poles"),u=l.zeros!==void 0?$r(n.scope,l.zeros,"surface",0,5,"a rational surface zeros"):[];u.length>c.length&&M("surface",`a rational surface has ${u.length} zeros and ${c.length} poles, which is improper`);let h=l.gain!==void 0?ai(n.scope,l.gain,"surface",!1,"a rational surface gain"):1;l.kind==="rational_z"&&l.period===void 0&&M("surface","rational_z surface requires period");let f=l.period!==void 0?ai(n.scope,l.period,"surface",!0,"a rational surface period"):1;Number.isFinite(l.x[0])&&Number.isFinite(l.x[1])&&l.x[0]<l.x[1]&&Number.isFinite(l.y[0])&&Number.isFinite(l.y[1])&&l.y[0]<l.y[1]||M("surface",`a rational surface domain x=${JSON.stringify(l.x)}, y=${JSON.stringify(l.y)} is invalid`);let[d,p]=l.resolution??[64,64];(!Number.isInteger(d)||d<2||!Number.isInteger(p)||p<2)&&M("surface",`a rational surface resolution ${JSON.stringify([d,p])} is not integers >= 2`);let[g,m]=l.x,[y,b]=l.y,_=Array.from({length:p*d});if(l.kind==="rational_s"){let S=Math.max(...c.map(w=>w[0]));for(let w=0;w<p;w++){let v=y+w/(p-1)*(b-y);for(let T=0;T<d;T++){let P=g+T/(d-1)*(m-g),C=Ro(c,u,h,P,v);_[w*d+T]=sr(C,r,s,o,a)}}return{kind:"surface",source:"rational_s",sigma_max:S,converges:S<-1e-9,grid:[d,p],heights:_}}let x=ll(c,u,h,f);for(let S=0;S<p;S++){let w=y+S/(p-1)*(b-y);for(let v=0;v<d;v++){let T=g+v/(d-1)*(m-g),P=Po(x.z_poles,x.z_num,T,w);_[S*d+v]=sr(P,r,s,o,a)}}return{kind:"surface",source:"rational_z",sigma_max:x.sigma_max,r_max:x.r_max,converges:x.converges,z_poles:x.z_poles,z_num:x.z_num,z_den:x.z_den,grid:[d,p],heights:_}}var Ch=class{id;def;trajectories;samples;dim;data;offsets;positions;channels=new Map;parameters=new Map;constructor(e,t,i){this.id=e,this.def=t,this.data=i,this.trajectories=t.trajectories;let r=i.array(t.offsets);(r.dtype!=="uint32"||r.shape.length!==1||r.shape[0]!==t.trajectories+1)&&M("trajectory-set",`trajectory set ${e}: offsets array ${t.offsets} is ${r.dtype} of shape (${r.shape.join(", ")}), not uint32 of shape (${t.trajectories+1},)`),this.offsets=r.data,this.offsets[0]!==0&&M("trajectory-set",`trajectory set ${e}: offsets[0] is ${this.offsets[0]}, not 0`);for(let l=0;l<t.trajectories;l++){let c=this.offsets[l+1]-this.offsets[l];c<2&&M("two-samples",`trajectory set ${e}: the sample count of trajectory ${l} is ${c}, fewer than two`)}this.samples=this.offsets[t.trajectories];let s=i.array(t.positions),[o,a]=s.shape;(s.shape.length!==2||o!==this.samples||a!==2&&a!==3)&&M("trajectory-set",`trajectory set ${e}: positions array ${t.positions} has shape (${s.shape.join(", ")}), not (${this.samples}, 2) or (${this.samples}, 3)`),this.positions=s.data,this.dim=a}get periodic(){return this.def.periodic===!0}start(e){return this.offsets[e]}count(e){return this.offsets[e+1]-this.offsets[e]}position(e,t){let i=(this.offsets[e]+t)*this.dim,r=this.positions;return[r[i],r[i+1],this.dim===3?r[i+2]:0]}hasChannel(e){return e===mt||Object.hasOwn(this.def.channels??{},e)}channel(e,t="transform-channels"){let i=this.channels.get(e);if(i)return i;let r=this.def.channels?.[e];(r===void 0||!Object.hasOwn(this.def.channels??{},e))&&M(t,`trajectory set ${this.id} lacks channel ${JSON.stringify(e)}`);let s=this.data.array(r.array);return(s.shape.length!==1||s.shape[0]!==this.samples)&&M("trajectory-set",`trajectory set ${this.id}: channel ${e} has shape (${s.shape.join(", ")}), not (${this.samples},)`),this.channels.set(e,s.data),s.data}channelAt(e,t,i,r,s=0){let o=this.count(t),a=s-(r?1:0);if(e===mt)return a===0?i:i+a*(o-1);let l=this.channel(e),c=this.offsets[t],u=l[c+i];return a===0?u:u+a*(l[c+o-1]-l[c])}hasParameter(e){return e===ki||Object.hasOwn(this.def.parameters??{},e)}parameter(e,t="input"){let i=this.parameters.get(e);if(i)return i;if(e===ki){let o=Float64Array.from({length:this.trajectories},(a,l)=>l);return this.parameters.set(e,o),o}let r=this.def.parameters?.[e];(r===void 0||!Object.hasOwn(this.def.parameters??{},e))&&M(t,`trajectory set ${this.id} lacks parameter ${JSON.stringify(e)}`);let s=this.data.array(r.array);return(s.shape.length!==1||s.shape[0]!==this.trajectories)&&M("trajectory-set",`trajectory set ${this.id}: parameter ${e} has shape (${s.shape.join(", ")}), not (${this.trajectories},)`),this.parameters.set(e,s.data),s.data}hasAttr(e){return Object.hasOwn(this.def.attrs??{},e)}attr(e){let t=this.def.attrs?.[e];return(t===void 0||!this.hasAttr(e))&&M("transform-channels",`trajectory set ${this.id} lacks attribute ${JSON.stringify(e)}`),t}},ar=class{scene;data;sets=new Map;constructor(e,t){this.scene=e,this.data=t}get(e){let t=this.sets.get(e);if(!t){let i=this.scene.trajectory_sets[e];(i===void 0||!Object.hasOwn(this.scene.trajectory_sets,e))&&M("trajectory-set",`trajectory set ${JSON.stringify(e)} is not declared`),t=new Ch(e,i,this.data),this.sets.set(e,t)}return t}};var Nb=["trajectories","arrow","inset_box","body","axes","grid","label","points","morph","surface"],Wp=["disc","ring","square","diamond","triangle","star","cross","plus"],Ob=["slider","tabs","toggle","points_2d","action","playback"],ko=["viridis","plasma","magma","cividis","blues","reds"],Rh=(n,e)=>{nl.test(n)||M("identifier",`${e} ${JSON.stringify(n)} does not match [A-Za-z0-9_.-]+`)},De=n=>typeof n=="number"&&Number.isFinite(n),gn=/^#[0-9a-fA-F]{6}$/;function lr(n,e,t,i){if(!(n===null||typeof n!="object"||Array.isArray(n)))for(let r of Object.keys(n))e.includes(r)||i.push(`${t} has a key ${JSON.stringify(r)} that this reader does not know`)}var Fb=["label","axes","unit","parent","origin","rotation","scale"],Ub=["label","frame","position","color","image"],Bb=["label","frame","tags","attrs","trajectories","offsets","positions","channels","parameters","periodic"],zb=["label","frame","camera","reference","layers","opacity","margin"],Hb=["kind","plane","aspect","keyframes"],Vb=["kind","projection","up","stretch","auto_rotate","keyframes"],Gb=["align","baseline","size","color","weight","linespacing","box","opacity"],jp={trajectories:["kind","sets","members","reveal","trail","head","before","after","read_from","fit","color","opacity","width","highlight","visible","clock","line","group_opacity","dash","fill"],arrow:["kind","sets","members","vector","scale","before","after","color","opacity","width","head","visible","clock"],inset_box:["kind","panel","color","opacity","width","dash","min_size","visible"],body:["kind","body","trail","size","visible","opacity"],axes:["kind","span","visible","ticks","size","opacity","titles"],grid:["kind","labels","visible","opacity"],label:["kind","text","at","offset","leader","clock","visible",...Gb],points:["kind","sets","members","marker","reveal","before","after","clock","fit","opacity","visible"],morph:["kind","map","alpha","period","items","opacity","visible"],surface:["kind","source","scale","clamp","height_scale","colormap","color_range","grooves","roc","slices","markers","grow","opacity","visible"]},$b=["mode","channels","labels","frame_count","range","revolutions","seconds","keyframes","end"],Wb=["background","foreground","grid","font","gutter"];function jb(n){n.format!=="tycho-scene"&&M("scene",`the format is ${JSON.stringify(n.format)}, not "tycho-scene"`);let e=[],t=/^([0-9]+)\.([0-9]+)$/.exec(String(n.version));t===null?e.push(`version ${JSON.stringify(n.version)} is not "major.minor"`):Number(t[1])!==0?e.push(`major version ${t[1]} is unknown to this reader, which reads ${0}.x`):Number(t[2])>6&&e.push(`version ${t[1]}.${t[2]} is newer than this reader's ${0}.${6}, and the format is unstable until 1.0`);let i=(n.requires??[]).filter(r=>!Tp.has(r));i.length>0&&e.push(`the required features ${i.join(", ")} are not implemented`),e.length>0&&M("version",e.join(", and "))}function gt(n,e,t,i){let r=$e(n,e);r===void 0&&M(i,`input ${JSON.stringify(e)} is not declared`),t!==null&&r.kind!==t&&M(i,`input ${e} is a ${r.kind}, not a ${t}`)}function xl(n,e,t){if(n!==void 0){if(typeof n=="number"){Number.isFinite(n)||M("finite-number",`${e} is ${String(n)}, not finite`);return}if("attr"in n){(!De(n.factor??1)||!De(n.offset??0))&&M("finite-number",`${e} has a factor or offset that is not finite`);return}t&&M("origin",`${e} takes a number or an attribute, not a channel`),n.channel===mt&&M("context-number",`${e} reads channel ${mt}, which is not allowed in a frame edge`)}}function _l(n,e){if("set"in e)Object.hasOwn(n.trajectory_sets,e.set)||M("set-query",`the set query names ${JSON.stringify(e.set)}, which is not a trajectory set`);else for(let t of Object.values(e.tags))typeof t=="object"&&t!==null&&gt(n,t.input,"choice","set-query")}var jr=n=>typeof n=="number"&&n>=0&&n<=1;function Yp(n,e){e.fraction>0&&e.fraction<=1||M("panel",`panel ${n}: a trail fraction is ${e.fraction}, not in (0, 1]`),e.taper!==void 0&&!(jr(e.taper.width??0)&&jr(e.taper.opacity??0))&&M("panel",`panel ${n}: a trail taper is not in [0, 1]`)}function Ph(n,e,t){e.shape!==void 0&&!Wp.includes(e.shape)&&M(t,`panel ${n}: a marker's shape is ${JSON.stringify(e.shape)}, not one of ${Wp.join(", ")}`);for(let i of["color","edge"])e[i]!==void 0&&!gn.test(e[i])&&M(t,`panel ${n}: a marker's ${i} is ${JSON.stringify(e[i])}, not a #rrggbb color`);vt(e.size,`panel ${n}: a marker's size`,Di,t),vt(e.opacity,`panel ${n}: a marker's opacity`,Et,t),vt(e.edge_width,`panel ${n}: a marker's edge_width`,i=>typeof i=="number"&&Number.isFinite(i)&&i>=0,t)}function Sl(n,e){e!==void 0&&((e===null||typeof e!="object"||typeof e.channel!="string")&&M("layer-clock",`panel ${n}: a layer's clock is ${JSON.stringify(e)}, not {channel, range} or {channel, keyframes}`),e.range===void 0==(e.keyframes===void 0)&&M("layer-clock",`panel ${n}: a layer's clock on ${e.channel} has ${e.range===void 0?"neither a range nor keyframes":"both a range and keyframes"}`),e.range!==void 0&&!(Array.isArray(e.range)&&e.range.length===2&&e.range.every(De))&&M("layer-clock",`panel ${n}: a layer's clock on ${e.channel} has range ${JSON.stringify(e.range)}, not two finite numbers`),e.keyframes!==void 0&&_i(e.keyframes,`panel ${n}: the clock of a layer on ${e.channel}`))}function vl(n,e,t){if(typeof e!="string"){Array.isArray(e)||M("control",`${t} has text ${JSON.stringify(e)}, not a string or a list of parts`);for(let i of e){if(typeof i=="string")continue;if((i===null||typeof i!="object")&&M("control",`${t} has a part ${JSON.stringify(i)}`),"input"in i&&gt(n,i.input,null,"control"),"roc_status"in i){let o=i.roc_status;(o===null||typeof o!="object")&&M("control",`${t} has invalid roc_status ${JSON.stringify(o)}`),gt(n,o.poles.input,"points_2d","control"),o.period!==void 0&&typeof o.period!="number"?gt(n,o.period.input,"number","control"):typeof o.period=="number"&&(!Number.isFinite(o.period)||o.period<=0)&&M("control",`${t} has nonpositive roc_status period ${o.period}`);continue}if("channel"in i&&i.channel===mt&&M("control",`${t} has a channel part naming ${mt}, which is not allowed in a readout`),"timed_text"in i){Array.isArray(i.timed_text)||M("timeline-parts",`${t} has timed_text ${JSON.stringify(i.timed_text)}, not a list of [t, text] pairs`);let o=-1/0;for(let a of i.timed_text)(!Array.isArray(a)||a.length!==2||!De(a[0])||typeof a[1]!="string")&&M("timeline-parts",`${t} has a timed text ${JSON.stringify(a)}, not [t, text]`),a[0]<o&&M("timeline-parts",`${t} has timed text whose times decrease`),o=a[0];continue}"keyframes"in i&&_i(i.keyframes,t),"clock"in i&&!["frame_index","frame_count","value","time"].includes(i.clock)&&M("control",`${t} has a clock part ${JSON.stringify(i.clock)}`);let r=i;(!De(r.factor??1)||!De(r.offset??0))&&M("finite-number",`${t} has a part whose factor or offset is not finite`),r.digits!==void 0&&!(Number.isInteger(r.digits)&&r.digits>=1&&r.digits<=17)&&M("control",`${t} has digits ${String(r.digits)}, not in 1 to 17`),r.decimals!==void 0&&!(Number.isInteger(r.decimals)&&r.decimals>=0&&r.decimals<=17)&&M("timeline-parts",`${t} has decimals ${String(r.decimals)}, not in 0 to 17`),r.digits!==void 0&&r.decimals!==void 0&&M("timeline-parts",`${t} has a part with both digits and decimals`);let s=i.width;s!==void 0&&!(Number.isInteger(s)&&s>=0&&s<=40)&&M("timeline-parts",`${t} has width ${String(s)}, not in 0 to 40`)}}}function Xp(n){let e=t=>typeof t=="string"||t!==null&&typeof t=="object"&&Object.keys(t).length===1&&(typeof t.sub=="string"||typeof t.sup=="string");return typeof n=="string"||Array.isArray(n)&&n.every(e)}function Jp(n,e){e.align!==void 0&&!["start","center","end"].includes(e.align)&&M("label",`${n}: an align is ${JSON.stringify(e.align)}`),e.baseline!==void 0&&!["top","middle","bottom","alphabetic"].includes(e.baseline)&&M("label",`${n}: a baseline is ${JSON.stringify(e.baseline)}`),e.size!==void 0&&!Di(e.size)&&M("label",`${n}: a text size is ${JSON.stringify(e.size)}, not positive`),e.color!==void 0&&!gn.test(e.color)&&M("label",`${n}: a text color is ${JSON.stringify(e.color)}, not #rrggbb`),e.weight!==void 0&&e.weight!=="normal"&&e.weight!=="bold"&&M("label",`${n}: a weight is ${JSON.stringify(e.weight)}, not normal or bold`),e.linespacing!==void 0&&!Di(e.linespacing)&&M("label",`${n}: a linespacing is ${JSON.stringify(e.linespacing)}, not positive`),vt(e.opacity,`${n}: an opacity`,Et,"label");let t=e.box;if(t!==void 0){for(let i of["fill","edge"])t[i]!==void 0&&!gn.test(t[i])&&M("label",`${n}: a box ${i} is not #rrggbb`);t.opacity!==void 0&&!jr(t.opacity)&&M("label",`${n}: a box opacity is not in [0, 1]`)}}function Xb(n,e,t){vl(n,t.text,`panel ${e}: a label`),Jp(`panel ${e}`,t),Sl(e,t.clock);let i=t.at;if((i===null||typeof i!="object")&&M("label",`panel ${e}: a label's anchor is ${JSON.stringify(i)}`),"point"in i){let o=i.point;(!Array.isArray(o)||o.length!==3||!o.every(De))&&M("label",`panel ${e}: a label's point is ${JSON.stringify(o)}, not three finite numbers`),i.frame!==void 0&&!Object.hasOwn(n.frames,i.frame)&&M("label",`panel ${e}: a label's point is in frame ${JSON.stringify(i.frame)}, which is not declared`)}else if("sets"in i)_l(n,i.sets),(!Number.isInteger(i.member)||i.member<0)&&M("label",`panel ${e}: a label's member is ${JSON.stringify(i.member)}, not a trajectory index`);else if("screen"in i){let o=i.screen;(!Array.isArray(o)||o.length!==2||!o.every(De))&&M("label",`panel ${e}: a label's screen place is ${JSON.stringify(o)}, not two fractions`)}else M("label",`panel ${e}: a label's anchor is ${JSON.stringify(i)}, not a point, a member, or a place on the screen`);let r=t.offset;r!==void 0&&!(Array.isArray(r)&&r.length===2&&r.every(De))&&M("label",`panel ${e}: a label's offset is ${JSON.stringify(r)}, not two lengths`);let s=t.leader;s!==void 0&&typeof s=="object"&&s.color!==void 0&&!gn.test(s.color)&&M("label",`panel ${e}: a leader's color is not #rrggbb`)}function qb(n,e,t){Lh(n,e,t);let i=t.reveal??"none";i!=="none"&&i!=="grow"&&M("points",`panel ${e}: a points layer's reveal is ${JSON.stringify(i)}, not none or grow`);for(let r of["before","after"])t[r]!==void 0&&t[r]!=="clamp"&&t[r]!=="hidden"&&M("before-after",`panel ${e}: a points layer's ${r} is ${JSON.stringify(t[r])}, not clamp or hidden`);if(t.marker!==void 0){let{color:r,...s}=t.marker;Ph(e,typeof r=="object"?s:{...s,color:r},"points"),Zp(n,e,r)}vt(t.opacity,`panel ${e}: a points layer's opacity`,Et),Sl(e,t.clock)}function Lh(n,e,t){_l(n,t.sets),typeof t.members=="object"&&"input"in t.members&&gt(n,t.members.input,"parameter","members");let i=t.members;typeof i=="object"&&"evenly_spaced"in i&&!(Number.isInteger(i.evenly_spaced)&&i.evenly_spaced>=1)&&M("members",`panel ${e}: evenly_spaced ${JSON.stringify(i.evenly_spaced)} is not an integer of at least one`)}function Yb(n,e,t){Lh(n,e,t),Th(t);for(let i of["before","after"])t[i]!==void 0&&t[i]!=="clamp"&&t[i]!=="hidden"&&M("before-after",`panel ${e}: an arrow layer's ${i} is ${JSON.stringify(t[i])}, not clamp or hidden`);t.color!==void 0&&!gn.test(t.color)&&M("arrow",`panel ${e}: an arrow layer's color is ${JSON.stringify(t.color)}, not a #rrggbb color`),t.head?.size!==void 0&&!(t.head.size>0)&&M("arrow",`panel ${e}: an arrowhead size is ${t.head.size}, not positive`),vt(t.opacity,`panel ${e}: an arrow layer's opacity`,Et),t.width!==void 0&&!(t.width>0)&&M("panel",`panel ${e}: an arrow layer's width is ${t.width}, not positive`),Sl(e,t.clock)}function Jb(n,e,t){Ah(n,e,t),t.color!==void 0&&!gn.test(t.color)&&M("inset-box",`panel ${e}: an inset_box layer's color is ${JSON.stringify(t.color)}, not a #rrggbb color`),vt(t.opacity,`panel ${e}: an inset_box layer's opacity`,Et),t.width!==void 0&&!(t.width>0)&&M("panel",`panel ${e}: an inset_box layer's width is ${t.width}, not positive`);let i=t.dash;i!==void 0&&!(Array.isArray(i)&&i.length===2&&i.every(r=>De(r)&&r>0))&&M("inset-box",`panel ${e}: an inset_box layer's dash is ${JSON.stringify(i)}, not two positive lengths`),t.min_size!==void 0&&!(De(t.min_size)&&t.min_size>=0)&&M("inset-box",`panel ${e}: an inset_box layer's min_size is ${t.min_size}, not a nonnegative length`)}function Zb(n,e,t){Lh(n,e,t),t.fit!==void 0&&typeof t.fit!="boolean"&&M("panel",`panel ${e}: a trajectories layer's fit is ${JSON.stringify(t.fit)}, not a boolean`);let i=t.highlight;i!==void 0&&(gt(n,i.input,"parameter","panel"),i.width!==void 0&&!(i.width>0)&&M("panel",`panel ${e}: a highlight width is ${i.width}, not positive`),i.opacity!==void 0&&!jr(i.opacity)&&M("panel",`panel ${e}: a highlight opacity is ${i.opacity}, not in [0, 1]`),i.kernel!==void 0&&(i.kernel.width>0&&i.kernel.width<=1||M("panel",`panel ${e}: a highlight kernel's width is ${i.kernel.width}, not in (0, 1]`),jr(i.kernel.opacity)||M("panel",`panel ${e}: a highlight kernel's opacity is ${i.kernel.opacity}, not in [0, 1]`)));let r=t.reveal??"none";if(["none","grow","trail"].includes(r)||M("panel",`panel ${e}: a trajectories layer's reveal is ${JSON.stringify(r)}, not none, grow, or trail`),r==="trail"&&t.trail===void 0&&M("panel",`panel ${e}: a trajectories layer has reveal "trail" but lacks a trail`),t.trail!==void 0&&Yp(e,t.trail),t.head!==void 0&&typeof t.head!="boolean"){(typeof t.head!="object"||t.head===null)&&M("head",`panel ${e}: a trajectories layer's head is ${JSON.stringify(t.head)}, not a boolean or an object`),t.head.color!==void 0&&!gn.test(t.head.color)&&M("head",`panel ${e}: a head color is ${JSON.stringify(t.head.color)}, not a #rrggbb color`),Ph(e,t.head,"head");let o=t.head.glow;o!==void 0&&((typeof o.channel!="string"||o.channel===mt)&&M("timeline",`panel ${e}: a glow names channel ${JSON.stringify(o.channel)}`),o.color!==void 0&&!gn.test(o.color)&&M("timeline",`panel ${e}: a glow's color is not #rrggbb`),o.size!==void 0&&!Di(o.size)&&M("timeline",`panel ${e}: a glow's size is not positive`),o.opacity!==void 0&&!jr(o.opacity)&&M("timeline",`panel ${e}: a glow's opacity is not in [0, 1]`))}t.line!==void 0&&typeof t.line!="boolean"&&M("panel",`panel ${e}: a trajectories layer's line is ${JSON.stringify(t.line)}, not a boolean`),t.group_opacity!==void 0&&typeof t.group_opacity!="boolean"&&M("panel",`panel ${e}: a trajectories layer's group_opacity is ${JSON.stringify(t.group_opacity)}, not a boolean`);let s=t.dash;s!==void 0&&!(Array.isArray(s)&&s.length===2&&s.every(o=>De(o)&&o>0))&&M("timeline",`panel ${e}: a trajectories layer's dash is ${JSON.stringify(s)}, not two positive lengths`),t.fill!==void 0&&(t.fill.base!==void 0&&!De(t.fill.base)&&M("finite-number",`panel ${e}: a fill's base is not finite`),t.fill.color!==void 0&&!gn.test(t.fill.color)&&M("panel",`panel ${e}: a fill's color is not #rrggbb`),t.fill.opacity!==void 0&&!jr(t.fill.opacity)&&M("panel",`panel ${e}: a fill's opacity is not in [0, 1]`)),Sl(e,t.clock);for(let o of["before","after"])t[o]!==void 0&&t[o]!=="clamp"&&t[o]!=="hidden"&&M("before-after",`panel ${e}: a trajectories layer's ${o} is ${JSON.stringify(t[o])}, not clamp or hidden`);t.read_from!==void 0&&t.read_from!=="own"&&t.read_from!=="reference"&&M("read-from",`panel ${e}: a trajectories layer's read_from is ${JSON.stringify(t.read_from)}, not own or reference`),vt(t.opacity,`panel ${e}: a trajectories layer's opacity`,Et),t.width!==void 0&&!(t.width>0)&&M("panel",`panel ${e}: a trajectories layer's width is ${t.width}, not positive`),Zp(n,e,t.color)}function Io(n,e){if(typeof n=="number"){Number.isFinite(n)||M("morph",`panel ${e}: a morph coordinate is ${String(n)}, not finite`);return}(n===null||typeof n!="object"||!("nyquist"in n)||!De(n.nyquist))&&M("morph",`panel ${e}: a morph coordinate is ${JSON.stringify(n)}, not a finite number or {nyquist}`)}function Kb(n,e,t){t.map!=="conformal_exp"&&M("morph",`panel ${e}: morph map is ${JSON.stringify(t.map)}, not conformal_exp`),vt(t.alpha,`panel ${e}: a morph layer's alpha`,Et,"morph"),typeof t.period=="number"?(!De(t.period)||t.period<=0)&&M("morph",`panel ${e}: morph period ${t.period} is not positive`):gt(n,t.period.input,"number","morph"),vt(t.opacity,`panel ${e}: a morph layer's opacity`,Et,"morph"),Array.isArray(t.items)||M("morph",`panel ${e}: morph items is not a list`);for(let i of t.items)i.visible!==void 0&&gt(n,i.visible.input,"toggle","visible"),vt(i.opacity,`panel ${e}: morph item opacity`,Et,"morph"),i.kind==="line"?(i.from.forEach(r=>Io(r,e)),i.to.forEach(r=>Io(r,e)),i.samples!==void 0&&(!Number.isInteger(i.samples)||i.samples<2)&&M("morph",`panel ${e}: morph line samples ${i.samples} is less than 2`),i.color!==void 0&&!gn.test(i.color)&&M("morph",`panel ${e}: morph line color ${i.color} is not #rrggbb`),i.width!==void 0&&(!De(i.width)||i.width<=0)&&M("morph",`panel ${e}: morph line width is not positive`),i.dash!==void 0&&(!Array.isArray(i.dash)||i.dash.length!==2||i.dash.some(r=>!De(r)||r<=0))&&M("morph",`panel ${e}: morph line dash is invalid`),vt(i.reveal,`panel ${e}: morph line reveal`,Et,"morph")):i.kind==="region"?(i.u.forEach(r=>Io(r,e)),i.v.forEach(r=>Io(r,e)),i.samples!==void 0&&(!Array.isArray(i.samples)||i.samples.length!==2||i.samples.some(r=>!Number.isInteger(r)||r<1))&&M("morph",`panel ${e}: morph region samples are invalid`),i.color!==void 0&&!gn.test(i.color)&&M("morph",`panel ${e}: morph region color ${i.color} is not #rrggbb`),vt(i.reveal,`panel ${e}: morph region reveal`,Et,"morph"),i.reveal_origin!==void 0&&((!Array.isArray(i.reveal_origin)||i.reveal_origin.length!==2)&&M("morph",`panel ${e}: morph region reveal_origin must be a 2-element list`),i.reveal_origin.forEach(r=>Io(r,e)))):M("morph",`panel ${e}: unknown morph item kind ${JSON.stringify(i.kind)}`)}function Qb(n,e,t,i){let r=t.source;if((r===null||typeof r!="object")&&M("surface",`panel ${e}: surface layer lacks source`),r.kind==="grid"){if(De(r.x[0])&&De(r.x[1])&&r.x[0]<r.x[1]&&De(r.y[0])&&De(r.y[1])&&r.y[0]<r.y[1]||M("surface",`panel ${e}: surface grid domain is invalid`),i!==void 0){i.has(r.array)||M("surface",`panel ${e}: surface grid array ${JSON.stringify(r.array)} is missing from data.tyd`);let s=i.array(r.array);(s.dtype!=="float32"&&s.dtype!=="float64"||s.shape.length!==2||s.shape[0]<2||s.shape[1]<2)&&M("surface",`panel ${e}: surface grid array ${r.array} must be 2d float32/float64 of at least 2x2`)}}else if(r.kind==="rational_s"||r.kind==="rational_z"){gt(n,r.poles.input,"points_2d","surface");let s=$e(n,r.poles.input);if(s?.kind==="points_2d"&&((s.min_points??0)<1||(s.max_points??6)>6)&&(s.default.length<1||s.default.length>6)&&M("surface",`panel ${e}: poles default must have 1 to 6 points`),r.zeros!==void 0){gt(n,r.zeros.input,"points_2d","surface");let o=$e(n,r.zeros.input);o?.kind==="points_2d"&&(o.max_points??5)>5&&o.default.length>5&&M("surface",`panel ${e}: zeros default cannot exceed 5 points`)}r.gain!==void 0&&typeof r.gain!="number"?gt(n,r.gain.input,"number","surface"):typeof r.gain=="number"&&!De(r.gain)&&M("surface",`panel ${e}: surface gain is not finite`),r.kind==="rational_z"&&r.period===void 0&&M("surface",`panel ${e}: rational_z surface requires period`),r.period!==void 0&&typeof r.period!="number"?gt(n,r.period.input,"number","surface"):typeof r.period=="number"&&(!De(r.period)||r.period<=0)&&M("surface",`panel ${e}: surface period is not positive`),De(r.x[0])&&De(r.x[1])&&r.x[0]<r.x[1]&&De(r.y[0])&&De(r.y[1])&&r.y[0]<r.y[1]||M("surface",`panel ${e}: surface domain is invalid`),r.resolution!==void 0&&(!Array.isArray(r.resolution)||r.resolution.length!==2||r.resolution.some(o=>!Number.isInteger(o)||o<2))&&M("surface",`panel ${e}: surface resolution is invalid`)}else M("surface",`panel ${e}: unknown surface source ${JSON.stringify(r.kind)}`);if(t.scale!==void 0&&typeof t.scale!="string"){gt(n,t.scale.input,"choice","surface");let s=$e(n,t.scale.input);s?.kind==="choice"&&s.values.some(o=>o!=="linear"&&o!=="log")&&M("surface",`panel ${e}: surface scale choice must hold linear/log`)}else typeof t.scale=="string"&&t.scale!=="linear"&&t.scale!=="log"&&M("surface",`panel ${e}: surface scale is ${JSON.stringify(t.scale)}, not linear or log`);t.clamp!==void 0&&(!De(t.clamp.max)||t.clamp.max<=0||!De(t.clamp.softness)||t.clamp.softness<=0)&&M("surface",`panel ${e}: surface clamp requires positive max and softness`),t.height_scale!==void 0&&(!De(t.height_scale)||t.height_scale<=0)&&M("surface",`panel ${e}: surface height_scale must be positive`),t.colormap!==void 0&&!ko.includes(t.colormap)&&M("surface",`panel ${e}: surface colormap ${t.colormap} is unknown`),t.color_range!==void 0&&(!Array.isArray(t.color_range)||t.color_range.length!==2||!t.color_range.every(De)||t.color_range[0]===t.color_range[1])&&M("surface",`panel ${e}: surface color_range must be two distinct numbers`),t.roc?.visible!==void 0&&gt(n,t.roc.visible.input,"toggle","visible"),vt(t.roc?.opacity,`panel ${e}: surface roc opacity`,Et,"surface"),t.slices?.continuous?.visible!==void 0&&gt(n,t.slices.continuous.visible.input,"toggle","visible"),vt(t.slices?.continuous?.opacity,`panel ${e}: continuous slice opacity`,Et,"surface"),t.slices?.discrete?.visible!==void 0&&gt(n,t.slices.discrete.visible.input,"toggle","visible"),t.slices?.discrete?.count!==void 0&&typeof t.slices.discrete.count!="number"&&gt(n,t.slices.discrete.count.input,"number","surface"),vt(t.slices?.discrete?.opacity,`panel ${e}: discrete slice opacity`,Et,"surface"),t.slices?.clip!==void 0&&typeof t.slices.clip!="boolean"&&M("surface",`panel ${e}: surface slices clip must be a boolean`),t.markers?.visible!==void 0&&gt(n,t.markers.visible.input,"toggle","visible"),vt(t.markers?.opacity,`panel ${e}: surface markers opacity`,Et,"surface"),vt(t.grow,`panel ${e}: a surface layer's grow`,Et,"surface"),vt(t.opacity,`panel ${e}: a surface layer's opacity`,Et,"surface")}function Zp(n,e,t){if(typeof t=="object")if(t===null&&M("panel",`panel ${e}: a color is null, not a #rrggbb color or a colormap`),"thresholds"in t){let i=t,r=i.thresholds;(!Array.isArray(r)||r.length===0||!r.every(De)||r.some((s,o)=>o>0&&!(s>r[o-1])))&&M("timeline",`panel ${e}: a threshold color's thresholds are ${JSON.stringify(r)}, not increasing finite numbers`),(!Array.isArray(i.colors)||i.colors.length!==r.length+1||!i.colors.every(s=>gn.test(s)))&&M("timeline",`panel ${e}: a threshold color has ${JSON.stringify(i.colors)} for ${r.length} thresholds, not one #rrggbb color more than thresholds`)}else{let i=t.colormap;if(typeof i=="object"&&i!==null){gt(n,i.input,"choice","panel");let r=$e(n,i.input).values,s=Object.keys(i.map??{}),o=r.filter(l=>!Object.hasOwn(i.map,l)),a=s.filter(l=>!r.includes(l));o.length>0&&M("panel",`panel ${e}: a colormap keyed on ${i.input} does not name a colormap for ${JSON.stringify(o)}`),a.length>0&&M("panel",`panel ${e}: a colormap keyed on ${i.input} maps ${JSON.stringify(a)}, which are not its values`);for(let l of s)ko.includes(i.map[l])||M("panel",`panel ${e}: the colormap ${JSON.stringify(i.map[l])} is not one of ${ko.join(", ")}`)}else ko.includes(i)||M("panel",`panel ${e}: the colormap ${JSON.stringify(i)} is not one of ${ko.join(", ")}`);"parameter"in t=="channel"in t&&M("panel",`panel ${e}: a colormap color names both or neither of parameter and channel`)}}function qp(n,e,t,i){typeof i=="object"&&("channel"in i&&!Object.hasOwn(t.channels??{},i.channel)&&M("panel",`panel ${n}: trajectory set ${e} lacks channel ${i.channel} for a layer's color`),"parameter"in i&&!Object.hasOwn(t.parameters??{},i.parameter)&&M("panel",`panel ${n}: trajectory set ${e} lacks parameter ${i.parameter} for a layer's color`))}function Ml(n,e,t){let i=[];jb(n);for(let u of Object.keys(n))Ap.has(u)||i.push(`the scene has a top-level key ${JSON.stringify(u)} that this reader does not know`);lr(n.theme,Wb,"the theme",i);for(let[u,h]of Object.entries(n.theme??{}))u==="font"?typeof h!="string"&&M("scene",`theme font is ${JSON.stringify(h)}, not a CSS font family`):(typeof h!="string"||!gn.test(h))&&M("scene",`theme ${u} is ${JSON.stringify(h)}, not a #rrggbb color`);lr(n.clock,$b,"the clock",i);for(let[u,h]of Object.entries(n.frames))lr(h,Fb,`frame ${u}`,i);for(let[u,h]of Object.entries(n.bodies??{}))lr(h,Ub,`body ${u}`,i),h.color!==void 0&&!gn.test(h.color)&&M("body",`body ${u} has color ${JSON.stringify(h.color)}, not #rrggbb`);for(let[u,h]of Object.entries(n.trajectory_sets))lr(h,Bb,`trajectory set ${u}`,i);for(let[u,h]of Object.entries(n.panels)){lr(h,zb,`panel ${u}`,i),h.camera!==void 0&&lr(h.camera,h.camera.kind==="3d"?Vb:Hb,`the camera of panel ${u}`,i);for(let f of h.layers)Object.hasOwn(jp,f.kind)&&lr(f,jp[f.kind],`a ${f.kind} layer of panel ${u}`,i)}for(let[u,h]of[["frame",n.frames],["body",n.bodies],["trajectory set",n.trajectory_sets],["input",n.inputs],["panel",n.panels]])for(let f of Object.keys(h??{}))Rh(f,u);let r=new ir(n),s=u=>r.tree.has(u);for(let[u,h]of Object.entries(n.frames))Array.isArray(h.origin)&&h.origin.forEach(f=>xl(f,`the origin of frame ${u}`,!1)),xl(h.rotation?.angle,`the rotation of frame ${u}`,!1),xl(h.scale,`the scale of frame ${u}`,!1),h.axes!==void 0&&h.axes.length!==3&&M("frame",`frame ${u} has ${h.axes.length} axis labels, not three`),h.axes!==void 0&&!h.axes.every(Xp)&&M("frame",`frame ${u} has an axis title that is not a string or a list of strings and sub and sup parts`);for(let[u,h]of Object.entries(n.bodies??{}))s(h.frame)||M("body",`body ${u} is in frame ${h.frame}, which is not declared`),h.position.forEach(f=>xl(f,`the position of body ${u}`,!0));Object.keys(n.trajectory_sets).length===0&&M("trajectory-set","the scene does not have a trajectory set");for(let[u,h]of Object.entries(n.trajectory_sets)){s(h.frame)||M("trajectory-set",`trajectory set ${u} is in frame ${h.frame}, which is not declared`),(!Number.isInteger(h.trajectories)||h.trajectories<1)&&M("trajectory-set",`trajectory set ${u} has trajectories ${String(h.trajectories)}, not a count of at least one`),Object.hasOwn(h.channels??{},mt)&&M("identifier",`trajectory set ${u} declares a channel named ${mt}, which is reserved`),Object.hasOwn(h.parameters??{},ki)&&M("identifier",`trajectory set ${u} declares a parameter named ${ki}, which is reserved`);for(let[f,d]of Object.entries(h.attrs??{}))De(d)||M("finite-number",`attribute ${f} of trajectory set ${u} is not finite`)}for(let[u,h]of Object.entries(n.inputs??{})){let f=h.scope;if(f!==void 0&&f!=="shared"&&f!=="per_panel"&&M("input",`input ${u} has scope ${JSON.stringify(f)}, not shared or per_panel`),h.kind==="parameter")typeof h.parameter!="string"&&M("input",`input ${u} is of kind parameter but does not name a parameter`),De(h.default)||M("input",`input ${u} defaults to ${String(h.default)}, not a finite number`);else if(h.kind==="choice")h.values.includes(h.default)||M("input",`choice ${u} defaults to ${JSON.stringify(h.default)}, which is not one of its values`),h.labels!==void 0&&h.labels.length!==h.values.length&&M("input",`choice ${u} has ${h.labels.length} labels for ${h.values.length} values`);else if(h.kind==="toggle"){let d=h.default;typeof d!="boolean"&&M("input",`toggle ${u} defaults to ${JSON.stringify(d)}, not a boolean`)}else if(h.kind==="number")(!De(h.min)||!De(h.max)||!(h.min<h.max))&&M("number-input",`number input ${u} requires finite min < max`),h.step!==void 0&&(!De(h.step)||h.step<=0)&&M("number-input",`number input ${u} requires positive step`),(!De(h.default)||h.default<h.min||h.default>h.max)&&M("number-input",`number input ${u} default is outside [min, max]`);else if(h.kind==="points_2d"){let d=h.min_points??0,p=h.max_points??6;if((!Number.isInteger(d)||d<0||!Number.isInteger(p)||p<d)&&M("points-2d",`points_2d input ${u} has invalid min_points/max_points`),h.bounds!==void 0){let[[g,m],[y,b]]=h.bounds;De(g)&&De(m)&&g<m&&De(y)&&De(b)&&y<b||M("points-2d",`points_2d input ${u} has invalid bounds`)}(!Array.isArray(h.default)||h.default.length<d||h.default.length>p||!h.default.every(g=>Array.isArray(g)&&g.length===2&&De(g[0])&&De(g[1])))&&M("points-2d",`points_2d input ${u} default does not fit point bounds`)}else M("input",`input ${u} has kind ${JSON.stringify(h.kind)}, not parameter, choice, toggle, number, or points_2d`)}let o=n.clock;o.mode!=="fraction"&&o.mode!=="epoch"&&M("clock",`the clock mode is ${JSON.stringify(o.mode)}, not fraction or epoch`),(!Number.isInteger(o.frame_count)||o.frame_count<1)&&M("clock",`the clock has frame_count ${String(o.frame_count)}, not a count of at least one`),o.mode==="epoch"?(o.range!==void 0&&o.keyframes!==void 0&&M("clock-keyframes","the clock in epoch mode has both a range and keyframes"),o.range===void 0&&o.keyframes===void 0&&M("clock-mode","the clock is in epoch mode but does not have a range of two numbers or keyframes"),o.range!==void 0&&!o.range.every(De)&&M("finite-number","the clock range is not finite"),o.keyframes!==void 0&&_i(o.keyframes,"the clock")):o.keyframes!==void 0&&M("clock-keyframes","the clock in fraction mode has keyframes, which only a clock in epoch mode takes"),o.end!==void 0&&o.end!=="loop"&&o.end!=="stop"&&M("steps",`the clock's end is ${JSON.stringify(o.end)}, not loop or stop`);let a=Ot(o),l=-1/0,c=new Set;for(let u of n.steps??[])Rh(u.id,"step"),c.has(u.id)&&M("steps",`step ${u.id} is declared twice`),c.add(u.id),(!De(u.at)||u.at<0||u.at>a)&&M("steps",`step ${u.id} is at ${String(u.at)}, not a time in [0, ${a}]`),u.at<l&&M("steps",`the steps are not in order of time at ${u.id}`),l=u.at;for(let[u,h]of(n.overlays??[]).entries()){let f=`overlay ${u}`;if((!Array.isArray(h.at)||h.at.length!==2||!h.at.every(De))&&M("timeline",`${f} is at ${JSON.stringify(h.at)}, not two fractions`),h.kind==="text")vl(n,h.text,f),Jp(f,h);else if(h.kind==="legend"){vt(h.opacity,`${f}: the opacity`,Et,"timeline");for(let d of h.entries){Xp(d.label)||M("timeline",`${f} has an entry whose label is not a string or a list of strings and sub and sup parts`),d.marker!==void 0&&Ph(f,d.marker,"timeline"),d.line?.color!==void 0&&!gn.test(d.line.color)&&M("timeline",`${f} has a line color that is not #rrggbb`);for(let p of d.colors??[])gn.test(p)||M("timeline",`${f} has a color ${JSON.stringify(p)} that is not #rrggbb`)}}else M("version",`overlay kind ${JSON.stringify(h.kind)} is not implemented`)}o.labels!==void 0&&o.labels.length!==o.channels.length&&M("clock",`the clock has ${o.labels.length} labels for ${o.channels.length} channels`),o.seconds!==void 0&&!(De(o.seconds)&&o.seconds>0)&&M("clock",`the clock seconds are ${JSON.stringify(o.seconds)}, not a positive finite number`),Vt(o);for(let[u,h]of Object.entries(n.panels)){if(typeof h.frame=="string")s(h.frame)||M("panel",`panel ${u} displays ${h.frame}, which is not a frame`);else{gt(n,h.frame.input,"choice","panel");let p=$e(n,h.frame.input);if(p.kind==="choice")for(let g of p.values)s(g)||M("panel",`the frame of panel ${u} can be ${g}, which is not a frame`)}_l(n,h.reference.sets),h.reference.member==="all"&&M("members",`panel ${u}: the member of the reference trajectory is "all", but a reference resolves to one trajectory`),"evenly_spaced"in h.reference.member&&M("members",`panel ${u}: the member of the reference trajectory is evenly_spaced, but a reference resolves to one trajectory`),"input"in h.reference.member&&gt(n,h.reference.member.input,"parameter","members"),h.camera!==void 0&&h.camera.kind!=="2d"&&h.camera.kind!=="3d"&&M("panel",`panel ${u}: a camera kind is ${JSON.stringify(h.camera.kind)}, not 2d or 3d`);let f=h.camera?.aspect;if(h.camera?.kind==="2d"&&f!==void 0&&f!=="equal"&&f!=="free"&&M("panel",`panel ${u}: a 2d camera's aspect is ${JSON.stringify(f)}, not equal or free`),h.camera?.kind==="2d"&&h.camera.keyframes!==void 0){sl(h.camera.keyframes,f==="free",`the camera of panel ${u}`);for(let p of h.camera.keyframes)for(let g of p.follow??[])h.layers[g.layer]?.kind!=="trajectories"&&M("camera-keyframes",`panel ${u}: a camera keyframe follows layer ${g.layer}, which is not a trajectories layer of the panel`)}vt(h.opacity,`panel ${u}: the opacity`,Et);let d=h.margin;if(d!==void 0){for(let p of["top","right","bottom","left"]){let g=d[p];g!==void 0&&!(De(g)&&g>=0&&g<1)&&M("timeline",`panel ${u}: the ${p} margin is ${String(g)}, not a fraction in [0, 1)`)}((d.top??0)+(d.bottom??0)>=1||(d.left??0)+(d.right??0)>=1)&&M("timeline",`panel ${u}: the margins leave nothing to draw in`)}if(h.camera?.kind==="3d"){let{stretch:p,auto_rotate:g}=h.camera;p!==void 0&&!(Array.isArray(p)&&p.length===3&&p.every(m=>De(m)&&m>0))&&M("panel",`panel ${u}: a 3d camera's stretch is ${JSON.stringify(p)}, not three positive finite factors`),g!==void 0&&!De(g)&&M("panel",`panel ${u}: a 3d camera's auto_rotate is ${JSON.stringify(g)}, not a finite number of degrees`),h.camera.keyframes!==void 0&&(Pp(h.camera.keyframes,`the camera of panel ${u}`),g!==void 0&&M("camera-keyframes-3d",`panel ${u}: a 3d camera has both keyframes and auto_rotate`))}for(let p of h.layers)if(Nb.includes(p.kind)||M("version",`panel ${u}: layer kind ${JSON.stringify(p.kind)} is not implemented`),p.visible!==void 0&&gt(n,p.visible.input,"toggle","visible"),p.kind==="trajectories")Zb(n,u,p);else if(p.kind==="arrow")Yb(n,u,p);else if(p.kind==="inset_box")Jb(n,u,p);else if(p.kind==="label")Xb(n,u,p);else if(p.kind==="points")qb(n,u,p);else if(p.kind==="morph")Kb(n,u,p);else if(p.kind==="surface")Qb(n,u,p,e);else if(p.kind==="body")Object.hasOwn(n.bodies??{},p.body)||M("body-layer",`panel ${u} draws ${p.body}, which is not a body`),p.trail!==void 0&&Yp(u,p.trail),p.size!==void 0&&!(p.size>0)&&M("panel",`panel ${u}: a body layer's size is ${p.size}, not positive`),vt(p.opacity,`panel ${u}: a body layer's opacity`,Et);else if(p.kind==="axes"){p.span!==void 0&&p.span!=="full"&&p.span!=="positive"&&p.span!=="box"&&M("panel",`panel ${u}: an axes layer's span is ${JSON.stringify(p.span)}, not full, positive, or box`),p.ticks!==void 0&&!(Array.isArray(p.ticks)&&p.ticks.every(m=>m==="x"||m==="y"))&&M("timeline",`panel ${u}: an axes layer's ticks are ${JSON.stringify(p.ticks)}, not a list of x and y`),p.size!==void 0&&!Di(p.size)&&M("timeline",`panel ${u}: an axes layer's size is not positive`);let g=p.titles;if(g!==void 0){(!Array.isArray(g)||g.length!==2)&&M("timeline",`panel ${u}: an axes layer's titles are ${JSON.stringify(g)}, not two texts`);for(let m of g)vl(n,m,`panel ${u}: an axes title`)}vt(p.opacity,`panel ${u}: an axes layer's opacity`,Et)}else p.kind==="grid"&&(p.labels!==void 0&&typeof p.labels!="boolean"&&M("panel",`panel ${u}: a grid layer's labels is ${JSON.stringify(p.labels)}, not a boolean`),vt(p.opacity,`panel ${u}: a grid layer's opacity`,Et))}for(let u of n.controls??[])if(Ob.includes(u.kind)||M("version",`control kind ${JSON.stringify(u.kind)} is not implemented`),"show_range"in u&&u.show_range!==void 0&&(!Array.isArray(u.show_range)||u.show_range.length!==2||!De(u.show_range[0])||!De(u.show_range[1])||u.show_range[0]>u.show_range[1])&&M("control",`control show_range ${JSON.stringify(u.show_range)} is not [t0, t1]`),u.kind==="slider"){let h=$e(n,u.input);h===void 0&&M("control",`input ${JSON.stringify(u.input)} is not declared`),h.kind==="parameter"?(u.domain===void 0&&M("control",`slider over parameter ${u.input} lacks domain`),_l(n,u.domain)):h.kind==="number"?u.domain!==void 0&&M("control",`slider over number input ${u.input} cannot have domain`):M("control",`input ${u.input} is a ${h.kind}, not parameter or number`)}else if(u.kind==="tabs")gt(n,u.input,"choice","control");else if(u.kind==="toggle")gt(n,u.input,"toggle","control"),u.color!==void 0&&!gn.test(u.color)&&M("control",`toggle control color ${JSON.stringify(u.color)} is not #rrggbb`);else if(u.kind==="points_2d")gt(n,u.input,"points_2d","control"),u.secondary_input!==void 0&&gt(n,u.secondary_input,"points_2d","control"),u.gain_input!==void 0&&gt(n,u.gain_input,"number","control"),u.period_input!==void 0&&gt(n,u.period_input,"number","control"),u.preset_input!==void 0&&gt(n,u.preset_input,"choice","control"),u.show_time_domain!==void 0&&gt(n,u.show_time_domain,"toggle","control");else if(u.kind==="action"){let h=f=>{typeof f=="number"?(!Number.isFinite(f)||f<0||f>a)&&M("action-control",`action time ${f} is outside [0, ${a}]`):typeof f=="string"?c.has(f)||M("action-control",`action target step ${JSON.stringify(f)} is not declared`):M("action-control",`action target ${JSON.stringify(f)} is not a time or step id`)};h(u.from),h(u.to)}for(let u of n.readouts??[])u.place!=="caption"&&u.place!=="panel"&&M("control",`readout place ${JSON.stringify(u.place)} is not caption or panel`),vl(n,u.parts,"a readout");if(e!==void 0){for(let[f,d]of Object.entries(n.bodies??{}))d.image!==void 0&&(e.has(d.image)||M("body",`body ${f} has image ${JSON.stringify(d.image)}, which the data container does not hold`),e.array(d.image).dtype!=="uint8"&&M("body",`body ${f} has image ${d.image}, which is not an array of uint8 bytes`));let u=new ar(n,e),h=new Set;for(let f of Object.values(n.panels))for(let d of f.layers)"clock"in d&&d.clock!==void 0&&d.clock.channel!==mt&&h.add(d.clock.channel);for(let f of Object.keys(n.trajectory_sets)){let d=u.get(f);for(let p of Object.keys(d.def.channels??{}))d.channel(p);for(let p of Object.keys(d.def.parameters??{})){let g=d.parameter(p);for(let m=0;m<d.trajectories;m++)Number.isFinite(g[m])||M("trajectory-set",`parameter ${p} of trajectory set ${f} is not finite at trajectory ${m}`)}for(let p of new Set([...n.clock.channels,...h])){if(p===mt||!d.hasChannel(p))continue;let g=d.channel(p);for(let m=0;m<d.trajectories;m++){let y=d.start(m),b=d.count(m),_=Math.sign(g[y+1]-g[y]);for(let x=0;x<b;x++)Number.isFinite(g[y+x])||M("monotone-clock-channel",`clock channel ${p} of trajectory set ${f} is not finite along trajectory ${m} at sample ${x}`),x+1<b&&!((g[y+x+1]-g[y+x])*_>0)&&M("monotone-clock-channel",`clock channel ${p} of trajectory set ${f} is not strictly monotone along trajectory ${m} at sample ${x}`);Number.isFinite(g[y+b-1]-g[y])||M("monotone-clock-channel",`clock channel ${p} of trajectory set ${f} has an infinite span along trajectory ${m}`)}}}}for(let u of t===void 0?[n.initial]:[n.initial,t])ex(n,r,u,i);return i}function ex(n,e,t,i){Ms(n,t);for(let l of zr(t.layout))Rh(l,"panel");let r=l=>{l.kind!=="panel"&&(l.ratio>0&&l.ratio<1||M("state",`a split ratio is ${String(l.ratio)}, not in (0, 1)`),l.keyframes!==void 0&&_i(l.keyframes,"a split",il),r(l.a),r(l.b))};r(t.layout);let s=Vt(n.clock),o=(n.readouts??[]).map(l=>({place:l.place,parts:l.parts.filter(c=>typeof c!="string"&&("parameter"in c||"attr"in c||"channel"in c))})).filter(l=>l.parts.length>0),a=zr(t.layout)[0];for(let[l,c]of Object.entries(t.panels)){for(let b of Object.keys(c.inputs??{})){let _=$e(n,b);_!==void 0&&_.scope!=="per_panel"&&i.push(`panel ${l} sets ${b}, which is shared and never read there`)}let u=n.panels[c.panel],h={scene:n,state:t,panel:c},f=Vr(h,u),d=(b,_,x,S=e.requirements(_,f))=>{let w=n.trajectory_sets[b],v=[...S.channels].filter(P=>P!==mt&&!Object.hasOwn(w.channels??{},P)),T=[...S.attrs].filter(P=>!Object.hasOwn(w.attrs??{},P));v.length+T.length>0&&M("transform-channels",`panel ${l}: trajectory set ${b} lacks ${[...v.map(P=>`channel ${P}`),...T.map(P=>`attribute ${P}`)].join(", ")} for ${x} in frame ${f}`);for(let P of Kp(e,n,_,f)){let C=n.frames[P].scale;C!==void 0&&typeof C=="object"&&"attr"in C&&(C.factor??1)*(w.attrs?.[C.attr]??NaN)+(C.offset??0)===0&&M("origin",`panel ${l}: the scale of frame ${P} is zero for trajectory set ${b}`)}},p=(b,_,x)=>{let S=n.trajectory_sets[b],v=(x===void 0?n.clock.channels:[x.channel]).filter(T=>T!==mt&&!Object.hasOwn(S.channels??{},T));v.length>0&&M("clock-channel-carried",`panel ${l}: trajectory set ${b}, ${_}, lacks clock channels ${v.join(", ")}`),x===void 0&&s>1&&S.periodic!==!0&&M("revolutions",`panel ${l}: trajectory set ${b}, ${_}, is not periodic, and the clock has ${s} revolutions`)},g=(b,_)=>{let x=n.trajectory_sets[b];if(_==="all"||"evenly_spaced"in _)return;if("index"in _){_.index>=x.trajectories&&M("members",`panel ${l}: member index ${_.index} is not below the trajectory count ${x.trajectories} of trajectory set ${b}`);return}let S=$e(n,_.input);S?.kind==="parameter"&&S.parameter!==ki&&!Object.hasOwn(x.parameters??{},S.parameter)&&M("members",`panel ${l}: trajectory set ${b} lacks parameter ${S.parameter} for input ${_.input}`)},m=Ft(h,u.reference.sets);if(m!==null){d(m,n.trajectory_sets[m].frame,"the reference"),p(m,"the reference"),g(m,u.reference.member);let b=n.trajectory_sets[m];for(let _ of o)if(_.place==="panel"||l===a)for(let x of _.parts)"parameter"in x&&x.parameter!==ki&&!Object.hasOwn(b.parameters??{},x.parameter)&&M("control",`the ${_.place} readout through panel ${l} names parameter ${x.parameter}, which trajectory set ${m} lacks`),"attr"in x&&!Object.hasOwn(b.attrs??{},x.attr)&&M("control",`the ${_.place} readout through panel ${l} names attribute ${x.attr}, which trajectory set ${m} lacks`),"channel"in x&&!Object.hasOwn(b.channels??{},x.channel)&&M("control",`the ${_.place} readout through panel ${l} names channel ${x.channel}, which trajectory set ${m} lacks`)}for(let b of u.layers)if(Es(h,b))if(b.kind==="trajectories"){let _=Ft(h,b.sets);if(_===null)continue;b.read_from!=="reference"?d(_,n.trajectory_sets[_].frame,"its trajectories"):m!==null&&d(m,n.trajectory_sets[_].frame,`a layer of trajectory set ${_} that reads from the reference`),g(_,b.members),b.highlight!==void 0&&g(_,{input:b.highlight.input});let x=n.trajectory_sets[_];qp(l,_,x,b.color);let S=typeof b.head=="object"?b.head.glow:void 0;S!==void 0&&!Object.hasOwn(x.channels??{},S.channel)&&M("timeline",`panel ${l}: trajectory set ${_} lacks channel ${S.channel} for a head's glow`);let w=(b.clock!==void 0||n.clock.mode==="epoch")&&(b.before==="hidden"||b.after==="hidden");((b.reveal??"none")!=="none"||or(b)||w)&&p(_,"on which a reading is taken",b.clock)}else if(b.kind==="arrow"){let _=Ft(h,b.sets);if(_===null)continue;d(_,n.trajectory_sets[_].frame,"its arrows"),g(_,b.members);let x=n.trajectory_sets[_];for(let w of b.vector)w!==mt&&!Object.hasOwn(x.channels??{},w)&&M("arrow",`panel ${l}: trajectory set ${_} lacks channel ${w} of an arrow layer's vector`);let S=b.scale;typeof S=="object"&&"attr"in S&&!Object.hasOwn(x.attrs??{},S.attr)&&M("transform-channels",`panel ${l}: trajectory set ${_} lacks attribute ${S.attr} for an arrow layer's scale`),p(_,"on which a reading is taken",b.clock)}else if(b.kind==="points"){let _=Ft(h,b.sets);if(_===null)continue;d(_,n.trajectory_sets[_].frame,"its points"),g(_,b.members),qp(l,_,n.trajectory_sets[_],b.marker?.color);let x=(b.clock!==void 0||n.clock.mode==="epoch")&&(b.before==="hidden"||b.after==="hidden");((b.reveal??"none")==="grow"||x)&&p(_,"on which a reading is taken",b.clock)}else if(b.kind==="label"){let _=b.at;if(_.sets!==void 0){let x=Ft(h,_.sets);if(x===null)continue;d(x,n.trajectory_sets[x].frame,"a label"),_.member>=n.trajectory_sets[x].trajectories&&M("label",`panel ${l}: a label names member ${_.member}, which is not a trajectory of trajectory set ${x}`),p(x,"on which a label reads",b.clock)}else _.frame!==void 0&&m!==null&&d(m,_.frame,"a label in another frame")}else if(b.kind==="inset_box"&&m!==null){let _=hl(h,b.panel);_!==null&&d(m,_.frame,`the inset box of panel ${b.panel}`)}else b.kind==="body"&&m!==null&&d(m,n.trajectory_sets[m].frame,`body ${b.body}`,e.bodyRequirements(b.body,f));let y=u.camera;if(y?.kind==="2d"&&y.keyframes!==void 0)for(let b of y.keyframes)for(let _ of b.follow??[]){let x=u.layers[_.layer];if(x?.kind!=="trajectories")continue;let S=Ft(h,x.sets);S!==null&&(_.member>=n.trajectory_sets[S].trajectories&&M("camera-keyframes",`panel ${l}: a camera keyframe follows member ${_.member}, which is not a trajectory of trajectory set ${S}`),p(S,"which a camera follows",x.clock))}if(l===a)for(let b of n.controls??[]){if(b.kind!=="slider"||b.domain===void 0)continue;let _=$e(n,b.input);if(!(_?.kind!=="parameter"||_.parameter===ki))for(let x of Lo(h,b.domain))Object.hasOwn(n.trajectory_sets[x].parameters??{},_.parameter)||M("control",`the slider over ${b.input} has trajectory set ${x} in its domain, which lacks parameter ${_.parameter}`)}}}function Kp(n,e,t,i,r=[]){let{up:s,down:o}=n.tree.path(t,i),a=new Set;for(let l of[...s,...o]){if(r.includes(l))continue;a.add(l);let c=e.frames[l].origin;if(c!==void 0&&!Array.isArray(c)){let u=e.bodies[c.body];for(let h of Kp(n,e,u.frame,e.frames[l].parent,[...r,l]))a.add(h)}}return a}function em(n,e,t,i){let r=new ar(n,e),s=new ir(n);Ms(n,t);let o=Vt(n.clock),a=t.clock.channel,l=Ip(n.clock.frame_count,i),c=Object.create(null);for(let[u,h]of Object.entries(t.panels)){let f=n.panels[h.panel],d={scene:n,state:t,panel:h},p=Vr(d,f),g=Ft(d,f.reference.sets),m=g===null?null:{set:r.get(g),trajectory:0};if(m){m.trajectory=ws(d,f.reference.member,m.set);let x=n.clock.channels.filter(S=>S!==mt&&!m.set.hasChannel(S));x.length>0&&M("clock-channel-carried",`the reference trajectory's trajectory set ${m.set.id} lacks clock channels ${x.join(", ")}`),o>1&&!m.set.periodic&&M("revolutions",`the reference trajectory's trajectory set ${m.set.id} is not periodic, and the clock has ${o} revolutions`)}let y={scope:d,frames:s,clock:n.clock,channel:a,q:l,display:p},b=[];for(let x of f.layers)if(tx.includes(x.kind)||M("version",`layer kind ${JSON.stringify(x.kind)} is not implemented`),!!Es(d,x))if(x.kind==="trajectories"){let S=Ft(d,x.sets);b.push(Up(Ni(y,x),x,S===null?null:r.get(S),m))}else if(x.kind==="arrow"){let S=Ft(d,x.sets);b.push(ml(Ni(y,x),x,S===null?null:r.get(S)))}else if(x.kind==="inset_box")b.push(gl(y,x,m));else if(x.kind==="body")b.push(Bp(y,x,m));else if(x.kind==="points"){let S=Ft(d,x.sets);b.push(bl(y,x,S===null?null:r.get(S)))}else if(x.kind==="label"){let S=x.at,w=S!==null&&typeof S=="object"&&"sets"in S?Ft(d,S.sets):null;b.push(yl(y,x,w===null?null:r.get(w),m))}else x.kind==="morph"?b.push(Gp(y,x)):x.kind==="surface"?b.push($p(y,x,e)):b.push({kind:x.kind});let _={frame:p,layers:b};f.camera?.kind==="2d"&&f.camera.keyframes!==void 0&&(_.camera=Ih(y,f,r,m)),c[u]=_}return{panels:c}}var tx=["trajectories","arrow","inset_box","body","axes","grid","label","points","morph","surface"],Qp=new WeakMap;function Ih(n,e,t,i){let r=e.camera,s=r.aspect==="free";(typeof r.keyframes!="object"||r.keyframes===null||Qp.get(r.keyframes)!==s)&&(sl(r.keyframes,s,"the camera"),Qp.set(r.keyframes,s));let o=r.keyframes,[a,l]=Ss(r),c=Ht(n.clock,n.q);return Cp(o,c,h=>{let f=o[h];if(f.follow===void 0)return f.center??null;let d=0,p=0,g=0;for(let y of f.follow){let b=e.layers[y.layer];(b===void 0||b.kind!=="trajectories")&&M("camera-keyframes",`a camera keyframe follows layer ${y.layer}, which is not a trajectories layer of the panel`);let _=Ft(n.scope,b.sets),x=Vp(n,b,_===null?null:t.get(_),y.member,i);x!==null&&(p+=x[a],g+=x[l],d++)}if(d===0)return f.center??null;let m=f.offset??[0,0];return[p/d+m[0],g/d+m[1]]})}var nx={viridis:[[.267,.005,.329],[.283,.141,.458],[.254,.265,.53],[.207,.372,.553],[.164,.471,.558],[.128,.567,.551],[.135,.659,.518],[.267,.749,.441],[.478,.821,.318],[.741,.873,.15],[.993,.906,.144]],plasma:[[.05,.03,.528],[.294,.012,.615],[.492,.012,.658],[.665,.139,.586],[.798,.28,.47],[.902,.418,.36],[.973,.585,.252],[.993,.771,.155],[.94,.975,.131]],magma:[[.001,0,.014],[.079,.054,.212],[.232,.06,.438],[.39,.1,.502],[.55,.161,.506],[.716,.215,.475],[.869,.288,.409],[.968,.44,.36],[.995,.624,.427],[.996,.813,.573],[.987,.991,.75]],cividis:[[0,.135,.304],[.086,.218,.396],[.243,.301,.42],[.365,.383,.432],[.478,.466,.448],[.588,.55,.437],[.702,.638,.402],[.822,.73,.343],[.945,.827,.244],[.996,.91,.149]],blues:[[.19,.42,.71],[.33,.6,.8],[.53,.76,.87],[.7,.85,.92],[.85,.93,.98]],reds:[[.72,.1,.1],[.89,.27,.2],[.98,.5,.36],[.99,.7,.58],[1,.86,.78]]};function Oi(n,e,t=[0,0,0]){let i=nx[n],r=Math.max(0,Math.min(1,e))*(i.length-1),s=Math.min(i.length-2,Math.floor(r)),o=r-s;for(let a=0;a<3;a++)t[a]=i[s][a]+(i[s+1][a]-i[s][a])*o;return t}function tm(n,e){let[t,i,r]=Oi(n,e);return`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}function Ut(n,e){let t=n.toLowerCase();return e.sceneForeground!==void 0&&t===e.sceneForeground.toLowerCase()?e.foreground:e.sceneBackground!==void 0&&t===e.sceneBackground.toLowerCase()?e.background:n}function Dh(n,e){return n===void 0?n:typeof n=="string"?Ut(n,e):No(n)?{...n,colors:n.colors.map(t=>Ut(t,e))}:n}function Do(n,e){return{...n,...n.color!==void 0?{color:Ut(n.color,e)}:{},...n.edge!==void 0?{edge:Ut(n.edge,e)}:{}}}var ix={background:"#000000",foreground:"#d8d8d8",grid:"#262626"};function wl(n){return{...ix,...n.theme??{}}}var rx={dark:{background:"#050505",foreground:"#f2f2ef",grid:"#232320"},light:{background:"#faf8f3",foreground:"#141413",grid:"#e3e0d8"}};function kh(n){let e=n.trim();if(/^#[0-9a-fA-F]{6}$/.test(e))return e.toLowerCase();if(/^#[0-9a-fA-F]{3}$/.test(e))return`#${[...e.slice(1)].map(a=>a+a).join("")}`.toLowerCase();if(e==="")return null;let t=document.createElement("canvas").getContext?.("2d",{willReadFrequently:!0});if(t==null)return null;let i=a=>(t.fillStyle=a,t.fillStyle=e,t.fillStyle);if(i("#000000")!==i("#ffffff"))return null;t.fillRect(0,0,1,1);let[r,s,o]=t.getImageData(0,0,1,1).data;return`#${[r,s,o].map(a=>a.toString(16).padStart(2,"0")).join("")}`}function im(n,e,t){let i=e==="dark"||e==="light",r=i?rx[e]:n,s={background:kh(t("--tycho-background"))??r.background,foreground:kh(t("--tycho-foreground"))??r.foreground,grid:kh(t("--tycho-grid"))??r.grid},o=t("--tycho-font")||n.font;return o&&(s.font=o),s.sceneForeground=n.foreground,s.sceneBackground=n.background,n.gutter!==void 0&&(s.gutter=i&&n.gutter.toLowerCase()===n.background.toLowerCase()?s.background:n.gutter),s}var Xr={accent:"#f0a050",hover:"#ffb366",press:"#d98a3a",violet:"#c050f0",violetText:"#d98cff",error:"#ff7a7a"};function rm(n){let e=Un(n.background,n.background,0),t=Un(n.foreground,n.foreground,0),i=Un(t,e,.95),r=et(e).reduce((s,o)=>s+o,0)<1.5;return{"--bg":e,"--fg":t,"--surface":i,"--raised":Un(t,e,.82),"--line":Un(t,e,.8),"--dim":Un(t,e,.287),"--track":Un(t,e,.574),"--gutter":n.gutter??Un(t,e,.9),"--header":`${i}cc`,"--accent":Xr.accent,"--accent-hover":Xr.hover,"--accent-press":Xr.press,"--accent-tint":Un(Xr.accent,i,.84),"--accent-2":Xr.violet,"--accent-2-text":Xr.violetText,"--accent-2-tint":"rgba(192, 80, 240, 0.16)","--error":Xr.error,"--highlight":r?"#ffffff":"#000000"}}function et(n){let e=/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(n);return e===null?[1,1,1]:[parseInt(e[1],16)/255,parseInt(e[2],16)/255,parseInt(e[3],16)/255]}function Un(n,e,t){let i=et(n),r=et(e),s=o=>Math.round(255*((1-t)*i[o]+t*r[o])).toString(16).padStart(2,"0");return`#${s(0)}${s(1)}${s(2)}`}function nm(n,e,t=[0,1]){let[i,r]=e,s=r===i?.5:Math.min(1,Math.max(0,(n-i)/(r-i)));return t[0]+s*(t[1]-t[0])}function sx(n){let e=1/0,t=-1/0;for(let i=0;i<n.length;i++){let r=n[i];r<e&&(e=r),r>t&&(t=r)}return e<=t?[e,t]:[0,1]}function ox(n,e){if(typeof n=="string")return n;let t=e?.(n.input);return(t!==void 0&&Object.hasOwn(n.map,t)?n.map[t]:void 0)??Object.values(n.map).find(r=>r!==void 0)??"viridis"}var No=n=>typeof n=="object"&&n!==null&&"thresholds"in n;function ax(n,e){let t=0;for(;t<n.length&&n[t]<e;)t++;return t}function Nh(n,e,t){let i="parameter"in n,r="parameter"in n?n.parameter:n.channel,s="parameter"in n?e.parameter(n.parameter,"panel"):e.channel(n.channel,"panel");return{id:ox(n.colormap,t),name:r,perTrajectory:i,values:s,range:n.range??sx(s),truncate:n.truncate??[0,1]}}function Oh(n,e,t,i){if(n===void 0)return{kind:"constant",rgb:t};if(typeof n=="string")return{kind:"constant",rgb:et(n)};if(No(n)){let a=e.channel(n.channel,"panel"),l=n.colors.map(et),c=new Float32Array(3*e.samples);for(let u=0;u<e.samples;u++)c.set(l[ax(n.thresholds,a[u])],3*u);return{kind:"sample",rgb:c}}let r=Nh(n,e,i),s=new Float32Array(3*e.samples),o=[0,0,0];if(r.perTrajectory)for(let a=0;a<e.trajectories;a++){Oi(r.id,nm(r.values[a],r.range,r.truncate),o);for(let l=e.start(a);l<e.start(a)+e.count(a);l++)s.set(o,3*l)}else for(let a=0;a<e.samples;a++)s.set(Oi(r.id,nm(r.values[a],r.range,r.truncate),o),3*a);return{kind:"sample",rgb:s}}function Fh(n,e=12){let t=[],i=[0,0,0];for(let r=0;r<e;r++){let s=r/(e-1);Oi(n.id,n.truncate[0]+s*(n.truncate[1]-n.truncate[0]),i),t.push([s,`rgb(${i.map(o=>Math.round(255*o)).join(",")})`])}return t}function sm(n,e=12){return`linear-gradient(to top, ${Fh(n,e).map(([t,i])=>`${i} ${(100*t).toFixed(1)}%`).join(", ")})`}var qh=(n,e,t)=>{if(!e.has(n))throw TypeError("Cannot "+t)},N=(n,e,t)=>(qh(n,e,"read from private field"),t?t.call(n):e.get(n)),qe=(n,e,t)=>{if(e.has(n))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(n):e.set(n,t)},ln=(n,e,t,i)=>(qh(n,e,"write to private field"),i?i.call(n,t):e.set(n,t),t),lx=(n,e,t,i)=>({set _(r){ln(n,e,r,t)},get _(){return N(n,e,i)}}),it=(n,e,t)=>(qh(n,e,"access private method"),t),st=new Uint8Array(8),Ai=new DataView(st.buffer),Jt=n=>[(n%256+256)%256],dt=n=>(Ai.setUint16(0,n,!1),[st[0],st[1]]),cx=n=>(Ai.setInt16(0,n,!1),[st[0],st[1]]),am=n=>(Ai.setUint32(0,n,!1),[st[1],st[2],st[3]]),Se=n=>(Ai.setUint32(0,n,!1),[st[0],st[1],st[2],st[3]]),ux=n=>(Ai.setInt32(0,n,!1),[st[0],st[1],st[2],st[3]]),Qr=n=>(Ai.setUint32(0,Math.floor(n/2**32),!1),Ai.setUint32(4,n,!1),[st[0],st[1],st[2],st[3],st[4],st[5],st[6],st[7]]),Yh=n=>(Ai.setInt16(0,2**8*n,!1),[st[0],st[1]]),Ei=n=>(Ai.setInt32(0,2**16*n,!1),[st[0],st[1],st[2],st[3]]),Uh=n=>(Ai.setInt32(0,2**30*n,!1),[st[0],st[1],st[2],st[3]]),ei=(n,e=!1)=>{let t=Array(n.length).fill(null).map((i,r)=>n.charCodeAt(r));return e&&t.push(0),t},Pl=n=>n&&n[n.length-1],Jh=n=>{let e;for(let t of n)(!e||t.presentationTimestamp>e.presentationTimestamp)&&(e=t);return e},Ti=(n,e,t=!0)=>{let i=n*e;return t?Math.round(i):i},lm=n=>{let e=n*(Math.PI/180),t=Math.cos(e),i=Math.sin(e);return[t,i,0,-i,t,0,0,0,1]},cm=lm(0),um=n=>[Ei(n[0]),Ei(n[1]),Uh(n[2]),Ei(n[3]),Ei(n[4]),Uh(n[5]),Ei(n[6]),Ei(n[7]),Uh(n[8])],Uo=n=>!n||typeof n!="object"?n:Array.isArray(n)?n.map(Uo):Object.fromEntries(Object.entries(n).map(([e,t])=>[e,Uo(t)])),Ps=n=>n>=0&&n<2**32,$t=(n,e,t)=>({type:n,contents:e&&new Uint8Array(e.flat(10)),children:t}),At=(n,e,t,i,r)=>$t(n,[Jt(e),am(t),i??[]],r),hx=n=>{let e=512;return n.fragmented?$t("ftyp",[ei("iso5"),Se(e),ei("iso5"),ei("iso6"),ei("mp41")]):$t("ftyp",[ei("isom"),Se(e),ei("isom"),n.holdsAvc?ei("avc1"):[],ei("mp41")])},Bh=n=>({type:"mdat",largeSize:n}),dx=n=>({type:"free",size:n}),El=(n,e,t=!1)=>$t("moov",null,[fx(e,n),...n.map(i=>px(i,e)),t?Wx(n):null]),fx=(n,e)=>{let t=Ti(Math.max(0,...e.filter(o=>o.samples.length>0).map(o=>{let a=Jh(o.samples);return a.presentationTimestamp+a.duration})),Vh),i=Math.max(...e.map(o=>o.id))+1,r=!Ps(n)||!Ps(t),s=r?Qr:Se;return At("mvhd",+r,0,[s(n),s(n),Se(Vh),s(t),Ei(1),Yh(1),Array(10).fill(0),um(cm),Array(24).fill(0),Se(i)])},px=(n,e)=>$t("trak",null,[mx(n,e),gx(n,e)]),mx=(n,e)=>{let t=Jh(n.samples),i=Ti(t?t.presentationTimestamp+t.duration:0,Vh),r=!Ps(e)||!Ps(i),s=r?Qr:Se,o;return n.info.type==="video"?o=typeof n.info.rotation=="number"?lm(n.info.rotation):n.info.rotation:o=cm,At("tkhd",+r,3,[s(e),s(e),Se(n.id),Se(0),s(i),Array(8).fill(0),dt(0),dt(0),Yh(n.info.type==="audio"?1:0),dt(0),um(o),Ei(n.info.type==="video"?n.info.width:0),Ei(n.info.type==="video"?n.info.height:0)])},gx=(n,e)=>$t("mdia",null,[yx(n,e),bx(n.info.type==="video"?"vide":"soun"),xx(n)]),yx=(n,e)=>{let t=Jh(n.samples),i=Ti(t?t.presentationTimestamp+t.duration:0,n.timescale),r=!Ps(e)||!Ps(i),s=r?Qr:Se;return At("mdhd",+r,0,[s(e),s(e),Se(n.timescale),s(i),dt(21956),dt(0)])},bx=n=>At("hdlr",0,0,[ei("mhlr"),ei(n),Se(0),Se(0),Se(0),ei("mp4-muxer-hdlr",!0)]),xx=n=>$t("minf",null,[n.info.type==="video"?vx():_x(),Sx(),Ex(n)]),vx=()=>At("vmhd",0,1,[dt(0),dt(0),dt(0),dt(0)]),_x=()=>At("smhd",0,0,[dt(0),dt(0)]),Sx=()=>$t("dinf",null,[Mx()]),Mx=()=>At("dref",0,0,[Se(1)],[wx()]),wx=()=>At("url ",0,1),Ex=n=>{let e=n.compositionTimeOffsetTable.length>1||n.compositionTimeOffsetTable.some(t=>t.sampleCompositionTimeOffset!==0);return $t("stbl",null,[Tx(n),Bx(n),zx(n),Hx(n),Vx(n),Gx(n),e?$x(n):null])},Tx=n=>At("stsd",0,0,[Se(1)],[n.info.type==="video"?Ax(tv[n.info.codec],n):Ox(iv[n.info.codec],n)]),Ax=(n,e)=>$t(n,[Array(6).fill(0),dt(1),dt(0),dt(0),Array(12).fill(0),dt(e.info.width),dt(e.info.height),Se(4718592),Se(4718592),Se(0),dt(1),Array(32).fill(0),dt(24),cx(65535)],[nv[e.info.codec](e),e.info.decoderConfig.colorSpace?Lx(e):null]),Cx={bt709:1,bt470bg:5,smpte170m:6},Rx={bt709:1,smpte170m:6,"iec61966-2-1":13},Px={rgb:0,bt709:1,bt470bg:5,smpte170m:6},Lx=n=>$t("colr",[ei("nclx"),dt(Cx[n.info.decoderConfig.colorSpace.primaries]),dt(Rx[n.info.decoderConfig.colorSpace.transfer]),dt(Px[n.info.decoderConfig.colorSpace.matrix]),Jt((n.info.decoderConfig.colorSpace.fullRange?1:0)<<7)]),Ix=n=>n.info.decoderConfig&&$t("avcC",[...new Uint8Array(n.info.decoderConfig.description)]),kx=n=>n.info.decoderConfig&&$t("hvcC",[...new Uint8Array(n.info.decoderConfig.description)]),Dx=n=>{if(!n.info.decoderConfig)return null;let e=n.info.decoderConfig;if(!e.colorSpace)throw new Error("'colorSpace' is required in the decoder config for VP9.");let t=e.codec.split("."),i=Number(t[1]),r=Number(t[2]),a=(Number(t[3])<<4)+(0<<1)+Number(e.colorSpace.fullRange);return At("vpcC",1,0,[Jt(i),Jt(r),Jt(a),Jt(2),Jt(2),Jt(2),dt(0)])},Nx=()=>{let t=(1<<7)+1;return $t("av1C",[t,0,0,0])},Ox=(n,e)=>$t(n,[Array(6).fill(0),dt(1),dt(0),dt(0),Se(0),dt(e.info.numberOfChannels),dt(16),dt(0),dt(0),Ei(e.info.sampleRate)],[rv[e.info.codec](e)]),Fx=n=>{let e=new Uint8Array(n.info.decoderConfig.description);return At("esds",0,0,[Se(58753152),Jt(32+e.byteLength),dt(1),Jt(0),Se(75530368),Jt(18+e.byteLength),Jt(64),Jt(21),am(0),Se(130071),Se(130071),Se(92307584),Jt(e.byteLength),...e,Se(109084800),Jt(1),Jt(2)])},Ux=n=>{let e=3840,t=0,i=n.info.decoderConfig?.description;if(i){if(i.byteLength<18)throw new TypeError("Invalid decoder description provided for Opus; must be at least 18 bytes long.");let r=ArrayBuffer.isView(i)?new DataView(i.buffer,i.byteOffset,i.byteLength):new DataView(i);e=r.getUint16(10,!0),t=r.getInt16(14,!0)}return $t("dOps",[Jt(0),Jt(n.info.numberOfChannels),dt(e),Se(n.info.sampleRate),Yh(t),Jt(0)])},Bx=n=>At("stts",0,0,[Se(n.timeToSampleTable.length),n.timeToSampleTable.map(e=>[Se(e.sampleCount),Se(e.sampleDelta)])]),zx=n=>{if(n.samples.every(t=>t.type==="key"))return null;let e=[...n.samples.entries()].filter(([,t])=>t.type==="key");return At("stss",0,0,[Se(e.length),e.map(([t])=>Se(t+1))])},Hx=n=>At("stsc",0,0,[Se(n.compactlyCodedChunkTable.length),n.compactlyCodedChunkTable.map(e=>[Se(e.firstChunk),Se(e.samplesPerChunk),Se(1)])]),Vx=n=>At("stsz",0,0,[Se(0),Se(n.samples.length),n.samples.map(e=>Se(e.size))]),Gx=n=>n.finalizedChunks.length>0&&Pl(n.finalizedChunks).offset>=2**32?At("co64",0,0,[Se(n.finalizedChunks.length),n.finalizedChunks.map(e=>Qr(e.offset))]):At("stco",0,0,[Se(n.finalizedChunks.length),n.finalizedChunks.map(e=>Se(e.offset))]),$x=n=>At("ctts",0,0,[Se(n.compositionTimeOffsetTable.length),n.compositionTimeOffsetTable.map(e=>[Se(e.sampleCount),Se(e.sampleCompositionTimeOffset)])]),Wx=n=>$t("mvex",null,n.map(jx)),jx=n=>At("trex",0,0,[Se(n.id),Se(1),Se(0),Se(0),Se(0)]),om=(n,e)=>$t("moof",null,[Xx(n),...e.map(qx)]),Xx=n=>At("mfhd",0,0,[Se(n)]),hm=n=>{let e=0,t=0,i=0,r=0,s=n.type==="delta";return t|=+s,s?e|=1:e|=2,e<<24|t<<16|i<<8|r},qx=n=>$t("traf",null,[Yx(n),Jx(n),Zx(n)]),Yx=n=>{let e=0;e|=8,e|=16,e|=32,e|=131072;let t=n.currentChunk.samples[1]??n.currentChunk.samples[0],i={duration:t.timescaleUnitsToNextSample,size:t.size,flags:hm(t)};return At("tfhd",0,e,[Se(n.id),Se(i.duration),Se(i.size),Se(i.flags)])},Jx=n=>At("tfdt",1,0,[Qr(Ti(n.currentChunk.startTimestamp,n.timescale))]),Zx=n=>{let e=n.currentChunk.samples.map(g=>g.timescaleUnitsToNextSample),t=n.currentChunk.samples.map(g=>g.size),i=n.currentChunk.samples.map(hm),r=n.currentChunk.samples.map(g=>Ti(g.presentationTimestamp-g.decodeTimestamp,n.timescale)),s=new Set(e),o=new Set(t),a=new Set(i),l=new Set(r),c=a.size===2&&i[0]!==i[1],u=s.size>1,h=o.size>1,f=!c&&a.size>1,d=l.size>1||[...l].some(g=>g!==0),p=0;return p|=1,p|=4*+c,p|=256*+u,p|=512*+h,p|=1024*+f,p|=2048*+d,At("trun",1,p,[Se(n.currentChunk.samples.length),Se(n.currentChunk.offset-n.currentChunk.moofOffset||0),c?Se(i[0]):[],n.currentChunk.samples.map((g,m)=>[u?Se(e[m]):[],h?Se(t[m]):[],f?Se(i[m]):[],d?ux(r[m]):[]])])},Kx=n=>$t("mfra",null,[...n.map(Qx),ev()]),Qx=(n,e)=>At("tfra",1,0,[Se(n.id),Se(63),Se(n.finalizedChunks.length),n.finalizedChunks.map(i=>[Qr(Ti(i.startTimestamp,n.timescale)),Qr(i.moofOffset),Se(e+1),Se(1),Se(1)])]),ev=()=>At("mfro",0,0,[Se(0)]),tv={avc:"avc1",hevc:"hvc1",vp9:"vp09",av1:"av01"},nv={avc:Ix,hevc:kx,vp9:Dx,av1:Nx},iv={aac:"mp4a",opus:"Opus"},rv={aac:Fx,opus:Ux};var Ol=class{},Zh=class extends Ol{constructor(){super(...arguments),this.buffer=null}},dm=class extends Ol{constructor(n){if(super(),this.options=n,typeof n!="object")throw new TypeError("StreamTarget requires an options object to be passed to its constructor.");if(n.onData){if(typeof n.onData!="function")throw new TypeError("options.onData, when provided, must be a function.");if(n.onData.length<2)throw new TypeError("options.onData, when provided, must be a function that takes in at least two arguments (data and position). Ignoring the position argument, which specifies the byte offset at which the data is to be written, can lead to broken outputs.")}if(n.chunked!==void 0&&typeof n.chunked!="boolean")throw new TypeError("options.chunked, when provided, must be a boolean.");if(n.chunkSize!==void 0&&(!Number.isInteger(n.chunkSize)||n.chunkSize<1024))throw new TypeError("options.chunkSize, when provided, must be an integer and not smaller than 1024.")}},sv=class extends Ol{constructor(n,e){if(super(),this.stream=n,this.options=e,!(n instanceof FileSystemWritableFileStream))throw new TypeError("FileSystemWritableFileStreamTarget requires a FileSystemWritableFileStream instance.");if(e!==void 0&&typeof e!="object")throw new TypeError("FileSystemWritableFileStreamTarget's options, when provided, must be an object.");if(e&&e.chunkSize!==void 0&&(!Number.isInteger(e.chunkSize)||e.chunkSize<=0))throw new TypeError("options.chunkSize, when provided, must be a positive integer")}},qr,As,fm=class{constructor(){this.pos=0,qe(this,qr,new Uint8Array(8)),qe(this,As,new DataView(N(this,qr).buffer)),this.offsets=new WeakMap}seek(n){this.pos=n}writeU32(n){N(this,As).setUint32(0,n,!1),this.write(N(this,qr).subarray(0,4))}writeU64(n){N(this,As).setUint32(0,Math.floor(n/2**32),!1),N(this,As).setUint32(4,n,!1),this.write(N(this,qr).subarray(0,8))}writeAscii(n){for(let e=0;e<n.length;e++)N(this,As).setUint8(e%8,n.charCodeAt(e)),e%8===7&&this.write(N(this,qr));n.length%8!==0&&this.write(N(this,qr).subarray(0,n.length%8))}writeBox(n){if(this.offsets.set(n,this.pos),n.contents&&!n.children)this.writeBoxHeader(n,n.size??n.contents.byteLength+8),this.write(n.contents);else{let e=this.pos;if(this.writeBoxHeader(n,0),n.contents&&this.write(n.contents),n.children)for(let r of n.children)r&&this.writeBox(r);let t=this.pos,i=n.size??t-e;this.seek(e),this.writeBoxHeader(n,i),this.seek(t)}}writeBoxHeader(n,e){this.writeU32(n.largeSize?1:e),this.writeAscii(n.type),n.largeSize&&this.writeU64(e)}measureBoxHeader(n){return 8+(n.largeSize?8:0)}patchBox(n){let e=this.pos;this.seek(this.offsets.get(n)),this.writeBox(n),this.seek(e)}measureBox(n){if(n.contents&&!n.children)return this.measureBoxHeader(n)+n.contents.byteLength;{let e=this.measureBoxHeader(n);if(n.contents&&(e+=n.contents.byteLength),n.children)for(let t of n.children)t&&(e+=this.measureBox(t));return e}}};qr=new WeakMap;As=new WeakMap;var Tl,Kr,Go,Oo,Al,zh,ov=class extends fm{constructor(n){super(),qe(this,Al),qe(this,Tl,void 0),qe(this,Kr,new ArrayBuffer(2**16)),qe(this,Go,new Uint8Array(N(this,Kr))),qe(this,Oo,0),ln(this,Tl,n)}write(n){it(this,Al,zh).call(this,this.pos+n.byteLength),N(this,Go).set(n,this.pos),this.pos+=n.byteLength,ln(this,Oo,Math.max(N(this,Oo),this.pos))}finalize(){it(this,Al,zh).call(this,this.pos),N(this,Tl).buffer=N(this,Kr).slice(0,Math.max(N(this,Oo),this.pos))}};Tl=new WeakMap;Kr=new WeakMap;Go=new WeakMap;Oo=new WeakMap;Al=new WeakSet;zh=function(n){let e=N(this,Kr).byteLength;for(;e<n;)e*=2;if(e===N(this,Kr).byteLength)return;let t=new ArrayBuffer(e),i=new Uint8Array(t);i.set(N(this,Go),0),ln(this,Kr,t),ln(this,Go,i)};var av=2**24,lv=2,Bo,Yr,Fo,Ui,zn,Ll,Hh,Kh,pm,Qh,mm,zo,Il,ed=class extends fm{constructor(n){super(),qe(this,Ll),qe(this,Kh),qe(this,Qh),qe(this,zo),qe(this,Bo,void 0),qe(this,Yr,[]),qe(this,Fo,void 0),qe(this,Ui,void 0),qe(this,zn,[]),ln(this,Bo,n),ln(this,Fo,n.options?.chunked??!1),ln(this,Ui,n.options?.chunkSize??av)}write(n){N(this,Yr).push({data:n.slice(),start:this.pos}),this.pos+=n.byteLength}flush(){if(N(this,Yr).length===0)return;let n=[],e=[...N(this,Yr)].sort((t,i)=>t.start-i.start);n.push({start:e[0].start,size:e[0].data.byteLength});for(let t=1;t<e.length;t++){let i=n[n.length-1],r=e[t];r.start<=i.start+i.size?i.size=Math.max(i.size,r.start+r.data.byteLength-i.start):n.push({start:r.start,size:r.data.byteLength})}for(let t of n){t.data=new Uint8Array(t.size);for(let i of N(this,Yr))t.start<=i.start&&i.start<t.start+t.size&&t.data.set(i.data,i.start-t.start);N(this,Fo)?(it(this,Ll,Hh).call(this,t.data,t.start),it(this,zo,Il).call(this)):N(this,Bo).options.onData?.(t.data,t.start)}N(this,Yr).length=0}finalize(){N(this,Fo)&&it(this,zo,Il).call(this,!0)}};Bo=new WeakMap;Yr=new WeakMap;Fo=new WeakMap;Ui=new WeakMap;zn=new WeakMap;Ll=new WeakSet;Hh=function(n,e){let t=N(this,zn).findIndex(a=>a.start<=e&&e<a.start+N(this,Ui));t===-1&&(t=it(this,Qh,mm).call(this,e));let i=N(this,zn)[t],r=e-i.start,s=n.subarray(0,Math.min(N(this,Ui)-r,n.byteLength));i.data.set(s,r);let o={start:r,end:r+s.byteLength};if(it(this,Kh,pm).call(this,i,o),i.written[0].start===0&&i.written[0].end===N(this,Ui)&&(i.shouldFlush=!0),N(this,zn).length>lv){for(let a=0;a<N(this,zn).length-1;a++)N(this,zn)[a].shouldFlush=!0;it(this,zo,Il).call(this)}s.byteLength<n.byteLength&&it(this,Ll,Hh).call(this,n.subarray(s.byteLength),e+s.byteLength)};Kh=new WeakSet;pm=function(n,e){let t=0,i=n.written.length-1,r=-1;for(;t<=i;){let s=Math.floor(t+(i-t+1)/2);n.written[s].start<=e.start?(t=s+1,r=s):i=s-1}for(n.written.splice(r+1,0,e),(r===-1||n.written[r].end<e.start)&&r++;r<n.written.length-1&&n.written[r].end>=n.written[r+1].start;)n.written[r].end=Math.max(n.written[r].end,n.written[r+1].end),n.written.splice(r+1,1)};Qh=new WeakSet;mm=function(n){let t={start:Math.floor(n/N(this,Ui))*N(this,Ui),data:new Uint8Array(N(this,Ui)),written:[],shouldFlush:!1};return N(this,zn).push(t),N(this,zn).sort((i,r)=>i.start-r.start),N(this,zn).indexOf(t)};zo=new WeakSet;Il=function(n=!1){for(let e=0;e<N(this,zn).length;e++){let t=N(this,zn)[e];if(!(!t.shouldFlush&&!n)){for(let i of t.written)N(this,Bo).options.onData?.(t.data.subarray(i.start,i.end),t.start+i.start);N(this,zn).splice(e--,1)}}};var cv=class extends ed{constructor(n){super(new dm({onData:(e,t)=>n.stream.write({type:"write",data:e,position:t}),chunked:!0,chunkSize:n.options?.chunkSize}))}},Vh=1e3,uv=["avc","hevc","vp9","av1"],hv=["aac","opus"],dv=2082844800,fv=["strict","offset","cross-track-offset"],Ie,Be,kl,Bn,yn,an,Cs,Rs,td,Jr,Zr,Ho,Gh,gm,$h,ym,nd,bm,Wh,xm,id,vm,Cl,jh,wi,Fi,rd,_m,Vo,Dl,Nl,sd,Ls,$o,Rl,Xh,Sm=class{constructor(n){if(qe(this,Gh),qe(this,$h),qe(this,nd),qe(this,Wh),qe(this,id),qe(this,Cl),qe(this,wi),qe(this,rd),qe(this,Vo),qe(this,Nl),qe(this,Ls),qe(this,Rl),qe(this,Ie,void 0),qe(this,Be,void 0),qe(this,kl,void 0),qe(this,Bn,void 0),qe(this,yn,null),qe(this,an,null),qe(this,Cs,Math.floor(Date.now()/1e3)+dv),qe(this,Rs,[]),qe(this,td,1),qe(this,Jr,[]),qe(this,Zr,[]),qe(this,Ho,!1),it(this,Gh,gm).call(this,n),n.video=Uo(n.video),n.audio=Uo(n.audio),n.fastStart=Uo(n.fastStart),this.target=n.target,ln(this,Ie,{firstTimestampBehavior:"strict",...n}),n.target instanceof Zh)ln(this,Be,new ov(n.target));else if(n.target instanceof dm)ln(this,Be,new ed(n.target));else if(n.target instanceof sv)ln(this,Be,new cv(n.target));else throw new Error(`Invalid target: ${n.target}`);it(this,Wh,xm).call(this),it(this,$h,ym).call(this)}addVideoChunk(n,e,t,i){if(!(n instanceof EncodedVideoChunk))throw new TypeError("addVideoChunk's first argument (sample) must be of type EncodedVideoChunk.");if(e&&typeof e!="object")throw new TypeError("addVideoChunk's second argument (meta), when provided, must be an object.");if(t!==void 0&&(!Number.isFinite(t)||t<0))throw new TypeError("addVideoChunk's third argument (timestamp), when provided, must be a non-negative real number.");if(i!==void 0&&!Number.isFinite(i))throw new TypeError("addVideoChunk's fourth argument (compositionTimeOffset), when provided, must be a real number.");let r=new Uint8Array(n.byteLength);n.copyTo(r),this.addVideoChunkRaw(r,n.type,t??n.timestamp,n.duration,e,i)}addVideoChunkRaw(n,e,t,i,r,s){if(!(n instanceof Uint8Array))throw new TypeError("addVideoChunkRaw's first argument (data) must be an instance of Uint8Array.");if(e!=="key"&&e!=="delta")throw new TypeError("addVideoChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(t)||t<0)throw new TypeError("addVideoChunkRaw's third argument (timestamp) must be a non-negative real number.");if(!Number.isFinite(i)||i<0)throw new TypeError("addVideoChunkRaw's fourth argument (duration) must be a non-negative real number.");if(r&&typeof r!="object")throw new TypeError("addVideoChunkRaw's fifth argument (meta), when provided, must be an object.");if(s!==void 0&&!Number.isFinite(s))throw new TypeError("addVideoChunkRaw's sixth argument (compositionTimeOffset), when provided, must be a real number.");if(it(this,Rl,Xh).call(this),!N(this,Ie).video)throw new Error("No video track declared.");if(typeof N(this,Ie).fastStart=="object"&&N(this,yn).samples.length===N(this,Ie).fastStart.expectedVideoChunks)throw new Error(`Cannot add more video chunks than specified in 'fastStart' (${N(this,Ie).fastStart.expectedVideoChunks}).`);let o=it(this,Cl,jh).call(this,N(this,yn),n,e,t,i,r,s);if(N(this,Ie).fastStart==="fragmented"&&N(this,an)){for(;N(this,Zr).length>0&&N(this,Zr)[0].decodeTimestamp<=o.decodeTimestamp;){let a=N(this,Zr).shift();it(this,wi,Fi).call(this,N(this,an),a)}o.decodeTimestamp<=N(this,an).lastDecodeTimestamp?it(this,wi,Fi).call(this,N(this,yn),o):N(this,Jr).push(o)}else it(this,wi,Fi).call(this,N(this,yn),o)}addAudioChunk(n,e,t){if(!(n instanceof EncodedAudioChunk))throw new TypeError("addAudioChunk's first argument (sample) must be of type EncodedAudioChunk.");if(e&&typeof e!="object")throw new TypeError("addAudioChunk's second argument (meta), when provided, must be an object.");if(t!==void 0&&(!Number.isFinite(t)||t<0))throw new TypeError("addAudioChunk's third argument (timestamp), when provided, must be a non-negative real number.");let i=new Uint8Array(n.byteLength);n.copyTo(i),this.addAudioChunkRaw(i,n.type,t??n.timestamp,n.duration,e)}addAudioChunkRaw(n,e,t,i,r){if(!(n instanceof Uint8Array))throw new TypeError("addAudioChunkRaw's first argument (data) must be an instance of Uint8Array.");if(e!=="key"&&e!=="delta")throw new TypeError("addAudioChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(t)||t<0)throw new TypeError("addAudioChunkRaw's third argument (timestamp) must be a non-negative real number.");if(!Number.isFinite(i)||i<0)throw new TypeError("addAudioChunkRaw's fourth argument (duration) must be a non-negative real number.");if(r&&typeof r!="object")throw new TypeError("addAudioChunkRaw's fifth argument (meta), when provided, must be an object.");if(it(this,Rl,Xh).call(this),!N(this,Ie).audio)throw new Error("No audio track declared.");if(typeof N(this,Ie).fastStart=="object"&&N(this,an).samples.length===N(this,Ie).fastStart.expectedAudioChunks)throw new Error(`Cannot add more audio chunks than specified in 'fastStart' (${N(this,Ie).fastStart.expectedAudioChunks}).`);let s=it(this,Cl,jh).call(this,N(this,an),n,e,t,i,r);if(N(this,Ie).fastStart==="fragmented"&&N(this,yn)){for(;N(this,Jr).length>0&&N(this,Jr)[0].decodeTimestamp<=s.decodeTimestamp;){let o=N(this,Jr).shift();it(this,wi,Fi).call(this,N(this,yn),o)}s.decodeTimestamp<=N(this,yn).lastDecodeTimestamp?it(this,wi,Fi).call(this,N(this,an),s):N(this,Zr).push(s)}else it(this,wi,Fi).call(this,N(this,an),s)}finalize(){if(N(this,Ho))throw new Error("Cannot finalize a muxer more than once.");if(N(this,Ie).fastStart==="fragmented"){for(let e of N(this,Jr))it(this,wi,Fi).call(this,N(this,yn),e);for(let e of N(this,Zr))it(this,wi,Fi).call(this,N(this,an),e);it(this,Nl,sd).call(this,!1)}else N(this,yn)&&it(this,Vo,Dl).call(this,N(this,yn)),N(this,an)&&it(this,Vo,Dl).call(this,N(this,an));let n=[N(this,yn),N(this,an)].filter(Boolean);if(N(this,Ie).fastStart==="in-memory"){let e;for(let i=0;i<2;i++){let r=El(n,N(this,Cs)),s=N(this,Be).measureBox(r);e=N(this,Be).measureBox(N(this,Bn));let o=N(this,Be).pos+s+e;for(let a of N(this,Rs)){a.offset=o;for(let{data:l}of a.samples)o+=l.byteLength,e+=l.byteLength}if(o<2**32)break;e>=2**32&&(N(this,Bn).largeSize=!0)}let t=El(n,N(this,Cs));N(this,Be).writeBox(t),N(this,Bn).size=e,N(this,Be).writeBox(N(this,Bn));for(let i of N(this,Rs))for(let r of i.samples)N(this,Be).write(r.data),r.data=null}else if(N(this,Ie).fastStart==="fragmented"){let e=N(this,Be).pos,t=Kx(n);N(this,Be).writeBox(t);let i=N(this,Be).pos-e;N(this,Be).seek(N(this,Be).pos-4),N(this,Be).writeU32(i)}else{let e=N(this,Be).offsets.get(N(this,Bn)),t=N(this,Be).pos-e;N(this,Bn).size=t,N(this,Bn).largeSize=t>=2**32,N(this,Be).patchBox(N(this,Bn));let i=El(n,N(this,Cs));if(typeof N(this,Ie).fastStart=="object"){N(this,Be).seek(N(this,kl)),N(this,Be).writeBox(i);let r=e-N(this,Be).pos;N(this,Be).writeBox(dx(r))}else N(this,Be).writeBox(i)}it(this,Ls,$o).call(this),N(this,Be).finalize(),ln(this,Ho,!0)}};Ie=new WeakMap;Be=new WeakMap;kl=new WeakMap;Bn=new WeakMap;yn=new WeakMap;an=new WeakMap;Cs=new WeakMap;Rs=new WeakMap;td=new WeakMap;Jr=new WeakMap;Zr=new WeakMap;Ho=new WeakMap;Gh=new WeakSet;gm=function(n){if(typeof n!="object")throw new TypeError("The muxer requires an options object to be passed to its constructor.");if(!(n.target instanceof Ol))throw new TypeError("The target must be provided and an instance of Target.");if(n.video){if(!uv.includes(n.video.codec))throw new TypeError(`Unsupported video codec: ${n.video.codec}`);if(!Number.isInteger(n.video.width)||n.video.width<=0)throw new TypeError(`Invalid video width: ${n.video.width}. Must be a positive integer.`);if(!Number.isInteger(n.video.height)||n.video.height<=0)throw new TypeError(`Invalid video height: ${n.video.height}. Must be a positive integer.`);let e=n.video.rotation;if(typeof e=="number"&&![0,90,180,270].includes(e))throw new TypeError(`Invalid video rotation: ${e}. Has to be 0, 90, 180 or 270.`);if(Array.isArray(e)&&(e.length!==9||e.some(t=>typeof t!="number")))throw new TypeError(`Invalid video transformation matrix: ${e.join()}`);if(n.video.frameRate!==void 0&&(!Number.isInteger(n.video.frameRate)||n.video.frameRate<=0))throw new TypeError(`Invalid video frame rate: ${n.video.frameRate}. Must be a positive integer.`)}if(n.audio){if(!hv.includes(n.audio.codec))throw new TypeError(`Unsupported audio codec: ${n.audio.codec}`);if(!Number.isInteger(n.audio.numberOfChannels)||n.audio.numberOfChannels<=0)throw new TypeError(`Invalid number of audio channels: ${n.audio.numberOfChannels}. Must be a positive integer.`);if(!Number.isInteger(n.audio.sampleRate)||n.audio.sampleRate<=0)throw new TypeError(`Invalid audio sample rate: ${n.audio.sampleRate}. Must be a positive integer.`)}if(n.firstTimestampBehavior&&!fv.includes(n.firstTimestampBehavior))throw new TypeError(`Invalid first timestamp behavior: ${n.firstTimestampBehavior}`);if(typeof n.fastStart=="object"){if(n.video){if(n.fastStart.expectedVideoChunks===void 0)throw new TypeError("'fastStart' is an object but is missing property 'expectedVideoChunks'.");if(!Number.isInteger(n.fastStart.expectedVideoChunks)||n.fastStart.expectedVideoChunks<0)throw new TypeError("'expectedVideoChunks' must be a non-negative integer.")}if(n.audio){if(n.fastStart.expectedAudioChunks===void 0)throw new TypeError("'fastStart' is an object but is missing property 'expectedAudioChunks'.");if(!Number.isInteger(n.fastStart.expectedAudioChunks)||n.fastStart.expectedAudioChunks<0)throw new TypeError("'expectedAudioChunks' must be a non-negative integer.")}}else if(![!1,"in-memory","fragmented"].includes(n.fastStart))throw new TypeError("'fastStart' option must be false, 'in-memory', 'fragmented' or an object.");if(n.minFragmentDuration!==void 0&&(!Number.isFinite(n.minFragmentDuration)||n.minFragmentDuration<0))throw new TypeError("'minFragmentDuration' must be a non-negative number.")};$h=new WeakSet;ym=function(){if(N(this,Be).writeBox(hx({holdsAvc:N(this,Ie).video?.codec==="avc",fragmented:N(this,Ie).fastStart==="fragmented"})),ln(this,kl,N(this,Be).pos),N(this,Ie).fastStart==="in-memory")ln(this,Bn,Bh(!1));else if(N(this,Ie).fastStart!=="fragmented"){if(typeof N(this,Ie).fastStart=="object"){let n=it(this,nd,bm).call(this);N(this,Be).seek(N(this,Be).pos+n)}ln(this,Bn,Bh(!0)),N(this,Be).writeBox(N(this,Bn))}it(this,Ls,$o).call(this)};nd=new WeakSet;bm=function(){if(typeof N(this,Ie).fastStart!="object")return;let n=0,e=[N(this,Ie).fastStart.expectedVideoChunks,N(this,Ie).fastStart.expectedAudioChunks];for(let t of e)t&&(n+=8*Math.ceil(2/3*t),n+=4*t,n+=12*Math.ceil(2/3*t),n+=4*t,n+=8*t);return n+=4096,n};Wh=new WeakSet;xm=function(){if(N(this,Ie).video&&ln(this,yn,{id:1,info:{type:"video",codec:N(this,Ie).video.codec,width:N(this,Ie).video.width,height:N(this,Ie).video.height,rotation:N(this,Ie).video.rotation??0,decoderConfig:null},timescale:N(this,Ie).video.frameRate??57600,samples:[],finalizedChunks:[],currentChunk:null,firstDecodeTimestamp:void 0,lastDecodeTimestamp:-1,timeToSampleTable:[],compositionTimeOffsetTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),N(this,Ie).audio&&(ln(this,an,{id:N(this,Ie).video?2:1,info:{type:"audio",codec:N(this,Ie).audio.codec,numberOfChannels:N(this,Ie).audio.numberOfChannels,sampleRate:N(this,Ie).audio.sampleRate,decoderConfig:null},timescale:N(this,Ie).audio.sampleRate,samples:[],finalizedChunks:[],currentChunk:null,firstDecodeTimestamp:void 0,lastDecodeTimestamp:-1,timeToSampleTable:[],compositionTimeOffsetTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),N(this,Ie).audio.codec==="aac")){let n=it(this,id,vm).call(this,2,N(this,Ie).audio.sampleRate,N(this,Ie).audio.numberOfChannels);N(this,an).info.decoderConfig={codec:N(this,Ie).audio.codec,description:n,numberOfChannels:N(this,Ie).audio.numberOfChannels,sampleRate:N(this,Ie).audio.sampleRate}}};id=new WeakSet;vm=function(n,e,t){let r=[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350].indexOf(e),s=t,o="";o+=n.toString(2).padStart(5,"0"),o+=r.toString(2).padStart(4,"0"),r===15&&(o+=e.toString(2).padStart(24,"0")),o+=s.toString(2).padStart(4,"0");let a=Math.ceil(o.length/8)*8;o=o.padEnd(a,"0");let l=new Uint8Array(o.length/8);for(let c=0;c<o.length;c+=8)l[c/8]=parseInt(o.slice(c,c+8),2);return l};Cl=new WeakSet;jh=function(n,e,t,i,r,s,o){let a=i/1e6,l=(i-(o??0))/1e6,c=r/1e6,u=it(this,rd,_m).call(this,a,l,n);return a=u.presentationTimestamp,l=u.decodeTimestamp,s?.decoderConfig&&(n.info.decoderConfig===null?n.info.decoderConfig=s.decoderConfig:Object.assign(n.info.decoderConfig,s.decoderConfig)),{presentationTimestamp:a,decodeTimestamp:l,duration:c,data:e,size:e.byteLength,type:t,timescaleUnitsToNextSample:Ti(c,n.timescale)}};wi=new WeakSet;Fi=function(n,e){N(this,Ie).fastStart!=="fragmented"&&n.samples.push(e);let t=Ti(e.presentationTimestamp-e.decodeTimestamp,n.timescale);if(n.lastTimescaleUnits!==null){let r=Ti(e.decodeTimestamp,n.timescale,!1),s=Math.round(r-n.lastTimescaleUnits);if(n.lastTimescaleUnits+=s,n.lastSample.timescaleUnitsToNextSample=s,N(this,Ie).fastStart!=="fragmented"){let o=Pl(n.timeToSampleTable);o.sampleCount===1?(o.sampleDelta=s,o.sampleCount++):o.sampleDelta===s?o.sampleCount++:(o.sampleCount--,n.timeToSampleTable.push({sampleCount:2,sampleDelta:s}));let a=Pl(n.compositionTimeOffsetTable);a.sampleCompositionTimeOffset===t?a.sampleCount++:n.compositionTimeOffsetTable.push({sampleCount:1,sampleCompositionTimeOffset:t})}}else n.lastTimescaleUnits=0,N(this,Ie).fastStart!=="fragmented"&&(n.timeToSampleTable.push({sampleCount:1,sampleDelta:Ti(e.duration,n.timescale)}),n.compositionTimeOffsetTable.push({sampleCount:1,sampleCompositionTimeOffset:t}));n.lastSample=e;let i=!1;if(!n.currentChunk)i=!0;else{let r=e.presentationTimestamp-n.currentChunk.startTimestamp;if(N(this,Ie).fastStart==="fragmented"){let s=N(this,yn)??N(this,an),o=N(this,Ie).minFragmentDuration??1;n===s&&e.type==="key"&&r>=o&&(i=!0,it(this,Nl,sd).call(this))}else i=r>=.5}i&&(n.currentChunk&&it(this,Vo,Dl).call(this,n),n.currentChunk={startTimestamp:e.presentationTimestamp,samples:[]}),n.currentChunk.samples.push(e)};rd=new WeakSet;_m=function(n,e,t){let i=N(this,Ie).firstTimestampBehavior==="strict",r=t.lastDecodeTimestamp===-1;if(i&&r&&e!==0)throw new Error(`The first chunk for your media track must have a timestamp of 0 (received DTS=${e}).Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of thedocument, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
`);if(N(this,Ie).firstTimestampBehavior==="offset"||N(this,Ie).firstTimestampBehavior==="cross-track-offset"){t.firstDecodeTimestamp===void 0&&(t.firstDecodeTimestamp=e);let o;N(this,Ie).firstTimestampBehavior==="offset"?o=t.firstDecodeTimestamp:o=Math.min(N(this,yn)?.firstDecodeTimestamp??1/0,N(this,an)?.firstDecodeTimestamp??1/0),e-=o,n-=o}if(e<t.lastDecodeTimestamp)throw new Error(`Timestamps must be monotonically increasing (DTS went from ${t.lastDecodeTimestamp*1e6} to ${e*1e6}).`);return t.lastDecodeTimestamp=e,{presentationTimestamp:n,decodeTimestamp:e}};Vo=new WeakSet;Dl=function(n){if(N(this,Ie).fastStart==="fragmented")throw new Error("Can't finalize individual chunks if 'fastStart' is set to 'fragmented'.");if(n.currentChunk){if(n.finalizedChunks.push(n.currentChunk),N(this,Rs).push(n.currentChunk),(n.compactlyCodedChunkTable.length===0||Pl(n.compactlyCodedChunkTable).samplesPerChunk!==n.currentChunk.samples.length)&&n.compactlyCodedChunkTable.push({firstChunk:n.finalizedChunks.length,samplesPerChunk:n.currentChunk.samples.length}),N(this,Ie).fastStart==="in-memory"){n.currentChunk.offset=0;return}n.currentChunk.offset=N(this,Be).pos;for(let e of n.currentChunk.samples)N(this,Be).write(e.data),e.data=null;it(this,Ls,$o).call(this)}};Nl=new WeakSet;sd=function(n=!0){if(N(this,Ie).fastStart!=="fragmented")throw new Error("Can't finalize a fragment unless 'fastStart' is set to 'fragmented'.");let e=[N(this,yn),N(this,an)].filter(a=>a&&a.currentChunk);if(e.length===0)return;let t=lx(this,td)._++;if(t===1){let a=El(e,N(this,Cs),!0);N(this,Be).writeBox(a)}let i=N(this,Be).pos,r=om(t,e);N(this,Be).writeBox(r);{let a=Bh(!1),l=0;for(let u of e)for(let h of u.currentChunk.samples)l+=h.size;let c=N(this,Be).measureBox(a)+l;c>=2**32&&(a.largeSize=!0,c=N(this,Be).measureBox(a)+l),a.size=c,N(this,Be).writeBox(a)}for(let a of e){a.currentChunk.offset=N(this,Be).pos,a.currentChunk.moofOffset=i;for(let l of a.currentChunk.samples)N(this,Be).write(l.data),l.data=null}let s=N(this,Be).pos;N(this,Be).seek(N(this,Be).offsets.get(r));let o=om(t,e);N(this,Be).writeBox(o),N(this,Be).seek(s);for(let a of e)a.finalizedChunks.push(a.currentChunk),N(this,Rs).push(a.currentChunk),a.currentChunk=null;n&&it(this,Ls,$o).call(this)};Ls=new WeakSet;$o=function(){N(this,Be)instanceof ed&&N(this,Be).flush()};Rl=new WeakSet;Xh=function(){if(N(this,Ho))throw new Error("Cannot add new video or audio chunks after the file has been finalized.")};function cd(n){return(n.revolution??0)-(n.shifted?1:0)}var od=class{set;frame;revolutions;top;invariant;frames;stores=new Map;box=null;constructor(e,t,i,r=1){this.set=e,this.frame=t,this.frames=i,this.revolutions=e.periodic?r:1,this.top=this.revolutions-1,this.invariant=i.requirements(e.def.frame,t).channels.size===0}storeRevolution(e){return this.invariant?0:e}revolutionKey(e){return this.invariant?e<this.top?"joined":"top":String(e)}store(e){let t=this.storeRevolution(e),i=this.stores.get(t);return i===void 0&&(i={buf:new Float64Array(3*this.set.samples),done:new Uint8Array(this.set.trajectories),all:!1},this.stores.set(t,i)),i}ensure(e,t){let i=pv(t),r=this.store(i);if(r.done[e]===1)return r.buf;let s=this.set,o=this.storeRevolution(i),a=s.start(e);for(let l=0;l<s.count(e);l++)r.buf.set(this.frames.transform(s.position(e,l),s.def.frame,this.frame,{set:s,trajectory:e,sample:l,shifted:!1,revolution:o}),3*(a+l));return r.done[e]=1,r.buf}revolutionPositions(e){let t=this.store(e);if(!t.all){for(let i=0;i<this.set.trajectories;i++)this.ensure(i,e);t.all=!0}return t.buf}get positions(){return this.revolutionPositions(0)}get shifted(){return this.set.periodic?this.revolutionPositions(-1):null}trajectory(e,t){let i=this.ensure(e,t),r=this.set.start(e);return i.subarray(3*r,3*(r+this.set.count(e)))}gpuSample(e,t,i,r,s=0){let o=i===this.set.count(e)-1&&t<this.top,a=this.ensure(e,o?t+1:t),l=3*(this.set.start(e)+(o?0:i));r[s]=a[l],r[s+1]=a[l+1],r[s+2]=a[l+2]}bounds(e){if(e===void 0&&this.box!==null)return this.box;let t=[1/0,1/0,1/0,-1/0,-1/0,-1/0];for(let i=0;i<=(this.invariant?0:this.top);i++){let r=e===void 0?this.revolutionPositions(i):this.trajectory(e,i);for(let s=0;s<r.length;s+=3)for(let o=0;o<3;o++){let a=r[s+o];a<t[o]&&(t[o]=a),a>t[o+3]&&(t[o+3]=a)}}return e===void 0&&(this.box=t),t}vertex(e,t,i,r=0){let s=this.ensure(e,cd(t)),o=this.set.start(e);if("sample"in t){let c=3*(o+t.sample);i[r]=s[c],i[r+1]=s[c+1],i[r+2]=s[c+2];return}let a=3*(o+t.k),l=t.w;for(let c=0;c<3;c++)i[r+c]=(1-l)*s[a+c]+l*s[a+3+c]}},pv=n=>n===!0?-1:n===!1?0:n,ad=class{channel;clocks;u;constructor(e,t){this.channel=t,this.clocks=[],this.u=new Float64Array(e.samples);for(let i=0;i<e.trajectories;i++){let r=new Si(e,i,t),s=e.start(i);for(let o=0;o<r.m;o++)this.u[s+o]=r.at(o);this.clocks.push(r)}}},Fl=class{scene;sets;frames;geometries=new Map;readingsBy=new Map;bodyTrails=new Map;data;constructor(e,t){this.scene=e,this.data=t,this.sets=new ar(e,t),this.frames=new ir(e)}bytes(e){this.data.has(e)||M("body",`the data container does not hold array ${JSON.stringify(e)}`);let t=this.data.array(e);return t.dtype!=="uint8"&&M("body",`array ${e} holds ${t.dtype}, not the uint8 bytes of an image`),t.data}geometry(e,t){let i=`${e}\0${t}`,r=this.geometries.get(i);return r||(r=new od(this.sets.get(e),t,this.frames,Vt(this.scene.clock)),this.geometries.set(i,r)),r}hasChannel(e,t){return t===mt||this.sets.get(e).hasChannel(t)}readings(e,t){let i=`${e}\0${t}`,r=this.readingsBy.get(i);return r||(r=new ad(this.sets.get(e),t),this.readingsBy.set(i,r)),r}bodyTrail(e,t,i,r){let s=`${e}\0${t}\0${i}\0${r}`,o=this.bodyTrails.get(s);return o||(o=new ld(this.frames,e,t,this.sets.get(i),r),this.bodyTrails.set(s,o)),o}};function wm(n,e,t,i,r,s,o=!1){let a=Vt(r),l=wn(a*oi(e.reading(r,s)),a),{k:c,w:u}=e.locate(l.u);return o?n.channelAt(i,t,u>=1?c+1:c,!1,l.revolution):(1-u)*n.channelAt(i,t,c,!1,l.revolution)+u*n.channelAt(i,t,c+1,!1,l.revolution)}var Ul=n=>n,Mm=1<<20,Wo=[Mm,0,-Mm,0],mv=n=>[0,-1,n,2];function Bl(n,e,t,i){let r=0,s=n.m;for(;r<s;){let o=r+s>>1,a=i(n.at(o));a>e||t&&a===e?s=o:r=o+1}return r}function gv(n,e,t,i,r=Ul){if(e===t)return{range:[...Wo],revolutions:null,pieces:[]};let s=i-1,o=wn(e,i),a=wn(t,i),l=Gt(n,o.u,!1,o.revolution),c=Gt(n,a.u,!1,a.revolution),u=o.revolution,h=r(o.u),f=a.revolution,d=r(a.u);d===0&&(f--,d=1);let p=[u,h,f,d],g=P=>r(n.at(P)),m=P=>P<s?n.m-2:n.m-1,y=(P,C)=>P<f||P===f&&C<d,b=(P,C)=>P>u||P===u&&h<C,_=Bl(n,h,!1,r),x=_<=m(u)?[u,_]:u<s?[u+1,0]:null;x!==null&&!y(x[0],g(x[1]))&&(x=null);let S=Math.min(Bl(n,d,!0,r)-1,m(f)),w=S>=0?[f,S]:null;if(w!==null&&!b(w[0],g(w[1]))&&(w=null),x===null||w===null||x[0]>w[0]||x[0]===w[0]&&x[1]>w[1])return{range:p,revolutions:null,pieces:[[l,c]]};let v=[[l,{sample:x[1],shifted:!1,revolution:x[0]}],[{sample:w[1],shifted:!1,revolution:w[0]},c]],T=x[0]===w[0]&&x[1]===w[1];return{range:p,revolutions:T?null:[x[0],w[1]===0?w[0]-1:w[0]],pieces:v}}function Em(n,e){return(n.reveal??"none")!=="none"||or(n)||e.mode==="epoch"&&(n.before==="hidden"||n.after==="hidden")}function Tm(n,e,t=1){return{reveal:n.reveal??"none",fraction:n.trail?.fraction??1,before:n.before,after:n.after,head:or(n),periodic:e,revolutions:e?t:1}}function Am(n,e,t,i,r=Ul){let s=i.revolutions,o={range:mv(s-1),revolutions:[0,s-1],pieces:[]};if(n===null)return{hidden:!1,reading:null,loop:null,head:null,...o};let a=oi(n.reading(e,t),i.before,i.after);if(a===null)return{hidden:!0,reading:null,loop:null,head:null,range:[...Wo],revolutions:null,pieces:[]};let l=s*a,c=wn(l,s),u=i.head?Gt(n,c.u,!1,c.revolution):null;if(i.reveal==="none")return{hidden:!1,reading:a,loop:l,head:u,...o};let h=i.reveal==="grow"?0:l-s*i.fraction;return h<0&&!i.periodic&&(h=0),{hidden:!1,reading:a,loop:l,head:u,...gv(n,h,l,s,r)}}function zl(n){return n.samples-n.trajectories}function yv(n,e){return n.start(e)-e}function Cm(n,e){let t=0;for(let i=0;i<n.trajectories;i++){let r=n.start(i),s=n.count(i);for(let o=0;o+1<s;o++)e(t++,r+o)}}function ud(n,e,t){let i=new Float32Array(2*t*zl(n));return Cm(n,(r,s)=>{for(let o=0;o<t;o++)i[2*t*r+o]=e[t*s+o],i[2*t*r+t+o]=e[t*(s+1)+o]}),i}function hd(n,e,t,i){let r=new Float32Array(2*e*(i-1));for(let s=0;s+1<i;s++)for(let o=0;o<e;o++)r[2*e*s+o]=n[e*(t+s)+o],r[2*e*s+e+o]=n[e*(t+s+1)+o];return r}function Rm(n,e,t,i,r){let s=n.set.count(e),o=n.trajectory(e,t),a=[0,0,0];t<n.top&&n.gpuSample(e,t,s-1,a);for(let l=0;l+1<s;l++,r++)for(let c=0;c<3;c++)i[6*r+c]=o[3*l+c],i[6*r+3+c]=l+2===s&&t<n.top?a[c]:o[3*(l+1)+c]}function Pm(n,e){let t=new Float32Array(6*zl(n.set));for(let i=0;i<n.set.trajectories;i++)Rm(n,i,e,t,yv(n.set,i));return t}function Lm(n,e,t){let i=new Float32Array(6*(n.set.count(e)-1));return Rm(n,e,t,i,0),i}function Im(n,e){return("sample"in e?n.at(e.sample):(1-e.w)*n.at(e.k)+e.w*n.at(e.k+1))+cd(e)}function km(n,e){let t=new Float32Array(4*zl(n));return Cm(n,(i,r)=>{t[4*i]=t[4*i+2]=e[r],t[4*i+1]=t[4*i+3]=e[r+1]}),t}function Dm(n,e,t){let i=new Float32Array(4*(t-1));for(let r=0;r+1<t;r++)i[4*r]=i[4*r+2]=n[e+r],i[4*r+1]=i[4*r+3]=n[e+r+1];return i}function Nm(n){let e=new Float32Array(2*zl(n)),t=0;for(let i=0;i<n.trajectories;i++)for(let r=0;r+1<n.count(i);r++,t++)e[2*t]=e[2*t+1]=i;return e}var ld=class{constructor(e,t,i,r,s){this.frames=e;this.body=t;this.display=i;this.set=r;this.trajectory=s;this.m=r.count(s),this.invariant=e.bodyRequirements(t,i).channels.size===0}frames;body;display;set;trajectory;m;invariant;revolutions=new Map;revolution(e){let t=this.invariant?0:e,i=this.revolutions.get(t);if(i===void 0){i=new Float64Array(3*this.m);let{set:r,trajectory:s}=this;for(let o=0;o<this.m;o++)i.set(this.frames.bodyPosition(this.body,this.display,{set:r,trajectory:s,sample:o,shifted:!1,revolution:t}),3*o);this.revolutions.set(t,i)}return i}vertex(e,t,i=0){let r=this.revolution(cd(e));if("sample"in e){let a=3*e.sample;t[i]=r[a],t[i+1]=r[a+1],t[i+2]=r[a+2];return}let s=3*e.k,o=e.w;for(let a=0;a<3;a++)t[i+a]=(1-o)*r[s+a]+o*r[s+3+a]}polyline(e,t,i,r,s){let o=0,a=h=>{this.vertex(h,s,3*o),o++},l=wn(t,r);if(t===i)return a(Gt(e,l.u,!1,l.revolution)),o;let c=wn(i,r),u=(h,f,d)=>{let p=Bl(e,f,!1,Ul),g=Bl(e,d,!0,Ul);g>p&&(s.set(this.revolution(h).subarray(3*p,3*g),3*o),o+=g-p)};if(l.revolution===c.revolution)return a(Gt(e,l.u,!1,l.revolution)),u(l.revolution,l.u,c.u),a(Gt(e,c.u,!1,c.revolution)),o;a(Gt(e,l.u,!1,l.revolution)),u(l.revolution,l.u,1);for(let h=l.revolution+1;h<c.revolution;h++)a(Gt(e,0,!1,h)),u(h,0,1);return a(Gt(e,0,!1,c.revolution)),c.u===0||(u(c.revolution,0,c.u),a(Gt(e,c.u,!1,c.revolution))),o}};function Om(n,e,t){return(Math.ceil(e*t)+2)*(n+1)+2}var Fm="\u2212";function Wt(n,e,t,i=!1){if(!Number.isFinite(n))return Number.isNaN(n)?"NaN":n>0?"\u221E":`${Fm}\u221E`;n===0&&(n=0);let r;if(t!==void 0)r=n.toFixed(t),/^-0(\.0*)?$/.test(r)&&(r=r.slice(1));else if(e!==void 0)r=n.toPrecision(e);else if(Number.isInteger(n)&&Math.abs(n)<1e21)r=String(n);else{r=n.toPrecision(6);let[s,o]=r.split("e"),a=s.includes(".")?s.replace(/0+$/,"").replace(/\.$/,""):s;r=o===void 0?a:`${a}e${o}`}return i&&!r.includes("e")&&(r=r.replace(/^(-?)(\d+)/,(s,o,a)=>o+a.replace(/\B(?=(\d{3})+(?!\d))/g,","))),r.replace("e+","e").replace(/-/g,Fm)}function cr(n,e){return Wt((e.factor??1)*n+(e.offset??0),e.digits,e.decimals,e.grouping??!1).padStart(e.width??0," ")}function Vl(n,e,t){let i=$e(n.scene,t.input);if(i?.kind!=="parameter"||i.parameter===void 0||t.domain===void 0)return[];let r=[];for(let s of Lo(n,t.domain)){let o=e.get(s);if(!o.hasParameter(i.parameter))continue;let a=o.parameter(i.parameter,"control");for(let l=0;l<a.length;l++)r.push(a[l])}return r.sort((s,o)=>s-o),r.filter((s,o)=>o===0||s!==r[o-1])}function jo(n,e){let t=-1;for(let i=0;i<n.length;i++)(t<0||Math.abs(n[i]-e)<Math.abs(n[t]-e))&&(t=i);return t}function Gl(n,e,t,i,r,s){return n+Math.max(0,e)*i*r/(t*s)}function Xo(n,e){return(Math.floor(n)%e+e)%e}function qo(n,e){let t=(n%e+e)%e/e;return t<1?t:0}function Um(n,e){let{scene:t,geometry:i,state:r}=n,s=r.panels[n.panel];if(s===void 0||!Object.hasOwn(r.panels,n.panel))return[];let o={scene:t,state:r,panel:s},a=t.panels[s.panel],l=t.clock.frame_count,c=(n.frameIndex%l+l)%l,u=n.progress??c/l,h,f=()=>{if(h===void 0){let g=Ft(o,a.reference.sets);h=g===null?null:{setId:g,trajectory:ws(o,a.reference.member,i.sets.get(g))}}return h},d=[],p=Ht(t.clock,u);for(let g of e)if(typeof g=="string")d.push(g);else if("sub"in g)d.push(g.sub);else if("sup"in g)d.push(g.sup);else if("timed_text"in g){let m="";for(let[y,b]of g.timed_text)y<=p&&(m=String(b));d.push(m)}else if("keyframes"in g)d.push(cr(_s(g.keyframes,p),g));else if("clock"in g)if(g.clock==="frame_index"||g.clock==="frame_count"){let m=g.clock==="frame_index"?c:l,y=g.factor!==void 0||g.offset!==void 0||g.decimals!==void 0||g.grouping;d.push(y?cr(m,g):String(m).padStart(g.width??0," "))}else g.clock==="time"?d.push(cr(p,g)):d.push(cr(t.clock.mode==="fraction"?u:rl(t.clock,u),g));else if("roc_status"in g){let m=$r(o,g.roc_status.poles,"control",1,6,"a roc_status poles"),y=g.roc_status.period!==void 0?ai(o,g.roc_status.period,"control",!0,"a roc_status period"):1,b=Math.max(...m.map(([v])=>v)),_=Math.exp(b*y),x=b<-1e-9,S=Wt(b,void 0,2),w=Wt(_,void 0,2);d.push(x?`Causal ROC: \u03C3 > ${S}, |z| > ${w} (FT & DTFT converge)`:`Causal ROC: \u03C3 > ${S}, |z| > ${w} (FT & DTFT diverge) \u26A0`)}else if("input"in g){let m=Tt(o,g.input),y=$e(t,g.input);typeof m=="number"?d.push(cr(m,g)):typeof m=="boolean"?d.push(m?"on":"off"):Array.isArray(m)?d.push(m.map(([b,_])=>`(${Wt(b,3)}, ${Wt(_,3)})`).join(", ")):y?.kind==="choice"&&y.labels!==void 0?d.push(y.labels[y.values.indexOf(m)]??m):d.push(String(m))}else{let m=f();if(m===null){d.push("\u2014");continue}let y=i.sets.get(m.setId);if("parameter"in g)d.push(cr(y.parameter(g.parameter,"control")[m.trajectory],g));else if("attr"in g)d.push(cr(y.attr(g.attr),g));else if("channel"in g){let b=i.readings(m.setId,r.clock.channel).clocks[m.trajectory];y.hasChannel(g.channel)||M("control",`trajectory set ${m.setId} lacks channel ${JSON.stringify(g.channel)}`);let _=y.def.channels?.[g.channel]?.interp==="hold";d.push(cr(wm(y,b,m.trajectory,g.channel,t.clock,u,_),g))}}return d}function Bm(n){let e=[""],t=[];if(n.forEach((o,a)=>{typeof o=="string"?e[e.length-1]+=o:(t.push(a),e.push(""))}),t.length===0)return null;let i=o=>o.every(a=>a.trim()===""),r=[];for(let o=0;o<t.length;o++){let a=e[o].split(","),l=e[o+1].split(",");if((o>0?a.length<2||!i(a.slice(1,-1)):!i(a.slice(0,-1)))||o===t.length-1&&!i(l.slice(1)))return null;let c=a[a.length-1].replace(/\s*[=:]\s*$/,"").trim();if(c==="")return null;let u=n[t[o]],h="clock"in u||"keyframes"in u?5:"channel"in u?(u.digits??6)+5:null;r.push({label:c,part:t[o],unit:l[0].trim(),width:h})}let s=o=>"attr"in n[o.part];return[...r.filter(o=>!s(o)),...r.filter(s)]}var Hl=class{times=[];reset(){this.times.length=0}note(e){this.times.push(e);let t=0;for(;t<this.times.length&&this.times[t]<e-1e3;)t++;t>0&&this.times.splice(0,t)}report(e){let t=this.times;if(t.length<2||e-t[0]<900||e-t[t.length-1]>1e3)return null;let i=[];for(let a=1;a<t.length;a++)i.push(t[a]-t[a-1]);let r=[...i].sort((a,l)=>a-l),s=r[Math.floor(r.length/10)],o=i.filter(a=>a>1.5*s).length;return{drawn:t.length,late:o,refresh:s}}};function dd(n){return n===null?"\u2013\u2013 fps":`${n.drawn} fps`}function fd(n){if(n===null)return"Frames drawn per second during playback";let e=Math.round(1e3/n.refresh);return`${n.drawn} frames drawn in the last second, ${n.late} late, on a display refreshing about ${e} times a second`}function zm(n,e,t,i=""){let r=e?10:1;switch(n){case"x":case"y":case"z":case"X":case"Y":case"Z":return{kind:"view",axis:n.toLowerCase(),sign:e?-1:1};case".":return{kind:"turn",degrees:15};case",":return{kind:"turn",degrees:-15};case">":return{kind:"turn",degrees:90};case"<":return{kind:"turn",degrees:-90};case" ":case"k":case"K":return{kind:"toggle"};case"ArrowRight":return{kind:"step",by:r};case"ArrowLeft":return{kind:"step",by:-r};case"Home":return{kind:"seek",frame:0};case"f":case"F":return{kind:"fit"};case"ArrowUp":return{kind:"slider",by:r};case"ArrowDown":return{kind:"slider",by:-r}}return e&&i==="Period"?{kind:"turn",degrees:90}:e&&i==="Comma"?{kind:"turn",degrees:-90}:/^[0-9]$/.test(n)?{kind:"seek",frame:Math.round(t*Number(n)/10)%t}:null}function Hm(n,e,t){let i=t.startsWith("Arrow")||t==="Home"||t==="End"||t==="PageUp"||t==="PageDown";return n==="BUTTON"||n==="INPUT"&&e==="checkbox"?t===" "||t==="Enter":n==="INPUT"&&e==="range"?i:n==="SELECT"?i||t==="Enter"||t.length===1:n==="TEXTAREA"||n==="INPUT"}function bv(n,e){let t=new Set([e]);for(let i of Object.values(n.trajectory_sets)){let r=i?.parameters;if(r===void 0||!Object.hasOwn(r,e))continue;let s=r[e],o=s.label??e;t.add(s.unit?`${o}, ${s.unit}`:o)}return t}function Vm(n,e,t){for(let i of e.layers){if(i.kind!=="trajectories"||i.color===void 0||typeof i.color=="string"||!("parameter"in i.color))continue;let r=i.color.parameter;if(bv(n,r).has(t))for(let[s,o]of Object.entries(n.inputs??{})){if(o===void 0||o.kind!=="parameter"||o.scope==="per_panel"||o.parameter!==r)continue;let a=(n.controls??[]).find(l=>l.kind==="slider"&&l.input===s);return{input:s,label:a?.label??s,domain:a?.domain??i.sets}}}return null}function Gm(n,e,t,i){return jo(n,e+Math.min(1,Math.max(0,i))*(t-e))}var md={frames:2e3,seconds:90},$l=[24,30,60],$m=[1,2,3,4];function Wl(n,e,t,i=1,r=0,s=wo){let o=Math.round(t*s*e/i),a=l=>Gl(r,l,e,n,i,s);return{count:o,duration:o/e,index:l=>Xo(a(l),n),progress:l=>qo(a(l),n)}}function jl(n,e,t=md){return n>=1?n>t.frames?`${n} frames is more than the ${t.frames} an export may have: lower the frame rate or the loops, or raise the speed`:n/e>t.seconds?`${(n/e).toFixed(1)} s is longer than the ${t.seconds} s an export may last: lower the loops or raise the speed`:null:`the frame count of the export is ${n}, not a count of at least one`}function Wm(n,e,t=wo){for(let i of[...$l].reverse())if(jl(Wl(n,i,1,e,0,t).count,i)===null)return i;return null}function Yo(n,e={w:1280,h:720},t=1,i=30){if(n==="720p")return{width:1280,height:720,pixelRatio:1};if(n==="1080p")return{width:1920,height:1080,pixelRatio:1.5};let r=l=>Math.max(2,2*Math.floor(l/2)),s=r(e.w),o=r(e.h),a={width:s,height:o,pixelRatio:1};for(let l=8*Math.min(2,Math.max(1,Math.round(t)));l>=1;l--){let c=l/8;if(a={width:r(s*c),height:r(o*c),pixelRatio:c},Xm(a.width,a.height,i))break}return a}var xv=[[30,1620,40500],[31,3600,108e3],[32,5120,216e3],[40,8192,245760],[42,8704,522240],[50,22080,589824],[51,36864,983040],[52,36864,2073600]],jm=4096;function Xm(n,e,t){return n%2===0&&e%2===0&&Math.max(n,e)<=jm&&qm(n,e,t)!==null}function qm(n,e,t,i="high"){let r=Math.ceil(n/16),s=Math.ceil(e/16),o=r*s,a=xv.find(([,c,u])=>o<=c&&o*t<=u&&Math.max(r,s)<=Math.sqrt(8*c));return a===void 0?null:`avc1.${{high:"6400",main:"4d40",baseline:"42e0"}[i]}${a[0].toString(16).padStart(2,"0")}`}function vv(n,e,t){return Math.round(Math.min(4e7,Math.max(1e6,.08*n*e*t)))}var pd=class{muxer;constructor(e,t,i){if(e%2!==0||t%2!==0)throw new Error(`an MP4 export needs even sides, not ${e} by ${t}`);this.muxer=new Sm({target:new Zh,video:{codec:"avc",width:e,height:t,frameRate:i},fastStart:"in-memory"})}add(e,t,i,r,s){let o=s?.decoderConfig;if(o!==void 0){if(!o.codec.startsWith("avc1."))throw new Error(`an MP4 export holds H.264 only, not ${o.codec}`);if(o.description===void 0)throw new Error('the H.264 encoder did not give an avcC record. Configure it with avc: { format: "avc" }')}this.muxer.addVideoChunkRaw(e,t?"key":"delta",i,r,s)}finish(){return this.muxer.finalize(),new Uint8Array(this.muxer.target.buffer)}};function gd(){return typeof VideoEncoder>"u"||typeof VideoFrame>"u"?"this browser does not have a WebCodecs video encoder":null}async function _v(n,e,t,i,r="no-preference"){if(!Xm(n,e,t))throw new Error(`${n} by ${e} at ${t} fps is past H.264, which needs even sides, at most ${jm} pixels a side, and a frame size and rate within level 5.2`);for(let s of["high","main","baseline"]){let a={codec:qm(n,e,t,s),width:n,height:e,bitrate:i,framerate:t,hardwareAcceleration:r,avc:{format:"avc"}};if((await VideoEncoder.isConfigSupported(a)).supported===!0)return a}throw new Error(`this browser does not have an H.264 encoder for ${n} by ${e} at ${t} fps, and an MP4 that QuickTime opens needs H.264`)}async function Ym(n,e={}){let t=gd();if(t!==null)throw new Error(t);let i=e.fps??30,r=typeof e.size=="object"?e.size:Yo(e.size??"720p",n.panelArea,typeof window>"u"?1:window.devicePixelRatio,i),s=n.clock,o=Wl(s.frame_count,i,e.loops??1,e.speed??1,e.start??0,Ot(s)),a=jl(o.count,i,e.limits);if(a!==null)throw new Error(a);let l=e.keyFrameInterval??2*i;if(!(l>=1))throw new Error(`the key-frame interval is ${l}, not a count of at least one frame`);let{width:c,height:u,pixelRatio:h}=r,f=e.signal,d=()=>new DOMException("the export was canceled","AbortError");if(f?.aborted)throw d();let p=await _v(c,u,i,e.bitrate??vv(c,u,i),e.hardwareAcceleration);e.onConfig?.(p);let g=new pd(c,u,i),m=null,y=new VideoEncoder({output:(_,x)=>{let S=new Uint8Array(_.byteLength);_.copyTo(S);try{g.add(S,_.type==="key",_.timestamp,_.duration??Math.round(1e6/i),x)}catch(w){m??=w}},error:_=>m=_});y.configure(p);let b=null;try{b=await n.open(c/h,u/h,h);let _=document.createElement("canvas");_.width=c,_.height=u;let x=_.getContext("2d");x.fillStyle="#000",x.fillRect(0,0,c,u);for(let S=0;S<o.count;S++){if(f?.aborted)throw d();if(m!==null)throw m;x.setTransform(h,0,0,h,0,0),b.draw(x,o.index(S),o.progress(S)),e.onFrame?.(_,S);let w=new VideoFrame(_,{timestamp:Math.round(S*1e6/i),duration:Math.round(1e6/i)});for(y.encode(w,{keyFrame:S%l===0}),w.close(),e.onProgress?.(S+1,o.count);y.encodeQueueSize>4;)await new Promise(v=>setTimeout(v,1));await new Promise(v=>setTimeout(v,0))}if(await y.flush(),m!==null)throw m}finally{y.state!=="closed"&&y.close(),b?.close()}return new Blob([g.finish()],{type:"video/mp4"})}var Jm="http://www.w3.org/2000/svg",Zm=(n,e)=>`M${n-1} ${e}a1 1 0 1 0 2 0a1 1 0 1 0-2 0`,Sv={house:{grid:24,fill:!1,d:["M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8","M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]},chevronDown:{grid:24,fill:!1,d:["m6 9 6 6 6-6"]},chevronLeft:{grid:24,fill:!1,d:["m15 18-6-6 6-6"]},chevronRight:{grid:24,fill:!1,d:["m9 18 6-6-6-6"]},grip:{grid:24,fill:!1,d:[[5,12,19].map(n=>Zm(9,n)).join(""),[5,12,19].map(n=>Zm(15,n)).join("")]},x:{grid:24,fill:!1,d:["M18 6 6 18","m6 6 12 12"]},rotateCcw:{grid:24,fill:!1,d:["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8","M3 3v5h5"]},turnLeft:{grid:24,fill:!1,d:["M3 7v6h6","M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"]},turnRight:{grid:24,fill:!1,d:["M21 7v6h-6","M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"]},plus:{grid:24,fill:!1,d:["M5 12h14","M12 5v14"]},download:{grid:24,fill:!1,d:["M12 15V3","M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","m7 10 5 5 5-5"]},play:{grid:16,fill:!0,d:["M5 3.5v9l7.5-4.5z"]},pause:{grid:16,fill:!0,d:["M4.5 3H7v10H4.5zM9 3h2.5v10H9z"]}};function Hn(n,e){let t=Sv[n],i=document.createElementNS(Jm,"svg"),r={viewBox:`0 0 ${t.grid} ${t.grid}`,"aria-hidden":"true",focusable:"false",fill:t.fill?"currentColor":"none",stroke:t.fill?"none":"currentColor"};t.fill||Object.assign(r,{"stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"});for(let[s,o]of Object.entries(r))i.setAttribute(s,o);i.setAttribute("class",e===void 0?`i i-${n}`:`i i-${n} ${e}`);for(let s of t.d){let o=document.createElementNS(Jm,"path");o.setAttribute("d",s),i.appendChild(o)}return i}function Jo(n){return n?n.kind==="panel"?[n.id]:[...Jo(n.a),...Jo(n.b)]:[]}function Zo(n,e,t,i){if(n.kind==="panel"){if(n.id!==e)return n;if(i==="centre")return{kind:"panel",id:t};let r={kind:"panel",id:t},s=i==="left"||i==="right"?"row":"col",o=i==="left"||i==="top";return{kind:"split",dir:s,ratio:.5,a:o?r:n,b:o?n:r}}return{...n,a:Zo(n.a,e,t,i),b:Zo(n.b,e,t,i)}}function Ko(n,e){if(n.kind==="panel")return n.id===e?null:n;let t=Ko(n.a,e),i=Ko(n.b,e);return t?i?{...n,a:t,b:i}:t:i}function Xl(n,e=1){return n.kind==="panel"?[{id:n.id,area:e}]:[...Xl(n.a,e*n.ratio),...Xl(n.b,e*(1-n.ratio))]}function Km(n,e,t,i){let r=n/Math.max(1,t),s=e/Math.max(1,i),o=.28,a=[{zone:"left",v:r},{zone:"right",v:1-r},{zone:"top",v:s},{zone:"bottom",v:1-s}].sort((l,c)=>l.v-c.v)[0];return a.v<o?a.zone:"centre"}var ii={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},fi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rg=0,$d=1,Pg=2;var Ma=1,Lg=2,so=3,Er=0,Ln=1,Pt=2,Yi=0,oo=1,Wd=2,jd=3,Xd=4,Ig=5;var hs=100,kg=101,Dg=102,Ng=103,Og=104,Fg=200,Ug=201,Bg=202,zg=203,qd=204,Yd=205,Hg=206,Vg=207,Gg=208,$g=209,Wg=210,jg=211,Xg=212,qg=213,Yg=214,xc=0,vc=1,_c=2,js=3,Sc=4,Mc=5,wc=6,Ec=7,Jd=0,Jg=1,Zg=2,Ri=0,Zd=1,Kd=2,Qd=3,ef=4,tf=5,nf=6,rf=7;var sf=300,ds=301,ao=302,Jc=303,Zc=304,Tc=1e3,jn=1001,Ac=1002,kt=1003,Kg=1004;var wa=1005;var un=1006,Kc=1007;var Ji=1008;var In=1009,of=1010,af=1011,lo=1012,Qc=1013,pi=1014,Yn=1015,mi=1016,eu=1017,tu=1018,fs=1020,lf=35902,cf=35899,uf=1021,hf=1022,kn=1023,Wi=1026,Zi=1027,df=1028,nu=1029,Tr=1030,iu=1031;var ru=1033,Ea=33776,Ta=33777,Aa=33778,Ca=33779,su=35840,ou=35841,au=35842,lu=35843,cu=36196,uu=37492,hu=37496,du=37488,fu=37489,Ra=37490,pu=37491,mu=37808,gu=37809,yu=37810,bu=37811,xu=37812,vu=37813,_u=37814,Su=37815,Mu=37816,wu=37817,Eu=37818,Tu=37819,Au=37820,Cu=37821,Ru=36492,Pu=36494,Lu=36495,Iu=36283,ku=36284,Pa=36285,Du=36286;var aa=2300,Cc=2301,bc=2302,Fd=2303,Ud=2400,Bd=2401,zd=2402;var Qg=3200;var ff=0,ey=1,gi="",$n="srgb",ss="srgb-linear",la="linear",yt="srgb";var rs=7680,pf=7681;var mf=517;var ty=519,ny=512,iy=513,ry=514,gf=515,sy=516,oy=517,yf=518,bf=519,xf=35044,vn=35048;var La="300 es",ni=2e3,ca=2001;function Mv(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function wv(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function ua(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function ay(){let n=ua("canvas");return n.style.display="block",n}var Qm={},Xs=null;function ha(...n){let e="THREE."+n.shift();Xs?Xs("log",e,...n):console.log(e,...n)}function ly(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=ly(n);let e="THREE."+n.shift();if(Xs)Xs("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function ze(...n){n=ly(n);let e="THREE."+n.shift();if(Xs)Xs("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function ra(...n){let e=n.join(" ");e in Qm||(Qm[e]=!0,Ne(...n))}function cy(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}var uy={[xc]:xc,[_c]:wc,[Sc]:Sc,[js]:Mc,[vc]:vc,[wc]:_c,[Ec]:Ec,[Mc]:js},hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},En=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],eg=1234567,sa=Math.PI/180,qs=180/Math.PI;function Ar(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(En[n&255]+En[n>>8&255]+En[n>>16&255]+En[n>>24&255]+"-"+En[e&255]+En[e>>8&255]+"-"+En[e>>16&15|64]+En[e>>24&255]+"-"+En[t&63|128]+En[t>>8&255]+"-"+En[t>>16&255]+En[t>>24&255]+En[i&255]+En[i>>8&255]+En[i>>16&255]+En[i>>24&255]).toLowerCase()}function Ke(n,e,t){return Math.max(e,Math.min(t,n))}function vf(n,e){return(n%e+e)%e}function Ev(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Tv(n,e,t){return n!==e?(t-n)/(e-n):0}function oa(n,e,t){return(1-t)*n+t*e}function Av(n,e,t,i){return oa(n,e,1-Math.exp(-t*i))}function Cv(n,e=1){return e-Math.abs(vf(n,e*2)-e)}function Rv(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Pv(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Lv(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Iv(n,e){return n+Math.random()*(e-n)}function kv(n){return n*(.5-Math.random())}function Dv(n){n!==void 0&&(eg=n);let e=eg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Nv(n){return n*sa}function Ov(n){return n*qs}function Fv(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Uv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function _f(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Bv(n,e,t,i,r){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),f=o((e-i)/2),d=s((i-e)/2),p=o((i-e)/2);switch(r){case"XYX":n.set(a*u,l*h,l*f,a*c);break;case"YZY":n.set(l*f,a*u,l*h,a*c);break;case"ZXZ":n.set(l*h,l*f,a*u,a*c);break;case"XZX":n.set(a*u,l*p,l*d,a*c);break;case"YXY":n.set(l*d,a*u,l*p,a*c);break;case"ZYZ":n.set(l*p,l*d,a*u,a*c);break;default:Ne("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Nu(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Sf(n,e){if(e.constructor===Float32Array)return n;let t=Nu(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Mf(n,e){if(e.constructor===Float32Array)return n;let t=Nu(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}var wf={DEG2RAD:sa,RAD2DEG:qs,generateUUID:Ar,clamp:Ke,euclideanModulo:vf,mapLinear:Ev,inverseLerp:Tv,lerp:oa,damp:Av,pingpong:Cv,smoothstep:Rv,smootherstep:Pv,randInt:Lv,randFloat:Iv,randFloatSpread:kv,seededRandom:Dv,degToRad:Nv,radToDeg:Ov,isPowerOfTwo:Fv,ceilPowerOfTwo:Uv,floorPowerOfTwo:_f,setQuaternionFromProperEuler:Bv,normalize:Mf,denormalize:Sf},Me=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xn=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3],f=s[o+0],d=s[o+1],p=s[o+2],g=s[o+3];if(h!==g||l!==f||c!==d||u!==p){let m=l*f+c*d+u*p+h*g;m<0&&(f=-f,d=-d,p=-p,g=-g,m=-m);let y=1-a;if(m<.9995){let b=Math.acos(m),_=Math.sin(b);y=Math.sin(y*b)/_,a=Math.sin(a*b)/_,l=l*y+f*a,c=c*y+d*a,u=u*y+p*a,h=h*y+g*a}else{l=l*y+f*a,c=c*y+d*a,u=u*y+p*a,h=h*y+g*a;let b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],f=s[o+1],d=s[o+2],p=s[o+3];return e[t]=a*p+u*h+l*d-c*f,e[t+1]=l*p+u*f+c*h-a*d,e[t+2]=c*p+u*d+a*f-l*h,e[t+3]=u*p-a*h-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),f=l(i/2),d=l(r/2),p=l(s/2);switch(o){case"XYZ":this._x=f*u*h+c*d*p,this._y=c*d*h-f*u*p,this._z=c*u*p+f*d*h,this._w=c*u*h-f*d*p;break;case"YXZ":this._x=f*u*h+c*d*p,this._y=c*d*h-f*u*p,this._z=c*u*p-f*d*h,this._w=c*u*h+f*d*p;break;case"ZXY":this._x=f*u*h-c*d*p,this._y=c*d*h+f*u*p,this._z=c*u*p+f*d*h,this._w=c*u*h-f*d*p;break;case"ZYX":this._x=f*u*h-c*d*p,this._y=c*d*h+f*u*p,this._z=c*u*p-f*d*h,this._w=c*u*h+f*d*p;break;case"YZX":this._x=f*u*h+c*d*p,this._y=c*d*h+f*u*p,this._z=c*u*p-f*d*h,this._w=c*u*h-f*d*p;break;case"XZY":this._x=f*u*h-c*d*p,this._y=c*d*h-f*u*p,this._z=c*u*p+f*d*h,this._w=c*u*h+f*d*p;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=i+a+h;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>h){let d=2*Math.sqrt(1+i-a-h);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>h){let d=2*Math.sqrt(1+a-i-h);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+h-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tg.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tg.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return yd.copy(this).projectOnVector(e),this.sub(yd)}reflect(e){return this.sub(yd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},yd=new O,tg=new Xn,He=class{static{this.prototype.isMatrix3=!0}constructor(e,t,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],f=i[2],d=i[5],p=i[8],g=r[0],m=r[3],y=r[6],b=r[1],_=r[4],x=r[7],S=r[2],w=r[5],v=r[8];return s[0]=o*g+a*b+l*S,s[3]=o*m+a*_+l*w,s[6]=o*y+a*x+l*v,s[1]=c*g+u*b+h*S,s[4]=c*m+u*_+h*w,s[7]=c*y+u*x+h*v,s[2]=f*g+d*b+p*S,s[5]=f*m+d*_+p*w,s[8]=f*y+d*x+p*v,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*s,d=c*s-o*l,p=t*h+i*f+r*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/p;return e[0]=h*g,e[1]=(r*c-u*i)*g,e[2]=(a*i-r*o)*g,e[3]=f*g,e[4]=(u*t-r*l)*g,e[5]=(r*s-a*t)*g,e[6]=d*g,e[7]=(i*l-c*t)*g,e[8]=(o*t-i*s)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return ra("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(bd.makeScale(e,t)),this}rotate(e){return ra("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(bd.makeRotation(-e)),this}translate(e,t){return ra("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(bd.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},bd=new He,ng=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ig=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zv(){let n={enabled:!0,workingColorSpace:ss,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===yt&&(r.r=$i(r.r),r.g=$i(r.g),r.b=$i(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===yt&&(r.r=Ws(r.r),r.g=Ws(r.g),r.b=Ws(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===gi?la:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[o].fromXYZ).multiply(this.spaces[s].toXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ss]:{primaries:e,whitePoint:i,transfer:la,toXYZ:ng,fromXYZ:ig,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$n},outputColorSpaceConfig:{drawingBufferColorSpace:$n}},[$n]:{primaries:e,whitePoint:i,transfer:yt,toXYZ:ng,fromXYZ:ig,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$n}}}),n}var Ze=zv();function $i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ws(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Is,Rc=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Is===void 0&&(Is=ua("canvas")),Is.width=e.width,Is.height=e.height;let r=Is.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Is}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ua("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=$i(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor($i(t[i]/255)*255):t[i]=$i(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Hv=0,Ys=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Hv++}),this.uuid=Ar(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(xd(r[o].image)):s.push(xd(r[o]))}else s=xd(r);i.url=s}return t||(e.images[this.uuid]=i),i}};function xd(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Rc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}var Vv=0,vd=new O,xn=class n extends hi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=jn,r=jn,s=un,o=Ji,a=kn,l=In,c=n.DEFAULT_ANISOTROPY,u=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vv++}),this.uuid=Ar(),this.name="",this.source=new Ys(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(vd).x}get height(){return this.source.getSize(vd).y}get depth(){return this.source.getSize(vd).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==sf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Tc:e.x=e.x-Math.floor(e.x);break;case jn:e.x=e.x<0?0:1;break;case Ac:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Tc:e.y=e.y-Math.floor(e.y);break;case jn:e.y=e.y<0?0:1;break;case Ac:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=sf;xn.DEFAULT_ANISOTROPY=1;var ct=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s,l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],d=l[5],p=l[9],g=l[2],m=l[6],y=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,x=(d+1)/2,S=(y+1)/2,w=(u+f)/4,v=(h+g)/4,T=(p+m)/4;return _>x&&_>S?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=w/i,s=v/i):x>S?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=w/r,s=T/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=v/s,r=T/s),this.set(i,r,s,t),this}let b=Math.sqrt((m-p)*(m-p)+(h-g)*(h-g)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(m-p)/b,this.y=(h-g)/b,this.z=(f-u)/b,this.w=Math.acos((c+d+y-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Pc=class extends hi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t),this.textures=[];let r=i.count;for(let s=0;s<r;s++)this.textures[s]=new xn({width:e,height:t,depth:i.depth}),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:un,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Ys(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Pn=class extends Pc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},da=class extends xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=kt,this.minFilter=kt,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Lc=class extends xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=kt,this.minFilter=kt,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Mt=class n{static{this.prototype.isMatrix4=!0}constructor(e,t,i,r,s,o,a,l,c,u,h,f,d,p,g,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,f,d,p,g,m)}set(e,t,i,r,s,o,a,l,c,u,h,f,d,p,g,m){let y=this.elements;return y[0]=e,y[4]=t,y[8]=i,y[12]=r,y[1]=s,y[5]=o,y[9]=a,y[13]=l,y[2]=c,y[6]=u,y[10]=h,y[14]=f,y[3]=d,y[7]=p,y[11]=g,y[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,r=1/ks.setFromMatrixColumn(e,0).length(),s=1/ks.setFromMatrixColumn(e,1).length(),o=1/ks.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let f=o*u,d=o*h,p=a*u,g=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=d+p*c,t[5]=f-g*c,t[9]=-a*l,t[2]=g-f*c,t[6]=p+d*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*u,d=l*h,p=c*u,g=c*h;t[0]=f+g*a,t[4]=p*a-d,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-p,t[6]=g+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*u,d=l*h,p=c*u,g=c*h;t[0]=f-g*a,t[4]=-o*h,t[8]=p+d*a,t[1]=d+p*a,t[5]=o*u,t[9]=g-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*u,d=o*h,p=a*u,g=a*h;t[0]=l*u,t[4]=p*c-d,t[8]=f*c+g,t[1]=l*h,t[5]=g*c+f,t[9]=d*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,d=o*c,p=a*l,g=a*c;t[0]=l*u,t[4]=g-f*h,t[8]=p*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=d*h+p,t[10]=f-g*h}else if(e.order==="XZY"){let f=o*l,d=o*c,p=a*l,g=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+g,t[5]=o*u,t[9]=d*h-p,t[2]=p*h-d,t[6]=a*u,t[10]=g*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gv,e,$v)}lookAt(e,t,i){let r=this.elements;return Vn.subVectors(e,t),Vn.lengthSq()===0&&(Vn.z=1),Vn.normalize(),ur.crossVectors(i,Vn),ur.lengthSq()===0&&(Math.abs(i.z)===1?Vn.x+=1e-4:Vn.z+=1e-4,Vn.normalize(),ur.crossVectors(i,Vn)),ur.normalize(),ql.crossVectors(Vn,ur),r[0]=ur.x,r[4]=ql.x,r[8]=Vn.x,r[1]=ur.y,r[5]=ql.y,r[9]=Vn.y,r[2]=ur.z,r[6]=ql.z,r[10]=Vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],f=i[9],d=i[13],p=i[2],g=i[6],m=i[10],y=i[14],b=i[3],_=i[7],x=i[11],S=i[15],w=r[0],v=r[4],T=r[8],P=r[12],C=r[1],I=r[5],U=r[9],j=r[13],L=r[2],z=r[6],B=r[10],H=r[14],K=r[3],$=r[7],Y=r[11],q=r[15];return s[0]=o*w+a*C+l*L+c*K,s[4]=o*v+a*I+l*z+c*$,s[8]=o*T+a*U+l*B+c*Y,s[12]=o*P+a*j+l*H+c*q,s[1]=u*w+h*C+f*L+d*K,s[5]=u*v+h*I+f*z+d*$,s[9]=u*T+h*U+f*B+d*Y,s[13]=u*P+h*j+f*H+d*q,s[2]=p*w+g*C+m*L+y*K,s[6]=p*v+g*I+m*z+y*$,s[10]=p*T+g*U+m*B+y*Y,s[14]=p*P+g*j+m*H+y*q,s[3]=b*w+_*C+x*L+S*K,s[7]=b*v+_*I+x*z+S*$,s[11]=b*T+_*U+x*B+S*Y,s[15]=b*P+_*j+x*H+S*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],d=e[14],p=e[3],g=e[7],m=e[11],y=e[15],b=l*d-c*f,_=a*d-c*h,x=a*f-l*h,S=o*d-c*u,w=o*f-l*u,v=o*h-a*u;return t*(g*b-m*_+y*x)-i*(p*b-m*S+y*w)+r*(p*_-g*S+y*v)-s*(p*x-g*w+m*v)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],d=e[11],p=e[12],g=e[13],m=e[14],y=e[15],b=t*a-i*o,_=t*l-r*o,x=t*c-s*o,S=i*l-r*a,w=i*c-s*a,v=r*c-s*l,T=u*g-h*p,P=u*m-f*p,C=u*y-d*p,I=h*m-f*g,U=h*y-d*g,j=f*y-d*m,L=b*j-_*U+x*I+S*C-w*P+v*T;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/L;return e[0]=(a*j-l*U+c*I)*z,e[1]=(r*U-i*j-s*I)*z,e[2]=(g*v-m*w+y*S)*z,e[3]=(f*w-h*v-d*S)*z,e[4]=(l*C-o*j-c*P)*z,e[5]=(t*j-r*C+s*P)*z,e[6]=(m*x-p*v-y*_)*z,e[7]=(u*v-f*x+d*_)*z,e[8]=(o*U-a*C+c*T)*z,e[9]=(i*C-t*U-s*T)*z,e[10]=(p*w-g*x+y*b)*z,e[11]=(h*x-u*w-d*b)*z,e[12]=(a*P-o*I-l*T)*z,e[13]=(t*I-i*P+r*T)*z,e[14]=(g*_-p*S-m*b)*z,e[15]=(u*S-h*_+f*b)*z,this}scale(e){let t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,f=s*c,d=s*u,p=s*h,g=o*u,m=o*h,y=a*h,b=l*c,_=l*u,x=l*h,S=i.x,w=i.y,v=i.z;return r[0]=(1-(g+y))*S,r[1]=(d+x)*S,r[2]=(p-_)*S,r[3]=0,r[4]=(d-x)*w,r[5]=(1-(f+y))*w,r[6]=(m+b)*w,r[7]=0,r[8]=(p+_)*v,r[9]=(m-b)*v,r[10]=(1-(f+g))*v,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let o=ks.set(r[0],r[1],r[2]).length(),a=ks.set(r[4],r[5],r[6]).length(),l=ks.set(r[8],r[9],r[10]).length();s<0&&(o=-o),li.copy(this);let c=1/o,u=1/a,h=1/l;return li.elements[0]*=c,li.elements[1]*=c,li.elements[2]*=c,li.elements[4]*=u,li.elements[5]*=u,li.elements[6]*=u,li.elements[8]*=h,li.elements[9]*=h,li.elements[10]*=h,t.setFromRotationMatrix(li),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,r,s,o,a=ni,l=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(i-r),f=(t+e)/(t-e),d=(i+r)/(i-r),p,g;if(l)p=s/(o-s),g=o*s/(o-s);else if(a===ni)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===ca)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=ni,l=!1){let c=this.elements,u=2/(t-e),h=2/(i-r),f=-(t+e)/(t-e),d=-(i+r)/(i-r),p,g;if(l)p=1/(o-s),g=o/(o-s);else if(a===ni)p=-2/(o-s),g=-(o+s)/(o-s);else if(a===ca)p=-1/(o-s),g=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=h,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},ks=new O,li=new Mt,Gv=new O(0,0,0),$v=new O(1,1,1),ur=new O,ql=new O,Vn=new O,rg=new Mt,sg=new Xn,gr=class n{constructor(e=0,t=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return rg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sg.setFromEuler(this),this.setFromQuaternion(sg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};gr.DEFAULT_ORDER="XYZ";var fa=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Wv=0,og=new O,Ds=new Xn,Bi=new Mt,Yl=new O,Qo=new O,jv=new O,Xv=new Xn,ag=new O(1,0,0),lg=new O(0,1,0),cg=new O(0,0,1),ug={type:"added"},qv={type:"removed"},Ns={type:"childadded",child:null},_d={type:"childremoved",child:null},hn=class n extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wv++}),this.uuid=Ar(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new O,t=new gr,i=new Xn,r=new O(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Mt},normalMatrix:{value:new He}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.premultiply(Ds),this}rotateX(e){return this.rotateOnAxis(ag,e)}rotateY(e){return this.rotateOnAxis(lg,e)}rotateZ(e){return this.rotateOnAxis(cg,e)}translateOnAxis(e,t){return og.copy(e).applyQuaternion(this.quaternion),this.position.add(og.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ag,e)}translateY(e){return this.translateOnAxis(lg,e)}translateZ(e){return this.translateOnAxis(cg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Yl.copy(e):Yl.set(e,t,i);let r=this.parent;this.updateWorldMatrix(!0,!1),Qo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(Qo,Yl,this.up):Bi.lookAt(Yl,Qo,this.up),this.quaternion.setFromRotationMatrix(Bi),r&&(Bi.extractRotation(r.matrixWorld),Ds.setFromRotationMatrix(Bi),this.quaternion.premultiply(Ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ug),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null):ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(qv),_d.child=e,this.dispatchEvent(_d),_d.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ug),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,e,jv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,Xv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),p=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};hn.DEFAULT_UP=new O(0,1,0);hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Zt=class extends hn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Yv={type:"move"},Js=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let g of e.hand.values()){let m=t.getJointPose(g,i),y=this._getHandJoint(c,g);m!==null&&(y.matrix.fromArray(m.transform.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=m.radius),y.visible=m!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,p=.005;c.inputState.pinching&&f>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Yv)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Zt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},hy={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hr={h:0,s:0,l:0},Jl={h:0,s:0,l:0};function Sd(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Fe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$n){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ze.workingColorSpace){if(e=vf(e,1),t=Ke(t,0,1),i=Ke(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Sd(o,s,e+1/3),this.g=Sd(o,s,e),this.b=Sd(o,s,e-1/3)}return Ze.colorSpaceToWorking(this,r),this}setStyle(e,t=$n){function i(s){s!==void 0&&parseFloat(s)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,t);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$n){let i=hy[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}copyLinearToSRGB(e){return this.r=Ws(e.r),this.g=Ws(e.g),this.b=Ws(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$n){return Ze.workingToColorSpace(Tn.copy(this),e),Math.round(Ke(Tn.r*255,0,255))*65536+Math.round(Ke(Tn.g*255,0,255))*256+Math.round(Ke(Tn.b*255,0,255))}getHexString(e=$n){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Tn.copy(this),t);let i=Tn.r,r=Tn.g,s=Tn.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Tn.copy(this),t),e.r=Tn.r,e.g=Tn.g,e.b=Tn.b,e}getStyle(e=$n){Ze.workingToColorSpace(Tn.copy(this),e);let t=Tn.r,i=Tn.g,r=Tn.b;return e!==$n?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(hr),this.setHSL(hr.h+e,hr.s+t,hr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(hr),e.getHSL(Jl);let i=oa(hr.h,Jl.h,t),r=oa(hr.s,Jl.s,t),s=oa(hr.l,Jl.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Tn=new Fe;Fe.NAMES=hy;var os=class extends hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gr,this.environmentIntensity=1,this.environmentRotation=new gr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},ci=new O,zi=new O,Md=new O,Hi=new O,Os=new O,Fs=new O,hg=new O,wd=new O,Ed=new O,Td=new O,Ad=new ct,Cd=new ct,Rd=new ct,mr=class n{constructor(e=new O,t=new O,i=new O){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ci.subVectors(e,t),r.cross(ci);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ci.subVectors(r,t),zi.subVectors(i,t),Md.subVectors(e,t);let o=ci.dot(ci),a=ci.dot(zi),l=ci.dot(Md),c=zi.dot(zi),u=zi.dot(Md),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;let f=1/h,d=(c*l-a*u)*f,p=(o*u-a*l)*f;return s.set(1-d-p,p,d)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Hi)===null?!1:Hi.x>=0&&Hi.y>=0&&Hi.x+Hi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Hi.x),l.addScaledVector(o,Hi.y),l.addScaledVector(a,Hi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return Ad.setScalar(0),Cd.setScalar(0),Rd.setScalar(0),Ad.fromBufferAttribute(e,t),Cd.fromBufferAttribute(e,i),Rd.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Ad,s.x),o.addScaledVector(Cd,s.y),o.addScaledVector(Rd,s.z),o}static isFrontFacing(e,t,i,r){return ci.subVectors(i,t),zi.subVectors(e,t),ci.cross(zi).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),ci.cross(zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,r=this.b,s=this.c,o,a;Os.subVectors(r,i),Fs.subVectors(s,i),wd.subVectors(e,i);let l=Os.dot(wd),c=Fs.dot(wd);if(l<=0&&c<=0)return t.copy(i);Ed.subVectors(e,r);let u=Os.dot(Ed),h=Fs.dot(Ed);if(u>=0&&h<=u)return t.copy(r);let f=l*h-u*c;if(f<=0&&l>=0&&u<=0&&l-u>0)return o=l/(l-u),t.copy(i).addScaledVector(Os,o);Td.subVectors(e,s);let d=Os.dot(Td),p=Fs.dot(Td);if(p>=0&&d<=p)return t.copy(s);let g=d*c-l*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(i).addScaledVector(Fs,a);let m=u*p-d*h;if(m<=0&&h-u>=0&&d-p>=0)return hg.subVectors(s,r),a=(h-u)/(h-u+(d-p)),t.copy(r).addScaledVector(hg,a);let y=1/(m+g+f);return o=g*y,a=f*y,t.copy(i).addScaledVector(Os,o).addScaledVector(Fs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},di=class{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ui):ui.fromBufferAttribute(s,o),ui.applyMatrix4(e.matrixWorld),this.expandByPoint(ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Zl.copy(i.boundingBox)),Zl.applyMatrix4(e.matrixWorld),this.union(Zl)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ui),ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),Kl.subVectors(this.max,ea),Us.subVectors(e.a,ea),Bs.subVectors(e.b,ea),zs.subVectors(e.c,ea),dr.subVectors(Bs,Us),fr.subVectors(zs,Bs),es.subVectors(Us,zs);let t=[0,-dr.z,dr.y,0,-fr.z,fr.y,0,-es.z,es.y,dr.z,0,-dr.x,fr.z,0,-fr.x,es.z,0,-es.x,-dr.y,dr.x,0,-fr.y,fr.x,0,-es.y,es.x,0];return!Pd(t,Us,Bs,zs,Kl)||(t=[1,0,0,0,1,0,0,0,1],!Pd(t,Us,Bs,zs,Kl))?!1:(Ql.crossVectors(dr,fr),t=[Ql.x,Ql.y,Ql.z],Pd(t,Us,Bs,zs,Kl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Vi=[new O,new O,new O,new O,new O,new O,new O,new O],ui=new O,Zl=new di,Us=new O,Bs=new O,zs=new O,dr=new O,fr=new O,es=new O,ea=new O,Kl=new O,Ql=new O,ts=new O;function Pd(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){ts.fromArray(n,s);let a=r.x*Math.abs(ts.x)+r.y*Math.abs(ts.y)+r.z*Math.abs(ts.z),l=e.dot(ts),c=t.dot(ts),u=i.dot(ts);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var jt=new O,ec=new Me,Jv=0,Qe=class extends hi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Jv++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xf,this.updateRanges=[],this.gpuType=Yn,this.version=0,this._normalizationScale=e!==void 0?Nu(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ec.fromBufferAttribute(this,t),ec.applyMatrix3(e),this.setXY(t,ec.x,ec.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix3(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix4(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.applyNormalMatrix(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)jt.fromBufferAttribute(this,t),jt.transformDirection(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Sf(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Mf(e,this.array)}};var pa=class extends Qe{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var ma=class extends Qe{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Kt=class extends Qe{constructor(e,t,i){super(new Float32Array(e),t,i)}},Zv=new di,ta=new O,Ld=new O,yr=class{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Zv.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);let t=ta.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ta,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ld.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(Ld)),this.expandByPoint(ta.copy(e.center).sub(Ld))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Kv=0,ti=new Mt,Id=new hn,Hs=new O,Gn=new di,na=new di,cn=new O,ft=class n extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kv++}),this.uuid=Ar(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Mv(e)?ma:pa)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new He().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ti.makeRotationFromQuaternion(e),this.applyMatrix4(ti),this}rotateX(e){return ti.makeRotationX(e),this.applyMatrix4(ti),this}rotateY(e){return ti.makeRotationY(e),this.applyMatrix4(ti),this}rotateZ(e){return ti.makeRotationZ(e),this.applyMatrix4(ti),this}translate(e,t,i){return ti.makeTranslation(e,t,i),this.applyMatrix4(ti),this}scale(e,t,i){return ti.makeScale(e,t,i),this.applyMatrix4(ti),this}lookAt(e){return Id.lookAt(e),Id.updateMatrix(),this.applyMatrix4(Id.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hs).negate(),this.translate(Hs.x,Hs.y,Hs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Kt(i,3))}else{let i=Math.min(e.length,t.count);for(let r=0;r<i;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){let s=t[i];Gn.setFromBufferAttribute(s),this.morphTargetsRelative?(cn.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(cn),cn.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(cn)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let i=this.boundingSphere.center;if(Gn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];na.setFromBufferAttribute(a),this.morphTargetsRelative?(cn.addVectors(Gn.min,na.min),Gn.expandByPoint(cn),cn.addVectors(Gn.max,na.max),Gn.expandByPoint(cn)):(Gn.expandByPoint(na.min),Gn.expandByPoint(na.max))}Gn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)cn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(cn));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)cn.fromBufferAttribute(a,c),l&&(Hs.fromBufferAttribute(e,c),cn.add(Hs)),r=Math.max(r,i.distanceToSquared(cn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,r=t.normal,s=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Qe(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(i.count);for(let P=0;P<i.count;P++)a[P]=new O,l[P]=new O;let u=new O,h=new O,f=new O,d=new Me,p=new Me,g=new Me,m=new O,y=new O;function b(P,C,I){c[P]=c[C]=c[I]=1,u.fromBufferAttribute(i,P),h.fromBufferAttribute(i,C),f.fromBufferAttribute(i,I),d.fromBufferAttribute(s,P),p.fromBufferAttribute(s,C),g.fromBufferAttribute(s,I),h.sub(u),f.sub(u),p.sub(d),g.sub(d);let U=1/(p.x*g.y-g.x*p.y);isFinite(U)&&(m.copy(h).multiplyScalar(g.y).addScaledVector(f,-p.y).multiplyScalar(U),y.copy(f).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(U),a[P].add(m),a[C].add(m),a[I].add(m),l[P].add(y),l[C].add(y),l[I].add(y))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let P=0,C=_.length;P<C;++P){let I=_[P],U=I.start,j=I.count;for(let L=U,z=U+j;L<z;L+=3)b(e.getX(L+0),e.getX(L+1),e.getX(L+2))}let x=new O,S=new O,w=new O,v=new O;function T(P){w.fromBufferAttribute(r,P),v.copy(w);let C=a[P];x.copy(C),x.sub(w.multiplyScalar(w.dot(C))).normalize(),S.crossVectors(v,C);let U=S.dot(l[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,U)}for(let P=0,C=i.count;P<C;++P)c[P]&&T(P);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Qe(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);let r=new O,s=new O,o=new O,a=new O,l=new O,c=new O,u=new O,h=new O;if(e)for(let f=0,d=e.count;f<d;f+=3){let p=e.getX(f+0),g=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,p),s.fromBufferAttribute(t,g),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)cn.fromBufferAttribute(e,t),cn.normalize(),e.setXYZ(t,cn.x,cn.y,cn.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u),d=0,p=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?d=l[g]*a.data.stride+a.offset:d=l[g]*u;for(let y=0;y<u;y++)f[p++]=c[d++]}return new Qe(f,u,h)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){let f=c[u],d=e(f,i);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){let d=c[h];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ic=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=xf,this.updateRanges=[],this.version=0,this.uuid=Ar()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=dg(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let i=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(i,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=dg(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}};function dg(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=Ar()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}var Rn=new O,Bt=class n{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r,this._normalizationScale=e!==void 0?Nu(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Rn.fromBufferAttribute(this,t),Rn.applyMatrix4(e),this.setXYZ(t,Rn.x,Rn.y,Rn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rn.fromBufferAttribute(this,t),Rn.applyNormalMatrix(e),this.setXYZ(t,Rn.x,Rn.y,Rn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rn.fromBufferAttribute(this,t),Rn.transformDirection(e),this.setXYZ(t,Rn.x,Rn.y,Rn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){ha("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Qe(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ha("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Sf(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Mf(e,this.data.array)}},kd=new O,Qv=new O,e_=new He,Wn=class{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=kd.subVectors(i,t).cross(Qv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(kd),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||e_.getNormalMatrix(e),r=this.coplanarPoint(kd).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},t_=0,ji=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:t_++}),this.uuid=Ar(),this.name="",this.type="Material",this.blending=oo,this.side=Er,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qd,this.blendDst=Yd,this.blendEquation=hs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=js,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ty,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Fe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Wn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Me().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Me().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Gi=new O,Dd=new O,tc=new O,nc=new O,br=class{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Gi.copy(this.origin).addScaledVector(this.direction,t),Gi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Dd.copy(e).add(t).multiplyScalar(.5),tc.copy(t).sub(e).normalize(),nc.copy(this.origin).sub(Dd);let s=e.distanceTo(t)*.5,o=-this.direction.dot(tc),a=nc.dot(this.direction),l=-nc.dot(tc),c=nc.lengthSq(),u=Math.abs(1-o*o),h,f,d,p;if(u>0)if(h=o*l-a,f=o*a-l,p=s*u,h>=0)if(f>=-p)if(f<=p){let g=1/u;h*=g,f*=g,d=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f<=-p?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),d=-h*h+f*(f+2*l)+c):f<=p?(h=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),d=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Dd).addScaledVector(tc,f),d}intersectSphere(e,t){if(e.radius<0)return null;Gi.subVectors(e.center,this.origin);let i=Gi.dot(this.direction),r=Gi.dot(Gi)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Gi)!==null}intersectTriangle(e,t,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,h=e.x-o.x,f=e.y-o.y,d=e.z-o.z,p=t.x-o.x,g=t.y-o.y,m=t.z-o.z,y=i.x-o.x,b=i.y-o.y,_=i.z-o.z,x=Math.abs(l),S=Math.abs(c),w=Math.abs(u),v,T,P,C,I,U,j,L,z,B,H,K;if(x>=S&&x>=w?(P=l,U=h,z=p,K=y,l>=0?(v=c,T=u,C=f,I=d,j=g,L=m,B=b,H=_):(v=u,T=c,C=d,I=f,j=m,L=g,B=_,H=b)):S>=w?(P=c,U=f,z=g,K=b,c>=0?(v=u,T=l,C=d,I=h,j=m,L=p,B=_,H=y):(v=l,T=u,C=h,I=d,j=p,L=m,B=y,H=_)):(P=u,U=d,z=m,K=_,u>=0?(v=l,T=c,C=h,I=f,j=p,L=g,B=y,H=b):(v=c,T=l,C=f,I=h,j=g,L=p,B=b,H=y)),P===0)return null;let $=v/P,Y=T/P,q=1/P,ae=C-$*U,Re=I-Y*U,J=j-$*z,oe=L-Y*z,_e=B-$*K,Le=H-Y*K,ye=_e*oe-Le*J,Ue=ae*Le-Re*_e,_t=J*Re-oe*ae;if(r){if(ye<0||Ue<0||_t<0)return null}else if((ye<0||Ue<0||_t<0)&&(ye>0||Ue>0||_t>0))return null;let Ae=ye+Ue+_t;if(Ae===0)return null;let rt=q*(ye*U+Ue*z+_t*K);return(Ae>0?rt<0:rt>0)?null:this.at(rt/Ae,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Zs=class extends ji{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gr,this.combine=Jd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},fg=new Mt,ns=new br,ic=new yr,pg=new O,rc=new O,sc=new O,oc=new O,Nd=new O,ac=new O,mg=new O,lc=new O,bt=class extends hn{constructor(e=new ft,t=new Zs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){ac.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],h=s[l];u!==0&&(Nd.fromBufferAttribute(h,e),o?ac.addScaledVector(Nd,u):ac.addScaledVector(Nd.sub(t),u))}t.add(ac)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ic.copy(i.boundingSphere),ic.applyMatrix4(s),ns.copy(e.ray).recast(e.near),!(ic.containsPoint(ns.origin)===!1&&(ns.intersectSphere(ic,pg)===null||ns.origin.distanceToSquared(pg)>(e.far-e.near)**2))&&(fg.copy(s).invert(),ns.copy(e.ray).applyMatrix4(fg),!(i.boundingBox!==null&&ns.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=f.length;p<g;p++){let m=f[p],y=o[m.materialIndex],b=Math.max(m.start,d.start),_=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let x=b,S=_;x<S;x+=3){let w=a.getX(x),v=a.getX(x+1),T=a.getX(x+2);r=cc(this,y,e,i,c,u,h,w,v,T),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let p=Math.max(0,d.start),g=Math.min(a.count,d.start+d.count);for(let m=p,y=g;m<y;m+=3){let b=a.getX(m),_=a.getX(m+1),x=a.getX(m+2);r=cc(this,o,e,i,c,u,h,b,_,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,g=f.length;p<g;p++){let m=f[p],y=o[m.materialIndex],b=Math.max(m.start,d.start),_=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let x=b,S=_;x<S;x+=3){let w=x,v=x+1,T=x+2;r=cc(this,y,e,i,c,u,h,w,v,T),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let p=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let m=p,y=g;m<y;m+=3){let b=m,_=m+1,x=m+2;r=cc(this,o,e,i,c,u,h,b,_,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function n_(n,e,t,i,r,s,o,a){let l;if(e.side===Ln?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Er,a),l===null)return null;lc.copy(a),lc.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(lc);return c<t.near||c>t.far?null:{distance:c,point:lc.clone(),object:n}}function cc(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,rc),n.getVertexPosition(l,sc),n.getVertexPosition(c,oc);let u=n_(n,e,t,i,rc,sc,oc,mg);if(u){let h=new O;mr.getBarycoord(mg,rc,sc,oc,h),r&&(u.uv=mr.getInterpolatedAttribute(r,a,l,c,h,new Me)),s&&(u.uv1=mr.getInterpolatedAttribute(s,a,l,c,h,new Me)),o&&(u.normal=mr.getInterpolatedAttribute(o,a,l,c,h,new O),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new O,materialIndex:0};mr.getNormal(rc,sc,oc,f.normal),u.face=f,u.barycoord=h}return u}var xr=class extends xn{constructor(e=null,t=1,i=1,r,s,o,a,l,c=kt,u=kt,h,f){super(null,o,a,l,c,u,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var as=class extends Qe{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}};var is=new yr,i_=new Me(.5,.5),uc=new O,ls=class{constructor(e=new Wn,t=new Wn,i=new Wn,r=new Wn,s=new Wn,o=new Wn){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=ni,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],f=s[6],d=s[7],p=s[8],g=s[9],m=s[10],y=s[11],b=s[12],_=s[13],x=s[14],S=s[15];if(r[0].setComponents(c-o,d-u,y-p,S-b).normalize(),r[1].setComponents(c+o,d+u,y+p,S+b).normalize(),r[2].setComponents(c+a,d+h,y+g,S+_).normalize(),r[3].setComponents(c-a,d-h,y-g,S-_).normalize(),i)r[4].setComponents(l,f,m,x).normalize(),r[5].setComponents(c-l,d-f,y-m,S-x).normalize();else if(r[4].setComponents(c-l,d-f,y-m,S-x).normalize(),t===ni)r[5].setComponents(c+l,d+f,y+m,S+x).normalize();else if(t===ca)r[5].setComponents(l,f,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){is.center.set(0,0,0);let t=i_.distanceTo(e.center);return is.radius=.7071067811865476+t,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(uc.x=r.normal.x>0?e.max.x:e.min.x,uc.y=r.normal.y>0?e.max.y:e.min.y,uc.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(uc)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},gg=new Mt,kc=class n{constructor(){this.coordinateSystem=ni,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,i=this._frustums;for(let r=0;r<t.length;r++){let s=t[r];gg.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),i[r]===void 0&&(i[r]=new ls),i[r].setFromProjectionMatrix(gg,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,i=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new ls),t[r].copy(i[r]);return this._count=e._count,this}clone(){return new n().copy(this)}};var cs=class extends ji{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Dc=new O,Nc=new O,yg=new Mt,ia=new br,hc=new yr,Od=new O,bg=new O,Ks=class extends hn{constructor(e=new ft,t=new cs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Dc.fromBufferAttribute(t,r-1),Nc.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Dc.distanceTo(Nc);e.setAttribute("lineDistance",new Kt(i,1))}else Ne("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),hc.copy(i.boundingSphere),hc.applyMatrix4(r),hc.radius+=s,e.ray.intersectsSphere(hc)===!1)return;yg.copy(r).invert(),ia.copy(e.ray).applyMatrix4(yg);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,m=p-1;g<m;g+=c){let y=u.getX(g),b=u.getX(g+1),_=dc(this,e,ia,l,y,b,g);_&&t.push(_)}if(this.isLineLoop){let g=u.getX(p-1),m=u.getX(d),y=dc(this,e,ia,l,g,m,p-1);y&&t.push(y)}}else{let d=Math.max(0,o.start),p=Math.min(f.count,o.start+o.count);for(let g=d,m=p-1;g<m;g+=c){let y=dc(this,e,ia,l,g,g+1,g);y&&t.push(y)}if(this.isLineLoop){let g=dc(this,e,ia,l,p-1,d,p-1);g&&t.push(g)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function dc(n,e,t,i,r,s,o){let a=n.geometry.attributes.position;if(Dc.fromBufferAttribute(a,r),Nc.fromBufferAttribute(a,s),t.distanceSqToSegment(Dc,Nc,Od,bg)>i)return;Od.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Od);if(!(c<e.near||c>e.far))return{distance:c,point:bg.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var xg=new O,vg=new O,Qs=class extends Ks{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)xg.fromBufferAttribute(t,r),vg.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+xg.distanceTo(vg);e.setAttribute("lineDistance",new Kt(i,1))}else Ne("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var us=class extends ji{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},_g=new Mt,Hd=new br,fc=new yr,pc=new O,eo=class extends hn{constructor(e=new ft,t=new us){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),fc.copy(i.boundingSphere),fc.applyMatrix4(r),fc.radius+=s,e.ray.intersectsSphere(fc)===!1)return;_g.copy(r).invert(),Hd.copy(e.ray).applyMatrix4(_g);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){let f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let p=f,g=d;p<g;p++){let m=c.getX(p);pc.fromBufferAttribute(h,m),Sg(pc,m,l,r,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let p=f,g=d;p<g;p++)pc.fromBufferAttribute(h,p),Sg(pc,p,l,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Sg(n,e,t,i,r,s,o){let a=Hd.distanceSqToPoint(n);if(a<t){let l=new O;Hd.closestPointToPoint(n,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ga=class extends xn{constructor(e=[],t=ds,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},to=class extends xn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Xi=class extends xn{constructor(e,t,i=pi,r,s,o,a=kt,l=kt,c,u=Wi,h=1){if(u!==Wi&&u!==Zi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:h};super(f,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ys(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ya=class extends Xi{constructor(e,t=pi,i=ds,r,s,o=kt,a=kt,l,c=Wi){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ba=class extends xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},no=class n extends ft{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],h=[],f=0,d=0;p("z","y","x",-1,-1,i,t,e,o,s,0),p("z","y","x",1,-1,i,t,-e,o,s,1),p("x","z","y",1,1,e,i,t,r,o,2),p("x","z","y",1,-1,e,i,-t,r,o,3),p("x","y","z",1,-1,e,t,i,r,s,4),p("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(u,3)),this.setAttribute("uv",new Kt(h,2));function p(g,m,y,b,_,x,S,w,v,T,P){let C=x/v,I=S/T,U=x/2,j=S/2,L=w/2,z=v+1,B=T+1,H=0,K=0,$=new O;for(let Y=0;Y<B;Y++){let q=Y*I-j;for(let ae=0;ae<z;ae++){let Re=ae*C-U;$[g]=Re*b,$[m]=q*_,$[y]=L,c.push($.x,$.y,$.z),$[g]=0,$[m]=0,$[y]=w>0?1:-1,u.push($.x,$.y,$.z),h.push(ae/v),h.push(1-Y/T),H+=1}}for(let Y=0;Y<T;Y++)for(let q=0;q<v;q++){let ae=f+q+z*Y,Re=f+q+z*(Y+1),J=f+(q+1)+z*(Y+1),oe=f+(q+1)+z*Y;l.push(ae,Re,oe),l.push(Re,J,oe),K+=6}a.addGroup(d,K,P),d+=K,f+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var qi=class n extends ft{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,f=t/l,d=[],p=[],g=[],m=[];for(let y=0;y<u;y++){let b=y*f-o;for(let _=0;_<c;_++){let x=_*h-s;p.push(x,-b,0),g.push(0,0,1),m.push(_/a),m.push(1-y/l)}}for(let y=0;y<l;y++)for(let b=0;b<a;b++){let _=b+c*y,x=b+c*(y+1),S=b+1+c*(y+1),w=b+1+c*y;d.push(_,x,w),d.push(x,S,w)}this.setIndex(d),this.setAttribute("position",new Kt(p,3)),this.setAttribute("normal",new Kt(g,3)),this.setAttribute("uv",new Kt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};function ps(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let r=n[t][i];if(Mg(r))r.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(Mg(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function An(n){let e={};for(let t=0;t<n.length;t++){let i=ps(n[t]);for(let r in i)e[r]=i[r]}return e}function Mg(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function r_(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ef(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}var dy={clone:ps,merge:An},s_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,o_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Rt=class extends ji{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=s_,this.fragmentShader=o_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ps(e.uniforms),this.uniformsGroups=r_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Fe().setHex(r.value);break;case"v2":this.uniforms[i].value=new Me().fromArray(r.value);break;case"v3":this.uniforms[i].value=new O().fromArray(r.value);break;case"v4":this.uniforms[i].value=new ct().fromArray(r.value);break;case"m3":this.uniforms[i].value=new He().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Mt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Oc=class extends Rt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Fc=class extends ji{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Uc=class extends ji{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Vs(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function mc(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var vr=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=t[++i],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=i[s+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Bc=class extends vr{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ud,endingEnd:Ud}}intervalChanged_(e,t,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case Bd:s=e,a=2*t-i;break;case zd:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Bd:o=e,l=2*i-t;break;case zd:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=t}let c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,p=(i-t)/(r-t),g=p*p,m=g*p,y=-f*m+2*f*g-f*p,b=(1+f)*m+(-1.5-2*f)*g+(-.5+f)*p+1,_=(-1-d)*m+(1.5+d)*g+.5*p,x=d*m-d*g;for(let S=0;S!==a;++S)s[S]=y*o[u+S]+b*o[c+S]+_*o[l+S]+x*o[h+S];return s}},zc=class extends vr{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-t)/(r-t),h=1-u;for(let f=0;f!==a;++f)s[f]=o[c+f]*h+o[l+f]*u;return s}},Hc=class extends vr{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Vc=class extends vr{interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let p=(i-t)/(r-t),g=1-p;for(let m=0;m!==a;++m)s[m]=o[c+m]*g+o[l+m]*p;return s}let f=a*2,d=e-1;for(let p=0;p!==a;++p){let g=o[c+p],m=o[l+p],y=d*f+p*2,b=h[y],_=h[y+1],x=e*f+p*2,S=u[x],w=u[x+1],v=l_(i,t,b,S,r);s[p]=fy(v,g,_,w,m)}return s}};function fy(n,e,t,i,r){let s=1-n;return s*s*s*e+3*s*s*n*t+3*s*n*n*i+n*n*n*r}function a_(n,e,t,i,r){let s=1-n;return 3*s*s*(t-e)+6*s*n*(i-t)+3*n*n*(r-i)}function l_(n,e,t,i,r){let s=(n-e)/(r-e);for(let o=0;o<8;o++){let a=fy(s,e,t,i,r)-n;if(Math.abs(a)<1e-10)break;let l=a_(s,e,t,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var qn=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Vs(t,this.TimeBufferType),this.values=Vs(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Vs(e.times,Array),values:Vs(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),mc(e.settings)&&(i.settings={inTangents:Vs(e.settings.inTangents,Array),outTangents:Vs(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Hc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new zc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Bc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Vc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case aa:t=this.InterpolantFactoryMethodDiscrete;break;case Cc:t=this.InterpolantFactoryMethodLinear;break;case bc:t=this.InterpolantFactoryMethodSmooth;break;case Fd:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ne("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return aa;case this.InterpolantFactoryMethodLinear:return Cc;case this.InterpolantFactoryMethodSmooth:return bc;case this.InterpolantFactoryMethodBezier:return Fd}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e;mc(this.settings)&&(wg(this.settings.inTangents,e),wg(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;mc(this.settings)&&(Eg(this.settings.inTangents,e),Eg(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ze("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(ze("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){ze("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){ze("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&wv(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){ze("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===bc,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let h=a*i,f=h-i,d=h+i;for(let p=0;p!==i;++p){let g=t[h+p];if(g!==t[f+p]||g!==t[d+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*i,f=o*i;for(let d=0;d!==i;++d)t[f+d]=t[h+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,mc(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function wg(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function Eg(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}qn.prototype.ValueTypeName="";qn.prototype.TimeBufferType=Float32Array;qn.prototype.ValueBufferType=Float32Array;qn.prototype.DefaultInterpolation=Cc;var _r=class extends qn{constructor(e,t,i){super(e,t,i)}};_r.prototype.ValueTypeName="bool";_r.prototype.ValueBufferType=Array;_r.prototype.DefaultInterpolation=aa;_r.prototype.InterpolantFactoryMethodLinear=void 0;_r.prototype.InterpolantFactoryMethodSmooth=void 0;var Gc=class extends qn{constructor(e,t,i,r){super(e,t,i,r)}};Gc.prototype.ValueTypeName="color";var $c=class extends qn{constructor(e,t,i,r){super(e,t,i,r)}};$c.prototype.ValueTypeName="number";var Wc=class extends vr{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(r-t),c=e*a;for(let u=c+a;c!==u;c+=4)Xn.slerpFlat(s,0,o,c-a,o,c,l);return s}},xa=class extends qn{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new Wc(this.times,this.values,this.getValueSize(),e)}};xa.prototype.ValueTypeName="quaternion";xa.prototype.InterpolantFactoryMethodSmooth=void 0;var Sr=class extends qn{constructor(e,t,i){super(e,t,i)}};Sr.prototype.ValueTypeName="string";Sr.prototype.ValueBufferType=Array;Sr.prototype.DefaultInterpolation=aa;Sr.prototype.InterpolantFactoryMethodLinear=void 0;Sr.prototype.InterpolantFactoryMethodSmooth=void 0;var jc=class extends qn{constructor(e,t,i,r){super(e,t,i,r)}};jc.prototype.ValueTypeName="vector";var Xc=class{constructor(e,t,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){let d=c[h],p=c[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},py=new Xc,qc=class{constructor(e){this.manager=e!==void 0?e:py,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};qc.DEFAULT_MATERIAL_NAME="__DEFAULT";var gc=new O,yc=new Xn,Ci=new O,va=class extends hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(gc,yc,Ci),Ci.x===1&&Ci.y===1&&Ci.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(gc,yc,Ci.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(gc,yc,Ci),Ci.x===1&&Ci.y===1&&Ci.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(gc,yc,Ci.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},pr=new O,Tg=new Me,Ag=new Me,bn=class extends va{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=qs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qs*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){pr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(pr.x,pr.y).multiplyScalar(-e/pr.z),pr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(pr.x,pr.y).multiplyScalar(-e/pr.z)}getViewSize(e,t){return this.getViewBounds(e,Tg,Ag),t.subVectors(Ag,Tg)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(sa*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var On=class extends va{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var Mr=class extends ft{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var Gs=-90,$s=1,io=class extends hn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new bn(Gs,$s,e,t);r.layers=this.layers,this.add(r);let s=new bn(Gs,$s,e,t);s.layers=this.layers,this.add(s);let o=new bn(Gs,$s,e,t);o.layers=this.layers,this.add(o);let a=new bn(Gs,$s,e,t);a.layers=this.layers,this.add(a);let l=new bn(Gs,$s,e,t);l.layers=this.layers,this.add(l);let c=new bn(Gs,$s,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===ni)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ca)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let g=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=g,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}},Yc=class extends bn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}};var Tf="\\[\\]\\.:\\/",c_=new RegExp("["+Tf+"]","g"),Af="[^"+Tf+"]",u_="[^"+Tf.replace("\\.","")+"]",h_=/((?:WC+[\/:])*)/.source.replace("WC",Af),d_=/(WCOD+)?/.source.replace("WCOD",u_),f_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Af),p_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Af),m_=new RegExp("^"+h_+d_+f_+p_+"$"),g_=["material","materials","bones","map"],Vd=class{constructor(e,t,i){let r=i||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Ct=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(c_,"")}static parseTrackName(e){let t=m_.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);g_.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ne("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;ze("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=Vd;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var AC=new Float32Array(1);var wr=class extends Ic{constructor(e,t,i=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};var ro=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ke(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ke(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Gd=class{static{this.prototype.isMatrix2=!0}constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}},Cg=new Me,_a=class{constructor(e=new Me(1/0,1/0),t=new Me(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Cg.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Cg).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};var Sa=class extends hi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Cf(n,e,t,i){let r=y_(i);switch(t){case uf:return n*e;case df:return n*e/r.components*r.byteLength;case nu:return n*e/r.components*r.byteLength;case Tr:return n*e*2/r.components*r.byteLength;case iu:return n*e*2/r.components*r.byteLength;case hf:return n*e*3/r.components*r.byteLength;case kn:return n*e*4/r.components*r.byteLength;case ru:return n*e*4/r.components*r.byteLength;case Ea:case Ta:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Aa:case Ca:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ou:case lu:return Math.max(n,16)*Math.max(e,8)/4;case su:case au:return Math.max(n,8)*Math.max(e,8)/2;case cu:case uu:case du:case fu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case hu:case Ra:case pu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case mu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case gu:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case yu:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case bu:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case xu:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case vu:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case _u:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Su:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Mu:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case wu:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Eu:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Tu:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Au:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Cu:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ru:case Pu:case Lu:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Iu:case ku:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pa:case Du:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function y_(n){switch(n){case In:case of:return{byteLength:1,components:1};case lo:case af:case mi:return{byteLength:2,components:1};case eu:case tu:return{byteLength:2,components:4};case pi:case Qc:case Yn:return{byteLength:4,components:1};case lf:case cf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Oy(){let n=null,e=!1,t=null,i=null;function r(s,o){i=n.requestAnimationFrame(r),t(s,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function x_(n){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){let u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<h.length;d++){let p=h[f],g=h[d];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++f,h[f]=g)}h.length=f+1;for(let d=0,p=h.length;d<p;d++){let g=h[d];n.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var v_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,__=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,S_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,M_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,w_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,E_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,T_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,A_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,C_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,R_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,P_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,L_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,I_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,k_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,D_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,N_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,O_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,F_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,U_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,B_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,z_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,H_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,V_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,G_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,W_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,j_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,X_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,q_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Y_="gl_FragColor = linearToOutputTexel( gl_FragColor );",J_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Z_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,K_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Q_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,eS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,iS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,oS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,aS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,hS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,dS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,yS=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_S=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,SS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,MS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ES=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,TS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,AS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,CS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,RS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,PS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,LS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,IS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kS=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,DS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,NS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,OS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,FS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,US=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,BS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,HS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,VS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,GS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$S=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,WS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,XS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,YS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,JS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ZS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,KS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,QS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,eM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,nM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,iM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,oM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,aM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,uM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,yM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,xM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_M=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,SM=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,MM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,EM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,TM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,AM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,CM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,RM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,PM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,LM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,IM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,DM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,NM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,OM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,FM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,UM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,HM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,VM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,GM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$M=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,YM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ZM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,KM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:v_,alphahash_pars_fragment:__,alphamap_fragment:S_,alphamap_pars_fragment:M_,alphatest_fragment:w_,alphatest_pars_fragment:E_,aomap_fragment:T_,aomap_pars_fragment:A_,batching_pars_vertex:C_,batching_vertex:R_,begin_vertex:P_,beginnormal_vertex:L_,bsdfs:I_,iridescence_fragment:k_,bumpmap_pars_fragment:D_,clipping_planes_fragment:N_,clipping_planes_pars_fragment:O_,clipping_planes_pars_vertex:F_,clipping_planes_vertex:U_,color_fragment:B_,color_pars_fragment:z_,color_pars_vertex:H_,color_vertex:V_,common:G_,defaultnormal_vertex:$_,displacementmap_pars_vertex:W_,displacementmap_vertex:j_,emissivemap_fragment:X_,emissivemap_pars_fragment:q_,colorspace_fragment:Y_,colorspace_pars_fragment:J_,envmap_fragment:Z_,envmap_common_pars_fragment:K_,envmap_pars_fragment:Q_,envmap_pars_vertex:eS,envmap_physical_pars_fragment:hS,envmap_vertex:tS,fog_vertex:nS,fog_pars_vertex:iS,fog_fragment:rS,fog_pars_fragment:sS,gradientmap_pars_fragment:oS,lightmap_pars_fragment:aS,lights_lambert_fragment:lS,lights_lambert_pars_fragment:cS,lights_pars_begin:uS,lights_toon_fragment:dS,lights_toon_pars_fragment:fS,lights_phong_fragment:pS,lights_phong_pars_fragment:mS,lights_physical_fragment:gS,lights_physical_pars_fragment:yS,lights_fragment_begin:bS,lights_fragment_maps:xS,lights_fragment_end:vS,lightprobes_pars_fragment:_S,logdepthbuf_fragment:SS,logdepthbuf_pars_fragment:MS,logdepthbuf_pars_vertex:wS,logdepthbuf_vertex:ES,map_fragment:TS,map_pars_fragment:AS,map_particle_fragment:CS,map_particle_pars_fragment:RS,metalnessmap_fragment:PS,metalnessmap_pars_fragment:LS,morphinstance_vertex:IS,morphcolor_vertex:kS,morphnormal_vertex:DS,morphtarget_pars_vertex:NS,morphtarget_vertex:OS,normal_fragment_begin:FS,normal_fragment_maps:US,normal_pars_fragment:BS,normal_pars_vertex:zS,normal_vertex:HS,normalmap_pars_fragment:VS,clearcoat_normal_fragment_begin:GS,clearcoat_normal_fragment_maps:$S,clearcoat_pars_fragment:WS,iridescence_pars_fragment:jS,opaque_fragment:XS,packing:qS,premultiplied_alpha_fragment:YS,project_vertex:JS,dithering_fragment:ZS,dithering_pars_fragment:KS,roughnessmap_fragment:QS,roughnessmap_pars_fragment:eM,shadowmap_pars_fragment:tM,shadowmap_pars_vertex:nM,shadowmap_vertex:iM,shadowmask_pars_fragment:rM,skinbase_vertex:sM,skinning_pars_vertex:oM,skinning_vertex:aM,skinnormal_vertex:lM,specularmap_fragment:cM,specularmap_pars_fragment:uM,tonemapping_fragment:hM,tonemapping_pars_fragment:dM,transmission_fragment:fM,transmission_pars_fragment:pM,uv_pars_fragment:mM,uv_pars_vertex:gM,uv_vertex:yM,worldpos_vertex:bM,background_vert:xM,background_frag:vM,backgroundCube_vert:_M,backgroundCube_frag:SM,cube_vert:MM,cube_frag:wM,depth_vert:EM,depth_frag:TM,distance_vert:AM,distance_frag:CM,equirect_vert:RM,equirect_frag:PM,linedashed_vert:LM,linedashed_frag:IM,meshbasic_vert:kM,meshbasic_frag:DM,meshlambert_vert:NM,meshlambert_frag:OM,meshmatcap_vert:FM,meshmatcap_frag:UM,meshnormal_vert:BM,meshnormal_frag:zM,meshphong_vert:HM,meshphong_frag:VM,meshphysical_vert:GM,meshphysical_frag:$M,meshtoon_vert:WM,meshtoon_frag:jM,points_vert:XM,points_frag:qM,shadow_vert:YM,shadow_frag:JM,sprite_vert:ZM,sprite_frag:KM},xe={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},Li={basic:{uniforms:An([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:An([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Fe(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:An([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:An([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:An([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:An([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:An([xe.points,xe.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:An([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:An([xe.common,xe.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:An([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:An([xe.sprite,xe.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:An([xe.common,xe.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:An([xe.lights,xe.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};Li.physical={uniforms:An([Li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new He},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};var Ou={r:0,b:0,g:0},QM=new Mt,Fy=new He;Fy.set(-1,0,0,0,1,0,0,0,1);function ew(n,e,t,i,r,s){let o=new Fe(0),a=r===!0?0:1,l,c,u=null,h=0,f=null;function d(b){let _=b.isScene===!0?b.background:null;if(_&&_.isTexture){let x=b.backgroundBlurriness>0;_=e.get(_,x)}return _}function p(b){let _=!1,x=d(b);x===null?m(o,a):x&&x.isColor&&(m(x,1),_=!0);let S=n.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(b,_){let x=d(_);x&&x.isCubeTexture?(c===void 0&&(c=new bt(new no(1,1,1),new Rt({name:"BackgroundCubeMaterial",uniforms:ps(Li.backgroundCube.uniforms),vertexShader:Li.backgroundCube.vertexShader,fragmentShader:Li.backgroundCube.fragmentShader,side:Ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,w,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(QM.makeRotationFromEuler(_.backgroundRotation)).transpose(),x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Fy),c.material.toneMapped=Ze.getTransfer(x.colorSpace)!==yt,(u!==x||h!==x.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=x,h=x.version,f=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new bt(new qi(2,2),new Rt({name:"BackgroundMaterial",uniforms:ps(Li.background.uniforms),vertexShader:Li.background.vertexShader,fragmentShader:Li.background.fragmentShader,side:Er,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Ze.getTransfer(x.colorSpace)!==yt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||h!==x.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=x,h=x.version,f=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,_){b.getRGB(Ou,Ef(n)),t.buffers.color.setClear(Ou.r,Ou.g,Ou.b,_,s)}function y(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,_=1){o.set(b),a=_,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,m(o,a)},render:p,addToRenderList:g,dispose:y}}function tw(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null),s=r,o=!1;function a(I,U,j,L,z){let B=!1,H=h(I,L,j,U);s!==H&&(s=H,c(s.object)),B=d(I,L,j,z),B&&p(I,L,j,z),z!==null&&e.update(z,n.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,x(I,U,j,L),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return n.createVertexArray()}function c(I){return n.bindVertexArray(I)}function u(I){return n.deleteVertexArray(I)}function h(I,U,j,L){let z=L.wireframe===!0,B=i[U.id];B===void 0&&(B={},i[U.id]=B);let H=I.isInstancedMesh===!0?I.id:0,K=B[H];K===void 0&&(K={},B[H]=K);let $=K[j.id];$===void 0&&($={},K[j.id]=$);let Y=$[z];return Y===void 0&&(Y=f(l()),$[z]=Y),Y}function f(I){let U=[],j=[],L=[];for(let z=0;z<t;z++)U[z]=0,j[z]=0,L[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:j,attributeDivisors:L,object:I,attributes:{},index:null}}function d(I,U,j,L){let z=s.attributes,B=U.attributes,H=0,K=j.getAttributes();for(let $ in K)if(K[$].location>=0){let q=z[$],ae=B[$];if(ae===void 0&&($==="instanceMatrix"&&I.instanceMatrix&&(ae=I.instanceMatrix),$==="instanceColor"&&I.instanceColor&&(ae=I.instanceColor)),q===void 0||q.attribute!==ae||ae&&q.data!==ae.data)return!0;H++}return s.attributesNum!==H||s.index!==L}function p(I,U,j,L){let z={},B=U.attributes,H=0,K=j.getAttributes();for(let $ in K)if(K[$].location>=0){let q=B[$];q===void 0&&($==="instanceMatrix"&&I.instanceMatrix&&(q=I.instanceMatrix),$==="instanceColor"&&I.instanceColor&&(q=I.instanceColor));let ae={};ae.attribute=q,q&&q.data&&(ae.data=q.data),z[$]=ae,H++}s.attributes=z,s.attributesNum=H,s.index=L}function g(){let I=s.newAttributes;for(let U=0,j=I.length;U<j;U++)I[U]=0}function m(I){y(I,0)}function y(I,U){let j=s.newAttributes,L=s.enabledAttributes,z=s.attributeDivisors;j[I]=1,L[I]===0&&(n.enableVertexAttribArray(I),L[I]=1),z[I]!==U&&(n.vertexAttribDivisor(I,U),z[I]=U)}function b(){let I=s.newAttributes,U=s.enabledAttributes;for(let j=0,L=U.length;j<L;j++)U[j]!==I[j]&&(n.disableVertexAttribArray(j),U[j]=0)}function _(I,U,j,L,z,B,H){H===!0?n.vertexAttribIPointer(I,U,j,z,B):n.vertexAttribPointer(I,U,j,L,z,B)}function x(I,U,j,L){g();let z=L.attributes,B=j.getAttributes(),H=U.defaultAttributeValues;for(let K in B){let $=B[K];if($.location>=0){let Y=z[K];if(Y===void 0&&(K==="instanceMatrix"&&I.instanceMatrix&&(Y=I.instanceMatrix),K==="instanceColor"&&I.instanceColor&&(Y=I.instanceColor)),Y!==void 0){let q=Y.normalized,ae=Y.itemSize,Re=e.get(Y);if(Re===void 0)continue;let J=Re.buffer,oe=Re.type,_e=Re.bytesPerElement,Le=oe===n.INT||oe===n.UNSIGNED_INT||Y.gpuType===Qc;if(Y.isInterleavedBufferAttribute){let ye=Y.data,Ue=ye.isInterleavedBuffer===!0?ye.stride:ye.itemSize,_t=Y.offset;if(ye.isInstancedInterleavedBuffer||ye.isInstancedBufferAttribute){for(let Ae=0;Ae<$.locationSize;Ae++)y($.location+Ae,ye.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ye.meshPerAttribute*ye.count)}else for(let Ae=0;Ae<$.locationSize;Ae++)m($.location+Ae);n.bindBuffer(n.ARRAY_BUFFER,J);for(let Ae=0;Ae<$.locationSize;Ae++)_($.location+Ae,ae/$.locationSize,oe,q,Ue*_e,(_t+ae/$.locationSize*Ae)*_e,Le)}else{if(Y.isInstancedBufferAttribute){for(let ye=0;ye<$.locationSize;ye++)y($.location+ye,Y.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ye=0;ye<$.locationSize;ye++)m($.location+ye);n.bindBuffer(n.ARRAY_BUFFER,J);for(let ye=0;ye<$.locationSize;ye++)_($.location+ye,ae/$.locationSize,oe,q,ae*_e,ae/$.locationSize*ye*_e,Le)}}else if(H!==void 0){let q=H[K];if(q!==void 0)switch(q.length){case 2:n.vertexAttrib2fv($.location,q);break;case 3:n.vertexAttrib3fv($.location,q);break;case 4:n.vertexAttrib4fv($.location,q);break;default:n.vertexAttrib1fv($.location,q)}}}}b()}function S(){P();for(let I in i){let U=i[I];for(let j in U){let L=U[j];for(let z in L){let B=L[z];for(let H in B)u(B[H].object),delete B[H];delete L[z]}}delete i[I]}}function w(I){if(i[I.id]===void 0)return;let U=i[I.id];for(let j in U){let L=U[j];for(let z in L){let B=L[z];for(let H in B)u(B[H].object),delete B[H];delete L[z]}}delete i[I.id]}function v(I){for(let U in i){let j=i[U];for(let L in j){let z=j[L];if(z[I.id]===void 0)continue;let B=z[I.id];for(let H in B)u(B[H].object),delete B[H];delete z[I.id]}}}function T(I){for(let U in i){let j=i[U],L=I.isInstancedMesh===!0?I.id:0,z=j[L];if(z!==void 0){for(let B in z){let H=z[B];for(let K in H)u(H[K].object),delete H[K];delete z[B]}delete j[L],Object.keys(j).length===0&&delete i[U]}}}function P(){C(),o=!0,s!==r&&(s=r,c(s.object))}function C(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:C,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfObject:T,releaseStatesOfProgram:v,initAttributes:g,enableAttribute:m,disableUnusedAttributes:b}}function nw(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let f=0;for(let d=0;d<u;d++)f+=c[d];t.update(f,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function iw(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let v=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(v.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(v){return!(v!==kn&&i.convert(v)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(v){let T=v===mi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(v!==In&&v!==Yn&&!T&&i.convert(v)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(v){if(v==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";v="mediump"}return v==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Ne("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&h===!1;t.reversedDepthBuffer===!0&&h===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&h===!0&&Ne("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),y=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),w=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:y,maxVertexUniforms:b,maxVaryings:_,maxFragmentUniforms:x,maxSamples:S,samples:w}}function rw(n){let e=this,t=null,i=0,r=!1,s=!1,o=new Wn,a=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let d=h.length!==0||f||i!==0||r;return r=f,i=h.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){let p=h.clippingPlanes,g=h.clipIntersection,m=h.clipShadows,y=n.get(h);if(!r||p===null||p.length===0||s&&!m)s?u(null):c();else{let b=s?0:i,_=b*4,x=y.clippingState||null;l.value=x,x=u(p,f,_,d);for(let S=0;S!==_;++S)x[S]=t[S];y.clippingState=x,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,p){let g=h!==null?h.length:0,m=null;if(g!==0){if(m=l.value,p!==!0||m===null){let y=d+g*4,b=f.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<y)&&(m=new Float32Array(y));for(let _=0,x=d;_!==g;++_,x+=4)o.copy(h[_]).applyMatrix4(b,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}var Da=class extends Pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new ga(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new no(5,5,5),s=new Rt({name:"CubemapFromEquirect",uniforms:ps(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ln,blending:Yi});s.uniforms.tEquirect.value=t;let o=new bt(r,s),a=t.minFilter;return t.minFilter===Ji&&(t.minFilter=un),new io(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}},my=256,sw=3,ow=20,Uy=256,By=16,aw=3,lw=new O,cw=new Fe,Uu=class n{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new io(1,10,null),this._boxMesh=new bt(new no(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){let{size:o=256,position:a=lw}=s,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),u=this._getSourceTarget(!0);t>0&&(u.texture.mipmapsAutoUpdate=!1);let h=l.autoClear,f=l.autoClearColor,d=l.autoClearDepth,p=l.autoClearStencil,g=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,g===null&&(e.background=l.getClearColor(cw));let m=new io(i,r,u);return m.position.copy(a),m.update(l,e),l.autoClear=h,l.autoClearColor=f,l.autoClearDepth=d,l.autoClearStencil=p,e.background=g,t>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=by(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(my,_f(e))}_fromTexture(e,t){e.mapping===ds||e.mapping===ao?this._setSize(e.image.length===0?my:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){let e=this._cubeSize,t=gy(e,!1,!1),i=Math.log2(e)-sw;for(let r=0;r<=i;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=gy(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){let r=this._boxMesh,s=this._cubeCamera;r.material=i,s.renderTarget=e,s.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),s.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===ds||e.mapping===ao?(this._cubemapMaterial===null&&(this._cubemapMaterial=by()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=yy()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=uw(),this._integrationMaterial=hw());let t=this._cubeSize,i=e.texture.mipmaps.length-1,r=this._ggxMaterial.uniforms;r.envMap.value=this._sourceTarget.texture;let s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/By);for(let o=0;o<=i;o++){let a=n.lodToRoughness(o,i);if(o>i-aw)s.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let l=a>0?Math.log2(t)+.5*Math.log2(6/(Uy*Math.pow(a,4)))+.5:0;r.roughness.value=a,r.lodBias.value=l,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=dw());let i=this._blurMaterial,r=i.uniforms,s=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=s.texture,this._renderCube(e,0,i),r.envMap.value=e.texture,this._renderCube(s,0,i)}};function gy(n,e,t){return new Da(n,{minFilter:Ji,generateMipmaps:e,type:mi,colorSpace:ss,depthBuffer:t})}function Na(n,e,t){return new Rt({name:n,uniforms:e,vertexShader:Ye.cube_vert,fragmentShader:t,side:Ln,blending:Yi,depthTest:!1,depthWrite:!1})}function uw(){return Na("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Uy}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function hw(){return Na("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:By}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function dw(){return Na("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${ow}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function yy(){return Na("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function by(){return Na("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function fw(n){let e=new WeakMap,t=new WeakMap,i=null;function r(f,d=!1){return f==null?null:d?o(f):s(f)}function s(f){if(f&&f.isTexture){let d=f.mapping;if(d===Jc||d===Zc)if(e.has(f)){let p=e.get(f).texture;return a(p,f.mapping)}else{let p=f.image;if(p&&p.height>0){let g=new Da(p.height);return g.fromEquirectangularTexture(n,f),e.set(f,g),f.addEventListener("dispose",c),a(g.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){let d=f.mapping,p=d===Jc||d===Zc,g=d===ds||d===ao;if(p||g){let m=t.get(f),y=m!==void 0?m.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==y)return i===null&&(i=new Uu(n)),m=p?i.fromEquirectangular(f,m):i.fromCubemap(f,m),m.texture.pmremVersion=f.pmremVersion,t.set(f,m),m.texture;if(m!==void 0)return m.texture;{let b=f.image;return p&&b&&b.height>0||g&&b&&l(b)?(i===null&&(i=new Uu(n)),m=p?i.fromEquirectangular(f):i.fromCubemap(f),m.texture.pmremVersion=f.pmremVersion,t.set(f,m),f.addEventListener("dispose",u),m.texture):null}}}return f}function a(f,d){return d===Jc?f.mapping=ds:d===Zc&&(f.mapping=ao),f}function l(f){let d=0,p=6;for(let g=0;g<p;g++)f[g]!==void 0&&d++;return d===p}function c(f){let d=f.target;d.removeEventListener("dispose",c);let p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(f){let d=f.target;d.removeEventListener("dispose",u);let p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function pw(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let r=t(i);return r===null&&ra("WebGLRenderer: "+i+" extension not supported."),r}}}function mw(n,e,t,i){let r={},s=new WeakMap,o=new FinalizationRegistry(p=>delete r[p]);function a(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(let m in p.attributes)e.remove(p.attributes[m]);p.removeEventListener("dispose",a),delete r[p.id],o.unregister(p);let g=s.get(p);g&&(e.remove(g),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,g){return r[g.id]!==void 0||(g.addEventListener("dispose",a),r[g.id]=new WeakRef(g),o.register(g,g.id,g),t.memory.geometries++),g}function u(p){let g=p.attributes;for(let m in g)e.update(g[m],n.ARRAY_BUFFER)}function h(p){let g=p.index,m=p.attributes.position,y=0;if(m===void 0)return;let b=g!==null?g.array.length:m.array.length/3-1,_=m.count>=65535?ma:pa,x=new _(Math.ceil(b/3)*6,1),S=x.array;if(g!==null){let v=g.array;y=g.version;for(let T=0,P=0;T<b;T+=3){let C=v[T+0],I=v[T+1],U=v[T+2];S[P++]=C,S[P++]=I,S[P++]=I,S[P++]=U,S[P++]=U,S[P++]=C}}else{y=m.version;for(let v=0,T=0;v<b;v+=3){let P=v+0,C=v+1,I=v+2;S[T++]=P,S[T++]=C,S[T++]=C,S[T++]=I,S[T++]=I,S[T++]=P}}x.version=y;let w=s.get(p);w&&e.remove(w),s.set(p,x)}function f(p){let g=s.get(p);if(g){let m=p.index;m!==null&&g.version<m.version&&h(p)}else h(p);return s.get(p)}function d(){for(let p in r){let g=r[p].deref();g!==void 0&&l(g)}}return{get:c,update:u,getWireframeAttribute:f,dispose:d}}function gw(n,e,t){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,f){n.drawElements(i,f,s,h*o),t.update(f,i,1)}function c(h,f,d){d!==0&&(n.drawElementsInstanced(i,f,s,h*o,d),t.update(f,i,d))}function u(h,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,d);let g=0;for(let m=0;m<d;m++)g+=f[m];t.update(g,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function yw(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:ze("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function bw(n,e,t){let i=new WeakMap,r=new ct;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,f=i.get(a);if(f===void 0||f.count!==h){let P=function(){v.dispose(),i.delete(a),a.removeEventListener("dispose",P)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],_=0;d===!0&&(_=1),p===!0&&(_=2),g===!0&&(_=3);let x=a.attributes.position.count*_,S=1;x>e.maxTextureSize&&(S=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let w=new Float32Array(x*S*4*h),v=new da(w,x,S,h);v.type=Yn,v.needsUpdate=!0;let T=_*4;for(let C=0;C<h;C++){let I=m[C],U=y[C],j=b[C],L=x*S*4*C;for(let z=0;z<I.count;z++){let B=z*T;d===!0&&(r.fromBufferAttribute(I,z),w[L+B+0]=r.x,w[L+B+1]=r.y,w[L+B+2]=r.z,w[L+B+3]=0),p===!0&&(r.fromBufferAttribute(U,z),w[L+B+4]=r.x,w[L+B+5]=r.y,w[L+B+6]=r.z,w[L+B+7]=0),g===!0&&(r.fromBufferAttribute(j,z),w[L+B+8]=r.x,w[L+B+9]=r.y,w[L+B+10]=r.z,w[L+B+11]=j.itemSize===4?r.w:1)}}f={count:h,texture:v,size:new Me(x,S)},i.set(a,f),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let g=0;g<c.length;g++)d+=c[g];let p=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function xw(n,e,t,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,h=c.geometry,f=e.get(c,h);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==u&&(d.update(),s.set(d,u))}return f}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var vw={[Zd]:"LINEAR_TONE_MAPPING",[Kd]:"REINHARD_TONE_MAPPING",[Qd]:"CINEON_TONE_MAPPING",[ef]:"ACES_FILMIC_TONE_MAPPING",[nf]:"AGX_TONE_MAPPING",[rf]:"NEUTRAL_TONE_MAPPING",[tf]:"CUSTOM_TONE_MAPPING"};function _w(n,e,t,i,r,s){let o=new Pn(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,u=new ft;u.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new Kt([0,2,0,0,2,0],2));let h=new Oc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new bt(u,h),d=new On(-1,1,1,-1,0,1),p=null,g=null,m=!1,y,b=null,_=[],x=!1;this.setSize=function(S,w){o.setSize(S,w),a!==null&&a.setSize(S,w),l!==null&&l.setSize(S,w);for(let v=0;v<_.length;v++){let T=_[v];T.setSize&&T.setSize(S,w)}},this.setEffects=function(S){_=S,x=_.length>0&&_[0].isRenderPass===!0;let w=o.width,v=o.height;_.length>0&&a===null&&(a=new Pn(w,v,{type:mi,depthBuffer:!1,stencilBuffer:!1}),l=new Pn(w,v,{type:mi,depthBuffer:!1,stencilBuffer:!1}));let T=r===!0&&_.some(P=>P.needsDepthTexture===!0);T!==(o.depthTexture!==null)&&(T===!0&&c===null&&(c=new Xi(w,v),s===!0&&(c.format=Zi,c.type=fs)),o.dispose(),o.depthTexture=T?c:null,o.resolveDepthBuffer=T,o.storeMultisampledDepthBuffer=T);for(let P=0;P<_.length;P++){let C=_[P];C.setSize&&C.setSize(w,v),T&&C.needsDepthTexture===!0&&C.setDepthTexture&&C.setDepthTexture(c)}},this.begin=function(S,w){if(m||S.toneMapping===Ri&&_.length===0)return!1;if(b=w,w!==null){let v=w.width,T=w.height;(o.width!==v||o.height!==T)&&this.setSize(v,T)}return x===!1&&S.setRenderTarget(o),y=S.toneMapping,S.toneMapping=Ri,!0},this.hasRenderPass=function(){return x},this.end=function(S,w){S.toneMapping=y,m=!0;let v=o,T=a;for(let P=0;P<_.length;P++){let C=_[P];C.enabled!==!1&&(C.render(S,T,v,w),C.needsSwap!==!1&&(v=T,T=T===a?l:a))}if(p!==S.outputColorSpace||g!==S.toneMapping){p=S.outputColorSpace,g=S.toneMapping,h.defines={},Ze.getTransfer(p)===yt&&(h.defines.SRGB_TRANSFER="");let P=vw[g];P&&(h.defines[P]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=v.texture,S.setRenderTarget(b),S.render(f,d),b=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),u.dispose(),h.dispose()}}var zy=new xn,Hy=new Xi(1,1),Vy=new ya(1),Gy=new da,$y=new Lc,Wy=new ga,xy=[],vy=[],_y=new Float32Array(16),Sy=new Float32Array(9),My=new Float32Array(4);function uo(n,e,t){let i=n[0];if(i<=0||i>0)return n;let r=e*t,s=xy[r];if(s===void 0&&(s=new Float32Array(r),xy[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Qt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function en(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zu(n,e){let t=vy[e];t===void 0&&(t=new Int32Array(e),vy[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Sw(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Mw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;n.uniform2fv(this.addr,e),en(t,e)}}function ww(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Qt(t,e))return;n.uniform3fv(this.addr,e),en(t,e)}}function Ew(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;n.uniform4fv(this.addr,e),en(t,e)}}function Tw(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Qt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,i))return;My.set(i),n.uniformMatrix2fv(this.addr,!1,My),en(t,i)}}function Aw(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Qt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,i))return;Sy.set(i),n.uniformMatrix3fv(this.addr,!1,Sy),en(t,i)}}function Cw(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Qt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,i))return;_y.set(i),n.uniformMatrix4fv(this.addr,!1,_y),en(t,i)}}function Rw(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Pw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;n.uniform2iv(this.addr,e),en(t,e)}}function Lw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qt(t,e))return;n.uniform3iv(this.addr,e),en(t,e)}}function Iw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;n.uniform4iv(this.addr,e),en(t,e)}}function kw(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Dw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;n.uniform2uiv(this.addr,e),en(t,e)}}function Nw(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qt(t,e))return;n.uniform3uiv(this.addr,e),en(t,e)}}function Ow(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;n.uniform4uiv(this.addr,e),en(t,e)}}function Hu(n){return n.version===0&&(n.compareFunction=bf,n.needsUpdate=!0),n}function Fw(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?s=Hu(Hy):s=zy,t.setTexture2D(e||s,r)}function Uw(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||$y,r)}function Bw(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_CUBE_SHADOW?s=Hu(Vy):s=Wy,t.setTextureCube(e||s,r)}function zw(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Gy,r)}function Hw(n){switch(n){case 5126:return Sw;case 35664:return Mw;case 35665:return ww;case 35666:return Ew;case 35674:return Tw;case 35675:return Aw;case 35676:return Cw;case 5124:case 35670:return Rw;case 35667:case 35671:return Pw;case 35668:case 35672:return Lw;case 35669:case 35673:return Iw;case 5125:return kw;case 36294:return Dw;case 36295:return Nw;case 36296:return Ow;case 35678:case 36198:case 36298:case 36306:case 35682:return Fw;case 35679:case 36299:case 36307:return Uw;case 35680:case 36300:case 36308:case 36293:return Bw;case 36289:case 36303:case 36311:case 36292:return zw}}function Vw(n,e){n.uniform1fv(this.addr,e)}function Gw(n,e){let t=uo(e,this.size,2);n.uniform2fv(this.addr,t)}function $w(n,e){let t=uo(e,this.size,3);n.uniform3fv(this.addr,t)}function Ww(n,e){let t=uo(e,this.size,4);n.uniform4fv(this.addr,t)}function jw(n,e){let t=uo(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Xw(n,e){let t=uo(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function qw(n,e){let t=uo(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Yw(n,e){n.uniform1iv(this.addr,e)}function Jw(n,e){n.uniform2iv(this.addr,e)}function Zw(n,e){n.uniform3iv(this.addr,e)}function Kw(n,e){n.uniform4iv(this.addr,e)}function Qw(n,e){n.uniform1uiv(this.addr,e)}function eE(n,e){n.uniform2uiv(this.addr,e)}function tE(n,e){n.uniform3uiv(this.addr,e)}function nE(n,e){n.uniform4uiv(this.addr,e)}function iE(n,e,t){let i=this.cache,r=e.length,s=zu(t,r);Qt(i,s)||(n.uniform1iv(this.addr,s),en(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=Hu(Hy):o=zy;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function rE(n,e,t){let i=this.cache,r=e.length,s=zu(t,r);Qt(i,s)||(n.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||$y,s[o])}function sE(n,e,t){let i=this.cache,r=e.length,s=zu(t,r);Qt(i,s)||(n.uniform1iv(this.addr,s),en(i,s));let o;this.type===n.SAMPLER_CUBE_SHADOW?o=Hu(Vy):o=Wy;for(let a=0;a!==r;++a)t.setTextureCube(e[a]||o,s[a])}function oE(n,e,t){let i=this.cache,r=e.length,s=zu(t,r);Qt(i,s)||(n.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Gy,s[o])}function aE(n){switch(n){case 5126:return Vw;case 35664:return Gw;case 35665:return $w;case 35666:return Ww;case 35674:return jw;case 35675:return Xw;case 35676:return qw;case 5124:case 35670:return Yw;case 35667:case 35671:return Jw;case 35668:case 35672:return Zw;case 35669:case 35673:return Kw;case 5125:return Qw;case 36294:return eE;case 36295:return tE;case 36296:return nE;case 35678:case 36198:case 36298:case 36306:case 35682:return iE;case 35679:case 36299:case 36307:return rE;case 35680:case 36300:case 36308:case 36293:return sE;case 36289:case 36303:case 36311:case 36292:return oE}}var Lf=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Hw(t.type)}},If=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=aE(t.type)}},kf=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],i)}}},Rf=/(\w+)(\])?(\[|\.)?/g;function wy(n,e){n.seq.push(e),n.map[e.id]=e}function lE(n,e,t){let i=n.name,r=i.length;for(Rf.lastIndex=0;;){let s=Rf.exec(i),o=Rf.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){wy(t,c===void 0?new Lf(a,n,e):new If(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new kf(a),wy(t,h)),t=h}}}var co=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);lE(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){let s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&i.push(o)}return i}};function Ey(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var cE=37297,uE=0;function hE(n,e){let t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Ty=new He;function dE(n){Ze._getMatrix(Ty,Ze.workingColorSpace,n);let e=`mat3( ${Ty.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case la:return[e,"LinearTransferOETF"];case yt:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ay(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+hE(n.getShaderSource(e),a)}else return s}function fE(n,e){let t=dE(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var pE={[Zd]:"Linear",[Kd]:"Reinhard",[Qd]:"Cineon",[ef]:"ACESFilmic",[nf]:"AgX",[rf]:"Neutral",[tf]:"Custom"};function mE(n,e){let t=pE[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fu=new O;function gE(){Ze.getLuminanceCoefficients(Fu);let n=Fu.x.toFixed(4),e=Fu.y.toFixed(4),t=Fu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yE(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ka).join(`
`)}function bE(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function xE(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=n.getActiveAttrib(e,r),o=s.name,a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function ka(n){return n!==""}function Cy(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Ry(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var vE=/^[ \t]*#include +<([\w\d./]+)>/gm;function Df(n){return n.replace(vE,_E)}function _E(n,e){let t=Ye[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Df(t)}var SE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Py(n){return n.replace(SE,ME)}function ME(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ly(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var wE={[Ma]:"SHADOWMAP_TYPE_PCF",[so]:"SHADOWMAP_TYPE_VSM"};function EE(n){return wE[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var TE={[ao]:"ENVMAP_MODE_REFRACTION"};function AE(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":TE[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var CE={[Jd]:"ENVMAP_BLENDING_MULTIPLY",[Jg]:"ENVMAP_BLENDING_MIX",[Zg]:"ENVMAP_BLENDING_ADD"};function RE(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":CE[n.combine]||"ENVMAP_BLENDING_NONE"}function PE(n,e,t,i){let r=n.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=EE(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=AE(t),h=RE(t),f=yE(t),d=bE(s),p=r.createProgram(),g,m,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(ka).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(ka).join(`
`),m.length>0&&(m+=`
`)):(g=[Ly(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ka).join(`
`),m=[Ly(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ri?"#define TONE_MAPPING":"",t.toneMapping!==Ri?Ye.tonemapping_pars_fragment:"",t.toneMapping!==Ri?mE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,fE("linearToOutputTexel",t.outputColorSpace),gE(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ka).join(`
`)),o=Df(o),o=Cy(o,t),o=Ry(o,t),a=Df(a),a=Cy(a,t),a=Ry(a,t),o=Py(o),a=Py(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===La?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===La?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let b=y+g+o,_=y+m+a,x=Ey(r,r.VERTEX_SHADER,b),S=Ey(r,r.FRAGMENT_SHADER,_);r.attachShader(p,x),r.attachShader(p,S),t.index0AttributeName!==void 0?r.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(p,0,"position"),r.linkProgram(p);function w(C){if(n.debug.checkShaderErrors){let I=r.getProgramInfoLog(p)||"",U=r.getShaderInfoLog(x)||"",j=r.getShaderInfoLog(S)||"",L=I.trim(),z=U.trim(),B=j.trim(),H=!0,K=!0;if(r.getProgramParameter(p,r.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,p,x,S);else{let $=Ay(r,x,"vertex"),Y=Ay(r,S,"fragment");ze("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(p,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+L+`
`+$+`
`+Y)}else L!==""?Ne("WebGLProgram: Program Info Log:",L):(z===""||B==="")&&(K=!1);K&&(C.diagnostics={runnable:H,programLog:L,vertexShader:{log:z,prefix:g},fragmentShader:{log:B,prefix:m}})}r.deleteShader(x),r.deleteShader(S),v=new co(r,p),T=xE(r,p)}let v;this.getUniforms=function(){return v===void 0&&w(this),v};let T;this.getAttributes=function(){return T===void 0&&w(this),T};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=r.getProgramParameter(p,cE)),P},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=uE++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=x,this.fragmentShader=S,this}var LE=0,Nf=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Of(e),t.set(e,i)),i}},Of=class{constructor(e){this.id=LE++,this.code=e,this.usedTimes=0}};function IE(n){return n===Tr||n===Ra||n===Pa}function kE(n,e,t,i,r,s){let o=new fa,a=new Nf,l=new Set,c=[],u=new Map,h=i.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(v){return l.add(v),v===0?"uv":`uv${v}`}function p(v,T,P,C,I,U){let j=C.fog,L=I.geometry,z=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?C.environment:null,B=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,H=e.get(v.envMap||z,B),K=f[v.type],$=i.precision;v.precision!==null&&($=i.getMaxPrecision(v.precision),$!==v.precision&&Ne("WebGLProgram.getParameters:",v.precision,"not supported, using",$,"instead."));let Y=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,q=Y!==void 0?Y.length:0,ae=0;L.morphAttributes.position!==void 0&&(ae=1),L.morphAttributes.normal!==void 0&&(ae=2),L.morphAttributes.color!==void 0&&(ae=3);let Re,J,oe,_e;if(K){let be=Li[K];Re=be.vertexShader,J=be.fragmentShader}else{Re=v.vertexShader,J=v.fragmentShader;let be=a.getVertexShaderStage(v),xt=a.getFragmentShaderStage(v);a.update(v,be,xt),oe=be.id,_e=xt.id}let Le=n.getRenderTarget(),ye=n.state.buffers.depth.getReversed(),Ue=I.isInstancedMesh===!0,_t=I.isBatchedMesh===!0,Ae=!!v.map,rt=!!v.matcap,at=!!H,Je=at&&H.isPMREMTexture===!0,dn=!!v.aoMap,Xt=!!v.lightMap,Nn=!!v.bumpMap&&v.wireframe===!1,Dt=!!v.normalMap,vi=!!v.displacementMap,rn=!!v.emissiveMap,Jn=!!v.metalnessMap,Zn=!!v.roughnessMap,Kn=v.anisotropy>0,F=v.clearcoat>0,Qn=v.diffuseRoughness>0,Lt=v.dispersion>0,It=v.retroreflectivity>0,ge=v.iridescence>0,qt=v.sheen>0,Oe=v.transmission>0,Ve=Kn&&!!v.anisotropyMap,R=F&&!!v.clearcoatMap,E=F&&!!v.clearcoatNormalMap,G=F&&!!v.clearcoatRoughnessMap,re=Qn&&!!v.diffuseRoughnessMap,ne=ge&&!!v.iridescenceMap,ce=ge&&!!v.iridescenceThicknessMap,pe=qt&&!!v.sheenColorMap,Q=qt&&!!v.sheenRoughnessMap,ee=!!v.specularMap,he=!!v.specularColorMap,k=!!v.specularIntensityMap,te=Oe&&!!v.transmissionMap,Z=Oe&&!!v.thicknessMap,de=!!v.gradientMap,le=!!v.alphaMap,ue=v.alphaTest>0,Pe=!!v.alphaHash,Xe=!!v.extensions,se=Ri;v.toneMapped&&(Le===null||Le.isXRRenderTarget===!0)&&(se=n.toneMapping);let ke=Je?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,We={shaderID:K,shaderType:v.type,shaderName:v.name,vertexShader:Re,fragmentShader:J,defines:v.defines,customVertexShaderID:oe,customFragmentShaderID:_e,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:$,batching:_t,batchingColor:_t&&I._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&I.instanceColor!==null,instancingMorph:Ue&&I.morphTexture!==null,outputColorSpace:Le===null?n.outputColorSpace:Le.isXRRenderTarget===!0?Le.texture.colorSpace:Ze.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ae,matcap:rt,envMap:at,envMapMode:at&&H.mapping,envMapPMREM:Je,envMapMaxLod:Je?ke.length-1:null,envMapSize:Je?ke[0].width:null,aoMap:dn,lightMap:Xt,bumpMap:Nn,normalMap:Dt,displacementMap:vi,emissiveMap:rn,normalMapObjectSpace:Dt&&v.normalMapType===ey,normalMapTangentSpace:Dt&&v.normalMapType===ff,packedNormalMap:Dt&&v.normalMapType===ff&&IE(v.normalMap.format),metalnessMap:Jn,roughnessMap:Zn,anisotropy:Kn,anisotropyMap:Ve,clearcoat:F,clearcoatMap:R,clearcoatNormalMap:E,clearcoatRoughnessMap:G,diffuseRoughness:Qn,diffuseRoughnessMap:re,dispersion:Lt,retroreflection:It,iridescence:ge,iridescenceMap:ne,iridescenceThicknessMap:ce,sheen:qt,sheenColorMap:pe,sheenRoughnessMap:Q,specularMap:ee,specularColorMap:he,specularIntensityMap:k,transmission:Oe,transmissionMap:te,thicknessMap:Z,gradientMap:de,opaque:v.transparent===!1&&v.blending===oo&&v.alphaToCoverage===!1,alphaMap:le,alphaTest:ue,alphaHash:Pe,combine:v.combine,mapUv:Ae&&d(v.map.channel),aoMapUv:dn&&d(v.aoMap.channel),lightMapUv:Xt&&d(v.lightMap.channel),bumpMapUv:Nn&&d(v.bumpMap.channel),normalMapUv:Dt&&d(v.normalMap.channel),displacementMapUv:vi&&d(v.displacementMap.channel),emissiveMapUv:rn&&d(v.emissiveMap.channel),metalnessMapUv:Jn&&d(v.metalnessMap.channel),roughnessMapUv:Zn&&d(v.roughnessMap.channel),anisotropyMapUv:Ve&&d(v.anisotropyMap.channel),clearcoatMapUv:R&&d(v.clearcoatMap.channel),clearcoatNormalMapUv:E&&d(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:G&&d(v.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:re&&d(v.diffuseRoughnessMap.channel),iridescenceMapUv:ne&&d(v.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&d(v.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&d(v.sheenColorMap.channel),sheenRoughnessMapUv:Q&&d(v.sheenRoughnessMap.channel),specularMapUv:ee&&d(v.specularMap.channel),specularColorMapUv:he&&d(v.specularColorMap.channel),specularIntensityMapUv:k&&d(v.specularIntensityMap.channel),transmissionMapUv:te&&d(v.transmissionMap.channel),thicknessMapUv:Z&&d(v.thicknessMap.channel),alphaMapUv:le&&d(v.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Dt||Kn),vertexNormals:!!L.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!L.attributes.uv&&(Ae||le),fog:!!j,useFog:v.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||L.attributes.normal===void 0&&Dt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:ye,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:ae,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:U.filter(be=>be.texture!==null).length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,decodeVideoTexture:Ae&&v.map.isVideoTexture===!0&&Ze.getTransfer(v.map.colorSpace)===yt,decodeVideoTextureEmissive:rn&&v.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(v.emissiveMap.colorSpace)===yt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Pt,flipSided:v.side===Ln,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Xe&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&v.extensions.multiDraw===!0||_t)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return We.vertexUv1s=l.has(1),We.vertexUv2s=l.has(2),We.vertexUv3s=l.has(3),l.clear(),We}function g(v){let T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(let P in v.defines)T.push(P),T.push(v.defines[P]);return v.isRawShaderMaterial===!1&&(m(T,v),y(T,v),T.push(n.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function m(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapPMREM),v.push(T.envMapMaxLod),v.push(T.envMapSize),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.diffuseRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.numSunLights),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numSunLightShadows),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.numLightProbeGrids),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function y(v,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.diffuseRoughness&&o.enable(25),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function b(v){let T=f[v.type],P;if(T){let C=Li[T];P=dy.clone(C.uniforms)}else P=v.uniforms;return P}function _(v,T){let P=u.get(T);return P!==void 0?++P.usedTimes:(P=new PE(n,T,v,r),c.push(P),u.set(T,P)),P}function x(v){if(--v.usedTimes===0){let T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function S(v){a.remove(v)}function w(){a.dispose()}return{getParameters:p,getProgramCacheKey:g,getUniforms:b,acquireProgram:_,releaseProgram:x,releaseShaderCache:S,programs:c,dispose:w}}function DE(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function NE(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Iy(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ky(){let n=[],e=0,t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,p,g,m,y){let b=n[e];return b===void 0?(b={id:f.id,object:f,geometry:d,material:p,materialVariant:o(f),groupOrder:g,renderOrder:f.renderOrder,z:m,group:y},n[e]=b):(b.id=f.id,b.object=f,b.geometry=d,b.material=p,b.materialVariant=o(f),b.groupOrder=g,b.renderOrder=f.renderOrder,b.z=m,b.group=y),e++,b}function l(f,d,p,g,m,y,b){b.reversedDepth===!0&&(m=-m);let _=a(f,d,p,g,m,y);p.transmission>0?i.push(_):p.transparent===!0?r.push(_):t.push(_)}function c(f,d,p,g,m,y){let b=a(f,d,p,g,m,y);p.transmission>0?i.unshift(b):p.transparent===!0?r.unshift(b):t.unshift(b)}function u(f,d){t.length>1&&t.sort(f||NE),i.length>1&&i.sort(d||Iy),r.length>1&&r.sort(d||Iy)}function h(){for(let f=e,d=n.length;f<d;f++){let p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:h,sort:u}}function OE(){let n=new WeakMap;function e(i,r){let s=n.get(i),o;return s===void 0?(o=new ky,n.set(i,[o])):r>=s.length?(o=new ky,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function FE(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new O,color:new Fe};break;case"SpotLight":t={position:new O,direction:new O,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new O,halfWidth:new O,halfHeight:new O};break}return n[e.id]=t,t}}}function UE(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var BE=0;function zE(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function HE(n){let e=new FE,t=UE(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);let r=new O,s=new Mt,o=new Mt;function a(c){let u=0,h=0,f=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,p=0,g=0,m=0,y=0,b=0,_=0,x=0,S=0,w=0,v=0,T=0,P=0,C=0;c.sort(zE);for(let U=0,j=c.length;U<j;U++){let L=c[U],z=L.color,B=L.intensity,H=L.distance,K=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Tr?K=L.shadow.map.texture:K=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=z.r*B,h+=z.g*B,f+=z.b*B;else if(L.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(L.sh.coefficients[$],B);C++}else if(L.isSunLight){let $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Y=L.shadow,q=t.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),i.sunShadow[p]=q,i.sunShadowMap[p]=K;let ae=Y.getViewportCount();for(let Re=0;Re<ae;Re++)i.sunShadowMatrix[g+Re]=Y.getMatrix(Re),i.sunShadowCascade[g+Re]=Y._cascadeData[Re];g+=ae,p++}i.sun[d]=$,d++}else if(L.isDirectionalLight){let $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Y=L.shadow,q=t.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,i.directionalShadow[m]=q,i.directionalShadowMap[m]=K,i.directionalShadowMatrix[m]=L.shadow.matrix,S++}i.directional[m]=$,m++}else if(L.isSpotLight){let $=e.get(L);$.position.setFromMatrixPosition(L.matrixWorld),$.color.copy(z).multiplyScalar(B),$.distance=H,$.coneCos=Math.cos(L.angle),$.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),$.decay=L.decay,i.spot[b]=$;let Y=L.shadow;if(L.map&&(i.spotLightMap[T]=L.map,T++,Y.updateMatrices(L),L.castShadow&&P++),i.spotLightMatrix[b]=Y.matrix,L.castShadow){let q=t.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,i.spotShadow[b]=q,i.spotShadowMap[b]=K,v++}b++}else if(L.isRectAreaLight){let $=e.get(L);$.color.copy(z).multiplyScalar(B),$.halfWidth.set(L.width*.5,0,0),$.halfHeight.set(0,L.height*.5,0),i.rectArea[_]=$,_++}else if(L.isPointLight){let $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),$.distance=L.distance,$.decay=L.decay,L.castShadow){let Y=L.shadow,q=t.get(L);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,q.shadowCameraNear=Y.camera.near,q.shadowCameraFar=Y.camera.far,i.pointShadow[y]=q,i.pointShadowMap[y]=K,i.pointShadowMatrix[y]=L.shadow.matrix,w++}i.point[y]=$,y++}else if(L.isHemisphereLight){let $=e.get(L);$.skyColor.copy(L.color).multiplyScalar(B),$.groundColor.copy(L.groundColor).multiplyScalar(B),i.hemi[x]=$,x++}}_>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xe.LTC_FLOAT_1,i.rectAreaLTC2=xe.LTC_FLOAT_2):(i.rectAreaLTC1=xe.LTC_HALF_1,i.rectAreaLTC2=xe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;let I=i.hash;(I.sunLength!==d||I.directionalLength!==m||I.pointLength!==y||I.spotLength!==b||I.rectAreaLength!==_||I.hemiLength!==x||I.numSunShadows!==p||I.numDirectionalShadows!==S||I.numPointShadows!==w||I.numSpotShadows!==v||I.numSpotMaps!==T||I.numLightProbes!==C)&&(i.sun.length=d,i.directional.length=m,i.spot.length=b,i.rectArea.length=_,i.point.length=y,i.hemi.length=x,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=g,i.sunShadowCascade.length=g,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.spotLightMatrix.length=v+T-P,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=C,I.sunLength=d,I.directionalLength=m,I.pointLength=y,I.spotLength=b,I.rectAreaLength=_,I.hemiLength=x,I.numSunShadows=p,I.numDirectionalShadows=S,I.numPointShadows=w,I.numSpotShadows=v,I.numSpotMaps=T,I.numLightProbes=C,i.version=BE++)}function l(c,u){let h=0,f=0,d=0,p=0,g=0,m=0,y=u.matrixWorldInverse;for(let b=0,_=c.length;b<_;b++){let x=c[b];if(x.isSunLight){let S=i.sun[h];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(y),h++}else if(x.isDirectionalLight){let S=i.directional[f];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(y),f++}else if(x.isSpotLight){let S=i.spot[p];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(y),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(y),p++}else if(x.isRectAreaLight){let S=i.rectArea[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(y),o.identity(),s.copy(x.matrixWorld),s.premultiply(y),o.extractRotation(s),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){let S=i.point[d];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(y),d++}else if(x.isHemisphereLight){let S=i.hemi[m];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(y),m++}}}return{setup:a,setupView:l,state:i}}function Dy(n){let e=new HE(n),t=[],i=[],r=[];function s(h){u.camera=h,t.length=0,i.length=0,r.length=0}function o(h){h.isLightProbeGrid?r.push(h):t.push(h)}function a(h){i.push(h)}function l(){e.setup(t),r.sort((h,f)=>h.priority-f.priority||h.id-f.id)}function c(h){e.setupView(t,h)}let u={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function VE(n){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Dy(n),e.set(r,[a])):s>=o.length?(a=new Dy(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var GE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$E=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,WE=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],jE=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)],Ny=new Mt,Ia=new O,Pf=new O;function XE(n,e,t){let i=new ls,r=new Me,s=new Me,o=new ct,a=new Fc,l=new Uc,c={},u=t.maxTextureSize,h={[Er]:Ln,[Ln]:Er,[Pt]:Pt},f=new Rt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:GE,fragmentShader:$E}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let p=new ft;p.setAttribute("position",new Qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new bt(p,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ma;let y=this.type;this.render=function(w,v,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Lg&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ma);let P=n.getRenderTarget(),C=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Yi),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let j=y!==this.type;j&&v.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(z=>z.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,z=w.length;L<z;L++){let B=w[L],H=B.shadow;if(H===void 0){Ne("WebGLShadowMap:",B,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);let K=H.getFrameExtents();r.multiply(K),s.copy(H.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/K.x),r.x=s.x*K.x,H.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/K.y),r.y=s.y*K.y,H.mapSize.y=s.y));let $=n.state.buffers.depth.getReversed();if(H.camera._reversedDepth=$,H.map===null||j===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===so){if(B.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Pn(r.x,r.y,{format:Tr,type:mi,minFilter:un,magFilter:un,generateMipmaps:!1}),H.map.texture.name=B.name+".shadowMap",H.map.depthTexture=new Xi(r.x,r.y,Yn),H.map.depthTexture.name=B.name+".shadowMapDepth",H.map.depthTexture.format=Wi,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=kt,H.map.depthTexture.magFilter=kt}else B.isPointLight?(H.map=new Da(r.x),H.map.depthTexture=new ya(r.x,pi)):(H.map=new Pn(r.x,r.y),H.map.depthTexture=new Xi(r.x,r.y,pi)),H.map.depthTexture.name=B.name+".shadowMap",H.map.depthTexture.format=Wi,this.type===Ma?(H.map.depthTexture.compareFunction=$?yf:gf,H.map.depthTexture.minFilter=un,H.map.depthTexture.magFilter=un):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=kt,H.map.depthTexture.magFilter=kt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==r.x||H.map.height!==r.y)&&H.map.setSize(r.x,r.y);let Y=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();B.isPointLight!==!0&&H.updateMatrices(B,T);let q=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:T.layers;for(let ae=0;ae<Y;ae++){let Re=H.getCamera(ae);if(B.isPointLight){let J=H.camera,oe=H.matrix,_e=B.distance||J.far;_e!==J.far&&(J.far=_e,J.updateProjectionMatrix()),Ia.setFromMatrixPosition(B.matrixWorld),J.position.copy(Ia),Pf.copy(J.position),Pf.add(WE[ae]),J.up.copy(jE[ae]),J.lookAt(Pf),J.updateMatrixWorld(),oe.makeTranslation(-Ia.x,-Ia.y,-Ia.z),Ny.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Ny,J.coordinateSystem,J.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)n.setRenderTarget(H.map,ae),n.clear();else{ae===0&&(n.setRenderTarget(H.map),n.clear());let J=H.getViewport(ae);o.set(s.x*J.x,s.y*J.y,s.x*J.z,s.y*J.w),U.viewport(o)}i=H.getFrustum(ae),x(v,T,Re,B,q,this.type)}H.isPointLightShadow!==!0&&this.type===so&&b(H,T),H.needsUpdate=!1}y=this.type,m.needsUpdate=!1,n.setRenderTarget(P,C,I)};function b(w,v){let T=e.update(g);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null?w.mapPass=new Pn(r.x,r.y,{format:Tr,type:mi}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),f.uniforms.shadow_pass.value=w.map.depthTexture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(v,null,T,f,g,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(v,null,T,d,g,null)}function _(w,v,T,P){let C=null,I=T.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)C=I;else if(C=T.isPointLight===!0?l:a,n.localClippingEnabled&&v.clipShadows===!0&&Array.isArray(v.clippingPlanes)&&v.clippingPlanes.length!==0||v.displacementMap&&v.displacementScale!==0||v.alphaMap&&v.alphaTest>0||v.map&&v.alphaTest>0||v.alphaToCoverage===!0){let U=C.uuid,j=v.uuid,L=c[U];L===void 0&&(L={},c[U]=L);let z=L[j];z===void 0&&(z=C.clone(),L[j]=z,v.addEventListener("dispose",S)),C=z}if(C.visible=v.visible,C.wireframe=v.wireframe,P===so?C.side=v.shadowSide!==null?v.shadowSide:v.side:C.side=v.shadowSide!==null?v.shadowSide:h[v.side],C.alphaMap=v.alphaMap,C.alphaTest=v.alphaToCoverage===!0?.5:v.alphaTest,C.map=v.map,C.clipShadows=v.clipShadows,C.clippingPlanes=v.clippingPlanes,C.clipIntersection=v.clipIntersection,C.displacementMap=v.displacementMap,C.displacementScale=v.displacementScale,C.displacementBias=v.displacementBias,C.wireframeLinewidth=v.wireframeLinewidth,C.linewidth=v.linewidth,T.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let U=n.properties.get(C);U.light=T}return C}function x(w,v,T,P,C,I){if(w.visible===!1)return;if(w.layers.test(C)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&I===so)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,w.matrixWorld);let L=e.update(w),z=w.material;if(Array.isArray(z)){let B=L.groups;for(let H=0,K=B.length;H<K;H++){let $=B[H],Y=z[$.materialIndex];if(Y&&Y.visible){let q=_(w,Y,P,I);w.onBeforeShadow(n,w,v,T,L,q,$),n.renderBufferDirect(T,null,L,q,w,$),w.onAfterShadow(n,w,v,T,L,q,$)}}}else if(z.visible){let B=_(w,z,P,I);w.onBeforeShadow(n,w,v,T,L,B,null),n.renderBufferDirect(T,null,L,B,w,null),w.onAfterShadow(n,w,v,T,L,B,null)}}let j=w.children;for(let L=0,z=j.length;L<z;L++)x(j[L],v,T,P,C,I)}function S(w){w.target.removeEventListener("dispose",S);for(let T in c){let P=c[T],C=w.target.uuid;C in P&&(P[C].dispose(),delete P[C])}}}function qE(n,e){function t(){let k=!1,te=new ct,Z=null,de=new ct(0,0,0,0);return{setMask:function(le){Z!==le&&!k&&(n.colorMask(le,le,le,le),Z=le)},setLocked:function(le){k=le},setClear:function(le,ue,Pe,Xe,se){se===!0&&(le*=Xe,ue*=Xe,Pe*=Xe),te.set(le,ue,Pe,Xe),de.equals(te)===!1&&(n.clearColor(le,ue,Pe,Xe),de.copy(te))},reset:function(){k=!1,Z=null,de.set(-1,0,0,0)}}}function i(){let k=!1,te=!1,Z=null,de=null,le=null;return{setReversed:function(ue){if(te!==ue){let Pe=e.get("EXT_clip_control");ue?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),te=ue;let Xe=le;le=null,this.setClear(Xe)}},getReversed:function(){return te},setTest:function(ue){ue?ye(n.DEPTH_TEST):Ue(n.DEPTH_TEST)},setMask:function(ue){Z!==ue&&!k&&(n.depthMask(ue),Z=ue)},setFunc:function(ue){if(te&&(ue=uy[ue]),de!==ue){switch(ue){case xc:n.depthFunc(n.NEVER);break;case vc:n.depthFunc(n.ALWAYS);break;case _c:n.depthFunc(n.LESS);break;case js:n.depthFunc(n.LEQUAL);break;case Sc:n.depthFunc(n.EQUAL);break;case Mc:n.depthFunc(n.GEQUAL);break;case wc:n.depthFunc(n.GREATER);break;case Ec:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=ue}},setLocked:function(ue){k=ue},setClear:function(ue){le!==ue&&(le=ue,te&&(ue=1-ue),n.clearDepth(ue))},reset:function(){k=!1,Z=null,de=null,le=null,te=!1}}}function r(){let k=!1,te=null,Z=null,de=null,le=null,ue=null,Pe=null,Xe=null,se=null;return{setTest:function(ke){k||(ke?ye(n.STENCIL_TEST):Ue(n.STENCIL_TEST))},setMask:function(ke){te!==ke&&!k&&(n.stencilMask(ke),te=ke)},setFunc:function(ke,We,be){(Z!==ke||de!==We||le!==be)&&(n.stencilFunc(ke,We,be),Z=ke,de=We,le=be)},setOp:function(ke,We,be){(ue!==ke||Pe!==We||Xe!==be)&&(n.stencilOp(ke,We,be),ue=ke,Pe=We,Xe=be)},setLocked:function(ke){k=ke},setClear:function(ke){se!==ke&&(n.clearStencil(ke),se=ke)},reset:function(){k=!1,te=null,Z=null,de=null,le=null,ue=null,Pe=null,Xe=null,se=null}}}let s=new t,o=new i,a=new r,l={},c=new WeakMap,u={},h={},f={},d=new WeakMap,p=[],g=null,m=!1,y=null,b=null,_=null,x=null,S=null,w=null,v=null,T=new Fe(0,0,0),P=0,C=!1,I=null,U=null,j=null,L=null,z=null,B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,K=0,$=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec($)[1]),H=K>=1):$.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),H=K>=2);let Y=null,q={},ae=n.getParameter(n.SCISSOR_BOX),Re=n.getParameter(n.VIEWPORT),J=new ct().fromArray(ae),oe=new ct().fromArray(Re);function _e(k,te,Z,de){let le=new Uint8Array(4),ue=n.createTexture();n.bindTexture(k,ue),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Pe=0;Pe<Z;Pe++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(te,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(te+Pe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return ue}let Le={};Le[n.TEXTURE_2D]=_e(n.TEXTURE_2D,n.TEXTURE_2D,1),Le[n.TEXTURE_CUBE_MAP]=_e(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Le[n.TEXTURE_2D_ARRAY]=_e(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Le[n.TEXTURE_3D]=_e(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ye(n.DEPTH_TEST),o.setFunc(js),Nn(!1),Dt($d),ye(n.CULL_FACE),dn(Yi);function ye(k){u[k]!==!0&&(n.enable(k),u[k]=!0)}function Ue(k){u[k]!==!1&&(n.disable(k),u[k]=!1)}function _t(k,te){return f[k]!==te?(n.bindFramebuffer(k,te),f[k]=te,k===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=te),k===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=te),!0):!1}function Ae(k,te){let Z=p,de=!1;if(k){Z=d.get(te),Z===void 0&&(Z=[],d.set(te,Z));let le=k.textures;if(Z.length!==le.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,Pe=le.length;ue<Pe;ue++)Z[ue]=n.COLOR_ATTACHMENT0+ue;Z.length=le.length,de=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,de=!0);de&&n.drawBuffers(Z)}function rt(k){return g!==k?(n.useProgram(k),g=k,!0):!1}let at={[hs]:n.FUNC_ADD,[kg]:n.FUNC_SUBTRACT,[Dg]:n.FUNC_REVERSE_SUBTRACT};at[Ng]=n.MIN,at[Og]=n.MAX;let Je={[Fg]:n.ZERO,[Ug]:n.ONE,[Bg]:n.SRC_COLOR,[qd]:n.SRC_ALPHA,[Wg]:n.SRC_ALPHA_SATURATE,[Gg]:n.DST_COLOR,[Hg]:n.DST_ALPHA,[zg]:n.ONE_MINUS_SRC_COLOR,[Yd]:n.ONE_MINUS_SRC_ALPHA,[$g]:n.ONE_MINUS_DST_COLOR,[Vg]:n.ONE_MINUS_DST_ALPHA,[jg]:n.CONSTANT_COLOR,[Xg]:n.ONE_MINUS_CONSTANT_COLOR,[qg]:n.CONSTANT_ALPHA,[Yg]:n.ONE_MINUS_CONSTANT_ALPHA};function dn(k,te,Z,de,le,ue,Pe,Xe,se,ke){if(k===Yi){m===!0&&(Ue(n.BLEND),m=!1);return}if(m===!1&&(ye(n.BLEND),m=!0),k!==Ig){if(k!==y||ke!==C){if((b!==hs||S!==hs)&&(n.blendEquation(n.FUNC_ADD),b=hs,S=hs),ke)switch(k){case oo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Wd:n.blendFunc(n.ONE,n.ONE);break;case jd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Xd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:ze("WebGLState: Invalid blending: ",k);break}else switch(k){case oo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Wd:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case jd:ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xd:ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ze("WebGLState: Invalid blending: ",k);break}_=null,x=null,w=null,v=null,T.set(0,0,0),P=0,y=k,C=ke}return}le=le||te,ue=ue||Z,Pe=Pe||de,(te!==b||le!==S)&&(n.blendEquationSeparate(at[te],at[le]),b=te,S=le),(Z!==_||de!==x||ue!==w||Pe!==v)&&(n.blendFuncSeparate(Je[Z],Je[de],Je[ue],Je[Pe]),_=Z,x=de,w=ue,v=Pe),(Xe.equals(T)===!1||se!==P)&&(n.blendColor(Xe.r,Xe.g,Xe.b,se),T.copy(Xe),P=se),y=k,C=!1}function Xt(k,te){k.side===Pt?Ue(n.CULL_FACE):ye(n.CULL_FACE);let Z=k.side===Ln;te&&(Z=!Z),Nn(Z),k.blending===oo&&k.transparent===!1?dn(Yi):dn(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),s.setMask(k.colorWrite);let de=k.stencilWrite;a.setTest(de),de&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),rn(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ye(n.SAMPLE_ALPHA_TO_COVERAGE):Ue(n.SAMPLE_ALPHA_TO_COVERAGE)}function Nn(k){I!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),I=k)}function Dt(k){k!==Rg?(ye(n.CULL_FACE),k!==U&&(k===$d?n.cullFace(n.BACK):k===Pg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ue(n.CULL_FACE),U=k}function vi(k){k!==j&&(H&&n.lineWidth(k),j=k)}function rn(k,te,Z){k?(ye(n.POLYGON_OFFSET_FILL),(L!==te||z!==Z)&&(L=te,z=Z,o.getReversed()&&(te=-te,Z=-Z),n.polygonOffset(te,Z))):Ue(n.POLYGON_OFFSET_FILL)}function Jn(k){k?ye(n.SCISSOR_TEST):Ue(n.SCISSOR_TEST)}function Zn(k){k===void 0&&(k=n.TEXTURE0+B-1),Y!==k&&(n.activeTexture(k),Y=k)}function Kn(k,te,Z){Z===void 0&&(Y===null?Z=n.TEXTURE0+B-1:Z=Y);let de=q[Z];de===void 0&&(de={type:void 0,texture:void 0},q[Z]=de),(de.type!==k||de.texture!==te)&&(Y!==Z&&(n.activeTexture(Z),Y=Z),n.bindTexture(k,te||Le[k]),de.type=k,de.texture=te)}function F(){let k=q[Y];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function Qn(){try{n.compressedTexImage2D(...arguments)}catch(k){ze("WebGLState:",k)}}function Lt(){try{n.compressedTexImage3D(...arguments)}catch(k){ze("WebGLState:",k)}}function It(){try{n.texSubImage2D(...arguments)}catch(k){ze("WebGLState:",k)}}function ge(){try{n.texSubImage3D(...arguments)}catch(k){ze("WebGLState:",k)}}function qt(){try{n.compressedTexSubImage2D(...arguments)}catch(k){ze("WebGLState:",k)}}function Oe(){try{n.compressedTexSubImage3D(...arguments)}catch(k){ze("WebGLState:",k)}}function Ve(){try{n.texStorage2D(...arguments)}catch(k){ze("WebGLState:",k)}}function R(){try{n.texStorage3D(...arguments)}catch(k){ze("WebGLState:",k)}}function E(){try{n.texImage2D(...arguments)}catch(k){ze("WebGLState:",k)}}function G(){try{n.texImage3D(...arguments)}catch(k){ze("WebGLState:",k)}}function re(k){return h[k]!==void 0?h[k]:n.getParameter(k)}function ne(k,te){h[k]!==te&&(n.pixelStorei(k,te),h[k]=te)}function ce(k){J.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),J.copy(k))}function pe(k){oe.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),oe.copy(k))}function Q(k,te){let Z=c.get(te);Z===void 0&&(Z=new WeakMap,c.set(te,Z));let de=Z.get(k);de===void 0&&(de=n.getUniformBlockIndex(te,k.name),n.uniformBlockBinding(te,de,de),Z.set(k,de))}function ee(k,te,Z){let le=c.get(te).get(k);l[le]!==Z&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,Z),l[le]=Z)}function he(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},Y=null,q={},f={},l={},d=new WeakMap,p=[],g=null,m=!1,y=null,b=null,_=null,x=null,S=null,w=null,v=null,T=new Fe(0,0,0),P=0,C=!1,I=null,U=null,j=null,L=null,z=null,J.set(0,0,n.canvas.width,n.canvas.height),oe.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ye,disable:Ue,bindFramebuffer:_t,drawBuffers:Ae,useProgram:rt,setBlending:dn,setMaterial:Xt,setFlipSided:Nn,setCullFace:Dt,setLineWidth:vi,setPolygonOffset:rn,setScissorTest:Jn,activeTexture:Zn,bindTexture:Kn,unbindTexture:F,compressedTexImage2D:Qn,compressedTexImage3D:Lt,texImage2D:E,texImage3D:G,pixelStorei:ne,getParameter:re,updateUBOMapping:Q,uniformBlockBinding:ee,texStorage2D:Ve,texStorage3D:R,texSubImage2D:It,texSubImage3D:ge,compressedTexSubImage2D:qt,compressedTexSubImage3D:Oe,scissor:ce,viewport:pe,reset:he}}function YE(n,e,t,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Me,u=new WeakMap,h=new Set,f,d=new WeakMap,p=new Set,g=new FinalizationRegistry(R=>p.delete(R)),m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,E){return m?new OffscreenCanvas(R,E):ua("canvas")}function b(R,E,G){let re=1,ne=Ve(R);if((ne.width>G||ne.height>G)&&(re=G/Math.max(ne.width,ne.height)),re<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let ce=Math.floor(re*ne.width),pe=Math.floor(re*ne.height);f===void 0&&(f=y(ce,pe));let Q=E?y(ce,pe):f;return Q.width=ce,Q.height=pe,Q.getContext("2d").drawImage(R,0,0,ce,pe),Ne("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ce+"x"+pe+")."),Q}else return"data"in R&&Ne("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function _(R){return R.generateMipmaps}function x(R){n.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function w(R,E,G,re,ne,ce=!1){if(R!==null){if(n[R]!==void 0)return n[R];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let pe;re&&(pe=e.get("EXT_texture_norm16"),pe||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=E;if(E===n.RED&&(G===n.FLOAT&&(Q=n.R32F),G===n.HALF_FLOAT&&(Q=n.R16F),G===n.UNSIGNED_BYTE&&(Q=n.R8),G===n.UNSIGNED_SHORT&&pe&&(Q=pe.R16_EXT),G===n.SHORT&&pe&&(Q=pe.R16_SNORM_EXT)),E===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.R8UI),G===n.UNSIGNED_SHORT&&(Q=n.R16UI),G===n.UNSIGNED_INT&&(Q=n.R32UI),G===n.BYTE&&(Q=n.R8I),G===n.SHORT&&(Q=n.R16I),G===n.INT&&(Q=n.R32I)),E===n.RG&&(G===n.FLOAT&&(Q=n.RG32F),G===n.HALF_FLOAT&&(Q=n.RG16F),G===n.UNSIGNED_BYTE&&(Q=n.RG8),G===n.UNSIGNED_SHORT&&pe&&(Q=pe.RG16_EXT),G===n.SHORT&&pe&&(Q=pe.RG16_SNORM_EXT)),E===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RG8UI),G===n.UNSIGNED_SHORT&&(Q=n.RG16UI),G===n.UNSIGNED_INT&&(Q=n.RG32UI),G===n.BYTE&&(Q=n.RG8I),G===n.SHORT&&(Q=n.RG16I),G===n.INT&&(Q=n.RG32I)),E===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),G===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),G===n.UNSIGNED_INT&&(Q=n.RGB32UI),G===n.BYTE&&(Q=n.RGB8I),G===n.SHORT&&(Q=n.RGB16I),G===n.INT&&(Q=n.RGB32I)),E===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),G===n.UNSIGNED_INT&&(Q=n.RGBA32UI),G===n.BYTE&&(Q=n.RGBA8I),G===n.SHORT&&(Q=n.RGBA16I),G===n.INT&&(Q=n.RGBA32I)),E===n.RGB&&(G===n.UNSIGNED_SHORT&&pe&&(Q=pe.RGB16_EXT),G===n.SHORT&&pe&&(Q=pe.RGB16_SNORM_EXT),G===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),G===n.UNSIGNED_INT_10F_11F_11F_REV&&(Q=n.R11F_G11F_B10F)),E===n.RGBA){let ee=ce?la:Ze.getTransfer(ne);G===n.FLOAT&&(Q=n.RGBA32F),G===n.HALF_FLOAT&&(Q=n.RGBA16F),G===n.UNSIGNED_BYTE&&(Q=ee===yt?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT&&pe&&(Q=pe.RGBA16_EXT),G===n.SHORT&&pe&&(Q=pe.RGBA16_SNORM_EXT),G===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function v(R,E){let G;return R?E===null||E===pi||E===fs?G=n.DEPTH24_STENCIL8:E===Yn?G=n.DEPTH32F_STENCIL8:E===lo&&(G=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===pi||E===fs?G=n.DEPTH_COMPONENT24:E===Yn?G=n.DEPTH_COMPONENT32F:E===lo&&(G=n.DEPTH_COMPONENT16),G}function T(R,E){return _(R)===!0||R.isFramebufferTexture&&R.minFilter!==kt&&R.minFilter!==un?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function P(R){let E=new WeakRef(R);i.get(R).__ref=E,p.add(E),g.register(R,E,E)}function C(R){let E=i.get(R).__ref;E!==void 0&&(p.delete(E),g.unregister(E))}function I(R){j(R.target)}function U(R){L(R.target)}function j(R){R.removeEventListener("dispose",I),C(R),B(R),R.isVideoTexture&&u.delete(R),R.isHTMLTexture&&h.delete(R)}function L(R){R.removeEventListener("dispose",U),C(R),K(R)}function z(){for(let R of p){let E=R.deref();E!==void 0&&(E.isRenderTarget===!0?L(E):j(E))}p.clear(),h.clear()}function B(R){let E=i.get(R);if(E.__webglInit===void 0)return;let G=R.source,re=d.get(G);if(re){let ne=re[E.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&H(R),Object.keys(re).length===0&&d.delete(G)}i.remove(R)}function H(R){let E=i.get(R);n.deleteTexture(E.__webglTexture);let G=R.source,re=d.get(G);delete re[E.__cacheKey],o.memory.textures--}function K(R){let E=i.get(R);E.__depthDisposeCallback&&E.__depthDisposeCallback();let G=R.depthTexture;if(G&&G.renderTarget===R&&j(G),R.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(E.__webglFramebuffer[ne]))for(let ce=0;ce<E.__webglFramebuffer[ne].length;ce++)n.deleteFramebuffer(E.__webglFramebuffer[ne][ce]);else n.deleteFramebuffer(E.__webglFramebuffer[ne]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[ne])}else{if(Array.isArray(E.__webglFramebuffer))for(let ne=0;ne<E.__webglFramebuffer.length;ne++)n.deleteFramebuffer(E.__webglFramebuffer[ne]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let ne=0;ne<E.__webglColorRenderbuffer.length;ne++)E.__webglColorRenderbuffer[ne]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[ne]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let re=R.textures;for(let ne=0,ce=re.length;ne<ce;ne++){let pe=i.get(re[ne]);pe.__webglTexture&&(n.deleteTexture(pe.__webglTexture),o.memory.textures--),i.remove(re[ne])}i.remove(R)}let $=0;function Y(){$=0}function q(){return $}function ae(R){$=R}function Re(){let R=$;return R>=r.maxTextures&&Ne("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+r.maxTextures),$+=1,R}function J(R){let E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.mipmapsAutoUpdate),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function oe(R,E){let G=i.get(R);if(R.isVideoTexture&&qt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&G.__version!==R.version){let re=R.image;if(re===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{Xt(G,R,E);return}}else R.isExternalTexture&&(G.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+E)}function _e(R,E){let G=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){Xt(G,R,E);return}else R.isExternalTexture&&(G.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+E)}function Le(R,E){let G=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){Xt(G,R,E);return}t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+E)}function ye(R,E){let G=i.get(R);if(R.version>0&&G.__version!==R.version){Nn(G,R,E);return}t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+E)}let Ue={[Tc]:n.REPEAT,[jn]:n.CLAMP_TO_EDGE,[Ac]:n.MIRRORED_REPEAT},_t={[kt]:n.NEAREST,[Kg]:n.NEAREST_MIPMAP_NEAREST,[wa]:n.NEAREST_MIPMAP_LINEAR,[un]:n.LINEAR,[Kc]:n.LINEAR_MIPMAP_NEAREST,[Ji]:n.LINEAR_MIPMAP_LINEAR},Ae={[ny]:n.NEVER,[bf]:n.ALWAYS,[iy]:n.LESS,[gf]:n.LEQUAL,[ry]:n.EQUAL,[yf]:n.GEQUAL,[sy]:n.GREATER,[oy]:n.NOTEQUAL};function rt(R,E){if(E.type===Yn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===un||E.magFilter===Kc||E.magFilter===wa||E.magFilter===Ji||E.minFilter===un||E.minFilter===Kc||E.minFilter===wa||E.minFilter===Ji)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,Ue[E.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Ue[E.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Ue[E.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,_t[E.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,_t[E.minFilter]),E.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Ae[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===kt||E.minFilter!==wa&&E.minFilter!==Ji||E.type===Yn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function at(R,E){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",I),P(E));let re=E.source,ne=d.get(re);ne===void 0&&(ne={},d.set(re,ne));let ce=J(E);if(ce!==R.__cacheKey){ne[ce]===void 0&&(ne[ce]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ne[ce].usedTimes++;let pe=ne[R.__cacheKey];pe!==void 0&&(ne[R.__cacheKey].usedTimes--,pe.usedTimes===0&&H(E)),R.__cacheKey=ce,R.__webglTexture=ne[ce].texture}return G}function Je(R,E,G){return Math.floor(Math.floor(R/G)/E)}function dn(R,E,G,re){let ce=R.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,E.width,E.height,G,re,E.data);else{ce.sort((k,te)=>k.start-te.start);let pe=0;for(let k=1;k<ce.length;k++){let te=ce[pe],Z=ce[k],de=te.start+te.count,le=Je(Z.start,E.width,4),ue=Je(te.start,E.width,4);Z.start<=de+1&&le===ue&&Je(Z.start+Z.count-1,E.width,4)===le?te.count=Math.max(te.count,Z.start+Z.count-te.start):(++pe,ce[pe]=Z)}ce.length=pe+1;let Q=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),he=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,E.width);for(let k=0,te=ce.length;k<te;k++){let Z=ce[k],de=Math.floor(Z.start/4),le=Math.ceil(Z.count/4),ue=de%E.width,Pe=Math.floor(de/E.width),Xe=le,se=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ue),t.pixelStorei(n.UNPACK_SKIP_ROWS,Pe),t.texSubImage2D(n.TEXTURE_2D,0,ue,Pe,Xe,se,G,re,E.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Q),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,he)}}function Xt(R,E,G){let re=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(re=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(re=n.TEXTURE_3D);let ne=at(R,E),ce=E.source;t.bindTexture(re,R.__webglTexture,n.TEXTURE0+G);let pe=i.get(ce);if(ce.version!==pe.__version||ne===!0){if(t.activeTexture(n.TEXTURE0+G),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){let se=Ze.getPrimaries(Ze.workingColorSpace),ke=E.colorSpace===gi?null:Ze.getPrimaries(E.colorSpace),We=E.colorSpace===gi||se===ke?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,We)}t.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment);let ee=b(E.image,!1,r.maxTextureSize);ee=Oe(E,ee);let he=s.convert(E.format,E.colorSpace),k=s.convert(E.type),te=w(E.internalFormat,he,k,E.normalized,E.colorSpace,E.isVideoTexture);rt(re,E);let Z,de=E.mipmaps,le=E.isVideoTexture!==!0,ue=pe.__version===void 0||ne===!0,Pe=ce.dataReady,Xe=T(E,ee);if(E.isDepthTexture)te=v(E.format===Zi,E.type),ue&&(le?t.texStorage2D(n.TEXTURE_2D,1,te,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,te,ee.width,ee.height,0,he,k,null));else if(E.isDataTexture)if(de.length>0){le&&ue&&t.texStorage2D(n.TEXTURE_2D,Xe,te,de[0].width,de[0].height);for(let se=0,ke=de.length;se<ke;se++)Z=de[se],le?Pe&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,Z.width,Z.height,he,k,Z.data):t.texImage2D(n.TEXTURE_2D,se,te,Z.width,Z.height,0,he,k,Z.data);E.generateMipmaps=!1}else le?(ue&&t.texStorage2D(n.TEXTURE_2D,Xe,te,ee.width,ee.height),Pe&&dn(E,ee,he,k)):t.texImage2D(n.TEXTURE_2D,0,te,ee.width,ee.height,0,he,k,ee.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){le&&ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Xe,te,de[0].width,de[0].height,ee.depth);for(let se=0,ke=de.length;se<ke;se++)if(Z=de[se],E.format!==kn)if(he!==null)if(le){if(Pe)if(E.layerUpdates.size>0){let We=Cf(Z.width,Z.height,E.format,E.type);for(let be of E.layerUpdates){let xt=Z.data.subarray(be*We/Z.data.BYTES_PER_ELEMENT,(be+1)*We/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,be,Z.width,Z.height,1,he,xt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,0,Z.width,Z.height,ee.depth,he,Z.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,se,te,Z.width,Z.height,ee.depth,0,Z.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Pe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,0,Z.width,Z.height,ee.depth,he,k,Z.data):t.texImage3D(n.TEXTURE_2D_ARRAY,se,te,Z.width,Z.height,ee.depth,0,he,k,Z.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{le&&ue&&t.texStorage2D(n.TEXTURE_2D,Xe,te,de[0].width,de[0].height);for(let se=0,ke=de.length;se<ke;se++)Z=de[se],E.format!==kn?he!==null?le?Pe&&t.compressedTexSubImage2D(n.TEXTURE_2D,se,0,0,Z.width,Z.height,he,Z.data):t.compressedTexImage2D(n.TEXTURE_2D,se,te,Z.width,Z.height,0,Z.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Pe&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,Z.width,Z.height,he,k,Z.data):t.texImage2D(n.TEXTURE_2D,se,te,Z.width,Z.height,0,he,k,Z.data)}else if(E.isDataArrayTexture)if(le){if(ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Xe,te,ee.width,ee.height,ee.depth),Pe)if(E.layerUpdates.size>0){let se=Cf(ee.width,ee.height,E.format,E.type);for(let ke of E.layerUpdates){let We=ee.data.subarray(ke*se/ee.data.BYTES_PER_ELEMENT,(ke+1)*se/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ke,ee.width,ee.height,1,he,k,We)}E.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,he,k,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,te,ee.width,ee.height,ee.depth,0,he,k,ee.data);else if(E.isData3DTexture)le?(ue&&t.texStorage3D(n.TEXTURE_3D,Xe,te,ee.width,ee.height,ee.depth),Pe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,he,k,ee.data)):t.texImage3D(n.TEXTURE_3D,0,te,ee.width,ee.height,ee.depth,0,he,k,ee.data);else if(E.isFramebufferTexture){if(ue)if(le)t.texStorage2D(n.TEXTURE_2D,Xe,te,ee.width,ee.height);else{let se=ee.width,ke=ee.height;for(let We=0;We<Xe;We++)t.texImage2D(n.TEXTURE_2D,We,te,se,ke,0,he,k,null),se>>=1,ke>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in n){let se=n.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),ee.parentNode!==se){se.appendChild(ee),h.add(E),se.onpaint=ke=>{let We=ke.changedElements;for(let be of h)We.includes(be.image)&&(be.needsUpdate=!0)},se.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ee);else{let We=n.RGBA,be=n.RGBA,xt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,We,be,xt,ee)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(de.length>0){if(le&&ue){let se=Ve(de[0]);t.texStorage2D(n.TEXTURE_2D,Xe,te,se.width,se.height)}for(let se=0,ke=de.length;se<ke;se++)Z=de[se],le?Pe&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,he,k,Z):t.texImage2D(n.TEXTURE_2D,se,te,he,k,Z);E.generateMipmaps=!1}else if(le){if(ue){let se=Ve(ee);t.texStorage2D(n.TEXTURE_2D,Xe,te,se.width,se.height)}Pe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,he,k,ee)}else t.texImage2D(n.TEXTURE_2D,0,te,he,k,ee);_(E)&&E.mipmapsAutoUpdate===!0&&x(re),pe.__version=ce.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function Nn(R,E,G){if(E.image.length!==6)return;let re=at(R,E),ne=E.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+G);let ce=i.get(ne);if(ne.version!==ce.__version||re===!0){t.activeTexture(n.TEXTURE0+G);let pe=Ze.getPrimaries(Ze.workingColorSpace),Q=E.colorSpace===gi?null:Ze.getPrimaries(E.colorSpace),ee=E.colorSpace===gi||pe===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let he=E.isCompressedTexture||E.image[0].isCompressedTexture,k=E.image[0]&&E.image[0].isDataTexture,te=[];for(let be=0;be<6;be++)!he&&!k?te[be]=b(E.image[be],!0,r.maxCubemapSize):te[be]=k?E.image[be].image:E.image[be],te[be]=Oe(E,te[be]);let Z=te[0],de=s.convert(E.format,E.colorSpace),le=s.convert(E.type),ue=w(E.internalFormat,de,le,E.normalized,E.colorSpace),Pe=E.isVideoTexture!==!0,Xe=ce.__version===void 0||re===!0,se=ne.dataReady,ke=T(E,Z);rt(n.TEXTURE_CUBE_MAP,E);let We;if(E.isDepthTexture){if(ue=v(E.format===Zi,E.type),Xe)if(Pe)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,ue,Z.width,Z.height);else for(let be=0;be<6;be++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,ue,Z.width,Z.height,0,de,le,null)}else if(he){Pe&&Xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ke,ue,Z.width,Z.height);for(let be=0;be<6;be++){We=te[be].mipmaps;for(let xt=0;xt<We.length;xt++){let sn=We[xt];E.format!==kn?de!==null?Pe?se&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt,0,0,sn.width,sn.height,de,sn.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt,ue,sn.width,sn.height,0,sn.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt,0,0,sn.width,sn.height,de,le,sn.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt,ue,sn.width,sn.height,0,de,le,sn.data)}}}else{if(We=E.mipmaps,Pe&&Xe){We.length>0&&ke++;let be=Ve(te[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ke,ue,be.width,be.height)}for(let be=0;be<6;be++)if(k){Pe?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,0,0,te[be].width,te[be].height,de,le,te[be].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,ue,te[be].width,te[be].height,0,de,le,te[be].data);for(let xt=0;xt<We.length;xt++){let er=We[xt].image[be].image;Pe?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt+1,0,0,er.width,er.height,de,le,er.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt+1,ue,er.width,er.height,0,de,le,er.data)}}else{Pe?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,0,0,de,le,te[be]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,ue,de,le,te[be]);for(let xt=0;xt<We.length;xt++){let sn=We[xt];Pe?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt+1,0,0,de,le,sn.image[be]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+be,xt+1,ue,de,le,sn.image[be])}}}_(E)&&E.mipmapsAutoUpdate===!0&&x(n.TEXTURE_CUBE_MAP),ce.__version=ne.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function Dt(R,E,G,re,ne,ce){let pe=s.convert(G.format,G.colorSpace),Q=s.convert(G.type),ee=w(G.internalFormat,pe,Q,G.normalized,G.colorSpace),he=i.get(E),k=i.get(G);if(k.__renderTarget=E,!he.__hasExternalTextures){let te=Math.max(1,E.width>>ce),Z=Math.max(1,E.height>>ce);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,ce,ee,te,Z,E.depth,0,pe,Q,null):t.texImage2D(ne,ce,ee,te,Z,0,pe,Q,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),ge(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,re,ne,k.__webglTexture,0,It(E)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,re,ne,k.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function vi(R,E,G){if(n.bindRenderbuffer(n.RENDERBUFFER,R),E.depthBuffer){let re=E.depthTexture,ne=re&&re.isDepthTexture?re.type:null,ce=v(E.stencilBuffer,ne),pe=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ge(E)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,It(E),ce,E.width,E.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,It(E),ce,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,ce,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,R)}else{let re=E.textures;for(let ne=0;ne<re.length;ne++){let ce=re[ne],pe=s.convert(ce.format,ce.colorSpace),Q=s.convert(ce.type),ee=w(ce.internalFormat,pe,Q,ce.normalized,ce.colorSpace);ge(E)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,It(E),ee,E.width,E.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,It(E),ee,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,ee,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function rn(R,E,G){let re=E.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ne=i.get(E.depthTexture);ne.__renderTarget=E;let ce=re?E.depthTexture.image[0]:E.depthTexture.image;(!ne.__webglTexture||ce.width!==E.width||ce.height!==E.height)&&(ce.width=E.width,ce.height=E.height,E.depthTexture.needsUpdate=!0),re?ye(E.depthTexture,0):oe(E.depthTexture,0);let pe=ne.__webglTexture,Q=It(E),ee=re?n.TEXTURE_CUBE_MAP_POSITIVE_X+G:n.TEXTURE_2D,he=E.depthTexture.format===Zi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(E.depthTexture.format===Wi)ge(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,ee,pe,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,he,ee,pe,0);else if(E.depthTexture.format===Zi)ge(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,ee,pe,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,he,ee,pe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Jn(R){let E=i.get(R),G=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){let re=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),re){let ne=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,re.removeEventListener("dispose",ne)};re.addEventListener("dispose",ne),E.__depthDisposeCallback=ne}E.__boundDepthTexture=re}if(R.depthTexture&&!E.__autoAllocateDepthBuffer)if(G)for(let re=0;re<6;re++)rn(E.__webglFramebuffer[re],R,re);else R.texture.mipmaps.length>0?rn(E.__webglFramebuffer[0],R,0):rn(E.__webglFramebuffer,R,0);else if(G){E.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[re]),E.__webglDepthbuffer[re]===void 0)E.__webglDepthbuffer[re]=n.createRenderbuffer(),vi(E.__webglDepthbuffer[re],R,!1);else{let ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=E.__webglDepthbuffer[re];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ce)}}else if(R.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),vi(E.__webglDepthbuffer,R,!1);else{let ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ce)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Zn(R,E,G){let re=i.get(R);E!==void 0&&Dt(re.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&Jn(R)}function Kn(R){let E=R.texture,G=i.get(R),re=i.get(E);R.addEventListener("dispose",U),P(R);let ne=R.textures,ce=R.isWebGLCubeRenderTarget===!0,pe=ne.length>1;if(pe||(re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture()),re.__version=E.version,o.memory.textures++),ce){G.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(E.mipmaps.length>0){G.__webglFramebuffer[Q]=[];for(let ee=0;ee<E.mipmaps.length;ee++)G.__webglFramebuffer[Q][ee]=n.createFramebuffer()}else G.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(E.mipmaps.length>0){G.__webglFramebuffer=[];for(let Q=0;Q<E.mipmaps.length;Q++)G.__webglFramebuffer[Q]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(pe)for(let Q=0,ee=ne.length;Q<ee;Q++){let he=i.get(ne[Q]);he.__webglTexture===void 0&&(he.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&ge(R)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let Q=0;Q<ne.length;Q++){let ee=ne[Q];G.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[Q]);let he=s.convert(ee.format,ee.colorSpace),k=s.convert(ee.type),te=w(ee.internalFormat,he,k,ee.normalized,ee.colorSpace,R.isXRRenderTarget===!0),Z=It(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,te,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,G.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),vi(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,re.__webglTexture),rt(n.TEXTURE_CUBE_MAP,E);for(let Q=0;Q<6;Q++)if(E.mipmaps.length>0)for(let ee=0;ee<E.mipmaps.length;ee++)Dt(G.__webglFramebuffer[Q][ee],R,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ee);else Dt(G.__webglFramebuffer[Q],R,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);_(E)?x(n.TEXTURE_CUBE_MAP):E.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,E.mipmaps.length-1),t.unbindTexture()}else if(pe){for(let Q=0,ee=ne.length;Q<ee;Q++){let he=ne[Q],k=i.get(he),te=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(te=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,k.__webglTexture),rt(te,he),Dt(G.__webglFramebuffer,R,he,n.COLOR_ATTACHMENT0+Q,te,0),_(he)&&x(te)}t.unbindTexture()}else{let Q=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Q=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Q,re.__webglTexture),rt(Q,E),E.mipmaps.length>0)for(let ee=0;ee<E.mipmaps.length;ee++)Dt(G.__webglFramebuffer[ee],R,E,n.COLOR_ATTACHMENT0,Q,ee);else Dt(G.__webglFramebuffer,R,E,n.COLOR_ATTACHMENT0,Q,0);_(E)?x(Q):E.mipmaps.length>0&&n.texParameteri(Q,n.TEXTURE_MAX_LEVEL,E.mipmaps.length-1),t.unbindTexture()}R.depthBuffer&&Jn(R)}function F(R){let E=R.textures;for(let G=0,re=E.length;G<re;G++){let ne=E[G];if(_(ne)&&ne.mipmapsAutoUpdate===!0){let ce=S(R),pe=i.get(ne).__webglTexture;t.bindTexture(ce,pe),x(ce),t.unbindTexture()}}}let Qn=[];function Lt(R){if(R.samples>0){if(ge(R)===!1){let E=R.textures,G=R.width,re=R.height,ne=n.COLOR_BUFFER_BIT,ce=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=i.get(R),Q=E.length>1;if(Q)for(let he=0;he<E.length;he++)t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),R.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let he=0;he<E.length;he++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,pe.__webglColorRenderbuffer[he]);let k=i.get(E[he]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,k,0)}n.blitFramebuffer(0,0,G,re,0,0,G,re,ne,n.NEAREST),l===!0&&(Qn.length=0,Qn.push(n.COLOR_ATTACHMENT0+he),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&Qn.push(ce),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Qn))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let he=0;he<E.length;he++){t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,pe.__webglColorRenderbuffer[he]);let k=i.get(E[he]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,k,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let E=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function It(R){return Math.min(r.maxSamples,R.samples)}function ge(R){let E=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function qt(R){let E=o.render.frame;u.get(R)!==E&&(u.set(R,E),R.update())}function Oe(R,E){let G=R.colorSpace,re=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==ss&&G!==gi&&(Ze.getTransfer(G)===yt?(re!==kn||ne!==In)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ze("WebGLTextures: Unsupported texture color space:",G)),E}function Ve(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=Re,this.resetTextureUnits=Y,this.getTextureUnits=q,this.setTextureUnits=ae,this.setTexture2D=oe,this.setTexture2DArray=_e,this.setTexture3D=Le,this.setTextureCube=ye,this.rebindTextures=Zn,this.setupRenderTarget=Kn,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=Lt,this.setupDepthRenderbuffer=Jn,this.setupFrameBufferTexture=Dt,this.useMultisampledRTT=ge,this.dispose=z}function JE(n,e){function t(i,r=gi){let s,o=Ze.getTransfer(r);if(i===In)return n.UNSIGNED_BYTE;if(i===eu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===tu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===lf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===cf)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===of)return n.BYTE;if(i===af)return n.SHORT;if(i===lo)return n.UNSIGNED_SHORT;if(i===Qc)return n.INT;if(i===pi)return n.UNSIGNED_INT;if(i===Yn)return n.FLOAT;if(i===mi)return n.HALF_FLOAT;if(i===uf)return n.ALPHA;if(i===hf)return n.RGB;if(i===kn)return n.RGBA;if(i===Wi)return n.DEPTH_COMPONENT;if(i===Zi)return n.DEPTH_STENCIL;if(i===df)return n.RED;if(i===nu)return n.RED_INTEGER;if(i===Tr)return n.RG;if(i===iu)return n.RG_INTEGER;if(i===ru)return n.RGBA_INTEGER;if(i===Ea||i===Ta||i===Aa||i===Ca)if(o===yt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ea)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ta)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Aa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ca)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ea)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ta)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Aa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ca)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===su||i===ou||i===au||i===lu)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===su)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ou)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===au)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cu||i===uu||i===hu||i===du||i===fu||i===Ra||i===pu)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===cu||i===uu)return o===yt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===hu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===du)return s.COMPRESSED_R11_EAC;if(i===fu)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Ra)return s.COMPRESSED_RG11_EAC;if(i===pu)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===mu||i===gu||i===yu||i===bu||i===xu||i===vu||i===_u||i===Su||i===Mu||i===wu||i===Eu||i===Tu||i===Au||i===Cu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===mu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===gu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===yu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===vu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_u)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Su)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Mu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===wu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Eu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Tu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Au)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Cu)return o===yt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ru||i===Pu||i===Lu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Ru)return o===yt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Pu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Lu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Iu||i===ku||i===Pa||i===Du)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Iu)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ku)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Du)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===fs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var ZE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,KE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ff=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new ba(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Rt({vertexShader:ZE,fragmentShader:KE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new bt(new qi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Uf=class extends hi{constructor(e,t){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,d=null,p=null,g=typeof XRWebGLBinding<"u",m=new Ff,y={},b=t.getContextAttributes(),_=null,x=null,S=[],w=[],v=new Me,T=null,P=null,C=new bn;C.viewport=new ct;let I=new bn;I.viewport=new ct;let U=[C,I],j=new Yc,L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let oe=S[J];return oe===void 0&&(oe=new Js,S[J]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(J){let oe=S[J];return oe===void 0&&(oe=new Js,S[J]=oe),oe.getGripSpace()},this.getHand=function(J){let oe=S[J];return oe===void 0&&(oe=new Js,S[J]=oe),oe.getHandSpace()};function B(J){let oe=w.indexOf(J.inputSource);if(oe===-1)return;let _e=S[oe];_e!==void 0&&(_e.update(J.inputSource,J.frame,c||o),_e.dispatchEvent({type:J.type,data:J.inputSource}))}function H(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",K);for(let J=0;J<S.length;J++){let oe=w[J];oe!==null&&(w[J]=null,S[J].disconnect(oe))}L=null,z=null,m.reset();for(let J in y)delete y[J];if(e.setRenderTarget(_),d=null,f=null,h=null,r=null,x=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(v.width,v.height,!1),P!==null){let J=P.camera;J.fov=P.fov,J.zoom=P.zoom,J.updateProjectionMatrix(),P=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&g&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(_=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",H),r.addEventListener("inputsourceschange",K),b.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(v),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Le=null,ye=null;b.depth&&(ye=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=b.stencil?Zi:Wi,Le=b.stencil?fs:pi);let Ue={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:s};h=this.getBinding(),f=h.createProjectionLayer(Ue),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Pn(f.textureWidth,f.textureHeight,{format:kn,type:In,depthTexture:new Xi(f.textureWidth,f.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let _e={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,_e),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Pn(d.framebufferWidth,d.framebufferHeight,{format:kn,type:In,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Re.setContext(r),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K(J){for(let oe=0;oe<J.removed.length;oe++){let _e=J.removed[oe],Le=w.indexOf(_e);Le>=0&&(w[Le]=null,S[Le].disconnect(_e))}for(let oe=0;oe<J.added.length;oe++){let _e=J.added[oe],Le=w.indexOf(_e);if(Le===-1){for(let Ue=0;Ue<S.length;Ue++)if(Ue>=w.length){w.push(_e),Le=Ue;break}else if(w[Ue]===null){w[Ue]=_e,Le=Ue;break}if(Le===-1)break}let ye=S[Le];ye&&ye.connect(_e)}}function $(J,oe){oe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(oe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let oe=J.near,_e=J.far;m.texture!==null&&(m.depthNear>0&&(oe=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),j.near=I.near=C.near=oe,j.far=I.far=C.far=_e,(L!==j.near||z!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),L=j.near,z=j.far),j.layers.mask=J.layers.mask|6,C.layers.mask=j.layers.mask&-5,I.layers.mask=j.layers.mask&-3;let Le=J.parent,ye=j.cameras;$(j,Le);for(let Ue=0;Ue<ye.length;Ue++)$(ye[Ue],Le);j.projectionMatrix.copy(C.projectionMatrix),j.projectionMatrixInverse.copy(C.projectionMatrixInverse),P===null&&J.isPerspectiveCamera&&(P={camera:J,fov:J.fov,zoom:J.zoom}),Y(J,j,Le)};function Y(J,oe,_e){_e===null?J.matrix.copy(oe.matrixWorld):(J.matrix.copy(_e.matrixWorld),J.matrix.invert(),J.matrix.multiply(oe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(oe.projectionMatrix),J.projectionMatrixInverse.copy(oe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=qs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(J){l=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(j)},this.getCameraTexture=function(J){return y[J]};let q=null;function ae(J,oe){if(u=oe.getViewerPose(c||o),p=oe,u!==null){let _e=u.views;d!==null&&(e.setRenderTargetFramebuffer(x,d.framebuffer),e.setRenderTarget(x));let Le=!1;_e.length!==j.cameras.length&&(j.cameras.length=0,Le=!0);for(let Ae=0;Ae<_e.length;Ae++){let rt=_e[Ae],at=null;if(d!==null)at=d.getViewport(rt);else{let dn=h.getViewSubImage(f,rt);at=dn.viewport,Ae===0&&(e.setRenderTargetTextures(x,dn.colorTexture,dn.depthStencilTexture),e.setRenderTarget(x))}let Je=U[Ae];Je===void 0&&(Je=new bn,Je.layers.enable(Ae),Je.viewport=new ct,U[Ae]=Je),Je.matrix.fromArray(rt.transform.matrix),Je.matrix.decompose(Je.position,Je.quaternion,Je.scale),Je.projectionMatrix.fromArray(rt.projectionMatrix),Je.projectionMatrixInverse.copy(Je.projectionMatrix).invert(),Je.viewport.set(at.x,at.y,at.width,at.height),Ae===0&&(j.matrix.copy(Je.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),Le===!0&&j.cameras.push(Je)}let ye=r.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&g){h=i.getBinding();let Ae=h.getDepthInformation(_e[0]);Ae&&Ae.isValid&&Ae.texture&&m.init(Ae,r.renderState)}if(ye&&ye.includes("camera-access")&&g){e.state.unbindTexture(),h=i.getBinding();for(let Ae=0;Ae<_e.length;Ae++){let rt=_e[Ae].camera;if(rt){let at=y[rt];at||(at=new ba,y[rt]=at);let Je=h.getCameraImage(rt);at.sourceTexture=Je}}}}for(let _e=0;_e<S.length;_e++){let Le=w[_e],ye=S[_e];Le!==null&&ye!==void 0&&ye.update(Le,oe,c||o)}q&&q(J,oe),oe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:oe}),p=null}let Re=new Oy;Re.setAnimationLoop(ae),this.setAnimationLoop=function(J){q=J},this.dispose=function(){}}},QE=new Mt,jy=new He;jy.set(-1,0,0,0,1,0,0,0,1);function e1(n,e){function t(m,y){m.matrixAutoUpdate===!0&&m.updateMatrix(),y.value.copy(m.matrix)}function i(m,y){y.color.getRGB(m.fogColor.value,Ef(n)),y.isFog?(m.fogNear.value=y.near,m.fogFar.value=y.far):y.isFogExp2&&(m.fogDensity.value=y.density)}function r(m,y,b,_,x){y.isNodeMaterial?y.uniformsNeedUpdate=!1:y.isMeshBasicMaterial?s(m,y):y.isMeshLambertMaterial?(s(m,y),y.envMap&&(m.envMapIntensity.value=y.envMapIntensity)):y.isMeshToonMaterial?(s(m,y),h(m,y)):y.isMeshPhongMaterial?(s(m,y),u(m,y),y.envMap&&(m.envMapIntensity.value=y.envMapIntensity)):y.isMeshStandardMaterial?(s(m,y),f(m,y),y.isMeshPhysicalMaterial&&d(m,y,x)):y.isMeshMatcapMaterial?(s(m,y),p(m,y)):y.isMeshDepthMaterial?s(m,y):y.isMeshDistanceMaterial?(s(m,y),g(m,y)):y.isMeshNormalMaterial?s(m,y):y.isLineBasicMaterial?(o(m,y),y.isLineDashedMaterial&&a(m,y)):y.isPointsMaterial?l(m,y,b,_):y.isSpriteMaterial?c(m,y):y.isShadowMaterial?(m.color.value.copy(y.color),m.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function s(m,y){m.opacity.value=y.opacity,y.color&&m.diffuse.value.copy(y.color),y.emissive&&m.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(m.map.value=y.map,t(y.map,m.mapTransform)),y.alphaMap&&(m.alphaMap.value=y.alphaMap,t(y.alphaMap,m.alphaMapTransform)),y.bumpMap&&(m.bumpMap.value=y.bumpMap,t(y.bumpMap,m.bumpMapTransform),m.bumpScale.value=y.bumpScale,y.side===Ln&&(m.bumpScale.value*=-1)),y.normalMap&&(m.normalMap.value=y.normalMap,t(y.normalMap,m.normalMapTransform),m.normalScale.value.copy(y.normalScale),y.side===Ln&&m.normalScale.value.negate()),y.displacementMap&&(m.displacementMap.value=y.displacementMap,t(y.displacementMap,m.displacementMapTransform),m.displacementScale.value=y.displacementScale,m.displacementBias.value=y.displacementBias),y.emissiveMap&&(m.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,m.emissiveMapTransform)),y.specularMap&&(m.specularMap.value=y.specularMap,t(y.specularMap,m.specularMapTransform)),y.alphaTest>0&&(m.alphaTest.value=y.alphaTest);let b=e.get(y),_=b.envMap,x=b.envMapRotation;_&&(m.envMap.value=_,m.envMapRotation.value.setFromMatrix4(QE.makeRotationFromEuler(x)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(jy),m.reflectivity.value=y.reflectivity,m.ior.value=y.ior,m.refractionRatio.value=y.refractionRatio),y.lightMap&&(m.lightMap.value=y.lightMap,m.lightMapIntensity.value=y.lightMapIntensity,t(y.lightMap,m.lightMapTransform)),y.aoMap&&(m.aoMap.value=y.aoMap,m.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,m.aoMapTransform))}function o(m,y){m.diffuse.value.copy(y.color),m.opacity.value=y.opacity,y.map&&(m.map.value=y.map,t(y.map,m.mapTransform))}function a(m,y){m.dashSize.value=y.dashSize,m.totalSize.value=y.dashSize+y.gapSize,m.scale.value=y.scale}function l(m,y,b,_){m.diffuse.value.copy(y.color),m.opacity.value=y.opacity,m.size.value=y.size*b,m.scale.value=_*.5,y.map&&(m.map.value=y.map,t(y.map,m.uvTransform)),y.alphaMap&&(m.alphaMap.value=y.alphaMap,t(y.alphaMap,m.alphaMapTransform)),y.alphaTest>0&&(m.alphaTest.value=y.alphaTest)}function c(m,y){m.diffuse.value.copy(y.color),m.opacity.value=y.opacity,m.rotation.value=y.rotation,y.map&&(m.map.value=y.map,t(y.map,m.mapTransform)),y.alphaMap&&(m.alphaMap.value=y.alphaMap,t(y.alphaMap,m.alphaMapTransform)),y.alphaTest>0&&(m.alphaTest.value=y.alphaTest)}function u(m,y){m.specular.value.copy(y.specular),m.shininess.value=Math.max(y.shininess,1e-4)}function h(m,y){y.gradientMap&&(m.gradientMap.value=y.gradientMap)}function f(m,y){m.metalness.value=y.metalness,y.metalnessMap&&(m.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,m.metalnessMapTransform)),m.roughness.value=y.roughness,y.roughnessMap&&(m.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,m.roughnessMapTransform)),y.envMap&&(m.envMapIntensity.value=y.envMapIntensity)}function d(m,y,b){m.ior.value=y.ior,y.diffuseRoughness>0&&(m.diffuseRoughness.value=y.diffuseRoughness,y.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=y.diffuseRoughnessMap,t(y.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),y.sheen>0&&(m.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),m.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(m.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,m.sheenColorMapTransform)),y.sheenRoughnessMap&&(m.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,m.sheenRoughnessMapTransform))),y.clearcoat>0&&(m.clearcoat.value=y.clearcoat,m.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(m.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,m.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(m.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Ln&&m.clearcoatNormalScale.value.negate())),y.dispersion>0&&(m.dispersion.value=y.dispersion),y.retroreflectivity>0&&(m.retroreflectivity.value=y.retroreflectivity),y.iridescence>0&&(m.iridescence.value=y.iridescence,m.iridescenceIOR.value=y.iridescenceIOR,m.iridescenceThicknessMinimum.value=y.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=y.iridescenceThicknessMaximum,y.iridescenceMap&&(m.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,m.iridescenceMapTransform)),y.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),y.transmission>0&&(m.transmission.value=y.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),y.transmissionMap&&(m.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,m.transmissionMapTransform)),m.thickness.value=y.thickness,y.thicknessMap&&(m.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=y.attenuationDistance,m.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(m.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(m.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=y.specularIntensity,m.specularColor.value.copy(y.specularColor),y.specularColorMap&&(m.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,m.specularColorMapTransform)),y.specularIntensityMap&&(m.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,y){y.matcap&&(m.matcap.value=y.matcap)}function g(m,y){let b=e.get(y).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function t1(n,e,t,i){let r={},s={};function o(b,_){let x=_.program;i.uniformBlockBinding(b,x,r[b.id])}function a(b,_){let x=r[b.id];x===void 0&&(p(b),x=l(b),r[b.id]=x,b.addEventListener("dispose",m));let S=_.program;i.updateUBOMapping(b,S);let w=e.render.frame;s[b.id]!==w&&(c(b),s[b.id]=w)}function l(b){let _=n.createBuffer(),x=b.__size,S=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,x,S),n.bindBuffer(n.UNIFORM_BUFFER,null),_}function c(b){let _=r[b.id],x=b.uniforms,S=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let w=0,v=x.length;w<v;w++){let T=x[w];if(Array.isArray(T))for(let P=0,C=T.length;P<C;P++)u(T[P],w,P,S);else u(T,w,0,S)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(b,_,x,S){if(f(b,_,x,S)===!0){let w=b.__offset,v=b.value;if(Array.isArray(v)){let T=0;for(let P=0;P<v.length;P++){let C=v[P],I=g(C,!0);h(C,b.__data,T),T+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else h(v,b.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,w,b.__data)}}function h(b,_,x){typeof b=="number"||typeof b=="boolean"?_[x]=b:b.isMatrix3?(_[x]=b.elements[0],_[x+1]=b.elements[1],_[x+2]=b.elements[2],_[x+3]=0,_[x+4]=b.elements[3],_[x+5]=b.elements[4],_[x+6]=b.elements[5],_[x+7]=0,_[x+8]=b.elements[6],_[x+9]=b.elements[7],_[x+10]=b.elements[8],_[x+11]=0):ArrayBuffer.isView(b)?_.set(b.subarray(0,_.length-x),x):b.toArray(_,x)}function f(b,_,x,S){let w=b.value,v=_+"_"+x;if(Array.isArray(w)){S[v]===void 0&&(S[v]=[]);let T=S[v],P=!1;for(let C=0;C<w.length;C++)d(w[C],T,C)===!0&&(P=!0);return P}return d(w,S,v)}function d(b,_,x){if(_[x]===void 0)return typeof b=="number"||typeof b=="boolean"?_[x]=b:ArrayBuffer.isView(b)?_[x]=b.slice():_[x]=b.clone(),!0;{let S=_[x];if(typeof b=="number"||typeof b=="boolean"){if(S!==b)return _[x]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(S.equals(b)===!1)return S.copy(b),!0}}return!1}function p(b){let _=b.uniforms,x=0,S=16;for(let v=0,T=_.length;v<T;v++){let P=Array.isArray(_[v])?_[v]:[_[v]];for(let C=0,I=P.length;C<I;C++){let U=P[C],j=Array.isArray(U.value)?U.value:[U.value],L=Array.isArray(_[v])||Array.isArray(U.value),z=x;for(let H=0,K=j.length;H<K;H++){let $=j[H],Y=g($,L),q=x%S,ae=q%Y.boundary,Re=q+ae;x+=ae,Re!==0&&S-Re<Y.storage&&(x+=S-Re),H===0&&(z=x),x+=Y.storage}let B=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new B((x-z)/Float32Array.BYTES_PER_ELEMENT),U.__offset=z}}let w=x%S;return w>0&&(x+=S-w),b.__size=x,b.__cache={},this}function g(b,_){let x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=16,x.storage=48):b.isMatrix4?(x.boundary=16,x.storage=64):b.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(x.boundary=16,x.storage=b.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",b),_===!0&&(x.boundary=16,x.storage=Math.ceil(x.storage/16)*16),x}function m(b){let _=b.target;_.removeEventListener("dispose",m),n.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function y(){for(let b in r)n.deleteBuffer(r[b]);r={},s={}}return{bind:o,update:a,dispose:y}}var n1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Pi=null;function i1(){return Pi===null&&(Pi=new xr(n1,16,16,Tr,mi),Pi.name="DFG_LUT",Pi.minFilter=un,Pi.magFilter=un,Pi.wrapS=jn,Pi.wrapT=jn,Pi.generateMipmaps=!1,Pi.needsUpdate=!0),Pi}var Bu=class{constructor(e={}){let{canvas:t=ay(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1,outputBufferType:d=In}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=d,m=new Set([ru,iu,nu]),y=new Set([In,pi,lo,fs,eu,tu]),b=new Uint32Array(4),_=new Int32Array(4),x={textures:[],min:[],max:[],resolution:[]},S=null,w=null,v=[],T=[],P=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,I=!1,U=null,j=null,L=null,z=null;this._outputColorSpace=$n;let B=0,H=0,K=null,$=-1,Y=null,q=new ct,ae=new ct,Re=null,J=new Fe(0),oe=0,_e=t.width,Le=t.height,ye=1,Ue=null,_t=null,Ae=new ct(0,0,_e,Le),rt=new ct(0,0,_e,Le),at=!1,Je=new ls,dn=new kc,Xt=!1,Nn=!1,Dt=new Mt,vi=new O,rn=new ct,Jn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Zn=!1;function Kn(){return K===null?ye:1}let F=i;function Qn(A,D){return t.getContext(A,D)}let Lt,It,ge,qt,Oe,Ve,R,E,G,re,ne,ce,pe,Q,ee,he,k,te,Z,de,le,ue,Pe;try{let A={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",ke,!1),t.addEventListener("webglcontextrestored",We,!1),t.addEventListener("webglcontextcreationerror",be,!1),F===null){let D="webgl2";if(F=Qn(D,A),F===null)throw Qn(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Xe()}catch(A){throw t.removeEventListener("webglcontextlost",ke,!1),t.removeEventListener("webglcontextrestored",We,!1),t.removeEventListener("webglcontextcreationerror",be,!1),ze("WebGLRenderer: "+A.message),A}function Xe(){Lt=new pw(F),Lt.init(),le=new JE(F,Lt),It=new iw(F,Lt,e,le),ge=new qE(F,Lt),It.reversedDepthBuffer&&f&&ge.buffers.depth.setReversed(!0),j=F.createFramebuffer(),L=F.createFramebuffer(),z=F.createFramebuffer(),qt=new yw(F),Oe=new DE,Ve=new YE(F,Lt,ge,Oe,It,le,qt),R=new fw(C),E=new x_(F),ue=new tw(F,E),G=new mw(F,E,qt,ue),re=new xw(F,G,E,ue,qt),te=new bw(F,It,Ve),ee=new rw(Oe),ne=new kE(C,R,Lt,It,ue,ee),ce=new e1(C,Oe),pe=new OE,Q=new VE(Lt),k=new ew(C,R,ge,re,p,l),he=new XE(C,re,It),Pe=new t1(F,qt,It,ge),Z=new nw(F,Lt,qt),de=new gw(F,Lt,qt),qt.programs=ne.programs,C.capabilities=It,C.extensions=Lt,C.properties=Oe,C.renderLists=pe,C.shadowMap=he,C.state=ge,C.info=qt}g!==In&&(P=new _w(g,t.width,t.height,a,r,s));let se=new Uf(C,F);this.xr=se,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let A=Lt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=Lt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(A){A!==void 0&&(ye=A,this.setSize(_e,Le,!1))},this.getSize=function(A){return A.set(_e,Le)},this.setSize=function(A,D,X=!0){if(se.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}_e=A,Le=D,t.width=Math.floor(A*ye),t.height=Math.floor(D*ye),X===!0&&(t.style.width=A+"px",t.style.height=D+"px"),P!==null&&P.setSize(t.width,t.height),this.setViewport(0,0,A,D)},this.getDrawingBufferSize=function(A){return A.set(_e*ye,Le*ye).floor()},this.setDrawingBufferSize=function(A,D,X){_e=A,Le=D,ye=X,t.width=Math.floor(A*X),t.height=Math.floor(D*X),this.setViewport(0,0,A,D)},this.setEffects=function(A){if(g===In){ze("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let D=0;D<A.length;D++)if(A[D].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(q)},this.getViewport=function(A){return A.copy(Ae)},this.setViewport=function(A,D,X,V){A.isVector4?Ae.set(A.x,A.y,A.z,A.w):Ae.set(A,D,X,V),ge.viewport(q.copy(Ae).multiplyScalar(Kn()).round())},this.getScissor=function(A){return A.copy(rt)},this.setScissor=function(A,D,X,V){A.isVector4?rt.set(A.x,A.y,A.z,A.w):rt.set(A,D,X,V),ge.scissor(ae.copy(rt).multiplyScalar(Kn()).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(A){ge.setScissorTest(at=A)},this.setOpaqueSort=function(A){Ue=A},this.setTransparentSort=function(A){_t=A},this.getClearColor=function(A){return A.copy(k.getClearColor())},this.setClearColor=function(){k.setClearColor(...arguments)},this.getClearAlpha=function(){return k.getClearAlpha()},this.setClearAlpha=function(){k.setClearAlpha(...arguments)},this.clear=function(A=!0,D=!0,X=!0){let V=0;if(A){let W=!1;if(K!==null){let me=K.texture.format;W=m.has(me)}if(W){let me=K.texture.type,we=y.has(me),fe=k.getClearColor(),ve=k.getClearAlpha(),Ce=fe.r,Ge=fe.g,tt=fe.b;we?(b[0]=Ce,b[1]=Ge,b[2]=tt,b[3]=ve,F.clearBufferuiv(F.COLOR,0,b)):(_[0]=Ce,_[1]=Ge,_[2]=tt,_[3]=ve,F.clearBufferiv(F.COLOR,0,_))}else V|=F.COLOR_BUFFER_BIT}D&&(V|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(V|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&F.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),U=A},this.dispose=function(){t.removeEventListener("webglcontextlost",ke,!1),t.removeEventListener("webglcontextrestored",We,!1),t.removeEventListener("webglcontextcreationerror",be,!1),k.dispose(),pe.dispose(),Q.dispose(),Ve.dispose(),Oe.dispose(),R.dispose(),re.dispose(),G.dispose(),ue.dispose(),Pe.dispose(),ne.dispose(),se.dispose(),se.removeEventListener("sessionstart",pp),se.removeEventListener("sessionend",mp),Ir.stop()};function ke(A){A.preventDefault(),ha("WebGLRenderer: Context Lost."),I=!0}function We(){ha("WebGLRenderer: Context Restored."),I=!1;let A=qt.autoReset,D=he.enabled,X=he.autoUpdate,V=he.needsUpdate,W=he.type;Xe(),qt.autoReset=A,he.enabled=D,he.autoUpdate=X,he.needsUpdate=V,he.type=W}function be(A){ze("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function xt(A){let D=A.target;D.removeEventListener("dispose",xt),sn(D)}function sn(A){er(A),Oe.remove(A)}function er(A){let D=Oe.get(A).programs;D!==void 0&&(D.forEach(function(X){ne.releaseProgram(X)}),A.isShaderMaterial&&ne.releaseShaderCache(A))}this.renderBufferDirect=function(A,D,X,V,W,me){D===null&&(D=Jn);let we=W.isMesh&&W.matrixWorld.determinantAffine()<0,fe=ub(A,D,X,V,W);ge.setMaterial(V,we);let ve=X.index,Ce=1;if(V.wireframe===!0){if(ve=G.getWireframeAttribute(X),ve===void 0)return;Ce=2}let Ge=X.drawRange,tt=X.attributes.position,Ee=Ge.start*Ce,nt=(Ge.start+Ge.count)*Ce;me!==null&&(Ee=Math.max(Ee,me.start*Ce),nt=Math.min(nt,(me.start+me.count)*Ce)),ve!==null?(Ee=Math.max(Ee,0),nt=Math.min(nt,ve.count)):tt!=null&&(Ee=Math.max(Ee,0),nt=Math.min(nt,tt.count));let zt=nt-Ee;if(zt<0||zt===1/0)return;ue.setup(W,V,fe,X,ve);let wt,St=Z;if(ve!==null&&(wt=E.get(ve),St=de,St.setIndex(wt)),W.isMesh)V.wireframe===!0?(ge.setLineWidth(V.wireframeLinewidth*Kn()),St.setMode(F.LINES)):St.setMode(F.TRIANGLES);else if(W.isLine){let Sn=V.linewidth;Sn===void 0&&(Sn=1),ge.setLineWidth(Sn*Kn()),W.isLineSegments?St.setMode(F.LINES):W.isLineLoop?St.setMode(F.LINE_LOOP):St.setMode(F.LINE_STRIP)}else W.isPoints?St.setMode(F.POINTS):W.isSprite&&St.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(Lt.get("WEBGL_multi_draw"))St.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Sn=W._multiDrawStarts,Te=W._multiDrawCounts,Cn=W._multiDrawCount,ut=ve?E.get(ve).bytesPerElement:1,kr=Oe.get(V).currentProgram.getUniforms();for(let Mn=0;Mn<Cn;Mn++)kr.setValue(F,"_gl_DrawID",Mn),St.render(Sn[Mn]/ut,Te[Mn])}else if(W.isInstancedMesh)St.renderInstances(Ee,zt,W.count);else if(X.isInstancedBufferGeometry){let Sn=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Te=Math.min(X.instanceCount,Sn);St.renderInstances(Ee,zt,Te)}else St.render(Ee,zt)};function fp(A,D,X,V){U!==null&&A.isNodeMaterial&&U.setObject(V,A),Xt===!0&&ee.setState(A,X,!1),A.transparent===!0&&A.side===Pt&&A.forceSinglePass===!1?(A.side=Ln,A.needsUpdate=!0,vo(A,D,V),A.side=Er,A.needsUpdate=!0,vo(A,D,V),A.side=Pt):vo(A,D,V)}this.compile=function(A,D,X=null){X===null&&(X=A),U!==null&&U.renderStart(A,D,X),w=Q.get(X),w.init(D),T.push(w),X.traverseVisible(function(W){W.isLight&&W.layers.test(D.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),A!==X&&A.traverseVisible(function(W){W.isLight&&W.layers.test(D.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights(),U!==null&&U.updateLights(w.state.lightsArray),Nn=this.localClippingEnabled,Xt=ee.init(this.clippingPlanes,Nn),Xt===!0&&ee.setGlobalState(this.clippingPlanes,D),U!==null&&he.render(w.state.shadowsArray,X,D);let V=new Set;return A.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let me=W.material;if(me)if(Array.isArray(me))for(let we=0;we<me.length;we++){let fe=me[we];fp(fe,X,D,W),V.add(fe)}else fp(me,X,D,W),V.add(me)}),w=T.pop(),U!==null&&U.renderEnd(),V},this.compileAsync=function(A,D,X=null){let V=this.compile(A,D,X);return new Promise(W=>{function me(){if(V.forEach(function(we){let ve=Oe.get(we).currentProgram;(ve===void 0||ve.isReady())&&V.delete(we)}),V.size===0){W(A);return}setTimeout(me,10)}Lt.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let uh=null;function lb(A){uh&&uh(A)}function pp(){Ir.stop()}function mp(){Ir.start()}let Ir=new Oy;Ir.setAnimationLoop(lb),typeof self<"u"&&Ir.setContext(self),this.setAnimationLoop=function(A){uh=A,se.setAnimationLoop(A),A===null?Ir.stop():Ir.start()},se.addEventListener("sessionstart",pp),se.addEventListener("sessionend",mp),this.render=function(A,D){if(D!==void 0&&D.isCamera!==!0){ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;U!==null&&U.renderStart(A,D);let X=se.enabled===!0&&se.isPresenting===!0,V=P!==null&&(K===null||X)&&P.begin(C,K);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(se.cameraAutoUpdate===!0&&se.updateCamera(D),D=se.getCamera()),A.isScene===!0&&A.onBeforeRender(C,A,D,K),w=Q.get(A,T.length),w.init(D),w.state.textureUnits=Ve.getTextureUnits(),T.push(w),Dt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),D.isArrayCamera?dn.setFromArrayCamera(D):Je.setFromProjectionMatrix(Dt,ni,D.reversedDepth),Nn=this.localClippingEnabled,Xt=ee.init(this.clippingPlanes,Nn),S=pe.get(A,v.length),S.init(),v.push(S),this.info.render.frame++,se.enabled===!0&&se.isPresenting===!0){let we=C.xr.getDepthSensingMesh();we!==null&&hh(we,D,-1/0,C.sortObjects)}hh(A,D,0,C.sortObjects),S.finish(),U!==null&&U.updateLights(w.state.lightsArray),C.sortObjects===!0&&S.sort(Ue,_t),Zn=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,Zn&&k.addToRenderList(S,A),this.info.autoReset===!0&&this.info.reset(),Xt===!0&&ee.beginShadows();let W=w.state.shadowsArray;if(he.render(W,A,D),Xt===!0&&ee.endShadows(),(V&&P.hasRenderPass())===!1){let we=S.opaque,fe=S.transmissive;if(w.setupLights(),D.isArrayCamera){let ve=D.cameras;if(fe.length>0)for(let Ce=0,Ge=ve.length;Ce<Ge;Ce++){let tt=ve[Ce];yp(we,fe,A,tt)}Zn&&k.render(A);for(let Ce=0,Ge=ve.length;Ce<Ge;Ce++){let tt=ve[Ce];gp(S,A,tt,tt.viewport)}}else fe.length>0&&yp(we,fe,A,D),Zn&&k.render(A),gp(S,A,D)}K!==null&&H===0&&(Ve.updateMultisampleRenderTarget(K),Ve.updateRenderTargetMipmap(K)),V&&P.end(C),A.isScene===!0&&A.onAfterRender(C,A,D),ue.resetDefaultState(),$=-1,Y=null,T.pop(),T.length>0?(w=T[T.length-1],Ve.setTextureUnits(w.state.textureUnits),Xt===!0&&ee.setGlobalState(C.clippingPlanes,w.state.camera)):w=null,v.pop(),v.length>0?S=v[v.length-1]:S=null,U!==null&&U.renderEnd()};function hh(A,D,X,V){if(A.visible===!1)return;if(A.layers.test(D.layers)){if(A.isGroup)X=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(D);else if(A.isLight)w.pushLight(A),A.castShadow&&w.pushShadow(A);else if(A.isSprite){let we=D.isArrayCamera?dn:Je;if(!A.frustumCulled||A.intersectsFrustum(we)){V&&rn.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Dt);let fe=re.update(A),ve=A.material;ve.visible&&S.push(A,fe,ve,X,rn.z,null,D)}}else if(A.isMesh||A.isLine||A.isPoints){let we=D.isArrayCamera?dn:Je;if(!A.frustumCulled||A.intersectsFrustum(we)){let fe=re.update(A),ve=A.material;if(V&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),rn.copy(A.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),rn.copy(fe.boundingSphere.center)),rn.applyMatrix4(A.matrixWorld).applyMatrix4(Dt)),Array.isArray(ve)){let Ce=fe.groups;for(let Ge=0,tt=Ce.length;Ge<tt;Ge++){let Ee=Ce[Ge],nt=ve[Ee.materialIndex];nt&&nt.visible&&S.push(A,fe,nt,X,rn.z,Ee,D)}}else ve.visible&&S.push(A,fe,ve,X,rn.z,null,D)}}}let me=A.children;for(let we=0,fe=me.length;we<fe;we++)hh(me[we],D,X,V)}function gp(A,D,X,V){let{opaque:W,transmissive:me,transparent:we}=A;w.setupLightsView(X),Xt===!0&&ee.setGlobalState(C.clippingPlanes,X),V&&ge.viewport(q.copy(V)),W.length>0&&Qa(W,D,X),me.length>0&&Qa(me,D,X),we.length>0&&Qa(we,D,X),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function yp(A,D,X,V){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[V.id]===void 0){let Ee=Lt.has("EXT_color_buffer_half_float")||Lt.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[V.id]=new Pn(1,1,{generateMipmaps:!0,type:Ee?mi:In,minFilter:Ji,samples:Math.max(4,It.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}let me=w.state.transmissionRenderTarget[V.id],we=V.viewport||q;me.setSize(we.z*C.transmissionResolutionScale,we.w*C.transmissionResolutionScale);let fe=C.getRenderTarget(),ve=C.getActiveCubeFace(),Ce=C.getActiveMipmapLevel();C.setRenderTarget(me),C.getClearColor(J),oe=C.getClearAlpha(),oe<1&&C.setClearColor(16777215,.5),C.clear(),Zn&&k.render(X);let Ge=C.toneMapping;C.toneMapping=Ri;let tt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),w.setupLightsView(V),Xt===!0&&ee.setGlobalState(C.clippingPlanes,V),Qa(A,X,V),Ve.updateMultisampleRenderTarget(me),Ve.updateRenderTargetMipmap(me),Lt.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let nt=0,zt=D.length;nt<zt;nt++){let wt=D[nt],{object:St,geometry:Sn,material:Te,group:Cn}=wt;if(Te.side===Pt&&St.layers.test(V.layers)){let ut=Te.side;Te.side=Ln,Te.needsUpdate=!0,bp(St,X,V,Sn,Te,Cn),Te.side=ut,Te.needsUpdate=!0,Ee=!0}}Ee===!0&&(Ve.updateMultisampleRenderTarget(me),Ve.updateRenderTargetMipmap(me))}C.setRenderTarget(fe,ve,Ce),C.setClearColor(J,oe),tt!==void 0&&(V.viewport=tt),C.toneMapping=Ge}function Qa(A,D,X){let V=D.isScene===!0?D.overrideMaterial:null;for(let W=0,me=A.length;W<me;W++){let we=A[W],{object:fe,geometry:ve,group:Ce}=we,Ge=we.material;Ge.allowOverride===!0&&V!==null&&(Ge=V),fe.layers.test(X.layers)&&bp(fe,D,X,ve,Ge,Ce)}}function bp(A,D,X,V,W,me){U!==null&&W.isNodeMaterial&&U.setObject(A,W),A.onBeforeRender(C,D,X,V,W,me),A.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(C,D,X,V,A,me),W.transparent===!0&&W.side===Pt&&W.forceSinglePass===!1?(W.side=Ln,W.needsUpdate=!0,C.renderBufferDirect(X,D,V,W,A,me),W.side=Er,W.needsUpdate=!0,C.renderBufferDirect(X,D,V,W,A,me),W.side=Pt):C.renderBufferDirect(X,D,V,W,A,me),A.onAfterRender(C,D,X,V,W,me)}function xp(A){let D=0;for(let X of A)X.texture!==null&&D++;return D}function vo(A,D,X){D.isScene!==!0&&(D=Jn);let V=Oe.get(A),W=w.state.lights,me=w.state.shadowsArray,we=W.state.version,fe=ne.getParameters(A,W.state,me,D,X,w.state.lightProbeGridArray),ve=ne.getProgramCacheKey(fe),Ce=V.programs;V.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?D.environment:null,V.fog=D.fog;let Ge=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;V.envMap=R.get(A.envMap||V.environment,Ge),V.envMapRotation=V.environment!==null&&A.envMap===null?D.environmentRotation:A.envMapRotation,Ce===void 0&&(A.addEventListener("dispose",xt),Ce=new Map,V.programs=Ce,V.programVariants=new Map);let tt=Ce.get(ve);if(tt!==void 0){if(V.currentProgram===tt&&V.lightsStateVersion===we)return _p(A,fe),tt}else fe.uniforms=ne.getUniforms(A),U!==null&&A.isNodeMaterial&&U.build(A,X,fe),A.onBeforeCompile(fe,C),tt=ne.acquireProgram(fe,ve),Ce.set(ve,tt),V.uniforms=fe.uniforms;let Ee=V.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ee.clippingPlanes=ee.uniform),_p(A,fe),V.needsLights=db(A),V.lightsStateVersion=we,V.needsLights&&(Ee.ambientLightColor.value=W.state.ambient,Ee.lightProbe.value=W.state.probe,Ee.sunLights.value=W.state.sun,Ee.sunLightShadows.value=W.state.sunShadow,Ee.directionalLights.value=W.state.directional,Ee.directionalLightShadows.value=W.state.directionalShadow,Ee.spotLights.value=W.state.spot,Ee.spotLightShadows.value=W.state.spotShadow,Ee.rectAreaLights.value=W.state.rectArea,Ee.ltc_1.value=W.state.rectAreaLTC1,Ee.ltc_2.value=W.state.rectAreaLTC2,Ee.pointLights.value=W.state.point,Ee.pointLightShadows.value=W.state.pointShadow,Ee.hemisphereLights.value=W.state.hemi,Ee.sunShadowMatrix.value=W.state.sunShadowMatrix,Ee.sunShadowCascade.value=W.state.sunShadowCascade,Ee.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ee.spotLightMatrix.value=W.state.spotLightMatrix,Ee.spotLightMap.value=W.state.spotLightMap,Ee.pointShadowMatrix.value=W.state.pointShadowMatrix),V.numLightProbeGrids=xp(w.state.lightProbeGridArray),V.currentProgram=tt,V.uniformsList=null,tt}function cb(A,D,X,V,W){let me=Oe.get(A),we=me.currentProgram.id+","+V+","+W,fe=me.programVariants.get(we);return fe===void 0?(fe=vo(A,D,X),me.programVariants.set(we,fe)):(me.currentProgram=fe,me.uniformsList=null,me.outputColorSpace=V,me.toneMapping=W),fe}function vp(A){if(A.uniformsList===null){let D=A.currentProgram.getUniforms();A.uniformsList=co.seqWithValue(D.seq,A.uniforms)}return A.uniformsList}function _p(A,D){let X=Oe.get(A);X.outputColorSpace=D.outputColorSpace,X.batching=D.batching,X.batchingColor=D.batchingColor,X.instancing=D.instancing,X.instancingColor=D.instancingColor,X.instancingMorph=D.instancingMorph,X.skinning=D.skinning,X.morphTargets=D.morphTargets,X.morphNormals=D.morphNormals,X.morphColors=D.morphColors,X.morphTargetsCount=D.morphTargetsCount,X.numClippingPlanes=D.numClippingPlanes,X.numIntersection=D.numClipIntersection,X.vertexAlphas=D.vertexAlphas,X.vertexTangents=D.vertexTangents,X.toneMapping=D.toneMapping}function ub(A,D,X,V,W){D.isScene!==!0&&(D=Jn),Ve.resetTextureUnits();let me=D.fog,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?D.environment:null,fe=K===null?C.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ze.workingColorSpace,ve=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ce=R.get(V.envMap||we,ve),Ge=V.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,tt=!!X.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ee=!!X.morphAttributes.position,nt=!!X.morphAttributes.normal,zt=!!X.morphAttributes.color,wt=Ri;V.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(wt=C.toneMapping);let St=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Sn=St!==void 0?St.length:0,Te=Oe.get(V),Cn=w.state.lights;if(Xt===!0&&(Nn===!0||A!==Y)){let Nt=A===Y&&V.id===$;ee.setState(V,A,Nt)}let ut=!1,kr=!1;V.version===Te.__version?Te.needsLights&&Te.lightsStateVersion!==Cn.state.version||W.isBatchedMesh&&Te.batching===!1||!W.isBatchedMesh&&Te.batching===!0||W.isBatchedMesh&&Te.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Te.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Te.instancing===!1||!W.isInstancedMesh&&Te.instancing===!0||W.isSkinnedMesh&&Te.skinning===!1||!W.isSkinnedMesh&&Te.skinning===!0||W.isInstancedMesh&&Te.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Te.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Te.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Te.instancingMorph===!1&&W.morphTexture!==null||Te.envMap!==Ce||V.fog===!0&&Te.fog!==me||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ee.numPlanes||Te.numIntersection!==ee.numIntersection)||Te.vertexAlphas!==Ge||Te.vertexTangents!==tt||Te.morphTargets!==Ee||Te.morphNormals!==nt||Te.morphColors!==zt||Te.morphTargetsCount!==Sn||Te.numLightProbeGrids!==xp(w.state.lightProbeGridArray)?ut=!0:(Te.outputColorSpace!==fe||Te.toneMapping!==wt)&&(kr=!0):(ut=!0,Te.__version=V.version);let Mn=Te.currentProgram;(ut===!0||kr===!0)&&(Mn=kr===!0?cb(V,D,W,fe,wt):vo(V,D,W),U&&V.isNodeMaterial&&U.onUpdateProgram(V,Mn,Te));let el=!1,tr=!1,Dr=!1,ot=Mn.getUniforms(),fn=Te.uniforms;if(ge.useProgram(Mn.program)&&(el=!0,tr=!0,Dr=!0),V.id!==$&&($=V.id,tr=!0),el||Y!==A){ge.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ot.setValue(F,"projectionMatrix",A.projectionMatrix),ot.setValue(F,"viewMatrix",A.matrixWorldInverse);let on=ot.map.cameraPosition;on!==void 0&&on.setValue(F,vi.setFromMatrixPosition(A.matrixWorld)),It.logarithmicDepthBuffer&&ot.setValue(F,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ot.setValue(F,"isOrthographic",A.isOrthographicCamera===!0),Y!==A&&(Y=A,tr=!0,Dr=!0)}if(Te.needsLights&&(Cn.state.sunShadowMap.length>0&&ot.setValue(F,"sunShadowMap",Cn.state.sunShadowMap,Ve),Cn.state.directionalShadowMap.length>0&&ot.setValue(F,"directionalShadowMap",Cn.state.directionalShadowMap,Ve),Cn.state.spotShadowMap.length>0&&ot.setValue(F,"spotShadowMap",Cn.state.spotShadowMap,Ve),Cn.state.pointShadowMap.length>0&&ot.setValue(F,"pointShadowMap",Cn.state.pointShadowMap,Ve)),W.isSkinnedMesh){ot.setOptional(F,W,"bindMatrix"),ot.setOptional(F,W,"bindMatrixInverse");let Nt=W.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),ot.setValue(F,"boneTexture",Nt.boneTexture,Ve))}W.isBatchedMesh&&(ot.setOptional(F,W,"batchingTexture"),ot.setValue(F,"batchingTexture",W._matricesTexture,Ve),ot.setOptional(F,W,"batchingIdTexture"),ot.setValue(F,"batchingIdTexture",W._indirectTexture,Ve),ot.setOptional(F,W,"batchingColorTexture"),W._colorsTexture!==null&&ot.setValue(F,"batchingColorTexture",W._colorsTexture,Ve));let si=X.morphAttributes;if((si.position!==void 0||si.normal!==void 0||si.color!==void 0)&&te.update(W,X,Mn),(tr||Te.receiveShadow!==W.receiveShadow)&&(Te.receiveShadow=W.receiveShadow,ot.setValue(F,"receiveShadow",W.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&D.environment!==null&&(fn.envMapIntensity.value=D.environmentIntensity),fn.dfgLUT!==void 0&&(fn.dfgLUT.value=i1()),tr){if(ot.setValue(F,"toneMappingExposure",C.toneMappingExposure),Te.needsLights&&hb(fn,Dr),me&&V.fog===!0&&ce.refreshFogUniforms(fn,me),ce.refreshMaterialUniforms(fn,V,ye,Le,w.state.transmissionRenderTarget[A.id]),Te.needsLights&&Te.numLightProbeGrids>0){let Nt=x,on=0;for(let Ii of w.state.lightProbeGridArray)Ii.texture!==null&&(Nt.textures[on]=Ii.texture,Nt.min[on]=Ii.boundingBox.min,Nt.max[on]=Ii.boundingBox.max,Nt.resolution[on]=Ii.resolution,on++);for(let Ii in Nt)Nt[Ii].length=on;fn.probesSH.value=Nt.textures,fn.probesMin.value=Nt.min,fn.probesMax.value=Nt.max,fn.probesResolution.value=Nt.resolution}co.upload(F,vp(Te),fn,Ve)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(co.upload(F,vp(Te),fn,Ve),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ot.setValue(F,"center",W.center),ot.setValue(F,"modelViewMatrix",W.modelViewMatrix),ot.setValue(F,"normalMatrix",W.normalMatrix),ot.setValue(F,"modelMatrix",W.matrixWorld),V.uniformsGroups!==void 0){let Nt=V.uniformsGroups;for(let on=0,Ii=Nt.length;on<Ii;on++){let Mp=Nt[on];Pe.update(Mp,Mn),Pe.bind(Mp,Mn)}}return Mn}function hb(A,D){A.ambientLightColor.needsUpdate=D,A.lightProbe.needsUpdate=D,A.sunLights.needsUpdate=D,A.sunLightShadows.needsUpdate=D,A.directionalLights.needsUpdate=D,A.directionalLightShadows.needsUpdate=D,A.pointLights.needsUpdate=D,A.pointLightShadows.needsUpdate=D,A.spotLights.needsUpdate=D,A.spotLightShadows.needsUpdate=D,A.rectAreaLights.needsUpdate=D,A.hemisphereLights.needsUpdate=D}function db(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(A,D,X){let V=Oe.get(A);V.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),Oe.get(A.texture).__webglTexture=D,Oe.get(A.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:X,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,D){let X=Oe.get(A);X.__webglFramebuffer=D,X.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(A,D=0,X=0){K=A,B=D,H=X;let V=null,W=!1,me=!1;if(A){let fe=Oe.get(A);if(fe.__useDefaultFramebuffer!==void 0){ge.bindFramebuffer(F.FRAMEBUFFER,fe.__webglFramebuffer),q.copy(A.viewport),ae.copy(A.scissor),Re=A.scissorTest,ge.viewport(q),ge.scissor(ae),ge.setScissorTest(Re),$=-1;return}else if(fe.__webglFramebuffer===void 0)Ve.setupRenderTarget(A);else if(fe.__hasExternalTextures)Ve.rebindTextures(A,Oe.get(A.texture).__webglTexture,Oe.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Ge=A.depthTexture;if(fe.__boundDepthTexture!==Ge){if(Ge!==null&&Oe.has(Ge)&&(A.width!==Ge.image.width||A.height!==Ge.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ve.setupDepthRenderbuffer(A)}}let ve=A.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(me=!0);let Ce=Oe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ce[D])?V=Ce[D][X]:V=Ce[D],W=!0):A.samples>0&&Ve.useMultisampledRTT(A)===!1?V=Oe.get(A).__webglMultisampledFramebuffer:Array.isArray(Ce)?V=Ce[X]:V=Ce,q.copy(A.viewport),ae.copy(A.scissor),Re=A.scissorTest}else q.copy(Ae).multiplyScalar(ye).floor(),ae.copy(rt).multiplyScalar(ye).floor(),Re=at;if(X!==0&&(V=j),ge.bindFramebuffer(F.FRAMEBUFFER,V)&&ge.drawBuffers(A,V),ge.viewport(q),ge.scissor(ae),ge.setScissorTest(Re),W){let fe=Oe.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+D,fe.__webglTexture,X)}else if(me){let fe=D;for(let ve=0;ve<A.textures.length;ve++){let Ce=Oe.get(A.textures[ve]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+ve,Ce.__webglTexture,X,fe)}}else if(A!==null&&X!==0){let fe=Oe.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fe.__webglTexture,X)}$=-1};function Sp(A){let D=Oe.get(A);return(D.__readFormat!==A.format||D.__readType!==A.type)&&(D.__readFormat=A.format,D.__readType=A.type,D.__formatReadable=It.textureFormatReadable(A.format),D.__typeReadable=It.textureTypeReadable(A.type)),D}this.readRenderTargetPixels=function(A,D,X,V,W,me,we,fe=0){if(!(A&&A.isWebGLRenderTarget)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=Oe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(ve=ve[we],Array.isArray(ve)&&(ve=ve[0])),ve){ge.bindFramebuffer(F.FRAMEBUFFER,ve);try{let Ce=A.textures[fe],Ge=Ce.format,tt=Ce.type;A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+fe);let Ee=Sp(Ce);if(Ee.__formatReadable===!1){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ee.__typeReadable===!1){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=A.width-V&&X>=0&&X<=A.height-W&&F.readPixels(D,X,V,W,le.convert(Ge),le.convert(tt),me)}finally{let Ce=K!==null?Oe.get(K).__webglFramebuffer:null;ge.bindFramebuffer(F.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(A,D,X,V,W,me,we,fe=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=Oe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(ve=ve[we],Array.isArray(ve)&&(ve=ve[0])),ve)if(D>=0&&D<=A.width-V&&X>=0&&X<=A.height-W){ge.bindFramebuffer(F.FRAMEBUFFER,ve);let Ce=A.textures[fe],Ge=Ce.format,tt=Ce.type;A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+fe);let Ee=Sp(Ce);if(Ee.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ee.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let nt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,nt),F.bufferData(F.PIXEL_PACK_BUFFER,me.byteLength,F.STREAM_READ),F.readPixels(D,X,V,W,le.convert(Ge),le.convert(tt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let zt=K!==null?Oe.get(K).__webglFramebuffer:null;ge.bindFramebuffer(F.FRAMEBUFFER,zt);let wt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await cy(F,wt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,nt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,me),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(nt),F.deleteSync(wt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,D=null,X=0){let V=Math.pow(2,-X),W=Math.floor(A.image.width*V),me=Math.floor(A.image.height*V),we=D!==null?D.x:0,fe=D!==null?D.y:0;Ve.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,we,fe,W,me),ge.unbindTexture()},this.copyTextureToTexture=function(A,D,X=null,V=null,W=0,me=0){let we,fe,ve,Ce,Ge,tt,Ee,nt,zt,wt=A.isCompressedTexture?A.mipmaps[me]:A.image;if(X!==null)we=X.max.x-X.min.x,fe=X.max.y-X.min.y,ve=X.isBox3?X.max.z-X.min.z:1,Ce=X.min.x,Ge=X.min.y,tt=X.isBox3?X.min.z:0;else{let ot=Math.pow(2,-W);we=Math.floor(wt.width*ot),fe=Math.floor(wt.height*ot),A.isDataArrayTexture?ve=wt.depth:A.isData3DTexture?ve=Math.floor(wt.depth*ot):ve=1,Ce=0,Ge=0,tt=0}V!==null?(Ee=V.x,nt=V.y,zt=V.z):(Ee=0,nt=0,zt=0);let St=le.convert(D.format),Sn=le.convert(D.type),Te;D.isData3DTexture?(Ve.setTexture3D(D,0),Te=F.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Ve.setTexture2DArray(D,0),Te=F.TEXTURE_2D_ARRAY):(Ve.setTexture2D(D,0),Te=F.TEXTURE_2D),ge.activeTexture(F.TEXTURE0),ge.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,D.flipY),ge.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),ge.pixelStorei(F.UNPACK_ALIGNMENT,D.unpackAlignment);let Cn=ge.getParameter(F.UNPACK_ROW_LENGTH),ut=ge.getParameter(F.UNPACK_IMAGE_HEIGHT),kr=ge.getParameter(F.UNPACK_SKIP_PIXELS),Mn=ge.getParameter(F.UNPACK_SKIP_ROWS),el=ge.getParameter(F.UNPACK_SKIP_IMAGES);ge.pixelStorei(F.UNPACK_ROW_LENGTH,wt.width),ge.pixelStorei(F.UNPACK_IMAGE_HEIGHT,wt.height),ge.pixelStorei(F.UNPACK_SKIP_PIXELS,Ce),ge.pixelStorei(F.UNPACK_SKIP_ROWS,Ge),ge.pixelStorei(F.UNPACK_SKIP_IMAGES,tt);let tr=A.isDataArrayTexture||A.isData3DTexture,Dr=D.isDataArrayTexture||D.isData3DTexture;if(A.isDepthTexture){let ot=Oe.get(A),fn=Oe.get(D),si=Oe.get(ot.__renderTarget),Nt=Oe.get(fn.__renderTarget);ge.bindFramebuffer(F.READ_FRAMEBUFFER,si.__webglFramebuffer),ge.bindFramebuffer(F.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let on=0;on<ve;on++)tr&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Oe.get(A).__webglTexture,W,tt+on),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Oe.get(D).__webglTexture,me,zt+on)),F.blitFramebuffer(Ce,Ge,Ce+we,Ge+fe,Ee,nt,Ee+we,nt+fe,F.DEPTH_BUFFER_BIT,F.NEAREST);ge.bindFramebuffer(F.READ_FRAMEBUFFER,null),ge.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(W!==0||A.isRenderTargetTexture||Oe.has(A)){let ot=Oe.get(A),fn=Oe.get(D);ge.bindFramebuffer(F.READ_FRAMEBUFFER,L),ge.bindFramebuffer(F.DRAW_FRAMEBUFFER,z);for(let si=0;si<ve;si++)tr?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ot.__webglTexture,W,tt+si):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ot.__webglTexture,W),Dr?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,fn.__webglTexture,me,zt+si):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fn.__webglTexture,me),W!==0?F.blitFramebuffer(Ce,Ge,Ce+we,Ge+fe,Ee,nt,Ee+we,nt+fe,F.COLOR_BUFFER_BIT,F.NEAREST):Dr?F.copyTexSubImage3D(Te,me,Ee,nt,zt+si,Ce,Ge,we,fe):F.copyTexSubImage2D(Te,me,Ee,nt,Ce,Ge,we,fe);ge.bindFramebuffer(F.READ_FRAMEBUFFER,null),ge.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Dr?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(Te,me,Ee,nt,zt,we,fe,ve,St,Sn,wt.data):D.isCompressedArrayTexture?F.compressedTexSubImage3D(Te,me,Ee,nt,zt,we,fe,ve,St,wt.data):F.texSubImage3D(Te,me,Ee,nt,zt,we,fe,ve,St,Sn,wt):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,me,Ee,nt,we,fe,St,Sn,wt.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,me,Ee,nt,wt.width,wt.height,St,wt.data):F.texSubImage2D(F.TEXTURE_2D,me,Ee,nt,we,fe,St,Sn,wt);ge.pixelStorei(F.UNPACK_ROW_LENGTH,Cn),ge.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ut),ge.pixelStorei(F.UNPACK_SKIP_PIXELS,kr),ge.pixelStorei(F.UNPACK_SKIP_ROWS,Mn),ge.pixelStorei(F.UNPACK_SKIP_IMAGES,el),me===0&&D.generateMipmaps===!0&&D.mipmapsAutoUpdate===!0&&F.generateMipmap(Te),ge.unbindTexture()},this.initRenderTarget=function(A){Oe.get(A).__webglFramebuffer===void 0&&Ve.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?Ve.setTextureCube(A,0):A.isData3DTexture?Ve.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?Ve.setTexture2DArray(A,0):Ve.setTexture2D(A,0),ge.unbindTexture()},this.resetState=function(){B=0,H=0,K=null,ge.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}};var Xy={type:"change"},Hf={type:"start"},Yy={type:"end"},Vu=new br,qy=new Wn,r1=Math.cos(70*wf.DEG2RAD),tn=new O,Fn=2*Math.PI,pt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},zf=1e-6,Gu=class extends Sa{constructor(e,t=null){super(e,t),this.state=pt.NONE,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ii.ROTATE,MIDDLE:ii.DOLLY,RIGHT:ii.PAN},this.touches={ONE:fi.ROTATE,TWO:fi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new Xn,this._lastTargetPosition=new O,this._quat=new Xn().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ro,this._sphericalDelta=new ro,this._scale=1,this._panOffset=new O,this._rotateStart=new Me,this._rotateEnd=new Me,this._rotateDelta=new Me,this._panStart=new Me,this._panEnd=new Me,this._panDelta=new Me,this._dollyStart=new Me,this._dollyEnd=new Me,this._dollyDelta=new Me,this._dollyDirection=new O,this._mouse=new Me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=o1.bind(this),this._onPointerDown=s1.bind(this),this._onPointerUp=a1.bind(this),this._onContextMenu=p1.bind(this),this._onMouseWheel=u1.bind(this),this._onKeyDown=h1.bind(this),this._onTouchStart=d1.bind(this),this._onTouchMove=f1.bind(this),this._onMouseDown=l1.bind(this),this._onMouseMove=c1.bind(this),this._interceptControlDown=m1.bind(this),this._interceptControlUp=g1.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=pt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Xy),this.update(),this.state=pt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;tn.copy(t).sub(this.target),tn.applyQuaternion(this._quat),this._spherical.setFromVector3(tn),this.autoRotate&&this.state===pt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Fn:i>Math.PI&&(i-=Fn),r<-Math.PI?r+=Fn:r>Math.PI&&(r-=Fn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(tn.setFromSpherical(this._spherical),tn.applyQuaternion(this._quatInverse),t.copy(this.target).add(tn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=tn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){let a=new O(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;let c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=tn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Vu.origin.copy(this.object.position),Vu.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vu.direction))<r1?this.object.lookAt(this.target):(qy.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vu.intersectPlane(qy,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>zf||8*(1-this._lastQuaternion.dot(this.object.quaternion))>zf||this._lastTargetPosition.distanceToSquared(this.target)>zf?(this.dispatchEvent(Xy),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Fn/60*this.autoRotateSpeed*e:Fn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){tn.setFromMatrixColumn(t,0),tn.multiplyScalar(-e),this._panOffset.add(tn)}_panUp(e,t){this.screenSpacePanning===!0?tn.setFromMatrixColumn(t,1):(tn.setFromMatrixColumn(t,0),tn.crossVectors(this.object.up,tn)),tn.multiplyScalar(e),this._panOffset.add(tn)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;tn.copy(r).sub(this.target);let s=tn.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Me,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function s1(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function o1(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function a1(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Yy),this.state=pt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function l1(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ii.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=pt.DOLLY;break;case ii.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=pt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=pt.ROTATE}break;case ii.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=pt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=pt.PAN}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(Hf)}function c1(n){switch(this.state){case pt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case pt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case pt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function u1(n){this.enabled===!1||this.enableZoom===!1||this.state!==pt.NONE||(n.preventDefault(),this.dispatchEvent(Hf),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Yy))}function h1(n){this.enabled!==!1&&this._handleKeyDown(n)}function d1(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case fi.ROTATE:if(this.enableRotate===!1){this.state=pt.NONE;break}this._handleTouchStartRotate(n),this.state=pt.TOUCH_ROTATE;break;case fi.PAN:if(this.enablePan===!1){this.state=pt.NONE;break}this._handleTouchStartPan(n),this.state=pt.TOUCH_PAN;break;default:this.state=pt.NONE}break;case 2:switch(this.touches.TWO){case fi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=pt.TOUCH_DOLLY_PAN;break;case fi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=pt.TOUCH_DOLLY_ROTATE;break;default:this.state=pt.NONE}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(Hf)}function f1(n){switch(this._trackPointer(n),this.state){case pt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case pt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case pt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case pt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=pt.NONE}}function p1(n){this.enabled!==!1&&n.preventDefault()}function m1(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function g1(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var $f='"Helvetica Neue", Arial, sans-serif',Ky=13,Qy=12,Gf=(n,e)=>{let[t,i,r]=et(n).map(s=>Math.round(255*s));return`rgba(${t}, ${i}, ${r}, ${e})`};function e0(n,e,t,i,r,s,o,a){let l=r/2;switch(n.beginPath(),e){case"square":n.rect(t-l,i-l,r,r);break;case"diamond":n.moveTo(t,i-l),n.lineTo(t+l,i),n.lineTo(t,i+l),n.lineTo(t-l,i),n.closePath();break;case"triangle":n.moveTo(t,i-l),n.lineTo(t+.866*l,i+.5*l),n.lineTo(t-.866*l,i+.5*l),n.closePath();break;case"star":for(let c=0;c<10;c++){let u=-Math.PI/2+c*Math.PI/5,h=c%2===0?l:.4*l;c===0?n.moveTo(t+h*Math.cos(u),i+h*Math.sin(u)):n.lineTo(t+h*Math.cos(u),i+h*Math.sin(u))}n.closePath();break;case"cross":case"plus":{e==="cross"?(n.moveTo(t-l,i-l),n.lineTo(t+l,i+l),n.moveTo(t-l,i+l),n.lineTo(t+l,i-l)):(n.moveTo(t-l,i),n.lineTo(t+l,i),n.moveTo(t,i-l),n.lineTo(t,i+l)),n.lineWidth=Math.max(1,a||r/6),n.strokeStyle=s??"#ffffff",n.lineCap="butt",n.stroke();return}default:n.arc(t,i,l,0,2*Math.PI)}if(e==="ring"){n.lineWidth=Math.max(1,a||r/6),n.strokeStyle=s??"#ffffff",n.stroke();return}s!==null&&(n.fillStyle=s,n.fill()),o!==null&&a>0&&(n.lineWidth=a,n.strokeStyle=o,n.lineJoin="miter",n.stroke())}function Wf(n,e){let t=n.shape??"disc",i=typeof n.edge_width=="number"?n.edge_width:n.edge!==void 0?1:0;return t==="ring"||t==="cross"||t==="plus"?Math.max(1,i||e/6):n.edge!==void 0?i:0}function t0(n,e,t=4){let i=Wf(n,e),r=e+i,s=Math.max(8,Math.min(512,Math.ceil(r*t))),o=document.createElement("canvas");o.width=o.height=s;let a=o.getContext("2d"),l=s/r;return a.scale(l,l),e0(a,n.shape??"disc",r/2,r/2,e,n.color??"#ffffff",n.edge??null,i),o}var ho=.984,$u=.227,fo=ho-$u,y1=1.15,b1=2/14;function n0(n=1.2){return y1+fo*(n-1.2)}var Ua=.7,Wu=.18,jf=.42;function i0(n){let e=typeof n=="string"?[{text:n}]:n,t=[[]];for(let i of e)i.text.split(`
`).forEach((r,s)=>{s>0&&t.push([]),r!==""&&t[t.length-1].push({text:r,...i.shift?{shift:i.shift}:{}})});return t}var Xf=(n,e)=>`${n.weight==="bold"?"bold ":""}${e?.shift?Ua*n.size:n.size}px ${n.font}`;function r0(n,e,t){let i=0;for(let r of e)n.font=Xf(t,r),i+=n.measureText(r.text).width;return i}var yi=n=>typeof n=="string"?n:n.map(e=>e.text).join("");function qf(n,e,t,i,r){let s=i0(e),o=Math.max(0,...s.map(h=>r0(n,h,r)));n.font=Xf(r);let a=(ho+n0(r.linespacing)*(s.length-1))*r.size,l=r.align==="center"?t-o/2:r.align==="end"?t-o:t,c=r.baseline,u=c==="middle"?i-a/2:c==="bottom"?i-a:c==="alphabetic"?i-a+$u*r.size:i;return[l,u,o,a]}function Fa(n,e,t,i,r){if(r.opacity<=0||yi(e)==="")return;let[s,o,a,l]=qf(n,e,t,i,r);n.save(),n.globalAlpha*=r.opacity;let c=r.box;if(c!==void 0){let u=c.pad??4,h=c.radius??0;n.beginPath(),x1(n,s-u,o-u,a+2*u,l+2*u,h),c.fill!==void 0&&(n.fillStyle=Gf(c.fill,c.opacity??1),n.fill()),c.edge!==void 0&&(c.edge_width??1)>0&&(n.lineWidth=c.edge_width??1,n.strokeStyle=Gf(c.edge,c.opacity??1),n.stroke())}n.fillStyle=r.color,n.textBaseline="alphabetic",n.textAlign="left",i0(e).forEach((u,h)=>{let f=r0(n,u,r),d=r.align==="center"?s+(a-f)/2:r.align==="end"?s+a-f:s,p=o+(fo+n0(r.linespacing)*h)*r.size;for(let g of u){n.font=Xf(r,g);let m=g.shift==="sub"?Wu*r.size:g.shift==="sup"?-jf*r.size:0;n.fillText(g.text,d,p+m),d+=n.measureText(g.text).width}}),n.restore()}function x1(n,e,t,i,r,s){let o=Math.max(0,Math.min(s,i/2,r/2));n.moveTo(e+o,t),n.lineTo(e+i-o,t),n.arcTo(e+i,t,e+i,t+o,o),n.lineTo(e+i,t+r-o),n.arcTo(e+i,t+r,e+i-o,t+r,o),n.lineTo(e+o,t+r),n.arcTo(e,t+r,e,t+r-o,o),n.lineTo(e,t+o),n.arcTo(e,t,e+o,t,o),n.closePath()}function s0(n,e,t){let i=n.box===void 0?void 0:{...n.box,...n.box.fill?{fill:Ut(n.box.fill,e)}:{},...n.box.edge?{edge:Ut(n.box.edge,e)}:{}};return{size:n.size??Ky,color:n.color!==void 0?Ut(n.color,e):e.foreground,weight:n.weight??"normal",font:e.font??$f,align:n.align??"start",baseline:n.baseline??"middle",opacity:lt(n.opacity,t),box:i,...n.linespacing===void 0?{}:{linespacing:n.linespacing}}}function v1(n,e,t,i,r,s,o){let a=s0(e,s,o);if(a.opacity<=0||yi(t)==="")return;let[l,c]=e.offset??[0,0],u=i+l,h=r+c;if(e.leader!==void 0&&e.leader!==!1&&(l!==0||c!==0)){let[f,d,p,g]=qf(n,t,u,h,a),m=e.box!==void 0?e.box.pad??4:0,y=f+p/2,b=d+g/2,_=i-y,x=r-b,S=p/2+m,w=g/2+m,v=Math.min(Math.abs(_)>1e-9?S/Math.abs(_):1/0,Math.abs(x)>1e-9?w/Math.abs(x):1/0),T=b1*a.size;if(v<1){let P=y+v*_,C=b+v*x,I=Math.hypot(i-P,r-C);if(I>2*T){let U=(i-P)/I,j=(r-C)/I,L=e.leader===!0?{}:e.leader;n.save(),n.globalAlpha*=a.opacity,n.strokeStyle=L.color!==void 0?Ut(L.color,s):a.color,n.lineWidth=L.width??1,n.beginPath(),n.moveTo(P+T*U,C+T*j),n.lineTo(i-T*U,r-T*j),n.stroke(),n.restore()}}}Fa(n,t,u,h,a)}var _1=[1,2,2.5,5,10];function Jy(n,e,t){let i=e-n;if(!(i>0)||!Number.isFinite(i))return{values:[],step:1};let r=i/Math.max(1,t),s=Math.pow(10,Math.floor(Math.log10(r))),o=[10,1,.1,.01].flatMap(f=>_1.map(d=>d*s*f)),a=o.filter(f=>f>=r*(1-1e-9)).sort((f,d)=>f-d),l=o.filter(f=>f<r*(1-1e-9)).sort((f,d)=>d-f),c=[...a,...l],u=[],h=c[0];for(let f of c){h=f,u=[];for(let d=Math.ceil(n/f-1e-9);d<=Math.floor(e/f+1e-9)&&u.length<200;d++)u.push(d*f+0);if(u.length>=2)break}return{values:u,step:h}}function Zy(n,e){let t=0;for(;t<10&&Math.abs(Math.round(e*10**t)-e*10**t)>1e-9*10**t;)t++;return(Math.abs(n)<e*1e-9?0:n).toFixed(t).replace("-","\u2212")}function S1(n,e,t){if(e.opacity<=0||e.rect.w<2||e.rect.h<2)return;let{x:i,y:r,w:s,h:o}=e.rect,a=t.font??$f,l=t.foreground,c=3.5/14*e.size,u=3.5/14*e.size,h=4/14*e.size,f=.8/14*e.size;n.save(),n.globalAlpha*=e.opacity,n.strokeStyle=l,n.fillStyle=l,n.lineWidth=f,n.strokeRect(i,r,s,o),n.font=`${e.size}px ${a}`;let d=x=>i+(x-e.x0)/(e.x1-e.x0)*s,p=x=>r+o-(x-e.y0)/(e.y1-e.y0)*o,g=Jy(e.x0,e.x1,Math.max(1,Math.floor(s/(3*e.size)))),m=Jy(e.y0,e.y1,Math.max(1,Math.floor(o/(2*e.size))));n.beginPath();for(let x of g.values)n.moveTo(d(x),r+o),n.lineTo(d(x),r+o+c);for(let x of m.values)n.moveTo(i,p(x)),n.lineTo(i-c,p(x));n.stroke();let y=0;if(n.textBaseline="alphabetic",e.ticks.x){n.textAlign="center";for(let x of g.values)n.fillText(Zy(x,g.step),d(x),r+o+c+u+fo*e.size)}if(e.ticks.y){n.textAlign="right";for(let x of m.values){let S=Zy(x,m.step);y=Math.max(y,n.measureText(S).width),n.fillText(S,i-c-u,p(x)+fo/2*e.size)}}let b=16/14*e.size,_={size:b,color:l,weight:"normal",font:a,align:"center",baseline:"alphabetic",opacity:1};yi(e.titles[0])!==""&&Fa(n,e.titles[0],i+s/2,r+o+c+u+(e.ticks.x?ho*e.size:0)+h+fo*b,_),yi(e.titles[1])!==""&&(n.save(),n.translate(i-c-u-(e.ticks.y?y:0)-h,r+o/2),n.rotate(-Math.PI/2),Fa(n,e.titles[1],0,-$u*b,_),n.restore()),n.restore()}function M1(n,e,t,i,r,s){let o=lt(e.opacity,s);if(o<=0||e.entries.length===0)return;let a=e.size??Ky,l=r.font??$f;n.save(),n.globalAlpha*=o,n.font=`${a}px ${l}`;let c=(e.handle_length??2)*a,u=(e.handle_pad??.8)*a,h=(e.column_spacing??2)*a,f=Math.max(1,Math.min(e.columns??e.entries.length,e.entries.length)),d=Math.ceil(e.entries.length/f),p=z=>c,g=e.entries.map((z,B)=>({e:z,col:Math.floor(B/d),row:B%d})),m=Array.from({length:f},()=>0),y={size:a,color:Ut(e.color??r.foreground,r),weight:"normal",font:l,align:"start",baseline:"middle",opacity:1};for(let z of g)m[z.col]=Math.max(m[z.col],p(z.e)+u+qf(n,Oa(z.e.label),0,0,y)[2]);let b=m.reduce((z,B)=>z+B,0)+h*(f-1),_=(ho+.5)*a,x=.4*a,S=.5*a,w=z=>Oa(z.label).some(B=>B.shift==="sub")?(Wu+(Ua-1)*$u)*a:0,v=g.map(({col:z,row:B})=>{let H=0;for(let K=0;K<B;K++)H+=_+w(e.entries[z*d+K]);return H}),T=Math.max(...g.map((z,B)=>v[B]+_+w(z.e)))-.5*a,P=e.at[0]*t,C=e.at[1]*i,I=e.align??"center",U=I==="center"?P-b/2:I==="end"?P-S-x-b:P+S+x,j=e.baseline??"top",L=j==="middle"?C-T/2:j==="bottom"?C-S-x-T:C+S+x;for(let[z,{e:B,col:H}]of g.entries()){let K=U+m.slice(0,H).reduce((ae,Re)=>ae+Re,0)+h*H,$=L+v[z]+ho/2*a,Y=$+(fo-ho/2-.35)*a,q=p(B);if(B.colors!==void 0){let ae=B.colors.length,Re=q/ae;B.colors.forEach((J,oe)=>{n.strokeStyle=Ut(J,r),n.lineWidth=B.line?.width??2,n.globalAlpha=o*(B.line?.opacity??1),n.lineCap="butt",n.beginPath(),n.moveTo(K+oe*Re,Y),n.lineTo(K+(oe+1)*Re,Y),n.stroke()}),n.globalAlpha=o}else B.line!==void 0&&(n.save(),n.globalAlpha=o*(B.line.opacity??1),n.strokeStyle=Ut(B.line.color??r.foreground,r),n.lineWidth=B.line.width??2,n.lineCap=B.line.dash===void 0?"square":"butt",B.line.dash!==void 0&&n.setLineDash(B.line.dash),n.beginPath(),n.moveTo(K,Y),n.lineTo(K+q,Y),n.stroke(),n.restore());if(B.marker!==void 0){let ae=Do(B.marker,r);n.save(),n.globalAlpha=o*lt(ae.opacity,s),e0(n,ae.shape??"disc",K+q/2,Y,To(ae.size,s,.6*a),ae.color??r.foreground,ae.edge??null,typeof ae.edge_width=="number"?ae.edge_width:ae.edge?1:0),n.restore()}Fa(n,Oa(B.label),K+q+u,$,y)}n.restore()}function w1(n,e,t,i){t>=1||(n.save(),n.fillStyle=Gf(i.background,1-Math.max(0,t)),n.fillRect(e.x,e.y,e.w,e.h),n.restore())}function o0(n,e,t,i,r,s,o,a,l){let c=s*Ot(t.clock),u=null,h=f=>f.kind==="panel"?f.id:h(f.a);u=h(i.layout);for(let f of Object.keys(i.panels)){let d=e.paintInfo(f);if(d===null||d.outer.w<1||d.outer.h<1)continue;let p=lt(d.opacity,c);if(w1(n,d.outer,p,r),!(p<=0)){if(n.save(),n.globalAlpha=p,d.box!==null){let g=d.boxTitles,m=g===void 0?d.box.titles:[0,1].map(y=>{let b=g[y];if(b===void 0)return d.box.titles[y];let _=typeof b=="string"?[b]:b;return Vf(_,l(f,_))});S1(n,{...d.box,titles:m,opacity:lt(d.box.opacity,c)},r)}for(let g of d.labels){let m=d.rect;if(g.clip&&!(g.x>=m.x-.5&&g.x<=m.x+m.w+.5&&g.y>=m.y-.5&&g.y<=m.y+m.h+.5))continue;let y=typeof g.layer.text=="string"?[g.layer.text]:g.layer.text;v1(n,g.layer,Vf(y,l(f,y)),g.x,g.y,r,c)}n.restore()}}for(let f of t.overlays??[])if(f.kind==="legend")M1(n,f,o,a,r,c);else if(f.kind==="text"){let d=typeof f.text=="string"?[f.text]:f.text;Fa(n,u===null?"":Vf(d,l(u,d)),f.at[0]*o,f.at[1]*a,s0(f,r,c))}}function Vf(n,e){return e.map((t,i)=>{let r=n[i];return typeof r=="object"&&r!==null&&"sub"in r?{text:t,shift:"sub"}:typeof r=="object"&&r!==null&&"sup"in r?{text:t,shift:"sup"}:{text:t}})}function Oa(n){return typeof n=="string"?[{text:n}]:n.map(e=>typeof e=="string"?{text:e}:"sub"in e?{text:e.sub,shift:"sub"}:{text:e.sup,shift:"sup"})}function E1(n,e){let[t,i,r,s]=n,o=[(t[0]+r[0])/2,(t[1]+r[1])/2],a=[(i[0]-t[0])/2,(i[1]-t[1])/2],l=[(s[0]-t[0])/2,(s[1]-t[1])/2];for(let c of[0,1]){let u=2*(Math.abs(a[c])+Math.abs(l[c]));u>=e||(u>0?(a[c]*=e/u,l[c]*=e/u):(Math.hypot(...a)<Math.hypot(...l)?a:l)[c]=e/2)}return[[o[0]-a[0]-l[0],o[1]-a[1]-l[1]],[o[0]+a[0]-l[0],o[1]+a[1]-l[1]],[o[0]+a[0]+l[0],o[1]+a[1]+l[1]],[o[0]-a[0]+l[0],o[1]-a[1]+l[1]]]}function T1(n,e,t,i,r,s){let o=0,a=1,l=e[0]-n[0],c=e[1]-n[1];for(let[u,h]of[[-l,n[0]-t],[l,i-n[0]],[-c,n[1]-r],[c,s-n[1]]])if(u===0){if(h<0)return null}else{let f=h/u;u<0?o=Math.max(o,f):a=Math.min(a,f)}return o<=a?[o,a]:null}function A1(n,e,t,i){let r=n.length,s=[],o=0,a=[];for(let d=0;d<r;d++){let p=n[d],g=n[(d+1)%r],m=Math.hypot(g[0]-p[0],g[1]-p[1]);s.push(o);let y=T1(p,g,-16,e+16,-16,t+16);if(y!==null&&m>0){let b=a[a.length-1],_=o+y[0]*m;b!==void 0&&_-b[1]<1e-9*Math.max(1,_)?b[1]=o+y[1]*m:a.push([_,o+y[1]*m])}o+=m}let l=o;if(!(l>0)||!Number.isFinite(l))return{closed:!1,paths:[]};if(a.length===1&&a[0][0]===0&&a[0][1]>=l*(1-1e-12)&&i===void 0)return{closed:!0,paths:[n.map(d=>[d[0],d[1]])]};let u=d=>{let p=r-1;for(;p>0&&s[p]>d;)p--;let g=n[p],m=n[(p+1)%r],y=(p+1<r?s[p+1]:l)-s[p],b=y>0?(d-s[p])/y:0;return[g[0]+b*(m[0]-g[0]),g[1]+b*(m[1]-g[1])]},h=(d,p)=>{let g=[u(d)];for(let m=1;m<r;m++)s[m]>d&&s[m]<p&&g.push(n[m]);return g.push(u(p)),g},f=[];for(let[d,p]of a){if(i===void 0){f.push(h(d,p));continue}let g=i[0]+i[1];for(let m=Math.floor(d/g);m*g<p;m++){let y=Math.max(d,m*g),b=Math.min(p,m*g+i[0]);b>y&&f.push(h(y,b))}}return{closed:!1,paths:f}}function C1(n,e,t,i=[]){let r=n.filter((u,h)=>h===0||Math.hypot(u[0]-n[h-1][0],u[1]-n[h-1][1])>1e-9);e&&r.length>1&&Math.hypot(r[0][0]-r[r.length-1][0],r[0][1]-r[r.length-1][1])<=1e-9&&r.pop();let s=r.length;if(s<2)return i;let o=t/2,a=(u,h)=>{let f=Math.hypot(h[0]-u[0],h[1]-u[1]);return[-(h[1]-u[1])/f,(h[0]-u[0])/f]},l=[];for(let u=0;u<s;u++){let h=e||u>0?a(r[(u-1+s)%s],r[u]):null,f=e||u<s-1?a(r[u],r[(u+1)%s]):null;if(h===null||f===null){let y=h??f;l.push([y[0]*o,y[1]*o]);continue}let d=[h[0]+f[0],h[1]+f[1]],p=Math.hypot(d[0],d[1]),g=p>1e-9?[d[0]/p,d[1]/p]:f,m=o/Math.max(1/4,g[0]*f[0]+g[1]*f[1]);l.push([g[0]*m,g[1]*m])}let c=e?s:s-1;for(let u=0;u<c;u++){let h=(u+1)%s,[f,d,p,g]=[r[u],r[h],l[u],l[h]],m=[f[0]+p[0],f[1]+p[1]],y=[f[0]-p[0],f[1]-p[1]],b=[d[0]+g[0],d[1]+g[1]],_=[d[0]-g[0],d[1]-g[1]];i.push(...m,...y,...b,...y,..._,...b)}return i}function a0(n,e,t,i){let{closed:r,paths:s}=A1(E1(n,i.minSize),e,t,i.dash),o=[];for(let a of s)C1(a,r,i.width,o);return o}var l0=`
vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
vec2 conformalExp(vec2 s, float alpha, float period) {
  float denomA = (1.0 - alpha) * period + alpha;
  vec2 w = alpha * period * s;
  if (alpha < 1e-4 || length(w) < 1e-3) {
    vec2 sScaled = (period / denomA) * s;
    vec2 t2 = vec2(1.0 / 6.0, 0.0) + w / 24.0;
    vec2 t1 = vec2(0.5, 0.0) + cmul(w, t2);
    vec2 series = vec2(1.0, 0.0) + cmul(w, t1);
    return vec2(alpha, 0.0) + cmul(sScaled, series);
  }
  float cAlpha = alpha * denomA;
  float ex = exp(clamp(w.x, -40.0, 40.0));
  vec2 ez = ex * vec2(cos(w.y), sin(w.y));
  return vec2(alpha + (ez.x - 1.0) / cAlpha, ez.y / cAlpha);
}
`,R1=`
attribute vec2 aParam;
uniform vec4 uRange;
uniform float uAlpha;
uniform float uPeriod;
uniform float uZ;
varying vec2 vBase;
${l0}
void main() {
  float u = mix(uRange.x, uRange.y, aParam.x);
  float v = mix(uRange.z, uRange.w, aParam.y);
  vBase = vec2(u, v);
  vec2 p = conformalExp(vBase, uAlpha, uPeriod);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, uZ, 1.0);
}
`,P1=`
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uReveal;
uniform vec2 uOrigin;
uniform float uMaxRadius;
varying vec2 vBase;
void main() {
  float alpha = uOpacity;
  if (uReveal < 0.999) {
    if (uReveal <= 0.0) discard;
    float d = length(vBase - uOrigin);
    float r = uReveal * uMaxRadius;
    float fw = max(fwidth(d) * 1.5, 0.015);
    float mask = 1.0 - smoothstep(r - fw, r + fw, d);
    if (mask <= 0.001) discard;
    alpha *= mask;
  }
  gl_FragColor = vec4(uColor, alpha);
}
`,L1=`
attribute float aSide;
attribute float aEnd;
attribute vec2 aT;
attribute vec2 aDist;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uAlpha;
uniform float uPeriod;
uniform float uReveal;
uniform float uWidth;
uniform vec2 uResolution;
uniform float uDashed;
varying float vDist;
${l0}
void main() {
  if (aT.x >= uReveal) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vDist = 0.0;
    return;
  }
  float t0 = aT.x;
  float t1 = min(aT.y, uReveal);
  if (t1 <= t0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vDist = 0.0;
    return;
  }
  vec2 p0 = conformalExp(mix(uFrom, uTo, t0), uAlpha, uPeriod);
  vec2 p1 = conformalExp(mix(uFrom, uTo, t1), uAlpha, uPeriod);
  vec4 clip0 = projectionMatrix * modelViewMatrix * vec4(p0, 0.001, 1.0);
  vec4 clip1 = projectionMatrix * modelViewMatrix * vec4(p1, 0.001, 1.0);
  if (clip0.w <= 0.0 && clip1.w <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vDist = 0.0;
    return;
  }
  vec2 halfRes = max(0.5 * uResolution, vec2(1.0));
  vec2 ndc0 = clip0.xy / clip0.w;
  vec2 ndc1 = clip1.xy / clip1.w;
  vec2 px0 = ndc0 * halfRes;
  vec2 px1 = ndc1 * halfRes;
  vec2 delta = px1 - px0;
  float segPx = length(delta);
  vec2 dir = segPx > 1e-6 ? delta / segPx : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  vec4 clip = mix(clip0, clip1, aEnd);
  float overlap = uDashed > 0.5 ? 0.0 : (aEnd * 2.0 - 1.0) * 0.35 * uWidth;
  vec2 pxOff = perp * (aSide * 0.5 * uWidth) + dir * overlap;
  clip.xy += (pxOff / halfRes) * clip.w;
  gl_Position = clip;
  float frac = (mix(t0, t1, aEnd) - aT.x) / max(1e-6, aT.y - aT.x);
  // Estimate CSS pixels per world unit at this point for consistent dash cadence
  vec4 clipO = projectionMatrix * modelViewMatrix * vec4(p0, 0.001, 1.0);
  vec4 clipX = projectionMatrix * modelViewMatrix * vec4(p0 + vec2(0.05, 0.0), 0.001, 1.0);
  vec4 clipY = projectionMatrix * modelViewMatrix * vec4(p0 + vec2(0.0, 0.05), 0.001, 1.0);
  float scaleX = length((clipX.xy / clipX.w - clipO.xy / clipO.w) * halfRes) / 0.05;
  float scaleY = length((clipY.xy / clipY.w - clipO.xy / clipO.w) * halfRes) / 0.05;
  float pxPerUnit = max(1.0, 0.5 * (scaleX + scaleY));
  vDist = mix(aDist.x, aDist.y, frac) * pxPerUnit;
}
`,I1=`
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
uniform vec2 uDash;
varying float vDist;
void main() {
  float cycle = uDash.x + uDash.y;
  if (cycle > 0.0 && mod(vDist, cycle) > uDash.x) discard;
  gl_FragColor = vec4(uColor, uOpacity);
}
`;function k1(n,e){let t=n+1,i=e+1,r=t*i,s=new Float32Array(r*3),o=new Float32Array(r*2),a=0;for(let u=0;u<i;u++){let h=u/e;for(let f=0;f<t;f++){let d=f/n;o[a++]=d,o[a++]=h}}let l=[];for(let u=0;u<e;u++)for(let h=0;h<n;h++){let f=u*t+h,d=f+1,p=f+t,g=p+1;l.push(f,d,g,f,g,p)}let c=new ft;return c.setAttribute("position",new Qe(s,3)),c.setAttribute("aParam",new Qe(o,2)),c.setIndex(l),c}function D1(n,e){let t=Math.max(1,n-1),i=new Mr;i.instanceCount=t;let r=new Float32Array(12),s=[0,1,2,1,3,2];i.setAttribute("position",new Qe(r,3)),i.setAttribute("aSide",new Qe(new Float32Array([-1,1,-1,1]),1)),i.setAttribute("aEnd",new Qe(new Float32Array([0,0,1,1]),1)),i.setIndex(s);let o=new Float32Array(t*2);for(let c=0;c<t;c++)o[2*c]=c/t,o[2*c+1]=(c+1)/t;i.setAttribute("aT",new as(o,2));let a=null,l=null;return e?(l=new Float32Array(t*2),a=new as(l,2).setUsage(vn),i.setAttribute("aDist",a)):i.setAttribute("aDist",new as(new Float32Array(t*2),2)),{geometry:i,distAttr:a,distArr:l}}var po=class{key;group=new Zt;entries=[];layer;lastAlpha=0;lastPeriod=1;constructor(e,t,i){this.key=i,this.layer=t;let r=e.theme.foreground;for(let s of t.items){let o=et(Ut(s.color??r,e.theme));if(s.kind==="region"){let[a,l]=s.samples??[24,24],c=k1(Math.max(1,a),Math.max(1,l)),u=new Rt({vertexShader:R1,fragmentShader:P1,transparent:!0,depthWrite:!1,side:Pt,uniforms:{uRange:{value:new ct(0,1,0,1)},uAlpha:{value:0},uPeriod:{value:1},uZ:{value:-.004},uColor:{value:new Fe(o[0],o[1],o[2])},uOpacity:{value:1},uReveal:{value:1},uOrigin:{value:new Me(0,0)},uMaxRadius:{value:1}}}),h=new bt(c,u);h.frustumCulled=!1,this.group.add(h),this.entries.push({kind:"region",item:s,mesh:h,geometry:c,material:u,u0:0,u1:1,v0:0,v1:1})}else{let a=Math.max(2,s.samples??64),l=s.dash,{geometry:c,distAttr:u,distArr:h}=D1(a,l!==void 0),f=new Rt({vertexShader:L1,fragmentShader:I1,transparent:!0,depthWrite:!1,side:Pt,uniforms:{uFrom:{value:new Me(0,0)},uTo:{value:new Me(1,0)},uAlpha:{value:0},uPeriod:{value:1},uReveal:{value:1},uWidth:{value:s.width??2},uResolution:{value:new Me(800,600)},uDashed:{value:l!==void 0?1:0},uDash:{value:new Me(l?.[0]??0,l?.[1]??0)},uColor:{value:new Fe(o[0],o[1],o[2])},uOpacity:{value:1}}}),d=new bt(c,f);d.frustumCulled=!1,this.group.add(d),this.entries.push({kind:"line",item:s,mesh:d,geometry:c,material:f,samples:a,distAttr:u,distArr:h,lastAlpha:Number.NaN,lastPeriod:Number.NaN,from:[0,0],to:[1,0]})}}}update(e,t){let i=Ht(e.clock,e.q),r=lt(t.opacity,i,1),s=lt(t.alpha,i,0),o=ai(e.scope,t.period,"morph",!0,"a morph period");if(this.lastAlpha=s,this.lastPeriod=o,this.group.visible=r>0,!(r<=0))for(let a of this.entries){let l=a.item.visible;if(l!==void 0&&$e(e.scope.scene,l.input)?.kind==="toggle"&&Tt(e.scope,l.input)===!1){a.mesh.visible=!1;continue}let c=lt(a.item.opacity,i,1)*r;if(c<=0){a.mesh.visible=!1;continue}a.mesh.visible=!0;let u=a.material.uniforms;if(u.uAlpha.value=s,u.uPeriod.value=o,u.uOpacity.value=c,a.kind==="region"){let h=lt(a.item.reveal,i,1);if(h<=0){a.mesh.visible=!1;continue}a.u0=Yt(a.item.u[0],o),a.u1=Yt(a.item.u[1],o),a.v0=Yt(a.item.v[0],o),a.v1=Yt(a.item.v[1],o);let f=a.item.reveal_origin,d=f!==void 0?Yt(f[0],o):.5*(a.u0+a.u1),p=f!==void 0?Yt(f[1],o):.5*(a.v0+a.v1),g=Math.max(Math.hypot(a.u0-d,a.v0-p),Math.hypot(a.u0-d,a.v1-p),Math.hypot(a.u1-d,a.v0-p),Math.hypot(a.u1-d,a.v1-p))+.04;u.uRange.value.set(a.u0,a.u1,a.v0,a.v1),u.uReveal.value=h,u.uOrigin.value.set(d,p),u.uMaxRadius.value=g}else{let h=lt(a.item.reveal,i,1);if(u.uReveal.value=h,h<=0){a.mesh.visible=!1;continue}let f=Yt(a.item.from[0],o),d=Yt(a.item.from[1],o),p=Yt(a.item.to[0],o),g=Yt(a.item.to[1],o),m=f!==a.from[0]||d!==a.from[1]||p!==a.to[0]||g!==a.to[1];if(a.from=[f,d],a.to=[p,g],u.uFrom.value.set(f,d),u.uTo.value.set(p,g),a.distArr!==null&&a.distAttr!==null&&(m||s!==a.lastAlpha||o!==a.lastPeriod)){a.lastAlpha=s,a.lastPeriod=o;let y=a.samples-1,b=0,[_,x]=rr(f,d,s,o);for(let S=0;S<y;S++){let w=(S+1)/y,[v,T]=rr(f+w*(p-f),d+w*(g-d),s,o),P=Math.hypot(v-_,T-x);a.distArr[2*S]=b,b+=P,a.distArr[2*S+1]=b,_=v,x=T}a.distAttr.needsUpdate=!0}}}}extend(e){let t=new O;for(let i of this.entries)if(i.mesh.visible)if(i.kind==="region")for(let s=0;s<5;s++){let o=i.v0+s/4*(i.v1-i.v0);for(let a=0;a<5;a++){let l=i.u0+a/4*(i.u1-i.u0),[c,u]=rr(l,o,this.lastAlpha,this.lastPeriod);e.expandByPoint(t.set(c,u,0))}}else for(let s=0;s<17;s++){let o=s/16,a=i.from[0]+o*(i.to[0]-i.from[0]),l=i.from[1]+o*(i.to[1]-i.from[1]),[c,u]=rr(a,l,this.lastAlpha,this.lastPeriod);e.expandByPoint(t.set(c,u,0))}}resize(e,t){for(let i of this.entries)i.kind==="line"&&i.material.uniforms.uResolution.value.set(e,t)}dispose(){for(let e of this.entries)e.geometry.dispose(),e.material.dispose()}};var p0="#b06ef3",m0="#f0a050",N1="#5b9bd5",g0=`
uniform int uMode;
uniform int uNPoles;
uniform int uNZeros;
uniform vec2 uSPoles[6];
uniform vec2 uSZeros[5];
uniform float uGain;
uniform vec2 uZPoles[6];
uniform vec2 uZNum[7];
uniform float uZScaleInv;
uniform float uScaleMode;
uniform float uUseClamp;
uniform float uClampMax;
uniform float uClampSoft;
uniform float uHeightScale;
uniform float uGrow;
uniform vec2 uCellSize;
uniform vec2 uDomainMin;
uniform vec2 uDomainMax;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

float evalMag(vec2 xy) {
  if (uMode == 1) {
    vec2 num = vec2(uGain, 0.0);
    for (int k = 0; k < 5; k++) {
      if (k >= uNZeros) break;
      num = cmul(num, xy - uSZeros[k]);
    }
    vec2 den = vec2(1.0, 0.0);
    for (int k = 0; k < 6; k++) {
      if (k >= uNPoles) break;
      den = cmul(den, xy - uSPoles[k]);
    }
    float aNum = length(num);
    float aDen = length(den);
    if (aDen < 1e-12 * max(1.0, aNum)) return aNum < 1e-12 ? 0.0 : 1e6;
    return aNum / aDen;
  }
  vec2 zs = xy * uZScaleInv;
  vec2 num = vec2(0.0);
  for (int r = 6; r >= 0; r--) {
    if (r <= uNPoles) num = cmul(num, zs) + uZNum[r];
  }
  vec2 den = vec2(1.0, 0.0);
  for (int k = 0; k < 6; k++) {
    if (k >= uNPoles) break;
    den = cmul(den, zs - uZPoles[k]);
  }
  float aNum = length(num);
  float aDen = length(den);
  if (aDen < 1e-12 * max(1.0, aNum)) return aNum < 1e-12 ? 0.0 : 1e6;
  return aNum / aDen;
}

float mapH(float mag) {
  float raw = uScaleMode > 0.5 ? log(1.0 + max(mag, 0.0)) : mag;
  float val = raw;
  if (uUseClamp > 0.5) {
    float t = (uClampMax - raw) / uClampSoft;
    float sp = t > 0.0 ? t + log(1.0 + exp(-t)) : log(1.0 + exp(t));
    val = max(0.0, uClampMax - uClampSoft * sp);
  }
  return val * uHeightScale * uGrow;
}
`,c0=`
invariant gl_Position;
attribute vec2 aXY;
varying float vHeight;
varying vec3 vNormal;
varying vec2 vWorldXY;
${g0}
void main() {
  vec2 xy = aXY;
  bool snapped = false;
  for (int k = 0; k < 6; k++) {
    if (k >= uNPoles) break;
    vec2 p = uMode == 1 ? uSPoles[k] : (uZPoles[k] / max(uZScaleInv, 1e-6));
    bool inside = p.x > uDomainMin.x + 0.5 * uCellSize.x && p.x < uDomainMax.x - 0.5 * uCellSize.x &&
                  p.y > uDomainMin.y + 0.5 * uCellSize.y && p.y < uDomainMax.y - 0.5 * uCellSize.y;
    vec2 d = aXY - p;
    if (inside && d.x >= -0.5 * uCellSize.x && d.x < 0.5 * uCellSize.x &&
                  d.y >= -0.5 * uCellSize.y && d.y < 0.5 * uCellSize.y) {
      xy = p;
      snapped = true;
      break;
    }
  }
  float h = mapH(evalMag(xy));
  if (snapped) {
    vNormal = vec3(0.0, 0.0, 1.0);
  } else {
    float eps = 0.015;
    float hxp = mapH(evalMag(xy + vec2(eps, 0.0)));
    float hxm = mapH(evalMag(xy - vec2(eps, 0.0)));
    float hyp = mapH(evalMag(xy + vec2(0.0, eps)));
    float hym = mapH(evalMag(xy - vec2(0.0, eps)));
    float dhdx = (hxp - hxm) / (2.0 * eps);
    float dhdy = (hyp - hym) / (2.0 * eps);
    vNormal = normalize(vec3(-dhdx, -dhdy, 1.0));
  }
  vHeight = h;
  vWorldXY = xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(xy, h + 0.012, 1.0);
}
`,u0=`
invariant gl_Position;
attribute float aVal;
attribute vec4 aNeighbors;
uniform vec2 uGridStep;
uniform float uScaleMode;
uniform float uUseClamp;
uniform float uClampMax;
uniform float uClampSoft;
uniform float uHeightScale;
uniform float uGrow;
varying float vHeight;
varying vec3 vNormal;
varying vec2 vWorldXY;

float mapGridH(float rawIn) {
  float raw = uScaleMode > 0.5 ? log(1.0 + max(rawIn, 0.0)) : rawIn;
  float val = raw;
  if (uUseClamp > 0.5) {
    float t = (uClampMax - raw) / uClampSoft;
    float sp = t > 0.0 ? t + log(1.0 + exp(-t)) : log(1.0 + exp(t));
    val = max(0.0, uClampMax - uClampSoft * sp);
  }
  return val * uHeightScale * uGrow;
}

void main() {
  float h = mapGridH(aVal);
  float hL = mapGridH(aNeighbors.x);
  float hR = mapGridH(aNeighbors.y);
  float hD = mapGridH(aNeighbors.z);
  float hU = mapGridH(aNeighbors.w);
  float dhdx = (hR - hL) / max(1e-6, uGridStep.x);
  float dhdy = (hU - hD) / max(1e-6, uGridStep.y);
  vNormal = normalize(vec3(-dhdx, -dhdy, 1.0));
  vHeight = h;
  vWorldXY = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, h + 0.012, 1.0);
}
`,O1=`
precision highp float;
uniform sampler2D uRamp;
uniform float uColorLo;
uniform float uColorHi;
uniform float uOpacity;
uniform vec2 uGrooveStep;
uniform vec3 uGrooveColor;
uniform float uGrooveOpacity;
varying float vHeight;
varying vec3 vNormal;
varying vec2 vWorldXY;
void main() {
  float span = uColorHi - uColorLo;
  float t = abs(span) > 1e-6 ? clamp((vHeight - uColorLo) / span, 0.0, 1.0) : 0.0;
  vec3 col = texture2D(uRamp, vec2(t, 0.5)).rgb;
  vec3 lightDir = normalize(vec3(0.45, 0.55, 0.72));
  float shade = 0.58 + 0.42 * abs(dot(normalize(vNormal), lightDir));
  col *= shade;
  if (uGrooveOpacity > 0.0) {
    vec2 coord = vWorldXY / max(uGrooveStep, vec2(1e-4));
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), vec2(1e-4));
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    col = mix(col, uGrooveColor, line * uGrooveOpacity);
  }
  gl_FragColor = vec4(col, uOpacity);
}
`,F1=`
precision highp float;
${g0}
uniform sampler2D uRamp;
uniform float uColorLo;
uniform float uColorHi;
uniform float uOpacity;
uniform float uCutout;
uniform vec2 uGrooveStep;
uniform vec3 uGrooveColor;
uniform float uGrooveOpacity;
varying float vHeight;
varying vec3 vNormal;
varying vec2 vWorldXY;
void main() {
  float mag = evalMag(vWorldXY);
  float h = mapH(mag);
  float eps = 0.008;
  float hxp = mapH(evalMag(vWorldXY + vec2(eps, 0.0)));
  float hxm = mapH(evalMag(vWorldXY - vec2(eps, 0.0)));
  float hyp = mapH(evalMag(vWorldXY + vec2(0.0, eps)));
  float hym = mapH(evalMag(vWorldXY - vec2(0.0, eps)));
  vec3 nrm;
  if (mag >= 1e5 || (abs(hxp - h) < 1e-4 && abs(hxm - h) < 1e-4 && abs(hyp - h) < 1e-4 && abs(hym - h) < 1e-4 && h > 0.5 * uClampMax * uHeightScale * uGrow)) {
    nrm = vec3(0.0, 0.0, 1.0);
  } else {
    float dhdx = (hxp - hxm) / (2.0 * eps);
    float dhdy = (hyp - hym) / (2.0 * eps);
    nrm = normalize(vec3(-dhdx, -dhdy, 1.0));
  }
  float hColor = max(h, vHeight);
  float span = uColorHi - uColorLo;
  float t = abs(span) > 1e-6 ? clamp((hColor - uColorLo) / span, 0.0, 1.0) : 0.0;
  vec3 col = texture2D(uRamp, vec2(t, 0.5)).rgb;
  vec3 lightDir = normalize(vec3(0.45, 0.55, 0.72));
  float shade = 0.58 + 0.42 * abs(dot(nrm, lightDir));
  col *= shade;
  if (uGrooveOpacity > 0.0) {
    vec2 coord = vWorldXY / max(uGrooveStep, vec2(1e-4));
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), vec2(1e-4));
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    col = mix(col, uGrooveColor, line * uGrooveOpacity);
  }
  float alpha = uOpacity;
  if (uCutout > 0.001) {
    float cutDist = uMode == 1 ? vWorldXY.x : (length(vWorldXY) - 1.0);
    if (cutDist > 0.0) {
      float fw = max(fwidth(cutDist), 1e-4);
      float edge = smoothstep(0.0, fw, cutDist);
      float keep = 1.0 - edge * uCutout;
      if (keep <= 0.002) discard;
      alpha *= keep;
    }
  }
  gl_FragColor = vec4(col, alpha);
}
`,U1=`
precision highp float;
void main() {
  gl_FragColor = vec4(0.0);
}
`,B1=`
precision highp float;
uniform int uMode;
uniform float uCutout;
varying vec2 vWorldXY;
void main() {
  if (uCutout > 0.05) {
    float cutDist = uMode == 1 ? vWorldXY.x : (length(vWorldXY) - 1.0);
    if (cutDist > 0.0) discard;
  }
  gl_FragColor = vec4(0.0);
}
`,z1=`
varying vec2 vXY;
void main() {
  vXY = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,H1=`
precision highp float;
uniform int uMode;
uniform float uThreshold;
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vXY;
void main() {
  float signedDist = uMode == 1 ? (vXY.x - uThreshold) : (length(vXY) - uThreshold);
  float fw = max(fwidth(signedDist), 1e-4);
  float fill = smoothstep(-fw, fw, signedDist);
  float edge = 1.0 - smoothstep(0.0, 1.8 * fw, abs(signedDist));
  float alpha = max(fill * uOpacity, edge * min(1.0, uOpacity * 2.4));
  if (alpha < 0.002) discard;
  vec3 col = mix(uColor, min(vec3(1.0), uColor * 1.25), edge);
  gl_FragColor = vec4(col, alpha);
}
`,Yf=`
attribute float aArc;
varying float vArc;
void main() {
  vArc = aArc;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,h0=`
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDiverges;
varying float vArc;
void main() {
  if (uDiverges > 0.5 && mod(vArc, 0.24) > 0.13) discard;
  gl_FragColor = vec4(uColor, uOpacity);
}
`,V1=`
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
}
`;function G1(n){let t=new Uint8Array(1024);for(let r=0;r<256;r++){let[s,o,a]=Oi(n,r/255);t[4*r]=Math.round(s*255),t[4*r+1]=Math.round(o*255),t[4*r+2]=Math.round(a*255),t[4*r+3]=255}let i=new xr(t,256,1,kn,In);return i.minFilter=un,i.magFilter=un,i.wrapS=jn,i.wrapT=jn,i.needsUpdate=!0,i}function d0(n,e,t,i,r,s){let o=r*s,a=new Float32Array(o*3),l=new Float32Array(o*2),c=0,u=0;for(let p=0;p<s;p++){let g=t+p/(s-1)*(i-t);for(let m=0;m<r;m++){let y=n+m/(r-1)*(e-n);a[c++]=y,a[c++]=g,a[c++]=0,l[u++]=y,l[u++]=g}}let h=new Uint32Array((r-1)*(s-1)*6),f=0;for(let p=0;p<s-1;p++)for(let g=0;g<r-1;g++){let m=p*r+g,y=m+1,b=m+r,_=b+1;h[f++]=m,h[f++]=y,h[f++]=_,h[f++]=m,h[f++]=_,h[f++]=b}let d=new ft;return d.setAttribute("position",new Qe(a,3)),d.setAttribute("aXY",new Qe(l,2)),d.setIndex(new Qe(h,1)),d}function $1(n,e,t){let i=e*t,r=new Float32Array(i),s=new Float32Array(i*4);for(let o=0;o<t;o++){let a=Math.max(0,o-1),l=Math.min(t-1,o+1);for(let c=0;c<e;c++){let u=Math.max(0,c-1),h=Math.min(e-1,c+1),f=o*e+c;r[f]=n[f],s[4*f]=n[o*e+u],s[4*f+1]=n[o*e+h],s[4*f+2]=n[a*e+c],s[4*f+3]=n[l*e+c]}}return{vals:r,neighbors:s}}function f0(n,e){return n<e-1e-4?et(p0):n>e+1e-4?et(m0):et(N1)}var ms=256,mo=256,go=class{key;group=new Zt;layer;domain;maxBoxHeight;rampTex;surfaceGeo;surfaceMat;surfaceMesh;depthMat=null;depthMesh=null;rocMesh=null;rocMat=null;contCurtainGeo=null;contCurtainPos=null;contCurtainMat=null;contCurtainMesh=null;contLineGeo=null;contLinePos=null;contLineArc=null;contLineMat=null;contLineMesh=null;stemGeo=null;stemPos=null;stemMat=null;stemMesh=null;stemDots=null;poleSprites=null;zeroSprites=null;lastSystemKey="";lastContKey="";lastDiscKey="";cachedSigmaMax=0;cachedRMax=1;cachedConverges=!0;cachedZPoles=[];cachedZNum=[];constructor(e,t,i){this.key=i,this.layer=t;let r=t.source,[s,o]=r.x,[a,l]=r.y;this.domain=[s,o,a,l],this.maxBoxHeight=(t.clamp?.max??4)*(t.height_scale??1);let c=t.colormap??"cividis";this.rampTex=G1(c);let u=et(Ut(t.grooves?.color??e.theme.background,e.theme)),h=t.grooves?.step??[.5,.5],f=t.grooves?.opacity??0,d=t.color_range??[0,this.maxBoxHeight],p=t.height_scale??1,g=t.clamp!==void 0?1:0,m=t.clamp?.max??1,y=t.clamp?.softness??1;if(r.kind==="grid"){let w=e.geometry.data.array(r.array),[v,T]=[w.shape[0],w.shape[1]];this.surfaceGeo=d0(s,o,a,l,T,v);let{vals:P,neighbors:C}=$1(w.data,T,v);this.surfaceGeo.setAttribute("aVal",new Qe(P,1)),this.surfaceGeo.setAttribute("aNeighbors",new Qe(C,4));let I={uGridStep:{value:new Me(2*(o-s)/Math.max(1,T-1),2*(l-a)/Math.max(1,v-1))},uScaleMode:{value:0},uUseClamp:{value:g},uClampMax:{value:m},uClampSoft:{value:y},uHeightScale:{value:p},uGrow:{value:1},uRamp:{value:this.rampTex},uColorLo:{value:d[0]},uColorHi:{value:d[1]},uOpacity:{value:1},uGrooveStep:{value:new Me(h[0],h[1])},uGrooveColor:{value:new Fe(u[0],u[1],u[2])},uGrooveOpacity:{value:f}};this.surfaceMat=new Rt({vertexShader:u0,fragmentShader:O1,uniforms:I,transparent:!0,depthWrite:!0,side:Pt}),this.depthMat=new Rt({vertexShader:u0,fragmentShader:U1,uniforms:I,transparent:!0,colorWrite:!1,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:4,side:Pt}),this.depthMesh=new bt(this.surfaceGeo,this.depthMat),this.depthMesh.frustumCulled=!1,this.depthMesh.visible=!1,this.group.add(this.depthMesh),this.surfaceMesh=new bt(this.surfaceGeo,this.surfaceMat),this.surfaceMesh.frustumCulled=!1,this.group.add(this.surfaceMesh);return}let[b,_]=r.resolution??[128,128];this.surfaceGeo=d0(s,o,a,l,b,_);let x=w=>Array.from({length:w},()=>new Me(0,0)),S={uMode:{value:r.kind==="rational_s"?1:2},uNPoles:{value:1},uNZeros:{value:0},uSPoles:{value:x(6)},uSZeros:{value:x(5)},uGain:{value:1},uZPoles:{value:x(6)},uZNum:{value:x(7)},uZScaleInv:{value:1},uScaleMode:{value:0},uUseClamp:{value:g},uClampMax:{value:m},uClampSoft:{value:y},uHeightScale:{value:p},uGrow:{value:1},uCellSize:{value:new Me((o-s)/Math.max(1,b-1),(l-a)/Math.max(1,_-1))},uDomainMin:{value:new Me(s,a)},uDomainMax:{value:new Me(o,l)},uRamp:{value:this.rampTex},uColorLo:{value:d[0]},uColorHi:{value:d[1]},uOpacity:{value:1},uCutout:{value:0},uGrooveStep:{value:new Me(h[0],h[1])},uGrooveColor:{value:new Fe(u[0],u[1],u[2])},uGrooveOpacity:{value:f}};if(t.roc!==void 0){let w=et(t.roc.color??p0),v=new qi(o-s,l-a);v.translate(.5*(s+o),.5*(a+l),.002),this.rocMat=new Rt({vertexShader:z1,fragmentShader:H1,transparent:!0,depthWrite:!1,side:Pt,uniforms:{uMode:{value:r.kind==="rational_s"?1:2},uThreshold:{value:0},uColor:{value:new Fe(w[0],w[1],w[2])},uOpacity:{value:.18}}}),this.rocMesh=new bt(v,this.rocMat),this.rocMesh.frustumCulled=!1,this.group.add(this.rocMesh)}if(this.surfaceMat=new Rt({vertexShader:c0,fragmentShader:F1,uniforms:S,transparent:!0,depthWrite:!0,side:Pt}),this.depthMat=new Rt({vertexShader:c0,fragmentShader:B1,uniforms:S,transparent:!0,colorWrite:!1,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:4,side:Pt}),this.depthMesh=new bt(this.surfaceGeo,this.depthMat),this.depthMesh.frustumCulled=!1,this.depthMesh.visible=!1,this.group.add(this.depthMesh),this.surfaceMesh=new bt(this.surfaceGeo,this.surfaceMat),this.surfaceMesh.frustumCulled=!1,this.group.add(this.surfaceMesh),t.slices?.continuous!==void 0){let w=t.slices.continuous,v=et(w.color??"#38d0e8");this.contCurtainPos=new Float32Array(ms*2*3);let T=new Float32Array(ms*2),P=[];for(let I=0;I<ms-1;I++){let U=2*I,j=U+1,L=U+2,z=U+3;P.push(U,L,j,j,L,z)}this.contCurtainGeo=new ft,this.contCurtainGeo.setAttribute("position",new Qe(this.contCurtainPos,3).setUsage(vn)),this.contCurtainGeo.setAttribute("aArc",new Qe(T,1)),this.contCurtainGeo.setIndex(P),this.contCurtainMat=new Rt({vertexShader:Yf,fragmentShader:h0,transparent:!0,depthWrite:!1,side:Pt,uniforms:{uColor:{value:new Fe(v[0],v[1],v[2])},uOpacity:{value:.28},uDiverges:{value:0}}}),this.contCurtainMesh=new bt(this.contCurtainGeo,this.contCurtainMat),this.contCurtainMesh.frustumCulled=!1,this.group.add(this.contCurtainMesh),this.contLinePos=new Float32Array(ms*4*3),this.contLineArc=new Float32Array(ms*4);let C=[];for(let I=0;I<ms-1;I++){let U=4*I,j=U+1,L=U+4,z=U+5;C.push(U,j,L,j,z,L);let B=U+2,H=U+3,K=U+6,$=U+7;C.push(B,H,K,H,$,K)}this.contLineGeo=new ft,this.contLineGeo.setAttribute("position",new Qe(this.contLinePos,3).setUsage(vn)),this.contLineGeo.setAttribute("aArc",new Qe(this.contLineArc,1).setUsage(vn)),this.contLineGeo.setIndex(C),this.contLineMat=new Rt({vertexShader:Yf,fragmentShader:h0,transparent:!0,depthWrite:!1,side:Pt,uniforms:{uColor:{value:new Fe(v[0],v[1],v[2])},uOpacity:{value:1},uDiverges:{value:0}}}),this.contLineMesh=new bt(this.contLineGeo,this.contLineMat),this.contLineMesh.frustumCulled=!1,this.group.add(this.contLineMesh)}if(t.slices?.discrete!==void 0){let w=t.slices.discrete.color??"#5b9bd5",v=et(w);this.stemPos=new Float32Array(mo*8*3);let T=[];for(let P=0;P<mo;P++){let C=8*P;T.push(C,C+1,C+2,C+1,C+3,C+2),T.push(C+4,C+5,C+6,C+5,C+7,C+6)}this.stemGeo=new ft,this.stemGeo.setAttribute("position",new Qe(this.stemPos,3).setUsage(vn)),this.stemGeo.setIndex(T),this.stemMat=new Rt({vertexShader:Yf,fragmentShader:V1,transparent:!0,depthWrite:!1,side:Pt,uniforms:{uColor:{value:new Fe(v[0],v[1],v[2])},uOpacity:{value:.95}}}),this.stemMesh=new bt(this.stemGeo,this.stemMat),this.stemMesh.frustumCulled=!1,this.group.add(this.stemMesh),this.stemDots=new Ki({shape:"disc",color:w},8.5,!1),this.stemDots.grow(mo),this.stemDots.points.material.depthTest=!0,this.group.add(this.stemDots.points)}t.markers!==void 0&&(this.poleSprites=new Ki({shape:"cross"},12,!0),this.poleSprites.grow(6),this.group.add(this.poleSprites.points),this.zeroSprites=new Ki({shape:"ring",color:Ut(e.theme.foreground,e.theme)},11,!1),this.zeroSprites.grow(5),this.group.add(this.zeroSprites.points))}toggleVisible(e,t){return e===void 0?!0:$e(t.scope.scene,e.input)?.kind!=="toggle"||Tt(t.scope,e.input)!==!1}update(e,t){let i=Ht(e.clock,e.q),r=lt(t.opacity,i,1),s=lt(t.grow,i,1),o=t.scale,a=o===void 0?"linear":typeof o=="string"?o:String(Tt(e.scope,o.input)),l=a==="log"?1:0,c=this.surfaceMat.uniforms;c.uGrow.value=s,c.uScaleMode.value=l,c.uOpacity.value=r;let u=r>0;this.surfaceMesh.visible=u,this.depthMesh!==null&&(this.depthMesh.visible=u&&r<.999,this.surfaceMat.depthWrite=r>=.999);let h=t.source;if(h.kind==="grid")return;let f=$r(e.scope,h.poles,"surface",1,6,"a rational surface poles"),d=h.zeros!==void 0?$r(e.scope,h.zeros,"surface",0,5,"a rational surface zeros"):[],p=h.gain!==void 0?ai(e.scope,h.gain,"surface",!1,"a rational surface gain"):1,g=h.period!==void 0?ai(e.scope,h.period,"surface",!0,"a rational surface period"):1,m=`${f.map(v=>`${v[0]},${v[1]}`).join(";")}|${d.map(v=>`${v[0]},${v[1]}`).join(";")}|${p}|${g}`;if(m!==this.lastSystemKey){this.lastSystemKey=m,c.uNPoles.value=f.length,c.uNZeros.value=d.length,c.uGain.value=p;let v=c.uSPoles.value;for(let P=0;P<6;P++)v[P].set(f[P]?.[0]??0,f[P]?.[1]??0);let T=c.uSZeros.value;for(let P=0;P<5;P++)T[P].set(d[P]?.[0]??0,d[P]?.[1]??0);if(h.kind==="rational_s"){let P=Math.max(...f.map(C=>C[0]));this.cachedSigmaMax=P,this.cachedRMax=Math.exp(P*g),this.cachedConverges=P<-1e-9}else{let P=ll(f,d,p,g);this.cachedSigmaMax=P.sigma_max,this.cachedRMax=P.r_max,this.cachedConverges=P.converges,this.cachedZPoles=P.z_poles,this.cachedZNum=P.z_num;let C=1;for(let[L,z]of P.z_poles)C=Math.max(C,Math.hypot(L,z));c.uZScaleInv.value=1/C;let I=c.uZPoles.value;for(let L=0;L<6;L++){let z=P.z_poles[L];I[L].set(z!==void 0?z[0]/C:0,z!==void 0?z[1]/C:0)}let U=c.uZNum.value,j=f.length;for(let L=0;L<7;L++){let z=P.z_num[L];if(z!==void 0){let B=C**(j-L);U[L].set(z[0]/B,z[1]/B)}else U[L].set(0,0)}}}if(this.rocMesh!==null&&this.rocMat!==null&&t.roc!==void 0){let v=lt(t.roc.opacity,i,.18),T=this.toggleVisible(t.roc.visible,e)&&v>0;this.rocMesh.visible=T,T&&(this.rocMat.uniforms.uThreshold.value=h.kind==="rational_s"?this.cachedSigmaMax:this.cachedRMax,this.rocMat.uniforms.uOpacity.value=v)}let y=t.slices?.continuous,b=t.slices?.discrete,_=b!==void 0?b.count===void 0?16:typeof b.count=="number"?b.count:ai(e.scope,b.count,"surface",!0,"discrete slice count"):0,x=`${m}|${a}|${s}|${Math.round(_)}`,S=0,w=0;if(this.contCurtainMesh!==null&&this.contLineMesh!==null&&y!==void 0){let v=lt(y.opacity,i,1),T=this.toggleVisible(y.visible,e)&&v>0;if(S=T?v:0,this.contCurtainMesh.visible=T,this.contLineMesh.visible=T,T){let P=x!==this.lastContKey;P&&(this.lastContKey=x);let C=!this.cachedConverges,I=et(C?y.divergent_color??m0:y.color??"#38d0e8"),U=this.contCurtainMat.uniforms;U.uColor.value.setRGB(I[0],I[1],I[2]),U.uOpacity.value=.28*v,U.uDiverges.value=C?1:0;let j=this.contLineMat.uniforms;if(j.uColor.value.setRGB(I[0],I[1],I[2]),j.uOpacity.value=v,j.uDiverges.value=C?1:0,P&&this.contCurtainPos!==null&&this.contLinePos!==null&&this.contLineArc!==null){let[,,L,z]=this.domain,B=ms,H=.028,K=0,$=0,Y=0,q=0;for(let ae=0;ae<B;ae++){let Re=ae/(B-1),J=0,oe=0,_e=0,Le=1,ye=0;if(h.kind==="rational_s")oe=L+Re*(z-L),_e=Ro(f,d,p,0,oe);else{let Je=Re*2*Math.PI;J=Math.cos(Je),oe=Math.sin(Je),_e=Po(this.cachedZPoles,this.cachedZNum,J,oe),Le=J,ye=oe}let Ue=sr(_e,a==="log"?"log":"linear",t.clamp,t.height_scale??1,s);ae>0&&(K+=Math.hypot(J-$,oe-Y,Ue-q)),$=J,Y=oe,q=Ue;let _t=ae*6;this.contCurtainPos[_t]=J,this.contCurtainPos[_t+1]=oe,this.contCurtainPos[_t+2]=.008,this.contCurtainPos[_t+3]=J,this.contCurtainPos[_t+4]=oe,this.contCurtainPos[_t+5]=Ue+.024;let Ae=ae*12,rt=Ue+.028;this.contLinePos[Ae]=J-Le*H,this.contLinePos[Ae+1]=oe-ye*H,this.contLinePos[Ae+2]=rt,this.contLinePos[Ae+3]=J+Le*H,this.contLinePos[Ae+4]=oe+ye*H,this.contLinePos[Ae+5]=rt,this.contLinePos[Ae+6]=J,this.contLinePos[Ae+7]=oe,this.contLinePos[Ae+8]=Math.max(.012,rt-H),this.contLinePos[Ae+9]=J,this.contLinePos[Ae+10]=oe,this.contLinePos[Ae+11]=rt+H;let at=ae*4;this.contLineArc[at]=K,this.contLineArc[at+1]=K,this.contLineArc[at+2]=K,this.contLineArc[at+3]=K}this.contCurtainGeo.getAttribute("position").needsUpdate=!0,this.contLineGeo.getAttribute("position").needsUpdate=!0,this.contLineGeo.getAttribute("aArc").needsUpdate=!0}}}if(this.stemMesh!==null&&this.stemDots!==null&&b!==void 0){let v=lt(b.opacity,i,1),T=this.toggleVisible(b.visible,e)&&v>0;if(w=T?v:0,this.stemMesh.visible=T,this.stemDots.points.visible=T,T){let P=x!==this.lastDiscKey;if(P&&(this.lastDiscKey=x),this.stemMat.uniforms.uOpacity.value=.95*v,this.stemDots.setOpacity(v),P&&this.stemPos!==null&&this.stemGeo!==null){let C=Math.max(2,Math.min(mo,Math.round(_))),I=[],[,,U,j]=this.domain;if(h.kind==="rational_s"){let B=2*Math.PI/(C*g),H=Math.ceil(U/B-1e-9),K=Math.floor(j/B+1e-9);for(let $=H;$<=K&&I.length<mo;$++){let Y=$*B,q=Ro(f,d,p,0,Y),ae=sr(q,a==="log"?"log":"linear",t.clamp,t.height_scale??1,s);I.push([0,Y,ae])}}else for(let B=0;B<C&&I.length<mo;B++){let H=B/C*2*Math.PI,K=Math.cos(H),$=Math.sin(H),Y=Po(this.cachedZPoles,this.cachedZNum,K,$),q=sr(Y,a==="log"?"log":"linear",t.clamp,t.height_scale??1,s);I.push([K,$,q])}let L=.016,z=this.stemDots.position;for(let B=0;B<I.length;B++){let[H,K,$]=I[B],Y=Math.max(.024,$+.026),q=B*24;this.stemPos[q]=H-L,this.stemPos[q+1]=K,this.stemPos[q+2]=.008,this.stemPos[q+3]=H+L,this.stemPos[q+4]=K,this.stemPos[q+5]=.008,this.stemPos[q+6]=H-L,this.stemPos[q+7]=K,this.stemPos[q+8]=Y,this.stemPos[q+9]=H+L,this.stemPos[q+10]=K,this.stemPos[q+11]=Y,this.stemPos[q+12]=H,this.stemPos[q+13]=K-L,this.stemPos[q+14]=.008,this.stemPos[q+15]=H,this.stemPos[q+16]=K+L,this.stemPos[q+17]=.008,this.stemPos[q+18]=H,this.stemPos[q+19]=K-L,this.stemPos[q+20]=Y,this.stemPos[q+21]=H,this.stemPos[q+22]=K+L,this.stemPos[q+23]=Y,z.setXYZ(B,H,K,Y)}this.stemGeo.getAttribute("position").needsUpdate=!0,this.stemGeo.setDrawRange(0,I.length*12),this.stemDots.show(I.length)}}}if(c.uCutout.value=t.slices?.clip===!0?Math.min(1,Math.max(S,w)/.85):0,this.poleSprites!==null&&this.zeroSprites!==null&&t.markers!==void 0){let v=lt(t.markers.opacity,i,1);if(!(this.toggleVisible(t.markers.visible,e)&&v>0))this.poleSprites.points.visible=!1,this.zeroSprites.points.visible=!1;else{this.poleSprites.setOpacity(v),this.zeroSprites.setOpacity(v);let[P,C,I,U]=this.domain,j=this.poleSprites.position,L=this.poleSprites.color,z=0,B=h.kind==="rational_s"?f:this.cachedZPoles;for(let $=0;$<B.length;$++){let[Y,q]=B[$];if(Y<P-.5||Y>C+.5||q<I-.5||q>U+.5)continue;let[ae,Re,J]=h.kind==="rational_s"?f0(Y,0):f0(Math.hypot(Y,q),1);j.setXYZ(z,Y,q,.026),L.setXYZ(z,ae,Re,J),z++}this.poleSprites.show(z);let H=this.zeroSprites.position,K=0;if(h.kind==="rational_s")for(let[$,Y]of d)$<P-.5||$>C+.5||Y<I-.5||Y>U+.5||H.setXYZ(K++,$,Y,.026);else for(let[$,Y]of d){let q=Math.exp($*g),ae=q*Math.cos(Y*g),Re=q*Math.sin(Y*g);ae<P-.5||ae>C+.5||Re<I-.5||Re>U+.5||H.setXYZ(K++,ae,Re,.026)}this.zeroSprites.show(K)}}}extend(e){let[t,i,r,s]=this.domain;e.expandByPoint(new O(t,r,0)),e.expandByPoint(new O(i,s,this.maxBoxHeight))}dispose(){this.rampTex.dispose(),this.surfaceGeo.dispose(),this.surfaceMat.dispose(),this.depthMat?.dispose(),this.rocMesh!==null&&this.rocMesh.geometry.dispose(),this.rocMat?.dispose(),this.contCurtainGeo?.dispose(),this.contCurtainMat?.dispose(),this.contLineGeo?.dispose(),this.contLineMat?.dispose(),this.stemGeo?.dispose(),this.stemMat?.dispose(),this.stemDots?.dispose(),this.poleSprites?.dispose(),this.zeroSprites?.dispose()}};function y0(n){let e=new Map;for(let t of n){let i=JSON.stringify([t.label,t.gradient,t.lo,t.hi]),r=e.get(i);r===void 0?e.set(i,t):e.set(i,{...r,marker:r.marker??t.marker,band:r.band??t.band})}return[...e.values()]}function Xu(n,e,t){let i={panels:new Map,gutters:[]},r=(s,o,a)=>{if(s.kind==="panel"){i.panels.set(s.id,o);return}let l=s.dir==="row",c=s.ratio<=0||s.ratio>=1?0:t,u=Math.max(0,(l?o.w:o.h)-c),h=Math.round(u*Math.min(1,Math.max(0,s.ratio))),f=u-h;l?(r(s.a,{x:o.x,y:o.y,w:h,h:o.h},`${a}a`),c>0&&i.gutters.push({path:a,dir:s.dir,rect:{x:o.x+h,y:o.y,w:c,h:o.h},outer:o}),r(s.b,{x:o.x+h+c,y:o.y,w:f,h:o.h},`${a}b`)):(r(s.a,{x:o.x,y:o.y,w:o.w,h},`${a}a`),c>0&&i.gutters.push({path:a,dir:s.dir,rect:{x:o.x,y:o.y+h,w:o.w,h:c},outer:o}),r(s.b,{x:o.x,y:o.y+h+c,w:o.w,h:f},`${a}b`))};return r(n,e,""),i}function ju(n,e,t){return n.kind==="panel"?n:e===""?{...n,ratio:t}:e[0]==="a"?{...n,a:ju(n.a,e.slice(1),t)}:{...n,b:ju(n.b,e.slice(1),t)}}function b0(n,e,t,i){let r=n.outer,s=n.dir==="row"?e-r.x-i/2:t-r.y-i/2,o=Math.max(1,(n.dir==="row"?r.w:r.h)-i);return Math.min(.9,Math.max(.1,s/o))}var Qu=6,x0=9,W1=10,j1=.8,X1=8,q1=8,Y1=.25,J1=.35,eh="vec4(2.0, 2.0, 2.0, 1.0)",k0=`
attribute vec2 useg;
attribute float trajectory;
uniform highp sampler2D uRanges;
uniform highp sampler2D uAlphas;
uniform int uRangesWidth;
uniform int uKernel;
uniform float uRevolution;
uniform float uSkip;
uniform float uOpacity;
uniform float uFraction;
uniform float uTaperOpacity;
uniform float uFade;
ivec2 texelOf(float tr) {
  int t = int(tr + 0.5);
  return ivec2(t % uRangesWidth, t / uRangesWidth);
}
bool revealed(vec4 r) {
  bool lo = uRevolution > r.x || (uRevolution == r.x && r.y < useg.x);
  bool hi = uRevolution < r.z || (uRevolution == r.z && useg.y < r.w);
  return lo && hi && !(uSkip >= 0.0 && abs(trajectory - uSkip) < 0.5);
}
float along(vec4 r, float u) {
  if (uFraction <= 0.0) return 1.0;
  return clamp(1.0 - (r.z + r.w - (uRevolution + u)) / uFraction, 0.0, 1.0);
}
float alphaOf(float tr) {
  return uKernel == 1 ? texelFetch(uAlphas, texelOf(tr), 0).x : uOpacity;
}
`,D0=`
uniform vec2 uResolution;
void trimSegment(const in vec4 start, inout vec4 end) {
  float nearEstimate = -0.5 * projectionMatrix[3][2] / projectionMatrix[2][2];
  float alpha = (nearEstimate - start.z) / (end.z - start.z);
  end.xyz = mix(start.xyz, end.xyz, alpha);
}
vec4 corner(vec3 a, vec3 b, float w) {
  vec4 va = modelViewMatrix * vec4(a, 1.0);
  vec4 vb = modelViewMatrix * vec4(b, 1.0);
  if (projectionMatrix[2][3] == -1.0) {
    if (va.z >= 0.0 && vb.z >= 0.0) return ${eh};
    if (va.z < 0.0 && vb.z >= 0.0) trimSegment(va, vb);
    else if (vb.z < 0.0 && va.z >= 0.0) trimSegment(vb, va);
  }
  vec4 ca = projectionMatrix * va;
  vec4 cb = projectionMatrix * vb;
  vec2 d = (cb.xy / cb.w - ca.xy / ca.w) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-9 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  vec4 c = position.y > 0.5 ? cb : ca;
  c.xy += nrm * position.x * w / uResolution * c.w;
  return c;
}
`,Z1=k0+`
#ifdef USE_TRAJECTORY_COLOR
attribute vec3 tcolor;
#endif
#ifdef DASH
attribute float dist;
uniform highp sampler2D uDashFrom;
uniform int uDashWidth;
uniform float uSegBase;
float restartAt(float j) {
  int i = int(j + uSegBase + 0.5);
  return texelFetch(uDashFrom, ivec2(i % uDashWidth, i / uDashWidth), 0).x;
}
varying float vDist;
#endif
uniform vec3 uColor;
varying vec4 vColor;
void main() {
  vec4 r = texelFetch(uRanges, texelOf(trajectory), 0);
  if (!revealed(r)) {
    vColor = vec4(0.0);
    gl_Position = ${eh};
    return;
  }
  float s = along(r, gl_VertexID % 2 == 1 ? useg.y : useg.x);
#ifdef USE_TRAJECTORY_COLOR
  vec3 rgb = tcolor;
#else
  vec3 rgb = uColor;
#endif
#ifdef DASH
  // the pattern starts again where the trajectory last entered the panel area
  vDist = dist - restartAt(float(gl_VertexID / 2));
#endif
  vColor = vec4(rgb, uFade * alphaOf(trajectory) * mix(uTaperOpacity, 1.0, s));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,K1=k0+D0+`
attribute vec3 instanceStart;
attribute vec3 instanceEnd;
#ifdef USE_TRAJECTORY_COLOR
attribute vec3 colorStart;
attribute vec3 colorEnd;
#endif
#ifdef DASH
attribute float distStart;
attribute float distEnd;
uniform highp sampler2D uDashFrom;
uniform int uDashWidth;
uniform float uSegBase;
float restartAt(float j) {
  int i = int(j + uSegBase + 0.5);
  return texelFetch(uDashFrom, ivec2(i % uDashWidth, i / uDashWidth), 0).x;
}
varying float vDist;
#endif
uniform vec3 uColor;
uniform float uWidth;
uniform float uTaperWidth;
varying vec4 vColor;
void main() {
  vec4 r = texelFetch(uRanges, texelOf(trajectory), 0);
  if (!revealed(r)) {
    vColor = vec4(0.0);
    gl_Position = ${eh};
    return;
  }
  bool atEnd = position.y > 0.5;
  float s = along(r, atEnd ? useg.y : useg.x);
#ifdef USE_TRAJECTORY_COLOR
  vec3 rgb = atEnd ? colorEnd : colorStart;
#else
  vec3 rgb = uColor;
#endif
#ifdef DASH
  vDist = (atEnd ? distEnd : distStart) - restartAt(float(gl_InstanceID));
#endif
  vColor = vec4(rgb, uFade * alphaOf(trajectory) * mix(uTaperOpacity, 1.0, s));
  gl_Position = corner(instanceStart, instanceEnd, uWidth * mix(uTaperWidth, 1.0, s));
}
`,Q1=D0+`
attribute vec3 instanceStart;
attribute vec3 instanceEnd;
attribute vec4 colorStart;
attribute vec4 colorEnd;
attribute float widthStart;
attribute float widthEnd;
#ifdef DASH
attribute float distStart;
attribute float distEnd;
varying float vDist;
#endif
varying vec4 vColor;
void main() {
  bool atEnd = position.y > 0.5;
  vColor = atEnd ? colorEnd : colorStart;
#ifdef DASH
  vDist = atEnd ? distEnd : distStart;
#endif
  gl_Position = corner(instanceStart, instanceEnd, atEnd ? widthEnd : widthStart);
}
`,v0=`
uniform vec2 uResolution;
uniform vec4 uColor;
uniform float uWidth;
uniform float uHead;
uniform float uHeadWidth;
attribute vec3 instanceBase;
attribute vec3 instanceTip;
varying vec4 vColor;
void main() {
  vColor = uColor;
  vec4 ca = projectionMatrix * modelViewMatrix * vec4(instanceBase, 1.0);
  vec4 cb = projectionMatrix * modelViewMatrix * vec4(instanceTip, 1.0);
  vec2 half_ = 0.5 * uResolution;
  vec2 a = ca.xy / ca.w * half_;
  vec2 b = cb.xy / cb.w * half_;
  float len = length(b - a);
  if (ca.w <= 0.0 || cb.w <= 0.0 || len < 1e-3) {
    gl_Position = ${eh};
    return;
  }
  vec2 dir = (b - a) / len;
  vec2 nrm = vec2(-dir.y, dir.x);
  float head = min(uHead, len);
  vec2 neck = b - dir * head;
#ifdef HEAD
  vec2 p = position.y > 0.5 ? b : neck + nrm * position.x * 0.5 * uHeadWidth * head;
#else
  // the shaft runs half a pixel into the head, so that the two do not leave a seam
  vec2 p = (position.y > 0.5 ? neck + dir * min(0.5, head) : a) + nrm * position.x * 0.5 * uWidth;
#endif
  gl_Position = vec4(p / half_, 0.0, 1.0);
}
`,eT=`
uniform vec4 uColor;
varying vec4 vColor;
void main() {
  vColor = uColor;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,tT=`
varying vec4 vColor;
#ifdef DASH
varying float vDist;
uniform float uPixels;
uniform vec2 uDash;
#endif
void main() {
#ifdef DASH
  // a dash of uDash.x and a gap of uDash.y pixels along the screen, from the arclength in the display frame
  if (mod(vDist * uPixels, uDash.x + uDash.y) > uDash.x) discard;
#endif
  gl_FragColor = vColor;
}
`;function nT(){let n=document.createElement("canvas");n.width=n.height=64;let e=n.getContext("2d");e.fillStyle="#fff",e.beginPath(),e.arc(32,32,28,0,Math.PI*2),e.fill();let t=new to(n);return t.needsUpdate=!0,t}function qu(n,e=6){if(!(n>0)||!Number.isFinite(n))return 1;let t=n/e,i=Math.pow(10,Math.floor(Math.log10(t))),r=t/i;return(r<1.5?1:r<3.5?2:r<7.5?5:10)*i}function bi(n){let e=(a,l,c)=>new O(a,l,c);if(n.kind==="2d")return n.plane==="xz"?{right:e(1,0,0),up:e(0,0,1),normal:e(0,-1,0)}:n.plane==="yz"?{right:e(0,1,0),up:e(0,0,1),normal:e(1,0,0)}:{right:e(1,0,0),up:e(0,1,0),normal:e(0,0,1)};let[t,i,r]=n.up==="x"?[e(0,1,0),e(0,0,1),e(1,0,0)]:n.up==="y"?[e(0,0,1),e(1,0,0),e(0,1,0)]:[e(1,0,0),e(0,1,0),e(0,0,1)],s=t.clone().addScaledVector(i,-1.6).addScaledVector(r,.9).normalize();return{right:new O().crossVectors(r,s).normalize(),up:r,normal:s}}function Cr(n){return n.kind==="3d"&&n.stretch!==void 0?new O(...n.stretch):new O(1,1,1)}function ap(){let n=new Mr;return n.setAttribute("position",new Kt([-1,0,0,1,0,0,-1,1,0,1,1,0],3)),n.setIndex([0,1,2,2,1,3]),n}var Ga=(n,e,t={})=>new Rt({vertexShader:n,fragmentShader:tT,uniforms:e,defines:t,transparent:!0,depthTest:!1,depthWrite:!1,side:Pt}),_0=n=>Math.min(1,Math.max(0,n));function S0(n,e){n.stencilWrite=!0,n.stencilRef=e,n.stencilFunc=mf,n.stencilFail=rs,n.stencilZFail=rs,n.stencilZPass=pf}var ep=class{cache=new Map;get(e,t){let i=this.cache.get(e);return i===void 0&&(i=t(),this.cache.set(e,i)),i}};function M0(n,e){if(e===void 0||typeof e=="string"||No(e)||typeof e.colormap=="string")return e;let t=e.colormap;$e(n.scene,t.input)?.kind!=="choice"&&M("panel",`the colormap is keyed on ${t.input}, which is not a choice`);let i=Tt(n,t.input),r=typeof i=="string"&&Object.hasOwn(t.map,i)?t.map[i]:void 0;return r===void 0&&M("panel",`the colormap keyed on ${t.input} does not name a colormap for ${JSON.stringify(i)}`),{...e,colormap:r}}function iT(n,e,t,i){let r=t.panels[i],s=n.panels[r.panel],o={scene:n,state:t,panel:r},a=Vr(o,s),l=Vt(n.clock),c=Ft(o,s.reference.sets),u=c===null?null:{set:e.sets.get(c),trajectory:0};u&&(u.trajectory=ws(o,s.reference.member,u.set),l>1&&!u.set.periodic&&M("revolutions",`the reference trajectory's trajectory set ${u.set.id} is not periodic, and the clock has ${l} revolutions`));let h=[];return s.layers.forEach((f,d)=>{if(Es(o,f))if(f.kind==="trajectories"){let p=Ft(o,f.sets),g=p===null?null:e.sets.get(p),m=g===null?[]:Hr(o,f.members,g),y=f.clock===void 0?n.clock:Ao(n.clock,f.clock),b=Em(f,y)?f.clock===void 0?t.clock.channel:y.channels[0]:null,_=f.read_from??"own";_!=="own"&&_!=="reference"&&M("read-from",`a trajectories layer reads from ${JSON.stringify(_)}, not own or reference`),g!==null&&b!==null&&f.clock===void 0&&l>1&&!g.periodic&&M("revolutions",`a reading is taken on trajectory set ${g.id}, which is not periodic, and the clock has ${l} revolutions`);let x=f.highlight;x?.kernel!==void 0&&$e(n,x.input)?.kind!=="parameter"&&M("panel",`a highlight kernel needs a parameter input, and ${x.input} is not one`);let S=g!==null&&x!==void 0?ul(o,{input:x.input},g):null,w=S!==null&&m.includes(S)?S:null;h.push({kind:"trajectories",index:d,layer:f,set:g,members:m,highlight:w,selected:S,channel:b,color:M0(o,f.color),readFrom:_,clock:y})}else if(f.kind==="arrow"){let p=Ft(o,f.sets),g=f.clock===void 0?n.clock:Ao(n.clock,f.clock),m=f.clock===void 0?t.clock.channel:g.channels[0];h.push({kind:"arrow",index:d,layer:f,set:p===null?null:e.sets.get(p),channel:m,clock:g})}else if(f.kind==="inset_box")h.push({kind:"inset_box",index:d,layer:f});else if(f.kind==="body")h.push({kind:"body",index:d,layer:f});else if(f.kind==="points"){let p=Ft(o,f.sets),g=p===null?null:e.sets.get(p),m=g===null?[]:Hr(o,f.members,g);h.push({kind:"points",index:d,layer:f,set:g,members:m,color:M0(o,f.marker?.color)})}else if(f.kind==="label"){let p=f.at,g=p!==null&&typeof p=="object"&&"sets"in p?Ft(o,p.sets):null;h.push({kind:"label",index:d,layer:f,set:g===null?null:e.sets.get(g)})}else f.kind==="morph"?h.push({kind:"morph",index:d,layer:f}):f.kind==="surface"?h.push({kind:"surface",index:d,layer:f}):h.push({kind:f.kind,index:d,layer:f})}),{declaredId:r.panel,declared:s,display:a,scope:o,reference:u,layers:h}}function rT(n){return[n.declaredId,n.display,n.reference?.set.id??"",...n.layers.map(e=>e.kind==="trajectories"||e.kind==="points"?e.set?.id??"":"")].join("\0")}function tp(n,e,t,i){let r=n.transform([0,0,0],e,t,i),s=new Float64Array(12);for(let o=0;o<3;o++){let a=n.transform([o===0?1:0,o===1?1:0,o===2?1:0],e,t,i);for(let l=0;l<3;l++)s[3*l+o]=a[l]-r[l]}return s.set(r,9),s}function sT(n,e,t,i=new Mt,r){let{a:s,b:o,w:a}=Ts(t,Wr(n,t,r).at),l=tp(n.frames,e,n.display,s),c=tp(n.frames,e,n.display,o),u=l.map((h,f)=>(1-a)*h+a*c[f]);return i.set(u[0],u[1],u[2],u[9],u[3],u[4],u[5],u[10],u[6],u[7],u[8],u[11],0,0,0,1)}var oT=4e6;function aT(n,e,t,i,r){let s=i.frames,o=n.set.def.frame,a=i.geometry(n.set.id,o),l=e.set.periodic?Vt(i.scene.clock):1,c=s.requirements(o,t).channels.size>0,u=c?e.set.count(e.trajectory):1,h=n.members.length===n.set.trajectories?a.positions:Float64Array.from(n.members.flatMap(d=>[...a.trajectory(d,0)]));if(h.length>24&&h.length/3*u*(c?l:1)>r){let[d,p,g,m,y,b]=a.bounds();h=Float64Array.from([d,p,g,m,p,g,d,y,g,m,y,g,d,p,b,m,p,b,d,y,b,m,y,b])}let f=[1/0,1/0,1/0,-1/0,-1/0,-1/0];for(let d=0;d<(c?l:1);d++)for(let p=0;p<u;p++){let g=tp(s,o,t,{set:e.set,trajectory:e.trajectory,sample:p,shifted:!1,revolution:d});for(let m=0;m<h.length;m+=3){let y=h[m],b=h[m+1],_=h[m+2];for(let x=0;x<3;x++){let S=g[3*x]*y+g[3*x+1]*b+g[3*x+2]*_+g[9+x];S<f[x]&&(f[x]=S),S>f[x+3]&&(f[x+3]=S)}}}return f}function lT(n,e,t=oT){let i=null;for(let r of n.layers){if(r.kind!=="trajectories"||r.set===null||r.members.length===0||r.layer.fit===!1||r.readFrom==="reference"&&n.reference===null)continue;let s;if(r.readFrom==="reference")s=[aT(r,n.reference,n.display,e,t)];else{let o=e.geometry(r.set.id,n.display);s=r.members.length===r.set.trajectories?[o.bounds()]:r.members.map(a=>o.bounds(a))}for(let o of s)if(i===null)i=[...o];else for(let a=0;a<3;a++)i[a]=Math.min(i[a],o[a]),i[a+3]=Math.max(i[a+3],o[a+3])}return i}var Yu=n=>n.kind==="2d"&&n.aspect==="free";function cT(n,e,t){let i=n.getCenter(new O),r=n.getSize(new O),s=Math.max(r.length()/2,1e-9),{right:o,up:a}=bi(e),l=g=>new O(Math.abs(g.x),Math.abs(g.y),Math.abs(g.z)),c=e.kind==="2d"?r.dot(l(o))/2:s,u=e.kind==="2d"?r.dot(l(a))/2:s,h=Math.max(u,c/t)*1.1,f=h>1e-12?h:Math.max(s,1);if(!Yu(e))return{center:i,halfWidth:f*t,halfHeight:f};let d=g=>Math.max(Math.abs(n.min.dot(g)),Math.abs(n.max.dot(g))),p=(g,m)=>g>0&&g>1e-9*m;return{center:i,halfWidth:p(c,d(o))?c*1.1:f*t,halfHeight:p(u,d(a))?u*1.1:f}}function uT(n,e,t,i){let r=t>0?i/(e.width*t):0;return Math.max(n,e.opacity*Math.exp(-r*r))}function hT(n,e,t,i){let{right:r,up:s}=bi(e),o=n.position.dot(r),a=n.position.dot(s),l=(n.right-n.left)/(2*n.zoom),c=(n.top-n.bottom)/(2*n.zoom);return{x0:o-l,x1:o+l,y0:a-c,y1:a+c,w:t,h:i,stepX:qu(2*l,Math.max(3,t/110)),stepY:qu(2*c,Math.max(3,i/70))}}function Ju(n,e,t){let i=[],r=Math.floor(e/t);for(let s=Math.ceil(n/t);s<=r&&i.length<1e3;s++)i.push(s*t);return i}function w0(n,e){let t=Math.max(0,-Math.floor(Math.log10(e)));return(Math.abs(n)<e*1e-9?0:n).toFixed(t).replace("-","\u2212")}var N0=n=>7*n.length-3.5*(n.split(".").length-1);function np(n){let e=n.kind==="title"?13:12,t=N0(yi(n.text))*e/12,i=n.align==="center"?-t/2:n.align==="end"?-t:0;return n.rotate?[n.x-e/2,n.y-i-t,n.x+e/2,n.y-i]:[n.x+i,n.y-e/2,n.x+i+t,n.y+e/2]}var O0=(n,e)=>typeof n=="string"?n+e:[...n,{text:e}];function Jf(n,e){if(n===void 0)return"";let t=typeof n=="string"?n:Oa(n);return e&&yi(t)!==""?O0(t,` [${e}]`):t}var E0=new WeakMap;function dT(n,e){let t=typeof e=="string"?e:""+e.map(i=>`${i.shift??""}\0${i.text}`).join("");if(E0.get(n)!==t){if(E0.set(n,t),typeof e=="string"){n.textContent=e;return}n.replaceChildren(...e.map(i=>{let r=document.createElement("span");return r.textContent=i.text,i.shift!==void 0&&(r.style.fontSize=`${Ua*100}%`,r.style.position="relative",r.style.top=`${Number(((i.shift==="sub"?Wu:-jf)/Ua).toFixed(4))}em`),r}))}}function fT(n,e){let[t,i,r,s]=np(n),[o,a,l,c]=np(e);return t<l&&o<r&&i<c&&a<s}var T0=160,ip=9;function pT(n,e){let t=n.bars;return t===null||t.width<=0||t.height<=0?null:[e-t.right-t.width-2,t.top-2,e-t.right+2,t.top+t.height+2]}function A0(n,e){let[t,i,r,s]=np(n),o=n.rotate?[ip-6,0]:[0,ip-6];return t-o[0]<e[2]&&e[0]<r+o[0]&&i-o[1]<e[3]&&e[1]<s+o[1]}function mT(n,e,t,i=0){let r=[],s=a=>(a-n.x0)/(n.x1-n.x0)*n.w,o=a=>n.h-(a-n.y0)/(n.y1-n.y0)*n.h;if(e){let a=[];for(let c of Ju(n.y0,n.y1,n.stepY)){let u=o(c);u>Math.max(22,i+ip)&&u<n.h-44&&a.push({text:w0(c,n.stepY),x:0,y:u,align:"end",kind:"tick"})}let l=Math.max(44,22+Math.max(0,...a.map(c=>N0(yi(c.text)))));for(let c of Ju(n.x0,n.x1,n.stepX)){let u=s(c);u>l+12&&u<n.w-16&&r.push({text:w0(c,n.stepX),x:u,y:n.h-28,align:"center",kind:"tick"})}for(let c of a)r.push({...c,x:l})}return t!==null&&(yi(t[0])!==""&&n.h>=T0&&r.push({text:t[0],x:n.w/2,y:n.h-10,align:"center",kind:"title"}),yi(t[1])!==""&&n.w>=T0&&r.push({text:t[1],x:10,y:n.h/2,align:"center",rotate:!0,kind:"title"})),r}var rp=class{holder=new hn;mat;spec;src;wide;obj=null;sharedNames=[];shown="";constructor(e,t,i){this.src=e,this.spec=t,this.wide=t.width>1;let r={...i,uRevolution:{value:t.revolution},uSkip:{value:-1},uSegBase:{value:0},uOpacity:{value:t.opacity},uWidth:{value:t.width},uKernel:{value:e.kernel&&!t.highlight?1:0}},s={};e.coloring.kind==="sample"&&(s.USE_TRAJECTORY_COLOR=""),e.dist!==null&&(s.DASH=""),this.mat=Ga(this.wide?K1:Z1,r,s)}show(e){this.mat.uniforms.uSegBase.value=typeof e=="number"?this.src.set.start(e)-e:0;let t=e===null?"":String(e);if(t===this.shown||(this.clear(),this.shown=t,e===null))return;let i=this.wide?this.quads(e):this.lines(e);this.obj=this.wide?new bt(i,this.mat):new Qs(i,this.mat),this.obj.frustumCulled=!1,this.obj.renderOrder=this.holder.parent?.renderOrder??0,this.holder.add(this.obj)}arrays(e){let{ctx:t,set:i,geo:r,display:s,readings:o,coloring:a,colorKey:l,dist:c}=this.src,u=this.spec.revolution;if(e==="set")return{pos:t.shared.get(`pos\0${i.id}\0${s}\0${r.revolutionKey(u)}`,()=>Pm(r,u)),u:t.shared.get(`u\0${i.id}\0${o.channel}`,()=>km(i,o.u)),tr:t.shared.get(`t\0${i.id}`,()=>Nm(i)),col:a.kind==="sample"?t.shared.get(`c\0${i.id}\0${l}`,()=>ud(i,a.rgb,3)):null,dist:c===null?null:t.shared.get(`d\0${i.id}\0${s}\0${Zf(c)}`,()=>ud(i,c,1))};let h=i.start(e),f=i.count(e);return{pos:Lm(r,e,u),u:Dm(o.u,h,f),tr:new Float32Array(2*(f-1)).fill(e),col:a.kind==="sample"?hd(a.rgb,3,h,f):null,dist:c===null?null:hd(c,1,h,f)}}lines(e){let t=this.arrays(e),i=(s,o,a)=>e==="set"?this.src.ctx.shared.get(`gl\0${s}\0${this.src.set.id}\0${Zf(o)}`,()=>new Qe(o,a)):new Qe(o,a),r=new ft;return r.setAttribute("position",i("position",t.pos,3)),r.setAttribute("useg",i("useg",t.u,2)),r.setAttribute("trajectory",i("trajectory",t.tr,1)),t.col&&r.setAttribute("tcolor",i("tcolor",t.col,3)),t.dist&&r.setAttribute("dist",i("dist",t.dist,1)),this.sharedNames=e==="set"?Object.keys(r.attributes):[],r}quads(e){let t=this.arrays(e),i=(o,a,l)=>e==="set"?this.src.ctx.shared.get(`gpu\0${o}\0${this.src.set.id}\0${Zf(a)}`,()=>new wr(a,l)):new wr(a,l),r=ap(),s=i("pos",t.pos,6);if(r.setAttribute("instanceStart",new Bt(s,3,0)),r.setAttribute("instanceEnd",new Bt(s,3,3)),r.setAttribute("useg",new Bt(i("u",t.u,4),2,0)),r.setAttribute("trajectory",new Bt(i("t",t.tr,2),1,0)),t.col){let o=i("c",t.col,6);r.setAttribute("colorStart",new Bt(o,3,0)),r.setAttribute("colorEnd",new Bt(o,3,3))}if(t.dist){let o=i("d",t.dist,2);r.setAttribute("distStart",new Bt(o,1,0)),r.setAttribute("distEnd",new Bt(o,1,1))}return r.instanceCount=t.pos.length/6,this.sharedNames=e==="set"?Object.keys(r.attributes).filter(o=>o!=="position"):[],r}clear(){if(this.obj!==null){this.holder.remove(this.obj);for(let e of this.sharedNames)this.obj.geometry.deleteAttribute(e);this.obj.geometry.dispose(),this.obj=null,this.sharedNames=[]}}dispose(){this.clear(),this.mat.dispose()}},C0=new WeakMap,gT=0;function Zf(n){let e=C0.get(n);return e===void 0&&(e=gT++,C0.set(n,e)),e}var Ba=18,sp=class{mesh;buffer;mat;n=0;constructor(e,t,i=null){this.mat=Ga(Q1,{uResolution:t,...i??{}},i===null?{}:{DASH:""}),this.buffer=this.allocate(e),this.mesh=new bt(this.geometry(),this.mat),this.mesh.frustumCulled=!1}allocate(e){let t=new wr(new Float32Array(Ba*Math.max(1,e)),Ba);return t.setUsage(vn),t}geometry(){let e=ap(),t=this.buffer;return e.setAttribute("instanceStart",new Bt(t,3,0)),e.setAttribute("instanceEnd",new Bt(t,3,3)),e.setAttribute("colorStart",new Bt(t,4,6)),e.setAttribute("colorEnd",new Bt(t,4,10)),e.setAttribute("widthStart",new Bt(t,1,14)),e.setAttribute("widthEnd",new Bt(t,1,15)),e.setAttribute("distStart",new Bt(t,1,16)),e.setAttribute("distEnd",new Bt(t,1,17)),e.instanceCount=0,e}begin(e){return Ba*e>this.buffer.array.length&&(this.mesh.geometry.dispose(),this.buffer=this.allocate(2*e),this.mesh.geometry=this.geometry()),this.n=0,this.buffer.array}end(){this.mesh.geometry.instanceCount=this.n,this.mesh.visible=this.n>0,this.buffer.clearUpdateRanges(),this.buffer.addUpdateRange(0,Ba*this.n),this.buffer.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mat.dispose()}};function yT(n,e,t){let i=e.highlight?.kernel;if(i===void 0)return null;let r=$e(n.scene,e.highlight.input);if(r?.kind!=="parameter"||r.parameter===void 0)return null;let s=t.parameter(r.parameter,"panel"),o=1/0,a=-1/0;for(let l=0;l<s.length;l++)o=Math.min(o,s[l]),a=Math.max(a,s[l]);return{parameter:r.parameter,width:i.width,opacity:i.opacity,values:s,extent:a>=o?a-o:0}}function bT(n,e,t,i,r,s,o,a,l,c){let u=i>0?e[t]:0,h=!1;for(let f=0;f+1<i;f++){let d=n[2*(t+f)],p=n[2*(t+f)+1],g=n[2*(t+f+1)]-d,m=n[2*(t+f+1)+1]-p,y=0,b=1,_=!0;for(let[S,w]of[[-g,d-r],[g,o-d],[-m,p-s],[m,a-p]])if(S===0)w<0&&(_=!1);else{let v=w/S;S<0?y=Math.max(y,v):b=Math.min(b,v)}let x=_&&y<=b;if(x&&(y>0||!h)){let S=e[t+f];u=S+y*(e[t+f+1]-S)}l[c+f]=u,h=x&&b>=1}}function Kf(n){let e=Math.min(Math.max(n,1),2048),t=Math.ceil(Math.max(n,1)/e),i=new Float32Array(4*e*t),r=new xr(i,e,t,kn,Yn);return r.minFilter=r.magFilter=kt,r.generateMipmaps=!1,r.needsUpdate=!0,{data:i,texture:r,width:e}}function R0(n,e,t=1,i=1){let r=new Float32Array(n.samples),s=[1,1,1];s[t]=i;for(let o=0;o<n.trajectories;o++){let a=n.start(o),l=0;r[a]=0;for(let c=1;c<n.count(o);c++){let u=3*(a+c-1),h=3*(a+c);l+=Math.hypot(s[0]*(e[h]-e[u]),s[1]*(e[h+1]-e[u+1]),s[2]*(e[h+2]-e[u+2])),r[a+c]=l}}return r}var Ki=class{points;material;marker;tinted;texSize=0;texEdge=-1;edgeWidth;constructor(e,t,i){this.marker=e,this.edgeWidth=typeof e.edge_width=="number"?e.edge_width:void 0,this.tinted=i,this.material=new us({size:t,sizeAttenuation:!1,vertexColors:i,transparent:!0,alphaTest:.01,depthTest:!1,depthWrite:!1}),this.points=new eo(new ft,this.material),this.points.frustumCulled=!1,this.grow(1),this.setSize(t)}setSize(e,t=this.edgeWidth){this.edgeWidth=t;let i={...this.marker,edge_width:t};this.material.size=e+Wf(i,e);let r=Math.max(1,e),s=t??0;if(Math.abs(r/Math.max(this.texSize,1e-9)-1)>.05||Math.abs(s-this.texEdge)>.05*Math.max(s,.5)){this.texSize=r,this.texEdge=s,this.material.map?.dispose();let o=new to(t0(this.tinted?{...i,color:void 0}:i,r));o.needsUpdate=!0,this.material.map=o,this.material.needsUpdate=!0}}setOpacity(e){this.material.opacity=e}grow(e){let t=this.points.geometry.getAttribute("position");if(t!==void 0&&t.count>=e)return;this.points.geometry.dispose();let i=new ft;i.setAttribute("position",new Qe(new Float32Array(3*e),3).setUsage(vn)),i.setAttribute("color",new Qe(new Float32Array(3*e),3).setUsage(vn)),this.points.geometry=i}get position(){return this.points.geometry.getAttribute("position")}get color(){return this.points.geometry.getAttribute("color")}show(e){this.position.needsUpdate=!0,this.color.needsUpdate=!0,this.points.geometry.setDrawRange(0,e),this.points.visible=e>0}dispose(){this.points.geometry.dispose(),this.material.map?.dispose(),this.material.dispose()}};function Qf(n){let e=n.head;return typeof e=="object"&&e!==null?e:{}}var Rr=class{key;group=new Zt;src;layer;set;geo;clocks;clock;spec;color;width;hiWidth;opacity;hiOpacity;fraction;taperWidth;taperOpacity;kernel;ranges;alphas;dashFrom;dashScreen=new Float64Array(0);restartOut=[];resolution={value:new Me(1,1)};uniforms;baseHolder=new hn;hiHolder=new hn;passes=new Map;pieces;heads=null;glow=null;headSize;headColor;fill=null;fillBuffer=new Float32Array(0);line;flatMark;keyframed;members=[];highlight=null;selected=null;baseWhat=null;skip=-1;filled=!1;referenceContext;geometry;constructor(e,t,i,r){this.key=r,this.geometry=e.geometry;let s=t.set,o=t.layer;this.set=s,this.layer=o,this.clock=t.clock,this.referenceContext=t.readFrom==="reference",this.referenceContext&&(this.group.matrixAutoUpdate=!1),this.geo=e.geometry.geometry(s.id,this.referenceContext?s.def.frame:i),this.clocks=t.channel===null?null:e.geometry.readings(s.id,t.channel);let a=this.clocks??e.geometry.readings(s.id,mt);this.spec=Tm(o,s.periodic,Vt(t.clock)),this.color=t.color;let l=Oh(Dh(t.color,e.theme),s,et(e.theme.foreground));this.kernel=yT(e,o,s),this.line=o.line!==!1,this.flatMark=o.group_opacity===!0?t.index%255+1:0;let c=o.dash!==void 0&&this.line;this.src={ctx:e,set:s,geo:this.geo,display:this.geo.frame,readings:a,colorKey:JSON.stringify(t.color??null),coloring:l,kernel:this.kernel!==null,dist:c?e.shared.get(`dist\0${s.id}\0${this.geo.frame}`,()=>R0(s,this.geo.positions)):null},this.width=o.width??1,this.hiWidth=o.highlight?.width??this.width,this.opacity=typeof o.opacity=="number"?o.opacity:1,this.hiOpacity=o.highlight?.opacity??1,this.fraction=this.spec.reveal==="trail"?this.spec.revolutions*this.spec.fraction:0,this.taperWidth=o.trail?.taper?.width??Y1,this.taperOpacity=o.trail?.taper?.opacity??J1;let u=Do(Qf(o),e.theme);this.keyframed=typeof o.opacity=="object"||typeof u.size=="object"||typeof u.opacity=="object"||typeof u.edge_width=="object",this.ranges=Kf(s.trajectories);for(let f=0;f<s.trajectories;f++)this.ranges.data.set(Wo,4*f);this.alphas=this.kernel===null?null:Kf(s.trajectories);let h=c?{uPixels:{value:1},uDash:{value:new Me(o.dash[0],o.dash[1])}}:null;if(this.dashFrom=c?Kf(Math.max(1,s.samples-s.trajectories)):null,this.uniforms={uRanges:{value:this.ranges.texture},uAlphas:{value:(this.alphas??this.ranges).texture},uRangesWidth:{value:this.ranges.width},uColor:{value:new O(...l.kind==="constant"?l.rgb:[1,1,1])},uResolution:this.resolution,uFraction:{value:this.fraction},uTaperWidth:{value:this.taperWidth},uTaperOpacity:{value:this.fraction>0?this.taperOpacity:1},uFade:{value:1},...h??{},...this.dashFrom===null?{}:{uDashFrom:{value:this.dashFrom.texture},uDashWidth:{value:this.dashFrom.width}}},o.fill!==void 0){let f=o.fill,d=et(f.color!==void 0?Ut(f.color,e.theme):l.kind==="constant"?`#${new Fe(...l.rgb).getHexString()}`:e.theme.foreground),p=new Zs({color:new Fe(...d),transparent:!0,opacity:f.opacity??.25,depthTest:!1,depthWrite:!1,side:Pt});this.fill=new bt(new ft,p),this.fill.frustumCulled=!1,this.group.add(this.fill)}if(this.group.add(this.baseHolder,this.hiHolder),this.pieces=new sp(2*Math.min(s.trajectories,64),this.resolution,h),this.flatMark>0&&S0(this.pieces.mesh.material,this.flatMark),this.group.add(this.pieces.mesh),this.headSize=typeof u.size=="number"?u.size:x0,this.headColor=u.color!==void 0?et(u.color):null,or(o)){if(u.glow!==void 0){let f=u.glow;this.glow=new Ki({shape:"disc",color:f.color??"#d62728"},f.size??2.4*this.headSize,!1),this.glow.setOpacity(f.opacity??.35),this.group.add(this.glow.points)}this.heads=new Ki(u,this.headSize,u.color===void 0),this.group.add(this.heads.points)}}resize(e,t){this.resolution.value.set(Math.max(1,e),Math.max(1,t))}dashRatio=1;setPixels(e,t){if(this.uniforms.uPixels===void 0||this.src.dist===null)return;this.uniforms.uPixels.value=e;let i=t/Math.max(e,1e-12);if(Math.abs(i/this.dashRatio-1)>.01){this.dashRatio=i,this.src.dist=R0(this.set,this.geo.positions,this.planeAxes[1],i);for(let r of this.passes.values())r.holder.removeFromParent(),r.dispose();this.passes.clear(),this.filled=!1}}colorAt(e,t,i,r){let s=this.src.coloring;if(s.kind==="constant"){i.set(s.rgb,r);return}let o=this.set.start(e);if("sample"in t){for(let a=0;a<3;a++)i[r+a]=s.rgb[3*(o+t.sample)+a];return}for(let a=0;a<3;a++)i[r+a]=(1-t.w)*s.rgb[3*(o+t.k)+a]+t.w*s.rgb[3*(o+t.k+1)+a]}distAt(e,t){let i=this.src.dist;if(i===null)return 0;let r=this.set.start(e),s="sample"in t?Math.min(t.sample,this.set.count(e)-2):t.k,o=this.dashFrom?.data[4*(r-e+Math.max(0,s))]??0;return"sample"in t?i[r+t.sample]-o:(1-t.w)*i[r+t.k]+t.w*i[r+t.k+1]-o}placeDash(e,t,i,r,s){let o=this.dashFrom,a=this.src.dist;if(o===null||a===null)return;e.updateMatrixWorld(),this.group.updateWorldMatrix(!0,!1);let c=new Mt().multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).multiply(this.group.matrixWorld).elements,u=this.geo.positions;this.dashScreen.length<2*this.set.samples&&(this.dashScreen=new Float64Array(2*this.set.samples));let h=this.dashScreen,f=!1;for(let d of this.members){let p=this.set.start(d),g=this.set.count(d);for(let y=p;y<p+g;y++){let b=u[3*y],_=u[3*y+1],x=u[3*y+2],S=c[3]*b+c[7]*_+c[11]*x+c[15],w=(c[0]*b+c[4]*_+c[8]*x+c[12])/S,v=(c[1]*b+c[5]*_+c[9]*x+c[13])/S;h[2*y]=t.x+(w+1)/2*t.w,h[2*y+1]=t.y+(1-v)/2*t.h}let m=p-d;bT(h,a,p,g,-s,-s,i+s,r+s,this.restartOut,0);for(let y=0;y+1<g;y++){let b=this.restartOut[y];o.data[4*(m+y)]!==b&&(o.data[4*(m+y)]=b,f=!0)}}f&&(o.texture.needsUpdate=!0)}fillKernel(){let e=this.kernel;if(e===null||this.alphas===null)return;let t=this.selected===null?null:e.values[this.selected];for(let i=0;i<this.set.trajectories;i++)this.alphas.data[4*i]=t===null?this.opacity:uT(this.opacity,e,e.extent,Math.abs(e.values[i]-t));this.alphas.texture.needsUpdate=!0}showPass(e){e.show(e.spec.highlight?this.highlight:this.baseWhat),e.mat.uniforms.uSkip.value=e.spec.highlight?-1:this.skip}pass(e,t){let i=`${t?"h":"b"}${e}`,r=this.passes.get(i);return r===void 0&&(r=new rp(this.src,{revolution:e,highlight:t,width:t?this.hiWidth:this.width,opacity:t?this.hiOpacity:this.opacity},this.uniforms),this.flatMark>0&&!t&&S0(r.mat,this.flatMark),(t?this.hiHolder:this.baseHolder).add(r.holder),this.passes.set(i,r),this.showPass(r)),r}syncPasses(e,t){for(let i of this.passes.values())i.holder.visible=!1;if(this.line){if(this.baseWhat!==null)for(let i=e[0];i<=e[1];i++)this.pass(i,!1).holder.visible=!0;if(this.highlight!==null)for(let i=t[0];i<=t[1];i++)this.pass(i,!0).holder.visible=!0}}get isStatic(){return this.clocks===null&&!this.referenceContext&&!this.keyframed}place(e,t){this.group.visible=t!==null,t!==null&&(sT(e,this.set.def.frame,t,this.group.matrix,this.geometry.readings(t.set.id,e.channel).clocks[t.trajectory]),this.group.matrixWorldNeedsUpdate=!0)}fade(e){let t=this.layer,i=typeof t.opacity=="object"?lt(t.opacity,e):1;this.uniforms.uFade.value=i;let r=Qf(t);return this.heads?.setOpacity(i*lt(r.opacity,e)),this.heads!==null&&(typeof r.size=="object"||typeof r.edge_width=="object")&&this.heads.setSize(To(r.size,e,x0),r.edge_width===void 0?void 0:Eo(r.edge_width,e,0)),this.glow!==null&&this.glow.setOpacity(i*lt(r.opacity,e)*(r.glow?.opacity??.35)),this.fill!==null&&(this.fill.material.opacity=i*(t.fill?.opacity??.25)),i}update(e,t,i){let r=Ht(t.clock,i),s=this.fade(r),o=e.highlight;if(e.members.length!==this.members.length||e.members.some((_,x)=>_!==this.members[x])||o!==this.highlight||e.selected!==this.selected){let _=e.layer.members!=="all"&&e.members.length===1?e.members[0]:-1;this.members=e.members,this.highlight=o,this.selected=e.selected,this.baseWhat=_>=0?_===o?null:_:e.members.length>0?"set":null,this.skip=_<0&&o!==null?o:-1;for(let x of this.passes.values())this.showPass(x);for(let x=0;x<this.set.trajectories;x++)this.ranges.data.set(Wo,4*x);this.fillKernel(),this.heads?.grow(e.members.length),this.glow?.grow(e.members.length),this.filled=!1}if(this.clocks===null&&this.filled)return!1;let l=this.pieces.begin(this.line?2*e.members.length:0),c=this.heads?.position,u=this.heads?.color,h=this.glow?.position,f=Qf(this.layer).glow?.channel,d=f===void 0?null:this.set.channel(f,"panel"),p=0,g=0,m=[1/0,-1/0],y=[1/0,-1/0],b=[];for(let _ of e.members){let x=this.clocks?.clocks[_]??null,S=Am(x,this.clock,i,this.spec,Math.fround);this.ranges.data.set(S.range,4*_);let w=_===o;if(S.revolutions!==null){let C=w?y:m;C[0]=Math.min(C[0],S.revolutions[0]),C[1]=Math.max(C[1],S.revolutions[1])}let v=w?this.hiWidth:this.width,T=s*(w?this.hiOpacity:this.alphas!==null?this.alphas.data[4*_]:this.opacity),P=this.fraction>0&&S.loop!==null;if(this.line)for(let C of S.pieces){let I=Ba*this.pieces.n++;C.forEach((U,j)=>{this.geo.vertex(_,U,l,I+3*j),this.colorAt(_,U,l,I+6+4*j);let L=P?_0(1-(S.loop-Im(x,U))/this.fraction):1;l[I+9+4*j]=T*(P?this.taperOpacity+(1-this.taperOpacity)*L:1),l[I+14+j]=v>1&&P?v*(this.taperWidth+(1-this.taperWidth)*L):v,l[I+16+j]=this.distAt(_,U)})}if(c!==void 0&&u!==void 0&&S.head!==null&&p<c.count&&(this.geo.vertex(_,S.head,c.array,3*p),this.headColor!==null?u.array.set(this.headColor,3*p):this.colorAt(_,S.head,u.array,3*p),p++,h!==void 0&&d!==null)){let C=S.head,I="sample"in C?C.sample:C.w>=1?C.k+1:C.k;d[this.set.start(_)+I]>0&&this.geo.vertex(_,C,h.array,3*g++)}this.fill!==null&&!S.hidden&&this.fillTrajectory(_,x,S.loop,b)}return this.pieces.end(),this.heads?.show(p),this.glow?.show(g),this.fill!==null&&this.setFill(b),this.syncPasses(m,y),this.ranges.texture.needsUpdate=!0,this.filled=!0,!0}fillTrajectory(e,t,i,r){let s=this.spec,o=s.revolutions,a;t===null||i===null||s.reveal==="none"?a=Eh(this.set.count(e),o,s.periodic):s.reveal==="grow"?a=fl(t,0,i,o):a=pl(t,i,o,s.fraction,s.periodic);let l=this.planeAxes,c=this.layer.fill?.base??0,u=new Float32Array(3),h=null;for(let f of a){this.geo.vertex(e,f,u,0);let d=[u[l[0]],u[l[1]]];h!==null&&xT(h,d,c,r),h=d}}planeAxes=[0,1];setFill(e){let t=this.fill,i=e.length/2;3*i>this.fillBuffer.length&&(this.fillBuffer=new Float32Array(3*Math.max(2*i,96)),t.geometry.dispose(),t.geometry=new ft,t.geometry.setAttribute("position",new Qe(this.fillBuffer,3).setUsage(vn)));let[r,s]=this.planeAxes;this.fillBuffer.fill(0,0,3*i);for(let a=0;a<i;a++)this.fillBuffer[3*a+r]=e[2*a],this.fillBuffer[3*a+s]=e[2*a+1];let o=t.geometry.getAttribute("position");o!==void 0&&(o.clearUpdateRanges(),o.addUpdateRange(0,3*i),o.needsUpdate=!0),t.geometry.setDrawRange(0,i),t.visible=i>0}extend(){}colorbar(){let e=this.color;if(e===void 0||typeof e=="string"||No(e))return null;let t=Nh(e,this.set),i=this.set.def.parameters??{},r=t.perTrajectory&&Object.hasOwn(i,t.name)?i[t.name]:void 0,s=r?.label??t.name,[o,a]=t.range,l=d=>a===o?.5:_0((d-o)/(a-o)),c=this.highlight??(this.layer.members!=="all"&&this.members.length===1?this.members[0]:null),u=t.perTrajectory&&c!==null?l(t.values[c]):null,h=this.kernel,f=null;if(h!==null&&t.perTrajectory&&t.name===h.parameter&&this.selected!==null){let d=t.values[this.selected],p=1.5*h.width*h.extent;f=[l(d-p),l(d+p)]}return{label:r?.unit?`${s}, ${r.unit}`:s,gradient:sm(t),stops:Fh(t),lo:o,hi:a,marker:u,band:f}}dispose(){for(let e of this.passes.values())e.dispose();this.ranges.texture.dispose(),this.alphas?.texture.dispose(),this.pieces.dispose(),this.heads?.dispose(),this.glow?.dispose(),this.fill!==null&&(this.fill.geometry.dispose(),this.fill.material.dispose())}};function xT(n,e,t,i){let[r,s]=n,[o,a]=e,l=s>t,c=a>t;if(!l&&!c)return;let u=(f,d,p,g)=>i.push(f,t,f,d,p,g,f,t,p,g,p,t);if(l&&c){u(r,s,o,a);return}let h=r+(t-s)/(a-s)*(o-r);l?i.push(r,t,r,s,h,t):i.push(h,t,o,a,o,t)}var za=class{key;group=new Zt;sprites;layer;coloring;isStatic;members=null;constructor(e,t,i){this.key=i;let r=t.layer;this.layer=r;let s=r.marker??{};this.coloring=Oh(Dh(t.color,e.theme),t.set,et(e.theme.foreground));let o=t.color===void 0?e.theme.foreground:typeof t.color=="string"?t.color:void 0,a=this.coloring.kind==="sample";this.sprites=new Ki(Do({...s,color:o},e.theme),typeof s.size=="number"?s.size:4,a),this.group.add(this.sprites.points),this.isStatic=(r.reveal??"none")==="none"&&r.before===void 0&&r.after===void 0&&typeof s.size!="object"&&typeof s.edge_width!="object"&&typeof s.opacity!="object"&&typeof r.opacity!="object"}update(e,t){let i=Ht(e.base?.clock??e.clock,e.q),r=this.layer.marker??{};this.sprites.setOpacity(lt(this.layer.opacity,i)*lt(r.opacity,i)),(typeof r.size=="object"||typeof r.edge_width=="object")&&this.sprites.setSize(To(r.size,i,4),r.edge_width===void 0?void 0:Eo(r.edge_width,i,0));let s=this.members,o=s!==null&&(t.members===s||t.members.length===s.length&&t.members.every((d,p)=>d===s[p]));if(this.isStatic&&o)return;let a=bl(e,this.layer,t.set),l=0;for(let d of a.members)l+=d.points.length;this.sprites.grow(l);let c=this.sprites.position.array,u=this.sprites.color.array,h=this.coloring,f=0;for(let d of a.members){let p=t.set.start(d.index);for(let g=0;g<d.points.length;g++){if(c.set(d.points[g],3*f),h.kind==="sample")for(let m=0;m<3;m++)u[3*f+m]=h.rgb[3*(p+g)+m];f++}}this.sprites.show(l),this.members=t.members}extend(e){let t=this.sprites.position,i=this.sprites.points.geometry.drawRange;for(let r=0;r<Math.min(t.count,i.count);r++)e.expandByPoint(new O(t.getX(r),t.getY(r),t.getZ(r)))}dispose(){this.sprites.dispose()}},Ha=class{key;group=new Zt;layer;at=null;constructor(e,t){this.key=t,this.layer=e}update(e,t,i){let r=yl(e,this.layer,t.set,i);this.at=r.position===null?null:new O(...r.position)}extend(){}dispose(){}},P0=new WeakMap;function vT(n,e){let t=P0.get(n);t===void 0&&P0.set(n,t=new Map);let i=t.get(e);return i===void 0&&(i=(async()=>{let r=n.bytes(e),s=r[0]===255?"image/jpeg":r[0]===82?"image/webp":"image/png",o=await createImageBitmap(new Blob([r],{type:s}),{imageOrientation:"flipY"}),a=new xn(o);return a.generateMipmaps=!1,a.minFilter=kt,a.magFilter=kt,a.flipY=!1,a.colorSpace=gi,a.needsUpdate=!0,a})(),t.set(e,i)),i}var Pr=class{key;group=new Zt;label;size;at=null;point;trail;geometry;scratch=new Float64Array(3);capacity=0;layer;ready;imageError=null;constructor(e,t,i,r=()=>{}){this.key=i,this.layer=t,this.geometry=e.geometry;let s=e.scene.bodies??{},o=Object.hasOwn(s,t.body)?s[t.body]:void 0;this.label=o?.label??null,this.size=t.size??X1;let a=new Fe(...et(o?.color!==void 0?Ut(o.color,e.theme):e.theme.foreground));this.ready=Promise.resolve();let l=new ft;l.setAttribute("position",new Qe(new Float32Array(3),3).setUsage(vn)),this.point=new eo(l,new us({color:a,size:this.size,sizeAttenuation:!1,map:e.disc,alphaTest:.5,transparent:!0,depthTest:!1,depthWrite:!1})),this.point.frustumCulled=!1;let c=o?.image;if(c!==void 0){let u=this.point.material;u.color.setRGB(1,1,1),u.alphaTest=.01,u.map=null,this.point.visible=!1,this.ready=vT(e.geometry,c).then(h=>{u.map=h,u.needsUpdate=!0,r()},h=>{let f=`body ${t.body} has image ${c}, which cannot be decoded as a PNG, JPEG, or WebP file`;this.imageError=h instanceof pn?h:new pn("timeline",f),r()})}this.trail=new Ks(new ft,new cs({color:a,transparent:!0,opacity:.6,depthTest:!1,depthWrite:!1})),this.trail.frustumCulled=!1,this.group.add(this.trail,this.point)}update(e,t,i){if(this.imageError!==null)throw this.imageError;let r=lt(this.layer.opacity,Ht(e.clock,e.q));if(this.point.material.opacity=r,this.trail.material.opacity=.6*r,i===null){this.point.visible=!1,this.trail.visible=!1,this.at=null;return}let{set:s,trajectory:o}=i,a=Vt(e.clock),l=this.geometry.readings(s.id,e.channel).clocks[o],c=this.geometry.bodyTrail(t.body,e.display,s.id,o),u=a*oi(l.reading(e.clock,e.q)),h=wn(u,a),f=this.scratch;c.vertex(Gt(l,h.u,!1,h.revolution),f),this.point.visible=!this.hasImage||this.point.material.map!==null,this.at=new O(f[0],f[1],f[2]);let d=this.point.geometry.getAttribute("position");if(d.setXYZ(0,f[0],f[1],f[2]),d.needsUpdate=!0,t.trail===void 0){this.trail.visible=!1;return}let p=t.trail.fraction,g=u-a*p;g<0&&!s.periodic&&(g=0);let m=Om(c.m,a,p);if(m>this.capacity){this.capacity=m,this.trail.geometry.dispose();let _=new ft;_.setAttribute("position",new Qe(new Float32Array(3*this.capacity),3).setUsage(vn)),this.trail.geometry=_}let y=this.trail.geometry.getAttribute("position"),b=c.polyline(l,g,u,a,y.array);y.clearUpdateRanges(),y.addUpdateRange(0,3*b),y.needsUpdate=!0,this.trail.geometry.setDrawRange(0,b),this.trail.visible=b>1}extend(e){this.at!==null&&e.expandByPoint(this.at)}clip(e){if(!this.hasImage||this.at===null)return;let t=this.at.clone().project(e);(Math.abs(t.x)>1||Math.abs(t.y)>1)&&(this.point.visible=!1)}get hasImage(){let e=this.geometry.scene.bodies??{};return Object.hasOwn(e,this.layer.body)&&e[this.layer.body].image!==void 0}dispose(){this.point.material.map?.dispose();for(let e of[this.point,this.trail])e.geometry.dispose(),e.material.dispose()}},Zu=class{key;group=new Zt;geometry;resolution={value:new Me(1,1)};shaft;head;buffer;constructor(e,t,i){this.key=i,this.geometry=e.geometry;let{layer:r}=t,s={uResolution:this.resolution,uColor:{value:new ct(...et(Ut(r.color??e.theme.foreground,e.theme)),typeof r.opacity=="number"?r.opacity:1)},uWidth:{value:r.width??1},uHead:{value:r.head?.size??W1},uHeadWidth:{value:j1}};this.buffer=this.allocate(t.set.trajectories);let o=new Mr;o.setAttribute("position",new Kt([-1,0,0,1,0,0,0,1,0],3)),this.shaft=new bt(this.attach(ap()),Ga(v0,s)),this.head=new bt(this.attach(o),Ga(v0,s,{HEAD:""}));for(let a of[this.shaft,this.head])a.frustumCulled=!1;this.group.add(this.shaft,this.head)}allocate(e){return new wr(new Float32Array(6*Math.max(1,e)),6).setUsage(vn)}attach(e){return e.setAttribute("instanceBase",new Bt(this.buffer,3,0)),e.setAttribute("instanceTip",new Bt(this.buffer,3,3)),e.instanceCount=0,e}update(e,t){typeof t.layer.opacity=="object"&&(this.shaft.material.uniforms.uColor.value.w=lt(t.layer.opacity,Ht(e.clock,e.q)));let i=this.geometry.readings(t.set.id,t.channel).clocks,s=ml(e,t.layer,t.set,a=>i[a]).members.filter(a=>a.base!==null&&a.tip!==null);if(6*s.length>this.buffer.array.length){this.buffer=this.allocate(2*s.length);for(let a of[this.shaft,this.head])a.geometry.deleteAttribute("instanceBase"),a.geometry.deleteAttribute("instanceTip"),this.attach(a.geometry)}let o=this.buffer.array;s.forEach((a,l)=>{o.set(a.base,6*l),o.set(a.tip,6*l+3)}),this.buffer.clearUpdateRanges(),this.buffer.addUpdateRange(0,6*s.length),this.buffer.needsUpdate=!0;for(let a of[this.shaft,this.head])a.geometry.instanceCount=s.length,a.visible=s.length>0}resize(e,t){this.resolution.value.set(Math.max(1,e),Math.max(1,t))}extend(){}dispose(){for(let e of[this.shaft,this.head])e.geometry.dispose(),e.material.dispose()}};function _T(n,e,t,i,r,s,o){let{right:a,up:l}=bi(t),c=Cr(r);i.updateMatrixWorld();let[u,h,f]=n.axes.map(p=>new O(...p)),d=[];for(let[p,g]of[[e.x0,e.y0],[e.x1,e.y0],[e.x1,e.y1],[e.x0,e.y1]]){let m=a.clone().multiplyScalar(p).addScaledVector(l,g),y=new O(...n.origin).addScaledVector(u,m.x).addScaledVector(h,m.y).addScaledVector(f,m.z);if(y.multiply(c).applyMatrix4(i.matrixWorldInverse),i instanceof bn&&y.z>=-i.near)return null;y.applyMatrix4(i.projectionMatrix),d.push([(y.x+1)/2*s,(1-y.y)/2*o])}return d}function ST(n){return n?.origin==null?null:n.shown_panel}var Va=class{key;group=new Zt;layer;mesh;positions=new Float32Array(0);map=null;constructor(e,t,i){this.key=i,this.layer=t;let r=new ct(...et(Ut(t.color??e.theme.foreground,e.theme)),typeof t.opacity=="number"?t.opacity:1);this.mesh=new bt(new ft,Ga(eT,{uColor:{value:r}})),this.mesh.frustumCulled=!1,this.mesh.visible=!1,this.group.add(this.mesh)}update(e,t){typeof this.layer.opacity=="object"&&(this.mesh.material.uniforms.uColor.value.w=lt(this.layer.opacity,Ht(e.clock,e.q))),this.map=gl(e,this.layer,t)}get target(){return ST(this.map)}place(e,t){let i=this.map,r=[],{w:s,h:o}=e.rect;if(i?.origin!=null&&i.axes!==null&&t?.view!=null&&t.error===null&&t.cameraSpec.kind==="2d"){let l=_T({...i,origin:i.origin,axes:i.axes},t.view,t.cameraSpec,e.camera,e.cameraSpec,s,o),c={width:this.layer.width??1,minSize:this.layer.min_size??q1,dash:this.layer.dash};l!==null&&(r=a0(l,s,o,c))}let a=r.length/2;3*a>this.positions.length&&(this.positions=new Float32Array(3*Math.max(2*a,96)),this.mesh.geometry.dispose(),this.mesh.geometry=new ft,this.mesh.geometry.setAttribute("position",new Qe(this.positions,3).setUsage(vn)));for(let l=0;l<a;l++)this.positions[3*l]=2*r[2*l]/s-1,this.positions[3*l+1]=1-2*r[2*l+1]/o;if(a>0){let l=this.mesh.geometry.getAttribute("position");l.clearUpdateRanges(),l.addUpdateRange(0,3*a),l.needsUpdate=!0}this.mesh.geometry.setDrawRange(0,a),this.mesh.visible=a>0}extend(){}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}},Qi=class{key;group=new Zt;kind;follows;full;ticks;box;theme;lines;shown="";tips=[];constructor(e,t,i,r){this.key=r,this.kind=t.kind,this.theme=e.theme;let s=i.kind==="2d";this.box=t.kind==="axes"&&t.span==="box"&&s?t:null,t.kind==="axes"?(this.full=(t.span??(s?"full":"positive"))==="full",this.ticks=s&&this.full):(this.full=!1,this.ticks=s&&(t.labels??s)),this.follows=this.ticks||t.kind==="grid"&&Yu(i);let o=new cs({vertexColors:!0,transparent:!0,depthTest:!1,depthWrite:!1});this.lines=new Qs(new ft,o),this.lines.frustumCulled=!1,this.group.add(this.lines)}set(e,t){this.lines.geometry.dispose();let i=new ft;i.setAttribute("position",new Kt(e,3)),i.setAttribute("color",new Kt(t,4)),this.lines.geometry=i}layout(e,t,i=new O(1,1,1)){if(this.follows||this.box!==null)return;let r=e.getCenter(new O),s=e.getSize(new O),o=Math.max(s.x,s.y,s.z,1e-9),a=[],l=[],c=(u,h,f,d)=>{a.push(u.x,u.y,u.z,h.x,h.y,h.z),l.push(...f,d,...f,d)};if(this.kind==="axes"){let u=s.clone().multiply(i),h=Math.max(u.x,u.y,u.z,1e-9),f=p=>qu(Yu(t)&&p>1e-9*h?p:h,2),d=et(this.theme.foreground);this.tips=[new O(f(u.x)/i.x,0,0),new O(0,f(u.y)/i.y,0),new O(0,0,f(u.z)/i.z)];for(let p of this.tips)c(this.full?p.clone().negate():new O,p,d,.8)}else{let{right:u,up:h,normal:f}=bi(t.kind==="2d"?t:{kind:"2d",plane:t.up==="x"?"yz":t.up==="y"?"xz":"xy"}),d=qu(o,8),p=et(this.theme.grid),g=et(Un(this.theme.grid,this.theme.foreground,.3)),m=r.dot(u),y=r.dot(h),b=Math.abs(f.x)>.5?"x":Math.abs(f.y)>.5?"y":"z",_=new O;_[b]=1;let x=e.min[b]<=0&&e.max[b]>=0?0:r[b],S=2.5*o,w=Math.floor((m-S)/d),v=Math.ceil((m+S)/d),T=Math.floor((y-S)/d),P=Math.ceil((y+S)/d),C=(I,U)=>u.clone().multiplyScalar(I).addScaledVector(h,U).addScaledVector(_,x);for(let I=w;I<=v;I++)c(C(I*d,T*d),C(I*d,P*d),I===0?g:p,1);for(let I=T;I<=P;I++)c(C(w*d,I*d),C(v*d,I*d),I===0?g:p,1)}this.set(a,l)}follow(e,t){if(!this.follows)return;let i=[e.x0,e.x1,e.y0,e.y1,e.stepX,e.stepY].join(",");if(i===this.shown)return;this.shown=i;let{right:r,up:s}=bi(t),o=[],a=[],l=(c,u,h,f,d,p)=>{let g=r.clone().multiplyScalar(c).addScaledVector(s,u),m=r.clone().multiplyScalar(h).addScaledVector(s,f);o.push(g.x,g.y,g.z,m.x,m.y,m.z),a.push(...d,p,...d,p)};if(this.kind==="axes"){let c=et(this.theme.foreground);e.y0<=0&&e.y1>=0&&l(e.x0,0,e.x1,0,c,.5),e.x0<=0&&e.x1>=0&&l(0,e.y0,0,e.y1,c,.5)}else{let c=et(this.theme.grid),u=et(Un(this.theme.grid,this.theme.foreground,.3));for(let h of Ju(e.x0,e.x1,e.stepX))l(h,e.y0,h,e.y1,h===0?u:c,1);for(let h of Ju(e.y0,e.y1,e.stepY))l(e.x0,h,e.x1,h,h===0?u:c,1)}this.set(o,a)}extend(){}dispose(){this.lines.geometry.dispose(),this.lines.material.dispose()}},MT=100,wT=150;function L0(n,e,t){return new Pn(n,e,{samples:t,depthBuffer:!0,stencilBuffer:!0,minFilter:kt,magFilter:kt,generateMipmaps:!1})}function ET(){let n=new Rt({glslVersion:La,uniforms:{uUnderlay:{value:null}},vertexShader:"void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:"uniform sampler2D uUnderlay; out vec4 color; void main() { color = texelFetch(uUnderlay, ivec2(gl_FragCoord.xy), 0); }",depthTest:!1,depthWrite:!1,blending:Yi}),e=new bt(new qi(2,2),n);e.frustumCulled=!1;let t=new os;return t.add(e),{scene:t,camera:new On,material:n}}function TT(n,e){n.updateMatrixWorld();let t=n.matrixWorld.elements,i=n.projectionMatrix.elements,r=!1;for(let s=0;s<16;s++)e[s]!==t[s]&&(r=!0,e[s]=t[s]),e[16+s]!==i[s]&&(r=!0,e[16+s]=i[s]);return r}function AT(n,e){return n.x<e.x+e.z&&e.x<n.x+n.z&&n.y<e.y+e.w&&e.y<n.y+n.w}var op=class{id;scene=new os;staticScene=new os;underlay=new ct(-1,-1,-1,-1);underlayDirty=!0;staticKey="";rebuiltAt=-1/0;coarse=!1;cameraSeen=new Float64Array(32);camera=new On;cameraSpec={kind:"2d",plane:"xy"};controls=null;element=null;labels=null;clearance={header:0,bars:null};plan=null;error=null;draws=new Map;rect={x:0,y:0,w:1,h:1};outer={x:0,y:0,w:1,h:1};window=null;atWindow=!1;content="";needsFit=!0;userMoved=!1;fitting=!1;halfWidth=1;halfHeight=1;box=null;target=new O;turned=0;view=null;constructor(e){this.id=e}},I0=n=>JSON.stringify(n),CT=n=>n.kind==="3d"&&(n.auto_rotate??0)!==0,Ku=class{canvas;onChange=()=>{};onContext=()=>{};gl=null;canvasUsed=!1;preserveDrawingBuffer;ctx;panels=new Map;lastState=null;size={w:0,h:0,ratio:0};background;cacheStatic;coarseDrags;refineTimer=null;blit;underlay=null;scratch=null;viewport=new ct;cssViewport=new ct;cssScissor=new ct;buffer=new Me;region=new _a;corner=new Me;constructor(e,t,i,r={}){this.canvas=e,Ze.enabled=!1,this.preserveDrawingBuffer=r.preserveDrawingBuffer??!1,this.cacheStatic=r.cacheStatic??!0,this.coarseDrags=r.coarseDrags??!0,this.blit=ET();let s=r.theme??wl(t);this.background=new Fe(...et(s.background)),this.ctx={scene:t,geometry:i,shared:new ep,theme:s,disc:nT()}}get connected(){return this.gl!==null}get live(){return this.gl!==null&&!this.gl.getContext().isContextLost()}connect(){if(this.live)return;if(this.release(),this.canvasUsed){let i=this.canvas.cloneNode(!1);this.canvas.replaceWith(i),this.canvas=i}this.canvasUsed=!0;let e=new Bu({canvas:this.canvas,antialias:!0,stencil:!0,preserveDrawingBuffer:this.preserveDrawingBuffer});e.outputColorSpace=ss,e.autoClear=!1;let t=this.canvas;t.addEventListener("webglcontextlost",()=>{this.canvas===t&&this.gl!==null&&this.onContext()}),t.addEventListener("webglcontextrestored",()=>{if(this.canvas!==t||this.gl===null){t.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();return}this.dropTargets(),this.onContext(),this.onChange()}),this.gl=e,this.size={w:0,h:0,ratio:0}}release(){let e=this.gl;e!==null&&(this.gl=null,this.dropTargets(),e.dispose(),e.getContext().isContextLost()||e.forceContextLoss())}dropTargets(){this.underlay=null,this.scratch=null;for(let e of this.panels.values())e.underlayDirty=!0}setTheme(e){this.ctx.theme=e,this.background.setRGB(...et(e.background)),this.lastState=null;for(let t of this.panels.values())t.underlayDirty=!0}panel(e){let t=this.panels.get(e);return t||(t=new op(e),this.panels.set(e,t)),t}bind(e,t){let i=this.panel(e);i.element!==t&&(i.controls?.dispose(),i.controls=null,i.labels?.remove(),i.labels=null,i.element=t,t!==null&&(i.labels=document.createElement("div"),i.labels.className="labels",t.append(i.labels),this.makeControls(i)))}setClearance(e,t){this.panel(e).clearance=t}refit(e){let t=this.panels.get(e);t&&(t.needsFit=!0,t.userMoved=!1)}refitAll(){for(let e of this.panels.keys())this.refit(e)}offKeys(e){let t=this.panels.get(e);return t!==void 0&&t.userMoved&&t.cameraSpec.keyframes!==void 0}orbitPanels(){return[...this.panels.values()].filter(e=>e.cameraSpec.kind==="3d"&&e.controls!==null).map(e=>e.id)}viewFrom(e,t,i){let r=this.panels.get(e);if(r===void 0||r.cameraSpec.kind!=="3d"||r.controls===null)return;let s=r.controls.target,o=r.camera.position.distanceTo(s),a=u=>new O(u==="x"?1:0,u==="y"?1:0,u==="z"?1:0),l=a(t).multiplyScalar(i),c=r.cameraSpec.up??"z";t===c&&l.addScaledVector(a({x:"z",y:"x",z:"y"}[c]),-i*1e-4).normalize(),r.camera.position.copy(s).addScaledVector(l,o),r.camera.lookAt(s),r.controls.update()}turnBy(e,t){let i=this.panels.get(e);i===void 0||i.cameraSpec.kind!=="3d"||i.controls===null||i.controls.rotateLeft(t*Math.PI/180)}makeControls(e){if(e.controls?.dispose(),e.controls=null,e.element===null)return;e.camera.up.copy(bi(e.cameraSpec).up);let t=new Gu(e.camera,e.element);t.enableDamping=!1,t.screenSpacePanning=!0,e.cameraSpec.kind==="2d"&&(t.enableRotate=!1,t.zoomToCursor=!0,t.mouseButtons={LEFT:ii.PAN,MIDDLE:ii.DOLLY,RIGHT:ii.PAN},t.touches={ONE:fi.PAN,TWO:fi.DOLLY_PAN}),t.addEventListener("change",()=>{e.fitting||(e.cameraSpec.kind==="3d"&&e.cameraSpec.keyframes!==void 0&&e.camera.up.copy(bi(e.cameraSpec).up),e.userMoved=!0,this.onChange())}),e.controls=t}setCamera(e,t){e.cameraSpec=t;let i=t.kind==="2d"||t.projection==="orthographic";e.camera=i?new On(-1,1,1,-1,-1,1):new bn(35,1,.01,100);let r=Cr(t);e.scene.scale.copy(r),e.staticScene.scale.copy(r),e.underlayDirty=!0,e.needsFit=!0,e.userMoved=!1,this.makeControls(e)}drawStatic(e){if(e.staticScene.children.length===0)return;let t=this.gl;if(!this.cacheStatic||CT(e.cameraSpec)){t.render(e.staticScene,e.camera);return}let i=t.getDrawingBufferSize(this.buffer);if(this.underlay===null||this.underlay.width!==i.x||this.underlay.height!==i.y){this.underlay?.dispose(),this.underlay=L0(i.x,i.y,0),t.initRenderTarget(this.underlay);for(let s of this.panels.values())s.underlayDirty=!0}let r=t.getCurrentViewport(this.viewport);if(r.equals(e.underlay)||(e.underlay.copy(r),e.underlayDirty=!0),TT(e.camera,e.cameraSeen)&&(e.underlayDirty=!0),e.underlayDirty){e.underlayDirty=!1;let s=performance.now();e.coarse=this.coarseDrags&&s-e.rebuiltAt<MT,e.rebuiltAt=s,e.coarse?(this.drawCoarse(e,this.underlay,r),this.scheduleRefine()):this.drawFine(e,this.underlay,r);for(let o of this.panels.values())o!==e&&AT(o.underlay,r)&&(o.underlayDirty=!0);t.setViewport(t.getViewport(this.cssViewport)),t.setScissor(t.getScissor(this.cssScissor))}this.blit.material.uniforms.uUnderlay.value=this.underlay.texture,t.render(this.blit.scene,this.blit.camera)}drawCoarse(e,t,i){let r=this.gl;t.viewport.copy(i),t.scissor.copy(i),t.scissorTest=!0,r.setRenderTarget(t),r.clear(!0,!1,!0),r.render(e.staticScene,e.camera),r.setRenderTarget(null)}scheduleRefine(){this.refineTimer!==null&&clearTimeout(this.refineTimer),this.refineTimer=setTimeout(()=>{this.refineTimer=null;for(let e of this.panels.values())e.coarse&&(e.underlayDirty=!0,e.rebuiltAt=-1/0);this.onChange()},wT)}drawFine(e,t,i){let r=this.gl,s=this.scratch;(s===null||s.width<i.z||s.height<i.w)&&(s?.dispose(),s=this.scratch=L0(Math.max(i.z,s?.width??0),Math.max(i.w,s?.height??0),4)),s.viewport.set(0,0,i.z,i.w),s.scissor.set(0,0,i.z,i.w),s.scissorTest=!0,r.setRenderTarget(s),r.clear(!0,!1,!0),r.render(e.staticScene,e.camera),r.setRenderTarget(null),this.region.min.set(0,0),this.region.max.set(Math.min(i.z,t.width-i.x),Math.min(i.w,t.height-i.y)),r.copyTextureToTexture(s.texture,t.texture,this.region,this.corner.set(i.x,i.y))}disposePanel(e){for(let t of e.draws.values())t.dispose();e.draws.clear(),e.controls?.dispose(),e.labels?.remove(),this.panels.delete(e.id)}replan(e,t){let i=this.ctx.scene,r;try{r=iT(i,this.ctx.geometry,t,e.id),e.error=null}catch(d){if(!(d instanceof pn))throw d;e.error=d.message,e.plan=null;for(let p of e.draws.values())p.group.visible=!1;return}let s=e.plan,o=r.declared.camera??{kind:"2d",plane:"xy"};(s===null||s.declaredId!==r.declaredId||I0(o)!==I0(e.cameraSpec))&&this.setCamera(e,o);let a=rT(r);a!==e.content&&(e.content=a,e.needsFit=!0,e.userMoved=!1),e.plan=r;let l=new Set,c=JSON.stringify(this.ctx.theme);try{for(let d of r.layers){let p;if(d.kind==="trajectories"){if(d.set===null)continue;let b=`${JSON.stringify(d.color??null)}\0${c}`;p=`trajectory\0${r.declaredId}\0${d.index}\0${d.set.id}\0${r.display}\0${d.channel??""}\0${b}`}else if(d.kind==="arrow"){if(d.set===null)continue;let b=JSON.stringify([d.layer.color??null,c,d.layer.opacity,d.layer.width,d.layer.head]);p=`arrow\0${r.declaredId}\0${d.index}\0${d.set.id}\0${r.display}\0${d.channel}\0${b}`}else if(d.kind==="inset_box")p=`inset_box\0${r.declaredId}\0${d.index}\0${JSON.stringify([d.layer,c])}`;else if(d.kind==="points"||d.kind==="label"){if(d.kind==="points"&&d.set===null)continue;let b=d.kind==="points"?JSON.stringify(d.color??null):"";p=`${d.kind}\0${r.declaredId}\0${d.index}\0${d.set?.id??""}\0${r.display}\0${JSON.stringify(d.layer)}\0${b}\0${c}`}else d.kind==="morph"||d.kind==="surface"?p=`${d.kind}\0${r.declaredId}\0${d.index}\0${JSON.stringify(d.layer)}\0${c}`:p=`${d.kind}\0${r.declaredId}\0${d.index}\0${r.display}\0${c}`;l.add(d.index);let g=e.draws.get(d.index);if(g!==void 0&&g.key===p){g.group.visible=!0;continue}g!==void 0&&(g.group.removeFromParent(),g.dispose(),e.draws.delete(d.index));let m=d.kind==="trajectories"?new Rr(this.ctx,d,r.display,p):d.kind==="arrow"?new Zu(this.ctx,d,p):d.kind==="inset_box"?new Va(this.ctx,d.layer,p):d.kind==="body"?new Pr(this.ctx,d.layer,p,()=>{e.underlayDirty=!0,this.onChange()}):d.kind==="points"?new za(this.ctx,d,p):d.kind==="label"?new Ha(d.layer,p):d.kind==="morph"?new po(this.ctx,d.layer,p):d.kind==="surface"?new go(this.ctx,d.layer,p):new Qi(this.ctx,d.layer,e.cameraSpec,p);m.group.renderOrder=d.index;let y=0;for(let b of m.group.children)b.renderOrder=256*d.index+y++;e.draws.set(d.index,m),m instanceof Qi&&e.box!==null&&m.layout(e.box,e.cameraSpec,Cr(e.cameraSpec))}}catch(d){if(!(d instanceof pn))throw d;e.error=d.message,e.plan=null;for(let p of e.draws.values())p.group.visible=!1;return}for(let[d,p]of[...e.draws])l.has(d)||(p.group.removeFromParent(),p.dispose(),e.draws.delete(d));let u=[],h=!0;for(let d of r.layers){let p=e.draws.get(d.index);p!==void 0&&(h&&=p instanceof Rr&&p.isStatic,(h?e.staticScene:e.scene).add(p.group),h&&u.push(p.key))}let f=u.join(`
`);f!==e.staticKey&&(e.staticKey=f,e.underlayDirty=!0)}advance(e,t,i){let r=e.plan;if(r===null)return;let s=this.ctx.scene,o={scope:r.scope,frames:this.ctx.geometry.frames,clock:s.clock,channel:t.clock.channel,q:i,display:r.display};e.error=null;let a=e.cameraSpec.kind==="2d"?Ss(e.cameraSpec):[0,1];try{for(let l of r.layers){let c=e.draws.get(l.index);c instanceof Rr&&l.kind==="trajectories"?(c.planeAxes=a,c.update(l,s,i)&&c.isStatic&&(e.underlayDirty=!0),c.referenceContext&&c.place(o,r.reference)):c instanceof Zu&&l.kind==="arrow"?c.update(Ni(o,l.layer),l):c instanceof Va&&l.kind==="inset_box"?c.update(o,r.reference):c instanceof Pr&&l.kind==="body"?c.update(o,l.layer,r.reference):c instanceof za&&l.kind==="points"?c.update(Ni(o,l.layer),l):c instanceof Ha&&l.kind==="label"?c.update(o,l,r.reference):(c instanceof po&&l.kind==="morph"||c instanceof go&&l.kind==="surface")&&c.update(o,l.layer)}}catch(l){if(!(l instanceof pn))throw l;e.error=l.message}}fit(e){let t=new di,i=e.plan===null?null:lT(e.plan,this.ctx.geometry);if(i!==null)t.set(new O(i[0],i[1],i[2]),new O(i[3],i[4],i[5]));else for(let d of e.draws.values())(d instanceof Pr&&d.group.visible||d instanceof za||d instanceof po||d instanceof go)&&d.extend(t);t.isEmpty()&&t.set(new O(-1,-1,-1),new O(1,1,1));let r=e.cameraSpec,s=Cr(r),o=new di(t.min.clone().multiply(s),t.max.clone().multiply(s)),a=o.getCenter(new O),l=o.getSize(new O),c=Math.max(l.length()/2,1e-9),{up:u,normal:h}=bi(r),f=e.camera;if(e.fitting=!0,f instanceof On){({halfWidth:e.halfWidth,halfHeight:e.halfHeight}=cT(o,r,e.rect.w/Math.max(1,e.rect.h)));let d=4*c+1,p=10*(a.length()+d+c);f.near=-p,f.far=p,f.zoom=1,f.position.copy(a).addScaledVector(h,d)}else{let d=c/Math.sin(f.fov*Math.PI/360)*1.08;f.near=d/1e3,f.far=d*1e3+a.length(),f.position.copy(a).addScaledVector(h,d)}f.up.copy(u),f.lookAt(a),e.target.copy(a),e.turned=0,this.aspect(e),e.controls&&(e.controls.target.copy(a),e.controls.update());for(let d of e.draws.values())d instanceof Qi&&d.layout(t,r,s);e.box=t,e.fitting=!1,e.needsFit=!1,e.atWindow=!1}aspect(e){let t=e.rect.w/Math.max(1,e.rect.h),i=e.camera;i instanceof On?(Yu(e.cameraSpec)||(e.halfWidth=e.halfHeight*t),i.top=e.halfHeight,i.bottom=-e.halfHeight,i.left=-e.halfWidth,i.right=e.halfWidth):i.aspect=t,i.updateProjectionMatrix()}autoRotate(e,t){let i=e.cameraSpec;if(i.kind!=="3d"||i.auto_rotate===void 0)return;let r=i.auto_rotate*t*Math.PI/180,s=e.controls?.target??e.target;e.camera.position.sub(s).applyAxisAngle(bi(i).up,r-e.turned).add(s),e.camera.lookAt(s),e.turned=r}follow(e){let t=e.cameraSpec;if(e.view=t.kind==="2d"&&e.camera instanceof On?hT(e.camera,t,e.rect.w,e.rect.h):null,!(e.view===null||t.kind!=="2d"))for(let i of e.draws.values())i instanceof Qi&&i.follow(e.view,t)}renderAt(e,t,i,r,s){let o=this.gl;if(o===null)return new Map;let a=Math.max(1,Math.floor(i)),l=Math.max(1,Math.floor(r));(a!==this.size.w||l!==this.size.h||s!==this.size.ratio)&&(o.setPixelRatio(s),o.setSize(a,l,!1),this.size={w:a,h:l,ratio:s});let c=Ht(this.ctx.scene.clock,t),u=Xu($a(e.layout,c),{x:0,y:0,w:a,h:l},Qu);for(let d of[...this.panels.values()])Object.hasOwn(e.panels,d.id)||this.disposePanel(d);let h=e!==this.lastState;this.lastState=e;let f=new Map;o.setScissorTest(!1),o.setClearColor(this.background,1),o.clear(),o.setScissorTest(!0);for(let[d,p]of u.panels){let g=this.panel(d);(h||g.plan===null)&&this.replan(g,e);let y=RT(p,g.plan?.declared.margin),b=y.w!==g.rect.w||y.h!==g.rect.h;g.outer=p,g.rect=y,this.advance(g,e,t),g.needsFit||b&&!g.userMoved?this.fit(g):b&&this.aspect(g),this.keyed(g,e,t),this.keyed3d(g,t),this.autoRotate(g,t),this.follow(g);for(let w of g.draws.values())w instanceof Pr&&w.clip(g.camera);let _=g.camera instanceof On?g.camera:null,x=_===null?1:g.rect.w/Math.max(1e-12,(_.right-_.left)/_.zoom),S=_===null?1:g.rect.h/Math.max(1e-12,(_.top-_.bottom)/_.zoom);for(let w of g.draws.values())w instanceof Rr&&w.setPixels(x,S);for(let w of g.draws.values())w instanceof Rr&&w.placeDash(g.camera,g.rect,a,l,1/s)}for(let[d]of u.panels){let p=this.panel(d),g=p.rect;if(p.error!==null){f.set(d,p.error);continue}if(g.w<1||g.h<1||lt(p.plan?.declared.opacity,c)<=0)continue;for(let y of p.draws.values())y.resize?.(g.w,g.h);for(let y of p.draws.values())y instanceof Va&&y.place(p,y.target===null?void 0:this.panels.get(y.target));let m=l-g.y-g.h;o.setViewport(g.x,m,g.w,g.h),o.setScissor(g.x,m,g.w,g.h),this.drawStatic(p),o.render(p.scene,p.camera),this.placeLabels(p)}return o.setScissorTest(!1),f}labelItems(e){if(e.plan===null)return[];let t=[],i=[],r=[],s=this.ctx.scene.frames[e.plan.display],o=s?.axes??["x","y","z"],{normal:a}=bi(e.cameraSpec),l=Cr(e.cameraSpec),c=e.rect.x-e.outer.x,u=e.rect.y-e.outer.y,h=pT(e.clearance,e.outer.w),f=(g,m,y,b)=>{let _=m.clone().multiply(l).project(e.camera),x=(_.x+1)/2*e.rect.w+y,S=(1-_.y)/2*e.rect.h,w=_.z>-1&&_.z<1&&x>=0&&x<=e.rect.w&&S>=0&&S<=e.rect.h,v={text:g,x:x+c,y:S+u,hidden:b||!w};return t.push(v),v},d=[...e.draws.values()].filter(g=>g instanceof Qi);if(e.view!==null&&e.cameraSpec.kind==="2d"){let[g,m]=Ss(e.cameraSpec),y=x=>Jf(o[x],s?.unit),b=d.some(x=>x.follows&&x.kind==="axes"),_=d.some(x=>x.ticks);for(let x of mT(e.view,_,b?[y(g),y(m)]:null,e.clearance.header-u)){let S={...x,x:x.x+c,y:x.y+u,hidden:!1};t.push(S),x.kind==="title"&&i.push(S)}}for(let g of e.draws.values())if(g instanceof Qi&&g.kind==="axes"&&!g.follows&&g.box===null)g.tips.forEach((m,y)=>{let b=Jf(o[y],void 0),_=l.getComponent(y),x=yi(b)!==""&&_!==1?O0(b,` \xD7${Number(_.toPrecision(4))}`):b;i.push(f(x,m,4,e.cameraSpec.kind==="2d"&&Math.abs(m.clone().normalize().dot(a))>.99))});else if(g instanceof Pr&&g.label!==null&&g.at!==null&&g.group.visible){let m=f(g.label,g.at,g.size/2+3,!1);if(h!==null&&A0(m,h)){t.pop();let y=f(g.label,g.at,-(g.size/2+3),!1);y.align="end",r.push(y)}else r.push(m)}if(h!==null)for(let g of t)A0(g,h)&&(g.hidden=!0);let p=r.filter(g=>!g.hidden);for(let g of i)p.some(m=>fT(g,m))&&(g.hidden=!0);return t}labels(e){let t=this.panels.get(e);return t===void 0?[]:this.labelItems(t).filter(i=>!i.hidden).map(({hidden:i,...r})=>r)}colorbars(e){let t=this.panels.get(e),i=[];if(t===void 0)return i;for(let r of t.draws.values()){if(!(r instanceof Rr)||!r.group.visible)continue;let s=r.colorbar();s!==null&&i.push(s)}return y0(i)}placeLabels(e){let t=e.labels;if(t===null)return;let i=this.labelItems(e);for(;t.children.length<i.length;)t.appendChild(document.createElement("span"));for(;t.children.length>i.length;)t.lastChild.remove();i.forEach((r,s)=>{let o=t.children[s];dT(o,r.text),o.hidden=r.hidden;let a=r.align==="center"?"-50%":r.align==="end"?"-100%":"0";o.style.transformOrigin="0 0",o.style.fontSize=r.kind==="title"?"13px":"",o.style.transform=`translate(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px)${r.rotate?" rotate(-90deg)":""} translate(${a}, -50%)`})}keyed(e,t,i){let r=e.cameraSpec;if(e.window=null,r.kind!=="2d"||r.keyframes===void 0||e.plan===null||e.userMoved||!(e.camera instanceof On))return;let s=this.ctx.scene,o={scope:e.plan.scope,frames:this.ctx.geometry.frames,clock:s.clock,channel:t.clock.channel,q:i,display:e.plan.display},a;try{a=Ih(o,e.plan.declared,this.ctx.geometry.sets,e.plan.reference)}catch(b){if(!(b instanceof pn))throw b;e.error=b.message;return}if(a===null){e.atWindow&&this.fit(e);return}e.window=a,e.atWindow=!0;let l=e.camera,{right:c,up:u,normal:h}=bi(r),f=e.rect.w/Math.max(1,e.rect.h),d=a.width/2,p=a.height!==null?a.height/2:d/f,g=l.position.dot(h),m=c.clone().multiplyScalar(a.center[0]).addScaledVector(u,a.center[1]),y=m.clone().addScaledVector(h,e.target.dot(h));e.fitting=!0,e.halfWidth=d,e.halfHeight=p,l.left=-d,l.right=d,l.top=p,l.bottom=-p,l.zoom=1,l.position.copy(m).addScaledVector(h,g),l.up.copy(u),l.lookAt(y),l.updateProjectionMatrix(),e.target.copy(y),e.controls&&(e.controls.target.copy(y),e.controls.update()),e.fitting=!1}keyed3d(e,t){let i=e.cameraSpec;if(i.kind!=="3d"||i.keyframes===void 0||e.userMoved)return;let r=Rp(i.keyframes,Ht(this.ctx.scene.clock,t)),s=(_,x,S)=>new O(_,x,S),[o,a,l]=i.up==="x"?[s(0,1,0),s(0,0,1),s(1,0,0)]:i.up==="y"?[s(0,0,1),s(1,0,0),s(0,1,0)]:[s(1,0,0),s(0,1,0),s(0,0,1)],c=r.azimuth*Math.PI/180,u=r.elevation*Math.PI/180,h=o.clone().multiplyScalar(Math.cos(c)).addScaledVector(a,Math.sin(c)),f=h.clone().multiplyScalar(Math.cos(u)).addScaledVector(l,Math.sin(u)),d=h.clone().multiplyScalar(-Math.sin(u)).addScaledVector(l,Math.cos(u)),p=new O(...r.center).multiply(Cr(i)),g=e.rect.w/Math.max(1,e.rect.h),m=r.width/2,y=(e.box===null||e.box.isEmpty()?0:e.box.getSize(new O).multiply(Cr(i)).length())+p.length()+r.width,b=e.camera;if(e.fitting=!0,b instanceof On)e.halfWidth=m,e.halfHeight=m/g,b.left=-m,b.right=m,b.top=e.halfHeight,b.bottom=-e.halfHeight,b.zoom=1,b.near=-10*y,b.far=10*y,b.position.copy(p).addScaledVector(f,y);else if(b instanceof bn){let _=m/(Math.tan(b.fov*Math.PI/360)*g);b.aspect=g,b.near=_/1e3,b.far=_+10*y,b.position.copy(p).addScaledVector(f,_)}b.up.copy(d),b.lookAt(p),b.updateProjectionMatrix(),e.target.copy(p),e.controls&&e.controls.target.copy(p),e.fitting=!1}async ready(){let e=[];for(let t of this.panels.values())for(let i of t.draws.values())i instanceof Pr&&e.push(i.ready);await Promise.all(e)}paintInfo(e){let t=this.panels.get(e);if(t===void 0||t.plan===null||t.error!==null)return null;let i=this.ctx.scene,r=Cr(t.cameraSpec),s=c=>{let u=c.clone().multiply(r).project(t.camera);return u.z>-1&&u.z<1?[t.rect.x+(u.x+1)/2*t.rect.w,t.rect.y+(1-u.y)/2*t.rect.h]:null},o=[],a=null,l;for(let c of t.plan.layers){let u=t.draws.get(c.index);if(u instanceof Ha){let h=u.layer.at,f,d=h!==null&&typeof h=="object"&&"screen"in h&&h.screen!==void 0;d?f=[t.rect.x+h.screen[0]*t.rect.w,t.rect.y+h.screen[1]*t.rect.h]:f=u.at===null?null:s(u.at),f!==null&&o.push({layer:u.layer,x:f[0],y:f[1],clip:!d})}else if(u instanceof Qi&&u.box!==null&&t.view!==null&&t.cameraSpec.kind==="2d"){let h=i.frames[t.plan.display],f=h?.axes,[d,p]=Ss(t.cameraSpec),g=y=>Jf(f?.[y],h?.unit),m=u.box.ticks??["x","y"];a={rect:t.rect,x0:t.view.x0,x1:t.view.x1,y0:t.view.y0,y1:t.view.y1,ticks:{x:m.includes("x"),y:m.includes("y")},size:u.box.size??Qy,titles:[g(d),g(p)],opacity:u.box.opacity},l=u.box.titles}}return{outer:t.outer,rect:t.rect,opacity:t.plan.declared.opacity,labels:o,box:a,...l!==void 0?{boxTitles:l}:{}}}dispose(){for(let e of[...this.panels.values()])this.disposePanel(e);this.refineTimer!==null&&clearTimeout(this.refineTimer),this.blit.material.dispose(),this.ctx.disc.dispose(),this.release()}};function RT(n,e){if(e===void 0)return n;let t=Math.round((e.left??0)*n.w),i=Math.round((e.right??0)*n.w),r=Math.round((e.top??0)*n.h),s=Math.round((e.bottom??0)*n.h);return{x:n.x+t,y:n.y+r,w:Math.max(0,n.w-t-i),h:Math.max(0,n.h-r-s)}}function $a(n,e){if(n.kind==="panel")return n;let t=$a(n.a,e),i=$a(n.b,e),r=n.keyframes===void 0?n.ratio:Math.min(1,Math.max(0,_s(n.keyframes,e)));return t===n.a&&i===n.b&&r===n.ratio?n:{...n,ratio:r,a:t,b:i}}var lp=class{order=[];budget;constructor(e){this.budget=e}use(e,t){this.forget(e),this.order.push({holder:e,shown:t}),this.settle()}settle(){let e=this.order.filter(t=>t.holder.live).length;for(let t of[...this.order]){if(e<=this.budget)break;t.shown||!t.holder.live||(t.holder.release(),e--)}this.wake()}room(e){return this.order.filter(t=>t.holder!==e&&t.shown&&t.holder.live).length<this.budget}drop(e){this.forget(e),this.wake()}forget(e){let t=this.order.findIndex(i=>i.holder===e);t>=0&&this.order.splice(t,1)}wake(){for(let e of this.order)e.shown&&!e.holder.live&&this.room(e.holder)&&e.holder.onChange()}},yo=new lp(8);var je=n=>{let e=parseFloat(n);return Number.isFinite(e)?e:0};function B0(n){let e=[],t=0,i=0;for(let r=0;r<n.length;r++)n[r]==="("?t++:n[r]===")"?t--:n[r]===","&&t===0&&(e.push(n.slice(i,r).trim()),i=r+1);return e.push(n.slice(i).trim()),e.filter(r=>r!=="")}var z0=/^(rgba?\([^)]*\)|#[0-9a-f]+|[a-z]+)/i;function H0(n){return n==="none"||n===""?[]:B0(n).map(e=>{let t=z0.exec(e)?.[0]??"transparent",i=e.slice(t.length),r=[...i.matchAll(/-?[\d.]+px/g)].map(s=>je(s[0]));return{color:t,x:r[0]??0,y:r[1]??0,blur:r[2]??0,spread:r[3]??0,inset:/\binset\b/.test(i)}})}function PT(n){let e=/^linear-gradient\((.*)\)$/.exec(n.trim());if(e===null)return null;let t=B0(e[1]),i=[0,1],r={"to top":[0,-1],"to bottom":[0,1],"to left":[-1,0],"to right":[1,0]};if(r[t[0]]!==void 0)i=r[t.shift()];else if(/^-?[\d.]+deg$/.test(t[0])){let o=je(t.shift())*Math.PI/180;i=[Math.sin(o),-Math.cos(o)]}let s=t.map((o,a)=>{let l=z0.exec(o)?.[0]??"transparent",c=/(-?[\d.]+)%/.exec(o.slice(l.length));return[c===null?t.length===1?0:a/(t.length-1):Math.min(1,Math.max(0,je(c[1])/100)),l]});return{dir:i,stops:s}}var th=n=>n==="transparent"||n===""||/rgba\([^)]*,\s*0\)$/.test(n);function V0(n,e,t){let i=n.getTransform(),r=1e5;n.save(),n.shadowColor=e.color,n.shadowBlur=e.blur*Math.hypot(i.a,i.b),n.shadowOffsetX=-r*i.a+(e.x*i.a+e.y*i.c),n.shadowOffsetY=-r*i.b+(e.x*i.b+e.y*i.d),n.fillStyle="#000",t(r),n.restore()}function LT(n,e,t,i,r,s){let o=s.borderTopStyle==="none"?0:je(s.borderTopWidth),a=s.borderRightStyle==="none"?0:je(s.borderRightWidth),l=s.borderBottomStyle==="none"?0:je(s.borderBottomWidth),c=s.borderLeftStyle==="none"?0:je(s.borderLeftWidth),u=[[o,s.borderTopColor,[e,t,e+i,t,e+i-a,t+o,e+c,t+o]],[a,s.borderRightColor,[e+i,t,e+i,t+r,e+i-a,t+r-l,e+i-a,t+o]],[l,s.borderBottomColor,[e+i,t+r,e,t+r,e+c,t+r-l,e+i-a,t+r-l]],[c,s.borderLeftColor,[e,t+r,e,t,e+c,t+o,e+c,t+r-l]]];for(let[h,f,d]of u)if(!(h<=0||th(f))){n.fillStyle=f,n.beginPath(),n.moveTo(d[0],d[1]);for(let p=2;p<8;p+=2)n.lineTo(d[p],d[p+1]);n.closePath(),n.fill()}}function G0(n,e,t,i,r,s){for(let a of H0(s.boxShadow).reverse())a.inset||th(a.color)||(a.blur===0?(n.fillStyle=a.color,n.fillRect(e+a.x-a.spread,t+a.y-a.spread,i+2*a.spread,r+2*a.spread)):V0(n,a,l=>n.fillRect(e-a.spread+l,t-a.spread,i+2*a.spread,r+2*a.spread)));th(s.backgroundColor)||(n.fillStyle=s.backgroundColor,n.fillRect(e,t,i,r));let o=PT(s.backgroundImage);if(o!==null){let[a,l]=o.dir,c=(Math.abs(i*a)+Math.abs(r*l))/2,u=e+i/2,h=t+r/2,f=n.createLinearGradient(u-a*c,h-l*c,u+a*c,h+l*c);for(let[d,p]of o.stops)f.addColorStop(d,p);n.fillStyle=f,n.fillRect(e,t,i,r)}LT(n,e,t,i,r,s)}var IT=n=>n!=="none"&&n!==""&&!/^matrix\(1, 0, 0, 1, [^,]+, [^,]+\)$/.test(n),kT=n=>`${n.fontStyle} ${n.fontWeight} ${n.fontSize} ${n.fontFamily}`;function Wa(n,e,t,i,r){i=NT(n,i),n.font=kT(r),n.textAlign="left",n.textBaseline="alphabetic",n.letterSpacing=r.letterSpacing==="normal"?"0px":r.letterSpacing;for(let s of H0(r.textShadow).reverse())th(s.color)||V0(n,s,o=>n.fillText(e,t+o,i));n.fillStyle=r.color,n.fillText(e,t,i)}function DT(n,e){let t=n.getTransform(),i=Math.hypot(t.a,t.b)||1;n.font=`${e.fontStyle} ${e.fontWeight} ${je(e.fontSize)*i}px ${e.fontFamily}`;let r=n.measureText("Hg");return[Math.round(r.fontBoundingBoxAscent)/i,Math.round(r.fontBoundingBoxDescent)/i]}function $0(n,e,t,i,r){let s=n.getTransform();if(s.b!==0||s.c!==0||s.a===0||s.d===0)return[e,t,i,r];let o=l=>(Math.round(l*s.a+s.e)-s.e)/s.a,a=l=>(Math.round(l*s.d+s.f)-s.f)/s.d;return[o(e),a(t),o(e+i)-o(e),a(t+r)-a(t)]}function NT(n,e){let t=n.getTransform();return t.b!==0||t.c!==0||t.d===0?e:(Math.round(e*t.d+t.f)-t.f)/t.d}function F0(n,e,t){let i=n.getTransform(),r=Math.hypot(i.a,i.b)||1;return t+Math.round((e-t)*r)/r}function W0(n,e){let t=e.getBoundingClientRect(),i=e.offsetWidth||t.width,r={x:t.left,y:t.top,scale:i>0?t.width/i:1,baselines:new Map,base:n.getTransform()},s=new Map;j0(e,s);try{for(let[o,a]of s)r.baselines.set(o,bo(r,a.getBoundingClientRect()));X0(n,e,r,null)}finally{for(let o of s.values())o.remove()}}function j0(n,e){if(!n.checkVisibility())return;let t=/flex|grid/.test(getComputedStyle(n).display);for(let i of[...(n.shadowRoot??n).childNodes])if(i.nodeType===Node.TEXT_NODE&&!t&&i.data.trim()!==""){let r=document.createElement("tycho-probe");r.style.cssText="display: inline-block; width: 0; height: 0; margin: 0; padding: 0; border: 0; vertical-align: baseline;",i.parentNode.insertBefore(r,i),e.set(i,r)}else i instanceof HTMLElement&&!(i instanceof HTMLStyleElement)&&!(i instanceof HTMLScriptElement)&&j0(i,e)}function bo(n,e){return{x:(e.left-n.x)/n.scale,y:(e.top-n.y)/n.scale,w:e.width/n.scale,h:e.height/n.scale}}function X0(n,e,t,i,r=0){if(!e.checkVisibility())return;let s=getComputedStyle(e),o=IT(s.transform),a,l,c,u;if(n.save(),i===null&&!o)({x:a,y:l,w:c,h:u}=bo(t,e.getBoundingClientRect()));else{if(c=e.offsetWidth,u=e.offsetHeight,i!==null)[a,l]=[i.x+e.offsetLeft,i.y+e.offsetTop];else{let f=e.offsetParent,d=f===null?{x:0,y:0}:bo(t,f.getBoundingClientRect()),p=f===null?null:getComputedStyle(f);a=d.x+e.offsetLeft+(p===null?0:je(p.borderLeftWidth)),l=d.y+e.offsetTop+(p===null?0:je(p.borderTopWidth))}if(o){let[f,d]=s.transformOrigin.split(" ").map(je),p=new DOMMatrix(s.transform);n.translate(a+f,l+d),n.transform(p.a,p.b,p.c,p.d,p.e,p.f),n.translate(-f,-d),[a,l]=[0,0]}}let h=o||i!==null;if(!h&&s.transform!=="none"&&(r=l),n.globalAlpha*=je(s.opacity),o||([a,l,c,u]=$0(n,a,l,c,u)),e instanceof HTMLCanvasElement?e.width>0&&e.height>0&&n.drawImage(e,a,l,c,u):G0(n,a,l,c,u,s),s.overflowX!=="visible"||s.overflowY!=="visible"){let f=je(s.borderLeftWidth),d=je(s.borderTopWidth);n.beginPath(),n.rect(a+f,l+d,c-f-je(s.borderRightWidth),u-d-je(s.borderBottomWidth)),n.clip()}U0(n,e,"::before",a,l,c,u,s);for(let f of(e.shadowRoot??e).childNodes)f.nodeType===Node.TEXT_NODE?OT(n,f,t,s,h?{x:a,y:l}:null,r):f instanceof HTMLElement&&!(f instanceof HTMLStyleElement)&&!(f instanceof HTMLScriptElement)&&X0(n,f,t,h?f.offsetParent===e?{x:a,y:l}:i:null,r);U0(n,e,"::after",a,l,c,u,s),n.restore()}function OT(n,e,t,i,r,s){let o=e.data;if(o.trim()==="")return;let a=t.baselines.get(e);if(r!==null&&a!==void 0){let b=n.getTransform().inverse().multiply(t.base).transformPoint(new DOMPoint(a.x,a.y));Wa(n,o,b.x,F0(n,b.y,0),i);return}let[l,c]=DT(n,i);if(r!==null){let b=i.lineHeight==="normal"?l+c:je(i.lineHeight);Wa(n,o,r.x+je(i.paddingLeft)+je(i.borderLeftWidth),r.y+je(i.paddingTop)+je(i.borderTopWidth)+(b-l-c)/2+l,i);return}let u=document.createRange();u.selectNodeContents(e);let h=u.getClientRects()[0];if(h===void 0)return;let f=bo(t,h).y,d=b=>a===void 0?b+l:F0(n,a.y+b-f,s),p=(b,_)=>{u.setStart(e,b),u.setEnd(e,_);let x=u.getClientRects()[0];return x===void 0?null:bo(t,x)};if(/tabular-nums/.test(i.fontVariantNumeric)){for(let b=0;b<o.length;b++){let _=/\s/.test(o[b])?null:p(b,b+1);_!==null&&Wa(n,o[b],_.x,d(_.y),i)}return}u.selectNodeContents(e);let g=[...u.getClientRects()],m=o.split(`
`);if(g.length===m.length){g.forEach((b,_)=>{let x=bo(t,b);Wa(n,m[_],x.x,d(x.y),i)});return}let y=0;for(let b of o.split(/(\s+)/)){let _=b.trim()===""?null:p(y,y+b.length);_!==null&&Wa(n,b,_.x,d(_.y),i),y+=b.length}}function U0(n,e,t,i,r,s,o,a){let l=getComputedStyle(e,t);if(l.content==="none"||l.content==="normal"||l.display==="none"||l.position!=="absolute")return;let c=i+je(a.borderLeftWidth),u=r+je(a.borderTopWidth),h=s-je(a.borderLeftWidth)-je(a.borderRightWidth),f=o-je(a.borderTopWidth)-je(a.borderBottomWidth),d=je(l.borderLeftWidth)+je(l.borderRightWidth)+je(l.paddingLeft)+je(l.paddingRight),p=je(l.borderTopWidth)+je(l.borderBottomWidth)+je(l.paddingTop)+je(l.paddingBottom),g=S=>S==="auto"||S==="",m=(S,w,v,T,P)=>{let C=g(v)?g(S)||g(w)?0:T-je(S)-je(w)-P:je(v);l.boxSizing==="border-box"&&!g(v)&&(C-=P);let I=C+P;return[g(S)?g(w)?0:T-je(w)-I:je(S),I]},[y,b]=m(l.left,l.right,l.width,h,d),[_,x]=m(l.top,l.bottom,l.height,f,p);n.save(),n.globalAlpha*=je(l.opacity),G0(n,...$0(n,c+y,u+_,b,x),l),n.restore()}function ih(){return Object.create(null)}function nh(n,e,t){let i=ih();for(let[r,s]of Object.entries(n??{}))r!==e&&s!==void 0&&(i[r]=s);return t!==void 0&&(i[e]=t),i}var FT=(n,e)=>(n%e+e)%e,Xa=class{snap;index=0;play=!1;frameCount;listeners=new Set;constructor(e,t){this.snap=e,this.frameCount=t}get state(){return this.snap}get frame(){return this.index}get playing(){return this.play}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e){for(let t of[...this.listeners])t(e)}set(e){e!==this.snap&&(this.snap=e,this.emit("state"))}update(e){this.set(e(this.snap))}setFrame(e){if(!Number.isInteger(e))return;let t=FT(e,this.frameCount);t!==this.index&&(this.index=t,this.emit("frame"))}setPlaying(e){e!==this.play&&(this.play=e,this.emit("playing"))}};function J0(n){return Array.isArray(n)?n.map(([e,t])=>[e,t]):n}function q0(n,e){return n===e?!0:!Array.isArray(n)||!Array.isArray(e)||n.length!==e.length?!1:n.every((t,i)=>t[0]===e[i][0]&&t[1]===e[i][1])}function gs(n,e,t,i,r){let s=$e(n,t);if(s===void 0||!cl(s,i))return e;let o=J0(i);if(s.scope==="per_panel"){if(r===void 0||!Object.hasOwn(e.panels,r))return e;let a=e.panels[r];return a.inputs!==void 0&&Object.hasOwn(a.inputs,t)&&q0(a.inputs[t],o)?e:cp(e,r,{...a,inputs:nh(a.inputs,t,o)})}return e.inputs!==void 0&&Object.hasOwn(e.inputs,t)&&q0(e.inputs[t],o)?e:{...e,inputs:nh(e.inputs,t,o)}}function Z0(n,e){return n.clock.channel===e?n:{...n,clock:{channel:e}}}function cp(n,e,t){return{...n,panels:nh(n.panels,e,t)}}function ja(n,e){return{...n,layout:e}}function K0(n,e){if(!Object.hasOwn(n.panels,e)||Object.keys(n.panels).length<2)return n;let t=Ko(n.layout,e);return t===null?n:{...n,panels:nh(n.panels,e,void 0),layout:t}}function UT(n){for(let e=Object.keys(n.panels).length+1;;e++){let t=`p${e}`;if(!Object.hasOwn(n.panels,t))return t}}function up(n,e,t){return n.kind==="panel"?n.id===e?{kind:"panel",id:t}:n.id===t?{kind:"panel",id:e}:n:{...n,a:up(n.a,e,t),b:up(n.b,e,t)}}function BT(n,e,t){let r=[t,...Jo(n.layout)].map(s=>n.panels[s]).find(s=>s!==void 0&&s.panel===e);return{panel:e,inputs:Object.assign(ih(),r?.inputs)}}function rh(n,e,t,i,r,s=1/0){if(!Object.hasOwn(e.panels,t))return e;let o=e.panels[t];if(r.kind==="panel"){if(r.id===t||!Object.hasOwn(e.panels,r.id))return e;if(i==="centre")return ja(e,up(e.layout,r.id,t));let l=Ko(e.layout,r.id);return l===null?e:ja(e,Zo(l,t,r.id,i))}if(!Object.hasOwn(n.panels,r.panel))return e;if(i==="centre")return o.panel===r.panel?e:cp(e,t,{...o,panel:r.panel});if(Object.keys(e.panels).length>=s)return e;let a=UT(e);return ja(cp(e,a,BT(e,r.panel,t)),Zo(e.layout,t,a,i))}function dp(n,e,t,i,r){if(Object.keys(e.panels).length>=i)return e;let s=Xl(e.layout).reduce((o,a)=>a.area>o.area?a:o);return rh(n,e,s.id,r(s.id)?"bottom":"right",t,i)}function Q0(n,e,t){let i=Object.keys(n.panels).length>=t,r=Jo(n.layout),s=r.map(e),o=[{label:"Add panel",placement:{kind:"add"},disabled:i,group:!1}];return r.forEach((a,l)=>{let u=s.filter(h=>h===s[l]).length>1?`${s[l]} (${s.slice(0,l+1).filter(h=>h===s[l]).length})`:s[l];o.push({label:`Split ${u} right`,placement:{kind:"drop",target:a,zone:"right"},disabled:i,group:!0},{label:`Split ${u} below`,placement:{kind:"drop",target:a,zone:"bottom"},disabled:i,group:!1},{label:`Replace ${u}`,placement:{kind:"drop",target:a,zone:"centre"},disabled:!1,group:!1})}),o}function eb(n,e,t,i,r,s){return t.kind==="add"?dp(n,e,i,r,s):rh(n,e,t.target,t.zone,i,r)}function zT(n){let e=new TextEncoder().encode(n),t=2166136261;for(let i of e)t^=i,t=Math.imul(t,16777619)>>>0;return t.toString(16).padStart(8,"0")}function sh(n){return`tycho:state:${zT(n)}:${n.length}`}var xo=n=>n!==null&&typeof n=="object"&&!Array.isArray(n);function Y0(n,e,t){let i=ih();if(!xo(e))return i;for(let[r,s]of Object.entries(e)){let o=$e(n,r);o===void 0||(o.scope??"shared")!==t||!cl(o,s)||(i[r]=J0(s))}return i}function HT(n){if(n!==void 0)try{return _i(n,"a split",il).map(e=>[...e])}catch{return}}function hp(n,e,t){if(!xo(n))return;if(n.kind==="panel")return typeof n.id!="string"?void 0:!e(n.id)||t.has(n.id)?null:(t.add(n.id),{kind:"panel",id:n.id});if(n.kind!=="split"||n.dir!=="row"&&n.dir!=="col")return;let i=hp(n.a,e,t),r=hp(n.b,e,t);if(i===void 0||r===void 0)return;if(i===null)return r;if(r===null)return i;let s=n.ratio,o=typeof s=="number"&&s>0&&s<1?s:.5,a={kind:"split",dir:n.dir,ratio:o,a:i,b:r},l=HT(n.keyframes);return l!==void 0&&(a.keyframes=l),a}function tb(n,e){let t=()=>structuredClone(n.initial);if(!xo(e)||!xo(e.clock)||!xo(e.panels))return t();let i=e.clock.channel;if(typeof i!="string"||!n.clock.channels.includes(i))return t();let r=ih();for(let[c,u]of Object.entries(e.panels))!nl.test(c)||!xo(u)||typeof u.panel!="string"||!Object.hasOwn(n.panels,u.panel)||(r[c]={panel:u.panel,inputs:Y0(n,u.inputs,"per_panel")});let s=hp(e.layout,c=>Object.hasOwn(r,c),new Set);if(s==null)return t();let o=new Set,a=c=>c.kind==="panel"?void o.add(c.id):(a(c.a),a(c.b));a(s);for(let c of Object.keys(r))o.has(c)||delete r[c];if(Object.keys(r).length===0)return t();let l={inputs:Y0(n,e.inputs,"shared"),clock:{channel:i},panels:r,layout:s};try{Ms(n,l)}catch{return t()}return l}var VT="#b06ef3",GT="#f0a050",Ja="#5b9bd5",$T="#38d0e8",_n=224,Dn=172,qa=224,Ya=68,nb=10,ib=22;function WT(n,e,t,i=!0){let[r,s]=t[0],[o,a]=t[1],l=(0-r)/(s-r)*_n,c=(a-0)/(a-o)*Dn,u=Math.min(s,Math.max(r,r+n/_n*(s-r))),h=Math.min(a,Math.max(o,a-e/Dn*(a-o))),f=i&&Math.abs(n-l)<=nb&&r<=0&&0<=s,d=i&&Math.abs(e-c)<=nb&&o<=0&&0<=a;return f&&(u=0),d&&(h=0),{x:u,y:h,snappedX:f,snappedY:d}}function jT(n){return n<-1e-4?VT:n>1e-4?GT:Ja}function nn(n,e,t){let i=document.createElement(n);return e!==void 0&&(i.className=e),t!==void 0&&(i.textContent=t),i}var oh=class{el;showRange;control;onUpdate;headerTitle;headerToggle;bodyEl;padCanvas;lockInput;snapInput;addPoleBtn;addZeroBtn;removeBtn;coordsEl;timeCanvas;collapsed=!1;conjugateLock=!0;snapAxes=!1;inRange=!0;theme={background:"#050505",foreground:"#f2f2ef",grid:"#232320"};poles=[[-.8,0]];zeros=[];gain=1;period=1;bounds=[[-3,2],[-3.5,3.5]];minPoles=1;maxPoles=6;minZeros=0;maxZeros=5;hasCustomPreset=!1;showTime=!1;selected={kind:"pole",idx:0};drag=null;lastSyncedPreset=null;lastTimeKey="";cachedTimeResp=null;constructor(e,t,i){this.control=e,this.showRange=e.show_range,this.onUpdate=i,this.collapsed=t,this.conjugateLock=e.conjugate_lock??!0,this.el=nn("div","picker"),this.collapsed&&this.el.classList.add("collapsed"),this.el.addEventListener("pointerdown",c=>c.stopPropagation());let r=nn("div","picker-head");this.headerTitle=nn("span","picker-title",e.label),this.headerToggle=nn("button","picker-toggle"),this.headerToggle.type="button",this.headerToggle.addEventListener("click",()=>{this.collapsed=!this.collapsed,this.el.classList.toggle("collapsed",this.collapsed),this.syncHeader(),this.collapsed||this.draw()}),r.append(this.headerTitle,this.headerToggle),this.bodyEl=nn("div","picker-body"),this.padCanvas=nn("canvas","pz-canvas"),this.padCanvas.style.width=`${_n}px`,this.padCanvas.style.height=`${Dn}px`,this.bindCanvasEvents();let s=nn("div","pz-toggles"),o=nn("label","pz-lock");this.lockInput=nn("input"),this.lockInput.type="checkbox",this.lockInput.checked=this.conjugateLock,this.lockInput.addEventListener("change",()=>{this.conjugateLock=this.lockInput.checked,this.draw()}),o.append(this.lockInput,nn("span",void 0,"Conjugate"));let a=nn("label","pz-snap");this.snapInput=nn("input"),this.snapInput.type="checkbox",this.snapInput.checked=this.snapAxes,this.snapInput.addEventListener("change",()=>{this.snapAxes=this.snapInput.checked,this.draw()}),a.append(this.snapInput,nn("span",void 0,"Snap")),s.append(o,a);let l=nn("div","pz-actions");this.addPoleBtn=nn("button","btn pz-btn","+Pole"),this.addPoleBtn.type="button",this.addPoleBtn.addEventListener("click",()=>this.addPoint("pole")),e.secondary_input!==void 0?(this.addZeroBtn=nn("button","btn pz-btn","+Zero"),this.addZeroBtn.type="button",this.addZeroBtn.addEventListener("click",()=>this.addPoint("zero"))):this.addZeroBtn=null,this.removeBtn=nn("button","btn pz-btn","Del"),this.removeBtn.type="button",this.removeBtn.addEventListener("click",()=>this.removeSelected()),l.append(this.addPoleBtn),this.addZeroBtn!==null&&l.append(this.addZeroBtn),l.append(this.removeBtn),this.coordsEl=nn("div","pz-info"),this.timeCanvas=nn("canvas","pz-time"),this.timeCanvas.style.width=`${qa}px`,this.timeCanvas.style.height=`${Ya}px`,this.timeCanvas.hidden=!0,this.bodyEl.append(this.padCanvas,s,l,this.coordsEl,this.timeCanvas),this.el.append(r,this.bodyEl),this.syncHeader()}syncHeader(){if(this.collapsed){let e=this.control.secondary_input!==void 0?`, ${this.zeros.length}Z`:"";this.headerTitle.textContent=`${this.control.label} (${this.poles.length}P${e})`,this.headerToggle.textContent="\u25B2",this.headerToggle.setAttribute("aria-label","Expand pole-zero pad"),this.headerToggle.setAttribute("aria-expanded","false")}else this.headerTitle.textContent=this.control.label,this.headerToggle.textContent="\u25BE",this.headerToggle.setAttribute("aria-label","Collapse pole-zero pad"),this.headerToggle.setAttribute("aria-expanded","true");this.bodyEl.hidden=this.collapsed}setTime(e){if(this.showRange===void 0){this.inRange=!0,this.el.hidden=!1;return}let[t,i]=this.showRange,r=e>=t-1e-6&&e<=i+1e-6;r!==this.inRange&&(this.inRange=r,this.el.hidden=!r,r&&!this.collapsed&&this.draw())}sync(e,t){this.theme=t;let i=$e(e.scene,this.control.input);if(i?.kind==="points_2d"&&(i.bounds!==void 0&&(this.bounds=i.bounds),this.minPoles=Math.max(1,i.min_points??1),this.maxPoles=Math.min(6,i.max_points??6)),this.control.secondary_input!==void 0){let s=$e(e.scene,this.control.secondary_input);s?.kind==="points_2d"&&(this.minZeros=Math.max(0,s.min_points??0),this.maxZeros=Math.min(5,s.max_points??5))}if(this.control.preset_input!==void 0&&this.control.presets!==void 0){let s=$e(e.scene,this.control.preset_input);this.hasCustomPreset=s?.kind==="choice"&&s.values.includes("custom");let o=String(Tt(e,this.control.preset_input));if(o!==this.lastSyncedPreset){this.lastSyncedPreset=o;let a=this.control.presets.find(l=>l.id===o);if(a!==void 0){let l=[[this.control.input,a.poles.map(([c,u])=>[c,u])]];this.control.secondary_input!==void 0&&l.push([this.control.secondary_input,(a.zeros??[]).map(([c,u])=>[c,u])]),this.control.gain_input!==void 0&&l.push([this.control.gain_input,a.gain??1]),this.onUpdate(l);return}}}let r=Tt(e,this.control.input);if(Array.isArray(r)&&(this.poles=r.map(([s,o])=>[s,o])),this.control.secondary_input!==void 0){let s=Tt(e,this.control.secondary_input);Array.isArray(s)&&(this.zeros=s.map(([o,a])=>[o,a]))}this.gain=this.control.gain_input!==void 0?Number(Tt(e,this.control.gain_input)):1,this.period=this.control.period_input!==void 0?Number(Tt(e,this.control.period_input)):1,this.showTime=this.control.show_time_domain!==void 0&&Tt(e,this.control.show_time_domain)===!0,this.timeCanvas.hidden=!this.showTime,this.selected.kind==="pole"&&this.selected.idx>=this.poles.length?this.selected={kind:"pole",idx:Math.max(0,this.poles.length-1)}:this.selected.kind==="zero"&&this.selected.idx>=this.zeros.length&&(this.selected=this.poles.length>0?{kind:"pole",idx:0}:{kind:"zero",idx:0}),this.syncButtons(),this.syncHeader(),!this.collapsed&&this.inRange&&this.draw()}syncButtons(){this.addPoleBtn.disabled=this.poles.length>=this.maxPoles,this.addZeroBtn!==null&&(this.addZeroBtn.disabled=this.zeros.length>=this.maxZeros||this.zeros.length>=this.poles.length);let e=this.selected.kind==="pole"?this.findPartner(this.poles,this.selected.idx):this.findPartner(this.zeros,this.selected.idx),t=this.conjugateLock&&e>=0?2:1;if(this.selected.kind==="pole"){let i=this.poles.length-t;this.removeBtn.disabled=i<Math.max(this.minPoles,this.zeros.length)}else this.removeBtn.disabled=this.zeros.length-t<this.minZeros}findPartner(e,t){let i=e[t];if(i===void 0||Math.abs(i[1])<=1e-4)return-1;for(let r=0;r<e.length;r++)if(r!==t&&Math.abs(e[r][0]-i[0])<.01&&Math.abs(e[r][1]+i[1])<.01)return r;return-1}pushUpdates(e,t){let i=[[this.control.input,e]];t!==void 0&&this.control.secondary_input!==void 0&&i.push([this.control.secondary_input,t]),this.control.preset_input!==void 0&&this.hasCustomPreset&&this.lastSyncedPreset!=="custom"&&(this.lastSyncedPreset="custom",i.push([this.control.preset_input,"custom"])),this.onUpdate(i)}addPoint(e){let[t,i]=this.bounds[0],[r,s]=this.bounds[1],o=(a,l)=>[Math.min(i,Math.max(t,a)),Math.min(s,Math.max(r,l))];if(e==="pole"){if(this.poles.length>=this.maxPoles)return;let a=-.4-.35*(this.poles.length%4),l=o(a,0),c=[...this.poles.map(([u,h])=>[u,h]),l];this.selected={kind:"pole",idx:c.length-1},this.pushUpdates(c)}else{if(this.zeros.length>=this.maxZeros||this.zeros.length>=this.poles.length)return;let a=-.2-.35*(this.zeros.length%4),l=o(a,0),c=[...this.zeros.map(([u,h])=>[u,h]),l];this.selected={kind:"zero",idx:c.length-1},this.pushUpdates(this.poles.map(([u,h])=>[u,h]),c)}}removeSelected(){if(this.selected.kind==="pole"){let e=this.selected.idx,t=this.conjugateLock?this.findPartner(this.poles,e):-1,i=new Set(t>=0?[e,t]:[e]),r=this.poles.filter((s,o)=>!i.has(o));if(r.length<Math.max(this.minPoles,this.zeros.length))return;this.selected={kind:"pole",idx:Math.max(0,r.length-1)},this.pushUpdates(r)}else{let e=this.selected.idx,t=this.conjugateLock?this.findPartner(this.zeros,e):-1,i=new Set(t>=0?[e,t]:[e]),r=this.zeros.filter((s,o)=>!i.has(o));if(r.length<this.minZeros)return;this.selected=r.length>0?{kind:"zero",idx:r.length-1}:{kind:"pole",idx:0},this.pushUpdates(this.poles.map(([s,o])=>[s,o]),r)}}worldToPx(e,t){let[i,r]=this.bounds[0],[s,o]=this.bounds[1];return[(e-i)/(r-i)*_n,(o-t)/(o-s)*Dn]}pxToWorld(e,t,i=!0){return WT(e,t,this.bounds,i)}canvasPx(e){let t=this.padCanvas.getBoundingClientRect(),i=t.width>0?t.width:_n,r=t.height>0?t.height:Dn;return[(e.clientX-t.left)/i*_n,(e.clientY-t.top)/r*Dn]}bindCanvasEvents(){this.padCanvas.addEventListener("pointerdown",t=>{if(t.button!==0)return;t.preventDefault(),t.stopPropagation();let[i,r]=this.canvasPx(t),s=null;if(this.poles.forEach(([h,f],d)=>{let[p,g]=this.worldToPx(h,f),m=Math.hypot(i-p,r-g);m<=ib&&(s===null||m<s.dist)&&(s={kind:"pole",idx:d,dist:m})}),this.zeros.forEach(([h,f],d)=>{let[p,g]=this.worldToPx(h,f),m=Math.hypot(i-p,r-g);m<=ib&&(s===null||m<s.dist)&&(s={kind:"zero",idx:d,dist:m})}),s===null)return;let o=s;this.selected={kind:o.kind,idx:o.idx};let a=o.kind==="pole"?this.poles:this.zeros,l=this.conjugateLock?this.findPartner(a,o.idx):-1,[c,u]=a[o.idx]??[0,0];this.drag={kind:o.kind,idx:o.idx,partnerIdx:l,spawnedPartner:!1,snappedX:this.snapAxes&&Math.abs(c)<1e-6,snappedY:this.snapAxes&&Math.abs(u)<1e-6},this.padCanvas.setPointerCapture?.(t.pointerId),this.syncButtons(),this.draw()}),this.padCanvas.addEventListener("pointermove",t=>{if(this.drag===null)return;t.stopPropagation();let[i,r]=this.canvasPx(t),{x:s,y:o,snappedX:a,snappedY:l}=this.pxToWorld(i,r,this.snapAxes&&!t.shiftKey);this.drag.snappedX=a,this.drag.snappedY=l;let c=this.drag.kind==="pole",u=c?this.maxPoles:Math.min(this.maxZeros,this.poles.length),h=(c?this.poles:this.zeros).map(([f,d])=>[f,d]);this.drag.idx>=h.length||(h[this.drag.idx]=[s,o],this.conjugateLock&&(this.drag.partnerIdx>=0&&this.drag.partnerIdx<h.length?this.drag.spawnedPartner&&o===0?(h.splice(this.drag.partnerIdx,1),this.drag.partnerIdx<this.drag.idx&&this.drag.idx--,this.drag.partnerIdx=-1,this.drag.spawnedPartner=!1):h[this.drag.partnerIdx]=[s,-o]:Math.abs(o)>0&&h.length<u?(this.drag.partnerIdx=h.length,this.drag.spawnedPartner=!0,h.push([s,-o])):this.drag.partnerIdx<0&&Math.abs(o)>0&&h.length>=u&&(h[this.drag.idx]=[s,0])),c?this.pushUpdates(h):this.pushUpdates(this.poles.map(([f,d])=>[f,d]),h),!this.collapsed&&this.inRange&&this.draw())});let e=()=>{this.drag!==null&&(this.drag=null,!this.collapsed&&this.inRange&&this.draw())};this.padCanvas.addEventListener("pointerup",e),this.padCanvas.addEventListener("pointercancel",e)}draw(){this.drawPad(),this.drawInfo(),this.showTime&&this.drawTimeStrip()}drawPad(){let e=Math.min(window.devicePixelRatio||1,2),t=Math.round(_n*e),i=Math.round(Dn*e);(this.padCanvas.width!==t||this.padCanvas.height!==i)&&(this.padCanvas.width=t,this.padCanvas.height=i);let r=this.padCanvas.getContext("2d");if(r===null)return;r.setTransform(e,0,0,e,0,0),r.clearRect(0,0,_n,Dn);let s=et(this.theme.background).reduce((g,m)=>g+m,0)<1.5,[o,a]=this.bounds[0],[l,c]=this.bounds[1],[u,h]=this.worldToPx(0,0),f=Math.max(0,Math.min(_n,u));r.fillStyle=s?"rgba(176, 110, 243, 0.09)":"rgba(176, 110, 243, 0.08)",r.fillRect(0,0,f,Dn),r.fillStyle="rgba(240, 160, 80, 0.08)",r.fillRect(f,0,Math.max(0,_n-f),Dn),r.strokeStyle=s?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)",r.lineWidth=1;for(let g=Math.ceil(o);g<=Math.floor(a);g++){let[m]=this.worldToPx(g,0);r.beginPath(),r.moveTo(m,0),r.lineTo(m,Dn),r.stroke()}for(let g=Math.ceil(l);g<=Math.floor(c);g++){let[,m]=this.worldToPx(0,g);r.beginPath(),r.moveTo(0,m),r.lineTo(_n,m),r.stroke()}this.drag?.snappedY?(r.save(),r.strokeStyle=this.theme.foreground,r.globalAlpha=.22,r.lineWidth=5,r.beginPath(),r.moveTo(0,h),r.lineTo(_n,h),r.stroke(),r.globalAlpha=.88,r.lineWidth=2.4,r.beginPath(),r.moveTo(0,h),r.lineTo(_n,h),r.stroke(),r.restore()):(r.strokeStyle=s?"rgba(255,255,255,0.22)":"rgba(0,0,0,0.22)",r.beginPath(),r.moveTo(0,h),r.lineTo(_n,h),r.stroke()),this.drag?.snappedX?(r.save(),r.strokeStyle=Ja,r.globalAlpha=.3,r.lineWidth=6,r.beginPath(),r.moveTo(u,0),r.lineTo(u,Dn),r.stroke(),r.globalAlpha=1,r.lineWidth=2.6,r.beginPath(),r.moveTo(u,0),r.lineTo(u,Dn),r.stroke(),r.restore()):(r.strokeStyle=Ja,r.lineWidth=1.5,r.beginPath(),r.moveTo(u,0),r.lineTo(u,Dn),r.stroke());let d=Math.PI/Math.max(1e-6,this.period);r.save(),r.strokeStyle=s?"rgba(255,255,255,0.28)":"rgba(0,0,0,0.28)",r.lineWidth=1,r.setLineDash([4,3]);for(let g of[1,-1]){let m=g*d;if(m<l||m>c)continue;let[,y]=this.worldToPx(0,m);r.beginPath(),r.moveTo(0,y),r.lineTo(_n,y),r.stroke()}r.restore(),r.fillStyle=s?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.5)",r.font="10px system-ui, sans-serif",r.fillText("\u03C3",_n-12,Math.max(11,Math.min(Dn-4,h-4))),r.fillText("j\u03C9",Math.min(_n-18,Math.max(4,u+4)),11);let p=(g,m)=>{r.save(),r.strokeStyle=this.theme.foreground,r.globalAlpha=.55,r.lineWidth=1.2,r.beginPath(),r.arc(g,m,9,0,2*Math.PI),r.stroke(),r.restore()};this.zeros.forEach(([g,m],y)=>{let[b,_]=this.worldToPx(g,m);this.selected.kind==="zero"&&this.selected.idx===y&&p(b,_),r.strokeStyle=this.theme.foreground,r.lineWidth=2,r.beginPath(),r.arc(b,_,5,0,2*Math.PI),r.stroke()}),this.poles.forEach(([g,m],y)=>{let[b,_]=this.worldToPx(g,m);this.selected.kind==="pole"&&this.selected.idx===y&&p(b,_),r.strokeStyle=jT(g),r.lineWidth=2.2;let x=5;r.beginPath(),r.moveTo(b-x,_-x),r.lineTo(b+x,_+x),r.moveTo(b-x,_+x),r.lineTo(b+x,_-x),r.stroke()})}drawInfo(){let e=this.selected.kind==="zero"&&this.zeros.length>0?this.zeros:this.poles,t=e[Math.min(this.selected.idx,Math.max(0,e.length-1))]??this.poles[0]??[0,0],[i,r]=t,s=Math.exp(i*this.period),o=r*this.period,a=s*Math.cos(o),l=s*Math.sin(o),c=Math.abs(r)<1e-4?`s = ${Wt(i,void 0,2)}`:`s = ${Wt(i,void 0,2)} ${r>=0?"+":"\u2212"} j${Wt(Math.abs(r),void 0,2)}`,u=Math.abs(l)<1e-4?`z = ${Wt(a,void 0,2)}`:`z = ${Wt(a,void 0,2)} ${l>=0?"+":"\u2212"} j${Wt(Math.abs(l),void 0,2)}`,h=this.selected.kind==="zero"&&this.zeros.length>0?"Zero":"Pole";this.coordsEl.textContent=`${h}: ${c}  \xB7  ${u}`}drawTimeStrip(){let e=Math.min(window.devicePixelRatio||1,2),t=Math.round(qa*e),i=Math.round(Ya*e);(this.timeCanvas.width!==t||this.timeCanvas.height!==i)&&(this.timeCanvas.width=t,this.timeCanvas.height=i);let r=this.timeCanvas.getContext("2d");if(r===null)return;r.setTransform(e,0,0,e,0,0),r.clearRect(0,0,qa,Ya);let s=`${this.poles.map(m=>m.join(",")).join(";")}|${this.zeros.map(m=>m.join(",")).join(";")}|${this.gain}|${this.period}`;if(s!==this.lastTimeKey||this.cachedTimeResp===null){this.lastTimeKey=s;try{this.cachedTimeResp=Op(this.poles,this.zeros,this.gain,this.period,8,200)}catch{this.cachedTimeResp=null}}let o=this.cachedTimeResp;if(o===null||o.f.length===0)return;let a=20,l=0,c=0,u=!1;for(let m of o.f)!Number.isFinite(m)||Math.abs(m)>a?(u=!0,l=Math.min(l,-a),c=Math.max(c,a)):(l=Math.min(l,m),c=Math.max(c,m));c-l<.5&&(c=l+1);let h=.12*(c-l);l-=h,c+=h;let f=m=>6+m/8*(qa-12),d=m=>{let y=Math.min(c,Math.max(l,m));return Ya-6-(y-l)/(c-l)*(Ya-16)},p=et(this.theme.background).reduce((m,y)=>m+y,0)<1.5,g=d(0);r.strokeStyle=p?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.18)",r.lineWidth=1,r.beginPath(),r.moveTo(6,g),r.lineTo(qa-6,g),r.stroke(),r.strokeStyle=$T,r.lineWidth=1.5,r.beginPath();for(let m=0;m<o.t.length;m++){let y=f(o.t[m]),b=d(o.f[m]);m===0?r.moveTo(y,b):r.lineTo(y,b)}r.stroke(),r.strokeStyle=Ja,r.fillStyle=Ja,r.lineWidth=1.2;for(let m=0;m<o.tk.length;m++){let y=f(o.tk[m]),b=d(o.fk[m]);r.beginPath(),r.moveTo(y,g),r.lineTo(y,b),r.stroke(),r.beginPath(),r.arc(y,b,2.2,0,2*Math.PI),r.fill()}r.fillStyle=p?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.65)",r.font="10px system-ui, sans-serif",r.fillText(u?"f(t), f(kT) \xB7 clipped":"f(t), f(kT)",6,11)}dispose(){this.el.remove()}};var ah=8,XT=56,qT=[.25,.5,1,2,4],YT=[{keys:["X","Y","Z"],does:"view from axis"},{keys:[",","."],does:"turn 15\xB0",turn:!0},{keys:["Shift"],does:"other side \xB7 90\xB0"},{keys:["F"],does:"reset"}],JT=`
:host { display: block; position: relative; background: var(--bg); color: var(--fg);
  font-family: inherit; font-size: 13px; font-style: normal; font-weight: 400; line-height: 1.4; letter-spacing: normal;
  text-align: left; text-transform: none; overflow: hidden; min-height: 240px; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
:focus { outline: none; }
:focus-visible { outline: 2px solid var(--accent-2); outline-offset: 2px; }
button, select, input { font: inherit; color: inherit; margin: 0; }
.root { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto 1fr auto auto; }
.root.kiosk { grid-template-rows: 1fr; }
.root.kiosk header, .root.kiosk .stats, .root.kiosk footer, .root.kiosk .pheader, .root.kiosk .picker { display: none; }
.root.picture { grid-template-rows: 1fr auto; }
.root.picture header, .root.picture footer, .root.picture .pheader, .root.picture .picker { display: none; }
.root.minimal:not(.keep-panels) .add, .root.minimal:not(.keep-panels) .pheader .icon, .root.minimal .frame, .root.minimal .fps, .root.minimal:not(.slide) .cap.view, .root.minimal .cap.export, .root.minimal.slide .speed, .root.minimal.slide .cap.steps { display: none; }
header h1:empty { display: none; }
.root.dragging, .root.dragging * { cursor: grabbing !important; }

header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 24px; padding: 10px 14px 8px; max-width: 100%; }
header h1 { font-size: 17px; font-weight: 600; margin: 0; letter-spacing: 0.01em; }
.vars { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; min-width: 0; max-width: 100%; }
.vars:empty { display: none; }
.vars:not(:empty) { min-height: 30px; }
.add { display: flex; align-items: center; min-width: 0; }
.chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
.k { color: var(--dim); font-size: 12px; }
.chips > .k { margin-right: 2px; }
.field { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.swatch { width: 9px; height: 9px; border-radius: 2px; flex: none; display: inline-block; }
.field output { font-size: 12px; font-variant-numeric: lining-nums tabular-nums; min-width: 7ch; color: var(--fg); }

.seg { display: inline-flex; flex-wrap: wrap; gap: 1px; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: var(--line); }
.seg button { flex: 1 1 auto; background: var(--surface); color: var(--dim); border: 0; padding: 4px 10px; cursor: pointer; white-space: normal;
  overflow-wrap: anywhere; }
.seg button:hover { background: var(--raised); color: var(--fg); }
.seg button[aria-pressed="true"] { background: var(--accent-tint); color: var(--fg); box-shadow: inset 0 -2px var(--accent); }
.seg button:focus-visible { outline-offset: -2px; }
.mini .seg button { padding: 1px 7px; font-size: 11px; }
.icon { width: 28px; height: 28px; flex: none; display: inline-grid; place-items: center; padding: 0; border: 0; border-radius: 6px;
  background: none; color: var(--dim); cursor: pointer; }
.icon:hover { background: var(--raised); color: var(--fg); }
.icon svg { width: 16px; height: 16px; }
.icon.play { color: var(--fg); }
.icon.play.on { color: var(--accent); }
.btn { display: inline-flex; align-items: center; gap: 6px; background: var(--surface); color: var(--fg); border: 1px solid var(--line);
  border-radius: 6px; padding: 4px 10px; cursor: pointer; }
.btn:hover { background: var(--raised); }
.btn svg { width: 14px; height: 14px; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #000; }
.btn.primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.btn.primary:active { background: var(--accent-press); border-color: var(--accent-press); }
.btn:disabled { opacity: 0.45; cursor: default; }
.btn[aria-expanded="true"] .chev { transform: rotate(180deg); color: var(--accent-2); }
select { background: var(--surface); color: var(--fg); border: 1px solid var(--line); border-radius: 6px; padding: 3px 6px; cursor: pointer; }
select option { background: var(--raised); color: var(--fg); }
input[type=checkbox] { accent-color: var(--accent); }

input[type=range] { -webkit-appearance: none; appearance: none; background: none; width: 200px; height: 18px; cursor: pointer; --p: 0%; }
input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px;
  background: linear-gradient(to right, var(--accent) var(--p), var(--track) var(--p)); }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; margin-top: -5px;
  border: 0; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 2px var(--bg); }
input[type=range]:hover::-webkit-slider-thumb { background: var(--accent-hover); }
input[type=range]::-moz-range-track { height: 4px; border-radius: 2px; background: var(--track); }
input[type=range]::-moz-range-progress { height: 4px; border-radius: 2px; background: var(--accent); }
input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border: 0; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 2px var(--bg); }
input[type=range]:disabled { opacity: 0.4; cursor: default; }
.mini input[type=range] { width: 90px; }

.chip { display: inline-flex; align-items: stretch; border: 1px solid var(--line); border-radius: 6px; background: var(--surface);
  color: var(--fg); user-select: none; -webkit-user-select: none; white-space: nowrap; }
.chip .body { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px 3px 4px; cursor: grab; touch-action: none; border-radius: 5px; }
.chip .body:not(:last-child) { border-radius: 5px 0 0 5px; }
.chip .body:hover, .chip .caret:hover { background: var(--raised); }
.chip .body:focus-visible { outline-offset: -2px; }
.chip .grip { width: 14px; height: 14px; flex: none; color: var(--dim); }
.chip .caret { position: relative; display: inline-grid; place-items: center; min-width: 24px; padding: 0 4px; border: 0;
  border-left: 1px solid var(--line); border-radius: 0 5px 5px 0; background: none; color: var(--dim); cursor: pointer; }
.chip .caret svg { width: 14px; height: 14px; transition: transform 0.15s; }
.chip .caret[aria-expanded="true"] { color: var(--accent-2); }
.chip .caret[aria-expanded="true"] svg { transform: rotate(180deg); }
.chip .caret select { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: 0; padding: 0; }
.chip .caret:has(select:focus-visible) { outline: 2px solid var(--accent-2); outline-offset: 2px; color: var(--accent-2); }
.chip.source { opacity: 0.4; }
.ghost { position: fixed; left: 0; top: 0; z-index: 30; pointer-events: none; transform: translate(12px, 12px);
  border-color: var(--accent-2); background: var(--raised); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); }
.ghost .grip { visibility: visible !important; }

.menu { position: fixed; z-index: 40; min-width: 180px; max-height: 70vh; overflow: auto; display: flex; flex-direction: column; padding: 4px;
  background: var(--raised); border: 1px solid var(--line); border-radius: 6px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.55); }
.menu button { text-align: left; background: none; border: 0; border-radius: 4px; padding: 5px 10px; color: var(--fg); cursor: pointer; white-space: nowrap; }
.menu button:hover:not(:disabled) { background: var(--accent-tint); }
.menu button:focus-visible { outline-offset: -2px; }
.menu button:disabled { color: var(--dim); cursor: default; }
.menu hr { border: 0; border-top: 1px solid var(--line); margin: 4px 2px; }

.panel-area { position: relative; min-height: 120px; overflow: hidden; background: var(--gutter); }
.panel-area > canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.panel-area > canvas.paint { pointer-events: none; }
.panels { position: absolute; inset: 0; }
.panel { position: absolute; overflow: hidden; }
.pbody { position: absolute; inset: 0; }
.pheader { position: absolute; top: 0; left: 0; right: 0; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px;
  padding: 3px 3px 3px 6px; background: var(--header); cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none;
  font-size: 12px; white-space: nowrap; min-width: 0; }
.pheader .t { font-weight: 600; flex: 0 1 auto; min-width: 2em; overflow: hidden; text-overflow: ellipsis; }
.pheader .m { color: var(--dim); flex: 0 10 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.pheader .pc { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; flex: 0 1 auto; min-width: 0; }
.pheader select { padding: 0 4px; font-size: 11px; }
.pheader .sp { flex: 1 0 0; }
.pheader .icon { width: 24px; height: 24px; }
.pheader .chip { min-width: 0; }
.pheader .chip .body { padding: 1px 6px 1px 2px; min-width: 0; }
.pheader .chip .lbl { overflow: hidden; text-overflow: ellipsis; }
.pheader .chip .grip { visibility: hidden; }
.pheader .chip:is(:hover, :focus-within) .grip { visibility: visible; }
.labels, .preadout, .perror, .drop, .cbars { pointer-events: none; }
.labels { position: absolute; inset: 0; z-index: 1; overflow: hidden; }
.labels > span { position: absolute; left: 0; top: 0; white-space: nowrap; color: var(--fg); font-size: 12px; text-shadow: 0 0 3px var(--bg), 0 0 3px var(--bg); }
/* the colorbars sit between the header, whose height the viewer writes as --header-height, and the row of x tick numbers, and shrink to fit */
.cbars { position: absolute; right: 10px; top: calc(var(--header-height, 30px) + 10px); bottom: 40px; z-index: 1; display: flex; align-items: flex-start; gap: 12px; }
.cbars.tight > .cbar { display: none; }
.cbar { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; max-height: 100%; font-size: 11px; color: var(--dim); }
.cbar-t { flex: none; max-width: 9em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cbar-b { display: flex; gap: 5px; height: 120px; flex: 0 1 auto; min-height: 0; }
.cbar-g { position: relative; width: 8px; border: 1px solid var(--line); }
.cbar-g.live { width: 12px; pointer-events: auto; cursor: ns-resize; touch-action: none; }
.cbar-g.live:hover { border-color: var(--dim); }
.cbar-k { position: absolute; left: -3px; right: -3px; background: var(--fg); opacity: 0.18; }
.cbar-g i { position: absolute; left: -9px; right: 0; bottom: 0; height: 0; }
.cbar-g i::before { content: ""; position: absolute; left: 0; top: -4px; border: 4px solid transparent; border-left: 6px solid var(--highlight); border-right: 0; }
.cbar-g.live i::after { content: ""; position: absolute; left: 9px; right: 0; top: -1px; height: 2px; background: var(--highlight); box-shadow: 0 0 0 1px var(--bg); }
.cbar-n { display: flex; flex-direction: column; justify-content: space-between; font-variant-numeric: tabular-nums; }
.preadout { position: absolute; left: 8px; bottom: 6px; z-index: 1; display: flex; flex-direction: column; gap: 6px;
  text-shadow: 0 0 3px var(--bg), 0 0 3px var(--bg); }
.perror { position: absolute; inset: 34px 12px auto 12px; z-index: 1; color: var(--error); white-space: pre-wrap; }
.drop { position: absolute; inset: 0; z-index: 3; display: grid; place-items: center; background: var(--accent-2-tint); border: 2px solid var(--accent-2); }
.pbody .follow { position: absolute; right: 8px; bottom: 8px; z-index: 2; padding: 3px 10px 3px 8px; font: inherit; font-size: 12px; cursor: pointer; }
.pbody .follow[hidden] { display: none; }
.pbody .hint { position: absolute; left: 8px; right: 8px; bottom: 8px; z-index: 2; width: fit-content; margin: 0 auto; display: flex; flex-wrap: wrap;
  justify-content: center; gap: 6px 18px; padding: 5px 9px; border-radius: 6px; background: var(--header); color: var(--dim);
  font-size: 11px; line-height: 1.3;
  pointer-events: none; opacity: 0; transition: opacity 0.2s; }
.hint .g { display: grid; justify-items: center; gap: 3px; white-space: nowrap; }
.hint .keys { display: inline-flex; align-items: center; gap: 3px; }
.hint kbd { display: inline-grid; place-items: center; min-width: 18px; height: 18px; padding: 0 4px; border: 1px solid var(--track); border-bottom-width: 2px;
  border-radius: 4px; background: var(--raised); color: var(--fg); font: inherit; font-weight: 600; line-height: 1; }
/* a comma and a period are too small to tell apart at the size of the letters */
.hint kbd.mark { align-items: end; padding-bottom: 7px; font-size: 17px; font-weight: 800; }
.hint svg { width: 13px; height: 13px; color: var(--fg); }
/* the keyframes are listed only where a pointer hovers, and not on a slide, where the audience would read them */
@media (hover: hover) { .pbody:hover .hint { opacity: 1; } }
.root.kiosk .hint, .root.minimal .hint, .root.picture .hint { display: none; }
.drop span { font-size: 11px; color: var(--fg); background: var(--raised); border-radius: 4px; padding: 1px 6px; }
.gutter { position: absolute; z-index: 2; touch-action: none; background: var(--gutter); }
.gutter.row { cursor: col-resize; }
.gutter.col { cursor: row-resize; }
.gutter:hover, .gutter.active { background: var(--accent-tint); }

.stats { display: flex; flex-direction: column; gap: 4px; padding: 8px 14px 0; }
.stats:empty { display: none; }
.readout dl { display: flex; flex-wrap: wrap; margin: 0; }
.wide dl > div { padding: 0 16px; border-left: 1px solid var(--line); }
.wide dl > div:first-child { border-left: 0; padding-left: 0; }
.stack dl { flex-direction: column; gap: 2px; }
.readout dt { font-size: 11px; color: var(--dim); }
.readout dd { margin: 0; white-space: nowrap; }
.readout b { display: inline-block; font-size: 15px; font-weight: 500; line-height: 1.25; font-variant-numeric: lining-nums tabular-nums; }
.stack b { font-size: 13px; }
.readout .u { color: var(--dim); font-size: 12px; margin-left: 0.35em; }
.readout .line { white-space: pre-wrap; font-variant-numeric: tabular-nums; }
.readout.warn .line, .readout b.warn { color: var(--accent); }

.picker { position: absolute; right: 10px; bottom: 10px; z-index: 6; width: 244px; max-width: calc(100% - 20px);
  background: var(--header); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.32); overflow: hidden; }
.picker.collapsed { width: auto; }
.picker-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 8px;
  border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; }
.picker.collapsed .picker-head { border-bottom: 0; }
.picker-toggle { border: 0; background: none; color: var(--dim); cursor: pointer; padding: 0 4px; font-size: 11px; line-height: 1.4; }
.picker-toggle:hover { color: var(--fg); }
.picker-body { display: flex; flex-direction: column; gap: 6px; padding: 8px; }
.pz-canvas, .pz-time { display: block; border: 1px solid var(--line); border-radius: 4px; touch-action: none; }
.pz-canvas { cursor: crosshair; }
.pz-toggles { display: flex; align-items: center; gap: 12px; font-size: 11px; }
.pz-lock, .pz-snap { display: inline-flex; align-items: center; gap: 4px; color: var(--dim); cursor: pointer; }
.pz-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 11px; }
.pz-btn { flex: 1 1 0; justify-content: center; padding: 2px 6px; font-size: 11px; }
.pz-info { font-size: 11px; color: var(--dim); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

footer { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; padding: 8px 14px 10px; }
.cap { display: flex; align-items: center; gap: 4px; padding: 3px; min-height: 36px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; }
.cap.playback { flex: 1 1 520px; flex-wrap: wrap; }
.cap.steps { gap: 2px; }
.cap.steps select { max-width: 220px; font-size: 12px; }
.cap .scrub { flex: 1 1 160px; min-width: 100px; width: auto; margin: 0 6px; }
.cap select { background: none; border-color: transparent; }
.cap select:hover { background: var(--raised); }
.frame, .fps { color: var(--dim); font-size: 12px; font-variant-numeric: lining-nums tabular-nums; white-space: nowrap; text-align: right; }
/* the rate reserves three digits as content, so that the dashes, 9 fps, and 120 fps take one width */
.fps { box-sizing: content-box; min-width: 7ch; padding: 0 6px 0 4px; }
.speed { font-variant-numeric: tabular-nums; }
.why { color: var(--dim); }
.disclose { position: relative; display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border: 0; border-radius: 6px;
  background: none; color: var(--fg); cursor: pointer; overflow: hidden; }
.disclose:hover { background: var(--raised); }
.disclose svg { width: 16px; height: 16px; }
.disclose .chev { width: 14px; height: 14px; color: var(--dim); transition: transform 0.15s; }
.disclose[aria-expanded="true"] { background: var(--accent-tint); box-shadow: inset 0 -2px var(--accent); }
.disclose[aria-expanded="true"] .chev { transform: rotate(180deg); }
.disclose:disabled { color: var(--dim); cursor: default; background: none; }
.disclose .xprog { position: absolute; left: 0; top: 0; height: 2px; width: 0; background: var(--accent); }
.exportbar { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 4px 4px 4px 8px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 8px; }
.exportbar .info { flex: 1 1 12em; color: var(--dim); font-variant-numeric: tabular-nums; }
.exportbar progress { width: 160px; accent-color: var(--accent); }
.status { position: absolute; inset: 0; display: grid; place-items: center; padding: 20px; color: var(--dim); white-space: pre-wrap; z-index: 5; }
.status.error { color: var(--error); }

@media (max-width: 720px) {
  header { padding: 6px 10px; gap: 6px 10px; }
  header h1 { font-size: 15px; }
  .vars { gap: 6px 10px; }
  .field { white-space: normal; }
  input[type=range] { width: 105px; }
  .stats { padding: 6px 10px 0; }
  .wide dl > div { padding: 0 8px; }
  .readout dd { white-space: normal; }
  footer { padding: 6px 10px 8px; gap: 6px 8px; }
  .cap.steps { max-width: 100%; }
  .cap.steps select { max-width: 155px; }
  .picker { right: 8px; bottom: 8px; }
  .picker:not(.collapsed) { left: 8px; right: 8px; width: auto; max-width: none; }
  .picker-body { align-items: center; }
}
`;function ie(n,e,t){let i=document.createElement(n);return e!==void 0&&(i.className=e),t!==void 0&&(i.textContent=t),i}function ZT(){let n=ie("div","hint");for(let e of YT){let t=ie("span","keys");t.append(...e.keys.map(r=>ie("kbd",e.turn?"mark":void 0,r))),e.turn&&(t.prepend(Hn("turnLeft")),t.append(Hn("turnRight")));let i=ie("div","g");i.append(t,ie("span",void 0,e.does)),n.append(i)}return n}function xi(n,e){n.textContent!==e&&(n.textContent=e)}var ri=n=>n.stopPropagation();function Lr(n,e,t,i="icon"){let r=ie("button",i);return r.type="button",r.setAttribute("aria-label",e),r.title=t,r.appendChild(Hn(n)),r.addEventListener("pointerdown",ri),r}function lh(n,e){let t=ie("div",e===void 0?"cap":`cap ${e}`);return t.setAttribute("role","group"),t.setAttribute("aria-label",n),t}function rb(n,e,t){let i=ie("div","seg");i.setAttribute("role","group"),t!==void 0&&i.setAttribute("aria-label",t);let r=new Map;for(let s of n){let o=ie("button",void 0,s.label);o.type="button",o.setAttribute("aria-pressed","false"),o.addEventListener("pointerdown",ri),o.addEventListener("click",()=>e(s.id)),r.set(s.id,o),i.appendChild(o)}return{el:i,set(s){for(let[o,a]of r)a.setAttribute("aria-pressed",String(o===s))}}}function Za(n,e){n.value=String(e);let t=Number(n.max)-Number(n.min);n.style.setProperty("--p",`${t>0?100*(Number(n.value)-Number(n.min))/t:0}%`)}function sb(n,e){let t=ie("div","chip"),i=ie("span","body"),r=ie("span","lbl",n);i.append(Hn("grip","grip"),r),t.appendChild(i);let s=null,o=null;if(e==="menu")s=ie("button","caret"),s.type="button",s.setAttribute("aria-haspopup","menu"),s.setAttribute("aria-expanded","false"),s.setAttribute("aria-label",`${n}: placement`),s.title="Add, split, or replace a panel",s.appendChild(Hn("chevronDown")),s.addEventListener("pointerdown",ri),t.appendChild(s);else if(e==="select"){let a=ie("span","caret");o=ie("select"),a.append(Hn("chevronDown"),o),a.addEventListener("pointerdown",ri),t.appendChild(a)}return{root:t,body:i,label:r,button:s,select:o}}function ob(n,e){let t=Bm(n),i=ie("div",`readout ${e}`),r=ie("div","line"),s=null,o=[];if(t!==null){s=ie("dl");for(let a of t){let l=ie("div"),c=ie("dd"),u=ie("b");a.width!==null&&(u.style.minWidth=`${a.width}ch`),c.appendChild(u),a.unit!==""&&c.appendChild(ie("span","u",a.unit)),l.append(ie("dt",void 0,a.label),c),s.appendChild(l),o.push(u)}i.appendChild(s),r.hidden=!0}return i.appendChild(r),{parts:n,tiles:t,root:i,list:s,values:o,line:r}}function ab(n,e){let t=Array.isArray(e),i=t&&e.some(r=>r.includes("\u26A0"));if(n.root.classList.toggle("warn",i),t&&n.tiles!==null&&n.list!==null&&e.length>0){n.list.hidden=!1,n.line.hidden=!0,n.tiles.forEach((r,s)=>{let o=e[r.part]??"";xi(n.values[s],o),n.values[s].classList.toggle("warn",o.includes("\u26A0"))});return}n.list!==null&&(n.list.hidden=!0),n.line.hidden=!1,xi(n.line,t?e.join(""):e.error)}function KT(n,e){let t=n.kind==="panel";if(e==="centre")return t?"swap":"replace";let i={left:"left",right:"right",top:"above",bottom:"below"}[e];return`${t?"move":"split"} ${i}`}function QT(){return typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}var eA=typeof HTMLElement>"u"?class{}:HTMLElement,Ka=class extends eA{static observedAttributes=["theme"];scene=null;sceneText="";geometry=null;store=null;renderer=null;theme=null;kiosk=!1;twin=null;minimal=!1;keepPanels=!1;slideMode=!1;loading=!1;loads=0;choice=null;root;header;titleEl;varsEl;addEl;panelArea;panelsEl;statusEl;statsEl;footer;canvas=null;paintCanvas=null;get heldProgress(){return this.heldValue!==null&&this.store!==null&&this.store.frame===this.heldFrame?this.heldValue:null}set heldProgress(e){this.heldValue=e,e!==null&&this.scene!==null&&(this.heldFrame=Math.min(this.scene.clock.frame_count-1,Math.floor(e*this.scene.clock.frame_count)))}heldValue=null;heldFrame=-1;stopAt=null;panelDom=new Map;gutterDom=new Map;gutters=[];sceneWidgets=[];pickers=[];captions=[];addChips=[];addButton=null;addGroup=null;stepsCap=null;playback=null;menu=null;closeExport=null;raf=0;hovered=null;intersecting=!0;shown=!1;viewObserver=null;retook=!1;onVisibility=()=>this.syncShown();dirty=!0;anchor={index:0,time:0};playProgress=null;speed=1;meter=new Hl;panelAreaSize={w:0,h:0};saveTimer=0;resizeObserver=null;overlayObserver=null;onPageHide=()=>this.flushSave();unsubscribe=null;lastPanels=null;lastLayout=null;refreshExport=null;connectedCallback(){if(this.twin===null){if(this.shadowRoot===null&&this.buildShell(),this.scene!==null){this.applyTheme(),this.start();return}this.loading||(this.loading=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.loadFromSources()},{once:!0}):this.loadFromSources())}}disconnectedCallback(){this.stop()}attributeChangedCallback(){this.applyTheme()}buildShell(){this.kiosk=this.hasAttribute("kiosk")||this.twin==="kiosk",this.minimal=this.hasAttribute("minimal");let e=this.minimal?(this.getAttribute("minimal")??"").split(/\s+/):[];this.keepPanels=e.includes("panels"),this.slideMode=e.includes("slide");let t=this.attachShadow({mode:"open"}),i=ie("style");i.textContent=JT,t.appendChild(i),this.root=ie("div",`root${this.kiosk?" kiosk":""}${this.twin==="picture"?" picture":""}${this.minimal?" minimal":""}${this.keepPanels?" keep-panels":""}${this.slideMode?" slide":""}`),this.header=ie("header"),this.titleEl=ie("h1"),this.varsEl=ie("div","vars"),this.varsEl.setAttribute("role","group"),this.varsEl.setAttribute("aria-label","Scene"),this.addEl=ie("div","add"),this.addEl.setAttribute("role","group"),this.addEl.setAttribute("aria-label","Add panel"),this.header.append(this.titleEl,this.varsEl,this.addEl),this.panelArea=ie("div","panel-area"),this.panelsEl=ie("div","panels"),this.statusEl=ie("div","status","loading\u2026"),this.panelArea.append(this.panelsEl,this.statusEl),this.statsEl=ie("div","stats"),this.footer=ie("footer"),this.root.append(this.header,this.panelArea,this.statsEl,this.footer),t.appendChild(this.root),this.hasAttribute("tabindex")||(this.tabIndex=0),this.addEventListener("keydown",r=>this.onKey(r))}fail(e){this.statusEl.hidden=!1,this.statusEl.className="status error",this.statusEl.textContent=e}select(e){let t=this.getRootNode();try{return t.querySelector?.(e)??document.querySelector(e)}catch{return null}}source(e){for(let r of this.children)if(r.tagName==="SCRIPT"&&r.getAttribute("data-tycho")===e)return r;let t=this.getAttribute(e);if(!t)return this.select(`#tycho-${e}`);let i=this.select(t);if(i===null&&t.startsWith("#"))throw new Error(`the ${e} selector ${t} does not match an element`);return i??t}async read(e){if(typeof e!="string")return tl(e.textContent??"",e.getAttribute("data-encoding")??"base64");let t=await fetch(e);if(!t.ok)throw new Error(`${e} answered ${t.status}`);return new Uint8Array(await t.arrayBuffer())}async loadFromSources(){try{let e=this.source("scene"),t=this.source("data");if(e===null&&t===null){this.loading=!1;return}if(e===null||t===null)throw new Error(`the ${e===null?"scene":"data"} is missing`);let[i,r]=await Promise.all([this.read(e),this.read(t)]);if(this.loads>0)return;await this.load(new TextDecoder("utf-8").decode(i),r)}catch(e){this.fail(`the scene did not load: ${e.message}`)}}async load(e,t){this.shadowRoot===null&&this.buildShell();let i=++this.loads,r,s;try{if(r=JSON.parse(e),s=await xs.parse(t),i!==this.loads)return;for(let o of Ml(r,s))console.warn(`TyCHO: ${o}`)}catch(o){if(i!==this.loads)return;this.stop(),this.fail(o instanceof pn?o.message:`the scene cannot be read: ${o.message}`);return}this.stop(),this.scene=r,this.sceneText=e,this.geometry=new Fl(r,s),this.store=new Xa(this.recall(),r.clock.frame_count),this.choice=this.templateChoice(),this.statusEl.hidden=!0,this.applyTheme(),this.titleEl.textContent=r.title??"",this.buildTopBar(),this.buildFooter(),this.start(),(this.kiosk||this.hasAttribute("autoplay"))&&!QT()&&this.play()}start(){if(this.scene===null||this.store===null||this.renderer!==null||!this.isConnected)return;this.canvas=ie("canvas"),this.panelArea.insertBefore(this.canvas,this.panelsEl),this.paintCanvas=ie("canvas","paint"),this.panelArea.insertBefore(this.paintCanvas,this.panelsEl);let e=this.twin===null?{}:{preserveDrawingBuffer:!0,coarseDrags:!1};if(this.renderer=new Ku(this.canvas,this.scene,this.geometry,{theme:this.theme,...e}),this.renderer.onChange=()=>this.invalidate(),this.renderer.onContext=()=>{yo.settle(),this.invalidate()},!(this.twin!==null&&!this.connect())){if(this.unsubscribe=this.store.subscribe(t=>this.onChange(t)),this.measurePanelArea(),this.twin!==null){this.onChange("state");return}this.resizeObserver=new ResizeObserver(()=>{this.measurePanelArea(),this.layoutDom(),this.fitAddGroup(),this.invalidate()}),this.resizeObserver.observe(this.panelArea),this.resizeObserver.observe(this.header),this.overlayObserver=new ResizeObserver(t=>{let i=new Set(t.map(r=>r.target.closest(".panel")?.dataset.id));for(let r of i){let s=r===void 0?void 0:this.panelDom.get(r);s!==void 0&&this.measureOverlay(r,s)}this.invalidate()});for(let t of this.panelDom.values())this.observeOverlay(t);window.addEventListener("pagehide",this.onPageHide),document.addEventListener("visibilitychange",this.onVisibility),typeof IntersectionObserver<"u"&&(this.intersecting=!1,this.viewObserver=new IntersectionObserver(t=>{this.intersecting=t[t.length-1].isIntersecting,this.syncShown()},{threshold:0}),this.viewObserver.observe(this)),this.lastPanels=null,this.lastLayout=null;for(let t of[...this.panelDom.keys()])this.removePanelDom(t);this.onChange("state"),this.store.playing&&this.onChange("playing"),this.syncShown()}}stop(){cancelAnimationFrame(this.raf),this.raf=0,this.shown=!1,document.removeEventListener("visibilitychange",this.onVisibility),this.viewObserver?.disconnect(),this.viewObserver=null,this.flushSave(),this.closeMenu(!1),window.removeEventListener("pagehide",this.onPageHide),this.unsubscribe?.(),this.unsubscribe=null,this.resizeObserver?.disconnect(),this.resizeObserver=null,this.overlayObserver?.disconnect(),this.overlayObserver=null,this.dropRenderer();for(let e of this.pickers)e.dispose();this.pickers=[],this.canvas?.remove(),this.canvas=null,this.paintCanvas?.remove(),this.paintCanvas=null}connect(){let e=this.renderer;try{e.connect()}catch(t){return this.dropRenderer(),this.fail(`WebGL is not available: ${t.message}`),!1}return this.canvas=e.canvas,this.twin===null&&yo.use(e,this.shown),!0}dropRenderer(){this.renderer!==null&&(yo.drop(this.renderer),this.renderer.dispose(),this.renderer=null)}hostProperty(e){return typeof getComputedStyle>"u"?"":getComputedStyle(this).getPropertyValue(e).trim()}applyTheme(){if(this.scene!==null){this.theme=im(wl(this.scene),this.getAttribute("theme"),e=>this.hostProperty(e));for(let[e,t]of Object.entries(rm(this.theme)))this.style.setProperty(e,t);this.renderer?.setTheme(this.theme),this.store!==null&&this.panelDom.size>0&&this.syncWidgets(),this.invalidate()}}recall(){let e=this.scene;if(this.kiosk)return structuredClone(e.initial);try{let t=localStorage.getItem(sh(this.sceneText));return t===null?structuredClone(e.initial):tb(e,JSON.parse(t))}catch{return structuredClone(e.initial)}}save(){this.kiosk||this.twin!==null||(window.clearTimeout(this.saveTimer),this.saveTimer=window.setTimeout(()=>this.flushSave(),300))}flushSave(){if(!(this.saveTimer===0||this.store===null)){window.clearTimeout(this.saveTimer),this.saveTimer=0;try{localStorage.setItem(sh(this.sceneText),JSON.stringify(this.store.state))}catch{}}}reset(){if(!(this.scene===null||this.store===null)){try{localStorage.removeItem(sh(this.sceneText))}catch{}this.closeMenu(!1),this.store.set(structuredClone(this.scene.initial));for(let e of this.panelDom.keys())this.renderer?.refit(e)}}get state(){return this.store?.state??null}onChange(e){let t=this.store;if(e==="state"){let i=t.state;i.panels!==this.lastPanels&&this.syncPanels(),(i.layout!==this.lastLayout||i.panels!==this.lastPanels)&&this.layoutDom(),this.lastPanels=i.panels,this.lastLayout=i.layout,this.syncWidgets(),this.save()}else if(e==="playing"){let i=this.playback;if(i!==null){let r=t.playing?"Pause (k)":"Play (k)";i.play.replaceChildren(Hn(t.playing?"pause":"play")),i.play.setAttribute("aria-label",r),i.play.title=r,i.play.classList.toggle("on",t.playing)}if(this.meter.reset(),t.playing){let r=this.scene.clock,s=r.end==="stop"&&this.heldProgress!==null&&this.heldProgress>=1-2e-9;this.anchor={index:s?0:this.heldProgress===null?t.frame:this.heldProgress*r.frame_count,time:performance.now()},this.heldProgress=null}else this.playProgress!==null&&(this.heldProgress=this.playProgress);this.playProgress=null,t.playing||(this.stopAt=null),i!==null&&this.showRate(null)}this.invalidate()}invalidate(){this.dirty=!0,this.schedule()}schedule(){this.raf===0&&this.renderer!==null&&this.shown&&this.twin===null&&(this.raf=requestAnimationFrame(e=>this.tick(e)))}syncShown(){let e=this.intersecting&&!document.hidden;if(e===this.shown)return;this.shown=e;let t=this.renderer;if(e&&(this.retook=!1),t!==null&&t.connected&&this.twin===null&&(e&&!t.live?t.release():yo.use(t,e)),!e){cancelAnimationFrame(this.raf),this.raf=0;return}this.store?.playing&&(this.meter.reset(),this.anchor={index:this.playPosition(),time:performance.now()}),this.invalidate()}playPosition(){return this.playProgress===null?this.store.frame:this.playProgress*this.scene.clock.frame_count}tick(e){this.raf=0;let t=this.store,i=this.scene.clock;if(t.playing){let r=Gl(this.anchor.index,e-this.anchor.time,1e3,i.frame_count,this.speed,Ot(i)),s=this.stopAt,o=i.end==="stop"?Math.floor(this.anchor.index/i.frame_count)*i.frame_count+i.frame_count*(1-1e-9):1/0,a=Math.min(s?.x??1/0,o);if(r>=a){r=a;let l=s!==null&&s.x<=o&&s.index>=0?s.index:null;t.setFrame(Xo(r,i.frame_count)),this.playProgress=qo(r,i.frame_count),this.stopAt=null,this.pause(),l!==null&&this.reachStep(l)}else t.setFrame(Xo(r,i.frame_count)),this.playProgress=qo(r,i.frame_count);this.dirty=!0}this.dirty&&(this.dirty=!1,this.draw(),t.playing&&this.countDraw(e)),t.playing&&this.schedule()}countDraw(e){this.meter.note(e),this.showRate(this.meter.report(e))}showRate(e){let t=this.playback;if(t===null)return;xi(t.fps,dd(e));let i=fd(e);t.fps.title!==i&&(t.fps.title=i)}measurePanelArea(){this.panelAreaSize={w:this.panelArea.clientWidth,h:this.panelArea.clientHeight}}draw(e=Math.min(window.devicePixelRatio||1,2)){let t=this.renderer,i=this.store,r=this.scene;if(t===null)return;let s=i.state,{w:o,h:a}=this.panelAreaSize;if(o<1||a<1)return;let l=t.connected&&!t.live&&this.twin===null&&!this.retook&&yo.room(t);if(l&&(this.retook=!0),(!t.connected||l)&&!this.connect())return;let c=i.playing&&this.playProgress!==null?this.playProgress:this.heldProgress??i.frame/r.clock.frame_count,u=t.renderAt(s,c,o,a,e);this.paint(c,o,a,e),this.animatedLayout&&this.layoutDom(c);for(let[d,p]of this.panelDom){xi(p.error,u.get(d)??"");let g=t.offKeys?.(d)??!1;p.follow.hidden===g&&(p.follow.hidden=!g);for(let m of p.readouts)ab(m,this.pieces(d,m.parts,c));p.barsFor!==s&&(this.syncBars(d,p),p.barsFor=s)}let h=this.firstPanel();for(let d of this.captions)ab(d,h===null?[]:this.pieces(h,d.parts,c));this.playback&&(Za(this.playback.scrub,i.frame),xi(this.playback.frame,`${i.frame} / ${r.clock.frame_count}`));let f=c*Ot(r.clock);for(let d of this.sceneWidgets)d.showRange!==void 0&&(d.el.hidden=f<d.showRange[0]-1e-6||f>d.showRange[1]+1e-6);for(let d of this.panelDom.values())for(let p of d.widgets)p.showRange!==void 0&&(p.el.hidden=f<p.showRange[0]-1e-6||f>p.showRange[1]+1e-6);for(let d of this.pickers)d.setTime(f);if(this.stepsCap!==null){let d=r.steps??[],p=this.currentStep,g=d.findIndex(m=>m.id===p);p!==null&&this.stepsCap.select.value!==p&&(this.stepsCap.select.value=p),this.stepsCap.prev.disabled=g<=0&&f<=(d[0]?.at??0)+1e-6,this.stepsCap.next.disabled=g>=d.length-1}}get animatedLayout(){let e=t=>t.kind==="split"&&(t.keyframes!==void 0||e(t.a)||e(t.b));return this.store!==null&&e(this.store.state.layout)}paint(e,t,i,r){let s=this.paintCanvas,o=this.renderer;if(s===null||o===null||this.scene===null||this.theme===null)return;let a=Math.round(t*r),l=Math.round(i*r);(s.width!==a||s.height!==l)&&(s.width=a,s.height=l);let c=s.getContext("2d");c!==null&&(c.setTransform(1,0,0,1,0,0),c.clearRect(0,0,a,l),c.setTransform(r,0,0,r,0,0),o0(c,o,this.scene,this.store.state,this.theme,e,t,i,(u,h)=>{let f=this.pieces(u,h,e);return"error"in f?[]:f}))}pieces(e,t,i){try{let r={scene:this.scene,geometry:this.geometry,state:this.store.state,panel:e,frameIndex:this.store.frame,progress:i};return Um(r,t)}catch(r){if(r instanceof pn)return{error:r.message};throw r}}firstPanel(){let e=t=>t.kind==="panel"?t.id:e(t.a);return this.store===null?null:e(this.store.state.layout)}hasPlayback(){return(this.scene?.controls??[]).some(e=>e.kind==="playback")}get playing(){return this.store?.playing??!1}play(){this.store?.setPlaying(!0)}pause(){this.store?.setPlaying(!1)}step(e){let t=this.store;t!==null&&(this.pause(),this.heldProgress=null,t.setFrame(t.frame+e))}get steps(){return[...this.scene?.steps??[]]}get time(){return this.scene===null||this.store===null?0:(this.store.playing&&this.playProgress!==null?this.playProgress:this.heldProgress??this.store.frame/this.scene.clock.frame_count)*Ot(this.scene.clock)}get currentStep(){let e=this.time+1e-9,t=null;for(let i of this.steps)i.at<=e&&(t=i.id);return t}stepIndex(e){let t=this.steps,i=typeof e=="number"?e:t.findIndex(r=>r.id===e);if(!Number.isInteger(i)||i<0||i>=t.length)throw new Error(`the scene does not have a step ${JSON.stringify(e)}`);return i}seek(e){let t=this.scene,i=this.store;if(t===null||i===null||!Number.isFinite(e))return;let r=Ot(t.clock),s=Math.min(Math.max(e/r,0),1-1e-9);this.stopAt=null,this.pause(),this.heldProgress=s,this.playProgress=null,i.setFrame(Math.min(t.clock.frame_count-1,Math.floor(s*t.clock.frame_count))),this.invalidate()}goto(e){this.seek(this.steps[this.stepIndex(e)].at)}playTo(e){let t=this.scene,i=this.store;if(t===null||i===null)return;let r=this.stepIndex(e),s=Ot(t.clock),o=t.clock.frame_count,a=this.time,l=this.steps[r].at;if(Math.abs(l-a)<1e-9){this.reachStep(r);return}let c=(l>a?0:1)*o+Math.min(l/s*o,o*(1-1e-9));i.playing?this.anchor={index:this.playPosition(),time:performance.now()}:this.heldProgress??=i.frame/o,i.setPlaying(!0),this.stopAt={x:c,index:r}}next(){let e=this.time+1e-6,t=this.steps.findIndex(i=>i.at>e);return t<0?null:(this.playTo(t),this.steps[t].id)}previous(){let e=this.time-1e-6,t=-1;return this.steps.forEach((i,r)=>{i.at<e&&(t=r)}),t<0?null:(this.goto(t),this.steps[t].id)}reachStep(e){let t=this.steps[e];t!==void 0&&this.dispatchEvent(new CustomEvent("tycho-step",{detail:{id:t.id,index:e,at:t.at},bubbles:!0,composed:!0}))}runAction(e,t){if(this.scene===null||this.store===null)return;if(typeof e=="string"?this.goto(e):this.seek(e),typeof t=="string"){this.playTo(t);return}let i=Ot(this.scene.clock),r=this.scene.clock.frame_count,s=this.time;if(Math.abs(t-s)<1e-9)return;let o=(t>s?0:1)*r+Math.min(t/i*r,r*(1-1e-9));this.heldProgress??=this.store.frame/r,this.store.setPlaying(!0),this.stopAt={x:o,index:-1}}seekFrame(e){let t=this.store;t.setFrame(e),this.playProgress=null,this.heldProgress=null,this.stopAt=null,t.playing&&(this.anchor={index:t.frame,time:performance.now()})}onKey(e){this.useKey(e)&&e.stopPropagation()}useKey(e){if(this.store===null||e.metaKey||e.ctrlKey||e.altKey)return!1;if(e.key==="Escape"){if(this.menu!==null)this.closeMenu(!0);else if(!this.closeExport?.())return!1;return e.preventDefault(),!0}let t=zm(e.key,e.shiftKey,this.scene.clock.frame_count,e.code),i=e.composedPath()[0];if(i!==void 0&&["INPUT","SELECT","BUTTON","TEXTAREA"].includes(i.tagName)&&Hm(i.tagName,i.type,e.key))return!0;if(t===null)return!1;if(t.kind==="fit")return e.preventDefault(),this.fitAll(),!0;if(t.kind==="slider")return this.stepSlider(t.by)?(e.preventDefault(),!0):!1;if(t.kind==="view"||t.kind==="turn"){let r=this.renderer,s=r?.orbitPanels()??[],o=this.hovered!==null&&s.includes(this.hovered)?[this.hovered]:s;if(r===null||o.length===0)return!1;e.preventDefault();for(let a of o)t.kind==="view"?r.viewFrom(a,t.axis,t.sign):r.turnBy(a,t.degrees);return this.invalidate(),!0}return!this.hasPlayback()&&!this.kiosk?!1:(e.preventDefault(),t.kind==="toggle"?this.store.setPlaying(!this.store.playing):t.kind==="step"?this.step(t.by):this.seekFrame(t.frame),!0)}fitAll(){this.renderer?.refitAll(),this.invalidate()}fitPanel(e){this.renderer?.refit(e),this.invalidate()}stepSlider(e){let t=this.scene,i=this.store.state,r=this.firstPanel(),s=(t.controls??[]).find(u=>u.kind==="slider"&&$e(t,u.input)?.scope!=="per_panel");if(s===void 0||r===null)return!1;let o={scene:t,state:i,panel:i.panels[r]},a=Vl(o,this.geometry.sets,s);if(a.length===0)return!1;let l=this.panelValue(o,s.input),c=Math.min(a.length-1,Math.max(0,jo(a,l)+e));return this.store.update(u=>gs(t,u,s.input,a[c])),!0}buildFooter(){let e=this.scene;if(this.footer.replaceChildren(),this.playback=null,this.stepsCap=null,this.hasPlayback()){let s=lh("Playback","playback"),o=Lr("play","Play (k)","Play (k)","icon play");o.addEventListener("click",()=>this.store.setPlaying(!this.store.playing));let a=ie("input","scrub");a.type="range",a.min="0",a.max=String(e.clock.frame_count-1),a.step="1",a.setAttribute("aria-label","Frame"),a.addEventListener("pointerdown",ri),a.addEventListener("input",()=>{this.pause(),this.store.setFrame(Number(a.value))});let l=ie("span","frame");l.style.minWidth=`${2*String(e.clock.frame_count).length+3}ch`,l.title="Frame index of the loop. Left and right step, Home goes to 0";let c=ie("select","speed");c.setAttribute("aria-label","Playback speed"),c.title="Playback speed";for(let f of qT){let d=ie("option",void 0,`${f}\xD7`);d.value=String(f),d.selected=f===this.speed,c.appendChild(d)}c.addEventListener("change",()=>{this.speed=Number(c.value),this.anchor={index:this.playPosition(),time:performance.now()},this.refreshExport?.()}),s.append(o,a,l,c);let u=null;e.clock.channels.length>1&&(u=rb(e.clock.channels.map((f,d)=>({id:f,label:e.clock.labels?.[d]??f})),f=>this.store.update(d=>Z0(d,f)),"Clock"),u.el.title="What the frame index runs along",s.append(u.el));let h=ie("span","fps",dd(null));h.title=fd(null),s.append(h),this.footer.append(s),this.playback={play:o,scrub:a,frame:l,fps:h,channel:u}}if((e.steps?.length??0)>0){let s=lh("Steps","steps"),o=Lr("chevronLeft","Previous step","Previous step");o.addEventListener("click",()=>this.previous());let a=ie("select","step-select");a.setAttribute("aria-label","Step"),e.steps.forEach((c,u)=>{let h=ie("option",void 0,`${u+1}/${e.steps.length} \xB7 ${c.label??c.id}`);h.value=c.id,a.appendChild(h)}),a.addEventListener("change",()=>{a.value!==""&&this.goto(a.value)});let l=Lr("chevronRight","Next step","Next step");l.addEventListener("click",()=>this.next()),s.append(o,a,l),this.footer.append(s),this.stepsCap={root:s,prev:o,next:l,select:a}}let t=lh("View","view"),i=Lr("house","Reset every view","Reset every view: return each panel to its timeline's camera, or fit it to what it draws (F)");i.addEventListener("click",()=>this.fitAll());let r=Lr("rotateCcw","Reset scene","Reset scene: panels, layout, and controls as written");r.addEventListener("click",()=>this.reset()),t.append(i,r),this.footer.append(t),this.buildExport()}exportVideo(e={}){if(this.scene===null||this.store===null||this.geometry===null)return Promise.reject(new Error("the viewer has not loaded a scene"));let t=e.kiosk??this.kiosk,r={clock:this.scene.clock,panelArea:this.pictureSize(t),open:(s,o,a)=>this.openTwin(t?"kiosk":"picture",s,o,a)};return Ym(r,{speed:this.speed,...e})}pictureSize(e){if(e)return{w:this.clientWidth,h:this.clientHeight};let t=this.kiosk?0:this.statsEl.offsetHeight;return{w:this.panelArea.clientWidth,h:this.panelArea.clientHeight+t}}async openTwin(e,t,i,r){let s=document.createElement(this.localName);s.twin=e;let o=this.getAttribute("theme");o!==null&&s.setAttribute("theme",o),s.style.cssText=`position: absolute; left: 0; top: 0; width: ${t}px; height: ${i}px; min-height: 0; visibility: hidden; pointer-events: none;`,s.tabIndex=-1,s.setAttribute("aria-hidden","true"),s.buildShell(),s.scene=this.scene,s.sceneText=this.sceneText,s.geometry=this.geometry,s.store=new Xa(structuredClone(this.store.state),this.scene.clock.frame_count),s.choice=s.templateChoice(),s.statusEl.hidden=!0,s.titleEl.textContent=this.scene.title??"",this.root.appendChild(s);try{if(s.applyTheme(),s.buildTopBar(),s.buildFooter(),s.start(),s.renderer===null)throw new Error(s.statusEl.textContent??"the export cannot draw the panel area");s.drawAt(0,0,r),await s.renderer.ready(),await document.fonts?.ready}catch(a){throw s.stop(),s.remove(),a}return{draw:(a,l,c)=>{s.drawAt(l,c,r),W0(a,s)},close:()=>{s.stop(),s.remove()}}}drawAt(e,t,i){this.store.setFrame(e),this.heldValue=t,this.heldFrame=e,this.measurePanelArea(),this.layoutDom(t);for(let[r,s]of this.panelDom)this.measureOverlay(r,s);this.draw(i)}buildExport(){let e=lh("Export","export"),t=ie("button","disclose");t.type="button",t.append(Hn("download"),ie("span",void 0,"Export video"),Hn("chevronDown","chev"));let i=ie("div","exportbar");e.appendChild(t),this.footer.appendChild(e),this.closeExport=null;let r=gd();if(r!==null){t.disabled=!0,this.footer.append(ie("span","why",`video export is unavailable: ${r}`));return}let s=ie("span","xprog");s.hidden=!0,t.appendChild(s),i.id="xbar",i.setAttribute("role","group"),i.setAttribute("aria-label","Export options"),i.hidden=!0,t.setAttribute("aria-expanded","false"),t.setAttribute("aria-controls","xbar");let o=x=>{i.hidden=!x,t.setAttribute("aria-expanded",String(x)),x&&(b(),_())};this.closeExport=()=>i.hidden?!1:(o(!1),t.focus(),!0),t.addEventListener("click",()=>o(i.hidden!==!1));let a=(x,S)=>{let w=ie("select");w.setAttribute("aria-label",x),w.title=x;for(let[v,T]of S){let P=ie("option",void 0,T);P.value=v,w.appendChild(P)}return w},l=a("Size",[["720p","1280\xD7720"],["1080p","1920\xD71080"],["panels","size of the panels"]]),c=a("Frame rate",$l.map(x=>[String(x),`${x} fps`]));c.value="30";let u=()=>Yo("panels",this.pictureSize(this.kiosk),window.devicePixelRatio||1,Number(c.value)),h=a("Loops",$m.map(x=>[String(x),x===1?"1 loop":`${x} loops`])),f=ie("span","info"),d=ie("button","btn primary","Start");d.type="button";let p=ie("progress");p.hidden=!0;let g=ie("button","btn","Cancel");g.type="button",g.hidden=!0;let m=Lr("x","Close export options","Close (Esc)");m.addEventListener("click",()=>{o(!1),t.focus()});let y=null,b=()=>{if(y!==null)return;let x=this.scene.clock;h.value="1",c.value=String(Wm(x.frame_count,this.speed,Ot(x))??$l[0])},_=()=>{if(y!==null)return;let x=l.options[2],S=u();x.textContent=`panels, ${S.width}\xD7${S.height}`;let w=this.scene.clock,v=Wl(w.frame_count,Number(c.value),Number(h.value),this.speed,0,Ot(w)),T=jl(v.count,Number(c.value));f.textContent=T??`${v.count} frames, ${v.duration.toFixed(1)} s at ${this.speed}\xD7 speed`,d.disabled=T!==null};for(let x of[l,c,h])x.addEventListener("change",_);this.refreshExport=()=>{i.hidden||(b(),_())},d.addEventListener("click",()=>{let x=new AbortController;y=x,d.disabled=!0,g.hidden=!1,p.hidden=!1,p.value=0,s.hidden=!1,s.style.width="0%";let S=l.value,w=`${(this.scene.title??"tycho").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"tycho"}.mp4`,v="";this.exportVideo({size:S,fps:Number(c.value),loops:Number(h.value),signal:x.signal,onConfig:T=>v=`${T.width}\xD7${T.height} H.264 ${T.codec}`,onProgress:(T,P)=>{p.max=P,p.value=T,s.style.width=`${P>0?100*T/P:0}%`,f.textContent=`${v}, frame ${T} of ${P}`}}).then(T=>{let P=URL.createObjectURL(T),C=ie("a");C.href=P,C.download=w,this.shadowRoot.appendChild(C),C.click(),C.remove(),window.setTimeout(()=>URL.revokeObjectURL(P),6e4),f.textContent=`saved ${w}, ${v}, ${(T.size/1e6).toFixed(2)} MB`}).catch(T=>{f.textContent=T instanceof DOMException&&T.name==="AbortError"?"canceled":`export failed: ${T.message}`}).finally(()=>{y=null,d.disabled=!1,g.hidden=!0,p.hidden=!0,s.hidden=!0})}),g.addEventListener("click",()=>y?.abort()),i.append(l,c,h,f,d,p,g,m),this.footer.append(i)}makeWidget(e,t){let i=this.scene,r="show_range"in e?e.show_range:void 0;if(e.kind==="action"){let c=ie("button","btn",e.label);return c.type="button",c.addEventListener("pointerdown",ri),c.addEventListener("click",()=>this.runAction(e.from,e.to)),{el:c,showRange:r,sync:()=>{}}}if(e.kind==="points_2d")return null;let s=$e(i,e.input);if(s===void 0)return null;let o=c=>this.store.update(u=>gs(i,u,e.input,c,t)),a=c=>{let u=s.scope==="per_panel"?c.panel.inputs:c.state.inputs;return u!==void 0&&Object.hasOwn(u,e.input)?u[e.input]:s.default},l=()=>{let c=ie("label","field");return c.appendChild(ie("span","k",e.label)),c.addEventListener("pointerdown",ri),c};if(e.kind==="tabs"&&s.kind==="choice"&&(t!==void 0&&s.values.length>3||s.values.length>7)){let c=s,u=ie("select");c.values.forEach((f,d)=>{let p=ie("option",void 0,c.labels?.[d]??f);p.value=f,u.appendChild(p)}),u.addEventListener("change",()=>o(u.value));let h=l();return h.appendChild(u),{el:h,showRange:r,sync:f=>{u.value=String(a(f))}}}if(e.kind==="tabs"&&s.kind==="choice"){let c=s,u=rb(c.values.map((f,d)=>({id:f,label:c.labels?.[d]??f})),f=>o(f),e.label),h=ie("span","field");return h.append(ie("span","k",e.label),u.el),h.addEventListener("pointerdown",ri),{el:h,showRange:r,sync:f=>u.set(String(a(f)))}}if(e.kind==="toggle"&&s.kind==="toggle"){let c=ie("input");c.type="checkbox",e.color!==void 0&&(c.style.accentColor=e.color),c.addEventListener("change",()=>o(c.checked));let u=l();if(e.color!==void 0){let h=ie("span","swatch");h.style.background=e.color,u.insertBefore(h,u.firstChild)}return u.prepend(c),{el:u,showRange:r,sync:h=>{c.checked=a(h)===!0}}}if(e.kind==="slider"&&s.kind==="parameter"){let c=ie("input");c.type="range",c.min="0",c.step="1";let u=ie("output"),h=[];c.addEventListener("input",()=>{Za(c,Number(c.value));let d=h[Number(c.value)];d!==void 0&&o(d)});let f=l();return f.append(c,u),{el:f,showRange:r,sync:d=>{h=Vl(d,this.geometry.sets,e),c.disabled=h.length===0,c.max=String(Math.max(0,h.length-1));let p=a(d);Za(c,Math.max(0,jo(h,p))),u.textContent=Wt(p)}}}if(e.kind==="slider"&&s.kind==="number"){let c=ie("input");c.type="range",c.min=String(s.min),c.max=String(s.max),c.step=s.step!==void 0?String(s.step):"any";let u=ie("output");c.addEventListener("input",()=>{let f=Number(c.value);Za(c,f),o(f)});let h=l();return h.append(c,u),{el:h,showRange:r,sync:f=>{let d=Number(a(f));Za(c,d);let p=s.step!==void 0&&Number.isInteger(s.step)?0:2;u.textContent=Wt(d,void 0,p)}}}return null}templateChoice(){let e=this.scene,t=Object.entries(e.inputs??{}).filter(([,a])=>a?.kind==="choice"&&a.scope==="per_panel");if(t.length===0)return null;let i=new Set(Object.values(e.panels).map(a=>typeof a.frame=="string"?"":a.frame.input)),[r,s]=t.find(([a])=>i.has(a))??t[0],o=(e.controls??[]).find(a=>a.kind==="tabs"&&a.input===r);return{id:r,def:s,label:o?.label??r}}templates(){return Object.entries(this.scene.panels).map(([e,t])=>({kind:"declared",panel:e,label:t.label??e}))}buildTopBar(){let e=this.scene;this.varsEl.replaceChildren(),this.sceneWidgets=[];for(let i of this.pickers)i.dispose();this.pickers=[];let t=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(max-width: 720px)").matches;for(let i of e.controls??[]){if(i.kind==="playback")continue;if(i.kind==="points_2d"){let s=new oh(i,t,o=>{this.store.update(a=>o.reduce((l,[c,u])=>gs(e,l,c,u),a))});this.panelArea.appendChild(s.el),this.pickers.push(s);continue}if(i.kind!=="action"&&$e(e,i.input)?.scope==="per_panel")continue;let r=this.makeWidget(i,void 0);r&&(this.sceneWidgets.push(r),this.varsEl.appendChild(r.el))}this.buildAddGroup(),this.statsEl.replaceChildren(),this.captions=(e.readouts??[]).filter(i=>i.place==="caption").map(i=>ob(i.parts,"wide")),this.statsEl.append(...this.captions.map(i=>i.root))}buildAddGroup(){this.addEl.replaceChildren();let e=this.templates(),t=ie("div","chips");t.appendChild(ie("span","k","Add panel")),this.addChips=[];for(let r of e){let s=sb(r.label,"menu");s.body.setAttribute("role","button"),s.body.tabIndex=0,s.body.setAttribute("aria-roledescription","draggable"),s.body.title="Drag onto a panel: an edge splits it, the center replaces it. Click to add a panel.",s.body.addEventListener("pointerdown",a=>this.startDrag(a,r,s.body,s.root)),s.body.addEventListener("keydown",a=>{a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),a.stopPropagation(),this.addPanel(r))});let o=s.button;o.addEventListener("click",()=>this.openMenu(o,this.chipEntries(r))),t.appendChild(s.root),this.addChips.push(s.root)}let i=ie("button","btn");i.type="button",i.setAttribute("aria-haspopup","menu"),i.setAttribute("aria-expanded","false"),i.append(Hn("plus"),ie("span",void 0,"Add panel"),Hn("chevronDown","chev")),i.hidden=!0,i.addEventListener("pointerdown",ri),i.addEventListener("click",()=>this.openMenu(i,e.map(r=>({label:r.label,run:()=>this.addPanel(r)})))),this.addEl.append(t,i),this.addGroup=t,this.addButton=i,this.fitAddGroup()}fitAddGroup(){let e=this.addGroup,t=this.addButton;if(e===null||t===null||this.addChips.length<2)return;let i=this.shadowRoot?.activeElement??null;e.hidden=!1,t.hidden=!0;let r=this.addChips[0],o=this.addChips[this.addChips.length-1].offsetTop>r.offsetTop+r.offsetHeight/2;e.hidden=o,t.hidden=!o,o&&i!==null&&e.contains(i)&&t.focus()}chipEntries(e){let t=this.scene;return Q0(this.store.state,i=>this.panelName(i),ah).map(i=>({label:i.label,disabled:i.disabled,group:i.group,run:()=>this.store.update(r=>eb(t,r,i.placement,e,ah,s=>this.isTall(s)))}))}addPanel(e){this.store.update(t=>dp(this.scene,t,e,ah,i=>this.isTall(i)))}isTall(e){let t=this.panelDom.get(e)?.host.getBoundingClientRect();return t!==void 0&&t.width<t.height}panelName(e){let t=this.panelDom.get(e);if(t===void 0)return e;let i=t.chipLabel.textContent??"";return t.title.hidden?i||e:`${t.title.textContent??e}, ${i}`}openMenu(e,t){let i=this.menu?.anchor===e;if(this.closeMenu(!1),i)return;let r=ie("div","menu");r.setAttribute("role","menu");let s=[];for(let u of t){if(u.group&&s.length>0){let f=ie("hr");f.setAttribute("role","separator"),r.appendChild(f)}let h=ie("button",void 0,u.label);h.type="button",h.setAttribute("role","menuitem"),h.tabIndex=-1,h.disabled=u.disabled===!0,h.addEventListener("click",()=>{this.closeMenu(!0),u.run()}),r.appendChild(h),s.push(h)}let o=s.filter(u=>!u.disabled);r.addEventListener("pointerdown",ri),r.addEventListener("keydown",u=>{let h=o.indexOf(this.shadowRoot.activeElement),f=o.length,d=p=>o[(p%f+f)%f]?.focus();if(u.key==="ArrowDown")d(h+1);else if(u.key==="ArrowUp")d(h-1);else if(u.key==="Home")d(0);else if(u.key==="End")d(f-1);else if(u.key==="Escape")this.closeMenu(!0);else if(u.key==="Tab")this.closeMenu(!1);else return;u.key!=="Tab"&&u.preventDefault(),u.stopPropagation()}),this.root.appendChild(r);let a=e.getBoundingClientRect(),l=a.bottom+4+r.offsetHeight<=window.innerHeight;r.style.left=`${Math.max(4,Math.min(a.left,window.innerWidth-r.offsetWidth-4))}px`,r.style.top=`${l?a.bottom+4:Math.max(4,a.top-r.offsetHeight-4)}px`,e.setAttribute("aria-expanded","true");let c=u=>{let h=u.composedPath();!h.includes(r)&&!h.includes(e)&&this.closeMenu(!1)};window.addEventListener("pointerdown",c,!0),this.menu={anchor:e,close:u=>{r.remove(),e.setAttribute("aria-expanded","false"),window.removeEventListener("pointerdown",c,!0),u&&e.focus()}},o[0]?.focus()}closeMenu(e){let t=this.menu;this.menu=null,t?.close(e)}syncWidgets(){let e=this.store,t=this.scene,i=e.state,r=this.firstPanel(),s=this.time;if(r!==null){let l={scene:t,state:i,panel:i.panels[r]};for(let c of this.sceneWidgets)c.sync(l),c.showRange!==void 0&&(c.el.hidden=s<c.showRange[0]-1e-6||s>c.showRange[1]+1e-6);if(this.theme!==null)for(let c of this.pickers)c.sync(l,this.theme),c.setTime(s)}let o=Object.keys(t.panels).length,a=this.choice;for(let[l,c]of this.panelDom){let u=i.panels[l];if(u===void 0)continue;let h={scene:t,state:i,panel:u};for(let b of c.widgets)b.sync(h),b.showRange!==void 0&&(b.el.hidden=s<b.showRange[0]-1e-6||s>b.showRange[1]+1e-6);let f=t.panels[u.panel],d=typeof f.frame=="string"?f.frame:String(this.panelValue(h,f.frame.input)),g=(Object.hasOwn(t.frames,d)?t.frames[d]:void 0)?.label??d;c.title.textContent=f.label??u.panel,c.title.hidden=o<2||c.title.textContent===g;let m=f.frame,y=typeof m=="string"?null:m.input;if(a!==null&&c.select!==null){let b=String(this.panelValue(h,a.id));c.select.value=b,xi(c.chipLabel,a.def.labels?.[a.def.values.indexOf(b)]??b),c.meta.textContent=g,c.meta.hidden=y===a.id||y!==null&&(t.controls??[]).some(_=>_.kind!=="playback"&&_.kind!=="action"&&_.input===y&&$e(t,y)?.scope==="per_panel")}else xi(c.chipLabel,g),c.meta.hidden=!0;c.close.hidden=Object.keys(i.panels).length<2}this.playback?.channel?.set(i.clock.channel)}panelValue(e,t){let i=$e(e.scene,t);if(i===void 0)return"";let r=i.scope==="per_panel"?e.panel.inputs:e.state.inputs;return r!==void 0&&Object.hasOwn(r,t)?r[t]:i.default}syncPanels(){let e=this.store.state;for(let t of[...this.panelDom.keys()])Object.hasOwn(e.panels,t)||this.removePanelDom(t);for(let t of Object.keys(e.panels)){let i=this.panelDom.get(t);i!==void 0&&i.panel===e.panels[t].panel||(i!==void 0&&this.removePanelDom(t),this.createPanelDom(t,e.panels[t]))}}createPanelDom(e,t){let i=this.scene,r=ie("div","panel");r.dataset.id=e;let s=ie("div","pbody"),o=(i.readouts??[]).filter(w=>w.place==="panel").map(w=>ob(w.parts,"stack")),a=ie("div","preadout");a.append(...o.map(w=>w.root));let l=ie("div","perror"),c=ie("div","cbars"),u=ie("div","drop"),h=ie("span");u.appendChild(h),u.hidden=!0;let f=ie("button","btn follow");f.type="button",f.append(Hn("house"),ie("span",void 0,"Timeline view")),f.title="Back to the timeline's camera (F returns every panel)",f.hidden=!0,f.addEventListener("pointerdown",ri),f.addEventListener("click",()=>this.fitPanel(e)),s.append(a,l,c,u,f),i.panels[t.panel]?.camera?.kind==="3d"&&s.append(ZT()),s.addEventListener("pointerenter",()=>this.hovered=e),s.addEventListener("pointerleave",()=>{this.hovered===e&&(this.hovered=null)}),s.addEventListener("dblclick",()=>this.fitPanel(e));let d=ie("div","pheader"),p=ie("span","t"),g=this.choice,m=sb("",g===null?"none":"select");if(m.body.title="Drag to move the panel: onto an edge of another to place it there, onto its center to swap",g!==null&&m.select!==null){let w=m.select;w.setAttribute("aria-label",g.label),g.def.values.forEach((v,T)=>{let P=ie("option",void 0,g.def.labels?.[T]??v);P.value=v,w.appendChild(P)}),w.addEventListener("change",()=>this.store.update(v=>gs(i,v,g.id,w.value,e)))}let y=ie("span","m"),b=ie("span","pc mini"),_=[];for(let w of i.controls??[]){if(w.kind==="playback"||w.kind==="action"||$e(i,w.input)?.scope!=="per_panel"||g!==null&&w.kind==="tabs"&&w.input===g.id)continue;let v=this.makeWidget(w,e);v&&(_.push(v),b.appendChild(v.el))}let x=Lr("house","Reset view","Reset view: fit to what this panel draws (F resets every panel)");x.addEventListener("click",()=>this.fitPanel(e));let S=Lr("x","Close panel","Close panel");S.addEventListener("click",()=>this.store.update(w=>K0(w,e))),d.append(p,m.root,y,b,ie("span","sp"),x,S),d.addEventListener("pointerdown",w=>this.startDrag(w,{kind:"panel",id:e},d,m.root)),r.append(s,d),this.panelsEl.appendChild(r),this.panelDom.set(e,{host:r,body:s,header:d,title:p,chip:m.root,chipLabel:m.label,select:m.select,meta:y,close:S,readouts:o,error:l,follow:f,drop:u,dropLabel:h,bars:c,barDom:[],barsFor:null,widgets:_,panel:t.panel}),this.renderer?.bind(e,s),this.observeOverlay(this.panelDom.get(e))}observeOverlay(e){this.overlayObserver?.observe(e.header),this.overlayObserver?.observe(e.bars)}measureOverlay(e,t){let i=t.header.offsetHeight,r=`${i}px`;t.host.style.getPropertyValue("--header-height")!==r&&t.host.style.setProperty("--header-height",r);let s=t.bars;s.classList.toggle("tight",s.clientHeight<XT);let o=0;for(let c of s.children)o=Math.max(o,c.offsetHeight);let a=s.offsetWidth,l=t.body.clientWidth-s.offsetLeft-a;this.renderer?.setClearance(e,{header:i,bars:o>0&&a>0?{right:l,top:s.offsetTop,width:a,height:o}:null})}removePanelDom(e){let t=this.panelDom.get(e);t&&(this.renderer?.bind(e,null),this.overlayObserver?.unobserve(t.header),this.overlayObserver?.unobserve(t.bars),t.host.remove(),this.panelDom.delete(e))}layoutDom(e){if(this.store===null)return;let{w:t,h:i}=this.panelAreaSize,r=e??this.heldProgress??this.store.frame/this.scene.clock.frame_count,s=Xu($a(this.store.state.layout,r*Ot(this.scene.clock)),{x:0,y:0,w:t,h:i},Qu);for(let[a,l]of s.panels){let c=this.panelDom.get(a);c&&Object.assign(c.host.style,{left:`${l.x}px`,top:`${l.y}px`,width:`${l.w}px`,height:`${l.h}px`})}this.gutters=s.gutters;let o=new Set;for(let a of s.gutters){o.add(a.path);let l=this.gutterDom.get(a.path);if(!l){l=ie("div","gutter");let c=a.path;l.addEventListener("pointerdown",u=>this.startResize(u,c,l)),this.gutterDom.set(a.path,l),this.panelsEl.appendChild(l)}l.className=`gutter ${a.dir}`,Object.assign(l.style,{left:`${a.rect.x}px`,top:`${a.rect.y}px`,width:`${a.rect.w}px`,height:`${a.rect.h}px`})}for(let[a,l]of[...this.gutterDom])o.has(a)||(l.remove(),this.gutterDom.delete(a))}startResize(e,t,i){let r=this.gutters.find(a=>a.path===t);if(!r||e.button!==0)return;e.preventDefault(),i.classList.add("active"),i.setPointerCapture(e.pointerId);let s=a=>{let l=this.panelArea.getBoundingClientRect(),c=b0(r,a.clientX-l.left,a.clientY-l.top,Qu);this.store.update(u=>ja(u,ju(u.layout,t,c)))},o=()=>{i.classList.remove("active"),i.removeEventListener("pointermove",s),i.removeEventListener("pointerup",o),i.removeEventListener("pointercancel",o)};i.addEventListener("pointermove",s),i.addEventListener("pointerup",o),i.addEventListener("pointercancel",o)}syncBars(e,t){let i=this.scene,r=this.renderer.colorbars(e);t.barDom.length!==r.length&&(t.barDom=r.map(()=>this.makeBar(e)),t.bars.replaceChildren(...t.barDom.map(a=>a.root)));let s=this.store.state.panels[e],o=s===void 0?void 0:i.panels[s.panel];r.forEach((a,l)=>{let c=t.barDom[l];xi(c.title,a.label),c.gradient!==a.gradient&&(c.gradient=a.gradient,c.grad.style.background=a.gradient);let u=Number.isInteger(a.lo)&&Number.isInteger(a.hi)?void 0:3;xi(c.hi,Wt(a.hi,u)),xi(c.lo,Wt(a.lo,u)),c.range=[a.lo,a.hi],c.mark.hidden=a.marker===null,a.marker!==null&&(c.mark.style.bottom=`${(100*a.marker).toFixed(2)}%`),c.band.hidden=a.band===null,a.band!==null&&(c.band.style.bottom=`${(100*a.band[0]).toFixed(2)}%`,c.band.style.height=`${(100*(a.band[1]-a.band[0])).toFixed(2)}%`),c.link=o===void 0?null:Vm(i,o,a.label);let h=c.grad;if(h.classList.toggle("live",c.link!==null),c.link===null){for(let d of["role","tabindex","aria-orientation","aria-label","aria-valuemin","aria-valuemax","aria-valuenow","aria-valuetext","title"])h.removeAttribute(d);return}let f=this.panelValue({scene:i,state:this.store.state,panel:s},c.link.input);h.setAttribute("role","slider"),h.setAttribute("tabindex","0"),h.setAttribute("aria-orientation","vertical"),h.setAttribute("aria-label",c.link.label),h.setAttribute("aria-valuemin",String(a.lo)),h.setAttribute("aria-valuemax",String(a.hi)),h.setAttribute("aria-valuenow",String(f)),h.setAttribute("aria-valuetext",Wt(f)),h.title=`Drag or click to set ${c.link.label}`})}makeBar(e){let t=ie("div","cbar"),i=ie("div","cbar-t"),r=ie("div","cbar-b"),s=ie("div","cbar-g"),o=ie("span","cbar-k"),a=ie("i");s.append(o,a);let l=ie("div","cbar-n"),c=ie("span"),u=ie("span");l.append(c,u),r.append(s,l),t.append(i,r);let h={root:t,title:i,grad:s,band:o,mark:a,hi:c,lo:u,gradient:"",range:[0,1],link:null};return s.addEventListener("pointerdown",f=>{if(h.link===null||f.button!==0)return;f.preventDefault(),f.stopPropagation(),s.focus(),s.setPointerCapture(f.pointerId);let d=g=>{let m=s.getBoundingClientRect();this.setFromBar(e,h,m.height>0?(m.bottom-g.clientY)/m.height:0)},p=()=>{s.removeEventListener("pointermove",d),s.removeEventListener("pointerup",p),s.removeEventListener("pointercancel",p)};d(f),s.addEventListener("pointermove",d),s.addEventListener("pointerup",p),s.addEventListener("pointercancel",p)}),s.addEventListener("dblclick",ri),s.addEventListener("keydown",f=>{if(h.link===null)return;let d={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:10,PageDown:-10,Home:-1/0,End:1/0};f.key in d&&(f.preventDefault(),f.stopPropagation(),this.stepBar(e,h,d[f.key]))}),h}barStops(e,t){let i=this.store.state,r=i.panels[e];if(r===void 0)return[];let s={kind:"slider",input:t.input,label:t.label,domain:t.domain};return Vl({scene:this.scene,state:i,panel:r},this.geometry.sets,s)}setFromBar(e,t,i){if(t.link===null)return;let r=this.barStops(e,t.link),s=Gm(r,t.range[0],t.range[1],i),o=t.link.input;s>=0&&this.store.update(a=>gs(this.scene,a,o,r[s]))}stepBar(e,t,i){if(t.link===null)return;let r=this.barStops(e,t.link),s=this.store.state;if(r.length===0||s.panels[e]===void 0)return;let o=this.panelValue({scene:this.scene,state:s,panel:s.panels[e]},t.link.input),a=Math.min(r.length-1,Math.max(0,jo(r,o)+i)),l=t.link.input;this.store.update(c=>gs(this.scene,c,l,r[a]))}startDrag(e,t,i,r){if(e.button!==0||this.store===null)return;e.preventDefault(),this.closeMenu(!1);let s=e.clientX,o=e.clientY,a=this.shadowRoot,l=null,c=null;i.setPointerCapture(e.pointerId);let u=()=>{for(let d of this.panelDom.values())d.drop.hidden=!0},h=d=>{if(!l){if(Math.hypot(d.clientX-s,d.clientY-o)<4)return;l=r.cloneNode(!0),l.classList.add("ghost"),this.root.appendChild(l),r.classList.add("source"),this.root.classList.add("dragging")}l.style.left=`${d.clientX}px`,l.style.top=`${d.clientY}px`,u(),c=null;let g=a.elementFromPoint(d.clientX,d.clientY)?.closest(".panel");if(!g)return;let m=g.dataset.id;if(t.kind==="panel"&&t.id===m)return;let y=this.panelDom.get(m);if(!y)return;let b=y.host.getBoundingClientRect(),_=Km(d.clientX-b.left,d.clientY-b.top,b.width,b.height);c={id:m,zone:_},y.drop.hidden=!1,y.drop.style.inset=_==="left"?"0 50% 0 0":_==="right"?"0 0 0 50%":_==="top"?"0 0 50% 0":_==="bottom"?"50% 0 0 0":"0",xi(y.dropLabel,KT(t,_))},f=d=>{i.removeEventListener("pointermove",h),i.removeEventListener("pointerup",f),i.removeEventListener("pointercancel",f),u();let p=l!==null;if(l?.remove(),r.classList.remove("source"),this.root.classList.remove("dragging"),!p){t.kind!=="panel"&&d.type==="pointerup"&&this.addPanel(t);return}c&&this.dropOn(c.id,c.zone,t)};i.addEventListener("pointermove",h),i.addEventListener("pointerup",f),i.addEventListener("pointercancel",f)}dropOn(e,t,i){let r=this.scene;this.store.update(s=>rh(r,s,e,t,i,ah))}};function ch(n="tycho-viewer"){typeof customElements<"u"&&!customElements.get(n)&&customElements.define(n,Ka)}function tA(n,e){return n.exportVideo(e)}ch();return bb(nA);})();
/**
 * @license Lucide, https://lucide.dev, ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
 * All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or
 * without fee is hereby granted, provided that the above copyright notice and this permission
 * notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
 * AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 * NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
