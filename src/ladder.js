(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const COLS=6,CW=120,RH=130,X0=50,Y0=50;
/* element types: contacts and switches pass power; loads use it */
const E={
 no:{n:"NO contact",cat:"Contacts",load:0,tagKind:"coil",info:"Normally open contact. Closes when its coil (or overload, or timer) is energized."},
 nc:{n:"NC contact",cat:"Contacts",load:0,tagKind:"coil",info:"Normally closed contact. Opens when its coil is energized."},
 tdno:{n:"Timer contact NO (on-delay)",cat:"Contacts",load:0,tagKind:"timer",info:"Closes after its timer coil has been energized for the set time."},
 tdnc:{n:"Timer contact NC (on-delay)",cat:"Contacts",load:0,tagKind:"timer",info:"Opens after its timer coil has been energized for the set time."},
 ol:{n:"Overload contact (NC)",cat:"Contacts",load:0,tagKind:"motor",info:"Normally closed. Opens when its motor's overload trips. Wire it in series with that motor's starter coil."},
 pbno:{n:"Pushbutton NO (start)",cat:"Switches",load:0,manual:"push",info:"Momentary. Closes while pressed. Tap it to press."},
 pbnc:{n:"Pushbutton NC (stop)",cat:"Switches",load:0,manual:"push",info:"Momentary. Opens while pressed. Tap it to press."},
 sw:{n:"Toggle switch",cat:"Switches",load:0,manual:"toggle",info:"Maintained on/off switch. Tap to flip."},
 ty:{n:"Thermostat Y (cool)",cat:"Switches",load:0,info:"Closes when the thermostat calls for cooling."},
 tw:{n:"Thermostat W (heat)",cat:"Switches",load:0,info:"Closes when the thermostat calls for heat."},
 tg:{n:"Thermostat G (fan)",cat:"Switches",load:0,info:"Closes for cooling or fan-on."},
 hps:{n:"High pressure switch (NC)",cat:"Switches",load:0,manual:"trip",info:"Closed normally, opens on high head pressure. Tap to simulate a trip."},
 lps:{n:"Low pressure switch (NC)",cat:"Switches",load:0,manual:"trip",info:"Closed while suction pressure is normal, opens on loss of charge. Tap to simulate."},
 lim:{n:"High limit (NC)",cat:"Switches",load:0,manual:"trip",info:"Furnace high limit. Opens on overheating. Tap to simulate."},
 tsw:{n:"Temperature switch (NO, closes on rise)",cat:"Switches",load:0,manual:"toggle",info:"Snap disc that closes on temperature rise (like a fan control). Tap to change."},
 tsc:{n:"System switch: COOL",cat:"Thermostat",load:0,info:"Inside the thermostat. Closed when the system is set to Cool (or Auto)."},
 tsh:{n:"System switch: HEAT",cat:"Thermostat",load:0,info:"Inside the thermostat. Closed when the system is set to Heat (or Auto)."},
 tcc:{n:"Cooling call (closes on rise)",cat:"Thermostat",load:0,info:"Closes when the room rises above the cool setpoint."},
 thc:{n:"Heating call (closes on fall)",cat:"Thermostat",load:0,info:"Closes when the room falls below the heat setpoint."},
 tfo:{n:"Fan switch: ON",cat:"Thermostat",load:0,info:"Closed when the fan is set to On: R goes straight to G."},
 tfa:{n:"Fan switch: AUTO",cat:"Thermostat",load:0,info:"Closed when the fan is set to Auto. In series with the cooling call, it runs the fan only during a call."},
 tterm:{n:"Terminal (R, Y, G, W...)",cat:"Thermostat",load:0,info:"A labeled wiring terminal. It passes power straight through and shows where a wire leaves the thermostat or a board."},
 coil:{n:"Relay coil (CR)",cat:"Loads",load:1,coil:"CR",info:"Control relay coil. Energized, it flips every contact tagged with its name."},
 mcoil:{n:"Contactor / starter coil (M)",cat:"Loads",load:1,coil:"M",info:"Motor starter or contactor coil. Its contacts carry the motor's power."},
 td:{n:"Timer coil (TD, on-delay)",cat:"Loads",load:1,coil:"TD",info:"On-delay timer. After it stays energized for its set time, its timer contacts change."},
 motor:{n:"Motor",cat:"Loads",load:1,motor:1,info:"A motor load. Tap to trip its overload (opens its OL contact)."},
 lamp:{n:"Pilot light",cat:"Loads",load:1,info:"Indicator lamp."},
 sol:{n:"Solenoid valve",cat:"Loads",load:1,info:"Valve coil, for example a liquid line solenoid."},
 heat:{n:"Heater",cat:"Loads",load:1,info:"Resistance heater."},
 buzz:{n:"Alarm buzzer",cat:"Loads",load:1,info:"Alarm."}
};
const CATS=["Contacts","Switches","Thermostat","Loads"];
const LTS={sys:"off",fan:"auto",room:76,hs:68,cs:74,callC:false,callH:false};
let rungs=[],power=true,placing=null,sel=null,hist=[],idn=1,shortRung=null;
const blank=()=>({cells:Array(COLS).fill(null),branch:null});
function mk(k){const e={id:"e"+(idn++),k,st:{}};const t=E[k];
 if(t.coil){const n=allTags(t.coil).length+1;e.tag=t.coil+n}
 if(t.motor){e.tag="MTR"+(allTags("MTR").length+1)}
 if(k==="td")e.secs=5;
 if(t.tagKind){const c=tagsFor(t.tagKind);e.tag=c[0]||""}
 if(k==="lamp")e.color="#3fdc6c";
 if(k==="tterm")e.tag="Y";
 return e}
function each(f){rungs.forEach((r,ri)=>{r.cells.forEach((c,ci)=>c&&f(c,ri,"m",ci));if(r.branch)r.branch.cells.forEach((c,ci)=>c&&f(c,ri,"b",ci))})}
function allTags(prefix){const s=[];each(c=>{if(c.tag&&c.tag.startsWith(prefix)&&(E[c.k].coil||E[c.k].motor))s.push(c.tag)});return [...new Set(s)]}
function tagsFor(kind){const s=new Set();each(c=>{const t=E[c.k];if(kind==="coil"&&t.coil&&t.coil!=="TD")s.add(c.tag);if(kind==="timer"&&c.k==="td")s.add(c.tag);if(kind==="motor"&&t.motor)s.add(c.tag)});return [...s]}
function snap(){hist.push(JSON.stringify({rungs,idn}));if(hist.length>60)hist.shift()}
function save(){try{localStorage.setItem("ld-board",JSON.stringify({rungs,idn,lts:{sys:LTS.sys,fan:LTS.fan,room:LTS.room,hs:LTS.hs,cs:LTS.cs}}))}catch(e){}}

/* ---------- evaluation ---------- */
let coilOn={},timers={},motorOL={},energized=new Set(),hotEdges=new Set();
function closed(c){const k=c.k,s=c.st;
 switch(k){case "no":return !!coilOn[c.tag];case "nc":return !coilOn[c.tag];
  case "tdno":return !!(timers[c.tag]&&timers[c.tag].done);case "tdnc":return !(timers[c.tag]&&timers[c.tag].done);
  case "ol":return !motorOL[c.tag];
  case "pbno":return !!s.down;case "pbnc":return !s.down;case "sw":case "tsw":return !!s.on;
  case "ty":return tY();case "tw":return tW();case "tg":return LTS.fan==="on"||tY();
  case "tsc":return sysC();case "tsh":return sysH();case "tcc":return LTS.callC;case "thc":return LTS.callH;case "tfo":return LTS.fan==="on";case "tfa":return LTS.fan==="auto";case "tterm":return true;
  case "hps":case "lps":case "lim":return !s.trip}
 return true}
const sysC=()=>LTS.sys==="cool"||LTS.sys==="auto",sysH=()=>LTS.sys==="heat"||LTS.sys==="auto",tY=()=>sysC()&&LTS.callC,tW=()=>sysH()&&LTS.callH;
const TSK=["ty","tw","tg","tsc","tsh","tcc","thc","tfo","tfa"];
function updCalls(){const c=LTS.callC,h=LTS.callH;if(LTS.room>=LTS.cs+1)LTS.callC=true;else if(LTS.room<=LTS.cs-1)LTS.callC=false;if(LTS.room<=LTS.hs-1)LTS.callH=true;else if(LTS.room>=LTS.hs+1)LTS.callH=false;
 if(c!==LTS.callC&&sysC())say(LTS.callC?`Room ${Math.round(LTS.room)}°F: cooling call (R to Y).`:`Room ${Math.round(LTS.room)}°F: cooling satisfied.`);
 if(h!==LTS.callH&&sysH())say(LTS.callH?`Room ${Math.round(LTS.room)}°F: heating call (R to W).`:`Room ${Math.round(LTS.room)}°F: heating satisfied.`)}
function drift(dt){let has=false,cool=false,heat=false;each(c=>{if(TSK.includes(c.k))has=true;if(energized.has(c.id)){if(c.k==="motor"&&/COMP/.test(c.tag)&&!motorOL[c.tag])cool=true;if(c.k==="heat")heat=true}});if(!has)return;
 const out=LTS.sys==="heat"?55:LTS.sys==="off"?LTS.room:88,d=out-LTS.room;const rate=cool||heat?(cool?-0.35:0)+(heat?0.35:0):Math.sign(d)*Math.min(Math.abs(d),0.08);
 LTS.room+=rate*dt;LTS.room=Math.max(50,Math.min(95,LTS.room));}
function solveRung(r,ri){
 if(r.cells.every(c=>!c)&&!r.branch)return {live:[],series:false,hot:new Set(),empty:true};
 // nodes: main n0..nCOLS ; branch nodes map onto main at its ends
 const par=[];const find=x=>{while(par[x]!==x){par[x]=par[par[x]];x=par[x]}return x};const uni=(a,b)=>{a=find(a);b=find(b);if(a!==b)par[a]=b};
 const N=COLS+1+COLS+1;for(let i=0;i<N;i++)par[i]=i;
 const edges=[];
 r.cells.forEach((c,i)=>edges.push({a:i,b:i+1,c,where:"m",i}));
 if(r.branch){const {from,to}=r.branch;const bn=i=>i===from?from:i===to+1?to+1:COLS+1+i;
  for(let i=from;i<=to;i++)edges.push({a:bn(i),b:bn(i+1),c:r.branch.cells[i],where:"b",i})}
 edges.forEach(e=>{if(!e.c||(!E[e.c.k].load&&closed(e.c)))uni(e.a,e.b)});
 const L=0,R=COLS;
 if(find(L)===find(R))return {short:true,edges};
 const live=[];
 edges.forEach(e=>{if(e.c&&E[e.c.k].load){const ok=(find(e.a)===find(L)&&find(e.b)===find(R))||(find(e.b)===find(L)&&find(e.a)===find(R));if(ok)live.push(e)}});
 // series loads: a load touches L side but the other end doesn't reach R directly
 const series=edges.some(e=>e.c&&E[e.c.k].load&&(find(e.a)===find(L)||find(e.b)===find(L))&&!live.includes(e))&&edges.filter(e=>e.c&&E[e.c.k].load).length>1;
 // hot edges for drawing
 const hot=new Set();edges.forEach(e=>{const lf=find(e.a)===find(L)||find(e.b)===find(L);const conducting=!e.c||(!E[e.c.k].load&&closed(e.c));if(lf&&conducting)hot.add(e.where+e.i);if(live.includes(e))hot.add(e.where+e.i)});
 // conductors on the right side of a live load are also carrying current
 edges.forEach(e=>{const rt=find(e.a)===find(R)||find(e.b)===find(R);const conducting=!e.c||(!E[e.c.k].load&&closed(e.c));if(rt&&conducting&&live.length)hot.add(e.where+e.i)});
 return {live,series,hot}}
let lastShortLog=-1;
function evaluate(dt){updCalls();
 for(let it=0;it<10;it++){
  const nextCoil={};energized=new Set();hotEdges=new Set();let sr=null,seriesR=[];
  if(power)rungs.forEach((r,ri)=>{const s=solveRung(r,ri);if(s.short){sr=ri;return}if(s.series)seriesR.push(ri);
   s.live.forEach(e=>{energized.add(e.c.id);const t=E[e.c.k];if(t.coil)nextCoil[e.c.tag]=true});s.hot.forEach(h=>hotEdges.add(ri+":"+h))});
  if(sr!=null){power=false;shortRung=sr;arc(sr);return}
  seriesR.forEach(ri=>{if(!warned[ri]){warned[ri]=1;say(`Rung ${ri+1}: two loads in series. Each gets only part of the voltage, so neither works. Put loads in parallel (on a branch) instead.`,"w")}});
  const same=Object.keys(nextCoil).length===Object.keys(coilOn).filter(k=>coilOn[k]).length&&Object.keys(nextCoil).every(k=>coilOn[k]);
  // timers (TD coils): count while energized
  Object.keys(timers).forEach(k=>{if(!nextCoil[k])delete timers[k]});
  Object.keys(nextCoil).filter(k=>k.startsWith("TD")).forEach(k=>{if(!timers[k])timers[k]={t:0,done:false}});
  Object.keys(nextCoil).forEach(k=>{if(nextCoil[k]&&!coilOn[k])say(`${k} energized.`)});Object.keys(coilOn).forEach(k=>{if(coilOn[k]&&!nextCoil[k])say(`${k} de-energized.`)});
  coilOn=nextCoil;if(same)break}
 // run timers
 each(c=>{if(c.k==="td"&&timers[c.tag]&&!timers[c.tag].done){timers[c.tag].t+=dt;if(timers[c.tag].t>=c.secs){timers[c.tag].done=true;say(`${c.tag} timed out after ${c.secs} s. Its contacts change.`)}}});
 // momentary pushbuttons release
 each(c=>{if((c.k==="pbno"||c.k==="pbnc")&&c.st.down){c.st.t=(c.st.t||0)+dt;if(c.st.t>0.8){c.st.down=false;c.st.t=0}}});
 drift(dt);
}
let warned={};

function renderTstat(){const el=$("tRoom");if(!el)return;el.textContent=Math.round(LTS.room)+"°";
 document.querySelectorAll("[data-sys]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sys===LTS.sys));document.querySelectorAll("[data-fan]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.fan===LTS.fan));
 $("tHs").textContent=LTS.hs+"°";$("tCs").textContent=LTS.cs+"°";
 $("tMode").textContent=LTS.sys.toUpperCase()+" · FAN "+LTS.fan.toUpperCase();
 const on=[["R-Y",tY()],["R-G",LTS.fan==="on"||tY()],["R-W",tW()]].filter(x=>x[1]).map(x=>x[0]);$("tCall").textContent=on.length?`Closed now: ${on.join(", ")}`:"No call: R is not connected to Y, G or W."}
/* ---------- drawing ---------- */
const svg=$("ladder");
const sym=(c,x,y,on,br)=>{const k=c.k,col=on?"var(--hotw)":"var(--ink)";const mid=y;
 const lbl=(s,dy=br?30:-26)=>`<text x="${x+CW/2}" y="${mid+dy}" class="tg">${esc(s)}</text>`;
 const lineL=`<line x1="${x}" y1="${mid}" x2="${x+40}" y2="${mid}" stroke="${col}" stroke-width="3"/>`,lineR=`<line x1="${x+80}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/>`;
 const cl=closed(c);
 if(k==="no"||k==="nc"||k==="tdno"||k==="tdnc"||k==="ol"){const ncS=k==="nc"||k==="tdnc"||k==="ol";
  return lineL+lineR+`<line x1="${x+44}" y1="${mid-16}" x2="${x+44}" y2="${mid+16}" stroke="${col}" stroke-width="3"/><line x1="${x+76}" y1="${mid-16}" x2="${x+76}" y2="${mid+16}" stroke="${col}" stroke-width="3"/>`+(ncS?`<line x1="${x+38}" y1="${mid+16}" x2="${x+82}" y2="${mid-16}" stroke="${col}" stroke-width="2"/>`:"")+(cl&&!ncS?`<line x1="${x+44}" y1="${mid}" x2="${x+76}" y2="${mid}" stroke="${col}" stroke-width="3" opacity=".6"/>`:"")+(!cl&&ncS?`<text x="${x+60}" y="${mid+(br?-20:30)}" class="tg" fill="var(--bad)">OPEN</text>`:"")+lbl(k==="ol"?`OL ${c.tag}`:k.startsWith("td")?`${c.tag} ${k==="tdno"?"TDC":"TDO"}`:c.tag||"?")}
 if(k==="pbno"||k==="pbnc"){const d=c.st.down;return lineL+lineR+`<line x1="${x+40}" y1="${mid}" x2="${x+44}" y2="${mid}" stroke="${col}" stroke-width="3"/><line x1="${x+76}" y1="${mid}" x2="${x+80}" y2="${mid}" stroke="${col}" stroke-width="3"/><circle cx="${x+44}" cy="${mid}" r="3" fill="${col}"/><circle cx="${x+76}" cy="${mid}" r="3" fill="${col}"/>`+
  (k==="pbno"?`<line x1="${x+40}" y1="${mid-(d?3:12)}" x2="${x+80}" y2="${mid-(d?3:12)}" stroke="${col}" stroke-width="3"/>`:`<line x1="${x+40}" y1="${mid+(d?-12:4)}" x2="${x+80}" y2="${mid+(d?-12:4)}" stroke="${col}" stroke-width="3"/>`)+`<line x1="${x+60}" y1="${mid-(d?3:12)}" x2="${x+60}" y2="${mid-26}" stroke="${col}" stroke-width="2"/><rect x="${x+50}" y="${mid-32}" width="20" height="6" fill="${k==="pbno"?"var(--ok)":"var(--bad)"}"/>`+`<text x="${x+CW/2}" y="${mid-38}" class="tg">${k==="pbno"?"START":"STOP"}</text>`}
 if(k==="tterm")return `<line x1="${x}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/><circle cx="${x+60}" cy="${mid}" r="12" fill="var(--paper)" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+5}" class="tg" style="font-size:13px">${esc(c.tag||"?")}</text>`;
 if(k==="tsw"||k==="lim"||k==="tcc"||k==="thc"){const ncS=k==="lim"||k==="thc";const name={tsw:"TEMP SW",lim:"HIGH LIMIT",tcc:"COOL CALL",thc:"HEAT CALL"}[k];
  const by=ncS?mid+(cl?2:16):mid-(cl?2:16),my=(mid+by)/2,sx=x+61;
  const zz=ncS?`M${sx} ${my-1} V${mid-18}`:`M${sx} ${my+1} V${mid+12}`,ey=ncS?mid-22:mid+16;
  return lineL+lineR+`<circle cx="${x+44}" cy="${mid}" r="3" fill="${col}"/><circle cx="${x+76}" cy="${mid}" r="3" fill="${col}"/><line x1="${x+44}" y1="${mid}" x2="${x+80}" y2="${by}" stroke="${col}" stroke-width="3"/>`+
   `<path d="${zz}" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 2" fill="none"/><path d="M${sx-10} ${ey} l3.3 -4 l3.3 8 l3.3 -8 l3.3 8 l3.3 -8 l3.4 4" stroke="${col}" stroke-width="2" fill="none" stroke-linejoin="round"/>`+
   `<text x="${x+CW/2}" y="${mid+(ncS?34:38)}" class="tg"${!cl&&k==="lim"?' fill="var(--bad)"':""}>${name}${!cl&&k==="lim"?" OPEN":""}</text><text x="${x+CW/2}" y="${mid+(ncS?46:50)}" class="tg" style="font-size:9px;fill:var(--muted)">${ncS?"OPENS ON RISE":"CLOSES ON RISE"}</text>`}
 if(["sw","ty","tw","tg","hps","lps","tsc","tsh","tfo","tfa"].includes(k)){const name={sw:"SWITCH",tsw:"TEMP SW",ty:"T'STAT Y",tw:"T'STAT W",tg:"T'STAT G",hps:"HPS",lps:"LPS",lim:"LIMIT",tsc:"SYS COOL",tsh:"SYS HEAT",tcc:"COOL CALL",thc:"HEAT CALL",tfo:"FAN ON",tfa:"FAN AUTO"}[k];
  return lineL+lineR+`<circle cx="${x+44}" cy="${mid}" r="3" fill="${col}"/><circle cx="${x+76}" cy="${mid}" r="3" fill="${col}"/><line x1="${x+44}" y1="${mid}" x2="${x+78}" y2="${mid-(cl?2:16)}" stroke="${col}" stroke-width="3"/>`+(k==="hps"||k==="lps"?`<path d="M${x+60} ${mid+6} v10 m-8 0 h16" stroke="${col}" fill="none" stroke-width="2"/>`:"")+`<text x="${x+CW/2}" y="${mid+34}" class="tg"${!cl&&(k==="hps"||k==="lps"||k==="lim")?' fill="var(--bad)"':""}>${name}${!cl&&(k==="hps"||k==="lps"||k==="lim")?" OPEN":""}</text>`}
 // loads
 const lw=`<line x1="${x}" y1="${mid}" x2="${x+38}" y2="${mid}" stroke="${col}" stroke-width="3"/><line x1="${x+82}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/>`;
 if(E[k].coil){const t=timers[c.tag];return lw+`<circle cx="${x+60}" cy="${mid}" r="22" fill="${on?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+5}" class="tg" style="font-size:13px">${esc(c.tag)}</text>`+(k==="td"?`<text x="${x+60}" y="${mid+36}" class="tg">${t?(t.done?"DONE":(c.secs-t.t).toFixed(1)+" s"):c.secs+" s"}</text>`:"")}
 if(k==="motor"){const ol=motorOL[c.tag],run=on&&!ol,wc=run?"var(--hotw)":col;
  const coil=(x1,x2,yy)=>{let d=`M${x1} ${yy}`;const n=4,w=(x2-x1)/n;for(let i=0;i<n;i++)d+=` a${w/2} ${w/2} 0 0 1 ${w} 0`;return d};
  const C=x+14,R=x+84,S=x+72,L1=x+26,L2=x+62;
  return `<line x1="${x}" y1="${mid}" x2="${C}" y2="${mid}" stroke="${col}" stroke-width="3"/><line x1="${R}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/>`+
   `<rect x="${x+4}" y="${mid-32}" width="94" height="62" rx="10" fill="${run?"var(--hotf)":"var(--paper)"}" fill-opacity=".45" stroke="${col}" stroke-width="1.4" stroke-dasharray="5 3"/>`+
   `<path d="M${C} ${mid} V${mid-15} H${L1} M${L2} ${mid-15} H${R} V${mid} M${C} ${mid} V${mid+15} H${L1} M${L2} ${mid+15} H${S}" stroke="${wc}" stroke-width="2" fill="none"/>`+
   `<path d="${coil(L1,L2,mid-15)}" stroke="${wc}" stroke-width="2.2" fill="none"/><path d="${coil(L1,L2,mid+15)}" stroke="${wc}" stroke-width="2.2" fill="none"/>`+
   `<path d="M${S} ${mid+15} H${R} V${mid+10} M${R-7} ${mid+10} H${R+7} M${R-7} ${mid+5} q7 3.5 14 0 M${R} ${mid+5} V${mid}" stroke="${wc}" stroke-width="2" fill="none"/>`+
   `<circle cx="${C}" cy="${mid}" r="3.2" fill="${col}"/><circle cx="${R}" cy="${mid}" r="3.2" fill="${col}"/><circle cx="${S}" cy="${mid+15}" r="2.6" fill="${col}"/>`+
   `<text x="${C-6}" y="${mid-5}" class="tg" style="font-size:10px">C</text><text x="${R+6}" y="${mid-5}" class="tg" style="font-size:10px">R</text><text x="${S}" y="${mid+27}" class="tg" style="font-size:10px">S</text>`+
   `<text x="${(L1+L2)/2}" y="${mid-21}" class="tg" style="font-size:8.5px">RUN</text><text x="${(L1+L2)/2}" y="${mid+27}" class="tg" style="font-size:8.5px">START</text><text x="${R+10}" y="${mid+12}" class="tg" style="font-size:8.5px;text-anchor:start">CAP</text>`+
   `<text x="${x+51}" y="${mid+44}" class="tg">${esc(c.tag)}${ol?" OL TRIPPED":run?" RUNNING":""}</text>`}
 if(k==="lamp")return lw+`<circle cx="${x+60}" cy="${mid}" r="20" fill="${on?c.color:"var(--paper)"}" stroke="${col}" stroke-width="3" ${on?'filter="url(#glow)"':""}/><path d="M${x+46} ${mid-14} l28 28 M${x+74} ${mid-14} l-28 28" stroke="${col}" stroke-width="2"/>`;
 if(k==="sol")return lw+`<rect x="${x+40}" y="${mid-16}" width="40" height="32" fill="${on?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><path d="M${x+44} ${mid} q4 -10 8 0 q4 10 8 0 q4 -10 8 0 q4 10 8 0" stroke="${col}" fill="none" stroke-width="2"/><text x="${x+60}" y="${mid+34}" class="tg">SOL</text>`;
 if(k==="heat")return lw+`<path d="M${x+38} ${mid} l4 -12 l8 24 l8 -24 l8 24 l8 -24 l8 24 l4 -12" stroke="${on?"#ff5a1f":col}" fill="none" stroke-width="3"/><text x="${x+60}" y="${mid+34}" class="tg">HTR</text>`;
 if(k==="buzz")return lw+`<path d="M${x+40} ${mid+14} h40 a20 20 0 0 0 -40 0" fill="${on?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+34}" class="tg">ALARM${on?" !!":""}</text>`;
 return ""};
function render(){
 const H=Y0+rungs.length*RH+60,W=X0*2+COLS*CW;svg.setAttribute("viewBox",`0 0 ${W} ${H}`);svg.style.width="100%";svg.style.maxWidth=W+"px";svg.style.height="auto";
 let s=`<defs><filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="arc"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#cfefff"/><stop offset="1" stop-color="#2f6fd6" stop-opacity="0"/></radialGradient></defs>`;
 const railC=power?"var(--hotw)":"var(--muted)";
 s+=`<line x1="${X0}" y1="${Y0-30}" x2="${X0}" y2="${H-30}" stroke="${railC}" stroke-width="5"/><line x1="${X0+COLS*CW}" y1="${Y0-30}" x2="${X0+COLS*CW}" y2="${H-30}" stroke="var(--ink)" stroke-width="5"/>`;
 s+=`<text x="${X0}" y="${Y0-36}" class="rail">${$("volt").value==="24"?"R (24 V)":"L1"}</text><text x="${X0+COLS*CW}" y="${Y0-36}" class="rail">${$("volt").value==="24"?"C":"N / L2"}</text>`;
 rungs.forEach((r,ri)=>{const y=Y0+ri*RH+20,yb=y+56;
  s+=`<text x="${X0-28}" y="${y+5}" class="rn">${ri+1}</text>`;
  for(let i=0;i<COLS;i++){const x=X0+i*CW,c=r.cells[i],hot=hotEdges.has(ri+":m"+i);
   s+=`<g class="cell${placing?" drop":""}" data-r="${ri}" data-w="m" data-i="${i}"><rect x="${x+2}" y="${y-44}" width="${CW-4}" height="88" fill="transparent"/>`;
   const emp=r.cells.every(z=>!z)&&!r.branch;
   s+=c?`<g class="el${sel===c.id?" sel":""}" data-id="${c.id}">${sym(c,x,y,energized.has(c.id)||(hot&&!E[c.k].load))}</g>`:`<line x1="${x}" y1="${y}" x2="${x+CW}" y2="${y}" stroke="${hot?"var(--hotw)":emp?"var(--line)":"var(--ink)"}" stroke-width="3"${emp?' stroke-dasharray="6 6"':""}/>`;
   s+=`</g>`}
  if(r.cells.every(z=>!z)&&!r.branch)s+=`<text x="${X0+COLS*CW/2}" y="${y-10}" class="tg" fill="var(--muted)">empty rung: tap a part, then tap here</text>`;
  if(r.branch){const {from,to}=r.branch;const xa=X0+from*CW,xb=X0+(to+1)*CW;
   s+=`<line x1="${xa}" y1="${y}" x2="${xa}" y2="${yb}" stroke="var(--ink)" stroke-width="3"/><line x1="${xb}" y1="${y}" x2="${xb}" y2="${yb}" stroke="var(--ink)" stroke-width="3"/><circle cx="${xa}" cy="${y}" r="4"/><circle cx="${xb}" cy="${y}" r="4"/>`;
   for(let i=from;i<=to;i++){const x=X0+i*CW,c=r.branch.cells[i],hot=hotEdges.has(ri+":b"+i);
    s+=`<g class="cell${placing?" drop":""}" data-r="${ri}" data-w="b" data-i="${i}"><rect x="${x+2}" y="${yb-30}" width="${CW-4}" height="60" fill="transparent"/>`;
    s+=c?`<g class="el${sel===c.id?" sel":""}" data-id="${c.id}">${sym(c,x,yb,energized.has(c.id)||(hot&&!E[c.k].load),1)}</g>`:`<line x1="${x}" y1="${yb}" x2="${x+CW}" y2="${yb}" stroke="${hot?"var(--hotw)":"var(--ink)"}" stroke-width="3"/>`;s+=`</g>`}}
  else if(placing){for(let i=0;i<COLS;i++){const x=X0+i*CW;s+=`<g class="cell drop br" data-r="${ri}" data-w="b" data-i="${i}"><rect x="${x+6}" y="${yb-22}" width="${CW-12}" height="40" rx="6" fill="transparent" stroke="var(--line)" stroke-dasharray="4 4"/><text x="${x+CW/2}" y="${yb+4}" class="tg" fill="var(--muted)">branch</text></g>`}}
  if(r.branch)for(let i=r.branch.from;i<=r.branch.to;i++){const a=r.cells[i],b2=r.branch.cells[i];if(a&&b2&&((a.k==="tfo"&&b2.k==="tfa")||(a.k==="tfa"&&b2.k==="tfo"))){const x=X0+i*CW+62;
   s+=`<path d="M${x} ${y-(closed(a)?1:8)} V${yb-(closed(b2)?1:8)}" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="4 3"/><text x="${x+7}" y="${y+16}" class="tg" style="font-size:9px;text-anchor:start;fill:var(--muted)">ONE FAN SELECTOR</text>`}}
  if(shortRung===ri)s+=`<rect x="${X0}" y="${y-30}" width="${COLS*CW}" height="60" fill="none" stroke="var(--bad)" stroke-width="4" class="blinkR"/>`;
 });
 s+=`<g id="fx"></g>`;
 svg.innerHTML=s;
 $("pwr").textContent=power?"Power: on":"Power: off";$("pwr").setAttribute("aria-pressed",power);
 renderTstat();
 renderSheet()}
function renderPalette(){$("palette").innerHTML=CATS.map(c=>`<h3>${c}</h3><div class="pal">${Object.entries(E).filter(([k,t])=>t.cat===c).map(([k,t])=>`<button class="palItem${placing===k?" on":""}" data-add="${k}" title="${esc(t.info)}">${esc(t.n)}</button>`).join("")}</div>`).join("")}
function say(m,c=""){const d=document.createElement("div");d.innerHTML=`<span class="${c}">${esc(m)}</span>`;$("log").prepend(d);while($("log").children.length>100)$("log").lastChild.remove()}
function arc(ri){say(`ARC FLASH: rung ${ri+1} connects ${$("volt").value==="24"?"R straight to C":"L1 straight to the other side"} with no load. Dead short. Power off.`,"b");
 render();const fx=svg.querySelector("#fx");const y=Y0+ri*RH+20,x=X0+COLS*CW/2;fx.innerHTML=`<circle cx="${x}" cy="${y}" r="160" fill="url(#arc)" class="flash"/>`+Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return `<path d="M${x} ${y} l${(Math.cos(a)*50).toFixed(0)} ${(Math.sin(a)*50).toFixed(0)} l${(Math.cos(a+.5)*25).toFixed(0)} ${(Math.sin(a+.5)*25).toFixed(0)} l${(Math.cos(a)*40).toFixed(0)} ${(Math.sin(a)*40).toFixed(0)}" stroke="#bfe6ff" stroke-width="3" fill="none" class="flash"/>`}).join("");
 const w=$("wrapL");w.classList.remove("shake");void w.offsetWidth;w.classList.add("shake");
 $("mT").textContent="Arc flash: dead short";$("mB").innerHTML=`<p>Rung ${ri+1} has a path from the left rail to the right rail with nothing that uses power in it. With its switches closed, that's a dead short across the supply.</p><p>Every rung needs a load (a coil, motor, light, solenoid or heater) between its switches and the right rail. Contacts and switches go on the left; the load goes on the right. Watch for a branch that bypasses the load too.</p><p>Fix rung ${ri+1} (outlined in red), then turn the power back on.</p>`;$("modal").hidden=false}

/* ---------- sheet for a selected element ---------- */
function findEl(id){let f=null;rungs.forEach((r,ri)=>{r.cells.forEach((c,i)=>{if(c&&c.id===id)f={c,ri,w:"m",i}});if(r.branch)r.branch.cells.forEach((c,i)=>{if(c&&c.id===id)f={c,ri,w:"b",i}})});return f}
function renderSheet(){const f=sel&&findEl(sel);const box=$("elSheet");if(!f){box.hidden=true;box.dataset.sel="";return}box.hidden=false;const c=f.c,t=E[c.k];
 if(box.dataset.sel===sel&&box.contains(document.activeElement)&&/INPUT|SELECT/.test(document.activeElement.tagName))return;box.dataset.sel=sel;
 let h=`<h3>${esc(t.n)} <span class="note">rung ${f.ri+1}${f.w==="b"?", branch":""}</span></h3><div class="btns">`;
 if(t.manual)h+=`<button class="btn blue" data-op="act">${t.manual==="push"?"Press":t.manual==="trip"?(c.st.trip?"Reset":"Trip it"):(c.st.on?"Turn off":"Turn on")}</button>`;
 if(t.motor)h+=`<button class="btn" data-op="ol">${motorOL[c.tag]?"Reset overload":"Trip overload"}</button>`;
 if(t.tagKind){const opts=tagsFor(t.tagKind);h+=`<label class="inl">Tied to <select data-op="tag">${opts.length?opts.map(o=>`<option${o===c.tag?" selected":""}>${o}</option>`).join(""):`<option value="">add a ${t.tagKind==="timer"?"timer coil":t.tagKind==="motor"?"motor":"coil"} first</option>`}</select></label>`}
 if(t.coil||t.motor)h+=`<label class="inl">Name <input data-op="name" value="${esc(c.tag)}" maxlength="8" size="7"></label>`;
 if(c.k==="td")h+=`<label class="inl">Delay <input data-op="secs" type="number" min="1" max="120" value="${c.secs}" style="width:64px"> s</label>`;
 if(c.k==="lamp")h+=`<label class="inl">Color <select data-op="color">${[["#3fdc6c","Green"],["#ff4a3a","Red"],["#ffd84a","Amber"],["#e9ecee","White"]].map(([v,n])=>`<option value="${v}"${v===c.color?" selected":""}>${n}</option>`).join("")}</select></label>`;
 if(c.k==="tterm")h+=`<label class="inl">Terminal <select data-op="term">${["R","C","Y","Y2","G","W","W2","O","B"].map(o=>`<option${o===c.tag?" selected":""}>${o}</option>`).join("")}</select></label>`;
 if(TSK.includes(c.k))h+=`<span class="note">Set the system, fan and room temperature in the Thermostat panel.</span>`;
 if(c.k==="no"||c.k==="nc")h+=`<button class="btn" data-op="flip">Make it ${c.k==="no"?"NC":"NO"}</button>`;
 if(f.w==="b"){const br=rungs[f.ri].branch;h+=`<button class="btn" data-op="bl">Branch ◀ wider</button><button class="btn" data-op="br">Branch wider ▶</button><button class="btn" data-op="bs">Narrower</button>`}
 h+=`<button class="btn red" data-op="del">Remove</button></div><p class="note">${esc(t.info)}</p>${partCardHTML(c.k)}`;box.innerHTML=h}

/* ---------- interaction ---------- */
function place(k,ri,w,i){snap();const r=rungs[ri];const e=mk(k);
 if(w==="m"){r.cells[i]=e}else{if(!r.branch)r.branch={from:i,to:i,cells:Array(COLS).fill(null)};const b=r.branch;if(i<b.from)b.from=i;if(i>b.to)b.to=i;b.cells[i]=e}
 sel=e.id;say(`Placed ${E[k].n}${e.tag?" ("+e.tag+")":""} on rung ${ri+1}${w==="b"?" branch":""}.`);shortRung=null;warned={};save()}
svg.addEventListener("click",ev=>{const el=ev.target.closest(".el"),cell=ev.target.closest(".cell");
 if(placing&&cell){place(placing,+cell.dataset.r,cell.dataset.w,+cell.dataset.i);if(!ev.shiftKey){placing=null;renderPalette()}render();return}
 if(el){const f=findEl(el.dataset.id);sel=el.dataset.id;const t=E[f.c.k];
  if(t.manual==="push"){f.c.st.down=true;f.c.st.t=0}
  render();if(t.manual!=="push"){const sh=$("elSheet"),rc=sh.getBoundingClientRect();if(rc.top>innerHeight-80||rc.bottom<0)sh.scrollIntoView({behavior:"smooth",block:"nearest"})}return}
 sel=null;render()});
// drag from palette onto the ladder
let dragK=null,ghost=null;
document.addEventListener("pointerdown",ev=>{const b=ev.target.closest("[data-add]");if(!b)return;dragK=b.dataset.add;ghost=null;b._sx=ev.clientX;b._sy=ev.clientY;dragK={k:b.dataset.add,sx:ev.clientX,sy:ev.clientY,moved:false}});
document.addEventListener("pointermove",ev=>{if(!dragK)return;if(!dragK.moved&&Math.hypot(ev.clientX-dragK.sx,ev.clientY-dragK.sy)>8){dragK.moved=true;placing=dragK.k;render();ghost=document.createElement("div");ghost.className="ghost";ghost.textContent=E[dragK.k].n;document.body.append(ghost)}
 if(ghost){ghost.style.left=ev.clientX+8+"px";ghost.style.top=ev.clientY+8+"px"}});
document.addEventListener("pointerup",ev=>{if(!dragK)return;const d=dragK;dragK=null;if(ghost){ghost.remove();ghost=null}
 if(d.moved){const t=document.elementFromPoint(ev.clientX,ev.clientY);const cell=t&&t.closest&&t.closest(".cell");if(cell){place(d.k,+cell.dataset.r,cell.dataset.w,+cell.dataset.i)}placing=null;renderPalette();render()}});
document.addEventListener("pointercancel",()=>{dragK=null;if(ghost){ghost.remove();ghost=null}});
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
 if(b.dataset.add){if(dragK&&dragK.moved)return;placing=placing===b.dataset.add?null:b.dataset.add;$("hint").textContent=placing?`Now tap a spot on a rung to place: ${E[placing].n}. Dashed boxes under a rung make a parallel branch.`:"";renderPalette();render();if(placing&&innerWidth<1000)$("wrapL").scrollIntoView({behavior:"smooth",block:"start"});return}
 if(b.dataset.sys){LTS.sys=b.dataset.sys;say(`Thermostat system: ${LTS.sys}.`);save();render();return}
 if(b.dataset.fan){LTS.fan=b.dataset.fan;say(`Thermostat fan: ${LTS.fan}${LTS.fan==="on"?" (R to G all the time)":" (G only with a call)"}.`);save();render();return}
 if(b.dataset.adj){const [k,d]=b.dataset.adj.split(":");LTS[k]=Math.round(LTS[k]+ +d);if(k==="hs")LTS.hs=Math.min(LTS.hs,LTS.cs-2);if(k==="cs")LTS.cs=Math.max(LTS.cs,LTS.hs+2);save();render();return}
 if(b.dataset.op){const f=findEl(sel);if(!f)return;const c=f.c,op=b.dataset.op,r=rungs[f.ri];
  if(op==="act"){const t=E[c.k];if(t.manual==="push"){c.st.down=true;c.st.t=0}else if(t.manual==="trip"){c.st.trip=!c.st.trip;say(`${t.n} ${c.st.trip?"tripped open":"reset"}.`)}else{c.st.on=!c.st.on}}
  if(op==="ol"){motorOL[c.tag]=!motorOL[c.tag];say(`${c.tag} overload ${motorOL[c.tag]?"tripped":"reset"}.`)}
  if(op==="flip"){c.k=c.k==="no"?"nc":"no"}
  if(op==="bl"&&r.branch.from>0)r.branch.from--;if(op==="br"&&r.branch.to<COLS-1)r.branch.to++;
  if(op==="bs"){const b2=r.branch;if(b2.to>b2.from){if(f.i>b2.from){b2.cells[b2.to]=null;b2.to--}else{b2.cells[b2.from]=null;b2.from++}}}
  if(op==="del"){snap();if(f.w==="m")r.cells[f.i]=null;else{r.branch.cells[f.i]=null;if(r.branch.cells.every(x=>!x))r.branch=null}sel=null}
  warned={};save();render();return}
 switch(b.id){
  case "addRung":snap();rungs.push(blank());save();render();break;
  case "delRung":if(rungs.length>1){snap();rungs.pop();save();render()}break;
  case "pwr":power=!power;if(power)shortRung=null;say(power?"Power on.":"Power off.");render();break;
  case "undo":if(hist.length){const s=JSON.parse(hist.pop());rungs=s.rungs;idn=s.idn;sel=null;save();render()}break;
  case "clearL":if(confirm("Clear the ladder?")){snap();rungs=[blank(),blank(),blank()];sel=null;coilOn={};timers={};save();render()}break;
  case "mOk":$("modal").hidden=true;break;
  case "theme":{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("ld-theme",r.dataset.theme)}catch(e){}break}
 }});
document.addEventListener("change",ev=>{const t=ev.target;if(t.id==="volt"){render();return}if(t.id==="ex"){if(t.value){snap();loadEx(t.value);t.value="";save();render()}return}
 const f=findEl(sel);if(!f||!t.dataset.op)return;const c=f.c;
 if(t.dataset.op==="tag")c.tag=t.value;if(t.dataset.op==="secs")c.secs=Math.max(1,Math.min(120,+t.value||5));if(t.dataset.op==="color")c.color=t.value;if(t.dataset.op==="term")c.tag=t.value;
 if(t.dataset.op==="name"){const old=c.tag,nw=t.value.trim().toUpperCase().replace(/\s+/g,"");if(nw){each(x=>{if(x.tag===old)x.tag=nw});c.tag=nw}}
 save();render()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){placing=null;sel=null;renderPalette();render()}});

/* ---------- examples ---------- */
function loadEx(n){idn=1;coilOn={};timers={};motorOL={};shortRung=null;power=true;warned={};
 const R=()=>blank();const put=(r,i,k,o={})=>{const e=mk(k);Object.assign(e,o);r.cells[i]=e;return e};
 const br=(r,from,to,items)=>{r.branch={from,to,cells:Array(COLS).fill(null)};items.forEach(([i,k,o])=>{const e=mk(k);Object.assign(e,o||{});r.branch.cells[i]=e})};
 if(n==="seal"){$("volt").value="120";const r1=R(),r2=R(),r3=R(),r4=R();rungs=[r1,r2,r3,r4];
  put(r1,5,"mcoil",{tag:"M1"});put(r2,5,"motor",{tag:"MTR1"});
  put(r1,0,"pbnc");put(r1,1,"pbno");put(r1,3,"ol",{tag:"MTR1"});br(r1,1,1,[[1,"no",{tag:"M1"}]]);
  put(r2,0,"no",{tag:"M1"});put(r3,0,"nc",{tag:"M1"});put(r3,5,"lamp",{color:"#ff4a3a"});put(r4,0,"no",{tag:"M1"});put(r4,5,"lamp",{color:"#3fdc6c"});
  say("Example: 3-wire start/stop with a seal-in (holding) contact. Tap START, then STOP. Trip the motor overload to see it drop out.")}
 if(n==="ac"){$("volt").value="24";rungs=[R(),R(),R(),R(),R()];const[a,b,c,d,e]=rungs;
  put(a,5,"mcoil",{tag:"M1"});put(b,5,"coil",{tag:"BR"});put(c,5,"motor",{tag:"COMP"});put(d,5,"motor",{tag:"OFAN"});put(e,5,"motor",{tag:"BLWR"});
  put(a,0,"ty");put(a,1,"hps");put(a,2,"lps");put(b,0,"tg");put(c,0,"no",{tag:"M1"});put(d,0,"no",{tag:"M1"});put(e,0,"no",{tag:"BR"});LTS.sys="cool";LTS.fan="auto";LTS.room=80;
  say("Example: air conditioner controls. Y through the HPS and LPS pulls in the contactor (M1); G runs the blower relay. Rungs 3 to 5 are drawn on the same ladder for clarity (in the field they're line voltage). Trip the HPS or change the thermostat.")}
 if(n==="td"){$("volt").value="24";rungs=[R(),R(),R()];const[a,b,c]=rungs;put(a,0,"sw");put(a,5,"td",{tag:"TD1",secs:5});put(b,0,"tdno",{tag:"TD1"});put(b,5,"lamp",{color:"#ffd84a"});put(c,0,"tdnc",{tag:"TD1"});put(c,5,"lamp",{color:"#e9ecee"});
  say("Example: on-delay timer. Turn the switch on; after 5 seconds the timer contacts change over.")}
 if(n==="tstat24"){$("volt").value="24";rungs=[R(),R(),R(),R(),R(),R(),R()];const[a,b,c,d,e,f,g]=rungs;
  put(a,0,"tsc");put(a,1,"tcc");put(a,2,"tterm",{tag:"Y"});put(a,5,"mcoil",{tag:"CC"});
  put(b,0,"tfo");put(b,3,"tterm",{tag:"G"});put(b,5,"coil",{tag:"BR"});br(b,0,2,[[0,"tfa"],[1,"tsc"],[2,"tcc"]]);
  put(c,0,"tsh");put(c,1,"thc");put(c,2,"tterm",{tag:"W"});put(c,5,"coil",{tag:"HR"});
  put(d,0,"no",{tag:"CC"});put(d,5,"motor",{tag:"COMP"});put(e,0,"no",{tag:"CC"});put(e,5,"motor",{tag:"OFAN"});
  put(f,0,"no",{tag:"BR"});put(f,5,"motor",{tag:"BLWR"});br(f,0,0,[[0,"no",{tag:"HR"}]]);put(g,0,"no",{tag:"HR"});put(g,5,"heat");
  LTS.sys="cool";LTS.fan="auto";LTS.room=77;LTS.hs=68;LTS.cs=74;LTS.callC=false;LTS.callH=false;
  say("Example: 24 V thermostat. The left rail is R, the right rail is C. Rung 1 is Y (compressor contactor CC). Rung 2 is G (blower relay BR). The fan switch is one selector with two positions (the dashed line ties them together): ON connects R straight to G, AUTO connects G only during a cooling call. Rung 3 is W (heat relay HR). Rungs 4 to 7 show what each one runs; with electric heat the HR contact also starts the blower (rung 6), so the strips never run without air. Change System, Fan and Room in the Thermostat panel and watch it cycle.")}
 if(n==="short"){$("volt").value="24";rungs=[R(),R()];const[a,b]=rungs;put(a,0,"sw");put(a,2,"hps");put(b,0,"sw");put(b,5,"lamp");
  say("Example of a mistake: rung 1 has no load. Turn its switch on and see what happens.")}
}

/* ---------- loop ---------- */
let last=performance.now(),acc=0,lastSig="";
function frame(now){const dt=Math.min(0.2,(now-last)/1000);last=now;acc+=dt;if(acc>=0.1){evaluate(acc);acc=0;const sig=JSON.stringify([coilOn,Object.values(timers).map(t=>t.done?1:Math.round(t.t*10)),[...energized],[...hotEdges],power,motorOL,Math.round(LTS.room),LTS.sys,LTS.fan,LTS.hs,LTS.cs,rungs.map(r=>[r.cells.map(c=>c&&c.st),r.branch&&r.branch.cells.map(c=>c&&c.st)])]);if(sig!==lastSig){lastSig=sig;render()}}requestAnimationFrame(frame)}
try{const t=localStorage.getItem("ld-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
let ok=false;try{const s=JSON.parse(localStorage.getItem("ld-board")||"null");if(s&&s.rungs&&s.rungs.length){rungs=s.rungs;idn=s.idn;if(s.lts)Object.assign(LTS,s.lts);else if(s.tstat){LTS.sys=s.tstat==="fan"?"off":s.tstat;LTS.fan=s.tstat==="fan"?"on":"auto";LTS.room=s.tstat==="heat"?64:s.tstat==="cool"?80:76}ok=true}}catch(e){}
if(!ok)loadEx("seal");
renderPalette();render();requestAnimationFrame(frame);
window.__cardFor=k=>{const h=partCardHTML(k);const m=h.match(/<svg[\s\S]*?<\/svg>/);return m?m[0]:""};
window.__ld={LTS,get rungs(){return rungs},evaluate,loadEx,get coilOn(){return coilOn},get energized(){return energized},findEl,setPower:v=>power=v,get power(){return power},motorOL};

/* ---------- disclaimer + feedback (FB-Enable) ---------- */
const FEEDBACK={form:"https://docs.google.com/forms/d/e/1FAIpQLScaqpadGdwDY_CanACDH3X_ZAQ44LzrCwDYcaxIuaxYk6A5UA/viewform",entry:"entry.249128714"};
const DISC_VER="1";let CM=null,cmState="off";
(async()=>{try{if(window.claude&&window.claude.use){CM=await window.claude.use("comments");if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}}}catch(e){CM=null}})();
async function refreshFb(){if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}const to=CM&&cmState==="available";$("fbTo").textContent=to?"Sends straight to Claude as a comment on this page.":"No sign-in needed.";$("fbSend").textContent=to?"Send to Claude":"Send"}
async function sendFb(){const msg=$("fbMsg").value.trim();if(!msg){$("fbStatus").textContent="Please write something first.";return}
 const text=`[${$("fbType").value}] ${msg}\n\nFrom: ${$("fbName").value.trim()||"anonymous"}\nContext: Ladder builder, ${rungs.length} rungs, ${navigator.userAgent}`;
 $("fbSend").disabled=true;$("fbStatus").textContent="Sending...";
 try{if(CM&&cmState==="available"){try{const anchor=await CM.anchorFor($("wrapL"));await CM.sendToClaude({anchor,text:text.slice(0,3900)});$("fbStatus").textContent="Sent to Claude.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1500);return}
   catch(e){if(e&&e.code==="consent_required"){$("fbStatus").textContent="Not sent: allow comments for this page when asked, then press Send again.";return}
    if(e&&!["claude_unavailable","capability_removed","forbidden"].includes(e.code)){$("fbStatus").textContent=`Couldn't send to Claude (${e.code||"error"}). Press Send again to use the form.`;cmState="off";return}cmState="off"}}
  const body=new URLSearchParams();body.append(FEEDBACK.entry,"[Ladder] "+text);await fetch(FEEDBACK.form.replace(/\/viewform.*$/,"/formResponse"),{method:"POST",mode:"no-cors",body});
  $("fbStatus").textContent="Thanks, it was sent.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1200)}
 catch(e){$("fbStatus").innerHTML=`Couldn't send from here. <a href="${FEEDBACK.form}" target="_blank" rel="noopener">Open the feedback form</a>.`}finally{$("fbSend").disabled=false}}
document.addEventListener("click",e=>{const id=e.target.id;
 if(id==="discOk"){$("disc").hidden=true;try{localStorage.setItem("ld-disc",DISC_VER)}catch(_){}}
 else if(id==="about")$("disc").hidden=false;
 else if(id==="feedback"){$("fbStatus").textContent="";refreshFb();$("fb").hidden=false;$("fbMsg").focus()}
 else if(id==="fbCancel")$("fb").hidden=true;else if(id==="fbSend")sendFb()});
{let seen=null;try{seen=localStorage.getItem("ld-disc")}catch(_){}if(seen!==DISC_VER)$("disc").hidden=false}
})();
