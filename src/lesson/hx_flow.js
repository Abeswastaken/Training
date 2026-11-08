/* ============ Lesson: Counterflow vs parallel flow ============ */
(()=>{
const W=(arr,UA,gh=10,gc=10,Th=180,Tc=60)=>HXK.water({arr,Th,Tc,gh,gc,UA});
/* heat crossing the wall: short wavy arrows from the hot channel to the cold one */
const heat=(x0,x1,y,n,col)=>{let s="";const mid=(x0+x1)/2;for(let i=0;i<n;i++){const x=x0+(x1-x0)*(i+.5)/n;if(Math.abs(x-mid)<50)continue;s+=K.arrow(`M${x} ${y-22} V${y+20}`,col,3)}return s};
/* multi-row coil, side view. back=true pipes the water in on the entering-air side */
const coil=(back)=>{const R=HXK.solve({arr:back?"pf":"cf",Th:180,Tc:55,Ch:500*8,Cc:1.08*2000,UA:2600});const x0=270,rows=4,dx=56;const g=K.uid("cs");
 let s=`<defs>${HXK.metal(g)}</defs><rect x="${x0-24}" y="70" width="${rows*dx+40}" height="230" rx="4" fill="url(#${g})" stroke="${HXK.SE}"/>`;
 for(let i=0;i<30;i++)s+=`<path d="M${x0-16} ${80+i*7.2} H${x0+rows*dx}" stroke="#a3abb0" stroke-width="1"/>`;
 for(let r=0;r<rows;r++){const f=back?r/(rows-1):1-r/(rows-1);const T=R.Tho+(R.Th-R.Tho)*f;for(let k=0;k<5;k++)s+=`<circle cx="${x0+12+r*dx}" cy="${100+k*44}" r="12" fill="#b87333" stroke="#6e3f1a"/><circle cx="${x0+12+r*dx}" cy="${100+k*44}" r="7.5" fill="${HXK.tc(T)}"/>`}
 [110,160,210,260].forEach(y=>{s+=HXK.pipe(`M40 ${y} H${x0-30}`,HXK.ta(R.Tc),5)+HXK.pipe(`M${x0+rows*dx+22} ${y} H690`,HXK.ta(R.Tco),5)});
 s+=K.lbl(40,96,"AIR IN",{a:"start",size:13})+HXK.t(40,290,R.Tc,{a:"start",air:true})+K.lbl(690,96,"AIR OUT",{a:"end",size:13})+HXK.t(690,290,R.Tco,{a:"end",air:true});
 const inX=back?x0+12:x0+12+(rows-1)*dx,outX=back?x0+12+(rows-1)*dx:x0+12;
 s+=HXK.pipe(`M${inX} 24 V70`,HXK.tc(R.Th),7)+HXK.pipe(`M${outX} 70 V24`,HXK.tc(R.Tho),7);
 s+=K.lbl(inX+(back?-14:14),30,"WATER IN "+Math.round(R.Th)+"°F",{a:back?"end":"start",size:13})+K.lbl(outX+(back?14:-14),30,"WATER OUT "+Math.round(R.Tho)+"°F",{a:back?"start":"end",size:13});
 return {s,R}};
const steps=[
 {t:"Two fluids, one wall",
  body:`<p>A <b>heat exchanger</b> moves heat from one fluid to another without letting them mix. A metal wall sits between them. Heat flows through the wall from the hotter fluid to the colder one.</p><p>The bigger the temperature difference across the wall, the faster the heat moves. That difference is what pushes the heat, so engineers call it the <b>driving force</b>.</p><p>How you run the two streams past each other decides how big that difference stays along the whole length.</p>`,
  draw:()=>{const R=W("cf",6000);return HXK.basic(R,{y:70,title:"HOT WATER ON TOP, COLD WATER BELOW"})+heat(170,550,145,10,"#ffd23a")+`<path d="M562 145 V250" stroke="var(--ink)" stroke-width="1.5"/>`+K.lbl(562,268,"WALL",{size:13})+K.lbl(360,300,"HEAT FLOWS THROUGH THE WALL, HOT TO COLD",{size:14})+K.txt(360,326,"the fluids never touch: plates, tubes or a coil keep them apart")}},
 {t:"Parallel flow",
  body:`<p>In <b>parallel flow</b> both fluids enter at the same end and travel the same way.</p><p>At the inlet the difference is huge (here 180 − 60 = 120°F), so heat moves fast. Then the two temperatures run toward each other. By the far end the difference is small and that part of the exchanger does little work.</p><p>The cold fluid can never leave hotter than the hot fluid leaves. At best the two outlets meet in the middle.</p>`,vb:"0 0 720 420",
  draw:()=>{const R=W("pf",6000);return HXK.basic(R,{y:40})+HXK.prof(R,{x:90,y:232,w:560,h:140,lo:40,hi:200,step:40,mark:"",xl:"along the exchanger"})}},
 {t:"Counterflow",
  body:`<p>In <b>counterflow</b> the fluids run in opposite directions. The hottest hot water meets the cold water just before it leaves, and the coldest cold water meets the hot water just before it leaves.</p><p>The temperature difference stays fairly even along the whole length, so every part of the surface keeps working.</p><p>Same size, same flows: counterflow moves more heat and gets the cold water hotter.</p>`,vb:"0 0 720 420",
  draw:()=>{const R=W("cf",6000);return HXK.basic(R,{y:40})+HXK.prof(R,{x:90,y:232,w:560,h:140,lo:40,hi:200,step:40,mark:"",xl:"along the exchanger"})}},
 {t:"Side by side",
  body:`<p>Here both are drawn on one graph: same exchanger, same 10 gpm on each side, same inlet temperatures. Solid lines are counterflow, dashed lines are parallel flow.</p><p>Parallel flow's lines bend toward each other and flatten out. Counterflow's lines stay apart, so it keeps moving heat all the way along.</p><p>The gain gets bigger as the exchanger gets bigger. A tiny exchanger works about the same either way.</p>`,
  math:`<p>Both use effectiveness-NTU. With equal flows (C<sub>r</sub> = 1):</p><p>Counterflow: ε = NTU / (1 + NTU)</p><p>Parallel: ε = (1 − e<sup>−2·NTU</sup>) / 2, which can never pass 50%.</p><p>Here NTU = UA / C = 6,000 / 5,000 = 1.2, so ε = 55% vs 45%.</p>`,
  draw:()=>{const a=W("cf",6000),b=W("pf",6000);return HXK.prof(a,{x:80,y:46,w:440,h:270,lo:40,hi:200,step:20,ghost:b,mark:"",title:"SOLID: COUNTERFLOW   DASHED: PARALLEL"})+
   `<rect x="548" y="70" width="160" height="230" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(628,100,"HEAT MOVED",{size:14})+K.lbl(628,136,"COUNTERFLOW",{size:12,fill:HXK.COLD})+K.lcd(628,160,K.f0(a.Q/1000)+" MBH",120)+K.lbl(628,212,"PARALLEL",{size:12,fill:"var(--muted)"})+K.lcd(628,236,K.f0(b.Q/1000)+" MBH",120)+K.txt(628,284,"+"+K.f0((a.Q/b.Q-1)*100)+"% counterflow")}},
 {t:"Pipe it right",
  body:`<p>Almost every water-to-water exchanger in HVAC is meant to run counterflow: plate exchangers, converters, DHW heaters. Their nameplates or port labels show which connection is which. Hook them up backward and you get parallel flow.</p><p>Coils work the same way. In a multi-row coil the water should <b>enter on the leaving-air side</b> and leave on the entering-air side. Air and water then cross in opposite directions.</p><p>Piped backward, the coil can't reach its design leaving air temperature, and nobody can see why from the outside.</p>`,
  draw:()=>{const c=coil(false);return c.s+K.lbl(360,330,"WATER ENTERS ON THE LEAVING-AIR SIDE: COUNTERFLOW",{size:14})+K.txt(360,356,"rows shaded by water temperature: hottest row meets the warmest air")}}];
/* ---------- See it ---------- */
const mdl=S=>{const arr=S.arr?"cf":"pf",o=S.arr?"pf":"cf";const R=W(arr,S.ua*1000,S.gh,S.gc),G=W(o,S.ua*1000,S.gh,S.gc);const cf=S.arr?R:G,pf=S.arr?G:R;return {...R,G,cf,pf,gain:(cf.Q/pf.Q-1)*100}};
const see=K.see({vb:"0 0 720 430",init:{arr:1,ua:6,gh:10,gc:10},
 sliders:[["arr","Piped as",0,1,1,v=>v?"Counterflow":"Parallel flow"],["ua","Size (UA)",1,30,1,v=>v+",000 BTU/h·°F"],["gh","Hot water flow (180°F in)",2,30,1,v=>v+" gpm"],["gc","Cold water flow (60°F in)",2,30,1,v=>v+" gpm"]],
 model:mdl,
 draw:R=>HXK.basic(R,{y:34})+HXK.prof(R,{x:90,y:228,w:560,h:160,lo:40,hi:200,step:40,ghost:R.G,mark:"appr",xl:"along the exchanger (dashed: the other way)"}),
 reads:R=>[["Heat moved",K.f0(R.Q/1000)+" MBH"],["Effectiveness",K.f0(R.e*100)+"%"],["Hot out",K.f1(R.Tho)+"°F"],["Cold out",K.f1(R.Tco)+"°F"],["Counterflow would move",K.f0(R.cf.Q/1000)+" MBH"],["Parallel would move",K.f0(R.pf.Q/1000)+" MBH"],["Counterflow gain",K.f0(R.gain)+"%"],["NTU",K.f2(R.NTU)]],
 note:R=>R.arr==="pf"&&R.Tco>R.Tho-1?"Parallel flow: the two outlets have nearly met. More surface would add almost nothing.":R.cross?`Cold out (${K.f0(R.Tco)}°F) is hotter than hot out (${K.f0(R.Tho)}°F). Only counterflow can do that.`:R.gain<5?"Small exchanger: the arrangement hardly matters yet.":"",
 log:[["Piped",(R)=>R.arr==="cf"?"Counter":"Parallel"],["UA",(R,S)=>S.ua+"k"],["Cold out",R=>K.f1(R.Tco)+"°F"],["MBH",R=>K.f0(R.Q/1000)]]});
const C=[["backward","Piped backward (parallel flow)"],["scale","Scale on the plates"],["air","Air trapped in it"],["lowflow","Low flow on the hot side"]];
const caseR=S=>W("pf",16000,10,10);
const tasks=[
 K.goal({t:"Get the cold water to 130°F",intro:"In See it, with <b>10 gpm on both sides</b>, get the cold water leaving at <b>130°F or hotter</b>. Then try it in parallel flow.",
  check:(S,R)=>S.gh!==10||S.gc!==10?"Keep both flows at 10 gpm.":!S.arr?`Parallel flow tops out at 120°F with equal flows: the outlets meet in the middle. You're at ${K.f1(R.Tco)}°F.`:R.Tco<130?`Cold out is ${K.f1(R.Tco)}°F. Counterflow needs more surface.`:true,
  ok:(S,R)=>`${K.f1(R.Tco)}°F with ${S.ua},000 UA. Parallel flow with the same exchanger: ${K.f1(R.pf.Tco)}°F, and it can never pass 120°F with equal flows.`}),
 K.goal({t:"When it barely matters",intro:"Keep 10 gpm on both sides. Shrink the exchanger until counterflow gains <b>less than 5%</b> over parallel flow.",
  check:(S,R)=>S.gh!==10||S.gc!==10?"Keep both flows at 10 gpm.":R.gain>=5?`Counterflow still gains ${K.f0(R.gain)}%. Make it smaller.`:true,
  ok:(S,R)=>`At ${S.ua},000 UA the gain is only ${K.f1(R.gain)}%: the temperatures barely change, so the difference stays big either way. The bigger the exchanger, the more counterflow matters.`}),
 K.caseTask({t:"Service call: new plate exchanger won't make temperature",intro:"A new brazed plate exchanger heats a radiant loop from boiler water. Both pumps run at design flow (10 gpm), the plates are new, and the loop never gets hot enough. The exchanger is rated for about 150°F on the loop side at these conditions.",
  state:{},model:caseR,draw:R=>HXK.basic(R,{y:70,title:"AS FOUND: BOTH PIPES ON THE LEFT ARE INLETS"}),
  reads:R=>[["Boiler water in",K.f0(R.Th)+"°F"],["Boiler water out",K.f0(R.Tho)+"°F"],["Loop water in",K.f0(R.Tc)+"°F"],["Loop water out",K.f0(R.Tco)+"°F",true]],
  actions:[["Check the ports against the nameplate",R=>"Nameplate: boiler water in at the top left, loop water in at the bottom <b>right</b>. As piped, the loop water enters at the bottom <b>left</b>."],["Check flow and venting",R=>"Both sides at 10 gpm by the pump curves and pressure drop. No air at the high-point vents."]],
  causes:C,ans:"backward",why:"The loop side is connected to the wrong ports, so both fluids run the same way. The outlets have met near 120°F, the limit for parallel flow with equal flows. Repipe the loop side to the nameplate ports and it runs counterflow, near 150°F.",hint:"New plates, design flow, no air. Look at where the two fluids enter and where the outlets ended up."})];
window.LESSON={id:"hx-flow",sec:"Heat exchangers",secHref:"/hx/",title:"Counterflow vs parallel flow",lead:"Why running the two fluids in opposite directions moves more heat, and how to spot an exchanger piped the wrong way.",
 steps,see,tryIntro:"Two in See it, then a service call.",tasks,
 job:K.job({read:["All four temperatures: hot in, hot out, cold in, cold out. Strap-on probes on bare pipe, or wells if fitted.","The port labels or arrows on the nameplate, and the piping drawing.","Flow on both sides: pressure drop across the exchanger against the manufacturer's curve, or a balancing valve."],
  table:[["What you see","What it usually means"],["Cold out hotter than hot out","Counterflow working well (a temperature cross)."],["Both outlets almost the same temperature","Could be parallel flow: check the ports."],["Coil can't reach design leaving air temp, water ΔT small","Water piped to enter on the entering-air side."],["Big ΔT on one side, tiny on the other","Flows are very unequal; check the low-flow side."]],tableT:"Reading the four temperatures",
  steps:["Find the hot inlet: the hottest of the four.","Find the cold outlet. In counterflow it sits at the same end as the hot inlet.","If the cold outlet is at the far end, next to the hot outlet, it's piped parallel.","On a coil, the water supply should connect to the row on the leaving-air side."],stepsT:"Is it piped counterflow?",
  safety:["Hot water pipes at 180°F burn in seconds. Use a probe, not your hand, and wear gloves.","Isolate, drain and relieve pressure before repiping. Lock out the pumps."],
  mistakes:["Assuming the supply goes on top: check the nameplate ports instead.","Swapping the coil supply and return to 'fix' a leaking valve body.","Blaming the boiler or the pump when the exchanger is piped parallel."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["The Engineering Mindset: how plate heat exchangers work","https://theengineeringmindset.com/how-plate-heat-exchangers-work/"],["The Engineering ToolBox: arithmetic and logarithmic mean temperature difference","https://engineeringtoolbox.com/arithmetic-logarithmic-mean-temperature-d_436.html"]]};
})();
