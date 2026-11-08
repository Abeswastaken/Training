/* ============ Lesson: Steam converters ============ */
(()=>{
const UA=7090,GPM=40,TSET=180,DT=20,PMAX=15,HFG=960;   // heating water 40 gpm, 180°F supply, 20°F design drop, steam up to 15 psig at the valve
/* the converter: S = {load (fraction), pb (trap back pressure, psig), h (trap below the shell outlet, ft), vb, pump} */
const mdl=S=>{const L=S.load,Cc=500*GPM,e=1-Math.exp(-UA/Cc),Tin=TSET-DT*L;
 let Ts=Tin+(TSET-Tin)/e,Preq=HXK.satP(Ts),short=false;if(Preq>PMAX){Preq=PMAX;Ts=HXK.satT(PMAX);short=true}
 const Tout=short?Tin+e*(Ts-Tin):TSET,Q=500*GPM*(Tout-Tin);
 const head=0.433*S.h,Pshell=S.vb?Math.max(0,Preq):Preq,dP=Pshell+head-S.pb;
 const stall=!S.pump&&dP<0.05;let flood=0,Pop=Pshell;
 if(stall){Pop=S.pb-head;const Tb=HXK.satT(Pop),need=(TSET-Tin)/(Tb-Tin);const UAe=need>=0.999?UA:-Cc*Math.log(1-need);flood=Math.max(0.05,Math.min(0.85,1-UAe/UA))}
 return {...S,Tin,Tout,Ts:stall?HXK.satT(Pop):Ts,Preq,Pshell:stall?Pop:Pshell,dP,head,stall,flood,Q,lbh:Q/HFG,short,vac:Preq<0}};
const gauge=(x,y,p)=>{const a=-135+270*Math.max(0,Math.min(1,(p+15)/45));return `<circle cx="${x}" cy="${y}" r="20" fill="#fff" stroke="#3a4247" stroke-width="3"/><path d="M${x} ${y} l0 -15" stroke="#c0392b" stroke-width="2.2" transform="rotate(${a.toFixed(0)} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="2.5" fill="#333"/><rect x="${x-3}" y="${y+20}" width="6" height="10" fill="#6b7378"/>`};
/* steam-to-water U-tube converter with control valve, vacuum breaker, F&T trap (or pump-trap) and the condensate line */
const conv=(R,o={})=>{const g1=K.uid("sm"),g2=K.uid("sh"),g3=K.uid("br");const x0=150,x1=560,y0=130,y1=250,cy=(y0+y1)/2;
 let s=`<defs>${HXK.metal(g1)}${HXK.metalH(g2)}${HXK.brass(g3)}</defs>`;
 /* steam supply and control valve */
 const sc=HXK.tc(Math.max(200,R.Ts));
 s+=HXK.pipe(`M40 40 H330 V${y0}`,"#c7ccd0",10,true)+`<g transform="translate(330 76)"><path d="M-16 -12 L16 12 V-12 L-16 12Z" fill="url(#${g1})" stroke="${HXK.SE}"/><rect x="-3" y="-34" width="6" height="22" fill="#555"/><path d="M-24 -38 Q0 -62 24 -38 Z" fill="url(#zMotor)" stroke="${HXK.DK}"/></g>`;
 s+=K.lbl(40,28,"STEAM SUPPLY",{a:"start",size:12})+K.lbl(362,40,"CONTROL VALVE",{a:"start",size:12});
 /* shell */
 s+=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="${(y1-y0)/2}" fill="url(#${g1})" stroke="${HXK.SE}" stroke-width="1.5"/><rect x="${x0+8}" y="${y0+8}" width="${x1-x0-16}" height="${y1-y0-16}" rx="${(y1-y0)/2-8}" fill="#eef1f4"/>`;
 if(R.flood>0){const hh=(y1-y0-16)*R.flood;s+=`<clipPath id="${g1}c"><rect x="${x0+8}" y="${y0+8}" width="${x1-x0-16}" height="${y1-y0-16}" rx="${(y1-y0)/2-8}"/></clipPath><rect x="${x0}" y="${y1-8-hh}" width="${x1-x0}" height="${hh+8}" fill="#3f7fd6" opacity=".45" clip-path="url(#${g1}c)"/>`}
 /* U-tubes */
 for(let i=0;i<3;i++){const ya=y0+28+i*14,yb=y1-28-i*14,xr=x1-50-i*16,r=(yb-ya)/2;s+=`<path d="M${x0} ${ya} H${xr} A${r} ${r} 0 0 1 ${xr} ${yb} H${x0}" fill="none" stroke="#b87333" stroke-width="7"/><path d="M${x0} ${ya} H${xr} A${r} ${r} 0 0 1 ${xr} ${yb} H${x0}" fill="none" stroke="${HXK.tc((R.Tin+R.Tout)/2)}" stroke-width="3" stroke-dasharray="6 14" class="lsFlow"/>`}
 /* channel head and tubesheet */
 s+=`<rect x="${x0-70}" y="${y0+6}" width="76" height="${y1-y0-12}" rx="12" fill="url(#${g2})" stroke="${HXK.SE}"/><rect x="${x0-5}" y="${y0-6}" width="10" height="${y1-y0+12}" fill="#555"/><path d="M${x0-70} ${cy} H${x0}" stroke="${HXK.DK}" stroke-width="3"/>`;
 s+=HXK.pipe(`M30 ${y1-24} H${x0-70}`,HXK.tc(R.Tin),9)+HXK.pipe(`M${x0-70} ${y0+24} H30`,HXK.tc(R.Tout),9);
 s+=K.lbl(30,y1-6,"WATER IN",{a:"start",size:12})+HXK.t(30,y1+14,R.Tin,{a:"start",size:13})+K.lbl(30,y0+8,"WATER OUT",{a:"start",size:12})+HXK.t(30,y0+48,R.Tout,{a:"start",size:13});
 /* vacuum breaker and gauge */
 s+=`<path d="M470 ${y0} V${y0-24}" stroke="${HXK.SE}" stroke-width="5"/><rect x="460" y="${y0-44}" width="20" height="22" rx="4" fill="${R.vb?`url(#${g3})`:"#9aa3a8"}" stroke="#6a4a12"/>`;
 s+=K.lbl(486,y0-30,R.vb?"VACUUM BREAKER":"NO VACUUM BREAKER",{a:"start",size:12,fill:R.vb?"":"var(--muted)"});
 if(R.vb&&R.Preq<0)s+=K.arrow(`M470 ${y0-74} V${y0-48}`,"#7a8a96",2.2)+K.lbl(486,y0-58,"AIR IN",{a:"start",size:11});
 s+=gauge(400,y0-30,R.Pshell)+K.lbl(400,y0-60,"SHELL",{size:11});
 /* condensate line down to the trap */
 const ty=262+Math.min(4,R.h)*15,tx=500;
 s+=HXK.pipe(`M${tx} ${y1-6} V${ty-16}`,R.stall?"#3f7fd6":"#7fb0e6",6,!R.stall);
 if(o.pump||R.pump){s+=`<rect x="${tx-28}" y="${ty-18}" width="56" height="44" rx="10" fill="url(#zMotor)" stroke="${HXK.DK}"/>`+K.lbl(tx,ty+44,"PUMP-TRAP",{size:12})}
 else{s+=`<rect x="${tx-24}" y="${ty-16}" width="48" height="34" rx="8" fill="url(#${g1})" stroke="${HXK.DK}"/><circle cx="${tx}" cy="${ty+1}" r="10" fill="#c9cfd3" stroke="${HXK.SE}"/>`+K.lbl(tx,ty+38,"F&T TRAP",{size:12})}
 const ret=R.pb>0;s+=HXK.pipe(ret?`M${tx+24} ${ty} H600 V${y0+20} H700`:`M${tx+24} ${ty} H700`,"#7fb0e6",6,!R.stall);
 s+=K.lbl(700,ret?y0+8:ty-12,ret?"RETURN MAIN "+K.f1(R.pb)+" PSIG":"TO VENTED RECEIVER",{a:"end",size:12});
 if(ret)s+=K.lbl(612,(y0+ty)/2+20,"LIFT",{a:"start",size:11,fill:"var(--muted)"});
 s+=`<path d="M${tx-40} ${y1+4} V${ty} " stroke="var(--muted)" stroke-dasharray="3 3"/>`+K.lbl(tx-46,(y1+ty)/2+8,K.f1(R.h)+" FT",{a:"end",size:11,fill:"var(--muted)"});
 s+=K.lbl(290,y1+26,"STEAM IN THE SHELL: "+Math.round(R.Ts)+"°F",{size:13,fill:"#7a5a8a"});
 if(R.stall)s+=K.tag(290,y1+60,"STALLED: CONDENSATE BACKING UP",{fill:"var(--bad)"});
 return s};
/* F&T trap cutaway */
const trapCut=()=>{const g=K.uid("tc");let s=`<defs>${HXK.metal(g)}</defs>`;
 s+=`<rect x="200" y="80" width="300" height="220" rx="28" fill="url(#${g})" stroke="${HXK.DK}" stroke-width="2"/><rect x="214" y="94" width="272" height="192" rx="20" fill="#eef1f4"/>`;
 s+=`<rect x="214" y="210" width="272" height="76" fill="#3f7fd6" opacity=".4"/>`;
 s+=HXK.pipe("M60 130 H200","#7fb0e6",12,true)+HXK.pipe("M500 262 H660","#7fb0e6",12,true);
 s+=`<circle cx="330" cy="212" r="34" fill="#c9cfd3" stroke="${HXK.SE}" stroke-width="2"/><path d="M356 222 L440 262" stroke="#555" stroke-width="4"/><circle cx="446" cy="262" r="7" fill="#555"/><rect x="470" y="252" width="16" height="20" fill="#777"/>`;
 s+=`<path d="M440 100 v40" stroke="#555" stroke-width="3"/><rect x="424" y="140" width="32" height="20" rx="6" fill="#c9a24a" stroke="#6a4a12"/>`;
 s+=K.lbl(60,116,"FROM THE SHELL",{a:"start",size:12})+K.lbl(660,246,"OUT",{a:"end",size:12});
 s+=K.lbl(220,330,"FLOAT: RISES WITH THE CONDENSATE AND OPENS THE VALVE",{a:"start",size:12})+K.lbl(560,150,"THERMOSTATIC",{a:"start",size:12})+K.lbl(560,168,"AIR VENT",{a:"start",size:12})+K.arrow("M556 156 H462","var(--ink)",1.8);
 s+=K.lbl(560,282,"VALVE SEAT",{a:"start",size:12})+K.arrow("M556 276 L490 266","var(--ink)",1.8)+K.lbl(250,120,"STEAM",{size:12,fill:"#6a5a7a"})+K.lbl(256,256,"CONDENSATE",{size:12,fill:"#2f5f9e"});
 return s+K.txt(360,360,"it needs the shell pressure (plus head) to be higher than the outlet to push water through")};
const curve=(pb,h,vb)=>[...Array(23)].map((_,i)=>{const L=0.1+i*0.05;const R=mdl({load:L,pb,h,vb,pump:false});return [L*100,R.Preq]});
const steps=[
 {t:"Steam in the shell, water in the tubes",
  body:`<p>A <b>steam converter</b> (steam-to-water heat exchanger) makes heating hot water from steam. Steam fills the <b>shell</b> and condenses on a bundle of <b>U-tubes</b>. The heating water runs through the tubes.</p><p>When steam condenses it gives up its latent heat, about 960 BTU per pound, at a fixed temperature set by its pressure. At 5 psig that's about 227°F.</p><p>The condensed water (<b>condensate</b>) drains from the bottom of the shell through a steam trap.</p>`,
  draw:()=>conv(mdl({load:1,pb:0,h:1.5,vb:true}))},
 {t:"The control valve sets the shell pressure",
  body:`<p>A <b>control valve</b> on the steam line holds the leaving water at its setpoint (180°F here). It does that by changing the <b>pressure in the shell</b>, which changes the steam temperature.</p><p>At full load the shell runs at several psig. As the load drops, the valve closes and the shell pressure falls. At light load the steam only needs to be a little hotter than the water, so the shell drops <b>below atmospheric pressure</b>, into a vacuum.</p>`,
  math:`<p>Water side: Q = 500 × 40 gpm × 20°F = 400,000 BTU/h at full load, about 417 lb/h of steam.</p><p>Steam side, condensing: ε = 1 − e<sup>−UA/C</sup>. The steam temperature needed = water in + (180 − water in) ÷ ε. Its pressure comes from the steam table.</p>`,
  draw:()=>K.chart({x:90,y:40,w:540,h:270,X:[10,120],Y:[-8,12],xt:[10,30,50,70,90,110],xf:v=>v+"%",yt:[-8,-4,0,4,8,12],yf:v=>v,xl:"heating load",yl:"shell pressure, psig",title:"SHELL PRESSURE THE VALVE HOLDS",
   bands:[{y0:-8,y1:0,c:"#2f6fd6",lbl:"VACUUM"}],series:[{pts:curve(0,1.5,false),c:"#a06a8a",lbl:"shell pressure",lblAt:105,dy:-12}],vlines:[{x:100,lbl:"design"}]})},
 {t:"The F&T trap",
  body:`<p>A <b>float and thermostatic (F&T) trap</b> is the usual trap on a converter. It drains condensate continuously as it forms and holds the steam in.</p><ul><li>The <b>float</b> rises with the water level and opens the outlet valve.</li><li>The <b>thermostatic element</b> at the top vents air at startup, then closes when steam reaches it.</li></ul><p>A trap only lets water out if the pressure on its inlet is higher than on its outlet. The push it gets is the shell pressure plus the height of water above it (about 0.43 psi per foot).</p>`,
  draw:trapCut},
 {t:"The vacuum breaker",
  body:`<p>At light load, steam condenses faster than the throttled valve lets it in. The shell pulls a <b>vacuum</b>. Now the trap's inlet is below atmospheric pressure and the condensate can't get out, even to an open drain.</p><p>A <b>vacuum breaker</b> on the shell (or on the steam line after the control valve) lets air in when the shell drops below atmospheric. The shell stays at 0 psig, and condensate can drain by gravity to a vented receiver.</p><p>A stuck or capped vacuum breaker turns a well-behaved converter into a flooded, banging one.</p>`,
  draw:()=>conv(mdl({load:0.3,pb:0,h:1.5,vb:true}))},
 {t:"Stall",
  body:`<p><b>Stall</b> is when the shell pressure drops so far that the trap can't push condensate out: shell pressure plus head is no longer more than the <b>back pressure</b> on the trap outlet. That back pressure is the return line it has to lift into, or 0 psig for a vented receiver.</p><p>Condensate backs up and floods the bottom of the shell. The flooded tubes do little, the valve opens wider, the pressure rises, the water drains in a rush, and it starts over. You get <b>water hammer</b>, temperature swings and eaten-out tubes.</p><p>Here the trap lifts into a 2 psig return and sits 1.5 ft below the shell: below about 80% load it stalls.</p>`,
  draw:()=>{const pts=curve(2,1.5,false),lim=2-0.433*1.5;let x0=10;for(const [x,y] of pts)if(y>=lim){x0=x;break}
   return K.chart({x:90,y:40,w:540,h:270,X:[10,120],Y:[-8,12],xt:[10,30,50,70,90,110],xf:v=>v+"%",yt:[-8,-4,0,4,8,12],xl:"heating load",yl:"psig",title:"STALL CHART: TRAP LIFTING INTO A 2 PSIG RETURN",
    bands:[{y0:-8,y1:lim,c:"#c0392b"}],series:[{pts,c:"#a06a8a",lbl:"shell pressure",lblAt:112,dy:-12},{pts:[[10,lim],[120,lim]],c:"#c0392b",w:2,dash:"6 4",lbl:"back pressure − head",lblAt:30,a:"start",dx:0,dy:-8}],vlines:[{x:x0,c:"#c0392b",lbl:"stall below "+Math.round(x0)+"%"}]})}},
 {t:"Keeping it drained",
  body:`<p>The fixes all give the condensate a way out at every load:</p><ul><li>Mount the trap <b>well below</b> the shell outlet so it has head (Spirax Sarco suggests 0.5 to 1 m), with a <b>vacuum breaker</b> on the shell, and let it drain by gravity to a <b>vented receiver</b> and pump.</li><li>If the condensate has to lift into a return main, use a <b>pump-trap</b>: it uses steam pressure to push condensate out even when the shell is in a vacuum.</li><li>Don't oversize the converter: extra surface means lower shell pressure at every load.</li></ul><p>And always a <b>safety relief valve</b> on the shell side, set at or below the shell's rating.</p>`,
  draw:()=>conv(mdl({load:0.3,pb:2,h:1.5,vb:true,pump:true}),{pump:true})}];
/* ---------- See it ---------- */
const see=K.see({init:{load:100,pb:0,h:1.5,vb:false,pump:false},
 sliders:[["load","Heating load",10,120,5,v=>v+"%"],["pb","Back pressure on the trap",0,5,0.5,v=>v?v.toFixed(1)+" psig (lifting into a return)":"0 psig (vented receiver)"],["h","Trap below the shell outlet",0.5,4,0.5,v=>v.toFixed(1)+" ft"]],checks:[["vb","Vacuum breaker on the shell"],["pump","Pump-trap instead of a plain F&T trap"]],
 model:S=>mdl({...S,load:S.load/100}),draw:R=>conv(R),
 reads:R=>[["Shell pressure",HXK.pTxt(R.Pshell)],["Steam temperature",K.f0(R.Ts)+"°F"],["Water out",K.f1(R.Tout)+"°F",R.short],["Steam flow",K.f0(R.lbh)+" lb/h"],["Push on the trap",K.f2(R.dP)+" psi",R.dP<0.05&&!R.pump],["Condensate",R.stall?"Stalled: "+K.f0(R.flood*100)+"% flooded":"Draining",R.stall]],
 note:R=>R.stall?(R.vb&&R.pb>0?"The vacuum breaker holds the shell at 0 psig, but that's not enough to lift into the return. The shell floods and the valve hunts: water hammer.":"The shell is in a vacuum. Condensate can't get through the trap, so it floods the bottom of the shell: water hammer and temperature swings."):R.short?"The valve is wide open and the steam can't keep up: load is above what the converter can do.":R.pump&&R.dP<0.05?"Shell pressure is too low to push condensate, but the pump-trap pushes it out with motive steam.":R.vac?"The shell is in a vacuum, but the condensate still has a way out.":"",
 log:[["Load",(R,S)=>S.load+"%"],["Shell",R=>HXK.pTxt(R.Pshell)],["Push",R=>K.f2(R.dP)],["Status",R=>R.stall?"Stall":"OK"]]});
const tasks=[
 K.goal({t:"Find where it stalls",intro:"No vacuum breaker, plain F&T trap, draining to a <b>vented receiver (0 psig)</b>, trap <b>1.5 ft</b> below the shell. Set the load to the <b>highest load that stalls</b>.",
  check:(S,R)=>S.vb||S.pump||S.pb!==0||S.h!==1.5?"Set 0 psig back pressure, 1.5 ft, no vacuum breaker, no pump-trap.":!R.stall?`At ${S.load}% it still drains. Lower the load.`:mdl({...S,load:(S.load+5)/100}).stall?"It stalls here, but also at a higher load. Find the highest.":true,
  ok:(S,R)=>`It stalls at ${S.load}% and below: the shell needs ${HXK.pTxt(R.Preq)} to hold 180°F, and that plus 1.5 ft of head can't beat the receiver. Heating systems spend most of the season at part load.`}),
 K.goal({t:"Drain it at light load, twice",intro:"At <b>30% load</b>, keep it draining two ways: (1) with 0 psig back pressure, fix it with the cheapest part and log it. (2) With the trap lifting into a <b>2 psig</b> return, fix it and log it.",
  check:(S,R,L)=>{const a=L.some(l=>l.S.load===30&&l.S.pb===0&&!l.R.stall&&!l.S.pump),b=L.some(l=>l.S.load===30&&l.S.pb===2&&!l.R.stall);return a&&b?true:!a?"Log a reading at 30% load, 0 psig back pressure, draining, without the pump-trap.":"Now log one at 30% load and 2 psig back pressure that still drains."},
  ok:()=>"A vacuum breaker is enough when the trap drains to a vented receiver. Lifting into a return, the shell would need real pressure: that's the job for a pump-trap."}),
 K.caseTask({t:"Service call: banging converter in the spring",intro:"A steam converter heating a school's hot water loop bangs and the supply temperature swings 15°F. It's mild out, so the load is light. It ran fine in January. The trap lifts into a return main.",
  state:{load:.35,pb:2,h:1.5,vb:true,pump:false},model:mdl,draw:R=>conv(R),
  reads:R=>[["Load","about 35%"],["Shell gauge (swinging)","0 to 3 psig"],["Water out","165 to 182°F",true],["Return main","2 psig"]],
  actions:[["Test the trap",()=>"Isolate and test: the float opens and closes freely, the seat is tight, the thermostatic vent works."],["Check the vacuum breaker",()=>"Opens when you lift it; it isn't capped."],["Watch the sight glass on the shell",()=>"Water level rises well into the tube bundle, then drops suddenly when the valve opens wide."]],
  causes:[["stall","Stall: not enough shell pressure to lift into the return"],["trap","Failed-closed trap"],["vb","Stuck vacuum breaker"],["valve","Control valve leaking through"]],ans:"stall",
  why:"The trap and vacuum breaker are fine, and it only acts up at light load. The shell pressure falls below what's needed to lift into the 2 psig return, so the shell floods until the valve opens wide and blows it out. Fix with a pump-trap (or gravity drain to a vented receiver and a condensate pump).",hint:"Everything tests good, and it only happens at light load. What does the trap need from the shell to get water into the return?"})];
window.LESSON={id:"hx-steam",sec:"Heat exchangers",secHref:"/hx/",title:"Steam converters",lead:"How a steam-to-water converter holds its water temperature, what the F&T trap and vacuum breaker do, and why converters stall at light load.",
 steps,see,tryIntro:"Two in See it, then a light-load call.",tasks,
 job:K.job({read:["Leaving and entering water temperatures, and the setpoint.","Shell pressure gauge (a compound gauge reads vacuum too).","Steam supply pressure ahead of the control valve.","The return main pressure the trap discharges into.","A sight glass on the shell, if fitted: condensate level."],
  table:[["Saturation temperature","Pressure"],["160°F","about 20 in. Hg vacuum"],["193°F","about 9.5 in. Hg vacuum"],["212°F","0 psig"],["227°F","5 psig"],["239°F","10 psig"],["250°F","15 psig"]],tableT:"Steam pressure and temperature",
  steps:["Watch it at light load, not just at full load: that's when stall shows up.","Check that the vacuum breaker opens and isn't capped or painted over.","Test the trap (temperature both sides, ultrasonic, or a test valve) and check its strainer.","Compare shell pressure plus head (0.43 psi per foot) with the return pressure. If it can fall below, the trap needs a pump-trap or a gravity drain to a vented receiver.","Check the relief valve's set pressure against the shell rating."],stepsT:"Checking a converter",
  safety:["Steam and condensate cause severe burns. Isolate, lock out and let the shell cool and drain before opening anything.","Never open a flange or trap cap with pressure or vacuum on the shell; relieve it first.","Water hammer can crack fittings and blow gaskets: if it's banging, stand clear of flanges and get the load stable before working near it.","The shell needs a correctly sized relief valve. Never plug or cap it."],
  mistakes:["Replacing a good trap because the converter bangs: the cause is stall.","Capping a vacuum breaker because it 'spits'.","Mounting the trap right under the shell with no drop.","Oversizing the converter or the trap: bigger isn't safer here."]}),
 sources:[["The Engineering Mindset: shell and tube heat exchangers (HVAC heat exchangers explained)","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["Spirax Sarco: heat exchangers and stall","https://spiraxsarco.com/learn-about-steam/condensate-removal/heat-exchangers-and-stall"],["Spirax Sarco: practical methods of preventing stall","https://www.spiraxsarco.com/learn-about-steam/condensate-removal/practical-methods-of-preventing-stall"],["Armstrong: F&T steam trap installation and maintenance (J series)","https://armstronginternational.com/wp-content/uploads/IOM_JSeries_FloatandThermostaticSteamTrap_48_EN_20171103.pdf"]]};
})();
