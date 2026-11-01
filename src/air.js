/* ============ AIRFLOW AND DUCTS (furnace + add-on coil, attic ducts, four rooms, static pressure, psychrometrics) ============ */
SRC.mqtesp=["measureQuick: Total external static pressure (most residential equipment rated 0.5 in. w.c.; over 70% of tested systems exceed it)","https://support.measurequick.com/portal/en/kb/articles/total-external-static-pressure"];
SRC.mqdrop=["measureQuick: Component pressure drops (filters by MERV, coil clean 0.10–0.25 in. w.c., ducts 0.05–0.20)","https://support.measurequick.com/portal/en/kb/articles/component-pressure-drops"];
SRC.mqcpt=["measureQuick: Airflow, CFM per ton (400 design, 350–375 humid climates, up to 450 dry; low airflow looks like overcharge)","https://support.measurequick.com/portal/en/kb/articles/cfm-per-ton"];
SRC.nci=["National Comfort Institute: Measure and interpret static pressures (test port locations, measure the add-on coil separately)","https://trutechtools.com/content/brands/testo/documents/National%20Comfort%20Institute%20-%20Measure%20and%20Interpret%20Static%20Pressures.pdf"];
SRC.fanlaw=["HVAC School: The 3 fan laws and fan curve charts (CFM ∝ RPM, static ∝ RPM², horsepower ∝ RPM³)","https://hvacrschool.com/the-3-fan-laws-and-fan-curve-charts"];
SRC.ecm=["HVAC School: Blowers and how they behave (PSC airflow and watts fall as static rises; ECMs speed up and draw more watts to hold airflow)","https://hvacrschool.com/blowers-props-and-how-they-behave-or-misbehave"];
SRC.manD=["Energy Vanguard: Duct design, sizing the ducts (ACCA Manual D velocity limits: supply 900 fpm, return 700 fpm)","https://energyvanguard.com/blog/duct-design-5-sizing-ducts"];
SRC.heq=["Engineering ToolBox: Air heat equations (sensible 1.08 × CFM × ΔT, latent 0.68 × CFM × Δgrains)","https://engineeringtoolbox.com/cooling-heating-equations-d_747.html"];
SRC.psy=["Engineering ToolBox: Enthalpy of moist air (0.240 dry air, 0.444 vapor, latent heat of water)","https://www.engineeringtoolbox.com/enthalpy-moist-air-d_683.html"];
SRC.cptEV=["Energy Vanguard: What's the correct airflow for an air conditioner?","https://energyvanguard.com/blog/whats-the-correct-air-flow-for-an-air-conditioner"];

PHOTOS.air={filt:[gimg("furnace filter rack MERV 8 pleated filter")],blow:[gimg("furnace blower wheel squirrel cage dirty")],furn:[gimg("gas furnace upflow cabinet open")],ecoil:[gimg("cased evaporator A coil on furnace")],
 plen:[gimg("supply plenum static pressure test port")],trunk:[gimg("attic supply trunk duct insulated")],flex:[gimg("crushed flex duct attic")],damp:[gimg("manual balancing damper round duct")],reg:[gimg("ceiling supply register flow hood")],
 rgrille:[gimg("central return air grille ceiling")],rduct:[gimg("return duct leak attic")],ports:[gimg("digital manometer static pressure test furnace")],tstat:[gimg("digital thermostat")],attic:[gimg("attic ductwork")],
 fanchart:[gimg("furnace blower performance table external static pressure")],psychart:[gimg("psychrometric chart")],rooms:[gimg("flow hood measuring register airflow")]};

// ---- psychrometrics (sea level, ASHRAE Hyland-Wexler saturation pressure) ----
const PSY={P:14.696,
 pws(T){const R=T+459.67;if(T<32)return Math.exp(-1.0214165e4/R-4.8932428-5.3765794e-3*R+1.9202377e-7*R*R+3.5575832e-10*R**3-9.0344688e-14*R**4+4.1635019*Math.log(R));
  return Math.exp(-1.0440397e4/R-1.1294650e1-2.7022355e-2*R+1.2890360e-5*R*R-2.4780681e-9*R**3+6.5459673*Math.log(R))},
 Ws(T){const p=PSY.pws(T);return 0.621945*p/(PSY.P-p)},
 Wrh(T,rh){const p=rh*PSY.pws(T);return 0.621945*p/(PSY.P-p)},
 rh(T,W){return W*PSY.P/(0.621945+W)/PSY.pws(T)},
 h(T,W){return 0.240*T+W*(1061+0.444*T)},
 dew(W){let lo=-40,hi=130;for(let i=0;i<34;i++){const m=(lo+hi)/2;if(PSY.Ws(m)>W)hi=m;else lo=m}return (lo+hi)/2},
 wb(T,W){let lo=-20,hi=T;for(let i=0;i<34;i++){const m=(lo+hi)/2;const w=((1093-0.556*m)*PSY.Ws(m)-0.240*(T-m))/(1093+0.444*T-m);if(w>W)hi=m;else lo=m}return (lo+hi)/2}};

// ---- the house: four rooms on one trunk ----
// [name, design CFM, share of envelope UA, share of sun, internal Btu/h, branch length factor]
const AROOMS=[["Living",420,0.32,0.34,900,0.95],["Kitchen",260,0.20,0.18,1100,1.0],["Bed 1",280,0.24,0.26,300,1.05],["Bed 2",240,0.24,0.22,300,1.3]];
const AQ0=1200;                  // design airflow (3 tons at 400 CFM/ton)
const AFAN={s0:1.38,b:0.3/0.52e6,rpm:1075,taps:{high:1,mhigh:0.92,mlow:0.84,low:0.76},rmax:1.12}; // PSC wheel: 1200 CFM at 0.55", 1400 at 0.25" on high
const FURN_IN=60000,FURN_EFF=0.96;
const MERV_DROP=m=>{const t=[[4,0.05],[8,0.10],[11,0.15],[13,0.22],[16,0.32]];for(let i=1;i<t.length;i++)if(m<=t[i][0]){const [a,da]=t[i-1],[b,db]=t[i];return da+(db-da)*(m-a)/(b-a)}return 0.32};
const ALAMP=[["call","Call","g"],["fan","Blower","g"],["cool","Cooling","g"],["heat","Burner","a"],["ice","Coil icing","r"],["hs","Over 0.5\" static","a"],["lim","High limit","r"]];

// cooling coil and compressor in balance: the suction temperature settles where the coil's capacity equals the compressor's
function aCoil(cfm,Tin,Win,odt,ua){
 const BF=0.04+0.08*(cfm/AQ0),film=11/Math.max(0.2,ua),hin=PSY.h(Tin,Win);
 const comp=Te=>36000*(1+0.021*(Te-45))*(1-0.009*(odt-95));
 const cq=Te=>{const a=Te+film;return 4.5*cfm*(1-BF)*Math.max(0,hin-PSY.h(a,PSY.Ws(a)))};
 let lo=-20,hi=75;for(let i=0;i<32;i++){const m=(lo+hi)/2;if(cq(m)>comp(m))lo=m;else hi=m}
 const Te=(lo+hi)/2,adp=Te+film,Wa=PSY.Ws(adp);
 const Tout=Tin-(1-BF)*(Tin-adp),Wout=Win>Wa?Win-(1-BF)*(Win-Wa):Win;
 return {Te,adp,Tout,Wout,wet:Win>Wa}}

// fan and system curve chart and psychrometric chart, drawn into the SVG
const FC={x0:548,x1:782,y0:206,y1:42,qmax:2000,pmax:1.4};
const fcX=q=>FC.x0+(FC.x1-FC.x0)*q/FC.qmax,fcY=s=>FC.y0-(FC.y0-FC.y1)*s/FC.pmax;
const PC={x0:548,x1:782,y0:446,y1:282,tmin:30,tmax:110,wmax:0.022};
const pcX=T=>PC.x0+(PC.x1-PC.x0)*(T-PC.tmin)/(PC.tmax-PC.tmin),pcY=W=>PC.y0-(PC.y0-PC.y1)*W/PC.wmax;
function aCharts(p){
 const fg=[];for(let q=0;q<=2000;q+=500)fg.push(`<line x1="${fcX(q)}" y1="${FC.y0}" x2="${fcX(q)}" y2="${FC.y1}" stroke="var(--line)" stroke-width=".4"/><text class="cht" x="${fcX(q)}" y="${FC.y0+11}" text-anchor="middle">${q}</text>`);
 for(let s=0;s<=1.4;s+=0.2)fg.push(`<line x1="${FC.x0}" y1="${fcY(s)}" x2="${FC.x1}" y2="${fcY(s)}" stroke="var(--line)" stroke-width=".4"/><text class="cht" x="${FC.x0-4}" y="${fcY(s)+3}" text-anchor="end">${s.toFixed(1)}</text>`);
 const pg=[];for(let T=40;T<=110;T+=10)pg.push(`<line x1="${pcX(T)}" y1="${PC.y0}" x2="${pcX(T)}" y2="${pcY(Math.min(PC.wmax,PSY.Ws(T)))}" stroke="var(--line)" stroke-width=".4"/><text class="cht" x="${pcX(T)}" y="${PC.y0+11}" text-anchor="middle">${T}</text>`);
 for(let g=0;g<=140;g+=20){const W=g/7000;pg.push(`<line x1="${pcX(Math.max(PC.tmin,PSY.dew(W)))}" y1="${pcY(W)}" x2="${PC.x1}" y2="${pcY(W)}" stroke="var(--line)" stroke-width=".4"/><text class="cht" x="${PC.x1+3}" y="${pcY(W)+3}">${g}</text>`)}
 const curve=rh=>{const pts=[];for(let T=PC.tmin;T<=PC.tmax;T+=2){const W=PSY.Wrh(T,rh);if(W>PC.wmax)break;pts.push(`${pcX(T).toFixed(1)},${pcY(W).toFixed(1)}`)}return pts.join(" ")};
 return `
<g class="part" data-p="fanchart" tabindex="0">
 <rect class="hl" x="508" y="18" width="286" height="214" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>
 <text class="lblS" x="516" y="32">Blower curve vs system curve</text>
 ${fg.join("")}
 <text class="cht" x="${(FC.x0+FC.x1)/2}" y="${FC.y0+22}" text-anchor="middle">CFM</text><text class="cht" x="514" y="${FC.y1-4}">in. w.c.</text>
 <line x1="${FC.x0}" y1="${fcY(0.5)}" x2="${FC.x1}" y2="${fcY(0.5)}" stroke="var(--warn)" stroke-width="1" stroke-dasharray="4 3"/><text class="cht" x="${FC.x1-2}" y="${fcY(0.5)-3}" text-anchor="end" fill="var(--warn)">rated 0.5"</text>
 <polyline id="${p}fanCurve" fill="none" stroke="var(--cold)" stroke-width="2"/>
 <polyline id="${p}sysCurve" fill="none" stroke="var(--hot)" stroke-width="2"/>
 <circle id="${p}opPt" r="5" fill="var(--ink)" stroke="var(--paper)" stroke-width="1.5"/>
 <text id="${p}opTxt" class="cht" font-weight="600" x="788" y="32" text-anchor="end"></text>
 <text class="cht" x="552" y="228" fill="var(--cold)" font-weight="600">blue: blower</text><text class="cht" x="782" y="228" text-anchor="end" fill="var(--hot)" font-weight="600">red: ducts</text>
</g>
<g class="part" data-p="psychart" tabindex="0">
 <rect class="hl" x="508" y="246" width="286" height="218" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>
 <text class="lblS" x="516" y="260">Psychrometric chart</text><text class="cht" x="790" y="260" text-anchor="end">grains/lb</text>
 ${pg.join("")}
 <polyline points="${curve(1)}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
 <polyline points="${curve(0.5)}" fill="none" stroke="var(--muted)" stroke-width=".9" stroke-dasharray="3 2"/><text class="cht" x="${pcX(98)}" y="${pcY(PSY.Wrh(98,0.5))-3}" fill="var(--muted)">50%</text>
 <text class="cht" x="${pcX(58)}" y="${pcY(PSY.Ws(62))}" fill="var(--ink)">100%</text>
 <text class="cht" x="${(PC.x0+PC.x1)/2}" y="${PC.y0+22}" text-anchor="middle">dry bulb °F</text>
 <line id="${p}pLine" stroke="var(--cold)" stroke-width="2" stroke-dasharray="4 2"/>
 <line id="${p}pAdp" stroke="var(--cold)" stroke-width="1" stroke-dasharray="1 3"/>
 <circle id="${p}pRet" r="4.5" fill="var(--hot)"/><circle id="${p}pSup" r="4.5" fill="var(--cold)"/><circle id="${p}pOut" r="3.5" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
 <text id="${p}pRetT" class="cht" font-weight="600"></text><text id="${p}pSupT" class="cht" font-weight="600"></text><text id="${p}pOutT" class="cht" fill="var(--muted)">outdoors</text>
</g>`}

function aSvg(p){
 const rooms=[[20,150],[150,250],[250,365],[365,470]],bx=[112,200,312,420];
 const duct=(d,w,fill="url(#zSteel)")=>`<path d="${d}" fill="none" stroke="#3d4448" stroke-width="${w+2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linejoin="round"/>`;
 const flow=(d,id,w)=>`<path id="${p+id}" d="${d}" fill="none" stroke-width="${w}" stroke-dasharray="6 10" stroke-linecap="round" opacity=".85"/>`;
 return `
<defs><linearGradient id="aInsul" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8d9a8"/><stop offset="1" stop-color="#c9b580"/></linearGradient>
 <pattern id="aIce" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#eef6fb"/><path d="M0 6 L6 0" stroke="#bcd7ea" stroke-width="1"/></pattern></defs>
<line x1="6" y1="462" x2="500" y2="462" stroke="var(--line)" stroke-dasharray="2 4"/>
<!-- roof and attic -->
<g class="part" data-p="attic" tabindex="0">
 <path class="hl" d="M8 122 L245 26 L482 122 Z" fill="#8a7a63" fill-opacity=".18" stroke="#6b5a4a" stroke-width="3"/>
 <rect x="18" y="112" width="456" height="9" fill="url(#aInsul)" opacity=".8"/>
</g>
<text class="lblS" x="245" y="56" text-anchor="middle">Attic</text><text class="val" id="${p}atticTxt" x="245" y="70" text-anchor="middle" font-size="11">120°F</text>
<text class="lblS" x="316" y="20">Outdoors</text><text class="val" id="${p}outTxt" x="316" y="34" font-size="11">95°F</text>
<!-- rooms -->
<g class="part" data-p="rooms" tabindex="0">
 <rect class="hl" x="18" y="121" width="456" height="181" fill="url(#zCabIn)" fill-opacity=".25" stroke="#a89a85" stroke-width="3"/>
 ${rooms.slice(1).map(([a])=>`<line x1="${a}" y1="122" x2="${a}" y2="300" stroke="#a89a85" stroke-width="3"/><rect x="${a-2}" y="246" width="4" height="54" fill="var(--bg)"/>`).join("")}
</g>
${AROOMS.map((r,i)=>`<rect id="${p}rm${i}" x="${rooms[i][0]+3}" y="124" width="${rooms[i][1]-rooms[i][0]-6}" height="174" fill="var(--cold)" opacity="0"/>
 <text class="lblS" x="${(rooms[i][0]+rooms[i][1])/2}" y="186" text-anchor="middle">${r[0]}</text>
 <text class="val" id="${p}rT${i}" x="${(rooms[i][0]+rooms[i][1])/2}" y="202" text-anchor="middle" font-size="13">75.0°F</text>
 <text class="val" id="${p}rQ${i}" x="${(rooms[i][0]+rooms[i][1])/2}" y="146" text-anchor="middle" font-size="10.5">0 CFM</text>
 <text class="cht" id="${p}rD${i}" x="${(rooms[i][0]+rooms[i][1])/2}" y="158" text-anchor="middle">design ${r[1]}</text>`).join("")}
<!-- supply trunk and branches in the attic -->
<g class="part" data-p="trunk" tabindex="0">
 ${duct("M484 330 V100 H96",14)}
 <path class="hl" d="M484 330 V100 H96" fill="none" stroke="transparent" stroke-width="16"/>
 <rect x="476" y="300" width="16" height="22" fill="url(#aInsul)" opacity=".6"/>
</g>
${flow("M484 330 V100 H96","fSup",4)}
<g id="${p}leakS" opacity="0">${[180,300,440].map(x=>`<g class="puff"><circle cx="${x}" cy="90" r="4" fill="#cfe3f5"/><circle cx="${x+6}" cy="84" r="3" fill="#cfe3f5"/></g>`).join("")}</g>
${bx.map((x,i)=>`<g class="part" data-p="${i===3?"flex":"damp"}" tabindex="0">${duct(`M${x} 100 V120`,9,i===3?"#c9c3b5":"url(#zSteel)")}<rect class="hl" x="${x-7}" y="99" width="14" height="22" fill="transparent"/>
 <line id="${p}dmp${i}" x1="${x-5}" y1="108" x2="${x+5}" y2="108" stroke="#2b2f33" stroke-width="2.2"/></g>`).join("")}
<path id="${p}crush" d="M414 104 Q420 110 426 104 M414 114 Q420 108 426 114" stroke="#6b5a4a" stroke-width="2.2" fill="none" opacity="0"/>
<g id="${p}disc" opacity="0"><rect x="305" y="104" width="14" height="9" fill="var(--bg)"/><circle class="puff" cx="300" cy="100" r="5" fill="#cfe3f5"/><text class="cht" x="322" y="96" fill="var(--bad)">loose</text></g>
${bx.map((x,i)=>`<g class="part" data-p="reg" tabindex="0"><rect class="hl" x="${x-13}" y="120" width="26" height="6" rx="1" fill="url(#zGrille)" stroke="#555"/><rect id="${p}reg${i}" x="${x-13}" y="120" width="26" height="6" fill="#2b2f33" opacity="0"/></g>`).join("")}
${bx.map((x,i)=>flow(`M${x} 100 V126`,"fB"+i,3)).join("")}
<!-- return: ceiling grille in the living room, duct across the attic and down the chase -->
<g class="part" data-p="rgrille" tabindex="0"><rect class="hl" x="44" y="119" width="36" height="8" rx="1" fill="url(#zGrille)" stroke="#555"/><rect id="${p}rblock" x="40" y="127" width="44" height="22" rx="2" fill="#7a5b3a" opacity="0"/></g>
<text class="cht" id="${p}rblockT" x="62" y="160" text-anchor="middle" opacity="0" fill="var(--bad)">blocked</text>
<g class="part" data-p="rduct" tabindex="0">${duct("M62 119 V80 H24 V448 H150",16)}<path class="hl" d="M62 119 V80 H24 V448 H150" fill="none" stroke="transparent" stroke-width="18"/></g>
${flow("M62 122 V80 H24 V448 H150","fRet",4)}
<g id="${p}leakR" opacity="0"><g class="puff"><circle cx="40" cy="74" r="4" fill="#f2c7a2"/><circle cx="46" cy="68" r="3" fill="#f2c7a2"/></g><text class="cht" x="50" y="70" fill="var(--bad)">attic air in</text></g>
<!-- basement equipment -->
<line x1="10" y1="304" x2="500" y2="304" stroke="#a89a85" stroke-width="3"/>
<text class="lblS" x="150" y="320">Basement</text>
<g class="part" data-p="filt" tabindex="0">${zFilter(150,424,14,34,p+"dirt")}</g>
${duct("M164 441 H200",30)}
<g class="part" data-p="furn" tabindex="0">
 <rect class="hl" x="200" y="362" width="70" height="96" rx="3" fill="url(#zCab)" stroke="#4d555a" stroke-width="1.4"/>
 <rect x="206" y="368" width="58" height="34" rx="2" fill="url(#zInside)"/>
 ${[0,1,2].map(i=>`<path d="M${214+i*18} 400 Q${218+i*18} ${386} ${214+i*18} 372" stroke="#7a4a2a" stroke-width="5" fill="none"/>`).join("")}
 <g id="${p}flame" opacity="0">${[0,1,2].map(i=>`<path d="M${210+i*18} 400 q4 -12 8 0 z" fill="url(#zFlame)"/>`).join("")}</g>
</g>
<g class="part" data-p="blow" tabindex="0">${zBlower(235,432,17,p+"blades")}<circle id="${p}wdirt" cx="235" cy="432" r="17" fill="#6b5a3a" opacity="0"/></g>
<g class="part" data-p="ecoil" tabindex="0">
 <rect class="hl" x="200" y="322" width="70" height="40" rx="2" fill="url(#zCab)" stroke="#4d555a"/>
 <path d="M206 358 L235 328 L264 358" fill="none" stroke="url(#zFins)" stroke-width="7"/>
 <path id="${p}ice" d="M206 358 L235 328 L264 358" fill="none" stroke="url(#aIce)" stroke-width="9" opacity="0"/>
 <path id="${p}cdirt" d="M206 358 L235 328 L264 358" fill="none" stroke="#6b5a3a" stroke-width="8" opacity="0"/>
 <circle id="${p}drip" cx="235" cy="360" r="2" fill="var(--cold)" opacity="0"/>
</g>
<g class="part" data-p="plen" tabindex="0">${duct("M235 322 V314 H484 V330",14)}<path class="hl" d="M235 322 V314 H484" fill="none" stroke="transparent" stroke-width="16"/></g>
${flow("M235 362 V314 H484","fPl",4)}
<!-- test ports -->
<g class="part" data-p="ports" tabindex="0">
 ${[[134,448,"P1"],[184,441,"P2"],[276,366,"P3"],[276,322,"P4"]].map(([x,y,l])=>`<circle class="hl" cx="${x}" cy="${y}" r="4" fill="#ffd34d" stroke="#6b5200"/><text class="cht" x="${x+ (x>200?7:-2)}" y="${y-7}" ${x>200?"":'text-anchor="end"'} font-weight="600">${l}</text>`).join("")}
 <text id="${p}pv1" class="cht" x="128" y="430" text-anchor="middle"></text><text id="${p}pv2" class="cht" x="186" y="420" text-anchor="middle"></text>
 <text id="${p}pv3" class="cht" x="282" y="378"></text><text id="${p}pv4" class="cht" x="282" y="334"></text>
 <rect x="40" y="336" width="92" height="64" rx="7" fill="#f2b632" stroke="#7a5600"/><rect x="48" y="344" width="76" height="28" rx="3" fill="url(#zLcd)" stroke="#6e7f71"/>
 <text id="${p}mano" x="86" y="364" text-anchor="middle" font-family="var(--mono)" font-size="15" fill="#1f2a22">0.00</text>
 <text class="cht" x="86" y="384" text-anchor="middle" fill="#3a2a00" font-weight="600">TESP in. w.c.</text><text class="cht" x="86" y="394" text-anchor="middle" fill="#3a2a00">|P2| + P3</text>
</g>
<g class="part" data-p="tstat" tabindex="0">${zTstat(156,214,34,40,p+"tstatTxt",p+"tstatLamp","75")}</g>
<!-- readout panel -->
<rect x="296" y="378" width="176" height="80" rx="5" fill="#16201a" stroke="#0b0f0c"/>
${["r1","r2","r3","r4","r5","r6"].map((k,i)=>`<text id="${p+k}" x="302" y="${391+i*12.4}" font-family="var(--mono)" font-size="9.4" fill="#bfe8c4"></text>`).join("")}
${aCharts(p)}`}

const AIR={id:"air",p:"a_",name:"Airflow and ducts",svg:aSvg("a_"),lamps:ALAMP,txvOnly:[],
 sliders:[
  {k:"set",l:"Thermostat",u:"°F",min:60,max:85,step:1,v:75,n:[68,78],note:"Cooling or heating setpoint."},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-10,max:110,step:1,v:95,note:"Heat mode wants a cold day: try 25°F."},
  {k:"dew",l:"Outdoor dew point",u:"°F",min:20,max:76,step:1,v:62,note:"Muggy is 65°F and up. It sets the moisture that leaks into the house."},
  {k:"tap",l:"PSC cooling speed tap",u:"",min:1,max:4,step:1,v:4,n:[3,4],note:"1 low, 2 med-low, 3 med-high, 4 high. Heat uses med-low. Each tap is a different winding: fan law 1 says CFM follows RPM."},
  {k:"cpt",l:"ECM cooling airflow",u:" CFM/ton",min:300,max:450,step:25,v:400,n:[350,450],note:"Only for the ECM motor. 400 is design; 350–375 in humid climates; up to 450 dry."},
  {k:"merv",l:"Filter MERV",u:"",min:4,max:16,step:1,v:8,n:[4,11],note:"Higher MERV catches more but adds static. A 1-inch MERV 13 can use up half the rated 0.5\"."},
  {k:"ret",l:"Return duct size",u:" in.",min:10,max:20,step:1,v:16,n:[16,20],note:"Round equivalent. For 1200 CFM at 700 fpm (Manual D return limit) you need about 18 in."},
  {k:"d0",l:"Damper: Living",u:"%",min:10,max:100,step:5,v:100,more:1},
  {k:"d1",l:"Damper: Kitchen",u:"%",min:10,max:100,step:5,v:100,more:1},
  {k:"d2",l:"Damper: Bed 1",u:"%",min:10,max:100,step:5,v:100,more:1},
  {k:"d3",l:"Damper: Bed 2",u:"%",min:10,max:100,step:5,v:100,more:1},
  {k:"lat",l:"Indoor moisture (people, cooking, showers)",u:" lb/day",min:5,max:40,step:1,v:15,n:[8,20],note:"A family of four adds roughly 15–20 lb of water a day.",more:1}],
 faults:[["filterDirty","Filter loaded with dust"],["coilDirty","Evaporator coil fouled"],["wheelDirty","Blower wheel caked with dirt"],["capWeak","PSC run capacitor weak"],["wrongTap","Cooling wired to the low speed tap"],
  ["ecmSet","ECM set up for a 2-ton unit"],["returnBlock","Return grille blocked (furniture, closed door)"],["crushed","Flex duct to Bed 2 crushed in the attic"],["disc","Bed 1 branch disconnected in the attic"],
  ["closedRegs","Homeowner closed the bedroom registers"],["supplyLeak","Supply trunk joints leaking into the attic"],["returnLeak","Return duct leaking attic air in"]],
 hidden:[],
 scenarios:[{l:"Iced coil: loaded filter, small return, 68°F setpoint on a mild night",f:["filterDirty"],v:{ret:12,set:68,merv:11,out:78},speed:60},
  {l:"Hot back bedrooms: crushed flex and closed registers",f:["crushed","closedRegs"],speed:60},
  {l:"Cool but clammy: ECM at 450 CFM/ton, muggy day, leaky return",f:["returnLeak"],v:{cpt:450,dew:72},s:{motor:"ecm"},speed:60},
  {l:"Furnace cycling on its high limit: loaded MERV 13 filter, small return",f:["filterDirty"],v:{ret:11,merv:13,out:15,set:72},s:{mode:"heat"},speed:60}],
 svcS:{},
 startMsg(){return `3-ton system started in ${this.S.mode} mode. Rooms ${this.S.T[0].toFixed(0)}°F, outdoors ${this.V.out}°F. Blower: ${this.S.motor==="ecm"?"ECM":"PSC"}.`},
 parts:{
  filt:{n:"Filter rack",s:"Catches dust before the blower and coil.",w:"A 16×25 filter in a rack beside the furnace. A 1-inch pleated MERV 8 drops about 0.10 in. w.c. at 1200 CFM; MERV 13 about twice that. A 4-inch media filter has much more surface and drops about half as much.",
   y:"Everything the blower moves passes through it, so its drop comes straight out of the blower's static budget. Read P1 and P2: the difference is the filter drop.",
   f:"Loaded with dust its drop can triple. Airflow falls, the coil runs colder (it can ice up in cooling) and the heat exchanger runs hotter (the high limit can trip in heating). Flag it when the filter alone uses more than about 0.2\" on a 0.5\" system.",src:["mqdrop","mqtesp"],faults:["filterDirty"]},
  blow:{n:"Blower",s:"Forward-curved squirrel-cage wheel and motor.",w:"PSC: a fixed-speed motor with several speed taps and a run capacitor. ECM: a programmed motor that changes speed to hold an airflow target.",
   y:"Fan laws: CFM follows RPM, static follows RPM², horsepower follows RPM³. A PSC on one tap sits on one curve: more restriction means less air and, on this wheel, fewer watts. An ECM speeds up to hold its CFM and draws more watts until it hits its limit (here about 0.9\").",
   f:"Dirty wheel: the cups fill with dust and the wheel moves far less air at the same RPM. Weak capacitor: a PSC slows down. ECM set up for the wrong tonnage: it holds the wrong airflow perfectly.",src:["fanlaw","ecm"],faults:["wheelDirty","capWeak","wrongTap","ecmSet"]},
  furn:{n:"Furnace",s:`${FURN_IN/1000},000 Btu/h input, ${Math.round(FURN_EFF*100)}% efficient.`,w:"An upflow gas furnace. The blower sits below the heat exchanger and pushes air up through it and the coil.",
   y:"Temperature rise method: output Btu/h ÷ (1.08 × rise) = CFM. The nameplate gives an allowed rise range (this one 35–65°F). Rise over the range means low airflow.",
   f:"Low airflow in heating: the rise climbs past the nameplate range and the high limit opens the burner circuit. Repeated limit trips crack heat exchangers.",src:["heq"],faults:[]},
  ecoil:{n:"Evaporator coil",s:"Cased A-coil on top of the furnace.",w:"Copper tubes and aluminum fins. Dry it drops about 0.20\" at 1200 CFM; wet with condensate about 20% more.",
   y:"It cools and dries the air. The split (return minus supply dry bulb) is usually 18–22°F at normal indoor humidity. Lower airflow makes a colder coil and more moisture removal; higher airflow the reverse.",
   f:"A fouled coil adds static and loses capacity. With low airflow or a cool house the coil drops below 32°F and frost builds, which cuts airflow more until the coil is a block of ice. Thaw it fully (fan on, cooling off) and fix the airflow.",src:["mqcpt","cptEV","mqdrop"],faults:["coilDirty"]},
  plen:{n:"Supply plenum",s:"Box on top of the coil feeding the trunk.",w:"Sheet metal. P3 is drilled between the furnace and the coil, P4 above the coil.",y:"P3 minus P4 is the coil drop. P3 is the supply half of the furnace's external static, since the add-on coil is outside the furnace's rating.",f:"",src:["nci"],faults:[]},
  trunk:{n:"Supply trunk",s:"Main duct across the attic.",w:"Insulated sheet metal. Manual D limits supply velocity to 900 fpm for noise.",y:"Air leaves through each branch in proportion to how easily it flows: short, open branches take more.",
   f:"Leaky joints dump cold air into the attic. The rooms get less, and the house goes negative, which pulls in hot humid outdoor air.",src:["manD"],faults:["supplyLeak"]},
  damp:{n:"Balancing dampers",s:"Plates in each branch to set room airflow.",w:"A blade with a locking quadrant handle near the trunk.",y:"Close the rooms that get too much to push air to the rooms that get too little. Closing dampers adds static, so check TESP after balancing.",f:"A loose disconnected branch dumps all its air into the attic.",src:["manD"],faults:["disc"]},
  flex:{n:"Flex duct (Bed 2)",s:"The long run to the far bedroom.",w:"Insulated flexible duct. It has more friction than metal and must be pulled tight and supported.",y:"The longest run has the most resistance, so it already gets the least air.",f:"Crushed or kinked flex can cut the room's airflow by more than half. The room runs hot in summer and cold in winter while the thermostat elsewhere is happy.",src:["manD"],faults:["crushed"]},
  reg:{n:"Supply registers",s:"Ceiling diffusers into each room.",w:"Stamped grilles with a lever damper.",y:"Measure room airflow with a flow hood on each one. Compare with the design CFM.",f:"Closing registers to save energy doesn't help a central system: static rises, total airflow drops, and the other rooms barely gain.",src:["mqtesp"],faults:["closedRegs"]},
  rgrille:{n:"Return grille",s:"Central return in the living room ceiling.",w:"A large filter-less grille. All the air comes back through it.",y:"Rooms need a path back: door undercuts or transfer grilles, or doors closed can starve the return.",f:"Blocked by furniture or a closed door: return static jumps and airflow drops.",src:["mqtesp"],faults:["returnBlock"]},
  rduct:{n:"Return duct",s:"Brings house air back to the furnace.",w:"Runs across the attic and down a chase. Manual D limits return velocity to 700 fpm.",y:"An undersized return is the most common cause of high static. P1 reads how hard the blower is pulling on it.",
   f:"A leak in the attic pulls in 120°F+ attic air. The return gets hotter and more humid than the house, the coil works harder and the house never dries out.",src:["manD","mqtesp"],faults:["returnLeak"]},
  ports:{n:"Test ports and manometer",s:"Where the static readings come from.",w:"Small holes plugged with rubber caps. A digital manometer with a static pressure tip, tip facing into the air.",
   y:"P1: return before the filter. P2: between filter and blower. P3: between furnace and coil. P4: above the coil. Furnace TESP = |P2| + P3. Filter drop = P1 − P2 (−0.12 and −0.24 means 0.12\"). Coil drop = P3 − P4.",
   f:"Most residential equipment is rated for 0.5\". 0.5–0.7\" is over the limit, above 0.7\" is badly restricted. If the only supply port is above the coil, add the coil drop.",src:["mqtesp","nci"],faults:[]},
  tstat:{n:"Thermostat",s:"In the hallway by the kitchen.",w:"",y:"It reads roughly the house average, so one starved room can be miserable while the thermostat is satisfied.",f:"",src:[],faults:[]},
  attic:{n:"Attic",s:"Where the ducts live.",w:"On a 95°F day the attic runs about 25°F hotter. Its moisture follows the outdoors.",y:"Even insulated ducts pick up some heat. Leaks are worse: supply leaks waste cooling, return leaks bring attic air straight into the system.",f:"",src:[],faults:[]},
  rooms:{n:"Rooms",s:"Four rooms with design airflows.",w:"Design CFM comes from each room's load (Manual J) and adds up to 1200 CFM for 3 tons.",y:"Each room's number above the register is what a flow hood would read.",f:"",src:["mqcpt"],faults:[]},
  fanchart:{n:"Blower and system curves",s:"Where the airflow comes from.",w:"Blue: the blower's curve at its current speed (static it can make at each CFM). Red: this duct system's curve, static = K × CFM². The dot is where they cross.",
   y:"A restriction makes the red curve steeper and the dot slides up and left: more static, less air. A faster tap or an ECM raises the blue curve. Fan law 2: double the airflow and static goes up four times.",f:"",src:["fanlaw","ecm"],faults:[]},
  psychart:{n:"Psychrometric chart",s:"Return air, supply air and the coil line.",w:"Dry bulb across the bottom, moisture (grains per pound) up the side, saturation on the curve.",
   y:"In cooling the line from return (red) to supply (blue) goes down and left: down is moisture removed (latent), left is temperature dropped (sensible). Extended, it points at the coil's apparatus dew point. Sensible = 1.08 × CFM × ΔT, latent = 0.68 × CFM × Δgrains.",f:"",src:["psy","heq"],faults:[]}},
 init(){const V=this.V;return {t:0,dead:null,mode:"cool",fan:"auto",motor:"psc",deep:false,labels:true,calling:false,comp:false,fire:false,blowerOn:false,offT:0,onT:0,delay:0,lim:false,
  T:AROOMS.map(()=>V.set+1),W:PSY.Wrh(V.set+1,0.5),ice:0,q:0,qt:0,r:0,rpm:0,watts:0,K:0,tesp:0,p:[0,0,0,0],flows:[0,0,0,0],leakS:0,leakR:0,Tret:V.set,Wret:0.009,Tsup:V.set,Wsup:0.009,Te:45,adp:55,wet:false,
  sens:0,lat:0,heatOut:0,ang:0,off:0,Treg:[],logs2:{}}},
 switches:[
  {l:S=>`Thermostat: ${S.mode}`,on:S=>S.mode!=="off",act(sim){const S=sim.S;S.mode={cool:"heat",heat:"off",off:"cool"}[S.mode];
   if(S.mode==="heat"&&sim.V.out>60){sim.V.out=25;const sl=$("sl_out");if(sl){sl.value=25;$("o_out").textContent="25°F"}}
   if(S.mode==="cool"&&sim.V.out<70){sim.V.out=95;const sl=$("sl_out");if(sl){sl.value=95;$("o_out").textContent="95°F"}}
   log(sim,`Thermostat set to ${S.mode}.`)}},
  {l:S=>`Fan: ${S.fan}`,on:S=>S.fan==="on",act(sim){sim.S.fan=sim.S.fan==="auto"?"on":"auto";log(sim,`Fan set to ${sim.S.fan}.`)}},
  {l:S=>`Blower motor: ${S.motor==="ecm"?"ECM (holds CFM)":"PSC (speed taps)"}`,on:S=>S.motor==="ecm",act(sim){sim.S.motor=sim.S.motor==="ecm"?"psc":"ecm";log(sim,sim.S.motor==="ecm"?"ECM blower: it changes speed to hold its programmed airflow.":"PSC blower: fixed speed on the selected tap.")}},
  {l:S=>`Filter: ${S.deep?"4-inch media":"1-inch pleated"}`,on:S=>S.deep,act(sim){sim.S.deep=!sim.S.deep;log(sim,sim.S.deep?"4-inch media filter: about four times the surface, about half the drop.":"1-inch pleated filter.")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[{id:"thaw",l:"Thaw the coil (cooling off, fan on)",show:S=>S.ice>0.05,act(sim){sim.S.mode="off";sim.S.fan="on";log(sim,"Cooling off, fan on to thaw the coil. It takes a while; the condensate drain will run hard.","w")}}],
 resets(S){return []},
 reads(S){const c=S.q;return [["Airflow",`${f0(c)} CFM`],["TESP",`${S.tesp.toFixed(2)}"`],["Blower",S.blowerOn?`${f0(S.watts)} W`:"off"],
  ["Return",`${S.Tret.toFixed(1)}°F ${f0(PSY.rh(S.Tret,S.Wret)*100)}%`],["Supply",S.blowerOn?`${S.Tsup.toFixed(1)}°F`:"—"],["State",this.stText(S)]]},
 stText(S){if(S.mode==="off")return S.blowerOn?"fan only":"off";if(!S.calling)return S.blowerOn?"fan":"satisfied";if(S.mode==="cool")return S.comp?(S.ice>0.3?"cooling, coil iced":"cooling"):"waiting (delay)";return S.lim?"high limit open":S.fire?"heating":"igniting"},
 step(dt){const S=this.S;let r=dt;while(r>1e-9){const h=Math.min(0.5,r);this.sub(h);r-=h;if(S.dead)return}},
 // static pressures and airflow for the current blower speed and duct system
 flowSolve(){const S=this.S,F=this.F,V=this.V,q0=AQ0*AQ0;
  const Kr=0.10/q0*Math.pow(16/V.ret,5)*(F.returnBlock?6:1)+0.03/q0;           // return duct + grille
  const Kf=MERV_DROP(V.merv)*(S.deep?0.45:1)*(F.filterDirty?3.2:1)/q0;
  const Kc=0.20/q0*(S.wet?1.2:1)*(F.coilDirty?2.4:1)*(1+5*S.ice*S.ice);
  const Kt=0.03/q0;
  const G=[];AROOMS.forEach((r,i)=>{const qd2=r[1]*r[1];let d=V["d"+i]/100;if(F.closedRegs&&(i===2||i===3))d=Math.min(d,0.15);
   let K=0.075*r[5]/qd2+0.02/qd2*(1/(d*d)-1);if(F.crushed&&i===3)K*=10;if(F.disc&&i===2)K=0.02/qd2;G.push(1/Math.sqrt(K))});
  const gL=1/Math.sqrt(0.10/(F.supplyLeak?260*260:45*45));
  const Gs=G.reduce((a,b)=>a+b,0)+gL,Ksup=Kt+1/(Gs*Gs);
  const K=Kr+Kf+Kc+Ksup;
  // blower
  const s0=AFAN.s0*(F.wheelDirty?0.62:1);let r=0,tgt=0;
  if(S.motor==="ecm"){tgt=S.mode==="cool"&&S.comp?(F.ecmSet?800:V.cpt*3):S.mode==="heat"&&S.calling?1000:600;
   r=Math.min(AFAN.rmax,tgt*Math.sqrt((AFAN.b+K)/s0))}
  else{const tapN=S.mode==="cool"&&S.comp?(F.wrongTap?1:V.tap):S.mode==="heat"&&S.calling?2:1;r=[0,0.76,0.84,0.92,1][tapN]*(F.capWeak?0.87:1)}
  if(!S.blowerOn)r=0;
  const q=r>0?r*Math.sqrt(s0/(AFAN.b+K)):0;
  return {Kr,Kf,Kc,Ksup,K,G,gL,Gs,q,r,s0,tgt}},
 sub(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;
  const summer=V.out>=70,Tatt=summer?V.out+25:V.out+5,Wout=PSY.Ws(Math.min(V.dew,V.out)),Tavg=AROOMS.reduce((a,r,i)=>a+S.T[i]*r[1],0)/AQ0;
  // thermostat (hallway: reads the house average)
  const was=S.calling;
  if(S.mode==="cool"){if(!S.calling&&Tavg>V.set+0.75)S.calling=true;else if(S.calling&&Tavg<V.set-0.75)S.calling=false}
  else if(S.mode==="heat"){if(!S.calling&&Tavg<V.set-0.75)S.calling=true;else if(S.calling&&Tavg>V.set+0.75)S.calling=false}else S.calling=false;
  if(S.calling!==was)log(sim,S.calling?`Thermostat calls for ${S.mode==="cool"?"cooling":"heat"}.`:"Thermostat satisfied.");
  // equipment sequence
  S.delay=Math.max(0,S.delay-dt);
  const compWas=S.comp;S.comp=S.mode==="cool"&&S.calling&&(S.comp||S.delay<=0);
  if(S.comp&&!compWas)log(sim,"Compressor and blower on.");if(!S.comp&&compWas){S.delay=180;log(sim,"Compressor off. 3-minute delay before it can restart.")}
  const heatCall=S.mode==="heat"&&S.calling;
  if(heatCall&&!S.lim){S.onT+=dt}else S.onT=0;
  const fireWas=S.fire;S.fire=heatCall&&!S.lim&&S.onT>=10;if(S.fire&&!fireWas)log(sim,"Burners lit.");
  if(S.fire)S.heatT=(S.heatT||0)+dt;else S.heatT=0;
  if(S.fire||S.comp)S.offT=S.fire?90:(S.motor==="ecm"?60:0);else S.offT=Math.max(0,S.offT-dt);
  const blWas=S.blowerOn;S.blowerOn=S.fan==="on"||S.comp||(S.fire&&S.heatT>=30)||S.offT>0||S.lim;
  if(S.blowerOn!==blWas&&S.fan!=="on")log(sim,S.blowerOn?"Blower on.":"Blower off.");
  // airflow
  const fs=this.flowSolve();S.K=fs.K;S.tgt=fs.tgt;
  S.q+=(fs.q-S.q)*Math.min(1,dt/4);S.r+=(fs.r-S.r)*Math.min(1,dt/4);const q=S.q;
  S.rpm=AFAN.rpm*S.r;const q2=q*q;
  S.p=[-fs.Kr*q2,-(fs.Kr+fs.Kf)*q2,(fs.Kc+fs.Ksup)*q2,fs.Ksup*q2];S.tesp=-S.p[1]+S.p[2];
  S.watts=!S.blowerOn||q<1?0:S.motor==="ecm"?40+q*(S.tesp+0.25)*0.1175/0.28*(F.wheelDirty?1.3:1):Math.pow(S.r,3)*(230+0.27*q)*(F.capWeak?1.08:1);
  S.flows=fs.G.map(g=>q*g/fs.Gs);S.leakS=q*fs.gL/fs.Gs;const dFlow=S.flows.map((f,i)=>F.disc&&i===2?0:f);
  if(F.disc)S.leakS+=S.flows[2];
  const fr=F.returnLeak?0.18:0.02;S.leakR=q*fr;
  // return air: rooms mixed by the air each one sends back, plus attic air through return leaks
  const sumF=dFlow.reduce((a,b)=>a+b,0);const Th=sumF>5?dFlow.reduce((a,f,i)=>a+f*S.T[i],0)/sumF:Tavg;
  S.Tret=(1-fr)*Th+fr*Tatt;S.Wret=(1-fr)*S.W+fr*Wout;
  // conditioning
  let Tc=S.Tret,Wc=S.Wret;S.wet=false;S.heatOut=0;
  if(S.comp&&q>30){const ua=(F.coilDirty?0.8:1)*(1-0.7*S.ice);const c=aCoil(q,S.Tret,S.Wret,V.out,ua);Tc=c.Tout;Wc=c.Wout;S.Te=c.Te;S.adp=c.adp;S.wet=c.wet;
   if(c.Te<32){S.ice=Math.min(1,S.ice+dt*(32-c.Te)/2400);if(S.ice>0.15&&!S.logs2.ice){S.logs2.ice=1;log(sim,`Coil below freezing (about ${f0(c.Te)}°F refrigerant). Frost is building and choking the airflow.`,"w")}}
   else S.ice=Math.max(0,S.ice-dt/1800)}
  else{S.Te=null;if(S.ice>0){S.ice=Math.max(0,S.ice-dt*(q>30?1/900:1/2400));if(S.ice===0&&S.logs2.ice){S.logs2.ice=0;log(sim,"Coil fully thawed.")}}}
  // heat exchanger: warms during the blower-on delay, then settles at return + rise; the limit sits on the hot heat exchanger, so it reads about 1.45 × the rise
  if(S.Thx==null)S.Thx=S.Tret;
  if(S.fire){const out=FURN_IN*FURN_EFF;const ss=q>60?S.Tret+1.45*out/(1.08*q):S.Thx+60;S.Thx+=(ss-S.Thx)*Math.min(1,dt/30);if(q>30){S.heatOut=out;Tc=S.Tret+out/(1.08*q)*clamp((S.Thx-S.Tret)/(1.45*out/(1.08*q)),0,1)}}
  else S.Thx+=(S.Tret-S.Thx)*Math.min(1,dt/90);
  const Tfur=S.Thx;
  if(S.fire&&Tfur>170&&!S.lim){S.lim=true;log(sim,`High limit opened: ${f0(Tfur)}°F at the limit switch. Burners off, blower keeps running.`,"b");S.limN=(S.limN||0)+1}
  if(S.lim&&(!heatCall||S.limT>120)){S.lim=false;S.limT=0;log(sim,"High limit reset (cooled down).")}if(S.lim)S.limT=(S.limT||0)+dt;
  S.Tsup=S.blowerOn&&q>1?Tc:S.Tsup+(S.Tret-S.Tsup)*Math.min(1,dt/60);S.Wsup=Wc;
  if(S.comp&&q>30){S.sens=1.08*q*(S.Tret-Tc);S.lat=4840*q*Math.max(0,S.Wret-Wc)}else{S.sens=0;S.lat=0}
  // rooms
  const sun=summer?6000*clamp((V.out-70)/25,0,1.3):0,UA=520,Cr=3200,inf=(60+Math.max(0,S.leakS-S.leakR))*1.08;
  S.Treg=[];
  AROOMS.forEach((r,i)=>{const f=dFlow[i];const gain=f>1?(Tatt-S.Tsup)*(1-Math.exp(-14*r[5]/(1.08*f))):0;const Treg=S.Tsup+gain;S.Treg[i]=Treg;
   const Qi=UA*r[2]*(V.out-S.T[i])+sun*r[3]+r[4]+(S.blowerOn?1.08*f*(Treg-S.T[i]):0)+inf*(AQ0>0?r[1]/AQ0:0)*(V.out-S.T[i])+400*(Tavg-S.T[i]);
   S.T[i]+=Qi*dt/3600/(Cr*r[2])});
  // house moisture (lb water per lb dry air, with the furnishings buffering it)
  const mDel=4.5*sumF,mInf=4.5*(60+Math.max(0,S.leakS-S.leakR));
  S.W+=(mDel*(S.blowerOn?S.Wsup-S.W:0)*(sumF>5?1:0)+mInf*(Wout-S.W)+V.lat/24)*dt/3600/2500;
  S.W=clamp(S.W,0.001,0.03);
  // logs (wait until the blower is up to speed)
  S.runT=S.blowerOn?(S.runT||0)+dt:0;
  if(S.blowerOn&&q>100&&S.runT>30){const hs=S.tesp>0.5;if(hs&&!S.logs2.hs&&S.tesp>0.55){S.logs2.hs=1;log(sim,`Total external static ${S.tesp.toFixed(2)}" w.c. is over the 0.5" rating.`,"w")}if(S.tesp<0.45)S.logs2.hs=0}
  if(S.comp&&S.runT>30&&q>100&&q/3<330&&!S.logs2.lowq){S.logs2.lowq=1;log(sim,`Airflow ${f0(q)} CFM is only ${f0(q/3)} CFM per ton (design 400).`,"w")}if(!S.comp||q/3>360)S.logs2.lowq=0;
  if(S.fire&&q>100&&S.runT>60){const rise=Tc-S.Tret;if(rise>66&&!S.logs2.rise){S.logs2.rise=1;log(sim,`Temperature rise ${f0(rise)}°F is over the nameplate range (35–65°F). Airflow is too low.`,"w")}if(rise<60)S.logs2.rise=0}
  const rh=PSY.rh(Th,S.W);if(rh>0.6&&!S.logs2.rh){S.logs2.rh=1;log(sim,`Indoor humidity is ${f0(rh*100)}%. Over 60% feels clammy and grows mold.`,"w")}if(rh<0.55)S.logs2.rh=0},
 draw(dt){const S=this.S,F=this.F,V=this.V,p="a_";
  const on=S.blowerOn&&S.q>20;S.off-=dt*S.q/40;
  [["fSup",S.Tsup],["fPl",S.Tsup],["fRet",S.Tret]].forEach(([id,T])=>{const e=$(p+id);if(e){e.style.strokeDashoffset=S.off;e.style.opacity=on?0.85:0;e.setAttribute("stroke",acol(T))}});
  AROOMS.forEach((r,i)=>{const e=$(p+"fB"+i);const f=F.disc&&i===2?0:S.flows[i];if(e){e.style.strokeDashoffset=S.off*(f/r[1]);e.style.opacity=on&&f>20?0.85:0;e.setAttribute("stroke",acol(S.Treg[i]??S.Tsup))}
   txt(p+"rT"+i,`${S.T[i].toFixed(1)}°F`);txt(p+"rQ"+i,on?`${f0(f)} CFM`:"0 CFM");at(p+"rQ"+i,"fill",on&&Math.abs(f-r[1])>0.25*r[1]?"var(--bad)":"var(--ink)");
   const dev=S.T[i]-V.set;at(p+"rm"+i,"fill",dev>0?"var(--hot)":"var(--cold)");at(p+"rm"+i,"opacity",clamp(Math.abs(dev)/12,0,0.35).toFixed(2));
   let d=V["d"+i]/100;at(p+"dmp"+i,"transform",`rotate(${(90*(1-d)).toFixed(0)} ${[112,200,312,420][i]} 108)`);
   at(p+"reg"+i,"opacity",F.closedRegs&&(i===2||i===3)?0.85:0)});
  at(p+"crush","opacity",F.crushed?1:0);at(p+"disc","opacity",F.disc?1:0);at(p+"leakS","opacity",F.supplyLeak&&on?(blink(500)?1:.5):0);at(p+"leakR","opacity",F.returnLeak&&on?(blink(600)?1:.5):0);
  at(p+"rblock","opacity",F.returnBlock?0.9:0);at(p+"rblockT","opacity",F.returnBlock?1:0);
  at(p+"dirt","opacity",F.filterDirty?0.55:0);at(p+"cdirt","opacity",F.coilDirty?0.6:0);at(p+"wdirt","opacity",F.wheelDirty?0.35:0);
  at(p+"ice","opacity",S.ice.toFixed(2));at(p+"drip","opacity",S.wet&&on?(blink(700)?1:0):0);at(p+"flame","opacity",S.fire?1:0);
  if(on)S.ang=(S.ang+dt*S.rpm*0.6)%360;at(p+"blades","transform",`rotate(${S.ang.toFixed(1)} 235 432)`);
  const pf=v=>(v>=0?"+":"")+v.toFixed(2);
  ["pv1","pv2","pv3","pv4"].forEach((k,i)=>txt(p+k,on?pf(S.p[i]):"0.00"));txt(p+"mano",on?S.tesp.toFixed(2):"0.00");
  txt(p+"tstatTxt",String(V.set));at(p+"tstatLamp","fill",S.calling?(S.mode==="cool"?"var(--cold)":"#e0662a"):"var(--lamp-off)");
  const Tatt=V.out>=70?V.out+25:V.out+5;txt(p+"atticTxt",`${f0(Tatt)}°F`);txt(p+"outTxt",`${V.out}°F, dew ${Math.min(V.dew,V.out)}°F`);
  const wbR=PSY.wb(S.Tret,S.Wret),wbS=PSY.wb(S.Tsup,S.Wsup);
  txt(p+"r1",`RET ${S.Tret.toFixed(1)}°F ${wbR.toFixed(1)}WB ${f0(PSY.rh(S.Tret,S.Wret)*100)}%`);
  txt(p+"r2",on?`SUP ${S.Tsup.toFixed(1)}°F ${wbS.toFixed(1)}WB  Δ${(S.Tsup-S.Tret>=0?"+":"")+(S.Tsup-S.Tret).toFixed(1)}`:"SUP --");
  txt(p+"r3",on?`${f0(S.q)} CFM`+(S.comp?` ${f0(S.q/3)}/ton`:"")+(S.motor==="ecm"&&S.tgt?` tgt ${f0(S.tgt)}`:""):"BLOWER OFF");
  txt(p+"r4",S.comp?`SENS ${(S.sens/1000).toFixed(1)}k LAT ${(S.lat/1000).toFixed(1)}k`:S.fire?`HEAT ${(S.heatOut/1000).toFixed(1)}k Btu/h`:"");
  txt(p+"r5",on?`${f0(S.rpm)} rpm ${f0(S.watts)} W ${S.motor.toUpperCase()}`:"");
  txt(p+"r6",S.comp&&S.Te!=null?`COIL ${f0(S.Te)}°F${S.ice>0.05?" ICE "+f0(S.ice*100)+"%":""}`:S.fire?`RISE ${f0(S.Tsup-S.Tret)}°F (35-65)`:"");
  // fan chart
  const s0=AFAN.s0*(F.wheelDirty?0.62:1),r=Math.max(S.r,0.01),pts=[];
  for(let q=0;q<=2000;q+=50){const sp=r*r*s0-AFAN.b*q*q;if(sp<0)break;pts.push(`${fcX(q).toFixed(1)},${fcY(Math.min(1.4,sp)).toFixed(1)}`)}
  at(p+"fanCurve","points",on?pts.join(" "):"");
  const sp=[];for(let q=0;q<=2000;q+=50){const s=S.K*q*q;if(s>1.4)break;sp.push(`${fcX(q).toFixed(1)},${fcY(s).toFixed(1)}`)}at(p+"sysCurve","points",sp.join(" "));
  at(p+"opPt","cx",fcX(on?S.q:0).toFixed(1));at(p+"opPt","cy",fcY(on?Math.min(1.4,S.tesp):0).toFixed(1));at(p+"opPt","opacity",on?1:0);
  txt(p+"opTxt",on?`${f0(S.q)} CFM at ${S.tesp.toFixed(2)}"`:"blower off");
  // psych chart
  const pt=(id,T,W)=>{at(p+id,"cx",pcX(clamp(T,PC.tmin,PC.tmax)).toFixed(1));at(p+id,"cy",pcY(clamp(W,0,PC.wmax)).toFixed(1))};
  pt("pRet",S.Tret,S.Wret);pt("pSup",S.Tsup,S.Wsup);pt("pOut",V.out,PSY.Ws(Math.min(V.dew,V.out)));
  at(p+"pSup","opacity",on?1:0);at(p+"pLine","opacity",on?1:0);
  at(p+"pLine","x1",pcX(S.Tret).toFixed(1));at(p+"pLine","y1",pcY(S.Wret).toFixed(1));at(p+"pLine","x2",pcX(clamp(S.Tsup,PC.tmin,PC.tmax)).toFixed(1));at(p+"pLine","y2",pcY(S.Wsup).toFixed(1));
  const ad=S.comp&&S.Te!=null;at(p+"pAdp","opacity",ad&&on?1:0);if(ad){at(p+"pAdp","x1",pcX(S.Tsup).toFixed(1));at(p+"pAdp","y1",pcY(S.Wsup).toFixed(1));at(p+"pAdp","x2",pcX(clamp(S.adp,PC.tmin,PC.tmax)).toFixed(1));at(p+"pAdp","y2",pcY(PSY.Ws(S.adp)).toFixed(1))}
  const tp=(id,T,W,dx)=>{at(p+id,"x",(pcX(clamp(T,PC.tmin,PC.tmax))+dx).toFixed(1));at(p+id,"y",(pcY(clamp(W,0,PC.wmax))-6).toFixed(1))};
  tp("pRetT",S.Tret,S.Wret,6);txt(p+"pRetT",`return ${f0(S.Wret*7000)} gr`);at(p+"pSupT","x",(pcX(clamp(S.Tsup,PC.tmin,PC.tmax))-(S.fire?60:62)).toFixed(1));at(p+"pSupT","y",(pcY(clamp(S.Wsup,0,PC.wmax))+(S.fire?16:-6)).toFixed(1));txt(p+"pSupT",on?`supply ${f0(S.Wsup*7000)} gr`:"");
  tp("pOutT",V.out,PSY.Ws(Math.min(V.dew,V.out)),5);
  document.querySelectorAll("#svg .lbl,#svg .lblS").forEach(e=>e.style.opacity=S.labels===false?0:1);
 },
 boom(){return{t:"",b:"",wreck:0}}};
AIR.lampOn=S=>({call:S.calling,fan:S.blowerOn,cool:S.comp,heat:S.fire,ice:S.ice>0.05,hs:S.blowerOn&&S.tesp>0.5,lim:S.lim});
AIR.PSY=PSY;
