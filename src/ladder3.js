/* ---------- 3-phase page: power circuit, motor model, control transformer ----------
   Injected into ladder.js only for the 3-Phase Motor Control page (window.LD3).
   The control ladder above uses the normal engine: X1 (fused) is the left rail, X2 (grounded) the right rail. */
// NEC Table 430.250 full-load amps, 3-phase induction motors (10 hp main motor, 5 hp second motor)
const FLA3={10:{208:30.8,240:28,480:14},5:{208:16.7,240:15.2,480:7.6}};
const PCOL={208:["#1b1b1b","#d62828","#1f5fd1"],240:["#1b1b1b","#d62828","#1f5fd1"],480:["#8b5a2b","#f08a24","#e8c51a"]};
const PCOLN={208:["black","red","blue"],240:["black","red","blue"],480:["brown","orange","yellow"]};
const P3S={sup:480,circ:"single",fuse:[false,false,false],cfuse:false,swap:false,
 m:[{s:0,heat:0,I:[0,0,0],ang:0,st:"Stopped",hp:10,tag:"MTR1"},{s:0,heat:0,I:[0,0,0],ang:0,st:"Stopped",hp:5,tag:"MTR2"}]};
const CIRC={single:{coils:["M"],motors:1,name:"One contactor (M)"},rev:{coils:["F","R"],motors:1,name:"Reversing: F and R contactors"},
 seq:{coils:["M1","M2"],motors:2,name:"Two motors: M1 and M2"},wyedelta:{coils:["M","S","D"],motors:1,name:"Wye-delta: M, S (star) and D (delta)"}};
const p3CtlLive=()=>power&&!P3S.fuse[0]&&!P3S.fuse[1]&&!P3S.cfuse;
const lineLive=k=>power&&!P3S.fuse[k];
const cOn=t=>!!coilOn[t]&&p3CtlLive();
const fla=i=>FLA3[P3S.m[i].hp][P3S.sup];
// Which supply line feeds each motor lead. null = no connection.
function leads(i){const c=P3S.circ;let T=[null,null,null],mode="dol";
 if(c==="single"&&i===0&&cOn("M"))T=[0,1,2];
 if(c==="rev"&&i===0){if(cOn("F")&&!cOn("R"))T=[0,1,2];if(cOn("R")&&!cOn("F"))T=[2,1,0]}
 if(c==="seq"){if(i===0&&cOn("M1"))T=[0,1,2];if(i===1&&cOn("M2"))T=[0,1,2]}
 if(c==="wyedelta"&&i===0&&cOn("M")){T=[0,1,2];mode=cOn("S")&&!cOn("D")?"wye":cOn("D")&&!cOn("S")?"delta":"open"}
 if(P3S.swap&&i===0&&T[0]!=null)T=[T[2],T[1],T[0]];
 return {T,mode}}
// phase-to-phase shorts in the power circuit (interlocks removed)
function p3PowerShort(){const c=P3S.circ;let msg=null;
 if(c==="rev"&&cOn("F")&&cOn("R"))msg="F and R pulled in together. The R contactor swaps L1 and L3, so with both closed L1 is shorted straight to L3. That's why reversing starters have electrical interlocks (each coil's NC contact in the other's rung) and a mechanical interlock between the contactors.";
 if(c==="wyedelta"&&cOn("S")&&cOn("D"))msg="S and D pulled in together. The star contactor ties T4, T5 and T6 together while the delta contactor puts a different line on each of them: a line-to-line short. Wye-delta starters interlock S and D electrically and mechanically.";
 if(!msg)return;P3S.fuse[0]=P3S.fuse[2]=true;if(c==="wyedelta")P3S.fuse[1]=true;
 say("Phase-to-phase short: the main fuses blew.","b");flashModal("Phase-to-phase short",`<p>${msg}</p><p>The branch-circuit fuses blew. Fix the control circuit, then replace the fuses in the panel on the right.</p>`)}
function p3Tick(dt){p3PowerShort();
 for(let i=0;i<CIRC[P3S.circ].motors;i++){const M=P3S.m[i],F=fla(i),{T,mode}=leads(i);
  const live=T.map(k=>k!=null&&lineLive(k));const n=live.filter(Boolean).length;
  let tgt=0,I=0,st="Stopped",rate=0.25;
  const seq=T.map((k,j)=>live[j]?k:null);
  const dir=n===3?(((seq[1]-seq[0]+3)%3)===1?1:-1):0;
  if(motorOL[M.tag]){/* contactor drops through the OL contact; nothing extra */}
  if(n===3&&mode!=="open"){const mx=mode==="wye"?0.92:1;tgt=dir*mx;rate=mode==="wye"?0.45:0.7;const slip=Math.min(1,Math.abs(tgt-M.s));
   I=mode==="wye"?F*(0.9+1.1*Math.min(1,slip/0.92)):F*(0.85+5.15*Math.pow(slip,1.5));
   st=Math.abs(M.s)<0.95*mx&&slip>0.05?(mode==="wye"?"Wye start: accelerating":"Accelerating"):mode==="wye"?"Running in wye (reduced voltage)":mode==="delta"?"Running in delta":"Running";
   st+=dir>0?" · FWD (clockwise)":" · REV (counterclockwise)"}
  else if(n===2&&mode!=="open"){if(Math.abs(M.s)>0.5){tgt=Math.sign(M.s)*0.95;rate=0.3;I=F*0.85*1.73;st="SINGLE PHASING: still turning, running hot"}
   else{tgt=0;I=F*6*0.87;st="SINGLE PHASING: humming, won't start"}}
  else if(mode==="open"&&n>0){st="M closed, but the windings have no star or delta connection: no current"}
  M.s+=Math.sign(tgt-M.s)*Math.min(Math.abs(tgt-M.s),rate*dt);if(n<2&&Math.abs(M.s)<0.01)M.s=0;
  if(!n||mode==="open")st=Math.abs(M.s)>0.02?"Coasting":st;
  M.I=live.map(x=>x?I:0);M.ang=(M.ang+M.s*720*dt)%360;M.st=st;
  // overload heater (thermal model, trip times sped up for the trainer)
  const pu=I/F;if(pu>1.15)M.heat+=(pu*pu-1.3225)*(pu<3?12:1)*dt;else M.heat=Math.max(0,M.heat-10*dt);
  if(M.heat>=200&&!motorOL[M.tag]){motorOL[M.tag]=true;M.heat=200;say(`${M.tag} overload tripped: its NC contact (95-96) opened and dropped the coil.`,"b");
   if(n===2)flashModal("Overload tripped: single phasing",`<p>${M.tag} lost a phase. A running motor keeps turning on two lines but draws about 1.73 times its normal current on them; a stopped motor just hums at locked-rotor current. The overload heaters saw the high current and opened the control circuit.</p><p>Find the open line before resetting: check volts line to line at the fuses and across each fuse.</p>`)}}
 if(CIRC[P3S.circ].motors<2){P3S.m[1].s=0;P3S.m[1].I=[0,0,0]}}
function p3Short(ri){P3S.cfuse=true;shortRung=ri;say(`Control short on rung ${ri+1}: X1 straight to X2. The control transformer's secondary fuse blew.`,"b");
 flashModal("Control fuse blown",`<p>Rung ${ri+1} connects X1 straight to X2 with no coil or light in the path. The fuse on the transformer's X1 lead blew, so the whole control circuit is dead and every contactor dropped out.</p><p>Fix the short, then replace the control fuse in the panel on the right.</p>`)}
// meter on the power circuit: phasors, line-to-line volts
const PH=k=>({re:Math.cos(-k*2*Math.PI/3),im:Math.sin(-k*2*Math.PI/3)});
function p3Pot(key){const i=0,{T}=leads(0);const live=k=>k!=null&&lineLive(k);
 const term=j=>{const k=T[j];if(k==null)return null;if(live(k))return PH(k);
  const others=T.filter(x=>live(x));if(others.length<2)return null;const a=PH(others[0]),b=PH(others[1]);return {re:(a.re+b.re)/2,im:(a.im+b.im)/2}};
 const m=key.match(/^(L|F|T)(\d)$/);if(!m)return null;const k=+m[2]-1;
 if(m[1]==="L")return power?PH(k):null;
 if(m[1]==="F"){if(lineLive(k))return PH(k);const j=T.indexOf(k);return j>=0?term(j):null}
 return term(k)}
function p3PtName(b){return ({L:"line side of fuse ",F:"load side of fuse ",T:"motor lead T"})[b[0]]+(b[0]==="T"?b.slice(1):"F"+b.slice(1))}
function p3Reading(red,black,mode){const a=red.split(":"),b=black.split(":");
 if(a[0]!=="p"||b[0]!=="p")return {txt:"----",unit:"",note:"One lead is on the power circuit and one on the control ladder. Put both on the power circuit or both on the control ladder."};
 const V=P3S.sup;
 if(mode==="v"){const pa=p3Pot(a[1]),pb=p3Pot(b[1]);if(!pa||!pb)return {txt:"0.0",unit:"V AC",note:power?"One lead is on a dead point: an open disconnect, a blown fuse with nothing back-feeding it, or an open contactor.":"The disconnect is off."};
  const v=Math.hypot(pa.re-pb.re,pa.im-pb.im)/Math.sqrt(3)*V;
  const sameF=a[1][1]===b[1][1]&&/[LF]/.test(a[1][0])&&/[LF]/.test(b[1][0])&&a[1][0]!==b[1][0];
  return {txt:v.toFixed(1),unit:"V AC",note:sameF?(v>1?"Voltage across a fuse: the fuse is open. (The motor back-feeds the dead leg, so you may read most of line voltage.)":"0 V across a fuse with power on: the fuse is good."):v>V*0.95?"Full line-to-line voltage.":v>1?"Less than line voltage: one of these points is a dead leg being back-fed through the motor windings. A dead leg read from the good lines often shows about half voltage.":"0 V: same line, or no voltage."}}
 if(power)return {txt:"Err",unit:"Ω",note:"Turn the disconnect off and verify dead before reading ohms."};
 const x=a[1],y=b[1];
 if(x[0]!=="T"&&y[0]!=="T"&&x[1]===y[1]&&x[0]!==y[0]){const bl=P3S.fuse[+x[1]-1];return {txt:bl?"OL":"0.0",unit:"Ω",note:bl?"OL across the fuse: it's blown.":"About 0 Ω: the fuse is good."}}
 if(x[0]==="T"&&y[0]==="T"&&x!==y){const r=P3S.sup===480?0.62:0.16;return {txt:r.toFixed(2),unit:"Ω",note:"Winding resistance between two leads. All three pairs should read the same (within a few percent). Use a megger for winding-to-ground insulation."}}
 return {txt:"OL",unit:"Ω",note:"No path with the contactor open."}}
/* drawing the power circuit */
function p3Render(){const sv=$("p3svg");if(!sv)return;const c=P3S.circ,col=PCOL[P3S.sup],V=P3S.sup;
 const W={single:740,rev:780,seq:860,wyedelta:820}[c],H={single:540,rev:560,seq:540,wyedelta:600}[c];sv.setAttribute("viewBox",`0 0 ${W} ${H}`);sv.style.maxWidth=W+"px";
 const x0=70,dx=46,X=k=>x0+k*dx;let s="";
 const wire=(d,k,on,thin)=>`<path d="${d}" fill="none" stroke="#8e969b" stroke-width="${thin?3.5:on?6.5:5}" stroke-linecap="round" stroke-linejoin="round" opacity="${on?1:.35}"/><path d="${d}" fill="none" stroke="${col[k]}" stroke-width="${thin?2:on?4:2.5}" stroke-linecap="round" stroke-linejoin="round"${on?"":' stroke-dasharray="6 5" opacity=".55"'}/>`;
 const dot=(x,y,key)=>meter.on?`<circle class="mpt" data-pt="p:${key}" cx="${x}" cy="${y}" r="7" fill="${meter.red==="p:"+key?"#d62828":meter.black==="p:"+key?"#111":"var(--paper)"}" stroke="var(--brass)" stroke-width="2.5"/>`:"";
 const txt=(x,y,t,a="middle",cls="tg")=>`<text x="${x}" y="${y}" class="${cls}" style="text-anchor:${a}">${esc(t)}</text>`;
 const node=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="var(--ink)"/>`;
 // a 3-pole contactor: xs = pole x's, y = top; up/dn = live above/below; cl = closed
 const contactor=(xs,y,tag,up,dn,cl,lblSide="right")=>{let g="";xs.forEach((x,k)=>{g+=wire(`M${x} ${y} V${y+14}`,k,up[k])+wire(`M${x} ${y+36} V${y+50}`,k,dn[k])+`<path d="M${x-10} ${y+14} H${x+10} M${x-10} ${y+36} H${x+10}" stroke="var(--ink)" stroke-width="3"/>`+(cl?`<path d="M${x} ${y+14} V${y+36}" stroke="${col[k]}" stroke-width="3.5"/>`:"")});
  g+=`<path d="M${xs[0]-16} ${y+25} H${xs[2]+16}" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  return g+txt(lblSide==="right"?xs[2]+20:xs[0]-20,y+29,tag+(cl?" CLOSED":" OPEN"),lblSide==="right"?"start":"end")};
 const olBlock=(xs,y,i,live,ks)=>{let g="";xs.forEach((x,k)=>{const kk=ks?ks[k]:k;g+=wire(`M${x} ${y} V${y+8}`,kk,live[k])+`<path d="M${x} ${y+8} q8 4 0 8 q-8 4 0 8 q8 4 0 8" fill="none" stroke="${motorOL[P3S.m[i].tag]?"var(--bad)":"var(--ink)"}" stroke-width="2.5"/>`+wire(`M${x} ${y+32} V${y+42}`,kk,live[k])});
  return g+txt(xs[2]+20,y+25,"OL "+P3S.m[i].tag+(motorOL[P3S.m[i].tag]?" TRIPPED":""),"start","tg"+(motorOL[P3S.m[i].tag]?" bad":""))};
 const motor=(cx,cy,i)=>{const M=P3S.m[i];const run=Math.abs(M.s)>0.02;const ol=motorOL[M.tag];
  let g=`<circle cx="${cx}" cy="${cy}" r="36" fill="${run?"var(--hotf)":"var(--paper)"}" stroke="var(--ink)" stroke-width="3"/><text x="${cx}" y="${cy+7}" class="tg" style="font-size:20px">M</text>`;
  g+=`<g transform="rotate(${M.ang.toFixed(1)} ${cx} ${cy})"><line x1="${cx}" y1="${cy+36}" x2="${cx}" y2="${cy+24}" stroke="var(--ink)" stroke-width="4"/></g>`;
  if(run){const cw=M.s>0;g+=`<path d="${cw?`M${cx-30} ${cy+46} A44 44 0 0 0 ${cx+30} ${cy+46}`:`M${cx+30} ${cy+46} A44 44 0 0 1 ${cx-30} ${cy+46}`}" fill="none" stroke="var(--ok)" stroke-width="3" marker-end="url(#ah3)"/>`}
  const tx=cx+56;g+=`<text x="${tx}" y="${cy-14}" class="tg" style="text-anchor:start;font-size:12px">${esc(M.tag)} · ${M.hp} hp · FLA ${fla(i)} A</text>`;
  g+=txt(tx,cy+2,ol?"OVERLOAD TRIPPED":M.st,"start","tg"+(ol||/SINGLE/.test(M.st)?" bad":""));
  g+=txt(tx,cy+18,"Line amps: "+M.I.map((a,k)=>`L${k+1} ${a.toFixed(1)}`).join("  "),"start");
  g+=txt(tx,cy+34,run?(M.s>0?"Rotation: clockwise (forward)":"Rotation: counterclockwise (reverse)"):"Not turning","start");return g};
 const leadsDown=(xs,y1,y2,ks,live,i,cx,cy)=>{let g="";const sw=P3S.swap&&i===0;
  xs.forEach((x,k)=>{const tk=sw?2-k:k;const mid=y1+(y2-y1)*0.45;g+=wire(sw&&k!==1?`M${x} ${y1} V${mid} L${xs[tk]} ${mid+18} V${y2}`:`M${x} ${y1} V${y2}`,ks[k],live[k])});
  g+=xs.map((x,k)=>txt(x+(k===0?-9:k===2?9:0),y2+16,"T"+(k+1),k===0?"end":k===2?"start":"middle")).join("");
  g+=`<path d="M${xs[0]} ${y2} Q${xs[0]} ${cy-30} ${cx-22} ${cy-28} M${xs[1]} ${y2} V${cy-36} M${xs[2]} ${y2} Q${xs[2]} ${cy-30} ${cx+22} ${cy-28}" stroke="var(--ink)" stroke-width="2.5" fill="none"/>`;
  if(sw)g+=txt(xs[2]+16,(y1+y2)/2+10,"T1 ↔ T3 SWAPPED","start","tg bad");
  if(i===0)xs.forEach((x,k)=>{g+=dot(x,y2-4,"T"+(k+1))});return g};
 // supply, disconnect, fuses
 for(let k=0;k<3;k++){const x=X(k);s+=txt(x,16,"L"+(k+1),"middle","rail");s+=wire(`M${x} 24 V50`,k,true);
  s+=node(x,50)+node(x,84)+(power?`<path d="M${x} 50 L${x} 84" stroke="var(--ink)" stroke-width="3.5"/>`:`<path d="M${x} 84 L${x+20} 56" stroke="var(--ink)" stroke-width="3.5"/>`);
  s+=wire(`M${x} 84 V104`,k,power);const bl=P3S.fuse[k];
  s+=`<rect x="${x-9}" y="104" width="18" height="38" rx="3" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>`+(bl?`<path d="M${x} 108 v11 l-5 5 M${x} 138 v-11 l5 -5" stroke="var(--bad)" stroke-width="2" fill="none"/>`:`<path d="M${x} 108 q-6 7 0 15 t0 15" stroke="var(--ink)" stroke-width="2" fill="none"/>`)}
 s+=txt(X(2)+18,127,P3S.fuse.some(Boolean)?"FUSES: "+P3S.fuse.map((b,k)=>b?"F"+(k+1)+" BLOWN":null).filter(Boolean).join(", "):"F1  F2  F3","start","tg"+(P3S.fuse.some(Boolean)?" bad":""));
 s+=`<path d="M${X(0)-16} ${power?64:72} H${X(2)+24}" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 3"/>`+txt(X(2)+30,72,power?"DISCONNECT ON":"DISCONNECT OFF","start","tg"+(power?"":" bad"));
 for(let k=0;k<3;k++){s+=dot(X(k)-18,94,"L"+(k+1));s+=dot(X(k)-18,152,"F"+(k+1))}
 // control transformer: thin taps from L1 and L2 just below the fuses
 const tx=W-190,ty=176,ctl=p3CtlLive();
 s+=wire(`M${X(0)} 142 V160`,0,lineLive(0))+wire(`M${X(1)} 142 V166`,1,lineLive(1))+wire(`M${X(2)} 142 V172`,2,lineLive(2));
 s+=wire(`M${X(0)} 152 H${tx} V${ty}`,0,lineLive(0),1)+wire(`M${X(1)} 158 H${tx+70} V${ty}`,1,lineLive(1),1)+node(X(0),152)+node(X(1),158);
 s+=`<path d="M${tx} ${ty} ${Array.from({length:7},()=>"a5 5 0 0 0 10 0").join(" ")}" fill="none" stroke="var(--ink)" stroke-width="2.5"/><path d="M${tx} ${ty+10} H${tx+70} M${tx} ${ty+14} H${tx+70}" stroke="var(--ink)" stroke-width="2"/><path d="M${tx} ${ty+24} ${Array.from({length:7},()=>"a5 5 0 0 1 10 0").join(" ")}" fill="none" stroke="${ctl?"var(--hotw)":"var(--ink)"}" stroke-width="2.5"/>`;
 s+=txt(tx+35,ty+142,`CONTROL TRANSFORMER ${V} V / ${lineV()} V`)+txt(tx-6,ty+4,"H1","end")+txt(tx+76,ty+4,"H2","start");
 s+=`<path d="M${tx} ${ty+24} V${ty+74}" stroke="${ctl?"var(--hotw)":"var(--ink)"}" stroke-width="2.5"/><rect x="${tx-8}" y="${ty+38}" width="16" height="22" rx="2" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`+(P3S.cfuse?`<path d="M${tx} ${ty+41} v6 l-4 3 M${tx} ${ty+57} v-6 l4 -3" stroke="var(--bad)" stroke-width="1.6" fill="none"/>`:"");
 s+=`<path d="M${tx+70} ${ty+24} V${ty+74}" stroke="var(--ink)" stroke-width="2.5"/><path d="M${tx+70} ${ty+60} H${tx+90} V${ty+72} M${tx+80} ${ty+72} H${tx+100} M${tx+84} ${ty+77} H${tx+96} M${tx+88} ${ty+82} H${tx+92}" stroke="var(--ok)" stroke-width="2" fill="none"/>`;
 s+=txt(tx,ty+90,"X1")+txt(tx+70,ty+90,"X2")+txt(tx-14,ty+53,P3S.cfuse?"FU BLOWN":"FU","end","tg"+(P3S.cfuse?" bad":""))+txt(tx+35,ty+110,ctl?"Control power ON":"Control power OFF","middle","tg"+(ctl?"":" bad"))+txt(tx+35,ty+124,"to the ladder below · X2 grounded");
 const st=k=>lineLive(k),cl=t=>cOn(t),K=[0,1,2];
 if(c==="single"||c==="seq"){const cols=c==="seq"?[0,1]:[0];
  cols.forEach(i=>{const off=i*290,xs=K.map(k=>X(k)+off),tag=c==="seq"?"M"+(i+1):"M";
   if(i===1)K.forEach(k=>{s+=wire(`M${X(k)} ${172+k*8} H${xs[k]} V214`,k,st(k))+node(X(k),172+k*8)});else K.forEach(k=>{s+=wire(`M${xs[k]} 172 V214`,k,st(k))});
   const on=k=>st(k)&&cl(tag);s+=contactor(xs,214,tag,K.map(st),K.map(on),cl(tag));
   s+=olBlock(xs,264,i,K.map(on));s+=leadsDown(xs,306,360,K,K.map(on),i,xs[1],430);s+=motor(xs[1],430,i)})}
 if(c==="rev"){const xs=K.map(X),rx=K.map(k=>X(k)+180);
  K.forEach(k=>{s+=wire(`M${xs[k]} 172 V214`,k,st(k));s+=wire(`M${xs[k]} ${180+k*8} H${rx[k]} V214`,k,st(k))+node(xs[k],180+k*8)});
  const fo=k=>st(k)&&cl("F"),ro=k=>st(k)&&cl("R");
  s+=contactor(xs,214,"F",K.map(st),K.map(fo),cl("F"),"left");s+=contactor(rx,214,"R",K.map(st),K.map(ro),cl("R"));
  s+=`<path d="M${xs[2]+16} 239 H${rx[0]-16}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="2 4"/>`+txt((xs[2]+rx[0])/2,232,"INTERLOCK");
  // R's outputs cross: its L1 pole feeds T3 and its L3 pole feeds T1 (L2 stays on T2)
  K.forEach(k=>{const to=2-k;s+=wire(`M${rx[k]} 264 V${276+k*9} H${xs[to]}`,k,ro(k))+node(xs[to],276+k*9)});
  s+=txt(rx[2]+20,290,"R swaps L1 and L3","start");
  const Tl=K.map(j=>fo(j)||ro(2-j)),Tk=K.map(j=>cl("R")&&!cl("F")?2-j:j);
  K.forEach(j=>{s+=wire(`M${xs[j]} 264 V310`,Tk[j],Tl[j])});
  s+=olBlock(xs,310,0,Tl,Tk);s+=leadsDown(xs,352,400,Tk,Tl,0,xs[1],468);s+=motor(xs[1],468,0)}
 if(c==="wyedelta"){const xs=K.map(X),dxs=K.map(k=>X(k)+190),sxs=K.map(k=>X(k)+380),mo=k=>st(k)&&cl("M");
  K.forEach(k=>{s+=wire(`M${xs[k]} 172 V214`,k,st(k))});s+=contactor(xs,214,"M",K.map(st),K.map(mo),cl("M"));
  s+=olBlock(xs,264,0,K.map(mo));
  // D taps the OL load side: L1 -> T6, L2 -> T4, L3 -> T5
  K.forEach(k=>{s+=wire(`M${xs[k]} 306 V${318+k*8} H${dxs[k]} V340`,k,mo(k))+node(xs[k],318+k*8)});
  const dOn=k=>mo(k)&&cl("D");s+=contactor(dxs,340,"D",K.map(mo),K.map(dOn),cl("D"));
  K.forEach(k=>{s+=wire(`M${xs[k]} 306 V420`,k,mo(k))});
  s+=xs.map((x,k)=>txt(x-9,436,"T"+(k+1),"end")).join("");xs.forEach((x,k)=>{s+=dot(x,412,"T"+(k+1))});
  // motor and its six leads
  const cx=xs[1]+40,cy=520;s+=`<path d="M${xs[0]} 420 V440 L${cx-26} ${cy-26} M${xs[1]} 420 V444 L${cx-12} ${cy-34} M${xs[2]} 420 V448 L${cx+2} ${cy-36}" stroke="var(--ink)" stroke-width="2.4" fill="none"/>`;
  const TY={T4:448,T5:462,T6:476},dTo=["T6","T4","T5"];
  // T4/T5/T6 buses run right from the motor to the S contactor
  ["T4","T5","T6"].forEach((t,j)=>{const y=TY[t];s+=`<path d="M${cx+14+j*8} ${cy-34+j*4} L${cx+30+j*10} ${y} H${sxs[j]} V390" stroke="var(--ink)" stroke-width="2.4" fill="none"/>`+txt(cx+64+j*14,y-3,t,"start")});
  K.forEach(k=>{const y=TY[dTo[k]];s+=wire(`M${dxs[k]} 390 V${y}`,k,dOn(k))+node(dxs[k],y)});
  const sOn=cl("S");s+=K.map(k=>`<path d="M${sxs[k]-10} 354 H${sxs[k]+10} M${sxs[k]-10} 376 H${sxs[k]+10} M${sxs[k]} 376 V390" stroke="var(--ink)" stroke-width="3"/>`+(sOn?`<path d="M${sxs[k]} 354 V376" stroke="var(--hotw)" stroke-width="3.5"/>`:"")+`<path d="M${sxs[k]} 354 V340" stroke="var(--ink)" stroke-width="2.4"/>`).join("");
  s+=`<path d="M${sxs[0]} 340 H${sxs[2]}" stroke="var(--ink)" stroke-width="3"/>`+node(sxs[1],340)+`<path d="M${sxs[0]-16} 365 H${sxs[2]+16}" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  s+=txt(sxs[2]+20,369,"S"+(sOn?" CLOSED":" OPEN"),"start")+txt(sxs[1],330,"STAR POINT")+txt(sxs[2]+24,404,"S ties T4, T5, T6 together = wye","start")+txt(sxs[2]+24,418,"D puts a line on each = delta","start")+txt(sxs[2]+24,432,"D: L1→T6, L2→T4, L3→T5","start");
  s+=`<path d="M${sxs[2]+60} 365 H${sxs[2]+60}" />`;
  s+=motor(cx,cy,0)}
 s=`<defs><marker id="ah3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="var(--ok)"/></marker></defs>`+s;
 sv.innerHTML=s;
 const inf=$("p3info");if(inf)inf.innerHTML=`<b>${esc(CIRC[c].name)}</b><br>Supply ${V} V 3-phase: L1 ${PCOLN[V][0]}, L2 ${PCOLN[V][1]}, L3 ${PCOLN[V][2]}.<br>Control ${lineV()} V from X1 (fused) to X2 (grounded).`;
 document.querySelectorAll("[data-p3sup]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.p3sup===V));
 const sb=$("p3swap");if(sb){sb.setAttribute("aria-pressed",P3S.swap);sb.textContent=P3S.swap?"Leads swapped (T1 ↔ T3): undo":"Swap two motor leads (T1 ↔ T3)"}}
function p3Load(n,{R,put,br,set}){const pb=(r,i,k,tag)=>put(r,i,k,{tag});
 if(n==="p3seal"){P3S.circ="single";const r1=R(),r2=R(),r3=R();set([r1,r2,r3]);
  pb(r1,0,"pbnc","STOP");pb(r1,1,"pbno","START");br(r1,1,1,[[1,"no",{tag:"M"}]]);put(r1,3,"ol",{tag:"MTR1"});put(r1,7,"mcoil",{tag:"M"});
  put(r2,0,"no",{tag:"M"});put(r2,7,"lamp",{color:"#3fdc6c"});put(r3,0,"nc",{tag:"M"});put(r3,7,"lamp",{color:"#ff4a3a"});
  say("Example: 3-wire start/stop. START pulls in M; the M auxiliary contact seals around START. STOP, or the overload contact, drops it out. The three M power contacts above run the motor.")}
 if(n==="p3rev"){P3S.circ="rev";const r1=R(),r2=R(),r3=R(),r4=R();set([r1,r2,r3,r4]);
  pb(r1,0,"pbnc","STOP");pb(r1,1,"pbnc","REV");pb(r1,2,"pbno","FWD");br(r1,2,2,[[2,"no",{tag:"F"}]]);put(r1,3,"nc",{tag:"R"});put(r1,4,"ol",{tag:"MTR1"});put(r1,7,"mcoil",{tag:"F"});
  pb(r2,0,"pbnc","STOP");pb(r2,1,"pbnc","FWD");pb(r2,2,"pbno","REV");br(r2,2,2,[[2,"no",{tag:"R"}]]);put(r2,3,"nc",{tag:"F"});put(r2,4,"ol",{tag:"MTR1"});put(r2,7,"mcoil",{tag:"R"});
  put(r3,0,"no",{tag:"F"});put(r3,7,"lamp",{color:"#3fdc6c"});put(r4,0,"no",{tag:"R"});put(r4,7,"lamp",{color:"#ffd84a"});
  say("Example: forward/reverse with three interlocks. Electrical: each rung has the other contactor's NC contact. Pushbutton: FWD has an NC block in the REV rung and REV has one in the FWD rung (same name = same button). Mechanical: a lever between the contactors (drawn as a dashed bar). R swaps L1 and L3 to reverse the motor. STOP and the overload appear in both rungs; on a real drawing they're one device.")}
 if(n==="p3jog"){P3S.circ="single";const r1=R(),r2=R();set([r1,r2]);
  pb(r1,0,"pbnc","STOP");pb(r1,1,"pbno","START");br(r1,1,2,[[1,"no",{tag:"M"}],[2,"sel"]]);put(r1,3,"ol",{tag:"MTR1"});put(r1,7,"mcoil",{tag:"M"});
  put(r2,0,"no",{tag:"M"});put(r2,7,"lamp",{color:"#3fdc6c"});
  say("Example: jog with a RUN/JOG selector. In RUN the selector completes the seal-in path, so START latches. In JOG the seal-in is broken: the motor runs only while START is held. Tap the selector to switch.")}
 if(n==="p3seq"){P3S.circ="seq";const r1=R(),r2=R(),r3=R();set([r1,r2,r3]);
  pb(r1,0,"pbnc","STOP");pb(r1,1,"pbno","START");br(r1,1,1,[[1,"no",{tag:"M1"}]]);put(r1,3,"ol",{tag:"MTR1"});put(r1,7,"mcoil",{tag:"M1"});
  put(r2,0,"no",{tag:"M1"});put(r2,7,"td",{tag:"TD1",secs:5});
  put(r3,0,"tdno",{tag:"TD1"});put(r3,3,"ol",{tag:"MTR2"});put(r3,7,"mcoil",{tag:"M2"});
  say("Example: timed sequence. M1 starts first (say a conveyor's discharge belt). After 5 s, timer TD1 starts M2. If M1 stops or its overload trips, M2 stops too, because its rung is fed through M1.")}
 if(n==="p3yd"){P3S.circ="wyedelta";const r1=R(),r2=R(),r3=R(),r4=R();set([r1,r2,r3,r4]);
  pb(r1,0,"pbnc","STOP");pb(r1,1,"pbno","START");br(r1,1,1,[[1,"no",{tag:"M"}]]);put(r1,3,"ol",{tag:"MTR1"});put(r1,7,"mcoil",{tag:"M"});
  put(r2,0,"no",{tag:"M"});put(r2,7,"td",{tag:"TD1",secs:6});
  put(r3,0,"no",{tag:"M"});put(r3,1,"tdnc",{tag:"TD1"});put(r3,2,"nc",{tag:"D"});put(r3,7,"mcoil",{tag:"S"});
  put(r4,0,"no",{tag:"M"});put(r4,1,"tdno",{tag:"TD1"});put(r4,2,"nc",{tag:"S"});put(r4,7,"mcoil",{tag:"D"});
  say("Example: wye-delta (star-delta) open-transition start on a 6-lead motor. START pulls in M and S: the windings are in wye, so each sees line voltage divided by 1.73 and the motor draws about one third of across-the-line starting current. After the timer, S drops out and D pulls in: delta, full voltage. S and D are interlocked with each other's NC contacts.")}
 P3S.fuse=[false,false,false];P3S.cfuse=false;P3S.m.forEach(M=>{M.s=0;M.heat=0;M.I=[0,0,0]});$("volt").value=$("volt").value||"120";
 return true}
const SVC3={
 p3seal:[{t:"M",k:"mcoil",msg:"Pressing START does nothing. The red light stays on.",why:"Open M coil: full control voltage across it while START is held, but it never pulls in. Coil ohms read OL."},
  {t:"MTR1",k:"ol",msg:"Nothing happens when START is pressed. The overload shows not tripped.",why:"Overload contact 95-96 open: control voltage across it, OL with power off."},
  {t:"START",k:"pbno",msg:"Pressing START does nothing. The red light stays on.",why:"START contacts burned open: no voltage gets past it when it's pressed."}],
 p3rev:[{t:"R",k:"mcoil",msg:"FWD works. Pressing REV does nothing.",why:"Open R coil: control voltage across it while REV is held, coil reads OL."},
  {t:"F",k:"nc",msg:"FWD works. Pressing REV does nothing, even with the motor stopped.",why:"The F interlock contact (NC) in the REV rung is open: control voltage across it with F de-energized."},
  {t:"F",k:"mcoil",msg:"REV works. Pressing FWD does nothing.",why:"Open F coil: control voltage across it while FWD is held."}],
 p3jog:[{k:"sel",msg:"In RUN, the motor stops as soon as START is released.",why:"RUN/JOG selector contact open in RUN: the seal-in path never completes."},
  {t:"M",k:"no",msg:"In RUN, the motor stops as soon as START is released.",why:"M seal-in auxiliary contact open: it never closes when M pulls in."}],
 p3seq:[{t:"M2",k:"mcoil",msg:"Motor 1 starts. Motor 2 never starts, even after waiting.",why:"Open M2 coil: control voltage across it once TD1 times out."},
  {t:"TD1",k:"td",msg:"Motor 1 starts. Motor 2 never starts.",why:"Open timer coil: control voltage across it, it never times out."}],
 p3yd:[{t:"TD1",k:"td",msg:"The motor starts but never comes up to full speed; it stays in its starting connection.",why:"Open timer coil: it never times out, so S stays in and D never pulls in."},
  {t:"D",k:"mcoil",msg:"The motor starts, then coasts down when it should switch over.",why:"Open D coil: S drops out on time, but D never pulls in. Control voltage across D, coil reads OL."},
  {t:"S",k:"mcoil",msg:"M pulls in but the motor doesn't turn until the timer runs out, then it starts with a big current surge.",why:"Open S (star) coil: with M alone the windings aren't connected, then D starts it across the line in delta."}]};
document.addEventListener("click",ev=>{const t=ev.target.closest("[data-p3sup],#p3swap,#p3lose,#p3fuses,#p3olr");if(!t)return;
 if(t.dataset.p3sup){P3S.sup=+t.dataset.p3sup;say(`Supply set to ${P3S.sup} V. Line colors: ${PCOLN[P3S.sup].join(", ")} (L1, L2, L3).`)}
 if(t.id==="p3swap"){P3S.swap=!P3S.swap;say(P3S.swap?"Swapped T1 and T3 at the motor. Swapping any two leads reverses a 3-phase motor's rotation.":"Leads back to T1, T2, T3.")}
 if(t.id==="p3lose"){P3S.fuse[2]=true;say("F3 blew: L3 is lost. The motor is single phasing on L1 and L2.","w")}
 if(t.id==="p3fuses"){P3S.fuse=[false,false,false];P3S.cfuse=false;shortRung=null;say("Fuses replaced.")}
 if(t.id==="p3olr"){P3S.m.forEach(M=>{motorOL[M.tag]=false;M.heat=0});say("Overloads reset.")}
 save();p3Render();render()});
