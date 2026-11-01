
// Gas tab Parts cards, 340x250, drawn with the 3/4-view kit in real.js (realism sample, round 2).
const GASC="#e8c33a";

GAS.illL={
/* ---------- diaphragm gas meter, cutaway lower front ---------- */
meter:(()=>{const cut="M100 152 L110 147 L120 153 L133 146 L146 152 L160 147 L172 153 L186 146 L198 151 L204 148 V198 H100 Z";
 const dia=(x,flip)=>`<path d="M${x} 158 Q${x-14*flip} 176 ${x} 194 H${x+14*flip} Q${x+22*flip} 176 ${x+14*flip} 158 Z" fill="url(#r_tanV)" filter="url(#rGrain)"/>${[3,6,9,12].map(k=>`<path d="M${x+k*flip} 159 Q${x+k*flip-8*flip} 176 ${x+k*flip} 193" fill="none" stroke="#5a3f1f" stroke-opacity=".45" stroke-width=".7"/>`).join("")}<ellipse cx="${x+15*flip}" cy="176" rx="4" ry="15" fill="url(#r_alV)"/><path d="M${x+15*flip} 161 V150" stroke="#c9ced1" stroke-width="1.6"/>`;
 return `${rSh(172,210,100,9)}
 ${rCylV(132.8,0,40,8,"iron",{top:false})}${rThrV(132.8,30,38,8)}${rHexV(132.8,36,14,12,"galv")}
 ${rCylV(192.8,0,40,8,"iron",{top:false})}${rThrV(192.8,30,38,8)}${rHexV(192.8,36,14,12,"galv")}
 ${rBox(92,72,120,134,36,"al",{r:6,grain:true})}
 ${rCylV(132.8,50,64,11,"al",{ry:3.4})}${rCylV(192.8,50,64,11,"al",{ry:3.4})}
 <rect x="90" y="131" width="124" height="9" rx="2" fill="url(#r_alH)"/><path d="M214 131 L235.6 116 V125 L214 140 Z" fill="url(#r_alS)"/>${[100,124,180,204].map(x=>rBolt(x,135.5,2.6)).join("")}
 <rect x="106" y="80" width="92" height="46" rx="5" fill="url(#r_paintF)"/><rect x="110" y="84" width="84" height="38" rx="3" fill="#f7f5ec"/>
 ${[122,140,158,176].map((x,i)=>rDial(x,95,6.8,[40,250,120,310][i])).join("")}<text x="149" y="108" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="4.6" font-weight="700" fill="#333">CUBIC FEET</text>
 ${rDial(136,115,5.4,70,"#c0281c",false)}${rDial(164,115,5.4,200,"#c0281c",false)}<text x="145" y="117" font-size="3.6" font-family="IBM Plex Sans,sans-serif" fill="#c0281c">½</text><text x="172" y="117" font-size="3.6" font-family="IBM Plex Sans,sans-serif" fill="#c0281c">2</text>
 <rect x="110" y="84" width="84" height="38" rx="3" fill="url(#rGlass)"/>
 <path d="M216 90 L230 80.5 V112 L216 121.5 Z" fill="#ebe7da"/>${[0,1,2,3,4].map(k=>`<path d="M218.5 ${94+k*4.6} l9 -6.2" stroke="#7a7666" stroke-width=".7"/>`).join("")}
 ${rCut(cut)}${rClip("rg_mcut",cut,`<rect x="150" y="146" width="4" height="54" fill="url(#r_alV)"/>${dia(108,1)}${dia(196,-1)}<rect x="100" y="194" width="104" height="5" fill="#15181a"/>`)}
 ${rL(126,20,80,20,6,24,"Inlet")}${rL(199,20,250,20,254,24,"Outlet")}
 ${rL(122,95,60,70,6,66,"Index: cubic feet used")}${rL(164,115,262,100,256,96,"Test dials: clock these")}
 ${rL(213,136,262,150,256,154,"Case seam, bolted")}${rL(112,176,60,186,6,198,"Leather or synthetic")}<text x="6" y="210" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">diaphragms (cutaway)</text>`})(),

/* ---------- service regulator with the bonnet cut open ---------- */
sreg:(()=>{return `${rSh(170,214,120,8)}
 ${rCylH(0,104,196,10,"iron")}${rThrH(94,104,196,10)}${rCylH(236,340,196,10,"iron")}${rThrH(236,246,196,10)}
 ${rSregArt(true)}
 ${zFA("M6 196 H330",GASC)}
 ${rL(170,44,120,28,6,28,"Adjusting screw under cap")}${rL(181,108,250,70,250,66,"Spring sets outlet pressure")}
 ${rL(140,130,70,112,6,108,"Diaphragm")}${rL(282,142,300,170,336,176,"Vent: screened, faces down","end")}
 ${rL(40,196,40,226,6,238,"In: service-line pressure")}${rL(300,196,300,226,336,238,"Out: about 7 in. w.c.","end")}`})(),

/* ---------- quarter-turn ball valve, front of the body cut away ---------- */
cock:(()=>{const win="M128 126 H212 V176 Q170 182 128 176 Z";
 return `${rSh(170,190,120,7)}
 ${rCylH(0,80,150,11,"iron")}${rThrH(70,80,150,11)}${rCylH(260,340,150,11,"iron")}${rThrH(260,270,150,11)}
 ${rHexH(72,150,28,22,"brass")}${rHexH(240,150,28,22,"brass")}${rCylH(100,240,150,28,"brass",{grain:true})}
 ${rCut(win)}${rClip("rg_bcut",win,`<rect x="128" y="126" width="84" height="56" fill="#1a1c1e"/><rect x="139" y="128" width="7" height="46" fill="#f2f1ea"/><rect x="194" y="128" width="7" height="46" fill="#f2f1ea"/><circle cx="170" cy="151" r="25" fill="url(#r_chromeV)"/><circle cx="170" cy="151" r="25" fill="none" stroke="#000" stroke-opacity=".4"/><rect x="145" y="142" width="50" height="18" fill="#2b2f33"/><rect x="145" y="142" width="50" height="5" fill="#000" opacity=".45"/>${zFA("M130 151 H210",GASC)}`)}
 ${rCylV(170,96,124,6,"brass")}${rHexV(170,104,12,11,"brass")}
 <path d="M150 90 L159 84 H302 L293 90 Z" fill="#e24a3c"/><path d="M150 90 H293 V99 H150 Z" fill="url(#r_redH)"/><path d="M293 90 L302 84 V93 L293 99 Z" fill="#7e160d"/><path d="M151 90.6 H292" stroke="#fff" stroke-opacity=".5"/>
 ${rCylV(166,74,88,7,"chrome",{ry:2.4})}
 ${zFA("M6 150 H126",GASC)}${zFA("M214 150 H334",GASC)}
 ${rL(266,88,266,60,336,56,"Lever in line with pipe = OPEN","end")}${rL(176,108,80,96,6,92,"Packing nut")}
 ${rL(142,166,90,196,6,210,"PTFE seats")}${rL(170,170,190,212,336,228,"Chrome ball, bore lined up with flow","end")}${rL(84,160,60,240,6,242,"Brass body, hex ends")}`})(),

/* ---------- sediment trap (drip leg), nipple cut open ---------- */
drip:(()=>{const win="M144 154 H156 V198 H144 Z";
 return `${rSh(160,232,60,6)}
 ${rCylV(150,0,104,10,"iron",{top:false})}${rThrV(150,92,100,10)}
 ${rCylV(150,98,144,15,"iron",{grain:true,top:false})}${rBandV(150,96,16,7,"iron")}${rBandV(150,138,16,7,"iron")}
 ${rCylH(160,194,120,15,"iron",{grain:true})}${rBand(190,120,16,7,"iron")}${rCylH(197,340,120,10,"iron")}${rThrH(197,205,120,10)}
 ${rCylV(150,145,212,10,"iron",{top:false})}${rThrV(150,145,152,10)}${rCylV(150,208,226,14,"iron",{grain:true})}${rBandV(150,206,15,6,"iron")}
 ${rCut(win)}${rClip("rg_dcut",win,`<rect x="144" y="186" width="12" height="12" fill="#2f5d8a" opacity=".8"/>${[[147,184,2],[151,182,1.6],[154,185,1.8],[148,179,1.4],[152,176,1.2]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#8a6d4d"/>`).join("")}`)}
 ${zFA("M150 4 V114 H334",GASC)}${zFA("M150 128 V176","#a4835c")}
 ${rL(150,40,90,40,6,36,"Gas drops in from the branch")}${rL(178,110,230,80,232,76,"Tee: gas turns out the side")}
 ${rL(150,186,90,196,6,206,"Dirt and water drop")}<text x="6" y="219" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">into the nipple</text>
 ${rL(164,218,220,228,224,232,"Cap: remove to clean")}${rL(320,120,320,150,336,160,"To the appliance","end")}`})(),

/* ---------- furnace combination gas valve, front cut away ---------- */
furn:(()=>{const win="M104 122 H204 V174 H104 Z";
 return `${rSh(178,190,120,7)}
 ${rCylH(0,92,150,9,"iron")}${rThrH(82,92,150,9)}${rCylH(256,340,150,9,"iron")}${rHexH(254,150,10,13,"al")}
 ${rBox(90,110,150,70,40,"al",{r:6,grain:true})}
 ${[0,1,2,3].map(k=>`<path d="M${212+k*6} 114 V176" stroke="#000" stroke-opacity=".12" stroke-width="1.6"/>`).join("")}
 ${rBox(100,84,70,22,24,"black",{r:3})}
 <path d="M116 0 C114 40 118 70 118 90" fill="none" stroke="#222" stroke-width="3.4"/><path d="M116 0 C114 40 118 70 118 90" fill="none" stroke="#f2f2ee" stroke-width="2.2"/><path d="M134 0 C138 40 132 70 132 90" fill="none" stroke="#222" stroke-width="3.4"/><path d="M134 0 C138 40 132 70 132 90" fill="none" stroke="#c0281c" stroke-width="2.2"/>
 <rect x="114" y="88" width="8" height="6" fill="url(#r_chromeV)"/><rect x="128" y="88" width="8" height="6" fill="url(#r_chromeV)"/>
 ${rCylV(198,92,104,12,"red",{ry:4})}<rect x="186" y="90.5" width="24" height="3" rx="1.5" fill="#7e160d"/><text x="198" y="99" text-anchor="middle" font-size="4" font-weight="700" font-family="IBM Plex Sans,sans-serif" fill="#fff">ON</text>
 ${rHexV(228,98,6,8,"al")}${rCylV(228,86,99,6.5,"black",{ry:2.2})}
 ${rCut(win)}${rClip("rg_gcut",win,`<path d="M104 162 H122 V142 H140 V162 H160 V142 H178 V162 H204 V174 H104 Z" fill="url(#r_alF)"/>${[131,169].map(x=>`<rect x="${x-3}" y="122" width="6" height="18" fill="url(#r_chromeV)"/><rect x="${x-10}" y="137" width="20" height="6" rx="1.5" fill="#1a1a1a"/>${Array.from({length:3},(_,k)=>`<path d="M${x-5} ${126+k*4} l10 2" stroke="#9aa3a9" stroke-width="1.2"/>`).join("")}`).join("")}${zFA("M106 152 H131 V132 M169 132 V152 H202",GASC)}`)}
 <circle cx="97" cy="168" r="4.2" fill="url(#r_brassV)"/><path d="M94.5 168 h5" stroke="#4c3407" stroke-width="1.1"/><circle cx="224" cy="168" r="4.2" fill="url(#r_brassV)"/><path d="M221.5 168 h5" stroke="#4c3407" stroke-width="1.1"/>
 ${rL(134,30,80,30,6,34,"24 V wires")}${rL(206,92,262,70,336,66,"Gas knob: ON / OFF","end")}${rL(228,86,262,44,336,40,"Regulator cap: sets 3.5 in. w.c.","end")}
 ${rL(150,140,90,200,6,212,"Two valves in series")}${rL(97,168,60,232,6,240,"Inlet pressure tap")}${rL(224,168,270,226,336,238,"Outlet (manifold) tap","end")}`})(),

/* ---------- tank-type water heater, cutaway ---------- */
wh:(()=>{const win="M118 76 L212 64 V190 L118 200 Z",tank="M126 80 L212 69 V184 L126 194 Z";
 return `${rSh(165,224,84,10)}
 ${rCylV(165,210,222,64,"black",{ry:16})}${rCylV(165,52,214,62,"white",{ry:16})}
 
 ${rCut(win)}${rClip("rg_wcut",win,`<path d="${win}" fill="url(#rFoam)" filter="url(#rGrain)"/><path d="${tank}" fill="url(#rWater)"/><path d="${tank}" fill="url(#rHot)"/><path d="${tank}" fill="none" stroke="#3a4046" stroke-width="2.4"/>
  <rect x="157" y="40" width="16" height="160" fill="url(#r_galvV)"/><path d="M159 70 ${Array.from({length:15},(_,k)=>`L${k%2?171:159} ${76+k*8}`).join(" ")}" fill="none" stroke="#6b5530" stroke-width="2"/>
  <rect x="132" y="70" width="5" height="114" fill="#eceee8"/><rect x="132" y="70" width="1.6" height="114" fill="#fff"/>
  <rect x="192" y="60" width="5" height="108" fill="url(#r_alV)"/>
  <ellipse cx="165" cy="198" rx="26" ry="4" fill="#111"/>${[150,158,166,174].map(x=>`<path d="M${x} 199 q4 -12 8 0 z" fill="url(#rFlame)"/>`).join("")}`)}
 <rect x="150" y="204" width="30" height="9" rx="2" fill="#1f2326"/><rect x="160" y="206" width="10" height="5" rx="1" fill="#3a6ea4" opacity=".7"/>
 ${rCylH(0,94,190,5,"iron")}${rBox(92,172,26,26,8,"black",{r:3})}<circle cx="105" cy="181" r="5.4" fill="url(#r_redV)"/><rect x="96" y="190" width="18" height="4" rx="1" fill="#59626a"/>
 ${rCylV(135,0,30,5,"cu",{top:false})}${rHexV(135,28,8,9,"brass")}${rCylV(135,36,58,6,"galv",{ry:2})}
 ${rCylV(195,0,30,5,"cu",{top:false})}${rHexV(195,28,8,9,"brass")}${rCylV(195,36,58,6,"galv",{ry:2})}
 ${rCylV(165,0,30,10,"galv",{top:false})}<path d="M147 46 L183 46 L176 30 L154 30 Z" fill="url(#r_galvV)"/><path d="M150 46 V54 M180 46 V54" stroke="#6d757b" stroke-width="2"/>${rCylV(165,44,56,9,"galv",{ry:2.8})}
 <rect x="224" y="74" width="14" height="14" rx="2" fill="url(#r_brassV)"/><rect x="226" y="68" width="10" height="4" fill="#4c3407"/>${rCylH(238,252,81,3.5,"cu")}${rCylV(252,81,214,3.5,"cu",{top:false})}
 <text x="128" y="12" text-anchor="end" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#2f74c8">cold in</text><text x="202" y="12" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#c0281c">hot out</text>
 ${rL(165,36,110,24,6,28,"Draft hood")}${rL(168,112,270,104,336,100,"Flue with baffle","end")}${rL(195,140,270,138,336,134,"Anode rod","end")}
 ${rL(135,150,60,150,6,146,"Dip tube: cold to bottom")}${rL(121,110,60,112,6,108,"Foam insulation")}${rL(238,80,270,58,336,54,"T&P valve + tube","end")}
 ${rL(105,186,60,214,6,226,"Gas control / thermostat")}${rL(178,200,240,226,336,232,"Burner","end")}`})()
};
Object.assign(GAS.illL,{
/* ---------- propane tank, cut open to show liquid and vapor ---------- */
tank:(()=>{const win="M90 112 H190 V188 H90 Z";
 return `${rSh(140,214,120,8)}
 <path d="M70 196 L66 214 H96 L92 196 Z" fill="url(#r_whiteV)"/><path d="M188 196 L184 214 H214 L210 196 Z" fill="url(#r_whiteV)"/>
 ${rTankH(140,150,220,52,"white")}
 ${rCut(win)}${rClip("rg_tcut",win,`<rect x="90" y="112" width="100" height="76" fill="#cfd8de" opacity=".35"/><rect x="90" y="128" width="100" height="62" fill="url(#rWater)" opacity=".85"/><path d="M90 128 H190" stroke="#cfe6ff" stroke-width="1.4"/>${[[104,140],[126,154],[150,146],[172,160],[112,170]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#cfe6ff" opacity=".8"/>`).join("")}`)}
 ${rCylV(140,84,100,30,"white",{ry:8})}<path d="M112 92 h56" stroke="#000" stroke-opacity=".15"/>
 <g transform="translate(116 46) scale(.16)">${rSregArt(false)}</g>${rCylV(140,62,86,4,"brass",{top:false})}${rHexV(140,72,7,7,"brass")}
 ${rHose("M162 76 C200 76 214 70 250 70 H278",`#9aa3a9`,4)}
 <rect x="290" y="20" width="44" height="200" fill="#c8b79a"/>${Array.from({length:12},(_,k)=>`<path d="M290 ${30+k*16} H334" stroke="#9c8b70" stroke-width="1"/>`).join("")}
 <g transform="translate(244 22) scale(.2)">${rSregArt(false)}</g>
 ${rCylV(282,64,240,4.5,"iron",{top:false})}
 ${rL(150,170,60,226,6,238,"Liquid propane (fill to 80%)")}${rL(120,120,60,104,6,100,"Vapor space")}
 ${rL(140,64,90,30,6,26,"Service valve + 1st stage: ~10 psi")}${rL(270,30,270,12,336,10,"2nd stage at the house: 11 in. w.c.","end")}`})(),

/* ---------- black iron main with tees and drops ---------- */
main:(()=>{const tee=(x,y)=>`${rCylH(x-16,x+16,y,13,"iron",{grain:true})}${rBand(x-18,y,14,6,"iron")}${rBand(x+12,y,14,6,"iron")}${rCylV(x,y+8,y+24,13,"iron",{top:false,grain:true})}${rBandV(x,y+20,14,6,"iron")}`;
 return `<rect x="0" y="0" width="340" height="40" fill="#d8cdb8"/>${Array.from({length:6},(_,k)=>`<rect x="${k*60+20}" y="0" width="20" height="40" fill="#b9a687"/>`).join("")}
 ${[60,190,300].map(x=>`<path d="M${x-12} 40 V${70} M${x+12} 40 V70" stroke="#8d969c" stroke-width="2.2"/><path d="M${x-13} 70 A13 13 0 0 0 ${x+13} 70" fill="none" stroke="#8d969c" stroke-width="2.4"/>`).join("")}
 ${rCylH(0,340,84,10,"iron")}${rThrH(94,100,84,10)}${rThrH(232,238,84,10)}
 ${tee(116,84)}${tee(250,84)}
 ${rCylV(116,108,220,6.5,"iron",{top:false})}${rThrV(116,108,114,6.5)}${rCylV(250,108,220,6.5,"iron",{top:false})}${rThrV(250,108,114,6.5)}
 ${zFA("M4 84 H334",GASC)}${zFA("M116 92 V214",GASC)}${zFA("M250 92 V214",GASC)}
 ${rL(30,92,30,130,6,142,"1 in. Schedule 40 black iron")}${rL(126,78,170,60,170,56,"Malleable iron tee")}${rL(116,150,60,170,6,182,"½ in. branch drop")}
 ${rL(300,60,322,120,336,132,"Pipe hanger","end")}${rL(235,84,180,190,150,206,"Threads, sealed with")}<text x="150" y="219" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">gas-rated dope or tape</text>`})(),

/* ---------- tankless water heater ---------- */
tl:(()=>`${rSh(176,236,70,6)}
 ${rCylV(176,4,30,16,"white",{top:false})}${rCylV(176,26,40,22,"white",{ry:6})}<text x="216" y="22" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#555"></text>
 ${rBox(116,40,120,150,24,"white",{r:8})}<rect x="122" y="48" width="108" height="10" rx="3" fill="#2f5d8a"/>
 ${rLcd(146,74,52,26,["120°F","SET"],12)}${[154,176,198].map(x=>`<circle cx="${x}" cy="114" r="5" fill="url(#r_chromeV)" stroke="#555" stroke-width=".5"/>`).join("")}
 <path d="M124 150 H228" stroke="#000" stroke-opacity=".1"/>
 ${rCylV(140,190,206,4.2,"galv",{top:false})}${rCylV(176,190,206,6,"iron",{top:false})}${rCylV(212,190,206,4.2,"galv",{top:false})}
 ${rCylV(140,206,250,4.2,"cu",{top:false})}<rect x="130" y="214" width="20" height="5" rx="1.5" fill="url(#r_blueH)"/>${rCylV(212,206,250,4.2,"cu",{top:false})}<rect x="202" y="214" width="20" height="5" rx="1.5" fill="url(#r_redH)"/>
 ${rCylV(176,206,250,6,"iron",{top:false})}${rCockV(176,206,true)}
 ${rL(176,14,110,14,6,18,"Concentric vent: sealed combustion")}${rL(172,86,100,64,6,60,"Display / setpoint")}
 ${rL(182,226,250,236,336,246,"¾ in. gas: up to 199,000 Btu/h","end")}${rL(136,216,80,232,6,246,"Service valves")}${rL(118,150,100,150,6,146,"Fires only when")}<text x="6" y="159" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">water flows</text>`)(),

/* ---------- gas dryer and its connector ---------- */
dryer:(()=>`${rSh(170,232,90,8)}
 ${rCylV(60,0,96,6.5,"iron",{top:false})}${rCockV(60,96,true)}${rCylV(60,136,146,6.5,"iron",{top:false})}
 ${rFlex("M60 146 C60 190 100 200 120 186")}
 ${rBox(110,72,120,150,40,"white",{r:4})}${rBox(118,40,124,28,12,"white",{r:3})}
 <circle cx="138" cy="54" r="7" fill="url(#r_chromeV)" stroke="#666" stroke-width=".5"/>${rLcd(156,47,44,14,["DRY"],9)}<circle cx="222" cy="54" r="7" fill="url(#r_chromeV)" stroke="#666" stroke-width=".5"/>
 <circle cx="170" cy="146" r="46" fill="url(#r_chromeV)"/><circle cx="170" cy="146" r="38" fill="#20262b"/><circle cx="170" cy="146" r="38" fill="url(#rGlass)"/><rect x="212" y="134" width="7" height="24" rx="3" fill="url(#r_chromeV)"/>
 ${rCylH(254,312,200,10,"al",{end:true,bore:true})}${[262,272,282,292,302].map(x=>`<line x1="${x}" y1="190.5" x2="${x}" y2="209.5" stroke="#6c767c" stroke-width="1"/>`).join("")}
 ${zFA("M60 4 V130",GASC)}
 ${rL(66,30,100,22,104,26,"Shutoff, within 6 ft")}${rL(80,190,40,214,6,226,"Flexible connector, 6 ft max")}
 ${rL(300,200,310,226,336,238,"4 in. rigid metal vent","end")}<text x="336" y="12" text-anchor="end" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">About 22,000 Btu/h</text>`)(),

/* ---------- range with cooktop burners lit ---------- */
range:(()=>`${rSh(176,236,100,8)}
 ${rCylV(46,0,100,6.5,"iron",{top:false})}${rCockV(46,100,true)}${rCylV(46,140,150,6.5,"iron",{top:false})}${rFlex("M46 150 C46 196 80 210 104 200")}
 ${rBox(116,20,150,28,10,"white",{r:3})}
 ${rBox(96,74,150,160,30,"white",{r:3})}<path d="M97 73.5 L115 61 H264 L246 73.5 Z" fill="#1d2124"/>
 ${[[132,70],[180,70],[150,64],[204,64]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="15" ry="4.4" fill="#2e3439"/><ellipse cx="${x}" cy="${y-1}" rx="10" ry="2.8" fill="url(#r_blackV)"/>${Array.from({length:10},(_,k)=>{const a=k/10*2*Math.PI;return `<path d="M${x+10*Math.cos(a)} ${y-1+2.8*Math.sin(a)} q${1.6*Math.cos(a)} -6 ${3*Math.cos(a)} ${-1.2}" fill="none" stroke="#5aa0ff" stroke-width="1.6"/>`}).join("")}`).join("")}
 <path d="M104 67.5 H240 M110 63 H246" stroke="#3a4045" stroke-width="1.2"/>
 ${[122,146,170,194,218].map(x=>`<circle cx="${x}" cy="88" r="6" fill="url(#r_chromeV)" stroke="#333" stroke-width=".5"/><line x1="${x}" y1="84" x2="${x}" y2="88" stroke="#333"/>`).join("")}
 <rect x="106" y="102" width="130" height="5" rx="2.5" fill="url(#r_chromeH)"/><rect x="108" y="112" width="126" height="86" rx="3" fill="#20262b"/><rect x="118" y="120" width="106" height="62" rx="2" fill="#0d1013"/><rect x="118" y="120" width="106" height="62" rx="2" fill="url(#rGlass)"/>
 <rect x="108" y="206" width="126" height="22" rx="1" fill="none" stroke="#9aa3aa"/>
 <path d="M252 226 L270 214 H296 L278 226 Z" fill="#59626a"/>
 ${zFA("M46 4 V134",GASC)}
 ${rL(204,62,290,50,336,46,"Burners","end")}${rL(80,196,40,214,6,226,"Flexible connector")}
 ${rL(52,30,80,10,84,14,"Shutoff ≤ 6 ft")}${rL(272,220,300,200,336,196,"Anti-tip bracket","end")}<text x="336" y="14" text-anchor="end" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">65,000 Btu/h, all on</text>`)(),

/* ---------- digital manometer on the gas valve taps ---------- */
mano:(()=>`${rSh(130,236,80,7)}
 ${rBox(70,40,110,184,16,"yel",{r:14})}<rect x="82" y="52" width="86" height="160" rx="9" fill="url(#r_blackF)"/>
 ${rLcd(92,66,66,46,["3.50","in. w.c."],18)}
 ${[[106,136],[144,136],[106,164],[144,164]].map(([x,y],i)=>`<rect x="${x-14}" y="${y-9}" width="28" height="18" rx="6" fill="url(#r_paintF)"/><text x="${x}" y="${y+3}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" font-weight="700" fill="#eef">${["ON","ZERO","HOLD","UNITS"][i]}</text>`).join("")}
 <text x="125" y="200" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#e8c33a">MANOMETER</text>
 ${rCylV(102,28,42,5,"chrome",{ry:1.6})}${rCylV(148,28,42,5,"chrome",{ry:1.6})}<text x="102" y="24" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" font-weight="700" fill="#333">P1</text>
 ${rHose("M102 28 C102 0 250 -6 262 70",`#cfe3ea`,4.4)}
 ${rBox(236,110,90,56,24,"al",{r:4,grain:true})}${rCylH(326,340,138,8,"iron")}<circle cx="262" cy="82" r="5" fill="url(#r_brassV)"/>${rCylV(262,72,110,3,"brass",{top:false})}
 ${rL(102,34,60,20,6,16,"P1 port")}${rL(200,6,230,24,234,28,"Tubing to the outlet tap")}
 ${rL(150,96,210,200,336,214,"Reads manifold pressure","end")}${rL(144,164,60,230,6,240,"Zero it in open air first")}`)()
});

BURN.illL={
burners:(()=>{const xs=[90,140,190,240];
 return `${rSh(170,232,130,6)}${rCylH(40,300,214,9,"al",{end:true})}${rCylH(0,40,214,6,"iron")}
 ${xs.map(x=>`${rHexV(x,198,8,5,"brass")}<path d="M${x-14} 196 Q${x} 180 ${x+14} 196 Z" fill="url(#r_alV)"/>${rCylV(x,112,188,10,"al",{ry:3})}<ellipse cx="${x}" cy="112" rx="10" ry="3" fill="#222"/>${[0,1,2].map(k=>`<rect x="${x-8}" y="${122+k*6}" width="16" height="2" fill="#000" opacity=".25"/>`).join("")}${rFlameC(x,112,70,13)}`).join("")}
 ${rArr("M60 184 Q76 184 82 174","#2f6fd6")}
 ${rL(140,78,200,30,204,26,"Inner cone: sharp blue")}${rL(244,52,280,52,336,56,"Outer mantle","end")}
 ${rL(84,174,40,150,6,146,"Venturi pulls in")}<text x="6" y="159" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">primary air</text>
 ${rL(190,202,250,236,336,244,"Orifice spud on the manifold","end")}`})(),
orifs:(()=>`${rSh(170,212,140,6)}${rCylH(0,340,170,16,"al",{grain:true})}
 ${[110,230].map(x=>`${rHexV(x,128,16,13,"brass")}${rCylV(x,104,130,7,"brass")}<ellipse cx="${x}" cy="104" rx="2.4" ry="1" fill="#111"/>${rArr(`M${x} 100 V40`,"#e8c33a")}<path d="M${x-26} 40 Q${x} 76 ${x+26} 40" fill="url(#r_alV)" opacity=".85"/>`).join("")}
 ${rL(232,104,280,96,336,92,"Drilled hole: #45 = 0.082 in.","end")}${rL(110,140,60,150,6,146,"Brass spud, threaded")}
 ${rL(20,170,20,206,6,218,"Manifold at 3.5 in. w.c.")}${rL(110,44,60,20,6,16,"Gas jet into the venturi")}
 <text x="336" y="236" text-anchor="end" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">Propane uses smaller drills</text>`)(),
shutter:(()=>`${rSh(170,214,110,6)}${rCylH(120,300,130,30,"al",{grain:true})}
 <ellipse cx="120" cy="130" rx="14" ry="38" fill="url(#r_alV)"/><ellipse cx="120" cy="130" rx="11" ry="32" fill="#1a1c1e"/>
 <path d="M106 102 A14 38 0 0 0 120 168 L120 92 A14 38 0 0 0 106 102 Z" fill="url(#r_paintV)" opacity=".95"/>${[0,1,2].map(k=>`<ellipse cx="${114}" cy="${112+k*18}" rx="3" ry="6" fill="#0d0f10"/>`).join("")}
 ${rHexV(70,124,12,8,"brass")}${rCylH(76,96,130,3,"brass")}${rArr("M60 90 Q90 96 104 112","#2f6fd6")}${rArr("M60 170 Q90 164 104 150","#2f6fd6")}${rArr("M96 130 H200","#e8c33a")}
 ${rBolt(128,92,3)}${rL(128,92,170,60,170,56,"Lock screw")}${rL(110,140,40,200,6,210,"Shutter plate: slide to open")}
 ${rL(60,90,40,60,6,56,"Primary air")}${rL(250,130,280,190,336,200,"Venturi tube","end")}`)(),
gv:GAS.illL.furn,
hx:(()=>{const xs=[110,150,190,230];
 return `${rSh(170,238,120,6)}${rBox(70,40,200,30,24,"paint",{r:3})}
 ${xs.map(x=>`<path d="M${x-17} 210 V96 Q${x-17} 72 ${x} 70 Q${x+17} 72 ${x+17} 96 V210 Z" fill="url(#r_paintV)" filter="url(#rGrain)"/><path d="M${x-6} 200 V100" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>${rFlameC(x,226,26,8)}${rArr(`M${x} 196 V86`,"#e0662a")}`).join("")}
 ${rArr("M40 220 V100","#2f6fd6")}${rArr("M300 220 V100","#2f6fd6")}
 <path d="M206 140 l6 10 l-4 8 l6 12" fill="none" stroke="#d0312d" stroke-width="1.8"/>
 ${rL(150,60,170,26,174,22,"Flue collector to the vent")}${rL(40,160,20,160,6,176,"Room air")}${rL(212,150,280,150,336,146,"Crack: CO into the air","end")}
 ${rL(110,140,60,248,6,246,"Flue gas inside each section")}`})(),
hood:(()=>`${rSh(170,232,110,6)}${rCylV(170,0,64,22,"galv",{top:false})}
 <path d="M112 132 L140 72 H200 L228 132 Z" fill="url(#r_galvV)"/><ellipse cx="170" cy="72" rx="30" ry="6" fill="url(#r_galvT)"/>${rCylV(170,60,74,24,"galv",{ry:5})}
 <path d="M104 132 H236 V140 H104 Z" fill="url(#r_galvH)"/><path d="M118 140 V176 M222 140 V176" stroke="#6d757b" stroke-width="3"/>
 ${rCylV(170,176,236,40,"cab",{ry:8,top:true})}
 ${rArr("M170 200 V20","#e0662a")}${rArr("M80 170 Q110 160 128 140","#2f6fd6")}${rArr("M260 170 Q230 160 212 140","#2f6fd6")}
 ${rL(196,30,240,30,336,34,"To the vent connector","end")}${rL(124,150,60,186,6,198,"Relief opening: room air in")}
 ${rL(180,120,260,100,336,96,"Breaks chimney pull","end")}${rL(200,200,270,226,336,238,"Appliance flue outlet","end")}`)(),
bvss:(()=>`${rSh(170,214,90,6)}
 ${rBox(110,90,120,100,20,"al",{r:4})}<circle cx="160" cy="140" r="30" fill="url(#r_chromeV)"/><circle cx="160" cy="140" r="22" fill="url(#r_galvV)"/><circle cx="152" cy="132" r="6" fill="#fff" opacity=".5"/>
 <rect x="196" y="106" width="22" height="16" rx="4" fill="url(#r_redV)"/><text x="207" y="118" text-anchor="middle" font-size="6" font-weight="700" font-family="IBM Plex Sans,sans-serif" fill="#fff">RESET</text>
 ${rHose("M220 170 C260 170 270 200 340 200","#f2f2ee",2.6)}${rHose("M220 178 C256 178 266 214 340 214","#c0281c",2.6)}
 ${rL(160,140,60,140,6,136,"Bimetal disc")}${rL(207,106,240,80,336,76,"Manual reset button","end")}
 ${rL(300,200,300,236,336,244,"Opens the gas valve circuit","end")}<text x="6" y="230" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">Sits at the hood's relief opening</text>`)(),
conn:(()=>`<rect x="250" y="0" width="90" height="250" fill="url(#zBrick)" filter="url(#rGrain)"/><rect x="250" y="0" width="90" height="250" fill="url(#r_blackV)" opacity=".15"/>
 ${rCylV(268,92,124,26,"cab",{ry:7})}<ellipse cx="268" cy="92" rx="20" ry="5" fill="#2a221e"/>
 ${rCylV(60,140,250,12,"galv",{top:false})}<path d="M60 150 Q60 120 90 118 L258 96" fill="none" stroke="#4b5150" stroke-width="26" stroke-linecap="butt"/><path d="M60 150 Q60 120 90 118 L258 96" fill="none" stroke="url(#r_galvV)" stroke-width="24"/><path d="M60 140 Q60 116 90 112 L258 90" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>
 ${[120,170,220].map(x=>`<path d="M${x} ${118-(x-90)*.13-12} v24" stroke="#000" stroke-opacity=".25" stroke-width="2"/>${rBolt(x+4,118-(x-90)*.13-6,1.8)}`).join("")}
 ${rArr("M60 240 V160 Q60 128 92 124 L250 104","#e0662a")}
 ${rL(170,96,170,60,6,56,"Rise ¼ in. per foot, minimum")}${rL(124,108,100,180,6,190,"3 screws per joint")}${rL(268,92,300,40,336,36,"Thimble in the chimney","end")}${rL(60,220,100,236,104,240,"From the draft hood")}`)(),
chim:(()=>{const win="M110 30 H190 V230 H110 Z";
 return `${rBox(80,30,140,220,30,"paint",{r:0})}<rect x="80" y="30" width="140" height="220" fill="url(#zBrick)" filter="url(#rGrain)"/>${rBox(72,16,156,14,32,"cab",{r:1})}${rCylV(150,0,18,22,"cab",{ry:5})}
 ${rCut(win)}${rClip("rg_ccut",win,`<rect x="122" y="30" width="56" height="200" fill="#c98a5a" filter="url(#rGrain)"/><rect x="128" y="30" width="44" height="200" fill="#2a221e"/>${[70,120,170].map(y=>`<rect x="120" y="${y}" width="60" height="3" fill="#8a5a3a"/>`).join("")}${rArr("M150 226 V40","#e0662a")}`)}
 ${rArr("M40 150 V226","#2f6fd6")}${rArr("M300 60 V20","#9aa3a9")}
 ${rL(126,100,60,90,6,86,"Clay tile liner")}${rL(150,10,240,10,336,14,"Cap and screen","end")}${rL(176,150,262,150,336,146,"Hot gas rises = draft","end")}
 ${rL(40,200,20,240,6,246,"Cold outdoor air is heavier")}`})(),
anal:(()=>`${rSh(130,240,80,6)}
 ${rBox(70,30,120,200,16,"blue",{r:14})}<rect x="80" y="40" width="100" height="180" rx="9" fill="url(#r_blackF)"/>
 ${rLcd(88,52,84,92,["O2 8.4%","CO 12 ppm","CO2 7.0%","T 458°F","EFF 78%"],12)}
 ${[[110,166],[150,166],[110,196],[150,196]].map(([x,y],i)=>`<rect x="${x-15}" y="${y-9}" width="30" height="18" rx="6" fill="url(#r_paintF)"/><text x="${x}" y="${y+3}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" font-weight="700" fill="#eef">${["MENU","PUMP","PRINT","HOLD"][i]}</text>`).join("")}
 ${rCylV(100,18,32,5,"chrome",{ry:1.6})}${rHose("M100 18 C100 0 210 0 230 60 L232 100","#2a2f33",4.4)}
 ${rCylV(236,96,124,9,"cu",{ry:3})}<path d="M232 124 H240 L238 150 H234 Z" fill="url(#r_alV)"/>${rCylH(266,334,190,3,"chrome")}${rHose("M234 150 V176 Q234 190 248 190","#2a2f33",3.6)}${rBox(244,182,20,16,6,"black",{r:4})}
 ${rL(236,110,280,110,336,106,"Water trap","end")}${rL(240,190,280,220,336,232,"Probe in the test hole","end")}
 ${rL(130,90,60,30,6,26,"Reads O2, CO, temp")}<text x="6" y="246" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">Sample before the draft hood</text>`)(),
cazm:(()=>`${rSh(130,236,80,7)}
 ${rBox(70,40,110,184,16,"yel",{r:14})}<rect x="82" y="52" width="86" height="160" rx="9" fill="url(#r_blackF)"/>
 ${rLcd(92,66,66,46,["-2.0","Pa"],18)}
 ${[[106,140],[144,140],[106,170],[144,170]].map(([x,y],i)=>`<rect x="${x-14}" y="${y-9}" width="28" height="18" rx="6" fill="url(#r_paintF)"/><text x="${x}" y="${y+3}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" font-weight="700" fill="#eef">${["ON","ZERO","HOLD","AVG"][i]}</text>`).join("")}
 ${rCylV(102,28,42,5,"chrome",{ry:1.6})}${rCylV(148,28,42,5,"chrome",{ry:1.6})}
 <rect x="280" y="0" width="60" height="250" fill="url(#r_cabF)"/><path d="M280 0 V250" stroke="#8a9094"/>${rHose("M148 28 C148 4 250 4 300 30 H340","#cfe3ea",3.6)}
 ${rL(104,40,60,20,6,16,"Open port: room (CAZ)")}${rL(300,30,300,70,336,82,"Hose to outdoors","end")}
 ${rL(150,90,220,150,336,160,"Limit −2 to −5 Pa","end")}<text x="336" y="174" text-anchor="end" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">by appliance type</text>
 <text x="6" y="246" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">Worst case: fans on</text>`)(),
coal:(()=>`${rSh(170,214,80,6)}${rBox(100,40,140,160,18,"white",{r:24})}
 ${Array.from({length:6},(_,k)=>`<rect x="${122+k*16}" y="56" width="8" height="30" rx="4" fill="#cfd4d6"/>`).join("")}
 ${rLcd(128,104,84,34,["0","PPM"],18)}
 <circle cx="170" cy="168" r="14" fill="url(#r_chromeV)"/><text x="170" y="171" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="7" font-weight="700" fill="#333">TEST</text><circle cx="208" cy="168" r="4" fill="#1e9a4a"/>
 ${rL(128,121,60,121,6,117,"Shows ppm, keeps the peak")}${rL(170,182,170,226,140,240,"Test button")}
 ${rL(208,168,262,168,336,164,"Power light","end")}${rL(180,70,262,40,336,36,"UL 2034 sensor vents","end")}`)(),
fans:(()=>`${rSh(170,214,120,6)}${rCylV(170,0,46,18,"al",{top:false})}${rBox(100,46,140,46,30,"chrome",{r:3})}
 <path d="M100 92 L62 160 H278 L240 92 Z" fill="url(#r_chromeV)"/><path d="M62 160 H278 V170 H62 Z" fill="url(#r_alH)"/>${Array.from({length:8},(_,k)=>`<rect x="${82+k*22}" y="162" width="18" height="6" fill="#333" opacity=".4"/>`).join("")}
 ${rArr("M170 200 V180","#2f6fd6")}${rArr("M170 40 V6","#9aa3a9")}
 ${rL(170,20,240,20,336,24,"Exhausts up to 350 CFM","end")}${rL(120,165,60,200,6,210,"Grease filters")}
 <text x="336" y="232" text-anchor="end" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135">Air out = house pressure drops</text>`)(),
flame:(()=>`<rect x="0" y="0" width="340" height="250" fill="#14171a"/>
 ${rCylV(110,170,250,22,"al",{ry:5})}<ellipse cx="110" cy="170" rx="15" ry="3.4" fill="#0a0b0c"/>${rFlameC(110,168,130,24)}
 ${rCylV(250,170,250,22,"al",{ry:5})}<ellipse cx="250" cy="170" rx="15" ry="3.4" fill="#0a0b0c"/>${rFlameC(250,168,120,24,true)}
 <text x="110" y="16" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="700" fill="#9fd0ff">GOOD</text><text x="250" y="16" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="700" fill="#f2b632">YELLOW TIPS</text>
 ${rL(110,128,40,110,6,106,"Inner cone")}${rL(98,70,40,60,6,56,"Mantle")}${rL(250,40,300,40,336,44,"Short of air","end")}`)()
};
