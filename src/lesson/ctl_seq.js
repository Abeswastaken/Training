/* ============ Lesson: Sequencing a heating valve and a cooling valve on one branch, with a dead band ============ */
(()=>{
const C=CTK,SP=72;
const sl=(id,lab,min,max,step,val,out)=>`<div class="row"><label for="ls_${id}">${lab}</label><output id="lso_${id}">${out}</output><input type="range" id="ls_${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
/* heating NO valve hs..hs+4, cooling NC valve cs..cs+4. Spring range shift sh: NO range moves up, NC range moves down (loaded actuators). */
const model=S=>{const sens=S.sens||2.5,br=C.branch(S.room,SP,true,sens,20),ha=S.hs+S.sh,hb=S.hs+4+S.sh,ca=S.cs-S.sh,cb=S.cs+4-S.sh;
 const h=1-C.stroke(br,ha,hb),c=C.stroke(br,ca,cb),db=ca-hb,mix=62,afterH=mix+40*h,sat=afterH-(afterH-52)*c*0.85;
 return {br,ha,hb,ca,cb,h,c,db,dbF:db/sens,sens,sat,fight:h>0.005&&c>0.005}};
/* ---------- air handler: thermostat, one branch to both valves ---------- */
function ahu(R,S,o={}){const y0=o.y??150;let s="";
 s+=C.duct(30,y0,520,110)+K.arrow(`M44 ${y0+55} H120`,"#8aa0b0",2.6)+K.lbl(40,y0-10,"MIXED AIR 62°F",{a:"start",size:12});
 s+=C.coil(170,y0+5,40,100,C.HW)+C.coil(300,y0+5,40,100,C.CW)+K.lbl(190,y0+130,"HEATING",{size:12})+K.lbl(320,y0+130,"COOLING",{size:12});
 const tc=T=>T>76?"var(--hot)":T<60?"var(--cold)":"var(--ok)";s+=K.arrow(`M380 ${y0+55} H530`,tc(R.sat),3)+K.tag(456,y0+44,"SUPPLY "+K.f0(R.sat)+"°F",{fill:tc(R.sat)});
 s+=C.valve(190,y0-30,{s:.55,open:R.h,x:1-R.h,kind:"pn"})+C.valve(320,y0-30,{s:.55,open:R.c,x:R.c,kind:"pn"});
 s+=C.pipe(`M190 ${y0-14} V${y0+4}`,C.HW,6)+C.pipe(`M320 ${y0-14} V${y0+4}`,C.CW,6);s+=K.tag(232,y0-56,"NO "+K.f0(R.h*100)+"%",{a:"start",fill:R.h>0.005?C.HW:"var(--muted)"})+K.tag(362,y0-56,"NC "+K.f0(R.c*100)+"%",{a:"start",fill:R.c>0.005?C.CW:"var(--muted)"});
 s+=C.tube(`M190 ${y0-94} V${y0-112} H620 V${y0-60}`,R.br)+C.tube(`M320 ${y0-112} V${y0-94}`,R.br);
 s+=`<g transform="translate(592 ${y0-60}) scale(.5)">`+C.tstat(0,0,{room:S.room,sp:SP,ports:false})+`</g>`+K.lbl(620,y0+40,K.f1(S.room)+"°F",{size:24,fill:S.room>SP+0.5?"var(--hot)":S.room<SP-0.5?"var(--cold)":"var(--ok)"})+K.lbl(620,y0+60,"ROOM, SP 72",{size:11});
 if(R.fight)s+=K.tag(490,y0-18,"HEAT AND COOL FIGHTING",{fill:"var(--bad)"});
 return s}
const rangeBar=(R,y,o={})=>C.bar(80,y,540,{row:true,max:15,rh:o.rh||30,ranges:[{a:R.ha,b:R.hb,c:C.HW,lbl:"HEAT NO"},{a:R.ca,b:R.cb,c:C.CW,lbl:"COOL NC"}],br:o.nobr?null:R.br,db:R.db>0?[R.hb,R.ca]:null});
/* ---------- steps ---------- */
const D0=model({room:72,hs:3,cs:9,sh:0});
const steps=[
 {t:"One thermostat, two coils",
  body:`<p>Many air handlers have a <b>hot water coil</b> and a <b>chilled water coil</b> controlled by one thermostat. Both valves are teed onto the <b>same branch line</b>.</p><p>The heating valve is <b>NO</b> and the cooling valve is <b>NC</b>, with different spring ranges. As the branch rises, heat closes first, then cooling opens. That's <b>sequencing</b>.</p><p>The goal is simple: <b>never heat and cool at the same time</b>. That just burns energy at both ends.</p>`,
  draw:()=>ahu(model({room:71,hs:3,cs:9,sh:0}),{room:71},{y:180})},
 {t:"Lay both ranges on one scale",
  body:`<p>Draw the spring ranges on the same psi scale:</p><ul><li>Heating NO, <b>3 to 7 psi</b>: full open at 3, shut at 7.</li><li>Cooling NC, <b>9 to 13 psi</b>: shut until 9, full open at 13.</li></ul><p>Between 7 and 9 psi neither valve is open. That gap is the <b>dead band</b>: 2 psi here. These are the ranges in the Controls trainer, and the same 3-7 / 9-13 split with a 2 psi dead band appears in the military's HVAC control design manual (UFC 3-410-02A).</p>`,
  draw:()=>{let s=rangeBar(D0,70,{nobr:true,rh:34})+K.lbl(80,40,"SPRING RANGES ON ONE BRANCH",{a:"start"});
   s+=K.chart({x:80,y:190,w:540,h:120,X:[0,15],Y:[0,100],xt:[0,3,6,9,12,15],yt:[0,100],yf:v=>v+"%",xl:"branch psi",yl:"open",series:[{f:p=>(1-C.stroke(p,3,7))*100,c:C.HW,lbl:"HEATING",lblAt:2,a:"start",dx:0,dy:-8,n:150},{f:p=>C.stroke(p,9,13)*100,c:C.CW,lbl:"COOLING",lblAt:14.5,a:"end",dy:-8,n:150}],bands:[]});
   s+=`<rect x="${80+7/15*540}" y="190" width="${2/15*540}" height="120" fill="var(--muted)" opacity=".14"/>`+K.lbl(80+8/15*540,250,"DEAD BAND",{size:12});
   return s}},
 {t:"The dead band in degrees",
  body:`<p>The thermostat turns degrees into psi through its <b>sensitivity</b>. So the dead band in degrees is:</p><p class="lsKey">Dead band °F = dead band psi ÷ sensitivity</p><p>2 psi at 2.5 psi per °F is 0.8°F. In that window the room <b>coasts</b>: no heating, no cooling. A wider dead band saves more energy but lets the room drift more. Drag the sensitivity.</p>`,
  init:{se:2.5},ctl:{html:sl("se","Sensitivity",1,5,0.5,2.5,"2.5 psi/°F"),input:(t,s)=>{s.se=+t.value;document.getElementById("lso_se").textContent=K.f1(t.value)+" psi/°F"}},
  draw:s=>{const se=s.se??2.5,R=model({room:72,hs:3,cs:9,sh:0,sens:se}),Tb=(p)=>SP+(p-8)/se;
   let o=K.chart({x:90,y:40,w:540,h:250,X:[66,78],Y:[0,100],xt:[66,68,70,72,74,76,78],yt:[0,50,100],xf:v=>v+"°",yf:v=>v+"%",xl:"room temperature",yl:"valve open",title:`DA THERMOSTAT, ${K.f1(se)} PSI PER °F`,
    series:[{f:T=>(1-C.stroke(C.branch(T,SP,true,se,20),3,7))*100,c:C.HW,lbl:"HEATING",lblAt:67,a:"start",dx:4,dy:22,n:240},{f:T=>C.stroke(C.branch(T,SP,true,se,20),9,13)*100,c:C.CW,lbl:"COOLING",lblAt:77.6,a:"end",dy:-10,n:240}],vlines:[{x:72,lbl:"SP"}]});
   const X=T=>90+(C.cl(T,66,78)-66)/12*540;o+=`<rect x="${X(Tb(7))}" y="40" width="${X(Tb(9))-X(Tb(7))}" height="250" fill="var(--muted)" opacity=".15"/>`;
   return o+K.lbl(360,370,`DEAD BAND ${K.f1(Tb(7))} TO ${K.f1(Tb(9))}°F = ${K.f1(R.dbF)}°F`,{size:15,fill:"var(--brass)"})}},
 {t:"Spring range shift: the hidden overlap",
  body:`<p>The spring range on the label is measured with <b>no load</b>. Installed, the valve's water pressure or the damper's air pushes on the plug or blades, and the actual range moves. Schneider Electric's note on this: the <b>NO valve's range shifts up</b> and the <b>NC valve's range shifts down</b>.</p><p>So two ranges that looked separate on paper can overlap in the field, and <b>both valves open at once</b>. Drag the shift and watch the dead band disappear.</p><p>The fix is a <b>positive positioner</b> on each actuator, or springs picked with a wider gap.</p>`,
  init:{sh:0},ctl:{html:sl("sh","Spring range shift",0,2.5,0.5,0,"0.0 psi"),input:(t,s)=>{s.sh=+t.value;document.getElementById("lso_sh").textContent=K.f1(t.value)+" psi"}},
  draw:s=>{const sh=s.sh??0,R=model({room:72,hs:3,cs:9,sh});
   let o=K.lbl(80,36,"ON THE LABEL",{a:"start",size:13})+C.bar(80,60,540,{row:true,max:15,rh:26,ranges:[{a:3,b:7,c:C.HW,lbl:"3-7"},{a:9,b:13,c:C.CW,lbl:"9-13"}]});
   o+=K.lbl(80,196,"INSTALLED, WITH "+K.f1(sh)+" PSI SHIFT",{a:"start",size:13})+`<g opacity=".9">`+C.bar(80,220,540,{row:true,max:15,rh:26,ranges:[{a:R.ha,b:R.hb,c:C.HW,lbl:K.f1(R.ha)+"-"+K.f1(R.hb)},{a:R.ca,b:R.cb,c:C.CW,lbl:K.f1(R.ca)+"-"+K.f1(R.cb)}]})+`</g>`;
   if(R.db<0)o+=`<rect x="${80+R.ca/15*540}" y="214" width="${-R.db/15*540}" height="38" fill="none" stroke="var(--bad)" stroke-width="3" stroke-dasharray="5 4"/>`;
   return o+K.tag(360,350,R.db>0?"DEAD BAND "+K.f1(R.db)+" PSI":R.db===0?"NO DEAD BAND":"OVERLAP "+K.f1(-R.db)+" PSI: BOTH OPEN",{fill:R.db>0?"var(--ok)":"var(--bad)"})}},
 {t:"Checking a sequence in the field",
  body:`<p>Don't trust the labels. Stroke-test both actuators on the real branch:</p><ol><li>Tee a test gauge into the branch and take control of it (squeeze bulb, a hand-held pressure source, or by turning the thermostat).</li><li>Raise it slowly from 0. Note where the heating valve <b>finishes closing</b>.</li><li>Keep going. Note where the cooling valve <b>starts opening</b>.</li><li>The difference is your real dead band. You want it positive, about 1 to 2 psi.</li></ol><p>If they overlap, adjust the positioners' start points (UFC 3-410-02A: set each positioner's start and span) or swap a spring.</p>`,
  draw:()=>{let s=`<rect x="60" y="30" width="600" height="320" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(80,60,"STROKE TEST LOG: AHU-3",{a:"start"});
   const rows=[["","LABEL","MEASURED"],["Heating valve NO: fully closed at","7 psi","8.0 psi"],["Cooling valve NC: starts to open at","9 psi","8.4 psi"],["Dead band","2 psi","0.4 psi"]];
   rows.forEach((r,i)=>{const y=100+i*40;s+=K.txt(80,y,r[0],{a:"start",fill:i?undefined:"var(--brass)"})+K.txt(470,y,r[1],{fill:i?undefined:"var(--brass)"})+K.txt(590,y,r[2],{fill:i===3?"var(--bad)":i?"var(--ink)":"var(--brass)"});if(i<3)s+=`<path d="M80 ${y+14} H640" stroke="var(--panel-edge)"/>`});
   s+=C.bar(100,280,500,{row:true,max:15,rh:20,ranges:[{a:4,b:8,c:C.HW,lbl:""},{a:8.4,b:12.4,c:C.CW,lbl:""}]});
   return s+K.lbl(360,264,"TOO TIGHT: RAISE THE COOLING START OR LOWER THE HEATING RANGE",{size:12,fill:"var(--bad)"})}}];
/* ---------- See it ---------- */
const see=K.see({init:{room:72,hs:3,cs:9,sh:0},vb:"0 0 720 400",
 sliders:[["room","Room temperature",66,78,0.1,v=>K.f1(v)+"°F"],["hs","Heating valve range start (NO, 4 psi span)",1,8,0.5,v=>K.f1(v)+" to "+K.f1(v+4)+" psi"],["cs","Cooling valve range start (NC, 4 psi span)",5,12,0.5,v=>K.f1(v)+" to "+K.f1(v+4)+" psi"],["sh","Spring range shift (installed load)",0,2.5,0.5,v=>K.f1(v)+" psi"]],
 model,draw:(R,S)=>rangeBar(R,40,{rh:26})+ahu(R,S,{y:232}),
 reads:(R,S)=>[["Branch",K.f1(R.br)+" psi"],["Heating valve",K.f0(R.h*100)+"% open"],["Cooling valve",K.f0(R.c*100)+"% open"],["Dead band",R.db>=0?K.f1(R.db)+" psi = "+K.f1(R.dbF)+"°F":"overlap "+K.f1(-R.db)+" psi",R.db<=0],["Supply air",K.f0(R.sat)+"°F"],["Heat and cool together",R.fight?"yes":"no",R.fight]],
 note:(R,S)=>R.fight?`<b class="bad">Fighting:</b> the branch is at ${K.f1(R.br)} psi, inside both valves' ranges.`:R.db<=0?"The ranges touch or overlap. Somewhere on the way up both valves will be open.":R.h<0.005&&R.c<0.005?"In the dead band: both valves shut, the room coasts.":R.h>0?"Heating: the branch is below the heating valve's closed point.":"Cooling: the branch is past the cooling valve's start.",
 log:[["Room",(R,S)=>K.f1(S.room)],["Branch",R=>K.f1(R.br)],["Heat",R=>K.f0(R.h*100)+"%"],["Cool",R=>K.f0(R.c*100)+"%"],["DB psi",R=>K.f1(R.db)]]});
/* ---------- Try it ---------- */
const tasks=[
 K.goal({t:"Find the dead band",intro:"With the trainer's ranges (heating <b>3 to 7</b>, cooling <b>9 to 13</b>, <b>no shift</b>), set the room so <b>both valves are shut</b>.",
  check:(S,R)=>S.hs!==3||S.cs!==9||S.sh!==0?"Reset to heating 3, cooling 9 and no shift.":R.h>0.001||R.c>0.001?`Heating ${K.f0(R.h*100)}%, cooling ${K.f0(R.c*100)}%. Get both to 0.`:true,
  ok:"Both shut between 71.6 and 72.4°F (7 to 9 psi at 2.5 psi per °F): a 0.8°F dead band."}),
 K.goal({t:"Fix the overlap",intro:"The installed valves show <b>1.5 psi</b> of spring range shift. Move the range starts so the dead band is at least <b>1 psi</b>, and the cooling valve is still fully open by <b>15 psi</b>.",
  check:(S,R)=>S.sh!==1.5?"Set the spring range shift to 1.5 psi.":R.db<1?`Dead band is ${R.db<0?"an overlap of "+K.f1(-R.db):K.f1(R.db)} psi. Lower the heating start or raise the cooling start.`:R.cb>15?`The cooling valve now needs ${K.f1(R.cb)} psi to open fully. Main air won't help a 3 to 15 psi thermostat get there.`:true,
  ok:(S,R)=>`Installed ranges ${K.f1(R.ha)}-${K.f1(R.hb)} and ${K.f1(R.ca)}-${K.f1(R.cb)} psi: ${K.f1(R.db)} psi dead band.`}),
 K.caseTask({t:"Service call: high gas and chiller bills, room is fine",intro:"The room holds 72°F, but the trend shows the boiler and the chiller both loaded all spring. Last month someone adjusted the heating valve's positioner.",
  state:{room:72.4,hs:5,cs:9,sh:0.5},model,draw:(R,S)=>rangeBar(R,40,{rh:26})+ahu(R,S,{y:232}),vb:"0 0 720 400",
  reads:R=>[["Branch",K.f1(R.br)+" psi"],["Heating valve",K.f0(R.h*100)+"% open"],["Cooling valve",K.f0(R.c*100)+"% open"],["Supply air",K.f0(R.sat)+"°F"]],
  actions:[["Stroke-test both valves",R=>`Heating closes fully at ${K.f1(R.hb)} psi. Cooling starts to open at ${K.f1(R.ca)} psi.`]],
  causes:[["overlap","Heating range set too high: it overlaps cooling"],["sens","Thermostat too sensitive"],["main","Main air too low"],["stuck","Cooling valve stuck open"]],ans:"overlap",
  why:"The heating valve now finishes closing above the point where the cooling valve starts, so near setpoint both are open and the coils cancel each other out. Set the heating positioner back to 3 to 7 psi to restore a dead band.",
  hint:"Compare where one valve finishes with where the other starts."})];
window.LESSON={id:"ctl-seq",sec:"Controls",secHref:"/controls/",title:"Sequencing two devices on one signal",lead:"How a heating valve and a cooling valve share one branch line, why the dead band between their spring ranges matters, and how spring range shift makes them fight.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Branch</b> at both actuators.","Where the heating valve <b>finishes closing</b> and the cooling valve <b>starts opening</b> (stroke test).","<b>Supply air</b> temperature and both coils' leaving water: a warm chilled water return with the heat on is a sign of fighting."],
  table:[["Item","Typical","Problem if"],["Heating NO range","3-7 or 3-8 psi","Finishes above the cooling start"],["Cooling NC range","8-13 or 9-13 psi","Starts below the heating finish"],["Dead band","1 to 2 psi (under 1°F at 2.5 psi/°F)","Zero or negative: both valves open"],["Damper and economizer","Often a third range in the sequence","Overlaps mechanical cooling"]],tableT:"What a good sequence looks like",
  steps:["Read both actuator labels.","Tee in a test gauge and control the branch.","Raise it from 0. Record where heating closes and where cooling opens.","Adjust positioners or change springs for a 1 to 2 psi gap.","Recheck with the system running: shift shows up under real water pressure."],stepsT:"Setting up the sequence",
  safety:["Don't strand the coil: on a freeze day make sure the heating valve still opens fully at a low branch."],
  mistakes:["Setting ranges on the bench with no load and calling it done.","Closing the dead band to 'tighten control': it just makes the valves fight.","Adjusting one positioner without rechecking the other."]}),
 sources:[["The Engineering Mindset: air handling units explained (heating and cooling coils)","https://theengineeringmindset.com/air-handling-units-explained/"],["UFC 3-410-02A: sequencing actuators 3-7 and 9-13 psig with a 2 psig dead band","https://buildingcriteria1.tpub.com/ufc_3_410_02a/ufc_3_410_02a0038.htm"],["Schneider Electric: pneumatic actuator spring range shift","https://community.se.com/t5/Building-Automation-Knowledge/What-is-pneumatic-actuator-spring-range-shift-and-how-to/ta-p/8620"],["ACHR News: demystifying controls (heating 4-8 psi and cooling 9-13 psi on one thermostat)","https://www.achrnews.com/articles/96989-demystifying-controls"]]};
})();
