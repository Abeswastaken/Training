/* ============ COMBUSTION AND GAS: gas supply piping + meter, atmospheric burner + combustion analysis ============ */
SRC.ifgc=["IFGC 402.4 (Seattle Fuel Gas Code ch. 4): low-pressure sizing equation, Cr 0.6094 natural gas / 1.2462 propane, Table 402.4(2) Schedule 40 capacities","https://www.seattle.gov/documents/departments/sdci/codes/fuelgascode/2012sfgcchapter4.pdf"];
SRC.orif=["BC Plumbing textbook: orifice capacity table (CFH, orifice factor 0.90; #44 = 20.94 CFH natural gas at 3.5 in. w.c.)","https://opentextbc.ca/plumbing3e/back-matter/imperial-orifice-capacity-table-flow-values-in-cfh/"];
SRC.clock=["IBC boiler manual: clocking the meter, CFH = 3600 × dial size ÷ seconds; × heating value = input","https://www.manualslib.com/manual/2056350/Ibc-Sfc-199.html?page=6"];
SRC.gasfund=["Natural gas and propane fundamentals: heating value, specific gravity, air per cubic foot, manifold and inlet pressures, flame problems","https://open-exam-prep.com/study-guides/nc-hvac-contractor/forced-air-heating-and-furnaces/gas-combustion-fundamentals"];
SRC.canal=["Service guide: combustion analysis on gas appliances (O2 6–9%, CO2 max 11.7%, CO air-free = CO × 20.9 ÷ (20.9 − O2), 400 ppm ANSI Z21.47)","https://servicemag.org/guides/combustion-analysis-gas-appliances"];
SRC.testo=["Testo 300 manual: flue gas loss qA = (FT − AT) × (A2 ÷ (21 − O2) + B); natural gas A2 0.66 B 0.009, propane 0.63 / 0.008","https://www.manualslib.com/manual/1286672/Testo-300-Xxl.html?page=77"];
SRC.caz=["Vermont RBES Appendix RA: CAZ depressurization limits (−2 Pa atmospheric water heater, −3 Pa common-vented, −5 Pa furnace alone), spillage over 60 s fails, CO action levels","https://www.efficiencyvermont.com/Media/Default/docs/trade-partners/code-support/2020-RBES-Appendix-RA_CAZ.pdf"];
SRC.ul2034=["BRK: UL 2034 CO alarm response times (400 ppm in 4–15 min, 150 ppm in 10–50 min, 70 ppm in 60–240 min)","https://www.brkelectronics.com/blogs/installer-corner/what-levels-of-co-cause-an-alarm"];
SRC.carrierOr=["Carrier 58MXA manual: orifice size and manifold pressure for correct input (20,000 Btu/h per burner, #43–#44 at about 3.5 in. w.c.)","https://www.manualslib.com/manual/1196140/Carrier-58mxa.html?page=34"];

PHOTOS.gas={meter:[gimg("residential gas meter test dial")],sreg:[gimg("gas service regulator residential meter")],tank:[gimg("propane tank second stage regulator")],main:[gimg("black iron gas pipe basement")],
 cock:[gimg("gas appliance shutoff valve quarter turn")],drip:[gimg("gas sediment trap drip leg furnace")],furn:[gimg("furnace gas valve inlet pressure tap manometer")],wh:[gimg("gas water heater tank")],tl:[gimg("tankless water heater gas line 3/4")],
 dryer:[gimg("gas dryer connector")],range:[gimg("gas range CSST connector")],mano:[gimg("digital manometer gas pressure")]};
PHOTOS.burn={burners:[gimg("atmospheric gas burner ribbon burner flames")],orifs:[gimg("gas furnace manifold orifices spuds")],shutter:[gimg("primary air shutter gas burner")],gv:[gimg("gas valve manifold pressure tap")],
 hx:[gimg("atmospheric furnace heat exchanger clamshell")],hood:[gimg("draft hood water heater furnace")],conn:[gimg("vent connector chimney thimble")],chim:[gimg("masonry chimney liner")],
 anal:[gimg("combustion analyzer furnace flue test")],cazm:[gimg("CAZ depressurization test manometer pascals")],coal:[gimg("carbon monoxide alarm")],fans:[gimg("kitchen range hood exhaust fan")],flame:[gimg("yellow tipping gas flame vs blue flame")],chart:[gimg("combustion chart O2 CO2 excess air")]};

const FUEL={ng:{n:"Natural gas",sg:0.60,cr:0.6094,air:9.53,co2:11.7,a2:0.66,b:0.009,hhv:0.903,mp:3.5,inlet:7},lp:{n:"Propane",sg:1.52,cr:1.2462,air:23.8,co2:13.7,a2:0.63,b:0.008,hhv:0.92,mp:10,inlet:11,hv:2516}};
const orQ=(dia,h,sg)=>1658.5*0.9*Math.PI*dia*dia/4*Math.sqrt(Math.max(0,h)/sg);    // CFH through a drilled orifice
const PIPE_ID={0.5:0.622,0.75:0.824,1:1.049,1.25:1.380};
const pipeDrop=(q,id,L,cr)=>q<=0?0:cr*L*Math.pow(q/(2313*Math.pow(id,2.623)),1/0.541);   // IFGC 402.4 low-pressure equation, in. w.c.
const nps=d=>({0.5:"½",0.75:"¾",1:"1",1.25:"1¼"}[d]||d)+"\"";

/* ---------------- GAS SUPPLY ---------------- */
// appliance: [key, label, Btu/h NG, branch size, branch ft, manifold NG, manifold LP, min inlet NG, min inlet LP]
const GAPP=[["furn","Furnace",80000,0.75,10,3.5,10,4.5,11],["wh","Water heater",40000,0.5,10,4,10,4.5,11],["dryer","Dryer",22000,0.5,15,3.5,10,4.5,11],["range","Range (all burners)",65000,0.5,25,4,10,5,11]];
const GLAMP=[["flow","Gas flowing","g"],["leak","Meter moving, all off","r"],["low","Low inlet","a"],["hi","Static over 14\"","r"],["out","Appliance out","r"]];
function gSvg(p){
 const pipe=(d,w=7)=>`<path d="${d}" fill="none" stroke="#1d2125" stroke-width="${w+2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="url(#zSteel)" stroke-width="${w}" stroke-linejoin="round"/>`;
 const X=[220,370,510,650];
 return `
<line x1="10" y1="462" x2="790" y2="462" stroke="var(--line)" stroke-dasharray="2 4"/>
<rect x="128" y="120" width="10" height="342" fill="url(#zBrick)" stroke="#6b3a2a"/><text class="lblS" x="60" y="112" text-anchor="middle">Outside</text><text class="lblS" x="146" y="132">Basement</text>
<!-- meter set (natural gas) -->
<g id="${p}ngSet">
<g class="part" data-p="sreg" tabindex="0">${pipe("M70 470 V420",8)}<ellipse class="hl" cx="70" cy="150" rx="26" ry="16" fill="url(#zSteelH)" stroke="#4d555a"/><rect x="62" y="160" width="16" height="12" fill="url(#zSteel)"/><path d="M96 150 h10 v-6" stroke="#4d555a" stroke-width="4" fill="none"/>
 <text class="cht" x="70" y="132" text-anchor="middle">service regulator</text><text class="val" id="${p}sregTxt" x="70" y="154" text-anchor="middle" font-size="10">7.0"</text></g>
<g class="part" data-p="meter" tabindex="0">${pipe("M70 172 V196",8)}${pipe("M70 300 V420 M70 420 H96",8)}
 <rect class="hl" x="26" y="196" width="88" height="104" rx="8" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.4"/>
 <rect x="34" y="206" width="72" height="54" rx="4" fill="#f4f4ee" stroke="#777"/>
 ${[0,1,2,3].map(i=>`<circle cx="${44+i*17}" cy="220" r="7" fill="#fff" stroke="#555"/><line x1="${44+i*17}" y1="220" x2="${44+i*17}" y2="214" stroke="#222" stroke-width="1.2"/>`).join("")}
 <circle cx="58" cy="244" r="11" fill="#fff" stroke="#c0281c" stroke-width="1.5"/><line id="${p}test" x1="58" y1="244" x2="58" y2="234" stroke="#c0281c" stroke-width="1.8"/><text class="cht" x="58" y="259" text-anchor="middle" style="fill:#c0281c">2 ft³</text>
 <circle cx="88" cy="244" r="7" fill="#fff" stroke="#c0281c"/><line id="${p}test2" x1="88" y1="244" x2="88" y2="238" stroke="#c0281c" stroke-width="1.4"/><text class="cht" x="88" y="259" text-anchor="middle" style="fill:#c0281c">½</text>
 <text class="val" id="${p}secTxt" x="70" y="286" text-anchor="middle" font-size="10">--</text></g>
</g>
<!-- propane tank -->
<g id="${p}lpSet" opacity="0"><g class="part" data-p="tank" tabindex="0"><rect class="hl" x="12" y="330" width="110" height="60" rx="30" fill="#e8e8e2" stroke="#666"/><rect x="58" y="318" width="18" height="14" fill="url(#zBrass)"/>
 <text class="cht onm" x="67" y="364" text-anchor="middle">PROPANE</text><circle cx="70" cy="200" r="16" fill="url(#zSteelH)" stroke="#4d555a"/><text class="cht" x="70" y="178" text-anchor="middle">2nd-stage regulator</text>
 <text class="val" id="${p}lpTxt" x="70" y="204" text-anchor="middle" font-size="10">11"</text>${pipe("M67 318 V216",6)}</g></g>
<!-- main and branches -->
<g class="part" data-p="main" tabindex="0">${pipe("M96 420 H150 V240 H690",9)}<path class="hl" d="M96 420 H150 V240 H690" fill="none" stroke="transparent" stroke-width="12"/></g>
<text class="cht" id="${p}mainTxt" x="420" y="232" text-anchor="middle">main</text>
<g id="${p}leakG" opacity="0"><g class="puff"><circle cx="170" cy="236" r="4" fill="#d9e6c8"/><circle cx="176" cy="229" r="3" fill="#d9e6c8"/></g></g>
<g id="${p}bub" opacity="0">${[0,1,2,3].map(i=>`<circle cx="${164+i*4}" cy="${246+(i%2)*4}" r="2.4" fill="#fff" stroke="#7aa0c8"/>`).join("")}<text class="cht" x="186" y="256" style="fill:var(--bad)">bubbles</text></g>
${GAPP.map((a,i)=>{const x=X[i];return `
 <g class="part" data-p="cock" tabindex="0">${pipe(`M${x} 240 V300`,6)}<rect class="hl" x="${x-7}" y="270" width="14" height="10" rx="2" fill="url(#zBrass)" stroke="#6b5200"/><rect id="${p}cockH${i}" x="${x-10}" y="266" width="20" height="4" fill="#d23a26"/></g>
 <g class="part" data-p="drip" tabindex="0">${pipe(`M${x} 300 V346`,6)}<rect class="hl" x="${x-5}" y="340" width="10" height="12" fill="url(#zSteel)" stroke="#333"/>${pipe(`M${x} 312 H${x+30}`,6)}</g>
 <text class="cht" x="${x+4}" y="${296}">${nps(a[3])} ${a[4]} ft</text>`}).join("")}
<path id="${p}kink" d="M670 312 q4 -6 8 0" stroke="#c0281c" stroke-width="3" fill="none" opacity="0"/>
<!-- appliances -->
<g class="part" data-p="furn" tabindex="0">${zShade(285,454,40,4)}<rect class="hl" x="250" y="300" width="70" height="150" rx="3" fill="url(#zCab)" stroke="#4d555a" filter="url(#zShadow)"/>${[0,1,2,3].map(k=>`<rect x="262" y="${414+k*8}" width="46" height="3" rx="1" fill="#8f979d"/>`).join("")}<rect x="236" y="324" width="16" height="14" rx="2" fill="url(#zPlasticDk)" stroke="#222"/><circle cx="244" cy="331" r="2" fill="#ffd34d"/><rect x="258" y="320" width="54" height="30" fill="url(#zInside)"/>
 <g id="${p}flF" opacity="0">${[0,1,2].map(k=>`<path d="M${266+k*16} 346 q4 -12 8 0 z" fill="url(#zFlame)"/>`).join("")}</g><rect x="262" y="306" width="22" height="12" rx="2" fill="#2a2f33"/><text class="cht onm" x="285" y="372" text-anchor="middle">FURNACE</text></g>
<g class="part" data-p="wh" tabindex="0"><g id="${p}whTank">${zShade(426,454,32,4)}<rect x="420" y="286" width="12" height="16" fill="url(#zSteel)" stroke="#555"/><path d="M412 286 h28 l-4 -8 h-20 z" fill="url(#zSteel)" stroke="#555"/><rect class="hl" x="398" y="300" width="56" height="150" rx="22" fill="url(#zSteelH)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="452" y="318" width="10" height="6" fill="url(#zBrass)" stroke="#6b5200"/><rect x="414" y="426" width="24" height="18" rx="2" fill="#2a2f33"/><text class="cht onm" x="426" y="380" text-anchor="middle">WATER</text><text class="cht onm" x="426" y="390" text-anchor="middle">HEATER</text>
 <g id="${p}flW" opacity="0"><path d="M416 440 q4 -10 8 0 z M428 440 q4 -12 8 0 z" fill="url(#zFlame)"/></g></g></g>
<g class="part" data-p="tl" tabindex="0"><g id="${p}whTl" opacity="0"><rect class="hl" x="398" y="300" width="56" height="86" rx="4" fill="#f2f2ee" stroke="#5f686d"/><rect x="408" y="312" width="36" height="16" rx="2" fill="url(#zLcd)"/><text id="${p}tlCode" x="426" y="324" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="#1f2a22">120°</text><text class="cht onm" x="426" y="350" text-anchor="middle">TANKLESS</text><text class="cht" x="426" y="360" text-anchor="middle">199k</text></g></g>
<g class="part" data-p="dryer" tabindex="0">${zShade(572,454,36,4)}<rect class="hl" x="540" y="356" width="64" height="94" rx="4" fill="#eceee8" stroke="#5f686d" filter="url(#zShadow)"/><rect x="540" y="356" width="64" height="10" rx="3" fill="#cfd6da"/><circle cx="572" cy="404" r="24" fill="#b9c1c6" stroke="#5f686d"/><circle cx="572" cy="404" r="18" fill="#2f3a42" opacity=".85"/><circle cx="566" cy="398" r="5" fill="#fff" opacity=".18"/><text class="cht onm" x="572" y="372" text-anchor="middle">DRYER</text></g>
<g class="part" data-p="range" tabindex="0">${zShade(720,454,44,4)}<rect class="hl" x="680" y="350" width="80" height="100" rx="3" fill="#eceee8" stroke="#5f686d" filter="url(#zShadow)"/>${[0,1,2,3].map(k=>`<circle cx="${694+k*17}" cy="362" r="3.2" fill="#2a2f33"/>`).join("")}<rect x="684" y="344" width="72" height="8" fill="#2a2f33"/>
 <g id="${p}flR" opacity="0">${[0,1,2,3].map(k=>`<ellipse cx="${694+k*17}" cy="343" rx="6" ry="2.4" fill="none" stroke="#3d7de0" stroke-width="2"/>`).join("")}</g><rect x="690" y="372" width="60" height="50" rx="2" fill="#2a2f33"/><rect x="694" y="376" width="52" height="30" rx="2" fill="#4a3a2a" opacity=".6"/><rect x="694" y="370" width="52" height="3" rx="1" fill="#9aa3aa"/><text class="cht onm" x="720" y="440" text-anchor="middle">RANGE</text></g>
${GAPP.map((a,i)=>`<text class="val" id="${p}in${i}" x="${[285,474,572,720][i]}" y="${[294,300,348,338][i]-0}" text-anchor="middle" font-size="10"></text>`).join("")}
<text class="cht" id="${p}mfTxt" x="285" y="400" text-anchor="middle" font-weight="600"></text>
<g class="part" data-p="mano" tabindex="0"><rect class="hl" x="170" y="380" width="62" height="40" rx="6" fill="#f2b632" stroke="#7a5600"/><rect x="176" y="386" width="50" height="16" rx="2" fill="url(#zLcd)"/><text id="${p}mano" x="201" y="398" text-anchor="middle" font-family="var(--mono)" font-size="10" fill="#1f2a22"></text><text class="cht" x="201" y="414" text-anchor="middle" style="fill:#3a2a00">furnace inlet</text></g>
<!-- summary panel -->
<rect x="200" y="20" width="586" height="94" rx="6" fill="#16201a" stroke="#0b0f0c"/>
${[0,1,2,3,4,5].map(i=>`<text id="${p}s${i}" x="${i<3?212:500}" y="${44+(i%3)*24}" font-family="var(--mono)" font-size="11" fill="#bfe8c4"></text>`).join("")}`}

const GAS={id:"gas",p:"g_",name:"Gas piping and meter",svg:gSvg("g_"),lamps:GLAMP,txvOnly:[],
 sliders:[
  {k:"msize",l:"Main pipe size",u:" in.",min:0.5,max:1.25,step:0.25,v:1,n:[0.75,1.25],note:"Schedule 40 black iron, nominal size. The main carries every appliance at once."},
  {k:"mlen",l:"Main length (meter to farthest tee)",u:" ft",min:10,max:100,step:5,v:40,note:"Use the longest run for the whole system (longest-length method)."},
  {k:"hv",l:"Natural gas heating value",u:" Btu/ft³",min:950,max:1100,step:5,v:1030,n:[1000,1060],note:"Your utility publishes it. 1000 is the round number for practice."},
  {k:"sreg",l:"Service regulator outlet",u:"\" w.c.",min:4,max:9,step:0.5,v:7,n:[6.5,7.5],note:"Typical house delivery is 7\" w.c. natural gas, 11\" propane (second stage).",more:1}],
 faults:[["svcDroop","Service regulator worn (droops under load)"],["lockup","Service regulator won't lock up (static creeps high)"],["leak","Leak at a union in the basement"],["csst","CSST to the range kinked behind it"],
  ["cock","Furnace gas cock left partly closed"],["screen","Furnace gas valve inlet screen plugged"],["lpLow","Propane tank nearly empty on a cold day"]],
 hidden:[],
 scenarios:[{l:"New tankless water heater on the old ¾\" main and ½\" branch: everything starves",f:[],s:{tl:true,on:{furn:true,wh:true,dryer:true,range:true}},v:{msize:0.75},speed:10},
  {l:"Weak range flames, and everything sags when it all runs: kinked CSST plus a worn regulator",f:["svcDroop","csst"],s:{on:{furn:true,wh:true,dryer:true,range:true}},speed:10}],
 startMsg(){return `Gas piping started (${FUEL[this.S.fuel].n}). Furnace and water heater on.`},
 na(k){return this.S.fuel==="ng"?k==="lpLow":["svcDroop","lockup"].includes(k)},
 parts:{
  meter:{n:"Gas meter",s:"Measures the gas the house uses.",w:"A diaphragm meter. Residential meters are rated around 250 CFH at a 0.5\" w.c. drop. The red test dials turn one revolution per 2 ft³ and per ½ ft³.",
   y:"Clock it: with only one appliance firing, time one revolution of a test dial. CFH = 3600 × dial size ÷ seconds. Multiply by the heating value for Btu/h. Above about 4,500 ft, many manufacturers derate about 2% per 1,000 ft.",
   f:"A test dial moving with every appliance off means a leak downstream (or a pilot still burning). A meter too small for added appliances drops pressure at peak demand.",src:["clock"],faults:["leak"]},
  sreg:{n:"Service regulator",s:"Drops street pressure to house pressure.",w:"A spring-and-diaphragm regulator at the meter, vented to outdoors. Typical outlet 7\" w.c. (about ¼ psi).",
   y:"It holds its outlet steady as flow changes, and closes tight (locks up) when nothing is flowing.",f:"Worn: outlet sags at high flow. Not locking up: with no flow the outlet creeps toward street pressure; appliance regulators are rated for only about ½ psi (14\" w.c.).",src:["gasfund"],faults:["svcDroop","lockup"]},
  tank:{n:"Propane tank and regulator",s:"Two-stage propane supply.",w:"First stage at the tank drops tank pressure to about 10 psi; second stage at the house drops it to 11\" w.c.",y:"Propane carries about 2,500 Btu/ft³, 2.5 times natural gas, so the same input needs much less gas flow.",f:"A nearly empty tank on a cold day can't boil enough liquid: pressure sags under load.",src:["gasfund"],faults:["lpLow"]},
  main:{n:"Main gas line",s:"Black iron from the meter to the appliance branches.",w:"Sized with the IFGC tables or equation for the total load and the longest length, usually for a 0.5\" w.c. drop at 7\" supply.",
   y:"Pressure drop rises about with flow to the 1.85 power: double the load and the drop is about 3.6 times. A 1\" main 40 ft long carries about 330 CFH at a 0.5\" drop.",f:"Undersized for added appliances: everything works alone, but appliances starve when they run together.",src:["ifgc"],faults:["leak"]},
  cock:{n:"Appliance shutoff valves",s:"Quarter-turn valve on each branch.",w:"Handle in line with the pipe is open.",y:"Required within 6 ft of each appliance.",f:"Left partly closed after service: the appliance's inlet pressure drops when it fires (static looks fine).",src:["gasfund"],faults:["cock"]},
  drip:{n:"Sediment traps",s:"Tee with a capped nipple below the appliance branch.",w:"Catches scale, water and debris before the gas valve.",y:"Required at furnaces and water heaters (not usually at ranges or dryers).",f:"Without one, debris plugs the gas valve's inlet screen.",src:["gasfund"],faults:["screen"]},
  furn:{n:"Furnace gas valve",s:"80,000 Btu/h furnace.",w:"Combination gas valve with its own regulator (3.5\" w.c. natural gas, 10\" propane) and inlet and outlet pressure taps.",
   y:"Needs about 4.5–5\" w.c. at the inlet while firing (check the rating plate) for a natural gas valve to hold 3.5\" out. Below that, manifold pressure follows the inlet down and input falls with the square root of pressure.",
   f:"Low inlet only while firing: undersized or restricted piping, a partly closed cock, or a drooping regulator. Inlet fine but manifold low: plugged inlet screen or a bad valve.",src:["gasfund","orif"],faults:["cock","screen"]},
  wh:{n:"Tank water heater",s:"40,000 Btu/h atmospheric.",w:"",y:"A modest load that most ½\" branches handle.",f:"",src:["gasfund"],faults:[]},
  tl:{n:"Tankless water heater",s:"199,000 Btu/h on demand.",w:"Usually needs ¾\" gas line and at least 5\" w.c. inlet while firing on natural gas.",y:"It is the biggest load in many houses. Putting one on the old tank heater's ½\" branch is the classic tankless problem.",f:"Low gas pressure: it limits its firing rate or shows a low-gas or ignition error.",src:["ifgc"],faults:[]},
  dryer:{n:"Gas dryer",s:"About 22,000 Btu/h.",w:"",y:"",f:"",src:[],faults:[]},
  range:{n:"Range",s:"About 65,000 Btu/h with every burner and the oven on.",w:"Connected with an appliance connector or CSST.",y:"",f:"A kinked connector behind the range starves it, and only shows up when it's pulling a big load.",src:["ifgc"],faults:["csst"]},
  mano:{n:"Manometer",s:"Reads gas pressure in inches of water column.",w:"Connected to the furnace gas valve's inlet tap. 27.7\" w.c. = 1 psi.",y:"Read static (nothing firing) and dynamic (everything that normally runs together firing). Static minus dynamic shows how much the piping drops.",f:"",src:["gasfund"],faults:[]}},
 init(){return {t:0,dead:null,fuel:"ng",tl:false,labels:true,on:{furn:true,wh:true,dryer:false,range:false},q:{},pin:{},pm:0,inp:{},sup:7,qtot:0,dMain:0,ang:0,ang2:0,static:7,soap:0,logs2:{}}},
 switches:[
  {l:S=>`Fuel: ${FUEL[S.fuel].n}`,on:S=>S.fuel==="lp",act(sim){sim.S.fuel=sim.S.fuel==="ng"?"lp":"ng";log(sim,sim.S.fuel==="lp"?"Propane: tank and two-stage regulators, 11\" w.c. to the house, appliances converted (10\" manifold).":"Natural gas: meter and service regulator, 7\" w.c. to the house.");if(typeof syncFaults==="function")syncFaults()}},
  {l:S=>`Furnace: ${S.on.furn?"firing":"off"}`,on:S=>S.on.furn,act(sim){sim.S.on.furn=!sim.S.on.furn}},
  {l:S=>`Water heater: ${S.on.wh?"firing":"off"}`,on:S=>S.on.wh,act(sim){sim.S.on.wh=!sim.S.on.wh}},
  {l:S=>`Dryer: ${S.on.dryer?"on":"off"}`,on:S=>S.on.dryer,act(sim){sim.S.on.dryer=!sim.S.on.dryer}},
  {l:S=>`Range: ${S.on.range?"all burners":"off"}`,on:S=>S.on.range,act(sim){sim.S.on.range=!sim.S.on.range}},
  {l:S=>`Water heater type: ${S.tl?"tankless 199k":"tank 40k"}`,on:S=>S.tl,act(sim){sim.S.tl=!sim.S.tl;log(sim,sim.S.tl?"Swapped in a 199,000 Btu/h tankless on the same ½\" branch.":"Back to the 40,000 Btu/h tank heater.")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[{id:"clockM",l:"Clock the meter",show:S=>S.fuel==="ng",act(sim){const S=sim.S;if(S.qtot<0.5){log(sim,"The test dial isn't moving. Nothing is burning.");return}const sec=7200/S.qtot;
   log(sim,`2 ft³ test dial: one revolution in ${sec.toFixed(1)} s. CFH = 3600 × 2 ÷ ${sec.toFixed(1)} = ${f0(S.qtot)} CFH. × ${sim.V.hv} = ${f0(S.qtot*sim.V.hv/1000)},000 Btu/h.`+(Object.values(S.on).filter(Boolean).length>1?" (More than one appliance is on: turn the others off to clock just one.)":""),"b")}},
  {id:"soap",l:"Soap-test the fittings",show:S=>true,act(sim){sim.S.soap=20;log(sim,sim.F.leak?"Bubbles growing at the union just inside the wall. Found the leak.":"No bubbles at any fitting you can reach.",sim.F.leak?"w":"")}},
  {id:"static",l:"Read static pressure (all off)",show:S=>true,act(sim){const S=sim.S;log(sim,`Static pressure at the furnace inlet with everything off: ${S.static.toFixed(1)}" w.c.`+(S.static>14?" Over ½ psi: the appliance regulators can be damaged.":""),S.static>14?"w":"")}}],
 resets(S){return []},
 reads(S){const f=FUEL[S.fuel];return [["Total",`${f0(S.qtot)} CFH`],["Supply",`${S.sup.toFixed(1)}"`],["Furnace inlet",S.on.furn?`${(S.pin.furn||0).toFixed(1)}"`:`${S.static.toFixed(1)}" static`],["Manifold",S.on.furn?`${S.pm.toFixed(1)}"`:"—"],["Furnace input",S.on.furn?`${f0((S.inp.furn||0)/1000)}k`:"off"]]},
 stText(S){return Object.values(S.on).some(Boolean)?"flowing":"no load"},
 step(dt){const S=this.S;let r=dt;while(r>1e-9){const h=Math.min(0.5,r);this.sub(h);r-=h}},
 solve(on){const S=this.S,F=this.F,V=this.V,fu=FUEL[S.fuel],hv=S.fuel==="ng"?V.hv:fu.hv,ng=S.fuel==="ng";
  const apps=GAPP.map(a=>a.slice());if(S.tl){apps[1][2]=199000;apps[1][7]=5;apps[1][8]=8}
  let pin={},q={},pm={};apps.forEach(a=>{pin[a[0]]=ng?V.sreg:11.6;q[a[0]]=0});let sup=ng?V.sreg:11.6,qt=0,dMain=0;
  for(let it=0;it<8;it++){
   apps.forEach(a=>{const k=a[0];if(!on[k]){q[k]=0;return}const mset=ng?a[5]:a[6];let pIn=pin[k];if(k==="furn"&&F.screen)pIn=pIn-3.2*Math.pow((q[k]||1)/(80000/hv),2);
    const m=Math.max(0,Math.min(mset,pIn-0.7));pm[k]=m;q[k]=a[2]/hv*Math.sqrt(m/mset)*(m<1.2?0:1)});
   qt=Object.values(q).reduce((s,x)=>s+x,0)+(F.leak?15:0);
   // supply pressure: regulator droop, meter drop (natural gas) or tank sag (propane)
   if(ng){sup=V.sreg-0.25*qt/250-(F.svcDroop?2.6*Math.pow(qt/250,1.5):0)-0.5*Math.pow(qt/250,2)}
   else sup=11.6-0.25*qt/100-(F.lpLow?4.5*Math.pow(qt/120,1.3):0);
   dMain=pipeDrop(qt,PIPE_ID[V.msize]||1.049,V.mlen,fu.cr);
   apps.forEach((a,i)=>{const k=a[0];let id=PIPE_ID[a[3]],L=a[4];if(k==="range"&&F.csst)id*=0.55;let d=pipeDrop(q[k],id,L,fu.cr);if(k==="furn"&&F.cock)d+=4.0*Math.pow(q[k]/(80000/hv),2);pin[k]=Math.max(0,sup-dMain-d)})}
  return {apps,pin,q,pm,qt,sup,dMain,hv}},
 sub(dt){const sim=this,S=this.S,F=this.F,V=this.V,ng=S.fuel==="ng";S.t+=dt;
  const r=this.solve(S.on);S.pin=r.pin;S.q=r.q;S.qtot=r.qt;S.sup=r.sup;S.dMain=r.dMain;S.pm=r.pm.furn||0;S.apps=r.apps;
  S.inp={};r.apps.forEach(a=>S.inp[a[0]]=r.q[a[0]]*r.hv);
  // static pressure (nothing flowing): lockup failure lets it creep up toward street pressure
  const anyOn=Object.values(S.on).some(Boolean);
  if(!anyOn&&ng&&F.lockup)S.creep=Math.min(1,(S.creep||0)+dt/300);else S.creep=Math.max(0,(S.creep||0)-dt/20);
  S.static=(ng?V.sreg+(F.lockup?11*S.creep:0):11.8)-(F.leak?0.1:0);
  if(S.creep>0.6&&!S.logs2.lock){S.logs2.lock=1;log(sim,`Static pressure has crept to ${S.static.toFixed(1)}" w.c. with nothing running. The service regulator isn't locking up.`,"w")}if(S.creep<0.2)S.logs2.lock=0;
  S.ang=(S.ang+dt*360*S.qtot/7200)%360;S.ang2=(S.ang2+dt*360*S.qtot/1800)%360;S.soap=Math.max(0,S.soap-dt);
  r.apps.forEach(a=>{const k=a[0];if(!S.on[k])return;const mset=ng?a[5]:a[6],minIn=ng?a[7]:a[8],low=S.pin[k]<minIn-0.05;
   const key="low"+k;if(low&&!S.logs2[key]){S.logs2[key]=1;log(sim,`${k==="wh"&&S.tl?"Tankless":a[1]} inlet ${S.pin[k].toFixed(1)}" w.c. while firing, under its ${minIn}" minimum.${S.inp[k]<0.5?" It can't light.":` Running at ${f0(100*S.inp[k]/a[2])}% of rated input.`}`,"w")}if(!low)S.logs2[key]=0});
 },
 draw(dt){const S=this.S,F=this.F,V=this.V,p="g_",ng=S.fuel==="ng";
  at(p+"ngSet","opacity",ng?1:0);at(p+"lpSet","opacity",ng?0:1);
  at(p+"test","transform",`rotate(${S.ang.toFixed(1)} 58 244)`);at(p+"test2","transform",`rotate(${S.ang2.toFixed(1)} 88 244)`);
  txt(p+"secTxt",S.qtot>0.5?`${(7200/S.qtot).toFixed(1)} s/rev`:"stopped");txt(p+"sregTxt",`${S.sup.toFixed(1)}"`);txt(p+"lpTxt",`${S.sup.toFixed(1)}"`);
  txt(p+"mainTxt",`${nps(V.msize)} main, ${V.mlen} ft, drop ${S.dMain.toFixed(2)}"`);at(p+"mainTxt","fill",S.dMain>0.5?"var(--bad)":"var(--muted)");
  at(p+"leakG","opacity",F.leak&&S.qtot>0?(blink(600)?1:.4):0);at(p+"bub","opacity",S.soap>0&&F.leak?1:0);at(p+"kink","opacity",F.csst?1:0);
  at(p+"cockH0","transform",F.cock?"rotate(50 220 268)":"");at(p+"whTank","opacity",S.tl?0:1);at(p+"whTl","opacity",S.tl?1:0);
  (S.apps||GAPP).forEach((a,i)=>{const k=a[0];const minIn=ng?a[7]:a[8];txt(p+"in"+i,S.on[k]?`in ${(S.pin[k]||0).toFixed(1)}"`:"off");at(p+"in"+i,"fill",S.on[k]&&S.pin[k]<minIn?"var(--bad)":"var(--ink)")});
  const fl=k=>S.on[k]&&(S.inp[k]||0)>1;at(p+"flF","opacity",fl("furn")?1:0);at(p+"flW","opacity",fl("wh")?1:0);at(p+"flR","opacity",fl("range")?1:0);
  txt(p+"tlCode",S.tl&&S.on.wh&&S.pin.wh<(ng?5:8)?(S.inp.wh>1?"LOW GAS":"E11"):"120°");
  txt(p+"mfTxt",S.on.furn?`manifold ${S.pm.toFixed(1)}"`:"");at(p+"mfTxt","fill",S.on.furn&&S.pm<(ng?3.3:9.5)?"#b3261e":"#2a3034");
  txt(p+"mano",S.on.furn?`${(S.pin.furn||0).toFixed(2)}`:`${S.static.toFixed(2)}`);
  const hv=ng?V.hv:FUEL.lp.hv;
  txt(p+"s0",`${FUEL[S.fuel].n}, ${hv} Btu/ft³`);txt(p+"s1",`Load ${f0(S.qtot)} CFH = ${f0(S.qtot*hv/1000)}k Btu/h`);txt(p+"s2",ng?(S.qtot>0.5?`Test dial 2 ft³: ${(7200/S.qtot).toFixed(1)} s/rev`:"Test dial stopped"):"No meter (propane)");
  txt(p+"s3",`Supply ${S.sup.toFixed(1)}"  Main drop ${S.dMain.toFixed(2)}"`);txt(p+"s4",`Furnace ${S.on.furn?`in ${(S.pin.furn||0).toFixed(1)}" mf ${S.pm.toFixed(1)}"`:"off"}`);
  txt(p+"s5",`Furnace input ${S.on.furn?f0((S.inp.furn||0)/1000)+"k / 80k":"--"}`);
  document.querySelectorAll("#svg .lbl,#svg .lblS").forEach(e=>e.style.opacity=S.labels===false?0:1)},
 boom(){return{t:"",b:"",wreck:0}}};
GAS.lampOn=S=>{const ng=S.fuel==="ng";return {flow:S.qtot>0.5,leak:!Object.values(S.on).some(Boolean)&&S.qtot>0.5,low:(S.apps||[]).some(a=>S.on[a[0]]&&S.pin[a[0]]<(ng?a[7]:a[8])),hi:S.static>14,out:(S.apps||[]).some(a=>S.on[a[0]]&&(S.inp[a[0]]||0)<1)}};

/* ---------------- BURNER AND COMBUSTION ANALYSIS ---------------- */
const BLAMP=[["fire","Burners lit","g"],["yellow","Yellow flame","a"],["lift","Lifting","a"],["spill","Spilling","r"],["co","CO over 100 ppm AF","r"],["alarm","CO alarm","r"],["roll","Rollout tripped","r"],["bv","Blocked-vent switch","r"]];
const BNOM=80000,ORF={ng:0.082,lp:0.052};        // #45 and #55 drills
function bSvg(p){
 const pipe=(d,w=7,c="url(#zSteel)")=>`<path d="${d}" fill="none" stroke="#1d2125" stroke-width="${w+2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`;
 const xs=[226,256,286,316];
 return `
<line x1="10" y1="462" x2="610" y2="462" stroke="var(--line)" stroke-dasharray="2 4"/>
<rect x="10" y="150" width="540" height="312" fill="url(#zCabIn)" fill-opacity=".18" stroke="#a89a85" stroke-width="2"/>
<text class="lblS" x="20" y="168">Basement (combustion appliance zone)</text>
<line x1="10" y1="150" x2="550" y2="150" stroke="#a89a85" stroke-width="4"/><text class="lblS" x="20" y="22">Upstairs</text>
<!-- exhaust fans -->
<g class="part" data-p="fans" tabindex="0">
 <rect class="hl" x="60" y="40" width="80" height="30" rx="3" fill="url(#zSteelH)" stroke="#4d555a"/><path d="M60 70 L46 96 H154 L140 70 Z" fill="url(#zSteel)" stroke="#4d555a"/><text class="cht" x="100" y="110" text-anchor="middle">kitchen hood 350 CFM</text>
 <circle cx="250" cy="60" r="18" fill="#eef" stroke="#556"/><g id="${p}bathB">${[0,1,2,3].map(i=>`<path d="M250 60 L${250+14*Math.cos(i*1.57)} ${60+14*Math.sin(i*1.57)}" stroke="#556" stroke-width="3"/>`).join("")}</g><text class="cht" x="250" y="92" text-anchor="middle">bath fan 80</text>
 <rect x="30" y="380" width="70" height="78" rx="4" fill="#eceee8" stroke="#5f686d"/><circle cx="65" cy="420" r="20" fill="#cfd6da" stroke="#5f686d"/><text class="cht" x="65" y="394" text-anchor="middle">DRYER 150</text>
 <g id="${p}kArrow" opacity="0"><path d="M100 36 V18" stroke="var(--cold)" stroke-width="3" marker-end="url(#zArrow)"/></g>
</g>
<g id="${p}fanOn">${["k","b","d"].map((k,i)=>`<circle id="${p}fl_${k}" cx="${[150,276,100][i]}" cy="${[46,48,388][i]}" r="4" fill="var(--lamp-off)"/>`).join("")}</g>
<!-- chimney -->
<g class="part" data-p="chim" tabindex="0"><rect class="hl" x="560" y="30" width="44" height="432" fill="url(#zBrick)" stroke="#6b3a2a"/><rect x="570" y="30" width="24" height="432" fill="#3a2f2a" opacity=".55"/><rect x="554" y="22" width="56" height="10" fill="#8a8f93"/>
 <g id="${p}nest" opacity="0"><ellipse cx="582" cy="40" rx="14" ry="7" fill="#7a5b3a"/><path d="M570 38 l24 4 M572 42 l20 -4" stroke="#4a3520" stroke-width="1.5"/></g>
 <rect id="${p}chimBlock" x="570" y="160" width="24" height="30" fill="#6b3a2a" opacity="0"/></g>
<path id="${p}vflow" d="M582 205 V30" fill="none" stroke="#e0662a" stroke-width="5" stroke-dasharray="5 9" opacity=".7"/>
<!-- vent connector + draft hood -->
<g class="part" data-p="conn" tabindex="0">${pipe("M286 214 V196 H560",14,"url(#zSteelH)")}<path class="hl" d="M286 214 V196 H560" fill="none" stroke="transparent" stroke-width="16"/></g>
<rect id="${p}gap" x="520" y="186" width="16" height="22" fill="var(--bg)" opacity="0"/><g id="${p}gapSp" opacity="0"><circle cx="528" cy="214" r="6" fill="#bbb"/><circle cx="522" cy="224" r="5" fill="#ccc"/><circle cx="532" cy="232" r="4" fill="#ddd"/></g>
<g class="part" data-p="hood" tabindex="0"><path class="hl" d="M246 240 L262 214 H310 L326 240 Z" fill="url(#zSteel)" stroke="#4d555a"/><rect x="240" y="240" width="92" height="6" fill="#4d555a"/></g>
<g class="part" data-p="bvss" tabindex="0"><rect class="hl" x="314" y="222" width="12" height="9" rx="2" fill="#c9ccce" stroke="#444"/><circle id="${p}bvL" cx="320" cy="226.5" r="2.4" fill="var(--ok)"/><path id="${p}bvJ" d="M326 226 q14 -14 4 -30" fill="none" stroke="#d33" stroke-width="1.6" opacity="0"/></g>
<g id="${p}dil">${[248,324].map(x=>`<path d="M${x} 262 Q${x<300?x+8:x-8} 250 ${x<300?x+16:x-16} 240" fill="none" stroke="var(--cold)" stroke-width="1.6" marker-end="url(#zArrow)"/>`).join("")}</g>
<g id="${p}spill" opacity="0">${[240,332].map(x=>`<g class="puff"><circle cx="${x}" cy="244" r="6" fill="#bbb" opacity=".8"/><circle cx="${x+(x<300?-8:8)}" cy="236" r="5" fill="#ccc" opacity=".7"/><circle cx="${x+(x<300?-14:14)}" cy="226" r="4" fill="#ddd" opacity=".6"/></g>`).join("")}</g>
<!-- furnace: heat exchanger and burners -->
<g class="part" data-p="hx" tabindex="0"><rect class="hl" x="206" y="262" width="160" height="124" rx="4" fill="url(#zCab)" stroke="#4d555a"/>
 ${xs.map(x=>`<path d="M${x-10} 380 C${x-14} 330 ${x-10} 300 ${x} 274 C${x+10} 300 ${x+14} 330 ${x+10} 380" fill="url(#zSteelH)" stroke="#5a6064"/>`).join("")}<rect x="212" y="262" width="148" height="10" fill="#4d555a"/>
 <rect id="${p}soot" x="212" y="272" width="148" height="100" fill="#222" opacity="0"/></g>
<circle cx="350" cy="267" r="3" fill="#ffd34d" stroke="#6b5200"/>
<g class="part" data-p="burners" tabindex="0"><rect class="hl" x="206" y="386" width="160" height="58" rx="3" fill="url(#zInside)" stroke="#4d555a"/>
 ${xs.map((x,i)=>`<rect x="${x-6}" y="404" width="12" height="34" rx="3" fill="url(#zSteel)" stroke="#555"/><g id="${p}fl${i}"><path id="${p}fo${i}" d="" fill="url(#zFlame)" opacity=".9"/><path id="${p}fi${i}" d="" fill="#9fd0ff" opacity=".9"/><path id="${p}fy${i}" d="" fill="#f2b632" opacity="0"/></g>`).join("")}
 <g id="${p}roll" opacity="0"><path d="M206 396 q-16 -10 -8 -30 q6 14 14 10 z" fill="#f2b632"/><path d="M366 396 q16 -10 8 -30 q-6 14 -14 10 z" fill="#f2b632"/></g></g>
<g class="part" data-p="orifs" tabindex="0">${pipe("M150 446 H340",8,"url(#zSteelH)")}${xs.map(x=>`<rect class="hl" x="${x-3}" y="438" width="6" height="6" fill="url(#zBrass)" stroke="#6b5200"/>`).join("")}</g>
<g class="part" data-p="shutter" tabindex="0">${xs.map(x=>`<rect class="hl" x="${x-7}" y="430" width="14" height="6" fill="#8a8f93" stroke="#444"/><rect id="${p}sh${xs.indexOf(x)}" x="${x-7}" y="430" width="7" height="6" fill="#2a2f33"/>`).join("")}</g>
<g class="part" data-p="gv" tabindex="0"><rect class="hl" x="134" y="430" width="30" height="28" rx="3" fill="url(#zPlasticDk)" stroke="#222"/><circle cx="149" cy="436" r="3" fill="#ffd34d"/>${pipe("M120 446 H134",6)}<text class="val" id="${p}mpTxt" x="149" y="422" text-anchor="middle" font-size="10">3.5"</text></g>
<!-- analyzer -->
<g class="part" data-p="anal" tabindex="0"><path d="M350 267 C400 250 400 300 410 300" fill="none" stroke="#2a2f33" stroke-width="2.5"/>
 <rect class="hl" x="404" y="268" width="138" height="150" rx="10" fill="#2b5fa8" stroke="#163a6a"/><rect x="412" y="278" width="122" height="118" rx="4" fill="url(#zLcd)" stroke="#6e7f71"/>
 ${[0,1,2,3,4,5,6,7].map(i=>`<text id="${p}a${i}" x="418" y="${292+i*13.6}" font-family="var(--mono)" font-size="10" fill="#1f2a22"></text>`).join("")}
 <text class="cht" x="473" y="410" text-anchor="middle" style="fill:#e8f0fa">COMBUSTION ANALYZER</text></g>
<!-- CAZ manometer and CO alarm -->
<g class="part" data-p="cazm" tabindex="0"><rect class="hl" x="30" y="270" width="92" height="56" rx="7" fill="#f2b632" stroke="#7a5600"/><rect x="38" y="278" width="76" height="22" rx="3" fill="url(#zLcd)" stroke="#6e7f71"/>
 <text id="${p}caz" x="76" y="294" text-anchor="middle" font-family="var(--mono)" font-size="13" fill="#1f2a22">0.0 Pa</text><text class="cht" x="76" y="316" text-anchor="middle" style="fill:#3a2a00">CAZ vs outdoors</text></g>
<g class="part" data-p="coal" tabindex="0"><rect class="hl" x="30" y="190" width="64" height="44" rx="8" fill="#f4f4ee" stroke="#777"/><rect x="38" y="196" width="48" height="16" rx="2" fill="url(#zLcd)"/><text id="${p}coTxt" x="62" y="208" text-anchor="middle" font-family="var(--mono)" font-size="10" fill="#1f2a22">0</text>
 <circle id="${p}coLed" cx="62" cy="224" r="4" fill="var(--lamp-off)"/><text class="cht" x="62" y="246" text-anchor="middle">CO alarm (ppm)</text></g>
<!-- flame close-up -->
<g class="part" data-p="flame" tabindex="0"><rect class="hl" x="620" y="18" width="174" height="200" rx="6" fill="#1a1d20" stroke="var(--panel-edge)"/><text class="lblS" x="628" y="34" style="fill:#c9d1d6">One burner, close up</text>
 <rect x="690" y="150" width="34" height="56" rx="4" fill="url(#zSteel)" stroke="#555"/><rect x="694" y="146" width="26" height="6" fill="#444"/>
 <path id="${p}bo" d="" fill="url(#zFlame)" opacity=".9"/><path id="${p}bi" d="" fill="#9fd0ff"/><path id="${p}by" d="" fill="#f2b632" opacity="0"/><path id="${p}bfb" d="M697 160 q10 -8 20 0 v20 h-20z" fill="#3d7de0" opacity="0"/>
 <text id="${p}fstate" x="707" y="212" text-anchor="middle" font-family="var(--mono)" font-size="10" fill="#e8f0fa"></text></g>
<!-- combustion chart -->
<g class="part" data-p="chart" tabindex="0"><rect class="hl" x="620" y="230" width="174" height="234" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/><text class="lblS" x="628" y="246">O2, CO2 vs excess air</text>
 ${[0,50,100,150].map(e=>`<line x1="${640+e}" y1="256" x2="${640+e}" y2="430" stroke="var(--line)" stroke-width=".4"/><text class="cht" x="${640+e}" y="442" text-anchor="middle">${e}%</text>`).join("")}
 ${[0,5,10,15,20].map(v=>`<line x1="640" y1="${430-v*8.4}" x2="790" y2="${430-v*8.4}" stroke="var(--line)" stroke-width=".4"/><text class="cht" x="636" y="${433-v*8.4}" text-anchor="end">${v}</text>`).join("")}
 <polyline id="${p}cO2" fill="none" stroke="var(--cold)" stroke-width="2"/><polyline id="${p}cCO2" fill="none" stroke="var(--hot)" stroke-width="2"/>
 <line id="${p}cNow" y1="256" y2="430" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 2"/>
 <text class="cht" x="650" y="456" style="fill:var(--cold)" font-weight="600">O2 %</text><text class="cht" x="700" y="456" style="fill:var(--hot)" font-weight="600">CO2 %</text><text class="cht" x="745" y="456">excess air</text></g>`}

const BURN={id:"burn",p:"b_",name:"Burner and combustion",svg:bSvg("b_"),lamps:BLAMP,txvOnly:[],
 sliders:[
  {k:"mp",l:"Manifold pressure",u:"\" w.c.",min:1,max:12,step:0.1,v:3.5,n:[3.2,3.8],note:"3.5\" natural gas, 10\" propane. Input changes with the square root of pressure."},
  {k:"sh",l:"Primary air shutter",u:"%",min:0,max:100,step:5,v:50,n:[35,70],note:"Opens the air inlet at each burner's venturi. Too closed: yellow, sooty, CO. Too open: noisy, lifting flames."},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-10,max:95,step:1,v:30,note:"Colder outdoors makes a stronger chimney draft."},
  {k:"tight",l:"House leakage (CFM at 50 Pa)",u:" CFM50",min:800,max:5000,step:100,v:2400,n:[1500,5000],note:"Tighter houses go more negative when exhaust fans run.",more:1},
  {k:"chim",l:"Chimney height",u:" ft",min:10,max:40,step:1,v:22,more:1},
  {k:"hv",l:"Gas heating value (natural gas)",u:" Btu/ft³",min:950,max:1100,step:5,v:1030,more:1}],
 faults:[["ventPartial","Bird nest in the chimney cap (partial blockage)"],["ventBlock","Chimney blocked (collapsed liner)"],["connLoose","Vent connector pulled apart at the chimney"],["soot","Heat exchanger passages sooted up"],
  ["lint","Lint in the burner venturis"],["regHigh","Gas valve regulator stuck high"],["bvssJump","Blocked-vent switch jumpered out"],["bigOrif","One orifice drilled oversize"],["coldChim","Exterior chimney, unlined and cold"]],
 hidden:[],
 scenarios:[{l:"Worst case: tight house, all exhaust fans, warm day, blower door off",f:[],v:{out:75,tight:1400},s:{fans:{k:true,b:true,d:true},doorOff:true},speed:10},
  {l:"Propane appliance, natural gas orifices never changed",f:[],s:{fuel:"lp",orif:"ng"},v:{mp:10},speed:10},
  {l:"Sooted heat exchanger and a lazy yellow flame",f:["soot","lint"],speed:10}],
 startMsg(){return `Atmospheric furnace, 80,000 Btu/h, ${FUEL[this.S.fuel].n} with ${this.S.orif==="ng"?"natural gas (#45)":"propane (#55)"} orifices.`},
 parts:{
  burners:{n:"Burners",s:"Four atmospheric in-shot burners.",w:"Gas from each orifice shoots into a venturi, drawing primary air in with it. The flame burns at the ports with secondary air from around it.",
   y:"A good flame is sharp blue inner cones with a blue outer mantle, steady, sitting on the ports. Propane flames have a little more yellow at the tips than natural gas.",
   f:"Yellow tipping: too little primary air (shutter, lint, or propane on gas orifices). Lifting: too much primary air or overfired. Flashback: underfired with too much primary air; the flame burns back in the tube. Rollout: flame comes out of the burner box when the heat exchanger or vent is blocked.",src:["gasfund"],faults:["lint","bigOrif"]},
  orifs:{n:"Orifices (spuds)",s:"Drilled brass fittings on the manifold.",w:"Natural gas here uses #45 drills (0.082\"), about 19 CFH (20,000 Btu/h) each at 3.5\" w.c. Propane uses #55 (0.052\"), about 8 CFH at 10\". Manufacturers pick #43 to #45 depending on the local heating value and altitude.",
   y:"CFH = 1658.5 × 0.9 × area × √(pressure ÷ specific gravity). Converting fuels means changing orifices and the regulator spring.",
   f:"Propane through natural gas orifices overfires about 2.6 times: huge yellow flames, soot, CO. Natural gas through propane orifices underfires to about 40%. A drilled-out orifice overfires its burner.",src:["orif","carrierOr"],faults:["bigOrif"]},
  shutter:{n:"Primary air shutters",s:"Adjustable air openings at the venturis.",w:"",y:"Open until the yellow just leaves the tips, then check CO and O2 on the analyzer.",f:"Closed or blocked with lint: yellow, sooty flames and high CO.",src:["gasfund"],faults:["lint"]},
  gv:{n:"Gas valve",s:"Combination valve with a regulator.",w:"Outlet (manifold) tap for a manometer.",y:"Set manifold pressure to the rating plate, then confirm input by clocking the meter.",f:"Regulator stuck high: overfire, high stack temperature, CO from flame impingement.",src:["gasfund","clock"],faults:["regHigh"]},
  hx:{n:"Heat exchanger",s:"Clamshell sections over the burners.",w:"Flue gas rises through it by its own buoyancy (natural draft inside the appliance).",
   y:"Test hole at the outlet, before the draft hood, so the sample isn't diluted with room air.",f:"Soot from rich burning plugs the passages: less combustion air, more CO, flame rollout, then more soot. A runaway.",src:["canal"],faults:["soot"]},
  hood:{n:"Draft hood",s:"Open skirt between the appliance and the vent.",w:"Lets room air in (dilution air) so chimney draft doesn't pull on the burners.",
   y:"Check for spillage at the hood's relief opening with a smoke pencil or mirror after the appliance has run a few minutes. It must stop within 60 seconds of firing to pass.",f:"Spilling: the vent can't carry the flue gas out. Combustion products enter the house, and the burners breathe their own exhaust (high CO).",src:["caz"],faults:[]},
  bvss:{n:"Blocked-vent shutoff switch",s:"Heat-sensing switch on the draft hood.",w:"A bimetal disc mounted at the draft hood's relief opening. Draft-hood furnaces have had one for decades; many atmospheric water heaters and boilers do too.",
   y:"When hot flue gas spills out of the hood and onto it for a few minutes, it opens and shuts off the gas valve. Manual reset.",f:"It trips again after a reset: the vent is blocked or the house is too negative. Never jumper it: with it bypassed, a blocked vent fills the house with flue gas.",src:["caz"],faults:["bvssJump"]},
  conn:{n:"Vent connector",s:"Single-wall pipe from the draft hood to the chimney.",w:"Rises at least ¼\" per foot, screwed at every joint.",y:"Draft is read with a manometer in the connector: typically −0.02 to −0.04\" w.c. once the vent is warm.",f:"Pulled apart at the thimble: flue gas pours into the basement even with a good chimney. The blocked-vent switch at the hood can't see it, because the gas escapes downstream of the hood.",src:["caz"],faults:["connLoose"]},
  chim:{n:"Chimney",s:"Masonry chimney with a liner.",w:"Warm flue gas is lighter than the outdoor air; the taller and hotter the column, the more draft.",
   y:"Draft (Pa) ≈ 3465 × height (m) × (1/T outdoor − 1/T flue), in kelvin, minus friction. Warm outdoor days give the least draft.",f:"A blocked cap or collapsed liner: spillage and CO. An unlined exterior chimney stays cold, drafts poorly and rots from condensate.",src:["caz"],faults:["ventPartial","ventBlock","coldChim"]},
  anal:{n:"Combustion analyzer",s:"Reads the flue gas sample.",w:"Measures O2, CO and temperature, and calculates the rest: CO2 = CO2max × (20.9 − O2) ÷ 20.9, excess air ≈ O2 ÷ (20.9 − O2), CO air-free = CO × 20.9 ÷ (20.9 − O2).",
   y:"Natural gas atmospheric targets: O2 6–9%, CO2 about 7.5–9%, CO air-free under 100 ppm (400 is the ANSI ceiling), net stack 270–370°F above supply air.",f:"Efficiency is calculated from net stack temperature and O2 (flue loss formula), reported on the gas's higher heating value like US analyzers.",src:["canal","testo"],faults:[]},
  cazm:{n:"CAZ manometer",s:"Basement pressure vs outdoors, in pascals.",w:"Worst case: doors closed, every exhaust fan and the dryer on, furnace blower running.",y:"Limits: −2 Pa for an atmospheric water heater, −3 Pa common-vented, −5 Pa for a natural-draft furnace alone.",f:"More negative than the limit: make-up air or less exhaust before the appliance can be left that way.",src:["caz"],faults:[]},
  coal:{n:"CO alarm",s:"UL 2034 residential alarm.",w:"",y:"It's designed not to sound at low levels: 70 ppm takes 60–240 minutes, 150 ppm 10–50 minutes, 400 ppm 4–15 minutes.",f:"A quiet alarm doesn't mean no CO. Use a low-level meter.",src:["ul2034"],faults:[]},
  fans:{n:"Exhaust fans",s:"Kitchen hood, bath fan and dryer.",w:"Each pulls air out of the house; the same amount leaks back in somewhere, often down the chimney.",y:"Basement pressure ≈ (total exhaust ÷ C)^(1/0.65) Pa, where C comes from the house's leakage at 50 Pa.",f:"",src:["caz"],faults:[]},
  flame:{n:"Flame close-up",s:"What one burner looks like right now.",w:"",y:"",f:"",src:["gasfund"],faults:[]},
  chart:{n:"Combustion chart",s:"O2 and CO2 against excess air.",w:"As excess air rises, O2 rises and CO2 falls. Both lines meet the dotted line at the current reading.",y:"Zero excess air is perfect (stoichiometric): 0% O2 and maximum CO2 (11.7% natural gas, 13.7% propane). Real burners run 40–80% excess air.",f:"",src:["canal"],faults:[]}},
 init(){return {t:0,dead:null,fuel:"ng",orif:"ng",fire:true,labels:true,fans:{k:false,b:false,d:false},doorOff:false,input:0,lam:1.6,o2:8,co2:7,co:20,coaf:20,ts:450,eff:78,draft:0,caz:0,spill:0,roomCO:0,coDose:0,alarm:false,roll:false,sootT:0,vit:0,bv:false,bvT:0,warm:0,pr:0.5,state:"blue",ang:0,off:0,logs2:{}}},
 switches:[
  {l:S=>`Burners: ${S.fire?"firing":"off"}`,on:S=>S.fire,act(sim){sim.S.fire=!sim.S.fire;sim.S.warm=0;log(sim,sim.S.fire?"Burners lit.":"Burners off.")}},
  {l:S=>`Gas supply: ${FUEL[S.fuel].n}`,on:S=>S.fuel==="lp",act(sim){sim.S.fuel=sim.S.fuel==="ng"?"lp":"ng";log(sim,`Gas supply changed to ${FUEL[sim.S.fuel].n}. ${sim.S.fuel!==sim.S.orif?"The orifices don't match it!":""}`,sim.S.fuel!==sim.S.orif?"w":"")}},
  {l:S=>`Orifices: ${S.orif==="ng"?"natural gas #45":"propane #55"}`,on:S=>S.orif==="lp",act(sim){sim.S.orif=sim.S.orif==="ng"?"lp":"ng";log(sim,`Orifices changed to ${sim.S.orif==="ng"?"#45 (natural gas)":"#55 (propane)"}.`)}},
  {l:S=>`Kitchen hood: ${S.fans.k?"on":"off"}`,on:S=>S.fans.k,act(sim){sim.S.fans.k=!sim.S.fans.k}},
  {l:S=>`Bath fan: ${S.fans.b?"on":"off"}`,on:S=>S.fans.b,act(sim){sim.S.fans.b=!sim.S.fans.b}},
  {l:S=>`Dryer: ${S.fans.d?"on":"off"}`,on:S=>S.fans.d,act(sim){sim.S.fans.d=!sim.S.fans.d}},
  {l:S=>`Furnace blower door: ${S.doorOff?"OFF (return leak in the basement)":"on"}`,on:S=>S.doorOff,act(sim){sim.S.doorOff=!sim.S.doorOff}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[{id:"smoke",l:"Smoke test at the draft hood",show:S=>S.fire,act(sim){const S=sim.S;log(sim,S.hoodSp>0.05?"Smoke blows out of the draft hood relief: it's spilling.":S.warm<60?"Smoke drifts lazily. Give the vent a minute or two to warm up and try again.":"Smoke is pulled straight into the draft hood. No spillage at the hood."+(sim.F.connLoose?" But there's a flue-gas smell near the chimney.":""),S.hoodSp>0.05?"w":"")}}],
 resets(S){const r=[],sim=this;if(S.bv)r.push(["Reset the blocked-vent switch",()=>{S.bv=false;S.bvT=0;S.warm=0;log(sim,"Blocked-vent switch reset. If the vent is still blocked it will trip again.","w")}]);if(S.roll)r.push(["Reset the rollout switch",()=>{S.roll=false;S.fire=true;S.warm=0;log(sim,"Rollout switch reset by hand. Find out why the flame rolled out before you leave.","w")}]);return r},
 reads(S){return [["Input",S.fire?`${f0(S.input/1000)}k Btu/h`:"off"],["O2",S.fire?`${S.o2.toFixed(1)}%`:"—"],["CO air-free",S.fire?`${f0(S.coaf)} ppm`:"—"],["Draft",`${(-S.draft/249).toFixed(3)}"`],["CAZ",`${(-S.caz).toFixed(1)} Pa`],["Room CO",`${f0(S.roomCO)} ppm`]]},
 stText(S){if(S.bv)return "blocked-vent switch tripped";if(S.roll)return "rollout tripped";if(!S.fire)return "off";return S.state},
 step(dt){const S=this.S;let r=dt;while(r>1e-9){const h=Math.min(0.5,r);this.sub(h);r-=h}},
 sub(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;const fu=FUEL[S.fuel],hv=S.fuel==="ng"?V.hv:fu.hv;
  const on=S.fire&&!S.roll&&!S.bv;S.warm=on?S.warm+dt:Math.max(0,S.warm-dt*2);
  // gas flow through the four orifices
  const mp=F.regHigh?Math.max(V.mp,S.fuel==="ng"?5.2:13):V.mp,d=ORF[S.orif];
  let cfh=0;const per=[];for(let i=0;i<4;i++){const q=orQ(i===1&&F.bigOrif?d*1.3:d,mp,fu.sg);per.push(q);cfh+=q}
  S.mp=mp;S.input=on?cfh*hv:0;const r=S.input/BNOM;S.r=r;
  // primary aeration (fraction of the air the gas needs): set by the injector and shutter
  const inj={ngng:1,lplp:1,lpng:0.39,nglp:1.7}[S.fuel+S.orif];
  S.pr=V.sh/100*0.95*inj*(F.lint?0.5:1)*(S.spill>0.3?0.8:1);
  // combustion air through the heat exchanger (buoyancy inside the appliance)
  S.sootT=clamp(S.sootT+(F.soot?dt/600:0)+(on&&S.co>800?dt/3000:0)-(F.soot?0:dt/1e9),0,1);
  const sootK=F.soot?0.55:1-0.4*Math.min(1,S.sootT);
  const ventK=F.ventBlock?0.85:1;
  const air=1221*Math.pow(Math.max(r,0.05),0.5)*sootK*ventK;
  const need=cfh*fu.air;let lam=need>0?air/need:3;
  // chimney draft and basement pressure
  const Tst=on?70+(390*Math.pow(Math.max(r,0.05),0.3)*Math.pow(clamp(lam,0.6,4)/1.65,0.15)+(F.soot?70:0)):70;
  const Tvent=70+(Tst-70)*0.55*Math.min(1,S.warm/90);const To=(V.out-32)/1.8+273.15,Tf=(Tvent-32)/1.8+273.15;
  let draft=Math.max(0,0.4*3465*V.chim*0.3048*(1/To-1/Tf))*(F.coldChim?0.4:1)*(F.ventPartial?0.35:1)*(F.ventBlock?0:1);
  const exh=(S.fans.k?350:0)+(S.fans.b?80:0)+(S.fans.d?150:0);const C=V.tight/Math.pow(50,0.65);
  S.caz=Math.pow(exh/C,1/0.65)+(S.doorOff?3:0);S.draft=draft;
  const net=draft-S.caz;
  const needD=2*(F.ventPartial?3:1);let spill=on?clamp((needD-net)/5,0,1):0;if(F.ventBlock&&on)spill=1;const hoodSp=spill;if(F.connLoose&&on)spill=Math.max(spill,0.65);
  const wT=F.coldChim?200:45;if(on&&S.warm<wT&&!F.ventBlock)spill=Math.max(spill,clamp((wT-S.warm)/wT*(F.coldChim?0.5:0.25),0,0.5)*(net<6||F.coldChim?1:0));  // cold-start spillage that should clear
  S.spill+=(spill-S.spill)*Math.min(1,dt/8);S.hoodSp=(S.hoodSp||0)+(hoodSp-(S.hoodSp||0))*Math.min(1,dt/8);
  S.vit=clamp((S.vit||0)+(on&&S.spill>0.3?dt/900:-dt/300),0,1);lam*=1-0.25*S.spill*S.vit;   // burners slowly breathing their own exhaust
  S.lam=lam;
  // flue gas
  const o2=Math.max(0,20.9*(lam-1)/lam);S.o2=on?o2:20.9;S.co2=on?fu.co2*(20.9-S.o2)/20.9:0;S.ea=on?Math.max(0,(lam-1)*100):0;
  let co=12;
  if(lam<1.3)co+=lam>=1?2000*Math.pow((1.3-lam)/0.3,2):2000+40000*(1-lam);
  if(S.pr<0.32)co+=500*Math.pow((0.32-S.pr)/0.32,1.4)*(S.fuel==="lp"?1.2:1);
  if(r>1.12)co+=260*(r-1.12)/0.2;if(F.bigOrif)co+=120;
  const lift=S.pr>0.85||(r>1.3&&S.pr>0.45);if(lift)co+=90;
  S.co=on?co:0;S.coaf=on?co*20.9/Math.max(0.5,20.9-S.o2):0;
  S.ts=Tst;const net_=Tst-70;const loss=(net_/1.8)*(fu.a2/Math.max(0.5,20.9-S.o2)+fu.b);S.eff=on?clamp((100-loss)*fu.hhv-(S.co>2000?3:0),0,99):0;
  // flame state
  const flash=on&&r<0.55&&S.pr>0.55;S.state=!on?"off":flash?"flashback":S.pr<0.18?"lazy yellow":S.pr<0.32?"yellow tips":lift?"lifting":"blue";
  if(S.state!==S.logs2.st){if(on&&S.state!=="blue")log(sim,`Flame: ${S.state}.`,"w");S.logs2.st=S.state}
  // rollout: flame pushed out when the flue path can't carry it
  if(on&&(F.ventBlock&&F.soot||(sootK<0.62&&r>0.9)||(F.ventBlock&&r>1.3))){S.rollT=(S.rollT||0)+dt;if(S.rollT>20&&!S.roll){S.roll=true;S.fire=false;log(sim,"Flame rollout: the rollout switch opened and shut the gas valve. Manual reset.","b")}}else S.rollT=0;
  // blocked-vent shutoff switch on the draft hood: opens when hot flue gas spills on it for a few minutes
  if(on&&S.hoodSp>0.5){S.bvT=(S.bvT||0)+dt;if(S.bvT>150&&!F.bvssJump){S.bv=true;log(sim,"The blocked-vent shutoff switch at the draft hood opened and shut off the burners. Manual reset. Find the venting problem first.","b")}
   else if(S.bvT>150&&F.bvssJump&&!S.logs2.bvj){S.logs2.bvj=1;log(sim,"Flue gas has been spilling on the blocked-vent switch for minutes, but the burners keep firing: the switch is jumpered out.","b")}}else S.bvT=Math.max(0,(S.bvT||0)-dt);
  // room CO from spillage
  const flue=on?cfh*(fu.air*lam+1):0,vent=2400+exh*60;   // basement air near the appliance: about 3000 ft³, 0.8 air changes an hour
  S.roomCO+=((S.spill*flue*S.co)/3000-S.roomCO*(vent/3000))*dt/3600;S.coPk=Math.max(S.coPk||0,S.roomCO);S.roomCO=Math.max(0,S.roomCO);
  S.coDose=Math.max(0,S.coDose+dt/60*(S.roomCO>=400?1/9.5:S.roomCO>=150?1/30:S.roomCO>=70?1/150:-1/30));
  if(!S.alarm&&S.coDose>=1){S.alarm=true;log(sim,`CO alarm sounding: ${f0(S.roomCO)} ppm in the basement. Get everyone out, shut off the appliance and ventilate.`,"b")}
  if(S.alarm&&S.roomCO<30){S.alarm=false;S.coDose=0}
  // logs
  if(on&&S.warm>120){if(S.spill>0.1&&!S.logs2.sp){S.logs2.sp=1;log(sim,S.hoodSp<0.1?`Flue gas is escaping into the basement, but not at the draft hood. Basement CO is rising. Check the vent connector joints.`:`Spilling at the draft hood after ${f0(S.warm)} s of firing. Basement ${(-S.caz).toFixed(1)} Pa, draft ${(-draft/249).toFixed(3)}" w.c.`,"w")}
   if(S.spill<0.03)S.logs2.sp=0;
   if(S.coaf>400&&!S.logs2.co4){S.logs2.co4=1;log(sim,`CO air-free ${f0(S.coaf)} ppm: over 400. Emergency: shut off the gas to the appliance.`,"b")}else if(S.coaf>100&&!S.logs2.co1){S.logs2.co1=1;log(sim,`CO air-free ${f0(S.coaf)} ppm: over 100. Stop and fix before leaving it running.`,"w")}
   if(S.coaf<80){S.logs2.co1=0;S.logs2.co4=0}}
  if(on&&Math.abs(r-1)>0.08&&!S.logs2.fire){S.logs2.fire=1;log(sim,`Input ${f0(S.input/1000)}k Btu/h is ${r>1?"over":"under"} the 80k rating (${f0(r*100)}%).`,"w")}if(Math.abs(r-1)<0.05)S.logs2.fire=0},
 draw(dt){const S=this.S,F=this.F,V=this.V,p="b_",on=S.fire&&!S.roll&&!S.bv;
  const flame=(x,yb,h,w,st)=>{const lift=st==="lifting"?6:0,y0=yb-lift;
   const outer=`M${x-w} ${y0} C${x-w} ${y0-h*0.5} ${x-w*0.3} ${y0-h*0.8} ${x} ${y0-h} C${x+w*0.3} ${y0-h*0.8} ${x+w} ${y0-h*0.5} ${x+w} ${y0} Z`;
   const ih=h*(st==="blue"||st==="lifting"?0.42:0.25);const inner=`M${x-w*0.55} ${y0} L${x} ${y0-ih} L${x+w*0.55} ${y0} Z`;
   const yt=st==="lazy yellow"?h*0.9:st==="yellow tips"?h*0.45:0;const yel=yt?`M${x-w*0.7} ${y0-h+yt} C${x-w*0.5} ${y0-h} ${x-w*0.2} ${y0-h-4} ${x} ${y0-h-(st==="lazy yellow"?h*0.3:2)} C${x+w*0.2} ${y0-h-4} ${x+w*0.5} ${y0-h} ${x+w*0.7} ${y0-h+yt} Z`:"";
   return [outer,inner,yel]};
  const xs=[226,256,286,316];
  xs.forEach((x,i)=>{const h=on&&S.state!=="flashback"?(14+18*clamp(S.r,0.2,2.6))*(i===1&&F.bigOrif?1.4:1)*(S.state==="lazy yellow"?1.4:1):0;const [o,n,y]=on?flame(x,404,h,6,S.state):["","",""];
   at(p+"fo"+i,"d",o);at(p+"fi"+i,"d",n);at(p+"fy"+i,"d",y);at(p+"fy"+i,"opacity",y?0.95:0);at(p+"sh"+i,"width",(14*(1-V.sh/100)).toFixed(1))});
  {const h=on&&S.state!=="flashback"?40+50*clamp(S.r,0.2,2.6)*(S.state==="lazy yellow"?1.4:1):0;const [o,n,y]=on?flame(707,146,h,15,S.state):["","",""];at(p+"bo","d",o);at(p+"bi","d",n);at(p+"by","d",y);at(p+"by","opacity",y?0.95:0);
   at(p+"bfb","opacity",on&&S.state==="flashback"?(blink(300)?1:.6):0);txt(p+"fstate",on?S.state.toUpperCase():"OFF")}
  at(p+"roll","opacity",S.roll||(on&&(S.rollT||0)>3)?(blink(250)?1:.5):0);at(p+"soot","opacity",(F.soot?0.55:0.5*S.sootT).toFixed(2));
  at(p+"bvL","fill",S.bv?"var(--bad)":"var(--ok)");at(p+"bvJ","opacity",F.bvssJump?1:0);at(p+"nest","opacity",F.ventPartial?1:0);at(p+"chimBlock","opacity",F.ventBlock?1:0);at(p+"gap","opacity",F.connLoose?1:0);
  at(p+"spill","opacity",S.hoodSp>0.05?(blink(500)?Math.min(1,S.hoodSp+0.3):S.hoodSp):0);at(p+"gapSp","opacity",F.connLoose&&S.spill>0.05?(blink(500)?0.9:0.5):0);at(p+"dil","opacity",on&&S.spill<0.3?1:0.2);
  S.off-=dt*20*Math.max(0,S.draft/10);const vf=$(p+"vflow");if(vf){vf.style.strokeDashoffset=S.off;vf.style.opacity=on&&S.draft>1&&!F.ventBlock?0.7:0}
  ["k","b","d"].forEach(k=>at(p+"fl_"+k,"fill",S.fans[k]?"var(--ok)":"var(--lamp-off)"));at(p+"kArrow","opacity",S.fans.k?1:0);
  if(S.fans.b)S.ang=(S.ang+dt*900)%360;at(p+"bathB","transform",`rotate(${S.ang.toFixed(0)} 250 60)`);
  txt(p+"mpTxt",`${S.mp.toFixed(1)}"`);txt(p+"caz",`${(-S.caz).toFixed(1)} Pa`);txt(p+"coTxt",String(f0(S.roomCO)));at(p+"coLed","fill",S.alarm?(blink(300)?"var(--bad)":"var(--lamp-off)"):"var(--ok)");
  const A=on?[`O2   ${S.o2.toFixed(1)} %`,`CO   ${f0(S.co)} ppm`,`COaf ${f0(S.coaf)} ppm`,`CO2  ${S.co2.toFixed(1)} %`,`EA   ${f0(S.ea)} %`,`TS   ${f0(S.ts)}°F n${f0(S.ts-70)}`,`EFF  ${S.eff.toFixed(1)} %`,`DFT ${(-S.draft/249+S.caz/249).toFixed(3)}"`]:["O2   20.9 %","CO   0 ppm","","","","","",`DFT ${(-S.draft/249+S.caz/249).toFixed(3)}"`];
  A.forEach((t,i)=>txt(p+"a"+i,t));at(p+"a2","fill",on&&S.coaf>100?"#a3150c":"#1f2a22");
  // chart
  const fu=FUEL[S.fuel],o2p=[],co2p=[];for(let e=0;e<=150;e+=5){const l=1+e/100,o=20.9*(l-1)/l;o2p.push(`${640+e},${(430-o*8.4).toFixed(1)}`);co2p.push(`${640+e},${(430-fu.co2*(20.9-o)/20.9*8.4).toFixed(1)}`)}
  at(p+"cO2","points",o2p.join(" "));at(p+"cCO2","points",co2p.join(" "));const xN=640+clamp(S.ea,0,150);at(p+"cNow","x1",xN.toFixed(1));at(p+"cNow","x2",xN.toFixed(1));at(p+"cNow","opacity",on?1:0);
  document.querySelectorAll("#svg .lbl,#svg .lblS").forEach(e=>e.style.opacity=S.labels===false?0:1)},
 boom(){return{t:"",b:"",wreck:0}}};
BURN.lampOn=S=>({bv:S.bv,fire:S.fire&&!S.roll&&!S.bv,yellow:S.state==="yellow tips"||S.state==="lazy yellow",lift:S.state==="lifting",spill:S.spill>0.1,co:S.coaf>100,alarm:S.alarm,roll:S.roll});
