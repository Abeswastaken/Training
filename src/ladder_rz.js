/* ---------- part cards: realistic picture + field notes for each ladder symbol ---------- */
const LT=(x,y,s,sz=12,f="#1d2327",a="middle",w=600)=>`<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${f}" font-family="var(--display)" font-weight="${w}">${s}</text>`;
const LBOX=(x,y,w,h,f,r=4,st="#4d555a")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${st}" stroke-width="1.4" filter="url(#zShadow)"/>`;
const LLUG=(x,y)=>`<rect x="${x-9}" y="${y-6}" width="18" height="12" rx="2" fill="url(#zBrassH)" stroke="#6a4a12"/>${zScrew(x,y,4)}`;
const relayPic=(lbl,sub)=>zShade(170,226,90,6)+`<rect x="110" y="190" width="120" height="32" rx="3" fill="url(#zPlasticDk)" stroke="#000"/>`+[128,152,176,200,222].map(x=>`<rect x="${x-4}" y="208" width="8" height="20" fill="url(#zBrass)"/>`).join("")+
 LBOX(100,40,140,156,"rgba(198,214,226,.55)",6,"#5f686d")+`<rect x="122" y="70" width="44" height="96" rx="4" fill="url(#zWind)" stroke="#5a2e10"/><rect x="132" y="60" width="24" height="10" fill="url(#zSteelH)"/>`+
 `<path d="M180 80 h30 M180 120 h30 M180 160 h30" stroke="url(#zBrass)" stroke-width="5" stroke-linecap="round"/><path d="M178 120 L208 84" stroke="#c4cacf" stroke-width="4"/>`+LT(170,30,lbl,15)+LT(170,246,sub,11,"#3b4449","middle",500);
const LPIC={
 relay:()=>relayPic("CONTROL RELAY","coil (center) moves the contacts beside it"),
 contactor:()=>ZILL.contactor,
 timer:()=>zShade(170,226,80,6)+LBOX(105,36,130,180,"url(#zPlastic)",6,"#8f887a")+`<rect x="118" y="50" width="104" height="28" rx="3" fill="url(#zPlasticDk)"/>`+LT(170,69,"ON-DELAY",12,"#e9ecee")+
  `<circle cx="170" cy="128" r="34" fill="url(#zSteelH)" stroke="#4d555a"/><circle cx="170" cy="128" r="26" fill="#f4f2ea"/>${[0,1,2,3,4,5,6,7,8,9].map(i=>{const a=(-135+i*30)*Math.PI/180;return `<line x1="${170+20*Math.cos(a)}" y1="${128+20*Math.sin(a)}" x2="${170+25*Math.cos(a)}" y2="${128+25*Math.sin(a)}" stroke="#1d2327" stroke-width="1.5"/>`}).join("")}`+
  `<line x1="170" y1="128" x2="186" y2="112" stroke="#c0281c" stroke-width="3" stroke-linecap="round"/><circle cx="170" cy="128" r="4" fill="#1d2327"/>`+LT(170,184,"0.1 s – 10 min",10,"#3b4449")+
  [130,170,210].map(x=>LLUG(x,202)).join("")+LT(170,246,"dial sets the delay; contacts change when it times out",11,"#3b4449","middle",500),
 ol:()=>zShade(170,226,90,6)+LBOX(90,60,160,162,"url(#zPlasticDk)",5,"#000")+[120,170,220].map(x=>LLUG(x,78)+`<rect x="${x-10}" y="96" width="20" height="40" rx="3" fill="url(#zCuV)" stroke="#5a2a12"/>`).join("")+
  `<circle cx="130" cy="170" r="16" fill="url(#zSteelH)" stroke="#000"/><line x1="122" y1="170" x2="138" y2="170" stroke="#1d2327" stroke-width="3"/><rect x="175" y="156" width="56" height="14" rx="3" fill="#2f6fd6"/>`+LT(203,167,"RESET",9,"#fff")+
  LLUG(185,194)+LLUG(222,194)+LT(204,214,"95  96 (NC)",9,"#e9ecee")+LT(170,46,"THERMAL OVERLOAD RELAY",14)+LT(170,246,"heaters in the motor leads; the NC contact (95-96) opens on overload",11,"#3b4449","middle",500),
 pbno:()=>pbPic("#2f9a4a","#0e3a1a","START (NO)"),
 pbnc:()=>pbPic("#d23a26","#5a0b07","STOP (NC)"),
 sw:()=>zShade(170,220,70,6)+LBOX(120,50,100,160,"url(#zPlastic)",6,"#8f887a")+zScrew(170,64,4)+zScrew(170,196,4)+`<rect x="152" y="104" width="36" height="52" rx="5" fill="url(#zSteel)" stroke="#5f686d"/><path d="M170 130 L186 86" stroke="url(#zSteel)" stroke-width="12" stroke-linecap="round"/><circle cx="187" cy="84" r="7" fill="url(#zSteelH)" stroke="#5f686d"/>`+
  LT(170,100,"ON",11,"#1e7a3a")+LT(170,176,"OFF",11,"#5b666d")+LT(170,34,"TOGGLE SWITCH",14)+LT(170,240,"maintained: stays where you put it",11,"#3b4449","middle",500),
 tstat:()=>tstatPic(),
 hps:()=>pswPic("HPS","#ff8a7a","HIGH PRESSURE SWITCH","on the discharge line; manual or auto reset"),
 lps:()=>pswPic("LPS","#8fc3ff","LOW PRESSURE SWITCH","on the suction line; opens on loss of charge"),
 disc:(lbl,sub)=>zShade(170,200,60,6)+`<rect x="110" y="96" width="120" height="80" rx="10" fill="url(#zAluTop)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="128" y="110" width="84" height="52" rx="26" fill="url(#zSteelH)" stroke="#5f686d"/>`+
  `<circle cx="170" cy="136" r="18" fill="url(#zAlu)" stroke="#5f686d"/>`+[120,220].map(x=>`<rect x="${x-6}" y="168" width="12" height="40" fill="url(#zBrass)"/><path d="M${x} 208 v20" stroke="#1d2327" stroke-width="5"/>`).join("")+LT(170,60,lbl,14)+LT(170,246,sub,11,"#3b4449","middle",500),
 motor:()=>{const cl=(x1,x2,y)=>{let d=`M${x1} ${y}`;for(let i=0;i<5;i++)d+=` a${(x2-x1)/10} ${(x2-x1)/10} 0 0 1 ${(x2-x1)/5} 0`;return d};
  return zShade(118,216,90,6)+`<circle cx="118" cy="130" r="80" fill="url(#zSteel)" stroke="#3b4247" stroke-width="2" filter="url(#zShadow)"/><circle cx="118" cy="130" r="70" fill="#eef1f3" stroke="#6f787e"/>`+
  `<path d="M66 130 V100 H82 M148 100 H164 M66 130 V160 H82 M138 160 H154" stroke="#b5651d" stroke-width="3" fill="none"/>`+
  `<path d="${cl(82,148,100)}" stroke="#b5651d" stroke-width="3.5" fill="none"/><path d="${cl(82,138,160)}" stroke="#b5651d" stroke-width="2.2" fill="none"/>`+
  `<circle cx="66" cy="130" r="4" fill="#1d2327"/><circle cx="164" cy="100" r="4" fill="#1d2327"/><circle cx="154" cy="160" r="4" fill="#1d2327"/>`+
  LT(54,134,"C",12)+LT(174,116,"R",12)+LT(164,176,"S",12)+LT(115,88,"RUN WINDING",10,"#3b4449")+LT(110,182,"START WINDING",10,"#3b4449")+
  `<path d="M66 130 C40 40 200 20 252 70 M164 100 C210 100 262 110 270 86 M154 160 C230 176 296 130 288 86" stroke="#1d2327" stroke-width="2" fill="none"/>`+
  `<rect x="238" y="58" width="64" height="40" rx="5" fill="url(#zPlasticDk)" stroke="#000"/>`+[252,270,288].map((x,i)=>LLUG(x,78)+LT(x,52,["C","R","S"][i],13)).join("")+
  `<rect x="276" y="150" width="50" height="62" rx="8" fill="url(#zAlu)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="286" y="144" width="8" height="8" fill="url(#zBrassH)"/><rect x="308" y="144" width="8" height="8" fill="url(#zBrassH)"/>`+
  LT(301,176,"RUN",10)+LT(301,190,"CAP",10)+LT(301,204,"5 µF",9,"#3b4449")+
  `<path d="M290 144 C288 124 272 112 270 92 M312 144 C312 122 294 112 288 92" stroke="#c0281c" stroke-width="2" fill="none"/>`+
  LT(170,22,"PSC MOTOR: C, R, S AND RUN CAPACITOR",13)+LT(170,240,"C to R = run winding (lowest ohms), C to S = start winding; the cap goes R to S",10.5,"#3b4449","middle",500)},
 lamp:()=>zShade(170,226,60,6)+`<rect x="140" y="140" width="60" height="80" rx="4" fill="url(#zPlasticDk)" stroke="#000"/><rect x="132" y="128" width="76" height="16" rx="3" fill="url(#zSteel)"/>`+
  `<circle cx="170" cy="96" r="38" fill="#3fdc6c" stroke="#1e7a3a" stroke-width="2" filter="url(#zGlow)"/><ellipse cx="158" cy="82" rx="12" ry="8" fill="rgba(255,255,255,.55)"/>`+LLUG(152,200)+LLUG(188,200)+LT(170,40,"PILOT LIGHT",14)+LT(170,246,"rated for the control voltage (24 V or 120 V)",11,"#3b4449","middle",500),
 sol:()=>zShade(170,226,110,6)+`<rect x="40" y="178" width="260" height="22" fill="url(#zCuH)" stroke="#5a2a12"/>`+LBOX(120,160,100,52,"url(#zBrassH)",5,"#5e400e")+`<rect x="150" y="128" width="40" height="34" fill="url(#zSteelH)"/>`+
  LBOX(122,56,96,76,"url(#zPlasticDk)",4,"#000")+LT(170,96,"24 VAC",12,"#e9ecee")+`<path d="M138 56 q-10 -30 -30 -32 M202 56 q10 -30 30 -32" stroke="#e8c33a" stroke-width="3" fill="none"/>`+LT(170,30,"SOLENOID VALVE",14)+LT(170,246,"coil (black) lifts the plunger; arrow on the body shows flow",11,"#3b4449","middle",500),
 heat:()=>zShade(170,220,120,6)+LBOX(40,90,260,80,"url(#zSteelH)",4)+`<rect x="52" y="102" width="236" height="56" fill="#2a2f33"/><path d="M60 130 ${Array.from({length:22},(_,i)=>`L${70+i*10} ${i%2?112:148}`).join(" ")} L284 130" stroke="#ff7a2a" stroke-width="4" fill="none" filter="url(#zGlow)"/>`+
  LLUG(70,184)+LLUG(270,184)+LT(170,70,"RESISTANCE HEATER (STRIP)",14)+LT(170,240,"nichrome element; check ohms with power off",11,"#3b4449","middle",500),
 buzz:()=>zShade(170,220,60,6)+`<circle cx="170" cy="130" r="60" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*45*Math.PI/180;return `<circle cx="${170+30*Math.cos(a)}" cy="${130+30*Math.sin(a)}" r="4" fill="#111"/>`}).join("")}<circle cx="170" cy="130" r="8" fill="#111"/>`+
  `<path d="M246 100 q14 30 0 60 M262 88 q22 42 0 84" stroke="#c0281c" stroke-width="3" fill="none"/>`+LT(170,44,"ALARM BUZZER",14)+LT(170,240,"sounds when its rung is energized",11,"#3b4449","middle",500),
 term:()=>zShade(170,200,120,6)+LBOX(40,110,260,60,"url(#zPlastic)",4,"#8f887a")+["R","C","Y","G","W","O"].map((t,i)=>LLUG(66+i*42,140)+LT(66+i*42,190,t,15,{R:"#c0281c",C:"#1d4f9a",Y:"#9a7a00",G:"#1e7a3a",W:"#5b666d",O:"#c0601a"}[t])).join("")+
  LT(170,80,"THERMOSTAT TERMINALS",14)+LT(170,236,"R 24 V hot · C common · Y cool · G fan · W heat · O rev. valve",11,"#3b4449","middle",500)
};
const pbPic=(col,dk,lbl)=>zShade(170,226,60,6)+`<rect x="120" y="140" width="100" height="70" rx="4" fill="url(#zPlasticDk)" stroke="#000"/><circle cx="170" cy="118" r="52" fill="url(#zSteel)" stroke="#5f686d" filter="url(#zShadow)"/>`+
 `<circle cx="170" cy="118" r="38" fill="${col}" stroke="${dk}" stroke-width="2"/><ellipse cx="158" cy="102" rx="16" ry="10" fill="rgba(255,255,255,.35)"/>`+LLUG(140,190)+LLUG(200,190)+LT(170,40,lbl,14)+LT(170,240,"momentary: springs back when released",11,"#3b4449","middle",500);
const pswPic=(lbl,col,name,sub)=>zShade(170,220,50,6)+`<rect x="162" y="168" width="16" height="30" fill="url(#zBrass)"/>${zHex(170,206,14)}`+`<rect x="128" y="70" width="84" height="100" rx="34" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>`+
 LT(170,112,lbl,18,col)+`<path d="M150 72 q-20 -30 -60 -34 M190 72 q20 -30 60 -34" stroke="#d23a26" stroke-width="3" fill="none"/>`+LT(170,30,name,14)+LT(170,246,sub,11,"#3b4449","middle",500);
const tstatPic=()=>zShade(170,226,100,6)+LBOX(70,40,200,170,"url(#zPlastic)",16,"#8f887a")+`<rect x="96" y="62" width="148" height="78" rx="6" fill="url(#zLcd)" stroke="#6e7f71"/>`+
 LT(170,112,`${Math.round(LTS.room)}°`,40,"#1f2a22")+LT(110,80,LTS.sys.toUpperCase(),11,"#1f2a22","start",700)+LT(232,80,`FAN ${LTS.fan.toUpperCase()}`,11,"#1f2a22","end",700)+
 LT(170,132,LTS.sys==="heat"?`heat to ${LTS.hs}°`:LTS.sys==="cool"?`cool to ${LTS.cs}°`:LTS.sys==="auto"?`${LTS.hs}°–${LTS.cs}°`:"",11,"#1f2a22")+
 [120,170,220].map((x,i)=>`<rect x="${x-20}" y="156" width="40" height="24" rx="5" fill="url(#zPlasticDk)"/>`+LT(x,172,["MODE","FAN","▲▼"][i],10,"#e9ecee")).join("")+LT(170,30,"24 V THERMOSTAT",14)+LT(170,240,"a set of switches: R connects to Y, G or W on a call",11,"#3b4449","middle",500);
const LPMAP={no:"relay",nc:"relay",coil:"relay",mcoil:"contactor",tdno:"timer",tdnc:"timer",td:"timer",ol:"ol",pbno:"pbno",pbnc:"pbnc",sw:"sw",
 ty:"tstat",tw:"tstat",tg:"tstat",tsc:"tstat",tsh:"tstat",tfo:"tstat",tfa:"tstat",tcc:"tstat",thc:"tstat",hps:"hps",lps:"lps",lim:"lim",rollout:"rollout",xfmr:"xfmr",fuse:"fuse",tsw:"tsw",motor:"motor",lamp:"lamp",sol:"sol",heat:"heat",buzz:"buzz",tterm:"term",ty2:"tstat",tw2:"tstat",tyhp:"tstat",to:"tstat",tb:"tstat",aps:"hps",lpc:"lps",aq:"lim",bts:"tsw",dtr:"timer",dtd:"timer"};
const LFIELD={
 ty2:["Thermostat Y2: second stage cooling. Wired to the compressor's stage solenoid or to a second compressor.","Check: 24 V from Y2 to C on a big cooling call."],
 tw2:["Thermostat W2: second stage heat. On a heat pump it's AUX heat (strips); on a two-stage furnace, high fire.","Check: 24 V from W2 to C when the room is well below setpoint."],
 tyhp:["Heat pump Y: compressor call in both heating and cooling. The reversing valve (O or B) decides which way the heat moves.","Check: 24 V from Y to C at the outdoor unit on any call."],
 to:["O: the reversing valve is energized in COOL. Used by most brands. If the RV coil or wire fails, the unit is stuck in heat.","Check: 24 V from O to C in cooling, 0 V in heating."],
 tb:["B: the reversing valve is energized in HEAT (Rheem/Ruud and some older units). If the coil fails, the unit is stuck in cooling.","Check: 24 V from B to C in heating. Don't confuse with B = common on some older thermostats."],
 aps:["Where: on the inducer housing or the furnace's vent, with a rubber hose to the inducer. Closes on draft (a negative pressure in inches of water column).","Check: 24 V across it with the inducer running = it's open. Look for a cracked hose, water in the hose or a blocked flue before replacing it."],
 lwco:["Where: on the boiler or the near-boiler piping, probe or float type. Opens on low water so the burner can't fire a dry boiler.","Check: voltage across it with water showing in the sight glass = it's failed open (often a fouled probe). Clean or blow down per the manufacturer."],
 aq:["Where: in a well on the boiler (for example a Honeywell L8148 aquastat relay). Opens the burner circuit at the high limit setting; the differential sets where it closes again.","Check: voltage across it with cool boiler water = it's open. A hot boiler that keeps firing past the limit is a serious safety fault."],
 bts:["Where: in the walk-in box, out of the evaporator's air stream. In a pump-down system it opens and closes the liquid line solenoid, not the compressor.","Check: line voltage across it with the box warm = it's open."],
 lpc:["Where: suction line at the condensing unit. In pump-down it is the compressor's operating control: cut-in starts it, cut-out stops it.","Check: suction gauge versus its settings. Short cycling on the LP control with the solenoid closed often means a leaking solenoid or compressor valves."],
 dtr:["Where: the defrost time clock (for example Paragon 8145 or Grasslin), in the condensing unit or a panel. This contact feeds the cooling circuit and opens in defrost.","Check: set the clock's time and pins; push the dial to defrost and listen for the switch."],
 dtd:["Where: the same defrost time clock. This contact closes in defrost to power the heaters (or just stops cooling on an off-cycle defrost).","Check: voltage at the heaters in defrost, then ohms across each heater with power off."],
 rollout:["Where: on the burner box of a gas furnace, near the burner opening. Flame rolling out of the heat exchanger heats it and opens it.","Check: voltage across it with power on (full voltage = open). It's manual reset: find out why it tripped (cracked or blocked heat exchanger, blocked flue) before you press the button."],
 xfmr:["Where: in the furnace or air handler control compartment, or a separate box. Primary on line voltage (120, 208/240 V), secondary 24 V. Rated in VA (40 VA is common).","Check: line voltage on the primary, about 24–28 V AC on the secondary (R to C). Primary voltage but no secondary = open transformer or blown fuse. Check ohms with power off: the primary reads a few to tens of ohms, the secondary about 1 Ω."],
 fuse:["Where: in a fused disconnect, a control panel fuse block, or a 3 A automotive fuse on a furnace board.","Check: with power on, 0 V across a good fuse and full voltage across a blown one. With power off, a good fuse reads near 0 Ω and a blown one reads OL. Find the short before you replace it."],
 no:["Where: inside a relay, contactor or starter, tagged with its coil's name (CR1, M1).","Check: with the coil off, ohms across it reads OL (open). With the coil energized it reads near 0 Ω, or 0 V across it on a live circuit."],
 nc:["Where: inside a relay or starter, often the same relay as an NO contact.","Check: coil off reads near 0 Ω; coil on reads OL. On a live circuit, line voltage across an NC contact means it's open."],
 coil:["Where: the relay's coil terminals (often A1/A2, or 13/14 on ice cube relays). The coil voltage is printed on the relay.","Check: coil ohms (power off) is usually tens to hundreds of ohms. OL = open coil. Check for coil voltage before condemning the relay."],
 mcoil:["Where: the contactor or motor starter. It switches the heavy motor current through its line (L) and load (T) terminals.","Check: coil voltage between the two coil terminals. If voltage is there and it won't pull in, check coil ohms with power off."],
 td:["Where: a timer relay, such as a time-delay on a compressor or a blower off-delay on a board.","Check: confirm coil voltage, then time how long it takes the contacts to change."],
 tdno:["Where: a timer relay's contact. TDC = timed closed: it closes only after the delay.","Check: watch for 0 V across it after the delay times out."],
 tdnc:["Where: a timer relay's contact. TDO = timed open: it opens after the delay.","Check: it reads closed until the delay times out."],
 ol:["Where: the overload block under a motor starter. Heaters in each motor lead warm up with current; too much for too long opens the 95-96 NC contact in the coil circuit.","Check: if the starter drops out and won't pull back in, look for a tripped overload. Find out why (amps, voltage, bearings) before you reset it."],
 pbno:["Where: a panel or remote station. Green is normally start.","Check: 0 Ω while pressed, OL when released."],
 pbnc:["Where: a panel or remote station. Red is normally stop. It's NC so a broken wire stops the machine (fail-safe).","Check: 0 Ω released, OL pressed."],
 sw:["Where: a service or selector switch.","Check: ohms across it in each position (power off)."],
 ty:["Thermostat Y: R connects to Y on a cooling call.","Check: 24 V from Y to C at the outdoor unit during a call."],
 tw:["Thermostat W: R connects to W on a heating call.","Check: 24 V from W to C at the furnace board during a call."],
 tg:["Thermostat G: R connects to G for the indoor fan.","Check: 24 V from G to C when the fan should run."],
 tsc:["System switch, COOL position. Lets the cooling call reach Y. Auto changeover closes both the cool and heat positions; the room temperature picks which one calls.","Check: in the thermostat's mode menu."],
 tsh:["System switch, HEAT position. Lets the heating call reach W.","Check: in the thermostat's mode menu."],
 tfo:["Fan switch ON: R connects straight to G, so the blower runs all the time.","Check: 24 V G to C with no call at all means the fan is set to ON."],
 tfa:["Fan switch AUTO: G is powered only with a cooling call, so the blower stops when the call ends. (On gas heat the furnace board runs the blower itself; electric heat thermostats can power G on heat too.)","Check: G should drop out when Y drops out."],
 tcc:["Cooling call: the thermostat's sensor closes this when the room rises above the cool setpoint (plus a small differential).","Check: raise the room temperature or lower the setpoint and listen for the click."],
 thc:["Heating call: closes when the room falls below the heat setpoint.","Check: lower the room temperature or raise the setpoint."],
 hps:["Where: discharge line near the compressor. Opens around 600–650 psig on R-410A.","Check: 0 V across it means closed. 24 V across it means it's open: find out why the head pressure was high (dirty condenser, fan out, overcharge)."],
 lps:["Where: suction line. Opens on low suction pressure (loss of charge, frozen coil, restriction).","Check: 24 V across it = open. Check the charge and airflow."],
 lim:["Where: furnace heat exchanger area or heat strips. NC snap disc.","Check: an open limit usually means low airflow: dirty filter, blower problem, closed registers."],
 tsw:["Where: fan controls, defrost or freeze stats. This one closes on temperature rise.","Check: ohms across it at known temperatures."],
 motor:["Shown as a simple motor load (M in a circle). Where: compressors, condenser fans and blowers. The motor's own windings and capacitor wiring are on its nameplate diagram, not on the ladder.","Check: voltage at the motor leads with it called to run. If voltage is there and it doesn't run, check amps, the capacitor (µF against its rating) and winding ohms with power off. OL across a winding means it is open (or its internal overload is open)."],
 lamp:["Shows a circuit's state on a panel (running, fault).","Check: a dead lamp with voltage on it is a burned bulb."],
 sol:["Liquid line solenoid, gas valve or similar valve coil.","Check: coil voltage, coil ohms, and a magnetic pull on a screwdriver tip near the coil."],
 heat:["Electric strip heat or a crankcase heater.","Check: ohms (power off). R = V²/W, so a 5 kW 240 V strip reads about 11.5 Ω."],
 buzz:["An alarm horn or buzzer.","Check: voltage across it when the alarm rung should be energized."],
 tterm:["A field wiring terminal: where a wire leaves one piece of equipment for another (for example the thermostat's Y going to the condenser).","Check: measure from this terminal to C to see if the signal is getting out."]
};
function partCardHTML(k){const pk=LPMAP[k];const pic=pk&&LPIC[pk]?(typeof LPIC[pk]==="function"?LPIC[pk]():LPIC[pk]):"";
 const f=LFIELD[k]||[];return `<div class="pcard">${pic?`<svg class="ill" viewBox="0 0 340 250" aria-hidden="true">${pic}</svg>`:""}<div>${f.map(x=>`<p class="note">${esc(x)}</p>`).join("")}</div></div>`}
LPIC.lim=()=>LPIC.disc("HIGH LIMIT (SNAP DISC)","opens on overheating");LPIC.tsw=()=>LPIC.disc("SNAP DISC","closes on rise");
