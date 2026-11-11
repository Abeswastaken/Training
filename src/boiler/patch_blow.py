# ---- Steam: bottom blowdown valve, boiler water solids (TDS), surging, and a result line under the check buttons ----
# Facts: bottom blowdown controls solids and sludge (R.F. MacDonald, National Board); makeup water concentrates solids,
# Weil-McLain SB-1102 says drain and refill above 1000 ppm TDS; foaming water surges and primes.
B('''<g id="s_svPuff" opacity="0"''','''<g class="part" data-p="bblow" tabindex="0">
  <rect class="hl" x="342" y="394" width="24" height="56" fill="transparent" stroke="none"/>
  <rect x="351.5" y="392" width="5" height="14" fill="url(#zSteel)"/>
  <rect x="346.5" y="404" width="15" height="11" rx="2" fill="url(#zBrass)" stroke="#6b5210" stroke-width=".8"/>
  <rect id="s_bbH" x="343" y="400.5" width="22" height="4" rx="1.5" fill="#c0281c" stroke="#5c120c" stroke-width=".6"/>
  <rect x="351.5" y="415" width="5" height="16" fill="url(#zSteel)"/>
  <rect x="344" y="446" width="20" height="6" fill="var(--line)"/>
  <g id="s_bbJet" opacity="0"><circle cx="354" cy="435" r="3"/><circle cx="350" cy="441" r="2.2"/><circle cx="358" cy="443" r="2.6"/></g>
  <text class="lbl" x="330" y="434" text-anchor="end" style="font-size:9px">Bottom blowdown</text>
</g>
<g id="s_svPuff" opacity="0"''')
B('''blow:0,feedValve:true,hartford:true,''','''blow:0,bb:0,topup:0,sol:null,sludge:.15,surge:false,feedValve:true,hartford:true,''')
B(''' init(){return Object.assign(baseState(),{two:true,Tw:195,P:0,''',''' onFault(k,on){if(k==="dirtyWater"){const S=this.S,w=S.L*this.consts.VB;S.sol=(on?1600:300)*w;S.sludge=on?1:.15;if(!on)S.surge=false}},
 tds(){const S=this.S,w=Math.max(1,S.L*this.consts.VB);if(S.sol==null)S.sol=300*w;return S.sol/w},
 init(){return Object.assign(baseState(),{two:true,Tw:195,P:0,''')
B('''["flameRod","Dirty flame rod"]],
 hidden:["lwco1Fail","lwco2Fail","hlFail","svStuck","feedFail","glassShut"],
 scenarios:[{l:"Overpressure''','''["flameRod","Dirty flame rod"],["dirtyWater","Dirty boiler water (high solids)"]],
 hidden:["lwco1Fail","lwco2Fail","hlFail","svStuck","feedFail","glassShut"],
 scenarios:[{l:"Overpressure''')
B('''  {id:"tcTop",l:"Try cock: top",''','''  {id:"bblow",l:"Bottom blowdown",show:S=>!S.dead,act(sim){const S=sim.S;if(S.bb>0)return;const t=Math.round(sim.tds());S.bb=10;S.bbFrom=t;
    log(sim,`Bottom blowdown: quick-opening valve open first, then the slow-opening valve. ${S.sludge>0.5?"Thick brown sludge":t>1000?"Dirty brown water":"Slightly cloudy water"} to the drain. Watch the gauge glass the whole time.`,S.sludge>0.5||t>1000?"w":"")}},
  {id:"tds",l:"Test the boiler water",show:S=>!S.dead,act(sim){const t=Math.round(sim.tds());log(sim,`Boiler water test: ${t} ppm total dissolved solids. `+(t>1000?"Over 1,000 ppm: blow down, or drain and refill, until it comes down. Find out why so much makeup water is going in.":t>700?"Getting high. Blow down and look for leaks or bad vents that are making the feeder run.":"Normal for a tight system."),t>1000?"w":"")}},
  {id:"tcTop",l:"Try cock: top",''')
B('''  S.feeding=add>0;w+=add;''','''  S.feeding=add>0;w+=add;
  /* water quality: steam leaves as pure water, so dissolved solids stay behind; every gallon of makeup brings more */
  {const tds=sim.tds();if(S.topup>0&&!(S.bb>0)){const tu=Math.min(S.topup,0.06*dt);S.topup-=tu;w+=tu;add+=tu}S.sol+=add*150;if(S.draining)S.sol-=0.03*dt*tds;
   if(S.bb>0){const dv=Math.min(Math.max(0,w-0.5),0.15*dt);w-=dv;S.sol-=dv*tds;S.topup=(S.topup||0)+dv;S.bb-=dt;
    if(S.bb<=0){S.bb=0;S.sludge*=0.3;log(sim,`Blowdown done: slow-opening valve shut first, then the quick-opening valve. About 1.5 gallons out at ${S.bbFrom} ppm. Topping back up to the water line by hand; the fresh water dilutes what is left.`)}}
   S.sol=Math.max(0,S.sol);const sg=S.boiling&&(S.surge?tds>900:tds>1000);
   if(sg&&!S.surge)log(sim,"The water line is bouncing in the gauge glass. Dirty water is foaming and surging: wet steam is carrying water into the main.","w");
   if(!sg&&S.surge&&tds<=900)log(sim,"Water line steady again.");S.surge=sg}''')
B('''const qrad=c.UAR*S.fs*Math.max(0,Ts-S.Troom)*(S.flood?0.5:1)''','''const qrad=c.UAR*S.fs*Math.max(0,Ts-S.Troom)*(S.flood?0.5:1)*(S.surge?0.8:1)''')
B('''const gl=F.glassShut?S.glassFrozen:S.L,gy=314''','''const gl=(F.glassShut?S.glassFrozen:S.L)+(S.surge&&!F.glassShut?0.07*Math.sin(performance.now()/230):0),gy=314''')
B('''  at(p+"blowJet","opacity",S.blow>0?(blink(120)?1:.5):0);''','''  at(p+"blowJet","opacity",S.blow>0?(blink(120)?1:.5):0);
  at(p+"bbJet","opacity",S.bb>0?(blink(120)?1:.5):0);at(p+"bbJet","fill",S.sludge>0.5||(S.bbFrom||0)>1000?"#7a5a2e":"var(--cold)");at(p+"bbH","transform",S.bb>0?"rotate(90 354 409.5)":"");
  at(p+"glassW","fill",this.tds()>1000?"#8a6a3a":"var(--cold)");''')
B('''  hartford:{n:"Hartford loop",''','''  bblow:{n:"Bottom blowdown valve",s:"Drains sludge and dirty water from the lowest point of the boiler.",w:"A drain at the lowest water point of the boiler, here teed into the bottom return tapping. Larger boilers use two valves in series: a quick-opening valve next to the boiler and a slow-opening valve after it. Open the quick-opening valve first and close it last, so the slow-opening valve takes the wear.",y:"Steam leaves the boiler as pure water, so the minerals in every gallon of makeup water stay behind and build up. Heavy solids settle to the bottom as sludge. A short bottom blowdown sends them to the drain. A tight heating system returns nearly all its condensate and needs very little; one that leaks or vents steam takes on makeup water and needs more.",f:"Too little: solids climb, the water foams and surges, the water line bounces in the glass and wet steam carries water into the main. Weil-McLain says to drain and refill a steam boiler when dissolved solids pass 1,000 ppm. Too much: every blowdown is replaced with fresh water, which brings in new minerals and oxygen that corrode the boiler. Never leave an open blowdown valve unattended, and keep the water in sight in the glass. This is a different job from blowing down the low water cutoff, which is done weekly to prove the cutoff works. Try Bottom blowdown and Test the boiler water in Controls.",src:["bbrf","bbnb","bbwm","bbhh"],faults:["dirtyWater"]},
  hartford:{n:"Hartford loop",''')
B('''const SRC={''','''const SRC={
  bbrf:["R.F. MacDonald: step-by-step boiler blowdown (valve order, never leave it unattended)","https://www.rfmacdonald.com/step-by-step-guide-to-boiler-blowdown/"],
  bbnb:["National Board: How to Destroy a Boiler, Part 3 (poor blowdown, water column blowdown)","https://www.nationalboard.org/Index.aspx?pageID=244"],
  bbwm:["Weil-McLain SB-1102: steam boiler water treatment (1,000 ppm TDS, drain and refill, foaming)","https://www.weil-mclain.com/wp-content/uploads/sb-1102-steam-boiler-water-treatment_1.pdf"],
  bbhh:["HeatingHelp: Nature of the New Steam Beast (makeup water and corrosion)","https://heatinghelp.com/systems-help-center/nature-of-the-new-steam-beast/"],''')
B('''  {id:"blow",l:"Blow down LWCO",''','''  {id:"blow",l:"Blow down the LWCO",''')
# result line under the check buttons, same as the framework trainers
B('''join("")}</div></div>
   <div class="group"><h3>Settings</h3>''','''join("")}</div><div id="actRes" class="actRes" role="status" aria-live="polite" hidden></div></div>
   <div class="group"><h3>Settings</h3>''')
B('''if(t.dataset.act){cur.actions.find(a=>a.id===t.dataset.act).act(cur);return}''','''if(t.dataset.act){const a=cur.actions.find(x=>x.id===t.dataset.act),n0=cur.logs.length,top=cur.logs[0];a.act(cur);const e=cur.logs[0]!==top||cur.logs.length!==n0?cur.logs[0]:null,r=$("actRes");
    if(r){r.className="actRes"+(e&&e[2]==="w"?" w":"");r.innerHTML=`<b>${a.l}</b><span>${e?e[1]:"Done. Watch the drawing."}</span>`;r.hidden=false;r.classList.remove("flash");void r.offsetWidth;r.classList.add("flash")}return}''')
_css=open('../base.css').read();_css=_css[_css.index('/* Result of a check button'):]
B('.mystery{font-size:14px;color:var(--bad);font-weight:600}','.mystery{font-size:14px;color:var(--bad);font-weight:600}\n'+_css)
