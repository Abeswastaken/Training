/* ============ Mini-split model: inverter compressor, EEV, thermistors, defrost, multi-zone, faults ============
 One outdoor unit (12,000 Btu/h per head nominal), 1 to 4 wall heads. Refrigerant side is solved each tick from
 the compressor speed with the property tables (RF). Room temperatures integrate over sim time. */
const MS={};
MS.FAULTS=[["none","No fault"],["low","Low charge (30% short)"],["leak","Flare leak (losing charge)"],["over","Overcharge"],["eevC","EEV stuck nearly closed"],["eevO","EEV stuck open"],["dirtyIn","Dirty indoor coil / blower wheel"],["dirtyOut","Dirty outdoor coil"],["kink","Kinked liquid line"],["thermCoil","Indoor coil thermistor open"],["thermRoom","Room thermistor reading 6°F low"],["comm","Indoor-outdoor communication fault"],["drain","Clogged condensate drain"],["cross","Zones A and B cross-wired (multi-zone)"]];
MS.CODES={E1:"Room thermistor open or shorted",E2:"Indoor coil thermistor open or shorted",E3:"Outdoor coil thermistor open or shorted",E4:"Discharge temperature too high",E5:"Indoor-outdoor communication error",E6:"Condensate float switch / drain pump",E7:"Outdoor fan motor",P1:"High pressure or compressor overcurrent",P2:"Refrigerant shortage suspected"};
MS.ZN=["A","B","C","D"];
MS.init=(o={})=>{const n=o.heads||1;return {mode:o.mode||"cool",tout:o.tout??95,heads:n,sp:Array(4).fill(o.sp??74),tin:Array(4).fill(o.tin??80),on:Array(4).fill(true),fan:o.fan||"auto",hyper:!!o.hyper,ref:o.ref||"R-410A",
 fault:o.fault||"none",charge:o.fault==="low"?0.7:o.fault==="over"?1.25:1,frost:0,defrost:0,pan:0,t:0,Hz:0,I:0,code:null,lock:0,shHi:0,run:0,idle:[0,0,0,0]}};
const msFanF=f=>({low:0.62,med:0.82,high:1,auto:1}[f]||1);
/* solve the refrigerant side for the current compressor speed */
MS.solve=S=>{const n=S.ref,heat=S.mode==="heat"&&!S.defrost,act=[];for(let i=0;i<S.heads;i++)if(S.on[i])act.push(i);
 const disp=0.0185*(1+(S.heads-1)*0.35),f=S.fault,c=S.charge;
 const fanA=S.fan==="auto"?Math.min(1,0.6+S.Hz/150):msFanF(S.fan);
 const UAh=430*Math.pow(fanA,0.6)*(f==="dirtyIn"?0.5:1);
 const crossed=f==="cross"&&S.heads>1;
 // indoor coils that actually get refrigerant
 const fed=act.map(i=>crossed&&i<2?1-i:i);const UAin=UAh*Math.max(1,fed.length)*(S.defrost?0.4:1);
 const Tin=fed.length?fed.reduce((a,i)=>a+S.tin[i],0)/fed.length:S.tin[0];
 const UAout=1000*(1+(S.heads-1)*0.35)*(f==="dirtyOut"?0.6:1)*(1-0.55*S.frost)*Math.max(0.55,Math.min(1,0.5+S.Hz/120));
 const R={act,fed,crossed,Hz:S.Hz,UAin,UAout,Tin,fanA};
 if(S.Hz<1||!act.length&&!S.defrost){const Teq=heat?S.tout:Tin;Object.assign(R,{off:true,Te:Teq,Tc:Teq,Q:0,W:0,watts:S.heads*8,sh:0,sc:0,steps:0,Ps:RF.at(n,Math.max(RF.Tmin(n)+3,Math.min(RF.Tmax(n)-3,(Tin+S.tout)/2)),"Pd"),T2:(Tin+S.tout)/2});R.Pd=R.Ps;R.qH=Array(4).fill(0);return R}
 const evAir=heat?S.tout:(S.defrost?Tin:Tin),cdAir=heat?Tin:S.tout,UAe=heat?UAout:UAin,UAc=heat?UAin:UAout;
 const inj=S.hyper&&heat?1+0.45*Math.max(0,Math.min(1,(47-S.tout)/52)):1,liqF=c<0.95?Math.max(0.12,1-(0.95-c)*3.5):1,kinkF=f==="kink"?0.33:1,eff=S.hyper?0.68:0.64;
 let Te=evAir-18,Tc=cdAir+18,cy,mdot=0,Q=0,W=0,sh=8,sc=8,steps=200,fe=1,req=200;
 for(let k=0;k<45;k++){
  cy=RF.cycle(n,{Te,Tc,sh,sc,eff});const ve=Math.max(0.45,1-0.05*(cy.Pd/cy.Ps-1));mdot=disp*S.Hz*ve/cy.v1*inj;
  const mref=disp*60*0.9/0.45,dP=Math.max(30,cy.Pd-cy.Ps);req=200*(mdot/mref)*Math.sqrt(250/dP)/liqF;
  const avail=f==="eevC"?45:f==="eevO"?480:Math.min(480,req*(1/kinkF));steps=avail;const effSteps=avail*kinkF;
  fe=Math.min(1,effSteps/req);const over=effSteps/req;
  const shN=fe<1?8+(1-fe)*55:over>1.25?Math.max(0,8-(over-1)*22):8;sh+=0.3*(shN-sh);
  const scN=Math.max(0,Math.min(25,8+(c-1)*55+(f==="kink"?7:0)+(fe<1&&c>=0.85?(1-fe)*14:0)));sc+=0.3*(scN-sc);
  Q=mdot*60*cy.NRE*(fe<1?0.35+0.65*fe:1);W=mdot*60*cy.HOC;
  const TeN=evAir-Q/(UAe*(fe<1?0.35+0.65*fe:1))-(1-fe)*24,TcN=cdAir+(Q+W)/UAc+(c>1?(c-1)*40:0);
  Te+=0.3*(Math.max(Math.max(RF.Tmin(n)+3,S.defrost?12:-60),Math.min(evAir-1,TeN))-Te);Tc+=0.3*(Math.min(RF.Tmax(n)-3,Math.max(cdAir+2,TcN))-Tc)}
 cy=RF.cycle(n,{Te,Tc,sh,sc,eff});
 Object.assign(R,{Te,Tc,cy,mdot,Q,W,sh,sc,steps:Math.round(steps),req,fe,Ps:cy.Ps,Pd:cy.Pd,T2:n==="R-32"?cy.T2-0.25*(cy.T2-Tc):cy.T2,heat,
  watts:W/3.412/0.88+30*Math.max(1,act.length)*fanA+(S.defrost?0:45),liqT:cy.T5});
 // heat moved in each zone (Btu/h); the defrost cycle pulls a little heat from the rooms
 R.qH=Array(4).fill(0);if(!S.defrost){const qq=heat?Q+W:Q;fed.forEach(i=>{R.qH[i]=qq/fed.length})}
 return R};
MS.sense=(S,R)=>{const f=S.fault,heat=S.mode==="heat"&&!S.defrost;return {room:S.tin.map(t=>t-(f==="thermRoom"?6:0)),coilIn:f==="thermCoil"?null:R.off?S.tin[0]:heat?R.Tc-6:R.Te+3,coilOut:R.off?S.tout:heat?R.Te+2:R.Tc-6,dis:R.off?S.tout:R.T2,amb:S.tout,
 port:heat?R.Pd:R.Ps,portSide:heat?"head (gas line is the discharge in heating)":"suction"}};
/* one tick of dt sim seconds */
MS.step=(S,dt)=>{const f=S.fault,heat=S.mode==="heat";S.t+=dt;
 if(f==="leak")S.charge=Math.max(0.45,S.charge-dt/3600*0.06);
 // zone calls with hysteresis, read through the room thermistor
 const sens=S.tin.map(t=>t-(f==="thermRoom"?6:0));
 for(let i=0;i<4;i++){if(i>=S.heads){S.on[i]=false;continue}const e=heat?S.sp[i]-sens[i]:sens[i]-S.sp[i];if(S.on[i]&&e<-2&&S.Hz<=11)S.on[i]=false;else if(!S.on[i]&&e>0.5)S.on[i]=true}
 // codes that stop the system
 let code=null;if(f==="thermCoil")code="E2";if(f==="comm")code="E5";if(f==="drain"&&S.pan>=1)code="E6";if(S.lock>0){S.lock-=dt;code=S.code||"E4"}
 const any=S.on.some((o,i)=>o&&i<S.heads);
 // defrost
 if(S.defrost>0){S.defrost-=dt;S.frost=Math.max(0,S.frost-dt/240);if(S.defrost<=0){S.defrost=0}}
 let target=0;const mx=S.hyper?130:100,mn=10;
 if(!code&&(any||S.defrost)){const err=Math.max(...S.on.map((o,i)=>o&&i<S.heads?(heat?S.sp[i]-sens[i]:sens[i]-S.sp[i]):-9));
  const raw=30+14*err+S.I;if(!((raw>=mx&&err>0)||(raw<=mn&&err<0)))S.I=Math.max(-25,Math.min(70,S.I+err*dt/60*0.9));
  target=S.defrost?70:Math.max(mn,Math.min(mx,30+14*err+S.I));if(S.run<180&&!S.defrost)target=Math.min(target,40);S.run+=dt}else{S.run=0}
 const rate=dt*1.0;S.Hz+=Math.max(-rate,Math.min(rate,target-S.Hz));if(target===0&&S.Hz<10)S.Hz=0;
 const R=MS.solve(S);
 if(heat&&!S.defrost&&S.Hz>0){const Tcoil=R.Te;if(Tcoil<30&&S.tout<42)S.frost=Math.min(1,S.frost+dt/3600*1.4*Math.max(0.2,Math.min(1,(S.tout+5)/40)));if(S.frost>0.7){S.defrost=300}}
 if(!code&&R.T2>235){S.lock=180;S.code="E4"}
 if(!code&&R.sh>28&&S.Hz>20){S.shHi+=dt;if(S.shHi>900){S.lock=600;S.code="P2";S.shHi=0}}else S.shHi=Math.max(0,S.shHi-dt);
 // condensate: cooling pulls moisture (about 1 pint per hour per 12,000 Btu/h of coil load)
 if(!heat&&!S.defrost&&R.Q>0&&R.Te<55){const pints=R.Q/12000*dt/3600*1.2;if(f==="drain")S.pan=Math.min(1.2,S.pan+pints/0.7);}
 S.code=code||(S.lock>0?S.code:null);
 // rooms: envelope load plus what the head moves
 for(let i=0;i<S.heads;i++){const load=250*(S.tout-S.tin[i])+(heat?600:1200);const q=heat?R.qH[i]:-R.qH[i];S.tin[i]+=(load+q)*dt/3600/1300}
 S.R=R;return R};
/* ---------- drawing ---------- */
MS.defs=()=>`<defs><pattern id="zGrille" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#cfd5d9"/><path d="M0 3H6" stroke="#8d969c" stroke-width="1.6"/></pattern>
 <pattern id="zFins" width="3" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="#c9cfd3"/><path d="M1.5 0V10" stroke="#8a9398" stroke-width="1"/></pattern>
 <linearGradient id="zCab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f5f2"/><stop offset="1" stop-color="#d3d6d2"/></linearGradient>
 <linearGradient id="zSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4c555b"/><stop offset=".45" stop-color="#9aa4aa"/><stop offset="1" stop-color="#3d454a"/></linearGradient>
 <linearGradient id="zBrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c36a"/><stop offset=".5" stop-color="#c79a33"/><stop offset="1" stop-color="#8c6a1c"/></linearGradient>
 <pattern id="zTan" width="40" height="12" patternUnits="userSpaceOnUse"><rect width="40" height="12" fill="#b99a74"/><path d="M0 11.5H40M20 0V12" stroke="#9c7f5c" stroke-width="1"/></pattern></defs>`;
MS.headSVG=(x,y,s,o)=>{const id=K.uid("hd");const lv=o.on?(o.heat?28:12):0;
 let g=`<g transform="translate(${x} ${y}) scale(${s})"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef1f3"/><stop offset="1" stop-color="#cfd5d9"/></linearGradient></defs>
 <rect x="0" y="0" width="190" height="58" rx="14" fill="url(#${id})" stroke="#9aa3aa" stroke-width="1.5"/><rect x="8" y="6" width="174" height="14" rx="6" fill="url(#zGrille)" opacity=".5"/>
 <path d="M14 50 Q95 ${54+lv*0.25} 176 50" stroke="#aeb6bb" stroke-width="5" fill="none" transform="rotate(${lv*0.15} 95 50)"/>
 <rect x="128" y="28" width="46" height="18" rx="3" fill="#15191c"/><text x="151" y="42" class="lsLcd${o.code?" lsPulse":""}" style="font-size:12px${o.code?";fill:#ff6b5a":""}">${o.code||(o.on?K.f0(o.sp)+"°":"--")}</text>
 <circle cx="20" cy="36" r="3" fill="${o.code?"#ff6b5a":o.on?"#7CFFB2":"#3a4247"}"/>`;
 if(o.flow&&o.on){const col=K.tcol(o.supply);for(let k=0;k<3;k++)g+=`<path d="M${40+k*50} 62 q${o.heat?-6:6} 26 ${o.heat?-20:14} 50" stroke="${col}" stroke-width="3" fill="none" stroke-dasharray="7 6" class="lsFlow" opacity=".85"/>`}
 if(o.drip)g+=`<g class="lsDrip"><path d="M30 60 q-4 8 0 10 q4 -2 0 -10" fill="#3a8bd6"/><path d="M60 60 q-4 8 0 10 q4 -2 0 -10" fill="#3a8bd6"/></g><rect x="20" y="${70+0}" width="60" height="4" rx="2" fill="#3a8bd6" opacity=".4"/>`;
 return g+`</g>`};
MS.outSVG=(x,y,S,R,o={})=>{const spin=S.Hz>0&&!S.defrost;let g=`<g transform="translate(${x} ${y})">`;
 g+=`<rect x="-6" y="168" width="272" height="14" rx="2" fill="#a9a196"/><rect x="0" y="0" width="260" height="170" rx="6" fill="url(#zCab)" stroke="#5f686d" stroke-width="1.5"/>`;
 g+=`<rect x="6" y="6" width="248" height="10" fill="url(#zFins)" opacity=".7"/>`;
 // fan grille
 g+=`<circle cx="92" cy="90" r="64" fill="#2a2f33"/><g ${spin?`class="lsSpinY" style="transform-origin:92px 90px;animation-duration:${(60/Math.max(10,S.Hz*8)).toFixed(2)}s"`:""}>${[0,120,240].map(a=>`<path d="M92 90 q30 -26 52 -6 q-20 10 -52 6" fill="#6b747a" transform="rotate(${a} 92 90)"/>`).join("")}</g><circle cx="92" cy="90" r="9" fill="#3a4247"/>`;
 for(let r=20;r<=64;r+=11)g+=`<circle cx="92" cy="90" r="${r}" fill="none" stroke="#9aa3aa" stroke-width="1.4"/>`;
 g+=`<path d="M28 90 H156 M92 26 V154" stroke="#9aa3aa" stroke-width="1.4"/>`;
 // frost and defrost steam
 if(S.frost>0.05)g+=`<rect x="6" y="6" width="248" height="158" rx="4" fill="#dff1ff" opacity="${(0.15+S.frost*0.5).toFixed(2)}"/>`;
 if(S.defrost)g+=`<g class="lsBub">${[60,110,160].map(xx=>`<path d="M${xx} 0 q-12 -16 0 -30 q12 -14 0 -30" stroke="#dfe7ec" stroke-width="8" fill="none" opacity=".8"/>`).join("")}</g>`;
 // service panel cutaway: compressor and EEV
 g+=`<rect x="170" y="22" width="84" height="142" rx="4" fill="#3a4247"/><rect x="182" y="70" width="44" height="80" rx="20" fill="url(#zSteel)" stroke="#2a2f33"/><text x="204" y="114" class="lsLcd" style="font-size:12px">${S.Hz>0?K.f0(S.Hz)+"Hz":"OFF"}</text>`;
 g+=`<rect x="230" y="40" width="14" height="22" rx="3" fill="url(#zBrass)" stroke="#5a4310"/><rect x="228" y="28" width="18" height="14" rx="3" fill="#2a2f33"/>`+K.txt(237,76,"EEV",{fill:"#dfe5e8"});
 // service valves
 g+=`<rect x="256" y="120" width="22" height="12" fill="url(#zBrass)" stroke="#5a4310"/><rect x="256" y="142" width="22" height="16" fill="url(#zBrass)" stroke="#5a4310"/>`;
 if(f_leak(S))g+=`<ellipse cx="270" cy="160" rx="12" ry="5" fill="#6b5a2a" opacity=".55"/>`;
 return g+`</g>`};
const f_leak=S=>S.fault==="leak";
/* whole scene: rooms on the left, outdoor unit on the right. viewBox 0 0 900 520 */
MS.scene=(S,R,o={})=>{const n=S.heads,heat=S.mode==="heat"&&!S.defrost,sens=MS.sense(S,R),UX=588,UY=298;let s=MS.defs()+`<rect x="0" y="0" width="900" height="520" fill="var(--bg)"/>`;
 s+=`<rect x="560" y="0" width="340" height="470" fill="#d6e6f2"/><rect x="560" y="470" width="340" height="50" fill="#8c9a6a"/><rect x="0" y="470" width="560" height="50" fill="url(#zTan)"/>`;
 const top=14,H=456/n,run=S.Hz>0&&!S.code&&!S.defrost;
 for(let i=0;i<n;i++){const y=top+i*H,on=S.on[i]&&run,fed=R.fed&&R.fed.includes(i),hh=H-8;
  const supply=heat?(R.Tc||S.tin[i])-12:(R.Te||S.tin[i])+12;
  s+=`<rect x="20" y="${y}" width="540" height="${hh}" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>`;
  // room details: window and floor line, plus a couch when there's room for it
  if(hh>120){const wy=y+Math.min(70,hh*0.28),wh=Math.min(120,hh*0.4);s+=`<rect x="48" y="${wy}" width="110" height="${wh}" fill="#d6e6f2" stroke="#8d969c" stroke-width="3"/><path d="M103 ${wy} V${wy+wh} M48 ${wy+wh/2} H158" stroke="#8d969c" stroke-width="2"/>`}
  if(n===1)s+=`<path d="M200 ${y+hh-14} v-46 q0 -10 10 -10 h150 q10 0 10 10 v46" fill="#c9b79c" stroke="#8a7a62" stroke-width="2"/><rect x="190" y="${y+hh-44}" width="190" height="30" rx="8" fill="#d8c7ab" stroke="#8a7a62" stroke-width="2"/>`;
  const sc=n>2?0.72:n>1?0.95:1.35,hx=540-190*sc-12,hy=y+16;
  s+=MS.headSVG(hx,hy,sc,{on:on||S.on[i]&&!!S.code,sp:S.sp[i],code:S.code,flow:on&&fed,heat,supply,drip:S.fault==="drain"&&S.pan>=1&&i===0});
  const ty=y+Math.min(hh-30,n>2?60:hh>200?hh*0.62:78),tx=n>1?250:430;
  s+=K.lbl(36,y+24,n>1?"ZONE "+MS.ZN[i]:"ROOM",{a:"start",size:14})+K.lbl(tx,ty,K.f1(S.tin[i])+"°F",{size:n>2?22:30,fill:K.tcol(S.tin[i])})+K.txt(tx,ty+20,"set "+S.sp[i]+"°F"+(S.on[i]?" · calling":" · satisfied"));
  // line set: out the back of the head, down the outside wall, over to the service valves
  const ly=hy+30*sc,wx=572+i*7,ry=UY-16-i*7,vx=UX+290+(3-i)*0;
  const p1=`M${hx+190*sc} ${ly} H${wx} V${ry} H${UX+278-i*4} V${UY+126}`,p2=`M${hx+190*sc} ${ly+8} H${wx+3} V${ry+4} H${UX+267-i*4} V${UY+150}`;
  s+=`<path d="${p1}" stroke="#1b1f22" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="${p2}" stroke="#3a4247" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
  if(on&&fed)s+=`<path d="${p1}" stroke="${heat?"#e0805a":"#6fa4e0"}" stroke-width="2" fill="none" stroke-dasharray="6 8" class="lsFlow"/>`;
  s+=`<path d="M${hx+20*sc} ${hy+58*sc} V${hy+66*sc} H${hx+190*sc+4}" stroke="#f2f2f0" stroke-width="3" fill="none" opacity=".9"/>`}
 s+=`<rect x="556" y="0" width="12" height="470" fill="#b9b2a6"/>`;
 s+=MS.outSVG(UX,UY,S,R);
 s+=K.lbl(UX+130,UY-40-n*7,"OUTDOOR "+K.f0(S.tout)+"°F",{size:15});
 if(S.defrost)s+=K.tag(UX+130,UY-64-n*7,"DEFROST",{fill:"#2f6fd6"});
 if(o.therm){const t=(x,y,lab,v,a)=>`<circle cx="${x}" cy="${y}" r="5" fill="#d23a26" stroke="#fff" stroke-width="1.5"/>`+K.tag(a==="end"?x-8:x+8,y-10,lab+" "+(v==null?"OPEN":K.f0(v)+"°"),{a:a||"start",fill:"#d23a26"});
  const hx=540-190*(n>2?0.72:n>1?0.95:1.35)-12;
  s+=t(hx+60,top+40,"COIL",sens.coilIn,"end")+t(UX+40,UY+60,"OUT COIL",sens.coilOut)+t(UX+204,UY+92,"DISCH",sens.dis,"end")+t(UX+250,UY+12,"AMB",sens.amb,"end")}
 return s};
