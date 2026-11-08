/* ============ Combustion and gas lesson kit: drawings (meter, black iron, furnace, water heater, analyzer, manometer, house) and the numbers the lessons calculate ============
 Model sources (same as the Combustion and Gas trainer):
 - IFGC 402.4 low-pressure equation, Cr 0.6094 natural gas, and Table 402.4(2) Schedule 40 capacities at a 0.5 in. w.c. drop (Seattle Fuel Gas Code ch. 4 reproduces them).
 - Clocking: CFH = 3600 x dial size / seconds, x heating value = input (IBC boiler manual).
 - Flue gas: CO2 = CO2max x (20.9 - O2)/20.9, excess air = O2/(20.9 - O2), CO air-free = CO x 20.9/(20.9 - O2); flue loss qA = (FT - AT) x (A2/(21 - O2) + B) (Testo), reported on the higher heating value like US analyzers.
 - Stack draft (Pa) = 3465 x height (m) x (1/T outdoor - 1/T flue), kelvin.
 - CAZ: house leakage C = CFM50 / 50^0.65, pressure = (exhaust / C)^(1/0.65) Pa. Limits from Vermont RBES Appendix RA (BPI-style). */
const CK={};
CK.FLUE="#e0662a";CK.AIR="#5a9bd4";CK.GAS="#e8c33a";
CK.L=(x,y,t,o={})=>K.lbl(x,y,t,{size:o.size||13,a:o.a,fill:o.fill,c:o.c});
CK.co=(px,py,lx,ly,t,o={})=>{const a=o.a||(lx<px?"end":"start");return `<path d="M${px} ${py} L${lx} ${ly}" stroke="var(--muted)" stroke-width="1.2" fill="none"/><circle cx="${px}" cy="${py}" r="2.6" fill="var(--muted)"/>`+CK.L(lx+(a==="end"?-4:a==="start"?4:0),ly+(o.dy??4),t,{a,fill:o.fill,size:o.size})};
CK.floor=(y=352,x1=10,x2=710)=>`<path d="M${x1} ${y} H${x2}" stroke="#8a7f70" stroke-width="4"/>`;
/* black iron gas pipe along a path */
CK.pipe=(d,w=9)=>`<path d="${d}" fill="none" stroke="#14171a" stroke-width="${w+2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#454c52" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#8c959b" stroke-width="${Math.max(1,w*.22)}" stroke-linejoin="round" opacity=".75" transform="translate(-${(w*.18).toFixed(1)} -${(w*.18).toFixed(1)})"/>`;
CK.fit=(x,y,s=13)=>`<rect x="${x-s/2-1.5}" y="${y-s/2-1.5}" width="${s+3}" height="${s+3}" rx="2" fill="#2a2f33" stroke="#0f1113"/><rect x="${x-s/2}" y="${y-s/2}" width="${s}" height="${s*.35}" fill="#6d757b" opacity=".6"/>`;
/* galvanized vent pipe (vertical) */
CK.ventV=(cx,y1,y2,r=11)=>rCylV(cx,y1,y2,r,"galv",{top:false})+[0,1,2,3,4,5].map(k=>{const y=y1+(k+1)*(y2-y1)/7;return `<path d="M${cx-r} ${y.toFixed(1)} h${2*r}" stroke="#4b5150" stroke-opacity=".5" stroke-width=".8"/>`}).join("");
CK.ventH=(x1,x2,cy,r=11)=>rCylH(x1,x2,cy,r,"galv");
/* blue flames along a burner */
CK.flames=(x,y,n,gap,h=22,w=6,yel=false)=>Array.from({length:n},(_,i)=>rFlameC(x+i*gap,y,h,w,yel)).join("");
/* diaphragm gas meter, local 0..120 wide, pipes at x 25 and 95 from y 0; o: {ang, s, sec, dial} */
CK.meter=(x,y,o={})=>{const s=o.s||1,ang=o.ang??40;
 let g=`<g transform="translate(${x} ${y}) scale(${s})">${rSh(66,142,64,7)}`;
 g+=rCylV(25,0,34,6,"iron",{top:false})+rHexV(25,22,10,8,"galv")+rCylV(95,0,34,6,"iron",{top:false})+rHexV(95,22,10,8,"galv");
 g+=rBox(0,34,120,104,24,"al",{r:6,grain:true});
 g+=`<rect x="8" y="42" width="104" height="70" rx="4" fill="url(#r_paintF)"/><rect x="11" y="45" width="98" height="64" rx="3" fill="#f7f5ec"/>`;
 g+=[0,1,2,3].map(i=>rDial(26+i*22.5,57,8,[40,250,120,310][i])).join("");
 g+=`<circle cx="40" cy="89" r="14" fill="#fbfaf4" stroke="#c0281c" stroke-width="1.4"/>`;
 for(let i=0;i<10;i++){const a=i/10*2*Math.PI;g+=`<path d="M${(40+11*Math.sin(a)).toFixed(1)} ${(89-11*Math.cos(a)).toFixed(1)} L${(40+13.4*Math.sin(a)).toFixed(1)} ${(89-13.4*Math.cos(a)).toFixed(1)}" stroke="#c0281c" stroke-width=".7"/>`}
 const ra=ang*Math.PI/180;g+=`<path d="M40 89 L${(40+11*Math.sin(ra)).toFixed(1)} ${(89-11*Math.cos(ra)).toFixed(1)}" stroke="#c0281c" stroke-width="2.2" stroke-linecap="round"/><circle cx="40" cy="89" r="2" fill="#c0281c"/>`;
 g+=`<text x="62" y="96" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="600" fill="#c0281c">${o.dial||"2"} FT³</text><circle cx="94" cy="86" r="8" fill="#fbfaf4" stroke="#c0281c"/><path d="M94 86 l3 -6" stroke="#c0281c" stroke-width="1.4"/><text x="94" y="104" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" fill="#c0281c">½</text>`;
 g+=`<rect x="11" y="45" width="98" height="64" rx="3" fill="url(#rGlass)" opacity=".5"/><rect x="-1" y="117" width="122" height="6" rx="1.5" fill="url(#r_alH)"/>`;
 return g+`</g>`};
/* service regulator on the meter riser, small; cx,y = pipe axis */
CK.sreg=(cx,cy,s=1)=>`<g transform="translate(${cx-170*s*.32} ${cy-196*s*.32}) scale(${(s*.32).toFixed(3)})">${rSregArt(false)}</g>`;
/* yellow digital manometer; val text, lab under it */
CK.mano=(x,y,val,lab,o={})=>{const w=o.w||96;return rBox(x,y,w,58,8,"yel",{r:7})+`<rect x="${x+8}" y="${y+8}" width="${w-16}" height="24" rx="3" fill="url(#zLcd)"/><text x="${x+w/2}" y="${y+26}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="14" font-weight="600" fill="#1f2a22">${val}</text><text x="${x+w/2}" y="${y+48}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="600" fill="#3a2a00">${o.unit||"IN. W.C."}</text>`+(lab?CK.L(x+w/2,y+78,lab,{size:12}):"")};
/* combustion analyzer: handheld with a green LCD; lines = [[label, value, bad?]] */
CK.analyzer=(x,y,lines,o={})=>{const w=o.w||150,h=o.h||(48+lines.length*19);let g=rSh(x+w/2,y+h+6,w*.5,6)+rBox(x,y,w,h,12,"blue",{r:10})+`<rect x="${x+8}" y="${y+8}" width="${w-16}" height="${h-40}" rx="4" fill="#15181a"/><rect x="${x+11}" y="${y+11}" width="${w-22}" height="${h-46}" rx="3" fill="url(#zLcd)"/>`;
 lines.forEach(([a,b,bad],i)=>{const yy=y+28+i*19;g+=`<text x="${x+17}" y="${yy}" font-family="IBM Plex Mono,monospace" font-size="11.5" font-weight="600" fill="${bad?"#b3261e":"#1f2a22"}">${a}</text><text x="${x+w-17}" y="${yy}" text-anchor="end" font-family="IBM Plex Mono,monospace" font-size="12.5" font-weight="600" fill="${bad?"#b3261e":"#1f2a22"}">${b}</text>`});
 g+=`<rect x="${x+11}" y="${y+11}" width="${w-22}" height="${h-46}" rx="3" fill="url(#rGlass)" opacity=".35"/>`+[0,1,2].map(i=>`<circle cx="${x+w/2-30+i*30}" cy="${y+h-17}" r="7" fill="url(#r_chromeV)"/>`).join("");
 return g};
/* probe and hose from the analyzer to a test hole */
CK.probe=(hx,hy,ax,ay)=>`<rect x="${hx-2}" y="${hy-3}" width="44" height="6" rx="2" fill="url(#r_chromeH)"/>`+rHose(`M${hx+42} ${hy} C${hx+80} ${hy} ${ax} ${ay-60} ${ax} ${ay}`,"#2a2f33",4)+`<rect x="${hx+36}" y="${hy-6}" width="16" height="12" rx="3" fill="#1d2124"/>`;
/* draft hood: skirt with an open relief gap; cx = vent axis, y = top of appliance (hood sits above) */
CK.hood=(cx,y,w=36)=>`<path d="M${cx-w} ${y-6} L${cx-w*.42} ${y-30} H${cx+w*.42} L${cx+w} ${y-6} Z" fill="url(#r_galvV)" stroke="#4b5150" stroke-width=".8"/><path d="M${cx-w*.8} ${y} V${y-6} M${cx+w*.8} ${y} V${y-6}" stroke="#6d757b" stroke-width="2"/>`;
/* atmospheric (draft-hood) or induced-draft furnace; x,y top-left of cabinet; returns svg. o: {fire, ind, w, h, yel, hood:false to hide} */
CK.furnace=(x,y,o={})=>{const w=o.w||120,h=o.h||200,cx=x+w/2;let g=rSh(cx+8,y+h+3,w*.55,7)+rBox(x,y,w,h,22,"cab",{r:2});
 g+=`<rect x="${x+8}" y="${y+10}" width="${w-16}" height="${h*.36}" rx="2" fill="#454c52"/><rect x="${x+10}" y="${y+12}" width="${w-20}" height="${h*.36-4}" fill="url(#rCav)"/>`;
 // heat exchanger sections
 const hxTop=y+16,hxBot=y+h*.36-22;for(let i=0;i<4;i++){const sx=x+18+i*(w-36)/3.6;g+=`<rect x="${sx}" y="${hxTop}" width="${(w-36)/4.6}" height="${hxBot-hxTop}" rx="6" fill="url(#r_paintV)" opacity=".9"/>`}
 if(o.fire!==false)g+=CK.flames(x+24,y+h*.36+2,4,(w-48)/3,16,5,o.yel);
 g+=`<rect x="${x+14}" y="${y+h*.36+2}" width="${w-28}" height="5" rx="2" fill="url(#r_alH)"/>`;
 g+=`<rect x="${x+8}" y="${y+h*.36+14}" width="${w-16}" height="${h*.6-20}" rx="2" fill="none" stroke="#8a9094"/>`+[0,1,2,3].map(k=>`<rect x="${x+20}" y="${y+h-48+k*9}" width="${w-40}" height="3.4" rx="1.6" fill="#4a5055"/>`).join("")+(h>=150?`<text x="${cx}" y="${y+h*.36+32}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="13" font-weight="600" fill="#2a3034" letter-spacing=".08em">FURNACE</text>`:"");
 if(o.ind){g+=rBox(cx-24,y-34,48,30,10,"black",{r:4})+`<circle cx="${cx}" cy="${y-19}" r="9" fill="url(#r_chromeV)"/>`;}
 else if(o.hood!==false)g+=CK.hood(cx,y);
 return g};
/* tank water heater with draft hood; x,y = top-left of jacket */
CK.wh=(x,y,o={})=>{const w=o.w||70,h=o.h||170,cx=x+w/2;let g=rSh(cx,y+h+3,w*.6,6)+rCylV(cx,y+h-12,y+h,w/2+1,"black",{ry:7})+rCylV(cx,y,y+h-10,w/2,"white",{ry:8});
 g+=`<rect x="${cx-18}" y="${y+h-40}" width="36" height="22" rx="3" fill="#15181a"/>`+(o.fire!==false?`<g>${CK.flames(cx-10,y+h-21,3,10,13,4,o.yel)}</g>`:"")+(h>=130?`<text x="${cx}" y="${y+44}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="11" font-weight="600" fill="#2a3034" letter-spacing=".06em">WATER</text><text x="${cx}" y="${y+57}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="11" font-weight="600" fill="#2a3034" letter-spacing=".06em">HEATER</text>`:"");
 g+=rBox(x+4,y+h-64,20,18,5,"black",{r:2})+`<circle cx="${x+14}" cy="${y+h-55}" r="4" fill="url(#r_redV)"/>`;
 if(o.hood!==false)g+=CK.hood(cx,y-2,o.hw||26);
 return g};
/* smoke wisps at a draft hood relief: in=true pulled in, false spilling out */
CK.smoke=(cx,y,spill,w=30)=>spill?`<path d="M${cx-w} ${y} q-14 -6 -20 -22 q-4 -10 -16 -14 M${cx+w} ${y} q14 -6 20 -22 q4 -10 16 -14" stroke="#9aa3aa" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/>`:`<path d="M${cx-w-34} ${y+8} q16 -2 24 -10 q6 -4 8 -8 M${cx+w+34} ${y+8} q-16 -2 -24 -10 q-6 -4 -8 -8" stroke="#9aa3aa" stroke-width="3.4" fill="none" opacity=".75" stroke-linecap="round"/>`;
/* CO alarm on a wall: round white puck with a small display */
CK.alarm=(cx,cy,txt,on)=>`<circle cx="${cx+2}" cy="${cy+3}" r="27" fill="#000" opacity=".12"/><circle cx="${cx}" cy="${cy}" r="27" fill="url(#r_whiteV)" stroke="#9aa3a9"/>`+`<rect x="${cx-17}" y="${cy-10}" width="34" height="16" rx="2" fill="url(#zLcd)"/><text x="${cx}" y="${cy+2}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10" font-weight="600" fill="#1f2a22">${txt}</text><circle cx="${cx}" cy="${cy+16}" r="3.2" fill="${on?"#e23b2e":"var(--lamp-off)"}"/>`;
/* flow arrows */
CK.arr=(d,col)=>rArr(d,col);

/* ---------- gas pipe sizing: IFGC Table 402.4(2), Schedule 40, natural gas, under 2 psi, 0.5 in. w.c. drop, SG 0.60 ---------- */
CK.SIZES=[0.5,0.75,1,1.25,1.5,2];CK.ID={0.5:0.622,0.75:0.824,1:1.049,1.25:1.380,1.5:1.610,2:2.067};
CK.nps=d=>({0.5:"1/2",0.75:"3/4",1:"1",1.25:"1-1/4",1.5:"1-1/2",2:"2"}[d])+" in.";
CK.LENS=[10,20,30,40,50,60,70,80,90,100,125,150];
CK.TAB=[[172,360,678,1390,2090,4020],[118,247,466,957,1430,2760],[95,199,374,768,1150,2220],[81,170,320,657,985,1900],[72,151,284,583,873,1680],[65,137,257,528,791,1520],[60,126,237,486,728,1400],[56,117,220,452,677,1300],[52,110,207,424,635,1220],[50,104,195,400,600,1160],[44,92,173,355,532,1020],[40,83,157,322,482,928]];
CK.row=L=>{const i=CK.LENS.findIndex(x=>x>=L-1e-9);return i<0?CK.LENS.length-1:i};    // round the length UP to the next row
CK.capT=(d,L)=>CK.TAB[CK.row(L)][CK.SIZES.indexOf(d)];
CK.need=(q,L)=>{const r=CK.TAB[CK.row(L)];const j=r.findIndex(c=>c>=q);return j<0?null:CK.SIZES[j]};
/* IFGC 402.4 low-pressure equation, solved for the drop (in. w.c.) */
CK.drop=(q,d,L,cr=0.6094)=>q<=0?0:cr*L*Math.pow(q/(2313*Math.pow(CK.ID[d],2.623)),1/0.541);
CK.capEq=(d,L,dH=0.5,cr=0.6094)=>2313*Math.pow(CK.ID[d],2.623)*Math.pow(dH/(cr*L),0.541);

/* ---------- flue gas ---------- */
CK.FUEL={ng:{n:"Natural gas",co2:11.7,a2:0.66,b:0.009,hhv:0.903,hv:1030,prod:10.5},lp:{n:"Propane",co2:13.7,a2:0.63,b:0.008,hhv:0.92,hv:2500,prod:25.8}};
/* ea: excess air %, fuel, flue (°F probe), air (°F combustion air), imp: flame impingement */
CK.comb=(o)=>{const f=CK.FUEL[o.fuel||"ng"],lam=1+o.ea/100;const O2=20.9*(lam-1)/lam,CO2=f.co2*(20.9-O2)/20.9;
 let coaf=15;if(lam<1.3)coaf+=lam>=1?2000*Math.pow((1.3-lam)/0.3,2):2000+40000*(1-lam);if(o.imp)coaf+=280;
 const com=coaf*(20.9-O2)/20.9,net=(o.flue??420)-(o.air??70),loss=(net/1.8)*(f.a2/Math.max(0.5,20.9-O2)+f.b);
 const eff=Math.max(0,Math.min(99,(100-loss)*f.hhv-(coaf>2000?3:0)));return {O2,CO2,ea:o.ea,eaEst:100*O2/(20.9-O2),coaf,com,net,eff,lam}};
CK.coAF=(co,o2)=>co*20.9/(20.9-o2);

/* ---------- draft and CAZ ---------- */
CK.K=F=>(F-32)/1.8+273.15;
CK.stack=(hft,tout,tflue)=>Math.max(0,3465*hft*0.3048*(1/CK.K(tout)-1/CK.K(tflue)));      // theoretical, Pa
CK.PA=249.09;CK.inwc=pa=>pa/CK.PA;
CK.minDraft=t=>t<10?-2.5:t>90?-0.5:t/40-2.75;      // Pa, Vermont RBES Table RA301.1(2)
CK.LIMITS=[["Atmospheric water heater (Cat I, draft hood)",-2],["Furnace or boiler common-vented with an atmospheric water heater",-3],["Furnace or boiler alone (Cat I or II)",-5],["Fan-assisted furnace common-vented with a water heater",-5],["Induced-draft or power-vented appliance alone",-15],["Sealed combustion / direct vent (Cat IV)",-50]];
CK.cazPa=(exh,cfm50)=>exh<=0?0:Math.pow(exh/(cfm50/Math.pow(50,0.65)),1/0.65);
/* bar scale of CAZ pressure vs limit */
CK.paScale=(x,y,w,pa,lim,o={})=>{const mn=o.min??-16,X=v=>x+(v-mn)/(0-mn)*w;let g=`<rect x="${x}" y="${y}" width="${w}" height="22" rx="4" fill="var(--paper)" stroke="var(--panel-edge)"/><rect x="${X(lim)}" y="${y}" width="${x+w-X(lim)}" height="22" rx="4" fill="var(--ok)" opacity=".25"/><rect x="${x}" y="${y}" width="${X(lim)-x}" height="22" rx="4" fill="var(--bad)" opacity=".18"/>`;
 for(let v=mn;v<=0;v+=o.step||2)g+=`<path d="M${X(v)} ${y+22} v6" stroke="var(--muted)"/>`+K.txt(X(v),y+44,v);
 g+=`<path d="M${X(lim)} ${y-8} V${y+30}" stroke="var(--bad)" stroke-width="2.4" stroke-dasharray="4 3"/>`+CK.L(X(lim),y+64,"LIMIT "+lim+" PA",{fill:"var(--bad)",size:12});
 const pv=Math.max(mn,Math.min(0,pa));g+=`<path d="M${X(pv)} ${y-2} l-8 -14 h16 z" fill="var(--ink)"/>`+(o.lbl!==false?CK.L(X(pv),y-22,(pa<=mn?"< ":"")+K.f1(pa)+" PA",{size:13}):"");
 return g};
