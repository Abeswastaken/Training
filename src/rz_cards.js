
const zL=(x1,y1,x2,y2,tx,ty,t,anchor="start")=>{const w=String(t).length*6.6;if(anchor==="start"&&tx+w>336){anchor="end";tx=336}if(anchor==="end"&&tx-w<4){anchor="start";tx=4}return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#4a5257" stroke-width="1" fill="none"/><circle cx="${x1}" cy="${y1}" r="2" fill="#4a5257"/><text x="${tx}" y="${ty}" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#2a3135" stroke="#fff" stroke-width="3" stroke-opacity=".85" paint-order="stroke" stroke-linejoin="round" text-anchor="${anchor}">${t}</text>`};
const zFA=(d,col)=>`<path d="${d}" stroke="${col}" class="zFlow"/>`;
function zSpiral(cx,cy,a0,turns,b,rot){let d="";for(let i=0;i<=turns*48;i++){const t=i/48*2*Math.PI,r=4+b*t,x=cx+r*Math.cos(t+a0+rot),y=cy+r*0.62*Math.sin(t+a0+rot);d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}return d}
ZILL.compressor=`
 ${zShade(170,232,96)}
 <path d="M84 222 L256 222 L246 210 L94 210 Z" fill="url(#zPlasticDk)"/>
 ${[104,236].map(x=>`<ellipse cx="${x}" cy="216" rx="9" ry="4" fill="#111"/>`).join("")}
 <g filter="url(#zShadow)">
  <rect x="110" y="62" width="120" height="150" fill="url(#zShell)"/>
  <ellipse cx="170" cy="212" rx="60" ry="10" fill="#15181a"/>
  <path d="M110 62 Q110 22 170 22 Q230 22 230 62 Z" fill="url(#zDome)"/>
  <ellipse cx="170" cy="62" rx="60" ry="9" fill="none" stroke="#0e1012" stroke-width="2"/>
  <ellipse cx="170" cy="62" rx="60" ry="9" fill="none" stroke="#8a9399" stroke-width=".8" transform="translate(0,2)" opacity=".5"/>
  <rect x="126" y="34" width="9" height="176" rx="4" fill="#fff" opacity=".1"/>
 </g>
 <!-- discharge -->
 <rect x="164" y="2" width="12" height="24" fill="url(#zCuV)"/><rect x="161" y="18" width="18" height="6" rx="2" fill="url(#zBrass)"/>
 ${zFA("M170 30 V4","#ff4a3a","cDis")}
 <!-- suction -->
 <rect x="228" y="148" width="84" height="13" fill="url(#zCuH)"/><rect x="228" y="145" width="8" height="19" rx="2" fill="url(#zBrass)"/>
 ${zFA("M314 154 H232","#6fb3e8","cSuc")}
 <!-- terminal box -->
 <rect x="94" y="100" width="20" height="34" rx="3" fill="url(#zPlasticDk)" stroke="#000"/><circle cx="104" cy="106" r="2" fill="url(#zScrew)"/><circle cx="104" cy="128" r="2" fill="url(#zScrew)"/>
 <!-- cutaway window -->
 <clipPath id="zc_cwin"><path d="M134 88 L210 84 L214 150 L200 156 L190 150 L170 158 L150 151 L136 156 Z"/></clipPath>
 <g clip-path="url(#zc_cwin)">
  <rect x="120" y="80" width="110" height="90" fill="url(#zInside)"/>
  <ellipse cx="172" cy="118" rx="42" ry="27" fill="#2a2f33" stroke="#555d62"/>
  
  <path d="${zSpiral(172,118,0,3.1,3.6,0)}" fill="none" stroke="#c9d0d4" stroke-width="3.2"/>
  <path class="zOrb" d="${zSpiral(172,118,Math.PI,3.1,3.6,0)}" fill="none" stroke="#f0a040" stroke-width="3.2"/>
  <circle cx="172" cy="118" r="3" fill="#ff4a3a"/>
 </g>
 <path d="M134 88 L210 84 L214 150 L200 156 L190 150 L170 158 L150 151 L136 156 Z" fill="none" stroke="#9aa3a9" stroke-width="2.2" stroke-linejoin="round"/>
 ${zL(140,130,60,160,6,164,"Fixed scroll")}${zL(196,104,262,90,258,84,"Orbiting scroll","start")}
 ${zL(104,116,40,96,6,92,"Terminals")}${zL(260,154,276,186,236,204,"Suction (cool vapor)")}${zL(176,12,214,12,218,15,"Discharge (hot gas)")}
`;


ZILL.txv=`
 ${zShade(170,236,120)}
 <!-- inlet liquid line -->
 <rect x="0" y="118" width="122" height="14" fill="url(#zCuH)"/>
 <polygon points="104,112 122,112 126,125 122,138 104,138 100,125" fill="url(#zBrassH)" stroke="#5e400e"/>
 ${zFA("M6 125 H98","#f08a2a","tLiq")}
 <!-- outlet -->
 <rect x="163" y="176" width="14" height="66" fill="url(#zCuV)"/>
 <polygon points="158,172 182,172 186,182 182,192 158,192 154,182" fill="url(#zBrassH)" stroke="#5e400e"/>
 ${zFA("M170 196 V240","#3d7de0","tMix")}
 <!-- body -->
 <g filter="url(#zShadow)">
  <rect x="122" y="100" width="96" height="74" rx="8" fill="url(#zBrass)" stroke="#5e400e"/>
  <rect x="126" y="70" width="88" height="26" rx="12" fill="url(#zSteel)" stroke="#5f686d"/>
  <rect x="134" y="94" width="72" height="8" fill="url(#zBrassH)"/>
  <rect x="200" y="160" width="40" height="8" fill="url(#zCuH)"/>
 </g>
 <!-- capillary + bulb -->
 <path d="M170 70 C170 40 200 30 230 40 C262 50 250 72 232 66 C214 60 226 44 246 50 C272 58 286 120 280 200" fill="none" stroke="#9aa3aa" stroke-width="2.4"/>
 <rect x="226" y="198" width="104" height="18" fill="url(#zCuH)"/>
 <rect x="262" y="194" width="42" height="12" rx="6" fill="url(#zSteelH)" stroke="#5f686d"/>
 <rect x="268" y="192" width="4" height="26" fill="#3a3f44"/><rect x="294" y="192" width="4" height="26" fill="#3a3f44"/>
 ${zFA("M232 207 H330","#6fb3e8","tSuc")}
 <!-- cutaway of body -->
 <clipPath id="zc_tcut"><path d="M132 106 H208 V166 H132 Z"/></clipPath>
 <g clip-path="url(#zc_tcut)">
  <rect x="128" y="100" width="90" height="72" fill="url(#zInside)"/>
  <path d="M128 120 H166 V132 H128 Z" fill="url(#zLiq)"/>
  <path d="M162 138 H178 V172 H162 Z" fill="url(#zMix)"/>
  <g class="zBub">${[0,1,2,3,4].map(i=>`<circle cx="${166+(i%2)*8}" cy="${142+i*6}" r="1.8" fill="#dfeeff"/>`).join("")}</g>
  <path d="M160 132 L170 140 L180 132 Z" fill="#7a5a1a"/>
  <g class="zBob"><rect x="167" y="104" width="6" height="30" fill="url(#zSteel)"/><path d="M167 134 L170 140 L173 134 Z" fill="#c9d0d4"/></g>
  <path d="M186 140 l6 4 l-6 4 l6 4 l-6 4 l6 4" stroke="#c9d0d4" stroke-width="2" fill="none"/>
 </g>
 <path d="M132 106 H208 V166 H132 Z" fill="none" stroke="#e8cd78" stroke-width="2"/>
 <path d="M132 84 Q170 88 208 84" stroke="#2a3135" stroke-width="2" fill="none"/>
 ${zL(144,126,60,96,6,92,"High-pressure liquid in")}${zL(170,112,96,54,20,50,"Pin and seat (orifice)")}${zL(150,84,110,24,40,20,"Diaphragm (power head)")}
 ${zL(174,214,110,226,6,230,"Low-pressure mix out")}${zL(300,214,300,230,206,244,"Bulb on suction line")}
`;


const zScrewL=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="url(#zScrew)" stroke="#4d555a"/><path d="M${x-4.5} ${y-1.5} L${x+4.5} ${y+1.5}" stroke="#3a3f43" stroke-width="1.6"/>`;
const zWireL=(x,y1,y2,grad)=>`<rect x="${x-5}" y="${y1}" width="10" height="${y2-y1}" rx="4" fill="url(#${grad})"/>`;
ZILL.contactor=`
 ${zShade(170,236,88)}
 ${zWireL(130,0,46,"zWireBk")}${zWireL(210,0,46,"zWireRd")}
 ${zWireL(130,206,250,"zWireBk")}${zWireL(210,206,250,"zWireRd")}
 <g filter="url(#zShadow)">
  <rect x="96" y="34" width="148" height="186" rx="10" fill="url(#zPlastic)" stroke="#8e8777"/>
  <rect x="100" y="38" width="140" height="36" rx="6" fill="url(#zPlasticDk)"/>
  <rect x="100" y="182" width="140" height="34" rx="6" fill="url(#zPlasticDk)"/>
 </g>
 <rect x="124" y="46" width="14" height="10" fill="#d48a52"/><rect x="204" y="46" width="14" height="10" fill="#d48a52"/>
 <rect x="124" y="192" width="14" height="10" fill="#d48a52"/><rect x="204" y="192" width="14" height="10" fill="#d48a52"/>
 ${zScrewL(130,58)}${zScrewL(210,58)}${zScrewL(130,198)}${zScrewL(210,198)}
 <text x="152" y="62" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#e9ecee">L1</text><text x="176" y="62" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#e9ecee">L2</text>
 <text x="152" y="203" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#e9ecee">T1</text><text x="176" y="203" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#e9ecee">T2</text>
 <!-- window showing contacts and armature -->
 <rect x="112" y="84" width="116" height="88" rx="6" fill="#1e2326" stroke="#6b7378"/>
 <rect x="120" y="92" width="100" height="10" rx="2" fill="#6b747a"/>
 <g>
  <rect x="122" y="104" width="96" height="10" rx="3" fill="url(#zSteelH)"/>
  <rect x="124" y="114" width="12" height="6" fill="#d9dee1"/><rect x="204" y="114" width="12" height="6" fill="#d9dee1"/>
  <rect x="160" y="114" width="20" height="18" fill="#7d868c"/>
 </g>
 <rect x="122" y="124" width="16" height="8" fill="#d9dee1"/><rect x="202" y="124" width="16" height="8" fill="#d9dee1"/>
 <g opacity="0"><path d="M130 120 l3 -4 l2 4 l3 -4" stroke="#9fd8ff" stroke-width="1.6" fill="none" filter="url(#zGlow)"/></g>
 <rect x="146" y="138" width="48" height="28" rx="3" fill="url(#zWind)" stroke="#5a2e10"/>
 <rect x="146" y="138" width="48" height="28" rx="3" fill="#ffd27a" opacity="0" filter="url(#zGlow)"/>
 <!-- coil terminals -->
 <rect x="240" y="124" width="22" height="7" rx="1.5" fill="url(#zSteelH)"/><rect x="240" y="146" width="22" height="7" rx="1.5" fill="url(#zSteelH)"/>
 <path d="M262 127 H300 C320 127 322 100 340 96" stroke="url(#zWireYl)" stroke-width="5" fill="none"/>
 <path d="M262 149 H300 C320 149 322 170 340 176" stroke="url(#zWireBl)" stroke-width="5" fill="none"/>
 <text x="244" y="120" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#2a3135">A1</text><text x="244" y="166" font-family="IBM Plex Sans,sans-serif" font-size="9" font-weight="700" fill="#2a3135">A2</text>
 ${zL(124,108,60,96,6,92,"Moving contacts")}${zL(150,152,60,170,6,174,"24 V coil")}${zL(210,58,268,40,254,36,"Line in","start")}${zL(210,198,268,222,254,234,"Load out","start")}
 <text x="6" y="244" text-anchor="start" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#2a3135">PULLED IN</text>
`;


ZILL.cap=`
 ${zShade(170,236,64)}
 <g filter="url(#zShadow)">
  <rect x="116" y="50" width="108" height="176" rx="6" fill="url(#zAlu)"/>
  <ellipse cx="170" cy="226" rx="54" ry="9" fill="#7e868b"/>
  <ellipse cx="170" cy="50" rx="54" ry="11" fill="url(#zAluTop)" stroke="#8f979d"/>
  <rect x="116" y="96" width="108" height="92" fill="#f2f0e9" opacity=".92"/>
  <rect x="116" y="96" width="108" height="92" fill="url(#zAlu)" opacity=".28"/>
 </g>
 <ellipse cx="170" cy="46" rx="30" ry="6" fill="#2f3337"/>
 ${[[140,"HERM"],[170,"C"],[200,"FAN"]].map(([x,t])=>`${[-6,0,6].map(d=>`<rect x="${x+d-2}" y="26" width="4" height="18" fill="url(#zSteel)" stroke="#6f787e" stroke-width=".5"/>`).join("")}`).join("")}
 <text x="170" y="122" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="17" font-weight="700" fill="#1d2327">45 + 5 µF</text>
 <text x="170" y="142" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="11" font-weight="600" fill="#3a4246">±6%  440 VAC  60 Hz</text>
 <text x="170" y="160" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="9" fill="#5b666d">DUAL RUN CAPACITOR · OIL FILLED</text>
 <rect x="124" y="54" width="10" height="168" rx="4" fill="#fff" opacity=".35"/>
 ${zL(140,40,80,60,6,64,"Compressor (HERM)")}${zL(200,40,262,64,250,80,"Fan motor (FAN)","start")}${zL(170,40,170,4,182,8,"Common (C)","start")}
`;


ZILL.motor3=`
 ${zShade(170,232,130)}
 <g filter="url(#zShadow)">
  <rect x="60" y="208" width="44" height="14" rx="2" fill="#253b52"/><rect x="226" y="208" width="44" height="14" rx="2" fill="#253b52"/>
  <rect x="62" y="86" width="196" height="124" rx="16" fill="url(#zBlue)"/>
  ${Array.from({length:11},(_,i)=>`<rect x="70" y="${92+i*10.5}" width="180" height="4" rx="2" fill="#1d3247" opacity=".55"/><rect x="70" y="${95.5+i*10.5}" width="180" height="1.5" fill="#9fc0dd" opacity=".35"/>`).join("")}
  <rect x="22" y="94" width="44" height="108" rx="10" fill="url(#zBlue)"/>
  ${Array.from({length:9},(_,i)=>`<rect x="30" y="${102+i*10.5}" width="30" height="4" rx="2" fill="#0e1a26" opacity=".8"/>`).join("")}
  <rect x="254" y="100" width="22" height="96" rx="8" fill="url(#zBlue)"/>
  <rect x="120" y="58" width="70" height="32" rx="4" fill="url(#zBlue)"/><rect x="190" y="66" width="34" height="14" fill="url(#zSteelH)"/>
 </g>
 <rect x="276" y="140" width="56" height="16" fill="url(#zSteelH)"/><rect x="300" y="138" width="20" height="4" fill="#5f686d"/>
 <!-- cutaway -->
 <clipPath id="zc_mcut"><path d="M110 104 L232 104 L232 196 L110 196 Z"/></clipPath>
 <g clip-path="url(#zc_mcut)">
  <rect x="100" y="100" width="140" height="100" fill="url(#zInside)"/>
  <rect x="108" y="104" width="126" height="20" fill="url(#zLam)"/><rect x="108" y="176" width="126" height="20" fill="url(#zLam)"/>
  <rect x="104" y="106" width="16" height="88" rx="6" fill="url(#zWind)"/><rect x="222" y="106" width="16" height="88" rx="6" fill="url(#zWind)"/>
  <rect x="120" y="116" width="102" height="8" fill="url(#zWind)"/><rect x="120" y="176" width="102" height="8" fill="url(#zWind)"/>
  <rect x="122" y="128" width="98" height="44" rx="3" fill="url(#zLam)"/>
  <clipPath id="zc_mrot"><rect x="122" y="128" width="98" height="44" rx="3"/></clipPath><g clip-path="url(#zc_mrot)"><g class="zSlide">${Array.from({length:16},(_,i)=>`<path d="M${118+i*8} 128 L${126+i*8} 172" stroke="#c4884a" stroke-width="3"/>`).join("")}</g></g>
  <rect x="122" y="128" width="98" height="44" rx="3" fill="none" stroke="#2a3135"/>
  <rect x="232" y="144" width="44" height="8" fill="url(#zSteelH)"/>
 </g>
 <path d="M110 104 L232 104 L232 196 L110 196 Z" fill="none" stroke="#9fc0dd" stroke-width="2"/>
 ${zL(112,140,60,60,6,54,"Stator winding (copper)")}${zL(170,150,170,236,180,246,"Rotor bars (aluminum)","start")}${zL(40,140,10,236,6,246,"Shaft fan cowl")}${zL(150,66,150,30,160,30,"Terminal box","start")}${zL(300,148,320,120,284,112,"Shaft","start")}
`;
