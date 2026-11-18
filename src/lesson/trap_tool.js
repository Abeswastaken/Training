/* ============ Steam traps page: every common trap cut open and running, compare, choose, test ============ */
(()=>{
const $=id=>document.getElementById(id);
const SRC={
 em:["The Engineering Mindset: Thermostatic radiator traps","https://theengineeringmindset.com/thermostatic-radiator-traps/"],
 em2:["The Engineering Mindset: Steam heating system basics","https://theengineeringmindset.com/steam-heating-system-basics/"],
 ss:["Spirax Sarco: Steam traps and steam trapping","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping"],
 ssm:["Spirax Sarco: Mechanical steam traps","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/mechanical-steam-traps"],
 sst:["Spirax Sarco: Thermostatic steam traps","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/thermostatic-steam-traps"],
 ssd:["Spirax Sarco: Thermodynamic steam traps","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/thermodynamic-steam-traps"],
 sstest:["Spirax Sarco: Testing and maintenance of steam traps","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/testing-and-maintenance-of-steam-traps"],
 ssh:["Spirax Sarco: Selecting steam traps, space heating","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/selecting-steam-traps---space-heating-equipment"],
 ssmain:["Spirax Sarco: Selecting steam traps, steam mains","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/selecting-steam-traps---steam-mains-tanks-and-vats-pressure-reducing-valves"],
 ssp:["Spirax Sarco: Selecting steam traps, process equipment","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/selecting-steam-traps---process-equipment"],
 sso:["Spirax Sarco: Selecting steam traps, tracing and tanks","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/selecting-steam-traps---canteen-equipment-oil-transfer-storage-hospital-equipment"],
 ssc:["Spirax Sarco: Considerations for selecting steam traps","https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/considerations-for-selecting-steam-traps"],
 tlv:["TLV: Steam trap varieties and applications","https://tlv.com/global/US/steam-theory/steam-trap-varieties-and-applications.html"],
 tlvs:["TLV: Steam trap selection, part 1","https://www.tlv.com/steam-info/steam-theory/steamtrap-basics/steam-trap-selection-part-1"],
 tlvt:["TLV: Steam trap testing","https://tlv.com/global/AU/steam-theory/steam-trap-test.html"],
 ar:["Armstrong: Series 980 inverted bucket steam trap","https://armstronginternational.com/products/series-980-inverted-bucket-steam-trap/"],
 arb:["Armstrong: inverted bucket steam trap bulletins (ST series)","https://www.euromekanik.se/app/uploads/inv-bucket-steam-traps.pdf"],
 arg:["Armstrong: Steam Conservation Guidelines (P101D)","https://armstronginternational.com/wp-content/uploads/Broch_SteamConservationGuidelines_P101D_EN_20-20190501.pdf"],
 watts:["Watts: How steam traps work","https://www.watts.com/resources/references-tools/steam-traps"],
 ins:["InspectApedia: Steam trap types, applications and locations","https://inspectapedia.com/heat/Steam_Traps.php"],
 nrel:["US DOE / NREL: steam trap leak table, failure rates and test intervals (39305)","https://www.nrel.gov/docs/fy06osti/39305.pdf"],
 ashe:["ASHE: Evaluate steam traps","https://www.ashe.org/system/files/media/file/2022/04/29-Evaluate-steam-traps.pdf"],
 hol:["Dan Holohan: What you ought to know about F&T traps","https://heatinghelp.com/systems-help-center/what-you-ought-to-know-about-f-and-t-traps/"],
 hol2:["Dan Holohan: The rules for steam traps","https://www.supplyht.com/articles/101044-dan-holohan-the-rules-for-steam-traps"],
 gw:["Goodwin: Upright (open top) bucket steam trap","https://goodwindco.in/blog/upright-bucket-steam-trap-open-top-bucket-trap/"],
 ven:["Pollution Solutions: venturi orifice steam traps (manufacturer article)","https://pollutionsolutions-online.com/article/green-energy/42/thermal-energy-international/venturi-orifice-steam-traps-reduce-energy-costs-and-co2-emissions/1253/download"]};
/* what each trap does in each stage, and its pros and cons (from the sources listed with it) */
const INFO={
 ib:{steps:["The trap must be primed: its body stays full of water, which is the water seal. Air that gets under the bucket can float it and hold the valve shut. It leaks out through the small vent hole in the top of the bucket, so an inverted bucket gets rid of air slowly.",
  "With the bucket down, its weight on the lever holds the valve off the seat. Condensate comes in under the bucket, flows out under its lip, up the outside and out the seat at the top of the body. The lever multiplies the bucket's pull so it can open against system pressure.",
  "Steam rises into the bucket and pushes the water out of it. The bucket becomes buoyant, floats up, and the lever pushes the valve into the seat. The seat stays under water, so steam never reaches it.",
  "Steam in the bucket condenses or bleeds out through the vent hole and condenses at the top. When enough is gone the bucket sinks, the valve snaps open and the trap discharges in a burst. It discharges in cycles (intermittently) but drains continuously, so condensate does not back up."],
  pros:["Handles high pressure (Armstrong's 980 series is rated to 600 psig)","Stands up to water hammer; the open-bottom bucket is not crushed","Valve and seat sit at the top, so dirt does not settle on the orifice","Usually fails open, so the line keeps draining","Works with superheat if an inlet check valve is fitted"],
  cons:["Vents air slowly; an outside air vent in parallel shortens start-up","Can lose its water seal (prime) if a sudden pressure drop makes the water flash; then it blows steam","Needs an inlet check valve where pressure swings or there is superheat","Cast iron bodies can freeze and crack in exposed spots","Narrow working pressure range: above its rated differential it stays shut"],
  uses:"Steam main drips at higher pressures, superheated lines (with a check valve), separators, and most process equipment (Armstrong).",
  fails:"Usually fails open (blowing steam). Loses prime and blows steam; a blocked vent hole air-binds it.",src:["ssm","arb","ar","tlv","watts","ins","arg"]},
 ft:{steps:["At start-up the thermostatic air vent is cool and wide open, so air pushed ahead of the steam leaves through it straight to the outlet. Cold condensate collects in the bottom while the float valve is still shut.",
  "As condensate collects, the ball float rises with the water level and the lever pulls the valve off the seat. The more condensate, the higher the float and the wider the valve. The seat is always under water, so steam can't reach it.",
  "Steam fills the space above the water. The air vent's sealed element heats up and closes the vent. The float keeps the water level steady and lets condensate out as fast as it forms, at steam temperature, with no backup.",
  "When the load drops, the level falls and the float shuts the valve. A pool of water stays over the seat as a seal. If air or other gases collect later, the vent cools and opens again."],
  pros:["Discharges continuously, as fast as condensate forms: no backup in the coil","Excellent air venting through its thermostatic vent","Handles heavy and light loads and quick changes in pressure or flow","Large capacity for its size","First choice for modulating equipment such as unit heaters, coils and heat exchangers"],
  cons:["Damaged by freezing: lag the body or add a small thermostatic drain","Weaker against water hammer than an inverted bucket (Armstrong rates it poor; Spirax says it copes in many cases)","Internals are sized for a pressure range; above its rating the valve can't open","Usually fails closed, so the equipment floods"],
  uses:"Unit heaters, air handler coils, heat exchangers, separators, and drips and ends of steam mains in building systems.",
  fails:"Fails closed from dirt or a collapsed float.",src:["ssm","ssh","ssmain","watts","hol","ins","arg"]},
 ff:{steps:["The ball itself is the valve: there is no lever. When condensate arrives the ball floats up off the seat and water starts to leave.",
  "The ball rides on the water level and lets condensate out as fast as it comes, right away, which keeps condensate from backing up and helps prevent water hammer.",
  "When the flow drops, the ball settles back on the seat. The seat stays under water, so steam leakage is very low."],
  pros:["Discharges right away, so condensate does not back up","Low steam leakage thanks to the water seal","Can survive freezing if it drains to atmosphere and the body does not deform (TLV)","TLV makes them for very high pressure"],
  cons:["Our sources did not cover its air venting, so check the manufacturer's data"],
  uses:"TLV recommends it first for draining equipment, steam mains and high-temperature tracing.",
  fails:"Not covered by our sources.",src:["tlv","tlvs"]},
 ob:{steps:["An old design, seldom made today. The bucket is open at the top and floats in the condensate that fills the body. A rod on the bucket holds the valve on its seat.",
  "Condensate keeps coming in and spills over the rim into the bucket.",
  "When the bucket is heavy enough it sinks and pulls the valve open. Steam pressure on the water pushes condensate up the discharge tube from the bottom of the bucket and out.",
  "As the bucket empties it floats again and shuts the valve."],
  pros:["Simple, robust mechanism"],
  cons:["Historical: seldom manufactured today","Air venting not covered by our sources"],
  uses:"Older process installations. You may meet one in an old plant; it is not a building-HVAC choice today.",
  fails:"Not covered by our sources.",src:["gw"]},
 bp:{steps:["The capsule holds a liquid mix that boils a little below the temperature of steam at the same pressure. Cold, the capsule is relaxed and the valve is wide open, so air and cold condensate pour out.",
  "As condensate near steam temperature reaches the trap, the fill boils. Its vapor pressure swells the capsule and pushes the valve into the seat before steam gets there.",
  "Closed, condensate collects ahead of the trap and gives off heat. It has to cool a little below steam temperature before the trap opens, so it holds some condensate back.",
  "Once the condensate has cooled enough, the fill condenses, the capsule shrinks and the valve opens. Because the fill follows the steam curve, the trap adjusts itself to the working pressure."],
  pros:["Small and light with a big capacity for its size","Wide open when cold: very good air venting","Adjusts itself to the steam pressure","Tolerates up to about 70 °C (126 °F) of superheat","Capsule and seat can be replaced in the line; unlikely to freeze in exposed spots"],
  cons:["Waits for condensate to cool, so equipment can waterlog","Older bellows types were hurt by water hammer and corrosive condensate (welded stainless capsules are better)","Not for steam mains, heat exchangers or critical tracing"],
  uses:"Radiators below about 2 bar g (29 psig), convectors, and as air vents. Spirax's first choice for radiators.",
  fails:"Spirax suggests changing the element about every 3 years.",src:["sst","ssh","sstest","tlv"]},
 rad:{steps:["This is the radiator trap of a two-pipe steam system, at the outlet end of the radiator. At start-up the bellows is short and the plug is off the seat, so air and condensate leave for the dry return.",
  "Steam reaches the trap and heats the sealed bellows. The water or water-alcohol inside flashes to vapor, the pressure inside rises, and the bellows stretches until the plug seats in the outlet. Steam stays in the radiator.",
  "The steam in the radiator condenses as it gives up its heat. Condensate fills the trap body around the bellows.",
  "The cooler condensate cools the bellows, its pressure drops, it shrinks and lifts the plug. Steam pressure pushes the condensate out, and the cycle repeats."],
  pros:["Keeps steam out of the return, which would waste energy, reheat condensate and cause steam binding and water hammer","Simple and small; serviced by removing the hex cap"],
  cons:["The bellows fatigues: about 180,000 cycles a year (1,000 heating hours), so about 3 to 5 years of life","Fails suddenly, and a failed-open trap is easy to miss because the radiator still heats"],
  uses:"Radiators and convectors on two-pipe steam.",
  fails:"Either way. A ruptured bellows can stay short (fails open: steam blows into the return) or drop and block the outlet (fails closed: the radiator stops heating). Replace bellows as routine maintenance.",src:["em","em2","ins","watts"]},
 bm:{steps:["Bimetal discs (two metals welded together) are flat when cold, and the valve, on the outlet side of the seat, is wide open. Air and cold condensate pass freely.",
  "As hot condensate heats them, the discs bend and pull the stem, drawing the valve onto the seat from the outlet side.",
  "Closed, condensate backs up and cools. A plain bimetal element waits for more cooling at higher pressure, so these traps usually need 1 to 3 m (3 to 10 ft) of bare cooling leg ahead of them.",
  "Cooled enough, the discs relax and the valve opens. Some designs snap open and discharge in a blast, which helps keep them clean."],
  pros:["Compact with a high capacity","Resists water hammer, corrosion and high pressure","Drains freely, so it resists freezing in exposed spots","Can be serviced in the line"],
  cons:["Holds condensate back (subcooled discharge): not for equipment that needs instant removal","Slow to respond to load and pressure changes","Prone to dirt blockage","50% back pressure can lower its discharge temperature by up to 50 °C (90 °F)"],
  uses:"Tracer lines and non-critical drains where some backup is fine.",
  fails:"Usually fails open (ASHE).",src:["sst","tlv","sso","ashe"]},
 le:{steps:["An oil-filled element is joined to the valve. Cold, the oil is contracted and the valve is fully open, so air and cold condensate pass.",
  "As the condensate warms, the oil expands, pushes the rod and closes the valve.",
  "It is set to open at a fixed temperature, adjustable from about 60 to 100 °C (140 to 212 °F). If the steam pressure goes up, condensate has to cool further before it opens.",
  "When the condensate cools to the setting, the oil contracts and the valve opens. The outlet must point up so the element stays under water."],
  pros:["Drains cold condensate well (good start-up drain)","Tolerates vibration and water hammer","Adjustable discharge temperature"],
  cons:["Corrosive condensate or superheat can destroy the element","Not for equipment that needs instant condensate removal","Needs insulation where it can freeze","Usually fitted in parallel with another trap"],
  uses:"Start-up and shutdown drains, small tank coils.",
  fails:"Not covered by our sources.",src:["sst"]},
 td:{steps:["At start-up, inlet pressure lifts the disc. Cool condensate and air flow out from the inner seat ring, under the disc, to the outer groove and the outlet.",
  "As hot condensate arrives it flashes under the disc. The fast-moving flash steam makes a low-pressure zone that pulls the disc down onto the seat. You hear it click.",
  "Flash steam trapped in the control chamber above the disc pushes on its whole top area, while the inlet pushes only on the small inner ring, so the disc stays shut. It is typically shut 20 to 40 seconds.",
  "Heat loss through the cap condenses the steam above the disc. The pressure drops, the inlet lifts the disc and the trap discharges again."],
  pros:["One moving part, no adjustment, compact, all stainless","Not bothered by water hammer, vibration or superheat","Robust in exposed spots and resists freezing","Easy to check by listening for the click"],
  cons:["Stops working if back pressure exceeds about 80% of inlet pressure","Needs a minimum inlet pressure (typically 0.25 bar g, about 3.6 psig): not for low-pressure heating","Can air-bind at start-up if pressure rises fast (anti-air-binding discs or a parallel air vent fix it)","Noisy; oversizing makes it cycle more and wear faster"],
  uses:"Steam main drips and ends of mains (Spirax's choice), outdoor mains, high pressure and superheated steam, tracing. Keep it out of noise-sensitive areas.",
  fails:"Usually fails open from disc or seat wear.",src:["ssd","ssmain","tlv","ins","watts","ashe"]},
 imp:{steps:["Flow at start-up pushes up under the piston disc and lifts the main valve wide open. Air cannot bind it.",
  "Some hot condensate flashes in the gap round the piston, and steam bleeds through the hole in the hollow piston into the control chamber above it. That pressure pushes the piston down and throttles the valve to suit the load.",
  "It can't shut dead tight: at light load it keeps bleeding a little steam, and it may pulse."],
  pros:["Big capacity for its size","Cannot air-bind"],
  cons:["Stops working if back pressure is above about 40% of inlet pressure","Does not shut off tight","Fine clearances clog with dirt; light loads cause blowing, noise and hammer","Spirax calls it of limited use today"],
  uses:"Mostly older installations.",fails:"Usually fails open (ASHE).",src:["ssd","ashe"]},
 or:{steps:["A hole of a set size passes the load it was sized for at the pressure it was sized for. No moving parts.",
  "If the load drops, the hole is now too big and live steam blows through after the condensate.",
  "At start-up the load is much bigger than the running load, so condensate backs up and the equipment waterlogs. Size it for start-up instead and it wastes steam when running."],
  pros:["No moving parts"],cons:["Only for steady pressure and steady load","Clogs easily","Not truly automatic; Spirax does not recommend it for varying loads"],
  uses:"Steady loads only.",fails:"Clogs (blocked) or wastes steam when the load changes.",src:["ssd","arg"]},
 ven:{steps:["A venturi-shaped nozzle sized for the job, with no moving parts. Condensate fills the throat and passes continuously.",
  "The maker says flash steam forming in the throat chokes it at light load, so it passes much less live steam than a plain orifice (but not zero).",
  "At start-up the load can be more than it is sized for. The maker claims a high start-up capacity."],
  pros:["No moving parts, continuous discharge (manufacturer's claims)"],
  cons:["The facts here come from a manufacturer article only; we found no independent confirmation","Air venting not covered"],
  uses:"Industrial steady loads. Not a building-HVAC trap.",fails:"Not covered by independent sources.",src:["ven"]},
 lab:{steps:["Condensate passes a row of baffles. Pressure drops at each one, some condensate flashes, and the next space takes up the volume, which holds back live steam.",
  "Nothing is automatic: if it is set too open, or the load drops, steam blows through.",
  "Set too tight, or the load rises, and condensate backs up. It must be re-set by hand whenever pressure or load changes."],
  pros:["Small for its capacity","Little to fail mechanically"],cons:["No automatic action; needs manual adjustment","A wrong setting wastes steam or waterlogs"],
  uses:"Steady loads only.",fails:"Mis-set rather than failed.",src:["ssd"]}};
const FAM=[["Mechanical",["ib","ft","ff","ob"]],["Thermostatic",["bp","rad","bm","le"]],["Thermodynamic",["td","imp"]],["Fixed (no moving parts)",["or","ven","lab"]]];
const CSS=`.taT{font:600 14px var(--display,"Barlow Condensed"),sans-serif;letter-spacing:.07em;fill:#2a3238}.taB{font:700 15px var(--display,"Barlow Condensed"),sans-serif;letter-spacing:.09em}
.taPick{display:grid;gap:8px}.taPick h4{margin:6px 0 0;font:600 12px var(--display,sans-serif);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.taBox{background:#eef1f3;border-radius:8px;border:1px solid var(--panel-edge,#c9d0d4)}.taBox svg{display:block;width:100%;height:auto}
.taStages{display:flex;flex-wrap:wrap;gap:6px}.taStages .btn{font-size:13px}.taStages .btn.on{outline:2px solid var(--brass,#9a6f1f)}
.taNow{min-height:7.5em}.taPC{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){.taPC{grid-template-columns:1fr}}
.taPC ul{margin:4px 0 0;padding-left:18px;font-size:14px}.taPC h4{margin:0}.taKey{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--muted);padding:6px 10px}
.taKey i{display:inline-block;width:14px;height:10px;border-radius:2px;margin-right:5px;vertical-align:middle}
.taTbl{width:100%;border-collapse:collapse;font-size:13.5px}.taTbl th,.taTbl td{border-bottom:1px solid var(--panel-edge,#ccd);padding:6px 8px;text-align:left;vertical-align:top}.taTbl th{font:600 12px var(--display,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.taWrap{overflow-x:auto}.taG{color:var(--ok,#1e9a4a);font-weight:600}.taP{color:var(--bad,#c0392b);font-weight:600}`;
const srcList=keys=>`<ul class="lsSrc">${keys.map(k=>`<li><a href="${SRC[k][1]}" target="_blank" rel="noopener">${SRC[k][0]}</a></li>`).join("")}</ul>`;
/* ---------- Cutaways ---------- */
let V={k:"ib",play:true,spd:1,lab:true,s:0,p:0,t:0},raf=0,last=0,acc=0;
function mountCut(el){
 el.innerHTML=`<style>${CSS}</style><div class="lsSee"><div class="drawing"><div class="taBox"><svg id="taSvg" viewBox="0 0 800 470" role="img" aria-label="Steam trap cut in half"></svg>
  <div class="taKey"><span><i style="background:${TA.W}"></i>Condensate</span><span><i style="background:${TA.S}"></i>Steam</span><span><i style="background:${TA.A};border-radius:50%;width:10px"></i>Air</span><span><i style="background:repeating-linear-gradient(45deg,#8e979d 0 3px,#5d666c 3px 4px)"></i>Cut metal</span></div></div>
  <div class="group taNow"><h3 id="taStT"></h3><p id="taStB"></p></div>
  <div class="group"><h3>Run it</h3><div class="btns"><button class="btn blue" id="taPlay">Pause</button></div><div class="taStages" id="taStages"></div>
   <div class="row"><label for="taSpd">Speed</label><output id="taoSpd"></output><input type="range" id="taSpd" min="0.25" max="2" step="0.25" value="1"></div>
   <label class="lsChk"><input type="checkbox" id="taLab" checked> Show part names</label><p class="note">Slowed down a lot. Colors follow the Engineering Mindset: blue condensate, red steam.</p></div>
</div>
 <div class="lsSide"><div class="group"><h3>Pick a trap</h3><div class="taPick">${FAM.map(([f,ks])=>`<h4>${f}</h4><div class="btns">${ks.map(k=>`<button class="btn" data-trap="${k}">${TA.T[k].name.replace(/ \(.*\)/,"")}</button>`).join("")}</div>`).join("")}</div></div>
  <div class="group" id="taInfo"></div></div></div>`;
 el.addEventListener("click",e=>{const b=e.target.closest("[data-trap]");if(b){setTrap(b.dataset.trap);return}
  const s=e.target.closest("[data-st]");if(s){V.s=+s.dataset.st;V.p=V.play?0:.6;draw(true);return}
  if(e.target.id==="taPlay"){V.play=!V.play;e.target.textContent=V.play?"Pause":"Play"}});
 $("taSpd").addEventListener("input",e=>{V.spd=+e.target.value;$("taoSpd").textContent=V.spd+"x"});$("taoSpd").textContent="1x";
 $("taLab").addEventListener("change",e=>{V.lab=e.target.checked;draw(true)});
 setTrap(V.k);
 const loop=now=>{raf=requestAnimationFrame(loop);const dt=Math.min(.1,(now-(last||now))/1000);last=now;if(!document.getElementById("taSvg")||$("tab-cut").hidden)return;
  if(V.play){const T=TA.T[V.k];V.t+=dt*V.spd;V.p+=dt*V.spd/T.stages[V.s].d;if(V.p>=1){V.p=0;V.s=(V.s+1)%T.stages.length;if(V.s===0&&T.stages.length>3&&V.k!=="ob")V.s=1;draw(true)}}
  acc+=dt;if(acc>1/30){acc=0;draw()}};
 raf=requestAnimationFrame(loop)}
function setTrap(k){V.k=k;V.s=0;V.p=0;const T=TA.T[k],I=INFO[k];
 document.querySelectorAll("[data-trap]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.trap===k));
 $("taSvg").innerHTML=TA.defs()+`<g>${T.stat()}</g><g id="taDy"></g><g id="taLb"></g>`;
 $("taSvg").setAttribute("aria-label",T.name+", cut in half");
 $("taStages").innerHTML=T.stages.map((s,i)=>`<button class="btn" data-st="${i}">${i+1}. ${s.l}</button>`).join("");
 $("taInfo").innerHTML=`<h3>${T.name}</h3><p class="note">${T.fam} trap.</p><div class="taPC"><div><h4 class="taG">Pros</h4><ul>${I.pros.map(x=>`<li>${x}</li>`).join("")}</ul></div><div><h4 class="taP">Cons</h4><ul>${I.cons.map(x=>`<li>${x}</li>`).join("")}</ul></div></div>
  <h4>Where it's used</h4><p>${I.uses}</p><h4>How it fails</h4><p>${I.fails}</p><details><summary>Sources</summary>${srcList(I.src)}</details>`;
 draw(true)}
function draw(full){const T=TA.T[V.k],st={s:V.s,p:V.p,t:V.t};$("taDy").innerHTML=T.dyn(st);$("taLb").innerHTML=V.lab&&T.labels?T.labels(st):"";
 if(full){$("taStT").textContent=`Step ${V.s+1} of ${T.stages.length}: ${T.stages[V.s].l}`;$("taStB").textContent=INFO[V.k].steps[V.s];
  document.querySelectorAll("[data-st]").forEach(b=>b.classList.toggle("on",+b.dataset.st===V.s))}}
/* ---------- Compare ---------- */
const CMP=[["Inverted bucket","Mechanical","Intermittent bursts, drains without backup","Slow (vent hole)","Excellent","Good (stainless); cast iron can crack","Vulnerable","Usually open"],
 ["Float and thermostatic","Mechanical","Continuous, at steam temperature","Excellent (thermostatic vent)","Poor (Armstrong); OK in many cases (Spirax)","Poor: lag it","Quite tolerant","Closed"],
 ["Free float","Mechanical","Continuous, immediate","Not covered","Reduces hammer (TLV)","OK draining to atmosphere (TLV)","Not covered","Not covered"],
 ["Balanced pressure","Thermostatic","Cycles; holds condensate until slightly subcooled","Excellent (open when cold)","Poor in old bellows types; welded capsules better","Good","Least affected","Element life about 3 years"],
 ["Radiator (bellows)","Thermostatic","Cycles","Excellent (open when cold)","Not covered","Not covered","Not covered","Open or closed"],
 ["Bimetallic","Thermostatic","Subcooled; some snap-action blast","Excellent (open when cold)","Excellent","Good (drains freely)","Prone to blockage","Usually open"],
 ["Liquid expansion","Thermostatic","Subcooled, fixed temperature","Good (open when cold)","Tolerant","Needs insulation","Not covered","Not covered"],
 ["Thermodynamic disc","Thermodynamic","Intermittent; shut 20 to 40 s at a time","Can air-bind if pressure rises fast","Excellent","Good","Not covered","Usually open"],
 ["Impulse","Thermodynamic","Modulating, never dead tight","Cannot air-bind","Light loads cause hammer","Not covered","Intolerant","Usually open"],
 ["Fixed orifice","Fixed","Continuous","None","Good (Armstrong)","Excellent (Armstrong)","Clogs easily","Clogs, or wastes steam"],
 ["Venturi orifice","Fixed","Continuous (maker's claim)","Not covered","Not covered","Not covered","Not covered","Not covered"],
 ["Labyrinth","Fixed","Continuous","None","Not covered","Not covered","Not covered","Mis-set"]];
function mountCmp(el){el.innerHTML=`<style>${CSS}</style><div class="group"><h3>All the traps side by side</h3><p>Ratings are what the sources say. "Not covered" means we did not find it in a source we could check, so it is left out rather than guessed. Manufacturers do not always agree (water hammer on F&amp;T traps is the clearest case).</p>
 <div class="taWrap"><table class="taTbl"><thead><tr><th>Trap</th><th>Family</th><th>How it discharges</th><th>Air venting</th><th>Water hammer</th><th>Freezing</th><th>Dirt</th><th>Usually fails</th></tr></thead><tbody>${CMP.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>
 <h4>The three families</h4><ul><li><b>Mechanical</b> traps work on the difference in density between steam and condensate (a float or bucket).</li><li><b>Thermostatic</b> traps work on temperature: condensate cools below steam temperature, steam doesn't.</li><li><b>Thermodynamic</b> traps work on how flash steam moves (disc, impulse, labyrinth). Fixed orifices are often grouped here but are not really automatic.</li></ul>
 <details><summary>Sources</summary>${srcList(["ss","ssm","sst","ssd","tlv","arg","ssc","ashe","em"])}</details></div>`}
/* ---------- Choose ---------- */
const PICK=[["Radiators and convectors (low-pressure two-pipe)","Thermostatic (balanced pressure or bellows radiator trap)","Balanced pressure with a strainer","Spirax; Engineering Mindset; InspectApedia"],
 ["Unit heaters and air heater coils","Small F&amp;T, fitted close to the unit","Inverted bucket with a parallel air vent","Spirax"],
 ["Heat exchangers (converters)","F&amp;T below the outlet","Pump-trap if it drains into positive pressure","Spirax"],
 ["Modulating coils that can stall","Pump-trap or a vacuum breaker; size the float trap on the stall load","","Spirax; TLV"],
 ["Steam main drips","Low-capacity thermodynamic (Spirax) / inverted bucket (Armstrong)","F&amp;T (Armstrong; also common on low-pressure building mains)","Spirax; Armstrong; InspectApedia"],
 ["End of a main (dead end)","Thermodynamic (Spirax) / F&amp;T in low-pressure buildings","Inverted bucket; always with an air vent","Spirax; Holohan"],
 ["Separators","F&amp;T (Spirax) / inverted bucket (Armstrong)","Inverted bucket with air vent or thermodynamic","Spirax; Armstrong"],
 ["Steam headers","Float trap (Spirax) / inverted bucket (Armstrong)","F&amp;T (not on superheat)","Spirax; Armstrong"],
 ["Tracer lines","Balanced-pressure tracing trap or thermodynamic (Spirax) / inverted bucket (Armstrong)","Bimetallic for non-critical tracing","Spirax; Armstrong"],
 ["Superheated lines","Inverted bucket with an internal check valve","Thermodynamic","Armstrong; Spirax"]];
const SF=[["Boiler headers","1.5 : 1"],["Steam mains, boiler to end of main","2 : 1"],["End of main, or ahead of a valve that is shut part of the time","3 : 1"],["Branch lines","3 : 1"],["Separators","3 : 1"],["Tracers","2 : 1"]];
function mountPick(el){el.innerHTML=`<style>${CSS}</style><div class="group"><h3>Which trap goes where</h3><p>There is no single right answer: Spirax Sarco and Armstrong each make their own first choices, and both are shown. Always follow the equipment and trap manufacturer.</p>
 <div class="taWrap"><table class="taTbl"><thead><tr><th>Job</th><th>First choice</th><th>Alternate</th><th>Source</th></tr></thead><tbody>${PICK.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]||"—"}</td><td>${r[3]}</td></tr>`).join("")}</tbody></table></div></div>
 <div class="group"><h3>In a low-pressure two-pipe building</h3><ul><li>Each radiator or convector has a <b>thermostatic trap</b> at its outlet, opposite the supply valve.</li><li><b>F&amp;T traps</b> drain the ends of steam mains, risers and drips, and protect the condensate or vacuum pump: they keep steam out of the receiver, where flash steam would make the pump cavitate.</li><li>Drip the main every <b>100 to 150 ft</b> of straight run, at rises, low points and ahead of expansion loops.</li><li><b>One trap per piece of equipment.</b> Don't gang several coils into one trap, and don't put two traps in series.</li><li>Don't size an F&amp;T by pipe size: a small trap often has plenty of capacity. Size on load and pressure difference.</li><li>A trap rated for low pressure won't stay shut on high-pressure steam, and a high-pressure trap may not pass condensate on a low-pressure system.</li></ul></div>
 <div class="group"><h3>Safety factors (Armstrong)</h3><p>Traps are sized larger than the running load to cover start-up. Armstrong's general range is 1.5 : 1 to 10 : 1. Oversizing wears traps faster.</p><table class="taTbl"><tbody>${SF.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</tbody></table><p class="note">We did not find a published safety factor specific to low-pressure building heating.</p></div>
 <details class="group"><summary>Sources</summary>${srcList(["ssh","ssmain","ssp","sso","tlvs","arg","em","ins","watts","hol","hol2"])}</details>`}
/* ---------- Test ---------- */
const LEAK={sizes:["1/8 in.","1/4 in.","3/8 in."],p:[15,100,150,300],t:[[13.7,52.8,75.8,145],[54.7,211,303,579],[123,475,682,1303]]};
function mountTest(el){el.innerHTML=`<style>${CSS}</style><div class="group"><h3>Three ways a trap can be</h3><ul><li><b>Working:</b> opens for condensate and air, shuts on steam.</li><li><b>Failed open (leaking or blowing):</b> live steam goes into the return. The equipment still heats, so it's easy to miss, but it wastes steam and can heat the return and the receiver.</li><li><b>Failed closed (blocked):</b> condensate backs up. The coil or radiator goes cold, and you can get water hammer and frozen coils.</li></ul></div>
 <div class="group"><h3>How to test</h3><ul>
  <li><b>Sound (ultrasonic):</b> the best single check. A leak sounds like a compressed air leak or a whistle; a blocked trap is quiet. Novices often misread it, so learn what each type sounds like when it's good.</li>
  <li><b>Temperature (infrared or contact):</b> best on the <b>inlet</b> side. A cold inlet means blocked. Temperature alone can't tell a steam leak from normal flash steam, because both are at the same temperature.</li>
  <li><b>Both together:</b> TLV and Fluke recommend using sound and temperature together.</li>
  <li><b>Look (test valve or open discharge):</b> normal flash steam is a lazy, billowy plume. Live steam is a sharp, fast, clear jet right at the outlet. On an F&amp;T, a working trap spits water and vapor; a failed one blows steam (Holohan).</li>
  <li><b>Sight glass</b> after the trap, or a trap with a built-in sensor.</li></ul>
  <h4>What normal looks like</h4><ul><li><b>F&amp;T:</b> steady, continuous flow. A thermometer is no help: it discharges at steam temperature.</li><li><b>Inverted bucket:</b> cycles: a burst, then nothing.</li><li><b>Thermodynamic disc:</b> a regular click, typically shut 20 to 40 seconds between.</li><li><b>Thermostatic:</b> opens and closes as condensate cools; the outlet runs cooler than the steam.</li><li><b>Impulse:</b> opens and closes often at light load, continuous at heavy load.</li></ul></div>
 <div class="group"><h3>What a failed-open trap costs</h3><p>Steam lost through a trap stuck wide open to atmosphere (US DOE/NREL table, from the Boiler Efficiency Institute).</p>
  <div class="row"><label for="taOr">Orifice</label><output id="taoOr"></output><input type="range" id="taOr" min="0" max="2" step="1" value="0"></div>
  <div class="row"><label for="taPr">Steam pressure</label><output id="taoPr"></output><input type="range" id="taPr" min="0" max="3" step="1" value="0"></div>
  <div class="row"><label for="taHr">Hours a year it runs</label><output id="taoHr"></output><input type="range" id="taHr" min="500" max="8760" step="100" value="4000"></div>
  <div class="row"><label for="taCost">Your steam cost, $ per 1,000 lb</label><output id="taoCost"></output><input type="range" id="taCost" min="5" max="30" step="1" value="10"></div>
  <div class="lsReads" id="taLeak"></div><p class="note">Hours and steam cost are yours to set; $10 per 1,000 lb is the figure Armstrong uses in its own example. Real traps rarely fail all the way open, so treat this as the worst case for that orifice.</p></div>
 <div class="group"><h3>How often to check (US DOE / NREL)</h3><table class="taTbl"><tbody><tr><th scope="row">150 psig and up</th><td>Weekly to monthly</td></tr><tr><th scope="row">30 to 150 psig</th><td>Monthly to quarterly</td></tr><tr><th scope="row">Below 30 psig (most building heating)</th><td>Once a year</td></tr></tbody></table>
  <p>NREL reports that where traps are not maintained for 3 to 5 years, 15 to 30% of them have failed; with regular maintenance, fewer than 5% leak.</p></div>
 <details class="group"><summary>Sources</summary>${srcList(["sstest","tlvt","nrel","ashe","hol","arg","ssd"])}</details>`;
 const upd=()=>{const o=+$("taOr").value,p=+$("taPr").value,h=+$("taHr").value,c=+$("taCost").value;const lb=LEAK.t[o][p];
  $("taoOr").textContent=LEAK.sizes[o];$("taoPr").textContent=LEAK.p[p]+" psig";$("taoHr").textContent=h.toLocaleString("en-US");$("taoCost").textContent="$"+c;
  $("taLeak").innerHTML=K.reads([["Steam lost",lb+" lb/h"],["Per year",Math.round(lb*h/1000).toLocaleString("en-US")+",000 lb"],["Cost per year","$"+(Math.round(lb*h/1000*c/10)*10).toLocaleString("en-US"),true]])};
 ["taOr","taPr","taHr","taCost"].forEach(i=>$(i).addEventListener("input",upd));upd()}
window.LESSON={id:"trap-tool",sec:"Steam",secHref:"/steam/",title:"Steam traps",
 lead:"Every common steam trap cut in half and running: watch air, condensate and steam move through it, then compare them, pick one for the job and test it.",
 tabs:[{id:"cut",label:"Cutaways",mount:mountCut},{id:"cmp",label:"Compare",mount:mountCmp},{id:"pick",label:"Choose",mount:mountPick},{id:"test",label:"Test",mount:mountTest}]};
})();
