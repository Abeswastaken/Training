/* ============ Psychrometric chart tool: state point, process loads and mixed air, at any elevation ============ */
(()=>{
const P=AK.PSY,f0=v=>Math.round(v),f1=K.f1,f2=K.f2,n0=PK.n0;
const $=id=>document.getElementById(id);
let ST={ft:0,pt:{db:75,k:"wb",v:62.5},pr:{t1:80,rh1:50,t2:58,rh2:90,cfm:1200},mx:{oat:20,orh:60,rat:72,rrh:30,oa:25,mat:59}};
try{const o=JSON.parse(localStorage.getItem("psy-tool")||"{}");for(const k in o)ST[k]=typeof o[k]==="object"?{...ST[k],...o[k]}:o[k]}catch(e){}
const save=()=>{try{localStorage.setItem("psy-tool",JSON.stringify(ST))}catch(e){}};
const pNow=()=>PK.Palt(ST.ft),atP=fn=>PK.at(pNow(),fn);
const C={x:60,y:30,w:580,h:300,T:[20,110],gr:180};
const cl=(v,a,b)=>Math.max(a,Math.min(b,isFinite(v)?v:a));
const ELEV=[[0,"Sea level"],[2500,"2,500 ft"],[5000,"5,000 ft"],[7500,"7,500 ft"],[10000,"10,000 ft"]];
const elevSel=()=>`<label class="phF"><span>Elevation</span><select data-elev>${ELEV.map(([v,l])=>`<option value="${v}"${v===ST.ft?" selected":""}>${l}</option>`).join("")}${ELEV.some(e=>e[0]===ST.ft)?"":`<option value="${ST.ft}" selected>${n0(ST.ft)} ft</option>`}<option value="x">Other...</option></select></label>`;
const inp=(g,k,l,u,st="any")=>`<label class="phF"><span>${l}</span><span class="phIn"><input type="number" inputmode="decimal" step="${st}" data-g="${g}" data-k="${k}" value="${ST[g][k]}"><em>${u}</em></span></label>`;
const pline=()=>`${n0(ST.ft)} ft: ${f2(pNow())} psia, density factor ${f2(PK.DF(ST.ft))}`;
/* wire the shared bits of a tab: number inputs, selects and the elevation picker */
const wire=(el,upd)=>{el.addEventListener("input",e=>{const t=e.target;if(t.dataset.g&&t.type==="number"){const v=parseFloat(t.value);if(isFinite(v)){ST[t.dataset.g][t.dataset.k]=v;save();upd()}}});
 el.addEventListener("change",e=>{const t=e.target;if(t.dataset.g&&t.tagName==="SELECT"){ST[t.dataset.g][t.dataset.k]=t.value;save();upd(true)}
  if(t.hasAttribute("data-elev")){if(t.value==="x"){const v=prompt("Elevation in feet",ST.ft);if(v!==null&&isFinite(+v))ST.ft=cl(Math.round(+v),0,14000)}else ST.ft=+t.value;save();document.querySelectorAll("[data-elev]").forEach(s=>{if(![...s.options].some(o=>+o.value===ST.ft))s.insertAdjacentHTML("afterbegin",`<option value="${ST.ft}">${n0(ST.ft)} ft</option>`);s.value=ST.ft});REFRESH.forEach(f=>f())}})};
const REFRESH=[];
const tbl=rows=>`<table class="lsTbl">${rows.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td>${r[2]!==undefined?`<td>${r[2]}</td>`:""}</tr>`).join("")}</table>`;
/* state from a dry bulb and one other property, at the current pressure */
const KINDS={wb:["Wet bulb","°F"],rh:["Relative humidity","%"],dp:["Dew point","°F"],gr:["Humidity ratio","gr/lb"]};
function stateOf(db,k,v){db=cl(db,-20,130);let W,note="";const Ws=P.Ws(db);
 if(k==="wb"){if(v>db){v=db;note="The wet bulb can't be above the dry bulb."}W=P.Wwb(db,v)}
 else if(k==="rh"){v=cl(v,0.5,100);W=P.Wrh(db,v/100)}
 else if(k==="dp"){if(v>db){v=db;note="The dew point can't be above the dry bulb."}W=P.Ws(v)}
 else W=v/7000;
 if(W>Ws){W=Ws;note=note||"That is more moisture than air can hold at this temperature: shown saturated."}
 if(W<0){W=0.00001;note="Those two readings don't go together: the air would have less than no moisture."}
 return {...PK.st(db,W),note}}
function mountPoint(el){
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="ptSvg" viewBox="0 0 720 400" role="img" aria-label="Psychrometric chart with your point"></svg></div><p class="note" id="ptP"></p></div>
 <div class="lsSide"><div class="group"><h3>Your readings</h3>${elevSel()}${inp("pt","db","Dry bulb","°F")}
  <label class="phF"><span>Second reading</span><select data-g="pt" data-k="k">${Object.entries(KINDS).map(([k,[l]])=>`<option value="${k}"${ST.pt.k===k?" selected":""}>${l}</option>`).join("")}</select></label>
  <label class="phF"><span id="ptVl"></span><span class="phIn"><input type="number" inputmode="decimal" step="any" data-g="pt" data-k="v" value="${ST.pt.v}"><em id="ptVu"></em></span></label></div>
 <div class="group"><h3>This air</h3><div id="ptOut"></div></div></div></div>`;
 const upd=()=>atP(()=>{const [l,u]=KINDS[ST.pt.k];$("ptVl").textContent=l;$("ptVu").textContent=u;const s=stateOf(ST.pt.db,ST.pt.k,ST.pt.v);
  const on=s.T>=C.T[0]&&s.T<=C.T[1]&&s.gr<=C.gr;
  $("ptSvg").innerHTML=AK.psy({...C,rh:[0.2,0.4,0.6,0.8],wb:[40,50,60,70,80],hs:[15,20,25,30,35,40,45,50],title:ST.ft?"CHART FOR "+n0(ST.ft)+" FT":"CHART FOR SEA LEVEL",...(on?{proj:{T:s.T,W:s.W,parts:["db","dp","gr","wb"]},pts:[{T:s.T,W:s.W,c:"#c0392b"}]}:{})});
  $("ptP").textContent=pline()+(on?"":". This point is off the chart, but the numbers are still right.");
  $("ptOut").innerHTML=(s.note?`<p class="lsRes no">${s.note}</p>`:"")+tbl([["Dry bulb",f1(s.T)+"°F"],["Wet bulb",f1(s.wb)+"°F"],["Relative humidity",f1(s.rh*100)+"%"],["Dew point",f1(s.dp)+"°F"],["Humidity ratio",f1(s.gr)+" gr/lb"],["Enthalpy",f2(s.h)+" Btu/lb"],["Specific volume",f2(s.v)+" ft³/lb"],["Density",(1/s.v*(1+s.W)).toFixed(4)+" lb/ft³"]])});
 wire(el,upd);REFRESH.push(upd);upd()}
function mountProc(el){
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="prSvg" viewBox="0 0 720 400" role="img" aria-label="Your process on the psychrometric chart"></svg></div><p class="note" id="prP"></p></div>
 <div class="lsSide"><div class="group"><h3>Entering air</h3>${elevSel()}${inp("pr","t1","Dry bulb","°F")}${inp("pr","rh1","Relative humidity","%")}</div>
 <div class="group"><h3>Leaving air</h3>${inp("pr","t2","Dry bulb","°F")}${inp("pr","rh2","Relative humidity","%")}${inp("pr","cfm","Airflow","CFM")}</div>
 <div class="group"><h3>What the equipment did</h3><div id="prOut"></div></div></div></div>`;
 const upd=()=>atP(()=>{const S=ST.pr,df=PK.DF(ST.ft),a=PK.rh(cl(S.t1,-20,130),cl(S.rh1,0.5,100)/100),b=PK.rh(cl(S.t2,-20,130),cl(S.rh2,0.5,100)/100),L=PK.load(a,b,Math.max(0,S.cfm),df);
  $("prSvg").innerHTML=AK.psy({...C,rh:[0.2,0.4,0.6,0.8],title:PK.name(a,b).toUpperCase(),segs:[{a:[a.T,a.W],b:[b.T,a.W],c:"#c0392b",w:2.4,dash:"5 4"},{a:[b.T,a.W],b:[b.T,b.W],c:"#2f6fd6",w:2.4,dash:"5 4"},{a:[a.T,a.W],b:[b.T,b.W],c:"var(--ink)",w:3.2,arrow:Math.abs(a.T-b.T)+Math.abs(a.gr-b.gr)>3}],pts:[{T:a.T,W:a.W,c:"#c0392b",lbl:"IN",dy:-12,w:40},{T:b.T,W:b.W,c:"#2f6fd6",lbl:"OUT",a:"end",dx:-12,dy:-12,w:48}]});
  $("prP").textContent=pline()+". Minus means removed from the air.";
  const sg=v=>(v<0?"−":"")+n0(Math.abs(v));
  $("prOut").innerHTML=tbl([["Sensible",sg(L.qs)+" Btu/h",f2(1.08*df)+" × CFM × ΔT"],["Latent",sg(L.ql)+" Btu/h","total − sensible"],["Total",sg(L.qt)+" Btu/h",f2(4.5*df)+" × CFM × Δh"],["Tons",f2(Math.abs(L.qt)/12000),""],["Sensible heat ratio",Math.abs(L.qt)>500?f2(L.shr):"n/a",""],["Water",(L.lb<0?"−":"+")+f1(Math.abs(L.lb))+" lb/h",f1(Math.abs(L.lb)/8.34)+" gal/h"],["Entering",f1(a.gr)+" gr, "+f2(a.h)+" Btu/lb","WB "+f1(a.wb)+"°F"],["Leaving",f1(b.gr)+" gr, "+f2(b.h)+" Btu/lb","WB "+f1(b.wb)+"°F"]])});
 wire(el,upd);REFRESH.push(upd);upd()}
function mountMix(el){
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="mxSvg" viewBox="0 0 720 380" role="img" aria-label="Mixing box"></svg></div><p class="note" id="mxP"></p></div>
 <div class="lsSide"><div class="group"><h3>The two airstreams</h3>${elevSel()}${inp("mx","oat","Outside air","°F")}${inp("mx","orh","Outside RH","%")}${inp("mx","rat","Return air","°F")}${inp("mx","rrh","Return RH","%")}</div>
 <div class="group"><h3>Mixed air from the damper position</h3>${inp("mx","oa","Outside air","%")}<div id="mxOut"></div></div>
 <div class="group"><h3>Outside air % from three temperatures</h3>${inp("mx","mat","Measured mixed air","°F")}<div id="mxOut2"></div></div></div></div>`;
 const upd=()=>atP(()=>{const S=ST.mx,oa=PK.rh(cl(S.oat,-30,125),cl(S.orh,0.5,100)/100),ra=PK.rh(cl(S.rat,40,100),cl(S.rrh,0.5,100)/100),f=cl(S.oa,0,100)/100,ma=PK.mix(ra,oa,f);
  $("mxSvg").innerHTML=PK.mixbox({oa,ra,ma,f});$("mxP").textContent=pline()+". MAT = OAT × %OA + RAT × %RA.";
  $("mxOut").innerHTML=tbl([["Mixed air",f1(ma.T)+"°F"],["Mixed RH",f0(ma.rh*100)+"%"],["Mixed wet bulb",f1(ma.wb)+"°F"],["Mixed grains",f1(ma.gr)+" gr/lb"],["Mixed enthalpy",f2(ma.h)+" Btu/lb"]]);
  const d=S.rat-S.oat,p=(S.rat-S.mat)/d*100;
  $("mxOut2").innerHTML=Math.abs(d)<3?`<p class="lsRes no">Outside and return air are too close together to tell. Try again when they are at least 10°F apart.</p>`:p<-2||p>102?`<p class="lsRes no">The mixed air reading isn't between the outside and return temperatures. Check the three readings.</p>`:tbl([["Outside air",f0(cl(p,0,100))+"%","("+f1(S.rat)+" − "+f1(S.mat)+") ÷ ("+f1(S.rat)+" − "+f1(S.oat)+")"]])+(Math.abs(d)<10?`<p class="note">Only ${f0(Math.abs(d))}°F between outside and return: a 1°F thermometer error moves this answer by ${f0(100/Math.abs(d))}%.</p>`:"")});
 wire(el,upd);REFRESH.push(upd);upd()}
window.__psy={get ST(){return ST},stateOf:(db,k,v,ft=0)=>PK.at(PK.Palt(ft),()=>stateOf(db,k,v))};
window.LESSON={id:"psy-tool",sec:"Psychrometrics",secHref:"/",title:"Psychrometric chart",lead:"Plot any air condition, work out what a coil, furnace or humidifier did to the air, and solve mixed air problems, at sea level or at your elevation.",
 tabs:[{id:"point",label:"Chart",mount:mountPoint},{id:"proc",label:"Process",mount:mountProc},{id:"mix",label:"Mixed air",mount:mountMix}],steps:[],tasks:[],sources:[]};
})();
