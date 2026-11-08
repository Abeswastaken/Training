/* ============ Lesson: Steam basics: one-pipe and two-pipe ============ */
(()=>{
/* one hour of a low-pressure steam boiler on its pressuretrol. Pressure builds only when the boiler makes more steam than the radiators condense. */
const run=S=>{const L=S.load/100,up=L>=1?0:0.5*(1/L-1),down=0.3,cut=S.cin+S.diff,warm=8;let p=0,on=true,t=0,pts=[[0,0]],cuts=0,onT=0,peak=0;const dt=0.05;
 for(t=dt;t<=60.001;t+=dt){if(t>warm){if(on){p+=up*dt;if(L>=1)p=Math.min(p+0.02,0.1);if(S.plug)p=Math.min(15,p);else if(p>=cut){on=false;if(t>10)cuts++}}
   else{p=Math.max(0,p-down*dt);if(p<=S.cin)on=true}}
  if(on)onT+=dt;peak=Math.max(peak,t>warm?p:0);if(Math.round(t/dt)%4===0)pts.push([t,p])}
 return {pts,cut,peak,cph:cuts*60/50,onPct:onT/60*100,Tin:B.Tsat(S.cin),Tout:B.Tsat(cut),Tpk:B.Tsat(peak),safety:S.plug&&peak>=15,up}};
/* one-pipe system sketch */
const onePipe=(o={})=>{let s=`<path d="M10 350 H710" stroke="#8a7f70" stroke-width="4"/>`;
 s+=B.pipe("M140 150 V60 H640 V300",B.STM,10)+B.flow("M140 150 V60 H640 V300",true,2)+B.pipe("M640 300 V330 H210 V300",B.COND,8);
 s+=B.pipe("M330 60 V200",B.STM,8)+B.pipe("M500 60 V200",B.STM,8)+B.rad(300,140,6,64,true)+B.rad(470,140,6,64,true)+B.vent(378,140)+B.vent(548,140)+B.vent(610,55);
 s+=B.boiler(80,150,130,190,{steam:true,lvl:.55,name:"BOILER"});
 if(o.labels!==false)s+=B.L(400,44,"STEAM MAIN (PITCHED)",{fill:"#6c7a84"})+B.co(610,22,580,22,"MAIN VENT",{a:"end"})+B.co(370,110,320,100,"RADIATOR VENT",{a:"end"})+B.L(430,322,"CONDENSATE RETURNS BY GRAVITY",{fill:B.COND});
 return s};
const steps=[
 {t:"Low-pressure steam heat",
  body:`<p>A steam boiler boils water. The steam rises through the <b>main</b> to the radiators, gives up its heat, and turns back into water (<b>condensate</b>), which runs back to the boiler by gravity. No pump.</p><p>Each pound of steam that condenses gives up about <b>970 Btu</b>. That's its <b>latent heat</b>, and it's why so little steam heats so much.</p><p>House and most building heating steam runs at very low pressure: <b>ounces to about 2 psi</b>. That's enough to push steam to the far end of the main.</p>`,
  draw:()=>onePipe()},
 {t:"One-pipe and two-pipe",
  body:`<ul><li><b>One-pipe</b>: one pipe to each radiator. Steam goes up it and condensate runs back down the same pipe. Each radiator has an <b>air vent</b>; the supply valve must be wide open or closed, never in between.</li><li><b>Two-pipe</b>: steam in one pipe, condensate out another. A <b>steam trap</b> on each radiator outlet lets air and water out but holds steam in, and the condensate drains to a <b>dry return</b>.</li></ul>`,
  draw:()=>K.cards([{t:"ONE-PIPE",c:"#6c7a84",inner:B.rad(110,40,6,80,true)+B.pipe("M104 112 H40 V150",B.STM,7)+`<path d="M60 116 H96" stroke="${B.COND}" stroke-width="3" stroke-dasharray="6 4"/>`+B.vent(188,40)+B.valve(70,112)+B.L(270,60,"VENT ON",{a:"middle",size:12})+B.L(270,76,"THE RADIATOR",{a:"middle",size:12}),note:"steam up, water down, same pipe"},
   {t:"TWO-PIPE",c:"#6c7a84",inner:B.rad(110,40,6,80,true)+B.pipe("M110 50 H40 V150",B.STM,7)+B.pipe("M196 112 H250 V150",B.COND,6)+B.trap(0,250,108,.42)+B.valve(70,50)+B.L(280,60,"TRAP ON",{a:"middle",size:12})+B.L(280,76,"THE OUTLET",{a:"middle",size:12}),note:"steam in, condensate out through a trap"}],{h:200})},
 {t:"Pressure and steam temperature",
  body:`<p>Steam's temperature is fixed by its pressure. At sea level:</p><ul><li><b>0 psig</b>: 212°F</li><li><b>2 psig</b>: about 219°F</li><li><b>15 psig</b>: about 250°F</li></ul><p>A few psi barely changes the temperature, but it makes steam denser and slows how fast it moves. Running a heating system at higher pressure doesn't heat better; it short-cycles, wastes fuel and can push water up into the mains.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:260,X:[0,15],Y:[210,252],xt:[0,3,6,9,12,15],xf:v=>v+" psig",yt:[210,220,230,240,250],yf:v=>v+"°F",title:"SATURATED STEAM: PRESSURE AND TEMPERATURE",xl:"boiler pressure",
   series:[{f:B.Tsat,c:"#6c7a84",n:60}],bands:[{y0:210,y1:252,c:"#2f6fd6"}].slice(0,0),vlines:[{x:2,c:"var(--ok)",lbl:"house steam stays here"}],dots:[{x:0,y:212,c:"#d23a26",lbl:"212°F",dx:10,dy:22},{x:2,y:B.Tsat(2),c:"#d23a26",lbl:K.f1(B.Tsat(2))+"°F",dx:10,dy:22},{x:15,y:B.Tsat(15),c:"#d23a26",lbl:K.f1(B.Tsat(15))+"°F",a:"end",dx:-12,dy:-12}]})},
 {t:"The pressuretrol",
  body:`<p>The <b>pressuretrol</b> turns the burner off when steam pressure reaches the <b>cut-out</b> and back on when it falls to the <b>cut-in</b>. It sits on a <b>pigtail</b>, a looped pipe that holds water so live steam never reaches the switch.</p><p>Read the scale on the one you have: on some (like the boiler trainer's) the main is the cut-in and the differential adds to it; on others (Honeywell L404) the main is the cut-out and the differential subtracts.</p><p>For a house: cut-out around <b>1.5 to 2 psi</b>. The <b>15 psi safety valve</b> is the backup if the pressuretrol fails, and a plugged pigtail is a classic way it fails.</p>`,
  draw:()=>{let s=B.pH(40,680,350,24)+`<g transform="translate(220 322) scale(1.8)">`+B.ptrol(0,0,{m:-8})+`</g>`+B.gauge(580,160,64,1.5,3,"PSI 0 to 3",{red:2});
   s+=B.pV(580,228,338,6,"url(#zBrass)")+`<circle cx="580" cy="270" r="10" fill="none" stroke="#7a5414" stroke-width="5"/><circle cx="580" cy="270" r="10" fill="none" stroke="#c9a24a" stroke-width="3"/>`;
   s+=B.co(260,220,320,190,"SWITCH OPENS AT CUT-OUT",{a:"start"})+B.co(206,308,150,300,"PIGTAIL HOLDS WATER",{a:"end"})+B.L(360,378,"STEAM HEADER",{size:12})+B.L(566,300,"LOW-PRESSURE GAUGE",{a:"end",size:13});
   return s}},
 {t:"Water line and venting",
  body:`<p>The <b>gauge glass</b> (sight glass) shows the boiler water level. The <b>normal water line</b> is marked on the boiler. While steaming, the level drops because some of the water is out in the pipes as steam and condensate; it comes back after the burner stops.</p><p>Steam can't fill a pipe that's full of air. <b>Main vents</b> at the end of each main let the air out fast so steam reaches every radiator at once; <b>radiator vents</b> close when hot steam reaches them.</p><p>Slow or plugged vents mean uneven heat and long burner runs.</p>`,
  draw:()=>onePipe({labels:false})+B.co(610,22,580,22,"MAIN VENT: AIR OUT FAST",{a:"end"})+B.L(470,232,"RADIATOR VENTS CLOSE",{})+B.L(470,252,"WHEN STEAM REACHES THEM",{})+B.co(150,252,230,292,"WATER LINE: WATCH THE GLASS",{a:"start"})}];
const see=K.see({init:{cin:0.5,diff:3,load:60,plug:false},
 sliders:[["cin","Cut-in",0.25,3,0.25,v=>K.f2(v)+" psi"],["diff","Differential",0.5,5,0.25,v=>K.f2(v)+" psi"],["load","Radiators connected vs boiler size",40,110,5,v=>v+"%"]],
 checks:[["plug","Pigtail plugged (pressuretrol sees 0)"]],
 model:run,
 draw:(R,S)=>{let s=K.chart({x:70,y:40,w:420,h:270,X:[0,60],Y:[0,S.plug?18:Math.max(3,Math.ceil(R.cut+0.6))],xt:[0,10,20,30,40,50,60],xf:v=>v,yt:S.plug?[0,5,10,15]:[...Array(Math.max(3,Math.ceil(R.cut+0.6))+1).keys()],yf:v=>v+"",title:"BOILER PRESSURE, PSIG, OVER ONE HOUR",xl:"minutes",
   bands:S.plug?[{y0:15,y1:16,c:"#d0312d",lbl:"SAFETY VALVE 15 PSI"}]:[{y0:S.cin,y1:R.cut,c:"#9a6f1f"}],series:[{pts:R.pts,c:"#6c7a84",w:3}]});
  s+=K.txt(280,374,"cut-in "+K.f2(S.cin)+" psi, cut-out "+K.f2(R.cut)+" psi");
  s+=B.ptrol(600,250,{m:S.plug?592:600})+B.pH(520,690,262,14)+(S.plug?`<rect x="590" y="222" width="20" height="14" rx="3" fill="#6b5236"/>`:"")+B.gauge(600,90,44,R.peak,S.plug?30:5,S.plug?"PSI 0 to 30":"PSI 0 to 5",{red:S.plug?15:R.cut});
  s+=B.L(600,154,"PEAK "+B.oz(R.peak),{size:13,fill:R.safety?"var(--bad)":null})+B.L(600,300,"PRESSURETROL",{size:12})+B.L(600,320,S.plug?"SEES 0: NEVER CUTS OUT":"BURNER "+K.f0(R.onPct)+"% ON",{size:12,fill:S.plug?"var(--bad)":null});
  return s},
 reads:(R,S)=>[["Cut-out",K.f2(R.cut)+" psi"],["Steam at cut-out",K.f1(R.Tout)+"°F"],["Peak pressure",B.oz(R.peak),R.peak>3],["Burner cycles",K.f1(R.cph)+" per hour",R.cph>6],["Burner on",K.f0(R.onPct)+"%"],["Safety valve",R.safety?"LIFTING":"closed",R.safety]],
 note:(R,S)=>S.plug?(R.safety?"The pressuretrol never sees the pressure, so the burner ran until the 15 psi safety valve lifted.":"The pressuretrol never sees the pressure. Pressure keeps climbing toward the 15 psi safety valve; with less load it gets there faster."):S.load>=100?"Boiler and radiators matched: on a design day it runs nonstop at a few ounces. That's normal.":R.cut>2?"Cut-out over 2 psi: more than a house system needs.":R.cph>6?"Short cycling: the boiler is much bigger than the radiators it feeds.":"",
 log:[["Cut-in",(R,S)=>K.f2(S.cin)],["Cut-out",R=>K.f2(R.cut)],["Load",(R,S)=>S.load+"%"],["Peak",R=>B.oz(R.peak)],["Cycles/h",R=>K.f1(R.cph)]]});
const tasks=[
 K.goal({t:"Set a house pressuretrol",intro:"Set a typical residential setting: <b>cut-in 0.5 psi</b> and a <b>cut-out of 2 psi or less</b> (at least 0.75 psi differential so it doesn't chatter).",
  check:(S,R)=>S.plug?"Clear the plugged pigtail.":Math.abs(S.cin-0.5)>0.01?"Set the cut-in to 0.5 psi.":S.diff<0.75?"Give it at least 0.75 psi of differential.":R.cut>2?`Cut-out is ${K.f2(R.cut)} psi. Bring the differential down.`:true,ok:(S,R)=>`Cut-out ${K.f2(R.cut)} psi: steam at ${K.f1(R.Tout)}°F. Plenty for a house.`}),
 K.goal({t:"Plug the pigtail",intro:"Check <b>Pigtail plugged</b> and press <b>Log reading</b> once the pressure reaches the safety valve.",
  check:(S,R,L)=>L.some(r=>r.S.plug&&r.R.safety)?true:"Log a reading with the pigtail plugged and the safety valve lifting.",ok:"The burner ran to 15 psi and the safety valve saved it. Clean the pigtail every year; it fills with scale and sludge."}),
 K.goal({t:"A boiler sized to its radiators",intro:"Set the radiators to <b>100% or more</b> of the boiler's size (a design-day load on a right-sized boiler) and confirm the pressure stays in <b>ounces</b> with <b>no burner cycles</b>.",
  check:(S,R)=>S.plug?"Clear the plugged pigtail.":S.load<100?"Set the load to 100% or more.":R.cph>0||R.peak>=1?"The burner is still cycling or the pressure is over 1 psi.":true,ok:(S,R)=>`Peak ${B.oz(R.peak)}, burner on the whole time. A steam system matched to its boiler barely builds pressure.`})];
window.LESSON={id:"boil-steam",sec:"Boiler",secHref:"/boiler-trainer/",title:"Steam basics: one-pipe and two-pipe",lead:"How low-pressure steam heats with ounces of pressure, one-pipe versus two-pipe, the pressuretrol, the gauge glass and the vents.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders, then press Check.",tasks,
 job:K.job({read:["<b>Steam pressure</b> on a low-pressure gauge (0 to 3 or 0 to 5 psi), not just the 0 to 30 psi gauge.","<b>Pressuretrol settings</b>: which scale is the main, and the differential.","<b>Gauge glass</b>: level cold and while steaming, and whether it bounces.","<b>Main vents and radiator vents</b>: hissing then closing, or stuck shut."],
  table:[["Reading","Typical house system","Act when"],["Operating pressure","Ounces to 2 psi","Over 2 psi: check pressuretrol, pigtail, vents"],["Safety valve","15 psi","Lifts: pressuretrol or pigtail failed"],["Gauge glass","At the normal water line when cold","Low or empty: find the leak; bouncing: dirty water, clean the boiler"],["Burner cycles","Long runs on cold days","Short cycling: oversized boiler or slow vents"]],
  safety:["Steam at even 2 psi is above 212°F. Let the boiler cool before opening any steam fitting.","Never plug a vent or a pigtail, or jumper a pressuretrol.","If the gauge glass is empty on a hot boiler, shut off the burner and let it cool before adding water."],
  mistakes:["Turning the pressuretrol up to fix uneven heat: venting is almost always the real fix.","Reading ounces on a 0 to 30 psi gauge: get a low-pressure gauge.","Throttling a one-pipe radiator valve: water can't get back down past the steam."]}),
 sources:[["The Engineering Mindset: steam heating system basics","https://theengineeringmindset.com/steam-heating-system-basics/"],["Honeywell L404 Pressuretrol controller instructions","https://www.cochranesupply.com/media/assets/product/documents/Honeywell/L404F1060.pdf"],["Peerless: two-pipe steam systems guide","https://www.peerlessboilers.com/wp-content/uploads/2018/01/TwoPipeSteam.pdf"]]};
})();
