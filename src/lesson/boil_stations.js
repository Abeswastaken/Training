/* ============ Lesson: PRV, trap and drip stations ============ */
(()=>{
/* example station: pilot-operated PRV rated 2,500 lb/h at 100 psig inlet, 1 psi droop at full flow; safety valve set 15 psig, sized for the PRV wide open plus margin */
const WR=2500,KF=6000/114.7,SV=15,A=B.ATM;
const flowOpen=(K,Pu,Pd)=>{const r=(Pd+A)/(Pu+A);return K*(Pu+A)*Math.min(1,Math.sqrt(Math.max(0,1-r*r))/0.815)};
const model=S=>{const wmax=WR*(S.Pin+A)/(100+A)*(S.clog?0.35:1);let P=S.load<=wmax?S.set-S.load/wmax:Math.max(0,S.set-1-S.set*(S.load-wmax)/wmax);
 const K=(S.fo?KF:0)+(S.byp?KF*0.25:0),wsv=KF*(150+A)*1.1;let sv=false,relief=0;
 if(K>0){const g=p=>flowOpen(K,S.Pin,p)-S.load-(p>SV?wsv*Math.min(1,(p-SV)/(0.1*SV)):0);let lo=0,hi=S.Pin;if(g(0)>0){for(let i=0;i<60;i++){const m=(lo+hi)/2;if(g(m)>0)lo=m;else hi=m}P=Math.max(P,lo)}}
 if(P>SV){sv=true;relief=wsv*Math.min(1,(P-SV)/(0.1*SV))}
 return {P,wmax,sv,relief,starve:S.load>wmax,Td:B.Tsat(P),Tu:B.Tsat(S.Pin),sag:S.set-P}};
/* the station, left to right: drip leg and trap, inlet gauge, isolation valve, strainer, PRV, isolation valve, outlet gauge, safety valve; bypass above */
const scene=(R,S,o={})=>{const y=230;let s=`<path d="M10 360 H710" stroke="#8a7f70" stroke-width="4"/>`;
 s+=B.pH(20,700,y,16)+B.pV(160,130,y,10)+B.pH(160,450,130,10)+B.pV(450,130,y,10);
 /* drip leg and trap */
 s+=B.pV(100,y,316,16)+`<rect x="92" y="316" width="16" height="22" fill="url(#zSteel)" stroke="#3f474c"/>`+B.pH(108,150,300,8,"url(#zSteelH)")+B.trap(1,170,300,.45,S.drip?"closed":"ok")+B.pH(190,240,300,8,"url(#zSteelH)");
 if(S.drip)s+=`<rect x="94" y="${y+8}" width="12" height="${308-y}" fill="var(--cold)" opacity=".7"/>`+[0,1,2].map(k=>`<ellipse cx="${200+k*40}" cy="${y}" rx="10" ry="4" fill="var(--cold)" opacity=".8" class="lsPulse"/>`).join("");
 /* parts on the line */
 s+=B.valve(140,y)+B.valve(410,y)+B.valve(315,130,{shut:!S.byp});
 s+=`<rect x="226" y="${y-12}" width="48" height="24" rx="6" fill="url(#zSteel)" stroke="#3f474c"/><path d="M240 ${y+8} l26 34" stroke="#3f474c" stroke-width="18" stroke-linecap="round"/><path d="M240 ${y+8} l26 34" stroke="url(#zSteel)" stroke-width="14" stroke-linecap="round"/>`+(S.clog?`<circle cx="262" cy="${y+36}" r="7" fill="#6b5236"/>`:"");
 s+=`<g filter="url(#zShadow)"><rect x="318" y="${y-20}" width="54" height="40" rx="8" fill="url(#bkGreenV)" stroke="#173d24"/><ellipse cx="345" cy="${y-38}" rx="36" ry="12" fill="url(#bkGreenV)" stroke="#173d24"/><rect x="336" y="${y-36}" width="18" height="18" fill="url(#zSteel)"/></g><path d="M372 ${y-6} h18 v-44 h-30" stroke="#8c6a1c" stroke-width="2.4" fill="none"/>`;
 if(S.fo)s+=`<path d="M326 ${y-26} l38 52 M364 ${y-26} l-38 52" stroke="var(--bad)" stroke-width="3"/>`;
 s+=`<g transform="translate(0 0)">`+B.pV(205,y-26,y-8,4,"url(#zBrass)")+`</g>`+B.gauge(205,y-46,20,S.Pin,200,"PSI")+B.pV(505,y-26,y-8,4,"url(#zBrass)")+B.gauge(505,y-46,20,R.P,30,"PSI",{red:SV});
 s+=B.relief(560,y-8,{s:.7,open:R.sv})+B.pV(590,y-38,y-120,8);
 if(!o.noTags){s+=K.tag(205,y-80,K.f0(S.Pin)+" PSIG",{w:80})+K.tag(505,y-80,K.f1(R.P)+" PSIG",{w:80,fill:R.sv?"var(--bad)":R.sag>2?"var(--warn)":null})+B.L(40,y-20,"HIGH PRESSURE",{a:"start",size:12,fill:"#6c7a84"})+B.L(700,y-20,"LOW PRESSURE",{a:"end",size:12,fill:"#6c7a84"})+B.L(345,y+48,"PRV",{size:12})+B.L(315,156,"BYPASS",{size:12})}
 return s};
const lab=()=>B.co(92,330,80,345,"DRIP LEG",{a:"end"})+B.co(170,318,170,346,"TRAP",{a:"middle",dy:12})+B.co(140,216,110,186,"VALVE",{a:"end"})+B.co(262,262,262,290,"STRAINER",{a:"start"})+B.co(590,140,640,120,"SAFETY VALVE",{a:"start"})+B.co(410,216,420,186,"VALVE",{a:"start"})+B.co(390,200,390,92,"PILOT",{a:"start"});
const steps=[
 {t:"Why steam pressure gets reduced",
  body:`<p>Plants and campuses make steam at higher pressure, often 60 to 150 psig. High-pressure steam is dense, so it travels long distances in smaller pipes.</p><p>Heating coils, radiators and most equipment run at <b>low pressure</b>, often 2 to 15 psig. A <b>pressure reducing valve</b> (PRV) station drops the pressure where the building takes its steam.</p><p>Lower pressure also gives more latent heat per pound: about 945 Btu/lb at 15 psig against 880 Btu/lb at 100 psig.</p>`,
  draw:()=>{const S={Pin:100,set:10,load:1200};return scene(model(S),S)}},
 {t:"The parts of a PRV station",
  body:`<p>Following the steam:</p><ol><li><b>Drip leg and trap</b> to take water out before it reaches the valve.</li><li><b>Inlet gauge</b> and <b>isolation valve</b>.</li><li><b>Strainer</b> to catch scale and dirt.</li><li>The <b>PRV</b>, often pilot operated, with its sensing line downstream.</li><li><b>Outlet isolation valve</b> and <b>outlet gauge</b>.</li><li><b>Safety valve</b> on the low-pressure side.</li><li>A <b>bypass</b> with a globe valve, for running by hand while the PRV is serviced.</li></ol>`,
  draw:()=>{const S={Pin:100,set:10,load:1200};return scene(model(S),S,{noTags:true})+lab()}},
 {t:"Dirt and water wreck PRV seats",
  body:`<p>A PRV runs with its disc just off the seat. Water droplets and grit going through that tiny gap at high speed cut grooves in the seat (<b>wire drawing</b>). Then it can't close tight, and the low side creeps up when the load drops.</p><p>So the station gets:</p><ul><li>A <b>drip leg and trap</b> (or a separator) right ahead of it.</li><li>A <b>strainer</b>, mounted on its side so the screen doesn't hold water.</li></ul><p>A <b>clogged strainer</b> chokes the flow, and the low side sags when the load is high.</p>`,
  draw:()=>{const S={Pin:100,set:10,load:2000,clog:true,drip:true};return scene(model(S),S)+B.L(240,345,"TRAP FAILED CLOSED: WATER CARRIES INTO THE VALVE",{size:12,fill:"var(--bad)"})}},
 {t:"Safety valve and bypass",
  body:`<p>If the PRV fails <b>wide open</b>, full plant pressure reaches the low side. The <b>safety valve</b> downstream must be set at or below what the low-pressure side is rated for, and big enough to dump everything the PRV (and the bypass) can pass wide open.</p><p>The <b>bypass</b> is for a person, not for automatic use. While the PRV is out, someone throttles the globe valve and <b>watches the outlet gauge</b>. A bypass left cracked open does the same thing as a leaking PRV.</p>`,
  draw:()=>{const S={Pin:120,set:10,load:300,fo:true};return scene(model(S),S)+B.L(560,90,"LIFTING",{fill:"var(--bad)",size:13})}},
 {t:"Drip legs on steam mains",
  body:`<p>Steam mains make condensate all the time, and a lot of it while they warm up. It has to come out at:</p><ul><li><b>Low points</b>, the <b>end of each main</b>, and ahead of risers, PRVs and control valves.</li><li>Along long straight runs, about every <b>100 to 150 ft</b>.</li></ul><p>A <b>drip leg</b> is a pocket off the bottom of the main: the full main size for mains up to about 4 in., and deep (Engineering ToolBox shows 28 in.) so it holds warm-up water. The trap comes off the side above a dirt pocket, so scale settles below it.</p>`,
  draw:()=>{let s=B.pH(20,700,110,30)+B.flow("M20 110 H700",true,2)+B.pV(360,110,320,30)+`<rect x="345" y="320" width="30" height="24" rx="3" fill="url(#zSteel)" stroke="#3f474c"/>`;
   s+=`<rect x="350" y="200" width="20" height="120" fill="var(--cold)" opacity=".6"/>`+B.pH(375,450,250,10)+B.trap(1,490,250,.7,"ok")+B.pH(522,640,250,10,B.COND);
   s+=`<path d="M300 110 V320" stroke="var(--muted)"/><path d="M294 110 h12 M294 320 h12" stroke="var(--muted)"/>`+K.tag(250,220,"ABOUT 28 IN.",{w:110});
   s+=B.co(375,320,430,340,"DIRT POCKET BELOW THE TRAP TAKE-OFF",{a:"start"})+B.co(490,226,520,186,"TRAP",{a:"start"})+B.L(360,80,"STEAM MAIN, PITCHED WITH THE FLOW",{fill:"#6c7a84"})+B.co(375,160,430,160,"POCKET: FULL MAIN SIZE UP TO 4 IN.",{a:"start"})+B.L(600,240,"TO RETURN",{size:12,fill:B.COND});
   return s}}];
const see=K.see({init:{Pin:120,set:10,load:1500,fo:false,byp:false,clog:false,drip:false},
 sliders:[["Pin","Plant steam in",60,150,5,v=>v+" psig"],["set","PRV setpoint",2,12,0.5,v=>K.f1(v)+" psig"],["load","Building load",0,3000,50,v=>v.toLocaleString("en-US")+" lb/h"]],
 checks:[["fo","PRV failed wide open"],["byp","Bypass valve left cracked open"],["clog","Strainer clogged"],["drip","Drip trap ahead of the PRV failed closed"]],
 model, draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Low side",K.f1(R.P)+" psig",R.sv||R.sag>2],["Low side steam temp",K.f1(R.Td)+"°F"],["Off setpoint",(R.sag>=0?"-":"+")+K.f1(Math.abs(R.sag))+" psi",Math.abs(R.sag)>2],["PRV capacity now",K.f0(R.wmax/10)*10+" lb/h",R.starve],["Safety valve",R.sv?"LIFTING "+K.f0(R.relief/10)*10+" lb/h":"closed",R.sv],["Drip leg",S.drip?"FLOODED":"draining",S.drip]],
 note:(R,S)=>R.sv?"Low side is over 15 psig: the safety valve is dumping steam. Find the open path: failed PRV or open bypass.":R.starve?"The load is more than the PRV can pass right now, so the low side sags."+(S.clog?" The clogged strainer cut its capacity.":""):S.drip?"Water is carrying over into the PRV: expect hammer and a wire-drawn seat.":S.byp&&R.P>S.set?"The open bypass feeds steam around the PRV, pushing the low side up at light load.":"",
 log:[["In",(R,S)=>S.Pin],["Set",(R,S)=>K.f1(S.set)],["Load",(R,S)=>S.load],["Faults",(R,S)=>[S.fo?"PRV open":"",S.byp?"bypass":"",S.clog?"strainer":"",S.drip?"drip":""].filter(Boolean).join(", ")||"none"],["Low side",R=>K.f1(R.P)]]});
const tasks=[
 K.goal({t:"Set up a 10 psig heating loop",intro:"Plant steam at <b>120 psig</b>, building load <b>1,500 lb/h</b>, no faults. Set the PRV so the low side holds within <b>1 psi of 10 psig</b>.",
  check:(S,R)=>S.fo||S.byp||S.clog||S.drip?"Clear all the faults.":S.Pin!==120?"Set the plant steam to 120 psig.":S.load!==1500?"Set the load to 1,500 lb/h.":Math.abs(R.P-10)>1?`Low side is ${K.f1(R.P)} psig.`:true,ok:(S,R)=>`${K.f1(R.P)} psig: the PRV droops a little under load, which is normal.`}),
 K.goal({t:"Catch a clogged strainer",intro:"Clog the strainer and raise the load until the low side sags <b>2 psi or more</b> below the setpoint, then press <b>Log reading</b>.",
  check:(S,R,L)=>L.some(r=>r.S.clog&&!r.S.fo&&!r.S.byp&&r.R.sag>=2)?true:"Log a reading with the strainer clogged and the low side 2 psi or more under setpoint.",ok:"A low side that sags only at high load, with a big drop across the strainer, points at the screen. Isolate and clean it."}),
 K.goal({t:"Fail the PRV open",intro:"Check <b>PRV failed wide open</b> and log it. The safety valve should lift and hold the low side at or under <b>16.5 psig</b> (15 psig plus 10%).",
  check:(S,R,L)=>L.some(r=>r.S.fo&&r.R.sv&&r.R.P<=16.5)?true:"Log a reading with the PRV failed open, the safety valve lifting, and the low side at 16.5 psig or less.",ok:"The safety valve saved the low side. Now isolate, run on the bypass with someone watching the gauge, and rebuild the PRV."})];
window.LESSON={id:"boil-stations",sec:"Boiler",secHref:"/boiler-trainer/",title:"PRV, trap and drip stations",lead:"How a steam pressure reducing station is built, why it needs a strainer, drip trap and safety valve, and where drip legs go on mains.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders and boxes, then press Check.",tasks,
 job:K.job({read:["<b>Inlet and outlet gauges</b> at light load and at heavy load.","<b>PRV setpoint</b> and what the low side is rated for.","<b>Safety valve</b> set pressure and capacity tag.","<b>Drip trap</b> inlet and outlet temperatures; <b>strainer</b> blowdown."],
  table:[["What you find","What it means"],["Low side creeps up at light load","PRV seat cut (wire drawn) or bypass passing"],["Low side sags at high load","Strainer clogged, PRV undersized, or pilot trouble"],["Safety valve lifting","PRV failed open or bypass open"],["Banging at the station","Drip trap failed closed or no drip ahead of the PRV"],["Both gauges the same","PRV wide open, or no load and a passing seat"]],
  safety:["Isolate both sides, depressurize and let it cool before opening a strainer or PRV. Steam lines stay hot for a long time.","Open steam valves slowly to warm and drain the line; fast opening slams condensate and causes water hammer.","Never block or plug the safety valve, and never leave the bypass open unattended."],
  mistakes:["Running on the bypass with nobody watching the outlet gauge.","Turning up the PRV setpoint to cover a clogged strainer.","Putting the drip trap at the very bottom of the pocket, where scale settles into it."]}),
 sources:[["The Engineering Mindset: steam heating system basics","https://theengineeringmindset.com/steam-heating-system-basics/"],["Spirax Sarco: self-acting pressure controls and applications","https://www.spiraxsarco.com/learn-about-steam/control-hardware---self-acting-actuation/self-acting-pressure-controls-and-applications?sc_lang=en-GB"],["Engineering ToolBox: steam pipe drip legs","https://engineeringtoolbox.com/steam-pipe-drip-legs-d_1927.html"],["TLV: trapping steam mains","https://www.tlv.com/steam-info/steam-theory/distribution/trap-steam-mains"]]};
})();
