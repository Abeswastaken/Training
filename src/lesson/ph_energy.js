/* ============ Lesson: NRE, heat of compression, heat of rejection and COP ============ */
(()=>{const n="R-410A",B={Te:40,Tc:105,sh:10,sc:10,eff:0.7},c0=RF.cycle(n,B);
const box=(c,G)=>`<path d="M${G.X(c.h6)} ${G.Y(c.Ps)} H${G.X(c.h1)} L${G.X(c.h2)} ${G.Y(c.Pd)} H${G.X(c.h5)} Z" fill="rgba(210,162,76,.12)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>`;
const view=(c,o={})=>{const G=RF.std(n,{labels:false,iso:o.iso});let s=G.s+(o.ghost?`<path d="M${G.X(o.ghost.h6)} ${G.Y(o.ghost.Ps)} H${G.X(o.ghost.h1)} L${G.X(o.ghost.h2)} ${G.Y(o.ghost.Pd)} H${G.X(o.ghost.h5)} Z" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/>`:"")+box(c,G);
 if(o.nre)s+=`<rect x="${G.X(c.h6)}" y="${G.Y(c.Ps)-8}" width="${G.X(c.h1)-G.X(c.h6)}" height="16" fill="#2f6fd6" opacity=".35"/>`+RF.bracket(G,c.h6,c.h1,G.Y(c.Ps)+40,"NRE "+K.f1(c.NRE)+" BTU/LB","#2f6fd6");
 if(o.hoc)s+=`<path d="M${G.X(c.h1)} ${G.Y(c.Ps)} L${G.X(c.h2)} ${G.Y(c.Pd)}" stroke="var(--bad)" stroke-width="6" opacity=".6"/>`+RF.bracket(G,c.h1,c.h2,G.Y(c.Pd)-26,"HOC "+K.f1(c.HOC),"var(--bad)",true);
 if(o.hor)s+=`<rect x="${G.X(c.h5)}" y="${G.Y(c.Pd)-8}" width="${G.X(c.h2)-G.X(c.h5)}" height="16" fill="#d9824a" opacity=".35"/>`+RF.bracket(G,c.h5,c.h2,G.Y(c.Pd)-26,"HEAT OF REJECTION "+K.f1(c.HOR),"#c06a2a",true);
 if(o.cop)s+=K.tag(600,262,"COP "+K.f2(c.COP)+" : 1",{c:"v"});return s};
const steps=[
 {t:"NRE: what each pound picks up",
  body:`<p>The <b>net refrigeration effect</b> (NRE) is the heat one pound of refrigerant soaks up from the space as it goes through the evaporator.</p><p>On the chart it's the length of the bottom line: from the evaporator inlet (point 6) to the compressor inlet (point 1).</p><p class="lsKey">NRE = h entering comp − h entering evap</p><p>Here that's ${K.f1(c0.h1)} − ${K.f1(c0.h6)} = <b>${K.f1(c0.NRE)} Btu/lb</b>.</p>`,
  math:`<p>Your sheet counts the suction superheat as part of NRE (it uses the compressor inlet). That's right when the superheat is picked up inside the evaporator. Superheat added in a long suction line outside the space is heat the system pays for but the room doesn't get.</p>`,
  draw:()=>view(c0,{nre:true})},
 {t:"HOC: what the compressor adds",
  body:`<p>The <b>heat of compression</b> (HOC) is the energy the compressor packs into each pound. You pay the power company for this.</p><p>On the chart it's how far right the compression line travels, from point 1 to point 2.</p><p class="lsKey">HOC = h leaving comp − h entering comp</p><p>Here: ${K.f1(c0.h2)} − ${K.f1(c0.h1)} = <b>${K.f1(c0.HOC)} Btu/lb</b>.</p>`,draw:()=>view(c0,{hoc:true})},
 {t:"Heat of rejection: the condenser gets both",
  body:`<p>The condenser has to get rid of everything: the heat from the space <b>plus</b> the heat of compression. That's the <b>heat of rejection</b>.</p><p class="lsKey">Heat of rejection = NRE + HOC</p><p>Here: ${K.f1(c0.NRE)} + ${K.f1(c0.HOC)} = <b>${K.f1(c0.HOR)} Btu/lb</b>. That's why a condenser is sized bigger than the evaporator, often about 1.25 times for air conditioning.</p>`,draw:()=>view(c0,{hor:true})},
 {t:"COP: what you get for what you pay",
  body:`<p>The <b>coefficient of performance</b> (COP) compares the cooling you get to the energy you put in:</p><p class="lsKey">COP = NRE ÷ HOC</p><p>Here: ${K.f1(c0.NRE)} ÷ ${K.f1(c0.HOC)} = <b>${K.f2(c0.COP)} : 1</b>. For every Btu of compressor work, the system moves ${K.f2(c0.COP)} Btu of heat.</p><p>This is the cycle's COP. The whole unit's real COP is lower, because fans, the motor and controls use power too.</p>`,
  math:`<p>EER (Btu/h per watt) = COP × 3.412. A cycle COP of ${K.f2(c0.COP)} would be an EER of ${K.f1(c0.COP*3.412)} before fan and motor losses.</p>`,draw:()=>view(c0,{nre:true,hoc:true,cop:true})},
 {t:"Head pressure up, COP down",
  body:`<p>Raise the condensing temperature (a hot day, a dirty condenser, overcharge) and watch two things happen at once:</p><ul><li>The compression line gets <b>longer</b>: more HOC.</li><li>The liquid enters the evaporator with more heat, so <b>NRE shrinks</b>: more flash gas.</li></ul><p>Both push COP down. Drag the condensing temperature.</p>`,
  init:{tc:105},ctl:{html:`<div class="row"><label for="ls_tc">Condensing temperature</label><output id="lso_tc">105°F</output><input type="range" id="ls_tc" min="85" max="140" step="5" value="105"></div>`,input:(t,s)=>{s.tc=+t.value;document.getElementById("lso_tc").textContent=t.value+"°F"}},
  draw:s=>{const c=RF.cycle(n,{...B,Tc:s.tc??105});return view(c,{ghost:c0,nre:true,hoc:true,cop:true})}},
 {t:"Three ways to raise COP",
  body:`<ul><li><b>Lower the lift:</b> a clean condenser, a cooler condenser, the right charge. Smaller HOC, bigger NRE.</li><li><b>More subcooling:</b> slides the liquid point left, so less flash gas and a bigger NRE with no extra compressor work.</li><li><b>A better compressor:</b> a steeper compression line, closer to the green constant-entropy line.</li></ul><p>Drag the subcooling to see the second one.</p>`,
  init:{sc:10},ctl:{html:`<div class="row"><label for="ls_sc">Subcooling</label><output id="lso_sc">10°F</output><input type="range" id="ls_sc" min="0" max="30" step="2" value="10"></div>`,input:(t,s)=>{s.sc=+t.value;document.getElementById("lso_sc").textContent=t.value+"°F"}},
  draw:s=>{const c=RF.cycle(n,{...B,sc:s.sc??10});return view(c,{ghost:c0,nre:true,cop:true})}}];
const see=K.see({vb:"0 0 720 400",init:{Te:40,Tc:105,sh:10,sc:10,eff:70},
 sliders:[["Te","Evaporating",20,55,1,v=>v+"°F"],["Tc","Condensing",80,140,1,v=>v+"°F"],["sh","Superheat",0,30,1,v=>v+"°F"],["sc","Subcooling",0,30,1,v=>v+"°F"],["eff","Compressor efficiency",45,90,1,v=>v+"%"]],
 model:S=>RF.cycle(n,{Te:S.Te,Tc:S.Tc,sh:S.sh,sc:S.sc,eff:S.eff/100}),draw:c=>view(c,{ghost:c0,nre:true,hoc:true,cop:true}),
 reads:c=>[["NRE",K.f1(c.NRE)+" Btu/lb"],["HOC",K.f1(c.HOC)+" Btu/lb"],["Heat of rejection",K.f1(c.HOR)+" Btu/lb"],["COP",K.f2(c.COP)+" : 1"],["Suction",K.f0(c.Ps-14.7)+" psig"],["Head",K.f0(c.Pd-14.7)+" psig"]],
 note:c=>`Dashed: the starting cycle (COP ${K.f2(c0.COP)}).`,log:[["Evap",(c,S)=>S.Te],["Cond",(c,S)=>S.Tc],["SC",(c,S)=>S.sc],["NRE",c=>K.f1(c.NRE)],["HOC",c=>K.f1(c.HOC)],["COP",c=>K.f2(c.COP)]]});
const tasks=[
 K.goal({t:"Squeeze more out of each pound",intro:"Keep <b>40°F</b> evaporating, <b>105°F</b> condensing and <b>70%</b> efficiency. Get NRE above <b>80 Btu/lb</b>.",
  check:(S,c)=>S.Te!==40||S.Tc!==105||S.eff!==70?"Keep 40°F, 105°F and 70%.":c.NRE>80?true:`NRE ${K.f1(c.NRE)}. Which change moves point 5 left?`,ok:(S,c)=>`${K.f1(c.NRE)} Btu/lb with ${S.sc}°F subcooling, and HOC didn't change: COP went up for free.`}),
 K.goal({t:"Hit a COP of 6",intro:"Keep 40°F evaporating, 10°F superheat and 70% efficiency. Reach a cycle COP of <b>6.0</b> or more without going below <b>85°F</b> condensing.",
  check:(S,c)=>S.Te!==40||S.sh!==10||S.eff!==70?"Keep 40°F evaporating, 10°F superheat, 70%.":S.Tc<85?"85°F condensing is the lowest allowed.":c.COP>=6?true:`COP ${K.f2(c.COP)}.`,ok:(S,c)=>`COP ${K.f2(c.COP)} at ${S.Tc}°F condensing and ${S.sc}°F subcooling. Low head pressure plus subcooling is what a clean, well-charged condenser on a cool day gives you.`}),
 K.caseTask({t:"Service call: power bill up, same cooling",intro:"A rooftop unit cools as well as last summer, but the energy meter says it uses more power. Today's readings, plotted on the chart:",
  state:{},model:()=>RF.cycle(n,{Te:41,Tc:128,sh:9,sc:11,eff:0.7}),draw:c=>view(c,{ghost:c0,hoc:true,cop:true}),reads:c=>[["Suction",K.f0(c.Ps-14.7)+" psig"],["Head",K.f0(c.Pd-14.7)+" psig"],["Superheat",K.f0(c.sh)+"°F"],["Subcooling",K.f0(c.sc)+"°F"],["COP",K.f2(c.COP)]],
  actions:[["Look at the condenser coil",()=>"Matted with cottonwood fluff on the air inlet side."]],causes:[["cond","Dirty condenser coil"],["low","Low charge"],["evap","Dirty evaporator coil"],["comp","Worn compressor"]],ans:"cond",
  why:"Head pressure is high with normal superheat and subcooling, so the charge is fine. The condenser can't reject heat: the compression line is longer (more HOC) and COP fell from about 4.3 to 3. Clean the coil.",hint:"Superheat and subcooling are normal. Which pressure moved?"})];
window.LESSON={id:"ph-energy",sec:"P-H charts",secHref:"/ph-chart/",title:"NRE, HOC, heat of rejection and COP",lead:"Read the cycle's energy off the chart: what each pound picks up, what the compressor adds, what the condenser dumps, and the ratio you pay for.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["The three enthalpies from your plotted cycle: entering evap, entering comp, leaving comp."],
  table:[["Number","Formula","Typical AC (R-410A)"],["NRE","h1 − h6","70 to 80 Btu/lb"],["HOC","h2 − h1","13 to 20 Btu/lb"],["Heat of rejection","h2 − h5 = NRE + HOC","85 to 100 Btu/lb"],["Cycle COP","NRE ÷ HOC","3.5 to 6 (unit COP lower)"]],tableT:"Formulas and typical values",
  mistakes:["Mixing up which point is which: NRE starts at the evaporator inlet, not the liquid line's saturated point.","Comparing a cycle COP to a unit's rated EER without the 3.412 factor and fan power.","Reading enthalpies from a chart with a different reference point."]}),
 sources:[["The Engineering Mindset: design a refrigeration system","https://theengineeringmindset.com/design-a-refrigeration-system/"],["The Engineering Mindset: heat pump design data","https://theengineeringmindset.com/heat-pump-design-data/"],["NIST Chemistry WebBook: thermophysical properties of fluids","https://webbook.nist.gov/chemistry/fluid/"]]};
})();
