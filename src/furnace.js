/* ============ GAS FURNACE (single stage, induced draft, 80% or 96%) ============ */
SRC.bryseq=["Bryant 912S manual: heating sequence of operation (15 s prepurge, 17 s igniter, 4 trials, blower delays)","https://www.manualslib.com/manual/2734754/Bryant-912s.html?page=81"];
SRC.safety=["HVAC study guide: Furnace safety controls and troubleshooting (limits, rollout, pressure switch, lockouts, cracked heat exchanger)","https://open-exam-prep.com/study-guides/az-hvac-contractor/heating-systems/furnace-safety-controls-troubleshooting"];
SRC.goodlim=["Goodman AMV8 manual: limit, rollout and pressure switch checks","https://www.manualslib.com/manual/61580/Goodman-Amv8.html?page=26"];
SRC.pickseq=["PickHVAC: Gas furnace sequence of operations, timing and flame sensor current","https://www.pickhvac.com/gas-furnace-sequence-operations-step-step-safety-timing/"];
SRC.trane=["Trane furnace installer's guide: gas inlet 5.0–13.8 in. w.c., manifold 3.5 in. w.c.","https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Installation/18-CH100D1-1B-EN_07012020.pdf"];
SRC.gasp=["North NJ HVAC: Natural gas pressure for a furnace (low and high manifold pressure effects)","https://northnjhvac.com/natural-gas-pressure-furnace-proper-settings-troubleshooting/"];
SRC.emhx=["The Engineering Mindset: HVAC heat exchangers explained","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"];

PHOTOS.furnace={inducer:[gimg("furnace inducer motor draft blower")],ps:[gimg("furnace pressure switch")],igniter:[gimg("furnace hot surface igniter")],fsensor:[gimg("furnace flame sensor rod")],
 gv:[gimg("furnace gas valve White-Rodgers 36J")],burners:[gimg("furnace inshot burners")],hx:[gimg("furnace clamshell heat exchanger")],hx2:[gimg("condensing furnace secondary heat exchanger")],
 limit:[gimg("furnace high limit switch")],rollout:[gimg("furnace flame rollout switch manual reset")],board:[gimg("furnace integrated control board")],blower:[gimg("furnace blower motor and wheel")],
 bcap:[gimg("blower motor run capacitor 10 uF")],filter:[gimg("furnace filter 16x25")],flue:[gimg("furnace vent pipe")],trap:[gimg("condensing furnace condensate trap")],
 gasline:[gimg("furnace gas shutoff valve drip leg")],door:[gimg("furnace door interlock switch")],tstat:[gimg("heating thermostat")],coalarm:[gimg("carbon monoxide alarm")],house:[gimg("supply register warm air")]};

const FLAMP=[["call","Heat call","g"],["ind","Inducer","g"],["ps","Press. switch","g"],["ign","Igniter","a"],["gv","Gas valve","g"],["flame","Flame","g"],["blower","Blower","g"],["lim","Limit open","r"],["roll","Rollout","r"],["lock","Lockout","r"]];
const INPUT=80000;

ILL.inducer=`<circle cx="70" cy="62" r="36" fill="#9aa1a8" stroke="${K}"/>${[0,1,2,3,4,5,6,7].map(i=>`<line x1="70" y1="62" x2="${70+28*Math.cos(i*Math.PI/4)}" y2="${62+28*Math.sin(i*Math.PI/4)}" stroke="${K}" stroke-width="3"/>`).join("")}${box(104,48,40,28,"#30363b",4)}${label(124,66,"MOTOR",WH,6)}${pipeV(70,2,26,16,"#b9c0c6")}${label(70,112,"INDUCER (DRAFT) MOTOR",K,7)}`;
ILL.ps=`<circle cx="80" cy="54" r="34" fill="#e9ecee" stroke="${K}"/><circle cx="80" cy="54" r="22" fill="#c9cfd4" stroke="${K}"/>${box(70,88,20,10,"#7a8288",2)}<path d="M80 98 C80 110 110 112 140 106" stroke="#2f3337" stroke-width="3" fill="none"/>${label(80,58,"-0.65 IN. W.C.",K,7)}${label(120,118,"HOSE TO INDUCER",K,6)}`;
ILL.igniter=`${box(20,50,30,20,"#d8dcdf",3)}<path d="M50 56 H130 V64 H50" fill="#2f3337" stroke="${K}"/><rect x="96" y="54" width="34" height="12" rx="2" fill="#ff8a2a"/>${label(80,94,"HOT SURFACE IGNITER",K,7)}${label(80,106,"glows about 1800–2500°F",K,6)}`;
ILL.fsensor=`${box(14,50,26,20,"#d8dcdf",3)}<path d="M40 60 H110 Q124 60 124 74 V100" stroke="#9aa1a8" stroke-width="5" fill="none"/>${label(80,36,"FLAME SENSOR ROD",K,7)}${label(80,116,"2–6 µA DC in flame",K,6)}<path d="M118 102 q6 -12 12 0 q-6 6 -12 0" fill="#3d7de0"/>`;
ILL.gv=`${box(30,30,100,60,"#2f3337",6)}${pipeH(4,30,60,10)}${pipeH(130,156,60,10)}${box(54,14,52,18,"#9aa1a8",3)}${label(80,26,"REGULATOR",K,6)}${label(80,60,"GAS VALVE",WH,8)}<circle cx="60" cy="78" r="4" fill="${BR}"/><circle cx="100" cy="78" r="4" fill="${BR}"/>${label(60,104,"INLET TAP",K,6)}${label(100,104,"MANIFOLD TAP",K,6)}`;
ILL.burners=`${pipeH(4,156,90,10,"#9aa1a8")}${[30,62,94,126].map(x=>`<rect x="${x-10}" y="58" width="20" height="26" rx="3" fill="#7a8288" stroke="${K}"/><path d="M${x-8} 56 q8 -30 16 0 z" fill="#3d7de0"/>`).join("")}${label(80,112,"INSHOT BURNERS ON THE MANIFOLD",K,7)}`;
ILL.hx=`${[24,62,100].map(x=>`<path d="M${x} 104 V30 Q${x+18} 6 ${x+36} 30 V104 Z" fill="#9aa1a8" stroke="${K}"/>`).join("")}${label(80,116,"CLAMSHELL HEAT EXCHANGER",K,7)}`;
ILL.hx2=`${box(18,26,124,64,"#59626a",4)}${fins(22,30,116,56,4,"#9aa3aa")}${Array.from({length:5},(_,i)=>`<line x1="22" y1="${36+i*11}" x2="138" y2="${36+i*11}" stroke="#c9cfd4" stroke-width="2.4"/>`).join("")}${label(80,108,"SECONDARY (CONDENSING) HX",K,7)}`;
ILL.limit=`${box(40,40,80,30,"#c9cfd4",4)}<circle cx="80" cy="55" r="11" fill="#9aa1a8" stroke="${K}"/>${box(70,70,20,40,"#9aa1a8",2)}${label(80,24,"HIGH LIMIT (AUTO RESET)",K,7)}${label(80,120,"opens about 160–200°F",K,6)}`;
ILL.rollout=`<circle cx="80" cy="56" r="30" fill="#c9cfd4" stroke="${K}"/><circle cx="80" cy="56" r="10" fill="#d23a26" stroke="${K}"/>${label(80,104,"ROLLOUT SWITCH",K,7)}${label(80,116,"manual reset button",K,6)}`;
ILL.board=`${box(14,20,132,80,"#2f6a3a",4)}${[0,1,2,3].map(i=>box(26+i*28,32,18,14,"#222",2)).join("")}<circle cx="120" cy="80" r="6" fill="#e8c33a"/>${label(56,80,"W R G Y C",WH,7)}${label(80,114,"INTEGRATED FURNACE CONTROL",K,7)}`;
ILL.trap=`<path d="M40 20 V80 Q40 104 64 104 H96 Q120 104 120 80 V60" fill="none" stroke="#e9ecee" stroke-width="12"/><path d="M40 20 V80 Q40 104 64 104 H96 Q120 104 120 80 V60" fill="none" stroke="#6fb3e8" stroke-width="6"/>${pipeH(120,156,60,8,"#e9ecee")}${label(80,14,"CONDENSATE TRAP",K,7)}`;
ILL.gasline=`${pipeH(4,156,40,10,"#3a3f44")}${pipeV(40,40,110,10,"#3a3f44")}${box(70,30,24,20,"#e8c33a",3)}<rect x="76" y="20" width="12" height="12" fill="#d23a26"/>${label(40,120,"DRIP LEG",K,6)}${label(82,64,"SHUTOFF",K,6)}`;
ILL.coalarm=`<circle cx="80" cy="56" r="40" fill="#f4f4f0" stroke="${K}"/>${box(58,44,44,18,"#2f3337",3)}${label(80,57,"0 ppm",WH,8)}<circle cx="80" cy="78" r="4" fill="#3fa34d"/>${label(80,112,"CO ALARM (UL 2034)",K,7)}`;

function fSvg(p){return `
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

<!-- supply duct -->
<rect x="150" y="34" width="150" height="56" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.5"/>
<path d="M300 46 H600 V150" fill="none" stroke="#6f787e" stroke-width="26" stroke-linejoin="round"/><path d="M300 46 H600 V150" fill="none" stroke="#c9cfd4" stroke-width="22" stroke-linejoin="round"/><path d="M300 42 H596 V150" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>
<rect x="582" y="148" width="36" height="9" fill="url(#zSteel)" stroke="#5f686d"/>
<text class="lblS" x="160" y="28">Supply plenum</text>
<text class="val" id="${p}supTxt" x="236" y="78" font-size="12">120°F</text>
<g id="${p}aSupG"><path id="${p}aSup" class="air" d="M200 86 V48 H590 V200 M600 160 V230"/>
 <path id="${p}aSupH" d="M594 222 l6 10 6 -10" fill="none" stroke-width="2.5"/></g>
<!-- return duct -->
<path d="M560 440 H120 V330" fill="none" stroke="#6f787e" stroke-width="26" stroke-linejoin="round"/><path d="M560 440 H120 V330" fill="none" stroke="#c9cfd4" stroke-width="22" stroke-linejoin="round"/><path d="M560 436 H116 V330" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>
<rect x="550" y="408" width="44" height="10" fill="url(#zGrille)" stroke="#5f686d"/>
<g id="${p}aRetG"><path id="${p}aRet" class="air" d="M572 404 V440 H120 V350 H146"/>
 <path id="${p}aRetH" d="M140 344 l10 6 -10 6" fill="none" stroke-width="2.5"/></g>
<text class="lblS" x="440" y="430">Return air</text><text class="val" id="${p}retTxt" x="440" y="424" font-size="12" text-anchor="start" dy="-14">68°F</text>

<!-- furnace cabinet -->
<rect x="150" y="90" width="270" height="362" rx="3" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="156" y="96" width="258" height="350" fill="url(#zCabIn)" stroke="#9aa3a9"/>
<rect x="156" y="148" width="240" height="152" fill="url(#zInside)" opacity=".18"/>
<line x1="150" y1="304" x2="420" y2="304" stroke="#6f787e" stroke-width="3"/>${[[154,94],[416,94],[154,448],[416,448]].map(([x,y])=>zScrew(x,y,2.2)).join("")}
<text class="zl" x="160" y="110">Gas furnace</text>
<text class="zt" id="${p}typeTxt" x="160" y="122">80% INDUCED DRAFT</text>

<!-- filter -->
<g class="part" data-p="filter" tabindex="0">
${zFilter(152,318,16,122,p+"dirt")}
</g>

<!-- blower -->
<g class="part" data-p="blower" tabindex="0">
${zBlower(300,380,42,p+"blades")}<text class="zl" x="300" y="444" text-anchor="middle">Blower</text>
</g>
<g class="part" data-p="bcap" tabindex="0">
${zCap(366,404,20,34,p+"capBulge")}<text class="zt" x="376" y="396" text-anchor="middle">CAP</text>
</g>

<!-- control board -->
<g class="part" data-p="board" tabindex="0">
 <rect class="hl" x="178" y="314" width="66" height="50" rx="2" fill="url(#zGreen)" stroke="#0e2414" filter="url(#zShadow)"/><rect x="184" y="318" width="10" height="6" fill="#111"/><rect x="198" y="318" width="10" height="6" fill="#111"/><rect x="186" y="330" width="14" height="10" fill="#1b1f22"/><rect x="236" y="342" width="6" height="18" fill="#e8e8e8"/>
 <circle id="${p}led" cx="232" cy="326" r="4.5" fill="var(--lamp-off)"/>
 <text id="${p}brdTxt" x="211" y="346" text-anchor="middle" font-family="var(--mono)" font-size="7.5" fill="#e9ecee">STANDBY</text>
 <text x="211" y="358" text-anchor="middle" font-family="var(--display)" font-size="7" fill="#c4cacf">CONTROL BOARD</text>
</g>
<g class="part" data-p="door" tabindex="0">
 <rect class="hl" x="396" y="316" width="16" height="22" rx="2" fill="url(#zPlasticDk)" stroke="#000"/>
 <circle id="${p}doorLamp" cx="404" cy="327" r="3.5" fill="var(--ok)"/>
 <text class="zt" x="404" y="350" text-anchor="middle">DOOR SW</text>
</g>

<!-- heat exchanger -->
<g class="part" data-p="hx" tabindex="0">
 <rect class="hl" x="176" y="152" width="200" height="112" fill="transparent" stroke="none"/>
 ${[186,236,286,336].map((x,i)=>`<path id="${p}hx${i}" d="M${x} 262 V176 Q${x+20} 150 ${x+40} 176 V262 Z" fill="#9aa1a8" stroke="var(--line)" stroke-width="1.2"/>`).join("")}
 ${[186,236,286,336].map(x=>`<path d="M${x+4} 260 V178 Q${x+12} 162 ${x+20} 160" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/><path d="M${x+36} 262 V178" stroke="rgba(0,0,0,.25)" stroke-width="3"/><path d="M${x+20} 168 V262" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>`).join("")}
 <path id="${p}crack" d="M252 196 l6 8 -4 6 7 10 -3 8" stroke="var(--bad)" stroke-width="2" fill="none" opacity="0"/>
 <g id="${p}soot" opacity="0" fill="#2a2d30">${[186,236,286,336].map(x=>`<rect x="${x+6}" y="238" width="28" height="24" rx="4"/>`).join("")}</g>
</g>
<!-- secondary HX (condensing) -->
<g class="part" data-p="hx2" tabindex="0" id="${p}hx2G">
 <rect class="hl" x="184" y="126" width="196" height="22" rx="2" fill="#5f686d" stroke="#3b4247"/><rect x="186" y="128" width="192" height="18" fill="url(#zFins)"/>${Array.from({length:12},(_,i)=>`<rect x="${190+i*16}" y="130" width="8" height="14" rx="3" fill="url(#zSteel)" opacity=".8"/>`).join("")}
 <text x="282" y="141" text-anchor="middle" font-family="var(--display)" font-size="9" font-weight="700" fill="#1d2327">SECONDARY HX</text>
</g>

<!-- flames and burners -->
<g id="${p}flames">${[206,256,306,356].map(x=>`<path class="fl" d="M${x-9} 280 Q${x} 236 ${x+9} 280 Z" fill="#3d7de0" opacity=".9"/><path d="M${x-4} 280 Q${x} 256 ${x+4} 280 Z" fill="#9fd0ff"/>`).join("")}</g>
<g id="${p}roll" opacity="0">${[206,256].map(x=>`<path d="M${x-12} 284 Q${x-24} 300 ${x-30} 292 Q${x-16} 312 ${x+2} 290 Z" fill="#f2a53a"/>`).join("")}</g>
<g class="part" data-p="burners" tabindex="0">
 <rect class="hl" x="186" y="278" width="190" height="24" fill="transparent" stroke="none"/>
 ${[206,256,306,356].map(x=>`<rect x="${x-10}" y="280" width="20" height="12" rx="3" fill="url(#zSteel)" stroke="#4d555a"/><ellipse cx="${x}" cy="281" rx="7" ry="2" fill="#1b1f22"/>`).join("")}
 <rect x="186" y="292" width="200" height="8" rx="3" fill="url(#zSteelH)" stroke="#4d555a"/>${[206,256,306,356].map(x=>zHex(x,296,3.4)).join("")}
</g>
<g class="part" data-p="igniter" tabindex="0">
 <rect class="hl" x="166" y="270" width="26" height="14" fill="transparent" stroke="none"/>
 <rect x="166" y="272" width="12" height="10" rx="1.5" fill="#efe9dc" stroke="#8f887a"/>
 <rect id="${p}ig" x="178" y="274" width="16" height="6" rx="2" fill="#2f3337"/>
</g>
<g class="part" data-p="fsensor" tabindex="0">
 <path d="M398 270 H372 V262" fill="none" stroke="#9aa1a8" stroke-width="3"/>
 <rect class="hl" x="364" y="256" width="38" height="20" fill="transparent" stroke="none"/>
 <text class="valD" fill="#1d2327" id="${p}uaTxt" x="404" y="258" text-anchor="end">0.0 µA</text>
</g>
<g class="part" data-p="rollout" tabindex="0">
 <circle class="hl" cx="172" cy="296" r="6.5" fill="url(#zSteel)" stroke="#4d555a"/>
 <circle id="${p}rollLamp" cx="172" cy="296" r="2.5" fill="var(--ok)"/>
</g>
<g class="part" data-p="limit" tabindex="0">
 <rect class="hl" x="352" y="296" width="24" height="12" rx="2" fill="url(#zSteel)" stroke="#4d555a"/>
 <circle id="${p}limLamp" cx="364" cy="302" r="3" fill="var(--ok)"/>
 <text class="zt" x="364" y="318" text-anchor="middle">LIMIT</text>
</g>

<!-- gas -->
<g class="part" data-p="gasline" tabindex="0">
 <path d="M500 300 H436" stroke="#14171a" stroke-width="10" fill="none"/><path d="M500 300 H436" stroke="#3a3f44" stroke-width="7" fill="none"/><path d="M500 298 H436" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/><path d="M470 300 V332" stroke="#14171a" stroke-width="10"/><path d="M470 300 V332" stroke="#3a3f44" stroke-width="7"/><rect x="464" y="330" width="12" height="6" rx="2" fill="#2a2f33"/>
 ${zHex(484,300,8,"url(#zBrass)")}<rect class="hl" x="476" y="286" width="16" height="6" rx="2" fill="#e8c33a" stroke="#6a4a12"/>
 <text class="tag" x="484" y="278" text-anchor="middle" fill="var(--muted)">SHUTOFF</text>
 <text class="val" id="${p}inTxt" x="440" y="352" font-size="10">Inlet 7.0" w.c.</text>
</g>
<g class="part" data-p="gv" tabindex="0">
 <rect class="hl" x="396" y="284" width="40" height="28" rx="3" fill="url(#zAlu)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="400" y="288" width="22" height="20" rx="2" fill="url(#zPlasticDk)"/><circle cx="430" cy="290" r="2.4" fill="url(#zScrew)"/><circle cx="430" cy="306" r="2.4" fill="url(#zScrew)"/>
 <circle id="${p}gvLamp" cx="411" cy="298" r="4" fill="var(--lamp-off)"/>
 <path id="${p}gasPipe" d="M396 296 H380" stroke="url(#zSteelH)" stroke-width="6"/>
 <text class="tag" x="416" y="280" text-anchor="middle" fill="var(--muted)">GAS VALVE</text>
 <text class="val" id="${p}manTxt" x="440" y="366" font-size="10">Manifold 0.0" w.c.</text>
</g>

<!-- inducer and vent -->
<path d="M376 160 H392" stroke="url(#zSteelH)" stroke-width="10"/>
<g class="part" data-p="flue" tabindex="0">
 <rect id="${p}vent" class="hl" x="396" y="8" width="18" height="106" fill="#b9c0c6" stroke="#5f686d"/><rect x="398" y="8" width="4" height="106" fill="rgba(255,255,255,.5)"/><rect x="409" y="8" width="5" height="106" fill="rgba(0,0,0,.18)"/>${[30,60,90].map(y=>`<rect x="394" y="${y}" width="22" height="4" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".5"/>`).join("")}
 <path id="${p}fgas" class="air" d="M405 110 V14" stroke="#9aa1a8"/>
 <rect id="${p}nest" x="396" y="8" width="18" height="14" fill="#7a5a32" opacity="0"/>
 <text class="val" id="${p}flueTxt" x="420" y="14" font-size="10">Flue 75°F</text>
 <text class="val" id="${p}coFTxt" x="420" y="27" font-size="10" fill="var(--muted)">CO 0 ppm</text>
</g>
<g class="part" data-p="inducer" tabindex="0">
 <path d="M405 118 A22 22 0 1 1 383 140 H392 V118 Z" fill="url(#zSteelH)" stroke="#4d555a" filter="url(#zShadow)"/><circle class="hl" cx="405" cy="140" r="18" fill="url(#zInside)" stroke="#2a2f33"/><rect x="420" y="128" width="14" height="24" rx="3" fill="url(#zMotor)" stroke="#111"/>
 <g id="${p}indB" stroke="#c4cacf" stroke-width="2.4">${[0,1,2,3].map(i=>`<line x1="${405-14*Math.cos(i*Math.PI/4)}" y1="${140-14*Math.sin(i*Math.PI/4)}" x2="${405+14*Math.cos(i*Math.PI/4)}" y2="${140+14*Math.sin(i*Math.PI/4)}"/>`).join("")}</g>
 <text class="tag" x="440" y="140" fill="var(--muted)">INDUCER</text>
</g>
<g class="part" data-p="ps" tabindex="0">
 <path d="M386 140 C370 140 364 118 352 112" stroke="#14171a" stroke-width="3" fill="none"/>
 <circle class="hl" cx="342" cy="108" r="10" fill="url(#zAluTop)" stroke="#5f686d" filter="url(#zShadow)"/>
 <circle id="${p}psLamp" cx="342" cy="108" r="3.5" fill="var(--lamp-off)"/>
 <text class="zt" x="342" y="94" text-anchor="middle">PRESS. SW</text>
 <text class="val" id="${p}draftTxt" x="440" y="158" font-size="9">-0.00" w.c.</text>
</g>
<g class="part" data-p="trap" tabindex="0" id="${p}trapG">
 <path d="M420 200 H448 V236 Q448 248 460 248 H470 Q482 248 482 236 V224" fill="none" stroke="#e9ecee" stroke-width="7"/>
 <path id="${p}trapW" d="M448 228 V236 Q448 248 460 248 H470 Q482 248 482 236 V228" fill="none" stroke="#6fb3e8" stroke-width="4"/>
 <rect class="hl" x="440" y="196" width="50" height="58" fill="transparent" stroke="none"/>
 <text class="tag" x="466" y="266" text-anchor="middle" fill="var(--muted)">TRAP</text>
 <circle id="${p}drop" cx="482" cy="222" r="2.5" fill="#6fb3e8" opacity="0"/>
</g>

<text class="valD" fill="#1d2327" id="${p}hxTxt" x="186" y="168">HX 70°F</text>
<text class="val" id="${p}riseTxt" x="14" y="150" font-size="12">Rise 0°F</text><text class="tag" x="14" y="164" fill="var(--muted)">DATA PLATE 35–65°F</text>
<g id="${p}burn" opacity="0"><g fill="#555" opacity=".85"><circle cx="280" cy="210" r="30"/><circle cx="250" cy="170" r="22"/><circle cx="310" cy="150" r="24"/></g><path d="M220 230 l14 20 -8 10 16 18" stroke="var(--bad)" stroke-width="3" fill="none"/></g>`}

const FURNACE={id:"furnace",p:"f_",name:"Gas furnace",svg:fSvg("f_"),lamps:FLAMP,txvOnly:[],
 sliders:[
  {k:"set",l:"Thermostat (heating)",u:"°F",min:50,max:85,step:1,v:70,n:[65,75],note:"Normal 65–75°F"},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-20,max:65,step:1,v:30,note:"Colder outdoors means longer run times."},
  {k:"cfm",l:"Heating airflow",u:" CFM",min:300,max:2000,step:10,v:1200,n:[1000,1500],note:"Set so the rise lands in the data plate range (35–65°F here)"},
  {k:"man",l:"Manifold gas pressure",u:'" w.c.',min:0.5,max:7,step:0.1,v:3.5,n:[3.2,3.8],note:"Natural gas: 3.5 in. w.c. typical. Check the data plate."},
  {k:"inlet",l:"Gas supply (inlet) pressure",u:'" w.c.',min:0,max:14,step:0.1,v:7,n:[5,13.8],note:"Natural gas: 5.0–13.8 in. w.c., 7 typical",more:1},
  {k:"lim",l:"High limit opens at",u:"°F",min:120,max:260,step:5,v:165,n:[160,200],note:"Typically 160–200°F, factory set",more:1},
  {k:"boff",l:"Blower off delay",u:" s",min:60,max:180,step:30,v:120,n:[90,180],note:"90, 120, 150 or 180 seconds",more:1}],
 faults:[["filter","Dirty air filter"],["blower","Blower motor fails"],["bcap","Blower run capacitor weak"],["ign","Hot surface igniter cracked"],["fsDirty","Flame sensor dirty (oxide coating)"],
  ["ground","Poor burner ground"],["gv","Gas valve coil open (won't open)"],["gasLow","Gas supply pressure drops"],["inducer","Inducer motor fails"],
  ["psStuck","Pressure switch stuck closed"],["psHose","Pressure switch hose cracked"],["vent","Vent partially blocked"],["ventFull","Vent blocked (bird nest)"],
  ["trap","Condensate trap clogged (96% only)"],["hxBlock","Heat exchanger restricted (soot)"],["crack","Cracked heat exchanger"],
  ["limitFail","High limit fails closed"],["rollFail","Rollout switch fails closed"],["coDead","CO alarm battery dead"]],
 hidden:["limitFail","rollFail","coDead"],
 scenarios:[{l:"Heat exchanger meltdown: blower dead, high limit and rollout switch fail closed",f:["blower","limitFail","rollFail"]},
  {l:"Carbon monoxide: cracked heat exchanger, overfired, CO alarm battery dead",f:["crack","coDead"],v:{man:5.5}},
  {l:"Flame rollout fire: sooted heat exchanger, rollout switch fails closed",f:["hxBlock","rollFail"]}],
 startMsg(){return `Gas furnace started. House ${this.S.Troom.toFixed(1)}°F, outdoors ${this.V.out}°F, thermostat ${this.V.set}°F.`},
 parts:{
  board:{n:"Control board",s:"Runs the heating sequence and watches the safeties.",
   w:"The integrated furnace control. It reads the thermostat (R, W, G, Y, C) and the safety switches, and runs the inducer, igniter, gas valve and blower in order. An LED flashes a fault code (codes differ by brand, so read the chart on the door).",
   y:"Typical sequence: heat call; check the pressure switch is open; inducer on; pressure switch closes; prepurge (about 15 s); igniter warm-up (about 17 s); gas valve opens; flame must prove within a few seconds; blower on about 25–30 s later. When the call ends: gas off, inducer post-purge (about 15 s), blower off delay (90–180 s).",
   f:"Failed ignition retries up to 3–4 times, then a soft lockout that retries itself after 1–3 hours. A rollout trip is a hard lockout that needs a manual reset.",
   src:["bryseq","safety","pickseq"],faults:[]},
  inducer:{n:"Inducer (draft) motor",s:"Pulls combustion gases through the heat exchanger and pushes them up the vent.",
   w:"A small blower on the outlet of the heat exchanger.",
   y:"It runs first on every call. The pressure switch proves its draft before the board lets the igniter and gas come on.",
   f:"A dead inducer, a blocked vent or a plugged condensate trap means no proven draft, so the furnace never lights.",
   src:["safety","bryseq"],faults:["inducer","vent","ventFull"]},
  ps:{n:"Pressure switch",s:"Proves the inducer is moving combustion gas.",
   w:"A diaphragm switch on a hose to the inducer or collector box. Normally open; it closes on negative pressure (about -0.65 in. w.c. on many furnaces).",
   y:"The board checks it is open before starting the inducer (so a welded switch can't fake a draft), then waits for it to close.",
   f:"Stuck closed: the board refuses to start. Won't close: cracked hose, blocked vent, dead inducer or water in the collector box. A partly blocked vent can let it open during the run, cycling the burner.",
   src:["safety","goodlim"],faults:["psStuck","psHose"]},
  igniter:{n:"Hot surface igniter",s:"Glows hot enough to light the gas.",w:"Silicon carbide or silicon nitride element that glows orange-white.",y:"It heats for about 17 s before the gas valve opens, and stays on until flame is sensed.",f:"A cracked igniter doesn't glow: the gas valve opens, nothing lights, and the board retries until it locks out. Never touch the element; skin oil shortens its life.",src:["bryseq","pickseq"],faults:["ign"]},
  fsensor:{n:"Flame sensor",s:"Proves there is a flame, using flame rectification.",
   w:"A metal rod in the flame. The board puts AC on it; the flame conducts a tiny DC current back to the grounded burner.",
   y:"Normal is about 2–6 µA DC. The board needs roughly 1 µA during the trial for ignition, or it shuts the gas off.",
   f:"Classic symptom of a dirty sensor or a bad ground: the burners light, run a few seconds, then shut off, over and over until lockout. Clean the rod with a fine abrasive pad and check the burner ground.",
   src:["safety","pickseq","goodlim"],faults:["fsDirty","ground"]},
  gv:{n:"Gas valve",s:"Opens the gas to the burners and regulates manifold pressure.",
   w:"A 24 V redundant valve with a built-in regulator. Pressure taps for inlet and manifold.",
   y:"Natural gas: inlet 5.0–13.8 in. w.c. (7 typical), manifold about 3.5 in. w.c. Input is set by the manifold pressure and the orifices.",
   f:"Low manifold pressure: underfiring, low temperature rise, weak flame and ignition trouble. High: overfiring, high rise, limit trips, soot and carbon monoxide.",
   src:["trane","gasp"],faults:["gv","gasLow"]},
  burners:{n:"Burners",s:"Inshot burners fire into the heat exchanger.",w:"A row of burners fed by orifices on the gas manifold. The flame carries from burner to burner across crossover slots.",y:"A healthy flame is blue, steady and goes straight into the heat exchanger.",f:"Yellow or lazy flames mean poor combustion air, overfiring or dirt. Flames that move or roll out when the blower starts point to a cracked heat exchanger.",src:["safety","gasp"],faults:["hxBlock"]},
  hx:{n:"Heat exchanger",s:"Keeps the flame and flue gas separate from the house air.",
   w:"Steel clamshells or tubes. Flue gas inside, house air blowing across the outside.",
   y:"It heats the air without mixing it with combustion products.",
   f:"Overheating from low airflow cracks it over time. A crack can let flue gas, including carbon monoxide, into the supply air, and lets blower air push the flame around. Confirmed cracks mean shut it down and red-tag it.",
   src:["emhx","safety"],faults:["crack","hxBlock"]},
  hx2:{n:"Secondary heat exchanger",s:"Condensing furnaces only: wrings the last heat out of the flue gas.",w:"A finned coil after the primary heat exchanger.",y:"It cools the flue gas below its dew point so the water vapor condenses, which is how a 90%+ furnace reaches its efficiency. The vent is cool enough for PVC.",f:"Condensate is acidic. It must drain through the trap.",src:["emhx"],faults:["trap"]},
  trap:{n:"Condensate trap",s:"Drains the water from a condensing furnace.",w:"A trap that lets water out without letting air in.",y:"Water from the secondary heat exchanger and vent drains through it.",f:"A clogged trap backs water into the collector box: the pressure switch can't close and the furnace won't light, or it shuts off mid-cycle.",src:["safety"],faults:["trap"]},
  limit:{n:"High limit",s:"Shuts the gas off if the heat exchanger area gets too hot.",w:"A bimetal switch, normally closed, auto reset. Typically opens around 160–200°F.",y:"It protects the heat exchanger when airflow is too low.",f:"When it opens the gas shuts off and the blower keeps running. Repeated limit trips mean low airflow (filter, blower, capacitor, closed registers) or overfiring.",src:["safety","goodlim"],faults:["limitFail"]},
  rollout:{n:"Rollout switch",s:"Catches flame rolling out of the burner box.",w:"A bimetal disc near the burners with a manual reset button. Opens around 250–350°F.",y:"Flame should never reach it.",f:"A trip means the flame had nowhere to go: restricted or sooted heat exchanger, blocked flue or a crack. Find the cause before resetting it.",src:["safety","goodlim"],faults:["rollFail"]},
  blower:{n:"Blower",s:"Moves house air across the heat exchanger.",w:"A squirrel-cage wheel and motor.",y:"It starts about 25–30 s after the flame proves so the air isn't cold, and runs on after the call to pull the leftover heat out.",f:"No blower: the limit trips. A weak blower or dirty filter raises the temperature rise.",src:["bryseq","safety"],faults:["blower","bcap"]},
  bcap:{n:"Blower run capacitor",s:"Helps a PSC blower motor start and run.",w:"Single run capacitor, typically 5–10 µF.",y:"",f:"A weak capacitor makes the blower run slow or hum, cutting airflow.",src:["beacon","safety"],faults:["bcap"]},
  filter:{n:"Air filter",s:"Cleans the return air.",w:"In the return, before the blower.",y:"",f:"A dirty filter cuts airflow, raises the temperature rise and trips the limit.",src:["safety"],faults:["filter"]},
  flue:{n:"Vent",s:"Carries the combustion gases outside.",w:"80%: metal B-vent with hot flue gas. 90%+: PVC with cool, wet flue gas.",y:"The flue temperature and carbon monoxide shown are what a combustion analyzer would read (air-free CO).",f:"A blocked vent stops the pressure switch from closing. A partly blocked vent can spill flue gas and cause rollout.",src:["safety"],faults:["vent","ventFull"]},
  gasline:{n:"Gas supply",s:"Shutoff valve, drip leg and supply pipe.",w:"A manual shutoff and a drip leg (sediment trap) ahead of the gas valve.",y:"Inlet pressure is measured at the gas valve inlet tap with the furnace firing.",f:"Low supply pressure under load (undersized pipe, bad regulator) underfires the furnace and can cause ignition failures.",src:["trane","gasp"],faults:["gasLow"]},
  door:{n:"Door switch",s:"Kills power when the blower door is off.",w:"A plunger switch on the 120 V supply.",y:"Opening the door shuts the whole furnace off.",f:"",src:["safety"],faults:[]},
  tstat:{n:"Thermostat",s:"Calls for heat (W) when the house is cool.",w:"",y:"",f:"",src:[],faults:[]},
  coalarm:{n:"CO alarm",s:"Warns the people in the house about carbon monoxide.",w:"A UL 2034 listed alarm. It sounds at about 70 ppm after an hour or two, faster at higher levels.",y:"The last line of defense against a cracked heat exchanger or a spilling vent.",f:"A dead battery means no warning.",src:["safety"],faults:["coDead"]},
  house:{n:"House",s:"Where the heat goes.",w:"Heat leaks out to the outdoors through walls, windows and air leaks.",y:"Colder outdoors means longer burner run times.",f:"",src:[],faults:[]}},
 init(){const V=this.V;return {t:0,dead:null,Troom:V.set-2,mode:"heat",fan:"auto",door:true,calling:false,st:"idle",tm:0,trials:0,recycles:0,lock:false,hard:false,
  ind:false,ign:false,gvOn:false,flame:false,blowerOn:false,bOnT:0,bOffT:0,draft:0,psC:false,Thx:V.set-2,Tsup:V.set-2,Troll:80,limOpen:false,rollOpen:false,
  uA:0,man:0,input:0,co:0,coHouse:0,trapLvl:0,limTrips:0,ang:0,iang:0,aoff:0,eff:0.8,type:80,igGlow:0,labels:true,logs2:{}}},
 switches:[
  {l:S=>`Door switch: ${S.door?"closed":"door off"}`,on:S=>S.door,act(sim){sim.S.door=!sim.S.door;log(sim,sim.S.door?"Blower door on. Power restored.":"Blower door off. Door switch kills power to the furnace.")}},
  {l:S=>`Thermostat: ${S.mode}`,on:S=>S.mode==="heat",act(sim){sim.S.mode=sim.S.mode==="heat"?"off":"heat";log(sim,`Thermostat set to ${sim.S.mode}.`)}},
  {l:S=>`Fan: ${S.fan}`,on:S=>S.fan==="on",act(sim){sim.S.fan=sim.S.fan==="auto"?"on":"auto";log(sim,`Fan set to ${sim.S.fan}.`)}},
  {l:S=>`Type: ${S.type}%`,on:S=>S.type===96,act(sim){const S=sim.S;S.type=S.type===80?96:80;log(sim,S.type===96?"Swapped to a 96% condensing furnace (secondary heat exchanger, PVC vent, condensate trap).":"Swapped to an 80% induced draft furnace (metal vent).")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[],
 resets(S){const r=[];
  if(S.lock&&!S.hard)r.push(["Reset lockout (cycle power)",()=>{S.lock=false;S.st="idle";S.trials=0;S.recycles=0;log(this,"Power cycled. Lockout cleared.")}]);
  if(S.rollOpen)r.push(["Press the rollout reset button",()=>{if(S.Troll>200){log(this,"Rollout switch is still too hot to reset.","w");return}S.rollOpen=false;S.hard=false;S.lock=false;S.st="idle";S.trials=0;log(this,"Rollout switch reset by hand. Find the cause before you do this on a real furnace.","w")}]);
  return r},
 reads(S){return [["House",`${S.Troom.toFixed(1)}°F`],["Supply",`${f0(S.Tsup)}°F`],["Temp rise",S.blowerOn?`${f0(S.Tsup-S.Troom)}°F`:"—"],["Manifold",`${S.man.toFixed(1)}" w.c.`],["Flame",`${S.uA.toFixed(1)} µA`],["State",this.stText(S)]]},
 stText(S){return S.dead?"failed":({idle:S.calling?"waiting":"standby",psErr:"press. sw. closed",waitPS:"waiting on press. sw.",prepurge:"prepurge",igwarm:"igniter warm-up",trial:"trial for ignition",interpurge:"retry purge",run:"heating",post:"post-purge",limit:"limit open",lock:S.hard?"hard lockout":"soft lockout"})[S.st]||S.st},
 step(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;S.tm+=dt;
  const c96=S.type===96;S.eff=c96?0.96:0.80;
  // thermostat
  if(S.mode==="heat"){if(!S.calling&&S.Troom<V.set-0.75){S.calling=true;log(sim,"Thermostat calls for heat (R to W).")}else if(S.calling&&S.Troom>V.set+0.75){S.calling=false;log(sim,"Thermostat satisfied.")}}else S.calling=false;
  const power=S.door;
  // draft and pressure switch
  const hot=clamp((S.Thx-100)/200,0,1);
  let dr=S.ind&&!F.inducer?(c96?1.2:1.0):0;
  if(F.vent)dr*=0.72-0.22*hot;if(F.ventFull)dr*=0.2;if(c96&&F.trap&&S.trapLvl>1)dr*=0.3;
  S.draft+=(dr-S.draft)*Math.min(1,dt/3);
  const wasPS=S.psC;
  if(F.psStuck)S.psC=true;else if(F.psHose)S.psC=false;else S.psC=S.psC?S.draft>=0.55:S.draft>=0.65;
  // gas
  const inlet=F.gasLow?(S.gvOn&&S.flame?2.4:4.0):V.inlet;
  S.man=S.gvOn&&!F.gv?Math.max(0,Math.min(V.man,inlet-1.0)):0;
  const gasFlow=S.man>0.3;
  // safeties
  const Tlim=S.blowerOn?S.Tsup+(S.Thx-S.Tsup)*0.3:S.Troom+(S.Thx-S.Troom)*0.8;
  if(!S.limOpen&&!F.limitFail&&Tlim>=V.lim){S.limOpen=true;S.limTrips++;log(sim,`High limit opened at ${f0(Tlim)}°F. Gas off, blower on.`,"b")}
  else if(S.limOpen&&Tlim<=V.lim-25){S.limOpen=false;log(sim,"High limit closed again.")}
  if(!S.rollOpen&&!F.rollFail&&S.Troll>=300){S.rollOpen=true;S.hard=true;S.lock=true;log(sim,`Rollout switch opened at ${f0(S.Troll)}°F. Flame left the burner box. Hard lockout: manual reset.`,"b")}
  // sequence
  const go=(st,msg,c)=>{S.st=st;S.tm=0;if(msg)log(sim,msg,c)};
  const gasOff=()=>{S.gvOn=false;S.flame=false};
  if(!power){S.ind=false;S.ign=false;gasOff();S.blowerOn=false;S.bOnT=0;S.bOffT=0;if(S.st!=="idle"&&S.st!=="lock")go("idle");}
  else switch(S.st){
   case "idle":S.ind=false;S.ign=false;gasOff();
    if(S.calling&&!S.limOpen&&!S.rollOpen){if(S.psC){go("psErr","Pressure switch is closed with the inducer off. Board won't start.","b")}else{S.ind=true;go("waitPS","Pressure switch open. Inducer on.")}}
    break;
   case "psErr":if(!S.psC)go("idle");if(!S.calling)go("idle");break;
   case "waitPS":S.ind=true;
    if(S.psC)go("prepurge","Pressure switch closed. Prepurge 15 seconds.");
    else if(S.tm>30&&!S.logs2.ps){S.logs2.ps=1;log(sim,`Pressure switch won't close (draft ${S.draft.toFixed(2)} in. w.c.). Inducer keeps running.`,"b")}
    if(!S.calling){S.logs2.ps=0;go("post")}
    break;
   case "prepurge":if(!S.psC){go("waitPS","Pressure switch opened.","w");break}if(S.tm>=15){S.ign=true;go("igwarm","Igniter on. Warming up 17 seconds.")}if(!S.calling)go("post");break;
   case "igwarm":if(!S.psC){S.ign=false;go("waitPS","Pressure switch opened.","w");break}if(S.tm>=17){S.gvOn=true;go("trial","Gas valve open. Trial for ignition.")}break;
   case "trial":
    if(gasFlow&&!F.ign&&S.igGlow>0.7&&S.tm>1&&!S.flame){S.flame=true;log(sim,"Burners lit.")}
    if(S.tm>=7){
     if(S.flame&&S.uA>=1){S.ign=false;S.trials=0;S.bOnT=30;go("run",`Flame proved at ${S.uA.toFixed(1)} µA. Igniter off. Blower on in 30 seconds.`)}
     else{const lit=S.flame;gasOff();S.ign=false;S.trials++;
      log(sim,lit?`Flame lit but only ${S.uA.toFixed(1)} µA at the sensor (needs about 1 µA). Gas valve closed.`:F.ign?"No ignition: the igniter never glowed. Gas valve closed.":!gasFlow?"No ignition: no gas reaching the burners. Gas valve closed.":"No ignition. Gas valve closed.","b");
      if(S.trials>=4){S.lock=true;go("lock","Four failed trials. Soft lockout: the board retries in 1 hour.","b")}else go("interpurge",`Retry ${S.trials+1} of 4 after a purge.`,"w")}}
    break;
   case "interpurge":S.ind=true;if(S.tm>=15){if(!S.calling){go("post");break}if(S.psC){S.ign=true;go("igwarm")}else go("waitPS")}break;
   case "run":
    if(!S.calling){gasOff();S.bOffT=V.boff;go("post",`Gas off. Inducer post-purge; blower runs ${V.boff} more seconds.`);break}
    if(S.limOpen){gasOff();S.ind=true;go("limit");break}
    if(S.rollOpen){gasOff();go("lock");break}
    if(!S.psC){gasOff();S.bOffT=V.boff;go("waitPS","Pressure switch opened during the run. Gas off.","b");break}
    if(!gasFlow||S.uA<0.8){gasOff();S.recycles++;log(sim,`Flame lost (${S.uA.toFixed(1)} µA). Gas off. Recycling.`,"b");if(S.recycles>=5){S.lock=true;go("lock","Too many flame losses. Soft lockout.","b")}else go("interpurge");break}
    break;
   case "post":S.ind=true;gasOff();if(S.tm>=15){S.ind=false;go("idle")}break;
   case "limit":gasOff();S.ind=S.tm<15;if(!S.limOpen){go("idle","Limit reset. Board restarts the sequence.")}break;
   case "lock":S.ign=false;gasOff();S.ind=S.tm<15;if(!S.hard&&S.tm>=3600){S.lock=false;S.trials=0;S.recycles=0;go("idle","Soft lockout timed out. Trying again.")}break;
  }
  // igniter glow, flame current
  S.igGlow=clamp(S.igGlow+(S.ign&&!F.ign?dt/10:-dt/4),0,1);
  S.uA=S.flame?4.0*(F.fsDirty?0.2:1)*(F.ground?0.15:1)*(S.man<1.5?0.3:1):0;
  // blower
  if(S.bOnT>0){S.bOnT-=dt;if(S.bOnT<=0&&S.st==="run")log(sim,"Blower on (heat speed).")}
  if(S.bOffT>0)S.bOffT-=dt;
  const want=power&&(S.fan==="on"||(S.st==="run"&&S.bOnT<=0)||S.bOffT>0||S.limOpen||S.st==="limit"||S.rollOpen);
  S.blowerOn=want&&!F.blower;
  if(S.st==="limit"&&!S.bOffT)S.bOffT=V.boff;
  const cfm=S.blowerOn?V.cfm*(F.filter?0.5:1)*(F.bcap?0.45:1):0;S.cfm=cfm;
  // heat
  S.input=S.flame?INPUT*Math.sqrt(S.man/3.5):0;
  let eff=S.eff;if(F.hxBlock)eff-=0.08;
  const out=S.input*eff;
  const Tr=S.Troom,eps=0.9,Chx=40;
  const toAir=1.08*cfm*eps*(S.Thx-Tr);
  S.Thx+=(out-toAir-30*(S.Thx-Tr))/3600/Chx*dt;
  S.Tsup=cfm>0?Tr+eps*(S.Thx-Tr):Tr+(S.Thx-Tr)*0.15;
  S.Troom+=((cfm>0?toAir:0)+(cfm>0?0:30*(S.Thx-Tr)*0.5)-857*(S.Troom-V.out))/3600/3000*dt;
  // rollout temperature
  let rt=80;if(S.flame){rt=150+(F.hxBlock?360:0)+(F.ventFull?150:0)+(F.vent?40:0)+(F.crack&&S.blowerOn?70:0)+Math.max(0,S.man-4)*25}
  S.Troll+=(rt-S.Troll)*Math.min(1,dt/40);
  // combustion: air-free CO in the flue, CO in the house
  S.co=S.flame?30+Math.max(0,S.man-3.8)*260+(F.hxBlock?350:0)+(F.vent?60:0)+Math.max(0,1.6-S.man)*80:0;
  const leak=(F.crack&&S.flame?S.co*(S.blowerOn?2.5:0.6):0)+(F.vent&&S.flame?S.co*0.15:0);
  S.coHouse=Math.max(0,S.coHouse+(leak-S.coHouse*0.5)/3600*dt);
  if(S.coHouse>=70&&!S.logs2.co&&!F.coDead){S.logs2.co=1;log(sim,`CO alarm sounding: ${f0(S.coHouse)} ppm in the house. Everyone out; call the gas utility or 911.`,"b")}
  if(S.coHouse<35)S.logs2.co=0;
  if(S.coHouse>=400){explode(sim,"co");return}
  if(S.Thx>=650){explode(sim,"melt");return}
  if(S.Troll>=480){explode(sim,"fire");return}
  if(S.Thx>=450&&!S.logs2.hx){S.logs2.hx=1;log(sim,`Heat exchanger at ${f0(S.Thx)}°F and climbing. Steel is losing strength.`,"b")}
  // condensate (96%)
  if(c96){if(F.trap){if(S.flame)S.trapLvl=Math.min(1.3,S.trapLvl+dt/300)}else S.trapLvl=Math.max(0,S.trapLvl-dt/60);
   if(S.trapLvl>1&&!S.logs2.trap){S.logs2.trap=1;log(sim,"Condensate backing up into the collector box.","w")}}else S.trapLvl=0;
 },
 draw(dt){const S=this.S,F=this.F,V=this.V,p="f_",c96=S.type===96;
  // flames
  const fl=$(p+"flames");if(fl){fl.style.opacity=S.flame?1:0;const lazy=S.man>4.2||F.hxBlock||S.man<1.8;fl.querySelectorAll(".fl").forEach((e,i)=>{e.setAttribute("fill",lazy?"#f2a53a":"#3d7de0");e.style.transform=S.flame&&F.crack&&S.blowerOn?`translateX(${(Math.sin(performance.now()/90+i)*3).toFixed(1)}px)`:""})}
  at(p+"roll","opacity",S.flame&&S.Troll>240?(blink(200)?1:.6):0);
  at(p+"ig","fill",S.igGlow>0.05?mix([47,51,55],[255,190,90],S.igGlow):"#2f3337");
  const hc=mix([154,161,168],[214,70,30],(S.Thx-120)/500);[0,1,2,3].forEach(i=>at(p+"hx"+i,"fill",hc));
  at(p+"crack","opacity",F.crack?1:0);at(p+"soot","opacity",F.hxBlock?0.6:0);
  at(p+"hx2G","opacity",c96?1:0);at(p+"trapG","opacity",c96?1:0);at(p+"trapW","stroke",F.trap&&S.trapLvl>0.5?"#c9a07a":"#6fb3e8");
  at(p+"drop","opacity",c96&&S.flame&&!F.trap?(blink(600)?1:0):0);
  at(p+"vent","fill",c96?"#f4f4f0":"#b9c0c6");at(p+"nest","opacity",F.ventFull?1:0);
  txt(p+"typeTxt",c96?"96% CONDENSING":"80% INDUCED DRAFT");
  // spinning
  if(S.blowerOn)S.ang=(S.ang+dt*800)%360;at(p+"blades","transform",`rotate(${S.ang} 300 380)`);
  if(S.ind&&!F.inducer)S.iang=(S.iang+dt*1400)%360;at(p+"indB","transform",`rotate(${S.iang} 405 140)`);
  // air
  S.aoff-=dt*30;["aSup","aRet","fgas"].forEach(id=>{const e=$(p+id);if(e)e.style.strokeDashoffset=S.aoff});
  at(p+"aSupG","opacity",S.blowerOn?1:0);at(p+"aRetG","opacity",S.blowerOn?1:0);
  at(p+"aSup","stroke",acol(S.Tsup));at(p+"aSupH","stroke",acol(S.Tsup));at(p+"aRet","stroke",acol(S.Troom));at(p+"aRetH","stroke",acol(S.Troom));
  at(p+"fgas","opacity",S.ind&&S.draft>0.1?1:0);at(p+"fgas","stroke",S.flame?(c96?"#c4cacf":"#e0662a"):"#c4cacf");
  at(p+"dirt","opacity",F.filter?0.6:0);at(p+"capBulge","opacity",F.bcap?1:0);
  // lamps on parts
  at(p+"psLamp","fill",S.psC?"var(--ok)":"var(--lamp-off)");at(p+"gvLamp","fill",S.gvOn?"var(--ok)":"var(--lamp-off)");
  at(p+"limLamp","fill",S.limOpen?"var(--bad)":"var(--ok)");at(p+"rollLamp","fill",S.rollOpen?"var(--bad)":"var(--ok)");
  at(p+"doorLamp","fill",S.door?"var(--ok)":"var(--bad)");at(p+"tstatLamp","fill",S.calling?"#e0662a":"var(--lamp-off)");
  const coOn=S.coHouse>=70&&!F.coDead;at(p+"coLamp","fill",coOn?(blink(250)?"var(--bad)":"#600"):F.coDead?"var(--lamp-off)":"#3fa34d");
  txt(p+"coTxt",F.coDead?"--":String(f0(S.coHouse)));
  const led=S.lock?(blink(250)?"var(--bad)":"var(--lamp-off)"):S.limOpen||S.st==="psErr"||(S.st==="waitPS"&&S.tm>30)?(blink(500)?"#e8c33a":"var(--lamp-off)"):(blink(1000)?"var(--ok)":"var(--lamp-off)");
  at(p+"led","fill",S.door?led:"var(--lamp-off)");
  txt(p+"brdTxt",this.stText(S).toUpperCase().slice(0,16));
  // numbers
  txt(p+"uaTxt",`${S.uA.toFixed(1)} µA`);txt(p+"draftTxt",`-${S.draft.toFixed(2)}" w.c.`);
  txt(p+"inTxt",`Inlet ${(F.gasLow?(S.gvOn&&S.flame?2.4:4.0):V.inlet).toFixed(1)}" w.c.`);txt(p+"manTxt",`Manifold ${S.man.toFixed(1)}" w.c.`);
  txt(p+"flueTxt",`Flue ${f0(S.flame?(c96?105:330+Math.max(0,S.man-3.5)*40):S.ind?S.Thx*0.6:75)}°F`);txt(p+"coFTxt",`CO ${f0(S.co)} ppm air-free`);
  txt(p+"hxTxt",`HX ${f0(S.Thx)}°F`);txt(p+"riseTxt",S.blowerOn?`Rise ${f0(S.Tsup-S.Troom)}°F`:"Rise —");
  at(p+"riseTxt","fill",S.blowerOn&&(S.Tsup-S.Troom>65||S.Tsup-S.Troom<35)&&S.flame?"var(--bad)":"var(--ink)");
  txt(p+"supTxt",`${f0(S.Tsup)}°F`);txt(p+"retTxt",`${f0(S.Troom)}°F`);txt(p+"roomTxt",`${S.Troom.toFixed(1)}°F`);txt(p+"outTxt",`${V.out}°F`);txt(p+"tstatTxt",String(V.set));
 },
 boom(kind){const F=this.F,S=this.S;
  if(kind==="melt")return{t:"Heat exchanger overheated and failed",b:`<p>With no air across it, the heat exchanger kept absorbing burner heat until the steel warped and split. Flue gas can now enter the house air, and the cabinet is a fire risk.</p><ul>
   ${F.blower?li(1,"Blower motor dead: no airflow."):""}${F.filter?li(1,"Filter plugged."):""}
   ${li(F.limitFail,"High limit failed closed.","High limit.")}${li(F.rollFail,"Rollout switch failed closed.","Rollout switch.")}</ul>
   <p>The high limit is the switch that should have shut the gas off within minutes. Never jumper a limit.</p><small>Simplified: the sim fails the heat exchanger at 650°F, much faster than real life.</small>`,wreck:1};
  if(kind==="fire")return{t:"Flame rollout started a fire",b:`<p>The flame couldn't get through the heat exchanger, so it rolled out of the burner box and cooked the wiring and cabinet.</p><ul>
   ${F.hxBlock?li(1,"Heat exchanger sooted shut."):""}${F.ventFull||F.vent?li(1,"Vent blocked."):""}
   ${li(F.rollFail,"Rollout switch failed closed.","Rollout switch.")}</ul><small>Simplified.</small>`,wreck:1};
  return{t:"Carbon monoxide filled the house",b:`<p>Flue gas with high carbon monoxide leaked into the supply air and built up to ${f0(S.coHouse)} ppm in the house. That is a life-threatening level.</p><ul>
   ${F.crack?li(1,"Cracked heat exchanger let flue gas into the air stream."):""}
   ${S.man>4?li(1,`Overfired at ${S.man.toFixed(1)} in. w.c. manifold pressure, making far more CO.`):""}
   ${li(F.coDead,"CO alarm battery dead: nobody was warned.","CO alarm.")}</ul>
   <p>Combustion analysis at every service, and a working CO alarm on every level, catch this.</p><small>Simplified: CO build-up is sped up.</small>`,wreck:0};
 }};
FURNACE.lampOn=S=>({call:S.calling,ind:S.ind&&!FURNACE.F.inducer,ps:S.psC,ign:S.ign,gv:S.gvOn,flame:S.flame,blower:S.blowerOn,lim:S.limOpen,roll:S.rollOpen,lock:S.lock});
