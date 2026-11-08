/* ============ Lesson: Hot water boiler basics ============ */
(()=>{
/* system pressure for a 30 gal loop on a 4.4 gal tank, filled cold at 12 psi (tank charged to 12 psi) */
const sysP=avg=>{const dV=30*B.exp(50,avg),Vt=4.4;return Math.min(31,(12+B.ATM)*Vt/(Vt-dV)-B.ATM)};
const base=(x,y,w)=>`<rect x="${x}" y="${y-22}" width="${w}" height="40" rx="3" fill="url(#zCab)" stroke="#8d969c"/><rect x="${x+4}" y="${y-18}" width="${w-8}" height="8" fill="url(#zGrille)" opacity=".8"/>`+Array.from({length:Math.floor(w/9)},(_,i)=>`<path d="M${x+6+i*9} ${y-6} v18" stroke="#aab2b7" stroke-width="2"/>`).join("");
/* the loop: boiler, supply up and across to baseboard, return through the circulator */
const loop=(o={})=>{const on=o.on!==false,sup="M150 144 V82 H660 V292 H640",ret="M430 292 H350 V326 H200";let s="";
 s+=`<path d="M10 352 H710" stroke="var(--line)" stroke-dasharray="2 4"/><rect x="400" y="200" width="300" height="148" fill="rgba(233,228,214,.22)" stroke="var(--line)" stroke-dasharray="6 4"/>`+B.L(414,222,"HEATED ROOM",{a:"start"});
 s+=B.pipe(sup,B.HOT,9)+B.flow(sup,on)+B.pipe(ret,B.RET,9)+B.flow(ret,on);
 s+=base(430,292,214)+B.boiler(60,150,130,190,{name:"BOILER",fire:o.fire!==false});
 s+=B.pump(290,326,on);
 if(o.labels!==false){s+=B.L(400,70,"SUPPLY (HOT WATER OUT)",{fill:B.HOT})+B.L(240,368,"RETURN (COOLER WATER BACK)",{fill:B.RET})+B.co(300,300,330,256,"CIRCULATOR",{a:"start"})+B.L(537,330,"BASEBOARD",{})}
 return s};
const steps=[
 {t:"A closed loop of hot water",
  body:`<p>A hot water boiler heats water and a pump pushes it around a <b>closed loop</b>: out to the baseboard or radiators, and back to the boiler. The same water goes around again and again.</p><ul><li><b>Supply</b>: hot water leaving the boiler, often 140 to 180°F.</li><li><b>Return</b>: water coming back after it gave up heat to the room.</li><li><b>Circulator</b>: the pump that moves it. Without flow, the heat stays in the boiler.</li></ul><p>In the trade this is <b>hydronic</b> heat.</p>`,
  draw:()=>loop()},
 {t:"The parts on a hot water boiler",
  body:`<p>Walk up to almost any residential hot water boiler and you'll find the same parts:</p><ul><li><b>Relief valve</b> on top: opens at 30 psi.</li><li><b>Temperature and pressure gauge</b> (a tridicator).</li><li><b>Operating control and high limit</b> (aquastat): burner on and off by water temperature.</li><li><b>Expansion tank</b>, <b>air separator</b> with a vent, and the <b>fill valve</b> with a backflow preventer on the cold water feed.</li><li><b>Low-water cutoff</b>: shuts the burner off if the water is gone.</li></ul>`,
  draw:()=>{let s=`<path d="M10 360 H710" stroke="var(--line)" stroke-dasharray="2 4"/>`;
   s+=B.pipe("M350 144 V80 H700",B.HOT,10)+B.pipe("M700 360 V290 H406",B.RET,10)+B.pipe("M480 104 V140",B.HOT,7)+B.pipe("M30 300 H230",B.COLD,6);
   s+=B.boiler(230,150,170,200,{name:"BOILER"});
   s+=B.relief(262,144,{s:.8})+B.gauge(375,200,18,18,60,"PSI",{red:30});
   s+=`<rect x="240" y="215" width="40" height="46" rx="5" fill="url(#bkBlackV)" stroke="#000"/><rect x="246" y="221" width="28" height="14" rx="2" fill="#15191c"/><text x="260" y="232" class="lsGn" style="fill:#7CFFB2;font-size:9px">180</text>`;
   s+=`<rect x="314" y="100" width="30" height="26" rx="5" fill="url(#bkBlackV)" stroke="#000"/><circle cx="324" cy="113" r="3.5" fill="#2fbf5a"/>`;
   s+=`<rect x="465" y="56" width="30" height="50" rx="12" fill="url(#zSteel)" stroke="#3f474c"/>`+B.vent(480,56)+B.tank(480,150,46,100,.3,{hang:true})+B.pump(600,80);
   s+=`<rect x="138" y="288" width="26" height="24" rx="5" fill="url(#zBrassH)" stroke="#6a4a12"/><rect x="58" y="290" width="44" height="20" rx="8" fill="url(#zBrassH)" stroke="#6a4a12"/>`;
   s+=B.co(262,44,200,30,"RELIEF VALVE 30 PSI")+B.co(314,112,296,70,"LOW-WATER CUTOFF")+B.co(375,218,420,334,"TEMP / PRESSURE GAUGE",{a:"start"})+B.co(240,238,180,210,"AQUASTAT")+B.co(488,26,530,22,"AIR VENT",{a:"start"})+B.co(495,96,530,124,"AIR SEPARATOR",{a:"start"})+B.co(503,200,540,214,"EXPANSION TANK",{a:"start"})+B.co(616,56,650,44,"PUMP",{a:"start"})+B.co(151,288,151,252,"FILL VALVE",{a:"middle",dy:-5})+B.co(80,310,80,342,"BACKFLOW PREVENTER",{a:"middle",dy:13})+B.L(700,104,"SUPPLY",{a:"end",fill:B.HOT})+B.L(690,280,"RETURN",{a:"end",fill:B.RET})+B.L(30,288,"COLD WATER",{a:"start",fill:B.COLD});
   return s}},
 {t:"Supply, return and ΔT",
  body:`<p>The difference between supply and return is the <b>temperature drop</b>, written <b>ΔT</b> ("delta T"). Most residential systems are designed for a <b>20°F ΔT</b>.</p><p>Flow and ΔT together tell you how much heat the water carries:</p><p><b>Btu/h = 500 × gpm × ΔT</b></p><p>10 gpm with a 20°F drop moves 100,000 Btu/h. Same heat with half the flow means double the ΔT. A wide ΔT usually means low flow: a weak pump, air, or a closed valve.</p>`,
  math:`<p>500 = 8.33 lb per gallon × 60 minutes per hour × 1 Btu per lb per °F (specific heat of water).</p><p>Example: 100,000 ÷ (500 × 10) = 20°F.</p>`,
  draw:()=>{let s=B.pipe("M40 120 H680",B.HOT,22)+B.flow("M40 120 H680")+B.pipe("M680 270 H40",B.RET,22)+B.flow("M680 270 H40");
   s+=K.lcd(200,80,"180°F",100,"")+B.L(200,50,"SUPPLY")+K.lcd(200,320,"160°F",100,"")+B.L(200,356,"RETURN")+B.box(370,150,280,96,"500 × 10 GPM × 20°F","100,000 BTU/H",{vs:26});
   s+=`<path d="M700 120 V270" stroke="var(--muted)" stroke-width="1.5"/>`+B.L(700,200,"ΔT 20°F",{a:"end"})+B.L(420,80,"10 GPM",{a:"start"});
   return s}},
 {t:"Pressure: 12 psi cold, under 30 hot",
  body:`<p>The loop is sealed and full of water under pressure, usually about <b>12 psi</b> cold in a house. Pressure does two jobs:</p><ul><li>It lifts water to the <b>top of the system</b> with a few psi left over, so air can't get in.</li><li>It raises the <b>boiling point</b>. At 12 psi water boils near 244°F, well above a 180°F supply.</li></ul><p>When the water heats it expands, the <b>expansion tank</b> takes it, and the pressure rises a few psi. It must stay below the <b>30 psi relief valve</b>.</p>`,
  draw:()=>{const g=(x,v,t,c)=>B.gauge(x,170,62,v,60,"PSI",{red:30})+B.L(x,270,t)+B.L(x,292,K.f0(v)+" PSI",{fill:c,size:16});
   return g(130,12,"COLD FILL","var(--cold)")+g(360,sysP(170),"HOT, RUNNING","var(--ok)")+g(590,30,"RELIEF OPENS","var(--bad)")+K.txt(360,340,"30 gal loop, 4.4 gal expansion tank, heated from 50°F to 170°F average")}},
 {t:"Controls and safeties",
  body:`<p>Each control has one job. From the one that works every day to the last line of defense:</p><ul><li><b>Operating control</b> (aquastat): fires the burner to hold the water at its setting, often 160 to 180°F.</li><li><b>High limit</b>: shuts the burner off if the water gets too hot, often set near 200°F; many are manual reset.</li><li><b>Low-water cutoff</b>: no water, no fire.</li><li><b>Relief valve</b>: dumps water if pressure reaches 30 psi.</li></ul><p>If a high limit or relief valve has tripped, something upstream failed. Find it before you reset.</p>`,
  draw:()=>K.cards([
   {t:"OPERATING CONTROL",c:"var(--ok)",inner:`<rect x="20" y="44" width="80" height="80" rx="6" fill="url(#bkBlackV)"/><rect x="30" y="56" width="60" height="26" rx="3" fill="#15191c"/><text x="60" y="75" class="lsLcd" style="font-size:15px">180°F</text>`+B.L(120,80,"BURNER ON BELOW,",{a:"start"})+B.L(120,100,"OFF ABOVE SETTING",{a:"start"}),note:"runs every cycle"},
   {t:"HIGH LIMIT",c:"var(--warn)",inner:`<rect x="20" y="44" width="80" height="80" rx="6" fill="url(#zCab)" stroke="#8d969c"/><circle cx="60" cy="74" r="20" fill="#f7f6f0" stroke="#555"/><circle cx="84" cy="54" r="8" fill="url(#bkRedV)"/>`+B.L(120,80,"OPENS NEAR 200°F",{a:"start"})+B.L(120,100,"OFTEN MANUAL RESET",{a:"start"}),note:"backs up the operating control"},
   {t:"LOW-WATER CUTOFF",c:"var(--bad)",inner:`<rect x="20" y="96" width="120" height="16" fill="url(#zSteelH)"/><rect x="66" y="56" width="28" height="40" rx="4" fill="url(#bkBlackV)"/><rect x="77" y="112" width="6" height="22" fill="#c9ced2"/>`+B.L(160,80,"NO WATER AT",{a:"start"})+B.L(160,100,"THE PROBE: NO FIRE",{a:"start"}),note:"protects the heat exchanger"},
   {t:"RELIEF VALVE",c:"var(--bad)",inner:B.relief(70,140,{s:.85})+B.L(160,80,"OPENS AT 30 PSI",{a:"start"})+B.L(160,100,"LAST LINE OF DEFENSE",{a:"start"}),note:"never plug or cap it"}])},
 {t:"Cast iron and condensing boilers",
  body:`<p>Burning natural gas makes water vapor. If the flue gas touches a surface below about <b>130°F</b>, that vapor condenses into acidic water.</p><ul><li><b>Cast iron and steel boilers</b> can't take that. Keep the return water above about <b>130 to 140°F</b> or the sections rot from the fire side.</li><li><b>Condensing boilers</b> are built for it, with stainless or aluminum heat exchangers and a drain. They're most efficient with <b>cool return water</b>, so they're often run on outdoor reset.</li></ul>`,
  draw:()=>K.chart({x:90,y:50,w:560,h:250,X:[80,180],Y:[80,100],xt:[80,100,120,140,160,180],xf:v=>v+"°F",yt:[80,85,90,95,100],yf:v=>v+"%",title:"TYPICAL CONDENSING BOILER EFFICIENCY",xl:"return water temperature",
   vlines:[{x:130,c:"var(--bad)",lbl:"flue gas dew point about 130°F"}],
   series:[{f:t=>t<=130?96.5-(t-80)*0.08-Math.max(0,t-110)*0.25:87.5-(t-130)*0.04,c:"#c0392b",lbl:"condensing range",lblAt:96,dy:-14,a:"start",dx:-10}]})}];
const see=K.see({init:{q:100,gpm:5,ret:150},
 sliders:[["q","Boiler output",40,200,10,v=>v+",000 Btu/h"],["gpm","Flow",2,15,0.5,v=>K.f1(v)+" gpm"],["ret","Return water",100,180,2,v=>v+"°F"]],
 model:S=>{const dT=S.q*1000/(500*S.gpm),sup=S.ret+dT,trip=sup>200;const avg=Math.min(200,(S.ret+Math.min(sup,200))/2);return {dT,sup,trip,cond:S.ret<130,P:sysP(avg),q:S.q*1000}},
 draw:(R,S)=>{let s=loop({labels:true,fire:!R.trip});s+=K.lcd(590,58,R.trip?"> 200°F":K.f0(R.sup)+"°F",98)+K.lcd(400,328,K.f0(S.ret)+"°F",86)+B.gauge(240,200,22,R.P,60,"PSI",{red:30})+B.L(240,244,K.f0(R.P)+" PSI",{size:12});
  s+=B.L(530,176,K.f1(S.gpm)+" GPM, ΔT "+K.f0(R.dT)+"°F",{size:14});
  if(R.trip)s+=K.tag(125,128,"HIGH LIMIT TRIPPED",{c:"bad",w:180});else if(R.cond)s+=K.tag(125,128,"FLUE GAS CONDENSING",{c:"bad",w:190});return s},
 reads:(R,S)=>[["Supply",R.trip?"over 200°F":K.f0(R.sup)+"°F",R.trip],["Return",S.ret+"°F",R.cond],["ΔT",K.f0(R.dT)+"°F",R.dT>40],["Heat carried",R.trip?"limit off":(Math.round(R.q/1000)).toLocaleString("en-US")+",000 Btu/h"],["Pressure",K.f0(R.P)+" psi"],["Burner",R.trip?"OFF (limit)":"firing",R.trip]],
 note:(R,S)=>R.trip?"Not enough flow to carry the heat away: the supply ran past the 200°F high limit. Think stuck pump, closed valve or air lock.":R.cond?"Return under 130°F: flue gas condenses inside a cast iron boiler. A condensing boiler would welcome it.":R.dT>40?"ΔT over 40°F: flow is low for this much heat.":"",
 log:[["Output",(R,S)=>S.q+"k"],["Flow",(R,S)=>K.f1(S.gpm)],["Supply",R=>R.trip?">200":K.f0(R.sup)],["ΔT",R=>K.f0(R.dT)]]});
const tasks=[
 K.goal({t:"Set a 20°F ΔT",intro:"In See it, set the boiler to <b>100,000 Btu/h</b> and find the flow that gives a <b>20°F ΔT</b>.",
  check:(S,R)=>S.q!==100?"Set the output to 100,000 Btu/h first.":Math.abs(R.dT-20)>1?`ΔT is ${K.f0(R.dT)}°F. Change the flow.`:true,ok:()=>"10 gpm. 500 × 10 × 20 = 100,000 Btu/h. That's the flow a circulator is picked for."}),
 K.goal({t:"Keep a cast iron boiler happy",intro:"At <b>120,000 Btu/h</b>, set it up so the return stays at <b>140°F or warmer</b> and the supply stays at <b>180°F or cooler</b>.",
  check:(S,R)=>S.q!==120?"Set the output to 120,000 Btu/h.":S.ret<140?"Return is under 140°F.":R.sup>180?`Supply is ${K.f0(R.sup)}°F. More flow narrows the ΔT.`:true,ok:(S,R)=>`ΔT ${K.f0(R.dT)}°F: no condensing in the boiler and plenty of room under the high limit.`}),
 K.goal({t:"Make the high limit trip",intro:"A stuck circulator is a common no-heat call. Cut the flow until the <b>high limit trips</b>, then press <b>Log reading</b>.",
  check:(S,R,L)=>L.some(r=>r.R.trip)?true:"Log a reading with the high limit tripped.",ok:"With almost no flow the boiler can't get rid of its heat, so the water overheats and the high limit opens. The fix is the flow, not the limit."})];
window.LESSON={id:"boil-basics",sec:"Boiler",secHref:"/boiler-trainer/",title:"Hot water boiler basics",lead:"How a hot water boiler heats a closed loop, what the parts on it do, and how flow and ΔT carry the heat.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders, then press Check.",tasks,
 job:K.job({read:["<b>Supply and return temperature</b>: a pipe thermometer or strap-on probe on each.","<b>Boiler pressure</b> on the temperature and pressure gauge, cold and hot.","<b>Aquastat settings</b>: operating setpoint, differential and high limit.","<b>Burner nameplate</b>: input and output (DOE heating capacity) in Btu/h."],
  table:[["Reading","Typical residential","Act when"],["Cold pressure","12 psi (more for tall buildings)","Under the fill pressure: find the leak"],["Hot pressure","15 to 25 psi","Near 30 psi: check the expansion tank"],["Supply","140 to 180°F","Over the high limit setting"],["ΔT","20°F design","Over 30 to 40°F: low flow"],["Return, cast iron","Over 130 to 140°F","Lower: flue gas condensing in the boiler"]],
  safety:["Shut off power and gas, and let the boiler cool before opening it up. The water is hot and under pressure.","Never cap, plug or valve off a relief valve.","Find out why a high limit or relief valve tripped before you reset or replace it."],
  mistakes:["Turning up the aquastat to fix a flow problem.","Reading a wide ΔT as good heat transfer instead of low flow.","Adding water to a hot system to get the pressure up, then finding it over 30 psi once it cools and refills."]}),
 sources:[["The Engineering Mindset: boiler system explained","https://theengineeringmindset.com/boiler-system-explained-lthw/"],["Caleffi idronics 12: hydronic fundamentals","https://www.caleffi.com/sites/default/files/media/external-file/Idronics_12_NA_Hydronic%20fundamentals%20.pdf"],["Watts 174A and 740 relief valve specification","https://literature.neuco.com/es-174a-740.pdf"]]};
})();
