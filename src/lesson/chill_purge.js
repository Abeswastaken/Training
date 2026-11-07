/* ============ Lesson: Purge unit and non-condensables ============ */
(()=>{const P=v=>plant(v);
function purgeSVG(o={}){const air=o.air??0.5,run=o.run!==false;let s=``;
 // condenser top section
 s+=`<rect x="40" y="250" width="380" height="110" rx="10" fill="url(#zSteelH)" stroke="#4d555a"/><rect x="60" y="262" width="340" height="86" fill="#2a3034"/>`;
 for(let i=0;i<3;i++)s+=`<rect x="60" y="${290+i*20}" width="340" height="10" rx="5" fill="url(#zCuH)"/>`;
 s+=`<g opacity="${0.3+0.7*air}">${[...Array(12)].map((_,i)=>`<circle cx="${80+i*27}" cy="${272+(i%3)*4}" r="4" fill="#f2c94c"/>`).join("")}</g>`+K.lbl(230,244,"CONDENSER (TOP)");
 // suction line from condenser top to purge tank
 s+=`<path d="M330 250 V170 H430" stroke="#5f686d" stroke-width="9" fill="none"/><path d="M330 250 V170 H430" stroke="url(#zCuV)" stroke-width="6" fill="none"/>`;
 // purge tank
 s+=`<rect x="430" y="90" width="120" height="170" rx="16" fill="url(#zSteelH)" stroke="#4d555a"/><rect x="442" y="104" width="96" height="142" rx="8" fill="#2a3034"/>`;
 s+=`<path d="M450 130 h80 M450 150 h80 M450 170 h80" stroke="#7fbcf0" stroke-width="5" stroke-linecap="round"/>`;// cold coil
 s+=`<rect x="444" y="${246-40}" width="92" height="38" fill="#8fc1e0" opacity=".85"/>`;// condensed refrigerant
 s+=`<g opacity="${0.25+0.75*air}">${[...Array(8)].map((_,i)=>`<circle cx="${456+i*11}" cy="${114+(i%2)*6}" r="3.5" fill="#f2c94c"/>`).join("")}</g>`;
 // refrigerant return
 s+=`<path d="M490 260 V300 H420" stroke="url(#zCuV)" stroke-width="6" fill="none"/>`;
 // small condensing unit for the purge (its own refrigeration)
 s+=`<rect x="580" y="200" width="110" height="80" rx="8" fill="url(#zSteel)" stroke="#4d555a"/><circle cx="635" cy="240" r="24" fill="#2a3034"/><g class="${run?"lsSpin":""}" style="transform-origin:635px 240px"><path d="M615 240 H655 M635 220 V260" stroke="#9aa3aa" stroke-width="4"/></g>`;
 s+=`<path d="M580 140 H538 M580 160 H538" stroke="#7fbcf0" stroke-width="4"/><path d="M580 140 H600 V200 M580 160 H590 V200" stroke="#7fbcf0" stroke-width="4" fill="none"/>`;
 // pump-out compressor and carbon filter, vent
 s+=`<path d="M490 90 V60 H560" stroke="#5f686d" stroke-width="5" fill="none"/><rect x="560" y="44" width="40" height="32" rx="5" fill="url(#zBlue)" stroke="#1c3149"/><path d="M600 60 H620" stroke="#5f686d" stroke-width="5"/><rect x="620" y="36" width="34" height="48" rx="6" fill="#3a3f42" stroke="#1d2125"/>${[0,1,2].map(i=>`<circle cx="${630+i*7}" cy="${52+i*8}" r="2.5" fill="#111"/>`).join("")}<path d="M654 60 H690 V30" stroke="#5f686d" stroke-width="5" fill="none"/>`;
 if(o.vent)s+=`<g class="lsPulse">${[0,1,2].map(i=>`<circle cx="${690+(i-1)*6}" cy="${18-i*6}" r="${4+i}" fill="#f2c94c" opacity=".8"/>`).join("")}</g>`;
 s+=K.lbl(490,80,"PURGE TANK",{a:"middle"})+K.lbl(635,300,"PURGE CONDENSING UNIT")+K.lbl(580,30,"PUMP-OUT",{a:"middle"})+K.lbl(637,104,"CARBON",{size:13})+K.lbl(690,14,"VENT",{a:"end",size:13})+K.txt(500,330,"liquid refrigerant back to the chiller",{a:"start"})+K.txt(340,160,"vapor + air from the condenser top",{a:"end"});
 return s}
const steps=[
 {t:"Low-pressure and high-pressure chillers",
  body:`<p>Some chillers run their evaporator <b>below atmospheric pressure</b> (a vacuum): R-123 and R-1233zd(E) machines, for example. Any leak there lets <b>air and moisture leak in</b>. They always have a purge unit running.</p><p>R-134a chillers like this one run above atmospheric pressure everywhere. Leaks push refrigerant <b>out</b>; air usually gets in only when the machine is opened for service and not evacuated well. Many still have a purge.</p>`,
  draw:()=>{const col=(x,t,c,p,pe,dir)=>`<rect x="${x}" y="50" width="300" height="290" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+150,82,t,{fill:c})+K.txt(x+150,120,"evaporator at about "+pe)+K.txt(x+150,146,"condenser at about "+p)+`<rect x="${x+60}" y="180" width="180" height="90" rx="40" fill="url(#zSteelH)" stroke="#4d555a"/>`+(dir>0?K.arrow(`M${x+150} 306 V276`,"#f2c94c",4)+K.txt(x+150,326,"air leaks in"):K.arrow(`M${x+150} 274 V304`,"#2f6fd6",4)+K.txt(x+150,326,"refrigerant leaks out"));
   return col(40,"LOW PRESSURE: R-123, R-1233zd","var(--bad)","6 to 10 psig","14 to 18 inHg vacuum",1)+col(380,"HIGH PRESSURE: R-134a, R-513A","#2f6fd6","115 psig","37 psig",-1)}},
 {t:"What air does in a condenser",
  body:`<p>Air won't condense at chiller temperatures. It collects at the top of the condenser, where the refrigerant is condensing.</p><p>Two problems: the air adds <b>its own pressure</b> on top of the refrigerant's (Dalton's law), so head pressure rises, and it <b>blankets</b> the tubes so less surface condenses refrigerant. Lift and kW per ton go up. Moisture that comes in with it makes acid in the oil and refrigerant.</p>`,
  math:`<p>Total pressure = refrigerant saturation pressure + air partial pressure.</p><p>10 psi of air on this chiller adds about 2.5°F of lift and about 6% to kW per ton in this model.</p>`,
  draw:()=>condSVG(P({ncPsi:12}))},
 {t:"How a purge unit works",
  body:`<p>A small line draws vapor (and any air) from the top of the condenser into the <b>purge tank</b>. A coil in the tank, cooled by the purge's own little refrigeration unit, condenses the refrigerant, which drains back to the chiller.</p><p>Air doesn't condense, so it collects in the tank. When the tank pressure builds, a <b>pump-out</b> compressor pushes the air out through a <b>carbon filter</b> that catches leftover refrigerant, and vents it.</p>`,
  draw:()=>purgeSVG({air:0.8,vent:true})},
 {t:"The purge tells you about leaks",
  body:`<p>Modern purges log <b>pump-out time</b> or pump-out cycles. On a tight machine it's small and steady. If it climbs, air is getting in somewhere, and on a low-pressure chiller that means a leak that also lets refrigerant out when the machine is off.</p><p>Treat rising pump-out time as a leak alarm: leak-test the low side (gaskets, sight glasses, shaft seal, flanges).</p>`,
  draw:()=>K.chart({x:90,y:50,w:540,h:250,X:[0,12],Y:[0,60],xt:[0,2,4,6,8,10,12],yt:[0,20,40,60],xf:v=>"W"+v,xl:"weeks",yl:"minutes",title:"PURGE PUMP-OUT MINUTES PER DAY",series:[{pts:[...Array(13)].map((_,w)=>[w,w<6?4+Math.sin(w)*0.8:4+Math.pow(w-5,1.8)*1.8]),c:"#d23a26",lbl:"LEAK STARTS",lblAt:7,a:"end",dy:-12}],vlines:[{x:9,lbl:"leak test",c:"var(--bad)"}]})},
 {t:"Checking for air without a purge",
  body:`<ol><li><b>Running:</b> compare the liquid line temperature to the saturation temperature from the condenser pressure. 5°F or more of difference points to air (see the condenser approach lesson).</li><li><b>Standing:</b> with the chiller off for hours and the water pumps running so everything is at one temperature, compare the condenser pressure to the PT chart at that water temperature. Higher than the chart = non-condensables.</li></ol>`,
  draw:()=>{const T=75,pt=ptP(T);return K.lbl(360,50,"CHILLER OFF, WATER AT 75°F EVERYWHERE")+dial(220,180,60,pt,200,"PSIG",50)+K.lbl(220,280,"CLEAN: "+K.f1(pt)+" PSIG",{fill:"#2f6fd6"})+K.txt(220,304,"matches PT chart at 75°F")+dial(500,180,60,pt+11,200,"PSIG",50)+K.lbl(500,280,"AIR: "+K.f1(pt+11)+" PSIG",{c:"bad"})+K.txt(500,304,"11 psi above the chart")}},
 {t:"Leaks and the rules",
  body:`<p>Air in the machine means a way in, and refrigerant lost means money and emissions. In the US, EPA rules under Section 608 (and the AIM Act for HFCs) require <b>certified technicians</b>, leak-rate tracking on large systems, and repairs once the leak rate passes a trigger (10% a year for comfort cooling). Check the current rules for your refrigerant and charge size.</p><p>Fix leaks; don't just let the purge or extra charge cover them.</p>`,
  draw:()=>K.cards([{t:"KEEP RECORDS",inner:K.txt(14,70,"refrigerant added, leak rate,",{a:"start"})+K.txt(14,92,"purge pump-out, repairs",{a:"start"}),note:"required on large systems"},{t:"LEAK TEST",c:"#2f6fd6",inner:K.txt(14,70,"electronic detector, bubbles,",{a:"start"})+K.txt(14,92,"or pressure-up with nitrogen",{a:"start"}),note:"low-pressure machines: use a pressure kit"},{t:"REPAIR",c:"#1e9a4a",inner:K.txt(14,70,"gaskets, flare and flange joints,",{a:"start"})+K.txt(14,92,"shaft seal, relief valve",{a:"start"}),note:"then verify the repair"},{t:"EVACUATE",c:"var(--ink)",inner:K.txt(14,70,"after opening the machine,",{a:"start"})+K.txt(14,92,"evacuate before charging",{a:"start"}),note:"keeps air out of a high-pressure machine"}])}];
const see=K.see({init:{load:100,air:0,purge:false},
 sliders:[["load","Load",20,100,5,v=>v+"%"],["air","Air in the condenser",0,25,1,v=>v+" psi"]],checks:[["purge","Run the purge (removes the air)"]],
 model:S=>P({load:S.load/100,ncPsi:S.purge?Math.min(S.air,0.5):S.air}),draw:R=>condSVG(R),
 reads:R=>[["Cond pressure",K.f0(R.Pc)+" psig"],["Sat temp (gauge)",K.f1(R.Tc)+"°F"],["Liquid line",K.f1(R.liq)+"°F"],["Sat − liquid",K.f1(R.sub)+"°F",R.sub>5],["Lift",K.f1(R.lift)+"°F"],["kW per ton",K.f2(R.kwt)]],
 note:(R,S)=>{const c=P({load:S.load/100});return R.kwt>c.kwt*1.005?`${K.f0((R.kwt/c.kwt-1)*100)}% more power than an air-free condenser.`:""}});
const tasks=[
 K.goal({t:"Clear the air",intro:"Set <b>12 psi</b> of air at 100% load. Note the liquid-to-saturation difference, then run the purge and get it back under <b>2°F</b>.",
  check:(S,R)=>S.air!==12||S.load<95?"Set 12 psi of air and 100% load.":!S.purge?"Air is still in there. Turn on the purge.":R.sub<2?true:"Not yet.",ok:(S,R)=>`${K.f1(R.sub)}°F: the gauge pressure is honest again, and kW per ton is back to ${K.f2(R.kwt)}.`}),
 K.caseTask({t:"Service call: busy purge",intro:"An R-1233zd low-pressure chiller. The purge controller shows pump-out time climbing for about a month. Efficiency is fine so far.",
  state:{ncPsi:3},model:P,draw:()=>purgeSVG({air:0.9,vent:true}),vb:"0 0 720 380",reads:()=>[["Pump-out today","38 min",true],["Normal","4 min"],["Refrigerant added this year","None"],["Chiller","Running"]],
  hist:{vals:[4,4,5,9,17,28,38],lbls:["W1","W2","W3","W4","W5","W6","W7"],title:"LOG: PURGE PUMP-OUT MINUTES PER DAY",unit:""},
  actions:[["Check the purge itself",()=>"Purge condensing unit runs, tank coil is cold, carbon filter recently changed."],["Leak-check the evaporator with a pressure kit while off",()=>"Pressurized to 5 psig with the warm-water method; detector alarms at the evaporator water box gasket."]],
  causes:[["leak","Leak letting air into the low side"],["purge","Purge unit failing"],["normal","Normal purge operation"],["charge","Overcharge"]],ans:"leak",why:"Rising pump-out on a low-pressure chiller means air is getting in: there's a leak. The test found the water box gasket. Repair it, then watch the pump-out time drop back to normal.",hint:"The purge is doing its job. Why would it suddenly have so much more air to pump out?"}),
 K.caseTask({t:"Service call: after a tube repair",intro:"An R-134a chiller was opened to plug two condenser tubes. It sat off overnight with the water pumps running; the mechanical room and water are at 75°F. The condenser gauge reads 90 psig.",
  state:{},model:P,draw:()=>dial(250,190,70,90,200,"PSIG",50)+K.lbl(250,300,"CONDENSER: 90 PSIG")+K.lbl(520,150,"WATER AND ROOM 75°F",{a:"middle"})+K.lbl(520,180,"R-134a AT 75°F = 78.7 PSIG",{a:"middle",c:"v"}),reads:()=>[["Condenser gauge","90 psig",true],["Water temperature","75°F"],["PT chart at 75°F","78.7 psig"],["Difference","11 psi",true]],
  causes:[["air","Non-condensables (air) left in"],["over","Overcharged"],["normal","Normal for a chiller that's off"],["gauge","Gauge out of calibration"]],ans:"air",why:"With everything at 75°F, the pressure should match the PT chart: 78.7 psig. The extra 11 psi is air that got in while the shell was open. Purge or recover, evacuate and recharge before running.",hint:"At rest, with everything at one temperature, what should the pressure be?"})];
window.LESSON={id:"chill-purge",sec:"Chiller and cooling tower",secHref:"/chiller/",title:"Purge unit and non-condensables",lead:"Why air in a chiller raises head pressure, how a purge unit removes it, and what the purge tells you about leaks.",
 steps,see,tryIntro:"One fix in See it, then two service calls.",tasks,
 job:K.job({read:["<b>Purge pump-out time</b> or cycles per day, and the trend.","<b>Condenser pressure vs saturation</b>: liquid line temperature compared to saturation while running, or a standing pressure check while off.","Refrigerant added (log) and leak-test records."],
  table:[["Reading","Meaning"],["Pump-out small and steady","Tight machine"],["Pump-out climbing","Air coming in: leak on a low-pressure machine"],["Liquid 5°F+ below saturation","Non-condensables in the condenser"],["Standing pressure above the PT chart","Non-condensables"]],
  log:"Weekly: purge run and pump-out time, condenser pressure and saturation, liquid line temperature. Every refrigerant addition with the amount and reason.",
  safety:["Only EPA 608 certified technicians may open refrigerant circuits or vent purge exhaust connections.","Never pressurize with air or oxygen. Low-pressure chillers are leak-tested with special low-pressure kits; don't exceed the rupture disc rating."],
  mistakes:["Disabling a purge that runs a lot instead of finding the leak.","Charging more refrigerant to bring the head pressure 'right' when air is the problem."]}),
 sources:[["The Engineering Mindset: chillers, main components","https://theengineeringmindset.com/chillers-main-components/"],["EPA: Section 608 refrigerant management requirements","https://www.epa.gov/section608"],["Oxmaint: non-condensables and condenser approach","https://oxmaint.com/industries/facility-management/chiller-approach-temperature-fouling-metric"],["Refrigerants.com R-134a PT chart","https://refrigerants.com/wp-content/uploads/2020/03/R134a_RefGuid.pdf"]]};
})();
