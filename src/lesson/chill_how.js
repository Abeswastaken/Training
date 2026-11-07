/* ============ Lesson: How a centrifugal chiller works ============ */
(()=>{const P=v=>plant({wb:70,...v});
const steps=[
 {t:"The chiller's job",
  body:`<p>A chiller moves heat. It takes heat <b>out of the building's water</b> and dumps it into the <b>cooling tower's water</b>, which carries it outside.</p><p>The building water comes back at about 54°F and leaves at 44°F. The tower water comes in at about 85°F and leaves at about 95°F. Heat goes from cold water into warm water, which it would never do by itself. The compressor is what makes it happen.</p><p class="lsKey">Two water loops, one refrigerant loop in between.</p>`,
  draw:()=>chillerSVG(P({}),{})},
 {t:"1. The evaporator boils refrigerant",
  body:`<p>Liquid refrigerant (R-134a here) sits in the bottom shell around the tubes. At about 37 psig it boils at 42°F.</p><p>The building water in the tubes is warmer than that, so it heats the refrigerant and makes it boil. The water leaves 10°F colder. The vapor goes up to the compressor.</p>`,
  draw:()=>chillerSVG(P({}),{hi:"evap"})},
 {t:"2. The compressor raises the pressure",
  body:`<p>The compressor is a fast-spinning <b>impeller</b>, like a fan wheel, driven by an electric motor. It flings the vapor outward into a spiral casing (the <b>volute</b>), which turns speed into pressure.</p><p>It pushes the vapor from about 37 psig to about 115 psig. At that pressure R-134a condenses at about 96°F: hotter than the tower water, so now the heat can flow out.</p><p>This is where the electricity goes.</p>`,
  vb:"0 0 720 380",draw:()=>compSVG(1,{x:380,y:190,s:1.1})+K.lbl(380,30,"LOOKING INTO THE COMPRESSOR INLET")+K.tag(160,104,"VOLUTE")+K.tag(380,350,"IMPELLER BEHIND THE GUIDE VANES")+K.arrow("M150 210 H40","var(--hot)",4)+K.lbl(92,236,"TO CONDENSER")},
 {t:"3. The condenser turns it back to liquid",
  body:`<p>The hot vapor fills the top shell. Tower water at 85°F runs through the tubes. The vapor gives up its heat to the water and condenses into droplets on the tubes, and the liquid collects in the bottom of the shell.</p><p>The tower water leaves about 9°F warmer, carrying the building's heat <b>plus</b> the heat from the compressor's motor.</p>`,
  draw:()=>chillerSVG(P({}),{hi:"cond"})},
 {t:"4. The metering device drops the pressure",
  body:`<p>The liquid passes through an <b>orifice</b> or a <b>float valve</b> on its way back down to the evaporator. The pressure drops from about 115 to 37 psig, and some liquid flashes to vapor, which chills the rest down to 42°F.</p><p>Then the cycle starts again: boil, compress, condense, meter.</p>`,
  draw:()=>chillerSVG(P({}),{hi:"orifice"})},
 {t:"5. Matching the load",
  body:`<p>The building doesn't always need 300 tons. To make less cooling, <b>inlet guide vanes</b> in front of the impeller close part way. They pre-swirl the vapor and choke the flow, so the compressor pumps less. Many newer chillers also slow the motor with a VFD.</p><p>The controls move the vanes to hold the leaving water at its setpoint. Drag the load and watch the vanes.</p>`,
  init:{load:100},ctl:{html:`<div class="row"><label for="ls_hl">Building load</label><output id="lso_hl">100%</output><input type="range" id="ls_hl" min="20" max="100" step="5" value="100"></div>`,input:(t,s)=>{s.load=+t.value;document.getElementById("lso_hl").textContent=t.value+"%"}},
  draw:s=>{const L=(s.load||100)/100;return compSVG(0.12+0.88*L,{x:300,y:200,s:0.95})+K.lbl(300,36,"GUIDE VANES "+K.f0(cl(L*100,0,100))+"% OPEN")+K.lbl(600,150,K.f0(L*300)+" TONS",{c:"v"})+K.lbl(600,180,K.f0(P({load:L}).kW)+" kW")}}];
const see=K.see({init:{load:100,lchw:44,tw:85},
 sliders:[["load","Building load",20,100,5,v=>v+"%"],["lchw","Leaving chilled water setpoint",40,50,0.5,v=>K.f1(v)+"°F"],["tw","Tower water to the chiller",65,90,1,v=>v+"°F"]],
 model:S=>P({load:S.load/100,lchw:S.lchw,tset:S.tw,wb:Math.min(70,S.tw-6)}),
 draw:R=>chillerSVG(R,{}),
 reads:R=>[["Cooling",K.f0(R.Q)+" tons"],["Motor power",K.f0(R.kW)+" kW"],["kW per ton",K.f2(R.kwt)],["Lift",K.f1(R.lift)+"°F"],["Evap pressure",K.f1(R.Pe)+" psig"],["Cond pressure",K.f0(R.Pc)+" psig"]],
 log:[["Load",(R,S)=>S.load+"%"],["kW",R=>K.f0(R.kW)],["kW/ton",R=>K.f2(R.kwt)]],
 note:R=>`Heat out at the tower: ${K.f0(R.Qrej)} tons (the building's ${K.f0(R.Q)} plus ${K.f0(R.Qrej-R.Q)} from the motor).`});
const tasks=[
 K.goal({t:"Make the same cooling for less power",intro:"At 100% load, get the chiller under <b>0.50 kW per ton</b> without changing the chilled water setpoint (keep it at 44°F).",
  check:(S,R)=>S.load<95?"Set the load to 100% first.":Math.abs(S.lchw-44)>0.01?"Put the chilled water setpoint back to 44°F.":R.kwt<0.5?true:`Now ${K.f2(R.kwt)} kW per ton. Which water temperature makes the compressor work less?`,
  ok:(S,R)=>`${K.f2(R.kwt)} kW per ton with ${S.tw}°F tower water. Colder tower water means a lower condenser pressure, so the compressor lifts less.`}),
 K.goal({t:"Raise the evaporator pressure",intro:"At 100% load and 85°F tower water, get the evaporator above <b>39 psig</b>.",
  check:(S,R)=>S.load<95?"Set the load to 100%.":S.tw!==85?"Set the tower water back to 85°F.":R.Pe>39?true:`Evaporator at ${K.f1(R.Pe)} psig. The refrigerant boils about 2°F below the leaving water...`,
  ok:(S,R)=>`${K.f1(R.Pe)} psig with ${K.f1(S.lchw)}°F water. Warmer chilled water lets the refrigerant boil warmer, at a higher pressure.`}),
 K.goal({t:"Log a part-load reading",intro:"Set the load to <b>40% or less</b> and press <b>Log reading</b> in See it. Compare its kW to a full-load reading.",
  check:(S,R,L)=>L.some(r=>r.S.load<=40)?true:"No reading at 40% load or less in your log yet.",
  ok:()=>"Logged. At part load the vanes close and the power drops, though not quite in step with the tons."})];
window.LESSON={id:"chill-how",sec:"Chiller and cooling tower",secHref:"/chiller/",title:"How a centrifugal chiller works",lead:"Where the heat goes: evaporator, compressor, condenser and metering device, and how the chiller matches the load.",
 steps,see,tryIntro:"Three tasks on the See it chiller. Set it up there, then come back and press Check.",tasks,
 job:K.job({read:["<b>Leaving and entering chilled water</b> and <b>entering and leaving condenser water</b> on the panel.","<b>Evaporator and condenser pressure</b> and their saturation temperatures.","<b>Motor amps or % load</b>, and kW if the panel shows it.","<b>Oil pressure and temperature</b> (the compressor bearings depend on it)."],
  table:[["Design point (AHRI)","Value"],["Chilled water","54°F in, 44°F out, 2.4 gpm per ton"],["Condenser water","85°F in, about 95°F out, 3 gpm per ton"],["Heat at the tower","About 15,000 Btu/h per ton (cooling plus motor heat)"],["Typical centrifugal efficiency","0.52 to 0.62 kW per ton at full load"]],
  log:"Every shift: chilled and condenser water temperatures, both pressures and saturation temperatures, both approaches, amps or % load, oil pressure and temperature, and any alarms.",
  safety:["Chillers run on 480 V or more. Only qualified people open the starter or the motor terminal box, with lockout/tagout.","Refrigerant displaces air in a closed room. Mechanical rooms need a refrigerant monitor and ventilation (ASHRAE 15)."],
  mistakes:["Calling it a 'bigger air conditioner' and forgetting the two water loops: problems on either loop show up in the chiller.","Reading pressure without converting it to saturation temperature for the right refrigerant."]}),
 sources:[["The Engineering Mindset: chillers, main components","https://theengineeringmindset.com/chillers-main-components/"],["The Engineering Mindset: chiller, cooling tower and AHU working together","https://theengineeringmindset.com/chiller-cooling-tower-air-handling-unit-work-together/"],["AHRI 550/590 rating conditions (PE exam guide)","https://open-exam-prep.com/study-guides/pe-mechanical-hvac/hvac-equipment-machinery/water-chillers-iplv-ratings"],["Refrigerants.com R-134a PT chart","https://refrigerants.com/wp-content/uploads/2020/03/R134a_RefGuid.pdf"]]};
})();
