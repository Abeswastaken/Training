/* ============ Lesson: PID control loops (Learn before the Controls trainer's PID Tuning tab) ============ */
(()=>{
const cfgOf=S=>({mode:PMODES[S.mode],pb:S.pb,ti:S.ti,td:S.td,diff:S.diff,oat:S.oat,noise:!!S.noise});
/* ---------- trend chart: room (sensor), setpoint, valve % ---------- */
function trend(H,o){const x0=o.x,y0=o.y,w=o.w,h=o.h,t0=o.t0??0,t1=o.t1??70;let lo=o.lo??66,hi=o.hi??76;
 if(o.auto!==false)H.forEach(r=>{if(r[0]<=t1){lo=Math.min(lo,Math.floor(r[1]-0.5));hi=Math.max(hi,Math.ceil(r[1]+0.5))}});
 const X=m=>x0+(m-t0)/(t1-t0)*w,Y=v=>y0+h-(v-lo)/(hi-lo)*h,Yu=u=>y0+h-u/100*h;const HH=H.filter(r=>r[0]<=t1);
 let s=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 const st=hi-lo>14?4:2;
 if(!o.mini){for(let v=Math.ceil(lo/st)*st;v<=hi;v+=st)s+=`<path d="M${x0} ${Y(v)} H${x0+w}" stroke="var(--panel-edge)" stroke-width=".7"/>`+K.txt(x0-7,Y(v)+5,v+"°",{a:"end"});
  for(let m=Math.ceil(t0/10)*10;m<=t1;m+=10)s+=K.txt(X(m),y0+h+20,m);
  if(!o.noMin)s+=K.txt(x0+w/2,y0+h+40,"minutes");
  if(o.valve)for(let u=0;u<=100;u+=50)s+=K.txt(x0+w+7,Yu(u)+5,u+"%",{a:"start",fill:"#3a7bd5"})}
 let ds=null;HH.forEach((r,i)=>{if(r[4]&&ds===null)ds=r[0];if((!r[4]||i===HH.length-1)&&ds!==null){s+=`<rect x="${X(ds)}" y="${y0}" width="${X(r[0])-X(ds)}" height="${h}" fill="#2f6fd6" opacity=".12"/>`+(o.mini?"":K.txt(X(ds)+4,y0+16,"door open",{a:"start",fill:"#2f6fd6"}));ds=null}});
 if(o.band)s+=`<path d="${HH.map((r,i)=>(i?"L":"M")+X(r[0]).toFixed(1)+" "+Y(r[2]+o.band).toFixed(1)).join("")}${HH.slice().reverse().map(r=>"L"+X(r[0]).toFixed(1)+" "+Y(r[2]-o.band).toFixed(1)).join("")}Z" fill="${o.bandC||"var(--ok)"}" opacity=".15"/>`;
 const pl=(f,c,sw,ex="")=>`<polyline points="${HH.map(r=>X(r[0]).toFixed(1)+","+f(r).toFixed(1)).join(" ")}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round" ${ex}/>`;
 if(o.valve)s+=pl(r=>Yu(r[3]),"#3a7bd5",o.mini?1.2:1.6,'opacity=".75"');
 if(o.ghost)s+=`<polyline points="${o.ghost.filter(r=>r[0]<=t1).map(r=>X(r[0]).toFixed(1)+","+Y(Math.max(lo,Math.min(hi,r[1]))).toFixed(1)).join(" ")}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>`;
 s+=pl(r=>Y(r[2]),"var(--ink)",o.mini?1.2:1.6,'stroke-dasharray="6 4"');
 s+=pl(r=>Y(Math.max(lo,Math.min(hi,r[1]))),"var(--hot)",o.mini?2:2.6);
 if(o.legend){const g=o.legend===true?["room (sensor)","setpoint","valve %"]:o.legend;const lx=x0+10,ly=y0+h-12;
  s+=`<rect x="${lx-6}" y="${ly-15}" width="${o.valve?370:250}" height="24" rx="4" fill="var(--paper)" opacity=".9"/><path d="M${lx} ${ly-4} h20" stroke="var(--hot)" stroke-width="2.6"/>${K.txt(lx+26,ly+1,g[0],{a:"start"})}<path d="M${lx+130} ${ly-4} h20" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="6 4"/>${K.txt(lx+156,ly+1,g[1],{a:"start"})}`+(o.valve?`<path d="M${lx+240} ${ly-4} h20" stroke="#3a7bd5" stroke-width="1.6"/>${K.txt(lx+266,ly+1,g[2],{a:"start"})}`:"")}
 if(o.title)s+=K.lbl(x0,y0-10,o.title,{a:"start"});
 return {s,X,Y,Yu}}
/* ---------- the zone: reheat coil in the duct, valve and actuator, wall sensor, controller ---------- */
function loopSVG(z,o={}){const v=Math.max(0,Math.min(100,z.valve)),tc=T=>T>73?"var(--hot)":T<70?"var(--cold)":"var(--ok)",da=Math.round(55+v*0.45);
 let s=`<rect x="0" y="0" width="720" height="380" fill="var(--bg)"/>`;
 // room
 s+=`<rect x="300" y="104" width="400" height="256" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.5"/><rect x="300" y="350" width="400" height="10" fill="url(#zTan)"/>`;
 s+=`<rect x="640" y="150" width="40" height="110" fill="#cfe3f3" stroke="#5f686d" stroke-width="2"/><path d="M660 150 V260 M640 205 H680" stroke="#5f686d" stroke-width="1.5"/>`;
 s+=`<rect x="460" y="290" width="120" height="10" rx="2" fill="#8a6a4a"/><rect x="470" y="300" width="8" height="50" fill="#6b5038"/><rect x="562" y="300" width="8" height="50" fill="#6b5038"/>`;
 // duct and diffuser
 s+=`<rect x="20" y="40" width="540" height="40" fill="url(#zSteel)" stroke="#5f686d" stroke-width="1.5"/><rect x="500" y="80" width="40" height="18" fill="url(#zSteel)" stroke="#5f686d"/><rect x="488" y="98" width="64" height="8" fill="url(#zGrille)" stroke="#5f686d"/>`;
 s+=K.arrow("M34 60 H184","#3a8bd6",3)+K.lbl(28,30,"SUPPLY AIR 55°F",{a:"start"});
 s+=`<rect x="200" y="42" width="44" height="36" fill="url(#zFins)" stroke="#4d555a" stroke-width="1.5"/>`+K.lbl(222,30,"REHEAT COIL");
 s+=K.arrow(`M260 60 H470`,tc(da),3)+K.tag(370,62,da+"°F AIR",{fill:tc(da)});
 s+=`<path d="M510 112 q-30 30 -60 40 M530 112 q30 30 60 40" stroke="${tc(da)}" stroke-width="2.4" fill="none" stroke-dasharray="6 5" class="lsFlow"/>`;
 // hot water pipes (rects so gradients render) and the valve
 s+=`<rect x="20" y="196" width="196" height="9" fill="url(#zCuH)"/><rect x="207" y="78" width="9" height="127" fill="url(#zCuV)"/><rect x="228" y="78" width="9" height="160" fill="url(#zCuV)"/><rect x="20" y="230" width="217" height="9" fill="url(#zCuH)"/>`;
 s+=K.lbl(96,188,"HOT WATER IN",{a:"start",size:13})+K.lbl(24,258,"RETURN",{a:"start",size:13});
 s+=`<g transform="translate(70 200)"><path d="M-14 -11 V11 L14 -11 V11 Z" fill="url(#zBrass)" stroke="#5a4310" stroke-width="1.6"/><rect x="-3" y="-30" width="6" height="20" fill="#8d969b"/><rect x="-20" y="-58" width="40" height="28" rx="4" fill="url(#zPlasticDk)" stroke="#2a2f33"/><text x="0" y="-39" class="lsG" style="font-size:12px;fill:#fff">${Math.round(v)}%</text></g>`;
 if(!o.badges)s+=K.lbl(70,128,"VALVE + ACTUATOR",{size:13});
 // controller
 s+=`<rect x="150" y="270" width="110" height="80" rx="6" fill="url(#zPlasticDk)" stroke="#2a2f33" stroke-width="1.5"/><rect x="160" y="280" width="90" height="44" rx="3" fill="#15191c"/>
 <text x="205" y="297" class="lsLcd" style="font-size:12px">SP ${K.f1(z.sp)}</text><text x="205" y="316" class="lsLcd" style="font-size:12px">PV ${K.f1(z.room)}</text>`+K.lbl(205,342,"CONTROLLER",{size:12,fill:"#fff"});
 // wall sensor
 s+=`<rect x="306" y="206" width="22" height="34" rx="4" fill="#ece7dc" stroke="#8f8a7f"/><circle cx="317" cy="216" r="3" fill="#8f8a7f"/>`+K.lbl(338,200,"SENSOR",{a:"start",size:13});
 s+=K.lbl(500,200,K.f1(z.room)+"°F",{size:30,fill:tc(z.room)})+K.lbl(500,224,"ROOM",{size:13});
 // signal wires
 s+=`<path d="M306 230 H290 V310 H262" stroke="#7a8288" stroke-width="1.8" stroke-dasharray="5 4" fill="none"/><path d="M150 310 H70 V172" stroke="#7a8288" stroke-width="1.8" stroke-dasharray="5 4" fill="none"/>`;
 if(o.badges){const b=(x,y,n,t,a)=>`<circle cx="${x}" cy="${y}" r="13" fill="var(--brass)"/><text x="${x}" y="${y+5}" class="lsL" style="fill:#fff;text-anchor:middle;font-size:15px">${n}</text>`+K.tag(a==="end"?x-18:x+18,y+5,t,{a:a||"start",c:"v"});
  s+=b(340,262,1,"MEASURES THE ROOM")+b(205,372,2,"COMPARES TO SETPOINT")+b(30,118,3,"MOVES THE VALVE")+b(300,22,4,"COIL HEATS THE AIR")}
 return s}
/* ---------- pneumatic thermostat vs DDC ---------- */
function pneuVsDdc(){let s="";
 s+=`<rect x="14" y="14" width="340" height="352" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/><rect x="366" y="14" width="340" height="352" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 s+=K.lbl(30,42,"PNEUMATIC THERMOSTAT",{a:"start"})+K.lbl(382,42,"DDC CONTROLLER",{a:"start"});
 // pneumatic: one-pipe (bleed) thermostat cutaway. Main air -> restrictor -> tee: up to the nozzle under the flapper, and out the branch to the valve actuator.
 const D="#1d2327",D2="#3d474d",cu="url(#zCuH)";
 s+=`<rect x="34" y="56" width="216" height="130" rx="8" fill="url(#zPlastic)" stroke="#8f8a7f"/>`;
 // main air in, restrictor, branch out (all one line at y=158..166)
 s+=`<rect x="20" y="158" width="64" height="8" fill="${cu}"/><rect x="84" y="153" width="22" height="18" rx="2" fill="url(#zBrass)" stroke="#6b5210" stroke-width=".8"/><rect x="84" y="160.5" width="22" height="3" fill="#3a2c08"/><rect x="106" y="158" width="218" height="8" fill="${cu}"/>`;
 // tee up to the nozzle
 s+=`<rect x="166" y="112" width="8" height="48" fill="url(#zCuV)"/><path d="M163 112h14l-3 -10h-8z" fill="url(#zBrass)" stroke="#6b5210" stroke-width=".8"/>`;
 // bimetal strip (two layers) anchored at the left post, flapper pad over the nozzle
 s+=`<rect x="46" y="84" width="10" height="26" rx="2" fill="#5f686d"/><path d="M54 95 Q112 90 186 96" stroke="#b5651d" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M54 91.5 Q112 86.5 186 92.5" stroke="#c9ced1" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="160" y="96" width="20" height="3" fill="#2f363a"/>`;
 // air bleeding from the nozzle gap
 s+=`<path d="M159 101 q-7 -2 -11 2 M181 101 q7 -2 11 2" stroke="#4b8fd0" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
 s+=K.txt(112,78,"bimetal",{fill:D2})+K.txt(214,90,"flapper",{fill:D2})+K.txt(206,126,"nozzle",{fill:D2})+K.txt(95,183,"restrictor",{fill:D2});
 // valve actuator on the end of the branch line
 s+=`<path d="M300 166 a24 20 0 0 1 48 0 z" fill="url(#zSteel)" stroke="#5f686d"/><rect x="298" y="166" width="52" height="5" fill="#5f686d"/><rect x="321" y="171" width="6" height="14" fill="#8a9298"/>`;
 s+=K.arrow("M22 148 H62","var(--cold)",2)+K.arrow("M262 148 H296","var(--cold)",2);
 s+=K.txt(20,206,"main air 20 psi",{a:"start"})+K.txt(346,206,"branch 3 to 15 psi to the valve",{a:"end"});
 // branch vs temp chart = proportional only
 const ch=K.chart({x:70,y:222,w:250,h:88,X:[68,76],Y:[3,15],xt:[68,70,72,74,76],yt:[3,9,15],xf:v=>v+"°",yf:v=>v,series:[{pts:[[68,15],[70,15],[74,3],[76,3]],c:"var(--brass)",w:3}],vlines:[{x:72,lbl:"SP"}]});
 s+=ch+K.txt(190,354,"branch psi vs room: 4°F throttling range");
 // DDC: sensor -> AI -> PI block -> AO -> actuator
 const box=(x,y,w,t1,t2,f="url(#zPlastic)")=>`<rect x="${x}" y="${y}" width="${w}" height="56" rx="6" fill="${f}" stroke="#5f686d"/>${K.lbl(x+w/2,y+24,t1,{size:14,fill:D})}${K.txt(x+w/2,y+44,t2,{fill:D2})}`;
 s+=box(386,64,130,"SENSOR","10K thermistor")+box(556,64,130,"INPUT (AI)","reads °F")+box(436,160,200,"PI BLOCK","PB, Ti in software","#e8eef3")+box(386,262,130,"OUTPUT (AO)","2 to 10 V")+box(556,262,130,"ACTUATOR","positions the valve");
 s+=K.arrow("M516 92 H552","#7a8288",2)+K.arrow("M621 120 V156","#7a8288",2)+K.arrow("M480 216 L451 258","#7a8288",2)+K.arrow("M516 290 H552","#7a8288",2);
 s+=K.txt(536,350,"adds integral, trends, alarms, and remote setpoints");
 return s}
/* ---------- steps ---------- */
const R0=pidRun({mode:"pi",pb:8,ti:12},{door:false,end:40});
const steps=[
 {t:"A control loop is a circle",
  body:`<p>Every automatic control does the same four things, over and over:</p><ol><li>A <b>sensor</b> measures the room (the <b>process variable</b>, PV).</li><li>A <b>controller</b> compares it to the <b>setpoint</b> (SP).</li><li>The controller sends an <b>output</b> that moves a valve or damper.</li><li>The valve changes the heat going into the room, and the sensor sees the result.</li></ol><p>Then it goes around again. That circle is called a <b>closed loop</b>. Here the loop runs a hot water reheat coil in a duct serving one office.</p>`,
  draw:()=>loopSVG({room:70.4,sp:72,valve:62},{badges:true})},
 {t:"Error is what the controller reacts to",
  body:`<p>The controller only cares about one number: the <b>error</b>, the gap between where the room is and where it should be.</p><p class="lsKey">Error = setpoint − room</p><p>For heating, a <b>positive</b> error means the room is too cold, so the valve should open more. A <b>negative</b> error means too warm: close it down. Cooling loops are the reverse (called <b>reverse acting</b> vs <b>direct acting</b>).</p><p>Drag the room temperature and watch the error and the valve.</p>`,
  math:`<p>Here the valve uses P control with a 6°F proportional band: valve = 50% + (100 ÷ 6) × error, held between 0 and 100%. Step 4 explains it.</p>`,
  init:{rt:70},ctl:{html:`<div class="row"><label for="ls_rt">Room temperature</label><output id="lso_rt">70.0°F</output><input type="range" id="ls_rt" min="66" max="78" step="0.5" value="70"></div>`,input:(t,s)=>{s.rt=+t.value;document.getElementById("lso_rt").textContent=K.f1(t.value)+"°F"}},
  draw:s=>{const rt=s.rt??70,e=72-rt,v=Math.max(0,Math.min(100,50+100/6*e)),Y=T=>330-(T-64)/16*280,tc=T=>T>73?"var(--hot)":T<70?"var(--cold)":"var(--ok)";
   let g=`<rect x="120" y="40" width="44" height="300" rx="22" fill="url(#zAlu)" stroke="#5f686d" stroke-width="2"/>`;
   for(let T=64;T<=80;T+=2)g+=`<path d="M164 ${Y(T)} h12" stroke="var(--muted)"/>`+K.txt(182,Y(T)+5,T+"°",{a:"start"});
   g+=`<rect x="134" y="${Y(rt)}" width="16" height="${330-Y(rt)}" rx="6" fill="${tc(rt)}"/><path d="M100 ${Y(72)} H230" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>`+K.lbl(96,Y(72)+5,"SETPOINT 72",{a:"end",size:14});
   g+=K.lbl(96,Y(rt)+5,"ROOM "+K.f1(rt),{a:"end",size:14,fill:tc(rt)});
   if(Math.abs(e)>=0.5)g+=K.arrow(`M250 ${Y(rt)} V${Y(72)+(e>0?8:-8)}`,"var(--brass)",3)+K.arrow(`M250 ${Y(72)} V${Y(rt)+(e>0?-8:8)}`,"var(--brass)",3);
   g+=K.tag(262,(Y(rt)+Y(72))/2+6,"ERROR "+(e>0?"+":"")+K.f1(e)+"°F",{a:"start",c:"v"});
   g+=`<g transform="translate(560 170)"><path d="M-30 -24 V24 L30 -24 V24 Z" fill="url(#zBrass)" stroke="#5a4310" stroke-width="2"/><rect x="-5" y="-62" width="10" height="38" fill="#8d969b"/><rect x="-40" y="-110" width="80" height="50" rx="6" fill="url(#zPlasticDk)" stroke="#2a2f33"/><text x="0" y="-78" class="lsLcd">${Math.round(v)}%</text></g>`;
   g+=K.lbl(560,240,"VALVE OPEN")+K.txt(560,268,e>0.2?"too cold: open up":e<-0.2?"too warm: close down":"right on: hold where it is");
   return g}},
 {t:"Why on/off overshoots",
  body:`<p>The simplest control is <b>on/off</b> (two-position): the valve is full open below setpoint and shut above it, with a small <b>differential</b> so it doesn't chatter.</p><p>The trouble is <b>lag</b>. When the valve shuts, hot water already in the coil, warm air already in the duct, and heat already in the room keep coming. Water takes about 45 seconds to reach the coil (<b>dead time</b>), the coil takes a minute to heat, and the sensor takes another minute to notice.</p><p>So the room sails past the differential both ways. A narrower differential doesn't fix it: try it.</p>`,
  init:{df:1},ctl:{html:`<div class="row"><label for="ls_df">Differential</label><output id="lso_df">1.0°F</output><input type="range" id="ls_df" min="0.5" max="4" step="0.5" value="1"></div>`,input:(t,s)=>{s.df=+t.value;document.getElementById("lso_df").textContent=K.f1(t.value)+"°F"}},
  draw:s=>{const df=s.df??1,r=pidRun({mode:"onoff",diff:df},{door:false,end:40});const T=trend(r.H,{x:70,y:40,w:580,h:260,t1:40,lo:66,hi:78,auto:false,valve:true,band:df/2,bandC:"var(--brass)",legend:true,title:`ON/OFF, ${K.f1(df)}°F DIFFERENTIAL`});
   const pk=r.H.filter(q=>q[0]>6&&q[0]<20).reduce((a,b)=>b[1]>a[1]?b:a,[0,0]);
   return T.s+K.tag(T.X(pk[0])+8,T.Y(pk[1])-10,"OVERSHOOT "+K.f1(pk[1]-72)+"°F",{a:"start",fill:"var(--bad)"})+K.txt(360,368,`swing ${K.f1(r.ppPre)}°F peak to peak: about ${K.f1(r.ppPre/df)} times the differential`)}},
 {t:"P: open the valve in step with the error",
  body:`<p><b>Proportional</b> control moves the valve a little for a little error and a lot for a lot. The <b>proportional band</b> (PB) is how many degrees of error it takes to go from shut to full open.</p><p>Narrow PB: strong, fast, and it hunts. Wide PB: calm, but lazy.</p><p>P alone always leaves an <b>offset</b> (also called <b>droop</b>): to hold the valve partly open there has to be some error left over. On a cold day the valve needs to be further open, so the offset is bigger.</p>`,
  math:`<p>Valve % = 50 + (100 ÷ PB) × error. The 50% is the valve position with zero error (the bias).</p><p>Gain is the same idea backward: gain = 100 ÷ PB, in % per °F.</p>`,
  init:{pb:6},ctl:{html:`<div class="row"><label for="ls_pb">Proportional band</label><output id="lso_pb">6°F</output><input type="range" id="ls_pb" min="2" max="20" step="1" value="6"></div>`,input:(t,s)=>{s.pb=+t.value;document.getElementById("lso_pb").textContent=t.value+"°F"}},
  vb:"0 0 760 380",
  draw:s=>{const pb=s.pb??6,r=pidRun({mode:"p",pb},{door:false,end:40});
   const a=K.chart({x:70,y:50,w:250,h:240,X:[62,82],Y:[0,100],xt:[62,67,72,77,82],yt:[0,50,100],xf:v=>v+"°",yf:v=>v+"%",title:"VALVE vs ROOM °F",series:[{f:T=>Math.max(0,Math.min(100,50+100/pb*(72-T))),c:"var(--brass)",n:120}],vlines:[{x:72,lbl:"SP"}],bands:[]});
   const x=T=>70+(T-62)/20*250,b0=Math.max(62,72-pb/2),b1=Math.min(82,72+pb/2);
   const br=`<path d="M${x(b0)} 322 v8 H${x(b1)} v-8" stroke="var(--brass)" stroke-width="2" fill="none"/>`+K.lbl((x(b0)+x(b1))/2,352,"PB "+pb+"°F",{fill:"var(--brass)",size:14});
   const T=trend(r.H,{x:400,y:50,w:320,h:240,t1:40,lo:66,hi:76,auto:false,legend:["room","setpoint"],title:"P ONLY: 68 TO 72°F"});
   const end=r.H[r.H.length-1][1];
   return a+br+T.s+K.tag(T.X(28),T.Y(end)+28,"OFFSET "+K.f1(72-end)+"°F",{fill:"var(--bad)"})+(r.ppPre>0.5?K.tag(T.X(20),T.Y(74.6),"HUNTING",{fill:"var(--bad)"}):"")}},
 {t:"I: reset walks the offset out",
  body:`<p><b>Integral</b> action, called <b>reset</b> in HVAC, keeps nudging the valve as long as any error is left. Over time it finds the valve position the room really needs, so the offset goes away.</p><p><b>Reset time</b> (Ti) is how many minutes integral takes to add as much again as the proportional part did. A <b>short</b> Ti is <b>strong</b> integral; too short and the room swings slowly back and forth. A long Ti is gentle but slow.</p><p>P plus I is <b>PI</b>, and it runs most HVAC valves and dampers.</p>`,
  math:`<p>Each second the integral term grows by (100 ÷ PB) × error ÷ (Ti × 60). It stops growing when the valve is pinned at 0 or 100% (anti-windup).</p>`,
  init:{ti:10},ctl:{html:`<div class="row"><label for="ls_ti">Reset time Ti</label><output id="lso_ti">10 min</output><input type="range" id="ls_ti" min="1.5" max="30" step="0.5" value="10"></div>`,input:(t,s)=>{s.ti=+t.value;document.getElementById("lso_ti").textContent=K.f1(t.value).replace(".0","")+" min"}},
  draw:s=>{const ti=s.ti??10,p=pidRun({mode:"p",pb:6},{door:false,end:50}),r=pidRun({mode:"pi",pb:6,ti},{door:false,end:50});
   const T=trend(r.H,{x:70,y:40,w:580,h:260,t1:50,lo:66,hi:77,auto:false,ghost:p.H,legend:["PI room","setpoint"],title:`PB 6°F: P ONLY (GRAY) vs PI WITH Ti ${K.f1(ti).replace(".0","")} MIN`});
   const pe=p.H[p.H.length-1][1],re=r.H[r.H.length-1][1];
   return T.s+K.tag(T.X(44),T.Y(pe)+26,"P ONLY "+K.f1(pe-72)+"°F",{fill:"var(--muted)"})+(r.ppPre>1?K.tag(T.X(30),T.Y(76),"SLOW SWINGS: Ti TOO SHORT",{fill:"var(--bad)"}):K.tag(T.X(44),T.Y(re)-14,"PI "+K.f1(Math.abs(re-72)<0.05?0:re-72)+"°F",{fill:"var(--hot)"}))}},
 {t:"D: why HVAC rarely uses it",
  body:`<p><b>Derivative</b> looks at how fast the room is changing and pushes against it, like easing off the gas before a stop sign. On a clean signal it trims overshoot.</p><p>But real sensors have a little <b>noise</b>: the reading flickers a tenth or two. Derivative sees each flicker as a fast change and jerks the valve. The actuator wears out and the loop can get worse, not better.</p><p>HVAC loops are slow and their sensors are noisy, so almost every one runs <b>PI with D at zero</b>. Drag Td up and watch the valve on the bottom chart.</p>`,
  init:{td:0},ctl:{html:`<div class="row"><label for="ls_td">Derivative time Td</label><output id="lso_td">0 min</output><input type="range" id="ls_td" min="0" max="3" step="0.25" value="0"></div>`,input:(t,s)=>{s.td=+t.value;document.getElementById("lso_td").textContent=t.value+" min"}},
  vb:"0 0 720 420",
  draw:s=>{const td=s.td??0,m=td>0?"pid":"pi",a=pidRun({mode:m,pb:4,ti:5,td},{door:false,end:40}),b=pidRun({mode:m,pb:4,ti:5,td,noise:true},{door:false,end:40});
   const T1=trend(a.H,{x:70,y:34,w:580,h:140,t1:40,lo:66,hi:76,auto:false,noMin:true,title:`CLEAN SENSOR: OVERSHOOT ${K.f1(a.os)}°F`});
   const T2=trend(b.H,{x:70,y:232,w:580,h:130,t1:40,lo:66,hi:78,auto:false,valve:true,legend:true,title:"REAL SENSOR (FLICKERS ±0.15°F): WATCH THE VALVE"});
   return T1.s+T2.s+(b.valveTravel>30?K.tag(560,262,"VALVE CHATTER",{fill:"var(--bad)"}):"")}},
 {t:"Reading a trend",
  body:`<p>You'll tune by looking at a <b>trend</b>: room, setpoint and valve over time. Four shapes cover most of what you'll see:</p><ul><li><b>Good:</b> gets there, overshoots a little, settles.</li><li><b>Hunting:</b> keeps swinging. PB too narrow or Ti too short.</li><li><b>Sluggish:</b> creeps up and takes forever. PB too wide or Ti too long.</li><li><b>Offset:</b> flat, but parked below setpoint. No reset (P only), or the valve is maxed out.</li></ul><p>Before you blame the tuning, check the valve: if it's pinned at 100% the equipment can't keep up, and no tuning will help.</p>`,
  draw:()=>{const C=[["GOOD",{mode:"pi",pb:8,ti:12},"var(--ok)"],["HUNTING",{mode:"pi",pb:3,ti:3},"var(--bad)"],["SLUGGISH",{mode:"pi",pb:20,ti:40},"var(--warn)"],["OFFSET",{mode:"p",pb:10},"var(--bad)"]];
   return K.cards(C.map(([t,c,col])=>{const r=pidRun(c,{door:false,end:40});return {t,c:col,inner:trend(r.H,{x:14,y:34,w:300,h:100,t1:40,lo:66,hi:76,auto:false,mini:true,valve:true}).s,note:c.mode==="p"?"P only, PB "+c.pb+"°F":"PI, PB "+c.pb+"°F, Ti "+c.ti+" min"}}))}},
 {t:"A simple way to tune",
  body:`<p>One method that works on most HVAC loops (a trial-and-error version of what textbooks call closed-loop tuning):</p><ol><li>Start calm: wide PB, no reset (or a very long Ti), D off.</li><li>Narrow the PB in steps, bumping the setpoint each time, until the loop starts to hunt.</li><li>Back off: double that PB.</li><li>Add reset: shorten Ti until it overshoots and swings, then lengthen it by about half.</li><li>Test it like a commissioning agent: change the setpoint, open a door, and watch the trend.</li></ol><p>Change <b>one</b> thing at a time and give the loop time to settle before you judge it. Write the old values down first.</p>`,
  draw:()=>{const C=[["1. WIDE PB, NO RESET",{mode:"p",pb:20},"calm but 3°F low"],["2. NARROW PB TO 3°F: HUNTS",{mode:"p",pb:3},"so double it to 6°F"],["3. PB 6°F + Ti 3 MIN: SWINGS",{mode:"pi",pb:6,ti:3},"too much reset, so lengthen Ti"],["4. PB 6°F + Ti 12 MIN: GOOD",{mode:"pi",pb:6,ti:12},"settles, offset gone"]];
   return K.cards(C.map(([t,c,n])=>{const r=pidRun(c,{door:false,end:60});return {t,inner:trend(r.H,{x:14,y:34,w:300,h:100,t1:60,lo:66,hi:76,auto:false,mini:true}).s,note:n}}))}},
 {t:"Pneumatic vs DDC",
  body:`<p>A <b>pneumatic thermostat</b> is a P-only controller made of parts: a bimetal bends a flapper over an air nozzle, and the <b>branch</b> pressure to the valve swings from 3 to 15 psi across its <b>throttling range</b>. Throttling range is just the proportional band. No reset, so a pneumatic room always droops a bit on cold days.</p><p>A <b>DDC</b> controller reads a sensor, does the math in software and sends 0 to 10 or 2 to 10 V (or 4 to 20 mA) to an electric actuator. It can add integral, log trends, and change setpoints from the front end.</p><p>Next: the Controls trainer's PID Tuning tab lets you run the full test, and Try it here walks you through it.</p>`,
  draw:()=>pneuVsDdc()}];
/* ---------- See it ---------- */
const MN=["On/off","P only","PI","PID"];
const see=K.see({vb:"0 0 760 420",init:{mode:2,pb:6,ti:10,td:0,diff:1,oat:30,noise:false},
 sliders:[["mode","Control mode",0,3,1,v=>MN[v]],["pb","Proportional band",1,20,0.5,v=>K.f1(v)+"°F"],["ti","Reset time Ti",1,30,0.5,v=>K.f1(v)+" min"],["td","Derivative time Td",0,3,0.25,v=>v+" min"],["diff","On/off differential",0.5,4,0.5,v=>K.f1(v)+"°F"],["oat","Outdoor air",0,55,5,v=>v+"°F"]],
 checks:[["noise","Real sensor (adds ±0.15°F flicker)"]],
 model:S=>pidRun(cfgOf(S)),
 draw:(R,S)=>{const T=trend(R.H,{x:60,y:40,w:620,h:300,valve:true,band:1,legend:true,title:`${MN[S.mode]}: SETPOINT 68 → 72°F AT MIN 5, DOOR OPEN MIN 35 TO 40`});
  const pk=R.H.filter(q=>q[0]>6&&q[0]<35).reduce((a,b)=>b[1]>a[1]?b:a,[0,0]);
  return T.s+(R.os>0.3?K.tag(Math.min(560,T.X(pk[0])+8),T.Y(pk[1])-10,"+"+K.f1(R.os)+"°F",{a:"start",fill:"var(--bad)"}):"")},
 reads:(R,S)=>[["Overshoot",K.f1(R.os)+"°F",R.os>1],["Swing at the end",K.f1(R.pp)+"°F",R.pp>0.5],["Offset at the end",(R.end>=0?"+":"")+K.f1(R.end)+"°F",Math.abs(R.end)>0.5],["Valve activity",R.valveTravel>30?"chattering":R.valveTravel>8?"busy":"smooth",R.valveTravel>30],["Within 1°F after the change",R.ok1?"yes":"no",!R.ok1],["Recovers after the door",R.ok2?"yes":"no",!R.ok2]],
 note:(R,S)=>S.mode===0?"On/off ignores PB, Ti and Td. Only the differential matters.":S.mode===1?"P only: Ti and Td are not used. Watch the offset.":S.mode===2?"PI: Td is not used.":"PID: all three terms are working.",
 log:[["Mode",(R,S)=>MN[S.mode]],["PB",(R,S)=>S.mode?K.f1(S.pb):"-"],["Ti",(R,S)=>S.mode>1?K.f1(S.ti):"-"],["Diff",(R,S)=>S.mode?"-":K.f1(S.diff)],["Swing",R=>K.f1(R.pp)],["Offset",R=>K.f1(R.end)]],
 logHint:"Press Log reading to keep each try, like a tuning sheet."});
/* ---------- Try it ---------- */
const ex=S=>S.oat!==30?"Put outdoor air back to 30°F.":S.noise?"Untick Real sensor for this one.":null;
const caseDraw=c=>R=>trend(R.H,{x:60,y:40,w:620,h:300,valve:true,band:1,legend:true,title:"TREND FROM THE FRONT END: SP 68 → 72°F, DOOR AT MIN 35"}).s;
const caseReads=R=>[["Overshoot",K.f1(R.os)+"°F"],["Swing at the end",K.f1(R.pp)+"°F"],["Offset at the end",(R.end>=0?"+":"")+K.f1(R.end)+"°F"]];
const causes=[["pb","Proportional band too narrow"],["ti","Reset time too short (too much integral)"],["p","No reset: loop set to P only"],["d","Derivative turned on with a noisy sensor"],["wide","Proportional band far too wide"]];
const tasks=[
 K.goal({t:"On/off can't settle",intro:"In See it, set <b>On/off</b>. Log a run with a <b>0.5°F</b> differential and another with <b>3°F</b>. Compare the swing.",
  check:(S,R,L)=>{const x=ex(S);if(x)return x;const a=L.find(l=>l.S.mode===0&&l.S.diff===0.5),b=L.find(l=>l.S.mode===0&&l.S.diff===3);return a&&b?true:!a?"Log an on/off run at 0.5°F differential.":"Now log one at 3°F."},
  ok:()=>{const L=K.LOG,a=L.find(l=>l.S.mode===0&&l.S.diff===0.5).R,b=L.find(l=>l.S.mode===0&&l.S.diff===3).R;return `Swing ${K.f1(a.pp)}°F with 0.5°F and ${K.f1(b.pp)}°F with 3°F. Shrinking the differential six times barely helps: the lag, not the differential, sets the swing.`}}),
 K.goal({t:"P only: calm it down",intro:"Set <b>P only</b>. Find a proportional band that settles (less than <b>0.5°F</b> of swing at the end) but keep it <b>10°F or narrower</b>.",
  check:(S,R)=>ex(S)||(S.mode!==1?"Set the mode to P only.":S.pb>10?"Narrow it to 10°F or less.":R.pp>=0.5?`Still swinging ${K.f1(R.pp)}°F. Widen the PB.`:true),
  ok:(S,R)=>`Settled with PB ${K.f1(S.pb)}°F, but parked ${K.f1(-R.end)}°F below setpoint. That's droop. A wider PB would be calmer and further off.`}),
 K.goal({t:"PI: remove the offset",intro:"Set <b>PI</b>. End within <b>0.3°F</b> of setpoint with less than <b>0.5°F</b> of swing.",
  check:(S,R)=>ex(S)||(S.mode!==2?"Set the mode to PI.":R.pp>=0.5?`Swinging ${K.f1(R.pp)}°F. Lengthen Ti or widen the PB.`:Math.abs(R.end)>=0.3?`Ended ${K.f1(R.end)}°F off. Shorten Ti a little.`:true),
  ok:(S,R)=>`PB ${K.f1(S.pb)}°F, Ti ${K.f1(S.ti)} min: ended ${(R.end>=0?"+":"")+K.f2(R.end)}°F from setpoint.`}),
 K.goal({t:"Add D on a clean signal",intro:"Set <b>PID</b> with PB <b>4°F</b> and Ti <b>5 min</b> (that overshoots). Add derivative until overshoot is <b>0.7°F</b> or less and the end swing is under <b>0.3°F</b>. Then tick Real sensor and look at the valve.",
  check:(S,R)=>ex(S)||(S.mode!==3?"Set the mode to PID.":S.pb!==4||S.ti!==5?"Set PB to 4°F and Ti to 5 min.":S.td<=0?"Add some derivative time.":R.os>0.7||R.pp>=0.3?`Overshoot ${K.f1(R.os)}°F, swing ${K.f1(R.pp)}°F. More Td.`:true),
  ok:(S,R)=>`Overshoot ${K.f2(R.os)}°F with Td ${S.td} min. Now tick Real sensor: the same settings chatter the valve. That's why HVAC leaves D at zero.`}),
 K.goal({t:"Pass the commissioning test",intro:"Any mode. Pass when the room is within <b>1°F</b> from minute 20 to 35, recovers to within <b>1°F</b> by minute 50 after the door, and overshoots <b>0.8°F</b> or less.",
  check:(S,R)=>ex(S)||(!R.ok1?"Not within 1°F between minutes 20 and 35.":!R.ok2?"Doesn't get back within 1°F after the door by minute 50.":R.os>0.8?`Overshoot ${K.f1(R.os)}°F. Calm it down.`:true),
  ok:(S,R)=>`Passed: ${MN[S.mode]}, PB ${K.f1(S.pb)}°F${S.mode>1?", Ti "+K.f1(S.ti)+" min":""}. For free play with a live animation, open the PID Tuning tab in the <a href="/controls/">Controls trainer</a>.`}),
 K.caseTask({t:"Service call: office too hot, then too cold",intro:"An office complains it's never comfortable. You pull the trend on the front end.",
  state:{c:{mode:"pi",pb:8,ti:1.5}},model:S=>pidRun(S.c),draw:caseDraw(),reads:caseReads,
  actions:[["Look at the valve trend",R=>"The valve swings from shut to wide open and back about every 15 to 20 minutes."]],causes,ans:"ti",
  why:"Big, slow swings that never die out, with the valve going end to end, are classic too-much-integral. Lengthen Ti (for example 1.5 to 12 minutes) and the loop settles.",hint:"The swings are slow and the PB isn't especially narrow. Which term winds up over time?"}),
 K.caseTask({t:"Service call: always a degree and a half cold",intro:"The room never complains about swings, but it sits cold all winter. The setpoint is 72°F.",
  state:{c:{mode:"p",pb:8}},model:S=>pidRun(S.c),draw:caseDraw(),reads:caseReads,
  actions:[["Look at the valve trend",R=>"The valve is steady around "+K.f0(R.H[R.H.length-1][3])+"%, not maxed out."]],causes,ans:"p",
  why:"A flat line parked below setpoint, with the valve steady and not at 100%, is droop. The loop has no reset. Turn on integral (PI) and the offset goes away.",hint:"It's calm, so the PB isn't too narrow, and the valve isn't maxed. What removes a steady offset?"}),
 K.caseTask({t:"Service call: actuator worn out in a year",intro:"The reheat valve actuator is on its second replacement. The room temperature looks OK but the valve never sits still.",
  state:{c:{mode:"pid",pb:6,ti:10,td:1.5,noise:true}},model:S=>pidRun(S.c),draw:caseDraw(),reads:caseReads,
  actions:[["Look at the valve trend",R=>"The valve command jumps several percent every few seconds."]],causes,ans:"d",
  why:"Derivative reacts to every flicker of the sensor and jerks the valve. Set Td to zero (PI) and the valve smooths out with almost no loss in control.",hint:"The jumps follow the sensor's little flickers. Which term reacts to how fast the reading changes?"})];
window.LESSON={id:"ctl-pid",sec:"Controls",secHref:"/controls/",title:"PID control loops",lead:"What a control loop does, how P, I and D each move the valve, how to read a trend, and a simple way to tune.",
 steps,see,tryIntro:`Five setups in See it (the same as the Controls trainer's PID lessons), then three trends from service calls. For free play with a live animation, open the PID Tuning tab in the <a href="/controls/">Controls trainer</a>.`,tasks,
 job:K.job({read:["Pull a <b>trend</b> of the room (or supply air), its setpoint and the valve or damper command, at least an hour long.","Check the valve isn't pinned at 0 or 100%. If it is, it's an equipment or sizing problem, not tuning.","Note the current PB (or gain), Ti and Td before you touch anything."],
  table:[["Loop","Typical mode","What it should look like"],["Zone reheat valve","PI","Slow and calm; settles within 10 to 20 minutes"],["Discharge air temperature","PI","Faster; within about 1°F of setpoint"],["Duct static pressure","PI","Fast; small, quick corrections"],["Pneumatic room thermostat","P only","Small droop is normal; check throttling range"]],tableT:"What to expect",
  steps:["Write down the current settings.","Make sure the sensor reads right (compare with a calibrated thermometer) and the valve strokes fully.","Bump the setpoint 2 to 4°F and trend it.","Hunting: widen the PB or lengthen Ti, one at a time. Sluggish: the reverse.","Leave D at zero unless the controls designer asked for it.","Restore the setpoint and record the final values."],stepsT:"How to retune a loop",
  log:"Record the date, loop, old and new PB, Ti and Td, and a screenshot of the trend before and after.",
  mistakes:["Tuning when the real problem is a stuck valve, a bad sensor or a dead pump.","Changing PB and Ti together, so you can't tell which one helped.","Judging too soon: a room loop needs 20 to 30 minutes to show what it'll do.","Turning on derivative to fix a hunting loop."]}),
 sources:[["The Engineering Mindset: PICVs explained (modulating valves in HVAC loops)","https://theengineeringmindset.com/picvs-explained/"],["Open textbook: control systems for hydronic systems","https://opentextbc.ca/plumbing3f/chapter/describe-control-systems-for-hydronic-systems/"],["National Instruments: PID theory explained","https://www.ni.com/en/shop/labview/pid-theory-explained.html"],["Wikipedia: proportional-integral-derivative controller","https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller"]]};
})();
