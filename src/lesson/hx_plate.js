/* ============ Lesson: Plate heat exchangers ============ */
(()=>{
const TH=56,GT=440,UP=7000;   // building loop return 56°F; tower water 440 gpm; UA per plate (clean, 400 gpm)
const mdl=S=>{const N=S.n,gb=S.gb,gt=S.gt||GT,foul=(S.foul||0)/100;
 const UAc=N*UP*Math.pow(gb/400,0.3)*Math.pow(gt/GT,0.2),UA=1/(1/UAc+foul/(100*UP));
 const R=HXK.water({arr:"cf",Th:TH,Tc:S.tc,gh:gb,gc:gt,UA});
 const dpB=6*Math.pow(gb/400*100/N,1.8)*(1+0.9*foul),dpT=6*Math.pow(gt/GT*100/N,1.8)*(1+0.9*foul);
 return {...R,N,foul,gb,gt,dpB,dpT,tons:R.Q/12000,leak:!!S.leak,free:R.Tho<=45}};
/* side view of a gasketed plate-and-frame exchanger. o: {n (plates drawn), R, valves, dimA, leak, foul, hi} */
const pack=(o={})=>{const R=o.R||mdl({n:100,gb:400,tc:42}),n=o.n||22,pw=11,fx=150,px=fx+34+n*pw;const g1=K.uid("pm"),g2=K.uid("pb"),g3=K.uid("ph");
 let s=`<defs>${HXK.metal(g1)}${HXK.metalH(g3)}<linearGradient id="${g2}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f5f9e"/><stop offset=".4" stop-color="#5d8fd0"/><stop offset="1" stop-color="#244c80"/></linearGradient></defs>`;
 s+=`<rect x="${fx-6}" y="52" width="${640-fx}" height="10" rx="3" fill="url(#${g1})" stroke="${HXK.SE}"/><rect x="${fx-6}" y="318" width="${640-fx}" height="10" rx="3" fill="url(#${g1})" stroke="${HXK.SE}"/>`;
 s+=`<rect x="628" y="44" width="22" height="300" rx="3" fill="url(#${g3})" stroke="${HXK.SE}"/><rect x="616" y="338" width="46" height="8" fill="#6b7378"/>`;
 s+=`<rect x="${fx}" y="46" width="30" height="300" rx="4" fill="url(#${g2})" stroke="${HXK.DK}"/>`;
 const hc=HXK.tc((R.Th+R.Tho)/2+60),cc=HXK.tc((R.Tc+R.Tco)/2);
 for(let i=0;i<n;i++){const x=fx+32+i*pw,hot=i%2===0;s+=`<rect x="${x}" y="70" width="${pw-2}" height="240" rx="2" fill="#c9cfd3" stroke="#6b7378" stroke-width=".8"/><rect x="${x+1.5}" y="80" width="${pw-5}" height="220" fill="${hot?"#e8743b":"#3f7fd6"}" opacity="${o.foul?.35:.5}"/>`;
  if(o.foul)s+=`<rect x="${x+1.5}" y="80" width="${pw-5}" height="220" fill="#8a6d3b" opacity="${.25+.5*o.foul}"/>`}
 s+=`<rect x="${px}" y="62" width="26" height="268" rx="4" fill="url(#${g2})" stroke="${HXK.DK}"/>`;
 [84,306].forEach(y=>{s+=`<path d="M${fx-12} ${y} H${px+40}" stroke="#5f686d" stroke-width="7"/>`+[fx-14,px+34].map(x=>`<rect x="${x}" y="${y-9}" width="10" height="18" rx="2" fill="#3f474c"/>`).join("")});
 /* nozzles on the frame plate: hot in top, hot out bottom, cold in low, cold out high */
 const nz=(y,T,dir,lab,a)=>HXK.pipe(dir>0?`M28 ${y} H${fx}`:`M${fx} ${y} H28`,HXK.tc(T),10)+`<rect x="${fx-18}" y="${y-13}" width="10" height="26" rx="2" fill="url(#${g1})" stroke="${HXK.SE}"/>`+(o.nlab===false?"":K.lbl(28,y-12,lab,{a:"start",size:12})+HXK.t(108,y-11,T,{size:13}));
 s+=nz(110,R.Th,1,"HOT IN")+nz(150,R.Tco,-1,"COLD OUT")+nz(242,R.Tc,1,"COLD IN")+nz(282,R.Tho,-1,"HOT OUT");
 if(o.valves)[110,150,242,282].forEach(y=>{s+=`<g transform="translate(70 ${y})"><path d="M-10 -9 L10 9 V-9 L-10 9Z" fill="#c0392b" stroke="#6a1f17"/><rect x="-2" y="-20" width="4" height="12" fill="#333"/><rect x="-10" y="-23" width="20" height="5" rx="2" fill="#c0392b"/></g>`});
 if(o.labels!==false){s+=K.lbl(fx+15,370,"FRAME PLATE",{size:12})+K.lbl(px+13,370-0,"PRESSURE PLATE",{size:12,a:"start"})+K.lbl(400,44,"CARRYING BAR",{size:12})+K.lbl(640,370,"",{});
  s+=K.tag((fx+32+px)/2,200,"PLATE PACK",{w:110})+K.lbl(px+54,104,"TIE BOLTS",{a:"start",size:12})+K.lbl(612,40,"SUPPORT COLUMN",{a:"end",size:12})}
 if(o.dimA){const y=338;s+=`<path d="M${fx} ${y-6} V${y+8} M${px+26} ${y-6} V${y+8}" stroke="var(--brass)" stroke-width="2"/>`+K.arrow(`M${(fx+px+26)/2} ${y+2} H${fx+3}`,"var(--brass)",2)+K.arrow(`M${(fx+px+26)/2} ${y+2} H${px+23}`,"var(--brass)",2)+K.tag((fx+px+26)/2,y+24,"A DIMENSION (FROM THE NAMEPLATE)",{fill:"var(--brass)"})}
 if(o.leak){const x0=fx+32+Math.round(n*.55)*pw;s+=`<g class="lsBub">`+[0,1,2].map(i=>`<circle cx="${x0+i*9}" cy="${312+i*7}" r="3.2" fill="#3f7fd6"/>`).join("")+`</g><ellipse cx="${x0+20}" cy="344" rx="40" ry="5" fill="#3f7fd6" opacity=".35"/>`+K.tag(x0+20,370,"DRIPPING AT THE PLATE EDGES",{fill:"var(--bad)"})}
 return s};
/* face of one plate: chevrons, four ports, gasket routing. hot=true routes the left ports into the channel */
const face=(x,y,hot,title)=>{const w=150,h=290,g=K.uid("pf");let s=`<defs>${HXK.metal(g)}</defs><g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="14" fill="url(#${g})" stroke="${HXK.SE}" stroke-width="1.5"/>`;
 for(let i=0;i<13;i++){const yy=62+i*14;s+=`<path d="M18 ${yy} L${w/2} ${yy+12} L${w-18} ${yy}" fill="none" stroke="#9aa3a8" stroke-width="2"/>`}
 const P=[[30,30],[w-30,30],[30,h-30],[w-30,h-30]];const inCh=hot?[0,2]:[1,3];
 const col=hot?"#e8743b":"#3f7fd6";
 P.forEach(([px,py],i)=>{const used=inCh.includes(i);s+=`<circle cx="${px}" cy="${py}" r="17" fill="${used?col:"#e3e7ea"}" stroke="${HXK.SE}" stroke-width="1.5" opacity="${used?.85:1}"/>`;if(!used)s+=`<circle cx="${px}" cy="${py}" r="23" fill="none" stroke="#1c1f21" stroke-width="3.5"/>`});
 /* main gasket: around the field and the two ports that feed this channel */
 const L=hot?`M8 8 H${w-60} V54 H${w-8} V${h-54} H${w-60} V${h-8} H8 Z`:`M${w-8} 8 H60 V54 H8 V${h-54} H60 V${h-8} H${w-8} Z`;
 s+=`<path d="${L}" fill="none" stroke="#1c1f21" stroke-width="3.5" stroke-linejoin="round"/>`;
 const a=hot?K.arrow(`M30 50 Q${w/2} 70 ${w/2} ${h/2} T30 ${h-52}`,col,3):K.arrow(`M${w-30} ${h-50} Q${w/2} ${h-70} ${w/2} ${h/2} T${w-30} 52`,col,3);
 s+=a+`</g>`+K.lbl(x+w/2,y+h+22,title,{size:13,fill:col});return s};
const steps=[
 {t:"Plates in a frame",
  body:`<p>A <b>gasketed plate-and-frame</b> exchanger is a stack of thin, pressed stainless steel plates. They hang from a <b>carrying bar</b> between a fixed <b>frame plate</b> and a movable <b>pressure plate</b>. <b>Tie bolts</b> squeeze the pack together.</p><p>All four pipe connections are usually on the frame plate, so you can open the pack without touching the piping.</p><p>Need more capacity later? Hang more plates and use longer bolts, if the frame has room.</p>`,
  draw:()=>pack({})},
 {t:"Gaskets steer the two fluids",
  body:`<p>Each plate has four port holes and a rubber <b>gasket</b> in a groove. The gasket decides which two ports open into the space behind that plate.</p><p>Plates alternate: one channel lets the hot fluid across, the next lets the cold fluid across. So every plate has hot on one side and cold on the other, in <b>counterflow</b>.</p><p>The pressed chevron pattern makes the water swirl (<b>turbulence</b>), which scrubs the wall and moves heat several times better than smooth tubes.</p>`,
  draw:()=>face(150,30,true,"HOT CHANNEL")+face(420,30,false,"COLD CHANNEL (NEXT PLATE)")+K.txt(360,190,"ring")+K.txt(360,208,"gaskets")+K.txt(360,226,"seal off")+K.txt(360,244,"the other")+K.txt(360,262,"two ports")},
 {t:"Close approach: free cooling",
  body:`<p>Thin plates, lots of surface and true counterflow let a plate exchanger get within <b>1 to 3°F</b>. Shell-and-tube rarely beats 5°F.</p><p>That's what makes <b>water-side economizer</b> (free cooling) work. In cold weather the tower makes 42°F water. The plate exchanger cools the building's chilled water loop from it, and the chillers can shut off.</p><p>The plate exchanger also keeps dirty open tower water out of the clean closed loop.</p>`,
  draw:()=>{const R=mdl({n:100,gb:400,tc:42});const g=K.uid("tw");let s=`<defs>${HXK.metal(g)}</defs>`;
   s+=`<path d="M40 120 L60 300 H200 L220 120 Z" fill="url(#${g})" stroke="${HXK.SE}" stroke-width="1.5"/><rect x="34" y="96" width="192" height="26" rx="4" fill="#6b7378"/><ellipse cx="130" cy="96" rx="60" ry="8" fill="#3f474c"/>`+K.lbl(130,330,"COOLING TOWER",{size:13});
   for(let i=0;i<5;i++)s+=`<path d="M${70+i*25} 140 v130" stroke="#a9c7e8" stroke-width="2" stroke-dasharray="4 6" class="lsFlow"/>`;
   s+=`<rect x="300" y="140" width="110" height="130" rx="6" fill="#2f5f9e" stroke="${HXK.DK}"/>`;for(let i=0;i<12;i++)s+=`<rect x="${318+i*6.5}" y="150" width="4" height="110" fill="${i%2?"#3f7fd6":"#9fb8d6"}"/>`;s+=K.lbl(355,296,"PLATE HX",{size:13});
   s+=HXK.pipe("M210 250 H300",HXK.tc(R.Tc),8)+HXK.pipe("M300 160 H250 V130 H220",HXK.tc(R.Tco),8);
   s+=K.lbl(250,230,"TOWER",{size:11})+HXK.t(255,272,R.Tc,{size:13})+HXK.t(262,124,R.Tco,{size:13,a:"start"});
   s+=`<rect x="540" y="130" width="140" height="150" rx="6" fill="url(#zCab)" stroke="${HXK.SE}"/><rect x="565" y="150" width="90" height="110" fill="url(#zFins)" stroke="${HXK.SE}"/>`+K.lbl(610,300,"AIR HANDLER COIL",{size:13});
   s+=HXK.pipe("M410 160 H565",HXK.tc(R.Tho),8)+HXK.pipe("M565 250 H410",HXK.tc(R.Th),8)+K.lbl(488,148,"SUPPLY "+Math.round(R.Tho)+"°F",{size:13})+K.lbl(488,240,"RETURN "+Math.round(R.Th)+"°F",{size:13});
   return s+K.tag(355,90,"APPROACH "+K.f1(R.appr)+"°F",{fill:"var(--brass)"})+K.txt(360,360,"chillers off: the tower does the cooling through the plate exchanger")}},
 {t:"Fouling and plugging",
  body:`<p>The channels are only about 1/8 inch deep. Two things go wrong:</p><ul><li><b>Fouling</b>: scale, slime and mud coat the plates over months. Approach creeps up <b>and</b> pressure drop creeps up.</li><li><b>Plugging</b>: leaves, scale chips or debris jam the port and channel entries. Pressure drop jumps.</li></ul><p>Keep a <b>strainer</b> ahead of both sides, especially the tower side. Trend approach and pressure drop at the same flow so you see it coming.</p>`,
  draw:()=>{const pts=k=>[...Array(13)].map((_,m)=>{const R=mdl({n:100,gb:400,tc:42,foul:100*Math.pow(m/12,1.2)*0.8});return [m,k==="a"?R.appr:R.dpT]});return K.chart({x:80,y:40,w:560,h:270,X:[0,12],Y:[0,12],xt:[0,3,6,9,12],yt:[0,2,4,6,8,10,12],xl:"months on the tower side without cleaning",title:"SAME LOAD, SAME FLOW, LOGGED MONTHLY",
   series:[{pts:pts("a"),c:"var(--brass)",lbl:"approach (°F)",lblAt:11,dy:-12},{pts:pts("d"),c:"#8a6d3b",lbl:"tower-side pressure drop (psi)",lblAt:1,a:"start",dx:0,dy:-14}],vlines:[{x:8,c:"var(--bad)",lbl:"plan a cleaning"}]})}},
 {t:"Isolating and cleaning",
  body:`<p>Many plate exchangers can be cleaned in place: isolate them and circulate a cleaning solution (<b>CIP</b>). For a full cleaning you open the pack:</p><ol><li>Close and tag the isolation valves on <b>both</b> sides, then drain and vent.</li><li>Measure and write down the pack length, the <b>A dimension</b>. The nameplate gives the correct one.</li><li>Loosen the tie bolts evenly, a little at a time, in the manufacturer's order. Slide the pressure plate back.</li><li>Clean each plate with a soft brush (never a wire brush), keep them in order, and check the gaskets.</li><li>Re-hang in order and tighten evenly back to the A dimension. Never past it.</li></ol>`,
  draw:()=>pack({valves:true,dimA:true,labels:false,nlab:false})+K.lbl(70,72,"ISOLATION VALVES",{size:12})+K.lbl(400,40,"BOTH SIDES ISOLATED, DRAINED AND VENTED",{size:13})},
 {t:"Gasket leaks",
  body:`<p>Gaskets harden with age, heat and some cleaning chemicals. When one fails, water leaks <b>out the edge</b> of the pack onto the floor. The gasket design sends leaks outside, so the two fluids don't mix.</p><p>A leak <b>between</b> the fluids means a cracked or corroded plate. You find it with a pressure test: pressurize one side, open the other and look for water at its ports.</p><p>Don't just crank the bolts to stop a drip. Overtightening past the A dimension crushes the plates. Replace the gasket.</p>`,
  draw:()=>pack({leak:true,labels:false})+K.lbl(400,40,"OLD GASKETS: WATER OUTSIDE, NOT MIXING",{size:13})}];
/* ---------- See it ---------- */
const see=K.see({init:{n:100,tc:42,gb:400,foul:0,leak:false},
 sliders:[["n","Number of plates",40,160,10,v=>v+" plates"],["tc","Tower water in",36,58,1,v=>v+"°F"],["gb","Building loop flow",200,600,20,v=>v+" gpm"],["foul","Fouling on the plates",0,100,10,v=>v+"%"]],checks:[["leak","Old gaskets (leaking at the edge)"]],
 model:mdl,
 draw:R=>{const n=Math.round(R.N/6);return pack({R,n,foul:R.foul,leak:R.leak})},
 reads:R=>[["Building loop out",K.f1(R.Tho)+"°F",!R.free],["Approach",K.f1(R.appr)+"°F",R.appr>4],["Free cooling",K.f0(R.tons)+" tons"],["Tower water out",K.f1(R.Tco)+"°F"],["Building side ΔP",K.f1(R.dpB)+" psi",R.dpB>12],["Tower side ΔP",K.f1(R.dpT)+" psi",R.dpT>12]],
 note:R=>(R.free?"Building loop at or below 45°F: the chillers can stay off.":"Above 45°F: the chillers have to trim, or the load waits for colder tower water.")+(R.leak?" The leak drips outside: the temperatures don't change, but plan new gaskets.":"")+(R.dpB>12||R.dpT>12?" Pressure drop is high: pumps lose flow.":""),
 log:[["Plates",(R)=>R.N],["Foul",R=>K.f0(R.foul*100)+"%"],["Approach",R=>K.f1(R.appr)],["ΔP tower",R=>K.f1(R.dpT)]]});
const caseDraw=R=>pack({R,n:17});
const C=[["foul","Fouled plates"],["strainer","Plugged strainer on the tower side"],["gasket","Gasket leak"],["n","Too few plates"]];
const tasks=[
 K.goal({t:"Size it for free cooling",intro:"With <b>42°F</b> tower water and <b>400 gpm</b> on the building loop, clean plates, find the fewest plates that get the building loop to <b>44.5°F or colder</b>.",
  check:(S,R)=>S.tc!==42||S.gb!==400||S.foul?"Set 42°F tower water, 400 gpm, no fouling.":R.Tho>44.5?`Building loop is ${K.f1(R.Tho)}°F. Add plates.`:mdl({...S,n:S.n-10}).Tho<=44.5?"That works, but you can do it with fewer plates.":true,
  ok:(S,R)=>`${S.n} plates: ${K.f1(R.Tho)}°F with a ${K.f1(R.appr)}°F approach. Each extra plate adds less, because the approach is already small.`}),
 K.goal({t:"Clean vs fouled",intro:"At 100 plates, 42°F tower water and 400 gpm, log a reading with <b>no fouling</b>, then one with <b>60% or more</b>. Compare approach and pressure drop.",
  check:(S,R,L)=>{const ok=l=>l.S.n===100&&l.S.tc===42&&l.S.gb===400;return L.some(l=>ok(l)&&!l.S.foul)&&L.some(l=>ok(l)&&l.S.foul>=60)?true:"Log both readings at 100 plates, 42°F and 400 gpm."},
  ok:()=>{const a=mdl({n:100,tc:42,gb:400,foul:0}),b=mdl({n:100,tc:42,gb:400,foul:60});return `Approach ${K.f1(a.appr)} → ${K.f1(b.appr)}°F and tower-side pressure drop ${K.f1(a.dpT)} → ${K.f1(b.dpT)} psi. Both rising together at the same flow is fouling.`}}),
 K.caseTask({t:"Service call: free cooling quit keeping up",intro:"First cold week of the season. The building loop leaves the plate exchanger warm even with 42°F tower water. It worked fine last spring.",
  state:{n:100,tc:42,gb:400,gt:170},model:mdl,draw:caseDraw,
  reads:R=>[["Building loop out",K.f1(R.Tho)+"°F",true],["Tower water in",K.f0(R.Tc)+"°F"],["Tower water out",K.f1(R.Tco)+"°F"],["Approach",K.f1(R.appr)+"°F"]],
  actions:[["Read ΔP across the plate HX, both sides",R=>`Building side ${K.f1(R.dpB)} psi (design 6.0). Tower side ${K.f1(R.dpT)} psi (design 6.0).`],["Read ΔP across the tower-side strainer",()=>"9 psi across the strainer. A clean basket reads under 2 psi."],["Look at the plate pack",()=>"Dry edges, no drips. Paint marks on the tie bolts haven't moved."]],
  causes:C,ans:"strainer",why:"The tower side shows low pressure drop across the plates and a high drop across the strainer: the water isn't getting there. The tower water also leaves within a fraction of a degree of the building return, a sign of low flow on that side. Low tower flow means a big tower water ΔT and a warm building loop. Clean the strainer basket; fouled plates would show high pressure drop across the pack instead.",hint:"Compare the tower-side pressure drop across the plates with design. Fouling raises it; something upstream lowers it."})];
window.LESSON={id:"hx-plate",sec:"Heat exchangers",secHref:"/hx/",title:"Plate heat exchangers",lead:"How a gasketed plate exchanger is built, why it gets so close, and how to find fouling, plugging and gasket leaks.",
 steps,see,tryIntro:"Two in See it, then a free-cooling call.",tasks,
 job:K.job({read:["Four temperatures and the approach.","Pressure drop across each side of the exchanger (gauges or a differential gauge on the test ports), compared to the submittal at the same flow.","Pressure drop across each strainer.","The A dimension on the nameplate, and the current pack length."],
  table:[["What you see","Usually"],["Approach 1 to 3°F, ΔP at design","Clean, healthy."],["Approach and ΔP both rising over months","Fouling: CIP or open and clean."],["ΔP across the pack jumps suddenly","Debris plugging the ports or channel entries."],["ΔP across the pack low, strainer ΔP high","Plugged strainer: flow isn't getting there."],["Water dripping at plate edges","Gasket failure. Replace, don't overtighten."],["One loop's pressure or level changes, the other gains water","Plate crack: the fluids are mixing. Pressure test."]],tableT:"Normal and not",
  steps:["Close and tag both sides' isolation valves; lock out the pumps.","Drain both sides and open the vents so neither side holds pressure.","Record the pack length and compare it with the nameplate A dimension.","Loosen the bolts evenly in the order the manual gives; slide back the pressure plate.","Clean plates with a soft brush and water or the approved cleaner. Keep them in order, check gaskets.","Re-hang in order (check the honeycomb pattern along the edges), tighten evenly to the A dimension, and leak-test at low pressure before full pressure."],stepsT:"Opening a plate pack",
  safety:["Both sides must be isolated, drained and at zero pressure before you touch the bolts.","Plate edges are sharp: wear cut-resistant gloves.","Cleaning chemicals (acids for scale) need eye and skin protection and the SDS on hand.","The pressure plate is heavy: keep it on the carrying bar and don't stand where it can roll."],
  mistakes:["Tightening past the A dimension to stop a leak: it crushes plates and gaskets.","Using a wire brush on stainless plates.","Rehanging plates out of order: wrong channels, high pressure drop, or the fluids mix.","Skipping the strainers: the narrow channels plug fast on tower water."]}),
 sources:[["The Engineering Mindset: how plate heat exchangers work","https://theengineeringmindset.com/how-plate-heat-exchangers-work/"],["The Engineering Mindset: industrial heat exchangers","https://theengineeringmindset.com/industrial-heat-exchangers/"],["Alfa Laval: troubleshooting for plate heat exchangers","https://www.alfalaval.com/service-and-support/product-services/plate-heat-exchanger-services/troubleshooting-for-plate-heat-exchangers/"],["Alfa Laval: ten top tips for gasketed plate heat exchangers","https://www.alfalaval.com/service-and-support/ten-top-tips/ten-top-tips-gasketed-plate-heat-exchangers/"]]};
})();
