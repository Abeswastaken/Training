/* ---- gauge manifold: drag it anywhere, the hoses follow ---- */
const MANP=(()=>{try{return JSON.parse(localStorage.getItem("rt-man")||"{}")}catch(e){return {}}})();
const hoseLine=(id,d,c1,c2)=>`<path id="${id}1" data-d0="${d}" d="${d}" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round"/><path id="${id}2" data-d0="${d}" d="${d}" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>`;
function hoseSvg(p,lo,hi,dLo,dHi){return `<g id="${p}hoses" data-lo="${lo}" data-hi="${hi}">
 ${hoseLine(p+"hY","M540 140 C540 160 548 170 556 176","#9a8a1a","#e8c33a")}
 ${hoseLine(p+"hH",dHi,"#7a1a10","#d23a26")}
 ${hoseLine(p+"hL",dLo,"#1d3f8a","#3d7de0")}
 ${zHex(lo[0],lo[1],4.5)}${zHex(hi[0],hi[1],4.5)}</g>`}
function hoseRoute(s,e){const L=Math.max(40,Math.abs(e[1]-s[1])*.55);return `M${s[0]} ${s[1]} C${s[0]} ${s[1]+L} ${e[0]} ${e[1]-L} ${e[0]} ${e[1]}`}
function placeMan(p,dx,dy){const m=document.getElementById(p+"man"),h=document.getElementById(p+"hoses");if(!m||!h)return;
 MANP[p]=[dx,dy];m.setAttribute("transform",`translate(${dx} ${dy})`);
 const set=(k,d)=>[1,2].forEach(i=>{const e=document.getElementById(p+k+i);if(e)e.setAttribute("d",d===null?e.dataset.d0:d)});
 if(!dx&&!dy){set("hL",null);set("hH",null);set("hY",null);return}
 const lo=h.dataset.lo.split(",").map(Number),hi=h.dataset.hi.split(",").map(Number);
 set("hL",hoseRoute([500+dx,140+dy],lo));set("hH",hoseRoute([580+dx,140+dy],hi));set("hY",`M${540+dx} ${140+dy} c0 20 8 30 16 36`)}
let manDrag=null,manMoved=false;
const svgPt=(svg,e)=>{const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())};
document.addEventListener("pointerdown",e=>{const m=e.target.closest&&e.target.closest(".man");if(!m)return;const svg=m.ownerSVGElement,p=m.id.slice(0,-3),pt=svgPt(svg,e),[dx,dy]=MANP[p]||[0,0];
 manDrag={p,svg,x0:pt.x-dx,y0:pt.y-dy,sx:e.clientX,sy:e.clientY};manMoved=false;try{m.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
document.addEventListener("pointermove",e=>{if(!manDrag)return;if(!manMoved&&Math.hypot(e.clientX-manDrag.sx,e.clientY-manDrag.sy)<5)return;manMoved=true;
 const pt=svgPt(manDrag.svg,e);placeMan(manDrag.p,Math.round(Math.max(-440,Math.min(160,pt.x-manDrag.x0))),Math.round(Math.max(0,Math.min(318,pt.y-manDrag.y0))))});
const manEnd=()=>{if(!manDrag)return;manDrag=null;try{localStorage.setItem("rt-man",JSON.stringify(MANP))}catch(e){}};
document.addEventListener("pointerup",manEnd);document.addEventListener("pointercancel",manEnd);
document.addEventListener("click",e=>{if(manMoved){manMoved=false;e.stopPropagation();e.preventDefault()}},true);
document.addEventListener("dblclick",e=>{const m=e.target.closest&&e.target.closest(".man");if(m){const p=m.id.slice(0,-3);placeMan(p,0,0);try{localStorage.setItem("rt-man",JSON.stringify(MANP))}catch(_){}}});
