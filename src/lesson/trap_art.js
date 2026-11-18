/* ============ Steam traps page: cutaway drawings and their animation ============
 Each trap is drawn once (static: body cut in half, hatched cut faces, hardware) and its moving parts and fluids are redrawn every frame (dyn).
 Canvas 800 x 470. Fluids: condensate blue, steam red, air gray dots (the Engineering Mindset convention for steam and condensate).
 TA.T[key] = {name, fam, stages:[{l, d (seconds), x (text)}], stat(), dyn(st)}  st = {s: stage index, p: 0..1 through the stage, t: seconds} */
const TA={};
TA.W="#2f6fd6";TA.WL="#7fb0f0";TA.S="#e0453a";TA.A="#8d989f";
TA.cl=x=>Math.max(0,Math.min(1,x));
TA.ease=x=>{x=TA.cl(x);return x*x*(3-2*x)};
TA.mix=(a,b,k)=>a+(b-a)*TA.cl(k);
TA.n=v=>Math.round(v*10)/10;
/* shared gradients and the hatch for cut metal; put in each drawing's own <defs> */
TA.defs=()=>`<defs>
<pattern id="taCut" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#8e979d"/><rect width="1.6" height="7" fill="#5d666c"/></pattern>
<pattern id="taCutB" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="7" height="7" fill="#b89a52"/><rect width="1.6" height="7" fill="#7c6224"/></pattern>
<pattern id="taCutS" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#bcc4c9"/><rect width="1.3" height="6" fill="#7f898f"/></pattern>
<linearGradient id="taIron" x1="0" x2="1"><stop offset="0" stop-color="#3a4146"/><stop offset=".22" stop-color="#6d767c"/><stop offset=".5" stop-color="#4c5459"/><stop offset="1" stop-color="#2a3034"/></linearGradient>
<linearGradient id="taIronH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6d767c"/><stop offset=".45" stop-color="#4c5459"/><stop offset="1" stop-color="#2a3034"/></linearGradient>
<linearGradient id="taSteel" x1="0" x2="1"><stop offset="0" stop-color="#8b959b"/><stop offset=".3" stop-color="#eef2f4"/><stop offset=".62" stop-color="#b9c2c8"/><stop offset="1" stop-color="#7c868c"/></linearGradient>
<linearGradient id="taSteelH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8b959b"/><stop offset=".3" stop-color="#eef2f4"/><stop offset=".62" stop-color="#b9c2c8"/><stop offset="1" stop-color="#7c868c"/></linearGradient>
<linearGradient id="taBrass" x1="0" x2="1"><stop offset="0" stop-color="#7c5c1c"/><stop offset=".3" stop-color="#e8c56e"/><stop offset=".6" stop-color="#c49a3c"/><stop offset="1" stop-color="#7a5a1a"/></linearGradient>
<linearGradient id="taBrassH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7c5c1c"/><stop offset=".3" stop-color="#e8c56e"/><stop offset=".6" stop-color="#c49a3c"/><stop offset="1" stop-color="#7a5a1a"/></linearGradient>
<radialGradient id="taBall" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#d4dadd"/><stop offset=".8" stop-color="#848e94"/><stop offset="1" stop-color="#5c656b"/></radialGradient>
<linearGradient id="taCav" x1="0" x2="1"><stop offset="0" stop-color="#9aa3a9"/><stop offset=".18" stop-color="#d9dfe2"/><stop offset=".5" stop-color="#f3f5f6"/><stop offset=".85" stop-color="#c6cdd1"/><stop offset="1" stop-color="#8f989e"/></linearGradient>
<linearGradient id="taCavH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9aa3a9"/><stop offset=".2" stop-color="#dfe4e7"/><stop offset=".5" stop-color="#f3f5f6"/><stop offset=".85" stop-color="#c6cdd1"/><stop offset="1" stop-color="#8f989e"/></linearGradient>
<linearGradient id="taWater" x1="0" x2="1"><stop offset="0" stop-color="#1f4f9e"/><stop offset=".25" stop-color="#4f8ae0"/><stop offset=".5" stop-color="#6ea2ec"/><stop offset=".8" stop-color="#3f78d0"/><stop offset="1" stop-color="#1f4f9e"/></linearGradient>
<linearGradient id="taSteam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f08a7e"/><stop offset="1" stop-color="#e0574b"/></linearGradient>
<filter id="taSh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".28"/></filter>
<filter id="taBlur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>`;
/* ---------- drawing helpers ---------- */
TA.cut=(d,f="url(#taCut)")=>`<path d="${d}" fill="${f}" stroke="#262b2f" stroke-width="1.6" stroke-linejoin="round"/>`;
TA.cav=(d,h)=>`<path d="${d}" fill="url(#taCav${h?"H":""})"/>`;
TA.rect=(x,y,w,h,f,o="")=>`<rect x="${TA.n(x)}" y="${TA.n(y)}" width="${TA.n(w)}" height="${TA.n(h)}" fill="${f}" ${o}/>`;
TA.R=(x,y,w,h)=>`M${x} ${y}h${w}v${h}h${-w}Z`;
TA.floor=(cx,w,y=452)=>`<ellipse cx="${cx}" cy="${y}" rx="${w}" ry="9" fill="#10161a" opacity=".22" filter="url(#taBlur)"/>`;
/* half-section pipe: walls hatched, bore left for the fluid. horizontal from x1 to x2, bore top y, bore height h, wall t */
TA.pipeH=(x1,x2,y,h,t=8)=>TA.cut(TA.R(x1,y-t,x2-x1,t))+TA.cut(TA.R(x1,y+h,x2-x1,t))+TA.cav(TA.R(x1,y,x2-x1,h),1);
TA.pipeV=(x,y1,y2,w,t=8)=>TA.cut(TA.R(x-t,y1,t,y2-y1))+TA.cut(TA.R(x+w,y1,t,y2-y1))+TA.cav(TA.R(x,y1,w,y2-y1));
/* the uncut outside of a pipe beyond the drawing: a short shaded stub with thread lines */
TA.stubH=(x1,x2,y,h,t=8)=>`<rect x="${x1}" y="${y-t}" width="${x2-x1}" height="${h+2*t}" fill="url(#taIronH)" stroke="#20262a"/>`;
TA.thread=(x,y,h,k=5,dx=4)=>{let s="";for(let i=0;i<k;i++)s+=`<path d="M${x+i*dx} ${y} l2 ${h}" stroke="#20262a" stroke-width=".9" opacity=".6"/>`;return s};
TA.bolt=(x,y,w=14,h=9)=>`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="1.5" fill="url(#taSteelH)" stroke="#2a3034"/><path d="M${x-w/6} ${y-h/2}v${h}M${x+w/6} ${y-h/2}v${h}" stroke="#56606680" stroke-width=".8"/>`;
TA.hex=(x,y,w,h,f="url(#taSteel)")=>`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="2" fill="${f}" stroke="#262b2f"/><path d="M${x-w/6} ${y-h/2}v${h}M${x+w/6} ${y-h/2}v${h}" stroke="#262b2f" stroke-width=".8" opacity=".5"/>`;
TA.lab=(x,y,tx,ty,t,a="start")=>`<g class="taLab"><path d="M${x} ${y}L${tx} ${ty}" stroke="#39434a" stroke-width="1.1" fill="none"/><circle cx="${x}" cy="${y}" r="2.6" fill="#39434a"/><text x="${tx+(a==="start"?4:a==="end"?-4:0)}" y="${ty+4}" class="taT" style="text-anchor:${a}">${t}</text></g>`;
TA.big=(x,y,t,c="#39434a",a="middle")=>`<text x="${x}" y="${y}" class="taB" style="text-anchor:${a};fill:${c}">${t}</text>`;
/* ---------- fluid helpers (dyn layer) ---------- */
TA.water=(d,o=.78)=>`<path d="${d}" fill="url(#taWater)" opacity="${o}"/>`;
TA.steam=(d,o=.8)=>`<path d="${d}" fill="url(#taSteam)" opacity="${o}"/>`;
/* moving dashes along a path. kind w = condensate (white dashes on blue), s = steam (red dashes), a = air (gray dots) */
TA.flow=(d,kind,t,v=1,w)=>{const off=TA.n(-(t*60*v)%200);
 if(kind==="w")return `<path d="${d}" stroke="#ffffff" stroke-width="${w||2.4}" stroke-dasharray="5 11" stroke-dashoffset="${off}" fill="none" stroke-linecap="round" opacity=".9"/>`;
 if(kind==="s")return `<path d="${d}" stroke="${TA.S}" stroke-width="${w||5}" stroke-dasharray="12 9" stroke-dashoffset="${off}" fill="none" stroke-linecap="round" opacity=".75"/>`;
 return `<path d="${d}" stroke="#ffffff" stroke-width="${(w||6)+2.4}" stroke-dasharray="0.1 15" stroke-dashoffset="${off}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${TA.A}" stroke-width="${w||6}" stroke-dasharray="0.1 15" stroke-dashoffset="${off}" fill="none" stroke-linecap="round"/>`};
/* bubbles rising from (x,y) to y2, n of them, cycle by t */
TA.bubbles=(x,y,y2,t,n=4,col=TA.A,r=3.2,spread=6)=>{let s="";for(let i=0;i<n;i++){const k=((t*.6+i/n)%1);const yy=y+(y2-y)*k,xx=x+Math.sin((k*6+i)*2)*spread;s+=`<circle cx="${TA.n(xx)}" cy="${TA.n(yy)}" r="${r}" fill="${col}" stroke="#fff" stroke-width="1" opacity="${TA.n(1-k*.5)}"/>`}return s};
/* puffs of flash steam leaving an outlet (to show discharge) */
TA.puffs=(x,y,t,on,col="#c9d1d6")=>{if(!on)return "";let s="";for(let i=0;i<3;i++){const k=(t*.8+i/3)%1;s+=`<circle cx="${TA.n(x+k*40)}" cy="${TA.n(y-k*26)}" r="${TA.n(5+k*12)}" fill="${col}" opacity="${TA.n(.6*(1-k))}"/>`}return s};
/* fill a pipe bore with the fluid now in it, plus its moving marks */
TA.bore=(x1,x2,y,h,kind,t,v=1)=>{if(!kind)return "";const d=`M${x1} ${y+h/2}H${x2}`;
 if(kind==="w")return TA.water(TA.R(x1,y,x2-x1,h))+TA.flow(d,"w",t,v);
 if(kind==="wS")return TA.water(TA.R(x1,y,x2-x1,h));                       // standing condensate, no flow
 if(kind==="s")return TA.steam(TA.R(x1,y,x2-x1,h),.45)+TA.flow(d,"s",t,v);
 if(kind==="a")return TA.flow(d,"a",t,v,Math.min(7,h*.4));
 if(kind==="mix")return TA.water(TA.R(x1,y+h*.55,x2-x1,h*.45))+TA.flow(`M${x1} ${y+h*.78}H${x2}`,"w",t,v)+TA.steam(TA.R(x1,y,x2-x1,h*.55),.3)+TA.flow(`M${x1} ${y+h*.28}H${x2}`,"s",t,v*1.6,3);
 return ""};
TA.boreV=(x,y1,y2,w,kind,t,v=1)=>{if(!kind)return "";const d=`M${x+w/2} ${y1}V${y2}`;
 if(kind==="w")return TA.water(TA.R(x,y1,w,y2-y1))+TA.flow(d,"w",t,v);
 if(kind==="wS")return TA.water(TA.R(x,y1,w,y2-y1));
 if(kind==="s")return TA.steam(TA.R(x,y1,w,y2-y1),.45)+TA.flow(d,"s",t,v);
 if(kind==="a")return TA.flow(d,"a",t,v,Math.min(7,w*.4));
 if(kind==="mix")return TA.steam(TA.R(x,y1,w,y2-y1),.25)+TA.flow(d,"w",t,v)+TA.flow(`M${x+w*.25} ${y1}V${y2}`,"s",t,v*1.5,2.5);
 return ""};
TA.backV=(x1,x2,y1,y2,ry=16,f="url(#taIron)")=>`<path d="M${x1} ${y1}A${(x2-x1)/2} ${ry} 0 0 1 ${x2} ${y1}V${y2}H${x1}Z" fill="${f}" stroke="#20262a" stroke-width="1.2"/><path d="M${x1+8} ${y1-2}A${(x2-x1)/2-8} ${ry-4} 0 0 1 ${x2-8} ${y1-2}" stroke="#ffffff" stroke-opacity=".25" stroke-width="2" fill="none"/>`;
TA.backH=(x1,x2,y1,y2,rx=14,f="url(#taIronH)")=>`<path d="M${x1} ${y1}H${x2}A${rx} ${(y2-y1)/2} 0 0 1 ${x2} ${y2}H${x1}Z" fill="${f}" stroke="#20262a" stroke-width="1.2"/>`;
TA.T={};
/* ===== Inverted bucket (vertical body, bottom inlet, top outlet: Armstrong 200-series layout) ===== */
TA.T.ib={name:"Inverted bucket",fam:"Mechanical",
 stages:[{l:"Start-up: air and cold condensate",d:5},{l:"Condensate flows out",d:4},{l:"Steam arrives: the bucket floats",d:4},{l:"Closed on steam, then the vent bleeds it",d:6}],
 geo(st){const E=TA.ease;let by,pk,air=false;               // by: bucket top y (172 down, 142 up). pk: gas pocket depth in the bucket
  if(st.s===0){by=172;pk=8;air=true}
  else if(st.s===1){by=172;pk=4}
  else if(st.s===2){pk=TA.mix(4,70,st.p/.6);by=172-30*E((st.p-.45)/.3)}
  else{pk=TA.mix(70,6,st.p/.88);by=st.p<.88?142:172-30*(1-E((st.p-.88)/.1))}
  const Ey=by-26,Ly=120+(Ey-120)*.5,tip=Ly-12;return {by,pk,air,Ey,Ly,tip,open:TA.cl((tip-106)/15)}},
 stat(){let s=TA.floor(400,150,462);
  s+=TA.stubH(14,40,410,20)+TA.thread(18,402,36)+TA.pipeH(40,362,410,20)+TA.stubH(760,786,58,20)+TA.thread(762,50,36)+TA.pipeH(520,760,58,20);
  s+=TA.backV(300,500,96,372,22)+TA.backV(288,512,380,398,14)+TA.backV(402,520,54,88,10);
  /* inlet boss and bottom cap */
  s+=TA.cut(`M362 400H438V448H362Z`)+TA.cut(`M288 372H512V398H288Z`)+TA.cav(`M362 410H410V372H390V410Z`)+TA.cav(TA.R(362,410,48,20))+TA.cav(TA.R(390,372,20,40));
  /* body walls and top with the outlet boss */
  s+=TA.cut(`M300 104H314V372H300Z`)+TA.cut(`M486 104H500V372H486Z`)+TA.cut(`M300 88H500V104H300Z`)+TA.cut(`M300 104Q300 88 316 88`,"none");
  s+=TA.cut(`M402 50H520V88H402Z`)+TA.cav(TA.R(424,58,96,20))+TA.cav(TA.R(424,58,12,48));
  s+=TA.cav(TA.R(314,104,172,268));
  /* flange bolts at the cap joint, hex bosses */
  s+=`<path d="M288 372H512" stroke="#262b2f" stroke-width="2"/>`+TA.bolt(294,366,12,10)+TA.bolt(506,366,12,10)+TA.bolt(294,404,12,10)+TA.bolt(506,404,12,10);
  s+=`<rect x="290" y="361" width="8" height="48" fill="url(#taSteel)" stroke="#262b2f"/><rect x="502" y="361" width="8" height="48" fill="url(#taSteel)" stroke="#262b2f"/>`;
  /* seat ring (stainless) */
  s+=TA.cut(TA.R(416,96,8,12),"url(#taCutS)")+TA.cut(TA.R(436,96,8,12),"url(#taCutS)");
  /* lever hanger from the top */
  s+=`<path d="M456 104V122h12V104" fill="url(#taSteel)" stroke="#262b2f"/>`;
  s+=TA.big(190,392,"FROM THE EQUIPMENT",TA.W)+TA.big(650,44,"TO THE RETURN",TA.W);
  return s},
 dyn(st){const g=this.geo(st),t=st.t;let s="";
  const inK=st.s===0?"a":st.s===2&&st.p<.6?"s":g.open>.05?"w":"wS",outK=st.s===0?"a":g.open>.05?"mix":null;
  s+=TA.bore(14,410,410,20,inK==="a"?"wS":inK,t,1.2)+(inK==="a"?TA.flow("M20 420H400V380","a",t,1.2,6):"")+TA.boreV(390,372,410,20,inK==="s"?"s":"wS",t);
  /* the body is full of water (the water seal); the bucket holds a pocket of air or steam */
  s+=TA.water(TA.R(314,104,172,268));
  const b=g.by,lip=b+180,pkC=g.air?"#cfd6db":"url(#taSteam)";
  if(g.pk>1)s+=`<path d="M339 ${b+4}H461V${b+4+g.pk}H339Z" fill="${pkC}" opacity="${g.air?.95:.85}"/>`;
  if(g.air)s+=TA.bubbles(400,360,b+10,t,5);
  if(st.s===2&&st.p<.6)s+=TA.bubbles(400,368,b+8+g.pk,t*1.6,4,TA.S,4);
  /* steam or air bleeding out of the vent hole and rising to the top */
  if(g.pk>4&&(st.s===3||g.air))s+=TA.bubbles(372,b-2,110,t*1.4,3,g.air?TA.A:TA.S,2.6,2);
  /* flow path: in under the bucket, out under its lip, up the outside, out the seat */
  if(g.open>.05&&st.s!==0)s+=TA.flow(`M400 410V${lip-14}`,"w",t,1.4)+TA.flow(`M352 ${lip-10}Q330 ${lip+12} 326 ${lip-30}V120Q328 110 420 112`,"w",t,1.4)+TA.flow(`M448 ${lip-10}Q472 ${lip+12} 474 ${lip-30}V120Q472 110 440 112`,"w",t,1.4);
  if(g.air&&g.open>.05)s+=TA.flow(`M452 ${lip-6}Q474 ${lip+10} 476 ${lip-30}V118Q470 108 432 108V70`,"a",t,1,5);
  s+=TA.boreV(424,58,106,12,outK==="mix"?"w":outK,t,1.8)+TA.bore(424,786,58,20,outK,t,1.6)+TA.puffs(786,58,t,outK==="mix");
  s+=TA.rect(339,b+4,122,176,"url(#taSteel)",'opacity=".28"');
  /* bucket: inverted cup, cut in half, with the vent hole in its top */
  s+=`<g filter="url(#taSh)">`+TA.cut(`M335 ${b}H368V${b+4}H339V${lip}H335Z`,"url(#taCutS)")+TA.cut(`M376 ${b}H465V${lip}H461V${b+4}H376Z`,"url(#taCutS)")+`</g>`;
  /* bail, lever, valve */
  s+=`<path d="M392 ${b}Q392 ${b-18} 398 ${g.Ey}M408 ${b}Q408 ${b-18} 398 ${g.Ey}" stroke="#5b656b" stroke-width="2.4" fill="none"/>`;
  s+=`<path d="M398 ${TA.n(g.Ey)}L462 120" stroke="#2a3034" stroke-width="7" stroke-linecap="round"/><path d="M398 ${TA.n(g.Ey)}L462 120" stroke="url(#taSteelH)" stroke-width="4.4" stroke-linecap="round"/><circle cx="462" cy="120" r="4" fill="url(#taBall)" stroke="#262b2f"/>`;
  s+=`<path d="M430 ${TA.n(g.Ly)}V${TA.n(g.tip+6)}" stroke="#4b5459" stroke-width="3"/><path d="M420 ${TA.n(g.tip+10)}Q430 ${TA.n(g.tip-6)} 440 ${TA.n(g.tip+10)}Z" fill="url(#taBall)" stroke="#262b2f"/>`;
  return s},
 labels(st){const g=this.geo(st);return TA.lab(486,250,560,250,"BODY (CAST IRON)")+TA.lab(470,g.by+90,560,200,"INVERTED BUCKET")+TA.lab(372,g.by+2,250,150,"VENT HOLE","end")+TA.lab(420,g.Ly-4,250,112,"LEVER","end")+TA.lab(444,102,560,110,"VALVE AND SEAT")+TA.lab(500,385,570,400,"CAP AND BOLTS")+TA.lab(476,330,560,300,"WATER SEAL")}};
/* ===== Float and thermostatic (horizontal body; inlet high on the left, seat low in the right wall, air vent high on the right) ===== */
TA.rot=(x,y,a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];
TA.ftGeo=(f,P=[522,312],L=128,r=34)=>{const yb=372-(44+f*150)+r*.35;const dy=yb-P[1];const dx=-Math.sqrt(Math.max(1,L*L-dy*dy));
 const a=Math.atan2(dy,dx),a0=Math.atan2(372-44+r*.35-P[1],-Math.sqrt(L*L-(372-44+r*.35-P[1])**2));const v=TA.rot(16,38,a-a0);
 return {bx:P[0]+dx,by:yb,pad:[P[0]+v[0],P[1]+v[1]],lvl:372-(44+f*150),P,r,open:TA.cl((a0-a)*4)}};
TA.T.ft={name:"Float and thermostatic (F&T)",fam:"Mechanical",
 stages:[{l:"Start-up: the air vent is open",d:5},{l:"Condensate lifts the float",d:4},{l:"Steam arrives: the air vent shuts, the float keeps draining",d:5},{l:"Load drops: the float closes the valve",d:4}],
 geo(st){let f,vent,stm=0;
  if(st.s===0){f=TA.mix(.02,.22,st.p);vent=1}
  else if(st.s===1){f=TA.mix(.22,.62,st.p);vent=1}
  else if(st.s===2){f=.62+Math.sin(st.p*Math.PI*2)*.03;vent=1-TA.ease(st.p/.4);stm=1}
  else{f=TA.mix(.62,.06,TA.ease(st.p/.7));vent=0;stm=1}
  return {...TA.ftGeo(f),vent,stm}},
 stat(){let s=TA.floor(410,190,440);
  s+=TA.stubH(14,40,170,24)+TA.thread(18,162,40)+TA.pipeH(40,268,170,24)+TA.stubH(760,786,338,24)+TA.thread(762,330,40)+TA.pipeH(596,760,338,24);
  s+=TA.backH(256,560,140,392,22);
  /* body: left wall with the inlet port, floor, roof, right wall with the seat and the vent passage */
  s+=TA.cut(`M256 140H272V170H256Z`)+TA.cut(`M256 194H272V392H256Z`)+TA.cut(`M256 372H560V392H256Z`)+TA.cut(`M256 132H560V150H256Z`);
  s+=TA.cut(`M540 150H596V176H540Z`)+TA.cut(`M540 188H556V338H540Z`)+TA.cut(`M572 188H596V338H572Z`)+TA.cut(`M540 362H596V372H540Z`)+TA.cut(`M540 338H548V344H540Z`)+TA.cut(`M540 356H548V362H540Z`);
  s+=TA.cav(TA.R(268,170,8,24),1)+TA.cav(TA.R(272,150,268,222))+TA.cav(TA.R(540,176,56,12),1)+TA.cav(TA.R(556,188,16,150))+TA.cav(TA.R(540,338,56,24),1);
  /* bolted cover flange on the left, seat ring, float pivot bracket, vent mount */
  s+=`<rect x="244" y="128" width="14" height="268" rx="3" fill="url(#taIron)" stroke="#262b2f"/>`+[150,210,270,330,380].map(y=>TA.bolt(250,y,16,9)).join("");
  s+=TA.cut(TA.R(536,336,10,8),"url(#taCutS)")+TA.cut(TA.R(536,356,10,8),"url(#taCutS)");
  s+=`<path d="M522 312L530 300V290H540" fill="none" stroke="#5b656b" stroke-width="5"/><rect x="510" y="196" width="30" height="8" fill="url(#taSteelH)" stroke="#262b2f"/>`;
  s+=TA.big(140,158,"FROM THE EQUIPMENT",TA.W)+TA.big(680,326,"TO THE RETURN",TA.W);
  return s},
 dyn(st){const g=this.geo(st),t=st.t;let s="";const lv=g.lvl;
  const inK=st.s===0?"a":st.s===1?"w":"s",flowing=g.open>.08;
  s+=TA.bore(14,276,170,24,inK,t,1.3);
  if(g.stm)s+=TA.steam(TA.R(272,150,268,lv-150),.4)+TA.flow(`M276 182H360Q420 182 470 ${Math.min(lv-20,200)}`,"s",t,1);
  if(st.s===0)s+=TA.flow(`M276 182H500Q530 182 548 182H564V346H786`,"a",t,1.1,6);
  s+=TA.water(TA.R(272,lv,268,372-lv))+`<path d="M272 ${lv}H540" stroke="#cfe0fa" stroke-width="2"/>`;
  if(st.s===1)s+=TA.flow(`M290 186Q300 ${lv-8} 300 ${lv}`,"w",t,1.4);
  /* air vent: a sealed capsule; its cone backs off the port when cool */
  const cx=TA.n(512-(1-g.vent)*0),ch=TA.n(14+(1-g.vent)*12),tipX=TA.n(530+(1-g.vent)*10);
  s+=`<g><ellipse cx="${cx}" cy="182" rx="${ch}" ry="15" fill="url(#taSteel)" stroke="#262b2f"/><path d="M${cx-ch*.5} 172v20M${cx} 168v28M${TA.n(+cx+ch*.5)} 172v20" stroke="#7f898f" stroke-width="1"/>`;
  s+=`<path d="M${TA.n(+cx+ch)} 182H${tipX-6}" stroke="#4b5459" stroke-width="3"/><path d="M${tipX-8} 175L${tipX} 182L${tipX-8} 189Z" fill="url(#taBall)" stroke="#262b2f"/></g>`;
  /* float, arm, valve pad */
  s+=`<path d="M${TA.n(g.bx)} ${TA.n(g.by)}L${g.P[0]} ${g.P[1]}L${TA.n(g.pad[0])} ${TA.n(g.pad[1])}" stroke="#2a3034" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M${TA.n(g.bx)} ${TA.n(g.by)}L${g.P[0]} ${g.P[1]}L${TA.n(g.pad[0])} ${TA.n(g.pad[1])}" stroke="url(#taSteelH)" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
  s+=`<circle cx="${TA.n(g.bx)}" cy="${TA.n(g.by)}" r="${g.r}" fill="url(#taBall)" stroke="#262b2f" filter="url(#taSh)"/><path d="M${TA.n(g.bx-g.r)} ${TA.n(g.by)}A${g.r} 8 0 0 0 ${TA.n(g.bx+g.r)} ${TA.n(g.by)}" stroke="#6f797f" fill="none"/>`;
  s+=`<circle cx="${g.P[0]}" cy="${g.P[1]}" r="4.5" fill="url(#taBall)" stroke="#262b2f"/><rect x="${TA.n(g.pad[0]-4)}" y="${TA.n(g.pad[1]-8)}" width="8" height="16" rx="2" fill="url(#taSteel)" stroke="#262b2f"/>`;
  if(flowing)s+=TA.flow(`M480 360Q520 352 ${TA.n(g.pad[0])} 350H786`,"w",t,1.2+g.open)+TA.bore(596,786,338,24,"w",t,1.4)+TA.puffs(786,338,t,g.stm);
  else s+=TA.bore(540,548,344,12,"wS",t);
  return s},
 labels(st){const g=this.geo(st);return TA.lab(TA.n(g.bx),TA.n(g.by-20),330,110,"BALL FLOAT","end")+TA.lab(g.P[0],g.P[1],620,270,"LEVER PIVOT")+TA.lab(544,350,620,420,"VALVE AND SEAT")+TA.lab(505,182,560,100,"THERMOSTATIC AIR VENT")+TA.lab(250,300,170,320,"COVER","end")+TA.lab(470,365,560,430,"WATER SEAL","end")}};
/* ===== Thermodynamic disc ===== */
TA.T.td={name:"Thermodynamic (disc)",fam:"Thermodynamic",
 stages:[{l:"Start-up: pressure lifts the disc",d:4},{l:"Hot condensate flashes: the disc snaps shut",d:3.5},{l:"Closed: flash steam in the cap holds it down",d:5},{l:"Cap cools, the disc lifts and discharges",d:3}],
 geo(st){let lift,cap=0,flash=0,click=0;
  if(st.s===0){lift=1}
  else if(st.s===1){flash=TA.cl(st.p/.5);lift=1-TA.ease((st.p-.55)/.12);click=st.p>.62&&st.p<.85;cap=TA.cl((st.p-.6)/.3)}
  else if(st.s===2){lift=0;cap=1-st.p*.45}
  else{cap=TA.mix(.55,0,st.p/.4);lift=TA.ease((st.p-.3)/.2)}
  return {lift,cap,flash,click}},
 stat(){let s=TA.floor(400,170,430);
  s+=TA.stubH(14,40,316,24)+TA.thread(18,308,40)+TA.pipeH(40,300,316,24)+TA.stubH(760,786,316,24)+TA.thread(762,308,40)+TA.pipeH(500,760,316,24);
  s+=TA.backV(290,510,252,400,18,"url(#taSteel)")+TA.backV(318,482,170,252,14,"url(#taSteel)");
  /* body: one casting; inlet up the middle to the seat face, outer groove drops to the outlet */
  s+=TA.cut(`M290 252H510V414H290Z`,"url(#taCutS)");
  s+=TA.cav(TA.R(290,316,118,24),1)+TA.cav(TA.R(392,252,16,88))+TA.cav(TA.R(344,252,18,20))+TA.cav(TA.R(438,252,18,88))+TA.cav(TA.R(438,316,72,24),1);
  /* cap: screwed on, a dome over the disc that forms the control chamber */
  s+=TA.cut(`M318 252V196Q318 170 344 170H456Q482 170 482 196V252H466V200Q466 188 454 188H346Q334 188 334 200V252Z`,"url(#taCutS)");
  s+=TA.cav(`M334 252V200Q334 188 346 188H454Q466 188 466 200V252Z`);
  s+=TA.hex(400,162,90,16,"url(#taSteel)")+TA.thread(320,236,14,8,3)+TA.thread(468,236,14,8,3);
  s+=TA.big(170,300,"FROM THE EQUIPMENT",TA.W)+TA.big(640,300,"TO THE RETURN",TA.W);
  return s},
 dyn(st){const g=this.geo(st),t=st.t;let s="";const dy=TA.n(244-g.lift*20);
  const inK=st.s===0?"a":st.s===2?"wS":"w",open=g.lift>.15;
  s+=TA.bore(14,400,316,24,inK==="a"?"wS":inK,t,1.2)+TA.boreV(392,252,316,16,inK==="a"?"wS":inK,t,1.6);
  if(st.s===0)s+=TA.flow(`M20 328H400V250`,"a",t,1.2,6);
  /* control chamber pressure (red when steam is trapped above the disc) */
  if(g.cap>.02)s+=TA.steam(`M334 ${dy}V200Q334 188 346 188H454Q466 188 466 200V${dy}Z`,.25+g.cap*.55);
  if(open){const k=st.s===0?"a":"w";s+=TA.flow(`M400 252Q400 ${+dy+12} 372 ${+dy+12}H353V268`,k,t,1.6,4)+TA.flow(`M400 252Q400 ${+dy+12} 428 ${+dy+12}H447V328H786`,k,t,1.6,4)+TA.bore(438,786,316,24,st.s===0?null:"w",t,1.4)}
  if(g.flash>0&&open)s+=TA.flow(`M402 ${+dy+10}H440`,"s",t*2.6,2.4,3)+TA.flow(`M398 ${+dy+10}H360`,"s",t*2.6,2.4,3);
  /* the disc: the only moving part */
  s+=`<rect x="338" y="${dy}" width="124" height="10" rx="2" fill="url(#taSteelH)" stroke="#262b2f" filter="url(#taSh)"/>`;
  if(g.click)s+=TA.big(560,230,"CLICK","#c0392b","start");
  if(st.s===3&&st.p>.3)s+=TA.puffs(786,316,t,1);
  return s},
 labels(st){const g=this.geo(st);return TA.lab(460,244-g.lift*20+5,600,250,"DISC")+TA.lab(400,196,600,190,"CONTROL CHAMBER")+TA.lab(470,175,600,150,"CAP")+TA.lab(396,262,240,240,"INNER SEAT RING (INLET)","end")+TA.lab(353,262,240,212,"OUTER GROOVE TO OUTLET","end")}};
/* ===== Balanced-pressure thermostatic (capsule) ===== */
TA.thermoStages=()=>[{l:"Start-up: open, air and cold condensate out",d:4.5},{l:"Hot condensate: the element closes the valve",d:3.5},{l:"Closed: condensate backs up and cools",d:5},{l:"Cooled below steam temperature: it opens",d:3.5}];
TA.thermoK=st=>st.s===0?0:st.s===1?TA.ease((st.p-.3)/.5):st.s===2?1:1-TA.ease(st.p/.3);   // 0 open (cold) .. 1 closed (hot)
TA.T.bp={name:"Balanced-pressure thermostatic (capsule)",fam:"Thermostatic",stages:TA.thermoStages(),
 stat(){let s=TA.floor(400,150,430);
  s+=TA.stubH(14,40,236,24)+TA.thread(18,228,40)+TA.pipeH(40,320,236,24)+TA.stubH(760,786,324,24)+TA.thread(762,316,40)+TA.pipeH(480,760,324,24);
  s+=TA.backV(320,480,150,370,16,"url(#taBrass)");
  s+=TA.cut(`M320 150H336V236H320ZM320 260H336V370H320Z`,"url(#taCutB)")+TA.cut(`M464 150H480V324H464ZM464 348H480V370H464Z`,"url(#taCutB)");
  s+=TA.cut(`M336 300H392V324H464V348H408V370H336Z`,"url(#taCutB)")+TA.cut(`M336 348H464V370H336Z`,"url(#taCutB)");
  s+=TA.cav(TA.R(320,236,16,24),1)+TA.cav(TA.R(336,150,128,150))+TA.cav(TA.R(392,300,16,24))+TA.cav(TA.R(392,324,88,24),1);
  s+=TA.cut(`M316 136H484V156H316Z`,"url(#taCutB)")+TA.hex(400,128,80,16,"url(#taBrass)");
  /* seat insert, element cage */
  s+=TA.cut(TA.R(384,296,8,10),"url(#taCutS)")+TA.cut(TA.R(408,296,8,10),"url(#taCutS)");
  s+=`<path d="M352 156V222M448 156V222" stroke="#6f797f" stroke-width="4"/><path d="M352 222H372M428 222H448" stroke="#6f797f" stroke-width="4"/>`;
  s+=TA.big(170,226,"FROM THE EQUIPMENT",TA.W)+TA.big(640,312,"TO THE RETURN",TA.W);
  return s},
 dyn(st){const k=TA.thermoK(st),t=st.t;let s="";const open=k<.92,inK=st.s===0?"a":st.s===2?"wS":"w";
  s+=TA.bore(14,336,236,24,inK==="a"?"wS":inK,t,1.2);
  const lv=st.s===2?TA.mix(300,170,st.p):st.s===3?TA.mix(170,300,st.p):st.s===1?300-k*20:300;
  s+=TA.water(TA.R(336,lv,128,300-lv));
  if(st.s===0)s+=TA.flow(`M20 248H400V330H786`,"a",t,1.2,6);
  if(st.s===1)s+=TA.steam(TA.R(336,150,128,Math.max(0,lv-150)),.18*k);
  /* capsule: two welded diaphragms; swells when its fill boils */
  const h=TA.n(10+k*14),cy=TA.n(216+k*12),tip=TA.n(286+k*14);
  s+=`<ellipse cx="400" cy="${cy}" rx="44" ry="${h}" fill="url(#taSteel)" stroke="#262b2f" filter="url(#taSh)"/><ellipse cx="400" cy="${cy}" rx="34" ry="${TA.n(h*.6)}" fill="${k>.3?"#d9a9a3":"#9fbde8"}" opacity=".7"/>`;
  if(k>.3&&st.s<3)s+=TA.bubbles(400,+cy+4,+cy-4,t,3,"#fff",2,10);
  s+=`<path d="M356 ${cy}H444" stroke="#5b656b" stroke-width="2"/><path d="M400 ${TA.n(+cy+h)}V${tip-12}" stroke="#4b5459" stroke-width="4"/><path d="M392 ${tip-14}L400 ${tip}L408 ${tip-14}Z" fill="url(#taBall)" stroke="#262b2f"/>`;
  if(open&&st.s!==0&&st.s!==2)s+=TA.flow(`M360 ${Math.max(lv+20,280)}Q400 280 400 300V336H786`,"w",t,1.6)+TA.bore(480,786,324,24,"w",t,1.3);
  return s},
 labels(st){const k=TA.thermoK(st);return TA.lab(440,216+k*12,580,200,"CAPSULE (SEALED, FILLED)")+TA.lab(406,288+k*12,580,280,"VALVE AND SEAT")+TA.lab(470,140,580,130,"CAP")+TA.lab(476,240,580,240,"BODY")}};
/* ===== Thermostatic radiator trap (bellows, angle pattern) ===== */
TA.T.rad={name:"Thermostatic radiator trap (bellows)",fam:"Thermostatic",stages:[{l:"Start-up: bellows short, air and condensate out",d:4.5},{l:"Steam heats the bellows: it stretches and seats the plug",d:3.5},{l:"Closed: the radiator gives up heat, condensate collects",d:5},{l:"Condensate cools the bellows: it shrinks and opens",d:3.5}],
 stat(){let s=TA.floor(400,120,456);
  s+=TA.stubH(14,40,236,24)+TA.thread(18,228,40)+TA.pipeH(40,336,236,24)+TA.pipeV(388,326,444,24)+`<rect x="380" y="444" width="40" height="18" fill="url(#taIron)" stroke="#20262a"/>`+TA.thread(382,446,12,8,4);
  s+=TA.backV(336,464,150,330,14,"url(#taBrass)");
  s+=TA.cut(`M336 150H352V236H336ZM336 260H352V330H336Z`,"url(#taCutB)")+TA.cut(`M448 150H464V330H448Z`,"url(#taCutB)")+TA.cut(`M352 312H388V330H352ZM412 312H448V330H412Z`,"url(#taCutB)")+TA.cut(`M380 326H388V340H380ZM412 326H420V340H412Z`,"url(#taCutB)");
  s+=TA.cav(TA.R(336,236,16,24),1)+TA.cav(TA.R(352,150,96,162))+TA.cav(TA.R(388,312,24,14));
  /* union nut on the inlet, hex cap on top */
  s+=`<rect x="262" y="222" width="30" height="52" rx="3" fill="url(#taBrass)" stroke="#5a4210"/><path d="M272 222v52M282 222v52" stroke="#7c5c1c" stroke-width=".8"/>`;
  s+=TA.cut(`M330 132H470V152H330Z`,"url(#taCutB)")+TA.hex(400,122,70,18,"url(#taBrass)");
  s+=TA.big(150,222,"FROM THE RADIATOR",TA.W)+TA.big(470,430,"TO THE DRY RETURN",TA.W,"start");
  return s},
 dyn(st){const k=TA.thermoK(st),t=st.t;let s="";const open=k<.92;
  const inK=st.s===0?"a":st.s===1?"s":st.s===2?"wS":"w";
  s+=TA.bore(14,352,236,24,inK==="a"?null:inK,t,1.2);
  const lv=st.s===2?TA.mix(312,240,st.p):st.s===3?TA.mix(240,312,st.p):312;
  if(st.s===1)s+=TA.steam(TA.R(352,152,96,160),.3*k);
  s+=TA.water(TA.R(352,lv,96,312-lv));
  if(st.s===0)s+=TA.flow(`M20 248H400V460`,"a",t,1.2,6);
  /* bellows: pleated, sealed, with a little liquid inside; plug on its end */
  const len=TA.n(100+k*22),y0=154,y1=y0+ +len;let pl="M374 "+y0;const n=9;
  for(let i=0;i<n;i++){const ya=y0+len*(i+.5)/n,yb=y0+len*(i+1)/n;pl+=`L368 ${TA.n(ya)}L374 ${TA.n(yb)}`}
  pl+=`H426`;for(let i=n-1;i>=0;i--){const ya=y0+len*(i+.5)/n,yb=y0+len*i/n;pl+=`L432 ${TA.n(ya)}L426 ${TA.n(yb)}`}pl+="Z";
  s+=`<path d="${pl}" fill="url(#taSteel)" stroke="#262b2f" filter="url(#taSh)"/>`;
  for(let i=1;i<n;i++)s+=`<path d="M374 ${TA.n(y0+len*i/n)}H426" stroke="#7f898f" stroke-width=".8"/>`;
  s+=`<path d="M400 ${y1}V${TA.n(y1+38)}" stroke="#4b5459" stroke-width="5"/><path d="M386 ${TA.n(y1+34)}Q400 ${TA.n(y1+70)} 414 ${TA.n(y1+34)}Z" fill="url(#taBall)" stroke="#262b2f"/>`;
  if(open&&(st.s===0||st.s===3))s+=TA.boreV(388,312,462,24,st.s===0?null:"w",t,1.4);
  return s},
 labels(st){const k=TA.thermoK(st);return TA.lab(432,200,540,190,"BELLOWS (LIQUID INSIDE)")+TA.lab(414,258+k*22+30,540,290,"PLUG")+TA.lab(420,330,540,340,"SEAT (OUTLET)")+TA.lab(430,122,540,120,"HEX CAP (REMOVE TO SERVICE)")+TA.lab(277,248,220,190,"UNION","end")}};
/* ===== Free float (the ball is the valve: no lever) ===== */
TA.T.ff={name:"Free float (ball float)",fam:"Mechanical",
 stages:[{l:"Condensate arrives: the ball floats off the seat",d:4},{l:"Continuous discharge as fast as it comes",d:4},{l:"Load drops: the ball settles back on the seat",d:4}],
 geo(st){const f=st.s===0?TA.mix(.04,.4,st.p):st.s===1?.4+Math.sin(st.p*6.28)*.03:TA.mix(.4,.04,TA.ease(st.p/.7));const lv=372-(36+f*150);
  const cy=Math.min(338,lv+12),cx=506-TA.cl((338-cy)/40)*18;return {lv,cx,cy,open:TA.cl((338-cy)/14),stm:st.s>0}},
 stat(){let s=TA.ftStatBody();s+=TA.big(140,158,"FROM THE EQUIPMENT",TA.W)+TA.big(680,326,"TO THE RETURN",TA.W);return s},
 dyn(st){const g=this.geo(st),t=st.t;let s="";
  s+=TA.bore(14,276,170,24,st.s===2?"s":"w",t,1.3);
  if(g.stm)s+=TA.steam(TA.R(272,150,268,g.lv-150),.35);
  s+=TA.water(TA.R(272,g.lv,268,372-g.lv))+`<path d="M272 ${TA.n(g.lv)}H540" stroke="#cfe0fa" stroke-width="2"/>`;
  if(st.s<2)s+=TA.flow(`M290 186Q300 ${g.lv-8} 300 ${g.lv}`,"w",t,1.4);
  s+=`<circle cx="${TA.n(g.cx)}" cy="${TA.n(g.cy)}" r="32" fill="url(#taBall)" stroke="#262b2f" filter="url(#taSh)"/>`;
  if(g.open>.1)s+=TA.flow(`M440 ${TA.n(g.cy+30)}Q520 368 540 350H786`,"w",t,1.2+g.open)+TA.bore(540,786,338,24,"w",t,1.4)+TA.puffs(786,338,t,1);else s+=TA.bore(540,548,344,12,"wS",t);
  return s},
 labels(st){const g=this.geo(st);return TA.lab(TA.n(g.cx),TA.n(g.cy-20),360,110,"FREE BALL FLOAT (THE VALVE)","end")+TA.lab(544,350,620,420,"SEAT (UNDER WATER)")+TA.lab(470,360,560,440,"WATER SEAL","end")}};
TA.ftStatBody=()=>{let s=TA.floor(410,190,440);
  s+=TA.stubH(14,40,170,24)+TA.thread(18,162,40)+TA.pipeH(40,268,170,24)+TA.stubH(760,786,338,24)+TA.thread(762,330,40)+TA.pipeH(548,760,338,24);
  s+=TA.backH(256,548,140,392,22);
  s+=TA.cut(`M256 132H548V392H256Z`)+TA.cav(TA.R(256,170,16,24),1)+TA.cav(TA.R(272,150,268,222))+TA.cav(TA.R(540,344,8,12),1);
  s+=`<rect x="244" y="128" width="14" height="268" rx="3" fill="url(#taIron)" stroke="#262b2f"/>`+[150,210,270,330,380].map(y=>TA.bolt(250,y,16,9)).join("");
  s+=TA.cut(TA.R(536,336,10,8),"url(#taCutS)")+TA.cut(TA.R(536,356,10,8),"url(#taCutS)");return s};
/* ===== Bimetallic ===== */
TA.T.bm={name:"Bimetallic",fam:"Thermostatic",stages:TA.thermoStages(),
 stat(){let s=TA.floor(400,160,400);
  s+=TA.stubH(14,40,250,24)+TA.thread(18,242,40)+TA.pipeH(40,300,250,24)+TA.stubH(760,786,250,24)+TA.thread(762,242,40)+TA.pipeH(500,760,250,24);
  s+=TA.backH(300,500,190,334,16,"url(#taSteelH)");
  s+=TA.cut(`M300 190H500V334H300Z`,"url(#taCutS)")+TA.cav(TA.R(300,250,14,24),1)+TA.cav(TA.R(314,208,124,108),1)+TA.cav(TA.R(452,226,34,72),1)+TA.cav(TA.R(486,250,14,24),1)+TA.cav(TA.R(438,244,14,12),1);
  s+=TA.cut(TA.R(436,236,18,8),"url(#taCut)")+TA.cut(TA.R(436,256,18,8),"url(#taCut)");
  s+=`<rect x="316" y="176" width="120" height="16" rx="2" fill="url(#taSteelH)" stroke="#262b2f"/>`+TA.bolt(326,184,10,10)+TA.bolt(426,184,10,10);
  s+=TA.big(160,240,"FROM THE EQUIPMENT",TA.W)+TA.big(640,240,"TO THE RETURN",TA.W);
  return s},
 dyn(st){const k=TA.thermoK(st),t=st.t;let s="";const inK=st.s===0?"a":st.s===2?"wS":"w",open=k<.9;
  s+=TA.bore(14,314,250,24,inK==="a"?"wS":inK,t,1.2);
  s+=TA.water(TA.R(314,208,124,108),st.s===0?.35:.78);
  if(st.s===0)s+=TA.flow(`M20 262H786`,"a",t,1.2,6);
  /* stack of bimetal discs on the stem: dished more when hot, which pulls the valve onto the seat from the outlet side */
  const shift=k*10,vx=TA.n(462-shift);
  s+=`<path d="M352 250H${vx}" stroke="#4b5459" stroke-width="4"/>`;
  for(let i=0;i<6;i++){const x=362+i*12+shift*(i/6),b=4+k*7;s+=`<path d="M${TA.n(x)} 222Q${TA.n(x+b)} 250 ${TA.n(x)} 278" stroke="#262b2f" stroke-width="5" fill="none"/><path d="M${TA.n(x)} 222Q${TA.n(x+b)} 250 ${TA.n(x)} 278" stroke="#c49a3c" stroke-width="2.2" fill="none"/><path d="M${TA.n(x+2.5)} 224Q${TA.n(x+b+2.5)} 250 ${TA.n(x+2.5)} 276" stroke="#9aa3a9" stroke-width="2" fill="none"/>`}
  s+=TA.hex(350,250,8,20)+`<circle cx="${vx}" cy="250" r="9" fill="url(#taBall)" stroke="#262b2f"/>`;
  if(open&&st.s!==2&&st.s!==0)s+=TA.flow(`M330 300Q420 300 445 250H786`,"w",t,1.5)+TA.water(TA.R(452,226,34,72),.6)+TA.bore(486,786,250,24,"w",t,1.3);
  return s},
 labels(st){return TA.lab(380,226,300,150,"BIMETAL DISCS","end")+TA.lab(462,244,560,180,"VALVE (OUTLET SIDE)")+TA.lab(444,236,560,206,"SEAT")+TA.lab(400,184,560,154,"COVER")}};
/* ===== Liquid expansion (outlet turned up so the element stays under water) ===== */
TA.T.le={name:"Liquid expansion",fam:"Thermostatic",stages:TA.thermoStages(),
 stat(){let s=TA.floor(400,190,420);
  s+=TA.stubH(14,40,300,24)+TA.thread(18,292,40)+TA.pipeH(40,250,300,24)+TA.pipeV(548,120,284,24)+TA.pipeH(580,760,104,24)+TA.stubH(760,786,104,24)+TA.thread(762,96,40);
  s+=TA.cut(`M540 96H580V120H540Z`)+TA.cav(TA.R(548,104,32,24),1);
  s+=TA.backH(240,580,262,362,16);
  s+=TA.cut(`M240 262H580V362H240Z`)+TA.cav(TA.R(240,300,24,24),1)+TA.cav(TA.R(264,276,252,72),1)+TA.cav(TA.R(516,306,12,12),1)+TA.cav(TA.R(528,284,52,56))+TA.cav(TA.R(548,262,24,22));
  s+=TA.cut(TA.R(514,296,8,10),"url(#taCutS)")+TA.cut(TA.R(514,318,8,10),"url(#taCutS)");
  /* adjusting nut and lock nut on the left end */
  s+=TA.hex(232,312,14,40)+`<rect x="196" y="306" width="30" height="12" fill="url(#taSteelH)" stroke="#262b2f"/>`+TA.hex(206,312,10,28);
  s+=TA.big(140,288,"FROM THE EQUIPMENT",TA.W)+TA.big(680,92,"TO THE RETURN",TA.W);return s},
 dyn(st){const k=TA.thermoK(st),t=st.t;let s="";const inK=st.s===0?"a":st.s===2?"wS":"w",open=k<.9;
  s+=TA.bore(14,264,300,24,inK==="a"?"wS":inK,t,1.2)+TA.water(TA.R(264,276,252,72),st.s===0?.35:.78);
  if(st.s===0)s+=TA.flow(`M20 312H540V120H786`,"a",t,1.2,6);
  /* oil element: a sealed tube of oil with a corrugated end that pushes the rod */
  const ext=k*12;s+=`<rect x="250" y="290" width="150" height="44" rx="6" fill="url(#taBrassH)" stroke="#5a4210" filter="url(#taSh)"/><rect x="262" y="298" width="126" height="28" rx="4" fill="#d8b04a" opacity=".55"/>`;
  let p="M400 294";for(let i=0;i<7;i++)p+=`l${TA.n((10+ext)/14)} -4l${TA.n((10+ext)/14)} 4`;s+=`<path d="${p}V330H400Z" fill="url(#taSteelH)" stroke="#262b2f"/>`;
  const rx=TA.n(400+(10+ext)/7*7);s+=`<path d="M${rx} 312H${TA.n(+rx+86)}" stroke="#4b5459" stroke-width="5"/><path d="M${TA.n(+rx+86)} 300L${TA.n(+rx+104)} 312L${TA.n(+rx+86)} 324Z" fill="url(#taBall)" stroke="#262b2f"/>`;
  if(open&&st.s===3)s+=TA.flow(`M300 345Q500 345 520 312H560V120H786`,"w",t,1.5)+TA.water(TA.R(528,284,52,56),.7)+TA.boreV(548,120,284,24,"w",t,1.4)+TA.bore(572,786,104,24,"w",t,1.3);
  if(st.s===2)s+=TA.water(TA.R(528,284,52,56),.3);
  return s},
 labels(st){return TA.lab(330,296,300,240,"OIL-FILLED ELEMENT","end")+TA.lab(420,300,440,230,"CORRUGATED END")+TA.lab(512,312,600,330,"VALVE AND SEAT")+TA.lab(210,312,150,370,"ADJUSTER","end")+TA.lab(560,200,640,220,"OUTLET POINTS UP")}};
/* ===== Impulse (piston) ===== */
TA.T.imp={name:"Impulse (piston)",fam:"Thermodynamic",
 stages:[{l:"Start-up: flow lifts the piston, wide open",d:4},{l:"Hot condensate: bleed steam over the piston throttles it",d:5},{l:"Light load: it bleeds steam and cannot shut tight",d:4}],
 stat(){let s=TA.floor(400,160,420);
  s+=TA.stubH(14,40,250,24)+TA.thread(18,242,40)+TA.pipeH(40,300,250,24)+TA.stubH(760,786,330,24)+TA.thread(762,322,40)+TA.pipeH(500,760,330,24);
  s+=TA.backV(300,500,150,400,16,"url(#taSteel)");
  s+=TA.cut(`M300 150H500V400H300Z`,"url(#taCutS)")+TA.cav(TA.R(300,250,40,24),1)+TA.cav(TA.R(340,236,120,64))+TA.cav(TA.R(366,160,68,76))+TA.cav(TA.R(392,300,16,30))+TA.cav(TA.R(392,330,108,24),1);
  s+=`<path d="M366 236L378 172M434 236L422 172" stroke="#5d666c" stroke-width="2"/>`+TA.cut(TA.R(384,296,8,10),"url(#taCutS)")+TA.cut(TA.R(408,296,8,10),"url(#taCutS)")+TA.hex(400,144,90,14);
  s+=TA.big(160,240,"FROM THE EQUIPMENT",TA.W)+TA.big(640,320,"TO THE RETURN",TA.W);return s},
 dyn(st){const t=st.t;let s="";const lift=st.s===0?18:st.s===1?8+Math.sin(st.p*12)*1.5:3;
  s+=TA.bore(14,340,250,24,st.s===0?"wS":"w",t,1.2)+TA.water(TA.R(340,236,120,64));
  if(st.s===0)s+=TA.flow(`M20 262H400V342H786`,"a",t,1.2,6);
  s+=TA.steam(TA.R(372,160,56,Math.max(10,62-lift)),st.s===0?.15:.55);
  const y=TA.n(226-lift);s+=`<rect x="384" y="${TA.n(+y-30)}" width="32" height="30" fill="url(#taSteel)" stroke="#262b2f"/><rect x="368" y="${y}" width="64" height="9" rx="2" fill="url(#taSteelH)" stroke="#262b2f"/><path d="M400 ${TA.n(+y+9)}V${TA.n(282-lift)}" stroke="#4b5459" stroke-width="6"/><path d="M390 ${TA.n(280-lift)}L400 ${TA.n(300-lift)}L410 ${TA.n(280-lift)}Z" fill="url(#taBall)" stroke="#262b2f"/><path d="M400 ${TA.n(+y-30)}V${TA.n(+y+9)}" stroke="#262b2f" stroke-width="2" stroke-dasharray="3 2"/>`;
  s+=TA.flow(`M360 280Q400 280 400 300V342H786`,st.s===2?"s":"w",t,1.4)+TA.bore(500,786,330,24,st.s===2?"mix":"w",t,1.3);
  if(st.s>0)s+=TA.bubbles(400,+y-4,+y-26,t,3,TA.S,2.2,1);
  return s},
 labels(st){return TA.lab(430,215,560,200,"PISTON DISC")+TA.lab(400,200,560,170,"HOLLOW PISTON")+TA.lab(408,296,560,290,"MAIN VALVE AND SEAT")+TA.lab(430,175,560,140,"CONTROL CHAMBER")}};
/* ===== Fixed orifice, venturi orifice, labyrinth: no moving parts; the stages are different loads ===== */
TA.fixedDyn=(st,t,y=250)=>{let s="";
 if(st.s===0)s+=TA.bore(14,786,y,24,"w",t,1.2);
 if(st.s===1)s+=TA.bore(14,400,y,24,"mix",t,1.6)+TA.bore(400,786,y,24,"mix",t,2.2)+TA.puffs(786,y,t,1);
 if(st.s===2){s+=TA.bore(14,400,y,24,"wS",t)+TA.flow(`M20 ${y+12}H400`,"w",t,.4)+TA.bore(400,786,y,24,"w",t,1.2);s+=TA.big(200,y+70,"BACKS UP: EQUIPMENT WATERLOGS",TA.W)}
 return s};
TA.loadStages=x=>[{l:"Running load it was sized for",d:4},{l:"Light load: live steam blows through",d:4},{l:"Start-up load: condensate backs up",d:4}];
TA.T.or={name:"Fixed orifice",fam:"Other",stages:TA.loadStages(),
 stat(){let s=TA.floor(400,200,330);
  s+=TA.stubH(14,40,250,24)+TA.thread(18,242,40)+TA.pipeH(40,380,250,24)+TA.pipeH(420,760,250,24)+TA.stubH(760,786,250,24)+TA.thread(762,242,40);
  s+=`<rect x="356" y="214" width="26" height="96" rx="3" fill="url(#taIron)" stroke="#20262a"/><rect x="418" y="214" width="26" height="96" rx="3" fill="url(#taIron)" stroke="#20262a"/>`+TA.bolt(400,208,60,9)+TA.bolt(400,316,60,9);
  s+=TA.cut(`M382 222H418V258H382ZM382 266H418V302H382Z`,"url(#taCutS)")+`<rect x="396" y="222" width="8" height="80" fill="url(#taSteel)" stroke="#262b2f"/>`+TA.cav(TA.R(382,258,36,8),1);
  s+=TA.big(170,240,"FROM THE EQUIPMENT",TA.W)+TA.big(640,240,"TO THE RETURN",TA.W);return s},
 dyn(st){return TA.fixedDyn(st,st.t)},
 labels(){return TA.lab(400,262,520,180,"PLATE WITH A FIXED HOLE")+TA.lab(370,300,300,350,"FLANGES","end")}};
TA.T.ven={name:"Venturi orifice",fam:"Other",stages:[{l:"Running load: condensate fills the throat",d:4},{l:"Lighter load: flash steam chokes the throat",d:4},{l:"Start-up load: more than it can pass",d:4}],
 stat(){let s=TA.floor(400,200,330);
  s+=TA.stubH(14,40,250,24)+TA.thread(18,242,40)+TA.pipeH(40,300,250,24)+TA.pipeH(500,760,250,24)+TA.stubH(760,786,250,24)+TA.thread(762,242,40);
  s+=TA.backH(300,500,214,310,12,"url(#taSteelH)");
  s+=TA.cut(`M300 214H500V310H300Z`,"url(#taCutS)")+TA.cav(`M300 250H360L392 258H408L460 250H500V274H460L408 266H392L360 274H300Z`,1);
  s+=`<path d="M320 250V274M330 250V274M340 250V274" stroke="#5d666c" stroke-width="1.5"/>`;
  s+=TA.big(170,240,"FROM THE EQUIPMENT",TA.W)+TA.big(640,240,"TO THE RETURN",TA.W);return s},
 dyn(st){const t=st.t;let s="";
  if(st.s===0)s+=TA.bore(14,392,250,24,"w",t,1)+TA.water(`M392 258H408V266H392Z`)+TA.bore(408,786,250,24,"w",t,1.4)+TA.flow("M380 262H420","w",t,3,2);
  if(st.s===1)s+=TA.bore(14,392,250,24,"w",t,.6)+TA.steam(`M392 258H408V266H392Z`,.7)+TA.bore(408,786,250,24,"mix",t,1.6)+TA.puffs(786,250,t,1);
  if(st.s===2)s+=TA.bore(14,392,250,24,"wS",t)+TA.flow(`M20 262H392`,"w",t,.4)+TA.bore(392,786,250,24,"w",t,1.6)+TA.big(200,320,"BACKS UP",TA.W);
  return s},
 labels(){return TA.lab(400,262,520,190,"VENTURI THROAT")+TA.lab(330,254,250,190,"STRAINER","end")}};
TA.T.lab={name:"Labyrinth",fam:"Other",stages:[{l:"Set right: condensate flashes step by step",d:4},{l:"Set too open, or the load drops: steam blows",d:4},{l:"Set too tight, or the load rises: it waterlogs",d:4}],
 stat(){let s=TA.floor(400,200,350);
  s+=TA.stubH(14,40,286,24)+TA.thread(18,278,40)+TA.pipeH(40,300,286,24)+TA.pipeH(500,760,286,24)+TA.stubH(760,786,286,24)+TA.thread(762,278,40);
  s+=TA.backH(300,500,214,334,14);
  s+=TA.cut(`M300 214H500V334H300Z`)+TA.cav(TA.R(300,286,20,24),1)+TA.cav(TA.R(320,232,160,84))+TA.cav(TA.R(480,286,20,24),1);
  for(let i=0;i<5;i++)s+=`<rect x="${336+i*30}" y="${i%2?260:232}" width="8" height="56" fill="url(#taSteel)" stroke="#262b2f"/>`;
  s+=`<rect x="396" y="150" width="8" height="66" fill="url(#taSteel)" stroke="#262b2f"/><ellipse cx="400" cy="146" rx="44" ry="10" fill="url(#taIronH)" stroke="#20262a"/>`;
  s+=TA.big(170,276,"FROM THE EQUIPMENT",TA.W)+TA.big(640,276,"TO THE RETURN",TA.W);return s},
 dyn(st){const t=st.t;let s="";const k=st.s===0?"w":st.s===1?"mix":"wS";
  s+=TA.bore(14,320,286,24,k,t,st.s===2?.3:1)+TA.water(TA.R(320,232,160,84),st.s===1?.4:.75);
  s+=TA.flow(`M320 300H330V246H360V300H390V246H420V300H450V246H480V300H500`,st.s===1?"s":"w",t,st.s===2?.3:1.2)+TA.bore(480,786,286,24,st.s===2?"w":k==="wS"?"w":k,t,1.4);
  if(st.s===0)s+=TA.bubbles(450,300,250,t,3,TA.S,2.4,4);if(st.s===1)s+=TA.puffs(786,286,t,1);
  if(st.s===2)s+=TA.big(170,350,"BACKS UP",TA.W);
  return s},
 labels(){return TA.lab(400,170,520,150,"HANDWHEEL MOVES THE BAFFLES")+TA.lab(370,260,300,190,"BAFFLES","end")}};
/* ===== Open (upright) bucket: historical ===== */
TA.T.ob={name:"Open bucket (old design)",fam:"Mechanical",
 stages:[{l:"Condensate around the bucket floats it: valve shut",d:4},{l:"Condensate spills over into the bucket",d:4},{l:"Bucket sinks: steam pressure pushes it out the tube",d:4},{l:"Bucket empties, floats and shuts again",d:3}],
 geo(st){let fill,down;if(st.s===0){fill=.1;down=0}else if(st.s===1){fill=TA.mix(.1,.75,st.p);down=0}else if(st.s===2){fill=TA.mix(.75,.4,st.p);down=TA.ease(st.p/.2)}else{fill=TA.mix(.4,.1,st.p);down=1-TA.ease((st.p-.6)/.3)}return {fill,down}},
 stat(){let s=TA.floor(400,150,436);
  s+=TA.stubH(14,40,120,24)+TA.thread(18,112,40)+TA.pipeH(40,300,120,24)+TA.pipeH(500,760,70,24)+TA.stubH(760,786,70,24)+TA.thread(762,62,40);
  s+=TA.backV(300,500,96,420,18);
  s+=TA.cut(`M300 96H500V420H300Z`)+TA.cav(TA.R(300,120,14,24),1)+TA.cav(TA.R(314,110,172,296))+TA.cav(TA.R(394,70,12,40))+TA.cav(TA.R(394,70,106,24),1);
  s+=TA.cut(TA.R(386,98,8,10),"url(#taCutS)")+TA.cut(TA.R(406,98,8,10),"url(#taCutS)");
  s+=TA.big(170,110,"FROM THE EQUIPMENT",TA.W)+TA.big(640,60,"TO THE RETURN",TA.W);return s},
 dyn(st){const g=this.geo(st),t=st.t;let s="";const by=TA.n(170+g.down*40);
  s+=TA.bore(14,314,120,24,"w",t,st.s===1?1.4:.8);
  s+=TA.steam(TA.R(314,110,172,296),.25)+TA.water(TA.R(314,180+g.down*40,172,226-g.down*40));
  /* bucket open at the top, with the discharge tube reaching near its bottom */
  const top=+by,bot=top+190,wl=TA.n(bot-6-g.fill*176);
  s+=`<path d="M346 ${top}H454V${wl}H346Z" fill="url(#taCav)"/>`+TA.steam(`M346 ${top}H454V${wl}H346Z`,.22)+TA.water(`M346 ${wl}H454V${bot-4}H346Z`,.9);
  if(st.s===1)s+=TA.flow(`M330 ${top+12}Q350 ${top-14} 372 ${top+20}`,"w",t,1.3);
  s+=TA.cut(`M342 ${top}H346V${bot-4}H454V${top}H458V${bot}H342Z`,"url(#taCutS)");
  s+=`<rect x="396" y="108" width="8" height="${TA.n(bot-130)}" fill="url(#taSteel)" stroke="#262b2f"/>`;
  s+=`<path d="M400 ${top-8}V${TA.n(110+g.down*12)}" stroke="#4b5459" stroke-width="3"/><path d="M392 ${TA.n(118+g.down*12)}L400 ${TA.n(104+g.down*12)}L408 ${TA.n(118+g.down*12)}Z" fill="url(#taBall)" stroke="#262b2f"/>`;
  if(st.s===2&&g.down>.5)s+=TA.flow(`M400 ${bot-24}V82H786`,"w",t,1.6)+TA.bore(406,786,70,24,"w",t,1.4);
  return s},
 labels(st){const g=this.geo(st);return TA.lab(456,250+g.down*40,560,250,"OPEN BUCKET")+TA.lab(400,300,560,300,"DISCHARGE TUBE")+TA.lab(406,108,560,130,"VALVE AND SEAT")}};
TA.ORDER=["ib","ft","ff","ob","bp","rad","bm","le","td","imp","or","ven","lab"];
