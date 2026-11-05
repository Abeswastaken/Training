/* ============ CALIBRATION TAB: pneumatic thermostat benches + fail-safe pairing ============
 Steps and numbers are from each manufacturer's installation or adjusting instructions:
 Honeywell TP970/TP971 (95-series install sheet), Johnson Controls T-4002 adjusting bulletin, Siemens/Powers TH 192 technical instructions,
 TK-1001/TK-1101 installer's guide (Crandall Stats & Sensors builds the current TK units). */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const BENCH={
 tp970:{n:"Honeywell TP970",sub:"Two-pipe, single setpoint",sup:18,supTol:1,tgt:8,tol:1,sens:2.5,sensMin:1.25,sensMax:5,tr:true,act:["DA","RA"],
  gauge:"Install a 0-30 psi gauge in the gage tap with the gage adapter (CCT729A).",screw:"calibration screw",screwHow:"Turn the calibration screw until the gauge reads 0 psi, then turn it back the other way until it reads 8 psi (±1).",
  sensHow:"Throttling range (TR) is factory set at 4°F (3 to 13 psi) and normally isn't changed. Slide the TR indicator only if the job drawings call for a different value, then recalibrate.",
  notes:["The thermostat is very sensitive: don't warm it with your hands while you calibrate.","Quick check first (direct acting): set the setpoint 5°F below room, let branch build, then raise it slowly. Bleed-off should start 1 to 3°F below room temperature. If it does, no calibration is needed."],
  link:["Honeywell TP970 installation instructions (Kele)","https://assets.kele.com/Catalog/16%20Pneumatics%20and%20Fittings/PDFs/TP970%20Installation%20Instructions.pdf"],look:{base:"#e9e4d8",accent:"#7a7468",bimetal:"strip"}},
 tp971:{n:"Honeywell TP971",sub:"Day/night, two calibration screws",sup:13,supTol:0.5,tgt:8,tol:1,sens:2.5,sensMin:1.25,sensMax:5,tr:true,act:["DA"],dn:true,
  gauge:"Install a 0-30 psi gauge in the gage tap with the gage adapter (CCT729A).",screw:"DAY (left) and NITE (right) calibration screws",
  screwHow:"With 13 psi main air (DAY), turn the left DAY screw to 0 psi, then back to 8 psi (±1). Switch main air to 18 psi (NITE), set the night dial to room temperature, and repeat with the right NITE screw.",
  sensHow:"TR is factory set at 4°F. Leave it unless the job calls for a different value.",
  notes:["Main air pressure picks the mode: 13 psi is DAY, 18 psi is NITE.","Let the system stabilize before you check calibration."],
  link:["Honeywell TP970/TP971 installation instructions (Kele)","https://assets.kele.com/Catalog/16%20Pneumatics%20and%20Fittings/PDFs/TP970%20Installation%20Instructions.pdf"],look:{base:"#e9e4d8",accent:"#7a7468",bimetal:"strip"}},
 t4002:{n:"Johnson Controls T-4002",sub:"Direct acting, high-volume relay",sup:18,supTol:1,tgt:7.5,tol:0.5,sens:2.5,sensMin:0.75,sensMax:4,act:["DA"],
  gauge:"Push the hypodermic-needle probe and gauge (X-200-140 with G-2010-11) into the plug-in test fitting. Older units: remove the test port cap screw and screw in the gauge (X-200-19).",
  screw:"calibration screw",screwHow:"With the dial set to the room temperature, turn the calibration screw until the output sits at the middle of the controlled device's spring range. This job's valve is 5-10 psi, so the target is 7.5 psi.",
  sensHow:"Default sensitivity is 2.5 psi/°F (high-volume units adjust 0.75 to 4). Move the sensitivity slider, reset the output with the slider adjusting screw, then change the dial at least 5°F and divide the output change by the dial change.",
  notes:["Before recalibrating, check the controlled device, the water temperature and whether the room load is just too big.","The target is not always 8 psi: JCI calibrates to the middle of the device's spring range."],
  link:["Johnson Controls T-4000 series catalog page (Kele)","https://assets.kele.com/Catalog/16%20Pneumatics%20and%20Fittings/PDFs/T-4000%20Series%20Catalog%20Page.pdf"],look:{base:"#dfe3e6",accent:"#3b4a59",bimetal:"strip"}},
 th192:{n:"Siemens (Powers) TH 192",sub:"Spiral bimetal",sup:18,supTol:1,supMax:25,tgt:7.5,tol:0.5,sens:2.5,sensMin:1,sensMax:4,act:["DA","RA"],wait:5,
  gauge:"Moisten the needle and insert the 192-633 test gauge and needle adapter into the test port, through the 8th opening from the top (no need to take the cover off for this).",
  screw:"calibration screw (192-632 tool or a 1/8 in. wrench)",screwHow:"With the dial at room temperature and after about 5 minutes to settle, the gauge should read 7 to 8 psi (factory: 7.5 psi at 72°F). If not, turn the calibration screw until it does.",
  sensHow:"Factory sensitivity is about 2.5 psi/°F, adjustable 1 to 4 with the sensitivity slide (flat-blade screwdriver). If you change it, recalibrate.",
  notes:["Supply must be clean, dry air at 18 psi minimum (normal 18 to 25, max 30).","Room temperature must be 70 to 80°F to calibrate.","Don't breathe on or touch the bimetal spiral."],
  link:["Siemens TH 192 technical instructions","https://manualmachine.com/siemens/powerth192s/22272691-technical-instructions"],look:{base:"#ebe8e1",accent:"#5b6a50",bimetal:"spiral"}},
 tk:{n:"TK-1001 / TK-1101",sub:"Robertshaw design, now Crandall Stats & Sensors",sup:15,supTol:1,tgt:8,tol:1,sens:2.5,sensMin:1.25,sensMax:5,tr:true,act:["DA","RA"],
  gauge:"Back the test point screw out one full turn with a 5/64 in. Allen wrench, then push the test gauge's rubber seal onto the boss.",
  screw:"calibration nut (0.48 in. six-spline wrench)",screwHow:"With the setpoint matched to an accurate thermometer, turn the calibration nut clockwise if the gauge reads above 8 psi and counterclockwise if below, until it reads 8 psi (±1). Don't loosen the hex nuts: they're tension devices.",
  sensHow:"Throttling range is factory set at 4°F per 10 psi. Set it to the lowest value that controls without cycling, then recheck calibration.",
  notes:["TK-1001 is direct acting (output rises on a temperature rise). TK-1101 is reverse acting.","Retighten the test point screw when you take the gauge off."],
  link:["TK-1001/1101 installer's guide","https://northstock.com/content/product-catalogs/crandall-stats-&-sensors/crandall-stats-&-sensors-tk-1001-tk1101-tk-12-1-and-tk-13-1-cs&s-series-thermostat-installers-guide.pdf"],look:{base:"#e4e0d6",accent:"#8a5a2b",bimetal:"strip"}}};
/* ---------- bench state ---------- */
let seed=Date.now()%100000;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function newBench(id){const B=BENCH[id];const room=Math.round((71+rnd()*5)*2)/2;const off=()=>(rnd()<0.5?-1:1)*(1.5+rnd()*2.5);
 return {id,room,sup:0,cover:true,gauge:false,dial:70,dialN:66,warm:0,screw:0,screwN:0,err:off(),errN:off(),sens:Math.max(B.sensMin,Math.min(B.sensMax,B.sens+(rnd()<0.5?0:(rnd()<0.5?-0.75:0.75)))),act:B.act[0],main:B.dn?13:B.sup,mins:0,checked:null,jobSP:72,log:[]}}
let CS={sub:"bench",bench:"tp970",S:null,pair:{app:"heat",act:"DA",dev:"NO",T:72,air:true}};
try{const s=JSON.parse(localStorage.getItem("ct-cal")||"null");if(s){CS.sub=s.sub||"bench";CS.bench=BENCH[s.bench]?s.bench:"tp970";CS.pair={...CS.pair,...(s.pair||{})}}}catch(e){}
const save=()=>{try{localStorage.setItem("ct-cal",JSON.stringify({sub:CS.sub,bench:CS.bench,pair:CS.pair}))}catch(e){}};
CS.S=newBench(CS.bench);
const night=S=>BENCH[S.id].dn&&S.main>=15.5;
/* branch pressure: bimetal temperature vs dial, plus the calibration error and screw. Supply-limited. */
function branchAt(S,dialOverride,settled){const B=BENCH[S.id],n=night(S);const sup=B.dn?S.main:S.sup;if(sup<3)return 0;
 const Tb=S.room+(settled?0:S.warm),dial=dialOverride!=null?dialOverride:(n?S.dialN:S.dial),dir=S.act==="RA"?-1:1;
 const p=8+dir*S.sens*(Tb-dial)+(n?S.errN+S.screwN:S.err+S.screw)+(S.sens-B.sens)*0.8;return Math.max(0,Math.min(sup,p))}
function trueCal(S,useNight){const t={...S,warm:0};if(BENCH[S.id].dn)t.main=useNight?18:13;return branchAt(t,S.room,true)}
function check(S){const B=BENCH[S.id],r=[];
 if(B.dn){r.push([Math.abs(S.main-13)<=0.5||Math.abs(S.main-18)<=0.5,"Main air set to 13 psi (DAY) or 18 psi (NITE)"])}
 else r.push([Math.abs(S.sup-B.sup)<=B.supTol||(B.supMax&&S.sup>=B.sup&&S.sup<=B.supMax),`Supply ${B.sup} psi${B.supMax?` (up to ${B.supMax})`:""}: you have ${S.sup.toFixed(1)}`]);
 const d=trueCal(S,false);r.push([Math.abs(d-B.tgt)<=B.tol+0.001,`${B.dn?"DAY calibration":"Calibration"}: ${d.toFixed(1)} psi with the dial at room temperature, once settled (target ${B.tgt}${B.tol<1?` ±${B.tol}`:" ±1"})`]);
 if(B.dn){const nn=trueCal(S,true);r.push([Math.abs(nn-B.tgt)<=B.tol+0.001,`NITE calibration: ${nn.toFixed(1)} psi (target 8 ±1)`])}
 r.push([Math.abs(S.sens-B.sens)<=0.26,`Sensitivity ${S.sens.toFixed(2)} psi/°F${B.tr?` (TR ${(10/S.sens).toFixed(1)}°F)`:""}: job calls for ${B.sens}${B.tr?` (TR 4°F)`:""}`]);
 r.push([Math.abs(S.dial-S.jobSP)<=0.5,`Dial returned to the job setpoint (${S.jobSP}°F)`]);
 r.push([!S.gauge&&S.cover,"Test gauge off and cover back on"]);return r}
/* ---------- drawing ---------- */
function gauge(x,y,r,val,max,label,col="#1b1f22"){const a=v=>Math.PI*(1.25-1.5*Math.min(max,Math.max(0,v))/max);let g=`<circle cx="${x}" cy="${y}" r="${r+6}" fill="url(#zSteel)" stroke="#4d555a" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fbfaf6" stroke="#4d555a"/>`;
 for(let v=0;v<=max;v+=1){const A=a(v),l=v%5===0?10:5;g+=`<path d="M${x+Math.cos(A)*r*0.92} ${y-Math.sin(A)*r*0.92} L${x+Math.cos(A)*(r*0.92-l)} ${y-Math.sin(A)*(r*0.92-l)}" stroke="#2a2f33" stroke-width="${v%5===0?1.6:0.8}"/>`;if(v%5===0)g+=`<text x="${x+Math.cos(A)*(r*0.62)}" y="${y-Math.sin(A)*(r*0.62)+4}" class="calGn">${v}</text>`}
 const A=a(val);g+=`<path d="M${x} ${y} L${x+Math.cos(A)*r*0.82} ${y-Math.sin(A)*r*0.82}" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="5" fill="#2a2f33"/>`;
 g+=`<text x="${x}" y="${y+r*0.45}" class="calGn">PSI</text><rect x="${x-30}" y="${y+r+12}" width="60" height="22" rx="3" fill="#1b1f22"/><text x="${x}" y="${y+r+28}" class="calLcd">${val.toFixed(1)}</text><text x="${x}" y="${y+r+50}" class="calL">${label}</text>`;return g}
function benchSVG(S){const B=BENCH[S.id],L=B.look,n=night(S),br=branchAt(S),sup=B.dn?S.main:S.sup;let s="";
 // tubing
 s+=`<path d="M110 300 V360 H250" stroke="#0a6e8c" stroke-width="4" fill="none"/><path d="M110 300 V250" stroke="#0a6e8c" stroke-width="4"/><text class="calL m" x="180" y="378">MAIN ${sup.toFixed(0)} PSI</text>`;
 s+=`<path d="M490 380 V396 H${S.gauge?585:560}${S.gauge?" V170 H592":""}" stroke="${S.gauge?"#0a6e8c":"#9aa3a8"}" stroke-width="3" stroke-dasharray="${S.gauge?"0":"5 4"}" fill="none"/>`;
 // supply regulator + gauge
 s+=`<rect x="80" y="300" width="60" height="44" rx="5" fill="url(#zBrass)" stroke="#6b5a1c"/><circle cx="110" cy="290" r="12" fill="#2a2f33"/><text class="calL" x="110" y="400">BENCH REGULATOR</text>`;
 s+=gauge(110,170,52,sup,30,B.dn?"MAIN AIR":"SUPPLY");
 // thermostat, cover off
 s+=`<g><rect x="250" y="60" width="300" height="320" rx="18" fill="${L.base}" stroke="${L.accent}" stroke-width="3"/>
 <text class="calBrand" x="400" y="88" style="fill:${L.accent}">${esc(B.n.toUpperCase())}</text><text class="calL m" x="400" y="104">COVER ${S.cover?"ON":"OFF"}</text>`;
 if(S.cover){s+=`<rect x="262" y="112" width="276" height="256" rx="14" fill="${L.base}" stroke="${L.accent}" opacity=".95"/>${Array.from({length:10},(_,i)=>`<rect x="300" y="${130+i*22}" width="200" height="8" rx="4" fill="${L.accent}" opacity=".25"/>`).join("")}<text class="calL" x="400" y="360">Take the cover off to reach the adjustments</text>`}
 else{
  // bimetal
  if(L.bimetal==="spiral"){let d="M330 190";for(let i=0;i<60;i++){const a=i*0.38,r=4+i*0.75;d+=` L${330+Math.cos(a)*r} ${190+Math.sin(a)*r}`}s+=`<path d="${d}" fill="none" stroke="#b07a4a" stroke-width="2.4"/><text class="calL" x="330" y="250">SPIRAL BIMETAL</text>`}
  else{const bend=(S.room+S.warm-(n?S.dialN:S.dial))*1.6;s+=`<path d="M290 130 Q${345+bend} 175 ${330+bend*1.5} 225" fill="none" stroke="#b07a4a" stroke-width="7" stroke-linecap="round"/><path d="M290 130 Q${345+bend} 175 ${330+bend*1.5} 225" fill="none" stroke="#c9cdd0" stroke-width="3" stroke-linecap="round"/><text class="calL" x="318" y="250">BIMETAL</text>`}
  if(S.warm>0.15)s+=`<text class="calL bad" x="330" y="266">WARM FROM HANDLING (+${S.warm.toFixed(1)}°F)</text>`;
  // nozzle/flapper hint
  s+=`<circle cx="360" cy="228" r="5" fill="#555"/><text class="calL m" x="372" y="232" style="text-anchor:start">NOZZLE</text>`;
  // setpoint dial
  const dv=n?S.dialN:S.dial;s+=`<g transform="translate(470 175)"><circle r="44" fill="#fbfaf6" stroke="${L.accent}" stroke-width="2"/>${[55,60,65,70,75,80,85].map(v=>{const a=(v-70)/30*Math.PI*1.2-Math.PI/2;return `<text x="${Math.cos(a)*32}" y="${Math.sin(a)*32+4}" class="calGn">${v}</text>`}).join("")}<path d="M0 0 L${Math.cos((dv-70)/30*Math.PI*1.2-Math.PI/2)*40} ${Math.sin((dv-70)/30*Math.PI*1.2-Math.PI/2)*40}" stroke="var(--hot)" stroke-width="3" stroke-linecap="round"/><circle r="5" fill="#2a2f33"/></g><text class="calL" x="470" y="236">${B.dn?(n?"NITE DIAL":"DAY DIAL"):"SETPOINT"} ${dv.toFixed(1)}°F</text>`;
  // calibration screw(s)
  const sc=(x,y,ang,lbl,act)=>`<g transform="translate(${x} ${y})"><circle r="15" fill="url(#zBrass)" stroke="${act?"var(--hot)":"#6b5a1c"}" stroke-width="${act?3:1.5}"/><path d="M-11 0 H11" stroke="#3a2e0e" stroke-width="3" transform="rotate(${ang})"/></g><text class="calL" x="${x}" y="${y+32}">${lbl}</text>`;
  if(B.dn)s+=sc(300,300,S.screw*45,"DAY CAL",!n)+sc(360,300,S.screwN*45,"NITE CAL",n);else s+=sc(330,300,S.screw*45,"CAL SCREW",true);
  // sensitivity slider
  const sp=(S.sens-B.sensMin)/(B.sensMax-B.sensMin);s+=`<rect x="420" y="282" width="110" height="8" rx="4" fill="#9aa3a8"/><rect x="${416+sp*110}" y="276" width="10" height="20" rx="2" fill="${L.accent}"/><text class="calL" x="475" y="312">${B.tr?`TR ${(10/S.sens).toFixed(1)}°F`:`SENS ${S.sens.toFixed(2)} PSI/°F`}</text>`;
  // test port
  s+=`<circle cx="520" cy="345" r="7" fill="${S.gauge?"#0a6e8c":"#555"}"/><text class="calL m" x="508" y="349" style="text-anchor:end">TEST PORT</text>`;
 }
 s+=`<text class="calL m" x="290" y="395">M</text><text class="calL m" x="510" y="395">B</text></g>`;
 // branch test gauge
 s+=S.gauge?gauge(660,170,62,br,30,"BRANCH TEST GAUGE","var(--hot)"):`<rect x="600" y="110" width="120" height="120" rx="60" fill="none" stroke="#9aa3a8" stroke-dasharray="6 5"/><text class="calL m" x="660" y="175">TEST GAUGE</text><text class="calL m" x="660" y="190">NOT CONNECTED</text>`;
 // thermometer
 s+=`<rect x="610" y="300" width="100" height="50" rx="6" fill="#1b1f22"/><text x="660" y="331" class="calLcd" style="font-size:18px">${S.room.toFixed(1)}°F</text><text class="calL" x="660" y="370">TEST THERMOMETER (ROOM)</text>`;
 return s}
/* ---------- pairing (fail-safe) ---------- */
const APPS={heat:{n:"Hot water heating coil valve",need:"open",dir:"fall",spring:[4,8],fail:"NO",why:"A heating valve should open as the room cools, and fail open (NO) so the coil can't freeze if control air is lost."},
 cool:{n:"Chilled water cooling coil valve",need:"open",dir:"rise",spring:[8,13],fail:"NC",why:"A cooling valve should open as the room warms. It's usually normally closed (NC) so a lost air line doesn't overcool the space or waste chilled water."},
 oad:{n:"Outdoor air damper (mixed air)",need:"open",dir:"rise",spring:[8,13],fail:"NC",why:"The outdoor air damper opens as the mixed air warms (free cooling) and fails closed (NC) so freezing outdoor air can't reach the coils when control air is lost."}};
function pairCalc(P){const A=APPS[P.app],dir=P.act==="DA"?1:-1;const br=P.air?Math.max(0,Math.min(18,8+dir*2.5*(P.T-72))):0;
 const pos=Math.max(0,Math.min(1,(br-A.spring[0])/(A.spring[1]-A.spring[0])));const open=P.dev==="NO"?1-pos:pos;
 const opensOnRise=(P.dev==="NO")!==(P.act==="DA");// NO+DA closes on rise
 const actionOK=A.dir==="rise"?opensOnRise:!opensOnRise;const failOK=P.dev===A.fail;return {br,open,actionOK,failOK}}
function pairSVG(P){const A=APPS[P.app],R=pairCalc(P);let s="";
 s+=`<rect x="40" y="110" width="110" height="150" rx="14" fill="#e9e4d8" stroke="#7a7468" stroke-width="2"/><text class="calBrand" x="95" y="140">${P.act}</text><text class="calL" x="95" y="160">THERMOSTAT</text><text class="calL m" x="95" y="176">SETPOINT 72°F</text><text x="95" y="215" class="calLcd" style="fill:var(--ink);font-size:20px">${P.T.toFixed(1)}°F</text><text class="calL m" x="95" y="236">ROOM</text>`;
 s+=`<path d="M150 185 H380" stroke="${P.air?"#0a6e8c":"#9aa3a8"}" stroke-width="4" ${P.air?"":'stroke-dasharray="6 5"'}/><text class="calL" x="265" y="175">BRANCH ${R.br.toFixed(1)} PSI</text>`;
 if(!P.air)s+=`<path d="M250 160 l20 50 M270 160 l-20 50" stroke="var(--bad)" stroke-width="3"/><text class="calL bad" x="265" y="232">MAIN AIR LOST</text>`;
 s+=`<text class="calL m" x="265" y="250">SPRING RANGE ${A.spring[0]}-${A.spring[1]} PSI</text>`;
 if(P.app==="oad"){s+=`<rect x="380" y="90" width="300" height="190" fill="none" stroke="#4d555a" stroke-width="3"/>`;for(let i=0;i<4;i++){const cy=115+i*45,a=(1-R.open)*80;s+=`<g transform="translate(530 ${cy}) rotate(${a})"><rect x="-140" y="-4" width="280" height="8" rx="3" fill="url(#zSteelH)" stroke="#4d555a"/></g>`}
  s+=`<text class="calL" x="530" y="300">OUTDOOR AIR DAMPER ${Math.round(R.open*100)}% OPEN (${P.dev})</text>`}
 else{const c=P.app==="heat"?"var(--hot)":"var(--cold)";s+=`<rect x="420" y="80" width="80" height="60" rx="30" fill="#5f686d" stroke="#2a2f33"/><text class="calL" x="460" y="114" style="fill:#fff">${P.dev}</text><path d="M460 140 V${180-R.open*30}" stroke="#2a2f33" stroke-width="4"/>
  <path d="M380 220 H440 L460 200 L480 220 H700" stroke="${c}" stroke-width="${4+R.open*8}" fill="none" opacity="${0.35+R.open*0.65}"/><path d="M440 190 L480 250 M440 250 L480 190" stroke="#2a2f33" stroke-width="2.4"/><rect x="448" y="${180-R.open*30}" width="24" height="10" fill="#2a2f33"/>
  <text class="calL" x="560" y="270">${esc(A.n.toUpperCase())}</text><text class="calL" x="560" y="290">${Math.round(R.open*100)}% OPEN</text>`}
 return s}
/* ---------- UI ---------- */
function benchSteps(S){const B=BENCH[S.id];return [
 ["Supply",`${B.dn?"Set main air to 13 psi for DAY (18 psi for NITE).":`Set the bench regulator to ${B.sup} psi.`}`],
 ["Cover off",`Take the cover off.${B.wait?" Set the dial to room temperature and give it about 5 minutes.":""}`],
 ["Test gauge",B.gauge],["Setpoint","Read the test thermometer and set the dial to the room temperature."],
 ["Settle","Wait for the bimetal to cool back to room temperature after handling."],["Calibrate",B.screwHow],
 ["Sensitivity",B.sensHow],["Finish",`Set the dial back to the job setpoint (${S.jobSP}°F), take the gauge off and put the cover back on.`]]}
function benchSide(S){const B=BENCH[S.id],n=night(S);
 return `<h3>${esc(B.n)} <small>${esc(B.sub)}</small></h3>
 ${B.act.length>1?`<div class="calRow"><span>Action</span><div class="seg" role="group" aria-label="Action">${B.act.map(a=>`<button data-cact="${a}" aria-pressed="${S.act===a}">${a==="DA"?"Direct acting":"Reverse acting"}</button>`).join("")}</div></div>`:""}
 <div class="row"><label for="cal_sup">${B.dn?"Main air":"Bench regulator"}</label><output id="calo_sup">${(B.dn?S.main:S.sup).toFixed(1)} psi</output><input type="range" id="cal_sup" min="0" max="25" step="0.5" value="${B.dn?S.main:S.sup}"></div>
 <div class="btns"><button class="btn" id="calCover">${S.cover?"Take cover off":"Put cover on"}</button><button class="btn" id="calGauge"${S.cover&&S.id!=="th192"?" disabled":""}>${S.gauge?"Remove test gauge":"Connect test gauge"}</button><button class="btn" id="calWait">Wait 1 minute</button></div>
 <div class="row"><label for="cal_dial">${B.dn?(n?"Night dial":"Day dial"):"Setpoint dial"}</label><output id="calo_dial">${(n?S.dialN:S.dial).toFixed(1)}°F</output><input type="range" id="cal_dial" min="55" max="85" step="0.5" value="${n?S.dialN:S.dial}"${S.cover&&S.id!=="th192"?"":""}></div>
 <div class="calRow"><span>${esc(B.screw)}${B.dn?` (${n?"NITE":"DAY"})`:""}</span><div class="btns"><button class="btn" data-cscrew="-4"${S.cover?" disabled":""}>⟲ ½ turn</button><button class="btn" data-cscrew="-1"${S.cover?" disabled":""}>⟲ ⅛</button><button class="btn" data-cscrew="1"${S.cover?" disabled":""}>⟳ ⅛</button><button class="btn" data-cscrew="4"${S.cover?" disabled":""}>⟳ ½ turn</button></div></div>
 <div class="row"><label for="cal_sens">${B.tr?"Throttling range slider":"Sensitivity slider"}</label><output id="calo_sens">${B.tr?`${(10/S.sens).toFixed(1)}°F`:`${S.sens.toFixed(2)} psi/°F`}</output><input type="range" id="cal_sens" min="${B.sensMin}" max="${B.sensMax}" step="0.05" value="${S.sens}"${S.cover?" disabled":""}></div>
 <div class="btns"><button class="btn blue" id="calCheck">Check my work</button><button class="btn" id="calNew">New thermostat</button></div>
 <div id="calRes">${S.checked?`<ul class="calChk">${S.checked.map(([ok,t])=>`<li class="${ok?"ok":"no"}">${ok?"✓":"✗"} ${esc(t)}</li>`).join("")}</ul><p class="pidRes ${S.checked.every(c=>c[0])?"ok":"no"}">${S.checked.every(c=>c[0])?"Pass: calibrated and put back to work.":"Not yet: fix the ✗ items."}</p>`:""}</div>
 <h3>Steps</h3><ol class="calSteps">${benchSteps(S).map(([a,b])=>`<li><b>${esc(a)}.</b> ${esc(b)}</li>`).join("")}</ol>
 <h3>Notes</h3><ul class="calNotes">${B.notes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 <p class="note">Source: <a href="${B.link[1]}" target="_blank" rel="noopener">${esc(B.link[0])}</a>. Drawing is a simplified layout, not the exact part. Always follow the instructions for the model in front of you.</p>`}
function pairSide(P){const R=pairCalc(P),A=APPS[P.app];
 return `<h3>Fail-safe check</h3><p class="note">Pick the application, then the thermostat action and the device. Move the room temperature to see the action, and drop the main air to see where it fails.</p>
 <div class="calRow"><span>Application</span><div class="seg" role="group" aria-label="Application">${Object.keys(APPS).map(k=>`<button data-papp="${k}" aria-pressed="${P.app===k}">${esc(APPS[k].n)}</button>`).join("")}</div></div>
 <div class="calRow"><span>Thermostat</span><div class="seg" role="group" aria-label="Thermostat action"><button data-pact="DA" aria-pressed="${P.act==="DA"}">Direct acting (DA)</button><button data-pact="RA" aria-pressed="${P.act==="RA"}">Reverse acting (RA)</button></div></div>
 <div class="calRow"><span>Device</span><div class="seg" role="group" aria-label="Device"><button data-pdev="NO" aria-pressed="${P.dev==="NO"}">Normally open (NO)</button><button data-pdev="NC" aria-pressed="${P.dev==="NC"}">Normally closed (NC)</button></div></div>
 <div class="row"><label for="pair_T">${P.app==="oad"?"Mixed air temperature":"Room temperature"}</label><output id="pairo_T">${P.T.toFixed(1)}°F</output><input type="range" id="pair_T" min="64" max="80" step="0.5" value="${P.T}"></div>
 <label class="pidChk"><input type="checkbox" id="pairAir"${P.air?"":" checked"}> Lose main air</label>
 <ul class="calChk"><li class="${R.actionOK?"ok":"no"}">${R.actionOK?"✓":"✗"} Action: ${A.dir==="rise"?"opens as the temperature rises":"opens as the temperature falls"}</li><li class="${R.failOK?"ok":"no"}">${R.failOK?"✓":"✗"} Fails ${A.fail==="NO"?"open":"closed"} on loss of air</li></ul>
 ${R.actionOK&&R.failOK?`<p class="pidRes ok">Right pairing. ${esc(A.why)}</p>`:R.actionOK?`<p class="pidRes no">It controls the right way, but on loss of air it fails the wrong way. ${esc(A.why)}</p>`:`<p class="pidRes no">Backward: it moves the wrong way as the temperature changes. Swap the thermostat action or the device.</p>`}
 <p class="note">DA: branch pressure rises as temperature rises. RA: branch falls as temperature rises. NO devices open with no air (spring), NC devices close with no air.</p>`}
function render(){const box=$("calSec");if(!box||box.hidden)return;
 document.querySelectorAll("[data-csub]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.csub===CS.sub));
 document.querySelectorAll("[data-cb]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.cb===CS.bench));$("calBenches").hidden=CS.sub!=="bench";
 if(CS.sub==="bench"){$("calSvg").setAttribute("viewBox","0 0 760 410");$("calSvg").innerHTML=benchSVG(CS.S);$("calSide").innerHTML=benchSide(CS.S)}
 else{$("calSvg").setAttribute("viewBox","0 0 760 330");$("calSvg").innerHTML=pairSVG(CS.pair);$("calSide").innerHTML=pairSide(CS.pair)}}
function quick(full){if(CS.sub==="bench"){$("calSvg").innerHTML=benchSVG(CS.S);const S=CS.S,B=BENCH[S.id],n=night(S);const o=(k,v)=>{const e=$("calo_"+k);if(e)e.textContent=v};
  o("sup",(B.dn?S.main:S.sup).toFixed(1)+" psi");o("dial",(n?S.dialN:S.dial).toFixed(1)+"°F");o("sens",B.tr?`${(10/S.sens).toFixed(1)}°F`:`${S.sens.toFixed(2)} psi/°F`)}
 else{$("calSvg").innerHTML=pairSVG(CS.pair);if(full)$("calSide").innerHTML=pairSide(CS.pair);else{const o=$("pairo_T");if(o)o.textContent=CS.pair.T.toFixed(1)+"°F"}}}
function show(on){const box=$("calSec");if(!box)return;box.hidden=!on;if(on){document.querySelector(".layout").hidden=true;const p=$("pidSec");if(p)p.hidden=true;
  document.querySelectorAll("[data-sim]").forEach(b=>b.setAttribute("aria-pressed",false));$("simPid")&&$("simPid").setAttribute("aria-pressed",false);render()}
 $("simCal").setAttribute("aria-pressed",on)}
document.addEventListener("click",ev=>{const t=ev.target;
 if(t.closest("#simCal")){show(true);return}
 if(t.closest("[data-sim]")||t.closest("#simPid")){if(!$("calSec").hidden)show(false);if(t.closest("[data-sim]"))document.querySelector(".layout").hidden=false;return}
 if(!t.closest("#calSec"))return;const S=CS.S;
 const sb=t.closest("[data-csub]");if(sb){CS.sub=sb.dataset.csub;save();render();return}
 const bb=t.closest("[data-cb]");if(bb){CS.bench=bb.dataset.cb;CS.S=newBench(CS.bench);save();render();return}
 const ab=t.closest("[data-cact]");if(ab){S.act=ab.dataset.cact;S.checked=null;render();return}
 const sc=t.closest("[data-cscrew]");if(sc&&!sc.disabled){const d=+sc.dataset.cscrew;if(night(S))S.screwN-=d*0.5;else S.screw-=d*0.5;S.checked=null;quick();return}
 const pa=t.closest("[data-papp]");if(pa){CS.pair.app=pa.dataset.papp;save();quick(1);return}
 const pc=t.closest("[data-pact]");if(pc){CS.pair.act=pc.dataset.pact;save();quick(1);return}
 const pd=t.closest("[data-pdev]");if(pd){CS.pair.dev=pd.dataset.pdev;save();quick(1);return}
 if(t.id==="calCover"){S.cover=!S.cover;if(!S.cover)S.warm=1.6;S.checked=null;render()}
 if(t.id==="calGauge"&&!t.disabled){S.gauge=!S.gauge;S.checked=null;render()}
 if(t.id==="calWait"){S.warm*=Math.exp(-1/1.5);if(S.warm<0.05)S.warm=0;S.mins++;quick()}
 if(t.id==="calCheck"){S.checked=check(S);render()}
 if(t.id==="calNew"){CS.S=newBench(CS.bench);render()}});
document.addEventListener("input",ev=>{const t=ev.target;if(!t.closest||!t.closest("#calSec"))return;const S=CS.S,B=BENCH[S.id];
 if(t.id==="cal_sup"){if(B.dn){const was=night(S);S.main=+t.value;if(was!==night(S)){S.checked=null;render();return}}else S.sup=+t.value}
 if(t.id==="cal_dial"){if(night(S))S.dialN=+t.value;else S.dial=+t.value}
 if(t.id==="cal_sens")S.sens=+t.value;
 if(t.id==="pair_T")CS.pair.T=+t.value;
 if(t.id.startsWith("cal_"))S.checked=null;quick()});
document.addEventListener("change",ev=>{if(ev.target.id==="pairAir"){CS.pair.air=!ev.target.checked;quick(1)}});
window.__cal={CS,BENCH,branchAt,trueCal,check,newBench,pairCalc,show,render};
})();
/* end cal */
