/* ============ Lesson: HRV and ERV ============ */
(()=>{
/* core types: rated sensible effectiveness at 150 cfm balanced, latent as a fraction of sensible */
const TYPES=[{n:"HRV: aluminum plate core",short:"HRV",arr:"xf",e:0.70,lat:0},{n:"ERV: membrane plate core",short:"ERV",arr:"xf",e:0.65,lat:0.95},{n:"Enthalpy wheel",short:"Wheel",arr:"cf",e:0.78,lat:0.9}];
const C0=1.08*150;TYPES.forEach(t=>t.UA0=HXK.ntuFor(t.arr,t.e,1)*C0);
const n0=x=>Math.round(x).toLocaleString("en-US");
const indoor=To=>To<60?{T:70,rh:35}:{T:75,rh:50};
/* S: {type, to (outdoor °F), sa (supply cfm), ea (exhaust cfm), pre (preheat), stop (wheel stopped), dirty} */
const core=(S,To)=>{const t=TYPES[S.type],I=indoor(S.to),Cs=1.08*S.sa,Ce=1.08*S.ea,Cmin=Math.min(Cs,Ce),Cr=Cmin/Math.max(Cs,Ce);
 const UA=t.UA0*Math.pow((Cs+Ce)/2/C0,0.6)*(S.dirty?0.7:1);let e=HXK.eff(t.arr,UA/Cmin,Cr);if(S.stop)e*=0.08;const el=e*t.lat;
 const rho=To<60?70:40,go=HXK.gr(To,To<60?Math.min(100,rho):rho),gi=HXK.gr(I.T,I.rh);
 const Tsa=To+e*Cmin/Cs*(I.T-To),Tea=I.T-e*Cmin/Ce*(I.T-To),gs=go+el*Cmin/Cs*(gi-go),gea=gi-el*Cmin/Ce*(gi-go);
 const corner=(To+Tea)/2,dew=HXK.dew(gea),frost=corner<32&&dew>corner;
 return {t,I,e,el,Tsa,Tea,gs,go,gi,gea,corner,dew,frost,Cs,Ce}};
const frostPoint=S=>{for(let T=50;T>=-30;T-=0.5)if(core({...S,pre:false},T).frost)return T;return -30};
const mdl=S=>{const fp=frostPoint(S);const To0=S.to;const Tpre=S.pre&&To0<=fp?fp+1:To0;const c=core(S,Tpre);
 const kw=1.08*S.sa*(Tpre-To0)/3412;const Qs=1.08*S.sa*(c.Tsa-Tpre),Ql=0.68*S.sa*(c.gs-c.go),Qvent=1.08*S.sa*(c.I.T-To0)+0.68*S.sa*(c.gi-c.go);
 const app=(c.Tsa-To0)/(c.I.T-To0);
 return {...c,S,To:To0,Tpre,fp,kw,Qs,Ql,Qt:Qs+Ql,Qvent,app}};
/* ---------- drawings ---------- */
const duct=(d,T,w=22)=>`<path d="${d}" fill="none" stroke="${HXK.ta(T)}" stroke-width="${w}" stroke-linejoin="round" opacity=".28"/>`+HXK.pipe(d,HXK.ta(T),4);
/* the ventilator: plate core (diamond) or wheel, four duct connections */
const unit=(R,o={})=>{const g=K.uid("hc"),wheel=R.t.arr==="cf";const TI=R.I.T;
 let s=`<defs>${HXK.metal(g)}</defs>`;
 s+=`<rect x="200" y="70" width="320" height="240" rx="10" fill="url(#${g})" stroke="${HXK.SE}" stroke-width="1.5"/><rect x="214" y="84" width="292" height="212" rx="6" fill="#e7ebee"/>`;
 const yT=120,yB=260;
 let pOA,pSA,pRA,pEA;
 if(!wheel){pOA=`M30 ${yT} H286 L434 ${yB} H690`;pRA=`M690 ${yT} H434 L286 ${yB} H30`}
 else{pOA=`M30 ${yB} H690`;pRA=`M690 ${yT} H30`}
 /* outdoor air (cold) and exhaust stream: colored by temperature at each end, so draw in two halves */
 if(!wheel){s+=duct(`M30 ${yT} H286 L360 190`,R.Tpre)+duct(`M360 190 L434 ${yB} H690`,R.Tsa)+duct(`M690 ${yT} H434 L360 190`,TI)+duct(`M360 190 L286 ${yB} H30`,R.Tea)}
 else{s+=duct(`M30 ${yB} H360`,R.Tpre)+duct(`M360 ${yB} H690`,R.Tsa)+duct(`M690 ${yT} H360`,TI)+duct(`M360 ${yT} H30`,R.Tea)}
 if(!wheel){const col=R.t.lat?"#c9a46a":"#b9c1c6",ln=R.t.lat?"#9c7f52":"#8d969b";s+=`<g transform="translate(360 190) rotate(45)"><rect x="-74" y="-74" width="148" height="148" fill="${col}" stroke="${HXK.SE}" stroke-width="2" opacity=".92"/>${Array.from({length:10},(_,i)=>`<path d="M-74 ${-74+i*14.8} H74" stroke="${ln}" stroke-width="1"/>`).join("")}</g>`;
  if(R.frost)s+=`<path d="M256 190 L304 142 L304 238 Z" fill="#f4fbff" stroke="#9cc7ea" stroke-width="2" opacity=".95"/>`+[0,1,2].map(i=>`<path d="M${270+i*12} ${176-i*10} v${28+i*20}" stroke="#9cc7ea" stroke-width="1.5"/>`).join("")+K.lbl(248,196,"FROST",{size:12,fill:"#2f6fd6",a:"end"})}
 else{s+=`<path d="M214 190 H506" stroke="${HXK.DK}" stroke-width="4"/><ellipse cx="360" cy="190" rx="36" ry="104" fill="#c9a46a" stroke="${HXK.SE}" stroke-width="2"/>`;for(let i=0;i<11;i++){const y=110+i*16,hw=36*Math.sqrt(Math.max(0,1-Math.pow((y-190)/104,2)));s+=`<path d="M${360-hw} ${y} H${360+hw}" stroke="#9c7f52" stroke-width="1.2"/>`}
  s+=`<rect x="352" y="184" width="16" height="12" fill="#555"/>`+(R.S.stop?K.tag(360,58,"WHEEL STOPPED",{fill:"var(--bad)"}):K.arrow("M402 110 Q420 190 402 270","var(--ink)",2))}
 /* fans */
 const fan=(x,y)=>`<circle cx="${x}" cy="${y}" r="15" fill="url(#zMotor)" stroke="${HXK.DK}"/><path d="M${x-9} ${y} H${x+9} M${x} ${y-9} V${y+9}" stroke="#ddd" stroke-width="2"/>`;
 s+=fan(478,yB)+fan(242,wheel?yT:yB);
 if(R.S.pre&&R.Tpre>R.To+0.5){const py=wheel?yB:yT;s+=`<rect x="110" y="${py-18}" width="26" height="36" fill="#d9a29a" stroke="#c0392b" stroke-width="2"/>`+[0,1,2].map(i=>`<path d="M113 ${py-10+i*10} H133" stroke="#c0392b" stroke-width="2"/>`).join("")+K.lbl(123,py+38,"PREHEAT",{size:11,fill:"#c0392b"})}
 /* labels: left side is outdoors, right side is the house */
 const L=(x,y,t,T,a)=>K.lbl(x,y-18,t,{a,size:12})+HXK.t(x,y+30,T,{a,air:true,size:14});
 if(!wheel)s+=L(30,yT,"FRESH AIR IN",R.To,"start")+L(30,yB,"EXHAUST OUT",R.Tea,"start");else s+=L(30,yB,"FRESH AIR IN",R.To,"start")+L(30,yT,"EXHAUST OUT",R.Tea,"start");
 s+=L(690,yT,"STALE AIR FROM HOUSE",TI,"end")+L(690,yB,"SUPPLY TO ROOMS",R.Tsa,"end");
 s+=K.lbl(100,352,"OUTSIDE",{size:13,fill:"var(--muted)"})+K.lbl(620,352,"HOUSE",{size:13,fill:"var(--muted)"});
 if(o.title!==false)s+=o.formula?K.txt(360,340,o.formula):K.lbl(360,340,o.title||R.t.n.toUpperCase(),{size:13});
 return s};
const R0=(o)=>mdl({type:0,to:10,sa:150,ea:150,...o}),R3=R0({to:32});
const steps=[
 {t:"Fresh air costs energy",
  body:`<p>A tight house or building needs fresh air brought in on purpose (<b>ventilation</b>). In winter every cubic foot of that air has to be heated; in summer, cooled and dried.</p><p>100 cfm of 10°F air heated to 70°F takes 1.08 × 100 × 60 = <b>6,480 BTU/h</b>, all the time.</p><p>A <b>heat recovery ventilator</b> passes the outgoing stale air and the incoming fresh air past each other through a <b>core</b>. They don't mix, but heat moves from the warm stream to the cold one. Fresh air arrives already warmed.</p>`,
  draw:()=>unit(R0({to:32}),{title:"HRV: THE TWO STREAMS CROSS IN THE CORE BUT NEVER MIX"})},
 {t:"Sensible vs total: HRV and ERV",
  body:`<p>An <b>HRV</b> (heat recovery ventilator) has a core of aluminum or plastic plates. It moves heat only: <b>sensible</b> recovery. Moisture stays in its own stream.</p><p>An <b>ERV</b> (energy recovery ventilator) has a core of treated paper or a polymer membrane that also passes water vapor. It moves heat <b>and</b> moisture: <b>total</b> (enthalpy) recovery.</p><ul><li>Winter: an ERV keeps some indoor humidity instead of dumping it outside.</li><li>Summer: an ERV keeps much of the outdoor humidity out, which takes load off the air conditioner.</li></ul>`,
  draw:()=>{const card=(x,t,col,ln,lat)=>{let s=`<rect x="${x}" y="40" width="320" height="290" rx="12" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+160,72,t,{size:15});
    s+=`<rect x="${x+40}" y="100" width="240" height="150" fill="none"/>`;for(let i=0;i<6;i++)s+=`<rect x="${x+40}" y="${100+i*26}" width="240" height="6" fill="${col}" stroke="${ln}"/>`;
    for(let i=0;i<5;i++){const y=116+i*26,warm=i%2===0;s+=HXK.pipe(warm?`M${x+50} ${y} H${x+270}`:`M${x+270} ${y} H${x+50}`,warm?HXK.ta(70):HXK.ta(15),3)}
    for(let i=0;i<4;i++){const cx=x+80+i*52;s+=K.arrow(`M${cx} 112 V138`,"#e8743b",2.2)}
    if(lat)for(let i=0;i<4;i++){const cx=x+104+i*52;s+=`<circle cx="${cx}" cy="${118}" r="4" fill="#3f9fd6"/>`+K.arrow(`M${cx} 124 V140`,"#3f9fd6",2)}
    s+=K.lbl(x+160,284,lat?"HEAT AND MOISTURE CROSS":"HEAT CROSSES, MOISTURE DOESN'T",{size:13,fill:lat?"#2f6fd6":"var(--ink)"})+K.txt(x+160,310,lat?"treated paper or polymer membrane":"aluminum or plastic plates");return s};
   return card(30,"HRV: SENSIBLE ONLY","#c9cfd3","#8d969b",false)+card(370,"ERV: TOTAL (ENTHALPY)","#d8bf8e","#9c7f52",true)+K.lbl(660,354,"",{})}},
 {t:"Effectiveness",
  body:`<p><b>Sensible effectiveness</b> says how much of the possible temperature rise the fresh air actually gets:</p><p><b>ε = (supply − outdoor) ÷ (indoor − outdoor)</b></p><p>Here: (${K.f0(R3.Tsa)} − 32) ÷ (70 − 32) = ${K.f0(R3.app*100)}%. Typical cores run about 55 to 75%; good counterflow cores reach 80 to 90%.</p><p>It only holds when the two airflows are <b>balanced</b>. Push more supply than exhaust and each cubic foot of supply gets less heat, so effectiveness on the supply side drops.</p>`,
  math:`<p>Same e-NTU math as any exchanger, with air on both sides: C = 1.08 × cfm.</p><p>Recovered heat = 1.08 × supply cfm × (supply − outdoor). Here: 1.08 × 150 × ${K.f1(R3.Tsa-32)} = about ${Math.round(R3.Qs/100)*100} BTU/h.</p><p>ERV latent recovery = 0.68 × cfm × (grains of moisture moved per lb of air).</p>`,
  draw:()=>unit(R3,{formula:"ε = ("+Math.round(R3.Tsa)+" − "+Math.round(R3.To)+") ÷ ("+R3.I.T+" − "+Math.round(R3.To)+") = "+Math.round(R3.app*100)+"%"})},
 {t:"Core types",
  body:`<ul><li><b>Crossflow plate</b>: the streams cross at right angles. Simple and common. Sensible ε about 55 to 75%.</li><li><b>Counterflow plate</b>: long hexagon-shaped cores with the streams running opposite. Higher ε, often 80 to 90%.</li><li><b>Enthalpy wheel</b>: a turning wheel of desiccant-coated media. Total ε about 70 to 80%. Mostly commercial.</li><li><b>Heat pipe</b> and <b>run-around coils</b>: sensible only, about 45 to 65%, used where the ducts are apart or must never share a box (labs, hospitals).</li></ul>`,
  draw:()=>K.cards([
   {t:"CROSSFLOW PLATE",inner:K.arrow("M50 92 H285","#2f6fd6",3)+`<rect x="128" y="56" width="74" height="74" fill="#c9cfd3" stroke="${HXK.SE}" stroke-width="1.5" opacity=".9"/><path d="M128 74 H202 M128 92 H202 M128 110 H202" stroke="#8d969b"/>`+K.arrow("M165 36 V142","#e8743b",3),note:"55 to 75% sensible"},
   {t:"COUNTERFLOW PLATE",inner:`<path d="M80 92 L120 62 H220 L260 92 L220 122 H120 Z" fill="#c9cfd3" stroke="${HXK.SE}" stroke-width="1.5"/>`+K.arrow("M40 58 L104 74","#2f6fd6",3)+K.arrow("M300 126 L238 110","#e8743b",3)+`<path d="M130 82 H210 M210 102 H130" stroke="#8d969b"/>`,note:"80 to 90% sensible"},
   {t:"ENTHALPY WHEEL",inner:`<ellipse cx="165" cy="90" rx="20" ry="44" fill="#c9a46a" stroke="${HXK.SE}" stroke-width="1.5"/><path d="M40 90 H290" stroke="${HXK.DK}" stroke-width="3"/>`+K.arrow("M290 62 H200","#e8743b",3)+K.arrow("M40 118 H130","#2f6fd6",3),note:"70 to 80% total, turning"},
   {t:"RUN-AROUND COILS",inner:`<rect x="60" y="50" width="34" height="70" fill="url(#zFins)" stroke="${HXK.SE}"/><rect x="236" y="50" width="34" height="70" fill="url(#zFins)" stroke="${HXK.SE}"/>`+HXK.pipe("M94 60 H236","#6aa86a",4)+HXK.pipe("M236 110 H94","#6aa86a",4)+`<circle cx="165" cy="110" r="10" fill="url(#zMotor)" stroke="${HXK.DK}"/>`,note:"45 to 55%, pumped glycol"}],{w:330,h:165})},
 {t:"The enthalpy wheel",
  body:`<p>The wheel turns slowly (typically 20 rpm or less) through both airstreams. Each part of the media picks up heat and moisture in the warm stream and gives them up in the cold one.</p><ul><li>A broken <b>belt</b> or failed drive stops the wheel and recovery drops to almost nothing, though both fans still run.</li><li>A <b>purge section</b> and seals limit exhaust air carried over into the supply. Keep the outdoor air side at higher pressure than the exhaust side.</li><li>Slowing the wheel lowers its effectiveness: that's how it controls frost and avoids overheating in mild weather.</li></ul>`,
  draw:()=>unit(mdl({type:2,to:20,sa:150,ea:150}),{title:"WHEEL: MEDIA TURNS BETWEEN THE TWO DUCTS"})},
 {t:"Frost protection",
  body:`<p>In cold weather the exhaust air is cooled below its dew point and then below 32°F. Moisture freezes in the core, starting at the corner where the coldest outdoor air meets the leaving exhaust. Frost blocks the exhaust passages and recovery falls off.</p><p>HRV cores typically start to frost when it's in the low 20s°F outside. ERVs move some of the moisture out of the exhaust first, so they frost at colder temperatures, often in the teens.</p><ul><li><b>Defrost</b>: shut the supply fan or recirculate indoor air through the core for a few minutes.</li><li><b>Preheat</b>: warm the outdoor air above the frost point with a coil.</li><li><b>Modulate</b>: slow a wheel or bypass part of the outdoor air.</li></ul>`,
  draw:()=>unit(R0({to:0}),{title:"0°F OUTSIDE: FROST STARTS AT THE COLD CORNER"})}];
/* ---------- See it ---------- */
const see=K.see({init:{type:0,to:10,sa:150,ea:150,pre:false},
 sliders:[["type","Core",0,2,1,v=>TYPES[v].n],["to","Outdoor air",-20,95,1,v=>v+"°F"],["sa","Supply airflow",60,300,10,v=>v+" cfm"],["ea","Exhaust airflow",60,300,10,v=>v+" cfm"]],checks:[["pre","Preheat coil on the fresh air (frost protection)"]],
 model:mdl,draw:R=>unit(R),
 reads:R=>[["Supply air",K.f1(R.Tsa)+"°F"],["Exhaust leaving",K.f1(R.Tea)+"°F"],["Supply-side effectiveness",isFinite(R.app)&&Math.abs(R.I.T-R.To)>1?K.f0(R.app*100)+"%":"n/a"],["Sensible recovered",n0(Math.abs(R.Qs))+" BTU/h"],["Moisture recovered",R.t.lat?n0(Math.abs(R.Ql))+" BTU/h":"none (HRV)"],["Frost",R.frost?"Yes: core icing":"No",R.frost],["Frost starts at",K.f0(R.fp)+"°F outside"],["Preheat",R.kw>0.005?K.f2(R.kw)+" kW":"off"]],
 note:R=>R.frost?"The cold corner is below freezing and below the exhaust air's dew point: frost builds and blocks the exhaust side.":R.kw>0.005?`Preheat warms the fresh air to ${K.f0(R.Tpre)}°F so the core stays clear.`:Math.abs(R.S.sa-R.S.ea)>=40?"Airflows unbalanced: the house is pressurized or depressurized, and supply-side effectiveness changes.":R.To>R.I.T?"Summer: the core pre-cools the fresh air"+(R.t.lat?" and takes moisture out of it.":"."):"",
 log:[["Core",R=>R.t.short],["Out",R=>K.f0(R.To)+"°F"],["Supply",R=>K.f1(R.Tsa)+"°F"],["Recovered",R=>n0(Math.abs(R.Qt))]]});
const tasks=[
 K.goal({t:"Find the HRV's frost point",intro:"With the <b>HRV</b> core and <b>150 cfm balanced</b>, no preheat, set the outdoor temperature to the <b>warmest</b> temperature where the core starts to frost (within 2°F).",
  check:(S,R)=>S.type!==0||S.sa!==150||S.ea!==150||S.pre?"HRV core, 150 cfm both ways, preheat off.":!R.frost?`No frost at ${S.to}°F yet. Colder.`:S.to<R.fp-2?`It frosts here, but it starts warmer than ${S.to}°F.`:true,
  ok:(S,R)=>`Frost starts near ${K.f0(R.fp)}°F with this HRV. Switch to the ERV core and look at the frost point reading: ${K.f0(frostPoint({...S,type:1}))}°F, because it takes moisture out of the exhaust.`}),
 K.goal({t:"Summer: HRV vs ERV",intro:"Set outdoor air to <b>90°F or hotter</b> at 150 cfm balanced. Log a reading with the <b>HRV</b> core and one with the <b>ERV</b> core, and compare what they recover.",
  check:(S,R,L)=>{const ok=l=>l.S.to>=90&&l.S.sa===150&&l.S.ea===150;return L.some(l=>ok(l)&&l.S.type===0)&&L.some(l=>ok(l)&&l.S.type===1)?true:"Log one HRV and one ERV reading at 90°F or hotter, 150 cfm both ways."},
  ok:(S,R,)=>{const a=mdl({type:0,to:95,sa:150,ea:150}),b=mdl({type:1,to:95,sa:150,ea:150});return `At 95°F: HRV recovers about ${n0(Math.abs(a.Qt))} BTU/h, ERV about ${n0(Math.abs(b.Qt))} BTU/h. Much of the summer ventilation load is moisture, and only the ERV moves it.`}}),
 K.caseTask({t:"Service call: cold supply air from the DOAS",intro:"A dedicated outdoor air unit with an enthalpy wheel. It's 20°F out and the reheat coil can't keep the supply air up. Both fans run and the filters were changed last month.",
  state:{type:2,to:20,sa:150,ea:150,stop:true},model:mdl,draw:R=>unit(R,{title:"DOAS ENERGY RECOVERY SECTION"}),
  reads:R=>[["Outdoor air",K.f0(R.To)+"°F"],["After the wheel",K.f1(R.Tsa)+"°F",true],["Exhaust in",K.f0(R.I.T)+"°F"],["Exhaust after the wheel",K.f1(R.Tea)+"°F"]],
  actions:[["Work out the wheel's effectiveness",R=>`(${K.f1(R.Tsa)} − ${K.f0(R.To)}) ÷ (${R.I.T} − ${K.f0(R.To)}) = ${K.f0(R.app*100)}%. A working wheel runs about 75%.`],["Look at the wheel through the access door",()=>"The wheel isn't turning. The drive motor hums; the belt is lying in the bottom of the cabinet."],["Check the exhaust side for frost",()=>"Media is dry, no ice on the face."]],
  causes:[["stop","Wheel stopped: broken drive belt"],["frost","Frosted wheel"],["filter","Dirty filters"],["unbal","Unbalanced airflow"]],ans:"stop",
  why:"Supply air leaves the wheel only a degree or two warmer than outdoors, effectiveness is under 10%, and the belt is off. Replace the belt, check the tension and the wheel's seals, and verify the rotation sensor alarm.",hint:"Work out the effectiveness, then look at the wheel itself."})];
window.LESSON={id:"hx-erv",sec:"Heat exchangers",secHref:"/hx/",title:"HRV and ERV",lead:"How heat and energy recovery ventilators save the cost of fresh air, sensible vs total recovery, effectiveness, core types and frost.",
 steps,see,tryIntro:"Two in See it, then a DOAS call.",tasks,
 job:K.job({read:["The four air temperatures: fresh air in, supply, stale air in, exhaust out.","Supply and exhaust airflow (balancing ports on residential units, a flow hood or traverse on commercial).","For an ERV in summer: humidity of the outdoor and supply air.","On a wheel: rotation (look, or the rotation sensor) and the drive belt."],
  table:[["Type","Recovers","Typical effectiveness"],["HRV crossflow plate","Sensible","55 to 75%"],["HRV counterflow plate","Sensible","80 to 90%"],["ERV membrane plate","Sensible and moisture","60 to 75% sensible, lower latent"],["Enthalpy wheel","Sensible and moisture","70 to 80% total"],["Heat pipe, run-around","Sensible","45 to 65%"]],tableT:"What to expect",
  steps:["Balance supply and exhaust airflow to within the manufacturer's tolerance (often about 10%).","Measure the four temperatures and work out ε = (supply − outdoor) ÷ (indoor − outdoor).","Compare with the rating; low ε means a dirty or damaged core, a stopped wheel, or a bypass damper stuck open.","In winter check the defrost: run it in the coldest weather and look for ice on the core and water in the drain pan."],stepsT:"Checking a ventilator",
  safety:["Turn off and unplug the unit (or lock out commercial units) before opening the door: fans start without warning.","Wheel cabinets have pinch points at the drive and seals.","Condensate drains and pans grow mold if neglected; wear a mask when cleaning."],
  mistakes:["Washing a paper ERV core in water: it ruins it. Vacuum it, or follow the manual.","Leaving airflows unbalanced, which pressurizes or depressurizes the house.","Blocking the condensate drain on an HRV in winter.","Forgetting the wheel belt on PM visits."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained (plate, wheel, heat pipe)","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["The Engineering Mindset: air handling units explained (energy recovery)","https://theengineeringmindset.com/air-handling-units-explained/"],["US DOE Energy Saver: whole-house ventilation","https://www.energy.gov/energysaver/ventilation/whole-house-ventilation"],["RenewAire: ERV and HRV frost thresholds and control methods","https://renewaire.com/whitepaper/erv-hrv-frost-thresholds-and-control-methods/"]]};
})();
