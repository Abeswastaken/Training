/* ============ Lesson: Reversing and interlocks ============ */
(()=>{
const PC=TPK.PC;
/* lead hookups at the F contactor's output: line index landed on T1, T2, T3 */
const PERM=[[0,1,2],[2,1,0],[1,0,2],[0,2,1],[1,2,0],[2,0,1]];
const PNAME=p=>p.map(l=>"L"+(l+1)).join("-");
/* direction from the phase order at T1, T2, T3: 1 = clockwise (forward), -1 = counterclockwise */
const dirOf=seq=>((seq[1]-seq[0]+3)%3)===1?1:-1;
const swap13=l=>l===0?2:l===2?0:1;
const ACT=["Stopped","Press FWD","Press REV (from stop)","Running FWD, press REV","Press FWD and REV together"];
/* control logic. returns contactor states and what happened */
const logic=S=>{const a=S.act;let F=false,R=false,res="ok",msg="";const fla=14;
 if(a===1){F=true;msg="F pulls in and seals in."}
 if(a===2){R=true;msg="R pulls in and seals in."}
 if(a===3){if(S.pbi){R=true;res="plug";msg="REV's NC block opens the F rung, F drops, then R pulls in: the motor is slammed into reverse while it's still turning (plugging). High current for a moment, hard on the load."}
  else if(S.elec){F=true;res="blocked";msg="Nothing happens: F's NC interlock contact in the R rung is open. Press STOP, let it slow down, then press REV."}
  else if(S.mech){F=true;res="coil";msg="R's coil gets power but the mechanical interlock won't let it close. A blocked AC coil draws inrush current and burns out if it's held."}
  else{F=R=true;res="short";msg="F and R both closed. R crosses L1 and L3, so L1 is shorted to L3: the fuses blow."}}
 if(a===4){if(S.pbi){res="none";msg="Each button's NC block opens the other rung, so neither coil gets power. Nothing starts."}
  else if(S.mech){F=true;res="one";msg="Both coils get power at once. The mechanical interlock lets only one close (here F); then F's NC contact drops R's coil."+(S.elec?"":" Without the electrical interlock, R's coil stays energized against the lever.")}
  else if(S.elec){F=R=true;res="race";msg="Both coils get power at the same instant, before either NC interlock contact has opened. It's a race the starter can lose: assume a short. The mechanical interlock is what covers this."}
  else{F=R=true;res="short";msg="Both close: L1 shorts to L3 through the R contactor. The fuses blow."}}
 const seqF=PERM[S.perm],seqR=seqF.map(swap13),short=F&&R;
 const run=!short&&(F||R),dir=run?dirOf(F?seqF:seqR):0;
 const amps=short?NaN:res==="plug"?fla*6.5:run?fla:0;
 return {F,R,res,msg,short,run,dir,amps,seqF,seqR,a,
  bad:res==="short"||res==="race"||(res==="coil")||(a===4&&res==="one"&&!S.elec),
  coilF:F||(a===4&&!S.pbi&&res!=="none"),coilR:R||(a===3&&!S.pbi&&!S.elec)||(a===4&&!S.pbi&&!(res==="one"&&S.elec))}};
/* power circuit: F and R contactors, crossed outputs, motor end view */
const power=(G,L,S,o={})=>{let s="";const sc=.55,fx=30,rx=150,cy=70,fp=TPK.cx(0).map(v=>fx+v*sc),rp=TPK.cx(0).map(v=>rx+v*sc),yT=cy+15*sc,yB=cy+135*sc;
 const lineOn=!L.short||!o.blown;
 [0,1,2].forEach(k=>{const y=24+k*12;s+=TPK.wire(`M26 ${y} H${rp[k]} V${yT}`,PC[k],lineOn,3)+TPK.wire(`M${fp[k]} ${y} V${yT}`,PC[k],lineOn,3)+TPK.dot(fp[k],y,false);
  s+=K.txt(22,y+5,"L"+(k+1),{a:"end"})});
 s+=`<g transform="translate(${fx} ${cy}) scale(${sc})">${TPK.contactor(G,0,0,{on:L.F,aux:"NC"})}</g><g transform="translate(${rx} ${cy}) scale(${sc})">${TPK.contactor(G,0,0,{on:L.R,aux:"NC"})}</g>`;
 s+=K.lbl(fx-6,cy+48,"F",{a:"end",size:16,fill:L.F?"var(--ok)":"var(--ink)"})+K.lbl(rx+72,cy+48,"R",{a:"start",size:16,fill:L.R?"var(--ok)":"var(--ink)"});
 if(S.mech)s+=`<path d="M${fx+66} ${cy+40} H${rx}" stroke="var(--ink)" stroke-width="3" stroke-dasharray="3 4"/>`+K.txt((fx+66+rx)/2,cy+30,"lever",{});
 /* T columns: which line feeds each motor lead right now */
 const feed=[0,1,2].map(j=>L.short?null:L.F?j:L.R?swap13(j):null),mf=[0,1,2].map(j=>L.short?null:L.F?L.seqF[j]:L.R?L.seqR[j]:null);
 const tx=fp,ty=232;
 [0,1,2].forEach(j=>{s+=TPK.wire(`M${tx[j]} ${yB} V${ty}`,feed[j]==null?"#8e969b":PC[feed[j]],feed[j]!=null,3)});
 /* R's output k crosses to the T column that F's line k feeds in the normal hookup, so R swaps L1 and L3 */
 [0,1,2].forEach(k=>{const to=2-k,y=yB+16+k*11;s+=TPK.wire(`M${rp[k]} ${yB} V${y} H${tx[to]}`,PC[k],L.R&&!L.short,3)+TPK.dot(tx[to],y,false)});
 s+=K.txt(rp[2]+14,yB+30,"R swaps",{a:"start"})+K.txt(rp[2]+14,yB+48,"L1 and L3",{a:"start"});
 /* landed leads: the perm says which T column goes to motor T1..T3 (drawn as a crossing box) */
 const mx=63,my=318,mr=40;s+=`<rect x="24" y="${ty}" width="78" height="22" rx="3" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.txt(63,ty+16,"LEADS: "+PNAME(PERM[S.perm]).replace(/L/g,""),{});
 [0,1,2].forEach(j=>{const ang=(-90+j*120)*Math.PI/180,ex=mx+Math.cos(ang)*mr,ey=my+Math.sin(ang)*mr;const c=tx[PERM[S.perm][j]];s+=`<path d="M${c} ${ty+22} L${c} ${ty+30} L${mx-26+j*26} ${my-mr-6}" stroke="${mf[j]==null?"#8e969b":PC[mf[j]]}" stroke-width="2.4" fill="none"/>`+K.txt(mx-26+j*26+(j-1)*8,my-mr-8,"",{})});
 s+=`<circle cx="${mx}" cy="${my}" r="${mr}" fill="url(#${G.mo})" stroke="#1d2b3a" stroke-width="2"/><circle cx="${mx}" cy="${my}" r="${mr-12}" fill="#2a4057"/><circle cx="${mx}" cy="${my}" r="6" fill="url(#${G.mt})"/>`;
 if(L.run){const sp=L.dir>0?"":`transform="translate(${2*mx} 0) scale(-1 1)"`;s+=`<g ${sp}><g class="lsSpin" style="transform-origin:${mx}px ${my}px;animation-duration:1.4s"><path d="M${mx} ${my-6} V${my-mr+14}" stroke="#e3e7ea" stroke-width="4" stroke-linecap="round"/></g></g>`;
  s+=K.arrow(L.dir>0?`M${mx-30} ${my-mr-2} A${mr+8} ${mr+8} 0 0 1 ${mx+mr+6} ${my+6}`:`M${mx+30} ${my-mr-2} A${mr+8} ${mr+8} 0 0 0 ${mx-mr-6} ${my+6}`,"var(--ok)",3)}
 s+=K.lbl(mx+mr+26,my+14,L.short?"FUSES BLOWN":L.run?(L.dir>0?"CLOCKWISE":"COUNTER-CW"):"STOPPED",{a:"start",size:14,fill:L.short?"var(--bad)":L.run?(L.F===(L.dir>0)?"var(--ok)":"var(--bad)"):"var(--muted)"});
 s+=K.txt(mx+mr+26,my+36,"seen from shaft end",{a:"start"});
 if(L.short)s+=`<path d="M${fx+20} ${cy+70} l14 -18 l-4 14 l16 -6 l-14 20 l4 -14z" fill="#f08a24" stroke="#d62828" class="lsPulse"/><path d="M${rx+40} ${cy+70} l14 -18 l-4 14 l16 -6 l-14 20 l4 -14z" fill="#f08a24" stroke="#d62828" class="lsPulse"/>`;
 return s};
/* control ladder: STOP, then a FWD rung and a REV rung with optional interlocks */
const ladder=(L,S,x0=272)=>{const X=v=>x0+v,xr=x0+430;let s=TPK.rails(X(8),xr,40,306,true);
 const yF=96,yR=226,fOn=L.coilF,rOn=L.coilR,any=fOn||rOn;const fwdP=L.a===1||L.a===4,revP=L.a===2||L.a===3||L.a===4;
 s+=TPK.seg(X(8),yF,X(20),any)+TPK.pb(X(20),yF,"NC",true,"STOP",any)+TPK.seg(X(64),yF,X(84),any)+TPK.dot(X(84),yF,any)+`<path d="M${X(84)} ${yF} V${yR}" stroke="${TPK.lc(rOn)}" stroke-width="2"/>`;
 const r=(y,on,btn,pr,seal,blk,blkOpen,aux,auxOpen,coil)=>{let g=TPK.pb(X(96),y,"NO",pr,btn,on)+TPK.seg(X(84),y,X(96),on)+TPK.seg(X(140),y,X(154),on);
  g+=`<path d="M${X(84)} ${y} V${y+46} H${X(96)} M${X(140)} ${y+46} H${X(154)} V${y}" stroke="${TPK.lc(on)}" stroke-width="2" fill="none"/>`+TPK.ct(X(96),y+46,"NO",seal,"",on&&seal)+K.txt(X(118),y+72,coil+" seal-in");
  g+=S.pbi?TPK.pb(X(160),y,"NC",!blkOpen,blk,on)+TPK.seg(X(154),y,X(160),on)+TPK.seg(X(204),y,X(214),on):TPK.seg(X(154),y,X(214),on);
  g+=S.elec?TPK.ct(X(214),y,"NC",!auxOpen,aux,on):TPK.seg(X(214),y,X(258),on);
  g+=TPK.seg(X(258),y,X(318),on)+TPK.coil(X(318),y,coil,on)+TPK.seg(X(354),y,xr,on);return g};
 s+=r(yF,fOn,"FWD",fwdP,L.F,"REV",revP,"R NC",L.R,"F");
 s+=r(yR,rOn,"REV",revP,L.R,"FWD",fwdP,"F NC",L.F,"R");
 if(!S.pbi&&!S.elec)s+=K.txt(X(236),yF+30,"no interlocks",{fill:"var(--bad)"});
 return s};
const draw=(L,S,o={})=>{const G=TPK.defs();let s=G.s+power(G,L,S,o)+ladder(L,S);
 s+=`<rect x="272" y="318" width="440" height="56" rx="8" fill="var(--paper)" stroke="${L.bad?"var(--bad)":"var(--panel-edge)"}"/>`+K.lbl(286,340,ACT[S.act],{a:"start",size:14});
 s+=K.txt(286,363,L.short?"PHASE-TO-PHASE SHORT":L.res==="race"?"RACE: ASSUME A SHORT":L.res==="coil"?"BLOCKED COIL: IT WILL OVERHEAT":L.res==="plug"?"PLUGGING: REVERSED WHILE TURNING":L.res==="blocked"?"REV IGNORED UNTIL STOP":L.run?(L.dir>0?"running clockwise":"running counterclockwise"):"motor stopped",{a:"start",fill:L.bad?"var(--bad)":undefined});
 return s};
const st=(o)=>{const S={perm:0,act:0,elec:0,pbi:0,mech:0,...o};return draw(logic(S),S)};
/* step 1: three phases and the rotating field */
const field=()=>{let s=K.chart({x:60,y:40,w:380,h:250,X:[0,360],Y:[-1.2,1.2],xt:[0,90,180,270,360],xf:v=>v+"°",yt:[-1,0,1],yf:v=>v,xl:"one cycle (1/60 s)",title:"L1, L2, L3: SAME WAVE, 120° APART",
  series:[0,1,2].map(k=>({f:t=>Math.sin((t-k*120)*Math.PI/180),c:PC[k],w:3,lbl:"L"+(k+1),lblAt:[90,210,330][k],dy:-14,a:"middle",dx:0}))});
 const cx=580,cy=170,r=110;s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#5c7fa1" stroke="#1d2b3a" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r-26}" fill="var(--paper)" stroke="#1d2b3a"/>`;
 [0,1,2].forEach(k=>{[0,180].forEach(d=>{const a=(-90+k*120+d)*Math.PI/180;s+=`<rect x="${cx+Math.cos(a)*(r-13)-10}" y="${cy+Math.sin(a)*(r-13)-10}" width="20" height="20" rx="3" fill="${PC[k]}" stroke="#1d2b3a" opacity="${d?0.55:1}"/>`});
  const a=(-90+k*120)*Math.PI/180;s+=K.lbl(cx+Math.cos(a)*(r+18),cy+Math.sin(a)*(r+18)+5,"L"+(k+1),{size:13,fill:PC[k]})});
 s+=`<g class="lsSpin" style="transform-origin:${cx}px ${cy}px;animation-duration:3s">${K.arrow(`M${cx} ${cy+50} V${cy-56}`,"#d62828",4)}<text x="${cx+12}" y="${cy+30}" class="lsG" style="text-anchor:start;fill:#d62828">N</text></g>`;
 s+=K.lbl(cx,cy+r+44,"FIELD TURNS L1 → L2 → L3",{size:14});return s};
/* step 2: swap two leads */
const swap=()=>{const G=TPK.defs();let s=G.s;const one=(ox,map,lbl,dir)=>{let g="";const mx=ox+120,my=230,mr=56;
  [0,1,2].forEach(k=>{const x=ox+60+k*60;g+=K.lbl(x,40,"L"+(k+1),{size:14,fill:PC[k]})+TPK.wire(`M${x} 52 V70`,PC[k],true,4)});
  [0,1,2].forEach(k=>{const j=map[k],x0=ox+60+k*60,x1=ox+60+j*60;g+=TPK.wire(`M${x0} 70 L${x1} 110 V${my-mr+8}`,PC[k],true,4);g+=K.txt(x1+10,146,"T"+(j+1),{a:"start"})});
  g+=`<circle cx="${mx}" cy="${my}" r="${mr}" fill="url(#${G.mo})" stroke="#1d2b3a" stroke-width="2"/><circle cx="${mx}" cy="${my}" r="${mr-16}" fill="#2a4057"/><circle cx="${mx}" cy="${my}" r="7" fill="url(#${G.mt})"/>`;
  g+=K.arrow(dir>0?`M${mx-40} ${my+mr+10} A${mr+14} ${mr+14} 0 0 0 ${mx+44} ${my+mr+8}`:`M${mx+40} ${my+mr+10} A${mr+14} ${mr+14} 0 0 1 ${mx-44} ${my+mr+8}`,"var(--ok)",3);
  return g+K.lbl(mx,my+mr+50,lbl,{size:14})};
 s+=one(30,[0,1,2],"L1-T1, L2-T2, L3-T3: CLOCKWISE",1)+one(390,[2,1,0],"L1 AND L3 SWAPPED: COUNTER-CW",-1);
 s+=`<path d="M360 40 V340" stroke="var(--panel-edge)"/>`;return s};
const steps=[
 {t:"Three phases make a rotating field",
  body:`<p>The three lines carry the same AC wave, each one a third of a cycle (120°) behind the last. In the motor's stator, the three windings peak one after another: L1, then L2, then L3.</p><p>That makes a magnetic field that <b>rotates</b> around the stator, 60 times a second for a 2-pole motor. The rotor gets dragged along with it.</p><p>The order the phases peak in, the <b>phase sequence</b> or <b>phase rotation</b>, sets which way the field turns.</p>`,draw:field},
 {t:"Swap any two leads and it runs backward",
  body:`<p>Trade any two of the three lines and the phases peak in the opposite order. The field turns the other way, and so does the motor.</p><ul><li>Swap L1 and L3 (the usual choice), or any other pair: <b>reversed</b>.</li><li>Move all three one place over (L1 to T2, L2 to T3, L3 to T1): <b>same</b> direction. That's not a swap.</li></ul><p>On a new install, <b>bump</b> the motor (start and stop it right away) to check rotation before it runs a pump or fan backward for long.</p>`,draw:swap},
 {t:"The forward/reverse starter",
  body:`<p>A <b>reversing starter</b> is two contactors side by side, sharing one overload relay:</p><ul><li><b>F</b> connects L1-L2-L3 to T1-T2-T3 straight through.</li><li><b>R</b> crosses L1 and L3 on its output, so the motor sees the phases backward.</li></ul><p>Each has its own coil and its own seal-in. Here FWD has been pressed: F is closed and the motor turns clockwise.</p>`,draw:()=>st({act:1,elec:1,mech:1})},
 {t:"What if F and R close together?",
  body:`<p>R's crossover puts L1 where L3 is and L3 where L1 is. With both contactors closed, <b>L1 connects straight to L3</b> through the two sets of contacts.</p><p>That's a <b>phase-to-phase short</b>: huge fault current, an arc inside the starter, and blown fuses or a tripped breaker.</p><p>So a reversing starter must make it impossible for both to close. That's what <b>interlocks</b> are for. This starter has none.</p>`,draw:()=>st({act:3})},
 {t:"Electrical interlock: each coil through the other's NC contact",
  body:`<p>Put a <b>normally closed auxiliary contact</b> of R in series with F's coil, and one of F in series with R's coil.</p><ul><li>When F is in, its NC contact in the R rung is open. Pressing REV does nothing.</li><li>The operator presses STOP, the motor slows down, then REV works.</li></ul><p>Here the motor runs forward and REV is pressed: R's rung is blocked by the open <b>F NC</b> contact.</p>`,draw:()=>st({act:3,elec:1})},
 {t:"Mechanical and pushbutton interlocks",
  body:`<p>Two more layers are common:</p><ul><li><b>Mechanical interlock</b>: a lever between the two contactors. If one is closed, the other physically can't close, even if a contact welds or both coils get power at once. Shown as a dashed line on drawings.</li><li><b>Pushbutton interlock</b>: FWD and REV each have an NC block wired into the other rung. Pressing both at once powers neither coil.</li></ul><p>With pushbutton interlocks, pressing REV while running drops F and pulls in R right away. That's <b>plugging</b>: hard on belts and gears. Many jobs leave it out on purpose.</p>`,draw:()=>st({act:4,elec:1,mech:1,pbi:1})}];
/* ---------- See it ---------- */
const see=K.see({vb:"0 0 720 380",init:{perm:1,act:1,elec:0,pbi:0,mech:0},
 sliders:[["perm","Motor leads landed on",0,5,1,v=>"T1-T2-T3 = "+PNAME(PERM[v])],["act","Operator",0,4,1,v=>ACT[v]]],
 checks:[["elec","Electrical interlock (NC auxiliary contacts)"],["mech","Mechanical interlock"],["pbi","Pushbutton interlock"]],
 model:logic,draw:(L,S)=>draw(L,S),
 reads:(L,S)=>[["F",L.F?"closed":"open"],["R",L.R?"closed":"open"],["Rotation",L.short?"none":L.run?(L.dir>0?"clockwise":"counterclockwise"):"stopped",L.run&&(L.F!==(L.dir>0))],["Phase order at T1-T2-T3",L.short||!L.run?"-":PNAME(L.F?L.seqF:L.seqR)],["Line amps (10 hp)",isNaN(L.amps)?"fault":K.f0(L.amps)+" A",L.short||L.res==="plug"],["Result",L.short?"short":L.res==="race"?"race":L.res==="coil"?"blocked coil":"ok",L.bad]],
 note:(L,S)=>L.msg?L.msg+(L.run&&L.F&&L.dir<0?" But FWD turns it counterclockwise: two leads are swapped.":""):(S.act===0?"Pick an operator action. Watch which contactor closes and which way the motor turns."+(PERM[S.perm].join()!=="0,1,2"?" Check the lead hookup: FWD should turn clockwise.":""):""),
 log:[["Leads",(L,S)=>PNAME(PERM[S.perm])],["Action",(L,S)=>ACT[S.act].split(" (")[0]],["Locks",(L,S)=>[S.elec?"E":"",S.mech?"M":"",S.pbi?"P":""].join("")||"none"],["Result",L=>L.short?"SHORT":L.res]]});
/* ---------- Try it ---------- */
const safe=S=>{const a=logic({...S,act:3}),b=logic({...S,act:4});return {a,b,ok:!a.bad&&!b.bad}};
const tasks=[
 K.goal({t:"Fix the rotation",intro:"After a motor swap, the conveyor runs backward when the operator presses FWD. In See it, re-land the motor leads so FWD turns the motor clockwise, then press FWD.",
  check:(S,L)=>S.act!==1?"Set the operator to Press FWD.":L.dir!==1?"FWD still turns counterclockwise. Swap two leads.":true,
  ok:(S)=>`Clockwise in FWD with the leads on ${PNAME(PERM[S.perm])}. Any hookup with the phases in L1-L2-L3 order works. REV will now turn it counterclockwise, as it should.`}),
 K.goal({t:"Make the starter safe",intro:"Turn on the interlocks a real reversing starter would have, so that neither pressing REV while it runs forward nor pressing both buttons at once can short the lines or leave a coil fighting a lever. Check both actions in See it.",
  check:S=>{const r=safe(S);return r.a.bad?`Running FWD, press REV: ${r.a.res==="short"?"short":"R's coil is held against the lever"}.`:r.b.bad?`Both buttons: ${r.b.res==="race"?"a race the starter can lose":r.b.res==="short"?"short":"the losing coil stays energized against the lever"}.`:true},
  ok:S=>S.mech&&S.elec?"Safe. Electrical plus mechanical is the standard pair; the lever covers a welded contact or a simultaneous press."+(S.pbi?" The pushbutton interlock adds plugging, which some loads can't take.":""):"Safe on these two actions. Real starters still add the mechanical interlock so a welded contact can't cause a short."}),
 K.caseTask({t:"Service call: fuses blow going from forward to reverse",intro:"A hoist motor runs both ways, but if the operator hits REV while it's going up, the 480 V fuses blow. The reversing pair was rebuilt last week from two separate contactors.",
  state:{perm:0,act:3,elec:0,pbi:0,mech:0},model:logic,draw:(L,S)=>draw(L,S,{blown:true}),reads:L=>[["Fuses","2 blown (L1, L3)"],["FWD from stop","works"],["REV from stop","works"],["Rotation","correct both ways"]],
  actions:[["Look at the contactors",()=>"Two plain contactors on the rail. No lever between them."],["Check the control wiring",()=>"The F rung goes STOP, FWD, then straight to coil F. There's no R NC contact in it, and no F NC contact in the R rung."]],
  causes:[["leads","Two motor leads swapped"],["inter","Interlocks missing: no NC contacts and no mechanical lever"],["ol","Overload set too low"],["coil","Open R coil"]],ans:"inter",
  why:"Nothing stops R from closing while F is in. R crosses L1 and L3, so with both in L1 shorts to L3. Add each coil's NC auxiliary contact in the other rung and a mechanical interlock kit.",
  hint:"The fuses blow only when both directions are asked for at once. What should stop that?"})];
window.LESSON={id:"tph-reversing",sec:"3-Phase Motor Control",secHref:"/threephase/",title:"Reversing and interlocks",lead:"Swap two leads and a 3-phase motor runs backward; a reversing starter does it with two contactors that must never close together.",
 steps,see,tryIntro:"Fix a backward motor, make a starter safe, then a service call.",tasks,
 job:K.job({read:["Rotation on startup: bump the motor and watch the shaft or fan.","Phase rotation at the disconnect with a phase rotation meter, before you land new leads.","The interlock contacts: R NC in the F rung and F NC in the R rung.","Whether a mechanical interlock kit is fitted between the contactors."],
  table:[["Interlock","What it stops","What it can't stop"],["Electrical (NC aux)","The second coil getting power while the first is in","Both coils powered at the same instant; a welded main contact if the aux isn't mirror-type"],["Mechanical lever","Both contactors physically closing","A coil held energized against the lever (it overheats)"],["Pushbutton (NC blocks)","Pressing both buttons at once","Plugging when REV is pressed while running"]],tableT:"Interlocks",
  steps:["Before landing leads, check phase rotation at the disconnect so the new motor turns the right way.","Bump the motor with the drive uncoupled if you can, and confirm rotation.","If it's backward, lock out and swap two leads at the motor or the starter output, not at the supply (other loads may depend on supply rotation).","Test the interlocks: with F in, press REV and confirm R doesn't pull in."],
  safety:["Lock out and verify dead before swapping leads. Both contactors' line sides are live with the disconnect on.","Pumps, compressors and fans can be damaged running backward. Scroll compressors are noisy and draw low amps when reversed.","Never defeat an interlock to make a reversing starter work faster."],
  mistakes:["Rolling all three leads and expecting the motor to reverse.","Swapping leads at the main supply, which reverses every motor on that feeder.","Building a reversing pair from two contactors with no mechanical interlock kit.","Wiring a remote or PLC output straight to a coil, around the NC interlock contact."]}),
 sources:[["The Engineering Mindset: Induction motor basics","https://theengineeringmindset.com/induction-motor-basics/"],["Control.com: Reversing motor contactors, interlocking methods that prevent short circuits","https://control.com/industry-articles/reversing-motor-contactors-interlocking-methods-that-prevent-short-circuits/"],["Electrical and Motor Control Theory (Barros), Chapter 11: Reversing motors","https://nmoer.pressbooks.pub/electricalandmotorcontroltheory/chapter/chapter-11/"]]};
})();
