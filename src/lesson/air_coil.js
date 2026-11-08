/* ============ Lesson: What the coil does to the air ============ */
(()=>{
const P=AK.PSY,f0=v=>Math.round(v),f1=K.f1,n0=v=>Math.round(v).toLocaleString("en-US");
/* the trainer's coil and compressor balance (src/air.js aCoil): a 3-ton compressor and a coil with a bypass factor that grows with airflow */
const coil=(cfm,Tin,Win,odt)=>{const BF=0.04+0.08*(cfm/1200),film=11,hin=P.h(Tin,Win);
 const comp=Te=>36000*(1+0.021*(Te-45))*(1-0.009*(odt-95));
 const cq=Te=>{const a=Te+film;return 4.5*cfm*(1-BF)*Math.max(0,hin-P.h(a,P.Ws(a)))};
 let lo=-20,hi=75;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(cq(m)>comp(m))lo=m;else hi=m}
 const Te=(lo+hi)/2,adp=Te+film,Wa=P.Ws(adp);
 return {BF,Te,adp,Tout:Tin-(1-BF)*(Tin-adp),Wout:Win>Wa?Win-(1-BF)*(Win-Wa):Win,wet:Win>Wa}};
const mdl=S=>{const wb=Math.min(S.wb,S.tin),Win=P.Wwb(S.tin,wb),c=coil(S.cfm,S.tin,Win,S.odt);
 const hin=P.h(S.tin,Win),hout=P.h(c.Tout,c.Wout),sens=1.08*S.cfm*(S.tin-c.Tout),tot=4.5*S.cfm*(hin-hout),lat=Math.max(0,tot-sens);
 return {...c,cfm:S.cfm,Tin:S.tin,Win,wbIn:wb,hin,hout,split:S.tin-c.Tout,sens,tot,lat,shr:tot>0?sens/tot:1,water:4.5*S.cfm*(Win-c.Wout)/8.34,dgr:(Win-c.Wout)*7000,wbOut:P.wb(c.Tout,c.Wout),rhOut:P.rh(c.Tout,c.Wout),cpt:S.cfm/3}};
const D0={cfm:1200,tin:75,wb:62.5,odt:95};
const R0=mdl(D0);
const C={x:60,y:30,w:580,h:280,T:[40,85],gr:100,gs:10};
/* coil process on the chart: return, supply, the sensible and latent legs, the line to the ADP */
const proc=(R,o={})=>{const Wm=R.Wout;let s=AK.psy({...C,rh:[0.2,0.4,0.6,0.8],wb:o.wb,hs:o.hs,title:o.title,
  segs:(o.legs?[{a:[R.Tin,R.Win],b:[R.Tout,R.Win],c:"#c0392b",w:3},{a:[R.Tout,R.Win],b:[R.Tout,Wm],c:"#2f6fd6",w:3}]:[]).concat(o.adp?[{a:[R.Tout,R.Wout],b:[R.adp,P.Ws(R.adp)],c:"var(--muted)",dash:"3 4",w:2}]:[]).concat([{a:[R.Tin,R.Win],b:[R.Tout,R.Wout],c:"var(--ink)",w:2.4,dash:"6 4"}]),
  pts:[{T:R.Tin,W:R.Win,c:"var(--hot)",lbl:"RETURN "+f0(R.Tin)+"°F",a:"end",dx:-12,dy:-16},{T:R.Tout,W:R.Wout,c:AK.COOL,lbl:"SUPPLY "+f0(R.Tout)+"°F",a:"start",dx:14,dy:30}].concat(o.adp?[{T:R.adp,W:P.Ws(R.adp),c:"var(--muted)",r:5,lbl:"ADP "+f0(R.adp)+"°F",a:"end",dx:-12,dy:-10}]:[])});
 const M=AK.psyMap(C);
 if(o.legs)s+=K.tag((M.X(R.Tin)+M.X(R.Tout))/2,M.Y(R.Win)-12,"SENSIBLE "+f1(R.split)+"°F",{fill:"#c0392b"})+K.tag(M.X(R.Tout)-10,(M.Y(R.Win)+M.Y(Wm))/2+6,"LATENT "+f0(R.dgr)+" GR",{a:"end",fill:"#2f6fd6"});
 return s};
const shrChart=()=>{const pts=[],pc=[];for(let q=600;q<=1600;q+=50){const R=mdl({...D0,cfm:q});pts.push([q/3,R.shr]);pc.push([q/3,R.split])}
 return K.chart({x:90,y:40,w:540,h:270,X:[200,540],Y:[0.6,1.0],xt:[200,250,300,350,400,450,500],yt:[0.6,0.7,0.8,0.9,1.0],yf:v=>v.toFixed(1),xl:"airflow, CFM per ton",yl:"sensible heat ratio",title:"SAME HOUSE AIR, DIFFERENT AIRFLOW (75°F / 62.5°F WB)",
  bands:[{y0:0.6,y1:0.75,c:"#2f6fd6",lbl:"MORE DRYING"}],series:[{pts,c:"#7a5cd0",lbl:"SHR",lblAt:520,dy:-12}],vlines:[{x:350,lbl:"350 humid",c:"#2f6fd6"},{x:400,lbl:"400 design"}],
  dots:[{x:400,y:R0.shr,c:"#7a5cd0",lbl:R0.shr.toFixed(2),dx:10,dy:22}]})};
const steps=[
 {t:"The coil cools and dries",body:`<p>The evaporator coil does two jobs at once:</p><ul><li>It <b>cools</b> the air: the dry bulb drops. That's <b>sensible</b> heat, the kind a thermometer sees.</li><li>It <b>dries</b> the air: the coil surface is below the air's dew point, so water vapor condenses on the fins and drains away. Removing that moisture takes heat too: <b>latent</b> heat.</li></ul><p>Here 1200 CFM of ${D0.tin}°F / ${D0.wb}°F WB house air leaves at ${f1(R0.Tout)}°F and ${f0(R0.rhOut*100)}% RH. The coil drips about ${(R0.water).toFixed(1)} gallons of water an hour.</p>`,
  draw:()=>AK.coil(R0,{title:"3-TON COIL, 1200 CFM, 95°F OUTDOORS"})},
 {t:"Sensible heat: 1.08 × CFM × ΔT",body:`<p>The temperature drop across the coil is the <b>split</b> (return dry bulb minus supply dry bulb). Normal is usually about 18 to 22°F at normal indoor humidity.</p><p class="lsKey">Sensible Btu/h = 1.08 × CFM × ΔT = 1.08 × 1200 × ${f1(R0.split)} = ${n0(R0.sens)}</p><p>1.08 comes from standard air: 0.075 lb per cubic foot × 60 minutes × 0.24 Btu per lb per °F.</p><p>A split alone can't tell you the capacity: the same split at half the airflow is half the sensible heat.</p>`,
  draw:()=>proc(R0,{title:"SENSIBLE: LEFT ON THE CHART"})},
 {t:"Total heat: 4.5 × CFM × Δh",body:`<p>The <b>total</b> heat removed counts the moisture too. Read the enthalpy of the return and the supply air (from their wet bulbs) and multiply the difference:</p><p class="lsKey">Total Btu/h = 4.5 × CFM × Δh = 4.5 × 1200 × (${f1(R0.hin)} − ${f1(R0.hout)}) = ${n0(R0.tot)}</p><p>4.5 is 0.075 lb per cubic foot × 60 minutes. Latent is the rest: ${n0(R0.tot)} − ${n0(R0.sens)} = ${n0(R0.lat)} Btu/h.</p><p>On the chart the process line goes left (sensible) and down (latent).</p>`,
  math:`<p>Latent can also be worked out from moisture: 0.68 × CFM × Δgrains = 0.68 × 1200 × ${f1(R0.dgr)} = ${n0(0.68*1200*R0.dgr)} Btu/h. The small difference comes from the rounded constants.</p><p>Total in tons = Btu/h ÷ 12,000 = ${(R0.tot/12000).toFixed(2)} tons.</p>`,
  draw:()=>proc(R0,{legs:true,hs:[20,25,30],title:"TOTAL = SENSIBLE + LATENT"})},
 {t:"Sensible heat ratio",body:`<p>The <b>sensible heat ratio</b> (SHR) is the share of the coil's work that goes to temperature:</p><p class="lsKey">SHR = sensible ÷ total = ${n0(R0.sens)} ÷ ${n0(R0.tot)} = ${R0.shr.toFixed(2)}</p><p>Most residential coils run about 0.70 to 0.80. Lower is more drying.</p><p>Airflow sets it. Slow the air down and it spends longer on a colder coil: it leaves colder and drier and SHR drops. That's why humid climates use about 350 CFM per ton instead of 400. Too slow and the coil goes below 32°F and ices.</p>`,
  draw:shrChart},
 {t:"Apparatus dew point and bypass factor",body:`<p>Extend the process line past the supply point to the saturation curve. Where it lands is the <b>apparatus dew point</b> (ADP): the effective temperature of the coil surface (${f0(R0.adp)}°F here).</p><p>If every bit of air touched the fins it would leave at the ADP. Some slips between them untouched. The share that acts untouched is the <b>bypass factor</b>:</p><p class="lsKey">BF = (supply − ADP) ÷ (return − ADP) = (${f1(R0.Tout)} − ${f1(R0.adp)}) ÷ (${f1(R0.Tin)} − ${f1(R0.adp)}) = ${R0.BF.toFixed(2)}</p><p>More rows, more fins or slower air lower the bypass factor.</p>`,
  draw:()=>proc(R0,{adp:true,title:"THE PROCESS LINE POINTS AT THE ADP"})},
 {t:"What a frozen coil looks like",body:`<p>When the airflow falls (a loaded filter, a blocked return, a slow blower) the coil has less heat to absorb, so the refrigerant boils colder. On a cool house or a mild night, it can drop below 32°F.</p><p>Frost on the fins blocks more air, which makes the coil colder still, until the whole coil is a block of ice and almost no air moves.</p><p>Here: 600 CFM of 72°F / 59°F WB air on an 85°F day. The coil runs at ${f0(mdl({cfm:600,tin:72,wb:59,odt:85}).Te)}°F. Fix the airflow, then thaw the coil fully (cooling off, fan on) before you check the charge.</p>`,
  draw:()=>{const R=mdl({cfm:600,tin:72,wb:59,odt:85});return AK.coil(R,{ice:0.75,title:"600 CFM ON A 3-TON COIL: BELOW FREEZING"})+K.tag(360,120,"FROST",{fill:"#2f6fd6",w:70})}}];
const see=K.see({init:{...D0},
 sliders:[["cfm","Airflow",600,1600,25,v=>v+" CFM"],["tin","Return dry bulb",68,85,0.5,v=>(+v).toFixed(1)+"°F"],["wb","Return wet bulb",55,72,0.5,v=>(+v).toFixed(1)+"°F"],["odt","Outdoor temperature",75,110,1,v=>v+"°F"]],
 model:mdl,draw:R=>AK.coil(R,{ice:R.Te<32?Math.min(0.8,(32-R.Te)/6):0}),
 reads:R=>[["Split",f1(R.split)+"°F"],["Sensible",n0(R.sens)+" Btu/h"],["Latent",n0(R.lat)+" Btu/h"],["Total",n0(R.tot)+" Btu/h"],["SHR",R.shr.toFixed(2)],["CFM per ton",f0(R.cpt),R.cpt<350||R.cpt>450],["ADP",f1(R.adp)+"°F"],["Bypass factor",R.BF.toFixed(2)],["Coil (refrigerant)",f0(R.Te)+"°F",R.Te<32],["Condensate",R.water.toFixed(1)+" gal/h"]],
 note:R=>(R.Te<32?`<b class="bad">Coil below 32°F: it will frost and ice up.</b> `:"")+(R.wbIn<R.Tin?"":"Wet bulb held at the dry bulb (saturated). ")+"Sensible = 1.08 × CFM × ΔT, total = 4.5 × CFM × Δh.",
 log:[["CFM",(R)=>R.cfm],["Split",R=>f1(R.split)],["SHR",R=>R.shr.toFixed(2)],["Total",R=>n0(R.tot)]]});
const tasks=[
 K.goal({t:"Dry out a humid house",intro:"The house is <b>76°F / 65°F WB</b> on a <b>95°F</b> day and feels sticky. Using airflow only, get the SHR to <b>0.66 or lower</b> while keeping the coil above 32°F.",
  check:(S,R)=>S.tin!==76||S.wb!==65?"Set the return to 76°F dry bulb, 65°F wet bulb.":S.odt!==95?"Set the outdoor temperature to 95°F.":R.Te<32?"The coil is below freezing.":+R.shr.toFixed(2)<=0.66?true:`SHR ${R.shr.toFixed(2)}. Slow the air down.`,
  ok:(S,R)=>`${R.cfm} CFM (${f0(R.cpt)} per ton): SHR ${R.shr.toFixed(2)}, ${n0(R.lat)} Btu/h latent, ${R.water.toFixed(1)} gal/h of water. Total capacity is ${n0(R.tot)} Btu/h: a little less than at 1200 CFM, but more of it goes to drying.`}),
 K.goal({t:"Find where the coil freezes",intro:"Mild night: return <b>72°F / 59°F WB</b>, <b>85°F</b> outdoors. Lower the airflow until the coil drops below <b>32°F</b>.",
  check:(S,R)=>S.tin!==72||S.wb!==59||S.odt!==85?"Set 72°F / 59°F WB return and 85°F outdoors.":R.Te<32?true:`Coil ${f0(R.Te)}°F at ${R.cfm} CFM.`,
  ok:(S,R)=>`Below freezing at ${R.cfm} CFM (${f0(R.cpt)} per ton). The split is ${f1(R.split)}°F: a big split with ice usually means airflow, not a refrigerant problem.`}),
 K.caseTask({t:"Service call: cool but clammy",intro:"New variable-speed system. The house holds 75°F but it's 60% RH and sticky. The return reads 75°F / 65°F WB on a 95°F day.",
  state:{cfm:1600,tin:75,wb:65,odt:95},model:mdl,draw:R=>AK.coil(R),
  reads:R=>[["Airflow",R.cfm+" CFM ("+f0(R.cpt)+"/ton)",true],["Split",f1(R.split)+"°F"],["SHR",R.shr.toFixed(2),true],["Supply RH",f0(R.rhOut*100)+"%"]],
  actions:[["Check the static",()=>"TESP 0.48 in.: fine."],["Check the charge",()=>"Superheat and subcooling on target."]],
  causes:[["air","Airflow set too high for a humid climate"],["charge","Low refrigerant charge"],["small","Coil too small for the load"],["filter","Loaded filter"]],ans:"air",
  why:(()=>{const a=mdl({cfm:1600,tin:75,wb:65,odt:95}),b=mdl({cfm:1050,tin:75,wb:65,odt:95});return `At about 530 CFM per ton the air rushes through a warm coil (ADP ${f0(a.adp)}°F): SHR ${a.shr.toFixed(2)}, so most of the work is cooling, not drying. At 350 CFM per ton (1050 CFM) the SHR drops to ${b.shr.toFixed(2)} and latent removal rises from ${n0(a.lat)} to ${n0(b.lat)} Btu/h. Set the blower down (many ECM boards have a dehumidify setting).`})(),hint:"The charge and static are fine. What's the CFM per ton?"})];
window.LESSON={id:"air-coil",sec:"Airflow",secHref:"/airflow/",title:"What the coil does to the air",lead:"How the evaporator coil removes sensible and latent heat, how to work out each one from temperatures and enthalpy, and how airflow changes the balance.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Return and supply dry bulb and wet bulb</b>, as close to the coil as you can.","<b>Airflow</b> (from static and the blower table, a flow hood total or a traverse).","<b>Outdoor temperature</b> and <b>indoor RH</b>."],
  table:[["Item","Typical value"],["Split at normal indoor humidity","About 18 to 22°F"],["Airflow","400 CFM per ton design; about 350 humid; up to 450 dry"],["Coil SHR","About 0.70 to 0.80"],["Supply air RH off a working coil","About 80 to 95%"],["Sensible","1.08 × CFM × ΔT"],["Total","4.5 × CFM × Δh"],["Latent","Total − sensible, or 0.68 × CFM × Δgrains"]],tableT:"Numbers to know",
  steps:["Let the system run 15 minutes so the coil is fully wet and steady.","Read return and supply dry bulb and wet bulb (supply after the coil, out of sight of it so it doesn't read radiant cold).","Work out the airflow.","Sensible = 1.08 × CFM × split. Total = 4.5 × CFM × (h return − h supply). Latent = total − sensible.","Compare total with the equipment's rated capacity at these conditions (expanded performance data)."],stepsT:"Measuring coil capacity",
  safety:["Shut off cooling before thawing an iced coil and leave the blower on; never chip ice off fins.","Iced coils make a lot of water at once: check the drain pan and safety float switch."],
  mistakes:["Judging capacity from the split alone without the airflow.","Using 1.08 × CFM × ΔT and calling it the total: it misses all the latent work.","Reading the supply wet bulb too close to the coil, in air that hasn't mixed yet.","Adding refrigerant to an iced coil before fixing the airflow."]}),
 sources:[["The Engineering Mindset: Air handling units explained (cooling coils and dehumidifying)","https://theengineeringmindset.com/air-handling-units-explained/"],["HVAC School: Coil SHR, ventilation and bypass factor (4.5 × CFM × Δh, 1.08 × CFM × ΔT, BF)","https://www.hvacrschool.com/coil-shr-ventilation-and-bypass-factor-advanced-psychrometrics-part-2"],["Engineering ToolBox: Cooling and heating equations (sensible and latent air heat)","https://engineeringtoolbox.com/cooling-heating-equations-d_747.html"],["measureQuick: Airflow, CFM per ton","https://support.measurequick.com/portal/en/kb/articles/cfm-per-ton"]]};
})();
