/* ============ Lesson: Reading a ladder diagram ============ */
(()=>{
const steps=[
 {t:"Two rails and the rungs between them",
  body:`<p>A <b>ladder diagram</b> draws a control circuit like a ladder standing up.</p><ul><li>The two side posts are the <b>rails</b>. The left one is the hot leg (<b>L1</b>, or <b>R</b> on 24 V). The right one is the other leg (<b>L2</b> or neutral, or <b>C</b> on 24 V).</li><li>Each step across is a <b>rung</b>. Every rung is its own path from one rail to the other.</li></ul><p>Because every rung touches both rails, every rung gets the full supply voltage. The rungs are in <b>parallel</b>.</p>`,
  draw:()=>{let s=LD.rails(150,560,60,330,{l:"L1",r:"L2",live:true});
   s+=LD.rung({x1:150,x2:560,y:110,parts:[{k:"sw",lbl:"SWITCH",closed:true},{k:"lamp",lbl:"LIGHT"}],live:true,num:1}).s;
   s+=LD.rung({x1:150,x2:560,y:200,parts:[{k:"sw",lbl:"SWITCH",closed:false},{k:"coil",tag:"CR"}],live:true,num:2}).s;
   s+=LD.rung({x1:150,x2:560,y:290,parts:[{k:"ps",lbl:"PRESS SW",closed:true},{k:"motor",lbl:"MOTOR"}],live:true,num:3}).s;
   s+=LD.co(150,240,70,240,"RAIL (HOT)",{a:"end"})+LD.co(560,240,640,240,"RAIL",{a:"start"})+LD.co(360,200,400,160,"RUNG",{a:"start"})+LD.co(118,290,100,334,"RUNG NUMBER",{a:"end"});
   s+=K.tag(360,368,"RED = ENERGIZED (HAS VOLTAGE FROM L1)",{fill:LD.HOT,w:330});return s}},
 {t:"Switches on the left, the load on the right",
  body:`<p>Each rung reads left to right like a sentence:</p><ul><li><b>Switches and contacts</b> go on the left: thermostat contacts, pressure switches, limits, relay contacts. They don't use power. They pass it or block it.</li><li>The <b>load</b> goes on the right, next to the right rail: a coil, motor, heater, light or gas valve. Loads use the power.</li></ul><p>Switches in a row are in <b>series</b>: every one must be closed for the load to run. That's why safeties sit in a line in front of the coil.</p>`,
  draw:()=>{let s="";const y=290;
   s+=`<g transform="translate(70 70)">${zTstat(0,0,70,90,"ldT1","ldT1l","74")}</g>`+LD.L(105,190,"THERMOSTAT",{size:12});
   s+=`<g transform="translate(225 92) scale(2)">${zPswitch(0,0,"ldP1")}</g>`+`<rect x="247" y="140" width="5" height="40" fill="url(#zCuV)"/>`+LD.L(250,190,"HIGH PRESSURE",{size:12})+LD.L(250,206,"SWITCH",{size:12});
   s+=`<g transform="translate(350 82) scale(1.7)">${zPswitch(0,0,"ldP2")}</g>`+`<rect x="369" y="122" width="5" height="58" fill="url(#zCuV)"/>`+LD.L(372,190,"LOW PRESSURE",{size:12})+LD.L(372,206,"SWITCH",{size:12});
   s+=zContactor(530,60,80,110,"ldCb","ldCl",100)+LD.L(570,190,"CONTACTOR",{size:12})+LD.L(570,206,"(ITS COIL)",{size:12});
   s+=LD.rails(40,690,236,330,{l:"R",r:"C",live:true});
   const g=LD.rung({x1:40,x2:690,y,parts:[{k:"sw",lbl:"T'STAT Y",closed:true},{k:"ps",lbl:"HPS",closed:true},{k:"ps",lbl:"LPS",closed:true},{k:"coil",tag:"C"}],live:true,sw:120,lw:100,pad:30});
   s+=g.s+`<path d="M105 214 L${g.ends[0][0]+60} 270 M250 214 L${g.ends[1][0]+60} 270 M372 214 L${g.ends[2][0]+60} 270 M570 214 L${g.ends[3][0]+50} 270" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/>`;
   s+=K.tag(220,368,"SWITCHES: PASS OR BLOCK",{w:220})+K.tag(600,368,"LOAD",{fill:LD.HOT,w:70});return s}},
 {t:"One load per rung",
  body:`<p>Never put two loads in series on one rung. Each 24 V coil is built to get the full 24 V.</p><ul><li><b>In series</b>, two equal coils split the voltage: about 12 V each. Neither pulls in, or they chatter.</li><li><b>In parallel</b> (each on its own rung), each coil gets the full 24 V.</li></ul><p>So if you see two loads, look for two rungs. If a diagram seems to show two loads in a row, one of them is really a switch or a contact.</p>`,
  math:`<p>Two equal coils, each impedance Z, in series on 24 V: current I = 24 / (2Z), so each gets I × Z = 12 V.</p><p>On separate rungs, each coil sits right across the rails: 24 V each.</p>`,
  draw:()=>{let s=K.lbl(190,40,"WRONG: TWO LOADS IN SERIES",{fill:"var(--bad)"})+K.lbl(540,40,"RIGHT: ONE LOAD PER RUNG",{fill:"var(--ok)"});
   s+=LD.rails(30,350,80,200,{l:"R",r:"C",live:true});
   const r=LD.series(24,[{r:0.05},{r:18,x:94},{r:18,x:94}]);
   s+=LD.rung({x1:30,x2:350,y:140,parts:[{k:"sw",lbl:"T'STAT",closed:true},{k:"none"},{k:"coil",tag:"CR1"}],live:true,sw:90}).s;
   s+=`<circle cx="190" cy="140" r="17" fill="var(--paper)" stroke="${LD.HOT}" stroke-width="3"/>`+LD.T(190,144,"CR2",{size:12});
   s+=K.tag(190,250,`${K.f1(r.drop[1])} V EACH`,{fill:"var(--bad)",w:140})+LD.L(190,280,"NEITHER COIL PULLS IN",{size:12,fill:"var(--bad)"});
   s+=LD.rails(390,690,80,250,{l:"R",r:"C",live:true});
   s+=LD.rung({x1:390,x2:690,y:130,parts:[{k:"sw",lbl:"T'STAT",closed:true},{k:"coil",tag:"CR1"}],live:true,sw:90}).s;
   s+=LD.rung({x1:390,x2:690,y:210,parts:[{k:"sw",lbl:"T'STAT",closed:true},{k:"coil",tag:"CR2"}],live:true,sw:90}).s;
   s+=K.tag(540,300,"24.0 V EACH",{fill:"var(--ok)",w:130})+LD.L(540,330,"BOTH COILS PULL IN",{size:12,fill:"var(--ok)"});return s}},
 {t:"Rung numbers and cross-references",
  body:`<p>A relay has a <b>coil</b> on one rung and <b>contacts</b> on other rungs. They share a name, like <b>CR</b>.</p><ul><li>The <b>line number</b> on the left of each rung lets you talk about it: "rung 6".</li><li>The numbers on the right of a coil's rung are the <b>cross-reference</b>: the rungs where that coil's contacts are.</li><li>A plain number is a <b>normally open</b> contact. An <u>underlined</u> number is <b>normally closed</b>.</li></ul><p>Here CR on rung 6 says <b>1, 2, <u>3</u></b>: open contacts on rungs 1 and 2, a closed one on rung 3.</p>`,
  vb:"0 0 720 400",
  draw:()=>{const S={call:0},R=LD.acModel(S);let s=LD.acLadder(R,S,{hlr:[1,2,3,6],x2:590});
   s+=LD.co(626,317,660,350,"CROSS-REF",{a:"end",dy:22});return s}},
 {t:"Line voltage and 24 V on one page",
  body:`<p>Most HVAC diagrams have two ladders:</p><ul><li>A <b>line voltage</b> ladder (240 V, L1 and L2) with the motors and heaters.</li><li>A <b>24 V</b> ladder (R and C) with the thermostat, safeties and coils. The <b>control transformer</b> T1 is a load on the line ladder and the power source for the 24 V ladder.</li></ul><p>Read it the way the power flows: thermostat closes on the 24 V side, a coil pulls in, and its contacts close loads on the line side. Here the thermostat calls for cooling: CR and FR pull in, the compressor, outdoor fan and blower run, and the crankcase heater drops out.</p>`,
  vb:"0 0 720 400",
  draw:()=>{const S={call:2},R=LD.acModel(S);let s=LD.acLadder(R,S,{x2:590});
   s+=LD.co(560,62,640,40,"COMPRESSOR",{a:"start"})+LD.co(565,150,640,170,"HEATER OFF",{a:"start"});return s}}];
/* ---------- See it ---------- */
const CALL=["Off","Fan only (G)","Cool (Y + G)"],FOL=["None","CR","FR"];
const model=S=>LD.acModel(S);
const see=K.see({vb:"0 0 720 400",init:{call:2,fol:0,hps:false,lps:false},
 sliders:[["call","Thermostat",0,2,1,v=>CALL[v]],["fol","Follow a coil",0,2,1,v=>FOL[v]]],
 checks:[["hps","High pressure switch tripped (open)"],["lps","Low pressure switch tripped (open)"]],
 model,draw:(R,S)=>{const hlr=S.fol===1?[1,2,3,6]:S.fol===2?[4,7]:[];return LD.acLadder(R,S,{hlr,x2:590})},
 reads:(R,S)=>{const open=!R.Y?"thermostat Y":!R.hps?"HPS":!R.lps?"LPS":"";return [["CR coil (rung 6)",R.CR?"pulled in":"out"],["FR coil (rung 7)",R.FR?"pulled in":"out"],["Compressor",R.comp?"running":"off"],["Outdoor fan",R.ofm?"running":"off"],["Crankcase heater",R.cch?"on":"off"],["Indoor blower",R.ibm?"running":"off"],["Rung 6 stops at",R.CR?"(complete)":open,R.Y&&!R.CR]]},
 note:(R,S)=>S.fol===1?"CR's cross-reference is 1, 2, <u>3</u>: two open contacts (compressor, outdoor fan) and one closed contact (crankcase heater). When CR pulls in, all three change state at once.":S.fol===2?"FR's cross-reference is 4: one open contact that runs the indoor blower.":R.Y&&!R.CR?"The thermostat calls, but a safety in series is open. Rung 6 is dead past that switch, so CR drops out and its contacts go back to normal: compressor off, heater on. The blower still runs: it's on its own rung.":"",
 log:[["Stat",(R,S)=>["off","fan","cool"][S.call]],["Trip",(R,S)=>S.hps?"HPS":S.lps?"LPS":"none"],["CR",R=>R.CR?"in":"out"],["Comp",R=>R.comp?"on":"off"],["Blower",R=>R.ibm?"on":"off"]]});
/* ---------- Try it ---------- */
const causes=[["hps","High pressure switch open"],["frcoil","FR coil open"],["burnt","CR contact on rung 1 burnt open"],["comp","Compressor winding open"],["t1","Transformer dead"]];
const cs=(o)=>K.caseTask({t:o.t,intro:o.intro,vb:"0 0 720 400",state:o.state,model:S=>{const R=LD.acModel(S);if(S.frdead){R.FR=false;R.ibm=false}return R},draw:(R,S)=>LD.acLadder(R,S,{x2:590,paper:true}),
 reads:R=>[["Thermostat","calling cool"],["Compressor",R.comp?"running":"off"],["Outdoor fan",R.ofm?"running":"off"],["Crankcase heater",R.cch?"warm":"cold"],["Indoor blower",R.ibm?"running":"off"]],actions:o.act,causes,ans:o.ans,why:o.why,hint:o.hint});
const tasks=[
 K.goal({t:"Run a cooling call",intro:"Set the thermostat to <b>Cool</b> with no safeties tripped. Get the compressor, outdoor fan and blower running with the crankcase heater off.",
  check:(S,R)=>S.call!==2?"Set the thermostat to Cool (Y + G).":!R.CR?"CR isn't pulled in. Is a safety open?":R.comp&&R.ofm&&R.ibm&&!R.cch?true:"Not all loads are right yet.",ok:"Y closed rung 6, CR pulled in, and its contacts on rungs 1, 2 and 3 all changed state together."}),
 K.goal({t:"Trip a safety during cooling",intro:"Keep the cooling call on and open the <b>high pressure switch</b>. The compressor must stop, the heater must come on, and the blower must keep running.",
  check:(S,R)=>S.call!==2?"Keep the thermostat on Cool.":!S.hps?"Trip the high pressure switch.":R.comp?"The compressor is still running.":R.ibm&&R.cch?true:"Check the blower and heater.",ok:"HPS is in series with the CR coil only. FR is on its own rung, so the blower keeps running. That's one load per rung at work."}),
 cs({t:"Service call: outdoor fan runs, compressor doesn't",intro:"Thermostat calling for cooling. The outdoor fan spins, the blower runs, the compressor is silent and the crankcase heater is cold.",state:{call:2,burnt:true},
  act:[["Measure voltage across the CR contact on rung 1",()=>"240 V across the contact. A closed contact should read about 0 V."],["Check the CR contact on rung 2",()=>"0 V across it: closed, and the fan runs."]],
  ans:"burnt",why:"The fan runs and the heater is off, so CR is pulled in. Only the rung 1 contact failed: full voltage across a contact means it's open.",hint:"The outdoor fan runs. What does that tell you about the CR coil?"}),
 cs({t:"Service call: blower runs, outdoor unit dead",intro:"Thermostat calling for cooling. The blower runs. Nothing runs outdoors and the crankcase heater is warm.",state:{call:2,hps:true},
  act:[["Measure 24 V at the CR coil",()=>"0 V across the CR coil."],["Measure across each switch on rung 6",()=>"Y: 0 V. HPS: 24 V. LPS: 0 V."]],
  ans:"hps",why:"The heater is warm, so CR is out, but the blower runs, so the transformer is fine. The 24 V reading across HPS means it's the open switch. Now find out why the head pressure tripped it.",hint:"FR on rung 7 works. What on rung 6 could keep CR out?"})];
window.LESSON={id:"lad-read",sec:"Ladder Builder",secHref:"/ladder/",title:"Reading a ladder diagram",lead:"Rails, rungs, switches on the left, one load on the right, and the numbers that tie a relay coil to its contacts.",
 steps,see,tryIntro:"Two setups in See it, then two service calls. The service calls show the printed diagram (coils off), the way it looks on the unit's panel door.",tasks,
 job:K.job({read:["<b>The legend</b>: every maker uses its own abbreviations (CR, FR, IBM, OFM, CCH). They're printed on the diagram.","<b>Rung numbers</b> on the left and <b>cross-references</b> on the right of each coil.","<b>Terminal numbers</b> printed beside parts: they match the numbers stamped on the real part.","<b>Wire numbers</b> (often circled): every point that's electrically the same carries the same number."],
  table:[["You see","It means"],["Number beside a coil, plain","An open contact of that coil on that rung"],["Number beside a coil, underlined","A closed contact of that coil on that rung"],["Two loads in a row on one rung","Re-read it: one is really a contact or switch"],["Dashed box around parts","Parts inside one device (a board, a thermostat)"],["Dashed line between contacts","Contacts moved together mechanically"]],tableT:"Reading cues",
  steps:["Find the power source of each ladder: line voltage at the top, the transformer feeding the 24 V side.","Find the load that isn't working and its rung.","Read that rung left to right: every switch in front of the load must be closed.","If the load is a coil, follow its cross-reference to the contacts it should be closing.","Only then pick up your meter."],stepsT:"Using the diagram on a call",
  safety:["The line voltage ladder is live even when the thermostat is off. Treat every rail as hot until you've proven it dead.","Diagrams show contacts in their <b>de-energized</b> state. What you see on the paper is not what a running unit looks like."],
  mistakes:["Reading a closed contact on paper as \"closed now\". Paper shows the coil off.","Missing the underline on a cross-reference and looking for an open contact that's really closed.","Jumping a safety because it's \"in the way\" on the rung. It's in series on purpose."]}),
 sources:[["The Engineering Mindset: how relays work","https://theengineeringmindset.com/how-relays-work/"],["EC&M: electrical ladder drawing basics","https://www.ecmweb.com/basics/article/20897064/electrical-ladder-drawing-basics"],["ACHR News: reading ladder diagrams","https://www.achrnews.com/articles/110635-ice-breaker-reading-ladder-diagrams"],["All About Circuits: ladder diagrams","https://www.allaboutcircuits.com/textbook/digital/chpt-6/ladder-diagrams/"]]};
})();
