/* ============ Lesson: Expansion tank and fill pressure ============ */
(()=>{
const TANKS=[[2.0,"2.0 gal (#15)"],[4.4,"4.4 gal (#30)"],[7.6,"7.6 gal (#60)"],[14,"14 gal (#90)"]];
const VSYS=40,A=B.ATM;
/* Boyle's law on the tank's air: returns hot pressure, expansion volume and how much of the tank holds water */
const tankP=o=>{const Vt=o.Vt,dV=VSYS*B.exp(50,o.T);let Vg0,P0;
 if(o.logged){Vg0=Vt*0.04;P0=o.fill}else if(o.pp>=o.fill){Vg0=Vt;P0=o.pp}else{Vg0=Vt*(o.pp+A)/(o.fill+A);P0=o.fill}
 const Vw0=Vt-Vg0;let P=Vg0-dV>0.002?(P0+A)*Vg0/(Vg0-dV)-A:999;if(dV<=0)P=o.fill;P=Math.max(o.fill,P);
 const relief=P>=30,Ps=Math.min(P,30),Vg=Vg0*(P0+A)/(Math.max(Ps,P0)+A);
 return {dV,P,Ps,relief,Vw0,wfCold:Vw0/Vt,wf:Math.min(1,(Vt-Vg)/Vt),dump:relief?Math.max(0,dV-(Vg0-Vg0*(P0+A)/(30+A))):0}};
const building=(h,o={})=>{const top=330-h*4.5;let s=`<path d="M10 340 H710" stroke="#8a7f70" stroke-width="4"/>`;
 s+=`<rect x="40" y="${top}" width="220" height="${330-top}" fill="rgba(233,228,214,.25)" stroke="#a89a85" stroke-width="1.5"/>`;
 for(let y=top+45;y<322;y+=45)s+=`<path d="M40 ${y} H260" stroke="#a89a85" stroke-width="2"/>`;
 s+=B.pipe(`M330 316 H230 V${top+38}`,B.HOT,7)+B.rad(160,top+3,5,40,false)+B.pipe(`M230 ${top+38} H226`,B.HOT,7)+B.vent(166,top+3);
 s+=`<path d="M60 330 V${top+38}" stroke="var(--muted)" stroke-width="1.4"/><path d="M54 330 h12 M54 ${top+38} h12" stroke="var(--muted)" stroke-width="1.4"/>`;
 s+=K.tag(68,(330+top+38)/2+6,K.f0(h)+" FT",{a:"start",w:52});return s};
const scene=(R,S)=>{const h=S.h,top=330-h*4.5;let s=building(h);
 s+=B.boiler(330,200,110,140,{name:"BOILER",fire:S.T>60});
 s+=B.pipe("M440 322 H500 V292",B.HOT,7)+B.tank(500,160,54,120,R.wf,{burst:S.logged})+B.relief(360,194,{s:.7,open:R.relief})+B.gauge(410,180,20,R.Ps,60,"PSI",{red:30});
 s+=B.L(500,130,"TANK "+TANKS[S.tk][0]+" GAL",{size:12})+B.L(500,148,S.logged?"WATERLOGGED":"AIR "+K.f1(S.pp)+" PSI",{size:12,fill:S.logged?"var(--bad)":null});
 s+=B.L(150,top-42,S.fill-0.433*h<0?"TOP: BELOW 0 PSI":"TOP: "+K.f1(S.fill-0.433*h)+" PSI COLD",{fill:S.fill-0.433*h<4?"var(--bad)":"var(--ok)"});
 s+=B.box(560,40,150,64,"FILL NEEDED",K.f1(B.fill(h))+" PSI",{vs:20})+B.box(560,116,150,64,"HOT PRESSURE",R.relief?"30+ RELIEF":K.f1(R.P)+" PSI",{vs:20,vc:R.relief?"var(--bad)":R.P>27?"var(--warn)":"var(--ink)",st:R.relief?"var(--bad)":null});
 s+=B.L(635,210,"WATER AT "+S.T+"°F",{size:13})+B.L(635,230,"GREW "+K.f2(R.dV)+" GAL",{size:13});
 return s};
const steps=[
 {t:"Water grows when it's heated",
  body:`<p>Heat water and it takes up more room. From 40°F to 212°F it grows about <b>4%</b>. A 40 gallon house system heated from 50°F to 180°F makes about <b>1.2 gallons</b> of extra water.</p><p>Water can't be squeezed. In a sealed loop that extra water has to go somewhere, or the pressure shoots up until the <b>relief valve</b> opens.</p>`,
  math:`<p>Specific volume from the steam tables: 0.01602 ft³/lb at 40°F, 0.01651 at 180°F, 0.01672 at 212°F.</p><p>0.01672 ÷ 0.01602 = 1.044, so 4.4% bigger at 212°F.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:260,X:[40,220],Y:[0,5],xt:[40,80,120,160,200],xf:v=>v+"°F",yt:[0,1,2,3,4,5],yf:v=>v+"%",title:"HOW MUCH WATER GROWS, STARTING AT 40°F",xl:"water temperature",
   series:[{f:T=>B.exp(40,T)*100,c:"#9b4fb8",lbl:"",n:90}],dots:[{x:180,y:B.exp(40,180)*100,c:"#d23a26",lbl:"180°F: "+K.f1(B.exp(40,180)*100)+"%",a:"end",dx:-10},{x:212,y:B.exp(40,212)*100,c:"#d23a26",lbl:"212°F: "+K.f1(B.exp(40,212)*100)+"%",a:"end",dx:-10}]})},
 {t:"The tank is an air cushion",
  body:`<p>A modern <b>expansion tank</b> is a steel shell with a rubber <b>diaphragm</b> (or bladder) inside. System water is on one side. Air, charged at the factory, is on the other.</p><p>As the water grows, it pushes into the tank and squeezes the air. Air compresses, so the pressure rises only a few psi instead of hitting 30.</p><p>Older systems used a plain steel <b>compression tank</b> up in the joists, half full of water with air on top. Same idea, no diaphragm.</p>`,
  draw:()=>{const c=tankP({Vt:4.4,T:50,fill:12,pp:12}),h=tankP({Vt:4.4,T:180,fill:12,pp:12});const t=(x,R,T,lbl)=>B.tank(x,70,90,200,R.wf)+B.L(x,300,lbl)+B.L(x,322,K.f0(R.Ps)+" PSI",{fill:"var(--brass)",size:16})+B.L(x,46,T);
   return t(200,c,"COLD 50°F","COLD: ALL AIR")+t(540,h,"HOT 180°F","HOT: WATER PUSHED IN")+B.co(242,110,300,110,"AIR (CHARGED TO 12 PSI)",{a:"start"})+B.co(520,250,440,262,"SYSTEM WATER",{a:"end"})+B.co(508,198,440,190,"DIAPHRAGM",{a:"end"})+K.txt(360,360,"40 gal system, 4.4 gal tank")}},
 {t:"Fill pressure comes from the building height",
  body:`<p>Cold <b>fill pressure</b> at the boiler has to lift water to the highest radiator and still leave a few psi up there so air can't get in and vents can work.</p><p>Each foot of water weighs <b>0.433 psi</b>. Add about <b>4 psi</b> for the top of the system:</p><p><b>Fill psi = 0.433 × height in feet + 4</b></p><p>The usual 12 psi setting on a residential fill valve covers about 18 feet. A three-story building needs more.</p>`,
  math:`<p>A foot of water: 62.4 lb over 144 in² = 0.433 psi. That's also why 1 psi lifts water 2.31 ft.</p><p>Example: 30 ft × 0.433 = 13.0 psi, plus 4 = 17 psi.</p>`,
  draw:()=>{const h=30;let s=building(h);s+=B.boiler(330,200,110,140,{name:"BOILER"})+B.gauge(410,180,20,B.fill(h),60,"PSI",{red:30});
   s+=B.L(150,330-h*4.5-42,"TOP: 4 PSI LEFT",{fill:"var(--ok)"})+B.box(480,60,220,72,"0.433 × 30 FT + 4","17 PSI COLD FILL",{vs:20})+B.box(480,150,220,72,"12 PSI FILL VALVE","COVERS ABOUT 18 FT",{vs:18});
   return s}},
 {t:"Pre-charge the tank to the fill pressure",
  body:`<p>The air side should be charged to the <b>fill pressure</b> at the tank. Then the diaphragm sits at the bottom when the system is cold, and the whole tank is ready to take expansion.</p><ul><li><b>Too low</b> (left at the factory 12 psi on a 17 psi system): cold water already pushes in, and part of the tank is used up before the burner even fires.</li><li>Check and set it with the tank <b>isolated and its water side drained to 0 psi</b>, using a tire gauge on the air valve. Reading it on a full system just shows system pressure.</li></ul>`,
  draw:()=>{const a=tankP({Vt:4.4,T:50,fill:17,pp:12}),b=tankP({Vt:4.4,T:50,fill:17,pp:17});const t=(x,R,t1,t2,c)=>B.tank(x,70,90,200,R.wfCold,{})+B.L(x,46,t1,{fill:c})+B.L(x,300,t2)+B.L(x,322,K.f0(R.wfCold*100)+"% FULL OF WATER COLD",{fill:c,size:13});
   return t(190,a,"12 PSI AIR, 17 PSI FILL","TANK ALREADY PART FULL","var(--bad)")+t(450,b,"17 PSI AIR, 17 PSI FILL","DIAPHRAGM AT THE BOTTOM","var(--ok)")+`<rect x="590" y="140" width="60" height="22" rx="4" fill="url(#bkBlackV)"/><rect x="560" y="146" width="34" height="10" fill="url(#zSteelH)"/><text x="620" y="155" class="lsGn" style="fill:#7CFFB2">17.0</text>`+B.L(620,190,"TIRE GAUGE ON",{size:12})+B.L(620,208,"THE AIR VALVE",{size:12})}},
 {t:"The waterlogged tank",
  body:`<p>If the diaphragm ruptures, or the air leaks off over the years, the tank fills with water. With no air cushion:</p><ul><li>Pressure shoots up every time the burner runs, and the <b>relief valve</b> drips or dumps at 30 psi.</li><li>When it cools, pressure drops and the fill valve adds water, so the next cycle is worse.</li><li>Tap the tank: it sounds solid all the way up. Press the air valve: water spits out instead of air.</li></ul><p>Fix: recharge it if it only lost air, or replace it if the diaphragm is broken.</p>`,
  draw:()=>{const g=T=>tankP({Vt:4.4,T,fill:12,pp:12}).Ps,w=T=>tankP({Vt:4.4,T,fill:12,pp:12,logged:true}).Ps;
   return K.chart({x:90,y:40,w:560,h:260,X:[50,190],Y:[0,40],xt:[50,90,130,170],xf:v=>v+"°F",yt:[0,10,20,30],yf:v=>v+" psi",title:"PRESSURE AS THE SYSTEM HEATS (40 GAL, 4.4 GAL TANK)",xl:"water temperature",
    bands:[{y0:30,y1:32,c:"#d0312d",lbl:"RELIEF VALVE OPENS AT 30 PSI"}],series:[{f:g,c:"#1e9a4a",lbl:"good tank",lblAt:150,dy:24},{f:w,c:"#d0312d",lbl:"waterlogged",lblAt:110,a:"start",dx:10,dy:22,n:120}]})}}];
const see=K.see({init:{h:18,fill:12,pp:12,T:180,tk:1,logged:false},
 sliders:[["h","Height to the top radiator",10,50,1,v=>v+" ft"],["fill","Fill valve setting",5,30,0.5,v=>K.f1(v)+" psi"],["pp","Tank air pre-charge",4,30,0.5,v=>K.f1(v)+" psi"],["tk","Tank size",0,3,1,v=>TANKS[v][1]],["T","Water temperature",50,220,5,v=>v+"°F"]],
 checks:[["logged","Tank waterlogged (diaphragm broken)"]],
 model:S=>({...tankP({Vt:TANKS[S.tk][0],T:S.T,fill:S.fill,pp:S.pp,logged:S.logged}),need:B.fill(S.h),top:S.fill-0.433*S.h}),
 draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Fill needed",K.f1(R.need)+" psi"],["Top of system, cold",R.top<0?"below 0 psi":K.f1(R.top)+" psi",R.top<4],["Expansion",K.f2(R.dV)+" gal"],["Hot pressure",R.relief?"30 (relief open)":K.f1(R.P)+" psi",R.relief||R.P>27],["Tank full of water, cold",K.f0(R.wfCold*100)+"%",R.wfCold>0.15],["Relief valve",R.relief?"OPEN":"closed",R.relief]],
 note:(R,S)=>S.logged?"No air cushion: the expansion has nowhere to go.":R.relief?"Pressure reached 30 psi and the relief valve opened. Bigger tank, or check the pre-charge.":R.top<4?"Fill pressure is too low for this height: the top of the system is under 4 psi and can pull in air.":S.pp<S.fill-0.5?"Pre-charge is below the fill pressure: cold water is already in the tank, using up its room.":S.pp>S.fill+0.5?"Pre-charge is above the fill pressure: pressure jumps before the tank takes any water.":"",
 log:[["Height",(R,S)=>S.h+" ft"],["Fill",(R,S)=>K.f1(S.fill)],["Air",(R,S)=>S.logged?"logged":K.f1(S.pp)],["Tank",(R,S)=>TANKS[S.tk][0]],["Hot",R=>R.relief?"30+":K.f1(R.P)]]});
const tasks=[
 K.goal({t:"Set up a three-story building",intro:"The top radiator is <b>30 ft</b> above the boiler. Set the <b>fill pressure</b> by the rule, the <b>tank pre-charge</b> to match it, and pick a tank big enough that the pressure at <b>180°F</b> stays at <b>27 psi or less</b> (3 psi under the relief valve).",
  check:(S,R)=>S.logged?"Uncheck the waterlogged tank.":S.h!==30?"Set the height to 30 ft.":Math.abs(S.fill-B.fill(30))>1?`Fill should be 0.433 × 30 + 4 = ${K.f1(B.fill(30))} psi.`:Math.abs(S.pp-S.fill)>0.5?"Set the pre-charge equal to the fill pressure.":S.T<180?"Heat the water to 180°F.":R.P>27?`Hot pressure is ${R.relief?"over 30":K.f1(R.P)} psi. Try a bigger tank.`:true,ok:(S,R)=>`17 psi fill, 17 psi air, ${TANKS[S.tk][1]} tank: ${K.f1(R.P)} psi hot.`}),
 K.goal({t:"Pre-charge: factory 12 psi vs matched",intro:"Same 30 ft building at 17 psi fill, <b>4.4 gal tank</b>, water at <b>180°F</b>. Log the hot pressure with the <b>factory 12 psi</b> pre-charge, then set the pre-charge to <b>17 psi</b> and log it again.",
  check:(S,R,L)=>{const ok=r=>r.S.h===30&&Math.abs(r.S.fill-17)<=1&&r.S.tk===1&&r.S.T>=180&&!r.S.logged;const lo=L.some(r=>ok(r)&&Math.abs(r.S.pp-12)<=0.5),hi=L.some(r=>ok(r)&&Math.abs(r.S.pp-r.S.fill)<=0.5);
   return lo&&hi?true:!lo?"Log a reading with the pre-charge at 12 psi (30 ft, 17 psi fill, 4.4 gal tank, 180°F).":"Now log one with the pre-charge equal to the fill pressure."},ok:"With 12 psi of air on a 17 psi system the tank is part full before it starts, and the relief valve opens. Matching the pre-charge keeps the same tank under 30 psi."}),
 K.goal({t:"Recreate the waterlogged tank call",intro:"Check <b>Tank waterlogged</b>, heat the water to <b>180°F</b> or more, and press <b>Log reading</b> when the relief valve opens.",
  check:(S,R,L)=>L.some(r=>r.S.logged&&r.S.T>=180&&r.R.relief)?true:"Log a reading with the tank waterlogged, at 180°F or hotter, with the relief open.",ok:"That's the call: relief valve dripping on every burner cycle and the pressure gauge swinging. The tank, not the relief valve, is the problem."})];
window.LESSON={id:"boil-tank",sec:"Boiler",secHref:"/boiler-trainer/",title:"Expansion tank and fill pressure",lead:"Why heated water needs somewhere to go, how to set fill pressure from the building height, and what a waterlogged tank does.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders, then press Check.",tasks,
 job:K.job({read:["<b>Cold pressure</b> at the boiler gauge with the system cool.","<b>Hot pressure</b> at the top of a long burner cycle.","<b>Tank air charge</b>: tank isolated, water side drained to 0 psi, tire gauge on the air valve.","<b>Height</b> from the boiler gauge to the highest radiator or vent."],
  table:[["Reading","Normal","Problem"],["Cold fill","0.433 × height + 4 psi (12 psi for most houses)","Low: air at the top, no heat upstairs"],["Hot rise","A few psi above cold","Up to 30 psi: tank small, low air, or waterlogged"],["Tank air (isolated, drained)","Equal to cold fill","Low or zero: recharge or replace"],["Air valve pressed","Air comes out","Water comes out: diaphragm broken"]],
  steps:["Shut off the burner and let the system cool to near fill temperature.","Close the tank's isolation valve (or the system valves around it) and drain its water side to 0 psi.","Check the air charge with a tire gauge. Pump it to the fill pressure, or replace the tank if water comes out.","Open the valve, check the cold pressure, then run a full cycle and read the hot pressure."],stepsT:"Checking and charging the tank",
  safety:["Expect hot water and full system pressure at the tank fitting. Isolate and drain before removing a tank.","Don't silence a dripping relief valve by plugging it. Find out why the pressure got to 30."],
  mistakes:["Checking the air charge with the tank full of system water: it just reads system pressure.","Leaving the factory 12 psi charge on a building that needs 17 psi.","Replacing a dripping relief valve when the real problem is a waterlogged tank."]}),
 sources:[["The Engineering Mindset: boiler system explained (pressurisation and expansion vessel)","https://theengineeringmindset.com/boiler-system-explained-lthw/"],["Deppmann: expansion tanks and initial cold fill pressure","https://www.deppmann.com/wp-content/uploads/2018/12/RLD_MMM_Expansion-Compression-Tanks-Hydronic-Systems-Initial-Cold-Fill-Pressure.pdf"],["Amtrol Extrol installation and operation manual","https://res.cloudinary.com/dzhpkjoqj/Amtrol/9017-094-01_19-EXTROL-L-Series-IO_tjjpzu.pdf"],["HVAC School: determining the air side charge of an expansion tank","https://www.hvacrschool.com/determining-the-air-side-charge-of-an-expansion-tank"]]};
})();
