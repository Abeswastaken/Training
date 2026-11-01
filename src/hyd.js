/* ============ HYDRONIC AIR HANDLER (boiler, circulator, zone valve, hot water coil) ============ */
SRC.hwc=["First Co HWC hot water coil data: HWC1520 at 1200 CFM, 70°F entering air: 66.3 MBH at 3 GPM / 180°F, 74.3 at 5 GPM, 42.2 at 3 GPM / 140°F","https://firstco.com/wp-content/uploads/2021/08/HWC_09_15_2025.pdf"];
SRC.hctl=["IRC hydronic heating controls (zone valve end switches fire the boiler, high limit no more than 210°F, outdoor reset)","https://www.jaspector.com/codes/irc-2024/ch20-boilers-water-heaters/hydronic-heating-controls-irc-2024/"];
SRC.hair=["BC Plumbing textbook: air elimination, air locks (gurgling, uneven heat), bleeding from the highest point","https://opentextbc.ca/plumbing4f/wp-json/pressbooks/v2/chapters/136"];
SRC.hdt=["Heating coil delta T: Btu/h = 500 × GPM × water ΔT, and 1.08 × CFM × air ΔT","https://industrialmonitordirect.com/blogs/knowledgebase/hvac-heating-coil-delta-t-calculating-heat-transfer-when-boiler-temperature-drops"];

PHOTOS.ahu={boiler:[gimg("cast iron hot water boiler residential")],trid:[gimg("boiler tridicator pressure temperature gauge")],aquastat:[gimg("boiler aquastat L8148")],expt:[gimg("hydronic expansion tank")],fill:[gimg("boiler fill valve pressure reducing")],
 circ:[gimg("Taco 007 circulator pump")],zv:[gimg("Taco zone valve 570")],coil:[gimg("hydronic air handler hot water coil")],vent:[gimg("coil air vent manual bleeder")],bal:[gimg("circuit setter balancing valve")],
 fdelay:[gimg("strap on aquastat pipe sensor")],board:[gimg("hydronic air handler control board")],blower:[gimg("air handler blower ECM")],afilter:[gimg("air handler filter")],tstat:[gimg("heating thermostat")],house:[gimg("supply register warm air")]};

const WLAMP=[["call","Heat call","g"],["zv","Zone valve open","g"],["es","End switch","g"],["fire","Boiler firing","g"],["pump","Circulator","g"],["fan","Blower","g"],["cold","Coil cold","a"]];
const BOILER_IN=100000,BOILER_EFF=0.84;
// counterflow effectiveness, UA tuned to First Co HWC1520 data (rises a little with water flow)
function coilQ(gpm,cfm,ewt,eat,ua){if(gpm<=0.01||cfm<=1)return 0;const Ca=1.08*cfm,Cw=500*gpm,Cmin=Math.min(Ca,Cw),Cmax=Math.max(Ca,Cw),Cr=Cmin/Cmax;
 const ntu=0.82*1296/Cmin*Math.pow(gpm/3,0.1)*Math.pow(cfm/1200,0.5)*ua;const e=Math.abs(1-Cr)<1e-6?ntu/(1+ntu):(1-Math.exp(-ntu*(1-Cr)))/(1-Cr*Math.exp(-ntu*(1-Cr)));return e*Cmin*(ewt-eat)}

ILL.zv=`${pipeH(4,156,80,10)}${box(54,22,52,40,"#e9ecee",4)}${box(64,62,32,14,"#c9a24a",2)}<circle cx="96" cy="32" r="4" fill="#3fa34d"/>${label(80,46,"ZONE VALVE",K,7)}${label(80,110,"motor head + end switch",K,6)}`;
ILL.circ=`${pipeH(4,40,70,10)}${pipeH(120,156,70,10)}<circle cx="80" cy="70" r="30" fill="#2f6a3a" stroke="${K}"/>${box(60,20,40,24,"#2f3337",4)}${label(80,74,"CIRCULATOR",WH,7)}${label(80,114,"arrow shows flow direction",K,6)}`;
ILL.coil=`${box(14,30,132,60,"#59626a",3)}${fins(18,34,124,52,4,"#9aa3aa")}${Array.from({length:4},(_,i)=>`<line x1="18" y1="${40+i*13}" x2="142" y2="${40+i*13}" stroke="#c4884a" stroke-width="3"/>`).join("")}${label(80,110,"HOT WATER COIL",K,7)}`;
ILL.vent=`${pipeV(80,60,110,10)}${box(66,30,28,30,"#c9a24a",3)}<circle cx="80" cy="26" r="6" fill="#9aa1a8" stroke="${K}"/>${label(80,118,"AIR VENT AT THE HIGH POINT",K,6)}`;
ILL.trid=`<circle cx="80" cy="56" r="40" fill="#f4f4f0" stroke="${K}" stroke-width="2"/><path d="M80 56 L58 40" stroke="#d23a26" stroke-width="2"/><path d="M80 56 L104 70" stroke="${K}" stroke-width="2"/>${label(80,90,"PSI · °F",K,7)}${label(80,114,"TRIDICATOR",K,7)}`;
ILL.expt=`<rect x="56" y="20" width="48" height="80" rx="22" fill="#9aa1a8" stroke="${K}"/>${pipeV(80,100,118,8)}${label(80,64,"EXP. TANK",K,7)}`;
ILL.bal=`${pipeH(4,156,70,10)}${box(56,52,48,36,"#c9a24a",4)}${box(72,30,16,22,"#d23a26",2)}${label(80,110,"BALANCING VALVE",K,7)}`;

function wSvg(p){
 const pipe=(d,id,w=8)=>`<path d="${d}" fill="none" stroke="#5a2a12" stroke-width="${w+2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="url(#zCuH)" stroke-width="${w}" stroke-linejoin="round"/><path id="${id}" class="air" d="${d}" stroke-width="3"/>`;
 return `
<line x1="10" y1="462" x2="790" y2="462" stroke="var(--line)" stroke-dasharray="2 4"/>
<!-- house -->
<g class="part" data-p="house" tabindex="0">
 <path d="M520 154 L658 66 L796 154 Z" fill="#6b5a4a" stroke="#3b2f25" stroke-width="2"/><path d="M528 150 L658 72 L788 150" fill="none" stroke="#8a7562" stroke-width="3"/>
 <rect class="hl" x="530" y="150" width="256" height="300" rx="2" fill="url(#zCabIn)" fill-opacity=".35" stroke="#a89a85" stroke-width="5"/>
</g>
<text class="lbl" x="546" y="178">House</text><text class="val" id="${p}roomTxt" x="546" y="198">68.0°F</text>
<text class="lbl" x="700" y="40">Outdoors</text><text class="val" id="${p}outTxt" x="700" y="58">30°F</text>
<g class="part" data-p="tstat" tabindex="0">
${zTstat(720,230,44,50,p+"tstatTxt",p+"tstatLamp","70")}
 <text class="lblS" x="742" y="292" text-anchor="middle">Thermostat</text>
</g>
<!-- supply duct -->
<rect x="296" y="34" width="124" height="58" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.5"/>
<path d="M420 46 H600 V150" fill="none" stroke="#6f787e" stroke-width="26" stroke-linejoin="round"/><path d="M420 46 H600 V150" fill="none" stroke="#c9cfd4" stroke-width="22" stroke-linejoin="round"/><path d="M420 42 H596 V150" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>
<rect x="582" y="148" width="36" height="9" fill="url(#zSteel)" stroke="#5f686d"/>
<text class="lblS" x="300" y="28">Supply plenum</text><text class="val" id="${p}supTxt" x="330" y="80" font-size="12">68°F</text>
<g id="${p}aSupG"><path id="${p}aSup" class="air" d="M370 250 V48 H590 V200 M600 160 V230"/><path id="${p}aSupH" d="M594 222 l6 10 6 -10" fill="none" stroke-width="2.5"/></g>
<!-- return duct -->
<path d="M560 412 H450" fill="none" stroke="#6f787e" stroke-width="40"/><path d="M560 412 H450" fill="none" stroke="#c9cfd4" stroke-width="36"/><path d="M560 396 H450" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>
<rect x="550" y="380" width="10" height="64" fill="url(#zGrille)" stroke="#5f686d"/>
<g id="${p}aRetG"><path id="${p}aRet" class="air" d="M556 412 H454"/><path id="${p}aRetH" d="M460 406 l-10 6 10 6" fill="none" stroke-width="2.5"/></g>
<text class="lblS" x="470" y="446">Return air</text><text class="val" id="${p}retTxt" x="520" y="370" font-size="12">68°F</text>

<!-- air handler -->
<rect x="290" y="92" width="160" height="360" rx="3" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="296" y="98" width="148" height="348" fill="url(#zCabIn)" stroke="#9aa3a9"/>
${[[294,96],[446,96],[294,448],[446,448]].map(([x,y])=>zScrew(x,y,2.2)).join("")}
<text class="zl" x="300" y="112">Air handler</text>
<g class="part" data-p="coil" tabindex="0">
 <rect class="hl" x="302" y="176" width="136" height="56" rx="2" fill="#4d555a" stroke="#2a2f33"/><rect x="306" y="180" width="128" height="48" fill="url(#zFins)"/>
 <g id="${p}tubes">${[188,200,212,224].map(y=>`<line x1="304" y1="${y}" x2="436" y2="${y}" stroke="#c4884a" stroke-width="3.2" opacity=".9"/>`).join("")}</g>
 <rect id="${p}coilDirt" x="306" y="220" width="128" height="10" fill="#6a5a3a" opacity="0"/>
 <g id="${p}bubbles" opacity="0">${[320,350,380,410].map((x,i)=>`<circle cx="${x}" cy="${188+(i%2)*12}" r="3" fill="#fff" stroke="#6fb3e8"/>`).join("")}</g>
 <text class="valD" fill="#1d2327" id="${p}coilTxt" x="370" y="170" text-anchor="middle">COIL</text>
</g>
<g class="part" data-p="vent" tabindex="0">
 <path d="M436 188 H446 V160" stroke="url(#zCuV)" stroke-width="5" fill="none"/>
 <rect class="hl" x="440" y="146" width="12" height="16" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/><circle cx="446" cy="144" r="3" fill="#9aa1a8"/>
 <path id="${p}spit" d="M452 146 q8 -6 14 -2" stroke="#6fb3e8" stroke-width="2" fill="none" opacity="0"/>
</g>
<g class="part" data-p="board" tabindex="0">
 <rect class="hl" x="304" y="250" width="58" height="34" rx="2" fill="url(#zGreen)" stroke="#0e2414" filter="url(#zShadow)"/>
 <circle id="${p}led" cx="352" cy="258" r="3.5" fill="var(--lamp-off)"/>
 <text id="${p}brdTxt" x="333" y="276" text-anchor="middle" font-family="var(--mono)" font-size="7" fill="#e9ecee">STANDBY</text>
</g>
<g class="part" data-p="afilter" tabindex="0">
${zFilter(430,320,16,124,p+"dirt")}
</g>
<g class="part" data-p="blower" tabindex="0">
${zBlower(366,384,42,p+"blades")}<text class="zl" x="366" y="444" text-anchor="middle">Blower</text>
</g>

<!-- boiler -->
<g class="part" data-p="boiler" tabindex="0">
 <rect class="hl" x="30" y="220" width="124" height="222" rx="4" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/>
 <rect x="36" y="226" width="112" height="210" fill="url(#zCabIn)" stroke="#9aa3a9"/>
 <rect x="54" y="370" width="76" height="44" rx="3" fill="#1b1f22" stroke="#000"/>
 <g id="${p}flame">${[66,82,98,114].map(x=>`<path d="M${x-6} 410 Q${x} 382 ${x+6} 410 Z" fill="#3d7de0"/>`).join("")}</g>
 <text class="zl" x="40" y="240">Boiler</text>
 <text class="valD" fill="#1d2327" id="${p}btTxt" x="92" y="356" text-anchor="middle">180°F</text>
</g>
<g class="part" data-p="trid" tabindex="0">
 <circle class="hl" cx="70" cy="282" r="18" fill="#f4f4f0" stroke="#4d555a" stroke-width="2" filter="url(#zShadow)"/>
 <path id="${p}tNeedle" d="M70 282 L58 276" stroke="#d23a26" stroke-width="1.6"/><path id="${p}pNeedle" d="M70 282 L80 292" stroke="#1d2327" stroke-width="1.6"/>
 <text class="val" id="${p}psiTxt" x="40" y="318" font-size="10">12 psi</text>
</g>
<g class="part" data-p="aquastat" tabindex="0">
 <rect class="hl" x="104" y="262" width="40" height="32" rx="3" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 <circle id="${p}aqLamp" cx="136" cy="270" r="3" fill="var(--lamp-off)"/>
 <text x="124" y="288" text-anchor="middle" font-family="var(--display)" font-size="7" fill="#e9ecee">AQUASTAT</text>
</g>
<!-- piping -->
${pipe("M92 220 V124 H286 V188 H302",p+"wSup")}
${pipe("M302 224 H262 V452 H118 V442",p+"wRet")}
<g class="part" data-p="expt" tabindex="0">
 <path d="M150 124 V140" stroke="url(#zCuV)" stroke-width="5"/>
 <rect class="hl" x="136" y="138" width="28" height="54" rx="12" fill="url(#zSteel)" stroke="#4d555a" filter="url(#zShadow)"/>
 <text class="tag" x="150" y="206" text-anchor="middle" fill="var(--muted)">EXP. TANK</text>
</g>
<g class="part" data-p="fill" tabindex="0">
 <path d="M118 124 V104 H70" stroke="url(#zCuH)" stroke-width="5" fill="none"/>
 <rect class="hl" x="96" y="96" width="18" height="16" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/>
 <text class="tag" x="62" y="98" fill="var(--muted)">FILL VALVE</text>
</g>
<g class="part" data-p="circ" tabindex="0">
 <circle class="hl" cx="196" cy="124" r="15" fill="#2f6a3a" stroke="#14301a" filter="url(#zShadow)"/>
 <g id="${p}imp">${[0,1,2].map(i=>`<line x1="${196-9*Math.cos(i*Math.PI/3)}" y1="${124-9*Math.sin(i*Math.PI/3)}" x2="${196+9*Math.cos(i*Math.PI/3)}" y2="${124+9*Math.sin(i*Math.PI/3)}" stroke="#bfe0c4" stroke-width="2"/>`).join("")}</g>
 <rect x="184" y="98" width="24" height="12" rx="2" fill="url(#zPlasticDk)"/>
 <text class="tag" x="196" y="94" text-anchor="middle" fill="var(--muted)">CIRCULATOR</text>
</g>
<g class="part" data-p="zv" tabindex="0">
 <rect class="hl" x="232" y="102" width="34" height="18" rx="3" fill="url(#zPlastic)" stroke="#8f887a" filter="url(#zShadow)"/>
 <rect x="240" y="118" width="18" height="12" fill="url(#zBrass)" stroke="#6a4a12"/>
 <circle id="${p}esLamp" cx="260" cy="110" r="3" fill="var(--lamp-off)"/>
 <rect id="${p}zvPos" x="236" y="112" width="2" height="4" fill="#1d2327"/>
 <text class="tag" x="249" y="96" text-anchor="middle" fill="var(--muted)">ZONE VALVE</text>
</g>
<g class="part" data-p="fdelay" tabindex="0">
 <rect class="hl" x="278" y="170" width="16" height="12" rx="2" fill="url(#zPlasticDk)" stroke="#000"/>
 <circle id="${p}fdLamp" cx="286" cy="176" r="2.5" fill="var(--lamp-off)"/>
</g>
<g class="part" data-p="bal" tabindex="0">
 <rect class="hl" x="254" y="330" width="16" height="24" rx="2" fill="url(#zBrass)" stroke="#6a4a12" filter="url(#zShadow)"/>
 <rect x="244" y="338" width="10" height="8" fill="#d23a26"/>
 <text class="tag" x="236" y="372" fill="var(--muted)">BALANCE</text>
</g>
<g id="${p}burst" opacity="0"><path d="M270 240 l10 6 -6 6 12 6" stroke="var(--bad)" stroke-width="3" fill="none"/></g>
<!-- readouts -->
<g class="part" data-p="readout" tabindex="0">
 <rect class="hl" x="160" y="250" width="92" height="98" rx="5" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 <rect x="165" y="262" width="82" height="80" rx="3" fill="#b9c7a8"/>
 <text x="206" y="259" text-anchor="middle" font-family="var(--display)" font-size="7.5" fill="#e9ecee">WATER SIDE</text>
 ${["ewt","lwt","gpm","btuw","btua"].map((k,i)=>`<text id="${p}r_${k}" x="169" y="${276+i*15}" font-family="var(--mono)" font-size="9.5" fill="#142014"></text>`).join("")}
</g>`}

const AHU={id:"ahu",p:"w_",name:"Hydronic air handler",svg:wSvg("w_"),lamps:WLAMP,txvOnly:[],
 sliders:[
  {k:"set",l:"Thermostat (heating)",u:"°F",min:50,max:85,step:1,v:70,n:[65,75],note:"Normal 65–75°F"},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-20,max:65,step:1,v:25,note:"Colder outdoors means longer run times."},
  {k:"bset",l:"Boiler water temperature",u:"°F",min:110,max:210,step:5,v:180,n:[160,190],note:"Aquastat setting. The coil was sized for 180°F water; at 140°F it gives about a third less heat."},
  {k:"gpm",l:"Water flow (balancing valve)",u:" GPM",min:0.5,max:9,step:0.5,v:4,n:[3,6],note:"About 4 GPM here. This coil drops the water 30–40°F at that flow; baseboard is usually designed for 20°F."},
  {k:"cfm",l:"Blower airflow",u:" CFM",min:400,max:2000,step:50,v:1200,n:[1000,1400],note:"Rated 1200 CFM for this coil.",more:1},
  {k:"fdon",l:"Fan delay: blower on at",u:"°F",min:80,max:160,step:5,v:110,n:[100,120],note:"Coil water temperature before the blower starts, so it doesn't blow cold air.",more:1}],
 faults:[["zvMotor","Zone valve motor burned out"],["endSw","Zone valve end switch fails open"],["circ","Circulator seized"],["air","Air trapped in the coil"],["lowP","System pressure low (air keeps coming back)"],
  ["strainer","Strainer clogged with sludge"],["boiler","Boiler locked out (won't fire)"],["coilDirty","Coil fins clogged with dust"],["afilter","Dirty air filter"],["blower","Blower motor fails"],["fdelay","Fan delay sensor failed (reads cold)"],
  ["freeze","Coil froze and split (no heat during a cold snap)"]],
 hidden:["freeze"],
 scenarios:[{l:"Gurgling and no heat: low system pressure, air keeps collecting in the coil",f:["lowP"]},
  {l:"Boiler cycling on its aquastat while the house is cold: circulator seized",f:["circ"],v:{out:5}},
  {l:"Lukewarm air: boiler turned down to 130°F and the balancing valve nearly shut",f:[],v:{bset:130,gpm:1.5}}],
 startMsg(){return `Hydronic air handler started. House ${this.S.Troom.toFixed(1)}°F, outdoors ${this.V.out}°F. Boiler aquastat ${this.V.bset}°F.`},
 parts:{
  board:{n:"Air handler control",s:"Takes the thermostat call and runs the zone valve and blower.",w:"A 24 V control in the air handler.",y:"Heat call (W): it powers the zone valve. When the valve is fully open its end switch closes, which starts the circulator and fires the boiler. The blower waits until the coil water is hot (fan delay).",f:"No 24 V at the valve: check the transformer and the thermostat wiring first.",src:["hctl"],faults:[]},
  zv:{n:"Zone valve",s:"Opens the hot water path to this coil.",w:"A motorized valve (Taco or Honeywell style) with a manual-open lever and an end switch.",y:"It takes about half a minute to drive open. The end switch closes only when it's fully open; that switch is what calls the boiler and circulator.",
   f:"Burned-out motor: the valve stays shut, the end switch never closes, nothing else starts. As a temporary fix, set the manual lever to open. Failed end switch: the valve opens, but the boiler and circulator never get the call.",src:["hctl"],faults:["zvMotor","endSw"]},
  circ:{n:"Circulator",s:"Pumps the hot water around the loop.",w:"A wet-rotor circulator (Taco 007 style), pumping away from the expansion tank.",y:"Runs whenever the end switch calls.",f:"Seized: the boiler heats up and cycles on its aquastat, the pipes near the coil stay cool, and the blower never starts. Feel the pipes on both sides of the boiler.",src:["hctl"],faults:["circ"]},
  coil:{n:"Hot water coil",s:"Copper tubes with aluminum fins: hot water in the tubes, house air across the fins.",w:"Sized here like a First Co HWC1520: about 66,000 Btu/h at 3 GPM and 180°F water with 1200 CFM of 70°F air.",
   y:"Heat out of the water = 500 × GPM × water ΔT. Heat into the air = 1.08 × CFM × air ΔT. They should match within your measurement error. More flow helps a little; hotter water helps a lot.",
   f:"Air-bound: gurgling, the top tubes stay cool, almost no heat. Dirty fins: low airflow and less heat. A coil exposed to freezing air with no flow can freeze and split.",src:["hwc","hdt","hair"],faults:["air","coilDirty","freeze"]},
  vent:{n:"Coil air vent",s:"Lets trapped air out of the coil's high point.",w:"A manual bleeder or automatic float vent at the top of the coil.",y:"Bleed with the pump off until solid water comes out with no sputtering.",f:"If air keeps coming back, the system pressure is low or something is drawing air in.",src:["hair"],faults:["air","lowP"]},
  trid:{n:"Tridicator",s:"Boiler pressure and temperature gauge.",w:"One gauge reading psi and °F.",y:"A typical residential system is filled to about 12 psi cold (enough to lift water to the top of the system plus a few psi) and rises a few psi when hot.",f:"Low pressure: air comes out of solution at the high points. Pressure that climbs to the relief setting (30 psi) when hot: waterlogged expansion tank.",src:["hair"],faults:["lowP"]},
  aquastat:{n:"Boiler aquastat",s:"Holds the boiler water temperature.",w:"An operating control (L8148 style) that fires the burner below its setting minus a differential.",y:"180°F is common for coils and baseboard; outdoor reset lowers it in mild weather. The L8148 dial goes to 240°F, but keep the high limit at or below the boiler maker's maximum (often 200–220°F).",f:"Set too low: the coil can't make enough heat. Boiler cycling on its aquastat while the house is cold means the heat isn't leaving the boiler.",src:["hctl"],faults:[]},
  boiler:{n:"Boiler",s:"Heats the water.",w:`About ${BOILER_IN/1000},000 Btu/h input, ${Math.round(BOILER_EFF*100)}% efficient here.`,y:"It fires on the call from the zone valve end switch.",f:"Locked out: the coil stays cold even though the valve and pump work.",src:["hctl"],faults:["boiler"]},
  expt:{n:"Expansion tank",s:"Absorbs the water's expansion as it heats.",w:"A diaphragm tank with an air charge set to the fill pressure.",y:"Pump away from it so the circulator raises loop pressure instead of lowering it.",f:"Waterlogged: pressure swings to the relief valve when hot.",src:["hair"],faults:[]},
  fill:{n:"Fill valve",s:"Feeds water in to hold the cold fill pressure.",w:"A pressure-reducing valve set to about 12 psi, with a backflow preventer.",y:"",f:"Closed or failed: a slow leak lets pressure fall and air gets in.",src:["hair"],faults:["lowP"]},
  bal:{n:"Balancing valve",s:"Sets the water flow to the coil.",w:"A valve with a flow readout or pressure taps.",y:"Set for the design flow, here about 4 GPM.",f:"Nearly closed: big water ΔT, low heat.",src:["hdt"],faults:[]},
  fdelay:{n:"Fan delay sensor",s:"Keeps the blower off until the coil is hot.",w:"A strap-on sensor on the coil supply pipe.",y:"Blower on at about 110°F of coil water, off about 10°F lower.",f:"Failed reading cold: the coil gets hot but the blower never starts.",src:[],faults:["fdelay"]},
  blower:{n:"Blower",s:"Moves house air across the coil.",w:"",y:"",f:"",src:[],faults:["blower"]},
  afilter:{n:"Air filter",s:"Keeps dust off the coil.",w:"",y:"",f:"Dirty: low airflow. The leaving air gets hotter but the house gets less heat.",src:[],faults:["afilter"]},
  readout:{n:"Water-side readings",s:"What thermometers and a flow readout on the coil piping would show.",w:"EWT: entering water. LWT: leaving water. Btu/h from the water and from the air.",y:"500 × GPM × (EWT − LWT) should match 1.08 × CFM × (supply air − return air).",f:"",src:["hdt"],faults:[]},
  tstat:{n:"Thermostat",s:"Calls for heat when the house is cool.",w:"",y:"",f:"",src:[],faults:[]},
  house:{n:"House",s:"Where the heat goes.",w:"",y:"",f:"",src:[],faults:[]}},
 init(){const V=this.V;return {t:0,dead:null,Troom:V.set-2,mode:"heat",fan:"auto",calling:false,zv:0,es:false,fire:false,pump:false,Tb:V.bset-10,Twc:V.set-2,ewt:0,lwt:0,gpm:0,Q:0,Tsup:V.set-2,blowerOn:false,
  air:0,airDone:false,manual:false,psi:12,labels:true,ang:0,iang:0,aoff:0,woff:0,logs2:{}}},
 switches:[
  {l:S=>`Thermostat: ${S.mode}`,on:S=>S.mode==="heat",act(sim){sim.S.mode=sim.S.mode==="heat"?"off":"heat";log(sim,`Thermostat set to ${sim.S.mode}.`)}},
  {l:S=>`Fan: ${S.fan}`,on:S=>S.fan==="on",act(sim){sim.S.fan=sim.S.fan==="auto"?"on":"auto";log(sim,`Fan set to ${sim.S.fan}.`)}},
  {l:S=>`Zone valve lever: ${S.manual?"manual open":"auto"}`,on:S=>S.manual,act(sim){sim.S.manual=!sim.S.manual;log(sim,sim.S.manual?"Zone valve lever set to manual open. The end switch doesn't close in manual, so the boiler and pump still need a call.":"Zone valve lever back to auto.")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[],
 resets(S){const r=[],sim=this;
  if(S.air>0.05)r.push(["Bleed the coil's air vent",()=>{S.air=0;log(sim,this.F.lowP?"Air bled out of the coil. Pressure is still low, so it will collect again.":"Air bled out until solid water came out. Flow restored.","")}]);
  if(this.F.lowP)r.push(["Feed water to 12 psi (fill valve)",()=>{this.F.lowP=false;if(typeof syncFaults==="function")syncFaults();log(sim,"System refilled to 12 psi cold. Look for the leak that let it drop.")}]);
  if(this.F.boiler)r.push(["Reset the boiler",()=>{this.F.boiler=false;if(typeof syncFaults==="function")syncFaults();log(sim,"Boiler reset. If it locks out again, read its fault code.")}]);
  return r},
 reads(S){return [["House",`${S.Troom.toFixed(1)}°F`],["Boiler",`${f0(S.Tb)}°F`],["Water ΔT",S.gpm>0.05?`${f0(S.ewt-S.lwt)}°F`:"—"],["Flow",`${S.gpm.toFixed(1)} GPM`],["Air rise",S.blowerOn?`${f0(S.Tsup-S.Troom)}°F`:"—"],["State",this.stText(S)]]},
 stText(S){if(S.dead)return "failed";if(!S.calling)return S.blowerOn?"fan purge":"standby";if(S.zv<0.95&&!S.manual)return "valve opening";if(!S.es)return "no end switch";if(!S.blowerOn)return "heating coil";return "heating"},
 step(dt){const S=this.S;let r=dt;while(r>1e-9){const h=Math.min(0.25,r);this.sub(h);r-=h;if(S.dead)return}},
 sub(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;
  if(S.mode==="heat"){if(!S.calling&&S.Troom<V.set-0.75){S.calling=true;log(sim,"Thermostat calls for heat. Zone valve powered.")}else if(S.calling&&S.Troom>V.set+0.75){S.calling=false;log(sim,"Thermostat satisfied. Zone valve closes.")}}else S.calling=false;
  // zone valve: about 30 s to open, spring return
  const wasOpen=S.zv>=0.95;
  if(S.calling&&!F.zvMotor)S.zv=Math.min(1,S.zv+dt/30);else S.zv=Math.max(0,S.zv-dt/8);
  const open=Math.max(S.zv,S.manual?1:0);
  if(S.zv>=0.95&&!wasOpen&&S.calling)log(sim,F.endSw?"Zone valve fully open, but its end switch didn't close.":"Zone valve fully open. End switch closed: circulator on, boiler called.");
  if(S.calling&&F.zvMotor&&!S.logs2.zv&&S.t>2){S.logs2.zv=1;log(sim,"Zone valve has 24 V but isn't moving.","w")}
  S.es=S.zv>=0.95&&!F.endSw;
  S.pump=S.es&&!F.circ;
  // boiler aquastat (15°F differential)
  const want=S.es&&!F.boiler;
  if(want){if(!S.fire&&S.Tb<=V.bset-15){S.fire=true}else if(S.fire&&S.Tb>=V.bset){S.fire=false}}else S.fire=false;
  // air in the coil
  if(F.air&&!S.airDone){S.airDone=true;S.air=1}
  if(F.lowP&&S.pump&&S.air<1)S.air=Math.min(1,S.air+dt/240);
  S.psi=(F.lowP?3.5:12)+Math.max(0,S.Tb-70)*0.03+(S.pump?1.5:0);
  // water flow
  let gpm=S.pump?V.gpm*Math.min(1,open*1.1)*(1-0.95*S.air)*(F.strainer?0.35:1):0;
  if(F.freeze)gpm=0;
  S.gpm=gpm;
  // coil
  const cfm=S.blowerOn?V.cfm*(F.afilter?0.55:1)*(F.coilDirty?0.7:1):0;S.cfm=cfm;
  const ewt=S.Tb;S.ewt=ewt;
  let Q=0;
  if(gpm>0.01){S.Twc+=(ewt-S.Twc)*Math.min(1,dt*gpm/1.5);
   Q=cfm>0?coilQ(gpm,cfm,S.Twc,S.Troom,(F.coilDirty?0.7:1)*(1-0.6*S.air)):0;S.lwt=S.Twc-Q/(500*gpm)}
  else{const cool=(cfm>0?cfm*0.004:0.4)*(S.Twc-S.Troom);S.Twc-=cool*dt/120;Q=cfm>0?cool*500/120*3:0;S.lwt=S.Twc}
  S.Q=Q;
  S.Tsup=cfm>0?S.Troom+Q/(1.08*cfm):S.Troom;
  // boiler water
  const Cb=220,qin=S.fire?BOILER_IN*BOILER_EFF:0,qout=gpm>0.01?500*gpm*(S.Tb-S.lwt):0;
  S.Tb+=(qin-qout-90*(S.Tb-65))/3600/Cb*dt;
  if(S.Tb>=212&&!S.logs2.hot){S.logs2.hot=1;log(sim,"Boiler water at 212°F.","b")}
  // fan delay
  const sensed=F.fdelay?50:S.Twc;
  const fanOK=S.blowerOn?sensed>V.fdon-10:sensed>=V.fdon;
  if(S.calling&&fanOK&&!S.blowerOn&&S.fan==="auto"&&!F.blower)log(sim,`Coil water at ${f0(S.Twc)}°F. Blower on.`);
  S.blowerOn=!F.blower&&(S.fan==="on"||(fanOK&&(S.calling||S.Twc>V.fdon-10)&&S.Twc>S.Troom+5&&(S.calling||S.zv>0)));
  // house
  S.Troom+=((cfm>0?Q:0)-857*(S.Troom-V.out))/3600/3000*dt;
  // logs
  if(S.pump&&S.air>0.5&&!S.logs2.gurg){S.logs2.gurg=1;log(sim,"Gurgling in the coil piping. Water is barely moving.","w")}
  if(S.air<0.2)S.logs2.gurg=0;
  if(S.calling&&S.es&&F.circ&&S.Tb>=V.bset-1&&!S.logs2.circ){S.logs2.circ=1;log(sim,`Boiler is up to ${f0(S.Tb)}°F and cycling on its aquastat, but the coil pipe is still cool.`,"w")}
  if(F.freeze&&S.calling&&!S.logs2.fz){S.logs2.fz=1;log(sim,"Water dripping from the air handler: the coil froze and split.","b")}
 },
 draw(dt){const S=this.S,F=this.F,V=this.V,p="w_";
  at(p+"flame","opacity",S.fire?1:0);
  const wcol=t=>acol(t);
  S.woff-=dt*(S.gpm*8);["wSup","wRet"].forEach(id=>{const e=$(p+id);if(e){e.style.strokeDashoffset=S.woff;e.style.opacity=S.gpm>0.05?1:0.0}});
  at(p+"wSup","stroke",wcol(S.ewt));at(p+"wRet","stroke",wcol(S.lwt));
  S.aoff-=dt*30;["aSup","aRet"].forEach(id=>{const e=$(p+id);if(e)e.style.strokeDashoffset=S.aoff});
  at(p+"aSupG","opacity",S.blowerOn?1:0);at(p+"aRetG","opacity",S.blowerOn?1:0);
  at(p+"aSup","stroke",acol(S.Tsup));at(p+"aSupH","stroke",acol(S.Tsup));at(p+"aRet","stroke",acol(S.Troom));at(p+"aRetH","stroke",acol(S.Troom));
  if(S.blowerOn)S.ang=(S.ang+dt*800)%360;at(p+"blades","transform",`rotate(${S.ang} 366 384)`);
  if(S.pump)S.iang=(S.iang+dt*900)%360;at(p+"imp","transform",`rotate(${S.iang} 196 124)`);
  const tc=mix([90,110,130],[214,90,40],(S.Twc-70)/110);$(p+"tubes")&&$(p+"tubes").querySelectorAll("line").forEach((l,i)=>l.setAttribute("stroke",S.air>0.3&&i<2?"#7a8ea0":`rgb(${tc.join?tc.join(","):tc})`));
  at(p+"bubbles","opacity",S.air>0.3&&S.pump?(blink(400)?1:.5):S.air>0.3?0.6:0);
  at(p+"coilDirt","opacity",F.coilDirty?0.8:0);at(p+"dirt","opacity",F.afilter?0.6:0);
  at(p+"esLamp","fill",S.es?"var(--ok)":"var(--lamp-off)");at(p+"zvPos","width",(2+22*Math.max(S.zv,S.manual?1:0)).toFixed(1));
  at(p+"aqLamp","fill",S.fire?"#e0662a":"var(--lamp-off)");at(p+"fdLamp","fill",(F.fdelay?false:S.Twc>=V.fdon)?"var(--ok)":"var(--lamp-off)");
  at(p+"led","fill",S.calling?(blink(1000)?"var(--ok)":"var(--lamp-off)"):"var(--lamp-off)");txt(p+"brdTxt",this.stText(S).toUpperCase().slice(0,14));
  at(p+"tstatLamp","fill",S.calling?"#e0662a":"var(--lamp-off)");
  at(p+"tNeedle","transform",`rotate(${clamp((S.Tb-60)*1.4,0,240).toFixed(0)} 70 282)`);at(p+"pNeedle","transform",`rotate(${clamp(S.psi*6,0,240).toFixed(0)} 70 282)`);
  txt(p+"psiTxt",`${S.psi.toFixed(0)} psi`);at(p+"psiTxt","fill",S.psi<8?"var(--bad)":"var(--ink)");txt(p+"btTxt",`${f0(S.Tb)}°F`);
  at(p+"burst","opacity",F.freeze?1:0);at(p+"spit","opacity",0);
  txt(p+"coilTxt",`Coil water ${f0(S.Twc)}°F`);
  const on=S.gpm>0.05;
  txt(p+"r_ewt",on?`EWT ${f0(S.ewt)}°F`:"EWT --");txt(p+"r_lwt",on?`LWT ${f0(S.lwt)}°F`:"LWT --");txt(p+"r_gpm",`${S.gpm.toFixed(1)} GPM`);
  txt(p+"r_btuw",on?`W ${f0(500*S.gpm*(S.ewt-S.lwt)/1000)} MBH`:"W --");txt(p+"r_btua",S.blowerOn?`A ${f0(1.08*S.cfm*(S.Tsup-S.Troom)/1000)} MBH`:"A --");
  txt(p+"supTxt",`${f0(S.Tsup)}°F`);txt(p+"retTxt",`${f0(S.Troom)}°F`);txt(p+"roomTxt",`${S.Troom.toFixed(1)}°F`);txt(p+"outTxt",`${V.out}°F`);txt(p+"tstatTxt",String(V.set));
 },
 boom(){return{t:"",b:"",wreck:0}}};
AHU.lampOn=S=>({call:S.calling,zv:S.zv>=0.95||S.manual,es:S.es,fire:S.fire,pump:S.pump,fan:S.blowerOn,cold:S.calling&&S.Twc<AHU.V.fdon});
