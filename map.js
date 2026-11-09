/* SMART STREET — xarita generatori (1600x940 shahar).
   Ikkala qatlam (yo'l xaritasi va sun'iy yo'ldosh) BITTA geometriyadan chiziladi;
   chiroq va ekran nuqtalari yo'l bo'ylab joylashadi. */
(function(){
const NS="http://www.w3.org/2000/svg",W=1600,H=940;
let seed=11;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const R=(a,b)=>a+rnd()*(b-a),pick=a=>a[Math.floor(rnd()*a.length)],f=n=>n.toFixed(1);
const inView=(x,y,m)=>x>m&&x<W-m&&y>m&&y<H-m;

/* yo'llar: o'tadigan nuqtalar. ["A",.3] = A yo'lning 30% nuqtasiga ulanish (T-chorraha) */
const spec={
 A:{w:52,main:1,name:"Markaziy ko‘cha",a:[[-60,580],[420,500],[860,440],[1260,370],[1660,290]]},
 B:{w:46,main:1,name:"Mustaqillik ko‘chasi",a:[[1070,-40],[1030,200],[990,400],[950,600],[920,800],[900,980]]},
 H:{w:34,main:1,name:"Amir Temur ko‘chasi",a:[[-60,250],[380,235],[760,260],["B",.22],[1300,190],[1660,160]]},
 V:{w:32,main:1,name:"Alisher Navoiy ko‘chasi",a:[[470,-40],["H",.3],["A",.28],[470,980]]},
 C:{w:24,name:"Bog‘bonlar ko‘chasi",a:[[-60,380],[230,376],["V",.4],[720,360],["B",.36]]},
 D:{w:24,name:"Yangi mahalla",a:[["B",.78],[1250,700],[1660,670]]},
 D2:{w:24,name:"Gulzor ko‘chasi",a:[[-60,760],[260,740],["V",.8],[700,760],["B",.84]]},
 E:{w:22,name:"Istiqlol ko‘chasi",a:[["A",.41],[700,640],["D2",.44],[690,980]]},
 F:{w:22,name:"Navro‘z ko‘chasi",a:[[760,-40],["H",.47],["A",.47]]},
 G:{w:22,name:"Chinor ko‘chasi",a:[[1350,-40],["H",.83],["A",.83],["D",.6],[1370,980]]},
 I:{w:20,name:"Olmazor ko‘chasi",a:[["B",.08],[1350,70],[1660,50]]},
 J:{w:22,name:"Sayilgoh ko‘chasi",a:[["B",.62],[1300,560],[1660,520]]},
 K:{w:22,name:"Ma‘rifat ko‘chasi",a:[[1540,-40],[1545,250],["J",.9],["D",.9],[1560,980]]},
 L:{w:22,name:"Chilonzor ko‘chasi",a:[[170,-40],[165,250],[160,380],[150,560],[150,745],[165,980]]}
};
const roads={};
const tmp=document.createElementNS(NS,"svg");tmp.style.cssText="position:absolute;width:0;height:0;visibility:hidden";document.body.append(tmp);
const bez=P=>{let d="M"+f(P[0].x)+" "+f(P[0].y);for(let i=0;i<P.length-1;i++){const p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||P[i+1];
 d+=`C${f(p1.x+(p2.x-p0.x)/6)} ${f(p1.y+(p2.y-p0.y)/6)} ${f(p2.x-(p3.x-p1.x)/6)} ${f(p2.y-(p3.y-p1.y)/6)} ${f(p2.x)} ${f(p2.y)}`}return d};
for(const k in spec){const s=spec[k];
 const P=s.a.map(q=>{if(typeof q[0]==="string"){const u=roads[q[0]].use;return u[Math.floor(q[1]*(u.length-1))]}return{x:q[0],y:q[1]}});
 const d=bez(P),p=document.createElementNS(NS,"path");p.setAttribute("d",d);tmp.append(p);
 const L=p.getTotalLength(),pts=[];
 for(let s2=0;s2<=L;s2+=3){const a=p.getPointAtLength(s2),b=p.getPointAtLength(Math.min(L,s2+1.5)),c=p.getPointAtLength(Math.max(0,s2-1.5));pts.push({x:a.x,y:a.y,t:Math.atan2(b.y-c.y,b.x-c.x)})}
 roads[k]={d,w:s.w,main:s.main,name:s.name,pts,use:pts.filter(q=>inView(q.x,q.y,8))}}
tmp.remove();

/* tezkor qidiruv uchun to'r */
const CELL=48,grid=new Map();
for(const k in roads)for(const p of roads[k].pts){const key=Math.floor(p.x/CELL)+","+Math.floor(p.y/CELL);(grid.get(key)||grid.set(key,[]).get(key)).push({k,p})}
function nearest(x,y,except){let best={clr:1e9};const cx=Math.floor(x/CELL),cy=Math.floor(y/CELL);
 for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const c=grid.get((cx+i)+","+(cy+j));if(!c)continue;
  for(const o of c){if(o.k===except)continue;const d=Math.hypot(o.p.x-x,o.p.y-y)-roads[o.k].w/2;if(d<best.clr)best={clr:d,k:o.k,pt:o.p}}}
 return best}
const side=(p,o)=>({x:p.x-Math.sin(p.t)*o,y:p.y+Math.cos(p.t)*o});

/* parklar va hovuzlar: yo'llarsiz bo'sh joylarga avtomatik */
const parks=[],ponds=[],sizes=[[200,104],[170,92],[220,112],[160,84],[190,100]];
for(let tr=0;tr<6000&&parks.length<5;tr++){const [w,h]=sizes[parks.length],x=R(30,W-w-30),y=R(30,H-h-30);let ok=parks.every(p=>Math.hypot(p.x-x,p.y-y)>380);
 for(let dx=0;ok&&dx<=w;dx+=16)for(let dy=0;ok&&dy<=h;dy+=16)if(nearest(x+dx,y+dy).clr<12)ok=false;
 if(ok)parks.push({x,y,w,h})}
[0,2,4].forEach(i=>{const p=parks[i];if(p)ponds.push({x:p.x+p.w*.62,y:p.y+p.h*.55,rx:p.w*.17,ry:p.h*.14})});
const inPark=(x,y,m)=>parks.some(p=>x>p.x-m&&x<p.x+p.w+m&&y>p.y-m&&y<p.y+p.h+m);
const inPond=(x,y,m)=>ponds.some(o=>((x-o.x)/(o.rx+m))**2+((y-o.y)/(o.ry+m))**2<1);

/* binolar: eng yaqin yo'lga parallel */
const blds=[],roofs=["#b5654a","#c4785a","#a8553f","#9b9a96","#8a8f93","#cfcac0","#d9d3c6","#b8b2a5","#7f6f66"];
for(let gy=16;gy<H;gy+=26)for(let gx=14;gx<W;gx+=32){
 const x=gx+R(-7,7),y=gy+R(-6,6),w=R(15,30),h=R(12,21),r=Math.max(w,h)/2;
 if(x<r||y<r||x>W-r||y>H-r)continue;
 const n=nearest(x,y);if(n.clr>70||n.clr<r+6||inPark(x,y,r+6)||rnd()<.1)continue;
 if(blds.some(b=>Math.abs(b.x-x)<40&&Math.abs(b.y-y)<40&&Math.hypot(b.x-x,b.y-y)<(r+Math.max(b.w,b.h)/2)*.95))continue;
 blds.push({x,y,w,h,a:n.pt.t,c:pick(roofs),u:rnd()<.3?[R(-w/3,w/3),R(-h/3,h/3)]:null})}

/* daraxtlar */
const trees=[];
const okTree=(x,y,r)=>inView(x,y,2)&&!inPond(x,y,r)&&nearest(x,y).clr>r+3&&!blds.some(b=>Math.abs(b.x-x)<30&&Math.abs(b.y-y)<30&&Math.hypot(b.x-x,b.y-y)<Math.max(b.w,b.h)/2+r*.8);
parks.forEach(p=>{const n=Math.round(p.w*p.h/330);for(let i=0;i<n;i++){const x=R(p.x+5,p.x+p.w-5),y=R(p.y+5,p.y+p.h-5),r=R(4,7.5);if(!inPond(x,y,r+1)&&!trees.some(t=>Math.abs(t.x-x)<14&&Math.abs(t.y-y)<14&&Math.hypot(t.x-x,t.y-y)<(t.r+r)*.8))trees.push({x,y,r})}});
for(const k in roads){const r=roads[k];for(let i=4;i<r.use.length;i+=(r.main?7:9))for(const sd of[1,-1]){const q=side(r.use[i],sd*(r.w/2+R(9,14))),rr=R(3.5,5.5);if(okTree(q.x,q.y,rr))trees.push({x:q.x,y:q.y,r:rr})}}
blds.forEach(b=>{if(rnd()<.6){const a=R(0,6.28),rr=R(3,5),d=Math.max(b.w,b.h)/2+rr+2,x=b.x+Math.cos(a)*d,y=b.y+Math.sin(a)*d;if(okTree(x,y,rr))trees.push({x,y,r:rr})}});

/* mashinalar */
const cars=[],carCols=["#dcdcdc","#b53a2e","#2c3e50","#e0b52a","#f2f2f2","#3b4a57","#2f8f55","#8a8d91"];
for(const k in roads){const r=roads[k],n=Math.round(r.use.length*3/75);for(let j=0;j<n;j++){const p=r.use[Math.floor(R(.02,.98)*(r.use.length-1))],dir=rnd()<.5?1:-1,q=side(p,dir*r.w*.22);
 if(nearest(q.x,q.y,k).clr<3)continue;cars.push({x:q.x,y:q.y,a:p.t+(dir<0?Math.PI:0),c:pick(carCols)})}}

/* yo'l o'rta chizig'i (chorrahada uziladi) va yozuv joyi */
function centerInfo(k,m){const segs=[];let seg=[];roads[k].pts.forEach((p,i)=>{if(inView(p.x,p.y,m)&&nearest(p.x,p.y,k).clr>2)seg.push(i);else{if(seg.length>2)segs.push(seg);seg=[]}});if(seg.length>2)segs.push(seg);return segs}
const center={},labelAt={};
for(const k in roads){const P=roads[k].pts;center[k]=centerInfo(k,-40).map(s=>"M"+s.map(i=>f(P[i].x)+" "+f(P[i].y)).join("L")).join("");
 const segs=centerInfo(k,26).sort((a,b)=>b.length-a.length)[0];const fs=Math.max(13,Math.min(24,Math.round(roads[k].w*.62)));
 if(segs){const tw=roads[k].name.length*fs*.72,mid=(segs[0]+segs[segs.length-1])/2*3;labelAt[k]={fs,off:Math.max(segs[0]*3,mid-tw/2)}}}

const deg=a=>f(a*180/Math.PI);
const labels=(pre,up)=>`<g class="labels">${Object.keys(roads).filter(k=>labelAt[k]).map(k=>`<text font-size="${labelAt[k].fs}" dy=".35em"><textPath href="#${pre}${k}" startOffset="${f(labelAt[k].off)}">${up?roads[k].name.toUpperCase():roads[k].name}</textPath></text>`).join("")}</g>`;
const pathDefs=pre=>Object.keys(roads).map(k=>`<path id="${pre}${k}" d="${roads[k].d}"/>`).join("");
const keys=Object.keys(roads),order=keys.filter(k=>!roads[k].main).concat(keys.filter(k=>roads[k].main));

function satellite(){
 const patches=Array.from({length:40},()=>`<ellipse cx="${f(R(0,W))}" cy="${f(R(0,H))}" rx="${f(R(70,220))}" ry="${f(R(30,90))}" fill="${pick(["#8e9d7a","#a9ae88","#9a9174","#7f9470","#b2b394","#8a8a6c"])}"/>`).join("");
 let shadow="",roof="";
 blds.forEach(b=>{const hw=b.w/2,hh=b.h/2;
  shadow+=`<rect transform="translate(${f(b.x+4)} ${f(b.y+5)}) rotate(${deg(b.a)})" x="${f(-hw)}" y="${f(-hh)}" width="${f(b.w)}" height="${f(b.h)}"/>`;
  roof+=`<g transform="translate(${f(b.x)} ${f(b.y)}) rotate(${deg(b.a)})"><rect x="${f(-hw)}" y="${f(-hh)}" width="${f(b.w)}" height="${f(b.h)}" fill="${b.c}" stroke="#0000004d" stroke-width=".9"/><rect x="${f(-hw)}" y="0" width="${f(b.w)}" height="${f(hh)}" fill="#000" opacity=".15"/><line x1="${f(-hw)}" x2="${f(hw)}" y1="0" y2="0" stroke="#fff" stroke-opacity=".32" stroke-width=".9"/>${b.u?`<rect x="${f(b.u[0]-1.8)}" y="${f(b.u[1]-1.8)}" width="3.6" height="3.6" fill="#e6e6e2" stroke="#0003" stroke-width=".4"/>`:""}</g>`});
 let tsh="",tr="";
 trees.forEach(t=>{tsh+=`<circle cx="${f(t.x+3)}" cy="${f(t.y+4)}" r="${f(t.r)}"/>`;
  tr+=`<circle cx="${f(t.x)}" cy="${f(t.y)}" r="${f(t.r)}" fill="${pick(["#3f6b2f","#4a7a3a","#35602a"])}"/><circle cx="${f(t.x-t.r*.25)}" cy="${f(t.y-t.r*.28)}" r="${f(t.r*.62)}" fill="${pick(["#5d8f45","#6a9a4e","#78a458"])}" opacity=".9"/>`});
 const casing=order.map(k=>`<path d="${roads[k].d}" stroke="#bdb9ac" stroke-width="${roads[k].w+12}" fill="none"/>`).join("");
 const asph=order.map(k=>`<path d="${roads[k].d}" stroke="#4b5157" stroke-width="${roads[k].w}" fill="none"/><path d="${roads[k].d}" stroke="#5c6268" stroke-width="${f(roads[k].w*.42)}" fill="none" opacity=".55"/>`).join("");
 const marks=keys.map(k=>`<path d="${center[k]}" stroke="${roads[k].main?"#e9dfae":"#e4e4dc"}" stroke-width="${roads[k].main?3:2.2}" stroke-dasharray="${roads[k].main?"24 20":"14 14"}" fill="none" opacity=".9"/>`).join("");
 const carsS=cars.map(c=>`<g transform="translate(${f(c.x)} ${f(c.y)}) rotate(${deg(c.a)})"><rect x="-3.2" y="-1.7" width="10" height="5.6" rx="1.6" fill="#000" opacity=".3"/><rect x="-5" y="-2.8" width="10" height="5.6" rx="1.6" fill="${c.c}"/><rect x="-1.4" y="-2.1" width="3.8" height="4.2" rx=".8" fill="#1b232b" opacity=".75"/></g>`).join("");
 const parkS=parks.map(p=>`<rect x="${f(p.x)}" y="${f(p.y)}" width="${f(p.w)}" height="${f(p.h)}" rx="11" fill="#6b8b59"/><rect x="${f(p.x)}" y="${f(p.y)}" width="${f(p.w)}" height="${f(p.h)}" rx="11" fill="none" stroke="#c9c3ad" stroke-width="3"/><path d="M${f(p.x+10)} ${f(p.y+p.h-12)} Q${f(p.x+p.w/2)} ${f(p.y+10)} ${f(p.x+p.w-10)} ${f(p.y+p.h/2)}" stroke="#d3ccb6" stroke-width="3.5" fill="none" opacity=".9"/>`).join("");
 const pondS=ponds.map(o=>`<ellipse cx="${f(o.x)}" cy="${f(o.y)}" rx="${f(o.rx+4)}" ry="${f(o.ry+4)}" fill="#8aa479"/><ellipse cx="${f(o.x)}" cy="${f(o.y)}" rx="${f(o.rx)}" ry="${f(o.ry)}" fill="#3f6b73"/><ellipse cx="${f(o.x-o.rx*.2)}" cy="${f(o.y-o.ry*.3)}" rx="${f(o.rx*.5)}" ry="${f(o.ry*.4)}" fill="#5f8f93" opacity=".6"/>`).join("");
 return `<defs>${pathDefs("sl-")}
 <filter id="b24" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="24"/></filter>
 <filter id="b1" x="-2%" y="-2%" width="104%" height="104%"><feGaussianBlur stdDeviation="1.1"/></filter>
 <filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".009" numOctaves="4" seed="5"/><feColorMatrix values="0 0 0 0 .36  0 0 0 0 .30  0 0 0 0 .17  0 1 0 0 -.32"/></filter>
 <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .08  0 0 0 0 .08  0 0 0 0 .06  1.6 0 0 0 -.62"/></filter>
 <radialGradient id="vig" cx=".5" cy=".5" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs>
 <rect width="${W}" height="${H}" fill="#9fae8c"/><g filter="url(#b24)" opacity=".65">${patches}</g><rect width="${W}" height="${H}" filter="url(#mottle)"/>
 ${parkS}${pondS}<g fill="#0b120a" opacity=".32" filter="url(#b1)">${shadow}</g>${roof}
 ${casing}${asph}${marks}${carsS}
 <g fill="#0b120a" opacity=".34" filter="url(#b1)">${tsh}</g>${tr}
 ${labels("sl-",true)}
 <rect width="${W}" height="${H}" filter="url(#grain)" opacity=".5"/><rect width="${W}" height="${H}" fill="url(#vig)"/>`}

function roadmap(){
 const bl=blds.map(b=>`<rect transform="translate(${f(b.x)} ${f(b.y)}) rotate(${deg(b.a)})" x="${f(-b.w/2)}" y="${f(-b.h/2)}" width="${f(b.w)}" height="${f(b.h)}" rx="1.2" fill="#e7e3da" stroke="#d6d1c4" stroke-width=".8"/>`).join("");
 const pk=parks.map(p=>`<rect x="${f(p.x)}" y="${f(p.y)}" width="${f(p.w)}" height="${f(p.h)}" rx="11" fill="#cde8c5"/>`).join("");
 const tr=trees.filter(t=>inPark(t.x,t.y,0)).map(t=>`<circle cx="${f(t.x)}" cy="${f(t.y)}" r="${f(t.r*.7)}" fill="#b5d9aa"/>`).join("");
 const wt=ponds.map(o=>`<ellipse cx="${f(o.x)}" cy="${f(o.y)}" rx="${f(o.rx)}" ry="${f(o.ry)}" fill="#a9d3e2"/>`).join("");
 const cas=order.map(k=>`<path d="${roads[k].d}" stroke="${roads[k].main?"#e2b04c":"#c5c9cc"}" stroke-width="${roads[k].w+(roads[k].main?5:4)}" fill="none"/>`).join("");
 const fill=order.map(k=>`<path d="${roads[k].d}" stroke="${roads[k].main?"#fbd57f":"#fff"}" stroke-width="${roads[k].w}" fill="none"/>`).join("");
 return `<defs>${pathDefs("rl-")}</defs><rect width="${W}" height="${H}" fill="#f3f1ea"/>${pk}${tr}${wt}${bl}${cas}${fill}${labels("rl-",false)}`}

document.getElementById("satSvg").innerHTML=satellite();
document.getElementById("roadSvg").innerHTML=roadmap();

/* nuqtalarni yo'l bo'ylab joylashtirish (foizda qaytaradi) */
const GAP=17,placed=[];
function slots(key){const r=roads[key],u=r.use,off=r.w/2+6,out=[];
 for(const sd of[1,-1]){let last=-99;for(let i=0;i<u.length;i++){if(i-last<GAP/3)continue;const q=side(u[i],sd*off);if(inView(q.x,q.y,6)&&nearest(q.x,q.y,key).clr>3){out.push({x:q.x,y:q.y,i,sd});last=i}}}
 return out.sort((a,b)=>a.i-b.i||a.sd-b.sd)}
const SL={};for(const k in roads)SL[k]=slots(k);
const take=(key,n)=>{const s=SL[key];return Array.from({length:n},(_,k)=>s[Math.min(s.length-1,Math.floor((k+.5)*s.length/n))])};
const pct=(q,key)=>({x:q.x/W*100,y:q.y/H*100,street:roads[key].name,key});
const mains=["A","B","H","V"],minors=[["C",4],["D",3],["D2",3],["E",3],["F",3],["G",2],["J",2]],lt=[];
const caps=mains.map(k=>SL[k].length),tot=caps.reduce((a,b)=>a+b,0),cnt=caps.map(c=>Math.floor(100*c/tot));
for(let d=100-cnt.reduce((a,b)=>a+b,0),i=0;d>0;d--,i++)cnt[i%4]++;
mains.forEach((k,i)=>take(k,cnt[i]).forEach(q=>lt.push(pct(q,k))));
minors.forEach(([k,n])=>take(k,n).forEach(q=>lt.push(pct(q,k))));
lt.forEach(l=>placed.push([l.x*W/100,l.y*H/100]));
function spot(key,frac,sd,extra){const r=roads[key],u=r.use,i0=Math.round(Math.min(.98,Math.max(.02,frac))*(u.length-1)),off=r.w/2+extra;
 for(let t=0;t<80;t++)for(const j of[i0+t,i0-t]){if(j<0||j>=u.length)continue;const q=side(u[j],sd*off);
  if(inView(q.x,q.y,6)&&nearest(q.x,q.y,key).clr>3&&placed.every(o=>Math.hypot(o[0]-q.x,o[1]-q.y)>=GAP)){placed.push([q.x,q.y]);return pct(q,key)}}
 const q=side(u[i0],sd*off);placed.push([q.x,q.y]);return pct(q,key)}
function lightSpot(i){if(i<lt.length)return lt[i];const j=i-lt.length,key=minors[j%minors.length][0];return spot(key,.1+((j*.137)%.8),j%2?1:-1,6)}
const scr=[["A",.15,1],["A",.4,-1],["A",.62,1],["A",.84,-1],["B",.18,-1],["B",.42,1],["B",.66,-1],["B",.86,1],["H",.3,1],["H",.7,-1],["V",.5,1],["V",.82,-1]];
const screenSpot=i=>{const s=scr[i%scr.length];return spot(s[0],s[1],s[2],24)};
window.MapGeo={lightSpot,screenSpot};
})();
