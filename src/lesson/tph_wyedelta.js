/* ============ Lesson: Wye-delta starting ============ */
(()=>{
const PC=TPK.PC,R3=Math.sqrt(3);
const HP=[10,15,20,25,30,40,50],VS=[208,230,460];
const flaOf=(hp,V)=>TPK.FLA460[hp]*460/V;
/* acceleration model: per-unit torque and current from the NEMA design B curves in the kit.
 H = 3 s inertia constant (the seconds full-load torque would take to get the rotor to synchronous speed).
 wye: winding voltage / sqrt3, so torque and line current are 1/3 of delta at every speed. */
const H=3;
const sim=o=>{const {timer,load,ct,closed}=o,TL=n=>ct?load:load*Math.pow(n/0.965,2);let n=0,t=0;const dt=0.01,pts=[],dol=[];
 let nTr=null,iStep=null,peak=0,t90=Infinity,tFull=Infinity,stall=false;
 while(t<timer+12){const wye=t<timer;const k=wye?1/3:1;let I=TPK.lerp(TPK.IQ,n)*k;const Tm=TPK.lerp(TPK.TQ,n)*k;
  if(!wye&&nTr===null){nTr=n;const Id=TPK.lerp(TPK.IQ,n);iStep=Id;peak=closed?Id*1.05:Id+0.6*6*n;I=peak}
  if(wye&&n>=0.9&&t90===Infinity)t90=t;if(!wye&&n>=0.95&&tFull===Infinity)tFull=t;
  const acc=(Tm-TL(n))/H;n=Math.max(0,Math.min(0.999,n+acc*dt));if(wye&&t>1&&n<0.02)stall=true;
  if(Math.round(t/dt)%5===0||I===peak&&nTr!==null&&Math.abs(t-timer)<dt*1.5)pts.push([t,I]);t+=dt}
 /* direct on line, for comparison */
 n=0;t=0;let tD=Infinity;while(t<timer+12){const I=TPK.lerp(TPK.IQ,n),Tm=TPK.lerp(TPK.TQ,n);if(n>=0.95&&tD===Infinity)tD=t;n=Math.max(0,Math.min(.999,n+(Tm-TL(n))/H*dt));if(Math.round(t/dt)%5===0)dol.push([t,I]);t+=dt}
 n=0;t=0;let t90w=Infinity,stw=false;while(t<60){const Tm=TPK.lerp(TPK.TQ,n)/3;if(n>=0.9){t90w=t;break}n=Math.max(0,Math.min(.999,n+(Tm-TL(n))/H*dt));if(t>1&&n<0.02){stw=true;break}t+=dt}
 t90=t90w;stall=stw;
 return {pts,dol,nTr,iStep,peak,t90,tFull,tD,stall,iWye:TPK.lerp(TPK.IQ,0)/3,tWye:TPK.lerp(TPK.TQ,0)/3}};
/* winding diagrams */
const coil=(x1,y1,x2,y2,c)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,px=-uy,py=ux;let p=`M${x1} ${y1} L${x1+ux*L*.25} ${y1+uy*L*.25}`;
 for(let i=0;i<=8;i++){const f=.25+.5*i/8,a=i%2?7:-7;p+=` L${x1+ux*L*f+px*a} ${y1+uy*L*f+py*a}`}return `<path d="${p} L${x2} ${y2}" stroke="${c||"#b8692f"}" stroke-width="3" fill="none" stroke-linejoin="round"/>`};
const wye=(cx,cy,r,V,o={})=>{let s="";const pts=[0,1,2].map(k=>{const a=(-90+k*120)*Math.PI/180;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]});
 pts.forEach(([x,y],k)=>{s+=coil(cx,cy,x,y)+TPK.wire(`M${x} ${y} L${x+(x-cx)*.35} ${y+(y-cy)*.35}`,PC[k],true,3)+K.txt(x+(x-cx)*.55,y+(y-cy)*.55+5,"L"+(k+1),{fill:PC[k]})});
 s+=`<circle cx="${cx}" cy="${cy}" r="5" fill="var(--ink)"/>`;if(V)s+=K.txt(cx+(o.vdx??16),cy+(o.vdy??42),K.f0(V/R3)+" V each",{a:"start",fill:"var(--bad)"});
 if(o.lbl)s+=K.lbl(cx,cy+r+(o.ldy??40),o.lbl,{size:14});return s};
const delta=(cx,cy,r,V,o={})=>{let s="";const pts=[0,1,2].map(k=>{const a=(-90+k*120)*Math.PI/180;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]});
 [0,1,2].forEach(k=>{const a=pts[k],b=pts[(k+1)%3];s+=coil(a[0],a[1],b[0],b[1])});
 pts.forEach(([x,y],k)=>{s+=TPK.wire(`M${x} ${y} L${x+(x-cx)*.35} ${y+(y-cy)*.35}`,PC[k],true,3)+`<circle cx="${x}" cy="${y}" r="4" fill="var(--ink)"/>`+K.txt(x+(x-cx)*.55,y+(y-cy)*.55+5,"L"+(k+1),{fill:PC[k]})});
 if(V)s+=K.txt(cx,cy+12,K.f0(V)+" V each",{fill:"var(--bad)"});if(o.lbl)s+=K.lbl(cx,cy+r+(o.ldy??40),o.lbl,{size:14});return s};
/* step 1: across-the-line start */
const dolChart=()=>K.chart({x:80,y:40,w:560,h:270,X:[0,100],Y:[0,7],xt:[0,25,50,75,100],xf:v=>v+"%",yt:[0,1,2,3,4,5,6,7],yf:v=>v+"×",xl:"motor speed (% of synchronous)",yl:"× full load",title:"STARTING ACROSS THE LINE (DIRECT ON LINE)",
 series:[{f:x=>TPK.lerp(TPK.IQ,x/100),c:"#d62828",lbl:"CURRENT (× FLA)",lblAt:62,a:"start",dx:0,dy:-12},{f:x=>TPK.lerp(TPK.TQ,x/100),c:"#2f6fd6",lbl:"TORQUE (× FULL LOAD)",lblAt:30,a:"start",dx:0,dy:28},{f:x=>0.6*Math.pow(x/96.5,2),c:"var(--muted)",dash:"5 5",w:2,lbl:"FAN LOAD",lblAt:70,a:"start",dx:6,dy:14}],
 dots:[{x:0,y:6,c:"#d62828",lbl:"about 6× FLA at standstill",dx:12,dy:26}]});
/* step 2: six-lead motor terminal box */
const leads=()=>{let s="";const box=(ox,title,mode)=>{let g=`<rect x="${ox}" y="40" width="320" height="276" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(ox+160,64,title,{size:14});
  const xs=[ox+60,ox+160,ox+260];xs.forEach((x,k)=>{g+=coil(x,120,x,220)+TPK.sm(x+14,124,"T"+(k+1),{a:"start",size:12,fill:"var(--ink)"})+TPK.sm(x+14,224,"T"+(k+4),{a:"start",size:12,fill:"var(--ink)"})+`<circle cx="${x}" cy="120" r="4" fill="var(--ink)"/><circle cx="${x}" cy="220" r="4" fill="var(--ink)"/>`;
   g+=TPK.wire(`M${x} 98 V120`,PC[k],true,3)+K.txt(x,92,"L"+(k+1),{fill:PC[k]})});
  if(mode==="wye")g+=`<path d="M${xs[0]} 220 V254 H${xs[2]} V220 M${xs[1]} 220 V254" stroke="var(--ink)" stroke-width="3" fill="none"/>`+K.txt(ox+160,280,"T4, T5 and T6 tied together");
  else{const tb=[5,3,4];/* T4 to T2's line, T5 to T3's line, T6 to T1's line */
   g+=`<path d="M${xs[2]} 220 V262 H${ox+24} V106 H${xs[0]}" stroke="${PC[0]}" stroke-width="2.6" fill="none"/>`+`<path d="M${xs[0]} 220 V248 H${xs[1]-14} V108 H${xs[1]}" stroke="${PC[1]}" stroke-width="2.6" fill="none"/>`+`<path d="M${xs[1]} 220 V236 H${xs[2]-14} V108 H${xs[2]}" stroke="${PC[2]}" stroke-width="2.6" fill="none"/>`;
   g+=K.txt(ox+160,296,"T6 to L1, T4 to L2, T5 to L3")}
  return g};
 return box(20,"START: WYE (STAR)","wye")+box(380,"RUN: DELTA","delta")+K.txt(360,350,"Same motor, same six leads. Only the outside connections change.")};
/* step 3: line vs phase voltage */
const volts=()=>wye(190,170,90,460,{lbl:"WYE: 460 ÷ 1.732 = 266 V",ldy:70,vdx:-40,vdy:96})+delta(530,180,100,460,{lbl:"DELTA: FULL 460 V",ldy:60})+K.tag(360,40,"460 V LINE TO LINE IN BOTH",{});
/* step 4: one third, torque vs speed */
const third=()=>K.chart({x:80,y:40,w:560,h:270,X:[0,100],Y:[0,2.6],xt:[0,25,50,75,100],xf:v=>v+"%",yt:[0,.5,1,1.5,2,2.5],yf:v=>v+"×",xl:"motor speed (% of synchronous)",yl:"× full-load torque",title:"TORQUE: DELTA vs WYE",
 series:[{f:x=>TPK.lerp(TPK.TQ,x/100),c:"#2f6fd6",lbl:"DELTA",lblAt:84,dy:-12,a:"middle",dx:0},{f:x=>TPK.lerp(TPK.TQ,x/100)/3,c:"#7a5cd0",lbl:"WYE = 1/3",lblAt:30,dy:-12,a:"start",dx:0},{f:x=>0.5*Math.pow(x/96.5,2),c:"var(--muted)",dash:"5 5",w:2,lbl:"FAN AT 50% LOAD",lblAt:60,a:"start",dx:8,dy:20},{f:()=>0.8,c:"#a0662a",dash:"2 5",w:2,lbl:"CONVEYOR 80%",lblAt:2,a:"start",dx:0,dy:-8}]});
/* step 5: M, S and D */
const msd=()=>{let s="";const cp=(x,y,cl)=>`<path d="M${x-9} ${y} H${x+9} M${x-9} ${y+14} H${x+9}" stroke="var(--ink)" stroke-width="3"/>`+(cl?`<path d="M${x} ${y} V${y+14}" stroke="var(--ok)" stroke-width="3.5"/>`:"");
 const W=(d,c)=>`<path d="${d}" stroke="${c||"var(--ink)"}" stroke-width="2.4" fill="none"/>`,dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="var(--ink)"/>`;
 const X=[70,120,170];X.forEach((x,k)=>{s+=K.txt(x,22,"L"+(k+1),{fill:PC[k]})+TPK.wire(`M${x} 30 V52`,PC[k],true,3)+cp(x,52,true)+W(`M${x} 66 V150`)+dot(x,110)+coil(x,150,x,224)+W(`M${x} 224 V290`)+cp(x,290,true)+W(`M${x} 304 V320`)+dot(x,224);
  s+=TPK.sm(x+10,146,"T"+(k+1),{a:"start",size:11,fill:"var(--ink)"})+TPK.sm(x+10,238,"T"+(k+4),{a:"start",size:11,fill:"var(--ink)"})});
 s+=W(`M${X[0]} 320 H${X[2]}`)+`<path d="M${X[0]-16} 297 H${X[2]+16}" stroke="var(--ink)" stroke-dasharray="3 3"/><path d="M${X[0]-16} 59 H${X[2]+16}" stroke="var(--ink)" stroke-dasharray="3 3"/>`;
 const D=[240,280,320],top=[0,1,2],bot=[2,0,1];/* D pole a: T6 to T1 node, b: T4 to T2 node, c: T5 to T3 node */
 D.forEach((x,j)=>{const yt=118+j*8,yb=250+j*12;s+=W(`M${X[top[j]]} ${yt} H${x} V176`)+dot(X[top[j]],yt)+cp(x,176,false)+W(`M${x} 190 V${yb} H${X[bot[j]]}`)+dot(X[bot[j]],yb)});
 s+=`<path d="M${D[0]-16} 183 H${D[2]+16}" stroke="var(--ink)" stroke-dasharray="3 3"/>`;
 s+=K.lbl(X[2]+26,64,"M  IN",{a:"start",size:15,fill:"var(--ok)"})+K.lbl(X[2]+26,302,"S  IN",{a:"start",size:15,fill:"var(--ok)"})+K.lbl(D[2]+20,188,"D",{a:"start",size:15})+K.txt(D[2]+20,208,"out",{a:"start"});
 s+=K.txt(195,352,"start: M + S in, windings in wye",{});
 const x0=380;s+=`<rect x="${x0}" y="40" width="320" height="300" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 const rows=[["","M","S","D"],["Start (wye)","IN","IN","out"],["Timer done","IN","out","out"],["Run (delta)","IN","out","IN"]];
 rows.forEach((r,i)=>{const y=80+i*34;r.forEach((c,j)=>{s+=K.txt(j?x0+150+(j-1)*56:x0+16,y,c,{a:j?"middle":"start",fill:c==="IN"?"var(--ok)":undefined})})});
 s+=K.lbl(x0+16,236,"THE TIMER",{a:"start",size:14})+K.txt(x0+16,260,"set so the motor is near full",{a:"start"})+K.txt(x0+16,280,"speed before it switches.",{a:"start"})+K.txt(x0+16,312,"S and D are interlocked: never both.",{a:"start",fill:"var(--bad)"});
 return s};
/* step 6: open vs closed transition */
const trans=()=>{const o=sim({timer:9,load:.5,ct:false,closed:false}),c=sim({timer:9,load:.5,ct:false,closed:true});
 return K.chart({x:80,y:40,w:560,h:270,X:[0,14],Y:[0,8],xt:[0,2,4,6,8,10,12,14],xf:v=>v+" s",yt:[0,2,4,6,8],yf:v=>v+"×",xl:"time from START",yl:"× FLA",title:"LINE CURRENT, 9 s TIMER, FAN AT 50%",
  series:[{pts:o.dol.filter(p=>p[0]<=14),c:"var(--muted)",dash:"5 5",w:2,lbl:"ACROSS THE LINE",lblAt:1,a:"start",dx:10,dy:-6},{pts:o.pts.filter(p=>p[0]<=14),c:"#d62828",lbl:"OPEN TRANSITION",lblAt:9,a:"start",dx:12,dy:-30},{pts:c.pts.filter(p=>p[0]<=14),c:"#2f6fd6",w:2.5,lbl:"CLOSED",lblAt:11,a:"start",dx:8,dy:-6}]})};
const steps=[
 {t:"Why not just start it across the line?",
  body:`<p>Closing one contactor straight onto full voltage is <b>across-the-line</b> (direct-on-line) starting. It's simple, but at standstill the motor draws about <b>6 times FLA</b>.</p><p>On a big motor that inrush dips the voltage for everything else on the feeder, and it gives the load a hard jolt.</p><p>A fan barely needs any torque at low speed, so most of that current and torque is more than the job needs. Reduced-voltage starting trims it.</p>`,draw:dolChart},
 {t:"A six-lead motor: wye to start, delta to run",
  body:`<p>A wye-delta motor brings both ends of all three windings out to the terminal box: <b>T1 to T6</b>. Winding 1 is T1-T4, winding 2 is T2-T5, winding 3 is T3-T6.</p><ul><li><b>Wye (star)</b>: T4, T5 and T6 are tied together. The lines feed T1, T2, T3.</li><li><b>Delta</b>: each winding goes line to line: T1 and T6 on L1, T2 and T4 on L2, T3 and T5 on L3.</li></ul><p>The motor must be built to <b>run in delta</b> at your line voltage. Check the nameplate.</p>`,draw:leads},
 {t:"Line voltage vs phase voltage",
  body:`<p>In <b>delta</b>, each winding sits right across two lines, so it gets the full <b>line voltage</b>: 460 V.</p><p>In <b>wye</b>, two windings are in series between any two lines. Each one gets the <b>phase voltage</b>:</p><p><b>V phase = V line ÷ √3 = 460 ÷ 1.732 = 266 V</b></p><p>About 58% of the voltage on each winding, from the same supply and without a transformer.</p>`,
  math:`<p>The two wye windings between L1 and L2 are fed 120° apart, so their voltages add as vectors: 266 V + 266 V at 120° = 266 × 1.732 = 460 V.</p><p>In wye, line current = winding current. In delta, line current = winding current × 1.732.</p>`,draw:volts},
 {t:"One third of the current, one third of the torque",
  body:`<p>Two effects stack up in wye:</p><ul><li>Each winding has 1/√3 the voltage, so it draws <b>1/√3 the current</b>.</li><li>In delta, each line feeds two windings, so line current is √3 times winding current. In wye it isn't.</li></ul><p>1/√3 × 1/√3 = <b>1/3 of the line current</b>. Torque goes with voltage squared: <b>1/3 of the torque</b> too.</p><p>A fan still starts fine. A loaded conveyor needing 80% torque does not: wye can't get it moving.</p>`,
  math:`<p>Winding impedance Z. Delta: winding current = V/Z, line current = √3·V/Z.</p><p>Wye: winding current = line current = (V/√3)/Z.</p><p>Ratio: (V/√3Z) ÷ (√3V/Z) = 1/3. Torque ∝ V² per winding: (1/√3)² = 1/3.</p><p>A 6× FLA inrush becomes about 2× FLA; 160% starting torque becomes about 53%.</p>`,draw:third},
 {t:"Three contactors and a timer",
  body:`<p>A wye-delta starter has three contactors:</p><ul><li><b>M</b> (main) feeds L1-L3 to T1-T3 the whole time.</li><li><b>S</b> (star) ties T4-T5-T6 together for the start.</li><li><b>D</b> (delta) connects T4-T6 back to the lines for running.</li></ul><p>START pulls in M and S. A <b>transition timer</b> runs; when it times out, S drops and D pulls in. S and D are interlocked electrically and mechanically: both in at once is a line-to-line short.</p><p>The overload goes in the winding circuit, so it's set to FLA ÷ 1.732 (58% of FLA). Check the starter's instructions.</p>`,draw:msd},
 {t:"Open vs closed transition",
  body:`<p>In an <b>open transition</b>, S opens before D closes. For a moment the motor is off the line, still spinning and making its own voltage. When D closes, that voltage can be out of step with the supply, so there's a sharp <b>current spike</b> and a torque jolt.</p><p>A <b>closed transition</b> adds a fourth contactor and resistors that keep the windings connected during the switch. The spike mostly goes away. It costs more, so open transition is the most common.</p><p>Either way, switch only when the motor is close to full speed, or the delta current step is almost as bad as starting across the line.</p>`,
  math:`<p>The spike on the chart is a rough estimate (delta current at that speed plus a term for the motor's leftover voltage). Real spikes depend on how far the motor's voltage has drifted during the gap; they can approach locked-rotor current.</p>`,draw:trans}];
/* ---------- See it ---------- */
const mdl=S=>{const fla=flaOf(HP[S.hp],VS[S.v]);const r=sim({timer:S.timer,load:S.load/100,ct:!!S.ct,closed:!!S.cl});
 return {...r,fla,V:VS[S.v],Vph:VS[S.v]/R3,lra:6*fla,hp:HP[S.hp],early:r.nTr<0.85}};
const seeDraw=(R,S)=>{const Tm=S.timer+8,ymax=8;let s=K.chart({x:70,y:40,w:450,h:270,X:[0,Tm],Y:[0,ymax*R.fla],xt:[0,Math.round(Tm/4),Math.round(Tm/2),Math.round(3*Tm/4),Math.round(Tm)],xf:v=>v+" s",
  yt:[0,2,4,6,8].map(m=>m*R.fla),yf:v=>K.f0(v)+" A",xl:"time from START",title:`${R.hp} HP, ${R.V} V, FLA ${K.f1(R.fla)} A`,
  series:[{pts:R.dol.filter(p=>p[0]<=Tm).map(p=>[p[0],p[1]*R.fla]),c:"var(--muted)",dash:"5 5",w:2},{pts:R.pts.filter(p=>p[0]<=Tm).map(p=>[p[0],p[1]*R.fla]),c:"#d62828"}],
  vlines:[{x:S.timer,c:"var(--muted)"}],
  dots:[{x:S.timer,y:Math.min(ymax,R.peak)*R.fla,c:R.early||!S.cl&&R.peak>4.5?"var(--bad)":"#2f6fd6",lbl:K.f0(R.peak*R.fla)+" A AT THE SWITCH",dx:10,dy:16}]});
 s+=K.txt(78,330+14,"dashed: across the line",{a:"start"});
 const st=R.stall;s+=K.lbl(640,40,"START: WYE",{size:13})+wye(640,110,38,0)+K.txt(640,178,K.f0(R.Vph)+" V per winding",{fill:"var(--bad)"})+K.lbl(640,214,"RUN: DELTA",{size:13})+delta(640,286,40,0)+K.txt(640,352,K.f0(R.V)+" V per winding",{fill:"var(--bad)"});
 return s};
const see=K.see({vb:"0 0 720 380",init:{hp:3,v:2,load:50,ct:0,timer:3,cl:0},
 sliders:[["hp","Motor",0,6,1,v=>HP[v]+" hp"],["v","Line voltage",0,2,1,v=>VS[v]+" V"],["load","Load at full speed",10,100,5,v=>v+"% torque"],["timer","Transition timer",1,20,0.5,v=>v+" s"]],
 checks:[["ct","Constant-torque load (conveyor) instead of a fan"],["cl","Closed transition (resistors)"]],
 model:mdl,draw:seeDraw,
 reads:(R,S)=>[["Winding volts in wye",K.f0(R.Vph)+" V"],["Starting amps, wye",R.stall?K.f0(R.iWye*R.fla)+" A (stalled)":K.f0(R.iWye*R.fla)+" A",R.stall],["Across the line it'd be",K.f0(R.lra)+" A"],["Speed at the switch",K.f0(R.nTr*100)+"%",R.early],["Peak at the switch",K.f0(R.peak*R.fla)+" A",R.peak>4.5],["Wye reaches 90% at",isFinite(R.t90)?K.f1(R.t90)+" s":"never",!isFinite(R.t90)]],
 note:(R,S)=>R.stall?"Stalled in wye: one third of the torque can't turn this load. It just sits there drawing current until delta, then takes a full across-the-line hit. Start it unloaded, or use a different starter.":
  R.early?`The timer is too short: it switches at ${K.f0(R.nTr*100)}% speed, so the delta step is ${K.f1(R.iStep)}× FLA, almost as bad as starting across the line.${isFinite(R.t90)?` Wye reaches 90% at ${K.f1(R.t90)} s.`:""}`:
  !S.cl?`Switches at ${K.f0(R.nTr*100)}% speed. The open-transition spike (${K.f0(R.peak*R.fla)} A) is the motor's own voltage meeting the supply out of step. Closed transition smooths it.`:`Clean: about one third of the inrush, and the resistors bridge the switch.`,
 log:[["Load",(R,S)=>S.load+"%"],["Timer",(R,S)=>S.timer+" s"],["Speed",R=>K.f0(R.nTr*100)+"%"],["Peak",R=>K.f0(R.peak*R.fla)+" A"]]});
/* ---------- Try it ---------- */
const caseDraw=(R,S)=>seeDraw(R,S);
const tasks=[
 K.goal({t:"Set the transition timer",intro:"A 25 hp, 460 V supply fan at 60% load, open transition. In See it, find a timer setting that switches at 90% speed or more, but not more than 2 s after the motor gets there (a long wye run wastes time and heats the motor).",
  check:(S,R)=>HP[S.hp]!==25||VS[S.v]!==460?"Set the motor to 25 hp at 460 V.":S.load!==60||S.ct?"Set the load to a fan at 60%.":S.cl?"Leave it on open transition.":R.nTr<0.9?`It switches at ${K.f0(R.nTr*100)}% speed. Give it more time.`:S.timer>R.t90+2?`Wye gets to 90% at ${K.f1(R.t90)} s. That's more than 2 s of waiting.`:true,
  ok:(S,R)=>`Good: ${S.timer} s. It switches at ${K.f0(R.nTr*100)}% speed. On the job, time the start with a clamp meter and set the timer a little past where the current levels off in wye.`}),
 K.caseTask({t:"Service call: the breaker trips at the switch to delta",intro:"A 25 hp fan was put on a new wye-delta starter. It starts in wye fine, then trips the feeder breaker the instant it switches, about 1.5 s after START.",
  state:{hp:3,v:2,load:60,ct:0,timer:1.5,cl:0},model:mdl,draw:caseDraw,reads:(R,S)=>[["Timer setting",S.timer+" s"],["Speed at the switch",K.f0(R.nTr*100)+"%"],["Peak amps",K.f0(R.peak*R.fla)+" A"],["Wye current before",K.f0(TPK.lerp(TPK.IQ,R.nTr)/3*R.fla)+" A"]],
  actions:[["Watch the tach during the start",()=>"Fan is well under half speed when it switches."],["Check S and D interlocks",()=>"S drops before D pulls in. No overlap."]],
  causes:[["timer","Transition timer set too short"],["load","Load too heavy for a wye start"],["sd","S and D closing together"],["phase","A blown fuse: single phasing"]],ans:"timer",
  why:"It switches at well under full speed, so delta sees nearly locked-rotor current plus the open-transition spike. Set the timer long enough that the wye current levels off first.",
  hint:"How fast was it turning when it switched?"}),
 K.caseTask({t:"Service call: it hums in wye and lurches in delta",intro:"A loaded conveyor on a wye-delta starter. On START the motor hums and doesn't turn. When the timer switches, it jerks into motion with a big current hit.",
  state:{hp:3,v:2,load:90,ct:1,timer:6,cl:0},model:mdl,draw:caseDraw,reads:(R)=>[["Speed in wye","0%"],["Wye amps",K.f0(R.iWye*R.fla)+" A, steady"],["Peak at the switch",K.f0(R.peak*R.fla)+" A"],["Conveyor","full of product"]],
  actions:[["Try it with the belt empty",()=>"Empty, it comes up to speed in wye and switches smoothly."]],
  causes:[["timer","Transition timer set too short"],["load","Load needs more torque than wye gives"],["leads","Two motor leads swapped"],["ol","Overload set too low"]],ans:"load",
  why:"Wye gives only one third of the starting torque, about 53% of full-load torque. A loaded conveyor needs more than that, so it can't move until delta. Start it empty or use a soft starter or VFD.",
  hint:"What fraction of its torque does the motor have in wye?"})];
window.LESSON={id:"tph-wyedelta",sec:"3-Phase Motor Control",secHref:"/threephase/",title:"Wye-delta starting",lead:"Start the windings in wye so each sees line voltage divided by 1.732, cutting starting current and torque to one third, then switch to delta on a timer.",
 steps,see,tryIntro:"Set a timer in See it, then two service calls.",tasks,
 job:K.job({read:["Nameplate: the motor must be rated to run in delta at your line voltage (for example 460 V delta).","Starting amps with a clamp meter: high in wye at first, then leveling off; a step up at the switch.","How long the wye current takes to level off: the timer should be a bit longer.","Which contactors are in at each stage: M + S, then M + D."],
  table:[["Item","Across the line","Wye start"],["Winding voltage (460 V line)","460 V","266 V"],["Starting line current","about 6× FLA","about 2× FLA"],["Starting torque","about 160% (design B)","about 53%"],["Overload setting","FLA","FLA ÷ 1.732 if in the winding circuit"]],tableT:"Typical numbers",
  steps:["Lock out and check the six leads are landed T1-T6 per the starter drawing.","Start it and clamp one line: note the wye current and when it levels off.","Set the timer about 1 s past that point.","Check the switch: one short step up, not a near-locked-rotor hit.","Confirm rotation in both wye and delta: a mix-up in T4-T6 makes it reverse or hum at the switch."],
  safety:["Six motor leads plus three contactors: lock out and verify all nine terminals dead.","S and D both closed is a line-to-line short. Never defeat their interlocks.","Never start a loaded conveyor or compressor in wye without checking the torque it needs."],
  mistakes:["Setting the overload to full FLA when it's in the winding circuit (it should be about 58%).","Timer too short, so it switches at low speed and trips the breaker.","Landing T4-T6 in the wrong order, so the motor reverses or fights itself at the switch.","Using wye-delta on a load that needs full torque to start."]}),
 sources:[["The Engineering Mindset: Star delta starters explained","https://theengineeringmindset.com/star-delta-startes/"],["The Engineering Mindset: How electric motors work (star and delta connections)","https://theengineeringmindset.com/how-electric-motors-work/"],["Benshaw (AuCom) white paper: Motor starting solutions","https://www.aucom.com/hubfs/Benshaw%20Website/Downloads/White-Papers/Benshaw-White-Paper-01-Motor-Starting-Solutions.pdf"]]};
})();
