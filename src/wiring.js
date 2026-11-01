(()=>{
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const NS="http://www.w3.org/2000/svg";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const K="var(--ink)",PL="var(--wpart)",ED="var(--line)";
const gimg=q=>"https://www.google.com/search?tbm=isch&q="+encodeURIComponent(q);
const rect=(x,y,w,h,f=PL,r=4,extra="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${ED}" stroke-width="1.2" ${extra}/>`;
const tx=(x,y,s,sz=10,a="middle",f="var(--ink)",w=600)=>`<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${f}" font-family="var(--display)" font-weight="${w}">${s}</text>`;

/* ---------- part types ----------
 terms: [id,x,y,label]. elems(p,mode): electrical elements between terminal ids.
 kind: "w" wire-like (switch, fuse), "load" (rated V, run R), "src" (Norton source), "cap".
*/
const SW=0.004;
const T={
 supply:{name:"240 V supply (breaker)",cat:"Power",w:130,h:84,terms:[["L1",20,84,"L1"],["L2",50,84,"L2"],["N",80,84,"N"],["G",110,84,"G"]],
  init:()=>({on:false,tripped:false}),
  click(p){if(p.st.tripped){p.st.tripped=false;p.st.on=false;say(`${p.label} breaker reset (off). Turn it on when the wiring is fixed.`);return}p.st.on=!p.st.on;say(`${p.label} breaker ${p.st.on?"ON. Circuit is live.":"OFF."}`)},
  elems(p,m){const e=[["N","G",0.001,"w"]];if(m==="live"&&p.st.on)e.push({a:"L1",b:"G",src:120,r:0.02},{a:"L2",b:"G",src:-120,r:0.02});return e},
  draw(p){const s=p.st;return rect(0,0,130,84,"var(--plate)")+tx(65,18,"240 V PANEL",12,"middle","var(--plate-ink)")+
   `<rect x="44" y="28" width="42" height="26" rx="3" fill="${s.tripped?"var(--warn)":s.on?"var(--ok)":"#555"}" stroke="${ED}"/>`+tx(65,46,s.tripped?"TRIPPED":s.on?"ON":"OFF",11,"middle","#fff")+tx(65,68,"tap to switch",8,"middle","var(--plate-ink)",500)},
  info:"The power source. L1 and L2 are each 120 V to ground and 240 V to each other. N (neutral) and G (ground) are bonded together at the panel. Tap it to switch the breaker. A dead short trips it."},
 disc:{name:"Disconnect (2-pole)",cat:"Power",w:80,h:96,terms:[["L1",20,0,"L1"],["L2",60,0,"L2"],["T1",20,96,"T1"],["T2",60,96,"T2"]],
  init:()=>({on:true}),click(p){p.st.on=!p.st.on;say(`Disconnect ${p.st.on?"closed":"pulled (open)"}.`)},
  elems(p){return p.st.on?[["L1","T1",SW,"w"],["L2","T2",SW,"w"]]:[]},
  draw(p){return rect(0,0,80,96)+tx(40,16,"DISCONNECT",9)+`<rect x="22" y="34" width="36" height="32" rx="3" fill="${p.st.on?"var(--ok)":"var(--bad)"}"/>`+tx(40,55,p.st.on?"ON":"OFF",11,"middle","#fff")+tx(40,84,"LINE ↑  LOAD ↓",7,"middle","var(--muted)",500)},
  info:"Service switch beside the unit. Both legs open together. Line side stays live when it's pulled."},
 fuse:{name:"Fuse (30 A)",cat:"Power",w:40,h:90,terms:[["1",20,0,"1"],["2",20,90,"2"]],init:()=>({blown:false,amps:30}),
  click(p){if(p.st.blown){p.st.blown=false;say("Fuse replaced.")}},
  elems(p){return p.st.blown?[]:[{a:"1",b:"2",r:SW,fuse:p.st.amps}]},
  draw(p){return rect(8,10,24,70,"#e9ecee",10)+`<line x1="20" y1="18" x2="20" y2="72" stroke="${p.st.blown?"transparent":"#9a6f1f"}" stroke-width="2"/>`+(p.st.blown?`<path d="M14 40 l12 10 M26 40 l-12 10" stroke="var(--bad)" stroke-width="2"/>`:"")+tx(20,50,"30A",8)+(p.st.blown?tx(20,98,"BLOWN · tap",8,"middle","var(--bad)"):"")},
  info:"Overcurrent protection. A dead short blows it right away; a long overload blows it after a few seconds. Tap a blown fuse to replace it."},
 fuse3:{name:"Fuse (3 A, 24 V)",cat:"Power",w:40,h:60,terms:[["1",20,0,"1"],["2",20,60,"2"]],init:()=>({blown:false,amps:3}),
  click(p){if(p.st.blown){p.st.blown=false;say("3 A fuse replaced.")}},
  elems(p){return p.st.blown?[]:[{a:"1",b:"2",r:SW,fuse:p.st.amps}]},
  draw(p){return rect(10,8,20,44,"#e8c33a",8)+(p.st.blown?`<path d="M14 24 l12 10 M26 24 l-12 10" stroke="var(--bad)" stroke-width="2"/>`:"")+tx(20,34,"3A",8)},
  info:"The control board fuse. Protects the transformer secondary from a shorted 24 V wire."},
 xfmr:{name:"Transformer 240/24 V",cat:"Power",w:110,h:110,terms:[["H1",25,0,"H1"],["H2",85,0,"H2"],["X1",25,110,"R"],["X2",85,110,"C"]],init:()=>({burned:false}),
  elems(p,m){if(m==="ohm")return [["H1","H2",30,"load"],["X1","X2",0.8,"load"]];const e=[{a:"H1",b:"H2",r:2400,rated:240}];if(!p.st.burned)e.push({a:"X1",b:"X2",xfmr:true,r:0.6});return e},
  draw(p){return rect(0,0,110,110,"#4a5258")+`<path d="M18 30 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0 q7 -8 14 0" fill="none" stroke="#c87f4f" stroke-width="3"/><path d="M18 80 q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0" fill="none" stroke="#c87f4f" stroke-width="3"/><line x1="16" y1="55" x2="94" y2="55" stroke="#9aa1a8" stroke-width="3"/>`+tx(55,20,"240 V PRIMARY",8,"middle","#e9ecee")+tx(55,100,"24 V · 40 VA",8,"middle","#e9ecee")+(p.st.burned?tx(55,60,"BURNED",14,"middle","var(--bad)",700):"")},
  info:"Steps 240 V down to 24 V for the controls. Secondary R (X1) and C (X2). Rated 40 VA, about 1.7 A. A short on the secondary burns it up unless a 3 A fuse catches it."},
 tstat:{name:"Thermostat",cat:"Controls",w:120,h:80,terms:[["R",15,80,"R"],["Y",40,80,"Y"],["G",65,80,"G"],["W",90,80,"W"],["C",110,80,"C"]],init:()=>({mode:"off"}),
  click(p){const o=["off","cool","heat","fan"];p.st.mode=o[(o.indexOf(p.st.mode)+1)%4];say(`Thermostat: ${p.st.mode}${p.st.mode==="cool"?" (R to Y and G)":p.st.mode==="heat"?" (R to W)":p.st.mode==="fan"?" (R to G)":""}.`)},
  elems(p){const m=p.st.mode,e=[];if(m==="cool"){e.push(["R","Y",SW,"w"],["R","G",SW,"w"])}if(m==="heat")e.push(["R","W",SW,"w"]);if(m==="fan")e.push(["R","G",SW,"w"]);e.push({a:"R",b:"C",r:4000,rated:24,low:1});return e},
  draw(p){return rect(0,0,120,80,"#f4f4f0",8)+`<rect x="24" y="12" width="72" height="30" rx="4" fill="#2f3337"/>`+tx(60,33,p.st.mode.toUpperCase(),14,"middle",p.st.mode==="cool"?"#6fb3e8":p.st.mode==="heat"?"#f2a53a":"#e9ecee",700)+tx(60,58,"tap to change mode",8,"middle","var(--muted)",500)},
  info:"A switch for 24 V. Cool closes R to Y (compressor contactor) and R to G (blower). Heat closes R to W. Fan closes R to G. C is common, for power-hungry thermostats."},
 contactor:{name:"Contactor (24 V coil, 2-pole)",cat:"Controls",w:100,h:120,terms:[["L1",25,0,"L1"],["L2",75,0,"L2"],["T1",25,120,"T1"],["T2",75,120,"T2"],["A1",0,60,"coil"],["A2",100,60,"coil"]],init:()=>({in:false,burned:false,welded:false}),
  elems(p,m){const e=[];if(!p.st.burned)e.push({a:"A1",b:"A2",r:m==="ohm"?12:40,rated:24,coil:true});if(p.st.in||p.st.welded)e.push(["L1","T1",SW,"w"],["L2","T2",SW,"w"]);return e},
  pull(p,v){return !p.st.burned&&Math.abs(v)>=18},
  draw(p){const i=p.st.in||p.st.welded;return rect(0,0,100,120,"#e9ecee")+`<rect x="30" y="${i?46:38}" width="40" height="14" fill="#5b666d"/>`+`<line x1="25" y1="10" x2="25" y2="40" stroke="#9a6f1f" stroke-width="3"/><line x1="75" y1="10" x2="75" y2="40" stroke="#9a6f1f" stroke-width="3"/><line x1="25" y1="${i?80:88}" x2="25" y2="110" stroke="#9a6f1f" stroke-width="3"/><line x1="75" y1="${i?80:88}" x2="75" y2="110" stroke="#9a6f1f" stroke-width="3"/><rect x="18" y="${i?62:70}" width="64" height="10" fill="${i?"#c87f4f":"#9aa1a8"}"/>`+`<rect x="34" y="90" width="32" height="16" rx="3" fill="#2f3337"/>`+tx(50,102,"COIL",8,"middle",p.st.burned?"var(--bad)":i?"#6fdc8c":"#e9ecee")+(p.st.burned?tx(50,30,"COIL BURNED",9,"middle","var(--bad)",700):"")},
  info:"A heavy-duty relay. 24 V on the coil (A1, A2) pulls the contacts in, connecting L1 to T1 and L2 to T2 to run the compressor and fan."},
 relay:{name:"Relay (24 V coil, SPDT)",cat:"Controls",w:90,h:90,terms:[["A1",0,25,"coil"],["A2",0,65,"coil"],["COM",90,45,"COM"],["NO",90,15,"NO"],["NC",90,75,"NC"]],init:()=>({in:false,burned:false}),
  elems(p,m){const e=[];if(!p.st.burned)e.push({a:"A1",b:"A2",r:m==="ohm"?70:150,rated:24,coil:true});e.push(p.st.in?["COM","NO",SW,"w"]:["COM","NC",SW,"w"]);return e},
  pull(p,v){return !p.st.burned&&Math.abs(v)>=18},
  draw(p){const i=p.st.in;return rect(0,0,90,90,"#e9ecee")+`<rect x="10" y="20" width="26" height="50" rx="3" fill="#2f3337"/>`+tx(23,49,"COIL",7,"middle",p.st.burned?"var(--bad)":i?"#6fdc8c":"#e9ecee")+`<circle cx="74" cy="45" r="3" fill="#9a6f1f"/><circle cx="80" cy="15" r="3" fill="#9a6f1f"/><circle cx="80" cy="75" r="3" fill="#9a6f1f"/><line x1="74" y1="45" x2="${i?80:80}" y2="${i?18:72}" stroke="#9a6f1f" stroke-width="3"/>`+tx(62,15,"NO",7)+tx(62,82,"NC",7)},
  info:"A small relay. Coil off: COM connects to NC. Coil on: COM connects to NO."},
 hps:{name:"High pressure switch (NC)",cat:"Switches",w:70,h:60,terms:[["1",15,60,"1"],["2",55,60,"2"]],init:()=>({open:false}),
  click(p){p.st.open=!p.st.open;say(p.st.open?"High pressure switch tripped open (simulated high head pressure).":"High pressure switch reset (closed).")},
  elems(p){return p.st.open?[]:[["1","2",SW,"w"]]},
  draw(p){return rect(5,0,60,46,"#e9ecee",6)+tx(35,18,"HPS",11,"middle","#d23a26")+tx(35,34,p.st.open?"OPEN":"CLOSED",9,"middle",p.st.open?"var(--bad)":"var(--ok)")},
  info:"Normally closed. Opens on high discharge pressure. Wired in series with the contactor coil. Tap to simulate a trip."},
 lps:{name:"Low pressure switch (NC)",cat:"Switches",w:70,h:60,terms:[["1",15,60,"1"],["2",55,60,"2"]],init:()=>({open:false}),
  click(p){p.st.open=!p.st.open;say(p.st.open?"Low pressure switch opened (simulated low suction).":"Low pressure switch closed.")},
  elems(p){return p.st.open?[]:[["1","2",SW,"w"]]},
  draw(p){return rect(5,0,60,46,"#e9ecee",6)+tx(35,18,"LPS",11,"middle","#2f6fd6")+tx(35,34,p.st.open?"OPEN":"CLOSED",9,"middle",p.st.open?"var(--bad)":"var(--ok)")},
  info:"Closed while there's enough suction pressure. Opens on loss of charge. Wired in series with the contactor coil."},
 tsw:{name:"Temperature switch (closes on rise)",cat:"Switches",w:70,h:60,terms:[["1",15,60,"1"],["2",55,60,"2"]],init:()=>({closed:false}),
  click(p){p.st.closed=!p.st.closed;say(p.st.closed?"Temperature switch closed (temperature rose past setpoint).":"Temperature switch open.")},
  elems(p){return p.st.closed?[["1","2",SW,"w"]]:[]},
  draw(p){return rect(5,0,60,46,"#e9ecee",23)+`<circle cx="35" cy="20" r="9" fill="#9aa1a8"/>`+tx(35,40,p.st.closed?"CLOSED":"OPEN",8,"middle",p.st.closed?"var(--ok)":"var(--muted)")},
  info:"A snap disc. This one is normally open and closes when its temperature rises past the setpoint (like a fan control). Tap to change temperature."},
 pbno:{name:"Pushbutton (NO)",cat:"Switches",w:60,h:60,terms:[["1",10,60,"1"],["2",50,60,"2"]],init:()=>({on:false}),
  click(p){p.st.on=!p.st.on;say(`Pushbutton ${p.st.on?"held":"released"}.`)},
  elems(p){return p.st.on?[["1","2",SW,"w"]]:[]},
  draw(p){return rect(5,5,50,44,"#e9ecee")+`<circle cx="30" cy="${p.st.on?29:25}" r="12" fill="var(--ok)" stroke="${ED}"/>`},
  info:"Normally open momentary button. Tap to hold it in, tap again to release."},
 pbnc:{name:"Pushbutton (NC, stop)",cat:"Switches",w:60,h:60,terms:[["1",10,60,"1"],["2",50,60,"2"]],init:()=>({on:false}),
  click(p){p.st.on=!p.st.on;say(`Stop button ${p.st.on?"pressed (open)":"released (closed)"}.`)},
  elems(p){return p.st.on?[]:[["1","2",SW,"w"]]},
  draw(p){return rect(5,5,50,44,"#e9ecee")+`<circle cx="30" cy="${p.st.on?29:25}" r="12" fill="var(--bad)" stroke="${ED}"/>`},
  info:"Normally closed button. Pressing it opens the circuit."},
 toggle:{name:"Toggle switch (SPST)",cat:"Switches",w:60,h:60,terms:[["1",10,60,"1"],["2",50,60,"2"]],init:()=>({on:false}),
  click(p){p.st.on=!p.st.on;say(`Toggle ${p.st.on?"on":"off"}.`)},
  elems(p){return p.st.on?[["1","2",SW,"w"]]:[]},
  draw(p){return rect(5,5,50,44,"#e9ecee")+`<line x1="30" y1="30" x2="${p.st.on?42:18}" y2="12" stroke="#2f3337" stroke-width="5" stroke-linecap="round"/>`+tx(30,44,p.st.on?"ON":"OFF",8)},
  info:"A plain on/off switch."},
 comp:{name:"Compressor",cat:"Loads",w:100,h:120,terms:[["C",20,120,"C"],["S",50,120,"S"],["R",80,120,"R"]],init:()=>({run:false,hum:0,ol:false,burned:false}),
  elems(p,m){if(m==="ohm")return p.st.burned?[["C","R",0.05,"load"],["C","S",0.05,"load"]]:p.st.ol?[["S","R",4.5,"load"]]:[["C","R",1.1,"load"],["C","S",3.4,"load"]];
   if(p.st.ol||p.st.burned)return [];return [{a:"C",b:"R",r:p.st.run?20:240/60,rated:240,motor:"comp"},{a:"C",b:"S",r:400}]},
  draw(p){const s=p.st;return `<g ${s.run?'class="vib"':""}>`+`<path d="M8 112 V36 Q8 6 50 6 Q92 6 92 36 V112 Z" fill="#30363b" stroke="${ED}"/>`+tx(50,48,"COMPRESSOR",11,"middle","#e9ecee")+tx(50,68,s.burned?"BURNED":s.ol?"OVERLOAD":s.run?"RUNNING":s.hum>0?"HUMMING":"OFF",11,"middle",s.burned||s.ol?"#ff8a7a":s.run?"#6fdc8c":s.hum>0?"#f2c84a":"#c4cacf")+`</g>`},
  info:"Hermetic compressor. C to R is the run winding, C to S the start winding, and S to R reads the sum of both. Needs the run capacitor between S and R to start, otherwise it hums on locked-rotor current until the internal overload opens."},
 fan:{name:"Condenser fan motor (PSC)",cat:"Loads",w:100,h:100,terms:[["COM",20,100,"COM"],["RUN",50,100,"RUN"],["ST",80,100,"START"]],init:()=>({run:false,hum:0,ang:0}),
  elems(p,m){if(m==="ohm")return [["COM","RUN",12,"load"],["COM","ST",22,"load"]];return [{a:"COM",b:"RUN",r:p.st.run?200:240/3,rated:240,motor:"fan"},{a:"COM",b:"ST",r:5000}]},
  draw(p){return `<circle cx="50" cy="44" r="40" fill="#3a3f44" stroke="${ED}"/><g class="spin" data-spin="${p.id}" transform="rotate(${p.st.ang||0} 50 44)">${[0,1,2].map(i=>`<ellipse cx="50" cy="22" rx="8" ry="20" fill="#9aa3aa" transform="rotate(${i*120} 50 44)"/>`).join("")}</g><circle cx="50" cy="44" r="7" fill="#22262a"/>`+tx(50,96,p.st.run?"RUNNING":p.st.hum>0?"HUMMING":"",8,"middle",p.st.run?"var(--ok)":"var(--warn)")},
  info:"Permanent split capacitor motor. COM to RUN is the run winding; the START winding goes through the FAN side of the run capacitor."},
 cap:{name:"Dual run capacitor 45/5 µF",cat:"Loads",w:70,h:100,terms:[["C",35,100,"C"],["HERM",10,100,"HERM"],["FAN",60,100,"FAN"]],init:()=>({bad:false}),
  elems(p){return [{a:"C",b:"HERM",r:1e7,cap:p.st.bad?0:45},{a:"C",b:"FAN",r:1e7,cap:p.st.bad?0:5}]},
  click(p){p.st.bad=!p.st.bad;say(p.st.bad?"Capacitor failed (open). Motors won't start.":"Capacitor replaced.")},
  draw(p){return rect(5,0,60,86,"#b9c0c6",14)+(p.st.bad?`<rect x="5" y="-6" width="60" height="10" rx="5" fill="#b9c0c6" stroke="var(--bad)"/>`:"")+tx(35,40,"45/5",12)+tx(35,54,"µF 440V",8,"middle","var(--muted)")+tx(35,72,p.st.bad?"FAILED":"tap to fail",7,"middle",p.st.bad?"var(--bad)":"var(--muted)",500)},
  info:"Two capacitors in one can: C to HERM (45 µF) for the compressor, C to FAN (5 µF) for the fan. C is common. It gives the start windings the phase shift they need. Tap to make it fail."},
 lamp24:{name:"Pilot light 24 V",cat:"Loads",w:50,h:60,terms:[["1",10,60,"1"],["2",40,60,"2"]],init:()=>({burned:false,v:0}),
  elems(p,m){return p.st.burned?[]:[{a:"1",b:"2",r:m==="ohm"?60:240,rated:24,lamp:1}]},
  draw(p){const on=p.st.v>12&&!p.st.burned;return `<circle cx="25" cy="24" r="18" fill="${on?"#ffd84a":"#8d979c"}" stroke="${ED}" ${on?'filter="url(#glow)"':""}/>`+tx(25,52,p.st.burned?"BURNED":"24V",8,"middle",p.st.burned?"var(--bad)":"var(--muted)")},
  info:"Indicator lamp rated 24 V. Put 240 V on it and it burns out."},
 lamp120:{name:"Pilot light 120 V",cat:"Loads",w:50,h:60,terms:[["1",10,60,"1"],["2",40,60,"2"]],init:()=>({burned:false,v:0}),
  elems(p,m){return p.st.burned?[]:[{a:"1",b:"2",r:m==="ohm"?400:2400,rated:120,lamp:1}]},
  draw(p){const on=p.st.v>70&&!p.st.burned;return `<circle cx="25" cy="24" r="18" fill="${on?"#ff9a4a":"#8d979c"}" stroke="${ED}" ${on?'filter="url(#glow)"':""}/>`+tx(25,52,p.st.burned?"BURNED":"120V",8,"middle",p.st.burned?"var(--bad)":"var(--muted)")},
  info:"Indicator lamp rated 120 V: wire it from L1 or L2 to N. On 240 V (L1 to L2) it burns out."},
 heater:{name:"Heater element 240 V 5 kW",cat:"Loads",w:120,h:60,terms:[["1",10,60,"1"],["2",110,60,"2"]],init:()=>({v:0}),
  elems(p,m){return [{a:"1",b:"2",r:m==="ohm"?11:11.5,rated:240,heat:1}]},
  draw(p){const g=clamp(p.st.v/240,0,1);return rect(0,6,120,40,"#d8dcdf")+`<path d="M10 26 ${Array.from({length:12},(_,i)=>`L${16+i*8} ${i%2?16:36}`).join(" ")} L110 26" stroke="${g>0.3?`rgb(${Math.round(150+105*g)},${Math.round(90*g)},20)`:"#7a8288"}" stroke-width="3" fill="none"/>`},
  info:"Resistance heater: about 11.5 Ω, 21 A at 240 V. Glows when powered."},
 tb:{name:"Splice / terminal block",cat:"Power",w:80,h:24,terms:[["a",10,12,""],["b",30,12,""],["c",50,12,""],["d",70,12,""]],init:()=>({}),
  elems(){return [["a","b",0.0005,"w"],["b","c",0.0005,"w"],["c","d",0.0005,"w"]]},
  draw(){return rect(0,0,80,24,"#c9cfd4",3)},info:"Four tied terminals, for joining several wires."},
 gnd:{name:"Ground lug",cat:"Power",w:40,h:40,terms:[["G",20,0,"G"]],init:()=>({}),
  elems(){return [{a:"G",b:"#0",r:0.001}]},
  draw(){return `<path d="M20 4 V18 M6 18 H34 M11 25 H29 M16 32 H24" stroke="var(--ok)" stroke-width="3"/>`},info:"Equipment ground. Connected to the panel ground. Any hot wire touching it is a ground fault."}
};
const CATS=["Power","Controls","Switches","Loads"];

/* ---------- state ---------- */
let parts=[],wires=[],nid=1,sel=null,pending=null,wireColor="#1d2327",live={},hist=[];
let meter={on:false,mode:"V",red:null,black:null,clampId:null,rp:{x:0,y:0},bp:{x:0,y:0}};
const COLORS=[["#1d2327","Black"],["#d23a26","Red"],["#f4f4f0","White"],["#2f9a4a","Green"],["#2f6fd6","Blue"],["#e8c33a","Yellow"],["#e0762a","Orange"],["#7a4fb0","Purple"],["#8a5a2b","Brown"]];
function snapshot(){hist.push(JSON.stringify({parts,wires,nid}));if(hist.length>60)hist.shift()}
function save(){try{localStorage.setItem("wt-board",JSON.stringify({parts,wires,nid}))}catch(e){}}
function addPart(type,x,y){const t=T[type];const n=parts.filter(p=>p.type===type).length+1;const p={id:"p"+(nid++),type,x:Math.round(x/10)*10,y:Math.round(y/10)*10,st:t.init(),label:t.name.split(" (")[0]+(n>1?" "+n:"")};parts.push(p);return p}
const tpos=(p,tid)=>{const t=T[p.type].terms.find(t=>t[0]===tid);return {x:p.x+t[1],y:p.y+t[2]}};
const partById=id=>parts.find(p=>p.id===id);

/* ---------- solver (nodal analysis, AC treated as signed RMS on one phase) ---------- */
function build(mode){
 const key=(pid,t)=>pid+":"+t;const idx=new Map([["#0",0]]);const node=k=>{if(!idx.has(k))idx.set(k,idx.size);return idx.get(k)};
 parts.forEach(p=>T[p.type].terms.forEach(t=>node(key(p.id,t[0]))));
 const el=[];
 parts.forEach(p=>{T[p.type].elems(p,mode).forEach(e=>{if(Array.isArray(e))e={a:e[0],b:e[1],r:e[2],kind:e[3]};
  const a=e.a==="#0"?0:node(key(p.id,e.a)),b=e.b==="#0"?0:node(key(p.id,e.b));el.push(Object.assign({},e,{na:a,nb:b,part:p}))})});
 // the supply's G is the reference
 const sup=parts.find(p=>p.type==="supply");if(sup)el.push({na:node(key(sup.id,"G")),nb:0,r:0.0001,kind:"w",part:sup,ref:1});
 wires.forEach(w=>{const pa=partById(w.a.p),pb=partById(w.b.p);if(!pa||!pb)return;el.push({na:node(key(w.a.p,w.a.t)),nb:node(key(w.b.p,w.b.t)),r:0.003,wire:w})});
 return {idx,el,n:idx.size}}
function solveNet(net,inject){const n=net.n;const G=Array.from({length:n},()=>new Float64Array(n)),I=new Float64Array(n);
 const stamp=(a,b,g)=>{G[a][a]+=g;G[b][b]+=g;G[a][b]-=g;G[b][a]-=g};
 for(let i=1;i<n;i++)G[i][i]+=1e-9;
 net.el.forEach(e=>{if(e.r==null)return;const g=1/e.r;stamp(e.na,e.nb,g);const v=e.src!=null?e.src:e.xfmr?e.xv||0:null;if(v!=null){I[e.na]+=v*g;I[e.nb]-=v*g}});
 if(inject){I[inject[0]]+=1;I[inject[1]]-=1}
 // solve without row 0 (reference)
 const m=n-1;const A=[];for(let i=0;i<m;i++){A.push(Array.from(G[i+1].slice(1)));A[i].push(I[i+1])}
 for(let c=0;c<m;c++){let piv=c;for(let r=c+1;r<m;r++)if(Math.abs(A[r][c])>Math.abs(A[piv][c]))piv=r;[A[c],A[piv]]=[A[piv],A[c]];const d=A[c][c];if(Math.abs(d)<1e-15)continue;
  for(let r=0;r<m;r++){if(r===c)continue;const f=A[r][c]/d;if(f===0)continue;for(let k=c;k<=m;k++)A[r][k]-=f*A[c][k]}}
 const V=new Float64Array(n);for(let i=0;i<m;i++)V[i+1]=Math.abs(A[i][i])>1e-15?A[i][m]/A[i][i]:0;return V}
const vOf=(V,e)=>V[e.na]-V[e.nb];
const iOf=(V,e)=>{const v=e.src!=null?e.src:e.xfmr?e.xv||0:0;return (V[e.na]-V[e.nb]-(e.src!=null||e.xfmr?v:0))/e.r};

let lastNet=null,lastV=null,incident=null;
function simulate(dt){
 let net,V;
 for(let it=0;it<8;it++){
  net=build("live");
  // transformer secondary voltage follows its primary
  const prim=new Map();net.el.forEach(e=>{if(e.part&&(e.prim||(e.part.type==="xfmr"&&e.rated===240)))prim.set(e.part.id,e)});
  for(let k=0;k<3;k++){V=solveNet(net);net.el.forEach(e=>{if(e.xfmr){const pe=prim.get(e.part.id);e.xv=pe?vOf(V,pe)/(T[e.part.type].ratio||10):0}})}
  V=solveNet(net);
  // dead shorts: blow a fuse in the path, otherwise arc flash
 const big=net.el.filter(e=>Math.abs(iOf(V,e))>150&&!e.ref);
 if(big.length){
  const fz=big.filter(e=>e.fuse);
  if(fz.length){fz.forEach(e=>{e.part.st.blown=true;say(`${e.part.label} blew (${Math.round(Math.abs(iOf(V,e)))} A through it).`,"b")});pop(fz.map(e=>e.part));return simulate(0)}
  const wiresHit=big.filter(e=>e.wire).map(e=>e.wire.id);const sup=parts.find(p=>p.type==="supply");
  const toG=big.some(e=>e.part&&e.part.type==="gnd")||big.some(e=>e.ref);
  const amps=Math.round(Math.max(...big.map(e=>Math.abs(iOf(V,e)))));
  if(sup){sup.st.on=false;sup.st.tripped=true}
  arcFlash(wiresHit,amps,describeShort(big));return simulate(0)}
  let changed=false;
  net.el.forEach(e=>{if(e.coil){const t=T[e.part.type];const want=t.pull(e.part,vOf(V,e));if(want!==e.part.st.in){e.part.st.in=want;changed=true;say(`${e.part.label} ${want?"pulled in":"dropped out"}.`)}}});
  parts.forEach(p=>{if(T[p.type].pull&&!net.el.some(e=>e.coil&&e.part===p)&&p.st.in){p.st.in=false;changed=true}});
  if(!changed)break}
 // fuses: instant at 3x rating, after a delay above rating
 for(const e of net.el){if(e.fuse){const i=Math.abs(iOf(V,e));const p=e.part;if(i>e.fuse*3){p.st.blown=true;pop([p]);say(`${p.label} blew (${i.toFixed(i<10?1:0)} A on a ${e.fuse} A fuse).`,"b");return simulate(0)}
  if(i>e.fuse){p.st.over=(p.st.over||0)+dt;if(p.st.over>(e.fuse>=10?10:2)){p.st.blown=true;p.st.over=0;pop([p]);say(`${p.label} blew on overload (${i.toFixed(1)} A for several seconds).`,"b");return simulate(0)}}else p.st.over=0}}
 // 24 V secondary overload or short
 for(const e of net.el){if(e.xfmr){const i=Math.abs(iOf(V,e));if(i>2.6){e.part.st.burned=true;smoke(e.part,`Transformer burned: ${i.toFixed(0)} A on a 40 VA (1.7 A) secondary.`,describe24(net,V));return simulate(0)}}}
 // overvoltage burns
 for(const e of net.el){if(e.rated&&!e.part.st.burned){const v=Math.abs(vOf(V,e));if(v>e.rated*1.6&&(e.coil||e.lamp||e.low||e.m120||(e.heat&&e.rated<240))){
   if(e.part.type==="tstat"){smoke(e.part,`Thermostat fried: ${Math.round(v)} V across R and C. Thermostats are 24 V devices.`,"High voltage reached the thermostat wiring. Check that R and C come from the transformer secondary, not from L1 or L2.");e.part.st.mode="off";return simulate(0)}
   e.part.st.burned=true;if(e.part.st.in)e.part.st.in=false;
   smoke(e.part,`${e.part.label} burned out: ${Math.round(v)} V across a part rated ${e.rated} V.`,e.rated===24?"A 24 V coil or lamp was wired to line voltage. Control coils get their power from the transformer secondary (R and C).":`A 120 V ${e.part.type==="lamp120"?"lamp":"part"} was wired across L1 and L2 (240 V). Wire 120 V loads from one hot to neutral.`);return simulate(0)}}}
 // loads: lamps, heaters, motors
 parts.forEach(p=>{if("v" in p.st)p.st.v=0});
 net.el.forEach(e=>{const p=e.part;if(e.lamp||e.heat||e.m120)p.st.v=Math.abs(vOf(V,e))});
 parts.forEach(p=>{if(T[p.type].elems===undefined)return;if(p.st.run!==undefined&&(p.type==="blower"||p.type==="inducer")){const was=p.st.run;p.st.run=p.st.v>=95&&!p.st.burned;if(was!==p.st.run)say(`${p.label} ${p.st.run?"running":"stopped"}.`)}});
 parts.forEach(p=>{if(p.type==="comp"||p.type==="fan"){const t=p.type==="comp";const run=net.el.find(e=>e.part===p&&e.motor);const v=run?Math.abs(vOf(V,run)):0;
  const capOk=hasCap(net,p,t?"HERM":"FAN",t?"S":"ST",t?"R":"RUN");
  const was=p.st.run;
  if(v>=200&&capOk){p.st.run=true;p.st.hum=0}else if(v>=200){p.st.run=false;p.st.hum+=dt;if(p.st.hum>0&&p.st.hum-dt<=0)say(`${p.label} hums but won't start: ${capOk===null?"no capacitor on the start winding":capWired(net,p,t)?"the run capacitor is open (failed)":"capacitor not wired between start and run"}.`,"b");
   if(t&&p.st.hum>8&&!p.st.ol){p.st.ol=true;p.st.olT=0;say("Compressor internal overload opened (locked rotor).","b")}}
  else{p.st.run=false;p.st.hum=0;if(v>30&&v<200&&!p.st.lowLog){p.st.lowLog=1;say(`${p.label} sees only ${Math.round(v)} V. Not enough to run.`,"w")}}
  if(v<30)p.st.lowLog=0;
  if(was!==p.st.run)say(`${p.label} ${p.st.run?"running":"stopped"}.`);
  if(t&&p.st.ol){p.st.olT=(p.st.olT||0)+dt;if(p.st.olT>60){p.st.ol=false;p.st.hum=0;say("Compressor overload reset.")}}}});
 // per-part logic (furnace board, pressure switches, pump-down control)
 parts.forEach(p=>{const t=T[p.type];if(t.step)t.step(p,(a,b)=>{const x=net.idx.get(p.id+":"+a),y=net.idx.get(p.id+":"+b);return x==null||y==null?0:Math.abs(V[x]-V[y])},dt)});
 lastNet=net;lastV=V}
function capWired(net,p,t){const sav=parts.filter(x=>x.type==="cap").map(x=>[x,x.st.bad]);sav.forEach(([x])=>x.st.bad=false);const n2=build("live");const r=hasCap(n2,p,t?"HERM":"FAN",t?"S":"ST",t?"R":"RUN");sav.forEach(([x,b])=>x.st.bad=b);return r}
function hasCap(net,motor,capT,sT,rT){
 const nS=net.idx.get(motor.id+":"+sT),nR=net.idx.get(motor.id+":"+rT);
 const caps=net.el.filter(e=>e.cap!=null&&e.r>1e6&&(e.b===capT));if(!caps.length&&!parts.some(p=>p.type==="cap"))return null;
 // a capacitor counts if its terminals land on the motor's S and R nets (through zero-ohm paths)
 const same=(a,b)=>zeroPath(net,a,b);
 return caps.some(e=>e.cap>0&&((same(e.nb,nS)&&same(e.na,nR))||(same(e.na,nS)&&same(e.nb,nR))))}
function zeroPath(net,a,b){if(a===b)return true;const seen=new Set([a]),q=[a];while(q.length){const x=q.pop();for(const e of net.el){if(e.r==null||e.r>0.01||e.src!=null||e.xfmr)continue;const y=e.na===x?e.nb:e.nb===x?e.na:-1;if(y<0||seen.has(y))continue;if(y===b)return true;seen.add(y);q.push(y)}}return false}
function describeShort(big){const names=[...new Set(big.filter(e=>!e.wire&&e.part&&e.part.type!=="supply").map(e=>e.part.label))];
 const ws=big.filter(e=>e.wire).map(e=>wireName(e.wire));
 return `The current path: ${ws.length?ws.join("; "):"(no wire)"}${names.length?` through ${names.join(", ")}`:""}. Nothing with resistance was in the path, so the current was limited only by the supply.`}
function describe24(net,V){const hot=net.el.filter(e=>Math.abs(iOf(V,e))>2&&e.wire).map(e=>wireName(e.wire));return `The 24 V circuit had almost no resistance in it${hot.length?`: ${hot.join("; ")}`:""}. R went straight to C without a coil in between, so the transformer was shorted. A 3 A fuse in the R wire would have blown instead.`}
function wireName(w){const pa=partById(w.a.p),pb=partById(w.b.p);return `${pa?pa.label:"?"} ${tl(pa,w.a.t)} to ${pb?pb.label:"?"} ${tl(pb,w.b.t)}`}
const tl=(p,t)=>{if(!p)return t;const x=T[p.type].terms.find(z=>z[0]===t);return x&&x[3]?x[3]:t};

/* ---------- meter ---------- */
function readMeter(){if(!meter.on)return "";const m=meter.mode;
 if(m==="A"){if(!meter.clampId)return "Clamp: tap a wire";if(!lastNet)return "0.0 A";const e=lastNet.el.find(e=>e.wire&&e.wire.id===meter.clampId);if(!e)return "Clamp: tap a wire";return `${Math.abs(iOf(lastV,e)).toFixed(e&&Math.abs(iOf(lastV,e))<10?2:1)} A`}
 if(!meter.red||!meter.black)return "Place both probes";
 const net=m==="V"?lastNet:build("ohm");if(!net)return "--";
 const a=net.idx.get(meter.red.p+":"+meter.red.t),b=net.idx.get(meter.black.p+":"+meter.black.t);if(a==null||b==null)return "--";
 if(m==="V"){const v=Math.abs(lastV[a]-lastV[b]);return `${v<1?v.toFixed(2):v<100?v.toFixed(1):Math.round(v)} V AC`}
 if(m==="F"){const pa=partById(meter.red.p),pb=partById(meter.black.p);if(pa===pb&&pa.type==="cap"){const ts=[meter.red.t,meter.black.t].sort().join();if(pa.st.bad)return "0.0 µF (open)";if(ts==="C,HERM")return "45.2 µF";if(ts==="C,FAN")return "5.0 µF";if(ts==="FAN,HERM")return "4.5 µF"}return "--- µF"}
 // ohms: refuse on a live circuit
 if(lastV&&lastNet){const ra=lastNet.idx.get(meter.red.p+":"+meter.red.t),rb=lastNet.idx.get(meter.black.p+":"+meter.black.t);if(Math.abs(lastV[ra])>2||Math.abs(lastV[rb])>2||Math.abs(lastV[ra]-lastV[rb])>2)return "LIVE: no Ω"}
 const V=solveNet(net,[a,b]);const r=V[a]-V[b];return r>2e6?"OL":r<1?`${r.toFixed(2)} Ω`:r<1000?`${r.toFixed(1)} Ω`:`${(r/1000).toFixed(1)} kΩ`}

/* ---------- drawing ---------- */
const svg=$("board");
function render(){
 const sp=svg.querySelector("#parts"),sw=svg.querySelector("#wires"),st=svg.querySelector("#terms");
 sp.innerHTML=parts.map(p=>`<g class="wp${sel===p.id?" sel":""}" data-id="${p.id}" transform="translate(${p.x} ${p.y})">${T[p.type].draw(p)}<text x="0" y="${T[p.type].terms.some(t=>t[2]===0)?-20:-6}" font-size="10" font-family="var(--display)" font-weight="700" fill="var(--muted)">${esc(p.label.toUpperCase())}</text></g>`).join("");
 sw.innerHTML=wires.map(w=>{const r=routePts(w);if(!r)return "";const d=wireD(r);
  const hot=incident&&incident.includes(w.id);return `<path d="${d}" class="wire${sel===w.id?" sel":""}${hot?" hot":""}${meter.clampId===w.id?" clamp":""}" data-w="${w.id}" stroke="${w.c}"/>`}).join("");
 st.innerHTML=parts.map(p=>T[p.type].terms.map(t=>{const x=p.x+t[1],y=p.y+t[2];const pend=pending&&pending.p===p.id&&pending.t===t[0];return `<g class="term${pend?" pend":""}" data-p="${p.id}" data-t="${t[0]}"><circle cx="${x}" cy="${y}" r="6"/>${t[3]?`<text x="${x}" y="${y+(t[2]===0?-9:t[2]>=T[p.type].h?17:-9)}" text-anchor="middle">${t[3]}</text>`:""}</g>`}).join("")).join("");
 renderHandles();renderMeter()}
/* wire route: terminal, short stub, bend points, stub, terminal. Bends are draggable when the wire is selected. */
function routeEnds(w){const pa=partById(w.a.p),pb=partById(w.b.p);if(!pa||!pb)return null;const a=tpos(pa,w.a.t),b=tpos(pb,w.b.t);
 const stub=(p,q)=>{const t=T[p.type];const lx=q.x-p.x,ly=q.y-p.y;return ly<=2?{x:q.x,y:q.y-14}:ly>=t.h-2?{x:q.x,y:q.y+14}:lx<=2?{x:q.x-14,y:q.y}:lx>=t.w-2?{x:q.x+14,y:q.y}:{x:q.x,y:q.y+14}};
 return {a,b,sa:stub(pa,a),sb:stub(pb,b)}}
function defPts(e){return []}
/* smooth wire: straight out of each terminal, then a curve through the bend points (Catmull-Rom), with a little sag like real wire */
function wireD(r){const n=r.length,f=v=>Math.round(v*10)/10,a=r[0],sa=r[1],sb=r[n-2],b=r[n-1];let d=`M${f(a.x)} ${f(a.y)} L${f(sa.x)} ${f(sa.y)}`;
 if(n===4){const L=Math.hypot(sb.x-sa.x,sb.y-sa.y),k=Math.max(24,L*.38),sag=Math.min(60,L*.18);const ua={x:(sa.x-a.x)/14,y:(sa.y-a.y)/14},ub={x:(sb.x-b.x)/14,y:(sb.y-b.y)/14};
  d+=` C${f(sa.x+ua.x*k)} ${f(sa.y+ua.y*k+sag)} ${f(sb.x+ub.x*k)} ${f(sb.y+ub.y*k+sag)} ${f(sb.x)} ${f(sb.y)}`}
 else{const P=r.slice(1,n-1),t=.5;const ext=(p,q)=>({x:2*p.x-q.x,y:2*p.y-q.y});const Q=[{x:2*sa.x-a.x,y:2*sa.y-a.y},...P,{x:2*sb.x-b.x,y:2*sb.y-b.y}];
  for(let i=1;i<Q.length-2;i++){const p0=Q[i-1],p1=Q[i],p2=Q[i+1],p3=Q[i+2];
   d+=` C${f(p1.x+(p2.x-p0.x)*t/3)} ${f(p1.y+(p2.y-p0.y)*t/3)} ${f(p2.x-(p3.x-p1.x)*t/3)} ${f(p2.y-(p3.y-p1.y)*t/3)} ${f(p2.x)} ${f(p2.y)}`}}
 return d+` L${f(b.x)} ${f(b.y)}`}
function routePts(w){const e=routeEnds(w);if(!e)return null;return [e.a,e.sa,...(w.pts&&w.pts.length?w.pts:defPts(e)),e.sb,e.b]}
function renderHandles(){const g=svg.querySelector("#wh");if(!g)return;const w=sel&&wires.find(x=>x.id===sel);$("resetRoute").hidden=!w;if(!w){g.innerHTML="";return}
 const r=routePts(w);if(!r){g.innerHTML="";return}let h="";
 for(let k=1;k<r.length-2;k++){const m={x:(r[k].x+r[k+1].x)/2,y:(r[k].y+r[k+1].y)/2};h+=`<circle class="wadd" data-w="${w.id}" data-i="${k-1}" cx="${m.x}" cy="${m.y}" r="6"><title>Drag to add a bend</title></circle>`}
 for(let i=2;i<r.length-2;i++)h+=`<circle class="wh" data-w="${w.id}" data-i="${i-2}" cx="${r[i].x}" cy="${r[i].y}" r="8"><title>Drag to move this bend</title></circle>`;
 g.innerHTML=h}
function renderMeter(){const g=svg.querySelector("#probes");$("meter").hidden=!meter.on;if(!meter.on){g.innerHTML="";return}
 const m=meter.mode;const show=m!=="A";["red","black"].forEach(k=>{const at=meter[k];const p=at&&partById(at.p);if(p)meter[k==="red"?"rp":"bp"]=tpos(p,at.t);else meter[k]=null});
 const pr=(c,pos,id)=>`<g class="probe" data-probe="${id}"><circle cx="${pos.x}" cy="${pos.y}" r="11" fill="${c}" stroke="#111" stroke-width="2"/><text x="${pos.x}" y="${pos.y+4}" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">${id==="red"?"+":"–"}</text></g>`;
 g.innerHTML=show?pr("#d23a26",meter.rp,"red")+pr("#222",meter.bp,"black"):"";
 $("mRead").textContent=readMeter();document.querySelectorAll("[data-mm]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mm===m))}
function renderPalette(){$("palette").innerHTML=CATS.map(c=>`<h3>${c}</h3><div class="pal">${Object.entries(T).filter(([k,t])=>t.cat===c).map(([k,t])=>`<button class="palItem" data-add="${k}" title="${esc(t.info)}">${esc(t.name)}</button>`).join("")}</div>`).join("");
 $("colors").innerHTML=COLORS.map(([c,n])=>`<button class="sw${c===wireColor?" on":""}" data-color="${c}" title="${n}" aria-label="${n} wire" style="background:${c}"></button>`).join("")}
function say(msg,c=""){const d=document.createElement("div");d.innerHTML=`<span class="${c}">${esc(msg)}</span>`;const L=$("log");L.prepend(d);while(L.children.length>120)L.lastChild.remove()}
function svgPt(ev){const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())}

/* ---------- arc flash, smoke ---------- */
function centerOf(ids){const pts=[];wires.filter(w=>ids.includes(w.id)).forEach(w=>{const a=tpos(partById(w.a.p),w.a.t),b=tpos(partById(w.b.p),w.b.t);pts.push(a,b)});if(!pts.length)return {x:400,y:300};return {x:pts.reduce((s,p)=>s+p.x,0)/pts.length,y:pts.reduce((s,p)=>s+p.y,0)/pts.length}}
function flashAt(x,y,big){const g=svg.querySelector("#fx");const id="f"+Math.random().toString(36).slice(2);
 g.insertAdjacentHTML("beforeend",`<g id="${id}"><circle cx="${x}" cy="${y}" r="${big?140:40}" fill="url(#arc)" class="flash"/>${Array.from({length:big?14:6},(_,i)=>{const a=i/(big?14:6)*Math.PI*2,r=big?90:30;return `<path d="M${x} ${y} l${(Math.cos(a)*r*0.5).toFixed(1)} ${(Math.sin(a)*r*0.5).toFixed(1)} l${(Math.cos(a+0.4)*r*0.3).toFixed(1)} ${(Math.sin(a+0.4)*r*0.3).toFixed(1)} l${(Math.cos(a)*r*0.4).toFixed(1)} ${(Math.sin(a)*r*0.4).toFixed(1)}" stroke="#bfe6ff" stroke-width="3" fill="none" class="flash"/>`}).join("")}</g>`);
 setTimeout(()=>{const e=$(id);if(e)e.remove()},1400)}
function arcFlash(ids,amps,why){incident=ids;const c=centerOf(ids);flashAt(c.x,c.y,true);const w=$("boardWrap");w.classList.remove("shake");void w.offsetWidth;w.classList.add("shake");
 say(`ARC FLASH: dead short, about ${amps.toLocaleString()} A. Breaker tripped.`,"b");
 showModal("Arc flash: dead short",`<p>${esc(why)}</p><p>The wires in the short are highlighted in red. Fix the wiring, then tap the panel to reset the breaker and turn it back on.</p><p class="note">On real equipment a dead short at 240 V releases an arc hot enough to vaporize copper and cause severe burns. De-energize, lock out, and verify dead with a meter before touching anything.</p>`)}
function smoke(p,title,why){const c={x:p.x+T[p.type].w/2,y:p.y+T[p.type].h/2};flashAt(c.x,c.y,false);
 const g=svg.querySelector("#fx");const id="s"+Math.random().toString(36).slice(2);g.insertAdjacentHTML("beforeend",`<g id="${id}" class="smoke">${[0,1,2].map(i=>`<circle cx="${c.x+i*10-10}" cy="${c.y-10}" r="${10+i*3}" fill="#777" opacity=".6"/>`).join("")}</g>`);setTimeout(()=>{const e=$(id);if(e)e.remove()},2500);
 say(title,"b");showModal(title,`<p>${esc(why)}</p><p>Tap the part and use Replace to swap in a new one after fixing the wiring.</p>`)}
function pop(ps){ps.forEach(p=>{const c={x:p.x+20,y:p.y+40};flashAt(c.x,c.y,false)})}
function showModal(t,b){$("mT").textContent=t;$("mB").innerHTML=b;$("modal").hidden=false}

/* ---------- part sheet ---------- */
function openSheet(p){sel=p.id;const t=T[p.type];
 $("sheetT").textContent=p.label;
 $("sheetB").innerHTML=`<p>${esc(t.info)}</p><p class="note">Terminals: ${t.terms.map(x=>x[3]||x[0]).filter(Boolean).join(", ")}</p>
  <div class="btns">${t.click?`<button class="btn" data-act="click">${p.type==="supply"?"Switch breaker":p.type.startsWith("tstat")?"Change mode":p.type==="psw"?(p.st.blocked?"Clear the vent":"Block the vent"):"Operate"}</button>`:""}
  ${(p.st.burned||p.st.blown||p.st.ol||p.st.bad)?`<button class="btn" data-act="replace">Replace</button>`:""}
  ${p.type==="contactor"?`<button class="btn" data-act="weld">${p.st.welded?"Unweld contacts":"Weld contacts (fault)"}</button>`:""}
  <button class="btn" data-act="rename">Rename</button><button class="btn red" data-act="del">Delete part</button></div>
  <p><a href="${gimg(t.name)}" target="_blank" rel="noopener">Photo search: ${esc(t.name)}</a></p>`;
 $("sheet").hidden=false;render()}

/* ---------- interaction ---------- */
let drag=null;
svg.addEventListener("pointerdown",ev=>{const pr=ev.target.closest(".probe");if(pr){drag={probe:pr.dataset.probe};svg.setPointerCapture(ev.pointerId);ev.preventDefault();return}
 const hd=ev.target.closest(".wh,.wadd");if(hd){const w=wires.find(x=>x.id===hd.dataset.w);if(w){snapshot();const e=routeEnds(w);if(!w.pts||!w.pts.length)w.pts=defPts(e);let i=+hd.dataset.i;
  if(hd.classList.contains("wadd")){const r=routePts(w);const k=i+1;w.pts.splice(i,0,{x:Math.round((r[k].x+r[k+1].x)/2),y:Math.round((r[k].y+r[k+1].y)/2)})}
  drag={wh:w,i};svg.setPointerCapture(ev.pointerId);ev.preventDefault();render()}return}
 const term=ev.target.closest(".term");if(term){termTap(term.dataset.p,term.dataset.t);ev.preventDefault();return}
 const wp=ev.target.closest(".wp");if(wp){const p=partById(wp.dataset.id);const pt=svgPt(ev);drag={part:p,dx:pt.x-p.x,dy:pt.y-p.y,moved:false,start:pt};svg.setPointerCapture(ev.pointerId);ev.preventDefault();return}
 const w=ev.target.closest(".wire");if(w){if(meter.on&&meter.mode==="A"){meter.clampId=w.dataset.w;renderMeter();render();return}sel=w.dataset.w;$("delSel").hidden=false;render();return}
 sel=null;pending=null;$("delSel").hidden=true;render()});
svg.addEventListener("pointermove",ev=>{if(!drag)return;const pt=svgPt(ev);
 if(drag.wh){drag.wh.pts[drag.i]={x:clamp(Math.round(pt.x),0,1500),y:clamp(Math.round(pt.y),0,1000)};render();return}
 if(drag.probe){meter[drag.probe==="red"?"rp":"bp"]={x:pt.x,y:pt.y};meter[drag.probe]=null;renderMeter();return}
 if(Math.hypot(pt.x-drag.start.x,pt.y-drag.start.y)>4){if(!drag.moved)snapshot();drag.moved=true}
 if(drag.moved){drag.part.x=clamp(Math.round((pt.x-drag.dx)/10)*10,0,1500);drag.part.y=clamp(Math.round((pt.y-drag.dy)/10)*10,20,1000);render()}});
svg.addEventListener("pointerup",ev=>{if(!drag)return;const d=drag;drag=null;
 if(d.wh){const p=d.wh.pts;for(let i=p.length-1;i>0;i--)if(p[i].x===p[i-1].x&&p[i].y===p[i-1].y)p.splice(i,1);save();render();return}
 if(d.probe){const pt=svgPt(ev);let best=null,bd=22;parts.forEach(p=>T[p.type].terms.forEach(t=>{const q={x:p.x+t[1],y:p.y+t[2]};const dd=Math.hypot(q.x-pt.x,q.y-pt.y);if(dd<bd){bd=dd;best={p:p.id,t:t[0],q}}}));
  if(best){meter[d.probe]={p:best.p,t:best.t};meter[d.probe==="red"?"rp":"bp"]={x:best.q.x+(d.probe==="red"?0:0),y:best.q.y}}renderMeter();return}
 if(!d.moved){const t=T[d.part.type];openSheet(d.part)}else save()});
function termTap(pid,tid){if(!pending){pending={p:pid,t:tid};render();return}
 if(pending.p===pid&&pending.t===tid){pending=null;render();return}
 snapshot();const w={id:"w"+(nid++),a:pending,b:{p:pid,t:tid},c:wireColor};wires.push(w);pending=null;incident=null;
 say(`Wire: ${wireName(w)}.`);save();render()}
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
 if(b.dataset.add){snapshot();const box=svg.viewBox.baseVal;const wrap=$("boardWrap");const sc=box.width/svg.clientWidth;const p=addPart(b.dataset.add,wrap.scrollLeft*sc+60+Math.random()*80,wrap.scrollTop*sc+60+Math.random()*80);say(`Added ${p.label}.`);save();render();return}
 if(b.dataset.color){wireColor=b.dataset.color;if(sel&&sel.startsWith("w")){const w=wires.find(w=>w.id===sel);if(w){snapshot();w.c=wireColor;save()}}renderPalette();render();return}
 if(b.dataset.mm){meter.mode=b.dataset.mm;renderMeter();render();return}
 if(b.dataset.act){const p=partById(sel);if(!p)return;const a=b.dataset.act;
  if(a==="click"){T[p.type].click(p)}
  if(a==="replace"){p.st=T[p.type].init();say(`${p.label} replaced.`)}
  if(a==="weld"){p.st.welded=!p.st.welded;say(p.st.welded?"Contactor contacts welded shut (fault).":"Contacts replaced.")}
  if(a==="rename"){const n=prompt("Name for this part",p.label);if(n)p.label=n.slice(0,30)}
  if(a==="del"){snapshot();wires=wires.filter(w=>w.a.p!==p.id&&w.b.p!==p.id);parts=parts.filter(x=>x!==p);sel=null;$("sheet").hidden=true;say(`Deleted ${p.label}.`)}
  if(a!=="del")openSheet(p);save();tick(0);render();return}
 switch(b.id){
  case "resetRoute":{const w=sel&&wires.find(x=>x.id===sel);if(w&&w.pts){snapshot();delete w.pts;save();render();say("Wire route reset.")}break}
  case "delSel":if(sel&&sel.startsWith("w")){snapshot();wires=wires.filter(w=>w.id!==sel);sel=null;b.hidden=true;save();render()}break;
  case "undo":if(hist.length){const s=JSON.parse(hist.pop());parts=s.parts;wires=s.wires;nid=s.nid;incident=null;save();render()}break;
  case "clear":if(confirm("Clear the whole board?")){snapshot();parts=[];wires=[];incident=null;meter.red=meter.black=null;save();render()}break;
  case "example":{snapshot();const k=$("exSel").value;(EXAMPLES[k]||EXAMPLES.cu)();say(EX_MSG[k]||EX_MSG.cu);save();render();break}
  case "meterBtn":meter.on=!meter.on;b.setAttribute("aria-pressed",meter.on);if(meter.on&&!meter.red){const box=svg.viewBox.baseVal;meter.rp={x:60,y:box.height-40};meter.bp={x:100,y:box.height-40}}render();break;
  case "zoomIn":zoom=Math.min(1.6,zoom+0.2);applyZoom();break;
  case "zoomOut":zoom=Math.max(0.5,zoom-0.2);applyZoom();break;
  case "sheetX":$("sheet").hidden=true;sel=null;render();break;
  case "mOk":$("modal").hidden=true;break;
  case "theme":{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("wt-theme",r.dataset.theme)}catch(e){}break}
 }});
document.addEventListener("keydown",e=>{if((e.key==="Delete"||e.key==="Backspace")&&sel&&sel.startsWith("w")&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){$("delSel").click()}if(e.key==="Escape"){pending=null;$("sheet").hidden=true;render()}});

function loadExample(){parts=[];wires=[];incident=null;
 const S=addPart("supply",40,40),D=addPart("disc",220,40),F1=addPart("fuse",340,40),X=addPart("xfmr",40,330),TS=addPart("tstat",40,560),
  CT=addPart("contactor",460,220),HP=addPart("hps",240,560),LP=addPart("lps",340,560),C=addPart("comp",700,420),FN=addPart("fan",860,420),CP=addPart("cap",620,600),F3=addPart("fuse3",180,440);
 S.label="Panel";D.label="Disconnect";F1.label="Fuse";CT.label="Contactor";C.label="Compressor";FN.label="Fan motor";CP.label="Run cap";X.label="Transformer";TS.label="Thermostat";F3.label="3A fuse";
 const W=(a,at,b,bt,c)=>wires.push({id:"w"+(nid++),a:{p:a.id,t:at},b:{p:b.id,t:bt},c});
 W(S,"L1",D,"L1","#1d2327");W(S,"L2",D,"L2","#d23a26");W(D,"T1",F1,"1","#1d2327");W(F1,"2",CT,"L1","#1d2327");W(D,"T2",CT,"L2","#d23a26");
 W(CT,"T1",C,"C","#1d2327");W(CT,"T1",FN,"COM","#1d2327");W(CT,"T2",C,"R","#d23a26");W(CT,"T2",CP,"C","#d23a26");W(CP,"HERM",C,"S","#e8c33a");W(CP,"FAN",FN,"ST","#8a5a2b");W(CT,"T2",FN,"RUN","#7a4fb0");
 W(D,"T1",X,"H1","#1d2327");W(D,"T2",X,"H2","#d23a26");
 W(X,"X1",F3,"1","#d23a26");W(F3,"2",TS,"R","#d23a26");W(TS,"Y",HP,"1","#e8c33a");W(HP,"2",LP,"1","#e8c33a");W(LP,"2",CT,"A1","#e8c33a");W(CT,"A2",X,"X2","#2f6fd6");W(TS,"C",X,"X2","#2f6fd6");
}

const WX=(a,at,b,bt,c)=>wires.push({id:"w"+(nid++),a:{p:a.id,t:at},b:{p:b.id,t:bt},c});
const BK="#1d2327",RD="#d23a26",WH="#f4f4f0",GN="#2f9a4a",BL="#2f6fd6",YL="#e8c33a",OR="#e0762a",PU="#7a4fb0",BR="#8a5a2b";
function exFurnace(){parts=[];wires=[];incident=null;const A=(t,x,y,l)=>{const p=addPart(t,x,y);p.label=l;return p};
 const S=A("supply",40,40,"Panel"),DS=A("toggle",220,50,"Door switch"),X=A("xfmr120",40,250,"Transformer"),F3=A("fuse3",60,420,"3A fuse"),
  B=A("ifc",380,320,"Furnace board"),IN=A("inducer",380,120,"Inducer"),H=A("hsi",510,150,"Igniter"),BW=A("blower",650,100,"Blower"),NB=A("tb",840,250,"Neutral block"),
  TS=A("tstat",130,620,"Thermostat"),LM=A("limit",560,560,"High limit"),PS=A("psw",700,560,"Pressure switch"),GV=A("gasvalve",820,400,"Gas valve");
 DS.st.on=true;
 WX(S,"L1",DS,"1",BK);WX(DS,"2",B,"L",BK);WX(DS,"2",X,"H1",BK);WX(S,"N",B,"N",WH);WX(S,"N",X,"H2",WH);WX(S,"N",NB,"a",WH);
 WX(X,"X1",F3,"1",RD);WX(F3,"2",B,"R",RD);WX(X,"X2",B,"C",BL);
 WX(TS,"R",B,"R",RD);WX(TS,"W",B,"W",WH);WX(TS,"G",B,"G",GN);WX(TS,"C",B,"C",BL);
 WX(B,"RO",LM,"1",OR);WX(LM,"2",PS,"1",OR);WX(PS,"2",B,"PS",OR);WX(B,"GV",GV,"1",YL);WX(GV,"2",B,"C",BL);
 WX(B,"IND",IN,"L",BK);WX(IN,"N",NB,"b",WH);WX(B,"HSI",H,"1",BK);WX(H,"2",NB,"c",WH);WX(B,"BLW",BW,"L",BK);WX(BW,"N",NB,"d",WH)}
function exHeatPump(){parts=[];wires=[];incident=null;const A=(t,x,y,l)=>{const p=addPart(t,x,y);p.label=l;return p};
 const S=A("supply",40,40,"Panel"),D=A("disc",200,40,"Disconnect"),X=A("xfmr",40,300,"Transformer"),F3=A("fuse3",60,460,"3A fuse"),TS=A("tstatHP",40,620,"Thermostat"),
  CT=A("contactor",400,200,"Contactor"),HP=A("hps",240,560,"HPS"),LP=A("lps",340,560,"LPS"),C=A("comp",560,400,"Compressor"),FN=A("fan",700,400,"Outdoor fan"),CP=A("cap",450,600,"Run cap"),
  RV=A("rvcoil",580,660,"RV coil"),R1=A("relay",740,620,"Fan relay"),BW=A("blower",900,600,"Indoor blower"),R2=A("relay",700,170,"Heat strip relay"),HT=A("heater",880,150,"Heat strip");
 WX(S,"L1",D,"L1",BK);WX(S,"L2",D,"L2",RD);WX(D,"T1",CT,"L1",BK);WX(D,"T2",CT,"L2",RD);
 WX(CT,"T1",C,"C",BK);WX(CT,"T1",FN,"COM",BK);WX(CT,"T2",C,"R",RD);WX(CT,"T2",CP,"C",RD);WX(CP,"HERM",C,"S",YL);WX(CP,"FAN",FN,"ST",BR);WX(CT,"T2",FN,"RUN",PU);
 WX(D,"T1",X,"H1",BK);WX(D,"T2",X,"H2",RD);WX(D,"T1",R2,"COM",BK);WX(R2,"NO",HT,"1",BK);WX(HT,"2",D,"T2",RD);
 WX(D,"T1",R1,"COM",BK);WX(R1,"NO",BW,"L",BK);WX(BW,"N",S,"N",WH);
 WX(X,"X1",F3,"1",RD);WX(F3,"2",TS,"R",RD);WX(TS,"C",X,"X2",BL);WX(TS,"Y",HP,"1",YL);WX(HP,"2",LP,"1",YL);WX(LP,"2",CT,"A1",YL);WX(CT,"A2",X,"X2",BL);
 WX(TS,"O",RV,"1",OR);WX(RV,"2",X,"X2",BL);WX(TS,"G",R1,"A1",GN);WX(R1,"A2",X,"X2",BL);WX(TS,"W2",R2,"A1",WH);WX(R2,"A2",X,"X2",BL)}
function exWalkIn(){parts=[];wires=[];incident=null;const A=(t,x,y,l)=>{const p=addPart(t,x,y);p.label=l;return p};
 const S=A("supply",40,40,"Panel"),D=A("disc",220,40,"Disconnect"),X=A("xfmr",40,300,"Transformer"),F3=A("fuse3",60,460,"3A fuse"),
  BT=A("tsw",220,640,"Box thermostat"),LS=A("lls",380,640,"Liquid solenoid"),LP=A("lpc",380,440,"Low pressure control"),HP=A("hps",200,440,"HPS"),
  CT=A("contactor",560,180,"Contactor"),C=A("comp",700,420,"Compressor"),FN=A("fan",860,420,"Condenser fan"),CP=A("cap",600,620,"Run cap");
 BT.st.closed=true;
 WX(S,"L1",D,"L1",BK);WX(S,"L2",D,"L2",RD);WX(D,"T1",CT,"L1",BK);WX(D,"T2",CT,"L2",RD);
 WX(CT,"T1",C,"C",BK);WX(CT,"T1",FN,"COM",BK);WX(CT,"T2",C,"R",RD);WX(CT,"T2",CP,"C",RD);WX(CP,"HERM",C,"S",YL);WX(CP,"FAN",FN,"ST",BR);WX(CT,"T2",FN,"RUN",PU);
 WX(D,"T1",X,"H1",BK);WX(D,"T2",X,"H2",RD);
 WX(X,"X1",F3,"1",RD);WX(F3,"2",BT,"1",RD);WX(BT,"2",LS,"1",OR);WX(LS,"2",X,"X2",BL);
 WX(F3,"2",HP,"1",RD);WX(HP,"2",LP,"1",YL);WX(LP,"2",CT,"A1",YL);WX(CT,"A2",X,"X2",BL)}
const EXAMPLES={cu:loadExample,furnace:exFurnace,hp:exHeatPump,walkin:exWalkIn};
const EX_MSG={cu:"Loaded the condensing unit with its 24 V controls. Turn on the panel and set the thermostat to cool.",
 furnace:"Loaded the gas furnace. Turn on the panel and set the thermostat to heat, then watch the board: inducer, pressure switch, igniter, gas valve, blower. Tap the pressure switch to block the vent, or the limit to trip it.",
 hp:"Loaded the heat pump. Turn on the panel and step the thermostat through cool (O powers the reversing valve), heat, and emergency heat (heat strips only).",
 walkin:"Loaded the walk-in pump-down circuit. Turn on the panel: the box thermostat opens the liquid solenoid and the low pressure control runs the compressor. Tap the box thermostat open and watch it pump down."};

/* ---------- loop ---------- */
let last=performance.now(),acc=0;
function tick(dt){simulate(dt);}
function frame(now){const dt=Math.min(0.2,(now-last)/1000);last=now;acc+=dt;
 if(acc>0.1){tick(acc);acc=0;
  // light refresh: re-render parts whose look depends on state
  const sp=svg.querySelector("#parts");parts.forEach(p=>{const g=sp.querySelector(`[data-id="${p.id}"]`);if(g){if((p.type==="fan"||p.type==="blower"||p.type==="inducer")&&p.st.run)p.st.ang=((p.st.ang||0)+40)%360;const h=T[p.type].draw(p)+`<text x="0" y="${T[p.type].terms.some(t=>t[2]===0)?-20:-6}" font-size="10" font-family="var(--display)" font-weight="700" fill="var(--muted)">${esc(p.label.toUpperCase())}</text>`;if(g._h!==h){g.innerHTML=h;g._h=h}}});
  if(meter.on)$("mRead").textContent=readMeter();
  const s=parts.find(p=>p.type==="supply");$("liveTag").textContent=s&&s.st.on?"LIVE":"DEAD";$("liveTag").className="live "+(s&&s.st.on?"on":"")}
 requestAnimationFrame(frame)}

/* ---------- start ---------- */
let zoom=1;function applyZoom(){svg.style.width=Math.round(1200*zoom)+"px";svg.style.height=Math.round(800*zoom)+"px"}
zoom=window.innerWidth<700?0.7:1;applyZoom();
try{const t=localStorage.getItem("wt-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
renderPalette();
let loaded=false;try{const s=JSON.parse(localStorage.getItem("wt-board")||"null");if(s&&s.parts){parts=s.parts;wires=s.wires;nid=s.nid;loaded=true}}catch(e){}
if(!loaded)loadExample();
render();requestAnimationFrame(frame);
window.__wt={EXAMPLES,get parts(){return parts},get wires(){return wires},T,simulate,readMeter,meter,addPart,loadExample,render,termTap,partById};

/* ---------- disclaimer + feedback (FB-Enable) ---------- */
const FEEDBACK={form:"https://docs.google.com/forms/d/e/1FAIpQLScaqpadGdwDY_CanACDH3X_ZAQ44LzrCwDYcaxIuaxYk6A5UA/viewform",entry:"entry.249128714"};
const DISC_VER="1";
let CM=null,cmState="off";
(async()=>{try{if(window.claude&&window.claude.use){CM=await window.claude.use("comments");if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}}}catch(e){CM=null}})();
async function refreshFb(){if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}const to=CM&&cmState==="available";$("fbTo").textContent=to?"Sends straight to Claude as a comment on this page.":"No sign-in needed.";$("fbSend").textContent=to?"Send to Claude":"Send"}
async function sendFb(){const msg=$("fbMsg").value.trim();if(!msg){$("fbStatus").textContent="Please write something first.";return}
 const text=`[${$("fbType").value}] ${msg}\n\nFrom: ${$("fbName").value.trim()||"anonymous"}\nContext: Wiring trainer, ${parts.length} parts, ${wires.length} wires, ${navigator.userAgent}`;
 $("fbSend").disabled=true;$("fbStatus").textContent="Sending...";
 try{if(CM&&cmState==="available"){try{const anchor=await CM.anchorFor($("boardWrap"));await CM.sendToClaude({anchor,text:text.slice(0,3900)});$("fbStatus").textContent="Sent to Claude.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1500);return}
   catch(e){if(e&&e.code==="consent_required"){$("fbStatus").textContent="Not sent: allow comments for this page when asked, then press Send again.";return}
    if(e&&!["claude_unavailable","capability_removed","forbidden"].includes(e.code)){$("fbStatus").textContent=`Couldn't send to Claude (${e.code||"error"}). Press Send again to use the form.`;cmState="off";return}cmState="off"}}
  const body=new URLSearchParams();body.append(FEEDBACK.entry,"[Wiring] "+text);await fetch(FEEDBACK.form.replace(/\/viewform.*$/,"/formResponse"),{method:"POST",mode:"no-cors",body});
  $("fbStatus").textContent="Thanks, it was sent.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1200)}
 catch(e){$("fbStatus").innerHTML=`Couldn't send from here. <a href="${FEEDBACK.form}" target="_blank" rel="noopener">Open the feedback form</a>.`}finally{$("fbSend").disabled=false}}
document.addEventListener("click",e=>{const id=e.target.id;
 if(id==="discOk"){$("disc").hidden=true;try{localStorage.setItem("wt-disc",DISC_VER)}catch(_){}}
 else if(id==="about")$("disc").hidden=false;
 else if(id==="feedback"){$("fbStatus").textContent="";refreshFb();$("fb").hidden=false;$("fbMsg").focus()}
 else if(id==="fbCancel")$("fb").hidden=true;else if(id==="fbSend")sendFb()});
{let seen=null;try{seen=localStorage.getItem("wt-disc")}catch(_){}if(seen!==DISC_VER)$("disc").hidden=false}
})();
