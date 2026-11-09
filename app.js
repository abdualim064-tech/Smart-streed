const titles={dashboard:"Dashboard",map:"Xarita",lights:"Ko‘cha chiroqlari",screens:"Reklama ekranlari",offers:"Takliflar",campaigns:"Kampaniyalar",clients:"Mijozlar",reports:"Hisobotlar",settings:"Sozlamalar"};
const streets=["Markaziy ko‘cha","Mustaqillik ko‘chasi","Yangi mahalla","Bog‘bonlar ko‘chasi","Istiqlol ko‘chasi"];
const lights=Array.from({length:120},(_,i)=>{const sp=MapGeo.lightSpot(i);return{id:"CH-"+String(i+1).padStart(3,"0"),area:i<100?"Katta yo‘l":"Mahalla",street:sp.street,status:[9,38,71,105].includes(i)?"fault":i%9===0?"off":"on",x:sp.x,y:sp.y}});
const screens=Array.from({length:12},(_,i)=>{const sp=MapGeo.screenSpot(i);return{id:"RE-"+String(i+1).padStart(3,"0"),street:sp.street,status:i===11?"fault":"on",x:sp.x,y:sp.y}});
const offers=[{client:"Baraka Market",ad:"Mahsulot reklamasi",duration:"30 kun",price:"2 500 000 so‘m",status:"pending"},{client:"Navro‘z Savdo",ad:"Mavsumiy chegirma",duration:"14 kun",price:"1 200 000 so‘m",status:"pending"},{client:"Ideal Textile",ad:"Yangi kolleksiya",duration:"30 kun",price:"3 000 000 so‘m",status:"pending"}];
const $=id=>document.getElementById(id);
const ads=[
{b:"Shirin Non",t:"Issiq non, har ertalab",e:"🥖",c:["#b45309","#f59e0b"]},
{b:"Bahor Suv",t:"Toza tog‘ suvi",e:"💧",c:["#0369a1","#38bdf8"]},
{b:"Smart Mobil",t:"Smartfonlar muddatli to‘lovga",e:"📱",c:["#1e293b","#475569"]},
{b:"Orzu Mebel",t:"Uyingizga qulaylik",e:"🛋️",c:["#9f1239","#fb7185"]},
{b:"Tez Yetkazish",t:"30 daqiqada eshigingizda",e:"🚚",c:["#15803d","#4ade80"]},
{b:"Nur Optika",t:"Ko‘zingiz uchun g‘amxo‘rlik",e:"👓",c:["#0e7490","#22d3ee"]},
{b:"Zamin Avto",t:"Ishonchli ehtiyot qismlar",e:"🚗",c:["#991b1b","#f87171"]},
{b:"Olma Cafe",t:"Qahva va shirinliklar",e:"☕",c:["#78350f","#d97706"]},
{b:"Sog‘lom Dorixona",t:"Sog‘lig‘ingiz — ustuvorligimiz",e:"💊",c:["#047857","#34d399"]},
{b:"Kitobxon",t:"Yangi kitoblar -20%",e:"📚",c:["#3730a3","#818cf8"]},
{b:"Fit Zone",t:"Birinchi mashg‘ulot bepul",e:"🏋️",c:["#be185d","#f472b6"]},
{b:"Gul Bozor",t:"Bayram uchun gullar",e:"💐",c:["#a21caf","#e879f9"]}];
const look={"Baraka Market":{b:"Baraka Market",t:"Har kuni yangi mahsulotlar",e:"🛒",c:["#0d9488","#14b8a6"]},"Navro‘z Savdo":{b:"Navro‘z Savdo",t:"Mavsumiy chegirma −30%",e:"🏷️",c:["#d97706","#f59e0b"]},"Ideal Textile":{b:"Ideal Textile",t:"Yangi kolleksiya keldi",e:"👗",c:["#7c3aed","#c084fc"]}};
let tick=0;
const liveAds=()=>ads.concat(offers.filter(o=>o.status==="approved").map(o=>look[o.client]||{b:o.client,t:o.ad,e:"📢",c:["#0d9488","#14b8a6"]}));
const adOf=s=>{const a=liveAds();return a[(screens.indexOf(s)+tick)%a.length]};
const scName={on:"Faol",off:"O‘chiq",fault:"Nosoz"};
const adHTML=s=>s.status==="fault"?"⚠ TEXNIK NOSOZLIK":s.status==="off"?"<b style=\"opacity:.6\">EKRAN O‘CHIQ</b>":`<span class="ade">${adOf(s).e}</span><b>${adOf(s).b}</b><small>${adOf(s).t}</small>`;
const adStyle=s=>s.status==="fault"?"background:#4b5563":s.status==="off"?"background:#0b1220":`background:linear-gradient(135deg,${adOf(s).c[0]},${adOf(s).c[1]})`;
function updateAds(){document.querySelectorAll(".preview[data-s]").forEach(el=>{const s=screens.find(x=>x.id===el.dataset.s);if(s){el.style.cssText=adStyle(s);el.innerHTML=adHTML(s);el.classList.remove("swap");void el.offsetWidth;el.classList.add("swap")}})}
const AD_SECONDS=10;
setInterval(()=>{tick++;updateAds()},AD_SECONDS*1000);
let sel=null;const stName={on:"Yoniq",off:"O‘chiq",fault:"Nosoz"};
function notify(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(notify.t);notify.t=setTimeout(()=>$("toast").classList.remove("show"),2200)}
function page(id){if(sel)closeCard();document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll("nav button[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===id));$("heading").textContent=titles[id];$("sidebar").classList.remove("open");if(id==="lights")renderLights();if(id==="offers")renderOffers();if(id==="campaigns")renderCampaigns()}
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>page(b.dataset.page));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>page(b.dataset.go));$("menu").onclick=()=>$("sidebar").classList.toggle("open");
function renderPins(){["pins"].forEach(id=>{const host=$(id);host.innerHTML="";lights.forEach(l=>{const p=document.createElement("button");p.className="pin "+l.status+(sel&&sel.id===l.id?" sel":"");p.style.left=l.x+"%";p.style.top=l.y+"%";p.title=l.id+" · "+l.street+" · "+stName[l.status];p.onclick=()=>selectPin("l",l.id);host.append(p)});screens.forEach((s,i)=>{const p=document.createElement("button");p.className="pin screen"+(s.status==="fault"?" sfault":s.status==="off"?" soff":"")+(sel&&sel.id===s.id?" sel":"");p.style.left=s.x+"%";p.style.top=s.y+"%";p.title=s.id+" · "+s.street+" · "+adOf(s).b;p.onclick=()=>selectPin("s",s.id);host.append(p)})})}
function updateStats(){let c={on:0,off:0,fault:0};lights.forEach(l=>c[l.status]++);const sf=screens.filter(s=>s.status==="fault").length;$("statTotal").textContent=$("totalTxt").textContent=$("mapTotal").textContent=lights.length;$("lgOn").textContent=c.on;$("lgOff").textContent=c.off;$("lgFault").textContent=c.fault;$("lgScr").textContent=$("mapScr").textContent=$("scrCount").textContent=screens.length;$("scrSub").textContent=screens.filter(s=>s.status==="on").length+" faol · "+screens.filter(s=>s.status==="off").length+" o‘chiq · "+sf+" nosoz";$("areaBig").textContent=lights.filter(l=>l.area==="Katta yo‘l").length;$("areaSmall").textContent=lights.filter(l=>l.area==="Mahalla").length;$("statOn").textContent=c.on;$("statOff").textContent=c.off;$("statFault").textContent=c.fault;["on","off","fault"].forEach(k=>{let p=Math.round(c[k]/lights.length*100);$(""+k+"Pct").textContent=p+"%";$(""+k+"Bar").style.width=p+"%"});renderPins()}
function renderLights(){let q=$("search").value.toLowerCase(),s=$("status").value,a=$("area").value;let arr=lights.filter(l=>(l.id+" "+l.street).toLowerCase().includes(q)&&(s==="all"||l.status===s)&&(a==="all"||l.area===a));$("lightCount").textContent="("+arr.length+" ta)";$("lightRows").innerHTML=arr.slice(0,70).map(l=>`<tr><td>${l.id}</td><td>${l.area}</td><td>${l.street}</td><td>${l.status==="on"?"Yoniq":l.status==="off"?"O‘chiq":"Nosoz"}</td><td><div class="controls"><button class="${l.status==="on"?"sel":""}" data-id="${l.id}" data-s="on">Yoniq</button><button class="${l.status==="off"?"sel":""}" data-id="${l.id}" data-s="off">O‘chiq</button><button class="${l.status==="fault"?"sel fault":""}" data-id="${l.id}" data-s="fault">Nosoz</button></div></td></tr>`).join("");$("lightRows").querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>{lights.find(l=>l.id===b.dataset.id).status=b.dataset.s;updateStats();renderLights();notify("Chiroq holati yangilandi")})}
["search","status","area"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",renderLights));
$("addLight").onclick=()=>{let n=lights.length+1,sp=MapGeo.lightSpot(lights.length);lights.push({id:"CH-"+String(n).padStart(3,"0"),area:"Mahalla",street:sp.street,status:"on",x:sp.x,y:sp.y});updateStats();renderLights();notify("Yangi chiroq qo‘shildi")};
$("labels").onclick=()=>document.querySelectorAll(".labels").forEach(x=>x.style.display=x.style.display==="none"?"":"none");
function setScreen(id,st){const s=screens.find(x=>x.id===id);s.status=st;updateStats();renderScreens();if(sel&&sel.id===id)showCard();notify(id+": "+scName[st].toLowerCase()+" holatga o‘tkazildi")}
function renderScreens(){$("screenList").innerHTML=screens.map(s=>`<article class="screenbox"><div class="preview" data-s="${s.id}" style="${adStyle(s)}">${adHTML(s)}</div><b>${s.id}</b><p>${s.street} · <span class="st ${s.status}">${scName[s.status]}</span></p><div class="controls">${["on","off","fault"].map(t=>`<button class="${s.status===t?"sel"+(t==="fault"?" fault":""):""}" data-sid="${s.id}" data-st="${t}">${t==="on"?(s.status==="fault"?"Tuzatildi · yoqish":"Yoqish"):t==="off"?"O‘chirish":"Nosoz"}</button>`).join("")}</div></article>`).join("");
 $("screenList").querySelector1=0;$("screenList").querySelectorAll("[data-sid]").forEach(b=>b.onclick=()=>setScreen(b.dataset.sid,b.dataset.st))}renderScreens();
function renderOffers(){let n=offers.filter(o=>o.status==="pending").length;$("pendingBadge").textContent=n;$("offerRows").innerHTML=offers.map((o,i)=>`<tr><td>${o.client}</td><td>${o.ad}</td><td>${o.duration}</td><td>${o.price}</td><td>${o.status==="pending"?`<div class="controls"><button data-i="${i}" data-a="approved">Qabul qilish</button><button data-i="${i}" data-a="rejected">Rad etish</button></div>`:o.status==="approved"?"Tasdiqlandi":"Rad etildi"}</td></tr>`).join("");$("offerRows").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{const o=offers[+b.dataset.i];o.status=b.dataset.a;renderOffers();renderCampaigns();
 if(o.status==="approved"){renderScreens();renderPins();notify(o.client+" reklamasi "+screens.filter(s=>s.status==="on").length+" ta faol ekranga qo‘shildi")}else notify("Taklif rad etildi")})}
renderOffers();updateStats();
/* xarita nuqtasi bosilganda ochiladigan karta */
function selectPin(k,id){sel={k,id};renderPins();showCard()}
function closeCard(){sel=null;$("pinCard").hidden=true;renderPins()}
function showCard(){if(!sel)return;const c=$("pinCard");let h;
 if(sel.k==="l"){const l=lights.find(x=>x.id===sel.id);
  h=`<button class="pcx" id="pcX" aria-label="Yopish">✕</button><small>KO‘CHA CHIROG‘I</small><h3>${l.id}</h3><p>${l.area} · ${l.street}</p><div class="badge ${l.status}">● ${stName[l.status]}</div><div class="controls">${["on","off","fault"].map(s=>`<button class="${l.status===s?"sel"+(s==="fault"?" fault":""):""}" data-set="${s}">${stName[s]}</button>`).join("")}</div><button class="light" id="pcRow">Ro‘yxatda ko‘rish</button>`}
 else{const s=screens.find(x=>x.id===sel.id);
  h=`<button class="pcx" id="pcX" aria-label="Yopish">✕</button><small>REKLAMA EKRANI</small><h3>${s.id}</h3><p>${s.street}</p><div class="badge ${s.status}">● ${scName[s.status]}</div><div class="preview" data-s="${s.id}" style="${adStyle(s)}">${adHTML(s)}</div><div class="controls">${["on","off","fault"].map(t=>`<button class="${s.status===t?"sel"+(t==="fault"?" fault":""):""}" data-set="${t}">${t==="on"?(s.status==="fault"?"Tuzatildi":"Yoqish"):t==="off"?"O‘chirish":"Nosoz"}</button>`).join("")}</div><button class="light" id="pcRow">Ekranlar sahifasi</button>`}
 c.innerHTML=h;c.hidden=false;$("pcX").onclick=closeCard;
 c.querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>{const o=(sel.k==="l"?lights:screens).find(x=>x.id===sel.id);o.status=b.dataset.set;updateStats();renderScreens();showCard();notify(o.id+": holat yangilandi")});
 $("pcRow").onclick=()=>{if(sel.k==="l"){$("search").value=sel.id;$("status").value="all";$("area").value="all";closeCard();page("lights")}else{closeCard();page("screens")}}}
document.addEventListener("click",e=>{if(sel&&!e.composedPath().some(n=>n.matches&&n.matches(".pin,#pinCard")))closeCard()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sel)closeCard()});

function renderCampaigns(){const ap=offers.filter(o=>o.status==="approved"),n=screens.filter(s=>s.status==="on").length;
 $("campBody").innerHTML=ap.length?`<table><thead><tr><th>MIJOZ</th><th>REKLAMA</th><th>MUDDAT</th><th>NARX</th><th>EKRANLAR</th></tr></thead><tbody>${ap.map(o=>`<tr><td>${o.client}</td><td>${o.ad}</td><td>${o.duration}</td><td>${o.price}</td><td>${n} ta faol ekran</td></tr>`).join("")}</tbody></table>`:"Hozircha tasdiqlangan kampaniya yo‘q. “Takliflar” bo‘limida taklifni qabul qiling — reklama barcha faol ekranlarga avtomatik qo‘shiladi.";}
renderCampaigns();

$("allOn").onclick=()=>{screens.forEach(s=>{if(s.status==="off")s.status="on"});updateStats();renderScreens();notify("O‘chiq ekranlar yoqildi")};
$("allOff").onclick=()=>{screens.forEach(s=>{if(s.status==="on")s.status="off"});updateStats();renderScreens();notify("Faol ekranlar o‘chirildi")};
