/* ============ Lesson: Reading a motor nameplate ============ */
(()=>{
const M=MK.M;
/* the motor at a load fraction, on a supply, wired one way. Slip grows about in step with load in the normal range. */
const SLIP_FL=(1800-M.rpm)/1800;
const model=S=>{const ns=MK.sync(S.hz,S.poles),ld=S.load/100,slip=SLIP_FL*ld,rpm=ns*(1-slip);
 const rated=S.wire?460:230,fla=S.wire?13.3:26.6,ratio=S.volts/rated;
 // a winding fed at the wrong voltage: double voltage saturates the iron (magnetizing current climbs steeply); half voltage needs about double the current for the same torque
 let I;if(ratio>1.5)I=fla*Math.sqrt(Math.pow(MK.MAG*Math.pow(ratio,3),2)+Math.pow(ld*(1-MK.MAG*MK.MAG)**.5/ratio,2));
 else if(ratio<0.7)I=fla*Math.sqrt(Math.pow(MK.MAG*ratio,2)+Math.pow(ld*(1-MK.MAG*MK.MAG)**.5/ratio,2));
 else I=MK.amps(ld,fla);
 const sfA=MK.amps(M.SF,fla),olMax=fla*1.25,lraLo=6.3*M.hp*1000/(Math.sqrt(3)*S.volts),lraHi=7.09*M.hp*1000/(Math.sqrt(3)*S.volts);
 const hp=M.hp*ld*(ratio>1.5||ratio<0.7?0:1);
 return {ns,rpm,slip,ld,I,fla,sfA,olMax,lraLo,lraHi,ratio,rated,over:I>sfA+0.05,wrong:ratio>1.5||ratio<0.7,hp,shaftT:M.Tr*ld}};
/* terminal box drawing: 9-lead wye, low or high voltage. (x,y) top-left of a 300 x 220 box */
const tbox=(x,y,high,o={})=>{let s=`<rect x="${x}" y="${y}" width="300" height="220" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+150,y+24,o.title||(high?"460 V: SERIES (HIGH VOLTAGE)":"230 V: PARALLEL (LOW VOLTAGE)"),{size:13,fill:o.c});
 const P={1:[60,80],2:[150,80],3:[240,80],7:[60,130],8:[150,130],9:[240,130],4:[60,185],5:[150,185],6:[240,185]};
 const pt=k=>[x+P[k][0],y+P[k][1]];
 const link=(a,b,c="var(--brass)")=>{const A=pt(a),B=pt(b);return `<path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`};
 if(high){s+=link(4,7)+link(5,8)+link(6,9)}else{s+=link(1,7)+link(2,8)+link(3,9)+link(4,5)+link(5,6)}
 Object.keys(P).forEach(k=>{const [a,b]=pt(k);s+=`<circle cx="${a}" cy="${b}" r="13" fill="#e9ecee" stroke="#59636a" stroke-width="1.5"/><text x="${a}" y="${b+5}" class="lsGn" style="font-size:13px;font-weight:600">${k}</text>`});
 ["L1","L2","L3"].forEach((n,i)=>{const [a,b]=pt(i+1);s+=MK.wire(`M${a} ${b-14} V${y+42}`,MK.COLS[n],3)+K.txt(a+16,y+50,n,{a:"start",fill:MK.COLS[n]})});
 return s};
const steps=[
 {t:"The nameplate is the motor's data sheet",
  body:`<p>Every motor carries a metal tag with the numbers you need to wire it, protect it and check it. Read it before you touch the motor, and take a photo of it for the job file.</p><p>This is a real 10 hp, 460 V, four-pole <b>TEFC</b> (totally enclosed, fan cooled) motor, the same one the Motors + VFD trainer runs. The next steps take the tag one box at a time.</p>`,
  draw:()=>MK.motor(70,130,0.95,{label:"10 HP TEFC MOTOR, 215T FRAME"})+MK.plate(390,40,310,300,MK.ROWS,{})+`<path d="M210 170 C 260 120, 320 90, 390 100" stroke="var(--muted)" stroke-dasharray="4 4" fill="none"/>`},
 {t:"Speed: synchronous speed and slip",
  body:`<p>The stator makes a magnetic field that spins at the <b>synchronous speed</b>. It depends only on the supply frequency and the number of magnetic <b>poles</b>:</p><p class="lsKey">Synchronous rpm = 120 × Hz ÷ poles</p><p>60 Hz, 4 poles: 120 × 60 ÷ 4 = <b>1800 rpm</b>. The rotor always turns a little slower, or no current would be induced in it. That difference is <b>slip</b>. The nameplate rpm (1765) is the speed at full load.</p>`,
  math:`<p>Slip = (synchronous − actual) ÷ synchronous = (1800 − 1765) ÷ 1800 = 1.9%.</p><p>So a nameplate speed near 3600, 1800, 1200 or 900 tells you the motor has 2, 4, 6 or 8 poles. At no load the shaft runs almost at synchronous speed (about 1799 rpm). Standard motors run at about 96 to 99% of synchronous speed at full load.</p>`,
  draw:()=>{let s="";const pole=[2,4,6,8];pole.forEach((p,i)=>{const x=60+i*165,ns=MK.sync(60,p),fl=ns*(1-SLIP_FL);s+=`<rect x="${x}" y="40" width="140" height="190" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
   for(let k=0;k<p;k++){const a=2*Math.PI*k/p-Math.PI/2,cx=x+70,cy=110;s+=`<path d="M${cx+30*Math.cos(a-Math.PI/p*.7)} ${cy+30*Math.sin(a-Math.PI/p*.7)} A30 30 0 0 1 ${cx+30*Math.cos(a+Math.PI/p*.7)} ${cy+30*Math.sin(a+Math.PI/p*.7)}" stroke="${k%2?"#2f6fd6":"#c0392b"}" stroke-width="12" fill="none"/>`}
   s+=`<circle cx="${x+70}" cy="110" r="18" fill="#9aa3a8" stroke="#59636a"/>`+K.lbl(x+70,172,p+" POLES",{size:14})+K.txt(x+70,196,MK.n0(ns)+" rpm field")+K.txt(x+70,218,"about "+MK.n0(Math.round(fl/5)*5)+" at load")});
   s+=K.lbl(360,272,"60 HZ: SYNCHRONOUS RPM = 7200 ÷ POLES",{size:15});
   s+=`<rect x="150" y="296" width="420" height="58" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.txt(360,320,"This motor: 1800 rpm field, 1765 rpm shaft")+K.lbl(360,344,"SLIP = 35 RPM = 1.9%",{size:14,fill:"var(--brass)"});return s}},
 {t:"Amps, service factor and the overload",
  body:`<p><b>FLA</b> (full load amps) is the current at rated hp and voltage: 13.3 A at 460 V. A motor drawing more than FLA is working harder than its rating.</p><p><b>Service factor</b> (S.F.) 1.15 means it can carry 15% more load for a while at rated voltage and frequency, but it runs hotter and wears faster. Don't size a job on it.</p><p>Use the nameplate FLA to set the <b>overload</b>. On an S.F. 1.15 motor, NEC 430.32 allows up to 125% of FLA. Wire and breakers are sized from the NEC table current (14 A for 10 hp, 460 V), not the nameplate.</p>`,
  draw:()=>{const R=model({poles:4,hz:60,load:100,volts:460,wire:1});const bars=[["NAMEPLATE FLA",13.3,"var(--ok)"],["AT 115% LOAD (S.F.)",R.sfA,"var(--warn)"],["NEC TABLE FLC",14,"var(--cold)"],["OVERLOAD MAX 125%",R.olMax,"var(--bad)"]];
   let s=`<path d="M200 330 H680" stroke="var(--muted)"/>`;[0,5,10,15,20].forEach(v=>{const x=200+v*24;s+=`<path d="M${x} 330 v6" stroke="var(--muted)"/>`+K.txt(x,354,v+" A")});
   bars.forEach(([t,v,c],i)=>{const y=60+i*66;s+=`<rect x="200" y="${y}" width="${v*24}" height="40" rx="5" fill="${c}"/>`+K.lbl(190,y+26,t,{a:"end",size:13})+`<text x="${206+v*24}" y="${y+27}" style="font:600 16px var(--mono);fill:var(--ink)">${K.f1(v)} A</text>`});
   return s+K.txt(440,30,"10 HP, 460 V, S.F. 1.15")}},
 {t:"Insulation class and ambient",
  body:`<p>The winding insulation is rated for a maximum temperature. The <b>insulation class</b> letter on the tag tells you which:</p><ul><li>Class B: 130°C</li><li>Class F: 155°C (most modern motors)</li><li>Class H: 180°C</li></ul><p><b>AMB 40°C</b> is the hottest room air the rating assumes. The motor's allowed <b>temperature rise</b> sits on top of that. As a rule of thumb, every 10°C over the rating cuts insulation life about in half.</p>`,
  math:`<p>Allowed rise over a 40°C ambient (Toshiba, from NEMA MG 1): Class B 80°C at S.F. 1.0, 90°C at S.F. 1.15. Class F 105°C and 115°C. Class H 125°C at S.F. 1.0.</p><p>Many class F motors are built to run with only a class B rise, which leaves margin and gives longer life.</p>`,
  draw:()=>{const cl=[["A",105,60],["B",130,80],["F",155,105],["H",180,125]];const Y=v=>330-v*1.45;let s=`<path d="M120 330 H660" stroke="var(--muted)"/>`;
   [0,40,80,120,160,200].forEach(v=>{s+=`<path d="M120 ${Y(v)} H660" stroke="var(--panel-edge)" stroke-width=".7"/>`+K.txt(112,Y(v)+5,v+"°C",{a:"end"})});
   cl.forEach(([n,max,rise],i)=>{const x=170+i*125;s+=`<rect x="${x}" y="${Y(40)}" width="70" height="${40*1.45}" fill="#7fa2c2"/><rect x="${x}" y="${Y(40+rise)}" width="70" height="${rise*1.45}" fill="${n==="F"?"var(--warn)":"#d9a35a"}"/><rect x="${x}" y="${Y(max)}" width="70" height="${(max-40-rise)*1.45}" fill="var(--bad)" opacity=".55"/>`+K.lbl(x+35,Y(max)-8,"CLASS "+n+": "+max+"°C",{size:13,fill:n==="F"?"var(--brass)":null})});
   s+=`<rect x="440" y="20" width="14" height="12" fill="#7fa2c2"/>`+K.txt(460,31,"40°C ambient",{a:"start"})+`<rect x="560" y="20" width="14" height="12" fill="#d9a35a"/>`+K.txt(580,31,"rise",{a:"start"});
   s+=`<rect x="120" y="20" width="14" height="12" fill="var(--bad)" opacity=".55"/>`+K.txt(140,31,"hot-spot margin",{a:"start"});return s}},
 {t:"Code letter, design and frame",
  body:`<p>The <b>code letter</b> tells you how hard the motor pulls on start (locked rotor kVA per hp). Code <b>H</b> is 6.3 to 7.09 kVA per hp, which works out to about 79 to 89 A on this motor at 460 V. Marathon lists 81 A: about 6 times FLA.</p><p><b>Design B</b> is the normal NEMA torque and current curve.</p><p>The <b>frame</b> (215T) fixes the mounting: the first two digits divided by 4 give the shaft height in inches (21 ÷ 4 = 5.25 in.). The T means the modern NEMA shaft size.</p>`,
  math:`<p>Locked rotor amps = kVA/hp × hp × 1000 ÷ (1.732 × volts).</p><p>6.3 × 10 × 1000 ÷ (1.732 × 460) = 79 A, and 7.09 × 10 × 1000 ÷ (1.732 × 460) = 89 A.</p>`,
  draw:()=>{const g=MK.defs();let s=g.d+MK.motor(60,150,1,{box:true});s+=`<path d="M40 304 H400" stroke="var(--muted)" stroke-width="2"/><path d="M380 210 V304" stroke="var(--brass)" stroke-width="2"/><path d="M372 210 h16 M372 304 h16" stroke="var(--brass)" stroke-width="2"/>`+K.tag(372,262,"5.25 IN.",{a:"end",fill:"var(--brass)"});
   s+=MK.box(430,40,260,"CODE H, 10 HP, 460 V","79 TO 89 A",{vs:20})+MK.box(430,110,260,"MARATHON LISTS","81 A LOCKED",{vs:20})+MK.box(430,180,260,"FLA","13.3 A",{vs:20})+MK.box(430,250,260,"LOCKED ÷ FLA","6.1 ×",{vs:20,vc:"var(--brass)"});
   s+=K.lbl(200,80,"FRAME 215T",{size:15})+K.txt(200,104,"shaft height = 21 ÷ 4");return s}},
 {t:"Dual voltage: 9 leads, two ways",
  body:`<p>Most 3-phase motors are <b>dual voltage</b>: 230/460 V. Each phase has two coils. You connect them in <b>parallel</b> for 230 V or in <b>series</b> for 460 V. Amps go the other way: 26.6 A at 230 V, 13.3 A at 460 V. Same power.</p><p>On a 9-lead wye motor:</p><ul><li><b>460 V</b>: L1-1, L2-2, L3-3. Tie 4-7, 5-8, 6-9.</li><li><b>230 V</b>: L1-1-7, L2-2-8, L3-3-9. Tie 4-5-6.</li></ul><p>Always follow the diagram on the motor's own tag.</p>`,
  draw:()=>tbox(40,60,true,{c:"var(--ok)"})+tbox(380,60,false,{c:"var(--cold)"})+K.txt(190,310,"two coils per phase in series")+K.txt(530,310,"two coils per phase side by side")+K.lbl(360,350,"WRONG CONNECTION = WRONG VOLTS PER COIL",{size:14,fill:"var(--bad)"})}];
/* ---------- See it ---------- */
const scene=(R,S)=>{let s=MK.motor(70,120,0.88,{box:true});
 s+=MK.box(30,300,140,"SHAFT",MK.n0(R.rpm)+" RPM",{vs:18})+MK.box(180,300,140,"FIELD",MK.n0(R.ns)+" RPM",{vs:18});
 s+=MK.box(40,30,130,"SUPPLY",S.volts+" V",{vs:18,vc:R.wrong?"var(--bad)":null})+MK.box(180,30,140,"WIRED FOR",R.rated+" V",{vs:18,vc:R.wrong?"var(--bad)":null});
 const rows=[["HP","10"],["VOLTS","230/460"],["AMPS","26.6/13.3"],["RPM","1765"],["S.F.","1.15"],["CODE","H"]];
 s+=MK.plate(370,24,330,170,rows,{hi:[]});
 // amps meter bar
 const x0=380,w=310,mx=R.fla*1.4,X=a=>x0+Math.min(1,a/mx)*w;
 s+=K.lbl(x0,230,"MOTOR CURRENT",{a:"start",size:13})+`<rect x="${x0}" y="242" width="${w}" height="30" rx="5" fill="var(--bg)" stroke="var(--panel-edge)"/><rect x="${x0}" y="242" width="${X(R.I)-x0}" height="30" rx="5" fill="${R.wrong||R.I>R.olMax?"var(--bad)":R.over?"var(--warn)":"var(--ok)"}"/>`;
 [[R.fla,"FLA"],[R.sfA,"S.F."],[R.olMax,"OL 125%"]].forEach(([a,t],i)=>{s+=`<path d="M${X(a)} 238 V${282+i*18}" stroke="var(--ink)" stroke-width="${i?1.4:2}" stroke-dasharray="${i?"3 3":""}"/>`+K.txt(X(a)-4,296+i*18,t+" "+K.f1(a)+" A",{a:"end"})});
 if(R.I>mx)s+=`<path d="M${x0+w-4} 247 l10 10 l-10 10" stroke="#fff" stroke-width="3" fill="none"/>`;
 s+=`<text x="${x0+w}" y="232" style="font:600 18px var(--mono);fill:var(--ink);text-anchor:end">${K.f1(R.I)} A</text>`;
 s+=K.txt(540,362,`slip ${K.f1(R.slip*100)}% · ${S.poles} poles at ${S.hz} Hz`);return s};
const see=K.see({init:{poles:6,hz:60,load:75,volts:460,wire:1},
 sliders:[["poles","Poles",2,8,2,v=>v+" poles"],["hz","Supply frequency",50,60,10,v=>v+" Hz"],["load","Load",0,130,5,v=>v+"% of 10 hp"],["volts","Supply voltage",230,460,230,v=>v+" V"],["wire","Leads connected for",0,1,1,v=>v?"460 V (series)":"230 V (parallel)"]],
 model,draw:scene,
 reads:R=>[["Synchronous speed",MK.n0(R.ns)+" rpm"],["Shaft speed",MK.n0(R.rpm)+" rpm"],["Slip",K.f1(R.slip*100)+"%"],["Current",K.f1(R.I)+" A",R.over||R.wrong],["Nameplate FLA",K.f1(R.fla)+" A"],["Current at S.F. load",K.f1(R.sfA)+" A"],["Overload max (125%)",K.f1(R.olMax)+" A"],["Locked rotor, code H",K.f0(R.lraLo)+" to "+K.f0(R.lraHi)+" A"]],
 note:(R,S)=>R.wrong&&R.ratio>1.5?"Double voltage on each coil: the iron saturates, current climbs far past FLA and the winding burns in minutes.":R.wrong?"Half voltage on each coil: the motor can't make its torque and draws too much current to try. It overheats.":S.load>115?"Past the service factor. The overload should trip.":S.load>100?"Inside the service factor, but hotter than rated.":S.load===0?"No load: shaft speed almost equals synchronous speed.":"",
 log:[["Poles/Hz",(R,S)=>S.poles+"/"+S.hz],["Load",(R,S)=>S.load+"%"],["rpm",R=>MK.n0(R.rpm)],["Amps",R=>K.f1(R.I)]]});
const tasks=[
 K.goal({t:"Match the nameplate",intro:"Set up See it so the motor runs exactly as the tag says: <b>1765 rpm</b> and <b>13.3 A</b>, on a 460 V supply with the leads wired correctly.",
  check:(S,R)=>S.volts!==460?"Use the 460 V supply.":!S.wire?"The leads are wired for 230 V. Move them to 460 V.":S.hz!==60?"The tag says 60 Hz.":S.poles!==4?`${MK.n0(R.ns)} rpm field. Which pole count gives 1800 rpm at 60 Hz?`:S.load!==100?"Nameplate speed and amps are at full load.":true,
  ok:"Four poles, 60 Hz, full load: 1800 rpm field, 1765 rpm shaft, 13.3 A. Every nameplate number is a full-load number."}),
 K.goal({t:"Find the service factor limit",intro:"Same motor wired right on 460 V at 60 Hz. Load it to the most the <b>service factor</b> allows and log the reading. Then load it one step past and log that too.",
  check:(S,R,L)=>{const ok=l=>l.S.volts===460&&l.S.wire&&l.S.hz===60&&l.S.poles===4;const a=L.some(l=>ok(l)&&l.S.load===115),b=L.some(l=>ok(l)&&l.S.load>115);return !a?"Log a reading at the S.F. load (1.15 × 10 hp = 11.5 hp).":!b?"Now log one past it.":true},
  ok:"At 115% load it draws about 15.1 A and the shaft slows to about 1760 rpm. Past that, the current goes over the S.F. current. An overload set at 125% of FLA (16.6 A) is the backstop."}),
 K.caseTask({t:"Service call: new motor trips on start-up",intro:"A replacement 230/460 V motor was just installed on a 460 V air handler. It growls, gets hot and trips the overload within a minute. Here's the terminal box.",
  state:{poles:4,hz:60,load:80,volts:460,wire:0},model,
  draw:(R,S)=>tbox(40,60,false,{c:"var(--ink)",title:"TERMINAL BOX AS FOUND"})+MK.box(400,70,280,"SUPPLY, MEASURED","462 V",{vs:20})+MK.box(400,140,280,"CLAMP, EACH LEAD",K.f0(R.I)+" A",{vs:20,vc:"var(--bad)"})+MK.box(400,210,280,"NAMEPLATE FLA","26.6/13.3 A",{vs:20})+K.txt(190,310,"as found in the motor's terminal box"),
  reads:R=>[["Supply","462 V, balanced"],["Current",K.f0(R.I)+" A",true],["Overload set","16.6 A"]],
  actions:[["Megger the winding",()=>"1,200 MΩ phase to ground at 500 V DC. Insulation is fine."],["Read the lead connections",()=>"L1 on 1 and 7, L2 on 2 and 8, L3 on 3 and 9. Leads 4, 5 and 6 tied together."]],
  causes:[["wire","Leads connected for 230 V on a 460 V supply"],["ol","Overload set too low"],["gnd","Winding shorted to ground"],["volt","Supply voltage too high"]],ans:"wire",
  why:"That's the 230 V (parallel) connection. Each coil now sees twice its voltage, the iron saturates and the current runs away. Reconnect for 460 V: L1-1, L2-2, L3-3, tie 4-7, 5-8, 6-9. Then megger it again before restarting, since it may have been cooked.",hint:"Compare the lead connections to the two diagrams on the tag."})];
window.LESSON={id:"mot-plate",sec:"Motors + VFD",secHref:"/motors/",title:"Reading a motor nameplate",lead:"What every number on a motor nameplate means: hp, volts, amps, rpm and slip, service factor, insulation class, code letter, frame and dual-voltage wiring.",
 steps,see,tryIntro:"Two setups in See it, then a start-up call.",tasks,
 job:K.job({read:["Photograph the nameplate before you start. Paint and grease make them hard to read later.","Volts and connection diagram, then FLA for the connection you use.","RPM (gives the pole count), S.F., insulation class, code letter, frame and enclosure.","Compare running amps to FLA with a clamp meter on each lead."],
  table:[["Nameplate item","What it tells you","On this motor"],["HP / volts / Hz","Rated output at the rated supply","10 hp, 230/460 V, 60 Hz"],["FLA","Current at full load; set the overload from it","26.6 / 13.3 A"],["RPM","Full-load speed. 120 × Hz ÷ poles gives synchronous speed","1765 (1800 sync, 4 poles)"],["S.F.","Extra load it tolerates at rated voltage, running hotter","1.15"],["Insulation class","Maximum winding temperature","F (155°C)"],["Code letter","Locked rotor kVA per hp","H (6.3 to 7.09)"],["Frame","Mounting and shaft size","215T (5.25 in. shaft height)"]],tableT:"The nameplate",
  steps:["Check the supply voltage matches a nameplate voltage, within ±10%.","Check the lead connections match the diagram for that voltage.","Set the overload from nameplate FLA (up to 125% on S.F. 1.15 or 40°C rise motors, 115% on others, per NEC 430.32).","Run it and clamp each lead: amps should be at or under FLA and balanced within a few percent.","Check the shaft speed with a tachometer if the load seems wrong: speed close to synchronous means light load."],stepsT:"Commissioning from the nameplate",
  safety:["Lock out and verify zero voltage before opening the terminal box.","A motor on a VFD can start on its own when the drive gets a run command. Lock out the drive's disconnect, not just the keypad.","Replace the terminal box gasket and cover: TEFC motors depend on it to keep water out."],
  mistakes:["Sizing wire and breakers from nameplate FLA instead of the NEC table current.","Setting the overload at the S.F. current plus 25% (stacking the margins).","Reading the 230 V amps on a 460 V job.","Assuming a replacement motor is wired from the factory for your voltage."]}),
 sources:[["The Engineering Mindset: induction motor basics","https://theengineeringmindset.com/induction-motor-basics/"],["Marathon 215THFND9026: 10 hp, 460 V, 1765 rpm, 13.3 A, S.F. 1.15, class F, code H, 81 A locked rotor","https://marathonelectric.com/product/215THFND9026/severe-duty-motor-10-hp-3-ph-60-hz-460-v-1800-rpm-215t-frame-tefc"],["EC&M: understanding induction motor nameplate information","https://www.ecmweb.com/maintenance-repair-operations/motors/article/20896372/understanding-induction-motor-nameplate-information"],["EC&M: motor wiring, part 2 (9-lead dual-voltage connections)","https://www.ecmweb.com/electrical-testing/motor-wiring-part-2"],["The Engineering ToolBox: locked rotor code letters (NEC 430.7)","https://engineeringtoolbox.com/locked-rotor-code-d_917.html"],["Toshiba: motor temperature rise and insulation class","https://www.toshiba.com/tic/datafiles/app_notes/Temperature_Rise_1605749858.pdf"],["Mike Holt, NEC 430.6(A): table current for conductors, nameplate FLA for overloads","https://www.mikeholt.com/files/PDF/20UNEC1_430.6.pdf"]]};
})();
