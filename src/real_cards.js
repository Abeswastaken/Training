
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
receiver:{only:["cooler","freezer"],s:(()=>{const win="M90 110 H230 V170 H90 Z";
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
"cooler:door":{s:(()=>`${rSh(170,240,120,6)}${rBox(60,20,220,220,10,"white",{r:2})}<rect x="72" y="32" width="196" height="196" fill="url(#r_whiteF)"/>
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
/* shared art pieces reused by several cards */
const rArtGasValve=()=>GVART;
const GVART=`${rCylH(0,92,150,9,"iron")}${rThrH(82,92,150,9)}${rCylH(256,340,150,9,"iron")}${rHexH(254,150,10,13,"al")}
 ${rBox(90,110,150,70,40,"al",{r:6,grain:true})}${rBox(100,84,70,22,24,"black",{r:3})}
 ${rWire("M116 0 C114 40 118 70 118 90","#f2f2ee")}${rWire("M134 0 C138 40 132 70 132 90","#c0281c")}
 ${rCylV(198,92,104,12,"red",{ry:4})}<rect x="186" y="90.5" width="24" height="3" rx="1.5" fill="#7e160d"/>
 ${rHexV(228,98,6,8,"al")}${rCylV(228,86,99,6.5,"black",{ry:2.2})}
 <circle cx="104" cy="168" r="4.2" fill="url(#r_brassV)"/><path d="M101.5 168 h5" stroke="#4c3407" stroke-width="1.1"/><circle cx="224" cy="168" r="4.2" fill="url(#r_brassV)"/><path d="M221.5 168 h5" stroke="#4c3407" stroke-width="1.1"/>`;
/* printed circuit board */
const rPcb=(x,y,w,h)=>`${rBox(x,y,w,h,6,"blue",{r:3})}<rect x="${x+3}" y="${y+3}" width="${w-6}" height="${h-6}" rx="2" fill="#1f6b3a"/>${Array.from({length:Math.floor(w/12)},(_,k)=>`<path d="M${x+8+k*12} ${y+8} V${y+h-8}" stroke="#2e8a50" stroke-width=".8" opacity=".6"/>`).join("")}`;
Object.assign(RILL,{
"furnace:board":{s:(()=>`${rSh(170,226,130,6)}${rPcb(50,40,240,170)}
 ${rBox(80,60,46,34,10,"black",{r:2})}${rBox(140,60,46,34,10,"black",{r:2})}${rBox(214,64,50,30,8,"white",{r:2})}
 ${Array.from({length:7},(_,k)=>`<rect x="${70+k*18}" y="170" width="12" height="16" fill="#e8e8e2"/>${rTermS(76+k*18,178)}<text x="${76+k*18}" y="198" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#e9f5ec">${["R","W","Y","G","C","",""][k]}</text>`).join("")}
 <circle cx="248" cy="130" r="5" fill="#d0312d"/><circle cx="248" cy="130" r="5" fill="url(#rGlass)"/><rect x="200" y="146" width="16" height="10" fill="#e8c33a"/>
 ${rL(103,74,60,24,6,20,"Relays: inducer, igniter, blower")}${rL(250,134,300,160,336,170,"LED: flash codes","end")}${rL(208,150,300,214,336,226,"3 A fuse","end")}${rL(130,178,90,232,6,244,"Thermostat terminals")}`)()},
inducer:{s:(()=>`${rSh(170,226,120,6)}
 <path d="M80 160 C80 90 130 66 180 70 C240 74 270 110 270 150 V200 H220 V176 C210 196 190 210 170 210 C120 210 80 196 80 160 Z" fill="url(#r_galvV)" filter="url(#rGrain)"/>
 ${rCylV(176,40,128,30,"black",{ry:8})}<rect x="150" y="68" width="50" height="22" rx="2" fill="#e9e6da"/>${rCylV(244,210,250,12,"white",{top:false})}${rBand(232,214,13,24,"white")}
 ${rArr("M120 140 Q150 150 180 140","#e0662a")}${rArr("M244 210 V246","#e0662a")}
 ${rL(176,80,100,40,6,36,"Motor pulls flue gas through")}${rL(110,180,60,226,6,238,"Housing (blower wheel inside)")}${rL(250,226,290,226,336,214,"To the vent","end")}${rL(220,110,280,90,336,86,"Pressure tap","end")}`)()},
ps:{s:(()=>`${rSh(170,214,90,6)}${rBox(110,60,120,120,20,"black",{r:60})}<circle cx="170" cy="120" r="44" fill="url(#r_blackV)"/><circle cx="170" cy="120" r="30" fill="#26292c"/>
 ${rCylH(230,280,120,5,"white")}${rHose("M280 120 C320 120 320 60 340 40","#cfe3ea",4)}${[150,170,190].map(x=>`<rect x="${x-4}" y="166" width="8" height="18" fill="url(#r_chromeV)"/>`).join("")}
 ${rL(170,120,60,40,6,36,"Diaphragm senses the inducer's suction")}${rL(260,120,280,180,336,190,"Hose to the inducer tap","end")}${rL(170,182,120,226,6,238,"Normally open; closes on draft")}`)()},
igniter:{only:["furnace"],s:(()=>`${rSh(170,214,120,6)}${rBox(70,110,70,40,14,"white",{r:4})}
 <path d="M140 118 H290 Q300 118 300 128 V132 Q300 142 290 142 H140 Z" fill="#7a7e80"/><path d="M180 122 H290 V138 H180 Z" fill="#ff8a3a"/><path d="M180 122 H290 V126 H180 Z" fill="#ffd0a0"/>
 ${rWire("M70 124 C40 124 30 160 0 170","#f2f2ee")}${rWire("M70 136 C44 136 36 180 0 190","#f2f2ee")}
 ${rL(240,130,240,70,336,64,"Silicon nitride: glows at about 2,500°F","end")}${rL(100,130,60,80,6,76,"Ceramic base")}${RT(6,236,"Never touch the element: skin oil cracks it")}`)()},
fsensor:{s:(()=>`${rSh(170,214,120,6)}${rBox(60,110,60,40,10,"white",{r:4})}<path d="M120 126 H230 Q260 126 270 96" fill="none" stroke="#7d868c" stroke-width="5"/><path d="M120 126 H230 Q260 126 270 96" fill="none" stroke="url(#r_chromeH)" stroke-width="3.6"/>
 ${rFlameC(276,120,70,18)}${rWire("M60 130 C30 130 20 170 0 180","#2f6fd6")}
 ${rL(250,118,200,70,6,66,"Rod sits in the flame")}${rL(276,90,300,40,336,36,"Flame conducts a µA signal","end")}${RT(6,236,"Dirty rod: clean with fine abrasive pad")}`)()},
"furnace:gv":{s:GVART+`${rL(134,30,80,30,6,34,"24 V wires")}${rL(206,92,262,70,336,66,"Gas knob","end")}${rL(228,86,262,44,336,40,"Regulator cap: 3.5 in. w.c.","end")}${rL(104,168,60,232,6,240,"Inlet tap")}${rL(224,168,270,226,336,238,"Outlet (manifold) tap","end")}`},
"furnace:burners":{s:(()=>`${rSh(170,214,130,6)}${rCylV(170,40,52,0,"al")}${[60,110,160,210].map(y=>"").join("")}
 ${[0,1,2,3].map(k=>{const y=60+k*36;return `${rCylH(80,230,y,12,"al",{end:true})}<ellipse cx="80" cy="${y}" rx="4" ry="12" fill="url(#r_alV)"/>${rFlameC(260,y+6,0,0)}<path d="M232 ${y-8} Q300 ${y} 232 ${y+8} Z" fill="url(#rFlame)" opacity=".9"/><path d="M232 ${y-4} Q262 ${y} 232 ${y+4} Z" fill="#bfe1ff"/>${rHexH(60,y,12,5,"brass")}`}).join("")}${rCylV(52,40,200,6,"al",{top:false})}
 ${rL(150,60,150,24,6,20,"In-shot burners fire sideways")}${rL(60,96,30,220,6,232,"Manifold + orifices")}${RT(336,244,"Flames go into the heat exchanger","end")}`)()},
"furnace:hx":{s:(()=>`${rSh(170,236,120,6)}${[0,1,2,3].map(k=>{const x=70+k*52;return `<path d="M${x} 220 V80 Q${x} 50 ${x+22} 44 Q${x+44} 50 ${x+44} 80 V220 Z" fill="url(#r_paintV)" filter="url(#rGrain)"/><path d="M${x+10} 210 V80" stroke="#fff" stroke-opacity=".2" stroke-width="4"/>${rArr(`M${x+22} 210 C${x+30} 160 ${x+14} 120 ${x+22} 70`,"#e0662a")}`}).join("")}
 ${rArr("M30 230 V90","#2f6fd6")}${rArr("M310 230 V90","#2f6fd6")}
 ${rL(92,150,40,40,6,30,"Flue gas inside the clamshells")}${rL(310,150,320,40,336,30,"Room air outside","end")}${RT(170,248,"A crack lets flue gas into the house air","middle")}`)()},
hx2:{s:(()=>`${rSh(170,232,130,6)}${rBox(50,50,240,150,30,"cab",{r:3})}${rFins(62,62,216,126,2.4)}${Array.from({length:8},(_,k)=>`<path d="M62 ${74+k*15} H278" stroke="#7a8a96" stroke-width="3" opacity=".5"/>`).join("")}
 ${rCylV(270,200,246,6,"white",{top:false})}<path d="M266 222 q4 6 0 12" stroke="#5aa0ff" stroke-width="2" fill="none"/>
 ${rL(150,110,80,20,6,16,"Stainless tubes and fins")}${rL(270,226,300,230,336,240,"Condensate drains out","end")}${RT(6,244,"Pulls latent heat: 90%+ furnaces")}`)()},
trap:{s:(()=>`${rSh(170,232,110,6)}<path d="M120 40 V150 Q120 200 170 200 Q220 200 220 150 V90 H300" fill="none" stroke="#bcbfb8" stroke-width="30"/><path d="M120 40 V150 Q120 200 170 200 Q220 200 220 150 V90 H300" fill="none" stroke="url(#r_whiteV)" stroke-width="26"/>
 <path d="M120 150 Q120 196 170 196 Q216 196 216 150" fill="none" stroke="#5aa0ff" stroke-width="18" opacity=".6"/>
 ${rL(120,60,60,40,6,36,"From the secondary HX")}${rL(170,196,100,230,6,240,"Water seal blocks flue gas")}${rL(280,90,300,140,336,150,"To a drain or pump","end")}`)()},
limit:{s:(()=>`${rSh(170,214,110,6)}${rBox(90,100,150,40,8,"galv",{r:2})}${rBox(130,70,70,40,8,"white",{r:20})}<circle cx="165" cy="90" r="12" fill="url(#r_alV)"/>${rCylH(240,320,120,4,"chrome")}
 ${rWire("M140 70 C120 40 80 30 0 30","#c0281c")}${rWire("M190 70 C210 40 250 30 340 30","#c0281c")}
 ${rL(165,90,60,80,6,76,"Bimetal disc")}${rL(290,120,300,170,336,180,"Senses supply air near the HX","end")}${RT(6,236,"Opens on overheat: dirty filter, slow blower")}`)()},
rollout:{s:(()=>`${rSh(170,214,90,6)}${rBox(120,90,100,60,10,"white",{r:24})}<circle cx="170" cy="120" r="18" fill="url(#r_alV)"/><rect x="200" y="96" width="20" height="14" rx="3" fill="url(#r_redV)"/>
 ${rFlameC(80,200,60,16,true)}${rArr("M96 170 Q120 150 140 140","#e0662a")}
 ${rL(210,100,280,60,336,56,"Manual reset button","end")}${rL(170,120,250,180,336,190,"Trips on flame rolling out","end")}${RT(6,24,"Reset only after finding why")}`)()},
bcap:{s:(()=>`${rSh(170,214,60,6)}${rCylV(170,60,200,40,"al",{ry:10})}${[150,190].map(x=>`<rect x="${x-4}" y="44" width="8" height="18" fill="url(#r_chromeV)"/>`).join("")}<rect x="132" y="110" width="76" height="40" fill="#f4f1ea"/><text x="170" y="130" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="700" fill="#333">7.5 µF</text><text x="170" y="144" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#333">370 VAC</text>
 ${rL(150,50,80,30,6,26,"Two terminals")}${rL(208,130,270,130,336,126,"Match µF and voltage","end")}${RT(6,236,"Weak cap: slow, hot blower motor")}`)()},
flue:{s:(()=>`${rSh(170,226,140,6)}${rCylV(90,30,222,18,"galv",{top:true})}${[90,150,210].map(y=>`<path d="M72 ${y} H108" stroke="#000" stroke-opacity=".2" stroke-width="2"/>`).join("")}
 ${rCylV(240,30,222,16,"white",{top:true})}${[80,160].map(y=>`<rect x="222" y="${y}" width="36" height="12" rx="3" fill="url(#r_whiteV)"/>`).join("")}
 ${rArr("M90 208 V50","#e0662a")}${rArr("M240 208 V50","#9aa3a9")}
 ${RT(90,20,"80%: B-vent","middle")}${RT(240,20,"90%+: PVC","middle")}${RT(170,246,"Hot, dry flue vs cool, wet flue","middle")}`)()},
gasline:{s:(()=>`${rSh(170,232,120,6)}${rCylV(80,0,120,7,"iron",{top:false})}${rCylH(80,180,126,13,"iron",{grain:true})}${rCylV(80,112,140,13,"iron",{top:false,grain:true})}${rCylV(80,140,200,7,"iron",{top:false})}${rCylV(80,198,214,10,"iron")}
 ${rCylH(94,140,126,7,"iron")}${rBox(140,110,26,32,10,"brass",{r:3})}<rect x="146" y="98" width="40" height="6" rx="2" fill="url(#r_yelH)"/>${rFlex("M166 126 C220 126 220 180 290 180")}
 ${rL(80,60,40,40,6,36,"Gas drop")}${rL(80,206,40,230,6,240,"Sediment trap")}${rL(160,100,220,60,226,56,"Shutoff")}${rL(260,178,300,210,336,220,"To the furnace gas valve","end")}`)()},
door:{only:["furnace"],s:(()=>`${rSh(170,232,120,6)}${rBox(70,30,150,190,20,"cab",{r:2})}<rect x="80" y="40" width="130" height="170" fill="none" stroke="#8a9094"/>${rBox(220,100,30,40,8,"white",{r:3})}<rect x="208" y="112" width="14" height="14" rx="2" fill="url(#r_whiteV)"/>
 ${rWire("M250 106 C290 100 300 80 340 70","#2a2f33")}${rWire("M250 130 C290 140 300 160 340 170","#2a2f33")}
 ${rL(215,118,260,30,336,26,"Plunger switch","end")}${RT(6,240,"Door off = 120 V off to the furnace")}`)()},
coalarm:{s:(()=>RILL.coal?RILL.coal.s:"")()},
});
RILL.coal={s:`${rSh(170,214,80,6)}${rBox(100,40,140,160,18,"white",{r:24})}${Array.from({length:6},(_,k)=>`<rect x="${122+k*16}" y="56" width="8" height="30" rx="4" fill="#cfd4d6"/>`).join("")}${rLcd(128,104,84,34,["0","PPM"],18)}<circle cx="170" cy="168" r="14" fill="url(#r_chromeV)"/><text x="170" y="171" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" font-weight="700" fill="#333">TEST</text><circle cx="208" cy="168" r="4" fill="#1e9a4a"/>${rL(128,130,60,226,6,238,"Shows ppm, keeps the peak")}${rL(208,168,262,168,336,164,"Power light","end")}${rL(180,70,262,40,336,36,"UL 2034 sensor","end")}`,only:["furnace","oil"]};
RILL.coalarm=RILL.coal;RILL["freezer:door"]=RILL["cooler:door"];
/* ---------- oil furnace ---------- */
Object.assign(RILL,{
"oil:primary":{s:(()=>`${rSh(170,222,120,6)}${rBox(70,60,180,130,20,"paint",{r:4})}<rect x="84" y="74" width="152" height="40" rx="3" fill="#2f383f"/><text x="160" y="99" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="700" fill="#dfe5e8">OIL PRIMARY</text>
 <circle cx="214" cy="146" r="13" fill="url(#r_redV)"/><circle cx="214" cy="146" r="13" fill="url(#rGlass)"/><circle cx="108" cy="140" r="5" fill="#e8c33a"/><circle cx="108" cy="140" r="5" fill="url(#rGlass)"/>
 ${[0,1,2,3].map(k=>`<rect x="${100+k*30}" y="166" width="20" height="14" fill="#e8e8e2"/>${rTermS(110+k*30,173)}`).join("")}${["T","T","F","F"].map((t,k)=>`<text x="${110+k*30}" y="162" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#e8ecee">${t}</text>`).join("")}
 ${rWire("M170 180 C170 214 120 222 70 240","#e8c33a")}${rWire("M200 180 C200 214 230 222 280 240","#e8c33a")}${rWire("M110 180 C100 206 40 206 0 214","#c0281c")}
 ${rL(214,146,280,124,336,120,"Reset button","end")}${rL(108,140,60,140,6,136,"LED codes")}${rL(126,173,60,180,6,176,"T T: thermostat")}${rL(230,190,300,200,336,196,"F F: cad cell","end")}${RT(170,30,"No flame proven in time: lockout","middle")}`)()},
"oil:cad":{s:(()=>`${rSh(170,226,100,6)}${rCylH(80,190,130,40,"black",{rx:12})}<ellipse cx="190" cy="130" rx="14" ry="40" fill="url(#r_blackV)"/><ellipse cx="192" cy="130" rx="11" ry="34" fill="#d9a441"/>
 ${[-18,-9,0,9,18].map(dy=>`<path d="M186 ${130+dy} q3 -3 6 0 t6 0" stroke="#8a5a1a" stroke-width="1.6" fill="none"/>`).join("")}<ellipse cx="192" cy="130" rx="11" ry="34" fill="url(#rGlass)"/>
 ${rWire("M80 116 C40 116 30 70 0 60","#e8c33a")}${rWire("M80 144 C40 144 30 196 0 206","#e8c33a")}${rFlameC(290,170,60,28,1)}${rArr("M276 130 H214","#f2a53a")}
 ${rL(196,108,240,40,336,36,"CdS face looks at the flame","end")}${RT(6,20,"Yellow leads to F F")}${RT(170,226,"Dark: over 20 kΩ   Flame: under 1600 Ω","middle")}`)()},
"oil:igniter":{s:(()=>`${rSh(170,226,130,6)}${rBox(70,70,190,70,26,"paint",{r:4})}<text x="165" y="110" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="700" fill="#e8ecee">14,000+ V</text>
 ${rCylH(40,70,104,6,"chrome")}${rCylV(46,104,124,8,"chrome")}
 ${[130,200].map(x=>`<path d="M${x} 140 ${Array.from({length:6},(_,k)=>`l${k%2?-6:6} 6`).join(" ")}" stroke="url(#r_chromeV)" stroke-width="3" fill="none"/>`).join("")}${rCylH(110,240,190,4,"chrome")}${rCylH(110,240,206,4,"chrome")}
 ${rL(46,120,30,170,6,182,"Hinge: tips up to open the burner")}${rL(204,160,270,200,336,222,"Springs touch the electrode rods","end")}${rL(200,90,260,40,336,36,"Solid-state spark","end")}`)()},
electrodes:{s:(()=>`${rSh(170,222,130,6)}${rCylH(30,250,100,5,"chrome")}${rCylH(30,250,150,5,"chrome")}
 <path d="M250 100 L284 120 M250 150 L284 130" stroke="url(#r_chromeV)" stroke-width="7" stroke-linecap="round"/><path d="M250 100 L284 120 M250 150 L284 130" stroke="#c9ced1" stroke-width="5" stroke-linecap="round"/>
 ${rCylH(70,200,100,11,"white",{end:true})}${rCylH(70,200,150,11,"white",{end:true})}${rCylH(170,262,190,13,"brass")}${rHexH(262,190,14,14,"brass")}<path d="M276 184 H290 L296 190 L290 196 H276 Z" fill="url(#r_brassH)"/>
 <path d="M284 121 l3 3 -3 3 3 3" stroke="#4aa8ff" stroke-width="2" fill="none"/>
 ${rL(130,90,110,40,6,36,"Ceramic insulators")}${rL(286,125,300,70,336,66,"Gap about 1/8–5/32 in.","end")}${rL(240,190,200,232,6,240,"Nozzle below: tips ahead of and above it")}`)()},
nozzle:{s:(()=>`${rSh(130,200,100,6)}<rect x="40" y="110" width="50" height="40" rx="4" fill="url(#r_brassH)"/>${Array.from({length:8},(_,k)=>`<line x1="${44+k*6}" y1="110" x2="${44+k*6}" y2="150" stroke="#6a4a08" stroke-width="1"/>`).join("")}
 ${rHexH(90,130,44,30,"brass")}${rCylH(134,170,130,22,"brass")}<path d="M170 108 L196 120 V140 L170 152 Z" fill="url(#r_brassH)"/><circle cx="196" cy="130" r="2.5" fill="#222"/>
 <path d="M198 130 L330 50 M198 130 L330 210" stroke="#d9a441" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M260 92 Q270 130 260 168" stroke="#d9a441" stroke-width="10" stroke-opacity=".3" fill="none"/>
 <text x="112" y="134" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#4a3205">.65 80°A</text>
 ${rL(60,112,40,60,6,56,"Strainer")}${rL(112,120,140,40,150,36,"Stamped: 0.65 GPH, 80°, A (hollow)")}${rL(268,130,300,240,336,240,"Fine hollow cone of spray","end")}`)()},
"oil:pump":{s:(()=>`${rSh(170,222,130,6)}${rBox(80,70,150,120,18,"paint",{r:8})}<circle cx="155" cy="130" r="44" fill="url(#r_paintV)"/><circle cx="155" cy="130" r="44" fill="none" stroke="#000" stroke-opacity=".3"/>${[0,1,2,3,4,5].map(k=>rBolt(155+36*Math.cos(k*Math.PI/3),130+36*Math.sin(k*Math.PI/3))).join("")}
 ${rCylH(20,80,130,8,"chrome")}${rHexH(66,130,14,9,"brass")}${rCylH(240,300,92,5,"cu")}${rHexH(232,92,12,8,"brass")}${rHexV(110,48,22,9,"brass")}<rect x="104" y="40" width="12" height="4" fill="#222"/>${rCylH(20,72,180,6,"cu")}${rHexH(72,180,12,8,"brass")}
 ${rL(40,130,30,40,6,36,"Shaft to the motor coupling")}${rL(110,46,170,18,180,12,"Pressure adjusting screw")}${rL(270,92,300,140,336,150,"Nozzle line","end")}${rL(40,180,40,226,6,238,"Inlet from the tank")}${RT(336,200,"100–200 psi","end")}`)()},
"oil:burner":{s:(()=>`${rSh(170,232,150,6)}${rCylV(70,70,170,34,"red",{ry:10})}${rBox(100,80,100,110,20,"red",{r:8})}<circle cx="150" cy="135" r="30" fill="#5a1209"/>${[0,1,2,3,4,5,6,7].map(k=>`<path d="M150 135 L${150+28*Math.cos(k*Math.PI/4)} ${135+28*Math.sin(k*Math.PI/4)}" stroke="#9a1d12" stroke-width="5"/>`).join("")}
 ${rBox(110,56,80,24,14,"paint",{r:3})}${rCylH(200,300,140,22,"galv",{end:true,bore:true})}${rCylH(140,180,206,10,"paint")}${rFlameC(316,140,16,14)}
 <rect x="120" y="190" width="60" height="10" fill="#1d2124"/>
 ${rL(60,120,30,50,6,46,"Motor: fan + pump")}${rL(150,64,190,30,200,24,"Igniter (on top)")}${rL(250,140,280,90,336,86,"Air tube","end")}${rL(300,140,310,190,336,214,"Retention head","end")}${rL(160,206,120,240,6,240,"Pump under the housing")}`)()},
"oil:tank":{s:(()=>`${rSh(170,232,140,6)}<rect x="70" y="40" width="200" height="170" rx="40" fill="url(#r_paintH)" filter="url(#rGrain)"/><rect x="70" y="40" width="200" height="170" rx="40" fill="none" stroke="#000" stroke-opacity=".3"/>
 <path d="M90 210 V232 M250 210 V232" stroke="#2c3237" stroke-width="6"/>${rCylV(110,14,42,7,"iron")}${rCylV(150,20,42,5,"iron")}<rect x="200" y="22" width="30" height="20" rx="3" fill="url(#rGlass)" stroke="#555"/><rect x="204" y="28" width="22" height="10" fill="#e8c33a"/>
 ${rCylH(270,300,196,5,"cu")}${rCylV(310,170,214,12,"red",{ry:4})}
 ${rL(110,30,70,20,64,16,"Fill","end")}${rL(150,28,170,14,176,10,"Vent")}${rL(228,32,290,40,336,40,"Gauge: check first","end")}${rL(310,190,300,240,336,240,"Filter at the outlet","end")}${RT(170,130,"275 gal","middle","#e8ecee")}`)()},
ofilter:{only:["oil"],s:(()=>`${rSh(170,222,90,6)}${rBox(110,40,120,30,14,"red",{r:3})}${rCylV(170,70,200,52,"red",{ry:12,top:false})}<path d="M118 70 H222" stroke="#000" stroke-opacity=".3"/>
 ${rCylH(40,110,55,5,"cu")}${rHexH(98,55,12,8,"brass")}${rCylH(230,300,55,5,"cu")}${rHexH(230,55,12,8,"brass")}${rBolt(170,38,5)}${rBolt(126,48)}${rBolt(214,48)}
 ${rArr("M50 50 H90","#c98a2a")}${rArr("M250 50 H300","#c98a2a")}
 ${rL(170,40,200,14,210,10,"Lid bolt")}${rL(170,140,90,170,6,180,"Cartridge inside")}${rL(222,140,280,140,336,130,"Changed every year","end")}${RT(170,232,"Clogged: high vacuum at the pump","middle")}`)()},
oilline:{s:(()=>`${rSh(170,224,140,6)}${rHose("M0 200 C80 200 100 140 160 140 H230","#7a8288",14)}${rHose("M0 200 C80 200 100 140 160 140 H230","#b87346",5)}
 ${rBox(230,110,80,70,14,"paint",{r:8})}${rCylV(200,80,140,4,"brass",{top:false})}${rGauge(200,60,30,"chrome",-60,"in. Hg")}
 ${rL(60,190,40,120,6,110,"Copper line in a sleeve")}${rL(270,140,300,220,336,236,"Fuel pump","end")}${rL(226,50,280,20,336,16,"Vacuum gauge","end")}${RT(6,236,"Single pipe: keep it under 6 in. Hg")}`)()},
chamber:{s:(()=>`${rSh(170,232,140,6)}${rBox(60,40,220,180,16,"iron",{r:4})}<rect x="80" y="60" width="180" height="150" rx="8" fill="#d9c7a8"/><rect x="96" y="76" width="148" height="134" rx="6" fill="#2a1a12"/>
 <path d="M106 150 Q170 80 236 150 Q170 196 106 150 Z" fill="url(#rFlame)"/><path d="M130 150 Q170 116 210 150 Q170 172 130 150 Z" fill="#ffd27a" opacity=".8"/>${rCylH(0,96,150,16,"galv",{end:true})}
 ${rCylH(270,300,120,5,"iron",{end:true})}
 ${rL(88,70,60,20,6,16,"Ceramic fiber liner")}${rL(40,150,30,200,6,240,"Air tube fires in here")}${rL(290,120,310,200,336,228,"Overfire draft port","end")}${RT(336,242,"-0.01 to -0.02 in. w.c.","end")}`)()},
"oil:hx":{s:(()=>`${rSh(170,232,110,6)}${rCylV(170,40,210,70,"iron",{ry:16,grain:true})}${rCylH(240,320,80,16,"galv",{end:true})}
 ${rArr("M170 200 V70 H240","#e0662a")}${rArr("M70 220 V60","#3d7de0")}${rArr("M270 220 V120","#3d7de0")}
 ${rL(130,120,60,20,6,16,"Flue gas inside")}${rL(290,80,300,30,336,26,"To the flue","end")}${rL(270,180,300,226,336,240,"House air outside","end")}${RT(6,240,"Net stack 350–500°F")}`)()},
baro:{s:(()=>`${rSh(170,222,150,6)}${rCylH(20,320,80,26,"galv",{end:true})}${rCylV(170,106,150,26,"galv",{top:false})}<ellipse cx="170" cy="170" rx="44" ry="44" fill="url(#r_galvV)"/><ellipse cx="170" cy="170" rx="36" ry="36" fill="url(#r_blackV)"/>
 <path d="M170 134 V206" stroke="#555" stroke-width="2"/><rect x="138" y="166" width="64" height="8" fill="url(#r_galvH)"/>${rCylH(196,226,170,7,"iron")}
 ${rL(150,180,90,210,6,220,"Gate swings in")}${rL(220,170,280,200,336,212,"Weight sets the draft","end")}${rArr("M60 160 Q120 150 136 166","#3d7de0")}${RT(6,150,"Room air")}${RT(170,30,"Holds breech at -0.02 to -0.04 in.","middle")}${rArr("M60 80 H300","#e0662a")}`)()},
"oil:chimney":{s:(()=>`${rSh(190,236,90,6)}${rBox(150,20,100,210,24,"tan",{r:0})}${Array.from({length:14},(_,k)=>`<path d="M150 ${34+k*14} H250" stroke="#7a5532" stroke-width="1"/>${Array.from({length:4},(_,j)=>`<path d="M${(k%2?162:176)+j*28} ${20+k*14} v14" stroke="#7a5532"/>`).join("")}`).join("")}
 ${rCylV(200,10,210,30,"white",{ry:8})}${rCylH(20,170,150,16,"galv")}${rBox(164,196,30,20,6,"iron",{r:1})}
 ${rArr("M200 200 V20","#e0662a")}${rArr("M40 150 H170","#e0662a")}
 ${rL(220,60,280,40,336,36,"Flue liner","end")}${rL(80,150,60,110,6,100,"Flue pipe")}${rL(178,206,100,232,6,240,"Cleanout door")}${RT(336,140,"Hot gas rises","end")}`)()},
fanlimit:{s:(()=>`${rSh(170,232,110,6)}${rBox(90,40,150,120,16,"cab",{r:4})}<circle cx="165" cy="98" r="44" fill="#fbfaf4" stroke="#666"/>${[["100",-60],["125",-20],["200",60]].map(([t,a])=>{const r=a*Math.PI/180;return `<path d="M165 98 L${165+40*Math.sin(r)} ${98-40*Math.cos(r)}" stroke="${t=="200"?"#c0281c":"#2a6db8"}" stroke-width="3"/><text x="${165+52*Math.sin(r)}" y="${101-52*Math.cos(r)}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#333">${t}</text>`}).join("")}<circle cx="165" cy="98" r="4" fill="#333"/>
 ${rCylV(165,160,236,6,"chrome",{top:false})}
 ${rL(132,72,60,40,6,36,"Fan off 100°F")}${rL(152,62,170,20,180,16,"Fan on 125°F")}${rL(200,78,280,60,336,56,"Limit 200°F: burner off","end")}${rL(165,210,240,220,336,236,"Probe in the plenum","end")}`)()},
"oil:analyzer":{s:(()=>`${rSh(130,232,90,6)}${rBox(70,30,120,190,14,"black",{r:12})}${rLcd(84,46,92,100,["O2 4.0%","CO2 12.6% · CO 12","Stack 420°F · 84%"],12)}
 ${[0,1,2].map(k=>`<circle cx="${100+k*30}" cy="180" r="9" fill="url(#r_paintV)"/>`).join("")}${rHose("M190 180 C230 180 230 120 270 120","#2a2f33",5)}${rCylH(270,330,120,3,"chrome",{end:true})}
 <circle cx="290" cy="200" r="22" fill="#fbfaf4" stroke="#999"/><circle cx="290" cy="200" r="7" fill="#efe9dc"/>
 ${rL(300,120,300,80,336,70,"Probe in the flue","end")}${rL(290,200,250,236,336,240,"Smoke spot: 0","end")}${rL(84,80,40,24,6,14,"Reads O2, CO2, CO, stack")}`)()}
});
/* ---------- hydronic air handler ---------- */
const rTherm=(cx,cy,t)=>`${rCylV(cx,cy-12,cy+2,5,"brass",{top:false})}<circle cx="${cx}" cy="${cy-34}" r="22" fill="url(#r_chromeV)"/><circle cx="${cx}" cy="${cy-34}" r="18" fill="#fbfaf4"/><text x="${cx}" y="${cy-30}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#333">${t}</text><circle cx="${cx}" cy="${cy-34}" r="18" fill="url(#rGlass)"/>`;
Object.assign(RILL,{
"ahu:board":{s:(()=>`${rSh(170,226,130,6)}${rPcb(50,50,240,160)}${rBox(80,70,46,34,10,"black",{r:2})}${rBox(140,70,46,34,10,"black",{r:2})}${rBox(214,70,50,40,8,"paint",{r:2})}
 ${Array.from({length:8},(_,k)=>`<rect x="${64+k*26}" y="166" width="18" height="16" fill="#e8e8e2"/>${rTermS(73+k*26,174)}<text x="${73+k*26}" y="196" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7.5" font-weight="700" fill="#e9f5ec">${["R","W","G","C","ZV","ZV","ES","ES"][k]}</text>`).join("")}
 ${rL(103,82,60,30,6,26,"Relays: zone valve, blower")}${rL(238,90,280,30,336,26,"24 V transformer","end")}${rL(99,174,60,230,6,240,"W: heat call")}${rL(242,174,300,230,336,240,"End switch: fires boiler + pump","end")}`)()},
"ahu:zv":{s:(()=>`${rSh(170,226,140,6)}${rCylH(0,340,180,14,"cu")}${rHexH(110,180,16,20,"brass")}${rHexH(214,180,16,20,"brass")}<rect x="126" y="160" width="88" height="40" rx="6" fill="url(#r_brassH)"/>
 ${rCylV(170,130,160,10,"brass",{top:false})}${rBox(110,60,120,70,18,"white",{r:6})}<path d="M232 96 L268 84" stroke="url(#r_chromeH)" stroke-width="6" stroke-linecap="round"/>
 ${rWire("M130 60 C120 30 60 30 30 20","#c0281c")}${rWire("M150 60 C140 36 80 40 50 36","#e8c33a")}${rWire("M190 60 C200 36 260 36 300 30","#e8c33a")}${rArr("M20 210 H90","#d0312d")}
 ${rL(170,96,110,140,6,140,"Motor head")}${rL(260,86,300,110,336,120,"Manual-open lever","end")}${rL(280,32,300,50,336,60,"End switch leads","end")}${rL(170,180,190,230,336,240,"Opens in about 30 s","end")}`)()},
"ahu:circ":{s:(()=>`${rSh(170,226,140,6)}${rCylH(0,90,180,14,"cu")}${rCylH(250,340,180,14,"cu")}<rect x="84" y="156" width="14" height="48" rx="3" fill="url(#r_ironH)"/><rect x="242" y="156" width="14" height="48" rx="3" fill="url(#r_ironH)"/>
 <path d="M98 166 H242 V194 H98 Z" fill="url(#r_ironH)"/><ellipse cx="170" cy="150" rx="56" ry="40" fill="url(#r_ironV)"/>${rCylV(170,60,140,46,"paint",{ry:14})}${rBox(196,74,40,30,8,"paint",{r:3})}
 ${rArr("M110 180 H140","#d0312d")}${rArr("M200 180 H236","#d0312d")}
 ${rL(170,90,110,30,6,26,"Wet-rotor motor")}${rL(91,190,60,230,6,240,"Flanges")}${rL(216,90,280,40,336,36,"Wiring box","end")}${RT(336,226,"Pump away from the tank","end")}`)()},
"ahu:coil":{s:(()=>`${rSh(170,232,150,6)}${rBox(50,50,230,160,14,"galv",{r:2})}${rFins(60,60,210,140,3)}
 ${[76,104,132,160,188].map(y=>`<path d="M60 ${y} H270" stroke="url(#r_cuH)" stroke-width="6"/>`).join("")}${rCylV(296,40,200,9,"cu")}${rCylH(296,340,58,6,"cu")}${rCylH(296,340,190,6,"cu")}
 ${rArr("M340 58 H306","#d0312d")}${rArr("M306 190 H340","#3d7de0")}
 ${rL(150,104,110,24,6,16,"Copper tubes, aluminum fins")}${rL(320,58,320,26,336,20,"Hot water in","end")}${rL(320,190,320,220,336,240,"Cooler water out","end")}${RT(6,240,"House air goes across the fins")}`)()},
"ahu:vent":{s:(()=>`${rSh(170,226,100,6)}${rCylH(30,310,200,14,"cu")}${rCylV(170,150,190,8,"brass",{top:false})}${rHexV(170,140,12,14,"brass")}${rCylV(170,60,140,30,"brass",{ry:9})}${rCylV(170,40,62,8,"chrome")}<circle cx="170" cy="38" r="5" fill="url(#r_redV)"/>
 ${rArr("M180 40 Q200 20 230 20","#9aa3a9")}
 ${rL(150,100,90,80,6,76,"Float inside")}${rL(170,50,240,40,336,36,"Cap: air out","end")}${rL(100,200,80,232,6,240,"Coil's high point")}${RT(336,150,"Bleed till solid water","end")}`)()},
"ahu:trid":{s:(()=>`${rSh(170,226,90,6)}${rGauge(170,110,72,"brass",-70,"PSI · °F")}<line x1="170" y1="110" x2="${170+54*Math.sin(.6)}" y2="${110-54*Math.cos(.6)}" stroke="#2a6db8" stroke-width="2" stroke-linecap="round"/>${rCylV(170,186,222,7,"brass",{top:false})}
 ${rL(130,90,60,40,6,36,"Red: about 12 psi cold")}${rL(205,82,270,40,336,36,"Blue: water °F","end")}${RT(170,240,"Pressure climbs a few psi when hot","middle")}`)()},
"ahu:aquastat":{s:(()=>`${rSh(170,226,120,6)}${rBox(80,40,160,130,18,"cab",{r:4})}${rDial(160,100,34,250)}<text x="160" y="148" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#333">AQUASTAT</text>
 ${rCylH(40,80,160,8,"brass")}${rCylH(0,40,160,5,"cu",{end:true})}${rBox(160,170,60,30,6,"black",{r:2})}
 ${rL(170,100,250,30,336,26,"Set about 180°F","end")}${rL(30,160,30,210,6,222,"Bulb in the boiler well")}${rL(200,186,290,210,336,222,"Wiring","end")}`)()},
"ahu:boiler":{s:(()=>`${rSh(170,236,130,6)}${rBox(70,50,180,180,26,"cab",{r:2})}<rect x="90" y="150" width="140" height="70" fill="#1e2226"/>${[0,1,2,3,4].map(k=>rFlameC(110+k*25,214,22,9)).join("")}
 ${rCylV(120,10,40,12,"cu",{top:false})}${rCylV(210,10,40,12,"cu",{top:false})}${rCylV(165,6,30,24,"galv")}${rBox(90,66,140,64,4,"iron",{r:1})}${[0,1,2,3,4,5].map(k=>`<path d="M${104+k*22} 70 V126" stroke="#000" stroke-opacity=".5"/>`).join("")}
 ${rL(120,20,60,16,6,12,"Supply")}${rL(210,20,280,16,336,12,"Return","end")}${rL(100,98,40,200,6,240,"Cast iron sections")}${rL(160,206,280,226,336,240,"Burners","end")}`)()},
"ahu:expt":{s:(()=>`${rSh(170,232,90,6)}${rCylH(0,340,40,10,"cu")}${rCylV(170,40,70,6,"brass",{top:false})}${rClip("ex","M110 90 H230 V220 H110 Z",rCylV(170,90,210,60,"blue",{ry:16}))}<path d="M110 90 Q170 70 230 90 V150 H110 Z" fill="#9bc4e6" opacity=".9"/><path d="M110 150 Q170 170 230 150" stroke="#222" stroke-width="3" fill="none"/>
 <ellipse cx="170" cy="90" rx="60" ry="16" fill="url(#r_blueT)"/>${rCylV(170,226,236,4,"brass")}
 ${rL(140,120,60,110,6,106,"Water side")}${rL(200,154,280,140,336,130,"Diaphragm","end")}${rL(178,230,260,226,336,240,"Air valve: charge to fill psi","end")}`)()},
"ahu:fill":{s:(()=>`${rSh(170,226,140,6)}${rCylH(0,340,180,12,"cu")}${rBox(110,150,120,60,12,"brass",{r:8})}${rCylV(170,90,150,26,"brass",{ry:8})}${rBolt(170,86,6)}<path d="M196 110 L250 80" stroke="url(#r_chromeH)" stroke-width="6" stroke-linecap="round"/>
 ${rBox(30,160,50,40,10,"brass",{r:6})}${rArr("M240 230 H320","#3d7de0")}
 ${rL(160,80,110,40,6,36,"Adjusting screw: about 12 psi")}${rL(246,84,290,80,336,70,"Fast-fill lever","end")}${rL(56,180,40,226,6,238,"Backflow preventer")}`)()},
"ahu:bal":{s:(()=>`${rSh(170,226,140,6)}${rCylH(0,340,180,12,"cu")}${rHexH(110,180,14,18,"brass")}${rHexH(216,180,14,18,"brass")}<rect x="124" y="160" width="92" height="40" rx="8" fill="url(#r_brassH)"/>${rCylV(170,110,160,12,"brass",{top:false})}${rCylH(130,210,104,8,"red",{end:true})}
 ${[138,202].map(x=>`${rCylV(x,200,224,5,"brass",{top:false})}<circle cx="${x}" cy="226" r="6" fill="url(#r_redV)"/>`).join("")}<rect x="150" y="164" width="40" height="12" fill="#fbfaf4"/><text x="170" y="174" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="8" fill="#222">0 1 2 3 4</text>
 ${rL(190,104,250,60,336,56,"Handle sets the flow","end")}${rL(170,170,110,120,6,116,"Turns scale")}${rL(138,226,80,232,6,240,"Pressure taps (meter)")}${RT(336,240,"About 4 GPM here","end")}`)()},
fdelay:{s:(()=>`${rSh(170,226,140,6)}${rCylH(0,340,150,14,"cu")}${rBox(130,120,70,44,8,"black",{r:4})}<path d="M126 164 Q170 180 214 164" stroke="url(#r_chromeH)" stroke-width="3" fill="none"/>
 ${rWire("M200 130 C240 110 260 80 320 70","#e8c33a")}${rWire("M200 140 C240 120 270 100 330 96","#e8c33a")}
 ${rL(160,140,100,60,6,56,"Strapped to the coil supply")}${rL(310,74,300,40,336,36,"To the control","end")}${RT(6,236,"Blower on about 110°F, off about 10°F lower")}`)()},
readout:{s:(()=>`${rSh(170,232,150,6)}${rCylH(0,340,120,10,"cu")}${rCylH(0,340,210,10,"cu")}${rTherm(80,110,"180°")}${rTherm(80,200,"160°")}${rBox(220,96,70,48,8,"white",{r:4})}${rLcd(230,106,50,26,["4.0","GPM"],12)}
 ${rArr("M140 120 H200","#d0312d")}${rArr("M200 210 H140","#3d7de0")}
 ${rL(102,76,140,40,150,36,"EWT: entering water")}${rL(102,166,140,170,150,170,"LWT: leaving water")}${RT(336,186,"Btu/h = 500 × GPM × ΔT","end")}`)()}
});
/* ---------- controls (pneumatic "pneu", DDC "ddc") ---------- */
RILL.filter.only=["split","hp","furnace","oil","ahu","air"];RILL.afilter=RILL.filter;
const rValve3=(pneu,mix)=>`${rSh(170,232,130,6)}${rCylH(0,120,190,12,"cu")}${rCylH(220,340,190,12,"cu")}${rCylV(170,214,250,12,"cu",{top:false})}
 <rect x="110" y="166" width="120" height="48" rx="12" fill="url(#r_brassH)"/>${rHexH(100,190,14,17,"brass")}${rHexH(226,190,14,17,"brass")}${rHexV(170,206,14,17,"brass")}${rCylV(170,110,166,6,"chrome",{top:false})}
 ${pneu?`<path d="M100 100 Q170 40 240 100 Z" fill="url(#r_galvV)"/><rect x="96" y="98" width="148" height="10" rx="2" fill="url(#r_galvH)"/>${rBolt(104,103)}${rBolt(236,103)}${rCylV(170,40,62,3,"cu",{top:false})}`:`${rBox(110,46,120,64,14,"black",{r:6})}<rect x="150" y="60" width="40" height="14" fill="#e8c33a"/>${rWire("M230 70 C270 60 290 30 340 24","#2a2f33")}`}
 ${mix?rArr("M20 210 H90","#d0312d")+rArr("M320 210 H250","#d0312d")+rArr("M190 220 V246","#d0312d"):rArr("M190 246 V220","#3d7de0")+rArr("M90 210 H20","#3d7de0")+rArr("M250 210 H320","#3d7de0")}
 ${RT(6,176,mix?"A: from coil":"A: to coil")}${RT(336,176,mix?"B: from bypass":"B: to bypass","end")}${RT(196,244,mix?"AB: out":"AB: in")}`;
const rCoil=(hot)=>`${rSh(170,232,150,6)}${rBox(40,40,220,170,14,"galv",{r:2})}${rFins(50,50,200,150,3)}${[66,92,118,144,170].map(y=>`<path d="M50 ${y} H250" stroke="#b87346" stroke-width="5"/>`).join("")}${rCylV(282,30,200,10,"cu")}${rCylH(282,340,52,6,"cu")}${rCylH(282,340,186,6,"cu")}
 ${hot?"":`<path d="M30 214 H270 L262 230 H38 Z" fill="url(#r_galvV)"/>`}${rArr("M340 52 H300",hot?"#d0312d":"#3d7de0")}${rArr("M300 186 H340",hot?"#e0662a":"#6aa6d6")}`;
Object.assign(RILL,{
"pneu:aircomp":{s:(()=>`${rSh(170,236,150,6)}${rTankH(170,196,280,34,"paint")}${[60,280].map(x=>`<rect x="${x-6}" y="226" width="12" height="12" fill="#2c3237"/>`).join("")}
 ${rBox(70,80,70,72,12,"iron",{r:4})}${Array.from({length:6},(_,k)=>`<rect x="66" y="${86+k*10}" width="78" height="4" fill="url(#r_ironH)"/>`).join("")}${rCylH(180,270,130,26,"blue",{end:true})}${rBox(140,96,30,60,8,"yel",{r:3})}${rHose("M100 152 C100 170 140 170 150 162","#9aa3a9",5)}
 ${rL(100,90,60,40,6,36,"Pump (finned head)")}${rL(225,130,270,60,336,56,"Motor","end")}${rL(155,120,190,90,336,90,"Belt guard","end")}${rL(120,196,90,250,6,248,"Receiver tank")}${RT(336,248,"Runs 1/3 to 1/2 the time","end")}`)()},
"pneu:receiver":{s:(()=>`${rSh(170,232,150,6)}${rTankH(170,150,290,56,"paint")}${rCylV(230,70,96,8,"brass",{top:false})}${rCylV(230,46,72,12,"brass",{ry:4})}<path d="M242 54 L270 44" stroke="#b8892c" stroke-width="4" stroke-linecap="round"/>${rCylV(170,206,230,8,"iron",{top:false})}${rBox(156,224,28,18,6,"black",{r:3})}
 ${rL(230,58,290,30,336,26,"Relief: 10–25 psi over cut-out","end")}${rL(170,232,110,244,6,244,"Auto drain")}${RT(170,156,"ASME, 125+ psi","middle","#e8ecee")}`)()},
"pneu:pswitch":{s:(()=>`${rSh(170,232,110,6)}${rBox(100,40,140,110,16,"cab",{r:6})}<rect x="120" y="60" width="100" height="40" rx="3" fill="#2f383f"/><text x="170" y="86" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="13" font-weight="700" fill="#e8ecee">70 / 90</text>
 ${rCylV(170,150,200,7,"brass",{top:false})}${rHexV(170,196,12,10,"brass")}${rCylH(30,330,226,12,"paint")}${rWire("M240 120 C280 120 300 90 340 80","#2a2f33")}${rWire("M240 132 C290 132 310 112 340 106","#2a2f33")}
 ${rL(170,90,90,30,6,26,"On at 70 psi, off at 90")}${rL(170,170,100,200,6,200,"Diaphragm senses tank")}${rL(320,82,300,50,336,46,"Motor circuit","end")}`)()},
"pneu:dryer":{s:(()=>`${rSh(170,232,140,6)}${rBox(70,40,190,170,20,"white",{r:6})}<rect x="90" y="60" width="150" height="50" fill="#3a3f44"/>${rFins(94,64,142,42,4)}<rect x="96" y="132" width="70" height="30" rx="3" fill="#1a1d20"/><text x="131" y="152" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="#9fe6a8">DP 38°F</text><circle cx="208" cy="146" r="7" fill="#2fbf5a"/><circle cx="208" cy="146" r="7" fill="url(#rGlass)"/>
 ${rCylH(0,70,180,8,"galv")}${rCylH(260,340,180,8,"galv")}${rCylV(150,210,236,4,"cu",{top:false})}${rArr("M10 196 H60","#3d7de0")}${rArr("M280 196 H330","#3d7de0")}
 ${rL(160,84,190,24,200,20,"Condenser (it's a small A/C)")}${rL(131,147,60,120,6,110,"Dew point")}${rL(150,232,100,246,6,248,"Water drains out")}${RT(336,226,"Dry air out","end")}`)()},
"pneu:afilter":{s:(()=>`${rSh(170,232,90,6)}${rCylH(0,340,60,10,"galv")}${rBox(130,40,80,40,10,"al",{r:4})}${rCylV(170,80,190,32,"white",{top:false,ry:8})}<rect x="138" y="80" width="64" height="110" fill="#e8f1f8" opacity=".55"/>${rCylV(170,96,180,16,"tan",{ry:4})}<rect x="138" y="80" width="64" height="110" fill="url(#rGlass)"/>${rCylV(170,190,216,6,"black",{top:false})}
 ${rL(170,140,90,140,6,136,"5 micron element")}${rL(200,110,260,110,336,106,"Clear bowl","end")}${rL(170,212,240,236,336,240,"Drain","end")}${RT(6,240,"First filter: solids")}${rArr("M10 40 H110","#3d7de0")}`)()},
"pneu:ofilter":{s:(()=>`${rSh(170,232,90,6)}${rCylH(0,340,60,10,"galv")}${rBox(130,40,80,40,10,"al",{r:4})}${rCylV(170,80,190,32,"white",{top:false,ry:8})}<rect x="138" y="80" width="64" height="110" fill="#e8f1f8" opacity=".55"/>${rCylV(170,96,160,16,"white",{ry:4})}<rect x="138" y="168" width="64" height="22" fill="#d9b44a" opacity=".7"/><rect x="138" y="80" width="64" height="110" fill="url(#rGlass)"/>${rCylV(170,190,216,6,"black",{top:false})}
 ${rL(170,130,90,130,6,126,"Coalescing fibers")}${rL(200,178,260,160,336,156,"Oil + water drops","end")}${rL(170,212,240,236,336,240,"Drain","end")}${RT(6,240,"Second filter: oil mist")}${rArr("M10 40 H110","#3d7de0")}`)()},
"pneu:prv":{s:(()=>`${rSh(170,232,150,6)}${rCylH(0,340,180,8,"galv")}${rBox(130,150,80,60,10,"al",{r:6})}${rCylV(170,90,150,26,"al",{ry:8})}${rCylV(170,60,92,6,"chrome")}<path d="M164 58 h12" stroke="#222" stroke-width="2"/>
 ${rCylV(70,140,174,4,"brass",{top:false})}${rGauge(70,110,30,"chrome",80,"90")}${rCylV(270,140,174,4,"brass",{top:false})}${rGauge(270,110,30,"chrome",-30,"20")}
 ${rL(170,62,200,24,210,20,"Adjusting screw")}${RT(70,236,"Tank 90 psi","middle")}${RT(270,236,"Main about 20 psi","middle")}`)()},
"pneu:restrictor":{s:(()=>`${rSh(170,220,120,6)}${rCylH(20,320,120,4,"cu")}${rCylV(170,124,220,4,"cu",{top:false})}<rect x="130" y="104" width="80" height="32" rx="8" fill="url(#r_brassH)"/><circle cx="170" cy="120" r="3" fill="#111"/>
 ${rArr("M30 104 H110","#3d7de0")}${rArr("M230 104 H310","#3d7de0")}
 ${rL(170,120,190,40,200,36,"Orifice about 0.005 in.")}${RT(6,146,"Main air in")}${RT(336,146,"Branch out","end")}${rL(174,200,240,220,336,226,"To a one-pipe stat","end")}`)()},
"pneu:tstatp":{s:(()=>`${rSh(170,232,100,6)}${rBox(100,30,140,190,14,"tan",{r:8})}<rect x="114" y="44" width="112" height="162" rx="5" fill="#efe6d2"/>${rDial(170,96,32,40,"#c0281c")}
 <path d="M130 156 C150 146 170 166 190 156 S220 150 220 160" stroke="#b87346" stroke-width="5" fill="none"/><circle cx="214" cy="176" r="5" fill="#666"/><path d="M196 160 L214 172" stroke="#444" stroke-width="2"/>${rCylV(140,220,246,4,"cu",{top:false})}${rCylV(200,220,246,4,"cu",{top:false})}
 ${rL(170,96,80,30,6,26,"Setpoint dial")}${rL(150,154,60,170,6,170,"Bimetal")}${rL(214,176,280,170,336,170,"Flapper + nozzle","end")}${RT(126,244,"M","end")}${RT(214,244,"B")}${RT(336,90,"DA: branch rises","end")}${RT(336,104,"as it warms","end")}`)()},
"pneu:hvalve":{s:rValve3(true,true)+rL(170,60,240,40,336,36,"Diaphragm, 3–7 psi, N.O.","end")},
"pneu:cvalve":{s:rValve3(true,false)+rL(170,60,240,40,336,36,"Diaphragm, 9–13 psi, N.C.","end")},
"ctl:hcoil":{s:rCoil(true)+rL(150,92,110,24,6,16,"Copper tubes, aluminum fins")+RT(6,240,"First 10% of flow: a third of the heat")},
"ctl:ccoil":{s:rCoil(false)+rL(150,92,110,24,6,16,"45°F water, air out low 50s")+rL(150,222,120,246,6,248,"Drain pan")},
"ddc:ctrl":{s:(()=>`${rSh(170,226,140,6)}${rBox(40,50,260,150,14,"black",{r:6})}<rect x="90" y="90" width="120" height="34" rx="3" fill="url(#zLcd)"/><text x="150" y="112" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="#1f2a22">RM 72 SP 72</text><circle cx="240" cy="100" r="5" fill="#2fbf5a"/><circle cx="260" cy="100" r="5" fill="#e8c33a"/>
 ${Array.from({length:12},(_,k)=>`<rect x="${52+k*20}" y="56" width="16" height="16" fill="#2c9a4a"/>${rTermS(60+k*20,64)}<rect x="${52+k*20}" y="176" width="16" height="16" fill="#2c9a4a"/>${rTermS(60+k*20,184)}`).join("")}
 ${rL(80,64,60,24,6,20,"AI: sensors · DI: contacts")}${rL(80,184,60,226,6,236,"AO: 2–10 V · DO: relays")}`)()},
"ddc:xfmr":{s:(()=>`${rSh(170,226,110,6)}${rBox(100,60,130,130,14,"galv",{r:3})}<rect x="122" y="84" width="86" height="82" fill="url(#r_cuV)"/>${Array.from({length:12},(_,k)=>`<line x1="122" y1="${88+k*6.5}" x2="208" y2="${88+k*6.5}" stroke="#7a3a1a" stroke-width="1"/>`).join("")}${rBox(240,100,24,40,6,"yel",{r:3})}
 ${rWire("M130 60 C130 30 80 24 40 20","#2a2f33")}${rWire("M150 60 C150 34 100 34 60 36","#f0f0f0")}${rWire("M200 190 C200 220 260 230 320 230","#c0281c")}
 ${rL(60,30,40,60,6,70,"120 V primary")}${rL(252,120,290,90,336,86,"Fuse","end")}${rL(260,228,280,206,336,206,"24 VAC, 75 VA, Class 2","end")}`)()},
"ddc:bas":{s:(()=>`${rSh(170,232,150,6)}${rBox(30,30,270,180,10,"black",{r:10})}<rect x="44" y="44" width="242" height="152" fill="#f6f7f4"/><text x="56" y="62" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#333">ZONE TREND, 30 MIN</text>
 <path d="M56 130 H274" stroke="#3d7de0" stroke-dasharray="4 3"/><path d="M56 160 L90 150 L120 156 L160 126 L190 132 L230 118 L274 110" stroke="#d0312d" stroke-width="2.5" fill="none"/><path d="M56 186 L120 176 L180 140 L274 150" stroke="#2c9a4a" stroke-width="2" fill="none"/>
 ${rL(240,130,250,224,336,236,"Setpoint","end")}${rL(200,128,160,224,6,236,"Room")}${RT(276,80,"Sawtooth = hunting","end")}`)()},
"ddc:rsens":{s:(()=>`${rSh(170,226,70,6)}${rBox(120,40,90,150,10,"white",{r:10})}${Array.from({length:6},(_,k)=>`<rect x="138" y="${60+k*12}" width="54" height="4" rx="2" fill="#d5dadb"/>`).join("")}<text x="165" y="168" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#888">10K</text>
 ${rWire("M165 190 C165 220 220 230 300 236","#2a2f33")}
 ${rL(196,120,260,70,336,66,"10,000 Ω at 77°F","end")}${RT(336,82,"32,650 Ω at 32°F","end")}${RT(6,120,"Open wire:")}${RT(6,134,"reads very cold")}`)()},
"ddc:sat":{s:(()=>`${rSh(170,226,150,6)}${rBox(20,120,300,90,16,"galv",{r:2})}${rBox(140,50,60,40,10,"black",{r:4})}${rClip("sd","M20 120 H320 V210 H20 Z",rCylV(170,90,190,4,"chrome",{top:false}))}${rCylV(170,90,120,4,"chrome",{top:false})}
 ${rArr("M40 196 H300","#9aa3a9")}${rL(170,160,100,240,6,240,"Probe inside the duct")}${rL(190,70,260,40,336,36,"After the coils","end")}`)()},
"ddc:oat":{s:(()=>`${rSh(170,226,90,6)}<rect x="0" y="0" width="340" height="250" fill="#d9c8b0" opacity=".25"/>${rBox(120,40,100,140,10,"white",{r:6})}${Array.from({length:6},(_,k)=>`<path d="M126 ${60+k*20} H214 L206 ${70+k*20} H134 Z" fill="url(#r_whiteV)"/>`).join("")}<circle cx="290" cy="40" r="22" fill="#f2c94c"/>
 ${rL(170,110,90,200,6,210,"Shaded housing")}${RT(336,90,"Out of the sun,","end")}${RT(336,104,"away from exhaust","end")}`)()},
"ddc:oadmp":{s:(()=>`${rSh(150,232,130,6)}${rBox(30,40,200,180,12,"galv",{r:2})}${[0,1,2,3,4].map(k=>`<path d="M42 ${62+k*34} L218 ${50+k*34} L218 ${62+k*34} L42 ${74+k*34} Z" fill="url(#r_alV)"/>`).join("")}${rBox(244,90,60,70,10,"black",{r:4})}<path d="M244 126 H220" stroke="#666" stroke-width="4"/>
 ${rL(130,90,90,20,6,16,"Blades")}${rL(274,120,300,190,336,206,"24 VAC actuator, 2–10 V","end")}${RT(336,222,"Springs closed","end")}`)()},
"ddc:dfilter":{s:(()=>`${rSh(150,232,130,6)}${rBox(30,50,180,170,10,"galv",{r:2})}<rect x="40" y="60" width="160" height="150" fill="#efe9d8"/>${Array.from({length:16},(_,k)=>`<path d="M${44+k*10} 60 l5 150" stroke="#cdbf9a"/>`).join("")}${rBox(240,60,70,56,10,"white",{r:4})}<text x="275" y="94" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="700" fill="#333">ΔP</text>
 ${rHose("M260 116 V150 H200","#c0281c",3)}${rHose("M290 116 V226 H200","#3d7de0",3)}
 ${rL(120,130,90,20,6,16,"Pleated filters")}${rL(275,90,300,30,336,26,"Closes at 1.0 in. w.c.","end")}${RT(6,240,"Clean filters drop about 0.45 in.")}`)()},
"ddc:fstat":{s:(()=>`${rSh(160,232,150,6)}${rBox(30,50,230,170,10,"galv",{r:2})}${rFins(40,60,210,150,3)}<path d="M50 80 H240 V120 H50 V160 H240 V196" stroke="#c9ced1" stroke-width="3" fill="none"/><path d="M50 80 H240 V120 H50 V160 H240 V196" stroke="#555" stroke-width="1" fill="none"/>${rBox(260,40,64,48,8,"cab",{r:4})}<circle cx="300" cy="74" r="6" fill="url(#r_redV)"/>
 ${rL(150,120,110,30,6,26,"Capillary across the coil face")}${rL(300,74,300,110,336,116,"Manual reset","end")}${RT(336,240,"Trips at 35–40°F","end")}${RT(6,240,"Never jumper it")}`)()},
"ddc:hvalveE":{s:rValve3(false,true)+rL(170,70,100,30,6,26,"24 VAC, 2–10 V, springs open")},
"ddc:cvalveE":{s:rValve3(false,false)+rL(170,70,100,30,6,26,"24 VAC, 2–10 V, springs shut")},
"ddc:sfanE":{s:(()=>`${rSh(130,232,110,6)}<circle cx="120" cy="140" r="80" fill="url(#r_galvV)"/><circle cx="120" cy="140" r="62" fill="#2c3237"/>${Array.from({length:24},(_,k)=>{const a=k/24*2*Math.PI;return `<path d="M${120+40*Math.cos(a)} ${140+40*Math.sin(a)} L${120+58*Math.cos(a+.2)} ${140+58*Math.sin(a+.2)}" stroke="#c9ced1" stroke-width="3"/>`}).join("")}<circle cx="120" cy="140" r="20" fill="url(#r_paintV)"/>
 ${rBox(240,40,70,70,10,"paint",{r:4})}${rWire("M275 110 V200","#2a2f33")}<ellipse cx="275" cy="170" rx="18" ry="8" fill="none" stroke="#e8c33a" stroke-width="7"/>
 ${rL(275,74,230,20,226,16,"Starter (DO)")}${rL(290,170,300,220,336,236,"Current switch (DI)","end")}${rL(100,90,60,24,6,20,"Fan")}`)()}
});
RILL["pneu:sfan"]=RILL.blower;["pneu","ddc"].forEach(s=>{RILL[s+":hcoil"]=RILL["ctl:hcoil"];RILL[s+":ccoil"]=RILL["ctl:ccoil"];RILL[s+":zone"]=RILL.room});
/* ---------- airflow ---------- */
const rDuctH=(x1,x2,y,h,ins)=>`${ins?`<rect x="${x1}" y="${y-6}" width="${x2-x1}" height="${h+12}" rx="6" fill="#e3d6a8"/>${Array.from({length:Math.floor((x2-x1)/14)},(_,k)=>`<path d="M${x1+7+k*14} ${y-6} v4 M${x1+7+k*14} ${y+h+2} v4" stroke="#b9a874"/>`).join("")}`:""}<rect x="${x1}" y="${y}" width="${x2-x1}" height="${h}" fill="url(#r_galvH)" filter="url(#rGrain)"/>${Array.from({length:Math.floor((x2-x1)/60)},(_,k)=>`<rect x="${x1+58+k*60}" y="${y}" width="5" height="${h}" fill="url(#r_galvV)"/>`).join("")}`;
Object.assign(RILL,{
"air:furn":{s:(()=>`${rSh(170,240,110,6)}${rBox(100,30,140,200,24,"cab",{r:2})}<rect x="112" y="44" width="116" height="80" fill="#1e2226"/>${[0,1,2,3].map(k=>rFlameC(130+k*27,116,22,8)).join("")}<rect x="112" y="132" width="116" height="90" fill="#2c3237"/><circle cx="170" cy="177" r="36" fill="url(#r_galvV)"/><circle cx="170" cy="177" r="28" fill="#1d2124"/>${Array.from({length:20},(_,k)=>{const a=k/20*2*Math.PI;return `<path d="M${170+18*Math.cos(a)} ${177+18*Math.sin(a)} L${170+27*Math.cos(a+.25)} ${177+27*Math.sin(a+.25)}" stroke="#aeb6bb" stroke-width="2.5"/>`}).join("")}
 ${rArr("M60 200 H104","#3d7de0")}${rArr("M170 30 V6","#e0662a")}
 ${rL(150,90,60,40,6,36,"Heat exchanger + burners")}${rL(200,177,280,190,336,200,"Blower below, pushes up","end")}${RT(6,220,"Return in")}`)()},
"air:ecoil":{s:(()=>{const A="M90 196 L166 54 H174 L250 196 H226 L170 92 L114 196 Z";return `${rSh(170,236,130,6)}${rBox(50,30,240,190,16,"white",{r:2})}<rect x="64" y="44" width="212" height="162" fill="#2c3237"/>${rClip("ac2",A,`<rect x="80" y="50" width="180" height="150" fill="#9aa3a9"/>${rFins(80,50,180,150,3)}${[70,100,130,160,190].map(y=>`<path d="M80 ${y} H260" stroke="#b87346" stroke-width="2"/>`).join("")}`)}<path d="${A}" fill="none" stroke="#555"/><rect x="72" y="194" width="196" height="12" fill="url(#r_blackV)"/>
 ${rArr("M170 236 V150","#3d7de0")}${rL(120,140,60,20,6,16,"A-coil: copper + aluminum fins")}${rL(240,200,280,226,336,240,"Drain pan","end")}${RT(6,226,"Dry: about 0.20 in.")}${RT(6,240,"Wet: about 20% more")}`})()},
"air:plen":{s:(()=>`${rSh(150,236,110,6)}${rBox(60,40,160,190,14,"galv",{r:1,grain:true})}${rDuctH(220,340,60,50,false)}<circle cx="100" cy="80" r="6" fill="#e8c33a"/><circle cx="100" cy="190" r="6" fill="#e8c33a"/>${rArr("M140 220 V90 H330","#3d7de0")}
 ${rL(100,80,40,50,6,46,"P4: above the coil")}${rL(100,190,40,230,6,240,"P3: below the coil")}${RT(336,140,"P3 − P4 = coil drop","end")}`)()},
"air:trunk":{s:(()=>`${rSh(170,232,160,6)}${rDuctH(10,330,80,70,true)}${rCylV(120,156,214,18,"galv",{top:false})}${rCylV(240,156,214,18,"galv",{top:false})}${rArr("M20 115 H320","#3d7de0")}${rArr("M120 170 V220","#3d7de0")}
 ${rL(60,74,60,30,6,26,"Insulated sheet metal")}${rL(240,200,280,226,336,240,"Takeoffs to each room","end")}${RT(336,26,"900 fpm max","end")}`)()},
"air:damp":{s:(()=>`${rSh(170,232,120,6)}${rCylH(20,320,130,52,"galv",{rx:16,end:true})}${rClip("dm","M20 78 H320 V182 H20 Z",`<ellipse cx="170" cy="130" rx="16" ry="50" fill="url(#r_galvV)" transform="rotate(-30 170 130)"/>`)}<path d="M170 78 V60" stroke="#666" stroke-width="3"/><path d="M150 54 A30 30 0 0 1 190 54" stroke="#444" stroke-width="5" fill="none"/><path d="M170 62 L196 40" stroke="#c0281c" stroke-width="7" stroke-linecap="round"/>
 ${rL(196,40,250,30,336,26,"Locking quadrant","end")}${rL(160,130,90,210,6,220,"Blade across the branch")}${RT(336,226,"Closing adds static","end")}`)()},
"air:flex":{s:(()=>`${rSh(170,232,160,6)}<path d="M10 150 C80 60 160 220 240 120 S320 90 330 90" stroke="#9aa3a9" stroke-width="56" fill="none" stroke-linecap="round"/><path d="M10 150 C80 60 160 220 240 120 S320 90 330 90" stroke="#c4cacf" stroke-width="46" fill="none"/><path d="M10 150 C80 60 160 220 240 120 S320 90 330 90" stroke="#9aa3a9" stroke-width="46" fill="none" stroke-dasharray="2 6"/><path d="M10 140 C80 50 160 210 240 110 S320 80 330 80" stroke="#fff" stroke-opacity=".35" stroke-width="8" fill="none"/>
 ${rL(130,130,100,40,6,30,"Insulated flex: more friction than metal")}${RT(336,226,"Pull it tight; kinks can halve the airflow","end")}`)()},
"air:reg":{s:(()=>`${rSh(170,232,110,6)}<rect x="0" y="0" width="340" height="60" fill="#efece4"/>${rBox(80,60,180,140,10,"white",{r:4})}<rect x="96" y="76" width="148" height="108" fill="#d8dcdc"/>${Array.from({length:9},(_,k)=>`<rect x="100" y="${80+k*11.5}" width="140" height="6" fill="url(#r_whiteV)"/>`).join("")}<rect x="250" y="120" width="20" height="10" rx="2" fill="#888"/>
 ${rArr("M170 200 V244","#3d7de0")}${rL(260,125,300,90,336,86,"Lever damper","end")}${rL(120,120,60,30,6,26,"Ceiling diffuser")}${RT(336,226,"Read it with a flow hood","end")}`)()},
"air:rgrille":{s:(()=>`${rSh(170,236,130,6)}${rBox(40,30,250,190,12,"white",{r:4})}<rect x="56" y="46" width="218" height="158" fill="#2a2f33"/>${Array.from({length:14},(_,k)=>`<rect x="${60+k*15.4}" y="46" width="7" height="158" fill="url(#r_whiteH)"/>`).join("")}
 ${rArr("M170 246 V210","#e0662a")}${rL(120,120,60,20,6,16,"Big grille, low velocity")}${RT(336,240,"Keep it clear","end")}`)()},
"air:rduct":{s:(()=>`${rSh(170,236,150,6)}${rDuctH(10,240,60,70,false)}${rBox(240,40,70,190,10,"galv",{r:1,grain:true})}${rArr("M20 95 H270 V220","#e0662a")}
 ${rL(120,95,90,190,6,190,"Return duct and chase")}${RT(6,206,"700 fpm max")}${RT(6,240,"Undersized return = high static")}`)()},
"air:ports":{s:(()=>`${rSh(170,232,160,6)}${rDuctH(10,330,140,70,false)}<path d="M200 60 C200 100 160 120 160 150 V180 H130" stroke="#222" stroke-width="4" fill="none"/><path d="M200 60 C200 100 160 120 160 150 V180 H130" stroke="#c9ced1" stroke-width="2" fill="none"/>${rBox(190,10,100,60,10,"yel",{r:8})}${rLcd(202,20,76,32,["0.55"],18)}<circle cx="160" cy="140" r="6" fill="#d0312d"/>
 ${rArr("M30 196 H320","#3d7de0")}${rL(132,180,60,120,6,110,"Static tip faces upstream")}${rL(160,140,80,40,6,36,"Port with rubber cap")}${RT(336,90,"in. w.c.","end")}`)()},
"air:attic":{s:(()=>`${rSh(170,232,160,6)}<path d="M10 200 L170 40 L330 200 Z" fill="#8a6a4a"/><path d="M30 200 L170 60 L310 200 Z" fill="#2a1e14"/><rect x="10" y="200" width="320" height="16" fill="#e2d6a8"/>${rDuctH(80,260,160,30,true)}
 <text x="170" y="120" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="20" font-weight="700" fill="#f08a3a">120°F</text>${rArr("M170 130 V150","#f08a3a")}
 ${rL(240,175,280,226,336,240,"Ducts gain heat here","end")}${RT(6,240,"Outdoors + about 25°F")}`)()}
});
RILL["air:filt"]=RILL.filter;RILL["air:blow"]=RILL.blower;
/* ---------- chiller plant ---------- */
const rShell=(x1,x2,cy,r,m)=>`${rCylH(x1,x2,cy,r,m,{rx:r*.3})}<ellipse cx="${x1}" cy="${cy}" rx="${r*.3}" ry="${r}" fill="url(#r_${m}V)"/><ellipse cx="${x2}" cy="${cy}" rx="${r*.3}" ry="${r}" fill="url(#r_${m}V)"/>`;
const rPump=(gpm)=>`${rSh(170,226,150,6)}${rBox(40,200,270,16,6,"iron",{r:1})}${rCylH(40,160,150,34,"blue",{rx:10})}${Array.from({length:8},(_,k)=>`<rect x="${50+k*13}" y="116" width="5" height="68" fill="#000" opacity=".22"/>`).join("")}${rCylH(160,190,150,12,"chrome")}${rCylV(240,110,196,52,"iron",{ry:16,top:false})}<ellipse cx="240" cy="150" rx="52" ry="48" fill="url(#r_ironV)"/><ellipse cx="240" cy="150" rx="20" ry="18" fill="url(#r_galvV)"/>
 ${rCylH(292,340,150,16,"iron")}${rCylV(240,40,104,16,"iron",{top:false})}<rect x="222" y="36" width="36" height="8" fill="url(#r_ironH)"/>
 ${rArr("M320 120 H296","#3d7de0")}${rArr("M240 90 V46","#3d7de0")}${rL(100,150,60,60,6,56,"Motor")}${rL(260,180,290,226,336,240,"Volute + impeller","end")}${RT(6,240,gpm)}`;
Object.assign(RILL,{
"chill:tower":{s:(()=>`${rSh(170,240,150,6)}${rBox(40,60,240,170,20,"galv",{r:2,grain:true})}<rect x="52" y="120" width="216" height="64" fill="#e8ecee"/>${Array.from({length:36},(_,k)=>`<path d="M${56+k*6} 120 l3 8 l-3 8 l3 8 l-3 8 l3 8 l-3 8 l3 8 l-3 8" stroke="#9aa3a9" fill="none"/>`).join("")}
 ${rCylH(52,268,108,5,"paint")}${[70,110,150,190,230].map(x=>`<path d="M${x} 112 l-6 6 M${x} 112 l6 6" stroke="#5d9fd6" stroke-width="2"/>`).join("")}<rect x="52" y="196" width="216" height="26" fill="#5d9fd6" opacity=".7"/>
 ${rCylV(160,20,60,60,"galv",{ry:12})}${[0,1,2,3,4,5].map(k=>`<path d="M${60+k*36} 186 l14 10" stroke="#6f787e" stroke-width="3"/>`).join("")}${rArr("M10 210 H50","#3d7de0")}${rArr("M160 30 V4","#e0662a")}
 ${rL(160,40,240,26,336,20,"Fan stack","end")}${rL(200,108,300,90,336,80,"Spray","end")}${rL(240,150,300,150,336,146,"Fill","end")}${rL(240,206,300,226,336,240,"Basin","end")}${RT(6,196,"Air in")}`)()},
"chill:tfan":{s:(()=>`${rSh(170,232,150,6)}${rCylV(170,40,60,110,"galv",{ry:22})}<ellipse cx="170" cy="40" rx="100" ry="18" fill="#1d2124"/>${[0,1,2,3,4,5].map(k=>{const a=k/6*2*Math.PI;return `<path d="M170 40 L${170+92*Math.cos(a)} ${40+16*Math.sin(a)}" stroke="#c9ced1" stroke-width="6" stroke-linecap="round"/>`}).join("")}<circle cx="170" cy="40" r="8" fill="url(#r_galvV)"/>
 ${rCylV(170,60,140,6,"chrome",{top:false})}${rBox(140,140,60,40,10,"paint",{r:4})}${rCylH(200,260,160,22,"blue",{end:true})}${rBox(30,150,70,80,10,"black",{r:4})}${rLcd(42,162,46,22,["42 Hz"],10)}${rWire("M100 190 C160 210 230 210 250 182","#2a2f33")}
 ${rL(240,40,280,80,336,86,"Fan","end")}${rL(170,160,120,110,6,110,"Gearbox")}${rL(240,160,290,200,336,210,"Motor","end")}${RT(6,244,"VFD: power falls with speed³")}`)()},
"chill:fill":{s:(()=>`${rSh(170,232,150,6)}${rBox(40,30,250,190,14,"white",{r:1})}${Array.from({length:22},(_,k)=>`<path d="M${50+k*11} 34 ${Array.from({length:9},(_,j)=>`l${j%2?-5:5} 20`).join(" ")}" stroke="#aab2b7" stroke-width="2" fill="none"/>`).join("")}
 ${[90,180,250].map(x=>rArr(`M${x} 6 V60`,"#5d9fd6")).join("")}${rArr("M310 230 V100","#e0662a")}
 ${rL(150,120,90,240,6,240,"PVC film sheets")}${RT(336,240,"Air up, water down","end")}`)()},
"chill:basin":{s:(()=>`${rSh(170,232,160,6)}${rBox(20,90,290,130,16,"galv",{r:2})}${rClip("bs","M30 100 H300 V212 H30 Z",`<rect x="30" y="100" width="270" height="112" fill="#2c3237"/><rect x="30" y="126" width="270" height="86" fill="#5d9fd6" opacity=".85"/>`)}<path d="M30 126 H300" stroke="#e8f4ff" stroke-width="2"/>${rCylV(260,212,250,14,"iron",{top:false})}
 ${rL(100,126,60,60,6,56,"Operating level")}${RT(165,176,"1,500 gal","middle","#fff")}${rL(260,232,300,236,336,240,"To the pump","end")}`)()},
"chill:makeup":{s:(()=>`${rSh(170,232,160,6)}${rCylH(0,140,60,6,"cu")}${rBox(140,46,40,30,8,"brass",{r:4})}${rCylV(160,76,96,4,"brass",{top:false})}<path d="M170 70 L250 150" stroke="url(#r_chromeH)" stroke-width="4"/><ellipse cx="260" cy="156" rx="34" ry="18" fill="url(#r_yelV)"/>
 <rect x="30" y="160" width="290" height="60" fill="#5d9fd6" opacity=".8"/><path d="M30 160 H320" stroke="#e8f4ff" stroke-width="2"/>${[0,1,2].map(k=>`<path d="M160 ${100+k*16} v8" stroke="#5d9fd6" stroke-width="3"/>`).join("")}
 ${rL(60,60,40,30,6,26,"City water")}${rL(260,156,300,110,336,100,"Float","end")}${RT(6,240,"Makeup = evaporation + drift + blowdown")}`)()},
"chill:blow":{s:(()=>`${rSh(170,232,160,6)}${rBox(30,40,120,140,12,"white",{r:8})}${rLcd(46,56,88,40,["1452 µS"],13)}<text x="90" y="124" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#555">SETPOINT 1500</text><circle cx="90" cy="150" r="6" fill="#2fbf5a"/>
 ${rCylH(170,340,150,10,"paint")}${rBox(200,130,24,40,6,"black",{r:3})}${rBox(260,100,30,36,8,"black",{r:3})}${rCylV(275,136,150,6,"brass",{top:false})}${rCylV(300,160,240,8,"paint",{top:false})}${rWire("M150 90 C200 80 240 80 268 100","#2a2f33")}${rWire("M150 110 C180 120 200 120 212 130","#2a2f33")}
 ${rL(212,150,190,220,6,226,"Conductivity probe")}${rL(275,110,300,40,336,36,"Blowdown solenoid","end")}${rL(300,220,310,240,336,240,"Drain","end")}`)()},
"chill:cdwp":{s:rPump("900 gpm (3 gpm per ton)")},
"chill:chwp":{s:rPump("720 gpm (2.4 gpm per ton)")},
"chill:strainer":{s:(()=>`${rSh(170,232,150,6)}${rCylH(0,120,90,24,"paint")}${rCylH(220,340,90,24,"paint")}<rect x="110" y="56" width="120" height="68" rx="10" fill="url(#r_ironH)"/><path d="M150 110 L230 200 L250 180 L178 98 Z" fill="url(#r_ironH)"/>${rBox(226,196,34,20,6,"iron",{r:2})}${rClip("ys","M154 112 L232 198 L246 184 L176 102 Z",`<rect x="140" y="90" width="120" height="120" fill="#c9ced1"/>${Array.from({length:30},(_,k)=>`<path d="M${140+k*4} 90 v120" stroke="#666" stroke-width=".8"/>`).join("")}`)}
 ${rArr("M10 50 H100","#3d7de0")}${rL(200,150,260,130,336,126,"Basket screen","end")}${rL(243,214,260,236,336,240,"Blowdown cap","end")}${RT(6,240,"Clogged: condenser flow drops")}`)()},
"chill:chiller":{s:(()=>`${rSh(170,240,160,6)}${rShell(50,290,190,34,"blue")}${rShell(60,280,118,30,"blue")}${rCylV(150,40,88,26,"paint",{ry:8})}${rCylH(180,260,64,24,"paint",{end:true})}${rCylV(150,88,100,8,"paint",{top:false})}
 ${rBox(296,40,40,60,6,"black",{r:3})}<rect x="302" y="50" width="26" height="14" fill="url(#zLcd)"/>
 ${rL(150,64,90,24,6,20,"Compressor")}${rL(230,64,250,20,250,14,"Motor")}${rL(120,118,40,90,6,86,"Condenser")}${rL(120,196,40,240,6,240,"Evaporator")}${rL(316,70,316,140,336,146,"Panel","end")}`)()},
"chill:comp":{s:(()=>`${rSh(170,232,150,6)}<circle cx="120" cy="130" r="92" fill="url(#r_paintV)"/><circle cx="120" cy="130" r="70" fill="#2c3237"/>${Array.from({length:12},(_,k)=>{const a=k/12*2*Math.PI;return `<path d="M${120+22*Math.cos(a)} ${130+22*Math.sin(a)} L${120+66*Math.cos(a+.25)} ${130+66*Math.sin(a+.25)} L${120+66*Math.cos(a+.45)} ${130+66*Math.sin(a+.45)} Z" fill="url(#r_chromeV)"/>`}).join("")}<circle cx="120" cy="130" r="14" fill="url(#r_galvV)"/>
 ${rCylH(212,320,130,46,"blue",{end:true})}${rBox(250,50,50,30,8,"black",{r:3})}
 ${rL(160,110,230,30,240,20,"Guide vanes")}${rL(280,140,300,210,336,226,"Hermetic motor","end")}${RT(6,240,"Vanes open and close to match the load")}`)()},
"chill:cond":{s:(()=>`${rSh(170,232,160,6)}${rClip("cn","M40 80 H300 V180 H40 Z",`${rShell(40,300,130,50,"paint")}${[100,114,128,142,156].map(y=>`<path d="M40 ${y} H300" stroke="#b87346" stroke-width="5"/>`).join("")}`)}${rShell(40,300,130,50,"paint").replace(/^.*?<ellipse/,"<ellipse")}<rect x="16" y="80" width="30" height="100" rx="6" fill="url(#r_blueH)"/>
 ${rCylV(170,40,82,10,"red",{top:false})}${rCylV(200,180,226,8,"cu",{top:false})}${rCylH(0,20,104,8,"galv")}${rCylH(0,20,156,8,"galv")}
 ${rL(170,50,230,20,336,16,"Hot gas in","end")}${rL(200,210,250,226,336,240,"Liquid out","end")}${rL(30,130,40,236,6,240,"2-pass water box")}${rL(120,128,90,40,6,36,"Tower water in the tubes")}`)()},
"chill:evap":{s:(()=>`${rSh(170,232,160,6)}${rShell(40,300,130,50,"paint")}${rClip("ev","M60 90 H290 V172 H60 Z",`<rect x="60" y="90" width="230" height="82" fill="#cfe6f7"/>${[110,124,138,152,166].map(y=>`<path d="M60 ${y} H290" stroke="#b87346" stroke-width="5"/>`).join("")}${Array.from({length:22},(_,k)=>`<circle cx="${70+k*10}" cy="${100+k%3*6}" r="2.5" fill="#fff"/>`).join("")}`)}<rect x="16" y="80" width="30" height="100" rx="6" fill="url(#r_blueH)"/>${rCylV(200,40,82,14,"paint",{top:false})}
 ${rL(200,50,250,20,336,16,"Vapor to the compressor","end")}${rL(150,124,90,40,6,36,"Tubes under boiling R-134a")}${rL(30,130,40,236,6,240,"Chilled water in the tubes")}`)()},
"chill:orifice":{s:(()=>`${rSh(170,200,150,6)}${rCylH(0,150,120,16,"cu")}${rCylH(190,340,120,16,"cu")}${rHexH(140,120,60,26,"paint")}${rClip("of","M190 104 H340 V136 H190 Z",Array.from({length:12},(_,k)=>`<circle cx="${200+k*12}" cy="${112+k%3*7}" r="2.5" fill="#cfe6f7"/>`).join(""))}
 ${rL(60,120,60,60,6,56,"Liquid, high pressure")}${rL(270,120,290,60,336,56,"Flashing, low pressure","end")}${rL(170,130,160,200,6,220,"Fixed orifice plate")}${RT(6,236,"Some chillers use a float valve")}`)()},
"chill:panel":{s:(()=>`${rSh(170,232,140,6)}${rBox(50,20,230,200,12,"black",{r:8})}${rLcd(70,40,190,100,["LCHW 44.0°F","Evap 37 psig · Cond 92","kW/ton 0.56"],14)}${[["#2fbf5a",90],["#e8c33a",130],["#555",170]].map(([c,x])=>`<circle cx="${x}" cy="176" r="9" fill="${c}"/><circle cx="${x}" cy="176" r="9" fill="url(#rGlass)"/>`).join("")}<rect x="210" y="164" width="50" height="24" rx="4" fill="url(#r_redV)"/><text x="235" y="180" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#fff">STOP</text>
 ${RT(6,232,"Safeties: low refrigerant and water temp,")}${RT(6,246,"high head, flow switches, current, surge")}`)()},
"chill:fs":{s:(()=>`${rSh(170,232,160,6)}${rCylH(0,340,170,30,"blue")}${rBox(140,60,60,60,10,"black",{r:4})}${rCylV(170,120,140,8,"brass",{top:false})}${rClip("fs","M0 140 H340 V200 H0 Z",`<path d="M170 140 L196 192" stroke="url(#r_chromeH)" stroke-width="5"/><rect x="186" y="180" width="26" height="8" fill="#c9ced1" transform="rotate(64 196 186)"/>`)}${rArr("M20 210 H120","#fff")}
 ${rL(196,180,250,226,336,240,"Paddle swings with flow","end")}${rL(170,90,100,40,6,36,"Switch")}${RT(6,240,"Proves flow first")}`)()},
"chill:ahu":{s:rCoil(false)+`${rL(150,92,110,24,6,16,"Chilled water coil")}${RT(6,248,"Over 50°F water dries the air poorly")}`}
});
/* ---------- motors + VFD ---------- */
Object.assign(RILL,{
"vfd:disconnect":{s:(()=>`${rSh(120,236,100,6)}${rBox(40,20,160,210,22,"paint",{r:4})}<rect x="56" y="36" width="128" height="178" rx="3" fill="#2f383f"/>${[0,1,2].map(k=>`${rCylV(80+k*40,60,150,11,"white",{ry:4})}<rect x="${72+k*40}" y="90" width="16" height="30" fill="#c99a3a"/><text x="${80+k*40}" y="110" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" font-weight="700" fill="#3a2a06">J</text>`).join("")}
 ${[0,1,2].map(k=>`<rect x="${74+k*40}" y="164" width="12" height="24" fill="url(#r_cuV)"/>${rWire(`M${80+k*40} 188 V250`,["#2a2f33","#c0281c","#2a6db8"][k])}${rWire(`M${80+k*40} 0 V60`,["#2a2f33","#c0281c","#2a6db8"][k])}`).join("")}<rect x="210" y="102" width="50" height="14" rx="7" fill="url(#r_redV)"/>
 ${rL(120,105,170,40,210,36,"Class J fuses")}${rL(250,109,280,140,336,150,"Handle: OFF","end")}${RT(336,212,"Bus stays charged:","end")}${RT(336,226,"wait, then","end")}${RT(336,240,"measure","end")}`)()},
"vfd:dcbus":{s:(()=>`${rSh(170,232,150,6)}${rBox(30,190,280,20,8,"black",{r:2})}${[70,140,210,280].map(x=>`${rCylV(x,70,190,30,"blue",{ry:9})}<ellipse cx="${x}" cy="70" rx="30" ry="9" fill="url(#r_alT)"/><path d="M${x-8} 64 l16 12 M${x+8} 64 l-16 12" stroke="#777"/>${rBolt(x-14,70,3)}${rBolt(x+14,70,3)}`).join("")}
 <path d="M50 54 H300" stroke="#c0281c" stroke-width="5"/>${[56,126,196,266].map(x=>`<path d="M${x} 54 V66" stroke="#c0281c" stroke-width="3"/>`).join("")}
 ${rL(70,130,40,24,6,20,"Electrolytic capacitors")}${RT(336,20,"+ bus about 650 V DC on 480 V","end")}${RT(6,240,"Trips near 800 V high, 380 V low")}`)()},
"vfd:keypad":{s:(()=>`${rSh(170,236,90,6)}${rBox(100,20,140,210,14,"black",{r:10})}${rLcd(114,36,112,60,["45.0 Hz","12.4 A · 650 VDC"],18)}${[["#2fbf5a","RUN",136,130],["#d0312d","STOP",204,130]].map(([c,t,x,y])=>`<circle cx="${x}" cy="${y}" r="16" fill="${c}"/><circle cx="${x}" cy="${y}" r="16" fill="url(#rGlass)"/><text x="${x}" y="${y+3}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#fff">${t}</text>`).join("")}
 <rect x="122" y="164" width="96" height="22" rx="4" fill="url(#r_paintV)"/><text x="170" y="179" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#fff">RESET</text>${[134,170,206].map(x=>`<rect x="${x-12}" y="196" width="24" height="16" rx="3" fill="url(#r_paintV)"/>`).join("")}
 ${rL(170,66,280,16,336,12,"Hz, amps, bus volts","end")}${rL(170,175,90,210,6,220,"Fault reset")}${rL(206,204,280,226,336,240,"Parameter keys","end")}`)()},
"vfd:hsfan":{s:(()=>`${rSh(170,236,150,6)}${rBox(40,40,240,70,12,"black",{r:4})}${[0,1,2].map(k=>`<rect x="${70+k*70}" y="56" width="40" height="40" rx="4" fill="#1a1d20"/><text x="${90+k*70}" y="82" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#e8c33a">IGBT</text>`).join("")}${Array.from({length:22},(_,k)=>`<rect x="${44+k*11}" y="110" width="6" height="90" fill="url(#r_alH)"/>`).join("")}<rect x="40" y="110" width="240" height="8" fill="url(#r_alV)"/>
 ${rBox(110,200,100,34,8,"black",{r:4})}<circle cx="160" cy="217" r="14" fill="#2c3237"/>
 ${rL(90,76,60,24,6,20,"IGBT module")}${rL(200,160,280,200,336,214,"Aluminum fins","end")}${rL(160,217,90,240,6,240,"Cooling fan")}${RT(336,236,"Fan blows across them","end")}`)()},
"vfd:fanload":{s:(()=>`${rSh(170,236,150,6)}<path d="M150 230 C60 230 40 160 40 130 C40 70 90 30 150 30 C220 30 250 70 250 110 V40 H300 V230 Z" fill="url(#r_galvV)" filter="url(#rGrain)"/><circle cx="150" cy="130" r="70" fill="#1d2124"/>${Array.from({length:28},(_,k)=>{const a=k/28*2*Math.PI;return `<path d="M${150+46*Math.cos(a)} ${130+46*Math.sin(a)} L${150+66*Math.cos(a+.18)} ${130+66*Math.sin(a+.18)}" stroke="#aeb6bb" stroke-width="3.5"/>`}).join("")}<circle cx="150" cy="130" r="20" fill="url(#r_galvV)"/>
 ${rArr("M276 50 V10","#9aa3a9")}${rL(200,130,280,160,336,170,"Heavy wheel coasts","end")}${RT(6,226,"Variable torque:")}${RT(6,240,"power ≈ speed³")}`)()},
"vfd:conveyor":{s:(()=>`${rSh(170,230,160,6)}<rect x="40" y="110" width="260" height="20" rx="10" fill="#1d2124"/>${rCylH(30,50,120,22,"chrome",{end:true})}<circle cx="40" cy="120" r="22" fill="url(#r_chromeV)"/><circle cx="300" cy="120" r="22" fill="url(#r_chromeV)"/>${[80,160,230].map(x=>rBox(x,74,40,36,10,"tan",{r:2})).join("")}
 ${rCylH(160,250,190,22,"blue",{end:true})}${rBox(250,166,50,48,8,"paint",{r:4})}<path d="M296 166 L300 142" stroke="#444" stroke-width="6"/><rect x="150" y="212" width="160" height="10" fill="url(#r_ironH)"/>
 ${rL(200,190,140,230,6,240,"Motor")}${rL(275,190,300,236,336,240,"Gearbox","end")}${RT(6,30,"Constant torque: near full")}${RT(6,44,"current even at low speed")}`)()},
"vfd:plate":{s:(()=>`${rSh(170,232,150,6)}<rect x="30" y="30" width="280" height="190" rx="8" fill="url(#r_chromeV)"/><rect x="38" y="38" width="264" height="174" rx="5" fill="none" stroke="#7c8388"/>${[[50,50],[290,50],[50,200],[290,200]].map(([x,y])=>rBolt(x,y,4)).join("")}
 ${[["HP 10","V 460"],["FLA 13.3","RPM 1760"],["SF 1.15","INS F"],["Hz 60","TEFC"]].map((r,i)=>r.map((t,j)=>`<text x="${66+j*130}" y="${88+i*34}" font-family="IBM Plex Mono,monospace" font-size="16" fill="#1d2124" opacity=".85">${t}</text><text x="${65+j*130}" y="${87+i*34}" font-family="IBM Plex Mono,monospace" font-size="16" fill="#fff" opacity=".35">${t}</text>`).join("")).join("")}
 ${RT(6,244,"Set the drive overload to the FLA")}`)()}
});
