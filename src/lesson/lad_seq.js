/* ============ Lesson: Following a sequence of operation ============ */
(()=>{
/* timing from a Bryant 383KAV-style hot surface ignition furnace: prepurge 15 s, igniter warm-up 17 s, trial for ignition about 5 s, 2 s flame sensing, blower on 45 s after flame, 5 s post-purge, up to 4 tries then lockout.
 The pressure switch closing about 2 s after the inducer starts is this drawing's assumption. */
const PS_T=2,PURGE=15,WARM=17,TRIAL=5,SENSE=2,BLW=45,POST=5,TRIES=4,TRY=PURGE+WARM+TRIAL+SENSE;
const model=S=>{const t=S.t,W=!!S.w;const R={t,W,ind:false,ps:false,ign:false,gv:false,flame:false,proven:false,blw:false,tries:0,lock:false,step:"Standby",td1:false,trial:false};
 if(!W)return R;
 if(S.lim){R.ind=true;R.ps=!S.ps;R.blw=true;R.step="Limit open: no gas, blower and inducer run";R.limOpen=true;return R}
 R.ind=true;if(S.ps){R.step="Inducer running, waiting for the pressure switch";return R}
 R.ps=t>=PS_T;if(!R.ps){R.step="Inducer starting";return R}
 for(let k=0;k<TRIES;k++){const ts=PS_T+k*TRY;if(t<ts)break;R.tries=k+1;const dt=t-ts;
  const lit=!S.ign;/* gas lights only if the igniter got hot */
  const proveOk=lit&&!S.dirty;
  if(dt<PURGE){R.step="Prepurge (inducer clears the heat exchanger)";return R}
  R.td1=true;R.tEnd=false;
  if(dt<PURGE+WARM){R.hsr=true;R.ign=!S.ign;R.step=S.ign?"Igniter warm-up: igniter not glowing":"Igniter warm-up";return R}
  if(dt<PURGE+WARM+TRIAL){R.hsr=true;R.ign=!S.ign;R.gv=true;R.trial=true;R.flame=lit;R.step="Trial for ignition: gas valve open";return R}
  R.tEnd=true;if(dt<TRY){R.gv=true;R.flame=lit;R.trial=true;R.step="Flame sensing";return R}
  if(proveOk){const tp=ts+TRY;R.gv=true;R.flame=true;R.proven=true;R.blw=t>=tp+BLW;R.step=R.blw?"Heating: blower on":`Flame proven, blower delay (${Math.ceil(tp+BLW-t)} s)`;R.tdB=R.blw;return R}
  /* flame not proven: gas valve closes and the board tries again */
  if(k===TRIES-1){const tl=ts+TRY;R.lock=true;R.ind=t<tl+POST;R.ps=R.ind;R.step=R.ind?"Lockout: post-purge":"Lockout (resets after power off, or on its own after a few hours)";return R}}
 return R};
/* ---------- furnace drawing, x 10..290 ---------- */
const furnace=(R,S,ox=10,oy=40)=>{let s=`<g transform="translate(${ox} ${oy})">`;
 s+=rBox(10,10,250,350,14,"cab")+`<rect x="22" y="22" width="226" height="326" fill="url(#zInside)" opacity=".55"/>`;
 /* vent pipe and inducer */
 s+=`<rect x="190" y="-30" width="26" height="70" fill="url(#zSteelH)" stroke="#4d555a"/>`+`<path d="M196 -26 v-8 m14 8 v-8" stroke="#e0662a" stroke-width="2" stroke-dasharray="3 3" opacity="${R.ind?1:0}"/>`;
 s+=`<rect x="168" y="38" width="66" height="44" rx="10" fill="url(#zSteel)" stroke="#4d555a"/><circle cx="201" cy="60" r="16" fill="url(#zMotor)" stroke="#111"/>`+(R.ind?`<circle cx="201" cy="60" r="20" fill="none" stroke="${LD.HOT}" stroke-width="2" class="lsPulse"/>`:"");
 s+=`<g transform="translate(118 44)">${zPswitch(0,0,"sqPs")}</g>`+rHose("M130 68 C130 90 170 92 172 76","#2a2f33",2.4);
 s+=`<circle cx="130" cy="54" r="4" fill="${R.ps?"#2fbf5a":"var(--lamp-off)"}"/>`;
 /* burners */
 s+=`<rect x="34" y="110" width="200" height="70" rx="4" fill="#2a2f33" stroke="#111"/>`;
 for(let i=0;i<4;i++){const y=124+i*14;s+=rCylH(70,226,y,4,"galv");if(R.flame)s+=`<path d="M226 ${y} q10 -6 22 0 q-10 6 -22 0z" fill="#5aa0ff" opacity=".85"/>`}
 s+=`<rect x="56" y="118" width="12" height="54" fill="url(#zSteel)"/>`;
 /* igniter and flame sensor */
 s+=`<rect x="226" y="104" width="22" height="8" rx="2" fill="${R.ign?"#ff8a1f":"#5a5f62"}" stroke="#222"/>`+(R.ign?`<rect x="222" y="100" width="30" height="16" rx="6" fill="#ffb347" opacity=".45" class="lsPulse"/>`:"")+`<path d="M232 186 l14 -8" stroke="#c9ced1" stroke-width="3"/>`;
 /* gas valve and pipe */
 s+=`<rect x="-6" y="138" width="44" height="10" fill="url(#zSteel)"/>`+rBox(18,128,30,32,6,"black")+`<circle cx="33" cy="138" r="3.4" fill="${R.gv?"#2fbf5a":"var(--lamp-off)"}"/>`;
 /* control board and limit */
 s+=`<rect x="40" y="200" width="110" height="56" rx="4" fill="#2f6b3a" stroke="#173a1e"/>`+[0,1,2,3,4].map(i=>`<rect x="${50+i*18}" y="236" width="10" height="12" fill="#1d2124"/>`).join("")+`<circle cx="134" cy="212" r="4" fill="${R.lock?"#d0312d":R.W?"#2fbf5a":"#4b555b"}"/>`+`<text x="95" y="222" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="9" fill="#d9f2dc">CONTROL</text>`;
 s+=`<circle cx="196" cy="214" r="10" fill="url(#zSteel)" stroke="${S.lim&&!S.hide?"var(--bad)":"#333"}" stroke-width="${S.lim&&!S.hide?3:1}"/>`;
 /* blower */
 s+=`<rect x="22" y="268" width="226" height="80" fill="url(#zInside)" opacity=".5"/>`+zBlower(135,312,30,"sqBl");
 if(R.blw)s+=rArr("M60 280 V250","#e0662a")+rArr("M210 280 V250","#e0662a");
 s+=`</g>`;
 s+=LD.co(ox+211,oy+60,ox+170,oy+10,"INDUCER",{a:"end",size:11})+LD.co(ox+130,oy+52,ox+70,oy+28,"PRESS. SW",{a:"end",size:11})+LD.co(ox+40,oy+150,ox+18,oy+194,"GAS VALVE",{a:"start",size:11})+LD.co(ox+250,oy+108,ox+282,oy+96,"IGNITER",{a:"start",size:11})+LD.co(ox+244,oy+180,ox+282,oy+206,"FLAME SENSOR",{a:"start",size:11})+LD.co(ox+196,oy+214,ox+282,oy+238,"LIMIT",{a:"start",size:11})+LD.co(ox+165,oy+312,ox+282,oy+330,"BLOWER",{a:"start",size:11});
 return s};
/* ---------- ladder, x 400..740 ---------- */
const ladder=(R,S,o={})=>{const X1=o.x1??398,X2=o.x2??735;let s="";const live=!o.paper;if(o.paper){S={w:false,t:0};R=model(S)}
 const yl=k=>62+k*40,yv=k=>238+k*56;
 s+=LD.rails(X1,X2,40,yl(3)+12,{l:"L1 120 V",r:"N",live});
 const rr=(i,y,parts,xref,sw=78)=>LD.rung({x1:X1,x2:X2,y,parts,live,num:i,xref,side:true,sw,lw:sw<70?76:84}).s;
 s+=rr(1,yl(0),[{k:"no",tag:"IR",closed:R.ind},{k:"motor",lbl:"INDUCER"}]);
 s+=rr(2,yl(1),[{k:"no",tag:"HSR",closed:!!R.hsr},{k:"heat",lbl:"IGNITER",dead:S.ign}]);
 s+=rr(3,yl(2),[{k:"no",tag:"BR",closed:R.blw},{k:"motor",lbl:"BLOWER"}]);
 s+=rr(4,yl(3),[{k:"xfmr",lbl:"T1"}]);
 s+=LD.rails(X1,X2,yv(0)-26,yv(3)+22,{l:"R 24 V",r:"C",live});
 s+=rr(5,yv(0),[{k:"sw",lbl:"T'STAT W",closed:R.W},{k:"nc",tag:"LOCKOUT",closed:!(R.lock&&!R.ind)},{k:"coil",tag:"IR"}],[[1]]);
 s+=rr(6,yv(1),[{k:"psno",lbl:"PRESS SW",closed:R.ps,bad:S.ps&&R.W},{k:"td",tag:"PURGE",closed:R.td1},{k:"tdnc",tag:"TRIAL END",closed:!R.tEnd},{k:"coil",tag:"HSR"}],[[2]]);
 s+=rr(7,yv(2),[{k:"psno",lbl:"PRESS SW",closed:R.ps},{k:"ts",lbl:"LIMIT",closed:!S.lim,bad:S.lim},{k:"ts",lbl:"ROLLOUT",closed:true},{k:"no",tag:"TRY",closed:R.gv},{k:"valve",lbl:"GV"}],null,60);
 s+=rr(8,yv(3),[{k:"fs",lbl:"FLAME",closed:R.proven||!!R.limOpen,sub:R.limOpen?"(LIMIT TRIP)":""},{k:"td",lbl:"45 S DELAY",closed:R.blw},{k:"coil",tag:"BR"}],[[3]]);
 return s};
/* phase bar under the furnace */
const bar=(R,S,x=20,y=430,w=330)=>{const T=180,X=t=>x+t/T*w;let s=`<rect x="${x}" y="${y-10}" width="${w}" height="14" rx="3" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 if(S.w&&!S.ps&&!S.lim){const tries=S.dirty||S.ign?TRIES:1;for(let k=0;k<tries;k++){const ts=PS_T+k*TRY;s+=`<rect x="${X(ts)}" y="${y-10}" width="${X(ts+PURGE)-X(ts)}" height="14" fill="#9aa5ab" opacity=".6"/><rect x="${X(ts+PURGE)}" y="${y-10}" width="${X(ts+PURGE+WARM)-X(ts+PURGE)}" height="14" fill="#ff8a1f" opacity=".7"/><rect x="${X(ts+PURGE+WARM)}" y="${y-10}" width="${X(ts+TRY)-X(ts+PURGE+WARM)}" height="14" fill="#2f6fd6" opacity=".75"/>`}
  if(!(S.dirty||S.ign)){const tp=PS_T+TRY;s+=`<rect x="${X(tp)}" y="${y-10}" width="${X(tp+BLW)-X(tp)}" height="14" fill="#5aa0ff" opacity=".35"/><rect x="${X(tp+BLW)}" y="${y-10}" width="${X(T)-X(tp+BLW)}" height="14" fill="#e0662a" opacity=".6"/>`}}
 s+=`<path d="M${X(Math.min(S.t,T))} ${y-16} V${y+8}" stroke="var(--ink)" stroke-width="3"/>`+LD.T(x,y+20,"0 S",{size:10,a:"start",fill:"var(--muted)"})+LD.T(x+w,y+20,"180 S",{size:10,a:"end",fill:"var(--muted)"})+LD.T(x+w/2,y+20,"PURGE · IGNITER · GAS · BLOWER",{size:10,fill:"var(--muted)"});return s};
const short=R=>R.step.split(/[,(:]/)[0].trim();
const scene=(R,S,o={})=>furnace(R,S)+ladder(R,S,{paper:o.paper})+bar(R,S)+(o.noTag?"":K.tag(185,22,`${Math.round(S.t)} S: ${short(R).toUpperCase()}`,{w:330,fill:R.lock||R.limOpen?"var(--bad)":"var(--ink)"}));
const VB="0 0 760 460";
const at=(t,x={})=>{const S={w:true,t,ps:false,dirty:false,ign:false,lim:false,...x};return scene(model(S),S)};
/* ---------- Learn ---------- */
const steps=[
 {t:"Each step proves the one before it",
  body:`<p>The <b>sequence of operation</b> in the manual lists what happens, in order, from the thermostat call to heat in the house. On a gas furnace each step must be proven before the next is allowed:</p><ol><li>Thermostat calls (<b>W</b>).</li><li><b>Inducer</b> starts. The <b>pressure switch</b> proves draft.</li><li><b>Igniter</b> heats up.</li><li><b>Gas valve</b> opens and the burners light.</li><li><b>Flame sensor</b> proves flame.</li><li><b>Blower</b> starts after a delay.</li></ol><p>Know the order and you know where it stopped.</p>`,vb:VB,draw:()=>{const S={w:false,t:0};return scene(model(S),S,{noTag:true})+K.tag(185,22,"STANDBY: NO CALL",{w:200})}},
 {t:"Call for heat: inducer and pressure switch",
  body:`<p>The thermostat closes R to <b>W</b> (rung 5). Relay <b>IR</b> pulls in and its contact on rung 1 starts the <b>inducer</b>.</p><p>The inducer pulls air through the heat exchanger. The suction closes the <b>pressure switch</b> (rungs 6 and 7). It's a normally open switch that proves the vent is clear before any gas flows.</p><p>Then the board waits out the <b>prepurge</b>, 15 s on this furnace, to clear any old gas.</p>`,vb:VB,draw:()=>at(8)},
 {t:"Igniter warm-up",
  body:`<p>When prepurge ends, the board's timer (the <b>PURGE</b> contact on rung 6) closes and relay <b>HSR</b> powers the <b>hot surface igniter</b> on rung 2.</p><p>It glows orange for its warm-up time, 17 s here, until it's hot enough to light gas on contact.</p><p>Gas is still off: the gas valve rung (7) needs the board's try contact, which hasn't closed.</p>`,vb:VB,draw:()=>at(26)},
 {t:"Gas valve opens, flame is proven",
  body:`<p>The board closes the <b>TRY</b> contact on rung 7. Power flows through the pressure switch, the <b>limit</b> and the <b>rollout switch</b> to the <b>gas valve</b>. The burners light off the glowing igniter.</p><p>After the trial, about 5 s, the igniter shuts off and the board has 2 s to see flame through the <b>flame sensor</b>. If it does, the gas valve stays open.</p><p>Notice the safeties: the pressure switch, limit and rollout are all in <b>series</b> with the gas valve. Any one opening shuts the gas.</p>`,vb:VB,draw:()=>at(36)},
 {t:"Blower delay, then heat",
  body:`<p>With flame proven, the board starts a <b>blower delay</b>, 45 s on this furnace, so the heat exchanger warms up first and nobody gets a blast of cold air.</p><p>Then the <b>45 S</b> contact on rung 8 closes, relay <b>BR</b> pulls in, and its contact on rung 3 starts the <b>blower</b>.</p><p>When the thermostat is satisfied: gas valve off, inducer runs a short post-purge, and the blower runs an off-delay to pull the last heat out.</p>`,vb:VB,draw:()=>at(95)},
 {t:"When it doesn't prove: retries and lockout",
  body:`<p>If the flame sensor doesn't see flame, the board closes the gas valve and starts over from prepurge. This furnace tries <b>4 times</b> in all, then goes into <b>lockout</b>: inducer off after post-purge, nothing else runs, the LED flashes a code.</p><p>Here a dirty flame sensor lights the burners every time but never proves them. Lockout clears when power is cycled.</p><p>Where the sequence stops tells you which part to test.</p>`,vb:VB,draw:()=>at(170,{dirty:true})}];
/* ---------- See it ---------- */
const see=K.see({vb:VB,init:{w:true,t:8,ps:false,dirty:false,ign:false,lim:false},
 sliders:[["t","Time since the call",0,180,1,v=>v+" s"]],
 checks:[["w","Thermostat calls for heat (W)"],["ps","Pressure switch stuck open"],["ign","Igniter cracked (won't glow)"],["dirty","Flame sensor dirty"],["lim","High limit open"]],
 model,draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Step",R.step.split(" (")[0],R.lock||R.limOpen],["Inducer",R.ind?"on":"off"],["Pressure switch",R.ps?"closed":"open",R.W&&R.ind&&!R.ps&&!R.lock],["Igniter",R.ign?"glowing":"off"],["Gas valve",R.gv?"open":"closed"],["Flame",R.flame?(R.proven?"proven":"lit, not proven yet"):"none"],["Blower",R.blw?"on":"off"],["Try",R.tries?R.tries+" of "+TRIES:"-"]],
 note:(R,S)=>!S.w?"No call: everything waits.":R.limOpen?"The limit is open: the board won't open the gas valve, and it runs the blower and inducer to cool the heat exchanger. Look for a dirty filter or a slow blower.":S.ps?"The inducer runs but the pressure switch never closes, so the sequence stops right there. Check the hose, the vent and the switch.":R.lock?"Lockout after 4 tries. Cycle power to reset, but find out why first.":S.dirty&&R.tries>1?"Lights, then shuts off at the end of each trial: the board can't see the flame. Clean the sensor.":S.ign&&R.tries>0&&R.gv?"Gas is flowing but nothing lights it: the igniter never got hot.":"Slide the time to walk through the sequence.",
 log:[["Time",(R,S)=>S.t+" s"],["Step",R=>R.step.split(" (")[0].split(":")[0]],["Fault",(R,S)=>S.ps?"PS":S.dirty?"sensor":S.ign?"igniter":S.lim?"limit":"none"],["Gas",R=>R.gv?"open":"shut"]]});
/* ---------- Try it ---------- */
const causes=[["ps","Pressure switch not closing (hose or vent)"],["dirty","Dirty flame sensor"],["ign","Cracked igniter"],["lim","High limit open"],["w","Thermostat not calling"]];
const cs=o=>K.caseTask({t:o.t,intro:o.intro,vb:VB,state:{w:true,t:o.t0||10,ps:false,dirty:false,ign:false,lim:false,hide:true,...o.f},model,draw:(R,S)=>scene(R,S,{paper:true}),
 slider:["t","Watch it run",0,180,1,v=>v+" s"],reads:R=>[["Board says",short(R)],["Try",R.tries?R.tries+" of "+TRIES:"-"],["Burner",R.flame?"flame":"no flame"],["Blower",R.blw?"on":"off"]],causes,ans:o.ans,why:o.why,hint:o.hint,actions:o.act});
const tasks=[
 K.goal({t:"Catch the igniter warm-up",intro:"No faults, thermostat calling. Set the time to a moment when the <b>igniter is glowing but the gas valve is still closed</b>.",
  check:(S,R)=>!S.w?"Turn on the call for heat.":S.ps||S.dirty||S.ign||S.lim?"Clear all the faults.":!R.ign?"The igniter isn't on at this time.":R.gv?"The gas valve is already open. Go a little earlier.":true,ok:(S,R)=>`At ${S.t} s the igniter is heating and gas is still off. It runs from ${PS_T+PURGE} s to ${PS_T+PURGE+WARM} s before the valve opens.`}),
 K.goal({t:"Get heat to the house",intro:"No faults. Find the earliest second the <b>blower</b> is running.",
  check:(S,R)=>S.ps||S.dirty||S.ign||S.lim||!S.w?"Calling for heat, no faults.":!R.blw?"The blower isn't on yet.":S.t>PS_T+TRY+BLW?"The blower's on. Can you find the first second it starts?":true,ok:`${PS_T+TRY+BLW} s: flame proven at ${PS_T+TRY} s plus the 45 s blower delay.`}),
 K.goal({t:"Recreate a lockout",intro:"Turn on the <b>dirty flame sensor</b>, run the time until the board <b>locks out</b>, and press <b>Log reading</b>.",
  check:(S,R,L)=>L.some(r=>r.S.dirty&&r.R.lock)?true:"Log a reading with the dirty sensor while the board is in lockout.",ok:`It tried ${TRIES} times, ${TRY} s each, then locked out. A tech who just resets it will be back tomorrow.`}),
 cs({t:"Service call: inducer hums, nothing else",intro:"No heat. The inducer motor runs steadily. Slide the time and watch.",f:{ps:true},
  act:[["Check the pressure switch hose",()=>"The hose is full of water at the low spot."],["Measure across the pressure switch",()=>"24 V across it: it's open."]],ans:"ps",why:"The sequence stops right after the inducer: the pressure switch never proves draft. A water-filled hose, a blocked vent or a bad switch all do this.",hint:"Which step never happens after the inducer starts?"}),
 cs({t:"Service call: lights, then goes out",intro:"The customer hears it light, then it shuts off and starts over. Slide the time and watch.",f:{dirty:true},t0:36,
  act:[["Look at the flame sensor rod",()=>"A dull white coating on the rod."]],ans:"dirty",why:"Gas lights every time, but the board never sees the flame, so it closes the valve after each trial. Clean the sensor rod with a fine abrasive pad and check the flame signal.",hint:"Gas lights. What has to happen in the 2 seconds after the trial?"}),
 cs({t:"Service call: blower runs, no flame",intro:"Cold air from the vents and no flame through the sight glass. Slide the time and watch.",f:{lim:true},
  act:[["Check the filter",()=>"Filter is solid gray. Static pressure is high."],["Measure across the limit",()=>"24 V across the limit: open."]],ans:"lim",why:"The limit in series with the gas valve is open, and the board runs the blower to cool off. A clogged filter caused it to overheat. Change the filter and check the temperature rise.",hint:"The blower runs before any flame. What does a board do when it's protecting an overheated heat exchanger?"})];
window.LESSON={id:"lad-seq",sec:"Ladder Builder",secHref:"/ladder/",title:"Following a sequence of operation",lead:"Walk a gas furnace from the thermostat call to the blower: safeties in series, relays that pull in, and contacts that start the loads.",
 steps,see,tryIntro:"Three setups in See it, then three no-heat calls. On the calls you see what the furnace does, and the printed diagram as a reference. Watch where the sequence stops.",tasks,
 job:K.job({read:["<b>The sequence of operation</b> page in the furnace manual or on the panel door: the times differ by model.","<b>The LED</b> on the control board: count the flashes and read the code chart.","<b>What it's doing now</b>: listen and look before you touch anything.","<b>Flame signal</b> in microamps, if the board or your meter reads it (normal range is in the manual)."],
  table:[["Where it stops","First thing to check"],["Nothing at all","24 V at R-C, the fuse, the door switch, the thermostat call"],["Inducer runs, nothing else","Pressure switch, hose, vent, condensate trap"],["Igniter never glows","Igniter (ohms, power off), voltage to it"],["Gas valve opens, no flame","Igniter, gas supply pressure"],["Lights then drops out","Flame sensor, ground, polarity"],["Blower runs, no flame","Limit or rollout open: filter, airflow"]],tableT:"Where it stopped tells you",
  steps:["Read the sequence for this model first.","Start a heat call and watch every step happen.","Note the last step that worked and the first one that didn't.","Test the part that should have made the next step happen (switch, igniter, sensor), with your meter.","Fix the cause, then run a full cycle and watch it all again."],stepsT:"Troubleshooting by the sequence",
  safety:["Never jumper a pressure switch, limit or rollout switch to \"see if it runs\". They're the only thing between a fault and a fire or CO.","A manual-reset rollout that tripped means flame came out of the burner box. Find out why before resetting it.","Line voltage is on the board and the inducer and blower terminals even with no call."],
  mistakes:["Resetting a lockout and leaving.","Replacing the board when the pressure switch hose is just full of water.","Not counting the LED flashes before cycling power (cycling clears the code)."]}),
 sources:[["The Engineering Mindset: how relays work","https://theengineeringmindset.com/how-relays-work/"],["The Engineering Mindset: time delay relays explained","https://theengineeringmindset.com/time-delay-relays/"],["Bryant 383KAV furnace: sequence of operation (ManualsLib)","https://www.manualslib.com/manual/1115647/Bryant-383kav.html?page=12"],["Daikin/Goodman 80% furnace service manual RS6621301","https://mobile.goodmanmfg.com/mobileapp/stellent/pdf/infoPdf/Lit/RS6621301.pdf"]]};
})();
