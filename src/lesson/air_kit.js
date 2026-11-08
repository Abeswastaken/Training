/* ============ Airflow lesson kit: psychrometrics, blower and system curves, static model, duct friction, drawings ============
 Same math as the Airflow trainer (src/air.js): sea-level psychrometrics (ASHRAE Hyland-Wexler), PSC blower curve
 static = r² × 1.38 − b × CFM² (1200 CFM at about 0.55 in. w.c. on high), duct system static = K × CFM². */
const AK={};
AK.COOL="#3d8fe0";AK.WARM="#e0662a";AK.PORT="#ffd34d";AK.SE="#4d555a";AK.DK="#2a2f33";
/* air color, same scale as the trainer: blue at 50°F to orange at 100°F */
AK.acol=T=>{const f=Math.max(0,Math.min(1,(T-50)/50)),a=[61,143,224],b=[224,102,42];return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*f)).join(",")})`};
AK.f2s=v=>(v>=0?"+":"−")+Math.abs(v).toFixed(2);
/* ---------- psychrometrics (sea level, 14.696 psia), copied from the trainer ---------- */
const PSY={P:14.696,
 pws(T){const R=T+459.67;if(T<32)return Math.exp(-1.0214165e4/R-4.8932428-5.3765794e-3*R+1.9202377e-7*R*R+3.5575832e-10*R**3-9.0344688e-14*R**4+4.1635019*Math.log(R));
  return Math.exp(-1.0440397e4/R-1.1294650e1-2.7022355e-2*R+1.2890360e-5*R*R-2.4780681e-9*R**3+6.5459673*Math.log(R))},
 Ws(T){const p=PSY.pws(T);return 0.621945*p/(PSY.P-p)},
 Wrh(T,rh){const p=rh*PSY.pws(T);return 0.621945*p/(PSY.P-p)},
 rh(T,W){return W*PSY.P/(0.621945+W)/PSY.pws(T)},
 h(T,W){return 0.240*T+W*(1061+0.444*T)},
 dew(W){let lo=-40,hi=130;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(PSY.Ws(m)>W)hi=m;else lo=m}return (lo+hi)/2},
 /* humidity ratio from dry bulb and wet bulb (ASHRAE Fundamentals ch. 1, eq. 35) */
 Wwb(T,wb){return ((1093-0.556*wb)*PSY.Ws(wb)-0.240*(T-wb))/(1093+0.444*T-wb)},
 wb(T,W){let lo=-20,hi=T;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(PSY.Wwb(T,m)>W)hi=m;else lo=m}return (lo+hi)/2},
 /* specific volume, ft³ per lb of dry air */
 v(T,W){return 0.370486*(T+459.67)*(1+1.607858*W)/PSY.P},
 /* saturation temperature that has enthalpy h (for the enthalpy scale) */
 Th(h){let lo=0,hi=120;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(PSY.h(m,PSY.Ws(m))>h)hi=m;else lo=m}return (lo+hi)/2}};
AK.PSY=PSY;
/* one full state from dry bulb and wet bulb */
AK.state=(T,wb)=>{wb=Math.min(wb,T);const W=Math.max(0,PSY.Wwb(T,wb));return {T,wb,W,gr:W*7000,rh:Math.min(1,PSY.rh(T,W)),dp:PSY.dew(W),h:PSY.h(T,W),v:PSY.v(T,W)}};
AK.stateRH=(T,rh)=>{const W=PSY.Wrh(T,rh);return {T,W,gr:W*7000,rh,wb:PSY.wb(T,W),dp:PSY.dew(W),h:PSY.h(T,W),v:PSY.v(T,W)}};
/* ---------- blower: the trainer's PSC wheel ---------- */
AK.FAN={s0:1.38,b:0.3/0.52e6,rpm:1075,q0:1200};
AK.fanSP=(q,r,s0=AK.FAN.s0)=>r*r*s0-AK.FAN.b*q*q;
/* operating point for duct constant Kd (in. w.c. at 1200 CFM, so static = Kd × (CFM/1200)²) and speed ratio r */
AK.op=(Kd,r,s0=AK.FAN.s0)=>{const K=Kd/(AK.FAN.q0*AK.FAN.q0),q=r>0?r*Math.sqrt(s0/(AK.FAN.b+K)):0;return {q,sp:K*q*q}};
/* blower watts: air horsepower = CFM × in. w.c. ÷ 6356, about 14% wheel and PSC motor efficiency (the trainer's 550 W at 1200 CFM) */
AK.EFF=0.14;AK.watts=(q,sp)=>746*q*sp/6356/AK.EFF;
/* ---------- static pressure model (the trainer's furnace + add-on coil, ports P1 to P4) ---------- */
AK.MERV=m=>{const t=[[4,0.05],[8,0.10],[11,0.15],[13,0.22],[16,0.32]];for(let i=1;i<t.length;i++)if(m<=t[i][0]){const [a,da]=t[i-1],[b,db]=t[i];return da+(db-da)*(m-a)/(b-a)}return 0.32};
AK.TAPS=[0,0.76,0.84,0.92,1];AK.TAPN=["","low","med-low","med-high","high"];
/* S: {merv, load (1 clean to 3.2 loaded), deep (4-inch media), ret (return duct, in.), coil (1 clean to 2.4 fouled), wet, regs (share of supply closed), tap 1..4, wheel (dirty wheel)} */
AK.stat=S=>{const q0=AK.FAN.q0;
 const Kg=0.03,Kr=0.10*Math.pow(16/S.ret,5),Kf=AK.MERV(S.merv)*(S.deep?0.45:1)*(S.load||1),Kc=0.20*(S.wet===false?0.83:1)*(S.coil||1),Ks=0.08/Math.pow(1-(S.regs||0),2);
 const Kd=Kg+Kr+Kf+Kc+Ks,r=AK.TAPS[S.tap??4],s0=AK.FAN.s0*(S.wheel?0.62:1);const o=AK.op(Kd,r,s0),q=o.q,f=(q/q0)**2;
 const p=[-(Kg+Kr)*f,-(Kg+Kr+Kf)*f,(Kc+Ks)*f,Ks*f];
 return {q,f,r,s0,Kd,Kg,Kr,Kf,Kc,Ks,p,tesp:-p[1]+p[2],fdrop:p[0]-p[1],cdrop:p[2]-p[3],ret:-p[1],sup:p[2],cpt:q/3,w:AK.watts(q,-p[1]+p[2])}};
/* ---------- duct friction (Engineering ToolBox, round galvanized duct, standard air) ---------- */
AK.fric=(q,D)=>0.109136*Math.pow(q,1.9)/Math.pow(D,5.02);              // in. w.c. per 100 ft
AK.dFor=(q,fr)=>Math.pow(0.109136*Math.pow(q,1.9)/fr,1/5.02);             // round diameter, in.
AK.SIZES=[4,5,6,7,8,9,10,12,14,16,18,20,22,24];
AK.up=d=>AK.SIZES.find(s=>s>=d-0.05)||24;
AK.vel=(q,D)=>q/(Math.PI*D*D/4/144);                                      // fpm
AK.dVel=(q,v)=>Math.sqrt(4*q*144/(Math.PI*v));
/* ---------- drawing helpers ---------- */
/* duct with sheet-metal look: dark edge, gradient body */
AK.duct=(d,w,fill="#c9d0d4")=>{if(/^url/.test(fill))fill="#c3cacf";return `<path d="${d}" fill="none" stroke="#3d4448" stroke-width="${w+3}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#eef1f3" stroke-width="${Math.max(1,w*0.18)}" stroke-linejoin="round" opacity=".7" transform="translate(${-w*0.22} ${-w*0.22})"/>`};
/* moving air: dashed line colored by temperature */
AK.air=(d,T,w=3)=>`<path class="lsFlow" d="${d}" fill="none" stroke="${AK.acol(T)}" stroke-width="${w}" stroke-dasharray="6 10" stroke-linecap="round"/>`;
AK.aarrow=(d,T,w=2.6)=>K.arrow(d,AK.acol(T),w);
AK.port=(x,y,lab,o={})=>`<circle cx="${x}" cy="${y}" r="5" fill="${AK.PORT}" stroke="#6b5200" stroke-width="1.2"/>`+(lab?K.lbl(x+(o.dx??0),y+(o.dy??-10),lab,{a:o.a||"middle",size:o.size||13}):"");
/* digital manometer. x,y = top left of body */
AK.mano=(x,y,val,o={})=>{const w=o.w||118,h=o.h||112;return `<rect x="${x+3}" y="${y+5}" width="${w}" height="${h}" rx="12" fill="#000" opacity=".18"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#f2b632" stroke="#7a5600" stroke-width="1.5"/>
 <rect x="${x+20}" y="${y-10}" width="12" height="12" rx="2" fill="#5f686d"/><rect x="${x+w-32}" y="${y-10}" width="12" height="12" rx="2" fill="#5f686d"/>
 <text x="${x+26}" y="${y+16}" class="lsG" style="font-size:15px;fill:#3a2a00;font-weight:700">+</text><text x="${x+w-26}" y="${y+16}" class="lsG" style="font-size:15px;fill:#3a2a00;font-weight:700">−</text>
 <rect x="${x+12}" y="${y+24}" width="${w-24}" height="38" rx="4" fill="#cfe3c9" stroke="#6e7f71"/>
 <text x="${x+w/2}" y="${y+51}" style="font-family:var(--mono);font-size:21px;fill:#1f2a22;text-anchor:middle">${val}</text>
 <text x="${x+w/2}" y="${y+80}" class="lsG" style="font-size:12.5px;fill:#3a2a00;font-weight:600">${o.lab||"in. w.c."}</text>
 <circle cx="${x+34}" cy="${y+97}" r="7" fill="#5f686d"/><circle cx="${x+w-34}" cy="${y+97}" r="7" fill="#5f686d"/>`};
/* rubber hose from a port to a manometer nipple */
AK.hose=(x1,y1,x2,y2,c="#2b6fbf")=>`<path d="M${x1} ${y1} C${x1} ${(y1+y2)/2+30} ${x2} ${y2-50} ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" opacity=".9"/>`;
/* ---------- the furnace stack: return drop, filter rack, upflow furnace, add-on coil, supply plenum (720 x 380) ----------
 R from AK.stat. o: {vals (port readings), mano:[i,j] or [i] (ports to the manometer), hl:"filter"|"coil"|"ret"|"sup", noFlow, title} */
AK.PX=[[226,283],[290,283],[422,214],[422,120]];
AK.equip=(R,o={})=>{const on=R.q>20;let s="";
 const Tr=o.Tr??76,Ts=o.Ts??(o.heat?120:56);
 /* floor */
 s+=`<path d="M10 362 H710" stroke="#8a7f70" stroke-width="4"/>`+zShade(360,358,80,4);
 /* return drop and run */
 s+=AK.duct("M140 18 V315 H262",50,"url(#zSteelH)");
 /* filter rack + filter */
 s+=`<rect x="262" y="284" width="18" height="62" rx="2" fill="#6d767b" stroke="${AK.SE}"/>`+zFilter(265,286,12,58,K.uid("fd"));
 if(o.dirty)s+=`<rect x="265" y="286" width="12" height="58" fill="#6b5a3a" opacity=".55"/>`;
 s+=`<rect x="280" y="289" width="20" height="52" fill="#c3cacf" stroke="${AK.SE}"/>`;
 /* furnace cabinet */
 s+=`<rect x="300" y="208" width="120" height="152" rx="3" fill="url(#zCab)" stroke="${AK.SE}" stroke-width="1.4"/><rect x="308" y="216" width="104" height="58" rx="2" fill="url(#zInside)"/>`;
 s+=[0,1,2,3].map(i=>`<path d="M${322+i*25} 270 Q${330+i*25} 246 ${322+i*25} 222" stroke="#7a4a2a" stroke-width="7" fill="none"/>`).join("");
 if(o.heat)s+=[0,1,2,3].map(i=>`<path d="M${316+i*25} 270 q6 -16 12 0 z" fill="url(#zFlame)"/>`).join("");
 s+=`<path d="M300 282 H420" stroke="${AK.SE}"/>`+zBlower(360,318,26,K.uid("bl"));
 /* coil cabinet */
 s+=`<rect x="300" y="130" width="120" height="78" rx="2" fill="url(#zCab)" stroke="${AK.SE}" stroke-width="1.4"/><rect x="306" y="136" width="108" height="66" fill="#2f3438"/>`;
 s+=`<path d="M312 198 L360 142 L408 198" fill="none" stroke="url(#zFins)" stroke-width="10" stroke-linejoin="round"/><path d="M312 198 L360 142 L408 198" fill="none" stroke="#b5703f" stroke-width="2" stroke-dasharray="1 6"/>`;
 if(o.dirtyCoil)s+=`<path d="M312 198 L360 142 L408 198" fill="none" stroke="#6b5a3a" stroke-width="11" opacity=".6"/>`;
 s+=`<rect x="306" y="198" width="108" height="6" fill="#59626a"/>`;
 /* refrigerant lines leaving the coil */
 s+=`<path d="M420 160 H452" stroke="#14171a" stroke-width="9"/><path d="M420 182 H452" stroke="#b87333" stroke-width="4"/>`;
 /* supply plenum and trunk */
 s+=AK.duct("M360 128 V82 H712",44,"url(#zSteelH)");s+=`<rect x="300" y="60" width="120" height="70" fill="url(#zCab)" stroke="${AK.SE}" stroke-width="1.4"/>`;
 s+=AK.duct("M420 82 H712",44,"url(#zSteelH)");
 /* air */
 if(on&&!o.noFlow){s+=AK.air("M140 22 V315 H258",Tr)+AK.air("M286 315 H340",Tr)+AK.air("M360 290 V92 H708",Ts);
  s+=AK.aarrow("M140 60 v34",Tr)+AK.aarrow("M196 315 h34",Tr)+AK.aarrow("M600 82 h40",Ts)}
 /* highlight */
 const hl={filter:[258,278,26,72],coil:[296,126,128,86],ret:[110,14,170,350],sup:[296,56,420,52],blower:[326,286,68,66]}[o.hl];
 if(hl)s+=`<rect x="${hl[0]}" y="${hl[1]}" width="${hl[2]}" height="${hl[3]}" rx="8" fill="none" stroke="var(--brass)" stroke-width="3" stroke-dasharray="7 5"/>`;
 /* labels */
 if(o.labels!==false){s+=K.tag(205,38,"RETURN",{a:"start",w:84})+K.tag(470,44,"SUPPLY PLENUM",{a:"start"})+K.lbl(462,177,"ADD-ON A-COIL",{a:"start",size:13})+K.lbl(432,300,"FURNACE",{a:"start",size:13});
  s+=K.lbl(271,377,"FILTER",{size:12})}
 /* ports */
 const P=AK.PX;const show=o.ports||[0,1,2,3];
 show.forEach(i=>{const [x,y]=P[i];s+=AK.port(x,y,"P"+(i+1),{dx:i<2?0:11,dy:i<2?-10:5,a:i<2?"middle":"start"})});
 if(o.vals!==false)show.forEach(i=>{const [x,y]=P[i];const v=on?AK.f2s(R.p[i]):"0.00";s+=i<2?K.tag(x,y-30,v,{w:58,c:"v"}):K.tag(x+40,y+6,v,{w:58,a:"start",c:"v"})});
 if(o.mano){const mx=o.mx??580,my=o.my??240;const [a,b]=o.mano;const val=o.manoVal??(b==null?AK.f2s(R.p[a]):(R.p[a]-R.p[b]).toFixed(2));
  s+=AK.hose(P[a][0],P[a][1],mx+26,my-10,"#c0392b");if(b!=null)s+=AK.hose(P[b][0],P[b][1],mx+92,my-10,"#2b6fbf");s+=AK.mano(mx,my,on?val:"0.00",{lab:o.manoLab})}
 if(o.title)s+=K.lbl(712,374,o.title,{a:"end",size:13});
 return s};
/* ---------- blower and system curve chart ----------
 o: {x,y,w,h, X, Y, fans:[{r,s0,c,dash,lbl}], sys:[{Kd,c,dash,lbl}], ops:[{q,sp,c,lbl,a,dx,dy}], rated:0.5, title} */
AK.fanChart=o=>{const X=o.X||[0,2000],Y=o.Y||[0,1.4];const series=[];
 (o.fans||[]).forEach(f=>series.push({f:q=>{const v=AK.fanSP(q,f.r,f.s0||AK.FAN.s0);return v>=0?v:NaN},c:f.c||AK.COOL,dash:f.dash,w:f.w||3,lbl:f.lbl,lblAt:f.lblAt??300,a:"start",dx:f.dx??4,dy:f.dy??-10,n:80}));
 (o.sys||[]).forEach(t=>series.push({f:q=>{const v=t.Kd*(q/1200)**2;return v<=Y[1]*1.02?v:NaN},c:t.c||"var(--hot)",dash:t.dash,w:t.w||3,lbl:t.lbl,lblAt:t.lblAt??X[1]*0.82,a:t.a||"end",dx:t.dx??-8,dy:t.dy??-8,n:80}));
 const yt=[];for(let v=Y[0];v<=Y[1]+1e-9;v+=o.ys||0.2)yt.push(+v.toFixed(2));
 const xt=[];for(let v=X[0];v<=X[1];v+=o.xs||500)xt.push(v);
 return K.chart({x:o.x??80,y:o.y??40,w:o.w??580,h:o.h??270,X,Y,xt,yt,yf:v=>v.toFixed(1),xl:o.xl||"airflow, CFM",yl:o.yl||"static, in. w.c.",title:o.title,
  bands:o.rated?[{y0:o.rated,y1:Y[1],c:"#c08a1f"}]:[],vlines:o.vlines,series,dots:(o.ops||[]).map(d=>({x:d.q,y:Math.min(Y[1],d.sp),c:d.c||"var(--ink)",lbl:d.lbl,a:d.a,dx:d.dx,dy:d.dy,r:d.r}))})+
  (o.rated&&o.ratedLbl!==false?K.lbl((o.x??80)+(o.w??580)-6,(o.y??40)+(o.h??270)*(1-(o.rated-Y[0])/(Y[1]-Y[0]))-6,"OVER "+o.rated+" IN. RATING",{a:"end",size:12,fill:"#9a6f1f"}):"")};
/* ---------- psychrometric chart ----------
 o: {x,y,w,h, T:[min,max], gr:max grains, rh:[...], wb:[...], hs:[...] enthalpy ticks, pts:[{T,W,c,lbl,a,dx,dy,r}], segs:[{a:[T,W],b:[T,W],c,dash,w,arrow}], proj:{T,W, parts:["db","dp","gr","wb","h","rh"]}, title} */
AK.psyMap=o=>{const x0=o.x??60,y0=o.y??30,w=o.w??600,h=o.h??300,T=o.T||[35,105],G=o.gr||160;
 return {x0,y0,w,h,T,G,X:t=>x0+(t-T[0])/(T[1]-T[0])*w,Y:W=>y0+h-W*7000/G*h}};
AK.psy=o=>{const M=AK.psyMap(o),{x0,y0,w,h,T,G,X,Y}=M;const Wmax=G/7000;let s="";
 const clipT=t=>Math.max(T[0],Math.min(T[1],t));
 const satPts=[];for(let t=T[0];t<=T[1]+0.01;t+=0.5){const W=PSY.Ws(t);if(W>Wmax){const lo=PSY.dew(Wmax);satPts.push([lo,Wmax]);break}satPts.push([t,W])}
 const tSatTop=PSY.dew(Wmax);
 /* grid: dry bulb verticals up to the saturation curve, humidity horizontals from the curve to the right edge */
 for(let t=Math.ceil(T[0]/5)*5;t<=T[1];t+=5){const top=Math.min(Wmax,PSY.Ws(t));s+=`<path d="M${X(t).toFixed(1)} ${y0+h} V${Y(top).toFixed(1)}" stroke="var(--panel-edge)" stroke-width="${t%10?0.5:0.9}"/>`+(t%10===0?K.txt(X(t),y0+h+18,t):"")}
 for(let g=0;g<=G;g+=(o.gs||20)){const W=g/7000;const xl=g===0?x0:X(Math.max(T[0],PSY.dew(W)));s+=`<path d="M${xl.toFixed(1)} ${Y(W).toFixed(1)} H${x0+w}" stroke="var(--panel-edge)" stroke-width=".8"/>`+K.txt(x0+w+6,Y(W)+5,g,{a:"start"})}
 /* RH curves */
 (o.rh||[0.2,0.4,0.6,0.8]).forEach(r=>{const pts=[];for(let t=T[0];t<=T[1]+0.01;t+=1){const W=PSY.Wrh(t,r);if(W>Wmax)break;pts.push([t,W])}
  if(pts.length>1){s+=`<path d="${pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(--muted)" stroke-width=".9" stroke-dasharray="4 3"/>`;
   const lp=pts[pts.length-1];const at=lp[0]>=T[1]-0.5?[X(lp[0])-4,Y(lp[1])-5,"end"]:[X(lp[0])+3,Y(lp[1])+12,"start"];s+=K.txt(at[0],at[1],Math.round(r*100)+"%",{a:at[2]})}});
 /* wet bulb lines (nearly the same slope as enthalpy lines) */
 (o.wb||[]).forEach(b=>{const a=[b,PSY.Ws(b)];let tb=b;for(let t=b;t<=T[1];t+=0.5){if(PSY.Wwb(t,b)<=0){tb=t;break}tb=t}
  const e=[tb,Math.max(0,PSY.Wwb(tb,b))];if(a[1]>Wmax)return;
  s+=`<path d="M${X(a[0]).toFixed(1)} ${Y(a[1]).toFixed(1)} L${X(clipT(e[0])).toFixed(1)} ${Y(PSY.Wwb(clipT(e[0]),b)).toFixed(1)}" stroke="#4f9a6a" stroke-width=".9" opacity=".75"/>`+(o.wbLbl!==false?`<text x="${(X(a[0])+7).toFixed(1)}" y="${(Y(a[1])+15).toFixed(1)}" class="lsG" style="text-anchor:start;font-size:12px;fill:#3f8a5a">${b}</text>`:"")});
 /* saturation curve */
 s+=`<path d="${satPts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(--ink)" stroke-width="2.4"/>`;
 /* enthalpy scale: ticks just outside the saturation curve */
 (o.hs||[]).forEach(hv=>{const t=PSY.Th(hv);if(t<T[0]||t>tSatTop)return;const x=X(t),y=Y(PSY.Ws(t));s+=`<path d="M${(x-3).toFixed(1)} ${(y-3).toFixed(1)} l-9 -7" stroke="#9a6f1f" stroke-width="1.4"/><text x="${(x-14).toFixed(1)}" y="${(y-12).toFixed(1)}" class="lsG" style="text-anchor:end;font-size:12px;fill:#9a6f1f">${hv}</text>`});
 s+=`<path d="M${x0} ${y0} V${y0+h} H${x0+w} V${y0}" fill="none" stroke="var(--muted)"/>`;
 s+=K.txt(x0+w/2,y0+h+38,o.xl||"dry bulb, °F")+`<text transform="translate(${x0+w+44} ${y0+h/2}) rotate(90)" class="lsG">humidity ratio, grains per lb dry air</text>`;
 if(o.title)s+=K.lbl(x0,y0-10,o.title,{a:"start",size:14});
 /* projections from a point */
 if(o.proj){const p=o.proj,W=p.W,t=p.T,parts=p.parts||["db","dp","gr"];const px=X(t),py=Y(W);
  const dp=PSY.dew(W),wb=PSY.wb(t,W),hh=PSY.h(t,W);
  if(parts.includes("db"))s+=`<path d="M${px} ${py} V${y0+h}" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/>`+K.tag(px,y0+h-8,Math.round(t)+"°F DB",{c:"",fill:"#c0392b",w:76});
  if(parts.includes("dp")||parts.includes("gr")){const xd=X(Math.max(T[0],dp));s+=`<path d="M${xd} ${py} H${parts.includes("gr")?x0+w:px}" stroke="#2f6fd6" stroke-width="2" stroke-dasharray="5 4"/>`;
   if(parts.includes("dp"))s+=`<circle cx="${xd}" cy="${py}" r="4.5" fill="#2f6fd6"/>`+K.tag(xd-8,py-12,"DEW POINT "+(+dp.toFixed(1))+"°F",{a:"end",fill:"#2f6fd6"});
   if(parts.includes("gr"))s+=K.tag(x0+w-6,py-10,Math.round(W*7000)+" GR",{a:"end",fill:"#2f6fd6",w:70})}
  if(parts.includes("wb")){const xs=X(wb),ys=Y(PSY.Ws(wb));s+=`<path d="M${px} ${py} L${xs} ${ys}" stroke="#2f8f4a" stroke-width="2.2" stroke-dasharray="5 4"/><circle cx="${xs}" cy="${ys}" r="4.5" fill="#2f8f4a"/>`+K.tag(xs-14,ys-10,"WET BULB "+(+wb.toFixed(1))+"°F",{a:"end",fill:"#2f8f4a"})}
  if(parts.includes("h")){const ts=PSY.Th(hh),xs=X(ts),ys=Y(PSY.Ws(ts));s+=`<path d="M${px} ${py} L${xs} ${ys} l-26 -30" stroke="#9a6f1f" stroke-width="2" stroke-dasharray="5 4" fill="none"/>`+K.tag(xs-30,ys-38,K.f1(hh)+" BTU/LB",{a:"end",fill:"#9a6f1f"})}
  if(parts.includes("rh"))s+=K.tag(px+12,py+22,Math.round(PSY.rh(t,W)*100)+"% RH",{a:"start",c:"",fill:"var(--muted)",w:76})}
 (o.segs||[]).forEach(g=>{const d=`M${X(g.a[0]).toFixed(1)} ${Y(g.a[1]).toFixed(1)} L${X(g.b[0]).toFixed(1)} ${Y(g.b[1]).toFixed(1)}`;s+=g.arrow?K.arrow(d,g.c,g.w||2.6):`<path d="${d}" stroke="${g.c}" stroke-width="${g.w||2.2}" ${g.dash?`stroke-dasharray="${g.dash}"`:""} fill="none"/>`});
 (o.pts||[]).forEach(p=>{s+=`<circle cx="${X(p.T).toFixed(1)}" cy="${Y(p.W).toFixed(1)}" r="${p.r||6}" fill="${p.c||"var(--hot)"}" stroke="var(--paper)" stroke-width="2"/>`+(p.lbl?K.tag(X(p.T)+(p.dx??12),Y(p.W)+(p.dy??-12),p.lbl,{a:p.a||"start",fill:p.c,w:p.w}):"")});
 return s};
/* ---------- cooling coil in a duct, side cutaway (720 x 380) ----------
 R: {Tin, Win, Tout, Wout, wet, cfm, Te?}. o: {title, noReads} */
AK.coil=(R,o={})=>{let s="";const yT=92,yB=272,cx=360;
 s+=`<rect x="30" y="${yT}" width="660" height="${yB-yT}" fill="#e9edef" stroke="${AK.SE}" stroke-width="2"/><rect x="30" y="${yT-8}" width="660" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/><rect x="30" y="${yB}" width="660" height="8" fill="url(#zSteelH)" stroke="${AK.SE}"/>`;
 /* coil slab: fins with tube ends */
 s+=`<rect x="${cx-34}" y="${yT+4}" width="68" height="${yB-yT-8}" fill="url(#zFins)" stroke="${AK.SE}" stroke-width="1.5"/>`;
 for(let r=0;r<4;r++)for(let i=0;i<8;i++){const x=cx-24+r*16,y=yT+20+i*20+(r%2)*10;if(y<yB-10)s+=`<circle cx="${x}" cy="${y}" r="4" fill="#c98049" stroke="#7a3f18"/>`}
 if(o.ice)s+=`<rect x="${cx-34}" y="${yT+4}" width="68" height="${yB-yT-8}" fill="#eef6fb" opacity="${Math.min(0.85,o.ice)}"/>`;
 /* drain pan and condensate */
 s+=`<path d="M${cx-60} ${yB+8} V${yB+30} H${cx+60} V${yB+8}" fill="#59626a" stroke="${AK.DK}"/><path d="M${cx+60} ${yB+22} H${cx+110} V${yB+60}" fill="none" stroke="#e8e8e0" stroke-width="7"/><path d="M${cx+60} ${yB+22} H${cx+110} V${yB+60}" fill="none" stroke="#9aa3a8" stroke-width="1"/>`;
 if(R.wet)s+=[0,1,2].map(i=>`<circle class="lsBub" style="animation-direction:reverse;animation-delay:${i*0.5}s" cx="${cx-14+i*14}" cy="${yB-6}" r="3" fill="#3f9fd6"/>`).join("")+`<rect x="${cx-56}" y="${yB+18}" width="112" height="8" fill="#5fa8e0" opacity=".8"/>`+K.lbl(cx+120,yB+52,"CONDENSATE",{a:"start",size:12,fill:"#2f6fd6"});
 /* refrigerant connections on top */
 s+=`<path d="M${cx-12} ${yT-8} V30" stroke="#14171a" stroke-width="12"/><path d="M${cx+16} ${yT-8} V30" stroke="#b87333" stroke-width="5"/>`+K.lbl(cx-22,40,"SUCTION",{a:"end",size:12})+K.lbl(cx+26,40,"LIQUID",{a:"start",size:12});
 if(R.Te!=null)s+=K.tag(cx,70,"COIL "+Math.round(R.Te)+"°F",{fill:"#2f6fd6",w:96});
 /* air */
 const yA=[140,182,224];yA.forEach(y=>{s+=AK.air(`M40 ${y} H${cx-40}`,R.Tin,3)+AK.air(`M${cx+40} ${y} H680`,R.Tout,3)});
 s+=AK.aarrow(`M70 ${yB-14} h46`,R.Tin)+AK.aarrow(`M590 ${yB-14} h46`,R.Tout);
 if(!o.noReads){const box=(x,lab,T,W)=>{const st={T,W,rh:PSY.rh(T,W),wb:PSY.wb(T,W),dp:PSY.dew(W),h:PSY.h(T,W)};
   return `<rect x="${x}" y="${yT+34}" width="150" height="112" rx="6" fill="#15191c" stroke="#3a4247" opacity=".94"/>`+K.lbl(x+75,yT+28,lab,{size:13})+
   [[K.f1(st.T)+"°F DB"],[K.f1(st.wb)+"°F WB"],[Math.round(st.rh*100)+"% RH  "+Math.round(W*7000)+" gr"],[K.f1(st.h)+" Btu/lb"]].map((r,i)=>`<text x="${x+12}" y="${yT+58+i*24}" style="font-family:var(--mono);font-size:${i<2?16:14}px;fill:#7CFFB2">${r[0]}</text>`).join("")};
  s+=box(48,"ENTERING (RETURN)",R.Tin,R.Win)+box(522,"LEAVING (SUPPLY)",R.Tout,R.Wout)}
 if(o.title)s+=K.lbl(360,374,o.title,{size:13});
 return s};
/* sling psychrometer: two thermometers, one with a wet wick. x,y center of the frame top */
AK.sling=(x,y,db,wb)=>{let s=`<rect x="${x-60}" y="${y}" width="120" height="230" rx="10" fill="url(#zPlastic)" stroke="#222"/><rect x="${x-8}" y="${y+230}" width="16" height="70" rx="5" fill="#333"/><circle cx="${x}" cy="${y+8}" r="4" fill="#888"/>`;
 const th=(cx,T,lab,wet)=>{const top=y+24,bot=y+190,ht=(T-20)/(110-20)*(bot-top-14);let t=`<rect x="${cx-7}" y="${top}" width="14" height="${bot-top}" rx="7" fill="#f6f7f2" stroke="#999"/><rect x="${cx-2.5}" y="${bot-6-ht}" width="5" height="${ht}" fill="#c0392b"/><circle cx="${cx}" cy="${bot+6}" r="9" fill="#c0392b" stroke="#7a1a10"/>`;
  if(wet)t+=`<rect x="${cx-11}" y="${bot-10}" width="22" height="28" rx="6" fill="#dfe9f2" stroke="#7aa7cc"/><path d="M${cx-8} ${bot-4} h16 M${cx-8} ${bot+4} h16 M${cx-8} ${bot+12} h16" stroke="#9cc0de"/>`;
  for(let v=30;v<=100;v+=10){const yy=bot-6-(v-20)/(110-20)*(bot-top-14);t+=`<path d="M${cx+8} ${yy} h5" stroke="#555"/>`}
  return t+`<text x="${cx}" y="${y+226}" class="lsG" style="font-size:11px;fill:#222;font-weight:600">${lab}</text>`};
 return s+th(x-22,db,"DRY",false)+th(x+22,wb,"WET",true)};
/* ---------- house section for balancing: supply trunk in the attic, rooms with ceiling registers (720 x 380) ----------
 rooms: [{n, design, q, d (damper 0..1)}]. o: {hood: index, keyI, showPct} */
AK.house=(rooms,o={})=>{let s="";const n=rooms.length,x0=24,x1=696,wR=(x1-x0)/n,yC=150,yF=330;
 s+=`<path d="M14 ${yC} L64 54 H656 L706 ${yC}" fill="#8a7a63" fill-opacity=".14" stroke="#6b5a4a" stroke-width="3" stroke-linejoin="round"/><rect x="${x0}" y="${yC-8}" width="${x1-x0}" height="8" fill="#e3d3a6" opacity=".8"/>`;
 s+=`<rect x="${x0}" y="${yC}" width="${x1-x0}" height="${yF-yC}" fill="var(--paper)" stroke="#a89a85" stroke-width="3"/>`;
 for(let i=1;i<n;i++)s+=`<path d="M${x0+i*wR} ${yC} V${yF}" stroke="#a89a85" stroke-width="3"/>`;
 s+=`<path d="M10 ${yF+2} H710" stroke="#8a7f70" stroke-width="4"/>`;
 /* trunk */
 const yT=112;s+=AK.duct(`M46 ${yT} H${x1-22}`,18,"url(#zSteelH)")+K.lbl(70,yT-18,"SUPPLY TRUNK IN THE ATTIC",{a:"start",size:12});
 rooms.forEach((r,i)=>{const cx=x0+wR*(i+0.5),bx=cx;s+=AK.duct(`M${bx} ${yT} V${yC-2}`,10,"url(#zSteel)");
  const ang=90*(1-(r.d??1));s+=`<line x1="${bx-6}" y1="${yT+20}" x2="${bx+6}" y2="${yT+20}" stroke="#2b2f33" stroke-width="2.6" transform="rotate(${ang.toFixed(0)} ${bx} ${yT+20})"/><circle cx="${bx}" cy="${yT+20}" r="1.8" fill="#c0392b"/>`;
  s+=`<rect x="${bx-20}" y="${yC}" width="40" height="7" rx="1" fill="#e8ebe6" stroke="#555"/><rect x="${bx-17}" y="${yC+1}" width="34" height="5" fill="url(#zGrille)"/>`;
  const pct=r.q/r.design;const off=Math.abs(pct-1)>0.1;
  if(o.hood!==i){if(r.q>5)s+=AK.aarrow(`M${bx} ${yC+10} v${Math.max(12,Math.min(46,r.q/9))}`,58,2.4)}
  s+=K.lbl(cx,yC+(o.hood===i?118:84),r.n,{size:14});
  s+=`<text x="${cx}" y="${yC+(o.hood===i?138:106)}" class="lsG" style="font-family:var(--mono);font-weight:600;font-size:15px;fill:${off?"var(--bad)":"var(--ok)"}">${Math.round(r.q)} CFM</text>`;
  s+=K.txt(cx,yC+(o.hood===i?156:126),"design "+r.design);
  if(o.showPct!==false)s+=`<text x="${cx}" y="${yC+(o.hood===i?174:146)}" class="lsG" style="font-size:13px;fill:${off?"var(--bad)":"var(--muted)"}">${Math.round(pct*100)}% of design${o.keyI===i?" (KEY)":""}</text>`});
 if(o.hood!=null){const cx=x0+wR*(o.hood+0.5),r=rooms[o.hood];
  s+=`<path d="M${cx-34} ${yC+2} L${cx-14} ${yC+58} H${cx+14} L${cx+34} ${yC+2} Z" fill="#3a3f44" opacity=".88" stroke="#111"/><rect x="${cx-14}" y="${yC+58}" width="28" height="16" rx="3" fill="#f2b632" stroke="#7a5600"/><rect x="${cx-4}" y="${yC+74}" width="8" height="34" fill="#555"/>`;
  s+=K.lcd(cx+(o.hood>=n-1?-70:70),yC+48,Math.round(r.q)+" CFM",92)+K.lbl(cx+(o.hood>=n-1?-70:70),yC+24,"FLOW HOOD",{size:12})}
 return s};
