/* ============ Lesson: Common drive faults ============ */
(()=>{
const M=MK.M,FLA=M.FLA,Tr=M.Tr;
/* drive limits: Yaskawa 480 V class OV 800 V DC, UV 380 V DC, OC about 180% of drive rated current, GF at 50%. Drive rated 14 A here. */
const ID=14,OC=1.8*ID,ILIM=1.5*FLA,OV=800,OVS=760,UV=380,C=0.0022,RB=60,PLOSS=300,OHT=95;
/* run test: accelerate 0 to 60 Hz, hold 5 s, decelerate to 0. Fan torque ~ speed², motor follows the frequency (slip ignored). Returns the traces and the first fault. */
const sim=S=>{const dt=0.02,w60=2*Math.PI*1800/60,ld=S.load/100,ambC=(S.amb-32)/1.8;
 let t=0,f=0,phase="acc",hold=0,bus=0,fault=null,ft=0,fph="",Ipk=0,Vpk=0,tDec0=0,tStop=null,ilim=false,ovs=false,brk=false,Ihold=0;
 const tr=[];const Vr=pf=>S.line*Math.SQRT2*(1-0.045*Math.max(0,Math.min(1.3,pf)));bus=Vr(0);
 const trip=(c)=>{if(!fault){fault=c;ft=t;fph=phase}};
 while(t<240&&!fault){
  let df=0;if(phase==="acc")df=60/S.acc*dt;else if(phase==="dec")df=-60/S.dec*dt;
  const torque=d=>{const f1=Math.max(0,Math.min(60,f+d)),r=f1/60,TL=f1>0?Tr*(ld*r*r+0.02):0,dw=(f1-f)/60*w60/dt;return {f1,T:S.J*dw+TL,w:r*w60}};
  let q=torque(df);let I=MK.amps(Math.abs(q.T)/Tr);
  ilim=false;ovs=false;brk=false;
  if(phase==="acc"&&I>ILIM&&S.stall){                // current limit: accelerate only as fast as the limit current allows
   const tqm=Math.sqrt(((ILIM/FLA)**2-MK.MAG**2)/(1-MK.MAG**2)),r=f/60,TL=f>0?Tr*(ld*r*r+0.02):0,Ta=Math.max(0,tqm*Tr-TL);
   q=torque(Math.min(df,Ta/S.J*dt/w60*60));I=MK.amps(Math.abs(q.T)/Tr);ilim=true}
  if(S.gnd&&t>=0.1)trip("GF");
  if(I>OC)trip("OC");
  // DC bus: the rectifier holds it at Vr while motoring; regenerated power charges the capacitors
  const P=q.T*q.w;                                  // + motoring, − generating (W)
  const vr=Vr(Math.max(0,P)/(M.hp*745.7));
  if(P>=0){let E=0.5*C*bus*bus-PLOSS*dt;bus=Math.max(vr,Math.sqrt(Math.max(0,2*E/C)))}
  else{if(S.ovs&&phase==="dec"&&bus>OVS){q=torque(0);I=MK.amps(Math.abs(q.T)/Tr);ovs=true}
   const Pg=q.T*q.w<0?-q.T*q.w*0.85:0;let E=0.5*C*bus*bus+(Pg-PLOSS)*dt;
   if(S.brake&&bus>OVS){E-=bus*bus/RB*dt;brk=true}
   bus=Math.max(vr,Math.sqrt(Math.max(0,2*E/C)))}
  if(bus>=OV)trip("OV");
  if(bus<UV&&f>0)trip("UV");
  f=q.f1;Ipk=Math.max(Ipk,I);Vpk=Math.max(Vpk,bus);
  tr.push([t,f,I,bus]);
  if(phase==="acc"&&f>=60){phase="hold";hold=0}
  else if(phase==="hold"){hold+=dt;Ihold=I;if(hold>=5){
    const hs=ambC+(6+28*(I/FLA)**2)*(S.fan?3.2:1);if(hs>=OHT){trip("OH")}else{phase="dec";tDec0=t}}}
  else if(phase==="dec"&&f<=0){tStop=t-tDec0;break}
  t+=dt}
 const hs=ambC+(6+28*(Ihold/FLA)**2)*(S.fan?3.2:1);
 return {tr,fault,ft,fph,Ipk,Vpk,tStop,hs,ilim,end:t,Ihold,vr0:Vr(0),decSet:S.dec}};
const NAMES={OC:"Overcurrent",OV:"DC bus overvoltage",UV:"DC bus undervoltage",GF:"Ground fault",OH:"Heatsink overtemperature"};
const PH={acc:"accelerating",hold:"at speed",dec:"decelerating"};
/* three stacked traces: frequency, current, bus. (x,y) top-left, width w */
const traces=(R,x=70,y=20,w=600,o={})=>{const T=Math.max(10,Math.ceil(R.end/10)*10),X=t=>x+t/T*w;let s="";y+=8;
 const pl=(k,lo,hi,top,h,c)=>{const Y=v=>top+h-(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*h;let d="";R.tr.forEach((p,i)=>{if(i%2&&i!==R.tr.length-1)return;d+=(d?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[k]).toFixed(1)});return {d:`<path d="${d}" stroke="${c}" stroke-width="2.6" fill="none"/>`,Y}};
 const panel=(top,h,lo,hi,ticks,unit,title,k,c,lines)=>{let p=`<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
  const L=pl(k,lo,hi,top,h,c);ticks.forEach(v=>{p+=`<path d="M${x} ${L.Y(v)} H${x+w}" stroke="var(--panel-edge)" stroke-width=".7"/>`+K.txt(x-6,L.Y(v)+5,v+unit,{a:"end"})});
  (lines||[]).forEach(([v,lb,cc])=>{p+=`<path d="M${x} ${L.Y(v)} H${x+w}" stroke="${cc}" stroke-width="1.5" stroke-dasharray="6 4"/>`+`<text x="${x+w-6}" y="${L.Y(v)+(v===ILIM?14:-4)}" style="font:500 11px var(--body);fill:${cc};text-anchor:end">${lb}</text>`});
  return p+L.d+K.lbl(x+2,top-6,title,{a:"start",size:12})};
 const h=o.h||80,gap=o.gap||26;
 s+=panel(y,h,0,60,[0,30,60]," Hz","OUTPUT FREQUENCY",1,"var(--cold)");
 s+=panel(y+h+gap,h,0,30,[0,10,20,30]," A","MOTOR CURRENT",2,"var(--hot)",[[OC,"OC trip "+K.f1(OC)+" A","var(--bad)"],[ILIM,"current limit "+K.f0(ILIM)+" A","var(--warn)"]]);
 s+=panel(y+2*(h+gap),h,300,850,[400,600,800]," V","DC BUS",3,"#a33ad2",[[OV,"OV trip 800 V","var(--bad)"]]);
 for(let tt=0;tt<=T;tt+=T>60?20:10)s+=K.txt(X(tt),y+3*h+2*gap+20,tt+" s");
 if(R.fault){const xx=X(R.ft);s+=`<path d="M${xx} ${y} V${y+3*h+2*gap}" stroke="var(--bad)" stroke-width="2"/>`+K.tag(xx>x+w-130?xx-6:xx+6,y+h-14,"FAULT "+R.fault,{a:xx>x+w-130?"end":"start",fill:"var(--bad)",w:110})}
 return s};
const scene=(R,S)=>{let s=traces(R,80,14,470,{h:92});
 const lcd1=R.fault?"FAULT "+R.fault:"READY",lcd2=R.fault?{OC:"OVERCURRENT",OV:"BUS HIGH",UV:"BUS LOW",GF:"GROUND",OH:"HEATSINK HOT"}[R.fault]:"STOP "+(R.tStop!=null?K.f1(R.tStop)+" s":"");
 s+=MK.drive(572,40,132,200,{lcd1,lcd2,fault:!!R.fault});
 s+=MK.box(566,260,144,"HEATSINK",K.f0(R.hs)+"°C",{vs:17,vc:R.hs>=OHT?"var(--bad)":R.hs>80?"var(--warn)":null});
 return s};
const steps=[
 {t:"How a drive protects itself",
  body:`<p>A drive watches itself thousands of times a second. When a reading goes past a limit it shuts off the output (the motor coasts) and shows a <b>fault code</b>:</p><ul><li><b>OC</b>: output current too high.</li><li><b>OV</b>: DC bus voltage too high.</li><li><b>UV</b>: DC bus voltage too low.</li><li><b>GF</b>: current leaking to ground.</li><li><b>OH</b>: heatsink too hot.</li></ul><p>Before you reset, read the <b>fault history</b>: most drives store the code, the time, and the speed, current and bus voltage when it tripped.</p>`,
  draw:()=>{let s=MK.power(50,70,{vbus:810,on:[0,0,0,0,0,0]})+MK.drive(574,60,136,220,{lcd1:"FAULT OV",lcd2:"BUS 810 V",fault:true});
   s+=MK.co(230,90,230,40,"UV / OV: BUS VOLTS",{a:"start"})+MK.co(470,155,470,310,"OC / GF: OUTPUT CURRENT",{a:"middle"})+MK.co(420,190,250,310,"OH: HEATSINK",{a:"middle"});return s}},
 {t:"Overcurrent (OC)",
  body:`<p>OC trips when output current jumps past what the IGBTs can take: on a Yaskawa drive, about <b>180% of the drive's rated current</b>. It's fast, so it catches sudden events.</p><ul><li>Accel time too short for a heavy fan wheel.</li><li>Load jammed, or a bearing seized.</li><li>Phase-to-phase short in the cable or motor.</li><li>A contactor between drive and motor opening and closing while running.</li><li>Starting into a fan that's windmilling backward.</li></ul><p>Most drives also have a <b>current limit</b> (stall prevention): they pause the ramp to keep the current down, so a slightly short accel time just takes longer.</p>`,
  draw:()=>traces(sim({acc:8,dec:60,J:2,load:80,line:480,amb:86,stall:false,ovs:false,brake:false,fan:false,gnd:false}),110,20,520)+K.txt(370,370,"heavy fan, 8 s accel, current limit off: OC near the top of the ramp")},
 {t:"Overvoltage on decel (OV)",
  body:`<p>When the drive lowers the frequency faster than a heavy fan can coast down, the fan drives the motor. The motor becomes a <b>generator</b> and pushes energy back into the DC bus. The rectifier can't send it back to the line, so the capacitors charge up. Past about <b>800 V</b> on a 480 V drive: <b>OV</b>.</p><p>Fixes, in order:</p><ul><li>Lengthen the <b>decel time</b>.</li><li>Turn on <b>OV stall</b> (the drive pauses the ramp when the bus climbs), or set the stop to <b>coast</b>.</li><li>Add a <b>braking resistor</b> to burn off the energy.</li></ul><p>High line voltage or power factor capacitors on the drive's input also cause OV.</p>`,
  draw:()=>traces(sim({acc:15,dec:12,J:2,load:80,line:480,amb:86,stall:true,ovs:false,brake:false,fan:false,gnd:false}),110,20,520)+K.txt(370,370,"same fan, 12 s decel: the bus charges until it trips")},
 {t:"Undervoltage (UV)",
  body:`<p>UV means the DC bus dropped too low to run: about <b>380 V DC</b> on a 480 V Yaskawa (roughly a 280 V supply). Causes:</p><ul><li>Supply sag or a brief outage (a big motor starting, utility switching).</li><li>A lost phase: blown fuse, loose input lug. The bus sags and ripples under load.</li><li>A bad precharge circuit or soft-charge contactor.</li></ul><p>Check: measure all three line-to-line input voltages at the drive, and check the input fuses with the power on (voltage across a fuse = blown).</p>`,
  draw:()=>{const pts=[[0,480],[4,480],[4.2,300],[7,265],[7.2,480],[12,480]];const b=v=>v*1.414*0.97;return K.chart({x:110,y:40,w:520,h:270,X:[0,12],Y:[0,800],xt:[0,2,4,6,8,10,12],xf:v=>v+" s",yt:[0,200,400,600,800],yf:v=>v+" V",xl:"time",title:"SUPPLY SAG ON A 480 V DRIVE",
   series:[{pts,c:"var(--cold)",lbl:"line volts AC",lblAt:10,a:"end",dx:0,dy:-10},{pts:pts.map(([t,v])=>[t,b(v)]),c:"#a33ad2",lbl:"DC bus",lblAt:10,a:"end",dx:0,dy:-10}],bands:[{y0:0,y1:UV,c:"#d0312d",lbl:"UV TRIP BELOW 380 V DC"}]})}},
 {t:"Ground fault (GF)",
  body:`<p>The drive compares the current going out on T1, T2 and T3. They should add up to zero. If some current returns through the ground instead (Yaskawa: more than <b>50% of the drive's rated current</b>), it trips <b>GF</b>.</p><ul><li>Motor winding insulation broken down to the frame.</li><li>Water in the conduit or the motor's terminal box.</li><li>A lead nicked during pulling, or pinched under the cover.</li></ul><p>Check: lock out, <b>lift the leads at the drive</b>, and megger the cable and motor together, then each one alone. Never megger the drive.</p>`,
  draw:()=>{let s=MK.drive(30,60,140,220,{lcd1:"FAULT GF",lcd2:"GROUND",fault:true})+MK.motor(400,150,0.85,{box:true});
   s+=MK.wire("M100 280 V320 H330 V110 H498 V126",'var(--ink)',4)+MK.wire("M100 280 V320",'var(--ink)',4);
   s+=`<path d="M430 300 V330 H70 V300" stroke="${MK.COLS.gnd}" stroke-width="3" fill="none" stroke-dasharray="7 5"/>`;
   s+=K.tag(560,96,"WINDING TO FRAME",{fill:"var(--bad)"})+`<circle cx="470" cy="215" r="10" fill="none" stroke="var(--bad)" stroke-width="3"/>`+K.txt(250,352,"fault current returns on the ground wire, not the other phases",{fill:MK.COLS.gnd});return s}},
 {t:"Overtemperature (OH)",
  body:`<p>The IGBTs sit on an aluminum heatsink with a fan blowing through it. OH trips when the heatsink gets too hot. Most drives are rated for a <b>104°F (40°C)</b> room without derating.</p><ul><li>Heatsink fan failed or the fins are packed with dust.</li><li>Room too hot, or the drive is in a sealed panel with no ventilation.</li><li>Drive running near or over its current rating.</li><li>Carrier frequency raised for quieter motors (more switching heat).</li></ul><p>Clean the fins, check the fan spins, and measure the room. Many drives show heatsink temperature on the keypad.</p>`,
  draw:()=>{const curve=(fan)=>T=>((T-32)/1.8)+(6+28*(MK.amps(0.8)/FLA)**2)*(fan?3.2:1);return K.chart({x:110,y:40,w:520,h:270,X:[60,130],Y:[20,140],xt:[60,70,80,90,100,110,120,130],xf:v=>v+"°F",yt:[20,40,60,80,100,120,140],yf:v=>v+"°C",xl:"room temperature",yl:"heatsink",title:"HEATSINK AT 80% LOAD (THIS LESSON'S MODEL)",
   series:[{f:curve(false),c:"var(--ok)",lbl:"fan working",lblAt:125,dy:-10},{f:curve(true),c:"var(--bad)",lbl:"fan failed",lblAt:100,a:"end",dx:-10,dy:-10}],bands:[{y0:OHT,y1:140,c:"#d0312d"}],vlines:[{x:104,lbl:"104°F rating",c:"var(--brass)"}]})+K.tag(140,98,"OH TRIP 95°C",{a:"start",fill:"var(--bad)"})}}];
/* ---------- See it ---------- */
const see=K.see({vb:"0 0 720 380",init:{acc:15,dec:45,J:2,load:80,line:480,amb:86,stall:true,ovs:false,brake:false,fan:false,gnd:false},
 sliders:[["acc","Accel time (0 to 60 Hz)",2,60,1,v=>v+" s"],["dec","Decel time (60 to 0 Hz)",2,90,1,v=>v+" s"],["J","Fan wheel inertia",0.5,4,0.5,v=>v+" kg·m²"],["load","Fan load at full speed",20,100,10,v=>v+"%"],["line","Supply voltage",240,560,10,v=>v+" V"],["amb","Room temperature",60,130,2,v=>v+"°F"]],
 checks:[["stall","Current limit (stall prevention) on"],["ovs","OV stall on decel"],["brake","Braking resistor fitted"],["fan","Heatsink fan failed"],["gnd","Motor winding shorted to ground"]],
 model:sim,draw:scene,
 reads:(R,S)=>[["Result",R.fault?R.fault+": "+NAMES[R.fault]:"Stopped OK",!!R.fault],["When",R.fault?PH[R.fph]+" at "+K.f1(R.ft)+" s":"-"],["Peak current",K.f1(R.Ipk)+" A",R.Ipk>OC],["Peak DC bus",K.f0(R.Vpk)+" V",R.Vpk>=OV],["Bus at rest",K.f0(R.vr0)+" V",R.vr0<UV],["Stop took",R.tStop!=null?K.f1(R.tStop)+" s":"-"],["Heatsink at speed",K.f0(R.hs)+"°C",R.hs>=OHT]],
 note:(R,S)=>R.fault==="OV"?"The fan is feeding energy back faster than the drive can get rid of it. Longer decel, OV stall, or a braking resistor.":R.fault==="OC"?"Current jumped past the trip. Longer accel, or let the current limit work.":R.fault==="UV"?"Not enough supply voltage to keep the bus above 380 V.":R.fault==="GF"?"Trips as soon as the output turns on. Megger the motor and cable with the leads lifted.":R.fault==="OH"?"The heatsink would pass 95°C after running a while at speed.":R.tStop!=null&&R.tStop>S.dec+0.5?"No trip, but the drive stretched the stop past the decel time to protect the bus.":"",
 log:[["Accel/decel",(R,S)=>S.acc+"/"+S.dec+" s"],["Brake",(R,S)=>S.brake?"yes":"no"],["Result",R=>R.fault||"OK"],["Stop",R=>R.tStop!=null?K.f1(R.tStop)+" s":"-"]],logHint:"Press Log reading after each run, like a fault history."});
const tasks=[
 K.goal({t:"Trip it on OV, then fix it without a resistor",intro:"Shorten the decel time until the drive trips <b>OV</b> and log it. Then fix it <b>without</b> the braking resistor and log the good run.",
  check:(S,R,L)=>{const a=L.some(l=>l.R.fault==="OV"),b=L.some(l=>!l.R.fault&&!l.S.brake&&!l.S.gnd&&l.R.tStop!=null);return !a?"Log a run that trips OV.":!b?"Now log a run that stops with no fault and no braking resistor.":true},
  ok:"Either a longer decel lets the fan's own drag soak up its energy, or OV stall pauses the ramp whenever the bus climbs. Both cost stopping time."}),
 K.goal({t:"Stop the heavy fan in 15 seconds",intro:"Fan inertia <b>2 kg·m²</b> or more, <b>80% load</b>. Make it stop in <b>15 s or less</b>, with no fault.",
  check:(S,R)=>S.J<2?"Keep the heavy wheel (2 kg·m² or more).":S.load<80?"Keep the load at 80% or more.":R.fault?`It tripped ${R.fault}.`:R.tStop==null?"Run it through a stop.":R.tStop>15.05?`Stop took ${K.f1(R.tStop)} s. ${S.ovs?"OV stall keeps stretching it.":"Shorter decel, but then the bus..."}`:true,
  ok:(S,R)=>`Stopped in ${K.f1(R.tStop)} s. Only a braking resistor can do this: the energy has to go somewhere, and stretching the decel isn't allowed. That's when you fit one.`}),
 K.caseTask({t:"Service call: GF every time it starts",intro:"A rooftop exhaust fan drive trips <b>GF</b> a second after every start. It ran fine until last week's storms.",
  state:{acc:15,dec:45,J:1,load:80,line:480,amb:70,stall:true,ovs:false,brake:false,fan:false,gnd:true},model:sim,draw:(R,S)=>scene(R,S),
  reads:R=>[["Fault","GF at "+K.f1(R.ft)+" s"],["Line voltage","480 V, balanced"],["Fault history","GF × 6, all at start"]],
  actions:[["Run the drive with the motor leads lifted",()=>"Runs to 60 Hz with no fault. The drive's output is fine."],["Megger the cable alone at 1,000 V",()=>"2,000 MΩ each conductor to ground."],["Megger the motor alone at 500 V",()=>"T1 0.4 MΩ, T2 0.4 MΩ, T3 0.4 MΩ to ground. Terminal box has water in it."]],
  causes:[["motor","Motor winding to ground (wet)"],["igbt","Shorted IGBT in the drive"],["cable","Damaged cable"],["decel","Decel time too short"]],ans:"motor",
  why:"The drive runs fine on its own and the cable tests clean, so the leak is in the motor: 0.4 MΩ is far under the 5 MΩ minimum. Water got into the terminal box. Dry the motor (or send it out), fix the gasket and conduit seal, and megger it again before restarting.",hint:"Split the circuit: drive, cable, motor. Which part fails?"})];
window.LESSON={id:"mot-faults",sec:"Motors + VFD",secHref:"/motors/",title:"Common drive faults",lead:"What OC, OV, UV, GF and OH faults on a VFD mean, what causes each one, and how to check it before you reset.",
 steps,see,tryIntro:"Two runs to set up in See it, then a ground fault to track down.",tasks,
 job:K.job({read:["Fault code and the fault history: time, frequency, current and bus voltage at the trip.","What the drive was doing: accelerating, at speed or decelerating.","Line voltage on all three pairs, and the DC bus on the keypad.","Accel and decel times, current limit and stall settings."],
  table:[["Fault","Trips at (480 V Yaskawa)","Usual causes","First check"],["OC","About 180% of drive rated current","Short accel, jam, short in cable or motor, output contactor","Run with motor disconnected; megger and ohm the motor"],["OV","800 V DC","Decel too short, high-inertia fan, high line, PF capacitors","Lengthen decel, OV stall, braking resistor"],["UV","380 V DC","Sag, lost phase, loose lug, precharge","Measure all three input voltages and the fuses"],["GF","Ground current over 50% of drive rating","Wet or damaged winding, nicked cable","Lift leads; megger cable and motor separately"],["OH","Heatsink limit","Fan failed, dirty fins, hot room, high carrier","Fan, fins, room temperature"]],tableT:"Fault quick reference",
  steps:["Read and write down the fault and the history before resetting. Some resets clear them.","Match the fault to what the drive was doing (accel, steady, decel).","Check the easy things first: supply voltage, settings, fan, filters.","For OC and GF: lock out, lift the motor leads, run the drive alone, then test the cable and motor.","Reset only once you know why it tripped. Repeated resets on OC or GF can destroy the drive or the motor."],stepsT:"Troubleshooting a trip",
  safety:["Wait for the DC bus to discharge (label time) and measure it before opening the drive.","Never megger a drive's terminals. Lift the motor leads first.","An auto-restart drive can start the fan by itself after a fault clears. Lock out before working on the fan or motor.","A windmilling fan turns the motor into a generator: the leads can be live even with the drive off."],
  mistakes:["Resetting the same fault over and over without finding the cause.","Shortening the decel time to stop a fan faster and getting OV trips.","Adding a contactor between the drive and motor and switching it while running.","Blaming the drive for GF before meggering the motor."]}),
 sources:[["The Engineering Mindset: variable frequency drives explained","https://theengineeringmindset.com/variable-frequency-drives-explained/"],["Yaskawa E7B manual, p. 187: OC about 180% of drive rated current, OH heatsink","https://www.manualsdir.com/manuals/802332/yaskawa-e7b-drive-bypass.html?page=187"],["Yaskawa E7B manual, p. 193: OV at 800 V DC and UV at 380 V DC (480 V class)","https://www.manualsdir.com/manuals/802332/yaskawa-e7b-drive-bypass.html?page=193"],["Yaskawa E7B manual, p. 186: GF over 50% of drive rated current","https://www.manualsdir.com/manuals/802332/yaskawa-e7b-drive-bypass.html?page=186"],["AutomationDirect: DC bus overvoltage white paper (regeneration, decel time, braking resistor)","https://library.automationdirect.com/wp-content/uploads/2024/12/DCBusOvervoltage-white-paper.pdf"]]};
})();
