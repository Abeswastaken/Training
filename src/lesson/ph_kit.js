/* ============ P-H lesson helpers: faults, standard chart frame, regions ============ */
RF.BASE=n=>n==="R-404A"?{Te:20,Tc:105,sh:10,sc:8,eff:0.68}:{Te:40,Tc:105,sh:10,sc:10,eff:0.7};
RF.FAULTS=[["ok","Normal",{}],["low","Low charge",{dTe:-12,dTc:-7,sh:30,sc:2}],["over","Overcharge",{dTe:4,dTc:18,sh:5,sc:22}],["restr","Restriction (liquid line or metering)",{dTe:-15,dTc:-3,sh:32,sc:16}],["cond","Dirty condenser / condenser fan out",{dTe:4,dTc:30,sh:8}],["evap","Low indoor airflow / dirty evaporator",{dTe:-12,dTc:-7,sh:3}],["comp","Worn compressor (leaking valves)",{dTe:10,dTc:-10,sh:14,sc:6,eff:0.45}]];
RF.WHY={ok:"A normal cycle: suction and head pressures where they belong, about 10°F superheat and 10°F subcooling.",
 low:"Low charge: both pressures drop, superheat goes way up (the evaporator runs out of liquid early) and subcooling almost disappears. NRE per pound looks fine, but far fewer pounds move, so capacity falls.",
 over:"Overcharge: liquid backs up in the condenser, so subcooling and head pressure climb. Heat of compression grows and COP falls.",
 restr:"Restriction: the evaporator is starved (low suction, high superheat) but liquid piles up behind the restriction, so subcooling is high. That pair is the giveaway.",
 cond:"Dirty condenser: the condenser can't reject heat, so condensing temperature and head pressure climb. The compression line gets longer: more HOC, lower COP, hotter discharge.",
 evap:"Low airflow: the evaporator gets too little heat, so suction drops and superheat falls toward zero. Risk of floodback and a frozen coil.",
 comp:"Worn compressor: it can't pump the pressure difference, so suction rises and head falls. Compression is inefficient, so the discharge line runs hotter than it should for that small lift."};
RF.faultCyc=(n,k)=>{const b=RF.BASE(n),f=RF.FAULTS.find(x=>x[0]===k)[2];return RF.cycle(n,{Te:b.Te+(f.dTe||0),Tc:Math.min(RF.Tmax(n)-4,b.Tc+(f.dTc||0)),sh:f.sh??b.sh,sc:f.sc??b.sc,eff:f.eff??b.eff})};
/* where a point (P psia, h) sits: region, temperature, quality, superheat or subcooling */
RF.where=(n,P,h)=>{const Tb=RF.Tsat(n,P,"Pb"),Td=RF.Tsat(n,P,"Pd"),hf=RF.at(n,Tb,"hf"),hg=RF.at(n,Td,"hg");
 if(h<hf){const T=RF.Thf(n,h);return {reg:"liq",T,sc:Tb-T,Tb,Td,hf,hg}}
 if(h>hg){const T=RF.TPh(n,P,h);return {reg:"vap",T,sh:T-Td,Tb,Td,hf,hg}}
 const x=(h-hf)/(hg-hf);return {reg:"mix",T:RF.lerp(Tb,Td,x),x,Tb,Td,hf,hg}};
RF.Thf=(n,h)=>{let a=RF.Tmin(n),b=RF.Tmax(n);for(let i=0;i<40;i++){const m=(a+b)/2;if(RF.at(n,m,"hf")<h)a=m;else b=m}return (a+b)/2};
/* standard frame for lesson drawings (viewBox 720 x 400) */
RF.std=(n,o={})=>RF.chart(n,Object.assign({x:78,y:24,w:600,h:300},o));
RF.bracket=(G,a,b,y,t,col,up)=>up?`<path d="M${G.X(a)} ${y+9} v-9 H${G.X(b)} v9" stroke="${col}" stroke-width="2.2" fill="none"/>`+K.tag((G.X(a)+G.X(b))/2,y-8,t,{fill:col}):`<path d="M${G.X(a)} ${y-9} v9 H${G.X(b)} v-9" stroke="${col}" stroke-width="2.2" fill="none"/>`+K.tag((G.X(a)+G.X(b))/2,y+22,t,{fill:col});
RF.isoT=(n,G,T,col,w,vapOnly)=>{const seg=vapOnly?[[RF.at(n,T,"hg"),RF.at(n,T,"Pd")]]:[[RF.at(n,T,"hf"),1e4],[RF.at(n,T,"hf"),RF.at(n,T,"Pb")],[RF.at(n,T,"hg"),RF.at(n,T,"Pd")]];const P0=RF.at(n,-45,"Pd");
 for(let k=1;k<=24;k++){const P=Math.exp(RF.lerp(Math.log(RF.at(n,T,"Pd")),Math.log(P0*0.9),k/24));seg.push([RF.vap(n,P,T,"h"),P])}
 return `<path d="${seg.map((p,i)=>(i?"L":"M")+G.X(p[0]).toFixed(1)+" "+Math.min(324,Math.max(24,G.Y(p[1]))).toFixed(1)).join("")}" stroke="${col}" stroke-width="${w||3.5}" fill="none"/>`};
RF.dot=(G,h,P,t,o={})=>`<circle cx="${G.X(h)}" cy="${G.Y(P)}" r="${o.r||7}" fill="${o.c||"var(--brass)"}" stroke="var(--paper)" stroke-width="2"/>`+(t?K.tag(G.X(h)+(o.dx??12),G.Y(P)+(o.dy??-12),t,{a:o.a||"start",fill:o.c||"var(--brass)"}):"");
