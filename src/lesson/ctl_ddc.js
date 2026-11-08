/* ============ Lesson: DDC points: AI, AO, BI, BO ============ */
(()=>{
const C=CTK,FLA=6.8,NOLOAD=2.4;
const sl=(id,lab,min,max,step,val,out)=>`<div class="row"><label for="ls_${id}">${lab}</label><output id="lso_${id}">${out}</output><input type="range" id="ls_${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
/* AI: 10K Type II thermistor. AO: 0-100% as 2-10 V. BO: relay to the starter. BI: current switch on one motor lead. */
const model=S=>{const ohm=S.open?Infinity:C.thR(S.room),ai=S.open?-40:C.thF(ohm),v=2+0.08*S.cmd,amps=S.bo?(S.belt?NOLOAD:FLA):0,bi=amps>S.trip;
 return {ohm,ai,v,pos:S.cmd,amps,bi,bo:!!S.bo,alarm:!!S.bo&&!bi,run:!!S.bo,sens:S.open?"open":"ok"}};
const fmtOhm=r=>isFinite(r)?C.fmtR(r):"OL (open)";
/* ---------- field devices ---------- */
const motor=(x,y,run,belt)=>{let s=`<rect x="${x-34}" y="${y-24}" width="68" height="48" rx="8" fill="url(#zMotor)" stroke="#2a2f33"/>${[0,1,2,3,4].map(i=>`<rect x="${x-28+i*13}" y="${y-24}" width="3" height="48" fill="#000" opacity=".18"/>`).join("")}<rect x="${x+34}" y="${y-5}" width="12" height="10" fill="#9aa3a9"/><circle cx="${x+52}" cy="${y}" r="10" fill="#5f686d" stroke="#2a2f33"/>`;
 s+=`<circle cx="${x+52}" cy="${y-74}" r="24" fill="url(#zSteel)" stroke="#3a4247" stroke-width="2"/><circle cx="${x+52}" cy="${y-74}" r="5" fill="#3a4247"/>`;
 if(!belt)s+=`<path d="M${x+42} ${y-2} L${x+30} ${y-70} M${x+62} ${y-2} L${x+75} ${y-70}" stroke="#1d2125" stroke-width="4"/>`;else s+=`<path d="M${x+42} ${y-2} q-18 20 -36 26" stroke="#1d2125" stroke-width="4" fill="none"/>`;
 return s};
const relay=(x,y,on)=>`<rect x="${x-30}" y="${y-22}" width="60" height="44" rx="4" fill="url(#zPlastic)" stroke="#8f887a"/><circle cx="${x+18}" cy="${y-10}" r="4" fill="${on?"#ff8a3d":"#59636a"}"/><path d="M${x-18} ${y+8} h10 ${on?"l16 0":"l14 -8"} M${x+8} ${y+8} h10" stroke="#2a2f33" stroke-width="2.4" fill="none"/>`;
const cs=(x,y,closed)=>`<circle cx="${x}" cy="${y}" r="18" fill="none" stroke="#e2b324" stroke-width="9"/><circle cx="${x}" cy="${y}" r="18" fill="none" stroke="#8a6a10" stroke-width="1"/><circle cx="${x+16}" cy="${y-16}" r="4" fill="${closed?"#ff3b30":"#59636a"}"/>`;
/* ---------- the whole point map ---------- */
function scene(R,S){let s="";
 s+=C.ddc(250,90,220,220,{screen:R.alarm?"FAN FAIL ALARM":S.open&&!R.alarm?"SENSOR FAULT?":"AHU-1 OK",fs:14,name:"DDC CONTROLLER"});
 s+=C.term(266,170,2,"","#2f6fd6")+C.term(266,250,2,"","#2f8f3a")+C.term(406,170,2,"","#7a5cd0")+C.term(406,250,2,"","#c06a2a");const tl=(x,y,t)=>`<text x="${x}" y="${y}" style="font:600 12px var(--display);letter-spacing:.08em;fill:#dfe5e8">${t}</text>`;s+=tl(320,175,"AI1")+tl(320,255,"AO1")+tl(368,175,"BI1")+tl(368,255,"BO1");
 s+=K.txt(288,204,isFinite(R.ohm)?K.f1(R.ai)+"°F":"-40°F",{fill:"#cfe3f3"})+K.txt(288,284,K.f1(R.v)+" V",{fill:"#c9f0cf"})+K.txt(428,204,R.bi?"ON":"OFF",{fill:"#e4dcff"})+K.txt(428,284,R.bo?"ON":"OFF",{fill:"#ffd9bf"});
 /* AI room sensor */
 s+=`<rect x="20" y="30" width="170" height="110" rx="6" fill="var(--paper)" stroke="#a89a85"/>`+K.lbl(30,52,"ROOM",{a:"start",size:12})+C.wallSensor(150,84,1)+K.lbl(80,98,K.f1(S.room)+"°F",{size:20});
 s+=S.open?C.wire("M150 108 V130")+C.wire("M150 142 V158 H277 V164"):C.wire("M150 108 V158 H277 V164");s+=C.wire("M160 108 V150 H299 V164","#c0281c");
 if(S.open)s+=K.tag(120,134,"BROKEN",{fill:"var(--bad)"});
 /* AO valve */
 s+=C.pipe("M30 330 H200",C.HW,8)+C.valve(110,330,{s:.6,kind:"el",open:S.cmd/100,x:S.cmd/100,sig:K.f1(R.v)+" V"})+C.wire("M277 256 V300 H118 V258")+K.lbl(110,370,"VALVE "+K.f0(S.cmd)+"% OPEN",{size:12});
 /* BO relay to starter, BI current switch on a motor lead */
 s+=relay(610,300,R.bo)+C.wire("M439 256 V300 H580","#c06a2a")+K.lbl(610,345,"STARTER RELAY",{size:12});
 s+=motor(600,170,R.run,!!S.belt)+C.wire("M610 278 V210 H560 V194","#1d2125")+cs(560,214,R.bi)+C.wire("M439 164 V130 H530 V214 H542","#7a5cd0");
 s+=K.lbl(700,214,R.run?K.f1(R.amps)+" A":"0 A",{a:"end",size:14})+K.lbl(700,234,"TRIP "+K.f1(S.trip)+" A",{a:"end",size:12,fill:"#7a5cd0"});
 if(S.belt)s+=K.tag(640,46,"BELT OFF",{fill:"var(--bad)"});
 return s}
/* ---------- steps ---------- */
const steps=[
 {t:"Four kinds of points",
  body:`<p>A DDC controller only knows the world through its <b>points</b>: the wires landed on its terminals. Every point is one of four kinds:</p><ul><li><b>AI, analog input</b>: a value that varies. Temperature, humidity, pressure, flow.</li><li><b>AO, analog output</b>: a variable command. Valve or damper position, VFD speed.</li><li><b>BI, binary input</b>: a yes or no coming in. Fan proven, filter dirty, freezestat tripped.</li><li><b>BO, binary output</b>: a yes or no going out. Start a fan, enable a pump.</li></ul><p>Binary points are also called <b>digital</b> (DI and DO). Same thing.</p>`,
  draw:()=>K.cards([{t:"AI: ANALOG INPUT",c:"#2f6fd6",inner:C.wallSensor(50,90,1.1)+K.lbl(100,72,"ROOM SENSOR",{a:"start",size:13})+K.txt(100,96,"10K thermistor: 72.0°F",{a:"start"})+K.txt(100,118,"also: duct static, humidity",{a:"start"}),note:"a value comes in"},
   {t:"AO: ANALOG OUTPUT",c:"#2f8f3a",inner:C.valve(60,120,{s:.55,kind:"el",open:.6,x:.6,sig:"6.8 V"})+K.lbl(120,72,"VALVE ACTUATOR",{a:"start",size:13})+K.txt(120,96,"2-10 V: 60% open",{a:"start"})+K.txt(120,118,"also: dampers, VFD speed",{a:"start"}),note:"a variable command goes out"},
   {t:"BI: BINARY INPUT",c:"#7a5cd0",inner:cs(60,90,true)+`<path d="M20 90 H100" stroke="#1d2125" stroke-width="3"/>`+K.lbl(110,72,"CURRENT SWITCH",{a:"start",size:13})+K.txt(110,96,"fan amps over trip: ON",{a:"start"})+K.txt(110,118,"also: freezestat, filter",{a:"start"}),note:"a yes or no comes in"},
   {t:"BO: BINARY OUTPUT",c:"#c06a2a",inner:relay(60,90,true)+K.lbl(110,72,"RELAY",{a:"start",size:13})+K.txt(110,96,"fan start/stop: ON",{a:"start"})+K.txt(110,118,"also: pump enable",{a:"start"}),note:"a yes or no goes out"}])},
 {t:"AI: the controller reads a sensor",
  body:`<p>A room sensor is usually a <b>10K thermistor</b>: a resistor whose resistance <b>falls</b> as it warms. 10,000 Ω at 77°F, about 32,650 Ω at 32°F (Type II curve).</p><p>The AI terminal measures the resistance and the controller looks it up on the sensor's curve to get °F. That's why the controller has to be told which sensor type is landed.</p><p>Other AIs send a <b>4 to 20 mA</b> or <b>0 to 10 V</b> signal instead (lesson 5). Drag the room.</p>`,
  init:{t:72},ctl:{html:sl("t","Room temperature",40,100,1,72,"72°F"),input:(t,s)=>{s.t=+t.value;document.getElementById("lso_t").textContent=t.value+"°F"}},
  draw:s=>{const T=s.t??72,r=C.thR(T);let o=`<rect x="30" y="40" width="200" height="300" rx="8" fill="var(--paper)" stroke="#a89a85"/>`+C.wallSensor(180,150,1.6)+K.lbl(90,240,T+"°F",{size:26,fill:K.tcol(T)})+K.lbl(90,266,"ROOM",{size:12});
   o+=C.wire("M176 190 V320 H470 V250")+C.wire("M186 190 V310 H492 V250","#c0281c")+C.meter(340,170,C.fmtR(r),"OHMS");
   o+=C.ddc(440,80,240,180,{screen:"RM-T "+K.f1(C.thF(r))+"°F",fs:16,name:"AI1: 10K TYPE II"})+C.term(458,240,2,"","#2f6fd6");
   return o+K.txt(600,290,"ohms fall as it warms")}},
 {t:"AO: the controller moves something",
  body:`<p>An analog output sends a <b>variable</b> signal, usually <b>2 to 10 V</b> or 0 to 10 V, sometimes 4 to 20 mA. The actuator moves in proportion:</p><p class="lsKey">2 V = 0%, 6 V = 50%, 10 V = 100%</p><p>The controller's program (often a PI loop) picks the percent. The AO turns it into volts. Valve actuators, damper actuators and VFD speed inputs are all AOs.</p><p>Many actuators also send a feedback signal back on an AI, so the controller can see where it really went.</p>`,
  math:`<p>Volts = 2 + 8 × (command % ÷ 100) for a 2 to 10 V output.</p>`,
  init:{c:50},ctl:{html:sl("c","Valve command",0,100,5,50,"50%"),input:(t,s)=>{s.c=+t.value;document.getElementById("lso_c").textContent=t.value+"%"}},
  draw:s=>{const c=s.c??50,v=2+0.08*c;let o=C.ddc(30,80,220,180,{screen:"HW-V "+c+"%",fs:16,name:"AO1: 2-10 V"})+C.term(48,240,2,"","#2f8f3a");
   o+=C.wire("M59 246 V320 H300")+C.wire("M81 246 V308 H300","#c0281c")+C.meter(350,200,K.f2(v)+" V","DC VOLTS")+C.wire("M400 308 H466 V160 H526")+C.wire("M400 320 H478 V170 H526","#c0281c");
   o+=C.pipe("M492 300 H700",C.HW)+C.valve(560,300,{s:1,kind:"el",open:c/100,x:c/100,sig:K.f1(v)+" V"})+K.tag(600,360,K.f0(c)+"% OPEN",{fill:C.HW});
   return o}},
 {t:"BI: is it really running?",
  body:`<p>A binary input looks at a <b>contact</b>: open or closed. The controller reads it as OFF or ON.</p><p>The classic BI is <b>fan status</b> from a <b>current switch</b> clamped around one motor lead. When the motor draws more than the trip setting, the switch closes. A running fan pulls about ${FLA} A here; with the belt off the motor spins free and pulls only about ${NOLOAD} A.</p><p>So the trip has to sit <b>between</b> the two, or a broken belt still reads ON. Other BIs: freezestat, filter differential pressure switch, high static safety, smoke detector.</p>`,
  init:{tr:1.5,b:0},ctl:{html:sl("tr","Current switch trip",0.5,8,0.5,1.5,"1.5 A")+sl("b","Belt",0,1,1,0,"on"),input:(t,s)=>{if(t.id==="ls_tr"){s.tr=+t.value;document.getElementById("lso_tr").textContent=K.f1(t.value)+" A"}else{s.b=+t.value;document.getElementById("lso_b").textContent=+t.value?"broken":"on"}}},
  draw:s=>{const tr=s.tr??1.5,b=!!s.b,a=b?NOLOAD:FLA,on=a>tr;let o=motor(170,260,true,b)+C.wire("M180 238 V120 H240","#1d2125")+cs(240,170,on);
   o+=K.lbl(120,330,"MOTOR "+K.f1(a)+" A",{size:14})+C.wire("M258 170 H460")+C.ddc(460,80,220,180,{screen:"SF-S "+(on?"ON":"OFF"),fs:16,name:"BI1: FAN STATUS"})+C.term(478,240,2,"","#7a5cd0");
   o+=K.chart({x:60,y:30,w:330,h:60,X:[0,8],Y:[0,1],xt:[0,2,4,6,8],xf:v=>v+" A",series:[],vlines:[{x:tr,c:"#7a5cd0",lbl:"TRIP"}],dots:[{x:FLA,y:.5,c:"var(--ok)",lbl:"RUNNING",a:"end",dx:-10,dy:5},{x:NOLOAD,y:.5,c:"var(--bad)",lbl:"BELT OFF",a:"start",dx:10,dy:5}]});
   if(b&&on)o+=K.tag(570,330,"STATUS LIES: BELT IS OFF",{fill:"var(--bad)"});
   return o}},
 {t:"BO: start and stop, then prove it",
  body:`<p>A binary output closes a <b>relay</b> in or near the controller. The relay switches 24 VAC to a <b>starter</b> coil or a VFD's run input. Fan start/stop, pump enable, exhaust fan, two-position dampers.</p><p>Good practice pairs every start <b>command</b> (BO) with a <b>status</b> (BI). If the command is ON and the status stays OFF for more than a short delay, the controller raises a <b>failure alarm</b> and shuts down what depends on it.</p><p>That's the whole AHU-1 point list in See it: one AI, one AO, one BI, one BO.</p>`,
  draw:()=>{const R=model({room:72,cmd:40,trip:4,bo:1,belt:0,open:0});return scene(R,{room:72,cmd:40,trip:4,bo:1,belt:0,open:0})}}];
/* ---------- See it ---------- */
const see=K.see({init:{room:72,cmd:40,trip:1.5,bo:true,belt:false,open:false},
 sliders:[["room","Room temperature",50,90,1,v=>v+"°F"],["cmd","Valve command (AO)",0,100,5,v=>v+"%"],["trip","Current switch trip",0.5,8,0.5,v=>K.f1(v)+" A"]],
 checks:[["bo","Fan command ON (BO)"],["belt","Belt broken"],["open","Room sensor wire broken"]],
 model,draw:scene,
 reads:(R,S)=>[["AI1 room sensor",fmtOhm(R.ohm)+" = "+K.f1(R.ai)+"°F",S.open],["AO1 heating valve",S.cmd+"% = "+K.f1(R.v)+" V"],["BO1 fan start",R.bo?"ON":"OFF"],["Motor current",K.f1(R.amps)+" A"],["BI1 fan status",R.bi?"ON":"OFF",R.bo&&!R.bi],["Fan failure alarm",R.alarm?"ALARM":"none",R.alarm]],
 note:(R,S)=>S.open?"<b class='bad'>Open sensor:</b> infinite resistance looks like the bottom of the curve, so the AI reads the lowest value it can (-40°F). A heating loop would drive the valve wide open.":S.bo&&S.belt&&R.bi?"<b class='bad'>The status lies.</b> The belt is off but the motor still draws more than the trip setting.":R.alarm?"Command ON, status OFF: the controller would alarm and shut down the heating loop.":"All four points agree with what's happening.",
 log:[["Trip",(R,S)=>K.f1(S.trip)],["Belt",(R,S)=>S.belt?"off":"on"],["Amps",R=>K.f1(R.amps)],["Status",R=>R.bi?"ON":"OFF"]]});
/* ---------- Try it ---------- */
const tasks=[
 K.goal({t:"Command 6 volts",intro:"Set the heating valve AO so the actuator gets <b>6.0 V</b>.",check:(S,R)=>Math.abs(R.v-6)<0.01?true:`It's getting ${K.f1(R.v)} V.`,ok:"50%: 2 V + 8 V × 0.5 = 6 V."}),
 K.goal({t:"Make the status honest",intro:"The fan is commanded on and the <b>belt is broken</b>, but the status still says ON. Set the current switch trip so a broken belt reads <b>OFF</b> (and alarms) while a running fan would still read <b>ON</b>.",
  check:(S,R)=>!S.bo?"Turn the fan command on.":!S.belt?"Tick Belt broken.":S.open?"Untick the broken sensor wire.":S.trip>=FLA?`At ${K.f1(S.trip)} A a good fan pulling ${FLA} A would read OFF too.`:!R.alarm?`The motor still pulls ${NOLOAD} A, which is over the ${K.f1(S.trip)} A trip.`:true,
  ok:(S)=>`Trip at ${K.f1(S.trip)} A: between the ${NOLOAD} A no-load and ${FLA} A running current. Now the alarm catches a thrown belt.`}),
 K.caseTask({t:"Service call: room is -40°F, valve wide open",intro:"The BAS shows AHU-1's room at -40°F and the heating valve at 100%. The office is actually hot.",
  state:{room:76,cmd:100,trip:4,bo:true,belt:false,open:true},model,draw:scene,
  reads:R=>[["AI1 room sensor",K.f1(R.ai)+"°F"],["AO1 valve",R.pos+"% = "+K.f1(R.v)+" V"],["BI1 fan status",R.bi?"ON":"OFF"]],
  actions:[["Lift the AI wires and read ohms",()=>"The meter reads OL (open) at the controller end."],["Read ohms at the sensor",()=>"Right at the sensor: 8.5 kΩ, about 81°F. The sensor is good."]],
  causes:[["open","Open wire between the sensor and the controller"],["short","Sensor wires shorted"],["ao","AO wired to the wrong valve"],["cold","The room really is that cold"]],ans:"open",
  why:"An open circuit is infinite resistance, past the cold end of the thermistor curve, so the AI reads its minimum. The loop sees a frozen room and drives the valve to 100%. The sensor reads right at its own terminals, so the break is in the wire.",
  hint:"A thermistor's resistance goes up as it gets colder. What reading does a cut wire give?"})];
window.LESSON={id:"ctl-ddc",sec:"Controls",secHref:"/controls/",title:"DDC points: AI, AO, BI and BO",lead:"The four kinds of points a DDC controller uses, with the sensor, valve, status and start/stop on a real air handler.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["The <b>points list</b> on the drawings or in the controller: every point's name, type and terminal.","<b>AI</b>: resistance or signal at the terminal, compared with a reference reading in the space.","<b>AO</b>: volts at the actuator vs the command on the screen.","<b>BI/BO</b>: command and status should agree."],
  table:[["Type","Example","What's on the wire"],["AI","Room temp, duct static, humidity","10K thermistor ohms, 4-20 mA, 0-10 V"],["AO","Valve, damper, VFD speed","2-10 V, 0-10 V or 4-20 mA"],["BI","Fan status, freezestat, filter switch","Dry contact: open or closed"],["BO","Fan start/stop, pump enable","Relay contact switching 24 VAC"]],tableT:"Point types",
  steps:["Find the point on the points list and the terminal it lands on.","AI: lift the wires and read ohms (thermistor) or measure mA or V live. Compare with a thermometer.","AO: override the command to 0, 50 and 100% and measure volts at the actuator.","BO: command it on and listen for the relay and starter.","BI: check the status changes with the equipment, not just with the command."],stepsT:"Checking points",
  safety:["The BO relay often switches a starter on 120 V or more: lock out before landing wires.","Release every override when you're done; a forgotten override is a hidden fault."],
  mistakes:["Setting a current switch trip so low it can't see a broken belt.","Landing a 10K Type III sensor on an input set for Type II: it reads a few degrees off.","Trusting the screen without checking the field device."]}),
 sources:[["The Engineering Mindset: variable air volume (thermostat, controller and actuator on a VAV box)","https://theengineeringmindset.com/variable-air-volume/"],["Siemens / ASHRAE: building automation systems basics (AI, AO, DI, DO with HVAC examples)","https://ctashrae.starchapter.com/downloads/Meeting_Presentations/siemens___building_automation_systems_basics___october_2024_ashrae.pdf"],["BAPI: thermistor specifications (10K at 77°F, resistance falls as it warms)","https://bapi-headless.vercel.app/hi/sensor-specs/thermistor"],["Belimo NRF24A-SR-O: 24 V spring-return actuator, 2-10 V control","https://tameson.com/products/actuator-modulating-2-10v-fail-safe-24-v-ac-dc-10nm-ip54-belimo-v2vt2"]]};
})();
