/* ============ Lesson: Pneumatic basics: main air, branch line, 3 to 15 psi, DA and RA thermostats ============ */
(()=>{
const C=CTK,HS=3,HE=7;
const sl=(id,lab,min,max,step,val,out)=>`<div class="row"><label for="ls_${id}">${lab}</label><output id="lso_${id}">${out}</output><input type="range" id="ls_${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
const g=(x,y,s,inner)=>`<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
/* ---------- the zone: main air, thermostat in the room, branch to a NO heating valve ---------- */
function scene(R,S,o={}){const tc=T=>T>S.sp+1?"var(--hot)":T<S.sp-1?"var(--cold)":"var(--ok)";
 let s=`<rect x="150" y="110" width="290" height="250" fill="var(--paper)" stroke="#a89a85" stroke-width="2"/><path d="M146 360 H444" stroke="#8a7f70" stroke-width="4"/>`+K.lbl(160,132,"OFFICE",{a:"start",size:13});
 s+=C.gauge(70,70,30,R.main,30,"MAIN AIR",{read:K.f1(R.main)+" psi",rw:86})+C.gauge(640,70,30,R.br,30,"BRANCH",{read:K.f1(R.br)+" psi",rw:86});
 s+=C.tube("M70 146 V330 H215 V316",R.main)+C.tube("M255 316 V340 H460 V150 H560 V184",R.br);
 s+=g(190,150,.75,C.tstat(0,0,{room:S.room,sp:S.sp,da:!!S.act,ports:true}));
 s+=K.lbl(360,190,K.f1(S.room)+"°F",{size:30,fill:tc(S.room)})+K.lbl(360,214,"ROOM",{size:12})+K.txt(360,250,"setpoint "+S.sp+"°F");
 s+=C.pipe("M452 290 H700",C.HW)+K.arrow("M612 262 H700",C.HW,2.4)+K.lbl(700,246,"TO COIL",{a:"end",size:12});
 s+=C.valve(560,290,{open:R.open,x:R.x,s:.9,kind:"pn"})+K.tag(590,352,"NO VALVE, "+HS+"-"+HE+" PSI: "+Math.round(R.open*100)+"% OPEN",{fill:R.open>0.02?C.HW:"var(--muted)"});
 if(o.lbl!==false)s+=K.lbl(70,365,"FROM PRV",{size:12});
 return s}
const model=S=>{const br=C.branch(S.room,S.sp,!!S.act,S.sens,S.main),x=C.stroke(br,HS,HE);return {main:S.main,br,x,open:1-x,sig:(br-3)/12*100,tr:12/S.sens}};
/* ---------- steps ---------- */
const steps=[
 {t:"Air does the work",
  body:`<p>Older buildings run their controls on <b>compressed air</b> instead of wires. A small compressor fills a tank. The air is dried, filtered, and dropped down to a steady low pressure called <b>main air</b>, usually about <b>20 psi</b>.</p><p>Main air goes out in small copper or plastic tubing to every thermostat. Each thermostat sends some of that air on to its valve or damper. That second line is the <b>branch line</b>.</p><p>No electricity in the field: the air pressure itself is the signal <b>and</b> the power that moves the valve.</p>`,
  draw:()=>{let s=`<rect x="22" y="236" width="136" height="60" rx="30" fill="url(#zSteel)" stroke="#5f686d" stroke-width="1.5"/><rect x="48" y="196" width="46" height="40" rx="4" fill="url(#zMotor)" stroke="#3a4247"/><rect x="102" y="204" width="34" height="32" rx="3" fill="url(#zCab)" stroke="#5f686d"/><rect x="40" y="296" width="10" height="14" fill="#5f686d"/><rect x="130" y="296" width="10" height="14" fill="#5f686d"/>`;
   s+=C.gauge(90,76,30,85,120,"TANK",{read:"70-90 psi",rw:92});
   s+=`<rect x="178" y="206" width="56" height="90" rx="4" fill="url(#zCab)" stroke="#5f686d"/><rect x="186" y="216" width="40" height="20" fill="url(#zGrille)"/>`;
   s+=`<path d="M258 222 h22 v50 q-11 14 -22 0 z" fill="#cfe3f3" stroke="#5f686d"/><path d="M290 222 h22 v50 q-11 14 -22 0 z" fill="#e8dcc0" stroke="#5f686d"/>`;
   s+=`<rect x="336" y="226" width="40" height="30" rx="4" fill="url(#zBrass)" stroke="#5e400e"/><rect x="350" y="200" width="12" height="26" fill="url(#zSteel)" stroke="#5f686d"/><circle cx="356" cy="196" r="9" fill="url(#zPlasticDk)" stroke="#111"/>`;
   s+=C.gauge(356,76,30,20,30,"MAIN AIR",{read:"20 psi",rw:76});
   s+=C.pipe("M158 252 H178",C.AIR,5)+C.pipe("M234 246 H258",C.AIR,5)+C.pipe("M312 246 H336",C.AIR,5);
   s+=C.tube("M376 246 H448",20)+g(448,186,.5,C.tstat(0,0,{ports:false}))+C.tube("M508 266 V300 H600",8)+C.tube("M600 300 H640 V232",8)+C.valve(640,320,{s:.8,x:.5,open:.5,kind:"pn"});
   s+=C.gauge(560,76,30,8,30,"BRANCH",{read:"0-20 psi",rw:92});
   s+=K.lbl(90,334,"COMPRESSOR",{size:12})+K.lbl(206,320,"DRYER",{size:12})+K.lbl(285,320,"FILTERS",{size:12})+K.lbl(356,282,"PRV",{size:12})+K.lbl(478,176,"THERMOSTAT",{size:12})+K.lbl(640,370,"VALVE",{size:12});
   return s}},
 {t:"How a thermostat makes branch pressure",
  body:`<p>Inside a pneumatic thermostat, main air passes a tiny hole (the <b>restrictor</b>) and then escapes out a <b>nozzle</b>. A flat lever, the <b>flapper</b>, sits over the nozzle. A <b>bimetal</b> strip moves the flapper as the room changes.</p><ul><li>Flapper close to the nozzle: little air escapes, so pressure builds up.</li><li>Flapper lifted: air bleeds away, so pressure drops.</li></ul><p>The pressure between the restrictor and the nozzle is the <b>branch</b>. Drag the room temperature.</p>`,
  init:{rt:72},ctl:{html:sl("rt","Room temperature",68,76,0.2,72,"72.0°F"),input:(t,s)=>{s.rt=+t.value;document.getElementById("lso_rt").textContent=K.f1(t.value)+"°F"}},
  draw:s=>{const T=s.rt??72,br=C.branch(T,72,true,2.5,20),gap=4+(20-br)/20*34;
   let o=C.gauge(110,90,34,20,30,"MAIN AIR 20 PSI")+C.gauge(590,90,34,br,30,"BRANCH",{read:K.f1(br)+" psi",rw:86});
   o+=C.tube("M110 132 V230 H230",20)+`<rect x="230" y="216" width="40" height="28" rx="3" fill="url(#zBrass)" stroke="#5e400e"/><path d="M250 222 v16" stroke="#111" stroke-width="2"/>`+C.tube("M270 230 H590 V140",br)+C.tube("M360 230 V170",br);
   o+=`<rect x="348" y="152" width="24" height="20" fill="url(#zBrass)" stroke="#5e400e"/><path d="M354 152 L360 142 L366 152 Z" fill="url(#zBrass)" stroke="#5e400e"/>`;
   const fy=142-gap;o+=`<rect x="300" y="${fy-6}" width="150" height="6" rx="2" fill="#5f686d"/><circle cx="300" cy="${fy-3}" r="5" fill="#3a4247"/>`;
   o+=`<path d="M450 ${fy-3} Q500 ${fy+40} 470 300" stroke="#b5651d" stroke-width="6" fill="none"/><rect x="440" y="300" width="60" height="12" fill="#8a7f70"/>`;
   for(let i=0;i<3;i++){const w=gap/38;o+=`<path d="M${352-i*10} ${140-i*2} q-${14+i*8} -${4+i} -${24+i*14} ${2}" stroke="${C.AIR}" stroke-width="2" fill="none" stroke-dasharray="4 4" opacity="${(0.25+0.75*w).toFixed(2)}"/>`}
   o+=K.lbl(250,272,"RESTRICTOR",{size:12})+K.lbl(400,96,"FLAPPER",{size:12})+K.lbl(336,186,"NOZZLE",{a:"end",size:12})+K.lbl(520,330,"BIMETAL",{size:12});
   o+=K.txt(40,330,gap>20?"flapper lifted: air bleeds off":gap<10?"flapper close: pressure builds":"flapper partly over the nozzle",{a:"start"});
   return o+K.txt(360,372,`room ${K.f1(T)}°F, setpoint 72°F: branch ${K.f1(br)} psi (direct acting, 2.5 psi per °F)`)}},
 {t:"3 to 15 psi: the standard signal",
  body:`<p>Most pneumatic devices are built around a <b>3 to 15 psi</b> signal. 3 psi means 0%, 15 psi means 100%. The span is 12 psi.</p><p>Why not 0 to 12? Because <b>zero should mean something is wrong</b>. A branch reading near 0 psi says the air is off, a tube is broken or the thermostat has failed, not that the room wants 0%. This is called a <b>live zero</b>. The electronic 4 to 20 mA signal copies the same idea (lesson 5).</p>`,
  math:`<p>Signal % = (branch psi − 3) ÷ 12 × 100</p><p>Example: 9 psi → (9 − 3) ÷ 12 = 50%.</p>`,
  draw:()=>{let s=C.bar(60,90,560,{row:true,max:20,ranges:[{a:0,b:3,c:"#9aa3aa",lbl:"DEAD"},{a:3,b:15,c:C.AIR,lbl:"3 TO 15 PSI = 0 TO 100%"},{a:15,b:20,c:"#6b8f8d",lbl:"UP TO MAIN"}],rh:34});
   s+=K.lbl(60,56,"BRANCH PRESSURE",{a:"start"});
   const rows=[[3,0],[6,25],[9,50],[12,75],[15,100]];s+=`<rect x="160" y="200" width="400" height="150" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(250,226,"BRANCH",{size:13})+K.lbl(470,226,"SIGNAL",{size:13});
   rows.forEach(([p,v],i)=>s+=K.txt(250,252+i*22,p+" psi")+K.txt(470,252+i*22,v+"%"));
   return s}},
 {t:"Direct acting and reverse acting",
  body:`<p>Every thermostat has an <b>action</b>:</p><ul><li><b>Direct acting (DA)</b>: as the room gets warmer, the branch pressure goes <b>up</b>.</li><li><b>Reverse acting (RA)</b>: as the room gets warmer, the branch pressure goes <b>down</b>.</li></ul><p>Which one you need depends on the valve. A heating valve that is open with no air and closes as pressure rises needs a DA thermostat: warmer room, more air, less heat. Put an RA thermostat on it and the warmer the room gets, the more the valve opens. The room runs away.</p><p>Some thermostats switch action by season. Honeywell's TP972A, for example, is DA for heating and RA for cooling.</p>`,
  draw:()=>K.chart({x:90,y:40,w:540,h:270,X:[66,78],Y:[0,20],xt:[66,68,70,72,74,76,78],yt:[0,3,9,15,20],xf:v=>v+"°",yf:v=>v,xl:"room temperature",yl:"branch psi",title:"SETPOINT 72°F, 2.5 PSI PER °F",
   bands:[{y0:3,y1:15,c:C.AIR}],vlines:[{x:72,lbl:"SP"}],
   series:[{f:T=>C.branch(T,72,true,2.5,20),c:"var(--hot)",lbl:"DA: UP WHEN WARMER",lblAt:70.6,a:"end",dx:-12,dy:-4},{f:T=>C.branch(T,72,false,2.5,20),c:"var(--cold)",lbl:"RA: DOWN WHEN WARMER",lblAt:74.6,a:"start",dx:12,dy:-8}]})},
 {t:"Sensitivity and throttling range",
  body:`<p><b>Sensitivity</b> is how many psi the branch changes for each degree, for example 2.5 psi per °F. It's adjustable on most thermostats.</p><p>The <b>throttling range</b> is how many degrees it takes to swing the branch across the whole 12 psi span: 12 ÷ 2.5 = 4.8°F. That's the same idea as the proportional band in the PID lesson.</p><p>Too sensitive and the valve swings end to end (hunting). Not sensitive enough and the room drifts away from setpoint (droop). A pneumatic thermostat is proportional only, so it never holds exactly on setpoint.</p>`,
  math:`<p>Throttling range (°F) = 12 psi ÷ sensitivity (psi per °F)</p><p>Branch = 8 psi + sensitivity × (room − setpoint), for a DA thermostat that reads 8 psi at setpoint.</p>`,
  init:{se:2.5},ctl:{html:sl("se","Sensitivity",1,5,0.5,2.5,"2.5 psi/°F"),input:(t,s)=>{s.se=+t.value;document.getElementById("lso_se").textContent=K.f1(t.value)+" psi/°F"}},
  draw:s=>{const se=s.se??2.5,tr=12/se,a=72-5/se,b=72+7/se;
   let o=K.chart({x:90,y:40,w:540,h:250,X:[64,80],Y:[0,20],xt:[64,66,68,70,72,74,76,78,80],yt:[0,3,9,15,20],xf:v=>v+"°",yf:v=>v,xl:"room temperature",yl:"branch psi",title:`DA THERMOSTAT, ${K.f1(se)} PSI PER °F`,bands:[{y0:3,y1:15,c:C.AIR}],vlines:[{x:72,lbl:"SP"}],series:[{f:T=>C.branch(T,72,true,se,20),c:"var(--hot)"}]});
   const X=T=>90+(C.cl(T,64,80)-64)/16*540;o+=`<path d="M${X(a)} 340 v8 H${X(b)} v-8" stroke="var(--brass)" stroke-width="2" fill="none"/>`+K.lbl((X(a)+X(b))/2,372,"THROTTLING RANGE "+K.f1(tr)+"°F",{fill:"var(--brass)",size:14});
   return o}}];
/* ---------- See it ---------- */
const AN=["Reverse (RA)","Direct (DA)"];
const see=K.see({init:{room:72,sp:72,act:1,sens:2.5,main:20},
 sliders:[["room","Room temperature",64,80,0.1,v=>K.f1(v)+"°F"],["sp","Setpoint",68,76,1,v=>v+"°F"],["act","Thermostat action",0,1,1,v=>AN[v]],["sens","Sensitivity",1,5,0.5,v=>K.f1(v)+" psi/°F"],["main","Main air (PRV)",0,25,1,v=>v+" psi"]],
 model,draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Main air",K.f1(R.main)+" psi",R.main<15||R.main>25],["Branch",K.f1(R.br)+" psi"],["Signal (3 to 15 psi)",R.br<3?"below 3 psi":R.br>15?"above 15 psi":K.f0(R.sig)+"%"],["Heating valve",K.f0(R.open*100)+"% open"],["Throttling range",K.f1(R.tr)+"°F"],["Action vs this valve",S.act?"correct (DA on NO)":"wrong (RA on NO)",!S.act]],
 note:(R,S)=>R.main<HE?`<b class="bad">Main air is only ${R.main} psi.</b> The branch can never get above it, so the heating valve can't close past ${K.f0(R.open*100)}% open.`:!S.act&&S.room>S.sp?`<b class="bad">Runaway:</b> the room is above setpoint and the RA thermostat is opening the heat further.`:S.room<S.sp-0.2?"Room below setpoint: the branch drops and the normally open valve opens to heat.":R.open<0.01?"Valve closed: the branch is above "+HE+" psi, the top of its spring range.":"Near setpoint: the branch sits mid-range and the valve throttles.",
 log:[["Room",(R,S)=>K.f1(S.room)],["Act",(R,S)=>S.act?"DA":"RA"],["Branch",R=>K.f1(R.br)],["Valve",R=>K.f0(R.open*100)+"%"]]});
/* ---------- Try it ---------- */
const base=S=>S.sp!==72?"Set the setpoint to 72°F.":!S.act?"Set the thermostat to Direct (DA).":S.sens!==2.5?"Set sensitivity to 2.5 psi/°F.":S.main!==20?"Set main air to 20 psi.":null;
const tasks=[
 K.goal({t:"Find the 3 and 15 psi points",intro:"Setpoint <b>72°F</b>, <b>DA</b>, <b>2.5 psi/°F</b>, main air <b>20 psi</b>. Find the room temperature that gives <b>3 psi</b> and log it, then the one that gives <b>15 psi</b> and log it (within 0.3 psi).",
  check:(S,R,L)=>{const b=base(S);if(b)return b;const ok=l=>l.S.sp===72&&l.S.act===1&&l.S.sens===2.5&&l.S.main===20;const a=L.some(l=>ok(l)&&Math.abs(l.R.br-3)<=0.3),c=L.some(l=>ok(l)&&Math.abs(l.R.br-15)<=0.3);return a&&c?true:!a?"Log a reading with the branch at 3 psi.":"Now log one at 15 psi."},
  ok:"70°F gives 3 psi and 74.8°F gives 15 psi: the 12 psi span takes 4.8°F. That's the throttling range, 12 ÷ 2.5."}),
 K.goal({t:"Wrong action",intro:"Switch the thermostat to <b>Reverse (RA)</b> and warm the room to at least <b>2°F above setpoint</b>. What does the normally open heating valve do?",
  check:(S,R)=>S.act!==0?"Set the action to Reverse (RA).":S.room<S.sp+2?"Warm the room to 2°F or more above setpoint.":R.main<15?"Put main air back near 20 psi.":true,
  ok:(S,R)=>`The branch fell to ${K.f1(R.br)} psi and the valve is ${K.f0(R.open*100)}% open: the warmer the room, the more heat. A normally open heating valve needs a DA thermostat.`}),
 K.caseTask({t:"Service call: office roasting, valve won't close",intro:"Room at 78°F, setpoint 72°F, DA thermostat. The heating valve is still mostly open. You put a test gauge on the branch.",
  state:{room:78,sp:72,act:1,sens:2.5,main:4},model,draw:(R,S)=>scene(R,S),
  reads:(R,S)=>[["Room","78.0°F"],["Branch",K.f1(R.br)+" psi"],["Heating valve",K.f0(R.open*100)+"% open"]],
  actions:[["Read the main air gauge",R=>`Main air reads ${K.f1(R.main)} psi.`],["Read the tank gauge",()=>"Tank 82 psi, compressor cycling normally."]],
  causes:[["main","Main air low (PRV set or failed low)"],["ra","Thermostat set to reverse acting"],["sp","Setpoint turned up"],["stuck","Valve stem stuck open"]],ans:"main",
  why:"The thermostat is calling for full air, but the branch can't go higher than main air, which is only 4 psi. That only strokes the 3 to 7 psi valve a quarter of the way. The tank is fine, so the PRV is set or failed low. Reset it to about 20 psi.",
  hint:"The branch is pinned at the same number as one of the gauges. Which one?"})];
window.LESSON={id:"ctl-pneu",sec:"Controls",secHref:"/controls/",title:"Pneumatic basics: main air, branch and 3 to 15 psi",lead:"How control air reaches a thermostat, how the thermostat turns room temperature into branch pressure, and why direct or reverse acting matters.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Main air</b> at the PRV gauge (about 20 psi on a single-pressure system).","<b>Branch</b> with a test gauge on the thermostat's branch port or at the actuator.","The thermostat's <b>action</b> (DA or RA, marked on the bimetal or the label) and the valve's normal position."],
  table:[["Reading","Normal","Look into it"],["Tank","Compressor cycles about 70 to 90 psi","Runs nonstop, or relief valve popping"],["Main air","About 20 psi (day/night systems switch, e.g. 13 and 18 psi)","Below 15 or above 25 psi"],["Branch at setpoint","Mid-range, about 7 to 9 psi","Stuck at 0 or at main air"],["Branch swing","3 to 15 psi over the throttling range","Never moves when the room changes"]],
  steps:["Check main air at the PRV. No main, no control.","Tee a test gauge into the branch at the thermostat.","Warm the thermostat with your hand (or turn the setpoint down). A DA branch should rise; RA should fall.","Watch the actuator stem move through its spring range.","Compare the branch at the thermostat and at the actuator. A big difference means a leak or a kinked tube."],stepsT:"Checking a pneumatic zone",
  safety:["Bleed the line before disconnecting tubing. Even 20 psi can whip a loose tube or blow debris in your face.","Never feed tank pressure to thermostats or actuators: their diaphragms are built for about 25 to 30 psi at most."],
  mistakes:["Swapping a DA thermostat for an RA one (or the reverse) and the room runs away.","Blaming the thermostat when main air is low.","Leaving a test gauge fitting loose: the leak drags the branch down."]}),
 sources:[["The Engineering Mindset: air handling units explained (coils, dampers and their controls)","https://theengineeringmindset.com/air-handling-units-explained/"],["ACHR News: demystifying controls (DA and RA, NO and NC valves)","https://www.achrnews.com/articles/96989-demystifying-controls"],["Honeywell TP970/TP9600 pneumatic thermostats (DA heating, RA cooling, main air pressures)","https://www.manualslib.com/manual/69778/Honeywell-B.html?page=10"],["UFC 3-410-02A: 20 psig main air for pneumatic actuators","https://buildingcriteria1.tpub.com/ufc_3_410_02a/ufc_3_410_02a0037.htm"],["BAPI: the science of 4 to 20 mA current loops (copies the 3 to 15 psi live zero)","https://bapihvac.com/?p=141928"]]};
})();
