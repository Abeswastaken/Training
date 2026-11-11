(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const K="#2a2f33",SE="#4d555a";
const tcol=T=>{const f=Math.max(0,Math.min(1,(T-40)/160));return `hsl(${Math.round(220-218*f)},72%,${Math.round(50-4*f)}%)`};
const satF=psig=>{const t=[[0,212],[2,218.5],[5,227.1],[10,239.4],[15,249.8],[30,274],[50,298]];for(let i=1;i<t.length;i++)if(psig<=t[i][0]){const a=t[i-1],b=t[i];return a[1]+(b[1]-a[1])*(psig-a[0])/(b[0]-a[0])}return 298};
/* ---------- the exchangers ----------
 arr: cf counterflow, pf parallel flow, cond = hot side condensing at one temperature, hr = air-to-air heat recovery (effectiveness)
 hot/cold: n name, kind water|air|steam|ref|glycol, T default, f default flow, range [Tmin,Tmax], frange [min,max]
 UA in BTU/h·°F at size 100% */
const W=(n,T,f,r,fr)=>({n,kind:"water",T,f,r,fr}),A=(n,T,f,r,fr)=>({n,kind:"air",T,f,r,fr});
const SUBS={
 cf:{n:"Counterflow",arr:"cf",UA:12000,hot:W("Hot water",180,10,[100,220],[2,30]),cold:W("Cold water",60,10,[35,120],[2,30]),
  how:"The two fluids run in opposite directions. The coldest hot fluid meets the coldest cold fluid, so the temperature difference stays fairly even along the whole exchanger.",
  use:"Almost every water-to-water exchanger in HVAC is piped counterflow on purpose: plate exchangers, converters, coils, DHW heaters.",
  appr:"Can get within a few degrees: the cold outlet can even end up hotter than the hot outlet (a temperature cross). Parallel flow can't do that.",
  svc:"Check the piping against the nameplate arrows. An exchanger piped parallel by mistake loses capacity and can't reach its design leaving temperature.",
  faults:["scale","air","lowHot","lowCold","backward"]},
 pf:{n:"Parallel flow",arr:"pf",UA:12000,hot:W("Hot water",180,10,[100,220],[2,30]),cold:W("Cold water",60,10,[35,120],[2,30]),
  how:"Both fluids enter at the same end and travel the same way. The temperature difference is huge at the inlet and shrinks toward the outlet, so the far end does little work.",
  use:"Rare on purpose in HVAC. Sometimes used where you need to limit the wall temperature or the cold fluid's leaving temperature.",
  appr:"Both outlets approach the same temperature, and the cold outlet can never get hotter than the hot outlet.",
  svc:"If an exchanger underperforms, check whether it got piped this way by mistake.",
  faults:["scale","air","lowHot","lowCold"]},
 gasket:{n:"Gasketed plate-and-frame",arr:"cf",UA:60000,hot:W("Building loop (hot side)",60,200,[45,95],[40,400]),cold:W("Cooling tower water",50,220,[40,85],[40,400]),
  how:"A pack of thin corrugated stainless plates hangs between a fixed frame plate and a movable pressure plate, squeezed by tie bolts. Gaskets route the two fluids into alternate channels, counterflow. The corrugations make turbulence, so heat transfer is very high in a small space.",
  use:"Water-side economizer (free cooling) between the tower and the chilled water loop; isolating a building loop from a district or tower loop; high-rise pressure breaks.",
  appr:"1 to 3°F is typical, which is why they're used for free cooling.",
  svc:"Expandable: add plates to add capacity. Can be opened for cleaning (loosen the tie bolts evenly, in order, to the stamped dimension). Gaskets age and leak at the edges; a leak shows outside, not between fluids. Strainers ahead of both sides are a must: the narrow channels plug.",
  faults:["scale","gasket","lowHot","lowCold","backward"]},
 brazed:{n:"Brazed plate",arr:"cf",UA:9000,hot:W("Boiler water",180,6,[120,200],[1,15]),cold:W("Domestic water",50,4,[40,70],[1,10]),
  how:"Stainless plates brazed together with copper (or nickel) into one sealed block. No gaskets and no frame.",
  use:"Instantaneous domestic hot water from a boiler, snowmelt and radiant isolation, water-source heat pumps, small refrigeration condensers and evaporators.",
  appr:"Close approach in a tiny package.",
  svc:"Can't be opened: clean by circulating a descaling solution (back-flush), or replace it. Hard water scales the DHW side fast. Freeze damage splits the internal channels.",
  faults:["scale","lowHot","lowCold","backward"]},
 dwplate:{n:"Double-wall plate",arr:"cf",UA:42000,hot:W("Boiler water (with treatment)",180,30,[120,200],[5,60]),cold:W("Potable water",50,20,[40,70],[5,60]),
  how:"Each channel wall is two plates with a small gap between them, vented to the outside. If either plate leaks, the fluid shows up outside the pack instead of mixing.",
  use:"Where treated or glycol water heats potable water and code calls for double-wall separation with leak detection.",
  appr:"The air gap adds resistance, so it needs more plate area than a single-wall unit for the same job.",
  svc:"A drip at the leak-detection edge means a plate has failed: one fluid is getting past one wall. Find and replace it.",
  faults:["scale","dwleak","lowHot","lowCold"]},
 straight:{n:"Straight tube (fixed tubesheet)",arr:"cf",UA:30000,F:0.9,hot:W("Shell side: hot water",140,60,[90,200],[10,150]),cold:W("Tube side: cold water",55,60,[40,90],[10,150]),
  how:"A bundle of straight tubes is rolled into a tubesheet at each end, inside a cylindrical shell. One fluid flows through the tubes (here in two passes: a partition in the channel head turns it around), the other through the shell, steered back and forth across the tubes by baffles.",
  use:"Water-to-water heat exchange, chiller condensers and evaporators (the refrigerant is in the shell), large converters.",
  appr:"5 to 10°F is typical. Multi-pass flow is not pure counterflow, so a correction (about 0.9 here) is applied.",
  svc:"Remove the channel heads and rod or brush the tubes (straight tubes can be cleaned mechanically). Eddy-current testing finds thinning tubes; leaking tubes get plugged at both tubesheets. The shell side can't be cleaned mechanically on a fixed tubesheet.",
  faults:["scale","tubes","lowHot","lowCold"]},
 utube:{n:"U-tube (removable bundle)",arr:"cf",UA:26000,F:0.9,hot:W("Shell side: boiler water",190,40,[120,210],[10,120]),cold:W("Tube side: heating water",140,50,[60,170],[10,120]),
  how:"The tubes are bent into a U, so there is only one tubesheet. The bundle can expand freely with temperature and slides out for service.",
  use:"Hot water converters, storage-tank heaters, steam-to-water converters.",
  appr:"5 to 10°F.",
  svc:"The bundle pulls out so the outside (shell side) can be cleaned. The inside of the U-bends can't be rodded: clean chemically. Leave room to pull the bundle.",
  faults:["scale","tubes","lowHot","lowCold"]},
 steam:{n:"Steam converter (steam to water)",arr:"cond",UA:18000,hot:{n:"Steam in the shell",kind:"steam",T:5,r:[0,15]},cold:W("Heating water in the tubes",160,40,[100,190],[10,100]),
  how:"Steam fills the shell and condenses on the U-tubes, giving up its latent heat at a fixed temperature. Heating water flows through the tubes. A control valve on the steam modulates the shell pressure to hold the water temperature.",
  use:"Building heating water from a district or plant steam supply.",
  appr:"Steam at 5 psig condenses at about 227°F, so 180°F water leaves with a wide margin.",
  svc:"Condensate must drain freely: an F&T trap below the shell, a vacuum breaker on the shell (when the control valve throttles, the shell can drop into a vacuum and hold up condensate), and a relief valve. A flooded shell loses capacity and bangs.",
  faults:["scale","flood","lowCold","vb"]},
 dwtube:{n:"Double-wall tube",arr:"cf",UA:20000,F:0.9,hot:W("Shell side: boiler water",180,30,[120,200],[5,80]),cold:W("Tube side: potable water",50,20,[40,70],[5,80]),
  how:"Each tube is two tubes, one inside the other, with grooves or a gap between them vented to a tell-tale. A leak in either wall drains to the tell-tale.",
  use:"Heating potable water from boiler water or glycol where double-wall protection is required.",
  appr:"Lower U than single-wall tubes; needs more surface.",
  svc:"Water at the tell-tale means a wall has failed. Never plug a tell-tale.",
  faults:["scale","dwleak","lowHot","lowCold"]},
 coax:{n:"Tube-in-tube (coaxial)",arr:"cond",UA:2600,hot:{n:"Refrigerant (condensing)",kind:"ref",T:105,r:[90,125]},cold:W("Loop water in the inner tube",85,9,[50,100],[2,15]),
  how:"One tube runs inside another, coiled up to save space. Water flows in the inner tube, refrigerant in the space between the tubes, in the opposite direction.",
  use:"Water-source and geothermal heat pumps (condenser in cooling, evaporator in heating), small water-cooled condensing units.",
  appr:"Leaving water about 5 to 15°F below the condensing temperature.",
  svc:"The water side scales or fouls on open loops: clean with acid flushing; cupronickel inner tubes resist scale and corrosion better than copper. Low water flow in heating mode can freeze the coax and split it. Check the water temperature difference and pressure drop against the manufacturer's tables.",
  faults:["scale","lowCold","freeze"]},
 fin:{n:"Finned air coil (hot water)",arr:"cf",UA:3200,air:true,hot:W("Hot water in the tubes",180,8,[120,200],[1,20]),cold:A("Air across the fins",55,2000,[0,70],[500,4000]),
  how:"Copper tubes pass through thin aluminum fins. Water flows through the tubes, air flows across the fins. With several rows, the water is piped to enter on the leaving-air side and leave on the entering-air side: counterflow.",
  use:"Air handler heating and cooling coils, fan coils, unit heaters, duct reheat coils.",
  appr:"Leaving air a good deal below the water temperature; the air side has most of the resistance, which is why fins are needed.",
  svc:"Comb bent fins and clean dirty coils (dirt cuts airflow and heat transfer). Vent air from the coil's high point. Freeze protection: a freezestat and a safe valve position for outdoor-air coils. Piped backward (parallel), a multi-row coil loses capacity.",
  faults:["scale","dirty","air","lowHot","lowCold","backward"]},
 tank:{n:"Indirect tank coil",arr:"cf",UA:5000,hot:W("Boiler water in the coil",180,8,[140,200],[2,15]),cold:W("Domestic water (draw)",50,3,[40,70],[1,8]),
  how:"A finned or smooth coil sits in the bottom of a storage tank. Boiler water flows through the coil and heats the tank water around it. Cold water enters low (through a dip tube), hot water leaves at the top.",
  use:"Indirect domestic water heaters on boilers, solar storage tanks.",
  appr:"Recovery is rated in gallons per hour at a given boiler supply temperature: hotter boiler water, faster recovery.",
  svc:"Hard water scales the coil's outside and recovery drops. A tank aquastat calls the boiler (priority zone). A T&P relief valve and a mixing valve at the outlet are required to prevent scalding.",
  faults:["scale","air","lowHot","lowCold"]},
 hrvplate:{n:"Fixed plate core (HRV / ERV)",arr:"hr",eff:0.7,lat:0.5,hot:A("Return / exhaust air",72,1000,[65,80],[200,2000]),cold:A("Outdoor / supply air",10,1000,[-10,95],[200,2000]),
  how:"Thin plates form alternating passages; outdoor air and exhaust air cross at right angles without mixing. An HRV core is aluminum or plastic (sensible heat only); an ERV core is a membrane or treated paper that also passes moisture.",
  use:"Residential HRVs and ERVs, rooftop energy recovery sections, dedicated outdoor air units.",
  appr:"Sensible effectiveness about 55 to 75%.",
  svc:"Wash or vacuum the core per the manufacturer (never wash a paper ERV core). In cold weather the exhaust side frosts: units defrost by recirculating, shutting the supply fan, or preheating. Balance the airflows.",
  faults:["dirtyHR","frost","unbal"]},
 wheel:{n:"Enthalpy wheel",arr:"hr",eff:0.75,lat:0.7,hot:A("Exhaust air",75,5000,[65,80],[1000,10000]),cold:A("Outdoor air",95,5000,[-10,100],[1000,10000]),
  how:"A slowly turning wheel of fine passages coated with a desiccant. Each part of the wheel passes through the exhaust stream, picks up heat and moisture, then turns into the outdoor air stream and gives them up.",
  use:"Commercial energy recovery ventilators and DOAS units with large outdoor air loads.",
  appr:"Total (heat plus moisture) effectiveness about 70 to 80%.",
  svc:"Check the belt and drive motor: a stopped wheel recovers almost nothing. A purge section and seals limit exhaust air carryover; keep the fans arranged so outdoor air is at higher pressure. Clean the media as recommended. Wheel speed control prevents frost and overheating.",
  faults:["dirtyHR","stopped","frost","unbal"]},
 hpipe:{n:"Heat pipe",arr:"hr",eff:0.5,lat:0,hot:A("Exhaust air",75,3000,[65,80],[500,6000]),cold:A("Outdoor air",15,3000,[-10,100],[500,6000]),
  how:"Sealed finned tubes with a refrigerant inside. In the warm airstream the refrigerant boils and the vapor moves to the cold end, where it condenses and runs back. No pump, no moving parts.",
  use:"Energy recovery between side-by-side airstreams, and wrap-around heat pipes that precool air before a cooling coil and reheat it after (dehumidification).",
  appr:"Sensible effectiveness about 45 to 65%. Sensible only.",
  svc:"Tilt sets which way it works: tilt control or valves change capacity between seasons. Keep fins clean. A lost charge means no transfer.",
  faults:["dirtyHR","tilt","frost","unbal"]},
 loop:{n:"Run-around coil loop",arr:"hr",eff:0.5,lat:0,hot:A("Exhaust air",72,4000,[65,80],[1000,8000]),cold:A("Outdoor air",5,4000,[-10,100],[1000,8000]),
  how:"A finned coil in the exhaust duct and another in the outdoor air duct, connected by pumped glycol. The glycol picks up heat in one coil and gives it up in the other.",
  use:"Where the supply and exhaust ducts are far apart, or must never share a box (labs, hospitals): no cross-contamination is possible.",
  appr:"Effectiveness about 45 to 55%.",
  svc:"Check the pump, glycol strength (freeze protection) and the expansion tank. A three-way valve bypasses the exhaust coil to keep it from frosting. Air in the loop starves the coils.",
  faults:["dirtyHR","pump","frost","unbal"]}};
const G=(T,f)=>({n:"Gas input",kind:"gas",T,f,r:[10,100],fr:[40,120]});
/* arr "furn": a gas furnace. hot.T is excess air in %, hot.f is firing input in MBH. cond: has a secondary (condensing) exchanger */
const FURN={
 cfurn:{n:"Condensing furnace (90%+)",arr:"furn",cond:true,hot:G(40,80),cold:A("Return air",68,1200,[55,80],[600,2000]),
  how:"Two exchangers in series. Burner gases go through the primary (serpentine steel tubes) and leave at a few hundred degrees. They then pass through the secondary, a stainless tube-and-fin coil that looks like an evaporator. The return air from the blower hits the secondary first, so the coolest air meets the coolest gas. That pulls the gas below its dew point: the water vapor made by burning gas condenses and gives up its latent heat.",
  use:"Every 90%+ AFUE gas furnace. The inducer pulls the gases through both exchangers and pushes them out a plastic vent (Category IV, positive pressure). Combustion air usually comes from outdoors through a second pipe (sealed combustion).",
  appr:"The vent gas leaves only 30 to 50°F above the return air. Natural gas flue gas has a dew point around 130 to 135°F (lower with more excess air), so everything colder than that in the secondary is wet.",
  svc:"The condensate is acidic (about pH 3 to 5). It needs a primed trap, plastic drain pipe with pitch, and a neutralizer where required. A plugged or frozen drain backs water up into the secondary and collector box and opens the pressure switch. The fins on the air side load up with lint like an evaporator when filters are neglected. Vent pipe pitches back toward the furnace so condensate drains through it.",
  faults:["fDirtySec","fTrap","fLowAir","fOver","fCrack"]},
 sfurn:{n:"80% furnace (primary only)",arr:"furn",cond:false,hot:G(40,80),cold:A("Return air",68,1200,[55,80],[600,2000]),
  how:"One exchanger. Burner gases pass through the primary tubes or clamshells and leave at 300 to 450°F. The water vapor from combustion goes up the vent as vapor, and its latent heat goes with it. That is most of the difference between 80% and 95%.",
  use:"Mid-efficiency (about 80% AFUE) furnaces. The gases stay hot on purpose: a metal vent or lined chimney works on buoyancy and has to stay above the dew point or it rots.",
  appr:"The flue gas leaves hundreds of degrees above the air. Making the exchanger bigger would cool the gas further, but it would then condense in an exchanger and vent that aren't built for acid water.",
  svc:"Temperature rise tells you about the air side: check it against the rating plate. Low airflow overheats the exchanger, trips the limit and over time cracks the metal. Inspect for cracks, rust-through and soot. Flames that move or roll out when the blower starts point at a breached exchanger.",
  faults:["fLowAir","fOver","fCrack"]}};
const FAULTS={fDirtySec:"Secondary coil fins loaded with lint (air side)",fTrap:"Condensate not draining (plugged trap or frozen drain)",fLowAir:"Low airflow (loaded filter, closed registers)",fOver:"Overfired 15% (manifold pressure set high)",fCrack:"Cracked primary heat exchanger",scale:"Scale or fouling on the water side",air:"Air trapped in it (air bound)",lowHot:"Low flow on the hot side (plugged strainer, weak pump)",lowCold:"Low flow on the cold side",backward:"Piped backward (parallel flow)",
 gasket:"Gasket leaking at the plate edges",dwleak:"One wall leaking (double-wall)",tubes:"Tubes plugged (10% of the bundle)",flood:"Shell flooding: condensate not draining (failed trap)",vb:"Vacuum breaker stuck shut",freeze:"Water flow too low in heating mode",
 dirty:"Dirty fins (less airflow and heat transfer)",dirtyHR:"Dirty core or media",frost:"Frosted (exhaust side iced)",unbal:"Supply air 30% higher than exhaust",stopped:"Wheel stopped (broken belt)",tilt:"Heat pipe tilted the wrong way for the season",pump:"Run-around pump off"};
const TABS={basics:{n:"Basics",subs:["cf","pf"]},plate:{n:"Plate",subs:["gasket","brazed","dwplate"]},shell:{n:"Shell-and-tube",subs:["straight","utube","steam","dwtube"]},coax:{n:"Tube-in-tube",subs:["coax"]},coil:{n:"Coils",subs:["fin","tank"]},recov:{n:"Heat recovery",subs:["hrvplate","wheel","hpipe","loop"]},furn:{n:"Furnace",subs:["cfurn","sfurn"]}};
Object.assign(SUBS,FURN);
/* ---------- state ---------- */
const ST={tab:"basics",sub:{},v:{},F:{},t:0};
Object.keys(TABS).forEach(t=>ST.sub[t]=TABS[t].subs[0]);
function vals(id){if(!ST.v[id]){const s=SUBS[id];ST.v[id]={hT:s.hot.T,cT:s.cold.T,hF:s.hot.f||0,cF:s.cold.f,size:100}}return ST.v[id]}
try{const s=JSON.parse(localStorage.getItem("hx-state")||"null");if(s){if(s.tab&&TABS[s.tab])ST.tab=s.tab;if(s.sub)Object.assign(ST.sub,s.sub)}}catch(e){}
const save=()=>{try{localStorage.setItem("hx-state",JSON.stringify({tab:ST.tab,sub:ST.sub}))}catch(e){}};
/* ---------- the math (effectiveness-NTU) ---------- */
/* ---------- gas furnace: primary, then a condensing secondary ----------
 Natural gas, per 1,000 Btu of input: about 0.72 lb of air to burn it, 0.095 lb of water made, 900 Btu released as sensible heat (the rest is latent in the water vapor).
 The secondary is worked on enthalpy, so the latent heat released below the dew point is counted. UA values are set so the stock furnace lands near 80% and 93%. */
const pwsF=T=>{const R=T+459.67;return Math.exp(-1.0440397e4/R-1.1294650e1-2.7022355e-2*R+1.2890360e-5*R*R-2.4780681e-9*R**3+6.5459673*Math.log(R))};
function furnCalc(s,v,F){const inMBH=v.hF*(F.fOver?1.15:1),EA=v.hT/100,cfm=v.cF*(F.fLowAir?0.6:1)*(F.fDirtySec?0.85:1),Tr=v.cT,Tca=70;
 const Cg=inMBH*(0.72*(1+EA)+0.045)*0.27,Ca=1.08*cfm,Tfl=Tca+inMBH*900/Cg;
 const dry=1+7.52+EA*9.52,pw=14.696*2/(dry+2);let lo=60,hi=160;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(pwsF(m)>pw)hi=m;else lo=m}const dew=(lo+hi)/2;
 const wform=inMBH*0.095,vap=T=>{const q=pwsF(T);return q>=pw?2:dry*q/(14.696-q)},H=T=>Cg*(T-Tca)-wform*1040*(1-vap(T)/2);
 const invH=h=>{let a=Tr-5,b=3600;for(let i=0;i<50;i++){const m=(a+b)/2;if(H(m)>h)b=m;else a=m}return (a+b)/2};
 const k=v.size/100*Math.pow(cfm/1200,0.3),UA1=52.3*k,UA2=s.cond?34*k*(F.fDirtySec?0.4:1)*(F.fTrap?0.45:1):0;
 const e1=1-Math.exp(-UA1/Cg),e2=1-Math.exp(-UA2/Cg);let Tm=Tr,T1=400,T2=400,Q2=0;
 for(let i=0;i<8;i++){T1=Tfl-e1*(Tfl-Tm);Q2=s.cond?e2*(H(T1)-H(Tr)):0;T2=s.cond?invH(H(T1)-Q2):T1;Tm=Tr+Q2/Ca}
 const Q1=Cg*(Tfl-T1),Q=Q1+Q2,Ts=Tr+Q/Ca,water=s.cond?wform*(1-vap(T2)/2):0;
 /* profiles: gas from the burner end (left) to the vent (right), air the other way */
 const N=120,n1=s.cond?50:N,ph=[],pc=[];
 for(let i=0;i<=N;i++){if(i<=n1){const x=i/n1,t=Tm+(Tfl-Tm)*Math.exp(-UA1/Cg*x);ph.push(t);pc.push(Tm+(Ts-Tm)*(Cg*(t-T1))/Math.max(1,Q1))}
  else{const x=(i-n1)/(N-n1),h=H(Tr)+(H(T1)-H(Tr))*Math.exp(-UA2/Cg*x),t=invH(h);ph.push(t);pc.push(Tr+(Tm-Tr)*(h-(H(T1)-Q2))/Math.max(1,Q2))}}
 return {furn:true,cond:s.cond,inMBH,EA,cfm,Tr,Tm,Ts,T1,T2,Tfl,dew,Q,Q1,Q2,eff:Q/(inMBH*1000),rise:Ts-Tr,water,gph:water/8.34,ph,pc,n1,N,lock:!!F.fTrap,crack:!!F.fCrack,dirty:!!F.fDirtySec,coldFlow:v.cF}}
function calc(id){const s=SUBS[id],v=vals(id),F=ST.F[id]||{};
 if(s.arr==="furn")return furnCalc(s,v,F);
 const cap=(side,flow)=>side.kind==="air"?1.08*flow:side.kind==="water"?500*flow:Infinity;
 if(s.arr==="hr"){let e=s.eff*(F.dirtyHR?0.8:1)*(F.stopped?0.08:1)*(F.tilt?0.15:1)*(F.pump?0:1)*(F.frost?0.55:1);
  const Ce=1.08*v.hF,Cs=1.08*v.cF*(F.unbal?1.3:1),Cmin=Math.min(Ce,Cs);const dT=v.hT-v.cT;
  const sa=v.cT+e*Cmin/Cs*dT,ea=v.hT-e*Cmin/Ce*dT;const Q=e*Cmin*dT;
  return {hr:true,e,sa,ea,Q,frost:ea<32&&v.hT>60&&v.cT<32,lat:s.lat}}
 let arr=s.arr;if(F.backward&&arr==="cf")arr="pf";
 let Ch=s.arr==="cond"?Infinity:cap(s.hot,v.hF*(F.lowHot?0.35:1)),Cc=cap(s.cold,v.cF*(F.lowCold||F.freeze?0.35:1)*(F.dirty?0.7:1));
 let UA=s.UA*v.size/100*(s.F||1);
 if(F.scale)UA=1/(1/UA+1/(s.UA*0.9));if(F.air)UA*=0.65;if(F.tubes)UA*=0.9;if(F.dirty)UA*=0.75;if(F.flood)UA*=0.5;if(F.vb)UA*=0.8;if(F.dwleak)UA*=1;if(F.gasket)UA*=1;
 // air side film controls a coil: lower airflow lowers UA too
 if(s.air)UA*=Math.pow(v.cF*(F.dirty?0.7:1)/s.cold.f,0.5);
 const Th=s.arr==="cond"?(s.hot.kind==="steam"?satF(v.hT):v.hT):v.hT,Tc=v.cT;
 const Cmin=Math.min(Ch,Cc),Cmax=Math.max(Ch,Cc),Cr=isFinite(Cmax)?Cmin/Cmax:0,NTU=UA/Cmin;
 let e;if(arr==="pf")e=(1-Math.exp(-NTU*(1+Cr)))/(1+Cr);else if(Math.abs(1-Cr)<1e-6)e=NTU/(1+NTU);else e=(1-Math.exp(-NTU*(1-Cr)))/(1-Cr*Math.exp(-NTU*(1-Cr)));
 const Q=e*Cmin*(Th-Tc),Tho=isFinite(Ch)?Th-Q/Ch:Th,Tco=Tc+Q/Cc;
 const appr=arr==="pf"?Tho-Tco:Math.min(Th-Tco,Tho-Tc);
 // temperature profile along the exchanger (x from the hot inlet end)
 const N=120,ph=[],pc=[];let h=Th,c=arr==="pf"?Tc:Tco;
 for(let i=0;i<=N;i++){ph.push(h);pc.push(c);const dq=UA/N*(h-c);h-=isFinite(Ch)?dq/Ch:0;c+=arr==="pf"?dq/Cc:-dq/Cc}
 const d1=arr==="pf"?Th-Tc:Th-Tco,d2=arr==="pf"?Tho-Tco:Tho-Tc,lmtd=Math.abs(d1-d2)<0.01?d1:(d1-d2)/Math.log(d1/d2);
 return {Th,Tc,Tho,Tco,Q,e,appr,lmtd,ph,pc,arr,cross:arr==="cf"&&Tco>Tho&&isFinite(Ch),hotFlow:v.hF,coldFlow:v.cF,UA}}
/* ---------- drawing helpers ---------- */
const flow=(d,col,w=4,fast=1)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path class="hxFlow${fast>1?" fast":""}" d="${d}" fill="none" stroke="#fff" stroke-width="${Math.max(1.2,w*0.35)}" stroke-linecap="round" stroke-dasharray="3 14" opacity=".75"/>`;
const lbl=(x,y,t,a="middle",c="")=>`<text x="${x}" y="${y}" class="hxL${c?" "+c:""}" style="text-anchor:${a}">${esc(t)}</text>`;
const temp=(x,y,T,a="middle")=>`<text x="${x}" y="${y}" class="hxT" style="text-anchor:${a};fill:${tcol(T)}">${Math.round(T)}°F</text>`;
const nozzle=(x,y,dir,col)=>{const v=dir==="u"||dir==="d";return v?`<rect x="${x-9}" y="${y-14}" width="18" height="28" fill="url(#zSteel)" stroke="${SE}"/><rect x="${x-14}" y="${dir==="u"?y-18:y+10}" width="28" height="8" rx="1.5" fill="url(#zSteelH)" stroke="${SE}"/><rect x="${x-5}" y="${y-12}" width="10" height="24" fill="${col}" opacity=".35"/>`:`<rect x="${x-14}" y="${y-9}" width="28" height="18" fill="url(#zSteelH)" stroke="${SE}"/><rect x="${dir==="l"?x-18:x+10}" y="${y-14}" width="8" height="28" rx="1.5" fill="url(#zSteel)" stroke="${SE}"/>`};
const grad=(id,c1,c2,vert)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
/* ---------- drawings per exchanger (800 x 360) ---------- */
function drawBasic(R,pf){const y1=130,y2=230;let s=`<defs>${grad("gH",tcol(R.Th),tcol(R.Tho))}${grad("gC",pf?tcol(R.Tc):tcol(R.Tco),pf?tcol(R.Tco):tcol(R.Tc))}</defs>`;
 s+=`<rect x="150" y="${y1-40}" width="500" height="180" rx="14" fill="url(#zSteel)" stroke="${SE}" opacity=".35"/>`;
 s+=`<rect x="160" y="${y1-24}" width="480" height="48" rx="8" fill="url(#gH)" opacity=".85"/><rect x="160" y="${y2-24}" width="480" height="48" rx="8" fill="url(#gC)" opacity=".85"/><path d="M160 180 H640" stroke="${K}" stroke-width="3"/>`;
 s+=flow(`M60 ${y1} H740`,tcol((R.Th+R.Tho)/2),6)+(pf?flow(`M60 ${y2} H740`,tcol((R.Tc+R.Tco)/2),6):flow(`M740 ${y2} H60`,tcol((R.Tc+R.Tco)/2),6));
 s+=lbl(60,y1-14,"HOT IN","start")+temp(60,y1+30,R.Th,"start")+lbl(740,y1-14,"HOT OUT","end")+temp(740,y1+30,R.Tho,"end");
 s+=pf?lbl(60,y2-14,"COLD IN","start")+temp(60,y2+30,R.Tc,"start")+lbl(740,y2-14,"COLD OUT","end")+temp(740,y2+30,R.Tco,"end"):lbl(740,y2-14,"COLD IN","end")+temp(740,y2+30,R.Tc,"end")+lbl(60,y2-14,"COLD OUT","start")+temp(60,y2+30,R.Tco,"start");
 s+=lbl(400,y1-50,pf?"PARALLEL FLOW: BOTH ENTER AT THE LEFT":"COUNTERFLOW: OPPOSITE DIRECTIONS")+lbl(400,186,"WALL","middle","m");
 return s}
function drawGasket(R,kind){let s="";const n=kind==="brazed"?14:18,x0=kind==="brazed"?300:250,pw=kind==="brazed"?14:14;
 if(kind!=="brazed"){s+=`<rect x="140" y="56" width="560" height="10" rx="3" fill="url(#zSteelH)" stroke="${SE}"/><rect x="140" y="300" width="560" height="10" rx="3" fill="url(#zSteelH)" stroke="${SE}"/>`+lbl(420,50,"CARRYING BAR")+lbl(420,326,"GUIDE BAR");
  s+=`<rect x="200" y="50" width="44" height="270" rx="4" fill="url(#zBlue)" stroke="${K}"/><rect x="${x0+n*pw+6}" y="66" width="36" height="240" rx="4" fill="url(#zBlue)" stroke="${K}"/><rect x="694" y="44" width="16" height="280" rx="3" fill="url(#zSteel)" stroke="${SE}"/>`+lbl(222,340,"FRAME PLATE")+lbl(x0+n*pw+24,340,"PRESSURE PLATE");
  [80,290].forEach(y=>{s+=`<rect x="190" y="${y-4}" width="520" height="8" rx="3" fill="url(#zSteelH)" stroke="${SE}"/>`+[196,706].map(x=>`<rect x="${x-7}" y="${y-8}" width="14" height="16" rx="2" fill="#555"/>`).join("")});s+=lbl(620,274,"TIE BOLTS","middle","m")}
 else s+=`<rect x="${x0-8}" y="70" width="${n*pw+16}" height="230" rx="8" fill="url(#zSteel)" stroke="${SE}"/>`+lbl(x0+n*pw/2,320,"BRAZED BLOCK: NO GASKETS, NO FRAME");
 for(let i=0;i<n;i++){const hot=i%2===0,x=x0+i*pw;s+=`<rect x="${x}" y="88" width="${pw-3}" height="196" rx="2" fill="${hot?tcol((R.Th+R.Tho)/2):tcol((R.Tc+R.Tco)/2)}" opacity=".55" stroke="${K}" stroke-width=".6"/>`;
  if(kind==="dwplate")s+=`<rect x="${x+pw-3}" y="88" width="2" height="196" fill="#fff" opacity=".8"/>`;
  s+=`<path class="hxFlow" d="M${x+pw/2-1} ${hot?96:276} V${hot?276:96}" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 10" opacity=".8"/>`}
 // ports: hot in top left, hot out bottom left; cold in bottom right side (counterflow) -> drawn on frame plate side
 const fx=kind==="brazed"?x0-8:200;
 s+=flow(`M60 104 H${fx}`,tcol(R.Th),8)+flow(`M${fx} 268 H60`,tcol(R.Tho),8)+flow(`M60 300 H${fx-20} V292 H${fx}`.replace(`M60 300 H${fx-20} V292 H${fx}`,`M120 330 V280 H${fx}`),tcol(R.Tc),8)+flow(`M${fx} 92 H120 V30`,tcol(R.Tco),8);
 s+=lbl(56,96,"HOT IN","start")+temp(56,124,R.Th,"start")+lbl(56,260,"HOT OUT","start")+temp(56,288,R.Tho,"start")+lbl(130,350,"COLD IN","start")+temp(132,334,R.Tc,"start")+lbl(130,24,"COLD OUT","start")+temp(132,44,R.Tco,"start");
 if(kind==="dwplate")s+=lbl(460,358,"DOUBLE PLATES WITH A VENTED GAP: A LEAK DRIPS OUT, NEVER MIXES","middle","m");
 const F=ST.F[ST.sub.plate]||{};if(F.gasket)s+=`<g class="hxDrip">${[0,1,2].map(i=>`<circle cx="${x0+40+i*60}" cy="${296+i*4}" r="3" fill="var(--cold)"/>`).join("")}</g>`+lbl(x0+120,296,"GASKET LEAK: WATER ON THE FLOOR","middle","bad");
 if(F.dwleak)s+=`<g class="hxDrip"><circle cx="${x0+n*pw/2}" cy="296" r="3" fill="var(--cold)"/></g>`+lbl(x0+n*pw/2,316,"DRIP AT THE LEAK DETECTION GAP","middle","bad");
 s+=lbl(x0+n*pw/2,kind==="brazed"?60:24,"ALTERNATE CHANNELS: HOT DOWN, COLD UP","middle","m");return s}
function drawShell(R,kind){let s="";const ut=kind!=="straight",y0=110,y1=270,xl=180,xr=640;
 const shellCol=tcol((R.Th+R.Tho)/2);
 s+=`<rect x="${xl}" y="${y0}" width="${xr-xl}" height="${y1-y0}" rx="${(y1-y0)/2}" fill="url(#zSteelH)" stroke="${SE}" stroke-width="1.5" opacity=".9"/><rect x="${xl+6}" y="${y0+8}" width="${xr-xl-12}" height="${y1-y0-16}" rx="${(y1-y0)/2-8}" fill="${kind==="steam"?"#e9edf0":shellCol}" opacity="${kind==="steam"?.9:.25}"/>`;
 // channel head on the left (and right for straight)
 s+=`<rect x="${xl-80}" y="${y0+4}" width="84" height="${y1-y0-8}" rx="12" fill="url(#zSteelH)" stroke="${SE}"/><rect x="${xl-6}" y="${y0-6}" width="12" height="${y1-y0+12}" fill="#555"/>`+lbl(xl,y1+40,"TUBESHEET")+lbl(xl-40,y0-10,"CHANNEL HEAD");
 s+=`<path d="M${xl-80} ${(y0+y1)/2} H${xl}" stroke="${K}" stroke-width="3"/>`+lbl(xl-40,(y0+y1)/2-6,"PASS","middle","m")+lbl(xl-40,(y0+y1)/2+12,"PARTITION","middle","m");
 if(!ut)s+=`<rect x="${xr-4}" y="${y0+4}" width="84" height="${y1-y0-8}" rx="12" fill="url(#zSteelH)" stroke="${SE}"/><rect x="${xr-6}" y="${y0-6}" width="12" height="${y1-y0+12}" fill="#555"/>`;
 // tubes
 const rows=[0,1,2,3,4,5].map(i=>y0+24+i*((y1-y0-48)/5));const tc=(i)=>tcol(i<3?R.Tc+(R.Tco-R.Tc)*0.35:R.Tc+(R.Tco-R.Tc)*0.85);
 rows.forEach((y,i)=>{if(ut){const yy=rows[5-i];if(i<3)s+=`<path d="M${xl} ${y} H${xr-60-i*14} A${(yy-y)/2} ${(yy-y)/2} 0 0 1 ${xr-60-i*14} ${yy} H${xl}" fill="none" stroke="#b07a4a" stroke-width="6"/><path class="hxFlow" d="M${xl} ${y} H${xr-60-i*14} A${(yy-y)/2} ${(yy-y)/2} 0 0 1 ${xr-60-i*14} ${yy} H${xl}" fill="none" stroke="${tcol(R.Tc+(R.Tco-R.Tc)*0.5)}" stroke-width="3" stroke-dasharray="6 10"/>`}
  else s+=`<path d="M${xl} ${y} H${xr}" stroke="#b07a4a" stroke-width="6"/><path class="hxFlow" d="${i<3?`M${xl} ${y} H${xr}`:`M${xr} ${y} H${xl}`}" stroke="${tc(i)}" stroke-width="3" stroke-dasharray="6 10"/>`});
 // baffles
 if(kind!=="steam")[260,340,420,500].forEach((x,i)=>{s+=`<rect x="${x-3}" y="${i%2?y0+30:y0+8}" width="6" height="${y1-y0-38}" fill="#6b7378"/>`});
 if(kind!=="steam")s+=flow(`M${xl+40} ${y0-40} V${y0+20} L280 ${y1-30} L300 ${y0+30} L380 ${y1-30} L400 ${y0+30} L460 ${y1-30} L480 ${y0+30} L560 ${y1-30} L${xr-60} ${y1-20} V${y1+40}`,shellCol,4)+lbl(xl+40,y0-48,"SHELL IN")+temp(xl+70,y0-30,R.Th,"start")+lbl(xr-60,y1+56,"SHELL OUT")+temp(xr-30,y1+40,R.Tho,"start")+lbl(380,y0-6,"BAFFLES","middle","m");
 else{s+=flow(`M${xl+120} ${y0-50} V${y0+10}`,tcol(R.Th),8)+lbl(xl+120,y0-58,"STEAM IN")+temp(xl+150,y0-34,R.Th,"start")+flow(`M${xr-80} ${y1-6} V${y1+60} H${xr+40}`,tcol(R.Th-10),4);
  s+=`<rect x="${xr+40}" y="${y1+44}" width="44" height="32" rx="6" fill="url(#zShell)" stroke="${K}"/>`+lbl(xr+62,y1+92,"F&T TRAP")+lbl(xr-90,y1+40,"CONDENSATE","end");
  s+=`<path d="M${xr-140} ${y0} V${y0-30}" stroke="${SE}" stroke-width="4"/><rect x="${xr-150}" y="${y0-50}" width="20" height="22" rx="4" fill="url(#zBrass)" stroke="#6a4a12"/>`+lbl(xr-140,y0-56,"VACUUM BREAKER");
  const F=ST.F.steam||{};if(F.flood)s+=`<rect x="${xl+8}" y="${y1-50}" width="${xr-xl-16}" height="40" rx="18" fill="var(--cold)" opacity=".45"/>`+lbl(400,y1-24,"CONDENSATE BACKED UP IN THE SHELL","middle","bad")}
 // tube-side nozzles
 s+=flow(`M${xl-40} ${y1+60} V${y1-10}`,tcol(R.Tc),6)+flow(`M${xl-40} ${y0+10} V${y0-60}`,tcol(R.Tco),6)+lbl(xl-40,y1+76,"TUBE IN")+temp(xl-10,y1+60,R.Tc,"start")+lbl(xl-40,y0-66,"TUBE OUT")+temp(xl-10,y0-50,R.Tco,"start");
 if(kind==="dwtube")s+=lbl(410,y1+30,"EACH TUBE IS TWO WALLS; A LEAK DRAINS TO THE TELL-TALE","middle","m")+`<rect x="${xl-30}" y="${y1-2}" width="10" height="14" fill="#c9a24a"/>`;
 const F=ST.F[ST.sub.shell]||{};if(F.dwleak&&kind==="dwtube")s+=`<g class="hxDrip"><circle cx="${xl-25}" cy="${y1+20}" r="3" fill="var(--cold)"/></g>`+lbl(xl-10,y1+24,"TELL-TALE DRIPPING","start","bad");
 if(F.tubes)s+=lbl(410,y0+4,"PLUGGED TUBES: LESS SURFACE","middle","bad");
 return s}
function drawCoax(R){let s="";const F=ST.F.coax||{};
 // straight cutaway on top
 s+=`<rect x="120" y="70" width="560" height="56" rx="28" fill="${tcol(R.Th)}" opacity=".35" stroke="${SE}" stroke-width="2"/><rect x="120" y="86" width="560" height="24" rx="12" fill="url(#zCuH)" stroke="#7a4a20"/>`;
 s+=flow(`M110 98 H690`,tcol((R.Tc+R.Tco)/2),5)+flow(`M690 78 H110`,tcol(R.Th),3)+flow(`M690 118 H110`,tcol(R.Th),3);
 s+=lbl(110,60,"WATER IN","start")+temp(110,148,R.Tc,"start")+lbl(690,60,"WATER OUT","end")+temp(690,148,R.Tco,"end")+lbl(400,60,"REFRIGERANT IN THE OUTER SPACE, WATER IN THE INNER TUBE: COUNTERFLOW");
 // cross-section and coil
 s+=`<circle cx="210" cy="250" r="56" fill="${tcol(R.Th)}" opacity=".35" stroke="${SE}" stroke-width="3"/><circle cx="210" cy="250" r="26" fill="url(#zCuV)" stroke="#7a4a20" stroke-width="2"/><circle cx="210" cy="250" r="21" fill="${tcol((R.Tc+R.Tco)/2)}" opacity=".7"/>`+lbl(210,330,"CROSS SECTION")+lbl(210,254,"WATER")+lbl(210,206,"REFRIGERANT","middle","m");
 for(let i=0;i<6;i++)s+=`<ellipse cx="520" cy="${190+i*22}" rx="120" ry="16" fill="none" stroke="#7d868c" stroke-width="12"/><ellipse cx="520" cy="${190+i*22}" rx="120" ry="16" fill="none" stroke="#b07a4a" stroke-width="5" stroke-dasharray="${i%2?"0":"0"}"/>`;
 s+=lbl(520,330,"COILED TO FIT IN THE CABINET");
 if(F.freeze)s+=lbl(520,170,"LOW FLOW IN HEATING: WATER CAN FREEZE AND SPLIT THE TUBE","middle","bad");
 return s}
function drawFin(R){let s="";const F=ST.F.fin||{};const x0=300,rows=4,depth=60;
 // casing
 s+=`<rect x="${x0-20}" y="60" width="${rows*depth+40}" height="250" rx="4" fill="url(#zSteel)" stroke="${SE}" opacity=".5"/>`;
 for(let i=0;i<34;i++)s+=`<path d="M${x0} ${70+i*7} H${x0+rows*depth}" stroke="#aab2b7" stroke-width="1"/>`;
 // rows of tubes: water enters the last row (leaving-air side) when counterflow
 const back=F.backward;for(let r=0;r<rows;r++){const frac=back?r/(rows-1):1-r/(rows-1);const T=R.Tho+(R.Th-R.Tho)*frac;for(let k=0;k<6;k++)s+=`<circle cx="${x0+30+r*depth}" cy="${86+k*42}" r="10" fill="url(#zCuV)" stroke="#7a4a20"/><circle cx="${x0+30+r*depth}" cy="${86+k*42}" r="6" fill="${tcol(T)}"/>`}
 if(F.dirty)s+=`<rect x="${x0-6}" y="64" width="12" height="242" fill="#7a6a4a" opacity=".7"/>`+lbl(x0,330,"DIRTY FACE","middle","bad");
 // air arrows
 [100,160,220,280].forEach(y=>{s+=flow(`M90 ${y} H${x0-20}`,tcol(R.Tc),5)+flow(`M${x0+rows*depth+20} ${y} H720`,tcol(R.Tco),5)});
 s+=lbl(90,80,"AIR IN","start")+temp(90,330,R.Tc,"start")+lbl(720,80,"AIR OUT","end")+temp(720,330,R.Tco,"end");
 const inX=back?x0+30:x0+30+(rows-1)*depth,outX=back?x0+30+(rows-1)*depth:x0+30;
 s+=flow(`M${inX} 20 V62`,tcol(R.Th),6)+flow(`M${outX} 62 V20`,tcol(R.Tho),6)+lbl(inX,14,"WATER IN")+temp(inX+14,40,R.Th,"start")+lbl(outX,14,"WATER OUT")+temp(outX-14,40,R.Tho,"end");
 s+=lbl(x0+rows*depth/2,350,back?"PIPED BACKWARD: WATER ENTERS ON THE ENTERING-AIR SIDE":"WATER ENTERS ON THE LEAVING-AIR SIDE: COUNTERFLOW","middle",back?"bad":"m");
 return s}
function drawTank(R){let s="";
 s+=`<rect x="300" y="40" width="200" height="290" rx="40" fill="url(#zSteelH)" stroke="${SE}" stroke-width="2"/><rect x="312" y="56" width="176" height="262" rx="32" fill="url(#hxTank)"/>`;
 s=`<defs>${grad("hxTank",tcol(R.Tco),tcol(R.Tc),true)}</defs>`+s;
 let d="M300 300";for(let i=0;i<5;i++){d+=` C340 ${296-i*18} 460 ${296-i*18} 470 ${288-i*18} C460 ${280-i*18} 340 ${280-i*18} 330 ${284-i*18}`}
 s+=`<path d="M330 290 ${Array.from({length:5},(_,i)=>`Q400 ${300-i*20} 470 ${288-i*20} Q400 ${276-i*20} 330 ${282-i*20-6}`).join(" ")}" fill="none" stroke="#b07a4a" stroke-width="7"/>`;
 s+=flow(`M180 200 H300 V210 H330`,tcol(R.Th),6)+flow(`M330 290 H300 V300 H180`,tcol(R.Tho),6)+lbl(180,190,"BOILER SUPPLY","start")+temp(180,226,R.Th,"start")+lbl(180,316,"BOILER RETURN","start")+temp(180,290,R.Tho,"start");
 s+=flow(`M620 120 H520 V60 H460 V300`,tcol(R.Tc),4)+lbl(620,110,"COLD IN (DIP TUBE)","end")+temp(620,140,R.Tc,"end");
 s+=flow(`M420 56 V24 H620`,tcol(R.Tco),5)+lbl(620,16,"HOT OUT","end")+temp(620,44,R.Tco,"end");
 s+=`<rect x="490" y="80" width="30" height="16" fill="url(#zBrass)" stroke="#6a4a12"/>`+lbl(560,92,"T&P RELIEF","start")+lbl(400,350,"COIL IN THE BOTTOM OF THE TANK");
 return s}
function drawHR(R,kind){let s="";const v=vals(kind);const oa=v.cT,ra=v.hT;
 const duct=(x,y,w,h,T)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tcol(T)}" opacity=".18" stroke="${SE}" stroke-width="1.5"/>`;
 if(kind==="hrvplate"){s+=`<g transform="translate(400 190) rotate(45)"><rect x="-90" y="-90" width="180" height="180" fill="url(#zAlu)" stroke="${SE}" stroke-width="2"/>${Array.from({length:12},(_,i)=>`<path d="M-90 ${-90+i*15} H90" stroke="#9aa3a9" stroke-width="1"/>`).join("")}</g>`;
  s+=flow(`M60 120 H300 L500 260 H740`,tcol((oa+R.sa)/2),6)+flow(`M740 120 H500 L300 260 H60`,tcol((ra+R.ea)/2),6);
  s+=lbl(60,110,"OUTDOOR AIR IN","start")+temp(60,146,oa,"start")+lbl(740,250,"SUPPLY AIR","end")+temp(740,290,R.sa,"end")+lbl(740,110,"RETURN AIR IN","end")+temp(740,146,ra,"end")+lbl(60,250,"EXHAUST AIR","start")+temp(60,290,R.ea,"start")+lbl(400,340,"CROSSFLOW CORE: THE STREAMS NEVER MIX")}
 if(kind==="wheel"){const st=ST.F.wheel&&ST.F.wheel.stopped;s+=duct(80,60,640,110,ra)+duct(80,190,640,110,oa);
  s+=`<clipPath id="hxWc"><ellipse cx="400" cy="180" rx="34" ry="128"/></clipPath><ellipse cx="400" cy="180" rx="34" ry="128" fill="url(#zAlu)" stroke="${SE}" stroke-width="2"/><g clip-path="url(#hxWc)"><g class="${st?"":"hxSpin"}">${Array.from({length:12},(_,i)=>`<path d="M366 ${36+i*24} H434" stroke="#8d969b" stroke-width="1.2"/>`).join("")}</g></g><path d="M80 180 H720" stroke="${K}" stroke-width="4"/><rect x="392" y="176" width="16" height="8" fill="#555"/>`;
  s+=flow(`M720 115 H80`,tcol(ra),6)+flow(`M80 245 H720`,tcol(oa),6);
  s+=lbl(720,90,"EXHAUST FROM BUILDING","end")+temp(720,150,ra,"end")+lbl(80,90,"EXHAUST OUT","start")+temp(80,150,R.ea,"start")+lbl(80,220,"OUTDOOR AIR IN","start")+temp(80,280,oa,"start")+lbl(720,220,"SUPPLY AIR","end")+temp(720,280,R.sa,"end");
  s+=lbl(400,330,st?"WHEEL STOPPED: ALMOST NO RECOVERY":"WHEEL TURNS: MEDIA PICKS UP HEAT AND MOISTURE IN ONE STREAM, GIVES IT UP IN THE OTHER","middle",st?"bad":"")+lbl(470,196,"PURGE","start","m")}
 if(kind==="hpipe"){s+=duct(80,60,640,110,ra)+duct(80,190,640,110,oa)+`<path d="M80 180 H720" stroke="${K}" stroke-width="4"/>`;
  for(let i=0;i<7;i++){const x=300+i*32;s+=`<rect x="${x-5}" y="70" width="10" height="220" rx="5" fill="url(#zCuV)" stroke="#7a4a20"/>`;for(let k=0;k<14;k++)s+=`<path d="M${x-12} ${78+k*15} h24" stroke="#aab2b7" stroke-width="1.4"/>`}
  const up=oa<ra;s+=lbl(530,104,up?"WARM END: LIQUID BOILS":"WARM END: VAPOR CONDENSES","start","m")+lbl(530,236,up?"COLD END: VAPOR CONDENSES":"COLD END: LIQUID BOILS","start","m");
  s+=flow(`M720 115 H80`,tcol(ra),6)+flow(`M80 245 H720`,tcol(oa),6)+lbl(720,90,"EXHAUST IN","end")+temp(720,150,ra,"end")+lbl(80,90,"EXHAUST OUT","start")+temp(80,150,R.ea,"start")+lbl(80,220,"OUTDOOR AIR","start")+temp(80,280,oa,"start")+temp(720,280,R.sa,"end")+lbl(720,220,"SUPPLY","end");
  const F=ST.F.hpipe||{};s+=lbl(400,330,F.tilt?"TILTED THE WRONG WAY: LIQUID CAN'T RETURN TO THE WARM END":"NO PUMP, NO MOVING PARTS: SET UP BY TILT","middle",F.tilt?"bad":"")}
 if(kind==="loop"){s+=duct(60,50,280,120,ra)+duct(460,190,280,120,oa);
  s+=`<rect x="180" y="60" width="40" height="100" fill="url(#zFins)" stroke="${SE}"/><rect x="580" y="200" width="40" height="100" fill="url(#zFins)" stroke="${SE}"/>`;
  const F=ST.F.loop||{};const gl=tcol((R.ea+R.sa)/2);s+=flow(`M200 160 V250 H580`,gl,5,F.pump?0:1)+flow(`M600 200 V30 H200 V60`,gl,5);
  s+=`<circle cx="390" cy="250" r="16" fill="url(#zMotor)" stroke="${K}"/>`+lbl(390,280,F.pump?"PUMP OFF":"PUMP","middle",F.pump?"bad":"")+`<rect x="370" y="10" width="40" height="22" rx="8" fill="url(#zSteelH)" stroke="${SE}"/>`+lbl(430,26,"EXPANSION TANK","start","m");
  s+=flow(`M340 110 H60`,tcol(ra),5)+flow(`M460 250 H740`,tcol(oa),5)+lbl(340,70,"EXHAUST DUCT","end")+temp(340,190,ra,"end")+temp(60,190,R.ea,"start")+lbl(460,330,"OUTDOOR AIR DUCT","start")+temp(460,180,oa,"start")+temp(740,180,R.sa,"end")+lbl(180,330,"GLYCOL LOOP: DUCTS CAN BE FAR APART");}
 if(R.frost)s+=lbl(400,24,"FROST RISK: EXHAUST LEAVING BELOW 32°F. THE UNIT NEEDS DEFROST OR PREHEAT.","middle","bad");
 return s}
/* gas furnace cutaway: upflow, seen from the side. Vestibule (burners, inducer) on the left, blower at the bottom. */
function drawFurn(R){let s="";const c=R.cond,x0=230,x1=560,vx=310;
 const hot=T=>T>600?"#ff9d2e":T>300?"#e8602c":tcol(Math.min(200,T));
 s+=`<defs><linearGradient id="fuP" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb347"/><stop offset=".5" stop-color="#f0702c"/><stop offset="1" stop-color="${hot(R.T1)}"/></linearGradient><linearGradient id="fuS" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${hot(R.T1)}"/><stop offset="1" stop-color="${tcol(R.T2)}"/></linearGradient></defs>`;
 /* cabinet, vestibule wall, blower deck */
 s+=`<rect x="${x0}" y="14" width="${x1-x0}" height="336" rx="4" fill="url(#zCab)" stroke="${SE}" stroke-width="2"/><rect x="${vx+4}" y="22" width="${x1-vx-12}" height="232" fill="url(#zInside)"/><rect x="${x0+8}" y="22" width="${vx-x0-12}" height="232" fill="#3a4146"/><rect x="${x0+8}" y="262" width="${x1-x0-16}" height="80" fill="#2f3438"/><path d="M${vx} 22 V254" stroke="${K}" stroke-width="4"/><path d="M${x0+8} 258 H${x1-8}" stroke="${K}" stroke-width="4"/>`;
 /* air: return in at the bottom right, up through both exchangers, out the top */
 const aT=[R.Tr,R.Tm,R.Ts];
 s+=flow(`M620 310 H${x1-20}`,tcol(R.Tr),6);
 [350,410,470,520].forEach((x,i)=>{s+=`<path class="hxFlow" d="M${x} 250 V30" fill="none" stroke="${tcol(R.Ts)}" stroke-width="2.5" stroke-dasharray="5 12" opacity=".55"/>`});
 /* blower */
 s+=zBlower(430,302,34,"fuBl");
 /* primary: serpentine tube */
 const yb=c?196:206,legs=c?[yb,yb-52,yb-104]:[yb,yb-80];const xa=vx+26,xb=x1-44;
 let d=`M${vx-14} ${legs[0]} H${xb}`;for(let i=1;i<legs.length;i++){const r=(legs[i-1]-legs[i])/2;d+=i%2?` a${r} ${r} 0 0 0 0 ${-2*r} H${xa}`:` a${r} ${r} 0 0 1 0 ${-2*r} H${xb}`}
 if(!c)d+=` H${vx-10}`;
 s+=`<path d="${d}" fill="none" stroke="#3a3f42" stroke-width="27" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="url(#fuP)" stroke-width="21" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="3" opacity=".18" transform="translate(0 -6)"/><path class="hxFlow" d="${d}" fill="none" stroke="#fff3" stroke-width="4" stroke-dasharray="4 14"/>`;
 if(R.crack)s+=`<path d="M${xa+90} ${legs[1]-12} l6 7 l-5 5 l7 6 l-4 6" fill="none" stroke="#111" stroke-width="2.4"/><circle cx="${xa+92}" cy="${legs[1]}" r="18" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="4 3"/>`+lbl(xa+116,legs[1]+5,"crack","start","bad");
 /* burner and flame in the vestibule */
 s+=`<rect x="${x0+16}" y="${legs[0]-9}" width="46" height="18" rx="3" fill="url(#zSteel)" stroke="${K}"/><rect x="${x0+14}" y="${legs[0]+16}" width="30" height="26" rx="3" fill="#7a8388" stroke="${K}"/><path d="M${x0+30} ${legs[0]+16} V${legs[0]+9}" stroke="#d9b13b" stroke-width="5"/>`;
 s+=`<path d="M${x0+62} ${legs[0]} q${R.crack?26:34} ${R.crack?-16:-9} ${R.crack?44:70} ${R.crack?-6:0} q${R.crack?-20:-36} 9 ${R.crack?-44:-70} ${R.crack?6:0}z" fill="url(#zFlame)"><animate attributeName="opacity" values="1;.75;1" dur="${R.crack?0.25:0.6}s" repeatCount="indefinite"/></path>`;
 let ix,iy;
 if(c){/* transition at the back, secondary coil, cold collector box, inducer */
  const ys=232,yt=legs[2];
  s+=`<path d="M${xb} ${yt} H${x1-22} V${ys} H${xb}" fill="none" stroke="#3a3f42" stroke-width="20" stroke-linejoin="round"/><path d="M${xb} ${yt} H${x1-22} V${ys} H${xb}" fill="none" stroke="${hot(R.T1)}" stroke-width="14" stroke-linejoin="round"/>`;
  s+=`<rect x="${xa-6}" y="${ys-13}" width="${xb-xa+10}" height="26" fill="url(#zFinsH)" stroke="${SE}" stroke-width="1.4"/><path d="M${xb} ${ys} H${xa}" stroke="url(#fuS)" stroke-width="9"/><path class="hxFlow" d="M${xb} ${ys} H${xa}" fill="none" stroke="#fff5" stroke-width="3" stroke-dasharray="4 12"/>`;
  if(R.dirty)s+=`<rect x="${xa-6}" y="${ys+9}" width="${xb-xa+10}" height="8" fill="#7b6a4a" opacity=".9"/>`+lbl((xa+xb)/2,ys+34,"lint on the fins","middle","bad");
  s+=`<rect x="${vx-22}" y="${ys-18}" width="44" height="36" rx="3" fill="#d9dde0" stroke="${SE}" stroke-width="1.5"/>`;
  if(R.lock)s+=`<rect x="${vx-20}" y="${ys-4}" width="40" height="20" fill="#5fa8e0"/><rect x="${xa-6}" y="${ys+2}" width="${(xb-xa)*0.45}" height="10" fill="#5fa8e0" opacity=".85"/>`;
  ix=x0+42;iy=ys-52;
  s+=`<path d="M${vx-22} ${ys-6} H${ix} V${iy}" fill="none" stroke="#d9dde0" stroke-width="12"/><circle cx="${ix}" cy="${iy}" r="20" fill="url(#zPlasticDk)" stroke="${K}" stroke-width="1.5"/><circle cx="${ix}" cy="${iy}" r="7" fill="#8d969c"/>`;
  /* PVC vent and intake */
  s+=`<path d="M${ix} ${iy-20} V-4" stroke="#f1f1ea" stroke-width="16"/><path d="M${ix-8} ${iy-20} V-4M${ix+8} ${iy-20} V-4" stroke="#9aa3a8" stroke-width="1"/>`+flow(`M${ix} ${iy-22} V2`,tcol(R.T2),3);
  /* condensate trap and drain */
  s+=`<path d="M${vx-8} ${ys+18} V${ys+34} q0 10 -10 10 h-8 q-10 0 -10 -10 v-6 q0 -8 -8 -8 H${x0-30}" fill="none" stroke="#e9e9e2" stroke-width="7"/><path d="M${vx-8} ${ys+18} V${ys+34} q0 10 -10 10 h-8 q-10 0 -10 -10 v-6 q0 -8 -8 -8 H${x0-30}" fill="none" stroke="${R.lock?"#8a6a3a":"#5fa8e0"}" stroke-width="3" ${R.lock?"":'class="hxFlow" stroke-dasharray="3 9"'}/>`;
  s+=lbl(x0-34,ys+20,R.lock?"drain blocked":"condensate "+R.gph.toFixed(2)+" gal/h","end",R.lock?"bad":"")+lbl(x0-34,ys+38,"trap, plastic drain","end");
  s+=lbl(x1+14,ys-2,"SECONDARY","start")+lbl(x1+14,ys+14,"stainless tube-and-fin","start")+temp(x1+14,178,R.T1,"start")+lbl(x1+62,178,"gas into the secondary","start");
  s+=lbl(x0-34,40,"PVC vent","end")+temp(x0-34,58,R.T2,"end")+lbl(x0-34,iy+4,"inducer","end");
 }else{ix=x0+42;iy=legs[1];
  s+=`<rect x="${vx-22}" y="${iy-18}" width="34" height="36" rx="3" fill="#8b949a" stroke="${SE}" stroke-width="1.5"/><path d="M${vx-22} ${iy} H${ix}" stroke="#8b949a" stroke-width="12"/><circle cx="${ix}" cy="${iy}" r="20" fill="url(#zSteel)" stroke="${K}" stroke-width="1.5"/><circle cx="${ix}" cy="${iy}" r="7" fill="#5f686d"/>`;
  s+=`<path d="M${ix} ${iy-20} V-4" stroke="url(#zSteelH)" stroke-width="18"/>`+flow(`M${ix} ${iy-22} V2`,"#e8602c",3);
  s+=lbl(x0-34,40,"metal vent","end")+temp(x0-34,58,R.T1,"end")+lbl(x0-34,iy+4,"inducer","end");}
 s+=lbl(x1+14,legs[1]-8,"PRIMARY","start")+lbl(x1+14,legs[1]+8,"steel serpentine tubes","start");
 s+=lbl(x0-34,legs[0]+4,"burner","end")+lbl(x0-34,legs[0]+34,"gas valve","end");
 s+=lbl(640,300,"RETURN AIR","start")+temp(640,326,R.Tr,"start")+lbl(430,348,"blower "+Math.round(R.cfm)+" cfm");
 s+=flow(`M${(vx+x1)/2} 14 V-6`,tcol(R.Ts),6)+lbl(x1+14,34,"SUPPLY AIR","start")+temp(x1+14,58,R.Ts,"start");
 if(c)s+=temp(x1+14,200,R.Tm,"start")+lbl(x1+62,200,"air between the two","start");
 return s}
function furnGraph(R,W,H,L,Rr,T0,B){const hi=R.cond?500:1200,lo=40,X=i=>L+(Rr-L)*i/R.N,Y=t=>B-(Math.min(hi,t)-lo)/(hi-lo)*(B-T0);
 let g=`<path d="M${L} ${T0} V${B} H${Rr}" stroke="var(--muted)" fill="none"/>`;
 for(let t=R.cond?100:200;t<=hi;t+=R.cond?100:200)g+=`<path d="M${L} ${Y(t)} H${Rr}" stroke="var(--line)" stroke-width=".6" opacity=".6"/><text x="${L-6}" y="${Y(t)+4}" class="hxG" style="text-anchor:end">${t}</text>`;
 if(R.cond)g+=`<rect x="${X(R.n1)}" y="${T0}" width="${Rr-X(R.n1)}" height="${B-T0}" fill="#2f6fd6" opacity=".06"/><path d="M${X(R.n1)} ${T0} V${B}" stroke="var(--muted)" stroke-dasharray="3 3"/><text x="${(X(R.n1)+Rr)/2}" y="${T0+12}" class="hxG" style="text-anchor:middle">secondary</text>`;
 g+=`<text x="${(L+X(R.n1))/2}" y="${T0+12}" class="hxG" style="text-anchor:middle">primary</text>`;
 g+=`<path d="M${L} ${Y(R.dew)} H${Rr}" stroke="#7a5cd0" stroke-width="1.6" stroke-dasharray="6 4"/><text x="${L+(X(R.n1)-L)*0.35}" y="${Y(R.dew)-6}" class="hxG" style="text-anchor:start;fill:#7a5cd0">flue gas dew point ${Math.round(R.dew)}°F</text>`;
 const i0=R.ph.findIndex(t=>t<=hi),pl=(a,from)=>a.map((t,i)=>i<from?"":`${i===from?"M":"L"}${X(i).toFixed(1)} ${Y(t).toFixed(1)}`).join(" ");
 g+=`<path d="${pl(R.ph,Math.max(0,i0))}" fill="none" stroke="#d23a26" stroke-width="3"/><path d="${pl(R.pc,0)}" fill="none" stroke="#2f6fd6" stroke-width="3"/>`;
 g+=`<text x="${L+8}" y="${T0+30}" class="hxG" style="text-anchor:start;fill:#d23a26">gas near the burner is far hotter than this chart goes</text>`;
 /* where the gas crosses its dew point */
 const ic=R.ph.findIndex((t,i)=>i>=R.n1&&t<R.dew);if(R.cond&&ic>0)g+=`<circle cx="${X(ic)}" cy="${Y(R.dew)}" r="5" fill="#7a5cd0"/><text x="${X(ic)+10}" y="${Y(R.dew)-8}" class="hxG" style="text-anchor:start;fill:#7a5cd0">condensing from here on</text>`;
 const n=R.N;g+=`<text x="${X(R.n1)-10}" y="${Y(R.ph[R.n1])+4}" class="hxG" style="text-anchor:end;fill:#d23a26">${Math.round(R.T1)}°F leaving the primary</text>`;
 if(R.cond)g+=`<text x="${Rr-4}" y="${Y(R.T2)-24}" class="hxG" style="text-anchor:end;fill:#d23a26">${Math.round(R.T2)}°F to the vent</text>`;
 g+=`<text x="${L+6}" y="${Y(R.Ts)+16}" class="hxG" style="text-anchor:start;fill:#2f6fd6">${Math.round(R.Ts)}°F supply air</text><text x="${Rr-4}" y="${Y(R.Tr)+16}" class="hxG" style="text-anchor:end;fill:#2f6fd6">${Math.round(R.Tr)}°F return air</text>`;
 g+=`<path d="M${X(40)+7} ${Y(R.pc[40])-6} L${X(40)-5} ${Y(R.pc[40])} L${X(40)+7} ${Y(R.pc[40])+6}" fill="none" stroke="#2f6fd6" stroke-width="2.5"/>`;
 return g+`<text x="${(L+Rr)/2}" y="${H-4}" class="hxG" style="text-anchor:middle">gas path: burner on the left, vent on the right. Air goes the other way.</text><text x="${L}" y="12" class="hxG" style="text-anchor:start">°F</text>`}
function drawFor(id,R){switch(id){case "cfurn":case "sfurn":return drawFurn(R);case "cf":return drawBasic(R,false);case "pf":return drawBasic(R,true);case "gasket":case "brazed":case "dwplate":return drawGasket(R,id);
 case "straight":case "utube":case "steam":case "dwtube":return drawShell(R,id);case "coax":return drawCoax(R);case "fin":return drawFin(R);case "tank":return drawTank(R);default:return drawHR(R,id)}}
/* ---------- temperature graph ---------- */
function graph(R,s){const W=760,H=250,L=56,Rr=W-20,T0=20,B=H-36;
 if(R.furn)return furnGraph(R,W,H,L,Rr,T0,B);
 if(R.hr){const v=vals(ST.sub.recov);const bars=[["Outdoor air",v.cT],["Supply air",R.sa],["Return air",v.hT],["Exhaust air",R.ea]];const lo=Math.min(...bars.map(b=>b[1]),0)-5,hi=Math.max(...bars.map(b=>b[1]))+10;const y=t=>B-(t-lo)/(hi-lo)*(B-T0);
  let g=`<path d="M${L} ${T0} V${B} H${Rr}" stroke="var(--muted)" fill="none"/>`;for(let t=Math.ceil(lo/10)*10;t<=hi;t+=10)g+=`<path d="M${L} ${y(t)} H${Rr}" stroke="var(--line)" stroke-width=".6" opacity=".6"/><text x="${L-6}" y="${y(t)+4}" class="hxG" style="text-anchor:end">${t}</text>`;
  bars.forEach((b,i)=>{const x=L+40+i*170;g+=`<rect x="${x}" y="${Math.min(y(b[1]),y(0))}" width="90" height="${Math.abs(y(b[1])-y(0))}" fill="${tcol(b[1])}" opacity=".8"/><text x="${x+45}" y="${y(b[1])-6}" class="hxT" style="text-anchor:middle;fill:${tcol(b[1])}">${Math.round(b[1])}°F</text><text x="${x+45}" y="${B+18}" class="hxG" style="text-anchor:middle">${b[0]}</text>`});
  return g+`<text x="${L}" y="12" class="hxG" style="text-anchor:start">°F</text>`}
 const all=R.ph.concat(R.pc),lo=Math.floor(Math.min(...all)/10)*10-5,hi=Math.ceil(Math.max(...all)/10)*10+5;const X=i=>L+(Rr-L)*i/(R.ph.length-1),Y=t=>B-(t-lo)/(hi-lo)*(B-T0);
 let g=`<path d="M${L} ${T0} V${B} H${Rr}" stroke="var(--muted)" fill="none"/>`;
 const step=(hi-lo)>120?20:10;for(let t=Math.ceil(lo/step)*step;t<=hi;t+=step)g+=`<path d="M${L} ${Y(t)} H${Rr}" stroke="var(--line)" stroke-width=".6" opacity=".6"/><text x="${L-6}" y="${Y(t)+4}" class="hxG" style="text-anchor:end">${t}</text>`;
 const pl=a=>a.map((t,i)=>`${i?"L":"M"}${X(i).toFixed(1)} ${Y(t).toFixed(1)}`).join(" ");
 g+=`<path d="${pl(R.ph)}" fill="none" stroke="#d23a26" stroke-width="3"/><path d="${pl(R.pc)}" fill="none" stroke="#2f6fd6" stroke-width="3"/>`;
 const arrowAt=(a,i,dir,col)=>{const x=X(i),y=Y(a[i]);return `<path d="M${x-7*dir} ${y-6} L${x+5*dir} ${y} L${x-7*dir} ${y+6}" fill="none" stroke="${col}" stroke-width="2.5"/>`};
 g+=arrowAt(R.ph,30,1,"#d23a26")+arrowAt(R.ph,90,1,"#d23a26")+arrowAt(R.pc,30,R.arr==="pf"?1:-1,"#2f6fd6")+arrowAt(R.pc,90,R.arr==="pf"?1:-1,"#2f6fd6");
 const n=R.ph.length-1;g+=`<text x="${X(0)+18}" y="${Y(R.ph[0])-4}" class="hxG" style="text-anchor:start;fill:#d23a26">${Math.round(R.ph[0])}°F hot in</text><text x="${X(n)-4}" y="${Y(R.ph[n])-8}" class="hxG" style="text-anchor:end;fill:#d23a26">${Math.round(R.ph[n])}°F hot out</text>`;
 g+=R.arr==="pf"?`<text x="${X(0)+4}" y="${Y(R.pc[0])+16}" class="hxG" style="text-anchor:start;fill:#2f6fd6">${Math.round(R.pc[0])}°F cold in</text><text x="${X(n)-4}" y="${Y(R.pc[n])+16}" class="hxG" style="text-anchor:end;fill:#2f6fd6">${Math.round(R.pc[n])}°F cold out</text>`:`<text x="${X(0)+4}" y="${Y(R.pc[0])+16}" class="hxG" style="text-anchor:start;fill:#2f6fd6">${Math.round(R.pc[0])}°F cold out</text><text x="${X(n)-4}" y="${Y(R.pc[n])+16}" class="hxG" style="text-anchor:end;fill:#2f6fd6">${Math.round(R.pc[n])}°F cold in</text>`;
 // approach marker at the closest point
 let mi=0,md=1e9;R.ph.forEach((h,i)=>{const d=h-R.pc[i];if(d<md){md=d;mi=i}});const ax=X(mi);
 g+=`<path d="M${ax} ${Y(R.ph[mi])} V${Y(R.pc[mi])}" stroke="var(--brass)" stroke-width="2" stroke-dasharray="4 3"/><text x="${ax+(mi>n/2?-6:6)}" y="${Math.abs(Y(R.pc[mi])-Y(R.ph[mi]))<30?Math.min(Y(R.ph[mi]),Y(R.pc[mi]))-24:(Y(R.ph[mi])+Y(R.pc[mi]))/2+4}" class="hxG" style="text-anchor:${mi>n/2?"end":"start"};fill:var(--brass)">closest ${md.toFixed(1)}°F</text>`;
 g+=`<text x="${(L+Rr)/2}" y="${H-4}" class="hxG" style="text-anchor:middle">position along the exchanger (hot inlet on the left)</text><text x="${L}" y="12" class="hxG" style="text-anchor:start">°F</text>`;
 if(R.cross)g+=`<text x="${Rr}" y="12" class="hxG" style="text-anchor:end;fill:var(--ok)">Temperature cross: cold out (${Math.round(R.Tco)}°F) is above hot out (${Math.round(R.Tho)}°F). Only counterflow can do that.</text>`;
 return g}
/* ---------- panels ---------- */
function controlsHTML(id){const s=SUBS[id],v=vals(id);const rows=[];
 if(s.arr==="furn"){rows.push(["hF","Gas input",s.hot.fr,5,v.hF," MBH"],["hT","Excess air",s.hot.r,5,v.hT,"% excess air"],["cT","Return air",s.cold.r,1,v.cT,"°F"],["cF","Airflow",s.cold.fr,50,v.cF," cfm"],["size","Exchanger size (surface area)",[60,160],5,v.size,"%"]);
  return rows.map(([k,n,r,st,val,u])=>`<div class="row"><label for="hx_${k}">${esc(n)}</label><output id="o_${k}">${(+val).toFixed(0)}${esc(u)}</output><input type="range" id="hx_${k}" data-hx="${k}" min="${r[0]}" max="${r[1]}" step="${st}" value="${val}"></div>`).join("")}
 const fu=side=>side.kind==="air"?"cfm":"gpm";
 if(s.hot.kind==="steam")rows.push(["hT","Steam pressure (psig)",s.hot.r,0.5,v.hT,` psig (${Math.round(satF(v.hT))}°F)`]);
 else if(s.hot.kind==="ref")rows.push(["hT","Condensing temperature",s.hot.r,1,v.hT,"°F"]);
 else rows.push(["hT",s.hot.n+" in",s.hot.r,1,v.hT,"°F"]);
 if(s.hot.fr)rows.push(["hF",s.hot.n+" flow",s.hot.fr,s.hot.kind==="air"?50:s.hot.fr[1]>100?5:0.5,v.hF," "+fu(s.hot)]);
 rows.push(["cT",s.cold.n+" in",s.cold.r,1,v.cT,"°F"]);
 rows.push(["cF",s.cold.n+" flow",s.cold.fr,s.cold.kind==="air"?50:s.cold.fr[1]>100?5:0.5,v.cF," "+fu(s.cold)]);
 if(s.arr!=="hr")rows.push(["size","Size (surface area)",[40,200],5,v.size,"%"]);
 return rows.map(([k,n,r,st,val,u])=>`<div class="row"><label for="hx_${k}">${esc(n)}</label><output id="o_${k}">${(+val).toFixed(st<1?1:0)}${esc(u)}</output><input type="range" id="hx_${k}" data-hx="${k}" min="${r[0]}" max="${r[1]}" step="${st}" value="${val}"></div>`).join("")}
function resultsHTML(id,R){const s=SUBS[id];
 if(R.furn){const hi=R.rise>65,lo=R.rise<35;
  return `<div class="hxNums"><div><b>${Math.round(R.eff*100)}%</b><span>efficiency right now</span></div><div><b>${(R.Q/1000).toFixed(0)} MBH</b><span>heat into the air</span></div><div><b>${Math.round(R.rise)}°F</b><span>temperature rise</span></div><div><b>${Math.round(R.Ts)}°F</b><span>supply air</span></div><div><b>${Math.round(R.T1)}°F</b><span>gas leaving the primary</span></div>${R.cond?`<div><b>${Math.round(R.T2)}°F</b><span>vent gas</span></div><div><b>${R.gph.toFixed(2)} gal/h</b><span>condensate</span></div>`:""}<div><b>${Math.round(R.dew)}°F</b><span>flue gas dew point</span></div></div>`+
  `<p class="note">Heat into the air = 1.08 × cfm × rise: 1.08 × ${Math.round(R.cfm)} × ${R.rise.toFixed(1)} = ${(R.Q/1000).toFixed(0)} MBH from ${R.inMBH.toFixed(0)} MBH of gas.${R.cond?` The primary gives ${(R.Q1/1000).toFixed(0)} MBH and the secondary ${(R.Q2/1000).toFixed(1)} MBH.`:""}</p>`+
  (R.lock?`<p class="note bad">Water is backing up into the secondary and collector box. On a real furnace the pressure switch opens and the burners shut off. Clear the trap and drain; thaw and protect a frozen line.</p>`:"")+
  (R.crack?`<p class="note bad">A crack barely changes these numbers, which is why it gets missed. Watch the flames when the blower starts: if they waver, lift or roll out, blower air is getting into the exchanger. Shut it down. This is a carbon monoxide hazard.</p>`:"")+
  (hi?`<p class="note bad">Temperature rise is over this trainer furnace's 35 to 65°F rating plate range. The exchanger is running hot: expect the high limit to trip. Find the airflow problem.</p>`:lo?`<p class="note bad">Temperature rise is under the 35 to 65°F rating plate range for this trainer furnace: too much airflow for the input, or it is underfired.</p>`:"")+
  (R.cond&&R.T2>140?`<p class="note bad">Vent gas is over 140°F, the limit for Schedule 40 PVC vent pipe.</p>`:"")+
  (R.cond&&R.T2>=R.dew?`<p class="note bad">The gas never gets below its dew point: nothing is condensing and the latent heat is going out the vent.</p>`:"")+
  (!R.cond&&R.T1<300?`<p class="note bad">Flue gas under 300°F is cool for a non-condensing furnace: it can condense in the metal vent or chimney.</p>`:"")}
 if(R.hr){return `<div class="hxNums"><div><b>${Math.round(R.e*100)}%</b><span>sensible effectiveness</span></div><div><b>${Math.round(R.sa)}°F</b><span>supply air</span></div><div><b>${Math.round(R.ea)}°F</b><span>exhaust leaving</span></div><div><b>${(Math.abs(R.Q)/1000).toFixed(0)} MBH</b><span>${R.Q>=0?"recovered heat":"recovered cooling"}</span></div></div>`+(s.lat?`<p class="note">This type also moves moisture: latent effectiveness about ${Math.round(s.lat*100)}%.</p>`:`<p class="note">Sensible only: it doesn't move moisture.</p>`)+(R.frost?`<p class="note bad">Frost risk: the exhaust is cooled below freezing.</p>`:"")}
 return `<div class="hxNums"><div><b>${(R.Q/1000).toFixed(0)} MBH</b><span>heat moved (${(R.Q/12000).toFixed(1)} tons)</span></div><div><b>${Math.round(R.Tho)}°F</b><span>${s.arr==="cond"?"hot side (condensing)":"hot out"}</span></div><div><b>${Math.round(R.Tco)}°F</b><span>cold out</span></div><div><b>${R.appr.toFixed(1)}°F</b><span>closest approach</span></div><div><b>${R.lmtd.toFixed(1)}°F</b><span>LMTD</span></div><div><b>${Math.round(R.e*100)}%</b><span>effectiveness</span></div></div>`+
  `<p class="note">Q = ${s.cold.kind==="air"?"1.08 × cfm":"500 × gpm"} × ΔT on the cold side: ${s.cold.kind==="air"?"1.08":"500"} × ${R.coldFlow} × ${(R.Tco-R.Tc).toFixed(1)} = ${(R.Q/1000).toFixed(0)} MBH.</p>`}
function infoHTML(id){const s=SUBS[id];return `<h3>${esc(s.n)}</h3><p><b>How it works.</b> ${esc(s.how)}</p><p><b>In HVAC.</b> ${esc(s.use)}</p><p><b>Approach.</b> ${esc(s.appr)}</p><p><b>Service and faults.</b> ${esc(s.svc)}</p>`}
function faultsHTML(id){const s=SUBS[id],F=ST.F[id]||{};return s.faults.map(f=>`<label><input type="checkbox" data-hxf="${f}"${F[f]?" checked":""}> ${esc(FAULTS[f])}</label>`).join("")}
function render(full){const t=ST.tab,id=ST.sub[t],s=SUBS[id];const R=calc(id);
 document.querySelectorAll("[data-sim]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sim===t));
 if(full){$("subs").innerHTML=TABS[t].subs.length>1?TABS[t].subs.map(k=>`<button data-sub="${k}" aria-pressed="${k===id}">${esc(SUBS[k].n)}</button>`).join(""):"";$("subs").hidden=TABS[t].subs.length<2;
  $("ctl").innerHTML=controlsHTML(id);$("faults").innerHTML=faultsHTML(id);$("info").innerHTML=infoHTML(id)}
 $("hxSvg").innerHTML=drawFor(id,R);$("graph").innerHTML=graph(R);$("gTitle").textContent=R.hr?"Air temperatures":R.furn?"Gas and air temperatures through the furnace":"Temperatures along the exchanger";
 $("res").innerHTML=resultsHTML(id,R);
 const v=vals(id);document.querySelectorAll("[data-hx]").forEach(i=>{const k=i.dataset.hx,o=$("o_"+k);if(!o)return;const st=+i.step;o.textContent=(+v[k]).toFixed(st<1?1:0)+(s.arr==="furn"?(k==="hT"?"% excess air":k==="hF"?" MBH":k==="cT"?"°F":k==="size"?"%":" cfm"):k==="hT"&&s.hot.kind==="steam"?` psig (${Math.round(satF(v.hT))}°F)`:k[1]==="T"?"°F":k==="size"?"%":" "+((k==="hF"?s.hot:s.cold).kind==="air"?"cfm":"gpm"))})}
document.addEventListener("click",ev=>{const b=ev.target.closest("[data-sim]");if(b){ST.tab=b.dataset.sim;save();render(true);return}
 const sb=ev.target.closest("[data-sub]");if(sb){ST.sub[ST.tab]=sb.dataset.sub;save();render(true);return}
 if(ev.target.id==="reset"){const id=ST.sub[ST.tab];delete ST.v[id];delete ST.F[id];render(true)}
 if(ev.target.id==="theme"){const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("hx-theme",r.dataset.theme)}catch(e){}}});
document.addEventListener("input",ev=>{const t=ev.target;if(t.dataset.hx){vals(ST.sub[ST.tab])[t.dataset.hx]=+t.value;render(false)}});
document.addEventListener("change",ev=>{const t=ev.target;if(t.dataset.hxf){const id=ST.sub[ST.tab];(ST.F[id]=ST.F[id]||{})[t.dataset.hxf]=t.checked;render(false)}});
try{const t=localStorage.getItem("hx-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
render(true);
window.__hx={ST,calc,render,SUBS,TABS,satF};
/* ---------- disclaimer + feedback (FB-Enable) ---------- */
const FEEDBACK={form:"https://docs.google.com/forms/d/e/1FAIpQLScaqpadGdwDY_CanACDH3X_ZAQ44LzrCwDYcaxIuaxYk6A5UA/viewform",entry:"entry.249128714"};
const DISC_VER="1";let CM=null,cmState="off";
(async()=>{try{if(window.claude&&window.claude.use){CM=await window.claude.use("comments");if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}}}catch(e){CM=null}})();
async function refreshFb(){if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}const to=CM&&cmState==="available";$("fbTo").textContent=to?"Sends straight to Claude as a comment on this page.":"No sign-in needed.";$("fbSend").textContent=to?"Send to Claude":"Send"}
async function sendFb(){const msg=$("fbMsg").value.trim();if(!msg){$("fbStatus").textContent="Please write something first.";return}
 const text=`[${$("fbType").value}] ${msg}\n\nFrom: ${$("fbName").value.trim()||"anonymous"}\nContext: Heat exchangers, ${TABS[ST.tab].n} / ${SUBS[ST.sub[ST.tab]].n}, ${navigator.userAgent}`;
 $("fbSend").disabled=true;$("fbStatus").textContent="Sending...";
 try{if(CM&&cmState==="available"){try{const anchor=await CM.anchorFor($("drawWrap"));await CM.sendToClaude({anchor,text:text.slice(0,3900)});$("fbStatus").textContent="Sent to Claude.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1500);return}
   catch(e){if(e&&e.code==="consent_required"){$("fbStatus").textContent="Not sent: allow comments for this page when asked, then press Send again.";return}
    if(e&&!["claude_unavailable","capability_removed","forbidden"].includes(e.code)){$("fbStatus").textContent=`Couldn't send to Claude (${e.code||"error"}). Press Send again to use the form.`;cmState="off";return}cmState="off"}}
  const body=new URLSearchParams();body.append(FEEDBACK.entry,"[Heat exchangers] "+text);await fetch(FEEDBACK.form.replace(/\/viewform.*$/,"/formResponse"),{method:"POST",mode:"no-cors",body});
  $("fbStatus").textContent="Thanks, it was sent.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1200)}
 catch(e){$("fbStatus").innerHTML=`Couldn't send from here. <a href="${FEEDBACK.form}" target="_blank" rel="noopener">Open the feedback form</a>.`}finally{$("fbSend").disabled=false}}
document.addEventListener("click",e=>{const id=e.target.id;
 if(id==="discOk"){$("disc").hidden=true;try{localStorage.setItem("hx-disc",DISC_VER)}catch(_){}}
 else if(id==="about")$("disc").hidden=false;
 else if(id==="feedback"){$("fbStatus").textContent="";refreshFb();$("fb").hidden=false;$("fbMsg").focus()}
 else if(id==="fbCancel")$("fb").hidden=true;else if(id==="fbSend")sendFb()});
{let seen=null;try{seen=localStorage.getItem("hx-disc")}catch(_){}if(seen!==DISC_VER)$("disc").hidden=false}
})();
