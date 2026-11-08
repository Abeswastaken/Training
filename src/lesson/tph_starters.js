/* ============ Lesson: Starters and overloads ============ */
(()=>{
const PC=TPK.PC;
/* step 1: the whole starter: supply, contactor, overload relay, motor */
const whole=()=>{const G=TPK.defs();let s=G.s;const st=TPK.starter(G,262,22,.8,{on:true,dial:13.2,lo:9,hi:14,cls:10});
 const mx=450,my=268,ms=.7,mt=TPK.mT(0).map(v=>mx+v*ms),mTop=my-30*ms+2;
 st.top.forEach((x,k)=>{s+=TPK.wire(`M${x} 0 V${st.yTop}`,PC[k])});
 [0,1,2].forEach(k=>{const yh=[244,236,228][k];s+=TPK.wire(`M${st.bot[k]} ${st.yBot} V${yh} H${mt[k]} V${mTop}`,PC[k])});
 s+=st.s+`<g transform="translate(${mx} ${my}) scale(${ms})">${TPK.motor(G,0,0,{dir:1,np1:"10 HP",np2:"460 V"})}</g>`;
 s+=K.tag(20,24,"1. SUPPLY: 460 V, 3 PHASE",{a:"start"})+K.txt(20,46,"from the fused disconnect",{a:"start"});
 s+=K.tag(20,98,"2. CONTACTOR M",{a:"start"})+K.txt(20,120,"switches the 3 lines",{a:"start"})+K.txt(20,140,"(coil A1-A2)",{a:"start"});
 s+=K.tag(20,180,"3. OVERLOAD RELAY",{a:"start"})+K.txt(20,202,"senses motor current",{a:"start"});
 s+=K.arrow("M200 94 H252","var(--muted)",1.8)+K.arrow("M190 176 H252","var(--muted)",1.8);
 s+=K.tag(700,150,"4. MOTOR",{a:"end"})+K.txt(700,172,"leads T1, T2, T3",{a:"end"})+K.txt(700,192,"land in its box",{a:"end"});
 s+=K.txt(220,300,"contactor + overload relay",{a:"middle"})+K.lbl(220,322,"= MAGNETIC MOTOR STARTER",{size:14});
 return s};
/* step 2: contactor cutaway, coil off and coil on */
const cut=(ox,on)=>{const G=TPK.defs();let s=G.s;const d=on?16:0;const g=(x,y)=>`translate(${ox+x} ${y})`;
 s+=`<g transform="${g(0,0)}"><rect x="0" y="22" width="300" height="290" rx="10" fill="url(#${G.pl})" stroke="#6b7378"/>`;
 s+=`<rect x="34" y="52" width="86" height="12" fill="url(#${G.cu})" stroke="#6b3a14"/><rect x="180" y="52" width="86" height="12" fill="url(#${G.cu})" stroke="#6b3a14"/>`;
 s+=`<rect x="106" y="64" width="12" height="8" fill="#d5d9dc" stroke="#6b7378"/><rect x="182" y="64" width="12" height="8" fill="#d5d9dc" stroke="#6b7378"/>`+TPK.screw(46,44,7)+TPK.screw(254,44,7);
 const by=88-d;s+=`<rect x="140" y="${by+10}" width="20" height="${82}" fill="#a9b0b5" stroke="#5d666c"/>`;
 s+=`<rect x="98" y="${by}" width="104" height="11" fill="url(#${G.cu})" stroke="#6b3a14"/><rect x="106" y="${by-6}" width="12" height="6" fill="#d5d9dc" stroke="#6b7378"/><rect x="182" y="${by-6}" width="12" height="6" fill="#d5d9dc" stroke="#6b7378"/>`;
 const ay=180-d;s+=`<rect x="88" y="${ay}" width="124" height="26" fill="url(#${G.mt})" stroke="#4d555a"/>`;for(let i=1;i<10;i++)s+=`<path d="M${88+i*12.4} ${ay+2} V${ay+24}" stroke="#4d555a" stroke-width=".6"/>`;
 const zz=(x)=>{const y0=ay+26,y1=222,n=6,h=(y1-y0)/n;let p=`M${x} ${y0}`;for(let i=0;i<n;i++)p+=` L${x+(i%2?-6:6)} ${y0+h*(i+.5)}`;return `<path d="${p} L${x} ${y1}" stroke="#5d666c" stroke-width="2" fill="none"/>`};
 s+=zz(98)+zz(202);
 s+=`<path d="M88 222 H212 V286 H88z M110 222 V270 M150 222 V270 M190 222 V270" fill="url(#${G.mt})" stroke="#4d555a"/>`;
 s+=`<rect x="118" y="230" width="64" height="44" rx="4" fill="url(#${G.cu})" stroke="#6b3a14"/>`;for(let i=1;i<6;i++)s+=`<path d="M118 ${230+i*7.3} H182" stroke="#6b3a14" stroke-width=".7"/>`;
 s+=`<path d="M118 252 H64 M182 252 H236" stroke="${on?TPK.LIVE:"#5d666c"}" stroke-width="2.4"/>`+TPK.sm(54,256,"A1",{a:"end",size:12})+TPK.sm(246,256,"A2",{a:"start",size:12});
 if(on){s+=`<path d="M46 58 H112 V${by+5} H188 V58 H254" stroke="${TPK.LIVE}" stroke-width="3" fill="none" stroke-dasharray="7 6" class="lsFlow"/>`;
  for(let i=0;i<3;i++)s+=`<path d="M${120+i*30} 214 v-10" stroke="${TPK.LIVE}" stroke-width="2" marker-end="url(#mag)"/>`}
 s+=TPK.sm(46,30+2,"L1",{size:12})+TPK.sm(254,32,"T1",{size:12})+`</g>`;
 s+=K.lbl(ox+150,342,on?"COIL ON: CONTACTS CLOSED":"COIL OFF: SPRINGS HOLD IT OPEN",{size:14,fill:on?"var(--ok)":"var(--ink)"});return s};
const cutaway=()=>K.arrowDef("mag",TPK.LIVE)+cut(30,false)+cut(390,true)+K.tag(360,190,"ARMATURE",{})+K.tag(360,140,"BRIDGE",{})+K.tag(360,258,"COIL",{})+K.tag(360,80,"FIXED",{});
/* step 3: 3-wire start/stop rung. ph 0 idle, 1 START held, 2 START released (sealed in), 3 STOP pressed */
const PH=["Ready: nothing pressed","START held: coil M pulls in","START released: sealed in by M 13-14","STOP pressed: M drops out"];
const rung=(ph,o={})=>{const stop=ph!==3,start=ph===1,M=o.forceM!=null?o.forceM:(ph===1||ph===2),aux=o.auxOpen?false:M,flow=M&&stop&&(start||aux)||M;
 const y=110,yb=200,live=stop;let s=TPK.rails(50,670,40,250,true);
 s+=TPK.seg(50,y,80,true)+TPK.pb(80,y,"NC",stop,"STOP",true)+TPK.seg(124,y,170,live)+TPK.dot(170,y,live);
 s+=TPK.pb(190,y,"NO",start,"START",live)+TPK.seg(170,y,190,live)+TPK.seg(234,y,262,start&&live||flow);
 s+=`<path d="M170 ${y} V${yb} H190 M234 ${yb} H262 V${y}" stroke="${TPK.lc(live)}" stroke-width="2" fill="none"/>`;
 s+=TPK.ct(190,yb,"NO",aux,"",live&&aux)+K.txt(212,yb+34,o.auxOpen?"M 13-14 (NOT CLOSING)":"M 13-14 SEAL-IN",{fill:o.auxOpen?"var(--bad)":undefined})+TPK.dot(262,y,flow);
 s+=TPK.seg(262,y,420,flow)+TPK.coil(420,y,"M",M)+TPK.seg(456,y,530,flow)+TPK.olc(530,y,false,flow)+TPK.seg(574,y,670,flow);
 s+=K.txt(438,y+40,"coil")+K.txt(552,y+44,"in series");
 return s};
const rungStep=st=>{const ph=st.ph||0,M=ph===1||ph===2;const G=TPK.defs();let s=G.s+rung(ph);
 s+=`<rect x="50" y="276" width="620" height="88" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 s+=K.lbl(70,304,PH[ph],{a:"start",size:15,fill:M?"var(--ok)":"var(--ink)"});
 s+=K.txt(70,330,M?"3 power contacts closed: the motor runs":"power contacts open: the motor is stopped",{a:"start"});
 s+=K.txt(70,352,ph===2?"current now flows through the seal-in contact instead of START":ph===3?"the seal-in opened too, so releasing STOP won't restart it":"",{a:"start"});
 s+=`<g transform="translate(560 286) scale(.36)">${TPK.motor(G,40,30,{dir:M?1:0})}</g>`;return s};
/* step 4: overload relay close-up */
const olStep=()=>{const G=TPK.defs();let s=G.s+`<g transform="translate(40 40) scale(2.1)">${TPK.olr(G,0,0,{fla:13.2,lo:9,hi:14,cls:10})}</g>`;
 const call=(x1,y1,x2,y2,t,sub,d)=>`<path d="${d||`M${x1} ${y1} L${x2-6} ${y2}`}" fill="none" stroke="var(--muted)" stroke-width="1.4"/><circle cx="${x1}" cy="${y1}" r="3.5" fill="var(--muted)"/>`+K.lbl(x2,y2+5,t,{a:"start",size:14})+K.txt(x2,y2+25,sub,{a:"start"});
 s+=call(111,116,330,40,"FLA DIAL","set to the motor's nameplate amps","M111 116 V40 H324");
 s+=call(275,84,330,104,"TRIP CLASS 10 / 20 / 30","seconds it allows 600% current");
 s+=call(197,170,330,228,"RESET","manual: push after it cools");
 s+=call(275,162,330,166,"95-96 NC CONTACT","opens on a trip and drops coil M");
 s+=call(160,240,330,292,"T1 T2 T3 OUT","the 3 motor leads pass through it");
 s+=K.txt(40,350,"An overload trip opens the CONTROL circuit. The contactor then opens the motor.",{a:"start"});
 return s};
/* step 5: nameplate and the NEC 430.32 limit */
const plate=()=>{const G=TPK.defs();let s=G.s+`<g filter="url(#${G.sh})"><rect x="30" y="40" width="330" height="270" rx="8" fill="url(#${G.mt})" stroke="#5d666c" stroke-width="1.5"/></g>`;
 [[44,54],[346,54],[44,296],[346,296]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="5" fill="#9aa3a8" stroke="#5d666c"/>`});
 s+=TPK.sm(195,78,"3-PHASE INDUCTION MOTOR",{size:13});
 const rows=[["HP","10","RPM","1765"],["VOLTS","460","HZ","60"],["FLA","13.2","PH","3"],["S.F.","1.15","CODE","G"],["INS CL","F","AMB","40°C"],["DESIGN","B","FRAME","215T"]];
 rows.forEach((r,i)=>{const y=110+i*30;s+=`<path d="M50 ${y+9} H340" stroke="#8f989d" stroke-width=".7"/>`+TPK.sm(56,y,r[0],{a:"start",size:12})+TPK.sm(160,y,r[1],{a:"end",size:14})+TPK.sm(206,y,r[2],{a:"start",size:12})+TPK.sm(332,y,r[3],{a:"end",size:14});
  if(r[0]==="FLA"||r[0]==="S.F.")s+=`<rect x="52" y="${y-16}" width="114" height="22" rx="3" fill="none" stroke="#d62828" stroke-width="2"/>`});
 const x=390;s+=`<rect x="${x}" y="40" width="310" height="270" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 s+=K.lbl(x+16,70,"NEC 430.32 MAXIMUM TRIP",{a:"start",size:14})+K.txt(x+16,96,"S.F. 1.15 or more, or rise 40°C or less: 125%",{a:"start"})+K.txt(x+16,118,"all other motors: 115%",{a:"start"});
 s+=K.lbl(x+16,156,"13.2 A × 1.25 = 16.5 A MAX",{a:"start",size:15,fill:"var(--bad)"});
 s+=K.lbl(x+16,198,"DIAL: 13.2 A",{a:"start",size:15,fill:"var(--ok)"})+K.txt(x+16,222,"the relay itself trips near 115% of",{a:"start"})+K.txt(x+16,242,"the dial: about 15.2 A, under 16.5 A",{a:"start"});
 s+=K.txt(x+16,280,"NEC table FLA (14 A) is for wire and",{a:"start"})+K.txt(x+16,300,"breakers, not for overloads",{a:"start"});return s};
/* step 6: trip class curves */
const lg=t=>Math.log10(t);
const curves=()=>K.chart({x:90,y:40,w:560,h:270,X:[1,8],Y:[0,3],xt:[1,2,3,4,5,6,7,8],xf:v=>v*100+"%",yt:[0,1,2,3],yf:v=>["1 s","10 s","100 s","1000 s"][v],xl:"current, % of the dial setting",yl:"time to trip",title:"TRIP CURVES (COLD START)",
 series:[30,20,10].map((c,i)=>({f:m=>m>1.2?lg(TPK.trip(m,c)):NaN,c:["#7a5cd0","#2f6fd6","#d62828"][i],lbl:"CLASS "+c,lblAt:[2.6,3.6,6.9][i],a:"start",dx:6,dy:[-10,-10,24][i],n:120})),
 vlines:[{x:6,lbl:"STARTING ≈ 600%",c:"var(--muted)"}],dots:[{x:6,y:1,c:"#d62828"},{x:6,y:lg(20),c:"#2f6fd6"},{x:6,y:lg(30),c:"#7a5cd0"}]})+K.txt(498,292,"at 600%: 10, 20 and 30 s",{a:"start"});
const steps=[
 {t:"The parts of a motor starter",
  body:`<p>A 3-phase motor needs something to switch it on and off and something to protect it from running too hot. That pair is a <b>magnetic motor starter</b>:</p><ul><li>The <b>contactor</b> (tag <b>M</b>) is a heavy-duty relay. Its coil closes three power contacts, one for each line.</li><li>The <b>overload relay</b> (OL) sits under it. All three motor leads pass through it, so it feels the motor's current.</li></ul><p>Fuses or a breaker upstream protect against short circuits. The overload protects the motor from slow overheating. They are different jobs.</p>`,
  draw:whole},
 {t:"The contactor: a coil pulls the contacts closed",
  body:`<p>Inside the contactor is an electromagnet. When the <b>coil</b> (terminals <b>A1</b> and <b>A2</b>) gets control voltage, it pulls the steel <b>armature</b> down.</p><p>The armature carries a copper <b>bridge</b> that closes across the fixed contacts. That connects L1 to T1, and the same happens on the other two poles.</p><p>Take the coil voltage away and springs push it open. Auxiliary contacts (like <b>13-14</b>) move with it, for use in the control circuit.</p>`,
  draw:cutaway},
 {t:"3-wire control: START, STOP and the seal-in contact",
  body:`<p>Pushbuttons only close while you hold them. So how does the motor keep running when you let go of START?</p><ul><li>An <b>auxiliary contact</b> on M (13-14) is wired in parallel with START.</li><li>When M pulls in, that contact closes and carries the coil current. This is the <b>seal-in</b> or <b>holding contact</b>.</li><li><b>STOP</b> (normally closed) and the overload contact are in series. Opening either one drops M, and the seal-in opens with it.</li></ul><p>Move the slider to run it. It's called <b>3-wire control</b> because three wires run to the pushbutton station.</p>`,
  math:`<p><b>Low-voltage protection:</b> if power drops out, M drops out and its seal-in opens. When power returns, nothing starts until someone presses START. That's a safety feature.</p><p><b>2-wire control</b> (a thermostat, float or pressure switch that stays closed) restarts the motor on its own when power returns. That's called low-voltage release.</p>`,
  init:{ph:0},ctl:{html:`<div class="row"><label for="tphPh">Press the buttons</label><input type="range" id="tphPh" min="0" max="3" step="1" value="0"></div>`,input:(el,st)=>{st.ph=+el.value}},
  draw:rungStep},
 {t:"The overload relay",
  body:`<p>The overload relay measures current in all three motor leads. A bimetal heater or electronics models how hot the motor winding is getting.</p><p>If the current stays too high for too long, it trips:</p><ul><li>Its <b>95-96</b> normally closed contact opens. That contact is in series with coil M, so M drops out and the motor stops.</li><li>A <b>97-98</b> normally open contact can light an alarm.</li></ul><p>On <b>manual reset</b> you push the reset button after it cools. Find out why it tripped before you reset it.</p>`,
  draw:olStep},
 {t:"Sizing the overload from the nameplate",
  body:`<p>Overloads are set from the motor's <b>nameplate full-load amps (FLA)</b>, not the NEC table.</p><ul><li>Check the <b>service factor (S.F.)</b>. A 1.15 S.F. motor can carry 15% more load without damage.</li><li><b>NEC 430.32</b>: the trip point can't be more than <b>125%</b> of nameplate FLA for 1.15 S.F. (or 40°C rise) motors, and <b>115%</b> for all others.</li></ul><p>On most adjustable relays you set the dial to the nameplate FLA. The relay trips a little above the dial. Read the relay's sheet: some say to set lower for a 1.0 S.F. motor.</p>`,
  math:`<p>Max trip = nameplate FLA × 1.25 (S.F. ≥ 1.15) or × 1.15 (other motors).</p><p>Example: 13.2 A × 1.25 = 16.5 A. A relay that trips at about 115% of its dial, set at 13.2 A, trips near 15.2 A: under the limit.</p><p>If the motor won't start, 430.32(C) allows up to 140% (or 130%) as the next step.</p>`,
  draw:plate},
 {t:"Trip class: how long it allows starting current",
  body:`<p>A motor draws about <b>6 times FLA</b> while it accelerates. The overload has to let that pass but still catch a stall.</p><p>The <b>trip class</b> is the number of seconds the relay waits at 600% of its setting before it trips:</p><ul><li><b>Class 10</b>: most general motors that start in a few seconds.</li><li><b>Class 20</b>: longer starts, like big fans.</li><li><b>Class 30</b>: heavy loads that take a long time to start.</li></ul><p>Use the lowest class that starts the load reliably. A higher class also lets a stall go on longer.</p>`,
  math:`<p>The curves use a simple heating model of the relay: t = τ × ln(m² ÷ (m² − 1.15²)), where m is current ÷ dial setting and the relay never trips below 115%.</p><p>τ is picked so t = 10, 20 or 30 s at m = 6, which is what the class number means.</p>`,
  draw:curves}];
/* ---------- See it: set an overload ---------- */
const CL=[10,20,30];
const mdl=S=>{const sf=S.sf?1.15:1.0,cls=CL[S.cls],maxT=S.fla*(S.sf?1.25:1.15),ult=TPK.U*S.dial,legal=ult<=maxT+1e-6;
 const Irun=TPK.runI(S.fla,S.load/100),tRun=TPK.trip(Irun/S.dial,cls),Ist=6*S.fla,tSt=TPK.trip(Ist/S.dial,cls),startOK=S.start<tSt;
 const Ihot=TPK.runI(S.fla,1.25),tHot=TPK.trip(Ihot/S.dial,cls);
 return {sf,cls,maxT,ult,legal,Irun,tRun,Ist,tSt,startOK,heat:Math.min(999,100*S.start/tSt),Ihot,tHot,lowTrip:S.load<=100&&isFinite(tRun)}};
const seeDraw=(R,S)=>{const G=TPK.defs();const rg=TPK.range(S.dial);let s=G.s;
 const st=TPK.starter(G,30,40,.8,{on:true,dial:S.dial,lo:rg[0],hi:rg[1],cls:R.cls,trip:false});
 st.top.forEach((x,k)=>{s+=TPK.wire(`M${x} 10 V${st.yTop}`,PC[k])});st.bot.forEach((x,k)=>{s+=TPK.wire(`M${x} ${st.yBot} V370`,PC[k])});s+=st.s;
 s+=K.lcd(172,150,K.f1(R.Irun)+" A",80)+K.txt(172,180,"clamp");
 const F=S.fla,lx=I=>Math.log10(I/F),ch={x:290,y:40,w:400,h:270,X:[lx(.5*F),lx(8*F)],Y:[0,4]};
 s+=K.chart({...ch,xt:[.5,1,2,4,8].map(m=>lx(m*F)),xf:v=>K.f0(F*Math.pow(10,v))+" A",yt:[0,1,2,3,4],yf:v=>["1 s","10 s","100 s","17 min","2.8 h"][v],xl:"motor current (log scale)",title:`CLASS ${R.cls} RELAY, DIAL ${K.f1(S.dial)} A`,
  series:[{f:v=>{const t=TPK.trip(F*Math.pow(10,v)/S.dial,R.cls);return isFinite(t)&&t>=1&&t<=1e4?lg(t):NaN},c:"#d62828",n:200}]});
 const X=I=>ch.x+(lx(I)-ch.X[0])/(ch.X[1]-ch.X[0])*ch.w,Y=v=>ch.y+ch.h-v/4*ch.h,vl=(I,c,t,ty)=>{const x=X(Math.max(.5*F,Math.min(8*F,I)));return `<path d="M${x} ${ch.y} V${ch.y+ch.h}" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 4"/>`+K.txt(x+5,ty,t,{a:"start",fill:c})};
 s+=vl(F,"var(--muted)","FLA",ch.y+14)+vl(R.maxT,R.legal?"var(--ok)":"var(--bad)","NEC MAX",ch.y+34)+vl(R.ult,"#d62828","TRIPS ABOVE",ch.y+54);
 const sx=X(R.Ist),sy=Y(Math.min(4,lg(S.start)));s+=`<circle cx="${sx}" cy="${sy}" r="6" fill="${R.startOK?"var(--ok)":"var(--bad)"}" stroke="var(--paper)" stroke-width="2"/>`+K.txt(sx-10,sy-10,`START ${S.start} s`,{a:"end",fill:R.startOK?"var(--ok)":"var(--bad)"});
 const rx=X(R.Irun),bad=isFinite(R.tRun);s+=`<circle cx="${rx}" cy="${ch.y+ch.h}" r="6" fill="${bad?"var(--bad)":"var(--ok)"}" stroke="var(--paper)" stroke-width="2"/>`+K.txt(rx,ch.y+ch.h-12,"RUN",{fill:bad?"var(--bad)":"var(--ok)"});
 return s};
const see=K.see({vb:"0 0 720 380",init:{fla:13.2,sf:1,dial:16,cls:0,start:4,load:100},
 sliders:[["fla","Nameplate FLA",5,40,0.2,v=>K.f1(v)+" A"],["sf","Service factor",0,1,1,v=>v?"1.15":"1.0"],["dial","Overload dial",2,50,0.1,v=>K.f1(v)+" A"],["cls","Trip class",0,2,1,v=>"Class "+CL[v]],["start","Time to reach speed",1,30,1,v=>v+" s"],["load","Shaft load",40,140,5,v=>v+"% of rated"]],
 model:mdl,draw:seeDraw,
 reads:(R,S)=>[["Relay trips above",K.f1(R.ult)+" A"],["NEC 430.32 max",K.f1(R.maxT)+" A",!R.legal],["Running amps",K.f1(R.Irun)+" A"],["Trips while running",TPK.tFmt(R.tRun),R.lowTrip],["Start uses",K.f0(R.heat)+"% of the trip",!R.startOK],["At 125% load it trips in",TPK.tFmt(R.tHot),!isFinite(R.tHot)]],
 note:(R,S)=>!R.legal?`Set too high: the relay won't trip until ${K.f1(R.ult)} A, above the ${K.f1(R.maxT)} A that NEC 430.32 allows. The motor can cook without a trip.`:!R.startOK?`It trips before the motor gets to speed: class ${R.cls} at ${K.f0(6*S.fla/S.dial*100)}% of the dial allows only ${K.f1(R.tSt)} s. Try a higher trip class, not a higher dial.`:R.lowTrip?`Nuisance trip: the dial is too low for this motor's normal running current.`:`Protected. It starts, runs at ${K.f1(R.Irun)} A without tripping, and would trip in ${TPK.tFmt(R.tHot)} if the load went to 125%.`,
 log:[["FLA",(R,S)=>K.f1(S.fla)],["Dial",(R,S)=>K.f1(S.dial)],["Class",R=>R.cls],["Start",(R,S)=>R.startOK?"OK":"TRIP"],["Legal",R=>R.legal?"yes":"NO"]]});
/* ---------- Try it ---------- */
const auxCase=()=>{const ph={v:2};return K.caseTask({t:"Service call: it only runs while START is held",intro:"An exhaust fan's starter was just replaced. The fan runs while the operator holds START and stops the moment he lets go. The overload is not tripped.",
 state:{},model:()=>({}),draw:()=>{const G=TPK.defs();return G.s+rung(2,{auxOpen:true,forceM:false})+K.txt(360,300,"START released: M drops out",{fill:"var(--bad)"})},
 reads:()=>[["Hold START","motor runs"],["Release START","motor stops"],["Overload","not tripped"],["Coil M","pulls in fine"]],
 actions:[["Measure across STOP (running)",()=>"0 V across STOP while START is held: STOP is closed."],["Measure across M 13-14 (holding START)",()=>"120 V across 13-14 while M is pulled in: that contact is open when it should be closed. The new contactor came without an auxiliary block, and the wire was landed on an empty terminal."]],
 causes:[["stop","STOP button stuck open"],["aux","Seal-in contact M 13-14 not closing"],["ol","Overload contact 95-96 open"],["coil","Open coil M"]],ans:"aux",
 why:"With START held the coil works, so STOP, the coil and the overload are fine. The only thing that keeps M in after START is released is the seal-in contact, and it measured open while M was pulled in.",
 hint:"The coil pulls in while START is held. What carries the current when START opens?"})};
const tasks=[
 K.goal({t:"Set the overload for this nameplate",intro:"The motor in Learn step 5: nameplate 13.2 A, service factor 1.15. In See it, set the nameplate FLA and S.F., then set the dial so it's legal under NEC 430.32 and doesn't trip at full load (100% shaft load).",
  check:(S,R)=>Math.abs(S.fla-13.2)>0.11?"Set Nameplate FLA to 13.2 A first.":!S.sf?"This motor's service factor is 1.15.":S.load!==100?"Set the shaft load to 100% so you're checking full load.":!R.legal?`Too high: it trips above ${K.f1(R.ult)} A, over the ${K.f1(R.maxT)} A limit.`:R.lowTrip?"Too low: it would trip at normal full load.":true,
  ok:(S,R)=>`Good: dial ${K.f1(S.dial)} A trips above ${K.f1(R.ult)} A, under the 16.5 A limit, and holds at full load. Setting it right at the nameplate 13.2 A is the usual choice.`}),
 K.goal({t:"Pick the trip class for a slow-starting fan",intro:"A big supply fan has a nameplate of 27 A and takes 14 s to reach speed. In See it set FLA 27 A, the dial at 27 A and the start time at 14 s. Then choose the lowest trip class that lets it start.",
  check:(S,R)=>Math.abs(S.fla-27)>0.11?"Set Nameplate FLA to 27 A.":Math.abs(S.dial-27)>0.25?"Set the dial at the nameplate, 27 A.":S.start<14?"Set the time to reach speed to 14 s.":!R.startOK?`Class ${R.cls} trips at ${K.f1(R.tSt)} s, before the fan reaches speed.`:R.cls===30?"Class 30 works, but a lower class also starts it and catches a stall sooner.":true,
  ok:"Class 20. At 600% of the dial it waits 20 s, longer than the 14 s start. Class 10 would trip at 10 s, every time."}),
 auxCase()];
window.LESSON={id:"tph-starters",sec:"3-Phase Motor Control",secHref:"/threephase/",title:"Starters and overloads",lead:"A contactor switches the motor, a seal-in contact keeps it running after you let go of START, and an overload relay set from the nameplate keeps it from cooking.",
 steps,see,tryIntro:"Two settings to get right in See it, then a service call.",tasks,
 job:K.job({read:["Nameplate FLA and service factor: write them on the starter door if they aren't already.","The overload dial setting and trip class.","Running amps on all three leads with a clamp meter, at normal load.","Coil voltage on the contactor (A1-A2): 120 V or 24 V control, as marked."],
  table:[["Item","Normal","Act on it"],["Overload dial","Nameplate FLA (or per the relay's sheet)","Above 125% / 115% of FLA (NEC 430.32)"],["Running amps","At or under nameplate FLA","Over FLA at normal load: find out why"],["Amps leg to leg","Within a few percent","More than about 10% apart: check voltage balance"],["Trip class","10 for most motors","Raise only for long starts"],["Contactor","Quiet pull-in, no buzz","Loud hum or chatter: low coil voltage or dirty magnet face"]],
  steps:["Lock out and verify dead before you open the starter.","Compare the dial to the nameplate FLA and service factor.","Check the trip class against how long the load takes to start.","Restore power, run the motor, and clamp all three leads.","If it tripped: check amps, voltage on all three legs and the load before you press reset."],
  safety:["Lock out, tag out and verify dead with a tested meter before you touch starter wiring. The line side of a contactor is live even when the motor is off.","Never jumper an overload contact or turn the dial way up to stop nuisance trips. Find the cause.","Wear the arc-flash PPE your site requires for opening a 480 V starter."],
  mistakes:["Setting the overload from the NEC table FLA instead of the nameplate.","Turning the dial up to the max to stop trips, which leaves the motor unprotected.","Resetting a tripped overload over and over without checking amps or voltage.","Raising the trip class to 30 when the real problem is a dragging load or low voltage."]}),
 sources:[["The Engineering Mindset: How electric motors work","https://theengineeringmindset.com/how-electric-motors-work/"],["EEPower: Sizing overload protection for motors above 1 hp (NEC 430.32)","https://eepower.com/technical-articles/sizing-overload-protection-for-motors-above-1-hp/"],["Control.com: Motor starter trip classes for industrial motors","https://control.com/technical-articles/overcurrent-protection-motor-starter-trip-classes-for-industrial-motors/"]]};
})();
