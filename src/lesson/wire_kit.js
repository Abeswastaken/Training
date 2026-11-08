/* ============ Wiring lesson kit: realistic parts (contactor, meter, clamp, capacitors, compressor), ladder symbols, wires ============
 Same terms and numbers as the Wiring Board trainer (src/wiring.js): 240 V L1/L2, 24 V R/C from a 40 VA transformer, 5 kW heater 11.5 ohm, dual cap 45/5 uF. */
const WK={};
WK.C={blk:"#22272b",red:"#c8322a",wht:"#f1f1ec",grn:"#2f9a46",yel:"#e2b822",blu:"#2f6fd6",org:"#e07a22",brn:"#7a4a25",gry:"#8d979c",pur:"#7a5cd0"};
WK.HOT="#d23a26";WK.LV="#2f6fd6";
/* gradients: every drawing calls WK.defs() first */
/* one shared, always-rendered defs block: a gradient inside a hidden tab's SVG (display:none) would not paint in the visible one */
WK.DEFS=`<defs>
<linearGradient id="wkM" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#858e94"/><stop offset=".42" stop-color="#e6eaec"/><stop offset=".6" stop-color="#cfd5d8"/><stop offset="1" stop-color="#737c82"/></linearGradient>
<linearGradient id="wkMV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe3e6"/><stop offset="1" stop-color="#9aa2a8"/></linearGradient>
<linearGradient id="wkPl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f6f2"/><stop offset="1" stop-color="#cdd0cc"/></linearGradient>
<linearGradient id="wkDk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2f33"/><stop offset=".45" stop-color="#5a6268"/><stop offset="1" stop-color="#22272a"/></linearGradient>
<linearGradient id="wkDkV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c545a"/><stop offset="1" stop-color="#23282c"/></linearGradient>
<linearGradient id="wkY" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4c838"/><stop offset="1" stop-color="#c38f16"/></linearGradient>
<linearGradient id="wkCu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a4a1f"/><stop offset=".5" stop-color="#e5a066"/><stop offset="1" stop-color="#8a4a1f"/></linearGradient>
<linearGradient id="wkBr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0d27a"/><stop offset="1" stop-color="#9a7420"/></linearGradient>
<linearGradient id="wkLcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3dcc4"/><stop offset="1" stop-color="#b4c0a2"/></linearGradient>
<radialGradient id="wkDome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#5c656b"/><stop offset="1" stop-color="#1f2427"/></radialGradient>
<linearGradient id="wkCer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3efe4"/><stop offset="1" stop-color="#c9c1ad"/></linearGradient>
</defs>`;
WK.defs=()=>{try{if(!document.getElementById("wkDefs")){const d=document.createElement("div");d.innerHTML=`<svg id="wkDefs" width="0" height="0" style="position:absolute;left:0;top:0" aria-hidden="true" focusable="false">${WK.DEFS}</svg>`;document.body.appendChild(d.firstChild)}}catch(e){}return ""};
/* text on a part (fixed dark or light color so it reads in both themes) */
WK.t=(x,y,s,o={})=>`<text x="${x}" y="${y}" style="font-family:${o.mono?"var(--mono)":"var(--display)"};font-weight:${o.w||600};font-size:${o.size||11}px;fill:${o.fill||"#1d2327"};text-anchor:${o.a||"middle"};letter-spacing:.04em">${s}</text>`;
/* a wire: colored core with a darker edge so white and black wires both show on paper and in dark mode */
WK.w=(d,c,w=4)=>{const edge=c===WK.C.blk?"#7d878d":c===WK.C.wht?"#7d868c":"rgba(0,0,0,.35)";return `<path d="${d}" fill="none" stroke="${edge}" stroke-width="${w+2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`};
/* current flowing: moving dashes on top of a wire */
WK.flow=(d,on,w=4)=>on?`<path class="lsFlow" d="${d}" fill="none" stroke="#fff" stroke-width="${Math.max(1.2,w*.4)}" stroke-dasharray="4 10" opacity=".85" stroke-linecap="round"/>`:"";
/* screw terminal */
WK.screw=(x,y,r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#wkBr)" stroke="#6b5212"/><path d="M${x-r*.6} ${y} H${x+r*.6}" stroke="#6b5212" stroke-width="1.4"/>`;
/* leader line callout: dot on the part, line to the text */
WK.co=(x1,y1,x2,y2,t,o={})=>`<circle cx="${x1}" cy="${y1}" r="2.6" fill="var(--ink)"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="var(--ink)" stroke-width="1" opacity=".7"/>`+K.lbl(x2+(o.a==="start"?4:o.a==="end"?-4:0),y2+(o.dy??5),t,{a:o.a||"middle",size:o.size||13,fill:o.fill});
WK.g=(x,y,s,inner)=>`<g transform="translate(${x} ${y})${s&&s!==1?` scale(${s})`:""}">${inner}</g>`;

/* ---------- contactor (2-pole definite purpose), local box 130 x 170. anchors WK.CT ---------- */
WK.CT={L1:[38,14],L2:[92,14],T1:[38,156],T2:[92,156],A1:[4,92],A2:[126,92]};
WK.contactor=(x,y,o={})=>{const s=o.s||1,inn=!!o.in;let g=`<rect x="-8" y="30" width="146" height="110" rx="4" fill="url(#wkMV)" stroke="#6d767c"/><circle cx="2" cy="40" r="4" fill="#5d666c"/><circle cx="128" cy="130" r="4" fill="#5d666c"/>`;
 g+=`<rect x="12" y="0" width="106" height="170" rx="7" fill="url(#wkPl)" stroke="#8c918f" stroke-width="1.4"/>`;
 [[38,"L1"],[92,"L2"]].forEach(([cx,l])=>{g+=`<rect x="${cx-16}" y="2" width="32" height="26" rx="3" fill="#3a4146"/>`+WK.screw(cx,14,7)+WK.t(cx,42,l,{size:11})});
 [[38,"T1"],[92,"T2"]].forEach(([cx,l])=>{g+=`<rect x="${cx-16}" y="142" width="32" height="26" rx="3" fill="#3a4146"/>`+WK.screw(cx,155,7)+WK.t(cx,136,l,{size:11})});
 const pc=o.pit?"#3b2a1a":"#c9a24a";
 g+=`<rect x="30" y="52" width="70" height="70" rx="4" fill="#2a2f33"/><rect x="34" y="${inn?84:62}" width="62" height="14" rx="2" fill="#e9e6dc" stroke="#888"/>`+WK.t(65,inn?95:73,inn?"IN":"OUT",{size:9})+`<rect x="40" y="${inn?100:110}" width="10" height="6" fill="${pc}"/><rect x="80" y="${inn?100:110}" width="10" height="6" fill="${pc}"/>`;
 g+=`<rect x="0" y="86" width="14" height="12" rx="2" fill="url(#wkBr)" stroke="#6b5212"/><rect x="116" y="86" width="14" height="12" rx="2" fill="url(#wkBr)" stroke="#6b5212"/>`;
 g+=WK.t(65,130,o.lab||"24 V COIL",{size:8,w:500,fill:"#4a5257"});
 return WK.g(x,y,s,g)};
WK.cpt=(x,y,s,k)=>[x+WK.CT[k][0]*s,y+WK.CT[k][1]*s];

/* ---------- relay (SPDT, plug-in cube), local 90 x 110. anchors ---------- */
WK.RT={A1:[18,104],A2:[72,104],COM:[45,104],NO:[45,6],NC:[72,6]};
WK.relay=(x,y,o={})=>{const s=o.s||1;let g=`<rect x="0" y="12" width="90" height="86" rx="5" fill="#d8dde6" fill-opacity=".92" stroke="#7c8693"/>`;
 g+=`<rect x="14" y="40" width="30" height="44" rx="3" fill="url(#wkCu)"/>`+WK.t(29,96,"COIL",{size:8});
 const sw=o.on?`M54 70 L70 48`:`M54 70 L72 32`;
 g+=`<path d="M54 92 V70" stroke="#555" stroke-width="2"/><path d="${o.on?"M54 70 L54 30":"M54 70 L72 30"}" stroke="#b08a2a" stroke-width="3"/><circle cx="54" cy="26" r="3" fill="#888"/><circle cx="72" cy="26" r="3" fill="#888"/>`;
 [[18,104,"A1"],[72,104,"A2"],[45,104,"COM"]].forEach(([a,b])=>{g+=`<rect x="${a-4}" y="${b-8}" width="8" height="12" fill="url(#wkBr)"/>`});
 [[45,6],[72,6]].forEach(([a,b])=>{g+=`<rect x="${a-4}" y="${b-4}" width="8" height="12" fill="url(#wkBr)"/>`});
 return WK.g(x,y,s,g)};

/* ---------- digital multimeter, local 150 x 250. mode: off,V,O,B (continuity),F (uF),A ---------- */
WK.MODES={off:-120,V:-60,O:-15,B:20,F:60,A:115};
WK.meter=(x,y,o={})=>{const s=o.s||1,m=o.mode||"V",ang=WK.MODES[m]??-60;let g=`<rect x="0" y="0" width="150" height="250" rx="20" fill="url(#wkY)" stroke="#8f6a0e"/><rect x="12" y="12" width="126" height="226" rx="12" fill="#2b3034"/>`;
 g+=`<rect x="22" y="22" width="106" height="50" rx="4" fill="url(#wkLcd)" stroke="#111"/>`+WK.t(122,62,o.txt??"0.0",{mono:1,size:o.tsz||22,a:"end",fill:"#111"})+WK.t(28,34,o.unit||"",{size:9,a:"start",fill:"#111"});
 if(o.beep)g+=`<path d="M34 50 q6 -8 0 -16 M40 54 q10 -12 0 -24" stroke="#111" stroke-width="1.6" fill="none"/>`;
 g+=`<circle cx="75" cy="135" r="34" fill="#1b1f22" stroke="#555"/><g transform="rotate(${ang} 75 135)"><rect x="70" y="100" width="10" height="44" rx="5" fill="#e3e6e8"/><path d="M75 104 V116" stroke="#d0312d" stroke-width="3"/></g>`;
 const lab=[["OFF",-120],["V~",-60],["Ω",-15],["•)))",20],["µF",60],["A",115]];
 lab.forEach(([l,a])=>{const r=a*Math.PI/180,tx=75+50*Math.sin(r),ty=139-50*Math.cos(r);g+=WK.t(tx.toFixed(1),ty.toFixed(1),l,{size:10,fill:l===({off:"OFF",V:"V~",O:"Ω",B:"•)))",F:"µF",A:"A"})[m]?"#ffd54a":"#e9ecee"})});
 g+=`<circle cx="40" cy="206" r="8" fill="#111" stroke="#c8322a" stroke-width="2"/><circle cx="75" cy="206" r="8" fill="#111" stroke="#888" stroke-width="2"/><circle cx="110" cy="206" r="8" fill="#111" stroke="#c8322a" stroke-width="2"/>`+WK.t(40,229,"A",{size:9,fill:"#e9ecee"})+WK.t(75,229,"COM",{size:9,fill:"#e9ecee"})+WK.t(110,229,"VΩ",{size:9,fill:"#e9ecee"});
 if(o.cat)g+=WK.t(75,90,o.cat,{size:8,fill:"#e9ecee",w:500});
 return WK.g(x,y,s,g)};
WK.MJ={COM:[75,206],V:[110,206],A:[40,206]};
/* test lead from a meter jack (absolute jx,jy) to a probe tip at (tx,ty). up: probe points up (tip above body) */
WK.lead=(jx,jy,tx,ty,col,o={})=>{const up=!!o.up,by=up?ty+14:ty-14,bt=up?ty+50:ty-50;const ey=up?bt+0:bt;
 const d=`M${jx} ${jy} C${jx} ${jy+(o.sag??80)} ${tx} ${ey+(up?90:-90)*(o.k??1)} ${tx} ${ey}`;
 return `<path d="${d}" fill="none" stroke="${col==="red"?"#b8221c":"#1b1f22"}" stroke-width="4" stroke-linecap="round"/>`+
 `<rect x="${tx-6}" y="${Math.min(by,bt)}" width="12" height="${Math.abs(bt-by)}" rx="4" fill="${col==="red"?"#c8322a":"#23282c"}" stroke="#111"/><path d="M${tx} ${by} V${ty}" stroke="#c9ced2" stroke-width="2.6" stroke-linecap="round"/>`};
/* clamp meter, local 110 x 270, jaws closed around a wire at local (55,40) */
WK.clamp=(x,y,o={})=>{const s=o.s||1;let g=`<path d="M20 92 C8 60 14 18 55 10 C96 18 102 60 90 92 Z" fill="none" stroke="#c38f16" stroke-width="14" stroke-linejoin="round"/><path d="M20 92 C8 60 14 18 55 10 C96 18 102 60 90 92" fill="none" stroke="#2b3034" stroke-width="5"/>`;
 g+=`<rect x="6" y="84" width="98" height="186" rx="16" fill="url(#wkY)" stroke="#8f6a0e"/><rect x="16" y="96" width="78" height="164" rx="10" fill="#2b3034"/><rect x="24" y="106" width="62" height="38" rx="3" fill="url(#wkLcd)" stroke="#111"/>`+WK.t(82,134,o.txt??"0.0",{mono:1,size:16,a:"end",fill:"#111"})+WK.t(28,116,"A~",{size:8,a:"start",fill:"#111"});
 g+=`<circle cx="55" cy="190" r="24" fill="#1b1f22" stroke="#555"/><rect x="51" y="166" width="8" height="30" rx="4" fill="#e3e6e8" transform="rotate(60 55 190)"/>`+WK.t(55,244,"CLAMP",{size:9,fill:"#e9ecee"});
 return WK.g(x,y,s,g)};

/* ---------- dual run capacitor, local 100 x 160. anchors WK.CP ---------- */
WK.CP={HERM:[24,14],C:[50,10],FAN:[76,14]};
WK.cap=(x,y,o={})=>{const s=o.s||1,lab=o.lab||["45 + 5 µF","±6%  440 VAC"];let g=`<rect x="0" y="26" width="100" height="130" rx="4" fill="url(#wkM)" stroke="#5d666c"/><ellipse cx="50" cy="156" rx="50" ry="9" fill="#7d868c"/>`;
 g+=o.bulge?`<path d="M0 30 Q50 -6 100 30 Q50 44 0 30Z" fill="#cdd3d6" stroke="#5d666c"/>`:`<ellipse cx="50" cy="28" rx="50" ry="11" fill="#d7dcdf" stroke="#5d666c"/>`;
 const dy=o.bulge?-10:0;
 [[24,"#c8322a"],[50,"#777"],[76,"#c8322a"]].forEach(([cx],i)=>{g+=`<rect x="${cx-7}" y="${12+dy+(i===1?-4:0)}" width="14" height="14" rx="2" fill="url(#wkBr)" stroke="#6b5212"/>`});
 g+=`<rect x="8" y="58" width="84" height="66" rx="3" fill="#f2f0e8" stroke="#9a9a90"/>`+WK.t(50,74,"HERM  C  FAN",{size:9,fill:"#333"})+WK.t(50,94,lab[0],{size:13,w:700})+WK.t(50,112,lab[1],{size:9});
 return WK.g(x,y,s,g)};
WK.cpp=(x,y,s,k)=>[x+WK.CP[k][0]*s,y+WK.CP[k][1]*s];
/* start capacitor (black bakelite can), local 70 x 120 */
WK.startCap=(x,y,o={})=>{const s=o.s||1;let g=`<rect x="0" y="16" width="70" height="104" rx="6" fill="url(#wkDk)" stroke="#111"/><ellipse cx="35" cy="18" rx="35" ry="9" fill="#3a4146" stroke="#111"/><rect x="16" y="4" width="10" height="14" fill="url(#wkBr)"/><rect x="44" y="4" width="10" height="14" fill="url(#wkBr)"/>`;
 g+=`<rect x="6" y="46" width="58" height="44" rx="2" fill="#e8e3d2"/>`+WK.t(35,62,o.uf||"88-108 µF",{size:10,w:700})+WK.t(35,78,"330 VAC",{size:9});
 return WK.g(x,y,s,g)};
/* potential relay, local 90 x 80, terminals 1 2 5 on top */
WK.PR={"1":[18,6],"2":[45,6],"5":[72,6]};
WK.potRelay=(x,y,o={})=>{const s=o.s||1;let g=`<rect x="0" y="12" width="90" height="68" rx="5" fill="url(#wkDkV)" stroke="#111"/>`;
 ["1","2","5"].forEach(k=>{const [a]=WK.PR[k];g+=`<rect x="${a-6}" y="0" width="12" height="16" fill="url(#wkBr)" stroke="#6b5212"/>`+WK.t(a,32,k,{size:12,fill:"#e9ecee"})});
 g+=WK.t(45,58,"POTENTIAL",{size:9,fill:"#e9ecee"})+WK.t(45,70,"RELAY",{size:9,fill:"#e9ecee"});return WK.g(x,y,s,g)};
/* hermetic compressor, local 150 x 190, terminal pins C S R at WK.KP */
WK.KP={C:[54,96],S:[75,76],R:[96,96]};
WK.comp=(x,y,o={})=>{const s=o.s||1;let g=`<path d="M10 60 Q10 6 75 6 Q140 6 140 60 V160 Q140 186 75 186 Q10 186 10 160 Z" fill="url(#wkDome)" stroke="#111"/><path d="M10 112 H140" stroke="#111" stroke-width="2" opacity=".6"/>`;
 g+=`<rect x="36" y="58" width="78" height="58" rx="8" fill="#3d454b" stroke="#111"/>`;
 Object.entries(WK.KP).forEach(([k,[a,b]])=>{g+=`<circle cx="${a}" cy="${b}" r="6" fill="url(#wkBr)" stroke="#6b5212"/>`+WK.t(a,b+(k==="S"?-10:20),k,{size:11,fill:"#e9ecee"})});
 g+=WK.t(75,150,o.lab||"COMPRESSOR",{size:10,fill:"#c9ced2"});return WK.g(x,y,s,g)};
WK.kpp=(x,y,s,k)=>[x+WK.KP[k][0]*s,y+WK.KP[k][1]*s];
/* 24 V transformer, local 110 x 90 */
WK.xfmr=(x,y,o={})=>{const s=o.s||1;let g=`<rect x="0" y="22" width="110" height="68" rx="3" fill="#5a6066" stroke="#2a2f33"/>`;
 for(let i=0;i<8;i++)g+=`<path d="M${8+i*13} 22 V90" stroke="#3e4449" stroke-width="1"/>`;
 g+=`<rect x="22" y="30" width="66" height="52" rx="6" fill="url(#wkCu)" stroke="#6a3a18"/>`+WK.t(55,52,"240 / 24 V",{size:10,fill:"#fff"})+WK.t(55,68,"40 VA",{size:10,fill:"#fff"});
 return WK.g(x,y,s,g)};
/* thermostat sub-base with screw terminals; letters in order */
WK.tstat=(x,y,o={})=>{const s=o.s||1,L=o.terms||["R","C","Y","W","G","O/B"];const w=40+L.length*44;let g=`<rect x="0" y="0" width="${w}" height="120" rx="14" fill="url(#wkPl)" stroke="#9a9d99"/>`+WK.t(w/2,24,o.lab||"THERMOSTAT SUB-BASE",{size:10,fill:"#4a5257"});
 L.forEach((l,i)=>{const cx=42+i*44;g+=WK.screw(cx,64,9)+WK.t(cx,44,l,{size:13,w:700})});return WK.g(x,y,s,g)};
WK.tpt=(x,y,s,i)=>[x+(42+i*44)*s,y+64*s];
/* electric heater element (open coil on ceramic), local 200 x 60, terminals at (10,30) and (190,30) */
WK.heater=(x,y,o={})=>{const s=o.s||1;let d="M10 30";for(let i=0;i<18;i++)d+=` q5 ${i%2?14:-14} 10 0`;let g=`<rect x="0" y="18" width="20" height="24" rx="4" fill="url(#wkCer)" stroke="#9a907a"/><rect x="180" y="18" width="20" height="24" rx="4" fill="url(#wkCer)" stroke="#9a907a"/>`;
 g+=`<path d="${d.replace("M10 30","M20 30")}" fill="none" stroke="${o.on?"#ff6a2a":"#9aa1a6"}" stroke-width="3.4"/>`+WK.screw(10,30,5)+WK.screw(190,30,5);
 if(o.on)g+=`<path d="${d.replace("M10 30","M20 30")}" fill="none" stroke="#ffb347" stroke-width="7" opacity=".35"/>`;
 return WK.g(x,y,s,g)};
/* 2-pole breaker or disconnect box, local 120 x 150 */
WK.panel=(x,y,o={})=>{const s=o.s||1,on=!!o.on;let g=`<rect x="0" y="0" width="120" height="150" rx="5" fill="url(#wkMV)" stroke="#5d666c"/><rect x="30" y="38" width="60" height="70" rx="4" fill="#23282c"/>`;
 g+=`<rect x="44" y="${on?46:76}" width="32" height="24" rx="3" fill="${on?"#1e9a4a":"#888"}"/>`+WK.t(60,on?62:92,on?"ON":"OFF",{size:10,fill:"#fff"})+WK.t(60,24,o.lab||"240 V BREAKER",{size:10})+WK.t(60,128,"L1     L2",{size:11});
 return WK.g(x,y,s,g)};

/* ---------- ladder symbols (stroke follows the theme ink) ---------- */
WK.S={};
const SK=(c)=>c||"var(--ink)";
WK.S.line=(d,c,w=2.2)=>`<path d="${d}" fill="none" stroke="${SK(c)}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/* contacts centered at x,y, 44 wide. closed draws them touching */
WK.S.no=(x,y,o={})=>{const c=SK(o.c),gap=o.closed?3:9;return WK.S.line(`M${x-22} ${y} H${x-gap} M${x+gap} ${y} H${x+22}`,c)+WK.S.line(`M${x-gap} ${y-12} V${y+12} M${x+gap} ${y-12} V${y+12}`,c,2.6)+(o.lab?K.lbl(x,y-20,o.lab,{size:12,fill:o.lc}):"")};
WK.S.nc=(x,y,o={})=>WK.S.no(x,y,{...o,closed:false})+(o.open?"":WK.S.line(`M${x-15} ${y+14} L${x+15} ${y-14}`,o.c,2));
/* single-pole switch (knife), open lifts the blade */
WK.S.sw=(x,y,o={})=>{const c=SK(o.c);return `<circle cx="${x-18}" cy="${y}" r="3" fill="${c}"/><circle cx="${x+18}" cy="${y}" r="3" fill="none" stroke="${c}" stroke-width="2"/>`+WK.S.line(`M${x-22} ${y} H${x-18} M${x+18} ${y} H${x+22}`,c)+WK.S.line(o.closed?`M${x-18} ${y} L${x+16} ${y-2}`:`M${x-18} ${y} L${x+14} ${y-18}`,c,2.6)+(o.lab?K.lbl(x,y-24,o.lab,{size:12,fill:o.lc}):"")};
/* pressure switch: NC contacts plus a diaphragm flag */
WK.S.ps=(x,y,o={})=>{const c=SK(o.c);const blade=o.open?`M${x-18} ${y} L${x+14} ${y-18}`:`M${x-18} ${y} L${x+16} ${y-2}`;return `<circle cx="${x-18}" cy="${y}" r="3" fill="${c}"/><circle cx="${x+18}" cy="${y}" r="3" fill="none" stroke="${c}" stroke-width="2"/>`+WK.S.line(`M${x-22} ${y} H${x-18} M${x+18} ${y} H${x+22}`,c)+WK.S.line(blade,c,2.6)+WK.S.line(`M${x} ${y-(o.open?9:1)} V${y+12}`,c,1.4)+`<path d="M${x-9} ${y+12} H${x+9} A9 9 0 0 1 ${x-9} ${y+12}Z" fill="none" stroke="${c}" stroke-width="1.6"/>`+(o.lab?K.lbl(x,y-24,o.lab,{size:12,fill:o.lc}):"")};
WK.S.coil=(x,y,o={})=>{const c=SK(o.c);return `<circle cx="${x}" cy="${y}" r="16" fill="${o.on?"color-mix(in srgb,"+WK.HOT+" 18%,var(--paper))":"var(--paper)"}" stroke="${c}" stroke-width="2.2"/>`+K.lbl(x,y+5,o.t||"CC",{size:12,fill:o.c})+WK.S.line(`M${x-26} ${y} H${x-16} M${x+16} ${y} H${x+26}`,c)};
WK.S.motor=(x,y,o={})=>{const c=SK(o.c);return `<circle cx="${x}" cy="${y}" r="20" fill="var(--paper)" stroke="${c}" stroke-width="2.2"/>`+K.lbl(x,y+5,o.t||"M",{size:13,fill:o.c})+WK.S.line(`M${x-30} ${y} H${x-20} M${x+20} ${y} H${x+30}`,c)};
WK.S.cap=(x,y,o={})=>{const c=SK(o.c);return WK.S.line(`M${x-22} ${y} H${x-5} M${x+5} ${y} H${x+22} M${x-5} ${y-13} V${y+13}`,c)+`<path d="M${x+9} ${y-13} Q${x+3} ${y} ${x+9} ${y+13}" fill="none" stroke="${c}" stroke-width="2.4"/>`};
WK.S.res=(x,y,o={})=>{const c=SK(o.c);let d=`M${x-30} ${y} H${x-18}`;for(let i=0;i<6;i++)d+=` L${x-18+i*6+3} ${y+(i%2?8:-8)}`;d+=` L${x+18} ${y} H${x+30}`;return WK.S.line(d,c)};
WK.S.fuse=(x,y,o={})=>{const c=SK(o.c);return WK.S.line(`M${x-24} ${y} H${x-14} M${x+14} ${y} H${x+24}`,c)+`<rect x="${x-14}" y="${y-6}" width="28" height="12" rx="3" fill="var(--paper)" stroke="${c}" stroke-width="2"/>`+WK.S.line(`M${x-14} ${y} H${x+14}`,c,1.2)};
WK.S.ol=(x,y,o={})=>{const c=SK(o.c);return WK.S.line(`M${x-22} ${y} H${x-12} M${x+12} ${y} H${x+22}`,c)+`<path d="M${x-12} ${y} a6 6 0 0 1 12 0 a6 6 0 0 0 12 0" fill="none" stroke="${c}" stroke-width="2.2"/>`};
WK.S.xfmr=(x,y,o={})=>{const c=SK(o.c);let a=`M${x-24} ${y-14}`,b=`M${x-24} ${y+14}`;for(let i=0;i<4;i++){a+=` a6 6 0 0 0 12 0`;b+=` a6 6 0 0 1 12 0`}return `<path d="${a}" fill="none" stroke="${c}" stroke-width="2.2"/><path d="${b}" fill="none" stroke="${c}" stroke-width="2.2"/>`+WK.S.line(`M${x-24} ${y-4} H${x+24} M${x-24} ${y+4} H${x+24}`,c,1.6)};
WK.S.gnd=(x,y,o={})=>{const c=SK(o.c);return WK.S.line(`M${x} ${y-12} V${y} M${x-12} ${y} H${x+12} M${x-8} ${y+5} H${x+8} M${x-4} ${y+10} H${x+4}`,c)};
WK.S.dot=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${SK(c)}"/>`;
/* numbered test point */
WK.pt=(x,y,n,on)=>`<circle cx="${x}" cy="${y}" r="11" fill="${on?"var(--brass)":"var(--paper)"}" stroke="var(--brass)" stroke-width="2"/><text x="${x}" y="${y+4.5}" style="font-family:var(--mono);font-size:12px;font-weight:600;fill:${on?"#fff":"var(--brass)"};text-anchor:middle">${n}</text>`;
/* small LCD-style readout box on paper (dark screen, green digits) */
WK.read=(x,y,w,title,val,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="54" rx="6" fill="var(--paper)" stroke="${o.st||"var(--panel-edge)"}"/>`+K.lbl(x+10,y+19,title,{a:"start",size:12,fill:"var(--muted)"})+`<text x="${x+10}" y="${y+44}" style="font-family:var(--mono);font-size:${o.vs||19}px;font-weight:600;fill:${o.vc||"var(--ink)"}">${val}</text>`;
/* number formats for meter screens */
WK.fv=v=>v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2);
WK.defs();
