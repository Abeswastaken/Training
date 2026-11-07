/* ============ Lesson: Condenser approach ============ */
(()=>{const P=v=>plant(v);
const C=[["scale","Scale in the condenser tubes"],["air","Air (non-condensables) in the condenser"],["flow","Low condenser water flow"],["tower","Cooling tower not keeping up"],["sensor","Bad leaving water sensor"]];
const steps=[
 {t:"What the condenser does",
  body:`<p>The compressor sends hot refrigerant vapor into the <b>condenser</b>, the upper shell. Tower water runs through the tubes. The vapor gives its heat to the water and condenses back into liquid, which drains to the bottom and on to the metering device.</p><p>Here the water is <b>inside</b> the tubes again, and the refrigerant is outside, condensing on them.</p>`,
  draw:()=>chillerSVG(P({}),{hi:"cond"})},
 {t:"Condenser approach",
  body:`<p><b>Condenser approach</b> = refrigerant condensing temperature − leaving condenser water temperature.</p><p>Read the <b>condenser pressure</b>, convert it to temperature with the R-134a PT chart (most panels do this for you), and subtract the leaving water temperature.</p><p>A clean condenser runs about <b>1 to 3°F</b> at full load.</p>`,
  math:`<p>Approach = T<sub>sat, cond</sub> − LCWT</p><p>Example: 116 psig = 95.9°F; leaving water 94.3°F; approach 1.6°F.</p>`,
  draw:()=>condSVG(P({}),{hi:"pc"})},
 {t:"Scale: the slow climb",
  body:`<p>Cooling tower water is open to the air, and it gets concentrated as water evaporates. Minerals build up as <b>scale</b> inside the tubes, plus slime and mud if the water treatment slips.</p><p>Scale is an insulator. Heat has a harder time getting into the water, so the refrigerant has to condense hotter, at a higher pressure. Approach creeps up over <b>months</b>.</p><p>Fix: brush (rod) the tubes, then fix the water treatment.</p>`,
  draw:()=>{const a=P({}),b=P({condFoul:0.8});return K.chart({x:80,y:50,w:560,h:250,X:[0,12],Y:[0,6],xt:[0,3,6,9,12],yt:[0,1,2,3,4,5,6],yf:v=>v+"°F",xl:"months since the tubes were cleaned",title:"CONDENSER APPROACH AT FULL LOAD",
   bands:[{y0:1,y1:3,c:"#1e9a4a",lbl:"CLEAN: 1 TO 3°F"}],series:[{pts:[...Array(13)].map((_,m)=>[m,a.appC+(b.appC-a.appC)*Math.pow(m/12,1.3)]),c:"#a0662a",lbl:"SCALING UP",lblAt:9,dy:-14}],vlines:[{x:9,lbl:"plan a cleaning",c:"var(--bad)"}]})}},
 {t:"Air: the sudden jump",
  body:`<p>Air and other gases that don't condense (<b>non-condensables</b>) get in during service, or through leaks on low-pressure chillers. They collect at the top of the condenser.</p><p>They add their own pressure, so the gauge reads <b>higher</b> than the refrigerant alone would make. They also blanket the tubes. Approach jumps <b>right after</b> a repair.</p><p>The giveaway: the liquid leaving the condenser is <b>much colder</b> than the saturation temperature the gauge says.</p>`,
  draw:()=>condSVG(P({noncond:true}),{hi:"liq"})},
 {t:"Telling scale from air",
  body:`<p>Compare the <b>liquid line temperature</b> to the <b>condensing temperature</b> from the gauge.</p><ul><li><b>Scale:</b> liquid is only about 1 to 2°F below saturation. The pressure is honest; the tubes are dirty.</li><li><b>Air:</b> liquid is 5°F or more below saturation. Part of the pressure is air, not refrigerant.</li></ul><p>Air goes out through the <b>purge unit</b> or by recovering and evacuating. Scale needs a tube cleaning.</p>`,
  draw:()=>{const a=P({condFoul:0.8}),b=P({noncond:true});const col=(x,R,t,c)=>`<rect x="${x}" y="60" width="300" height="270" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+150,92,t,{fill:c})+K.lbl(x+150,140,"GAUGE: "+K.f0(R.Pc)+" PSIG = "+K.f1(R.Tc)+"°F")+K.lcd(x+150,190,K.f1(R.liq)+"°F",100)+K.txt(x+150,226,"liquid line thermometer")+K.lbl(x+150,276,"SATURATION − LIQUID = "+K.f1(R.sub)+"°F",{fill:c})+K.txt(x+150,308,R.sub>5?"far colder: air is in there":"normal: the pressure is real");
   return col(40,a,"SCALED TUBES","#a0662a")+col(380,b,"AIR IN THE CONDENSER","var(--bad)")}},
 {t:"Why it costs money",
  body:`<p>Every degree of condenser approach is a degree of <b>lift</b> the compressor has to make. Higher head pressure also pushes a centrifugal chiller toward <b>surge</b>, and past about 180 psig the high-pressure safety trips it.</p><p>Same building, same tower water: compare the clean condenser to the scaled one.</p>`,
  draw:()=>{const a=P({}),b=P({condFoul:0.9});return liftBar(a,110,180,{title:"CLEAN: APPROACH "+K.f1(a.appC)+"°F",c:"#2f6fd6"})+liftBar(b,430,180,{title:"SCALED: APPROACH "+K.f1(b.appC)+"°F",c:"#a0662a"})+K.lbl(200,360,K.f2(a.kwt)+" kW/ton",{size:20})+K.lbl(520,360,K.f2(b.kwt)+" kW/ton",{size:20,c:"bad"})}}];
const see=K.see({init:{load:100,foul:0,tw:85,air:false},
 sliders:[["load","Load",20,100,5,v=>v+"%"],["foul","Scale in the tubes",0,100,5,v=>v+"%"],["tw","Tower water to the condenser",70,90,1,v=>v+"°F"]],checks:[["air","Air in the condenser"]],
 model:S=>P({load:S.load/100,condFoul:S.foul/100,tset:S.tw,wb:Math.min(78,S.tw-6),noncond:S.air}),
 draw:R=>condSVG(R),
 reads:R=>[["Condenser approach",K.f1(R.appC)+"°F",R.appC>3.5],["Cond pressure",K.f0(R.Pc)+" psig"],["Condensing temp",K.f1(R.Tc)+"°F"],["Liquid line",K.f1(R.liq)+"°F"],["Lift",K.f1(R.lift)+"°F"],["kW per ton",K.f2(R.kwt)]],
 note:R=>R.sub>5?`Liquid is ${K.f1(R.sub)}°F below saturation: non-condensables.`:R.Pc>165?"Head pressure is close to the 180 psig trip.":"",
 log:[["Load",(R,S)=>S.load+"%"],["Approach",R=>K.f1(R.appC)+"°F"],["kW/ton",R=>K.f2(R.kwt)]]});
const rd=(R)=>[["Condenser approach",K.f1(R.appC)+"°F",R.appC>3.5],["Cond pressure",K.f0(R.Pc)+" psig"],["Leaving cond water",K.f1(R.Tlc)+"°F"],["Load",K.f0(R.plr*100)+"%"]];
const liqAct=["Measure the liquid line temperature",R=>`Liquid line ${K.f1(R.liq)}°F. Condensing temperature from the gauge ${K.f1(R.Tc)}°F. Difference ${K.f1(R.sub)}°F.`];
const flowAct=["Read the pressure drop across the condenser",R=>`Water pressure drop ${K.f1(8*Math.pow(R.gcdw/900,2))} psi (design 8.0 psi at 900 gpm), about ${K.f0(R.gcdw)} gpm.`];
const tasks=[
 K.goal({t:"Find the clean baseline",intro:"In See it, with no scale, no air, 85°F tower water and 100% load, press <b>Log reading</b>. That's the number future readings get compared to.",
  check:(S,R,L)=>L.some(r=>r.S.load>=95&&r.S.foul===0&&!r.S.air&&r.S.tw===85)?true:"Log a reading at 100% load, 85°F tower water, no scale and no air.",ok:()=>"Baseline logged. Compare future full-load readings to it, not to the textbook."}),
 K.caseTask({t:"Service call: creeping head pressure",intro:"The day log shows condenser approach climbing all summer. The water treatment contractor missed two visits. Find the cause.",
  state:{condFoul:0.7},model:P,draw:R=>condSVG(R),reads:rd,hist:{vals:[1.7,2.0,2.5,3.1,3.8,4.5],lbls:["Apr","May","Jun","Jul","Aug","Sep"],title:"LOG: CONDENSER APPROACH AT FULL LOAD",unit:"°"},
  actions:[liqAct,flowAct],causes:C,ans:"scale",why:"Flow is normal and the liquid is only about 1°F below saturation, so the pressure is real: the tubes are scaled. Rod the tubes and get the water treatment back on schedule.",hint:"Check the flow and compare the liquid line to saturation. A slow climb with normal flow and normal liquid temperature points one way."}),
 K.caseTask({t:"Service call: after the compressor rebuild",intro:"The chiller was opened for a compressor repair last week. Since restart, head pressure is way up.",
  state:{noncond:true},model:P,draw:R=>condSVG(R),reads:rd,hist:{vals:[1.6,1.7,1.6,8.6,8.8],lbls:["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5"],title:"LOG: CONDENSER APPROACH",unit:"°"},
  actions:[liqAct,flowAct],causes:C,ans:"air",why:"The liquid is far colder than the saturation the gauge shows. Air got in while the machine was open. Run the purge, or recover, evacuate and recharge.",hint:"A jump right after the machine was opened, with normal flow. Compare the liquid line to saturation."})];
window.LESSON={id:"chill-cond",sec:"Chiller and cooling tower",secHref:"/chiller/",title:"Condenser approach",lead:"How close the condensing refrigerant gets to the tower water, and how to tell scale from air.",
 steps,see,tryIntro:"A baseline in See it, then two service calls.",tasks,
 job:K.job({read:["<b>Condenser pressure</b> and its saturation temperature (R-134a here; check the nameplate).","<b>Leaving condenser water</b> temperature.","<b>Liquid line temperature</b> leaving the condenser, with a strap-on probe, when air is suspected.","<b>Condenser water pressure drop</b> to confirm flow."],
  table:[["Reading","What it means"],["1 to 3°F at full load","Clean condenser. Your startup sheet is the real baseline."],["Up 3°F or more over baseline","Plan a tube cleaning; check water treatment."],["Jumps after service, liquid 5°F+ below saturation","Non-condensables: purge or recover and evacuate."],["High approach and low pressure drop","Low water flow: strainer, valves, pump."]],
  log:"Daily at about the same load: condenser pressure, saturation temperature, entering and leaving condenser water, approach, kW per ton.",
  safety:["Before opening water boxes to clean tubes: lock out the chiller and pumps, close and tag the condenser water valves, drain, and vent.","Never pressurize a refrigerant circuit with air or oxygen to leak-test. Use dry nitrogen with a regulator."],
  mistakes:["Blaming the tower for high head pressure without checking approach: tower problems raise the water temperature, not the approach.","Adding refrigerant to 'fix' high head pressure."]}),
 sources:[["The Engineering Mindset: chiller condensers explained","https://theengineeringmindset.com/chiller-condensers-explained/"],["Oxmaint: chiller approach temperature as the fouling metric","https://oxmaint.com/industries/facility-management/chiller-approach-temperature-fouling-metric"],["The Mechanical Room: chiller approach temperatures field guide","https://themechanicalroom.us.com/articles/chiller-approach-temperatures-field-guide"],["Refrigerants.com R-134a PT chart","https://refrigerants.com/wp-content/uploads/2020/03/R134a_RefGuid.pdf"]]};
})();
