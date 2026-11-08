/* ============ Lesson: Inducer and pressure switches ============ */
(()=>{
const M=S=>{const d=HK.draft({block:S.block,speed:S.speed,hose:S.hose,trap:S.trap});const flow=d.flow*(S.trap?0.5:1);const man=S.port?d.port:d.atSw;
 const closed=S.bad?false:d.atSw>=HK.PS_ON;const chatter=!S.bad&&d.atSw<HK.PS_ON&&d.atSw>=HK.PS_OFF;return {...d,flow,man,closed,chatter,S}};
/* largest vent blockage that still lets the switch close */
const limitBlock=S=>{let b=0;for(let x=0;x<=97;x+=0.5){if(HK.draft({block:x,speed:S.speed,hose:S.hose,trap:S.trap}).atSw>=HK.PS_ON)b=x}return b};
const f2=v=>"-"+v.toFixed(2);
/* the switch itself: x,y centre */
const swIcon=(x,y,closed,o={})=>`<g>${zShade(x,y+34,28,4)}<circle cx="${x}" cy="${y}" r="30" fill="url(#zAluTop)" stroke="#5f686d" stroke-width="1.4" filter="url(#zShadow)"/><circle cx="${x}" cy="${y}" r="21" fill="#e9ecee" stroke="#9aa1a8"/>
 <text x="${x}" y="${y-4}" style="font-family:var(--mono);font-size:8.5px;fill:#1d2327;text-anchor:middle">${o.set||"-0.65"}</text><text x="${x}" y="${y+6}" style="font-family:var(--mono);font-size:7px;fill:#1d2327;text-anchor:middle">IN. W.C.</text>
 <circle cx="${x}" cy="${y+14}" r="3.4" fill="${closed?"var(--ok)":"var(--lamp-off)"}"/><rect x="${x-6}" y="${y-38}" width="12" height="10" rx="2" fill="#9aa1a8" stroke="#4d555a"/>
 <path d="M${x+28} ${y-6} h18 M${x+28} ${y+6} h18" stroke="#f2f2f2" stroke-width="3"/><path d="M${x+28} ${y-6} h18" stroke="#c0392b" stroke-width="1.6"/><path d="M${x+28} ${y+6} h18" stroke="#2f6fd6" stroke-width="1.6"/></g>`;
/* close-up of the vent side of the furnace */
const scene=(R,o={})=>{const S=R.S||{};let s="";const fl=HK.clamp(R.flow,0,1.2);
 /* heat exchanger tops and collector box */
 [86,122,158,194].forEach(x=>{s+=`<path d="M${x} 380 V262 Q${x+15} 240 ${x+30} 262 V380 Z" fill="#9aa1a8" stroke="#4d555a"/><rect x="${x+9}" y="216" width="12" height="32" fill="#7d868c"/>`});
 s+=`<rect x="56" y="120" width="190" height="100" rx="5" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.4" filter="url(#zShadow)"/><text x="150" y="140" style="font-family:var(--display);font-size:11px;font-weight:700;fill:#1d2327;text-anchor:middle;letter-spacing:.06em">COLLECTOR BOX</text>`;
 if(S.trap)s+=`<rect x="60" y="176" width="182" height="40" fill="#5a9bd4" opacity=".85"/><path d="M60 176 q12 -4 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t14 0" stroke="#d9ecf8" fill="none"/>`;
 /* flue flow arrows */
 if(fl>0.05){const op=(0.25+0.75*Math.min(1,fl)).toFixed(2);s+=`<g opacity="${op}">`+[101,137,173,209].map(x=>`<path class="lsFlow" d="M${x} 300 V196" stroke="${HK.FLUE}" stroke-width="2.6" stroke-dasharray="6 6" fill="none"/>`).join("")+`<path class="lsFlow" d="M120 168 H262" stroke="${HK.FLUE}" stroke-width="2.6" stroke-dasharray="6 6" fill="none"/></g>`}
 /* condensate trap */
 s+=`<path d="M68 220 V330 Q68 352 48 352 H36 Q16 352 16 330 V316" fill="none" stroke="#f4f4f0" stroke-width="11"/><path d="M68 300 V330 Q68 352 48 352 H36 Q16 352 16 330 V306" fill="none" stroke="${S.trap?"#8a6a3a":"#6fb3e8"}" stroke-width="6"/>`;
 /* vent pipe and blockage */
 s+=`<rect x="294" y="0" width="32" height="128" fill="${o.pvc===false?"#b9c0c6":"#f4f4f0"}" stroke="#7d868c"/><rect x="298" y="0" width="6" height="128" fill="rgba(255,255,255,.6)"/>`;
 if(S.block>0)s+=`<rect x="295" y="2" width="30" height="${(8+S.block*0.9).toFixed(1)}" fill="#7a5a32"/><path d="M296 ${(10+S.block*0.9).toFixed(1)} l5 -7 5 7 5 -7 5 7 5 -7" stroke="#4a3418" fill="none"/>`;
 if(fl>0.05)s+=`<path class="lsFlow" d="M310 120 V8" stroke="${HK.FLUE}" stroke-width="2.6" stroke-dasharray="6 6" fill="none" opacity="${(0.25+0.75*Math.min(1,fl)).toFixed(2)}"/>`;
 /* inducer */
 s+=`<rect x="244" y="148" width="22" height="44" fill="#7d868c" stroke="#4d555a"/><circle cx="310" cy="170" r="48" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.4" filter="url(#zShadow)"/><circle cx="310" cy="170" r="32" fill="url(#zInside)" stroke="#2a2f33"/>`;
 s+=`<g stroke="#c4cacf" stroke-width="3">${[0,1,2,3,4,5].map(i=>`<line x1="${(310-26*Math.cos(i*Math.PI/6)).toFixed(1)}" y1="${(170-26*Math.sin(i*Math.PI/6)).toFixed(1)}" x2="${(310+26*Math.cos(i*Math.PI/6)).toFixed(1)}" y2="${(170+26*Math.sin(i*Math.PI/6)).toFixed(1)}"/>`).join("")}</g><circle cx="310" cy="170" r="8" fill="url(#zMotor)"/>`;
 s+=`<rect x="356" y="146" width="40" height="48" rx="6" fill="url(#zMotor)" stroke="#111"/><rect x="360" y="150" width="32" height="6" rx="2" fill="rgba(255,255,255,.2)"/>`;
 /* pressure port, hose, tee, switch, manometer */
 s+=`<rect x="276" y="214" width="12" height="14" rx="2" fill="#9aa1a8" stroke="#4d555a"/>`;
 const hose=(d,c="#14171a")=>`<path d="${d}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
 s+=hose("M282 228 C282 270 330 290 380 290 H430");
 if(S.hose)s+=`<path d="M318 276 l5 6 -4 4 5 6" stroke="var(--bad)" stroke-width="2.4" fill="none"/>`+K.arrow("M300 316 L316 290","#5a9bd4",2);
 s+=swIcon(470,290,R.closed,{set:"-0.65"});
 if(o.mano!==false){if(S.port){s+=hose("M288 222 C330 222 420 200 540 196","#2f6fd6")+`<circle cx="286" cy="222" r="4" fill="#9aa1a8" stroke="#4d555a"/>`}else{s+=`<rect x="372" y="284" width="16" height="12" rx="2" fill="#9aa1a8" stroke="#4d555a"/>`+hose("M380 284 C380 240 460 200 540 196","#2f6fd6")}
  s+=HK.mano(560,170,f2(R.man))}
 /* labels */
 s+=K.lbl(340,30,"VENT",{a:"start",size:13})+K.lbl(356,132,"INDUCER",{a:"start",size:13})+K.lbl(470,346,"PRESSURE SWITCH",{size:13})+K.lbl(150,372,"",{})+K.lbl(30,300,"TRAP",{a:"start",size:13});
 s+=K.lbl(20,60,"SUCTION AT THE PORT",{a:"start",size:12})+K.lcd(84,86,f2(R.port)+'"',100);
 if(o.note)s+=K.lbl(470,372,o.note,{fill:R.closed?HK.OK:"var(--bad)",size:13});
 return s};
const base={block:0,speed:100,hose:false,trap:false,port:false,bad:false};
const steps=[
 {t:"The inducer pulls a vacuum",body:`<p>The <b>inducer</b> is a small fan on the outlet of the heat exchanger. It pulls flue gas through the heat exchanger and pushes it out the vent.</p><p>Pulling makes the inside of the heat exchanger and <b>collector box</b> run slightly below room pressure: a <b>negative pressure</b>. We measure such small pressures in <b>inches of water column (in. w.c.)</b>. A clean furnace in the trainer pulls about <b>-1.0 in. w.c.</b> at the inducer.</p>`,
  math:`<p>1 in. w.c. = 0.036 psi = 249 Pa. A furnace draft of -1.0 in. w.c. is about 1/400 of an atmosphere: too small for a psi gauge, easy for a manometer.</p>`,
  draw:()=>scene(M(base),{mano:false})},
 {t:"Inside the pressure switch",body:`<p>The <b>pressure switch</b> has a rubber <b>diaphragm</b> with a spring behind it. A hose connects one side to a port on the inducer or collector box.</p><p>When the suction is strong enough, it pulls the diaphragm against the spring and the contacts <b>close</b>. The pressure that closes it is the <b>setpoint</b>, printed on the label: <b>-0.65 in. w.c.</b> on the trainer's furnace. Many furnace switches are labelled somewhere around -0.5 to -0.9.</p><p>It opens again at a slightly weaker draft (about -0.55 here), so it doesn't chatter.</p>`,
  draw:()=>{let s=`<g transform="translate(40 40)"><rect x="0" y="40" width="250" height="200" rx="100" fill="url(#zAluTop)" stroke="#5f686d" stroke-width="1.5"/><rect x="0" y="40" width="250" height="200" rx="100" fill="none" stroke="#9aa1a8" stroke-width="8" opacity=".5"/>
   <path d="M40 140 Q125 ${140-26} 210 140" stroke="#1d2327" stroke-width="5" fill="none"/><path d="M40 140 L20 140 M210 140 L230 140" stroke="#4d555a" stroke-width="6"/>
   <path d="M125 128 V96" stroke="#7d868c" stroke-width="5"/><path d="M110 210 l15 -8 -15 -8 15 -8 -15 -8 15 -8 -15 -8" stroke="#7d868c" stroke-width="3" fill="none" transform="translate(0 -40)"/>
   <rect x="96" y="76" width="58" height="20" rx="3" fill="#2a2f33"/><path d="M104 76 V60 H120" stroke="#c9a24a" stroke-width="4" fill="none"/><path d="M146 76 V60 H130" stroke="#c9a24a" stroke-width="4" fill="none"/>
   <rect x="113" y="230" width="24" height="34" rx="3" fill="#9aa1a8" stroke="#4d555a"/></g>`;
   s+=HK.co(194,122,330,120,"CONTACTS",{a:"start"})+HK.co(172,168,330,162,"SPRING",{a:"start"})+HK.co(250,180,330,204,"DIAPHRAGM",{a:"start"})+HK.co(177,296,330,300,"HOSE PORT",{a:"start"});
   s+=K.chart({x:500,y:60,w:200,h:230,X:[0,10],Y:[0,1.2],xt:[0,5,10],xf:v=>v+" s",yt:[0,0.55,0.65,1.0],yf:v=>"-"+v.toFixed(2),title:"DRAFT AT START-UP (IN. W.C.)",
    series:[{f:t=>1.0*(1-Math.exp(-t/2.6)),c:HK.FLUE}],vlines:[],dots:[{x:2.5,y:0.65,c:HK.OK,lbl:"CLOSES",dy:-12,dx:8}],bands:[{y0:0.55,y1:0.65,c:"#c98a1a"}]});
   return s}},
 {t:"The board checks it twice",body:`<p>The pressure switch is a <b>safety</b>. The board trusts it only after two checks:</p><ol><li><b>Before</b> the inducer starts, the switch must be <b>open</b>. If it is closed with no draft, it is welded or jumpered, and the board refuses to start.</li><li><b>After</b> the inducer starts, it must <b>close</b> within a time limit. Until it does, the inducer runs and nothing else happens.</li></ol><p>If it opens during the run, the board shuts the gas off right away.</p>`,
  draw:()=>{const sw=(x,y,cl,c)=>`<path d="M${x} ${y} h40 M${x+90} ${y} h40" stroke="var(--ink)" stroke-width="3"/><circle cx="${x+40}" cy="${y}" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.5"/><circle cx="${x+90}" cy="${y}" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.5"/><path d="M${x+44} ${y} L${x+88} ${cl?y:y-24}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
   return K.cards([{t:"1. INDUCER OFF",c:"var(--ink)",inner:sw(40,96,false,HK.OK)+K.txt(165,138,"must read OPEN"),note:""},{t:"2. INDUCER RUNNING",c:"var(--ink)",inner:sw(40,96,true,HK.OK)+K.txt(165,138,"must CLOSE in time"),note:""},
    {t:"CLOSED WITH THE INDUCER OFF",c:"var(--bad)",inner:sw(40,96,true,"var(--bad)")+K.txt(165,138,"stuck or jumpered: no start"),note:""},{t:"OPENS DURING THE RUN",c:"var(--bad)",inner:sw(40,96,false,"var(--bad)")+K.txt(165,138,"gas off at once"),note:""}])}},
 {t:"What keeps it from closing",body:`<p>When the switch won't close, the switch is usually fine. Something is stealing the draft:</p><ul><li><b>Blocked vent</b>: a nest, snow or ice at the termination. The inducer can't move as much gas, so the suction falls.</li><li><b>Cracked or loose hose</b>: room air leaks in and the switch never sees the real suction.</li><li><b>Water in the collector box</b> (condensing furnaces): a plugged <b>condensate trap</b> backs water up over the pressure port.</li><li><b>Weak inducer</b>: worn bearings, a bad capacitor or low voltage.</li></ul>`,
  draw:()=>{const c=(t,S,txt)=>{const r=M({...base,...S});return {t,c:r.closed?HK.OK:"var(--bad)",inner:K.lcd(80,80,f2(r.atSw),100)+K.txt(80,116,"at the switch")+K.lbl(250,86,r.closed?"CLOSES":"STAYS OPEN",{fill:r.closed?HK.OK:"var(--bad)",size:14}),note:txt}};
   return K.cards([c("VENT 75% BLOCKED",{block:75},"less flue gas moves"),c("CRACKED HOSE",{hose:true},"real suction at the port is normal"),c("PLUGGED TRAP (96%)",{trap:true},"water over the pressure port"),c("INDUCER AT 75% SPEED",{speed:75},"bearing drag, weak capacitor")])}},
 {t:"Test it with a manometer",body:`<p>Measure, don't guess. With the furnace calling:</p><ol><li>Tee a <b>manometer</b> into the hose right at the switch.</li><li>Read the suction and compare it to the label.</li><li>Reading <b>stronger than the setpoint</b> and the switch still open: the switch is bad. Check it with a meter for voltage across its terminals (24 V across it means open).</li><li>Reading <b>weaker</b>: the problem is the draft. Move the manometer to the port itself. If the port reads normal, the hose is the problem; if not, check the vent, trap and inducer.</li></ol>`,
  draw:()=>scene(M(base),{note:"-1.03 BEATS -0.65: SWITCH SHOULD BE CLOSED"})}];
const see=K.see({init:{...base},sliders:[["block","Vent blocked",0,90,5,v=>v+"%"],["speed","Inducer speed",60,100,5,v=>v+"%"]],
 checks:[["hose","Hose cracked"],["trap","Condensate trap plugged (water in the collector box)"],["port","Move the manometer to the inducer port (skip the hose)"]],
 model:S=>M(S),draw:(R)=>scene(R,{note:R.closed?"SWITCH CLOSED: FURNACE CAN LIGHT":R.chatter?"BELOW THE SETPOINT: WON'T CLOSE":"SWITCH OPEN: NO IGNITION"}),
 reads:(R,S)=>[["Manometer",f2(R.man)+" in. w.c."],["Suction at the port",f2(R.port)],["At the switch",f2(R.atSw),R.atSw<HK.PS_ON],["Close / open at","-0.65 / -0.55"],["Switch",R.closed?"closed":"open",!R.closed],["Flue gas flow",Math.round(R.flow*100)+"%",R.flow<0.7]],
 note:(R,S)=>S.hose&&S.port?"At the port the suction is normal; at the switch it's weak. The hose is losing it.":R.chatter?"Between -0.55 and -0.65: once open, it won't reclose. A switch that was already closed could hang on, then drop out as the vent warms or ices.":"",
 log:[["Vent",(R,S)=>S.block+"%"],["Speed",(R,S)=>S.speed+"%"],["Where",(R,S)=>S.port?"port":"switch"],["Reads",R=>f2(R.man)],["Switch",R=>R.closed?"closed":"open"]]});
const tasks=[
 K.goal({t:"How much blockage does it take?",intro:"With the inducer at 100%, no cracked hose and a clear trap, set the vent blockage to the <b>most it can take with the switch still closed</b> (within 5%).",
  check:(S,R)=>S.speed!==100||S.hose||S.trap?"Inducer 100%, hose and trap OK.":!R.closed?"The switch is open. Back off.":S.block<limitBlock(S)-5?"It still closes with more blockage than that. Keep going.":true,
  ok:S=>`About ${S.block}% blocked before it drops out. A vent can be badly restricted and still prove draft, which is why you look at the termination anyway.`}),
 K.caseTask({t:"Service call: 96% furnace, no heat after a cold night",intro:"A condensing furnace. The inducer runs, the igniter never glows. The homeowner says it gurgled last night.",state:{...base,trap:true},model:M,draw:R=>scene(R),
  reads:R=>[["At the switch",f2(R.atSw)+" in. w.c.",true],["Setpoint","-0.65"],["Switch","open",true]],
  actions:[["Manometer on the inducer port",()=>`The port itself reads ${f2(HK.draft({trap:true}).port)}: the suction is weak before the hose.`],["Pull the hose off the switch",()=>"Water drips out of the hose and the port."],["Look at the vent outside",()=>"The termination is clear."]],
  causes:[["vent","Blocked vent"],["hose","Cracked hose"],["trap","Plugged condensate trap"],["sw","Failed pressure switch"],["ind","Weak inducer"]],ans:"trap",
  why:"Water in the hose and a weak reading at the port: condensate is backing up into the collector box. Clean the trap and its drain, blow out the hose, and check the drain line isn't frozen or sagging.",
  hint:"Where did the water in the hose come from?"}),
 K.caseTask({t:"Service call: new switch, same problem?",intro:"A tech replaced the inducer last week. Now the furnace sometimes won't start. You tee in a manometer at the switch.",state:{...base,bad:true},model:M,draw:R=>scene(R,{note:"READING BEATS THE SETPOINT, SWITCH OPEN"}),
  reads:R=>[["At the switch",f2(R.atSw)+" in. w.c."],["Setpoint","-0.65"],["Switch","open",true]],
  actions:[["Meter across the switch terminals",()=>"24.3 VAC across the switch with the inducer running: the contacts are open."],["Look at the hose",()=>"Hose is new, tight and dry."]],
  causes:[["vent","Blocked vent"],["hose","Cracked hose"],["trap","Plugged condensate trap"],["sw","Failed pressure switch"],["ind","Weak inducer"]],ans:"sw",
  why:"The switch sees -1.03 in. w.c., well past its -0.65 setpoint, and its contacts are still open. Replace it with the exact part number and setpoint, never a 'close enough' one.",
  hint:"Compare what the manometer reads to what the label says."})];
window.LESSON={id:"heat-ps",sec:"Heating",secHref:"/heating/",title:"Inducer and pressure switches",lead:"How the inducer makes draft, how the pressure switch proves it in inches of water column, and how to find why it won't close.",
 steps,see,tryIntro:"Find the limit in See it, then two service calls.",tasks,
 job:K.job({read:["The <b>setpoint on the switch label</b> (in. w.c.) and the part number.","Manometer reading at the switch, then at the port.","Voltage across the switch terminals with the inducer running: about 0 V closed, 24 V open.","On condensing furnaces: the trap, the drain line, and water in the hose."],
  table:[["Reading at the switch","What it means"],["Stronger than the setpoint, switch open","Bad switch"],["Weak at the switch, normal at the port","Cracked, loose or kinked hose"],["Weak at the port too","Vent, trap, collector box or inducer"],["Just at the setpoint","It will drop out on windy or icy days. Find out why"]],tableT:"Reading the manometer",
  steps:["Read the label and the flash code.","Tee the manometer in at the switch and start a call.","Compare to the setpoint.","If weak, move to the port; then look at the vent, the trap and the inducer.","After the fix, the reading should be well past the setpoint, not barely."],
  safety:["Never jumper a pressure switch. It is what keeps the burners off when flue gas can't get out.","A blocked vent with the furnace firing can spill carbon monoxide. Check the vent before you leave.","Use the exact replacement switch. A lower setpoint lets the furnace run with a vent that is half blocked."],
  mistakes:["Replacing the switch without measuring.","Forgetting the vent termination outside, especially after snow.","Blowing into the hose to 'test' it. You can damage the diaphragm.","Ignoring water in the hose on a condensing furnace."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["HVAC School: properly diagnosing a gas furnace pressure switch","https://hvacrschool.com/properly-diagnosing-a-gas-furnace-pressure-switch"],["Ferguson: furnace pressure switch troubleshooting guide","https://www.ferguson.com/content/ideas-and-learning-center/trade-talk/furnace-pressure-switch-troubleshooting-guide/"],["SupplyHouse: Lennox 0.65 in. w.c. SPST pressure switch","https://www.supplyhouse.com/Lennox-11U64-0-65-WC-Spst-Pressure-Switch"]]};
})();
