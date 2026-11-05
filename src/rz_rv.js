// Reversing valve cutaway for the Parts card, with a Cooling/Heating toggle
let rvCardMode="cool";
ZILL.rv=()=>{const c=rvCardMode==="cool",sx=c?96:146;
 const gas=c?"M170 40 V110 H220 V214":"M170 40 V110 H120 V214",cup=c?"M120 214 V146 Q145 112 170 146 V214":"M220 214 V146 Q195 112 170 146 V214";
 return `${zShade(170,236,120)}
 ${zCuStubV(170,30,102,16)}${zCuStubV(120,148,222,16)}${zCuStubV(170,148,222,16)}${zCuStubV(220,148,222,16)}
 <g filter="url(#zShadow)"><rect x="66" y="98" width="208" height="54" rx="27" fill="url(#zBrassH)" stroke="#5e400e"/></g>
 <rect x="82" y="106" width="176" height="38" rx="14" fill="url(#zInside)"/>
 <path d="M${sx} 144 V122 Q${sx+49} 106 ${sx+98} 122 V144 Z" fill="url(#zSteelH)" stroke="#3b4247"/>
 <path d="${gas}" stroke="#ff4a3a" class="zFlow"/><path d="${cup}" stroke="#6fb3e8" class="zFlow"/>
 <rect x="236" y="34" width="70" height="34" rx="4" fill="url(#zPlasticDk)" stroke="#000"/><text x="271" y="55" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="10" font-weight="700" fill="#e9ecee">PILOT COIL</text>
 <path d="M246 68 C240 90 90 80 80 102 M262 68 C262 86 170 84 170 100 M290 68 C300 92 262 84 262 102" stroke="#9aa3aa" stroke-width="1.6" fill="none"/>
 ${zL(170,60,120,30,6,26,"D: hot gas from compressor")}
 ${zL(120,200,60,226,4,240,c?"E: suction from indoor coil":"E: hot gas to indoor coil")}
 ${zL(170,214,170,234,130,248,"S: to compressor")}
 ${zL(220,200,264,226,214,240,c?"C: hot gas to outdoor coil":"C: suction from outdoor coil","start")}
 <text x="6" y="88" font-family="IBM Plex Sans,sans-serif" font-size="12" font-weight="700" fill="${c?"#2f6fd6":"#c0281c"}">${c?"COOLING":"HEATING"}</text>
 <text x="6" y="74" font-family="IBM Plex Sans,sans-serif" font-size="9.5" fill="#3a4246">${c?"Coil energized (O) on most brands":"Coil off (O system)"}</text>`};
const rvToggle=()=>{if(typeof cur!=="undefined"&&cur&&cur.id==="hp"&&(cur.S.mode==="heat"||cur.S.mode==="cool"))rvCardMode=cur.S.mode;
 return `<div class="rvBar"><div class="btns" role="group" aria-label="Reversing valve mode"><button class="btn" data-rvmode="cool" aria-pressed="${rvCardMode==="cool"}">Cooling</button><button class="btn" data-rvmode="heat" aria-pressed="${rvCardMode==="heat"}">Heating</button><button class="btn rvMore" data-rvexpand="1">Show card</button></div></div><p class="illNote">These buttons also switch the heat pump on the main drawing, so you can watch the whole system reverse. The slide moves toward one end when the pilot valve vents that end to suction. The cup always joins S to whichever coil is the evaporator.</p>`};
document.addEventListener("click",e=>{const ex=e.target.closest&&e.target.closest("[data-rvexpand]");if(ex){document.getElementById("sheet").classList.remove("mini");return}
 const b=e.target.closest&&e.target.closest("[data-rvmode]");if(!b)return;rvCardMode=b.dataset.rvmode;
 const sh=document.getElementById("sheetB");if(!sh)return;const sv=sh.querySelector("svg.ill");if(sv)sv.innerHTML=ZILL.rv();
 sh.querySelectorAll("[data-rvmode]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.rvmode===rvCardMode));
 // drive the main heat pump too: set the thermostat mode and make sure it is calling
 if(typeof cur!=="undefined"&&cur&&cur.id==="hp"){const S=cur.S,V=cur.V,m=rvCardMode;
  if(S.mode!==m){S.mode=m;log(cur,`Thermostat set to ${m==="heat"?"heat":"cool"} from the reversing valve card.`)}
  if(m==="heat"&&S.Troom>V.set-1){S.Troom=V.set-1.5;S.calling=true}
  if(m==="cool"&&S.Troom<V.set+1){S.Troom=V.set+1.5;S.calling=true}
  if(typeof renderControls==="function")try{renderControls()}catch(_){}
  if(innerWidth<700)document.getElementById("sheet").classList.add("mini")}});
