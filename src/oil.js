/* ============ OIL FURNACE (flame-retention gun burner, R7184-style primary, fan/limit control) ============ */
SRC.r7184=["Honeywell R7184 oil primary guide 69-1384: 15 s valve-on delay, 15/30/45 s lockout, 10 s ignition carryover, 60 s recycle, restricted lockout after 3, cad cell under 1600 Ω","https://inspectapedia.com/heat/Honeywell-R7184-Guide-69-1384.pdf"];
SRC.oilsys=["HVAC Excellence study guide: oil burners, pumps, nozzles, electrodes, cad cells and combustion benchmarks","https://open-exam-prep.com/study-guides/hvac-excellence/electric-oil-hydronics/oil-heating-systems"];
SRC.suntec=["Suntec A2VA-7116 pump bulletin: 100–200 psi, factory 100 psi, 6 in. Hg max vacuum single pipe, 12 in. Hg two pipe","https://image.stockpileexpress.com/ProductInfo/A2-VA-7116-B20_Ed4-jan2020.pdf"];
SRC.nora=["NORA combustion analysis chart: smoke 0, CO2 12–13%, O2 3–5%, overfire -0.01 to -0.02, breech -0.02 to -0.04 in. w.c., net stack 350–500°F","https://learning.noraweb.org/wp-content/uploads/2026/06/NORA-Combustion-Analysis-chart-2.pdf"];
SRC.testoOil=["Testo 300 manual: flue gas loss qA = (flue − air temp) × (A2 ÷ (21 − O2) + B); light fuel oil A2 0.68, B 0.007, CO2max 15.4%","https://www.manualslib.com/manual/1286672/Testo-300-Xxl.html?page=77"];
SRC.puff=["InspectAPedia: oil burner puffbacks (unburned oil in the chamber, repeated resets, dripping nozzle, failing pump cutoff, draft)","https://inspectapedia.com/heat/Oil_Burner_Puffbacks.htm"];
SRC.l4064=["Resideo L4064B fan and limit control: fan on 125°F, fan off 100°F, limit 200°F","https://www.supplyhouse.com/Resideo-L4064B2236-Fan-and-Limit-Controller-w-125-F-Fan-on-100-F-Fan-off-200-F-High-Limit-8-Insertion-L4064B2236"];
SRC.baro=["InspectAPedia: draft regulators (barometric dampers) on oil-fired equipment","https://inspectapedia.com/heat/Draft_Regulators.php"];

PHOTOS.oil={primary:[gimg("Honeywell R7184 oil primary control")],cad:[gimg("oil burner cad cell")],igniter:[gimg("Beckett oil burner electronic igniter")],nozzle:[gimg("oil burner nozzle 0.65 80 A")],
 electrodes:[gimg("oil burner electrode assembly")],pump:[gimg("Suntec A2VA oil pump")],burner:[gimg("Beckett AFG oil burner")],tank:[gimg("275 gallon oil tank basement")],ofilter:[gimg("oil tank filter General 1A-25A")],
 oilline:[gimg("oil line vacuum gauge oil pump")],chamber:[gimg("oil furnace combustion chamber ceramic")],hx:[gimg("oil furnace drum heat exchanger")],baro:[gimg("barometric draft regulator oil")],
 chimney:[gimg("chimney flue oil furnace")],fanlimit:[gimg("Honeywell L4064 fan limit control")],blower:[gimg("furnace blower motor and wheel")],bcap:[gimg("blower motor run capacitor")],
 afilter:[gimg("furnace filter")],analyzer:[gimg("oil combustion analyzer smoke tester")],tstat:[gimg("heating thermostat")],coalarm:[gimg("carbon monoxide alarm")],house:[gimg("supply register warm air")]};

const OLAMP=[["call","Heat call","g"],["mot","Burner motor","g"],["ign","Spark","a"],["valve","Oil valve","g"],["flame","Flame seen","g"],["fan","Blower","g"],["lim","Limit open","r"],["lock","Lockout","r"]];
const NOZ=0.65,BTU_GAL=140000,GPH0=NOZ*Math.sqrt(1.4);

ILL.primary=`${box(30,22,100,70,"#2f3337",6)}<circle cx="104" cy="44" r="9" fill="#d23a26" stroke="${K}"/><circle cx="56" cy="44" r="5" fill="#e8c33a"/>${label(80,74,"OIL PRIMARY",WH,8)}${label(80,110,"reset button + LED",K,6)}`;
ILL.cad=`<circle cx="80" cy="56" r="30" fill="#3a3f44" stroke="${K}"/><circle cx="80" cy="56" r="20" fill="#d9a441"/><path d="M66 50 h28 M66 56 h28 M66 62 h28" stroke="#8a5a1a" stroke-width="2"/>${label(80,104,"CAD CELL: dark 20 kΩ+, flame under 1600 Ω",K,6)}`;
ILL.nozzle=`${box(30,46,60,28,"#c9a24a",3)}<path d="M90 50 L104 56 V64 L90 70 Z" fill="#c9a24a" stroke="${K}"/><path d="M104 60 L150 34 M104 60 L150 86" stroke="#d9a441" stroke-width="2" stroke-dasharray="3 3"/>${label(70,100,"0.65 GPH 80° A",K,7)}`;
ILL.electrodes=`<path d="M20 50 H118 M20 70 H118" stroke="#c4cacf" stroke-width="4"/><path d="M118 50 L128 57 M118 70 L128 63" stroke="#c4cacf" stroke-width="3"/><path d="M128 57 l3 3 l-3 3" stroke="#ffd84a" stroke-width="2" fill="none"/>${box(20,44,50,32,"#efe9dc",4)}${label(80,104,"gap about 5/32 in.",K,7)}`;
ILL.pump=`${box(30,30,90,60,"#7a8288",8)}<circle cx="75" cy="60" r="18" fill="#9aa1a8" stroke="${K}"/><circle cx="132" cy="40" r="14" fill="#f4f4f0" stroke="${K}"/>${label(132,44,"140",K,7)}${label(80,110,"FUEL PUMP 100–200 psi",K,7)}`;
ILL.tank=`<rect x="14" y="30" width="132" height="64" rx="30" fill="#5f686d" stroke="${K}"/><rect x="70" y="20" width="14" height="12" fill="#3a3f44"/>${label(80,66,"275 GAL",WH,9)}${label(80,112,"basement oil tank",K,6)}`;
ILL.ofilter=`${box(56,20,48,70,"#c4cacf",6)}${pipeH(4,56,30,8)}${pipeH(104,156,30,8)}${label(80,62,"FILTER",K,7)}${label(80,110,"cartridge filter at the tank",K,6)}`;
ILL.chamber=`<path d="M30 30 H130 V96 H30 Z" fill="#d9c7a8" stroke="${K}"/><path d="M44 44 H116 V96 H44 Z" fill="#3a2a20"/><path d="M50 70 Q80 40 112 70 Q80 92 50 70 Z" fill="#f2a53a"/>${label(80,112,"COMBUSTION CHAMBER",K,7)}`;
ILL.baro=`${pipeH(4,156,40,18,"#9aa1a8")}<circle cx="80" cy="80" r="26" fill="#c4cacf" stroke="${K}"/><line x1="56" y1="80" x2="104" y2="80" stroke="${K}" stroke-width="3"/>${pipeV(80,48,56,18,"#9aa1a8")}${label(80,118,"BAROMETRIC DRAFT REGULATOR",K,6)}`;
ILL.fanlimit=`${box(30,20,100,64,"#c9cfd4",4)}<circle cx="80" cy="52" r="22" fill="#f4f4f0" stroke="${K}"/><path d="M80 52 L94 40" stroke="#d23a26" stroke-width="2"/>${box(76,84,8,30,"#9aa1a8",1)}${label(80,118,"FAN / LIMIT: on 125 off 100 limit 200°F",K,6)}`;

function oSvg(p){return `
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
<g class="part" data-p="coalarm" tabindex="0">
 <circle class="hl" cx="742" cy="186" r="16" fill="url(#zAluTop)" stroke="#8f979d" filter="url(#zShadow)"/><circle cx="742" cy="186" r="11" fill="none" stroke="#c4cacf" stroke-dasharray="1.5 2"/>
 <circle id="${p}coLamp" cx="742" cy="192" r="3.5" fill="#3fa34d"/>
 <text id="${p}coTxt" x="742" y="184" text-anchor="middle" font-family="var(--mono)" font-size="8" fill="#2a2d30">0</text>
 <text class="tag" x="742" y="214" text-anchor="middle" fill="var(--muted)">CO ALARM</text>
</g>
<!-- chimney (behind the supply duct) -->
<g class="part" data-p="chimney" tabindex="0">
 <rect class="hl" x="458" y="14" width="54" height="330" fill="url(#zBrick)" stroke="#5a2a1a" stroke-width="1.5"/>
 <rect x="452" y="10" width="66" height="8" fill="#8a8f93" stroke="#4d555a"/>
 <rect x="472" y="18" width="26" height="322" fill="#2a2420" opacity=".85"/>
 <rect x="466" y="318" width="18" height="16" rx="1" fill="#3a3f44" stroke="#14171a"/>
 <path id="${p}smk" class="air" d="M485 300 V22" stroke="#c4cacf"/>
 <rect id="${p}block" x="472" y="70" width="26" height="22" fill="#7a5a32" opacity="0"/>
 <text class="tag" x="485" y="358" text-anchor="middle" fill="var(--muted)">CHIMNEY</text>
</g>
<!-- supply duct -->
<rect x="170" y="34" width="130" height="56" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.5"/>
<path d="M300 46 H600 V150" fill="none" stroke="#6f787e" stroke-width="26" stroke-linejoin="round"/><path d="M300 46 H600 V150" fill="none" stroke="#c9cfd4" stroke-width="22" stroke-linejoin="round"/><path d="M300 42 H596 V150" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>
<rect x="582" y="148" width="36" height="9" fill="url(#zSteel)" stroke="#5f686d"/>
<text class="lblS" x="180" y="28">Supply plenum</text>
<text class="val" id="${p}supTxt" x="236" y="78" font-size="12">68°F</text>
<g id="${p}aSupG"><path id="${p}aSup" class="air" d="M220 86 V48 H590 V200 M600 160 V230"/>
 <path id="${p}aSupH" d="M594 222 l6 10 6 -10" fill="none" stroke-width="2.5"/></g>
<!-- return duct -->
<path d="M560 412 H420" fill="none" stroke="#6f787e" stroke-width="40"/><path d="M560 412 H420" fill="none" stroke="#c9cfd4" stroke-width="36"/><path d="M560 396 H420" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>
<rect x="550" y="380" width="10" height="64" fill="url(#zGrille)" stroke="#5f686d"/>
<g id="${p}aRetG"><path id="${p}aRet" class="air" d="M556 412 H424"/><path id="${p}aRetH" d="M430 406 l-10 6 10 6" fill="none" stroke-width="2.5"/></g>
<text class="lblS" x="440" y="446">Return air</text><text class="val" id="${p}retTxt" x="520" y="446" font-size="12">68°F</text>

<!-- furnace cabinet -->
<path d="M420 92 L432.0 83.6 V443.6 L420 452 Z" fill="url(#r_cabS)"/><path d="M300 90 L312.0 81.6 H432.0 L420 90 Z" fill="url(#r_cabT)"/><rect x="170" y="90" width="250" height="362" rx="3" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="176" y="96" width="238" height="350" fill="url(#zCabIn)" stroke="#9aa3a9"/>
<rect x="176" y="112" width="238" height="190" fill="url(#zInside)" opacity=".2"/>
<line x1="170" y1="306" x2="420" y2="306" stroke="#6f787e" stroke-width="3"/>${[[174,94],[416,94],[174,448],[416,448]].map(([x,y])=>zScrew(x,y,2.2)).join("")}
<text class="zl" x="180" y="108">Oil furnace</text>

<!-- drum heat exchanger -->
<g class="part" data-p="hx" tabindex="0">
 <rect id="${p}hxBody" class="hl" x="196" y="126" width="188" height="92" rx="40" fill="#9aa1a8" stroke="var(--line)" stroke-width="1.4"/>
 <path d="M216 132 H364" stroke="rgba(255,255,255,.45)" stroke-width="4" stroke-linecap="round"/><path d="M216 212 H364" stroke="rgba(0,0,0,.22)" stroke-width="4" stroke-linecap="round"/>
 <rect id="${p}soot" x="206" y="150" width="168" height="50" rx="22" fill="#1e1e1e" opacity="0"/>
 <text class="valD" fill="#1d2327" id="${p}hxTxt" x="290" y="176" text-anchor="middle">HX 70°F</text>
</g>
<!-- flue to the chimney, draft regulator -->
<text class="val" id="${p}brTxt" x="410" y="122" font-size="9" text-anchor="end">Breech 0.00"</text>
<path d="M384 150 H458" stroke="#4d555a" stroke-width="20"/><path d="M384 150 H458" stroke="url(#zSteelH)" stroke-width="17"/>
<path id="${p}fgas" class="air" d="M388 150 H470" stroke="#c4cacf"/>
<g class="part" data-p="baro" tabindex="0">
 <path d="M436 158 V172" stroke="url(#zSteelH)" stroke-width="16"/>
 <circle class="hl" cx="436" cy="186" r="15" fill="url(#zAluTop)" stroke="#4d555a" filter="url(#zShadow)"/>
 <line id="${p}flap" x1="424" y1="186" x2="448" y2="186" stroke="#2a2d30" stroke-width="3"/>
 <text class="tag" x="436" y="214" text-anchor="middle" fill="var(--muted)">DRAFT REG.</text>
 
</g>
<!-- combustion chamber -->
<g class="part" data-p="chamber" tabindex="0">
 <rect class="hl" x="190" y="230" width="150" height="70" rx="6" fill="url(#zTan)" stroke="#6a5a42" stroke-width="1.4"/>
 <rect x="202" y="240" width="128" height="52" rx="4" fill="#2a201a"/>
 <path id="${p}pool" d="M212 290 Q266 284 320 290 Z" fill="#3b2a12" opacity="0"/>
 <text class="valD" fill="#1d2327" id="${p}ofTxt" x="266" y="314" text-anchor="middle">Overfire 0.00"</text>
</g>
<g id="${p}flame">
 <path class="fl" d="M204 266 Q240 236 318 252 Q332 266 318 280 Q240 296 204 266 Z" fill="#f2a53a" opacity=".92"/>
 <path d="M204 266 Q236 252 290 260 Q298 266 290 272 Q236 280 204 266 Z" fill="#ffe28a"/>
</g>
<g id="${p}puff" opacity="0">${[0,1,2,3].map(i=>`<circle cx="${180-i*16}" cy="${266-i*10}" r="${12+i*6}" fill="#3a3a3a" opacity=".6"/>`).join("")}</g>

<!-- fan / limit control -->
<g class="part" data-p="fanlimit" tabindex="0">
 <rect class="hl" x="352" y="236" width="52" height="46" rx="3" fill="url(#zSteel)" stroke="#4d555a" filter="url(#zShadow)"/>
 <circle cx="378" cy="259" r="16" fill="#f4f4f0" stroke="#5f686d"/><path id="${p}dial" d="M378 259 L390 249" stroke="#d23a26" stroke-width="2"/>
 <circle id="${p}limLamp" cx="396" cy="244" r="3" fill="var(--ok)"/>
 <text class="zt" x="378" y="294" text-anchor="middle">FAN/LIMIT</text>
 <text class="valD" fill="#1d2327" id="${p}plTxt" x="378" y="230" text-anchor="middle">70°F</text>
</g>

<!-- burner -->
<g class="part" data-p="burner" tabindex="0">
 <rect x="112" y="254" width="96" height="26" rx="3" fill="url(#zSteelH)" stroke="#4d555a"/>
 <rect x="36" y="248" width="34" height="40" rx="8" fill="url(#zMotor)" stroke="#111"/>${[0,1,2].map(i=>`<rect x="40" y="${254+i*10}" width="26" height="3" rx="1.5" fill="#0e1a26" opacity=".7"/>`).join("")}
 <circle class="hl" cx="94" cy="268" r="28" fill="url(#zPlasticDk)" stroke="#111" filter="url(#zShadow)"/>
 <path id="${p}band" d="M76 268 A18 18 0 0 1 94 250" stroke="#c4cacf" stroke-width="5" fill="none"/>
 <circle cx="94" cy="268" r="8" fill="url(#zScrew)"/>
 <text class="tag" x="94" y="306" text-anchor="middle" fill="var(--muted)">BURNER</text>
</g>
<g class="part" data-p="motor" tabindex="0">
 <rect class="hl" x="36" y="248" width="34" height="40" rx="8" fill="transparent" stroke="none"/>
 <circle id="${p}olBtn" cx="44" cy="244" r="4" fill="#d23a26" stroke="#5a0b07"/>
</g>
<g class="part" data-p="nozzle" tabindex="0">
 <rect class="hl" x="196" y="262" width="10" height="8" rx="1" fill="url(#zBrass)" stroke="#6a4a12"/>
</g>
<g class="part" data-p="electrodes" tabindex="0">
 <path d="M150 258 H206 M150 262 H206" stroke="#c4cacf" stroke-width="2"/>
 <rect class="hl" x="186" y="252" width="22" height="14" fill="transparent" stroke="none"/>
 <path id="${p}spark" d="M206 258 l4 1 -3 2 4 1" stroke="#9fd0ff" stroke-width="1.6" fill="none" opacity="0"/>
</g>
<g class="part" data-p="igniter" tabindex="0">
 <rect class="hl" x="72" y="230" width="66" height="16" rx="2" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 <text x="105" y="241" text-anchor="middle" font-family="var(--display)" font-size="8" fill="#e9ecee">IGNITER</text>
 <circle id="${p}igLamp" cx="132" cy="238" r="2.5" fill="var(--lamp-off)"/>
</g>
<g class="part" data-p="primary" tabindex="0">
 <rect class="hl" x="66" y="186" width="80" height="40" rx="3" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 <circle id="${p}led" cx="82" cy="200" r="4" fill="var(--lamp-off)"/>
 <circle cx="130" cy="200" r="7" fill="#d23a26" stroke="#5a0b07"/><ellipse cx="128" cy="198" rx="3" ry="2" fill="rgba(255,255,255,.4)"/>
 <text id="${p}priTxt" x="106" y="218" text-anchor="middle" font-family="var(--mono)" font-size="7" fill="#e9ecee">STANDBY</text>
 <text x="106" y="182" text-anchor="middle" font-family="var(--display)" font-size="8" fill="var(--muted)">OIL PRIMARY</text>
</g>
<g class="part" data-p="cad" tabindex="0">
 <circle class="hl" cx="116" cy="262" r="6" fill="#d9a441" stroke="#5a3a10"/>
 <text class="valD" fill="#1d2327" id="${p}cadTxt" x="150" y="248">50 kΩ</text>
</g>
<g class="part" data-p="pump" tabindex="0">
 <rect class="hl" x="74" y="294" width="40" height="24" rx="5" fill="url(#zAlu)" stroke="#4d555a" filter="url(#zShadow)"/>
 <circle cx="128" cy="314" r="10" fill="#f4f4f0" stroke="#4d555a"/><path id="${p}pNeedle" d="M128 314 L120 318" stroke="#d23a26" stroke-width="1.6"/>
 <text class="val" id="${p}psiTxt" x="140" y="330" font-size="10">0 psi</text>
</g>

<!-- oil supply -->
<g class="part" data-p="oilline" tabindex="0">
 <path d="M150 362 V340 H62 V318 H74" fill="none" stroke="#14171a" stroke-width="5"/><path d="M150 362 V340 H62 V318 H74" fill="none" stroke="url(#zCuV)" stroke-width="3"/>
 <circle class="hl" cx="52" cy="330" r="9" fill="#f4f4f0" stroke="#4d555a"/><path id="${p}vNeedle" d="M52 330 L46 334" stroke="#2f6fd6" stroke-width="1.6"/>
 <text class="val" id="${p}vacTxt" x="8" y="352" font-size="10">0" Hg</text>
 <g id="${p}bub" opacity="0">${[90,110,130].map(x=>`<circle cx="${x}" cy="340" r="1.8" fill="#fff"/>`).join("")}</g>
</g>
<g class="part" data-p="ofilter" tabindex="0">
 <rect class="hl" x="140" y="362" width="20" height="22" rx="3" fill="url(#zSteel)" stroke="#4d555a" filter="url(#zShadow)"/>
 <rect id="${p}ofDirt" x="142" y="372" width="16" height="10" fill="#5a4a2a" opacity="0"/>
 <text class="zt" x="150" y="396" text-anchor="middle">FILTER</text>
</g>
<g class="part" data-p="tank" tabindex="0">
 <rect class="hl" x="10" y="398" width="150" height="58" rx="26" fill="#5f686d" stroke="#2a2f33" stroke-width="1.5" filter="url(#zShadow)"/>
 <rect id="${p}oilLvl" x="16" y="420" width="138" height="32" rx="14" fill="#8a6a2a" opacity=".8"/>
 <rect x="16" y="402" width="138" height="6" rx="3" fill="rgba(255,255,255,.18)"/>
 <path d="M150 398 V384" stroke="url(#zCuV)" stroke-width="3"/>
 <text class="tag" x="40" y="392" fill="var(--muted)">OIL TANK</text>
 <text class="val" id="${p}tankTxt" x="44" y="432" font-size="11" fill="#fff">120 gal</text>
</g>

<!-- blower compartment -->
<g class="part" data-p="afilter" tabindex="0">
${zFilter(400,320,16,124,p+"dirt")}
</g>
<g class="part" data-p="blower" tabindex="0">
${zBlower(296,384,42,p+"blades")}<text class="zl" x="296" y="444" text-anchor="middle">Blower</text>
</g>
<g class="part" data-p="bcap" tabindex="0">
${zCap(356,404,20,34,p+"capBulge")}<text class="zt" x="366" y="396" text-anchor="middle">CAP</text>
</g>

<!-- combustion analyzer readouts -->
<g class="part" data-p="analyzer" tabindex="0">
 <rect class="hl" x="8" y="18" width="150" height="150" rx="6" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 <rect x="14" y="34" width="138" height="128" rx="3" fill="#b9c7a8"/>
 <text x="83" y="29" text-anchor="middle" font-family="var(--display)" font-size="9" fill="#e9ecee" letter-spacing=".08em">COMBUSTION ANALYZER</text>
 ${["smoke","co2","o2","co","stack","eff","rise"].map((k,i)=>`<text id="${p}a_${k}" x="20" y="${50+i*16}" font-family="var(--mono)" font-size="10.5" fill="#142014"></text>`).join("")}
</g>
<g id="${p}burn" opacity="0"><g fill="#333" opacity=".9"><circle cx="270" cy="200" r="40"/><circle cx="220" cy="150" r="30"/><circle cx="340" cy="160" r="34"/><circle cx="640" cy="260" r="60"/><circle cx="700" cy="330" r="50"/></g></g>`}

const OIL={id:"oil",p:"o_",name:"Oil furnace",svg:oSvg("o_"),lamps:OLAMP,txvOnly:[],
 sliders:[
  {k:"set",l:"Thermostat (heating)",u:"°F",min:50,max:85,step:1,v:70,n:[65,75],note:"Normal 65–75°F"},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-20,max:65,step:1,v:30,note:"Colder outdoors means longer run times."},
  {k:"pump",l:"Pump pressure",u:" psi",min:60,max:200,step:5,v:140,n:[130,150],note:"This burner is set to 140 psi. Oil flow = nozzle GPH × √(psi ÷ 100)."},
  {k:"air",l:"Air band (burner air)",u:"%",min:10,max:100,step:1,v:50,n:[44,60],note:"Set with the analyzer: open it from trace smoke until CO2 is 11.5–13% and smoke is 0."},
  {k:"drs",l:"Draft regulator setting",u:'" w.c.',min:0.01,max:0.1,step:0.005,v:0.04,n:[0.03,0.05],note:"Breech draft it holds (shown as negative). Overfire should end up near -0.02.",more:1},
  {k:"cfm",l:"Heating airflow",u:" CFM",min:300,max:2000,step:10,v:1250,n:[1050,1500],note:"Set so the rise lands in the data plate range (55–85°F here)",more:1},
  {k:"lim",l:"Limit opens at",u:"°F",min:150,max:260,step:5,v:200,n:[180,200],note:"Fan/limit control: limit typically 200°F",more:1}],
 faults:[["empty","Tank runs out of oil"],["ofilter","Oil filter clogged"],["leak","Air leak in the suction line"],["nozzle","Nozzle partly clogged"],["drip","Pump cutoff leaking (afterdrip)"],
  ["coupling","Pump coupling broken"],["motorOL","Burner motor overload tripped"],["igniter","Igniter fails (no spark)"],["gap","Electrodes out of adjustment"],["cad","Cad cell dirty"],["cadLight","Stray light reaching the cad cell"],
  ["water","Water in the oil"],["chimney","Chimney blocked"],["baro","Draft regulator stuck open"],["soot","Heat exchanger sooted up"],["blower","Blower motor fails"],["afilter","Dirty air filter"],
  ["limitFail","Limit fails closed"],["coDead","CO alarm battery dead"]],
 hidden:["limitFail","coDead"],
 scenarios:[{l:"Puffback: igniter dead, homeowner keeps pressing reset",f:["igniter"],s:{lockCount:0}},
  {l:"Blocked chimney, CO alarm battery dead",f:["chimney","coDead"]},
  {l:"Smoky fire: air band closed down, sooting the heat exchanger",f:[],v:{air:40}}],
 startMsg(){return `Oil furnace started. House ${this.S.Troom.toFixed(1)}°F, outdoors ${this.V.out}°F, thermostat ${this.V.set}°F. Burner: ${NOZ.toFixed(2)} GPH 80° A nozzle at ${this.V.pump} psi.`},
 parts:{
  primary:{n:"Oil primary control",s:"Runs the burner and shuts the oil off if the cad cell doesn't see flame.",
   w:"An electronic primary (Honeywell R7184 style) wired to the thermostat (T T), the burner motor, the igniter and the oil valve. Red reset button and an LED.",
   y:"Heat call; safe start check (2–6 s, the cad cell must see dark); motor and igniter on for a 15 s valve-on delay (prepurge); oil valve opens; the cad cell must see flame within the lockout time (15 s here); spark stays on 10 s more; run. Flame lost: shuts down, waits 60 s, tries again.",
   f:"No flame by the end of the trial: lockout, manual reset. Three lockouts in a row: restricted lockout, which takes holding reset for 30 s. Press reset once. Pressing it again and again pumps more oil into a cold chamber, and that oil can explode when it finally lights (puffback). Hold-then-release while running gives the cad cell reading on the LED (1 flash under 400 Ω, 4 flashes 1600 Ω or more).",
   src:["r7184","puff"],faults:[]},
  cad:{n:"Cad cell",s:"Sees the flame.",w:"A cadmium sulfide photocell inside the burner housing, looking down the air tube at the flame.",y:"Its resistance drops in light: over 20,000 Ω dark, under 1600 Ω with flame (300–800 Ω is typical). The primary uses that to prove flame.",
   f:"Dirty or misaimed: the burner lights, runs about 15 s, then locks out even though the flame was fine. Stray light at startup: the primary sees 'flame' before it starts and won't run.",src:["r7184","oilsys"],faults:["cad","cadLight"]},
  igniter:{n:"Igniter",s:"Makes the spark that lights the oil spray.",w:"A solid-state igniter (about 14,000–20,000 V) on top of the burner, hinged so the air tube can be opened. Older burners used a 10,000 V transformer.",
   y:"Sparks across the electrode tips during the 15 s valve-on delay, the trial for ignition, and 10 s after flame is proven.",f:"No spark: oil sprays into the chamber for the whole trial without lighting. Each reset adds more unburned oil.",src:["oilsys","r7184"],faults:["igniter"]},
  electrodes:{n:"Electrodes",s:"Carry the spark to the oil spray.",w:"Two ceramic-insulated rods beside the nozzle.",y:"Set to the burner maker's gauge: typically a 1/8–5/32 in. gap, 1/16–1/8 in. ahead of the nozzle and 1/4–5/16 in. above its centerline.",
   f:"Out of adjustment or with cracked insulators, the spark is weak or misses the spray: late ignition with a rumble or puff on startup, and soot.",src:["oilsys"],faults:["gap"]},
  nozzle:{n:"Nozzle",s:"Atomizes the oil into a fine cone of spray.",w:"A brass nozzle with a strainer, stamped with its rating at 100 psi, spray angle and pattern: 0.65 GPH 80° A here (A = hollow).",
   y:`Flow rises with the square root of pressure: at 140 psi this 0.65 GPH nozzle delivers ${GPH0.toFixed(2)} GPH, about ${f0(GPH0*BTU_GAL/1000)},000 Btu/h with No. 2 oil at about 140,000 Btu per gallon. Replaced at every annual service.`,
   f:"Partly clogged: less oil, a lopsided spray, smoke and a lower cad cell signal. Never clean a nozzle; replace it.",src:["oilsys"],faults:["nozzle"]},
  pump:{n:"Fuel pump",s:"Draws oil from the tank and delivers it to the nozzle at set pressure.",w:"A gear pump (Suntec A2VA style) driven by the burner motor through a coupling, with a pressure regulator and a cutoff valve.",
   y:"Adjustable 100–200 psi; this burner runs at 140. The cutoff valve snaps shut below about 80–85 psi so the nozzle doesn't dribble when the motor slows. Measure pressure at the gauge port and vacuum at the inlet.",
   f:"Broken coupling: the motor runs but the pump doesn't, so no oil. A leaking cutoff drips oil after shutdown (afterdrip): smoke and odor at the end of each cycle and a sooty chamber.",src:["suntec","oilsys","puff"],faults:["coupling","drip"]},
  burner:{n:"Burner",s:"A flame-retention gun burner (Beckett AFG style).",w:"The motor spins a fan and the pump. Air goes down the air tube and through the retention head, which swirls it into the oil spray.",
   y:"The air band sets how much air: too little gives smoke and soot, too much lowers CO2 and efficiency. Set it with an analyzer, not by eye.",f:"A dirty fan wheel or a closed air band makes a smoky, orange, lazy flame.",src:["oilsys","nora"],faults:[]},
  motor:{n:"Burner motor",s:"Runs the fan and pump at 3450 rpm.",w:"A 1/7 to 1/4 hp motor with a thermal overload reset button (the red button on the motor, not the primary's reset).",y:"",f:"Tripped overload or failed motor: the primary goes through its sequence but no oil or air arrives, so it locks out.",src:["oilsys"],faults:["motorOL"]},
  tank:{n:"Oil tank",s:"Stores No. 2 heating oil.",w:"Typically a 275 gallon steel tank in the basement, with a fill pipe and a vent outside.",y:"Check the gauge on top before anything else on a no-heat call.",
   f:"Out of oil is one of the most common no-heat calls. After a delivery the pump has air in it: bleed it at the bleeder port until the oil runs clear of bubbles, then reset.",src:["oilsys"],faults:["empty","water"]},
  ofilter:{n:"Oil filter",s:"Traps sludge and water before they reach the pump.",w:"A cartridge filter on the supply line near the tank, plus a strainer in the pump and the nozzle.",y:"Changed at the annual service.",f:"Clogged: high vacuum at the pump inlet (over 6 in. Hg on a single-pipe system), starving the pump: a pulsing flame that drops out.",src:["suntec","oilsys"],faults:["ofilter"]},
  oilline:{n:"Oil line and vacuum gauge",s:"Single-pipe supply from the tank to the pump.",w:"Copper line, often in a protective sleeve. A vacuum gauge on the pump inlet shows how hard the pump is pulling.",
   y:"Normal for a basement tank: a few in. Hg or less. Suntec's limits: 6 in. Hg single pipe, 12 in. Hg two pipe, to keep air from coming out of the oil.",
   f:"High vacuum: clogged filter or kinked line. Near zero vacuum with bubbles in the line: an air leak at a fitting. Air makes the flame pulse and drop out.",src:["suntec","oilsys"],faults:["leak","ofilter"]},
  chamber:{n:"Combustion chamber",s:"Where the oil burns.",w:"A ceramic fiber or refractory lined pot below the heat exchanger.",y:"Overfire draft is read through a small hole in the burner's inspection door: about -0.01 to -0.02 in. w.c.",
   f:"Oil-soaked from failed ignitions, it can light with a bang (puffback) and blow soot through the house. A wet chamber has to be dried out or replaced before relighting.",src:["puff","nora"],faults:[]},
  hx:{n:"Heat exchanger",s:"A steel drum that the flue gas passes through on its way to the chimney.",w:"House air blows across the outside of the drum.",y:"Net stack temperature (flue minus room) shows how much heat is going up the chimney: about 350–500°F on a clean unit.",
   f:"Soot insulates it: stack temperature climbs, efficiency drops, and the passages restrict the draft. A smoky fire soots it quickly.",src:["nora","oilsys"],faults:["soot"]},
  baro:{n:"Draft regulator",s:"Keeps the chimney draft steady.",w:"A weighted swinging gate (barometric damper) on the flue pipe.",y:"It opens to let room air into the flue when the chimney pulls too hard, holding the breech draft at its setting (about -0.02 to -0.04 in. w.c.).",
   f:"Stuck open: weak draft over the fire, smoke and puffs. Spilling flue gas past it on startup means a draft or chimney problem.",src:["baro","nora"],faults:["baro"]},
  chimney:{n:"Chimney",s:"Creates the draft that pulls flue gas out.",w:"Hot flue gas rises; a lined masonry chimney here.",y:"A warm chimney pulls harder than a cold one.",f:"Blocked (debris, collapsed liner, animal nest): positive pressure over the fire, heavy smoke and carbon monoxide pushed back into the basement.",src:["baro","nora"],faults:["chimney"]},
  fanlimit:{n:"Fan and limit control",s:"Starts the blower when the furnace is hot and stops the burner if it overheats.",w:"A bimetal coil probe in the plenum with a dial (Honeywell L4064 style).",
   y:"Fan on at about 125°F, fan off at about 100°F, limit opens at about 200°F and cuts the burner. The blower keeps running while the limit is open.",f:"Repeated limit trips mean low airflow (filter, blower, capacitor) or overfiring. A limit that fails closed removes the last protection.",src:["l4064"],faults:["limitFail"]},
  blower:{n:"Blower",s:"Moves house air across the heat exchanger.",w:"A squirrel-cage wheel and PSC motor.",y:"",f:"No blower: the limit trips over and over.",src:["l4064"],faults:["blower"]},
  bcap:{n:"Blower run capacitor",s:"Helps the PSC blower motor run.",w:"",y:"",f:"Weak: the blower runs slow and the limit trips.",src:[],faults:[]},
  afilter:{n:"Air filter",s:"Cleans the return air.",w:"",y:"",f:"Dirty: low airflow, high temperature rise, limit trips.",src:[],faults:["afilter"]},
  analyzer:{n:"Combustion analyzer",s:"What a combustion test reads in the flue pipe.",w:"Smoke from a smoke pump and paper (Bacharach scale 0–9), CO2 or O2, CO, net stack temperature, and the calculated efficiency.",
   y:"Targets for a modern flame-retention burner (NORA): smoke 0, CO2 about 11.5–13%, O2 about 3–5%, CO under 100 ppm (ideally under 50), net stack 350–500°F, efficiency about 82–86% (US analyzers report it on the oil's higher heating value). Check smoke first, then set air for the CO2.",
   f:"High smoke: not enough air, poor atomization (low pressure, bad nozzle) or poor draft. High CO with low smoke: too little air or flame impingement.",src:["nora","oilsys","testoOil"],faults:[]},
  tstat:{n:"Thermostat",s:"Calls for heat when the house is cool.",w:"",y:"",f:"",src:[],faults:[]},
  coalarm:{n:"CO alarm",s:"Warns the people in the house about carbon monoxide.",w:"A UL 2034 listed alarm.",y:"",f:"A dead battery means no warning.",src:[],faults:["coDead"]},
  house:{n:"House",s:"Where the heat goes.",w:"",y:"Colder outdoors means longer burner run times.",f:"",src:[],faults:[]}},
 init(){const V=this.V;return {t:0,dead:null,Troom:V.set-2,mode:"heat",fan:"auto",calling:false,st:"idle",tm:0,lockCount:0,lock:false,rlock:false,recycles:0,
  mot:false,ign:false,valve:false,flame:false,gph:0,pumpP:0,vac:0,cadR:50000,proven:false,pool:0,soot:0,tank:120,air:false,emptied:false,motorTripped:false,ignDelay:0,
  Thx:V.set-2,Tsup:V.set-2,Tpl:V.set-2,blowerOn:false,limOpen:false,smoke:0,co2:0,o2:20.9,co:0,net:0,eff:0,breech:0,over:0,lam:0,coHouse:0,stackHot:0,
  ang:0,aoff:0,labels:true,lastLit:-99,logs2:{}}},
 switches:[
  {l:S=>`Thermostat: ${S.mode}`,on:S=>S.mode==="heat",act(sim){sim.S.mode=sim.S.mode==="heat"?"off":"heat";log(sim,`Thermostat set to ${sim.S.mode}.`)}},
  {l:S=>`Fan: ${S.fan}`,on:S=>S.fan==="on",act(sim){sim.S.fan=sim.S.fan==="auto"?"on":"auto";log(sim,`Fan set to ${sim.S.fan}.`)}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[],
 resets(S){const r=[],sim=this;
  if(S.lock&&!S.rlock)r.push(["Press the primary's reset button",()=>{S.lock=false;S.st="idle";S.tm=0;log(sim,S.pool>0.004?`Reset. There is already about ${f0(S.pool*128)} oz of unburned oil in the chamber.`:"Reset pressed.","w")}]);
  if(S.rlock)r.push(["Hold reset 30 s (clear restricted lockout)",()=>{S.lock=false;S.rlock=false;S.lockCount=0;S.st="idle";S.tm=0;log(sim,"Restricted lockout cleared. Find out why it failed before letting it try again.","w")}]);
  if(S.tank<5)r.push(["Fill the tank (oil delivery)",()=>{S.tank=200;log(sim,"Oil delivered: 200 gallons. The pump and line still have air in them.")}]);
  if(S.air&&S.tank>=5)r.push(["Bleed the pump",()=>{if(S.tank<5){log(sim,"Nothing to bleed: the tank is empty.","w");return}S.air=false;log(sim,"Pump bled at the bleeder port until the oil ran clear with no bubbles.")}]);
  if(S.motorTripped||this.F.motorOL)r.push(["Press the motor's overload reset",()=>{this.F.motorOL=false;S.motorTripped=false;if(typeof syncFaults==="function")syncFaults();log(sim,"Motor overload reset. If it trips again, check the pump for binding and the motor's amps.")}]);
  if(S.pool>0.004&&!S.flame)r.push(["Clean out the oil-soaked chamber",()=>{S.pool=0;log(sim,"Chamber cleaned and dried. Safe to try lighting again.")}]);
  return r},
 reads(S){return [["House",`${S.Troom.toFixed(1)}°F`],["Pump",`${f0(S.pumpP)} psi`],["Vacuum",`${S.vac.toFixed(1)}" Hg`],["Cad cell",S.cadR>=20000?"dark":`${f0(S.cadR)} Ω`],["Smoke",S.flame?`#${S.smoke.toFixed(0)}`:"—"],["State",this.stText(S)]]},
 stText(S){if(S.dead)return "failed";if(S.rlock)return "restricted lockout";if(S.lock)return "lockout";
  return ({idle:S.calling?(S.limOpen?"limit open":"waiting"):"standby",safe:"safe start check",vod:"valve-on delay",tfi:"trial for ignition",carry:"ignition carryover",run:"firing",recycle:"recycle delay"})[S.st]||S.st},
 step(dt){const S=this.S;let r=dt;while(r>1e-9){const h=Math.min(0.25,r);this.sub(h);r-=h;if(S.dead)return}},
 sub(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;S.tm+=dt;
  // thermostat
  if(S.mode==="heat"){if(!S.calling&&S.Troom<V.set-0.75){S.calling=true;log(sim,"Thermostat calls for heat (T to T on the primary).")}else if(S.calling&&S.Troom>V.set+0.75){S.calling=false;log(sim,"Thermostat satisfied.")}}else S.calling=false;
  // oil supply
  if(F.empty&&!S.emptied){S.emptied=true;S.tank=0}
  if(S.tank<=0.5&&!S.air&&S.mot){S.air=true;log(sim,"The pump sucked the tank dry and filled with air.","b")}
  if(F.motorOL&&!S.motorTripped){S.motorTripped=true}
  const motorRuns=S.mot&&!F.motorOL;
  const pumpTurns=motorRuns&&!F.coupling;
  const hasOil=pumpTurns&&!S.air&&S.tank>0.5;
  S.vac=pumpTurns?(F.leak?0.4:1.5+(F.ofilter?10.5:0)):0;
  let P=hasOil?V.pump:0;
  if(hasOil&&F.ofilter)P*=0.72+0.16*Math.sin(S.t*1.3);
  if(hasOil&&F.leak)P*=0.82+0.18*Math.sin(S.t*5.3);
  S.pumpP=P;
  const cutOpen=P>=85;
  let gph=S.valve&&cutOpen?NOZ*Math.sqrt(P/100)*(F.nozzle?0.6:1):0;
  if(gph>0&&F.water&&Math.sin(S.t*0.37)>0.97)gph=0; // slugs of water
  if(gph>0&&F.leak&&Math.sin(S.t*0.21)>0.985)gph=0; // air pocket reaches the nozzle
  S.gph=gph;if(gph>0)S.tank=Math.max(0,S.tank-gph*dt/3600);
  // draft: chimney pull depends on how warm the chimney is; the regulator caps it
  S.stackHot+=((S.flame?1:0)-S.stackHot)*Math.min(1,dt/180);
  const natural=0.025+0.06*S.stackHot;
  let br=-Math.min(natural,V.drs);if(F.baro)br=-0.01;if(F.chimney)br=S.mot?0.03:0.0;
  S.breech=br;
  const fanPush=motorRuns?0.022*(gph>0?gph/GPH0:0.6):0;
  S.over=br+fanPush+S.soot*0.025;
  // combustion
  const draftEff=clamp(1+(-S.over-0.02)*3,0.55,1.15);
  const airIn=motorRuns?(V.air/50)*1.32*GPH0*draftEff*(1-0.08*S.soot):0;
  const lam=gph>0?airIn/gph:0;S.lam=lam;
  // ignition: spark plus oil spray; bad electrodes light late
  const spark=S.ign&&!F.igniter;
  if(gph>0&&!S.flame){
   if(spark){if(F.gap){S.ignDelay+=dt;if(S.ignDelay>=6.5)this.light()}else this.light()}
   S.pool+=gph*dt/3600*(spark&&!F.gap?0.02:1);
  }
  if(S.flame&&(gph<=0||lam<0.75||!motorRuns)){S.flame=false;if(S.st==="run"||S.st==="carry")log(sim,gph<=0?"Flame went out: no oil reaching the nozzle.":"Flame went out: not enough air.","b")}
  if(!S.valve&&S.flame){S.flame=false}
  if(gph<=0)S.ignDelay=0;
  // combustion results
  if(S.flame){
   const O2=lam>=1?20.9*(lam-1)/lam:0;S.o2=O2;S.co2=lam>=1?15.4*(1-O2/20.9):15.4*lam;
   let sm=Math.max(0,(1.27-lam)*22)+(P<120?(120-P)/9:0)+(F.nozzle?2.4:0)+Math.max(0,S.over)*60+(F.water?1:0);S.smoke=clamp(sm,0,9);
   S.co=6+Math.max(0,1.22-lam)*3800+S.smoke*18+(S.over>0?260:0)+(lam>1.9?(lam-1.9)*120:0);
   S.net=440+(gph/GPH0-1)*260+S.soot*260+Math.max(0,lam-1.32)*300;
   S.eff=clamp((100-(S.net/1.8)*(0.68/Math.max(1,21-S.o2)+0.007))*0.938-(S.co>200?1.5:0),40,92);   // Testo light-oil flue loss (A2 0.68, B 0.007), × LHV/HHV for a US-style reading
   if(S.smoke>2)S.soot=Math.min(1,S.soot+(S.smoke-2)*dt/9000);
  }else{S.o2=20.9;S.co2=0;S.co=0;S.smoke=0;S.net=Math.max(0,S.net-dt*3);S.eff=0}
  if(F.soot&&S.soot<0.75)S.soot=0.75;
  // cad cell
  S.cadR=S.flame?520*(F.nozzle?1.9:1)*(F.cad?6:1)*(S.smoke>4?1.4:1):(F.cadLight?700:50000);
  if(F.cad&&!S.flame)S.cadR=60000;
  const seen=S.cadR<1600;
  // fan/limit (plenum bonnet temperature)
  const Tpl=S.blowerOn?S.Tsup:S.Troom+(S.Thx-S.Troom)*0.75;S.Tpl=Tpl;
  if(!S.limOpen&&!F.limitFail&&Tpl>=V.lim){S.limOpen=true;log(sim,`Limit opened at ${f0(Tpl)}°F. Burner off, blower on.`,"b")}
  else if(S.limOpen&&Tpl<=V.lim-25){S.limOpen=false;log(sim,"Limit closed again.")}
  // primary control sequence
  const go=(st,msg,c)=>{S.st=st;S.tm=0;if(msg)log(sim,msg,c)};
  const shut=()=>{if(S.valve&&F.drip){S.pool+=0.0004;S.soot=Math.min(1,S.soot+0.01);log(sim,"Smoke and oil smell at shutdown: the pump's cutoff is dripping oil.","w")}S.valve=false;S.ign=false;S.flame=false};
  const want=S.calling&&!S.limOpen;
  switch(S.st){
   case "idle":S.mot=false;shut();
    if(want&&!S.lock){if(seen){if(!S.logs2.light){S.logs2.light=1;log(sim,`Primary won't start: the cad cell already sees light (${f0(S.cadR)} Ω) before the burner runs.`,"b")}}else{S.logs2.light=0;go("safe")}}
    break;
   case "safe":if(!want){go("idle");break}if(seen){go("idle");break}if(S.tm>=3){S.mot=true;S.ign=true;go("vod","Burner motor and igniter on. Valve-on delay 15 s.")}break;
   case "vod":S.mot=true;S.ign=true;if(!want){S.mot=false;shut();go("idle");break}if(S.tm>=15){S.valve=true;go("tfi","Oil valve open. Trial for ignition.")}break;
   case "tfi":
    if(!want){S.mot=false;shut();go("idle");break}
    if(S.flame&&seen&&S.tm>0.5){S.recycles=0;go("carry",`Flame proven: cad cell ${f0(S.cadR)} Ω. Spark stays on 10 s.`)}
    else if(S.tm>=15){const lit=S.flame;S.mot=false;shut();S.lockCount++;S.lock=true;
     const why=lit?`The flame was burning, but the cad cell read ${f0(S.cadR)} Ω (needs under 1600).`:!motorRuns?"The burner motor isn't running.":!pumpTurns?"The motor runs but the pump isn't turning.":S.air||S.tank<=0.5?"No oil: air in the pump.":!cutOpen?`Pump pressure ${f0(P)} psi is too low to open the cutoff.`:!spark?"Oil sprayed for 15 s with no spark.":"No flame.";
     if(S.lockCount>=3){S.rlock=true;go("lock",`Lockout ${S.lockCount} in a row: restricted lockout. ${why}`,"b")}else go("lock",`Lockout: no flame proven in 15 s. ${why}`,"b")}
    break;
   case "carry":if(!want){S.mot=false;shut();go("idle");break}if(!seen){S.mot=false;shut();go("recycle","Flame lost during ignition carryover. 60 s recycle delay.","b");break}if(S.tm>=10){S.ign=false;S.lockCount=0;go("run","Spark off. Firing.")}break;
   case "run":
    if(!want){S.mot=false;shut();go("idle",S.limOpen?"":"Heat call over. Oil valve closed, burner off.");break}
    if(!seen){S.mot=false;shut();S.recycles++;if(S.recycles>=3){S.lock=true;S.lockCount++;go("lock","Third flame loss in a row: lockout.","b")}else go("recycle","Flame lost. Burner off; recycle delay 60 s.","b")}
    break;
   case "recycle":S.mot=false;shut();if(S.tm>=60){if(want){go("safe","Recycle delay over. Trying again.")}else go("idle")}break;
   case "lock":S.mot=false;shut();if(!S.lock)go("idle");break;
  }
  // blower: fan/limit control
  const fsw=S.fanSw?Tpl>100:Tpl>=125;
  if(fsw!==!!S.fanSw){S.fanSw=fsw;if(S.fan==="auto")log(sim,fsw?"Fan control closed at 125°F. Blower on.":"Fan control opened at 100°F. Blower off.")}
  const bwant=S.fan==="on"||S.limOpen||fsw;
  S.blowerOn=bwant&&!F.blower;
  const cfm=S.blowerOn?V.cfm*(F.afilter?0.5:1):0;S.cfm=cfm;
  // heat
  const input=S.flame?gph*BTU_GAL:0;S.input=input;
  const out=input*(S.flame?S.eff/100:0);
  const Tr=S.Troom,eps=0.88,Chx=55;
  const toAir=1.08*cfm*eps*(S.Thx-Tr);
  S.Thx+=(out-toAir-35*(S.Thx-Tr))/3600/Chx*dt;
  S.Tsup=cfm>0?Tr+eps*(S.Thx-Tr):Tr+(S.Thx-Tr)*0.2;
  S.Troom+=((cfm>0?toAir:0)+(cfm>0?0:35*(S.Thx-Tr)*0.5)-857*(S.Troom-V.out))/3600/3000*dt;
  // carbon monoxide: a blocked chimney pushes flue gas into the basement
  const leak=S.flame&&(F.chimney||S.over>0.01)?S.co*(F.chimney?0.4:0.05):0;
  S.coHouse=Math.max(0,S.coHouse+(leak-S.coHouse*0.5)/3600*dt);
  if(S.coHouse>=70&&!S.logs2.co&&!F.coDead){S.logs2.co=1;log(sim,`CO alarm sounding: ${f0(S.coHouse)} ppm in the house. Everyone out; call 911.`,"b")}
  if(S.coHouse<35)S.logs2.co=0;
  if(S.coHouse>=400){explode(sim,"co");return}
  if(S.Thx>=700){explode(sim,"melt");return}
  if(S.Thx>=480&&!S.logs2.hx){S.logs2.hx=1;log(sim,`Heat exchanger at ${f0(S.Thx)}°F and climbing.`,"b")}
  if(S.dead)return;
 },
 light(){const S=this.S,sim=this;S.flame=true;S.ignDelay=0;
  if(S.pool>=0.012){S.flame=true;explode(sim,"puff");return}
  if(S.pool>=0.0015){log(sim,`Puffback: about ${(S.pool*128).toFixed(1)} oz of oil in the chamber lit with a thump and blew soot out.`,"b");S.soot=Math.min(1,S.soot+S.pool*20);S.puffT=S.t}
  else if(this.F.gap)log(sim,"Late ignition: it lit with a rumble after several seconds of spray.","w");
  S.pool=0},
 draw(dt){const S=this.S,F=this.F,V=this.V,p="o_";
  const fl=$(p+"flame");if(fl){fl.style.opacity=S.flame?1:0;const lazy=S.smoke>2.5;fl.querySelectorAll(".fl").forEach(e=>e.setAttribute("fill",lazy?"#e0662a":"#f2a53a"));fl.style.transform=S.flame&&(F.leak||F.ofilter)?`scaleX(${(0.85+0.15*Math.sin(S.t*6)).toFixed(2)})`:"";fl.style.transformOrigin="204px 266px"}
  at(p+"puff","opacity",S.puffT&&S.t-S.puffT<4?0.9:0);
  at(p+"spark","opacity",S.ign&&!F.igniter&&blink(120)?1:0);at(p+"igLamp","fill",S.ign?"#9fd0ff":"var(--lamp-off)");
  at(p+"pool","opacity",clamp(S.pool*120,0,1).toFixed(2));
  at(p+"hxBody","fill",mix([154,161,168],[214,70,30],(S.Thx-120)/500));at(p+"soot","opacity",(S.soot*0.75).toFixed(2));
  at(p+"block","opacity",F.chimney?1:0);at(p+"flap","transform",F.baro?"rotate(70 436 186)":`rotate(${clamp(-S.breech*400-6,0,40).toFixed(0)} 436 186)`);
  S.aoff-=dt*30;["aSup","aRet","fgas","smk"].forEach(id=>{const e=$(p+id);if(e)e.style.strokeDashoffset=F.chimney&&(id==="fgas"||id==="smk")?-S.aoff:S.aoff});
  at(p+"aSupG","opacity",S.blowerOn?1:0);at(p+"aRetG","opacity",S.blowerOn?1:0);
  at(p+"aSup","stroke",acol(S.Tsup));at(p+"aSupH","stroke",acol(S.Tsup));at(p+"aRet","stroke",acol(S.Troom));at(p+"aRetH","stroke",acol(S.Troom));
  const sc=S.smoke>2?"#4a4a4a":"#c4cacf";at(p+"fgas","opacity",S.mot||S.stackHot>0.2?1:0);at(p+"fgas","stroke",sc);at(p+"smk","opacity",S.stackHot>0.1?1:0);at(p+"smk","stroke",sc);
  if(S.blowerOn)S.ang=(S.ang+dt*800)%360;at(p+"blades","transform",`rotate(${S.ang} 296 384)`);
  at(p+"band","transform",`rotate(${((V.air-50)*1.4).toFixed(0)} 94 268)`);
  at(p+"dirt","opacity",F.afilter?0.6:0);at(p+"ofDirt","opacity",F.ofilter?1:0);at(p+"bub","opacity",F.leak&&S.mot?(blink(300)?1:.3):0);
  at(p+"olBtn","fill",S.motorTripped||F.motorOL?(blink(400)?"#ff5a3a":"#7a1a10"):"#d23a26");
  at(p+"limLamp","fill",S.limOpen?"var(--bad)":"var(--ok)");at(p+"dial","transform",`rotate(${clamp((S.Tpl-70)*0.9,0,170).toFixed(0)} 378 259)`);
  const led=S.lock?(blink(250)?"var(--bad)":"var(--lamp-off)"):S.st==="recycle"?(blink(1000)?"#e8c33a":"var(--lamp-off)"):S.cadR<1600?"var(--ok)":"var(--lamp-off)";
  at(p+"led","fill",led);txt(p+"priTxt",this.stText(S).toUpperCase().slice(0,18));
  at(p+"tstatLamp","fill",S.calling?"#e0662a":"var(--lamp-off)");
  const coOn=S.coHouse>=70&&!F.coDead;at(p+"coLamp","fill",coOn?(blink(250)?"var(--bad)":"#600"):F.coDead?"var(--lamp-off)":"#3fa34d");txt(p+"coTxt",F.coDead?"--":String(f0(S.coHouse)));
  // gauges
  at(p+"pNeedle","transform",`rotate(${(S.pumpP/200*240).toFixed(0)} 128 314)`);txt(p+"psiTxt",`${f0(S.pumpP)} psi`);
  at(p+"vNeedle","transform",`rotate(${(S.vac/30*240).toFixed(0)} 52 330)`);txt(p+"vacTxt",`${S.vac.toFixed(1)}" Hg`);at(p+"vacTxt","fill",S.vac>6?"var(--bad)":"var(--ink)");
  txt(p+"cadTxt",S.cadR>=20000?"dark":`${f0(S.cadR)} Ω`);at(p+"cadTxt","fill",S.flame&&S.cadR>=1600?"#c0281c":"#1d2327");
  txt(p+"brTxt",`Breech ${S.breech.toFixed(3)}"`);txt(p+"ofTxt",`Overfire ${S.over>0?"+":""}${S.over.toFixed(3)}"`);at(p+"ofTxt","fill",S.over>-0.005?"#c0281c":"#1d2327");
  txt(p+"hxTxt",`HX ${f0(S.Thx)}°F`);txt(p+"plTxt",`${f0(S.Tpl)}°F`);
  const tl=S.tank/275;at(p+"oilLvl","height",(32*clamp(tl/0.73,0,1)).toFixed(1));at(p+"oilLvl","y",(452-32*clamp(tl/0.73,0,1)).toFixed(1));txt(p+"tankTxt",`${f0(S.tank)} gal`);
  // analyzer
  const on=S.flame;
  txt(p+"a_smoke",on?`Smoke   #${S.smoke.toFixed(0)}`:"Smoke   --");txt(p+"a_co2",on?`CO2     ${S.co2.toFixed(1)}%`:"CO2     --");txt(p+"a_o2",on?`O2      ${S.o2.toFixed(1)}%`:"O2      --");
  txt(p+"a_co",on?`CO      ${f0(S.co)} ppm`:"CO      --");txt(p+"a_stack",on?`Net stk ${f0(S.net)}°F`:"Net stk --");txt(p+"a_eff",on?`Eff     ${S.eff.toFixed(1)}%`:"Eff     --");
  txt(p+"a_rise",S.blowerOn&&on?`Rise    ${f0(S.Tsup-S.Troom)}°F`:"Rise    --");
  txt(p+"supTxt",`${f0(S.Tsup)}°F`);txt(p+"retTxt",`${f0(S.Troom)}°F`);txt(p+"roomTxt",`${S.Troom.toFixed(1)}°F`);txt(p+"outTxt",`${V.out}°F`);txt(p+"tstatTxt",String(V.set));
 },
 boom(kind){const F=this.F,S=this.S;
  if(kind==="puff")return{t:"Puffback",b:`<p>About ${(S.pool*128).toFixed(0)} oz of unburned oil had collected in the combustion chamber. When it finally lit, it exploded: the doors blew open, soot sprayed through the basement and up the ducts, and the flue pipe came apart.</p><ul>
   ${F.igniter?li(1,"Igniter dead: every trial sprayed oil for 15 s with no spark."):""}${F.gap?li(1,"Electrodes out of adjustment: late ignition."):""}
   ${li(S.lockCount>=2,"The reset button was pressed over and over, adding oil each time.","Resets.")}</ul>
   <p>Press reset once. If it locks out again, find the cause, and check the chamber for oil before lighting it.</p><small>Simplified: the sim explodes at about 1.5 oz of pooled oil.</small>`,wreck:1};
  if(kind==="melt")return{t:"Heat exchanger overheated",b:`<p>With no air across the drum, it overheated and split.</p><ul>${F.blower?li(1,"Blower motor dead."):""}${F.afilter?li(1,"Filter plugged."):""}${li(F.limitFail,"Limit failed closed.","Limit.")}</ul><small>Simplified.</small>`,wreck:1};
  return{t:"Carbon monoxide filled the house",b:`<p>With the chimney blocked, flue gas had nowhere to go and was pushed out of the burner and the draft regulator into the basement: ${f0(S.coHouse)} ppm.</p><ul>
   ${F.chimney?li(1,"Chimney blocked."):""}${li(F.coDead,"CO alarm battery dead: nobody was warned.","CO alarm.")}</ul><p>A draft test at every service and a working CO alarm catch this.</p><small>Simplified: CO build-up is sped up.</small>`,wreck:0};
 }};
OIL.lampOn=S=>({call:S.calling,mot:S.mot&&!OIL.F.motorOL,ign:S.ign,valve:S.valve,flame:S.cadR<1600,fan:S.blowerOn,lim:S.limOpen,lock:S.lock});
