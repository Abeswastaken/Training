(()=>{
const $=id=>document.getElementById(id);
const P3=!!window.LD3;// 3-Phase Motor Control page
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
/* Each rung has 8 slots by default; "+" adds slots up to 14. Up to 2 parallel branches per rung. */
const DEFN=8,MAXN=14,MAXBR=2,CW=120,X0=50,Y0=50,TOP=64,BRH=58,SEC_GAP=150;
/* element types: contacts and switches pass power; loads use it. al = extra search words. */
const E={
 no:{n:"NO contact",cat:"Contacts",load:0,tagKind:"coil",al:"relay contactor aux auxiliary normally open",info:"Normally open contact. Closes when its coil (or overload, or timer) is energized."},
 nc:{n:"NC contact",cat:"Contacts",load:0,tagKind:"coil",al:"relay normally closed",info:"Normally closed contact. Opens when its coil is energized."},
 tdno:{n:"Timer contact NO (on-delay)",cat:"Contacts",load:0,tagKind:"timer",al:"td tdc delay",info:"Closes after its timer coil has been energized for the set time."},
 tdnc:{n:"Timer contact NC (on-delay)",cat:"Contacts",load:0,tagKind:"timer",al:"td tdo delay",info:"Opens after its timer coil has been energized for the set time."},
 pbno:{n:"Pushbutton NO (start)",cat:"Switches & controls",load:0,manual:"push",al:"start button momentary",info:"Momentary. Closes while pressed. Tap it to press."},
 pbnc:{n:"Pushbutton NC (stop)",cat:"Switches & controls",load:0,manual:"push",al:"stop button momentary",info:"Momentary. Opens while pressed. Tap it to press."},
 sw:{n:"Toggle switch",cat:"Switches & controls",load:0,manual:"toggle",al:"selector maintained on off",info:"Maintained on/off switch. Tap to flip."},
 sel:{n:"Selector switch (RUN / JOG)",cat:"Switches & controls",load:0,manual:"toggle",al:"selector run jog hand off auto",info:"Two-position selector. RUN: its contact is closed. JOG: it's open. Put it in series with a seal-in contact so JOG breaks the seal and START only runs the motor while held."},
 tsw:{n:"Temperature switch (NO, closes on rise)",cat:"Switches & controls",load:0,manual:"toggle",al:"snap disc fan control temp",info:"Snap disc that closes on temperature rise (like a fan control). Tap to change."},
 hps:{n:"High pressure switch (NC)",cat:"Safeties",load:0,manual:"trip",al:"hp hpc head pressure control",info:"Closed normally, opens on high head pressure. Tap to simulate a trip."},
 lps:{n:"Low pressure switch (NC)",cat:"Safeties",load:0,manual:"trip",al:"lp lpc suction loss of charge control",info:"Closed while suction pressure is normal, opens on loss of charge. Tap to simulate."},
 lim:{n:"High limit (NC)",cat:"Safeties",load:0,manual:"trip",al:"limit snap disc overheat",info:"Furnace high limit. Opens on overheating. Tap to simulate."},
 rollout:{n:"Flame rollout switch (NC, manual reset)",cat:"Safeties",load:0,manual:"trip",al:"rollout limit manual reset fs",info:"Opens if flame rolls out of the burner area. Manual reset: it stays open until someone presses its button."},
 lwco:{n:"Low water cutoff (NC)",cat:"Safeties",load:0,manual:"trip",al:"lwco low water cut off probe float boiler",info:"Boiler safety. Opens if the water level drops below the probe or float, so the burner can't fire a dry boiler. Tap to simulate low water."},
 aps:{n:"Pressure switch (NO, proves the inducer)",cat:"Safeties",load:0,tagKind:"motor",al:"pressure switch draft inducer vent proving ps",info:"Closes only when its inducer (draft) motor is running and pulling enough draft. It proves venting before the furnace may ignite."},
 ol:{n:"Overload contact (NC)",cat:"Safeties",load:0,tagKind:"motor",al:"overload ol 95 96 heater",info:"Normally closed. Opens when its motor's overload trips. Wire it in series with that motor's starter coil."},
 ty:{n:"Thermostat Y (cool)",cat:"Thermostat",load:0,al:"y cooling call stat",info:"Closes when the thermostat calls for cooling."},
 tw:{n:"Thermostat W (heat)",cat:"Thermostat",load:0,al:"w heating call stat",info:"Closes when the thermostat calls for heat."},
 tg:{n:"Thermostat G (fan)",cat:"Thermostat",load:0,al:"g fan stat",info:"Closes for cooling or fan-on."},
 ty2:{n:"Thermostat Y2 (2nd stage cool)",cat:"Thermostat",load:0,al:"y2 second stage high stage two-stage cool",info:"Closes when the room is 3°F or more above the cool setpoint (second stage). Y1 is already closed by then."},
 tw2:{n:"Thermostat W2 (2nd stage / aux heat)",cat:"Thermostat",load:0,al:"w2 aux auxiliary second stage strips two-stage heat",info:"Closes when the room is 3°F or more below the heat setpoint. On a heat pump this is AUX heat (the strips)."},
 tyhp:{n:"Thermostat Y (heat pump: heat or cool)",cat:"Thermostat",load:0,al:"y heat pump compressor",info:"On a heat pump thermostat, Y runs the compressor for both heating and cooling."},
 to:{n:"Thermostat O (energized in cool)",cat:"Thermostat",load:0,al:"o reversing valve rv cool changeover",info:"Powers the reversing valve in cooling. Most brands (Carrier, Trane, Goodman, Lennox) use O: the unit heats if the valve coil loses power."},
 tb:{n:"Thermostat B (energized in heat)",cat:"Thermostat",load:0,al:"b reversing valve rv heat changeover rheem ruud",info:"Powers the reversing valve in heating (Rheem/Ruud and some older units). The unit cools if the valve coil loses power."},
 tsc:{n:"System switch: COOL",cat:"Thermostat",load:0,al:"system cool",info:"Inside the thermostat. Closed when the system is set to Cool (or Auto)."},
 tsh:{n:"System switch: HEAT",cat:"Thermostat",load:0,al:"system heat",info:"Inside the thermostat. Closed when the system is set to Heat (or Auto)."},
 tcc:{n:"Cooling call (closes on rise)",cat:"Thermostat",load:0,al:"cool call",info:"Closes when the room rises above the cool setpoint."},
 thc:{n:"Heating call (closes on fall)",cat:"Thermostat",load:0,al:"heat call",info:"Closes when the room falls below the heat setpoint."},
 tfo:{n:"Fan switch: ON",cat:"Thermostat",load:0,al:"fan on",info:"Closed when the fan is set to On: R goes straight to G."},
 tfa:{n:"Fan switch: AUTO",cat:"Thermostat",load:0,al:"fan auto",info:"Closed when the fan is set to Auto. In series with the cooling call, it runs the fan only during a call."},
 aq:{n:"Aquastat high limit (opens at 180°F)",cat:"Switches & controls",load:0,al:"aquastat limit boiler water temperature l8148 hi limit",info:"Boiler water temperature limit. Opens when the water reaches 180°F and closes again at 165°F (15° differential). It follows the boiler water temperature shown under the thermostat."},
 bts:{n:"Box thermostat (closes on rise)",cat:"Switches & controls",load:0,al:"box thermostat walk-in cooler temperature control",info:"Walk-in box thermostat. Closes at 38°F (cut-in) and opens at 34°F (cut-out). It follows the box temperature shown under the thermostat."},
 lpc:{n:"Low pressure control (pump-down)",cat:"Switches & controls",load:0,al:"low pressure control lpc pump down penn ranco cut in cut out",info:"Pump-down control on the suction line. Closes when suction rises to 35 psig (cut-in) and opens at 15 psig (cut-out). It starts and stops the compressor in a pump-down system."},
 dtr:{n:"Defrost timer: cooling contact (N.C. in defrost: opens)",cat:"Switches & controls",load:0,manual:"defrost",al:"defrost timer paragon grasslin precision clock cool",info:"Time clock contact that is closed during refrigeration and opens during defrost. In this example the clock runs 4 defrosts a day, sped up: about 90 s between defrosts and 20 s of defrost. Tap to push the clock into defrost now."},
 dtd:{n:"Defrost timer: defrost contact (closes in defrost)",cat:"Switches & controls",load:0,manual:"defrost",al:"defrost timer heater paragon grasslin",info:"Time clock contact that closes during defrost, usually to power defrost heaters. Tap to push the clock into defrost now."},
 tterm:{n:"Terminal (R, Y, G, W...)",cat:"Thermostat",load:0,al:"terminal r c y g w o b",info:"A labeled wiring terminal. It passes power straight through and shows where a wire leaves the thermostat or a board."},
 coil:{n:"Relay coil (CR)",cat:"Loads",load:1,coil:"CR",al:"relay cr control relay fan relay",info:"Control relay coil. Energized, it flips every contact tagged with its name."},
 mcoil:{n:"Contactor / starter coil (M)",cat:"Loads",load:1,coil:"M",al:"contactor starter cc coil",info:"Motor starter or contactor coil. Its contacts carry the motor's power."},
 td:{n:"Timer coil (TD, on-delay)",cat:"Loads",load:1,coil:"TD",al:"timer delay td",info:"On-delay timer. After it stays energized for its set time, its timer contacts change."},
 motor:{n:"Motor",cat:"Loads",load:1,motor:1,al:"motor compressor fan blower comp",info:"A motor load. Tap to trip its overload (opens its OL contact)."},
 lamp:{n:"Pilot light",cat:"Loads",load:1,al:"light lamp indicator pilot",info:"Indicator lamp."},
 sol:{n:"Solenoid valve",cat:"Loads",load:1,al:"solenoid valve lls gas valve",info:"Valve coil, for example a liquid line solenoid."},
 heat:{n:"Heater",cat:"Loads",load:1,al:"heater heat strip element resistance",info:"Resistance heater."},
 buzz:{n:"Alarm buzzer",cat:"Loads",load:1,al:"alarm buzzer horn",info:"Alarm."},
 xfmr:{n:"Control transformer",cat:"Power",load:1,al:"transformer xfmr 24v 24 v step down",info:"Steps line voltage down to 24 V. Place it on a line-voltage rung: its primary is a load there, and a second ladder (R and C, 24 V) appears below, powered from its secondary. A coil on the 24 V side switches the contacts with the same name on the line side."},
 fuse:{n:"Fuse",cat:"Power",load:0,al:"fuse protection 3a",info:"Passes power until too much current flows. A dead short on its rung blows it instead of arcing."}
};
const CATS=["Loads","Safeties","Switches & controls","Contacts","Thermostat","Power"];
const LTS={sys:"off",fan:"auto",room:76,hs:68,cs:74,callC:false,callH:false,call2C:false,call2H:false};
let rungs=[],power=true,placing=null,moving=null,sel=null,hist=[],idn=1,shortRung=null;
const blankCells=()=>Array(MAXN).fill(null);
const blank=sec=>{const r={n:DEFN,cells:blankCells(),br:[]};if(sec)r.sec=sec;return r};
function mk(k){const e={id:"e"+(idn++),k,st:{}};const t=E[k];
 if(t.coil){const n=allTags(t.coil).length+1;e.tag=t.coil+n}
 if(t.motor){e.tag="MTR"+(allTags("MTR").length+1)}
 if(k==="td")e.secs=5;
 if(t.tagKind){const c=tagsFor(t.tagKind);e.tag=c[0]||""}
 if(k==="lamp")e.color="#3fdc6c";
 if(k==="tterm")e.tag="Y";
 if(k==="xfmr")e.tag="T1";
 if(k==="sel")e.st.on=true;
 return e}
function each(f){rungs.forEach((r,ri)=>{r.cells.forEach((c,ci)=>c&&f(c,ri,"m",ci));r.br.forEach((b,bi)=>b.cells.forEach((c,ci)=>c&&f(c,ri,"b"+bi,ci)))})}
function allTags(prefix){const s=[];each(c=>{if(c.tag&&c.tag.startsWith(prefix)&&(E[c.k].coil||E[c.k].motor))s.push(c.tag)});return [...new Set(s)]}
function tagsFor(kind){if(P3&&kind==="motor")return CIRC[P3S.circ].motors>1?["MTR1","MTR2"]:["MTR1"];const s=new Set();each(c=>{const t=E[c.k];if(kind==="coil"&&t.coil&&t.coil!=="TD")s.add(c.tag);if(kind==="timer"&&c.k==="td")s.add(c.tag);if(kind==="motor"&&t.motor)s.add(c.tag)});return [...s]}
function snap(){hist.push(JSON.stringify({rungs,idn}));if(hist.length>60)hist.shift()}
function save(){if(svc)return;try{localStorage.setItem(P3?"ld3-board":"ld-board",JSON.stringify({v:2,rungs,idn,lts:{sys:LTS.sys,fan:LTS.fan,room:LTS.room,hs:LTS.hs,cs:LTS.cs},p3:P3?{circ:P3S.circ,sup:P3S.sup,volt:$("volt").value}:undefined}))}catch(e){}}
/* old boards (6 slots, one "branch") still load */
function migrate(rs){return rs.map(r=>{if(r.br&&r.n)return r;const n=Math.max(DEFN,(r.cells||[]).length);const cells=blankCells();(r.cells||[]).forEach((c,i)=>cells[i]=c);
 const br=[];if(r.branch){const b=blankCells();r.branch.cells.forEach((c,i)=>b[i]=c);br.push({from:r.branch.from,to:r.branch.to,cells:b})}const o={n,cells,br};if(r.sec)o.sec=r.sec;return o})}
const xfmrEl=()=>{let x=null;each(c=>{if(c.k==="xfmr"&&!x)x=c});return x};
const hasX=()=>!!xfmrEl();
const secOf=r=>hasX()&&r.sec==="lo"?"lo":"hi";
function sortRungs(){rungs.sort((a,b)=>(a.sec==="lo")-(b.sec==="lo"))}
const lineV=()=>P3?+$("volt").value:hasX()?120:+$("volt").value;
const secV=s=>s==="lo"?24:lineV();

/* ---------- evaluation ---------- */
let coilOn={},timers={},motorOL={},energized=new Set(),hotEdges=new Set(),loLive=false;
function closed(c,ignoreFault){if(!ignoreFault&&c.f)return false;const k=c.k,s=c.st;
 switch(k){case "no":return !!coilOn[c.tag];case "nc":return !coilOn[c.tag];
  case "tdno":return !!(timers[c.tag]&&timers[c.tag].done);case "tdnc":return !(timers[c.tag]&&timers[c.tag].done);
  case "ol":return !motorOL[c.tag];
  case "pbno":return !!s.down;case "pbnc":return !s.down;case "sw":case "tsw":case "sel":return !!s.on;
  case "ty":return tY();case "tw":return tW();case "tg":return LTS.fan==="on"||tY();
  case "tsc":return sysC();case "tsh":return sysH();case "tcc":return LTS.callC;case "thc":return LTS.callH;case "tfo":return LTS.fan==="on";case "tfa":return LTS.fan==="auto";case "tterm":return true;
  case "ty2":return sysC()&&LTS.call2C;case "tw2":return sysH()&&LTS.call2H;case "tyhp":return tY()||tW();case "to":return modeC();case "tb":return modeH();
  case "aps":return runMtr(c.tag);case "aq":return SIM.aq;case "bts":return SIM.bts;case "lpc":return SIM.lpc;case "dtr":return !(SIM.def>0);case "dtd":return SIM.def>0;
  case "hps":case "lps":case "lim":case "rollout":case "lwco":return !s.trip;
  case "fuse":return !s.blown}
 return true}
const sysC=()=>LTS.sys==="cool"||LTS.sys==="auto",sysH=()=>LTS.sys==="heat"||LTS.sys==="auto",tY=()=>sysC()&&LTS.callC,tW=()=>sysH()&&LTS.callH;
const modeC=()=>LTS.sys==="cool"||(LTS.sys==="auto"&&LTS.callC),modeH=()=>LTS.sys==="heat"||(LTS.sys==="auto"&&LTS.callH&&!LTS.callC);
const runMtr=tag=>{let r=false;each(c=>{if(c.k==="motor"&&c.tag===tag&&energized.has(c.id)&&!motorOL[tag])r=true});return r};
const TSK=["ty","tw","tg","tsc","tsh","tcc","thc","tfo","tfa","ty2","tw2","tyhp","to","tb"];
/* plant model for the boiler and walk-in examples (sped-up time) */
const SIM={wt:150,aq:true,box:36,bts:false,suct:20,lpc:false,def:0,clock:0};
function updCalls(){const c=LTS.callC,h=LTS.callH;if(LTS.room>=LTS.cs+1)LTS.callC=true;else if(LTS.room<=LTS.cs-1)LTS.callC=false;if(LTS.room<=LTS.hs-1)LTS.callH=true;else if(LTS.room>=LTS.hs+1)LTS.callH=false;
 const c2=LTS.call2C,h2=LTS.call2H;if(LTS.room>=LTS.cs+3)LTS.call2C=true;else if(LTS.room<=LTS.cs+1)LTS.call2C=false;if(LTS.room<=LTS.hs-3)LTS.call2H=true;else if(LTS.room>=LTS.hs-1)LTS.call2H=false;
 let st2=false;each(x=>{if(x.k==="ty2"||x.k==="tw2")st2=true});
 if(st2&&c2!==LTS.call2C&&sysC())say(LTS.call2C?`Room ${Math.round(LTS.room)}°F: second stage cooling (R to Y2).`:`Second stage cooling off.`);
 if(st2&&h2!==LTS.call2H&&sysH())say(LTS.call2H?`Room ${Math.round(LTS.room)}°F: second stage heat (R to W2).`:`Second stage heat off.`);
 if(c!==LTS.callC&&sysC())say(LTS.callC?`Room ${Math.round(LTS.room)}°F: cooling call (R to Y).`:`Room ${Math.round(LTS.room)}°F: cooling satisfied.`);
 if(h!==LTS.callH&&sysH())say(LTS.callH?`Room ${Math.round(LTS.room)}°F: heating call (R to W).`:`Room ${Math.round(LTS.room)}°F: heating satisfied.`)}
function drift(dt){simTick(dt);let has=false,cool=0,heat=0,rv=null,hasB=false,blwr=false,gv=false,circ=false,y2=false,comp=0;
 each(c=>{if(TSK.includes(c.k))has=true;if(c.k==="tb")hasB=true;if(c.k==="sol"&&c.tag==="RV")rv=c;const on=energized.has(c.id);if(!on)return;
  if(c.k==="motor"&&!motorOL[c.tag]){if(/COMP/.test(c.tag))comp++;if(/BLWR/.test(c.tag))blwr=true;if(/CIRC/.test(c.tag))circ=true}
  if(c.k==="heat"&&!/HSI|DEF/.test(c.tag||""))heat++;if(c.k==="sol"&&c.tag==="GV")gv=true;if(c.k==="sol"&&c.tag==="Y2")y2=true});
 if(!has)return;
 if(comp){const hpHeat=rv?(hasB?energized.has(rv.id):!energized.has(rv.id)):false;const n=comp+(y2?0.6:0);if(hpHeat)heat+=n;else cool+=n}
 if(gv&&blwr)heat+=1.5;if(circ&&SIM.wt>130)heat+=1.2;
 const out=LTS.sys==="heat"?55:LTS.sys==="off"?LTS.room:88,d=out-LTS.room;const rate=cool||heat?(heat-cool)*0.35:Math.sign(d)*Math.min(Math.abs(d),0.08);
 LTS.room+=rate*dt;LTS.room=Math.max(50,Math.min(95,LTS.room));}
function simTick(dt){let gv=false,circ=false,comp=false,lls=false,efan=false,defh=false,any=false;
 each(c=>{if(["aq","bts","lpc","dtr","dtd"].includes(c.k))any=true;const on=energized.has(c.id);if(!on)return;
  if(c.k==="sol"&&c.tag==="GV")gv=true;if(c.k==="sol"&&c.tag==="LLS")lls=true;if(c.k==="heat"&&/DEF/.test(c.tag||""))defh=true;
  if(c.k==="motor"&&!motorOL[c.tag]){if(/CIRC/.test(c.tag))circ=true;if(/COMP/.test(c.tag))comp=true;if(/EFAN/.test(c.tag))efan=true}});
 if(!any)return;
 // boiler water: burner adds heat, the circulator carries it to the house
 SIM.wt+=((gv?3:0)-(circ&&SIM.wt>LTS.room?1.2:0)-(SIM.wt>70?0.1:0))*dt;SIM.wt=Math.max(60,Math.min(250,SIM.wt));
 if(SIM.wt>=180&&SIM.aq){SIM.aq=false;say("Boiler water reached 180°F: the aquastat high limit opens and the burner stops.")}else if(SIM.wt<=165&&!SIM.aq){SIM.aq=true;say("Boiler water down to 165°F: the aquastat closes again.")}
 // defrost clock: 4 a day, sped up
 if(power){if(SIM.def>0){SIM.def-=dt;if(SIM.def<=0){SIM.def=0;SIM.clock=0;say("Defrost timer: defrost over (time termination). Back to cooling.")}}else{SIM.clock+=dt;if(SIM.clock>=90)startDefrost()}}
 // walk-in box and suction pressure
 const cooling=comp&&lls&&efan&&!(SIM.def>0);
 SIM.box+=(cooling?-0.25:defh?0.3:0.08)*dt;SIM.box=Math.max(28,Math.min(60,SIM.box));
 if(SIM.box>=38&&!SIM.bts){SIM.bts=true;say("Box at 38°F: the box thermostat closes (cut-in).")}else if(SIM.box<=34&&SIM.bts){SIM.bts=false;say("Box at 34°F: the box thermostat opens (cut-out).")}
 const tgt=comp?(lls?45:0):(lls?70:18),k=comp&&!lls?5:lls?6:0.6;SIM.suct+=Math.sign(tgt-SIM.suct)*Math.min(Math.abs(tgt-SIM.suct),k*dt);
 if(SIM.suct>=35&&!SIM.lpc){SIM.lpc=true;say(`Suction up to ${Math.round(SIM.suct)} psig: the low pressure control closes (cut-in).`)}else if(SIM.suct<=15&&SIM.lpc){SIM.lpc=false;say(`Suction down to ${Math.round(SIM.suct)} psig: the low pressure control opens (cut-out). Pumped down.`)}}
function startDefrost(){SIM.def=20;SIM.clock=0;say("Defrost timer: defrost starts. The cooling contact opens (solenoid closes, unit pumps down) and the defrost contact powers the heaters.")}
/* Build a rung's graph. Main nodes are 0..n (0 = left rail, n = right rail). Branch k gets its own inner nodes. */
function rungEdges(r){const n=r.n,edges=[];let next=n+1;
 for(let i=0;i<n;i++)edges.push({a:i,b:i+1,c:r.cells[i],where:"m",i});
 r.br.forEach((b,bi)=>{const base=next;next+=n+1;const bn=i=>i===b.from?b.from:i===b.to+1?b.to+1:base+i;
  for(let i=b.from;i<=b.to;i++)edges.push({a:bn(i),b:bn(i+1),c:b.cells[i],where:"b"+bi,i})});
 return {edges,N:next,L:0,R:n}}
const conducts=(c,ign)=>!c||(!E[c.k].load&&closed(c,ign));
function uf(N){const p=[];for(let i=0;i<N;i++)p[i]=i;const find=x=>{while(p[x]!==x){p[x]=p[p[x]];x=p[x]}return x};return {find,uni:(a,b)=>{a=find(a);b=find(b);if(a!==b)p[a]=b}}}
function solveRung(r){
 if(r.cells.every(c=>!c)&&!r.br.length)return {live:[],series:false,hot:new Set(),empty:true};
 const {edges,N,L,R}=rungEdges(r);const {find,uni}=uf(N);
 edges.forEach(e=>{if(conducts(e.c))uni(e.a,e.b)});
 if(find(L)===find(R))return {short:true,edges};
 const live=[];
 edges.forEach(e=>{if(e.c&&E[e.c.k].load&&!e.c.f){const ok=(find(e.a)===find(L)&&find(e.b)===find(R))||(find(e.b)===find(L)&&find(e.a)===find(R));if(ok)live.push(e)}});
 const loads=edges.filter(e=>e.c&&E[e.c.k].load);
 const series=loads.length>1&&loads.some(e=>(find(e.a)===find(L)||find(e.b)===find(L))&&!live.includes(e)&&!e.c.f);
 const hot=new Set();edges.forEach(e=>{const lf=find(e.a)===find(L)||find(e.b)===find(L);if(lf&&conducts(e.c))hot.add(e.where+":"+e.i);if(live.includes(e))hot.add(e.where+":"+e.i)});
 edges.forEach(e=>{const rt=find(e.a)===find(R)||find(e.b)===find(R);if(rt&&conducts(e.c)&&live.length)hot.add(e.where+":"+e.i)});
 return {live,series,hot}}
let lastShortLog=-1;
function evaluate(dt){updCalls();
 for(let it=0;it<12;it++){
  const nextCoil={};energized=new Set();hotEdges=new Set();let sr=null,seriesR=[];
  const X=xfmrEl();
  // line side first; the 24 V side is live only if the transformer primary is energized
  const pass=(sec,on)=>{if(!on)return;rungs.forEach((r,ri)=>{if(sr!=null||secOf(r)!==sec)return;const s=solveRung(r);if(s.short){sr={ri,sec,s};return}if(s.series)seriesR.push(ri);
   s.live.forEach(e=>{energized.add(e.c.id);const t=E[e.c.k];if(t.coil)nextCoil[e.c.tag]=true});s.hot.forEach(h=>hotEdges.add(ri+":"+h))})};
  pass("hi",power&&(!P3||p3CtlLive()));
  loLive=!!(X&&power&&energized.has(X.id)&&!X.st.fuse&&!X.f);
  if(sr==null)pass("lo",loLive);
  if(sr!=null){handleShort(sr);return}
  seriesR.forEach(ri=>{if(!warned[ri]){warned[ri]=1;say(`Rung ${ri+1}: two loads in series. Each gets only part of the voltage, so neither works. Put loads in parallel (on a branch) instead.`,"w")}});
  const same=Object.keys(nextCoil).length===Object.keys(coilOn).filter(k=>coilOn[k]).length&&Object.keys(nextCoil).every(k=>coilOn[k]);
  Object.keys(timers).forEach(k=>{if(!nextCoil[k])delete timers[k]});
  Object.keys(nextCoil).filter(k=>k.startsWith("TD")).forEach(k=>{if(!timers[k])timers[k]={t:0,done:false}});
  Object.keys(nextCoil).forEach(k=>{if(nextCoil[k]&&!coilOn[k])say(`${k} energized.`)});Object.keys(coilOn).forEach(k=>{if(coilOn[k]&&!nextCoil[k])say(`${k} de-energized.`)});
  coilOn=nextCoil;if(same)break}
 each(c=>{if(c.k==="td"&&timers[c.tag]&&!timers[c.tag].done){timers[c.tag].t+=dt;if(timers[c.tag].t>=c.secs){timers[c.tag].done=true;say(`${c.tag} timed out after ${c.secs} s. Its contacts change.`)}}});
 each(c=>{if((c.k==="pbno"||c.k==="pbnc")&&c.st.down){c.st.t=(c.st.t||0)+dt;if(c.st.t>0.8){c.st.down=false;c.st.t=0}}});
 drift(dt);
}
/* A dead short: a fuse on that rung blows; on the 24 V side the transformer fuse blows; otherwise it's an arc flash. */
function handleShort({ri,sec,s}){const r=rungs[ri];
 const fz=s.edges.find(e=>e.c&&e.c.k==="fuse"&&closed(e.c));
 if(fz){fz.c.st.blown=true;say(`Rung ${ri+1} shorted. Its fuse blew and cut the rung off. Fix the short, then tap the fuse to replace it.`,"b");shortRung=ri;flashModal("Fuse blown",`<p>Rung ${ri+1} connects the two rails with no load in the path. The fuse on that rung blew before anything else was damaged.</p><p>Find the short (outlined in red), then tap the fuse and replace it.</p>`);return}
 if(sec==="lo"){const X=xfmrEl();X.st.fuse=true;shortRung=ri;say(`24 V short on rung ${ri+1}: R straight to C. The transformer's fuse blew and the whole 24 V side went dead.`,"b");
  flashModal("24 V short: fuse blown",`<p>Rung ${ri+1} connects R straight to C with no load. The control transformer's fuse (often 3 A on the board or the R lead) blew, so the whole 24 V side is dead.</p><p>Fix the short, then tap the transformer and replace its fuse.</p>`);return}
 if(P3){p3Short(ri);return}
 power=false;shortRung=ri;arc(ri)}
function flashModal(t,b){render();const w=$("wrapL");w.classList.remove("shake");void w.offsetWidth;w.classList.add("shake");$("mT").textContent=t;$("mB").innerHTML=b;$("modal").hidden=false}
let warned={};

/* ---------- multimeter ---------- */
const meter={on:false,mode:"v",red:null,black:null,next:"red",ri:{}};
/* A test lead drawn tip-down at 0,0: needle point, finger guard, ribbed handle, strain relief. */
function probeShape(lead){const c=lead==="red"?["#f0564a","#c9261c","#7a1410"]:["#566067","#1d2327","#000"];
 return `<path d="M0 0 L-1.7 -9 V-20 H1.7 V-9 Z" fill="#cdd3d7" stroke="#59626a" stroke-width=".6"/><rect x="-3.2" y="-27" width="6.4" height="8" rx="1" fill="${c[2]}"/>`
 +`<rect x="-7" y="-31" width="14" height="5" rx="2.2" fill="${c[1]}" stroke="${c[2]}" stroke-width=".6"/><path d="M-5 -31 L-5.8 -74 Q-5.8 -79 0 -79 Q5.8 -79 5.8 -74 L5 -31 Z" fill="${c[1]}" stroke="${c[2]}" stroke-width=".6"/>`
 +`<path d="M-3 -34 L-3.6 -73" stroke="${c[0]}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`+[42,47,52,57].map(y=>`<path d="M-5.3 ${-y} H5.3" stroke="${c[2]}" stroke-width=".9" opacity=".7"/>`).join("")
 +`<rect x="-2.6" y="-88" width="5.2" height="10" rx="2" fill="${c[2]}"/>`}
const probeAng=(lead,flip)=>(lead==="red"?28:-28)*(flip?-1:1)+(flip?180:0);
/* a lead sitting on a probe point inside a drawing; the handle is the drag target */
function probeG(x,y,lead,flip,k=1){const c=lead==="red"?"#c9261c":"#1d2327",d=lead==="red"?1:-1;if(pd&&pd.moved&&pd.lead===lead)return "";
 return `<g class="probe" data-lead="${lead}" transform="translate(${x} ${y}) rotate(${probeAng(lead,flip)}) scale(${k})"><title>${lead==="red"?"Red":"Black (COM)"} lead: drag to move it</title><path d="M0 -86 q${d*10} -22 ${d*34} -20 t${d*30} 14" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round"/>${probeShape(lead)}<circle r="4" fill="none" stroke="${c}" stroke-width="1.4"/><rect x="-10" y="-92" width="20" height="66" fill="transparent"/></g>`}
/* pts: key -> [[x,y,rung]...]; a rail has a dot on every rung, so the lead stays on the rung it was put on */
const probesFor=(pts,flipY=96,k=1)=>["black","red"].map(l=>{const a=meter[l]&&pts[meter[l]];if(!a)return "";const q=a.find(v=>v[2]===meter.ri[l])||a[0];return probeG(q[0],q[1],l,q[1]<flipY,k)}).join("");
/* resistance of a load, scaled for the voltage it is rated for */
function loadOhms(c,sec){const v=secV(sec),k=c.k;const at120={coil:450,mcoil:110,td:900,lamp:150,sol:120,heat:9.6,buzz:600,motor:3.5,xfmr:20}[k]||100;
 if(k==="motor"||k==="heat"||k==="xfmr")return at120;return at120*(v/120)*(v/120)}
/* probe points: "ri:node" inside a rung; rails are "hi:L","hi:R","lo:L","lo:R" */
function ptKey(ri,node){const r=rungs[ri],s=secOf(r);if(node===0)return s+":L";if(node===r.n)return s+":R";return ri+":"+node}
function ptSec(p){const a=p.split(":")[0];if(a==="p")return "p";return a==="hi"||a==="lo"?a:secOf(rungs[+a])}
function potentials(sec){/* volts at each probe point in a section, or null if floating */
 const out={};const live=sec==="lo"?loLive:power;const V=secV(sec);out[sec+":L"]=live?V:0;out[sec+":R"]=0;if(!live)return out;
 rungs.forEach((r,ri)=>{if(secOf(r)!==sec)return;const {edges,N,L,R}=rungEdges(r);const {find,uni}=uf(N);edges.forEach(e=>{if(conducts(e.c))uni(e.a,e.b)});
  const gL=find(L),gR=find(R);const adj={};edges.forEach(e=>{if(e.c&&E[e.c.k].load&&!e.c.f){const a=find(e.a),b=find(e.b);if(a!==b){(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a)}}});
  const reach=(g,goal,avoid)=>{const seen=new Set([g]),q=[g];while(q.length){const x=q.shift();if(x===goal)return true;(adj[x]||[]).forEach(y=>{if(!seen.has(y)&&y!==avoid){seen.add(y);q.push(y)}})}return false};
  for(let nd=1;nd<N;nd++){if(nd===R)continue;const g=find(nd);let p;if(g===gL)p=V;else if(g===gR)p=0;else{const a=reach(g,gL,gR),b=reach(g,gR,gL);p=a&&b?V/2:a?V:b?0:null}
   const key=nd<=r.n?ptKey(ri,nd):ri+":"+nd;out[key]=p}});
 return out}
function resistance(pa,pb){/* ohms between two points in one section with power off; Infinity = open */
 const sec=ptSec(pa);const idx={},names=[];const id=k=>{if(!(k in idx)){idx[k]=names.length;names.push(k)}return idx[k]};
 id(sec+":L");id(sec+":R");const res=[];
 rungs.forEach((r,ri)=>{if(secOf(r)!==sec)return;const {edges}=rungEdges(r);const nm=nd=>nd===0?sec+":L":nd===r.n?sec+":R":ri+":"+nd;
  edges.forEach(e=>{const a=id(nm(e.a)),b=id(nm(e.b));if(!e.c||(!E[e.c.k].load&&closed(e.c)))res.push([a,b,0]);else if(E[e.c.k].load&&!e.c.f)res.push([a,b,loadOhms(e.c,sec)])})});
 const X=xfmrEl();if(sec==="lo"&&X&&!X.f&&!X.st.fuse)res.push([idx["lo:L"],idx["lo:R"],0.8]);
 const A=idx[pa],B=idx[pb];if(A==null||B==null)return Infinity;if(A===B)return 0;
 const {find,uni}=uf(names.length);res.forEach(([a,b,o])=>{if(o===0)uni(a,b)});if(find(A)===find(B))return 0;
 const g=[...new Set(names.map((_,i)=>find(i)))];const gi={};g.forEach((x,i)=>gi[x]=i);
 // only the part of the network connected to A
 const adj=g.map(()=>[]);res.forEach(([a,b,o])=>{if(o>0){const x=gi[find(a)],y=gi[find(b)];if(x!==y){adj[x].push([y,o]);adj[y].push([x,o])}}});
 const a0=gi[find(A)],b0=gi[find(B)];const seen=new Set([a0]),q=[a0];while(q.length){const x=q.shift();adj[x].forEach(([y])=>{if(!seen.has(y)){seen.add(y);q.push(y)}})}
 if(!seen.has(b0))return Infinity;
 const nodes=[...seen].filter(x=>x!==b0),m=nodes.length,pos={};nodes.forEach((x,i)=>pos[x]=i);
 const M=Array.from({length:m},()=>Array(m+1).fill(0));
 nodes.forEach(x=>adj[x].forEach(([y,o])=>{const i=pos[x];M[i][i]+=1/o;if(y!==b0&&pos[y]!=null)M[i][pos[y]]-=1/o}));
 M[pos[a0]][m]=1;
 for(let c=0;c<m;c++){let p=c;for(let r=c+1;r<m;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];const d=M[c][c];if(Math.abs(d)<1e-12)return Infinity;for(let r=0;r<m;r++){if(r===c)continue;const f=M[r][c]/d;if(f)for(let k=c;k<=m;k++)M[r][k]-=f*M[c][k]}}
 return M[pos[a0]][m]/M[pos[a0]][pos[a0]]}
function meterReading(){const {red,black,mode}=meter;if(!red||!black)return {txt:"----",note:"Put the red lead on one dot and the black lead on another."};
 if(P3&&(red.startsWith("p:")||black.startsWith("p:")))return p3Reading(red,black,mode);
 const sa=ptSec(red),sb=ptSec(black);
 if(mode==="v"){if(sa!==sb)return {txt:"0.0",unit:"V AC",note:"The leads are on two different supplies (line side and 24 V side). They aren't connected, so there's no reading between them."};
  const P=potentials(sa);const a=P[red],b=P[black];const v=a==null||b==null?0:Math.abs(a-b);
  const live=sa==="lo"?loLive:power;let note=!live?(sa==="lo"&&power?"The 24 V side is dead: the transformer isn't powered or its fuse is blown.":"Power is off."):a==null||b==null?"One lead is on a floating point (not connected to either rail through anything). The meter reads about 0.":v>0.5?"Voltage across a part with no current through it means that part is open: an open switch or contact, or a load that isn't running.":"0 V across a closed contact or a wire is normal. 0 V across a load means it has no power.";
  return {txt:v.toFixed(1),unit:"V AC",note}}
 const live=power&&(sa!=="lo"||loLive)||power&&sb!=="lo";if(power)return {txt:"Err",unit:mode==="o"?"Ω":"",note:"Turn the disconnect off before reading ohms or continuity. Ohms with power on gives false readings and can blow the meter's fuse."};
 if(sa!==sb)return {txt:"OL",unit:"Ω",note:"Different circuits: the line side and the 24 V side aren't connected."};
 const o=resistance(red,black);
 if(mode==="o")return {txt:o===Infinity?"OL":o<0.05?"0.0":o<100?o.toFixed(1):o<10000?Math.round(o).toString():(o/1000).toFixed(1)+"k",unit:"Ω",note:o===Infinity?"OL means open: no path between the leads (an open contact, switch, fuse or winding).":o<0.5?"About 0 Ω: a closed contact, a wire, or a good fuse.":"A load's resistance. A coil reading OL is an open coil; near 0 Ω is a shorted coil."};
 return {txt:o<2?"0.0":"OL",unit:o<2?"BEEP":"",note:o<2?"Continuity: the meter beeps. The path is closed.":"No beep: the path is open, or there's a load in it (continuity mode only beeps below about 2 Ω)."}}

function renderTstat(){const el=$("tRoom");if(!el)return;el.textContent=Math.round(LTS.room)+"°";
 document.querySelectorAll("[data-sys]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sys===LTS.sys));document.querySelectorAll("[data-fan]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.fan===LTS.fan));
 $("tHs").textContent=LTS.hs+"°";$("tCs").textContent=LTS.cs+"°";
 $("tMode").textContent=LTS.sys.toUpperCase()+" · FAN "+LTS.fan.toUpperCase();
 const has={};each(c=>has[c.k]=1);const hp=has.tyhp;const tk=TSK.some(k=>has[k]);document.querySelectorAll(".tface,.tRow,#tCall").forEach(e=>e.style.display=tk?"":"none");const th=$("tHint");if(th)th.hidden=tk;
 const on=[["R-Y",hp?tY()||tW():tY()],["R-Y2",has.ty2&&sysC()&&LTS.call2C],["R-G",LTS.fan==="on"||tY()],["R-W",!hp&&tW()],["R-W2",has.tw2&&sysH()&&LTS.call2H],["R-O",has.to&&modeC()],["R-B",has.tb&&modeH()]].filter(x=>x[1]).map(x=>x[0]);$("tCall").textContent=on.length?`Closed now: ${on.join(", ")}`:"No call: R is not connected to Y, G or W.";
 const sb=$("simInfo");if(sb){const L=[];if(has.aq)L.push(`Boiler water <b>${Math.round(SIM.wt)}°F</b> · aquastat ${SIM.aq?"closed":"open"}`);if(has.bts)L.push(`Walk-in box <b>${SIM.box.toFixed(1)}°F</b> (in 38 / out 34)`);if(has.lpc)L.push(`Suction <b>${Math.round(SIM.suct)} psig</b> (in 35 / out 15)`);if(has.dtr||has.dtd)L.push(SIM.def>0?`<b>DEFROST</b> ${Math.ceil(SIM.def)} s left`:`Next defrost in ${Math.ceil(90-SIM.clock)} s`);sb.innerHTML=L.join("<br>");sb.hidden=!L.length}}
/* ---------- drawing ---------- */
const svg=$("ladder");
const sym=(c,x,y,on,br)=>{const k=c.k,col=on?"var(--hotw)":"var(--ink)";const mid=y;
 const lbl=(s,dy=br?30:-26)=>`<text x="${x+CW/2}" y="${mid+dy}" class="tg">${esc(s)}</text>`;
 const lineL=`<line x1="${x}" y1="${mid}" x2="${x+40}" y2="${mid}" stroke="${col}" stroke-width="3"/>`,lineR=`<line x1="${x+80}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/>`;
 const cl=closed(c,true),showOpen=!svc;
 if(k==="no"||k==="nc"||k==="tdno"||k==="tdnc"||k==="ol"){const ncS=k==="nc"||k==="tdnc"||k==="ol";
  return lineL+lineR+`<line x1="${x+44}" y1="${mid-16}" x2="${x+44}" y2="${mid+16}" stroke="${col}" stroke-width="3"/><line x1="${x+76}" y1="${mid-16}" x2="${x+76}" y2="${mid+16}" stroke="${col}" stroke-width="3"/>`+(ncS?`<line x1="${x+38}" y1="${mid+16}" x2="${x+82}" y2="${mid-16}" stroke="${col}" stroke-width="2"/>`:"")+(cl&&!ncS?`<line x1="${x+44}" y1="${mid}" x2="${x+76}" y2="${mid}" stroke="${col}" stroke-width="3" opacity=".6"/>`:"")+(!cl&&ncS?`<text x="${x+60}" y="${mid+(br?-20:30)}" class="tg" fill="var(--bad)">OPEN</text>`:"")+lbl(k==="ol"?`OL ${c.tag}`:k.startsWith("td")?`${c.tag} ${k==="tdno"?"TDC":"TDO"}`:c.tag||"?")}
 if(k==="pbno"||k==="pbnc"){const d=c.st.down;return lineL+lineR+`<line x1="${x+40}" y1="${mid}" x2="${x+44}" y2="${mid}" stroke="${col}" stroke-width="3"/><line x1="${x+76}" y1="${mid}" x2="${x+80}" y2="${mid}" stroke="${col}" stroke-width="3"/><circle cx="${x+44}" cy="${mid}" r="3" fill="${col}"/><circle cx="${x+76}" cy="${mid}" r="3" fill="${col}"/>`+
  (k==="pbno"?`<line x1="${x+40}" y1="${mid-(d?3:12)}" x2="${x+80}" y2="${mid-(d?3:12)}" stroke="${col}" stroke-width="3"/>`:`<line x1="${x+40}" y1="${mid+(d?-12:4)}" x2="${x+80}" y2="${mid+(d?-12:4)}" stroke="${col}" stroke-width="3"/>`)+`<line x1="${x+60}" y1="${mid-(d?3:12)}" x2="${x+60}" y2="${mid-26}" stroke="${col}" stroke-width="2"/><rect x="${x+50}" y="${mid-32}" width="20" height="6" fill="${k==="pbno"?"var(--ok)":"var(--bad)"}"/>`+`<text x="${x+CW/2}" y="${mid-38}" class="tg">${esc(c.tag||(k==="pbno"?"START":"STOP"))}</text>`}
 if(k==="tterm")return `<line x1="${x}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/><circle cx="${x+60}" cy="${mid}" r="12" fill="var(--paper)" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+5}" class="tg" style="font-size:13px">${esc(c.tag||"?")}</text>`;
 if(k==="fuse"){const bl=c.st.blown&&showOpen;return lineL.replace(`x2="${x+40}"`,`x2="${x+36}"`)+lineR.replace(`x1="${x+80}"`,`x1="${x+84}"`)+`<rect x="${x+36}" y="${mid-9}" width="48" height="18" rx="3" fill="var(--paper)" stroke="${col}" stroke-width="2.5"/>`+(bl?`<path d="M${x+40} ${mid} h14 l4 -6 M${x+80} ${mid} h-14 l-4 6" stroke="${col}" stroke-width="2" fill="none"/>`:`<path d="M${x+38} ${mid} q11 -10 22 0 t22 0" stroke="${col}" stroke-width="2" fill="none"/>`)+`<text x="${x+CW/2}" y="${mid+30}" class="tg"${bl?' fill="var(--bad)"':""}>FUSE${bl?" BLOWN":""}</text>`}
 if(k==="tsw"||k==="lim"||k==="tcc"||k==="thc"||k==="rollout"||k==="aq"||k==="bts"||k==="lpc"){const ncS=k==="lim"||k==="thc"||k==="rollout"||k==="aq";const name={tsw:"TEMP SW",lim:"HIGH LIMIT",tcc:"COOL CALL",thc:"HEAT CALL",rollout:"ROLLOUT",aq:"AQUASTAT",bts:"BOX T'STAT",lpc:"LP CONTROL"}[k];
  const by=ncS?mid+(cl?2:16):mid-(cl?2:16),my=(mid+by)/2,sx=x+61;
  const zz=ncS?`M${sx} ${my-1} V${mid-18}`:`M${sx} ${my+1} V${mid+12}`,ey=ncS?mid-22:mid+16;const trip=(k==="lim"||k==="rollout")&&!cl;
  return lineL+lineR+`<circle cx="${x+44}" cy="${mid}" r="3" fill="${col}"/><circle cx="${x+76}" cy="${mid}" r="3" fill="${col}"/><line x1="${x+44}" y1="${mid}" x2="${x+80}" y2="${by}" stroke="${col}" stroke-width="3"/>`+
   `<path d="${zz}" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 2" fill="none"/><path d="M${sx-10} ${ey} l3.3 -4 l3.3 8 l3.3 -8 l3.3 8 l3.3 -8 l3.4 4" stroke="${col}" stroke-width="2" fill="none" stroke-linejoin="round"/>`+
   `<text x="${x+CW/2}" y="${mid+(ncS?34:38)}" class="tg"${trip?' fill="var(--bad)"':""}>${name}${trip?" OPEN":""}</text><text x="${x+CW/2}" y="${mid+(ncS?46:50)}" class="tg" style="font-size:9px;fill:var(--muted)">${k==="rollout"?"MANUAL RESET":k==="aq"?"OPENS AT 180°F":k==="bts"?"IN 38°F / OUT 34°F":k==="lpc"?"IN 35 / OUT 15 PSIG":ncS?"OPENS ON RISE":"CLOSES ON RISE"}</text>`}
 if(["sw","ty","tw","tg","hps","lps","tsc","tsh","tfo","tfa","ty2","tw2","tyhp","to","tb","lwco","aps","dtr","dtd","sel"].includes(k)){const name={sel:c.st.on?"SEL: RUN":"SEL: JOG",sw:"SWITCH",ty:"T'STAT Y",tw:"T'STAT W",tg:"T'STAT G",hps:"HPS",lps:"LPS",tsc:"SYS COOL",tsh:"SYS HEAT",tfo:"FAN ON",tfa:"FAN AUTO",ty2:"T'STAT Y2",tw2:"T'STAT W2",tyhp:"T'STAT Y",to:"T'STAT O",tb:"T'STAT B",lwco:"LWCO",aps:"PRESS SW "+(c.tag||""),dtr:"TIMER: COOL",dtd:"TIMER: DEFROST"}[k];
  return lineL+lineR+`<circle cx="${x+44}" cy="${mid}" r="3" fill="${col}"/><circle cx="${x+76}" cy="${mid}" r="3" fill="${col}"/><line x1="${x+44}" y1="${mid}" x2="${x+78}" y2="${mid-(cl?2:16)}" stroke="${col}" stroke-width="3"/>`+(k==="hps"||k==="lps"||k==="aps"?`<path d="M${x+60} ${mid+6} v10 m-8 0 h16" stroke="${col}" fill="none" stroke-width="2"/>`:"")+`<text x="${x+CW/2}" y="${mid+34}" class="tg"${!cl&&(k==="hps"||k==="lps"||k==="lwco")?' fill="var(--bad)"':""}>${name}${!cl&&(k==="hps"||k==="lps"||k==="lwco")?" OPEN":""}</text>`}
 // loads
 const lw=`<line x1="${x}" y1="${mid}" x2="${x+38}" y2="${mid}" stroke="${col}" stroke-width="3"/><line x1="${x+82}" y1="${mid}" x2="${x+CW}" y2="${mid}" stroke="${col}" stroke-width="3"/>`;
 if(E[k].coil){const t=timers[c.tag];return lw+`<circle cx="${x+60}" cy="${mid}" r="22" fill="${on?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+5}" class="tg" style="font-size:13px">${esc(c.tag)}</text>`+(k==="td"?`<text x="${x+60}" y="${mid+36}" class="tg">${t?(t.done?"DONE":(c.secs-t.t).toFixed(1)+" s"):c.secs+" s"}</text>`:"")}
 if(k==="motor"){const ol=motorOL[c.tag],run=on&&!ol;
  return lw+`<circle cx="${x+60}" cy="${mid}" r="22" fill="${run?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+6}" class="tg" style="font-size:17px">M</text>`+
   `<text x="${x+60}" y="${mid+38}" class="tg">${esc(c.tag)}${ol?" OL TRIPPED":run?" RUNNING":""}</text>`}
 if(k==="lamp")return lw+`<circle cx="${x+60}" cy="${mid}" r="20" fill="${on?c.color:"var(--paper)"}" stroke="${col}" stroke-width="3" ${on?'filter="url(#glow)"':""}/><path d="M${x+46} ${mid-14} l28 28 M${x+74} ${mid-14} l-28 28" stroke="${col}" stroke-width="2"/>`;
 if(k==="sol")return lw+`<rect x="${x+40}" y="${mid-16}" width="40" height="32" fill="${on?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><path d="M${x+44} ${mid} q4 -10 8 0 q4 10 8 0 q4 -10 8 0 q4 10 8 0" stroke="${col}" fill="none" stroke-width="2"/><text x="${x+60}" y="${mid+34}" class="tg">${esc(c.tag||"SOL")}</text>`;
 if(k==="heat")return lw+`<path d="M${x+38} ${mid} l4 -12 l8 24 l8 -24 l8 24 l8 -24 l8 24 l4 -12" stroke="${on?"#ff5a1f":col}" fill="none" stroke-width="3"/><text x="${x+60}" y="${mid+34}" class="tg">${esc(c.tag||"HTR")}</text>`;
 if(k==="buzz")return lw+`<path d="M${x+40} ${mid+14} h40 a20 20 0 0 0 -40 0" fill="${on?"var(--hotf)":"var(--paper)"}" stroke="${col}" stroke-width="3"/><text x="${x+60}" y="${mid+34}" class="tg">ALARM${on?" !!":""}</text>`;
 if(k==="xfmr"){const coilP=(yy)=>{let d=`M${x+40} ${yy}`;for(let i=0;i<4;i++)d+=` a5 5 0 0 1 10 0`;return d};const bl=c.st.fuse&&showOpen;
  return lw.replace(`x2="${x+38}"`,`x2="${x+40}"`).replace(`x1="${x+82}"`,`x1="${x+80}"`)+`<path d="${coilP(mid)}" stroke="${col}" stroke-width="2.5" fill="none"/><line x1="${x+40}" y1="${mid+9}" x2="${x+80}" y2="${mid+9}" stroke="${col}" stroke-width="2"/><line x1="${x+40}" y1="${mid+13}" x2="${x+80}" y2="${mid+13}" stroke="${col}" stroke-width="2"/>`+
   `<path d="M${x+40} ${mid+22} ${Array.from({length:4},()=>"a5 5 0 0 0 10 0").join(" ")}" stroke="${loLive?"var(--hotw)":"var(--ink)"}" stroke-width="2.5" fill="none"/><text x="${x+60}" y="${mid-14}" class="tg">${esc(c.tag)} 120/24 V</text><text x="${x+60}" y="${mid+44}" class="tg"${bl?' fill="var(--bad)"':""}>${bl?"24 V FUSE BLOWN":"PRIMARY · 40 VA"}</text>`}
 return ""};
/* geometry: each section gets its own rails; rung height grows with its branches */
let GEO=null;
function layout(){const secs=hasX()?["hi","lo"]:["hi"];let y=Y0;const g={rung:[],sec:{}};
 secs.forEach(s=>{const rs=rungs.map((r,ri)=>[r,ri]).filter(([r])=>secOf(r)===s);const nmax=Math.max(DEFN,...rs.map(([r])=>r.n));const top=y;
  rs.forEach(([r,ri])=>{const extra=r.br.length+(placing||moving?(r.br.length<MAXBR?1:0):0);const h=TOP+44+extra*BRH,y0=y;g.rung[ri]={y:y0+20,h,ybr:k=>y0+20+56+k*BRH};y+=h});
  if(!rs.length)y+=40;g.sec[s]={top,bot:y,nmax,xr:X0+nmax*CW};y+=s==="hi"&&secs.length>1?SEC_GAP:0});
 const nmax=Math.max(...Object.values(g.sec).map(s=>s.nmax));g.W=X0*2+nmax*CW+70;g.H=y+40;return g}
function render(){
 GEO=layout();const {W,H}=GEO;svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
 if(innerWidth<700){svg.style.width=Math.round(W*0.68)+"px";svg.style.maxWidth="none"}else{svg.style.width="100%";svg.style.maxWidth=W+"px"}svg.style.height="auto";
 let s=`<defs><filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="arc"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#cfefff"/><stop offset="1" stop-color="#2f6fd6" stop-opacity="0"/></radialGradient><marker id="ah" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--hotw)"/></marker></defs>`;
 const colors=!svc;// in a service call the power-flow colors are off: use the meter
 const X=xfmrEl();
 Object.entries(GEO.sec).forEach(([sname,sg])=>{const live=sname==="lo"?loLive:P3?p3CtlLive():power;const railC=live&&colors?"var(--hotw)":"var(--muted)";
  s+=`<line x1="${X0}" y1="${sg.top-10}" x2="${X0}" y2="${sg.bot+6}" stroke="${railC}" stroke-width="5"/><line x1="${sg.xr}" y1="${sg.top-10}" x2="${sg.xr}" y2="${sg.bot+6}" stroke="var(--ink)" stroke-width="5"/>`;
  const v=sname==="lo"?"24":String(lineV());const lab=P3?["X1 ("+v+" V)","X2"]:sname==="lo"?["R (24 V)","C"]:v==="24"?["R (24 V)","C"]:["L1 ("+v+" V)",v==="240"?"L2":"N"];
  s+=`<text x="${X0}" y="${sg.top-16}" class="rail">${lab[0]}</text><text x="${sg.xr}" y="${sg.top-16}" class="rail">${lab[1]}</text>`;
  if(P3)s+=`<path d="M${sg.xr} ${sg.top-10} h18 v10 m-10 0 h20 m-16 5 h12 m-8 5 h4" stroke="var(--ok)" stroke-width="2" fill="none"/>`;
  if(sname==="lo"&&X){const ty=sg.top-SEC_GAP/2-4;s+=`<g class="xbridge"><rect x="${X0-30}" y="${ty-26}" width="250" height="52" rx="6" fill="var(--panel)" stroke="var(--panel-edge)"/><text x="${X0-18}" y="${ty-6}" class="tg" style="text-anchor:start">${esc(X.tag)} SECONDARY: 24 V AC</text><text x="${X0-18}" y="${ty+12}" class="tg" style="text-anchor:start;fill:${loLive?"var(--ok)":"var(--bad)"}">${loLive?"Powered":X.st.fuse&&!svc?"Fuse blown":"No power"}</text></g>`}});
 rungs.forEach((r,ri)=>{const G=GEO.rung[ri],y=G.y,sg=GEO.sec[secOf(r)],n=r.n;
  s+=`<text x="${X0-28}" y="${y+5}" class="rn">${ri+1}</text>`;
  const emp=r.cells.every(z=>!z)&&!r.br.length;
  for(let i=0;i<n;i++){const x=X0+i*CW,c=r.cells[i],hot=colors&&hotEdges.has(ri+":m:"+i);
   s+=`<g class="cell${placing||moving?" drop":""}" data-r="${ri}" data-w="m" data-i="${i}"><rect x="${x+2}" y="${y-44}" width="${CW-4}" height="88" fill="transparent"/>`;
   s+=c?`<g class="el${sel===c.id?" sel":""}" data-id="${c.id}">${sym(c,x,y,colors&&(energized.has(c.id)||(hot&&!E[c.k].load)))}</g>`:`<line x1="${x}" y1="${y}" x2="${x+CW}" y2="${y}" stroke="${hot?"var(--hotw)":emp?"var(--line)":"var(--ink)"}" stroke-width="3"${emp?' stroke-dasharray="6 6"':""}/>`;
   s+=`</g>`}
  if(n<sg.nmax){const hot=colors&&hotEdges.size&&[...hotEdges].some(h=>h.startsWith(ri+":"))&&energized.size;s+=`<line x1="${X0+n*CW}" y1="${y}" x2="${sg.xr}" y2="${y}" stroke="var(--ink)" stroke-width="3"/>`}
  if(emp)s+=`<text x="${X0+Math.min(n,6)*CW/2}" y="${y-12}" class="tg" fill="var(--muted)">empty rung: tap a slot to add a part</text>`;
  // slot count buttons, right of the right rail
  const bx=sg.xr+14;s+=`<g class="sbtn" data-slot="${ri}:+"${n>=MAXN?' opacity=".3"':""}><rect x="${bx}" y="${y-26}" width="30" height="24" rx="5"/><text x="${bx+15}" y="${y-9}">+</text></g><g class="sbtn" data-slot="${ri}:-"${n<=3?' opacity=".3"':""}><rect x="${bx}" y="${y+2}" width="30" height="24" rx="5"/><text x="${bx+15}" y="${y+19}">−</text></g>`;
  r.br.forEach((b,bi)=>{const yb=G.ybr(bi),xa=X0+b.from*CW,xb=X0+(b.to+1)*CW;
   s+=`<line x1="${xa}" y1="${y}" x2="${xa}" y2="${yb}" stroke="var(--ink)" stroke-width="3"/><line x1="${xb}" y1="${y}" x2="${xb}" y2="${yb}" stroke="var(--ink)" stroke-width="3"/><circle cx="${xa}" cy="${y}" r="4"/><circle cx="${xb}" cy="${y}" r="4"/>`;
   for(let i=b.from;i<=b.to;i++){const x=X0+i*CW,c=b.cells[i],hot=colors&&hotEdges.has(ri+":b"+bi+":"+i);
    s+=`<g class="cell${placing||moving?" drop":""}" data-r="${ri}" data-w="b${bi}" data-i="${i}"><rect x="${x+2}" y="${yb-30}" width="${CW-4}" height="60" fill="transparent"/>`;
    s+=c?`<g class="el${sel===c.id?" sel":""}" data-id="${c.id}">${sym(c,x,yb,colors&&(energized.has(c.id)||(hot&&!E[c.k].load)),1)}</g>`:`<line x1="${x}" y1="${yb}" x2="${x+CW}" y2="${yb}" stroke="${hot?"var(--hotw)":"var(--ink)"}" stroke-width="3"/>`;s+=`</g>`}});
  if((placing||moving)&&r.br.length<MAXBR){const yb=G.ybr(r.br.length);for(let i=0;i<n;i++){const x=X0+i*CW;s+=`<g class="cell drop br" data-r="${ri}" data-w="b${r.br.length}" data-i="${i}"><rect x="${x+6}" y="${yb-22}" width="${CW-12}" height="40" rx="6" fill="transparent" stroke="var(--line)" stroke-dasharray="4 4"/><text x="${x+CW/2}" y="${yb+4}" class="tg" fill="var(--muted)">branch</text></g>`}}
  r.br.forEach((b,bi)=>{for(let i=b.from;i<=b.to;i++){const a=r.cells[i],b2=b.cells[i];if(a&&b2&&((a.k==="tfo"&&b2.k==="tfa")||(a.k==="tfa"&&b2.k==="tfo"))){const x=X0+i*CW+62,yb=G.ybr(bi);
   s+=`<path d="M${x} ${y-(closed(a)?1:8)} V${yb-(closed(b2)?1:8)}" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="4 3"/><text x="${x+7}" y="${y+16}" class="tg" style="font-size:9px;text-anchor:start;fill:var(--muted)">ONE FAN SELECTOR</text>`}}});
  if(shortRung===ri)s+=`<rect x="${X0}" y="${y-30}" width="${n*CW}" height="60" fill="none" stroke="var(--bad)" stroke-width="4" class="blinkR"/>`;
 });
 // meter probe points
 if(meter.on){const PT={};rungs.forEach((r,ri)=>{const G=GEO.rung[ri],sg=GEO.sec[secOf(r)];const pts=[[0,X0,G.y],[r.n,sg.xr,G.y]];for(let i=1;i<r.n;i++)pts.push([i,X0+i*CW,G.y]);
   const {N}=rungEdges(r);let base=r.n+1;r.br.forEach((b,bi)=>{for(let i=b.from+1;i<=b.to;i++)pts.push([base+i,X0+i*CW,G.ybr(bi)]);base+=r.n+1});
   pts.forEach(([nd,x,y])=>{const key=nd<=r.n?ptKey(ri,nd):ri+":"+nd;const isR=meter.red===key,isB=meter.black===key;(PT[key]=PT[key]||[]).push([x,y,String(ri)]);
    s+=`<g class="mpt" data-pt="${key}" data-ri="${ri}"><circle cx="${x}" cy="${y}" r="14" fill="transparent"/><circle cx="${x}" cy="${y}" r="${isR||isB?6.5:5}" fill="${isR?"#d0312d":isB?"#1d2327":"var(--paper)"}" stroke="${isR?"#7a1410":"var(--brass)"}" stroke-width="2"/></g>`})});
  s+=probesFor(PT,128,1.3)}
 s+=`<g id="fx"></g>`;
 svg.innerHTML=s;
 $("pwr").textContent=power?"Disconnect: ON":"Disconnect: OFF";$("pwr").setAttribute("aria-pressed",power);
 $("volt").disabled=hasX();if($("voltNote"))$("voltNote").hidden=!hasX();
 $("addLo").hidden=!hasX();$("delLo").hidden=!hasX();
 renderTstat();renderMeter();renderSvc();
 renderSheet()}
const HIDE3=new Set(["xfmr","motor","heat","aq","bts","lpc","dtr","dtd","lwco","aps","rollout","lim","tsw","hps","lps"]);
const hid=k=>P3&&(HIDE3.has(k)||E[k].cat==="Thermostat");
const cats=()=>CATS.filter(c=>Object.entries(E).some(([k,t])=>t.cat===c&&!hid(k)));
function renderPalette(){$("palette").innerHTML=cats().map(c=>`<h3>${c}</h3><div class="pal">${Object.entries(E).filter(([k,t])=>t.cat===c&&!hid(k)).map(([k,t])=>`<button class="palItem${placing===k?" on":""}" data-add="${k}" title="${esc(t.info)}">${esc(t.n)}</button>`).join("")}</div>`).join("")}
function renderMeter(){const box=$("meterBox");if(!box)return;box.hidden=!meter.on;$("meterBtn").setAttribute("aria-pressed",meter.on);if(!meter.on)return;
 const r=meterReading();$("mLcd").innerHTML=`<b>${esc(r.txt)}</b><small>${esc(r.unit||"")}</small>`;$("mNote").textContent=r.note;
 document.querySelectorAll("[data-mmode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mmode===meter.mode));
 const where=p=>{if(!p)return "not placed";const [a,b]=p.split(":");if(a==="p")return p3PtName(b);if(P3&&a==="hi")return b==="L"?"X1":"X2";if(a==="hi"||a==="lo")return (a==="lo"?"24 V ":"")+(b==="L"?"left rail":"right rail");return `rung ${+a+1}, point ${b}`};
 const lead=l=>`<button class="mLead ${l}${meter[l]?" out":""}" data-lead="${l}" aria-pressed="${meter.next===l}"><svg viewBox="-34 -14 68 100" width="42" height="62" aria-hidden="true"><g transform="translate(0 82) rotate(${l==="red"?12:-12})">${probeShape(l)}</g></svg><span><b>${l==="red"?"Red (V Ω)":"Black (COM)"}</b><small>${meter[l]?"on "+where(meter[l]):"in the holder"}</small></span></button>`;
 const h=lead("red")+lead("black");const J=$("mJacks");if(J&&J.dataset.h!==h&&!(pd&&pd.moved)){J.dataset.h=h;J.innerHTML=h}
 $("mLeads").textContent=!meter.red&&!meter.black?"Drag a lead onto a dot in the drawing. Or tap a lead here, then tap a dot.":`Next tap places the ${meter.next==="red"?"red":"black"} lead. Drag a lead off the drawing to put it back.`}
function say(m,c=""){const d=document.createElement("div");d.innerHTML=`<span class="${c}">${esc(m)}</span>`;$("log").prepend(d);while($("log").children.length>100)$("log").lastChild.remove()}
function arc(ri){say(`ARC FLASH: rung ${ri+1} connects ${lineV()===24?"R straight to C":"L1 straight to the other side"} with no load. Dead short. Power off.`,"b");
 render();const fx=svg.querySelector("#fx");const G=GEO.rung[ri],y=G.y,x=X0+rungs[ri].n*CW/2;fx.innerHTML=`<circle cx="${x}" cy="${y}" r="160" fill="url(#arc)" class="flash"/>`+Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return `<path d="M${x} ${y} l${(Math.cos(a)*50).toFixed(0)} ${(Math.sin(a)*50).toFixed(0)} l${(Math.cos(a+.5)*25).toFixed(0)} ${(Math.sin(a+.5)*25).toFixed(0)} l${(Math.cos(a)*40).toFixed(0)} ${(Math.sin(a)*40).toFixed(0)}" stroke="#bfe6ff" stroke-width="3" fill="none" class="flash"/>`}).join("");
 const w=$("wrapL");w.classList.remove("shake");void w.offsetWidth;w.classList.add("shake");
 $("mT").textContent="Arc flash: dead short";$("mB").innerHTML=`<p>Rung ${ri+1} has a path from the left rail to the right rail with nothing that uses power in it. With its switches closed, that's a dead short across the supply.</p><p>Every rung needs a load (a coil, motor, light, solenoid or heater) between its switches and the right rail. Contacts and switches go on the left; the load goes on the right. Watch for a branch that bypasses the load too.</p><p>Fix rung ${ri+1} (outlined in red), then turn the disconnect back on.</p>`;$("modal").hidden=false}

/* ---------- sheet for a selected element ---------- */
function pressPb(c){c.st.down=true;c.st.t=0;if(c.tag)each(x=>{if((x.k==="pbno"||x.k==="pbnc")&&x.tag===c.tag){x.st.down=true;x.st.t=0}})}
function findEl(id){let f=null;rungs.forEach((r,ri)=>{r.cells.forEach((c,i)=>{if(c&&c.id===id)f={c,ri,w:"m",i}});r.br.forEach((b,bi)=>b.cells.forEach((c,i)=>{if(c&&c.id===id)f={c,ri,w:"b"+bi,i}}))});return f}
function renderSheet(){const f=sel&&findEl(sel);const box=$("elSheet");if(!f){box.hidden=true;box.dataset.sel="";return}box.hidden=false;const c=f.c,t=E[c.k];
 if(box.dataset.sel===sel&&box.contains(document.activeElement)&&/INPUT|SELECT/.test(document.activeElement.tagName))return;box.dataset.sel=sel;
 let h=`<h3>${esc(t.n)} <span class="note">rung ${f.ri+1}${f.w!=="m"?", branch":""}</span></h3><div class="btns">`;
 if(t.manual)h+=`<button class="btn blue" data-op="act">${t.manual==="push"?"Press":t.manual==="defrost"?(SIM.def>0?"In defrost":"Start defrost now"):t.manual==="trip"?(c.st.trip?"Reset":"Trip it"):(c.k==="sel"?(c.st.on?"Switch to JOG":"Switch to RUN"):c.st.on?"Turn off":"Turn on")}</button>`;
 if(c.k==="fuse")h+=`<button class="btn blue" data-op="fuse">${c.st.blown?"Replace fuse":"Blow it"}</button>`;
 if(c.k==="xfmr")h+=`<button class="btn blue" data-op="xfuse">${c.st.fuse?"Replace 24 V fuse":"Blow 24 V fuse"}</button>`;
 if(t.motor)h+=`<button class="btn" data-op="ol">${motorOL[c.tag]?"Reset overload":"Trip overload"}</button>`;
 if(t.tagKind){const opts=tagsFor(t.tagKind);h+=`<label class="inl">Tied to <select data-op="tag">${opts.length?opts.map(o=>`<option${o===c.tag?" selected":""}>${o}</option>`).join(""):`<option value="">add a ${t.tagKind==="timer"?"timer coil":t.tagKind==="motor"?"motor":"coil"} first</option>`}</select></label>`}
 if(t.coil||t.motor)h+=`<label class="inl">Name <input data-op="name" value="${esc(c.tag)}" maxlength="8" size="7"></label>`;
 if(c.k==="pbno"||c.k==="pbnc")h+=`<label class="inl">Button name <input data-op="pbname" value="${esc(c.tag||"")}" maxlength="8" size="7" placeholder="${c.k==="pbno"?"START":"STOP"}"></label>`;
 if(c.k==="ol"&&P3)h+=`<button class="btn" data-op="olr">${motorOL[c.tag]?"Reset overload":"Trip overload"}</button>`;
 if(c.k==="td")h+=`<label class="inl">Delay <input data-op="secs" type="number" min="1" max="120" value="${c.secs}" style="width:64px"> s</label>`;
 if(c.k==="lamp")h+=`<label class="inl">Color <select data-op="color">${[["#3fdc6c","Green"],["#ff4a3a","Red"],["#ffd84a","Amber"],["#e9ecee","White"]].map(([v,n])=>`<option value="${v}"${v===c.color?" selected":""}>${n}</option>`).join("")}</select></label>`;
 if(c.k==="tterm")h+=`<label class="inl">Terminal <select data-op="term">${["R","C","Y","Y1","Y2","G","W","W1","W2","O","B","E","L"].map(o=>`<option${o===c.tag?" selected":""}>${o}</option>`).join("")}</select></label>`;
 if(TSK.includes(c.k))h+=`<span class="note">Set the system, fan and room temperature in the Thermostat panel.</span>`;
 if(c.k==="aq")h+=`<span class="note">Boiler water now ${Math.round(SIM.wt)}°F.</span>`;if(c.k==="bts")h+=`<span class="note">Box now ${SIM.box.toFixed(1)}°F.</span>`;if(c.k==="lpc")h+=`<span class="note">Suction now ${Math.round(SIM.suct)} psig.</span>`;
 if(c.k==="no"||c.k==="nc")h+=`<button class="btn" data-op="flip">Make it ${c.k==="no"?"NC":"NO"}</button>`;
 h+=`<button class="btn" data-op="move">Move</button>`;
 if(f.w!=="m")h+=`<button class="btn" data-op="bl">Branch ◀ wider</button><button class="btn" data-op="br">Branch wider ▶</button><button class="btn" data-op="bs">Narrower</button>`;
 h+=`<button class="btn red" data-op="del">Remove</button></div><p class="note">${esc(t.info)}</p>${partCardHTML(c.k)}`;box.innerHTML=h}

/* ---------- placing, moving, slot menu ---------- */
function brOf(r,w){return w==="m"?null:+w.slice(1)}
function cellAt(r,w,i){if(w==="m")return r.cells[i];const b=r.br[brOf(r,w)];return b?b.cells[i]:null}
function setCell(r,w,i,e){if(w==="m"){r.cells[i]=e;return true}const bi=brOf(r,w);if(bi>=MAXBR)return false;if(!r.br[bi]){if(bi!==r.br.length)return false;r.br.push({from:i,to:i,cells:blankCells()})}const b=r.br[bi];if(i<b.from)b.from=i;if(i>b.to)b.to=i;b.cells[i]=e;return true}
function tidyBr(r){r.br=r.br.filter(b=>b.cells.some(x=>x))}
function canPlace(k,ri){if(k==="xfmr"){if(hasX()){say("One control transformer per ladder. It's already placed.","w");return false}if(rungs[ri].sec==="lo"){say("Put the transformer on a line-voltage rung: its primary runs on line voltage.","w");return false}}return true}
function place(k,ri,w,i){if(!canPlace(k,ri))return;const r=rungs[ri];if(i>=r.n)return;snap();const e=mk(k);
 if(!setCell(r,w,i,e))return;
 if(k==="xfmr"){$("volt").value="120";if(!rungs.some(x=>x.sec==="lo")){rungs.push(blank("lo"),blank("lo"),blank("lo"))}sortRungs();say("Transformer placed. The 24 V ladder (R and C) below is powered when the transformer's rung is energized. Name a coil on the 24 V side, then tie line-side contacts to that same name.")}
 sel=e.id;say(`Placed ${E[k].n}${e.tag&&k!=="xfmr"?" ("+e.tag+")":""} on rung ${rungs.indexOf(r)+1}${w!=="m"?" branch":""}.`);shortRung=null;warned={};save()}
function moveTo(id,ri,w,i){const f=findEl(id);if(!f)return;const r2=rungs[ri];if(i>=r2.n)return;if(f.c.k==="xfmr"&&r2.sec==="lo"){say("The transformer stays on the line-voltage side.","w");return}
 const r1=rungs[f.ri];if(f.ri===ri&&f.w===w&&f.i===i)return;snap();const other=cellAt(r2,w,i);
 if(f.w==="m")r1.cells[f.i]=null;else r1.br[brOf(r1,f.w)].cells[f.i]=null;
 if(!setCell(r2,w,i,f.c)){if(f.w==="m")r1.cells[f.i]=f.c;else r1.br[brOf(r1,f.w)].cells[f.i]=f.c;return}
 if(other){if(f.w==="m")r1.cells[f.i]=other;else{const b=r1.br[brOf(r1,f.w)];if(b)b.cells[f.i]=other}}
 tidyBr(r1);if(r1!==r2)tidyBr(r2);sel=id;say(`Moved ${E[f.c.k].n}${other?` (swapped with ${E[other.k].n})`:""}.`);warned={};save()}
let menuAt=null,menuCat="Loads";
function openMenu(ri,w,i){menuAt={ri,w,i};$("smSearch").value="";const r=rungs[ri];$("smT").textContent=`Rung ${ri+1}, slot ${i+1}${w!=="m"?" (branch)":""}`;
 $("smBrRow").hidden=w!=="m"||r.br.length>=MAXBR&&!r.br.some(b=>i>=b.from-1&&i<=b.to+1&&!b.cells[i]);$("smBr").checked=false;renderMenu();$("slotMenu").hidden=false;if(innerWidth>=700)$("smSearch").focus()}
function closeMenu(){$("slotMenu").hidden=true;menuAt=null}
function renderMenu(){const q=$("smSearch").value.trim().toLowerCase();
 $("smCats").innerHTML=q?"":cats().map(c=>`<button class="${c===menuCat?"on":""}" data-mcat="${c}">${c}</button>`).join("");
 const list=Object.entries(E).filter(([k,t])=>!hid(k)).filter(([k,t])=>q?(t.n+" "+(t.al||"")+" "+t.cat).toLowerCase().split(/\s+/).some(w=>w.startsWith(q))||(t.n+" "+(t.al||"")).toLowerCase().includes(q):t.cat===menuCat);
 $("smList").innerHTML=list.length?list.map(([k,t])=>`<button class="smItem" data-mput="${k}"><b>${esc(t.n)}</b><small>${esc(t.cat)}</small></button>`).join(""):`<p class="note">No parts match "${esc(q)}".</p>`}
function menuPut(k){if(!menuAt)return;let {ri,w,i}=menuAt;const r=rungs[ri];
 if(w==="m"&&$("smBr").checked){let bi=r.br.findIndex(b=>!b.cells[i]&&i>=b.from-1&&i<=b.to+1);if(bi<0)bi=r.br.length;w="b"+bi}
 closeMenu();place(k,ri,w,i);render()}

/* ---------- service call ---------- */
let svc=null;
const SVC={
 seal:[{t:"MTR1",k:"motor",msg:"The starter pulls in and the green light comes on, but the motor doesn't run.",why:"Open motor winding: the motor has voltage across it but no path through it."},
  {k:"pbno",msg:"Pressing START does nothing. The red light stays on.",why:"START pushbutton contacts burned open: no voltage gets past it when it's pressed."},
  {t:"M1",k:"mcoil",msg:"Pressing START does nothing. The red light stays on.",why:"Open contactor coil: full voltage across the coil while START is held, but it never pulls in. Coil ohms read OL."},
  {t:"MTR1",k:"ol",msg:"Nothing happens when START is pressed. Nobody has touched the overload.",why:"Overload contact (95-96) stuck open: voltage across it, OL with power off."},
  {k:"lamp",color:"#3fdc6c",msg:"The motor runs fine but the green RUN light never comes on.",why:"Burned-out bulb: voltage across the lamp, OL with power off."}],
 ac:[{k:"xfmr",msg:"Nothing runs: no indoor fan, no outdoor unit.",why:"Open transformer secondary: 120 V on the primary, 0 V from R to C."},
  {k:"hps",msg:"The indoor fan runs, but the outdoor unit never starts.",why:"High pressure switch stuck open: 24 V across it with the thermostat calling."},
  {t:"M1",k:"mcoil",msg:"The indoor fan runs, but the outdoor unit never starts.",why:"Open contactor coil: 24 V across the coil but it doesn't pull in. Coil ohms read OL."},
  {t:"BR",k:"coil",msg:"The outdoor unit runs, but there's no air from the vents.",why:"Open blower relay coil: 24 V across it, OL with power off."},
  {t:"COMP",k:"motor",msg:"The outdoor fan runs and the contactor is pulled in, but the compressor is silent.",why:"Open compressor winding (or internal overload open): line voltage at the compressor, OL across it."}],
 tstat24:[{t:"HR",k:"coil",msg:"No heat at all. Cooling works fine.",why:"Open heat relay coil: 24 V across it on a heat call, but no click."},
  {k:"heat",msg:"On a heat call the blower runs, but the air is cold.",why:"Open heat strip element: 120 V across it, OL with power off."},
  {t:"CC",k:"no",line:true,msg:"On a cooling call the blower runs but the outdoor unit doesn't.",why:"Contactor contacts burned open: the coil pulls in, but there's line voltage across the open contact and none at the compressor."}],
 td:[{t:"TD1",k:"td",msg:"The amber light never comes on, even after waiting.",why:"Open timer coil: voltage across it, nothing happens."}],
 furnace:[{t:"IND",k:"motor",msg:"No heat. On a call, the inducer relay clicks but the inducer never starts.",why:"Open inducer motor: 120 V across it, OL with power off. Without draft the pressure switch never closes."},
  {t:"IND",k:"aps",msg:"No heat. The inducer runs, but the igniter never glows.",why:"Pressure switch stuck open (or a blocked hose or flue): 24 V across it with the inducer running."},
  {t:"HSI",k:"heat",msg:"No heat. The inducer runs, the gas valve opens after the warm-up, but nothing lights.",why:"Open hot surface igniter: 120 V across it during warm-up, OL with power off."},
  {t:"GV",k:"sol",msg:"No heat. The igniter glows, then shuts off, and the burner never lights.",why:"Open gas valve coil: 24 V across the valve when it should open, coil reads OL."},
  {k:"lim",msg:"No heat. Nothing happens on a heat call: no inducer.",why:"High limit open: 24 V across it with W calling. Find out why (dirty filter, blower) before replacing it."}],
 hp:[{t:"RV",k:"sol",msg:"In cooling, the outdoor unit runs but warm air comes out of the vents.",why:"Open reversing valve coil: 24 V across it from O, but it never shifts, so the unit stays in heat."},
  {t:"HR",k:"coil",msg:"Heat pump runs, but on cold days the house never catches up. The strips never come on.",why:"Open heat relay coil: 24 V across it on a W2 call, OL with power off."},
  {t:"CC",k:"mcoil",msg:"The blower runs, but the outdoor unit never starts in heat or cool.",why:"Open contactor coil: 24 V across it with Y calling, coil reads OL."}],
 stage2:[{t:"Y2",k:"sol",msg:"Cooling works but never catches up on hot days. The compressor never goes to high stage.",why:"Open stage solenoid: 24 V across it from Y2, coil reads OL."},
  {t:"HR2",k:"coil",msg:"First stage heat works, but the second bank never adds in.",why:"Open HR2 relay coil: 24 V across it on a W2 call."},
  {t:"HTR1",k:"heat",msg:"On a W1 call the blower runs, but the air is barely warm.",why:"Open first-stage heater element: 120 V across it, OL with power off."}],
 boiler:[{t:"CR",k:"coil",msg:"No heat. The thermostat calls, but neither the circulator nor the burner starts.",why:"Open relay coil: 24 V across T-T side coil, coil reads OL."},
  {t:"CIRC",k:"motor",msg:"The boiler fires and cycles on its aquastat, but the radiators stay cold.",why:"Open circulator motor: 120 V across it, OL with power off."},
  {k:"lwco",msg:"The circulator runs, but the burner never fires. The sight glass shows water.",why:"Low water cutoff failed open (fouled probe): 24 V across it with water in the boiler."},
  {t:"GV",k:"sol",msg:"The circulator runs and the aquastat is closed, but the burner never fires.",why:"Open gas valve coil: 24 V across it, coil reads OL."}],
 walkin:[{t:"LLS",k:"sol",msg:"The box is warm. The evaporator fans run, but the compressor never starts.",why:"Open liquid line solenoid coil: 240 V across it with the box thermostat closed. The valve stays shut, so suction never reaches the LP cut-in."},
  {t:"CC",k:"mcoil",msg:"The box is warm. Suction pressure rises past cut-in, but the compressor never starts.",why:"Open contactor coil: 240 V across it, coil reads OL."},
  {t:"EFAN",k:"motor",msg:"The compressor runs and the box creeps up. The evaporator is icing.",why:"Open evaporator fan motor: 240 V across it, OL with power off."}]};
function svcStart(){const ST=P3?SVC3:SVC;const keys=Object.keys(ST);const key=keys[Math.floor(Math.random()*keys.length)];snap();loadEx(key);
 const list=ST[key];const pick=list[Math.floor(Math.random()*list.length)];let el=null;
 each((c,ri)=>{if(el)return;if(c.k!==pick.k)return;if(pick.t&&c.tag!==pick.t)return;if(pick.color&&c.color!==pick.color)return;if(pick.line&&rungs[ri].sec==="lo")return;el=c});
 if(!el){say("Couldn't set up that service call. Try again.","w");return}
 el.f="open";svc={key,id:el.id,pick,done:false};meter.on=true;meter.red=meter.black=null;sel=null;
 say(`Service call: ${pick.msg}`,"w");render()}
function svcEnd(msg){if(!svc)return;const f=findEl(svc.id);if(f)delete f.c.f;svc=null;say(msg);render()}
function renderSvc(){const b=$("svcBox");if(!b)return;b.hidden=!svc;if(!svc)return;
 $("svcMsg").textContent=svc.pick.msg;$("svcHelp").textContent=svc.done?"":"Power-flow colors are off, like a real job. Use the meter: volts with power on to find where power stops, then ohms with the disconnect off to confirm."}
function svcDiagnose(){const items=[];each((c,ri,w)=>items.push(c));
 $("mT").textContent="What failed?";$("mB").innerHTML=`<p>Pick the part you think failed open.</p><div class="dgList">${items.map(c=>`<button class="btn" data-dg="${c.id}">${esc(E[c.k].n)}${c.tag&&c.k!=="xfmr"?" "+esc(c.tag):""} · rung ${findEl(c.id).ri+1}</button>`).join("")}</div>`;$("modal").hidden=false}
function svcGuess(id){$("modal").hidden=true;if(!svc)return;const ok=id===svc.id;const f=findEl(svc.id);
 if(ok){svc.done=true;$("mT").textContent="Correct";$("mB").innerHTML=`<p>${esc(svc.pick.why)}</p><p>Replace it and the system works again.</p>`;$("modal").hidden=false;svcEnd(`Service call solved: ${E[f.c.k].n} ${f.c.tag||""} on rung ${f.ri+1}.`)}
 else{$("mT").textContent="Not that one";$("mB").innerHTML=`<p>That part tests good. Keep checking with the meter: with power on, the open part is the one with full voltage across it.</p>`;$("modal").hidden=false;say("Wrong guess on the service call. Keep metering.","w")}}

/* ---------- interaction ---------- */
svg.addEventListener("click",ev=>{
 if(pdJust||(meter.on&&!placing&&!moving&&ev.target.closest(".mpt,.probe")))return;
 const sb=ev.target.closest(".sbtn");if(sb){const [ri,op]=sb.dataset.slot.split(":");const r=rungs[+ri];
  if(op==="+"){if(r.n<MAXN){snap();r.n++;save();render()}}
  else if(r.n>3){const last=r.n-1;if(r.cells[last]||r.br.some(b=>b.to>=last)){say(`Rung ${+ri+1}: clear the last slot before removing it.`,"w")}else{snap();r.n--;save();render()}}return}
 const el=ev.target.closest(".el"),cell=ev.target.closest(".cell");
 if(moving&&cell){moveTo(moving,+cell.dataset.r,cell.dataset.w,+cell.dataset.i);moving=null;$("hint").textContent="";render();return}
 if(placing&&cell){place(placing,+cell.dataset.r,cell.dataset.w,+cell.dataset.i);if(!ev.shiftKey){placing=null;renderPalette();$("hint").textContent=""}render();return}
 if(el){if(dragEl&&dragEl.moved)return;const f=findEl(el.dataset.id);sel=el.dataset.id;const t=E[f.c.k];
  if(t.manual==="push")pressPb(f.c);
  render();if(t.manual!=="push"){const sh=$("elSheet"),rc=sh.getBoundingClientRect();if(rc.top>innerHeight-80||rc.bottom<0)sh.scrollIntoView({behavior:"smooth",block:"nearest"})}return}
 if(cell&&!svc){const r=rungs[+cell.dataset.r];if(!cellAt(r,cell.dataset.w,+cell.dataset.i)){openMenu(+cell.dataset.r,cell.dataset.w,+cell.dataset.i);return}}
 sel=null;render()});
/* ---------- meter leads: tap a dot, tap a lead to choose it, or drag a lead to a dot ---------- */
let pd=null,pdJust=false,pGhost=null,pRing=null;
const other=l=>l==="red"?"black":"red";
function nearDot(x,y,max){let best=null,bd=max;document.querySelectorAll(".mpt").forEach(m=>{const r=m.getBoundingClientRect();if(!r.width)return;const cx=r.left+r.width/2,cy=r.top+r.height/2,d=Math.hypot(cx-x,cy-y);if(d<bd){bd=d;best={pt:m.dataset.pt,ri:m.dataset.ri,cx,cy}}});return best}
const tipOf=ev=>[ev.clientX,ev.clientY-(ev.pointerType==="touch"?44:0)];
document.addEventListener("pointerdown",ev=>{if(!meter.on||placing||moving||!ev.target.closest)return;
 const pr=ev.target.closest("[data-lead]"),mp=!pr&&ev.target.closest(".mpt");if(!pr&&!mp)return;
 pd={lead:pr?pr.dataset.lead:null,pt:mp?mp.dataset.pt:null,ri:mp?mp.dataset.ri:null,sx:ev.clientX,sy:ev.clientY,moved:false};if(pr){ev.preventDefault();try{ev.target.releasePointerCapture(ev.pointerId)}catch(e){}}},true);
document.addEventListener("pointermove",ev=>{if(!pd||!pd.lead)return;
 if(!pd.moved&&Math.hypot(ev.clientX-pd.sx,ev.clientY-pd.sy)>6){pd.moved=true;document.body.classList.add("probing");
  pGhost=document.createElementNS("http://www.w3.org/2000/svg","svg");pGhost.setAttribute("class","pGhost");pGhost.innerHTML=`<g transform="rotate(${probeAng(pd.lead,false)})">${probeShape(pd.lead)}</g>`;
  pRing=document.createElement("div");pRing.className="pRing";pRing.hidden=true;document.body.append(pRing,pGhost);render();if(P3)p3Render()}
 if(!pd.moved)return;ev.preventDefault();const [x,y]=tipOf(ev);pGhost.style.left=x+"px";pGhost.style.top=y+"px";
 const n=nearDot(x,y,34);pRing.hidden=!n;if(n){pRing.style.left=n.cx+"px";pRing.style.top=n.cy+"px"}},{passive:false});
function pdEnd(ev,cancel){if(!pd)return;const d=pd;pd=null;document.body.classList.remove("probing");if(pGhost){pGhost.remove();pGhost=null}if(pRing){pRing.remove();pRing=null}
 if(cancel){render();return}
 if(d.moved){const [x,y]=tipOf(ev);const n=nearDot(x,y,34);
  if(n){if(meter[other(d.lead)]===n.pt)meter[other(d.lead)]=null;meter[d.lead]=n.pt;meter.ri[d.lead]=n.ri;meter.next=meter[other(d.lead)]?d.lead:other(d.lead)}
  else{if(meter[d.lead])say(`${d.lead==="red"?"Red":"Black"} lead back in the holder.`);meter[d.lead]=null;meter.next=d.lead}
  pdJust=true;setTimeout(()=>{pdJust=false},0)}
 else if(d.lead){meter.next=d.lead}
 else if(d.pt&&Math.hypot(ev.clientX-d.sx,ev.clientY-d.sy)<10){const l=meter.next;if(meter[other(l)]===d.pt)meter[other(l)]=null;meter[l]=d.pt;meter.ri[l]=d.ri;meter.next=other(l)}
 render();if(P3)p3Render()}
document.addEventListener("pointerup",ev=>pdEnd(ev,false));document.addEventListener("pointercancel",ev=>pdEnd(ev,true));
// drag from the palette, or drag a placed part (mouse); long-press a placed part to move it (touch)
let dragK=null,ghost=null,dragEl=null,lpTimer=null;
document.addEventListener("pointerdown",ev=>{const b=ev.target.closest("[data-add]");
 if(b){dragK={k:b.dataset.add,sx:ev.clientX,sy:ev.clientY,moved:false};return}
 const el=ev.target.closest&&ev.target.closest("#ladder .el");if(!el||svc)return;
 if(ev.pointerType==="mouse"){dragEl={id:el.dataset.id,sx:ev.clientX,sy:ev.clientY,moved:false}}
 else{clearTimeout(lpTimer);const id=el.dataset.id;lpTimer=setTimeout(()=>{moving=id;sel=id;const f=findEl(id);$("hint").textContent=`Moving ${E[f.c.k].n}: tap the slot to move it to.`;if(navigator.vibrate)navigator.vibrate(30);render()},450)}});
document.addEventListener("pointermove",ev=>{
 if(lpTimer&&(Math.abs(ev.movementX)+Math.abs(ev.movementY)>6)){clearTimeout(lpTimer);lpTimer=null}
 const d=dragK||dragEl;if(!d)return;
 if(!d.moved&&Math.hypot(ev.clientX-d.sx,ev.clientY-d.sy)>8){d.moved=true;if(dragK)placing=dragK.k;else moving=dragEl.id;render();ghost=document.createElement("div");ghost.className="ghost";ghost.textContent=dragK?E[dragK.k].n:E[findEl(dragEl.id).c.k].n;document.body.append(ghost)}
 if(ghost){ghost.style.left=ev.clientX+8+"px";ghost.style.top=ev.clientY+8+"px"}});
document.addEventListener("pointerup",ev=>{clearTimeout(lpTimer);lpTimer=null;const d=dragK||dragEl;if(!d)return;const isK=!!dragK;dragK=null;if(ghost){ghost.remove();ghost=null}
 if(d.moved){const t=document.elementFromPoint(ev.clientX,ev.clientY);const cell=t&&t.closest&&t.closest(".cell");
  if(cell){if(isK)place(d.k,+cell.dataset.r,cell.dataset.w,+cell.dataset.i);else moveTo(d.id,+cell.dataset.r,cell.dataset.w,+cell.dataset.i)}
  placing=null;moving=null;renderPalette();render();setTimeout(()=>{dragEl=null},0)}else dragEl=null});
document.addEventListener("pointercancel",()=>{clearTimeout(lpTimer);dragK=null;dragEl=null;if(ghost){ghost.remove();ghost=null}});
document.addEventListener("input",ev=>{if(ev.target.id==="smSearch")renderMenu()});
document.addEventListener("click",ev=>{
 if(ev.target.id==="slotMenu"){closeMenu();return}
 const b=ev.target.closest("button");if(!b)return;
 if(b.dataset.mcat){menuCat=b.dataset.mcat;renderMenu();return}
 if(b.dataset.mput){menuPut(b.dataset.mput);return}
 if(b.dataset.mmode){meter.mode=b.dataset.mmode;render();return}
 if(b.dataset.dg){svcGuess(b.dataset.dg);return}
 if(b.dataset.add){if(dragK&&dragK.moved)return;placing=placing===b.dataset.add?null:b.dataset.add;moving=null;$("hint").textContent=placing?`Now tap a spot on a rung to place: ${E[placing].n}. Dashed boxes under a rung make a parallel branch.`:"";renderPalette();render();if(placing&&innerWidth<1000)$("wrapL").scrollIntoView({behavior:"smooth",block:"start"});return}
 if(b.dataset.sys){LTS.sys=b.dataset.sys;say(`Thermostat system: ${LTS.sys}.`);save();render();return}
 if(b.dataset.fan){LTS.fan=b.dataset.fan;say(`Thermostat fan: ${LTS.fan}${LTS.fan==="on"?" (R to G all the time)":" (G only with a call)"}.`);save();render();return}
 if(b.dataset.adj){const [k,d]=b.dataset.adj.split(":");LTS[k]=Math.round(LTS[k]+ +d);if(k==="hs")LTS.hs=Math.min(LTS.hs,LTS.cs-2);if(k==="cs")LTS.cs=Math.max(LTS.cs,LTS.hs+2);save();render();return}
 if(b.dataset.op){const f=findEl(sel);if(!f)return;const c=f.c,op=b.dataset.op,r=rungs[f.ri];const br=f.w!=="m"?r.br[brOf(r,f.w)]:null;
  if(op==="act"){const t=E[c.k];if(t.manual==="push"){pressPb(c)}else if(t.manual==="defrost"){if(!(SIM.def>0))startDefrost()}else if(t.manual==="trip"){c.st.trip=!c.st.trip;say(`${t.n} ${c.st.trip?"tripped open":"reset"}.`)}else{c.st.on=!c.st.on}}
  if(op==="fuse"){c.st.blown=!c.st.blown;if(!c.st.blown)shortRung=null;say(c.st.blown?"Fuse blown.":"Fuse replaced.")}
  if(op==="xfuse"){c.st.fuse=!c.st.fuse;if(!c.st.fuse)shortRung=null;say(c.st.fuse?"Transformer fuse blown: 24 V side dead.":"Transformer fuse replaced.")}
  if(op==="ol"){motorOL[c.tag]=!motorOL[c.tag];say(`${c.tag} overload ${motorOL[c.tag]?"tripped":"reset"}.`)}
  if(op==="olr"){motorOL[c.tag]=!motorOL[c.tag];if(P3&&!motorOL[c.tag])P3S.m.forEach(M=>{if(M.tag===c.tag)M.heat=0});say(`${c.tag} overload ${motorOL[c.tag]?"tripped":"reset"}.`)}
  if(op==="flip"){c.k=c.k==="no"?"nc":"no"}
  if(op==="move"){moving=c.id;$("hint").textContent=`Moving ${E[c.k].n}: tap the slot to move it to.`;render();return}
  if(op==="bl"&&br.from>0)br.from--;if(op==="br"&&br.to<r.n-1)br.to++;
  if(op==="bs"){if(br.to>br.from){if(f.i>br.from){br.cells[br.to]=null;br.to--}else{br.cells[br.from]=null;br.from++}}}
  if(op==="del"){snap();if(f.w==="m")r.cells[f.i]=null;else{br.cells[f.i]=null;tidyBr(r)}
   if(c.k==="xfmr"){rungs.forEach(x=>delete x.sec);say("Transformer removed: the 24 V rungs are now part of one ladder again.")}sel=null}
  warned={};save();render();return}
 switch(b.id){
  case "addRung":snap();{const lo=rungs.findIndex(r=>r.sec==="lo");if(lo>=0)rungs.splice(lo,0,blank());else rungs.push(blank())}save();render();break;
  case "delRung":{const hi=rungs.map((r,i)=>[r,i]).filter(([r])=>r.sec!=="lo");if(hi.length>1){snap();rungs.splice(hi[hi.length-1][1],1);save();render()}}break;
  case "addLo":snap();rungs.push(blank("lo"));save();render();break;
  case "delLo":{const lo=rungs.map((r,i)=>[r,i]).filter(([r])=>r.sec==="lo");if(lo.length>1){snap();rungs.splice(lo[lo.length-1][1],1);save();render()}}break;
  case "pwr":power=!power;if(power)shortRung=null;say(power?"Disconnect on: power applied.":"Disconnect off: everything is de-energized. Safe for ohms (after you verify dead).");render();break;
  case "undo":if(hist.length){const s=JSON.parse(hist.pop());rungs=s.rungs;idn=s.idn;sel=null;save();render()}break;
  case "clearL":if(confirm("Clear the ladder?")){snap();rungs=[blank(),blank(),blank()];sel=null;coilOn={};timers={};save();render()}break;
  case "mOk":$("modal").hidden=true;break;
  case "meterBtn":meter.on=!meter.on;if(meter.on)say("Meter on: drag the red and black leads onto dots, or tap a lead and then a dot.");render();break;
  case "mClear":meter.red=meter.black=null;meter.next="red";render();break;
  case "svcBtn":if(svc){svcEnd("Service call ended.")}else svcStart();break;
  case "svcDiag":svcDiagnose();break;
  case "svcQuit":{const f=findEl(svc.id);$("mT").textContent="The answer";$("mB").innerHTML=`<p><b>${esc(E[f.c.k].n)} ${esc(f.c.tag||"")}</b> on rung ${f.ri+1}. ${esc(svc.pick.why)}</p>`;$("modal").hidden=false;svcEnd("Service call given up.");break}
  case "smClose":closeMenu();break;
  case "theme":{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("ld-theme",r.dataset.theme)}catch(e){}break}
 }});
document.addEventListener("change",ev=>{const t=ev.target;if(t.id==="volt"){render();return}if(t.id==="ex"){if(t.value){if(svc)svcEnd("Service call ended.");snap();loadEx(t.value);t.value="";save();render()}return}
 const f=findEl(sel);if(!f||!t.dataset.op)return;const c=f.c;
 if(t.dataset.op==="tag")c.tag=t.value;if(t.dataset.op==="secs")c.secs=Math.max(1,Math.min(120,+t.value||5));if(t.dataset.op==="color")c.color=t.value;if(t.dataset.op==="term")c.tag=t.value;
 if(t.dataset.op==="pbname"){const v=t.value.trim().toUpperCase().replace(/\s+/g,"").slice(0,8);if(v)c.tag=v;else delete c.tag}
 if(t.dataset.op==="name"){const old=c.tag,nw=t.value.trim().toUpperCase().replace(/\s+/g,"");if(nw){each(x=>{if(x.tag===old)x.tag=nw});c.tag=nw}}
 save();render()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("slotMenu").hidden){closeMenu();return}placing=null;moving=null;sel=null;$("hint").textContent="";renderPalette();render()}});

/* ---------- examples ---------- */
function loadEx(n){idn=1;coilOn={};timers={};motorOL={};shortRung=null;power=true;warned={};sel=null;
 const R=sec=>blank(sec);const put=(r,i,k,o={})=>{const e=mk(k);Object.assign(e,o);r.cells[i]=e;return e};
 const br=(r,from,to,items)=>{const b={from,to,cells:blankCells()};items.forEach(([i,k,o])=>{const e=mk(k);Object.assign(e,o||{});b.cells[i]=e});r.br.push(b)};
 if(P3){p3Load(n,{R,put,br,set:v=>rungs=v});sortRungs();return}
 if(n==="seal"){$("volt").value="120";const r1=R(),r2=R(),r3=R(),r4=R();rungs=[r1,r2,r3,r4];
  put(r1,7,"mcoil",{tag:"M1"});put(r2,7,"motor",{tag:"MTR1"});
  put(r1,0,"pbnc");put(r1,1,"pbno");put(r1,3,"ol",{tag:"MTR1"});br(r1,1,1,[[1,"no",{tag:"M1"}]]);
  put(r2,0,"no",{tag:"M1"});put(r3,0,"nc",{tag:"M1"});put(r3,7,"lamp",{color:"#ff4a3a"});put(r4,0,"no",{tag:"M1"});put(r4,7,"lamp",{color:"#3fdc6c"});
  say("Example: 3-wire start/stop with a seal-in (holding) contact. Tap START, then STOP. Trip the motor overload to see it drop out.")}
 if(n==="ac"){$("volt").value="120";rungs=[R(),R(),R(),R("lo"),R("lo")];const[a,b,x,y1,y2]=rungs;
  put(a,0,"no",{tag:"M1"});put(a,7,"motor",{tag:"COMP"});br(a,7,7,[[7,"motor",{tag:"OFAN"}]]);put(b,0,"no",{tag:"BR"});put(b,7,"motor",{tag:"BLWR"});
  put(x,7,"xfmr");
  put(y1,0,"ty");put(y1,1,"hps");put(y1,2,"lps");put(y1,7,"mcoil",{tag:"M1"});put(y2,0,"tg");put(y2,7,"coil",{tag:"BR"});
  LTS.sys="cool";LTS.fan="auto";LTS.room=80;
  say("Example: air conditioner. Line side (120 V shown): the contactor's M1 contact runs the compressor and outdoor fan, the blower relay's BR contact runs the blower, and the transformer makes 24 V. 24 V side: Y through the HPS and LPS pulls in the contactor coil M1; G pulls in the blower relay BR. Trip the HPS or change the thermostat.")}
 if(n==="td"){$("volt").value="24";rungs=[R(),R(),R()];const[a,b,c]=rungs;put(a,0,"sw");put(a,7,"td",{tag:"TD1",secs:5});put(b,0,"tdno",{tag:"TD1"});put(b,7,"lamp",{color:"#ffd84a"});put(c,0,"tdnc",{tag:"TD1"});put(c,7,"lamp",{color:"#e9ecee"});
  say("Example: on-delay timer. Turn the switch on; after 5 seconds the timer contacts change over.")}
 if(n==="tstat24"){$("volt").value="120";rungs=[R(),R(),R(),R(),R(),R("lo"),R("lo"),R("lo")];const[d,e,f,g,x,a,b,c]=rungs;
  put(d,0,"no",{tag:"CC"});put(d,7,"motor",{tag:"COMP"});put(e,0,"no",{tag:"CC"});put(e,7,"motor",{tag:"OFAN"});
  put(f,0,"no",{tag:"BR"});put(f,7,"motor",{tag:"BLWR"});br(f,0,0,[[0,"no",{tag:"HR"}]]);put(g,0,"no",{tag:"HR"});put(g,7,"heat");put(x,7,"xfmr");
  put(a,0,"tsc");put(a,1,"tcc");put(a,2,"tterm",{tag:"Y"});put(a,7,"mcoil",{tag:"CC"});
  put(b,0,"tfo");put(b,3,"tterm",{tag:"G"});put(b,7,"coil",{tag:"BR"});br(b,0,2,[[0,"tfa"],[1,"tsc"],[2,"tcc"]]);
  put(c,0,"tsh");put(c,1,"thc");put(c,2,"tterm",{tag:"W"});put(c,7,"coil",{tag:"HR"});
  LTS.sys="cool";LTS.fan="auto";LTS.room=77;LTS.hs=68;LTS.cs=74;LTS.callC=false;LTS.callH=false;
  say("Example: 24 V thermostat. The 24 V ladder (R left, C right) is the thermostat: Y pulls in the compressor contactor CC, G the blower relay BR, W the heat relay HR. The fan switch is one selector (dashed line): ON connects R straight to G, AUTO connects G only during a cooling call. The line-voltage ladder on top shows what each relay's contacts run; with electric heat the HR contact also starts the blower, so the strips never run without air.")}
 if(n==="furnace"){$("volt").value="120";rungs=[R(),R(),R(),R(),R("lo"),R("lo"),R("lo"),R("lo"),R("lo"),R("lo"),R("lo")];const[a,b,c,x,l1,l2,l3,l4,l5,l6,l7]=rungs;
  put(a,0,"no",{tag:"IDR"});put(a,7,"motor",{tag:"IND"});put(b,0,"no",{tag:"IGR"});put(b,7,"heat",{tag:"HSI"});
  put(c,0,"tdno",{tag:"TD2"});put(c,7,"motor",{tag:"BLWR"});br(c,0,0,[[0,"no",{tag:"BR"}]]);put(x,7,"xfmr");
  put(l1,0,"tw");put(l1,1,"lim");put(l1,2,"rollout");put(l1,7,"coil",{tag:"IDR"});
  put(l2,0,"no",{tag:"IDR"});put(l2,1,"aps",{tag:"IND"});put(l2,7,"td",{tag:"TD1",secs:15});
  put(l3,0,"no",{tag:"IDR"});put(l3,1,"aps",{tag:"IND"});put(l3,2,"tdnc",{tag:"TD3"});put(l3,7,"coil",{tag:"IGR"});
  put(l4,0,"no",{tag:"IDR"});put(l4,1,"aps",{tag:"IND"});put(l4,2,"tdno",{tag:"TD1"});put(l4,7,"sol",{tag:"GV"});
  put(l5,0,"no",{tag:"IDR"});put(l5,1,"aps",{tag:"IND"});put(l5,2,"tdno",{tag:"TD1"});put(l5,7,"td",{tag:"TD3",secs:4});
  put(l6,0,"no",{tag:"IDR"});put(l6,1,"aps",{tag:"IND"});put(l6,2,"tdno",{tag:"TD1"});put(l6,7,"td",{tag:"TD2",secs:30});
  put(l7,0,"tg");put(l7,7,"coil",{tag:"BR"});
  LTS.sys="heat";LTS.fan="auto";LTS.room=66;LTS.hs=68;LTS.cs=74;
  say("Example: gas furnace sequence (hot surface ignition), drawn as relays and timers the way the control board works. W through the high limit and rollout pulls in the inducer relay IDR. The inducer runs, the pressure switch proves draft, and the igniter relay IGR heats the igniter (HSI) for a 15 s warm-up (TD1). Then the gas valve GV opens; 4 s later (TD3) the igniter shuts off; 30 s after that (TD2) the blower starts. A real board also proves flame with a flame sensor and keeps the blower on 60 to 120 s after the call ends; this ladder skips those.")}
 if(n==="hp"){$("volt").value="120";rungs=[R(),R(),R(),R(),R("lo"),R("lo"),R("lo"),R("lo")];const[a,b,c,x,l1,l2,l3,l4]=rungs;
  put(a,0,"no",{tag:"CC"});put(a,7,"motor",{tag:"COMP"});br(a,7,7,[[7,"motor",{tag:"OFAN"}]]);
  put(b,0,"no",{tag:"BR"});put(b,7,"motor",{tag:"BLWR"});br(b,0,0,[[0,"no",{tag:"HR"}]]);put(c,0,"no",{tag:"HR"});put(c,7,"heat",{tag:"STRIPS"});put(x,7,"xfmr");
  put(l1,0,"tyhp");put(l1,1,"hps");put(l1,2,"lps");put(l1,7,"mcoil",{tag:"CC"});
  put(l2,0,"to");put(l2,7,"sol",{tag:"RV"});
  put(l3,0,"tg");put(l3,7,"coil",{tag:"BR"});br(l3,0,0,[[0,"tyhp"]]);
  put(l4,0,"tw2");put(l4,7,"coil",{tag:"HR"});
  LTS.sys="heat";LTS.fan="auto";LTS.room=63;LTS.hs=68;LTS.cs=74;
  say("Example: heat pump with O reversing valve and electric heat strips. Y runs the compressor in both heating and cooling. O powers the reversing valve RV only in cooling, so if the RV coil fails the unit heats. G (or any Y call) runs the blower. W2 (AUX) brings on the strips through HR when the room falls 3°F below setpoint, and HR also starts the blower. Try Cool, then Heat, and watch RV. Defrost (a defrost board) isn't shown.")}
 if(n==="stage2"){$("volt").value="120";rungs=[R(),R(),R(),R(),R(),R("lo"),R("lo"),R("lo"),R("lo"),R("lo")];const[a,b,c,d,x,l1,l2,l3,l4,l5]=rungs;
  put(a,0,"no",{tag:"CC"});put(a,7,"motor",{tag:"COMP"});br(a,7,7,[[7,"motor",{tag:"OFAN"}]]);
  put(b,0,"no",{tag:"BR"});put(b,7,"motor",{tag:"BLWR"});br(b,0,0,[[0,"no",{tag:"HR1"}]]);
  put(c,0,"no",{tag:"HR1"});put(c,7,"heat",{tag:"HTR1"});put(d,0,"no",{tag:"HR2"});put(d,7,"heat",{tag:"HTR2"});put(x,7,"xfmr");
  put(l1,0,"ty");put(l1,1,"hps");put(l1,7,"mcoil",{tag:"CC"});
  put(l2,0,"ty2");put(l2,7,"sol",{tag:"Y2"});
  put(l3,0,"tg");put(l3,7,"coil",{tag:"BR"});
  put(l4,0,"tw");put(l4,1,"lim");put(l4,7,"coil",{tag:"HR1"});
  put(l5,0,"tw2");put(l5,1,"lim");put(l5,7,"coil",{tag:"HR2"});
  LTS.sys="cool";LTS.fan="auto";LTS.room=79;LTS.hs=68;LTS.cs=74;
  say("Example: two-stage heat and cool. Y1 starts the compressor on low stage; Y2 (3°F past setpoint) energizes the compressor's 24 V stage solenoid Y2 for full capacity. W1 brings on the first heater bank (and the blower); W2 adds the second bank. Each stage drops out as the room comes back toward setpoint.")}
 if(n==="boiler"){$("volt").value="120";rungs=[R(),R(),R("lo"),R("lo")];const[a,x,l1,l2]=rungs;
  put(a,0,"no",{tag:"CR"});put(a,7,"motor",{tag:"CIRC"});put(x,7,"xfmr");
  put(l1,0,"tterm",{tag:"T"});put(l1,1,"tw");put(l1,2,"tterm",{tag:"T"});put(l1,7,"coil",{tag:"CR"});
  put(l2,0,"no",{tag:"CR"});put(l2,1,"aq");put(l2,2,"lwco");put(l2,7,"sol",{tag:"GV"});
  LTS.sys="heat";LTS.fan="auto";LTS.room=65;LTS.hs=68;LTS.cs=74;SIM.wt=150;SIM.aq=true;
  say("Example: boiler with an aquastat relay (like a Honeywell L8148). The thermostat closes T to T, which pulls in relay CR. One CR contact starts the circulator; the other fires the burner (gas valve GV) through the aquastat high limit (opens at 180°F) and the low water cutoff. Watch the boiler water temperature under the thermostat. Trip the LWCO to see the burner stop while the circulator keeps running.")}
 if(n==="walkin"){$("volt").value="240";rungs=[R(),R(),R(),R(),R()];const[a,b,c,d,e]=rungs;
  put(a,0,"dtr");put(a,1,"bts");put(a,7,"sol",{tag:"LLS"});
  put(b,0,"lpc");put(b,1,"hps");put(b,2,"ol",{tag:"COMP"});put(b,7,"mcoil",{tag:"CC"});
  put(c,0,"no",{tag:"CC"});put(c,7,"motor",{tag:"COMP"});
  put(d,0,"dtr");put(d,7,"motor",{tag:"EFAN"});put(e,0,"dtd");put(e,7,"heat",{tag:"DEF HTR"});
  SIM.box=37.5;SIM.bts=false;SIM.suct=18;SIM.lpc=false;SIM.def=0;SIM.clock=0;
  say("Example: walk-in cooler with pump-down and a defrost time clock (240 V controls, sped up). The box thermostat opens the liquid line solenoid LLS; suction rises to the LP control's cut-in and the compressor starts. When the box is cold the thermostat closes the solenoid, the compressor pumps the evaporator down, and the LP control stops it at cut-out. In defrost the clock opens the cooling contact (pump-down, evaporator fans off) and closes the defrost contact to the heaters. Real units also end defrost on a termination thermostat; this one ends on time.")}
 if(n==="short"){$("volt").value="24";rungs=[R(),R()];const[a,b]=rungs;put(a,0,"sw");put(a,2,"hps");put(b,0,"sw");put(b,7,"lamp");
  say("Example of a mistake: rung 1 has no load. Turn its switch on and see what happens.")}
 sortRungs()}

/* ---------- loop ---------- */
let last=performance.now(),acc=0,lastSig="";
function frame(now){const dt=Math.min(0.2,(now-last)/1000);last=now;acc+=dt;if(acc>=0.1){evaluate(acc);if(P3){p3Tick(acc);p3Render()}acc=0;const X=xfmrEl();const sig=JSON.stringify([coilOn,Object.values(timers).map(t=>t.done?1:Math.round(t.t*10)),[...energized],[...hotEdges],power,loLive,motorOL,P3?JSON.stringify([P3S.fuse,P3S.cfuse,P3S.circ]):0,Math.round(LTS.room),LTS.sys,Math.round(SIM.wt),SIM.box.toFixed(1),Math.round(SIM.suct),Math.ceil(SIM.def),Math.ceil(SIM.clock/5),LTS.fan,LTS.hs,LTS.cs,X&&X.st,rungs.map(r=>[r.cells.map(c=>c&&c.st),r.br.map(b=>b.cells.map(c=>c&&c.st))])]);if(sig!==lastSig){lastSig=sig;render()}}requestAnimationFrame(frame)}
try{const t=localStorage.getItem("ld-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
let ok=false;try{const s=JSON.parse(localStorage.getItem(P3?"ld3-board":"ld-board")||"null");if(s&&s.rungs&&s.rungs.length){rungs=migrate(s.rungs);idn=s.idn;if(s.lts)Object.assign(LTS,s.lts);if(P3&&s.p3){P3S.circ=s.p3.circ||"single";P3S.sup=s.p3.sup||480;if(s.p3.volt)$("volt").value=s.p3.volt}ok=true}}catch(e){}
if(!ok)loadEx(P3?"p3seal":"seal");
renderPalette();render();requestAnimationFrame(frame);
window.__cardFor=k=>{const h=partCardHTML(k);const m=h.match(/<svg[\s\S]*?<\/svg>/);return m?m[0]:""};
window.__ld={LTS,get rungs(){return rungs},evaluate,loadEx,get coilOn(){return coilOn},get energized(){return energized},findEl,setPower:v=>power=v,get power(){return power},get motorOL(){return motorOL},
 meter,meterReading,resistance,potentials,get loLive(){return loLive},svcStart,get svc(){return svc},svcGuess,place,moveTo,each,E,SIM,startDefrost,get P3S(){return P3?P3S:null},p3Tick:P3?p3Tick:null};

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
