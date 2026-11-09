/* Xarita ko'rinishi: qatlam almashtirish, kattalashtirish, sudrab siljitish, ikki barmoq bilan zoom */
(function(){
const box=document.getElementById("mapBox"),vp=document.getElementById("mapVp");
let z=1,tx=0,ty=0;const MIN=1,MAX=6;
function apply(){const w=box.clientWidth,h=box.clientHeight;tx=Math.min(0,Math.max(w-w*z,tx));ty=Math.min(0,Math.max(h-h*z,ty));vp.style.transform=`translate(${tx}px,${ty}px) scale(${z})`;vp.style.setProperty("--z",z)}
function zoomAt(f,cx,cy){const nz=Math.min(MAX,Math.max(MIN,z*f));f=nz/z;tx=cx-(cx-tx)*f;ty=cy-(cy-ty)*f;z=nz;apply()}
const mid=()=>[box.clientWidth/2,box.clientHeight/2];
document.getElementById("zIn").onclick=()=>zoomAt(1.5,...mid());
document.getElementById("zOut").onclick=()=>zoomAt(1/1.5,...mid());
document.getElementById("zReset").onclick=()=>{z=1;tx=ty=0;apply()};
box.addEventListener("wheel",e=>{e.preventDefault();const r=box.getBoundingClientRect();zoomAt(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
box.addEventListener("dblclick",e=>{if(e.target.closest(".pin,.maptoggle,.zoom"))return;const r=box.getBoundingClientRect();zoomAt(1.8,e.clientX-r.left,e.clientY-r.top)});
document.querySelectorAll(".maptoggle button").forEach(b=>b.onclick=()=>{box.dataset.layer=b.dataset.layer;document.querySelectorAll(".maptoggle button").forEach(x=>x.classList.toggle("on",x===b))});
const P=new Map();
box.addEventListener("pointerdown",e=>{if(e.target.closest(".pin,.maptoggle,.zoom"))return;P.set(e.pointerId,{x:e.clientX,y:e.clientY});box.classList.add("drag")});
window.addEventListener("pointermove",e=>{const prev=P.get(e.pointerId);if(!prev)return;const cur={x:e.clientX,y:e.clientY};
 if(P.size===1){tx+=cur.x-prev.x;ty+=cur.y-prev.y;apply()}
 else if(P.size===2){const o=P.get([...P.keys()].find(i=>i!==e.pointerId)),d0=Math.hypot(prev.x-o.x,prev.y-o.y),d1=Math.hypot(cur.x-o.x,cur.y-o.y),r=box.getBoundingClientRect();if(d0>0)zoomAt(d1/d0,(cur.x+o.x)/2-r.left,(cur.y+o.y)/2-r.top)}
 P.set(e.pointerId,cur)});
["pointerup","pointercancel"].forEach(t=>window.addEventListener(t,e=>{P.delete(e.pointerId);if(!P.size)box.classList.remove("drag")}));
window.addEventListener("resize",apply);apply();
})();
