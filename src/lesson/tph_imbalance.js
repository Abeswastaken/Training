/* ============ Lesson: Single phasing and voltage imbalance ============ */
(()=>{
const PC=TPK.PC,R3=Math.sqrt(3),VR=460,FLA=14;
const {C,add,mul,pol,abs,ang,A1,A2}=TPK;
/* Line-to-line magnitudes to phasors (closing triangle), then symmetrical components.
 Negative-sequence impedance of an induction motor is close to its locked-rotor impedance, so
 I2 = (V2 / V rated) x locked-rotor amps. That is why a small voltage unbalance makes a big current unbalance. */
const solve=S=>{const a=S.v12,b=S.v23,c=S.v31,v=[a,b,c],N=TPK.nema(v);
 const x=(a*a+c*c-b*b)/(2*a),yy=Math.sqrt(Math.max(0,c*c-x*x));let best=null;
 [1,-1].forEach(sg=>{const Pa=C(0,0),Pb=C(a,0),Pc=C(x,sg*yy);const neg=p=>C(-p.re,-p.im);
  const Vab=add(Pa,neg(Pb)),Vbc=add(Pb,neg(Pc)),Vca=add(Pc,neg(Pa));
  const V1=mul(add(add(Vab,mul(A1,Vbc)),mul(A2,Vca)),C(1/3,0)),V2=mul(add(add(Vab,mul(A2,Vbc)),mul(A1,Vca)),C(1/3,0));
  if(!best||abs(V1)>abs(best.V1))best={V1,V2}});
 const {V1,V2}=best,vuf=100*abs(V2)/abs(V1);
 const Irun=TPK.runI(FLA,S.load/100),pf=0.55+0.3*Math.min(1,S.load/100);
 const I1=pol(Irun,ang(V1)-30-Math.acos(pf)*180/Math.PI),I2=pol(abs(V2)/VR*S.lra*FLA,ang(V2)+30-75);
 let I=[abs(add(I1,I2)),abs(add(mul(A2,I1),mul(A1,I2))),abs(add(mul(A1,I1),mul(A2,I2)))];
 /* single phasing: L3 open. The two remaining lines carry the load: about 1.73 x the 3-phase line current (the trainer's rule) */
 if(S.sp)I=[R3*Irun,R3*Irun,0];
 const NI=TPK.nema(I);const ratio=N.pct>0.05?NI.pct/N.pct:0;
 return {v,N,vuf,I,NI,ratio,rise:2*N.pct*N.pct,der:TPK.derate(N.pct),Irun,sp:!!S.sp,hot:Math.max(...I)>FLA*1.15}};
/* bar pair: voltages and currents with their average line */
const bars=(x0,y0,w,h,vals,lo,hi,unit,title,avg,cols,o={})=>{let s=K.lbl(x0,y0-14,title,{a:"start",size:14});const Y=v=>y0+h-(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*h,bw=w/5;
 s+=`<path d="M${x0} ${y0} V${y0+h} H${x0+w}" stroke="var(--muted)" fill="none"/>`;
 vals.forEach((v,k)=>{const x=x0+bw*(.6+k*1.5);s+=`<rect x="${x}" y="${Y(v)}" width="${bw}" height="${y0+h-Y(v)}" fill="${cols[k]}" opacity=".85" stroke="#4d555a"/>`+K.txt(x+bw/2,y0+h+20,o.names?o.names[k]:"L"+(k+1))+K.lbl(x+bw/2,y0+h+40,K.f1(v)+unit,{size:13,fill:cols[k]==="#cfae0c"?"#a08608":cols[k]})});
 if(avg!=null)s+=`<path d="M${x0} ${Y(avg)} H${x0+w}" stroke="var(--ink)" stroke-dasharray="6 4" stroke-width="1.6"/>`+K.txt(x0-4,Y(avg)+5,"avg",{a:"end"});
 if(o.lim)s+=`<path d="M${x0} ${Y(o.lim)} H${x0+w}" stroke="var(--bad)" stroke-dasharray="2 4" stroke-width="1.6"/>`+K.txt(x0+w+4,Y(o.lim)+5,o.limL,{a:"start",fill:"var(--bad)"});
 return s};
const VC=["#8b5a2b","#e07b1a","#cfae0c"];
/* step 1: measuring at the motor */
const measure=()=>{const G=TPK.defs();let s=G.s+`<g transform="translate(400 170) scale(.85)">${TPK.motor(G,0,0,{np1:"10 HP",np2:"460 V"})}</g>`;const mt=TPK.mT(0).map(v=>400+v*.85);
 [0,1,2].forEach(k=>{s+=TPK.wire(`M${mt[k]} 20 V${170-25}`,PC[k],true,3)+K.txt(mt[k],16,"",{})});
 s+=K.txt(mt[0]-10,40,"L1",{a:"end",fill:PC[0]})+K.txt(mt[2]+10,40,"L3",{a:"start",fill:PC[2]});
 const r=[["L1-L2","462 V"],["L2-L3","463 V"],["L3-L1","455 V"]];r.forEach(([n,v],i)=>{s+=K.lcd(150,80+i*80,v,110)+K.txt(150,120+i*80,n);});
 s+=`<path d="M210 80 H330" stroke="var(--muted)" stroke-dasharray="4 4"/><path d="M210 160 H330" stroke="var(--muted)" stroke-dasharray="4 4"/><path d="M210 240 H330" stroke="var(--muted)" stroke-dasharray="4 4"/>`+K.txt(270,72,"meter across",{})+K.txt(270,304,"read at the motor terminals, running",{});
 return s};
/* step 2: the NEMA formula */
const formula=()=>{const v=[462,463,455],N=TPK.nema(v);let s=bars(70,60,300,250,v,440,470," V","LINE VOLTAGES",N.avg,VC,{names:["L1-L2","L2-L3","L3-L1"]});
 const x=440;s+=`<rect x="${x}" y="40" width="260" height="290" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 s+=K.lbl(x+16,70,"1. AVERAGE",{a:"start",size:13})+K.txt(x+16,92,"(462 + 463 + 455) ÷ 3 = 460 V",{a:"start"});
 s+=K.lbl(x+16,130,"2. BIGGEST DEVIATION",{a:"start",size:13})+K.txt(x+16,152,"460 − 455 = 5 V",{a:"start"});
 s+=K.lbl(x+16,190,"3. DIVIDE, × 100",{a:"start",size:13})+K.txt(x+16,212,"5 ÷ 460 × 100 = 1.1%",{a:"start"});
 s+=K.lbl(x+16,262,"1.1% UNBALANCE",{a:"start",size:18,fill:"var(--bad)"})+K.txt(x+16,288,"just over the 1% guideline",{a:"start"});return s};
/* step 3: current unbalance vs voltage unbalance from the model */
const cuChart=()=>{const f=(p,lra)=>{const S={v12:460,v23:460,v31:460*(1-3*p/100),load:100,lra};const r=solve(S);return {x:r.N.pct,y:r.NI.pct}};
 const ser=lra=>{const pts=[];for(let p=0;p<=2.45;p+=0.05){const q=f(p,lra);pts.push([q.x,q.y])}return pts};
 return K.chart({x:80,y:40,w:560,h:270,X:[0,5],Y:[0,50],xt:[0,1,2,3,4,5],xf:v=>v+"%",yt:[0,10,20,30,40,50],yf:v=>v+"%",xl:"voltage unbalance",yl:"current unbalance",title:"ONE LOW LEG, 10 HP MOTOR AT FULL LOAD",
  series:[{f:x=>10*x,c:"var(--muted)",dash:"4 5",w:1.5,lbl:"10×",lblAt:3.6,a:"start",dx:6,dy:0},{f:x=>6*x,c:"var(--muted)",dash:"4 5",w:1.5,lbl:"6×",lblAt:4.6,a:"start",dx:6,dy:4},{pts:ser(6),c:"#d62828",lbl:"MOTOR, LRA 6× FLA",lblAt:3.6,a:"start",dx:10,dy:22},{pts:ser(8),c:"#7a5cd0",lbl:"LRA 8×",lblAt:2.5,a:"end",dx:-10,dy:-6}],bands:[]})};
/* step 4: derating */
const derChart=()=>K.chart({x:80,y:40,w:560,h:270,X:[0,5],Y:[0.7,1.02],xt:[0,1,2,3,4,5],xf:v=>v+"%",yt:[.7,.75,.8,.85,.9,.95,1],yf:v=>Math.round(v*100)+"%",xl:"voltage unbalance (NEMA)",yl:"usable horsepower",title:"DERATING: HOW MUCH LOAD THE MOTOR CAN CARRY",
 series:[{pts:TPK.DER.map(p=>[p[0],p[1]]),c:"#2f6fd6",lbl:"NEMA MG 1 CURVE",lblAt:3,a:"start",dx:10,dy:-8}],vlines:[{x:1,lbl:"1%: NO DERATE NEEDED",c:"var(--ok)"}],
 dots:[{x:2,y:.95,c:"#2f6fd6",lbl:"2%: 95%",dx:-10,dy:28,a:"end"},{x:5,y:.76,c:"var(--bad)",lbl:"5%: 76%",dx:-12,dy:24,a:"end"}]});
/* step 5: single phasing */
const single=()=>{const G=TPK.defs();const card=(ox,title,run)=>{let g=`<rect x="${ox}" y="20" width="330" height="330" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(ox+165,48,title,{size:14});
  const xs=[ox+70,ox+110,ox+150];xs.forEach((x,k)=>{const bl=k===2;g+=TPK.wire(`M${x} 64 V96`,PC[k],true,3)+`<rect x="${x-8}" y="96" width="16" height="34" rx="3" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`+(bl?`<path d="M${x} 100 v10 l-5 5 M${x} 126 v-10 l5 -5" stroke="var(--bad)" stroke-width="1.8" fill="none"/>`:`<path d="M${x} 100 q-5 7 0 13 t0 13" stroke="var(--ink)" stroke-width="1.6" fill="none"/>`);
   g+=TPK.wire(`M${x} 130 V178 L${ox+60+.55*(84+18*k)} 198`,PC[k],!bl,3)});
  g+=K.txt(xs[2]+16,118,"F3 BLOWN",{a:"start",fill:"var(--bad)"});
  g+=`<g transform="translate(${ox+60} 214) scale(.55)">${TPK.motor(G,0,0,{dir:run?1:0,hot:.4})}</g>`;
  const amps=run?[24.2,24.2,0]:[73,73,0];amps.forEach((a,k)=>{g+=K.lcd(ox+280,90+k*44,K.f1(a)+" A",80)+K.txt(ox+236,95+k*44,"L"+(k+1),{a:"end"})});
  g+=K.txt(ox+165,326,run?"keeps turning, 1.73× amps on 2 lines":"hums at locked-rotor amps",{fill:"var(--bad)"});return g};
 return card(20,"LOST A PHASE WHILE RUNNING",true)+card(370,"TRIED TO START ON 2 PHASES",false)};
/* step 6: roll the leads */
const roll=()=>{let s="";const row=(y,map,amps,t)=>{let g=K.lbl(30,y-40,t,{a:"start",size:14});[0,1,2].forEach(k=>{const x=200+k*170;g+=K.txt(x-56,y+5,"L"+(k+1),{fill:PC[k],a:"end"})+TPK.wire(`M${x-46} ${y} H${x-16}`,PC[k],true,3)+K.lcd(x+22,y,K.f1(amps[k])+" A",76)+K.txt(x+22,y+32,"motor lead "+"ABC"[map[k]],{})});return g};
 s+=row(110,[0,1,2],[14.2,16.9,14.0],"BEFORE: L1-A, L2-B, L3-C");s+=row(250,[1,2,0],[14.0,16.8,14.3],"AFTER ROLLING ALL THREE ONE PLACE: L1-B, L2-C, L3-A");
 s+=K.tag(360,350,"HIGH AMPS STAYED ON L2: THE PROBLEM IS IN THE SUPPLY",{fill:"var(--bad)"});return s};
const steps=[
 {t:"Measure all three voltages at the motor",
  body:`<p>A 3-phase motor wants three equal voltages. In real buildings they're never exactly equal: single-phase loads, a bad connection or a weak transformer leg pull one down.</p><p>With the motor running, read <b>L1-L2</b>, <b>L2-L3</b> and <b>L3-L1</b> at the motor terminals or the load side of the starter.</p><p>Small differences matter more than you'd think, as the next steps show.</p>`,draw:measure},
 {t:"The NEMA formula",
  body:`<p>NEMA defines <b>voltage unbalance</b> this way:</p><p><b>% unbalance = largest deviation from the average ÷ average × 100</b></p><ol><li>Average the three readings.</li><li>Find the reading farthest from the average, and how far it is.</li><li>Divide by the average and multiply by 100.</li></ol><p>This is the DOE's example: 462, 463 and 455 V give 1.1%.</p>`,draw:formula},
 {t:"A little voltage unbalance makes a lot of current unbalance",
  body:`<p>The <b>current unbalance</b> is typically <b>6 to 10 times</b> the voltage unbalance. 1% voltage unbalance can mean 6 to 10% current unbalance at full load.</p><p>Why so much? The unbalanced part of the voltage tries to spin the motor backward. The rotor sees that part as a locked rotor, so it draws current like a starting motor: the bigger the motor's locked-rotor current, the bigger the multiplier.</p><p>One winding runs hotter than the others, and that winding fails first.</p>`,
  math:`<p>The model splits the three voltages into a forward (positive sequence) part V1 and a backward (negative sequence) part V2.</p><p>Backward current ≈ (V2 ÷ rated volts) × locked-rotor amps. With locked-rotor amps 6 times FLA, 1% of V2 makes about 6% of FLA flowing backward, added to one line and taken from another.</p>`,draw:cuChart},
 {t:"Heat, derating and the 1% guideline",
  body:`<p>The extra current heats the windings. A rule from DOE: the added temperature rise in percent is about <b>2 × (% unbalance)²</b>. At 2% that's 8% more rise, and every 10°C hotter halves insulation life.</p><ul><li>NEMA MG 1 says a motor runs fine at rated load with <b>1% or less</b> unbalance at its terminals.</li><li>Above 1%, <b>derate</b> it: run it at less than nameplate load.</li><li>NEMA recommends against running above 5%.</li></ul><p>Over 1% can also void a motor warranty.</p>`,draw:derChart},
 {t:"Single phasing: the worst unbalance",
  body:`<p>Lose a whole phase (a blown fuse, a burned contact, a broken lead) and the motor is <b>single phasing</b>:</p><ul><li><b>Running</b>: it keeps turning on two lines, but those lines carry about <b>1.73 times</b> normal current. It heats fast. Near full load it may stall.</li><li><b>Stopped</b>: it can't start. It hums at locked-rotor current.</li></ul><p>One line reads zero amps. The overload relay must sense all three lines so it trips. Suspect single phasing when a motor won't start.</p>`,draw:single},
 {t:"Supply or motor? Roll the leads",
  body:`<p>Found one line drawing more current? Find out whether the supply or the motor causes it:</p><ol><li>Record the amps on L1, L2, L3.</li><li>Lock out and move every motor lead one place (A to L2, B to L3, C to L1). Moving all three keeps the rotation the same.</li><li>Run it and read the amps again.</li></ol><p>If the high current <b>stays on the same supply line</b>, the problem is the supply. If it <b>follows the motor lead</b>, it's the motor (a winding or a connection in the box).</p>`,draw:roll}];
/* ---------- See it ---------- */
const see=K.see({vb:"0 0 720 380",init:{v12:462,v23:463,v31:455,load:100,lra:6,sp:0},
 sliders:[["v12","Volts L1-L2",420,500,1,v=>v+" V"],["v23","Volts L2-L3",420,500,1,v=>v+" V"],["v31","Volts L3-L1",420,500,1,v=>v+" V"],["load","Motor load",25,115,5,v=>v+"%"],["lra","Locked-rotor amps",5,8,0.5,v=>v+"× FLA"]],
 checks:[["sp","Blow the L3 fuse (single phasing, running)"]],
 model:solve,draw:(R,S)=>{let s=bars(60,50,240,230,R.v,Math.floor((Math.min(...R.v)-20)/10)*10,Math.ceil((Math.max(...R.v)+10)/10)*10," V","VOLTAGES (10 HP, 460 V)",R.N.avg,VC,{names:["L1-L2","L2-L3","L3-L1"]});
  s+=bars(420,50,240,230,R.I,0,Math.max(30,Math.ceil(Math.max(...R.I)/10)*10)," A","LINE CURRENTS",R.sp?null:R.NI.avg,PC,{lim:FLA,limL:"FLA"});
  s+=`<rect x="50" y="338" width="620" height="36" rx="6" fill="var(--paper)" stroke="${R.N.pct>1||R.sp?"var(--bad)":"var(--panel-edge)"}"/>`;
  s+=K.txt(360,361,R.sp?"Single phasing: L3 reads 0 A, L1 and L2 carry about 1.73 times the normal line current":`${K.f1(R.N.dev)} V ÷ ${K.f1(R.N.avg)} V × 100 = ${K.f2(R.N.pct)}% voltage unbalance  →  ${K.f1(R.NI.pct)}% current unbalance`,{fill:R.N.pct>1||R.sp?"var(--bad)":undefined});return s},
 reads:R=>[["Average voltage",K.f1(R.N.avg)+" V"],["Voltage unbalance",K.f2(R.N.pct)+"%",R.N.pct>1],["Current unbalance",R.sp?"single phasing":K.f1(R.NI.pct)+"%",R.sp||R.NI.pct>10],["Current ÷ voltage unbalance",R.sp||R.N.pct<0.05?"-":K.f1(R.ratio)+"×"],["Extra temperature rise",R.sp?"severe":K.f1(R.rise)+"%",R.rise>2||R.sp],["Usable load (derating)",R.sp?"0%":isNaN(R.der)?"don't run":K.f0(R.der*100)+"%",R.sp||!(R.der>=1)]],
 note:(R,S)=>R.sp?`With L3 open the motor keeps running on L1 and L2 at about ${K.f1(R.I[0])} A each (${K.f1(R.Irun)} A before). A 3-pole overload sees that and trips; without it the motor burns.`:R.N.pct>5?"Over 5%: NEMA recommends not running the motor at all. Fix the supply.":R.N.pct>1?`Over the 1% guideline: derate to ${K.f0(R.der*100)}% load, or fix the supply. Current unbalance is ${K.f1(R.ratio)} times the voltage unbalance.`:`Within the 1% guideline. Even so, current unbalance is ${R.N.pct<0.05?"near zero":K.f1(R.ratio)+" times the voltage unbalance"}.`,
 log:[["V unbal",R=>K.f2(R.N.pct)+"%"],["I unbal",R=>R.sp?"SP":K.f1(R.NI.pct)+"%"],["Load",(R,S)=>S.load+"%"],["Derate",R=>isNaN(R.der)?"-":K.f0(R.der*100)+"%"]]});
/* ---------- Try it ---------- */
const tasks=[
 K.goal({t:"Work the DOE example",intro:"Set the three voltages to 462, 463 and 455 V at full load (100%), locked-rotor amps 6× FLA, no blown fuse. Read the unbalance, then compare the current unbalance to it.",
  check:(S,R)=>S.v12!==462||S.v23!==463||S.v31!==455?"Set L1-L2 462 V, L2-L3 463 V, L3-L1 455 V.":S.load!==100?"Set the load to 100%.":S.lra!==6?"Set locked-rotor amps to 6× FLA.":S.sp?"Put the L3 fuse back.":true,
  ok:(S,R)=>`${K.f2(R.N.pct)}% voltage unbalance (5 ÷ 460 × 100) gives ${K.f1(R.NI.pct)}% current unbalance: ${K.f1(R.ratio)} times as much. Just over 1%, so this motor needs a little derating.`}),
 K.goal({t:"Derate for a low leg",intro:"The utility has one leg 10 V low: set two voltages to 470 V and one to 460 V. Then set the motor load to what the derating curve allows (within 5% below it, not above it).",
  check:(S,R)=>{const v=[S.v12,S.v23,S.v31].sort((a,b)=>a-b);if(v[0]!==460||v[1]!==470||v[2]!==470)return "Two voltages at 470 V and one at 460 V.";if(S.sp)return "Put the L3 fuse back.";const lim=R.der*100;return S.load>lim+0.01?`${S.load}% is above the ${K.f0(lim)}% the curve allows.`:S.load<lim-5?`${S.load}% is more derating than needed: the curve allows ${K.f0(lim)}%.`:true},
  ok:(S,R)=>`${K.f2(R.N.pct)}% unbalance allows about ${K.f0(R.der*100)}% load. On the job, the better fix is the supply: call the utility or find the bad connection.`}),
 K.caseTask({t:"Service call: one leg runs high",intro:"A 10 hp pump motor trips its overload on hot afternoons. Amps: L1 14.2, L2 16.9, L3 14.0. You lock out, roll the leads one place and run it again.",
  state:{v12:468,v23:462,v31:452,load:100,lra:6,sp:0},model:solve,draw:roll,vb:"0 0 720 380",
  reads:()=>[["Before roll","L2 high (16.9 A)"],["After roll","L2 still high (16.8 A)"],["Motor lead on L2","changed from B to C"],["Megger, all windings","good"]],
  actions:[["Measure the voltages",()=>"468, 462 and 452 V line to line: 1.9% unbalance."],["Check the disconnect",()=>"A lug on L3 is discolored and warm."]],
  causes:[["supply","Voltage unbalance from the supply"],["wind","A bad motor winding"],["sp","Single phasing"],["ol","Overload set too low"]],ans:"supply",
  why:"The high current stayed on the same supply line after rolling, so the motor isn't the cause. 1.9% voltage unbalance (here helped by a hot lug) gives about 10 times that in current unbalance. Fix the connection and recheck the voltages.",
  hint:"Did the high current follow the motor lead, or stay with the supply line?"})];
window.LESSON={id:"tph-imbalance",sec:"3-Phase Motor Control",secHref:"/threephase/",title:"Single phasing and voltage imbalance",lead:"A small voltage imbalance makes six to ten times as much current imbalance and heat, and losing a phase entirely is the worst case.",
 steps,see,tryIntro:"Two settings in See it, then a service call.",tasks,
 job:K.job({read:["Line-to-line voltage, all three pairs, at the motor terminals with the motor running.","Amps on all three leads at the same time of day and load.","The overload: it must sense all three lines.","Fuses or breaker poles on all three lines when a motor won't start."],
  table:[["Voltage unbalance","What it means","Action"],["Up to 1%","Normal (NEMA MG 1)","Log it"],["1% to 2%","Current unbalance about 6 to 20%","Derate a little; find the cause"],["2% to 5%","Large extra heat (8 to 50% more rise)","Derate per the curve; fix the supply"],["Over 5%","Too much","Don't run the motor"],["One line at 0 A","Single phasing","Stop and find the open line"]],
  steps:["Read the three voltages; work out the NEMA %.","Read the three currents; work out the current unbalance the same way.","If current is unbalanced, roll the leads to tell supply from motor.","Supply problem: check lugs, fuses, contacts and other single-phase loads on the panel, then call the utility if it's coming in that way.","Motor problem: check the connections in the terminal box, then winding resistance and insulation."],
  safety:["Voltage readings are taken live: wear the arc-flash PPE your site requires and use a CAT III or CAT IV meter.","Lock out and verify dead before rolling leads or touching lugs.","Don't reset an overload on a motor that tripped from single phasing until you've found the open line."],
  mistakes:["Reading only one voltage pair and calling it good.","Measuring at the panel instead of at the motor.","Replacing the motor when the problem is the supply (roll the leads first).","Swapping two leads during a lead roll, which reverses the motor."]}),
 sources:[["The Engineering Mindset: Three phase electricity explained","https://theengineeringmindset.com/three-phase-electricity-explained/"],["U.S. DOE Motor Systems Tip Sheet #7: Eliminate voltage unbalance (archived)","https://webarchive.library.unt.edu/web/20120916062823/http://www1.eere.energy.gov/manufacturing/tech_deployment/pdfs/eliminate_voltage_unbalanced_motor_systemts7.pdf"],["Pumps & Systems: Unbalanced voltages and electric motors","https://www.pumpsandsystems.com/unbalanced-voltages-and-electric-motors"],["Engineering ToolBox: Voltage imbalance vs derating factor","https://engineeringtoolbox.com/electrical-motor-voltage-imbalance-d_648.html"]]};
})();
