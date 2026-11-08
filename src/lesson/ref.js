/* ============ Refrigerant properties, the vapor-compression cycle, and the P-H chart drawing ============
 Tables come from lesson/refdata.js (°F, psia, Btu/lb, Btu/lb·°R, ft³/lb; ASHRAE reference). Blends: bubble point for
 liquid and subcooling, dew point for vapor and superheat. Subcooled liquid uses saturated-liquid properties at the
 liquid's own temperature (the standard shortcut; pressure barely changes liquid enthalpy). */
const RF={};
RF.list=Object.keys(REFDATA);
RF.lerp=(a,b,f)=>a+(b-a)*f;
RF.atmAt=ft=>14.696*Math.pow(1-6.8754e-6*ft,5.2559);
RF.Tmax=n=>{const s=REFDATA[n].sat;return s.T0+(s.Pb.length-1)*s.dT};
RF.Tmin=n=>REFDATA[n].sat.T0;
RF.at=(n,T,k)=>{const s=REFDATA[n].sat,x=(T-s.T0)/s.dT,i=Math.max(0,Math.min(s.Pb.length-2,Math.floor(x))),f=x-i,a=s[k];
 return k==="Pb"||k==="Pd"?Math.exp(RF.lerp(Math.log(a[i]),Math.log(a[i+1]),f)):RF.lerp(a[i],a[i+1],f)};
RF.Tsat=(n,P,k)=>{const s=REFDATA[n].sat,a=s[k||"Pd"];let i=0;while(i<a.length-2&&a[i+1]<P)i++;
 return s.T0+(i+(Math.log(P)-Math.log(a[i]))/(Math.log(a[i+1])-Math.log(a[i])))*s.dT};
const rfRow=(row,SH)=>{const x=SH/10,i=Math.max(0,Math.min(row.length-2,Math.floor(x)));return RF.lerp(row[i],row[i+1],x-i)};
const rfInv=(row,v)=>{let i=0;while(i<row.length-2&&row[i+1]<v)i++;return (i+(v-row[i])/(row[i+1]-row[i]))*10};
const rfRows=(n,P)=>{const a=REFDATA[n].sup.P;let i=0;while(i<a.length-2&&a[i+1]<P)i++;return [i,(Math.log(P)-Math.log(a[i]))/(Math.log(a[i+1])-Math.log(a[i]))]};
/* superheated vapor at pressure P (psia) and temperature T (°F): k = "h", "s" or "v" */
RF.vap=(n,P,T,k)=>{const d=REFDATA[n].sup,SH=Math.max(0,T-RF.Tsat(n,P,"Pd")),[i,f]=rfRows(n,P);return RF.lerp(rfRow(d[k][i],SH),rfRow(d[k][i+1],SH),f)};
/* enthalpy at pressure P with entropy s (isentropic compression) */
RF.hPS=(n,P,s)=>{const d=REFDATA[n].sup,[i,f]=rfRows(n,P);return RF.lerp(rfRow(d.h[i],Math.max(0,rfInv(d.s[i],s))),rfRow(d.h[i+1],Math.max(0,rfInv(d.s[i+1],s))),f)};
/* vapor temperature at pressure P and enthalpy h */
RF.TPh=(n,P,h)=>{const d=REFDATA[n].sup,[i,f]=rfRows(n,P);return RF.Tsat(n,P,"Pd")+Math.max(0,RF.lerp(rfInv(d.h[i],h),rfInv(d.h[i+1],h),f))};
/* the cycle. o: {Te: evaporator dew °F, Tc: condenser dew °F, sh, sc (°F), eff (compressor isentropic efficiency)} */
RF.cycle=(n,o)=>{const Tc=Math.min(o.Tc,RF.Tmax(n)-2),Te=Math.max(o.Te,RF.Tmin(n)+2);
 const Ps=RF.at(n,Te,"Pd"),Pd=RF.at(n,Tc,"Pd"),Tcb=RF.Tsat(n,Pd,"Pb"),Teb=RF.Tsat(n,Ps,"Pb");
 const T1=Te+o.sh,h1=RF.vap(n,Ps,T1,"h"),s1=RF.vap(n,Ps,T1,"s"),v1=RF.vap(n,Ps,T1,"v");
 const h2s=RF.hPS(n,Pd,s1),h2=h1+(h2s-h1)/(o.eff||0.7),T2=RF.TPh(n,Pd,h2);
 const T5=Tcb-o.sc,h5=RF.at(n,T5,"hf");
 const c={n,Te,Tc,Ps,Pd,Tcb,Teb,T1,h1,s1,v1,h2s,h2,T2,h3:RF.at(n,Tc,"hg"),h4:RF.at(n,Tcb,"hf"),T5,h5,h6:h5,h7:RF.at(n,Te,"hg"),sh:o.sh,sc:o.sc,eff:o.eff||0.7};
 c.NRE=h1-h5;c.HOC=h2-h1;c.HOR=h2-h5;c.COP=c.NRE/c.HOC;c.mdot=200/c.NRE;c.cfm=c.mdot*v1;c.dsh=T2-Tc;c.x6=(h5-RF.at(n,Teb,"hf"))/(c.h7-RF.at(n,Teb,"hf"));return c};
RF.psig=(P,atm)=>P-(atm??14.696);
/* ---------- P-H chart ----------
 o: {x,y,w,h, cyc (from RF.cycle), cycles:[{c,col,dash,lbl}], handles:true, iso:true, zoom:{h:[a,b],P:[a,b]}, atm, labels:true}
 returns {s (svg), X, Y, inv(px,py)->{h,P}} */
RF.chart=(n,o={})=>{const x0=o.x??70,y0=o.y??20,w=o.w??600,hh=o.h??330,Tm=RF.Tmax(n);
 const hgTop=RF.at(n,40,"hg"),hfTop=RF.at(n,40,"hf");
 const H0=o.zoom?o.zoom.h[0]:Math.floor((RF.at(n,-50,"hf")-6)/10)*10,H1=o.zoom?o.zoom.h[1]:Math.ceil((hgTop+(hgTop-hfTop)*0.62)/10)*10;
 const P0=o.zoom?o.zoom.P[0]:RF.at(n,-45,"Pd"),P1=o.zoom?o.zoom.P[1]:RF.at(n,Tm,"Pb")*1.3;
 const X=h=>x0+(h-H0)/(H1-H0)*w,Y=P=>y0+hh-(Math.log(P)-Math.log(P0))/(Math.log(P1)-Math.log(P0))*hh;
 const inv=(px,py)=>({h:H0+(px-x0)/w*(H1-H0),P:Math.exp(Math.log(P0)+(y0+hh-py)/hh*(Math.log(P1)-Math.log(P0)))});
 const id=K.uid("ph");const pts=a=>a.filter(p=>isFinite(p[0])&&isFinite(p[1])).map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join("");
 let s=`<defs><clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${hh}"/></clipPath></defs><rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 // pressure grid (psia) and enthalpy grid
 [1,2,5,10,20,30,50,75,100,150,200,300,400,500,600,800,1000].filter(p=>p>=P0&&p<=P1).forEach(p=>{s+=`<path d="M${x0} ${Y(p)} H${x0+w}" stroke="var(--panel-edge)" stroke-width=".6"/>`+K.txt(x0-6,Y(p)+5,p,{a:"end"})});
 const hs=w<400?40:(H1-H0)>150?20:10;for(let h=Math.ceil(H0/hs)*hs;h<=H1;h+=hs)s+=`<path d="M${X(h)} ${y0} V${y0+hh}" stroke="var(--panel-edge)" stroke-width=".6"/>`+K.txt(X(h),y0+hh+19,h);
 s+=`<g clip-path="url(#${id})">`;
 // regions
 const dome=[],sat=REFDATA[n].sat;for(let i=0;i<sat.Pb.length;i++)dome.push([sat.hf[i],sat.Pb[i]]);const domeV=[];for(let i=sat.Pb.length-1;i>=0;i--)domeV.push([sat.hg[i],sat.Pd[i]]);
 if(o.regions!==false)s+=`<path d="${pts(dome.concat(domeV))}Z" fill="#7a5cc0" opacity=".07"/>`;
 if(o.iso!==false){
  // isotherms
  let lastLX=-1e9;for(let T=-40;T<=Tm+120;T+=20){const seg=[];
   if(T<=Tm){seg.push([RF.at(n,T,"hf"),P1*2],[RF.at(n,T,"hf"),RF.at(n,T,"Pb")],[RF.at(n,T,"hg"),RF.at(n,T,"Pd")]);
    for(let k=1;k<=24;k++){const P=Math.exp(RF.lerp(Math.log(RF.at(n,T,"Pd")),Math.log(P0*0.9),k/24));seg.push([RF.vap(n,P,T,"h"),P])}}
   else{const Pt=RF.at(n,Tm-1,"Pd");for(let k=0;k<=24;k++){const P=Math.exp(RF.lerp(Math.log(Pt),Math.log(P0*0.9),k/24));if(T>RF.Tsat(n,P,"Pd")+1)seg.push([RF.vap(n,P,T,"h"),P])}}
   s+=`<path d="${pts(seg)}" stroke="#d9824a" stroke-width="1" fill="none" opacity=".55"/>`;
   if(T<=Tm-20&&T%40===0&&X(RF.at(n,T,"hf"))>x0+40)s+=K.txt(X(RF.at(n,T,"hf"))-4,Y(Math.min(P1*0.9,RF.at(n,T,"Pb")*1.45)),T+"°",{a:"end",fill:"#c06a2a"});
   if(T%40===0&&seg.length&&T>=0){const p=seg.reduce((a,b)=>Math.abs(Math.log(b[1]/(P0*1.12)))<Math.abs(Math.log(a[1]/(P0*1.12)))?b:a);if(X(p[0])<x0+w-38&&X(p[0])>X(RF.at(n,-40,"hg"))+10&&X(p[0])>lastLX+38){lastLX=X(p[0]);s+=K.txt(X(p[0])+3,Y(p[1])-3,T+"°",{a:"start",fill:"#c06a2a"})}}}
  // constant entropy lines
  const sg=T=>RF.at(n,T,"sg");const sMin=sg(Math.min(Tm-4,130)),sMax=sg(-40)+0.04;
  for(let j=0;j<6;j++){const sv=RF.lerp(sMin,sMax,j/5),seg=[];for(let k=0;k<=30;k++){const P=Math.exp(RF.lerp(Math.log(P0*0.9),Math.log(RF.at(n,Tm-1,"Pd")),k/30));const Td=RF.Tsat(n,P,"Pd");if(sv>=RF.at(n,Td,"sg"))seg.push([RF.hPS(n,P,sv),P])}
   s+=`<path d="${pts(seg)}" stroke="#3f9a5a" stroke-width="1" stroke-dasharray="5 4" fill="none" opacity=".7"/>`}}
 s+=`<path d="${pts(dome)}" stroke="#2f6fd6" stroke-width="2.4" fill="none"/><path d="${pts(domeV.slice().reverse())}" stroke="#c0392b" stroke-width="2.4" fill="none"/>`;
 if(o.labels!==false&&!o.zoom){s+=K.lbl(X(RF.at(n,-20,"hf"))-10,Y(RF.at(n,40,"Pb")),"LIQUID",{a:"end",fill:"#2f6fd6",size:14})+K.lbl(X((hfTop+hgTop)/2),Y(RF.at(n,0,"Pd")),"LIQUID + VAPOR",{fill:"#7a5cc0",size:14})+K.lbl(X(hgTop)+18,Y(RF.at(n,-10,"Pd")),"VAPOR",{a:"start",fill:"#c0392b",size:14})}
 // cycles
 const cyc=(o.cycles||[]).concat(o.cyc?[{c:o.cyc,col:"var(--ink)",main:true}]:[]);
 cyc.forEach(({c,col,dash,lbl,main})=>{const P=[[c.h6,c.Ps],[c.h7,c.Ps],[c.h1,c.Ps]];for(let k=1;k<=12;k++){const Pk=Math.exp(RF.lerp(Math.log(c.Ps),Math.log(c.Pd),k/12)),hk=RF.lerp(c.h1,c.h2,k/12);P.push([hk,Pk])}
  P.push([c.h3,c.Pd],[c.h4,c.Pd],[c.h5,c.Pd],[c.h6,c.Ps]);
  s+=`<path d="${pts(P)}" stroke="${col}" stroke-width="${main?3:2.2}" fill="${main?"rgba(210,162,76,.12)":"none"}" ${dash?`stroke-dasharray="${dash}"`:""} stroke-linejoin="round"/>`;
  if(lbl)s+=K.lbl(X(c.h2)+8,Y(c.Pd)-8,lbl,{a:"start",fill:col,size:13})});
 s+=`</g>`;
 if(o.cyc&&o.points!==false){const c=o.cyc,pt=(h,P,nm,dx,dy,hd)=>`<circle cx="${X(h)}" cy="${Y(P)}" r="${hd?9:6}" fill="${hd?"var(--brass)":"var(--ink)"}" stroke="var(--paper)" stroke-width="2" ${hd?`data-ph="${hd}" style="cursor:grab"`:""}/>`+K.lbl(X(h)+dx,Y(P)+dy,nm,{size:14});
  s+=pt(c.h6,c.Ps,"6",-2,22)+pt(c.h7,c.Ps,"7",-10,22)+pt(c.h1,c.Ps,"1",6,22,o.handles&&"suc")+pt(c.h2,c.Pd,"2",14,-10,o.handles&&"dis")+pt(c.h3,c.Pd,"3",0,-12)+pt(c.h4,c.Pd,"4",0,-12)+pt(c.h5,c.Pd,"5",-14,-10,o.handles&&"liq")}
 s+=`<path d="M${x0} ${y0} V${y0+hh} H${x0+w}" stroke="var(--muted)" fill="none"/>`+K.txt(x0+w/2,y0+hh+40,"enthalpy, Btu/lb")+`<text transform="translate(${x0-48} ${y0+hh/2}) rotate(-90)" class="lsG">pressure, psia (log scale)</text>`;
 if(o.title)s+=K.lbl(x0,y0-8,o.title,{a:"start"});
 return {s,X,Y,inv}};
/* the class sheet: table method and the sheet's entropy × degrees method side by side. in: {n, atm, dp, llt, dlt, sp, slt} (pressures psig) */
RF.sheet=v=>{const n=v.n,Pd=v.dp+v.atm,Ps=v.sp+v.atm;const r={Pd,Ps};
 r.Tcd=RF.Tsat(n,Pd,"Pd");r.Tcb=RF.Tsat(n,Pd,"Pb");r.Ted=RF.Tsat(n,Ps,"Pd");
 r.sc=r.Tcb-v.llt;r.dsh=v.dlt-r.Tcd;r.sh=v.slt-r.Ted;
 r.hfL=RF.at(n,r.Tcb,"hf");r.sfL=RF.at(n,r.Tcb,"sf");r.hgD=RF.at(n,r.Tcd,"hg");r.sgD=RF.at(n,r.Tcd,"sg");r.hgS=RF.at(n,r.Ted,"hg");r.sgS=RF.at(n,r.Ted,"sg");
 // the sheet's method
 r.m={evap:r.hfL-r.sfL*r.sc,leave:r.hgD+r.sgD*r.dsh,enter:r.hgS+r.sgS*r.sh};
 // table lookups at the measured line temperatures
 r.t={evap:RF.at(n,v.llt,"hf"),leave:RF.vap(n,Pd,v.dlt,"h"),enter:RF.vap(n,Ps,v.slt,"h")};
 for(const k of ["m","t"]){const q=r[k];q.HOC=q.leave-q.enter;q.NRE=q.enter-q.evap;q.COP=q.NRE/q.HOC;q.HOR=q.leave-q.evap}
 r.ok=v.dp>v.sp&&r.Tcd<RF.Tmax(n)-1&&r.Ted>RF.Tmin(n)+1&&r.sh>=0&&r.dsh>=0&&r.sc>=0;
 return r};
