s=open('app.js').read()
a=s.index('function wiSvg(p,lt){')
b=s.index('</g>`}',a)
w=s[a:b]
R=[
('fill="var(--panel)" fill-opacity=".5" stroke="var(--line)" stroke-width="9"/>','fill="url(#zCabIn)" fill-opacity=".35" stroke="url(#zSteelH)" stroke-width="9"/>'),
('<g fill="var(--plate)" stroke="var(--line)"><rect x="96" y="330" width="170" height="5"/><rect x="96" y="390" width="170" height="5"/>','<rect x="96" y="330" width="170" height="5" fill="url(#zSteelH)" stroke="#5f686d"/><rect x="96" y="390" width="170" height="5" fill="url(#zSteelH)" stroke="#5f686d"/><g fill="url(#zTan)" stroke="#7d6b45" filter="url(#zShadow)">'),
(''' <rect class="hl body" x="34" y="146" width="44" height="46" rx="6"/>
 <text class="val" id="${p}tstatTxt" x="56" y="172" text-anchor="middle">35</text>
 <circle id="${p}tstatLamp" cx="56" cy="182" r="3" fill="var(--lamp-off)"/>''','${zTstat(34,144,44,50,p+"tstatTxt",p+"tstatLamp","35")}'),
('<rect id="${p}doorC" x="15" y="252" width="11" height="188" rx="2" fill="#c9cfd4" stroke="var(--line)"/>','<rect id="${p}doorC" x="15" y="252" width="11" height="188" rx="2" fill="url(#zSteel)" stroke="#5f686d"/>'),
('<polygon id="${p}doorO" points="21,252 64,266 64,426 21,440" fill="#c9cfd4" stroke="var(--line)" opacity="0"/>','<polygon id="${p}doorO" points="21,252 64,266 64,426 21,440" fill="url(#zSteel)" stroke="#5f686d" opacity="0"/>'),
('<rect x="160" y="50" width="214" height="72" rx="4" fill="var(--plate)" stroke="var(--line)" stroke-width="1.2"/>','<rect x="160" y="50" width="214" height="72" rx="4" fill="url(#zSteelH)" stroke="#5f686d" stroke-width="1.2" filter="url(#zShadow)"/>'),
('<circle cx="${x}" cy="87" r="22" fill="#3a3f44" stroke="var(--line)"/><g id="${p}eb${i}" fill="#9aa3aa">','<circle cx="${x}" cy="87" r="23" fill="url(#zInside)" stroke="#2a2f33"/><circle cx="${x}" cy="87" r="22" fill="url(#zGrille)" opacity=".5"/><g id="${p}eb${i}" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".5">'),
('<rect x="305" y="60" width="48" height="54" fill="url(#${p}gEvap)"/>','<rect x="303" y="58" width="52" height="58" fill="url(#zFins)"/>${Array.from({length:6},(_,i)=>`<rect x="${306+i*8.4}" y="60" width="4.6" height="54" rx="2" fill="url(#${p}gEvap)"/>`).join("")}'),
('<rect class="body" x="318" y="142" width="22" height="16" rx="3" fill="var(--brass)"/>','<rect x="318" y="142" width="22" height="16" rx="3" fill="url(#zBrass)" stroke="#5e400e"/><path d="M320 142 V136 Q329 128 338 136 V142 Z" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".7"/>'),
('<rect x="352" y="143" width="22" height="14" rx="2" fill="var(--brass)" stroke="var(--line)"/>\n <rect x="354" y="126" width="18" height="18" rx="2" fill="#2f3337"/>','<rect x="352" y="143" width="22" height="14" rx="2" fill="url(#zBrassH)" stroke="#5e400e"/>\n <rect x="354" y="126" width="18" height="18" rx="2" fill="url(#zPlasticDk)" stroke="#000"/>'),
('<rect x="446" y="176" width="330" height="264" rx="6" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>\n<text class="lblS" x="454" y="192">Condensing unit</text>','<rect x="446" y="176" width="330" height="264" rx="5" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="452" y="182" width="318" height="252" rx="2" fill="url(#zCabIn)" stroke="#9aa3a9"/>\n<text class="zl" x="454" y="196">Condensing unit</text>'),
('<rect x="462" y="198" width="88" height="88" rx="3" fill="var(--paper)" stroke="var(--line)" opacity=".7"/>','<rect x="462" y="200" width="88" height="86" rx="2" fill="url(#zSteelH)" stroke="#6f787e"/>'),
(''' <rect class="hl body" x="468" y="206" width="34" height="44" rx="3"/>
 <rect id="${p}contBar" x="472" y="216" width="26" height="6" fill="var(--muted)"/>
 <circle id="${p}contLamp" cx="485" cy="238" r="4" fill="var(--lamp-off)"/>
 <text class="tag" x="485" y="262" text-anchor="middle" fill="var(--muted)">CONTACTOR</text>''','${zContactor(468,206,34,44,p+"contBar",p+"contLamp",218)}<text class="zt" x="485" y="262" text-anchor="middle">CONTACTOR</text>'),
('<circle class="hl" cx="527" cy="228" r="17" fill="#f4f4f0" stroke="var(--line)"/>','<circle cx="527" cy="228" r="20" fill="url(#zPlasticDk)"/><circle class="hl" cx="527" cy="228" r="17" fill="url(#zPlastic)" stroke="#8f887a"/>'),
('<line id="${p}tHand" x1="527" y1="228" x2="527" y2="214" stroke="var(--ink)"','<line id="${p}tHand" x1="527" y1="228" x2="527" y2="214" stroke="#1d2327"'),
('<text class="tag" x="527" y="276" text-anchor="middle" fill="var(--muted)">TIMER</text>','<text class="zt" x="527" y="276" text-anchor="middle">TIMER</text>'),
('<text class="val" id="${p}dTxt" x="608" y="250" font-size="11">','<text class="valD" fill="#1d2327" id="${p}dTxt" x="608" y="250">'),
('''<rect x="730" y="205" width="28" height="191" fill="url(#${p}gCond)"/>
 <g stroke="rgba(255,255,255,.35)" stroke-width="1">${[0,1,2,3,4,5,6,7,8].map(i=>`<line x1="730" y1="${222+i*20}" x2="758" y2="${222+i*20}"/>`).join("")}</g>''','<rect x="726" y="202" width="36" height="196" fill="url(#zFins)"/>${Array.from({length:20},(_,i)=>`<rect x="729" y="${206+i*9.6}" width="30" height="4.6" rx="2" fill="url(#${p}gCond)"/>`).join("")}'),
('<rect class="hl" x="724" y="200" width="40" height="200" rx="3" fill="#5d6b75" stroke="var(--line)"/>','<rect class="hl" x="724" y="200" width="40" height="200" rx="2" fill="#5f686d" stroke="#3b4247"/>'),
(''' <rect class="hl body" x="640" y="160" width="120" height="14" rx="3"/>
 <ellipse id="${p}fb1" cx="700" cy="167" rx="40" ry="4" fill="var(--muted)"/>''','${zFanTop(640,160,120,14,p+"fb1",700,167,p+"fanB")}'),
('<rect class="hl" x="650" y="408" width="112" height="28" rx="13" fill="#7c858c" stroke="var(--line)"/>','<rect class="hl" x="650" y="408" width="112" height="28" rx="13" fill="url(#zSteelH)" stroke="#4d555a" filter="url(#zShadow)"/>'),
(''' <rect class="hl" x="560" y="290" width="80" height="110" rx="30" fill="#30363b" stroke="var(--line)" stroke-width="1.5"/>''','${zCompressor(560,286,80,104)}<rect x="566" y="308" width="68" height="76" rx="4" fill="rgba(14,17,19,.78)" stroke="#5f686d" stroke-width=".8"/>'),
('<rect class="hl" x="470" y="318" width="52" height="32" rx="3" fill="var(--plate)" stroke="var(--line)"/>','<rect class="hl" x="470" y="318" width="52" height="32" rx="3" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>'),
('<text class="tag" x="496" y="312" text-anchor="middle" fill="var(--muted)">PRESSURE CONTROL</text>','<text class="zt" x="496" y="312" text-anchor="middle">PRESSURE CONTROL</text>'),
('<text class="val" id="${p}slTxt" x="452" y="392" font-size="11">','<text class="valD" fill="#1d2327" id="${p}slTxt" x="456" y="392">'),
('<text class="val" id="${p}llTxt" x="452" y="414" font-size="11">','<text class="valD" fill="#1d2327" id="${p}llTxt" x="456" y="414">'),
(''' <rect class="hl" x="548" y="438" width="36" height="16" rx="7" fill="#2f6a8f" stroke="var(--line)"/>
 <rect id="${p}drierFrost" x="548" y="438" width="36" height="16" rx="7" fill="var(--ice)" opacity="0"/>''','${zDrier(548,438,36,16,p+"drierFrost")}'),
('<circle class="hl" cx="500" cy="446" r="10" fill="var(--paper)" stroke="var(--brass)" stroke-width="3"/>','${zHex(500,446,13)}<circle class="hl" cx="500" cy="446" r="9" fill="#eef6fb" stroke="#5e400e" stroke-width="1.2"/>'),
]
for x,y in R:
    assert x in w,x[:90]
    w=w.replace(x,y)
g0=w.index('<!-- gauges -->');g1=w.index('</g>',w.index('HIGH SIDE</text>',g0))+4
w=w[:g0]+open('wi_gauges.txt').read()+w[g1:]
s=s[:a]+w+s[b:]
open('app.js','w').write(s)
