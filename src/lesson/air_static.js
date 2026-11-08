/* ============ Lesson: Static pressure and TESP ============ */
(()=>{
const D={merv:8,load:1,deep:false,ret:18,coil:1,wet:true,regs:0,tap:4};
const st=o=>AK.stat({...D,...o});
const R0=st({});
const band=t=>t<=0.40?["good, with headroom","var(--ok)"]:t<=0.50?["at the 0.5 in. rating","#9a6f1f"]:t<=0.70?["over the rating: restricted","var(--bad)"]:["badly restricted","var(--bad)"];
/* U-tube manometer on a duct */
const uTube=()=>{let s=AK.duct("M30 150 H400",70,"url(#zSteelH)")+AK.air("M40 150 H392",70)+AK.aarrow("M120 150 h60",70)+K.lbl(110,104,"SUPPLY DUCT",{a:"start",size:13});
 s+=`<rect x="186" y="118" width="16" height="10" fill="#555"/>`+AK.port(194,115,"");
 s+=`<path d="M194 112 C194 40 520 40 520 96" fill="none" stroke="#2b6fbf" stroke-width="4"/>`;
 /* board and glass tube */
 s+=`<rect x="470" y="60" width="180" height="290" rx="8" fill="url(#zTan)" stroke="#7d6b45"/>`;
 const zero=230,px=24;          // px per inch of water
 for(let i=-4;i<=4;i++){const y=zero-i*px;s+=`<path d="M582 ${y} h${i%2?8:16}" stroke="#3a2a00" stroke-width="1.4"/>`}
 const lvlL=zero+0.25*px*4,lvlR=zero-0.25*px*4;    // 0.5 in. difference drawn 4x for clarity
 s+=`<path d="M520 96 V310 Q520 334 544 334 Q568 334 568 310 V80" fill="none" stroke="#cfd8dc" stroke-width="14" stroke-linecap="round"/>`;
 s+=`<path d="M520 ${lvlL} V310 Q520 334 544 334 Q568 334 568 310 V${lvlR}" fill="none" stroke="#3f8fd6" stroke-width="9"/>`;
 s+=`<path d="M520 96 V310 Q520 334 544 334 Q568 334 568 310 V80" fill="none" stroke="#fff" stroke-width="2" opacity=".55" transform="translate(-3 0)"/>`;
 s+=`<path d="M500 ${lvlL} H520 M500 ${lvlR} H568" stroke="#c0392b" stroke-width="2" stroke-dasharray="3 3"/>`+K.arrow(`M494 ${lvlL} V${lvlR+4}`,"#c0392b",2)+K.arrow(`M494 ${lvlR} V${lvlL-4}`,"#c0392b",2);
 s+=K.lbl(486,(lvlL+lvlR)/2+5,"0.5 IN.",{a:"end",size:13,fill:"#c0392b"})+K.lbl(568,72,"OPEN",{size:12})+K.lbl(612,348,"",{});
 s+=K.txt(250,262,"the duct pushes the water down one leg")+K.txt(250,284,"0.5 in. of water = 0.018 psi = 125 Pa")+K.txt(250,306,"(drawn 4 times taller here so you can see it)");
 return s};
/* blower table built from the lesson's blower curve, like the one in the furnace manual */
const table=()=>{let s=`<rect x="20" y="20" width="400" height="340" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(36,46,"BLOWER PERFORMANCE, CFM",{a:"start",size:14});
 const cols=[4,3,2,1],x=[90,170,250,330,400];s+=K.txt(56,74,"ESP")+cols.map((t,i)=>K.txt(x[i]+40,74,AK.TAPN[t])).join("");
 for(let k=1;k<=9;k++){const sp=k/10,y=72+k*28;const hi=k===5;if(hi)s+=`<rect x="28" y="${y-20}" width="384" height="28" rx="4" fill="#c08a1f" opacity=".16"/>`;
  s+=`<text x="56" y="${y}" class="lsG" style="font-family:var(--mono);font-size:14px;fill:var(--ink)">${sp.toFixed(1)}</text>`;
  cols.forEach((t,i)=>{const r=AK.TAPS[t],v=r*r*AK.FAN.s0-sp;s+=`<text x="${x[i]+40}" y="${y}" class="lsG" style="font-family:var(--mono);font-size:14px;fill:var(--ink)">${v>0.02?Math.round(Math.sqrt(v/AK.FAN.b)/5)*5:"—"}</text>`})}
 s+=K.txt(220,350,"ESP = external static pressure, in. w.c.");
 /* range bar */
 const bx=470,by=40,bh=290,Y=v=>by+bh-v/1.0*bh;
 [[0,0.4,"var(--ok)","GOOD"],[0.4,0.5,"#c08a1f","AT RATING"],[0.5,0.7,"var(--bad)","OVER"],[0.7,1.0,"#8a1f14","RESTRICTED"]].forEach(([a,b,c,l])=>{s+=`<rect x="${bx}" y="${Y(b)}" width="40" height="${Y(a)-Y(b)}" fill="${c}" opacity=".55"/>`+K.lbl(bx+52,(Y(a)+Y(b))/2+5,l,{a:"start",size:13,fill:c})});
 for(let v=0;v<=1.0001;v+=0.1)s+=K.txt(bx-8,Y(v)+5,v.toFixed(1),{a:"end"});
 s+=`<rect x="${bx}" y="${by}" width="40" height="${bh}" fill="none" stroke="var(--muted)"/>`+K.lbl(bx,by-14,"TESP, IN. W.C.",{a:"start",size:13});
 return s};
const steps=[
 {t:"Static pressure is the blower's push",body:`<p>The blower pushes air into the supply ducts and pulls it out of the return ducts. The push and pull are very small pressures, so we measure them in <b>inches of water column</b> (in. w.c.): how far that pressure would lift water in a tube.</p><p>Pressure that presses out on the duct walls (not the speed of the air) is <b>static pressure</b>. On the supply side it's above room pressure (+). On the return side it's below (−).</p><p class="lsKey">1 in. w.c. is only 0.036 psi. A whole house duct system runs on about half of that.</p>`,
  math:`<p>1 in. w.c. = 0.0361 psi = 249 Pa. So 0.5 in. w.c. = 0.018 psi = 125 Pa.</p><p>That's why you need a digital manometer that reads to 0.01 in. w.c. A refrigeration gauge can't see it.</p>`,
  draw:uTube},
 {t:"Total external static: add the two sides",body:`<p>The furnace maker rates the blower against everything <b>outside</b> the cabinet: filter, add-on coil, ducts, registers and grilles. The total resistance it feels is the <b>total external static pressure</b> (TESP).</p><p>Read the return side between the filter and the blower (<b>P2</b>) and the supply side between the furnace and the coil (<b>P3</b>). Ignore the signs and add them:</p><p class="lsKey">TESP = |return static| + supply static = |${AK.f2s(R0.p[1])}| + ${R0.p[2].toFixed(2)} = ${R0.tesp.toFixed(2)} in. w.c.</p><p>Put the supply hose on the <b>+</b> port and the return hose on the <b>−</b> port and the manometer reads the sum directly.</p>`,
  draw:()=>AK.equip(R0,{ports:[1,2],mano:[2,1],manoLab:"TESP in. w.c."})},
 {t:"Compare it to the rating",body:`<p>Most residential furnaces and air handlers are rated for <b>0.5 in. w.c.</b> TESP. Some high-static models are rated 0.7 or 0.8: check the manual.</p><p>The blower table in the manual shows how much air each speed moves at each static. Find your measured TESP and your speed tap and read the airflow. Here, 0.5 in. on high is about ${Math.round(Math.sqrt((AK.FAN.s0-0.5)/AK.FAN.b)/5)*5} CFM.</p><ul><li>Up to 0.40: good, with room to spare.</li><li>0.41 to 0.50: at the limit.</li><li>Over 0.50: the ducts or parts are restricting the air.</li></ul>`,
  draw:table},
 {t:"Where the ports go",body:`<p>Drill 3/8 in. holes and plug them with test port caps when you're done.</p><ul><li><b>P1</b>: return duct, before the filter.</li><li><b>P2</b>: between the filter and the blower.</li><li><b>P3</b>: between the furnace and the add-on coil.</li><li><b>P4</b>: in the supply plenum above the coil.</li></ul><p>Point the static tip into the airflow. If the only supply port is above the coil (P4), add the coil's drop from the coil maker's data to get the same TESP.</p><p>On an air handler with the coil inside, read just before and just after the cabinet.</p>`,
  draw:()=>AK.equip(R0,{vals:false})},
 {t:"Find the restriction: drop across each part",body:`<p>The difference across one part is its <b>pressure drop</b>:</p><ul><li><b>Filter drop</b> = P1 − P2. A clean 1-inch MERV 8 is about 0.10 in. at 1200 CFM; a loaded one can be two or three times that.</li><li><b>Coil drop</b> = P3 − P4. A clean, right-sized coil is about 0.10 to 0.25 in.</li><li>What's left (P1 and P4) is the duct system itself.</li></ul><p>Here the filter is loaded with dust. The manometer across it reads ${(st({load:3.2}).fdrop).toFixed(2)} in.</p>`,
  draw:()=>{const R=st({load:3.2});return AK.equip(R,{ports:[0,1,2,3],mano:[0,1],manoLab:"FILTER DROP",hl:"filter",dirty:true})}},
 {t:"High static means less air",body:`<p>The blower can only make so much pressure. More restriction moves the operating point up its curve and to the left: <b>higher static, less airflow</b>.</p><p>With the loaded filter, TESP rises from ${R0.tesp.toFixed(2)} to ${st({load:3.2}).tesp.toFixed(2)} in. and airflow drops from ${Math.round(R0.q)} to ${Math.round(st({load:3.2}).q)} CFM. In cooling, low airflow means a colder coil that can freeze; in heating, a higher temperature rise and high-limit trips.</p><p>That's why static is the first test for airflow complaints.</p>`,
  draw:()=>{const R1=st({load:3.2});return AK.fanChart({x:90,y:40,w:560,h:270,Y:[0,1.4],rated:0.5,title:"BLOWER ON HIGH vs THE DUCT SYSTEM",fans:[{r:1,lbl:"BLOWER (HIGH)",lblAt:700,dx:8,dy:-12}],
   sys:[{Kd:R0.Kd,c:"#2f8f3a",lbl:"CLEAN FILTER",lblAt:1640,dx:4,dy:22,a:"start"},{Kd:R1.Kd,lbl:"LOADED FILTER",lblAt:1450,a:"end",dx:-10,dy:-6}],
   ops:[{q:R0.q,sp:R0.tesp,lbl:Math.round(R0.q)+" CFM",dx:12,dy:20},{q:R1.q,sp:R1.tesp,lbl:Math.round(R1.q)+" CFM at "+R1.tesp.toFixed(2)+" in.",a:"end",dx:-12,dy:-12}]})}}];
const see=K.see({init:{...D},
 sliders:[["merv","Filter MERV",4,16,1,v=>"MERV "+v],["load","Filter loading",1,3.2,0.1,v=>v<=1.05?"clean":"x"+(+v).toFixed(1)],["ret","Return duct size",10,20,1,v=>v+" in."],
  ["coil","Coil fouling",1,2.4,0.1,v=>v<=1.05?"clean":"x"+(+v).toFixed(1)],["regs","Supply registers closed",0,0.6,0.05,v=>Math.round(v*100)+"%"],["tap","Blower speed tap",1,4,1,v=>AK.TAPN[v]]],
 checks:[["deep","4-inch media filter instead of 1-inch"]],
 model:S=>AK.stat(S),
 draw:(R,S)=>AK.equip(R,{mano:[2,1],manoLab:"TESP in. w.c.",dirty:S.load>1.6,dirtyCoil:S.coil>1.5})+K.tag(712,370,"TESP "+R.tesp.toFixed(2)+" in.: "+band(R.tesp)[0],{a:"end",fill:band(R.tesp)[1]}),
 reads:R=>[["TESP",R.tesp.toFixed(2)+" in.",R.tesp>0.5],["Airflow",Math.round(R.q)+" CFM",R.cpt<350],["Return (P2)",AK.f2s(R.p[1])],["Supply (P3)",AK.f2s(R.p[2])],["Filter drop",R.fdrop.toFixed(2)+" in.",R.fdrop>0.2],["Coil drop",R.cdrop.toFixed(2)+" in.",R.cdrop>0.3],["CFM per ton",Math.round(R.cpt),R.cpt<350],["Blower",Math.round(R.w)+" W"]],
 note:R=>`3-ton system, PSC blower. Design airflow 1200 CFM (400 per ton). `+(R.tesp>0.5?`<b class="bad">Over the 0.5 in. rating.</b> Find the biggest drop.`:"Within the rating."),
 log:[["Tap",(R,S)=>AK.TAPN[S.tap]],["TESP",R=>R.tesp.toFixed(2)],["CFM",R=>Math.round(R.q)],["Filter",R=>R.fdrop.toFixed(2)]],
 logHint:"Press Log reading to write down the static test, like a start-up sheet."});
const same=(a,b)=>["merv","load","deep","ret","coil","regs"].every(k=>a[k]===b[k]);
const tasks=[
 K.goal({t:"Fit a MERV 13 filter",intro:"The customer wants a <b>MERV 13</b> filter for allergies. Keep the coil clean, all registers open and the 18-inch return. Get TESP at or under <b>0.50 in.</b> with at least <b>1150 CFM</b>.",
  check:(S,R)=>S.merv<13?"Set the filter to MERV 13 or higher.":S.load>1.05||S.coil>1.05||S.regs>0?"Start from a clean filter, clean coil and all registers open.":S.ret!==18?"Keep the 18-inch return; the change is at the filter rack.":R.q<1150?`Only ${Math.round(R.q)} CFM.`:R.tesp<=0.5?true:`TESP is ${R.tesp.toFixed(2)} in. and the filter alone drops ${R.fdrop.toFixed(2)}. A filter with more surface drops less...`,
  ok:(S,R)=>`TESP ${R.tesp.toFixed(2)} in. at ${Math.round(R.q)} CFM. A 4-inch media filter has about four times the pleat area, so its drop is about half.`}),
 K.goal({t:"Static follows the airflow",intro:"With nothing else changed, log a reading on the <b>low</b> tap and one on <b>high</b>. Compare the TESP.",
  check:(S,R,L)=>{const lo=L.filter(e=>e.S.tap===1),hi=L.filter(e=>e.S.tap===4);for(const a of lo)for(const b of hi)if(same(a.S,b.S))return true;return lo.length&&hi.length?"Log both readings with the same filter, return, coil and registers.":"Log one reading on low and one on high."},
  ok:(S,R,L)=>{const lo=K.LOG.filter(e=>e.S.tap===1).pop(),hi=K.LOG.filter(e=>e.S.tap===4).pop();return `Same ducts: ${lo.R.tesp.toFixed(2)} in. at ${Math.round(lo.R.q)} CFM on low, ${hi.R.tesp.toFixed(2)} in. at ${Math.round(hi.R.q)} CFM on high. Static goes with CFM squared, so always test on the speed the system really runs.`}}),
 K.caseTask({t:"Service call: weak airflow upstairs",intro:"Upstairs rooms are warm and the supply air feels weak. The filter was changed last week. Take the static readings.",
  state:{...D,coil:2.4},model:AK.stat,draw:R=>AK.equip(R,{mano:[2,1],manoLab:"TESP in. w.c."}),
  reads:R=>[["TESP",R.tesp.toFixed(2)+" in.",true],["Airflow",Math.round(R.q)+" CFM",true],["P1",AK.f2s(R.p[0])],["P2",AK.f2s(R.p[1])],["P3",AK.f2s(R.p[2])],["P4",AK.f2s(R.p[3])]],
  actions:[["Work out the filter drop",R=>`Filter drop = P1 − P2 = ${AK.f2s(R.p[0])} − (${AK.f2s(R.p[1])}) = ${R.fdrop.toFixed(2)} in. Normal for a new MERV 8.`],["Work out the coil drop",R=>`Coil drop = P3 − P4 = ${R.p[2].toFixed(2)} − ${R.p[3].toFixed(2)} = ${R.cdrop.toFixed(2)} in. A clean coil is 0.10 to 0.25.`]],
  causes:[["filter","Loaded filter"],["coil","Dirty evaporator coil"],["ret","Undersized return duct"],["regs","Closed supply registers"]],ans:"coil",
  why:"The filter and return readings are normal and P4 (the duct side) is low, but the coil alone drops over 0.4 in. Clean the coil (both faces), then retest.",hint:"Work out the drop across each part. Which one is far over its normal range?"})];
window.LESSON={id:"air-static",sec:"Airflow",secHref:"/airflow/",title:"Static pressure and TESP",lead:"How to read supply and return static with a manometer, add them into total external static pressure, and find which part is choking the airflow.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Return static</b> between the filter and the blower (P2).","<b>Supply static</b> between the furnace and the add-on coil (P3).","<b>Filter drop</b> (P1 − P2) and <b>coil drop</b> (P3 − P4).","The <b>rated TESP</b> and the blower table from the manual, and the speed tap in use."],
  table:[["TESP (on a 0.5 in. rated unit)","What it means"],["0.00 to 0.40 in.","Good, with headroom"],["0.41 to 0.50 in.","At or near the limit"],["0.51 to 0.70 in.","Over the rating: airflow is restricted"],["0.71 to 1.00 in.","Significantly restricted"],["Over 1.00 in.","Severe: fix before anything else"],["Clean 1-inch MERV 8 filter","About 0.05 to 0.10 in."],["Clean, right-sized coil","About 0.10 to 0.25 in."]],tableT:"Normal ranges",
  steps:["Run the blower on the speed it uses for the mode you're testing (cooling tap for cooling).","Zero the manometer with both hoses open to the room.","Read P2 (return, −) and P3 (supply, +). Add them, ignoring the signs: that's TESP.","Read P1 and P4 too, then work out the filter drop and the coil drop.","Find TESP on the blower table to estimate airflow. Compare with 400 CFM per ton.","Plug every hole with a test port cap."],stepsT:"How to do a static test",
  safety:["Before drilling, look inside or check the drawing: never drill near the A-coil, the drain pan, wiring or the heat exchanger.","On a horizontal unit, keep away from electric heat strips.","Plug every test hole. An open hole on the return side pulls in dust or flue gas from the furnace room."],
  mistakes:["Reading P4 above the coil and calling it the supply static without adding the coil drop.","Testing on fan-only (low tap) and judging the cooling airflow from it.","Pointing the static tip across or away from the airflow.","Blaming the blower when the filter or coil drop is two or three times normal."]}),
 sources:[["The Engineering Mindset: Air handling units explained (fans, filters, coils)","https://theengineeringmindset.com/air-handling-units-explained/"],["measureQuick: Total external static pressure (0.5 in. w.c. rating, port locations, ranges)","https://support.measurequick.com/portal/en/kb/articles/total-external-static-pressure"],["measureQuick: Component pressure drops (filters by MERV, coils, ducts)","https://support.measurequick.com/portal/en/kb/articles/component-pressure-drops"],["National Comfort Institute: Measure and interpret static pressures","https://trutechtools.com/content/brands/testo/documents/National%20Comfort%20Institute%20-%20Measure%20and%20Interpret%20Static%20Pressures.pdf"]]};
})();
