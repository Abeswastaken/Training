/* ---- split AC / heat pump drawing (realistic) ---- */
function acSvg(p,hp){
 const vap=hp?"M240 200 V172 H380 V366 H460 V222 H570 V250":"M240 200 V172 H380 V366 H560";
 const dis=hp?"M630 250 V215 H730":"M600 300 V215 H730";
 const cb=hp?{x:644,y:310,w:76,h:98}:{x:462,y:198,w:86,h:88};
 const ct=hp?{x:648,y:318,w:34,h:40,bar:328,tx:665,ty:368,t:"CONT."}:{x:468,y:206,w:36,h:44,bar:218,tx:486,ty:262,t:"CONTACTOR"};
 const cp=hp?{x:690,y:318,w:24,h:40,tx:702,ty:368}:{x:514,y:206,w:26,h:46,tx:527,ty:276};
 const hps=hp?{x:612,y:280,w:22,h:18,tx:638,ty:293,a:"start"}:{x:652,y:188,w:24,h:20,tx:664,ty:234,a:"middle"};
 const lps=hp?{x:532,y:338,w:22,h:18,tx:543,ty:334}:{x:500,y:338,w:24,h:20,tx:512,ty:332};
 const coilRows=Array.from({length:22},(_,i)=>`<rect x="729" y="${206+i*9.6}" width="30" height="4.6" rx="2" fill="url(#${p}gCond)"/>`).join("");
 return `
<defs>
 <linearGradient id="${p}gEvap" gradientUnits="userSpaceOnUse" x1="0" y1="318" x2="0" y2="200"><stop id="${p}e0" offset="0" stop-color="var(--r-mix)"/><stop id="${p}eS1" offset=".8" stop-color="var(--r-mix)"/><stop id="${p}eS2" offset=".9" stop-color="var(--r-suc)"/><stop id="${p}e3" offset="1" stop-color="var(--r-suc)"/></linearGradient>
 <linearGradient id="${p}gCond" gradientUnits="userSpaceOnUse" x1="0" y1="205" x2="0" y2="420"><stop id="${p}c0" offset="0" stop-color="var(--r-dis)"/><stop id="${p}cS1" offset=".12" stop-color="#e0662a"/><stop id="${p}cS2" offset=".85" stop-color="var(--r-liq)"/><stop id="${p}c3" offset="1" stop-color="var(--r-liq)"/></linearGradient>
</defs>
<line x1="10" y1="452" x2="790" y2="452" stroke="var(--line)" stroke-dasharray="2 4"/>
<rect x="400" y="16" width="10" height="436" fill="url(#zBrick)" stroke="#8a7d66" stroke-width=".8"/>
<!-- outdoor unit cabinet (behind the piping) -->
${zShade(610,442,170,4)}
<path d="M770 170 L782 162 V432 L770 440 Z" fill="url(#r_paintS)"/><path d="M450 170 L462 162 H782 L770 170 Z" fill="url(#r_paintT)"/><rect x="450" y="170" width="320" height="270" rx="4" fill="url(#r_paintF)" filter="url(#rGrain)" stroke="#3a444c" stroke-width="1"/>
<rect x="456" y="178" width="308" height="256" rx="2" fill="url(#zCabIn)" stroke="#9aa3a9"/>
${[[455,175],[765,175],[455,435],[765,435]].map(([x,y])=>zScrew(x,y,2.2)).join("")}
${hp?"":`<text class="zl" x="462" y="300">Outdoor unit</text>`}
<text class="lbl" x="22" y="34">Indoors</text><text class="val" id="${p}roomTxt" x="22" y="52">75.0°F</text>
<text class="lbl" x="414" y="150">Outdoors</text><text class="val" id="${p}outTxt" x="414" y="166">95°F</text>
<g class="part" data-p="room" tabindex="0"><rect class="hl" x="16" y="18" width="380" height="430" fill="none" stroke="none"/></g>

<g class="part" data-p="tstat" tabindex="0">${zTstat(30,72,46,50,p+"tstatTxt",p+"tstatLamp")}<text class="lblS" x="53" y="138" text-anchor="middle">Thermostat</text></g>

<!-- air handler cabinet (cut away) -->
${rSh(250,434,110,6)}<path d="M330 150 L342 142 V422 L330 430 Z" fill="url(#r_cabS)"/><path d="M150 150 L162 142 H196 V150 Z M284 150 V142 H342 L330 150 Z" fill="url(#r_cabT)"/><path d="M284 96 L296 88 V142 L284 150 Z" fill="url(#r_cabS)"/><path d="M196 96 L208 88 H296 L284 96 Z" fill="url(#r_cabT)"/><g filter="url(#zShadow)"><rect x="150" y="150" width="180" height="280" rx="3" fill="url(#r_cabF)" stroke="#6f787e" stroke-width="1"/>
<rect x="196" y="96" width="88" height="56" fill="url(#r_cabF)" stroke="#6f787e" stroke-width="1"/></g>
<rect x="157" y="157" width="166" height="266" fill="url(#zCabIn)" stroke="#9aa3a9"/>
<rect x="202" y="100" width="76" height="52" fill="url(#zCabIn)"/>
${[156,324].map(x=>[160,420].map(y=>zScrew(x-2,y,2.2)).join("")).join("")}
<rect x="66" y="350" width="68" height="62" fill="url(#zSteelH)" stroke="#6f787e" opacity=".75"/>
<text class="lblS" x="290" y="112">Supply air</text><text class="val" id="${p}supTxt" x="290" y="128" font-size="12">55°F</text>
<g id="${p}aSupG"><path id="${p}aSup" class="air" d="M214 146 V84 M240 146 V78 M266 146 V84"/>
 <path d="M208 88 l6 -10 6 10 M234 82 l6 -10 6 10 M260 88 l6 -10 6 10" fill="none" stroke-width="2.5" id="${p}aSupH"/></g>
<g id="${p}aRetG"><path id="${p}aRet" class="air" d="M74 368 H124 M74 398 H124"/>
 <path d="M118 362 l10 6 -10 6 M118 392 l10 6 -10 6" fill="none" stroke-width="2.5" id="${p}aRetH"/></g>
<text class="lblS" x="74" y="424">Return air</text><text class="val" id="${p}retTxt" x="74" y="438" font-size="12">75°F</text>

<g class="part" data-p="filter" tabindex="0">${zFilter(130,346,18,74,p+"dirt")}</g>
<g class="part" data-p="blower" tabindex="0">${zBlower(240,386,28,p+"blades")}<text class="zl" x="284" y="420">Blower</text></g>

<!-- evaporator A-coil -->
<g class="part" data-p="evap" tabindex="0">
 <rect class="hl" x="168" y="186" width="144" height="146" fill="transparent" stroke="none" rx="4"/>
 <path d="M180 318 L240 202 L300 318" stroke="#5f686d" stroke-width="25" fill="none" stroke-linejoin="round"/>
 <path d="M180 318 L240 202 L300 318" stroke="url(#zFins)" stroke-width="22" fill="none" stroke-linejoin="round"/>
 <path id="${p}evapRef" d="M180 318 L240 202 L300 318" stroke="url(#${p}gEvap)" stroke-width="12" fill="none" stroke-linejoin="round" stroke-dasharray="5 3.4"/>
 <path d="M183 318 L240 208 L297 318" stroke="rgba(255,255,255,.35)" stroke-width="1.2" fill="none"/>
 <g id="${p}ice" opacity="0"><path d="M180 318 L240 202 L300 318" stroke="#8fc3e6" stroke-width="32" fill="none" stroke-linejoin="round"/><path d="M180 318 L240 202 L300 318" stroke="#f2faff" stroke-width="27" fill="none" stroke-linejoin="round"/><path d="M180 318 L240 202 L300 318" stroke="#cfe8f7" stroke-width="10" fill="none" stroke-dasharray="3 5" stroke-linejoin="round"/></g>
 <text id="${p}iceTxt" x="240" y="270" text-anchor="middle" font-family="var(--display)" font-weight="700" font-size="16" fill="#2f6fd6" opacity="0">FROZEN COIL</text>
 <rect x="168" y="321" width="144" height="8" rx="1.5" fill="url(#zSteelH)" stroke="#6f787e" stroke-width=".8"/>
 <text class="zl" x="240" y="300" text-anchor="middle"${hp?` id="${p}inName"`:""}>${hp?"Indoor coil":"Evaporator"}</text>
</g>

<!-- vapor / suction line -->
<g class="part" data-p="suction" tabindex="0">
 <path class="ins" d="${vap}" stroke-width="15"/>
 <path id="${p}pSuc" class="rpipe" d="${vap}" stroke="var(--r-suc)" stroke-width="8"/>
 <path id="${p}fSuc" class="rflow" d="${vap}"/>
 <path id="${p}${hp?"sfrost":"frost"}" d="${vap}" fill="none" stroke="var(--ice)" stroke-width="15" stroke-dasharray="2 3" opacity="0"/>
</g>
<!-- liquid line -->
<g class="part" data-p="liquid" tabindex="0">
 <path id="${p}pLiq" class="rpipe" d="M746 420 V444 H60 V336 H160" stroke="var(--r-liq)" stroke-width="5"/>
 <path id="${p}fLiq" class="rflow" d="M746 420 V444 H60 V336 H160"/>
 <g id="${p}flash" opacity="0" fill="none" stroke="var(--paper)" stroke-width="1.2"><circle cx="300" cy="444" r="2"/><circle cx="330" cy="444" r="1.6"/><circle cx="360" cy="444" r="2"/><circle cx="60" cy="400" r="2"/><circle cx="60" cy="370" r="1.6"/><circle cx="100" cy="336" r="2"/></g>
</g>
<path id="${p}pMix" class="rpipe" d="M184 336 H300 M190 336 V321 M296 336 V321" stroke="var(--r-mix)" stroke-width="5"/>

<!-- metering device -->
<g class="part" data-p="meter" tabindex="0">
 <rect class="hl" x="154" y="314" width="34" height="34" fill="transparent" stroke="none"/>
 <g id="${p}pistonG">${zHex(163,336,7)}<rect x="166" y="331" width="14" height="10" fill="url(#zBrassH)" stroke="#5e400e" stroke-width=".6"/>${zHex(183,336,7)}<text class="zt" x="172" y="362" text-anchor="middle">PISTON</text></g>
 <g id="${p}txvG"><rect x="160" y="328" width="24" height="16" rx="2.5" fill="url(#zBrass)" stroke="#5e400e" stroke-width=".8"/>
  <path d="M162 328 V320 Q172 310 182 320 V328 Z" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".8"/><rect x="162" y="326" width="20" height="3" fill="url(#zBrassH)"/>
  <path d="M172 312 C172 250 300 250 300 180" fill="none" stroke="#9aa3aa" stroke-width="1.6"/>
  <rect x="290" y="173" width="20" height="9" rx="4" fill="url(#zCuH)" stroke="#5a2a12" stroke-width=".8"/><rect x="294" y="171" width="2.5" height="13" fill="#3a3f44"/><rect x="304" y="171" width="2.5" height="13" fill="#3a3f44"/>
  <text class="zt" x="172" y="362" text-anchor="middle">TXV</text><text class="zt" x="314" y="182">BULB</text></g>
</g>

<!-- outdoor unit -->

<g class="part" data-p="disconnect" tabindex="0">${zDisc(411,196,22,40,p+"discH")}<text class="tag" x="422" y="252" text-anchor="middle" fill="var(--muted)">DISC.</text></g>

<!-- control box -->
<rect x="${cb.x}" y="${cb.y}" width="${cb.w}" height="${cb.h}" rx="2" fill="url(#zSteelH)" stroke="#6f787e" opacity=".95"/>
${zScrew(cb.x+4,cb.y+4,2)}${zScrew(cb.x+cb.w-4,cb.y+4,2)}
<g class="part" data-p="contactor" tabindex="0">${zContactor(ct.x,ct.y,ct.w,ct.h,p+"contBar",p+"contLamp",ct.bar)}<text class="zt" x="${ct.tx}" y="${ct.ty}" text-anchor="middle">${ct.t}</text></g>
<g class="part" data-p="cap" tabindex="0">${zCap(cp.x,cp.y,cp.w,cp.h,p+"capBulge")}<text class="zt" x="${cp.tx}" y="${cp.ty}" text-anchor="middle">CAP</text></g>

<!-- discharge line (cooling: to the condenser; heat pump: C port to the outdoor coil) -->
<path id="${p}pDis" class="rpipe" d="${dis}" stroke="var(--r-dis)" stroke-width="7"/>
<path id="${p}fDis" class="rflow" d="${dis}"/>
<text class="valD" fill="#1d2327" id="${p}dTxt" x="${hp?650:608}" y="${hp?307:250}">Discharge 160°F</text>

<g class="part" data-p="hps" tabindex="0">${zPswitch(hps.x,hps.y,p+"hpsLamp",hps.w,hps.h)}<text class="zt" x="${hps.tx}" y="${hps.ty}" text-anchor="${hps.a}">HPS</text></g>

<!-- condenser / outdoor coil -->
<g class="part" data-p="condenser" tabindex="0">
 <rect class="hl" x="724" y="200" width="40" height="224" rx="2" fill="#5f686d" stroke="#3b4247"/>
 ${rFins(726,202,36,220,2.2)}
 ${coilRows}
 <path d="M726 204 V420" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
 <rect id="${p}cDirt" x="724" y="200" width="40" height="224" fill="#6b5a3a" opacity="0"/>
 <text class="zl" x="716" y="430" text-anchor="end">${hp?"Outdoor coil":"Condenser coil"}</text>
</g>
<g id="${p}aInG"><path id="${p}aIn" class="air" d="M796 270 H772 M796 330 H772 M796 390 H772"/></g>

<g class="part" data-p="fan" tabindex="0">${zFanTop(640,160,120,14,p+"fb1",700,167,p+"fanB")}<text class="lblS" x="700" y="154" text-anchor="middle" id="${p}fanLbl">${hp?"Outdoor fan":"Condenser fan"}</text></g>
<g id="${p}aOutG"><path id="${p}aOut" class="air" d="M672 146 V96 M700 146 V90 M728 146 V96"/>
 <path id="${p}aOutH" d="M666 100 l6 -10 6 10 M694 94 l6 -10 6 10 M722 100 l6 -10 6 10" fill="none" stroke-width="2.5"/></g>

<!-- compressor -->
<g class="part" data-p="compressor" tabindex="0" id="${p}compG">
 ${zCompressor(560,300,80,112,{term:1})}
 <rect class="hl" x="566" y="328" width="68" height="76" rx="4" fill="rgba(14,17,19,.78)" stroke="#5f686d" stroke-width=".8"/>
 <text x="600" y="342" text-anchor="middle" font-family="var(--display)" font-size="11" font-weight="600" fill="#e9ecee">COMPRESSOR</text>
 <text id="${p}compSt" x="600" y="362" text-anchor="middle" font-family="var(--mono)" font-size="12" fill="#e9ecee">OFF</text>
 <text id="${p}amps" x="600" y="380" text-anchor="middle" font-family="var(--mono)" font-size="11" fill="#c4cacf">0.0 A</text>
 <text id="${p}wet" x="600" y="398" text-anchor="middle" font-family="var(--display)" font-size="9" font-weight="700" fill="#6fb3e8" opacity="0">LIQUID FLOODBACK</text>
</g>
<g id="${p}burn" opacity="0"><g fill="#555" opacity=".85"><circle cx="600" cy="292" r="18"/><circle cx="586" cy="270" r="14"/><circle cx="612" cy="252" r="16"/><circle cx="596" cy="230" r="12"/></g><path d="M572 330 l14 20 -8 10 16 18" stroke="var(--bad)" stroke-width="3" fill="none"/></g>

<g class="part" data-p="lps" tabindex="0">${zPswitch(lps.x,lps.y,p+"lpsLamp",lps.w,lps.h)}<text class="zt" x="${lps.tx}" y="${lps.ty}" text-anchor="middle">LPS</text></g>
<text class="valD" fill="#1d2327" id="${p}slTxt" x="466" y="${hp?412:388}" font-size="11">Suction line 46°F</text>

<g class="part" data-p="drier" tabindex="0">${zDrier(412,436,34,16,p+"drierFrost",hp?0:-1)}<text class="tag" x="429" y="466" text-anchor="middle" fill="var(--muted)">${hp?"BI-FLOW DRIER":"DRIER"}</text></g>
<text class="valD" fill="#1d2327" id="${p}llTxt" x="466" y="432" font-size="11">Liquid line 106°F</text>

<!-- gauges -->
<g class="part" data-p="gauges" tabindex="0">
 ${hoseSvg(p,hp?[528,332]:[452,364],[452,442],hp?"M500 140 C512 200 480 300 528 330":"M500 140 C490 175 446 165 446 205 V356 Q446 364 452 364","M580 140 C580 195 438 160 438 205 V418 Q438 428 448 428 Q452 428 452 436 V442")}
 <g id="${p}man" class="man" style="cursor:grab;touch-action:none">
 <rect class="hl" x="506" y="120" width="68" height="20" rx="4" fill="url(#zAlu)" stroke="#5f686d"/>
 <rect x="494" y="124" width="12" height="12" rx="3" fill="#2f6fd6" stroke="#111"/><rect x="574" y="124" width="12" height="12" rx="3" fill="#d23a26" stroke="#111"/>
 <path d="M485 114 V120 M595 114 V120" stroke="#5f686d" stroke-width="5"/>
 <text id="${p}refTxt" x="540" y="134" text-anchor="middle" font-family="var(--display)" font-size="10" font-weight="700" fill="#1d2327">R-410A</text>
 ${zGauge(485,74,38,"#2f6fd6",p+"nLo",500)}${zGauge(595,74,38,"#d23a26",p+"nHi",800)}
 <line id="${p}nLo" x1="485" y1="74" x2="485" y2="50" stroke="#c0281c" stroke-width="2.5" stroke-linecap="round"/>
 <line id="${p}nHi" x1="595" y1="74" x2="595" y2="50" stroke="#c0281c" stroke-width="2.5" stroke-linecap="round"/>
 <circle cx="485" cy="74" r="3.5" fill="#222"/><circle cx="595" cy="74" r="3.5" fill="#222"/>
 <text id="${p}gLoP" x="485" y="94" text-anchor="middle" font-family="var(--mono)" font-size="11" fill="#1d2327">119 psig</text>
 <text id="${p}gLoT" x="485" y="105" text-anchor="middle" font-family="var(--mono)" font-size="9.5" fill="#4b555b">40°F sat</text>
 <text id="${p}gHiP" x="595" y="94" text-anchor="middle" font-family="var(--mono)" font-size="11" fill="#1d2327">390 psig</text>
 <text id="${p}gHiT" x="595" y="105" text-anchor="middle" font-family="var(--mono)" font-size="9.5" fill="#4b555b">115°F sat</text>
 <text class="tag" x="485" y="22" text-anchor="middle" fill="#3d7de0">LOW SIDE</text>
 <text class="tag" x="595" y="22" text-anchor="middle" fill="#d23a26">HIGH SIDE</text>
 </g>
</g>
<text class="val" id="${p}target" x="648" y="44" font-size="11"></text>
<text class="val" id="${p}target2" x="648" y="58" style="font-size:11px" fill="var(--muted)"></text>
${hp?hpExtras(p):""}
<g id="${p}labels">
 <text class="st" id="${p}lDis" x="${hp?594:608}" y="${hp?298:232}" ${hp?'text-anchor="end"':""} fill="var(--r-dis)">HOT GAS</text>
 <text class="st" id="${p}lLiq" x="200" y="463" fill="var(--r-liq)">WARM LIQUID, HIGH PRESSURE</text>
 <text class="st" id="${p}lMix" x="196" y="349" fill="var(--r-mix)">COLD LIQUID + FLASH GAS</text>
 <text class="st" id="${p}lVap" x="262" y="196" fill="var(--r-suc)">COOL VAPOR, LOW PRESSURE</text>
</g>`}
function hpExtras(p){return `
<!-- discharge (compressor to D) and true suction (S port to the accumulator and compressor) -->
<path id="${p}pD2" class="rpipe" d="M600 300 V272" stroke="var(--r-dis)" stroke-width="7"/>
<path d="M561 238 H579" stroke="#cdd3d7" stroke-width="16"/>
<path id="${p}pS" class="rpipe" d="M600 250 V238 H520 V380 H560" stroke="var(--r-suc)" stroke-width="8"/>
<path id="${p}fS" class="rflow" d="M600 250 V238 H520 V380 H560"/>
<g class="part" data-p="accum" tabindex="0">
 <g filter="url(#zShadow)"><rect class="hl" x="508" y="262" width="24" height="58" rx="10" fill="url(#zGreen)" stroke="#12301a"/></g>
 <path d="M512 270 V312" stroke="rgba(255,255,255,.25)" stroke-width="3" stroke-linecap="round"/>
 <text x="524" y="291" transform="rotate(-90 524 291)" text-anchor="middle" font-family="var(--display)" font-size="8.5" font-weight="700" fill="#e9ecee">ACCUM.</text>
</g>
<!-- reversing valve -->
<g class="part" data-p="rv" tabindex="0">
 ${zCuStubV(570,244,252,8)}${zCuStubV(600,244,252,8)}${zCuStubV(630,244,252,8)}${zCuStubV(600,270,278,8)}
 <g filter="url(#zShadow)"><rect class="hl" x="558" y="250" width="84" height="22" rx="11" fill="url(#zBrassH)" stroke="#5e400e"/></g>
 <rect x="564" y="254" width="72" height="14" rx="6" fill="#1b1f22"/>
 <path id="${p}rvGas" d="M600 268 Q615 262 630 256" fill="none" stroke="#ff5a3a" stroke-width="2.4" stroke-dasharray="4 3" class="zFlow"/>
 <g id="${p}slideG"><rect id="${p}slide" x="566" y="255" width="40" height="12" rx="5" fill="url(#zSteelH)" stroke="#3b4247" stroke-width=".6"/></g>
 <path id="${p}rvCup" d="M570 256 Q585 266 600 256" fill="none" stroke="#6fb3e8" stroke-width="2"/>
 <path d="M642 261 H648" stroke="#9aa3aa" stroke-width="2"/>
 <rect x="646" y="251" width="20" height="20" rx="3" fill="url(#zPlasticDk)" stroke="#000"/><circle id="${p}rvLamp" cx="656" cy="261" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>
 <text class="zt" x="566" y="244" text-anchor="end">E</text><text class="zt" x="606" y="246">S</text><text class="zt" x="636" y="246">C</text><text class="zt" x="594" y="284" text-anchor="end">D</text>
 <text class="zt" x="650" y="244">REV. VALVE</text>
</g>
<g class="part" data-p="ometer" tabindex="0">${zHex(738,430,6)}<rect class="hl" x="740" y="425" width="12" height="10" fill="url(#zBrassH)" stroke="#5e400e" stroke-width=".6"/>${zHex(754,430,6)}<text class="zt" x="760" y="420">PISTON</text></g>
<g class="part" data-p="defrost" tabindex="0">
 <rect class="hl" x="648" y="372" width="66" height="30" rx="2" fill="url(#zGreen)" stroke="#0e2414"/>
 <rect x="652" y="376" width="8" height="5" fill="#111"/><rect x="662" y="376" width="8" height="5" fill="#111"/>
 <text id="${p}dfTxt" x="681" y="394" text-anchor="middle" font-family="var(--mono)" font-size="9.5" fill="#e9ecee">60 min</text>
 <circle id="${p}dfLamp" cx="706" cy="380" r="3" fill="var(--lamp-off)"/>
 <path d="M714 396 C722 398 726 404 730 408" stroke="#222" stroke-width="1.2" fill="none"/><circle cx="730" cy="408" r="4" fill="url(#zCuV)" stroke="#5a2a12" stroke-width=".8"/>
</g>
<rect id="${p}frost" x="724" y="200" width="40" height="224" rx="3" fill="#f2faff" stroke="#8fc3e6" stroke-width="2" opacity="0"/>
<text id="${p}frostTxt" x="744" y="315" text-anchor="middle" font-family="var(--display)" font-weight="700" font-size="13" fill="#2f6fd6" transform="rotate(-90 744 315)" opacity="0">FROST</text>
<g class="part" data-p="strips" tabindex="0">
 <rect class="hl" x="200" y="110" width="80" height="26" rx="2" fill="url(#zSteelH)" stroke="#6f787e" opacity=".9"/>
 <path id="${p}strip" d="M204 123 l6 -8 6 16 6 -16 6 16 6 -16 6 16 6 -16 6 16 6 -16 6 16 6 -16 6 16 6 -8" fill="none" stroke="#7a6a5a" stroke-width="2.5"/>
 <text class="zt" x="240" y="148" text-anchor="middle">HEAT STRIPS</text>
</g>`}
