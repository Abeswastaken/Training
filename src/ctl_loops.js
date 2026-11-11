/* ============ MORE LOOPS TAB: three plants with live, color-coded control loops ============
 Hot water loop (outdoor reset on a mixing valve + pump speed on differential pressure), a direct-fired makeup air unit
 (discharge air on a modulating gas valve, with its safety chain) and a relief fan holding building pressure.
 Each loop has one color: its sensor, signal lines, controller faceplate, actuator tag and trend all use it. */
(()=>{
const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*clamp(t,0,1);
const f0=x=>Math.round(x).toString(),f1=x=>(+x).toFixed(1),f2=x=>(+x).toFixed(2);
const COL={hws:"#d2452e",dp:"#2f6fd6",dat:"#d9730d",bp:"#8a4fd0"};
/* ---------- a PI (or P-only) controller ----------
 pb = change in the measured value that moves the output 0 to 100%. ti = reset time in minutes (0 = P only).
 dir +1: output rises when the reading is BELOW setpoint (heating valve, pump). dir -1: rises when ABOVE (relief fan). */
function mkLoop(o){return Object.assign({auto:true,hand:50,I:0,out:0,sp:0,pv:0,lo:0,hi:100,bias:0,hold:false},o,{pb0:o.pb,ti0:o.ti})}
function runLoop(L,sp,pv,dt){L.sp=sp;L.pv=pv;const kp=100/L.pb,P=kp*(sp-pv)*L.dir;
 if(L.hold){L.I=0;L.out=L.lo;return L.out}
 if(!L.auto){L.out=clamp(L.hand,L.lo,L.hi);L.I=L.ti>0?L.out-P-L.bias:0;return L.out}
 if(L.ti>0){L.I+=kp*(sp-pv)*L.dir*dt/(L.ti*60);L.I=clamp(L.I,L.lo-P-L.bias,L.hi-P-L.bias)}else L.I=0;
 L.out=clamp(L.bias+P+L.I,L.lo,L.hi);return L.out}

/* =====================================================================================
   1. HOT WATER LOOP
   Pump curve H = 80n² − 0.002Q² ft; piping 0.003Q²; zones 0.003Q²/D² (D = share of zone valves open).
   Design: 100 gpm at 60 ft. The DP sensor sits across the far zone. */
const HW={id:"hw",name:"Hot water loop",speed:60,win:1200,
 lead:"A boiler plant feeding zone coils through two-way valves. Two loops run at once and don't talk to each other: one holds the supply water temperature, the other holds the pressure across the far zone.",
 loops:[mkLoop({k:"hws",tag:"TIC-1",name:"Supply water temperature",pvn:"HWS",unit:"°F",outn:"Mixing valve",dir:1,pb:40,ti:2.5,d:0,range:[110,200],pbR:[5,120,1],tiR:[0,10,0.5],col:COL.hws}),
        mkLoop({k:"dp",tag:"DPIC-2",name:"Loop differential pressure",pvn:"DP",unit:" psi",outn:"Pump speed",dir:1,pb:25,ti:0.5,d:1,range:[0,25],pbR:[2,60,1],tiR:[0,5,0.1],col:COL.dp,lo:33})],
 conds:[{k:"oat",l:"Outdoor air",min:-10,max:70,step:1,v:30,u:"°F"},{k:"D",l:"Zone valves open",min:10,max:100,step:5,v:70,u:"%",note:"How much heat the building is asking for."},
        {k:"tb",l:"Boiler water",min:130,max:200,step:5,v:190,u:"°F"},{k:"dpsp",l:"DP setpoint",min:4,max:16,step:0.5,v:10,u:" psi"}],
 faults:[["vStuck","Mixing valve actuator stuck"],["oatOpen","Outdoor sensor failed (reads −40°F)"],["dpHigh","DP sensor reads 3 psi high"]],
 init(){return {t:0,v:0.5,n:0.8,Ts:160,TsS:160,Tr:140,dp:10,dpS:10,Q:70}},
 reset(oat){return lerp(180,140,oat/65)},
 step(dt){const S=this.S,V=this.V,F=this.F,[L1,L2]=this.loops,D=V.D/100;
  const oatS=F.oatOpen?-40:V.oat;S.oatS=oatS;
  const vc=runLoop(L1,this.reset(oatS),S.TsS,dt)/100;if(!F.vStuck)S.v+=clamp(vc-S.v,-dt/60,dt/60);
  const nc=runLoop(L2,V.dpsp,S.dpS,dt)/100;S.n+=clamp(nc-S.n,-dt*0.05,dt*0.05);
  S.Q=S.n*Math.sqrt(80/(0.005+0.003/(D*D)));S.dp=0.003/(D*D)*S.Q*S.Q/2.31;S.dpS+=(S.dp+(F.dpHigh?3:0)-S.dpS)*Math.min(1,dt/4);
  const raw=S.Tr+S.v*(V.tb-S.Tr);S.Ts+=(raw-S.Ts)*Math.min(1,dt/20);S.TsS+=(S.Ts-S.TsS)*Math.min(1,dt/15);
  const dT=clamp(0.2*(S.Ts-70)*D*100/Math.max(S.Q,8),0,Math.max(0,S.Ts-72));S.Tr+=(S.Ts-dT-S.Tr)*Math.min(1,dt/90);S.kw=Math.pow(S.n,3)*100},
 reads(){const S=this.S,[L1,L2]=this.loops;return [["Outdoor (sensor)",f0(S.oatS)+"°F"],["HWS setpoint",f0(L1.sp)+"°F",COL.hws],["HW supply",f0(S.TsS)+"°F",COL.hws],["HW return",f0(S.Tr)+"°F"],["Mixing valve",f0(S.v*100)+"%",COL.hws],["Loop DP",f1(S.dpS)+" psi",COL.dp],["Pump",f0(S.n*60)+" Hz",COL.dp],["Flow",f0(S.Q)+" gpm"],["Pump power",f0(S.kw)+"%"]]},
 tasks:[
  {t:"Design day. Set outdoor air to 0°F and let the red loop settle.",ok:s=>s.V.oat<=2&&s.loops[0].sp>=178&&Math.abs(s.S.TsS-s.loops[0].sp)<2,
   why:"Outdoor reset: the colder it is outside, the hotter the water. Here the schedule runs from 140°F water at 65°F outside to 180°F at 0°F. The loop does not care about the rooms at all; it only holds the water temperature the schedule asks for."},
  {t:"Night setback. Close the zone valves to 30% and wait for the blue loop.",ok:s=>s.V.D<=30&&Math.abs(s.S.dpS-s.V.dpsp)<0.4&&s.S.n<0.72,
   why:"As two-way valves close, flow drops and the pressure across the far zone rises. The loop slows the pump to bring it back. Pump power falls with the cube of speed, so a little speed is a lot of energy."},
  {t:"Put the pump loop in Hand at 100% with the valves at 30% open.",ok:s=>!s.loops[1].auto&&s.loops[1].hand>=99&&s.V.D<=30&&s.S.dpS>s.V.dpsp+4,
   why:"This is a pump left in Hand, or a drive in bypass. The valves now have to throttle against far more pressure than they need: they hunt, they whistle, and the pump burns power doing nothing useful."},
  {t:"Fail the outdoor sensor and watch the water temperature.",ok:s=>s.F.oatOpen&&s.loops[0].sp>=180&&s.S.TsS>s.reset(s.V.oat)+8,
   why:"The controller believes it is −40°F outside and resets the water to maximum. Nothing alarms on the loop itself: it is doing its job on a bad input. Always check the input a setpoint is calculated from."}],
 notes:["The reset schedule and the loop are two separate things: the schedule only picks the setpoint.","A non-condensing boiler must stay above about 140°F return water so flue gas does not condense in it. That is why the boiler runs hot and a mixing valve does the reset.","The DP sensor belongs out at the far zone, not at the pump. At the pump it would have to hold a much higher setpoint."],
 src:[["Hot water reset: 140 to 180°F as outdoor air falls from 64 to 0°F (Wikipedia)","https://en.wikipedia.org/wiki/Hot_water_reset"],["R.L. Deppmann: variable speed pumps and where the DP sensor goes","https://www.deppmann.com/blog/pumps/variable-speed-systems-types-of-sensors-part-1/"]],
 draw(){const S=this.S,V=this.V,F=this.F,[L1,L2]=this.loops,D=V.D/100;let s="";
  const hot=tcol(S.Ts),ret=tcol(S.Tr),bw=tcol(V.tb),fl=clamp(S.Q/100,0.05,1.2);
  // outdoors + sensor
  s+=`<rect x="640" y="20" width="110" height="300" fill="var(--lpSky)" rx="6"/><rect x="632" y="14" width="10" height="312" fill="url(#lpWall)"/>`+lbl(695,40,"OUTDOORS")+val(695,62,f0(V.oat)+"°F");
  s+=bub(662,110,"TT","0",L1.col)+sig(`M648 110 H600 V34 H402`,L1.col)+note(695,140,F.oatOpen?"sensor open":"outdoor sensor",F.oatOpen?"bad":"");
  // boiler
  s+=`<rect x="22" y="150" width="96" height="150" rx="6" fill="url(#lpJacket)" stroke="#3a2420"/><rect x="34" y="246" width="72" height="40" rx="3" fill="#15181a"/>`+flame(70,282,1)+`<rect x="30" y="160" width="80" height="20" rx="3" fill="#00000030"/>`+lbl(70,174,"BOILER","#fff")+val(70,214,f0(V.tb)+"°F","#fff");
  // pipes: boiler out -> mixing valve -> pump -> supply main -> zones -> return main -> boiler; bypass to valve
  s+=pipe(`M118 170 H178`,bw)+pipe(`M210 170 H262`,hot)+pipe(`M298 170 H540 V214`,hot)+pipe(`M540 276 V300 H118`,ret)+pipe(`M194 300 V186`,ret);
  [[360,0],[450,1]].forEach(([x])=>{s+=pipe(`M${x} 170 V214`,hot)+pipe(`M${x} 276 V300`,ret)});
  s+=flow(`M118 170 H178 M210 170 H262 M298 170 H540 V214`,fl)+flow(`M540 276 V300 H118`,fl)+(S.v<0.97?flow(`M194 300 V186`,fl*(1-S.v)):"");
  // zones: coil + 2-way valve; they close from the far end first
  [360,450,540].forEach((x,i)=>{const open=clamp(D*3-(2-i),0,1);s+=coil(x,236,ret)+valve2(x,264,open)+note(x+25,268,"Z"+(i+1)+" "+f0(open*100)+"%","","start")});
  // mixing valve (3-way) with actuator
  s+=valve3(194,170)+act(194,150,L1.col,F.vStuck)+tag(194,128,"TV-1",L1.col)+note(160,200,"A","")+note(226,200,"AB","")+note(206,196,"B","","start");
  // pump + VFD
  s+=pump(280,170)+`<rect x="262" y="100" width="36" height="30" rx="3" fill="url(#lpPlast)" stroke="#111"/><rect x="267" y="105" width="26" height="11" rx="1.5" fill="#0d1a12"/><text x="280" y="114" class="lpLcd">${f0(S.n*60)}Hz</text>`+tag(256,120,"VFD",L2.col,"end")+sig(`M280 130 V152`,L2.col);
  // supply temp sensor and DP sensor
  s+=bub(330,150,"TT","1",L1.col)+`<path d="M330 162 V170" stroke="${L1.col}" stroke-width="2.4"/>`;
  s+=bub(612,240,"DPT","2",L2.col)+`<path d="M612 228 V200 H546 M612 252 V290 H546" stroke="${L2.col}" stroke-width="1.6" fill="none"/>`+note(626,326,"DP sensor across the far zone","","end");
  // controller with two faceplates
  s+=`<rect x="300" y="16" width="210" height="62" rx="6" fill="url(#lpPlast)" stroke="#111" stroke-width="1.2"/>`+lbl(405,30,"DDC CONTROLLER","#cfd6da");
  s+=face(306,36,L1,98)+face(408,36,L2,98);
  s+=sig(`M330 138 V78`,L1.col)+sig(`M318 78 V88 H194 V112`,L1.col)+sig(`M621 231 L626 226 V96 H470 V78`,L2.col)+sig(`M440 78 V96 H298 V110`,L2.col,1);
  s+=lbl(30,326,"HW SUPPLY "+f0(S.Ts)+"°F",hot,"start")+lbl(300,326,"HW RETURN "+f0(S.Tr)+"°F",ret,"start");
  return s}};

/* =====================================================================================
   2. MAKEUP AIR UNIT (direct-fired, 400 MBH, 4,000 cfm: about 93°F of rise at full fire)
   Sequence and timers follow the CaptiveAire MUA manual defaults: 30 s pre-purge, 15 s low fire, 10 min freezestat timer.
   The freezestat (40°F) and high limit (180°F) trip points are trainer values. */
const MAU={id:"mau",name:"Makeup air unit",speed:10,win:300,
 lead:"A direct-fired makeup air unit replaces the air an exhaust fan throws away. One loop holds the discharge air temperature with a modulating gas valve. Everything else on the unit is a safety chain, not a loop.",
 loops:[mkLoop({k:"dat",tag:"TIC-3",name:"Discharge air temperature",pvn:"DAT",unit:"°F",outn:"Gas valve",dir:1,pb:60,ti:0.4,d:0,range:[20,120],pbR:[5,150,1],tiR:[0,3,0.1],col:COL.dat})],
 conds:[{k:"oat",l:"Outdoor air",min:-20,max:75,step:1,v:20,u:"°F"},{k:"sp",l:"Discharge setpoint",min:55,max:90,step:1,v:70,u:"°F"}],
 switches:[["run","Unit: on","Unit: off"]],
 faults:[["filter","Dirty filters (airflow down 35%)"],["gas","Low gas pressure (half fire at best)"],["flame","Flame rod dirty (no flame signal)"],["aps","Airflow switch tube off"],["sens","Discharge sensor reads 10°F low"]],
 init(){return {t:0,run:true,st:"off",ts:0,fan:0,gv:0,fire:0,Td:20,TdS:20,q:[],frz:0,lock:"",exh:false,cfm:0}},
 goto(st){this.S.st=st;this.S.ts=0},
 step(dt){const S=this.S,V=this.V,F=this.F,L=this.loops[0];S.ts+=dt;
  const full=4000*(F.filter?0.65:1);S.fan+=clamp((S.run&&!S.lock?1:0)-S.fan,-dt/4,dt/4);S.cfm=full*S.fan;
  const proved=S.fan>0.9&&!F.aps,call=V.oat<V.sp-2;
  if(!S.run||S.lock){if(S.st!=="off")this.goto("off")}
  else switch(S.st){
   case "off":if(S.fan>0.5)this.goto("prove");break;
   case "prove":if(proved)this.goto("purge");else if(S.ts>20){S.lock="No airflow proved. The burner will not try to light.";say(S.lock,"w")}break;
   case "purge":if(S.ts>=30)this.goto(call?"ign":"idle");break;
   case "idle":if(call)this.goto("ign");break;
   case "ign":if(S.ts>=6){if(F.flame){S.lock="Ignition failure: no flame signal. Flame safeguard locked out.";say(S.lock,"w")}else this.goto("low")}break;
   case "low":if(S.ts>=15)this.goto("mod");break;
   case "mod":if(!call&&L.out<=0.5&&S.ts>30)this.goto("idle");if(!proved){this.goto("off");say("Airflow lost: gas valves closed.","w")}break}
  S.exh=S.run&&!S.lock&&proved;
  L.hold=S.st!=="mod";const out=runLoop(L,V.sp,S.TsS??S.TdS,dt)/100;
  const want=S.st==="mod"?out:0;S.gv+=clamp(want-S.gv,-dt/10,dt/10);
  const lit=S.st==="low"||S.st==="mod";S.fire=lit?Math.min(F.gas?0.5:1,Math.max(0.05,S.gv)):0;
  const tgt=V.oat+S.fire*92.6*(4000/Math.max(S.cfm,1200))*(S.fan>0.2?1:0);S.Td+=(tgt-S.Td)*Math.min(1,dt/6);S.q.push([S.t,S.Td]);while(S.q.length>1&&S.q[1][0]<=S.t-5)S.q.shift();S.TdS+=(S.q[0][1]-(F.sens?10:0)-S.TdS)*Math.min(1,dt/12);S.TsS=S.TdS;
  if(S.Td>180&&!S.lock){S.lock="High temperature limit tripped. Manual reset.";say(S.lock,"w")}
  if(S.run&&!S.lock&&S.fan>0.9&&S.TdS<40&&S.st!=="prove"&&S.st!=="purge"){S.frz+=dt;if(S.frz>600){S.lock="Freezestat: discharge air stayed under 40°F for 10 minutes. Unit shut down.";say(S.lock,"w")}}else S.frz=0},
 stName(){return {off:"Off",prove:"Proving airflow",purge:"Pre-purge",idle:"Fan only (no call for heat)",ign:"Ignition trial",low:"Low fire hold",mod:"Modulating"}[this.S.st]},
 reads(){const S=this.S,L=this.loops[0];return [["State",S.lock?"LOCKED OUT":this.stName()],["Outdoor",f0(this.V.oat)+"°F"],["Discharge (sensor)",f1(S.TdS)+"°F",L.col],["Setpoint",f0(L.sp)+"°F",L.col],["Gas valve",f0(S.gv*100)+"%",L.col],["Firing rate",f0(S.fire*100)+"%"],["Airflow",f0(S.cfm)+" cfm"],["Exhaust fan",S.exh?"running":"off"]]},
 resets(){const S=this.S;return S.lock?[["Reset lockout",()=>{S.lock="";S.frz=0;this.goto("off");say("Lockout reset.")}]]:[]},
 tasks:[
  {t:"Let the unit start and settle within 1°F of setpoint.",ok:s=>s.S.st==="mod"&&Math.abs(s.S.TdS-s.V.sp)<1&&s.S.ts>60,
   why:"Watch the order: fan, airflow proved, 30 second pre-purge, ignition, 15 seconds at low fire, and only then does the orange loop get the gas valve. Until then the loop's output is held at zero."},
  {t:"Drop outdoor air to −10°F.",ok:s=>s.V.oat<=-8&&s.S.st==="mod"&&s.S.gv>0.8&&Math.abs(s.S.TdS-s.V.sp)<1.5,
   why:"The loop does not know it got colder. It only sees the discharge sensor fall, and it opens the gas valve until the reading comes back. That is the whole idea of feedback."},
  {t:"Narrow the proportional band until the discharge hunts, then widen it until it is steady again.",ok:(s,m)=>{const L=s.loops[0];if(L.pb<=12&&s.S.st==="mod")m.hunted=true;return !!m.hunted&&L.pb>=30&&s.S.st==="mod"&&Math.abs(s.S.TdS-s.V.sp)<1},
   why:"A burner changes the air temperature within seconds, so this is a fast loop and it needs a wide band. Too narrow and the valve slams between low and high fire."},
  {t:"Turn on Dirty filters and Low gas pressure together on a −10°F day.",ok:s=>s.F.filter&&s.F.gas&&s.V.oat<=-8&&s.S.st==="mod"&&s.loops[0].out>=99,
   why:"The output is pinned at 100% and the loop is out of authority. Low airflow alone can hide it, because the same flame makes hotter air. With half the gas on a cold day it cannot reach setpoint. A loop stuck at 100% is telling you the equipment can't deliver, not that the tuning is wrong."}],
 notes:["Direct-fired means the flame is in the airstream. All of the heat goes into the air, and so do the products of combustion, which is why these units only serve spaces with exhaust.","The exhaust fan is interlocked: here it starts after makeup airflow is proved.","Timers shown are one manufacturer's defaults. Use the unit's own wiring diagram and settings."],
 src:[["CaptiveAire industrial MUA manual: modulating gas valve, pre-purge, low fire time, freezestat timer, exhaust interlock","https://www.captiveaire.com/manuals/MakeUpAir/IndustrialMua_Manual.pdf"]],
 draw(){const S=this.S,V=this.V,F=this.F,L=this.loops[0];let s="";const air=tcol(S.Td),oa=tcol(V.oat);
  s+=`<rect x="10" y="232" width="740" height="10" fill="url(#lpWall)"/>`+lbl(26,226,"ROOF","var(--muted)","start");
  // exhaust fan (interlocked)
  s+=`<rect x="640" y="196" width="70" height="36" rx="4" fill="url(#lpMetal)" stroke="#59626a"/><path d="M632 196 h86 l-12 -18 h-62z" fill="url(#lpMetal)" stroke="#59626a"/>`+fanWheel(675,214,13,S.exh)+lbl(675,168,"EXHAUST FAN")+note(675,318,S.exh?"running (interlock made)":"off");
  if(S.exh)s+=arrow(`M675 300 V246`,"var(--muted)")+arrow(`M675 176 V140`,"var(--muted)");
  // MAU cabinet cutaway
  s+=`<rect x="110" y="110" width="430" height="122" rx="6" fill="url(#lpCab)" stroke="#4d565c" stroke-width="1.4"/><rect x="118" y="118" width="414" height="106" rx="3" fill="url(#lpIn)"/>`;
  s+=`<path d="M110 120 h-46 l-22 34 v60 h68z" fill="url(#lpMetal)" stroke="#59626a"/>`+[0,1,2,3].map(i=>`<path d="M48 ${164+i*12} h56" stroke="#3d464c" stroke-width="3"/>`).join("")+lbl(74,104,"INTAKE HOOD");
  s+=`<rect x="134" y="124" width="14" height="94" fill="url(#lpFilter)" stroke="${F.filter?"#6b4a1e":"#7c868c"}"/>`+note(141,104,F.filter?"filters dirty":"filters",F.filter?"bad":"");
  // burner + flame
  s+=`<rect x="232" y="150" width="14" height="44" rx="2" fill="#2a2f33"/>`+(S.fire>0?[158,172,186].map(y=>`<path d="M246 ${y} q${10+S.fire*46} -5 ${16+S.fire*62} 0 q${-6-S.fire*16} 5 ${-16-S.fire*62} 0z" fill="#3f8cf0" opacity=".85"/><path d="M246 ${y} q${6+S.fire*26} -2.6 ${9+S.fire*34} 0 q-4 2.6 ${-9-S.fire*34} 0z" fill="#ffd166" opacity="${0.25+S.fire*0.7}"/>`).join(""):"")+(S.st==="ign"?`<circle cx="250" cy="172" r="4" fill="#ffe08a"/>`:"")+lbl(239,142,"BURNER","#cfd6da");
  s+=`<path d="M252 196 l14 12" stroke="#d9d9d9" stroke-width="2"/>`+dot(268,210,F.flame?"var(--bad)":S.fire>0?"var(--ok)":"#7c868c")+note(292,216,"flame rod","","start","#cfd6da");
  // gas train with modulating valve
  s+=pipe(`M239 300 V194`,"#c9a227",5)+valve2(239,262,S.gv,"#c9a227")+act(239,262,L.col,false,1)+tag(206,262,"GV-3",L.col,"end")+`<rect x="231" y="282" width="16" height="12" rx="2" fill="url(#lpPlast)" stroke="#111"/>`+note(254,292,"safety shutoff valves","","start")+lbl(239,318,"GAS");
  // fan
  s+=`<rect x="388" y="130" width="96" height="84" rx="8" fill="url(#lpMetal)" stroke="#59626a"/>`+fanWheel(436,172,32,S.fan>0.1)+lbl(436,222,"SUPPLY FAN","#cfd6da");
  // airflow switch, high limit, discharge sensor
  s+=dot(352,128,F.aps?"var(--bad)":S.fan>0.9?"var(--ok)":"#7c868c")+note(352,104,"airflow switch",F.aps?"bad":"");
  s+=`<path d="M540 172 H590 V300" stroke="url(#lpDuct)" stroke-width="44" fill="none" stroke-linejoin="round"/>`+bub(590,206,"TT","3",L.col)+note(624,292,"to the space","","start");
  s+=flowA(`M30 190 H120`,oa,S.fan)+flowA(`M160 172 H220`,oa,S.fan)+flowA(`M320 172 H380`,air,S.fan)+flowA(`M590 250 V306`,air,S.fan);
  s+=val(590,330,f1(S.Td)+"°F",air);
  // controller
  s+=`<rect x="280" y="14" width="150" height="62" rx="6" fill="url(#lpPlast)" stroke="#111" stroke-width="1.2"/>`+lbl(355,28,"MUA CONTROL BOARD","#cfd6da")+face(308,34,L);
  s+=sig(`M602 206 H616 V88 H438 V60 H430`,L.col)+sig(`M290 60 H222 V262 H228`,L.col,1);
  // safety chain lamps
  const ch=[["Fan",S.fan>0.9],["Airflow",S.fan>0.9&&!F.aps],["Purge",["idle","ign","low","mod"].includes(S.st)],["Flame",S.fire>0&&!F.flame],["Limits",!S.lock]];
  s+=`<rect x="446" y="14" width="236" height="62" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>`+lbl(564,28,"SAFETY CHAIN (NOT A LOOP)")+ch.map(([n,on],i)=>dot(474+i*45,46,on?"var(--ok)":"#7c868c")+note(474+i*45,66,n)).join("");
  s+=val(40,330,"Outdoor "+f0(V.oat)+"°F","var(--ink)","start")+(S.lock?`<text x="400" y="258" class="lpL" style="fill:var(--bad);text-anchor:middle">${S.lock.toUpperCase()}</text>`:lbl(400,258,this.stName().toUpperCase(),"var(--muted)"));
  return s}};

/* =====================================================================================
   3. RELIEF FAN ON BUILDING PRESSURE (ASHRAE Guideline 36 relief fan sequence)
   P-only loop, setpoint 0.05 in. w.c., minimum speed 10%, start above min + 15% for 7 min, stop below min for 5 min.
   G36 averages the pressure over 5 minutes; the trainer uses 1 minute so the response is visible. */
const REL={id:"rel",name:"Exhaust / relief fan",speed:60,win:1800,
 lead:"When an air handler brings in more outdoor air than the building's exhaust fans remove, the building pressurizes and doors blow open. A relief fan on a drive holds building pressure. This loop is proportional only, the way ASHRAE Guideline 36 writes it.",
 loops:[mkLoop({k:"bp",tag:"PIC-4",name:"Building static pressure",pvn:"Building",unit:" in.",outn:"Relief fan",dir:-1,pb:0.05,ti:0,d:3,range:[-0.02,0.2],pbR:[0.01,0.2,0.005],tiR:[0,10,0.5],col:COL.bp})],
 conds:[{k:"oa",l:"Outdoor air damper",min:15,max:100,step:5,v:20,u:"%",note:"20% is minimum ventilation. 100% is economizer (free cooling)."},{k:"sp",l:"Pressure setpoint",min:0.02,max:0.1,step:0.005,v:0.05,u:" in."}],
 switches:[["doors","Loading dock doors: open","Loading dock doors: shut"]],
 faults:[["damper","Relief damper stuck shut"],["tube","Outdoor reference tube plugged (reads 0.06 in. high)"]],
 init(){return {t:0,doors:false,P:0.03,Ps:0.03,on:false,n:0,tHi:0,tLo:0,dmp:0}},
 step(dt){const S=this.S,V=this.V,F=this.F,L=this.loops[0];
  const out=runLoop(L,V.sp,S.Ps,dt);
  if(L.auto){if(!S.on){S.tHi=out>25?S.tHi+dt:0;if(S.tHi>=420){S.on=true;S.tHi=0;say("Loop output above 25% for 7 minutes: relief fan started.")}}
   else{S.tLo=out<10?S.tLo+dt:0;if(S.tLo>=300){S.on=false;S.tLo=0;say("Loop output under minimum speed for 5 minutes: relief fan stopped.")}}}
  else S.on=L.hand>0;
  const nc=S.on?Math.max(0.10,out/100):0;S.n+=clamp(nc-S.n,-dt*0.05,dt*0.05);
  S.dmp+=clamp((out>5&&!F.damper?1:0)-S.dmp,-dt/30,dt/30);
  S.qoa=20000*V.oa/100;S.qrel=S.n*18000*S.dmp;const net=S.qoa-1500-S.qrel,C=22000*(S.doors?2.5:1);
  const pt=Math.sign(net)*Math.pow(Math.abs(net)/C,1/0.65);S.P+=(pt-S.P)*Math.min(1,dt/8);S.Ps+=(S.P+(F.tube?0.06:0)-S.Ps)*Math.min(1,dt/60)},
 reads(){const S=this.S,L=this.loops[0];return [["Outdoor air in",f0(S.qoa)+" cfm"],["Toilet exhaust",'1500 cfm'],["Relief fan",S.on?f0(S.n*60)+" Hz":"off",L.col],["Relief air",f0(S.qrel)+" cfm",L.col],["Building (actual)",(S.P>=0?"+":"")+S.P.toFixed(3)+" in."],["Building (averaged)",(S.Ps>=0?"+":"")+S.Ps.toFixed(3)+" in.",L.col],["Setpoint",this.V.sp.toFixed(3)+" in.",L.col],["Loop output",f0(L.out)+"%",L.col]]},
 tasks:[
  {t:"Go to economizer: open the outdoor air damper to 100% and wait for the fan to start and settle.",ok:s=>s.V.oa>=100&&s.S.on&&s.S.n>0.5&&Math.abs(s.S.Ps-s.S.P)<0.004,
   why:"The fan does not start the moment the pressure rises. The output has to stay above minimum speed plus 15% for 7 minutes first, so a gust or an open door doesn't cycle it."},
  {t:"With the fan running at 100% outdoor air, read how far above setpoint the building sits.",ok:s=>s.V.oa>=100&&s.S.on&&s.loops[0].ti===0&&s.S.Ps>s.V.sp+0.015&&Math.abs(s.S.Ps-s.S.P)<0.004,
   why:"That gap is proportional offset (droop). A P-only loop needs an error to make an output: no error, no fan speed. The setpoint is where the fan starts to work, and the building settles a little above it."},
  {t:"Add reset: set the reset time to 2 minutes and watch the offset disappear.",ok:s=>s.loops[0].ti>0&&s.S.on&&s.V.oa>=80&&Math.abs(s.S.Ps-s.V.sp)<0.004,
   why:"Integral keeps moving the output until the error is gone. Guideline 36 leaves it out here on purpose: building pressure is noisy and a small offset does no harm, while integral on a noisy signal can wind up and hunt."},
  {t:"Plug the outdoor reference tube with the damper at 20%.",ok:s=>s.F.tube&&s.V.oa<=25&&s.S.P<0.012&&s.S.on,
   why:"The transmitter measures indoors against outdoors. With the outdoor tube plugged it reads high, so the fan runs when it shouldn't and pulls the building down to neutral. The slight positive pressure that keeps dust, humidity and cold drafts out is gone, and the controller still shows a normal reading."}],
 notes:["Building pressure is tiny: 0.05 in. w.c. is about 0.002 psi. The sensor needs a quiet indoor pickup and a wind-shielded outdoor reference.","Every cfm of outdoor air has to leave somehow: through exhaust fans, the relief fan, or cracks and doors.","The 7 and 5 minute timers keep the fan from short cycling."],
 src:[["ASHRAE Guideline 36 relief fan sequence (as implemented in the Modelica Buildings library): P-only, 0.05 in. w.c., 10% minimum, 7 min on / 5 min off","https://build.openmodelica.org/Documentation/Buildings.Controls.OBC.ASHRAE.G36.AHUs.MultiZone.VAV.SetPoints.ReliefFan.html"]],
 draw(){const S=this.S,V=this.V,F=this.F,L=this.loops[0];let s="";
  s+=`<rect x="10" y="20" width="740" height="290" fill="var(--lpSky)" rx="6"/><rect x="10" y="300" width="740" height="12" fill="#6f7a61"/>`;
  s+=`<rect x="120" y="120" width="520" height="182" fill="var(--paper)" stroke="url(#lpWall)" stroke-width="10"/>`+lbl(380,150,"BUILDING")+val(380,186,(S.P>=0?"+":"")+S.P.toFixed(3)+" in. w.c.",S.P>0.12||S.P<0?"var(--bad)":"var(--ink)");
  // AHU on the roof with OA damper
  s+=`<rect x="150" y="62" width="150" height="54" rx="5" fill="url(#lpCab)" stroke="#4d565c"/>`+lbl(240,84,"AIR HANDLER","#1d2327")+note(240,102,"20,000 cfm supply","","middle","#3d474d");
  s+=`<rect x="130" y="68" width="20" height="42" fill="url(#lpMetal)" stroke="#59626a"/>`+[0,1,2,3].map(i=>{const a=lerp(80,10,V.oa/100);return `<path d="M133 ${75+i*9} h14" stroke="#2a3135" stroke-width="2.4" transform="rotate(${a} 140 ${75+i*9})"/>`}).join("")+lbl(140,56,"OA DAMPER "+f0(V.oa)+"%");
  s+=flowA(`M40 89 H126`,"var(--cold)",V.oa/100+0.15)+flowA(`M225 116 V160`,"var(--cold)",0.8)+note(84,78,f0(S.qoa)+" cfm in");
  // toilet exhaust
  s+=`<rect x="330" y="96" width="34" height="20" rx="3" fill="url(#lpMetal)" stroke="#59626a"/>`+fanWheel(347,106,7,true)+arrow(`M347 92 V66`,"var(--muted)")+note(347,58,"toilet exhaust 1,500 cfm");
  // relief fan + damper + VFD
  s+=`<rect x="500" y="78" width="80" height="40" rx="4" fill="url(#lpMetal)" stroke="#59626a"/><path d="M492 78 h96 l-14 -18 h-68z" fill="url(#lpMetal)" stroke="#59626a"/>`+fanWheel(540,98,15,S.n>0.02)+lbl(540,50,"RELIEF FAN");
  s+=`<rect x="512" y="118" width="56" height="10" fill="#2a3135"/>`+[0,1,2,3].map(i=>`<path d="M${519+i*14} 123 h10" stroke="${F.damper?"var(--bad)":"#cfd6da"}" stroke-width="2.4" transform="rotate(${S.dmp*80} ${524+i*14} 123)"/>`).join("")+note(596,128,F.damper?"damper stuck shut":"relief damper",F.damper?"bad":"","start");
  if(S.qrel>200)s+=flowA(`M540 170 V132`,L.col,S.n)+arrow(`M540 56 V30`,L.col);
  s+=`<rect x="604" y="70" width="40" height="34" rx="3" fill="url(#lpPlast)" stroke="#111"/><rect x="609" y="76" width="30" height="12" rx="1.5" fill="#0d1a12"/><text x="624" y="86" class="lpLcd">${S.on?f0(S.n*60)+"Hz":"OFF"}</text>`+tag(624,62,"VFD",L.col)+sig(`M604 92 H582`,L.col,1);
  // leakage
  const lk=S.P>=0?1:-1;s+=`<rect x="114" y="236" width="12" height="60" fill="${S.doors?"var(--lpSky)":"#8a6a45"}" stroke="#4a3a25"/>`+note(96,228,S.doors?"dock doors open":"doors");
  if(Math.abs(S.P)>0.004)s+=(lk>0?arrow(`M118 266 H70`,"var(--muted)"):arrow(`M70 266 H118`,"var(--bad)"))+note(60,286,lk>0?"air leaks out":"air leaks IN",lk>0?"":"bad");
  // pressure transmitter: indoor pickup vs outdoor reference
  s+=bub(300,244,"PT","4",L.col)+`<path d="M288 244 H258" stroke="${L.col}" stroke-width="1.6"/><circle cx="256" cy="244" r="3" fill="${L.col}"/><path d="M300 257 V284 H690" stroke="${F.tube?"var(--bad)":L.col}" stroke-width="1.6" fill="none"/><path d="M690 276 v16 l10 -8z" fill="${F.tube?"var(--bad)":L.col}"/>`+note(256,264,"indoor pickup")+note(698,268,F.tube?"reference plugged":"outdoor reference",F.tube?"bad":"");
  // controller
  s+=`<rect x="470" y="206" width="122" height="62" rx="6" fill="url(#lpPlast)" stroke="#111" stroke-width="1.2"/>`+lbl(531,220,"DDC CONTROLLER","#cfd6da")+face(476,224,L,110);
  s+=sig(`M313 244 H470`,L.col)+sig(`M592 236 H664 V87 H646`,L.col,1);
  return s}};

/* ---------- drawing helpers ---------- */
const tcol=t=>{const k=clamp((t-40)/150,0,1);const a=[47,111,214],m=[150,120,160],b=[210,58,38];const c=k<.5?a.map((v,i)=>v+(m[i]-v)*k*2):m.map((v,i)=>v+(b[i]-v)*(k-.5)*2);return `rgb(${c.map(Math.round).join(",")})`};
const DEFS=`<defs>
<linearGradient id="lpMetal" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#eef1f3"/><stop offset=".45" stop-color="#b9c1c6"/><stop offset="1" stop-color="#7f898f"/></linearGradient>
<linearGradient id="lpCab" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e6eaec"/><stop offset="1" stop-color="#aab3b9"/></linearGradient>
<linearGradient id="lpIn" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a3136"/><stop offset="1" stop-color="#1a1f23"/></linearGradient>
<linearGradient id="lpPlast" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4a5257"/><stop offset="1" stop-color="#22282c"/></linearGradient>
<linearGradient id="lpJacket" x1="0" x2="1"><stop offset="0" stop-color="#6d3028"/><stop offset=".35" stop-color="#a34a3d"/><stop offset="1" stop-color="#5a251f"/></linearGradient>
<linearGradient id="lpWall" x1="0" x2="1"><stop offset="0" stop-color="#8d8172"/><stop offset=".5" stop-color="#c2b6a4"/><stop offset="1" stop-color="#857a6c"/></linearGradient>
<linearGradient id="lpDuct" x1="0" x2="1"><stop offset="0" stop-color="#9aa3a9"/><stop offset=".5" stop-color="#dfe4e7"/><stop offset="1" stop-color="#8c959b"/></linearGradient>
<linearGradient id="lpBrass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6dd8e"/><stop offset=".5" stop-color="#c99a3a"/><stop offset="1" stop-color="#7a5a16"/></linearGradient>
<pattern id="lpFilter" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#d9dccf"/><path d="M0 6 L6 0" stroke="#9aa08f" stroke-width="1"/></pattern>
<radialGradient id="lpHub"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#8d969c"/></radialGradient></defs>`;
const lbl=(x,y,t,c="var(--ink)",a="middle")=>`<text x="${x}" y="${y}" class="lpL" style="fill:${c};text-anchor:${a}">${t}</text>`;
const val=(x,y,t,c="var(--ink)",a="middle")=>`<text x="${x}" y="${y}" class="lpV" style="fill:${c};text-anchor:${a}">${t}</text>`;
const note=(x,y,t,cls="",a="middle",c)=>`<text x="${x}" y="${y}" class="lpN${cls?" "+cls:""}" style="text-anchor:${a}${c?";fill:"+c:""}">${t}</text>`;
const pipe=(d,c,w=9)=>`<path d="${d}" stroke="#30383d" stroke-width="${w+3}" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#fff" stroke-width="${w/4}" fill="none" stroke-linejoin="round" opacity=".28" transform="translate(-1.5 -1.5)"/>`;
const flow=(d,k)=>`<path d="${d}" class="lpFlow" style="animation-duration:${(1.6/Math.max(k,0.08)).toFixed(2)}s" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 12" fill="none" opacity=".8"/>`;
const flowA=(d,c,k)=>k>0.05?`<path d="${d}" class="lpFlow" style="animation-duration:${(1.2/Math.max(k,0.1)).toFixed(2)}s" stroke="${c}" stroke-width="5" stroke-dasharray="12 10" stroke-linecap="round" fill="none"/>`:"";
let aid=0;const arrow=(d,c)=>{const id="lpAr"+(aid++%40);return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker></defs><path d="${d}" stroke="${c}" stroke-width="2.4" fill="none" marker-end="url(#${id})"/>`};
/* signal line: dashed, in the loop's color; out=1 marks controller-to-actuator (arrowhead) */
const sig=(d,c,out)=>{const id="lpSg"+(aid++%40);return (out?`<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker></defs>`:"")+`<path d="${d}" stroke="${c}" stroke-width="2" stroke-dasharray="6 4" fill="none"${out?` marker-end="url(#${id})"`:""}/>`};
/* instrument bubble (sensor / transmitter) */
const bub=(x,y,a,n,c)=>`<circle cx="${x}" cy="${y}" r="13" fill="var(--paper)" stroke="${c}" stroke-width="3"/><text x="${x}" y="${y-1}" class="lpB" style="fill:${c}">${a}</text><text x="${x}" y="${y+9}" class="lpB" style="fill:${c};font-size:8px">${n}</text>`;
const tag=(x,y,t,c,a="middle")=>`<text x="${x}" y="${y}" class="lpB" style="fill:${c};text-anchor:${a};font-size:11px">${t}</text>`;
const dot=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="#111" stroke-width="1"/><circle cx="${x-2}" cy="${y-2}" r="1.6" fill="#fff" opacity=".6"/>`;
const act=(x,y,c,stuck,side)=>side?`<rect x="${x-24}" y="${y-9}" width="16" height="18" rx="3" fill="${c}" stroke="#111"/><path d="M${x-8} ${y} h8" stroke="#111" stroke-width="2.5"/>`:`<path d="M${x} ${y+12} v-8" stroke="#111" stroke-width="3"/><rect x="${x-13}" y="${y-12}" width="26" height="18" rx="3" fill="${stuck?"var(--bad)":c}" stroke="#111"/><rect x="${x-9}" y="${y-8}" width="18" height="4" rx="1" fill="#fff" opacity=".35"/>`;
const valve3=(x,y)=>`<path d="M${x-16} ${y-9} L${x} ${y} L${x-16} ${y+9}z M${x+16} ${y-9} L${x} ${y} L${x+16} ${y+9}z M${x-9} ${y+16} L${x} ${y} L${x+9} ${y+16}z" fill="url(#lpBrass)" stroke="#5c4410" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="4" fill="#5c4410"/>`;
const valve2=(x,y,open,c)=>`<path d="M${x-8} ${y-9} L${x} ${y} L${x-8} ${y+9}z M${x+8} ${y-9} L${x} ${y} L${x+8} ${y+9}z" transform="rotate(90 ${x} ${y})" fill="${open>0.02?"url(#lpBrass)":"#6a6f73"}" stroke="#5c4410" stroke-width="1.1"/><rect x="${x+9}" y="${y-5}" width="12" height="10" rx="2" fill="${open>0.02?"var(--ok)":"#7c868c"}" stroke="#111" stroke-width=".8"/>`;
const coil=(x,y,c)=>`<rect x="${x-18}" y="${y-22}" width="36" height="34" rx="3" fill="url(#lpMetal)" stroke="#59626a"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${x-14+i*5.6} ${y-19} v28" stroke="#7c868c" stroke-width="1"/>`).join("")+`<path d="M${x} ${y-22} v6 h-12 v8 h24 v8 h-12 v6" stroke="${c}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
const pump=(x,y)=>`<circle cx="${x}" cy="${y}" r="18" fill="url(#lpMetal)" stroke="#3d464c" stroke-width="1.4"/><path d="M${x-9} ${y-10} L${x+12} ${y} L${x-9} ${y+10}z" fill="#3d464c"/><rect x="${x-10}" y="${y-34}" width="20" height="18" rx="3" fill="url(#lpPlast)" stroke="#111"/>`;
const fanWheel=(x,y,r,on)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#1c2125" stroke="#59626a"/><g class="${on?"lpSpin":""}" style="transform-origin:${x}px ${y}px">${[0,1,2,3,4,5].map(i=>`<path d="M${x} ${y} q${r*.5} ${-r*.25} ${r*.86} ${-r*.3} l${-r*.1} ${r*.34}z" fill="#aab3b9" transform="rotate(${i*60} ${x} ${y})"/>`).join("")}</g><circle cx="${x}" cy="${y}" r="${r*.22}" fill="url(#lpHub)"/>`;
const flame=(x,y,k)=>`<path d="M${x-22} ${y} q4 -18 10 -6 q5 -24 12 -4 q6 -16 10 0 q5 -10 12 10z" fill="#ff8a3d"/><path d="M${x-12} ${y} q4 -10 8 -3 q4 -12 8 -1 q4 -7 8 4z" fill="#ffd166"/>`;
/* controller faceplate inside the drawing */
const face=(x,y,L,w=94)=>`<rect x="${x}" y="${y}" width="${w}" height="38" rx="3" fill="#0d1a12" stroke="${L.col}" stroke-width="2.5"/><rect x="${x}" y="${y}" width="6" height="38" fill="${L.col}"/><text x="${x+11}" y="${y+12}" class="lpLcd" style="text-anchor:start;fill:${L.col==="#2f6fd6"?"#8fb8ff":L.col==="#8a4fd0"?"#cba6ff":L.col==="#d2452e"?"#ff9c8a":"#ffc27a"}">${L.tag}${L.auto?"":" HAND"}</text><text x="${x+11}" y="${y+23}" class="lpLcd" style="text-anchor:start">SP ${L.sp.toFixed(L.d)} PV ${L.pv.toFixed(L.d)}</text><text x="${x+11}" y="${y+34}" class="lpLcd" style="text-anchor:start">OUT ${f0(L.out)}%</text>`;

/* ---------- page ---------- */
const SYS={hw:HW,mau:MAU,rel:REL};let cur=HW,running=true,speed=60,raf=0,last=0,logs=[],hist={},marks={};
function say(m,c=""){logs.unshift([m,c]);if(logs.length>6)logs.pop();const el=$("lpLog");if(el)el.innerHTML=logs.map(([t,k])=>`<div class="${k}">${t}</div>`).join("")}
function resetSys(s){s.S=s.init();s.V={};s.conds.forEach(c=>s.V[c.k]=c.v);s.F={};s.faults.forEach(f=>s.F[f[0]]=false);s.loops.forEach(L=>{L.auto=true;L.I=0;L.pb=L.pb0;L.ti=L.ti0;L.hand=50});s.done={};s.memo={};hist[s.id]=s.loops.map(()=>[]);for(let i=0;i<120;i++){s.S.t+=1;s.step(1)}}
Object.values(SYS).forEach(resetSys);
function sample(){const s=cur,H=hist[s.id];s.loops.forEach((L,i)=>{H[i].push([s.S.t,L.pv,L.sp,L.out]);while(H[i].length&&H[i][0][0]<s.S.t-s.win)H[i].shift()})}
function trend(){const s=cur,n=s.loops.length,W=760,h=n>1?150:230,pad={l:46,r:44,t:18,b:22};let o="";
 s.loops.forEach((L,i)=>{const y0=i*(h+8),H=hist[s.id][i],t1=s.S.t,t0=t1-s.win;let [lo,hi]=L.range;H.forEach(q=>{lo=Math.min(lo,q[1],q[2]);hi=Math.max(hi,q[1],q[2])});
  const X=t=>pad.l+(t-t0)/s.win*(W-pad.l-pad.r),Y=v=>y0+pad.t+(1-(v-lo)/(hi-lo))*(h-pad.t-pad.b),YO=v=>y0+pad.t+(1-v/100)*(h-pad.t-pad.b);
  o+=`<rect x="${pad.l}" y="${y0+pad.t}" width="${W-pad.l-pad.r}" height="${h-pad.t-pad.b}" fill="var(--paper)" stroke="var(--panel-edge)"/><rect x="${pad.l}" y="${y0+pad.t}" width="5" height="${h-pad.t-pad.b}" fill="${L.col}"/>`;
  for(let k=0;k<=4;k++){const v=lo+(hi-lo)*k/4,yy=Y(v);o+=`<path d="M${pad.l} ${yy} H${W-pad.r}" stroke="var(--panel-edge)" stroke-width=".6"/><text x="${pad.l-5}" y="${yy+4}" class="lpAx" style="text-anchor:end;fill:${L.col}">${v.toFixed(L.d>1?2:0)}</text><text x="${W-pad.r+5}" y="${yy+4}" class="lpAx" style="text-anchor:start">${k*25}%</text>`}
  const path=(j,fy)=>H.length?"M"+H.map(q=>`${X(q[0]).toFixed(1)} ${fy(q[j]).toFixed(1)}`).join("L"):"";
  o+=`<path d="${path(3,YO)}" stroke="var(--muted)" stroke-width="1.4" fill="none" opacity=".8"/><path d="${path(2,Y)}" stroke="${L.col}" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/><path d="${path(1,Y)}" stroke="${L.col}" stroke-width="2.6" fill="none"/>`;
  o+=`<text x="${pad.l+12}" y="${y0+12}" class="lpL" style="fill:${L.col};text-anchor:start">${L.tag} ${L.name.toUpperCase()}</text><text x="${W-pad.r}" y="${y0+12}" class="lpAx" style="text-anchor:end">solid = ${L.pvn}${L.unit.trim()?" ("+L.unit.trim()+")":""} · dashed = setpoint · gray = output %</text>`;
  if(i===n-1)o+=`<text x="${(W)/2}" y="${y0+h-4}" class="lpAx" style="text-anchor:middle">last ${s.win/60} minutes</text>`});
 const sv=$("lpTrend");sv.setAttribute("viewBox",`0 0 ${W} ${n*(h+8)}`);sv.innerHTML=o}
function draw(){const s=cur;aid=0;$("lpSvg").innerHTML=DEFS+s.draw();
 $("lpReads").innerHTML=s.reads().map(([a,b,c])=>`<div${c?` style="border-left:4px solid ${c};padding-left:6px"`:""}><span>${a}</span><b>${b}</b></div>`).join("");trend();
 s.loops.forEach((L,i)=>{const e=$("lpF"+i);if(e)e.innerHTML=`<span>SP <b>${L.sp.toFixed(L.d)}</b></span><span>PV <b>${L.pv.toFixed(L.d)}</b></span><span>OUT <b>${f0(L.out)}%</b></span>`});
 const rs=s.resets?s.resets():[];const sig2=rs.map(r=>r[0]).join("|");if($("lpResets").dataset.s!==sig2){$("lpResets").dataset.s=sig2;$("lpResets").innerHTML=rs.map((r,i)=>`<button class="btn red" data-lpreset="${i}">${r[0]}</button>`).join("")}
 s.tasks.forEach((t,i)=>{if(!s.done[i]&&t.ok(s,s.memo)){s.done[i]=true;renderTasks()}})}
function renderTasks(){const s=cur;$("lpTasks").innerHTML=s.tasks.map((t,i)=>`<li class="${s.done[i]?"ok":""}"><span class="lpTk">${s.done[i]?"✓":i+1}</span><div><b>${t.t}</b>${s.done[i]?`<p>${t.why}</p>`:""}</div></li>`).join("")}
const fmt=(c,v)=>(c.step<0.01?(+v).toFixed(3):c.step<1?(+v).toFixed(1):Math.round(v))+c.u;
function renderSide(){const s=cur;
 $("lpLead").textContent=s.lead;
 $("lpLoops").innerHTML=s.loops.map((L,i)=>`<div class="lpCard" style="--lc:${L.col}"><h4><i></i>${L.tag} · ${L.name}</h4><div class="lpFace" id="lpF${i}"></div>
  <div class="btns"><button class="btn" data-lpauto="${i}" aria-pressed="${L.auto}">${L.auto?"Auto":"Hand"}</button><span class="lpDir">${L.dir>0?"Output rises when the reading is below setpoint":"Output rises when the reading is above setpoint"}</span></div>
  <div class="row"${L.auto?" hidden":""}><label for="lpH${i}">${L.outn} in Hand</label><output>${f0(L.hand)}%</output><input type="range" id="lpH${i}" data-lph="${i}" min="0" max="100" step="1" value="${L.hand}"></div>
  <div class="row"><label for="lpP${i}">Proportional band</label><output>${L.pb.toFixed(L.pbR[2]<0.01?3:0)}${L.unit}</output><input type="range" id="lpP${i}" data-lpp="${i}" min="${L.pbR[0]}" max="${L.pbR[1]}" step="${L.pbR[2]}" value="${L.pb}"></div>
  <div class="row"><label for="lpT${i}">Reset time (0 = P only)</label><output>${L.ti?L.ti.toFixed(1)+" min":"off"}</output><input type="range" id="lpT${i}" data-lpt="${i}" min="${L.tiR[0]}" max="${L.tiR[1]}" step="${L.tiR[2]}" value="${L.ti}"></div></div>`).join("");
 $("lpConds").innerHTML=(s.switches||[]).map(([k,on,off])=>`<button class="btn" data-lpsw="${k}" aria-pressed="${!!s.S[k]}">${s.S[k]?on:off}</button>`).join("")+s.conds.map(c=>`<div class="row"><label for="lpC_${c.k}">${c.l}</label><output>${fmt(c,s.V[c.k])}</output><input type="range" id="lpC_${c.k}" data-lpc="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${s.V[c.k]}">${c.note?`<small>${c.note}</small>`:""}</div>`).join("");
 $("lpFaults").innerHTML=s.faults.map(f=>`<label><input type="checkbox" data-lpf="${f[0]}"${s.F[f[0]]?" checked":""}> ${f[1]}</label>`).join("");
 $("lpNotes").innerHTML=s.notes.map(n=>`<li>${n}</li>`).join("");$("lpSrc").innerHTML=s.src.map(([n,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join("");
 $("lpLegend").innerHTML=s.loops.map(L=>`<span><i style="background:${L.col}"></i>${L.tag}: ${L.name}</span>`).join("")+`<span><i class="dash"></i>dashed line = control signal</span>`;
 renderTasks();document.querySelectorAll("[data-lpsys]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lpsys===s.id));$("lpSpeed").value=speed;$("lpRun").textContent=running?"Pause":"Run"}
function setSys(id){cur=SYS[id];speed=cur.speed;logs=[];say(cur.name+" running.");renderSide();draw();try{localStorage.setItem("ct-lpsys",id)}catch(e){}}
function tick(now){raf=requestAnimationFrame(tick);if($("lpSec").hidden)return;const real=Math.min(0.1,(now-last)/1000||0);last=now;
 if(running){let rem=real*speed;const s=cur;while(rem>1e-6){const dt=Math.min(1,rem);s.S.t+=dt;s.step(dt);rem-=dt;if(Math.floor(s.S.t/(s.win/300))!==Math.floor((s.S.t-dt)/(s.win/300)))sample()}}
 draw()}
function show(on){const box=$("lpSec");if(!box)return;box.hidden=!on;$("simLoops").setAttribute("aria-pressed",on);
 if(on){document.querySelector(".layout").hidden=true;["pidSec","calSec"].forEach(i=>{const e=$(i);if(e)e.hidden=true});document.querySelectorAll("[data-sim],#simPid,#simCal").forEach(b=>b.setAttribute("aria-pressed",false));
  let id="hw";try{id=localStorage.getItem("ct-lpsys")||"hw"}catch(e){}setSys(SYS[id]?id:"hw");last=performance.now();if(!raf)raf=requestAnimationFrame(tick)}}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
 if(t.closest("#simLoops")){show(true);return}
 if(t.closest("[data-sim]")||t.closest("#simPid")||t.closest("#simCal")){if(!$("lpSec").hidden)show(false);if(t.closest("[data-sim]"))document.querySelector(".layout").hidden=false;return}
 if($("lpSec").hidden)return;const b=t.closest("button");if(!b)return;const s=cur;
 if(b.dataset.lpsys){setSys(b.dataset.lpsys);return}
 if(b.dataset.lpauto){const L=s.loops[+b.dataset.lpauto];L.auto=!L.auto;if(!L.auto)L.hand=Math.round(L.out);say(`${L.tag} in ${L.auto?"Auto":"Hand at "+L.hand+"%"}.`,L.auto?"":"w");renderSide();return}
 if(b.dataset.lpsw){const k=b.dataset.lpsw;s.S[k]=!s.S[k];renderSide();return}
 if(b.dataset.lpreset){const r=s.resets()[+b.dataset.lpreset];r&&r[1]();return}
 if(b.id==="lpRun"){running=!running;b.textContent=running?"Pause":"Run";return}
 if(b.id==="lpReset"){resetSys(s);logs=[];say(s.name+" reset.");renderSide();return}});
document.addEventListener("input",e=>{const i=e.target;if(!i.dataset||$("lpSec").hidden)return;const s=cur,o=i.parentNode.querySelector("output");
 if(i.dataset.lpc){const c=s.conds.find(x=>x.k===i.dataset.lpc);s.V[c.k]=+i.value;o.textContent=fmt(c,+i.value)}
 else if(i.dataset.lpp){const L=s.loops[+i.dataset.lpp];L.pb=+i.value;o.textContent=L.pb.toFixed(L.pbR[2]<0.01?3:0)+L.unit}
 else if(i.dataset.lpt){const L=s.loops[+i.dataset.lpt];L.ti=+i.value;o.textContent=L.ti?L.ti.toFixed(1)+" min":"off"}
 else if(i.dataset.lph){const L=s.loops[+i.dataset.lph];L.hand=+i.value;o.textContent=i.value+"%"}});
document.addEventListener("change",e=>{const i=e.target;if(!i.dataset)return;if(i.id==="lpSpeed"){speed=+i.value;return}
 if(i.dataset.lpf){cur.F[i.dataset.lpf]=i.checked;say(`${i.checked?"Fault on":"Fault cleared"}: ${cur.faults.find(f=>f[0]===i.dataset.lpf)[1]}.`,i.checked?"w":"")}});
window.__lp={SYS,get cur(){return cur},setSys,show,run:(n,dt=1)=>{for(let k=0;k<n;k++){cur.S.t+=dt;cur.step(dt);if(k%4===0)sample()}draw()},hist};
})();
