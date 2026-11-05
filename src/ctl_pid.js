/* ============ PID TUNING TAB: an AHU zone with a hot water reheat valve, 5 guided lessons and free play ============ */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
/* ---------- the zone (sim seconds) ----------
 Valve -> 45 s transport delay -> coil (60 s lag) -> room (20 min time constant) -> wall sensor (60 s lag).
 Full valve adds 60°F over outdoor air at steady state; the actuator strokes in 90 s. */
const P={tau:1200,G:60,dead:45,coilT:60,sensT:60,stroke:90};
const MODES={onoff:"On/off",p:"P only",pi:"PI",pid:"PID"};
const DEF={mode:"pi",pb:6,ti:10,td:0,diff:1,sp:72,oat:30,noise:false};
const LESSONS=[
 {n:"1. On/off",mode:"onoff",set:{diff:1},lock:["mode","pb","ti","td"],
  t:"The valve is either full open or shut, like a 2-position zone valve on a residential thermostat. The thermostat opens it below setpoint minus half the differential and closes it above setpoint plus half.",
  task:"Press Run test. The setpoint steps from 68 to 72°F at minute 5 and a door opens at minute 35. Then try a 3°F differential.",
  why:"The room keeps swinging well past the differential. Heat already in the coil and the duct keeps arriving after the valve closes (dead time and lag), so the room overshoots. On/off can't settle on a steady valve position.",
  pass:R=>R.done?[true,`Swing ${R.pp.toFixed(1)}°F with a ${R.cfg.diff}°F differential.`]:[false,"Run the test to the end."]},
 {n:"2. P only",mode:"p",set:{pb:2},lock:["mode","ti","td","diff"],
  t:"Proportional control: the valve moves in step with the error. Proportional band (PB) is how many degrees of error it takes to move the valve from shut to full open. Valve = 50% + (100 / PB) × (setpoint − room).",
  task:"PB starts at 2°F and the room hunts. Widen the PB until the room settles (less than 0.5°F of swing in the last 10 minutes), keeping it as narrow as you can (10°F or less).",
  why:"P alone always leaves an offset. To hold the valve at 70% the error has to stay at 0.2 × PB (here 72°F needs 70% open on a 30°F day). Narrow PB means less offset but more hunting, wide PB means calm but further off. A pneumatic thermostat works exactly like this.",
  pass:R=>{if(!R.done)return [false,"Run the test to the end."];const ok=R.pp<0.5&&R.cfg.pb<=10;return [ok,ok?`Settled with PB ${R.cfg.pb}°F. Offset ${R.off.toFixed(1)}°F below setpoint: that's the P-only droop.`:R.pp>=0.5?`Still swinging ${R.pp.toFixed(1)}°F. Widen the PB.`:"PB over 10°F is too lazy. Narrow it."]}},
 {n:"3. Add I",mode:"pi",set:{pb:6,ti:2},lock:["mode","td","diff"],
  t:"Integral (reset) keeps adding to the output as long as there's any error, so it walks the offset out. Reset time (Ti) is the minutes it takes integral to repeat the proportional action once. Short Ti = strong integral.",
  task:"Ti starts at 2 minutes and the room hunts. Find a PB and Ti that end within 0.3°F of setpoint with less than 0.5°F of swing.",
  why:"Too much integral (short Ti) winds the valve past where it needs to be and the room oscillates slowly. Too little (long Ti) takes forever to remove the offset. Most VAV reheat and AHU valve loops run PI.",
  pass:R=>{if(!R.done)return [false,"Run the test to the end."];const ok=Math.abs(R.end)<0.3&&R.pp<0.5;return [ok,ok?`Offset gone: ended ${R.end>=0?"+":""}${R.end.toFixed(2)}°F from setpoint.`:Math.abs(R.end)>=0.3&&R.pp<0.5?`Still ${R.end.toFixed(1)}°F off at the end. Shorten Ti (more integral).`:`Swinging ${R.pp.toFixed(1)}°F. Lengthen Ti or widen PB.`]}},
 {n:"4. Add D",mode:"pid",set:{pb:4,ti:5,td:0},lock:["mode","diff"],
  t:"Derivative reacts to how fast the room is changing and pushes against it, like easing off the gas before a stop sign. Derivative time (Td) in minutes sets how far ahead it looks.",
  task:"PB 4°F and Ti 5 min overshoot. Add some Td until overshoot after the setpoint change is 0.6°F or less and the room settles. Then tick Sensor noise and watch the valve.",
  why:"D damps overshoot on slow loops, but it amplifies sensor noise and makes the valve chatter. That's why almost every HVAC loop is PI with D left at zero.",
  pass:R=>{if(!R.done)return [false,"Run the test to the end."];const ok=R.cfg.td>0&&R.os<=0.6&&R.pp<0.3;return [ok,ok?`Overshoot ${R.os.toFixed(2)}°F with Td ${R.cfg.td} min.`:R.cfg.td<=0?"Add some derivative time first.":`Overshoot ${R.os.toFixed(2)}°F, swing ${R.pp.toFixed(2)}°F. Adjust Td (or PB).`]}},
 {n:"5. Tune it",mode:"pi",set:{pb:3,ti:3,td:0},lock:["diff"],
  t:"Pick the mode and tune it. This is the test a commissioning agent runs: a setpoint change and a door left open.",
  task:"Pass when the room is within 1°F of setpoint from minute 20 to 35 (after the setpoint change), within 1°F from minute 50 to 70 (after the door), and overshoots 1°F or less.",
  why:"A good start for a zone valve: PB about 6 to 10°F and Ti about 10 to 15 minutes, then tighten one at a time. Change one thing, run the test, write it down.",
  pass:R=>{if(!R.done)return [false,"Run the test to the end."];const c=[R.ok1,R.ok2,R.os<=1];return [c.every(Boolean),`${c[0]?"✓":"✗"} within 1°F after the setpoint change. ${c[1]?"✓":"✗"} within 1°F after the door. ${c[2]?"✓":"✗"} overshoot ${R.os.toFixed(2)}°F.`]}},
 {n:"Free play",free:true,set:{},lock:[],t:"Run the zone live. Change anything while it runs: setpoint, outdoor air, tuning, or open the door.",task:"",why:"",pass:()=>[null,""]}];
let ST={les:0,cfg:{...DEF,...LESSONS[0].set,mode:LESSONS[0].mode},passed:{},speed:300};
try{const s=JSON.parse(localStorage.getItem("ct-pid")||"null");if(s&&s.cfg){ST.les=s.les|0;ST.passed=s.passed||{};ST.cfg={...DEF,...s.cfg}}}catch(e){}
const save=()=>{try{localStorage.setItem("ct-pid",JSON.stringify({les:ST.les,cfg:ST.cfg,passed:ST.passed}))}catch(e){}};
/* ---------- the model ---------- */
function newZone(c,T0){const oat=c.oat,v=Math.max(0,Math.min(1,(T0-oat)/P.G));return {t:0,T:T0,s:T0,coil:v,v,buf:Array(P.dead).fill(v),I:c.mode==="pi"||c.mode==="pid"?v*100-50:0,prev:T0,u:v*100,on:v>0.5?1:0,sp:T0,door:0,hist:[],parts:[0,0,0],rnd:1}}
function rnd(z){z.rnd=(z.rnd*16807)%2147483647;return z.rnd/2147483647}
function step(z,c){const e=z.sp-z.meas,Kc=100/c.pb;let d=0;
 if(c.mode==="onoff"){if(z.meas<z.sp-c.diff/2)z.on=1;else if(z.meas>z.sp+c.diff/2)z.on=0;z.u=z.on*100;z.parts=[z.u,0,0]}
 else{if(c.mode==="pid")d=-Kc*c.td*60*(z.meas-z.prev);
  if(c.mode!=="p"){const ni=z.I+Kc*e/(c.ti*60),ut=50+Kc*e+ni+d;if(ut<=100&&ut>=0)z.I=ni}else z.I=0;
  z.u=Math.max(0,Math.min(100,50+Kc*e+z.I+d));z.parts=[50+Kc*e,z.I,d]}
 z.prev=z.meas;
 z.v+=Math.max(-1/P.stroke,Math.min(1/P.stroke,z.u/100-z.v));z.buf.push(z.v);const vd=z.buf.shift();
 z.coil+=(vd-z.coil)/P.coilT;const loss=z.door?25:0;z.T+=((c.oat+P.G*z.coil-loss)-z.T)/P.tau;z.s+=(z.T-z.s)/P.sensT;
 z.meas=c.noise?Math.round((z.s+(rnd(z)-0.5)*0.3)*10)/10:z.s;z.t++;
 if(z.t%20===0){z.hist.push([z.t/60,z.meas,z.sp,z.u,z.door]);if(z.hist.length>400)z.hist.shift()}}
/* scripted test: 68°F steady, setpoint to 72 at minute 5, door open minutes 35-40, ends at minute 70 */
const TEST_END=70*60;
function testZone(c){const z=newZone(c,68);z.meas=68;z.sp=68;z.test=true;return z}
function testTick(z,c){if(z.t===5*60)z.sp=72;z.door=z.t>=35*60&&z.t<40*60?1:0;step(z,c)}
function score(z,c){const H=z.hist;let os=0,ok1=true,ok2=true;for(const [m,s,sp] of H){if(m>5&&m<35)os=Math.max(os,s-sp);if(m>=20&&m<35&&Math.abs(s-sp)>1)ok1=false;if(m>=50&&Math.abs(s-sp)>1)ok2=false}
 const last=H.filter(r=>r[0]>=60).map(r=>r[1]);const mean=last.reduce((a,b)=>a+b,0)/Math.max(1,last.length);
 return {done:z.t>=TEST_END,os:Math.max(0,os),ok1,ok2,pp:last.length?Math.max(...last)-Math.min(...last):0,end:mean-72,off:72-mean,cfg:{...c}}}
/* ---------- drawing ---------- */
function schematic(z,c){const v=Math.round(z.v*100),tc=T=>T>73?"var(--hot)":T<69?"var(--cold)":"var(--ok)",da=c.oat+P.G*z.coil;
 return `<text class="pidL" x="20" y="14">HW SUPPLY</text><path d="M20 26 H160 V62" stroke="var(--hot)" stroke-width="4" fill="none"/><path d="M180 62 V26 H300" stroke="#b05a3a" stroke-width="4" fill="none"/><text class="pidL" x="300" y="14" text-anchor="end">RETURN</text>
 <g transform="translate(95 26)"><path d="M-12 -9 V9 L12 -9 V9 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.8"/><path d="M0 0 V-14" stroke="var(--ink)" stroke-width="2"/><path d="M-14 -14 H14 A14 10 0 0 0 -14 -14Z" fill="#5f686d" transform="translate(0 ${-v/25})"/></g>
 <text class="pidV" x="128" y="52" text-anchor="start">${v}%</text><text class="pidL" x="62" y="52" text-anchor="end">VALVE</text>
 <rect x="20" y="62" width="300" height="50" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/>
 <path d="M30 87 H120" stroke="#3a8bd6" stroke-width="3" marker-end="url(#pidAr)"/><text class="pidL" x="30" y="128">SUPPLY AIR 55°F</text>
 <rect x="150" y="62" width="40" height="50" fill="url(#zFins)" stroke="#4d555a"/><text class="pidL" x="170" y="128" text-anchor="middle">REHEAT COIL</text>
 <path d="M200 87 H310" stroke="${tc(da)}" stroke-width="3" marker-end="url(#pidAr)"/><text class="pidL" x="310" y="128" text-anchor="end">${Math.round(Math.max(55,da))}°F TO ROOM</text>
 <rect x="340" y="20" width="250" height="100" rx="4" fill="${z.door?"#dfe9f5":"var(--paper)"}" stroke="var(--ink)" stroke-width="2"/><text class="pidL" x="350" y="38">ZONE</text><text class="pidL" x="350" y="112">OUTDOOR AIR ${c.oat}°F</text>
 <text class="pidV" x="455" y="78" text-anchor="middle" style="fill:${tc(z.T)}">${z.T.toFixed(1)}°F</text><text class="pidL" x="455" y="96" text-anchor="middle">ROOM</text>
 ${z.door?`<path d="M590 52 L622 36" stroke="var(--ink)" stroke-width="3"/><text class="pidL" x="586" y="112" text-anchor="end" style="fill:var(--cold)">DOOR OPEN</text>`:`<path d="M590 52 V88" stroke="var(--ink)" stroke-width="5"/>`}
 <rect x="540" y="50" width="24" height="32" rx="4" fill="#ece7dc" stroke="#8f8a7f"/><text class="pidL" x="552" y="44" text-anchor="middle">SENSOR</text>
 <rect x="640" y="20" width="110" height="100" rx="6" fill="#1b1f22"/><text x="695" y="44" text-anchor="middle" class="pidLcd">SP ${z.sp.toFixed(1)}</text><text x="695" y="66" text-anchor="middle" class="pidLcd">PV ${z.meas.toFixed(1)}</text><text x="695" y="88" text-anchor="middle" class="pidLcd">OUT ${Math.round(z.u)}%</text><text x="695" y="110" text-anchor="middle" class="pidLcd" style="fill:#e0c070">${MODES[c.mode]}</text>
 <path d="M564 66 H640" stroke="#7a8288" stroke-width="1.4" stroke-dasharray="4 3"/><path d="M695 120 V146 H95 V40" stroke="#7a8288" stroke-width="1.4" stroke-dasharray="4 3" fill="none"/><text class="pidL" x="400" y="140">CONTROLLER OUTPUT TO THE VALVE</text>`}
function graph(z,c,showBand){const W=760,H=300,L=44,R=712,T=14,B=262;const H0=z.hist;const t1=z.test?70:Math.max(60,H0.length?H0[H0.length-1][0]:0),t0=t1-(z.test?70:60);
 const X=m=>L+(m-t0)/(t1-t0)*(R-L);let lo=64,hi=76;H0.forEach(r=>{lo=Math.min(lo,Math.floor(r[1]-1));hi=Math.max(hi,Math.ceil(r[1]+1))});lo=Math.max(40,lo);hi=Math.min(110,hi);
 const Y=v=>B-(v-lo)/(hi-lo)*(B-T),Yu=u=>B-u/100*(B-T);let g="";
 for(let v=Math.ceil(lo/2)*2;v<=hi;v+=2)g+=`<path d="M${L} ${Y(v)} H${R}" stroke="var(--panel-edge)" stroke-width="1"/><text class="pidG" x="${L-6}" y="${Y(v)+4}" text-anchor="end">${v}</text>`;
 for(let u=0;u<=100;u+=25)g+=`<text class="pidG" x="${R+6}" y="${Yu(u)+4}" style="fill:#3a7bd5">${u}%</text>`;
 for(let m=Math.ceil(t0/10)*10;m<=t1;m+=10)g+=`<text class="pidG" x="${X(m)}" y="${B+16}" text-anchor="middle">${Math.round(m)}</text>`;
 // door shading
 let ds=null;H0.forEach(r=>{if(r[4]&&ds===null)ds=r[0];if(!r[4]&&ds!==null){g+=`<rect x="${X(ds)}" y="${T}" width="${X(r[0])-X(ds)}" height="${B-T}" fill="#2f6fd6" opacity=".1"/><text class="pidG" x="${X(ds)+3}" y="${T+12}">door</text>`;ds=null}});
 if(ds!==null&&H0.length)g+=`<rect x="${X(ds)}" y="${T}" width="${X(H0[H0.length-1][0])-X(ds)}" height="${B-T}" fill="#2f6fd6" opacity=".1"/>`;
 if(H0.length>1){const pts=k=>H0.map(r=>`${X(r[0]).toFixed(1)},${(k===3?Yu(r[3]):Y(r[k])).toFixed(1)}`).join(" ");
  if(showBand)g+=`<path d="${H0.map((r,i)=>(i?"L":"M")+X(r[0]).toFixed(1)+" "+Y(r[2]+1).toFixed(1)).join("")}${H0.slice().reverse().map(r=>"L"+X(r[0]).toFixed(1)+" "+Y(r[2]-1).toFixed(1)).join("")}Z" fill="var(--ok)" opacity=".13"/>`;
  g+=`<polyline points="${pts(3)}" fill="none" stroke="#3a7bd5" stroke-width="1.6" opacity=".75"/><polyline points="${pts(2)}" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="6 4"/><polyline points="${pts(1)}" fill="none" stroke="var(--hot)" stroke-width="2.4"/>`}
 g+=`<path d="M${L} ${T} V${B} H${R} V${T}" fill="none" stroke="var(--muted)" stroke-width="1"/><text class="pidG" x="${L}" y="${T-3}">°F</text><text class="pidG" x="${(L+R)/2}" y="${H-6}" text-anchor="middle">minutes</text>`;
 g+=`<g transform="translate(${L+10} ${B-10})"><path d="M0 0 h18" stroke="var(--hot)" stroke-width="2.4"/><text class="pidG" x="22" y="4">room (sensor)</text><path d="M110 0 h18" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="6 4"/><text class="pidG" x="132" y="4">setpoint</text><path d="M196 0 h18" stroke="#3a7bd5" stroke-width="1.6"/><text class="pidG" x="218" y="4">valve % (right scale)</text></g>`;
 return g}
/* ---------- UI ---------- */
let Z=null,running=false,last=0,result=null;
const LES=()=>LESSONS[ST.les];
function sliders(){const c=ST.cfg,l=LES(),lk=k=>l.lock.includes(k)||running&&!l.free;
 const sl=(k,n,min,max,st,u)=>`<div class="row${lk(k)?" pidLock":""}"><label for="pid_${k}">${n}</label><output id="pido_${k}">${c[k]}${u}</output><input type="range" id="pid_${k}" data-pid="${k}" min="${min}" max="${max}" step="${st}" value="${c[k]}"${lk(k)?" disabled":""}></div>`;
 let h=`<div class="pidMode"><span>Mode</span><div class="seg" role="group" aria-label="Control mode">${Object.keys(MODES).map(m=>`<button data-pmode="${m}" aria-pressed="${c.mode===m}"${lk("mode")?" disabled":""}>${MODES[m]}</button>`).join("")}</div></div>`;
 if(c.mode==="onoff")h+=sl("diff","Differential",0.5,4,0.5,"°F");
 else{h+=sl("pb","Proportional band",1,20,0.5,"°F");if(c.mode!=="p")h+=sl("ti","Reset (integral) time",1,30,0.5," min");if(c.mode==="pid")h+=sl("td","Derivative time",0,3,0.1," min")}
 if(l.free)h+=sl("sp","Setpoint",60,80,0.5,"°F")+sl("oat","Outdoor air",0,55,1,"°F");
 h+=`<label class="pidChk"><input type="checkbox" id="pidNoise"${c.noise?" checked":""}> Sensor noise (±0.15°F)</label>`;
 if(c.mode!=="onoff")h+=`<p class="note">Gain = 100 ÷ PB = ${(100/c.pb).toFixed(1)}% valve per °F.${c.mode!=="p"?` Integral repeats ${(1/c.ti).toFixed(2)} times per minute.`:""}</p>`;
 $("pidCtl").innerHTML=h}
function lessonCard(){const l=LES(),r=result&&!l.free?l.pass(result):null;
 $("pidLesson").innerHTML=`<h3>${esc(l.n)}${ST.passed[ST.les]?' <span class="pidOk">✓ passed</span>':""}</h3><p>${esc(l.t)}</p>${l.task?`<p><b>Your task.</b> ${esc(l.task)}</p>`:""}
  ${r?`<p class="pidRes ${r[0]?"ok":"no"}">${r[0]?"Pass. ":"Not yet. "}${esc(r[1])}</p>`:""}${r&&r[0]&&l.why?`<p><b>Why.</b> ${esc(l.why)}</p>`:""}`;
 $("pidRun").hidden=!!l.free;$("pidNow").hidden=!!l.free;$("pidLive").hidden=!l.free;$("pidDoor").hidden=!l.free;
 $("pidRun").textContent=running&&!l.free?"Stop":"Run test";$("pidLive").textContent=running&&l.free?"Pause":"Run"}
function draw(){if(!Z)return;$("pidSch").innerHTML=`<defs><marker id="pidAr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#3a8bd6"/></marker></defs>`+schematic(Z,ST.cfg);
 $("pidG").innerHTML=graph(Z,ST.cfg,ST.les===4);
 const p=Z.parts;$("pidReads").innerHTML=[["Room",Z.meas.toFixed(1)+"°F"],["Setpoint",Z.sp.toFixed(1)+"°F"],["Output",Math.round(Z.u)+"%"],["Valve",Math.round(Z.v*100)+"%"],...(ST.cfg.mode==="onoff"?[]:[["P part",Math.round(p[0])+"%"],["I part",(p[1]>=0?"+":"")+Math.round(p[1])+"%"],...(ST.cfg.mode==="pid"?[["D part",(p[2]>=0?"+":"")+Math.round(p[2])+"%"]]:[])]),["Minute",(Z.t/60).toFixed(0)]].map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join("")}
function resetZone(){const l=LES();running=false;result=null;Z=l.free?(()=>{const z=newZone(ST.cfg,ST.cfg.sp);z.meas=ST.cfg.sp;z.sp=ST.cfg.sp;return z})():testZone(ST.cfg);sliders();lessonCard();draw()}
function setLesson(i){ST.les=i;const l=LESSONS[i];ST.cfg={...DEF,...ST.cfg,...l.set};if(l.mode)ST.cfg.mode=l.mode;if(!l.free){ST.cfg.oat=30;ST.cfg.sp=72}save();
 document.querySelectorAll("[data-pl]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.pl===i));resetZone()}
function finish(){running=false;result=score(Z,ST.cfg);const r=LES().pass(result);if(r[0]){ST.passed[ST.les]=true;save()}sliders();lessonCard();draw();renderLesBtns()}
function renderLesBtns(){document.querySelectorAll("[data-pl]").forEach(b=>{const i=+b.dataset.pl;b.textContent=LESSONS[i].n+(ST.passed[i]?" ✓":"")})}
function frame(ts){if(!running){last=0;return}const dt=last?Math.min(0.1,(ts-last)/1000):0;last=ts;const l=LES();
 let n=Math.round(dt*(l.free?ST.speed:300));
 while(n-->0){if(l.free){Z.sp=ST.cfg.sp;step(Z,ST.cfg)}else{testTick(Z,ST.cfg);if(Z.t>=TEST_END){finish();return}}}
 draw();requestAnimationFrame(frame)}
function start(){if(running)return;running=true;sliders();lessonCard();requestAnimationFrame(frame)}
function show(on){const box=$("pidSec");if(!box)return;box.hidden=!on;if(on){document.querySelector(".layout").hidden=true;const c=$("calSec");if(c)c.hidden=true;
  document.querySelectorAll("[data-sim]").forEach(b=>b.setAttribute("aria-pressed",false));$("simCal")&&$("simCal").setAttribute("aria-pressed",false);if(!Z)setLesson(ST.les);else draw()}else running=false;
 $("simPid").setAttribute("aria-pressed",on)}
document.addEventListener("click",ev=>{const t=ev.target;
 if(t.closest("#simPid")){show(true);return}
 if(t.closest("[data-sim]")||t.closest("#simCal")){if(!$("pidSec").hidden)show(false);if(t.closest("[data-sim]"))document.querySelector(".layout").hidden=false;return}
 if(!t.closest("#pidSec"))return;
 const lb=t.closest("[data-pl]");if(lb){setLesson(+lb.dataset.pl);return}
 const mb=t.closest("[data-pmode]");if(mb&&!mb.disabled){ST.cfg.mode=mb.dataset.pmode;save();if(LES().free){Z.I=ST.cfg.mode==="pi"||ST.cfg.mode==="pid"?Z.u-50:0;sliders();lessonCard()}else resetZone();return}
 if(t.id==="pidRun"){if(running){running=false;resetZone()}else{resetZone();start()}}
 if(t.id==="pidNow"){resetZone();while(Z.t<TEST_END)testTick(Z,ST.cfg);finish()}
 if(t.id==="pidLive"){if(running){running=false;lessonCard()}else start()}
 if(t.id==="pidReset")resetZone();
 if(t.id==="pidDoor"&&Z){Z.door=Z.door?0:1;t.textContent=Z.door?"Close the door":"Open the door";draw()}});
document.addEventListener("input",ev=>{const t=ev.target;if(t.dataset&&t.dataset.pid){const k=t.dataset.pid;ST.cfg[k]=+t.value;const o=$("pido_"+k);if(o)o.textContent=t.value+(k==="ti"||k==="td"?" min":"°F");save();
  if(!LES().free&&!running){result=null;lessonCard()}}
 if(t.id==="pidSpeed")ST.speed=+t.value});
document.addEventListener("change",ev=>{const t=ev.target;if(t.id==="pidNoise"){ST.cfg.noise=t.checked;save();if(!LES().free&&!running){result=null;lessonCard()}}
 if(t.dataset&&t.dataset.pid)sliders()});
renderLesBtns();
window.__pid={ST,LESSONS,newZone,testZone,testTick,score,TEST_END,setLesson,show,get Z(){return Z}};
})();
/* end pid */
