
/* ============ SHARED REALISTIC PART CARDS (340x250), used on every trainer with the same part key ============ */
const RT=(x,y,t,a="start",c="#2a3135")=>`<text x="${x}" y="${y}" text-anchor="${a}" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="${c}">${t}</text>`;
/* finned coil face: aluminum fins over copper tube rows */
const rFins=(x,y,w,h,pitch=3)=>{let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#r_alF)"/>`;for(let i=x+1;i<x+w;i+=pitch)s+=`<line x1="${i}" y1="${y}" x2="${i}" y2="${y+h}" stroke="#7d868c" stroke-width=".6" opacity=".7"/>`;for(let j=y+8;j<y+h;j+=14)s+=`<line x1="${x}" y1="${j}" x2="${x+w}" y2="${j}" stroke="#b8693a" stroke-width="1.3" opacity=".45"/>`;return s+`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#rGlass)" opacity=".25"/>`};
/* wire with insulation color */
const rWire=(d,col)=>rHose(d,col,2.4);
/* screw terminal */
const rTerm=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="4" fill="url(#r_brassV)"/><path d="M${cx-2.6} ${cy} h5.2 M${cx} ${cy-2.6} v5.2" stroke="#4c3407" stroke-width="1"/>`;
/* dial gauge face with colored bezel */
const rGauge=(cx,cy,r,col,ang,label)=>`<circle cx="${cx}" cy="${cy}" r="${r+5}" fill="url(#r_${col}V)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfaf4"/>${Array.from({length:21},(_,i)=>{const a=(-135+i*13.5)*Math.PI/180;return `<line x1="${cx+r*.8*Math.sin(a)}" y1="${cy-r*.8*Math.cos(a)}" x2="${cx+r*.94*Math.sin(a)}" y2="${cy-r*.94*Math.cos(a)}" stroke="#333" stroke-width="${i%5?.5:1.1}"/>`}).join("")}<text x="${cx}" y="${cy+r*.45}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="${r*.2}" font-weight="700" fill="#333">${label}</text><line x1="${cx}" y1="${cy}" x2="${cx+r*.75*Math.sin(ang*Math.PI/180)}" y2="${cy-r*.75*Math.cos(ang*Math.PI/180)}" stroke="#c0281c" stroke-width="2" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="3" fill="#333"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#rGlass)"/>`;

const RILL={
/* ---------- scroll compressor, shell cut open ---------- */
compressor:{s:(()=>{const win="M128 74 H212 V196 H128 Z";
 return `${rSh(170,232,90,8)}<path d="M98 222 L90 232 H250 L242 222 Z" fill="url(#r_blackV)"/>
 ${rCylV(170,60,222,64,"black",{ry:14})}<path d="M106 60 Q106 26 170 24 Q234 26 234 60 A64 14 0 0 1 106 60 Z" fill="url(#r_blackV)"/><ellipse cx="150" cy="36" rx="30" ry="7" fill="#fff" opacity=".12" filter="url(#zSoft)"/>
 ${rCylV(170,4,30,6,"cu",{top:false})}${rCylH(234,300,170,7,"cu")}${rBand(232,170,9,8,"cu")}
 ${rBox(66,118,40,46,12,"black",{r:4})}${[130,140,150].map((y,i)=>`<circle cx="86" cy="${y}" r="3" fill="url(#r_brassV)"/>`).join("")}
 ${rCut(win)}${rClip("rq_c",win,`<rect x="128" y="74" width="84" height="40" fill="#2a2f33"/><path d="M170 94 m-30 0 a30 12 0 1 0 60 0 a24 9 0 1 0 -48 0 a18 7 0 1 0 36 0 a12 5 0 1 0 -24 0" fill="none" stroke="#c9ced1" stroke-width="3"/><path d="M170 96 m-27 0 a27 11 0 1 1 54 0 a21 8 0 1 1 -42 0 a15 6 0 1 1 30 0" fill="none" stroke="#e8c33a" stroke-width="2.4"/><rect x="128" y="114" width="84" height="6" fill="url(#r_alH)"/>${rCylV(170,126,196,34,"cu",{ry:7})}${Array.from({length:9},(_,k)=>`<path d="M${138+k*8} 128 V194" stroke="#6b2e12" stroke-width="1.2" opacity=".6"/>`).join("")}<rect x="166" y="114" width="8" height="82" fill="url(#r_chromeV)"/>`)}
 ${rL(170,8,120,8,6,12,"Discharge: hot gas out")}${rL(296,170,300,206,336,214,"Suction: cool vapor in","end")}
 ${rL(150,92,60,70,6,66,"Fixed + orbiting scrolls")}${rL(180,170,270,120,336,116,"Motor (suction-cooled)","end")}${rL(86,140,40,200,6,212,"Terminals C, S, R")}`})()},

/* ---------- condensing unit ---------- */
condenser:{s:(()=>`${rSh(170,232,120,8)}
 ${rBox(70,70,190,150,70,"paint",{r:3})}${rFins(76,78,178,134)}${[0,1,2,3,4,5,6,7].map(k=>`<line x1="${76}" y1="${86+k*16}" x2="${254}" y2="${86+k*16}" stroke="#4a5257" stroke-width="2"/>`).join("")}
 <path d="M260 70 L302 40.6 V190.6 L260 220 Z" fill="url(#rGlass)" opacity=".15"/>${(()=>{let s="";for(let i=0;i<9;i++){const x=262+i*4.6,y=70-i*3.2;s+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+150}" stroke="#5f686d" stroke-width="1"/>`}return s})()}
 <ellipse cx="186" cy="56" rx="68" ry="13" fill="#1c2023"/>${Array.from({length:14},(_,k)=>`<ellipse cx="186" cy="56" rx="${8+k*4.4}" ry="${1.6+k*.84}" fill="none" stroke="#596268" stroke-width=".9"/>`).join("")}${Array.from({length:8},(_,k)=>{const a=k*Math.PI/4;return `<line x1="186" y1="56" x2="${186+68*Math.cos(a)}" y2="${56+13*Math.sin(a)}" stroke="#596268" stroke-width=".9"/>`}).join("")}${rCylV(186,48,56,10,"black",{ry:2.4})}
 ${rCylH(290,340,196,5,"cu")}${rCylH(290,340,212,3,"cu")}${rHexH(286,196,8,7,"brass")}${rHexH(286,212,8,5,"brass")}
 ${rArr("M186 40 V6","#e0662a")}${rArr("M30 150 H70","#2f6fd6")}
 ${rL(130,120,60,110,6,106,"Coil: fins on copper tubes")}${rL(186,30,240,20,336,18,"Fan blows hot air out the top","end")}
 ${rL(290,204,290,236,336,244,"Service valves","end")}${rL(40,150,30,186,6,198,"Outdoor air in")}`)()},

/* ---------- condenser fan motor and blade ---------- */
fan:{s:(()=>`${rSh(170,232,110,6)}
 <ellipse cx="170" cy="150" rx="140" ry="40" fill="#1c2023" opacity=".92"/>${Array.from({length:16},(_,k)=>`<ellipse cx="170" cy="150" rx="${12+k*8.2}" ry="${3.4+k*2.32}" fill="none" stroke="#6c767c" stroke-width="1"/>`).join("")}
 ${[0,1,2].map(k=>{const a=k*2*Math.PI/3+.3;const x=170+110*Math.cos(a),y=150+31*Math.sin(a),x2=170+110*Math.cos(a+.55),y2=150+31*Math.sin(a+.55);return `<path d="M170 150 L${x} ${y} Q${(x+x2)/2+10*Math.cos(a)} ${(y+y2)/2+3*Math.sin(a)} ${x2} ${y2} Z" fill="url(#r_alV)" opacity=".92"/>`}).join("")}
 ${rCylV(170,60,140,30,"black",{ry:8})}<rect x="146" y="80" width="48" height="22" rx="2" fill="#e9e6da"/>${[0,1,2].map(k=>`<path d="M150 ${85+k*5} h${k?30:40}" stroke="#7a7666" stroke-width=".8"/>`).join("")}${rCylV(170,140,152,5,"chrome")}
 ${rWire("M200 70 C240 60 260 40 300 30","#2a2f33")}${rWire("M200 76 C244 70 270 54 320 50","#a65b2a")}
 ${rArr("M80 130 V96","#e0662a")}${rArr("M260 130 V96","#e0662a")}
 ${rL(160,96,60,60,6,56,"PSC motor, uses a run cap")}${rL(230,165,270,210,336,222,"Blades pull air up through the coil","end")}${rL(300,30,310,10,336,14,"Leads","end")}`)()},

/* ---------- pressure switches ---------- */
hps:{s:(()=>`${rSh(170,214,120,6)}${rCylH(0,340,180,9,"cu")}${rCylV(170,140,172,6,"brass",{top:false})}${rHexV(170,150,10,10,"brass")}
 ${rBox(130,70,80,70,20,"black",{r:6})}<text x="170" y="100" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#ddd">HIGH</text><text x="170" y="112" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" fill="#aaa">OPENS ~600 PSIG</text>
 ${rWire("M190 76 C230 50 260 40 340 40","#c0281c")}${rWire("M196 82 C236 60 266 56 340 58","#c0281c")}
 ${rL(170,156,100,160,6,156,"Schrader-type fitting")}${rL(60,180,60,214,6,226,"Discharge or liquid line (R-410A)")}${rL(300,40,300,20,336,16,"In series with the 24 V circuit","end")}`)()},
lps:{s:(()=>`${rSh(170,214,120,6)}${rCylH(0,340,180,11,"black",{grain:true})}${rCylV(170,140,170,6,"brass",{top:false})}${rHexV(170,150,10,10,"brass")}
 ${rBox(130,70,80,70,20,"black",{r:6})}<text x="170" y="100" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#ddd">LOW</text><text x="170" y="112" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" fill="#aaa">OPENS ~50 PSIG</text>
 ${rWire("M190 76 C230 50 260 40 340 40","#2f6fd6")}${rWire("M196 82 C236 60 266 56 340 58","#2f6fd6")}
 ${rL(170,156,100,160,6,156,"Fitting on the suction line")}${rL(60,180,60,214,6,226,"Insulated suction line")}${rL(300,40,300,20,336,16,"Opens on low charge or no airflow","end")}`)()},

/* ---------- manifold gauges ---------- */
gauges:{s:(()=>`${rSh(170,236,130,6)}
 ${rGauge(100,84,52,"blue",-30,"LOW")}${rGauge(240,84,52,"red",40,"HIGH")}
 ${rBox(70,150,200,30,14,"al",{r:6})}${[110,140,170,200,230].map(x=>`<circle cx="${x}" cy="165" r="3" fill="#333"/>`).join("")}${rCylV(80,140,152,5,"blue",{ry:1.6})}${rCylV(260,140,152,5,"red",{ry:1.6})}
 ${rHose("M100 180 C100 220 60 230 20 240","#2f6fd6",5)}${rHose("M170 180 V250","#e8c33a",5)}${rHose("M240 180 C240 220 280 230 320 240","#c0281c",5)}
 ${rL(60,84,30,30,6,24,"Suction pressure + sat. temp")}${rL(280,84,300,30,336,24,"Head pressure","end")}${rL(170,214,200,226,204,230,"Center: recover, evacuate, charge")}`)()},

/* ---------- filter drier, cut open ---------- */
drier:{s:(()=>{const win="M120 100 H220 V160 H120 Z";
 return `${rSh(170,200,120,6)}${rCylH(0,70,130,5,"cu")}${rCylH(270,340,130,5,"cu")}
 <path d="M70 124 Q86 100 100 100 H240 Q254 100 270 124 V136 Q254 160 240 160 H100 Q86 160 70 136 Z" fill="url(#r_blueH)"/>
 ${rCut(win)}${rClip("rq_d",win,`<rect x="120" y="100" width="100" height="60" fill="#d8cfa8"/>${Array.from({length:60},(_,i)=>`<circle cx="${122+(i*37)%96}" cy="${102+(i*23)%56}" r="3" fill="#c4b58a" stroke="#9c8b60" stroke-width=".5"/>`).join("")}`)}
 <rect x="150" y="104" width="40" height="12" rx="2" fill="#e9e6da" opacity=".0"/>
 ${rArr("M110 190 H230","#c0281c")}
 ${rL(170,140,240,200,336,214,"Desiccant core: holds moisture and acid","end")}${rL(40,130,40,60,6,56,"Liquid in")}${rL(300,130,300,60,336,56,"To the metering device","end")}`})()},

/* ---------- TXV ---------- */
meter:{only:["split","hp"],s:(()=>{const win="M128 112 H196 V168 H128 Z";
 return `${rSh(170,214,110,6)}${rCylH(0,128,150,5,"cu")}${rCylV(162,168,250,5,"cu",{top:false})}
 ${rBox(126,110,72,60,22,"brass",{r:4,grain:true})}
 ${rCylV(162,92,110,10,"brass",{top:false})}<path d="M112 92 Q114 56 162 54 Q210 56 212 92 A50 10 0 0 1 112 92 Z" fill="url(#r_chromeV)"/><ellipse cx="162" cy="92" rx="50" ry="10" fill="url(#r_chromeT)" opacity=".4"/>
 ${rCut(win)}${rClip("rq_t",win,`<rect x="128" y="112" width="68" height="56" fill="#3a3f43"/><rect x="158" y="112" width="8" height="34" fill="url(#r_chromeV)"/><path d="M148 152 L162 140 L176 152 Z" fill="#c9ced1"/><rect x="136" y="152" width="52" height="5" fill="url(#r_brassH)"/>${Array.from({length:4},(_,k)=>`<path d="M154 ${118+k*6} l16 3" stroke="#9aa3a9" stroke-width="1.4"/>`).join("")}`)}
 ${rHose("M212 70 C270 60 290 120 300 190","#b8693a",2)}${rCylH(270,340,210,9,"black",{grain:true})}${rBox(290,196,22,16,4,"cu",{r:3})}
 ${rL(170,56,120,20,6,16,"Power head: bulb pressure pushes down")}${rL(166,140,60,120,6,116,"Pin and seat")}
 ${rL(60,150,40,186,6,198,"Liquid in")}${rL(162,230,200,236,336,244,"Cold mix out to the coil","end")}${rL(300,200,300,170,336,166,"Bulb on the suction line","end")}`})()},

/* ---------- evaporator A-coil in its case, front cut away ---------- */
evap:{only:["split","hp"],s:(()=>{const win="M90 40 H250 V200 H90 Z";
 return `${rSh(170,236,110,7)}${rBox(80,30,180,200,40,"cab",{r:3})}
 ${rCut(win)}${rClip("rq_e",win,`<rect x="90" y="40" width="160" height="160" fill="#2a2f33"/><path d="M100 190 L168 52 L176 52 L120 190 Z" fill="url(#r_alV)"/>${Array.from({length:12},(_,k)=>`<line x1="${104+k*5.4}" y1="${190-k*11.6}" x2="${120+k*4.6}" y2="${190-k*11.6}" stroke="#b8693a" stroke-width="1.6"/>`).join("")}<path d="M240 190 L172 52 L164 52 L220 190 Z" fill="url(#r_alV)"/>${Array.from({length:12},(_,k)=>`<line x1="${236-k*5.4}" y1="${190-k*11.6}" x2="${220-k*4.6}" y2="${190-k*11.6}" stroke="#b8693a" stroke-width="1.6"/>`).join("")}<rect x="94" y="190" width="152" height="10" fill="#2f2f2f"/>`)}
 ${rArr("M170 250 V206","#2f6fd6")}${rArr("M170 160 V30","#7fb0ff")}${rCylH(260,340,120,5,"cu")}${rCylH(260,340,150,8,"black",{grain:true})}${rCylH(260,320,214,4,"paint")}
 ${rL(126,140,60,120,6,116,"A-coil slabs")}${rL(120,195,60,226,6,238,"Drain pan")}${rL(300,150,300,186,336,196,"Lines to the outdoor unit","end")}${rL(170,20,240,14,336,14,"Cooled air up to the ducts","end")}`})()},

/* ---------- blower: squirrel-cage wheel in its scroll housing ---------- */
blower:{s:(()=>`${rSh(170,232,110,7)}
 <path d="M80 120 C80 60 130 36 180 40 C240 44 270 80 270 120 V200 H230 V170 C230 190 200 210 170 210 C120 210 80 170 80 120 Z" fill="url(#r_galvV)" filter="url(#rGrain)"/>
 <ellipse cx="172" cy="124" rx="62" ry="62" fill="#1c2023"/>${Array.from({length:36},(_,k)=>{const a=k*Math.PI/18;return `<line x1="${172+46*Math.cos(a)}" y1="${124+46*Math.sin(a)}" x2="${172+60*Math.cos(a+.18)}" y2="${124+60*Math.sin(a+.18)}" stroke="#aeb6bb" stroke-width="2.4"/>`}).join("")}
 <circle cx="172" cy="124" r="26" fill="url(#r_blackV)"/>${Array.from({length:8},(_,k)=>{const a=k*Math.PI/4;return `<path d="M${172+12*Math.cos(a)} ${124+12*Math.sin(a)} L${172+22*Math.cos(a+.2)} ${124+22*Math.sin(a+.2)}" stroke="#4a5055" stroke-width="3"/>`}).join("")}<circle cx="172" cy="124" r="6" fill="url(#r_chromeV)"/>${[0,1,2].map(k=>{const a=k*2.09+.5;return `<rect x="${172+34*Math.cos(a)-3}" y="${124+34*Math.sin(a)-10}" width="6" height="20" fill="url(#r_galvV)" transform="rotate(${a*57.3} ${172+34*Math.cos(a)} ${124+34*Math.sin(a)})"/>`}).join("")}
 ${rArr("M250 196 V236","#2f6fd6")}${rArr("M20 124 H96","#2f6fd6")}
 ${rL(220,124,280,40,336,36,"Forward-curved wheel","end")}${rL(172,124,60,190,6,202,"Motor in the hub")}${rL(110,70,60,60,6,56,"Scroll housing")}${RT(336,244,"Air out to the coil","end")}`)()},

/* ---------- pleated filter ---------- */
filter:{s:(()=>`${rSh(170,226,120,6)}
 <path d="M60 60 L230 20 L290 120 L120 160 Z" fill="#cbb98f"/><path d="M70 64 L226 28 L280 118 L124 154 Z" fill="#f4f1e6"/>
 ${Array.from({length:18},(_,k)=>{const t=k/17;const x1=70+156*t,y1=64-36*t,x2=124+156*t,y2=154-36*t;return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${k%2?"#d8d2bf":"#ffffff"}" stroke-width="5"/>`}).join("")}
 <path d="M60 60 L230 20 L290 120 L120 160 Z" fill="none" stroke="#a8946a" stroke-width="6"/><path d="M120 160 L290 120 V128 L120 168 Z" fill="#a8946a"/>
 ${rArr("M40 200 L100 186","#2f6fd6")}${rArr("M200 120 L250 108","#4a4a4a")}
 ${RT(176,210,"16 × 25 × 1  MERV 8","middle")}${rL(206,114,280,170,336,186,"Arrow points toward the blower","end")}${rL(80,110,30,120,6,116,"Pleated media")}${RT(6,236,"Dirty filter = low airflow")}`)()},

/* ---------- line set ---------- */
suction:{only:["split","hp","cooler","freezer"],s:(()=>`${rSh(170,212,140,6)}
 ${rCylH(0,340,90,16,"black",{grain:true})}<path d="M300 74 V106" stroke="#000" stroke-opacity=".3"/>${rCylH(300,340,90,9,"cu",{end:true,bore:true})}
 ${rCylH(0,340,170,6,"cu",{end:true,bore:true})}
 ${rL(150,90,120,50,6,46,"Large vapor line, insulated (cool)")}${rL(150,170,150,210,6,222,"Small liquid line, bare (warm)")}${RT(336,140,"Insulation stops sweating","end")}`)()},
disconnect:{only:["split","hp"],s:(()=>`${rSh(170,232,90,6)}${rBox(100,30,140,190,22,"paint",{r:4,grain:true})}
 <rect x="112" y="44" width="116" height="160" rx="3" fill="url(#r_paintF)" stroke="#2f383f"/>${rBox(130,80,80,90,12,"black",{r:6})}<rect x="150" y="96" width="40" height="22" rx="3" fill="url(#r_redV)"/><text x="170" y="111" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#fff">PULL</text>
 ${rCylV(170,220,250,10,"galv",{top:false})}${rHose("M210 220 C240 240 300 240 340 230","#2a2f33",8)}
 ${rL(170,106,60,100,6,96,"Pull-out block: kills power")}${rL(170,240,120,240,6,246,"Line in")}${rL(300,236,300,206,336,200,"Whip to the unit","end")}`)()},

/* ---------- wall thermostat ---------- */
tstat:{only:["split","hp","furnace","oil","ahu","air"],s:(()=>`${rSh(170,214,90,6)}<rect x="0" y="0" width="340" height="250" fill="#ebe7df"/>
 ${rBox(100,40,140,150,12,"white",{r:20})}<rect x="122" y="62" width="96" height="70" rx="8" fill="#14181b"/><text x="170" y="112" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="36" font-weight="300" fill="#e9eef0">72°</text><text x="170" y="126" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#7fb0ff">SET 72  AUTO</text><rect x="122" y="62" width="96" height="70" rx="8" fill="url(#rGlass)" opacity=".5"/>
 ${[140,170,200].map(x=>`<circle cx="${x}" cy="160" r="9" fill="url(#r_whiteV)" stroke="#bbb"/>`).join("")}
 ${rL(170,96,60,40,6,36,"Senses room temperature")}${rL(200,160,280,200,336,212,"R power, Y cool, G fan, W heat, C common","end")}`)()},

/* ---------- house ---------- */
room:{s:(()=>`${rSh(170,230,140,8)}${rBox(70,110,180,110,90,"white",{r:0})}
 <path d="M60 112 L160 40 L260 112 Z" fill="url(#r_paintV)"/><path d="M260 112 L160 40 L214 2 L314 74 Z" fill="url(#r_paintS)"/>
 ${[[90,140],[200,140]].map(([x,y])=>`<rect x="${x}" y="${y}" width="34" height="30" fill="#bcd8ee" stroke="#8a9094" stroke-width="3"/><rect x="${x}" y="${y}" width="34" height="30" fill="url(#rGlass)"/>`).join("")}<rect x="146" y="160" width="28" height="60" fill="url(#r_tanV)"/>
 ${rArr("M30 160 H66","#e0662a")}${rArr("M160 4 V36","#e0662a")}${rArr("M330 170 H296","#e0662a")}
 ${RT(6,150,"Heat in")}${RT(170,250,"Walls, windows and roof leak heat","middle")}`)()}
};
RILL.liquid=RILL.suction;RILL.house=RILL.room;RILL.afilter=RILL.filter;
Object.assign(RILL,{
/* ---------- heat pump extras ---------- */
accum:{s:(()=>{const win="M142 96 H198 V206 H142 Z";
 return `${rSh(170,236,60,6)}${rCylV(170,60,220,44,"paint",{ry:10,grain:true})}<path d="M126 60 Q126 36 170 34 Q214 36 214 60 A44 10 0 0 1 126 60 Z" fill="url(#r_paintV)"/>
 ${rCut(win)}${rClip("rq_a",win,`<rect x="142" y="170" width="56" height="36" fill="url(#rWater)" opacity=".8"/><path d="M150 40 V196 Q150 204 158 204 H182 Q190 204 190 196 V60" fill="none" stroke="#c97a48" stroke-width="5"/><circle cx="170" cy="204" r="2" fill="#111"/>`)}
 ${rCylV(150,6,40,5,"cu",{top:false})}${rCylV(190,6,40,5,"cu",{top:false})}
 ${rL(150,14,90,14,6,18,"In: from the reversing valve")}${rL(190,14,240,14,336,18,"Out: to the compressor","end")}
 ${rL(170,190,240,220,336,230,"Liquid and oil settle here","end")}${rL(170,204,90,226,6,238,"Oil bleed hole at the U-bend")}${rL(190,120,262,110,336,106,"Vapor taken from the top","end")}`})()},
ometer:{s:(()=>{const win="M120 106 H220 V154 H120 Z";
 return `${rSh(170,200,120,6)}${rCylH(0,96,130,5,"cu")}${rCylH(244,340,130,5,"cu")}${rHexH(96,130,24,26,"brass")}${rHexH(220,130,24,26,"brass")}${rCylH(118,222,130,22,"brass",{grain:true})}
 ${rCut(win)}${rClip("rq_o",win,`<rect x="120" y="106" width="100" height="48" fill="#2a2f33"/><path d="M146 116 H186 Q204 116 204 130 Q204 144 186 144 H146 Z" fill="url(#r_brassH)"/><rect x="146" y="128" width="58" height="4" fill="#111"/>${[150,160,170,180].map(x=>`<line x1="${x}" y1="116" x2="${x}" y2="144" stroke="#7a5a16" stroke-width="1"/>`).join("")}`)}
 ${rArr("M40 200 H140","#2f6fd6")}${RT(40,224,"Heating: piston seats and meters")}${rArr("M300 190 H200","#c0281c")}${RT(336,176,"Cooling: it slides off and bypasses","end")}
 ${rL(176,130,180,70,6,60,"Piston with a drilled orifice")}`})()},
defrost:{s:(()=>`${rSh(170,226,120,6)}${rBox(60,40,220,170,10,"blue",{r:4})}<rect x="64" y="44" width="212" height="162" rx="3" fill="#1f6b3a"/>${Array.from({length:14},(_,k)=>`<path d="M${74+k*14} 60 V${190}" stroke="#2e8a50" stroke-width="1" opacity=".6"/>`).join("")}
 ${rBox(90,70,50,36,10,"black",{r:2})}${rBox(160,70,50,36,10,"black",{r:2})}${[0,1,2].map(k=>`<rect x="${100+k*30}" y="140" width="16" height="10" fill="#111"/><circle cx="${108+k*30}" cy="134" r="4" fill="url(#r_chromeV)"/><text x="${108+k*30}" y="165" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" fill="#e9f5ec">${[30,60,90][k]}</text>`).join("")}<rect x="96" y="140" width="24" height="10" fill="#e8c33a" opacity=".85"/>
 ${[0,1,2,3,4,5].map(k=>rTerm(222+k*0,70+k*20)).join("")}${rWire("M70 190 C30 210 20 230 0 240","#f2f2ee")}<rect x="40" y="206" width="16" height="10" rx="2" fill="url(#r_alV)"/>
 ${rL(115,88,60,24,6,20,"Relays: reversing valve, fan off")}${rL(108,140,150,186,154,196,"Pins: 30, 60 or 90 min")}${rL(46,212,40,232,6,246,"Coil sensor clipped to the coil")}${rL(222,110,300,110,336,126,"R C Y O W","end")}`)()},
strips:{s:(()=>`${rSh(170,226,130,6)}${rBox(40,40,260,170,20,"galv",{r:3})}<rect x="50" y="52" width="240" height="146" fill="#1c2023"/>
 ${[0,1,2].map(k=>{let d=`M60 ${80+k*44}`;for(let i=0;i<22;i++)d+=` q5 -9 10 0`;return `<path d="${d}" fill="none" stroke="#7a2a12" stroke-width="4"/><path d="${d}" fill="none" stroke="#ff7a3a" stroke-width="2.2"/>`}).join("")}
 ${rBox(130,214,30,20,6,"black",{r:2})}<circle cx="145" cy="224" r="4" fill="url(#r_chromeV)"/>${rBox(190,214,30,20,6,"black",{r:2})}
 ${rL(150,80,200,20,336,16,"Nichrome coils glow when on","end")}${rL(145,224,60,232,6,244,"Limit switch")}${rL(205,224,260,236,336,244,"Fusible link","end")}${RT(6,24,"5–10 kW per kit, staged")}`)()},

/* ---------- walk-in parts ---------- */
receiver:{s:(()=>{const win="M90 110 H230 V170 H90 Z";
 return `${rSh(170,214,130,6)}<path d="M80 176 L74 206 H96 L92 176 Z M228 176 L222 206 H244 L240 176 Z" fill="url(#r_paintV)"/>${rTankH(160,140,240,40,"paint")}
 ${rCut(win)}${rClip("rq_r",win,`<rect x="90" y="110" width="140" height="60" fill="#d7dee2" opacity=".2"/><rect x="90" y="140" width="140" height="30" fill="url(#rWater)"/><path d="M90 140 H230" stroke="#cfe6ff"/>`)}
 ${rCylV(80,40,100,5,"cu",{top:false})}${rCylV(240,40,100,5,"cu",{top:false})}${rBox(228,84,24,16,8,"brass",{r:2})}<rect x="246" y="76" width="6" height="10" fill="url(#r_redV)"/><circle cx="160" cy="180" r="5" fill="url(#r_brassV)"/>
 ${rL(80,50,30,30,6,26,"From the condenser")}${rL(246,80,290,40,336,36,"King valve, liquid out","end")}${rL(160,150,100,226,6,238,"Stores the extra charge")}${rL(160,184,240,226,336,238,"Fusible plug","end")}`})()},
sglass:{s:(()=>`${rSh(170,200,120,6)}${rCylH(0,110,130,7,"cu")}${rCylH(230,340,130,7,"cu")}${rHexH(104,130,18,20,"brass")}${rHexH(218,130,18,20,"brass")}${rCylH(120,220,130,30,"brass",{grain:true})}
 <circle cx="170" cy="118" r="30" fill="url(#r_chromeV)"/><circle cx="170" cy="118" r="22" fill="#cde6f5"/>${[[160,110,4],[176,120,3],[168,126,2.4],[180,106,2]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#5a7a9a"/>`).join("")}<circle cx="170" cy="118" r="7" fill="#2fa84f"/><circle cx="170" cy="118" r="22" fill="url(#rGlass)"/>
 ${rL(160,110,90,60,6,56,"Bubbles: short of charge or flashing")}${rL(170,118,250,60,336,56,"Dot: green dry, yellow wet","end")}${RT(170,200,"Clear and full = solid liquid","middle")}`)()},
lls:{s:(()=>`${rSh(170,214,120,6)}${rCylH(0,110,170,6,"cu")}${rCylH(230,340,170,6,"cu")}${rBox(110,150,120,44,18,"brass",{r:6,grain:true})}${rCylV(170,90,150,14,"chrome",{ry:4})}
 ${rBox(132,40,76,62,20,"black",{r:4})}<text x="170" y="74" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#ccc">24 V COIL</text>${rWire("M200 46 C240 30 260 20 340 18","#2a2f33")}${rWire("M204 54 C246 40 270 36 340 38","#2a2f33")}
 ${rArr("M30 200 H96","#c0281c")}
 ${rL(170,70,80,30,6,26,"Coil lifts the plunger")}${rL(150,172,80,226,6,238,"Normally closed: no power, no flow")}${rL(300,30,300,110,336,122,"Wired to the box thermostat","end")}`)()},
ucool:{s:(()=>`${rSh(170,230,140,6)}<rect x="0" y="0" width="340" height="24" fill="#e9eef0"/>
 ${rBox(40,30,250,120,40,"white",{r:4})}${rFins(54,44,90,92)}${[[190,90],[262,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="38" fill="#1c2023"/>${Array.from({length:6},(_,k)=>`<circle cx="${x}" cy="${y}" r="${8+k*6}" fill="none" stroke="#8b949a" stroke-width="1.2"/>`).join("")}<line x1="${x-38}" y1="${y}" x2="${x+38}" y2="${y}" stroke="#8b949a"/><line x1="${x}" y1="${y-38}" x2="${x}" y2="${y+38}" stroke="#8b949a"/>`).join("")}
 <path d="M40 150 L70 168 H310 L290 150 Z" fill="url(#r_whiteF)"/>${rCylV(84,160,250,5,"paint",{top:false})}
 ${rArr("M100 190 H20","#7fb0ff")}${rArr("M240 140 V200","#7fb0ff")}
 ${rL(100,90,60,40,6,30,"Finned coil")}${rL(200,90,250,40,336,36,"Fans blow through the coil","end")}${rL(84,200,40,226,6,238,"Drain pan + line")}`)()},
efans:{s:(()=>`${rSh(170,230,120,6)}<circle cx="170" cy="120" r="100" fill="#1c2023"/>${Array.from({length:10},(_,k)=>`<circle cx="170" cy="120" r="${14+k*9.6}" fill="none" stroke="#9aa3a9" stroke-width="1.6"/>`).join("")}${[0,1,2,3].map(k=>{const a=k*Math.PI/2+.3;return `<path d="M170 120 L${170+86*Math.cos(a)} ${120+86*Math.sin(a)} Q${170+90*Math.cos(a+.4)} ${120+90*Math.sin(a+.4)} ${170+80*Math.cos(a+.7)} ${120+80*Math.sin(a+.7)} Z" fill="url(#r_alV)" opacity=".75"/>`}).join("")}
 <circle cx="170" cy="120" r="24" fill="url(#r_blackV)"/>${[0,90,180,270].map(a=>`<line x1="${170+100*Math.cos(a*Math.PI/180)}" y1="${120+100*Math.sin(a*Math.PI/180)}" x2="${170+24*Math.cos(a*Math.PI/180)}" y2="${120+24*Math.sin(a*Math.PI/180)}" stroke="#9aa3a9" stroke-width="3"/>`).join("")}
 ${rL(170,120,60,30,6,26,"Shaded-pole or ECM motor")}${rL(240,60,280,20,336,16,"Wire guard","end")}${RT(6,240,"Freezer: delayed after defrost")}`)()},
timer:{s:(()=>`${rSh(170,230,100,6)}${rBox(80,30,180,190,20,"paint",{r:4,grain:true})}<circle cx="170" cy="110" r="60" fill="url(#r_whiteV)"/>${Array.from({length:24},(_,k)=>{const a=k*Math.PI/12;return `<text x="${170+50*Math.sin(a)}" y="${114-50*Math.cos(a)}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="6" fill="#333">${k}</text>`}).join("")}
 ${[2,8,14,20].map(h=>{const a=h*Math.PI/12;return `<rect x="${170+38*Math.sin(a)-3}" y="${110-38*Math.cos(a)-5}" width="6" height="10" fill="#e8c33a" transform="rotate(${h*15} ${170+38*Math.sin(a)} ${110-38*Math.cos(a)})"/>`}).join("")}<line x1="170" y1="110" x2="170" y2="66" stroke="#c0281c" stroke-width="3"/><circle cx="170" cy="110" r="6" fill="url(#r_chromeV)"/>
 ${[0,1,2,3].map(k=>rTerm(110+k*40,196)).join("")}
 ${rL(204,86,280,40,336,36,"Pins: defrost start times","end")}${rL(170,80,60,40,6,36,"Clock dial (24 h)")}${rL(150,196,90,236,6,244,"Terminals 1 2 3 4 N X")}`)()},
dpc:{s:(()=>`${rSh(170,230,110,6)}${rBox(70,40,200,160,20,"paint",{r:4,grain:true})}
 ${[120,220].map((x,i)=>`<rect x="${x-26}" y="60" width="52" height="16" rx="2" fill="#f4f2e8"/>${Array.from({length:9},(_,k)=>`<line x1="${x-22+k*5.5}" y1="62" x2="${x-22+k*5.5}" y2="${k%2?68:72}" stroke="#333" stroke-width=".7"/>`).join("")}<text x="${x}" y="90" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#e9eef0">${i?"HIGH":"LOW"}</text>${rCylV(x,96,120,6,"chrome")}<rect x="${x-3}" y="94" width="6" height="2" fill="#333"/>`).join("")}
 ${rBox(150,130,40,40,10,"white",{r:2})}<text x="170" y="154" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#c0281c">RESET</text>
 ${rHose("M110 200 C110 230 40 230 0 236","#b8693a",2)}${rHose("M230 200 C230 230 300 230 340 236","#b8693a",2)}
 ${rL(120,66,60,20,6,16,"Low: cut-in and differential")}${rL(220,66,280,20,336,16,"High: cut-out, manual reset","end")}${RT(6,246,"to suction")}${RT(336,246,"to discharge","end")}`)()},
cch:{s:(()=>`${rSh(170,236,90,8)}${rCylV(170,40,210,64,"black",{ry:14})}<path d="M106 40 Q106 8 170 6 Q234 8 234 40 A64 14 0 0 1 106 40 Z" fill="url(#r_blackV)"/>
 <path d="M106 176 A64 14 0 0 0 234 176 V192 A64 14 0 0 1 106 192 Z" fill="url(#r_alH)"/>${Array.from({length:12},(_,k)=>`<line x1="${112+k*10}" y1="${180+Math.sin(k)*1}" x2="${112+k*10}" y2="${196}" stroke="#7d868c"/>`).join("")}
 ${rWire("M234 184 C270 184 290 160 340 150","#2a2f33")}
 ${rL(150,190,60,226,6,238,"Belly-band heater")}${rL(300,160,300,226,336,238,"On in the off cycle","end")}${RT(6,100,"Keeps refrigerant")}${RT(6,113,"out of the oil")}`)()},
door:{s:(()=>`${rSh(170,240,120,6)}${rBox(60,20,220,220,10,"white",{r:2})}<rect x="72" y="32" width="196" height="196" fill="url(#r_whiteF)"/>
 <rect x="72" y="32" width="196" height="196" fill="none" stroke="#3a3f43" stroke-width="7"/>${rBox(232,110,24,50,10,"chrome",{r:3})}${[50,190].map(y=>rBox(62,y,14,26,6,"chrome",{r:2})).join("")}
 <circle cx="170" cy="130" r="0"/>${rCut("M268 60 H300 V120 H268 Z")}${rClip("rq_g",`M268 60 H300 V120 H268 Z`,`<rect x="268" y="60" width="32" height="60" fill="#e9eef0"/><rect x="272" y="64" width="14" height="52" rx="5" fill="#2a2f33"/><rect x="276" y="76" width="6" height="28" fill="#6b7a86"/><rect x="288" y="64" width="8" height="52" fill="#c0281c" opacity=".5"/>`)}
 ${rL(276,90,300,20,336,14,"Gasket with magnet","end")}${rL(292,110,310,160,336,170,"Heater wire (freezer)","end")}${rL(244,136,200,236,336,244,"Latch and handle","end")}${rL(70,200,30,230,6,240,"Hinges")}`)()},
drain:{s:(()=>`${rSh(170,236,120,6)}${rBox(40,20,200,40,30,"white",{r:3})}${rCylV(90,60,170,6,"paint",{top:false})}<path d="M90 170 V196 Q90 214 108 214 Q126 214 126 196 V180 H260" fill="none" stroke="#3a444c" stroke-width="14"/><path d="M90 170 V196 Q90 214 108 214 Q126 214 126 196 V180 H260" fill="none" stroke="url(#r_paintV)" stroke-width="11"/>
 <path d="M84 70 V170" stroke="#c0281c" stroke-width="2" stroke-dasharray="4 3"/>
 ${rL(108,210,60,236,6,244,"Trap outside the box")}${rL(84,120,30,110,6,106,"Heat tape (freezer)")}${rL(200,180,250,210,336,220,"Pitched to a drain","end")}${rL(140,40,240,40,336,36,"Unit cooler drain pan","end")}`)()},
box:{s:(()=>`${rSh(170,240,150,8)}${rBox(40,70,240,160,60,"white",{r:1})}${[80,120,160,200,240].map(x=>`<line x1="${x}" y1="70" x2="${x}" y2="230" stroke="#c9ced1"/>`).join("")}
 ${rBox(130,110,70,120,4,"white",{r:1})}<rect x="186" y="160" width="8" height="24" rx="2" fill="url(#r_chromeV)"/>${rBox(176,24,100,22,30,"paint",{r:2})}${rFins(190,30,40,14,2)}
 ${rL(60,140,20,40,6,30,"Insulated panels, 4 in. foam")}${rL(220,40,280,10,336,14,"Condensing unit","end")}${rL(160,170,240,236,336,244,"Door","end")}`)()},
heaters:{s:(()=>`${rSh(170,230,130,6)}${rFins(40,40,260,150,3)}${[70,120,170].map(y=>`<rect x="36" y="${y}" width="268" height="6" rx="3" fill="#ff7a3a"/><rect x="36" y="${y}" width="268" height="2" rx="1" fill="#ffd0a0"/>`).join("")}<rect x="40" y="190" width="260" height="12" fill="#ff7a3a" opacity=".85"/>
 ${rL(160,73,200,20,336,16,"Electric rods in the coil","end")}${rL(200,196,250,226,336,238,"Drain pan heater","end")}${RT(6,24,"Melt the frost, then stop")}`)()},
term:{s:(()=>`${rSh(170,214,90,6)}${rFins(0,120,340,90,3)}${rBox(130,80,80,40,12,"white",{r:20})}<circle cx="170" cy="100" r="12" fill="url(#r_alV)"/>${rWire("M200 90 C240 70 270 60 340 60","#2f6fd6")}${rWire("M200 96 C244 80 274 76 340 78","#c0281c")}${rWire("M204 102 C250 92 280 94 340 96","#2a2f33")}
 ${rL(160,100,60,60,6,56,"Bimetal disc clamped to the coil")}${RT(6,224,"Ends defrost at about 55°F")}${RT(6,240,"Starts the fans once the coil is cold")}`)()}
});
RILL["cooler:tstat"]=RILL["freezer:tstat"]={s:(()=>`${rSh(170,224,80,6)}<rect x="0" y="0" width="340" height="250" fill="#e9eef0"/>${rBox(110,40,120,170,16,"paint",{r:4,grain:true})}
 <circle cx="170" cy="100" r="40" fill="url(#r_whiteV)"/>${Array.from({length:11},(_,k)=>{const a=(-120+k*24)*Math.PI/180;return `<line x1="${170+30*Math.sin(a)}" y1="${100-30*Math.cos(a)}" x2="${170+38*Math.sin(a)}" y2="${100-38*Math.cos(a)}" stroke="#333" stroke-width="${k%5?.6:1.2}"/>`}).join("")}<text x="132" y="146" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#333">-20</text><text x="196" y="146" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#333">60°F</text>
 <rect x="164" y="64" width="12" height="72" rx="5" fill="url(#r_blackV)" transform="rotate(-40 170 100)"/><circle cx="170" cy="100" r="6" fill="url(#r_chromeV)"/>
 ${rHose("M170 210 C170 240 260 230 300 180 V60","#b8693a",1.6)}${rCylV(300,40,80,5,"cu",{ry:1.6})}
 ${rL(170,100,60,40,6,36,"Set point dial")}${rL(300,60,300,20,336,14,"Remote bulb in the box air","end")}${rL(200,190,262,210,336,222,"Switches the liquid solenoid","end")}`)()};
