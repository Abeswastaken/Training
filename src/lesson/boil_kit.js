/* ============ Boiler lesson kit: drawings (cutaway boiler, tank, valves, LWCOs, traps) and the numbers the lessons calculate ============
 Model sources: water specific volume and saturated steam from standard steam tables; Henry's law for dissolved air; 0.433 psi per foot of water;
 DOE Steam Tip Sheet 1 for steam through a failed-open trap orifice (1/8 in. at 150 psig = 75.8 lb/h). */
const B={};
/* gradients and patterns used by the boiler drawings, added once to the page's shared hidden defs (a hidden tab can't host them) */
B.DEFS=`<linearGradient id="bkJacket" x1="0" x2="1"><stop offset="0" stop-color="#7a3a33"/><stop offset=".18" stop-color="#a95447"/><stop offset=".55" stop-color="#8c4338"/><stop offset="1" stop-color="#5e2a24"/></linearGradient>
<linearGradient id="bkJacketB" x1="0" x2="1"><stop offset="0" stop-color="#5f7486"/><stop offset=".18" stop-color="#8ea3b4"/><stop offset=".55" stop-color="#6f8597"/><stop offset="1" stop-color="#4a5b69"/></linearGradient>
<linearGradient id="bkIron" x1="0" x2="1"><stop offset="0" stop-color="#2c3135"/><stop offset=".35" stop-color="#4b5359"/><stop offset="1" stop-color="#22272a"/></linearGradient>
<linearGradient id="bkTank" x1="0" x2="1"><stop offset="0" stop-color="#3d6b9a"/><stop offset=".25" stop-color="#77a3cf"/><stop offset=".6" stop-color="#4f7fb0"/><stop offset="1" stop-color="#2e5378"/></linearGradient>
<linearGradient id="bkRedV" x1="0" x2="1"><stop offset="0" stop-color="#7c1e18"/><stop offset=".3" stop-color="#e0564a"/><stop offset=".6" stop-color="#b8322a"/><stop offset="1" stop-color="#7c1e18"/></linearGradient>
<linearGradient id="bkGreenV" x1="0" x2="1"><stop offset="0" stop-color="#1f5a33"/><stop offset=".3" stop-color="#4fae6e"/><stop offset=".6" stop-color="#2f8a4c"/><stop offset="1" stop-color="#1f5a33"/></linearGradient>
<linearGradient id="bkBlackV" x1="0" x2="1"><stop offset="0" stop-color="#15181a"/><stop offset=".3" stop-color="#4a5257"/><stop offset=".6" stop-color="#2a3034"/><stop offset="1" stop-color="#15181a"/></linearGradient>
<linearGradient id="bkGlass" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.55)"/><stop offset=".3" stop-color="rgba(255,255,255,.08)"/><stop offset="1" stop-color="rgba(255,255,255,.3)"/></linearGradient>
<linearGradient id="bkSteam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#eef2f5"/><stop offset="1" stop-color="#c9d3da"/></linearGradient>
<linearGradient id="bkRad" x1="0" x2="1"><stop offset="0" stop-color="#8d969c"/><stop offset=".35" stop-color="#e4e8ea"/><stop offset=".7" stop-color="#b9c1c6"/><stop offset="1" stop-color="#7d868c"/></linearGradient>
<pattern id="bkHotW" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="10" height="10" fill="#d9577f"/><rect width="5" height="10" fill="#9b4fb8"/></pattern>`;
(()=>{try{rzEnsureDefs();const d=document.getElementById("rzDefs");if(d&&!document.getElementById("bkJacket"))d.insertAdjacentHTML("beforeend",B.DEFS)}catch(e){}})();
/* ---------- numbers ---------- */
B.lerp=(t,x)=>{if(x<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(x<=t[i][0]){const a=t[i-1],b=t[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return t[t.length-1][1]};
B.inv=(t,y)=>B.lerp(t.map(([a,b])=>[b,a]),y);
/* specific volume of water, ft3/lb (steam tables, compressed-liquid effect ignored) */
B.VT=[[32,.01602],[40,.01602],[50,.01602],[60,.01604],[70,.01605],[80,.01607],[100,.01613],[120,.01620],[140,.01629],[160,.01639],[180,.01651],[200,.01663],[212,.01672],[220,.01677],[240,.01692],[250,.01700]];
B.v=T=>B.lerp(B.VT,T);
B.exp=(T1,T2)=>B.v(T2)/B.v(T1)-1;                 // fraction the water grows heating T1 to T2
/* saturation pressure of water, psia */
B.PV=[[32,.0887],[40,.1217],[50,.178],[60,.2563],[70,.3632],[80,.5073],[100,.9503],[120,1.6945],[140,2.892],[160,4.745],[180,7.515],[200,11.529],[212,14.696],[216,15.91],[220,17.19],[225,18.92],[230,20.78],[235,22.79],[240,24.97],[245,27.31],[250,29.82],[260,35.43],[280,49.2],[300,67.0],[320,89.6],[340,117.9],[350,134.5],[360,153.0],[370,173.4]];
B.ATM=14.696;
B.Pv=T=>B.lerp(B.PV,T);
B.Tsat=Pg=>B.inv(B.PV,Pg+B.ATM);                  // steam temperature from gauge pressure
B.Psat=T=>B.Pv(T)-B.ATM;                          // gauge pressure from steam temperature
B.HFG=[[212,970.3],[250,945.5],[300,910.4],[350,870.0],[370,853.4]];
B.hfg=Pg=>B.lerp(B.HFG,B.Tsat(Pg));               // latent heat, Btu/lb
/* air water can hold, mL of air per liter of water (Henry's law): solubility at one atmosphere of air, times the air's share of the absolute pressure */
B.AK=[[32,29.2],[50,22.8],[68,18.7],[86,15.6],[104,14.1],[122,12.9],[140,12.2],[158,11.6],[176,11.2],[194,10.9],[212,10.6],[250,10.2]];
B.air=(T,Pg)=>Math.max(0,B.lerp(B.AK,T)*(Pg+B.ATM-B.Pv(T))/B.ATM);
B.fill=h=>0.433*h+4;                               // cold fill pressure at the boiler: height to the top plus 4 psi at the top
B.WC=27.7;                                         // inches of water per psi
B.oz=p=>p<1?K.f0(p*16)+" oz":K.f1(p)+" psi";
B.trapLoss=(Pg,D)=>29.4*(Pg+B.ATM)*D*D;           // lb/h of steam through a stuck-open orifice to atmosphere (fits the DOE tip sheet table)
B.money=x=>"$"+(Math.round(x/10)*10).toLocaleString("en-US");
/* ---------- drawing ---------- */
B.L=(x,y,t,o={})=>K.lbl(x,y,t,{size:o.size||13,a:o.a,fill:o.fill,c:o.c});
/* a label with a leader line to the part */
B.co=(px,py,lx,ly,t,o={})=>{const a=o.a||(lx<px?"end":"start");return `<path d="M${px} ${py} L${lx} ${ly}" stroke="var(--muted)" stroke-width="1.2" fill="none"/><circle cx="${px}" cy="${py}" r="2.6" fill="var(--muted)"/>`+B.L(lx+(a==="end"?-4:a==="start"?4:0),ly+(o.dy??4),t,{a,fill:o.fill,size:o.size})};
B.pH=(x1,x2,y,d=10,f="url(#zSteelH)",st="#3f474c")=>`<rect x="${Math.min(x1,x2)}" y="${y-d/2}" width="${Math.abs(x2-x1)}" height="${d}" fill="${f}" stroke="${st}" stroke-width=".8"/>`;
B.pV=(x,y1,y2,d=10,f="url(#zSteel)",st="#3f474c")=>`<rect x="${x-d/2}" y="${Math.min(y1,y2)}" width="${d}" height="${Math.abs(y2-y1)}" fill="${f}" stroke="${st}" stroke-width=".8"/>`;
/* a pipe along any path, solid colored fluid with a dark wall and a highlight */
B.pipe=(d,col,w=9,o={})=>`<path d="${d}" stroke="${o.edge||"#2c3236"}" stroke-width="${w+3}" fill="none" stroke-linejoin="round"${o.op!=null?` opacity="${o.op}"`:""}/><path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linejoin="round"${o.op!=null?` opacity="${o.op}"`:""}/><path d="${d}" stroke="rgba(255,255,255,.28)" stroke-width="${Math.max(1,w*.25)}" fill="none" stroke-linejoin="round" transform="translate(-.8 -1.2)"/>`;
B.flow=(d,on=true,sp=1.2)=>on?`<path d="${d}" stroke="#fff" stroke-width="2" stroke-dasharray="4 10" fill="none" class="lsFlow" style="animation-duration:${sp}s" opacity=".85"/>`:"";
B.HOT="#d23a26";B.RET="#9b2d20";B.STM="#b9c3ca";B.COND="#2f6fd6";B.COLD="#5a9bd4";
B.jacket=(x,y,w,h,col="url(#bkJacket)")=>`<g filter="url(#zShadow)"><path d="M${x+w-2} ${y+3} L${x+w+9} ${y-5} V${y+h-9} L${x+w-2} ${y+h-1} Z" fill="${col}"/><path d="M${x+w-2} ${y+3} L${x+w+9} ${y-5} V${y+h-9} L${x+w-2} ${y+h-1} Z" fill="#000" opacity=".38"/><path d="M${x+4} ${y+1} L${x+15} ${y-7} H${x+w+9} L${x+w-2} ${y+1} Z" fill="${col}"/><path d="M${x+4} ${y+1} L${x+15} ${y-7} H${x+w+9} L${x+w-2} ${y+1} Z" fill="#fff" opacity=".28"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${col}" stroke="#3f4a52" stroke-width="1.4"/></g><rect x="${x+3}" y="${y+3}" width="${w-6}" height="10" rx="4" fill="rgba(255,255,255,.18)"/>`;
B.sections=(x,y,w,h,n)=>{const sw=w/n;return Array.from({length:n},(_,i)=>`<rect x="${(x+i*sw+1).toFixed(1)}" y="${y}" width="${(sw-2).toFixed(1)}" height="${h}" rx="5" fill="url(#bkIron)" stroke="#15181a" stroke-width=".8"/><rect x="${(x+i*sw+3).toFixed(1)}" y="${y+4}" width="2.4" height="${h-8}" rx="1" fill="rgba(255,255,255,.12)"/>`).join("")};
B.flame=(x,y,w,on=true,s=1)=>on?`<g class="lsPulse" style="animation-duration:.9s">${Array.from({length:Math.max(2,Math.floor(w/16))},(_,i)=>{const cx=x+8+i*16;return `<path d="M${cx-7} ${y} Q${cx-6} ${y-14*s} ${cx} ${y-24*s} Q${cx+6} ${y-14*s} ${cx+7} ${y} Z" fill="url(#zFlame)"/><path d="M${cx-3.5} ${y} Q${cx} ${y-10*s} ${cx+3.5} ${y} Z" fill="#3c7bf0" opacity=".85"/>`}).join("")}</g>`:"";
B.burner=(x,y,w)=>`<rect x="${x-6}" y="${y}" width="${w+12}" height="8" rx="3" fill="url(#zSteelH)" stroke="#3f474c"/>${Array.from({length:Math.floor(w/16)},(_,i)=>`<rect x="${x+3+i*16}" y="${y+8}" width="10" height="8" rx="2" fill="url(#zSteel)" stroke="#3f474c" stroke-width=".7"/>`).join("")}`;
/* cutaway boiler. o: {lvl (0..1 of the water space), steam, fire, lines:{nwl,cut,crown} as 0..1 heights, name, sub} */
B.boiler=(x,y,w,h,o={})=>{const ix=x+6,iy=y+6,iw=w-12,ih=h-50,wy=iy+ih*(1-Math.max(0,Math.min(1,o.lvl??(o.steam?.62:1))));const id=K.uid("bc");let s=B.jacket(x,y,w,h,o.col);
 s+=`<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#1b1f22"/><clipPath id="${id}"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}"/></clipPath><g clip-path="url(#${id})">${B.sections(ix+2,iy+2,iw-4,ih-4,o.n||6)}`;
 if(o.steam){s+=`<rect x="${ix}" y="${iy}" width="${iw}" height="${wy-iy}" fill="url(#bkSteam)" opacity="${o.fire===false?.15:.32}"/><rect x="${ix}" y="${wy}" width="${iw}" height="${iy+ih-wy}" fill="var(--cold)" opacity=".5"/>`;
  if(o.fire!==false)s+=[0,1,2,3,4].map(k=>`<circle cx="${ix+14+k*(iw-28)/4}" cy="${iy+ih-12-(k%2)*16}" r="${2+k%3}" fill="none" stroke="#fff" stroke-width="1.3" class="lsBub" style="animation-delay:${k*.35}s"/>`).join("")}
 else s+=`<rect x="${ix}" y="${wy}" width="${iw}" height="${iy+ih-wy}" fill="url(#bkHotW)" opacity=".55"/>`;
 s+=`</g><rect x="${ix}" y="${iy+ih}" width="${iw}" height="${h-ih-12}" fill="#121517"/>`+B.burner(ix+10,iy+ih+22,iw-20)+B.flame(ix+12,iy+ih+22,iw-24,o.fire!==false);
 const ln=(f,c,t)=>{const yy=iy+ih*(1-f);return `<path d="M${x} ${yy} H${x+w}" stroke="${c}" stroke-dasharray="4 3" stroke-width="1.4"/>`+(t?`<text x="${x+w-8}" y="${yy-4}" class="lsGn" style="text-anchor:end;fill:${c};font-size:10px">${t}</text>`:"")};
 if(o.lines){const L=o.lines;if(L.nwl!=null)s+=ln(L.nwl,"#8fc3ff","NORMAL WATER LINE");if(L.cut!=null)s+=ln(L.cut,"#ff8a7a","LWCO CUTOFF");if(L.crown!=null)s+=ln(L.crown,"#ffc35a","CROWN SHEET")}
 if(o.name)s+=`<text x="${ix+6}" y="${iy+16}" class="lsL" style="fill:#e9ecee;font-size:14px;text-anchor:start">${o.name}</text>`;
 return s};
B.byL=(y,h,f)=>y+6+(h-50)*(1-f);                  // y of a level (0..1) inside B.boiler
/* dial gauge: val on 0..max, needle -135..135 degrees */
B.gauge=(cx,cy,r,val,max,unit,o={})=>{const a=(-135+270*Math.max(0,Math.min(1.04,val/max)))*Math.PI/180;let s=`<circle cx="${cx}" cy="${cy}" r="${r+3}" fill="url(#zSteel)" stroke="#4d555a" filter="url(#zShadow)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#f7f6f0"/>`;
 for(let i=0;i<=10;i++){const b=(-135+27*i)*Math.PI/180;s+=`<path d="M${(cx+Math.sin(b)*r*.78).toFixed(1)} ${(cy-Math.cos(b)*r*.78).toFixed(1)} L${(cx+Math.sin(b)*r*.92).toFixed(1)} ${(cy-Math.cos(b)*r*.92).toFixed(1)}" stroke="#333" stroke-width="${i%5?1:1.8}"/>`}
 if(o.red!=null){const b=(-135+270*o.red/max)*Math.PI/180;s+=`<path d="M${(cx+Math.sin(b)*r*.6).toFixed(1)} ${(cy-Math.cos(b)*r*.6).toFixed(1)} L${(cx+Math.sin(b)*r*.94).toFixed(1)} ${(cy-Math.cos(b)*r*.94).toFixed(1)}" stroke="#d0312d" stroke-width="3"/>`}
 s+=`<text x="${cx}" y="${cy+r*.5}" class="lsGn" style="font-size:${Math.max(8,r*.26)}px">${unit}</text><path d="M${cx} ${cy} L${(cx+Math.sin(a)*r*.82).toFixed(1)} ${(cy-Math.cos(a)*r*.82).toFixed(1)}" stroke="#c0281c" stroke-width="2.2" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="3" fill="#333"/>`;
 return s};
/* hot water relief valve or steam safety valve, inlet at bottom (cx, y), outlet to the right. open: puff of discharge */
B.relief=(cx,y,o={})=>{const s1=o.s||1;let s=`<g transform="translate(${cx} ${y}) scale(${s1})">`+`<rect x="-7" y="-22" width="14" height="22" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="-16" y="-50" width="32" height="30" rx="6" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="16" y="-44" width="22" height="16" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="-10" y="-92" width="20" height="44" rx="4" fill="url(#zBrass)" stroke="#6a4a12"/><path d="M-6 -86 h12 M-6 -78 h12 M-6 -70 h12 M-6 -62 h12" stroke="#6a4a12" stroke-width="1.2"/><rect x="-3" y="-100" width="6" height="10" fill="url(#zBrass)" stroke="#6a4a12"/><path d="M0 -98 L28 -112" stroke="#8c6a1c" stroke-width="5" stroke-linecap="round"/>`;
 if(o.open)s+=`<g class="lsPulse"><path d="M38 -36 q10 -4 14 4 q8 -6 14 2" stroke="#9fb7c9" stroke-width="3" fill="none"/></g>`;
 return s+`</g>`};
/* bladder expansion tank, water enters from the bottom. wf: fraction of the tank holding water */
B.tank=(cx,top,w,h,wf,o={})=>{const id=K.uid("tk");const f=Math.max(0,Math.min(1,wf)),hang=!!o.hang,wy=hang?top+h*f:top+h*(1-f);let s=`<g filter="url(#zShadow)"><rect x="${cx-w/2}" y="${top}" width="${w}" height="${h}" rx="${w*.45}" fill="${o.f||"url(#bkTank)"}" stroke="#244566" stroke-width="1.4"/></g>`;
 s+=`<clipPath id="${id}"><rect x="${cx-w/2+8}" y="${top+12}" width="${w-16}" height="${h-24}" rx="${w*.35}"/></clipPath><g clip-path="url(#${id})"><rect x="${cx-w/2}" y="${top}" width="${w}" height="${h}" fill="#e9eef2"/>`+(hang?`<rect x="${cx-w/2}" y="${top}" width="${w}" height="${wy-top}" fill="${o.wcol||"url(#bkHotW)"}" opacity=".75"/>`:`<rect x="${cx-w/2}" y="${wy}" width="${w}" height="${top+h-wy}" fill="${o.wcol||"url(#bkHotW)"}" opacity=".75"/>`)+(o.burst?"":`<path d="M${cx-w/2} ${wy} Q${cx} ${wy+(hang?8:-8)} ${cx+w/2} ${wy}" stroke="#1d2327" stroke-width="2.4" fill="none"/>`)+`</g>`;
 s+=hang?`<rect x="${cx-4}" y="${top-12}" width="8" height="12" fill="url(#zBrass)" stroke="#6a4a12"/>`:`<rect x="${cx-4}" y="${top+h}" width="8" height="12" fill="url(#zBrass)" stroke="#6a4a12"/>`;
 return s};
B.pump=(cx,cy,on=true)=>`<g filter="url(#zShadow)"><rect x="${cx-16}" y="${cy-44}" width="32" height="30" rx="5" fill="url(#bkGreenV)" stroke="#173d24"/><rect x="${cx-10}" y="${cy-14}" width="20" height="6" fill="url(#zSteel)"/><circle cx="${cx}" cy="${cy}" r="13" fill="url(#zSteel)" stroke="#3f474c"/></g>${on?`<path d="M${cx-6} ${cy} a6 6 0 1 1 6 6" stroke="#fff" stroke-width="1.6" fill="none" class="lsPulse"/>`:""}`;
B.vent=(cx,y,o={})=>`<rect x="${cx-2}" y="${y-8}" width="4" height="8" fill="url(#zBrass)"/><rect x="${cx-8}" y="${y-28}" width="16" height="20" rx="3" fill="url(#zSteel)" stroke="#4d555a" filter="url(#zShadow)"/><ellipse cx="${cx}" cy="${y-28}" rx="8" ry="2.5" fill="#d9dee1" stroke="#4d555a" stroke-width=".7"/><rect x="${cx-1.5}" y="${y-34}" width="3" height="6" fill="url(#zBrass)"/>`+(o.puff?`<g class="lsPulse"><circle cx="${cx+8}" cy="${y-40}" r="4" fill="none" stroke="#9fb7c9" stroke-width="2"/><circle cx="${cx+14}" cy="${y-48}" r="3" fill="none" stroke="#9fb7c9" stroke-width="2"/></g>`:"");
B.valve=(cx,cy,o={})=>{const v=o.v;return v?`<rect x="${cx-7}" y="${cy-13}" width="14" height="26" rx="4" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="${cx-16}" y="${cy-2}" width="10" height="4" fill="#c0281c"/>`:`<rect x="${cx-13}" y="${cy-7}" width="26" height="14" rx="4" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="${cx-2}" y="${cy-16}" width="4" height="9" fill="#6a4a12"/><rect x="${cx-12}" y="${cy-20}" width="24" height="5" rx="2" fill="${o.shut?"#c0281c":"#c0281c"}" transform="${o.shut?`rotate(90 ${cx} ${cy-17})`:""}"/>`};
/* cast iron radiator: x,y top-left, n columns */
B.rad=(x,y,n=6,h=70,hot=true)=>{let s=`<rect x="${x}" y="${y+h-8}" width="${n*14+6}" height="8" rx="3" fill="#8d969c"/>`;for(let i=0;i<n;i++)s+=`<rect x="${x+3+i*14}" y="${y}" width="12" height="${h}" rx="6" fill="url(#bkRad)" stroke="#6a7378" stroke-width=".8"/>`;
 return s+(hot?[0,1,2].map(k=>`<path d="M${x+14+k*((n*14-20)/2)} ${y-6} q-5 -8 0 -16 q5 -8 0 -16" stroke="#e0662a" stroke-width="1.8" fill="none" opacity=".75"/>`).join(""):"")};
/* gauge glass: x center, glass from y1 to y2, water surface at wy */
B.glass=(x,y1,y2,wy)=>`<rect x="${x-9}" y="${y1-8}" width="18" height="8" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="${x-9}" y="${y2}" width="18" height="8" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="${x-5}" y="${y1}" width="10" height="${y2-y1}" rx="3" fill="rgba(220,238,250,.9)" stroke="#5f686d"/><rect x="${x-4}" y="${Math.max(y1,Math.min(y2,wy))}" width="8" height="${Math.max(0,y2-Math.max(y1,Math.min(y2,wy)))}" fill="var(--cold)" opacity=".8"/><rect x="${x-3}" y="${y1+2}" width="2" height="${y2-y1-4}" fill="rgba(255,255,255,.7)"/>`;
/* pressuretrol on a pigtail */
B.ptrol=(cx,y,o={})=>`<rect x="${cx-2.5}" y="${y}" width="5" height="16" fill="url(#zBrass)"/><circle cx="${cx}" cy="${y-8}" r="8" fill="none" stroke="#7a5414" stroke-width="5"/><circle cx="${cx}" cy="${y-8}" r="8" fill="none" stroke="#c9a24a" stroke-width="3"/><rect x="${cx-2.5}" y="${y-30}" width="5" height="14" fill="url(#zBrass)"/><rect x="${cx-22}" y="${y-72}" width="44" height="44" rx="5" fill="url(#bkBlackV)" stroke="#000" filter="url(#zShadow)"/><rect x="${cx-16}" y="${y-66}" width="32" height="22" rx="2" fill="#f4f2ea"/><path d="M${cx-10} ${y-55} H${cx+10}" stroke="#333"/><path d="M${o.m??cx-4} ${y-63} v14" stroke="#c0281c" stroke-width="2"/>`;
/* float-type LWCO bowl beside a boiler: chamber from y1 to y2 at x, water at wy, float at fy */
B.lwcoFloat=(x,y1,y2,wy,fy,o={})=>{let s=`<rect x="${x-20}" y="${y1-36}" width="40" height="34" rx="5" fill="url(#bkBlackV)" stroke="#000" filter="url(#zShadow)"/><circle cx="${x-8}" cy="${y1-19}" r="4.5" fill="${o.on?"#2fbf5a":"#4b555b"}"/><circle cx="${x+8}" cy="${y1-19}" r="4.5" fill="${o.low?"#d0312d":"#4b555b"}"/>`;
 s+=`<rect x="${x-18}" y="${y1}" width="36" height="${y2-y1}" rx="16" fill="url(#zSteel)" stroke="#3f474c" filter="url(#zShadow)"/><rect x="${x-13}" y="${y1+6}" width="26" height="${y2-y1-12}" rx="12" fill="#22272a"/>`;
 const top=Math.max(y1+6,Math.min(y2-6,wy));s+=`<rect x="${x-13}" y="${top}" width="26" height="${y2-6-top}" fill="var(--cold)" opacity=".55"/>`;
 if(o.sludge)s+=`<path d="M${x-13} ${y2-6} V${y2-30} q6 -6 13 0 q7 6 13 0 V${y2-6} Z" fill="#6b5236"/>`;
 s+=`<path d="M${x} ${y1+4} V${fy-10}" stroke="#c9ced2" stroke-width="2"/><ellipse cx="${x}" cy="${fy}" rx="10" ry="10" fill="url(#zSteel)" stroke="#3f474c"/>`;
 s+=`<rect x="${x-6}" y="${y2}" width="12" height="12" fill="url(#zBrass)" stroke="#6a4a12"/>`+B.valve(x,y2+22,{shut:!o.blow});
 return s};
/* trap bodies: kind 0 thermostatic, 1 float and thermostatic, 2 inverted bucket, 3 thermodynamic disc. cx,cy center, s scale, st: "ok" | "open" | "closed" */
B.trap=(k,cx,cy,s=1,st="ok")=>{let g=`<g transform="translate(${cx} ${cy}) scale(${s})">`;
 const body=(w,h,f="url(#bkBlackV)")=>`<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${Math.min(w,h)*.22}" fill="${f}" stroke="#111" filter="url(#zShadow)"/>`;
 const win=(w,h)=>`<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="6" fill="#e9eef2" stroke="#3f474c"/>`;
 if(k===0){g+=body(70,54,"url(#zBrass)")+win(52,38)+`<path d="M-14 -10 h28 M-14 -4 h28 M-14 2 h28 M-14 8 h28" stroke="#8c6a1c" stroke-width="3"/><rect x="-16" y="-14" width="32" height="26" rx="5" fill="none" stroke="#6a4a12" stroke-width="1.5"/><path d="M0 12 V${st==="open"?16:st==="closed"?19:18}" stroke="#333" stroke-width="3"/><path d="M-6 ${st==="open"?17:19} H6" stroke="#6a4a12" stroke-width="2"/>`}
 if(k===1){g+=body(90,70)+win(72,52)+`<rect x="-36" y="4" width="72" height="18" fill="var(--cold)" opacity=".5"/><circle cx="-6" cy="${st==="closed"?12:st==="open"?-2:6}" r="12" fill="url(#zSteel)" stroke="#333"/><path d="M-6 ${st==="closed"?12:st==="open"?-2:6} L22 18" stroke="#333" stroke-width="2"/><rect x="18" y="-22" width="12" height="14" rx="3" fill="url(#zBrass)" stroke="#6a4a12"/>`}
 if(k===2){g+=body(64,86)+win(48,70)+`<rect x="-24" y="-20" width="48" height="55" fill="var(--cold)" opacity=".5"/><path d="M-14 ${st==="open"?24:12} v-34 h28 v34" stroke="#555" stroke-width="3" fill="url(#zSteel)"/><path d="M0 -26 V${st==="open"?-26:-22}" stroke="#333" stroke-width="2"/><circle cx="0" cy="-28" r="3" fill="#333"/>`}
 if(k===3){g+=body(76,40,"url(#zSteel)")+`<rect x="-26" y="-30" width="52" height="12" rx="3" fill="url(#zSteel)" stroke="#3f474c"/><rect x="-22" y="${st==="open"?-14:-18}" width="44" height="4" fill="#333"/>`}
 return g+`</g>`};
B.TRAPS=["Thermostatic","Float and thermostatic (F&T)","Inverted bucket","Thermodynamic (disc)"];
/* a flat panel box for a reading in a drawing */
B.box=(x,y,w,h,t,v,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--paper)" stroke="${o.st||"var(--panel-edge)"}" stroke-width="${o.st?2:1}"/>`+B.L(x+w/2,y+20,t,{fill:o.tc})+`<text x="${x+w/2}" y="${y+h-12}" class="lsBig" style="font-size:${o.vs||22}px${o.vc?";fill:"+o.vc:""}">${v}</text>`;
