/* ============ CONTROLS: PNEUMATIC + DDC (one air handler zone, 3-way valves on both coils) ============ */
SRC.ufgsAir=["UFGS 15910N: control air compressor starts at 70 psig, stops at 90 psig; ASME tank for 125 psig; relief valve 10 to 25 psig above cut-off","https://ufgscriteriadocreport.tpub.com/15910N/15910N0050.htm"];
SRC.ufcSeq=["UFC 3-410-02A: sequenced actuators at 3 to 7 psig and 9 to 13 psig with a 2 psig deadband","https://buildingcriteria1.tpub.com/ufc_3_410_02a/ufc_3_410_02a0038.htm"];
SRC.seShift=["Schneider Electric: pneumatic actuator spring range shift (NO heating and NC cooling ranges can overlap)","https://community.se.com/t5/Building-Automation-Knowledge/What-is-pneumatic-actuator-spring-range-shift-and-how-to/ta-p/8620"];
SRC.tp970=["Honeywell TP970/TP9600 pneumatic thermostats: DA/RA action, 3 to 15 psi output, one-pipe use with an external restrictor","https://www.manualslib.com/manual/69778/Honeywell-B.html?page=10"];
SRC.mixdiv=["3-way valves: mixing is A + B to AB, diverting is AB to A + B; one valve can't do both jobs","https://industrialmonitordirect.com/blogs/knowledgebase/3-way-valve-selection-mixing-vs-diverting-applications"];
SRC.bctx=["BC Open Textbook (Plumbing): mixing vs diverting valves, placement and head loss","https://opentextbc.ca/plumbing3f/chapter/describe-control-systems-for-hydronic-systems/"];
SRC.belimo=["Belimo NRF24A-SR-O spring-return actuator: 24 V AC/DC, 2 to 10 V control, 90 s run time, spring returns open","https://tameson.com/products/actuator-modulating-2-10v-fail-safe-24-v-ac-dc-10nm-ip54-belimo-v2vt2"];
SRC.bapi=["BAPI: thermistor sensors (10K at 77°F / 25°C; resistance falls as temperature rises)","https://bapi-headless.vercel.app/hi/sensor-specs/thermistor"];
SRC.fstat=["High Performance HVAC: air handler freeze stat (stop fan, close outside air, open coil valves, alarm; test it yearly)","https://highperformancehvac.com/air-handler-water-coil-freeze-stat/"];

PHOTOS.pneu={aircomp:[gimg("tank mounted control air compressor pneumatic")],receiver:[gimg("air receiver tank relief valve auto drain")],pswitch:[gimg("air compressor pressure switch 70 90 psi")],
 dryer:[gimg("refrigerated air dryer control air")],afilter:[gimg("compressed air particulate filter bowl")],ofilter:[gimg("coalescing compressed air oil filter bowl")],prv:[gimg("pneumatic control air pressure reducing station gauges")],
 restrictor:[gimg("pneumatic restrictor tee 0.005")],tstatp:[gimg("Honeywell pneumatic room thermostat cover off")],hvalve:[gimg("pneumatic 3 way valve actuator diaphragm")],
 cvalve:[gimg("3 way diverting valve chilled water coil")],hcoil:[gimg("hot water heating coil air handler")],ccoil:[gimg("chilled water coil air handler")],sfan:[gimg("air handler supply fan")],zone:[]};
PHOTOS.ddc={ctrl:[gimg("DDC controller terminal blocks AHU panel")],xfmr:[gimg("24 VAC control transformer panel")],bas:[gimg("BAS trend graph room temperature valve")],rsens:[gimg("10K thermistor room temperature sensor wall")],
 sat:[gimg("duct temperature sensor probe")],oadmp:[gimg("outside air damper spring return actuator")],dfilter:[gimg("air filter differential pressure switch")],fstat:[gimg("freezestat low limit capillary coil")],
 hvalveE:[gimg("3 way valve electronic actuator 24V 2-10V")],cvalveE:[gimg("3 way valve electronic actuator chilled water coil")],hcoil:[gimg("hot water heating coil air handler")],ccoil:[gimg("chilled water coil air handler")],
 sfanE:[gimg("current switch fan status")],zone:[]};

const wcol=T=>mix([47,111,214],[210,58,38],(T-45)/135);
const tubeCol=p=>p>30?"#d23a26":p<0.5?"#9aa3a9":mix([128,170,184],[10,110,140],p/20);
// 10K Type II thermistor, °C to ohms
const TH2=[[-40,336450],[-30,177000],[-20,97060],[-10,55330],[0,32650],[10,19900],[20,12490],[25,10000],[30,8057],[40,5327],[50,3603],[60,2488],[70,1752],[80,1258],[90,917],[100,679]];
function thR(F){const C=(F-32)/1.8;if(C<=TH2[0][0])return TH2[0][1];for(let i=1;i<TH2.length;i++)if(C<=TH2[i][0]){const[a,ra]=TH2[i-1],[b,rb]=TH2[i];return Math.exp(Math.log(ra)+(Math.log(rb)-Math.log(ra))*(C-a)/(b-a))}return TH2[TH2.length-1][1]}
const fmtR=r=>r>=1000?`${(r/1000).toFixed(r>=100000?0:2)} kΩ`:`${f0(r)} Ω`;

const CG={};
function cGauge(p,id,cx,cy,r,max,lbl){CG[p+id]=[cx,cy,max];let n="";
 for(let i=0;i<=4;i++){const a=(-135+i*67.5)*Math.PI/180;n+=`<text x="${(cx+(r-9)*Math.sin(a)).toFixed(1)}" y="${(cy-(r-9)*Math.cos(a)+2.5).toFixed(1)}" text-anchor="middle" font-size="5.5" font-family="sans-serif" fill="#222">${max*i/4}</text>`}
 return zGauge(cx,cy,r,"#2a2f33",p+id)+n+`<text x="${cx}" y="${cy+r*0.45}" text-anchor="middle" font-size="5" font-family="sans-serif" fill="#555">PSI</text>`+
  `<line id="${p}${id}" x1="${cx}" y1="${cy+3}" x2="${cx}" y2="${cy-r+3}" stroke="#c0281c" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="2.2" fill="#222"/>`+(lbl?`<text class="zt lbx" x="${cx}" y="${cy-r-9}" text-anchor="middle">${lbl}</text>`:"")}
function setG(id,v){const g=CG[id];if(g)at(id,"transform",`rotate(${(-135+270*clamp(v/g[2],0,1.06)).toFixed(1)} ${g[0]} ${g[1]})`)}

// 3-way valve. ports: which port letter sits left, right and bottom. el: electronic actuator, else pneumatic.
function v3(p,k,cx,cy,ports,el){
 const pl=(t,x,y,a)=>`<text class="zt" x="${x}" y="${y}" text-anchor="${a}" style="font-size:8px">${t}</text>`;
 const act=el?`<rect class="hl" x="${cx-16}" y="${cy-52}" width="32" height="22" rx="3" fill="url(#zPlastic)" stroke="#8f887a" filter="url(#zShadow)"/><rect x="${cx-12}" y="${cy-48}" width="16" height="6" rx="1" fill="#2a2f33"/><text x="${cx-4}" y="${cy-43.6}" text-anchor="middle" font-size="4.5" font-family="sans-serif" fill="#cfd5d9">24V 2-10V</text><circle id="${p}${k}Led" cx="${cx+9}" cy="${cy-45}" r="2.2" fill="#2f6b3a"/><circle cx="${cx}" cy="${cy-36}" r="3.2" fill="#3b4449"/><path d="M${cx-2} ${cy-36} h4" stroke="#cfd5d9" stroke-width="1"/>`
  :`<rect x="${cx-17}" y="${cy-32}" width="34" height="4" rx="1" fill="url(#zSteelH)" stroke="#5f686d" stroke-width=".6"/><path class="hl" d="M${cx-16} ${cy-32} Q${cx} ${cy-52} ${cx+16} ${cy-32} Z" fill="url(#zPlasticDk)" stroke="#111" filter="url(#zShadow)"/><rect x="${cx-1.5}" y="${cy-48}" width="3" height="5" fill="url(#zBrass)"/>${[-14,-5,5,14].map(d=>`<circle cx="${cx+d}" cy="${cy-30}" r="1" fill="#ddd"/>`).join("")}`;
 return `<g class="part" data-p="${k}" tabindex="0">
 <rect x="${cx-8}" y="${cy-29}" width="2" height="12" fill="#9aa3a9"/><rect x="${cx+6}" y="${cy-29}" width="2" height="12" fill="#9aa3a9"/>
 <rect x="${cx-0.8}" y="${cy-30}" width="1.6" height="16" fill="#d9dee1"/><rect id="${p}${k}Ind" x="${cx+1}" y="${cy-24}" width="5" height="2.4" fill="#c0281c"/>
 <rect x="${cx-3.5}" y="${cy-17}" width="7" height="9" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".5"/>
 <rect x="${cx-13}" y="${cy-4.5}" width="6" height="9" fill="url(#zBrassH)" stroke="#5e400e" stroke-width=".5"/>
 <rect x="${cx+7}" y="${cy-4.5}" width="6" height="9" fill="url(#zBrassH)" stroke="#5e400e" stroke-width=".5"/>
 <rect x="${cx-4.5}" y="${cy+7}" width="9" height="6" fill="url(#zBrass)" stroke="#5e400e" stroke-width=".5"/>
 <ellipse class="hl" cx="${cx}" cy="${cy}" rx="9" ry="8.5" fill="url(#zBrass)" stroke="#5e400e" stroke-width=".8"/>
 ${act}
 ${pl(ports.l,cx-14,cy-7,"end")}${pl(ports.r,cx+14,cy-7,"start")}${pl(ports.b,cx+7,cy+20,"start")}
 <text class="valD" id="${p}${k}Pct" x="${cx+20}" y="${cy-36}" fill="#1d2327" style="font-size:9.5px">0%</text><text class="zt lbx" x="${cx+20}" y="${cy-25}" style="font-size:8px">${ports.t}</text>
</g>`}

const MPIPES=[["hwS1","M206 450 H328 V440",0],["hwS2","M328 440 V318",0],["hwBy","M328 440 H372 V422",0],["hwC","M350 318 V410 H360",0],["hwR","M384 410 H404 V462 H206",0],
 ["chS","M646 410 H492",1],["chA","M468 410 H448 V318",1],["chC","M430 318 V452",1],["chBy","M480 422 V452",1],["chR1","M430 452 H480",1],["chR2","M480 452 H646",1]];
function mechSvg(p,el){
 const pipes=MPIPES.map(([id,d])=>`<path id="${p}${id}" class="wpipe" d="${d}" stroke="#888" stroke-width="7" fill="none"/>`).join("");
 const flows=MPIPES.map(([id,d])=>`<path id="${p}${id}F" d="${d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round" opacity="0" pointer-events="none"/>`).join("");
 const coil=(x,k,lbl)=>`<g class="part" data-p="${k}" tabindex="0"><rect class="hl" x="${x}" y="240" width="30" height="72" fill="url(#zFins)" stroke="#5f686d" stroke-width="1.5"/><rect x="${x}" y="240" width="30" height="5" fill="url(#zSteelH)"/><rect x="${x}" y="307" width="30" height="5" fill="url(#zSteelH)"/>
  ${[0,1,2,3,4,5].map(i=>`<rect x="${x+2}" y="${249+i*10}" width="26" height="2.2" fill="#b8693a" opacity=".55"/>`).join("")}
  <text class="zt lbx" x="${x-6}" y="336" text-anchor="end">${lbl}</text></g>`;
 return `
<!-- duct -->
<path d="M206 236 L218 228 H652 L640 236 Z" fill="url(#r_galvT)"/><path d="M640 236 L652 228 V308 L640 316 Z" fill="url(#r_galvS)"/><rect x="206" y="236" width="434" height="80" fill="#cdd3d7" stroke="#6f787e" stroke-width="1.5"/><rect x="206" y="236" width="434" height="6" fill="#e6eaec"/><rect x="206" y="310" width="434" height="6" fill="#aab2b7"/>
<rect x="600" y="196" width="40" height="44" fill="#cdd3d7" stroke="#6f787e" stroke-width="1.5"/><rect x="601" y="236" width="38" height="8" fill="#cdd3d7"/>
<rect x="248" y="242" width="12" height="68" fill="url(#zPleat)" stroke="#8a8170"/>
<path id="${p}a1" class="zFlow" d="M216 276 H322" stroke="#888" opacity="0"/><path id="${p}a2" class="zFlow" d="M356 276 H422" stroke="#888" opacity="0"/><path id="${p}a3" class="zFlow" d="M456 276 H592 Q620 276 620 248 V206" stroke="#888" opacity="0"/>
${coil(324,"hcoil","HEATING COIL")}${coil(424,"ccoil","COOLING COIL")}
<g class="part" data-p="${el?"sfanE":"sfan"}" tabindex="0">${zShade(560,310,26,3)}<circle class="hl" cx="560" cy="276" r="30" fill="url(#zSteel)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><circle cx="560" cy="276" r="23" fill="#2a2f33"/>
 <g id="${p}fanB">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<path d="M560 276 L${(560+21*Math.cos(i*Math.PI/6)).toFixed(1)} ${(276+21*Math.sin(i*Math.PI/6)).toFixed(1)}" stroke="#aeb6bb" stroke-width="2.4"/>`).join("")}<circle cx="560" cy="276" r="6" fill="url(#zSteel)"/></g>
 <text class="zt lbx" x="560" y="330" text-anchor="middle">SUPPLY FAN</text></g>
<text class="valD" id="${p}tmTxt" x="290" y="300" text-anchor="middle" fill="#1d2327" style="font-size:10px"></text>
<text class="valD" id="${p}thTxt" x="389" y="300" text-anchor="middle" fill="#1d2327" style="font-size:10px"></text>
<text class="valD" id="${p}tdTxt" x="500" y="300" text-anchor="middle" fill="#1d2327" style="font-size:10px"></text>
<text class="zt lbx" x="290" y="254" text-anchor="middle">MIXED</text><text class="zt lbx" x="389" y="254" text-anchor="middle">OFF HEAT</text><text class="zt lbx" x="500" y="254" text-anchor="middle">SUPPLY AIR</text>
<!-- piping -->
${pipes}
<rect x="322" y="314" width="12" height="6" fill="url(#zCuH)"/><rect x="344" y="314" width="12" height="6" fill="url(#zCuH)"/><rect x="424" y="314" width="12" height="6" fill="url(#zCuH)"/><rect x="442" y="314" width="12" height="6" fill="url(#zCuH)"/>
${zHex(328,440,4.5,"url(#zSteel)")}${zHex(480,452,4.5,"url(#zSteel)")}
${flows}
${v3(p,el?"hvalveE":"hvalve",372,410,{l:"A",r:"AB",b:"B",t:"MIXING"},el)}
${v3(p,el?"cvalveE":"cvalve",480,410,{l:"A",r:"AB",b:"B",t:"DIVERTING"},el)}
<text class="zt lbx" x="336" y="432" style="font-size:8px">BYPASS</text><text class="zt lbx" x="486" y="440" style="font-size:8px">BYPASS</text>
<text class="valD" id="${p}hwSTxt" x="200" y="453" text-anchor="end" fill="#b02a1a" style="font-size:10px">HW supply</text>
<text class="valD" id="${p}hwRTxt" x="200" y="466" text-anchor="end" fill="#7a3a2a" style="font-size:10px">HW return</text>
<text class="valD" id="${p}chSTxt" x="652" y="413" fill="#1f56b0" style="font-size:10px">CHW supply</text>
<text class="valD" id="${p}chRTxt" x="652" y="455" fill="#2a4a7a" style="font-size:10px">CHW return</text>
<!-- zone -->
<g class="part" data-p="zone" tabindex="0">
 <rect class="hl" x="560" y="14" width="226" height="182" fill="#eef0f1" stroke="#6f787e" stroke-width="1.5"/>
 <rect id="${p}roomBg" x="561" y="15" width="224" height="180" fill="#888" opacity=".16"/>
 <text class="zl" x="572" y="32">Zone</text>
 <text class="valD" id="${p}rmTxt" x="712" y="78" text-anchor="middle" fill="#1d2327" style="font-size:22px">--</text>
 <text class="zt" x="712" y="94" text-anchor="middle">ROOM (ACTUAL)</text>
 <text class="valD" id="${p}spTxt" x="712" y="116" text-anchor="middle" fill="#3b4449" style="font-size:11px"></text>
 <text class="valD" id="${p}outTxt" x="712" y="150" text-anchor="middle" fill="#3b4449" style="font-size:11px"></text>
 <rect x="598" y="188" width="44" height="7" fill="url(#zGrille)" stroke="#6f787e"/>
 <path id="${p}diff" class="zFlow" d="M610 186 Q605 172 596 166 M630 186 Q635 172 644 166" stroke="#888" opacity="0"/>
</g>
<g id="${p}burnC" opacity="0"><path d="M424 260 l12 10 -8 8 14 12 -6 10" stroke="#111" stroke-width="2.5" fill="none"/><path d="M330 250 l10 12 -10 10 12 14" stroke="#111" stroke-width="2.5" fill="none"/><rect x="320" y="316" width="40" height="8" fill="#9fd3ff" opacity=".8"/></g>`}

function ctlAir(sim,h,oa,flow){const S=sim.S,V=sim.V,F=sim.F;
 const thw=F.hwOff?Math.min(S.T,72):V.hw,tchw=F.chwOff?66:V.chw;S.thw=thw;S.tchw=tchw;
 const Tm=oa*V.out+(1-oa)*S.T;S.Tm=Tm;
 const k=4,hf=(1-Math.exp(-k*S.xH))/(1-Math.exp(-k)),cf=(1-Math.exp(-k*S.xC))/(1-Math.exp(-k));
 if(flow>0.02){
  const Th=Tm+0.35*hf*(thw-Tm),Tc=Th-0.62*cf*Math.max(0,Th-tchw);
  S.Th+=(Th-S.Th)*Math.min(1,h/20);S.Td+=(Tc-S.Td)*Math.min(1,h/40);
  const dh=Math.min(Math.max(0,thw-Tm),20*hf/Math.max(S.xH,0.03)*flow);S.hwL=thw-dh;
  const dc=Math.min(Math.max(0,Th-tchw),12*cf/Math.max(S.xC,0.03)*flow);S.chL=tchw+dc}
 else{S.Th+=(S.T-S.Th)*h/300;S.Td+=(S.T-S.Td)*h/300;S.hwL+=(Math.max(S.T,Math.min(thw,S.hwL))-S.hwL)*h/60;S.chL+=(tchw-S.chL)*h/60}
 S.hwR=S.xH*S.hwL+(1-S.xH)*thw;S.chR=S.xC*S.chL+(1-S.xC)*tchw;
 const dT=flow*(S.Td-S.T)/1800+(V.out-S.T)/14400+V.load/100*0.0015;
 S.T+=dT*h;S.flowA=flow;S.Tl=(S.Tl==null?S.T:S.Tl+(S.T-S.Tl)*h/(sim.lag||150))}

function ctlDrawMech(sim,dt,el){const S=sim.S,p=sim.p;
 const ph=S.ph,pipe=(id,T,q)=>{at(p+id,"stroke",wcol(T));ph[id]=((ph[id]||0)+dt*q*26)%1200;at(p+id+"F","stroke-dashoffset",(-ph[id]).toFixed(1));at(p+id+"F","opacity",q>0.03?0.85:0)};
 const xH=S.xH,xC=S.xC;
 pipe("hwS1",S.thw,1);pipe("hwS2",S.thw,xH);pipe("hwBy",S.thw,1-xH);pipe("hwC",S.hwL,xH);pipe("hwR",S.hwR,1);
 pipe("chS",S.tchw,1);pipe("chA",S.tchw,xC);pipe("chBy",S.tchw,1-xC);pipe("chC",S.chL,xC);pipe("chR1",S.chL,xC);pipe("chR2",S.chR,1);
 const air=S.flowA>0.02;
 [["a1",S.Tm],["a2",S.Th],["a3",S.Td]].forEach(([id,T])=>{at(p+id,"stroke",acol(T));at(p+id,"opacity",air?Math.min(1,0.35+S.flowA):0)});
 at(p+"diff","stroke",acol(S.Td));at(p+"diff","opacity",air?0.9:0);
 if(air&&dt>0)S.fanAng=((S.fanAng||0)+dt*720*S.flowA)%360;at(p+"fanB","transform",`rotate(${(S.fanAng||0).toFixed(1)} 560 276)`);
 txt(p+"tmTxt",air?`${f0(S.Tm)}°F`:"");txt(p+"thTxt",air?`${f0(S.Th)}°F`:"");txt(p+"tdTxt",air?`${f0(S.Td)}°F`:"no air");
 txt(p+"hwSTxt",`HW supply ${f0(S.thw)}°F`);txt(p+"hwRTxt",`HW return ${f0(S.hwR)}°F`);txt(p+"chSTxt",`CHW supply ${f0(S.tchw)}°F`);txt(p+"chRTxt",`CHW return ${f0(S.chR)}°F`);
 const hk=el?"hvalveE":"hvalve",ck=el?"cvalveE":"cvalve";
 txt(p+hk+"Pct",`${f0(xH*100)}%`);txt(p+ck+"Pct",`${f0(xC*100)}%`);
 const jit=S.chat&&dt>0?(Math.random()-.5)*2:0;
 at(p+hk+"Ind","transform",`translate(${jit.toFixed(1)} ${(-(1-xH)*7).toFixed(1)})`);at(p+ck+"Ind","transform",`translate(0 ${(-xC*7).toFixed(1)})`);
 at(p+"roomBg","fill",acol(S.T));txt(p+"rmTxt",`${S.T.toFixed(1)}°F`);txt(p+"outTxt",`Outdoors ${f0(sim.V.out)}°F`);
 document.querySelectorAll(`#draw-${sim.id} .lbx`).forEach(e=>{const d=S.labels===false?"none":"";if(e.style.display!==d)e.style.display=d})}

/* ---------------- PNEUMATIC ---------------- */
function pnSvg(p){
 return `<rect x="0" y="0" width="800" height="470" fill="#e4e8ea"/><rect x="0" y="200" width="800" height="270" fill="#dde2e5"/>
${mechSvg(p,false)}
<!-- receiver + compressor -->
<g class="part" data-p="receiver" tabindex="0">${zShade(95,160,70,4)}
 <rect x="32" y="148" width="6" height="14" fill="#4a5257"/><rect x="150" y="148" width="6" height="14" fill="#4a5257"/>
 <rect class="hl" x="20" y="98" width="150" height="52" rx="24" fill="url(#zSteelH)" stroke="#5f686d" stroke-width="1.2"/>
 <rect id="${p}water" x="34" y="150" width="122" height="0" fill="#3d7fc0" opacity=".55"/>
 <text class="zt" x="95" y="128" text-anchor="middle" style="font-size:8px">RECEIVER · 125 PSI ASME</text>
 <rect x="147" y="84" width="8" height="14" fill="url(#zBrass)" stroke="#5e400e" stroke-width=".5"/><circle cx="151" cy="81" r="3.5" fill="none" stroke="#b8902e" stroke-width="1.5"/>
 <rect x="88" y="150" width="12" height="12" rx="2" fill="#2a2f33"/><rect x="92" y="148" width="4" height="4" fill="url(#zBrass)"/>
 <circle id="${p}drip" cx="94" cy="168" r="2" fill="#3d7fc0" opacity="0"/>
 <rect x="170" y="110" width="20" height="4" fill="#9aa3a9"/><rect x="188" y="80" width="4" height="34" fill="#9aa3a9"/>
 ${cGauge(p,"gTank",190,64,15,160,"")}
 <text class="valD" id="${p}tankTxt" x="212" y="68" fill="#1d2327" style="font-size:10px"></text>
 <text class="zt lbx" x="95" y="180" text-anchor="middle">RECEIVER + RELIEF + DRAIN</text>
</g>
<g class="part" data-p="aircomp" tabindex="0">
 <rect class="hl" x="28" y="62" width="36" height="36" rx="2" fill="url(#zAlu)" stroke="#5f686d"/>${[0,1,2,3,4].map(i=>`<rect x="26" y="${64+i*6}" width="40" height="2.5" fill="#8f979d"/>`).join("")}
 <g id="${p}fly"><circle cx="46" cy="82" r="13" fill="#2a2f33" stroke="#111"/>${[0,1,2].map(i=>`<path d="M46 82 L${(46+11*Math.cos(i*2.094)).toFixed(1)} ${(82+11*Math.sin(i*2.094)).toFixed(1)}" stroke="#8f979d" stroke-width="2"/>`).join("")}</g>
 <path d="M46 69 L84 79 M46 95 L84 89" stroke="#111" stroke-width="2"/>
 <rect x="74" y="70" width="46" height="28" rx="6" fill="url(#zMotor)" stroke="#14202c"/><circle cx="84" cy="84" r="5" fill="url(#zSteel)"/>${[0,1,2,3].map(i=>`<rect x="${92+i*6}" y="72" width="2" height="24" fill="rgba(0,0,0,.25)"/>`).join("")}
 <text class="zt lbx" x="74" y="56" text-anchor="middle">AIR COMPRESSOR</text>
</g>
<g class="part" data-p="pswitch" tabindex="0">
 <rect x="133" y="94" width="4" height="5" fill="url(#zBrass)"/><rect class="hl" x="124" y="74" width="20" height="21" rx="2" fill="#6b747a" stroke="#2a2f33"/><rect x="127" y="77" width="14" height="6" fill="#2a2f33"/>
 <circle id="${p}pswLed" cx="134" cy="89" r="2.2" fill="#3a3f43"/>
</g>
<!-- dryer, filter, PRV -->
<rect x="170" y="126" width="36" height="5" fill="#8f979d"/><rect x="258" y="126" width="48" height="5" fill="#8f979d"/>
<g class="part" data-p="dryer" tabindex="0">
 <rect class="hl" x="206" y="98" width="52" height="56" rx="3" fill="url(#zCab)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="211" y="124" width="42" height="24" fill="url(#zLouver)"/>
 <rect x="212" y="103" width="40" height="15" rx="1" fill="url(#zLcd)" stroke="#5f686d" stroke-width=".5"/><text class="valD" id="${p}dpTxt" x="232" y="113.5" text-anchor="middle" fill="#1d2327" style="font-size:8px"></text>
 <text class="zt lbx" x="232" y="168" text-anchor="middle">REFRIG. DRYER</text>
</g>
<g class="part" data-p="afilter" tabindex="0">
 <rect x="261" y="114" width="16" height="8" fill="url(#zAlu)" stroke="#5f686d" stroke-width=".6"/><rect class="hl" x="263" y="122" width="12" height="26" rx="4" fill="#dfe8ee" stroke="#6f787e"/><rect x="266" y="125" width="6" height="18" fill="#c9b48a"/>
 <rect x="267" y="148" width="4" height="4" fill="url(#zBrass)"/>
 <text class="zt lbx" x="269" y="162" text-anchor="middle">DIRT</text>
</g>
<g class="part" data-p="ofilter" tabindex="0">
 <rect x="283" y="114" width="16" height="8" fill="url(#zAlu)" stroke="#5f686d" stroke-width=".6"/><rect class="hl" x="285" y="122" width="12" height="26" rx="4" fill="#dfe8ee" stroke="#6f787e"/><rect x="288" y="125" width="6" height="18" fill="#f1ecdc"/>
 <rect id="${p}fwater" x="286" y="146" width="10" height="0" fill="#3d7fc0" opacity=".7"/><rect x="289" y="148" width="4" height="4" fill="url(#zBrass)"/>
 <text class="zt lbx" x="291" y="172" text-anchor="middle">OIL</text>
</g>
<g class="part" data-p="prv" tabindex="0">
 <rect class="hl" x="306" y="118" width="28" height="18" rx="3" fill="url(#zBrass)" stroke="#5e400e"/><path d="M311 118 Q311 100 320 100 Q329 100 329 118 Z" fill="url(#zBrass)" stroke="#5e400e"/><rect x="318" y="92" width="4" height="9" fill="url(#zSteel)"/>
 <text class="zt lbx" x="320" y="150" text-anchor="middle">PRV</text>
 <rect x="358" y="104" width="4" height="20" fill="#9aa3a9"/>
 ${cGauge(p,"gMain",360,90,13,30,"MAIN")}
 <text class="valD" id="${p}mainTxt" x="360" y="117" text-anchor="middle" fill="#1d2327" style="font-size:9px"></text>
</g>
<!-- control air tubing -->
<g id="${p}two">
<path id="${p}tMain2" d="M334 127 H392 V60 H552 V90 H584" stroke="#888" stroke-width="3" fill="none" stroke-linejoin="round"/>
<path id="${p}tBrS" d="M584 108 H540" stroke="#888" stroke-width="2.6" fill="none"/>
<text class="zt lbx" x="440" y="54">MAIN AIR TO M</text><text class="zt lbx" x="546" y="122" style="font-size:8px">B</text>
</g>
<g id="${p}one" opacity="0" pointer-events="none">
<path id="${p}tMain1" d="M334 127 H392 V60 H500" stroke="#888" stroke-width="3" fill="none" stroke-linejoin="round"/>
<path id="${p}tBr1" d="M524 60 H540 V108 H584" stroke="#888" stroke-width="2.6" fill="none" stroke-linejoin="round"/>
<text class="zt lbx" x="410" y="54">MAIN AIR</text>
<g class="part" data-p="restrictor" tabindex="0">
 <rect class="hl" x="500" y="54" width="24" height="12" rx="3" fill="url(#zBrassH)" stroke="#5e400e"/><circle cx="512" cy="60" r="1.6" fill="#111"/>
 <text class="zt lbx" x="512" y="48" text-anchor="middle">RESTRICTOR</text>
</g>
</g>
<path id="${p}tBr2" d="M540 108 V345 H372 V362" stroke="#888" stroke-width="2.6" fill="none" stroke-linejoin="round"/>
<path id="${p}tBr3" d="M480 345 V362" stroke="#888" stroke-width="2.6" fill="none"/>
<text class="zt lbx" x="551" y="226" style="font-size:8px">BRANCH TO VALVES</text>
<rect x="527" y="158" width="13" height="4" fill="#9aa3a9"/>${cGauge(p,"gBr",515,160,12,30,"")}
<text class="valD" id="${p}brTxt" x="515" y="190" text-anchor="middle" fill="#1d2327" style="font-size:10px"></text>
<text class="zt lbx" x="515" y="136" text-anchor="middle">BRANCH</text>
<g class="part" data-p="tstatp" tabindex="0">
 <rect class="hl" x="584" y="74" width="40" height="50" rx="5" fill="url(#zPlastic)" stroke="#8f887a" filter="url(#zShadow)"/>
 ${[0,1,2,3,4].map(i=>`<rect x="590" y="${80+i*4}" width="28" height="1.6" fill="#cfc8b8"/>`).join("")}
 <circle cx="604" cy="108" r="8" fill="url(#zSteel)" stroke="#5f686d"/><path id="${p}tsNeedle" d="M604 108 L604 101" stroke="#c0281c" stroke-width="1.5"/>
 <text class="zt" x="604" y="136" text-anchor="middle" style="font-size:8px">PNEUMATIC</text><text class="zt" x="604" y="145" text-anchor="middle" style="font-size:8px">THERMOSTAT</text>
 <text class="valD" id="${p}tsAct" x="604" y="70" text-anchor="middle" fill="#3b4449" style="font-size:8px">DA</text>
 <text class="valD" id="${p}tsPipe" x="604" y="60" text-anchor="middle" fill="#3b4449" style="font-size:8px"></text>
 <rect id="${p}portM" x="579" y="87.5" width="6" height="5" fill="url(#zBrass)"/><rect x="579" y="105.5" width="6" height="5" fill="url(#zBrass)"/>
 <text id="${p}lblM" x="590" y="92" font-size="6" font-family="sans-serif" font-weight="700" fill="#3b4449">M</text><text x="590" y="110" font-size="6" font-family="sans-serif" font-weight="700" fill="#3b4449">B</text>
</g>
<g id="${p}burn" opacity="0"><path d="M30 96 l14 -16 6 14 16 -18 4 16 18 -12 -2 18 20 -6 -10 14 24 4 -22 10 18 14 -26 0 4 18 -18 -12 -10 18 -6 -18 -20 8 6 -16 -22 -2 18 -10z" fill="#d23a26" stroke="#5a0b07"/><path d="M60 110 l10 -8 6 8 8 -10 4 10" stroke="#111" stroke-width="2" fill="none"/></g>`}

const PMET=[
 ["Receiver tank gauge, psi",S=>`${f0(S.tank)} psi`],
 ["Main air after the PRV, psi",S=>`${S.main.toFixed(1)} psi`],
 ["Branch at the thermostat (test gauge), psi",S=>`${S.br.toFixed(1)} psi`],
 ["Branch at the heating valve actuator, psi",(S,F)=>`${(F.hDia?Math.max(0,S.br-0.6):S.br).toFixed(1)} psi`],
 ["Room at the thermostat (reference thermometer), °F",S=>`${S.T.toFixed(1)}°F`],
 ["Dryer outlet dew point, °F",(S,F)=>`${F.dryer?f0(74):38}°F`],
 ["Compressor run time (last few minutes), %",S=>`${f0(S.duty*100)}%`],
 ["Heating valve stroke, % open to coil",S=>`${f0(S.xH*100)}%`],
 ["Cooling valve stroke, % open to coil",S=>`${f0(S.xC*100)}%`],
 ["Mixed air, °F",S=>`${f0(S.Tm)}°F`],
 ["Supply air, °F",S=>S.flowA>0.02?`${f0(S.Td)}°F`:"no airflow"],
 ["HW coil entering / leaving water, °F",S=>`${f0(S.thw)} / ${f0(S.hwL)}°F`],
 ["CHW coil entering / leaving water, °F",S=>`${f0(S.tchw)} / ${f0(S.chL)}°F`]];

const PLAMP=[["comp","Compressor","g"],["dry","Dryer","g"],["heat","Heating","a"],["cool","Cooling","g"],["both","Heat + cool","a"],["low","Low main air","r"]];
const PNEU={id:"pneu",p:"pn_",lag:45,name:"Pneumatic",svg:pnSvg("pn_"),lamps:PLAMP,txvOnly:[],
 sliders:[
  {k:"sp",l:"Thermostat setpoint",u:"°F",min:55,max:90,step:1,v:72,n:[68,76]},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-20,max:110,step:1,v:30,n:[-20,110],note:"20% outside air is mixed into the return air."},
  {k:"sens",l:"Thermostat sensitivity",u:" psi/°F",min:0.5,max:6,step:0.5,v:2.5,n:[1,4],note:"Too high and the valves swing end to end (hunting). Too low and the room drifts off setpoint (droop)."},
  {k:"prv",l:"PRV (main air) setting",u:" psi",min:5,max:60,step:1,v:20,n:[18,25],note:"Too low and the branch can't reach the cooling valve's 9 to 13 psi range."},
  {k:"load",l:"People, lights, sun",u:"%",min:0,max:100,step:5,v:30,n:[0,100]},
  {k:"hs",l:"Heating valve spring range start",u:" psi",min:1,max:12,step:0.5,v:3,n:[2,4.5],note:"4 psi span: 3 to 7 psi. Raise it past 5 and heating overlaps the cooling valve.",more:1},
  {k:"cs",l:"Cooling valve spring range start",u:" psi",min:4,max:14,step:0.5,v:9,n:[8,10],note:"4 psi span: 9 to 13 psi.",more:1},
  {k:"relief",l:"Tank relief valve setting",u:" psi",min:80,max:250,step:5,v:110,n:[100,115],note:"10 to 25 psi above the 90 psi cut-out, never above the tank's rating.",more:1},
  {k:"hw",l:"Hot water supply",u:"°F",min:100,max:200,step:5,v:180,n:[140,190],more:1},
  {k:"chw",l:"Chilled water supply",u:"°F",min:38,max:65,step:1,v:45,n:[40,48],more:1}],
 faults:[["comp","Compressor won't run"],["psw","Pressure switch contacts welded"],["relief","Tank relief valve stuck shut"],["leakMain","Leak in the main air line"],["drain","Tank auto drain stuck shut"],
  ["dryer","Air dryer failed"],["prv","PRV failed wide open"],["restr","Restrictor plugged (inside the stat on two-pipe)"],["brLeak","Branch line leaking"],["cal","Thermostat out of calibration (reads 4°F high)"],
  ["hDia","Heating valve actuator diaphragm torn"],["cStuck","Cooling valve stuck closed to the coil"],["mixRev","Heating mixing valve piped backward"],["hwOff","Boiler off (no hot water)"],["chwOff","Chiller off (no chilled water)"]],
 hidden:["relief"],
 scenarios:[{l:"Pressure switch welded shut and the tank relief valve stuck",f:["psw","relief"],speed:60},
  {l:"PRV failed open: tank pressure on the thermostat",f:["prv"],speed:60},
  {l:"Hot summer day and the compressor quits",f:["comp"],v:{out:95,load:60},speed:60}],
 startMsg(){return "Control air system running: compressor cycling 70 to 90 psi, PRV at 20 psi, direct-acting thermostat set to 72°F. Tap any part to see what it does."},
 init(){return {t:0,dead:null,auto:true,fan:true,da:true,two:true,labels:true,comp:false,tank:82,main:20,br:6,T:69,xH:0.8,xC:0,water:0,wet:0,duty:0.3,tRupt:false,tOver:0,relOn:false,chat:false,
  Tm:60,Th:90,Td:90,thw:180,tchw:45,hwL:165,hwR:170,chL:45,chR:45,flowA:1,ph:{},ang:0,fanAng:0,logs2:{}}},
 switches:[
  {l:S=>`Compressor: ${S.auto?"auto":"off"}`,on:S=>S.auto,act(sim){const S=sim.S;S.auto=!S.auto;log(sim,S.auto?"Compressor in auto.":"Compressor switched off. The tank will bleed down.",S.auto?"":"w")}},
  {l:S=>`Supply fan: ${S.fan?"on":"off"}`,on:S=>S.fan,act(sim){const S=sim.S;S.fan=!S.fan;log(sim,S.fan?"Supply fan on.":"Supply fan off.")}},
  {l:S=>`Thermostat piping: ${S.two!==false?"two-pipe":"one-pipe"}`,on:S=>S.two===false,act(sim){const S=sim.S;S.two=S.two===false;log(sim,S.two?"Two-pipe thermostat: main air runs to its M port, branch leaves its B port. The restrictor is inside the thermostat.":"One-pipe thermostat: main air feeds the branch through an external restrictor, teed at the thermostat. The thermostat only bleeds air off the branch.")}},
  {l:S=>`Thermostat: ${S.da?"direct acting":"reverse acting"}`,on:S=>!S.da,act(sim){const S=sim.S;S.da=!S.da;log(sim,S.da?"Thermostat set direct acting: branch rises as the room warms.":"Thermostat set reverse acting: branch falls as the room warms. These valves need DA.",S.da?"":"w")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[{id:"drainT",l:"Open the tank drain by hand",show:()=>true,act(sim){const S=sim.S;
   if(S.water>0.08)log(sim,`Drained about ${f0(S.water*30)} gallons of rusty water and oil from the receiver.`,"w");else log(sim,"A short burst of air and a little mist. The tank is nearly dry.");
   S.water=0;S.tank=Math.max(0,S.tank-4)}}],
 resets(S){const r=[],sim=this;
  if(S.tRupt)r.push(["Replace the ruptured thermostat",()=>{S.tRupt=false;S.tOver=0;log(sim,sim.F.prv?"New thermostat installed, but the PRV is still passing tank pressure. It will rupture again.":"New thermostat installed and calibrated.",sim.F.prv?"w":"")}]);
  if(S.wet>=1)r.push(["Blow down the tubing and clean the restrictor",()=>{if(sim.F.dryer){log(sim,"Fix the dryer first or the water comes right back.","w");return}S.wet=0;sim.S.logs2.wet=0;log(sim,"Tubing blown down, restrictor cleaned, filter element replaced.")}]);
  return r},
 reads(S){return [["Tank",`${f0(S.tank)} psi`],["Main",`${S.main.toFixed(1)} psi`],["Branch",`${S.br.toFixed(1)} psi`],["Room",`${S.T.toFixed(1)}°F`],
  ["Supply air",S.flowA>0.02?`${f0(S.Td)}°F`:"fan off"],["Heat valve",`${f0(S.xH*100)}%`],["Cool valve",`${f0(S.xC*100)}%`],["State",this.stText(S)]]},
 stText(S){if(S.dead)return "failed";if(S.main<3)return "no control air";if(S.xH>0.05&&S.xC>0.05)return "heat + cool!";if(S.xH>0.05)return "heating";if(S.xC>0.05)return "cooling";return "deadband"},
 step(dt){const S=this.S;S.t+=dt;let r=dt;while(r>1e-9){const h=Math.min(0.1,r);this.sub(h);r-=h;if(S.dead)return}},
 sub(h){const sim=this,S=this.S,F=this.F,V=this.V;
  // compressor and pressure switch: on at 70, off at 90
  if(S.auto&&!F.comp){if(!S.comp&&S.tank<=70)S.comp=true;
   if(S.comp&&S.tank>=90){if(F.psw){if(!S.logs2.psw){S.logs2.psw=1;log(sim,"Tank is past 90 psi and the compressor is still running: pressure switch contacts welded.","b")}}else S.comp=false}}
  else S.comp=false;
  if(S.tank<88)S.logs2.psw=0;
  if(F.comp&&S.auto&&S.tank<=70&&!S.logs2.cf){S.logs2.cf=1;log(sim,"Tank is under 70 psi and the compressor isn't running.","w")}
  if(S.tank>75)S.logs2.cf=0;
  const vol=1/(1-S.water);
  const fill=S.comp?0.8*clamp((330-S.tank)/240,0,1):0;
  const use=S.tank>0.5?0.22+(S.two===false?0.06:0)+(F.leakMain?0.4:0)+(F.brLeak?0.12:0)+(F.hDia?0.1:0)+(S.tRupt?0.25:0):0;
  S.tank=Math.max(0,S.tank+(fill-use)*vol*h);
  if(!F.relief&&S.tank>V.relief){S.tank=V.relief;if(!S.relOn){S.relOn=true;log(sim,`Tank relief valve popping at ${V.relief} psi.`,"w")}}else if(S.tank<V.relief-8)S.relOn=false;
  if(S.tank>=250){explode(sim,"tank");return}
  S.duty+=((S.comp?1:0)-S.duty)*h/240;
  if(F.leakMain&&S.duty>0.7&&!S.logs2.lk){S.logs2.lk=1;log(sim,`Compressor running ${f0(S.duty*100)}% of the time. It should be under about half.`,"w")}
  if(S.duty<0.5)S.logs2.lk=0;
  // water
  if(S.comp){if(F.drain)S.water=Math.min(0.6,S.water+0.0003*h);if(F.dryer)S.wet=Math.min(1.5,S.wet+0.0012*h)}
  if(!F.drain&&S.water>0)S.water=Math.max(0,S.water-0.02*h);
  if(S.water>0.3&&!S.logs2.wt){S.logs2.wt=1;log(sim,"The receiver is a third full of water: less stored air, so the compressor short cycles.","w")}
  if(S.water<0.1)S.logs2.wt=0;
  if(S.wet>=1&&!S.logs2.wet){S.logs2.wet=1;log(sim,"Wet air from the failed dryer has reached the tubing: the restrictor and thermostat nozzle are partly plugged.","b")}
  // PRV
  const mainT=F.prv?S.tank:Math.min(S.tank*0.97,V.prv);
  S.main+=(mainT-S.main)*Math.min(1,h/0.6);
  if(S.main>35&&!S.tRupt){S.tOver+=h;if(S.tOver>25){S.tRupt=true;log(sim,`Thermostat diaphragm ruptured after ${f0(S.main)} psi on main air. It now bleeds off all the branch air.`,"b")}}
  if(S.main<8&&!S.logs2.lowm){S.logs2.lowm=1;log(sim,"Main air is low. Actuators are going to their spring (normal) positions.","w")}
  if(S.main>15)S.logs2.lowm=0;
  // thermostat (one-pipe, bleed type): about 8 psi at setpoint
  const Ts=(S.Tl==null?S.T:S.Tl)+(F.cal?4:0);S.Ts=Ts;
  let pt=8+(S.da?1:-1)*V.sens*(Ts-V.sp);
  if(S.tRupt||F.restr)pt=0;
  if(F.brLeak)pt-=5;
  if(F.hDia)pt-=4;
  if(S.wet>=1)pt=Math.min(pt,5.5);
  pt=clamp(pt,0,Math.max(0,S.main));
  S.br+=(pt-S.br)*Math.min(1,h/(S.wet>=1?25:S.two===false?3:1.5));
  // actuators: heating NO (open to coil at 0 psi), cooling NC
  let xH=1-clamp(((F.hDia?0:S.br)-V.hs)/4,0,1),xC=clamp((S.br-V.cs)/4,0,1);
  if(F.cStuck)xC=0;
  S.chat=false;
  if(F.mixRev&&xH<0.3){S.chat=true;xH=Math.random()*0.3;if(!S.logs2.ch){S.logs2.ch=1;log(sim,"Banging from the heating valve: water is pushing the plug off its seat near closed. It chatters instead of closing.","w")}}
  S.xH+=(xH-S.xH)*Math.min(1,h/3);S.xC+=(xC-S.xC)*Math.min(1,h/3);
  if(S.xH>0.08&&S.xC>0.08){if(!S.logs2.both){S.logs2.both=1;log(sim,"Heating and cooling valves are both open: they are fighting each other.","w")}}else if(S.xH<0.03||S.xC<0.03)S.logs2.both=0;
  ctlAir(sim,h,0.2,S.fan?1:0);
 },
 draw(dt){const S=this.S,F=this.F,p="pn_";
  ctlDrawMech(this,dt,false);
  setG(p+"gTank",S.tank);setG(p+"gMain",S.main);setG(p+"gBr",S.br);
  txt(p+"tankTxt",`${f0(S.tank)} psi`);txt(p+"mainTxt",`${S.main.toFixed(1)}`);txt(p+"brTxt",`${S.br.toFixed(1)} psi`);
  at(p+"tMain1","stroke",tubeCol(S.main));at(p+"tMain2","stroke",tubeCol(S.main));at(p+"tBr1","stroke",tubeCol(S.br));at(p+"tBrS","stroke",tubeCol(S.br));const two=S.two!==false;at(p+"two","opacity",two?1:0);at(p+"two","pointer-events",two?"auto":"none");at(p+"one","opacity",two?0:1);at(p+"one","pointer-events",two?"none":"auto");at(p+"portM","opacity",two?1:0);at(p+"lblM","opacity",two?1:0);txt(p+"tsPipe",two?"TWO-PIPE (M + B)":"ONE-PIPE (BLEED)");at(p+"tBr2","stroke",tubeCol(S.br));at(p+"tBr3","stroke",tubeCol(S.br));
  if(S.comp&&dt>0)S.ang=(S.ang+dt*900)%360;at(p+"fly","transform",`rotate(${S.ang.toFixed(1)} 46 82)`);
  at(p+"pswLed","fill",S.comp?"#3ad16a":"#3a3f43");
  const wh=S.water*48;at(p+"water","y",(149-wh).toFixed(1));at(p+"water","height",wh.toFixed(1));
  at(p+"drip","opacity",!F.drain&&S.comp&&blink(700)?0.9:0);
  at(p+"fwater","height",(Math.min(1,S.wet)*14).toFixed(1));at(p+"fwater","y",(146-Math.min(1,S.wet)*14).toFixed(1));
  txt(p+"dpTxt",F.dryer?"DP 74°F !":"DP 38°F");
  txt(p+"tsAct",S.da?"DIRECT ACTING":"REVERSE ACTING");
  at(p+"tsNeedle","transform",`rotate(${clamp((this.V.sp-72)*8,-120,120)} 604 108)`);
  txt(p+"spTxt",`Thermostat set ${this.V.sp}°F${F.cal?" (reads 4°F high)":""}`);
 },
 boom(kind){const F=this.F,V=this.V,S=this.S;
  return{t:"Receiver tank ruptured",b:`<p>The air tank split open at about ${f0(S.tank)} psi. A receiver rupture can throw steel and kill anyone nearby.</p><ul>
   ${li(F.psw,"Pressure switch contacts welded: the compressor never stopped at 90 psi.","Pressure switch.")}
   ${li(F.relief||V.relief>=250,F.relief?"Safety relief valve stuck shut.":`Relief valve set to ${V.relief} psi, far above the tank's 125 psi rating.`,"Relief valve.")}</ul>
   <p>Test the relief valve regularly, set it 10 to 25 psi above the cut-out and never above the tank rating, and drain the tank so rust doesn't thin its walls.</p><small>Simplified: the pressure rise is sped up and the rupture point is a round number.</small>`,wreck:1}},
 parts:{
  aircomp:{n:"Air compressor",s:"Makes the control air.",w:"A tank-mounted, oil-type reciprocating compressor, belt-driven by an electric motor.",y:"A pressure switch starts it at 70 psi and stops it at 90 psi. It should run no more than about a third to half of the time; one that runs constantly is feeding a leak.",f:"If it stops, the tank bleeds down, main air drops and every actuator goes to its spring (normal) position: normally open heating valves open, normally closed cooling valves close.",src:["ufgsAir"],faults:["comp","leakMain"]},
  receiver:{n:"Receiver tank, relief valve, drain",s:"Stores the air, protects the tank, dumps the water.",w:"An ASME steel tank rated for at least 125 psi, with a safety relief valve and an automatic drain on the bottom.",y:"The stored air lets the compressor rest. The relief valve is set 10 to 25 psi above the 90 psi cut-out. Compressing air squeezes water out of it, and the drain gets rid of it.",f:"A stuck drain lets water fill the tank: less stored air, short cycling, and water carried downstream. A welded pressure switch plus a stuck relief valve is how tanks rupture.",src:["ufgsAir"],faults:["drain","relief"]},
  pswitch:{n:"Pressure switch",s:"Cycles the compressor.",w:"A diaphragm switch on the tank that opens and closes the motor circuit.",y:"Closes at 70 psi (cut-in), opens at 90 psi (cut-out).",f:"Welded contacts keep the compressor running past cut-out. Only the relief valve stops the pressure then.",src:["ufgsAir"],faults:["psw"]},
  dryer:{n:"Refrigerated air dryer",s:"Takes the water out of the air.",w:"A small refrigeration unit that chills the compressed air to about 35 to 40°F so water condenses and drains out, then rewarms it.",y:"Control air has to be clean, dry and oil-free. Water and oil plug restrictors, thermostat nozzles and actuator diaphragms.",f:"A failed dryer passes wet air. After a while restrictors and thermostats plug and the branch goes sluggish and low.",src:["tp970"],faults:["dryer"]},
  afilter:{n:"Dirt (particulate) filter",s:"Catches rust, scale and dirt first.",w:"A particulate filter with a clear bowl and a drain, right after the dryer. Its element stops solid particles (typically down to about 5 microns).",y:"First of two filters before the PRV. It takes the solids out so they don't load up the finer oil filter after it.",f:"A loaded element drops the pressure going to the PRV. Change it on schedule; drain the bowl.",src:["tp970"],faults:[]},
  ofilter:{n:"Oil (coalescing) filter",s:"Takes oil mist and the last water droplets out.",w:"A coalescing filter after the dirt filter: fine fibers gather oil and water aerosols into drops that run down into the bowl and out the drain.",y:"Second filter, last line of defense before the PRV and the tiny passages in the thermostats and actuators. Control air has to be clean, dry and oil-free.",f:"Water or oil in the bowl means the dryer, the compressor or the drain has a problem. Oil getting past it gums up restrictors and diaphragms.",src:["tp970"],faults:["dryer"]},
  prv:{n:"Pressure reducing valve (PRV)",s:"Drops tank pressure to main air pressure.",w:"A regulator with a gauge on each side.",y:"Single-pressure systems usually run main air around 20 psi. Two-pressure (day/night) systems switch between two main pressures, for example 13 and 18 psi on Honeywell's TP970.",f:"A PRV that fails open puts full tank pressure on thermostats and actuators built for low pressure: diaphragms rupture. Set too low, the branch can't reach the cooling valve's range.",src:["tp970"],faults:["prv"]},
  restrictor:{n:"Restrictor (one-pipe)",s:"Feeds main air into the branch of a one-pipe thermostat.",w:"A tiny orifice (about 0.005 inch) teed into the branch right at a one-pipe (bleed) thermostat. Switch Thermostat piping to one-pipe to see it. A two-pipe thermostat has its restrictor built in.",y:"The thermostat bleeds air out of the branch through a nozzle. The restrictor limits how fast main air refills it, so the branch settles anywhere between 0 and main pressure. One-pipe stats bleed all the time, so they use more air and respond slower than two-pipe (relay) stats.",f:"Plugged: the branch drops to 0 and every actuator goes to its normal position. A branch leak does the same thing more slowly and keeps the compressor busier.",src:["tp970"],faults:["restr","brLeak"]},
  tstatp:{n:"Pneumatic room thermostat",s:"Turns room temperature into branch pressure.",w:"A bimetal element moves a flapper over a nozzle. Two-pipe (most commercial work): main air runs to the M port and the branch leaves the B port; an internal relay and restrictor build the branch. One-pipe: only the branch connects, fed through an external restrictor, and the stat bleeds it. Direct acting (DA): branch rises as the room warms. Reverse acting (RA): branch falls.",y:"DA here, about 8 psi at setpoint, changing 2.5 psi per °F (its sensitivity). Below setpoint the branch drops toward 3 psi and opens the heating valve. Above it, it climbs toward 13 psi and opens the cooling valve. It only ever settles near setpoint (proportional control), never exactly on it.",f:"Out of calibration it controls a few degrees off. Wrong action drives the room away from setpoint. Too much main pressure ruptures its diaphragm.",src:["tp970","ufcSeq"],faults:["cal"]},
  hvalve:{n:"3-way mixing valve (heating)",s:"Two in, one out: blends coil water and bypass water.",w:"Ports: A from the coil, B from the bypass, AB out to the return. A spring-return diaphragm actuator, normally open to the coil, 3 to 7 psi spring range.",y:"As the branch rises from 3 to 7 psi it shifts flow from the coil (A) to the bypass (B). Total flow stays the same, which is why 3-way valves suit constant-speed pumps. Mixing valves sit on the coil's leaving side. Normally open means lost air gives full heat, which protects the coil from freezing.",f:"Piped backward (as a diverting valve), water pushes against the plug and it chatters and slams near closed. A torn diaphragm leaks the branch and leaves the valve at its spring position. Heating 3 to 7 psi and cooling 9 to 13 psi leave a 2 psi deadband; push the heating range up and both valves open at once. Spring range shift under load does the same.",src:["mixdiv","bctx","ufcSeq","seShift"],faults:["hDia","mixRev","hwOff"]},
  cvalve:{n:"3-way diverting valve (cooling)",s:"One in, two out: splits supply water between coil and bypass.",w:"Ports: AB in from the chilled water supply, A to the coil, B to the bypass. Spring-return diaphragm actuator, normally closed to the coil, 9 to 13 psi spring range.",y:"From 9 psi it starts sending water through the coil; at 13 psi all of it goes through the coil. Diverting valves sit on the coil's entering side.",f:"Stuck closed: no cooling, the room drifts up and the branch climbs to its maximum while nothing changes.",src:["mixdiv","bctx","ufcSeq"],faults:["cStuck","chwOff"]},
  hcoil:{n:"Hot water coil",s:"Heats the air.",w:"Copper tubes with aluminum fins in the air stream.",y:"Heat output isn't proportional to flow: the first 10% of flow already gives a third or more of the heat, because the water stays hot and the air takes what it can. That's why heating valves are usually equal-percentage.",f:"No hot water: the valve opens fully and nothing happens.",src:["bctx"],faults:["hwOff"]},
  ccoil:{n:"Chilled water coil",s:"Cools and dries the air.",w:"Copper tubes with aluminum fins, a drain pan below.",y:"With 45°F water and the valve full open, air leaves in the low to mid 50s.",f:"Chiller off: the valve goes full open and the room still drifts up.",src:["bctx"],faults:["chwOff"]},
  sfan:{n:"Supply fan",s:"Moves air across the coils to the zone.",w:"A centrifugal fan.",y:"Heating and cooling only reach the room while it runs.",f:"",src:[],faults:[]},
  zone:{n:"Zone",s:"The room being controlled.",w:"Gains heat from people, lights and sun, loses or gains it through the walls.",y:"The room number here is the actual temperature, measured with a reference thermometer. Compare it with what the thermostat thinks.",f:"",src:[],faults:[]}}
};
PNEU.lampOn=S=>({comp:S.comp,dry:!PNEU.F.dryer,heat:S.xH>0.05,cool:S.xC>0.05,both:S.xH>0.08&&S.xC>0.08,low:S.main<10});

/* ---------------- DDC ---------------- */
function ddSvg(p){
 const tl=["AI1","AI2","AI3","DI1","DI2","DI3"],bl=["AO1","AO2","AO3","DO1","24V","COM"];
 const term=(y,labs,ly)=>`<rect x="40" y="${y}" width="152" height="11" rx="1" fill="#1f7a3a" stroke="#0d3a1a"/>`+labs.map((l,i)=>`<circle cx="${52+i*25.6}" cy="${y+5.5}" r="3" fill="url(#zScrew)" stroke="#2a2f33" stroke-width=".5"/><text x="${52+i*25.6}" y="${ly}" text-anchor="middle" font-size="6.5" font-family="sans-serif" fill="#1d2327">${l}</text>`).join("");
 const W=(id,d,c)=>`<path id="${p}${id}" d="${d}" stroke="${c}" stroke-width="1.3" fill="none" stroke-linejoin="round" opacity=".9"/>`;
 return `<rect x="0" y="0" width="800" height="470" fill="#e4e8ea"/><rect x="0" y="200" width="800" height="270" fill="#dde2e5"/>
${mechSvg(p,true)}
<!-- wiring -->
${W("wAI1","M52 46 V8 H603 V76","#c0281c")}${W("wAI2","M77 200 V206 H500 V222","#c0281c")}${W("wAI3","M103 200 V212 H188 V262","#c0281c")}
${W("wDI1","M129 200 V209 H566 V214","#6a3fa0")}${W("wDI2","M154 200 V215 H368 V220","#6a3fa0")}${W("wDI3","M180 200 V218 H254 V220","#6a3fa0")}
${W("wAO1","M52 200 V340 H372 V358","#1f56b0")}${W("wAO2","M77 200 V344 H480 V358","#1f56b0")}${W("wAO3","M103 200 V204 H214 V214","#1f56b0")}
${W("wDO1","M129 200 V203 H556 V212","#111")}
<!-- controller panel -->
<g class="part" data-p="ctrl" tabindex="0">
 <rect class="hl" x="18" y="14" width="232" height="186" rx="4" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="24" y="20" width="220" height="174" rx="2" fill="url(#zCabIn)" stroke="#9aa3a9"/>
 <rect x="34" y="40" width="164" height="128" rx="4" fill="url(#zPlasticDk)" stroke="#000"/>
 ${term(46,tl,40)}${term(150,bl,172)}
 <text x="116" y="78" text-anchor="middle" font-size="9" font-family="sans-serif" font-weight="700" fill="#e3e8ea">AHU-1 CONTROLLER</text>
 <rect x="60" y="86" width="112" height="22" rx="2" fill="url(#zLcd)"/><text class="valD" id="${p}lcd" x="116" y="101" text-anchor="middle" fill="#1d2327" style="font-size:9px"></text>
 <circle id="${p}ledP" cx="62" cy="126" r="3" fill="#3ad16a"/><circle id="${p}ledC" cx="92" cy="126" r="3" fill="#a5761a"/><circle id="${p}ledF" cx="122" cy="126" r="3" fill="#5a1a1a"/>
 <text x="62" y="140" text-anchor="middle" font-size="6" font-family="sans-serif" fill="#cfd5d9">PWR</text><text x="92" y="140" text-anchor="middle" font-size="6" font-family="sans-serif" fill="#cfd5d9">COMM</text><text x="122" y="140" text-anchor="middle" font-size="6" font-family="sans-serif" fill="#cfd5d9">ALARM</text>
 <text class="zt lbx" x="30" y="32">DDC CONTROL PANEL</text>
</g>
<g class="part" data-p="xfmr" tabindex="0">
 <rect class="hl" x="205" y="62" width="36" height="52" rx="2" fill="url(#zLam)" stroke="#2a2f33"/><rect x="211" y="70" width="24" height="36" rx="3" fill="url(#zWinding)"/><rect x="214" y="118" width="18" height="10" rx="2" fill="#2a2f33"/><rect id="${p}fuse" x="217" y="120" width="12" height="6" rx="2" fill="#e9ecee"/>
 <text class="zt" x="223" y="142" text-anchor="middle" style="font-size:8px">24 VAC</text>
</g>
<!-- BAS screen -->
<g class="part" data-p="bas" tabindex="0">
 <rect class="hl" x="262" y="14" width="288" height="182" rx="6" fill="#2a2f33" stroke="#111" filter="url(#zShadow)"/><rect x="270" y="22" width="272" height="162" rx="2" fill="#f7f8f6"/>
 <text x="278" y="34" font-size="8.5" font-family="sans-serif" font-weight="700" fill="#1d2327">AHU-1 · ZONE TREND (30 MIN)</text>
 <text id="${p}basSt" x="534" y="34" text-anchor="end" font-size="8" font-family="sans-serif" font-weight="700" fill="#1e9a4a">ONLINE</text>
 ${[0,1,2,3,4].map(i=>`<line x1="300" x2="528" y1="${42+i*26.5}" y2="${42+i*26.5}" stroke="#dfe3e5"/><text x="296" y="${45+i*26.5}" text-anchor="end" font-size="6" font-family="sans-serif" fill="#5b666d">${100-i*15}°</text><text x="531" y="${45+i*26.5}" font-size="6" font-family="sans-serif" fill="#5b666d">${100-i*25}%</text>`).join("")}
 <polyline id="${p}tH" fill="none" stroke="#d23a26" stroke-width="1.2" opacity=".75"/><polyline id="${p}tC" fill="none" stroke="#2f6fd6" stroke-width="1.2" opacity=".75"/>
 <polyline id="${p}tSa" fill="none" stroke="#8a8f94" stroke-width="1"/>
 <polyline id="${p}tSp" fill="none" stroke="#1d2327" stroke-width="1" stroke-dasharray="3 2"/><polyline id="${p}tRm" fill="none" stroke="#e07a1f" stroke-width="2"/>
 <text x="300" y="160" font-size="6.5" font-family="sans-serif" fill="#e07a1f">■ room</text><text x="330" y="160" font-size="6.5" font-family="sans-serif" fill="#1d2327">- - setpoint</text><text x="372" y="160" font-size="6.5" font-family="sans-serif" fill="#8a8f94">■ supply air</text><text x="414" y="160" font-size="6.5" font-family="sans-serif" fill="#d23a26">■ heat %</text><text x="448" y="160" font-size="6.5" font-family="sans-serif" fill="#2f6fd6">■ cool %</text>
 <text class="valD" id="${p}pts1" x="278" y="172" fill="#1d2327" style="font-size:8px"></text><text class="valD" id="${p}pts2" x="278" y="181" fill="#1d2327" style="font-size:8px"></text>
 <text id="${p}off" x="418" y="100" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="700" fill="#c0281c" opacity="0">CONTROLLER OFFLINE</text>
</g>
<!-- room sensor -->
<g class="part" data-p="rsens" tabindex="0">
 <rect class="hl" x="586" y="76" width="34" height="46" rx="4" fill="url(#zPlastic)" stroke="#8f887a" filter="url(#zShadow)"/><rect x="590" y="82" width="26" height="13" rx="1" fill="url(#zLcd)"/>
 <text class="valD" id="${p}rsTxt" x="603" y="91.5" text-anchor="middle" fill="#1d2327" style="font-size:8px"></text>${[0,1,2].map(i=>`<rect x="592" y="${101+i*5}" width="22" height="1.6" fill="#cfc8b8"/>`).join("")}
 <text class="zt" x="603" y="134" text-anchor="middle" style="font-size:8px">10K SENSOR</text>
</g>
<!-- duct devices -->
<g class="part" data-p="oadmp" tabindex="0">
 <rect class="hl" x="200" y="214" width="28" height="18" rx="2" fill="url(#zPlastic)" stroke="#8f887a"/><circle cx="214" cy="223" r="3" fill="#3b4449"/>
 <rect x="208" y="238" width="12" height="76" fill="#b9c1c6" stroke="#6f787e"/>
 ${[0,1,2,3,4,5].map(i=>`<rect id="${p}bl${i}" x="209" y="${241+i*12.4}" width="10" height="3" fill="#5f686d"/>`).join("")}
 <text class="zt lbx" x="196" y="300" text-anchor="end">OA</text><text class="zt lbx" x="196" y="310" text-anchor="end">DAMPER</text>
 <text class="valD" id="${p}oaTxt" x="214" y="330" text-anchor="middle" fill="#1d2327" style="font-size:9px"></text>
</g>
<g class="part" data-p="oat" tabindex="0"><rect class="hl" x="180" y="262" width="16" height="10" rx="2" fill="url(#zPlastic)" stroke="#8f887a"/><text class="zt lbx" x="188" y="282" text-anchor="middle" style="font-size:7px">OAT</text></g>
<g class="part" data-p="dfilter" tabindex="0"><rect class="hl" x="246" y="220" width="16" height="12" rx="2" fill="#6b747a" stroke="#2a2f33"/><path d="M250 232 V240 M258 232 V240" stroke="#555" stroke-width="1.2"/><circle id="${p}dpLed" cx="254" cy="226" r="2" fill="#3a3f43"/></g>
<g class="part" data-p="fstat" tabindex="0"><rect class="hl" x="358" y="220" width="20" height="13" rx="2" fill="#6b747a" stroke="#2a2f33"/><circle id="${p}fsLed" cx="368" cy="226.5" r="2.2" fill="#3a3f43"/>
 <path d="M362 240 v10 h4 v10 h-4 v10 h4 v10 h-4 v10 h4 v10 h-4 v12" stroke="#8a5a2a" stroke-width="1.2" fill="none"/></g>
<g class="part" data-p="sat" tabindex="0"><rect class="hl" x="492" y="222" width="16" height="12" rx="2" fill="url(#zPlastic)" stroke="#8f887a"/><rect x="498" y="234" width="4" height="22" fill="url(#zSteel)"/></g>
<g class="part" data-p="sfanE" tabindex="0"><rect class="hl" x="546" y="212" width="28" height="20" rx="3" fill="url(#zMotor)" stroke="#14202c"/><circle cx="566" cy="216" r="3.4" fill="none" stroke="#e9c34a" stroke-width="1.6"/><circle id="${p}csLed" cx="553" cy="222" r="2" fill="#3a3f43"/></g>
<g id="${p}burn" opacity="0"></g>`}

const DMET=[
 ["Room sensor at AI1, wires lifted, Ω",(S,F)=>F.rsOpen?"OL (open)":F.rsShort?"0.4 Ω":fmtR(thR(S.T+(F.rsDrift?5:0)))],
 ["Room at the sensor (reference thermometer), °F",S=>`${S.T.toFixed(1)}°F`],
 ["AO1 heating valve signal, V DC",S=>`${S.aoH.toFixed(2)} V DC`],
 ["AO2 cooling valve signal, V DC",S=>`${S.aoC.toFixed(2)} V DC`],
 ["24 VAC at the heating valve actuator",(S,F)=>F.pwr24?"0.0 V AC":"24.6 V AC"],
 ["Heating valve feedback, V DC",(S,F)=>F.pwr24?"0.00 V DC":`${(2+8*S.xH).toFixed(2)} V DC`],
 ["Cooling valve feedback, V DC",(S,F)=>F.pwr24?"0.00 V DC":`${(2+8*S.xC).toFixed(2)} V DC`],
 ["Supply fan motor current, A",S=>`${S.amps.toFixed(1)} A`],
 ["DI1 fan status (current switch) contacts",S=>S.status?"closed (fan proven)":"open"],
 ["DI2 freezestat contacts",(S,F)=>F.fJump?"closed (jumpered)":S.frz?"open (tripped)":"closed"],
 ["Filter pressure drop, in. w.c.",(S,F)=>`${(S.flowA*(F.filter?1.25:0.45)).toFixed(2)} in. w.c.`],
 ["Air leaving the heating coil (probe), °F",S=>S.flowA>0.02?`${S.Th.toFixed(1)}°F`:"no airflow"],
 ["Outside air damper position, %",S=>`${f0(S.xO*100)}%`],
 ["HW coil entering / leaving water, °F",S=>`${f0(S.thw)} / ${f0(S.hwL)}°F`],
 ["CHW coil entering / leaving water, °F",S=>`${f0(S.tchw)} / ${f0(S.chL)}°F`]];

const DLAMP=[["occ","Occupied","g"],["fan","Fan proven","g"],["heat","Heating","a"],["cool","Cooling","g"],["ovr","Override","a"],["alm","Alarm","r"]];
const OVL=["auto","hand 0%","hand 100%"];
const DDC={id:"ddc",p:"dd_",name:"DDC",svg:ddSvg("dd_"),lamps:DLAMP,txvOnly:[],
 sliders:[
  {k:"sp",l:"Room setpoint",u:"°F",min:55,max:90,step:1,v:72,n:[68,76]},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-20,max:110,step:1,v:30,n:[-20,110]},
  {k:"pb",l:"Proportional band",u:"°F",min:0.5,max:20,step:0.5,v:6,n:[2,10],note:"How far off setpoint gives 100% output. Narrow = aggressive (can hunt). Wide = lazy."},
  {k:"ti",l:"Integral time (0 = off)",u:" min",min:0,max:60,step:1,v:15,n:[3,30],note:"Integral slowly removes the offset that proportional alone leaves. Too short and it overshoots and hunts.",bad:V=>V.ti>0&&(V.ti<3||V.ti>30)},
  {k:"oamin",l:"Outside air minimum",u:"%",min:0,max:100,step:5,v:20,n:[10,30],note:"High outside air on a bitter day is how coils freeze."},
  {k:"load",l:"People, lights, sun",u:"%",min:0,max:100,step:5,v:30,n:[0,100]},
  {k:"stroke",l:"Actuator stroke time",u:" s",min:10,max:240,step:5,v:90,n:[60,150],more:1},
  {k:"fset",l:"Freezestat setting",u:"°F",min:20,max:50,step:1,v:38,n:[35,40],note:"Don't lower it to stop nuisance trips.",more:1},
  {k:"hw",l:"Hot water supply",u:"°F",min:100,max:200,step:5,v:180,n:[140,190],more:1},
  {k:"chw",l:"Chilled water supply",u:"°F",min:38,max:65,step:1,v:45,n:[40,48],more:1}],
 faults:[["rsOpen","Room sensor wire open"],["rsShort","Room sensor wires shorted"],["rsDrift","Room sensor in the sun (reads 5°F high)"],["ao010","Heating actuator set for 0-10 V (output is 2-10 V)"],
  ["hHand","Heating valve left in hand at the controller's local switch"],["hStuck","Heating valve stem seized"],["pwr24","24 VAC fuse blown (actuators lose power)"],["belt","Supply fan belt broken"],
  ["fanStat","Fan current switch failed open"],["filter","Filter loaded"],["oaStuck","Outside air damper linkage slipped (stuck open)"],["comm","Controller offline from the BAS network"],
  ["hwOff","Boiler off (no hot water)"],["chwOff","Chiller off (no chilled water)"],["fJump","Freezestat jumpered out"]],
 hidden:["fJump"],
 scenarios:[{l:"Bitter cold, heating valve seized shut, freezestat jumpered out",f:["hStuck","fJump"],v:{out:-15,oamin:40},s:{xH:0},speed:60},
  {l:"Tuned too tight: 1°F band, 1 minute integral, slow actuator",f:[],v:{pb:1,ti:1,stroke:150},speed:60}],
 startMsg(){return "AHU-1 occupied. The controller runs a PI loop from the room sensor to the heating and cooling valves (2 to 10 V). Watch the trend on the BAS screen."},
 init(){return {t:0,dead:null,occ:true,hOv:0,cOv:0,labels:true,T:68,rs:68,I:0,u:0,hc:0,cc:0,aoH:2,aoC:2,xH:0,xC:0,xO:0.2,fanCmd:true,fanRun:true,status:true,fanAlm:false,fpt:0,flowA:1,amps:3.8,
  frz:false,ice:0,night:null,spE:72,Tm:60,Th:60,Td:60,thw:180,tchw:45,hwL:170,hwR:175,chL:45,chR:45,trend:[],tr:10,ph:{},fanAng:0,logs2:{}}},
 switches:[
  {l:S=>`Schedule: ${S.occ?"occupied":"unoccupied"}`,on:S=>S.occ,act(sim){const S=sim.S;S.occ=!S.occ;log(sim,S.occ?"Occupied: fan on, outside air to minimum, setpoint "+sim.V.sp+"°F.":"Unoccupied: fan off unless the room falls below 60°F or rises above 85°F (night cycle).")}},
  {l:S=>`Heating valve point: ${OVL[S.hOv]}`,on:S=>S.hOv>0,act(sim){const S=sim.S;if(sim.F.comm){log(sim,"The BAS can't reach the controller. Override not sent.","w");return}S.hOv=(S.hOv+1)%3;log(sim,S.hOv?`Operator override: heating valve ${OVL[S.hOv]}. Remember to release it.`:"Heating valve point released to auto.",S.hOv?"w":"")}},
  {l:S=>`Cooling valve point: ${OVL[S.cOv]}`,on:S=>S.cOv>0,act(sim){const S=sim.S;if(sim.F.comm){log(sim,"The BAS can't reach the controller. Override not sent.","w");return}S.cOv=(S.cOv+1)%3;log(sim,S.cOv?`Operator override: cooling valve ${OVL[S.cOv]}. Remember to release it.`:"Cooling valve point released to auto.",S.cOv?"w":"")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[],
 resets(S){const r=[],sim=this;
  if(S.frz)r.push(["Reset the freezestat",()=>{if(sim.S.Th<sim.V.fset+3&&sim.S.flowA>0.02){log(sim,"Still too cold at the coil.","w");return}S.frz=false;log(sim,"Freezestat reset by hand. Find out why the air got that cold.","w")}]);
  if(S.fanAlm)r.push(["Reset the fan failure alarm",()=>{S.fanAlm=false;S.fpt=0;log(sim,"Fan failure alarm reset. The controller will try the fan again.")}]);
  return r},
 reads(S){return [["Room (BAS)",this.rsTxt(S)],["Supply air",S.flowA>0.02?`${f0(S.Td)}°F`:"fan off"],["Heat cmd / valve",`${f0(S.hc)} / ${f0(S.xH*100)}%`],["Cool cmd / valve",`${f0(S.cc)} / ${f0(S.xC*100)}%`],
  ["Fan",S.fanCmd?(S.status?"on, proven":"on, no status"):"off"],["OA damper",`${f0(S.xO*100)}%`],["State",this.stText(S)]]},
 rsTxt(S){return S.rs<-30?"−40°F (open)":S.rs>200?"250°F (short)":`${S.rs.toFixed(1)}°F`},
 stText(S){if(S.dead)return "failed";if(S.frz)return "freezestat trip";if(S.fanAlm)return "fan failure";if(!S.fanCmd)return S.occ?"off":"unoccupied";if(S.night)return "night cycle "+S.night;
  if(S.xH>0.05&&S.xC>0.05)return "heat + cool!";if(S.hc>1)return "heating";if(S.cc>1)return "cooling";return "satisfied"},
 step(dt){const S=this.S;S.t+=dt;let r=dt;while(r>1e-9){const h=Math.min(0.1,r);this.sub(h);r-=h;if(S.dead)return}},
 sub(h){const sim=this,S=this.S,F=this.F,V=this.V;
  const rs=F.rsOpen?-40:F.rsShort?250:(S.Tl==null?S.T:S.Tl)+(F.rsDrift?5:0);S.rs=rs;
  if(F.rsOpen&&!S.logs2.ro){S.logs2.ro=1;log(sim,"Room sensor reads −40°F: out of range (open circuit).","b")}if(!F.rsOpen)S.logs2.ro=0;
  if(F.rsShort&&!S.logs2.rsh){S.logs2.rsh=1;log(sim,"Room sensor reads 250°F: out of range (shorted).","b")}if(!F.rsShort)S.logs2.rsh=0;
  // schedule and night cycle
  if(S.occ)S.night=null;else{if(!S.night){if(rs<60)S.night="heat";else if(rs>85)S.night="cool";if(S.night)log(sim,`Night cycle: ${S.night==="heat"?"room under 60°F, heating":"room over 85°F, cooling"}.`)}
   else if((S.night==="heat"&&rs>=64)||(S.night==="cool"&&rs<=81)){S.night=null;log(sim,"Night cycle satisfied. Fan off.")}}
  const sp=S.occ?V.sp:S.night==="heat"?64:81;S.spE=sp;
  S.fanCmd=(S.occ||!!S.night)&&!S.frz&&!S.fanAlm;
  const run=S.fanCmd;
  S.amps=run?(F.belt?1.2:F.filter?3.3:3.8):0;
  S.status=S.amps>2&&!F.fanStat;
  if(run&&!S.status){S.fpt+=h;if(S.fpt>30&&!S.fanAlm){S.fanAlm=true;log(sim,"Supply fan failure: commanded on but no status for 30 seconds. The controller shut the fan down and alarmed.","b")}}else S.fpt=0;
  const air=run&&!F.belt?(F.filter?0.65:1):0;
  S.flowA+=(air-S.flowA)*Math.min(1,h/6);if(S.flowA<0.01)S.flowA=0;
  if(F.filter&&run&&!S.logs2.fl){S.logs2.fl=1;log(sim,"Filter pressure switch closed: dirty filter alarm.","w")}if(!F.filter)S.logs2.fl=0;
  // PI loop: negative output is heating, positive is cooling
  const e=rs-sp;
  if(run&&!S.frz){const kp=100/V.pb;
   if(V.ti>0){const dI=kp*e*h/(V.ti*60),un=kp*e+S.I+dI;if(Math.abs(un)<100||Math.sign(dI)!==Math.sign(S.I))S.I=clamp(S.I+dI,-100,100)}else S.I=0;
   S.u=clamp(kp*e+S.I,-100,100)}else{S.u=0;S.I=0}
  let hc=clamp(-S.u,0,100),cc=clamp(S.u,0,100);
  if(S.frz){hc=100;cc=0}
  if(S.hOv)hc=S.hOv===1?0:100;if(S.cOv)cc=S.cOv===1?0:100;
  S.hc=hc;S.cc=cc;S.aoH=2+0.08*hc;S.aoC=2+0.08*cc;
  // actuators: 2-10 V, about 90 s stroke, spring return (heating open, cooling closed, damper closed)
  const mv=(x,t,sec)=>x+clamp(t-x,-h/sec,h/sec);
  if(F.pwr24){S.xH=mv(S.xH,1,20);S.xC=mv(S.xC,0,20);S.xO=F.oaStuck?1:mv(S.xO,0,20)}
  else{let tH=F.hHand?1:F.ao010?S.aoH/10:(S.aoH-2)/8;if(!F.hStuck)S.xH=mv(S.xH,tH,V.stroke);
   S.xC=mv(S.xC,(S.aoC-2)/8,V.stroke);S.xO=F.oaStuck?1:mv(S.xO,run&&S.occ&&!S.frz?V.oamin/100:0,V.stroke)}
  if(F.oaStuck)S.xO=1;
  // freezestat: trips on air leaving the heating coil
  if(!S.frz&&S.flowA>0.1&&S.Th<V.fset){if(F.fJump){if(!S.logs2.fj){S.logs2.fj=1;log(sim,`Air off the heating coil is ${S.Th.toFixed(0)}°F and nothing stops the fan.`,"b")}}
   else{S.frz=true;log(sim,`Freezestat tripped: air leaving the heating coil at ${S.Th.toFixed(1)}°F. Fan off, outside air closed, heating valve full open. Manual reset.`,"b")}}
  if(S.Th>V.fset+4)S.logs2.fj=0;
  if(S.flowA>0.1&&S.Th<30&&(S.xH<0.15||F.hwOff))S.ice+=h/120;else S.ice=Math.max(0,S.ice-h/400);
  if(S.ice>=1){explode(sim,"freeze");return}
  ctlAir(sim,h,S.xO,S.flowA);
  if(S.xH>0.08&&S.xC>0.08&&run){if(!S.logs2.both){S.logs2.both=1;log(sim,"Heating and cooling valves are both open.","w")}}else S.logs2.both=0;
  if(!F.comm){S.tr+=h;if(S.tr>=10){S.tr=0;S.trend.push([rs,sp,S.hc,S.cc,S.flowA>0.02?S.Td:null]);if(S.trend.length>180)S.trend.shift()}}
 },
 draw(dt){const S=this.S,F=this.F,V=this.V,p="dd_";
  ctlDrawMech(this,dt,true);
  txt(p+"spTxt",`Setpoint ${S.spE}°F`);
  txt(p+"rsTxt",S.rs<-30?"-40.0":S.rs>200?"250.0":S.rs.toFixed(1));
  txt(p+"lcd",S.dead?"":`RM ${S.rs<-30?"-40":S.rs>200?"250":S.rs.toFixed(1)} SP ${S.spE}`);
  at(p+"ledP","fill",S.dead?"#3a3f43":"#3ad16a");at(p+"ledC","fill",!F.comm&&blink(500)?"#ffb43a":"#5a4a1a");
  const alm=S.frz||S.fanAlm||F.rsOpen||F.rsShort||(F.filter&&S.fanCmd);at(p+"ledF","fill",alm&&blink(400)?"#ff3a2a":"#5a1a1a");
  at(p+"fuse","fill",F.pwr24?"#6a2a1a":"#e9ecee");
  ["hvalveE","cvalveE"].forEach(k=>at(p+k+"Led","fill",F.pwr24?"#2f3a33":"#3ad16a"));
  at(p+"fsLed","fill",S.frz?"#ff3a2a":"#3a3f43");at(p+"dpLed","fill",F.filter&&S.fanCmd?"#ffb43a":"#3a3f43");at(p+"csLed","fill",S.status?"#3ad16a":"#3a3f43");
  for(let i=0;i<6;i++){const bh=11-9*S.xO;at(p+"bl"+i,"height",bh.toFixed(1));at(p+"bl"+i,"y",(240+i*12.4+(11-bh)/2).toFixed(1))}
  txt(p+"oaTxt",`OA ${f0(S.xO*100)}%`);
  // trend
  const X=i=>300+i*(228/179),YT=T=>148-(clamp(T,40,100)-40)/60*106,YP=v=>148-v/100*106;
  const line=(j,f)=>S.trend.map((r,i)=>r[j]==null?null:`${X(i+180-S.trend.length).toFixed(1)},${f(r[j]).toFixed(1)}`).filter(Boolean).join(" ");
  if(S.trend.length!==S._tl||S._tc!==S.trend[S.trend.length-1]){S._tl=S.trend.length;S._tc=S.trend[S.trend.length-1];
   at(p+"tRm","points",line(0,YT));at(p+"tSp","points",line(1,YT));at(p+"tH","points",line(2,YP));at(p+"tC","points",line(3,YP));at(p+"tSa","points",line(4,YT))}
  at(p+"off","opacity",F.comm?1:0);txt(p+"basSt",F.comm?"OFFLINE":"ONLINE");at(p+"basSt","fill",F.comm?"#c0281c":"#1e9a4a");
  if(!F.comm){txt(p+"pts1",`RM ${this.rsTxt(S)}  SP ${S.spE}°F  SAT ${S.flowA>0.02?f0(S.Td)+"°F":"--"}  OAT ${f0(V.out)}°F`);
   txt(p+"pts2",`HTG ${f0(S.hc)}%${S.hOv?" OVR":""}  CLG ${f0(S.cc)}%${S.cOv?" OVR":""}  FAN ${S.fanCmd?(S.status?"ON":"NO STATUS"):"OFF"}${S.frz?"  FREEZE":""}${S.fanAlm?"  FAN FAIL":""}`)}
 },
 boom(kind){const F=this.F,V=this.V,S=this.S;
  return{t:"Heating coil froze and split",b:`<p>Air at ${f0(S.Th)}°F kept blowing across a coil with no hot water moving through it. The water in the tubes froze, expanded and split them. When it thaws, the coil floods the air handler.</p><ul>
   ${li(F.fJump,"Freezestat jumpered out: nothing stopped the fan or closed the outside air.","Freezestat.")}
   ${li(F.hStuck||F.hwOff||F.ao010===false&&S.xH<0.15,F.hStuck?"Heating valve seized shut.":F.hwOff?"No hot water from the boiler.":"Heating valve nearly closed.","Heating valve.")}
   ${li(V.oamin>30||F.oaStuck,F.oaStuck?"Outside air damper stuck open.":`Outside air minimum at ${V.oamin}%.`,"Outside air amount.")}</ul>
   <p>Never jumper a freezestat. When it trips, find out why: too much outside air, a stuck valve, no hot water, or a failed actuator.</p><small>Simplified: freezing is sped up.</small>`,wreck:0}},
 parts:{
  ctrl:{n:"DDC controller",s:"Reads inputs, runs the program, drives outputs.",w:"A programmable controller. Analog inputs (AI) read sensors such as 10K thermistors. Digital inputs (DI) read contacts such as a current switch or freezestat. Analog outputs (AO) send 2 to 10 V (or 0 to 10 V, or 4 to 20 mA) to actuators. Digital outputs (DO) switch relays such as the fan starter.",y:"Every second it reads the room sensor, runs a PI loop against setpoint and sequences one output from heating through cooling. Its program also handles fan proving, the freezestat and alarms.",f:"Offline from the network it keeps running its program; the BAS screen just goes stale. Points left in override are one of the most common 'mystery' problems.",src:["belimo"],faults:["comm"]},
  xfmr:{n:"24 VAC transformer",s:"Powers the actuators.",w:"A Class 2 control transformer, 120 V to 24 VAC, with a fuse.",y:"Spring-return actuators wind their spring while powered. Lose 24 V and each one springs to its fail position.",f:"Blown fuse: heating valve springs open, cooling valve and outside air damper spring closed. The BAS still shows its commands, but the feedback doesn't follow.",src:["belimo"],faults:["pwr24"]},
  bas:{n:"BAS screen and trend",s:"Where you see the points and their history.",w:"The building automation system's graphic and trend for this unit: room, setpoint, supply air and valve outputs over the last 30 minutes.",y:"A steady sawtooth means the loop is hunting: widen the proportional band or lengthen the integral time. A flat line far from setpoint with a valve at 100% means the equipment can't keep up, or a sensor is lying. OVR marks an operator override.",f:"OFFLINE means the trend has stopped, not that the unit has.",src:[],faults:["comm"]},
  rsens:{n:"Room temperature sensor",s:"A 10K thermistor on the wall.",w:"A 10K Type II thermistor: 10,000 Ω at 77°F, and the resistance falls as the temperature rises (about 32,650 Ω at 32°F).",y:"Lift the wires and read ohms, then compare with a resistance chart and a reference thermometer.",f:"An open wire looks like infinite resistance and reads very cold (−40°F here), so the loop calls for full heat. A short reads very hot and calls for full cooling. A sensor in the sun or over a lamp reads high and the room runs cold.",src:["bapi"],faults:["rsOpen","rsShort","rsDrift"]},
  sat:{n:"Supply air sensor",s:"Reads the air leaving the unit.",w:"A duct probe thermistor after the coils.",y:"Here it's for monitoring and the trend. Many units also limit supply air temperature or reset it from the room.",f:"",src:["bapi"],faults:[]},
  oat:{n:"Outdoor air sensor",s:"Reads outside temperature.",w:"A thermistor in a shaded housing.",y:"Shown on the BAS for diagnosis.",f:"",src:["bapi"],faults:[]},
  oadmp:{n:"Outside air damper",s:"Lets in fresh air.",w:"Blades on a spring-return 24 VAC actuator with a 2 to 10 V signal.",y:"Opens to its minimum position when the unit is occupied and the fan is proven. Closes when the fan is off, on a freezestat trip, or when power is lost.",f:"A slipped linkage leaves it wide open: lots of cold air on the coil in winter.",src:["fstat"],faults:["oaStuck"]},
  dfilter:{n:"Filter and pressure switch",s:"Cleans the air; the switch says when it's dirty.",w:"Pleated filters with a differential pressure switch across them.",y:"Clean filters here drop about 0.45 in. w.c. The switch closes at 1.0 in. w.c. and alarms.",f:"Loaded filters cut airflow and the fan's current.",src:[],faults:["filter"]},
  fstat:{n:"Freezestat (low limit)",s:"Protects the coils from freezing.",w:"A capillary strung across the face of the coil. It trips if any foot of it senses below setpoint, usually around 35 to 40°F.",y:"On a trip: fan off, outside air closed, heating valve full open, alarm. Manual reset.",f:"Never jumper it. Don't lower the setting to stop nuisance trips; find out why the air is that cold. Test it once a year before cold weather.",src:["fstat"],faults:["fJump"]},
  hvalveE:{n:"3-way mixing valve, electronic (heating)",s:"Same mixing valve, 24 VAC actuator.",w:"Ports: A from the coil, B from the bypass, AB out to the return. A spring-return actuator: 24 VAC power, 2 to 10 V control, 2 to 10 V feedback, about 90 seconds to stroke, springs open to the coil on power loss.",y:"AO1 sends 2 V for 0% (all flow through the bypass) up to 10 V for 100% (all through the coil). The feedback wire tells the controller where it actually is.",f:"Actuator set for 0 to 10 V on a 2 to 10 V output: 2 V means 20% open, so the coil never fully shuts off. A seized stem: the command moves, the feedback doesn't. Hand switch left on at the controller: the BAS says 0%, the valve is wide open.",src:["belimo","mixdiv"],faults:["hStuck","ao010","hHand","hwOff"]},
  cvalveE:{n:"3-way diverting valve, electronic (cooling)",s:"Same diverting valve, 24 VAC actuator.",w:"Ports: AB in from the chilled water supply, A to the coil, B to the bypass. A spring-return actuator, 2 to 10 V, springs closed to the coil on power loss.",y:"AO2 sends 2 V for 0% through the coil up to 10 V for 100%.",f:"No 24 V: it springs closed and the room drifts up while the BAS shows a cooling command.",src:["belimo","mixdiv"],faults:["chwOff"]},
  hcoil:{n:"Hot water coil",s:"Heats the air.",w:"Copper tubes with aluminum fins in the air stream.",y:"The first 10% of flow already gives a third or more of the heat, which is why heating valves are usually equal-percentage.",f:"Still air across a coil with no flow in freezing weather splits the tubes.",src:["bctx"],faults:["hwOff","hStuck"]},
  ccoil:{n:"Chilled water coil",s:"Cools and dries the air.",w:"Copper tubes with aluminum fins, a drain pan below.",y:"With 45°F water and the valve full open, air leaves in the low to mid 50s.",f:"",src:["bctx"],faults:["chwOff"]},
  sfanE:{n:"Supply fan, starter, current switch",s:"The fan and its proof of running.",w:"A DO energizes the starter. A current switch on one motor lead closes a DI when the motor draws current above its setpoint.",y:"If the fan is commanded on and there's no status for 30 seconds, the controller shuts it down and alarms.",f:"A broken belt: the motor runs light, current falls below the switch setpoint, no status. A failed current switch: the fan runs fine but the controller thinks it doesn't. Measure motor amps to tell them apart.",src:[],faults:["belt","fanStat","filter"]},
  zone:{n:"Zone",s:"The room being controlled.",w:"Gains heat from people, lights and sun, loses or gains it through the walls.",y:"The big number is the actual room temperature. The BAS shows what the sensor says. When they differ, suspect the sensor.",f:"",src:[],faults:[]}}
};
DDC.lampOn=S=>({occ:S.occ,fan:S.status,heat:S.xH>0.05,cool:S.xC>0.05,ovr:S.hOv>0||S.cOv>0,alm:S.frz||S.fanAlm||DDC.F.rsOpen||DDC.F.rsShort||(DDC.F.filter&&S.fanCmd)});

// meter readout shared by both tabs
const CMET={pneu:PMET,ddc:DMET};
function ctlMeter(sim){const sel=$("mpt");if(!sel)return;const M=CMET[sim.id];if(sel.dataset.sim!==sim.id){sel.dataset.sim=sim.id;sel.innerHTML=M.map((m,i)=>`<option value="${i}">${m[0]}</option>`).join("")}
 const o=$("mread");if(o){const v=M[+sel.value||0][1](sim.S,sim.F,sim.V);if(o.textContent!==v)o.textContent=v}}
[PNEU,DDC].forEach(s=>{const d=s.draw;s.draw=function(dt){d.call(this,dt);ctlMeter(this)}});
