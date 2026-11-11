/* ============ Psychrometrics section kit: altitude, mixing, process loads, equipment drawings ============
 Builds on the airflow kit (AK.PSY, AK.psy). AK.PSY.P is the barometric pressure the equations use, so PK.at() runs any
 calculation or chart at another elevation. */
const PK={};
(()=>{const P=AK.PSY;
/* standard atmosphere, psia at an elevation in feet (ASHRAE Fundamentals ch. 1) */
PK.Palt=ft=>14.696*Math.pow(1-6.8754e-6*ft,5.2559);
PK.DF=ft=>PK.Palt(ft)/14.696;                                  // density factor against standard air
PK.at=(p,fn)=>{const o=P.P;P.P=p;try{return fn()}finally{P.P=o}};
PK.st=(T,W)=>({T,W,gr:W*7000,rh:Math.min(1,P.rh(T,W)),wb:P.wb(T,W),dp:P.dew(W),h:P.h(T,W),v:P.v(T,W)});
PK.rh=(T,rh)=>PK.st(T,Math.min(P.Wrh(T,rh),P.Ws(T)));
/* mix by airflow share f of stream b (the field formula: straight line between the two points) */
PK.mix=(a,b,f)=>PK.st(a.T+(b.T-a.T)*f,a.W+(b.W-a.W)*f);
/* loads from state a to state b, standard-air constants times a density factor */
PK.load=(a,b,cfm,df=1)=>{const qs=1.08*df*cfm*(b.T-a.T),qt=4.5*df*cfm*(b.h-a.h),ql=qt-qs;return {qs,ql,qt,shr:Math.abs(qt)>1?qs/qt:1,lb:4.5*df*cfm*(b.W-a.W)}};
/* name the process from the direction of travel */
PK.name=(a,b)=>{const dT=b.T-a.T,dG=(b.W-a.W)*7000,t=Math.abs(dT)<0.6?0:Math.sign(dT),g=Math.abs(dG)<1.2?0:Math.sign(dG);
 return {"0,0":"No change","1,0":"Sensible heating","-1,0":"Sensible cooling","0,1":"Humidifying (steam)","0,-1":"Dehumidifying","1,1":"Heating and humidifying","-1,-1":"Cooling and dehumidifying","-1,1":"Evaporative cooling / humidifying","1,-1":"Heating and drying (desiccant)"}[t+","+g]};
const n0=v=>Math.round(v).toLocaleString("en-US");PK.n0=n0;
const lcd=(x,y,lab,val,w=104)=>`<rect x="${x-w/2}" y="${y-14}" width="${w}" height="44" rx="5" fill="#15191c" stroke="#3a4247"/><text x="${x}" y="${y+2}" style="font:600 11px var(--cond,sans-serif);letter-spacing:.08em;fill:#9fb0b8;text-anchor:middle">${lab}</text><text x="${x}" y="${y+22}" style="font-family:var(--mono);font-size:16px;fill:#7CFFB2;text-anchor:middle">${val}</text>`;
PK.lcd=lcd;
/* a bank of damper blades in a frame. open 0..1; vertical frame at x, from y1 to y2 (air moving left-right), or horizontal with o.h */
PK.damper=(x,y1,y2,open,o={})=>{const n=o.n||5,len=(y2-y1)/n,ang=(1-open)*82*(o.h?1:1);let s="";
 if(o.h){s+=`<rect x="${y1}" y="${x-5}" width="${y2-y1}" height="10" fill="#5f686d" stroke="#2a2f33"/>`;
  for(let i=0;i<n;i++){const cx=y1+len*(i+0.5);s+=`<g transform="translate(${cx} ${x}) rotate(${90-ang+ (i%2?2*ang-180:0)})"><rect x="${-len/2+1}" y="-2.5" width="${len-2}" height="5" rx="2" fill="url(#zAlu)" stroke="#2a2f33" stroke-width=".8"/></g><circle cx="${cx}" cy="${x}" r="2.4" fill="#2a2f33"/>`}
  return s}
 s+=`<rect x="${x-5}" y="${y1}" width="10" height="${y2-y1}" fill="#5f686d" stroke="#2a2f33"/>`;
 for(let i=0;i<n;i++){const cy=y1+len*(i+0.5);s+=`<g transform="translate(${x} ${cy}) rotate(${(i%2?-1:1)*ang})"><rect x="-2.5" y="${-len/2+1}" width="5" height="${len-2}" rx="2" fill="url(#zAlu)" stroke="#2a2f33" stroke-width=".8"/></g><circle cx="${x}" cy="${cy}" r="2.4" fill="#2a2f33"/>`}
 return s};
/* actuator box with a crank arm */
const act=(x,y)=>`<rect x="${x-17}" y="${y-11}" width="34" height="22" rx="3" fill="#e2a614" stroke="#6b4e00"/><rect x="${x-12}" y="${y-6}" width="14" height="12" rx="2" fill="#2a2f33"/><circle cx="${x+9}" cy="${y}" r="3.4" fill="#2a2f33"/>`;
/* ---------- mixing box (720 x 380): outside air in at left, return air down from the top, mixed air out right through the filter ----------
 R: {oa:{T,W}, ra:{T,W}, ma:{T,W}, f (outside air share 0..1)} */
PK.mixbox=(R,o={})=>{const f=R.f;let s="";
 /* outside wall and louver */
 s+=`<rect x="24" y="60" width="26" height="300" fill="url(#zBrick)" stroke="#5a3d2e"/><rect x="24" y="170" width="26" height="130" fill="#2a2f33"/>`;
 for(let i=0;i<7;i++)s+=`<path d="M22 ${180+i*17} l30 12" stroke="#aeb6bb" stroke-width="5" stroke-linecap="round"/>`;
 /* ducts: OA horizontal, RA drop from top, relief stub up-left, box, mixed air to the right */
 s+=`<rect x="50" y="170" width="180" height="130" fill="#e9edef" stroke="${AK.SE}" stroke-width="2"/>`;
 s+=`<rect x="300" y="20" width="130" height="150" fill="#e9edef" stroke="${AK.SE}" stroke-width="2"/>`;
 s+=`<rect x="230" y="150" width="270" height="170" rx="3" fill="#dfe4e7" stroke="${AK.SE}" stroke-width="2.4"/>`;
 s+=`<rect x="500" y="170" width="200" height="130" fill="#e9edef" stroke="${AK.SE}" stroke-width="2"/>`;
 s+=`<rect x="50" y="162" width="180" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/><rect x="50" y="300" width="180" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/><rect x="500" y="162" width="200" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/><rect x="500" y="300" width="200" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/>`;
 /* dampers: OA opens with f, RA closes as f opens (linked) */
 s+=PK.damper(230,174,296,Math.max(0.04,f),{n:5})+PK.damper(160,304,426,Math.max(0.04,1-f),{h:1,n:5});
 s+=act(250,136)+act(452,136)+`<path d="M267 136 H435" stroke="#2a2f33" stroke-width="2.4" stroke-dasharray="7 4"/>`+K.txt(476,141,"linked",{a:"start"});
 /* filter bank */
 s+=`<rect x="486" y="156" width="18" height="158" rx="2" fill="#6d767b" stroke="${AK.SE}"/>`+zFilter(489,160,12,150,K.uid("pf"));
 /* air streams, colored by temperature, thickness by share */
 const wO=1.5+7*f,wR=1.5+7*(1-f),tO=R.oa.T,tR=R.ra.T,tM=R.ma.T;
 if(f>0.02)s+=[205,235,265].map(y=>AK.air(`M56 ${y} H222`,tO,wO*0.6)).join("")+AK.aarrow("M96 286 h40",tO);
 if(f<0.98)s+=[335,365,395].map(x=>AK.air(`M${x} 26 V152`,tR,wR*0.6)).join("")+AK.aarrow("M412 50 v40",tR);
 if(f>0.02)s+=AK.air("M240 215 C330 215 380 225 480 228",tO,wO*0.5);if(f<0.98)s+=AK.air("M365 168 C365 220 400 245 480 250",tR,wR*0.5);
 s+=[205,235,265].map(y=>AK.air(`M512 ${y} H694`,tM,4)).join("")+AK.aarrow("M610 286 h44",tM);
 s+=K.lbl(140,154,"OUTSIDE AIR",{size:13})+K.lbl(365,14,"RETURN AIR",{size:13})+K.lbl(600,154,"MIXED AIR",{size:13})+K.txt(495,338,"filter");
 const rd=(st)=>K.f1(st.T)+"°F "+Math.round(st.rh*100)+"%";
 s+=lcd(140,330,"OAT / RH",rd(R.oa),128)+lcd(560,64,"RAT / RH",rd(R.ra),128)+lcd(600,330,"MAT / RH",rd(R.ma),128);
 s+=K.tag(352,352,Math.round(f*100)+"% OUTSIDE AIR",{fill:"#2f6fd6",w:170});
 if(o.title)s+=K.lbl(20,374,o.title,{a:"start",size:13});
 return s};
/* ---------- steam humidifier in a supply duct (720 x 380) ----------
 R: {in:{T,W}, out:{T,W}, lb (lb/hr of steam), sat (true when the duct air is saturated), on} */
PK.steam=(R,o={})=>{let s="";const yT=70,yB=210;
 s+=`<rect x="20" y="${yT}" width="680" height="${yB-yT}" fill="#e9edef" stroke="${AK.SE}" stroke-width="2"/><rect x="20" y="${yT-8}" width="680" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/><rect x="20" y="${yB}" width="680" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/>`;
 /* dispersion tube with steam ports */
 s+=`<rect x="196" y="${yT+6}" width="12" height="${yB-yT-12}" rx="5" fill="url(#zSteel)" stroke="#2a2f33"/>`+[0,1,2,3,4,5].map(i=>`<circle cx="208" cy="${yT+22+i*20}" r="2" fill="#2a2f33"/>`).join("");
 if(R.on!==false&&R.lb>0.5){const k=Math.min(1,R.lb/80);for(let i=0;i<6;i++)s+=`<path d="M210 ${yT+22+i*20} q${30+50*k} ${-8+i*3} ${70+120*k} 0" fill="none" stroke="#fff" stroke-width="${5+5*k}" stroke-linecap="round" opacity=".8"><animate attributeName="opacity" values=".85;.35;.85" dur="${1.4+i*0.2}s" repeatCount="indefinite"/></path>`}
 if(R.sat)s+=[0,1,2,3,4].map(i=>`<circle class="lsBub" style="animation-direction:reverse;animation-delay:${i*0.3}s" cx="${330+i*50}" cy="${yB-5}" r="3" fill="#3f9fd6"/>`).join("")+`<rect x="300" y="${yB-4}" width="300" height="4" fill="#5fa8e0"/>`+K.tag(450,yB-22,"DUCT IS WET",{fill:"#c0392b",w:120});
 /* steam hose down to the humidifier cabinet */
 s+=`<path d="M202 ${yB+8} V262 H150" fill="none" stroke="#23272a" stroke-width="12" stroke-linejoin="round"/><path d="M202 ${yB+8} V262 H150" fill="none" stroke="#565e63" stroke-width="2" stroke-dasharray="3 5"/>`;
 s+=`<rect x="58" y="236" width="96" height="130" rx="6" fill="url(#zCab)" stroke="${AK.SE}" stroke-width="1.5"/><rect x="64" y="250" width="62" height="24" rx="3" fill="#15191c"/><text x="95" y="267" style="font-family:var(--mono);font-size:12px;fill:#7CFFB2;text-anchor:middle">${Math.round(R.lb)} lb/h</text><rect x="74" y="284" width="64" height="70" rx="8" fill="#f4f1e6" stroke="#8a8676"/><rect x="74" y="${354-Math.min(60,20+R.lb/2)}" width="64" height="${Math.min(60,20+R.lb/2)}" rx="6" fill="#8ec5ea" opacity=".8"/><circle cx="132" cy="262" r="5" fill="${R.lb>0.5?"#3fbf6a":"#555"}"/>`;
 s+=K.txt(106,378,"steam generator");
 /* airflow switch and high limit humidistat */
 s+=`<rect x="90" y="${yT-34}" width="40" height="26" rx="3" fill="url(#zPlastic)" stroke="#222"/><path d="M110 ${yT-8} V${yT+34}" stroke="#2a2f33" stroke-width="2"/><rect x="100" y="${yT+34}" width="20" height="26" rx="2" fill="#aeb6bb" stroke="#2a2f33"/>`+K.txt(110,yT-42,"airflow switch");
 const hx=o.hl||585;
 s+=`<rect x="${hx-25}" y="${yT-36}" width="50" height="28" rx="3" fill="url(#zPlastic)" stroke="#222"/><path d="M${hx} ${yT-8} V${yT+40}" stroke="#8a6a2a" stroke-width="5"/>`+K.txt(Math.max(hx,330),yT-44,"high limit humidistat");
 s+=`<path d="M208 ${yB+26} H${hx}" stroke="var(--muted)" stroke-width="1.4"/><path d="M208 ${yB+20} v12M${hx} ${yB+20} v12" stroke="var(--muted)" stroke-width="1.4"/>`+K.txt(o.hl?hx+10:396,o.hl?yB+31:yB+22,o.hlT||"10 ft or more",o.hl?{a:"start"}:{});
 /* air */
 [100,140,180].forEach(y=>{s+=AK.air(`M26 ${y} H190`,R.in.T,3)+AK.air(`M214 ${y} H694`,R.out.T,3)});s+=AK.aarrow(`M40 ${yB-12} h40`,R.in.T)+AK.aarrow(`M640 ${yB-12} h40`,R.out.T);
 const rd=st=>K.f1(st.T)+"°F "+Math.round(Math.min(1,st.rh)*100)+"%";
 s+=lcd(300,296,"BEFORE",rd(R.in),128)+lcd(450,296,"AFTER",rd(R.out),128)+lcd(600,296,"GRAINS ADDED",Math.round((R.out.W-R.in.W)*7000)+" gr/lb",128);
 if(o.title)s+=K.lbl(360,352,o.title,{size:13});
 return s};
/* ---------- evaporative (swamp) cooler cutaway (720 x 380) ----------
 R: {in:{T,W}, out:{T,W}, eff, dry (pads not wetted), gph} */
PK.evap=(R,o={})=>{let s="";const dry=R.dry;
 s+=`<rect x="150" y="60" width="300" height="250" rx="6" fill="url(#zCab)" stroke="${AK.SE}" stroke-width="2"/><rect x="160" y="70" width="280" height="206" fill="#2f3438"/>`;
 /* pad on the intake side, behind louvers */
 s+=`<rect x="164" y="78" width="44" height="194" fill="${dry?"#b9a36c":"#7d8f4a"}" stroke="#4a4a2a"/>`;
 for(let i=0;i<13;i++)s+=`<path d="M164 ${86+i*15} l44 9M164 ${95+i*15} l44 -9" stroke="${dry?"#8a7a4c":"#5a6b30"}" stroke-width="1.2"/>`;
 for(let i=0;i<9;i++)s+=`<path d="M146 ${84+i*22} l14 9" stroke="#aeb6bb" stroke-width="5" stroke-linecap="round"/>`;
 /* sump, pump, riser, distribution trough, float valve */
 s+=`<rect x="160" y="276" width="280" height="28" fill="#59626a"/><rect x="162" y="${dry?298:284}" width="276" height="${dry?4:18}" fill="#5fa8e0" opacity=".85"/>`;
 s+=`<rect x="250" y="262" width="26" height="34" rx="3" fill="url(#zMotor)" stroke="#222"/><path d="M263 262 V76 H186" fill="none" stroke="#1d2327" stroke-width="5"/><rect x="166" y="70" width="42" height="9" fill="#3d4448"/>`;
 if(!dry)s+=[0,1,2].map(i=>`<circle class="lsBub" style="animation-direction:reverse;animation-delay:${i*0.4}s" cx="${174+i*13}" cy="150" r="2.6" fill="#8ed0ff"/>`).join("");
 s+=`<path d="M440 290 H410" stroke="#b87333" stroke-width="4"/><path d="M410 290 l-34 -8" stroke="#8a6a2a" stroke-width="2.4"/><ellipse cx="370" cy="281" rx="12" ry="7" fill="#d9822b" stroke="#7a4310"/>`;
 /* blower and discharge duct */
 s+=zBlower(350,176,52,K.uid("eb"));
 s+=`<rect x="450" y="126" width="250" height="100" fill="#e9edef" stroke="${AK.SE}" stroke-width="2"/><rect x="450" y="118" width="250" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/><rect x="450" y="226" width="250" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/>`;
 [100,150,200,250].forEach(y=>{s+=AK.air(`M20 ${y} H142`,R.in.T,3)});s+=AK.aarrow("M40 284 h44",R.in.T);
 [150,176,202].forEach(y=>{s+=AK.air(`M214 ${y} H296`,R.out.T,2.4)+AK.air(`M404 ${y} H694`,R.out.T,3)});s+=AK.aarrow("M620 214 h44",R.out.T);
 s+=K.lbl(186,52,dry?"DRY PADS":"WET PADS",{size:13,fill:dry?"#c0392b":undefined})+K.txt(263,326,"pump")+K.txt(380,326,"float valve")+K.txt(350,100,"blower")+K.txt(196,326,"sump");
 const rd=st=>K.f1(st.T)+"°F "+Math.round(Math.min(1,st.rh)*100)+"%";
 s+=lcd(74,40,"OUTDOOR AIR",rd(R.in),128)+lcd(576,84,"SUPPLY AIR",rd(R.out),128)+lcd(576,280,"WATER USED",R.gph.toFixed(1)+" gal/h",128);
 if(o.title)s+=K.lbl(360,372,o.title,{size:13});
 return s};
})();
