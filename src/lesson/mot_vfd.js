/* ============ Lesson: How a VFD works ============ */
(()=>{
const M=MK.M,PR=M.hp*0.7457;                        // 7.46 kW shaft at full speed and full load
/* drive + fan: bus from the rectifier (peak of the line, sagging with load), V/Hz output limited by the bus, fan power by the cube law */
const busV=(line,pfrac)=>line*Math.SQRT2*(1-0.045*Math.max(0,Math.min(1.4,pfrac)));
const model=S=>{const r=S.hz/60,ld=S.load/100;
 const Pshaft=PR*ld*r*r*r;                           // fan: torque ~ speed², power ~ speed³
 const Pin=S.hz>0?Pshaft/M.eff/0.97+0.05:0.03;       // motor 91.7%, drive 97%, 50 W standby
 const pfrac=Pin/(PR/M.eff/0.97);
 const bus=busV(S.line,pfrac);
 const vmax=bus*0.74;                                // most line volts the inverter can make from this bus (with overmodulation)
 const vcmd=Math.min(460,460*r);                     // V/Hz: 7.67 V per Hz up to 60 Hz, then held at 460 V
 const Vout=Math.min(vcmd,vmax),capped=vcmd>vmax+0.5||S.hz>60;
 const flux=S.hz>0?Vout/(7.667*S.hz):0;              // 1 = rated flux
 const tq=ld*r*r;                                    // load torque, fraction of rated
 const I=S.hz>0?M.FLA*Math.sqrt(Math.pow(MK.MAG*flux,2)+(1-MK.MAG*MK.MAG)*Math.pow(tq/Math.max(flux,0.3),2)):0;
 const ma=Vout/(0.612*bus);                          // sine PWM modulation index (1 = top of the triangle)
 const full=PR*ld/M.eff/0.97+0.05,save=1-Pin/full;
 return {r,ld,Pshaft,Pin,bus,vmax,vcmd,Vout,capped,flux,tq,I,ma,full,save,vhz:S.hz>0?Vout/S.hz:0,flow:r*100,period:S.hz>0?1000/S.hz:0}};
const f0=K.f0,f1=K.f1;
/* PWM between the triangle carrier and the sine reference over one output cycle. cyc = carrier periods per output cycle shown */
const pwm=(x,y,w,h,ma,cyc=15,o={})=>{const tri=t=>{const p=(t*cyc)%1;return p<0.5?4*p-1:3-4*p};const ref=t=>Math.min(1,ma)*Math.sin(2*Math.PI*t)+(ma>1?0.15*Math.sin(6*Math.PI*t)*(ma-1)/0.15:0);
 let s=MK.screen(x,y,w,h*2+30);const mid=y+h/2+6,lo=y+h+30+h/2;
 if(o.carrier!==false){s+=`<path d="${MK.trace(x,mid,w,h*0.42,tri,cyc*8)}" stroke="#5a7a6a" stroke-width="1.2" fill="none"/>`}
 s+=`<path d="${MK.trace(x,mid,w,h*0.42,ref)}" stroke="#e8c33a" stroke-width="2.2" fill="none"/>`;
 // phase leg output: +bus when ref > carrier
 let d="",prev=null;const n=1600;for(let i=0;i<=n;i++){const t=i/n,v=ref(t)>tri(t)?1:-1;const X=(x+t*w).toFixed(1),Y=(lo-v*h*0.38).toFixed(1);if(prev===null)d+=`M${X} ${Y}`;else if(v!==prev)d+=`L${X} ${(lo-prev*h*0.38).toFixed(1)}L${X} ${Y}`;prev=v}d+=`L${x+w} ${(lo-prev*h*0.38).toFixed(1)}`;
 s+=`<path d="${d}" stroke="#7CFFB2" stroke-width="1.4" fill="none"/>`;
 s+=`<path d="${MK.trace(x,lo,w,h*0.38,t=>Math.min(1,ma)*Math.sin(2*Math.PI*t-0.5)*0.9)}" stroke="#4fd1e8" stroke-width="2.4" fill="none" opacity=".9"/>`;
 s+=`<text x="${x+8}" y="${y+16}" style="font:600 11px var(--mono);fill:#e8c33a">SINE REFERENCE</text><text x="${x+w-8}" y="${y+16}" style="font:600 11px var(--mono);fill:#8fbf9f;text-anchor:end">${o.carrier!==false?"CARRIER":""}</text>`;
 s+=`<text x="${x+8}" y="${y+h+26}" style="font:600 11px var(--mono);fill:#7CFFB2">OUTPUT PULSES (±BUS)</text><text x="${x+w-8}" y="${y+h+26}" style="font:600 11px var(--mono);fill:#4fd1e8;text-anchor:end">MOTOR CURRENT</text>`;
 return s};
const steps=[
 {t:"Three stages: AC to DC to AC",
  body:`<p>A <b>variable frequency drive</b> (VFD) runs a standard induction motor at any speed by making its own AC at any frequency. It does it in three stages:</p><ol><li><b>Rectifier</b>: turns the 480 V, 60 Hz supply into DC.</li><li><b>DC bus</b>: capacitors store that DC and smooth it.</li><li><b>Inverter</b>: six fast transistors (<b>IGBTs</b>) chop the DC back into AC at whatever frequency and voltage the motor needs.</li></ol><p>Change the frequency and the motor's synchronous speed changes with it: 120 × Hz ÷ poles.</p>`,
  draw:()=>MK.power(80,70,{vbus:650,on:[1,0,0,0,1,1]})+K.txt(360,40,"480 V, 60 Hz in  →  about 650 V DC  →  0 to 60 Hz out to the motor")+K.lbl(80,300,"FIXED 60 HZ",{a:"start",size:13,fill:"var(--muted)"})+K.lbl(640,300,"ANY FREQUENCY",{a:"end",size:13,fill:"var(--brass)"})},
 {t:"The rectifier: six diodes",
  body:`<p>A <b>diode</b> lets current through one way only. Six of them in a bridge connect the DC bus to whichever input phase is highest at that moment, and the bottom to whichever is lowest.</p><p>So the DC side follows the tops of the three sine waves: a bumpy DC with six bumps per cycle (<b>six-pulse</b>). Its peaks reach the peak of the line voltage: 480 × 1.414 = <b>679 V</b>.</p>`,
  math:`<p>Line voltage (480 V) is an rms value. Peak = rms × √2 = 480 × 1.414 = 679 V.</p><p>The average of six-pulse rectified DC with no capacitor is 1.35 × line = 648 V.</p>`,
  draw:()=>{const x=80,y=60,w=560,h=240,pk=679,Y=v=>y+h/2-v/pk*(h/2-10);let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/><path d="M${x} ${Y(0)} H${x+w}" stroke="var(--muted)"/>`;
   const ph=[0,-2*Math.PI/3,2*Math.PI/3],c=[MK.COLS.L1,MK.COLS.L2,MK.COLS.L3];
   ph.forEach((p,i)=>{s+=`<path d="${MK.trace(x,Y(0),w,(h/2-10),t=>Math.sin(4*Math.PI*t+p)/1)}" stroke="${c[i]}" stroke-width="1.6" fill="none" opacity=".55"/>`});
   const env=t=>Math.max(...ph.map(p=>Math.abs(Math.sin(4*Math.PI*t+p))));
   s+=`<path d="${MK.trace(x,Y(0),w,(h/2-10),env)}" stroke="var(--hot)" stroke-width="3.2" fill="none"/>`;
   s+=K.tag(x+w-8,Y(pk)+30,"DC OUT: 588 TO 679 V",{a:"end",fill:"var(--hot)"})+K.txt(x+8,y+h+22,"two cycles of 60 Hz (33 ms): the three line-to-line voltages in; the tops of each come out as DC",{a:"start"});
   return s+K.lbl(x+8,y-10,"WHAT THE RECTIFIER PASSES",{a:"start",size:13})}},
 {t:"The DC bus: about 650 V on a 480 V drive",
  body:`<p>Big <b>capacitors</b> across the DC bus fill up at each peak and supply the inverter between them. They act like a storage tank.</p><p>With no load the bus sits near the peak, about <b>680 V</b>. Running, it sags toward the six-pulse average: about <b>1.35 × line volts</b>, so <b>roughly 650 V</b> on 480 V (325 V on 240 V).</p><p>Those capacitors stay charged after the power is off. Wait the time on the drive's label and measure the bus before you touch anything.</p>`,
  draw:()=>{const s=MK.power(80,40,{vbus:650,dim:"bus",on:[0,0,0,0,0,0]});return s+K.chart({x:150,y:250,w:420,h:90,X:[0,100],Y:[600,700],xt:[0,50,100],xf:v=>v+"% load",yt:[600,650,700],yf:v=>v+" V",title:"BUS VOLTAGE vs LOAD, 480 V SUPPLY",series:[{f:p=>busV(480,p/100),c:"var(--hot)",lbl:f0(busV(480,1))+" V",lblAt:100,dy:-8}]})}},
 {t:"The inverter: pulses that add up to a sine wave",
  body:`<p>Each output leg has two IGBTs. One connects the motor lead to + bus, the other to − bus. They switch thousands of times a second (the <b>carrier frequency</b>, typically 2 to 12 kHz).</p><p>The drive compares a sine wave at the wanted frequency to a fast triangle. Where the sine is above the triangle the leg goes high. That makes pulses of varying width: <b>pulse width modulation</b> (PWM).</p><p>The motor's windings smooth the pulses, so the <b>current</b> comes out close to a sine wave.</p>`,
  draw:()=>pwm(60,30,600,140,0.85,15)+K.txt(360,368,"one output cycle; real carriers are much faster than shown")},
 {t:"Volts per hertz",
  body:`<p>To keep the motor's magnetism (its <b>flux</b>) at the rated level, voltage has to go down when frequency goes down. A 460 V, 60 Hz motor wants <b>460 ÷ 60 = 7.67 volts per hertz</b>: 230 V at 30 Hz, 345 V at 45 Hz.</p><p>Above 60 Hz the drive can't make more than its supply, so the voltage stays at 460 V. Flux and available torque drop: that's <b>field weakening</b>.</p><p>Too little voltage at a frequency, and the motor is weak. Too much, and it saturates and overheats.</p>`,
  draw:()=>K.chart({x:100,y:40,w:540,h:270,X:[0,90],Y:[0,600],xt:[0,15,30,45,60,75,90],xf:v=>v+" Hz",yt:[0,100,200,300,400,500,600],xl:"output frequency",yl:"output volts",title:"V/HZ PATTERN, 460 V MOTOR",
   series:[{f:h=>Math.min(460,460*h/60),c:"var(--cold)",lbl:"7.67 V/Hz",lblAt:15,a:"end",dx:-10,dy:-14}],
   vlines:[{x:60,lbl:"base speed",c:"var(--brass)"}],dots:[{x:30,y:230,c:"var(--cold)",lbl:"230 V at 30 Hz",dx:12,dy:20},{x:60,y:460,c:"var(--cold)",lbl:"460 V",a:"end",dx:-12}]})+K.tag(625,206,"VOLTS HELD, FLUX FALLS",{a:"end",fill:"var(--warn)"})+K.txt(625,232,"field weakening",{a:"end"})},
 {t:"Why fans save so much: the cube law",
  body:`<p>On a fan or centrifugal pump, the <b>affinity laws</b> say:</p><ul><li>Flow goes with speed.</li><li>Pressure goes with speed squared.</li><li><b>Power goes with speed cubed.</b></li></ul><p>Run a fan at 80% speed and it needs 0.8 × 0.8 × 0.8 = <b>51%</b> of the power. DOE puts it as: 20% less speed can cut input power about in half. Half speed takes about one eighth.</p><p>That's why a VFD beats a damper or a throttling valve, which only add resistance while the motor keeps spinning at full speed.</p>`,
  draw:()=>K.chart({x:100,y:40,w:540,h:270,X:[0,100],Y:[0,100],xt:[0,20,40,60,80,100],xf:v=>v+"%",yt:[0,25,50,75,100],yf:v=>v+"%",xl:"fan speed (% of full)",yl:"% of full",title:"AFFINITY LAWS",
   series:[{f:x=>x,c:"var(--cold)",lbl:"flow",lblAt:62,dy:-14},{f:x=>x*x/100,c:"var(--ok)",lbl:"pressure",lblAt:60,a:"start",dx:10,dy:24},{f:x=>x*x*x/1e4,c:"var(--hot)",lbl:"power",lblAt:40,a:"end",dx:-6,dy:-8}],
   dots:[{x:80,y:51.2,c:"var(--hot)",lbl:"80% speed: 51% power",a:"start",dx:-30,dy:40},{x:50,y:12.5,c:"var(--hot)",lbl:"50%: 12.5%",a:"start",dx:6,dy:30}]})}];
/* ---------- See it ---------- */
const scene=(R,S)=>{let s=MK.power(60,6,{vbus:R.bus,on:[1,0,1,0,1,0]});
 s+=MK.box(20,220,120,"LINE IN",S.line+" V",{vs:16})+MK.box(150,220,130,"DC BUS",f0(R.bus)+" V",{vs:16,vc:"var(--hot)"})+MK.box(290,220,130,"OUT VOLTS",f0(R.Vout)+" V",{vs:16,vc:R.capped&&S.hz<=60?"var(--bad)":null})+MK.box(430,220,130,"OUT FREQ",f1(S.hz)+" Hz",{vs:16})+MK.box(570,220,130,"V/HZ",S.hz>0?K.f2(R.vhz):"-",{vs:16,vc:R.flux<0.97&&S.hz>0?"var(--warn)":null});
 // fan power bar
 const bx=20,by=300,bw=680;s+=K.lbl(bx,by,"FAN POWER: "+K.f2(R.Pin)+" KW IN, "+f0(R.Pin/R.full*100)+"% OF FULL SPEED",{a:"start",size:13});
 s+=`<rect x="${bx}" y="${by+10}" width="${bw}" height="22" rx="4" fill="var(--bg)" stroke="var(--panel-edge)"/><rect x="${bx}" y="${by+10}" width="${Math.min(1.2,R.Pin/R.full)*bw/1.2}" height="22" rx="4" fill="${S.hz>60?"var(--bad)":"var(--hot)"}"/><path d="M${bx+bw/1.2} ${by+6} v30" stroke="var(--ink)" stroke-width="2"/>`;
 s+=K.lbl(bx,by+56,"AIRFLOW: "+f0(R.flow)+"%",{a:"start",size:13})+`<rect x="${bx}" y="${by+64}" width="${bw}" height="14" rx="4" fill="var(--bg)" stroke="var(--panel-edge)"/><rect x="${bx}" y="${by+64}" width="${Math.min(1.2,R.r)*bw/1.2}" height="14" rx="4" fill="var(--cold)"/>`+K.txt(bx+bw/1.2,by+52,"100%");
 if(S.hz>0)s+=pwm(20,400,680,62,R.ma,15)+K.txt(360,572,"one output cycle = "+f1(R.period)+" ms · modulation "+f0(R.ma*100)+"%"+(R.ma>1?" (overmodulating)":""));else s+=MK.screen(20,400,680,154)+`<text x="360" y="482" style="font:600 13px var(--mono);fill:#8fbf9f;text-anchor:middle">OUTPUT OFF</text>`;
 return s};
const see=K.see({vb:"0 0 720 580",init:{hz:45,line:480,load:100},
 sliders:[["hz","Speed reference",0,75,1,v=>v+" Hz"],["line","Supply voltage",400,528,4,v=>v+" V"],["load","Fan load at full speed",40,100,5,v=>v+"% of 10 hp"]],
 model,draw:scene,
 reads:(R,S)=>[["DC bus",f0(R.bus)+" V"],["Bus ÷ line volts",K.f2(R.bus/S.line)],["Output",f0(R.Vout)+" V at "+S.hz+" Hz"],["Volts per hertz",S.hz>0?K.f2(R.vhz):"-",R.flux<0.97&&S.hz>0],["Motor speed",MK.n0(MK.sync(S.hz,4)*(1-0.0194*R.tq/Math.max(R.flux,0.3)))+" rpm"],["Motor current",f1(R.I)+" A",R.I>M.FLA+0.05],["Airflow",f0(R.flow)+"%"],["Input power",K.f2(R.Pin)+" kW"],["Saved vs full speed",S.hz<=60?f0(R.save*100)+"%":"none",S.hz>60]],
 note:(R,S)=>S.hz>60?"Above 60 Hz: voltage is stuck at 460 V, flux drops, and fan power climbs with the cube. A 10 hp fan at "+S.hz+" Hz would need "+f1(PR*R.ld*R.r**3/0.7457)+" hp.":R.capped?"Low supply: the bus can't make enough output voltage, so V/Hz falls below 7.67 and the motor is under-fluxed.":S.hz===0?"Stopped: the bus sits at the peak of the line.":"",
 log:[["Hz",(R,S)=>S.hz],["Bus V",R=>f0(R.bus)],["Out V",R=>f0(R.Vout)],["kW",R=>K.f2(R.Pin)],["Amps",R=>f1(R.I)]]});
const tasks=[
 K.goal({t:"Run the fan at 75% airflow",intro:"Supply at <b>480 V</b>, fan load <b>100%</b>. Set the drive for <b>75% airflow</b>, then log it, and log full speed (60 Hz) too.",
  check:(S,R,L)=>{const g=l=>l.S.line===480&&l.S.load===100;const a=L.some(l=>g(l)&&l.S.hz===45),b=L.some(l=>g(l)&&l.S.hz===60);return !a?"Log a reading at 75% airflow (airflow follows speed: what frequency is 75% of 60 Hz?).":!b?"Now log 60 Hz for comparison.":true},
  ok:()=>{const a=model({hz:45,line:480,load:100}),b=model({hz:60,line:480,load:100});return `45 Hz: ${K.f2(a.Pin)} kW. 60 Hz: ${K.f2(b.Pin)} kW. 75% of the air for ${f0(a.Pin/b.Pin*100)}% of the power: 0.75³ = 0.42.`}}),
 K.goal({t:"Run out of volts",intro:"Find a setting where the drive <b>can't hold 7.67 V/Hz</b> even though it is at or under 60 Hz. Log it.",
  check:(S,R,L)=>L.some(l=>l.S.hz<=60&&l.S.hz>0&&l.R.flux<0.97)?true:"Log a reading at 60 Hz or below where V/Hz is under 7.67. What feeds the DC bus?",
  ok:"A low supply means a low bus, and the inverter can't make more output voltage than the bus allows (about 0.69 × bus here). The motor is under-fluxed, draws more current for the same torque and runs hotter. Check the line voltage when a drive can't hit full output volts."}),
 K.caseTask({t:"Service call: is this bus voltage right?",intro:"A new tech on a 480 V air handler drive reads the DC bus with the cover on, through the drive's test terminals. He's worried it isn't 480 V.",
  state:{hz:60,line:482,load:90},model,
  draw:(R,S)=>MK.power(80,40,{vbus:R.bus,on:[1,0,0,0,1,1]})+MK.box(100,260,160,"STOPPED",f0(busV(482,0))+" V DC",{vs:18})+MK.box(280,260,160,"RUNNING 60 HZ",f0(R.bus)+" V DC",{vs:18})+MK.box(460,260,160,"LINE L1-L2",S.line+" V AC",{vs:18}),
  reads:(R,S)=>[["Line, all three pairs","481 to 483 V AC"],["Bus stopped",f0(busV(482,0))+" V DC"],["Bus running",f0(R.bus)+" V DC"],["Bus ripple","6 V AC"],["Drive","no faults"]],
  causes:[["ok","Normal: nothing wrong"],["caps","Bus capacitors failing"],["high","Supply voltage too high"],["diode","An open rectifier diode"]],ans:"ok",
  why:`The bus should sit near the peak of the line: 482 × 1.414 = ${f0(482*Math.SQRT2)} V stopped, sagging toward about 1.35 × line when loaded. Low ripple says the capacitors and all six diodes are fine. That's a healthy drive.`,hint:"Multiply the line voltage by 1.414 and by 1.35."})];
window.LESSON={id:"mot-vfd",sec:"Motors + VFD",secHref:"/motors/",title:"How a VFD works",lead:"How a variable frequency drive makes any speed: rectifier, DC bus, PWM inverter, volts per hertz, and why slowing a fan saves so much power.",
 steps,see,tryIntro:"Two in See it, then a bus reading to judge.",tasks,
 job:K.job({read:["Drive keypad: output frequency, output current, output voltage and DC bus voltage (most drives show all four).","Supply voltage on all three pairs at the drive input.","The motor nameplate values entered in the drive (volts, FLA, Hz, rpm)."],
  table:[["Reading","Normal on a 480 V drive"],["DC bus, stopped","About 1.41 × line: 680 V"],["DC bus, running","About 1.35 × line: 650 V"],["Output V/Hz","460 ÷ 60 = 7.67 V/Hz (230 V at 30 Hz)"],["Output above 60 Hz","Stays at about 460 V (field weakening)"],["Fan power at 80% speed","About 51% (speed cubed)"],["Carrier frequency","Usually 2 to 12 kHz"]],tableT:"Numbers to know",
  steps:["Read the keypad: Hz, amps, volts and bus.","Check the bus against 1.35 to 1.41 × the measured line voltage.","At steady speed, output volts should be close to 7.67 × Hz on a 460 V motor.","Check the motor amps against nameplate FLA at full speed.","On a fan, compare kW at your speed to full-speed kW: it should follow speed cubed roughly."],stepsT:"Checking a running drive",
  safety:["The DC bus stays charged after power is removed. Wait the time on the drive's label (often 5 to 15 minutes) and measure the bus before touching anything inside.","Output leads carry fast high-voltage pulses even at low speed. Treat them as live whenever the drive runs.","Use a meter rated CAT III for the drive's voltage. An ordinary meter can read the PWM output wrong: use its low-pass (VFD) mode."],
  mistakes:["Expecting 480 V on the DC bus.","Reading output voltage with a meter that has no VFD filter and calling the drive bad.","Running a fan past 60 Hz for more air: power goes up with the cube and the motor overloads.","Entering the wrong motor data: the drive's V/Hz and overload are built from it."]}),
 sources:[["The Engineering Mindset: variable frequency drives explained","https://theengineeringmindset.com/variable-frequency-drives-explained/"],["U.S. DOE: adjustable speed drive part-load efficiency (motor tip sheet 11, cube law)","https://www.energy.gov/sites/prod/files/2014/04/f15/motor_tip_sheet11.pdf"],["AutomationDirect: DC bus overvoltage white paper (460 V drive bus about 650 V DC = line × 1.414)","https://library.automationdirect.com/wp-content/uploads/2024/12/DCBusOvervoltage-white-paper.pdf"],["Fan affinity laws for VFD control","https://industrialmonitordirect.com/blogs/knowledgebase/fan-affinity-laws-for-vfd-control-centrifugal-vs-axial-comparison"]]};
})();
