/* ============ Heating lesson kit: furnace, oil burner and hydronic air handler drawings, plus the numbers the lessons calculate ============
 Numbers follow the Heating trainer (src/furnace.js, oil.js, hyd.js): 80,000 Btu/h single-stage furnace, 15 s prepurge, 17 s igniter warm-up,
 7 s trial, flame proven at 1 uA or more, 4 trials then soft lockout, blower on 30 s after flame, 15 s post-purge, 90 to 180 s blower off delay,
 pressure switch closes at -0.65 in. w.c. and opens at -0.55; oil: 0.65 GPH 80 deg A nozzle at 140 psi, cad cell under 1600 ohms;
 hot water coil sized like a First Co HWC1520 (66,300 Btu/h at 3 GPM, 180 deg F water, 1200 CFM, 70 deg F air). */
const HK={};
HK.HOT="#d23a26";HK.HOT2="#9b2a1f";HK.COLD="#2f6fd6";HK.FLUE="#e0662a";HK.GAS="#3a3f44";HK.DK="#1d2327";HK.OK="#1e9a4a";HK.AMB="#c98a1a";
HK.INPUT=80000;HK.EFF=0.80;
HK.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
HK.mix=(a,b,f)=>{f=HK.clamp(f,0,1);return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*f)).join(",")})`};
/* hot water color: 70 deg F pale to 200 deg F deep red */
HK.wcol=T=>HK.mix([214,160,140],[200,40,28],(T-70)/130);
/* ---------- small drawing helpers ---------- */
/* leader line from a part (x1,y1) to a label at (x2,y2) */
HK.co=(x1,y1,x2,y2,t,o={})=>{const a=o.a||(x2<x1?"end":"start");const ex=a==="end"?x2+4:x2-4;
 return `<path d="M${x1} ${y1} L${ex} ${y2-5}" stroke="var(--muted)" stroke-width="1" fill="none"/><circle cx="${x1}" cy="${y1}" r="2.2" fill="var(--muted)"/>`+K.lbl(x2,y2,t,{a,fill:o.fill,size:o.size||13})};
/* flow stripe on a pipe */
HK.pipe=(d,col,w=8,flow=true,speed)=>`<path d="${d}" fill="none" stroke="#3b2a20" stroke-width="${w+2}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`+(flow?`<path class="lsFlow" d="${d}" fill="none" stroke="#fff" stroke-width="${Math.max(1.4,w*0.3)}" stroke-dasharray="6 14" opacity=".75" stroke-linecap="round"${speed?` style="animation-duration:${speed}s"`:""}/>`:"");
HK.gasPipe=d=>`<path d="${d}" fill="none" stroke="#14171a" stroke-width="10" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${HK.GAS}" stroke-width="7" stroke-linejoin="round"/>`;
/* air arrow, dashed like the trainer */
HK.air=(d,col,w=3.2)=>{const id=K.uid("ha");return K.arrowDef(id,col)+`<path class="lsFlow" d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-dasharray="10 7" marker-end="url(#${id})"/>`};
/* digital manometer: x,y top-left, 112 x 150 */
HK.mano=(x,y,val,o={})=>`<g>${zShade(x+56,y+154,52,4)}<rect x="${x}" y="${y}" width="112" height="150" rx="14" fill="#e8c33a" stroke="#6a5212" stroke-width="1.4"/><rect x="${x+8}" y="${y+8}" width="96" height="134" rx="9" fill="#2a2f33"/>
 <rect x="${x+16}" y="${y+18}" width="80" height="40" rx="4" fill="#b9c99a" stroke="#56604a"/><text x="${x+90}" y="${y+46}" style="font-family:var(--mono);font-size:19px;fill:#142014;text-anchor:end">${val}</text><text x="${x+90}" y="${y+56}" style="font-family:var(--mono);font-size:8px;fill:#142014;text-anchor:end">IN. W.C.</text>
 <circle cx="${x+36}" cy="${y+82}" r="9" fill="#4a5257" stroke="#111"/><circle cx="${x+76}" cy="${y+82}" r="9" fill="#4a5257" stroke="#111"/><rect x="${x+26}" y="${y+104}" width="60" height="16" rx="8" fill="#4a5257"/>
 <text x="${x+56}" y="${y+134}" style="font-family:var(--display);font-size:9px;font-weight:700;fill:#c4cacf;text-anchor:middle;letter-spacing:.08em">MANOMETER</text>
 <rect x="${x+28}" y="${y-8}" width="14" height="10" rx="2" fill="#9aa1a8" stroke="#4d555a"/><rect x="${x+70}" y="${y-8}" width="14" height="10" rx="2" fill="#9aa1a8" stroke="#4d555a"/>
 ${o.lbl?K.lbl(x+56,y+178,o.lbl,{size:13}):""}</g>`;
/* digital multimeter: x,y top-left, 110 x 170 */
HK.dmm=(x,y,val,unit,o={})=>`<g>${zShade(x+55,y+174,50,4)}<rect x="${x}" y="${y}" width="110" height="170" rx="12" fill="#d8a020" stroke="#6a4a12" stroke-width="1.4"/><rect x="${x+7}" y="${y+7}" width="96" height="156" rx="8" fill="#2a2f33"/>
 <rect x="${x+14}" y="${y+16}" width="82" height="42" rx="4" fill="#b9c99a" stroke="#56604a"/><text x="${x+90}" y="${y+44}" style="font-family:var(--mono);font-size:20px;fill:#142014;text-anchor:end">${val}</text><text x="${x+90}" y="${y+54}" style="font-family:var(--mono);font-size:8px;fill:#142014;text-anchor:end">${unit}</text>
 <circle cx="${x+55}" cy="${y+96}" r="22" fill="#4a5257" stroke="#111"/><path d="M${x+55} ${y+96} L${x+55+(o.dial||-14)} ${y+80}" stroke="#e9ecee" stroke-width="3" stroke-linecap="round"/>
 <circle cx="${x+30}" cy="${y+142}" r="6" fill="#111" stroke="#c0392b" stroke-width="2"/><circle cx="${x+55}" cy="${y+142}" r="6" fill="#111" stroke="#888" stroke-width="2"/><circle cx="${x+80}" cy="${y+142}" r="6" fill="#111" stroke="#c0392b" stroke-width="2"/>
 ${o.lbl?K.lbl(x+55,y+198,o.lbl,{size:13}):""}</g>`;
/* probe thermometer reading */
HK.thermo=(x,y,T,o={})=>`<g><path d="M${x} ${y} V${y+(o.len||28)}" stroke="#7d868c" stroke-width="3" stroke-linecap="round"/><rect x="${x-(o.w||68)/2}" y="${y-30}" width="${o.w||68}" height="28" rx="5" fill="#2a2f33" stroke="#111"/><text x="${x}" y="${y-10}" style="font-family:var(--mono);font-size:14px;fill:#7CFFB2;text-anchor:middle">${T}</text></g>`;
/* ---------- gas furnace cutaway, 720 x 380 ----------
 R: {ind, ps, ig (0..1 glow), gv, flame (0..1), uA, blower, draft, brd (board text), led ("ok"|"warn"|"bad"|"off"), lazy, dirt (filter 0..1), crack, ret, sup, man, labels:[keys], hl:key, noAir}
 Cabinet x 250..470. Space left of x 240 and right of x 480 is kept for labels. */
HK.FC={vent:[456,26,490,30,"VENT"],inducer:[465,110,490,106,"INDUCER"],ps:[461,148,490,148,"PRESSURE SWITCH"],fs:[432,192,490,180,"FLAME SENSOR"],gv:[466,208,490,236,"GAS VALVE"],
 ig:[256,190,236,186,"IGNITER"],hx:[268,140,236,140,"HEAT EXCHANGER"],burn:[268,206,236,214,"BURNERS"],board:[264,262,236,262,"CONTROL BOARD"],blower:[404,312,490,300,"BLOWER"],
 filter:[252,316,236,292,"FILTER"],limit:[314,219,236,240,"HIGH LIMIT"],coll:[300,76,236,90,"COLLECTOR BOX"],sup:[250,30,236,30,"SUPPLY AIR"],shut:[600,200,600,176,"SHUTOFF"]};
HK.furn=(R={})=>{const ig=R.ig||0,fl=R.flame||0;let s="";
 const hl=k=>R.hl===k?`<rect x="${HK.HLB[k][0]}" y="${HK.HLB[k][1]}" width="${HK.HLB[k][2]}" height="${HK.HLB[k][3]}" rx="6" fill="none" stroke="var(--brass)" stroke-width="3" stroke-dasharray="6 4"/>`:"";
 /* return duct and filter */
 s+=`<rect x="110" y="300" width="142" height="64" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.4"/><rect x="110" y="304" width="142" height="4" fill="rgba(255,255,255,.45)"/>`;
 s+=zFilter(246,296,12,72,K.uid("hd"));if(R.dirt)s+=`<rect x="246" y="296" width="12" height="72" fill="#6b5a3a" opacity="${(0.65*R.dirt).toFixed(2)}"/>`;
 /* supply plenum */
 s+=`<rect x="250" y="0" width="150" height="62" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.4"/><rect x="254" y="0" width="4" height="62" fill="rgba(255,255,255,.45)"/>`;
 /* cabinet */
 s+=`<path d="M470 62 L482 54 V364 L470 372 Z" fill="#8d969c"/><path d="M400 62 L412 54 H482 L470 62 Z" fill="#c4cacf"/>`;
 s+=`<rect x="250" y="62" width="220" height="310" rx="3" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="256" y="68" width="208" height="298" fill="url(#zCabIn)" stroke="#9aa3a9"/>`;
 s+=`<rect x="256" y="68" width="208" height="160" fill="url(#zInside)" opacity=".16"/><path d="M250 228 H470" stroke="#6f787e" stroke-width="3"/>`;
 /* collector box and heat exchanger */
 const hxC=R.hot!=null?HK.mix([154,161,168],[214,70,30],R.hot):fl?HK.mix([154,161,168],[214,70,30],0.28*fl):"#9aa1a8";
 s+=`<rect x="262" y="66" width="168" height="22" rx="3" fill="url(#zSteelH)" stroke="#4d555a"/><text x="346" y="81" style="font-family:var(--display);font-size:9px;font-weight:700;fill:#1d2327;text-anchor:middle;letter-spacing:.06em">COLLECTOR BOX</text>`;
 [266,306,346,386].forEach(x=>{s+=`<rect x="${x+11}" y="86" width="12" height="16" fill="#7d868c"/><path d="M${x} 184 V116 Q${x+17} 92 ${x+34} 116 V184 Z" fill="${hxC}" stroke="#4d555a" stroke-width="1.2"/><path d="M${x+4} 182 V118 Q${x+10} 104 ${x+17} 102" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/><path d="M${x+30} 184 V118" stroke="rgba(0,0,0,.22)" stroke-width="3"/>`});
 if(R.crack)s+=`<path d="M318 128 l6 8 -4 6 7 10 -3 8" stroke="var(--bad)" stroke-width="2.4" fill="none"/>`;
 /* flames */
 if(fl>0)[283,323,363,403].forEach(x=>{const h=30*fl;s+=`<path d="M${x-9} 190 Q${x} ${190-h*1.6} ${x+9} 190 Z" fill="${R.lazy?"#f2a53a":"#3d7de0"}" opacity=".92"/><path d="M${x-4} 190 Q${x} ${190-h*0.9} ${x+4} 190 Z" fill="${R.lazy?"#ffe08a":"#9fd0ff"}"/>`});
 /* burners and manifold */
 [283,323,363,403].forEach(x=>{s+=`<rect x="${x-10}" y="189" width="20" height="13" rx="3" fill="url(#zSteel)" stroke="#4d555a"/><ellipse cx="${x}" cy="190" rx="7" ry="2" fill="#1b1f22"/>`});
 s+=`<rect x="262" y="202" width="182" height="8" rx="3" fill="#8d969c" stroke="#4d555a"/>`+[283,323,363,403].map(x=>zHex(x,206,3.2)).join("");
 /* igniter */
 s+=`<rect x="256" y="183" width="10" height="10" rx="1.5" fill="#efe9dc" stroke="#8f887a"/><rect x="266" y="185" width="10" height="6" rx="2" fill="${ig>0.05?HK.mix([47,51,55],[255,190,90],ig):"#2f3337"}"/>`;
 if(ig>0.5)s+=`<circle cx="271" cy="188" r="${6+6*ig}" fill="#ffb347" opacity="${(0.35*ig).toFixed(2)}"/>`;
 /* flame sensor rod */
 s+=`<path d="M432 194 H412 V178" fill="none" stroke="#9aa1a8" stroke-width="3"/><rect x="428" y="189" width="10" height="10" rx="1.5" fill="#efe9dc" stroke="#8f887a"/>`;
 /* limit */
 s+=`<rect x="302" y="214" width="24" height="10" rx="2" fill="url(#zSteel)" stroke="#4d555a"/><circle cx="314" cy="219" r="2.8" fill="${R.lim?"var(--bad)":"var(--ok)"}"/>`;
 /* gas valve and supply pipe */
 s+=HK.gasPipe("M468 208 H700")+HK.gasPipe("M640 208 V252")+`<rect x="634" y="250" width="12" height="7" rx="2" fill="#2a2f33"/>`;
 s+=zHex(600,208,8,"url(#zBrass)")+`<rect x="592" y="192" width="18" height="7" rx="2" fill="#e8c33a" stroke="#6a4a12"/>`;
 s+=`<rect x="436" y="196" width="32" height="26" rx="3" fill="url(#zAlu)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="439" y="199" width="17" height="19" rx="2" fill="url(#zPlasticDk)"/><circle cx="447" cy="208" r="3.6" fill="${R.gv?"var(--ok)":"var(--lamp-off)"}"/><circle cx="462" cy="200" r="2" fill="url(#zScrew)"/><circle cx="462" cy="217" r="2" fill="url(#zScrew)"/>`;
 /* inducer and vent */
 s+=`<rect x="440" y="0" width="16" height="92" fill="${R.pvc?"#f4f4f0":"#b9c0c6"}" stroke="#5f686d"/><rect x="442" y="0" width="4" height="92" fill="rgba(255,255,255,.5)"/>`+[22,58].map(y=>`<rect x="438" y="${y}" width="20" height="4" fill="#8d969c" stroke="#5f686d" stroke-width=".5"/>`).join("");
 if(R.nest)s+=`<rect x="440" y="2" width="16" height="${12+R.nest*30}" fill="#7a5a32"/><path d="M440 ${6+R.nest*30} l4 -6 4 6 4 -6 4 6" stroke="#4a3418" fill="none"/>`;
 if(R.ind&&(R.draft==null||R.draft>0.1))s+=`<path class="lsFlow" d="M448 86 V6" stroke="${fl?HK.FLUE:"#c4cacf"}" stroke-width="3" stroke-dasharray="6 6" fill="none" opacity="${R.nest?0.5:1}"/>`;
 s+=`<path d="M430 82 H440" stroke="#7d868c" stroke-width="10"/><circle cx="448" cy="108" r="19" fill="url(#zSteelH)" stroke="#4d555a" filter="url(#zShadow)"/><circle cx="448" cy="108" r="13" fill="url(#zInside)" stroke="#2a2f33"/><rect x="440" y="84" width="16" height="10" fill="#9aa1a8" stroke="#4d555a"/>`;
 const ia=R.ind?(R.t||0)*97%45:0;s+=`<g stroke="#c4cacf" stroke-width="2.2" transform="rotate(${ia} 448 108)">${[0,1,2,3].map(i=>`<line x1="${(448-10*Math.cos(i*Math.PI/4)).toFixed(1)}" y1="${(108-10*Math.sin(i*Math.PI/4)).toFixed(1)}" x2="${(448+10*Math.cos(i*Math.PI/4)).toFixed(1)}" y2="${(108+10*Math.sin(i*Math.PI/4)).toFixed(1)}"/>`).join("")}</g>`;
 if(R.ind)s+=`<circle cx="448" cy="108" r="22" fill="none" stroke="var(--ok)" stroke-width="2" opacity=".55"/>`;
 /* pressure switch and hose */
 s+=`<path d="M448 127 C448 138 446 142 452 146" stroke="#14171a" stroke-width="2.4" fill="none"/><circle cx="461" cy="148" r="9" fill="url(#zAluTop)" stroke="#5f686d"/><circle cx="461" cy="148" r="3.4" fill="${R.ps?"var(--ok)":"var(--lamp-off)"}"/>`;
 /* blower, capacitor, board */
 s+=zBlower(360,306,42,K.uid("hb"))+zCap(420,328,16,32,K.uid("hc"));
 const led=R.led==="bad"?"var(--bad)":R.led==="warn"?"#e8c33a":R.led==="off"?"var(--lamp-off)":"var(--ok)";
 s+=`<rect x="264" y="240" width="66" height="48" rx="2" fill="url(#zGreen)" stroke="#0e2414" filter="url(#zShadow)"/><rect x="270" y="244" width="10" height="6" fill="#111"/><rect x="284" y="244" width="10" height="6" fill="#111"/><circle cx="320" cy="250" r="4.5" fill="${led}"/>
  <text x="297" y="270" style="font-family:var(--mono);font-size:6.6px;fill:#e9ecee;text-anchor:middle">${K.esc((R.brd||"STANDBY").toUpperCase().slice(0,16))}</text><text x="297" y="282" style="font-family:var(--display);font-size:7px;fill:#c4cacf;text-anchor:middle">CONTROL BOARD</text>`;
 /* air */
 if(R.blower&&!R.noAir){const ret=R.ret??68,sup=R.sup??(ret+45);s+=HK.air("M120 334 H238",K.tcol(ret))+HK.air("M285 52 V8",K.tcol(sup))+HK.air("M320 52 V8",K.tcol(sup))}
 (R.labels||[]).forEach(k=>{const c=HK.FC[k];if(c)s+=HK.co(c[0],c[1],c[2],c[3],c[4],{fill:R.hl===k?"var(--brass)":undefined})});
 if(R.hl&&HK.HLB[R.hl])s+=hl(R.hl);
 return s};
HK.HLB={inducer:[424,86,48,46],ps:[448,136,26,26],ig:[252,178,30,20],fs:[404,170,38,32],gv:[432,192,40,34],hx:[262,92,164,96],burn:[258,184,190,30],board:[260,236,74,56],blower:[310,250,110,104],
 filter:[242,292,20,80],limit:[298,210,32,18],coll:[258,62,176,30],vent:[434,0,28,96]};
/* ---------- the furnace sequence, worked out second by second like the trainer's control board ----------
 o: {tEnd (s), callEnd (s, thermostat satisfied if the furnace is heating), boff (s), ign (igniter cracked), dirty (flame sensor), vent (blocked)} */
HK.seq=o=>{const dt=0.5,N=Math.round((o.tEnd||480)/dt);const out=[];const boff=o.boff||120,callEnd=o.callEnd||300;
 let st="waitPS",tm=0,draft=0,ps=false,glow=0,flame=false,trials=0,ind=true,ig=false,gv=false,bOn=-1,bOff=0,calling=true,heated=false,ev=[];
 const go=(s,msg)=>{st=s;tm=0;if(msg)ev.push([out.length*dt,msg])};
 ev.push([0,"Thermostat calls for heat (R to W). Pressure switch checked open. Inducer on."]);
 for(let i=0;i<=N;i++){const t=i*dt;
  if(t>=callEnd&&heated&&calling)calling=false;
  const dr=ind?(o.vent?0.2:1.0):0;draft+=(dr-draft)*Math.min(1,dt/3);ps=ps?draft>=0.55:draft>=0.65;
  switch(st){
   case "waitPS":ind=true;if(ps)go("prepurge","Pressure switch closed. Prepurge 15 s.");break;
   case "prepurge":if(tm>=15){ig=true;go("igwarm","Igniter on. Warm-up 17 s.")}break;
   case "igwarm":if(tm>=17){gv=true;go("trial","Gas valve opens. Trial for ignition.")}break;
   case "trial":if(!flame&&!o.ign&&glow>0.7&&tm>1){flame=true;ev.push([t,"Burners light."])}
    if(tm>=7){if(flame&&!o.dirty){ig=false;trials=0;heated=true;bOn=t+30;go("run","Flame proved at 4.0 µA. Igniter off. Blower on in 30 s.")}
     else{const lit=flame;gv=false;flame=false;ig=false;trials++;
      if(trials>=4)go("lock",(lit?"Flame only 0.6 µA at the sensor. ":"No flame. ")+"Fourth failed trial: soft lockout.");
      else go("interpurge",(lit?"Flame lit but only 0.6 µA at the sensor (needs 1). Gas off. ":"No ignition. Gas off. ")+`Purge, then trial ${trials+1} of 4.`)}}break;
   case "interpurge":ind=true;if(tm>=15){ig=true;go("igwarm")}break;
   case "run":if(!calling){gv=false;flame=false;bOff=boff;go("post","Thermostat satisfied. Gas valve closes. Inducer post-purge 15 s.")}break;
   case "post":if(tm>=15){ind=false;go("idle","Inducer off. Blower runs out its off delay.")}break;
   case "lock":ind=tm<15;break;
   case "idle":ind=false;break}
  glow=HK.clamp(glow+(ig&&!o.ign?dt/10:-dt/4),0,1);
  const blower=(st==="run"&&bOn>=0&&t>=bOn)||bOff>0;if(bOff>0&&st!=="run")bOff-=dt;
  if(st==="run"&&bOn>=0&&Math.abs(t-bOn)<dt/2)ev.push([t,"Blower on (heat speed)."]);
  if(bOff>0&&bOff<=dt)ev.push([t+dt,"Blower off. Standby."]);
  const uA=flame?(o.dirty?0.6:4.0):0;
  const txt={waitPS:"waiting on PS",prepurge:"prepurge",igwarm:"igniter warm-up",trial:"ignition trial",interpurge:"retry purge",run:"heating",post:"post-purge",lock:"soft lockout",idle:blower?"blower delay":"standby"}[st];
  out.push({t,st,txt,ind,ps,ig:glow,igOn:ig,gv,flame:flame?1:0,uA,blower,draft,trials,calling});
  tm+=dt}
 return {dt,arr:out,ev}};
HK.seqAt=(q,t)=>q.arr[HK.clamp(Math.round(t/q.dt),0,q.arr.length-1)];
/* furnace drawing state from a sequence point */
HK.fs=(p,extra={})=>({ind:p.ind,ps:p.ps,ig:p.ig,gv:p.gv,flame:p.flame,uA:p.uA,blower:p.blower,draft:p.draft,brd:p.txt,t:p.t,led:p.st==="lock"?"bad":p.st==="waitPS"&&p.t>30?"warn":"ok",...extra});
/* timeline bars: x,y top-left, w width, rows of 15 px */
HK.timeline=(q,o)=>{const x=o.x,y=o.y,w=o.w,T=o.T||q.arr[q.arr.length-1].t,X=t=>x+t/T*w;const rows=[["INDUCER",p=>p.ind,"#7d868c"],["PRESS. SW",p=>p.ps,HK.OK],["IGNITER",p=>p.igOn,"#e0862a"],["GAS VALVE",p=>p.gv,"#5a6268"],["FLAME",p=>p.flame>0,"#3d7de0"],["BLOWER",p=>p.blower,"#c0392b"]];
 let s="";const rh=o.rh||15;
 rows.forEach(([n,f,c],r)=>{const yy=y+r*rh;s+=`<text x="${x-8}" y="${yy+rh-4}" style="font-family:var(--display);font-size:11px;font-weight:600;letter-spacing:.05em;fill:var(--muted);text-anchor:end">${n}</text><rect x="${x}" y="${yy+2}" width="${w}" height="${rh-4}" fill="var(--panel-edge)" opacity=".35"/>`;
  let on=null;q.arr.forEach((p,i)=>{if(p.t>T)return;const v=f(p);if(v&&on===null)on=p.t;if((!v||i===q.arr.length-1||p.t+q.dt>T)&&on!==null){s+=`<rect x="${X(on).toFixed(1)}" y="${yy+2}" width="${Math.max(1.5,X(p.t)-X(on)).toFixed(1)}" height="${rh-4}" rx="2" fill="${c}"/>`;on=null}})});
 const ticks=o.ticks||[0,60,120,180,240,300,360,420,480];ticks.filter(t=>t<=T).forEach(t=>{s+=`<path d="M${X(t)} ${y+rows.length*rh} v4" stroke="var(--muted)"/><text x="${X(t)}" y="${y+rows.length*rh+16}" class="lsG" style="font-size:11px">${t} s</text>`});
 if(o.cur!=null)s+=`<path d="M${X(o.cur)} ${y-4} V${y+rows.length*rh+2}" stroke="var(--ink)" stroke-width="2"/><path d="M${X(o.cur)-5} ${y-9} h10 l-5 6z" fill="var(--ink)"/>`;
 return s};
/* ---------- inducer draft (pressure switch lesson) ----------
 inducer fan curve P = P0 s^2 (1 - (Q/(Qm s))^2) against the flue resistance: heat exchanger Rhx Q^2 (ahead of the inducer) plus vent Rv Q^2 (after it).
 The switch senses the suction at the inducer inlet, which is Rhx Q^2. Tuned so a clean 80% furnace reads about -1.0 in. w.c. */
HK.draft=o=>{const s=(o.speed??100)/100,b=HK.clamp((o.block||0)/100,0,0.97);const P0=1.9*s*s,c=0.6;const Rhx=1.0*(o.soot?1.6:1),Rv=0.25/Math.pow(1-b,2);
 const Q2=P0/(Rhx+Rv+c);const port=Rhx*Q2*(o.trap?0.15:1);const atSw=port*(o.hose?0.35:1);return {Q:Math.sqrt(Q2)/Math.sqrt(1.9/1.85),port,atSw,flow:Math.sqrt(Q2)/Math.sqrt(1.9/1.85)}};
HK.PS_ON=0.65;HK.PS_OFF=0.55;
/* ---------- temperature rise (steady state, same heat exchanger model as the trainer) ---------- */
HK.rise=o=>{const input=HK.INPUT*Math.sqrt(HK.clamp(o.man,0,7)/3.5),out=input*(o.eff||HK.EFF);const cfm=o.cfm*Math.sqrt(1/(1+3*Math.pow(o.filter||0,2)));
 const Tr=o.ret??68,eps=0.9,dHX=out/(1.08*cfm*eps+30),Thx=Tr+dHX,rise=out/(1.08*cfm),Tsup=Tr+rise,Tlim=Tsup+(Thx-Tsup)*0.3;return {input,out,cfm,rise,Tsup,Thx,Tlim,lim:Tlim>=(o.limSet||165)}};
/* ---------- oil burner ---------- */
HK.BTU_GAL=140000;
HK.gph=(noz,psi)=>psi>=85?noz*Math.sqrt(psi/100):0;
/* oil burner cutaway, 720 x 380. R: {psi, gph, cad (ohms), motor, spark, valve, flame (0..1), led, brd, labels, hl, dirty, stray, smoke} */
HK.OC={motor:[128,222,96,276,"MOTOR"],pump:[200,300,96,322,"FUEL PUMP"],gauge:[262,318,330,352,"PRESSURE GAUGE"],igniter:[228,124,300,100,"IGNITER"],cad:[262,198,300,128,"CAD CELL"],
 nozzle:[440,210,440,262,"NOZZLE"],elec:[444,192,440,160,"ELECTRODES"],tube:[340,226,340,264,"AIR TUBE"],primary:[92,66,92,40,"PRIMARY CONTROL"],chamber:[600,92,560,52,"CHAMBER"],air:[156,180,96,170,"AIR BAND"],oilline:[60,300,40,352,"OIL LINE"]};
HK.oil=(R={})=>{let s="";const fl=R.flame||0;
 /* chamber */
 s+=`<rect x="452" y="70" width="260" height="250" rx="6" fill="#8a6a4a" stroke="#4a3626" stroke-width="1.5"/><rect x="466" y="84" width="232" height="222" rx="4" fill="#2a2220"/>`;
 s+=`<rect x="466" y="84" width="232" height="222" rx="4" fill="url(#zBrick)" opacity=".18"/>`;
 if(fl>0){const L=110+130*fl,H=34+40*fl,c=R.smoke?"#e0662a":"#f2a53a";s+=`<path d="M450 200 Q${450+L*0.4} ${200-H} ${450+L} 200 Q${450+L*0.4} ${200+H} 450 200 Z" fill="${c}" opacity=".9"/><path d="M452 200 Q${452+L*0.3} ${200-H*0.55} ${452+L*0.75} 200 Q${452+L*0.3} ${200+H*0.55} 452 200 Z" fill="#ffe08a" opacity=".9"/>`;
  if(R.smoke)s+=`<g fill="#333" opacity=".55"><circle cx="${470+L}" cy="150" r="16"/><circle cx="${450+L}" cy="126" r="12"/></g>`}
 else if(R.spray)s+=`<path d="M448 200 L520 168 M448 200 L520 232 M448 200 L524 200" stroke="#c9b48a" stroke-width="2" stroke-dasharray="2 4"/>`;
 if(R.spark)s+=`<path d="M447 191 l4 3 -3 2 4 3" stroke="#9fd0ff" stroke-width="2" fill="none"/><circle cx="449" cy="194" r="6" fill="#9fd0ff" opacity=".35"/>`;
 /* air tube with cutaway */
 s+=`<rect x="250" y="178" width="204" height="44" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2"/><rect x="262" y="184" width="186" height="32" fill="#3a4045"/>`;
 s+=`<path d="M266 207 H432" stroke="#c9a24a" stroke-width="4"/><path d="M432 202 h10 l4 3 v4 l-4 3 h-10 z" fill="url(#zBrass)" stroke="#6a4a12"/>`;
 s+=`<path d="M300 191 H438 L446 193" stroke="#e9ecee" stroke-width="2.2" fill="none"/><path d="M300 195 H438 L446 196" stroke="#e9ecee" stroke-width="2.2" fill="none"/><rect x="300" y="188" width="70" height="10" rx="3" fill="#efe9dc" stroke="#8f887a"/>`;
 s+=`<rect x="436" y="180" width="18" height="40" rx="3" fill="none" stroke="#7d868c" stroke-width="3"/>`;
 /* cad cell */
 s+=`<rect x="256" y="188" width="14" height="22" rx="3" fill="#2a2f33" stroke="#111"/><circle cx="268" cy="199" r="5" fill="${R.dirty?"#5a4a2a":"#d9a640"}" stroke="#6a4a12"/>`;
 /* housing and fan */
 s+=`<circle cx="200" cy="200" r="58" fill="url(#zSteel)" stroke="#4d555a" stroke-width="1.4" filter="url(#zShadow)"/><circle cx="200" cy="200" r="40" fill="url(#zInside)" stroke="#2a2f33"/>`;
 const fa=R.motor?(R.t||0)*83%30:0;s+=`<g transform="rotate(${fa} 200 200)" stroke="#b9c1c6" stroke-width="2.4">${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return `<line x1="${(200+14*Math.cos(a)).toFixed(1)}" y1="${(200+14*Math.sin(a)).toFixed(1)}" x2="${(200+36*Math.cos(a+.3)).toFixed(1)}" y2="${(200+36*Math.sin(a+.3)).toFixed(1)}"/>`}).join("")}</g><circle cx="200" cy="200" r="10" fill="url(#zMotor)"/>`;
 s+=`<path d="M150 174 A58 58 0 0 1 172 150 L180 164 A42 42 0 0 0 164 182 Z" fill="#c4cacf" stroke="#5f686d"/>`;
 /* motor */
 s+=`<rect x="96" y="172" width="58" height="56" rx="10" fill="#2f5f9a" stroke="#123" filter="url(#zShadow)"/><rect x="100" y="176" width="50" height="8" rx="3" fill="rgba(255,255,255,.25)"/><circle cx="110" cy="220" r="5" fill="#c0392b" stroke="#600"/>`;
 if(R.motor)s+=`<rect x="92" y="168" width="66" height="64" rx="12" fill="none" stroke="var(--ok)" stroke-width="2" opacity=".6"/>`;
 /* igniter on top */
 s+=`<rect x="166" y="122" width="92" height="22" rx="4" fill="url(#zPlasticDk)" stroke="#111"/><text x="212" y="137" style="font-family:var(--display);font-size:9px;font-weight:700;fill:#c4cacf;text-anchor:middle;letter-spacing:.08em">IGNITER</text><circle cx="248" cy="133" r="3.5" fill="${R.spark?"#9fd0ff":"var(--lamp-off)"}"/>`;
 /* pump, gauge, oil line */
 s+=`<rect x="170" y="262" width="62" height="44" rx="6" fill="url(#zAlu)" stroke="#4d555a" filter="url(#zShadow)"/><path d="M200 258 V262" stroke="#4d555a" stroke-width="6"/>`;
 s+=`<path d="M232 286 H262 V300" stroke="#9aa1a8" stroke-width="5" fill="none"/>`;
 const g=HK.clamp((R.psi||0)/300,0,1);s+=zGauge(262,320,18,"#c0392b")+`<path d="M262 320 L${(262+15*Math.sin((-135+270*g)*Math.PI/180)).toFixed(1)} ${(320-15*Math.cos((-135+270*g)*Math.PI/180)).toFixed(1)}" stroke="#c0392b" stroke-width="2"/>`;
 s+=`<path d="M232 274 C250 260 254 232 266 207" stroke="#c9a24a" stroke-width="4" fill="none"/><circle cx="244" cy="268" r="5" fill="${R.valve?"var(--ok)":"var(--lamp-off)"}" stroke="#333"/>`;
 s+=HK.pipe("M0 300 H60 V286 H170","#b5651d",5,!!R.valve,1.6);
 /* primary control */
 const led=R.led==="bad"?"var(--bad)":R.led==="off"?"var(--lamp-off)":R.led==="warn"?"#e8c33a":"var(--ok)";
 s+=`<rect x="40" y="70" width="110" height="56" rx="5" fill="url(#zPlasticDk)" stroke="#111" filter="url(#zShadow)"/><circle cx="62" cy="88" r="5" fill="${led}"/><circle cx="130" cy="88" r="8" fill="#c0392b" stroke="#600"/>
  <text x="95" y="114" style="font-family:var(--mono);font-size:7px;fill:#e9ecee;text-anchor:middle">${K.esc((R.brd||"STANDBY").toUpperCase().slice(0,18))}</text><path d="M150 100 C200 100 230 140 262 190" stroke="#c0392b" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>`;
 (R.labels||[]).forEach(k=>{const c=HK.OC[k];if(c)s+=HK.co(c[0],c[1],c[2],c[3],c[4],{fill:R.hl===k?"var(--brass)":undefined})});
 return s};
/* oil primary control timeline (Honeywell R7184 style). o: {lock: 15|30|45, flameAt (s after valve opens, or null = no flame), lostAt} */
HK.primary=o=>{const L=o.lock||15,ev=[];let t=0;ev.push(["safe",0,4,"SAFE START"]);t=4;ev.push(["vod",t,t+15,"VALVE-ON DELAY"]);t+=15;
 if(o.flameAt==null||o.flameAt>L){ev.push(["tfi",t,t+L,"TRIAL"]);ev.push(["lock",t+L,t+L+20,"LOCKOUT"])}
 else{ev.push(["tfi",t,t+o.flameAt,"TRIAL"]);t+=o.flameAt;ev.push(["carry",t,t+10,"CARRYOVER"]);ev.push(["run",t+10,t+60,"FIRING"])}
 return ev};
/* ---------- hydronic coil: counterflow e-NTU, UA tuned to First Co HWC1520 data (same as the trainer) ---------- */
HK.coilQ=(gpm,cfm,ewt,eat,ua=1)=>{if(gpm<=0.01||cfm<=1)return 0;const Ca=1.08*cfm,Cw=500*gpm,Cmin=Math.min(Ca,Cw),Cmax=Math.max(Ca,Cw),Cr=Cmin/Cmax;
 const ntu=0.82*1296/Cmin*Math.pow(gpm/3,0.1)*Math.pow(cfm/1200,0.5)*ua;const e=Math.abs(1-Cr)<1e-6?ntu/(1+ntu):(1-Math.exp(-ntu*(1-Cr)))/(1-Cr*Math.exp(-ntu*(1-Cr)));return e*Cmin*(ewt-eat)};
HK.coil=o=>{const gpm=o.gpm*(o.air?0.3:1),cfm=o.cfm*(o.filter?0.55:1);const Q=HK.coilQ(gpm,cfm,o.ewt,o.eat,o.air?0.45:1);
 const lwt=o.ewt-Q/(500*gpm),Tsup=o.eat+Q/(1.08*cfm);return {gpm,cfm,Q,lwt,Tsup,dTw:o.ewt-lwt,dTa:Tsup-o.eat,ewt:o.ewt,eat:o.eat}};
/* hydronic air handler, 720 x 380. R: {ewt, lwt, gpm, cfm, eat, Tsup, pump, zv (0..1), es, fire, blower, air, labels, hl, panel:true} */
HK.HC={boiler:[100,300,100,384,"BOILER"],pump:[88,146,100,114,"CIRCULATOR","start"],zv:[184,58,150,30,"ZONE VALVE","end"],bal:[227,146,227,186,"BALANCING VALVE","middle"],coil:[420,100,420,48,""],vent:[502,62,540,40,"AIR VENT"],
 fd:[316,80,316,48,""],blower:[420,300,560,252,"BLOWER"],tstat:[640,250,640,240,"THERMOSTAT"]};
HK.ahu=(R={})=>{let s="";const on=R.gpm>0.05;
 /* boiler */
 s+=`<rect x="30" y="196" width="140" height="170" rx="4" fill="#7a3a33" stroke="#4a201c" stroke-width="1.4" filter="url(#zShadow)"/><rect x="36" y="202" width="128" height="158" fill="none" stroke="#a95447"/>`;
 s+=`<text x="44" y="220" style="font-family:var(--display);font-size:11px;font-weight:700;fill:#f2e2dc;letter-spacing:.08em">BOILER</text>`;
 s+=`<rect x="56" y="300" width="88" height="44" rx="4" fill="#1b1f22"/>`;
 if(R.fire)[72,92,112,132].forEach(x=>{s+=`<path d="M${x-7} 338 Q${x} 312 ${x+7} 338 Z" fill="#3d7de0"/>`});
 s+=`<rect x="100" y="230" width="52" height="40" rx="4" fill="#2a2f33" stroke="#111"/><text x="126" y="246" style="font-family:var(--display);font-size:7px;font-weight:700;fill:#c4cacf;text-anchor:middle">AQUASTAT</text><text x="126" y="262" style="font-family:var(--mono);font-size:11px;fill:#7CFFB2;text-anchor:middle">${Math.round(R.ewt||0)}°F</text>`;
 /* pipes */
 const sc=HK.wcol(R.ewt||70),rc=HK.wcol(R.lwt||70);
 s+=HK.pipe("M70 196 V84 H352",sc,8,on)+HK.pipe("M352 136 H150 V196",rc,8,on);
 /* circulator */
 s+=`<circle cx="70" cy="150" r="17" fill="url(#zGreen)" stroke="#0e2414"/><rect x="48" y="134" width="12" height="32" rx="3" fill="#2a2f33"/><path d="M66 158 L70 144 L74 158" stroke="#e9ecee" stroke-width="2" fill="none"/>${R.pump?`<circle cx="70" cy="150" r="21" fill="none" stroke="var(--ok)" stroke-width="2" opacity=".6"/>`:""}`;
 /* zone valve */
 const zp=HK.clamp(R.zv??(on?1:0),0,1);s+=`<rect x="186" y="72" width="28" height="24" rx="3" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="180" y="48" width="40" height="26" rx="4" fill="#e9ecee" stroke="#5f686d"/><rect x="186" y="66" width="${(2+26*zp).toFixed(1)}" height="4" fill="#3fa34d"/><circle cx="212" cy="56" r="3.2" fill="${R.es?"var(--ok)":"var(--lamp-off)"}"/>`;
 /* balancing valve */
 s+=`<rect x="214" y="126" width="26" height="20" rx="3" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="221" y="114" width="12" height="12" rx="2" fill="#c0392b"/>`;
 /* thermometers on the pipes */
 s+=HK.thermo(268,72,"EWT "+(on?Math.round(R.ewt)+"°F":"--"),{len:10,w:96});
 s+=HK.thermo(268,124,"LWT "+(on?Math.round(R.lwt)+"°F":"--"),{len:10,w:96});
 /* air handler cabinet */
 s+=`<rect x="330" y="0" width="150" height="40" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.4"/><path d="M510 50 L520 44 V364 L510 372 Z" fill="#8d969c"/>`;
 s+=`<rect x="330" y="40" width="180" height="332" rx="3" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5" filter="url(#zShadow)"/><rect x="336" y="46" width="168" height="320" fill="url(#zCabIn)" stroke="#9aa3a9"/>`;
 /* coil */
 s+=`<rect x="348" y="60" width="148" height="92" rx="2" fill="#59626a" stroke="#3b4247"/><rect x="352" y="64" width="140" height="84" fill="url(#zFins)"/>`;
 const rows=5;for(let i=0;i<rows;i++){const T=(R.ewt||70)-((R.ewt||70)-(R.lwt||70))*i/(rows-1);const air=R.air&&i<2;s+=`<line x1="352" y1="${72+i*17}" x2="492" y2="${72+i*17}" stroke="${air?"#7a8ea0":on?HK.wcol(T):"#c4884a"}" stroke-width="4"/>`}
 if(R.air)s+=`<g fill="#fff" opacity=".85">${[370,402,436,470].map((x,i)=>`<circle class="lsBub" cx="${x}" cy="${78+(i%2)*14}" r="3.4"/>`).join("")}</g>`;
 s+=`<path d="M352 84 H348 M352 136 H348" stroke="#b87333" stroke-width="8"/><rect x="496" y="56" width="10" height="14" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/>`;
 /* blower and filter */
 s+=zBlower(420,300,40,K.uid("hb"));s+=zFilter(338,296,10,66,K.uid("hd"));
 if(R.filter)s+=`<rect x="338" y="296" width="10" height="66" fill="#6b5a3a" opacity=".6"/>`;
 s+=`<rect x="520" y="300" width="130" height="62" fill="url(#zSteelH)" stroke="#6f787e" stroke-width="1.4"/>`;
 if(R.blower){s+=HK.air("M640 330 H530",K.tcol(R.eat||68))+HK.air("M360 36 V4",K.tcol(R.Tsup||100))+HK.air("M398 36 V4",K.tcol(R.Tsup||100))}
 s+=HK.thermo(560,346,R.blower?Math.round(R.eat)+"°F":"--",{len:-14}).replace("M560 346 V332","M560 340 V326")+K.txt(560,378,"RETURN AIR",{fill:"var(--muted)"});
 s+=HK.thermo(448,36,R.blower?Math.round(R.Tsup)+"°F":"--",{len:12}).replace(`y="-8"`,`y="-8"`);
 /* water-side panel like the trainer */
 if(R.panel!==false){const L=[on?`EWT ${Math.round(R.ewt)}°F`:"EWT --",on?`LWT ${Math.round(R.lwt)}°F`:"LWT --",`${(R.gpm||0).toFixed(1)} GPM`,on?`W ${(500*R.gpm*(R.ewt-R.lwt)/1000).toFixed(1)} MBH`:"W --",R.blower?`A ${(1.08*R.cfm*(R.Tsup-R.eat)/1000).toFixed(1)} MBH`:"A --"];
  s+=`<rect x="560" y="70" width="140" height="150" rx="6" fill="#2a2f33" stroke="#111"/><rect x="568" y="94" width="124" height="118" rx="3" fill="#b9c99a"/><text x="630" y="86" style="font-family:var(--display);font-size:9px;font-weight:700;fill:#c4cacf;text-anchor:middle;letter-spacing:.08em">WATER SIDE</text>`+L.map((t,i)=>`<text x="578" y="${114+i*21}" style="font-family:var(--mono);font-size:13px;fill:#142014">${t}</text>`).join("")}
 (R.labels||[]).forEach(k=>{const c=HK.HC[k];if(c&&c[4])s+=HK.co(c[0],c[1],c[2],c[3],c[4],{a:c[5]})});
 return s};
