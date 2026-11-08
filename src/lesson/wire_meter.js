/* ============ Lesson: Using a multimeter safely ============ */
(()=>{
const C=WK.C,RH=11.52,RSW=0.004,BEEP=30;      // 5 kW, 240 V heater; closed switch contact; this meter beeps under 30 ohms
const MODES=["V AC","Ohms","Continuity","Clamp amps"],POS=["Known live circuit","L1 to L2 (load side)","Across the switch","Across the heater","L1 to ground"];
const model=S=>{const Vs=S.brk?240:0,I=S.brk&&S.sw?240/(RH+RSW):0;
 const V=[240,Vs,S.sw?I*RSW:Vs,S.sw?I*RH:0,S.brk?120:0];
 const Rv=[0,S.sw?RH+RSW:Infinity,S.sw?RSW:Infinity,RH,Infinity];
 const live=S.pos===0||!!S.brk;const m=["V","O","B","A"][S.mode];let txt,unit="",beep=false,warn="";
 if(m==="V"){txt=WK.fv(V[S.pos]);unit="V AC"}
 else if(m==="A"){const a=S.both?0:I;txt=a.toFixed(1);unit="A AC"}
 else if(live){txt="-- --";warn="Live circuit. Ohms and continuity only with the power off."}
 else{const r=Rv[S.pos];txt=isFinite(r)?(r<1?r.toFixed(2):r.toFixed(1)):"OL";unit="Ω";beep=m==="B"&&r<BEEP}
 return {Vs,I,V,Rv,m,txt,unit,beep,warn,P:I*I*RH,v:V[S.pos],pos:S.pos,brk:!!S.brk,sw:!!S.sw,mode:S.mode,both:!!S.both}};
/* where each probe pair lands */
const PP=[[[440,112],[500,112]],[[60,236],[104,236]],[[214,236],[286,236]],[[410,330],[590,330]],[[60,236],[36,318]]];
const swDraw=(closed,x=200,y=206)=>{let s=`<rect x="${x}" y="${y}" width="100" height="50" rx="5" fill="url(#wkMV)" stroke="#5d666c"/>`+WK.screw(x+14,y+30,6)+WK.screw(x+86,y+30,6);
 s+=`<path d="${closed?`M${x+14} ${y+30} L${x+84} ${y+28}`:`M${x+14} ${y+30} L${x+70} ${y-6}`}" stroke="#2a2f33" stroke-width="5" stroke-linecap="round"/><circle cx="${x+14}" cy="${y+30}" r="4" fill="#2a2f33"/>`;
 return s+WK.t(x+50,y+48,"SWITCH",{size:9})};
const scene=(R,S,o={})=>{let s=WK.defs();
 s+=WK.panel(30,30,{on:R.brk});
 const on=R.I>0;
 s+=WK.w(`M60 180 V236 H214`,C.blk,4)+WK.flow(`M60 180 V236 H214`,on)+WK.w(`M286 236 H410 V330`,C.blk,4)+WK.flow(`M286 236 H410 V330`,on)+WK.w(`M104 180 V360 H600 V330 H590`,C.red,4)+WK.flow(`M590 330 H600 V360 H104 V180`,on);
 s+=swDraw(o.swShow??R.sw)+WK.heater(400,300,{on})+K.lbl(500,290,"5 KW HEATER, 11.5 Ω",{size:12});
 s+=WK.w(`M36 318 V300`,C.grn,4)+WK.S.gnd(36,330,{c:C.grn})+K.txt(48,350,"ground",{a:"start"});
 s+=`<rect x="420" y="60" width="100" height="62" rx="6" fill="#2b3236" stroke="#111"/>`+WK.t(470,80,"KNOWN LIVE",{size:10,fill:"#e9ecee"})+WK.t(470,94,"240 V",{size:10,fill:"#e9ecee"})+WK.screw(440,112,5)+WK.screw(500,112,5);
 s+=K.lbl(160,172,"L1",{size:12})+K.lbl(160,352,"L2",{size:12,fill:C.red});
 if(o.noMeter)return s;
 if(R.m==="A"){const jx=150,jy=236,cs=.62;s+=(R.both?WK.w(`M${jx-6} 200 V272`,C.red,3):"")+WK.clamp(jx-55*cs,jy-40*cs,{s:cs,txt:R.txt})+K.txt(jx+44,300,R.both?"both wires in the jaw":"one wire in the jaw",{a:"start"});
  if(R.both)s+=K.txt(jx+44,318,"(L2 looped up through it)",{a:"start"});return s}
 const ms=.8,mx=596,my=36;s+=WK.meter(mx,my,{s:ms,mode:R.m,txt:R.txt,unit:R.unit,beep:R.beep,tsz:R.txt.length>5?17:22});
 const [a,b]=PP[R.pos];const com=[mx+WK.MJ.COM[0]*ms,my+WK.MJ.COM[1]*ms],vj=[mx+WK.MJ.V[0]*ms,my+WK.MJ.V[1]*ms];
 s+=WK.lead(com[0],com[1],b[0],b[1],"blk",{sag:60})+WK.lead(vj[0],vj[1],a[0],a[1],"red",{sag:90});
 return s};
const lcdBox=(x,y,t,lab)=>K.lcd(x,y,t,100)+(lab?K.txt(x,y+32,lab):"");
const steps=[
 {t:"Meet the meter",body:`<p>An HVAC meter does four jobs: <b>volts AC</b>, <b>ohms</b> (resistance), <b>continuity</b> (a beep for a closed path) and <b>amps</b>. Most also read <b>microfarads</b> for capacitors.</p><ul><li>The <b>black lead</b> always goes in <b>COM</b>. The red lead goes in <b>VΩ</b> for volts, ohms and continuity.</li><li>The <b>A jack</b> puts the meter in series with the circuit. In the field we almost never use it; a <b>clamp meter</b> reads amps around one wire without breaking it.</li><li>Check the leads before you start: no cracks, no bare metal past the tip guards.</li></ul>`,
  draw:()=>{let s=WK.defs()+WK.meter(30,24,{s:1.2,mode:"V",txt:"241",unit:"V AC",})+WK.clamp(590,46,{s:1.05,txt:"18.6"});
   s+=WK.co(190,74,250,64,"SCREEN: READING AND UNIT",{a:"start"})+WK.co(166,176,250,156,"DIAL: VOLTS, OHMS, BEEP, CAP, AMPS",{a:"start"})+WK.co(120,272,250,232,"COM JACK: BLACK LEAD, ALWAYS",{a:"start"})+WK.co(162,272,250,282,"VΩ JACK: RED LEAD",{a:"start"});
   s+=WK.co(598,130,575,190,"CLAMP JAW: AMPS",{a:"end"})+K.txt(575,210,"around one wire",{a:"end"});
   return s}},
 {t:"CAT ratings",body:`<p>A meter's <b>CAT rating</b> (measurement category) says how big a voltage spike it can survive without blowing apart in your hand. Spikes are bigger closer to where power enters the building.</p><ul><li><b>CAT IV</b>: the utility connection, service entrance and electric meter.</li><li><b>CAT III</b>: fixed equipment and distribution inside the building: panels, disconnects, motors, rooftop and condensing units.</li><li><b>CAT II</b>: things that plug into a receptacle.</li></ul><p>For HVAC work use a meter and leads rated at least <b>CAT III 600 V</b>. The leads count too: the lowest rating in the set is the rating.</p>`,
  draw:()=>{let s=WK.defs();const z=[[20,200,"CAT IV","#b0392b","service entrance, electric meter"],[200,530,"CAT III","#c77f0a","panels, disconnects, HVAC units"],[530,700,"CAT II","#1e9a4a","plug-in loads"]];
   z.forEach(([a,b,n,c,d])=>{s+=`<rect x="${a}" y="30" width="${b-a-6}" height="260" rx="8" fill="${c}" opacity=".1"/>`+K.lbl((a+b-6)/2,318,n,{size:18,fill:c})+K.txt((a+b-6)/2,340,d)});
   s+=`<rect x="40" y="50" width="10" height="230" fill="#7a5a3a"/><path d="M30 70 H60" stroke="#5a4a3a" stroke-width="5"/><path d="M50 72 Q100 110 150 120" stroke="#222" stroke-width="2.5" fill="none"/>`;
   s+=`<rect x="120" y="120" width="56" height="80" rx="6" fill="url(#wkMV)" stroke="#5d666c"/><circle cx="148" cy="156" r="20" fill="#dfe8ee" stroke="#5d666c"/>`+WK.t(148,160,"kWh",{size:10});
   s+=`<path d="M148 200 V240 H230" stroke="#555" stroke-width="5" fill="none"/>`+WK.panel(230,120,{on:true,s:.8,lab:"MAIN PANEL"});
   s+=`<path d="M326 160 H380 V130 H400" stroke="#555" stroke-width="5" fill="none"/><rect x="400" y="96" width="50" height="70" rx="4" fill="url(#wkMV)" stroke="#5d666c"/>`+WK.t(425,90,"DISC.",{size:10,fill:"var(--ink)"});
   s+=`<path d="M425 166 V196" stroke="#555" stroke-width="5"/><rect x="384" y="196" width="128" height="88" rx="6" fill="url(#wkPl)" stroke="#8c918f"/><circle cx="448" cy="240" r="30" fill="#2a2f33"/><path d="M420 240 H476 M448 212 V268" stroke="#556" stroke-width="2"/>`+WK.t(448,298,"CONDENSING UNIT",{size:10,fill:"var(--ink)"});
   s+=`<rect x="580" y="110" width="60" height="96" rx="8" fill="url(#wkPl)" stroke="#8c918f"/><rect x="598" y="128" width="24" height="22" rx="6" fill="#e6e6e0" stroke="#999"/><rect x="598" y="164" width="24" height="22" rx="6" fill="#e6e6e0" stroke="#999"/><path d="M610 186 Q620 240 660 270" stroke="#333" stroke-width="4" fill="none"/>`+WK.t(610,100,"RECEPTACLE",{size:10,fill:"var(--ink)"});
   return s+K.lbl(360,370,"HVAC WORK: AT LEAST CAT III 600 V",{size:14,fill:"var(--brass)"})}},
 {t:"Test before touch: live-dead-live",body:`<p>A meter that reads 0 V might mean the circuit is dead, or that the meter, a lead or a fuse has failed. So prove the meter both before and after.</p><ol><li><b>Live</b>: read a known live source (or a proving unit). It should show the voltage.</li><li><b>Dead</b>: turn off and lock out the circuit, then read every combination: L1 to L2, and each leg to ground. All must show 0 V.</li><li><b>Live</b>: read the known source again. The meter still works, so the 0 V was real.</li></ol><p>Only then touch the wiring.</p>`,
  draw:()=>{let s=WK.defs();const P=[["1. LIVE","241","known live source","proves the meter works"],["2. DEAD","0.0","L1-L2, L1-G, L2-G","breaker off, locked out"],["3. LIVE","241","known live source again","meter didn't fail"]];
   P.forEach(([t,v,a,b],i)=>{const x=20+i*232;s+=`<rect x="${x}" y="14" width="216" height="320" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+108,44,t,{size:18,fill:i===1?"var(--cold)":WK.HOT})+WK.meter(x+48,62,{s:.8,mode:"V",txt:v,unit:"V AC"})+K.txt(x+108,288,a)+K.txt(x+108,310,b)+(i<2?K.arrow(`M${x+206} 190 H${x+232}`,"var(--muted)"):"")});
   return s+K.txt(360,360,"skip a step and a broken meter can read 0 V on a live wire",{fill:"var(--bad)"})}},
 {t:"Voltage across a switch",body:`<p>Voltage shows up across the part that is <b>resisting</b> the current.</p><ul><li><b>Switch open</b>: no current flows. Nothing drops voltage in the heater, so both ends of the heater sit at L2. Across the open switch you read the <b>full 240 V</b>; across the heater, <b>0 V</b>.</li><li><b>Switch closed</b>: 20.8 A flows. A good switch drops almost nothing (about 0.08 V here) and the heater gets nearly all 240 V.</li></ul><p>So <b>240 V across a switch means it's open</b>. Near 0 V means it's closed.</p>`,
  math:`<p>Ohm's law: <code>V = I × R</code>. Closed: <code>I = 240 / (11.52 + 0.004) = 20.8 A</code>. Across the switch <code>20.8 × 0.004 = 0.08 V</code>; across the heater <code>20.8 × 11.52 = 239.9 V</code>. Open: <code>I = 0</code>, so the heater drops <code>0 × 11.52 = 0 V</code> and the whole 240 V sits across the gap.</p>`,
  draw:()=>{const card=(closed)=>{const R=model({brk:1,sw:closed?1:0,mode:0,pos:2});const hc=closed?WK.HOT:"var(--ink)";let g=`<circle cx="50" cy="110" r="22" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>`+K.lbl(50,115,"240V",{size:11});
    g+=WK.S.line(`M50 88 V60 H143 M187 60 H270 V90 M270 150 V180 H50 V132`,hc,2.4)+WK.S.sw(165,60,{closed})+`<g transform="rotate(90 270 120)">${WK.S.res(270,120,{c:hc})}</g>`;
    g+=K.lcd(165,108,WK.fv(R.V[2])+" V",96)+K.txt(165,138,"across the switch")+K.lcd(190,234,WK.fv(R.V[3])+" V",96)+K.txt(190,264,"across the heater")+K.txt(300,124,"heater",{a:"start"});
    return g+K.txt(165,300,closed?"20.8 A flowing":"no current",{fill:closed?WK.HOT:"var(--muted)"})};
   return K.cards([{t:"SWITCH OPEN",c:"var(--ink)",inner:card(false)},{t:"SWITCH CLOSED",c:WK.HOT,inner:card(true)}],{h:330})}},
 {t:"Ohms and continuity: power off",body:`<p><b>Ohms</b> (Ω) reads resistance. The meter pushes its own small current through the part, so the circuit must be <b>dead and isolated</b>. On a live circuit the reading is meaningless and you can damage the meter.</p><ul><li>A good heater element: about <b>11.5 Ω</b> (5 kW at 240 V).</li><li>An open switch or a broken element: <b>OL</b> (over limit, an open circuit).</li><li>A closed switch or a wire: near <b>0 Ω</b>.</li></ul><p><b>Continuity</b> is the same test with a beep. This meter beeps under 30 Ω, so the heater beeps too. Read the number, not just the beep.</p>`,
  math:`<p>Heater resistance from its rating: <code>R = V² / P = 240² / 5000 = 11.52 Ω</code>.</p>`,
  draw:()=>{let s=WK.defs();const it=[["HEATER ELEMENT","11.5","Ω","good: matches the rating",0],["OPEN SWITCH","OL","Ω","open circuit",1],["CLOSED SWITCH","0.00","Ω","beeps: closed path",2]];
   it.forEach(([t,v,u,d,i])=>{const x=20+i*232;s+=`<rect x="${x}" y="14" width="216" height="350" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+108,42,t,{size:14})+WK.meter(x+60,60,{s:.64,mode:i===2?"B":"O",txt:v,unit:u,beep:i===2});
    const py=300;if(i===0)s+=WK.heater(x+18,py-30,{s:.9});else s+=`<g transform="translate(${x+58} ${py-50})">${swDraw(i===2,0,0)}</g>`;
    const a=i===0?[x+27,py-3]:[x+72,py-20],b=i===0?[x+189,py-3]:[x+144,py-20];
    s+=WK.lead(x+60+75*.64,60+206*.64,a[0],a[1],"blk",{sag:30})+WK.lead(x+60+110*.64,60+206*.64,b[0],b[1],"red",{sag:30})+K.txt(x+108,350,d)});
   return s}},
 {t:"Amps with a clamp",body:`<p>A clamp meter reads the magnetic field around a wire, so it measures amps without disconnecting anything.</p><ul><li>Clamp around <b>one wire only</b>. The heater draws <b>20.8 A</b> on L1 and the same 20.8 A back on L2.</li><li>Clamp around <b>both</b> and the two fields cancel: <b>0 A</b>, even with the heater running.</li><li>Compare the reading with the nameplate: RLA for a compressor, FLA for a motor, watts for a heater.</li></ul>`,
  math:`<p><code>I = V / R = 240 / 11.52 = 20.8 A</code>. Check with power: <code>P = V × I = 240 × 20.8 = 5,000 W</code>.</p>`,
  draw:()=>{const card=(both)=>{const cs=.78,jx=230,jy=80;let g=WK.w(`M${jx-(both?10:0)} 36 V200`,C.blk,4)+(both?WK.w(`M${jx+10} 36 V200`,C.red,4):"")+WK.clamp(jx-55*cs,jy-40*cs,{s:cs,txt:both?"0.0":"20.8"});
    g+=K.txt(34,90,both?"L1 and L2":"L1 only",{a:"start"})+K.txt(34,110,both?"fields cancel":"20.8 A",{a:"start",fill:both?"var(--bad)":WK.HOT});return g};
   return WK.defs()+K.cards([{t:"ONE WIRE: RIGHT",c:"var(--ok)",inner:card(false)},{t:"BOTH WIRES: READS 0",c:"var(--bad)",inner:card(true)}],{h:300})}}];
const see=K.see({init:{brk:1,sw:1,mode:0,pos:0,both:0},
 sliders:[["brk","Breaker",0,1,1,v=>v?"On":"Off"],["sw","Switch",0,1,1,v=>v?"Closed":"Open"],["mode","Meter set to",0,3,1,v=>MODES[v]],["pos","Probes on",0,4,1,v=>POS[v]]],checks:[["both","Clamp around both wires"]],
 model,draw:(R,S)=>scene(R,S),
 reads:R=>[["Meter",R.txt+" "+R.unit,!!R.warn],["Heater current",R.I.toFixed(1)+" A"],["Heater power",K.f0(R.P)+" W"],["Breaker",R.brk?"On":"Off"],["Switch",R.sw?"Closed":"Open"],["Probes",R.m==="A"?"clamp on L1":POS[R.pos]]],
 note:R=>R.warn?R.warn:R.m==="A"?(R.both?"Both wires in the jaw: the currents are equal and opposite, so the clamp reads 0.":"One wire in the jaw: this is the real current, I = 240 / 11.52."):R.m==="V"?(R.pos===2&&!R.sw&&R.brk?"Open switch: the full supply appears across it.":R.pos===3&&!R.sw&&R.brk?"Switch open: no current, so the heater drops 0 V even though L2 is live.":R.v===0&&R.pos>0?"0 V. Before you trust it, prove the meter on a known live source.":"Volts are read across two points, in parallel with the part."):"Power off and isolated: the meter's own current measures the resistance.",
 log:[["Mode",R=>["V","Ω","beep","A"][R.mode]],["Probes",R=>R.m==="A"?"clamp":["known","L1-L2","switch","heater","L1-G"][R.pos]],["Breaker",R=>R.brk?"on":"off"],["Read",R=>R.txt]]});
const tasks=[
 K.goal({t:"An open switch shows voltage",intro:"Breaker on, switch <b>open</b>. Read volts across the switch.",check:(S,R)=>!S.brk?"Turn the breaker on.":S.sw?"Open the switch.":S.mode!==0?"Set the meter to V AC.":S.pos!==2?"Put the probes across the switch.":true,
  ok:"240 V across an open switch. Now move the probes across the heater: 0 V, because no current flows through it."}),
 K.goal({t:"Live-dead-live",intro:"In V AC, log three readings in order: the <b>known live circuit</b> (240 V), then with the breaker <b>off</b> the heater circuit at <b>L1 to L2</b> (0 V), then the known live circuit again.",
  check:(S,R,L)=>{const v=L.filter(l=>l.R.mode===0);const a=v.findIndex(l=>l.R.pos===0&&l.R.v>200);if(a<0)return "First log a V AC reading on the known live circuit.";
   const b=v.findIndex((l,i)=>i>a&&!l.R.brk&&l.R.pos===1&&l.R.v===0);if(b<0)return "Next turn the breaker off and log L1 to L2 on the heater circuit.";
   const c=v.findIndex((l,i)=>i>b&&l.R.pos===0&&l.R.v>200);return c<0?"Last, log the known live circuit again to prove the meter.":true},
  ok:"Live, dead, live. The 0 V in the middle is now proven, because the meter read correctly before and after. On a real job also read each leg to ground."}),
 K.caseTask({t:"Service call: electric heat won't heat",intro:"The breaker is on and the switch handle is in the ON position, but the heater stays cold. Take readings and pick the cause.",
  state:{brk:1,sw:0,mode:0,pos:1,both:0},model,draw:(R,S)=>scene(R,S,{noMeter:true,swShow:true}),
  reads:()=>[["Breaker","On"],["Switch handle","ON"]],
  actions:[["L1 to L2",()=>"L1 to L2 at the load side of the breaker: <b>240 V</b>."],["Across the switch",()=>"Across the switch: <b>240 V</b>."],["Across the heater",()=>"Across the heater: <b>0 V</b>."],["Clamp L1",()=>"Clamp on L1: <b>0.0 A</b>."]],
  causes:[["brk","Breaker tripped"],["sw","Switch contacts burned open"],["el","Heater element open"]],ans:"sw",
  why:"240 V across a switch that's supposed to be closed means its contacts are open inside, whatever the handle says. If the element were open instead, you'd read 240 V across the heater and near 0 V across the switch.",hint:"Where does the full 240 V show up? Voltage appears across the open part."})];
window.LESSON={id:"wire-meter",sec:"Wiring Board",secHref:"/wiring/",title:"Using a multimeter safely",lead:"Volts, ohms, continuity and clamp amps, CAT ratings, the live-dead-live test, and why an open switch reads full voltage across it.",
 steps,see,tryIntro:"Two on the meter, then a call.",tasks,
 job:K.job({read:["The nameplate: rated voltage, and RLA, FLA or watts to compare with your amp reading.","The meter's CAT rating and voltage on the front, and on the leads.","Supply voltage: equipment is usually allowed about ±10% of nameplate (216 to 264 V on 240 V)."],
  table:[["Measurement","Meter setting","Power","Good reading"],["Supply L1 to L2","V AC","On","208 to 240 V"],["Leg to ground","V AC","On","about 120 V"],["Closed switch or contacts","V AC across it","On","near 0 V"],["Open switch","V AC across it","On","full supply voltage"],["Heater, winding or coil","Ω","Off, isolated","matches spec"],["Wire, fuse, closed switch","Continuity","Off","beep, near 0 Ω"],["Running current","Clamp, one wire","On","at or below nameplate"]],tableT:"Which setting for which job",
  steps:["Pick the setting before the probes touch anything.","Live: prove the meter on a known source.","Isolate and lock out, then dead: L1-L2, L1-G, L2-G all 0 V.","Live: prove the meter again.","Only now switch to ohms or continuity, or start work."],stepsT:"Before you touch a circuit",
  safety:["Use a meter and leads rated CAT III 600 V or better for HVAC equipment.","One hand where you can: keep the other away from grounded metal.","Never use ohms or continuity on a live circuit, and never put the leads in the A jack to read volts.","Discharge capacitors before ohm readings in a unit; they can hold a charge with the power off."],
  mistakes:["Reading 0 V and trusting it without live-dead-live.","Clamping around a whole cable (both legs) and reading 0 A.","Taking a resistance reading with the part still in the circuit, so you read parallel paths.","Leaving the red lead in the A jack and then reading voltage: that's a short through the meter fuse."]}),
 sources:[["The Engineering Mindset: Learn How To Use a Multimeter","https://theengineeringmindset.com/learn-how-to-use-a-multimeter"],["Fluke: Electrical safety standards (CAT II, III and IV)","https://www.fluke.com/en-gb/learn/blog/safety/safe-test-tools-real-world-use"],["Fluke: How to come home safely at the end of the day (live-dead-live)","https://www.fluke.com/en-us/learn/blog/safety/how-to-go-home-safely-at-the-end-of-the-day"],["HVAC School: Using your volt meter as a voltage drop detector","https://www.hvacrschool.com/using-your-volt-meter-as-a-voltage-drop-detector"]]};
})();
