/* ============ Flooded shell-and-tube evaporator: model + drawings (used by the chiller approach lessons) ============
 Same numbers as the chiller simulator (chill.js): 300-ton centrifugal, R-134a, 720 gpm design chilled water,
 clean evaporator approach about 1.8°F at full load, scaling with load. */
const EV={tons:300,gpm:720};
const PT134=[[0,6.5],[10,12],[20,18.4],[25,22.1],[30,26.1],[35,30.4],[40,35],[45,40.1],[50,45.5],[55,51.3],[60,57.5],[65,64.1],[70,71.2],[75,78.7],[80,86.8],[85,95.3],[90,104],[95,114],[100,124],[105,135],[110,147]];
const ptP134=t=>{const T=PT134;if(t<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(t<=T[i][0]){const[a,b]=[T[i-1],T[i]];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}return T[T.length-1][1]};
const ptT134=p=>{const T=PT134;if(p<=T[0][1])return T[0][0];for(let i=1;i<T.length;i++)if(p<=T[i][1]){const[a,b]=[T[i-1],T[i]];return a[0]+(b[0]-a[0])*(p-a[1])/(b[1]-a[1])}return T[T.length-1][0]};
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
/* v: load 0..1, gpm, lchw (°F), foul 0..1, low (low charge), oil (oil logging), sens (sensor error °F) */
function evapModel(v){const plr=clampN(v.load,0,1),gpm=Math.max(150,v.gpm);const Q=plr*EV.tons;
 const flowF=0.45+0.55*Math.pow(EV.gpm/gpm,0.8);
 let appr=1.8*plr*flowF*(1+1.7*v.foul)+(v.oil?1.6*plr:0)+(v.low?1.2+7*plr:0);
 const lchw=v.lchw,ewt=lchw+Q*24/gpm,Te=lchw-appr,Pe=ptP134(Te);
 const Tc=86+12*plr,lift=Tc-Te,kwt=0.56*(0.35+0.65*lift/56)*(plr>0.15?1+0.2*Math.pow(1-plr,2)/plr:1.7);
 const cleanTe=lchw-1.8*plr*flowF,kwtClean=0.56*(0.35+0.65*(Tc-cleanTe)/56)*(plr>0.15?1+0.2*Math.pow(1-plr,2)/plr:1.7);
 const shown=lchw+(v.sens||0);
 return {plr,Q,gpm,lchw,ewt,Te,Pe,appr,shownL:shown,shownAppr:shown-ptT134(Pe),lift,kwt,extra:kwt/kwtClean-1,level:v.low?0.42:0.86,freeze:Te<34,dt:ewt-lchw}}
/* ---------- drawing pieces ---------- */
const tcolE=T=>{const f=clampN((T-36)/22,0,1);return `hsl(${Math.round(215-20*f)},${Math.round(70-10*f)}%,${Math.round(46+14*f)}%)`};
const lblE=(x,y,t,a="middle",c="")=>`<text x="${x}" y="${y}" class="lsL${c?" "+c:""}" style="text-anchor:${a}">${t}</text>`;
function gaugeE(x,y,r,val,max,unit,label){const a=v=>Math.PI*(1.25-1.5*clampN(v,0,max)/max);let g=`<circle cx="${x}" cy="${y+3}" r="${r+7}" fill="#000" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r+6}" fill="url(#zSteel)" stroke="#4d555a"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fbfaf6" stroke="#6d757a"/>`;
 for(let v=0;v<=max;v+=max/20){const A=a(v),big=Math.round(v/(max/20))%5===0,l=big?r*0.18:r*0.09;g+=`<path d="M${x+Math.cos(A)*r*0.92} ${y-Math.sin(A)*r*0.92} L${x+Math.cos(A)*(r*0.92-l)} ${y-Math.sin(A)*(r*0.92-l)}" stroke="#2a2f33" stroke-width="${big?1.4:0.7}"/>`;if(big&&Math.round(v/(max/20))%10===0)g+=`<text x="${x+Math.cos(A)*r*0.6}" y="${y-Math.sin(A)*r*0.6+3}" class="lsGn">${Math.round(v)}</text>`}
 const A=a(val);g+=`<path d="M${x-Math.cos(A)*r*0.14} ${y+Math.sin(A)*r*0.14} L${x+Math.cos(A)*r*0.84} ${y-Math.sin(A)*r*0.84}" stroke="#c0281c" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r*0.09}" fill="#2a2f33"/><text x="${x}" y="${y+r*0.62}" class="lsGn" style="font-size:8px">${unit}</text>`;
 return g+(label?lblE(x,y+r+22,label):"")}
function readoutE(x,y,txt,label,w=92){return `<rect x="${x-w/2}" y="${y-15}" width="${w}" height="26" rx="4" fill="#15191c" stroke="#3a4247"/><text x="${x}" y="${y+4}" class="lsLcd">${txt}</text>`+(label?lblE(x,y+28,label):"")}
/* the evaporator cutaway. opt: R (model), hi (what to highlight: 'water','ref','lchw','pe','tubes'), noRead */
let evN=0;
function evapSVG(R,opt={}){const u="ev"+(++evN);const x0=200,x1=560,cy=210,r=84,ex=26;// shell from x0 to x1, end cap depth ex
 const hi=opt.hi||"";let s=`<defs><clipPath id="${u}Cut"><path d="M${x0+40} ${cy-r+10} H${x1-30} V${cy+r-8} H${x0+40} Z"/></clipPath><linearGradient id="${u}Ref" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b9dcf0" stop-opacity=".85"/><stop offset="1" stop-color="#6fa7cf" stop-opacity=".9"/></linearGradient>
 <linearGradient id="${u}In" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a3034"/><stop offset=".5" stop-color="#4a5257"/><stop offset="1" stop-color="#22272a"/></linearGradient></defs>`;
 // floor shadow + saddles
 s+=`<ellipse cx="${(x0+x1)/2}" cy="${cy+r+24}" rx="${(x1-x0)/2+40}" ry="10" fill="#000" opacity=".16"/>`;
 [x0+70,x1-70].forEach(x=>{s+=`<path d="M${x-34} ${cy+r+20} L${x-24} ${cy+40} H${x+24} L${x+34} ${cy+r+20} Z" fill="url(#zSteelH)" stroke="#5f686d"/>`});
 // shell body
 s+=`<rect x="${x0}" y="${cy-r}" width="${x1-x0}" height="${2*r}" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2"/>`;
 // cut window: the inside
 s+=`<g clip-path="url(#${u}Cut)"><rect x="${x0}" y="${cy-r}" width="${x1-x0}" height="${2*r}" fill="url(#${u}In)"/>`;
 const lvl=cy+r-8-(2*r-18)*R.level;// liquid surface y
 s+=`<rect x="${x0}" y="${lvl}" width="${x1-x0}" height="${cy+r-lvl}" fill="url(#${u}Ref)" class="${hi==="ref"?"lsPulse":""}"/>`;
 // vapor space shimmer
 s+=`<rect x="${x0}" y="${cy-r}" width="${x1-x0}" height="${lvl-(cy-r)}" fill="#cfe3ef" opacity=".12"/>`;
 // tubes: 6 rows, lower 3 = first pass (left to right, warmer), upper 3 = return pass (right to left, colder)
 const rows=[cy+52,cy+34,cy+16,cy-8,cy-26,cy-44];const Tin=R.ewt,Tout=R.lchw,Tmid=(Tin+Tout)/2;
 rows.forEach((y,i)=>{const first=i<3,a=first?Tin:Tmid,b=first?Tmid:Tout;const dry=y<lvl+4;
  s+=`<linearGradient id="${u}T${i}" x1="${first?0:1}" x2="${first?1:0}"><stop offset="0" stop-color="${tcolE(a)}"/><stop offset="1" stop-color="${tcolE(b)}"/></linearGradient>`;
  s+=`<rect x="${x0}" y="${y-6}" width="${x1-x0}" height="12" rx="6" fill="url(#zCuH)" opacity="${dry?0.75:1}"/>`;
  s+=`<rect x="${x0}" y="${y-3}" width="${x1-x0}" height="6" fill="url(#${u}T${i})" opacity=".9"/>`;
  s+=`<path class="lsFlow" d="${first?`M${x0} ${y} H${x1}`:`M${x1} ${y} H${x0}`}" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 12" opacity=".7"/>`;
  if(opt.foul>0.05)s+=`<rect x="${x0}" y="${y-3}" width="${x1-x0}" height="6" fill="#7a5a2a" opacity="${0.15+0.5*opt.foul}"/>`;
  if(opt.oil)s+=`<rect x="${x0}" y="${y+3}" width="${x1-x0}" height="3" fill="#c9a227" opacity=".7"/>`});
 // tube support sheets
 [x0+120,x0+240].forEach(x=>{s+=`<rect x="${x-3}" y="${cy-r}" width="6" height="${2*r}" fill="#6b747a" opacity=".8"/>`});
 // boiling bubbles in the liquid
 let bub="";for(let i=0;i<34;i++){const bx=x0+50+((i*53)%(x1-x0-90)),by=cy+r-14-((i*37)%Math.max(12,(cy+r-lvl-16)));const d=(i%7)*0.35;bub+=`<circle class="lsBub" style="animation-delay:-${d}s" cx="${bx}" cy="${by}" r="${1.6+(i%3)}" fill="#fff" opacity=".75"/>`}
 s+=`<g>${bub}</g>`;
 if(R.level<0.6)s+=`<rect x="${(x0+x1)/2+5-125}" y="${lvl-32}" width="250" height="26" rx="4" fill="var(--paper)" opacity=".92"/>`+lblE((x0+x1)/2+5,lvl-13,"TOP TUBES DRY: BARELY COOLING","middle","bad");
 s+=`</g>`;
 // cut edge rim
 s+=`<path d="M${x0+40} ${cy-r+10} H${x1-30} V${cy+r-8} H${x0+40} Z" fill="none" stroke="#c9d0d4" stroke-width="3"/><path d="M${x0+40} ${cy-r+10} H${x1-30} V${cy+r-8} H${x0+40} Z" fill="none" stroke="#3a4247" stroke-width="1"/>`;
 // right end (dished head)
 s+=`<path d="M${x1} ${cy-r} Q${x1+ex*1.6} ${cy-r} ${x1+ex*1.6} ${cy} Q${x1+ex*1.6} ${cy+r} ${x1} ${cy+r} Z" fill="url(#zSteel)" stroke="#4d555a"/>`;
 // left water box with flange, bolts
 s+=`<rect x="${x0-14}" y="${cy-r-6}" width="14" height="${2*r+12}" rx="3" fill="url(#zSteel)" stroke="#4d555a"/>`;
 for(let i=0;i<9;i++){const y=cy-r+4+i*(2*r-8)/8;s+=`<circle cx="${x0-7}" cy="${y}" r="2.6" fill="#3a4247"/>`}
 s+=`<path d="M${x0-14} ${cy-r} Q${x0-14-ex*2.2} ${cy-r} ${x0-14-ex*2.2} ${cy} Q${x0-14-ex*2.2} ${cy+r} ${x0-14} ${cy+r} Z" fill="url(#zBlue)" stroke="#1c3149"/>`;
 s+=`<path d="M${x0-14-ex*2.2+4} ${cy} H${x0-16}" stroke="#1c3149" stroke-width="2"/>`;// pass partition
 // nozzles: return water in (bottom), supply water out (top)
 const nz=(y,T,lab,dir)=>`<rect x="${x0-130}" y="${y-13}" width="${86}" height="26" fill="url(#zSteelH)" stroke="#5f686d"/><rect x="${x0-48}" y="${y-17}" width="8" height="34" rx="2" fill="url(#zSteel)" stroke="#5f686d"/><rect x="${x0-130}" y="${y-5}" width="86" height="10" fill="${tcolE(T)}" opacity=".85"/><path class="lsFlow" d="${dir>0?`M${x0-130} ${y} H${x0-40}`:`M${x0-40} ${y} H${x0-130}`}" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 10"/>`+lblE(x0-194,dir<0?y+32:y-20,lab,"start");
 s+=nz(cy+48,R.ewt,"RETURN WATER IN",1)+nz(cy-46,R.lchw,"CHILLED WATER OUT",-1);
 // leaving water sensor + readout
 const lw=hi==="lchw";s+=`<rect x="${x0-96}" y="${cy-80}" width="6" height="22" fill="#5f686d"/>`+(opt.noRead?"":readoutE(x0-93,cy-98,`${R.shownL.toFixed(1)}°F`,"",80))+(lw?`<rect x="${x0-138}" y="${cy-118}" width="90" height="36" rx="6" fill="none" stroke="var(--hot)" stroke-width="2.5" class="lsPulse"/>`:"");
 s+=opt.noRead?"":lblE(x0-93,cy-122,"LEAVING WATER SENSOR");
 // return water readout
 s+=opt.noRead?"":readoutE(x0-93,cy+92,`${R.ewt.toFixed(1)}°F`,"ENTERING WATER",80);
 // suction outlet to compressor + gauge
 s+=`<rect x="${x1-92}" y="${cy-r-46}" width="64" height="48" fill="url(#zSteel)" stroke="#5f686d"/><rect x="${x1-98}" y="${cy-r-52}" width="76" height="10" rx="2" fill="url(#zSteelH)" stroke="#5f686d"/>`+lblE(x1-60,cy-r-62,"TO COMPRESSOR");
 const pg=hi==="pe";s+=`<rect x="${x0+78}" y="${cy-r-26}" width="5" height="26" fill="url(#zBrass)"/>`+gaugeE(x0+80,cy-r-56,30,R.Pe,80,"PSIG","")+(pg?`<circle cx="${x0+80}" cy="${cy-r-56}" r="44" fill="none" stroke="var(--hot)" stroke-width="2.5" class="lsPulse"/>`:"");
 s+=lblE(x0+126,cy-r-72,"EVAPORATOR","start")+lblE(x0+126,cy-r-55,"PRESSURE","start")+(opt.noRead?"":lblE(x0+126,cy-r-37,`${R.Pe.toFixed(1)} psig`,"start","v"));
 // refrigerant feed in (bottom) from the expansion device
 s+=`<rect x="${x1-65}" y="${cy+r}" width="10" height="40" fill="url(#zCuV)"/><path class="lsFlow" d="M${x1-60} ${cy+r+40} V${cy+r}" stroke="#d9eef9" stroke-width="2" stroke-dasharray="4 8"/>`+lblE(x1-50,cy+r+56,"LIQUID REFRIGERANT IN (FROM THE ORIFICE OR FLOAT)","end");
 // sight glass
 s+=`<circle cx="${x1-10}" cy="${cy+30}" r="11" fill="#2a3034" stroke="url(#zBrass)" stroke-width="4"/><clipPath id="${u}Sg"><circle cx="${x1-10}" cy="${cy+30}" r="9"/></clipPath><rect clip-path="url(#${u}Sg)" x="${x1-20}" y="${cy+39-18*R.level}" width="20" height="20" fill="#8cc4e6"/>`+lblE(x1+48,cy+36,"SIGHT GLASS","start");
 if(hi==="tubes")s+=`<rect x="${x0+40}" y="${cy-56}" width="${x1-x0-70}" height="118" fill="none" stroke="var(--hot)" stroke-width="2.5" rx="8" class="lsPulse"/>`;
 if(hi==="ref")s+=`<rect x="${(x0+x1)/2-150}" y="${cy+r-30}" width="300" height="24" rx="4" fill="var(--paper)" opacity=".92"/>`+lblE((x0+x1)/2,cy+r-12,"REFRIGERANT BOILING AROUND THE TUBES");
 return s}
/* thermometer-style comparison of the two temperatures */
function gapSVG(R,y0=40){const X=t=>60+(t-30)*20,lo=R.Te,hi=R.shownL;let s=`<rect x="${X(30)}" y="${y0+30}" width="${X(60)-X(30)}" height="10" rx="5" fill="var(--panel)"/>`;
 for(let t=30;t<=60;t+=2)s+=`<path d="M${X(t)} ${y0+44} v${t%10===0?10:5}" stroke="var(--muted)"/>`+(t%10===0?`<text x="${X(t)}" y="${y0+68}" class="lsG">${t}°F</text>`:"");
 s+=`<rect x="${X(lo)}" y="${y0+22}" width="${Math.max(2,X(hi)-X(lo))}" height="26" fill="var(--brass)" opacity=".28"/>`;
 s+=`<path d="M${X(lo)} ${y0+14} V${y0+54}" stroke="#2f6fd6" stroke-width="3"/><path d="M${X(hi)} ${y0+14} V${y0+54}" stroke="#d23a26" stroke-width="3"/>`;
 s+=`<text x="${X(lo)-6}" y="${y0+8}" class="lsL" style="text-anchor:end;fill:#2f6fd6">REFRIGERANT ${lo.toFixed(1)}°F</text><text x="${X(hi)+6}" y="${y0+8}" class="lsL" style="text-anchor:start;fill:#d23a26">LEAVING WATER ${hi.toFixed(1)}°F</text>`;
 s+=`<text x="${(X(lo)+X(hi))/2}" y="${y0+92}" class="lsBig">APPROACH ${(hi-lo).toFixed(1)}°F</text>`;return s}
/* PT chart lookup for R-134a */
function ptSVG(pe,x0=40,y0=20,w=300,h=200){const T0=25,T1=55,P0=20,P1=55;const X=t=>x0+40+(t-T0)/(T1-T0)*(w-50),Y=p=>y0+h-30-(p-P0)/(P1-P0)*(h-50);
 let s=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 for(let t=T0;t<=T1;t+=5)s+=`<path d="M${X(t)} ${Y(P0)} V${Y(P1)}" stroke="var(--panel-edge)" stroke-width=".6"/><text x="${X(t)}" y="${Y(P0)+14}" class="lsG">${t}</text>`;
 for(let p=P0;p<=P1;p+=5)s+=`<path d="M${X(T0)} ${Y(p)} H${X(T1)}" stroke="var(--panel-edge)" stroke-width=".6"/><text x="${X(T0)-5}" y="${Y(p)+3}" class="lsG" style="text-anchor:end">${p}</text>`;
 let d="";for(let t=T0;t<=T1;t+=1)d+=(t===T0?"M":"L")+X(t).toFixed(1)+" "+Y(ptP134(t)).toFixed(1);s+=`<path d="${d}" stroke="var(--brass)" stroke-width="2.4" fill="none"/>`;
 const t=ptT134(pe);s+=`<path d="M${X(T0)} ${Y(pe)} H${X(t)} V${Y(P0)}" stroke="var(--hot)" stroke-width="1.8" stroke-dasharray="5 4" fill="none"/><circle cx="${X(t)}" cy="${Y(pe)}" r="5" fill="var(--hot)"/>`;
 s+=`<text x="${x0+w/2}" y="${y0+16}" class="lsL">R-134A PT CHART</text><text x="${x0+w/2}" y="${y0+h-4}" class="lsG">saturation temperature, °F</text><text x="${x0+10}" y="${y0+36}" class="lsG" style="text-anchor:start">psig</text>`;
 s+=`<text x="${X(t)+8}" y="${Y(pe)-8}" class="lsL" style="text-anchor:start;fill:var(--hot)">${pe.toFixed(1)} psig = ${t.toFixed(1)}°F</text>`;return s}
