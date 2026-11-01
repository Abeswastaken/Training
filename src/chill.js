/* ============ CHILLER AND COOLING TOWER: 300-ton centrifugal chiller, condenser water loop, open cooling tower, chilled water loop to an air handler ============ */
SRC.ahri=["AHRI 550/590 rating conditions: 44°F leaving / 54°F entering chilled water at 2.4 gpm/ton, 85°F entering / 95°F leaving condenser water at 3.0 gpm/ton; IPLV part-load points; typical 0.52–0.62 kW/ton centrifugal","https://open-exam-prep.com/study-guides/pe-mechanical-hvac/hvac-equipment-machinery/water-chillers-iplv-ratings"];
SRC.tower=["Cooling towers: range, approach (6–10°F, 7°F at 78°F wet bulb), 15,000 Btu/h rejected per ton, evaporation ≈ 0.0008 × gpm × range, drift, cycles and blowdown = E ÷ (C − 1)","https://open-exam-prep.com/study-guides/pe-mechanical-hvac/hvac-equipment-machinery/cooling-towers-approach-cycles"];
SRC.epaTower=["EPA WaterSense at Work 6.3: makeup = evaporation + drift + blowdown; cycles = blowdown conductivity ÷ makeup conductivity; most towers run 2–4 cycles, 6+ possible","https://www.epa.gov/system/files/documents/2023-05/ws-commercial-watersense-at-work_Section_6.3_Cooling_Towers.pdf"];
SRC.approach=["Chiller approach temperature as the fouling metric: clean condenser approach about 2°F, act when it rises 3°F over baseline; evaporator approach up with normal flow = low charge or fouling; sudden condenser approach jump after service = non-condensables","https://oxmaint.com/industries/facility-management/chiller-approach-temperature-fouling-metric"];
SRC.surge=["Chiller surge: causes (dirty condenser tubes, low condenser water flow, poor tower heat rejection, high wet bulb), worse at low load; lower condenser water or raise chilled water to reduce lift","https://aircondlounge.com/chiller-surge-symptoms-causes-preventions/"];
SRC.pt134=["Refrigerants.com R-134a reference guide: pressure-temperature chart (40°F = 35.0 psig, 100°F = 124 psig, 125°F = 185 psig)","https://refrigerants.com/wp-content/uploads/2020/03/R134a_RefGuid.pdf"];

PHOTOS.chill={tower:[gimg("induced draft counterflow cooling tower")],tfan:[gimg("cooling tower fan VFD")],fill:[gimg("cooling tower fill media scaled")],basin:[gimg("cooling tower basin makeup float valve")],
 makeup:[gimg("cooling tower makeup water valve float")],blow:[gimg("cooling tower conductivity controller blowdown valve")],cdwp:[gimg("condenser water pump end suction")],strainer:[gimg("condenser water basket strainer")],
 chiller:[gimg("centrifugal chiller")],comp:[gimg("centrifugal compressor inlet guide vanes")],cond:[gimg("chiller condenser tubes scale")],evap:[gimg("chiller evaporator flooded shell and tube")],
 orifice:[gimg("chiller float valve expansion orifice")],panel:[gimg("centrifugal chiller control panel display")],chwp:[gimg("chilled water pump")],ahu:[gimg("air handler chilled water coil valve")],fs:[gimg("paddle flow switch chilled water")]};

const PT134=[[0,6.5],[10,12],[20,18.4],[25,22.1],[30,26.1],[35,30.4],[40,35],[45,40.1],[50,45.5],[55,51.3],[60,57.5],[65,64.1],[70,71.2],[75,78.7],[80,86.8],[85,95.3],[90,104],[95,114],[100,124],[105,135],[110,147],[115,159],[120,171],[125,185],[130,199],[140,229],[150,263]];
const ptP134=t=>{const T=PT134;if(t<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(t<=T[i][0]){const[a,b]=[T[i-1],T[i]];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}return T[T.length-1][1]};
const ptT134=p=>{const T=PT134;if(p<=T[0][1])return T[0][0];for(let i=1;i<T.length;i++)if(p<=T[i][1]){const[a,b]=[T[i-1],T[i]];return a[0]+(b[0]-a[0])*(p-a[1])/(b[1]-a[1])}return T[T.length-1][0]};
const CTONS=300,GCHW=720,GCDW=900,BASIN=1500,CMAKE=300;   // plant size, design flows (gpm), basin gallons, makeup water µS/cm
const CLAMP=[["run","Chiller running","g"],["lim","Current limit","a"],["surge","Surging","a"],["trip","Safety trip","r"],["warm","Building warm","a"],["low","Basin low","r"],["cyc","Cycles over 6","a"]];

function cSvg(p){
 const pipe=(id,d,w,col)=>`<path d="${d}" fill="none" stroke="#1d2125" stroke-width="${w+2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/><path id="${p}${id}" d="${d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 10" opacity=".55"/>`;
 return `
<line x1="10" y1="214" x2="790" y2="214" stroke="#8a7f70" stroke-width="4"/><text class="lblS" x="16" y="208">Roof</text><text class="lblS" x="16" y="230">Mechanical room</text>
<!-- condenser water piping -->
<g class="part" data-p="cdwp" tabindex="0">
 ${pipe("cdwS","M120 184 V442 H172",10,"#5a9bd4")}${pipe("cdwS2","M212 442 H238 V352 H262",10,"#5a9bd4")}
 <circle class="hl" cx="192" cy="442" r="20" fill="url(#zSteel)" stroke="#333"/><circle cx="192" cy="442" r="8" fill="#2a2f33"/><g id="${p}cdwImp"><path d="M192 434 V450 M184 442 H200" stroke="#9aa3aa" stroke-width="2.5"/></g>
 <text class="lblS" x="192" y="467" text-anchor="middle">Condenser water pump</text></g>
<g class="part" data-p="strainer" tabindex="0"><rect class="hl" x="128" y="400" width="18" height="26" rx="3" fill="url(#zBrass)" stroke="#6b5200"/><rect x="132" y="406" width="10" height="16" fill="url(#zGrille)"/><rect id="${p}strDirt" x="132" y="410" width="10" height="12" fill="#5b4a2f" opacity="0"/></g>
<g class="part" data-p="cond" tabindex="0">${pipe("cdwR","M262 324 H226 V84 H206",10,"#d9824a")}<path class="hl" d="M262 324 H226 V84" fill="none" stroke="transparent" stroke-width="12"/></g>
<!-- cooling tower -->
<g class="part" data-p="tower" tabindex="0">
 <rect class="hl" x="36" y="60" width="172" height="124" fill="url(#zCab)" stroke="#5f686d" stroke-width="2"/>
 <rect x="36" y="134" width="12" height="22" fill="#3b444b"/><rect x="196" y="134" width="12" height="22" fill="#3b444b"/>${[0,1,2,3].map(i=>`<path d="M36 ${139+i*5} l12 -4 M196 ${135+i*5} l12 4" stroke="#c3cacf" stroke-width="2.2"/>`).join("")}<path d="M10 146 H32 M234 146 H212" stroke="var(--air-cool)" stroke-width="2" marker-end="url(#zArrow)"/>${[70,104,138,172].map(x=>`<path d="M${x} 60 V184" stroke="#9aa3aa" stroke-width=".8"/>`).join("")}<text class="cht" x="22" y="140" text-anchor="middle">air</text>
 <path d="M56 84 H206" stroke="#d9824a" stroke-width="5"/>${[70,100,130,160,190].map(x=>`<path d="M${x} 86 l-5 7 M${x} 86 l5 7 M${x} 86 v8" stroke="#5a9bd4" stroke-width="1.2"/>`).join("")}
 <rect x="54" y="68" width="136" height="10" fill="url(#zFinsH)" opacity=".8"/><text class="cht onm" x="122" y="76" text-anchor="middle">drift eliminators</text></g>
<g class="part" data-p="fill" tabindex="0"><rect class="hl" x="52" y="98" width="140" height="34" fill="#cfd8dc" stroke="#7b868c"/>
 <path d="${Array.from({length:14},(_,i)=>`M${54+i*10} 100 l8 15 l-8 15`).join(" ")}" fill="none" stroke="#8c979d" stroke-width="1.2"/>
 <rect id="${p}fillScale" x="52" y="98" width="140" height="34" fill="#b7a27a" opacity="0"/>
 <path id="${p}rain" d="${[62,78,94,110,126,142,158,174].map(x=>`M${x} 96 V158`).join(" ")}" stroke="#5a9bd4" stroke-width="1.6" stroke-dasharray="3 6" opacity=".8"/></g>
<g class="part" data-p="tfan" tabindex="0"><path class="hl" d="M74 60 L84 34 H160 L170 60 Z" fill="url(#zSteel)" stroke="#5f686d"/><rect x="80" y="26" width="84" height="10" rx="2" fill="#7b868c"/>
 <g id="${p}blades">${[0,1,2].map(i=>`<rect id="${p}bl${i}" x="120" y="40" width="2" height="5" fill="#2a2f33"/>`).join("")}</g><circle cx="122" cy="42" r="3" fill="#2a2f33"/><rect x="114" y="46" width="16" height="10" rx="2" fill="#4d555a"/><path d="M122 46 V43" stroke="#2a2f33" stroke-width="2"/>
 <rect x="168" y="38" width="22" height="14" rx="2" fill="#4d555a"/><text class="cht" x="179" y="48" text-anchor="middle" style="fill:#e8f0fa">VFD</text>
 <text class="val" id="${p}fanTxt" x="122" y="20" text-anchor="middle" font-size="11">fan 60%</text></g>
<g class="part" data-p="basin" tabindex="0"><rect class="hl" x="40" y="156" width="164" height="28" fill="#2a3a44" stroke="#5f686d"/><rect id="${p}water" x="42" y="162" width="160" height="20" fill="#5a9bd4" opacity=".85"/>
 <text class="val" id="${p}basinTxt" x="122" y="178" text-anchor="middle" font-size="11" style="fill:#fff">75.0°F</text></g>
<g class="part" data-p="makeup" tabindex="0">${pipe("mk","M10 168 H40",4,"url(#zSteel)")}<circle class="hl" cx="24" cy="168" r="6" fill="url(#zBrass)" stroke="#6b5200"/><circle id="${p}float" cx="50" cy="164" r="4" fill="#f2b632" stroke="#7a5600"/><text class="cht" x="22" y="196">makeup</text></g>
<g class="part" data-p="blow" tabindex="0"><rect class="hl" x="232" y="150" width="62" height="40" rx="4" fill="#ece7dc" stroke="#8f887a"/><rect x="236" y="154" width="54" height="16" rx="2" fill="url(#zLcd)"/><text id="${p}condTxt" x="263" y="166" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="#1f2a22">1450 µS</text>
 <text class="cht" x="263" y="183" text-anchor="middle">blowdown</text><circle id="${p}bdLed" cx="286" cy="182" r="3" fill="var(--lamp-off)"/></g>
<text class="val" id="${p}wbTxt" x="300" y="40" font-size="11">Outdoor wet bulb 72°F</text>
<!-- chiller panel -->
<g class="part" data-p="panel" tabindex="0"><rect class="hl" x="300" y="50" width="300" height="154" rx="6" fill="#1b1f22" stroke="#444"/><text class="cht" x="310" y="64" style="fill:#c9d1d6">CHILLER CONTROL PANEL</text>
 ${[0,1,2,3,4,5,6,7,8].map(i=>`<text id="${p}d${i}" x="310" y="${82+i*13.5}" font-family="var(--mono)" font-size="10.5" fill="#9fe0a8"></text>`).join("")}</g>
<!-- chiller -->
<g class="part" data-p="cond" tabindex="0"><rect class="hl" x="262" y="312" width="240" height="46" rx="20" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="2"/><rect x="256" y="314" width="12" height="42" rx="3" fill="#5f686d"/>${[318,326,334,342,350].map(y=>`<circle cx="262" cy="${y}" r="1.4" fill="#c3cacf"/>`).join("")}<rect x="250" y="320" width="8" height="10" fill="#4d555a"/><rect x="250" y="342" width="8" height="10" fill="#4d555a"/>
 <rect id="${p}condLiq" x="280" y="346" width="204" height="8" rx="3" fill="#7fb0dc" opacity=".8"/><rect id="${p}condScale" x="270" y="318" width="226" height="34" rx="14" fill="#b7a27a" opacity="0"/>
 <text class="cht onm" x="380" y="338" text-anchor="middle">CONDENSER · R-134a</text></g>
<g class="part" data-p="evap" tabindex="0"><rect class="hl" x="262" y="380" width="240" height="50" rx="22" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="2"/><rect x="496" y="382" width="12" height="46" rx="3" fill="#5f686d"/>${[386,394,402,410,418,426].map(y=>`<circle cx="502" cy="${y}" r="1.4" fill="#c3cacf"/>`).join("")}
 <rect id="${p}evLiq" x="276" y="402" width="212" height="22" rx="8" fill="#7fb0dc" opacity=".75"/>
 <g id="${p}boil">${[300,330,360,390,420,450].map((x,i)=>`<circle cx="${x}" cy="${404+(i%2)*6}" r="2.2" fill="#fff" opacity=".8"/>`).join("")}</g>
 <text class="cht onm" x="380" y="398" text-anchor="middle">EVAPORATOR</text></g>
<g class="part" data-p="orifice" tabindex="0"><path class="hl" d="M478 358 V380" stroke="#4d555a" stroke-width="6"/><rect x="472" y="364" width="12" height="8" fill="url(#zBrass)" stroke="#6b5200"/></g>
<g class="part" data-p="comp" tabindex="0"><g id="${p}compG">
 <path d="M440 300 V292 H470 V380" fill="none" stroke="#4d555a" stroke-width="10"/><path d="M440 300 V292 H470 V380" fill="none" stroke="#9aa3aa" stroke-width="7"/>
 <rect class="hl" x="290" y="250" width="86" height="46" rx="10" fill="url(#zSteel)" stroke="#4d555a"/>${[300,310,320,346,356,366].map(x=>`<path d="M${x} 254 V292" stroke="#9aa3aa" stroke-width="1.2"/>`).join("")}<text class="cht onm" x="333" y="277" text-anchor="middle">MOTOR</text>
 <circle cx="412" cy="272" r="30" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="2"/><circle cx="412" cy="272" r="14" fill="#5f686d"/>
 <g id="${p}igv">${[0,1,2,3,4,5].map(i=>`<path d="M412 272 L${412+12*Math.cos(i*1.047)} ${272+12*Math.sin(i*1.047)}" stroke="#d9dee1" stroke-width="2"/>`).join("")}</g>
 <path d="M396 300 V312" stroke="#4d555a" stroke-width="10"/></g>
 <text class="val" id="${p}igvTxt" x="412" y="244" text-anchor="middle" font-size="10">vanes 75%</text></g>
<g class="part" data-p="panel" tabindex="0"><path d="M535 315 V322 H500" fill="none" stroke="#b8732e" stroke-width="2"/><path d="M300 436 V430" stroke="#b8732e" stroke-width="2"/>${zGauge(535,296,14,"#c0392b")}<line id="${p}cNeedle" x1="535" y1="296" x2="535" y2="284" stroke="#b3261e" stroke-width="1.8" stroke-linecap="round"/><circle cx="535" cy="296" r="2" fill="#222"/>
 ${zGauge(300,450,13,"#2f6fd6")}<line id="${p}eNeedle" x1="300" y1="450" x2="300" y2="439" stroke="#b3261e" stroke-width="1.8" stroke-linecap="round"/><circle cx="300" cy="450" r="2" fill="#222"/></g>
<text class="val" id="${p}cPress" x="512" y="330" font-size="10">101 psig</text><text class="val" id="${p}ePress" x="320" y="455" font-size="10">38 psig</text>
<!-- chilled water piping and air handler -->
<g class="part" data-p="chwp" tabindex="0">${pipe("chwS","M508 398 H560 V446 H594",10,"#2f6fd6")}${pipe("chwS2","M634 446 H770 V186",10,"#2f6fd6")}
 <circle class="hl" cx="614" cy="446" r="20" fill="url(#zSteel)" stroke="#333"/><circle cx="614" cy="446" r="8" fill="#2a2f33"/><g id="${p}chwImp"><path d="M614 438 V454 M606 446 H622" stroke="#9aa3aa" stroke-width="2.5"/></g>
 <text class="lblS" x="700" y="436" text-anchor="middle">Chilled water pump</text></g>
<g class="part" data-p="fs" tabindex="0"><rect class="hl" x="522" y="384" width="12" height="10" fill="#c9ccce" stroke="#444"/><path d="M528 394 v4" stroke="#444" stroke-width="2"/><circle id="${p}fsL" cx="528" cy="379" r="3" fill="var(--ok)"/></g>
<g class="part" data-p="ahu" tabindex="0">${pipe("chwR","M716 70 H660 V416 H508",10,"#7a5cd0")}
 <rect class="hl" x="680" y="56" width="110" height="150" rx="4" fill="url(#zCab)" stroke="#5f686d"/><rect x="700" y="70" width="34" height="120" fill="url(#zFins)" stroke="#5f686d"/>
 <circle cx="762" cy="110" r="16" fill="#3b444b" stroke="#222"/><g id="${p}ahuFan"><path d="M762 98 V122 M750 110 H774" stroke="#9aa3aa" stroke-width="3"/></g>
 <path id="${p}airIn" d="M684 150 H700" stroke="var(--air-warm)" stroke-width="3" marker-end="url(#zArrow)"/><path id="${p}airOut" d="M740 160 H786" stroke="var(--air-cool)" stroke-width="3" marker-end="url(#zArrow)"/>
 <g transform="translate(770 236)"><path d="M-7 -6 v12 l7 -6 z M7 -6 v12 l-7 -6 z" fill="url(#zBrass)" stroke="#6b5200"/><path d="M0 0 H-12" stroke="#2a2f33" stroke-width="2"/><rect x="-26" y="-7" width="14" height="14" rx="2" fill="#2a2f33"/></g><text class="cht onm" x="735" y="202" text-anchor="middle">Air handler coil</text>
 <text class="val" id="${p}roomTxt" x="735" y="48" text-anchor="middle" font-size="11">Building 74°F</text></g>
${[["tLC","180","300"],["tEC","176","372"],["tLCH","566","392"],["tECH","566","434"],["tSup","676","240"],["tRet","576","282"]].map(([id,x,y])=>`<text class="val" id="${p}${id}" x="${x}" y="${y}" font-size="10"></text>`).join("")}`}

const CHILL={id:"chill",p:"c_",name:"Chiller and cooling tower",svg:cSvg("c_"),lamps:CLAMP,txvOnly:[],
 sliders:[
  {k:"load",l:"Building cooling load",u:"%",min:10,max:110,step:5,v:75,note:"Percent of the chiller's 300 tons. Mild days run 20–50%."},
  {k:"wb",l:"Outdoor wet bulb",u:"°F",min:45,max:82,step:1,v:67,note:"A cooling tower can only cool toward the wet bulb, never the dry bulb. 78°F is the usual design value."},
  {k:"sp",l:"Chilled water setpoint",u:"°F",min:38,max:50,step:0.5,v:44,n:[42,48],note:"44°F is the AHRI rating point. Lower costs energy and moves toward the freeze trip."},
  {k:"tset",l:"Tower water setpoint",u:"°F",min:60,max:90,step:1,v:75,n:[65,85],note:"The tower fan VFD holds this. Colder water means less lift and fewer kW per ton, down to the chiller's minimum."},
  {k:"cset",l:"Blowdown conductivity setpoint",u:" µS",min:600,max:3000,step:50,v:1500,n:[900,1800],note:"Makeup water here is 300 µS, so 1500 µS is 5 cycles of concentration.",more:1}],
 faults:[["condFoul","Condenser tubes scaled"],["evapFoul","Evaporator tubes fouled"],["lowCharge","Refrigerant charge low (leak)"],["noncond","Air left in the condenser after service"],["vanes","Inlet guide vane actuator stuck at 40%"],["sensor","Leaving chilled water sensor reads 5°F high"],
  ["towerFan","Tower fan motor tripped"],["fill","Tower fill clogged with scale"],["strainer","Condenser water strainer clogged"],["makeup","Tower makeup valve stuck closed"],["blowdown","Blowdown valve stuck closed"],["chwPump","Chilled water pump coupling broken"]],
 hidden:[],
 scenarios:[{l:"Hot afternoon: scaled condenser tubes and clogged fill. Head pressure and kW per ton climb.",f:["condFoul","fill"],v:{load:100,wb:78},speed:60},
  {l:"Mild morning, light load, tower fan tripped: the chiller surges",f:["towerFan"],v:{load:30,wb:68},speed:60},
  {l:"Blowdown stuck closed: the tower water slowly concentrates and scales the condenser",f:["blowdown"],speed:1000}],
 startMsg(){return `300-ton centrifugal chiller, building load ${this.V.load}%. Tower fan VFD holding ${this.V.tset}°F condenser water.`},
 parts:{
  tower:{n:"Cooling tower",s:"Rejects the building's heat, plus the compressor's, to outdoor air by evaporating a little water.",w:"Induced-draft counterflow: warm condenser water sprays over the fill, the fan pulls air up through it, and the cooled water falls to the basin.",
   y:"Range is the drop across the tower (95 to 85°F at design). Approach is how close the leaving water gets to the outdoor wet bulb (about 7°F at 78°F wet bulb). Each ton of cooling means about 15,000 Btu/h at the tower.",
   f:"Approach rising over time at the same load and wet bulb: fill fouling, poor water distribution, or a fan problem.",src:["tower"],faults:["fill","towerFan"]},
  tfan:{n:"Tower fan and VFD",s:"Pulls air up through the fill.",w:"A VFD speeds the fan up or down to hold the tower water setpoint.",y:"Fan power falls with the cube of speed, so running it slower most of the time saves a lot. With the fan off, natural draft still does a little cooling.",
   f:"Fan tripped: tower water climbs toward the condenser leaving temperature, head pressure rises, and a centrifugal chiller can surge.",src:["tower","surge"],faults:["towerFan"]},
  fill:{n:"Fill",s:"Plastic sheets that spread the water thin.",w:"More wetted surface means more contact between water and air.",y:"Clean fill and even spray are what give the tower its approach.",f:"Scale and debris clog it: less air, less surface, higher approach. Usually caused by poor water treatment.",src:["tower"],faults:["fill"]},
  basin:{n:"Basin",s:"Collects the cooled water.",w:"Holds about 1,500 gallons here. The condenser water pump draws from it.",y:"Level is kept by a float-operated makeup valve.",f:"Low level: the pump draws air (cavitates), condenser water flow drops, and the chiller trips on low flow or high pressure.",src:["tower"],faults:["makeup"]},
  makeup:{n:"Makeup water valve",s:"Replaces the water the tower loses.",w:"A float valve that opens as the basin level falls.",y:"Makeup = evaporation + drift + blowdown. Evaporation is about 0.0008 × gpm × range: around 7 gpm for this plant at full load.",f:"Stuck closed: the basin drains slowly, then the condenser pump cavitates.",src:["epaTower","tower"],faults:["makeup"]},
  blow:{n:"Conductivity controller and blowdown",s:"Keeps dissolved minerals from building up.",w:"Evaporation leaves the minerals behind. When conductivity passes the setpoint, the controller opens the blowdown valve and dumps some concentrated water.",
   y:"Cycles of concentration = tower conductivity ÷ makeup conductivity. Blowdown ≈ evaporation ÷ (cycles − 1). Most towers run 3 to 6 cycles.",f:"Blowdown stuck closed: cycles keep climbing, minerals scale the condenser tubes and fill. Stuck open: wastes water and treatment chemicals.",src:["epaTower","tower"],faults:["blowdown"]},
  cdwp:{n:"Condenser water pump",s:"Moves 900 gpm (3 gpm per ton) between the tower and the condenser.",w:"",y:"Range = heat rejected ÷ (500 × gpm). Less flow means a bigger range and a hotter condenser.",f:"Low flow: high condenser leaving water, high head pressure. Chillers have a flow switch that won't let them run without it.",src:["ahri"],faults:["strainer","makeup"]},
  strainer:{n:"Condenser water strainer",s:"Catches debris before the pump and condenser.",w:"",y:"Open towers collect leaves, dirt and scale, so this needs regular cleaning.",f:"Clogged: condenser water flow drops. The pressure drop across the condenser falls (it goes with flow squared) and the condenser range rises.",src:["tower"],faults:["strainer"]},
  chiller:{n:"Centrifugal chiller",s:"300 tons, R-134a.",w:"A centrifugal compressor pulls refrigerant vapor off the evaporator, compresses it, and the condenser turns it back into liquid. An orifice or float meters it back.",y:"Lift is condenser saturation minus evaporator saturation. More lift means more kW per ton and closer to surge.",f:"",src:["ahri"],faults:[]},
  comp:{n:"Compressor and inlet guide vanes",s:"Centrifugal impeller driven by a hermetic motor.",w:"Inlet guide vanes in front of the impeller open and close to match capacity to the load, holding the chilled water setpoint.",
   y:"Full load here is about 0.56 kW per ton. Lower condenser water improves that, especially at part load.",
   f:"Surge: when lift is too high for the flow (light load with warm condenser water, or poor heat rejection), refrigerant flows backward through the impeller. Loud whoosh, amps swing every few seconds. The control trips after repeated surges. Vanes stuck: capacity can't follow the load.",src:["surge","ahri"],faults:["vanes"]},
  cond:{n:"Condenser",s:"Shell-and-tube: refrigerant outside the tubes, tower water inside.",w:"Two-pass water box at the left end.",
   y:"Condenser approach = refrigerant saturation temperature (from pressure) minus leaving condenser water. Clean, it's about 1–3°F.",
   f:"Approach creeping up over months: scale in the tubes (clean them, fix water treatment). Approach that jumps right after service, with liquid much colder than saturation: air (non-condensables) in the condenser.",src:["approach","pt134"],faults:["condFoul","noncond"]},
  evap:{n:"Evaporator",s:"Flooded shell-and-tube: tubes covered in boiling refrigerant.",w:"Building water flows through the tubes and gives up its heat to the refrigerant.",
   y:"Evaporator approach = leaving chilled water minus refrigerant saturation temperature. Clean and fully charged, it's about 1–3°F.",
   f:"Approach rising with normal flow: low refrigerant charge (top tubes uncovered) or fouled tubes. Low charge also shows as a low refrigerant level in the sight glass.",src:["approach"],faults:["evapFoul","lowCharge"]},
  orifice:{n:"Metering device",s:"Fixed orifice or float valve between condenser and evaporator.",w:"Liquid refrigerant flashes to a lower pressure as it passes.",y:"",f:"",src:["ahri"],faults:["lowCharge"]},
  panel:{n:"Chiller control panel",s:"Shows every temperature and pressure, and holds the safeties.",w:"Safeties here: low evaporator refrigerant temperature (33°F), low leaving chilled water (36°F), high condenser pressure (180 psig), chilled and condenser water flow switches, motor current limit, surge count.",
   y:"Log approaches, kW per ton and pressures every day. Trends find problems before trips do.",f:"A wrong sensor fools the whole control. Compare with a test thermometer.",src:["approach","pt134"],faults:["sensor"]},
  chwp:{n:"Chilled water pump",s:"Moves 720 gpm (2.4 gpm per ton) to the building.",w:"",y:"Chiller load (tons) = gpm × ΔT ÷ 24. At design: 720 × 10 ÷ 24 = 300 tons.",f:"Coupling broken: the motor runs but no water moves. The flow switch trips the chiller.",src:["ahri"],faults:["chwPump"]},
  fs:{n:"Chilled water flow switch",s:"Proves flow before the chiller can run.",w:"",y:"Without flow, water in the evaporator tubes can freeze in seconds and split them.",f:"",src:["ahri"],faults:["chwPump"]},
  ahu:{n:"Air handler coil",s:"The building load.",w:"A control valve feeds the coil as much chilled water as the space needs.",y:"Supply air depends on the chilled water temperature. Water warmer than about 50°F can't dehumidify well.",f:"Building warms when the chiller can't hold its setpoint.",src:["ahri"],faults:[]}},
 init(){return {t:0,dead:null,run:true,chwOn:true,cdwOn:true,labels:true,on:true,trip:null,recyc:false,Tret:51.5,Tsup:44,Tb:74.5,Tlc:81.5,cap:0.75,fan:0.9,level:80,cnd:1450,scale:0,Troom:74,
  Qch:225,Qb:225,Qrej:258,kW:115,Te:42,Tc:84,Pe:37,Pc:96,lift:42,surgeAcc:0,surgeN:[],surging:false,lim:false,bd:false,mk:0,gchw:GCHW,gcdw:GCDW,ang:0,ang2:0,offC:0,offH:0,range:8.6,appT:3,appE:1.4,liftMax:57,logs2:{}}},
 switches:[
  {l:S=>`Chiller: ${S.trip?"TRIPPED":S.run?(S.on?"running":"waiting"):"stopped"}`,on:S=>S.run,act(sim){sim.S.run=!sim.S.run;log(sim,sim.S.run?"Chiller enabled.":"Chiller stopped.")}},
  {l:S=>`Chilled water pump: ${S.chwOn?"on":"off"}`,on:S=>S.chwOn,act(sim){sim.S.chwOn=!sim.S.chwOn}},
  {l:S=>`Condenser water pump: ${S.cdwOn?"on":"off"}`,on:S=>S.cdwOn,act(sim){sim.S.cdwOn=!sim.S.cdwOn}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[
  {id:"glass",l:"Check the refrigerant sight glass",show:S=>true,act(sim){log(sim,sim.F.lowCharge?"Evaporator sight glass: liquid level well below the mark. The charge is low; leak-check before adding refrigerant.":"Evaporator sight glass: refrigerant level at the normal mark.",sim.F.lowCharge?"w":"")}},
  {id:"liq",l:"Compare condenser liquid temperature to saturation",show:S=>S.on,act(sim){const S=sim.S,sat=ptT134(S.Pc),liq=S.Tc-1.2;log(sim,`Condenser pressure ${f0(S.Pc)} psig = ${sat.toFixed(1)}°F saturation. Liquid leaving the condenser: ${liq.toFixed(1)}°F, ${(sat-liq).toFixed(1)}°F below saturation.`+(sat-liq>5?" Far colder than saturation: non-condensables (air) are adding pressure. Purge or recover and evacuate.":" Normal for a clean, air-free condenser."),sat-liq>5?"w":"")}},
  {id:"dp",l:"Read pressure drop across the condenser",show:S=>true,act(sim){const S=sim.S,dp=8*Math.pow(S.gcdw/GCDW,2);log(sim,`Condenser water pressure drop ${dp.toFixed(1)} psi (design 8.0 psi at 900 gpm). Flow ≈ ${f0(GCDW*Math.sqrt(dp/8))} gpm.`+(S.gcdw<0.85*GCDW?" Flow is low: check the strainer, valves and pump.":""),S.gcdw<0.85*GCDW?"w":"")}},
  {id:"coc",l:"Test the tower water",show:S=>true,act(sim){const S=sim.S,c=S.cnd/CMAKE;log(sim,`Tower water ${f0(S.cnd)} µS, makeup ${CMAKE} µS: ${c.toFixed(1)} cycles of concentration.`+(c>6.5?" Too high: scale is forming. Check the blowdown valve.":c<2.5?" Low: wasting water and chemicals.":""),c>6.5?"w":"")}},
  {id:"thermo",l:"Check leaving chilled water with a test thermometer",show:S=>true,act(sim){const S=sim.S;log(sim,`Test thermometer in the leaving chilled water well: ${S.Tsup.toFixed(1)}°F. Panel shows ${(S.Tsup+(sim.F.sensor?5:0)).toFixed(1)}°F.`+(sim.F.sensor?" The panel sensor reads 5°F high: the chiller is overcooling toward the freeze trip.":""),sim.F.sensor?"w":"")}}],
 resets(S){const sim=this;return S.trip?[["Reset the chiller safety",()=>{log(sim,`Safety reset (${S.trip}). Find the cause before restarting.`,"w");S.trip=null;S.surgeN=[];S.cap=0.1}]]:[]},
 reads(S){return [["Load",S.on?`${f0(S.Qch)} tons`:"off"],["kW/ton",S.on&&S.Qch>5?(S.kW/S.Qch).toFixed(2):"—"],["Leaving CHW",`${S.Tsup.toFixed(1)}°F`],["Tower water",`${S.Tb.toFixed(1)}°F`],["Cond approach",S.on?`${(ptT134(S.Pc)-S.Tlc).toFixed(1)}°F`:"—"],["Building",`${S.Troom.toFixed(0)}°F`]]},
 stText(S){return S.trip?"tripped: "+S.trip:!S.run?"stopped":S.recyc?"cycled off (light load)":S.on?(S.surging?"surging":S.lim?"current limit":"running"):"waiting for flow"},
 step(dt){let r=dt;while(r>1e-9){const h=Math.min(0.5,r);this.sub(h);r-=h}},
 sub(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;
  // flows
  const cav=clamp((S.level-10)/15,0,1);
  S.gchw=S.chwOn&&!F.chwPump?GCHW:0;S.gcdw=S.cdwOn?GCDW*(F.strainer?0.55:1)*cav:0;
  const flowOK=S.gchw>0.5*GCHW&&S.gcdw>0.5*GCDW;
  if(S.on&&!flowOK){S.trip=S.gchw<=0.5*GCHW?"loss of chilled water flow":"loss of condenser water flow";log(sim,`Chiller tripped: ${S.trip}.`,"b")}
  // start / recycle shutdown
  const spRead=V.sp,TsupRead=S.Tsup+(F.sensor?5:0);
  if(S.on&&S.cap<=0.12&&TsupRead<V.sp-2){S.recyc=true;if(!S.logs2.rc){S.logs2.rc=1;log(sim,"Load is below the chiller's minimum: it cycled off and will restart when the return water warms.")}}
  if(S.recyc&&S.Tret+(F.sensor?5:0)>V.sp+3){S.recyc=false;S.logs2.rc=0}
  const was=S.on;S.on=S.run&&!S.trip&&flowOK&&!S.recyc;if(S.on&&!was){S.cap=Math.min(S.cap,0.1);log(sim,"Chiller started: flow proven, vanes opening.")}
  // building load and chilled water loop
  const Qdem=V.load/100*CTONS;
  S.Qb=S.gchw>0?Qdem*clamp((76-S.Tsup)/32,0,1):0;
  S.Troom+=((74+22*(1-(Qdem>0?S.Qb/Qdem:1)))-S.Troom)*dt/900;
  // evaporator and compressor
  const Qmax=CTONS*clamp(1+0.012*(55-S.lift),0.5,1.15);
  let tgt=0;if(S.on){const need=S.gchw*(S.Tret-(V.sp-(F.sensor?5:0)))/24;tgt=clamp(need/Qmax,0.1,1)}
  const vmax=F.vanes?0.4:1;
  S.cap+=clamp((tgt-S.cap)*0.05,-0.01,0.01)*dt*2;S.cap=clamp(S.cap,0,vmax);
  if(F.vanes&&S.on)S.cap=0.4;
  S.lim=false;
  let Qch=S.on?S.cap*Qmax:0;
  const plr=Qch/CTONS;
  const appE=S.on?(1.8*plr)*(F.evapFoul?2.6:1)+(F.lowCharge?1.2+7*plr:0):0;
  const Tsup=S.gchw>0?S.Tret-Qch*24/S.gchw:S.Tret;
  const Te=Tsup-appE;
  // condenser
  const kwt=0.56*(0.35+0.65*S.lift/56)*(1+0.2*Math.pow(1-clamp(plr,0.15,1),2)/clamp(plr,0.15,1));
  let kW=S.on?Qch*kwt*(S.surging&&blink(2500)?1.25:1):0;
  if(kW>175){S.lim=true;const k=175/kW;Qch*=k;kW=175;S.cap=Math.min(S.cap,S.cap*k+0.002)}
  const Qrej=Qch+kW*3412/12000;
  const Tlc=S.Tb+(S.gcdw>1?Qrej*24/S.gcdw:0);
  const appC=S.on?1.6*(Qrej/345)*(1+3*S.scale)*(F.condFoul?3.6:1):0;
  const Tc=Tlc+appC;const Pc=ptP134(Tc)+(F.noncond&&S.on?14:0);const TcE=ptT134(Pc);
  S.Qch=Qch;S.kW=kW;S.Qrej=Qrej;S.Tsup=Tsup;S.Te=S.on?Te:Tsup;S.Tc=S.on?Tc:S.Tb;S.Pc=S.on?Pc:ptP134(Math.max(S.Tb,Tsup));S.Pe=S.on?ptP134(Te):ptP134(Tsup);S.Tlc=Tlc;
  S.lift=S.on?TcE-Te:S.lift+(42-S.lift)*Math.min(1,dt/60);S.appE=appE;S.kwt=kwt;
  S.Tret+=(Tsup+(S.gchw>0?S.Qb*24/S.gchw:0)-S.Tret)*Math.min(1,dt/(S.gchw>0?180:900));
  if(S.gchw<=0)S.Tret+=(70-S.Tret)*dt/3600;
  // surge: lift beyond what the impeller can make at this flow
  const liftMax=36+28*plr;S.liftMax=liftMax;
  if(S.on&&S.lift>liftMax){S.surgeAcc+=dt;if(!S.surging){S.surging=true;log(sim,`Surge: loud whoosh from the compressor and the amps swing. Lift ${S.lift.toFixed(0)}°F is too high for ${f0(plr*100)}% load.`,"w")}
   if(S.surgeAcc>6){S.surgeAcc=0;S.surgeN.push(S.t);S.surgeN=S.surgeN.filter(t=>S.t-t<600);if(S.surgeN.length>=5){S.trip="surge protection";S.surging=false;log(sim,"Chiller tripped on surge protection: five surges in ten minutes.","b")}}}
  else{S.surging=false;S.surgeAcc=Math.max(0,S.surgeAcc-dt)}
  // safeties
  if(S.on&&!S.trip){if(S.Te<33){S.trip="low evaporator refrigerant temperature";log(sim,`Chiller tripped: evaporator refrigerant ${S.Te.toFixed(1)}°F (${S.Pe.toFixed(1)} psig), under the 33°F freeze limit.`,"b")}
   else if(S.Tsup<36){S.trip="low leaving chilled water";log(sim,"Chiller tripped: leaving chilled water reached the 36°F low limit.","b")}
   else if(S.Pc>=180){S.trip="high condenser pressure";log(sim,`Chiller tripped: condenser pressure ${f0(S.Pc)} psig (limit 180).`,"b")}}
  if(S.lim&&!S.logs2.lim){S.logs2.lim=1;log(sim,"Motor at 100% of full-load amps: current limit is holding the vanes back.","w")}if(!S.lim)S.logs2.lim=0;
  // cooling tower
  const air=F.towerFan?0.12:Math.max(0.15,S.fan);
  const appT=Math.max(1,7*Math.pow(Math.max(Qrej,10)/345,0.6)*Math.pow(air,-0.6)*(1+0.03*(78-V.wb))*(F.fill?1.9:1)*Math.pow(Math.max(S.gcdw,90)/GCDW,0.4));
  const TlT=S.gcdw>1?V.wb+appT:S.Tb;
  S.Tb+=(TlT-S.Tb)*Math.min(1,dt/150);if(S.gcdw<=1)S.Tb+=(V.wb+8-S.Tb)*dt/3600;
  if(F.towerFan)S.fan=0;else{S.fan=clamp(S.fan+(S.Tb-V.tset)*0.004*dt,0,1)}
  S.range=S.gcdw>1?Qrej*24/S.gcdw:0;S.appT=S.Tb-V.wb;
  if(F.towerFan&&!S.logs2.tf&&S.t>30){S.logs2.tf=1;log(sim,"Tower fan is not turning. The VFD shows a motor overload fault.","w")}
  // tower water: level and conductivity (per minute rates)
  const E=0.0008*S.gcdw*S.range,D=0.00005*S.gcdw;
  if(S.cnd>V.cset+50)S.bd=true;else if(S.cnd<V.cset-50)S.bd=false;
  const B=S.bd&&!F.blowdown?8:0;
  S.mk=F.makeup?0:clamp((80-S.level)/4,0,1)*30;
  const vol=S.level/100*BASIN;
  const nv=Math.max(0,vol+(S.mk-E-D-B)*dt/60);S.level=nv/BASIN*100;
  S.cnd=Math.max(CMAKE,S.cnd+(S.mk*(CMAKE-S.cnd)+E*S.cnd)/Math.max(200,vol)*dt/60);   // evaporation leaves the minerals behind
  if(S.cnd/CMAKE>7)S.scale=Math.min(1,S.scale+dt/(2*3600));   // minerals past their solubility start scaling the condenser tubes
  if(S.level<30&&!S.logs2.lv){S.logs2.lv=1;log(sim,`Tower basin level ${f0(S.level)}%: the condenser water pump is starting to draw air.`,"w")}if(S.level>50)S.logs2.lv=0;
  if(S.cnd/CMAKE>6.5&&!S.logs2.cy){S.logs2.cy=1;log(sim,`Tower water at ${(S.cnd/CMAKE).toFixed(1)} cycles of concentration and climbing. The blowdown isn't keeping up.`,"w")}if(S.cnd/CMAKE<6)S.logs2.cy=0;
  if(S.Troom>78&&!S.logs2.rm){S.logs2.rm=1;log(sim,`Building at ${f0(S.Troom)}°F: the chilled water can't carry the load.`,"w")}if(S.Troom<76)S.logs2.rm=0;
 },
 draw(dt){const S=this.S,F=this.F,V=this.V,p="c_";
  const tR=v=>v.toFixed(1)+"°F";
  txt(p+"tLC",tR(S.Tlc));txt(p+"tEC",tR(S.Tb));txt(p+"tLCH",tR(S.Tsup+(F.sensor?5:0)));txt(p+"tECH",tR(S.Tret));txt(p+"tSup","sup "+tR(S.Tsup));txt(p+"tRet","ret "+tR(S.Tret));
  txt(p+"cPress",`${f0(S.Pc)} psig`);at(p+"cNeedle","transform",`rotate(${(-135+270*clamp(S.Pc/300,0,1)).toFixed(1)} 535 296)`);at(p+"eNeedle","transform",`rotate(${(-135+270*clamp(S.Pe/100,0,1)).toFixed(1)} 300 450)`);txt(p+"ePress",`${S.Pe.toFixed(1)} psig`);at(p+"cPress","fill",S.Pc>160?"var(--bad)":"var(--ink)");
  txt(p+"fanTxt",F.towerFan?"fan TRIPPED":`fan ${f0(S.fan*100)}%`);at(p+"fanTxt","fill",F.towerFan?"var(--bad)":"var(--ink)");
  txt(p+"basinTxt",tR(S.Tb));txt(p+"wbTxt",`Outdoor wet bulb ${V.wb}°F   approach ${S.appT.toFixed(1)}°F   range ${S.range.toFixed(1)}°F`);
  txt(p+"condTxt",`${f0(S.cnd)} µS`);at(p+"bdLed","fill",S.bd?(F.blowdown?"var(--bad)":"var(--ok)"):"var(--lamp-off)");
  const lv=clamp(S.level,0,100);at(p+"water","y",(182-20*Math.min(lv,88)/80).toFixed(1));at(p+"water","height",(20*Math.min(lv,88)/80).toFixed(1));at(p+"float","cy",(184-20*Math.min(lv,88)/80).toFixed(1));
  txt(p+"igvTxt",S.on?`vanes ${f0(S.cap*100)}%`:"vanes closed");txt(p+"roomTxt",`Building ${f0(S.Troom)}°F`);at(p+"roomTxt","fill",S.Troom>77?"var(--bad)":"var(--ink)");
  at(p+"strDirt","opacity",F.strainer?0.9:0);at(p+"fillScale","opacity",F.fill?0.55:0);at(p+"condScale","opacity",(F.condFoul?0.5:0)+0.5*S.scale);
  at(p+"evLiq","height",F.lowCharge?10:22);at(p+"evLiq","y",F.lowCharge?414:402);at(p+"boil","opacity",S.on?(blink(400)?0.9:0.4):0);at(p+"fsL","fill",S.gchw>0.5*GCHW?"var(--ok)":"var(--bad)");
  at(p+"igv","transform",`rotate(${(S.cap*60).toFixed(0)} 412 272)`);
  at(p+"compG","transform",S.surging?`translate(${blink(150)?1.5:-1.5} 0)`:"");
  // fan blades seen from the side
  if(!F.towerFan)S.ang=(S.ang+dt*600*S.fan)%360;[0,1,2].forEach(i=>{const c=Math.cos((S.ang+i*120)*Math.PI/180);const w=42*Math.abs(c);at(p+"bl"+i,"x",(c>0?122:122-w).toFixed(1));at(p+"bl"+i,"width",w.toFixed(1))});
  S.ang2=(S.ang2+dt*720)%360;if(S.cdwOn)at(p+"cdwImp","transform",`rotate(${S.ang2.toFixed(0)} 192 442)`);if(S.chwOn)at(p+"chwImp","transform",`rotate(${S.ang2.toFixed(0)} 614 446)`);at(p+"ahuFan","transform",`rotate(${S.ang2.toFixed(0)} 762 110)`);
  S.offC-=dt*30*S.gcdw/GCDW;S.offH-=dt*30*S.gchw/GCHW;
  ["cdwS","cdwS2","cdwR"].forEach(k=>{const e=$(p+k);if(e)e.style.strokeDashoffset=S.offC});["chwS","chwS2","chwR"].forEach(k=>{const e=$(p+k);if(e)e.style.strokeDashoffset=S.offH});
  const rn=$(p+"rain");if(rn){rn.style.strokeDashoffset=-S.offC*1.5;rn.style.opacity=S.gcdw>1?0.8:0}
  const st=this.stText(S);
  const L=[`LCHW ${tR(S.Tsup+(F.sensor?5:0))}  ECHW ${tR(S.Tret)}  SP ${V.sp}`,`LCW  ${tR(S.Tlc)}  ECW  ${tR(S.Tb)}`,
   `Evap ${S.Pe.toFixed(1)} psig = ${ptT134(S.Pe).toFixed(1)}°F sat`,`Cond ${f0(S.Pc)} psig = ${ptT134(S.Pc).toFixed(1)}°F sat`,
   S.on?`Evap appr ${(S.Tsup+(F.sensor?5:0)-ptT134(S.Pe)).toFixed(1)}°F  Cond appr ${(ptT134(S.Pc)-S.Tlc).toFixed(1)}°F`:"Approaches: —",
   `Load ${f0(S.Qch)} t  Vanes ${f0(S.cap*100)}%  Lift ${S.on?S.lift.toFixed(0):"—"}°F`,
   S.on?`kW ${f0(S.kW)}  ${(S.Qch>5?S.kW/S.Qch:0).toFixed(2)} kW/t  FLA ${f0(S.kW/175*100)}%`:"kW 0",`Surges (10 min) ${S.surgeN.length}`,`Status: ${st.toUpperCase()}`];
  L.forEach((t,i)=>txt(p+"d"+i,t));at(p+"d8","fill",S.trip?"#ff7b6b":S.surging||S.lim?"#ffd34d":"#9fe0a8");
  document.querySelectorAll("#svg .lbl,#svg .lblS").forEach(e=>e.style.opacity=S.labels===false?0:1)},
 boom(){return{t:"",b:"",wreck:0}}};
CHILL.lampOn=S=>({run:S.on,lim:S.lim,surge:S.surging,trip:!!S.trip,warm:S.Troom>77,low:S.level<30,cyc:S.cnd/CMAKE>6});
CHILL.ptT=ptT134;CHILL.ptP=ptP134;
