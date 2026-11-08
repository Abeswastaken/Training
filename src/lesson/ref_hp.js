/* ============ Lesson: Heat pump reversing valve and defrost ============ */
(()=>{
const C=REF.COL;
/* ---------- reversing valve: D on top, E S C below. mode "cool" (or defrost) or "heat" ---------- */
const rv=(x,y,mode,s=1,o={})=>{const cool=mode!=="heat",hot=C.dis,suc=C.suc;let g=`<g transform="translate(${x} ${y}) scale(${s})">`;
 g+=`<rect x="-70" y="-24" width="140" height="48" rx="22" fill="url(#rfBrass)" stroke="#5e400e" stroke-width="1.6"/>`;
 if(o.cut){g+=`<rect x="-60" y="-14" width="120" height="28" rx="12" fill="#f1e2bd"/>`;const sx=cool?-20:20;g+=`<path d="M${sx-30} 14 V0 Q${sx-30} -10 ${sx-18} -10 H${sx+18} Q${sx+30} -10 ${sx+30} 0 V14" fill="#c9a24a" stroke="#5e400e" stroke-width="1.4"/>`+K.txt(sx,6,"slide",{fill:"#5e400e"})}
 const port=(px,py,col,l)=>REF.pipe(`M${px} ${py} V${py+(py<0?-34:34)}`,col,7,{flow:false})+(o.ports===false?"":K.lbl(px,py+(py<0?-42:52),l,{size:13}));
 g+=port(0,-24,hot,"D")+port(-40,24,cool?suc:hot,"E")+port(0,24,suc,"S")+port(40,24,cool?hot:suc,"C");
 const px=o.ports===false?-92:0;if(o.pilot!==false)g+=`<rect x="${px-28}" y="-62" width="56" height="26" rx="4" fill="#2a2f33"/><text x="${px}" y="-45" class="lsLcd" style="font-size:9px;fill:${o.on?"#7CFFB2":"#9aa3aa"}">24 V ${o.on?"ON":"OFF"}</text>`;
 return g+`</g>`};
/* ---------- the heat pump loop, viewBox 720 x 380 ---------- */
const hpLoop=(mode,o={})=>{const heat=mode==="heat",df=mode==="defrost",hot=C.dis,suc=C.suc,mix=C.mix,liq=C.liq;let s=REF.defs();
 // coils
 const coil=(x,f,cond)=>`<rect x="${x}" y="70" width="90" height="220" rx="4" fill="url(#rfFins)" stroke="#7d868c"/>`+(()=>{const p=`M${x+18} 80 V280 M${x+45} 80 V280 M${x+72} 80 V280`;return `<path d="${p}" stroke="#6a3418" stroke-width="7"/><path d="${p}" stroke="${cond?C.cnd:mix}" stroke-width="4"/>`})();
 s+=coil(60,0,heat)+coil(570,0,!heat);
 // gas lines from the valve to each coil, liquid line between coils
 const iCol=heat?hot:suc,oCol=heat?suc:hot;
 s+=REF.pipe("M320 194 V220 H150",iCol,7)+REF.pipe("M400 194 V220 H570",oCol,7);
 s+=REF.pipe(heat?"M615 290 V340 H105 V290":"M105 290 V340 H615 V290",liq,6);
 s+=REF.pipe("M360 194 V250",suc,7)+`<rect x="342" y="236" width="36" height="34" rx="10" fill="url(#rfSteel)" stroke="#333"/>`+REF.pipe("M378 300 H470 V60 H360 V108",hot,7);
 s+=`<rect x="330" y="270" width="60" height="70" rx="22" fill="url(#rfShell)"/>`+rv(360,150,heat?"heat":"cool",1,{on:o.on,ports:false});
 // metering devices: the one feeding the evaporator meters, the other bypasses
 s+=REF.meterSVG(190,340,true)+REF.meterSVG(530,340,false);
 s+=K.txt(190,372,heat?"bypasses":"meters",{fill:heat?null:mix})+K.txt(530,372,heat?"meters":"bypasses",{fill:heat?mix:null});
 s+=K.lbl(105,56,"INDOOR COIL",{size:13})+K.lbl(615,56,"OUTDOOR COIL",{size:13})+K.txt(158,284,heat?"condenser":"evaporator",{a:"start",fill:heat?hot:mix})+K.txt(562,284,heat?"evaporator":"condenser",{a:"end",fill:heat?mix:hot});
 s+=K.txt(334,258,"accumulator",{a:"end"})+K.txt(322,312,"compressor",{a:"end"});
 if(df)s+=K.tag(615,30,"FAN OFF",{fill:"var(--bad)",w:90})+K.tag(105,30,"HEAT STRIPS ON",{fill:hot,w:150});
 if(o.frost)s+=`<rect x="570" y="70" width="90" height="220" rx="4" fill="#e6f4ff" opacity="${(0.2+o.frost*0.7).toFixed(2)}"/>`;
 return s};
/* ---------- defrost model: time-temperature board on a frosting outdoor coil ---------- */
const Wsat=TF=>{const c=(TF-32)/1.8,es=c<0?0.61115*Math.exp(22.452*c/(272.55+c)):0.61094*Math.exp(17.625*c/(c+243.04));return 0.622*es/(101.325-es)};
const INT=[30,60,90];
const sim=o=>{const dt=0.5,N=240/dt,out=[];let f=0,timer=0,df=false,dfT=0,melt=0,n=0,dfMin=0,del=0,peak=0;const Wa=o.rh/100*Wsat(o.tout),iv=INT[o.int];
 for(let k=0;k<=N;k++){const t=k*dt;let Tc,mode;
  if(df){mode="defrost";f=Math.max(0,f-0.12*dt);dfT+=dt;if(f>0){Tc=32;melt=dfT}else Tc=Math.min(70,32+(dfT-melt)*10);dfMin+=dt;if((f<=0&&Tc>=57)||dfT>=10){df=false;timer=0}}
  else{mode="heat";Tc=o.tout-12-12*f;const rate=Tc<32?7*Math.max(0,Wa-Wsat(Tc)):0;f=Math.min(1,f+rate*dt);
   if(Tc>34&&o.tout>36)f=Math.max(0,f-0.02*dt);
   if(!o.fail&&Tc<=30)timer+=dt;if(timer>=iv){df=true;dfT=0;melt=0;n++}
   del+=(1-0.6*f)*dt}
  peak=Math.max(peak,f);out.push({t,f,Tc,mode,timer})}
 return {out,n,dfPct:dfMin/240*100,avg:Math.min(100,del/240*100),peak}};
const steps=[
 {t:"Cooling: hot gas goes outdoors",body:`<p>A heat pump is an air conditioner that can run backward. In <b>cooling</b> it works like any AC: the outdoor coil is the condenser and the indoor coil is the evaporator.</p><p>The part that makes it reversible is the <b>reversing valve</b>, a four-way valve right next to the compressor. In cooling it sends hot discharge gas (port D) to the outdoor coil (port C), and connects the indoor coil (port E) to the suction (port S).</p>`,
  draw:()=>hpLoop("cool",{on:true})},
 {t:"Heating: the same loop, reversed",body:`<p>In <b>heating</b> the valve's slide moves over. Now hot gas goes to the <b>indoor coil</b>, which becomes the condenser and heats the house. The outdoor coil becomes the evaporator, boiling cold refrigerant with heat pulled from the outdoor air, even at 20°F.</p><p>The compressor still pumps the same direction. Only the coils swap jobs. That's why the big gas line between the units runs <b>hot</b> in heating.</p>`,
  draw:()=>hpLoop("heat",{on:false})},
 {t:"Inside the reversing valve",body:`<p>Inside is a <b>slide</b> that connects S to either E or C. D always feeds the other side of the valve body.</p><p>A small <b>pilot valve</b> with a 24 V solenoid coil decides which way it goes, using the system's own pressure difference to push the slide. So the compressor has to be running for the valve to shift.</p><p>Most brands energize the coil in <b>cooling</b> (the <b>O</b> terminal); some energize it in <b>heating</b> (<b>B</b>). Set the thermostat to match, or it will heat when it should cool.</p>`,
  draw:()=>REF.defs()+rv(190,190,"cool",1.6,{cut:true,on:true})+rv(530,190,"heat",1.6,{cut:true,on:false})+K.lbl(190,46,"COOLING",{size:15,fill:C.mix})+K.lbl(530,46,"HEATING",{size:15,fill:C.dis})+K.txt(190,360,"S connected to E (indoor coil)")+K.txt(530,360,"S connected to C (outdoor coil)")+K.txt(360,30,"O-type valve: coil on in cooling",{})},
 {t:"Metering both ways, reading pressures",body:`<p>Each coil has its own metering device, and each one only meters when its coil is the evaporator. The other one lets refrigerant <b>bypass</b>: a check valve, a piston that slides off its seat, or a bi-flow TXV.</p><ul><li>An <b>accumulator</b> between the valve's S port and the compressor catches liquid, which matters during the switch and in defrost.</li><li>The gas line service valve reads <b>suction in cooling but head pressure in heating</b>. Many units have a separate suction port between the valve and the compressor that reads suction in both modes.</li></ul>`,
  draw:()=>hpLoop("heat",{on:false})+K.tag(255,236,"GAS LINE: HOT IN HEATING",{fill:C.dis,w:230})},
 {t:"Frost on the outdoor coil",body:`<p>In heating the outdoor coil runs colder than the outdoor air, often 10 to 20°F below it. When the coil is below 32°F, water in the air freezes onto the fins as <b>frost</b>. Frost blocks the air, the coil gets even colder, and capacity drops.</p><p>Frost builds fastest in <b>damp weather near freezing</b>, roughly 28 to 42°F. Very cold air holds so little water that frost builds slowly.</p>`,
  draw:()=>{const pts=[];for(let t=-5;t<=55;t+=1){const Tc=t-12;pts.push([t,Tc<32?7*Math.max(0,0.85*Wsat(t)-Wsat(Tc))*60*100:0])}
   return K.chart({x:90,y:40,w:560,h:270,X:[-5,55],Y:[0,Math.ceil(Math.max(...pts.map(p=>p[1]))/10)*10],xt:[-5,5,15,25,35,45,55],xf:v=>v+"°F",yt:[0,20,40,60,80],title:"HOW FAST FROST BUILDS, 85% RELATIVE HUMIDITY",xl:"outdoor temperature",yl:"frost per hour, % of a blocked coil",
    series:[{pts,c:"#2f6fd6",lbl:"frost rate",lblAt:20,a:"end",dx:-8,dy:-6}],bands:[]})}},
 {t:"Defrost: the sequence",body:`<p>A common <b>time-temperature</b> defrost board works like this:</p><ol><li>A sensor clipped to the outdoor coil closes at about <b>30°F</b>.</li><li>The board counts heating run time while it's closed. At the jumper setting (<b>30, 60 or 90 minutes</b>) it starts a defrost.</li><li>Defrost: the reversing valve switches to <b>cooling</b> so hot gas melts the frost, the <b>outdoor fan stops</b>, and the <b>heat strips</b> come on to temper the cold indoor air.</li><li>It ends when the coil warms to about <b>50 to 70°F</b>, or at a time limit (often about 10 minutes).</li></ol><p>Steam rising off the unit and water pouring out is normal.</p>`,
  draw:()=>{const r=sim({tout:35,rh:90,int:1});return K.chart({x:90,y:40,w:560,h:270,X:[0,240],Y:[0,100],xt:[0,60,120,180,240],xf:v=>v+" min",yt:[0,25,50,75,100],title:"35°F, 90% RH, 60-MINUTE JUMPER",xl:"time",yl:"frost, % of a blocked coil",
   series:[{pts:r.out.map(p=>[p.t,p.f*100]),c:"#2f6fd6",lbl:"frost",lblAt:50,dy:-10}],bands:[]})+r.out.filter((p,i)=>p.mode==="defrost"&&(i===0||r.out[i-1].mode!=="defrost")).map(p=>`<rect x="${90+p.t/240*560}" y="40" width="${Math.max(6,8/240*560)}" height="270" fill="#c0392b" opacity=".18"/>`+K.txt(90+p.t/240*560+14,58,"defrost",{a:"start",fill:"#c0392b"})).join("")}}];
REF.wrapSteps(steps);
const see=K.see({vb:"0 0 720 520",init:{tout:35,rh:90,int:1,t:60,fail:false},sliders:[["tout","Outdoor temperature",0,50,1,v=>v+"°F"],["rh","Outdoor humidity",40,100,5,v=>v+"%"],["int","Defrost jumper",0,2,1,v=>INT[v]+" min"],["t","Look at minute",0,240,1,v=>v+" min"]],checks:[["fail","Defrost sensor failed open"]],
 model:S=>{const r=sim(S);r.at=r.out[Math.round(S.t/0.5)];return r},
 draw:REF.U((r,S)=>{const X=t=>70+t/240*600,Y=v=>30+190-v/100*190;let s=REF.defs()+K.chart({x:70,y:30,w:600,h:190,X:[0,240],Y:[0,100],xt:[0,60,120,180,240],xf:v=>v+" min",yt:[0,50,100],yf:v=>v+"%",title:"",
   series:[{pts:r.out.map(p=>[p.t,p.f*100]),c:"#2f6fd6",w:2.6},{pts:r.out.map(p=>[p.t,p.mode==="defrost"?0:100*(1-0.6*p.f)]),c:"#c0392b",w:2,dash:"5 4"}]});
   r.out.forEach((p,i)=>{if(p.mode==="defrost"&&(i===0||r.out[i-1].mode!=="defrost")){let j=i;while(j<r.out.length&&r.out[j].mode==="defrost")j++;s+=`<rect x="${X(p.t)}" y="30" width="${Math.max(3,X(r.out[j-1].t)-X(p.t))}" height="190" fill="#c0392b" opacity=".16"/>`}});
   s+=`<path d="M${X(S.t)} 30 V220" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 3"/>`+K.lbl(80,22,"FROST",{a:"start",size:13,fill:"#2f6fd6"})+K.lbl(150,22,"HEAT DELIVERED",{a:"start",size:13,fill:"#c0392b"})+K.lbl(300,22,"DEFROST",{a:"start",size:13,fill:"#e07a6a"});
   s+=`<g transform="translate(115 262) scale(0.68)">`+hpLoop(r.at.mode,{frost:r.at.f}).replace(REF.defs(),"")+`</g>`;
   return s}),
 reads:(r,S)=>[["At minute "+S.t,r.at.mode==="defrost"?"defrosting":"heating"],["Outdoor coil",K.f0(r.at.Tc)+"°F"],["Sensor",S.fail?"failed open":r.at.Tc<=30?"closed (counting)":"open"],["Frost",K.f0(r.at.f*100)+"%",r.at.f>0.7],["Defrosts in 4 h",r.n],["Time defrosting",K.f0(r.dfPct)+"%"],["Avg heat vs clean coil",K.f0(r.avg)+"%",r.avg<70],["Peak frost",K.f0(r.peak*100)+"%",r.peak>0.8]],
 note:(r,S)=>S.fail&&r.peak>0.5?"The sensor never closes, so the board never defrosts. The coil keeps icing and heat output falls. This is how outdoor units end up as blocks of ice.":r.peak<0.15&&r.n?"Little frost forms, but the time-temperature board still defrosts every time the timer runs out. That wastes energy; demand-defrost boards avoid it.":r.peak<0.15?"Warm enough that the coil stays above freezing: no frost, no defrost.":"Frost builds while heating; each defrost melts it with hot gas, with the outdoor fan off and the heat strips on.",
 log:[["Out",(r,S)=>S.tout+"°F"],["RH",(r,S)=>S.rh+"%"],["Jumper",(r,S)=>INT[S.int]],["Defrosts",r=>r.n],["Avg heat",r=>K.f0(r.avg)+"%"]]});
const bestAvg=(tout,rh)=>Math.max(...[0,1,2].map(i=>sim({tout,rh,int:i}).avg));
const tasks=[
 K.goal({t:"Frost weather",intro:"On the <b>90-minute</b> jumper, find outdoor conditions where frost builds past <b>50%</b> of a blocked coil before a defrost clears it.",check:(S,R)=>S.fail?"Clear the sensor fault.":S.int!==2?"Set the 90-minute jumper.":R.peak>=0.5?true:`Peak frost ${K.f0(R.peak*100)}%.`,ok:(S,R)=>`${S.tout}°F and ${S.rh}% humidity: ${K.f0(R.peak*100)}% frost. Damp air just above freezing is the worst case.`}),
 K.goal({t:"Pick the jumper for the climate",intro:"At <b>17°F and 60%</b> humidity (cold and dry), which jumper delivers the most heat? Set it (a tie counts).",check:(S,R)=>S.fail?"Clear the sensor fault.":S.tout!==17||S.rh!==60?"Set 17°F and 60% humidity.":R.avg>=bestAvg(17,60)-0.3?true:`${INT[S.int]} minutes gives ${K.f0(R.avg)}%. Try the others.`,ok:(S,R)=>`${INT[S.int]} minutes: ${K.f0(R.avg)}% average. In dry cold air frost builds slowly, so the 30-minute jumper mostly wastes heat on defrosts. In damp weather near freezing (try 35°F, 90%), the 30-minute jumper wins.`}),
 K.caseTask({t:"Service call: cold air in heat mode",intro:"Thermostat set to heat, 40°F outside. Air from the vents feels cool. Outdoor fan is running, no steam, no ice.",state:{},model:()=>({}),draw:()=>REF.uniq(hpLoop("cool",{on:false})),
  reads:()=>[["Mode called","Heat"],["Supply air","58°F"],["Gas line at indoor coil","cold"],["Outdoor coil","warm"]],
  actions:[["Check the valve coil",()=>"Heat-energized (B) valve. 24 V is at the coil and its resistance is normal."],["Feel the valve's lines",()=>"D line hot, the line to the outdoor coil hot, the line to the indoor coil cold."]],
  causes:[["rv","Reversing valve stuck in cooling"],["df","Stuck in defrost"],["low","Low charge"],["fan","Outdoor fan motor failed"]],ans:"rv",
  why:"The coil has power and is good, yet hot gas still goes to the outdoor coil: the slide is stuck. A stuck-in-defrost unit would have the outdoor fan off. Try shifting it with a pressure difference (some techs tap it lightly); if that fails, recover and replace the valve, keeping the body cool while brazing.",hint:"Which coil is getting the hot gas? The fan is running, so it isn't a defrost."})];
window.LESSON={id:"ref-hp",sec:"Refrigeration",secHref:"/refrigeration/",title:"Heat pump reversing valve and defrost",lead:"How the reversing valve swaps the indoor and outdoor coils between heating and cooling, and how the board clears frost off the outdoor coil.",
 steps,see,tryIntro:"Two in See it, then a service call.",tasks,
 job:K.job({read:["Which way the valve is energized (O in cooling or B in heating): thermostat setup and the outdoor unit's wiring diagram.","Line temperatures at the valve: D always hot; in heating the line to the indoor coil is hot too.","Pressures at the port that reads suction in both modes."],
  table:[["Item","Typical","Notes"],["Defrost sensor closes","About 30°F (±3°F)","Clipped to the outdoor coil"],["Defrost jumper","30, 60 or 90 minutes","Run time with the sensor closed"],["Defrost ends","Coil about 50 to 70°F, or a time limit (often about 10 min)","Check the board's manual"],["Outdoor coil in heating","About 10 to 20°F below outdoor air","Below 32°F it frosts"]],tableT:"Time-temperature defrost boards",
  steps:["Confirm the thermostat's O/B setting matches the outdoor unit.","In heating, check that the gas line at the air handler is hot.","Force a defrost (most boards have test pins). Watch: valve shifts, outdoor fan stops, strips come on.","Check the defrost sensor: closed (continuity) below about 30°F, open when warm.","If the valve won't shift with power at the coil, check the pressure difference and line temperatures before condemning it."],stepsT:"Checking a heat pump in heating",
  safety:["Hot gas lines and the valve body are hot. The discharge line can burn.","When brazing a new valve, wrap it in a wet rag or use heat paste: the slide's nylon parts melt.","Keep hands clear of the outdoor fan; it can restart at the end of a defrost."],
  mistakes:["Calling a normal defrost (steam, no fan) a breakdown.","Reading the gas line port in heating and calling it suction.","Wrong O/B setting on a new thermostat.","Replacing a valve when the problem is a bad coil or no 24 V to it."]}),
 sources:[["The Engineering Mindset: Heat pumps explained","https://theengineeringmindset.com/heat-pumps-explained/"],["ACHR News: Understanding a defrost board on a heat pump","https://www.achrnews.com/articles/165721-understanding-a-defrost-board-on-a-heat-pump"],["OpenExamPrep (HVAC Excellence study guide): Heat pump defrost systems","https://open-exam-prep.com/study-guides/hvac-excellence/heat-pumps-dual-fuel/defrost-systems"]]};
})();
