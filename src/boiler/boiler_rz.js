/* ============ REALISTIC DRAWING HELPERS (shared rz library) ============ */
// Pipes keep their live temperature color; bzPipes() adds a dark outline and a highlight so they read as round pipe.
function bzPipes(root){const NS="http://www.w3.org/2000/svg";
 root.querySelectorAll("path.pipe:not([data-z]):not([pathLength])").forEach(p=>{p.setAttribute("data-z","1");const cs=getComputedStyle(p);const w=parseFloat(p.getAttribute("stroke-width")||cs.strokeWidth)||9,d=p.getAttribute("d");
  const back=document.createElementNS(NS,"path");back.setAttribute("d",d);back.setAttribute("class","zTubeO");back.setAttribute("stroke-width",w+2.4);back.setAttribute("stroke","#24292c");
  if(p.id)back.setAttribute("data-follow",p.id);p.parentNode.insertBefore(back,p);
  const hi=document.createElementNS(NS,"path");hi.setAttribute("d",d);hi.setAttribute("class","zTubeH");hi.setAttribute("stroke-width",Math.max(1,w*.26).toFixed(1));
  hi.setAttribute("transform",`translate(${(-w*.18).toFixed(1)} ${(-w*.18).toFixed(1)})`);if(p.id)hi.setAttribute("data-follow",p.id);p.parentNode.insertBefore(hi,p.nextSibling)})}
// outline/highlight copies follow the opacity of pipes that toggle (Hartford loop on/off)
function bzFollow(root){root.querySelectorAll("[data-follow]").forEach(e=>{const src=document.getElementById(e.dataset.follow);if(src){const o=src.getAttribute("opacity");e.setAttribute("opacity",o==null?1:o)}})}
const bzJacket=(x,y,w,h,col="url(#bzJacket)")=>`<g filter="url(#zShadow)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${col}" stroke="#3f4a52" stroke-width="1.4"/></g><rect x="${x+3}" y="${y+3}" width="${w-6}" height="10" rx="4" fill="rgba(255,255,255,.18)"/>`;
const bzSections=(x,y,w,h,n)=>{const sw=w/n;return Array.from({length:n},(_,i)=>`<rect x="${(x+i*sw+1).toFixed(1)}" y="${y}" width="${(sw-2).toFixed(1)}" height="${h}" rx="5" fill="url(#bzIron)" stroke="#15181a" stroke-width=".8"/><rect x="${(x+i*sw+3).toFixed(1)}" y="${y+4}" width="2.4" height="${h-8}" rx="1" fill="rgba(255,255,255,.12)"/>`).join("")};
const bzBox=(x,y,w,h,f="url(#zSteelH)",r=3,st="#4d555a")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${st}" stroke-width="1.2" filter="url(#zShadow)"/>`;
const bzNut=(x,y,r=5,f="url(#zBrass)")=>`<polygon points="${[0,1,2,3,4,5].map(i=>`${(x+r*Math.cos(i*Math.PI/3)).toFixed(1)},${(y+r*Math.sin(i*Math.PI/3)).toFixed(1)}`).join(" ")}" fill="${f}" stroke="#6a4a12" stroke-width=".7"/>`;
const bzPig=(x,y1,y2)=>`<rect x="${x-2}" y="${y1-10}" width="4" height="10" fill="url(#zBrass)"/><circle cx="${x}" cy="${y1-16}" r="5.5" fill="none" stroke="#7a5414" stroke-width="5"/><circle cx="${x}" cy="${y1-16}" r="5.5" fill="none" stroke="#c9a24a" stroke-width="3"/><rect x="${x-2}" y="${y2}" width="4" height="${y1-22-y2}" fill="url(#zBrass)"/>`;
const bzBurner=(x,y,w)=>`<rect x="${x-10}" y="${y-2}" width="${w+20}" height="8" rx="3" fill="url(#zSteelH)" stroke="#3f474c"/>${Array.from({length:Math.floor(w/20)},(_,i)=>`<rect x="${x+4+i*20}" y="${y+4}" width="12" height="10" rx="2" fill="url(#zSteel)" stroke="#3f474c" stroke-width=".7"/>`).join("")}`;
const bzFlame=(id,dx=0)=>`<g id="${id}" opacity="0"${dx?` transform="translate(${dx},0)"`:""}><path class="flame" d="M150 374 q8 -26 16 0 q8 -30 17 0 q8 -34 17 0 q9 -30 17 0 q8 -26 16 0 q6 -20 12 0 z" fill="url(#zFlame)" filter="url(#zGlow)"/><path class="flame" d="M156 374 q5 -12 10 0 q6 -16 12 0 q6 -18 12 0 q6 -16 12 0 q6 -14 12 0 q5 -10 10 0 z" fill="#3c7bf0" opacity=".85"/></g>`;
const bzGasValve=(x,y,lampId)=>`${bzBox(x,y,34,28,"url(#zPlasticDk)",4,"#000")}<rect x="${x+8}" y="${y-8}" width="18" height="10" rx="2" fill="url(#zAlu)" stroke="#4d555a"/><circle cx="${x+17}" cy="${y-3}" r="4" fill="#c0281c" stroke="#5a0b07"/><circle id="${lampId}" cx="${x+17}" cy="${y+14}" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>`;
const bzBrassValve=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w,h)/3}" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width="1" filter="url(#zShadow)"/><rect x="${x+2}" y="${y+2}" width="${w-4}" height="3" rx="1.5" fill="rgba(255,255,255,.35)"/>`;
const bzVentCap=(cx,y,w=14,h=18)=>`<rect x="${cx-w/2}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#zSteel)" stroke="#4d555a" filter="url(#zShadow)"/><ellipse cx="${cx}" cy="${y}" rx="${w/2}" ry="2.5" fill="url(#zAluTop)" stroke="#4d555a" stroke-width=".7"/><rect x="${cx-1.5}" y="${y-5}" width="3" height="5" fill="url(#zSteel)"/>`;
const bzTstatRound=(cx,cy,txtId,lampId)=>`<circle cx="${cx}" cy="${cy}" r="23" fill="url(#zTan)" stroke="#8f887a" stroke-width="1.2" filter="url(#zShadow)"/><circle cx="${cx}" cy="${cy}" r="17" fill="#f3efe6" stroke="#b0a896"/>${Array.from({length:9},(_,i)=>{const a=(-120+i*30)*Math.PI/180;return `<line x1="${(cx+13*Math.sin(a)).toFixed(1)}" y1="${(cy-13*Math.cos(a)).toFixed(1)}" x2="${(cx+16*Math.sin(a)).toFixed(1)}" y2="${(cy-16*Math.cos(a)).toFixed(1)}" stroke="#5b666d" stroke-width=".8"/>`}).join("")}<text class="valD" id="${txtId}" x="${cx}" y="${cy+3}" text-anchor="middle" fill="#1d2327" font-size="12">68</text><circle id="${lampId}" cx="${cx}" cy="${cy+11}" r="2.6" fill="var(--lamp-off)"/>`;
const bzHop=(x,y,r=8)=>`<path d="M${x} ${y-r} a${r} ${r} 0 0 1 0 ${2*r}" fill="none" stroke="var(--paper)" stroke-width="12"/>`;
const BZ_DEFS=`<linearGradient id="bzJacket" x1="0" x2="1"><stop offset="0" stop-color="#5f7486"/><stop offset=".18" stop-color="#8ea3b4"/><stop offset=".55" stop-color="#6f8597"/><stop offset="1" stop-color="#4a5b69"/></linearGradient>
<linearGradient id="bzJacketS" x1="0" x2="1"><stop offset="0" stop-color="#7a3a33"/><stop offset=".18" stop-color="#a95447"/><stop offset=".55" stop-color="#8c4338"/><stop offset="1" stop-color="#5e2a24"/></linearGradient>
<linearGradient id="bzIron" x1="0" x2="1"><stop offset="0" stop-color="#2c3135"/><stop offset=".35" stop-color="#4b5359"/><stop offset="1" stop-color="#22272a"/></linearGradient>
<linearGradient id="bzRed" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e0564a"/><stop offset=".45" stop-color="#b8322a"/><stop offset="1" stop-color="#7c1e18"/></linearGradient>
<linearGradient id="bzTankB" x1="0" x2="1"><stop offset="0" stop-color="#3d6b9a"/><stop offset=".25" stop-color="#77a3cf"/><stop offset=".6" stop-color="#4f7fb0"/><stop offset="1" stop-color="#2e5378"/></linearGradient>
<linearGradient id="bzBase" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4f1ea"/><stop offset=".6" stop-color="#e2ddd1"/><stop offset="1" stop-color="#c9c2b2"/></linearGradient>
<linearGradient id="bzRad" x1="0" x2="1"><stop offset="0" stop-color="rgba(0,0,0,.35)"/><stop offset=".3" stop-color="rgba(255,255,255,.18)"/><stop offset=".7" stop-color="rgba(0,0,0,.05)"/><stop offset="1" stop-color="rgba(0,0,0,.4)"/></linearGradient>
<pattern id="bzFin" width="5" height="18" patternUnits="userSpaceOnUse"><rect width="5" height="18" fill="#9aa3a9"/><rect x="0" width="1.4" height="18" fill="#d9dee1"/></pattern>`;

const HYD_SVG=`<defs>${BZ_DEFS}</defs>
    <line x1="10" y1="452" x2="790" y2="452" stroke="var(--line)" stroke-dasharray="2 4"/>
    <g class="part" data-p="room" tabindex="0">
      <rect class="hl" x="598" y="130" width="182" height="200" fill="rgba(233,228,214,.25)" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="6 4"/>
      <rect x="690" y="140" width="34" height="26" rx="2" fill="#cfe6f5" stroke="#8a8f86" stroke-width="2" opacity=".8"/><line x1="707" y1="140" x2="707" y2="166" stroke="#8a8f86" stroke-width="1.5"/>
      <text class="lbl" x="606" y="150">Heated room</text>
      <text class="val" id="h_tRoomTxt" x="606" y="168">66.0°F</text>
    </g>
    <text class="lbl" x="700" y="120" text-anchor="end" id="h_outTxt">Outside 25°F</text>
    <!-- flue -->
    <rect x="138" y="118" width="22" height="62" fill="url(#zSteel)" stroke="#5f686d"/><path d="M138 132 H160 M138 150 H160" stroke="#5f686d" stroke-width=".8"/>
    <!-- relief discharge -->
    <path d="M272 140 H300 V444" class="pipe" stroke="#9aa3a9" stroke-width="5"/>
    <rect x="288" y="446" width="24" height="6" fill="var(--line)"/>
    <text class="lbl" x="318" y="448">Drain</text>
    <g id="h_drip" opacity="0"><circle cx="300" cy="440" r="3" fill="var(--cold)"/><circle cx="300" cy="430" r="2" fill="var(--cold)"/></g>
    <!-- pipes -->
    <path id="h_pSup" d="M200 180 V90 H330 M370 90 H432 M468 90 H590 V300 H600" class="pipe"/>
    <path id="h_pRet" d="M740 300 H760 V420 H160 V400" class="pipe"/>
    <path id="h_fSup" d="M200 180 V90 H590 V300 H600" class="flow"/>
    <path id="h_fRet" d="M740 300 H760 V420 H160 V400" class="flow"/>
    <path d="M350 105 V150" class="pipe" id="h_pTank"/>
    <!-- cold water in: backflow preventer, then fill valve, then a tee into the expansion tank line -->
    ${bzHop(520,90)}
    <path d="M612 30 H520 V82 a8 8 0 0 1 0 16 V134 H354" class="pipe" stroke="var(--cold)" stroke-width="5"/>
    <circle cx="350" cy="134" r="5.5" fill="url(#zBrass)" stroke="#6a4a12"/>
    <text class="lbl" x="618" y="34">Cold water</text>
    <g class="part" data-p="backflow" tabindex="0">
      <rect class="hl" x="508" y="38" width="24" height="36" rx="5" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1" filter="url(#zShadow)"/>
      <path d="M508 56 H532" stroke="#6a4a12" stroke-width="1"/>${bzNut(520,38,5)}${bzNut(520,74,5)}
      <rect x="532" y="50" width="10" height="7" rx="1.5" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".7"/>
      <text class="lbl" x="548" y="60">Backflow</text>
    </g>
    <g class="part" data-p="fill" tabindex="0">
      ${bzBrassValve(378,124,36,20)}<path d="M384 124 Q396 108 408 124" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="393" y="104" width="6" height="8" fill="url(#zBrass)"/><rect x="386" y="100" width="20" height="5" rx="2" fill="#7a5414"/>
      <rect class="hl" x="376" y="98" width="40" height="48" fill="transparent" stroke="none"/>
      <text class="lbl" x="396" y="162" text-anchor="middle">Fill</text>
      <line id="h_fillX" x1="374" y1="100" x2="418" y2="148" stroke="var(--bad)" stroke-width="3" opacity="0"/>
    </g>
    <!-- air separator -->
    <g class="part" data-p="airsep" tabindex="0">
      <rect class="hl" x="328" y="72" width="44" height="36" rx="10" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1.2" filter="url(#zShadow)"/>
      <rect x="332" y="76" width="36" height="5" rx="2" fill="rgba(255,255,255,.3)"/>
      ${bzVentCap(350,56,14,17)}
      <g id="h_bubbles" opacity="0"><circle cx="350" cy="44" r="3" fill="none" stroke="var(--cold)"/><circle cx="356" cy="36" r="2" fill="none" stroke="var(--cold)"/><circle cx="345" cy="30" r="2.5" fill="none" stroke="var(--cold)"/></g>
      <text class="lbl" x="282" y="66">Air sep.</text>
    </g>
    <!-- expansion tank: cutaway window shows the diaphragm -->
    <g class="part" data-p="tank" tabindex="0">
      <rect class="hl" x="326" y="150" width="48" height="84" rx="16" fill="url(#bzTankB)" stroke="#23405e" stroke-width="1.4" filter="url(#zShadow)"/>
      <clipPath id="h_tankClip"><rect x="333" y="160" width="34" height="68" rx="8"/></clipPath>
      <rect x="333" y="160" width="34" height="68" rx="8" fill="#e9eef2" stroke="#23405e" stroke-width=".8"/>
      <rect id="h_tankWater" clip-path="url(#h_tankClip)" x="327" y="151" width="46" height="20" fill="var(--cold)" opacity=".6"/>
      <line id="h_tankDia" x1="333" x2="367" y1="171" y2="171" stroke="#1d2327" stroke-width="2.4"/>
      <rect x="346" y="140" width="8" height="10" fill="url(#zSteel)"/><rect x="346" y="234" width="8" height="5" fill="url(#zBrass)"/>
      <text class="lbl" x="380" y="190">Exp. tank</text>
      <text class="val" id="h_tankTxt" x="380" y="206">air 12 psi</text>
    </g>
    <!-- circulator: red volute and motor, window shows the impeller -->
    <g class="part" data-p="pump" tabindex="0">
      <rect x="428" y="80" width="6" height="20" fill="url(#bzRed)" stroke="#5a1410"/><rect x="466" y="80" width="6" height="20" fill="url(#bzRed)" stroke="#5a1410"/>
      <circle class="hl" cx="450" cy="90" r="19" fill="url(#bzRed)" stroke="#5a1410" stroke-width="1.2" filter="url(#zShadow)"/>
      <rect x="436" y="104" width="28" height="22" rx="4" fill="url(#bzRed)" stroke="#5a1410" filter="url(#zShadow)"/><rect x="440" y="108" width="20" height="10" rx="2" fill="#f2f0e9"/><text x="450" y="116" text-anchor="middle" font-family="var(--display)" font-size="7" font-weight="700" fill="#7c1e18">007</text>
      <circle cx="450" cy="90" r="11" fill="#2a2f33" stroke="#5a1410"/>
      <g id="h_imp"><line x1="450" y1="80" x2="450" y2="100" stroke="#c4cacf" stroke-width="2.5"/><line x1="440" y1="90" x2="460" y2="90" stroke="#c4cacf" stroke-width="2.5"/></g>
      <circle cx="450" cy="90" r="2.5" fill="#c4cacf"/>
      <text class="lbl" x="450" y="62" text-anchor="middle">Circulator</text>
      <path d="M478 80 l8 10 -8 10" fill="none" stroke="var(--muted)" stroke-width="2"/>
    </g>
    <!-- baseboard: enclosure cut open to show the finned tube -->
    <g class="part" data-p="baseboard" tabindex="0">
      <rect class="hl" x="600" y="288" width="140" height="26" rx="3" fill="url(#bzBase)" stroke="#9a9384" stroke-width="1.2" filter="url(#zShadow)"/>
      <rect x="606" y="293" width="128" height="15" fill="url(#bzFin)"/>
      <rect x="600" y="288" width="140" height="4" fill="#d7d1c3"/><path d="M604 290 h132" stroke="#9a9384" stroke-width=".6" stroke-dasharray="3 2"/>
      <text class="lbl" x="600" y="282">Baseboard</text>
    </g>
    <!-- thermostat (round dial) -->
    <g class="part" data-p="tstat" tabindex="0">
      <rect class="hl" x="699" y="169" width="46" height="46" fill="transparent" stroke="none"/>
      ${bzTstatRound(722,192,"h_tstatTxt","h_tstatLamp")}
      <text class="lbl" x="722" y="232" text-anchor="middle">Thermostat</text>
    </g>
    <!-- boiler: jacket cut away to show the cast-iron sections and the water -->
    <g class="part" data-p="boiler" tabindex="0" id="h_boilerG">
      <rect class="hl" x="120" y="180" width="160" height="220" rx="6" fill="transparent" stroke="none"/>
      ${bzJacket(120,180,160,220)}
      <rect x="126" y="186" width="148" height="159" fill="#1b1f22"/>
      ${bzSections(128,188,144,155,6)}
      <rect id="h_bGlow" x="126" y="186" width="148" height="0" fill="#ff5a1f" opacity="0"/>
      <rect id="h_bWater" x="126" y="186" width="148" height="159" fill="var(--cold)" opacity=".45"/>
      <g id="h_bSteam" opacity="0" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="150" cy="300" r="3"/><circle cx="235" cy="320" r="4"/><circle cx="190" cy="335" r="3"/><circle cx="262" cy="290" r="2.5"/></g>
      <rect x="126" y="345" width="148" height="50" fill="#121517"/>
      <line x1="120" x2="280" y1="218" y2="218" stroke="#ff6a5a" stroke-dasharray="3 3" opacity=".9"/>
      <text x="276" y="214" text-anchor="end" font-family="var(--display)" font-size="9" fill="#ffb0a6">LWCO TRIP LEVEL</text>
      <line x1="120" x2="280" y1="281" y2="281" stroke="#ffc35a" stroke-dasharray="3 3" opacity=".9"/>
      <text x="276" y="292" text-anchor="end" font-family="var(--display)" font-size="9" fill="#ffd27a">DRY FIRE BELOW</text>
      <text class="valD" id="h_bLvl" x="128" y="358" font-size="10" fill="#e9ecee">Water 100%</text>
      <text class="lbl" x="128" y="198" style="fill:#e9ecee">Boiler</text>
    </g>
    <!-- burner -->
    <g class="part" data-p="burner" tabindex="0">
      <rect class="hl" x="140" y="374" width="120" height="14" rx="3" fill="transparent" stroke="none"/>
      ${bzBurner(140,376,120)}
      ${bzFlame("h_flame")}
      <path id="h_spark" d="M196 372 l6 -8 -4 0 6 -8" stroke="#f5c400" stroke-width="2" fill="none" opacity="0"/>
      <text class="lbl" x="200" y="414" text-anchor="middle">Burner</text>
    </g>
    <!-- gas valve -->
    <g class="part" data-p="gas" tabindex="0">
      <path d="M20 381 H130" class="pipe" stroke="#3a3f44" stroke-width="6"/>
      <rect class="hl" x="54" y="358" width="34" height="38" fill="transparent" stroke="none"/>
      ${bzGasValve(54,367,"h_gasLamp")}
      <text class="lbl" x="71" y="414" text-anchor="middle">Gas valve</text>
    </g>
    <!-- tridicator -->
    <g class="part" data-p="gauge" tabindex="0">
      <circle class="hl" cx="200" cy="246" r="36" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1.2" filter="url(#zShadow)"/>
      <circle cx="200" cy="246" r="31" fill="#fbfbf8" stroke="#8a6a22"/>
      ${Array.from({length:11},(_,i)=>{const a=(-135+i*27)*Math.PI/180;return `<line x1="${(200+27*Math.sin(a)).toFixed(1)}" y1="${(246-27*Math.cos(a)).toFixed(1)}" x2="${(200+(i%5?24:22)*Math.sin(a)).toFixed(1)}" y2="${(246-(i%5?24:22)*Math.cos(a)).toFixed(1)}" stroke="#1d2327" stroke-width="1"/>`}).join("")}
      <path d="M181 265 A27 27 0 0 1 219 265" fill="none" stroke="#2f6fd6" stroke-width="2" opacity=".6"/>
      <line id="h_needle" x1="200" y1="246" x2="200" y2="226" stroke="#c0281c" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="200" cy="246" r="3" fill="#1d2327"/>
      <text class="valD" id="h_gPsi" x="200" y="263" text-anchor="middle" style="font-size:8px" fill="#1d2327">12 psi</text>
      <text class="valD" id="h_gTemp" x="200" y="272" text-anchor="middle" style="font-size:8px" fill="#1d2327">150°F</text>
    </g>
    <!-- aquastat + manual high limit -->
    <g class="part" data-p="aquastat" tabindex="0">
      <rect class="hl" x="146" y="300" width="50" height="34" rx="3" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2" filter="url(#zShadow)"/>
      <rect x="150" y="304" width="42" height="12" rx="2" fill="#2a2f33"/>
      <text x="171" y="313" text-anchor="middle" font-family="var(--display)" font-size="8" fill="#e9ecee">AQUASTAT</text>
      <circle id="h_aqLamp" cx="171" cy="325" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>
    </g>
    <g class="part" data-p="mrhl" tabindex="0">
      <rect class="hl" x="204" y="300" width="50" height="34" rx="3" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2" filter="url(#zShadow)"/>
      <rect x="208" y="304" width="42" height="12" rx="2" fill="#2a2f33"/>
      <text x="229" y="313" text-anchor="middle" font-family="var(--display)" font-size="8" fill="#e9ecee">HI LIMIT</text>
      <circle cx="244" cy="325" r="4" fill="#c0281c" stroke="#5a0b07"/>
      <circle id="h_mrLamp" cx="222" cy="325" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>
    </g>
    <!-- LWCO -->
    <g class="part" data-p="lwco" tabindex="0">
      <rect x="114" y="266" width="8" height="10" fill="url(#zBrass)"/>
      <rect class="hl" x="86" y="256" width="30" height="30" rx="3" fill="url(#zPlasticDk)" stroke="#000" stroke-width="1.2" filter="url(#zShadow)"/>
      <circle id="h_lwLamp" cx="101" cy="267" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>
      <circle cx="94" cy="279" r="2.6" fill="#c0281c"/><circle cx="108" cy="279" r="2.6" fill="#c4cacf"/>
      <text class="lbl" x="101" y="302" text-anchor="middle">LWCO</text>
    </g>
    <!-- relief valve -->
    <g class="part" data-p="relief" tabindex="0">
      <rect x="256" y="152" width="8" height="28" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".7"/>
      <rect class="hl" x="248" y="128" width="24" height="26" rx="6" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1.2" filter="url(#zShadow)"/>
      <rect x="252" y="131" width="16" height="4" rx="2" fill="rgba(255,255,255,.35)"/>
      <rect id="h_reliefLever" x="254" y="118" width="12" height="10" rx="2" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".7"/>
      <text class="lbl" x="214" y="124">Relief</text>
    </g>
    <g id="h_wreck" opacity="0">
      <g fill="url(#bzIron)" stroke="#111" stroke-width="1"><polygon points="118,200 160,186 150,240 112,250"/><polygon points="230,170 288,190 276,232 240,214"/><polygon points="96,330 140,318 132,372 90,360"/><polygon points="250,330 300,316 306,368 262,380"/><polygon points="176,150 208,140 214,168 182,176"/></g>
      <g fill="var(--paper)" opacity=".85"><circle cx="200" cy="270" r="70"/><circle cx="150" cy="220" r="48"/><circle cx="255" cy="225" r="52"/><circle cx="200" cy="175" r="44"/><circle cx="140" cy="320" r="40"/><circle cx="265" cy="320" r="44"/></g>
    </g>
  `;

const STEAM_SVG=`<defs>${BZ_DEFS}</defs><line x1="10" y1="452" x2="790" y2="452" stroke="var(--line)" stroke-dasharray="2 4"/>
<g class="part" data-p="room" tabindex="0"><rect class="hl" x="450" y="140" width="335" height="232" fill="rgba(233,228,214,.25)" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="6 4"/><text class="lbl" x="636" y="160">Heated room</text><text class="val" id="s_room" x="636" y="178">66.0°F</text></g>
<text class="lbl" id="s_outTxt" x="750" y="132" text-anchor="end">Outside 25°F</text>
<path d="M308 128 H338 V444" class="pipe" stroke="#9aa3a9" stroke-width="5"/>
<rect x="326" y="446" width="24" height="6" fill="var(--line)"/>
<g id="s_svPuff" opacity="0" fill="var(--paper)" stroke="var(--line)"><circle cx="338" cy="436" r="6"/><circle cx="328" cy="428" r="4"/><circle cx="348" cy="426" r="5"/></g>
<g class="part" data-p="ret" tabindex="0">
  <path id="s_retA" d="M760 92 V436 H405 V299 H370" class="pipe" stroke="#6b8fc9"/>
  <path id="s_retB" d="M760 92 V436 H405 V392 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_retA2" d="M760 92 V364 H464 V436 H405 V299 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_retB2" d="M760 92 V364 H464 V436 H405 V392 H370" class="pipe" stroke="#6b8fc9" opacity="0"/>
  <path id="s_fRet" d="M760 92 V436 H405 V299 H370" class="flow"/>
  <text class="lbl" id="s_wetLbl" x="560" y="428">Wet return</text>
  <g id="s_leak" opacity="0"><circle cx="600" cy="446" r="3" fill="var(--cold)"/><circle cx="612" cy="448" r="2" fill="var(--cold)"/><circle cx="590" cy="448" r="2.5" fill="var(--cold)"/><text class="tag" x="600" y="462" text-anchor="middle" fill="var(--bad)">BROKEN</text></g>
</g>
<rect x="164" y="128" width="22" height="42" fill="url(#zSteel)" stroke="#5f686d"/>
<path id="s_header" d="M190 170 V80 H370 V392 H310" class="pipe" stroke="var(--line)"/>
<path d="M370 80 L760 92" class="pipe" stroke="var(--line)"/>
<path id="s_mainSteam" d="M370 80 L760 92" class="pipe" pathLength="100" stroke-dasharray="0 100" style="stroke-linecap:butt"/>
<text class="lbl" x="520" y="74">Steam main</text>
<text class="lbl" x="200" y="74">Header</text>
<g class="part" data-p="hartford" tabindex="0">
  <rect class="hl" x="352" y="270" width="64" height="134" rx="6" fill="transparent" stroke="none"/>
  <circle cx="370" cy="299" r="6" fill="url(#zSteel)" stroke="#3f474c"/>
  <text class="lbl" x="378" y="252">Equalizer /</text>
  <text class="lbl" x="378" y="266">Hartford loop</text>
  <text class="tag" x="380" y="284" fill="var(--muted)">CLOSE NIPPLE ↓</text>
</g>
<g class="part" data-p="mainvent" tabindex="0" id="s_mvG">
  <path d="M748 92 V76" class="pipe" stroke="#9aa3a9" stroke-width="5"/>
  <rect class="hl" x="738" y="52" width="20" height="26" rx="5" fill="url(#zSteel)" stroke="#4d555a" stroke-width="1.2" filter="url(#zShadow)"/>
  <ellipse cx="748" cy="52" rx="10" ry="3" fill="url(#zAluTop)" stroke="#4d555a" stroke-width=".7"/><rect x="745" y="45" width="6" height="7" fill="url(#zSteel)"/>
  <g id="s_ventPuff" opacity="0" fill="none" stroke="var(--muted)"><circle cx="748" cy="38" r="4"/><circle cx="756" cy="28" r="3"/></g>
  <text class="lbl" x="732" y="50" text-anchor="end">Main vent</text>
</g>
<g class="part" data-p="rad" tabindex="0">
  <path d="M480 83 V342 H492" class="pipe" stroke="#9aa3a9" stroke-width="7"/>
  <path d="M628 87 V342 H640" class="pipe" stroke="#9aa3a9" stroke-width="7"/>
  <rect class="hl" id="s_rad1" x="492" y="280" width="74" height="68" rx="5" fill="var(--panel)" stroke="#5a5f57" stroke-width="1.5" filter="url(#zShadow)"/>
  <rect class="hl" id="s_rad2" x="640" y="280" width="74" height="68" rx="5" fill="var(--panel)" stroke="#5a5f57" stroke-width="1.5" filter="url(#zShadow)"/>
  ${[492,640].map(x0=>Array.from({length:6},(_,i)=>`<rect x="${x0+2+i*12}" y="282" width="10" height="64" rx="5" fill="url(#bzRad)" stroke="rgba(0,0,0,.35)" stroke-width=".7"/>`).join("")+`<rect x="${x0+4}" y="348" width="6" height="8" fill="#5a5f57"/><rect x="${x0+64}" y="348" width="6" height="8" fill="#5a5f57"/>`).join("")}
  <g id="s_radVents">${bzVentCap(567,270,10,13)}${bzVentCap(715,270,10,13)}</g>
  <text class="lbl" x="492" y="272">Radiator</text>
</g>
<!-- two-pipe parts: supply valves, radiator traps, F&T trap at the end of the main, dry return and its vent -->
<g id="s_two" opacity="0">
 <text class="lbl" x="560" y="388">Dry return</text>
 <text class="tag" x="474" y="430" fill="var(--muted)">WET RETURN</text>
 ${[480,628].map(x=>`<rect x="${x-6}" y="300" width="12" height="16" rx="2" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".8"/><path d="M${x} 300 V292" stroke="#4d555a" stroke-width="2"/><ellipse cx="${x}" cy="291" rx="8" ry="2.6" fill="url(#bzRed)" stroke="#5a1410" stroke-width=".6"/>`).join("")}
</g>
<g class="part" data-p="trap" tabindex="0" id="s_trapG" opacity="0">
 ${[566,714].map((x,i)=>`<path d="M${x} 342 H${x+12} V364" class="pipe" stroke="#6b8fc9" stroke-width="5"/><rect class="hl" x="${x+4}" y="334" width="16" height="16" rx="7" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1" filter="url(#zShadow)"/><rect x="${x+8}" y="330" width="8" height="5" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".6"/><circle id="s_trap${i}" cx="${x+12}" cy="342" r="3" fill="var(--lamp-off)" stroke="#000" stroke-width=".5"/>`).join("")}
</g>
<g class="part" data-p="ft" tabindex="0" id="s_ftG" opacity="0">
 <rect class="hl" x="746" y="296" width="28" height="34" rx="5" fill="url(#zShell)" stroke="#111" stroke-width="1.1" filter="url(#zShadow)"/>
 <circle id="s_ftLamp" cx="760" cy="313" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".5"/>
 <text class="tag" x="778" y="304" fill="var(--muted)">F&amp;T</text><text class="tag" x="778" y="314" fill="var(--muted)">TRAP</text>
</g>
<g class="part" data-p="rvent" tabindex="0" id="s_rvG" opacity="0">
 <path d="M464 364 V350" class="pipe" stroke="#9aa3a9" stroke-width="4"/>
 ${bzVentCap(464,336,12,15)}
 <g id="s_rvPuff" opacity="0" fill="var(--paper)" stroke="var(--muted)"><circle cx="464" cy="326" r="4"/><circle cx="472" cy="318" r="3"/></g>
 <text class="tag" x="456" y="333" text-anchor="end" fill="var(--muted)">VENT</text>
</g>
<g class="part" data-p="tstat" tabindex="0">
  <rect class="hl" x="725" y="172" width="44" height="44" fill="transparent" stroke="none"/>
  ${bzTstatRound(747,194,"s_tstatTxt","s_tstatLamp")}
  <text class="lbl" x="747" y="232" text-anchor="middle">Thermostat</text>
</g>
<g class="part" data-p="lwco" tabindex="0">
  <path d="M94 236 H150 M94 336 H150" class="pipe" stroke="#3a3f44" stroke-width="5"/>
  <rect class="hl" x="60" y="226" width="34" height="122" rx="12" fill="url(#zShell)" stroke="#111" stroke-width="1.2" filter="url(#zShadow)"/>
  <rect x="64" y="236" width="26" height="104" rx="8" fill="#e9eef2" opacity=".9"/>
  <circle id="s_float" cx="77" cy="249" r="9" fill="url(#zAluTop)" stroke="#3f474c" stroke-width="1.2"/>
  <rect x="58" y="200" width="38" height="26" rx="3" fill="url(#zPlasticDk)" stroke="#000"/><text x="77" y="223" text-anchor="middle" font-family="var(--display)" font-size="7" fill="#c4cacf">M&amp;M 67</text>
  <rect x="74.5" y="348" width="5" height="16" fill="url(#zBrass)"/><rect x="68" y="362" width="18" height="5" rx="1" fill="#c0281c"/>
  <g id="s_blowJet" opacity="0"><circle cx="77" cy="374" r="3" fill="var(--cold)"/><circle cx="72" cy="384" r="2" fill="var(--cold)"/><circle cx="82" cy="388" r="2.5" fill="var(--cold)"/></g>
  <text class="lbl" x="56" y="300" text-anchor="end">LWCO</text>
  <circle id="s_lw1Lamp" cx="77" cy="210" r="5" fill="var(--ok)" stroke="#000" stroke-width=".6"/>
</g>
<!-- feeder: piped into the wet return, below the Hartford loop's close nipple -->
<g class="part" data-p="feeder" tabindex="0">
  ${bzHop(430,436)}
  <path d="M430 386 V428 a8 8 0 0 1 0 16 V447 H476" class="pipe" stroke="var(--cold)" stroke-width="4"/>
  <text class="tag" x="480" y="450" fill="var(--muted)">COLD WATER</text>
  <path d="M414 374 H409" class="pipe" stroke="var(--cold)" stroke-width="4"/>
  <rect class="hl" x="414" y="360" width="34" height="28" rx="4" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width="1.2" filter="url(#zShadow)"/>
  <rect x="420" y="340" width="22" height="20" rx="3" fill="url(#zPlasticDk)" stroke="#000"/>
  <circle id="s_feedLamp" cx="431" cy="350" r="4.5" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>
  <line id="s_feedX" x1="410" y1="338" x2="452" y2="392" stroke="var(--bad)" stroke-width="3" opacity="0"/>
  <text class="lbl" x="452" y="398">Feeder</text>
</g>
<g class="part" data-p="boiler" tabindex="0" id="s_boilerG">
  <rect class="hl" x="150" y="170" width="160" height="230" rx="6" fill="transparent" stroke="none"/>
  ${bzJacket(150,170,160,230,"url(#bzJacketS)")}
  <rect x="156" y="176" width="148" height="184" fill="#1b1f22"/>
  ${bzSections(158,178,144,180,6)}
  <rect id="s_glow" x="156" y="176" width="148" height="0" fill="#ff5a1f" opacity="0"/>
  <rect id="s_water" x="156" y="250" width="148" height="110" fill="var(--cold)" opacity=".5"/>
  <g id="s_bub" opacity="0" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="180" cy="330" r="3"/><circle cx="240" cy="345" r="4"/><circle cx="215" cy="310" r="3"/><circle cx="280" cy="325" r="2.5"/><circle cx="200" cy="290" r="2"/></g>
  <rect x="156" y="360" width="148" height="34" fill="#121517"/>
  <line x1="150" x2="310" y1="249.6" y2="249.6" stroke="#8fc3ff" stroke-dasharray="4 3"/>
  <text x="304" y="246" text-anchor="end" class="tag" fill="#8fc3ff">NORMAL WATER LINE</text>
  <line x1="150" x2="310" y1="277" y2="277" stroke="#ff6a5a" stroke-dasharray="3 3" opacity=".9"/>
  <text x="304" y="273" text-anchor="end" class="tag" fill="#ffb0a6">LWCO CUTOFF</text>
  <line x1="150" x2="310" y1="314" y2="314" stroke="#ffc35a" stroke-dasharray="3 3" opacity=".9"/>
  <text x="304" y="326" text-anchor="end" class="tag" fill="#ffd27a">CROWN SHEET</text>
  <text class="lbl" x="158" y="190" style="fill:#e9ecee">Boiler</text>
  <text class="valD" id="s_lvl" x="158" y="206" font-size="11" fill="#e9ecee">Water 60% full</text>
</g>
<g class="part" data-p="glass" tabindex="0">
  <rect x="126" y="201.5" width="24" height="5" fill="url(#zBrassH)"/><rect x="126" y="311.5" width="24" height="5" fill="url(#zBrassH)"/>
  ${bzNut(122,204,6)}${bzNut(122,314,6)}
  <rect class="hl" x="117" y="208" width="10" height="102" rx="3" fill="rgba(220,238,250,.9)" stroke="#5f686d" stroke-width="1.2"/>
  <rect id="s_glassW" x="118" y="250" width="8" height="64" fill="var(--cold)" opacity=".75"/>
  <rect x="119" y="210" width="2" height="98" fill="rgba(255,255,255,.7)"/>
</g>
<g class="part" data-p="lwco2" tabindex="0">
  <rect class="hl" x="310" y="285" width="18" height="12" rx="2" fill="url(#zPlasticDk)" stroke="#000" stroke-width="1"/>
  <circle id="s_lw2Lamp" cx="319" cy="291" r="3" fill="var(--ok)"/>
</g>
<g class="part" data-p="trycocks" tabindex="0">
  <rect class="hl" x="308" y="214" width="28" height="70" fill="transparent" stroke="none"/>
  <rect x="310" y="220" width="12" height="4" fill="url(#zBrassH)"/><rect x="310" y="248" width="12" height="4" fill="url(#zBrassH)"/><rect x="310" y="275" width="12" height="4" fill="url(#zBrassH)"/>
  <rect x="321" y="217" width="5" height="10" rx="1" fill="#7a5414"/><rect x="321" y="245" width="5" height="10" rx="1" fill="#7a5414"/><rect x="321" y="272" width="5" height="10" rx="1" fill="#7a5414"/>
  <circle id="s_puff" cx="334" cy="250" r="6" opacity="0" fill="var(--paper)" stroke="var(--line)"/>
</g>
<g class="part" data-p="burner" tabindex="0">
  <rect class="hl" x="170" y="374" width="120" height="14" rx="3" fill="transparent" stroke="none"/>
  ${bzBurner(170,376,120)}
  ${bzFlame("s_flame",30)}
  <path id="s_spark" d="M226 372 l6 -8 -4 0 6 -8" stroke="#f5c400" stroke-width="2" fill="none" opacity="0"/>
  <text class="lbl" x="230" y="416" text-anchor="middle">Burner</text>
</g>
<g class="part" data-p="gas" tabindex="0">
  <path d="M20 400 H120 V381 H160" class="pipe" stroke="#3a3f44" stroke-width="6"/>
  <rect class="hl" x="34" y="378" width="34" height="38" fill="transparent" stroke="none"/>
  ${bzGasValve(34,386,"s_gasLamp")}
  <text class="lbl" x="51" y="430" text-anchor="middle">Gas valve</text>
</g>
<g class="part" data-p="hl" tabindex="0">
  ${bzPig(165,170,130)}
  <rect class="hl" x="148" y="104" width="34" height="26" rx="3" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2" filter="url(#zShadow)"/>
  <rect x="151" y="107" width="28" height="10" rx="1.5" fill="#2a2f33"/>
  <text x="165" y="115" text-anchor="middle" font-family="var(--display)" font-size="7" fill="#e9ecee">HI LIMIT</text>
  <circle id="s_hlLamp" cx="159" cy="123" r="3.5" fill="var(--ok)" stroke="#000" stroke-width=".5"/><circle cx="173" cy="123" r="3" fill="#c0281c"/>
</g>
<g class="part" data-p="ptrol" tabindex="0">
  ${bzPig(225,170,130)}
  <rect class="hl" x="207" y="104" width="36" height="26" rx="3" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2" filter="url(#zShadow)"/>
  <rect x="210" y="107" width="30" height="10" rx="1.5" fill="#2a2f33"/>
  <text x="225" y="115" text-anchor="middle" font-family="var(--display)" font-size="7" fill="#e9ecee">P-TROL</text>
  <circle id="s_ptLamp" cx="225" cy="123" r="3.5" fill="var(--ok)" stroke="#000" stroke-width=".5"/>
</g>
<g class="part" data-p="gauge" tabindex="0">
  ${bzPig(262,170,126)}
  <circle class="hl" cx="262" cy="108" r="19" fill="url(#zSteel)" stroke="#3f474c" stroke-width="1.2" filter="url(#zShadow)"/>
  <circle cx="262" cy="108" r="15" fill="#fbfbf8" stroke="#8a8f86"/>
  ${Array.from({length:7},(_,i)=>{const a=(-135+i*45)*Math.PI/180;return `<line x1="${(262+12*Math.sin(a)).toFixed(1)}" y1="${(108-12*Math.cos(a)).toFixed(1)}" x2="${(262+14*Math.sin(a)).toFixed(1)}" y2="${(108-14*Math.cos(a)).toFixed(1)}" stroke="#1d2327" stroke-width=".9"/>`}).join("")}
  <line id="s_needle" x1="262" y1="108" x2="262" y2="96" stroke="#c0281c" stroke-width="2" stroke-linecap="round"/>
  <circle cx="262" cy="108" r="2" fill="#1d2327"/>
  <text class="val" id="s_gP" x="286" y="97" font-size="10">0.0 psi</text>
</g>
<g class="part" data-p="sv" tabindex="0">
  <rect x="294" y="146" width="8" height="24" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".7"/>
  <rect class="hl" x="288" y="122" width="20" height="26" rx="5" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1.2" filter="url(#zShadow)"/>
  <rect x="291" y="125" width="14" height="4" rx="2" fill="rgba(255,255,255,.35)"/>
  <rect id="s_svLever" x="293" y="116" width="10" height="6" rx="1.5" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".6"/>
  <text class="lbl" x="312" y="112">Safety</text>
</g>
<g id="s_wreck" opacity="0">
  <g fill="url(#bzIron)" stroke="#111" stroke-width="1"><polygon points="148,200 190,186 180,240 142,250"/><polygon points="260,170 318,190 306,232 270,214"/><polygon points="126,330 170,318 162,372 120,360"/><polygon points="280,330 330,316 336,368 292,380"/><polygon points="206,150 238,140 244,168 212,176"/></g>
  <g fill="var(--paper)" opacity=".85"><circle cx="230" cy="270" r="70"/><circle cx="180" cy="220" r="48"/><circle cx="285" cy="225" r="52"/><circle cx="230" cy="175" r="44"/><circle cx="170" cy="320" r="40"/><circle cx="295" cy="320" r="44"/></g>
</g>
`;
