/* ============ Lesson: Hopscotch troubleshooting with a meter ============ */
(()=>{
/* one 24 V cooling rung: R - fuse - thermostat Y - HPS - LPS - CR coil - C. Test points P1..P6 sit between the parts.
 Impedances (ohms): closed contact 0.05, fuse 0.02, open 1e9, pitted contact 40, CR coil 18 ohm DC with 96 ohm total impedance at 60 Hz (0.25 A), secondary winding about 1 ohm (drawing's assumption) */
const V=24,OPEN=1e9,COIL={r:18,x:Math.sqrt(96*96-18*18)},WIND=1;
const NAMES=["FUSE","T'STAT Y","HPS","LPS","CR COIL"];
const FAULTS=["None","Fuse blown","Thermostat Y not closing","HPS open","LPS open","CR coil open","HPS contacts pitted (40 ohms)"];
const parts=f=>{const p=[{r:0.02},{r:0.05},{r:0.05},{r:0.05},{...COIL}];
 if(f===1)p[0]={r:OPEN};if(f===2)p[1]={r:OPEN};if(f===3)p[2]={r:OPEN};if(f===4)p[3]={r:OPEN};if(f===5)p[4]={r:OPEN};if(f===6)p[2]={r:40};return p};
/* complex node voltages to C: V_k = I * (sum of impedances right of node k), I = V / Z_total */
const nodes=f=>{const p=parts(f);let R=0,X=0;p.forEach(q=>{R+=q.r;X+=q.x||0});const d=R*R+X*X;const Ir=V*R/d,Ii=-V*X/d;
 const out=[];for(let k=0;k<=p.length;k++){let r=0,x=0;for(let j=k;j<p.length;j++){r+=p[j].r;x+=p[j].x||0}out.push([Ir*r-Ii*x,Ir*x+Ii*r])}
 return {v:out,I:Math.hypot(Ir,Ii),coilV:Math.hypot(out[4][0],out[4][1])}};
/* DC resistance between points a and b with power off: the parts between them, in parallel with the rest of the loop through the transformer winding (unless a wire is lifted) */
const ohms=(f,a,b,lift)=>{if(a===b)return 0;const p=parts(f);const lo=Math.min(a,b),hi=Math.max(a,b);let rin=0,rout=WIND;
 p.forEach((q,i)=>{if(i>=lo&&i<hi)rin+=q.r;else rout+=q.r});if(lift)rout=OPEN;return rin*rout/(rin+rout)};
const model=S=>{const f=S.f,a=S.red-1,b=S.blk-1;const N=nodes(f);const pull=S.pwr&&f!==5&&N.coilV>=0.85*V;/* coils pull in solidly near 85% of rating or more */
 let txt,val=null;if(S.mode===0){if(!S.pwr){val=0;txt="0.0"}else{const d=Math.hypot(N.v[a][0]-N.v[b][0],N.v[a][1]-N.v[b][1]);val=d;txt=K.f1(d)}}
 else{if(S.pwr){txt="ERR";val=null}else{const r=ohms(f,a,b,S.lift);val=r;txt=r>2e6?"OL":r<10?K.f2(r):K.f1(r)}}
 return {f,N,pull,chatter:S.pwr&&f!==5&&N.coilV>12&&!pull,txt,val,coilV:S.pwr?N.coilV:0,live:S.pwr}};
/* ---------- drawing ---------- */
const X1=60,X2=664,Y=110;
const rung=(R,S,o={})=>{const f=S.f??0,P=parts(f);const closed=P.map((q,i)=>i===4?true:q.r<OPEN);
 const ps=[{k:"fuse",closed:closed[0],lbl:"3 A FUSE"},{k:"sw",closed:closed[1],lbl:"T'STAT Y"},{k:"ps",closed:closed[2],lbl:f===6?"HPS (PITTED)":"HPS"},{k:"ps",closed:closed[3],lbl:"LPS"},{k:"coil",tag:"CR",dead:f===5}];
 if(o.hideFault){ps.forEach((p,i)=>{if(i<4){p.closed=true;p.lbl=p.lbl.replace(" (PITTED)","")}});ps[4].dead=false}
 let s=LD.rails(X1,X2,Y-50,Y+40,{l:"R 24 V",r:"C",live:R.live&&!o.paper});
 const g=LD.rung({x1:X1,x2:X2,y:Y,parts:ps,live:R.live&&!o.paper,sw:110,lw:110,pad:20,padR:20});s+=g.s;
 if(o.paper===undefined&&R.live&&f===6)s+=K.tag((g.ends[2][0]+g.ends[2][1])/2,Y+62,"HOT CONTACT",{fill:"var(--bad)",w:110});
 return {s,nodes:g.nodes}};
const DX=i=>i===0?16:i===5?-16:0;
const tps=(nodes,S,show)=>nodes.map((x,i)=>LD.tp(x,Y,"P"+(i+1),{dx:DX(i),sel:S&&(S.red===i+1||S.blk===i+1),red:S&&S.red===i+1})).join("")+(show?nodes.map((x,i)=>K.tag(x+DX(i)*2,Y-34,show[i],{w:58,c:"v"})).join(""):"");
const meterScene=(R,S,o={})=>{const r=rung(R,S,o);let s=r.s+tps(r.nodes,S);const mx=305,my=200;
 const [bx,by]=LD.mjack(mx,my,false),[rx,ry]=LD.mjack(mx,my,true);
 s+=LD.probe(bx,by,r.nodes[S.blk-1],Y,false,388)+LD.probe(rx,ry,r.nodes[S.red-1],Y,true,394);
 s+=LD.meter(mx,my,{txt:R.txt,mode:S.mode?"O":"V"});
 s+=LD.L(200,230,S.pwr?"POWER ON":"POWER OFF",{size:13,fill:S.pwr?LD.HOT:"var(--muted)",a:"end"})+(S.lift?LD.L(200,252,"R WIRE LIFTED",{size:12,a:"end",fill:"var(--brass)"}):"");
 s+=LD.L(470,230,`CR COIL: ${R.pull?"PULLED IN":R.chatter?"CHATTERING":"OUT"}`,{size:13,a:"start",fill:R.pull?"var(--ok)":R.chatter?"var(--warn)":"var(--muted)"});
 if(S.pwr&&S.mode===1)s+=LD.L(470,254,"OHMS ON A LIVE CIRCUIT!",{size:12,a:"start",fill:"var(--bad)"});
 return s};
/* readings at every point, black lead on C */
const walk=f=>{const N=nodes(f);return N.v.map(c=>K.f1(Math.hypot(c[0],c[1]))+" V")};
const st=(x)=>({f:3,red:3,blk:6,mode:0,pwr:true,lift:false,...x});
/* ---------- Learn ---------- */
const steps=[
 {t:"Voltage shows up across the open",
  body:`<p>In a series rung, current flows only if every part is closed. When one part opens:</p><ul><li>Across a <b>closed</b> switch the meter reads about <b>0 V</b>: both ends are the same point.</li><li>Across the <b>open</b> switch it reads the <b>full 24 V</b>: one end is still connected to R, the other to C through the coil.</li><li>Across the dead coil: <b>0 V</b>.</li></ul><p>So the part with the supply voltage across it is the open one.</p>`,
  vb:"0 0 720 400",draw:()=>{const S=st({red:3,blk:4}),R=model(S);return meterScene(R,S)}},
 {t:"Reference one leg",
  body:`<p>Measuring across every part means moving both leads each time. Faster: put the black lead on one leg and leave it there. That's your <b>reference</b>.</p><p>With black on <b>C</b>, every point still connected to R through closed parts reads <b>24 V</b>. Every point past the open is tied to C through the coil and reads <b>0 V</b>.</p><p>Here black is on C (P6) and red is on P3, before the open HPS: 24 V.</p>`,
  vb:"0 0 720 400",draw:()=>{const S=st({red:3,blk:6}),R=model(S);return meterScene(R,S)}},
 {t:"Hopscotch: walk the rung",
  body:`<p>Now hop the red lead along the rung from R toward the load: P1, P2, P3...</p><p>The voltage is there, there, there, then <b>gone</b>. The open is the part between the <b>last point with voltage</b> and the <b>first point without</b>.</p><p>Here: P3 reads 24 V, P4 reads 0 V. The HPS is open. Now ask why it opened (dirty condenser, bad fan, overcharge) before you replace anything.</p>`,
  draw:()=>{const r=rung({live:true},{f:3});const w=walk(3);let s=r.s+tps(r.nodes,null,w);
   for(let i=0;i<4;i++){const a=r.nodes[i],b=r.nodes[i+1];s+=`<path d="M${a} ${Y+20} Q${(a+b)/2} ${Y+70} ${b} ${Y+20}" fill="none" stroke="${i<2?"var(--ok)":i===2?"var(--bad)":"var(--muted)"}" stroke-width="2" stroke-dasharray="${i===3?"4 4":"none"}"/>`}
   s+=K.tag((r.nodes[2]+r.nodes[3])/2,Y+110,"VOLTAGE DISAPPEARS: OPEN IS HERE",{fill:"var(--bad)",w:300})+LD.L(360,300,"BLACK LEAD ON C THE WHOLE TIME",{size:13,fill:"var(--muted)"});return s}},
 {t:"All 24 V, or all 0 V",
  body:`<p>Two patterns to know:</p><ul><li><b>24 V everywhere up to the coil</b>, and 24 V across the coil, but it doesn't pull in: the <b>coil</b> is open. Power off and check it with ohms.</li><li><b>0 V everywhere</b>, even at P1: no power reaching the rung. Check the transformer and the fuse, and move your reference: P1 to C reads 0, so look upstream.</li></ul><p>A blown fuse shows as 24 V at P1 and 0 V at P2.</p>`,
  draw:()=>{let s="";const r=rung({live:true},{f:5});s+=r.s+tps(r.nodes,null,walk(5));s+=K.tag(360,Y+80,"COIL OPEN: VOLTAGE ALL THE WAY TO THE LOAD",{fill:"var(--bad)",w:360});
   const y2=300;const ps=[{k:"fuse",closed:false,lbl:"FUSE OPEN"},{k:"sw",closed:true,lbl:"T'STAT Y"},{k:"ps",closed:true,lbl:"HPS"},{k:"ps",closed:true,lbl:"LPS"},{k:"coil",tag:"CR"}];
   const g=LD.rung({x1:X1,x2:X2,y:y2,parts:ps,live:true,sw:110,lw:110,pad:20,padR:20});s+=`<path d="M${X1} ${y2-24} V${y2+24}" stroke="${LD.HOT}" stroke-width="5"/><path d="M${X2} ${y2-24} V${y2+24}" stroke="var(--ink)" stroke-width="5"/>`+g.s;
   const w1=walk(1);g.nodes.forEach((x,i)=>{s+=LD.tp(x,y2,"")+LD.T(x+DX(i)*1.4,y2-14,w1[i].replace(" V",""),{size:11,fill:i===0?LD.HOT:"var(--muted)"})});
   s+=LD.L(X1,y2+50,"FUSE BLOWN: 24 V AT P1, 0 V AT P2",{size:12,a:"start",fill:"var(--bad)"});return s}},
 {t:"Ohms with the power off",
  body:`<p>Voltage finds the open. <b>Ohms</b> (resistance) confirms it, but only with the <b>power off</b>. An ohmmeter puts out its own small current; line or 24 V voltage gives garbage readings or blows the meter's fuse.</p><ul><li>Closed switch: near <b>0 Ω</b>. Open switch: <b>OL</b>.</li><li>A good coil reads some resistance, often tens of ohms. An open coil reads OL.</li></ul><p>Measure with one wire lifted. Left connected, an open HPS reads through the coil and transformer around the loop: about 19 Ω here, which looks like a part, not an open.</p>`,
  vb:"0 0 720 400",draw:()=>{const S=st({pwr:false,mode:1,red:3,blk:4,lift:true}),R=model(S);const S2={...S,lift:false},R2=model(S2);return meterScene(R,S)+K.tag(600,330,`NO WIRE LIFTED: ${R2.txt} Ω`,{fill:"var(--warn)",w:200})}},
 {t:"A contact that eats voltage",
  body:`<p>Not every fault is a clean open. Burnt or <b>pitted</b> contacts have resistance. They pass some current but drop part of the voltage across themselves.</p><p>Here a pitted HPS with 40 Ω across it drops about ${K.f1(nodes(6).v[2]&&Math.hypot(nodes(6).v[2][0]-nodes(6).v[3][0],nodes(6).v[2][1]-nodes(6).v[3][1]))} V. The coil gets only about ${K.f1(nodes(6).coilV)} V and may buzz or chatter.</p><p>On a working circuit, more than a volt or so across a closed contact means it's bad. The contact also gets hot.</p>`,
  math:`<p>Series AC circuit: I = V / |Z|, with Z = 40 + 18 + j94.3 Ω, so I = 24 / 110.7 = 0.22 A.</p><p>Across the contact: 0.22 × 40 = 8.7 V. Across the coil: 0.22 × 96 = 20.8 V. They don't add to 24 because the coil's voltage is out of phase with the contact's.</p>`,
  vb:"0 0 720 400",draw:()=>{const S=st({f:6,red:3,blk:4}),R=model(S);return meterScene(R,S)}}];
/* ---------- See it ---------- */
const PT=v=>"P"+v+(v===1?" (R side)":v===6?" (C)":"");
const see=K.see({vb:"0 0 720 400",init:{f:3,red:1,blk:6,mode:0,pwr:true,lift:false},
 sliders:[["f","Fault",0,6,1,v=>FAULTS[v]],["red","Red lead on",1,6,1,PT],["blk","Black lead on",1,6,1,PT],["mode","Meter",0,1,1,v=>v?"Ohms":"Volts AC"]],
 checks:[["pwr","Power on"],["lift","Lift the R wire (isolate the rung)"]],
 model,draw:(R,S)=>meterScene(R,S),
 reads:(R,S)=>[["Meter",R.txt+(R.txt==="ERR"||R.txt==="OL"?"":S.mode?" Ω":" V"),R.txt==="ERR"],["Leads","red P"+S.red+", black P"+S.blk],["Coil voltage",K.f1(R.coilV)+" V"],["CR coil",R.pull?"pulled in":R.chatter?"chattering":"out",!R.pull],["Current",S.pwr?K.f2(R.N.I)+" A":"0 A"]],
 note:(R,S)=>S.mode===1&&S.pwr?"Ohms on a live circuit: the reading means nothing and you can blow the meter's fuse. Turn the power off first.":S.mode===1&&!S.lift&&R.val!=null&&R.val>1&&R.val<1e6&&parts(S.f)[Math.min(S.red,S.blk)-1]&&Math.abs(S.red-S.blk)===1&&parts(S.f)[Math.min(S.red,S.blk)-1].r>=OPEN?"That's not the switch, it's the rest of the loop (coil plus transformer) in parallel. Lift the R wire and measure again.":S.mode===0&&!S.pwr?"Power is off: there's nothing to measure in volts.":S.f===6&&S.mode===0&&S.pwr?"The pitted HPS still passes current, but look at the voltage across it.":S.blk===S.red?"Both leads on the same point always reads 0.":"",
 log:[["Fault",(R,S)=>S.f],["Red",(R,S)=>"P"+S.red],["Black",(R,S)=>"P"+S.blk],["Mode",(R,S)=>S.mode?"Ω":"V"],["Reads",R=>R.txt]],logHint:"Press Log reading at each point, like writing your hops on a scrap of paper."});
/* ---------- Try it ---------- */
const causes=[["1","Fuse blown"],["2","Thermostat Y not closing"],["3","HPS open"],["4","LPS open"],["5","CR coil open"]];
const cs=o=>K.caseTask({t:o.t,intro:o.intro,vb:"0 0 720 400",state:{f:o.f,red:1,blk:6,mode:0,pwr:true,lift:false},model,draw:(R,S)=>meterScene(R,S,{hideFault:true,paper:true}),
 slider:["red","Red lead on (black on C)",1,6,1,PT],reads:(R,S)=>[["Meter",R.txt+" V"],["CR coil",R.pull?"pulled in":"out"]],causes,ans:String(o.f),why:o.why,hint:o.hint});
const tasks=[
 K.goal({t:"Hopscotch to the open",intro:"Set the fault to <b>HPS open</b>, black lead on <b>C (P6)</b>, power on, volts. Log the <b>last point with 24 V</b> and the <b>first point with 0 V</b>.",
  check:(S,R,L)=>{const ok=L.filter(r=>r.S.f===3&&r.S.blk===6&&r.S.mode===0&&r.S.pwr);const a=ok.some(r=>r.S.red===3&&r.R.val>20),b=ok.some(r=>r.S.red===4&&r.R.val<1);return a&&b?true:!ok.length?"Log readings with the HPS fault, black on P6, volts, power on.":!a?"Log the last point that still reads 24 V.":"Log the first point that reads 0 V."},ok:"24 V at P3, 0 V at P4: the open is between them, the HPS."}),
 K.goal({t:"Prove it with ohms",intro:"Same fault. Do it right: <b>power off</b>, meter on <b>ohms</b>, <b>R wire lifted</b>, leads across the HPS (P3 and P4).",
  check:(S,R)=>S.f!==3?"Set the fault to HPS open.":S.pwr?"Turn the power off first.":S.mode!==1?"Switch the meter to ohms.":!((S.red===3&&S.blk===4)||(S.red===4&&S.blk===3))?"Put the leads on P3 and P4.":!S.lift?`It reads ${R.txt} Ω: that's the loop through the coil. Lift the R wire.`:R.txt==="OL"?true:"Not OL yet.",ok:"OL across the HPS with the circuit isolated: it's open. Confirmed two ways."}),
 K.goal({t:"Find the voltage-eating contact",intro:"Set the fault to <b>HPS contacts pitted</b>. With power on, measure across the HPS and find out how much voltage it steals.",
  check:(S,R)=>S.f!==6?"Set the fault to pitted HPS contacts.":!S.pwr||S.mode!==0?"Power on, volts.":!((S.red===3&&S.blk===4)||(S.red===4&&S.blk===3))?"Measure across the HPS: P3 and P4.":true,ok:(S,R)=>`${R.txt} V across a closed contact. Good contacts read near 0. This one leaves the coil about ${K.f1(R.coilV)} V.`}),
 cs({t:"Service call: no cooling, mystery 1",intro:"Thermostat calling for cooling, outdoor unit silent. Black lead is on C. Hop the red lead.",f:4,why:"24 V through P4, 0 V at P5: the LPS is open. On a cooling call that usually means low charge or a restriction. Find out why before replacing the switch.",hint:"Find the last point with voltage and the first without."}),
 cs({t:"Service call: no cooling, mystery 2",intro:"Same complaint, different unit. Black lead on C. Hop the red lead.",f:5,why:"24 V at every point right up to the coil, and the coil doesn't pull in: the coil is open. Check it with ohms, power off, before you replace the contactor.",hint:"Where does the voltage disappear? What if it never does?"}),
 cs({t:"Service call: no cooling, mystery 3",intro:"Thermostat blank, nothing runs. Black lead on C.",f:1,why:"24 V at P1, nothing at P2: the fuse is open. A blown fuse means a short somewhere. Find it before you replace the fuse.",hint:"Start at P1. Where does it go away?"})];
window.LESSON={id:"lad-hop",sec:"Ladder Builder",secHref:"/ladder/",title:"Hopscotch troubleshooting with a meter",lead:"Reference one leg, walk the rung with the other lead, and the open is where the voltage disappears. Then confirm with ohms, power off.",
 steps,see,tryIntro:"Three setups in See it, then three units with a hidden fault. Hop the red lead and pick the open.",tasks,
 job:K.job({read:["<b>Supply first</b>: R to C at the transformer. No supply, no point hopping.","<b>Each test point</b> from R toward the load, black lead on C.","<b>Voltage across closed contacts</b> on a running circuit: should be near 0.","<b>Ohms</b> only with the power off and the part isolated."],
  table:[["Reading","Means"],["24 V across a switch","That switch is open"],["0 V across a closed switch","Normal"],["1 V or more across a closed contact","Pitted or burnt: replace"],["24 V across a coil that's out","Coil open (confirm with ohms)"],["0 V at P1 to C","No supply: transformer, fuse, primary"],["OL across an isolated switch","Open"],["Near 0 Ω across an isolated switch","Closed"]],
  steps:["Check your meter on a known live source.","Measure the supply, R to C.","Leave black on C. Hop red from R toward the load.","Stop at the first point with no voltage. The open is just before it.","Ask why that part opened (a safety opens for a reason).","Power off, isolate, confirm with ohms, then fix the cause."],stepsT:"The hop",
  safety:["The same method works on line voltage, but it's live work: proper meter category, PPE, one hand where you can.","Check your meter on a known live source before and after: a dead meter reads 0 V everywhere.","Never measure ohms on a live circuit."],
  mistakes:["Measuring ohms with a wire still connected and reading the rest of the loop.","Leaving the black lead on a point that's past the open (everything reads 0).","Replacing a safety switch that opened for a real reason."]}),
 sources:[["The Engineering Mindset: multimeter tutorial","https://theengineeringmindset.com/multimeter-tutorial/"],["BCcampus Basic Motor Control: voltage drops in control circuits","https://opentextbc.ca/basicmotorcontrol/chapter/voltage-drops-in-control-circuits/"],["Fluke: a guide to continuity testing with a multimeter","https://www.fluke.com/en-ca/learn/blog/digital-multimeters/how-to-test-for-continuity"]]};
})();
