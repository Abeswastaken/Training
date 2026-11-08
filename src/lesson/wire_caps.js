/* ============ Lesson: Run and start capacitors ============ */
(()=>{
const C=WK.C,F=60,K2652=1e6/(2*Math.PI*F);      // 2652.6: microfarads from amps and volts at 60 Hz
const SIDE=["HERM (45 µF)","FAN (5 µF)"],RATED=[45,5],TOL=0.06;
const model=S=>{const rated=RATED[S.side],uf=rated*S.pct/100,I=2*Math.PI*F*uf*1e-6*S.v;
 const Ir=Math.round(I*100)/100,calc=2652*Ir/S.v,lo=rated*(1-TOL),hi=rated*(1+TOL);
 const meas=S.off?uf:calc,pass=meas>=lo&&meas<=hi;
 return {rated,uf,I,Ir,calc,lo,hi,meas,pass,side:S.side,off:!!S.off,v:S.v,pct:S.pct}};
const fu=v=>v>=10?v.toFixed(1):v.toFixed(2);
/* fan motor body, lead at (x+20,y) */
const fan=(x,y)=>`<rect x="${x}" y="${y}" width="120" height="66" rx="12" fill="url(#wkDkV)" stroke="#111"/><rect x="${x+120}" y="${y+28}" width="26" height="8" fill="#9aa1a6"/><path d="M${x+150} ${y+4} l10 28 l-10 28 M${x+154} ${y+32} h30" stroke="#5d666c" stroke-width="5" stroke-linecap="round"/>`+WK.t(x+60,y+38,"FAN MOTOR",{size:10,fill:"#e9ecee"});
const scene=(R,S,o={})=>{let s=WK.defs();const cs=1.1,cx=300,cy=118;const H=WK.cpp(cx,cy,cs,"HERM"),Cc=WK.cpp(cx,cy,cs,"C"),Fn=WK.cpp(cx,cy,cs,"FAN");
 const ks=.85,kx=50,ky=150,KS=WK.kpp(kx,ky,ks,"S"),KR=WK.kpp(kx,ky,ks,"R"),KC=WK.kpp(kx,ky,ks,"C");
 s+=WK.comp(kx,ky,{s:ks,lab:" "})+fan(520,292);
 const wired=!R.off;
 if(wired){const hw=`M${H[0]} ${H[1]} V100 H210 V${KS[1]} H${KS[0]}`,fw=`M${Fn[0]} ${Fn[1]} V100 H540 V292`;
  s+=WK.w(hw,C.yel,3.4)+WK.w(fw,C.brn,3.4)+WK.w(`M${Cc[0]} ${Cc[1]} V40 H470`,C.blk,3.4)+WK.w(`M${KR[0]} ${KR[1]} V340 H20 V40 H180`,C.blk,3.4)+WK.w(`M${KC[0]} ${KC[1]} V356 H250`,C.red,3.4);
  s+=K.txt(476,45,"to T1 (with R)",{a:"start"})+K.txt(186,45,"to T2",{a:"start"})+K.txt(256,361,"to T1",{a:"start"});
  s+=WK.flow(hw,true,3.4)+WK.flow(fw,true,3.4)}
 s+=WK.cap(cx,cy,{s:cs,lab:o.lab});
 if(o.noMeter)return s;
 /* meter box with dashed probes to C and the chosen side */
 const T=R.side?Fn:H,mx=560,my=128;s+=`<path d="M${mx} ${my+20} L${T[0]+6} ${T[1]+2} M${mx} ${my+34} L${Cc[0]+6} ${Cc[1]+2}" stroke="var(--muted)" stroke-dasharray="4 3"/>`;
 s+=`<rect x="${mx}" y="${my}" width="140" height="54" rx="8" fill="url(#wkY)" stroke="#8f6a0e"/><rect x="${mx+10}" y="${my+8}" width="120" height="38" rx="3" fill="url(#wkLcd)" stroke="#111"/>`+WK.t(mx+124,my+36,R.off?fu(R.uf):R.v.toFixed(1),{mono:1,size:19,a:"end",fill:"#111"})+WK.t(mx+16,my+20,R.off?"µF":"V AC",{size:9,a:"start",fill:"#111"});
 s+=K.txt(mx+70,my+74,R.off?"C to "+(R.side?"FAN":"HERM")+", power off":"C to "+(R.side?"FAN":"HERM")+", running");
 if(R.off)s+=K.txt(250,330,"power off, discharged, wires removed",{fill:"var(--muted)"});
 else{const cs2=.55,jx=R.side?540:210,jy=R.side?236:170;s+=WK.clamp(jx-55*cs2,jy-40*cs2,{s:cs2,txt:R.Ir.toFixed(2)})}
 return s};
const steps=[
 {t:"What a run capacitor does",body:`<p>A single-phase compressor or fan motor has two windings: <b>run</b> and <b>start</b>. On its own, single-phase power can't make a motor turn a particular way. The <b>run capacitor</b>, in series with the start winding, shifts that winding's current ahead of the run winding. That makes a rotating field: the motor starts, and runs smoothly and efficiently.</p><p>This is a <b>PSC</b> (permanent split capacitor) motor: the capacitor stays in the circuit the whole time it runs. A <b>dual capacitor</b> serves the compressor and the fan from one can.</p>`,
  draw:()=>{const R=model({side:0,pct:100,v:370,off:0});return scene(R,{},{noMeter:true})+WK.co(332,128,556,74,"HERM: TO COMPRESSOR S",{a:"start"})+WK.co(392,136,556,200,"FAN: TO FAN MOTOR",{a:"start"})+WK.co(360,170,556,250,"C: COMMON, TO THE LINE",{a:"start"})}},
 {t:"Microfarads, voltage and tolerance",body:`<p>Every run cap is printed with three things:</p><ul><li><b>Capacitance</b> in <b>microfarads</b> (µF, also MFD). A dual cap shows two: 45 + 5 means 45 µF for HERM and 5 µF for FAN.</li><li><b>Tolerance</b>: how far a new one may be from the label. ±6% on a 45 µF side means anything from <b>42.3 to 47.7 µF</b> is in spec.</li><li><b>Voltage rating</b>: a limit, not what it makes. A 440 V cap can replace a 370 V one; never the other way.</li></ul><p>Always replace with the <b>same µF</b>. Too little and the motor runs weak and hot; too much overloads the start winding.</p>`,
  math:`<p><code>45 × 0.94 = 42.3 µF</code>, <code>45 × 1.06 = 47.7 µF</code>. FAN side: <code>5 × 0.94 = 4.7</code> to <code>5 × 1.06 = 5.3 µF</code>.</p>`,
  draw:()=>{let s=WK.defs()+WK.cap(40,60,{s:1.6});const bar=(y,lab,r)=>{const X=v=>320+(v/r-0.85)/0.3*360;let g=`<rect x="320" y="${y}" width="360" height="26" rx="4" fill="var(--panel)"/><rect x="${X(r*0.94)}" y="${y}" width="${X(r*1.06)-X(r*0.94)}" height="26" fill="#1e9a4a" opacity=".85"/>`;
    g+=`<path d="M${X(r)} ${y-6} V${y+32}" stroke="var(--ink)" stroke-width="2"/>`+K.lbl(320,y-12,lab,{a:"start",size:13})+K.txt(X(r*0.94),y+50,fu(r*0.94))+K.txt(X(r*1.06),y+50,fu(r*1.06))+K.txt(X(r),y+50,r+" µF",{fill:"var(--ink)"});return g};
   s+=bar(90,"HERM SIDE, 45 MFD ±6%",45)+bar(220,"FAN SIDE, 5 MFD ±6%",5)+K.txt(500,330,"green: in spec for a new capacitor");return s}},
 {t:"Testing with the meter, power off",body:`<p>The direct test uses the meter's <b>µF</b> setting.</p><ol><li>Power off at the disconnect and prove it dead.</li><li><b>Discharge</b> the cap: a resistor (about 20 kΩ, 5 W) across C to HERM and C to FAN with insulated pliers. Never short it with a screwdriver.</li><li>Pull the wires off (mark them), so other parts don't affect the reading.</li><li>Read C to HERM, then C to FAN, and compare with the label.</li></ol><p>A meter test is fine for a quick check, but a cap can read OK cold and still fail hot under load.</p>`,
  draw:()=>{let s=WK.defs();const cs=1.15,cx=420,cy=170;s+=WK.cap(cx,cy,{s:cs});const H=WK.cpp(cx,cy,cs,"HERM"),Cc=WK.cpp(cx,cy,cs,"C");
   const ms=.95,mx=90,my=40;s+=WK.meter(mx,my,{s:ms,mode:"F",txt:"43.8",unit:"µF"});
   s+=WK.lead(mx+75*ms,my+206*ms,Cc[0],Cc[1]-6,"blk",{sag:40})+WK.lead(mx+110*ms,my+206*ms,H[0],H[1]-6,"red",{sag:60});
   s+=K.txt(161,312,"C to HERM: 43.8 µF")+K.txt(161,334,"in spec (42.3 to 47.7)",{fill:"var(--ok)"})+K.txt(161,356,"then C to FAN");
   return s}},
 {t:"Testing under load: µF from amps and volts",body:`<p>With the unit <b>running</b> you can work out the real capacitance, hot, under load:</p><ol><li>Clamp the wire from <b>HERM</b> to the compressor start terminal: amps through the cap.</li><li>Read volts across <b>C to HERM</b>.</li><li><b>µF = 2652 × amps ÷ volts</b> (on 60 Hz power).</li></ol><p>Example from HVAC School: a 70 µF cap carrying 8.3 A with 295.4 V across it is 2652 × 8.3 ÷ 295.4 = <b>74.5 µF</b>. That's just over the ±6% top (74.2), but inside the 10% allowance HVAC School uses for meter error, so it's called good.</p><p>The voltage across a run cap is higher than line voltage. That's normal.</p>`,
  math:`<p>A capacitor's current is <code>I = 2π × f × C × V</code>. Solve for C in µF: <code>C = I × 1,000,000 / (2π × 60 × V) = 2652 × I / V</code>.</p>`,
  draw:()=>{const R=model({side:0,pct:100,v:295.4,off:0});let s=scene({...R,Ir:8.3,v:295.4},{side:0},{lab:["70 + 5 µF","±6%  440 VAC"]});
   return s+`<rect x="556" y="218" width="154" height="66" rx="8" fill="var(--paper)" stroke="var(--brass)"/>`+K.lbl(633,243,"2652 × 8.3 ÷ 295.4",{size:14})+WK.t(633,272,"= 74.5 µF",{size:18,fill:"var(--brass)",w:700})}},
 {t:"Dual caps and how they fail",body:`<p>A dual cap has three terminals on top:</p><ul><li><b>C</b> (common): to the line, the same side as the compressor's R and the fan's common.</li><li><b>HERM</b>: to the compressor's start terminal (S).</li><li><b>FAN</b>: to the condenser fan's start lead.</li></ul><p>Caps wear out from heat and age. Signs: <b>bulged top</b>, oil on the can, low µF. A weak HERM side makes the compressor hum and trip on overload; a weak FAN side leaves the fan slow or not starting (it may start if you spin it). Replace the whole cap with the same µF on both sides.</p>`,
  draw:()=>{let s=WK.defs()+WK.cap(90,110,{s:1.3})+WK.cap(470,110,{s:1.3,bulge:true});
   s+=K.lbl(155,70,"GOOD: FLAT TOP",{size:15,fill:"var(--ok)"})+K.lbl(535,70,"FAILED: BULGED TOP",{size:15,fill:"var(--bad)"});
   s+=`<path d="M490 330 q10 18 30 14 q14 -4 26 6" stroke="#b39a3a" stroke-width="5" fill="none" opacity=".7"/>`+K.txt(535,370,"bulge and leaking oil: replace");
   return s+K.txt(155,370,"reads in spec under load")}},
 {t:"Start capacitor and potential relay",body:`<p>A hard-starting compressor (low voltage, pressures not equalized) can get a <b>start capacitor</b> added: a big, short-duty cap (for example 88 to 108 µF) put <b>in parallel</b> with the run cap for the first second or so.</p><p>A <b>potential relay</b> takes it back out:</p><ul><li>Its <b>contacts (1 to 2)</b> are normally closed, so the start cap is in at startup.</li><li>Its <b>coil (2 to 5)</b> is across the start winding. As the motor speeds up (about 75% speed), the start winding makes enough voltage to pull the relay in and <b>open</b> the contacts.</li></ul><p>A start cap left in the circuit overheats and fails within seconds or minutes.</p>`,
  draw:()=>{const ink="var(--ink)";let s=WK.defs();const RY=60,CY=330,SY=200;
   s+=WK.S.line(`M70 ${RY} H600 M70 ${CY} H600`,ink,2.6)+K.lbl(608,RY+5,"R (FROM T1)",{a:"start",size:12})+K.lbl(608,CY+5,"C (TO T2)",{a:"start",size:12});
   const wind=(x,y1,y2,lab)=>{let d=`M${x} ${y1} V${(y1+y2)/2-36}`;for(let i=0;i<4;i++)d+=` a9 9 0 0 1 0 18`;d+=` V${y2}`;return WK.S.line(d,ink,2.4)+K.txt(x-18,(y1+y2)/2+4,lab,{a:"end"})};
   s+=wind(110,RY,CY,"run winding")+wind(250,SY,CY,"start winding");
   s+=WK.S.line(`M250 ${SY} H560`,ink,2.6)+K.lbl(252,SY-10,"S",{a:"start",size:13});
   s+=WK.S.line(`M370 ${RY} V${118}`,ink)+`<g transform="rotate(90 370 140)">${WK.S.cap(370,140,{})}</g>`+WK.S.line(`M370 162 V${SY}`,ink)+K.txt(386,146,"run cap",{a:"start"});
   s+=WK.S.line(`M480 ${RY} V92`,ink)+`<g transform="rotate(90 480 114)">${WK.S.cap(480,114,{c:WK.HOT})}</g>`+K.txt(496,118,"start cap",{a:"start",fill:WK.HOT});
   s+=WK.S.line(`M480 136 V142`,ink)+`<g transform="rotate(90 480 164)">${WK.S.nc(480,164,{})}</g>`+WK.S.line(`M480 186 V${SY}`,ink)+K.txt(496,160,"1",{a:"start"})+K.txt(496,186,"2",{a:"start"})+K.txt(514,172,"relay contacts (NC)",{a:"start"});
   s+=WK.S.line(`M560 ${SY} V239`,ink)+`<g transform="rotate(90 560 265)">${WK.S.coil(560,265,{t:"PR"})}</g>`+WK.S.line(`M560 291 V${CY}`,ink)+K.txt(578,236,"2",{a:"start"})+K.txt(578,304,"5",{a:"start"})+K.txt(592,270,"relay coil",{a:"start"});
   s+=WK.S.dot(110,RY)+WK.S.dot(370,RY)+WK.S.dot(480,RY)+WK.S.dot(110,CY)+WK.S.dot(250,CY)+WK.S.dot(560,CY)+WK.S.dot(370,SY)+WK.S.dot(480,SY)+WK.S.dot(560,SY);
   return s+K.txt(360,368,"contacts open at about 75% speed, dropping the start cap out")}}];
const see=K.see({init:{side:0,pct:88,v:370,off:0},
 sliders:[["side","Testing side",0,1,1,v=>SIDE[v]],["pct","Actual capacitance, % of label",40,110,1,v=>v+"%"],["v","Volts across the cap (running)",250,450,1,v=>v+" V"]],checks:[["off","Power off: read µF with the meter"]],
 model,draw:(R,S)=>scene(R,S),
 reads:R=>R.off?[["Meter reads",fu(R.uf)+" µF"],["Label",R.rated+" µF ±6%"],["In spec",fu(R.lo)+" to "+fu(R.hi)+" µF"],["Verdict",R.pass?"Good":"Replace",!R.pass]]:
  [["Amps on the "+(R.side?"FAN":"HERM")+" wire",R.Ir.toFixed(2)+" A"],["Volts C to "+(R.side?"FAN":"HERM"),R.v+" V"],["2652 × A ÷ V",fu(R.calc)+" µF"],["Label",R.rated+" µF ±6%"],["In spec",fu(R.lo)+" to "+fu(R.hi)+" µF"],["Verdict",R.pass?"Good":"Replace",!R.pass]],
 note:R=>R.off?"Power off, discharged, wires removed: the meter reads the capacitance directly.":`2652 × ${R.Ir.toFixed(2)} ÷ ${R.v} = ${fu(R.calc)} µF. ${R.pass?"Inside ±6% of the label.":"Outside ±6% of the label: the motor's start winding isn't getting the current it was designed for."}`,
 log:[["Side",R=>R.side?"FAN":"HERM"],["Test",R=>R.off?"meter":"running"],["A",R=>R.off?"-":R.Ir.toFixed(2)],["µF",R=>fu(R.meas)],["OK",R=>R.pass?"yes":"no"]]});
const tasks=[
 K.goal({t:"Edge of the window",intro:"On the <b>FAN</b> side, set the weakest capacitance that is still in spec (±6%).",check:(S,R)=>S.side!==1?"Switch to the FAN side.":S.pct>95?`${fu(R.uf)} µF is in spec but not the weakest. Go lower.`:S.pct<94?`${fu(R.uf)} µF is below ${fu(R.lo)}: out of spec.`:true,
  ok:(S,R)=>`${fu(R.uf)} µF: 94% of 5 is 4.7 µF, the bottom of the window. One more percent down and it fails.`}),
 K.goal({t:"Pass and fail under load",intro:"With the unit running on the <b>HERM</b> side, log one reading that passes and one that fails by the 2652 formula.",
  check:(S,R,L)=>{const h=L.filter(l=>!l.R.off&&l.R.side===0);const p=h.some(l=>l.R.pass),f=h.some(l=>!l.R.pass);return p&&f?true:!p?"Log a running HERM reading that passes.":"Log a running HERM reading that fails."},
  ok:"Same volts, less capacitance, fewer amps. The formula turns the clamp reading into µF without shutting the unit down."}),
 K.caseTask({t:"Service call: condenser fan not turning",intro:"The compressor is running and the condenser fan isn't. The fan motor is warm and hums. Take running readings on the cap, then pick the cause.",
  state:{side:1,pct:42,v:380,off:0},model,draw:(R,S)=>scene(R,S),
  reads:R=>[["Fan","Humming, not turning"],["Compressor","Running"]],
  actions:[["Clamp the FAN wire",R=>`FAN wire: <b>${R.Ir.toFixed(2)} A</b>.`],["Volts C to FAN",R=>`C to FAN: <b>${R.v} V</b>.`],["Clamp the HERM wire",()=>"HERM wire: <b>6.29 A</b> at 371 V (2652 × 6.29 ÷ 371 = 45.0 µF)."]],
  causes:[["fan","Weak FAN side of the capacitor"],["herm","Weak HERM side of the capacitor"],["cont","Pitted contactor"]],ans:"fan",
  why:"2652 × 0.30 ÷ 380 = 2.1 µF on a 5 µF side: far below 4.7. The fan's start winding gets too little current to start it. Replace the dual cap with the same 45 + 5 µF. The HERM side checked fine.",hint:"Work the formula for the FAN side: 2652 × amps ÷ volts."})];
window.LESSON={id:"wire-caps",sec:"Wiring Board",secHref:"/wiring/",title:"Run and start capacitors",lead:"Microfarads, tolerance and voltage rating, testing a capacitor with the meter and under load with 2652 × amps ÷ volts, dual caps, and the start capacitor with its potential relay.",
 steps,see,tryIntro:"Two on the capacitor, then a call.",tasks,
 job:K.job({read:["The capacitor label: µF for each side, tolerance, voltage rating.","The equipment wiring diagram for which wire goes to HERM, FAN and C.","Running amps on the HERM and FAN wires and volts across each side, for the 2652 formula."],
  table:[["Label","In spec (±6%)","Action"],["45 µF HERM","42.3 to 47.7 µF","outside: replace"],["5 µF FAN","4.7 to 5.3 µF","outside: replace"],["35 µF","32.9 to 37.1 µF","outside: replace"],["Bulged top or leaking","any reading","replace"]],tableT:"Pass or fail",
  steps:["Look first: bulged top, oil, burned terminals.","Running: clamp the HERM wire, read C to HERM, work out 2652 × A ÷ V. Repeat on FAN.","Or power off, prove dead, discharge with a resistor, remove wires, read µF with the meter.","Replace with the same µF and an equal or higher voltage rating."],stepsT:"Testing a run capacitor",
  safety:["A capacitor can hold a charge with the power off. Discharge it through a resistor with insulated tools before touching the terminals.","Kill the disconnect before swapping a cap; the compressor and fan terminals are line voltage.","Take a picture of the wiring before you pull wires off."],
  mistakes:["Replacing with a different µF 'because it was on the truck'.","Using a 370 V cap where 440 V was installed.","Forgetting the 2652 formula is for 60 Hz power.","Trusting a cold meter reading when the cap fails hot. The HVAC School article notes about 10% is a fair allowance for meter error on the running test; anything well past that is bad.","Leaving a start capacitor in without a working relay to take it out."]}),
 sources:[["The Engineering Mindset: Capacitors Explained","https://theengineeringmindset.com/capacitors-explained/"],["HVAC School: Measuring Capacitance on a Running System","https://www.hvacrschool.com/measuring-capacitance-on-a-running-system"],["HVAC School: 5 Capacitor Facts You Should Know","https://hvacrschool.com/5-capacitor-facts-know"],["HVAC School: Potential, the Good and Evil Hard Start (potential relay)","https://hvacrschool.com/potential-good-evil-hard-start-potential-relay/"]]};
})();
