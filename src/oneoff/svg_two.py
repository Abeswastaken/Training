s=open('boiler_rz.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,a[:90]
    s=s.replace(a,b)
rep('''  <path id="s_retA" d="M760 92 V436 H405 V299 H370" class="pipe" stroke="#6b8fc9"/>
  <path id="s_retB" d="M760 92 V436 H405 V392 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_fRet" d="M760 92 V436 H405 V299 H370" class="flow"/>
  <text class="lbl" x="560" y="428">Wet return</text>''','''  <path id="s_retA" d="M760 92 V436 H405 V299 H370" class="pipe" stroke="#6b8fc9"/>
  <path id="s_retB" d="M760 92 V436 H405 V392 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_retA2" d="M760 92 V364 H470 V436 H405 V299 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_retB2" d="M760 92 V364 H470 V436 H405 V392 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_fRet" d="M760 92 V436 H405 V299 H370" class="flow"/>
  <text class="lbl" id="s_wetLbl" x="560" y="428">Wet return</text>''')
rep('''<g class="part" data-p="mainvent" tabindex="0">''','''<g class="part" data-p="mainvent" tabindex="0" id="s_mvG">''')
rep('''  ${bzVentCap(567,270,10,13)}${bzVentCap(715,270,10,13)}
  <text class="lbl" x="492" y="272">Radiator</text>
</g>''','''  <g id="s_radVents">${bzVentCap(567,270,10,13)}${bzVentCap(715,270,10,13)}</g>
  <text class="lbl" x="492" y="272">Radiator</text>
</g>
<!-- two-pipe parts: supply valves, radiator traps, F&T trap at the end of the main, dry return and its vent -->
<g id="s_two" opacity="0">
 <text class="lbl" x="560" y="388">Dry return</text>
 <text class="tag" x="474" y="430" fill="var(--muted)">WET RETURN</text>
 ${[480,628].map(x=>`<rect x="${x-6}" y="300" width="12" height="16" rx="2" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".8"/><path d="M${x} 300 V292" stroke="#4d555a" stroke-width="2"/><ellipse cx="${x}" cy="291" rx="8" ry="2.6" fill="url(#bzRed)" stroke="#5a1410" stroke-width=".6"/>`).join("")}
 <text class="tag" x="472" y="286" text-anchor="end" fill="var(--muted)">SUPPLY</text><text class="tag" x="472" y="296" text-anchor="end" fill="var(--muted)">VALVE</text>
</g>
<g class="part" data-p="trap" tabindex="0" id="s_trapG" opacity="0">
 ${[566,714].map((x,i)=>`<path d="M${x} 342 H${x+12} V364" class="pipe" stroke="#6b8fc9" stroke-width="5"/><rect class="hl" x="${x+4}" y="334" width="16" height="16" rx="7" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1" filter="url(#zShadow)"/><rect x="${x+8}" y="330" width="8" height="5" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".6"/><circle id="s_trap${i}" cx="${x+12}" cy="342" r="3" fill="var(--lamp-off)" stroke="#000" stroke-width=".5"/>`).join("")}
 <text class="tag" x="740" y="331" fill="var(--muted)">TRAP</text>
</g>
<g class="part" data-p="ft" tabindex="0" id="s_ftG" opacity="0">
 <rect class="hl" x="746" y="296" width="28" height="34" rx="5" fill="url(#zShell)" stroke="#111" stroke-width="1.1" filter="url(#zShadow)"/>
 <circle id="s_ftLamp" cx="760" cy="313" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".5"/>
 <text class="tag" x="778" y="304" fill="var(--muted)">F&amp;T</text><text class="tag" x="778" y="314" fill="var(--muted)">TRAP</text>
</g>
<g class="part" data-p="rvent" tabindex="0" id="s_rvG" opacity="0">
 <path d="M470 364 V350" class="pipe" stroke="#9aa3a9" stroke-width="4"/>
 ${bzVentCap(470,336,12,15)}
 <g id="s_rvPuff" opacity="0" fill="var(--paper)" stroke="var(--muted)"><circle cx="470" cy="326" r="4"/><circle cx="478" cy="318" r="3"/></g>
 <text class="tag" x="484" y="346" fill="var(--muted)">RETURN VENT</text>
</g>''')
open('boiler_rz.js','w').write(s)
