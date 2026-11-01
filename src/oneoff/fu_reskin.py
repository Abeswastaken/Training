s=open('furnace.js').read()
R=[
# house
('<rect class="hl" x="530" y="150" width="256" height="300" rx="3" fill="var(--panel)" fill-opacity=".5" stroke="var(--line)" stroke-width="3"/>\n <path d="M524 152 L658 70 L792 152" fill="none" stroke="var(--line)" stroke-width="3"/>',
 '<path d="M520 154 L658 66 L796 154 Z" fill="#6b5a4a" stroke="#3b2f25" stroke-width="2"/><path d="M528 150 L658 72 L788 150" fill="none" stroke="#8a7562" stroke-width="3"/>\n <rect class="hl" x="530" y="150" width="256" height="300" rx="2" fill="url(#zCabIn)" fill-opacity=".35" stroke="#a89a85" stroke-width="5"/>'),
(''' <rect class="hl body" x="720" y="232" width="44" height="46" rx="6"/>
 <text class="val" id="${p}tstatTxt" x="742" y="258" text-anchor="middle">70</text>
 <circle id="${p}tstatLamp" cx="742" cy="268" r="3" fill="var(--lamp-off)"/>''','${zTstat(720,230,44,50,p+"tstatTxt",p+"tstatLamp","70")}'),
('<circle class="hl" cx="742" cy="186" r="16" fill="#f4f4f0" stroke="var(--line)"/>','<circle class="hl" cx="742" cy="186" r="16" fill="url(#zAluTop)" stroke="#8f979d" filter="url(#zShadow)"/><circle cx="742" cy="186" r="11" fill="none" stroke="#c4cacf" stroke-dasharray="1.5 2"/>'),
# ducts
('<rect x="150" y="34" width="150" height="56" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>\n<path d="M300 46 H600 V150" fill="none" stroke="var(--line)" stroke-width="24" stroke-linejoin="round" opacity=".35"/>\n<rect x="584" y="148" width="32" height="8" fill="var(--line)"/>',
 '<rect x="150" y="34" width="150" height="56" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.5"/>\n<path d="M300 46 H600 V150" fill="none" stroke="#6f787e" stroke-width="26" stroke-linejoin="round"/><path d="M300 46 H600 V150" fill="none" stroke="#c9cfd4" stroke-width="22" stroke-linejoin="round"/><path d="M300 42 H596 V150" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>\n<rect x="582" y="148" width="36" height="9" fill="url(#zSteel)" stroke="#5f686d"/>'),
('<path d="M560 440 H120 V330" fill="none" stroke="var(--line)" stroke-width="24" stroke-linejoin="round" opacity=".35"/>\n<rect x="552" y="410" width="40" height="8" fill="var(--line)"/>',
 '<path d="M560 440 H120 V330" fill="none" stroke="#6f787e" stroke-width="26" stroke-linejoin="round"/><path d="M560 440 H120 V330" fill="none" stroke="#c9cfd4" stroke-width="22" stroke-linejoin="round"/><path d="M560 436 H116 V330" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>\n<rect x="550" y="408" width="44" height="10" fill="url(#zGrille)" stroke="#5f686d"/>'),
# cabinet
('<rect x="150" y="90" width="270" height="362" rx="4" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>\n<line x1="150" y1="304" x2="420" y2="304" stroke="var(--line)" stroke-width="2"/>\n<text class="lblS" x="160" y="108">Gas furnace</text>\n<text class="tag" id="${p}typeTxt" x="160" y="120" fill="var(--muted)">80% INDUCED DRAFT</text>',
 '<rect x="150" y="90" width="270" height="362" rx="3" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="156" y="96" width="258" height="350" fill="url(#zCabIn)" stroke="#9aa3a9"/>\n<rect x="156" y="148" width="240" height="152" fill="url(#zInside)" opacity=".18"/>\n<line x1="150" y1="304" x2="420" y2="304" stroke="#6f787e" stroke-width="3"/>${[[154,94],[416,94],[154,448],[416,448]].map(([x,y])=>zScrew(x,y,2.2)).join("")}\n<text class="zl" x="160" y="110">Gas furnace</text>\n<text class="zt" id="${p}typeTxt" x="160" y="122">80% INDUCED DRAFT</text>'),
# filter
(''' <rect class="hl body" x="152" y="318" width="16" height="122" rx="2"/>
 <path d="M155 322 l10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6 10 6 -10 6" fill="none" stroke="var(--muted)" stroke-width="1"/>
 <rect id="${p}dirt" x="152" y="318" width="16" height="122" fill="#6b5a3a" opacity="0"/>''','${zFilter(152,318,16,122,p+"dirt")}'),
# blower
(''' <circle class="hl body" cx="300" cy="380" r="50"/>
 <g id="${p}blades" stroke="var(--ink)" stroke-width="2.4">${[0,1,2,3,4,5].map(i=>`<line x1="${300+16*Math.cos(i*Math.PI/3)}" y1="${380+16*Math.sin(i*Math.PI/3)}" x2="${300+44*Math.cos(i*Math.PI/3)}" y2="${380+44*Math.sin(i*Math.PI/3)}"/>`).join("")}</g>
 <circle cx="300" cy="380" r="13" fill="var(--plate)"/>
 <text class="lblS" x="300" y="446" text-anchor="middle">Blower</text>''','${zBlower(300,380,42,p+"blades")}<text class="zl" x="300" y="444" text-anchor="middle">Blower</text>'),
(''' <rect class="hl" x="364" y="404" width="22" height="34" rx="7" fill="#b9c0c6" stroke="var(--line)"/>
 <rect id="${p}capBulge" x="364" y="398" width="22" height="8" rx="4" fill="#b9c0c6" stroke="var(--bad)" opacity="0"/>
 <text class="tag" x="375" y="398" text-anchor="middle" fill="var(--muted)">CAP</text>''','${zCap(366,404,20,34,p+"capBulge")}<text class="zt" x="376" y="396" text-anchor="middle">CAP</text>'),
# board
('<rect class="hl" x="178" y="314" width="66" height="50" rx="3" fill="#2f6a3a" stroke="var(--line)"/>','<rect class="hl" x="178" y="314" width="66" height="50" rx="2" fill="url(#zGreen)" stroke="#0e2414" filter="url(#zShadow)"/><rect x="184" y="318" width="10" height="6" fill="#111"/><rect x="198" y="318" width="10" height="6" fill="#111"/><rect x="186" y="330" width="14" height="10" fill="#1b1f22"/><rect x="236" y="342" width="6" height="18" fill="#e8e8e8"/>'),
('<rect class="hl" x="396" y="316" width="16" height="22" rx="2" fill="var(--plate)" stroke="var(--line)"/>','<rect class="hl" x="396" y="316" width="16" height="22" rx="2" fill="url(#zPlasticDk)" stroke="#000"/>'),
('<text class="tag" x="404" y="350" text-anchor="middle" fill="var(--muted)">DOOR SW</text>','<text class="zt" x="404" y="350" text-anchor="middle">DOOR SW</text>'),
# HX sheen overlay after clamshells
('<path id="${p}crack"','${[186,236,286,336].map(x=>`<path d="M${x+4} 260 V178 Q${x+12} 162 ${x+20} 160" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/><path d="M${x+36} 262 V178" stroke="rgba(0,0,0,.25)" stroke-width="3"/><path d="M${x+20} 168 V262" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>`).join("")}\n <path id="${p}crack"'),
('<rect class="hl" x="184" y="126" width="196" height="22" rx="2" fill="#5d6b75" stroke="var(--line)"/>\n <g stroke="rgba(255,255,255,.35)">${Array.from({length:24},(_,i)=>`<line x1="${188+i*8}" y1="128" x2="${188+i*8}" y2="146"/>`).join("")}</g>',
 '<rect class="hl" x="184" y="126" width="196" height="22" rx="2" fill="#5f686d" stroke="#3b4247"/><rect x="186" y="128" width="192" height="18" fill="url(#zFins)"/>${Array.from({length:12},(_,i)=>`<rect x="${190+i*16}" y="130" width="8" height="14" rx="3" fill="url(#zSteel)" opacity=".8"/>`).join("")}'),
('fill="#e9ecee">SECONDARY HX</text>','fill="#1d2327">SECONDARY HX</text>'),
# burners
('${[206,256,306,356].map(x=>`<rect x="${x-10}" y="280" width="20" height="12" rx="2" fill="#7a8288" stroke="var(--line)"/>`).join("")}\n <rect x="186" y="292" width="200" height="7" rx="2" fill="#9aa1a8" stroke="var(--line)"/>',
 '${[206,256,306,356].map(x=>`<rect x="${x-10}" y="280" width="20" height="12" rx="3" fill="url(#zSteel)" stroke="#4d555a"/><ellipse cx="${x}" cy="281" rx="7" ry="2" fill="#1b1f22"/>`).join("")}\n <rect x="186" y="292" width="200" height="8" rx="3" fill="url(#zSteelH)" stroke="#4d555a"/>${[206,256,306,356].map(x=>zHex(x,296,3.4)).join("")}'),
('<rect x="168" y="272" width="10" height="10" fill="#d8dcdf" stroke="var(--line)"/>','<rect x="166" y="272" width="12" height="10" rx="1.5" fill="#efe9dc" stroke="#8f887a"/>'),
('<circle class="hl" cx="172" cy="296" r="6" fill="#c9cfd4" stroke="var(--line)"/>','<circle class="hl" cx="172" cy="296" r="6.5" fill="url(#zSteel)" stroke="#4d555a"/>'),
('<rect class="hl" x="352" y="296" width="24" height="12" rx="2" fill="#c9cfd4" stroke="var(--line)"/>','<rect class="hl" x="352" y="296" width="24" height="12" rx="2" fill="url(#zSteel)" stroke="#4d555a"/>'),
('<text class="tag" x="364" y="318" text-anchor="middle" fill="var(--muted)">LIMIT</text>','<text class="zt" x="364" y="318" text-anchor="middle">LIMIT</text>'),
# gas
('<path d="M500 300 H436" stroke="#3a3f44" stroke-width="8" fill="none"/><path d="M470 300 V330" stroke="#3a3f44" stroke-width="8"/>\n <rect class="hl" x="476" y="288" width="16" height="12" fill="#e8c33a" stroke="var(--line)"/>',
 '<path d="M500 300 H436" stroke="#14171a" stroke-width="10" fill="none"/><path d="M500 300 H436" stroke="#3a3f44" stroke-width="7" fill="none"/><path d="M500 298 H436" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/><path d="M470 300 V332" stroke="#14171a" stroke-width="10"/><path d="M470 300 V332" stroke="#3a3f44" stroke-width="7"/><rect x="464" y="330" width="12" height="6" rx="2" fill="#2a2f33"/>\n ${zHex(484,300,8,"url(#zBrass)")}<rect class="hl" x="476" y="286" width="16" height="6" rx="2" fill="#e8c33a" stroke="#6a4a12"/>'),
('<rect class="hl" x="396" y="284" width="40" height="28" rx="4" fill="#2f3337" stroke="var(--line)"/>','<rect class="hl" x="396" y="284" width="40" height="28" rx="3" fill="url(#zAlu)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="400" y="288" width="22" height="20" rx="2" fill="url(#zPlasticDk)"/><circle cx="430" cy="290" r="2.4" fill="url(#zScrew)"/><circle cx="430" cy="306" r="2.4" fill="url(#zScrew)"/>'),
('<circle id="${p}gvLamp" cx="416" cy="298" r="4"','<circle id="${p}gvLamp" cx="411" cy="298" r="4"'),
('<path id="${p}gasPipe" d="M396 296 H386" stroke="#3a3f44" stroke-width="6"/>','<path id="${p}gasPipe" d="M396 296 H380" stroke="url(#zSteelH)" stroke-width="6"/>'),
('<text class="tag" x="484" y="282" text-anchor="middle" fill="var(--muted)">SHUTOFF</text>','<text class="tag" x="484" y="278" text-anchor="middle" fill="var(--muted)">SHUTOFF</text>'),
# vent + inducer + ps
('<path d="M376 160 H392" stroke="var(--line)" stroke-width="10"/>','<path d="M376 160 H392" stroke="url(#zSteelH)" stroke-width="10"/>'),
('<rect id="${p}vent" class="hl" x="396" y="8" width="18" height="106" fill="#b9c0c6" stroke="var(--line)"/>','<rect id="${p}vent" class="hl" x="396" y="8" width="18" height="106" fill="#b9c0c6" stroke="#5f686d"/><rect x="398" y="8" width="4" height="106" fill="rgba(255,255,255,.5)"/><rect x="409" y="8" width="5" height="106" fill="rgba(0,0,0,.18)"/>${[30,60,90].map(y=>`<rect x="394" y="${y}" width="22" height="4" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".5"/>`).join("")}'),
('<circle class="hl" cx="405" cy="140" r="20" fill="#9aa1a8" stroke="var(--line)"/>','<path d="M405 118 A22 22 0 1 1 383 140 H392 V118 Z" fill="url(#zSteelH)" stroke="#4d555a" filter="url(#zShadow)"/><circle class="hl" cx="405" cy="140" r="18" fill="url(#zInside)" stroke="#2a2f33"/><rect x="420" y="128" width="14" height="24" rx="3" fill="url(#zMotor)" stroke="#111"/>'),
('<g id="${p}indB" stroke="var(--ink)" stroke-width="2">','<g id="${p}indB" stroke="#c4cacf" stroke-width="2.4">'),
('<text class="tag" x="436" y="140" fill="var(--muted)">INDUCER</text>','<text class="tag" x="440" y="140" fill="var(--muted)">INDUCER</text>'),
('<circle class="hl" cx="342" cy="108" r="10" fill="#e9ecee" stroke="var(--line)"/>','<circle class="hl" cx="342" cy="108" r="10" fill="url(#zAluTop)" stroke="#5f686d" filter="url(#zShadow)"/>'),
('<path d="M386 140 C370 140 364 118 352 112" stroke="#2f3337" stroke-width="2" fill="none"/>','<path d="M386 140 C370 140 364 118 352 112" stroke="#14171a" stroke-width="3" fill="none"/>'),
('<text class="tag" x="342" y="96" text-anchor="middle" fill="var(--muted)">PRESS. SW</text>','<text class="zt" x="342" y="94" text-anchor="middle">PRESS. SW</text>'),
('<text class="val" id="${p}draftTxt" x="436" y="154" font-size="9">','<text class="val" id="${p}draftTxt" x="440" y="158" font-size="9">'),
]
for a,b in R:
    assert a in s,a[:100]
    s=s.replace(a,b)
open('furnace.js','w').write(s)
