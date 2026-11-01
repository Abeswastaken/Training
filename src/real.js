
/* ============ REALISTIC 3/4-VIEW DRAWING KIT (light from upper left) ============
   Materials are gradients named r_<mat>V (across a vertical cylinder), r_<mat>H (across a horizontal one),
   r_<mat>F/T/S (box front, top, side). rGrain adds cast or painted texture. */
const R_MAT={
 al:["#5f676d","#aeb6bb","#eef1f3","#c4cbcf","#8d969c","#a7afb4","#535a60"],
 iron:["#0b0d0f","#2c3237","#6d767c","#353b40","#1c2024","#2a3035","#090a0b"],
 galv:["#59605f","#a2a9a7","#e3e7e5","#b3bab8","#7f8785","#959c9a","#4b5150"],
 brass:["#4c3407","#a77a22","#f6dd8e","#c99a3a","#86601a","#a2772a","#3e2a06"],
 cu:["#4e200c","#a5532a","#f2b88c","#c97a48","#8a3f1c","#a35a33","#3f1a0a"],
 white:["#9ea4a6","#dfe3e3","#ffffff","#eef0ef","#cdd2d2","#dde1e0","#8f9597"],
 blue:["#16314f","#2b5c8f","#6e9fd0","#3a6ea4","#22496f","#2f5d8a","#112640"],
 paint:["#3a444c","#6c7882","#b4bec5","#7f8b94","#56616a","#68747d","#2f383f"],
 black:["#050607","#1d2124","#5c6368","#272b2f","#121518","#1d2124","#030404"],
 red:["#4a0b06","#9a1d12","#f0675a","#c0281c","#7e160d","#9a1d12","#3a0804"],
 chrome:["#4f5559","#c9ced1","#ffffff","#8e959a","#e3e7e9","#7c8388","#3c4145"],
 cab:["#7a8084","#bfc5c8","#f1f3f3","#d6dadb","#a7aeb1","#bcc2c4","#686e72"],
 yel:["#6a4a00","#c99a1a","#ffe08a","#f2b632","#b98510","#d29e22","#5a3e00"],
 tan:["#5a3f1f","#9c7444","#e4c690","#b98f5a","#86613a","#9c7444","#4a3218"]
};
const R_OFF=[0,.14,.32,.5,.72,.88,1];
const rLight=(c,k)=>{const n=parseInt(c.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(k>0?v+(255-v)*k:v*(1+k))));return "#"+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,"0")).join("")};
const R_DEFS=(()=>{let d="";for(const [m,c] of Object.entries(R_MAT)){
 const st=c.map((x,i)=>`<stop offset="${R_OFF[i]}" stop-color="${x}"/>`).join("");
 d+=`<linearGradient id="r_${m}V" x1="0" x2="1">${st}</linearGradient><linearGradient id="r_${m}H" x1="0" x2="0" y1="0" y2="1">${st}</linearGradient>`;
 d+=`<linearGradient id="r_${m}F" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${rLight(c[3],.18)}"/><stop offset=".55" stop-color="${c[3]}"/><stop offset="1" stop-color="${rLight(c[3],-.22)}"/></linearGradient>`;
 d+=`<linearGradient id="r_${m}T" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${rLight(c[2],-.02)}"/><stop offset="1" stop-color="${rLight(c[3],.12)}"/></linearGradient>`;
 d+=`<linearGradient id="r_${m}S" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${rLight(c[3],-.3)}"/><stop offset="1" stop-color="${rLight(c[3],-.5)}"/></linearGradient>`;}
 return d+`<filter id="rGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.55 .33" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in" result="g"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge></filter>
<filter id="rBrush" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".015 .9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -.9 .5" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in" result="g"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge></filter>
<radialGradient id="rAO"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".6" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="rCav" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#3b4146"/><stop offset="1" stop-color="#0c0e10"/></radialGradient>
<linearGradient id="rGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset=".5" stop-color="#fff" stop-opacity=".22"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="rWater" x1="0" x2="1"><stop offset="0" stop-color="#1d4f86"/><stop offset=".35" stop-color="#5e9bd6"/><stop offset="1" stop-color="#173f6b"/></linearGradient>
<linearGradient id="rHot" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9482f" stop-opacity=".55"/><stop offset=".55" stop-color="#8d5fa0" stop-opacity=".25"/><stop offset="1" stop-color="#2f74c8" stop-opacity=".45"/></linearGradient>
<linearGradient id="rFoam" x1="0" x2="1"><stop offset="0" stop-color="#d9b44a"/><stop offset="1" stop-color="#f2d77c"/></linearGradient>
<radialGradient id="rFlame" cx=".5" cy=".9" r=".9"><stop offset="0" stop-color="#e6f3ff"/><stop offset=".3" stop-color="#5aa0ff"/><stop offset=".75" stop-color="#2a5fd0" stop-opacity=".7"/><stop offset="1" stop-color="#2a5fd0" stop-opacity="0"/></radialGradient>`})();
function rEnsure(){if(document.getElementById("rDefs"))return;const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.id="rDefs";s.setAttribute("aria-hidden","true");s.setAttribute("width","0");s.setAttribute("height","0");s.style.cssText="position:absolute;width:0;height:0;overflow:hidden";s.innerHTML="<defs>"+R_DEFS+"</defs>";document.body.prepend(s)}
if(document.body)rEnsure();else document.addEventListener("DOMContentLoaded",rEnsure);

/* contact shadow */
const rSh=(cx,cy,rx,ry=rx*.18)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#rAO)"/>`;
/* vertical cylinder, top ellipse visible */
const rCylV=(cx,y1,y2,rx,m,o={})=>{const ry=o.ry??rx*.32;const g=o.grain?` filter="url(#rGrain)"`:"";
 return `<path d="M${cx-rx} ${y1} V${y2} A${rx} ${ry} 0 0 0 ${cx+rx} ${y2} V${y1} Z" fill="url(#r_${m}V)"${g}/>`+(o.top===false?"":`<ellipse cx="${cx}" cy="${y1}" rx="${rx}" ry="${ry}" fill="url(#r_${m}T)"/><ellipse cx="${cx}" cy="${y1}" rx="${rx}" ry="${ry}" fill="none" stroke="${rLight(R_MAT[m][0],.1)}" stroke-width=".6" opacity=".7"/>`)};
/* horizontal pipe / cylinder seen from the side, optional open or capped right end */
const rCylH=(x1,x2,cy,r,m,o={})=>{const rx=o.rx??r*.32;const g=o.grain?` filter="url(#rGrain)"`:"";
 return `<rect x="${x1}" y="${cy-r}" width="${x2-x1}" height="${2*r}" fill="url(#r_${m}H)"${g}/>`+(o.end?`<ellipse cx="${x2}" cy="${cy}" rx="${rx}" ry="${r}" fill="url(#r_${m}V)"/>`:"")+(o.bore?`<ellipse cx="${x2}" cy="${cy}" rx="${rx*.7}" ry="${r*.72}" fill="#0d0f10"/>`:"")};
/* banded fitting (malleable iron bead) */
const rBand=(x,cy,r,w,m)=>`<rect x="${x}" y="${cy-r}" width="${w}" height="${2*r}" rx="${w*.25}" fill="url(#r_${m}H)"/><rect x="${x}" y="${cy-r}" width="${w}" height="${2*r}" rx="${w*.25}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>`;
const rBandV=(cx,y,r,h,m)=>`<rect x="${cx-r}" y="${y}" width="${2*r}" height="${h}" ry="${h*.25}" fill="url(#r_${m}V)"/><rect x="${cx-r}" y="${y}" width="${2*r}" height="${h}" ry="${h*.25}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>`;
/* pipe threads showing at a joint */
const rThrH=(x1,x2,cy,r)=>{let s="";for(let x=x1;x<x2;x+=2.2)s+=`<path d="M${x} ${cy-r} l1.4 ${2*r}" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>`;return s};
const rThrV=(cx,y1,y2,r)=>{let s="";for(let y=y1;y<y2;y+=2.2)s+=`<path d="M${cx-r} ${y} l${2*r} 1.4" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>`;return s};
/* hex nut seen across the flats, on a horizontal axis: three visible faces */
const rHexH=(x,cy,w,r,m)=>`<rect x="${x}" y="${cy-r}" width="${w}" height="${r*.5}" fill="${rLight(R_MAT[m][3],-.25)}"/><rect x="${x}" y="${cy-r*.5}" width="${w}" height="${r}" fill="${R_MAT[m][2]}"/><rect x="${x}" y="${cy-r*.5}" width="${w}" height="${r}" fill="url(#r_${m}F)" opacity=".55"/><rect x="${x}" y="${cy+r*.5}" width="${w}" height="${r*.5}" fill="${rLight(R_MAT[m][3],-.45)}"/><rect x="${x}" y="${cy-r}" width="${w}" height="${2*r}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>`;
const rHexV=(cx,y,h,r,m)=>`<rect x="${cx-r}" y="${y}" width="${r*.5}" height="${h}" fill="${rLight(R_MAT[m][3],-.1)}"/><rect x="${cx-r*.5}" y="${y}" width="${r}" height="${h}" fill="${R_MAT[m][2]}"/><rect x="${cx-r*.5}" y="${y}" width="${r}" height="${h}" fill="url(#r_${m}F)" opacity=".5"/><rect x="${cx+r*.5}" y="${y}" width="${r*.5}" height="${h}" fill="${rLight(R_MAT[m][3],-.45)}"/><rect x="${cx-r}" y="${y}" width="${2*r}" height="${h}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>`;
/* box in oblique 3/4 view: front w x h at (x,y), depth goes up and right */
const rBox=(x,y,w,h,d,m,o={})=>{const dx=d*.6,dy=-d*.42,rr=o.r??2;const g=o.grain?` filter="url(#rGrain)"`:"";
 return `<path d="M${x} ${y} L${x+dx} ${y+dy} H${x+w+dx} L${x+w} ${y} Z" fill="url(#r_${m}T)"${g}/><path d="M${x+w} ${y} L${x+w+dx} ${y+dy} V${y+h+dy} L${x+w} ${y+h} Z" fill="url(#r_${m}S)"${g}/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rr}" fill="url(#r_${m}F)"${g}/>`+
 `<path d="M${x+1} ${y+.6} H${x+w-1}" stroke="#fff" stroke-opacity=".55" stroke-width="1"/><path d="M${x+w} ${y+1} L${x+w+dx-.6} ${y+dy+1}" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rr}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>`};
/* round head bolt */
const rBolt=(cx,cy,r=2.4)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#r_chromeV)" stroke="#000" stroke-opacity=".45" stroke-width=".5"/><circle cx="${cx-r*.35}" cy="${cy-r*.35}" r="${r*.35}" fill="#fff" opacity=".7"/>`;
/* screw slot dial face */
const rDial=(cx,cy,r,ang,col="#1d2124",num=true)=>{let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfaf4" stroke="#4a4f53" stroke-width=".7"/>`;
 if(num)for(let i=0;i<10;i++){const a=i/10*2*Math.PI-Math.PI/2;s+=`<line x1="${cx+r*.78*Math.cos(a)}" y1="${cy+r*.78*Math.sin(a)}" x2="${cx+r*.95*Math.cos(a)}" y2="${cy+r*.95*Math.sin(a)}" stroke="#333" stroke-width=".5"/>`}
 const a=ang*Math.PI/180-Math.PI/2;return s+`<line x1="${cx}" y1="${cy}" x2="${cx+r*.78*Math.cos(a)}" y2="${cy+r*.78*Math.sin(a)}" stroke="${col}" stroke-width="${Math.max(.8,r*.13)}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${r*.12}" fill="${col}"/>`};
/* label with leader, same look as zL */
const rL=(x1,y1,x2,y2,tx,ty,t,anchor)=>zL(x1,y1,x2,y2,tx,ty,t,anchor);
/* service regulator body, card coordinates (pipe axis y 196, x 100..240); cut=true opens the bonnet */
const rSregArt=cut=>{const win="M138 133 L138 100 Q170 91 202 100 L202 135 Q170 141 138 133 Z";
 return `${rCylH(108,232,196,22,"paint",{grain:true})}${rHexH(100,196,14,21,"paint")}${rHexH(226,196,14,21,"paint")}
 ${rCylV(170,140,178,18,"paint",{grain:true,top:false})}
 <path d="M78 129 Q84 154 170 158 Q256 154 262 129 Z" fill="url(#r_paintV)" filter="url(#rGrain)"/>
 <path d="M76 128 A94 22 0 0 0 264 128 V134 A94 22 0 0 1 76 134 Z" fill="url(#r_paintH)"/>
 ${Array.from({length:9},(_,i)=>{const t=(12+i*19.5)*Math.PI/180;return rBolt(170+92*Math.cos(t),131+20*Math.sin(t),2.3)}).join("")}
 <path d="M80 128 C84 94 122 82 170 82 C218 82 256 94 260 128 A90 20 0 0 1 80 128 Z" fill="url(#r_paintV)" filter="url(#rGrain)"/>
 <ellipse cx="128" cy="98" rx="30" ry="9" fill="#fff" opacity=".28" filter="url(#zSoft)"/>
 ${cut?`<path d="${win}" fill="url(#rCav)"/><path d="${win}" fill="none" stroke="#e6eaec" stroke-width="2.4"/><clipPath id="rg_rcut"><path d="${win}"/></clipPath><g clip-path="url(#rg_rcut)"><ellipse cx="170" cy="130" rx="34" ry="6" fill="#26282a"/><ellipse cx="170" cy="127" rx="18" ry="4" fill="url(#r_alV)"/>${Array.from({length:7},(_,k)=>`<ellipse cx="170" cy="${123-k*4}" rx="11" ry="3" fill="none" stroke="#1b1d1f" stroke-width="3"/><ellipse cx="170" cy="${123-k*4}" rx="11" ry="3" fill="none" stroke="url(#r_chromeV)" stroke-width="1.8"/>`).join("")}</g>`:""}
 ${rCylV(170,58,92,13,"paint",{grain:true})}${rHexV(170,48,10,11,"black")}${rCylV(170,40,50,9,"black",{ry:2.8})}
 ${rCylH(238,276,104,6,"paint")}${rBand(270,104,8,10,"paint")}${rCylV(282,104,140,7,"paint",{top:false})}<ellipse cx="282" cy="140" rx="7" ry="2.4" fill="#111"/>`};
