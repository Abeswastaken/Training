/* ============ REALISTIC PARTS LIBRARY (shared by every trainer) ============ */
// Gradients, filters and patterns live in one hidden <svg> so every drawing and part card can use them.
const RZ_DEFS=`<defs>
<linearGradient id="zShell" x1="0" x2="1"><stop offset="0" stop-color="#1b1f22"/><stop offset=".22" stop-color="#4d555b"/><stop offset=".36" stop-color="#6b747a"/><stop offset=".6" stop-color="#363c41"/><stop offset="1" stop-color="#15181a"/></linearGradient>
<radialGradient id="zDome" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#7a838a"/><stop offset=".5" stop-color="#3c4348"/><stop offset="1" stop-color="#181b1e"/></radialGradient>
<linearGradient id="zCuH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6e3519"/><stop offset=".3" stop-color="#e9a774"/><stop offset=".55" stop-color="#b8693a"/><stop offset="1" stop-color="#5a2a12"/></linearGradient>
<linearGradient id="zCuV" x1="0" x2="1"><stop offset="0" stop-color="#6e3519"/><stop offset=".3" stop-color="#e9a774"/><stop offset=".55" stop-color="#b8693a"/><stop offset="1" stop-color="#5a2a12"/></linearGradient>
<linearGradient id="zBrass" x1="0" x2="1"><stop offset="0" stop-color="#6a4a12"/><stop offset=".3" stop-color="#e8cd78"/><stop offset=".55" stop-color="#b8902e"/><stop offset="1" stop-color="#5e400e"/></linearGradient>
<linearGradient id="zBrassH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e8cd78"/><stop offset=".45" stop-color="#c9a240"/><stop offset="1" stop-color="#6a4a12"/></linearGradient>
<linearGradient id="zSteel" x1="0" x2="1"><stop offset="0" stop-color="#8b949a"/><stop offset=".3" stop-color="#f1f4f6"/><stop offset=".6" stop-color="#b9c1c6"/><stop offset="1" stop-color="#7d868c"/></linearGradient>
<linearGradient id="zSteelH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e9edf0"/><stop offset=".5" stop-color="#b3bbc0"/><stop offset="1" stop-color="#6f787e"/></linearGradient>
<linearGradient id="zAlu" x1="0" x2="1"><stop offset="0" stop-color="#8f979d"/><stop offset=".25" stop-color="#e3e8eb"/><stop offset=".45" stop-color="#f7f9fa"/><stop offset=".7" stop-color="#b6bec3"/><stop offset="1" stop-color="#7e868b"/></linearGradient>
<radialGradient id="zAluTop" cx=".42" cy=".4" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#cfd5d9"/><stop offset="1" stop-color="#99a1a6"/></radialGradient>
<linearGradient id="zPlastic" x1="0" x2="1"><stop offset="0" stop-color="#bdb6a6"/><stop offset=".2" stop-color="#ece7dc"/><stop offset=".5" stop-color="#f6f3ec"/><stop offset=".85" stop-color="#d6cfc0"/><stop offset="1" stop-color="#a9a291"/></linearGradient>
<linearGradient id="zPlasticDk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4a4f54"/><stop offset="1" stop-color="#22262a"/></linearGradient>
<linearGradient id="zBlue" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fa3c4"/><stop offset=".25" stop-color="#4f7699"/><stop offset=".7" stop-color="#2e4b66"/><stop offset="1" stop-color="#1a2d3f"/></linearGradient>
<linearGradient id="zGreen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3f7a4a"/><stop offset="1" stop-color="#1f4a2a"/></linearGradient>
<linearGradient id="zCab" x1="0" x2="1"><stop offset="0" stop-color="#c3cacf"/><stop offset=".5" stop-color="#e2e6e9"/><stop offset="1" stop-color="#b4bcc1"/></linearGradient>
<linearGradient id="zCabIn" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9dee1"/><stop offset="1" stop-color="#c2c9ce"/></linearGradient>
<linearGradient id="zTan" x1="0" x2="1"><stop offset="0" stop-color="#b9a578"/><stop offset=".5" stop-color="#e3d3a6"/><stop offset="1" stop-color="#a8956a"/></linearGradient>
<linearGradient id="zLcd" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#cfe0d2"/><stop offset="1" stop-color="#a9c2ad"/></linearGradient>
<linearGradient id="zWireBk" x1="0" x2="1"><stop offset="0" stop-color="#050505"/><stop offset=".35" stop-color="#55595c"/><stop offset="1" stop-color="#0b0b0b"/></linearGradient>
<linearGradient id="zWireRd" x1="0" x2="1"><stop offset="0" stop-color="#5a0b07"/><stop offset=".35" stop-color="#e2554a"/><stop offset="1" stop-color="#6a100a"/></linearGradient>
<linearGradient id="zWireYl" x1="0" x2="1"><stop offset="0" stop-color="#7a5a00"/><stop offset=".35" stop-color="#ffe26a"/><stop offset="1" stop-color="#8a6800"/></linearGradient>
<linearGradient id="zWireBl" x1="0" x2="1"><stop offset="0" stop-color="#0b2a6a"/><stop offset=".35" stop-color="#6c9ef0"/><stop offset="1" stop-color="#0e2f78"/></linearGradient>
<radialGradient id="zScrew" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b9c1c6"/><stop offset="1" stop-color="#5f686d"/></radialGradient>
<radialGradient id="zInside" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#3a3f43"/><stop offset="1" stop-color="#121416"/></radialGradient>
<linearGradient id="zWinding" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e3a05e"/><stop offset=".5" stop-color="#b8692f"/><stop offset="1" stop-color="#6e3a14"/></linearGradient>
<linearGradient id="zLam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9aa3a9"/><stop offset=".5" stop-color="#5c656b"/><stop offset="1" stop-color="#2e3438"/></linearGradient>
<linearGradient id="zMotor" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5d86ad"/><stop offset=".35" stop-color="#3b6287"/><stop offset="1" stop-color="#1c3149"/></linearGradient>
<radialGradient id="zFlame" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#9fd0ff"/><stop offset=".35" stop-color="#3d7de0"/><stop offset=".8" stop-color="#f0a040" stop-opacity=".7"/><stop offset="1" stop-color="#f0a040" stop-opacity="0"/></radialGradient>
<filter id="zShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".3"/></filter>
<filter id="zSoft"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="zGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<pattern id="zFins" width="3" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="#a9b2b8"/><rect width="1.1" height="10" fill="#eef2f4"/></pattern>
<pattern id="zFinsH" width="10" height="3" patternUnits="userSpaceOnUse"><rect width="10" height="3" fill="#a9b2b8"/><rect width="10" height="1.1" fill="#eef2f4"/></pattern>
<pattern id="zGrille" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="none"/><path d="M0 3 H6 M3 0 V6" stroke="#2a2f33" stroke-width="1"/></pattern>
<pattern id="zLouver" width="10" height="7" patternUnits="userSpaceOnUse"><rect width="10" height="7" fill="#c3cacf"/><rect y="4" width="10" height="2" fill="#6f787e"/></pattern>
<pattern id="zPleat" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f4f1ea"/><path d="M0 0 L6 6" stroke="#cdc6b6" stroke-width="1.4"/></pattern>
<pattern id="zWind" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="6" height="4" fill="url(#zWinding)"/><path d="M0 2 H6" stroke="#5a2e10" stroke-width=".6" opacity=".6"/></pattern>
<pattern id="zBrick" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#c4b9a6"/><path d="M0 0 H24 M0 6 H24 M6 0 V6 M18 6 V12" stroke="#9c8f78" stroke-width=".8"/></pattern>
</defs>`;
function rzEnsureDefs(){if(document.getElementById("rzDefs"))return;const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.id="rzDefs";s.setAttribute("aria-hidden","true");s.setAttribute("width","0");s.setAttribute("height","0");s.style.cssText="position:absolute;width:0;height:0;overflow:hidden";s.innerHTML=RZ_DEFS;document.body.prepend(s)}
// Copper tube look: dark copper edge behind each refrigerant line and a highlight along it. The line color still shows the refrigerant state.
function rzTubes(root){rzEnsureDefs();const NS="http://www.w3.org/2000/svg";
  root.querySelectorAll("path.rpipe:not([data-z]),path.ins:not([data-z]),path.wpipe:not([data-z])").forEach(p=>{p.setAttribute("data-z","1");const w=+(p.getAttribute("stroke-width")||6),d=p.getAttribute("d");
    const ins=p.classList.contains("ins");
    const back=document.createElementNS(NS,"path");back.setAttribute("d",d);back.setAttribute("class","zTubeO");back.setAttribute("stroke-width",w+(ins?2:3));back.setAttribute("stroke",ins?"#0d0f10":"#5a2a12");
    p.parentNode.insertBefore(back,p);
    const hi=document.createElementNS(NS,"path");hi.setAttribute("d",d);hi.setAttribute("class","zTubeH");hi.setAttribute("stroke-width",Math.max(1,w*(ins?.22:.28)).toFixed(1));
    hi.setAttribute("transform",`translate(${(-w*.2).toFixed(1)} ${(-w*.2).toFixed(1)})`);if(ins)hi.setAttribute("stroke","rgba(255,255,255,.13)");
    p.parentNode.insertBefore(hi,p.nextSibling)})}
const RZ_CSS=`.zTubeO,.zTubeH{fill:none;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.zTubeH{stroke:rgba(255,255,255,.42)}
.ins{stroke:#25292c}.zl{font-family:var(--display);font-size:11px;font-weight:600;letter-spacing:.05em;fill:#3b4449;text-transform:uppercase}
.zt{font-family:var(--display);font-size:10px;font-weight:600;letter-spacing:.05em;fill:#3b4449}
.zw{fill:#eef1f3}.valD{font-family:var(--mono);font-size:11px}.zlead{stroke:#4a5257;stroke-width:1;fill:none}
@keyframes zorb{0%{transform:translate(3px,0)}25%{transform:translate(0,2px)}50%{transform:translate(-3px,0)}75%{transform:translate(0,-2px)}100%{transform:translate(3px,0)}}
@keyframes zspin{to{transform:rotate(360deg)}}@keyframes zdash{to{stroke-dashoffset:-32}}@keyframes zslide{to{transform:translateX(8px)}}@keyframes zbub{to{transform:translateY(12px)}}@keyframes zbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.zOrb{animation:zorb .9s linear infinite}.zSpin{animation:zspin 1.2s linear infinite;transform-box:fill-box;transform-origin:center}.zFlow{fill:none;stroke-width:3;stroke-dasharray:7 9;stroke-linecap:round;animation:zdash 1s linear infinite}.zBob{animation:zbob 1.6s ease-in-out infinite}.zSlide{animation:zslide .35s linear infinite}.zBub{animation:zbub .9s linear infinite}
@media (prefers-reduced-motion:reduce){.zOrb,.zSpin,.zFlow,.zBob,.zSlide,.zBub{animation:none}}
.ill{background:#eef1f3;border-radius:6px}#reads b small{display:block;font-size:12px;opacity:.75;font-weight:500;font-family:var(--mono)}`;
(function(){try{const st=document.createElement("style");st.textContent=RZ_CSS;document.head.appendChild(st)}catch(e){}})();

// ---- small builders (main drawing scale) ----
const zScrew=(x,y,r=3)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#zScrew)" stroke="#4d555a" stroke-width=".6"/><path d="M${x-r*.6} ${y-r*.2} L${x+r*.6} ${y+r*.2}" stroke="#3a3f43" stroke-width="${(r*.25).toFixed(2)}"/>`;
const zShade=(cx,cy,rx,ry=4)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".22" filter="url(#zSoft)"/>`;
const zHex=(x,y,r,fill="url(#zBrass)")=>`<polygon points="${[0,1,2,3,4,5].map(i=>`${(x+r*Math.cos(i*Math.PI/3)).toFixed(1)},${(y+r*Math.sin(i*Math.PI/3)).toFixed(1)}`).join(" ")}" fill="${fill}" stroke="#5e400e" stroke-width=".8"/>`;
const zCuStubV=(x,y1,y2,w=6)=>`<rect x="${x-w/2}" y="${y1}" width="${w}" height="${y2-y1}" fill="url(#zCuV)" stroke="#5a2a12" stroke-width=".6"/>`;
const zCuStubH=(x1,x2,y,w=6)=>`<rect x="${x1}" y="${y-w/2}" width="${x2-x1}" height="${w}" fill="url(#zCuH)" stroke="#5a2a12" stroke-width=".6"/>`;
// leader-line label
const zLead=(x1,y1,x2,y2,tx,ty,t,anchor="start",cls="zt")=>`<path class="zlead" d="M${x1} ${y1} L${x2} ${y2}"/><circle cx="${x1}" cy="${y1}" r="1.8" fill="#4a5257"/><text class="${cls}" x="${tx}" y="${ty}" text-anchor="${anchor}">${t}</text>`;
// hermetic compressor shell; ids optional
function zCompressor(x,y,w,h,o={}){const cx=x+w/2,r=w/2,ry=Math.max(3,w*.12);
  return `${rSh(cx,y+h+3,w*.66,5)}
  <path d="M${x-4} ${y+h-6} L${x-8} ${y+h+1} H${x+w+8} L${x+w+4} ${y+h-6} Z" fill="url(#r_blackV)"/>${[x-6,x+w-6].map(fx=>`<rect x="${fx}" y="${y+h-1}" width="12" height="4" rx="1.5" fill="#1a1d20"/>`).join("")}
  <path class="hl" d="M${x} ${y+r*.8} Q${x} ${y} ${cx} ${y} Q${x+w} ${y} ${x+w} ${y+r*.8} V${y+h-8} A${r} ${ry} 0 0 1 ${x} ${y+h-8} Z" fill="url(#r_blackV)" filter="url(#rGrain)"/>
  <path d="M${x+w*.18} ${y+r*.8} Q${x+w*.2} ${y+w*.12} ${cx} ${y+w*.08}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>
  <path d="M${x} ${y+h*.42} A${r} ${ry} 0 0 0 ${x+w} ${y+h*.42}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="2.4"/><path d="M${x} ${y+h*.42+2} A${r} ${ry} 0 0 0 ${x+w} ${y+h*.42+2}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>
  ${o.term?`${rBox(x+w-4,y+h*.5,10,16,5,"black",{r:2})}`:""}`}

// pressure switch on a tube (lamp shows state)
const zPswitch=(x,y,lampId,w=24,h=20)=>`${rHexV(x+w/2,y+h-1,5,4,"brass")}${rCylV(x+w/2,y+h+3,y+h+7,2.6,"brass",{top:false})}<g class="hl">${rBox(x,y,w,h,6,"black",{r:h/3})}</g><path d="M${x+3} ${y+3} q-6 -6 -10 -2" stroke="#e8e8e8" stroke-width="1.6" fill="none"/><circle id="${lampId}" cx="${x+w/2}" cy="${y+h/2}" r="4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>`;

// definite-purpose contactor; bar is the moving armature contact, seen through the window
const zContactor=(x,y,w,h,barId,lampId,barY)=>`${rSh(x+w/2,y+h+2,w*.6,3)}<g class="hl">${rBox(x,y,w,h,8,"black",{r:3})}</g>
  <rect x="${x+3}" y="${y+3}" width="${w-6}" height="${h*.36}" rx="2" fill="#0d0f10"/><rect x="${x+3}" y="${y+3}" width="${w-6}" height="${h*.36}" rx="2" fill="url(#rGlass)" opacity=".4"/>
  <rect id="${barId}" x="${x+4}" y="${barY}" width="${w-8}" height="6" rx="1" fill="url(#r_chromeH)"/>
  ${rTermS(x+6,y+h*.55)}${rTermS(x+w-6,y+h*.55)}
  <rect x="${x+w/2-7}" y="${y+h*.66}" width="14" height="${h*.26}" rx="2" fill="url(#r_brassV)"/>
  <circle id="${lampId}" cx="${x+w/2}" cy="${y+h*.79}" r="3.4" fill="var(--lamp-off)" stroke="#000" stroke-width=".6"/>`;

// dual run capacitor (bulgeId shows a swollen top)
const zCap=(x,y,w,h,bulgeId)=>`${rSh(x+w/2,y+h+2,w*.7,3)}<g class="hl">${rCylV(x+w/2,y+4,y+h-2,w/2,"al",{ry:Math.max(2,w*.14)})}</g>
  ${[0.25,0.5,0.75].map(f=>`<rect x="${x+w*f-2}" y="${y-2}" width="4" height="6" fill="url(#r_chromeV)"/>`).join("")}
  <rect x="${x+2}" y="${y+h*.45}" width="${w-4}" height="${h*.28}" fill="#f4f1ea"/><text x="${x+w/2}" y="${y+h*.63}" font-size="5.5" text-anchor="middle" font-family="sans-serif" fill="#333">45/5</text>
  <path id="${bulgeId}" d="M${x} ${y+6} Q${x+w/2} ${y-12} ${x+w} ${y+6}" fill="url(#r_alT)" stroke="var(--bad)" stroke-width="1.4" opacity="0"/>`;

// pull-out disconnect box; handle id changes color when pulled
const zDisc=(x,y,w,h,hId)=>`${rSh(x+w/2,y+h+8,w*.7,3)}<g class="hl">${rBox(x,y,w,h,6,"paint",{r:2,grain:true})}</g>
  <rect id="${hId}" x="${x+6}" y="${y+9}" width="${w-12}" height="${h-17}" rx="2" fill="var(--plate)" stroke="#000" stroke-width=".6"/><rect x="${x+w/2-4}" y="${y+h*.45}" width="8" height="4" rx="1" fill="url(#r_redV)"/>
  ${rCylV(x+w/2,y+h,y+h+7,3,"galv",{top:false})}`;

// liquid line filter drier
const zDrier=(x,y,w,h,frostId,dir=1)=>`${zCuStubH(x-6,x+2,y+h/2,5)}${zCuStubH(x+w-2,x+w+6,y+h/2,5)}<rect class="hl" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="url(#r_blueH)"/>
  ${dir===0?`<path d="M${x+w/2-7} ${y+h/2} h14 m-3 -3 l3 3 -3 3 M${x+w/2-4} ${y+h/2-3} l-3 3 3 3" stroke="#fff" stroke-width="1.1" fill="none"/>`:dir<0?`<path d="M${x+w*.4} ${y+h/2} l-6 0 m3 -3 l-3 3 3 3" stroke="#fff" stroke-width="1.1" fill="none"/>`:`<path d="M${x+w*.6} ${y+h/2} l6 0 m-3 -3 l3 3 -3 3" stroke="#fff" stroke-width="1.1" fill="none"/>`}
  <rect id="${frostId}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="var(--ice)" opacity="0"/>`;

// wall thermostat with an LCD
const zTstat=(x,y,w,h,txtId,lampId,init="74")=>`${rSh(x+w/2,y+h+3,w*.6,3)}<g class="hl">${rBox(x,y,w,h,5,"white",{r:8})}</g>
  <rect x="${x+5}" y="${y+6}" width="${w-10}" height="${h*.5}" rx="3" fill="#15181a"/><rect x="${x+6}" y="${y+7}" width="${w-12}" height="${h*.48-2}" rx="2" fill="url(#zLcd)"/>
  <text id="${txtId}" x="${x+w/2}" y="${y+7+h*.4}" text-anchor="middle" font-family="var(--mono)" font-size="15" fill="#1f2a22">${init}</text>
  <circle id="${lampId}" cx="${x+w/2}" cy="${y+h-9}" r="3" fill="var(--lamp-off)" stroke="#777" stroke-width=".6"/>`;

// pleated filter seen edge-on
const zFilter=(x,y,w,h,dirtId)=>`<rect class="hl" x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="url(#zTan)" stroke="#7d6b45"/><rect x="${x+3}" y="${y+3}" width="${w-6}" height="${h-6}" fill="url(#zPleat)"/>
  <path d="M${x+3} ${y+4} ${Array.from({length:Math.floor((h-8)/5)},(_,i)=>`L${i%2?x+3:x+w-3} ${y+6+i*5}`).join(" ")}" fill="none" stroke="#b9b09c" stroke-width="1"/>
  <rect id="${dirtId}" x="${x}" y="${y}" width="${w}" height="${h}" fill="#6b5a3a" opacity="0"/>`;
// blower: scroll housing with squirrel-cage wheel (bladesId rotates around cx,cy)
const zBlower=(cx,cy,r,bladesId)=>`${zShade(cx,cy+r+6,r*1.05,4)}
  <path class="hl" d="M${cx+r*1.18} ${cy-r*1.32} V${cy} A${r*1.18} ${r*1.18} 0 1 1 ${cx} ${cy-r*1.18} Z" fill="url(#zSteelH)" stroke="#4d555a" stroke-width="1.2"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#zInside)"/>
  <g id="${bladesId}">${Array.from({length:24},(_,i)=>{const a=i*15*Math.PI/180,x1=cx+r*.62*Math.cos(a),y1=cy+r*.62*Math.sin(a),x2=cx+r*.95*Math.cos(a+.25),y2=cy+r*.95*Math.sin(a+.25);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#b9c1c6" stroke-width="2"/>`}).join("")}
   <circle cx="${cx}" cy="${cy}" r="${r*.6}" fill="none" stroke="#7d868c" stroke-width="1.5"/><line x1="${cx-r*.55}" y1="${cy}" x2="${cx+r*.55}" y2="${cy}" stroke="#7d868c" stroke-width="2"/></g>
  <circle cx="${cx}" cy="${cy}" r="${r*.34}" fill="url(#zMotor)" stroke="#111"/><circle cx="${cx}" cy="${cy}" r="${r*.1}" fill="url(#zScrew)"/>`;
// condenser fan seen from the side: wire guard on top, blade (ellipse id animates rx)
const zFanTop=(x,y,w,h,fbId,cx,cy,gId)=>`<rect class="hl" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#zPlasticDk)" stroke="#111"/>
  <rect x="${x+3}" y="${y+2}" width="${w-6}" height="${h-4}" fill="url(#zGrille)" opacity=".9"/>
  <g id="${gId||fbId+"g"}"><ellipse id="${fbId}" cx="${cx}" cy="${cy}" rx="40" ry="4" fill="#3a4045" stroke="#111" stroke-width=".6"/></g>
  <rect x="${cx-7}" y="${y+h-1}" width="14" height="14" rx="2" fill="url(#zMotor)" stroke="#111"/>`;
// manifold gauge face
function zGauge(cx,cy,r,col,needleId,maxLbl){let t="";for(let i=0;i<=20;i++){const a=(-135+i*13.5)*Math.PI/180,l=i%5?4:8;t+=`<line x1="${(cx+(r-3)*Math.sin(a)).toFixed(1)}" y1="${(cy-(r-3)*Math.cos(a)).toFixed(1)}" x2="${(cx+(r-3-l)*Math.sin(a)).toFixed(1)}" y2="${(cy-(r-3-l)*Math.cos(a)).toFixed(1)}" stroke="#222" stroke-width="${i%5?.7:1.2}"/>`}
  return `${zShade(cx,cy+r+6,r*.8,3)}<circle cx="${cx}" cy="${cy}" r="${r+5}" fill="${col}" stroke="#111"/><circle cx="${cx}" cy="${cy}" r="${r+2}" fill="url(#zSteel)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfbf8" stroke="#888" stroke-width=".8"/>${t}`}

// ---- part-card drawings, 340x250 ----
const ZILL={};
const zillSvg=k=>ZILL[k]?`<svg class="ill" viewBox="0 0 340 250" aria-hidden="true">${typeof ZILL[k]==="function"?ZILL[k]():ZILL[k]}</svg>`:"";
