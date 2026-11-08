/* ============ Refrigeration lesson helpers: a steady-state split AC model (on RF) and the drawings ============
 A 3-ton R-410A split system with a fixed-speed compressor. Solved from physics, not canned numbers:
 - compressor: volume flow x volumetric efficiency / suction specific volume (RF.vap)
 - evaporator: wet-coil enthalpy potential (indoor wet bulb) or dry-coil sensible, whichever is larger; part of the
   coil is used to superheat the vapor (fSH), and superheat comes from that fraction
 - condenser: rejects mdot x (h2 - h5); part of it is backed up with liquid (fSC), which gives subcooling and
   pushes condensing temperature up
 - metering: piston flow = C x sqrt(dP), more with subcooled liquid, much less with flash gas; a TXV holds its
   superheat setting until it runs out of opening
 - charge: the refrigerant in the condenser, liquid line and evaporator must add up to the charge in the system. */
const REF={};
REF.N="R-410A";
const rfE=(T,k)=>RF.at(REF.N,T,k);
/* moist air: saturated enthalpy at T (°F), Btu/lb dry air, sea level */
REF.hs=TF=>{const C=(TF-32)/1.8,es=0.61094*Math.exp(17.625*C/(C+243.04)),W=0.622*es/(101.325-es);return 0.24*TF+W*(1061+0.444*TF)};
REF.DES={tout:95,wb:63,db:75,air:100,charge:100,meter:"piston",fault:"none",txvSH:10};
/* target superheat for a fixed orifice (piston): ((3 x indoor WB) - 80 - outdoor DB) / 2 */
REF.tsh=(wb,db)=>(3*wb-80-db)/2;
REF.K={VD:232,UAC:2700,NS:3,NC:6,LC:16,LE:5,LL:1.6,LO:1.0,EX:0.3};
REF.F={none:{},dirtyCond:{uac:0.5},restr:{cap:0.35,dropSC:1},bulbLost:{cap:0.22},bulbLoose:{txvSH:1},ncg:{ncg:14},weakComp:{vd:0.72,eff:0.5},dirtyEvap:{ua:0.6}};
REF.FN=[["none","No fault"],["dirtyCond","Dirty condenser coil"],["restr","Restricted liquid line / plugged drier"],["bulbLost","TXV power head lost its charge"],["bulbLoose","TXV bulb loose on the suction line"],["ncg","Air in the system (non-condensables)"],["weakComp","Worn compressor"],["dirtyEvap","Dirty evaporator coil"]];
/* the solve. o: {tout, wb, db, air (%), charge (%), meter, fault, txvSH} */
REF.inner=(o,z,C)=>{const {VD,UAC,NS,NC,LC,LE,LL,LO,EX}=REF.K,f=REF.F[o.fault]||{},af=o.air/100,mair=4.5*1200*af,epsF=1-Math.exp(-1.45*Math.pow(af,-0.4)*(f.ua||1));
 const fSC=Math.max(0,z),x=Math.max(0,-z),uac=UAC*(f.uac||1),vd=VD*(f.vd||1),eff=f.eff||0.7,hw=REF.hs(o.wb);
 const txv=o.meter==="txv",shSet=f.txvSH??o.txvSH??10;
 let Tc=o.tout+20,Te=40,SH=8,SC=8,mm=0,mc=0,flood=0,fSH=0.1,starve=false,h5=0,cyc=null;
 const v1=(Te,sh)=>RF.vap(REF.N,rfE(Te,"Pd"),Te+sh,"v");
 for(let it=0;it<30;it++){
  SC=(Tc-o.tout)*(1-Math.exp(-NC*fSC));const Pd=rfE(Tc,"Pd"),Tcb=RF.Tsat(REF.N,Pd,"Pb");
  const Tliq=Tcb-SC;h5=x>0?rfE(Tcb,"hf")+x*(rfE(Tc,"hg")-rfE(Tcb,"hf")):rfE(Tliq,"hf");
  const Qfull=Te=>mair*epsF*Math.max(hw-REF.hs(Te+3),0.245*(o.db-Te-3),0);
  const meter=(Te,Cx)=>Cx*Math.pow(Math.max(5,Pd-rfE(Te,"Pd")),EX)*(1+0.012*SC-(f.dropSC?0.012*SC:0))/(1+15*x);
  const comp=(Te,sh)=>{const Ps=rfE(Te,"Pd");return vd*Math.max(0.3,1-0.035*(Pd/Ps-1))/v1(Te,sh)};
  const solveP=Cx=>{let a=-30,b=Math.min(o.db-4,Tc-8),r={};for(let k=0;k<40;k++){const m=(a+b)/2,hg=rfE(m,"hg"),q=Qfull(m),mf=meter(m,Cx);let F;
    const fs=q>0?1-mf*(hg-h5)/q:-1;if(fs>0){const sh=(o.db-m)*(1-Math.exp(-NS*fs));F=comp(m,sh)-mf;r={Te:m,sh,fs,mm:mf,flood:0}}
    else{const mv=q/(hg-h5);F=comp(m,0)-mv;r={Te:m,sh:0,fs:0,mm:mf,flood:Math.max(0,mf-mv)/Math.max(1,mv)}}
    if(F>0)b=m;else a=m}return r};
  let r;starve=false;
  if(txv){const sh=shSet;let a=-30,b=Math.min(o.db-4,Tc-8);for(let k=0;k<40;k++){const m=(a+b)/2,hg=rfE(m,"hg"),fs=-Math.log(Math.max(0.02,1-sh/Math.max(sh+0.5,o.db-m)))/NS,ev=Qfull(m)*(1-Math.min(0.95,fs))/(hg-h5);
    if(comp(m,sh)-ev>0)b=m;else a=m}const m=(a+b)/2;const fs=-Math.log(Math.max(0.02,1-sh/Math.max(sh+0.5,o.db-m)))/NS;r={Te:m,sh,fs:Math.min(0.95,fs),mm:comp(m,sh),flood:0};
   const cmax=C.txv*(f.cap||1);if(meter(m,cmax)<r.mm){r=solveP(cmax);starve=true}}
  else r=solveP(C.pis*(f.cap?Math.max(0.5,f.cap*1.6):1));
  Te+= (r.Te-Te)*(it?0.6:1);SH=r.sh;fSH=r.fs;mm=r.mm;flood=r.flood;
  cyc=RF.cycle(REF.N,{Te,Tc,sh:SH,sc:Math.max(0,SC),eff});mc=comp(Te,SH);
  const h2=cyc.h2,Qc=mc*(h2-h5)+(flood>0?0:0);const TcN=o.tout+Qc/(uac*Math.max(0.08,1-fSC))+(f.ncg||0);Tc+=(Math.min(RF.Tmax(REF.N)-3,TcN)-Tc)*0.6}
 const mass=LC*(fSC+0.3*(1-fSC)*(1-Math.min(1,3*x)))+LE*(0.25*(1-fSH)+0.2*Math.min(1,flood))+LL*(1-x)/(1+20*x)+LO;
 const c=cyc;
 return {Te,Tc,SH,SC:Math.max(0,SC),fSC,fSH,x,mm,mdot:mc,flood,starve,mass,cy:c,Ps:c.Ps,Pd:c.Pd,T2:c.T2,h5,Q:mc*(rfE(Te,"hg")-h5),W:mc*c.HOC};
};
/* calibration: the piston is sized so the design day (95°F out, 63°F WB in) lands on the target superheat; 100% charge
 gives 12% of the condenser backed up with liquid (about 10°F subcooling with a TXV) */
REF.cal=()=>{let C={pis:30,txv:0};const d=REF.DES,tgt=REF.tsh(d.wb,d.tout);let a=5,b=120;
 for(let k=0;k<30;k++){C.pis=(a+b)/2;const r=REF.inner(d,0.12,C);if(r.SH>tgt)a=C.pis;else b=C.pis}
 const rp=REF.inner(d,0.12,C);C.Mp=rp.mass;const rt=REF.inner({...d,meter:"txv"},0.12,{...C,txv:999});
 C.txv=1.7*rt.mdot/(Math.pow(rt.Pd-rt.Ps,REF.K.EX)*(1+0.012*rt.SC));C.Mt=rt.mass;return C};REF.C=REF.cal();
REF.MEMO={};
REF.solve=o=>{o={...REF.DES,...o};const key=JSON.stringify(o);if(REF.MEMO[key])return REF.MEMO[key];const C=REF.C,M=(o.meter==="txv"?C.Mt:C.Mp)*o.charge/100;let a=-0.5,b=0.85,r;
 for(let k=0;k<22;k++){const z=(a+b)/2;r=REF.inner(o,z,C);if(r.mass>M)b=z;else a=z}
 r=REF.inner(o,(a+b)/2,C);
 r.o=o;r.psS=r.Ps-14.7;r.psD=r.Pd-14.7;r.tsh=REF.tsh(o.wb,o.tout);r.suctT=r.Te+r.SH;r.liqT=r.cy.T5;r.tons=r.Q/12000;
 r.sup=REF.supply(o,r);r.split=o.db-r.sup;r.watts=r.W/3.412/0.85+350;return REF.MEMO[key]=r};
/* supply air temperature leaving the coil (°F) */
REF.supply=(o,r)=>{const af=o.air/100,mair=4.5*1200*af,hin=REF.hs(o.wb),hout=hin-r.Q/mair;let a=30,b=o.db;for(let k=0;k<30;k++){const m=(a+b)/2;if(REF.hs(m)>hout)b=m;else a=m}
 const Tsat=(a+b)/2;return Math.max(Tsat,o.db-r.Q/(mair*0.245)*0.72)};
REF.p=P=>K.f0(P-14.7)+" psig";
/* ---------- drawing ---------- */
/* gradients and patterns get a fresh id per drawing: a hidden tab's defs earlier in the page would otherwise win and not render */
REF.uniq=s=>{const u=K.uid("g");return s.replace(/(id="|url\(#)(rf[A-Za-z]+)/g,(m,a,b)=>a+b+u)};
REF.U=f=>(...a)=>REF.uniq(f(...a));
REF.wrapSteps=steps=>steps.forEach(st=>{const d=st.draw;st.draw=x=>REF.uniq(d(x))});
REF.COL={dis:"#c0392b",cnd:"#dd5a26",liq:"#e8892b",mix:"#2f6fd6",suc:"#86bdf0",air:"#3a8bd6",warm:"#d9824a"};
REF.defs=()=>`<defs><linearGradient id="rfCab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f5f2"/><stop offset="1" stop-color="#cfd3cf"/></linearGradient>
 <linearGradient id="rfCabS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9cfd2"/><stop offset=".5" stop-color="#eef1f2"/><stop offset="1" stop-color="#b9c0c4"/></linearGradient>
 <linearGradient id="rfShell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c2023"/><stop offset=".4" stop-color="#4d565c"/><stop offset="1" stop-color="#15181a"/></linearGradient>
 <linearGradient id="rfBrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecc870"/><stop offset=".5" stop-color="#c79a33"/><stop offset="1" stop-color="#8c6a1c"/></linearGradient>
 <linearGradient id="rfBrassV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8c6a1c"/><stop offset=".45" stop-color="#ecc870"/><stop offset="1" stop-color="#8c6a1c"/></linearGradient>
 <linearGradient id="rfSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4c555b"/><stop offset=".45" stop-color="#a4adb3"/><stop offset="1" stop-color="#3d454a"/></linearGradient>
 <pattern id="rfFins" width="3" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="#a9b2b8"/><rect width="1.1" height="10" fill="#eef2f4"/></pattern>
 <pattern id="rfFinsH" width="10" height="3" patternUnits="userSpaceOnUse"><rect width="10" height="3" fill="#a9b2b8"/><rect width="10" height="1.1" fill="#eef2f4"/></pattern>
 <pattern id="rfGrille" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#30363a"/><path d="M0 3H6" stroke="#5d666c" stroke-width="1.4"/></pattern>
 <pattern id="rfBrick" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#c4b9a6"/><path d="M0 0 H24 M0 6 H24 M6 0 V6 M18 6 V12" stroke="#9c8f78" stroke-width=".8"/></pattern></defs>`;
/* a copper line colored by what is inside it; ins = insulated suction line */
REF.pipe=(d,col,w=6,o={})=>(o.ins?`<path d="${d}" stroke="#16191b" stroke-width="${w+8}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`:`<path d="${d}" stroke="#6a3418" stroke-width="${w+2.5}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`)+
 `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`+(o.flow===false?"":`<path d="${d}" stroke="#fff" stroke-width="1.3" fill="none" stroke-dasharray="4 10" class="lsFlow" opacity=".75"/>`);
/* a path drawn in colored zones along its length: zones = [[fraction, color], ...] that add to 1 */
REF.zoned=(d,zones,w)=>{let s="",a=0;zones.forEach(([f,c])=>{if(f<=0.001)return;s+=`<path d="${d}" pathLength="100" stroke="${c}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-dasharray="0 ${(a*100).toFixed(2)} ${(f*100).toFixed(2)} 200"/>`;a+=f});return s};
/* zig-zag tube along a coil slab from B to T */
REF.zig=(B,T,n,amp)=>{const dx=T[0]-B[0],dy=T[1]-B[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;let p=`M${B[0]} ${B[1]}`;for(let i=1;i<=n;i++){const t=i/(n+1),s=i%2?1:-1;p+=` L${(B[0]+dx*t+nx*amp*s).toFixed(1)} ${(B[1]+dy*t+ny*amp*s).toFixed(1)}`}return p+` L${T[0]} ${T[1]}`};
/* serpentine tube starting at (xs, y0), rows passes between xs and xe, ending near y1 */
REF.serp=(xe,xs,y0,y1,rows)=>{let p=`M${xs} ${y0}`;const dir=xs>xe;for(let i=0;i<rows;i++){const y=y0+(y1-y0)*i/(rows-1),yn=y0+(y1-y0)*(i+1)/(rows-1),A=i%2===0,x=A?xe:xs;p+=` H${x}`;if(i<rows-1)p+=` A${((yn-y)/2).toFixed(2)} ${((yn-y)/2).toFixed(2)} 0 0 ${(A===dir)?0:1} ${x} ${yn.toFixed(1)}`}return p};
/* metering device at (x,y): piston in a distributor body, or a TXV with its power head */
REF.meterSVG=(x,y,txv,o={})=>txv?`<rect x="${x-14}" y="${y-9}" width="28" height="18" rx="3" fill="url(#rfBrass)" stroke="#5e400e"/><path d="M${x-12} ${y-9} V${y-20} Q${x} ${y-32} ${x+12} ${y-20} V${y-9} Z" fill="url(#rfBrass)" stroke="#5e400e"/><rect x="${x-15}" y="${y-24}" width="30" height="5" rx="2" fill="#8c6a1c"/>`
 :`<rect x="${x-13}" y="${y-8}" width="26" height="16" rx="7" fill="url(#rfBrass)" stroke="#5e400e"/><rect x="${x-4}" y="${y-8}" width="3" height="16" fill="#8c6a1c"/><rect x="${x+3}" y="${y-8}" width="3" height="16" fill="#8c6a1c"/>`;
/* digital manifold face. v: {ps, Te, st, sh, pd, Tc, lt, sc} */
REF.manifold=(x,y,v,o={})=>{const w=o.w||260,h=o.h||132,cL=x+w*0.27,cR=x+w*0.73;const sh=v.sh==null?"--":K.f1(v.sh)+"°F",sc=v.sc==null?"--":K.f1(v.sc)+"°F";
 return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#2b3134" stroke="#111"/><rect x="${x+10}" y="${y+10}" width="${w-20}" height="${h-20}" rx="5" fill="#101416" stroke="#3a4247"/>
 <rect x="${x+12}" y="${y+12}" width="${w/2-14}" height="5" fill="#2f6fd6"/><rect x="${x+w/2+2}" y="${y+12}" width="${w/2-14}" height="5" fill="#c0392b"/><path d="M${x+w/2} ${y+18} V${y+h-14}" stroke="#3a4247"/>
 <text x="${cL}" y="${y+44}" class="lsLcd" style="font-size:21px">${K.f0(v.ps)}<tspan style="font-size:11px"> psig</tspan></text><text x="${cR}" y="${y+44}" class="lsLcd" style="font-size:21px">${K.f0(v.pd)}<tspan style="font-size:11px"> psig</tspan></text>
 <text x="${cL}" y="${y+64}" class="lsLcd" style="font-size:12px;fill:#9fd8b8">evap sat ${K.f1(v.Te)}°F</text><text x="${cR}" y="${y+64}" class="lsLcd" style="font-size:12px;fill:#9fd8b8">cond sat ${K.f1(v.Tc)}°F</text>
 <text x="${cL}" y="${y+82}" class="lsLcd" style="font-size:12px;fill:#9fd8b8">suction ${K.f1(v.st)}°F</text><text x="${cR}" y="${y+82}" class="lsLcd" style="font-size:12px;fill:#9fd8b8">liquid ${K.f1(v.lt)}°F</text>
 <text x="${cL}" y="${y+108}" class="lsLcd" style="font-size:16px;fill:${o.shc||"#7CFFB2"}">SH ${sh}</text><text x="${cR}" y="${y+108}" class="lsLcd" style="font-size:16px;fill:${o.scc||"#7CFFB2"}">SC ${sc}</text>`};
/* the whole split system, viewBox 0 0 900 500. r from REF.solve. o: {labels, hi:"sh"|"sc"|"meter"|..., off} */
REF.VB="0 0 900 500";
REF.scene=(r,o={})=>REF.uniq(REF.scene0(r,o));
REF.scene0=(r,o={})=>{const C=REF.COL,S=r.o,txv=S.meter==="txv",lab=o.labels!==false;let s=REF.defs();
 // rooms
 s+=`<rect x="484" y="0" width="416" height="470" fill="#dbe8f2" opacity=".75"/><rect x="484" y="470" width="416" height="30" fill="#8c9a6a"/><rect x="0" y="470" width="470" height="30" fill="#b99a74"/><rect x="470" y="0" width="14" height="500" fill="url(#rfBrick)" stroke="#8a7d66" stroke-width=".8"/>`;
 s+=K.lbl(16,26,"INDOORS",{a:"start"})+K.lbl(496,26,"OUTDOORS",{a:"start"})+K.lbl(496,50,K.f0(S.tout)+"°F",{a:"start",size:20,fill:K.tcol(S.tout)});
 // air handler cabinet (cut away)
 s+=`<rect x="140" y="96" width="140" height="74" fill="url(#rfCab)" stroke="#6f787e"/><rect x="90" y="168" width="240" height="290" rx="3" fill="url(#rfCab)" stroke="#6f787e" stroke-width="1.2"/><rect x="98" y="176" width="224" height="274" fill="#e6eaec" stroke="#9aa3a9"/><rect x="146" y="102" width="128" height="68" fill="#e6eaec"/>`;
 // airflow
 const af=S.air/100,nA=af<0.7?2:3,sup=r.sup;for(let i=0;i<nA;i++){const x=nA===2?190+i*40:170+i*40;s+=K.arrow(`M${x} 112 V${70-af*16}`,K.tcol(sup),1.6+af*1.6)}
 s+=K.lbl(292,66,"SUPPLY "+K.f0(sup)+"°F",{a:"start",fill:K.tcol(sup),size:14});
 for(let i=0;i<2;i++)s+=K.arrow(`M28 ${404+i*26} H${84}`,K.tcol(S.db),1.6+af*1.6);
 s+=`<rect x="90" y="388" width="10" height="56" fill="url(#rfGrille)"/>`+K.lbl(14,330,"RETURN",{a:"start",size:14})+K.txt(14,350,K.f0(S.db)+"°F DB",{a:"start"})+K.txt(14,368,K.f0(S.wb)+"°F WB",{a:"start"});
 // blower
 s+=`<circle cx="210" cy="410" r="32" fill="#4a5359" stroke="#2a2f33"/><circle cx="210" cy="410" r="24" fill="none" stroke="#9aa3aa" stroke-width="5" stroke-dasharray="2 3"/><circle cx="210" cy="410" r="7" fill="#2a2f33"/>`;
 // drain pan + A-coil slabs
 const L0=[146,352],R0=[274,352],AP=[210,214];
 s+=`<rect x="122" y="352" width="176" height="10" rx="2" fill="#5a6066"/><path d="M${L0[0]} ${L0[1]} L${AP[0]} ${AP[1]} L${R0[0]} ${R0[1]}" stroke="#6d777d" stroke-width="30" fill="none" stroke-linejoin="round"/><path d="M${L0[0]} ${L0[1]} L${AP[0]} ${AP[1]} L${R0[0]} ${R0[1]}" stroke="url(#rfFins)" stroke-width="26" fill="none" stroke-linejoin="round"/>`;
 const fs=r.SH>0.3?Math.max(0.06,Math.min(0.7,r.fSH)):0,zE=[[1-fs,C.mix],[fs,C.suc]];
 const zl=REF.zig([L0[0]+8,L0[1]-6],[AP[0]-3,AP[1]+10],9,8),zr=REF.zig([R0[0]-8,R0[1]-6],[AP[0]+3,AP[1]+10],9,8);
 s+=`<path d="${zl}" stroke="#6a3418" stroke-width="5.5" fill="none" stroke-linejoin="round"/><path d="${zr}" stroke="#6a3418" stroke-width="5.5" fill="none" stroke-linejoin="round"/>`+REF.zoned(zl,zE,3.4)+REF.zoned(zr,zE,3.4);
 // metering device and feeder tubes
 const MX=210,MY=318;s+=REF.pipe(`M${MX-8} ${MY+6} Q${L0[0]+20} ${MY+8} ${L0[0]+8} ${L0[1]-6}`,C.mix,3,{flow:false})+REF.pipe(`M${MX+8} ${MY+6} Q${R0[0]-20} ${MY+8} ${R0[0]-8} ${R0[1]-6}`,C.mix,3,{flow:false});
 // suction line out the top, liquid line in from the wall
 const suc=`M${AP[0]} ${AP[1]+4} V190 H530 V412 H568`,liq=`M568 440 H505 V286 H${MX+30} V${MY} H${MX+14}`;
 const sucCol=r.flood>0.005?C.mix:C.suc,liqCol=r.x>0.002?"#e9a35c":C.liq;
 s+=REF.pipe(liq,liqCol,5)+REF.pipe(suc,sucCol,7,{ins:true});
 if(r.x>0.002)s+=`<path d="M505 300 V430" stroke="#fff" stroke-width="3" stroke-dasharray="2 9" opacity=".9" fill="none"/>`;
 s+=REF.meterSVG(MX,MY,txv);
 if(txv){s+=`<path d="M${MX} ${MY-24} C${MX} ${MY-60} 300 230 300 196" stroke="#8a5a2a" stroke-width="1.6" fill="none"/><rect x="290" y="184" width="22" height="12" rx="5" fill="url(#rfBrass)" stroke="#5e400e"/>`}
 // outdoor unit
 s+=`<rect x="584" y="460" width="282" height="10" fill="#a9a196"/><rect x="590" y="224" width="270" height="236" rx="5" fill="url(#rfCab)" stroke="#5f686d" stroke-width="1.4"/><rect x="590" y="216" width="270" height="12" rx="3" fill="#3a4045"/>`;
 s+=`<rect x="600" y="236" width="176" height="166" fill="url(#rfFins)" stroke="#7d868c"/><rect x="784" y="236" width="68" height="214" fill="#d3d8db" stroke="#8d969c"/><rect x="600" y="408" width="176" height="42" fill="#d6dadc" stroke="#9aa3a9"/>`;
 // condenser zones: desuperheat, condensing, subcooling
 const fD=0.14,fC=Math.max(0,Math.min(0.8,r.fSC)),zC=[[fD,C.dis],[1-fD-fC,C.cnd],[fC,C.liq]];const sp=REF.serp(612,764,248,392,13);
 s+=`<path d="${sp}" stroke="#6a3418" stroke-width="5.5" fill="none"/>`+REF.zoned(sp,zC,3.6);
 // compressor in the cutaway
 s+=`<rect x="796" y="330" width="44" height="104" rx="18" fill="url(#rfShell)"/><ellipse cx="818" cy="434" rx="26" ry="5" fill="#1a1d20"/><text x="818" y="386" class="lsLcd" style="font-size:9px;fill:#c9d0d4">COMP</text>`;
 s+=REF.pipe(`M818 330 V246 H764 V248`,C.dis,5)+REF.pipe(`M612 392 V420 H590 V440 H568`,liqCol,5,{flow:false})+REF.pipe(`M568 412 H600 V426 H790 V400 H796`,sucCol,6,{flow:false});
 // service valves
 s+=`<rect x="558" y="402" width="20" height="20" rx="2" fill="url(#rfBrass)" stroke="#5e400e"/><rect x="560" y="431" width="16" height="18" rx="2" fill="url(#rfBrass)" stroke="#5e400e"/><rect x="564" y="394" width="8" height="9" fill="#8c6a1c"/><rect x="564" y="423" width="8" height="9" fill="#8c6a1c"/>`;
 // condenser air out the top
 
 // clamps, hoses, wires, manifold
 s+=`<rect x="523" y="320" width="14" height="10" rx="2" fill="#222"/><rect x="498" y="360" width="14" height="10" rx="2" fill="#222"/>`;
 s+=`<path d="M640 150 C640 260 540 300 568 394" stroke="#2f6fd6" stroke-width="4" fill="none"/><path d="M840 150 V194 Q840 204 830 204 H562 Q552 204 552 214 V412 Q552 425 562 425" stroke="#c0392b" stroke-width="4" fill="none"/>`;
 s+=`<path d="M690 150 C690 250 530 260 530 320 M790 150 C790 240 505 250 505 360" stroke="#222" stroke-width="1.2" fill="none"/>`;
 for(let i=0;i<3;i++)s+=K.arrow(`M${640+i*60} 212 V178`,K.tcol(Math.min(130,S.tout+16)),2.4);
 s+=REF.manifold(610,18,{ps:r.psS,Te:r.Te,st:r.suctT,sh:r.SH,pd:r.psD,Tc:RF.Tsat(REF.N,r.Pd,"Pb"),lt:r.liqT,sc:r.SC},{shc:o.hi==="sh"?"#ffd36b":null,scc:o.hi==="sc"?"#ffd36b":null});
 if(lab){s+=`<path d="M100 252 L168 290 M338 328 L${MX+16} ${MY}" stroke="var(--muted)" stroke-width="1.2"/>`+K.lbl(14,250,"EVAPORATOR",{size:13,a:"start"})+K.lbl(342,334,txv?"TXV":"PISTON",{size:13,a:"start",fill:"#8c6a1c"})+K.lbl(688,446,"CONDENSER COIL",{size:12})+K.lbl(330,182,"SUCTION LINE",{size:12,a:"start"})+K.lbl(330,280,"LIQUID LINE",{size:12,a:"start"});
  if(txv)s+=K.lbl(318,214,"BULB",{size:12,a:"start",fill:"#8c6a1c"})}
 if(r.flood>0.005)s+=K.tag(300,240,"LIQUID FLOODBACK",{fill:"var(--bad)",w:170});
 if(r.x>0.002)s+=K.tag(360,244,"FLASH GAS IN LIQUID LINE",{fill:"var(--bad)",w:220});
 return s};
/* the 4-part loop as a clean diagram, viewBox 720 x 380. o: {r (REF.solve result), hi: "evap"|"comp"|"cond"|"meter"|null, vals, sides} */
REF.loop=(o={})=>REF.uniq(REF.loop0(o));
REF.loop0=(o={})=>{const C=REF.COL,r=o.r||REF.solve({}),hi=o.hi;let s=REF.defs();
 const box=(x,y,w,h,k)=>hi===k?`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#d9a62e" opacity=".14" stroke="#b8861b" stroke-width="2" stroke-dasharray="6 4"/>`:"";
 s+=box(212,24,296,104,"cond")+box(544,138,92,150,"comp")+box(10,150,128,70,"meter")+box(212,252,296,104,"evap");
 if(o.sides!==false)s+=`<path d="M134 191 H556 M624 191 H700" stroke="var(--muted)" stroke-dasharray="3 6"/>`+K.lbl(360,180,"HIGH SIDE",{fill:C.dis,size:13})+K.lbl(360,212,"LOW SIDE",{fill:C.mix,size:13});
 // lines
 s+=REF.pipe("M590 152 V76 H496",C.dis,6)+REF.pipe("M224 76 H110 V172",C.liq,6)+REF.pipe("M110 202 V302 H224",C.mix,6)+REF.pipe("M496 302 H590 V272",C.suc,7);
 // condenser slab
 s+=`<rect x="224" y="40" width="272" height="70" rx="3" fill="url(#rfFinsH)" stroke="#7d868c"/>`;const fC=Math.max(0.05,Math.min(0.6,r.fSC));const sc=REF.serp(236,484,50,100,5);
 s+=`<path d="${sc}" stroke="#6a3418" stroke-width="5" fill="none"/>`+REF.zoned(sc,[[0.15,C.dis],[0.85-fC,C.cnd],[fC,C.liq]],3.2);
 for(let i=0;i<3;i++)s+=K.arrow(`M${290+i*70} 38 V14`,"#d9824a",2);
 // evaporator slab
 s+=`<rect x="224" y="268" width="272" height="70" rx="3" fill="url(#rfFinsH)" stroke="#7d868c"/>`;const fS=r.SH>0.3?Math.max(0.06,Math.min(0.6,r.fSH)):0;const se=REF.serp(484,236,278,328,5);
 s+=`<path d="${se}" stroke="#6a3418" stroke-width="5" fill="none"/>`+REF.zoned(se,[[1-fS,C.mix],[fS,C.suc]],3.2);
 for(let i=0;i<3;i++)s+=K.arrow(`M${290+i*70} 342 V366`,C.air,2);
 // compressor
 s+=`<rect x="566" y="152" width="48" height="120" rx="20" fill="url(#rfShell)"/><ellipse cx="590" cy="272" rx="28" ry="5" fill="#1a1d20"/>`;
 // metering device
 s+=`<rect x="98" y="168" width="24" height="38" rx="6" fill="url(#rfBrassV)" stroke="#5e400e"/>`;
 s+=K.lbl(360,128,"CONDENSER",{size:14})+K.lbl(360,262,"EVAPORATOR",{size:14})+K.lbl(646,214,"COMPRESSOR",{size:14,a:"start"})+K.lbl(88,184,"METERING",{size:14,a:"end"})+K.lbl(88,202,"DEVICE",{size:14,a:"end"});
 if(o.vals!==false){const t=(x,y,a,b,c,an)=>K.txt(x,y,a,{a:an||"middle",fill:c})+(b?K.txt(x,y+17,b,{a:an||"middle",fill:c}):"");
  s+=t(600,40,"hot gas "+K.f0(r.T2)+"°F","",C.dis,"start")+t(170,24,"liquid "+K.f0(r.liqT)+"°F","",C.liq)+t(170,330,"cold mix "+K.f0(r.Te)+"°F","",C.mix)+t(560,330,"vapor "+K.f0(r.suctT)+"°F","",C.suc);
  s+=K.txt(600,64,K.f0(r.psD)+" psig",{a:"start",fill:C.dis})+K.txt(560,347,K.f0(r.psS)+" psig",{fill:C.suc})}
 return s};
/* analog refrigeration gauge: pressure scale (psig) with the refrigerant's saturation temperatures inside. o: {n, max, temps:[°F], title, k:"Pd"|"Pb"} */
REF.gauge=(cx,cy,R,col,P,o={})=>{const n=o.n||REF.N,mx=o.max||800,ang=p=>(-135+270*Math.max(0,Math.min(1,p/mx)))*Math.PI/180,pt=(a,rr)=>[(cx+rr*Math.sin(a)).toFixed(1),(cy-rr*Math.cos(a)).toFixed(1)];
 let s=`<circle cx="${cx}" cy="${cy+4}" r="${R+8}" fill="#000" opacity=".15"/><circle cx="${cx}" cy="${cy}" r="${R+7}" fill="${col}" stroke="#111"/><circle cx="${cx}" cy="${cy}" r="${R+3}" fill="url(#rfSteel)"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fbfbf8" stroke="#888"/>`;
 const step=o.step||mx/8;for(let p=0;p<=mx+0.1;p+=step/5){const a=ang(p),maj=Math.abs(p/step-Math.round(p/step))<1e-6,[x1,y1]=pt(a,R-2),[x2,y2]=pt(a,R-(maj?11:6));s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#222" stroke-width="${maj?1.4:.7}"/>`;
  if(maj){const [tx,ty]=pt(a,R-22);s+=`<text x="${tx}" y="${(+ty+4).toFixed(1)}" class="lsGn" style="font-size:${R>60?11:9}px">${Math.round(p)}</text>`}}
 let lastP=-1e9;(o.temps||[]).forEach(T=>{const p=RF.at(n,T,o.k||"Pd")-14.7;if(p<0||p>mx||p-lastP<mx/13)return;lastP=p;const a=ang(p),[x1,y1]=pt(a,R*0.55),[x2,y2]=pt(a,R*0.62),[tx,ty]=pt(a,R*0.44);s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c06a2a" stroke-width="1.2"/><text x="${tx}" y="${(+ty+3).toFixed(1)}" class="lsGn" style="font-size:${R>60?10:8}px;fill:#c06a2a">${T}°</text>`});
 const a=ang(P),[nx,ny]=pt(a,R-8);s+=`<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="#c0281c" stroke-width="2.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="#333"/>`;
 if(o.title)s+=`<text x="${cx}" y="${cy+R*0.42}" class="lsGn" style="font-size:${R>60?11:9}px">${o.title}</text>`;
 if(o.unit!==false)s+=`<text x="${cx}" y="${cy+R*0.62}" class="lsGn" style="font-size:${R>60?10:8}px">psig · °F ${n}</text>`;return s};
/* one coil slab with its tube in zones. o: {x,y,w,h,kind:"evap"|"cond",f (superheat or subcooling share of the tube), rows, air:true} */
REF.slab=o=>{const C=REF.COL,{x,y,w,h}=o,rows=o.rows||7,ev=o.kind==="evap";let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#rfFinsH)" stroke="#7d868c" stroke-width="1.2"/>`;
 const p=ev?REF.serp(x+w-16,x+16,y+14,y+h-14,rows):REF.serp(x+16,x+w-16,y+14,y+h-14,rows);
 const f=Math.max(0,Math.min(0.9,o.f||0)),z=ev?[[1-f,C.mix],[f,C.suc]]:[[0.14,C.dis],[0.86-f,C.cnd],[f,C.liq]];
 s+=`<path d="${p}" stroke="#6a3418" stroke-width="${o.tw||9}" fill="none" stroke-linejoin="round"/>`+REF.zoned(p,z,(o.tw||9)-3.5);
 if(o.air!==false)for(let i=0;i<4;i++){const ax=x+w*(0.2+i*0.2);s+=ev?K.arrow(`M${ax} ${y-30} V${y-6}`,"#d9824a",2.2)+K.arrow(`M${ax} ${y+h+6} V${y+h+30}`,C.air,2.2):K.arrow(`M${ax} ${y+h+30} V${y+h+6}`,C.air,2.2)+K.arrow(`M${ax} ${y-6} V${y-30}`,"#d9824a",2.2)}
 return s};
