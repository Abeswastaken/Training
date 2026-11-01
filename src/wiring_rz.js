/* ---------- realistic part drawings (shared rz library) + extra parts ---------- */
const tz=(x,y,s,sz=10,a="middle",f="#1d2327",w=600)=>`<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${f}" font-family="var(--display)" font-weight="${w}">${s}</text>`;
const mbox=(x,y,w,h,f="url(#zSteelH)",r=4,st="#5f686d")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${st}" stroke-width="1.2" filter="url(#zShadow)"/>`;
const lugs=(xs,y)=>xs.map(x=>`<rect x="${x-6}" y="${y-4}" width="12" height="8" rx="1.5" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".6"/>${zScrew(x,y,3)}`).join("");
const swBody=(lbl,col,open,shape="pswitch")=>shape==="pswitch"
 ?`${mbox(12,0,46,40,"url(#zPlasticDk)",14,"#000")}<rect x="29" y="40" width="12" height="8" fill="url(#zBrass)"/>${tz(35,17,lbl,10,"middle",col,700)}`+
  `<circle cx="35" cy="28" r="5" fill="${open?"#d23a26":"#2f9a4a"}" stroke="#000"/>${tz(35,58,open?"OPEN":"CLOSED",8,"middle",open?"#c0281c":"#1e7a3a",700)}`
 :"";
const RZD={
 supply(p){const s=p.st;return mbox(0,0,130,84,"url(#zSteel)",3,"#4d555a")+`<rect x="6" y="6" width="118" height="72" rx="2" fill="#2a2f33"/>`+tz(65,19,"240 V PANEL",11,"middle","#e9ecee")+
  `<rect x="46" y="26" width="38" height="30" rx="3" fill="url(#zPlasticDk)" stroke="#000"/><rect x="52" y="${s.on?29:41}" width="26" height="12" rx="2" fill="${s.tripped?"#e8892b":s.on?"#2f9a4a":"#5b666d"}" stroke="#000"/>`+
  tz(65,68,s.tripped?"TRIPPED · tap":s.on?"ON · tap":"OFF · tap",9,"middle","#e9ecee",600)},
 disc(p){const on=p.st.on;return mbox(0,0,80,96,"url(#zSteel)",3,"#4d555a")+`<rect x="6" y="18" width="68" height="62" rx="2" fill="#2a2f33"/>`+tz(40,13,"DISCONNECT",9)+
  `<rect x="20" y="30" width="40" height="${on?36:20}" rx="3" fill="${on?"url(#zPlasticDk)":"#d23a26"}" stroke="#000"/>${tz(40,on?52:44,on?"ON":"PULLED",10,"middle","#e9ecee",700)}`+tz(40,92,"LINE ↑ LOAD ↓",7,"middle","#3b4449",600)},
 fuse(p){const b=p.st.blown;return `<rect x="16" y="2" width="8" height="10" fill="url(#zCuV)"/><rect x="16" y="78" width="8" height="10" fill="url(#zCuV)"/>`+mbox(8,10,24,70,"url(#zPlastic)",3,"#8f887a")+
  `<rect x="7" y="10" width="26" height="10" rx="2" fill="url(#zBrass)"/><rect x="7" y="70" width="26" height="10" rx="2" fill="url(#zBrass)"/>`+tz(20,44,"30A",9)+tz(20,56,"250V",6,"middle","#5b666d",500)+(b?`<path d="M12 34 l16 22 M28 34 l-16 22" stroke="#c0281c" stroke-width="2.4"/>`:"")},
 fuse3(p){return mbox(10,8,20,44,"#e8c33a",6,"#8a6a00")+`<rect x="12" y="12" width="16" height="6" fill="rgba(255,255,255,.4)"/>`+tz(20,36,"3A",9)+(p.st.blown?`<path d="M14 22 l12 14 M26 22 l-12 14" stroke="#c0281c" stroke-width="2.4"/>`:"")+`<rect x="17" y="0" width="6" height="8" fill="url(#zSteelH)"/><rect x="17" y="52" width="6" height="8" fill="url(#zSteelH)"/>`},
 xfmr(p,lbl="240 V PRIMARY"){return mbox(0,0,110,110,"url(#zSteelH)",3)+`<rect x="10" y="22" width="90" height="66" fill="url(#zLam)"/>${Array.from({length:10},(_,i)=>`<line x1="10" y1="${24+i*6.6}" x2="100" y2="${24+i*6.6}" stroke="#2e3438" stroke-width=".6"/>`).join("")}`+
  `<rect x="30" y="30" width="50" height="50" rx="6" fill="url(#zWind)" stroke="#5a2e10"/>`+tz(55,14,lbl,8)+tz(55,102,"24 V · 40 VA",8)+(p.st.burned?`<rect x="20" y="44" width="70" height="20" fill="rgba(0,0,0,.6)"/>`+tz(55,59,"BURNED",13,"middle","#ff8a7a",700):"")},
 tstat(p){const m=p.st.mode;return mbox(0,0,120,80,"url(#zPlastic)",10,"#8f887a")+`<rect x="22" y="10" width="76" height="34" rx="4" fill="url(#zLcd)" stroke="#6e7f71"/>`+
  tz(60,33,m.toUpperCase(),14,"middle",m==="cool"?"#1d4f9a":m==="heat"?"#a8461a":"#1f2a22",700)+tz(60,60,"tap to change mode",8,"middle","#5b666d",500)},
 contactor(p){const i=p.st.in||p.st.welded;return mbox(0,0,100,120,"url(#zPlastic)",8,"#8e8777")+`<rect x="4" y="4" width="92" height="22" rx="4" fill="url(#zPlasticDk)"/><rect x="4" y="94" width="92" height="22" rx="4" fill="url(#zPlasticDk)"/>`+lugs([25,75],12)+lugs([25,75],108)+
  `<rect x="14" y="32" width="72" height="56" rx="4" fill="#1e2326" stroke="#6b7378"/><rect x="20" y="${i?48:40}" width="60" height="9" rx="2" fill="url(#zSteelH)"/>`+
  `<rect x="22" y="${i?57:49}" width="10" height="5" fill="#d9dee1"/><rect x="68" y="${i?57:49}" width="10" height="5" fill="#d9dee1"/><rect x="20" y="64" width="12" height="5" fill="#d9dee1"/><rect x="68" y="64" width="12" height="5" fill="#d9dee1"/>`+
  `<rect x="36" y="70" width="28" height="15" rx="2" fill="url(#zWind)" stroke="#5a2e10"/>${i&&!p.st.burned?`<rect x="36" y="70" width="28" height="15" rx="2" fill="#ffd27a" opacity=".35"/>`:""}`+
  (p.st.welded?tz(50,30,"WELDED",8,"middle","#ff8a7a",700):"")+(p.st.burned?`<rect x="10" y="40" width="80" height="18" fill="rgba(0,0,0,.65)"/>`+tz(50,53,"COIL BURNED",9,"middle","#ff8a7a",700):"")},
 relay(p){const i=p.st.in;return mbox(0,0,90,90,"rgba(210,225,235,.55)",5,"#6f787e")+`<rect x="10" y="20" width="26" height="50" rx="3" fill="url(#zWind)" stroke="#5a2e10"/>${i&&!p.st.burned?`<rect x="10" y="20" width="26" height="50" rx="3" fill="#ffd27a" opacity=".35"/>`:""}`+
  `<circle cx="74" cy="45" r="3.5" fill="url(#zBrass)"/><circle cx="80" cy="15" r="3.5" fill="url(#zBrass)"/><circle cx="80" cy="75" r="3.5" fill="url(#zBrass)"/><line x1="74" y1="45" x2="80" y2="${i?18:72}" stroke="url(#zBrass)" stroke-width="3"/>`+tz(62,16,"NO",8)+tz(62,82,"NC",8)+(p.st.burned?tz(23,49,"BURNED",7,"middle","#c0281c",700):"")},
 hps(p){return swBody("HPS","#ff8a7a",p.st.open)},
 lps(p){return swBody("LPS","#8fc3ff",p.st.open)},
 tsw(p){return mbox(5,2,60,44,"url(#zSteelH)",22)+`<circle cx="35" cy="20" r="11" fill="url(#zAluTop)" stroke="#5f686d"/>`+tz(35,40,p.st.closed?"CLOSED":"OPEN",8,"middle",p.st.closed?"#1e7a3a":"#3b4449",700)},
 pbno(p){return mbox(5,5,50,44,"url(#zPlasticDk)",4,"#000")+`<circle cx="30" cy="27" r="15" fill="url(#zSteel)"/><circle cx="30" cy="${p.st.on?29:26}" r="11" fill="#2f9a4a" stroke="#0e3a1a"/><ellipse cx="27" cy="${p.st.on?25:22}" rx="5" ry="3" fill="rgba(255,255,255,.35)"/>`},
 pbnc(p){return mbox(5,5,50,44,"url(#zPlasticDk)",4,"#000")+`<circle cx="30" cy="27" r="15" fill="url(#zSteel)"/><circle cx="30" cy="${p.st.on?29:26}" r="11" fill="#d23a26" stroke="#5a0b07"/><ellipse cx="27" cy="${p.st.on?25:22}" rx="5" ry="3" fill="rgba(255,255,255,.35)"/>`},
 toggle(p){return mbox(5,5,50,44,"url(#zPlastic)",4,"#8f887a")+`<rect x="22" y="18" width="16" height="16" rx="3" fill="url(#zSteel)"/><line x1="30" y1="26" x2="${p.st.on?40:20}" y2="10" stroke="url(#zSteel)" stroke-width="6" stroke-linecap="round"/>`+tz(30,46,p.st.on?"ON":"OFF",8)},
 comp(p){const s=p.st;return `<g ${s.run?'class="vib"':""}>`+zShade(50,116,48,4)+`<path d="M8 112 V36 Q8 6 50 6 Q92 6 92 36 V112 Z" fill="url(#zShell)" stroke="#111"/><path d="M14 40 Q16 14 50 12" stroke="rgba(255,255,255,.22)" stroke-width="4" fill="none"/>`+
  `<rect x="16" y="38" width="68" height="42" rx="4" fill="rgba(14,17,19,.78)"/>`+tz(50,54,"COMPRESSOR",10,"middle","#e9ecee")+tz(50,72,s.burned?"BURNED":s.ol?"OVERLOAD":s.run?"RUNNING":s.hum>0?"HUMMING":"OFF",10,"middle",s.burned||s.ol?"#ff8a7a":s.run?"#6fdc8c":s.hum>0?"#f2c84a":"#c4cacf")+
  `<rect x="34" y="88" width="32" height="18" rx="3" fill="url(#zPlasticDk)" stroke="#000"/></g>`},
 fan(p){return `<circle cx="50" cy="44" r="42" fill="url(#zInside)" stroke="#111"/><g class="spin" data-spin="${p.id}" transform="rotate(${p.st.ang||0} 50 44)">${[0,1,2].map(i=>`<path d="M50 44 C38 30 40 10 52 6 C62 12 60 30 50 44 Z" fill="url(#zAlu)" stroke="#5f686d" stroke-width=".6" transform="rotate(${i*120} 50 44)"/>`).join("")}</g>`+
  `<circle cx="50" cy="44" r="42" fill="url(#zGrille)" opacity=".55"/><circle cx="50" cy="44" r="9" fill="url(#zMotor)" stroke="#000"/>`+tz(50,98,p.st.run?"RUNNING":p.st.hum>0?"HUMMING":"",8,"middle",p.st.run?"#1e7a3a":"#a8461a",700)},
 cap(p){return mbox(5,4,60,82,"url(#zAlu)",6,"#5f686d")+`<ellipse cx="35" cy="6" rx="30" ry="5" fill="url(#zAluTop)" stroke="#5f686d"/>`+(p.st.bad?`<path d="M5 8 Q35 -14 65 8" fill="url(#zAluTop)" stroke="#c0281c" stroke-width="1.6"/>`:"")+
  `<rect x="8" y="30" width="54" height="34" fill="#f2f0e9"/>`+tz(35,46,"45/5 µF",10)+tz(35,58,"440 VAC",7,"middle","#3b4449",500)+tz(35,78,p.st.bad?"FAILED":"tap to fail",7,"middle",p.st.bad?"#c0281c":"#3b4449",600)},
 lamp24(p){const on=p.st.v>12&&!p.st.burned;return `<rect x="10" y="30" width="30" height="16" rx="2" fill="url(#zSteelH)" stroke="#5f686d"/><circle cx="25" cy="24" r="17" fill="${on?"#ffd84a":"#9aa1a6"}" stroke="#4d555a" ${on?'filter="url(#zGlow)"':""}/><ellipse cx="20" cy="18" rx="6" ry="4" fill="rgba(255,255,255,.45)"/>`+tz(25,56,p.st.burned?"BURNED":"24V",8,"middle",p.st.burned?"#c0281c":"#3b4449",700)},
 lamp120(p){const on=p.st.v>70&&!p.st.burned;return `<rect x="10" y="30" width="30" height="16" rx="2" fill="url(#zSteelH)" stroke="#5f686d"/><circle cx="25" cy="24" r="17" fill="${on?"#ff9a4a":"#9aa1a6"}" stroke="#4d555a" ${on?'filter="url(#zGlow)"':""}/><ellipse cx="20" cy="18" rx="6" ry="4" fill="rgba(255,255,255,.45)"/>`+tz(25,56,p.st.burned?"BURNED":"120V",8,"middle",p.st.burned?"#c0281c":"#3b4449",700)},
 heater(p){const g=clamp(p.st.v/240,0,1);return mbox(0,6,120,40,"url(#zSteelH)",3)+`<rect x="6" y="12" width="108" height="28" fill="#2a2f33"/><path d="M10 26 ${Array.from({length:12},(_,i)=>`L${16+i*8} ${i%2?16:36}`).join(" ")} L110 26" stroke="${g>0.3?`rgb(${Math.round(150+105*g)},${Math.round(90*g)},20)`:"#8a7f75"}" stroke-width="3" fill="none" ${g>0.3?'filter="url(#zGlow)"':""}/>`},
 tb(){return mbox(0,0,80,24,"url(#zPlasticDk)",3,"#000")+[10,30,50,70].map(x=>`<rect x="${x-7}" y="4" width="14" height="16" rx="2" fill="url(#zBrassH)"/>`).join("")},
 gnd(){return `<rect x="10" y="8" width="20" height="14" rx="2" fill="url(#zBrassH)" stroke="#6a4a12"/><path d="M20 22 V28 M8 28 H32 M12 33 H28 M16 38 H24" stroke="#2f9a4a" stroke-width="3"/>`}
};
for(const k in RZD)if(T[k])T[k].draw=RZD[k];

// ---- extra parts for the furnace, heat pump and walk-in examples ----
const isOn=(p,a,b)=>p.st.v>0;
const m120=(name,w,h,info,drawFn)=>({name,cat:"Loads",w,h,terms:[["L",15,h,"L"],["N",w-15,h,"N"]],init:()=>({v:0,run:false,burned:false,ang:0}),
 elems(p,m){return p.st.burned?[]:[{a:"L",b:"N",r:m==="ohm"?12:p.st.run?60:12,rated:120,m120:1}]},draw:drawFn,info});
Object.assign(T,{
 xfmr120:{name:"Transformer 120/24 V",cat:"Power",w:110,h:110,terms:[["H1",25,0,"H1"],["H2",85,0,"H2"],["X1",25,110,"R"],["X2",85,110,"C"]],init:()=>({burned:false}),ratio:5,
  elems(p,m){if(m==="ohm")return [["H1","H2",9,"load"],["X1","X2",0.8,"load"]];const e=[{a:"H1",b:"H2",r:1200,rated:120,prim:1}];if(!p.st.burned)e.push({a:"X1",b:"X2",xfmr:true,r:0.6});return e},
  draw(p){return RZD.xfmr(p,"120 V PRIMARY")},info:"Furnace control transformer: 120 V primary (L and N) to 24 V. Secondary R (X1) and C (X2)."},
 tstatHP:{name:"Heat pump thermostat",cat:"Controls",w:150,h:80,terms:[["R",12,80,"R"],["C",36,80,"C"],["Y",60,80,"Y"],["G",84,80,"G"],["O",108,80,"O"],["W2",136,80,"W2"]],init:()=>({mode:"off"}),
  click(p){const o=["off","cool","heat","em heat","fan"];p.st.mode=o[(o.indexOf(p.st.mode)+1)%o.length];
   say(`Heat pump thermostat: ${p.st.mode}${{cool:" (R to Y, G and O)",heat:" (R to Y and G; O off)","em heat":" (R to W2 and G; compressor locked out)",fan:" (R to G)"}[p.st.mode]||""}.`)},
  elems(p){const m=p.st.mode,e=[];if(m==="cool")e.push(["R","Y",SW,"w"],["R","G",SW,"w"],["R","O",SW,"w"]);if(m==="heat")e.push(["R","Y",SW,"w"],["R","G",SW,"w"]);if(m==="em heat")e.push(["R","W2",SW,"w"],["R","G",SW,"w"]);if(m==="fan")e.push(["R","G",SW,"w"]);e.push({a:"R",b:"C",r:4000,rated:24,low:1});return e},
  draw(p){const m=p.st.mode;return mbox(0,0,150,80,"url(#zPlastic)",10,"#8f887a")+`<rect x="24" y="10" width="102" height="34" rx="4" fill="url(#zLcd)" stroke="#6e7f71"/>`+tz(75,33,m.toUpperCase(),14,"middle",m==="cool"?"#1d4f9a":m.includes("heat")?"#a8461a":"#1f2a22",700)+tz(75,60,"tap to change mode",8,"middle","#5b666d",500)},
  info:"Heat pump thermostat with an O terminal. O energizes the reversing valve in cooling (most brands; Rheem/Ruud use B in heating instead). Heat: R to Y and G. Emergency heat: W2 and G only."},
 rvcoil:{name:"Reversing valve coil 24 V",cat:"Loads",w:80,h:60,terms:[["1",15,60,"1"],["2",65,60,"2"]],init:()=>({v:0,burned:false}),
  elems(p,m){return p.st.burned?[]:[{a:"1",b:"2",r:m==="ohm"?40:60,rated:24,lamp:1}]},
  draw(p){const on=p.st.v>18&&!p.st.burned;return `<rect x="4" y="22" width="72" height="12" rx="6" fill="url(#zBrassH)" stroke="#5e400e"/>`+mbox(22,4,36,40,"url(#zPlasticDk)",3,"#000")+`<circle cx="40" cy="18" r="4" fill="${on?"#e8892b":"#4b555b"}"/>`+tz(40,36,on?"COOL":"HEAT",8,"middle","#e9ecee",700)+(p.st.burned?tz(40,56,"BURNED",8,"middle","#c0281c",700):"")},
  info:"The solenoid on the reversing valve's pilot. On an O system it is energized in cooling, so a dead coil leaves the unit stuck in heat."},
 blower:m120("Blower motor 120 V",100,100,"Indoor blower (simplified: no capacitor needed here). Runs on 120 V between L and N. Put 240 V on it and it burns out.",
  p=>`<circle cx="50" cy="46" r="42" fill="url(#zSteelH)" stroke="#4d555a"/><circle cx="50" cy="46" r="34" fill="url(#zInside)"/><g transform="rotate(${p.st.ang||0} 50 46)">${Array.from({length:18},(_,i)=>{const a=i*20*Math.PI/180;return `<line x1="${(50+20*Math.cos(a)).toFixed(1)}" y1="${(46+20*Math.sin(a)).toFixed(1)}" x2="${(50+32*Math.cos(a+.25)).toFixed(1)}" y2="${(46+32*Math.sin(a+.25)).toFixed(1)}" stroke="#b9c1c6" stroke-width="2"/>`}).join("")}</g><circle cx="50" cy="46" r="11" fill="url(#zMotor)" stroke="#000"/>`+tz(50,98,p.st.burned?"BURNED":p.st.run?"RUNNING":"",8,"middle",p.st.burned?"#c0281c":"#1e7a3a",700)),
 inducer:m120("Inducer motor 120 V",90,80,"Draft inducer. When it runs it pulls a draft through the heat exchanger, which closes the pressure switch.",
  p=>`<path d="M45 6 A34 34 0 1 1 11 40 H24 V6 Z" fill="url(#zSteelH)" stroke="#4d555a"/><circle cx="45" cy="40" r="26" fill="url(#zInside)"/><g transform="rotate(${p.st.ang||0} 45 40)">${[0,45,90,135].map(a=>`<line x1="${45-20*Math.cos(a*Math.PI/180)}" y1="${40-20*Math.sin(a*Math.PI/180)}" x2="${45+20*Math.cos(a*Math.PI/180)}" y2="${40+20*Math.sin(a*Math.PI/180)}" stroke="#c4cacf" stroke-width="3"/>`).join("")}</g><rect x="68" y="30" width="18" height="22" rx="3" fill="url(#zMotor)" stroke="#000"/>`+tz(45,78,p.st.burned?"BURNED":p.st.run?"RUNNING":"",8,"middle",p.st.burned?"#c0281c":"#1e7a3a",700)),
 hsi:{name:"Hot surface igniter 120 V",cat:"Loads",w:90,h:50,terms:[["1",15,50,"1"],["2",75,50,"2"]],init:()=>({v:0,burned:false}),
  elems(p,m){return p.st.burned?[]:[{a:"1",b:"2",r:m==="ohm"?60:40,rated:120,heat:1}]},
  draw(p){const g=p.st.burned?0:clamp(p.st.v/120,0,1);return `<rect x="4" y="16" width="26" height="16" rx="2" fill="#efe9dc" stroke="#8f887a"/><rect x="30" y="19" width="54" height="10" rx="4" fill="${g>0.5?`rgb(255,${Math.round(150+80*g)},${Math.round(60*g)})`:"#3a3f44"}" ${g>0.5?'filter="url(#zGlow)"':""}/>`+tz(45,46,p.st.burned?"CRACKED":g>0.5?"GLOWING":"",8,"middle",p.st.burned?"#c0281c":"#a8461a",700)},
  info:"Silicon carbide or nitride element. Heats to about 2500°F on 120 V and lights the gas. Fragile: 240 V cracks it."},
 gasvalve:{name:"Gas valve 24 V",cat:"Loads",w:100,h:70,terms:[["1",20,70,"MV"],["2",80,70,"COM"]],init:()=>({v:0,burned:false}),
  elems(p,m){return p.st.burned?[]:[{a:"1",b:"2",r:m==="ohm"?50:60,rated:24,lamp:1}]},
  draw(p){const on=p.st.v>18&&!p.st.burned;return `<rect x="0" y="26" width="100" height="12" fill="url(#zSteelH)" stroke="#4d555a"/>`+mbox(18,4,64,52,"url(#zAlu)",4)+`<rect x="24" y="10" width="34" height="40" rx="3" fill="url(#zPlasticDk)"/>`+tz(41,26,"GAS",9,"middle","#e9ecee",700)+tz(41,40,on?"OPEN":"SHUT",8,"middle",on?"#ffb35a":"#9aa3a9",700)+(on?`<path d="M72 18 q-6 -10 0 -16 q6 6 0 16" fill="#3d7de0" filter="url(#zGlow)"/>`:"")},
  info:"Redundant 24 V gas valve. The board energizes MV only after the inducer has proven draft and the igniter is hot."},
 limit:{name:"High limit (NC)",cat:"Switches",w:70,h:60,terms:[["1",15,60,"1"],["2",55,60,"2"]],init:()=>({open:false}),
  click(p){p.st.open=!p.st.open;say(p.st.open?"High limit opened (simulated overheating).":"High limit closed.")},
  elems(p){return p.st.open?[]:[["1","2",SW,"w"]]},draw(p){return swBody("LIMIT","#ffb35a",p.st.open)},
  info:"Normally closed snap disc. Opens if the heat exchanger area overheats. Wired in series with the pressure switch on this board. Tap to trip it."},
 psw:{name:"Pressure switch (NO, draft)",cat:"Switches",w:70,h:60,terms:[["1",15,60,"1"],["2",55,60,"2"]],init:()=>({closed:false,blocked:false}),
  click(p){p.st.blocked=!p.st.blocked;say(p.st.blocked?"Vent blocked: the pressure switch can't see enough draft.":"Vent clear.")},
  elems(p){return p.st.closed?[["1","2",SW,"w"]]:[]},
  step(p){const ind=parts.some(x=>x.type==="inducer"&&x.st.run);const want=ind&&!p.st.blocked;if(want!==p.st.closed){p.st.closed=want;say(`Pressure switch ${want?"closed: draft proven":"open"}.`,want?"":"w")}},
  draw(p){return swBody(p.st.blocked?"BLOCKED":"PS","#8fc3ff",!p.st.closed)},
  info:"Normally open. Closes on the negative pressure from a running inducer. Tap it to block the vent."},
 ifc:{name:"Furnace control board",cat:"Controls",w:260,h:110,terms:[["L",15,0,"L 120"],["N",45,0,"N"],["IND",85,0,"IND"],["HSI",125,0,"HSI"],["BLW",165,0,"BLW"],
   ["R",15,110,"R"],["C",45,110,"C"],["W",75,110,"W"],["G",105,110,"G"],["RO",145,110,"R out"],["PS",185,110,"PS in"],["GV",225,110,"GV"]],
  init:()=>({st:"idle",tm:0,ind:false,hsi:false,gv:false,blw:false,bt:0}),
  elems(p,m){const s=p.st,e=[["R","RO",SW,"w"]];if(m==="live"){if(s.ind)e.push(["L","IND",SW,"w"]);if(s.hsi)e.push(["L","HSI",SW,"w"]);if(s.blw)e.push(["L","BLW",SW,"w"]);if(s.gv)e.push(["R","GV",SW,"w"]);
    e.push({a:"R",b:"C",r:3000,rated:24,low:1},{a:"W",b:"C",r:5000},{a:"G",b:"C",r:5000},{a:"PS",b:"C",r:5000})}return e},
  step(p,v,dt){const s=p.st,on=v("L","N")>90&&v("R","C")>18,W=on&&v("W","C")>18,G=on&&v("G","C")>18,PS=on&&v("PS","C")>18;s.tm+=dt;
   const go=(x,msg)=>{s.st=x;s.tm=0;if(msg)say("Board: "+msg)};
   if(!on){s.ind=s.hsi=s.gv=false;s.blw=false;s.hb=false;if(s.st!=="idle")go("idle");return}
   switch(s.st){
    case "idle":s.ind=s.hsi=s.gv=false;if(W){if(PS){go("pserr","pressure switch closed before the inducer started. Won't start.")}else{s.ind=true;go("waitps","heat call. Inducer on, waiting for the pressure switch.")}}break;
    case "pserr":if(!PS||!W)go("idle");break;
    case "waitps":s.ind=true;if(!W){go("post");break}if(PS)go("prepurge","pressure switch closed. Prepurge.");break;
    case "prepurge":if(!PS){go("waitps","pressure switch opened.");break}if(s.tm>=5){s.hsi=true;go("warm","igniter on, warming up.")}break;
    case "warm":if(!PS){s.hsi=false;go("waitps","pressure switch opened.");break}if(s.tm>=7){s.gv=true;go("trial","gas valve open. Trial for ignition.")}break;
    case "trial":if(!PS){s.gv=s.hsi=false;go("waitps","pressure switch opened. Gas off.");break}if(s.tm>=3){const hot=parts.some(x=>x.type==="hsi"&&x.st.v>90&&!x.st.burned),gvok=parts.some(x=>x.type==="gasvalve"&&x.st.v>18&&!x.st.burned);
      s.hsi=false;if(hot&&gvok){s.bt=10;go("run","flame proved. Igniter off. Blower on in 10 s.")}else{s.gv=false;go("retry",!hot?"no ignition: the igniter never got hot. Gas off.":"no ignition: the gas valve never opened. Gas off.")}}break;
    case "retry":if(s.tm>=5)go("idle");break;
    case "run":if(!W){s.gv=false;go("post","heat call ended. Gas off, post-purge.");break}if(!PS){s.gv=false;go("waitps","pressure switch or limit opened. Gas off, blower stays on.");break}break;
    case "post":s.gv=false;s.hsi=false;if(s.tm>=5){s.ind=false;go("idle")}break}
   if(s.st==="run"){s.bt=Math.max(0,s.bt-dt);if(s.bt<=0)s.hb=true;s.od=20}else if(s.hb){if(s.st==="waitps")s.od=20;else{s.od-=dt;if(s.od<=0){s.hb=false;say("Board: blower off delay done.")}}}
   s.blw=G||!!s.hb},
  draw(p){const s=p.st,lbl={idle:"STANDBY",pserr:"PS ERROR",waitps:"WAIT PS",prepurge:"PREPURGE",warm:"IGNITER",trial:"TRIAL",retry:"RETRY",run:"HEATING",post:"POST-PURGE"}[s.st];
   return mbox(0,6,260,98,"url(#zGreen)",4,"#0e2414")+`<rect x="8" y="14" width="22" height="14" fill="#111"/><rect x="36" y="14" width="22" height="14" fill="#111"/><rect x="210" y="18" width="40" height="30" rx="2" fill="#1b1f22"/>`+
    `<rect x="70" y="40" width="120" height="26" rx="3" fill="#0d1a10" stroke="#3f7a4a"/>`+tz(130,58,lbl,13,"middle","#8fe0a0",700)+`<circle cx="230" cy="33" r="5" fill="${s.st==="run"?"#2f9a4a":s.st==="pserr"||s.st==="retry"?"#e8892b":"#4b555b"}"/>`+
    tz(130,82,`IND ${s.ind?"●":"○"}  HSI ${s.hsi?"●":"○"}  GV ${s.gv?"●":"○"}  BLW ${s.blw?"●":"○"}`,9,"middle","#e9ecee",600)+tz(130,96,"FURNACE CONTROL (times shortened)",7,"middle","#bfe0c4",500)},
  info:"Integrated furnace control, simplified with short timings. On W: checks the pressure switch is open, runs the inducer, waits for PS in (R out through the limit and pressure switch), prepurges, heats the igniter, opens the gas valve, then starts the blower. G alone runs the blower."},
 lls:{name:"Liquid line solenoid 24 V",cat:"Loads",w:90,h:60,terms:[["1",20,60,"1"],["2",70,60,"2"]],init:()=>({v:0,burned:false}),
  elems(p,m){return p.st.burned?[]:[{a:"1",b:"2",r:m==="ohm"?40:60,rated:24,lamp:1}]},
  draw(p){const on=p.st.v>18&&!p.st.burned;return `<rect x="0" y="34" width="90" height="10" fill="url(#zCuH)" stroke="#5a2a12" stroke-width=".6"/>`+mbox(28,30,34,18,"url(#zBrassH)",3,"#5e400e")+mbox(30,2,30,28,"url(#zPlasticDk)",3,"#000")+`<circle cx="45" cy="14" r="4" fill="${on?"#2f9a4a":"#4b555b"}"/>`+tz(45,58,p.st.burned?"BURNED":on?"OPEN":"CLOSED",8,"middle",p.st.burned?"#c0281c":on?"#1e7a3a":"#3b4449",700)},
  info:"Normally closed valve in the liquid line. The box thermostat powers it open. When it closes, the compressor pumps the low side down."},
 lpc:{name:"Low pressure control (pump-down)",cat:"Switches",w:90,h:70,terms:[["1",20,70,"1"],["2",70,70,"2"]],init:()=>({psi:40,closed:true}),
  elems(p){return p.st.closed?[["1","2",SW,"w"]]:[]},
  step(p,v,dt){const feed=parts.some(x=>x.type==="lls"&&x.st.v>18&&!x.st.burned),run=parts.some(x=>x.type==="comp"&&x.st.run);const s=p.st;
   const tgt=feed?(run?22:45):run?0:s.psi+(feed?0:0.2);s.psi+=(tgt-s.psi)*Math.min(1,dt/(run&&!feed?4:6));s.psi=clamp(s.psi,-5,60);
   if(s.closed&&s.psi<=10){s.closed=false;say(`Low pressure control opened at ${Math.round(s.psi)} psig: pumped down, compressor off.`)}else if(!s.closed&&s.psi>=30){s.closed=true;say(`Low pressure control closed at ${Math.round(s.psi)} psig (cut-in).`)}},
  draw(p){const s=p.st;return mbox(5,0,80,54,"url(#zSteelH)",4)+`<circle cx="30" cy="27" r="18" fill="#fbfbf8" stroke="#2f6fd6" stroke-width="3"/><line x1="30" y1="27" x2="${(30+14*Math.sin((-135+clamp(s.psi,0,80)/80*270)*Math.PI/180)).toFixed(1)}" y2="${(27-14*Math.cos((-135+clamp(s.psi,0,80)/80*270)*Math.PI/180)).toFixed(1)}" stroke="#c0281c" stroke-width="2"/>`+
   tz(64,22,`${Math.round(s.psi)}`,12)+tz(64,34,"psig",7,"middle","#3b4449",500)+tz(45,66,s.closed?"CLOSED":"OPEN",8,"middle",s.closed?"#1e7a3a":"#c0281c",700)},
  info:"Opens on falling suction pressure (cut-out 10 psig here) and closes on rising pressure (cut-in 30 psig). In a pump-down system it, not the thermostat, starts and stops the compressor."}
});
