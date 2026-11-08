/* ============ Controls lesson kit: pneumatic parts, spring ranges, DDC points, sensors and signal scaling ============
 Same numbers as the Controls trainer (src/ctl.js): main air 20 psi, DA thermostat about 8 psi at setpoint, 2.5 psi per °F,
 heating valve NO 3 to 7 psi, cooling valve NC 9 to 13 psi, 10K Type II thermistors, 2 to 10 V actuators. */
const CTK={};
CTK.AIR="#14928c";CTK.HW="#d23a26";CTK.HWR="#a8321f";CTK.CW="#2f6fd6";CTK.CWR="#7a5cd0";CTK.WIRE="#5b6369";
CTK.cl=(v,a,b)=>Math.max(a,Math.min(b,v));
/* control air tube color: gray when empty, deeper teal as pressure rises */
CTK.pc=p=>p<0.3?"#9aa3a9":`hsl(176,${Math.round(55+p)}%,${Math.round(CTK.cl(58-p*1.4,30,58))}%)`;
CTK.tube=(d,p,w=5)=>`<path d="${d}" stroke="#4d555a" stroke-width="${w+2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${CTK.pc(p)}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
CTK.pipe=(d,c,w=9)=>`<path d="${d}" stroke="#3f464b" stroke-width="${w+2}" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".35" stroke-linejoin="round" transform="translate(0 -2)"/>`;
CTK.wire=(d,c)=>`<path d="${d}" stroke="${c||CTK.WIRE}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
/* stroke fraction of a spring range: 0 below the start, 1 above the end */
CTK.stroke=(p,a,b)=>CTK.cl((p-a)/(b-a),0,1);
/* pneumatic thermostat branch pressure: about 8 psi at setpoint, sens psi per °F, DA rises as the room warms, RA falls. Limited 0 to main air. */
CTK.branch=(T,sp,da,sens,main)=>CTK.cl(8+(da?1:-1)*sens*(T-sp),0,main);
/* ---------- pressure gauge ---------- */
CTK.gauge=(cx,cy,r,v,max,lbl,o={})=>{const st=o.step||(max<=30?5:max<=60?10:20);let s=`<circle cx="${cx}" cy="${cy}" r="${r+5}" fill="#5f686d"/><circle cx="${cx}" cy="${cy}" r="${r+2}" fill="#c9d0d4"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfbf8" stroke="#8d969b"/>`;
 for(let i=0;i<=max;i+=st/5){const a=(-135+270*i/max)*Math.PI/180,maj=Math.abs(i/st-Math.round(i/st))<1e-6,r1=r-(maj?r*.2:r*.1);s+=`<path d="M${(cx+r1*Math.sin(a)).toFixed(1)} ${(cy-r1*Math.cos(a)).toFixed(1)} L${(cx+(r-2)*Math.sin(a)).toFixed(1)} ${(cy-(r-2)*Math.cos(a)).toFixed(1)}" stroke="#222" stroke-width="${maj?1.6:.8}"/>`;
  if(maj){const r2=r*.6;s+=`<text x="${(cx+r2*Math.sin(a)).toFixed(1)}" y="${(cy-r2*Math.cos(a)+r*.09).toFixed(1)}" style="font:600 ${Math.round(r*.22)}px var(--body);fill:#222;text-anchor:middle">${i}</text>`}}
 const a=-135+270*CTK.cl(v/max,0,1.04);s+=`<text x="${cx}" y="${cy+r*.55}" style="font:600 ${Math.round(r*.18)}px var(--body);fill:#666;text-anchor:middle">${o.unit||"PSI"}</text>`;
 s+=`<path d="M${cx} ${cy+r*.12} L${cx} ${cy-r*.85}" stroke="#c0281c" stroke-width="2.4" transform="rotate(${a.toFixed(1)} ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="${r*.09+2}" fill="#222"/>`;
 if(lbl)s+=K.lbl(cx,cy-r-14,lbl,{size:o.ls||14});if(o.read)s+=K.lcd(cx,cy+r+28,o.read,o.rw||84);return s};
/* ---------- pneumatic room thermostat, cover off ---------- */
CTK.tstat=(x,y,o={})=>{const d=CTK.cl((o.room??72)-(o.sp??72),-4,4),bend=d*3*(o.da===false?-1:1);
 let s=`<rect x="${x}" y="${y}" width="120" height="160" rx="10" fill="url(#zPlastic)" stroke="#8f8a7f" stroke-width="1.5"/><rect x="${x+10}" y="${y+10}" width="100" height="140" rx="6" fill="#e9e4d8" stroke="#b3ad9f"/>`;
 s+=`<path d="M${x+26} ${y+132} Q${x+30+bend} ${y+80} ${x+70+bend*1.6} ${y+46}" stroke="#b5651d" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${x+26} ${y+132} Q${x+30+bend} ${y+80} ${x+70+bend*1.6} ${y+46}" stroke="#c9c9c9" stroke-width="2" fill="none" transform="translate(3 2)"/>`;
 s+=`<rect x="${x+56+bend*1.6}" y="${y+40}" width="40" height="5" rx="1" fill="#5f686d"/><rect x="${x+82}" y="${y+48}" width="9" height="22" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".8"/>`;
 s+=`<circle cx="${x+60}" cy="${y+100}" r="16" fill="url(#zPlasticDk)" stroke="#2a2f33"/><path d="M${x+60} ${y+100} L${x+60} ${y+86}" stroke="#fff" stroke-width="2"/>`;
 s+=`<text x="${x+86}" y="${y+124}" style="font:700 13px var(--display);fill:#5a5348;text-anchor:middle">${o.da===false?"RA":"DA"}</text>`;
 if(o.ports!==false)s+=`<circle cx="${x+40}" cy="${y+160}" r="5" fill="url(#zBrass)" stroke="#6a4a12"/><circle cx="${x+80}" cy="${y+160}" r="5" fill="url(#zBrass)" stroke="#6a4a12"/>`+K.txt(x+40,y+180,"M")+K.txt(x+80,y+180,"B");
 return s};
/* ---------- globe valve with pneumatic diaphragm (pn) or electric (el) actuator. open 0..1, x = stem stroke 0..1 ---------- */
CTK.valve=(cx,cy,o={})=>{const sc=o.s||1,op=CTK.cl(o.open??1,0,1),x=CTK.cl(o.x??0,0,1);
 let s=`<g transform="translate(${cx} ${cy}) scale(${sc})">`;
 s+=`<rect x="-46" y="-9" width="22" height="18" fill="url(#zBrassH)" stroke="#5e400e"/><rect x="24" y="-9" width="22" height="18" fill="url(#zBrassH)" stroke="#5e400e"/>`;
 s+=`<path d="M-26 -14 Q0 -30 26 -14 L26 14 Q0 30 -26 14 Z" fill="url(#zBrass)" stroke="#5e400e" stroke-width="1.5"/><rect x="-11" y="-38" width="22" height="16" fill="url(#zBrass)" stroke="#5e400e"/>`;
 const sy=-40-14*x;s+=`<rect x="-2.5" y="${sy-38}" width="5" height="${-sy+2}" fill="#c9d0d4" stroke="#7a8288" stroke-width=".6"/>`;
 if(o.kind==="el"){s+=`<rect x="-8" y="-78" width="4" height="40" fill="#9aa3a9"/><rect x="4" y="-78" width="4" height="40" fill="#9aa3a9"/><rect x="-34" y="-124" width="68" height="48" rx="5" fill="url(#zPlastic)" stroke="#8f887a"/><rect x="-26" y="-116" width="34" height="11" rx="2" fill="#2a2f33"/><text x="-9" y="-107.5" style="font:500 8px var(--mono);fill:#cfd5d9;text-anchor:middle">24V</text><circle cx="20" cy="-110" r="4" fill="${op>0.02?"#3fd17a":"#59636a"}"/>`;
  s+=`<text x="0" y="-86" style="font:600 10px var(--body);fill:#3a3f43;text-anchor:middle">${o.sig||"2-10 V"}</text>`}
 else{s+=`<rect x="-9" y="-80" width="4" height="42" fill="#9aa3a9"/><rect x="5" y="-80" width="4" height="42" fill="#9aa3a9"/><rect x="-36" y="-84" width="72" height="6" rx="2" fill="url(#zSteelH)" stroke="#5f686d"/><path d="M-34 -84 Q0 -126 34 -84 Z" fill="url(#zPlasticDk)" stroke="#111" stroke-width="1.2"/><circle cx="0" cy="-112" r="4" fill="url(#zBrass)" stroke="#5e400e"/>`;
  [-28,-14,14,28].forEach(d=>s+=`<circle cx="${d}" cy="-81" r="1.6" fill="#ccc"/>`)}
 s+=`<rect x="10" y="${sy-30}" width="12" height="3" fill="#c0281c"/>`;
 s+=`</g>`;if(o.lbl)s+=K.lbl(cx,cy+(o.ly??40)*sc,o.lbl,{size:o.lsz||13,fill:o.lc});if(o.pct!==undefined)s+=K.tag(cx+(o.px??70)*sc,cy-(o.py??60)*sc,Math.round(op*100)+"% OPEN",{fill:o.lc});return s};
/* ---------- damper, side view: blades flat (open) to upright (closed) ---------- */
CTK.damper=(x,y,w,h,open,o={})=>{const n=o.n||4,bh=h/n,ang=(1-CTK.cl(open,0,1))*80;let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#5f686d" stroke-width="3"/>`;
 for(let i=0;i<n;i++){const cy=y+bh*(i+.5),cx=x+w/2,L=bh*0.56;s+=`<g transform="rotate(${(o.opp&&i%2?-ang:ang).toFixed(1)} ${cx} ${cy})"><rect x="${cx-Math.max(L,w*.42)}" y="${cy-2.5}" width="${2*Math.max(L,w*.42)}" height="5" rx="2" fill="url(#zSteel)" stroke="#5f686d" stroke-width=".8"/></g><circle cx="${cx}" cy="${cy}" r="3" fill="#3a4247"/>`}
 return s};
/* ---------- finned coil ---------- */
CTK.coil=(x,y,w,h,c)=>{let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#zFins)" stroke="#4d555a" stroke-width="1.5"/>`;for(let i=0;i<5;i++)s+=`<rect x="${x+3}" y="${y+8+i*(h-16)/4-1.5}" width="${w-6}" height="3" fill="${c}" opacity=".7"/>`;return s};
/* ---------- duct section ---------- */
CTK.duct=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#zSteel)" stroke="#5f686d" stroke-width="1.5" opacity=".55"/><path d="M${x} ${y} H${x+w} M${x} ${y+h} H${x+w}" stroke="#5f686d" stroke-width="3"/>`;
/* ---------- psi scale with spring range bands and a branch marker. ranges: [{a,b,c,lbl,no}] ---------- */
CTK.bar=(x,y,w,o)=>{const mx=o.max||15,X=p=>x+p/mx*w,rh=o.rh||26;let s="";
 (o.ranges||[]).forEach((r,i)=>{const yy=o.row?y:y+i*(rh+10);s+=`<rect x="${X(r.a)}" y="${yy}" width="${X(r.b)-X(r.a)}" height="${rh}" rx="4" fill="${r.c}" opacity=".85"/>`;
  s+=`<text x="${(X(r.a)+X(r.b))/2}" y="${yy+rh/2+5}" style="font:600 13px var(--display);letter-spacing:.04em;fill:#fff;text-anchor:middle">${r.lbl||r.a+" TO "+r.b}</text>`;
  if(r.side)s+=K.txt(r.sideAt==="l"?X(r.a)-8:X(r.b)+8,yy+rh/2+5,r.side,{a:r.sideAt==="l"?"end":"start",fill:r.c})});
 const n=o.row?1:(o.ranges||[]).length,y2=y+n*(rh+10)+4;s+=`<path d="M${x} ${y2} H${x+w}" stroke="var(--muted)" stroke-width="1.5"/>`;
 const lb=o.lab||3;for(let p=0;p<=mx;p++)s+=`<path d="M${X(p)} ${y2} v${p%lb===0?8:4}" stroke="var(--muted)"/>`+(p%lb===0||o.all?K.txt(X(p),y2+24,p):"");
 s+=K.txt(x+w+10,y2+24,o.unit||"psi",{a:"start"});
 if(o.db)s+=`<rect x="${X(o.db[0])}" y="${y-6}" width="${Math.max(0,X(o.db[1])-X(o.db[0]))}" height="${y2-y+6}" fill="var(--muted)" opacity=".14"/>`;
 if(o.br!=null){const bx=X(CTK.cl(o.br,0,mx));s+=`<path d="M${bx} ${y-14} V${y2+2}" stroke="${CTK.AIR}" stroke-width="3"/><path d="M${bx-7} ${y-22} h14 l-7 9 z" fill="${CTK.AIR}"/>`+K.lbl(CTK.cl(bx,x+50,x+w-50),y-28,(o.brl||"BRANCH ")+K.f1(o.br)+" PSI",{fill:CTK.AIR,size:13})}
 return s};
/* ---------- DDC controller with terminal strip. pts: [[label, kind]] ---------- */
CTK.ddc=(x,y,w,h,o={})=>{let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#zPlasticDk)" stroke="#1d2125" stroke-width="1.5"/><rect x="${x+14}" y="${y+14}" width="${w-28}" height="${o.lcdH||40}" rx="3" fill="#15191c"/>`;
 if(o.screen)s+=`<text x="${x+w/2}" y="${y+14+(o.lcdH||40)/2+6}" class="lsLcd" style="font-size:${o.fs||15}px">${o.screen}</text>`;
 s+=`<text x="${x+w/2}" y="${y+h-10}" style="font:600 12px var(--display);letter-spacing:.1em;fill:#dfe5e8;text-anchor:middle">${o.name||"DDC CONTROLLER"}</text>`;return s};
CTK.term=(x,y,n,lbls,c)=>{let s=`<rect x="${x-4}" y="${y-12}" width="${n*22+8}" height="24" rx="3" fill="${c||"#2f8f3a"}" stroke="#1d5a24"/>`;for(let i=0;i<n;i++)s+=`<circle cx="${x+11+i*22}" cy="${y}" r="6" fill="#c9d0d4" stroke="#5f686d"/><path d="M${x+7+i*22} ${y} h8" stroke="#5f686d" stroke-width="1.6"/>`;
 if(lbls)s+=`<text x="${x+n*11}" y="${y-18}" style="font:600 12px var(--display);letter-spacing:.06em;fill:var(--ink);text-anchor:middle">${lbls}</text>`;return s};
/* ---------- room temperature sensor on a wall ---------- */
CTK.wallSensor=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-16" y="-24" width="32" height="48" rx="5" fill="#ece7dc" stroke="#8f8a7f" stroke-width="1.4"/>${[0,1,2,3].map(i=>`<rect x="-9" y="${-12+i*6}" width="18" height="2" rx="1" fill="#b9b2a4"/>`).join("")}</g>`;
/* ---------- duct probe sensor (housing + probe into the duct) ---------- */
CTK.probe=(x,y,len)=>`<rect x="${x-14}" y="${y-30}" width="28" height="24" rx="3" fill="url(#zPlastic)" stroke="#8f8a7f"/><rect x="${x-2}" y="${y-6}" width="4" height="${len}" fill="#c9d0d4" stroke="#7a8288" stroke-width=".6"/>`;
/* ---------- multimeter ---------- */
CTK.meter=(x,y,txt,mode)=>`<rect x="${x-50}" y="${y-70}" width="100" height="150" rx="12" fill="#e2b324" stroke="#8a6a10" stroke-width="2"/><rect x="${x-40}" y="${y-60}" width="80" height="38" rx="3" fill="#c8d4b8" stroke="#5c6650"/><text x="${x}" y="${y-34}" style="font:600 17px var(--mono);fill:#1d2327;text-anchor:middle">${txt}</text><circle cx="${x}" cy="${y+12}" r="20" fill="#2a2f33"/><path d="M${x} ${y+12} L${x+12} ${y-2}" stroke="#e8e8e8" stroke-width="3"/><text x="${x}" y="${y+50}" style="font:600 11px var(--display);fill:#2a2f33;text-anchor:middle">${mode||""}</text><circle cx="${x-24}" cy="${y+66}" r="5" fill="#111"/><circle cx="${x+24}" cy="${y+66}" r="5" fill="#c0281c"/>`;
/* ---------- sensors: 10K Type II thermistor (same table as the trainer) and 1000 ohm platinum RTD ---------- */
CTK.TH2=[[-40,336450],[-30,177000],[-20,97060],[-10,55330],[0,32650],[10,19900],[20,12490],[25,10000],[30,8057],[40,5327],[50,3603],[60,2488],[70,1752],[80,1258],[90,917],[100,679]];
CTK.thR=F=>{const C=(F-32)/1.8,t=CTK.TH2;if(C<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(C<=t[i][0]){const[a,ra]=t[i-1],[b,rb]=t[i];return Math.exp(Math.log(ra)+(Math.log(rb)-Math.log(ra))*(C-a)/(b-a))}return t[t.length-1][1]};
CTK.thF=R=>{let lo=-40,hi=212;for(let i=0;i<50;i++){const m=(lo+hi)/2;if(CTK.thR(m)>R)lo=m;else hi=m}return (lo+hi)/2};
CTK.rtd=F=>{const C=(F-32)/1.8;return 1000*(1+3.9083e-3*C-5.775e-7*C*C)};
CTK.fmtR=r=>r>=1000?(r/1000).toFixed(r>=100000?0:r>=10000?1:2)+" kΩ":Math.round(r)+" Ω";
/* ---------- signal scaling: raw signal to engineering units and back ---------- */
CTK.SIG=[{n:"4-20 mA",lo:4,hi:20,u:"mA",live:true},{n:"0-10 V",lo:0,hi:10,u:"V",live:false},{n:"2-10 V",lo:2,hi:10,u:"V",live:true}];
CTK.toSig=(v,elo,ehi,g)=>g.lo+(v-elo)/(ehi-elo)*(g.hi-g.lo);
CTK.toEng=(sig,elo,ehi,g)=>elo+(sig-g.lo)/(g.hi-g.lo)*(ehi-elo);
