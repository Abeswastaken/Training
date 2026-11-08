/* ============ Lesson: Megger (insulation resistance) testing ============ */
(()=>{
const VOLTS=[250,500,1000,2500];
/* Insulation as the meter sees it. Current = leakage (V / R_leak) + absorption (falls off as t^-n). Both resistances halve for every 10°C rise.
 cond 0..10: R_leak at 20°C = 10^(0.4 × cond) MΩ (1 MΩ wet and dirty to 10,000 MΩ clean and dry). Absorption: 300 MΩ at 1 minute, 20°C, n = 0.62. */
const N=0.62,RA1=300;
const kT=T=>Math.pow(0.5,(T-20)/10);
const ir=(S,t)=>{const k=kT(S.temp),RL=Math.pow(10,0.4*S.cond)*k,V=VOLTS[S.v];let RLv=RL;
 if(S.crack){const Rc=1e5*Math.exp(-(V-250)/120);RLv=1/(1/RL+1/Rc)}
 const Ra=RA1*k*Math.pow(Math.max(t,0.05),N);return 1/(1/RLv+1/Ra)};
const to40=(R,T)=>R*Math.pow(0.5,(40-T)/10);
const model=S=>{const V=VOLTS[S.v],t=S.min,R=ir(S,t),R1=ir(S,1),R10=ir(S,10),PI=R10/R1,R1c=to40(R1,S.temp);
 const vOK=V===500||V===1000,minIEEE=5,kv1=0.46+1;
 const piTxt=PI<1?"dangerous":PI<2?"questionable":PI<4?"good":"excellent";
 const pass=R1c>=minIEEE&&PI>=2;
 return {V,t,R,R1,R10,PI,R1c,vOK,minIEEE,kv1,piTxt,pass,uA:V/R,cur:R1c<minIEEE?"low":"ok"}};
const fmtR=R=>R>=1000?MK.n0(R):R>=10?K.f0(R):R>=1?K.f1(R):K.f2(R);
/* motor with leads lifted, megger clipped on T1 and frame */
const rig=(R,S,o={})=>{let s=MK.motor(70,170,0.85,{box:true});
 const mx=470,my=110;s+=MK.megger(mx,my,{read:o.read??(fmtR(R.R)),sub:o.sub||(K.f1(R.t)+" MIN · "+R.V+" V DC"),hot:o.hot!==false,rot:[-70,-25,25,70][S.v]});
 // leads: red to T1 in the box, black to the frame ground
 s+=MK.wire(`M${mx+30} ${my+184} C ${mx-60} 330, 260 70, 168 152`,"#c0392b",3)+`<circle cx="168" cy="152" r="5" fill="#c0392b"/>`;
 s+=MK.wire(`M${mx+120} ${my+184} C ${mx+100} 360, 300 360, 250 262`,"#2c3034",3)+`<rect x="242" y="256" width="16" height="10" rx="2" fill="#2c3034"/>`;
 // lifted leads T1 T2 T3
 [0,1,2].forEach(i=>{s+=MK.wire(`M${150+i*14} 146 q ${-30+i*6} -60 ${-60+i*10} -90`,["#2c3034","#c0392b","#2f6fd6"][i],2.4)});
 s+=K.txt(120,48,"T1, T2, T3 lifted from the drive",{a:"start"});
 if(S.drive)s+=MK.wire("M90 56 H40",'var(--bad)',3)+K.tag(160,92,"STILL LANDED ON THE DRIVE",{fill:"var(--bad)",w:250});
 return s};
const steps=[
 {t:"What a megger measures",
  body:`<p>Copper windings are wrapped in insulation that keeps the current in the wire and off the steel frame. Heat, moisture, dirt and age slowly break it down.</p><p>An <b>insulation resistance tester</b> (a <b>megohmmeter</b>, or "megger") puts a high <b>DC test voltage</b> between the winding and the frame and measures the tiny current that leaks through. Resistance = volts ÷ current, shown in <b>megohms</b> (MΩ, millions of ohms).</p><p>A normal ohmmeter only uses a few volts. It reads "open" on insulation that would fail at 480 V.</p>`,
  math:`<p>500 V across 1,000 MΩ pushes 500 ÷ 1,000,000,000 = 0.5 µA. The meter measures that and shows 1,000 MΩ.</p><p>Leads: one on the winding (all three leads tied together, or one at a time), the other on a clean spot on the frame or the ground lug.</p>`,
  draw:()=>{const S={cond:8,temp:20,v:1,min:1,crack:false,drive:false};const R=model(S);return rig(R,S)}},
 {t:"Pick the test voltage",
  body:`<p>Test above the motor's working voltage, but not so high you damage good insulation. For motors rated up to 1,000 V, IEEE 43 says about <b>500 V DC</b>. Megger's guide gives <b>500 or 1,000 V DC</b> for 440 to 550 V equipment.</p><ul><li>120 to 240 V motors and controls: 250 or 500 V DC.</li><li>460 V motors: 500 or 1,000 V DC.</li><li>2,500 V and up: medium-voltage motors only.</li></ul><p>Use the same voltage every time on the same motor so the readings compare.</p>`,
  draw:()=>{const rows=[["Up to 100 V","100 and 250 V DC"],["440 to 550 V","500 and 1,000 V DC"],["2,400 V","1,000 to 2,500 V DC"],["4,160 V and up","1,000 to 5,000 V DC"]];let s=MK.megger(40,80,{read:"500",sub:"V DC SELECTED",hot:false,rot:-25});
   s+=`<rect x="240" y="60" width="450" height="${50+rows.length*52}" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(270,90,"EQUIPMENT RATING",{a:"start",size:13})+K.lbl(500,90,"DC TEST VOLTAGE",{a:"start",size:13});
   rows.forEach(([a,b],i)=>{const y=130+i*52,hi=i===1;if(hi)s+=`<rect x="250" y="${y-26}" width="430" height="40" rx="6" fill="var(--warn)" opacity=".18"/>`;s+=K.txt(270,y,a,{a:"start",fill:hi?"var(--ink)":null})+`<text x="500" y="${y}" style="font:600 15px var(--mono);fill:var(--ink)">${b}</text>`});
   return s+K.txt(465,350,"routine maintenance test voltages (Megger, A Stitch in Time)")}},
 {t:"What's a good reading?",
  body:`<p>The old rule for rotating machines is <b>1 MΩ per kV of rating, plus 1</b>. For a 460 V motor: 0.46 + 1 = about <b>1.5 MΩ</b>. That's the floor, not a healthy number.</p><p>IEEE 43 now sets the 1-minute minimum for modern random-wound motors (most motors under 600 V) at <b>5 MΩ</b>, corrected to 40°C. Form-wound medium-voltage stators: 100 MΩ.</p><p>A clean, dry motor usually reads hundreds or thousands of megohms. The best warning is a <b>downward trend</b> in your log.</p>`,
  draw:()=>{const L=v=>Math.log10(v),X=v=>110+(L(v)+0)/(4)*560;let s=`<path d="M110 250 H670" stroke="var(--muted)" stroke-width="2"/>`;
   [1,10,100,1000,10000].forEach(v=>{s+=`<path d="M${X(v)} 250 v8" stroke="var(--muted)"/>`+K.txt(X(v),278,MK.n0(v)+" MΩ")});
   s+=`<rect x="${X(1)}" y="200" width="${X(5)-X(1)}" height="40" fill="var(--bad)" opacity=".75"/><rect x="${X(5)}" y="200" width="${X(100)-X(5)}" height="40" fill="var(--warn)" opacity=".55"/><rect x="${X(100)}" y="200" width="${X(10000)-X(100)}" height="40" fill="var(--ok)" opacity=".6"/>`;
   s+=K.lbl((X(1)+X(5))/2,190,"FAIL",{size:13,fill:"var(--bad)"})+K.lbl((X(5)+X(100))/2,190,"WATCH IT",{size:13,fill:"var(--warn)"})+K.lbl((X(100)+X(10000))/2,190,"HEALTHY",{size:13,fill:"var(--ok)"});
   s+=`<path d="M${X(1.46)} 120 V250" stroke="var(--ink)" stroke-dasharray="4 4"/>`+K.tag(X(1.46)+8,124,"KV + 1 = 1.46 MΩ (OLD RULE)",{a:"start"});
   s+=`<path d="M${X(5)} 150 V250" stroke="var(--bad)" stroke-width="2"/>`+K.tag(X(5)+8,158,"IEEE 43: 5 MΩ AT 40°C",{a:"start",fill:"var(--bad)"});
   s+=K.lbl(390,60,"460 V RANDOM-WOUND MOTOR, 1-MINUTE READING",{size:15})+K.txt(390,320,"log scale: each mark is 10 times the last");return s}},
 {t:"Temperature changes the reading",
  body:`<p>Insulation resistance drops as the winding warms: roughly <b>half for every 10°C</b> (18°F) rise, and double for every 10°C drop.</p><p>So a motor that just stopped reads lower than the same motor cold. To compare readings, correct them to one temperature. IEEE 43 uses <b>40°C</b>.</p><p>Write the winding temperature (or room temperature for a motor that has sat idle) next to every reading.</p>`,
  math:`<p>Corrected to 40°C = reading × 0.5<sup>(40 − T)/10</sup>, with T the winding temperature in °C.</p><p>Example: 400 MΩ at 20°C → 400 × 0.5<sup>2</sup> = 100 MΩ at 40°C. 30 MΩ at 60°C → 30 × 0.5<sup>−2</sup> = 120 MΩ at 40°C.</p>`,
  draw:()=>{const S={cond:7.5,v:1,crack:false};const f=T=>ir({...S,temp:T},1);return K.chart({x:110,y:40,w:520,h:270,X:[0,80],Y:[0,1000],xt:[0,20,40,60,80],xf:v=>v+"°C",yt:[0,250,500,750,1000],xl:"winding temperature",yl:"1-minute MΩ",title:"SAME WINDING, DIFFERENT TEMPERATURES",
   series:[{f,c:"var(--cold)",lbl:"measured",lblAt:12,a:"start",dx:12,dy:-4}],vlines:[{x:40,lbl:"40°C reference",c:"var(--brass)"}],dots:[{x:20,y:f(20),c:"var(--cold)",lbl:K.f0(f(20))+" MΩ at 20°C"},{x:40,y:f(40),c:"var(--brass)",lbl:K.f0(f(40))+" MΩ at 40°C"},{x:60,y:f(60),c:"var(--hot)",lbl:K.f0(f(60))+" MΩ at 60°C",dy:-16}]})}},
 {t:"Polarization index: time tells",
  body:`<p>Hold the test voltage on and the reading climbs. Good insulation keeps absorbing charge, so its current keeps falling. Wet or dirty insulation leaks steadily, so the reading goes flat.</p><p>The <b>polarization index</b> (PI) = 10-minute reading ÷ 1-minute reading.</p><ul><li>Under 1: dangerous</li><li>1 to 2: questionable</li><li>2 to 4: good</li><li>Over 4: excellent</li></ul><p>PI doesn't depend much on temperature, because both readings are taken at the same one.</p>`,
  draw:()=>{const dry={cond:9,temp:20,v:1},wet={cond:4.5,temp:20,v:1};const Rd1=ir(dry,1),Rd10=ir(dry,10),Rw1=ir(wet,1),Rw10=ir(wet,10);
   return K.chart({x:110,y:40,w:520,h:270,X:[0,10],Y:[0,1200],xt:[0,1,2,4,6,8,10],xf:v=>v+" min",yt:[0,300,600,900,1200],xl:"time at 500 V DC",yl:"MΩ",title:"READING vs TIME",
   series:[{f:t=>ir(dry,t),c:"var(--ok)",lbl:"clean and dry: PI "+K.f1(Rd10/Rd1),lblAt:7,dy:-14},{f:t=>ir(wet,t),c:"var(--bad)",lbl:"damp: PI "+K.f1(Rw10/Rw1),lblAt:9.8,dy:-12}],
   vlines:[{x:1,lbl:"1 min"},{x:10}],dots:[{x:1,y:Rd1,c:"var(--ok)",dx:12,dy:20,lbl:K.f0(Rd1)},{x:10,y:Rd10,c:"var(--ok)",a:"end",dx:-12,lbl:K.f0(Rd10)},{x:1,y:Rw1,c:"var(--bad)",dx:12,dy:-12,lbl:K.f0(Rw1)}]})}},
 {t:"Do it safely",
  body:`<ul><li><b>Lock out</b> and verify zero voltage. On a drive, wait for the DC bus to discharge and measure it.</li><li><b>Disconnect the drive.</b> Lift T1, T2, T3 at the drive (or test at the motor). Test voltage on the drive's output can destroy its IGBTs and electronics.</li><li>Stand clear and keep others off the leads while testing: they carry up to 1,000 V.</li><li>The winding stores charge like a capacitor. <b>Discharge it</b> to ground after the test, for at least 4 times as long as the test ran. Most testers do this automatically: wait for the display to show zero volts before unclipping.</li></ul>`,
  draw:()=>{let s=MK.drive(40,70,150,230,{lcd1:"OFF",lcd2:"BUS 0 V"});s+=MK.wire("M115 300 V340 H230",'var(--muted)',3)+`<path d="M210 320 l40 40 M250 320 l-40 40" stroke="var(--bad)" stroke-width="5"/>`+K.txt(230,376,"leads lifted");
   s+=MK.motor(360,210,0.8,{box:true});s+=K.lbl(400,60,"1. LOCK OUT, VERIFY 0 V",{a:"start",size:13})+K.lbl(400,84,"2. LIFT THE LEADS AT THE DRIVE",{a:"start",size:13})+K.lbl(400,108,"3. TEST, HANDS OFF THE LEADS",{a:"start",size:13})+K.lbl(400,132,"4. DISCHARGE 4 × TEST TIME",{a:"start",size:13,fill:"var(--bad)"});return s}}];
/* ---------- See it ---------- */
const see=K.see({init:{v:1,min:1,temp:20,cond:7,crack:false,drive:false},
 sliders:[["v","Test voltage",0,3,1,v=>VOLTS[v]+" V DC"],["min","Time on test",0.25,10,0.25,v=>K.f2(v).replace(/0$/,"")+" min"],["temp","Winding temperature",0,80,5,v=>v+"°C ("+K.f0(v*1.8+32)+"°F)"],["cond","Insulation condition",0,10,0.5,v=>v<=2?v+": wet, dirty":v<=5?v+": damp":v<=8?v+": fair":v+": clean, dry"]],
 checks:[["crack","Cracked slot insulation"],["drive","Motor leads still landed on the drive"]],
 vb:"0 0 720 600",model,draw:(R,S)=>{if(S.drive)return rig(R,S,{read:"STOP",sub:"DRIVE IN THE CIRCUIT",hot:false});const top=Math.max(R.R10,R.R)*1.15,st=top>2000?1000:top>800?250:top>200?100:top>80?20:top>20?5:1,Y1=Math.ceil(top/st)*st,yt=[];for(let v=0;v<=Y1;v+=st)yt.push(v);
  return rig(R,S)+K.chart({x:110,y:400,w:540,h:150,X:[0,10],Y:[0,Y1],xt:[0,1,2,4,6,8,10],xf:v=>v+" min",yt:yt.length>6?yt.filter((_,i)=>i%2===0):yt,yf:v=>MK.n0(v),yl:"MΩ",title:"READING vs TIME ON TEST",
   series:[{f:t=>ir(S,Math.max(0.05,t)),c:"var(--cold)"}],vlines:[{x:1},{x:10}],dots:[{x:R.t,y:R.R,c:"var(--brass)",lbl:fmtR(R.R)+" MΩ",a:R.t>6?"end":"start",dx:R.t>6?-10:10,dy:R.R>Y1*0.7?24:-10}]})},
 reads:(R,S)=>S.drive?[["Test","Not allowed",true],["Why","Test voltage reaches the drive's output IGBTs",true]]:[["Reading now",fmtR(R.R)+" MΩ"],["Leakage current",K.f2(R.uA)+" µA"],["1-minute reading",fmtR(R.R1)+" MΩ"],["1 minute, corrected to 40°C",fmtR(R.R1c)+" MΩ",R.R1c<5],["10-minute reading",fmtR(R.R10)+" MΩ"],["Polarization index",K.f2(R.PI)+" ("+R.piTxt+")",R.PI<2],["Test voltage",R.V+" V DC"+(R.vOK?"":" (wrong for 460 V)"),!R.vOK],["Verdict",R.pass?"Pass":"Fail",!R.pass]],
 note:(R,S)=>S.drive?"Lift T1, T2 and T3 at the drive first.":R.V===2500?"2,500 V is a medium-voltage test. It can puncture weak insulation on a 460 V motor.":S.crack&&R.V>=1000?"The crack breaks down at the higher voltage: compare with 500 V. Same reading at both voltages = healthy insulation.":R.R1c<5?"Below the IEEE 43 minimum of 5 MΩ at 40°C. Don't put it back in service until it's dried out or repaired.":R.PI<2?"Passes the 1-minute minimum but the PI is low: moisture or dirt. Dry it and retest.":"",
 log:[["V",R=>R.V],["°C",(R,S)=>S.temp],["1 min",R=>fmtR(R.R1)],["@40°C",R=>fmtR(R.R1c)],["PI",R=>K.f2(R.PI)]],logHint:"Log each test like a motor test record: voltage, temperature, readings and PI."});
/* service call: a supply fan motor that sat through a wet spring */
const cS={v:1,min:1,temp:15,cond:4,crack:false,drive:false};
const tasks=[
 K.goal({t:"Correct a hot reading",intro:"The motor just came off line with the winding at <b>60°C</b>. Test it at the right voltage for a 460 V motor, drive leads lifted, and <b>log</b> the 1-minute reading. Then cool it to <b>20°C</b> and log again.",
  check:(S,R,L)=>{const g=l=>!l.S.drive&&(l.S.v===1||l.S.v===2)&&!l.S.crack;const h=L.find(l=>g(l)&&l.S.temp===60),c=L.find(l=>g(l)&&l.S.temp===20&&h&&l.S.cond===h.S.cond&&l.S.v===h.S.v);return !h?"Log a reading at 60°C with 500 or 1,000 V and the drive disconnected.":!c?"Now log the same motor (same condition and voltage) at 20°C.":true},
  ok:(S,R)=>"The raw readings differ by about 16 times (four 10°C steps), but both correct to the same 40°C value. That's why every reading needs its temperature."}),
 K.goal({t:"Pass the spot test, fail the PI",intro:"Find a winding that <b>passes</b> the 1-minute minimum (5 MΩ corrected to 40°C) but has a <b>PI under 2</b>, tested at 500 or 1,000 V with the drive disconnected.",
  check:(S,R)=>S.drive?"Lift the leads at the drive.":!R.vOK?"Use 500 or 1,000 V DC.":S.crack?"Uncheck the crack for this one.":R.R1c<5?`Corrected 1-minute reading is ${fmtR(R.R1c)} MΩ: that fails outright. A little drier.`:R.PI>=2?`PI is ${K.f2(R.PI)}. Wetter or dirtier insulation.`:true,
  ok:(S,R)=>`${fmtR(R.R1c)} MΩ at 40°C looks fine on a spot test, but PI ${K.f2(R.PI)} says the insulation is leaking steadily: moisture or contamination. A spot reading alone would have missed it.`}),
 K.caseTask({t:"Service call: motor that sat all spring",intro:"A 460 V supply fan motor sat idle in a damp mechanical room for three months. Before restarting, you lift the leads at the drive and megger it at 500 V DC.",
  state:cS,model,draw:(R,S)=>rig(R,S,{read:fmtR(R.R1),sub:"1 MIN · 500 V DC"}),
  reads:R=>[["1-minute reading",fmtR(R.R1)+" MΩ"],["Winding temperature","15°C"],["Last year's log","850 MΩ at 25°C"]],
  actions:[["Correct it to 40°C",R=>`${fmtR(R.R1)} × 0.5<sup>2.5</sup> = ${fmtR(R.R1c)} MΩ at 40°C. Last year's 850 MΩ at 25°C corrects to ${MK.n0(to40(850,25))} MΩ.`],["Run a 10-minute PI",R=>`10-minute reading ${fmtR(R.R10)} MΩ. PI = ${K.f2(R.PI)}.`],["Repeat at 1,000 V",R=>`${fmtR(ir({...cS,v:2},1))} MΩ at 1,000 V: no change from 500 V.`]],
  causes:[["wet","Moisture in the winding"],["crack","Cracked insulation"],["temp","It's just a cold reading"],["meter","Bad megger leads"]],ans:"wet",
  why:"The reading dropped a long way against last year's corrected value and the PI is close to 1: the insulation is leaking steadily, which is moisture. It didn't change with test voltage, so it isn't a crack. Dry the winding (space heater, low-voltage heating or a bake-out by a motor shop) and retest until the PI is back over 2.",hint:"Correct both readings to 40°C, then look at the PI and the 1,000 V test."})];
window.LESSON={id:"mot-megger",sec:"Motors + VFD",secHref:"/motors/",title:"Megger (insulation resistance) testing",lead:"How to megger a motor: choosing the test voltage, reading megohms, the minimums, temperature correction, the polarization index and doing it safely.",
 steps,see,tryIntro:"Two tests in See it, then a motor that sat through a wet spring.",tasks,
 job:K.job({read:["Motor nameplate voltage: picks the test voltage.","Winding temperature (or room temperature if it has been off for hours).","1-minute reading, and 10-minute reading for a PI on important motors.","Last readings from the motor's test log."],
  table:[["Item","Value"],["Test voltage, motors up to 1,000 V","500 V DC (IEEE 43); 500 or 1,000 V DC for 460 V equipment"],["Old minimum","1 MΩ per kV + 1 (1.46 MΩ for 460 V)"],["IEEE 43 minimum, random-wound","5 MΩ, 1 minute, at 40°C"],["Temperature","Reading halves for every 10°C rise"],["PI (10 min ÷ 1 min)","Under 1 dangerous, 1 to 2 questionable, 2 to 4 good, over 4 excellent"],["Discharge","At least 4 times the test time"]],tableT:"Numbers to know",
  steps:["Lock out, tag out, verify zero voltage. On a drive, verify the DC bus is discharged.","Lift T1, T2, T3 at the drive or open the motor's terminal box and disconnect the supply leads.","Tie the three motor leads together (or test each phase) and clip the other lead to clean frame metal.","Test for 1 minute at 500 V DC (or 1,000 V DC for 460 V equipment). Write down the reading and the temperature.","For a PI, keep going to 10 minutes and divide.","Let the tester discharge the winding. Then reconnect, torque the lugs and close up."],stepsT:"Meggering a 460 V motor",
  safety:["Never connect a megger to an energized circuit or to a VFD's terminals.","The test voltage can shock. Keep everyone clear of the motor leads and the motor while testing.","Discharge the winding to ground after every test, and before touching the leads.","Lift the cable at both ends if you test the feeder: anything else connected (drive, surge suppressor, meters) gets the test voltage."],
  mistakes:["Testing through the drive, or with leads still landed on it.","Comparing a hot reading to a cold one without correcting.","Calling a motor good on one high reading when the trend is falling.","Using 2,500 V on a 460 V motor 'to be sure'.","Unclipping the leads before the winding has discharged."]}),
 sources:[["The Engineering Mindset: induction motor basics (windings and stator)","https://theengineeringmindset.com/induction-motor-basics/"],["Megger: A Stitch in Time, the complete guide to electrical insulation testing (test voltages, temperature correction, PI)","https://weh.maritime.edu/EN-3111/references/a-stitch-in-time.pdf"],["Megger: how to meg a motor","https://www.megger.com/en/blog/december-2020/how-to-meg-a-motor"],["IEEE 43 test voltages and minimums (5 MΩ random-wound, 100 MΩ form-wound)","https://open-exam-prep.com/study-guides/neta-ett-level-ii/insulation-resistance-testing/ir-test-voltages-ieee-43-minimums"]]};
})();
