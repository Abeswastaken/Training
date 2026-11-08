/* ============ Lesson: Approach, LMTD and effectiveness ============ */
(()=>{
const W=(arr,UA,gh,gc,Th=180,Tc=60)=>HXK.water({arr,Th,Tc,gh,gc,UA});
const n0=x=>Math.round(x).toLocaleString("en-US");
/* step 1: a hot water pipe through a coil, and a duct with a heating coil */
const loads=()=>{const g=K.uid("m");let s=`<defs>${HXK.metal(g)}</defs>`;
 s+=HXK.pipe("M40 80 H300",HXK.tc(180),9)+HXK.pipe("M420 80 H680",HXK.tc(160),9);
 s+=`<rect x="300" y="50" width="120" height="60" rx="6" fill="url(#${g})" stroke="${HXK.SE}"/>`+K.lbl(360,86,"COIL",{size:13});
 s+=HXK.read(150,82,"12.0 gpm","FLOW",92)+HXK.read(250,82,"180°F","IN",76)+HXK.read(500,82,"160°F","OUT",76);
 s+=K.lbl(360,148,"WATER: Q = 500 × 12 GPM × 20°F = 120,000 BTU/H",{size:15})+K.txt(360,172,"120 MBH, or 10 tons (12,000 BTU/h per ton)");
 s+=`<rect x="40" y="208" width="640" height="84" fill="${HXK.ta(75)}" opacity=".16" stroke="${HXK.SE}" stroke-width="1.5"/>`;
 s+=`<rect x="330" y="212" width="60" height="76" fill="url(#zFins)" stroke="${HXK.SE}"/>`;
 [228,250,272].forEach(y=>{s+=HXK.pipe(`M60 ${y} H320`,HXK.ta(55),4)+HXK.pipe(`M400 ${y} H660`,HXK.ta(95),4)});
 s+=HXK.read(150,250,"1,000 cfm","",100)+HXK.read(250,250,"55°F","",70)+HXK.read(500,250,"95°F","",70);
 s+=K.lbl(360,332,"AIR: Q = 1.08 × 1,000 CFM × 40°F = 43,200 BTU/H",{size:15})+K.txt(360,356,"sensible heat only: the air's temperature change");
 return s};
const steps=[
 {t:"How much heat: 500 and 1.08",
  body:`<p>To know how much heat an exchanger moves, measure one side: its flow and its temperature change (<b>ΔT</b>).</p><ul><li>Water: <b>Q = 500 × gpm × ΔT</b> (BTU/h)</li><li>Air: <b>Q = 1.08 × cfm × ΔT</b> (BTU/h, sensible)</li></ul><p>Heat lost by the hot side equals heat gained by the cold side. If your two sides don't agree within about 10%, a thermometer or the flow number is wrong.</p>`,
  math:`<p>500 = 8.33 lb per gallon × 60 minutes per hour × 1 BTU per lb·°F.</p><p>1.08 = 0.075 lb per ft³ × 60 minutes per hour × 0.24 BTU per lb·°F (standard air).</p><p>Glycol carries less heat per gallon: use the manufacturer's factor (about 450 to 470 for 30 to 50% glycol) instead of 500.</p>`,
  draw:loads},
 {t:"Approach",
  body:`<p>The <b>approach</b> is how close the two fluids get: the smallest temperature difference anywhere in the exchanger. In counterflow it's at one end or the other.</p><p>A small approach means a big, clean, efficient exchanger. Plate exchangers run 1 to 5°F; shell-and-tube about 5 to 10°F.</p><p>Approach is the best health check you have: when it creeps up at the same load, the surface is fouling.</p>`,
  draw:()=>{const R=W("cf",30000,20,22,60,45);return HXK.prof(R,{x:80,y:40,w:560,h:270,lo:40,hi:65,step:5,mark:"appr",title:"PLATE EXCHANGER: BUILDING LOOP COOLED BY TOWER WATER"})}},
 {t:"LMTD: the average push",
  body:`<p>The temperature difference changes along the exchanger, so which one do you use? Not the plain average: the curves bend. The right average is the <b>log mean temperature difference (LMTD)</b>.</p><p>Take the difference at each end, <b>ΔT1</b> and <b>ΔT2</b>, then:</p><p><b>LMTD = (ΔT1 − ΔT2) / ln(ΔT1 / ΔT2)</b></p><p>It's always a little less than the plain average. When the two ends are equal, LMTD is just that number.</p>`,
  math:`<p>Here: ΔT1 = 180 − 140 = 40°F at the hot inlet end, ΔT2 = 130 − 60 = 70°F at the other end. Watch which ends: in counterflow, hot in pairs with cold out.</p>`,
  draw:()=>{const R=W("cf",4664,10,6.25);const L=R.lmtd;return HXK.prof(R,{x:80,y:40,w:420,h:270,lo:40,hi:200,step:20,mark:"ends"})+
   `<rect x="524" y="70" width="186" height="200" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(617,98,"LMTD",{size:15})+K.txt(617,128,`(${K.f1(R.d1)} − ${K.f1(R.d2)}) / ln(${K.f1(R.d1)}/${K.f1(R.d2)})`)+K.lcd(617,166,K.f1(L)+"°F",110)+K.txt(617,210,"plain average: "+K.f1((R.d1+R.d2)/2)+"°F")+K.txt(617,234,"LMTD is a bit less")}},
 {t:"Q = U × A × LMTD",
  body:`<p>How much heat goes through the wall depends on three things:</p><ul><li><b>U</b>: how easily heat gets through (metal, film on each side, any scale). BTU/h per ft² per °F.</li><li><b>A</b>: the surface area in ft².</li><li><b>LMTD</b>: the average push.</li></ul><p>Engineers lump U × A into one number, <b>UA</b>. Scale or fouling cuts U. Plugged tubes or fewer plates cut A.</p><p>Bigger isn't linear: as the exchanger grows, the outlets get close, the push shrinks, and each extra square foot does less.</p>`,
  draw:()=>{const f=(ua,foul)=>W("cf",ua*(foul?0.6:1),10,10).Q/1000;return K.chart({x:90,y:40,w:540,h:270,X:[0,30000],Y:[0,600],xt:[0,10000,20000,30000],xf:v=>v/1000+"k",yt:[0,100,200,300,400,500,600],xl:"UA (BTU/h·°F): bigger exchanger to the right",yl:"MBH",title:"HEAT MOVED, 180°F AND 60°F WATER, 10 GPM EACH",
   series:[{f:x=>x*120/1000<=600?x*120/1000:NaN,c:"var(--muted)",dash:"5 5",w:2,lbl:"if the push never shrank",lblAt:5000,a:"start",dx:10,dy:14},{f:x=>f(x,false),c:HXK.HOT,lbl:"clean",lblAt:26000,dy:-12},{f:x=>f(x,true),c:"#a0662a",lbl:"scaled (U down 40%)",lblAt:16000,a:"start",dx:0,dy:30}]})}},
 {t:"Effectiveness and NTU",
  body:`<p><b>Effectiveness (ε)</b> is the heat moved divided by the most that could ever move: the smaller-flow side going all the way to the other fluid's inlet temperature.</p><p><b>NTU</b> (number of transfer units) = UA ÷ the smaller flow's capacity (500 × gpm or 1.08 × cfm). It's the exchanger's size compared to the job.</p><p>The same NTU gives different ε depending on how the fluids run. With equal flows, parallel flow never passes 50%. Counterflow keeps climbing.</p>`,
  math:`<p>ε = Q / (C<sub>min</sub> × (T<sub>hot in</sub> − T<sub>cold in</sub>)), with C = 500 × gpm for water.</p><p>Counterflow: ε = (1 − e<sup>−NTU(1−Cr)</sup>) / (1 − Cr·e<sup>−NTU(1−Cr)</sup>), where Cr = C<sub>min</sub>/C<sub>max</sub>.</p><p>Steam or a condensing refrigerant (one side at a fixed temperature): ε = 1 − e<sup>−NTU</sup>, any arrangement.</p>`,
  draw:()=>K.chart({x:90,y:40,w:540,h:270,X:[0,5],Y:[0,1],xt:[0,1,2,3,4,5],yt:[0,.2,.4,.6,.8,1],yf:v=>Math.round(v*100)+"%",xl:"NTU = UA / Cmin",yl:"effectiveness",title:"EFFECTIVENESS vs NTU",
   series:[{f:N=>HXK.eff("cond",N,0),c:"#a06a8a",lbl:"steam (one side fixed)",lblAt:2.2,dy:-12},{f:N=>HXK.eff("cf",N,1),c:HXK.COLD,lbl:"counterflow, equal flows",lblAt:4.9,dy:-14},{f:N=>HXK.eff("pf",N,1),c:"var(--muted)",lbl:"parallel, equal flows",lblAt:4.9,dy:22}],bands:[{y0:.49,y1:.51,c:"#c0392b"}]})},
 {t:"The temperature cross",
  body:`<p>In counterflow the cold fluid leaves next to the incoming hot fluid. So it can leave <b>hotter than the hot fluid leaves</b>. That's a <b>temperature cross</b>.</p><p>Here 60°F water is heated to 150°F while the 180°F water cools to 90°F. Parallel flow can't do this: the cold outlet always stays below the hot outlet.</p><p>Close approaches and crosses are why plate exchangers are used for free cooling and DHW.</p>`,
  draw:()=>{const R=W("cf",15000,10,10);return HXK.prof(R,{x:80,y:40,w:560,h:270,lo:40,hi:200,step:20,mark:"",title:"COUNTERFLOW WITH A TEMPERATURE CROSS"})+`<path d="M80 ${40+270-(R.Tco-40)/160*270} H640" stroke="${HXK.COLD}" stroke-dasharray="3 5" opacity=".7"/><path d="M80 ${40+270-(R.Tho-40)/160*270} H640" stroke="${HXK.HOT}" stroke-dasharray="3 5" opacity=".7"/>`+K.tag(96,40+270-(66-40)/160*270+6,"COLD OUT "+K.f0(R.Tco)+"°F > HOT OUT "+K.f0(R.Tho)+"°F",{a:"start",fill:"var(--ok)"})}}];
/* ---------- See it ---------- */
const mdl=S=>{const R=W(S.arr?"cf":"pf",S.ua*1000,S.gh,S.gc,S.th,S.tc);return {...R,Qh:500*S.gh*(R.Th-R.Tho),Qc:500*S.gc*(R.Tco-R.Tc)}};
const box=(R,S)=>{const x=500;let s=`<rect x="${x}" y="30" width="212" height="330" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`;const ln=(y,t,o={})=>K.txt(x+12,y,t,{a:"start",fill:o.fill});const hd=(y,t)=>K.lbl(x+12,y,t,{a:"start",size:12});
 s+=hd(54,"HOT SIDE: 500 × GPM × ΔT")+ln(76,`500 × ${S.gh} × ${K.f1(R.Th-R.Tho)} = ${K.f0(R.Qh/1000)} MBH`);
 s+=hd(108,"COLD SIDE")+ln(130,`500 × ${S.gc} × ${K.f1(R.Tco-R.Tc)} = ${K.f0(R.Qc/1000)} MBH`);
 s+=hd(162,"LMTD")+ln(184,`ΔT1 ${K.f1(R.d1)}, ΔT2 ${K.f1(R.d2)}`)+ln(206,`LMTD = ${K.f1(R.lmtd)}°F`);
 s+=hd(238,"Q = UA × LMTD")+ln(260,`${n0(R.UA)} × ${K.f1(R.lmtd)} = ${K.f0(R.UA*R.lmtd/1000)} MBH`);
 s+=hd(292,"EFFECTIVENESS")+ln(314,`NTU ${K.f2(R.NTU)}, Cr ${K.f2(R.Cr)}`)+ln(336,`ε = ${K.f0(R.e*100)}%`);return s};
const see=K.see({vb:"0 0 720 380",init:{arr:1,ua:4,th:180,gh:10,tc:60,gc:10},
 sliders:[["arr","Piped as",0,1,1,v=>v?"Counterflow":"Parallel flow"],["ua","Size (UA)",1,40,1,v=>v+",000 BTU/h·°F"],["th","Hot water in",100,200,1,v=>v+"°F"],["gh","Hot water flow",2,30,1,v=>v+" gpm"],["tc","Cold water in",40,120,1,v=>v+"°F"],["gc","Cold water flow",2,30,1,v=>v+" gpm"]],
 model:mdl,draw:(R,S)=>HXK.prof(R,{x:62,y:30,w:410,h:300,lo:30,hi:210,step:20,mark:"appr",xl:"along the exchanger"})+box(R,S),
 reads:R=>[["Heat moved",K.f0(R.Q/1000)+" MBH"],["LMTD",K.f1(R.lmtd)+"°F"],["Closest approach",K.f1(R.appr)+"°F"],["Effectiveness",K.f0(R.e*100)+"%"],["Hot out",K.f1(R.Tho)+"°F"],["Cold out",K.f1(R.Tco)+"°F"],["NTU",K.f2(R.NTU)],["Temperature cross",R.cross?"Yes":"No"]],
 note:R=>R.cross?"Temperature cross: cold out is above hot out.":R.arr==="pf"?"Parallel flow: cold out can never pass hot out.":"",
 log:[["UA",(R,S)=>S.ua+"k"],["ε",R=>K.f0(R.e*100)+"%"],["LMTD",R=>K.f1(R.lmtd)],["MBH",R=>K.f0(R.Q/1000)]]});
/* service call: a plate exchanger rated UA 20,000 at 20 gpm each side, now fouled */
const caseM=()=>W("cf",11500,20,20,180,120);
const tasks=[
 K.goal({t:"Make a temperature cross",intro:"In See it, get the cold water to leave <b>hotter than the hot water leaves</b>. Then switch to parallel flow and try again.",
  check:(S,R)=>!S.arr?"Parallel flow can't cross: the outlets only meet. Switch back to counterflow.":R.cross?true:`Cold out ${K.f1(R.Tco)}°F, hot out ${K.f1(R.Tho)}°F. More surface, or change the flows.`,
  ok:(S,R)=>`Cold out ${K.f1(R.Tco)}°F, hot out ${K.f1(R.Tho)}°F, NTU ${K.f2(R.NTU)}. With equal flows a cross starts once ε passes 50%.`}),
 K.goal({t:"What 85% costs",intro:"With <b>180°F and 60°F</b> water at <b>10 gpm each</b>, counterflow, make the exchanger just big enough for <b>85% effectiveness</b>. Log a reading at 70% on the way, then at 85%.",
  check:(S,R,L)=>{if(S.gh!==10||S.gc!==10||S.th!==180||S.tc!==60)return "Use 180°F and 60°F at 10 gpm each.";if(!S.arr)return "Counterflow.";const a=L.some(l=>l.S.arr&&l.S.gh===10&&l.S.gc===10&&l.S.th===180&&l.S.tc===60&&Math.abs(l.R.e-.7)<.03);if(!a)return "Log a reading near 70% first (within 3%).";return R.e<.85?`ε is ${K.f0(R.e*100)}%. Bigger.`:true},
  ok:(S,R)=>`About 12,000 UA gives 70%, and it takes about ${S.ua},000 for 85%: more than twice the surface for 15 more points. That's why exchangers are rarely sized for very close approaches unless the job needs it.`}),
 K.caseTask({t:"Service call: is the plate exchanger fouled?",intro:"A plate exchanger heats a 120°F loop from 180°F boiler water, 20 gpm each side. The submittal says UA = 20,000 BTU/h·°F at these flows. The loop is running cooler than it used to.",
  state:{},model:caseM,draw:R=>HXK.prof(R,{x:80,y:40,w:560,h:270,lo:110,hi:190,step:10,mark:"appr",title:"MEASURED TEMPERATURES"}),
  reads:R=>[["Boiler water",K.f0(R.Th)+" → "+K.f1(R.Tho)+"°F"],["Loop water",K.f0(R.Tc)+" → "+K.f1(R.Tco)+"°F"],["Flows","20 gpm each"],["Approach",K.f1(R.appr)+"°F",true]],
  actions:[["Work out Q on both sides",R=>`Hot side 500 × 20 × ${K.f1(R.Th-R.Tho)} = ${n0(500*20*(R.Th-R.Tho))} BTU/h. Cold side 500 × 20 × ${K.f1(R.Tco-R.Tc)} = ${n0(500*20*(R.Tco-R.Tc))} BTU/h. They agree.`],["Work out LMTD and UA",R=>`LMTD = ${K.f1(R.lmtd)}°F. UA = Q / LMTD = ${n0(R.Q)} / ${K.f1(R.lmtd)} = ${n0(R.Q/R.lmtd)} BTU/h·°F, against 20,000 when new.`],["Check the flows",R=>"Pressure drop on both sides matches the submittal at 20 gpm. Strainers clean."]],
  causes:[["foul","Fouled plates (U has dropped)"],["sensor","A bad thermometer"],["flow","Low flow on one side"],["backward","Piped parallel"]],ans:"foul",
  why:"Both sides agree, so the thermometers are fine, and the flows are at design. The UA has fallen to about 58% of new: the plates are fouled. Clean them (CIP or open and clean) and trend the approach afterward.",hint:"Do the heat balance first, then the UA. Which number changed?"})];
window.LESSON={id:"hx-lmtd",sec:"Heat exchangers",secHref:"/hx/",title:"Approach, LMTD and effectiveness",lead:"The numbers that tell you how hard an exchanger is working and whether it is still clean: Q, approach, LMTD, UA and effectiveness.",
 steps,see,tryIntro:"Two in See it, then a fouling call worked out with the formulas.",tasks,
 job:K.job({read:["Four temperatures (both inlets, both outlets).","Flow on at least one side: balancing valve, flow meter, or pressure drop against the submittal curve.","The submittal or nameplate: design flows, temperatures, pressure drops and capacity."],
  table:[["Number","How to get it","What it tells you"],["Q","500 × gpm × ΔT (water), 1.08 × cfm × ΔT (air)","Heat moved. Hot and cold sides should agree within about 10%."],["Approach","Smallest difference between hot and cold","Plate 1 to 5°F, shell-and-tube 5 to 10°F. Rising at the same load = fouling."],["LMTD","(ΔT1 − ΔT2) / ln(ΔT1/ΔT2)","Average push. Needed to work out UA."],["UA","Q / LMTD","Compare to the submittal. Falling UA = scale, fouling or air."],["ε","Q / (Cmin × (hot in − cold in))","How close to perfect, 0 to 100%."]],tableT:"The numbers",
  steps:["Read all four temperatures at steady load.","Work out Q on both sides. If they disagree, fix the readings before going further.","Work out LMTD from the two end differences (counterflow: hot in with cold out, hot out with cold in).","UA = Q ÷ LMTD. Compare to the design value or to your last reading.","Log the approach so the next tech can see the trend."],stepsT:"Checking an exchanger",
  safety:["Hot water and steam piping burn. Use probes, gloves and eye protection.","Don't open thermowells or test ports on a pressurized system without the right fitting."],
  mistakes:["Using the plain average instead of LMTD (small error) or pairing the wrong ends in counterflow (big error).","Using 500 for glycol: use the manufacturer's factor.","Calling a low approach good when the flow on one side has dropped: check flow first.","Trusting one thermometer: always check the heat balance."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["The Engineering ToolBox: arithmetic and logarithmic mean temperature difference","https://engineeringtoolbox.com/arithmetic-logarithmic-mean-temperature-d_436.html"],["Alfa Laval: troubleshooting for plate heat exchangers","https://www.alfalaval.com/service-and-support/product-services/plate-heat-exchanger-services/troubleshooting-for-plate-heat-exchangers/"]]};
})();
