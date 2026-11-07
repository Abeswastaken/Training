/* ============ Chiller plant: steady-state model + drawings for the chiller lessons ============
 Same numbers and formulas as the chiller simulator (chill.js): 300-ton centrifugal, R-134a, 720 gpm chilled water,
 900 gpm condenser water, cooling tower with a VFD fan holding 85°F, AHRI design 44/54 and 85/95. */
const PT=[[0,6.5],[10,12],[20,18.4],[25,22.1],[30,26.1],[35,30.4],[40,35],[45,40.1],[50,45.5],[55,51.3],[60,57.5],[65,64.1],[70,71.2],[75,78.7],[80,86.8],[85,95.3],[90,104],[95,114],[100,124],[105,135],[110,147],[115,159],[120,171],[125,185],[130,199],[140,229],[150,263]];
const ptP=t=>{if(t<=PT[0][0])return PT[0][1];for(let i=1;i<PT.length;i++)if(t<=PT[i][0]){const[a,b]=[PT[i-1],PT[i]];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}return PT[PT.length-1][1]};
const ptT=p=>{if(p<=PT[0][1])return PT[0][0];for(let i=1;i<PT.length;i++)if(p<=PT[i][1]){const[a,b]=[PT[i-1],PT[i]];return a[0]+(b[0]-a[0])*(p-a[1])/(b[1]-a[1])}return PT[PT.length-1][0]};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const PL={tons:300,gchw:720,gcdw:900,makeupUS:300};
/* v: load (0-1), lchw (°F), wb (°F wet bulb), tset (tower water setpoint), cdwFlow (0-1 of design), chwFlow (0-1),
   condFoul (0-1), evapFoul (0-1), noncond (bool), lowCharge (bool), fanFail (bool), fill (bool, fouled fill), cycles (cycles of concentration), purge (bool, purge working) */
function plant(v0){const v={load:1,lchw:44,wb:78,tset:85,cdwFlow:1,chwFlow:1,condFoul:0,evapFoul:0,noncond:false,ncPsi:0,lowCharge:false,fanFail:false,fill:false,cycles:4,...v0};
 const nc=v.noncond===true?14:(+v.ncPsi||0);
 const gchw=PL.gchw*v.chwFlow,gcdw=Math.max(60,PL.gcdw*v.cdwFlow);let lift=42,Q=0,kW=0,kwt=0.56,Tb=v.tset,fan=0.9,lim=false;
 for(let it=0;it<30;it++){const Qmax=PL.tons*cl(1+0.012*(55-lift),0.5,1.15);Q=Math.min(v.load*PL.tons,Qmax);const plr=Q/PL.tons;
  kwt=0.56*(0.35+0.65*lift/56)*(1+0.2*Math.pow(1-cl(plr,0.15,1),2)/cl(plr,0.15,1));kW=Q*kwt;lim=false;if(kW>175){lim=true;Q*=175/kW;kW=175}
  const Qrej=Q+kW*3412/12000;
  // tower: fan speeds up to hold tset; at full speed the water floats above setpoint
  const app1=Math.max(1,7*Math.pow(Math.max(Qrej,10)/345,0.6)*(1+0.03*(78-v.wb))*(v.fill?1.9:1)*Math.pow(gcdw/PL.gcdw,0.4));
  if(v.fanFail){fan=0;Tb=v.wb+app1*Math.pow(0.12,-0.6)}else if(v.wb+app1<=v.tset){Tb=v.tset;fan=cl(Math.pow(app1/(v.tset-v.wb),1/0.6),0.15,1)}else{Tb=v.wb+app1;fan=1}
  const range=Qrej*24/gcdw,Tlc=Tb+range;const appC=1.6*(Qrej/345)*(1+2.6*v.condFoul)*(1+0.5*Math.max(0,v.cycles-6))*(1+nc/40);
  const Tc=Tlc+appC,Pc=ptP(Tc)+nc,TcE=ptT(Pc);
  const appE=1.8*plr*(0.45+0.55*Math.pow(PL.gchw/Math.max(150,gchw),0.8))*(1+1.7*v.evapFoul)+(v.lowCharge?1.2+7*plr:0);
  const Te=v.lchw-appE,nl=TcE-Te;
  if(Math.abs(nl-lift)<0.01){lift=nl;break}lift=lift+(nl-lift)*0.7}
 const plr=Q/PL.tons,Qrej=Q+kW*3412/12000,range=Qrej*24/gcdw,Tlc=Tb+range;
 const appC=1.6*(Qrej/345)*(1+2.6*v.condFoul)*(1+0.5*Math.max(0,v.cycles-6))*(1+nc/40),Tc=Tlc+appC,Pc=ptP(Tc)+nc,TcE=ptT(Pc);
 const appE=1.8*plr*(0.45+0.55*Math.pow(PL.gchw/Math.max(150,gchw),0.8))*(1+1.7*v.evapFoul)+(v.lowCharge?1.2+7*plr:0);
 const Te=v.lchw-appE,Pe=ptP(Te),ewt=v.lchw+Q*24/Math.max(1,gchw);
 const liftMax=36+28*plr,surge=TcE-Te>liftMax;
 const E=0.0008*gcdw*range,D=0.00005*gcdw*0+0.0002*gcdw,B=E/Math.max(0.3,v.cycles-1),M=E+D+B;
 const trips=[];if(Te<33)trips.push("Low evaporator refrigerant temperature (under 33°F)");if(v.lchw<36)trips.push("Low leaving chilled water (under 36°F)");if(Pc>=180)trips.push("High condenser pressure (180 psig)");if(v.cdwFlow<0.5)trips.push("Loss of condenser water flow");if(v.chwFlow<0.5)trips.push("Loss of chilled water flow");
 return {v,nc,plr,Q,kW,kwt:Q>1?kW/Q:0,lim,Qrej,gchw,gcdw,lchw:v.lchw,ewt,Te,Pe,appE,Tb,Tlc,range,appT:Tb-v.wb,fan,Tc:TcE,Pc,appC:TcE-Tlc,liq:Tc-1.2,sub:TcE-(Tc-1.2),lift:TcE-Te,liftMax,surge,E,D,B,M,trips,dTcdw:range}}
/* ---------- drawings ---------- */
/* generic shell-and-tube heat exchanger cutaway (evaporator or condenser). o: {x0,x1,cy,r, Tin,Tout (water), level (0-1 liquid), vapor (bool: condenser drops on tubes), foul, hiTubes, water:'cold'|'warm', label} */
function shellHX(o){const u=K.uid("sh"),{x0,x1,cy,r}=o;const ex=r*0.32;let s=`<defs><clipPath id="${u}c"><path d="M${x0+30} ${cy-r+8} H${x1-24} V${cy+r-7} H${x0+30} Z"/></clipPath><linearGradient id="${u}i" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a3034"/><stop offset=".5" stop-color="#4a5257"/><stop offset="1" stop-color="#22272a"/></linearGradient></defs>`;
 s+=`<rect x="${x0}" y="${cy-r}" width="${x1-x0}" height="${2*r}" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2"/>`;
 s+=`<g clip-path="url(#${u}c)"><rect x="${x0}" y="${cy-r}" width="${x1-x0}" height="${2*r}" fill="url(#${u}i)"/>`;
 const lvl=cy+r-7-(2*r-15)*o.level;s+=`<rect x="${x0}" y="${lvl}" width="${x1-x0}" height="${cy+r-lvl}" fill="${o.vapor?"#a9cfe6":"#8fc1e0"}" opacity=".88"/>`;
 const n=o.rows||5,rows=[...Array(n)].map((_,i)=>cy-r*0.62+i*(r*1.24/(n-1)));
 rows.forEach((y,i)=>{const first=i>=n/2,a=first?o.Tin:(o.Tin+o.Tout)/2,b=first?(o.Tin+o.Tout)/2:o.Tout;const g=`${u}t${i}`;
  s+=`<linearGradient id="${g}" x1="${first?0:1}" x2="${first?1:0}"><stop offset="0" stop-color="${K.tcol(a)}"/><stop offset="1" stop-color="${K.tcol(b)}"/></linearGradient>`;
  s+=`<rect x="${x0}" y="${y-5}" width="${x1-x0}" height="10" rx="5" fill="url(#zCuH)"/><rect x="${x0}" y="${y-2.5}" width="${x1-x0}" height="5" fill="url(#${g})" opacity=".9"/>`;
  s+=`<path class="lsFlow" d="${first?`M${x0} ${y} H${x1}`:`M${x1} ${y} H${x0}`}" stroke="#fff" stroke-width="1.2" stroke-dasharray="4 12" opacity=".7"/>`;
  if(o.foul>0.05)s+=`<rect x="${x0}" y="${y-2.5}" width="${x1-x0}" height="5" fill="#7a5a2a" opacity="${0.15+0.55*o.foul}"/>`;
  if(o.vapor&&y<lvl)for(let k=0;k<8;k++){const dx=x0+50+((k*61+i*23)%(x1-x0-90));s+=`<ellipse class="lsDrip" style="animation-delay:-${((k+i)%5)*0.3}s" cx="${dx}" cy="${y+8}" rx="1.8" ry="2.6" fill="#d9eef9"/>`}});
 if(!o.vapor){let b="";for(let i=0;i<28;i++){const bx=x0+44+((i*53)%(x1-x0-80)),by=cy+r-12-((i*37)%Math.max(10,cy+r-lvl-14));b+=`<circle class="lsBub" style="animation-delay:-${(i%7)*0.35}s" cx="${bx}" cy="${by}" r="${1.4+(i%3)}" fill="#fff" opacity=".75"/>`}s+=b}
 [x0+(x1-x0)/3,x0+2*(x1-x0)/3].forEach(x=>{s+=`<rect x="${x-2.5}" y="${cy-r}" width="5" height="${2*r}" fill="#6b747a" opacity=".8"/>`});
 if(o.air)s+=`<g opacity=".85">${[...Array(10)].map((_,i)=>`<circle cx="${x0+60+i*((x1-x0-110)/9)}" cy="${cy-r+16+(i%3)*5}" r="${3+(i%2)}" fill="#f2c94c" opacity=".8"/>`).join("")}</g>`;
 s+=`</g><path d="M${x0+30} ${cy-r+8} H${x1-24} V${cy+r-7} H${x0+30} Z" fill="none" stroke="#c9d0d4" stroke-width="2.5"/><path d="M${x0+30} ${cy-r+8} H${x1-24} V${cy+r-7} H${x0+30} Z" fill="none" stroke="#3a4247" stroke-width="1"/>`;
 s+=`<path d="M${x1} ${cy-r} Q${x1+ex*1.6} ${cy-r} ${x1+ex*1.6} ${cy} Q${x1+ex*1.6} ${cy+r} ${x1} ${cy+r} Z" fill="url(#zSteel)" stroke="#4d555a"/>`;
 s+=`<rect x="${x0-12}" y="${cy-r-5}" width="12" height="${2*r+10}" rx="3" fill="url(#zSteel)" stroke="#4d555a"/>`;for(let i=0;i<7;i++)s+=`<circle cx="${x0-6}" cy="${cy-r+4+i*(2*r-8)/6}" r="2.2" fill="#3a4247"/>`;
 s+=`<path d="M${x0-12} ${cy-r} Q${x0-12-ex*2} ${cy-r} ${x0-12-ex*2} ${cy} Q${x0-12-ex*2} ${cy+r} ${x0-12} ${cy+r} Z" fill="url(#zBlue)" stroke="#1c3149"/><path d="M${x0-12-ex*2+3} ${cy} H${x0-14}" stroke="#1c3149" stroke-width="2"/>`;
 return s}
/* water nozzles on the left water box: two pipes going left. returns svg */
function nozzles(x,cyTop,cyBot,Ttop,Tbot,dirTop,dirBot,len=80){const nz=(y,T,dir)=>`<rect x="${x-len}" y="${y-11}" width="${len}" height="22" fill="url(#zSteelH)" stroke="#5f686d"/><rect x="${x-8}" y="${y-15}" width="7" height="30" rx="2" fill="url(#zSteel)" stroke="#5f686d"/><rect x="${x-len}" y="${y-4}" width="${len}" height="8" fill="${K.tcol(T)}" opacity=".85"/><path class="lsFlow" d="${dir>0?`M${x-len} ${y} H${x}`:`M${x} ${y} H${x-len}`}" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 10"/>`;return nz(cyTop,Ttop,dirTop)+nz(cyBot,Tbot,dirBot)}
/* small dial gauge */
function dial(x,y,r,val,max,unit,step){const a=v=>Math.PI*(1.25-1.5*cl(v,0,max)/max);let g=`<circle cx="${x}" cy="${y+3}" r="${r+7}" fill="#000" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r+6}" fill="url(#zSteel)" stroke="#4d555a"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fbfaf6" stroke="#6d757a"/>`;
 const st=step||max/4;for(let v=0;v<=max+1e-9;v+=max/20){const A=a(v),big=Math.abs(v/st-Math.round(v/st))<1e-6,l=big?r*0.18:r*0.09;g+=`<path d="M${x+Math.cos(A)*r*0.92} ${y-Math.sin(A)*r*0.92} L${x+Math.cos(A)*(r*0.92-l)} ${y-Math.sin(A)*(r*0.92-l)}" stroke="#2a2f33" stroke-width="${big?1.3:0.6}"/>`;if(big&&r>=26)g+=`<text x="${x+Math.cos(A)*r*0.6}" y="${y-Math.sin(A)*r*0.6+3}" class="lsGn">${Math.round(v)}</text>`}
 const A=a(val);return g+`<path d="M${x-Math.cos(A)*r*0.14} ${y+Math.sin(A)*r*0.14} L${x+Math.cos(A)*r*0.84} ${y-Math.sin(A)*r*0.84}" stroke="#c0281c" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r*0.09}" fill="#2a2f33"/><text x="${x}" y="${y+r*0.62}" class="lsGn" style="font-size:8px">${unit}</text>`}
/* the whole centrifugal chiller, side view: condenser on top, evaporator below, compressor and motor above, orifice between. R = plant(). o: {hi:'evap'|'cond'|'comp'|'orifice'|'flow', labels, noRead, surge} */
function chillerSVG(R,o={}){let s="";const hi=o.hi||"";
 s+=`<ellipse cx="380" cy="352" rx="300" ry="10" fill="#000" opacity=".15"/>`;
 // frame / tube sheets
 s+=`<rect x="140" y="80" width="14" height="268" rx="3" fill="url(#zSteel)" stroke="#4d555a"/><rect x="580" y="80" width="14" height="268" rx="3" fill="url(#zSteel)" stroke="#4d555a"/>`;
 s+=`<path d="M470 236 Q500 236 500 204 V60 H460" fill="none" stroke="#5f686d" stroke-width="22"/><path d="M470 236 Q500 236 500 204 V60 H460" fill="none" stroke="url(#zSteelH)" stroke-width="18"/>`;// suction from evaporator, behind the condenser
 // condenser (upper) and evaporator (lower)
 s+=shellHX({x0:160,x1:574,cy:150,r:52,Tin:R.Tb,Tout:R.Tlc,level:0.22,vapor:true,foul:R.v.condFoul,air:R.nc>2,rows:5});
 s+=shellHX({x0:160,x1:574,cy:282,r:58,Tin:R.ewt,Tout:R.lchw,level:R.v.lowCharge?0.45:0.84,vapor:false,foul:R.v.evapFoul,rows:5});
 // compressor on top: volute + motor
 s+=`<path d="M300 96 V60 H340 V96" fill="url(#zSteel)" stroke="#4d555a"/>`;// discharge into condenser
 s+=`<circle cx="400" cy="52" r="44" fill="url(#zSteel)" stroke="#4d555a" stroke-width="1.5"/><circle cx="400" cy="52" r="30" fill="url(#zSteelH)" stroke="#5f686d"/>`;
 const sp=o.surge?" lsSpinS":" lsSpin";s+=`<g class="${R.Q>1?sp.trim():""}" style="transform-origin:400px 52px">${[...Array(10)].map((_,i)=>{const A=i*36*Math.PI/180;return `<path d="M400 52 Q${400+Math.cos(A+0.5)*16} ${52+Math.sin(A+0.5)*16} ${400+Math.cos(A)*26} ${52+Math.sin(A)*26}" stroke="#2a3034" stroke-width="2.2" fill="none"/>`}).join("")}</g><circle cx="400" cy="52" r="6" fill="#2a3034"/>`;
 s+=`<rect x="196" y="28" width="104" height="50" rx="10" fill="url(#zBlue)" stroke="#1c3149"/>${[0,1,2,3,4,5].map(i=>`<path d="M${206+i*16} 32 V74" stroke="#1c3149" stroke-width="1.5" opacity=".6"/>`).join("")}<rect x="296" y="44" width="62" height="16" fill="url(#zSteelH)" stroke="#5f686d"/>`;
 // orifice / float line from condenser bottom to evaporator
 s+=`<rect x="555" y="202" width="10" height="34" fill="url(#zCuV)"/><rect x="552" y="210" width="16" height="16" rx="3" fill="url(#zBrass)" stroke="#6b5200"/>`;
 // water nozzles
 s+=nozzles(108,128,172,R.Tlc,R.Tb,-1,1,80)+nozzles(108,254,310,R.lchw,R.ewt,-1,1,80);
 if(!o.noRead){s+=K.lcd(68,103,K.f1(R.Tlc)+"°F",74)+K.lcd(68,198,K.f1(R.Tb)+"°F",74)+K.lcd(68,229,K.f1(R.lchw)+"°F",74)+K.lcd(68,336,K.f1(R.ewt)+"°F",74)}
 s+=`<text transform="translate(18 150) rotate(-90)" class="lsL" style="text-anchor:middle;font-size:13px">TOWER WATER</text><text transform="translate(18 282) rotate(-90)" class="lsL" style="text-anchor:middle;font-size:13px">BUILDING WATER</text>`;
 // gauges
 s+=dial(640,128,26,R.Pc,200,"PSIG",100)+dial(640,268,26,R.Pe,80,"PSIG",40);
 if(o.labels!==false){s+=K.lbl(640,178,"CONDENSER")+K.lbl(640,196,K.f0(R.Pc)+" psig",{c:"v"})+K.lbl(640,318,"EVAPORATOR")+K.lbl(640,336,K.f1(R.Pe)+" psig",{c:"v"});
  s+=K.tag(367,150,"CONDENSER: REFRIGERANT TURNS BACK TO LIQUID")+K.tag(367,286,"EVAPORATOR: REFRIGERANT BOILS")+K.lbl(452,30,"COMPRESSOR",{a:"start"})+K.lbl(248,20,"MOTOR")}
 const ring=(d)=>`<path d="${d}" fill="none" stroke="var(--hot)" stroke-width="3" class="lsPulse"/>`;
 if(hi==="cond")s+=ring("M150 92 H600 V208 H150 Z");if(hi==="evap")s+=ring("M150 218 H600 V346 H150 Z");if(hi==="comp")s+=ring("M190 4 H452 V100 H190 Z");if(hi==="orifice")s+=`<circle cx="560" cy="218" r="22" fill="none" stroke="var(--hot)" stroke-width="3" class="lsPulse"/>`;
 return s}
/* lift columns: condenser and evaporator saturation as two levels */
function liftBar(R,x,w,o={}){const Y=t=>320-(t-30)/(110-30)*270;let s=`<rect x="${x}" y="${Y(R.Tc)}" width="${w}" height="${Y(R.Te)-Y(R.Tc)}" fill="${o.c||"#9a6f1f"}" opacity=".16" rx="6"/>`;
 s+=`<path d="M${x} ${Y(R.Tc)} H${x+w}" stroke="#d23a26" stroke-width="3.5"/><path d="M${x} ${Y(R.Te)} H${x+w}" stroke="#2f6fd6" stroke-width="3.5"/>`;
 s+=K.arrow(`M${x+w/2} ${Y(R.Te)-4} V${Y(R.Tc)+8}`,o.c||"var(--ink)",3);
 s+=K.lbl(x+w/2+8,(Y(R.Te)+Y(R.Tc))/2+6,"LIFT "+K.f1(R.lift)+"°F",{a:"start"})+K.lbl(x+w/2,Y(R.Tc)-10,"COND "+K.f1(R.Tc)+"°F",{fill:"#d23a26"})+K.lbl(x+w/2,Y(R.Te)+22,"EVAP "+K.f1(R.Te)+"°F",{fill:"#2f6fd6"});
 if(o.title)s+=K.lbl(x+w/2,24,o.title);return s}
/* cooling tower cutaway (induced draft counterflow). R = plant(). o: {hi, noRead, scale(0-1), cycles} */
function towerSVG(R,o={}){const u=K.uid("tw");let s=`<defs><clipPath id="${u}c"><rect x="190" y="96" width="300" height="196"/></clipPath><linearGradient id="${u}a" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stop-color="#e9f3f8" stop-opacity=".0"/><stop offset="1" stop-color="#e9f3f8" stop-opacity=".55"/></linearGradient></defs>`;
 s+=`<ellipse cx="340" cy="356" rx="230" ry="9" fill="#000" opacity=".15"/>`;
 // casing
 s+=`<path d="M170 80 L510 80 L520 300 L160 300 Z" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.5"/>`;
 s+=`<g clip-path="url(#${u}c)"><rect x="160" y="80" width="360" height="230" fill="#2b3236"/>`;
 // fill media (cross corrugated)
 const fillTop=170,fillBot=240;for(let i=0;i<22;i++){const x=190+i*14;s+=`<path d="M${x} ${fillTop} l14 ${fillBot-fillTop} M${x+14} ${fillTop} l-14 ${fillBot-fillTop}" stroke="${o.scale>0.3||R.v.fill?"#b9a47a":"#cfd8dc"}" stroke-width="1.6" opacity=".8"/>`}
 s+=`<rect x="190" y="${fillTop}" width="300" height="${fillBot-fillTop}" fill="none" stroke="#9aa5ab"/>`;
 // spray headers and nozzles
 s+=`<rect x="190" y="124" width="300" height="8" fill="url(#zSteelH)"/>`;for(let i=0;i<7;i++){const x=210+i*43;s+=`<path d="M${x} 132 l-12 30 M${x} 132 l0 32 M${x} 132 l12 30" stroke="${K.tcol(R.Tlc)}" stroke-width="1.6" stroke-dasharray="3 4" class="lsFall"/>`}
 // falling water below fill
 for(let i=0;i<16;i++){const x=200+i*18;s+=`<path d="M${x} 246 V286" stroke="${K.tcol(R.Tb)}" stroke-width="1.6" stroke-dasharray="3 7" class="lsFall" style="animation-delay:-${(i%4)*0.2}s"/>`}
 // air arrows up
 if(R.fan>0.05)for(let i=0;i<4;i++){const x=220+i*72;s+=`<path d="M${x} 290 V100" stroke="url(#${u}a)" stroke-width="16" opacity="${0.3+0.6*R.fan}"/>`}
 s+=`</g>`;
 // cut edge
 s+=`<rect x="190" y="96" width="300" height="196" fill="none" stroke="#c9d0d4" stroke-width="2.5"/><rect x="190" y="96" width="300" height="196" fill="none" stroke="#3a4247"/>`;
 // air inlet louvers at bottom sides
 for(let i=0;i<4;i++){s+=`<path d="M164 ${250+i*11} l22 6 M516 ${250+i*11} l-22 6" stroke="#5f686d" stroke-width="3"/>`}
 // fan deck + stack + fan
 s+=`<path d="M250 80 L262 40 H418 L430 80 Z" fill="url(#zSteel)" stroke="#4d555a"/><ellipse cx="340" cy="40" rx="78" ry="9" fill="#2a3034"/>`;
 const sp=R.fan>0.05?"lsSpinY":"";s+=`<g class="${sp}" style="transform-origin:340px 40px;animation-duration:${(0.6/Math.max(0.15,R.fan)).toFixed(2)}s"><path d="M270 40 H410" stroke="#5f686d" stroke-width="5"/></g><circle cx="340" cy="40" r="6" fill="#4d555a"/>`;
 // air in at the louvers and out the stack
 if(R.fan>0.05){const op=(0.35+0.6*R.fan).toFixed(2);s+=`<g opacity="${op}">`+K.arrow("M108 262 H150","#8fb8d8",4)+K.arrow("M572 262 H530","#8fb8d8",4)+K.arrow("M300 30 C296 14 304 4 300 -8","#b9cfdd",4)+K.arrow("M380 30 C384 14 376 4 380 -8","#b9cfdd",4)+`</g>`}
 // basin
 s+=`<path d="M150 300 H530 V336 H150 Z" fill="url(#zSteelH)" stroke="#4d555a"/><rect x="156" y="304" width="368" height="26" fill="${K.tcol(R.Tb)}" opacity=".55"/>`;
 // makeup float valve
 s+=`<rect x="520" y="316" width="40" height="7" fill="url(#zCuH)"/><circle cx="508" cy="314" r="7" fill="#e6e6e6" stroke="#5f686d"/>`;
 // blowdown on the return line
 s+=`<rect x="110" y="104" width="80" height="16" fill="url(#zSteelH)" stroke="#5f686d"/><rect x="110" y="108" width="80" height="8" fill="${K.tcol(R.Tlc)}" opacity=".85"/><rect x="90" y="310" width="60" height="16" fill="url(#zSteelH)" stroke="#5f686d"/><rect x="90" y="314" width="60" height="8" fill="${K.tcol(R.Tb)}" opacity=".85"/>`;
 s+=`<rect x="117" y="120" width="6" height="30" fill="url(#zSteel)"/><rect x="112" y="150" width="16" height="14" rx="2" fill="url(#zBrass)" stroke="#6b5200"/><path d="M120 164 V190" stroke="#5f686d" stroke-width="5"/>`;
 if(!o.noRead){s+=K.lcd(70,92,K.f1(R.Tlc)+"°F",74)+K.lcd(70,346,K.f1(R.Tb)+"°F",74);
  s+=K.lbl(70,70,"HOT WATER IN")+K.lbl(70,300,"COLD WATER OUT")+K.lbl(106,184,"BLOWDOWN",{a:"end"})+K.lbl(566,306,"MAKEUP",{a:"start"})+K.lbl(340,20,"FAN "+K.f0(R.fan*100)+"%")+K.tag(340,208,"FILL",{w:60});if(o.side!==false)s+=K.lbl(600,262,"AIR IN",{a:"start"})+K.lbl(600,120,"OUTDOOR",{a:"start"})+K.lbl(600,140,"WET BULB",{a:"start"})+K.lbl(600,160,K.f0(R.v.wb)+"°F",{a:"start",c:"v"})}
 return s}
/* centrifugal compressor, face view of the inlet: inlet guide vanes (open 0-1), impeller behind, volute around. o: {surge, x, y, s} */
function compSVG(open,o={}){const x=o.x??360,y=o.y??190,k=o.s??1;let s=`<g transform="translate(${x} ${y}) scale(${k})">`;
 s+=`<ellipse cx="0" cy="${142}" rx="150" ry="8" fill="#000" opacity=".15"/>`;
 // volute (spiral casing)
 s+=`<path d="M0 -130 A130 130 0 1 1 -128 22 L-150 22 L-150 -40 L-118 -40 A118 118 0 0 0 0 -118 Z" fill="url(#zSteel)" stroke="#4d555a" stroke-width="1.5"/>`;
 s+=`<circle r="118" fill="url(#zSteelH)" stroke="#5f686d"/><path d="M-150 -40 H-200 V22 H-150" fill="url(#zSteelH)" stroke="#4d555a"/>`;
 // impeller seen through the inlet
 s+=`<circle r="96" fill="#2a3034"/><g class="${o.surge?"lsSpinS":"lsSpin"}">${[...Array(14)].map((_,i)=>{const A=i*360/14*Math.PI/180;return `<path d="M${Math.cos(A)*20} ${Math.sin(A)*20} Q${Math.cos(A+0.45)*60} ${Math.sin(A+0.45)*60} ${Math.cos(A+0.2)*94} ${Math.sin(A+0.2)*94}" stroke="#aeb7bd" stroke-width="3.2" fill="none"/>`}).join("")}</g><circle r="20" fill="url(#zSteel)" stroke="#4d555a"/>`;
 // inlet guide vanes: 9 blades pivoting about radial axes
 const n=9;for(let i=0;i<n;i++){const A=i*360/n,w=8+46*(1-open);s+=`<g transform="rotate(${A})"><path d="M24 0 L92 0" stroke="#4d555a" stroke-width="1.5"/><ellipse cx="58" cy="0" rx="34" ry="${(w/2).toFixed(1)}" fill="url(#zBrass)" stroke="#6b5200" opacity=".95"/></g>`}
 s+=`<circle r="98" fill="none" stroke="#c9d0d4" stroke-width="4"/>`;
 return s+`</g>`}
/* condenser close-up: cutaway, water nozzles with readouts, pressure gauge, liquid line thermometer. o: {hi:'pc'|'lcw'|'liq', noRead} */
function condSVG(R,o={}){const x0=200,x1=560,cy=200,r=86;let s=`<ellipse cx="380" cy="${cy+r+26}" rx="240" ry="9" fill="#000" opacity=".15"/>`;
 [x0+60,x1-60].forEach(x=>{s+=`<path d="M${x-30} ${cy+r+22} L${x-22} ${cy+40} H${x+22} L${x+30} ${cy+r+22} Z" fill="url(#zSteelH)" stroke="#5f686d"/>`});
 s+=`<rect x="${x0+70}" y="${cy-r-50}" width="40" height="54" fill="url(#zSteelH)" stroke="#5f686d"/><rect x="${x0+64}" y="${cy-r-58}" width="52" height="10" rx="2" fill="url(#zSteel)" stroke="#5f686d"/>`;
 s+=shellHX({x0,x1,cy,r,Tin:R.Tb,Tout:R.Tlc,level:0.2,vapor:true,foul:R.v.condFoul,air:R.nc>2,rows:6});
 s+=nozzles(x0-40,cy-46,cy+46,R.Tlc,R.Tb,-1,1,120);
 // liquid outlet + thermometer
 s+=`<path d="M${x1-40} ${cy+r} V${cy+r+50} H${x1+60}" stroke="url(#zCuV)" stroke-width="10" fill="none"/><rect x="${x1+12}" y="${cy+r+22}" width="7" height="28" fill="#c0281c"/>`;
 s+=`<rect x="${x1-112}" y="${cy-r-24}" width="5" height="24" fill="url(#zBrass)"/>`+dial(x1-110,cy-r-52,30,R.Pc,200,"PSIG",100);
 if(!o.noRead){s+=K.lcd(x0-100,cy-82,K.f1(R.Tlc)+"°F",80)+K.lbl(x0-100,cy-104,"LEAVING WATER")+K.lcd(x0-100,cy+92,K.f1(R.Tb)+"°F",80)+K.lbl(x0-100,cy+124,"ENTERING WATER");
  s+=K.lbl(x1-64,cy-r-64,"CONDENSER",{a:"start"})+K.lbl(x1-64,cy-r-46,K.f0(R.Pc)+" psig = "+K.f1(R.Tc)+"°F",{a:"start",c:"v"})+K.lcd(x1+16,cy+r+2,K.f1(R.liq)+"°F",80)+K.lbl(x1+64,cy+r+56,"LIQUID LINE",{a:"start"});
  s+=K.lbl(x0+90,cy-r-66,"HOT GAS IN")}
 if(R.nc>2)s+=K.tag((x0+x1)/2,cy-r+34,"AIR TRAPPED AT THE TOP",{c:"bad"});
 const ring=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="var(--hot)" stroke-width="3" class="lsPulse"/>`;
 if(o.hi==="pc")s+=`<circle cx="${x1-110}" cy="${cy-r-52}" r="44" fill="none" stroke="var(--hot)" stroke-width="3" class="lsPulse"/>`;if(o.hi==="lcw")s+=ring(x0-148,cy-120,100,52);if(o.hi==="liq")s+=ring(x1-34,cy+r-20,104,46);
 return s}
/* temperature ladder: wet bulb -> tower water -> leaving condenser water -> condensing; chilled water -> evaporating. Labels are spread so they never overlap. */
K.spread=(ys,gap)=>{const idx=ys.map((y,i)=>[y,i]).sort((a,b)=>a[0]-b[0]);const out=[];let last=-1e9;idx.forEach(([y,i])=>{const ny=Math.max(y,last+gap);out[i]=ny;last=ny});return out};
function ladderSVG(R,o={}){const T0=o.T0??30,T1=o.T1??110,Y=t=>350-(t-T0)/(T1-T0)*310,X0=o.x??70;let s="";
 for(let t=Math.ceil(T0/10)*10;t<=T1;t+=10)s+=`<path d="M${X0} ${Y(t)} H${X0+640}" stroke="var(--panel-edge)" stroke-width=".6"/>`+K.txt(X0-8,Y(t)+5,t+"°F",{a:"end"});
 s+=`<rect x="${X0+12}" y="${Y(R.Tc)}" width="100" height="${Y(R.Te)-Y(R.Tc)}" fill="#9a6f1f" opacity=".16" rx="5"/>`+K.arrow(`M${X0+62} ${Y(R.Te)-4} V${Y(R.Tc)+8}`,"#9a6f1f",3)+`<text transform="translate(${X0+52} ${(Y(R.Te)+Y(R.Tc))/2}) rotate(-90)" class="lsL" style="text-anchor:middle;fill:#9a6f1f">LIFT ${K.f1(R.lift)}°F</text>`;
 const L=[[R.Tc,"#d23a26","CONDENSING "+K.f1(R.Tc)+"°F",0],[R.Tlc,"#e0803a","WATER LEAVING CONDENSER "+K.f1(R.Tlc)+"°F",1],[R.Tb,"#d99a2b","TOWER WATER "+K.f1(R.Tb)+"°F",1],[R.v.wb,"#6f8060","OUTDOOR WET BULB "+K.f0(R.v.wb)+"°F",1],[R.lchw,"#5a9bd4","CHILLED WATER "+K.f1(R.lchw)+"°F",1],[R.Te,"#2f6fd6","EVAPORATING "+K.f1(R.Te)+"°F",0]];
 const ly=K.spread(L.map(l=>Y(l[0])),19);
 L.forEach((l,i)=>{const x=l[3]?X0+124:X0+12,w=l[3]?110:100;s+=`<path d="M${x} ${Y(l[0])} H${x+w}" stroke="${l[1]}" stroke-width="3"/><path d="M${X0+236} ${Y(l[0])} L${X0+256} ${ly[i]} H${X0+262}" stroke="${l[1]}" stroke-width="1" fill="none" opacity=".7"/>`+K.lbl(X0+266,ly[i]+5,l[2],{a:"start",fill:l[1],size:14})});
 if(o.brackets!==false){const bx=X0+466;const B=[[R.Tlc,R.Tc,"cond approach "+K.f1(R.appC)+"°F","#d23a26"],[R.Tb,R.Tlc,"range "+K.f1(R.range)+"°F","#e0803a"],[R.v.wb,R.Tb,"tower approach "+K.f1(R.appT)+"°F","#6f8060"],[R.Te,R.lchw,"evap approach "+K.f1(R.appE)+"°F","#2f6fd6"]];
  const by=K.spread(B.map(b=>(Y(b[0])+Y(b[1]))/2),18);
  B.forEach((b,i)=>{const xx=bx+i%2*0;s+=`<path d="M${xx} ${Y(b[0])} H${xx+7} V${Y(b[1])} H${xx}" stroke="${b[3]}" fill="none" stroke-width="1.6"/><path d="M${xx+7} ${(Y(b[0])+Y(b[1]))/2} L${xx+16} ${by[i]}" stroke="${b[3]}" stroke-width="1"/>`+K.txt(xx+19,by[i]+5,b[2],{a:"start",fill:b[3]})})}
 return s}
/* compressor map: lift vs load with the surge line and the operating point */
function mapSVG(R,o={}){const x=o.x??80,y=o.y??50,w=o.w??560,h=o.h??260;const pts=[];for(let p=0.2;p<=1.001;p+=0.05)pts.push([p*100,36+28*p]);
 const X=v=>x+(v-20)/80*w,Y=v=>y+h-(v-25)/(75-25)*h;
 let s=`<path d="M${X(20)} ${Y(75)} ${pts.map(p=>"L"+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")} L${X(100)} ${Y(75)} Z" fill="var(--bad)" opacity=".12"/>`;
 s+=K.chart({x,y,w,h,X:[20,100],Y:[25,75],xt:[20,40,60,80,100],yt:[30,40,50,60,70],xf:v=>v+"%",yf:v=>v+"°F",xl:"load (refrigerant flow)",yl:"lift",title:o.title||"COMPRESSOR MAP",series:[{pts,c:"var(--bad)",w:3}],
  dots:[{x:cl(R.plr*100,20,100),y:cl(R.lift,25,75),c:R.surge?"var(--bad)":"#2f6fd6",r:8,lbl:R.surge?"SURGING":"RUNNING HERE",a:R.plr>0.75?"end":"start",dx:R.plr>0.75?-12:12,dy:R.lift>66?20:-12}]});
 s+=K.lbl(X(26),Y(70),"SURGE: TOO MUCH LIFT FOR THE FLOW",{a:"start",c:"bad"})+K.lbl(X(98),Y(30),"STABLE",{a:"end",fill:"#2f6fd6"});return s}
