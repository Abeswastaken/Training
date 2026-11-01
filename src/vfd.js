/* ============ MOTORS + VFD (480 V drive, 10 hp TEFC induction motor) ============ */
SRC.emvfd=["The Engineering Mindset: Variable frequency drives explained (rectifier, DC bus, IGBT inverter, PWM)","https://theengineeringmindset.com/variable-frequency-drives-explained/"];
SRC.acs580=["ABB ACS580 firmware manual: DC voltage levels (overvoltage control 780 V, overvoltage fault 842 V)","https://www.manualslib.com/manual/1621417/Abb-Acs580.html?page=125"];
SRC.yask=["Yaskawa E7B manual: 480 V class DC bus overvoltage trips at 800 V, undervoltage at 380 V","https://www.manualsdir.com/manuals/802332/yaskawa-e7b-drive-bypass.html?page=193"];
SRC.dcov=["AutomationDirect white paper: DC bus overvoltage (regeneration when decelerating)","https://library.automationdirect.com/wp-content/uploads/2024/12/DCBusOvervoltage-white-paper.pdf"];
SRC.ieee43=["IEEE 43 minimums: 5 MΩ for random-wound stators, about 500 V DC test for machines up to 1 kV","https://open-exam-prep.com/study-guides/neta-ett-level-ii/insulation-resistance-testing/ir-test-voltages-ieee-43-minimums"];
SRC.flc=["Elliott Electric (NEC 430.250): 10 hp, 460 V, three-phase full load current 14 A","https://static.elliottelectric.com/StaticPages/ElectricalReferences/ElectricalTables/FullLoad_Current.aspx"];
SRC.lra=["Fabrico: Locked rotor current, about 6 to 8 times full load current across the line","https://www.fabrico.io/blog/locked-rotor-current/"];
SRC.induct=["Electrical4U: Three-phase induction motor working principle (synchronous speed, slip)","https://www.electrical4u.com/working-principle-of-three-phase-induction-motor/"];
SRC.affin=["Fan affinity laws for VFD control (flow ∝ speed, power ∝ speed³)","https://industrialmonitordirect.com/blogs/knowledgebase/fan-affinity-laws-for-vfd-control-centrifugal-vs-axial-comparison"];

PHOTOS.vfd={disconnect:[gimg("fused disconnect switch 3 phase 480V")],contactor:[gimg("VFD bypass contactor panel")],rectifier:[gimg("VFD diode bridge rectifier module")],
 dcbus:[gimg("VFD DC bus capacitors")],inverter:[gimg("IGBT module VFD")],keypad:[gimg("VFD keypad display")],hsfan:[gimg("VFD heatsink cooling fan")],
 motor:[gimg("10 hp TEFC three phase motor")],fanload:[gimg("centrifugal fan wheel belt drive")],conveyor:[gimg("belt conveyor gearmotor")],plate:[gimg("electric motor nameplate")],scope:[gimg("VFD output PWM waveform oscilloscope")]};

const VM={FLA:14,Tr:40.5,xm:200,xc:253,ILR:84,Im:4.9,C:0.0022,Rb:50000,OV:810,OVC:760,UV:380};
const VLAMP=[["pwr","Drive power","g"],["run","Run","g"],["spd","At speed","g"],["ilim","Current limit","a"],["ovc","OV control","a"],["byp","Bypass","a"],["flt","Fault","r"]];

function vSvg(p){
 const L=[150,170,190];
 const tri=(x,y)=>`<path d="M${x-6} ${y+5} L${x+6} ${y+5} L${x} ${y-5} Z M${x-6} ${y-5} H${x+6}" fill="#e9ecee" stroke="#e9ecee" stroke-width="1.2"/>`;
 return `
<!-- supply -->
<text class="lbl" x="20" y="132">480 V 3Ø</text>
<g stroke="var(--hot)" stroke-width="3">${L.map(y=>`<line x1="20" y1="${y}" x2="112" y2="${y}"/>`).join("")}</g>
${["L1","L2","L3"].map((n,i)=>`<text class="tag" x="24" y="${L[i]-5}" fill="var(--muted)">${n}</text>`).join("")}
<!-- disconnect -->
<g class="part" data-p="disconnect" tabindex="0">
 <rect class="hl" x="96" y="122" width="72" height="96" rx="3" fill="url(#zSteel)" stroke="#5f686d" filter="url(#zShadow)"/><rect x="102" y="128" width="60" height="84" rx="2" fill="#2a2f33"/>
 ${L.map((y,i)=>`<rect ${i===2?`id="${p}fuse3"`:`id="${p}fuse${i+1}"`} x="112" y="${y-5}" width="30" height="10" rx="3" fill="#e9ecee" stroke="#111"/><rect x="108" y="${y-4}" width="5" height="8" fill="url(#zCuV)"/><rect x="141" y="${y-4}" width="5" height="8" fill="url(#zCuV)"/>`).join("")}
 <g id="${p}handle"><rect x="160" y="160" width="26" height="8" rx="3" fill="#d23a26" stroke="#5a0b07"/><rect x="161" y="161" width="24" height="2.5" rx="1" fill="rgba(255,255,255,.35)"/></g>
 <text class="tag" x="132" y="234" text-anchor="middle" fill="var(--muted)">FUSED DISCONNECT</text>
</g>
<g id="${p}wDrv" stroke="var(--hot)" stroke-width="3" fill="none">${L.map(y=>`<line x1="142" y1="${y}" x2="222" y2="${y}"/>`).join("")}</g>
${L.map(y=>`<circle cx="190" cy="${y}" r="3" fill="var(--ink)"/>`).join("")}
<!-- bypass -->
<path id="${p}byp1" d="M190 150 V70 H362" fill="none" stroke="var(--line)" stroke-width="6" stroke-linejoin="round"/>
<path id="${p}byp2" d="M418 70 H644 V141" fill="none" stroke="var(--line)" stroke-width="6" stroke-linejoin="round"/>
<g class="part" data-p="contactor" tabindex="0">
 <rect class="hl" x="362" y="56" width="56" height="30" rx="3" fill="url(#zPlastic)" stroke="#8f887a" filter="url(#zShadow)"/><rect x="366" y="60" width="48" height="12" rx="2" fill="#1b1f22"/>
 ${zScrew(374,79,2.4)}${zScrew(406,79,2.4)}
 <line id="${p}bypBar" x1="370" y1="64" x2="410" y2="64" stroke="#d9dee1" stroke-width="3.5"/>
 <text class="tag" x="390" y="50" text-anchor="middle" fill="var(--muted)">BYPASS CONTACTOR + OL</text>
</g>
<!-- drive enclosure -->
<rect x="205" y="100" width="315" height="235" rx="5" fill="url(#zCab)" stroke="#5f686d" stroke-width="2" filter="url(#zShadow)"/><rect x="211" y="106" width="303" height="223" rx="2" fill="url(#zCabIn)" stroke="#9aa3a9"/>${[[209,104],[516,104],[209,331],[516,331]].map(([x,y])=>zScrew(x,y,2.2)).join("")}
<text class="zl" x="216" y="120">Variable frequency drive</text>
<g class="part" data-p="rectifier" tabindex="0">
 <rect class="hl" x="222" y="128" width="70" height="84" rx="3" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>${[236,257,278].map(x=>zScrew(x,134,2)+zScrew(x,206,2)).join("")}
 ${[236,257,278].map(x=>tri(x,150)+tri(x,190)).join("")}
 <text class="zt" x="257" y="226" text-anchor="middle">RECTIFIER</text>
</g>
<g class="part" data-p="dcbus" tabindex="0">
 <rect id="${p}capGlow" x="306" y="132" width="58" height="76" rx="4" fill="var(--hot)" opacity="0"/>
 <rect class="hl" x="290" y="135" width="122" height="6" fill="url(#zCuH)" stroke="#5a2a12" stroke-width=".5"/>
 <rect x="290" y="199" width="122" height="6" fill="url(#zCuH)" stroke="#5a2a12" stroke-width=".5"/>
 ${[320,350].map(x=>`<rect x="${x-11}" y="146" width="22" height="50" rx="3" fill="url(#zBlue)" stroke="#14202c"/><ellipse cx="${x}" cy="147" rx="11" ry="3" fill="url(#zAluTop)"/><path d="M${x-5} 147 h10 M${x} 142 v10" stroke="#555" stroke-width="1"/><rect x="${x-9}" y="150" width="3" height="44" fill="rgba(255,255,255,.25)"/><text x="${x}" y="186" text-anchor="middle" font-size="6" font-family="sans-serif" fill="#e9ecee">2200µF</text>`).join("")}
 <text class="zt" x="296" y="132">+</text><text class="zt" x="296" y="216">−</text>
 <text class="zt" x="388" y="156" text-anchor="middle">DC BUS</text>
 <text class="valD" id="${p}busTxt" x="388" y="174" text-anchor="middle" fill="#1d2327" style="font-size:12px">0 V</text>
 <text class="zt" id="${p}ripTxt" x="388" y="190" text-anchor="middle"></text>
 <text class="zt" x="335" y="226" text-anchor="middle">CAPACITORS</text>
</g>
<g class="part" data-p="inverter" tabindex="0">
 <rect class="hl" x="410" y="128" width="84" height="84" rx="3" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 ${[422,447,472].map((x,i)=>`<rect id="${p}g${i}" x="${x-6}" y="140" width="12" height="16" rx="2" fill="#6a737a"/><rect id="${p}g${i+3}" x="${x-6}" y="182" width="12" height="16" rx="2" fill="#6a737a"/><line x1="${x}" y1="156" x2="${x}" y2="182" stroke="#c4cacf" stroke-width="2"/>`).join("")}
 <text class="zt" x="452" y="226" text-anchor="middle">INVERTER (IGBTs)</text>
</g>
<g id="${p}wOut" stroke="var(--line)" stroke-width="3" fill="none">
 <path d="M494 150 H556 V147 H620"/><path d="M494 170 H564 V153 H620"/><path d="M494 190 H572 V159 H620"/>
</g>
<text class="tag" id="${p}iTxt" x="500" y="138" fill="#1d2327"></text>
<g class="part" data-p="keypad" tabindex="0">
 <rect class="hl" x="222" y="244" width="190" height="82" rx="6" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/>
 <rect id="${p}lcdBg" x="230" y="252" width="174" height="44" rx="3" fill="#b9c7a8"/>
 <text id="${p}lcd1" x="236" y="269" font-family="var(--mono)" font-size="12" fill="#142014"></text>
 <text id="${p}lcd2" x="236" y="287" font-family="var(--mono)" font-size="11" fill="#142014"></text>
 ${[[262,"#1e9a4a"],[317,"#d0312d"],[372,"#7a8288"]].map(([x,c])=>`<circle cx="${x}" cy="312" r="8.5" fill="#111"/><circle cx="${x}" cy="311" r="8" fill="${c}"/><ellipse cx="${x-2}" cy="308" rx="4" ry="2.5" fill="rgba(255,255,255,.35)"/>`).join("")}
 <text class="tag" x="276" y="315" fill="#e9ecee">RUN</text><text class="tag" x="331" y="315" fill="#e9ecee">STOP</text><text class="tag" x="386" y="315" fill="#e9ecee">RST</text>
</g>
<g class="part" data-p="hsfan" tabindex="0">
 <rect x="440" y="256" width="52" height="52" rx="4" fill="url(#zPlasticDk)" stroke="#000"/><circle class="hl" cx="466" cy="282" r="23" fill="url(#zInside)" stroke="#000"/>
 <g id="${p}hsB">${[0,90,180,270].map(a=>`<path d="M466 282 L${466+20*Math.cos((a-20)*Math.PI/180)} ${282+20*Math.sin((a-20)*Math.PI/180)} A20 20 0 0 1 ${466+20*Math.cos((a+20)*Math.PI/180)} ${282+20*Math.sin((a+20)*Math.PI/180)} Z" fill="url(#zPlasticDk)" stroke="#555" stroke-width=".6"/>`).join("")}</g>
 <circle cx="466" cy="282" r="23" fill="url(#zGrille)" opacity=".6"/><circle cx="466" cy="282" r="5" fill="#c4cacf"/>
 <text class="zt" x="466" y="250" text-anchor="middle">COOLING FAN</text>
 <text class="tag" id="${p}hsTxt" x="466" y="322" text-anchor="middle" fill="#1d2327"></text>
</g>
<!-- motor -->
<g class="part" data-p="motor" tabindex="0"><g id="${p}motorG">
 ${zShade(660,266,64,4)}<rect x="606" y="252" width="26" height="12" rx="2" fill="#253b52"/><rect x="688" y="252" width="26" height="12" rx="2" fill="#253b52"/>
 <rect class="hl" x="620" y="139" width="48" height="28" rx="3" fill="url(#zMotor)" stroke="#111"/><rect x="624" y="143" width="40" height="4" fill="rgba(255,255,255,.25)"/>
 <rect x="584" y="172" width="22" height="76" rx="8" fill="url(#zMotor)" stroke="#111"/>${Array.from({length:6},(_,i)=>`<rect x="588" y="${180+i*11}" width="14" height="4" rx="2" fill="#0e1a26" opacity=".8"/>`).join("")}
 <rect x="600" y="165" width="120" height="90" rx="12" fill="url(#zMotor)" stroke="#111" stroke-width="1.5" filter="url(#zShadow)"/>
 ${[174,184,194,204,214,224,234,244].map(y=>`<rect x="606" y="${y}" width="108" height="3.5" rx="1.5" fill="#1d3247" opacity=".55"/><rect x="606" y="${y+3.5}" width="108" height="1.2" fill="#9fc0dd" opacity=".35"/>`).join("")}
 <circle cx="660" cy="210" r="35" fill="#1d3247"/><circle cx="660" cy="210" r="33" fill="url(#zInside)" stroke="#9fc0dd" stroke-width="1.5"/><circle cx="660" cy="210" r="30" fill="none" stroke="url(#zWind)" stroke-width="6"/>
 <g id="${p}rot"><circle cx="660" cy="210" r="23" fill="#9aa1a8"/>${Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return `<line x1="${660+9*Math.cos(a)}" y1="${210+9*Math.sin(a)}" x2="${660+21*Math.cos(a)}" y2="${210+21*Math.sin(a)}" stroke="#c4884a" stroke-width="3"/>`}).join("")}<circle cx="660" cy="210" r="5" fill="#30363b"/></g>
</g></g>
<text class="lblS" x="676" y="156">Motor</text>
<rect x="720" y="205" width="24" height="10" fill="url(#zSteelH)" stroke="#4d555a"/><rect x="726" y="203" width="6" height="3" fill="#5f686d"/>
<path id="${p}spark" d="M640 132 l8 -10 l-2 8 l8 -4 l-8 12 l2 -8 z" fill="#ffd84a" stroke="#d23a26" opacity="0"/>
<g class="part" data-p="fanload" tabindex="0" id="${p}fanG">
 <circle class="hl" cx="768" cy="210" r="29" fill="url(#zInside)" stroke="#2a2f33" stroke-width="2"/>
 <g id="${p}fanB">${Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return `<path d="M768 210 L${768+24*Math.cos(a)} ${210+24*Math.sin(a)} L${768+24*Math.cos(a+0.45)} ${210+24*Math.sin(a+0.45)} Z" fill="url(#zAlu)" stroke="#5f686d" stroke-width=".6"/>`}).join("")}</g>
 <circle cx="768" cy="210" r="28" fill="url(#zGrille)" opacity=".55"/><circle cx="768" cy="210" r="5" fill="url(#zScrew)"/>
 <path id="${p}air" d="M768 178 V96" fill="none" stroke="var(--cold)" stroke-width="4" stroke-dasharray="8 8"/>
 <path id="${p}airH" d="M760 104 L768 92 L776 104" fill="none" stroke="var(--cold)" stroke-width="3"/>
 <text class="tag" x="768" y="254" text-anchor="middle" fill="var(--muted)">FAN</text>
</g>
<g class="part" data-p="conveyor" tabindex="0" id="${p}convG" opacity="0">
 <circle class="hl" cx="756" cy="210" r="12" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/>
 <line x1="756" y1="222" x2="778" y2="306" stroke="var(--ink)" stroke-width="3"/>
 <rect x="600" y="306" width="190" height="16" rx="8" fill="#3a3f44"/>
 <path id="${p}belt" d="M606 314 H784" stroke="#9aa1a8" stroke-width="3" stroke-dasharray="6 10"/>
 <g id="${p}boxes"><rect x="610" y="288" width="22" height="18" fill="#c4884a" stroke="var(--ink)"/><rect x="690" y="288" width="22" height="18" fill="#c4884a" stroke="var(--ink)"/></g>
 <text class="tag" x="695" y="336" text-anchor="middle" fill="var(--muted)">CONVEYOR</text>
</g>
<text class="val" id="${p}mtTxt" x="560" y="280" font-size="12"></text>
<text class="val" id="${p}rpmTxt" x="560" y="296" font-size="12"></text>
<g class="part" data-p="plate" tabindex="0">
 <rect class="hl" x="560" y="352" width="230" height="76" rx="3" fill="url(#zAlu)" stroke="#5f686d" filter="url(#zShadow)"/>${zScrew(565,357,2)}${zScrew(785,357,2)}${zScrew(565,423,2)}${zScrew(785,423,2)}
 <text x="568" y="368" font-family="var(--mono)" font-size="10" fill="#1d2327">10 HP  3 PH  460 V  60 Hz</text>
 <text x="568" y="383" font-family="var(--mono)" font-size="10" fill="#1d2327">FLA 14.0 A   1760 RPM  SF 1.15</text>
 <text x="568" y="398" font-family="var(--mono)" font-size="10" fill="#1d2327">TEFC  INS CLASS F  NEMA DES B</text>
 <text x="568" y="413" font-family="var(--mono)" font-size="10" fill="#1d2327">CODE G   EFF 91.7%   40°C AMB</text>
</g>
<text class="val" id="${p}loadTxt" x="560" y="448" font-size="12"></text>
<!-- scope -->
<g class="part" data-p="scope" tabindex="0">
 <rect x="14" y="339" width="532" height="127" rx="9" fill="url(#zPlasticDk)" stroke="#000" filter="url(#zShadow)"/><rect class="hl" x="20" y="345" width="520" height="115" rx="6" fill="#0f1a14" stroke="#000"/>
 ${[130,230,330,430].map(x=>`<line x1="${x}" y1="355" x2="${x}" y2="445" stroke="#24382c"/>`).join("")}<line x1="30" y1="400" x2="530" y2="400" stroke="#24382c"/>
 <path id="${p}scV" d="M30 400 H530" fill="none" stroke="#e8c33a" stroke-width="1.1"/>
 <path id="${p}scI" d="M30 400 H530" fill="none" stroke="#4fd1e8" stroke-width="2.2"/>
 <text class="tag" x="30" y="358" fill="#8fbf9f">SCOPE  10 ms/div</text>
 <text class="tag" x="330" y="358" fill="#e8c33a">T1–T2 VOLTS</text><text class="tag" x="430" y="358" fill="#4fd1e8">T1 AMPS</text>
 <text class="tag" id="${p}scTxt" x="30" y="455" fill="#8fbf9f"></text>
</g>
<g id="${p}burn" opacity="0">${[0,1,2,3,4].map(i=>`<circle cx="${630+i*18}" cy="${150-i*14}" r="${14+i*4}" fill="#3a3a3a" opacity=".55"/>`).join("")}<path d="M630 200 l20 10 l-12 8 l24 6" stroke="#ff7a1a" stroke-width="4" fill="none"/></g>
`}

const VMET=(()=>{const lock=S=>S.disc||S.bus>50;const no="Refused: disconnect off and DC bus under 50 V first";
 const ohm=(S,F,pair)=>{if(lock(S))return no;if(F.lead&&pair.includes("2"))return "OL (open circuit)";if(F.turn&&pair.includes("1"))return "0.98 Ω";return "1.25 Ω"};
 const halfIn=(S,F)=>`${f0(F.fuse&&S.vl?S.vl*0.5:S.vl)} V AC`;
 return [
 ["Supply L1–L2 (line side of disconnect), V AC",(S,F,V)=>`${f0(V.line*(F.brown?0.72:1))} V AC`],
 ["Drive input L1–L2, V AC",S=>`${f0(S.vl)} V AC`],
 ["Drive input L2–L3, V AC",halfIn],
 ["Drive input L1–L3, V AC",halfIn],
 ["Across fuse F3, V AC",(S,F,V)=>S.disc&&(F.fuse||S.fuses)?`${f0(V.line*(F.brown?0.72:1)*0.5)} V AC`:"0 V AC"],
 ["DC bus + to −, V DC",S=>`${f0(S.bus)} V DC`],
 ["DC bus ripple (AC on the bus), V AC",S=>`${S.bus>50?S.ripple.toFixed(1):"0.0"} V AC`],
 ["Drive output T1–T2 (low-pass mode), V AC",S=>`${f0(S.out?S.Vout:0)} V AC`],
 ["Clamp on T1, A",S=>`${S.Ia[0].toFixed(1)} A`],
 ["Clamp on T2, A",S=>`${S.Ia[1].toFixed(1)} A`],
 ["Clamp on T3, A",S=>`${S.Ia[2].toFixed(1)} A`],
 ["Motor T1–T2 (leads lifted), Ω",(S,F)=>ohm(S,F,"12")],
 ["Motor T2–T3 (leads lifted), Ω",(S,F)=>ohm(S,F,"23")],
 ["Motor T1–T3 (leads lifted), Ω",(S,F)=>ohm(S,F,"13")],
 ["Megger T1 to ground at 500 V DC (leads lifted), MΩ",(S,F)=>lock(S)?no:F.gnd?"0.06 MΩ (fail: IEEE 43 minimum is 5)":"1850 MΩ (pass)"],
 ["Drive T1 to DC− (diode test, power off)",(S,F)=>lock(S)?no:F.igbt?"0.000 V (shorted)":"0.38 V (normal diode drop)"],
 ["Motor frame (IR thermometer), °F",(S,F,V)=>`${f0((S.mt*0.8+(V.amb-32)/1.8*0.2)*1.8+32)}°F`]]})();

const VFD={id:"vfd",p:"v_",name:"VFD + motor",svg:vSvg("v_"),lamps:VLAMP,txvOnly:[],
 sliders:[
  {k:"fref",l:"Speed reference",u:" Hz",min:0,max:90,step:1,v:45,n:[6,60],note:"Normal 6–60 Hz. Past 60 Hz the voltage can't rise any more, so torque drops (field weakening)."},
  {k:"acc",l:"Accel time (0 to 60 Hz)",u:" s",min:0.5,max:60,step:0.5,v:10,n:[3,60],note:"Too short with a heavy fan wheel and the drive sits in current limit."},
  {k:"dec",l:"Decel time (60 to 0 Hz)",u:" s",min:0.5,max:60,step:0.5,v:20,n:[8,60],note:"Too short and the spinning fan drives the motor as a generator, pumping up the DC bus."},
  {k:"load",l:"Load at full speed",u:"%",min:0,max:150,step:5,v:80,n:[0,100],note:"Percent of the motor's rated torque at 1760 rpm."},
  {k:"line",l:"Supply voltage",u:" V",min:300,max:560,step:5,v:480,n:[432,528],note:"480 V ±10%",more:1},
  {k:"ol",l:"Motor overload setting",u:" A",min:5,max:25,step:0.5,v:14,n:[13,16.1],note:"Set it to the nameplate FLA: 14 A.",more:1},
  {k:"amb",l:"Room temperature",u:"°F",min:30,max:130,step:1,v:86,n:[32,104],note:"Drives are usually rated for 104°F (40°C) without derating.",more:1}],
 faults:[["fuse","Supply fuse F3 blown (phase loss)"],["brown","Supply sags (brownout)"],["caps","DC bus capacitors worn out"],["hsfan","Drive cooling fan failed"],
  ["igbt","Output transistor (IGBT) shorted"],["lead","Motor lead T2 loose in the motor box"],["gnd","Motor winding shorted to ground"],["turn","Turn-to-turn short in the T1 winding"],
  ["bearing","Motor bearing failing"],["jam","Load binding or jammed"],["swap","Two motor leads swapped"],["olJump","Bypass overload relay jumpered out"]],
 hidden:["olJump"],
 scenarios:[{l:"Single-phased in bypass with the overload relay jumpered out",f:["fuse","olJump"],s:{bypass:true,cmd:true},speed:5},
  {l:"Conveyor at 15 Hz, full load, drive overload set to 25 A",f:[],v:{fref:15,load:110,ol:25},s:{ltype:"conv",cmd:true},speed:60}],
 startMsg(){return "Drive powered up on a 480 V supply, driving a 10 hp fan motor. Turn the Run command on to start it."},
 init(){const V=this.V;return {t:0,dead:null,disc:true,cmd:false,dir:1,dirOut:1,bypass:false,ltype:"fan",stopMode:"ramp",stall:true,labels:true,
  f:0,out:false,n:0,bus:V.line*1.414,charged:true,vl:0,ripple:0,I:0,Ia:[0,0,0],T:0,Tl:0,Vout:0,th:0.3,hs:30,mt:30,fault:null,faultTxt:"",ilim:false,ovc:false,
  olr:false,olrTh:0.3,fuses:false,ang:0,hsAng:0,aoff:0,boxX:0,scph:0,tLead:0,logs2:{pc:1}}},
 switches:[
  {l:S=>`Disconnect: ${S.disc?"on":"off"}`,on:S=>S.disc,act(sim){const S=sim.S;S.disc=!S.disc;log(sim,S.disc?"Disconnect on. Drive powering up.":"Disconnect off. The DC bus capacitors stay charged for minutes.",S.disc?"":"w")}},
  {l:S=>`Run command: ${S.cmd?"on":"off"}`,on:S=>S.cmd,act(sim){const S=sim.S,V=sim.V;
   if(S.cmd){S.cmd=false;log(sim,S.bypass?"Bypass contactor opened.":S.stopMode==="coast"?"Stop: output off, motor coasts.":"Stop: ramping down.");return}
   if(S.fault){log(sim,"The drive is faulted. Reset it first.","w");return}
   if(!S.bypass&&S.bus<VM.UV){log(sim,"No power to the drive.","w");return}
   S.cmd=true;log(sim,S.bypass?"Bypass contactor closed: motor straight across the line.":`Run. Ramping to ${V.fref} Hz.`)}},
  {l:S=>`Direction: ${S.dir>0?"forward":"reverse"}`,on:S=>S.dir<0,act(sim){const S=sim.S;S.dir=-S.dir;log(sim,`Direction set to ${S.dir>0?"forward":"reverse"}.`+(S.bypass?" (In bypass the motor turns whichever way its wiring makes it.)":""))}},
  {l:S=>`Mode: ${S.bypass?"bypass":"drive"}`,on:S=>S.bypass,act(sim){const S=sim.S;if(S.cmd||Math.abs(S.n)>20){log(sim,"Stop the motor before switching between drive and bypass.","w");return}S.bypass=!S.bypass;log(sim,S.bypass?"Bypass selected: the motor will run across the line at full speed, protected by the overload relay.":"Drive mode selected.")}},
  {l:S=>`Load: ${S.ltype==="fan"?"fan":"conveyor"}`,on:S=>S.ltype==="conv",act(sim){const S=sim.S;if(Math.abs(S.n)>5){log(sim,"Stop the motor before changing the load.","w");return}S.ltype=S.ltype==="fan"?"conv":"fan";log(sim,S.ltype==="fan"?"Fan load: torque rises with speed squared, heavy wheel.":"Conveyor load: same torque at every speed.")}},
  {l:S=>`Stop mode: ${S.stopMode}`,on:S=>S.stopMode==="coast",act(sim){const S=sim.S;S.stopMode=S.stopMode==="ramp"?"coast":"ramp";log(sim,`Stop mode set to ${S.stopMode}.`)}},
  {l:S=>`Stall prevention: ${S.stall?"on":"off"}`,on:S=>S.stall,act(sim){const S=sim.S;S.stall=!S.stall;log(sim,S.stall?"Stall prevention on: the drive holds its ramp at current limit and on a high DC bus.":"Stall prevention off: the drive trips instead of riding through.",S.stall?"":"w")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false}}],
 actions:[{id:"cover",l:"Take the drive cover off and start work",cls:"danger",show:S=>!S.disc,act(sim){const S=sim.S;if(S.bus>50){explode(sim,"shock")}else log(sim,`DC bus is at ${f0(S.bus)} V. Safe to work, after you verify it with your own meter.`)}}],
 resets(S){const r=[],sim=this;
  if(S.fault)r.push(["Reset drive fault",()=>{if(S.fault==="OH"&&S.hs>80){log(sim,`Heatsink still ${f0(S.hs)}°C. Let it cool below 80°C.`,"w");return}
   if(S.fault==="OL"&&S.th>1){log(sim,"Motor overload is still counting down. Let the motor cool.","w");return}
   log(sim,`Fault ${S.fault} reset.`);S.fault=null;S.cmd=false}]);
  if(S.olr)r.push(["Reset bypass overload relay",()=>{if(S.olrTh>1){log(sim,"Overload relay is still too warm to reset.","w");return}S.olr=false;S.cmd=false;log(sim,"Overload relay reset by hand.")}]);
  if(S.fuses)r.push(["Replace the blown supply fuses",()=>{if(S.disc){log(sim,"Turn the disconnect off before changing fuses.","w");return}S.fuses=false;log(sim,"Fuses replaced. Find the ground fault before you energize it again.","w")}]);
  return r},
 reads(S){return [["Output",S.bypass?(S.Vout>0?"60 Hz line":"—"):`${S.f.toFixed(1)} Hz`],["Current",`${S.I.toFixed(1)} A`],["Speed",`${f0(Math.abs(S.n))} rpm`],
  ["DC bus",`${f0(S.bus)} V`],["Out volts",`${f0(S.Vout)} V`],["State",this.stText(S)]]},
 stText(S){if(S.dead)return "failed";if(S.fault)return "fault "+S.fault;
  if(S.bypass)return S.olr?"OL relay tripped":S.cmd?(S.vl>0?"bypass run":"no power"):"bypass ready";
  if(S.out)return S.ilim?"current limit":S.ovc?"OV control":Math.abs(S.f-(S.cmd?this.V.fref:0))<0.1?"at speed":S.cmd?"accelerating":"decelerating";
  return S.bus>=VM.UV?"ready":"no power"},
 step(dt){const S=this.S;S.t+=dt;let r=dt;while(r>1e-9){const h=Math.min(0.02,r);this.sub(h);r-=h;if(S.dead)return}},
 sub(h){const sim=this,S=this.S,F=this.F,V=this.V,FLA=VM.FLA;
  const ambC=(V.amb-32)/1.8;
  const vl=S.disc&&!S.fuses?V.line*(F.brown?0.72:1):0;S.vl=vl;
  const trip=(code,t)=>{if(S.fault)return;S.fault=code;S.faultTxt=t;S.out=false;S.f=0;S.ilim=false;S.ovc=false;log(sim,`Drive fault ${code}: ${t}.`,"b")};
  // ---- drive control (uses last step's current) ----
  S.ilim=false;S.ovc=false;
  if(!S.bypass&&!S.fault&&S.bus>=VM.UV){
   if(S.cmd&&!S.out&&V.fref>0){S.out=true;S.f=0.5;S.dirOut=S.dir;S.tLead=0;if(Math.abs(S.n)>200)log(sim,`Started into a motor that is still spinning (${f0(Math.abs(S.n))} rpm).`,"w")}
   if(S.out){
    let tgt=S.cmd?V.fref:0;if(S.dir!==S.dirOut)tgt=0;
    let df=0;if(S.f<tgt-0.01)df=Math.min(60/V.acc*h,tgt-S.f);else if(S.f>tgt+0.01)df=-Math.min(60/V.dec*h,S.f-tgt);
    if(S.stall){
     if(S.I>1.5*FLA&&df>0){df=0;S.ilim=true}
     if(S.I>1.65*FLA&&df>=0&&S.f>1){df=-10*h;S.ilim=true}
     if(S.bus>VM.OVC&&df<0){df=0;S.ovc=true}}
    S.f=clamp(S.f+df,0,90);
    if(S.stall&&S.bus>785){S.f=Math.max(S.f,Math.abs(S.n)/30);S.ovc=true}
    if(S.dir!==S.dirOut&&S.f<=0.5){S.dirOut=S.dir;log(sim,`Reversing: now ${S.dir>0?"forward":"reverse"}.`)}
    if(!S.cmd&&S.stopMode==="coast"){S.out=false;S.f=0}
    else if(!S.cmd&&S.f<=0.5){S.out=false;S.f=0;log(sim,"Ramp to stop complete. Output off.")}
    if(S.cmd&&S.out&&Math.abs(S.f-tgt)<0.05&&!S.logs2.at&&tgt>0){S.logs2.at=1;log(sim,`At speed: ${tgt} Hz, ${S.I.toFixed(1)} A.`)}
    if(Math.abs(S.f-tgt)>0.5)S.logs2.at=0}
  }else if(!S.bypass){S.out=false;S.f=0}
  if(S.bypass){S.out=false;S.f=0}
  // ---- what the motor sees ----
  let fe=0,phi=0,on=false,Vo=0;
  if(S.bypass){on=S.cmd&&vl>0&&!S.olr;fe=60;Vo=on?vl:0;phi=Vo/460}
  else if(S.out){on=true;fe=S.f;const vmax=S.bus*0.707*0.98;const vcmd=Math.min(460,460*fe/60+8*Math.max(0,1-fe/30));Vo=Math.max(0,Math.min(vcmd,vmax));phi=Math.min(1.15,Vo/(7.667*Math.max(fe,0.5)))}
  S.Vout=Vo;
  const edir=(S.bypass?1:S.dirOut)*(F.swap?-1:1);const ns=30*fe*edir;
  let T=0,I=0;
  if(on&&phi>0){const x=ns-S.n,ax=Math.abs(x)+1e-6,sg=Math.sign(x);
   T=phi*phi*VM.Tr*(2*2.6/(ax/VM.xm+VM.xm/ax)+1.2*Math.pow(Math.min(1,ax/1800),2))*sg;
   const itq=VM.ILR*phi*ax/Math.sqrt(ax*ax+VM.xc*VM.xc);I=Math.sqrt((VM.Im*phi)**2+itq*itq);
   if(S.bypass&&(F.fuse||F.lead)){if(Math.abs(S.n)<500){T=0;I=VM.ILR*phi*0.87}else{T*=0.55;I*=1.6}}}
  if(on&&!S.bypass){if(F.gnd)trip("GF","Ground fault on the drive output");if(F.igbt)trip("SC","Output short circuit (shorted IGBT)");
   if(F.lead){S.tLead+=h;if(S.tLead>0.3)trip("OPL","Output phase loss on T2")}}
  if(S.bypass&&on&&F.gnd&&!S.fuses){S.fuses=true;log(sim,"Ground fault straight across the line: the supply fuses blow with a bang.","b");on=false;T=0;I=0}
  if(S.fault&&!S.bypass){on=false;T=0;I=0;S.Vout=0}
  if(S.stall&&!S.bypass&&S.out&&T*S.n<0&&S.bus>VM.OVC-20){const w0=S.n*Math.PI/30,allow=Math.max(0,40+S.bus*S.bus/VM.Rb+200*(VM.OVC-S.bus)/20),preg=-T*w0*0.85;
   if(preg>allow){const k=allow/preg;T*=k;I=Math.sqrt((VM.Im*phi)**2+Math.max(0,I*I-(VM.Im*phi)**2)*k*k);S.f=Math.max(S.f,Math.abs(S.n)/30-0.3);S.ovc=true}}
  S.I=I;S.T=T;
  S.Ia=F.turn?[I*1.18,I*0.93,I*0.9]:[I,I,I];
  if(S.bypass&&on&&F.fuse)S.Ia=[I,I,0];if(S.bypass&&on&&F.lead)S.Ia=[I,0,I];
  const Imax=Math.max(...S.Ia);
  // ---- load and shaft ----
  const lf=V.load/100*VM.Tr;let Tl=(S.ltype==="fan"?lf*(S.n/1760)**2:lf)+(F.bearing?0.12:0.02)*VM.Tr+(F.jam?0.9*VM.Tr:0);S.Tl=Tl;
  const J=S.ltype==="fan"?2.0:0.6;
  const sgn=S.n!==0?Math.sign(S.n):Math.sign(T);
  if(Math.abs(S.n)<1&&Math.abs(T)<=Tl)S.n=0;
  else{const n0=S.n;S.n+=(T-Tl*sgn)/J*h*60/(2*Math.PI);if(n0*S.n<0&&Math.abs(T)<=Tl)S.n=0}
  // ---- DC bus ----
  const w=S.n*Math.PI/30,Pm=on&&!S.bypass?T*w:0;
  const Pdc=Pm>0?Pm/0.92+3*I*I*0.3:Pm*0.85;
  const lfr=Math.max(0,Pdc)/8300;
  const vr=vl*(1.414-(F.fuse?0.32:0.05)*Math.min(1.6,lfr));
  const C=VM.C*(F.caps?0.3:1);
  let E=0.5*C*S.bus*S.bus-(Pdc+30*(S.bus>200?1:0)+S.bus*S.bus/VM.Rb)*h;S.bus=Math.sqrt(Math.max(0,2*E/C));
  if(S.bus<vr){S.bus+=(vr-S.bus)*Math.min(1,h/(S.charged?0.01:0.4));if(!S.charged&&S.bus>=0.8*vr){S.charged=true;log(sim,`DC bus charged to about ${f0(vr)} V through the precharge circuit.`)}}
  if(S.bus<100)S.charged=false;
  S.ripple=S.bus>50&&vl>0?1+(F.fuse?95:7)*lfr*(F.caps?4:1):0;
  // ---- drive protection ----
  if(!S.bypass&&S.out){
   if(S.bus>=VM.OV)trip("OV",`DC bus overvoltage (${f0(S.bus)} V)`);
   else if(S.bus<VM.UV)trip("UV",`DC bus undervoltage (${f0(S.bus)} V)`);
   else if(S.ripple>60)trip("PHL",`Input phase loss (DC bus ripple ${f0(S.ripple)} V)`);
   else if(I>2.5*FLA)trip("OC",`Overcurrent (${I.toFixed(0)} A)`)}
  S.th+=((S.bypass?0:Imax/V.ol)**2-S.th)*h/200;
  if(!S.bypass&&S.out&&S.th>=1.3225)trip("OL",`Motor overload (${Imax.toFixed(1)} A against a ${V.ol} A setting)`);
  const hsT=ambC+(S.out?6+28*(Imax/FLA)**2:0)*(F.hsfan?3.2:1);S.hs+=(hsT-S.hs)*h/60;
  if(S.out&&S.hs>=95)trip("OH",`Heatsink overtemperature (${f0(S.hs)}°C)`);
  if(S.bus<150){if(S.fault){S.fault=null;log(sim,"Drive control powered down. The fault clears on power-up.")}if(!S.bypass)S.cmd=false}
  // ---- bypass overload relay (class 10) ----
  S.olrTh+=((S.bypass&&on?Imax/V.ol:0)**2-S.olrTh)*h/200;
  if(S.bypass&&!F.olJump&&!S.olr&&S.olrTh>=1.3225){S.olr=true;log(sim,`Bypass overload relay tripped at ${Imax.toFixed(0)} A. Contactor dropped out. Manual reset.`,"b")}
  // ---- motor heating (TEFC: the shaft fan cools less at low speed) ----
  const cool=0.35+0.65*Math.min(1,Math.abs(S.n)/1760);
  const rise=90*(Imax/FLA)**2*(F.bearing?1.15:1)*(F.turn?1.35:1)/cool;
  S.mt+=(ambC+rise-S.mt)*h/900;
  if(S.mt>=155&&!S.logs2.mt){S.logs2.mt=1;log(sim,"Motor winding past 311°F, its Class F insulation rating.","b")}
  if(S.mt<140)S.logs2.mt=0;
  if(S.bypass&&on&&(F.fuse||F.lead)&&Math.abs(S.n)<500&&!S.logs2.hum){S.logs2.hum=1;log(sim,`Single-phased: the motor hums but can't start, drawing ${f0(I)} A.`,"b")}
  if(!on)S.logs2.hum=0;
  if(F.swap&&Math.abs(S.n)>300&&!S.logs2.rev){S.logs2.rev=1;log(sim,"Motor is turning backward. A backward centrifugal fan still moves some air, but much less.","w")}
  if(F.bearing&&Math.abs(S.n)>300&&!S.logs2.brg){S.logs2.brg=1;log(sim,"Growling noise and vibration from the motor's drive end.","w")}
  if(S.mt>=230){explode(sim,"burn");return}
 },
 draw(dt){const S=this.S,F=this.F,V=this.V,p="v_";
  const live=S.vl>0,hot="var(--hot)",dead="var(--line)";
  at(p+"wDrv","stroke",live?hot:dead);at(p+"wOut","stroke",S.out?hot:dead);
  at(p+"byp1","stroke",live?hot:dead);at(p+"byp1","opacity",S.bypass?1:0.35);
  const bc=S.bypass&&S.cmd&&!S.olr;at(p+"bypBar","transform",bc?"translate(0,7)":"");at(p+"byp2","stroke",bc&&live?hot:dead);at(p+"byp2","opacity",S.bypass?1:0.35);
  at(p+"handle","transform",S.disc?"":"rotate(70 164 164)");
  [1,2,3].forEach(i=>at(p+"fuse"+i,"fill",S.fuses||(i===3&&F.fuse)?"#3a3f44":"#e9ecee"));
  at(p+"capGlow","opacity",clamp(S.bus/1100,0,0.55).toFixed(2));txt(p+"busTxt",`${f0(S.bus)} V`);at(p+"busTxt","fill",S.bus>VM.OVC?"#c0281c":"#1d2327");
  txt(p+"ripTxt",S.bus>50&&live?`ripple ${f0(S.ripple)} V`:"");
  for(let i=0;i<6;i++)at(p+"g"+i,"fill",S.out?(Math.random()<0.5?"#ffd84a":"#6a5a2a"):"#6a737a");
  let l1="",l2="",bg="#4b5546";
  if(S.bus>=200){bg="#b9c7a8";
   if(S.fault){l1=`FAULT ${S.fault}`;l2=S.faultTxt.slice(0,25);bg=blink(400)?"#e2a3a0":"#b9c7a8"}
   else if(S.bypass){l1="BYPASS MODE";l2=bc&&live?"MOTOR ACROSS LINE":S.olr?"OL RELAY TRIPPED":"DRIVE IDLE"}
   else{l1=`${S.out?"RUN ":"STOP"} ${S.dirOut>0?"FWD":"REV"} ${S.f.toFixed(1).padStart(5)} Hz`;l2=S.ilim?(blink(400)?"CURRENT LIMIT":""):S.ovc?(blink(400)?"OV CONTROL":""):`${S.I.toFixed(1)}A ${f0(S.Vout)}V DC${f0(S.bus)}`}}
  txt(p+"lcd1",l1);txt(p+"lcd2",l2);at(p+"lcdBg","fill",bg);
  if(S.bus>=200&&!F.hsfan)S.hsAng=(S.hsAng+dt*900)%360;at(p+"hsB","transform",`rotate(${S.hsAng.toFixed(1)} 466 282)`);
  txt(p+"hsTxt",S.bus>=200?`Heatsink ${f0(S.hs)}°C`:"");at(p+"hsTxt","fill",S.hs>80?"#c0281c":"#1d2327");
  S.ang=(S.ang+S.n/1760*540*dt)%360;at(p+"rot","transform",`rotate(${S.ang.toFixed(1)} 660 210)`);at(p+"fanB","transform",`rotate(${S.ang.toFixed(1)} 768 210)`);
  at(p+"motorG","transform",(F.bearing||S.T&&S.bypass&&(F.fuse||F.lead))&&S.I>1&&dt>0?`translate(${(Math.random()-.5)*2.4} ${(Math.random()-.5)*2.4})`:"");
  const fan=S.ltype==="fan";at(p+"fanG","opacity",fan?1:0);at(p+"convG","opacity",fan?0:1);
  const flow=S.n>0?S.n/1760:-S.n/1760*0.4;S.aoff-=dt*60*flow;const ae=$(p+"air");if(ae)ae.style.strokeDashoffset=S.aoff;
  at(p+"air","opacity",fan&&flow>0.02?Math.min(1,0.3+flow):0);at(p+"airH","opacity",fan&&flow>0.02?1:0);
  const be=$(p+"belt");if(be)be.style.strokeDashoffset=-S.boxX;S.boxX=(S.boxX+S.n/1760*60*dt)%190;if(S.boxX<0)S.boxX+=190;at(p+"boxes","transform",`translate(${(S.boxX%80).toFixed(1)} 0)`);
  txt(p+"iTxt",S.I>0.05?S.Ia.map(a=>a.toFixed(1)).join(" / ")+" A":"");
  txt(p+"mtTxt",`Winding ${f0(S.mt*1.8+32)}°F`);at(p+"mtTxt","fill",S.mt>=155?"var(--bad)":"var(--ink)");
  txt(p+"rpmTxt",`${f0(Math.abs(S.n))} rpm${S.n<-5?" backward":""}`);
  const pw=Math.max(0,S.Tl*S.n*Math.PI/30)/7457*100;
  txt(p+"loadTxt",fan?`Airflow ${f0(flow*100)}%  ·  power ${f0(pw)}%`:`Belt ${f0(Math.abs(S.n)/1760*100)}%  ·  power ${f0(pw)}%`);
  at(p+"spark","opacity",(S.fault==="GF"||S.fault==="SC")&&blink(150)?1:0);
  // scope: 50 ms window
  S.scph=(S.scph+dt*0.8)%(2*Math.PI);
  const byp=S.bypass&&S.Vout>0,fq=byp?60:S.out?S.f:0;let dV="M30 400",dI="M30 400";
  if(fq>0.05){const m=byp?1:clamp(S.Vout/(S.bus*0.707+1e-6),0,1),amp=byp?38*S.Vout/480:38*Math.min(1,S.bus/700),ia=Math.min(42,S.Ia[0]/30*40);
   for(let i=0;i<=500;i+=1){const t=i/500*0.05,th=2*Math.PI*fq*t+S.scph;let v;
    if(byp)v=Math.sin(th)*amp;else{const tri=Math.abs(((t*1500)%1)*4-2)-1;v=((m*Math.sin(th)>tri?1:0)-(m*Math.sin(th-2.094)>tri?1:0))*amp}
    dV+=byp?`L${30+i} ${(400-v).toFixed(1)}`:`H${30+i}V${(400-v).toFixed(1)}`;dI+=`L${30+i} ${(400-Math.sin(th-0.55)*ia).toFixed(1)}`}}
  else{dV+="H530";dI+="H530"}
  at(p+"scV","d",dV);at(p+"scI","d",dI);
  txt(p+"scTxt",fq>0.05?`${fq.toFixed(1)} Hz: one cycle every ${(1000/fq).toFixed(1)} ms`+(byp?" (pure line sine)":"  ·  pulses switch the full DC bus"):"No output");
  // meter
  const sel=$("mpt");if(sel){if(!sel.options.length){sel.innerHTML=VMET.map((m,i)=>`<option value="${i}">${m[0]}</option>`).join("")}
   const o=$("mread");if(o){const v=VMET[+sel.value||0][1](S,F,V);if(o.textContent!==v)o.textContent=v}}
 },
 boom(kind){const F=this.F,S=this.S,V=this.V;
  if(kind==="shock")return{t:"Shocked by the DC bus",b:`<p>The disconnect was off, but the drive's DC bus capacitors still held ${f0(S.bus)} V DC. That is enough to kill.</p><ul>${li(1,"Opened the drive without measuring the DC bus first.","")}</ul><p>After you lock out, wait the time on the drive's warning label (often 5 to 15 minutes), then measure DC bus + to − with a meter rated for it before you touch anything.</p><small>Simplified: in this sim the bus bleeds down with about a 2 minute time constant.</small>`,wreck:0};
  return{t:"Motor winding burned up",b:`<p>The stator winding reached ${f0(S.mt*1.8+32)}°F. The insulation charred and the winding shorted. The motor needs a rewind or a replacement.</p><ul>
   ${S.bypass&&(F.fuse||F.lead)?li(1,"Single-phased across the line: a stalled motor draws locked-rotor current with no cooling."):""}
   ${S.bypass?li(F.olJump,"Overload relay jumpered out: nothing opened the contactor.","Overload relay."):li(V.ol>16.1,`Drive overload set to ${V.ol} A instead of the 14 A nameplate FLA.`,"Drive motor overload setting.")}
   ${!S.bypass&&Math.abs(S.n)<900?li(1,"Ran slow under a heavy constant-torque load: the motor's own shaft fan barely moves air at low speed."):""}
   ${F.jam?li(1,"Load jammed."):""}</ul><p>Set the overload to the nameplate FLA. For long low-speed runs at high torque, use an inverter-duty motor, a separate blower or a winding thermostat.</p><small>Simplified: heating is sped up.</small>`,wreck:1};
 },
 parts:{
  disconnect:{n:"Fused disconnect",s:"Isolates the drive from the 480 V supply and protects it.",w:"A three-pole switch with a fuse on each line. Semiconductor-rated fuses are common ahead of drives.",y:"Turning it off removes the supply, but the drive's DC bus stays charged for minutes.",f:"One blown fuse is a phase loss: the drive sees heavy DC bus ripple and trips on input phase loss when loaded. Across the line, the motor single-phases.",src:["emvfd","yask"],faults:["fuse","brown"]},
  contactor:{n:"Bypass contactor and overload relay",s:"Runs the motor straight across the line if the drive fails.",w:"A three-pole contactor with a thermal or electronic overload relay (class 10 here), set to the motor's FLA.",y:"In bypass the motor starts at full voltage and 60 Hz: about 6 times FLA inrush and full speed only.",f:"A jumpered or oversized overload relay lets a stalled or single-phased motor burn up.",src:["lra","flc"],faults:["olJump"]},
  rectifier:{n:"Rectifier",s:"Turns three-phase AC into DC.",w:"Six diodes in a bridge, two per phase.",y:"Each diode conducts when its phase is the highest (or lowest), charging the DC bus to about 1.35 to 1.41 times the line voltage: about 650 V DC on 480 V.",f:"A blown diode or a missing phase makes the bus sag and ripple under load.",src:["emvfd"],faults:["fuse"]},
  dcbus:{n:"DC bus capacitors",s:"Store energy and smooth the DC.",w:"Large electrolytic capacitors across the + and − bus.",y:"They hold the bus steady between rectifier pulses and soak up energy the motor sends back when slowing down. Normal: about 650 V on 480 V. The drive trips at about 800 V (overvoltage) and about 380 V (undervoltage).",f:"Aged capacitors lose capacitance: more ripple and faster overvoltage trips. They hold a lethal charge after power is removed.",src:["yask","acs580","dcov"],faults:["caps"]},
  inverter:{n:"Inverter (IGBTs)",s:"Switches the DC bus into variable-frequency AC.",w:"Six insulated gate bipolar transistors, two per output phase.",y:"They switch thousands of times a second (pulse width modulation). The width of the pulses sets the voltage, their pattern sets the frequency, and the motor's inductance smooths the current into a sine wave.",f:"A shorted IGBT trips the drive instantly on short circuit or desaturation. Check with a diode test from each output to DC+ and DC− with the power off.",src:["emvfd"],faults:["igbt"]},
  keypad:{n:"Keypad and display",s:"Run, stop, reset, and the readouts.",w:"Shows output frequency, current, voltage and DC bus, plus fault codes.",y:"Parameters set the accel and decel times, the motor's nameplate data and overload, the stop mode and stall prevention.",f:"Read the fault code and the fault history first: they say where to look.",src:["emvfd"],faults:[]},
  hsfan:{n:"Drive cooling fan",s:"Cools the heatsink under the IGBTs.",w:"A fan blowing across the aluminum heatsink.",y:"Drive losses are a few percent of the power and end up as heat in the heatsink.",f:"A dead fan or dirty heatsink trips the drive on overtemperature under load. High room temperature does the same.",src:["emvfd"],faults:["hsfan"]},
  motor:{n:"Induction motor",s:"10 hp, 460 V, 4-pole, TEFC.",w:"A stator winding makes a rotating magnetic field; the rotor bars are dragged along slightly slower than the field (slip).",y:"Synchronous speed = 120 × frequency ÷ poles: 1800 rpm at 60 Hz. At full load it slips to about 1760 rpm. The drive keeps volts per hertz constant (460 ÷ 60 = 7.7 V/Hz) up to 60 Hz.",f:"Check winding resistance (all three equal), insulation to ground with a megger (IEEE 43: at least 5 MΩ), current balance, bearings and temperature. A megger won't find a turn-to-turn short; unequal resistance and current will.",src:["induct","ieee43","flc"],faults:["gnd","turn","lead","bearing","swap"]},
  fanload:{n:"Fan",s:"A variable-torque load.",w:"A heavy centrifugal fan wheel.",y:"Affinity laws: airflow follows speed, pressure follows speed squared, power follows speed cubed. At 80% speed the fan needs only about half the power.",f:"Its heavy wheel keeps spinning: a short decel time turns the motor into a generator and pumps up the DC bus. Two leads swapped run it backward with far less airflow.",src:["affin","dcov"],faults:["jam","swap"]},
  conveyor:{n:"Conveyor",s:"A constant-torque load.",w:"A belt conveyor through a gearbox.",y:"It needs about the same torque at every speed, so the motor draws near full current even when slow.",f:"At low speed the motor's shaft fan barely cools it. A jam stalls it and trips the overload.",src:["induct"],faults:["jam"]},
  plate:{n:"Nameplate",s:"The motor's ratings.",w:"Horsepower, voltage, full load amps, rpm, service factor, insulation class, enclosure.",y:"Enter the nameplate FLA in the drive and set the overload to it. 14 A matches the NEC full load current for a 10 hp, 460 V motor.",f:"",src:["flc"],faults:[]},
  scope:{n:"Scope",s:"What the drive's output actually looks like.",w:"Yellow: voltage between T1 and T2. Cyan: current in T1.",y:"The voltage is a train of full-bus pulses whose width follows a sine wave. The current is close to a smooth sine. In bypass both are the plain 60 Hz line.",f:"Because of the pulses, measure drive output voltage with a meter's low-pass or VFD mode.",src:["emvfd"],faults:[]}}
};
VFD.lampOn=S=>({pwr:S.bus>=200,run:S.out||(S.bypass&&S.Vout>0),spd:S.out&&Math.abs(S.f-(S.cmd?VFD.V.fref:0))<0.2,ilim:S.ilim,ovc:S.ovc,byp:S.bypass,flt:!!S.fault||S.olr||S.fuses});
