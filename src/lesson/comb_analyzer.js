/* ============ Lesson: Reading a combustion analyzer ============ */
(()=>{
const M=S=>CK.comb({ea:S.ea,fuel:S.lp?"lp":"ng",flue:S.flue,air:S.air,imp:S.imp});
const lines=R=>[["O2",K.f1(R.O2)+" %",R.O2<4||R.O2>10],["CO2",K.f1(R.CO2)+" %"],["CO",K.f0(R.com)+" ppm",R.com>100],["CO AF",K.f0(R.coaf)+" ppm",R.coaf>100],["EA",K.f0(R.eaEst)+" %"],["NET T",K.f0(R.net)+" °F"],["EFF",K.f1(R.eff)+" %"]];
/* induced-draft furnace with a test hole in the vent and the analyzer */
const scene=(R,S,o={})=>{let s=CK.floor(352)+CK.furnace(150,150,{w:120,h:200,ind:true,yel:o.yel});
 s+=CK.ventV(210,30,118,10)+CK.fit(210,124,14);
 s+=`<circle cx="210" cy="74" r="3.5" fill="#111"/>`+CK.probe(212,74,420,190);
 s+=CK.analyzer(400,90,lines(R),{w:180});
 s+=CK.co(204,74,110,60,"TEST HOLE",{a:"end"})+CK.L(110,82,"12 TO 18 IN. ABOVE",{a:"end",size:11})+CK.L(110,98,"THE INDUCER",{a:"end",size:11})+CK.co(186,132,110,150,"INDUCER",{a:"end"});
 if(o.imp)s+=`<rect x="170" y="186" width="80" height="40" rx="6" fill="none" stroke="var(--bad)" stroke-width="2.4" stroke-dasharray="4 3"/>`;
 return s};
const ea2=e=>({O2:20.9*e/(100+e)});
const steps=[
 {t:"Where the sample comes from",
  body:`<p>A <b>combustion analyzer</b> pulls flue gas through a probe. Its sensors <b>measure</b> oxygen (O2), carbon monoxide (CO) and the flue temperature. It <b>calculates</b> the rest: CO2, excess air, air-free CO and efficiency.</p><p>Sample the gas <b>before</b> any room air mixes in:</p><ul><li>80% fan-assisted furnace: a small hole in the vent about <b>12 to 18 in. above the inducer</b>.</li><li>Draft-hood appliance: in the flue <b>before</b> the draft hood, not out in the vent where dilution air has joined.</li></ul><p>Zero the analyzer in <b>outdoor air</b> before you start.</p>`,
  draw:()=>{const S={ea:55,flue:390,air:70};return scene(M(S),S)}},
 {t:"O2 and CO2 tell you the air",
  body:`<p>Air is <b>20.9% oxygen</b>. Burning natural gas with exactly the air it needs leaves <b>0% O2</b> and the most CO2 possible, about <b>11.7%</b> (13.7% on propane).</p><p>Burners run with <b>excess air</b> so every bit of gas finds oxygen. The extra air comes out the flue, so <b>O2 goes up and CO2 goes down</b> together. Read either one; they tell the same story.</p><p>A typical natural gas furnace runs about <b>6 to 9% O2</b>: roughly 40 to 75% excess air.</p>`,
  math:`<p>Excess air ≈ O2 ÷ (20.9 − O2). 7% O2: 7 ÷ 13.9 = 0.50, so 50% excess air.</p><p>CO2 = CO2 max × (20.9 − O2) ÷ 20.9. Natural gas at 7% O2: 11.7 × 13.9 ÷ 20.9 = 7.8%.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:260,X:[0,200],Y:[0,21],xt:[0,50,100,150,200],yt:[0,5,10,15,20],xf:v=>v+"%",xl:"excess air",yl:"percent in the flue gas",title:"NATURAL GAS",
   bands:[{y0:6,y1:9,c:"#2f8f3a"}],series:[{f:e=>ea2(e).O2,c:"#2f6fd6",lbl:"O2",lblAt:190,dy:-10},{f:e=>11.7*(20.9-ea2(e).O2)/20.9,c:"#c0392b",lbl:"CO2",lblAt:190,dy:-10}],dots:[{x:0,y:11.7,c:"#c0392b",lbl:"11.7% MAX",dx:10,dy:-8},{x:50,y:ea2(50).O2,c:"#2f6fd6",lbl:"50%: 7.0% O2",dx:10,dy:24}]})+CK.L(644,182,"TYPICAL 6 TO 9% O2",{a:"end",fill:"#2f8f3a",size:12})},
 {t:"CO air-free: take the dilution out",
  body:`<p>Excess air <b>dilutes</b> the flue gas, so the same amount of CO reads lower when more air passes through. To compare fairly, analyzers report <b>CO air-free</b>: what the CO would be with no excess air.</p><p class="lsKey">CO air-free = CO measured × 20.9 ÷ (20.9 − O2)</p><p>Both screens below read 50 ppm, but the right one is really worse. Common limits: under <b>100 ppm air-free</b> on a furnace in service, and <b>400 ppm</b> is the ANSI Z21.47 ceiling for a new furnace.</p>`,
  draw:()=>{const a=(x,o2,t)=>CK.analyzer(x,60,[["O2",K.f1(o2)+" %"],["CO",K.f0(50)+" ppm"],["CO AF",K.f0(CK.coAF(50,o2))+" ppm",CK.coAF(50,o2)>100]],{w:200})+CK.L(x+100,206,t,{size:13});
   return a(90,6,"6% O2: 50 × 20.9 ÷ 14.9")+a(430,12,"12% O2: 50 × 20.9 ÷ 8.9")+CK.L(190,236,"= 70 PPM AIR-FREE",{fill:"#2f8f3a",size:15})+CK.L(530,236,"= 117 PPM AIR-FREE",{fill:"var(--bad)",size:15})+K.txt(360,300,"Opening the air shutter can make the CO reading drop while the burner is no better.")}},
 {t:"Stack temperature and efficiency",
  body:`<p>The probe tip reads the <b>flue temperature</b>. Subtract the <b>combustion air</b> temperature (the room the appliance breathes from) and you get <b>net stack temperature</b>: the heat leaving up the vent.</p><p>The analyzer works out efficiency from net stack and O2. Hotter flue gas, or more excess air carrying heat away, means lower efficiency.</p><p>Rough net stack ranges: natural-draft appliances about 270 to 370°F, 80% fan-assisted furnaces about 170 to 270°F, condensing furnaces about 100°F or less. The manufacturer's figures come first.</p>`,
  math:`<p>Flue loss (Siegert, used by Testo) qA = net stack (°C) × (A2 ÷ (21 − O2) + B). Natural gas A2 = 0.66, B = 0.009.</p><p>Flue 420°F, room 70°F: net 350°F (194°C). At 7% O2: 194 × (0.66 ÷ 14 + 0.009) ≈ 11% loss. US analyzers report on the higher heating value, about 0.9 × (100 − 11) ≈ 80%.</p>`,
  draw:()=>{const e=(net,o2)=>CK.comb({ea:100*o2/(20.9-o2),flue:net+70,air:70}).eff;return K.chart({x:90,y:40,w:560,h:260,X:[100,500],Y:[65,95],xt:[100,200,300,400,500],yt:[65,70,75,80,85,90,95],xf:v=>v+"°F",yf:v=>v+"%",xl:"net stack temperature",yl:"efficiency (HHV)",title:"NATURAL GAS, NON-CONDENSING",
   series:[{f:x=>e(x,6),c:"#2f8f3a",lbl:"6% O2",lblAt:480,dy:-10},{f:x=>e(x,12),c:"#c0392b",lbl:"12% O2",lblAt:480,dy:20}],dots:[{x:350,y:e(350,7),c:"#2f6fd6",lbl:"350°F, 7% O2: ABOUT 80%",a:"start",dx:10,dy:-12}]})}},
 {t:"Reading the whole screen",
  body:`<p>Read the numbers <b>together</b> and wait for them to settle (several minutes of firing):</p><ul><li><b>Low O2, high CO</b>: not enough air. Check the air shutter, lint in the burners, overfiring, a blocked flue or a sooted heat exchanger.</li><li><b>High O2, low efficiency</b>: too much air, or the sample is pulling in room air.</li><li><b>Normal O2 but high CO</b>: the flame is hitting something cold, like a burner out of line touching the heat exchanger (<b>impingement</b>).</li></ul>`,
  draw:()=>K.cards([{t:"NORMAL",c:"#2f8f3a",inner:CK.analyzer(16,36,[["O2","7.0 %"],["CO AF","25 ppm"]],{w:150,h:96})+K.txt(240,80,"blue, steady flame")},
   {t:"NOT ENOUGH AIR",c:"var(--bad)",inner:CK.analyzer(16,36,[["O2","2.0 %",true],["CO AF","900 ppm",true]],{w:150,h:96})+K.txt(240,80,"yellow, sooty")},
   {t:"TOO MUCH AIR",c:"#9a6f1f",inner:CK.analyzer(16,36,[["O2","12.5 %",true],["EFF","74 %",true]],{w:150,h:96})+K.txt(240,80,"heat out the vent")},
   {t:"IMPINGEMENT",c:"var(--bad)",inner:CK.analyzer(16,36,[["O2","7.5 %"],["CO AF","290 ppm",true]],{w:150,h:96})+K.txt(240,80,"flame hits metal")}])}];
const see=K.see({init:{ea:55,flue:420,air:70,lp:false,imp:false},
 sliders:[["ea","Excess air (burner air setting)",0,200,5,v=>v+"%"],["flue","Flue temperature at the probe",200,600,10,v=>v+"°F"],["air","Combustion air temperature",40,95,5,v=>v+"°F"]],
 checks:[["lp","Propane"],["imp","Flame touching the heat exchanger"]],
 model:M,draw:(R,S)=>scene(R,S,{imp:S.imp,yel:R.coaf>400}),
 reads:R=>[["O2",K.f1(R.O2)+" %",R.O2<4||R.O2>10],["CO2",K.f1(R.CO2)+" %"],["CO measured",K.f0(R.com)+" ppm",R.com>100],["CO air-free",K.f0(R.coaf)+" ppm",R.coaf>100],["Excess air",K.f0(R.eaEst)+" %"],["Efficiency",K.f1(R.eff)+" %"]],
 note:(R,S)=>R.coaf>400?"Over 400 ppm air-free: shut it down and find the cause.":R.coaf>100&&S.imp&&R.O2>4?"O2 is normal but CO is high: the flame is hitting the heat exchanger.":R.coaf>100?"Not enough air: CO climbs fast once O2 drops below about 4%.":R.O2>10?"Lots of excess air: CO is low, but heat is going up the vent.":R.O2>=6&&R.O2<=9?"In the usual 6 to 9% O2 range with low CO.":"",
 log:[["EA",R=>K.f0(R.eaEst)],["O2",R=>K.f1(R.O2)],["CO AF",R=>K.f0(R.coaf)],["Eff",R=>K.f1(R.eff)]]});
const tasks=[
 K.goal({t:"Set it up like a tune-up",intro:"Natural gas, no impingement, 70°F room, flue <b>420°F</b>. Set the air so O2 is in the <b>6 to 9%</b> range and CO air-free is under <b>100 ppm</b>.",
  check:(S,R)=>S.lp||S.imp?"Natural gas, no impingement.":S.air!==70||S.flue!==420?"Set 70°F room and 420°F flue.":R.O2<6?`O2 ${K.f1(R.O2)}%: more air.`:R.O2>9?`O2 ${K.f1(R.O2)}%: less air.`:R.coaf>=100?"CO is too high.":true,
  ok:(S,R)=>`O2 ${K.f1(R.O2)}%, CO2 ${K.f1(R.CO2)}%, CO ${K.f0(R.coaf)} ppm air-free, ${K.f1(R.eff)}% efficient.`}),
 K.goal({t:"Find where CO takes off",intro:"Natural gas, no impingement. Turn the air down until CO air-free goes over <b>100 ppm</b>, then <b>log</b> that reading.",
  check:(S,R,L)=>L.some(l=>!l.S.lp&&!l.S.imp&&l.R.coaf>100&&l.R.coaf<1000)?true:"Log a reading with CO air-free between 100 and 1,000 ppm (natural gas, no impingement).",
  ok:()=>{const l=K.LOG.filter(l=>!l.S.lp&&!l.S.imp&&l.R.coaf>100).pop();return `CO passed 100 ppm at about ${K.f1(l.R.O2)}% O2 (${K.f0(l.R.eaEst)}% excess air). Below that it climbs steeply: that's why burners run with excess air.`}}),
 K.caseTask({t:"Service call: CO alarm, flame looks fine",intro:"80% furnace on natural gas. O2 looks normal, but the CO is high and stays high after 10 minutes.",
  state:{ea:58,flue:400,air:70,imp:true},model:M,draw:(R,S)=>scene(R,S),reads:R=>[["O2",K.f1(R.O2)+" %"],["CO air-free",K.f0(R.coaf)+" ppm",true],["Net stack",K.f0(R.net)+"°F"],["Efficiency",K.f1(R.eff)+" %"]],
  actions:[["Watch the flames with a mirror",()=>"Burner 2 sits crooked. Its flame runs up onto the heat exchanger."],["Clock the meter",()=>"79,000 Btu/h on an 80,000 plate."]],
  causes:[["imp","Flame impingement (burner out of line)"],["air","Not enough combustion air"],["over","Overfired"],["excess","Too much excess air"]],ans:"imp",
  why:"Normal O2 rules out an air shortage, and the clock rules out overfiring. A flame touching the cool heat exchanger is quenched before its CO can burn out. Realign or replace the burner and test again.",hint:"O2 is in the normal range and the input is right. What else makes CO?"})];
window.LESSON={id:"comb-analyzer",sec:"Combustion and gas",secHref:"/combustion/",title:"Reading a combustion analyzer",lead:"What O2, CO2, air-free CO, excess air, stack temperature and efficiency mean, and what the numbers look like when something is wrong.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>O2</b> (measured) and <b>CO2</b> (calculated).","<b>CO as measured and air-free.</b>","<b>Flue and combustion air temperature</b>, and net stack.","<b>Efficiency</b> and excess air (calculated).","Draft and inlet / manifold pressure along with them."],
  table:[["Reading","Natural gas, typical","Look closer if"],["O2","6 to 9%","Under 4% or over 10%"],["CO2","About 7 to 8.5% (max 11.7%)","Near max (no excess air)"],["CO air-free","Under 100 ppm (aim lower)","Over 100; over 400 shut down"],["Net stack","Natural draft 270 to 370°F; 80% fan-assisted 170 to 270°F","Far outside the maker's range"],["Excess air","About 40 to 75%","Under 25% or over 100%"]],tableT:"Typical readings",
  steps:["Zero the analyzer in outdoor air.","Drill or open the test port in the right spot (before the draft hood or 12 to 18 in. above the inducer).","Fire at high fire and wait for the readings to settle.","Record O2, CO, CO air-free, net stack and efficiency.","Fix the cause, then test again. Seal the test hole with a proper plug."],stepsT:"Doing a combustion test",
  safety:["CO over 400 ppm air-free: shut the appliance off and don't leave it running.","Watch the room CO on your meter while you test.","Use the plug the manufacturer specifies for the test hole; on plastic vents follow the maker's instructions."],
  mistakes:["Sampling in the vent after the draft hood, where room air dilutes the reading.","Reading CO as measured and forgetting the air-free correction.","Taking numbers in the first minute before the heat exchanger warms.","Opening the air shutter to make CO read lower without fixing the cause."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained (furnace heat exchanger)","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["Service guide: combustion analysis on gas appliances (O2 6 to 9%, CO2 max 11.7%, CO air-free, test hole location)","https://servicemag.org/guides/combustion-analysis-gas-appliances"],["Testo 300 manual: fuel constants for the flue loss calculation","https://www.manualslib.com/manual/1286672/Testo-300-Xxl.html?page=77"],["Natural gas and propane fundamentals: air per cubic foot, CO limits","https://open-exam-prep.com/study-guides/nc-hvac-contractor/forced-air-heating-and-furnaces/gas-combustion-fundamentals"]]};
})();
