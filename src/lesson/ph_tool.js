/* ============ P-H chart tool: interactive chart, the class calculator sheet, and a property table ============ */
(()=>{
const {BASE,FAULTS,WHY}=RF;
const $=id=>document.getElementById(id);
const ATM=[["14.7","Sea level (14.7)"],["12.2","Your sheet (12.2, about 5,000 ft)"],["ft","Pick an elevation"]];
const atmOpts=sel=>ATM.map(([v,l])=>`<option value="${v}"${v===sel?" selected":""}>${l}</option>`).join("");
const refOpts=sel=>RF.list.map(n=>`<option${n===sel?" selected":""}>${n}</option>`).join("");
const f1=K.f1,f2=K.f2,f0=K.f0;
let ST={n:"R-410A",atm:"14.7",ft:5000};try{Object.assign(ST,JSON.parse(localStorage.getItem("ph-tool")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("ph-tool",JSON.stringify(ST))}catch(e){}};
const atmV=()=>ST.atm==="ft"?RF.atmAt(ST.ft):+ST.atm;
const glide=n=>RF.at(n,40,"Pb")/RF.at(n,40,"Pd")>1.01;
/* ---------- faults ---------- */
const cycOf=()=>RF.cycle(ST.n,{Te:CH.Te,Tc:CH.Tc,sh:CH.sh,sc:CH.sc,eff:CH.eff});
let CH={...BASE(ST.n),fault:"ok"};
function setFault(k){const b=BASE(ST.n),f=FAULTS.find(x=>x[0]===k)[2];CH={Te:b.Te+(f.dTe||0),Tc:Math.min(RF.Tmax(ST.n)-4,b.Tc+(f.dTc||0)),sh:f.sh??b.sh,sc:f.sc??b.sc,eff:f.eff??b.eff,fault:k}}
/* ---------- chart tab ---------- */
function mountChart(el){
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="phSvg" viewBox="0 0 720 450" role="img" aria-label="Pressure-enthalpy chart with the refrigeration cycle"></svg></div>
  <p class="note">Drag the brass dots: <b>1</b> (suction) up and down for evaporating temperature, sideways for superheat; <b>2</b> (discharge) up and down for condensing temperature, sideways for compressor efficiency; <b>5</b> (liquid) sideways for subcooling.</p></div>
 <div class="lsSide"><div class="group"><h3>Refrigerant</h3><select id="phN" aria-label="Refrigerant">${refOpts(ST.n)}</select><p class="note" id="phGl"></p></div>
 <div class="group"><h3>Readings</h3><div class="reads lsReads" id="phR"></div></div>
 <div class="group"><h3>Change it</h3>
  <div class="row"><label for="phTe">Evaporating (suction sat.)</label><output id="phoTe"></output><input type="range" id="phTe" data-k="Te" min="-30" max="55" step="1"></div>
  <div class="row"><label for="phTc">Condensing (head sat.)</label><output id="phoTc"></output><input type="range" id="phTc" data-k="Tc" min="80" max="150" step="1"></div>
  <div class="row"><label for="phSh">Superheat</label><output id="phoSh"></output><input type="range" id="phSh" data-k="sh" min="0" max="40" step="1"></div>
  <div class="row"><label for="phSc">Subcooling</label><output id="phoSc"></output><input type="range" id="phSc" data-k="sc" min="0" max="30" step="1"></div>
  <div class="row"><label for="phEf">Compressor efficiency</label><output id="phoEf"></output><input type="range" id="phEf" data-k="eff" min="0.4" max="0.95" step="0.01"></div>
  <label class="lsPick" style="margin:4px 0">Fault <select id="phF">${FAULTS.map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</select></label>
  <label class="lsChk"><input type="checkbox" id="phGhost"> Show the normal cycle behind it</label>
  <label class="lsPick" style="margin:4px 0">Atmosphere <select id="phAtm">${atmOpts(ST.atm)}</select></label></div>
 <div class="group"><p class="note" id="phWhy"></p></div></div></div>`;
 const upd=()=>{const n=ST.n,c=cycOf(),atm=atmV();$("phTc").max=Math.floor(RF.Tmax(n)-4);
  const ghost=$("phGhost").checked&&CH.fault!=="ok"?[{c:RF.cycle(n,BASE(n)),col:"var(--muted)",dash:"6 5",lbl:"NORMAL"}]:[];
  const G=RF.chart(n,{x:70,y:24,w:610,h:330,cyc:c,cycles:ghost,handles:true});
  const yb=418,br=(a,b,t,col)=>`<path d="M${G.X(a)} ${yb-9} v9 H${G.X(b)} v-9" stroke="${col}" stroke-width="2" fill="none"/>`+K.lbl((G.X(a)+G.X(b))/2,yb+20,t,{fill:col,size:14});
  $("phSvg").innerHTML=G.s+br(c.h5,c.h1,"NRE "+f1(c.NRE),"var(--brass)")+br(c.h1,c.h2,"HOC "+f1(c.HOC),"var(--bad)");
  [["Te",v=>f0(v)+"°F"],["Tc",v=>f0(v)+"°F"],["sh",v=>f0(v)+"°F"],["sc",v=>f0(v)+"°F"],["eff",v=>f0(v*100)+"%"]].forEach(([k,fm])=>{const i=el.querySelector(`[data-k="${k}"]`);i.value=CH[k];el.querySelector("#pho"+{Te:"Te",Tc:"Tc",sh:"Sh",sc:"Sc",eff:"Ef"}[k]).textContent=fm(CH[k])});
  $("phR").innerHTML=K.reads([["Suction",f0(RF.psig(c.Ps,atm))+" psig"],["Head",f0(RF.psig(c.Pd,atm))+" psig"],["NRE (1 − 5)",f1(c.NRE)+" Btu/lb"],["HOC (2 − 1)",f1(c.HOC)+" Btu/lb"],["Heat of rejection",f1(c.HOR)+" Btu/lb"],["COP (NRE ÷ HOC)",f2(c.COP)+" : 1"],["Flow per ton",f2(c.mdot)+" lb/min"],["Discharge temp",f0(c.T2)+"°F",c.T2>225]]);
  $("phGl").textContent=glide(n)?`Blend with glide: at the same pressure it starts boiling (bubble) about ${f1(RF.Tsat(n,c.Ps,"Pd")-RF.Tsat(n,c.Ps,"Pb"))}°F below where it finishes (dew). Superheat uses dew, subcooling uses bubble.`:"Single refrigerant or near-azeotrope: bubble and dew are the same temperature.";
  $("phF").value=CH.fault;$("phWhy").innerHTML=CH.fault==="custom"?"Your own cycle. Pick a fault to compare.":WHY[CH.fault]};
 el.addEventListener("input",e=>{const k=e.target.dataset.k;if(k){CH[k]=+e.target.value;CH.fault="custom";if(!$("phF").querySelector('[value="custom"]'))$("phF").insertAdjacentHTML("beforeend",'<option value="custom">Custom</option>');upd()}});
 el.addEventListener("change",e=>{const t=e.target;if(t.id==="phN"){ST.n=t.value;save();setFault(CH.fault==="custom"?"ok":CH.fault);upd()}if(t.id==="phF"&&t.value!=="custom"){setFault(t.value);upd()}if(t.id==="phGhost")upd();
  if(t.id==="phAtm"){ST.atm=t.value==="ft"?"14.7":t.value;if(t.value==="ft"){const v=prompt("Elevation in feet",ST.ft);if(v!==null&&isFinite(+v)){ST.ft=Math.max(0,Math.min(12000,+v));ST.atm="ft"}}save();upd()}});
 // drag the handles
 const svg=$("phSvg");let drag=null;
 const pos=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())};
 svg.addEventListener("pointerdown",e=>{const h=e.target.closest("[data-ph]");if(!h)return;drag=h.dataset.ph;svg.setPointerCapture(e.pointerId);e.preventDefault()});
 svg.addEventListener("pointermove",e=>{if(!drag)return;const n=ST.n,G=RF.chart(n,{x:70,y:24,w:610,h:330,iso:false}),q=G.inv(pos(e).x,pos(e).y),c=cycOf();const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
  if(drag==="suc"){CH.Te=cl(Math.round(RF.Tsat(n,q.P,"Pd")),-30,55);const Ps=RF.at(n,CH.Te,"Pd");CH.sh=cl(Math.round(RF.TPh(n,Ps,Math.max(q.h,RF.at(n,CH.Te,"hg")))-CH.Te),0,40)}
  if(drag==="dis"){CH.Tc=cl(Math.round(RF.Tsat(n,q.P,"Pd")),80,Math.floor(RF.Tmax(n)-4));const c2=RF.cycle(n,{...CH});CH.eff=cl(Math.round((c2.h2s-c2.h1)/Math.max(0.1,q.h-c2.h1)*100)/100,0.4,0.95)}
  if(drag==="liq"){CH.sc=cl(Math.round(c.Tcb-RF.Thf(n,q.h)),0,30)}
  CH.fault="custom";if(!$("phF").querySelector('[value="custom"]'))$("phF").insertAdjacentHTML("beforeend",'<option value="custom">Custom</option>');upd()});
 svg.addEventListener("pointerup",()=>drag=null);svg.addEventListener("pointercancel",()=>drag=null);
 upd()}
/* ---------- calculator tab: the class sheet ---------- */
let CV={n:"R-134a",dp:190,llt:112,dlt:172,sp:35,slt:47};try{Object.assign(CV,JSON.parse(localStorage.getItem("ph-calc")||"{}"))}catch(e){}
function mountCalc(el){
 const inp=(k,l,u)=>`<label class="phF"><span>${l}</span><span class="phIn"><input type="number" inputmode="decimal" step="any" data-c="${k}" value="${CV[k]}"><em>${u}</em></span></label>`;
 el.innerHTML=`<div class="phCalc"><div class="group"><h3>Your readings</h3>
  <div class="phGrid"><label class="phF"><span>Refrigerant</span><select data-c="n">${refOpts(CV.n)}</select></label><label class="phF"><span>Atmosphere (psig → psia)</span><select id="pcAtm">${atmOpts(ST.atm)}</select></label></div>
  <h4>High side</h4><div class="phGrid">${inp("dp","Discharge pressure","psig")}${inp("llt","LLT (liquid line temp)","°F")}${inp("dlt","DLT (discharge line temp)","°F")}</div>
  <h4>Low side</h4><div class="phGrid">${inp("sp","Suction pressure","psig")}${inp("slt","SLT (suction line temp)","°F")}</div>
  <div class="btns"><button class="btn" id="pcEx">Load the homework example (R-134a)</button></div></div>
 <div class="group"><h3>The sheet, filled in</h3><div id="pcOut"></div></div>
 <div class="group phChart"><h3>On the chart</h3><div class="drawing"><div class="scroller"><svg id="pcSvg" viewBox="0 0 720 420" role="img" aria-label="Your readings plotted on the P-H chart"></svg></div></div></div></div>`;
 const upd=()=>{const atm=atmV(),r=RF.sheet({...CV,atm});const o=$("pcOut");
  try{localStorage.setItem("ph-calc",JSON.stringify(CV))}catch(e){}
  if(!(CV.dp>CV.sp)||!isFinite(r.Tcd)||!isFinite(r.Ted)){o.innerHTML=`<p class="lsRes no">Check the pressures: discharge must be higher than suction.</p>`;$("pcSvg").innerHTML="";return}
  const warn=[];if(r.sc<0)warn.push("LLT is above the saturated temperature, so there's no subcooling: the liquid line may have flash gas.");if(r.sh<0)warn.push("SLT is below the suction saturated temperature: that can't be superheat. Check the reading.");if(r.dsh<0)warn.push("DLT is below the condensing temperature. Check the reading.");if(r.Tcd>RF.Tmax(CV.n)-1)warn.push(`The table ends at ${RF.Tmax(CV.n)}°F condensing for ${CV.n}.`);
  const L=(a,b,c)=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`;const gl=glide(CV.n);
  o.innerHTML=(warn.length?`<p class="lsRes no">${warn.join(" ")}</p>`:"")+`<table class="lsTbl phSheet"><tr><th>High side</th><th>Value</th><th>How</th></tr>
  ${L("Discharge pressure",`${f1(CV.dp)} psig = <b>${f1(r.Pd)} psia</b>`,`psig + ${f1(atm)}`)}
  ${L("Saturated temperature",`<b>${f1(r.Tcd)}°F</b>${gl?` (bubble ${f1(r.Tcb)}°F)`:""}`,`from the table at ${f1(r.Pd)} psia${gl?"; dew for superheat, bubble for subcooling":""}`)}
  ${L("Sub-cooling",`<b>${f1(r.sc)}°F</b>`,`${f1(r.Tcb)} − LLT ${f1(CV.llt)}`)}
  ${L("Discharge superheat",`<b>${f1(r.dsh)}°F</b>`,`DLT ${f1(CV.dlt)} − ${f1(r.Tcd)}`)}
  ${L("Enthalpy liquid / vapor",`${f2(r.hfL)} / ${f2(r.hgD)} Btu/lb`,"saturated, at the condensing temperature")}
  ${L("Entropy liquid / vapor",`${r.sfL.toFixed(4)} / ${r.sgD.toFixed(4)} Btu/lb·°R`,"saturated, at the condensing temperature")}
  <tr><th>Low side</th><th></th><th></th></tr>
  ${L("Suction pressure",`${f1(CV.sp)} psig = <b>${f1(r.Ps)} psia</b>`,`psig + ${f1(atm)}`)}
  ${L("Saturated temperature",`<b>${f1(r.Ted)}°F</b>`,`from the table at ${f1(r.Ps)} psia${gl?" (dew)":""}`)}
  ${L("Superheat",`<b>${f1(r.sh)}°F</b>`,`SLT ${f1(CV.slt)} − ${f1(r.Ted)}`)}
  ${L("Enthalpy / entropy vapor",`${f2(r.hgS)} Btu/lb / ${r.sgS.toFixed(4)}`,"saturated, at the suction temperature")}</table>
  <table class="lsTbl phSheet" style="margin-top:12px"><tr><th>Result (Btu/lb)</th><th>Table at the line temp</th><th>Sheet: entropy × degrees</th></tr>
  ${L("Entering evap (point 5/6)",`<b>${f2(r.t.evap)}</b>`,`${f2(r.m.evap)} = ${f2(r.hfL)} − (${r.sfL.toFixed(4)} × ${f1(r.sc)})`)}
  ${L("Entering compressor (point 1)",`<b>${f2(r.t.enter)}</b>`,`${f2(r.m.enter)} = ${f2(r.hgS)} + (${r.sgS.toFixed(4)} × ${f1(r.sh)})`)}
  ${L("Leaving compressor (point 2)",`<b>${f2(r.t.leave)}</b>`,`${f2(r.m.leave)} = ${f2(r.hgD)} + (${r.sgD.toFixed(4)} × ${f1(r.dsh)})`)}
  ${L("HOC = leaving − entering comp",`<b>${f2(r.t.HOC)}</b>`,f2(r.m.HOC))}
  ${L("NRE = entering comp − entering evap",`<b>${f2(r.t.NRE)}</b>`,f2(r.m.NRE))}
  ${L("COP = NRE ÷ HOC",`<b>${f2(r.t.COP)} : 1</b>`,f2(r.m.COP)+" : 1")}
  ${L("Flow per ton = 200 ÷ NRE",`${f2(200/r.t.NRE)} lb/min`,`${f2(200/r.m.NRE)} lb/min`)}</table>
  <details class="phWhyM"><summary>Why are the two columns different?</summary><p>Entropy isn't heat per degree, so entropy × degrees under-corrects. The right size of step is the specific heat (cp): about 0.3 to 0.4 Btu/lb·°F for liquid and 0.2 to 0.3 for vapor, against entropy values near 0.1 and 0.22. The table column reads enthalpy straight from the property table at the actual line temperature, which is what a printed P-H chart does when you plot the point by its temperature line. If your instructor grades with the sheet method, use the right-hand column on the test.</p></details>`;
  // chart: build a cycle that matches the readings
  const n=CV.n,G=RF.chart(n,{x:70,y:24,w:610,h:330,points:false});
  const h1=r.t.enter,h2=r.t.leave,h5=r.t.evap,p=(h,P,nm,dx,dy)=>`<circle cx="${G.X(h)}" cy="${G.Y(P)}" r="6" fill="var(--brass)" stroke="var(--paper)" stroke-width="2"/>`+K.lbl(G.X(h)+dx,G.Y(P)+dy,nm,{size:13,fill:"var(--brass)"});
  const path=`M${G.X(h5)} ${G.Y(r.Ps)} H${G.X(h1)} L${G.X(h2)} ${G.Y(r.Pd)} H${G.X(h5)} Z`;
  $("pcSvg").innerHTML=G.s+`<path d="${path}" fill="rgba(210,162,76,.14)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>`+p(h5,r.Pd,"LIQUID LINE",-8,-12).replace('text-anchor:middle','text-anchor:end')+p(h5,r.Ps,"ENTERING EVAP",0,24)+p(h1,r.Ps,"ENTERING COMP",10,24)+p(h2,r.Pd,"LEAVING COMP",10,-12)};
 el.addEventListener("input",e=>{const k=e.target.dataset.c;if(k&&k!=="n"){const v=parseFloat(e.target.value);if(isFinite(v)){CV[k]=v;upd()}}});
 el.addEventListener("change",e=>{const t=e.target;if(t.dataset.c==="n"){CV.n=t.value;upd()}if(t.id==="pcAtm"){if(t.value==="ft"){const v=prompt("Elevation in feet",ST.ft);if(v!==null&&isFinite(+v)){ST.ft=Math.max(0,Math.min(12000,+v));ST.atm="ft"}}else ST.atm=t.value;save();upd()}});
 el.addEventListener("click",e=>{if(e.target.id==="pcEx"){Object.assign(CV,{n:"R-134a",dp:190,llt:112,dlt:172,sp:35,slt:47});el.querySelectorAll("[data-c]").forEach(i=>i.value=CV[i.dataset.c]);upd()}});
 upd()}
/* ---------- property table tab ---------- */
function mountTable(el){let n=ST.n,step=5;
 el.innerHTML=`<div class="group"><div class="phGrid"><label class="phF"><span>Refrigerant</span><select id="ptN">${refOpts(n)}</select></label><label class="phF"><span>Rows every</span><select id="ptS"><option value="1">1°F</option><option value="2">2°F</option><option value="5" selected>5°F</option><option value="10">10°F</option></select></label><label class="phF"><span>Atmosphere</span><select id="ptAtm">${atmOpts(ST.atm)}</select></label></div>
 <p class="note">Saturated properties. Pressures in psig use the atmosphere you pick. Enthalpy in Btu/lb and entropy in Btu/lb·°R use the ASHRAE reference (zero for saturated liquid at −40°F), the same as most US P-H charts. Values come from the NIST-equivalent equations of state (CoolProp).</p>
 <div class="phScroll"><table class="lsTbl" id="ptT"></table></div></div>`;
 const upd=()=>{const atm=atmV(),g=glide(n);let h=`<tr><th>°F</th>${g?"<th>Bubble psig</th><th>Dew psig</th>":"<th>psig</th>"}<th>psia</th><th>h liquid</th><th>h vapor</th><th>s liquid</th><th>s vapor</th></tr>`;
  for(let T=-40;T<=RF.Tmax(n);T+=step){const Pb=RF.at(n,T,"Pb"),Pd=RF.at(n,T,"Pd");h+=`<tr><td><b>${T}</b></td>${g?`<td>${f1(Pb-atm)}</td><td>${f1(Pd-atm)}</td>`:`<td>${f1(Pd-atm)}</td>`}<td>${f1(Pd)}</td><td>${f2(RF.at(n,T,"hf"))}</td><td>${f2(RF.at(n,T,"hg"))}</td><td>${RF.at(n,T,"sf").toFixed(4)}</td><td>${RF.at(n,T,"sg").toFixed(4)}</td></tr>`}
  $("ptT").innerHTML=h};
 el.addEventListener("change",e=>{const t=e.target;if(t.id==="ptN")n=t.value;if(t.id==="ptS")step=+t.value;if(t.id==="ptAtm"){if(t.value==="ft"){const v=prompt("Elevation in feet",ST.ft);if(v!==null&&isFinite(+v)){ST.ft=Math.max(0,Math.min(12000,+v));ST.atm="ft"}}else ST.atm=t.value;save()}upd()});
 upd()}
setFault("ok");
window.__ph={get CH(){return CH},setFault,cycOf,CV};
window.LESSON={id:"ph-tool",sec:"P-H charts",secHref:"/",title:"Pressure-enthalpy chart",lead:"Plot the refrigeration cycle on a real P-H chart, drag it around, break it, and fill in your class sheet from gauge readings.",
 tabs:[{id:"chart",label:"Chart",mount:mountChart},{id:"calc",label:"Calculator",mount:mountCalc},{id:"table",label:"Property table",mount:mountTable}],steps:[],tasks:[],sources:[]};
})();
