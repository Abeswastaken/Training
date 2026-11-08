/* ============ Lesson: Normally open, normally closed, spring ranges and fail-safe positions ============ */
(()=>{
const C=CTK;
const RANGES=[[3,6],[4,8],[3,8],[5,10],[8,13],[9,13]];
const DEV=[{n:"Heating coil valve",safe:0,why:"Lose air and it opens: full heat keeps the coil from freezing."},{n:"Outside air damper",safe:1,why:"Lose air and it shuts: no frozen coil from outside air."},{n:"Cooling coil valve",safe:1,why:"Lose air and it shuts: no cooling fighting the heat."}];
const sl=(id,lab,min,max,step,val,out)=>`<div class="row"><label for="ls_${id}">${lab}</label><output id="lso_${id}">${out}</output><input type="range" id="ls_${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
/* ---------- actuator and valve cutaway. x = stroke 0..1, nc = plug below the seat (push down to open) ---------- */
function actCut(cx,top,o){const x=C.cl(o.x,0,1),nc=!!o.nc,psi=o.psi||0,yd=top+62+x*20,sc=o.s||1;
 let s=`<g transform="translate(${cx} ${top}) scale(${sc}) translate(${-cx} ${-top})">`;
 s+=`<path d="M${cx} ${top-30} V${top+4}" stroke="#4d555a" stroke-width="7"/><path d="M${cx} ${top-30} V${top+4}" stroke="${C.pc(psi)}" stroke-width="5"/>`;
 s+=`<rect x="${cx-92}" y="${top}" width="184" height="168" rx="16" fill="#e9edf0" stroke="#3a4247" stroke-width="4"/>`;
 s+=`<path d="M${cx-90} ${top+14} Q${cx-90} ${top+2} ${cx-76} ${top+2} H${cx+76} Q${cx+90} ${top+2} ${cx+90} ${top+14} V${yd} Q${cx} ${yd+12} ${cx-90} ${yd} Z" fill="${C.AIR}" opacity="${(0.12+psi/25*0.6).toFixed(2)}"/>`;
 s+=`<path d="M${cx-90} ${yd} Q${cx} ${yd+12} ${cx+90} ${yd}" stroke="#1d2125" stroke-width="5" fill="none"/><rect x="${cx-64}" y="${yd+6}" width="128" height="10" rx="3" fill="url(#zSteel)" stroke="#3a4247"/>`;
 const s0=yd+16,s1=top+160,n=7,w=60;let z=`M${cx-w} ${s0}`;for(let i=1;i<=n*2;i++)z+=` L${cx+(i%2?w:-w)} ${s0+(s1-s0)*i/(n*2)}`;
 s+=`<path d="${z}" stroke="#7a8288" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="${z}" stroke="#c9d0d4" stroke-width="2" fill="none"/>`;
 s+=`<text x="${cx}" y="${top+36}" style="font:600 13px var(--display);letter-spacing:.06em;fill:#0d4f4b;text-anchor:middle">AIR ${K.f1(psi)} PSI</text>`;
 /* yoke and stem */
 const L=nc?198:174,se=yd+16+L;s+=`<rect x="${cx-40}" y="${top+168}" width="8" height="54" fill="#8d969b"/><rect x="${cx+32}" y="${top+168}" width="8" height="54" fill="#8d969b"/>`;
 s+=`<rect x="${cx-4}" y="${yd+16}" width="8" height="${L}" fill="#c9d0d4" stroke="#5f686d"/><rect x="${cx+6}" y="${yd+110}" width="18" height="4" fill="#c0281c"/>`;
 /* body: inlet chamber below the seat, outlet above */
 const by=top+222,bh=100,sy=by+50;s+=`<rect x="${cx-110}" y="${by}" width="220" height="${bh}" rx="10" fill="#f3efe4" stroke="#5e400e" stroke-width="4"/>`;
 s+=`<path d="M${cx-108} ${sy} H${cx-24} M${cx+24} ${sy} H${cx+108}" stroke="#5e400e" stroke-width="7"/>`;
 const open=nc?x:1-x,wc=C.HW;
 if(!nc){const pb=se;s+=`<path d="M${cx-30} ${pb-20} H${cx+30} L${cx+20} ${pb} H${cx-20} Z" fill="url(#zBrass)" stroke="#5e400e" stroke-width="1.5"/>`}
 else{const pt=se;s+=`<path d="M${cx-20} ${pt} H${cx+20} L${cx+30} ${pt+20} H${cx-30} Z" fill="url(#zBrass)" stroke="#5e400e" stroke-width="1.5"/>`}
 s+=`<rect x="${cx-150}" y="${sy+14}" width="40" height="22" fill="${wc}" opacity=".8"/><rect x="${cx+110}" y="${sy-36}" width="40" height="22" fill="${wc}" opacity="${open>0.02?.8:.25}"/>`;
 if(open>0.02)s+=`<path d="M${cx-90} ${sy+25} H${cx-10} Q${cx} ${sy+20} ${cx} ${sy} Q${cx} ${sy-22} ${cx+20} ${sy-25} H${cx+100}" stroke="${wc}" stroke-width="${(1.5+3*open).toFixed(1)}" fill="none" stroke-dasharray="6 6"/>`;
 s+=`</g>`;return {s,open}}
/* stroke % vs branch chart */
const sChart=(o)=>{const ser=o.ranges.map(r=>({f:p=>(r.nc?C.stroke(p,r.a,r.b):1-C.stroke(p,r.a,r.b))*100,c:r.c,lbl:r.lbl,lblAt:r.at,a:r.an||"start",dx:r.dx??6,dy:r.dy??-8,n:200}));
 return K.chart({x:o.x,y:o.y,w:o.w,h:o.h,X:[0,o.max||20],Y:[0,100],xt:o.xt||[0,3,6,9,12,15,18],yt:[0,50,100],yf:v=>v+"%",xl:"branch psi",yl:o.yl||"open",title:o.title,series:ser,dots:o.dots||[],vlines:o.vlines||[]})};
const model=S=>{const [a,b]=RANGES[S.rng],br=S.lost?0:S.br,x=C.stroke(br,a,b),open=S.nc?x:1-x,d=DEV[S.dev];return {a,b,br,x,open,fail:S.nc?0:1,safe:S.nc===d.safe}};
const fmtR=i=>RANGES[i][0]+" to "+RANGES[i][1]+" psi";
function seeDraw(R,S){const d=DEV[S.dev];
 let s=actCut(150,50,{x:R.x,nc:!!S.nc,psi:R.br,s:.92}).s+K.lbl(150,26,(S.nc?"NORMALLY CLOSED":"NORMALLY OPEN")+", "+R.a+"-"+R.b+" PSI",{size:13});
 s+=sChart({x:390,y:40,w:300,h:130,title:"POSITION VS BRANCH",ranges:[{a:R.a,b:R.b,nc:!!S.nc,c:"var(--brass)"}],dots:[{x:R.br,y:R.open*100,c:C.AIR}],xt:[0,4,8,12,16,20]});
 if(S.dev===1){s+=C.duct(360,252,340,90)+C.damper(500,252,60,90,R.open,{n:4})+K.lbl(530,240,"OUTSIDE AIR DAMPER",{size:12});
  if(R.open>0.03)s+=K.arrow("M380 297 H480","#6aa6dc",2.6)+K.arrow("M580 297 H680","#6aa6dc",2.6);}
 else{const col=S.dev===0?C.HW:C.CW;s+=C.pipe("M360 330 H520",col)+C.coil(560,250,44,100,col)+C.pipe(`M520 330 H560`,R.open>0.02?col:"#9aa3aa")+C.valve(470,330,{s:.55,x:R.x,open:R.open,kind:"pn"})+K.lbl(582,240,S.dev===0?"HEATING COIL":"COOLING COIL",{size:12});
  s+=K.txt(470,370,R.open>0.02?"water flowing":"no flow")}
 s+=K.tag(440,236,K.f0(R.open*100)+"% OPEN",{fill:R.open>0.02?"var(--ok)":"var(--muted)"});
 return s}
/* ---------- steps ---------- */
const steps=[
 {t:"Inside a pneumatic actuator",
  body:`<p>A pneumatic <b>actuator</b> is a can with a rubber <b>diaphragm</b> across the middle and a <b>spring</b> underneath.</p><p>Branch air pushes down on the diaphragm. The spring pushes back up. The <b>stem</b> moves until the two forces balance. More air, more travel; less air, the spring pushes it back.</p><p>No air at all, and the spring wins completely: the stem sits at its spring position. Drag the branch pressure.</p>`,
  init:{p:0},ctl:{html:sl("p","Branch pressure",0,20,0.5,0,"0.0 psi"),input:(t,s)=>{s.p=+t.value;document.getElementById("lso_p").textContent=K.f1(t.value)+" psi"}},
  draw:s=>{const p=s.p??0,x=C.stroke(p,8,13),r=actCut(250,40,{x,psi:p,nc:true,s:1});
   let o=r.s+K.lbl(400,24,"8 TO 13 PSI ACTUATOR",{a:"start",size:13});
   o+=K.lbl(400,70,"DIAPHRAGM",{a:"start",size:13})+`<path d="M396 66 H346" stroke="var(--muted)"/>`+K.lbl(400,170,"SPRING",{a:"start",size:13})+`<path d="M396 166 H316" stroke="var(--muted)"/>`+K.lbl(400,260,"STEM",{a:"start",size:13})+`<path d="M396 256 H260" stroke="var(--muted)"/>`+K.lbl(400,330,"PLUG AND SEAT",{a:"start",size:13})+`<path d="M396 326 H290" stroke="var(--muted)"/>`;
   o+=K.lcd(600,140,K.f0(x*100)+"%",96,"STEM TRAVEL")+K.txt(600,230,p<8?"below 8 psi: the spring holds it":p>13?"above 13 psi: full travel":"between 8 and 13 psi: moving",{});
   return o}},
 {t:"Spring range",
  body:`<p>The <b>spring range</b> is the branch pressure where the stem <b>starts</b> to move and where it <b>finishes</b>. A 3 to 8 psi actuator doesn't budge until 3 psi and is fully stroked at 8 psi.</p><p>Springs come in different strengths, so you can buy different ranges. Common ones: 3 to 6, 4 to 8 and 9 to 13 psi (Johnson Controls valve actuators), and heating ranges like 3 to 8 with cooling ranges like 8 to 13 psi.</p><p>The range is printed on the actuator label. Write it down before you change anything.</p>`,
  math:`<p>Stroke % = (branch − start) ÷ (end − start) × 100, held between 0 and 100%.</p><p>Example: 3 to 8 psi actuator at 5 psi → (5 − 3) ÷ 5 = 40% stroked.</p>`,
  draw:()=>{let s=K.chart({x:90,y:40,w:540,h:250,X:[0,16],Y:[0,100],xt:[0,2,4,6,8,10,12,14,16],yt:[0,25,50,75,100],yf:v=>v+"%",xl:"branch psi",yl:"stem stroke",title:"STROKE VS BRANCH PRESSURE",
    series:[{f:p=>C.stroke(p,3,8)*100,c:"var(--hot)",lbl:"3 TO 8 PSI",lblAt:5.5,a:"end",dx:-10,dy:-4,n:160},{f:p=>C.stroke(p,8,13)*100,c:"var(--cold)",lbl:"8 TO 13 PSI",lblAt:10.5,a:"start",dx:12,dy:10,n:160}],dots:[{x:5,y:40,c:"var(--hot)",lbl:"5 PSI: 40%",dx:12,dy:16}]});
   return s}},
 {t:"Normally open and normally closed",
  body:`<p>The <b>normal</b> position is where the spring puts the device with <b>no air</b>.</p><ul><li><b>Normally open (NO)</b>: open with no air. Air closes it.</li><li><b>Normally closed (NC)</b>: closed with no air. Air opens it.</li></ul><p>On a valve the difference is usually which side of the seat the plug sits on: the same actuator pushing down closes one valve and opens the other. Dampers do it with the linkage.</p><p>Drag the branch: the two valves move opposite ways.</p>`,
  init:{p:0},ctl:{html:sl("p2","Branch pressure",0,15,0.5,0,"0.0 psi"),input:(t,s)=>{s.p=+t.value;document.getElementById("lso_p2").textContent=K.f1(t.value)+" psi"}},
  draw:s=>{const p=s.p??0,x=C.stroke(p,3,8),a=actCut(180,62,{x,psi:p,nc:false,s:.82}),b=actCut(540,62,{x,psi:p,nc:true,s:.82});
   return a.s+b.s+K.lbl(180,20,"NORMALLY OPEN, 3-8 PSI",{size:13})+K.lbl(540,20,"NORMALLY CLOSED, 3-8 PSI",{size:13})+K.tag(180,372,K.f0(a.open*100)+"% OPEN",{fill:a.open>0.02?"var(--ok)":"var(--muted)"})+K.tag(540,372,K.f0(b.open*100)+"% OPEN",{fill:b.open>0.02?"var(--ok)":"var(--muted)"})}},
 {t:"Fail-safe: pick the normal position on purpose",
  body:`<p>Air fails: the compressor dies, a tube breaks, someone shuts the main. Every actuator goes to its <b>normal position</b>. So designers pick NO or NC for what is <b>safe</b> when that happens:</p><ul><li><b>Heating coil valve: NO.</b> Full heat keeps the coil and the building from freezing.</li><li><b>Outside air damper: NC.</b> No frozen coil from subzero outside air.</li><li><b>Cooling valve: NC.</b> No cooling fighting the heat.</li><li><b>Return air damper: NO.</b> The fan still has air to move.</li></ul><p>Electric actuators do the same with a <b>spring return</b>: lose 24 V and the spring drives them to the fail position.</p>`,
  draw:()=>K.cards([{t:"HEATING VALVE: NO",c:C.HW,inner:actCut(80,46,{x:0,nc:false,psi:0,s:.25}).s+K.lbl(150,80,"NO AIR: OPEN",{a:"start",size:14,fill:"var(--ok)"})+K.txt(150,104,"coil gets full heat",{a:"start"}),note:"protects the coil from freezing"},
   {t:"COOLING VALVE: NC",c:C.CW,inner:actCut(80,46,{x:0,nc:true,psi:0,s:.25}).s+K.lbl(150,80,"NO AIR: CLOSED",{a:"start",size:14,fill:"var(--muted)"})+K.txt(150,104,"no chilled water",{a:"start"}),note:"doesn't fight the heat"},
   {t:"OUTSIDE AIR DAMPER: NC",c:"#3a7bd5",inner:C.duct(20,50,150,70)+C.damper(70,50,50,70,0,{n:3})+K.lbl(190,80,"NO AIR: SHUT",{a:"start",size:14,fill:"var(--muted)"})+K.txt(190,104,"keeps out cold air",{a:"start"}),note:"freeze protection"},
   {t:"RETURN AIR DAMPER: NO",c:"#7a8288",inner:C.duct(20,50,150,70)+C.damper(70,50,50,70,1,{n:3})+K.arrow("M30 85 H62","#7a8288",2)+K.arrow("M128 85 H160","#7a8288",2)+K.lbl(190,80,"NO AIR: OPEN",{a:"start",size:14,fill:"var(--ok)"})+K.txt(190,104,"fan still has air",{a:"start"}),note:"no starved fan"}])},
 {t:"One signal, two devices",
  body:`<p>Because spring ranges differ, <b>one branch line can run two devices in order</b>. Tee a 3 to 8 psi NO heating valve and an 8 to 13 psi NC cooling valve onto the same branch:</p><ul><li>Low branch (room cold): heating open, cooling shut.</li><li>As the branch rises, the heating valve closes first.</li><li>Only then does the cooling valve start to open.</li></ul><p>That's called <b>sequencing</b>. In practice you want a gap between the ranges so they never both open. That gap, the <b>dead band</b>, is the next lesson.</p>`,
  init:{p:5},ctl:{html:sl("p3","Branch pressure",0,15,0.5,5,"5.0 psi"),input:(t,s)=>{s.p=+t.value;document.getElementById("lso_p3").textContent=K.f1(t.value)+" psi"}},
  draw:s=>{const p=s.p??5,h=1-C.stroke(p,3,8),c=C.stroke(p,8,13);
   let o=C.bar(70,70,560,{row:true,ranges:[{a:3,b:8,c:C.HW,lbl:"HEATING NO 3-8"},{a:8,b:13,c:C.CW,lbl:"COOLING NC 8-13"}],br:p,rh:34});
   o+=C.valve(200,300,{s:.7,open:h,x:1-h,kind:"pn"})+C.pipe("M100 300 H170",C.HW)+C.valve(520,300,{s:.7,open:c,x:c,kind:"pn"})+C.pipe("M550 300 H620",C.CW);
   o+=K.tag(200,358,"HEATING "+K.f0(h*100)+"% OPEN",{fill:C.HW})+K.tag(520,358,"COOLING "+K.f0(c*100)+"% OPEN",{fill:C.CW});
   o+=C.tube("M200 212 V190 H520 V212",p)+C.tube("M360 190 V150",p)+K.txt(370,166,"one branch",{a:"start"});
   return o}}];
/* ---------- See it ---------- */
const see=K.see({init:{br:0,rng:2,nc:0,dev:0,lost:false},
 sliders:[["br","Branch pressure",0,20,0.5,v=>K.f1(v)+" psi"],["rng","Spring range",0,5,1,fmtR],["nc","Normal position",0,1,1,v=>v?"Normally closed":"Normally open"],["dev","Device",0,2,1,v=>DEV[v].n]],
 checks:[["lost","Main air lost (branch goes to 0)"]],
 model,draw:seeDraw,
 reads:(R,S)=>[["Branch",K.f1(R.br)+" psi"],["Spring range",R.a+" to "+R.b+" psi"],["Stem stroke",K.f0(R.x*100)+"%"],["Device",K.f0(R.open*100)+"% open"],["On loss of air",R.fail?"goes open":"goes closed"],["Fail-safe for this device",R.safe?"yes":"no",!R.safe]],
 note:(R,S)=>(S.lost?"<b>Air lost:</b> the spring has driven it to its normal position. ":"")+(R.safe?DEV[S.dev].why:`<b class="bad">Not fail-safe.</b> A ${DEV[S.dev].n.toLowerCase()} should be ${DEV[S.dev].safe?"normally closed":"normally open"}.`),
 log:[["Branch",R=>K.f1(R.br)],["Range",R=>R.a+"-"+R.b],["NO/NC",(R,S)=>S.nc?"NC":"NO"],["Open",R=>K.f0(R.open*100)+"%"]]});
/* ---------- Try it ---------- */
const tasks=[
 K.goal({t:"Half open",intro:"Set an <b>8 to 13 psi</b>, <b>normally closed</b> actuator. Find the branch pressure that holds it at <b>50% open</b>.",
  check:(S,R)=>S.rng!==4?"Pick the 8 to 13 psi spring range.":!S.nc?"Set it to normally closed.":S.lost?"Untick Main air lost.":Math.abs(R.open-0.5)<0.01?true:`${K.f0(R.open*100)}% open at ${K.f1(R.br)} psi.`,
  ok:"10.5 psi: halfway through the 5 psi range (8 + 2.5). Midpoint of any range = (start + end) ÷ 2."}),
 K.goal({t:"Make the outside air damper fail safe",intro:"Pick <b>Outside air damper</b>, set it up so it is <b>fail-safe</b>, then tick <b>Main air lost</b> and check that it shut.",
  check:(S,R)=>S.dev!==1?"Pick the outside air damper.":!R.safe?"It isn't fail-safe yet. What should outside air do when the air fails?":!S.lost?"Now tick Main air lost.":R.open>0.01?"It should be shut with no air.":true,
  ok:"Normally closed: with no air the spring shuts it, so a dead compressor in January can't freeze the coil."}),
 K.caseTask({t:"Service call: frozen coil after a power outage",intro:"January. The control air compressor lost power overnight. By morning the hot water coil in AHU-2 had split. Someone replaced the heating valve actuator last fall.",
  state:{br:0,rng:2,nc:1,dev:0,lost:true},model,draw:seeDraw,
  reads:(R)=>[["Branch",K.f1(R.br)+" psi"],["Heating valve",K.f0(R.open*100)+"% open"],["Outside air damper","closed"]],
  actions:[["Read the actuator label",()=>"Label: spring range 3 to 8 psi, NC (push to open) valve body."]],
  causes:[["nc","Heating valve installed normally closed"],["rng","Wrong spring range"],["damper","Outside air damper failed open"],["comp","Compressor too small"]],ans:"nc",
  why:"With no air every actuator goes to its normal position. A normally closed heating valve shut off the hot water while the coil sat in cold air. Heating coil valves should be normally open so they fail to full heat.",
  hint:"The outside air damper did its job. Where did the heating valve go when the air died?"})];
window.LESSON={id:"ctl-spring",sec:"Controls",secHref:"/controls/",title:"Normally open, normally closed and spring ranges",lead:"How a diaphragm and spring position a valve or damper, what a spring range means, and why the normal position is chosen to fail safe.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["The actuator <b>label</b>: spring range (for example 3-8 or 8-13 psi) and NO or NC.","<b>Branch</b> at the actuator with a test gauge.","<b>Stem position</b> against the indicator as you change the branch."],
  table:[["Device","Usual normal position","Why"],["Heating coil valve","NO","Fails to full heat, protects from freezing"],["Cooling coil valve","NC","Fails shut, no cooling fighting heat"],["Outside air damper","NC","Fails shut, keeps cold air out"],["Return air damper","NO","Fan always has air"],["Common spring ranges","3-6, 3-8, 4-8, 8-13, 9-13 psi","Check the label"]],tableT:"Normal positions and ranges",
  steps:["Read the label and note the spring range and NO or NC.","Tee in a test gauge or a squeeze bulb and gauge.","Raise the branch slowly. Note where the stem starts to move and where it stops.","Compare with the label. A start point well off the label means a weak spring, a sticky stem or a leak.","Bleed it to 0 and make sure it returns to its normal position."],stepsT:"Stroke-testing an actuator",
  safety:["Lock out the fan before working on a damper actuator: blades and linkages close with force.","A valve that fails to its normal position can send hot water or steam into a coil you're working on. Isolate it."],
  mistakes:["Replacing an NO actuator with an NC one because it was on the truck.","Assuming every 'open' indicator means the same thing: check which way the stem moves.","Forgetting that a loaded valve or damper shifts the real spring range (next lesson)."]}),
 sources:[["The Engineering Mindset: air handling units explained (AHU dampers)","https://theengineeringmindset.com/air-handling-units-explained/"],["Johnson Controls V-3000 pneumatic valve actuators: 3-6, 4-8 and 9-13 psig spring ranges","https://www.cochranesupply.com/media/assets/product/documents/Johnson/V-3000-1.pdf"],["ACHR News: demystifying controls (NO heating valve open with no air, NC cooling valve 9-13 psi)","https://www.achrnews.com/articles/96989-demystifying-controls"],["Troubleshooting basic pneumatics (typical heating 3-8 psi, cooling 8-13 psi)","https://jswmi.happyfox.com/kb/article/298-troubleshooting-basic-pneumatics"],["Belimo NRF24A-SR-O spring-return actuator: springs open on power loss","https://tameson.com/products/actuator-modulating-2-10v-fail-safe-24-v-ac-dc-10nm-ip54-belimo-v2vt2"]]};
})();
