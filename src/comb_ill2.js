
// Gas tab Parts cards, 340x250, drawn with the 3/4-view kit in real.js (realism sample, round 2).
const GASC="#e8c33a";
const rCut=d=>`<path d="${d}" fill="url(#rCav)"/><path d="${d}" fill="none" stroke="#e6eaec" stroke-width="2.4" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".7" stroke-linejoin="round"/>`;
const rClip=(id,d,body)=>`<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${body}</g>`;

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
