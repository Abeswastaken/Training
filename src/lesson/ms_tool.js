/* ============ Mini-split simulator page: live sim, service calls, error codes ============ */
(()=>{
const $=id=>document.getElementById(id);const f0=K.f0,f1=K.f1;
const BASEOZ=40,PEROZ=0.2,PRELEN=25;   // factory charge for one head and 25 ft, plus 0.2 oz per extra foot
const reqOz=S=>BASEOZ+12*(S.heads-1)+PEROZ*Math.max(0,S.len-PRELEN)*S.heads;
const haveOz=S=>BASEOZ+12*(S.heads-1)+S.add;
const fMul=f=>f==="low"?0.7:f==="over"?1.25:1;
const setCharge=S=>{S.charge=fMul(S.fault)*haveOz(S)/reqOz(S)};
const fresh=o=>{const S=MS.init(o);S.len=o.len??25;S.add=o.add??0;S.fault=o.fault||"none";setCharge(S);S.hist=[];S.lastH=-1e9;return S};
const MODE=S=>S.code?"Stopped: code "+S.code:S.defrost?"Defrost":S.Hz>0?(S.mode==="heat"?"Heating":"Cooling"):S.on.some((o,i)=>o&&i<S.heads)?"Starting":"Idle (satisfied)";
const sat=(S,P)=>RF.Tsat(S.ref,P,"Pd");
function readsOf(S,R){const X=MS.sense(S,R),cool=S.mode==="cool"&&!S.defrost,run=S.Hz>0&&!R.off,cap=R.off?0:cool||S.defrost?R.Q:R.Q+R.W;
 const port=X.port;
 return [["State",MODE(S),!!S.code],["Compressor",run?f0(S.Hz)+" Hz":"off"],["EEV (board command)",run?f0(S.fault==="eevC"?480:S.fault==="eevO"?Math.max(20,R.req*0.3):R.steps)+" of 480 steps":"closed",run&&(R.steps>=470||S.fault==="eevC")],
  [cool?"Capacity (cooling)":"Capacity (heating)",run?f0(cap/100)*100+" Btu/h":"0"],["Power",f0(R.watts)+" W"],
  [cool?"EER (Btu/h per W)":"COP",run?(cool?f1(cap/R.watts):K.f2(cap/3.412/R.watts)):"--"],
  ["Gas line port ("+(cool?"suction":"head")+")",f0(port-14.7)+" psig / "+f0(sat(S,port))+"°F"],
  ["Superheat at the port",cool&&run?f0(R.sh)+"°F":"--",cool&&run&&(R.sh>20||R.sh<2)],
  ["Subcooling (liquid line)",run?f0(R.sc)+"°F":"--",run&&(R.sc<3||R.sc>16)],
  ["Discharge temp",f0(X.dis)+"°F",X.dis>220],["Indoor coil thermistor",X.coilIn==null?"OPEN":f0(X.coilIn)+"°F",X.coilIn==null],["Outdoor coil thermistor",f0(X.coilOut)+"°F"]]}
const trend=S=>{const h=S.hist;if(h.length<2)return `<svg viewBox="0 0 460 150" class="lsHist"><text x="230" y="80" text-anchor="middle" fill="var(--muted)" font-size="13">The trend fills in as the sim runs.</text></svg>`;
 const W=460,H=150,X=i=>40+i*(W-80)/(Math.max(h.length,2)-1),YT=t=>H-22-(t-50)/45*(H-40),YH=z=>H-22-z/130*(H-40);
 const pl=(k,Y)=>h.map((p,i)=>`${i?"L":"M"}${X(i).toFixed(1)} ${Y(p[k]).toFixed(1)}`).join("");
 let s=`<svg viewBox="0 0 ${W} ${H}" class="lsHist" role="img" aria-label="Room temperature and compressor speed over time">`;
 for(const t of [50,65,80,95]){s+=`<path d="M40 ${YT(t)} H${W-40}" stroke="var(--panel-edge)"/><text x="34" y="${YT(t)+4}" text-anchor="end" font-size="11" fill="var(--muted)">${t}°</text>`}
 for(const z of [0,65,130])s+=`<text x="${W-34}" y="${YH(z)+4}" font-size="11" fill="#c06a2a">${z}</text>`;
 s+=`<path d="${pl("sp",YT)}" stroke="var(--muted)" stroke-dasharray="5 4" fill="none"/><path d="${pl("hz",YH)}" stroke="#c06a2a" stroke-width="2" fill="none"/><path d="${pl("t",YT)}" stroke="#2f6fd6" stroke-width="2.5" fill="none"/>`;
 s+=`<text x="44" y="14" font-size="12" fill="#2f6fd6">Room (zone A)</text><text x="150" y="14" font-size="12" fill="var(--muted)">setpoint</text><text x="${W-44}" y="14" text-anchor="end" font-size="12" fill="#c06a2a">compressor Hz</text>`;
 const mins=Math.round(h.length*0.5);return s+`<text x="${W/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="var(--muted)">last ${mins<60?mins+" min":f1(mins/60)+" h"} of sim time</text></svg>`};
const record=S=>{if(S.t-S.lastH>=30){S.lastH=S.t;S.hist.push({t:S.tin[0],sp:S.sp[0],hz:S.Hz});if(S.hist.length>240)S.hist.shift()}};
const stepN=(S,secs)=>{let R=S.R;const dt=secs>60?5:secs>10?2:Math.min(1,secs);for(let t=0;t<secs-1e-9;t+=dt){R=MS.step(S,Math.min(dt,secs-t));record(S)}return R||MS.solve(S)};

/* ---------- simulator tab ---------- */
let SIM,SPD=60,timer=null,lastScene=0;
let PREF={mode:"cool",tout:95,heads:1,sp:74,tin:80,fan:"auto",hyper:false,ref:"R-410A",fault:"none",len:25,add:0,therm:true};
try{Object.assign(PREF,JSON.parse(localStorage.getItem("ms-tool")||"{}"))}catch(e){}
const savePref=()=>{try{localStorage.setItem("ms-tool",JSON.stringify(PREF))}catch(e){}};
const opt=(list,v)=>list.map(([k,l])=>`<option value="${k}"${String(k)===String(v)?" selected":""}>${l}</option>`).join("");
function mountSim(el){
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="msSvg" viewBox="0 0 900 520" role="img" aria-label="Mini-split: wall heads in the rooms and the outdoor unit"></svg></div>
  <div id="msTr"></div><p class="note" id="msWhy"></p></div>
 <div class="lsSide"><div class="group"><h3>Readings</h3><div class="reads lsReads" id="msR"></div></div>
 <div class="group"><h3>Run it</h3><div class="btns" id="msSpd">${[[1,"Real time"],[60,"×60"],[300,"×300"],[0,"Pause"]].map(([v,l])=>`<button class="btn${v===SPD?" blue":""}" data-spd="${v}">${l}</button>`).join("")}</div>
  <div class="btns"><button class="btn" id="msReset">Reset (rooms back to start)</button></div></div>
 <div class="group"><h3>Set it up</h3>
  <label class="lsPick">Mode <select id="msMode">${opt([["cool","Cooling"],["heat","Heating"]],PREF.mode)}</select></label>
  <div class="row"><label for="msOut">Outdoor temperature</label><output id="msoOut"></output><input type="range" id="msOut" min="-15" max="115" step="1"></div>
  <label class="lsPick">Wall heads <select id="msHeads">${opt([[1,"1 head (single zone)"],[2,"2 heads (multi-zone)"],[3,"3 heads (multi-zone)"],[4,"4 heads (multi-zone)"]],PREF.heads)}</select></label>
  <div id="msSps"></div>
  <label class="lsPick">Indoor fan <select id="msFan">${opt([["auto","Auto"],["high","High"],["med","Medium"],["low","Low"]],PREF.fan)}</select></label>
  <label class="lsPick">Refrigerant <select id="msRef">${opt([["R-410A","R-410A"],["R-32","R-32"]],PREF.ref)}</select></label>
  <label class="lsChk"><input type="checkbox" id="msHyp"${PREF.hyper?" checked":""}> Hyper-heat / low-ambient model (runs to 130 Hz)</label>
  <label class="lsChk"><input type="checkbox" id="msTh"${PREF.therm?" checked":""}> Show the thermistors</label></div>
 <div class="group"><h3>Install</h3>
  <div class="row"><label for="msLen">Line set length</label><output id="msoLen"></output><input type="range" id="msLen" min="10" max="75" step="1"></div>
  <div class="row"><label for="msAdd">Refrigerant added at install</label><output id="msoAdd"></output><input type="range" id="msAdd" min="0" max="20" step="1"></div>
  <p class="note" id="msChg"></p></div>
 <div class="group"><h3>Break it</h3><select id="msF" aria-label="Fault">${opt(MS.FAULTS,PREF.fault)}</select></div>
 <details class="group"><summary>Inside the model</summary><div class="reads lsReads" id="msIn"></div></details></div></div>`;
 const restart=()=>{SIM=fresh(PREF);SIM.R=MS.solve(SIM);draw(true)};
 const spRows=()=>{$("msSps").innerHTML=Array.from({length:SIM.heads},(_,i)=>`<div class="row"><label for="msSp${i}">Setpoint${SIM.heads>1?", zone "+MS.ZN[i]:""}</label><output id="msoSp${i}">${SIM.sp[i]}°F</output><input type="range" id="msSp${i}" data-z="${i}" min="60" max="86" step="1" value="${SIM.sp[i]}"></div>`).join("")};
 const syncInputs=()=>{$("msOut").value=SIM.tout;$("msoOut").textContent=SIM.tout+"°F";$("msLen").value=SIM.len;$("msoLen").textContent=SIM.len+" ft";$("msAdd").value=SIM.add;$("msoAdd").textContent=SIM.add+" oz";
  const need=PEROZ*Math.max(0,SIM.len-PRELEN)*SIM.heads;$("msChg").innerHTML=`Factory charge covers ${PRELEN} ft per head. This line set needs <b>${f1(need)} oz</b> added (${PEROZ} oz per foot over ${PRELEN}). Added: ${SIM.add} oz. Charge now ${f0(SIM.charge*100)}% of what the system needs.`;spRows()};
 function draw(full){const S=SIM,R=S.R||MS.solve(S);const now=Date.now();
  if(full||now-lastScene>900){lastScene=now;$("msSvg").innerHTML=MS.scene(S,R,{therm:PREF.therm});$("msTr").innerHTML=trend(S)}
  $("msR").innerHTML=K.reads(readsOf(S,R));
  $("msIn").innerHTML=K.reads([["True charge",f0(S.charge*100)+"%"],["Frost on outdoor coil",f0(S.frost*100)+"%"],["Drain pan",f0(Math.min(1,S.pan)*100)+"%"],["Evaporating",f1(R.Te)+"°F"],["Condensing",f1(R.Tc)+"°F"],["Sim time",f0(S.t/60)+" min"]]);
  $("msWhy").innerHTML=whyNote(S,R)}
 const tick=()=>{if(!SPD)return;SIM.R=stepN(SIM,SPD*0.25);draw(false)};
 el.addEventListener("input",e=>{const t=e.target,S=SIM;
  if(t.id==="msOut"){S.tout=PREF.tout=+t.value;$("msoOut").textContent=t.value+"°F"}
  if(t.dataset.z!=null){const i=+t.dataset.z;S.sp[i]=+t.value;if(i===0)PREF.sp=+t.value;$("msoSp"+i).textContent=t.value+"°F"}
  if(t.id==="msLen"||t.id==="msAdd"){S.len=PREF.len=+$("msLen").value;S.add=PREF.add=+$("msAdd").value;setCharge(S);syncInputs()}
  savePref();S.R=MS.solve(S);draw(true)});
 el.addEventListener("change",e=>{const t=e.target,S=SIM;
  if(t.id==="msMode"){PREF.mode=S.mode=t.value;S.I=0;S.defrost=0;S.frost=0;if(t.value==="heat"&&PREF.tout>65){PREF.tout=S.tout=35}if(t.value==="cool"&&PREF.tout<70){PREF.tout=S.tout=95}PREF.sp=t.value==="heat"?70:74;S.sp=S.sp.map(()=>PREF.sp);PREF.tin=t.value==="heat"?62:80;S.tin=S.tin.map(()=>PREF.tin);S.hist=[];syncInputs()}
  if(t.id==="msHeads"){PREF.heads=S.heads=+t.value;S.on=S.on.map(()=>true);setCharge(S);syncInputs()}
  if(t.id==="msFan")PREF.fan=S.fan=t.value;
  if(t.id==="msRef")PREF.ref=S.ref=t.value;
  if(t.id==="msHyp")PREF.hyper=S.hyper=t.checked;
  if(t.id==="msTh")PREF.therm=t.checked;
  if(t.id==="msF"){PREF.fault=S.fault=t.value;S.code=null;S.lock=0;S.shHi=0;S.pan=0;setCharge(S);syncInputs()}
  savePref();S.R=MS.solve(S);draw(true)});
 el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.dataset.spd!=null){SPD=+b.dataset.spd;el.querySelectorAll("[data-spd]").forEach(x=>x.classList.toggle("blue",x===b))}
  if(b.id==="msReset"){restart();syncInputs()}});
 restart();syncInputs();if(timer)clearInterval(timer);timer=setInterval(tick,250)}
function whyNote(S,R){const f=S.fault,cool=S.mode==="cool";
 if(S.code)return `<b>${S.code}</b>: ${MS.CODES[S.code]}. The board stopped the compressor to protect it. Look the code up in that brand's service manual; the numbers differ between brands.`;
 if(S.defrost)return "Defrost: the reversing valve switched to cooling, the outdoor fan stopped and hot gas melts the frost off the outdoor coil. The indoor fan stays off so it doesn't blow cold air. It switches back in a few minutes.";
 if(R.off)return S.on.some((o,i)=>o&&i<S.heads)?"Starting up.":"Every zone is satisfied, so the compressor is off. An inverter usually slows down instead of shutting off; it only stops when even its lowest speed is more than the room needs.";
 if(R.steps>=470&&R.sh>15)return "The EEV is wide open and superheat is still high: the board can't feed the coil. Think low charge or a restriction.";
 if(cool&&R.sh<2)return "Superheat near zero: liquid is reaching the compressor. On an EEV unit that points at a valve stuck open or a bad coil sensor.";
 if(S.Hz>=(S.hyper?129:99))return "Compressor at full speed: the rooms need more than the unit can give right now.";
 return `The board is holding the room by changing compressor speed (${f0(S.Hz)} Hz) and the EEV is holding about ${f0(cool?R.sh:8)}°F superheat at the coil.`}

/* ---------- service calls ---------- */
const CALLS=[
 {t:"Runs all day, never catches up",say:"A customer says the bedroom unit runs nonstop on hot afternoons and the room sits at 79°F.",f:"low",o:{tout:95},acts:[["Bubble the flare nuts",()=>"No bubbles at the outdoor flares. The indoor flares are behind the head."],["Look at the service valves",()=>"A faint oily ring on the gas line flare at the indoor unit."],["Compare EEV steps to the manual",()=>"The board shows the EEV near fully open."]],why:"High superheat with the EEV wide open and almost no subcooling: the system is short of refrigerant. Find the leak (often a flare) and fix it, pull a vacuum, and weigh in the full charge."},
 {t:"Ice on the indoor coil",say:"The head drips and the air coming out is weak. You see frost on the top of the coil.",f:"dirtyIn",o:{tout:92},acts:[["Pull the filters",()=>"Filters are grey with lint and pet hair."],["Look at the blower wheel",()=>"The blower wheel blades are caked with dirt; very little air comes out."]],why:"Low suction with normal superheat and normal subcooling: the coil isn't getting air, so the refrigerant can't pick up heat and the coil freezes. Clean the filters, coil and blower wheel, then thaw it before checking again."},
 {t:"Unit stops with a code every few minutes",say:"A brand-new install. The heads show a code and nothing runs.",f:"comm",o:{tout:88},acts:[["Check the interconnect",()=>"S1 and S2 are swapped at the outdoor terminal block."],["Measure S2 to S3 (with care)",()=>"The signal reading is erratic, not the steady pulsing it should be."]],why:"A communication error means the indoor and outdoor boards can't talk. Check the interconnect wire: the right terminals, tight screws, the right size and no splices. Power down before touching the terminals."},
 {t:"Water on the wall",say:"Water runs down the wall under the head and the unit just shut off.",f:"drain",o:{tout:90},acts:[["Look at the drain line",()=>"The drain line is pinched where it goes through the wall."],["Check the condensate pump",()=>"The float in the pan is up and the pump isn't running."]],why:"The float switch caught a full pan and stopped cooling. Clear the line or fix the pump, and make sure the line slopes down all the way."},
 {t:"Too warm, but the unit acts satisfied",say:"The living room is warm but the head slows down like it's at setpoint.",f:"thermRoom",o:{tout:94},acts:[["Read the room sensor",()=>"A thermometer at the head reads 80°F; the board shows 74°F."],["Measure the thermistor",()=>"Resistance is off from the chart for 80°F; it reads like a cooler room."]],why:"The room thermistor reads low, so the board thinks the room is cooler than it is. Check its resistance against the manufacturer's chart and replace it."},
 {t:"New install, starved coil",say:"Just installed with a long line set routed behind a cabinet. Cooling is weak.",f:"kink",o:{tout:95},acts:[["Feel the liquid line",()=>"The liquid line is cold and sweating past a sharp bend behind the cabinet."],["Check subcooling",()=>"Subcooling is high: liquid is piling up behind something."]],why:"High superheat with high subcooling is a restriction. Here the liquid line was kinked during the install. Replace the damaged section; don't try to bend it back."},
 {t:"Trips on a hot afternoon",say:"The outdoor unit runs hot and the customer says it 'smells hot' by late afternoon.",f:"dirtyOut",o:{tout:105},acts:[["Look at the outdoor coil",()=>"The coil face is matted with cottonwood fluff and grass clippings."],["Check the clearance",()=>"A bush is growing against the coil."]],why:"Head pressure and discharge temperature are high with normal superheat and subcooling: the outdoor coil can't reject the heat. Clean it and clear the plants away."},
 {t:"High bills after another tech 'topped it off'",say:"Last month another company added refrigerant without weighing it.",f:"over",o:{tout:95},acts:[["Read the nameplate",()=>"Factory charge with a 25 ft line set, 0.2 oz per foot beyond that."],["Measure the line set",()=>"The line set is only 15 ft long."]],why:"High head pressure and high subcooling: too much refrigerant is backed up in the condenser. Recover it all and weigh in the nameplate charge."},
 {t:"Cold air in heating",say:"In heating mode the head blows cool air and shows a code after a while.",f:"thermCoil",o:{mode:"heat",tout:35,sp:70,tin:62},acts:[["Ohm the indoor coil thermistor",()=>"Open: infinite resistance."]],why:"The board needs the indoor coil sensor to run (and to stop cold air in heating). With it open, it shows a sensor code and won't run. Replace the thermistor."},
 {t:"One room freezes when the other calls",say:"A two-zone system. When the office calls for cooling, the bedroom gets cold instead.",f:"cross",o:{heads:2,tout:92,tin:78},acts:[["Trace the line sets",()=>"Port A's line set goes to the bedroom; zone A's wire goes to the office."],["Run each zone alone",()=>"Calling the office makes the bedroom's coil get cold."]],why:"On a multi-zone, the line set and the interconnect wire for each port must go to the same head. Here they're crossed. Many outdoor units have a wiring check mode that finds this."},
 {t:"Getting weaker every week",say:"Cooled fine at the start of summer, now it struggles.",f:"leak",o:{tout:98,mins:60,tin:82},start:0.8,acts:[["Electronic leak detector",()=>"Alarm at the indoor flare on the gas line."],["Check the flare",()=>"The flare face is off center and the nut is under-torqued."]],why:"Charge is dropping over time: a leak. A bad flare is the most common one on mini-splits. Recut the flare, torque to spec, pressure test and vacuum, then weigh in the charge."},
 {t:"Loud hiss, warm air, then a code",say:"The unit starts cooling, then gets warmer and warmer and shows a code.",f:"eevC",o:{tout:95,mins:40},acts:[["Check the EEV coil",()=>"The EEV coil is on, but the valve doesn't click through its steps at startup."],["Check subcooling",()=>"Subcooling is high: the liquid is stuck behind the valve."]],why:"The board is opening the EEV but the valve body is stuck nearly shut. High superheat and high subcooling, like any restriction. Test the coil and replace the valve body if it doesn't move."}];
let CI=0,SCORE={};try{SCORE=JSON.parse(localStorage.getItem("ms-calls")||"{}")}catch(e){}
const saveScore=()=>{try{localStorage.setItem("ms-calls",JSON.stringify(SCORE))}catch(e){}};
const callSim=c=>{const o={mode:"cool",sp:74,tin:80,heads:1,...c.o};const S=fresh({...o,fault:c.f});if(c.start)S.charge=c.start;
 let snap=null,R=null;const codes=[];
 for(let t=0;t<(o.mins||45)*60;t+=2){R=MS.step(S,2);if(S.code&&!codes.includes(S.code))codes.push(S.code);if(S.Hz>20&&!S.code&&!S.defrost){const {R:_r,hist:_h,...rest}=S;snap={S:JSON.parse(JSON.stringify(rest)),R}}}
 let out=S;if(snap&&(S.code||S.Hz<1)){out=snap.S;out.R=snap.R;out.hist=[]}else S.R=R;out.codes=codes;return out};
function mountCalls(el){
 const draw=()=>{const c=CALLS[CI],S=callSim(c),R=S.R,done=Object.keys(SCORE).length;
  el.innerHTML=`<div class="lsCase"><div class="drawing"><div class="scroller"><svg viewBox="0 0 900 520" role="img" aria-label="The system on this service call">${MS.scene(S,R,{therm:true})}</svg></div></div>
  <div><div class="group"><label class="lsPick">Service call <select id="mcSel">${CALLS.map((x,i)=>`<option value="${i}"${i===CI?" selected":""}>${i+1}. ${x.t}${SCORE[i]?" ✓":""}</option>`).join("")}</select></label>
   <p>${c.say}</p><div class="reads lsReads">${K.reads(readsOf(S,R))}</div>${S.codes.length?`<p class="note"><b>Code history:</b> ${S.codes.map(k=>k+" ("+MS.CODES[k]+")").join(", ")}.${S.code?"":" Readings above are from while it was still running."}</p>`:""}</div>
   <div class="group"><h3>Check</h3><div class="btns">${c.acts.map((a,i)=>`<button class="btn" data-act="${i}">${a[0]}</button>`).join("")}</div><div id="mcAct"></div></div>
   <div class="group"><label class="lsPick">What's causing it? <select id="mcPick"><option value="">Choose...</option>${MS.FAULTS.filter(f=>f[0]!=="none").map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</select></label>
   <div class="btns"><button class="btn blue" id="mcCheck">Check my answer</button><button class="btn" id="mcNext">Next call</button></div><div id="mcRes"></div>
   <p class="note">${done} of ${CALLS.length} solved.</p></div></div></div>`};
 el.addEventListener("change",e=>{if(e.target.id==="mcSel"){CI=+e.target.value;draw()}});
 el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const c=CALLS[CI];
  if(b.dataset.act!=null){const a=c.acts[+b.dataset.act];$("mcAct").insertAdjacentHTML("beforeend",`<p class="lsRes"><b>${a[0]}:</b> ${a[1]()}</p>`);b.disabled=true}
  if(b.id==="mcCheck"){const v=$("mcPick").value;if(!v){$("mcRes").innerHTML=`<p class="lsRes no">Pick a cause first.</p>`;return}
   const ok=v===c.f||(c.f==="leak"&&v==="low")||(c.f==="low"&&v==="leak");
   if(ok){SCORE[CI]=1;saveScore()}
   $("mcRes").innerHTML=`<p class="lsRes ${ok?"ok":"no"}">${ok?"Right. ":"Not quite. "}${ok?c.why:"Look again at superheat, subcooling, the EEV steps and any code. Then try the checks."}</p>`}
  if(b.id==="mcNext"){CI=(CI+1)%CALLS.length;draw()}});
 draw()}

/* ---------- error codes ---------- */
const CODEROWS=[["E1","Room (return air) thermistor open or shorted","Unplug and ohm it; compare to the resistance chart at room temperature. Check the plug on the board."],
 ["E2","Indoor coil thermistor open or shorted","Ohm it at the coil temperature. A bad coil sensor can also cause freeze-ups or cold blow in heating."],
 ["E3","Outdoor coil thermistor","Ohm it. A bad outdoor coil sensor can stop defrost from starting or ending."],
 ["E4","Discharge temperature too high","Check charge (low charge runs hot), a stuck EEV, a blocked outdoor coil. Check the discharge sensor is clipped on and insulated."],
 ["E5","Indoor-outdoor communication","Check the interconnect: right terminals, tight, no splices, correct wire size. Verify the supply voltage first. Power off before touching."],
 ["E6","Condensate float / drain pump","Clear the drain, check the pump runs, check the float moves freely."],
 ["E7","Outdoor fan motor","Check the fan spins freely, the connector, and the motor's feedback signal."],
 ["P1","High pressure or compressor overcurrent","Dirty outdoor coil, fan not running, overcharge, or a restriction. In heating: dirty indoor filter or blower."],
 ["P2","Refrigerant shortage suspected","The board saw high superheat or a big coil-to-room difference for too long. Leak check before adding refrigerant."]];
const BRANDS=[["Mitsubishi Electric (Trane)","https://www.mitsubishicomfort.com/"],["Daikin","https://www.daikinac.com/"],["Fujitsu","https://www.fujitsugeneral.com/us/"],["LG","https://lghvac.com/"]];
function mountCodes(el){
 el.innerHTML=`<div class="group"><p>These are <b>generic</b> codes used in this simulator. Every brand numbers its codes differently, and the same letters can mean different things on two brands. On a real call, read the code (the head's display, blinking LEDs on the outdoor board, or the remote's check mode) and look it up in that unit's service manual.</p>
 <div class="phScroll"><table class="lsTbl"><tr><th>Code</th><th>What the board saw</th><th>Check first</th></tr>${CODEROWS.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table></div></div>
 <div class="group"><h3>How boards report trouble</h3><ul><li><b>Head display or LED blinks</b>: count the blinks (for example, the operation lamp blinks 5 times, pauses, repeats).</li><li><b>Outdoor board LEDs</b>: many outdoor units have a 7-segment display or LED pattern behind the service panel. Some show live readings too.</li><li><b>Remote check mode</b>: many brands let you hold a button on the remote to step through stored codes.</li><li><b>Code history</b>: a code that has cleared may still be stored. Write down every code before you reset power.</li></ul></div>
 <div class="group"><h3>Manuals and code lists</h3><ul>${BRANDS.map(([n,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${n}</a>: search the model number for the service manual.</li>`).join("")}</ul></div>`}

window.__ms={get SIM(){return SIM},fresh,stepN,readsOf,CALLS,callSim};
window.LESSON={id:"ms-tool",sec:"Mini-splits",secHref:"/",title:"Mini-split simulator",lead:"An inverter heat pump with one to four wall heads. Change the weather and the setpoints, install it with a long line set, break it, and work service calls.",
 tabs:[{id:"sim",label:"Simulator",mount:mountSim},{id:"calls",label:"Service calls",mount:mountCalls},{id:"codes",label:"Error codes",mount:mountCodes}],steps:[],tasks:[],sources:[]};
})();
