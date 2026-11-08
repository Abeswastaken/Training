/* ============ Lesson: Worst-case CAZ depressurization test ============ */
(()=>{
const FAN={k:350,b:80,d:150};
const model=S=>{const exh=(S.k?FAN.k:0)+(S.b?FAN.b:0)+(S.d?FAN.d:0),net0=Math.max(0,exh-S.mua),fanPa=CK.cazPa(net0,S.cfm),ahuPa=S.ahu?2.5:0,base=-S.base,worst=base-fanPa-ahuPa,net=worst-base,lim=CK.LIMITS[S.app][1];return {exh,net0,fanPa,ahuPa,base,worst,net,lim,pass:net>=lim-1e-9}};
const VB="0 0 720 460";
/* house section with fans, appliances, manometer to outdoors */
const house=(R,S,o={})=>{let s=`<path d="M20 70 L250 18 L480 70 Z" fill="#a89a85" opacity=".18" stroke="#8a7f70" stroke-width="3"/><rect x="20" y="70" width="460" height="282" fill="#a89a85" opacity=".07" stroke="#a89a85" stroke-width="2"/>`+CK.floor(352,10,710)+`<path d="M20 200 H480" stroke="#8a7f70" stroke-width="4"/><path d="M480 200 H710" stroke="#8a7f70" stroke-width="3" stroke-dasharray="8 4"/>`;
 s+=CK.L(30,190,"MAIN FLOOR",{a:"start",size:11})+CK.L(30,222,"BASEMENT (CAZ)",{a:"start",size:11})+CK.L(600,190,"OUTDOORS",{size:12});
 // kitchen hood
 s+=rBox(70,104,70,20,8,"al",{r:2})+`<path d="M70 124 L60 140 H150 L140 124 Z" fill="url(#r_chromeV)"/>`+CK.L(105,160,"HOOD 350",{size:11});
 if(S.k)s+=CK.arr("M105 104 V80 H20",CK.AIR);
 // bath fan
 s+=`<rect x="300" y="70" width="44" height="10" fill="url(#r_whiteH)" stroke="#9aa3a9"/>`+CK.L(322,100,"BATH FAN 80",{size:11});if(S.b)s+=CK.arr("M322 70 V40",CK.AIR);
 // dryer
 s+=rBox(40,276,64,76,12,"white",{r:3})+`<circle cx="72" cy="314" r="20" fill="url(#r_chromeV)"/><circle cx="72" cy="314" r="15" fill="#20262b"/>`+CK.L(72,266,"DRYER 150",{size:11});if(S.d)s+=CK.arr("M104 286 H128 V246 H20",CK.AIR);
 // furnace + water heater + chimney
 s+=CK.furnace(150,240,{w:76,h:112,hood:false,ind:false})+CK.wh(260,250,{w:44,h:100,hw:20});
 s+=CK.ventV(282,206,226,7)+CK.ventH(188,440,206,7)+CK.ventV(188,206,240,7)+`<rect x="436" y="18" width="34" height="334" fill="url(#zBrick)" stroke="#6b3a2a"/>`;
 if(o.spill||(!R.pass&&o.showSpill!==false))s+=CK.smoke(282,248,true,20);
 if(S.ahu)s+=CK.L(146,238,"RETURN LEAK",{a:"end",size:10,fill:"var(--bad)"})+CK.arr("M240 300 H226",CK.AIR);
 // make-up air
 if(S.mua>0)s+=CK.arr("M560 240 H490",CK.AIR)+CK.L(560,262,"MAKE-UP "+S.mua+" CFM",{size:11,a:"start"});
 // manometer
 s+=CK.mano(330,270,(R.worst>0?"+":"")+K.f1(R.worst),"",{w:90,unit:"PA"})+rHose("M420 296 C450 296 470 300 520 300","#2f6fd6",3)+CK.L(560,306,"HOSE TO OUTDOORS",{size:10,a:"start"});
 if(o.scale!==false)s+=CK.paScale(90,384,520,R.net,R.lim,{lbl:false})+CK.L(90,372,"NET (CORRECTED FOR BASELINE): "+K.f1(R.net)+" PA",{a:"start",size:12,fill:R.pass?"#2f8f3a":"var(--bad)"});
 return s};
const ex={cfm:2000,base:0.5,mua:0,app:2,k:false,b:false,d:false,ahu:false};
const steps=[
 {t:"Exhaust fans pull air from somewhere",
  body:`<p>The <b>combustion appliance zone (CAZ)</b> is the space where a vented gas or oil appliance lives and breathes, usually the basement or mechanical room.</p><p>Every exhaust fan pushes air <b>out</b> of the house: range hood, bath fans, the dryer. The same amount has to leak back <b>in</b>. In a tight house, the easiest way in may be <b>down the chimney</b>, right through the water heater's draft hood. The house goes <b>negative</b> and the chimney loses.</p>`,
  vb:VB,draw:()=>{const S={...ex,k:true,b:true,d:true,cfm:1500};return house(model(S),S,{scale:false,spill:true})+CK.arr("M453 60 V160",CK.FLUE)+CK.L(560,120,"AIR COMES DOWN",{size:12,fill:CK.FLUE})+CK.L(560,138,"THE CHIMNEY",{size:12,fill:CK.FLUE})}},
 {t:"1. Baseline",
  body:`<p>Set up a digital manometer reading the CAZ <b>with reference to outdoors</b>: a hose through a window or door gasket to the outside.</p><ul><li>Appliances off or set to pilot.</li><li>Exterior doors and windows closed, fireplace damper closed.</li><li>All fans off.</li></ul><p>Record the reading. This <b>baseline</b> is what wind and stack effect are already doing, often a pascal or so. You'll subtract it later.</p>`,
  vb:VB,draw:()=>{const S={...ex};return house(model(S),S,{scale:false})+`<rect x="520" y="330" width="190" height="56" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>`+CK.L(615,354,"BASELINE −0.5 PA",{size:14})+K.txt(615,376,"fans and appliances off")}},
 {t:"2. Set up the worst case",
  body:`<p>Now make the CAZ as negative as the house can make it:</p><ul><li>Turn on the <b>dryer and every exhaust fan</b>.</li><li>Close interior doors that make the CAZ <b>more</b> negative (try each one).</li><li>Run the furnace <b>air handler</b>; keep it on if the CAZ goes more negative (return leaks in the basement do that).</li></ul><p>Subtract the baseline: −6.0 − (−0.5) = <b>−5.5 Pa</b> worst-case depressurization.</p>`,
  math:`<p>Net worst case = worst-case reading − baseline. A baseline of −0.5 Pa and a worst-case reading of −6.0 Pa gives −5.5 Pa, the number you compare to the limit.</p><p>House physics in this lesson: pressure ≈ (net exhaust CFM ÷ C)<sup>1/0.65</sup> Pa, with C = CFM50 ÷ 50<sup>0.65</sup> from a blower door test.</p>`,
  vb:VB,draw:()=>{const S={...ex,k:true,b:true,d:true,ahu:true,cfm:3600};const R=model(S);return house(R,S,{showSpill:false})}},
 {t:"3. Compare to the limit",
  body:`<p>How much depressurization an appliance tolerates depends on how it's vented. Weak natural draft can't take much; sealed combustion doesn't care. These limits (Vermont code, following BPI):</p><ul><li>Atmospheric water heater: <b>−2 Pa</b></li><li>Furnace or boiler common-vented with a water heater: <b>−3 Pa</b></li><li>Natural-draft furnace or boiler alone: <b>−5 Pa</b></li><li>Induced-draft or power-vented alone: <b>−15 Pa</b></li><li>Sealed combustion (Category IV direct vent): <b>−50 Pa</b></li></ul><p>Use the limit for the <b>weakest</b> appliance in the zone.</p>`,
  draw:()=>{let s=K.txt(360,30,"Limit: worst-case depressurization the venting can take, Pa");const L=[["ATMOSPHERIC WATER HEATER",-2],["COMMON-VENTED FURNACE + WH",-3],["NATURAL-DRAFT FURNACE ALONE",-5],["INDUCED-DRAFT ALONE",-15],["SEALED COMBUSTION",-50]];
   L.forEach(([t,v],i)=>{const y=60+i*58,w=Math.min(400,Math.abs(v)/15*300);s+=CK.L(300,y+26,t,{a:"end",size:13})+`<rect x="314" y="${y+6}" width="${w}" height="30" rx="4" fill="${v>-4?"#c0392b":v>-10?"#9a6f1f":"#2f8f3a"}" opacity=".85"/>`+CK.L(314+w-8,y+27,v+" PA"+(v===-50?" (NOT TO SCALE)":""),{a:"end",fill:"#fff",size:13})});
   return s+K.txt(360,360,"−5.5 Pa fails a water heater and a common vent, and fails even a furnace alone.")}},
 {t:"4. Spillage, draft and CO under worst case",
  body:`<p>Leave the house in worst case and fire the appliances, <b>smallest Btu first</b>:</p><ul><li><b>Spillage</b>: smoke or a mirror at the draft hood. Spilling that goes on <b>past 60 seconds</b> fails.</li><li><b>CO</b>: undiluted flue sample at about the <b>10-minute</b> mark.</li><li><b>Draft</b>: in the connector, if spillage stopped in time.</li></ul><p>Then fire everything together and test again. Then turn the fans off and repeat under <b>natural conditions</b>. Watch room CO the whole time: <b>over 35 ppm</b> in the breathing zone, stop, shut it down and ventilate.</p>`,
  draw:()=>{let s=CK.floor(352)+CK.wh(180,170,{w:90,h:180,hw:40})+CK.ventV(225,40,138,12)+CK.smoke(225,168,true,40);
   s+=`<g transform="translate(540 110)"><rect x="-8" y="-56" width="16" height="12" rx="3" fill="url(#r_chromeH)"/><circle r="48" fill="url(#r_blackV)"/><circle r="40" fill="url(#zLcd)"/><text y="8" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="22" font-weight="600" fill="#b3261e">75 s</text></g>`;
   s+=CK.L(540,186,"STILL SPILLING AFTER 60 S",{fill:"var(--bad)",size:13})+CK.L(540,206,"= FAIL",{fill:"var(--bad)",size:13})+CK.analyzer(560,240,[["CO","38 ppm"],["10 MIN","OK"]],{w:140,h:100})+CK.co(268,150,320,90,"SMOKE PUSHED OUT",{a:"start"});return s}},
 {t:"5. What the results mean",
  body:`<p>Combine CO and spillage (Vermont table, BPI style; take the CO undiluted, and many programs use air-free):</p><ul><li>CO <b>0 to 25 ppm</b> and passes: go ahead.</li><li><b>25 to 100</b>: recommend service; fails worst case only: service call.</li><li><b>100 to 400</b>, or it fails under natural conditions: <b>stop</b> until it's fixed.</li><li><b>Over 400 and spilling</b>: emergency. Shut off the fuel.</li></ul><p>Fixes for depressurization: <b>make-up air</b>, smaller or interlocked exhaust, seal return leaks in the CAZ, or replace with sealed combustion.</p>`,
  draw:()=>{const r=[["0 TO 25","PASSES","GO AHEAD","#2f8f3a"],["25 TO 100","PASSES","RECOMMEND SERVICE","#9a6f1f"],["25 TO 100","FAILS WORST CASE","SERVICE CALL","#9a6f1f"],["100 TO 400","OR FAILS NATURAL","STOP: FIX FIRST","#c0392b"],["OVER 400","SPILLS ANY TIME","SHUT OFF FUEL","#8b1a12"]];
   let s=CK.L(110,40,"CO PPM",{size:13})+CK.L(330,40,"SPILLAGE / DRAFT",{size:13})+CK.L(570,40,"ACTION",{size:13});r.forEach(([a,b,c,col],i)=>{const y=58+i*56;s+=`<rect x="30" y="${y}" width="660" height="48" rx="6" fill="${col}" opacity=".12"/><rect x="30" y="${y}" width="8" height="48" rx="3" fill="${col}"/>`+CK.L(110,y+30,a,{size:14})+CK.L(330,y+30,b,{size:13})+CK.L(570,y+30,c,{size:14,fill:col})});
   return s+K.txt(360,358,"Room CO over 35 ppm at any point: stop the test, shut down and ventilate.")}}];
const see=K.see({vb:VB,init:{cfm:2000,base:0.5,mua:0,app:0,k:true,b:false,d:true,ahu:false},
 sliders:[["cfm","House leakage (blower door)",800,5000,100,v=>v+" CFM50"],["base","Baseline reading",0,3,0.5,v=>v?"−"+K.f1(v)+" Pa":"0 Pa"],["mua","Make-up air",0,500,25,v=>v+" CFM"],["app","Appliances in the CAZ",0,5,1,v=>CK.LIMITS[v][0]]],
 checks:[["k","Kitchen hood (350 CFM)"],["b","Bath fan (80 CFM)"],["d","Dryer (150 CFM)"],["ahu","Air handler running, return leaks in the CAZ"]],
 model,draw:(R,S)=>house(R,S),
 reads:R=>[["Exhaust running",R.exh+" CFM"],["Worst-case reading",K.f1(R.worst)+" Pa"],["Baseline",K.f1(R.base)+" Pa"],["Net depressurization",K.f1(R.net)+" Pa",!R.pass],["Limit",R.lim+" Pa"],["Result",R.pass?"passes":"fails",!R.pass]],
 note:(R,S)=>R.pass?(R.net<R.lim/2?"Passes, but closer than half the limit. Retest spillage and CO under worst case anyway.":"Passes the depressurization limit. Still do the spillage, draft and CO tests."):`Fails: ${K.f1(R.net)} Pa is more negative than ${R.lim} Pa. Add make-up air, cut exhaust, ${S.ahu?"seal the return leaks, ":""}or switch to sealed-combustion equipment.`,
 log:[["CFM50",(R,S)=>S.cfm],["Exh",R=>R.net0],["Net",R=>K.f1(R.net)],["Limit",R=>R.lim],["",R=>R.pass?"pass":"fail"]]});
const tasks=[
 K.goal({t:"Make-up air for a tight house",intro:"<b>1,500 CFM50</b> house, baseline 0, atmospheric <b>water heater</b>. Kitchen hood, bath fan and dryer all on, air handler off. Find the <b>least</b> make-up air that passes.",
  check:(S,R)=>S.cfm!==1500||S.base!==0?"Set 1,500 CFM50 and a 0 baseline.":S.app!==0?"Pick the atmospheric water heater.":!(S.k&&S.b&&S.d)||S.ahu?"All three fans on, air handler off.":!R.pass?`${K.f1(R.net)} Pa: still too negative.`:model({...S,mua:S.mua-25}).pass?"Passes, but less make-up air would too.":true,
  ok:(S,R)=>`${S.mua} CFM of make-up air leaves ${R.net0} CFM of net exhaust: ${K.f1(R.net)} Pa. A 580 CFM exhaust load in a tight house needs a real make-up air plan.`}),
 K.goal({t:"Baseline and the weakest appliance",intro:"<b>2,400 CFM50</b> house with a <b>−1.5 Pa</b> baseline. Kitchen hood and dryer on, bath fan and air handler off, no make-up air. Pick the <b>strictest</b> appliance setup that still passes.",
  check:(S,R)=>S.cfm!==2400||S.base!==1.5?"Set 2,400 CFM50 and a −1.5 Pa baseline.":!S.k||!S.d||S.b||S.ahu||S.mua?"Hood and dryer only, no make-up air.":!R.pass?`${CK.LIMITS[S.app][0]} fails at ${K.f1(R.net)} Pa.`:R.lim!==-5?"That passes, but a stricter setup passes too.":true,
  ok:(S,R)=>`The gauge reads ${K.f1(R.worst)} Pa, but the net is ${K.f1(R.net)} Pa after the baseline. A furnace alone (−5) passes; add a water heater on the same vent and the limit becomes −3, a fail.`}),
 K.caseTask({t:"Service call: fails only with the furnace running",intro:"Worst-case test on a common-vented furnace and water heater. Fans alone barely move the gauge, but it fails once the furnace blower starts.",vb:VB,
  state:{cfm:2600,base:0.5,mua:0,app:1,k:false,b:false,d:true,ahu:true},model,draw:(R,S)=>house(R,S),
  reads:()=>{const g=o=>model({cfm:2600,base:0.5,mua:0,app:1,k:false,b:false,ahu:false,d:false,...o}).net;return [["Dryer on",K.f1(g({d:true}))+" Pa"],["Dryer + air handler",K.f1(g({d:true,ahu:true}))+" Pa",true],["Limit (common vent)","−3 Pa"],["Spillage, worst case","70 s",true]]},
  actions:[["Look at the furnace and return",()=>"The return plenum has open seams and a panned joist return is open to the basement."],["Look at the chimney cap",()=>"Clear."]],
  causes:[["ret","Return duct leaks in the CAZ"],["dry","Dryer exhaust too big"],["chim","Blocked chimney"],["base","Wrong baseline"]],ans:"ret",
  why:"The blower pulls basement air into leaky returns and ships it upstairs, pulling the CAZ negative. The dryer alone barely moves it. Seal the return in the CAZ and retest.",hint:"Which single change makes it fail?"})];
window.LESSON={id:"comb-caz",sec:"Combustion and gas",secHref:"/combustion/",title:"Worst-case CAZ depressurization test",lead:"Measure a baseline, turn on every fan, compare the basement pressure to the venting limit, then test spillage, draft and CO under worst case.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>CAZ pressure vs outdoors</b> in pascals: baseline and worst case.","<b>Spillage</b> time at each draft hood.","<b>Flue CO</b> at 10 minutes, and <b>room CO</b> the whole time.","<b>Draft</b> in each connector."],
  table:[["Venting","Limit"],["Atmospheric water heater","−2 Pa"],["Furnace or boiler common-vented with a water heater","−3 Pa"],["Furnace or boiler alone; fan-assisted common-vented","−5 Pa"],["Induced-draft or power-vented alone","−15 Pa"],["Sealed combustion, direct vent","−50 Pa"]],tableT:"Depressurization limits (Vermont RBES, BPI style)",
  steps:["Baseline: appliances off, exterior doors and windows closed, fans off. Record CAZ vs outdoors.","Worst case: dryer and all exhaust fans on, close interior doors that make it worse, air handler on if it makes it worse.","Net = worst-case reading minus baseline. Compare to the limit.","Fire the smallest appliance first: spillage (60 s), CO at 10 minutes, draft. Then all appliances together.","Repeat spillage, CO and draft under natural conditions (fans off).","Return the house to how you found it."],stepsT:"Test sequence",
  safety:["Monitor room CO the whole test. Over 35 ppm: stop, shut the appliances down and ventilate.","CO over 400 ppm and spilling: shut off the fuel and call for service now.","Don't leave a house that fails worst-case spillage without telling the owner and writing it up."],
  mistakes:["Forgetting to subtract the baseline.","Not checking each interior door and the air handler.","Testing spillage before the vent is warm, or giving up before 60 seconds.","Fixing the house's tightness without checking the appliances that depended on its leaks."]}),
 sources:[["The Engineering Mindset: supermarket ventilation basics (exhaust and supply keep building pressure)","https://theengineeringmindset.com/supermarket-ventilation-system-basics/"],["Vermont RBES Appendix RA: worst-case CAZ procedure, depressurization limits, CO action levels","https://www.efficiencyvermont.com/Media/Default/docs/trade-partners/code-support/2020-RBES-Appendix-RA_CAZ.pdf"],["ACHR News: tight homes can affect combustion appliances (NFPA 54 test, depressurization limits)","https://www.achrnews.com/articles/98579-gamazine-tight-homes-can-affect-combustion-appliances"],["HVAC School: what to do with your micro manometer (CAZ in pascals, 1 Pa = 0.004 in. w.c.)","https://hvacrschool.com/what-to-do-with-your-micro-manometer"]]};
})();
