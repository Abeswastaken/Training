/* ============ Ladder lesson kit: ladder symbols and rungs (same look as the Ladder Builder), series-rung voltages, realistic transformer and meter ============ */
const LD={};
LD.HOT="#d63a2f";LD.HOTF="rgba(214,58,47,.18)";LD.OFF="var(--ink)";LD.DIM="var(--muted)";
LD.L=(x,y,t,o={})=>K.lbl(x,y,t,{size:o.size||13,a:o.a,fill:o.fill});
LD.T=(x,y,t,o={})=>`<text x="${x}" y="${y}" style="font-family:var(--display);font-weight:600;letter-spacing:.04em;font-size:${o.size||11}px;text-anchor:${o.a||"middle"};fill:${o.fill||"var(--ink)"}">${t}</text>`;
LD.co=(px,py,lx,ly,t,o={})=>{const a=o.a||(lx<px?"end":"start");return `<path d="M${px} ${py} L${lx} ${ly}" stroke="var(--muted)" stroke-width="1.2" fill="none"/><circle cx="${px}" cy="${py}" r="2.6" fill="var(--muted)"/>`+LD.L(lx+(a==="end"?-4:a==="start"?4:0),ly+(o.dy??4),t,{a,fill:o.fill,size:o.size})};
LD.w=(x1,y1,x2,y2,on,w=3)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${on?LD.HOT:LD.OFF}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
/* ---------- symbols. Each fills a cell from x to x+W on the rung line y. p: {k, tag, lbl, sub, closed, on (wire left is hot), on2 (wire right is hot), act (load running), bad} ---------- */
LD.sym=(p,x,W,y)=>{const cx=x+W/2,cl=p.closed!==false,c1=p.on?LD.HOT:LD.OFF,c2=(p.on2??p.on)?LD.HOT:LD.OFF,k=p.k;let s="";
 const wl=(a)=>`<path d="M${x} ${y} H${cx-a}" stroke="${c1}" stroke-width="3"/>`,wr=(a)=>`<path d="M${cx+a} ${y} H${x+W}" stroke="${c2}" stroke-width="3"/>`;
 const tag=(t,dy=-20,f)=>t?LD.T(cx,y+dy,t,{fill:f}):"";
 const lbl=(t,dy=30,f)=>!t?"":p.side&&LD.isLoad(k)?(dy>0?LD.T(cx-27,y-7,t,{size:10.5,a:"end",fill:f||"var(--ink)"}):""):LD.T(cx,y+dy,t,{size:10.5,fill:f||"var(--ink)"});
 if(k==="no"||k==="nc"||k==="td"||k==="tdnc"){s+=wl(9)+wr(9)+`<path d="M${cx-9} ${y-12} V${y+12} M${cx+9} ${y-12} V${y+12}" stroke="${c1}" stroke-width="3"/>`;
  if(k==="nc"||k==="tdnc"){if(cl)s+=`<path d="M${cx-14} ${y+12} L${cx+14} ${y-12}" stroke="${c1}" stroke-width="2.4"/>`}
  else if(cl)s+=`<path d="M${cx-9} ${y} H${cx+9}" stroke="${c1}" stroke-width="2.4"/>`;
  if(k==="td"||k==="tdnc")s+=`<path d="M${cx-9} ${y-16} q9 -8 18 0" stroke="${c1}" stroke-width="1.6" fill="none"/>`;
  s+=tag(p.tag,k==="td"||k==="tdnc"?-27:-18)+lbl(p.lbl,30,p.bad?"var(--bad)":null)+lbl(p.sub,43,"var(--muted)")}
 else if(k==="sw"||k==="ps"||k==="ts"||k==="psno"||k==="fs"){/* switch: closed blade flat, open blade lifted. ps = pressure, ts = thermal, fs = flame */
  const by=cl?y-1:y-15;s+=wl(18)+wr(18)+`<circle cx="${cx-16}" cy="${y}" r="3" fill="${c1}"/><circle cx="${cx+16}" cy="${y}" r="3" fill="${c2}"/><path d="M${cx-16} ${y} L${cx+18} ${by}" stroke="${c1}" stroke-width="3"/>`;
  if(k==="ps"||k==="psno")s+=`<path d="M${cx} ${(y+by)/2+1} V${y+10} M${cx-8} ${y+10} h16" stroke="${c1}" stroke-width="2" fill="none"/>`;
  if(k==="ts")s+=`<path d="M${cx} ${(y+by)/2+1} V${y+6} l-6 3 l12 4 l-6 3" stroke="${c1}" stroke-width="1.8" fill="none"/>`;
  if(k==="fs")s+=`<path d="M${cx} ${y+16} c-6 -4 -4 -10 0 -14 c4 4 6 10 0 14z" fill="none" stroke="${c1}" stroke-width="1.6"/>`;
  s+=lbl(p.lbl,k==="sw"?24:32,p.bad?"var(--bad)":null)+lbl(p.sub,k==="sw"?37:45,"var(--muted)")}
 else if(k==="coil"){s+=wl(17)+wr(17)+`<circle cx="${cx}" cy="${y}" r="17" fill="${p.act?LD.HOTF:"var(--paper)"}" stroke="${c1}" stroke-width="3"/>`+LD.T(cx,y+4,p.tag||"CR",{size:12})+lbl(p.lbl,32)}
 else if(k==="motor"){s+=wl(17)+wr(17)+`<circle cx="${cx}" cy="${y}" r="17" fill="${p.act?LD.HOTF:"var(--paper)"}" stroke="${c1}" stroke-width="3"/>`+LD.T(cx,y+5,"M",{size:15})+lbl(p.lbl||p.tag,32,p.act?LD.HOT:null)}
 else if(k==="heat"){s+=wl(22)+wr(22)+`<path d="M${cx-22} ${y} l3 -9 l6 18 l6 -18 l6 18 l6 -18 l6 18 l6 -18 l3 9" stroke="${p.act?"#ff6a1f":c1}" stroke-width="3" fill="none" stroke-linejoin="round"/>`+lbl(p.lbl||p.tag,28,p.act?"#e0661f":null)}
 else if(k==="valve"){s+=wl(18)+wr(18)+`<rect x="${cx-18}" y="${y-13}" width="36" height="26" fill="${p.act?LD.HOTF:"var(--paper)"}" stroke="${c1}" stroke-width="3"/><path d="M${cx-13} ${y} q3 -8 6.5 0 q3 8 6.5 0 q3 -8 6.5 0 q3 8 6.5 0" stroke="${c1}" stroke-width="1.8" fill="none"/>`+lbl(p.lbl||p.tag,30,p.act?LD.HOT:null)}
 else if(k==="lamp"){s+=wl(15)+wr(15)+`<circle cx="${cx}" cy="${y}" r="15" fill="${p.act?"#ffd34d":"var(--paper)"}" stroke="${c1}" stroke-width="3"/><path d="M${cx-10} ${y-10} l20 20 M${cx+10} ${y-10} l-20 20" stroke="${c1}" stroke-width="2"/>`+lbl(p.lbl||p.tag,30)}
 else if(k==="fuse"){s+=wl(20)+wr(20)+`<rect x="${cx-20}" y="${y-8}" width="40" height="16" rx="3" fill="var(--paper)" stroke="${c1}" stroke-width="2.4"/>`+(cl?`<path d="M${cx-18} ${y} q9 -9 18 0 t18 0" stroke="${c1}" stroke-width="2" fill="none"/>`:`<path d="M${cx-18} ${y} h10 l4 -5 M${cx+18} ${y} h-10 l-4 5" stroke="var(--bad)" stroke-width="2" fill="none"/>`)+lbl(p.lbl||"FUSE",26,cl?null:"var(--bad)")}
 else if(k==="xfmr"){let d=`M${cx-20} ${y-3}`;for(let i=0;i<4;i++)d+=` a5 5 0 0 1 10 0`;let d2=`M${cx-20} ${y+11}`;for(let i=0;i<4;i++)d2+=` a5 5 0 0 0 10 0`;
  s+=wl(20)+wr(20)+`<path d="M${cx-20} ${y} V${y-3} M${cx+20} ${y} V${y-3}" stroke="${c1}" stroke-width="2.5"/><path d="${d}" stroke="${c1}" stroke-width="2.5" fill="none"/><path d="M${cx-20} ${y+3} H${cx+20} M${cx-20} ${y+6.5} H${cx+20}" stroke="var(--ink)" stroke-width="1.6"/><path d="${d2}" stroke="${p.act?LD.HOT:"var(--ink)"}" stroke-width="2.5" fill="none"/>`+(p.side?LD.T(cx-27,y-7,p.lbl||"T1",{size:10.5,a:"end"}):LD.T(cx,y-12,p.lbl||"T1",{size:10.5}))+lbl(p.sub,34,"var(--muted)")}
 else if(k==="board"){s+=wl(30)+wr(30)+`<rect x="${cx-30}" y="${y-14}" width="60" height="28" rx="3" fill="${p.act?LD.HOTF:"var(--paper)"}" stroke="${c1}" stroke-width="2.5"/>`+LD.T(cx,y+4,p.tag||"BOARD",{size:11})+lbl(p.lbl,30)}
 else s+=`<path d="M${x} ${y} H${x+W}" stroke="${c1}" stroke-width="3"/>`;
 return s};
LD.isLoad=k=>["coil","motor","heat","valve","lamp","xfmr","board"].includes(k);
/* lay out a rung: switches packed from the left, the load pushed to the right. o: {x1,x2,y,parts,live,num,xref:[[n,nc]],sw:W of switch cells,lw:W of load cell}
 returns {s, nodes:[x...] (test points between parts, first = left rail, last = right rail), hotTo, act} */
LD.rung=o=>{const P=o.parts,sw=o.sw||84,lw=o.lw||84,li=P.findIndex(p=>LD.isLoad(p.k));const n=P.length;
 let firstOpen=-1;for(let i=0;i<n;i++){if(i===li)continue;if(P[i].closed===false){firstOpen=i;break}}
 const act=!!o.live&&firstOpen<0&&li>=0&&!P[li].dead;
 const xs=[];let x=o.x1+(o.pad??10);for(let i=0;i<n;i++){if(i===li){xs.push(o.x2-(o.padR??10)-lw)}else{xs.push(x);x+=sw}}
 let s="";const hotAt=i=>!!o.live&&(act||firstOpen<0?(i<=li||act):i<=firstOpen);
 /* wire from the rail to the first cell, between cells, and to the right rail */
 const ends=P.map((p,i)=>[xs[i],xs[i]+(i===li?lw:sw)]);
 const seg=(a,b,on)=>b>a+0.5?`<path d="M${a} ${o.y} H${b}" stroke="${on?LD.HOT:LD.OFF}" stroke-width="3"/>`:"";
 s+=seg(o.x1,ends[0][0],!!o.live);
 for(let i=0;i<n;i++){if(o.side)P[i]={...P[i],side:true};const on=hotAt(i),on2=i===li?act:(o.live&&(act||(firstOpen<0||i<firstOpen)));const p={...P[i],on:i===li?(act||(o.live&&firstOpen<0)):on,on2:i===li?act:on2,act:i===li?act:undefined};
  s+=LD.sym(p,ends[i][0],ends[i][1]-ends[i][0],o.y);if(i<n-1)s+=seg(ends[i][1],ends[i+1][0],i===li?act:on2)}
 s+=seg(ends[n-1][1],o.x2,act);
 if(o.num!=null)s+=LD.T(o.x1-16,o.y+4,o.num,{size:12,fill:"var(--muted)",a:"end"});
 if(o.xref)s+=LD.xref(o.x2+12,o.y+4,o.xref);
 if(o.hl)s+=`<rect x="${o.x1+4}" y="${o.y-(o.hlUp??30)}" width="${o.x2-o.x1-8}" height="${(o.hlUp??30)+(o.hlDn??14)}" rx="6" fill="none" stroke="var(--brass)" stroke-width="2" stroke-dasharray="6 4"/>`;
 const nodes=[o.x1];for(let i=0;i<n-1;i++)nodes.push((ends[i][1]+ends[i+1][0])/2);nodes.push(o.x2);
 return {s,nodes,act,firstOpen,ends}};
/* cross-reference numbers beside the right rail: NO plain, NC underlined */
LD.xref=(x,y,list)=>{let s="",cx=x;list.forEach(([n,nc],i)=>{const t=String(n)+(i<list.length-1?",":"");const w=t.length*7.4;
 s+=`<text x="${cx}" y="${y}" style="font-family:var(--mono);font-size:12px;fill:var(--brass);text-anchor:start">${t}</text>`+(nc?`<path d="M${cx} ${y+3} h${String(n).length*7.2}" stroke="var(--brass)" stroke-width="1.4"/>`:"");cx+=w+4});return s};
/* the two rails with their labels */
LD.rails=(x1,x2,yt,yb,o={})=>`<path d="M${x1} ${yt} V${yb}" stroke="${o.live?LD.HOT:"var(--muted)"}" stroke-width="5"/><path d="M${x2} ${yt} V${yb}" stroke="var(--ink)" stroke-width="5"/>`+LD.T(x1,yt-8,o.l||"L1",{size:12,fill:o.live?LD.HOT:"var(--muted)"})+LD.T(x2,yt-8,o.r||"L2",{size:12});
/* ---------- series rung physics: node voltages (to the right rail) for a rung with AC impedances ----------
 parts: [{r (ohms), x (reactance, ohms)}], open contact r = 1e9. Returns {I (A), v:[node voltages from left rail to right rail], drop:[volts across each part]} */
LD.series=(V,parts)=>{let R=0,X=0;parts.forEach(p=>{R+=p.r;X+=p.x||0});const Z=Math.hypot(R,X);const I=Z>0?V/Z:Infinity;
 /* phasor current I at angle -atan(X/R); voltage to the right rail from node k is I * (sum of the impedances to its right) */
 const v=[];for(let k=0;k<=parts.length;k++){let r=0,x=0;for(let j=k;j<parts.length;j++){r+=parts[j].r;x+=parts[j].x||0}v.push(I*Math.hypot(r,x))}
 const drop=parts.map(p=>I*Math.hypot(p.r,p.x||0));return {I,v,drop,Z}};
/* ---------- realistic parts ---------- */
/* control transformer on a mounting plate. o: {hot (primary powered), out (secondary powered), va, pri} at (x,y) top-left, about 200 x 150 */
LD.xfmrReal=(x,y,o={})=>{let s=rSh(x+100,y+152,110,7);
 s+=rBox(x,y+92,200,46,10,"galv");/* foot plate */
 s+=`<rect x="${x+30}" y="${y+10}" width="140" height="92" rx="3" fill="url(#zLam)" stroke="#22272a"/>`;
 for(let i=0;i<14;i++)s+=`<path d="M${x+31} ${y+14+i*6.3} H${x+169}" stroke="#2c3236" stroke-width=".7" opacity=".7"/>`;
 s+=`<rect x="${x+56}" y="${y+2}" width="88" height="96" rx="8" fill="url(#zWind)" stroke="#5a2e10"/><rect x="${x+56}" y="${y+2}" width="88" height="96" rx="8" fill="url(#rGlass)" opacity=".5"/>`;
 s+=`<rect x="${x+50}" y="${y+40}" width="100" height="22" rx="2" fill="#f2f0e6" stroke="#8a8778"/>`+`<text x="${x+100}" y="${y+50}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#2a2f33">CLASS 2 · ${o.va||40} VA</text><text x="${x+100}" y="${y+59}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" fill="#2a2f33">PRI ${o.pri||"120/208/240"} V · SEC 24 V</text>`;
 [x+16,x+184].forEach(fx=>s+=rBolt(fx,y+112,3));
 return s};
/* leads leaving the transformer. side: "l" or "r" */
LD.lead=(d,col,w=4)=>rHose(d,col,w);
/* digital multimeter. o: {x,y, txt, mode: "V"|"O", unit} about 110 x 170 */
LD.meter=(x,y,o={})=>{let s=rSh(x+55,y+176,60,6)+`<rect x="${x}" y="${y}" width="110" height="170" rx="14" fill="url(#r_yelF)" stroke="#6a4a00"/><rect x="${x+8}" y="${y+8}" width="94" height="154" rx="9" fill="url(#r_blackF)"/>`;
 s+=`<rect x="${x+16}" y="${y+16}" width="78" height="38" rx="3" fill="#15191c" stroke="#3a4247"/><text x="${x+88}" y="${y+44}" text-anchor="end" font-family="var(--mono)" font-size="18" fill="#7CFFB2">${o.txt??"0.0"}</text><text x="${x+20}" y="${y+28}" font-family="var(--mono)" font-size="8" fill="#7CFFB2">${o.mode==="O"?"Ω":"V AC"}</text>`;
 const a=o.mode==="O"?40:-40;s+=`<circle cx="${x+55}" cy="${y+96}" r="24" fill="url(#r_chromeV)" stroke="#111"/><circle cx="${x+55}" cy="${y+96}" r="17" fill="#22272a"/><path d="M${x+55} ${y+96} L${x+55+15*Math.sin(a*Math.PI/180)} ${y+96-15*Math.cos(a*Math.PI/180)}" stroke="#f2b632" stroke-width="4" stroke-linecap="round"/>`;
 s+=`<text x="${x+30}" y="${y+70}" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="${o.mode==="O"?"#9aa3a8":"#f2b632"}">V~</text><text x="${x+80}" y="${y+70}" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="${o.mode==="O"?"#f2b632":"#9aa3a8"}">Ω</text>`;
 s+=`<circle cx="${x+35}" cy="${y+142}" r="7" fill="#111" stroke="#555"/><circle cx="${x+75}" cy="${y+142}" r="7" fill="#7a1410" stroke="#555"/><text x="${x+35}" y="${y+160}" text-anchor="middle" font-family="var(--mono)" font-size="7" fill="#ccc">COM</text><text x="${x+75}" y="${y+160}" text-anchor="middle" font-family="var(--mono)" font-size="7" fill="#ccc">V Ω</text>`;
 return s};
LD.mjack=(x,y,red)=>[x+(red?75:35),y+142];
/* test lead from a jack to a probe point, with a probe tip */
LD.probe=(x1,y1,x2,y2,red,yb)=>{const col=red?"#c0281c":"#1d2124";const my=yb??Math.max(y1,y2)+40;const sx=x2>x1?1:-1,r=Math.min(12,Math.abs(x2-x1)/2);return rHose(`M${x1} ${y1} V${my-r} Q${x1} ${my} ${x1+sx*r} ${my} H${x2-sx*r} Q${x2} ${my} ${x2} ${my-r} V${y2+16}`,col,3.4)+`<rect x="${x2-4}" y="${y2+4}" width="8" height="14" rx="2" fill="${col}"/><path d="M${x2} ${y2+4} V${y2}" stroke="#c9ced1" stroke-width="2.4"/>`};
/* numbered test point on a rung */
LD.tp=(x,y,n,o={})=>`<circle cx="${x}" cy="${y}" r="${o.sel?9:7}" fill="${o.sel?(o.red?"#d0312d":"#1d2327"):"var(--paper)"}" stroke="${o.sel?"var(--paper)":"var(--brass)"}" stroke-width="2"/>`+LD.T(x+(o.dx||0),y-13,n,{size:11,fill:"var(--brass)"});
/* ---------- the condensing unit + air handler ladder used in Reading and in the sequence cards ---------- */
LD.acModel=S=>{const call=S.call||0;/* 0 off, 1 fan, 2 cool */
 const G=call>=1,Y=call>=2,hps=!S.hps,lps=!S.lps,live=!S.nopower;
 const CR=live&&Y&&hps&&lps,FR=live&&G;
 const crc1=CR&&!S.burnt;/* rung 1 contact can be burnt open */
 return {G,Y,hps,lps,live,CR,FR,comp:live&&crc1&&!S.compdead,ofm:live&&CR,cch:live&&!CR,ibm:live&&FR}};
LD.acLadder=(R,S,o={})=>{if(o.paper){S={call:0};R=LD.acModel({call:0,nopower:true})}const X1=o.x1??70,X2=o.x2??600,y0=o.y0??62,dy=o.dy??44,hl=o.hl||"";let s="";
 const yL=k=>y0+k*dy,yLo=k=>y0+4*dy+(o.gap??70)+k*dy;
 s+=LD.rails(X1,X2,y0-26,yL(4)+22,{l:"L1 240 V",r:"L2",live:R.live});
 const rr=(i,y,parts,xref,on)=>LD.rung({x1:X1,x2:X2,y,parts,live:on,num:i,xref,side:true,hlUp:i>=6?28:28,hlDn:i>=6?40:13,hl:hl===String(i)||(o.hlr||[]).includes(i)}).s;
 s+=rr(1,yL(0),[{k:"no",tag:"CR",closed:R.CR&&!S.burnt},{k:"motor",lbl:"COMP"}],null,R.live);
 s+=rr(2,yL(1),[{k:"no",tag:"CR",closed:R.CR},{k:"motor",lbl:"OFM"}],null,R.live);
 s+=rr(3,yL(2),[{k:"nc",tag:"CR",closed:!R.CR},{k:"heat",lbl:"CCH"}],null,R.live);
 s+=rr(4,yL(3),[{k:"no",tag:"FR",closed:R.FR},{k:"motor",lbl:"IBM"}],null,R.live);
 s+=rr(5,yL(4),[{k:"xfmr",lbl:"T1",sub:"",act:R.live}],null,R.live);
 s+=LD.rails(X1,X2,yLo(0)-26,yLo(1)+22,{l:"R 24 V",r:"C",live:R.live});
 s+=rr(6,yLo(0),[{k:"sw",lbl:"T'STAT Y",closed:R.Y},{k:"ps",lbl:"HPS",closed:R.hps,bad:!R.hps},{k:"ps",lbl:"LPS",closed:R.lps,bad:!R.lps},{k:"coil",tag:"CR"}],[[1],[2],[3,1]],R.live);
 s+=rr(7,yLo(1),[{k:"sw",lbl:"T'STAT G",closed:R.G},{k:"coil",tag:"FR"}],[[4]],R.live);
 return s};
