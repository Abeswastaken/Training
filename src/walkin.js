/* ============ WALK-IN COOLER / FREEZER (R-404A, pump-down, receiver) ============ */
// R-404A saturation, psig (refrigerants.com R-404A P-T chart column)
const PT4=[[-60,-3.2],[-52,0],[-40,4.3],[-30,9.5],[-20,15.7],[-10,23.2],[0,32.1],[10,42.4],[20,54.5],[30,68.4],[40,84.4],[50,103],[60,123],[70,147],[80,173],[90,202],[100,234],[110,270],[120,310],[130,353],[140,401],[150,453],[160,510]];
function psat4(T){const t=PT4;if(T<=t[0][0])return Math.max(-14,t[0][1]+(T-t[0][0])*0.3);for(let i=1;i<t.length;i++){if(T<=t[i][0]){const[a,pa]=t[i-1],[b,pb]=t[i];return pa+(pb-pa)*(T-a)/(b-a)}}return 510+(T-160)*6}
function tsat4(P){const t=PT4;if(P<=t[0][1])return t[0][0]+(P-t[0][1])/0.3;for(let i=1;i<t.length;i++){if(P<=t[i][1]){const[a,pa]=t[i-1],[b,pb]=t[i];return a+(b-a)*(P-pa)/(pb-pa)}}return 160+(P-510)/6}
const fmtP=P=>P<0?`${(-P*2.036).toFixed(0)} inHg`:`${f0(P)} psig`;
const bcol=T=>mix([47,111,214],[150,196,232],(T+20)/70);

SRC.r404=["Refrigerants.com: R-404A pressure-temperature chart and properties","https://refrigerants.com/wp-content/uploads/2020/02/R404A_LINK.pdf"];
SRC.rsg=["RSG condensing unit and refrigeration system manual (pressure controls, defrost, superheat, box temps)","https://manuals.plus/rsg/r448a-condensing-unit-and-refrigeration-system-manual.pdf"];
SRC.kolpak=["Kolpak walk-in manual: electric defrost timer (55°F termination, fan delay, pump-down at defrost)","https://www.manualslib.com/manual/2235869/Kolpak-Pr.html?page=22"];
SRC.achrfd=["ACHR News, The Professor: Defrost termination / fan delay controls","https://achrnews.com/articles/110659-the-professor-defrost-termination-fan-delay-controls"];
SRC.dftxv=["Danfoss: Walk-in coolers, TXVs and solenoid valves","https://www.danfoss.com/en-us/service-and-support/case-stories/dcs/walk-in-coolers-thermostatic-expansion-valves-and-solenoid-valves"];
SRC.sgloc=["AC Service Tech: Filter drier, solenoid valve and sight glass locations","https://www.acservicetech.com/post/filter-drier-solenoid-valve-and-liquid-line-sight-locations-in-a-refrigeration-system"];

PHOTOS.cooler={compressor:[gimg("walk-in condensing unit hermetic compressor")],condenser:[gimg("walk-in condensing unit condenser coil")],fan:[gimg("condensing unit condenser fan motor")],
 contactor:[gimg("refrigeration contactor 30 amp")],receiver:[gimg("refrigeration liquid receiver with rotalock valve")],drier:[gimg("Sporlan Catch-All filter drier")],
 sglass:[gimg("refrigeration sight glass moisture indicator")],lls:[gimg("liquid line solenoid valve refrigeration Sporlan")],txv:[gimg("walk-in TXV expansion valve R-404A")],
 ucool:[gimg("walk-in cooler evaporator unit cooler")],efans:[gimg("walk-in evaporator fan motor")],dpc:[gimg("dual pressure control refrigeration Johnson Penn")],
 timer:[gimg("Paragon 8145 defrost timer")],cch:[gimg("compressor crankcase heater belly band")],tstat:[gimg("walk-in cooler thermostat")],gauges:[gimg("R-404A manifold gauges")],
 door:[gimg("walk-in cooler door gasket")],drain:[gimg("walk-in freezer drain line heater")],suction:[gimg("insulated suction line walk-in")],liquid:[gimg("refrigeration liquid line copper")],
 box:[gimg("walk-in cooler interior")]};
PHOTOS.freezer=Object.assign({},PHOTOS.cooler,{heaters:[gimg("walk-in freezer evaporator defrost heater element")],ucool:[gimg("walk-in freezer evaporator low profile")],box:[gimg("walk-in freezer interior")]});

ILL.receiver=`${box(16,46,128,40,"#7c858c",18)}<rect x="22" y="66" width="116" height="16" rx="8" fill="#e8892b" opacity=".85"/>${pipeV(124,14,46,8)}${pipeV(34,86,114,8)}${box(26,34,16,14,BR,3)}${label(80,62,"RECEIVER",WH,8)}${label(124,10,"FROM CONDENSER",K,6)}${label(58,112,"LIQUID OUT",K,6)}`;
ILL.sglass=`${pipeH(4,56,60,8)}${pipeH(104,156,60,8)}${hexnut(80,60,28,BR)}<circle cx="80" cy="60" r="18" fill="#f4f8fb" stroke="${K}"/><circle cx="80" cy="60" r="7" fill="#3fa34d"/>${[0,1,2].map(i=>`<circle cx="${70+i*10}" cy="${50+i*3}" r="2.5" fill="none" stroke="#6fb3e8"/>`).join("")}${label(80,104,"GREEN = DRY   YELLOW = WET",K,6)}${label(80,116,"BUBBLES = FLASH GAS",K,6)}`;
ILL.lls=`${pipeH(4,52,86,8)}${pipeH(108,156,86,8)}${box(52,72,56,28,BR,4)}${box(60,24,40,46,"#2f3337",4)}${label(80,48,"COIL",WH,8)}${label(80,60,"24/120/208V",WH,5)}<path d="M100 36 C120 36 126 24 140 20" stroke="#222" stroke-width="2" fill="none"/>${label(80,114,"NORMALLY CLOSED",K,7)}<path d="M30 104 l12 0 -4 -3 m4 3 -4 3" stroke="${K}" fill="none"/>`;
ILL.txv=`${pipeH(4,52,74,8)}${box(52,60,48,28,BR,4)}<path d="M56 60 V44 Q76 26 96 44 V60 Z" fill="${BR}" stroke="${BRD}"/>${pipeV(76,88,116,8)}<path d="M96 46 C126 40 130 22 146 18" stroke="${CU}" stroke-width="1.6" fill="none"/>${box(132,10,24,10,CU,4)}${label(144,32,"BULB",K,6)}${label(28,66,"LIQUID IN",K,6)}${label(110,110,"TO COIL",K,6)}${box(102,66,14,8,BRD,2)}${label(122,80,"ADJ",K,6)}`;
ILL.ucool=`${box(8,30,144,62,"#d8dcdf",4)}${box(98,36,48,50,"#59626a",2)}${fins(100,38,44,46,4,"#9aa3aa")}${[44,78].map(x=>`<circle cx="${x}" cy="61" r="18" fill="#3a3f44" stroke="${K}"/><circle cx="${x}" cy="61" r="4" fill="#9aa3aa"/>`).join("")}${box(96,92,54,6,"#9aa1a8",2)}${label(80,22,"UNIT COOLER (EVAPORATOR)",K,7)}${label(120,112,"DRAIN PAN",K,6)}`;
ILL.efans=`<circle cx="80" cy="58" r="40" fill="none" stroke="${K}" stroke-width="2"/>${[0,1,2,3,4].map(i=>`<ellipse cx="80" cy="36" rx="8" ry="20" fill="#9aa3aa" stroke="${K}" transform="rotate(${i*72} 80 58)"/>`).join("")}<circle cx="80" cy="58" r="9" fill="#22262a"/>${label(80,112,"EVAPORATOR FAN + GUARD",K,7)}`;
ILL.dpc=`${box(30,18,100,74,"#c9cfd4",4)}${box(42,30,34,30,"#9aa1a8",3)}${box(84,30,34,30,"#9aa1a8",3)}${label(59,48,"LOW",K,7)}${label(101,48,"HIGH",K,7)}<circle cx="59" cy="72" r="5" fill="#e8c33a"/><circle cx="101" cy="72" r="5" fill="#d23a26"/><path d="M50 92 C50 108 30 110 20 114 M110 92 C110 108 130 110 140 114" stroke="${CU}" stroke-width="1.6" fill="none"/>${label(80,12,"DUAL PRESSURE CONTROL",K,7)}`;
ILL.timer=`${box(24,10,112,100,"#c9cfd4",4)}<circle cx="80" cy="56" r="36" fill="#f4f4f0" stroke="${K}"/>${Array.from({length:24},(_,i)=>`<line x1="${80+30*Math.sin(i*Math.PI/12)}" y1="${56-30*Math.cos(i*Math.PI/12)}" x2="${80+34*Math.sin(i*Math.PI/12)}" y2="${56-34*Math.cos(i*Math.PI/12)}" stroke="${K}"/>`).join("")}${[0,6,12,18].map(h=>`<rect x="${77+26*Math.sin(h*Math.PI/12)}" y="${53-26*Math.cos(h*Math.PI/12)}" width="6" height="6" fill="#d23a26"/>`).join("")}<line x1="80" y1="56" x2="80" y2="28" stroke="${K}" stroke-width="2"/>${label(80,104,"24-HR DIAL, PINS = DEFROSTS",K,6)}`;
ILL.cch=`<path d="M52 108 V40 Q52 14 80 14 Q108 14 108 40 V108 Z" fill="#30363b" stroke="${K}"/><rect x="48" y="80" width="64" height="12" rx="3" fill="#d2541f" stroke="${K}"/><path d="M112 86 C130 86 136 100 150 104" stroke="#222" stroke-width="2" fill="none"/>${label(80,118,"CRANKCASE HEATER BAND",K,7)}`;
ILL.heaters=`${box(16,26,128,64,"#59626a",3)}${fins(18,28,124,60,4,"#9aa3aa")}<path d="M20 42 H140 M20 74 H140" stroke="#d2541f" stroke-width="4"/>${label(80,108,"ELECTRIC DEFROST HEATER RODS",K,7)}`;
ILL.drain=`${pipeH(10,110,30,8,"#c9cfd4")}${pipeV(110,26,110,8,"#c9cfd4")}<path d="M10 34 H114 V110" stroke="#d2541f" stroke-width="1.6" stroke-dasharray="4 3" fill="none"/>${box(96,104,30,8,"#7a8288",2)}${label(56,52,"HEATER TAPE",K,7)}${label(56,64,"(freezer only)",K,6)}${label(70,118,"P-TRAP OUTSIDE THE BOX",K,6)}`;
ILL.door=`${box(30,8,100,104,"#d8dcdf",3)}<rect x="30" y="8" width="100" height="104" rx="3" fill="none" stroke="#3a3f44" stroke-width="5"/>${box(112,52,10,22,"#7a8288",2)}${label(80,60,"GASKET",K,8)}${label(80,72,"+ HEATER WIRE",K,6)}`;

function wiSvg(p,lt){return `
<defs>
 <linearGradient id="${p}gEvap" gradientUnits="userSpaceOnUse" x1="0" y1="114" x2="0" y2="60"><stop offset="0" stop-color="var(--r-mix)"/><stop id="${p}eS1" offset=".8" stop-color="var(--r-mix)"/><stop id="${p}eS2" offset=".9" stop-color="var(--r-suc)"/><stop offset="1" stop-color="var(--r-suc)"/></linearGradient>
 <linearGradient id="${p}gCond" gradientUnits="userSpaceOnUse" x1="0" y1="205" x2="0" y2="396"><stop offset="0" stop-color="var(--r-dis)"/><stop offset=".12" stop-color="#e0662a"/><stop id="${p}cS2" offset=".9" stop-color="var(--r-liq)"/><stop offset="1" stop-color="var(--r-liq)"/></linearGradient>
</defs>
<line x1="10" y1="452" x2="790" y2="452" stroke="var(--line)" stroke-dasharray="2 4"/>
<g class="part" data-p="box" tabindex="0">
 <rect class="hl" x="20" y="40" width="370" height="405" rx="3" fill="var(--panel)" fill-opacity=".5" stroke="var(--line)" stroke-width="9"/>
 <rect x="27" y="47" width="356" height="391" fill="none" stroke="var(--muted)" stroke-width=".8" stroke-dasharray="3 3"/>
 <g fill="var(--plate)" stroke="var(--line)"><rect x="96" y="330" width="170" height="5"/><rect x="96" y="390" width="170" height="5"/>
 <rect x="104" y="300" width="34" height="30"/><rect x="142" y="308" width="28" height="22"/><rect x="200" y="296" width="40" height="34"/><rect x="108" y="362" width="44" height="28"/><rect x="170" y="366" width="30" height="24"/><rect x="214" y="358" width="38" height="32"/>
 <rect x="110" y="410" width="60" height="30"/><rect x="186" y="414" width="44" height="26"/></g>
</g>
<text class="lbl" x="36" y="70">${lt?"Walk-in freezer":"Walk-in cooler"}</text>
<text class="val" id="${p}boxTxt" x="36" y="90">35.0°F</text>
<text class="lblS" x="30" y="464">Building around the box: 75°F</text>

<!-- thermostat -->
<g class="part" data-p="tstat" tabindex="0">
 <rect class="hl body" x="34" y="146" width="44" height="46" rx="6"/>
 <text class="val" id="${p}tstatTxt" x="56" y="172" text-anchor="middle">35</text>
 <circle id="${p}tstatLamp" cx="56" cy="182" r="3" fill="var(--lamp-off)"/>
 <text class="lblS" x="56" y="206" text-anchor="middle">Thermostat</text>
</g>

<!-- door -->
<g class="part" data-p="door" tabindex="0">
 <rect class="hl" x="12" y="250" width="40" height="192" fill="transparent" stroke="none"/>
 <rect id="${p}doorC" x="15" y="252" width="11" height="188" rx="2" fill="#c9cfd4" stroke="var(--line)"/>
 <polygon id="${p}doorO" points="21,252 64,266 64,426 21,440" fill="#c9cfd4" stroke="var(--line)" opacity="0"/>
 <g id="${p}aDoorG" opacity="0"><path id="${p}aDoor" class="air" d="M2 300 H44 M2 350 H50 M2 400 H44" stroke="var(--air-warm)"/></g>
 <rect id="${p}gasket" x="24" y="252" width="3" height="188" fill="var(--bad)" opacity="0"/>
 <text class="lblS" x="34" y="244">Door</text>
</g>

<!-- return air into the coil -->
<g id="${p}aRetG"><path id="${p}aRet" class="air" d="M306 230 V130 M346 230 V164"/>
 <path id="${p}aRetH" d="M300 138 l6 -10 6 10 M340 172 l6 -10 6 10" fill="none" stroke-width="2.5"/></g>
<!-- supply air out of the fans -->
<g id="${p}aSupG"><path id="${p}aSup" class="air" d="M190 74 H64 M190 98 H74"/>
 <path id="${p}aSupH" d="M72 68 l-10 6 10 6 M82 92 l-10 6 10 6" fill="none" stroke-width="2.5"/></g>

<!-- unit cooler -->
<rect x="160" y="50" width="214" height="72" rx="4" fill="var(--plate)" stroke="var(--line)" stroke-width="1.2"/>
<g class="part" data-p="efans" tabindex="0">
 <rect class="hl" x="196" y="60" width="98" height="54" fill="transparent" stroke="none"/>
 ${[222,268].map((x,i)=>`<circle cx="${x}" cy="87" r="22" fill="#3a3f44" stroke="var(--line)"/><g id="${p}eb${i}" fill="#9aa3aa">${[0,1,2,3,4].map(k=>`<ellipse cx="${x}" cy="72" rx="5" ry="12" transform="rotate(${k*72} ${x} 87)"/>`).join("")}</g><circle cx="${x}" cy="87" r="4" fill="#22262a"/>`).join("")}
 <text class="tag" x="245" y="128" text-anchor="middle" fill="var(--muted)">EVAP FANS</text>
</g>
<g class="part" data-p="ucool" tabindex="0">
 <rect class="hl" x="300" y="56" width="58" height="60" rx="2" fill="#5d6b75" stroke="var(--line)"/>
 <rect x="305" y="60" width="48" height="54" fill="url(#${p}gEvap)"/>
 <g stroke="rgba(255,255,255,.35)" stroke-width="1">${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<line x1="${307+i*4.4}" y1="60" x2="${307+i*4.4}" y2="114"/>`).join("")}</g>
 <g id="${p}ice" opacity="0"><rect x="297" y="53" width="64" height="66" rx="4" fill="#cfe8f7"/><rect x="300" y="56" width="58" height="60" rx="3" fill="#f2faff"/><path d="M302 62 h54 M302 72 h54 M302 82 h54 M302 92 h54 M302 102 h54 M302 112 h54" stroke="#8fc3e6" stroke-dasharray="2 4"/></g>
 <text id="${p}iceTxt" x="329" y="90" text-anchor="middle" font-family="var(--display)" font-weight="700" font-size="12" fill="#2f6fd6" opacity="0">ICED</text>
</g>
${lt?`<g class="part" data-p="heaters" tabindex="0"><path id="${p}htr" d="M300 70 H358 M300 96 H358" stroke="var(--lamp-off)" stroke-width="3.5" fill="none"/><rect class="hl" x="298" y="64" width="62" height="38" fill="transparent" stroke="none"/></g>`:""}
<path id="${p}pMix" class="rpipe" d="M329 142 V118" stroke="var(--r-mix)" stroke-width="5"/>
<rect x="294" y="117" width="70" height="6" rx="2" fill="var(--line)"/>
<rect id="${p}panIce" x="294" y="110" width="70" height="8" rx="2" fill="#eaf6ff" stroke="#8fc3e6" opacity="0"/>

<!-- drain -->
<g class="part" data-p="drain" tabindex="0">
 <path d="M364 120 H400 V440" fill="none" stroke="#b9c0c6" stroke-width="5"/>
 ${lt?`<path id="${p}dHtr" d="M364 117 H397 V440" fill="none" stroke="var(--lamp-off)" stroke-width="1.6" stroke-dasharray="4 3"/>`:""}
 <rect class="hl" x="392" y="436" width="18" height="8" rx="2" fill="#7a8288"/>
 <circle id="${p}drip" cx="400" cy="430" r="3" fill="#6fb3e8" opacity="0"/>
 <rect id="${p}dIce" x="395" y="380" width="10" height="60" rx="3" fill="#eaf6ff" stroke="#8fc3e6" opacity="0"/>
</g>

<!-- suction line -->
<g class="part" data-p="suction" tabindex="0">
 <path class="ins" d="M358 62 H425 V372 H560" stroke-width="14"/>
 <path id="${p}pSuc" class="rpipe" d="M358 62 H425 V372 H560" stroke="var(--r-suc)" stroke-width="8"/>
 <path id="${p}fSuc" class="rflow" d="M358 62 H425 V372 H560"/>
 <path id="${p}frost" d="M358 62 H425 V372 H560" fill="none" stroke="var(--ice)" stroke-width="14" stroke-dasharray="2 3" opacity="0"/>
</g>

<!-- liquid line -->
<g class="part" data-p="liquid" tabindex="0">
 <path id="${p}pLiq" class="rpipe" d="M662 428 H644 V446 H438 V150 H340" stroke="var(--r-liq)" stroke-width="5"/>
 <path id="${p}fLiq" class="rflow" d="M662 428 H644 V446 H438 V150 H340"/>
</g>

<!-- TXV -->
<g class="part" data-p="txv" tabindex="0">
 <rect class="hl" x="312" y="130" width="34" height="32" fill="transparent" stroke="none"/>
 <rect class="body" x="318" y="142" width="22" height="16" rx="3" fill="var(--brass)"/>
 <path d="M336 146 C392 146 388 96 376 66" fill="none" stroke="#c87f4f" stroke-width="1.4"/><rect x="368" y="58" width="16" height="8" rx="3" fill="#c87f4f" stroke="var(--ink)" stroke-width=".8"/>
 <text class="tag" x="326" y="172" text-anchor="middle" fill="var(--muted)">TXV</text>
</g>

<!-- liquid line solenoid -->
<g class="part" data-p="lls" tabindex="0">
 <rect class="hl" x="350" y="124" width="26" height="36" fill="transparent" stroke="none"/>
 <rect x="352" y="143" width="22" height="14" rx="2" fill="var(--brass)" stroke="var(--line)"/>
 <rect x="354" y="126" width="18" height="18" rx="2" fill="#2f3337"/>
 <circle id="${p}llsLamp" cx="363" cy="135" r="4" fill="var(--lamp-off)"/>
 <text class="tag" x="374" y="186" text-anchor="middle" fill="var(--muted)">SOLENOID</text>
</g>
<text class="val" id="${p}coilTxt" x="166" y="146" font-size="11">Coil 25°F</text>
<text class="val" id="${p}stTxt" x="166" y="162" font-size="11" font-weight="700">COOLING</text>

<!-- outdoor condensing unit -->
<rect x="446" y="176" width="330" height="264" rx="6" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>
<text class="lblS" x="454" y="192">Condensing unit</text>
<text class="lbl" x="454" y="148">Outdoors</text><text class="val" id="${p}outTxt" x="454" y="166">90°F</text>

<rect x="462" y="198" width="88" height="88" rx="3" fill="var(--paper)" stroke="var(--line)" opacity=".7"/>
<g class="part" data-p="contactor" tabindex="0">
 <rect class="hl body" x="468" y="206" width="34" height="44" rx="3"/>
 <rect id="${p}contBar" x="472" y="216" width="26" height="6" fill="var(--muted)"/>
 <circle id="${p}contLamp" cx="485" cy="238" r="4" fill="var(--lamp-off)"/>
 <text class="tag" x="485" y="262" text-anchor="middle" fill="var(--muted)">CONTACTOR</text>
</g>
<g class="part" data-p="timer" tabindex="0">
 <circle class="hl" cx="527" cy="228" r="17" fill="#f4f4f0" stroke="var(--line)"/>
 ${[0,6,12,18].map(h=>`<circle cx="${527+13*Math.sin(h*Math.PI/12)}" cy="${228-13*Math.cos(h*Math.PI/12)}" r="1.8" fill="var(--bad)"/>`).join("")}
 <line id="${p}tHand" x1="527" y1="228" x2="527" y2="214" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
 <circle id="${p}defLamp" cx="527" cy="256" r="4" fill="var(--lamp-off)"/>
 <text class="tag" x="527" y="276" text-anchor="middle" fill="var(--muted)">TIMER</text>
</g>

<!-- discharge -->
<path id="${p}pDis" class="rpipe" d="M600 290 V215 H730" stroke="var(--r-dis)" stroke-width="7"/>
<path id="${p}fDis" class="rflow" d="M600 290 V215 H730"/>
<text class="val" id="${p}dTxt" x="608" y="250" font-size="11">Discharge 160°F</text>

<!-- condenser -->
<g class="part" data-p="condenser" tabindex="0">
 <rect class="hl" x="724" y="200" width="40" height="200" rx="3" fill="#5d6b75" stroke="var(--line)"/>
 <rect x="730" y="205" width="28" height="191" fill="url(#${p}gCond)"/>
 <g stroke="rgba(255,255,255,.35)" stroke-width="1">${[0,1,2,3,4,5,6,7,8].map(i=>`<line x1="730" y1="${222+i*20}" x2="758" y2="${222+i*20}"/>`).join("")}</g>
 <rect id="${p}cDirt" x="724" y="200" width="40" height="200" fill="#6b5a3a" opacity="0"/>
</g>
<g id="${p}aInG"><path id="${p}aIn" class="air" d="M796 250 H772 M796 300 H772 M796 350 H772"/></g>
<path id="${p}pCnd" class="rpipe" d="M746 398 V410" stroke="var(--r-liq)" stroke-width="5"/>

<g class="part" data-p="fan" tabindex="0">
 <rect class="hl body" x="640" y="160" width="120" height="14" rx="3"/>
 <ellipse id="${p}fb1" cx="700" cy="167" rx="40" ry="4" fill="var(--muted)"/>
 <text class="lblS" x="700" y="156" text-anchor="middle">Condenser fan</text>
</g>
<g id="${p}aOutG"><path id="${p}aOut" class="air" d="M672 146 V96 M700 146 V90 M728 146 V96"/>
 <path id="${p}aOutH" d="M666 100 l6 -10 6 10 M694 94 l6 -10 6 10 M722 100 l6 -10 6 10" fill="none" stroke-width="2.5"/></g>

<!-- receiver -->
<g class="part" data-p="receiver" tabindex="0">
 <rect class="hl" x="650" y="408" width="112" height="28" rx="13" fill="#7c858c" stroke="var(--line)"/>
 <clipPath id="${p}rcvClip"><rect x="652" y="410" width="108" height="24" rx="11"/></clipPath>
 <rect id="${p}rcvLvl" x="652" y="422" width="108" height="14" fill="var(--r-liq)" opacity=".85" clip-path="url(#${p}rcvClip)"/>
 <text x="706" y="426" text-anchor="middle" font-family="var(--display)" font-size="9" font-weight="700" fill="#fff">RECEIVER</text>
</g>

<!-- compressor -->
<g class="part" data-p="compressor" tabindex="0">
 <rect class="hl" x="560" y="290" width="80" height="110" rx="30" fill="#30363b" stroke="var(--line)" stroke-width="1.5"/>
 <text x="600" y="326" text-anchor="middle" font-family="var(--display)" font-size="12" font-weight="600" fill="#e9ecee">COMPRESSOR</text>
 <text id="${p}compSt" x="600" y="346" text-anchor="middle" font-family="var(--mono)" font-size="12" fill="#e9ecee">OFF</text>
 <text id="${p}amps" x="600" y="363" text-anchor="middle" font-family="var(--mono)" font-size="11" fill="#c4cacf">0.0 A</text>
 <text id="${p}wet" x="600" y="378" text-anchor="middle" font-family="var(--display)" font-size="9" font-weight="700" fill="#6fb3e8" opacity="0">LIQUID FLOODBACK</text>
</g>
<g class="part" data-p="cch" tabindex="0">
 <rect id="${p}cchB" class="hl" x="556" y="384" width="88" height="9" rx="3" fill="var(--lamp-off)" stroke="var(--line)"/>
</g>
<g id="${p}burn" opacity="0"><g fill="#555" opacity=".85"><circle cx="600" cy="282" r="18"/><circle cx="586" cy="260" r="14"/><circle cx="612" cy="242" r="16"/></g><path d="M572 320 l14 20 -8 10 16 18" stroke="var(--bad)" stroke-width="3" fill="none"/></g>

<!-- dual pressure control -->
<g class="part" data-p="dpc" tabindex="0">
 <path d="M488 350 V368 M512 318 C540 300 585 270 600 262" fill="none" stroke="#c87f4f" stroke-width="1.2"/>
 <rect class="hl" x="470" y="318" width="52" height="32" rx="3" fill="var(--plate)" stroke="var(--line)"/>
 <circle id="${p}lpLamp" cx="484" cy="334" r="4" fill="var(--lamp-off)"/><circle id="${p}hpLamp" cx="508" cy="334" r="4" fill="var(--lamp-off)"/>
 <text class="tag" x="484" y="346" text-anchor="middle" fill="var(--muted)">LP</text><text class="tag" x="508" y="346" text-anchor="middle" fill="var(--muted)">HP</text>
 <text class="tag" x="496" y="312" text-anchor="middle" fill="var(--muted)">PRESSURE CONTROL</text>
</g>
<text class="val" id="${p}slTxt" x="452" y="392" font-size="11">Suction line 30°F</text>

<!-- drier and sight glass -->
<g class="part" data-p="drier" tabindex="0">
 <rect class="hl" x="548" y="438" width="36" height="16" rx="7" fill="#2f6a8f" stroke="var(--line)"/>
 <rect id="${p}drierFrost" x="548" y="438" width="36" height="16" rx="7" fill="var(--ice)" opacity="0"/>
 <text class="tag" x="566" y="432" text-anchor="middle" fill="var(--muted)">DRIER</text>
</g>
<g class="part" data-p="sglass" tabindex="0">
 <circle class="hl" cx="500" cy="446" r="10" fill="var(--paper)" stroke="var(--brass)" stroke-width="3"/>
 <circle id="${p}sgDot" cx="500" cy="446" r="3.5" fill="#3fa34d"/>
 <g id="${p}bub" opacity="0" fill="none" stroke="#2f6fd6" stroke-width="1.2"><circle cx="495" cy="442" r="2"/><circle cx="504" cy="441" r="1.6"/><circle cx="503" cy="450" r="2"/><circle cx="495" cy="450" r="1.4"/></g>
 <text class="tag" x="500" y="432" text-anchor="middle" fill="var(--muted)">SIGHT GLASS</text>
</g>
<text class="val" id="${p}llTxt" x="452" y="414" font-size="11">Liquid line 100°F</text>

<!-- gauges -->
<g class="part" data-p="gauges" tabindex="0">
 <path d="M512 140 C470 200 430 250 425 300" fill="none" stroke="#3d7de0" stroke-width="2.5"/>
 <path d="M568 140 C640 300 455 330 455 446" fill="none" stroke="#d23a26" stroke-width="2.5"/>
 <circle cx="425" cy="300" r="5" fill="var(--brass)"/><circle cx="455" cy="446" r="5" fill="var(--brass)"/>
 <rect class="hl body" x="508" y="122" width="64" height="18" rx="4"/>
 <circle cx="485" cy="80" r="42" class="gface" stroke="#3d7de0" stroke-width="3"/>
 <circle cx="595" cy="80" r="42" class="gface" stroke="#d23a26" stroke-width="3"/>
 <line id="${p}nLo" x1="485" y1="74" x2="485" y2="50" stroke="var(--bad)" stroke-width="2.5" stroke-linecap="round"/>
 <line id="${p}nHi" x1="595" y1="74" x2="595" y2="50" stroke="var(--bad)" stroke-width="2.5" stroke-linecap="round"/>
 <circle cx="485" cy="74" r="3" fill="var(--ink)"/><circle cx="595" cy="74" r="3" fill="var(--ink)"/>
 <text class="val" id="${p}gLoP" x="485" y="96" text-anchor="middle" font-size="11">60 psig</text>
 <text class="val" id="${p}gLoT" x="485" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">25°F sat</text>
 <text class="val" id="${p}gHiP" x="595" y="96" text-anchor="middle" font-size="11">270 psig</text>
 <text class="val" id="${p}gHiT" x="595" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">110°F sat</text>
 <text class="tag" x="485" y="31" text-anchor="middle" fill="#3d7de0">LOW SIDE</text>
 <text class="tag" x="595" y="31" text-anchor="middle" fill="#d23a26">HIGH SIDE</text>
</g>
<text class="val" id="${p}target" x="648" y="44" font-size="11">Target SH 8–10°F</text>
<text class="val" id="${p}target2" x="648" y="58" font-size="10" fill="var(--muted)">at the coil outlet</text>

<g id="${p}labels">
 <text class="st" x="608" y="232" fill="var(--r-dis)">HOT GAS</text>
 <text class="st" x="610" y="466" fill="var(--r-liq)">WARM LIQUID, HIGH PRESSURE</text>
 <text class="st" x="166" y="182" fill="var(--r-mix)">COLD LIQUID + FLASH GAS TO COIL</text>
 <text class="st" x="466" y="366" fill="var(--r-suc)">COOL VAPOR</text>
</g>`}

function mkWalk(lt){
 const p=lt?"z_":"w_";
 const Qn=lt?9000:12000,SSTn=lt?-20:25,UA=lt?75:160,Cbox=lt?900:1200,RLAw=lt?10:8,LRAw=lt?60:48;
 const Rn=(psat4(110)+ATM)/(psat4(SSTn)+ATM),Pdes=psat4(110);
 const faults=[["leak","Refrigerant leak"],["dirtyCond","Dirty condenser coil"],["condFan","Condenser fan motor fails"],["efan","Evaporator fan motors fail"],
  ["door","Door gasket torn (door won't seal)"],["llsStuck","Solenoid coil burns open (valve stays closed)"],["llsLeak","Solenoid valve leaks through"],
  ["drier","Plugged filter drier"],["moist","Moisture in the system"],["txvShut","TXV bulb loses its charge (valve closes)"],["txvBulb","TXV bulb loose on the suction line (overfeeds)"],
  ["defTimer","Defrost timer motor stops (no defrosts)"]];
 if(lt)faults.push(["heater","Defrost heaters burn out"],["term","Termination thermostat stuck open"],["drainH","Drain line heater fails"]);
 faults.push(["cch","Crankcase heater fails"],["comp","Worn compressor (leaks internally)"],["noncond","Air in the system (non-condensables)"],["contactor","Contactor contacts welded shut"],
  ["hpsFail","High pressure control fails closed"],["lpsFail","Low pressure control fails closed"],["olFail","Compressor overload fails to open"]);
 const sliders=[
  {k:"set",l:"Box thermostat",u:"°F",min:lt?-30:20,max:lt?20:60,step:1,v:lt?-10:35,n:lt?[-20,0]:[33,40],note:lt?"Freezers usually hold about -10°F":"Coolers usually hold about 35°F"},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-10,max:120,step:1,v:90,note:"Condensing unit outdoors. A head pressure control valve holds the head up in cold weather."},
  {k:"charge",l:"Refrigerant charge",u:"%",min:0,max:160,step:1,v:100,n:[90,115],note:"Percent of the correct charge. The receiver absorbs some extra; watch the sight glass."},
  {k:"dpd",l:lt?"Defrosts per day":"Off-cycle defrosts per day",u:"",min:0,max:8,step:1,v:4,n:lt?[3,4]:[2,4],note:lt?"Low temp: 3–4 a day":"Medium temp: 2–4 a day"},
  {k:"dfs",l:"Defrost fail-safe time",u:" min",min:10,max:90,step:1,v:lt?44:35,n:lt?[35,50]:[25,45],note:lt?"Low temp: about 44 minutes":"Medium temp: about 35 minutes",more:1}];
 if(lt)sliders.push({k:"term",l:"Defrost termination",u:"°F",min:35,max:90,step:1,v:55,n:[45,65],note:"About 55°F coil temperature",more:1},
  {k:"fd",l:"Fan delay",u:"°F",min:-10,max:45,step:1,v:25,n:[20,30],note:"Fans restart at about 20–30°F coil temperature",more:1});
 sliders.push({k:"sh",l:"TXV superheat setting",u:"°F",min:0,max:30,step:1,v:8,n:[6,12],note:"8–10°F at the evaporator",more:1},
  {k:"lpo",l:"Low pressure control cut-out",u:" psig",min:-5,max:40,step:1,v:3,n:[0,10],note:"Pump-down cut-out, typically about 3 psig",more:1},
  {k:"lpi",l:"Low pressure control cut-in",u:" psig",min:5,max:80,step:1,v:20,n:[15,lt?22:45],note:"Typically about 20 psig",more:1},
  {k:"hps",l:"High pressure control cut-out",u:" psig",min:250,max:600,step:5,v:450,n:[400,460],note:"Typically 450 psig, resets at 375",more:1});
 const lamps=[["call","Box call","g"],["lls","Solenoid","g"],["comp","Compressor","g"],["fan","Cond. fan","g"],["efan","Evap fans","g"],["def","Defrost","a"]];
 if(lt)lamps.push(["heat","Heaters","a"]);
 lamps.push(["lp","LP open","a"],["hp","HP open","r"],["ol","Overload","r"],["cch","Crankcase htr","a"]);

 const sim={id:lt?"freezer":"cooler",p,lt,name:lt?"Walk-in freezer":"Walk-in cooler",svg:wiSvg(p,lt),sliders,faults,
  hidden:["hpsFail","lpsFail","olFail"],txvOnly:[],lamps,
  scenarios:[{l:"Burnout: condenser fan dead, high pressure control and overload fail",f:["condFan","hpsFail","olFail"],v:{out:100}},
   {l:"Burnout in a vacuum: solenoid stuck closed, low pressure control and overload fail",f:["llsStuck","lpsFail","olFail"]},
   {l:"Liquid floodback: evaporator fans dead and TXV bulb loose",f:["efan","txvBulb"]},
   lt?{l:"Iced coil: defrost heaters burned out and a torn door gasket",f:["heater","door"]}:{l:"Iced coil: door propped open and the defrost timer stopped",f:["defTimer"],s:{doorOpen:true}}],
  startMsg(){return `${this.name} started. Box ${this.S.Tbox.toFixed(1)}°F, thermostat ${this.V.set}°F, outdoors ${this.V.out}°F.`},
  parts:{
   compressor:{n:"Compressor",s:"Pumps low-pressure vapor up to high-pressure hot gas.",
    w:`Walk-in condensing units use hermetic reciprocating or scroll compressors (semi-hermetics on bigger boxes). It sits outdoors or on the roof with the condenser and receiver.`,
    y:`It runs whenever the low and high pressure controls are closed. It does not take orders from the box thermostat directly: the thermostat opens the liquid line solenoid, suction pressure rises, and the low pressure control starts the compressor. ${lt?"A low temp compressor runs a high compression ratio, so its discharge runs hot.":""}`,
    f:`Running in a deep vacuum (no refrigerant coming back) leaves the motor with no suction gas to cool it, and it overheats. Liquid coming back (floodback, or migration during the off cycle) washes oil off the bearings. Keep the discharge line under about 225°F.`,
    src:["em_cycle","em_scroll","hvs","rsg"],faults:["comp","olFail","contactor"]},
   condenser:{n:"Condenser coil",s:"Rejects the box heat (plus motor heat) outdoors.",
    w:"Finned coil with a fan pulling outdoor air across it.",
    y:"Condensing temperature typically runs about 20°F above the outdoor air. The liquid drains from the bottom of the coil into the receiver.",
    f:"A dirty coil or dead fan sends head pressure, amps and discharge temperature up until the high pressure control opens.",
    src:["em_cycle","rsg"],faults:["dirtyCond"]},
   fan:{n:"Condenser fan",s:"Pulls outdoor air through the condenser.",w:"Motor and blade on the condensing unit, wired with the compressor contactor.",y:"Runs with the compressor. Some units add a fan-cycling control for cold weather.",f:"A dead fan sends head pressure up fast.",src:["rsg"],faults:["condFan"]},
   contactor:{n:"Contactor",s:"Switches the compressor and condenser fan.",w:"A relay with heavy contacts. Its coil is wired through the low and high pressure controls.",y:"On a pump-down system the pressure controls, not the thermostat, pull it in.",f:"Welded contacts keep the compressor running even after the low pressure control opens: it pulls a vacuum and overheats.",src:["beacon"],faults:["contactor"]},
   receiver:{n:"Liquid receiver",s:"Storage tank for liquid refrigerant.",
    w:"A tank after the condenser. Liquid drains in at the top; a dip tube feeds the liquid line from the bottom so only liquid leaves.",
    y:"It lets the system run with more or less refrigerant in the evaporator as the load changes, and it stores the charge when the system pumps down. Because the liquid in it is saturated, a receiver system shows little subcooling, so charge is judged by the sight glass and superheat instead.",
    f:"Too little charge and the receiver runs dry: vapor gets into the liquid line and bubbles show in the sight glass. Too much and liquid backs up into the condenser, raising head pressure.",
    src:["em_cycle","sgloc"],faults:["leak"]},
   drier:{n:"Filter drier",s:"Catches moisture, acid and dirt in the liquid line.",w:"A shell packed with desiccant, installed just after the receiver.",y:"Protects the solenoid valve and TXV, whose small ports clog easily.",f:"A plugged drier is a restriction: the outlet feels colder than the inlet (it may sweat or frost) and the sight glass after it shows bubbles even with a full charge.",src:["sgloc"],faults:["drier"]},
   sglass:{n:"Sight glass",s:"Window into the liquid line, with a moisture indicator.",w:"A glass port after the drier. The center dot changes color: green is dry, yellow means moisture.",y:"A clear glass full of liquid means the TXV is getting solid liquid. Bubbles mean flash gas: low charge, a restriction before the glass, or not enough head pressure.",f:"Don't charge to a clear glass alone. Bubbles right after a restriction are not a low charge. In cold weather, low charge shows up as bubbles when the head pressure valve is holding the head up.",src:["sgloc","rsg"],faults:["moist"]},
   lls:{n:"Liquid line solenoid",s:"Electric valve the box thermostat opens and closes.",
    w:"A normally closed valve with an electric coil. Power on the coil lifts the plunger and lets liquid through.",
    y:"Thermostat calls: the solenoid opens, liquid feeds the TXV, suction pressure rises and the low pressure control starts the compressor. Thermostat satisfied: the solenoid closes and the compressor pumps the refrigerant into the receiver until the low pressure control stops it. That is a pump-down system, and it keeps liquid out of the compressor during the off cycle.",
    f:"A burned-out coil leaves the valve shut: the box warms while the compressor sits pumped down. A valve that leaks through lets pressure creep up during the off cycle, so the compressor short cycles with the thermostat satisfied.",
    src:["dftxv","sgloc","kolpak"],faults:["llsStuck","llsLeak"]},
   txv:{n:"Thermostatic expansion valve",s:"Meters liquid into the coil to hold a steady superheat.",
    w:"Brass valve at the coil inlet. A bulb clamped to the suction line pushes it open; a spring and the coil pressure push it closed.",
    y:"It keeps the coil as full as possible while making sure the refrigerant all boils before it leaves. Typical setting: 8–10°F superheat at the evaporator.",
    f:"A lost bulb charge closes the valve and starves the coil (low suction, high superheat). A loose bulb reads warm and overfeeds, flooding liquid back. Moisture can freeze in its port on a low temperature system.",
    src:["dftxv","em_txv","rsg"],faults:["txvShut","txvBulb","moist"]},
   ucool:{n:"Evaporator (unit cooler)",s:"Coil and fans hung from the ceiling inside the box.",
    w:"A finned coil with fans that pull box air through it. A drain pan under it catches defrost water.",
    y:`The coil typically runs about 10°F below the box temperature. ${lt?"At -10°F box that is a coil near -20°F, so frost builds on every cycle and needs heater defrosts.":"At 35°F box the coil is around 25°F, below freezing, so it frosts while running and clears in the off cycle."}`,
    f:"Frost and ice block the air: suction pressure drops, the box warms, and the compressor runs longer. Heavy door traffic or a bad gasket adds moisture and frost.",
    src:["rsg","em_cycle"],faults:["efan","defTimer"]},
   efans:{n:"Evaporator fans",s:"Move box air through the coil.",w:"Small shaded-pole or ECM motors with guards.",y:lt?"In a freezer they stop during defrost and stay off after it until the coil is cold again (fan delay), so they don't blow heat and water into the box.":"In a cooler they usually run all the time, including during off-cycle defrost, which uses box air to melt the frost.",f:"Dead fans: the coil can't pick up heat, suction drops, the box warms and liquid can flood back to the compressor.",src:["achrfd","kolpak"],faults:["efan"]},
   ...(lt?{heaters:{n:"Defrost heaters",s:"Electric rods in the coil that melt the frost.",w:"Resistance heaters threaded through the coil fins, plus a heater in the drain pan.",y:"The timer switches power from the solenoid and fans to the heaters. They stay on until the termination thermostat sees about 55°F or the fail-safe time runs out.",f:"Burned-out heaters: frost builds every cycle until the coil is a block of ice. A heater safety (limit) opens if they overheat.",src:["kolpak","achrfd"],faults:["heater","term"]}}:{}),
   timer:{n:"Defrost timer",s:lt?"Starts each heater defrost.":"Starts each off-cycle defrost.",
    w:"A 24-hour clock with pins for each defrost (often 4 a day) and a fail-safe time.",
    y:lt?"At a pin it cuts power to the thermostat, solenoid and fans, so the system pumps down, then powers the heaters. The termination thermostat ends defrost at about 55°F; then a short drip time, then cooling with the fans held off until the coil is cold.":"At a pin it closes the solenoid for a set time (about 35 minutes) while the fans keep blowing box air over the coil to melt the frost.",
    f:"A timer that stops leaves the coil without defrosts: it ices up over a day or two.",src:["kolpak","rsg","achrfd"],faults:lt?["defTimer","term"]:["defTimer"]},
   dpc:{n:"Dual pressure control",s:"Low pressure side runs the pump-down; high side is the safety.",
    w:"Two pressure switches in one case, piped to the suction and discharge lines.",
    y:"Low side: opens around 3 psig (pump-down complete) and closes around 20 psig (solenoid open, load present). High side: opens around 450 psig and resets at 375.",
    f:"A low side stuck closed lets the compressor run in a vacuum. Cut-in set below the off-cycle pressure causes short cycling.",
    src:["rsg","acd"],faults:["lpsFail","hpsFail"]},
   cch:{n:"Crankcase heater",s:"Keeps refrigerant from soaking into the compressor oil while it's off.",w:"A band or insert heater on the compressor shell, powered whenever the compressor is off.",y:"Refrigerant is drawn to the oil, most of all when the condensing unit is cold. Keeping the oil warm stops it from collecting there.",f:"Failed heater plus a cold night: liquid collects in the crankcase and the oil foams or slugs at startup.",src:["rsg"],faults:["cch"]},
   tstat:{n:"Box thermostat",s:"Opens the liquid line solenoid when the box is warm.",w:"Mounted inside the box, out of the fan blast.",y:"On a pump-down system it switches the solenoid, not the compressor.",f:"",src:["kolpak"],faults:[]},
   door:{n:"Door and gasket",s:"Biggest source of heat and moisture.",w:"Insulated door with a magnetic gasket and, on freezers, a heater wire in the frame.",y:"Every opening brings in warm, wet air that ends up as frost on the coil.",f:"A torn gasket or a propped door: the box can't hold temperature and the coil frosts fast.",src:["rsg"],faults:["door"]},
   drain:{n:"Condensate drain",s:"Carries defrost water out of the box.",w:`Pipe from the drain pan out through the wall to a trap and floor drain.${lt?" In a freezer it carries heater tape so the water can't refreeze in it.":""}`,y:"Water from every defrost has to leave before it refreezes.",f:lt?"A failed drain heater lets the line freeze; water backs up into the pan and freezes into the bottom of the coil.":"A plugged drain overflows the pan.",src:["kolpak"],faults:lt?["drainH"]:[]},
   gauges:{n:"Gauges and line temperatures",s:"Pressures, saturation temperatures, superheat.",w:"Compound gauge on the suction service valve, high side on the receiver or liquid line.",y:`R-404A: ${lt?"a -10°F freezer runs about -20°F coil, near 16 psig":"a 35°F cooler runs about 25°F coil, near 62 psig"}. Head at 90°F outdoors about 110°F condensing, near 270 psig.`,f:"",src:["r404","rsg"],faults:[]},
   suction:{n:"Suction line",s:"Insulated vapor line back to the compressor.",w:"Larger insulated copper from the coil to the condensing unit. The TXV bulb clamps to it at the coil outlet.",y:"Carries the vapor the coil boiled off.",f:"Frost all the way back to the compressor, or a flooding coil, means liquid is coming back.",src:["em_cycle"],faults:[]},
   liquid:{n:"Liquid line",s:"Small line from the receiver to the TXV.",w:"Copper line carrying warm high-pressure liquid, with the drier, sight glass and solenoid on it.",y:"It must deliver solid liquid to the TXV.",f:"",src:["sgloc"],faults:[]},
   box:{n:lt?"Freezer box":"Cooler box",s:"Insulated panels around the product.",w:"Foam panels with a door. The building around it is at 75°F here.",y:"Heat leaks through the walls, comes in with the door and the product, and the fan motors add more.",f:"",src:["rsg"],faults:[]}},
  init(){const V=this.V,Tb=V.set+3;
   return {t:0,dead:null,Tbox:Tb,Tcoil:Tb,Ps:Math.min(psat4(Tb),12),Pd:psat4(V.out+3),frost:0,panIce:0,Tm:100,ol:false,hp:false,lp:true,lpT:0,calling:false,svc:true,doorOpen:false,meter:"txv",
    comp:false,contactor:false,fanOut:false,efanOn:true,llsOpen:false,llsCoil:false,heat:false,heatOn:false,def:0,defT:0,dripT:0,nextDef:3*3600,
    flood:0,mig:0,mfrac:0,Q:0,feed:1,sh:8,shRaw:8,sc:2,sst:SSTn,sct:110,Tdis:90,amps:0,ang:0,fang:0,off:0,aoff:0,runT:0,offT:0,starts:[],tfz:false,tfzT:0,bub:false,head:false,logs2:{}}},
  switches:[
   {l:S=>`Disconnect: ${S.svc?"on":"off"}`,on:S=>S.svc,act(sim){sim.S.svc=!sim.S.svc;log(sim,`Condensing unit disconnect ${sim.S.svc?"on":"pulled (off)"}.`)}},
   {l:S=>`Door: ${S.doorOpen?"propped open":"closed"}`,on:S=>S.doorOpen,act(sim){sim.S.doorOpen=!sim.S.doorOpen;log(sim,sim.S.doorOpen?"Door propped open. Warm, wet air is pouring in.":"Door closed.",sim.S.doorOpen?"w":"")}},
   {l:S=>S.def===1?"End defrost":"Start a defrost",on:S=>S.def===1,act(sim){const S=sim.S;if(S.def===1){S.defT=1e9;log(sim,"Defrost ended by hand.")}else if(S.def===0){sim.startDef("by hand")}}},
   {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
  actions:[],
  startDef(why){const S=this.S;S.def=1;S.defT=0;S.nextDef=86400/Math.max(1,this.V.dpd);log(this,lt?`Defrost started ${why}. Solenoid and fans off; the system pumps down, then the heaters come on.`:`Off-cycle defrost started ${why}. Solenoid closed; fans keep blowing box air over the coil.`)},
  resets(S){const r=[];if(S.frost>0.6&&S.def===0&&!S.dead)r.push(["Defrost the iced coil now",()=>this.startDef("by hand to clear ice")]);return r},
  stateTxt(S){return S.dead?"FAILED":S.def===1?(lt?"DEFROST (HEATERS)":"OFF-CYCLE DEFROST"):S.def===2?"DRIP TIME":S.comp?(S.llsOpen?(S.def===3?"COOLING, FAN DELAY":"COOLING"):"PUMPING DOWN"):S.calling&&S.lp?"WAITING ON LP CONTROL":"OFF, PUMPED DOWN"},
  reads(S){const run=S.comp;return [["Box",`${S.Tbox.toFixed(1)}°F`],["Coil",`${f0(S.Tcoil)}°F`],["Suction",fmtP(S.Ps)],["Head",`${f0(S.Pd)} psig`],["Superheat",run&&S.feed>0.02?`${f0(S.sh)}°F`:"—"],["State",this.stateTxt(S).toLowerCase()]]},
  targets(){const S=this.S,F=this.F,V=this.V,Tamb=V.out,ch=Math.max(0,V.charge/100);
   const condAir=(F.condFan||!S.fanOut)?0.12:(F.dirtyCond?0.55:1);
   let feed=ch>=0.8?1:clamp((ch-0.3)/0.5,0,1);
   if(F.drier)feed*=0.45;if(F.txvShut)feed*=0.12;if(S.tfz)feed*=0.1;
   feed*=S.llsOpen?1:(F.llsLeak?0.01:0);
   const af=(S.efanOn?1:0.12)*(1-0.8*S.frost);
   let sct=Tamb+20,sst=SSTn,Q=0;
   for(let it=0;it<3;it++){const Pd=psat4(sct);
    const qc=s=>{const Ps=psat4(s),r=(Pd+ATM)/Math.max(0.5,Ps+ATM);return Qn*(Ps+ATM)/(psat4(SSTn)+ATM)*clamp(1-0.04*(r-Rn),0.05,1.3)*(F.comp?0.55:1)};
    const qe=s=>Qn*Math.max(0,S.Tbox-s)/10*af*feed;
    let lo=-90,hi=S.Tbox-0.1;
    if(qc(lo)>=qe(lo)){sst=lo}else{for(let i=0;i<30;i++){const m=(lo+hi)/2;if(qc(m)>qe(m))hi=m;else lo=m}sst=(lo+hi)/2}
    Q=Math.min(qc(sst),qe(sst));
    sct=Tamb+Math.min(80,20*(Q/Qn+0.15)/1.15/condAir);
    sct+=40*Math.max(0,ch-1.2)-8*Math.max(0,0.8-ch)/0.5+(F.noncond?15:0)}
   const head=sct<85;if(head)sct=85;
   let sh=V.sh+40*(1-Math.min(1,feed/(S.llsOpen?1:0.01)))+(F.comp?4:0)-5*S.frost;
   if(F.txvBulb)sh=-3;if(!S.efanOn)sh-=7;
   const sc=ch<0.8?0:clamp(2+50*Math.max(0,ch-1.2),0,40);
   const bub=ch<0.8||F.drier||(head&&ch<0.95);
   return {sst,sct,Ps:psat4(sst),Pd:psat4(sct),Q,mfrac:Q/Qn,feed,shRaw:sh,sh:clamp(sh,0,90),sc,bub,head}},
  step(dt){const sim=this,S=this.S,F=this.F,V=this.V,Tamb=V.out;S.t+=dt;
   if(F.leak&&V.charge>0){const b=V.charge;V.charge=Math.max(0,V.charge-0.006*dt);if(Math.floor(b/10)!==Math.floor(V.charge/10))log(sim,`Refrigerant leaking: charge now ${Math.round(V.charge)}%.`,"w")}
   const dif=lt?1.5:1;
   if(!S.calling&&S.Tbox>V.set+dif){S.calling=true;log(sim,`Box at ${S.Tbox.toFixed(1)}°F. Thermostat calls; solenoid opens.`)}
   else if(S.calling&&S.Tbox<V.set-dif){S.calling=false;log(sim,"Thermostat satisfied. Solenoid closes and the compressor pumps down into the receiver.")}
   // defrost timer
   if(!F.defTimer&&V.dpd>0&&S.def===0){S.nextDef-=dt;if(S.nextDef<=0)sim.startDef("by the timer")}
   if(S.def===1){S.defT+=dt;
    if(lt&&!F.term&&S.Tcoil>=V.term){log(sim,`Coil reached ${f0(S.Tcoil)}°F. Termination thermostat ended defrost.`);S.def=2;S.dripT=120}
    else if(S.defT>=V.dfs*60){if(S.defT<1e8)log(sim,`Defrost ended on the ${V.dfs}-minute fail-safe${lt?" (termination thermostat never closed)":""}.`,lt?"w":"");S.def=lt?2:0;S.dripT=120}}
   if(S.def===2){S.dripT-=dt;if(S.dripT<=0){S.def=3;log(sim,"Drip time over. Cooling resumes; fans wait for the coil to get cold.")}}
   if(S.def===3&&S.Tcoil<=V.fd){S.def=0;log(sim,`Coil at ${f0(S.Tcoil)}°F. Fan delay closed; evaporator fans on.`)}
   const cooling=S.def===0||S.def===3;
   S.llsCoil=cooling&&S.calling;S.llsOpen=S.llsCoil&&!F.llsStuck;
   S.efanOn=!F.efan&&(lt?S.def===0:true);
   S.heat=lt&&S.def===1;S.heatOn=S.heat&&!F.heater;
   // pressure controls
   if(S.hp&&S.Pd<=V.hps-75){S.hp=false;log(sim,"High pressure control reset.")}
   if(S.lp&&S.Ps>=V.lpi){S.lp=false;if(!S.calling&&!S.logs2.sc)log(sim,`Low pressure control closed at ${f0(S.Ps)} psig with the thermostat satisfied.`,"w")}
   if(F.lpsFail)S.lp=false;
   if(S.ol&&S.Tm<=170){S.ol=false;log(sim,"Compressor overload reset (motor cooled).")}
   S.contactor=(!S.lp&&!S.hp)||F.contactor;
   const power=S.svc&&S.contactor;S.fanOut=power&&!F.condFan;
   const was=S.comp;S.comp=power&&!S.ol;
   if(S.comp&&!was){S.runT=0;S.starts=S.starts.filter(t=>S.t-t<900);S.starts.push(S.t);
    if(S.starts.length>=4&&!S.logs2.sc){S.logs2.sc=1;log(sim,"Short cycling: 4 compressor starts in 15 minutes.","b")}
    if(S.mig>0.3){S.flood+=S.mig*900;log(sim,"Liquid migrated into the crankcase during the off cycle. The oil foams and liquid slugs at startup.","b")}
    S.mig=0;log(sim,S.llsOpen?"Low pressure control closed. Compressor started.":"Compressor started with the solenoid closed.")}
   if(!S.comp&&was){S.offT=0;log(sim,S.ol?"Compressor stopped on overload.":S.hp?"Compressor stopped on high pressure.":S.calling&&S.llsOpen?`Low pressure control opened at ${fmtP(S.Ps)} while the box still calls. Something is starving the coil.`:`Pumped down. Low pressure control opened at ${fmtP(S.Ps)}; compressor off.`,S.calling&&S.llsOpen||S.hp||S.ol?"b":"")}
   if(S.starts.length&&S.t-S.starts[S.starts.length-1]>1800)S.logs2.sc=0;
   const T=this.targets();S.feed=T.feed;S.bub=T.bub;S.head=T.head;
   if(S.comp){S.runT+=dt;
    S.Ps+=(T.Ps-S.Ps)*Math.min(1,dt/15);S.Pd+=(T.Pd-S.Pd)*Math.min(1,dt/((F.condFan||!S.fanOut)?60:25));
    S.sh+=(T.sh-S.sh)*Math.min(1,dt/30);S.sc+=(T.sc-S.sc)*Math.min(1,dt/30);S.shRaw=T.shRaw;S.mfrac=T.mfrac*clamp(S.runT/15,0,1);S.Q=T.Q;
   }else{S.offT+=dt;
    const pc=psat4(S.Tcoil);
    const tgt=S.llsOpen?pc:F.llsLeak?pc:Math.min(pc,12),tau=S.llsOpen?20:F.llsLeak?240:300;
    S.Ps+=(tgt-S.Ps)*Math.min(1,dt/tau);S.Pd+=(psat4(Tamb+3)-S.Pd)*Math.min(1,dt/180);S.mfrac=0;S.Q=0;S.shRaw=10;}
   S.sst=tsat4(S.Ps);S.sct=tsat4(S.Pd);
   // coil temperature, frost
   if(S.comp&&S.feed>0.01)S.Tcoil+=(S.sst+1-S.Tcoil)*Math.min(1,dt/40);
   else if(S.heatOn){if(S.frost>0.005&&S.Tcoil>=31.5){S.Tcoil=Math.max(S.Tcoil,32);const m=Math.min(S.frost,dt/900);S.frost-=m;if(lt&&F.drainH)S.panIce=Math.min(1,S.panIce+m*0.6)}
     else S.Tcoil=Math.min(S.Tcoil+dt*(S.Tcoil<32?0.15:0.12),F.term?95:140)}
   else S.Tcoil+=((S.efanOn?S.Tbox:(S.Tcoil*0.3+S.Tbox*0.7))-S.Tcoil)*Math.min(1,dt/(S.efanOn?90:600));
   if(S.Tcoil<32){const moist=(S.doorOpen?10:1)+(F.door?4:0);S.frost=Math.min(1,S.frost+dt*moist*clamp((34-S.Tcoil)/15,0,1)/50000*(S.comp?1:0.2))}
   else if(!S.heatOn&&S.frost>0)S.frost=Math.max(0,S.frost-dt*(S.Tcoil-32)/12000);
   if(lt&&S.panIce>0.5)S.frost=Math.max(S.frost,S.panIce*0.7);
   if(S.frost>0.3&&!S.logs2.f1){S.logs2.f1=1;log(sim,"Frost building on the evaporator coil.","w")}
   if(S.frost>0.65&&!S.logs2.f2){S.logs2.f2=1;log(sim,"Coil is iced over. Airflow is blocked and the box is warming.","b")}
   if(S.frost<0.1){S.logs2.f1=0;S.logs2.f2=0}
   if(lt&&S.panIce>0.2&&!S.logs2.pi){S.logs2.pi=1;log(sim,"Drain line frozen. Defrost water is freezing in the drain pan.","w")}
   // moisture freezing in the TXV port
   if(F.moist&&S.comp&&S.sst<32){S.tfzT+=dt;if(!S.tfz&&S.tfzT>1200){S.tfz=true;log(sim,"Moisture froze in the TXV port. The coil is starving.","w")}}
   if(!S.comp&&S.offT>180){S.tfz=false;S.tfzT=0}
   // box
   const gain=UA*(75-S.Tbox)+(S.doorOpen?60*(75-S.Tbox):0)+(F.door?15*(75-S.Tbox):0)+(S.efanOn?400:0)+(S.heatOn?2500:0)+(S.Tcoil>S.Tbox&&S.efanOn?300*(S.Tcoil-S.Tbox)/20:0);
   S.Tbox+=(gain-S.Q)/3600/Cbox*dt;
   // refrigerant migration while off
   if(!S.comp){const cold=Tamb<S.Tbox+10;S.mig=Math.min(1,S.mig+dt/3600*((F.cch?1:0)*(cold?1.5:0.15)+(F.llsLeak?0.2:0)*(F.cch?1:0.3)))}
   // discharge, amps, motor
   const ratio=(S.Pd+ATM)/Math.max(0.5,S.Ps+ATM);
   if(S.comp){const tdT=S.sst+S.sh+94*Math.log(Math.max(1.05,ratio))+45*Math.max(0,0.6-S.mfrac);S.Tdis+=(tdT-S.Tdis)*Math.min(1,dt/60);
    S.amps=RLAw*(0.55+0.45*(S.Pd-S.Ps)/(Pdes-psat4(SSTn)))*(0.6+0.4*Math.min(1.2,S.mfrac/Math.max(0.05,clamp(S.runT/15,0.05,1))))}
   else{S.Tdis+=(Tamb-S.Tdis)*Math.min(1,dt/600);S.amps=0}
   S.cchOn=!S.comp&&S.svc&&!F.cch;
   if(S.comp){const tmT=Math.min(360,S.Tdis+50*(S.amps/RLAw-1)+220*Math.max(0,0.45-S.mfrac)+40*Math.max(0,(S.Pd-Pdes)/150));S.Tm+=(tmT-S.Tm)*Math.min(1,dt/240)}
   else S.Tm+=(Tamb-S.Tm)*Math.min(1,dt/900);
   if(!S.ol&&!F.olFail&&S.Tm>=250){S.ol=true;log(sim,S.mfrac<0.1?"Compressor overheated running in a vacuum. Internal overload opened.":"Compressor motor overheated. Internal overload opened.","b")}
   if(S.Tm>=300){explode(sim,"burn");return}
   if(S.comp&&S.Tdis>225&&!S.logs2.hot){S.logs2.hot=1;log(sim,`Discharge line ${f0(S.Tdis)}°F, over 225°F. The oil is breaking down.`,"b")}if(S.Tdis<215)S.logs2.hot=0;
   if(S.comp&&S.Ps<-2&&!S.logs2.vac){S.logs2.vac=1;log(sim,`Compressor running in a vacuum (${fmtP(S.Ps)}). No suction gas to cool the motor.`,"b")}if(S.Ps>0)S.logs2.vac=0;
   if(S.comp&&!S.hp&&!F.hpsFail&&S.Pd>=V.hps){S.hp=true;log(sim,`High pressure control opened at ${f0(S.Pd)} psig.`,"b")}
   if(S.comp&&!F.lpsFail&&S.Ps<=V.lpo){S.lpT+=dt;if(!S.lp&&S.lpT>=2)S.lp=true}else S.lpT=0;
   if(S.comp&&S.shRaw<0.5&&S.feed>0.05){S.flood+=dt*Math.max(0,1-S.shRaw)/20;if(!S.logs2.wet){S.logs2.wet=1;log(sim,"Zero superheat: liquid refrigerant is reaching the compressor.","b")}}
   else{S.flood=Math.max(0,S.flood-dt*0.5);if(S.shRaw>3)S.logs2.wet=0}
   if(S.flood>1800){explode(sim,"slug");return}
  },
  draw(dt){const S=this.S,F=this.F,V=this.V;
   const run=S.comp,fed=run&&S.feed>0.02,flow=fed?clamp(S.mfrac,0.15,1.3):0;
   S.off-=dt*flow*40;
   ["fSuc","fLiq","fDis"].forEach(id=>{const e=$(p+id);if(e){e.style.strokeDashoffset=S.off;e.style.opacity=fed?1:0}});
   ["pSuc","pLiq","pDis","pMix"].forEach(id=>{const e=$(p+id);if(e)e.style.opacity=run||S.llsOpen?1:0.45});
   at(p+"pSuc","stroke",fed&&S.shRaw<0.5?"var(--r-mix)":"var(--r-suc)");
   at(p+"pLiq","stroke",fed&&S.bub?"#c9a07a":"var(--r-liq)");
   at(p+"wet","opacity",fed&&S.shRaw<0.5?(blink(400)?1:.3):0);
   const shF=fed?clamp(S.sh/40,0.04,0.75):0.1;at(p+"eS1","offset",(1-shF-0.06).toFixed(3));at(p+"eS2","offset",(1-shF).toFixed(3));
   const scF=run?clamp(0.06+S.sc/40,0.04,0.6):0.1;at(p+"cS2","offset",(1-scF).toFixed(3));
   at(p+"ice","opacity",clamp(S.frost*1.3,0,1).toFixed(2));at(p+"iceTxt","opacity",S.frost>0.6?1:0);
   at(p+"panIce","opacity",clamp(S.panIce*1.5,0,1).toFixed(2));at(p+"dIce","opacity",lt&&F.drainH&&S.panIce>0.05?1:0);
   at(p+"drip","opacity",S.Tcoil>32&&S.frost>0.01&&!(lt&&F.drainH)?(blink(500)?1:0):0);
   if(lt){at(p+"htr","stroke",S.heatOn?(blink(600)?"#ff5a1f":"#e0662a"):S.heat?"var(--bad)":"var(--lamp-off)");at(p+"dHtr","stroke",F.drainH?"var(--lamp-off)":S.svc?"#e0662a":"var(--lamp-off)")}
   const slT=fed?S.sst+S.sh+(lt?15:8):S.Tbox*0.5+75*0.5,llT=run?S.sct-S.sc-2:V.out;
   at(p+"frost","opacity",fed&&slT<32?0.9:0);
   // air
   S.aoff-=dt*30;
   ["aSup","aRet","aOut","aIn","aDoor"].forEach(id=>{const e=$(p+id);if(e)e.style.strokeDashoffset=S.aoff});
   const supT=S.efanOn?S.Tbox-(S.Q>0?S.Q/Qn*8:0)+(S.Tcoil>S.Tbox?(S.Tcoil-S.Tbox)*0.5:0):S.Tbox;
   at(p+"aSup","stroke",bcol(supT));at(p+"aSupH","stroke",bcol(supT));at(p+"aRet","stroke",bcol(S.Tbox));at(p+"aRetH","stroke",bcol(S.Tbox));
   at(p+"aSupG","opacity",S.efanOn?Math.max(0.25,1-S.frost):0);at(p+"aRetG","opacity",S.efanOn?Math.max(0.25,1-S.frost):0);
   const outT=V.out+(run?clamp((S.sct-V.out)*0.5,0,40):0);
   at(p+"aOut","stroke",acol(outT));at(p+"aOutH","stroke",acol(outT));at(p+"aIn","stroke",acol(V.out));
   at(p+"aOutG","opacity",S.fanOut?(F.dirtyCond?0.5:1):0);at(p+"aInG","opacity",S.fanOut?(F.dirtyCond?0.4:1):0);
   at(p+"doorC","opacity",S.doorOpen?0:1);at(p+"doorO","opacity",S.doorOpen?1:0);at(p+"aDoorG","opacity",S.doorOpen?1:F.door?0.4:0);at(p+"gasket","opacity",F.door?(blink(700)?1:.4):0);
   // spinning parts
   if(S.efanOn)S.ang=(S.ang+dt*700)%360;at(p+"eb0","transform",`rotate(${S.ang} 222 87)`);at(p+"eb1","transform",`rotate(${S.ang} 268 87)`);
   if(S.fanOut)S.fang+=dt*14;at(p+"fb1","rx",(S.fanOut?Math.abs(Math.cos(S.fang))*40+4:40).toFixed(1));
   at(p+"cDirt","opacity",F.dirtyCond?0.55:0);at(p+"drierFrost","opacity",fed&&F.drier?0.8:0);
   // sight glass and receiver
   at(p+"bub","opacity",fed&&S.bub?(blink(250)?1:.4):0);at(p+"sgDot","fill",F.moist?"#e8c33a":"#3fa34d");
   const lvl=clamp(0.5*V.charge/100+(!run&&!S.llsOpen?0.2:0)-0.1+(S.head?0.1:0),0,0.95);at(p+"rcvLvl","y",(434-24*lvl).toFixed(1));at(p+"rcvLvl","height",(24*lvl+2).toFixed(1));
   // controls
   at(p+"llsLamp","fill",S.llsCoil?(F.llsStuck?"var(--bad)":"var(--ok)"):"var(--lamp-off)");
   at(p+"lpLamp","fill",S.lp?"#e8c33a":"var(--ok)");at(p+"hpLamp","fill",S.hp?"var(--bad)":"var(--ok)");
   at(p+"contLamp","fill",S.contactor&&S.svc?"var(--ok)":"var(--lamp-off)");at(p+"contBar","y",S.contactor?212:218);
   at(p+"defLamp","fill",S.def===1?"#e8c33a":"var(--lamp-off)");
   const ha=((S.t%86400)/86400)*2*Math.PI;at(p+"tHand","x2",(527+13*Math.sin(ha)).toFixed(1));at(p+"tHand","y2",(228-13*Math.cos(ha)).toFixed(1));
   at(p+"cchB","fill",S.cchOn?"#e0662a":"var(--lamp-off)");
   at(p+"tstatLamp","fill",S.calling?"var(--cold)":"var(--lamp-off)");
   txt(p+"compSt",S.dead?"FAILED":run?"RUNNING":S.ol?"OVERLOAD":"OFF");txt(p+"amps",`${S.amps.toFixed(1)} A`);
   const nd=(id,cx,v,min,max)=>{const a=(-135+(clamp(v,min,max)-min)/(max-min)*270)*Math.PI/180;at(id,"x2",cx+30*Math.sin(a));at(id,"y2",74-30*Math.cos(a))};
   nd(p+"nLo",485,S.Ps,-15,150);nd(p+"nHi",595,S.Pd,0,500);
   txt(p+"gLoP",fmtP(S.Ps));txt(p+"gLoT",`${f0(S.sst)}°F sat`);txt(p+"gHiP",`${f0(S.Pd)} psig`);txt(p+"gHiT",`${f0(S.sct)}°F sat`);
   txt(p+"slTxt",`Suction ${f0(slT)}°F`);txt(p+"llTxt",`Liquid ${f0(llT)}°F`);
   txt(p+"dTxt",`Discharge ${f0(S.Tdis)}°F`);at(p+"dTxt","fill",S.Tdis>225?"var(--bad)":"var(--ink)");
   txt(p+"target","Target SH 8–10°F");txt(p+"target2",S.head?"head pressure valve holding":"at the coil outlet");
   txt(p+"boxTxt",`${S.Tbox.toFixed(1)}°F`);txt(p+"tstatTxt",String(V.set));txt(p+"outTxt",`${V.out}°F`);
   txt(p+"coilTxt",`Coil ${f0(S.Tcoil)}°F`);txt(p+"stTxt",this.stateTxt(S));
   at(p+"labels","opacity",S.labels===false?0:1);
  },
  boom(kind){const F=this.F,V=this.V;
   if(kind==="burn")return{t:"Compressor burnout",b:`<p>The motor windings overheated until the insulation failed. Replace the compressor, install a burnout drier, and evacuate properly.</p><ul>
     ${F.condFan||F.dirtyCond?li(1,"Condenser airflow lost, so head pressure and motor heat climbed."):""}
     ${F.llsStuck||F.contactor?li(1,F.llsStuck?"Solenoid stuck closed: no refrigerant reached the compressor to cool it.":"Contactor welded: the compressor kept running after the low pressure control opened."):""}
     ${V.charge<60?li(1,`Charge low (${Math.round(V.charge)}%).`):""}
     ${li(F.hpsFail,"High pressure control failed closed.","High pressure control.")}
     ${li(F.lpsFail,"Low pressure control failed closed, so the compressor ran in a vacuum.","Low pressure control.")}
     ${li(F.olFail,"Internal overload never opened.","Overload.")}</ul>
     <p>On a pump-down system the low pressure control is the off switch. If it can't open, nothing stops the compressor from pulling a vacuum.</p>
     <small>Simplified: the sim burns out the motor at 300°F winding temperature, much faster than real life.</small>`,wreck:1};
   return{t:"Compressor damaged by liquid floodback",b:`<p>Liquid refrigerant reached the compressor, washed out the oil, and the valves or bearings failed.</p><ul>
     ${F.efan?li(1,"Evaporator fans dead: the coil couldn't boil off the refrigerant."):""}
     ${F.txvBulb?li(1,"TXV bulb loose, so the valve overfed."):""}
     ${F.cch?li(1,"Crankcase heater failed: liquid collected in the oil during off cycles."):""}
     <li class="f"><b>Missed</b>Zero superheat at the coil outlet. A superheat check would have caught it.</li></ul>
     <small>Simplified: the sim fails the compressor after sustained heavy floodback.</small>`,wreck:1};
  }};
 sim.lampOn=S=>({call:S.calling,lls:S.llsOpen,comp:S.comp,fan:S.fanOut,efan:S.efanOn,def:S.def===1,heat:S.heatOn,lp:S.lp,hp:S.hp,ol:S.ol,cch:S.cchOn});
 return sim}
const COOLER=mkWalk(false),FREEZER=mkWalk(true);
