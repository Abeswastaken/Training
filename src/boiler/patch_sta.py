# ---- steam: counterflow / parallel-flow one-pipe main, gravity return label, and the Steam stations tab ----
B('<path d="M370 80 L760 92" class="pipe" stroke="var(--line)"/>','''<path id="s_mainPipe" d="M370 80 L760 92" class="pipe" stroke="var(--line)"/>
<g id="s_pitchPar" fill="var(--muted)" stroke="none">${[430,560,690].map(x=>`<path d="M${x} ${66+(x-370)*0.031} l14 0.4 l-4 -4 m4 4 l-4 4" stroke="var(--muted)" stroke-width="1.6" fill="none"/>`).join("")}<text class="tag" x="380" y="36" fill="var(--muted)">PARALLEL FLOW: MAIN PITCHES DOWN, CONDENSATE FLOWS WITH THE STEAM</text></g>
<g id="s_pitchCnt" opacity="0">${[430,560,690].map(x=>`<path d="M${x+14} ${100-(x-370)*0.031} l-14 0.4 l4 -4 m-4 4 l4 4" stroke="var(--cold)" stroke-width="1.6" fill="none"/>`).join("")}<text class="tag" x="380" y="36" fill="var(--cold)">COUNTERFLOW: MAIN PITCHES UP, CONDENSATE RUNS BACK TO THE BOILER</text></g>''')
B('<text class="lbl" id="s_wetLbl" x="560" y="428">Wet return</text>','<text class="lbl" id="s_wetLbl" x="560" y="428">Wet return (gravity)</text>')
B("""{l:S=>`Piping: ${S.two?"two-pipe (traps)":"one-pipe"}`,""","""{l:S=>`One-pipe main: ${S.cnt?"counterflow":"parallel flow"}`,on:S=>!!S.cnt,act(sim){if(sim.S.two){log(sim,"Counterflow and parallel flow are one-pipe main layouts. Set Piping to one-pipe first.");return}sim.S.cnt=!sim.S.cnt;log(sim,sim.S.cnt?"Counterflow main: it pitches up away from the boiler, so condensate runs back toward the boiler against the steam and drops down the header drip. No return line from the end of the main. The main must be oversized and well pitched (often 1/2 in per foot or more) so water isn't picked up by the steam: banging means it is.":"Parallel-flow main: it pitches down away from the boiler. Steam and condensate travel the same way to the end of the main, where the condensate drops into the wet return and flows back to the boiler by gravity through the Hartford loop.")}},
  {l:S=>`Piping: ${S.two?"two-pipe (traps)":"one-pipe"}`,""")
B('at(p+"wetLbl","opacity",two?0:1);','''at(p+"wetLbl","opacity",two?0:1);
  {const cnt=!two&&S.cnt,d=cnt?"M370 92 L760 80":"M370 80 L760 92";[p+"mainPipe",p+"mainSteam"].forEach(k=>{const e=$(k);if(e&&e.getAttribute("d")!==d)e.setAttribute("d",d)});
   at(p+"pitchPar","opacity",!two&&!cnt?1:0);at(p+"pitchCnt","opacity",cnt?1:0);
   if(cnt){at(p+"retA","opacity",0);at(p+"retB","opacity",0);at(p+"wetLbl","opacity",0);const fr=$(p+"fRet");if(fr)fr.setAttribute("d","M760 80 L370 92 V299")}}''')
B("if(S.fs<1&&m>0){const vent=two?(1/200)*(tS?0.4:1)*(ftS?0.5:1):(F.mainVent?1/2400:1/200)*(rv?0.6:1);",
  "if(S.fs<1&&m>0){const vent=two?(1/200)*(tS?0.4:1)*(ftS?0.5:1):(F.mainVent?1/2400:1/200)*(rv?0.6:1)*(S.cnt?0.8:1);")
# Steam stations tab
B('<button id="simSteam" aria-pressed="false">Steam</button>','<button id="simSteam" aria-pressed="false">Steam</button>\n    <button id="simSta" aria-pressed="false">Steam stations</button>')
STA_HTML='''<section class="stations" id="stations" hidden aria-label="Steam stations">
  <div class="stBar"><div class="seg" role="group" aria-label="Station"><button data-sta="prv">PRV station</button><button data-sta="trap">Trap station</button><button data-sta="drip">Drip station</button></div>
   <div class="seg" role="group" aria-label="View"><button data-stv="2d">2D view</button><button data-stv="iso">Isometric</button></div></div>
  <div class="stGrid"><div class="stDraw"><div class="scroller"><svg id="stSvg" viewBox="0 0 800 450" role="img" aria-label="Station drawing"></svg></div>
   <p class="note" id="stFlow"></p>
   <div class="stTrapRow" id="stTrapRow"><span>Trap type</span><div class="seg" role="group" aria-label="Trap type"><button data-stt="ft">F&amp;T</button><button data-stt="ib">Inverted bucket</button><button data-stt="td">Thermodynamic</button></div></div></div>
   <div class="stSide"><h3>Parts (tap a number)</h3><ol class="stList" id="stList"></ol><div id="stExtra"></div>
    <p class="note">Drawn from typical manufacturer installation drawings. Learn more: <a href="https://www.spiraxsarco.com/learn-about-steam" target="_blank" rel="noopener">Spirax Sarco steam engineering tutorials</a>, <a href="https://www.tlv.com/global/US/steam-theory/" target="_blank" rel="noopener">TLV steam theory</a>, <a href="https://www.armstronginternational.com/" target="_blank" rel="noopener">Armstrong International</a>. Always follow the manufacturer's instructions for the valve or trap in front of you.</p></div></div>
</section>
'''
a='    <div class="tabpanel" id="p-log" role="tabpanel" hidden><div class="log" id="log" aria-live="polite"></div></div>\n  </div>\n</div>\n'
B(a,a+STA_HTML+'<script>\n'+open('stations.js').read()+'/* end stations */</script>\n')
STA_CSS='''
/* Steam stations tab */
.stations{display:flex;flex-direction:column;gap:10px}
.stBar{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center}
.stGrid{display:grid;gap:12px;align-items:start}.stGrid>*{min-width:0}@media (min-width:1000px){.stGrid{grid-template-columns:minmax(0,1fr) 340px}}
.stDraw,.stSide{background:var(--panel);border:1px solid var(--panel-edge);border-radius:8px;padding:10px}
.stDraw .scroller{overflow-x:auto;background:var(--paper);border-radius:6px}
#stSvg{display:block;width:100%;min-width:640px;height:auto}
.stTxt{font:600 10px var(--display);letter-spacing:.06em;fill:var(--ink);text-anchor:middle}
.isoP{fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.isoP.thin{stroke-width:1.6}.isoP.dash{stroke-width:1.4;stroke-dasharray:5 4}
.isoT{font:700 11px var(--display);fill:var(--ink);text-anchor:middle}
.sco{cursor:pointer}.sco circle{fill:var(--brass);stroke:var(--paper);stroke-width:2}.sco text{font:700 12px var(--display);fill:#fff;text-anchor:middle;pointer-events:none}
.sco.on circle,.sco:hover circle,.sco:focus-visible circle{fill:var(--hot)}
.stTrapRow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px}.stTrapRow span{font:600 13px var(--display);text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.stSide h3{font:700 15px var(--display);text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px;color:var(--brass)}
.stList{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.stItem{all:unset;box-sizing:border-box;cursor:pointer;display:block;width:100%;padding:7px 8px;border-radius:6px;background:var(--paper);border:1px solid var(--panel-edge);font-size:14px}
.stItem b{display:inline-block;min-width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:var(--brass);color:#fff;font-size:12px;margin-right:6px}
.stList li.on .stItem{border-color:var(--hot)}.stItem:focus-visible{outline:2px solid var(--brass)}
.stDet{padding:6px 8px 2px;font-size:14px}.stDet p{margin:0 0 6px}
'''
i=b.index('</style>');b=b[:i]+STA_CSS+b[i:]
