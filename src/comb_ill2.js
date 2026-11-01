
// Detailed 340x250 Parts-card drawings (realistic drawn style, cutaways, leader labels).
// Sample set for the gas tab; same style as the compressor and TXV cards.
const GASC="#e8c33a";
const ironH=(x,y,w,h=14)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#zSteel)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2b3034" opacity=".55"/><rect x="${x}" y="${y+2}" width="${w}" height="${h*0.18}" fill="#fff" opacity=".18"/>`;
const ironV=(x,y,h,w=14)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#zSteelH)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2b3034" opacity=".55"/><rect x="${x+2}" y="${y}" width="${w*0.18}" height="${h}" fill="#fff" opacity=".18"/>`;
const hexN=(cx,cy,r)=>`<polygon points="${[0,1,2,3,4,5].map(i=>`${(cx+r*Math.cos(i*Math.PI/3+Math.PI/6)).toFixed(1)},${(cy+r*0.62*Math.sin(i*Math.PI/3+Math.PI/6)).toFixed(1)}`).join(" ")}" fill="url(#zBrass)" stroke="#6b5200" stroke-width=".8"/>`;
const cutEdge=d=>`<path d="${d}" fill="none" stroke="#9aa3a9" stroke-width="2.2" stroke-linejoin="round"/>`;
const dialFace=(cx,cy,r,a,red)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfbf6" stroke="${red?"#b8322a":"#555"}" stroke-width="${red?1.4:.8}"/>${Array.from({length:10},(_,i)=>{const t=i*Math.PI/5;return `<line x1="${(cx+r*0.78*Math.sin(t)).toFixed(1)}" y1="${(cy-r*0.78*Math.cos(t)).toFixed(1)}" x2="${(cx+r*0.95*Math.sin(t)).toFixed(1)}" y2="${(cy-r*0.95*Math.cos(t)).toFixed(1)}" stroke="#666" stroke-width=".6"/>`}).join("")}<line x1="${cx}" y1="${cy}" x2="${(cx+r*0.75*Math.sin(a)).toFixed(1)}" y2="${(cy-r*0.75*Math.cos(a)).toFixed(1)}" stroke="${red?"#b8322a":"#222"}" stroke-width="1.3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="1.4" fill="#222"/>`;

GAS.illL={
 meter:`
 ${zShade(170,236,110)}
 ${ironV(92,0,30)}${ironV(234,0,30)}${hexN(99,30,14)}${hexN(241,30,14)}
 ${zFA("M99 2 V26",GASC)}${zFA("M241 26 V2",GASC)}
 <g filter="url(#zShadow)">
  <rect x="62" y="34" width="216" height="196" rx="14" fill="url(#zSteel)"/>
  <rect x="62" y="34" width="216" height="196" rx="14" fill="#6b7a70" opacity=".35"/>
  <rect x="70" y="40" width="10" height="184" rx="5" fill="#fff" opacity=".14"/>
  <rect x="62" y="104" width="216" height="6" fill="#000" opacity=".18"/>
 </g>
 <!-- index window -->
 <rect x="96" y="48" width="148" height="50" rx="5" fill="#1d2226"/><rect x="99" y="51" width="142" height="44" rx="4" fill="#e9ecea"/>
 ${dialFace(116,66,10,1.1)}${dialFace(141,66,10,4.2)}${dialFace(166,66,10,2.5)}${dialFace(191,66,10,5.6)}
 ${dialFace(220,74,15,2.2,true)}<text x="220" y="93" font-size="6" text-anchor="middle" font-family="sans-serif" fill="#b8322a">2 ft³</text>
 <text x="153" y="90" font-size="6" text-anchor="middle" font-family="sans-serif" fill="#444">CUBIC FEET</text>
 <!-- cutaway: diaphragm chambers and slide valves -->
 <clipPath id="zg_mcut"><path d="M74 120 L266 116 L268 214 L246 222 L222 214 L190 224 L150 214 L120 222 L76 214 Z"/></clipPath>
 <g clip-path="url(#zg_mcut)">
  <rect x="60" y="110" width="220" height="120" fill="url(#zInside)"/>
  <rect x="84" y="122" width="172" height="20" fill="#3a3f44"/>
  ${[0,1].map(i=>`<rect x="${112+i*76}" y="126" width="40" height="10" rx="2" fill="url(#zBrassH)"/><rect class="zSlide" x="${118+i*76}" y="124" width="14" height="14" rx="2" fill="url(#zBrass)"/>`).join("")}
  ${[0,1].map(i=>`<rect x="${86+i*86}" y="150" width="82" height="60" rx="6" fill="#2a2f33" stroke="#555d62"/><path d="M${127+i*86} 152 V208" stroke="#c9b48a" stroke-width="4"/><path d="M${97+i*86} 160 Q${112+i*86} 180 ${97+i*86} 200 M${157+i*86} 160 Q${142+i*86} 180 ${157+i*86} 200" fill="none" stroke="#c9b48a" stroke-width="2.4"/><rect x="${92+i*86}" y="156" width="30" height="48" fill="${GASC}" opacity=".18"/>`).join("")}
 </g>
 ${cutEdge("M74 120 L266 116 L268 214 L246 222 L222 214 L190 224 L150 214 L120 222 L76 214 Z")}
 ${zL(99,14,60,14,6,17,"Inlet (from service regulator)")}${zL(241,14,280,40,272,60,"Outlet")}

 ${zL(220,74,300,80,290,96,"Test dial","start")}
 ${zL(166,60,60,60,6,64,"Index dials")}
 ${zL(142,131,40,124,6,120,"Slide valves")}
 ${zL(108,190,40,200,6,214,"Leather/synthetic diaphragms")}
 ${zL(220,170,300,170,282,186,"Chambers")}`,

 sreg:`
 ${zShade(170,236,120)}
 ${ironH(0,170,98,18)}${ironH(242,170,98,18)}${zFA("M4 179 H92",GASC)}${zFA("M248 179 H336",GASC)}
 <g filter="url(#zShadow)">
  <path d="M96 156 H244 V204 Q170 222 96 204 Z" fill="url(#zSteel)"/>
  <path d="M74 112 Q170 62 266 112 L262 122 Q170 108 78 122 Z" fill="url(#zSteel)"/>
  <rect x="72" y="118" width="196" height="14" rx="3" fill="#59626a"/>
  ${Array.from({length:9},(_,i)=>`<circle cx="${82+i*22}" cy="125" r="3" fill="url(#zScrew)"/>`).join("")}
  <path d="M150 74 Q170 54 190 74 V84 H150 Z" fill="url(#zSteel)"/><rect x="160" y="46" width="20" height="18" rx="3" fill="url(#zSteel)"/>
 </g>
 <!-- vent -->
 <path d="M266 112 H300 V140" fill="none" stroke="url(#zSteel)" stroke-width="12"/><rect x="292" y="140" width="16" height="10" rx="2" fill="#3a3f44"/><path d="M300 152 v10" stroke="#9aa3aa" stroke-width="1.5" stroke-dasharray="2 2"/>
 <!-- cutaway -->
 <clipPath id="zg_rcut"><path d="M104 88 L236 88 L238 202 L210 210 L170 204 L130 210 L102 202 Z"/></clipPath>
 <g clip-path="url(#zg_rcut)">
  <rect x="90" y="80" width="160" height="140" fill="url(#zInside)"/>
  <path d="M120 104 ${Array.from({length:7},(_,i)=>`L${i%2?140:200} ${104+i*3.2}`).join(" ")}" fill="none" stroke="#c4cacf" stroke-width="0"/>
  ${Array.from({length:6},(_,i)=>`<ellipse cx="170" cy="${92+i*4}" rx="20" ry="3" fill="none" stroke="#c4cacf" stroke-width="2.2"/>`).join("")}
  <path d="M106 122 Q170 132 234 122" fill="none" stroke="#1f1f1f" stroke-width="3.5"/>
  <rect x="164" y="124" width="12" height="36" fill="#9aa3aa"/>
  <path d="M170 160 L210 166" stroke="#9aa3aa" stroke-width="4"/><circle cx="170" cy="160" r="3" fill="#59626a"/>
  <rect x="120" y="168" width="100" height="22" fill="${GASC}" opacity=".25"/>
  <rect x="196" y="176" width="8" height="18" fill="#59626a"/><rect x="206" y="160" width="14" height="12" rx="2" fill="#2b2f33"/>
 </g>
 ${cutEdge("M104 88 L236 88 L238 202 L210 210 L170 204 L130 210 L102 202 Z")}
 ${zL(170,48,120,30,6,28,"Adjusting screw under cap")}
 ${zL(150,98,60,90,6,88,"Spring sets outlet pressure")}
 ${zL(118,126,40,140,6,144,"Diaphragm")}
 ${zL(208,168,280,206,250,226,"Valve disc and orifice")}
 ${zL(300,146,320,110,250,104,"Vent, faces down","start")}
 ${zL(20,179,20,214,6,226,"Street ~60 psi in")}`,

 cock:`
 ${zShade(170,212,120)}
 ${ironH(0,118,104,24)}${ironH(236,118,104,24)}
 <g filter="url(#zShadow)">
  <path d="M104 104 H236 V156 H104 Z" fill="url(#zBrass)"/>
  ${hexN(112,130,22)}${hexN(228,130,22)}
  <rect x="160" y="80" width="20" height="26" fill="url(#zBrassH)"/>
  <rect x="96" y="62" width="150" height="20" rx="8" fill="#c0281c"/><rect x="100" y="64" width="142" height="5" rx="2" fill="#fff" opacity=".25"/>
 </g>
 <clipPath id="zg_bcut"><path d="M128 110 H212 V150 H128 Z"/></clipPath>
 <g clip-path="url(#zg_bcut)"><rect x="120" y="100" width="100" height="60" fill="url(#zInside)"/><circle cx="170" cy="130" r="24" fill="url(#zSteel)"/><rect x="140" y="122" width="60" height="16" fill="#2a2f33"/><rect x="140" y="124" width="60" height="12" fill="${GASC}" opacity=".35"/></g>
 ${cutEdge("M128 110 H212 V150 H128 Z")}
 ${zFA("M10 130 H330",GASC)}
 ${zL(220,72,280,48,240,40,"Handle in line = OPEN")}
 ${zL(170,148,170,190,120,206,"Ball bore lines up with the flow")}
 ${zL(112,144,60,180,6,196,"Threaded body")}`,

 drip:`
 ${zShade(170,240,90)}
 ${ironV(158,0,82,24)}${zFA("M170 4 V80",GASC)}
 <g filter="url(#zShadow)"><rect x="142" y="78" width="56" height="56" rx="6" fill="#2b3034"/><rect x="146" y="82" width="10" height="48" fill="#fff" opacity=".1"/></g>
 ${ironH(198,94,142,24)}${zFA("M196 106 H334",GASC)}
 ${ironV(158,134,74,24)}<rect x="152" y="206" width="36" height="20" rx="4" fill="#2b3034"/>
 <clipPath id="zg_dcut"><path d="M160 140 H180 V204 H160 Z"/></clipPath>
 <g clip-path="url(#zg_dcut)"><rect x="150" y="136" width="40" height="72" fill="url(#zInside)"/>${[[166,198],[173,200],[169,194],[175,192],[164,190]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#8a6a3a"/>`).join("")}<rect x="160" y="196" width="20" height="8" fill="#5a7fa6" opacity=".6"/></g>
 ${cutEdge("M160 140 H180 V204 H160 Z")}
 <path d="M170 86 V120" stroke="#8a6a3a" stroke-width="2" stroke-dasharray="2 3"/>
 ${zL(160,30,90,30,6,26,"Gas drops in from the branch")}
 ${zL(260,106,260,150,226,166,"Out the side to the appliance")}
 ${zL(170,196,100,226,6,236,"Dirt and water drop into the nipple")}
 ${zL(188,216,240,226,244,232,"Cap: remove to clean")}`,

 furn:`
 ${zShade(170,224,130)}
 ${ironH(0,128,70,20)}${zFA("M4 138 H66",GASC)}
 <rect x="270" y="132" width="70" height="12" fill="url(#zAlu)"/>${zFA("M274 138 H336",GASC)}
 <g filter="url(#zShadow)">
  <rect x="66" y="88" width="208" height="100" rx="8" fill="#2f3337"/><rect x="70" y="92" width="200" height="8" rx="3" fill="#fff" opacity=".08"/>
  <circle cx="200" cy="72" r="20" fill="#c0281c"/><rect x="186" y="68" width="28" height="8" rx="3" fill="#8a1c14"/><text x="200" y="58" font-size="8" font-family="sans-serif" text-anchor="middle" fill="#2a3135" font-weight="700">ON  OFF</text>
  <rect x="100" y="60" width="44" height="30" rx="4" fill="#3d4247"/><rect x="104" y="64" width="36" height="22" rx="2" fill="#1d2023"/>
 </g>
 <clipPath id="zg_gcut"><path d="M76 104 H262 V180 H76 Z"/></clipPath>
 <g clip-path="url(#zg_gcut)"><rect x="70" y="100" width="200" height="86" fill="url(#zInside)"/>
  <path d="M76 140 H110 V122 H140 V150 H170 V122 H200 V150 H262" fill="none" stroke="${GASC}" stroke-width="7" opacity=".55"/>
  ${[0,1].map(i=>`<rect x="${106+i*60}" y="108" width="38" height="14" fill="#7d6a3a"/><rect x="${118+i*60}" y="122" width="14" height="22" fill="#9aa3aa"/><rect x="${112+i*60}" y="142" width="26" height="6" rx="2" fill="#1f1f1f"/>`).join("")}
  ${Array.from({length:5},(_,i)=>`<ellipse cx="236" cy="${112+i*4}" rx="10" ry="2.2" fill="none" stroke="#c4cacf" stroke-width="1.8"/>`).join("")}<rect x="226" y="132" width="20" height="3" fill="#1f1f1f"/>
 </g>
 ${cutEdge("M76 104 H262 V180 H76 Z")}
 <circle cx="84" cy="182" r="5" fill="url(#zBrass)"/><circle cx="254" cy="182" r="5" fill="url(#zBrass)"/>
 <path d="M114 60 C114 30 150 26 180 22 M130 60 C130 36 160 34 190 30" fill="none" stroke="#e8c33a" stroke-width="2"/>
 ${zL(124,115,60,60,6,52,"Two valves in series (24 V coils)")}
 ${zL(236,118,300,96,278,84,"Regulator: 3.5\" w.c.","start")}
 ${zL(84,186,60,214,6,230,"Inlet pressure tap")}
 ${zL(254,186,280,214,236,230,"Outlet (manifold) tap")}
 ${zL(212,70,260,40,230,30,"Gas knob")}`,

 wh:`
 ${zShade(170,240,70)}
 <g filter="url(#zShadow)">
  <rect x="104" y="40" width="132" height="186" rx="12" fill="url(#zSteelH)"/>
  <path d="M120 40 L112 22 H228 L220 40 Z" fill="url(#zSteel)"/><rect x="156" y="0" width="28" height="24" fill="url(#zSteelH)"/>
  <rect x="236" y="70" width="18" height="12" fill="url(#zBrass)"/><rect x="250" y="76" width="10" height="120" fill="url(#zCuV)"/>
  <rect x="120" y="196" width="40" height="22" rx="3" fill="#2f3337"/><circle cx="140" cy="206" r="6" fill="#c0281c"/>
 </g>
 <clipPath id="zg_wcut"><path d="M150 52 H230 V218 H150 Z"/></clipPath>
 <defs><linearGradient id="zg_wtr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e56a55"/><stop offset=".55" stop-color="#d9a0a0"/><stop offset="1" stop-color="#6f9fd6"/></linearGradient></defs>
 <g clip-path="url(#zg_wcut)">
  <rect x="146" y="48" width="90" height="174" fill="#e8c873"/>
  <rect x="156" y="58" width="68" height="146" fill="url(#zg_wtr)"/>
  <rect x="184" y="48" width="12" height="160" fill="#59626a"/><path d="M186 60 l8 6 -8 6 8 6 -8 6 8 6 -8 6 8 6 -8 6 8 6 -8 6" fill="none" stroke="#c4cacf" stroke-width="1.6"/>
  <rect x="164" y="48" width="5" height="148" fill="#e9e9e2"/>
  <rect x="212" y="48" width="4" height="120" fill="#9aa3aa"/>
  <rect x="146" y="204" width="90" height="16" fill="#1d2023"/>${[0,1,2].map(i=>`<path d="M${176+i*12} 218 q4 -12 8 0 z" fill="#3d7de0"/>`).join("")}
 </g>
 ${cutEdge("M150 52 H230 V218 H150 Z")}
 ${zFA("M190 204 V30","#e0662a")}
 ${zL(170,12,100,12,6,16,"Draft hood")}
 ${zL(190,120,290,40,262,30,"Flue with baffle")}
 ${zL(166,180,70,150,6,146,"Dip tube (cold in, to bottom)")}
 ${zL(214,140,290,120,262,136,"Anode rod","start")}
 ${zL(150,120,70,100,6,96,"Foam insulation")}
 ${zL(140,206,70,226,6,240,"Gas control / thermostat")}
 ${zL(254,150,300,170,262,188,"T&P discharge pipe","start")}`
};
