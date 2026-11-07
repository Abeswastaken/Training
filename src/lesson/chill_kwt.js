/* ============ Lesson: kW per ton ============ */
(()=>{const P=v=>plant(v);const relief=l=>l>=1?85:l>=0.75?75+(l-0.75)*40:l>=0.5?65+(l-0.5)*40:65;
const iplv=f=>{const A=f(1,85),B=f(.75,75),C=f(.5,65),D=f(.25,65);return {A,B,C,D,v:1/(0.01/A+0.42/B+0.45/C+0.12/D)}};
const kw=(l,t)=>P({load:l,tset:t,wb:Math.min(78,t-6)}).kwt;
const curve=(fn)=>{const pts=[];for(let l=0.2;l<=1.001;l+=0.05)pts.push([l*100,fn(l)]);return pts};
const steps=[
 {t:"Power in, cooling out",
  body:`<p><b>kW per ton</b> is how many kilowatts of electricity the chiller uses for each ton of cooling it makes. Lower is better.</p><p>This 300-ton centrifugal uses about 163 kW at full load on a design day: 163 ÷ 300 = <b>0.54 kW per ton</b>. A good modern centrifugal is about 0.5 to 0.6 at full load; screw and air-cooled chillers are higher.</p>`,
  math:`<p>kW/ton = kW ÷ tons</p><p>COP = 3.517 ÷ kW/ton (0.54 kW/ton = COP 6.5)</p><p>EER = 12 ÷ kW/ton (0.54 kW/ton = EER 22)</p>`,
  draw:()=>{const R=P({});return chillerSVG(R,{labels:false})+K.tag(380,150,K.f0(R.kW)+" kW IN",{c:"bad",w:120})+K.tag(380,286,K.f0(R.Q)+" TONS OUT",{fill:"#2f6fd6",w:140})+K.tag(580,30,K.f2(R.kwt)+" kW PER TON",{c:"v",w:150})}},
 {t:"Measuring the tons",
  body:`<p>The panel often shows tons, but you can check it yourself from the chilled water:</p><p><b>tons = gpm × ΔT ÷ 24</b></p><p>720 gpm × (54 − 44) ÷ 24 = 300 tons. Read the kW from the starter's power meter or the panel. A flow meter that reads wrong or a bad temperature sensor makes kW per ton look wrong too.</p>`,
  math:`<p>The 24 comes from 500 × gpm × ΔT = Btu/h (500 = 8.33 lb/gal × 60 min/h × 1 Btu/lb°F), and 12,000 Btu/h per ton: 500 ÷ 12,000 = 1/24.</p>`,
  draw:()=>{const R=P({});return chillerSVG(R,{labels:false})+K.tag(380,286,"720 GPM × (54 − 44) ÷ 24 = 300 TONS",{fill:"#2f6fd6"})}},
 {t:"Part load and condenser water",
  body:`<p>kW per ton changes with load and with the tower water. If the tower water stays at 85°F, efficiency gets <b>worse</b> at light load.</p><p>In real life it's usually cooler when the load is light, so the tower makes colder water. With that <b>condenser relief</b>, a centrifugal is most efficient around 50 to 75% load.</p>`,
  draw:()=>K.chart({x:90,y:50,w:540,h:250,X:[20,100],Y:[0.3,0.8],xt:[20,40,60,80,100],yt:[0.3,0.4,0.5,0.6,0.7,0.8],xf:v=>v+"%",yf:v=>v.toFixed(1),xl:"load",yl:"kW per ton",title:"kW PER TON VS LOAD",
   series:[{pts:curve(l=>kw(l,85)),c:"#d23a26",lbl:"85°F TOWER WATER ALL THE TIME",lblAt:30,a:"start",dx:4,dy:-12},{pts:curve(l=>kw(l,relief(l))),c:"#2f6fd6",lbl:"TOWER WATER FALLS WITH LOAD",lblAt:50,a:"start",dx:4,dy:26}]})},
 {t:"IPLV: one number for a year",
  body:`<p>Chillers spend most of their hours at part load. <b>IPLV</b> (or NPLV, for non-standard conditions) weights four test points the way a typical building runs:</p><ul><li>100% load, 85°F condenser water: 1% of the hours</li><li>75%, 75°F: 42%</li><li>50%, 65°F: 45%</li><li>25%, 65°F: 12%</li></ul><p>That's why a chiller's IPLV is much lower (better) than its full-load kW per ton.</p>`,
  math:`<p>IPLV = 1 ÷ (0.01/A + 0.42/B + 0.45/C + 0.12/D), with A to D the kW/ton at each point.</p>`,
  draw:()=>{const I=iplv((l,t)=>kw(l,t));const bars=[["100% / 85°F",I.A,0.01],["75% / 75°F",I.B,0.42],["50% / 65°F",I.C,0.45],["25% / 65°F",I.D,0.12]];
   return bars.map(([n,v,w],i)=>{const x=80+i*150,h=v/0.8*240;return `<rect x="${x}" y="${300-h}" width="90" height="${h}" rx="5" fill="#2f6fd6" opacity="${0.35+0.6*w/0.45}"/>`+K.lbl(x+45,292-h,K.f2(v))+K.txt(x+45,322,n)+K.txt(x+45,342,K.f0(w*100)+"% of hours")}).join("")+K.tag(600,50,"IPLV "+K.f2(I.v)+" kW/TON",{c:"v",w:180})+K.lbl(80,40,"THIS CHILLER'S FOUR RATING POINTS",{a:"start"})}},
 {t:"What it costs",
  body:`<p>Small changes add up. This chiller makes about 300 tons on a hot afternoon. If it runs the equivalent of 2,000 full-load hours a year at $0.12 per kWh:</p><p>0.54 kW/ton × 300 tons × 2,000 h × $0.12 = about <b>$39,000 a year</b>.</p><p>A scaled condenser that pushes it to 0.60 adds about $4,300 a year. That pays for a lot of tube cleaning.</p>`,
  draw:()=>{const c=k=>k*300*2000*0.12;const ks=[0.50,0.54,0.60,0.66];return ks.map((k,i)=>{const x=90+i*145,h=c(k)/60000*240;return `<rect x="${x}" y="${300-h}" width="100" height="${h}" rx="5" fill="${i>1?"#d23a26":"#1e9a4a"}" opacity=".75"/>`+K.lbl(x+50,292-h,"$"+K.f0(c(k)/1000)+"K")+K.txt(x+50,322,k.toFixed(2)+" kW/ton")}).join("")+K.lbl(90,40,"YEARLY ENERGY COST, 300 TONS × 2,000 HOURS × $0.12/kWh",{a:"start"})}},
 {t:"Trending it",
  body:`<p>kW per ton is the best single health number for a chiller, <b>if</b> you compare readings at the same load and tower water. Log it every day and plot it.</p><p>When it climbs, look at the approaches: a high <b>condenser approach</b> points to scale or air, a high <b>evaporator approach</b> to fouling, low charge or oil, and a high <b>tower approach</b> to the tower.</p>`,
  draw:()=>K.chart({x:90,y:50,w:540,h:250,X:[0,12],Y:[0.5,0.7],xt:[0,2,4,6,8,10,12],yt:[0.5,0.55,0.6,0.65,0.7],xf:v=>"M"+v,yf:v=>v.toFixed(2),xl:"months (readings at 90 to 100% load, 83 to 87°F tower water)",yl:"kW per ton",title:"FULL-LOAD kW PER TON LOG",series:[{pts:[...Array(13)].map((_,m)=>[m,0.545+0.0035*Math.pow(m,1.4)/1.6+(m>9?-0.0:0)]),c:"#a0662a",lbl:"CREEPING UP",lblAt:9,dy:-14}],vlines:[{x:10,lbl:"check approaches",c:"var(--bad)"}]})}];
const see=K.see({init:{load:100,tw:85,lchw:44,cents:12},
 sliders:[["load","Load",20,100,5,v=>v+"%"],["tw","Tower water",65,90,1,v=>v+"°F"],["lchw","Chilled water setpoint",40,50,0.5,v=>K.f1(v)+"°F"],["cents","Electricity price",6,30,1,v=>v+"¢/kWh"]],
 model:S=>P({load:S.load/100,tset:S.tw,wb:Math.min(78,S.tw-6),lchw:S.lchw}),
 draw:(R,S)=>K.chart({x:90,y:50,w:540,h:250,X:[20,100],Y:[0.3,0.8],xt:[20,40,60,80,100],yt:[0.3,0.4,0.5,0.6,0.7,0.8],xf:v=>v+"%",yf:v=>v.toFixed(1),xl:"load",yl:"kW per ton",title:`kW PER TON AT ${S.tw}°F TOWER WATER, ${K.f1(S.lchw)}°F CHILLED WATER`,
  series:[{pts:curve(l=>P({load:l,tset:S.tw,wb:Math.min(78,S.tw-6),lchw:S.lchw}).kwt),c:"#9a6f1f"}],dots:[{x:S.load,y:R.kwt,c:"#2f6fd6",r:8,lbl:K.f2(R.kwt),a:S.load>80?"end":"start",dx:S.load>80?-12:12}]}),
 reads:(R,S)=>[["Cooling",K.f0(R.Q)+" tons"],["Motor power",K.f0(R.kW)+" kW"],["kW per ton",K.f2(R.kwt)],["COP",K.f1(3.517/R.kwt)],["EER",K.f1(12/R.kwt)],["Cost per hour","$"+K.f2(R.kW*S.cents/100)]],
 note:R=>`Check: ${K.f0(R.gchw)} gpm × ${K.f1(R.ewt-R.lchw)}°F ÷ 24 = ${K.f0(R.gchw*(R.ewt-R.lchw)/24)} tons.`,
 log:[["Load",(R,S)=>S.load+"%"],["Tower",(R,S)=>S.tw+"°F"],["kW/t",R=>K.f2(R.kwt)]]});
const tasks=[
 K.goal({t:"Find the sweet spot",intro:"With <b>85°F tower water</b> and 44°F chilled water, find the load where kW per ton is lowest.",
  check:(S,R)=>S.tw!==85||S.lchw!==44?"Set 85°F tower water and 44°F chilled water.":(()=>{let m=9;for(let l=20;l<=100;l+=5)m=Math.min(m,kw(l/100,85));return R.kwt<=m+0.0005?true:`${K.f2(R.kwt)} kW per ton here. Try other loads.`})(),ok:(S,R)=>`Lowest at about ${S.load}% load: ${K.f2(R.kwt)} kW per ton. Below that, fixed losses take over; above it, the compressor works harder per ton.`}),
 K.goal({t:"Hit the 75% rating point",intro:"Set up the IPLV 75% point: <b>75% load</b> and <b>75°F tower water</b>, 44°F chilled water. Log a reading.",
  check:(S,R,L)=>L.some(r=>r.S.load===75&&r.S.tw===75&&r.S.lchw===44)?true:"Log a reading at 75% load, 75°F tower water and 44°F chilled water.",ok:()=>"Logged. Compare it to your full-load reading: that's why IPLV beats full-load kW per ton."}),
 K.caseTask({t:"Service call: efficiency slipping",intro:"Full-load kW per ton has gone from 0.54 to about 0.58 over the past year, at the same tower water. The condenser was cleaned in the spring.",
  state:{evapFoul:1},model:P,draw:R=>chillerSVG(R,{}),reads:R=>[["kW per ton",K.f2(R.kwt),R.kwt>0.56],["Load",K.f0(R.plr*100)+"%"],["Lift",K.f1(R.lift)+"°F"],["Tower water",K.f1(R.Tb)+"°F"]],
  hist:{vals:[0.545,0.55,0.556,0.563,0.57,0.575],lbls:["Oct","Dec","Feb","Apr","Jun","Aug"],title:"LOG: FULL-LOAD kW PER TON",max:0.6},
  actions:[["Check the condenser approach",R=>`Condenser approach ${K.f1(R.appC)}°F: clean.`],["Check the evaporator approach",R=>`Evaporator approach ${K.f1(R.appE)}°F (baseline 1.8°F).`],["Look at the evaporator sight glass",()=>"Refrigerant level at the normal mark."],["Check the tower approach",R=>`Tower approach ${K.f1(R.appT)}°F at 78°F wet bulb: normal.`]],
  causes:[["evap","Fouled evaporator tubes"],["cond","Scaled condenser tubes"],["charge","Low refrigerant charge"],["tower","Cooling tower problem"]],ans:"evap",why:"The evaporator approach is high with a normal refrigerant level and a clean condenser. The chilled water side is fouled (closed loops still collect sludge and biofilm when the treatment lapses). Clean the evaporator tubes and test the loop water.",hint:"Look at each approach. Which one is off its baseline?"})];
window.LESSON={id:"chill-kwt",sec:"Chiller and cooling tower",secHref:"/chiller/",title:"kW per ton",lead:"The chiller's efficiency in one number: how to measure it, why it changes with load and weather, and what it costs.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Chilled water flow</b> (meter, or pressure drop across the evaporator against the data sheet) and <b>entering and leaving temperatures</b>.","<b>Input kW</b> from the starter, drive or a power meter (not just amps).","<b>Tower water temperature</b> at the same time."],
  table:[["Chiller type","Typical full-load kW/ton"],["Water-cooled centrifugal","0.50 to 0.62"],["Water-cooled screw","0.60 to 0.75"],["Air-cooled screw or scroll","1.0 to 1.3 (includes condenser fans)"],["Whole plant (chiller, pumps, tower fans)","About 0.7 to 1.0 for a good plant"]],
  log:"Daily: load, tower water, chilled water, kW, tons and kW per ton. Plot kW per ton for readings in the same load and tower water bands.",
  mistakes:["Using amps × a guessed voltage instead of real kW.","Comparing a hot-day reading to a cool-day reading.","Trusting a flow number nobody has checked since startup."]}),
 sources:[["The Engineering Mindset: water-cooled chiller design data","https://theengineeringmindset.com/water-cooled-chiller-design-data/"],["AHRI 550/590 IPLV rating points (PE exam guide)","https://open-exam-prep.com/study-guides/pe-mechanical-hvac/hvac-equipment-machinery/water-chillers-iplv-ratings"],["The Mechanical Room: chiller approach temperatures field guide","https://themechanicalroom.us.com/articles/chiller-approach-temperatures-field-guide"]]};
})();
