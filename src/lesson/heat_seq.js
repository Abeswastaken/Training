/* ============ Lesson: Furnace sequence of operation ============ */
(()=>{
const NORM=HK.seq({tEnd:480,callEnd:300,boff:120});
const at=t=>HK.seqAt(NORM,t);
const F=(t,lab,extra={})=>HK.furn(HK.fs(at(t),{labels:lab,...extra}));
const steps=[
 {t:"The call for heat",body:`<p>A gas furnace does the same steps in the same order every time. The <b>control board</b> runs them. It starts when the thermostat closes <b>R to W</b>: 24 volts on W is the <b>call for heat</b>.</p><p>Before it starts anything, the board checks that the <b>pressure switch is open</b>. A switch that is already closed with the inducer off is stuck or jumpered, so the board won't start.</p><p>Then it starts the <b>inducer</b> (draft motor).</p>`,
  draw:()=>F(1,["board","inducer","ps","vent","gv"],{hl:"board"})},
 {t:"Inducer prepurge and the pressure switch",body:`<p>The inducer pulls air through the heat exchanger and pushes it up the vent. That clears out any gas left from before. This is the <b>prepurge</b>.</p><p>When the draft is strong enough, the <b>pressure switch</b> closes. That proves the vent is open and the inducer is working. The board then times the prepurge: <b>about 15 seconds</b> on many furnaces.</p><p>No pressure switch, no ignition. The inducer just keeps running.</p>`,
  draw:()=>F(10,["inducer","ps","vent","coll"],{hl:"ps"})},
 {t:"Igniter warm-up",body:`<p>After prepurge the board powers the <b>hot surface igniter</b>. It needs time to get hot enough to light gas, about <b>17 seconds</b> on the furnace in the trainer (10 to 30 seconds is the usual range).</p><p>Older furnaces use a <b>spark igniter</b> or a standing pilot instead. A spark lights almost at once, so there is no warm-up.</p><p>Never touch the igniter element. Skin oil makes a hot spot and it cracks early.</p>`,
  draw:()=>F(32,["ig","burn","hx"],{hl:"ig"})},
 {t:"Gas valve and flame proving",body:`<p>Now the board opens the <b>gas valve</b>. Gas flows from the manifold through the burners and the hot igniter lights it. The flame carries across all the burners.</p><p>The board has only a few seconds (the <b>trial for ignition</b>, about 4 to 7 seconds) to see flame at the <b>flame sensor</b>. It needs about 1 µA or more. If it proves flame, the igniter turns off and the furnace is heating.</p><p>If not, the gas valve closes right away. Gas never flows for long without a proven flame.</p>`,
  draw:()=>F(41,["gv","fs","burn","ig"],{hl:"fs"})},
 {t:"Blower on-delay, satisfy and post-purge",body:`<p>The blower waits. If it started with the flame, it would blow cold air at the customer. The <b>blower on-delay</b> is about <b>25 to 30 seconds</b> after the gas valve opens or the flame proves.</p><p>When the thermostat is satisfied, W drops out:</p><ol><li>The gas valve closes and the flame goes out.</li><li>The inducer runs a <b>post-purge</b> (about 15 seconds) to clear the flue gas.</li><li>The blower keeps running for its <b>off-delay</b> (90, 120, 150 or 180 s, set on the board) to pull the last heat out of the heat exchanger.</li></ol>`,
  draw:()=>{let s=HK.timeline(NORM,{x:120,y:70,w:560,T:480,rh:34});const X=t=>120+t/480*560;
   [[0,"CALL",48,"start"],[35.5,"GAS ON",30,"middle"],[72,"BLOWER ON",48,"start"],[300,"SATISFIED",48,"end"],[315,"INDUCER OFF",30,"start"],[420,"BLOWER OFF",48,"middle"]].forEach(([t,l,y,a])=>{s+=`<path d="M${X(t)} ${y+4} V${70+6*34}" stroke="var(--muted)" stroke-dasharray="3 3"/>`+K.lbl(X(t)+(a==="start"?2:a==="end"?-2:0),y,l,{a,size:12})});
   return s+K.txt(400,334,"one normal cycle: a 5-minute call, 120 s blower off-delay")}},
 {t:"Failed trials and lockout",body:`<p>If the flame doesn't prove, the board closes the gas valve, purges with the inducer, and tries again. Most boards allow <b>3 or 4 trials</b>.</p><p>After the last one fails, the board goes into <b>lockout</b>: no more tries. A <b>soft lockout</b> retries by itself after 1 to 3 hours, or when you cycle power. A <b>rollout switch</b> trip is a hard lockout that needs a hand reset.</p><p>The LED flash code tells you why. Read the chart on the door before you reset anything.</p>`,
  draw:()=>{const q=HK.seq({tEnd:240,callEnd:999,ign:true});return HK.timeline(q,{x:120,y:40,w:560,T:240,rh:30,ticks:[0,40,80,120,160,200,240]})+K.lbl(120,282,"CRACKED IGNITER: 4 TRIALS, THEN LOCKOUT AT ABOUT 160 S",{a:"start",fill:"var(--bad)",size:14})+K.txt(120,310,"each retry: purge 15 s, igniter warm-up 17 s, trial 7 s. The inducer stops 15 s after lockout.",{a:"start"})}}];
/* See it: scrub through the sequence */
const see=K.see({vb:"0 0 720 482",init:{t:45,boff:120,ign:false,dirty:false,vent:false},
 sliders:[["t","Time since the call for heat",0,480,1,v=>v+" s"],["boff","Blower off-delay (board setting)",90,180,30,v=>v+" s"]],
 checks:[["ign","Igniter cracked"],["dirty","Flame sensor dirty (0.6 µA)"],["vent","Vent blocked (draft too weak)"]],
 model:S=>{const q=HK.seq({tEnd:480,callEnd:300,boff:S.boff,ign:S.ign,dirty:S.dirty,vent:S.vent});const p=HK.seqAt(q,S.t);const ev=q.ev.filter(e=>e[0]<=S.t+0.01);return {q,p,ev,last:ev[ev.length-1]}},
 draw:(R,S)=>HK.furn(HK.fs(R.p,{labels:["inducer","ps","ig","gv","fs","board","blower","hx"]}))+`<rect x="0" y="380" width="720" height="90" fill="var(--paper)" opacity=".0"/>`+HK.timeline(R.q,{x:110,y:382,w:590,T:480,rh:13,cur:S.t,ticks:[0,60,120,180,240,300,360,420,480]}),
 reads:(R)=>{const p=R.p;return [["Board",p.txt,p.st==="lock"],["Inducer",p.ind?"on":"off"],["Pressure switch",p.ps?"closed":"open",p.ind&&!p.ps&&p.t>30],["Igniter",p.igOn?"on":"off"],["Gas valve",p.gv?"open":"closed"],["Flame signal",p.uA.toFixed(1)+" µA",p.flame&&p.uA<1],["Blower",p.blower?"on":"off"],["Failed trials",String(p.trials)]]},
 note:R=>R.last?`<b>${Math.round(R.last[0])} s:</b> ${R.last[1]}`:"",
 log:[["Time",(R,S)=>S.t+" s"],["Board",R=>R.p.txt],["Gas",R=>R.p.gv?"open":"closed"],["Blower",R=>R.p.blower?"on":"off"]],logHint:"Press Log reading to note the board state at this second."});
const caseR=()=>{const q=HK.seq({tEnd:120,callEnd:999,vent:true});return HK.seqAt(q,90)};
const tasks=[
 K.goal({t:"Gas on, blower not yet",intro:"In See it, with no faults, find a moment when the <b>gas valve is open</b> but the <b>blower is still off</b>.",
  check:(S,R)=>S.ign||S.dirty||S.vent?"Clear the fault boxes first.":!R.p.gv?"The gas valve is closed at this second.":R.p.blower?"The blower is already on. Go earlier.":true,
  ok:(S,R)=>`At ${S.t} s the flame is ${R.p.flame?"lit":"being tried"} and the blower is waiting. That on-delay is why the customer doesn't get a blast of cold air.`}),
 K.goal({t:"Watch it lock out",intro:"Tick <b>Igniter cracked</b> and slide the time until the board shows <b>soft lockout</b>.",
  check:(S,R)=>!S.ign?"Tick Igniter cracked.":R.p.st!=="lock"?`The board says ${R.p.txt}. Keep going.`:true,
  ok:(S,R)=>{const e=R.q.ev.find(x=>/lockout/.test(x[1]));return `Lockout at about ${Math.round(e[0])} s after 4 trials. The gas valve opened 4 times for 7 s each and never lit.`}}),
 K.caseTask({t:"Service call: the inducer runs and nothing else happens",intro:"No heat. You hear the inducer running. The igniter never glows. The LED is flashing a code.",state:{},
  model:()=>caseR(),draw:p=>HK.furn(HK.fs(p,{labels:["inducer","ps","vent","ig"],nest:0.6})),
  reads:p=>[["Thermostat","calling"],["Inducer","running"],["Pressure switch","open",true],["Igniter","off"],["Board",p.txt]],
  actions:[["Look at the board LED",()=>"The code chart on the door says: pressure switch open with the inducer running."],["Look at the vent outside",()=>"The vent cap is packed with a bird nest."]],
  causes:[["ign","Cracked igniter"],["fs","Dirty flame sensor"],["vent","Blocked vent: the pressure switch can't close"],["gv","Gas valve won't open"],["lim","High limit open"]],ans:"vent",
  why:"The board is stuck at step 2. The inducer runs but the draft is too weak to close the pressure switch, so the board never powers the igniter. Clear the vent and check the draft with a manometer.",
  hint:"Which step is the board stuck on? The igniter comes after the pressure switch."})];
window.LESSON={id:"heat-seq",sec:"Heating",secHref:"/heating/",title:"Furnace sequence of operation",lead:"What a gas furnace does from the call for heat to the blower shutting off, and how it locks out after failed trials.",
 steps,see,tryIntro:"Two in See it, then a no-heat call.",tasks,
 job:K.job({read:["The <b>LED flash code</b> and the code chart on the blower door. Read it before you cycle power, because a power cycle clears it.","Which step the furnace reaches: inducer, pressure switch, igniter glow, gas valve, flame, blower.","24 V on W at the board, then 24 V to the gas valve during the trial."],
  table:[["Step","Typical (check the manual)"],["Prepurge after the pressure switch closes","about 15 s (10 to 60 s)"],["Hot surface igniter warm-up","about 17 s (10 to 30 s)"],["Trial for ignition","4 to 7 s"],["Blower on-delay","25 to 30 s on many furnaces (up to 90)"],["Post-purge","about 15 s"],["Blower off-delay","90, 120, 150 or 180 s (board setting)"],["Trials before lockout","3 or 4 total"],["Soft lockout auto-reset","1 to 3 hours"]],tableT:"Sequence timing",
  steps:["Set the thermostat to call and stand at the furnace with the door switch held or taped (only while you watch).","Name each step out loud as it happens. The first step that doesn't happen is where to look.","Check the part for that step: switch, igniter, valve voltage, flame signal.","After the repair, watch one full cycle, including the off-delay."],stepsT:"How to read a no-heat call",
  safety:["Never jumper a pressure switch, limit or rollout switch to 'see if it runs'. They are the only things between a bad vent and carbon monoxide in the house.","A rollout trip means flame left the burner box. Find out why before you reset it.","Turn the gas off at the shutoff before you work on the valve or burners."],
  mistakes:["Cycling power before reading the flash code.","Replacing the board when the sequence stops at a switch.","Calling a 30-second blower delay a failure.","Touching the igniter element with bare fingers."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained (furnace heaters)","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["Bryant 912S manual: heating sequence of operation","https://www.manualslib.com/manual/2734754/Bryant-912s.html?page=81"],["PickHVAC: gas furnace sequence of operations and safety timing","https://www.pickhvac.com/gas-furnace-sequence-operations-step-step-safety-timing/"]]};
})();
