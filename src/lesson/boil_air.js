/* ============ Lesson: Air elimination ============ */
(()=>{
const C0=B.air(50,0);   // fresh tap water: saturated with air at 50°F and atmospheric pressure, mL/L
const GAL=3.785;
const model=S=>{const fill=B.fill(S.h),dp=S.head*0.433,sep=fill,top=fill+(S.tw?-0.5:0.5)*dp-0.433*S.h,pin=fill-(S.tw?dp:0);
 const cs=B.air(S.T,sep),ct=B.air(S.T-10,Math.max(-14,top));return {fill,dp,sep,top,pin,cs,ct,rel:Math.max(0,C0-cs)*GAL,relTop:Math.max(0,cs-ct)*GAL,suck:top<0,low:top<4}};
/* small building section with boiler, separator, tank and pump in either spot */
const scene=(R,S)=>{const h=S.h,top=330-h*4.5;let s=`<path d="M10 340 H710" stroke="#8a7f70" stroke-width="4"/><rect x="290" y="${top}" width="200" height="${330-top}" fill="rgba(233,228,214,.25)" stroke="#a89a85" stroke-width="1.5"/>`;
 for(let y=top+45;y<322;y+=45)s+=`<path d="M290 ${y} H490" stroke="#a89a85" stroke-width="2"/>`;
 const sup=`M110 196 V150 H456 V${top+36} H428`,ret=`M336 ${top+36} H320 V310 H160`;
 s+=B.pipe(sup,B.HOT,8)+B.flow(sup)+B.pipe(ret,B.RET,8)+B.flow(ret)+B.rad(332,top+3,7,38,true)+B.vent(423,top+3,{puff:R.suck});
 s+=B.boiler(40,196,120,144,{name:"BOILER"});
 s+=`<rect x="175" y="124" width="30" height="52" rx="12" fill="url(#zSteel)" stroke="#3f474c"/>`+B.vent(190,124)+B.pipe("M190 176 V204",B.HOT,6)+B.tank(190,216,40,70,.25,{hang:true});
 s+=S.tw?B.pump(250,310):B.pump(250,150);
 if(R.rel>0)s+=[0,1,2].map(k=>`<circle cx="${185+k*5}" cy="${166-k*12}" r="${2+k*.6}" fill="#e9f4fb" stroke="#6aa6d6" class="lsBub" style="animation-delay:${k*.5}s"/>`).join("");
 s+=K.tag(150,80,"SEPARATOR + TANK "+K.f1(R.sep)+" PSI",{w:220})+K.tag(250,S.tw?366:200,(S.tw?"PUMP SUCTION ":"PUMP OUT ")+K.f1(S.tw?R.pin:R.fill+R.dp)+" PSI",{w:158})+K.tag(390,top-40,"TOP "+K.f1(R.top)+" PSI",{fill:R.suck?"var(--bad)":R.low?"var(--warn)":"var(--ok)",w:120});
 /* air capacity bars, mL per gallon */
 const bx=520,by=70,bw=180,bh=200,mx=110,bar=(i,v,c,t)=>{const hh=Math.min(1,v/mx)*bh;return `<rect x="${bx+14+i*58}" y="${by+bh-hh}" width="40" height="${hh}" fill="${c}" rx="3"/>`+K.txt(bx+34+i*58,by+bh-hh-6,K.f0(v))+B.L(bx+34+i*58,by+bh+18,t,{size:11})};
 s+=`<rect x="${bx}" y="${by-36}" width="${bw}" height="${bh+70}" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+B.L(bx+bw/2,by-14,"AIR WATER CAN HOLD",{size:12})+K.txt(bx+bw/2,by+4,"mL per gallon");
 s+=bar(0,C0*GAL,"#5a9bd4","TAP")+bar(1,R.cs*GAL,"#d23a26","AT SEP.")+bar(2,R.ct*GAL,"#9b4fb8","AT TOP");
 return s};
const steps=[
 {t:"Where the air comes from",
  body:`<p>Air in a hot water system causes most of the noise and no-heat calls: <b>gurgling</b> pipes, cold top radiators, a noisy pump. The oxygen in it also rusts iron parts.</p><p>It gets in three ways:</p><ul><li>Air left in the pipes when the system was filled.</li><li><b>Dissolved air</b> in fresh water. Tap water holds about 2% air by volume that you can't see.</li><li>Air pulled in through vents and fittings anywhere the pressure drops <b>below atmospheric</b>.</li></ul>`,
  draw:()=>{let s=`<path d="M20 330 H700" stroke="var(--line)" stroke-dasharray="2 4"/>`;
   s+=B.rad(60,180,8,110,false)+`<rect x="64" y="186" width="108" height="34" fill="#e9eef2" opacity=".85"/>`+B.L(118,170,"COLD AT THE TOP",{fill:"var(--cold)"})+B.L(118,316,"RADIATOR WITH AN AIR POCKET",{size:13});
   s+=`<rect x="290" y="150" width="140" height="150" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+B.L(360,176,"TAP WATER")+`<rect x="320" y="190" width="80" height="94" rx="4" fill="#5a9bd4" opacity=".35"/>`+[0,1,2,3,4,5,6,7].map(k=>`<circle cx="${330+(k*23)%66}" cy="${200+(k*31)%78}" r="2" fill="#fff" stroke="#6aa6d6"/>`).join("")+B.L(360,320,"ABOUT "+K.f1(C0/10)+"% AIR DISSOLVED",{size:13});
   s+=B.pipe("M500 150 H690",B.HOT,10)+B.vent(600,145,{puff:true})+K.arrow("M640 100 L606 118","var(--bad)")+B.L(600,70,"BELOW 0 PSI:",{fill:"var(--bad)"})+B.L(600,90,"VENTS PULL AIR IN",{fill:"var(--bad)"});
   return s}},
 {t:"Hot water at low pressure lets air go",
  body:`<p>How much air water can hold depends on two things (<b>Henry's law</b>):</p><ul><li><b>Temperature</b>: hotter water holds less.</li><li><b>Pressure</b>: lower pressure holds less.</li></ul><p>So water releases air where it is <b>hottest</b> and the pressure is <b>lowest</b>. Fresh water at 50°F, heated to 180°F at 12 psi, lets go of about a third of its air. That's where you want to catch it: right at the boiler outlet.</p>`,
  math:`<p>Dissolved air is proportional to the air's own pressure: absolute pressure minus the water's vapor pressure. Near boiling the vapor pressure takes up almost all of it, so almost no air stays dissolved.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:260,X:[40,220],Y:[0,100],xt:[40,80,120,160,200],xf:v=>v+"°F",yt:[0,25,50,75,100],yf:v=>v+"",title:"AIR WATER CAN HOLD, mL PER LITER",xl:"water temperature",
   series:[{f:T=>B.air(T,30),c:"#2f6fd6",lbl:"30 psi",lblAt:120,dy:-8},{f:T=>B.air(T,12),c:"#9b4fb8",lbl:"12 psi",lblAt:120,dy:-8},{f:T=>B.air(T,0),c:"#d23a26",lbl:"0 psi",lblAt:120,dy:22}],dots:[{x:50,y:C0,c:"#5a9bd4",lbl:"tap water",dy:-14},{x:180,y:B.air(180,12),c:"#9b4fb8",lbl:"180°F, 12 psi",dy:-16,a:"start"}]})},
 {t:"The point of no pressure change",
  body:`<p>The <b>expansion tank</b> sets the pressure where it connects. The pump can't change the pressure at that spot, so it's called the <b>point of no pressure change</b>.</p><ul><li>Everything the pump pushes <b>toward</b> (its discharge) goes <b>up</b> by the pump's pressure.</li><li>Everything on its <b>suction</b> side goes <b>down</b>.</li></ul><p>Put the pump right after the tank, <b>pumping away</b>, and the whole system runs above fill pressure. Pump toward the tank and the system drops below it, maybe below 0 psi at the top.</p>`,
  draw:()=>{const a=model({h:30,head:20,T:180,tw:false}),b=model({h:30,head:20,T:180,tw:true});
   const mini=(x,R,tw,t,c)=>{let s=`<rect x="${x}" y="20" width="330" height="330" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+B.L(x+165,46,t,{fill:c});
    s+=B.pipe(`M${x+60} 280 V110 H${x+270} V280 H${x+60}`,B.HOT,7)+B.tank(x+60,300,28,46,.3,{hang:true})+B.L(x+60,368,"",{});
    s+=tw?B.pump(x+160,280):B.pump(x+120,110);
    s+=K.tag(x+60,262,"TANK "+K.f0(R.fill),{w:80})+K.tag(x+165,170,"TOP "+K.f1(R.top)+" PSI",{fill:R.top<0?"var(--bad)":"var(--ok)",w:130})+K.tag(x+165,226,(tw?"PUMP IN ":"PUMP OUT ")+K.f1(tw?R.pin:R.fill+R.dp),{w:140});
    return s};
   return mini(20,a,false,"PUMPING AWAY","var(--ok)")+mini(370,b,true,"PUMPING TOWARD THE TANK","var(--bad)")+K.txt(360,372,"30 ft building, 17 psi fill, pump making 20 ft of head (8.7 psi)")}},
 {t:"Air separators",
  body:`<p>An <b>air separator</b> is a wide body in the supply pipe. Water slows down inside it, and the bubbles rise to an <b>automatic vent</b> on top instead of riding along. Modern <b>microbubble</b> separators have a mesh inside that the tiny bubbles stick to and grow on.</p><p>Where to put it:</p><ul><li>On the <b>boiler outlet</b>, where the water is hottest.</li><li>Before the pump, at the <b>lowest pressure</b>: the expansion tank usually connects right below it.</li></ul><p>After the water has passed through a few times, it can't let go of air anywhere else in the system.</p>`,
  draw:()=>{let s=B.pipe("M40 210 H260",B.HOT,22)+B.pipe("M460 210 H680",B.HOT,22)+B.flow("M40 210 H260")+B.flow("M460 210 H680");
   s+=`<g filter="url(#zShadow)"><rect x="260" y="120" width="200" height="190" rx="40" fill="url(#zSteel)" stroke="#3f474c"/></g><rect x="276" y="136" width="168" height="158" rx="30" fill="#e9eef2"/><rect x="276" y="176" width="168" height="118" rx="20" fill="url(#bkHotW)" opacity=".5"/>`;
   for(let i=0;i<9;i++)s+=`<path d="M${292+i*17} 184 V286" stroke="#7d868c" stroke-width="1.4"/>`;for(let j=0;j<6;j++)s+=`<path d="M284 ${192+j*17} H436" stroke="#7d868c" stroke-width="1"/>`;
   s+=[0,1,2,3,4,5].map(k=>`<circle cx="${300+k*26}" cy="${250-(k%3)*20}" r="${2.5+k%2}" fill="#fff" stroke="#6aa6d6" class="lsBub" style="animation-delay:${k*.3}s"/>`).join("");
   s+=`<rect x="352" y="96" width="16" height="24" fill="url(#zBrass)" stroke="#6a4a12"/>`+B.vent(360,96,{puff:true})+B.pipe("M360 310 V330",B.HOT,10)+`<rect x="350" y="330" width="20" height="12" fill="url(#zBrass)"/>`;
   s+=B.co(366,62,430,52,"AUTOMATIC VENT",{a:"start"})+B.co(436,190,520,104,"MESH: MICROBUBBLES",{a:"start"})+B.L(524,126,"COLLECT AND RISE",{a:"start"})+B.L(150,180,"FROM THE BOILER",{fill:B.HOT})+B.L(570,180,"TO THE PUMP",{fill:B.HOT})+B.co(370,338,430,350,"EXPANSION TANK CONNECTS HERE",{a:"start"});
   return s}},
 {t:"Vents at the high points",
  body:`<p>Air that gets past the separator collects at <b>high points</b>: the top of risers, radiators and baseboard loops.</p><ul><li><b>Automatic float vent</b>: when air collects, the float drops and opens a tiny valve. Water lifts the float and closes it. Leave the cap loose or it can't vent.</li><li><b>Manual vent</b> (coin or key vent) on radiators and baseboard: open it until water spits, then close it.</li></ul><p>A vent only works where the pressure is <b>above 0 psi</b>. Below that it pulls air <b>in</b>, which is why pumping away and enough fill pressure matter.</p>`,
  draw:()=>{let s=`<g transform="translate(110 30)"><rect x="40" y="40" width="120" height="220" rx="24" fill="url(#zSteel)" stroke="#3f474c" filter="url(#zShadow)"/><rect x="54" y="56" width="92" height="190" rx="16" fill="#e9eef2"/><rect x="54" y="150" width="92" height="96" fill="url(#bkHotW)" opacity=".55"/>`;
   s+=`<rect x="74" y="130" width="52" height="44" rx="14" fill="url(#zSteel)" stroke="#333"/><path d="M100 130 L100 70" stroke="#333" stroke-width="3"/><path d="M90 66 h20" stroke="#333" stroke-width="3"/><rect x="92" y="20" width="16" height="22" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="88" y="260" width="24" height="26" fill="url(#zBrass)" stroke="#6a4a12"/></g>`;
   s+=B.co(236,180,300,190,"FLOAT DROPS WHEN AIR",{a:"start"})+B.L(304,212,"COLLECTS, OPENING THE VALVE",{a:"start"})+B.co(210,96,300,110,"VALVE AND LOOSE CAP",{a:"start"})+B.L(210,346,"AUTOMATIC FLOAT VENT");
   s+=B.rad(500,200,7,110,false)+`<rect x="586" y="208" width="10" height="10" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/>`+B.co(596,212,650,160,"COIN VENT",{a:"end",dy:-6})+B.L(550,346,"MANUAL VENT ON A RADIATOR");
   return s}}];
const see=K.see({init:{h:30,head:20,T:180,tw:true},
 sliders:[["h","Height to the top radiator",10,60,1,v=>v+" ft"],["head","Pump head",4,30,1,v=>v+" ft ("+K.f1(v*0.433)+" psi)"],["T","Water leaving the boiler",100,200,5,v=>v+"°F"]],
 checks:[["tw","Pump on the return, pumping toward the tank"]],
 model, draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Fill pressure (rule)",K.f1(R.fill)+" psi"],["At the separator",K.f1(R.sep)+" psi"],["Top radiator",K.f1(R.top)+" psi",R.low],["Pump adds",K.f1(R.dp)+" psi"],["Released at separator",K.f0(R.rel)+" mL/gal"],["Released at the top",K.f0(R.relTop)+" mL/gal",R.relTop>0]],
 note:(R,S)=>R.suck?"The top of the system is below 0 psi: vents and fittings pull air in. Pump away from the tank.":R.relTop>0?"Water at the top can hold less air than at the separator, so air comes out up there instead.":R.low?"Top of the system is under 4 psi: marginal for venting.":"",
 log:[["Height",(R,S)=>S.h+" ft"],["Pump",(R,S)=>S.tw?"toward":"away"],["Water",(R,S)=>S.T+"°F"],["Top psi",R=>K.f1(R.top)],["Sep mL/gal",R=>K.f0(R.rel)]]});
const tasks=[
 K.goal({t:"Pull the top of the system below 0 psi",intro:"On a <b>30 ft</b> building with a <b>20 ft head</b> pump pumping <b>toward</b> the tank, the top goes negative. Set it up and press <b>Log reading</b>.",
  check:(S,R,L)=>L.some(r=>r.S.tw&&r.S.h>=30&&r.R.top<0)?true:"Log a reading at 30 ft or taller, pumping toward the tank, with the top under 0 psi.",ok:"Below 0 psi the vents at the top pull air in: that's the gurgling, no-heat upstairs call."}),
 K.goal({t:"Fix it by moving the pump",intro:"Keep the <b>30 ft</b> height, the <b>17 psi</b> fill and the <b>20 ft</b> pump. Get the top of the system to <b>4 psi or more</b> without changing the fill.",
  check:(S,R)=>S.h!==30?"Keep the height at 30 ft.":S.head<20?"Keep the pump at 20 ft of head or more.":R.top<4?`Top is ${K.f1(R.top)} psi.`:true,ok:(S,R)=>`Pumping away: the pump adds its pressure to the system instead of pulling it down. Top of the system ${K.f1(R.top)} psi.`}),
 K.goal({t:"See Henry's law at the separator",intro:"Same building and pump. Log the separator at <b>120°F</b> or cooler, then at <b>180°F</b> or hotter, and compare how much air it lets go.",
  check:(S,R,L)=>{const c=L.find(r=>r.S.T<=120),h=L.find(r=>r.S.T>=180&&c&&r.S.h===c.S.h);return c&&h?true:!c?"Log a reading at 120°F or cooler.":"Now log one at 180°F or hotter at the same height."},ok:"Hot water lets go of far more air. That's why the separator goes on the boiler outlet, not on the cool return."})];
window.LESSON={id:"boil-air",sec:"Boiler",secHref:"/boiler-trainer/",title:"Air elimination",lead:"Where air in a hot water system comes from, why hot low-pressure water lets it go, and where separators, vents and the pump belong.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders, then press Check.",tasks,
 job:K.job({read:["<b>Boiler pressure</b> cold and hot, and the <b>height</b> to the top radiator.","<b>Where the expansion tank connects</b> and which way the pump pushes from there.","<b>Automatic vent caps</b>: loose, and not dripping.","<b>Sounds</b>: gurgling at the top, a pump that sounds like gravel."],
  table:[["What you find","What it means"],["Top radiators cold, gurgling","Air at high points, or the top is near 0 psi"],["Pump noise like gravel","Cavitation: suction pressure too low, often pumping toward the tank"],["Auto vent dripping water","Dirt in the vent seat: clean or replace"],["Air every few days","Water is being added: find the leak; fresh water brings air and oxygen"],["Vent cap screwed down tight","Vent can't vent: back it off one turn"]],
  steps:["Make sure the fill pressure is right for the building height.","Bleed manual vents from the bottom floor up, with the pump off so air collects at the vents.","Check that the separator is on the boiler outlet with its vent cap loose.","If air keeps coming back, check whether the pump is pumping away from the tank, and look for leaks that bring in fresh water."],stepsT:"Getting rid of air",
  safety:["Bleed water is hot. Hold a rag or cup at the vent and keep your face away.","Don't open vents on a system that's below 0 psi at that point: you'll let more air in."],
  mistakes:["Putting the separator on the return, where the water is coolest.","Pumping toward the tank, then fighting air at the top forever.","Leaving a fill valve open and adding fresh, air-filled water every day to make up for a leak."]}),
 sources:[["The Engineering Mindset: boiler system explained","https://theengineeringmindset.com/boiler-system-explained-lthw/"],["Taco: air elimination guide","https://inspectapedia.com/heat/Air-Elimination-Guide-TACO.pdf"],["HeatingHelp: troubleshooting air and compression tanks","https://heatinghelp.com/systems-help-center/troubleshooting-air-and-compression-tanks/"],["Caleffi idronics 12: hydronic fundamentals","https://www.caleffi.com/sites/default/files/media/external-file/Idronics_12_NA_Hydronic%20fundamentals%20.pdf"]]};
})();
