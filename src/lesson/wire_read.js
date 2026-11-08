/* ============ Lesson: Reading a wiring diagram ============ */
(()=>{
const C=WK.C;
/* 24 V control circuit: R -> thermostat Y -> high-pressure switch -> low-pressure switch -> contactor coil -> C */
const PX=[0,110,245,405,548,650],RY=272,VS=24,RSW=0.02,RCOIL=80;
const model=S=>{const closed=[!!S.call,!S.hps,!S.lps];let open=closed.indexOf(false);const V=[0];
 let I=0;if(open<0){I=VS/(RCOIL+3*RSW);for(let k=1;k<=4;k++)V[k]=VS-I*RSW*(k-1);V[5]=0}
 else{for(let k=1;k<=5;k++)V[k]=k<=open+1?VS:0}
 const r=S.r||1,b=S.b||5,m=Math.abs(V[r]-V[b]);
 return {closed,open,V,I,pulled:open<0,m,r,b}};
const OPEN=["thermostat (no call)","high-pressure switch","low-pressure switch"];
/* the ladder: o.hide draws the two pressure switches as plain boxes (for a service call) */
const scene=(R,S,o={})=>{const hot=WK.HOT,ink="var(--ink)";let s=WK.defs();
 /* line-voltage rung */
 const ly=78,on=R.pulled;
 s+=K.lbl(80,40,"LINE VOLTAGE 240 V",{a:"start",size:13,fill:"var(--muted)"});
 s+=WK.S.line(`M50 46 V112 M670 46 V112`,ink,3)+K.lbl(50,40,"L1",{size:13})+K.lbl(670,40,"L2",{size:13});
 const lc=on?hot:ink;
 s+=WK.S.line(`M50 ${ly} H158 M202 ${ly} H330 M390 ${ly} H518 M562 ${ly} H670`,lc,on?3:2.2);
 s+=WK.S.no(180,ly,{closed:on,lab:"CC",c:lc})+WK.S.no(540,ly,{closed:on,lab:"CC",c:lc})+WK.S.motor(360,ly,{t:"COMP",c:lc});
 if(on)s+=WK.flow(`M50 ${ly} H670`,true,2.4);
 s+=K.txt(360,ly+44,on?"contactor pulled in: compressor running":"contactor open: compressor off",{fill:on?hot:"var(--muted)"});
 s+=`<path d="M10 150 H710" stroke="var(--panel-edge)" stroke-dasharray="6 6"/>`;
 /* transformer and 24 V rails */
 s+=K.lbl(30,176,"LOW VOLTAGE 24 V",{a:"start",size:13,fill:"var(--muted)"});
 s+=WK.S.xfmr(360,186,{})+K.txt(430,182,"240 V primary",{a:"start"})+K.txt(430,218,"24 V secondary",{a:"start"});
 const Rc=R.V[1]>1?hot:ink;
 s+=WK.S.line(`M336 200 H70 V${RY} H${PX[1]}`,Rc,2.6)+WK.S.line(`M384 200 H${PX[5]} V${RY}`,ink,2.6)+K.lbl(62,236,"R",{a:"end",size:14})+K.lbl(PX[5]+10,236,"C",{a:"start",size:14});
 /* rung pieces between points, colored by the voltage at their left point */
 const seg=(a,b,k)=>WK.S.line(`M${a} ${RY} H${b}`,R.V[k]>1?hot:ink,2.6);
 const cx=[0,175,325,475,600];
 s+=seg(PX[1],cx[1]-22,1)+seg(cx[1]+22,PX[2],2)+seg(PX[2],cx[2]-22,2)+seg(cx[2]+22,PX[3],3)+seg(PX[3],cx[3]-22,3)+seg(cx[3]+22,PX[4],4)+seg(PX[4],cx[4]-26,4)+WK.S.line(`M${cx[4]+26} ${RY} H${PX[5]}`,ink,2.6);
 const col=k=>R.V[k]>1?hot:ink;
 s+=WK.S.no(cx[1],RY,{closed:R.closed[0],lab:"THERMOSTAT Y",c:col(1),lc:"var(--ink)"});
 if(o.hide){[2,3].forEach(k=>{s+=`<rect x="${cx[k]-22}" y="${RY-14}" width="44" height="28" rx="4" fill="var(--paper)" stroke="var(--muted)" stroke-width="2"/>`+K.lbl(cx[k],RY+5,k===2?"HPS":"LPS",{size:12})})}
 else s+=WK.S.ps(cx[2],RY,{open:!R.closed[1],lab:"HIGH PRESS.",c:col(2),lc:"var(--ink)"})+WK.S.ps(cx[3],RY,{open:!R.closed[2],lab:"LOW PRESS.",c:col(3),lc:"var(--ink)"});
 s+=WK.S.coil(cx[4],RY,{t:"CC",on:R.pulled,c:col(4)})+K.lbl(cx[4],RY-26,"CONTACTOR COIL",{size:12});
 if(R.pulled)s+=WK.flow(`M${PX[1]} ${RY} H${PX[5]}`,true,2.4);
 if(!o.noMeter){for(let k=1;k<=5;k++)s+=WK.pt(PX[k],RY+30,k,k===R.r||k===R.b);
  /* meter and probe leads */
  const mx=290,my=318;s+=`<rect x="${mx}" y="${my}" width="140" height="54" rx="8" fill="url(#wkY)" stroke="#8f6a0e"/><rect x="${mx+10}" y="${my+8}" width="120" height="38" rx="3" fill="url(#wkLcd)" stroke="#111"/>`+WK.t(mx+124,my+36,WK.fv(R.m),{mono:1,size:20,a:"end",fill:"#111"})+WK.t(mx+16,my+20,"V AC",{size:9,a:"start",fill:"#111"});
  const lead=(k,c,x0)=>`<path d="M${x0} ${my} C${x0} ${my-14} ${PX[k]} ${RY+64} ${PX[k]} ${RY+42}" fill="none" stroke="${c}" stroke-width="3"/>`;
  s+=lead(R.b,"#1b1f22",mx+100)+lead(R.r,"#c8322a",mx+40);
  s+=K.txt(mx-12,my+32,"red on "+R.r+", black on "+R.b,{a:"end"})}
 return s};
const steps=[
 {t:"Two voltages in one unit",body:`<p>Most HVAC equipment runs on two voltages at once.</p><ul><li><b>Line voltage</b> (120, 208 or 240 V) runs the big loads: compressor, fan motors, heat strips. Heavy wire, black and red for the hot legs.</li><li><b>Low voltage</b> (24 V) runs the controls: the thermostat, pressure switches, the contactor coil. Thin <b>18-gauge thermostat wire</b> from a <b>transformer</b> that steps 240 V down to 24 V.</li></ul><p>The 24 V circuit never touches the compressor. It only switches the <b>contactor coil</b>, and the contactor switches the 240 V.</p>`,
  draw:()=>{let s=WK.defs()+`<path d="M410 20 V370" stroke="var(--panel-edge)" stroke-dasharray="6 6"/>`+K.lbl(40,28,"LINE VOLTAGE: 240 V",{a:"start",size:14,fill:WK.HOT})+K.lbl(430,28,"LOW VOLTAGE: 24 V",{a:"start",size:14,fill:WK.LV});
   const cs=.85,cx=60,cy=96;const L1=WK.cpt(cx,cy,cs,"L1"),L2=WK.cpt(cx,cy,cs,"L2"),T1=WK.cpt(cx,cy,cs,"T1"),T2=WK.cpt(cx,cy,cs,"T2"),A1=WK.cpt(cx,cy,cs,"A1"),A2=WK.cpt(cx,cy,cs,"A2");
   const ks=.78,kx=226,ky=70,KC=WK.kpp(kx,ky,ks,"C"),KR=WK.kpp(kx,ky,ks,"R");
   s+=WK.comp(kx,ky,{s:ks});
   s+=WK.w(`M${L1[0]} 44 V${L1[1]}`,C.blk,6)+WK.w(`M${L2[0]} 44 V${L2[1]}`,C.red,6);
   s+=WK.w(`M${T1[0]} ${T1[1]} V272 H246 V${KC[1]} H${KC[0]}`,C.blk,6)+WK.w(`M${T2[0]} ${T2[1]} V256 H320 V${KR[1]} H${KR[0]}`,C.red,6);
   s+=WK.contactor(cx,cy,{s:cs});
   /* low voltage side */
   const xs=.9,xx=452,xy=56;s+=WK.w(`M${xx+20} 44 V${xy+26}`,C.blk,3)+WK.w(`M${xx+80} 44 V${xy+26}`,C.red,3)+WK.xfmr(xx,xy,{s:xs});
   const ts=.7,tx=470,ty=236;const TR=WK.tpt(tx,ty,ts,0),TC=WK.tpt(tx,ty,ts,1),TY=WK.tpt(tx,ty,ts,2);
   const sy=xy+90*xs;
   s+=WK.w(`M${xx+20} ${sy} V196 H${TR[0]} V${TR[1]}`,C.red,3)+WK.w(`M${xx+80} ${sy} V${TC[1]}`,C.blu,3);
   s+=WK.w(`M${TY[0]} ${TY[1]} V346 H198 V${A2[1]} H${A2[0]}`,C.yel,3)+WK.w(`M${TC[0]} ${TC[1]} V362 H26 V${A1[1]} H${A1[0]}`,C.blu,3);
   s+=WK.tstat(tx,ty,{s:ts,terms:["R","C","Y","W","G"]});
   s+=K.txt(600,104,"transformer",{a:"start"})+K.txt(600,124,"240 V in, 24 V out",{a:"start"});
   s+=K.txt(40,300,"heavy wire to",{a:"start"})+K.txt(40,318,"the compressor",{a:"start"})+K.txt(568,340,"thin thermostat wire",{a:"start"})+K.txt(226,326,"24 V runs only the contactor coil",{a:"start",fill:WK.LV});
   return s}},
 {t:"Connection diagram vs schematic",body:`<p>The panel door usually has two drawings of the same wiring.</p><ul><li>The <b>connection diagram</b> (pictorial) shows parts roughly where they sit in the unit, with every wire and its color. Use it to find a wire.</li><li>The <b>schematic</b> (<b>ladder diagram</b>) strips out the layout. Power runs down two rails, L1 and L2, and each <b>rung</b> between them is one path for current. Use it to understand what turns on what.</li></ul><p><b>Solid lines</b> are factory wiring; <b>dashed lines</b> are field wiring the installer runs.</p>`,
  draw:()=>{const left=WK.defs()+`<rect x="30" y="46" width="270" height="250" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="3 3"/>`+
    `<rect x="52" y="70" width="80" height="96" rx="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`+K.lbl(92,92,"CONTACTOR",{size:11})+WK.S.dot(72,74)+WK.S.dot(112,74)+WK.S.dot(72,162)+WK.S.dot(112,162)+
    `<rect x="190" y="70" width="70" height="80" rx="30" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`+K.lbl(225,96,"CAP",{size:11})+K.txt(205,138,"H")+K.txt(225,138,"C")+K.txt(245,138,"F")+
    `<circle cx="100" cy="240" r="38" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`+K.lbl(100,236,"COMP",{size:11})+K.txt(100,262,"C S R")+
    `<circle cx="234" cy="242" r="30" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`+K.lbl(234,247,"FAN",{size:11})+
    WK.w("M72 162 V200 H86 V214",C.blk,2.4)+WK.w("M112 162 V186 H160 V150 H225",C.red,2.4)+WK.w("M205 150 V200 H100 V214",C.yel,2.4)+WK.w("M245 150 V212",C.brn,2.4)+
    WK.w("M72 40 V74",C.blk,2.4)+WK.w("M112 40 V74",C.red,2.4)+`<path d="M60 40 H124" stroke="var(--ink)" stroke-dasharray="5 4"/>`+K.txt(132,52,"field wires",{a:"start"});
   const right=WK.S.line("M50 46 V300 M280 46 V300",null,3)+K.lbl(50,40,"L1",{size:12})+K.lbl(280,40,"L2",{size:12})+
    WK.S.line("M50 90 H84 M128 90 H136 M196 90 H280")+WK.S.no(106,90,{lab:"CC"})+WK.S.motor(166,90,{t:"COMP"})+
    WK.S.line("M50 160 H84 M128 160 H136 M196 160 H280")+WK.S.no(106,160,{lab:"CC"})+WK.S.motor(166,160,{t:"FAN"})+
    `<path d="M40 214 H290" stroke="var(--panel-edge)" stroke-dasharray="4 4"/>`+K.txt(165,232,"24 V control rung")+
    WK.S.line("M50 270 H62 M106 270 H124 M168 270 H194 M246 270 H280")+WK.S.no(84,270,{lab:"Y"})+WK.S.ps(146,270,{lab:"HPS"})+WK.S.coil(220,270,{t:"CC"});
   return K.cards([{t:"CONNECTION DIAGRAM",c:"var(--brass)",inner:left,note:"where the wires go"},{t:"SCHEMATIC (LADDER)",c:"var(--brass)",inner:right,note:"how it works, one rung per path"}],{h:340})}},
 {t:"The symbols",body:`<p>Every schematic uses the same small set of symbols. The legend on the diagram names each one.</p><ul><li><b>Normally open (NO)</b> contacts are open until something closes them. <b>Normally closed (NC)</b> contacts have a slash: closed until something opens them.</li><li>A <b>coil</b> is a circle with a label. Contacts with the same label (CC) belong to that coil and move when it is powered.</li><li>Contacts are always drawn in their <b>resting state</b>: power off, nothing pressed.</li></ul>`,
  draw:()=>{const it=[["NO CONTACT","open at rest",(x,y)=>WK.S.no(x,y)],["NC CONTACT","closed at rest",(x,y)=>WK.S.nc(x,y)],["COIL","relay or contactor",(x,y)=>WK.S.coil(x,y,{t:"CR"})],["PRESSURE SWITCH","NC, opens on fault",(x,y)=>WK.S.ps(x,y)],
    ["TRANSFORMER","240 V to 24 V",(x,y)=>WK.S.xfmr(x,y)],["MOTOR","compressor, fan",(x,y)=>WK.S.motor(x,y)],["CAPACITOR","run or start",(x,y)=>WK.S.cap(x,y)],["FUSE","3 A on the 24 V",(x,y)=>WK.S.fuse(x,y)],
    ["OVERLOAD","opens on heat",(x,y)=>WK.S.ol(x,y)],["RESISTOR / HEATER","heat strip",(x,y)=>WK.S.res(x,y)],["SWITCH","disconnect, toggle",(x,y)=>WK.S.sw(x,y)],["GROUND","equipment ground",(x,y)=>WK.S.gnd(x,y)]];
   let s="";it.forEach(([n,d,f],i)=>{const c=i%4,r=Math.floor(i/4),x=20+c*172,y=12+r*120;s+=`<rect x="${x}" y="${y}" width="160" height="110" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+f(x+80,y+42)+K.lbl(x+80,y+84,n,{size:12})+K.txt(x+80,y+101,d)});return s}},
 {t:"Terminal letters and wire colors",body:`<p>Low-voltage terminals use the same letters on the thermostat, the furnace board and the outdoor unit.</p><ul><li><b>R</b>: 24 V hot from the transformer. <b>C</b>: common, the other side of the transformer.</li><li><b>Y</b>: cooling (compressor contactor). <b>G</b>: indoor fan. <b>W</b>: heat.</li><li><b>O/B</b>: heat pump reversing valve. O brands power it in cooling; B brands in heating.</li></ul><p>Wire colors usually match the letter, but they are a habit, not a rule. <b>Read the letter on the terminal</b>, not the color. On line voltage, black and red are hot legs, white is neutral, green or bare is ground.</p>`,
  draw:()=>{let s=WK.defs();const tx=30,ty=40,L=["R","C","Y","W","G","O/B"],cols=[C.red,C.blu,C.yel,C.wht,C.grn,C.org];
   L.forEach((l,i)=>{const [x,y]=WK.tpt(tx,ty,1,i);s+=WK.w(`M${x} ${y} V${210+i*2} Q${x} 250 ${150+i*8} 290 V340`,cols[i],3.4)});
   s+=`<rect x="134" y="300" width="74" height="40" rx="8" fill="#d9d4c4" stroke="#8a8370"/>`+K.txt(171,364,"18/6 thermostat cable");
   s+=WK.tstat(tx,ty,{terms:L});
   const rows=[["R","24 V hot from the transformer",C.red],["C","common, back to the transformer",C.blu],["Y","cooling: compressor contactor",C.yel],["W","heat: burner or heat strips",C.wht],["G","indoor blower fan",C.grn],["O/B","reversing valve (heat pump)",C.org]];
   rows.forEach(([l,d,c],i)=>{const y=60+i*44;s+=`<rect x="372" y="${y-16}" width="22" height="22" rx="4" fill="${c}" stroke="#555"/>`+K.lbl(408,y,l,{a:"start",size:16})+K.txt(460,y,d,{a:"start"})});
   return s+K.txt(372,340,"colors are a habit: always read the letter",{a:"start",fill:"var(--bad)"})}},
 {t:"Following a circuit",body:`<p>To read a rung, start at the power side and follow it to the other side, through every switch, to the load.</p><ol><li>Find the load you care about (the <b>contactor coil</b>).</li><li>Trace back toward <b>R</b>: every switch in that line must be closed for the coil to get 24 V.</li><li>Number the points between parts. A meter on each point (black on C) tells you how far the 24 V gets.</li></ol><p>Here the thermostat is calling, both pressure switches are closed, and the coil has 24 V. The coil pulls in the contactor, and the contactor's contacts start the compressor on the line-voltage rung.</p>`,
  draw:()=>{const S={call:1,hps:0,lps:0,r:4,b:5};return scene(model(S),S)}}];
const see=K.see({init:{call:1,hps:0,lps:0,r:1,b:5},
 sliders:[["call","Thermostat",0,1,1,v=>v?"Calling for cooling":"Satisfied (off)"],["hps","High-pressure switch",0,1,1,v=>v?"Open (tripped)":"Closed"],["lps","Low-pressure switch",0,1,1,v=>v?"Open (tripped)":"Closed"],["r","Red probe on point",1,5,1,v=>"Point "+v],["b","Black probe on point",1,5,1,v=>"Point "+v]],
 model,draw:(R,S)=>scene(R,S),
 reads:R=>[["Meter",WK.fv(R.m)+" V AC"],["Coil current",R.I>0?(R.I).toFixed(2)+" A":"0 A"],["Contactor",R.pulled?"Pulled in":"Open",!R.pulled],["Compressor",R.pulled?"Running":"Off",!R.pulled],["Circuit open at",R.open<0?"nothing":OPEN[R.open],R.open>=0],["Coil",R.pulled?"24 V across it":"0 V across it"]],
 note:R=>R.open<0?"Every switch is closed, so the whole 24 V is dropped across the coil. Points 1 to 4 all read 24 V to C; point 5 is C.":`The ${OPEN[R.open]} is open. Points before it read 24 V to C, points after it read 0 V. Put the probes across the open switch and you read the full 24 V.`,
 log:[["Red",R=>R.r],["Black",R=>R.b],["Meter",R=>WK.fv(R.m)+" V"],["Contactor",R=>R.pulled?"in":"out"]],logHint:"Press Log reading after each probe move, like writing readings on a service ticket."});
const tasks=[
 K.goal({t:"Read voltage across an open switch",intro:"With a cooling call, trip the <b>low-pressure switch</b> (leave the high-pressure switch closed). Put the probes on both sides of the open switch.",
  check:(S,R)=>!S.call?"The thermostat needs to be calling.":S.hps?"Close the high-pressure switch so only one switch is open.":!S.lps?"Open the low-pressure switch.":!((R.r===3&&R.b===4)||(R.r===4&&R.b===3))?`Your probes are on ${R.r} and ${R.b}. Which two points sit on each side of the low-pressure switch?`:true,
  ok:"24 V across an open switch. The switch is the only break in the loop, so the whole supply shows up across it. A closed switch would read near 0 V."}),
 K.goal({t:"Walk the circuit",intro:"Close everything with a cooling call. Leave the black probe on <b>point 5 (C)</b> and log a reading with the red probe on each point, 1 through 5.",
  check:(S,R,L)=>{const got=new Set(L.filter(l=>l.R.pulled&&l.R.b===5).map(l=>l.R.r));const miss=[1,2,3,4,5].filter(k=>!got.has(k));return miss.length?`Still need a logged reading (contactor pulled in, black on 5) with red on point ${miss.join(", ")}.`:true},
  ok:"24 V at 1, 2, 3 and 4, then 0 V at 5. The voltage is all used up across the one load, the coil. On a real call you'd walk it the same way until the 24 V disappears."}),
 K.caseTask({t:"Service call: outdoor unit won't start",intro:"The thermostat is calling for cooling. The indoor fan runs but the outdoor unit is silent and the contactor is not pulled in. Take readings with the black probe on C, then pick the cause.",
  state:{call:1,hps:1,lps:0,r:1,b:5},model,draw:(R,S)=>scene(R,S,{hide:true,noMeter:false}),
  reads:()=>[["Contactor","Open"],["Thermostat","Calling"]],
  actions:[["Point 1 to C",()=>"Point 1 (R) to C: <b>24.0 V</b>. The transformer is fine."],["Point 2 to C",()=>"Point 2 (Y) to C: <b>24.0 V</b>. The thermostat is sending the call."],["Point 3 to C",()=>"Point 3 to C: <b>0.0 V</b>."],["Point 4 to C",()=>"Point 4 to C: <b>0.0 V</b>. The coil has nothing."]],
  causes:[["xf","No 24 V from the transformer"],["ts","Thermostat not calling"],["hps","High-pressure switch open"],["lps","Low-pressure switch open"],["coil","Contactor coil open"]],ans:"hps",
  why:"24 V at point 2 and 0 V at point 3 puts the break in the high-pressure switch. Next ask why it tripped: a dirty condenser coil, a dead condenser fan or overcharge. Don't jumper it out.",hint:"Find the last point with 24 V and the first with 0 V. The open part is between them."})];
window.LESSON={id:"wire-read",sec:"Wiring Board",secHref:"/wiring/",title:"Reading a wiring diagram",lead:"Line voltage and 24 V controls, connection diagrams and ladder schematics, the symbols, the R C Y W G O/B letters, and how to follow a circuit point by point.",
 steps,see,tryIntro:"Two with the meter on the 24 V rung, then a call.",tasks,
 job:K.job({read:["The wiring diagram glued inside the panel door: it is for this exact unit. Find the legend first.","The schematic to understand the sequence; the connection diagram to find the actual wire and terminal.","Terminal letters on the board and thermostat, not wire colors."],
  table:[["Terminal or wire","What it is","Normal reading"],["R to C","24 V transformer secondary","24 to 28 V AC"],["Y to C, calling for cooling","Call to the contactor coil","about 24 V"],["Y to C, not calling","No call","0 V"],["L1 to L2","Line voltage","208 to 240 V"],["L1 or L2 to ground","One leg of 120/240 V","about 120 V"]],tableT:"What you should read",
  steps:["Read the sequence on the schematic: what has to close for the load to run?","Black probe on C (or L2 for line voltage). Red probe on each point, starting at the power side.","The voltage is there until the open part. The first point that reads 0 V is just past the problem.","Confirm by reading across the suspect part: an open switch reads full voltage across it."],stepsT:"Tracing a dead circuit",
  safety:["Line voltage and 24 V often share the same panel. Treat every terminal as 240 V until you've proven otherwise.","Never jumper a safety switch (high or low pressure, limit) to make a unit run, except briefly as a test while you watch it."],
  mistakes:["Trusting wire color instead of the terminal letter.","Reading the schematic with contacts in the wrong state: they're drawn at rest, power off.","Confusing C on a thermostat (24 V common) with C on a compressor or capacitor (common terminal of a motor or cap).","Using the connection diagram to understand the sequence; the ladder is far easier."]}),
 sources:[["The Engineering Mindset: Ground, Neutral and Hot wires (US/Can)","https://theengineeringmindset.com/ground-neutral-and-hot-wires-us-can/"],["HVAC School: How to Read AC Schematics and Diagrams Basics","https://hvacrschool.com/how-to-read-ac-schematics-and-diagrams-basics"],["Honeywell Home: How do I wire my thermostat? (terminal letters)","https://www.honeywellhome.com/us/en/support/how-do-i-wire-my-thermostat"]]};
})();
