/* ============ Heat exchanger lesson kit: e-NTU / LMTD solver, steam and air properties, drawings ============
 Same math as the Heat Exchanger trainer (src/hx.js): water C = 500 x gpm, air C = 1.08 x cfm (BTU/h per °F), UA in BTU/h·°F. */
const HXK={};
HXK.HOT="#d23a26";HXK.COLD="#2f6fd6";HXK.SE="#4d555a";HXK.DK="#2a2f33";
HXK.capW=gpm=>500*gpm;HXK.capA=cfm=>1.08*cfm;
/* water temperature color, same scale as the trainer (40 to 200°F) */
HXK.fr=(T,lo,mid,hi)=>T<mid?Math.max(0,0.5*(T-lo)/(mid-lo)):Math.min(1,0.5+0.5*(T-mid)/(hi-mid));
HXK.div=(T,lo,mid,hi)=>{const f=HXK.fr(T,lo,mid,hi);if(f<0.5){const g=f/0.5;return `hsl(${Math.round(218-8*g)},${Math.round(72-30*g)}%,${Math.round(42+26*g)}%)`}const g=(f-0.5)/0.5;return `hsl(${Math.round(34-30*g)},${Math.round(70+8*g)}%,${Math.round(62-16*g)}%)`};
HXK.tc=T=>HXK.div(T,40,100,200);
/* darker version for temperature text on paper */
HXK.dx=(T,lo,mid,hi)=>{const f=HXK.fr(T,lo,mid,hi);return f<0.5?`hsl(${Math.round(218-10*f)},62%,${Math.round(40+6*f)}%)`:`hsl(${Math.round(34-30*(f-0.5)/0.5)},78%,${Math.round(40)}%)`};
/* air temperature color (0 to 110°F, neutral near 65°F) */
HXK.ta=T=>HXK.div(T,0,65,110);
/* effectiveness from NTU and Cr. arr: cf counterflow, pf parallel, xf crossflow (both unmixed, plate HRV core), cond (one side at constant temperature) */
HXK.eff=(arr,N,Cr)=>{if(arr==="cond"||Cr<1e-6)return 1-Math.exp(-N);
 if(arr==="pf")return (1-Math.exp(-N*(1+Cr)))/(1+Cr);
 if(arr==="xf")return 1-Math.exp((1/Cr)*Math.pow(N,0.22)*(Math.exp(-Cr*Math.pow(N,0.78))-1));
 if(Math.abs(1-Cr)<1e-6)return N/(1+N);return (1-Math.exp(-N*(1-Cr)))/(1-Cr*Math.exp(-N*(1-Cr)))};
/* solve an exchanger. o: {arr, Th, Tc, Ch, Cc, UA}. Ch may be Infinity (condensing steam or refrigerant).
 returns Q, outlets, e, NTU, Cr, LMTD, the two end temperature differences, closest approach, temperature cross, and the profile along the exchanger (x=0 at the hot inlet) */
HXK.solve=o=>{const {Th,Tc,UA}=o;const arr=o.arr||"cf";const Ch=o.Ch,Cc=o.Cc;
 const Cmin=Math.min(Ch,Cc),Cmax=Math.max(Ch,Cc),Cr=isFinite(Cmax)?Cmin/Cmax:0,NTU=UA/Cmin;
 const e=HXK.eff(arr,NTU,Cr),Q=e*Cmin*(Th-Tc),Tho=isFinite(Ch)?Th-Q/Ch:Th,Tco=Tc+Q/Cc;
 const pf=arr==="pf"||arr==="cond";
 const d1=pf?Th-Tc:Th-Tco,d2=pf?Tho-Tco:Tho-Tc;
 const lmtd=Math.abs(d1-d2)<0.01*Math.max(1,Math.abs(d1))?(d1+d2)/2:(d1-d2)/Math.log(d1/d2);
 const appr=pf?Tho-Tco:Math.min(Th-Tco,Tho-Tc);
 const iCh=isFinite(Ch)?1/Ch:0;const m=UA*(pf?iCh+1/Cc:iCh-1/Cc),th1=pf?Th-Tc:Th-Tco;
 const Qx=x=>Math.abs(m)<1e-9?UA*th1*x:UA*th1*(1-Math.exp(-m*x))/m;
 const N=80,ph=[],pc=[];for(let i=0;i<=N;i++){const q=Qx(i/N);ph.push(Th-q*iCh);pc.push(pf?Tc+q/Cc:Tco-q/Cc)}
 return {arr,Th,Tc,Ch,Cc,UA,Cmin,Cr,NTU,e,Q,Tho,Tco,d1,d2,lmtd,appr,ph,pc,cross:arr==="cf"&&isFinite(Ch)&&Tco>Tho+0.05}};
/* water to water in one call: {arr, Th, Tc, gh, gc, UA} with flows in gpm */
HXK.water=o=>HXK.solve({arr:o.arr,Th:o.Th,Tc:o.Tc,Ch:o.gh==null?Infinity:500*o.gh,Cc:500*o.gc,UA:o.UA});
/* ---------- steam: saturation temperature from pressure (psig; negative = vacuum) ---------- */
HXK.ST=[[1,101.7],[2,126.1],[3,141.4],[4,152.9],[5,162.2],[6,170.0],[7,176.8],[8,182.8],[10,193.2],[12,202.0],[14.696,212.0],[16,216.3],[18,222.4],[20,228.0],[25,240.1],[30,250.3],[35,259.3],[40,267.2],[50,281.0],[65,297.9]];
HXK.satT=psig=>{const p=Math.max(1,Math.min(65,psig+14.696)),t=HXK.ST;for(let i=1;i<t.length;i++)if(p<=t[i][0]){const a=t[i-1],b=t[i];return a[1]+(b[1]-a[1])*(p-a[0])/(b[0]-a[0])}return t[t.length-1][1]};
HXK.satP=T=>{const t=HXK.ST;const T1=Math.max(t[0][1],Math.min(t[t.length-1][1],T));for(let i=1;i<t.length;i++)if(T1<=t[i][1]){const a=t[i-1],b=t[i];return a[0]+(b[0]-a[0])*(T1-a[1])/(b[1]-a[1])-14.696}return t[t.length-1][0]-14.696};
/* pressure text: psig above atmosphere, inches of mercury vacuum below */
HXK.pTxt=p=>p>=0?K.f1(p)+" psig":K.f1(-p*2.036)+" in. Hg vac";
/* ---------- moist air (sea level) ---------- */
HXK.pw=T=>{const c=(T-32)/1.8;return c>=0?0.61094*Math.exp(17.625*c/(c+243.04)):0.61115*Math.exp(22.452*c/(272.55+c))};
HXK.gr=(T,rh)=>{const p=HXK.pw(T)*rh/100;return 7000*0.622*p/(101.325-p)};          // humidity ratio, grains per lb of dry air
HXK.dew=gr=>{const W=gr/7000,p=101.325*W/(0.622+W);let lo=-60,hi=120;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(HXK.pw(m)<p)lo=m;else hi=m}return (lo+hi)/2};
HXK.rh=(T,gr)=>{const W=gr/7000,p=101.325*W/(0.622+W);return Math.min(100,100*p/HXK.pw(T))};
/* ---------- drawing helpers ---------- */
HXK.pipe=(d,col,w=6,flow=true)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`+(flow?`<path class="lsFlow" d="${d}" fill="none" stroke="#fff" stroke-width="${Math.max(1.3,w*0.32)}" stroke-linecap="round" stroke-dasharray="6 14" opacity=".8"/>`:"");
HXK.t=(x,y,T,o={})=>`<text x="${x}" y="${y}" class="lsG" style="text-anchor:${o.a||"middle"};font-family:var(--mono);font-weight:600;font-size:${o.size||15}px;fill:${o.fill||(o.air?HXK.dx(T,0,65,110):HXK.dx(T,40,100,200))}">${Math.round(T)}°F</text>`;
HXK.grad=(id,c1,c2,vert)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
HXK.metal=id=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset=".45" stop-color="#d5dadd"/><stop offset="1" stop-color="#9aa3a8"/></linearGradient>`;
HXK.metalH=id=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa3a8"/><stop offset=".35" stop-color="#eef1f3"/><stop offset="1" stop-color="#a7afb4"/></linearGradient>`;
HXK.brass=id=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d88a"/><stop offset=".5" stop-color="#c9a24a"/><stop offset="1" stop-color="#8a6a22"/></linearGradient>`;
/* the two-stream exchanger from the trainer's Basics tab. o: {x,y,w,title} (channel band about 150 tall) */
HXK.basic=(R,o={})=>{const x=o.x??140,y=o.y??60,w=o.w??440,pf=R.arr==="pf",gH=K.uid("gh"),gC=K.uid("gc"),gS=K.uid("gs");
 const y1=y+40,y2=y+110;
 let s=`<defs>${HXK.grad(gH,HXK.tc(R.Th),HXK.tc(R.Tho))}${HXK.grad(gC,HXK.tc(pf?R.Tc:R.Tco),HXK.tc(pf?R.Tco:R.Tc))}${HXK.metal(gS)}</defs>`;
 s+=`<rect x="${x}" y="${y}" width="${w}" height="150" rx="14" fill="url(#${gS})" stroke="${HXK.SE}" stroke-width="1.5"/>`;
 s+=`<rect x="${x+10}" y="${y1-24}" width="${w-20}" height="48" rx="8" fill="url(#${gH})" opacity=".85"/><rect x="${x+10}" y="${y2-24}" width="${w-20}" height="48" rx="8" fill="url(#${gC})" opacity=".85"/>`;
 s+=`<rect x="${x+10}" y="${y+72}" width="${w-20}" height="6" fill="#59636a"/>`;
 const L=x-110,Rx=x+w+110;
 s+=HXK.pipe(`M${L} ${y1} H${Rx}`,HXK.tc((R.Th+R.Tho)/2),7)+(pf?HXK.pipe(`M${L} ${y2} H${Rx}`,HXK.tc((R.Tc+R.Tco)/2),7):HXK.pipe(`M${Rx} ${y2} H${L}`,HXK.tc((R.Tc+R.Tco)/2),7));
 s+=K.arrow(`M${x+w/2-30} ${y1} h60`,"#fff",2.4)+K.arrow(pf?`M${x+w/2-30} ${y2} h60`:`M${x+w/2+30} ${y2} h-60`,"#fff",2.4);
 const lab=(xx,yy,t,a)=>K.lbl(xx,yy,t,{a,size:13});
 s+=lab(L,y1-12,"HOT IN","start")+HXK.t(L,y1+26,R.Th,{a:"start"})+lab(Rx,y1-12,"HOT OUT","end")+HXK.t(Rx,y1+26,R.Tho,{a:"end"});
 s+=pf?lab(L,y2-12,"COLD IN","start")+HXK.t(L,y2+26,R.Tc,{a:"start"})+lab(Rx,y2-12,"COLD OUT","end")+HXK.t(Rx,y2+26,R.Tco,{a:"end"})
     :lab(Rx,y2-12,"COLD IN","end")+HXK.t(Rx,y2+26,R.Tc,{a:"end"})+lab(L,y2-12,"COLD OUT","start")+HXK.t(L,y2+26,R.Tco,{a:"start"});
 if(o.title!==false)s+=K.lbl(x+w/2,y-12,o.title||(pf?"PARALLEL FLOW: BOTH ENTER AT THE LEFT":"COUNTERFLOW: OPPOSITE DIRECTIONS"),{size:14});
 return s};
/* temperature profile along the exchanger, like the trainer's graph.
 o: {x,y,w,h, lo, hi, title, mark:"appr"|"ends"|"", ghost:R2 (drawn faded and dashed), ends:true (end labels), air} */
HXK.prof=(R,o={})=>{const x0=o.x??70,y0=o.y??40,w=o.w??600,h=o.h??270;
 const all=R.ph.concat(R.pc).concat(o.ghost?o.ghost.ph.concat(o.ghost.pc):[]);
 const lo=o.lo??Math.floor(Math.min(...all)/10)*10-10,hi=o.hi??Math.ceil(Math.max(...all)/10)*10+10;
 const span=hi-lo,st=o.step||(span>150?40:span>80?20:10);const yt=[];for(let v=Math.ceil(lo/st)*st;v<=hi;v+=st)yt.push(v);
 const n=R.ph.length-1,X=i=>x0+w*i/n,Y=t=>y0+h-(t-lo)/span*h;
 let s=K.chart({x:x0,y:y0,w,h,X:[0,1],Y:[lo,hi],yt,yf:v=>v+"°",title:o.title});
 const pl=a=>a.map((t,i)=>`${i?"L":"M"}${X(i).toFixed(1)} ${Y(Math.max(lo,Math.min(hi,t))).toFixed(1)}`).join("");
 if(o.ghost){const G=o.ghost;s+=`<path d="${pl(G.ph)}" fill="none" stroke="${HXK.HOT}" stroke-width="2" stroke-dasharray="6 5" opacity=".55"/><path d="${pl(G.pc)}" fill="none" stroke="${HXK.COLD}" stroke-width="2" stroke-dasharray="6 5" opacity=".55"/>`}
 const hc=isFinite(R.Ch)?HXK.HOT:"#a06a8a";
 s+=`<path d="${pl(R.ph)}" fill="none" stroke="${hc}" stroke-width="3.2"/><path d="${pl(R.pc)}" fill="none" stroke="${HXK.COLD}" stroke-width="3.2"/>`;
 const pf=R.arr==="pf"||R.arr==="cond";
 const arw=(a,i,dir,col)=>{const x=X(i),y=Y(a[i]),dy=(Y(a[Math.min(n,i+1)])-Y(a[Math.max(0,i-1)]))/(2*w/n);const ang=Math.atan(dy)*180/Math.PI+(dir<0?180:0);return `<path d="M-7 -6 L5 0 L-7 6" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})" fill="none" stroke="${col}" stroke-width="2.6"/>`};
 s+=arw(R.ph,Math.round(n*.3),1,hc)+arw(R.ph,Math.round(n*.72),1,hc)+arw(R.pc,Math.round(n*.3),pf?1:-1,HXK.COLD)+arw(R.pc,Math.round(n*.72),pf?1:-1,HXK.COLD);
 if(o.ends!==false){const f=(xx,yy,t,a,c)=>{const Y1=Math.max(y0+14,Math.min(y0+h-6,yy)),tw=t.length*6.6+6;return `<rect x="${a==="start"?xx-3:xx-tw+3}" y="${Y1-12}" width="${tw}" height="16" rx="3" fill="var(--paper)" opacity=".85"/><text x="${xx}" y="${Y1}" class="lsG" style="text-anchor:${a};fill:${c};font-size:13px">${t}</text>`};
  const hiR=R.ph[n]>R.pc[n],hiL=R.ph[0]>R.pc[0];
  s+=f(X(0)+8,Y(R.ph[0])+(hiL?-8:18),Math.round(R.ph[0])+"°F "+(isFinite(R.Ch)?"hot in":"steam"),"start",hc)+f(X(n)-6,Y(R.ph[n])+(hiR?-8:18),Math.round(R.ph[n])+"°F "+(isFinite(R.Ch)?"hot out":"steam"),"end",hc);
  s+=f(X(0)+8,Y(R.pc[0])+(hiL?18:-8),Math.round(R.pc[0])+"°F "+(pf?"cold in":"cold out"),"start",HXK.COLD)+f(X(n)-6,Y(R.pc[n])+(hiR?18:-8),Math.round(R.pc[n])+"°F "+(pf?"cold out":"cold in"),"end",HXK.COLD)}
 if(o.mark==="appr"){let mi=0,md=1e9;R.ph.forEach((t,i)=>{const d=t-R.pc[i];if(d<md){md=d;mi=i}});if(R.cross){mi=R.Tho-R.Tc<R.Th-R.Tco?n:0;md=R.ph[mi]-R.pc[mi]}const ax=X(mi)+(mi===0?8:mi===n?-8:0),right=mi>n/2;
  s+=`<path d="M${ax} ${Y(R.ph[mi])} V${Y(R.pc[mi])}" stroke="var(--brass)" stroke-width="3" stroke-dasharray="4 3"/>`+K.tag(ax+(right?-14:14),(Y(R.ph[mi])+Y(R.pc[mi]))/2+6,"APPROACH "+K.f1(md)+"°F",{a:right?"end":"start",fill:"var(--brass)"})}
 if(o.mark==="ends"){const e1=0,e2=n;[[e1,R.ph[0]-R.pc[0],"ΔT1"],[e2,R.ph[n]-R.pc[n],"ΔT2"]].forEach(([i,d,l])=>{const ax=X(i)+(i?-4:4);s+=`<path d="M${ax} ${Y(R.ph[i])} V${Y(R.pc[i])}" stroke="var(--brass)" stroke-width="3"/>`+K.tag(ax+(i?-12:12),(Y(R.ph[i])+Y(R.pc[i]))/2+6,l+" = "+K.f1(d)+"°F",{a:i?"end":"start",fill:"var(--brass)"})})}
 s+=K.txt(x0+w/2,y0+h+22,o.xl||"position along the exchanger (hot inlet on the left)");
 return s};
/* a dial thermometer-style readout used on pipes: small LCD with label above */
HXK.read=(x,y,t,lab,w=86)=>K.lcd(x,y,t,w)+(lab?K.lbl(x,y-22,lab,{size:12}):"");
/* NTU that gives effectiveness e (bisection), used to set a core's UA from its rated effectiveness */
HXK.ntuFor=(arr,e,Cr)=>{let lo=0,hi=40;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(HXK.eff(arr,m,Cr)<e)lo=m;else hi=m}return (lo+hi)/2};
