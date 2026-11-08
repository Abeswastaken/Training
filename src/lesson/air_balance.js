/* ============ Lesson: Balancing with a hood (proportional method) ============ */
(()=>{
/* four rooms on one trunk, like the trainer's house: [name, design CFM, run resistance factor (long runs resist more)] */
const RM=[["Living",420,0.6],["Kitchen",260,0.9],["Bed 1",280,1.2],["Bed 2",240,1.8]];
const DES=RM.reduce((a,r)=>a+r[1],0);
/* S: {d0..d3 damper open %, tap, rest (in. w.c. at 1200 CFM for return, filter, coil and trunk)} */
const mdl=S=>{const d=RM.map((_,i)=>S["d"+i]/100);const G=RM.map((r,i)=>1/Math.sqrt((0.075*r[2]+0.02*(1/(d[i]*d[i])-1))/(r[1]*r[1])));const Gs=G.reduce((a,c)=>a+c,0);
 const K=(S.rest??0.40)/1440000+1/(Gs*Gs),q=AK.TAPS[S.tap]*Math.sqrt(AK.FAN.s0/(AK.FAN.b+K));
 const rooms=RM.map((r,i)=>{const f=q*G[i]/Gs;return {n:r[0],design:r[1],q:f,p:f/r[1],d:d[i]}});
 const pmin=Math.min(...rooms.map(r=>r.p)),key=rooms.findIndex(r=>r.p===pmin);rooms.forEach(r=>r.ratio=r.p/pmin);
 return {q,tesp:K*q*q,rooms,key,total:q/DES,ok:rooms.every(r=>r.p>=0.9&&r.p<=1.1)}};
const D0={d0:100,d1:100,d2:100,d3:100,tap:4,hood:3,rest:0.40};
const R0=mdl(D0),RB=mdl({...D0,d0:45,d1:50,d2:60});
const pctBars=(R,o={})=>{const x0=o.x??90,y0=o.y??50,w=o.w??540,h=o.h??250,Y=v=>y0+h-(v-0.4)/(1.6-0.4)*h;let s=K.lbl(x0,y0-16,o.title||"PERCENT OF DESIGN",{a:"start",size:14});
 s+=`<rect x="${x0}" y="${Y(1.1)}" width="${w}" height="${Y(0.9)-Y(1.1)}" fill="var(--ok)" opacity=".14"/>`+K.txt(x0+w+6,Y(1)+5,"±10%",{a:"start",fill:"var(--ok)"});
 [0.4,0.6,0.8,1.0,1.2,1.4,1.6].forEach(v=>{s+=`<path d="M${x0} ${Y(v)} H${x0+w}" stroke="var(--panel-edge)" stroke-width=".7"/>`+K.txt(x0-8,Y(v)+5,Math.round(v*100)+"%",{a:"end"})});
 const bw=w/R.rooms.length;R.rooms.forEach((r,i)=>{const bx=x0+i*bw+bw*0.2,v=Math.max(0.4,Math.min(1.6,r.p)),ok=r.p>=0.9&&r.p<=1.1;
  s+=`<rect x="${bx}" y="${Math.min(Y(v),Y(0.4))}" width="${bw*0.6}" height="${Math.abs(Y(0.4)-Y(v))}" rx="3" fill="${ok?"var(--ok)":i===R.key&&o.key?"#2f6fd6":"var(--bad)"}" opacity=".78"/>`+
  `<text x="${bx+bw*0.3}" y="${Y(v)-8}" class="lsG" style="font-family:var(--mono);font-weight:600;font-size:14px;fill:var(--ink)">${Math.round(r.p*100)}%</text>`+K.lbl(bx+bw*0.3,y0+h+22,r.n+(o.key&&i===R.key?" (KEY)":""),{size:13})+K.txt(bx+bw*0.3,y0+h+42,Math.round(r.q)+" / "+r.design+" CFM")});
 s+=`<path d="M${x0} ${Y(1)} H${x0+w}" stroke="var(--ink)" stroke-dasharray="5 4"/><path d="M${x0} ${y0} V${y0+h} H${x0+w}" stroke="var(--muted)" fill="none"/>`;
 return s};
const steps=[
 {t:"Why the rooms don't get their share",body:`<p>Each room's airflow (from the Manual J load) was designed to add up to the system total. Air doesn't read the drawings: it takes the easy way. Short, open runs near the air handler grab extra, and long runs at the end get starved.</p><p>Here every damper is wide open. The living room next to the trunk gets ${Math.round(R0.rooms[0].p*100)}% of its design. Bed 2 at the end gets only ${Math.round(R0.rooms[3].p*100)}%.</p><p><b>Balancing</b> means setting the branch dampers so each room gets its design airflow.</p>`,
  draw:()=>AK.house(R0.rooms)},
 {t:"Reading a register with a flow hood",body:`<p>A <b>flow hood</b> (capture hood) funnels all the air from one register through a sensor and reads CFM directly.</p><ul><li>Pick a hood top that covers the whole register and seal it flat to the ceiling or wall.</li><li>Hold it steady and let the reading settle; take two and average them.</li><li>The hood adds a little resistance and can read a bit low. Many digital hoods have back-pressure compensation: use it on high-flow outlets.</li></ul><p>Write down every register before touching a damper.</p>`,
  draw:()=>AK.house(R0.rooms,{hood:3,showPct:false})},
 {t:"Total first, then percent of design",body:`<p>Divide each reading by the room's design: that's its <b>percent of design</b>.</p><p>Before balancing, check the <b>total</b>: add the readings and compare with the design total. Proportional balancing only works when the total is between about <b>80 and 120%</b>. If it's outside that, fix the airflow first (filter, coil, blower speed, leaks).</p><p>Here the total is ${Math.round(R0.rooms.reduce((a,r)=>a+r.q,0))} of ${DES} CFM (${Math.round(R0.total*100)}%), so we can balance.</p>`,
  draw:()=>pctBars(R0,{title:"ALL DAMPERS OPEN"})},
 {t:"Find the key and work up from the next lowest",body:`<p>The room with the <b>lowest</b> percent of design is the <b>key</b>. Its damper stays wide open. You can't push more air to it by opening it further.</p><p>Then go to the room with the next lowest percent and close its damper until its percent matches the key's. Then the next one, and so on up to the highest.</p><p>The key's percent rises a bit with every damper you close, and the rooms you've already set rise with it. That's why it's called <b>proportional</b>: the ratios stay put even as the numbers move.</p>`,
  math:`<p>Tolerance ±10% means each room should be between 90 and 110%. The ratio of the limits is 1.10 ÷ 0.90 = 1.22.</p><p>So a room needs adjusting when its percent ÷ the key's percent is more than 1.22. Example: key at 74%, Bed 1 at 90%: 90 ÷ 74 = 1.22. Right at the limit.</p>`,
  draw:()=>pctBars(R0,{key:true,title:"BED 2 IS THE KEY (LOWEST %)"})+K.tag(630,128,"CLOSE THE OTHERS TO MATCH THE KEY",{a:"end",fill:"var(--brass)"})},
 {t:"Bring the total back and lock it",body:`<p>When every room is at the same percent, they're in balance with each other. If that percent is below 100, the whole system is short: speed up the blower (or open the total) and they all rise together.</p><p>Here, after setting Living, Kitchen and Bed 1 and leaving Bed 2 open, every room lands within 10%.</p><ul><li>Mark each damper's position (paint or a marker on the quadrant) and tighten its wing nut.</li><li>Take final readings of every register and the total.</li><li>Recheck TESP: closing dampers adds static.</li></ul>`,
  draw:()=>AK.house(RB.rooms)+K.tag(700,30,"TESP "+R0.tesp.toFixed(2)+" → "+RB.tesp.toFixed(2)+" IN.",{a:"end"})}];
const see=K.see({init:{...D0},
 sliders:[["d0","Living damper",10,100,5,v=>v+"% open"],["d1","Kitchen damper",10,100,5,v=>v+"% open"],["d2","Bed 1 damper",10,100,5,v=>v+"% open"],["d3","Bed 2 damper",10,100,5,v=>v+"% open"],["tap","Blower speed tap",1,4,1,v=>AK.TAPN[v]],["hood","Flow hood on",0,3,1,v=>RM[v][0]]],
 model:mdl,draw:(R,S)=>AK.house(R.rooms,{hood:S.hood,keyI:R.key}),
 reads:(R,S)=>[["Hood reading",Math.round(R.rooms[S.hood].q)+" CFM"],["Percent of design",Math.round(R.rooms[S.hood].p*100)+"%",Math.abs(R.rooms[S.hood].p-1)>0.1],["Key room",R.rooms[R.key].n],["Ratio to key",R.rooms[S.hood].ratio.toFixed(2),R.rooms[S.hood].ratio>1.22],["Total",Math.round(R.q)+" CFM"],["Total % of design",Math.round(R.total*100)+"%",R.total<0.8||R.total>1.2],["TESP",R.tesp.toFixed(2)+" in.",R.tesp>0.5],["All within ±10%",R.ok?"yes":"no",!R.ok]],
 note:R=>"Design: "+RM.map(r=>r[0]+" "+r[1]).join(", ")+" CFM ("+DES+" total).",
 log:[["Room",(R,S)=>RM[S.hood][0]],["CFM",(R,S)=>Math.round(R.rooms[S.hood].q)],["%",(R,S)=>Math.round(R.rooms[S.hood].p*100)],["Total",R=>Math.round(R.q)]],
 logHint:"Press Log reading to write down the room under the hood, like a balancing report."});
const tasks=[
 K.goal({t:"Balance the house",intro:"Use the proportional method: find the key, leave it open, close the others to match. Get <b>every room within ±10%</b> of design.",
  check:(S,R)=>R.ok?true:`Not yet: ${R.rooms.filter(r=>Math.abs(r.p-1)>0.1).map(r=>r.n+" "+Math.round(r.p*100)+"%").join(", ")}.`,
  ok:(S,R)=>`Balanced: ${R.rooms.map(r=>r.n+" "+Math.round(r.p*100)+"%").join(", ")}. Total ${Math.round(R.q)} CFM, TESP ${R.tesp.toFixed(2)} in. ${S.d3===100?"The key stayed wide open, as it should.":"Next time leave the key (Bed 2) wide open: closing it only wastes static."}`}),
 K.goal({t:"Try the homeowner's fix",intro:"Homeowners close the register in the coldest room to push air elsewhere. With everything else wide open on high, close the <b>Living</b> damper to <b>10%</b> and see what happens to every room.",
  check:(S,R)=>S.d0!==10?"Set the Living damper to 10%.":S.d1!==100||S.d2!==100||S.d3!==100||S.tap!==4?"Leave the other dampers wide open and the blower on high.":true,
  ok:(S,R)=>`Bed 2 rose to ${Math.round(R.rooms[3].p*100)}%, but Living fell to ${Math.round(R.rooms[0].p*100)}% of its design, Kitchen is at ${Math.round(R.rooms[1].p*100)}% and Bed 1 at ${Math.round(R.rooms[2].p*100)}%. Moving one damper moves every room, which is why you set them all, in order, with a hood.`}),
 K.caseTask({t:"Service call: every room is weak",intro:"The customer wants the house balanced. You hood every register before touching a damper.",
  state:{...D0,rest:1.5},model:mdl,draw:R=>pctBars(R,{title:"FIRST READINGS"}),
  reads:R=>[["Total",Math.round(R.q)+" CFM",true],["Design total",DES+" CFM"],["Total % of design",Math.round(R.total*100)+"%",true],["TESP",R.tesp.toFixed(2)+" in.",true]],
  causes:[["sys","Total airflow is too low: fix the system (static, filter, blower) before balancing"],["key","Close the Living damper first"],["hood","The flow hood reads low"],["bed2","Bed 2's branch is crushed"]],ans:"sys",
  why:"The total is below 80% of design and TESP is far over 0.5 in. Balancing only shares out what the blower delivers. Find the restriction (filter, coil, return), get the total up, then balance.",hint:"Look at the total and the static before the individual rooms."})];
window.LESSON={id:"air-balance",sec:"Airflow",secHref:"/airflow/",title:"Balancing with a hood",lead:"How to read every register with a flow hood, work out percent of design, and set the dampers with the proportional method.",
 steps,see,tryIntro:"Two jobs in See it, then a service call.",tasks,
 job:K.job({read:["<b>Design CFM</b> for every room (from the Manual J / Manual D drawings).","<b>Hood reading</b> at every register and grille.","<b>Total</b> supply airflow and <b>TESP</b> before and after."],
  table:[["Check","Target"],["Total airflow before balancing","80 to 120% of design"],["Each room after balancing","Within ±10% of design (unless the spec says otherwise)"],["Ratio of a room's % to the key's %","Adjust if over 1.22 (for ±10%)"],["TESP after balancing","Still within the equipment rating"]],tableT:"Targets",
  steps:["Check filter, coil and blower first; open every damper and register.","Hood every outlet and write it down. Add up the total; compare with design.","Find the key: the lowest percent of design. Leave it wide open.","Starting with the next lowest, close each damper until its percent matches the key's.","Work up to the highest-percent room. Then adjust blower speed so they all come up to 100%.","Take final readings, mark and lock the dampers, recheck TESP and fill out the report."],stepsT:"Proportional balancing",
  safety:["Work from a stable ladder; flow hoods are bulky and catch on things overhead.","In attics, step only on joists and watch for nails through the roof deck and for live wiring.","Don't close a branch so far that a room with a gas appliance or a bathroom fan ends up starved of supply or return path."],
  mistakes:["Balancing when the total is way off design. Fix the system first.","Closing the key room's damper.","Using the register louvers instead of the branch dampers: louvers add noise and throw the air in the wrong direction.","Not locking and marking the dampers, so the next person undoes your work."]}),
 sources:[["The Engineering Mindset: Ductwork sizing and design (index run and balancing dampers)","https://theengineeringmindset.com/ductwork-sizing-calculation-and-design-for-efficiency/"],["ACHR News: TAB, the A is for adjust (proportional balancing, key outlet, 1.22 ratio)","https://www.achrnews.com/articles/162392-tab-the-a-is-for-adjust"],["Dwyer Omega: Air balancing HVAC systems (80 to 120% rule, flow hoods)","https://www.dwyeromega.com/en-us/resources/air-balancing-hvac-systems"]]};
})();
