/* ============ Carlyle 06D page: live cutaway, teardown steps, specs ============ */
(()=>{
const $=id=>document.getElementById(id);
const SRC=[["Carlyle: Service Guide for 06D, 06E and 06CC compressors","https://siglers.com/mwdownloads/download/link/id/8873"],["Carlyle: 06D/06E Application Data (574-069)","https://siglers.com/mwdownloads/download/link/id/8881"],["Carlyle: Capacity Control Valves for 06D, 06E (99TA516174)","https://siglers.com/mwdownloads/download/link/id/8930"],["The Engineering Mindset: chiller compressor types (reciprocating)","https://theengineeringmindset.com/chiller-compressor-types/"]];
/* ---------- cutaway ---------- */
let V={th:0.9,play:true,spd:3,CR:4,gas:true,oil:false,hl:null},timer=null;
function mountCut(el){
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="c6Svg" viewBox="0 -8 720 388" role="img" aria-label="Carlyle 06D compressor cut open along the crankshaft"></svg></div>
  <p class="note" id="c6Ph"></p><div class="scroller"><svg id="c6Pv" viewBox="0 0 720 230" role="img" aria-label="Pressure and volume in cylinder 1"></svg></div></div>
 <div class="lsSide"><div class="group"><h3>Run it</h3><div class="btns"><button class="btn blue" id="c6Play">Pause</button><button class="btn" id="c6Step">Step</button></div>
  <div class="row"><label for="c6Spd">Speed (slowed down a lot)</label><output id="c6oSpd"></output><input type="range" id="c6Spd" min="1" max="10" step="1" value="${V.spd}"></div>
  <div class="row"><label for="c6CR">Compression ratio</label><output id="c6oCR"></output><input type="range" id="c6CR" min="2" max="12" step="0.5" value="${V.CR}"></div>
  <label class="lsChk"><input type="checkbox" id="c6Gas" checked> Color the gas (blue suction, red discharge)</label>
  <label class="lsChk"><input type="checkbox" id="c6Oil"> Show the oil path</label>
  <p class="note">A real 06D turns about 1750 rpm: each piston makes 29 strokes a second.</p></div>
 <div class="group"><h3>Parts (tap one, or tap the drawing)</h3><div class="btns" id="c6Parts">${C6.PARTS.map(p=>`<button class="btn" data-part="${p[0]}">${p[1]}</button>`).join("")}</div><div id="c6Info"><p class="note">Pick a part to see what it does.</p></div></div></div></div>`;
 const draw=()=>{$("c6Svg").innerHTML=C6.cut({th:V.th,CR:V.CR,gas:V.gas,oilpath:V.oil,hl:V.hl})+C6.spots();
  const a=C6.pv(V.th,V.CR),b=C6.pv(V.th+Math.PI,V.CR);$("c6Ph").innerHTML=`<b>Left cylinder:</b> ${C6.PHASE[a.ph]}.<br><b>Right cylinder:</b> ${C6.PHASE[b.ph]}.`;
  $("c6Pv").innerHTML=K.lbl(70,20,"LEFT CYLINDER, ONE TURN OF THE CRANK",{a:"start"})+C6.card(70,40,420,140,V.CR,V.th)+K.txt(520,70,"Fill of the cylinder with",{a:"start"})+K.txt(520,90,"fresh gas (typical): "+K.f0(C6.ve(V.CR)*100)+"%",{a:"start"})+K.txt(520,124,"Higher ratio: the trapped gas",{a:"start"})+K.txt(520,144,"takes more of the stroke to",{a:"start"})+K.txt(520,164,"re-expand, so less comes in.",{a:"start"});
  $("c6oSpd").textContent=V.spd;$("c6oCR").textContent=K.f1(V.CR)+" : 1"};
 const run=()=>{clearInterval(timer);timer=null;if(V.play)timer=setInterval(()=>{if(!$("c6Svg")||$("tab-cut").hidden)return;V.th=(V.th+0.02*V.spd)%(2*Math.PI);draw()},60);$("c6Play").textContent=V.play?"Pause":"Play"};
 const pick=k=>{V.hl=V.hl===k?null:k;const p=C6.part(V.hl);$("c6Info").innerHTML=p?`<p class="lsRes"><b>${p[1]}.</b> ${p[4]}</p>`:`<p class="note">Pick a part to see what it does.</p>`;
  el.querySelectorAll("#c6Parts .btn").forEach(b=>b.classList.toggle("blue",b.dataset.part===V.hl));draw()};
 el.addEventListener("click",e=>{const p=e.target.closest("[data-part]");if(p){pick(p.dataset.part);return}
  if(e.target.id==="c6Play"){V.play=!V.play;run()}if(e.target.id==="c6Step"){V.play=false;run();V.th=(V.th+Math.PI/8)%(2*Math.PI);draw()}});
 el.addEventListener("input",e=>{const t=e.target;if(t.id==="c6Spd")V.spd=+t.value;if(t.id==="c6CR")V.CR=+t.value;if(t.id==="c6Gas")V.gas=t.checked;if(t.id==="c6Oil")V.oil=t.checked;draw()});
 draw();run()}
/* ---------- teardown ---------- */
const ISO="Front-seat the suction and discharge service valves, recover the refrigerant left in the compressor, and lock out the power. Check for zero pressure on both ports before you loosen anything.";
const PROC={
 vp:{name:"Valve plate and cylinder head",draw:C6.stack,steps:[
  ["Isolate the compressor",ISO,{e:0}],
  ["Loosen the head bolts","Back the cylinder head bolts out, but leave at least two of them threaded in a few turns. If any pressure is still trapped under the head, the bolts catch it.",{e:0.25,hl:6}],
  ["Pry the head free","Pry the head loose from the valve plate. <b>Don't hit it</b>: a blow sideways can shear the valve plate dowel pins. Then take the last bolts out and lift the head off.",{e:0.55,hl:5}],
  ["Read the head gasket","Look at the gasket before you scrape it. A burned-through web between the suction side and the discharge side means hot gas was leaking straight back to suction.",{e:1,hl:4}],
  ["Break the valve plate free","Use the jack screw method to break the plate loose from the deck, then lift it straight up. The discharge valves and their stops come with it.",{e:1,hl:3}],
  ["Lift out the suction valves","The suction reeds (and their positioning springs) sit on the dowel pins in the deck. Lift them off and keep each one with its own cylinder.",{e:1,hl:1}],
  ["Inspect","Look for broken or chipped reeds, a worn valve seat, marks on the piston crowns, and scoring in the cylinders. Worn valve parts are replaced as an assembly. If you reuse valves, they go back in the same position, same side up.",{e:1,hl:0}],
  ["Reassemble","Suction valves and positioning springs on the dowel pins, a new valve plate gasket (fiber gasket dry or lightly oiled, metal gasket dry), the valve plate, a new head gasket, then the head.",{e:0.4,hl:2}],
  ["Torque the head","Tighten the head bolts in an alternating pattern to <b>30 to 35 ft-lb</b>. With fiber gaskets, re-torque after 24 hours. Metal-core gaskets don't need it.",{e:0,hl:6}]]},
 bh:{name:"Pump end bearing head and oil pump",draw:C6.pump,steps:[
  ["Isolate the compressor",ISO+" Have a pan ready: some oil will run out of the pump end.",{e:0}],
  ["Remove the cover plate","Take out the four cover plate cap screws and pull the cover plate.",{e:0.5,hl:5}],
  ["Pull the guide vane and spring","The oil feed guide vane and its spring slide out of the end of the crankshaft.",{e:1,hl:3}],
  ["Remove the drive segment","Two cap screws hold the pump drive segment to the end of the crankshaft. Take them out and remove the segment.",{e:1,hl:2}],
  ["Pull the bearing head","Remove the eight bearing head cap screws and pull the bearing head straight forward off the shaft.",{e:1,hl:1}],
  ["Inspect","Check the bearing surface for wear and scoring. If the bearing is worn or scored, or the pump is bad, replace the <b>whole bearing head</b>: pump and bearing are one assembly.",{e:1,hl:1}],
  ["Reassemble","Bearing head screws: <b>30 to 35 ft-lb</b>. Drive segment: No. 10 screws 4 to 6 ft-lb, 1/4 in. screws 12 to 15 ft-lb. Guide vane goes in <b>large diameter first</b>, spring over the small diameter.",{e:0.5,hl:3}],
  ["Cover plate","Cover plate screws: <b>16 to 20 ft-lb</b>. The threads are in aluminum and strip if you over-tighten. After start-up, check net oil pressure.",{e:0,hl:5}]]}};
let T={p:"vp",i:0};
function mountTear(el){
 const draw=()=>{const P=PROC[T.p],st=P.steps[T.i],names=T.p==="vp"?C6.STACK:C6.PUMP;
  el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg viewBox="0 0 720 380" role="img" aria-label="${P.name}, exploded view">${P.draw(st[2])}${st[2].hl!=null?K.tag(360,24,names[st[2].hl].toUpperCase(),{fill:"#b07d00"}):""}</svg></div></div>
  <div class="lsSide"><div class="group"><label class="lsPick">Job <select id="tdP">${Object.keys(PROC).map(k=>`<option value="${k}"${k===T.p?" selected":""}>${PROC[k].name}</option>`).join("")}</select></label>
   <p class="note">Step ${T.i+1} of ${P.steps.length}</p><h3>${st[0]}</h3><p>${st[1]}</p>
   <div class="btns"><button class="btn" id="tdB"${T.i?"":" disabled"}>← Back</button><button class="btn blue" id="tdN"${T.i<P.steps.length-1?"":" disabled"}>Next →</button></div></div>
  <div class="group"><h3>All steps</h3><ol>${P.steps.map((s,i)=>`<li${i===T.i?' style="font-weight:600"':""}>${s[0]}</li>`).join("")}</ol></div>
  <div class="group"><p class="note">The service guide treats the valve plates, gaskets, bearing head and oil pump, terminal plate and unloaders as field service. Damage to rods, pistons, the crankshaft or the motor normally means a replacement compressor.</p></div></div></div>`};
 el.addEventListener("change",e=>{if(e.target.id==="tdP"){T={p:e.target.value,i:0};draw()}});
 el.addEventListener("click",e=>{if(e.target.id==="tdB"){T.i--;draw()}if(e.target.id==="tdN"){T.i++;draw()}});draw()}
/* ---------- specs ---------- */
const DUTY={M:"medium temperature",R:"low temperature",S:"service replacement, suction cut-off unloading",X:"service replacement, hot gas bypass unloading"};
const CFM={"08":8.0,"09":8.7,"13":13.0,"16":15.9,"18":18.3,"20":20.0,"24":24,"25":25,"28":28,"37":37,"41":41};
const KEY={0:"new compressor",2:"new compressor",3:"new compressor",6:"service compressor, remanufactured",7:"service compressor, new"};
const ELEC={"31":"575 V, 3 phase, 60 Hz","32":"208/230 V, 3 phase, 60 Hz","36":"400/460 V, 3 phase, 50/60 Hz"};
const decode=s=>{s=s.toUpperCase().replace(/[^0-9A-Z]/g,"");const m=s.match(/^06D([A-Z])(\d)(\d\d)(\d)?/);if(!m)return `<p class="lsRes no">Start with 06D, a letter and three digits, like 06DR3370DA3650.</p>`;
 const r=[["06D","Carlyle 06D semi-hermetic"],[m[1],DUTY[m[1]]||(m[1]>="A"&&m[1]<="K"?"air conditioning duty":"see the service guide")],[m[2],"motor size code (it is not the horsepower)"],[m[3],CFM[m[3]]?CFM[m[3]]+" cfm displacement at 1750 rpm":"displacement code: see the service guide"]];
 if(m[4])r.push([m[4],KEY[m[4]]||"see the service guide"]);const el=s.slice(10,12);if(ELEC[el])r.push([el,ELEC[el]]);
 return `<table class="lsTbl">${r.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td></tr>`).join("")}</table><p class="note">The remaining characters cover electrical variations, unloading and packaging. The nameplate and the service guide are the final word.</p>`};
const serial=s=>{const m=s.replace(/\s/g,"").match(/^(\d\d)(\d\d)([A-Za-z])/);if(!m||+m[1]<1||+m[1]>53)return `<p class="lsRes no">Enter the first five characters, like 1094J (week, year, plant).</p>`;
 const w=+m[1],y=+m[2]+(+m[2]>=50?1900:2000);let r;
 if(y>1994||(y===1994&&w>=10))r="18 to 26 psi";else if(y>1984||(y===1984&&w>=23))r="16 to 22 psi";else if(y===1984&&w>=18)r="built around the May 1984 change: 12 to 18 or 16 to 22 psi, check the guide";else r="12 to 18 psi";
 return `<p class="lsRes">Week ${w} of ${y}${m[3].toUpperCase()==="J"?", Syracuse plant":""}. Net oil pressure for an 06D of this age: <b>${r}</b>.</p>`};
const tbl=(h,rows)=>`<div class="phScroll" style="overflow-x:auto"><table class="lsTbl"><tr>${h.map(c=>`<th>${c}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
function mountSpec(el){
 el.innerHTML=`<div class="lsJob">
 <div class="group"><h3>Model number</h3><label class="lsPick">Type a model number <input id="spM" value="06DR3370DA3650" style="font:inherit;padding:8px;max-width:260px" autocomplete="off"></label><div id="spMo"></div></div>
 <div class="group"><h3>Serial number and oil pressure</h3><label class="lsPick">First five characters of the serial number <input id="spS" value="1094J" style="font:inherit;padding:8px;max-width:160px" autocomplete="off"></label><div id="spSo"></div>
  ${tbl(["Built","Net oil pressure (06D)"],[["March 1994 and later (serial 1094J on)","18 to 26 psi"],["May 1984 to March 1994","16 to 22 psi"],["Before May 1984","12 to 18 psi"]])}<p class="note">Net oil pressure = oil pump pressure minus suction (crankcase) pressure.</p></div>
 <div class="group"><h3>Physical data</h3>${tbl(["Model","hp","cfm at 1750 rpm","Cylinders","Bore","Stroke","Oil (pints)","Weight (lb)"],C6.MODELS.map(m=>[m[0],m[1],K.f1(m[2]),m[3],'2 in.',m[4]+" in.",m[5],m[6]??"see guide"]))}<p class="note">Six-cylinder 06D models (about 24 to 41 cfm) are in the service guide. Displacement = cylinders × 0.785 × bore² × stroke × rpm ÷ 1728.</p></div>
 <div class="group"><h3>Oil</h3>${tbl(["Item","Value"],[["Sight glass, running","1/4 to 3/4"],["Oil safety switch","Opens at 4 to 8 psi net, closes at 8 to 11 psi, 120 second delay, manual reset"],["Electronic switch 06DA509570","Opens at 8 to 10 psi, closes at 12 to 14 psi"],["HFC refrigerants","POE oil (for example Totaline P903-1701, Castrol E68, Emkarate RL68H)"],["HCFC refrigerants","Mineral or alkylbenzene (for example Suniso 3GS, Zerol 150)"],["Sump temperature","160 to 165°F maximum"],["Crankcase heater","On whenever the compressor is off, and for 24 hours before a first start"]])}</div>
 <div class="group"><h3>Torque guide (06D)</h3>${tbl(["Fastener","Size","ft-lb"],[["Cylinder head, bearing head, bottom plate, motor end cover","3/8-16","30 to 35"],["Motor end cover (large screws)","7/16-14","55 to 60"],["Cover plate, terminal plate","5/16-18","16 to 20"],["Unloader valve, drive segment","1/4-28","12 to 15"],["Connecting rod cap","1/4-20","10 to 12"],["Suction service valve","5/16-18 / 1/2-13","20 to 25 / 80 to 90"],["Discharge service valve","5/16-18","20 to 33"],["Oil pressure regulator","1/2-20","10 to 12"],["Sight glass","1-1/2-18","35 to 45"],["Pipe plug","1/4","20 to 25"]])}</div>
 <div class="group"><h3>Operating limits</h3>${tbl(["Item","Limit"],[["Discharge temperature at the service valve","275°F maximum, 250°F recommended with HFC and POE"],["Starts","12 per hour at most, and run at least 5 minutes"],["Superheat with unloading or variable speed","10 to 25°F"],["Variable speed","30 to 60 Hz"],["Motor thermostat","Opens at 221°F, resets at 181°F"],["RLA","Must-trip current ÷ 1.56"]])}</div>
 <div class="group"><h3>Suction cut-off unloading steps</h3>${tbl(["Compressor","Cylinders running","Capacity","Power"],[["4 cylinder","2","49%","57%"],["6 cylinder","4","67%","71%"],["6 cylinder","2","32%","46%"]])}</div>
 <div class="group"><h3>Sources</h3><ul class="lsSrc">${SRC.map(([n,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join("")}</ul><p class="note">Drawings are made for this site from the manufacturer's literature. They are simplified and not to scale. Always work from the Carlyle guide for the exact compressor in front of you.</p></div></div>`;
 const up=()=>{$("spMo").innerHTML=decode($("spM").value);$("spSo").innerHTML=serial($("spS").value)};el.addEventListener("input",up);up()}
window.__c6={decode,serial,PROC};
window.LESSON={id:"comp-tool",sec:"Carlyle 06D",secHref:"/",title:"Carlyle 06D compressor",lead:"A semi-hermetic reciprocating compressor cut open: watch it run, name the parts, step through a valve plate and oil pump teardown, and look up torques and oil pressures.",
 tabs:[{id:"cut",label:"Cutaway",mount:mountCut},{id:"tear",label:"Teardown",mount:mountTear},{id:"spec",label:"Specs",mount:mountSpec}],steps:[],tasks:[],sources:[]};
})();
