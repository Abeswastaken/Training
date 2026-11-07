/* ============ Lesson: Lift ============ */
(()=>{const P=v=>plant(v);
const steps=[
 {t:"Lift is the hill the compressor climbs",
  body:`<p>The compressor takes refrigerant boiling at the <b>evaporator</b> temperature and squeezes it up to the <b>condensing</b> temperature. The difference is called <b>lift</b>.</p><p>At design conditions this chiller boils refrigerant at about 42°F and condenses it at about 96°F: about 54°F of lift.</p><p class="lsKey">Lift = condensing temperature − evaporating temperature (both from the pressures).</p>`,
  math:`<p>Lift = T<sub>sat, cond</sub> − T<sub>sat, evap</sub></p><p>Some manuals use pressure instead: lift = condenser psig − evaporator psig, about 116 − 37 = 79 psi here. Temperature is easier to reason with.</p>`,
  draw:()=>liftBar(P({}),250,220,{title:"DESIGN DAY: 300 TONS, 85°F TOWER WATER"})},
 {t:"What sets each end",
  body:`<p>The <b>bottom</b> is the chilled water setpoint minus the evaporator approach.</p><p>The <b>top</b> stacks up from outdoors: the outdoor <b>wet bulb</b>, plus the tower's approach gives the tower water; plus the condenser water <b>range</b> gives the leaving condenser water; plus the <b>condenser approach</b> gives the condensing temperature.</p><p>Change any one of these and the lift changes.</p>`,
  draw:()=>ladderSVG(P({}))},
 {t:"More lift, more kW per ton",
  body:`<p>The compressor's work goes up with lift. Lower the lift and every ton of cooling costs less electricity.</p><p>Rule of thumb: each 1°F of lift is roughly 1 to 2% of compressor power. Over a season that's real money on a 300-ton machine.</p>`,
  draw:()=>{const pts=[];for(let tw=65;tw<=90;tw+=1){const R=P({tset:tw,wb:Math.min(78,tw-6)});pts.push([R.lift,R.kwt])}return K.chart({x:90,y:50,w:550,h:250,X:[34,58],Y:[0.4,0.6],xt:[35,40,45,50,55],yt:[0.4,0.45,0.5,0.55,0.6],yf:v=>v.toFixed(2),xf:v=>v+"°F",xl:"lift at full load",yl:"kW per ton",title:"FULL LOAD: kW PER TON VS LIFT",series:[{pts,c:"#9a6f1f",lbl:"300 TONS",lblAt:40,a:"start",dx:6,dy:24}],dots:[{x:P({}).lift,y:P({}).kwt,lbl:"DESIGN",a:"end",dx:-10}]})}},
 {t:"Lower the top: colder tower water",
  body:`<p>On a cooler or drier day the wet bulb drops, and the tower <b>can</b> make colder water. If the tower setpoint is left at 85°F, the fan just slows down and the chiller misses out.</p><p><b>Condenser water reset</b> lowers the tower setpoint when the weather allows. Clean condenser tubes keep the condenser approach small.</p><p>Drag the wet bulb and see how far the top can drop.</p>`,
  init:{wb:78},ctl:{html:`<div class="row"><label for="ls_wb">Outdoor wet bulb</label><output id="lso_wb">78°F</output><input type="range" id="ls_wb" min="45" max="78" step="1" value="78"></div>`,input:(t,s)=>{s.wb=+t.value;document.getElementById("lso_wb").textContent=t.value+"°F"}},
  draw:s=>{const wb=s.wb??78,tset=Math.max(65,wb+7);return ladderSVG(P({wb,tset}))+K.tag(580,24,"TOWER SETPOINT "+tset+"°F",{c:"v"})}},
 {t:"Raise the bottom: warmer chilled water",
  body:`<p>Every degree warmer on the chilled water setpoint raises the evaporating temperature a degree. <b>Chilled water reset</b> raises the setpoint when the building doesn't need 44°F, for example on mild days or at night.</p><p>The limit is humidity: water much warmer than about 48 to 50°F can't pull enough moisture out of the air at the coils.</p>`,
  init:{lchw:44},ctl:{html:`<div class="row"><label for="ls_cw">Chilled water setpoint</label><output id="lso_cw">44°F</output><input type="range" id="ls_cw" min="40" max="50" step="0.5" value="44"></div>`,input:(t,s)=>{s.lchw=+t.value;document.getElementById("lso_cw").textContent=t.value+"°F"}},
  draw:s=>{const R=P({lchw:s.lchw??44});return ladderSVG(R)+K.tag(580,24,K.f2(R.kwt)+" kW/ton",{c:"v"})}},
 {t:"How low can you go?",
  body:`<p>Lower lift is better, but not without limit:</p><ul><li>Most chillers have a <b>minimum condenser water temperature</b> (often 55 to 65°F on centrifugals; check the manual). Too cold and the pressure difference is too small to push refrigerant through the metering device and return oil.</li><li>Too <b>much</b> lift for the load and a centrifugal compressor <b>surges</b>. That's the next lesson.</li></ul>`,
  draw:()=>{const pts=[];for(let p=0.2;p<=1.001;p+=0.05)pts.push([p*100,36+28*p]);return K.chart({x:90,y:50,w:550,h:250,X:[20,100],Y:[25,70],xt:[20,40,60,80,100],yt:[30,40,50,60,70],xf:v=>v+"%",yf:v=>v+"°F",xl:"load",yl:"lift",title:"SAFE LIFT RANGE",bands:[{y0:25,y1:32,c:"#2f6fd6",lbl:"TOO LITTLE: BELOW MIN CONDENSER WATER"}],series:[{pts,c:"var(--bad)",lbl:"SURGE LINE: TOO MUCH LIFT ABOVE",lblAt:30,a:"start",dx:6,dy:-14}]})}}];
const see=K.see({init:{load:100,lchw:44,wb:78,tset:85},
 sliders:[["load","Load",20,100,5,v=>v+"%"],["lchw","Chilled water setpoint",40,50,0.5,v=>K.f1(v)+"°F"],["wb","Outdoor wet bulb",45,80,1,v=>v+"°F"],["tset","Tower water setpoint",65,90,1,v=>v+"°F"]],
 model:S=>P({load:S.load/100,lchw:S.lchw,wb:S.wb,tset:S.tset}),draw:R=>ladderSVG(R),
 reads:R=>[["Lift",K.f1(R.lift)+"°F"],["kW per ton",K.f2(R.kwt)],["Tower water",K.f1(R.Tb)+"°F"],["Tower fan",K.f0(R.fan*100)+"%"],["Cooling",K.f0(R.Q)+" tons"],["Motor",K.f0(R.kW)+" kW"]],
 note:R=>(R.surge?`<b class="bad">Surge: ${K.f1(R.lift)}°F of lift is too much at ${K.f0(R.plr*100)}% load.</b> `:"")+(R.Tb>R.v.tset+0.3?"The tower can't reach its setpoint at this wet bulb; the fan is at full speed.":""),
 log:[["Load",(R,S)=>S.load+"%"],["Lift",R=>K.f1(R.lift)],["kW/t",R=>K.f2(R.kwt)]]});
const tasks=[
 K.goal({t:"Spring morning",intro:"It's a mild spring morning: set the wet bulb to <b>55°F</b> and the load to <b>100%</b>. Keep 44°F chilled water. Get the lift under <b>42°F</b>.",
  check:(S,R)=>S.wb!==55?"Set the wet bulb to 55°F.":S.load<95?"Set the load to 100%.":S.lchw!==44?"Keep the chilled water at 44°F.":R.lift<42?true:`Lift is ${K.f1(R.lift)}°F. The tower could make colder water than its setpoint...`,ok:(S,R)=>`Lift ${K.f1(R.lift)}°F at ${S.tset}°F tower water: ${K.f2(R.kwt)} kW per ton.`}),
 K.goal({t:"Night setback",intro:"At night the load is <b>50%</b> and the building is dry. With 78°F wet bulb and 85°F tower water, use the chilled water setpoint to get below <b>0.53 kW per ton</b> without going above 48°F.",
  check:(S,R)=>S.load!==50?"Set the load to 50%.":S.wb!==78||S.tset!==85?"Put the wet bulb at 78°F and the tower setpoint at 85°F.":S.lchw>48?"Stay at or below 48°F chilled water.":R.kwt<0.53?true:`${K.f3?K.f3(R.kwt):R.kwt.toFixed(3)} kW per ton. Raise the bottom of the lift.`,ok:(S,R)=>`${K.f2(R.kwt)} kW per ton at ${K.f1(S.lchw)}°F chilled water.`}),
 K.caseTask({t:"Service call: high winter power bill",intro:"January: wet bulb 45°F, chiller at 60% for a data room. kW per ton is higher than the energy audit expected.",
  state:{load:0.6,wb:45,tset:85},model:P,draw:R=>ladderSVG(R),reads:R=>[["kW per ton",K.f2(R.kwt)],["Lift",K.f1(R.lift)+"°F"],["Tower water",K.f1(R.Tb)+"°F"],["Tower fan",K.f0(R.fan*100)+"%"]],
  actions:[["Check the condenser approach",R=>`Condenser approach ${K.f1(R.appC)}°F: clean.`],["Check the tower controller",R=>`Tower water setpoint: ${R.v.tset}°F. Fan speed ${K.f0(R.fan*100)}%.`]],
  causes:[["tset","Tower water setpoint left at 85°F"],["scale","Scaled condenser tubes"],["chw","Chilled water setpoint too low"],["fan","Tower fan failed"]],ans:"tset",
  why:"With a 45°F wet bulb the tower could easily make 65°F water, but the setpoint is still at 85°F, so the fan idles. Reset it (within the chiller's minimum) and lift drops by about 20°F.",hint:"The condenser is clean and the fan is barely turning. What is the tower being told to make?"})];
window.LESSON={id:"chill-lift",sec:"Chiller and cooling tower",secHref:"/chiller/",title:"Lift",lead:"The pressure (and temperature) hill the compressor climbs, what sets it, and how lowering it saves power.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Evaporator and condenser saturation temperatures</b> (or pressures) at the same moment.","<b>Outdoor wet bulb</b>, tower water temperature and tower fan speed.","<b>kW per ton</b> from the panel or a power meter and the load."],
  table:[["Lever","Effect on lift"],["Condenser water reset (lower tower setpoint)","Biggest saver when the weather is mild, down to the chiller's minimum"],["Chilled water reset (raise setpoint)","About 1°F of lift per 1°F, limited by humidity control"],["Clean condenser and evaporator tubes","Removes the approach added by fouling"],["Purge non-condensables","Brings head pressure back to the real condensing pressure"]],
  log:"Log lift with the load and wet bulb. Compare it at the same load and weather, not across seasons.",
  mistakes:["Running towers at a fixed 85°F all year.","Dropping condenser water below the manufacturer's minimum and losing oil return or tripping on low pressure difference.","Raising chilled water so far that the building gets humid."]}),
 sources:[["The Engineering Mindset: water-cooled chiller design data","https://theengineeringmindset.com/water-cooled-chiller-design-data/"],["Aircondlounge: chiller surge, causes and prevention","https://aircondlounge.com/chiller-surge-symptoms-causes-preventions/"],["AHRI 550/590 rating conditions (PE exam guide)","https://open-exam-prep.com/study-guides/pe-mechanical-hvac/hvac-equipment-machinery/water-chillers-iplv-ratings"],["Cooling towers: range and approach (PE exam guide)","https://open-exam-prep.com/study-guides/pe-mechanical-hvac/hvac-equipment-machinery/cooling-towers-approach-cycles"]]};
})();
