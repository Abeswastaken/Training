/* ============ Lesson: Sensors and signals: thermistors, RTDs, 0-10 V, 2-10 V, 4-20 mA and scaling ============ */
(()=>{
const C=CTK,G=C.SIG;
const MEAS=[{n:"Duct static",lo:0,hi:2,u:" in. w.c.",d:2},{n:"Duct temperature",lo:0,hi:100,u:"°F",d:1},{n:"Humidity",lo:0,hi:100,u:"% RH",d:0}];
const fv=(m,v)=>(+v).toFixed(m.d)+m.u;
const sl=(id,lab,min,max,step,val,out)=>`<div class="row"><label for="ls_${id}">${lab}</label><output id="lso_${id}">${out}</output><input type="range" id="ls_${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
const fmtSig=(s,g)=>s.toFixed(g.u==="mA"?1:2)+" "+g.u;
/* the transmitter sends sig; the controller converts with the range it was set up for. Live-zero inputs flag a signal well below the bottom. */
const model=S=>{const m=MEAS[S.m],g=G[S.g],v=m.lo+(m.hi-m.lo)*S.val/100,sig=S.brk?0:C.toSig(v,m.lo,m.hi,g),gi=S.mis&&S.g===2?G[1]:g,rd=C.toEng(sig,m.lo,m.hi,gi);
 const fault=gi.live&&sig<gi.lo-(gi.hi-gi.lo)*0.0125;return {m,g,gi,v,sig,rd,fault,err:rd-v,v250:g.u==="mA"?sig*0.25:null}};
/* ---------- drawings ---------- */
const xmtr=(x,y,m,o={})=>{let s=C.duct(x-70,y-110,190,46);
 if(m===0)s+=`<path d="M${x-10} ${y-64} V${y-40} M${x+10} ${y-64} V${y-48} H${x+40} V${y-34}" stroke="#2f6fd6" stroke-width="3" fill="none"/>`;
 else s+=`<rect x="${x-2}" y="${y-100}" width="4" height="62" fill="#c9d0d4" stroke="#7a8288" stroke-width=".6"/>`;
 s+=`<rect x="${x-44}" y="${y-40}" width="88" height="70" rx="6" fill="url(#zPlastic)" stroke="#8f887a"/><rect x="${x-32}" y="${y-30}" width="64" height="22" rx="2" fill="#15191c"/><text x="${x}" y="${y-14}" style="font:500 12px var(--mono);fill:#7CFFB2;text-anchor:middle">${o.disp||""}</text>`;
 s+=`<text x="${x}" y="${y+16}" style="font:600 10px var(--display);letter-spacing:.06em;fill:#3a3f43;text-anchor:middle">${o.out||"4-20 mA"}</text>`;
 return s};
function scene(R,S){const m=R.m,g=R.g;let s=xmtr(110,150,S.m,{disp:(+R.v).toFixed(m.d),out:g.n});
 s+=K.lbl(110,206,m.n.toUpperCase()+" TRANSMITTER",{size:12});
 const bw=S.brk;s+=bw?C.wire("M130 180 V190 H200")+C.wire("M222 190 H325 V164"):C.wire("M130 180 V190 H325 V164");s+=C.wire("M90 180 V232 H520 V160","#c0281c")+C.wire("M355 164 V190 H500 V160");
 if(bw)s+=K.tag(212,176,"BROKEN",{fill:"var(--bad)"});
 s+=`<g transform="translate(340 120) scale(.62)">`+C.meter(0,0,fmtSig(R.sig,g),g.u==="mA"?"DC mA":"DC VOLTS")+`</g>`;
 s+=C.ddc(470,30,230,130,{screen:R.fault?"SIGNAL FAULT":fv(m,R.rd),fs:16,name:"AI: "+R.gi.n+" INPUT"});
 /* scaling chart */
 const Y0=g.lo,Y1=g.hi;s+=K.chart({x:110,y:262,w:500,h:88,X:[m.lo,m.hi],Y:[0,g.hi],xt:[m.lo,(m.lo+m.hi)/2,m.hi],yt:g.live?[g.lo,g.hi]:[0,g.hi],xf:v=>+v.toFixed(2),yf:v=>v+" "+g.u,
  series:[{f:v=>C.toSig(v,m.lo,m.hi,g),c:"var(--brass)",w:3}],bands:g.live?[{y0:0,y1:g.lo,c:"#c0392b"}]:[],dots:[{x:R.v,y:R.sig,c:R.fault?"var(--bad)":C.AIR}]});
 if(g.live)s+=K.txt(610,256,"red band: below "+g.lo+" "+g.u+" = fault",{a:"end",fill:"var(--bad)"});
 return s}
/* ---------- steps ---------- */
const steps=[
 {t:"Thermistors and RTDs",
  body:`<p>Most HVAC temperature sensors are just <b>resistors that change with temperature</b>. The controller measures the ohms.</p><ul><li><b>Thermistor</b> (NTC): resistance <b>falls</b> as it warms, by a lot and not in a straight line. A 10K thermistor is 10,000 Ω at 77°F.</li><li><b>RTD</b> (platinum): resistance <b>rises</b> as it warms, almost in a straight line. A 1000 Ω RTD (Pt1000) is 1000 Ω at 32°F and about 1385 Ω at 212°F.</li></ul><p>Thermistors are cheap and sensitive. RTDs are more linear and stable over wide ranges.</p>`,
  draw:()=>K.chart({x:90,y:40,w:250,h:250,X:[30,110],Y:[0,35],xt:[30,50,70,90,110],yt:[0,10,20,30],xf:v=>v+"°",yf:v=>v+"k",xl:"°F",yl:"kΩ",title:"10K THERMISTOR (TYPE II)",series:[{f:F=>C.thR(F)/1000,c:"var(--cold)",n:80}],dots:[{x:77,y:10,c:"var(--cold)",lbl:"10 kΩ AT 77°F",dx:8,dy:-12}]})
   +K.chart({x:440,y:40,w:250,h:250,X:[30,110],Y:[950,1200],xt:[30,50,70,90,110],yt:[1000,1050,1100,1150,1200],xf:v=>v+"°",yf:v=>v,xl:"°F",yl:"Ω",title:"1000 Ω RTD (Pt1000)",series:[{f:F=>C.rtd(F),c:"var(--hot)",n:40}],dots:[{x:32,y:1000,c:"var(--hot)",lbl:"1000 Ω AT 32°F",dx:10,dy:24}]})},
 {t:"Check one with a meter",
  body:`<p>To check a resistance sensor: <b>lift its wires</b> off the controller (the input's own voltage throws off the reading), read ohms across the sensor, and look up the temperature on the maker's chart. Compare it with a good thermometer next to the sensor.</p><ul><li>Reads <b>open</b> (OL): broken wire or dead sensor. The controller shows its coldest value for a thermistor.</li><li>Reads near <b>0 Ω</b>: shorted wires. A thermistor then reads very hot.</li></ul><p>Drag the temperature and compare the two sensors.</p>`,
  init:{t:72},ctl:{html:sl("t","Sensor temperature",30,110,1,72,"72°F"),input:(t,s)=>{s.t=+t.value;document.getElementById("lso_t").textContent=t.value+"°F"}},
  draw:s=>{const T=s.t??72;let o=C.meter(180,160,C.fmtR(C.thR(T)),"OHMS")+C.meter(540,160,C.fmtR(C.rtd(T)),"OHMS");
   o+=K.lbl(180,60,"10K THERMISTOR",{size:14})+K.lbl(540,60,"Pt1000 RTD",{size:14});
   o+=C.probe(180,300,40).replace("y=\"","y=\"")+C.wire("M156 226 V290 H172")+C.wire("M204 226 V290 H188","#c0281c")+C.probe(540,300,40)+C.wire("M516 226 V290 H532")+C.wire("M564 226 V290 H548","#c0281c");
   return o+K.lbl(360,180,T+"°F",{size:30,fill:K.tcol(T)})+K.txt(360,210,"both sensors here")+K.txt(180,364,"falls as it warms")+K.txt(540,364,"rises as it warms")}},
 {t:"Transmitters send a standard signal",
  body:`<p>Pressure, humidity, CO₂ and long-distance temperature readings go through a <b>transmitter</b>. It measures and sends one of three standard signals:</p><ul><li><b>4 to 20 mA</b>: a current. The same in every part of the loop, so long wires and so-so terminations don't change it.</li><li><b>0 to 10 V</b>: a voltage. Simple, but long runs and noise can pull it off.</li><li><b>2 to 10 V</b>: a voltage with a raised bottom, like 4 to 20 mA.</li></ul><p>Each one maps the bottom of the range to the low signal and the top to the high signal. A BAPI 0 to 100°F transmitter sends 4 mA at 0°F and 20 mA at 100°F.</p>`,
  draw:()=>{const b=(y,g,lbl)=>C.bar(140,y,460,{row:true,max:g.u==="mA"?24:12,rh:26,unit:g.u,lab:g.u==="mA"?4:2,ranges:[{a:g.lo,b:g.hi,c:g.live?C.AIR:"#6b8f8d",lbl:g.lo+" TO "+g.hi+" "+g.u+" = 0 TO 100%"}]})+K.lbl(130,y+18,lbl,{a:"end",size:13});
   return b(40,G[0],"CURRENT")+b(150,G[1],"VOLTAGE")+b(260,G[2],"VOLTAGE")}},
 {t:"Scaling a signal to real units",
  body:`<p>The controller has to be told the transmitter's range so it can turn the signal back into units. That's <b>scaling</b>:</p><p class="lsKey">Value = low + (signal − signal low) ÷ signal span × (high − low)</p><p>A 0 to 2 in. w.c. duct static transmitter on 4 to 20 mA, reading 12 mA: (12 − 4) ÷ 16 = 0.5, so 0.5 × 2 = <b>1.0 in. w.c.</b></p><p>Every 1 mA here is 2 ÷ 16 = 0.125 in. w.c. Drag the current.</p>`,
  math:`<p>4 to 20 mA: % = (mA − 4) ÷ 16. 0 to 10 V: % = V ÷ 10. 2 to 10 V: % = (V − 2) ÷ 8.</p><p>Then value = low + % × (high − low).</p>`,
  init:{ma:12},ctl:{html:sl("ma","Signal",4,20,0.5,12,"12.0 mA"),input:(t,s)=>{s.ma=+t.value;document.getElementById("lso_ma").textContent=K.f1(t.value)+" mA"}},
  draw:s=>{const ma=s.ma??12,v=C.toEng(ma,0,2,G[0]);
   let o=K.chart({x:110,y:40,w:480,h:240,X:[0,2],Y:[0,20],xt:[0,0.5,1,1.5,2],yt:[0,4,8,12,16,20],xf:v=>v,yf:v=>v+" mA",xl:"duct static, in. w.c.",yl:"",title:"0 TO 2 IN. W.C. TRANSMITTER, 4 TO 20 mA",series:[{f:x=>C.toSig(x,0,2,G[0]),c:"var(--brass)"}],dots:[{x:v,y:ma,c:C.AIR,lbl:K.f1(ma)+" mA → "+K.f2(v)+" in.",dx:12,dy:16}]});
   const X=x=>110+x/2*480,Y=y=>280-y/20*240;o+=`<path d="M110 ${Y(ma)} H${X(v)} V280" stroke="${C.AIR}" stroke-width="1.6" stroke-dasharray="5 4" fill="none"/>`;
   return o+K.lbl(360,370,`(${K.f1(ma)} − 4) ÷ 16 × 2 = ${K.f2(v)} IN. W.C.`,{size:15})}},
 {t:"Why 4 mA, not 0: the live zero",
  body:`<p>Cut the wire on a 0 to 10 V sensor and the controller sees 0 V. That's also what a <b>real</b> reading at the bottom of the range looks like. The controller can't tell the difference.</p><p>Cut a 4 to 20 mA loop and the current drops to <b>0 mA</b>, well below 4. Nothing real ever sends that, so the controller flags a <b>fault</b>. That's the <b>live zero</b>, the same idea as 3 psi in pneumatics. 2 to 10 V works the same way.</p><p>The 4 mA also powers the transmitter: a two-wire transmitter runs on the loop's own current. At the controller a 250 Ω resistor turns 4 to 20 mA into 1 to 5 V.</p>`,
  draw:()=>K.cards([{t:"0-10 V, WIRE CUT",c:"var(--bad)",inner:K.lcd(90,70,"0.00 V",110)+K.lcd(240,70,"0.0°F",100)+K.txt(90,110,"at the input")+K.txt(240,110,"controller shows"),note:"looks like a real 0°F: no alarm"},
   {t:"4-20 mA, WIRE CUT",c:"var(--ok)",inner:K.lcd(90,70,"0.0 mA",110)+K.lcd(240,70,"FAULT",100)+K.txt(90,110,"below 4 mA")+K.txt(240,110,"controller shows"),note:"impossible value: alarm"},
   {t:"4-20 mA AT 0°F, REAL",c:"var(--cold)",inner:K.lcd(90,70,"4.0 mA",110)+K.lcd(240,70,"0.0°F",100)+K.txt(90,110,"live zero")+K.txt(240,110,"real reading"),note:"bottom of range is still 4 mA"},
   {t:"250 Ω RESISTOR",c:"var(--brass)",inner:`<rect x="40" y="60" width="90" height="22" rx="6" fill="#d9c8a0" stroke="#7a6a40"/>${[58,74,90,106].map(x=>`<rect x="${x}" y="60" width="5" height="22" fill="${["#c0392b","#2f8f3a","#3a2a1a","#c9a227"][(x-58)/16]}"/>`).join("")}<path d="M20 71 H40 M130 71 H150" stroke="#888" stroke-width="2"/>`+K.txt(250,66,"4 mA → 1 V")+K.txt(250,90,"20 mA → 5 V"),note:"V = mA × 0.25"}])}];
/* ---------- See it ---------- */
const see=K.see({init:{m:0,val:50,g:0,brk:false,mis:false},vb:"0 0 720 380",
 sliders:[["m","Transmitter",0,2,1,v=>MEAS[v].n],["val","Actual value",0,100,1,v=>{const m=MEAS[(K.SEE||{}).m||0];return fv(m,m.lo+(m.hi-m.lo)*v/100)}],["g","Output signal",0,2,1,v=>G[v].n]],
 checks:[["brk","Signal wire broken"],["mis","Controller input set up as 0-10 V"]],
 model,draw:scene,
 reads:(R,S)=>[["Actual",fv(R.m,R.v)],["Signal",fmtSig(R.sig,R.g)],["Percent of range",K.f0((R.sig-R.g.lo)/(R.g.hi-R.g.lo)*100)+"%"],["Controller reads",R.fault?"FAULT":fv(R.m,R.rd),R.fault||Math.abs(R.err)>(R.m.hi-R.m.lo)*0.005],["Error",R.fault?"flagged":(R.err>=0?"+":"")+R.err.toFixed(R.m.d+1)+R.m.u,!R.fault&&Math.abs(R.err)>(R.m.hi-R.m.lo)*0.005],["Volts on a 250 Ω resistor",R.v250==null?"n/a (voltage signal)":K.f2(R.v250)+" V"]],
 note:(R,S)=>S.brk&&!R.fault?`<b class="bad">Broken wire, no alarm:</b> 0 V on a 0 to 10 V input looks like a real ${fv(R.m,R.m.lo)}.`:R.fault?"Live zero: the signal is below the bottom of the range, so the controller knows the loop is broken.":S.mis&&S.g===2?`<b class="bad">Scaling mismatch:</b> a 2 to 10 V transmitter read as 0 to 10 V reads high, most at the bottom of the range.`:S.mis?"The 0 to 10 V setup only matters for a 2 to 10 V transmitter here.":"Signal and scaling match: the controller reads the true value.",
 log:[["Signal",(R,S)=>R.g.n],["Wire",(R,S)=>S.brk?"cut":"ok"],["Sends",R=>fmtSig(R.sig,R.g)],["Reads",R=>R.fault?"FAULT":fv(R.m,R.rd)]]});
/* ---------- Try it ---------- */
const tasks=[
 K.goal({t:"Send 8 mA",intro:"On the <b>duct static</b> transmitter with a <b>4 to 20 mA</b> output, set the duct pressure so the loop carries <b>8.0 mA</b>.",
  check:(S,R)=>S.m!==0?"Pick the duct static transmitter.":S.g!==0?"Set the output to 4-20 mA.":S.brk?"Fix the wire first.":Math.abs(R.sig-8)<0.05?true:`The loop carries ${K.f1(R.sig)} mA.`,
  ok:"0.50 in. w.c.: (8 − 4) ÷ 16 = 25% of the 0 to 2 in. range."}),
 K.goal({t:"Cut the wire twice",intro:"With the wire <b>broken</b>, log a reading on <b>0-10 V</b> and another on <b>4-20 mA</b>. Compare what the controller shows.",
  check:(S,R,L)=>{const a=L.some(l=>l.S.brk&&l.S.g===1),b=L.some(l=>l.S.brk&&l.S.g===0);return a&&b?true:!a?"Log a broken-wire reading on 0-10 V.":"Now log one on 4-20 mA."},
  ok:"0-10 V just showed the bottom of the range as if it were real. 4-20 mA showed a fault. That's why critical points use a live-zero signal."}),
 K.caseTask({t:"Service call: duct static reads 0.4 in. w.c. with the fan off",intro:"A new 2 to 10 V duct static transmitter was installed last week. With the supply fan off, the BAS still shows 0.40 in. w.c., and at full flow the fan runs slower than before.",
  state:{m:0,val:0,g:2,brk:false,mis:true},model,draw:scene,
  reads:R=>[["BAS shows",fv(R.m,R.rd)],["Fan","off"]],
  actions:[["Measure volts at the AI",R=>`${K.f2(R.sig)} V DC at the controller terminals.`],["Check the tubing",()=>"Tubing is tight and the high and low ports are on the right sides."]],
  causes:[["scale","Controller input still scaled 0-10 V"],["tube","Leaking sensing tube"],["brk","Broken signal wire"],["bad","Failed transmitter"]],ans:"scale",
  why:"2.00 V is exactly the bottom of a 2 to 10 V transmitter: it's reading zero correctly. The controller is still set for 0 to 10 V, so it reads 2 V as 20% of 2 in. = 0.40 in. w.c. The fan loop thinks it has more pressure than it does and slows down. Set the input to 2 to 10 V.",
  hint:"The transmitter sends 2 V at zero pressure. What would a 0-10 V input make of 2 V?"})];
window.LESSON={id:"ctl-sig",sec:"Controls",secHref:"/controls/",title:"Sensors and signals: thermistors, RTDs, volts and 4-20 mA",lead:"How resistance sensors and transmitters report to a controller, how to scale a signal to real units, and why 4 to 20 mA starts at 4.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["Resistance sensors: <b>ohms</b> with the wires lifted, against the maker's chart.","Voltage signals: <b>DC volts</b> across the input terminals, live.","Current loops: <b>mA</b> in series (break the loop) or with a mA clamp meter.","The controller's <b>input setup</b>: sensor type or signal range and the scaling."],
  table:[["Signal","Bottom","Top","Broken wire reads"],["10K thermistor (Type II)","about 32.7 kΩ at 32°F","about 1.75 kΩ at 158°F","Open: coldest value"],["Pt1000 RTD","1000 Ω at 32°F","about 1385 Ω at 212°F","Open: hottest or fault"],["4-20 mA","4 mA","20 mA","0 mA: fault"],["0-10 V","0 V","10 V","0 V: looks real"],["2-10 V","2 V","10 V","0 V: fault"]],tableT:"Signals and what a broken wire looks like",
  steps:["Find the transmitter's range on its label or setup (e.g. 0 to 2 in. w.c., 0 to 100°F).","Measure the signal live.","Work out the value by hand: low + % × (high − low).","Compare with what the BAS shows. A difference means wrong scaling or wrong sensor type.","Compare with a test instrument (manometer, thermometer, hygrometer) at the sensor."],stepsT:"Checking a scaled input",
  safety:["Breaking a 4-20 mA loop to read it drops the reading to a fault: warn the operator or put the point in manual first."],
  mistakes:["Scaling a 2-10 V transmitter as 0-10 V (reads high at the bottom).","Reading thermistor ohms with the wires still landed.","Mixing 10K Type II and Type III sensors on the same input setup."]}),
 sources:[["The Engineering Mindset: temperature sensors explained (thermistors and RTDs)","https://theengineeringmindset.com/temperature-sensors-explained/"],["BAPI: the science of 4 to 20 mA current loops (loop power, same current in the loop, 250 Ω = 1 to 5 V)","https://bapihvac.com/?p=141928"],["BAPI: temperature transmitters (1000 Ω RTD, 0 to 100°F = 4 to 20 mA, 0-10 V and 2-10 V options)","https://bapi-headless.vercel.app/en/sensor-specs/temperature-transmitters"],["Siemens / ASHRAE: building automation systems basics (0-10 V, 2-10 V, 4-20 mA)","https://ctashrae.starchapter.com/downloads/Meeting_Presentations/siemens___building_automation_systems_basics___october_2024_ashrae.pdf"],["4-20 mA vs 0-20 mA: live zero explained","https://industrialmonitordirect.com/blogs/knowledgebase/4-20ma-current-loop-vs-0-20ma-live-zero-explained"]]};
})();
