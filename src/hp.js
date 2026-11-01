/* ============ HEAT PUMP ============ */
SRC.dfx=["HVAC Excellence study guide: Defrost controls and sequences","https://open-exam-prep.com/study-guides/hvac-excellence/heat-pumps-dual-fuel/defrost-systems"];
SRC.dfb=["ACHR News: Understanding a defrost board on a heat pump","https://www.achrnews.com/articles/165721-understanding-a-defrost-board-on-a-heat-pump"];
PHOTOS.hp=Object.assign({},PHOTOS.split,{rv:[gimg("heat pump reversing valve and solenoid coil")],defrost:[gimg("heat pump defrost control board 30 60 90")],strips:[gimg("air handler electric heat strip kit")],ometer:[gimg("heat pump piston check valve distributor")],condenser:[gimg("heat pump outdoor coil frost")]});
ILL.rv=`${box(30,40,100,34,BR,16)}${pipeV(80,74,108,10)}${pipeV(52,8,40,10)}${pipeV(80,8,40,10)}${pipeV(108,8,40,10)}${label(52,6,"E",K,7)}${label(80,6,"S",K,7)}${label(108,6,"C",K,7)}${label(92,104,"D",K,7)}${box(56,82,0,0,K)}<rect x="120" y="46" width="30" height="22" rx="4" fill="#2f3337" stroke="${K}"/>${label(135,60,"COIL",WH,6)}${label(80,62,"SLIDE",K,8)}`;
ILL.defrost=`${box(20,20,120,80,"#2f6a3a",4)}${[0,1,2].map(i=>`<rect x="${34+i*18}" y="34" width="10" height="16" fill="#222" stroke="${K}"/>${label(39+i*18,62,["30","60","90"][i],WH,7)}`).join("")}<rect x="52" y="30" width="14" height="24" fill="none" stroke="#e8c33a" stroke-width="2"/>${box(100,30,30,20,"#222",2)}${label(115,44,"CPU",WH,6)}${label(80,90,"DEFROST BOARD",WH,8)}<path d="M140 70 C150 70 154 90 156 110" stroke="${CU}" stroke-width="2" fill="none"/>${label(130,116,"SENSOR",K,6)}`;
ILL.strips=`${box(14,24,132,72,"#d8dcdf",4)}<path d="M24 40 ${Array.from({length:14},(_,i)=>`L${30+i*8} ${i%2?40:80}`).join(" ")}" stroke="#d2541f" stroke-width="2.4" fill="none"/>${box(14,24,12,72,"#9aa1a8",2)}${label(80,108,"10 kW HEAT STRIP (240 V)",K,7)}${label(80,18,"LIMIT + SEQUENCER",K,6)}`;
ILL.ometer=`${pipeH(4,60,60,8)}${box(60,48,40,24,BR,5)}${pipeH(100,156,60,8)}<rect x="74" y="54" width="10" height="12" rx="3" fill="${BRD}"/>${label(80,90,"PISTON + CHECK",K,7)}${label(80,104,"(meters in heat, bypasses in cool)",K,6)}`;

const HP=Object.assign({},SPLIT,{id:"hp",p:"h_",name:"Heat pump",
 svg:SPLIT.svg.replace(/r_/g,"h_")
  // indoor coil + outdoor coil get their own two-way gradients
  .replace(/<linearGradient id="h_gEvap"[\s\S]*?<\/linearGradient>/,`<linearGradient id="h_gEvap" gradientUnits="userSpaceOnUse" x1="0" y1="318" x2="0" y2="200"><stop id="h_e0" offset="0" stop-color="var(--r-mix)"/><stop id="h_eS1" offset=".8" stop-color="var(--r-mix)"/><stop id="h_eS2" offset=".9" stop-color="var(--r-suc)"/><stop id="h_e3" offset="1" stop-color="var(--r-suc)"/></linearGradient>`)
  .replace(/<linearGradient id="h_gCond"[\s\S]*?<\/linearGradient>/,`<linearGradient id="h_gCond" gradientUnits="userSpaceOnUse" x1="0" y1="205" x2="0" y2="420"><stop id="h_c0" offset="0" stop-color="var(--r-dis)"/><stop id="h_cS1" offset=".12" stop-color="#e0662a"/><stop id="h_cS2" offset=".85" stop-color="var(--r-liq)"/><stop id="h_c3" offset="1" stop-color="var(--r-liq)"/></linearGradient>`)
  .replace('>Evaporator</text>',' id="h_inName">Indoor coil</text>')
  .replace('>Condenser coil</text>','>Outdoor coil</text>')
  .replace('>Condenser fan</text>','>Outdoor fan</text>')
  // vapor line now ends at the reversing valve E port
  .replace(/d="M240 200 V172 H380 V366 H560"/g,'d="M240 200 V172 H380 V366 H470 V228 H570 V250"')
  // old discharge line becomes C port to outdoor coil
  .replace(/d="M600 300 V215 H730"/g,'d="M630 250 V215 H730"')
  .replace('<text class="val" id="h_dTxt" x="608" y="250" font-size="11">','<text class="val" id="h_dTxt" x="648" y="296" font-size="11">')
  // move the control box to the right of the compressor
  .replace('<rect x="462" y="198" width="86" height="88" rx="3" fill="var(--paper)" stroke="var(--line)" opacity=".7"/>','<rect x="644" y="310" width="76" height="98" rx="3" fill="var(--paper)" stroke="var(--line)" opacity=".7"/>')
  .replace('<rect class="hl body" x="468" y="206" width="36" height="44" rx="3"/>','<rect class="hl body" x="648" y="318" width="34" height="40" rx="3"/>')
  .replace('<rect id="h_contBar" x="472" y="216" width="28" height="6" fill="var(--muted)"/>','<rect id="h_contBar" x="651" y="326" width="28" height="6" fill="var(--muted)"/>')
  .replace('<circle id="h_contLamp" cx="486" cy="238" r="4" fill="var(--lamp-off)"/>','<circle id="h_contLamp" cx="665" cy="346" r="4" fill="var(--lamp-off)"/>')
  .replace('<text class="tag" x="486" y="262" text-anchor="middle" fill="var(--muted)">CONTACTOR</text>','<text class="tag" x="665" y="368" text-anchor="middle" fill="var(--muted)">CONT.</text>')
  .replace('<rect class="hl" x="514" y="206" width="26" height="46" rx="8" fill="#b9c0c6" stroke="var(--line)"/>','<rect class="hl" x="690" y="318" width="24" height="40" rx="8" fill="#b9c0c6" stroke="var(--line)"/>')
  .replace('<rect id="h_capBulge" x="514" y="200" width="26" height="8" rx="4" fill="#b9c0c6" stroke="var(--bad)" opacity="0"/>','<rect id="h_capBulge" x="690" y="312" width="24" height="8" rx="4" fill="#b9c0c6" stroke="var(--bad)" opacity="0"/>')
  .replace('<text class="tag" x="527" y="276" text-anchor="middle" fill="var(--muted)">CAP</text>','<text class="tag" x="702" y="368" text-anchor="middle" fill="var(--muted)">CAP</text>')
  // HPS on the discharge stub, LPS on true suction
  .replace('<rect class="hl" x="652" y="188" width="24" height="20" rx="3" fill="var(--plate)"/>','<rect class="hl" x="606" y="278" width="22" height="18" rx="3" fill="var(--plate)"/>')
  .replace('<circle id="h_hpsLamp" cx="664" cy="198" r="4" fill="var(--lamp-off)"/>','<circle id="h_hpsLamp" cx="617" cy="287" r="4" fill="var(--lamp-off)"/>')
  .replace('<text class="tag" x="664" y="234" text-anchor="middle" fill="var(--muted)">HPS</text>','<text class="tag" x="640" y="290" fill="var(--muted)">HPS</text>')
  .replace('<rect class="hl" x="500" y="338" width="24" height="20" rx="3" fill="var(--plate)"/>','<rect class="hl" x="526" y="338" width="22" height="18" rx="3" fill="var(--plate)"/>')
  .replace('<circle id="h_lpsLamp" cx="512" cy="348" r="4" fill="var(--lamp-off)"/>','<circle id="h_lpsLamp" cx="537" cy="347" r="4" fill="var(--lamp-off)"/>')
  .replace('<text class="tag" x="512" y="332" text-anchor="middle" fill="var(--muted)">LPS</text>','<text class="tag" x="537" y="334" text-anchor="middle" fill="var(--muted)">LPS</text>')
  .replace('<text class="val" id="h_slTxt" x="466" y="388" font-size="11">','<text class="val" id="h_slTxt" x="390" y="392" font-size="11">')
  // low hose to the common suction port
  .replace('<path d="M512 140 C480 220 440 300 452 360" fill="none" stroke="#3d7de0" stroke-width="2.5" stroke-dasharray="1 0"/>','<path d="M512 140 C520 200 470 300 520 330" fill="none" stroke="#3d7de0" stroke-width="2.5"/>')
  .replace('<circle cx="452" cy="366" r="5" fill="var(--brass)"/>','<circle cx="520" cy="332" r="5" fill="var(--brass)"/><circle cx="452" cy="366" r="4" fill="var(--brass)"/>')
  .replace('<g id="h_labels">',`
<!-- discharge (compressor to D) and true suction (S to compressor) -->
<path id="h_pD2" class="rpipe" d="M600 300 V272" stroke="var(--r-dis)" stroke-width="7"/>
<path id="h_pS" class="rpipe" d="M600 250 V238 H520 V380 H560" stroke="var(--r-suc)" stroke-width="8"/>
<path id="h_fS" class="rflow" d="M600 250 V238 H520 V380 H560"/>
<!-- reversing valve -->
<g class="part" data-p="rv" tabindex="0">
 <rect class="hl" x="560" y="250" width="80" height="22" rx="11" fill="#c9a24a" stroke="var(--line)"/>
 <rect id="h_slide" x="566" y="254" width="40" height="14" rx="6" fill="#8a6a22"/>
 <rect x="642" y="252" width="20" height="18" rx="3" fill="var(--plate)"/><circle id="h_rvLamp" cx="652" cy="261" r="4" fill="var(--lamp-off)"/>
 <text class="tag" x="556" y="264" text-anchor="end" fill="var(--muted)">REV. VALVE</text>
</g>
<!-- outdoor metering device -->
<g class="part" data-p="ometer" tabindex="0"><rect class="hl body" x="736" y="424" width="20" height="12" rx="3"/><text class="tag" x="760" y="420" fill="var(--muted)">PISTON</text></g>
<!-- defrost board and sensor -->
<g class="part" data-p="defrost" tabindex="0">
 <rect class="hl" x="648" y="372" width="66" height="30" rx="3" fill="#2f6a3a"/>
 <text id="h_dfTxt" x="681" y="391" text-anchor="middle" font-family="var(--mono)" font-size="10" fill="#e9ecee">60 min</text>
 <circle id="h_dfLamp" cx="706" cy="380" r="3" fill="var(--lamp-off)"/>
 <circle cx="730" cy="408" r="4" fill="#c87f4f" stroke="var(--ink)" stroke-width=".8"/>
</g>
<rect id="h_frost" x="724" y="200" width="40" height="224" rx="3" fill="#f2faff" stroke="#8fc3e6" stroke-width="2" opacity="0"/>
<text id="h_frostTxt" x="744" y="315" text-anchor="middle" font-family="var(--display)" font-weight="700" font-size="13" fill="#2f6fd6" transform="rotate(-90 744 315)" opacity="0">FROST</text>
<!-- heat strips in the supply plenum -->
<g class="part" data-p="strips" tabindex="0">
 <rect class="hl" x="200" y="112" width="80" height="22" fill="transparent" stroke="none"/>
 <path id="h_strip" d="M204 123 l6 -8 6 16 6 -16 6 16 6 -16 6 16 6 -16 6 16 6 -16 6 16 6 -16 6 16 6 -8" fill="none" stroke="var(--line)" stroke-width="2.5"/>
 <text class="tag" x="240" y="146" text-anchor="middle" fill="var(--muted)">HEAT STRIPS</text>
</g>
<g id="h_labels">`)
  .replace(/<text class="st" x="608" y="232" fill="var\(--r-dis\)">HOT GAS<\/text>/,'<text class="st" id="h_lDis" x="604" y="290" fill="var(--r-dis)" opacity="0">HOT GAS</text>')
  .replace('<text class="st" x="200" y="463" fill="var(--r-liq)">WARM LIQUID, HIGH PRESSURE</text>','<text class="st" id="h_lLiq" x="200" y="463" fill="var(--r-liq)">WARM LIQUID, HIGH PRESSURE</text>')
  .replace('<text class="st" x="196" y="349" fill="var(--r-mix)">COLD LIQUID + FLASH GAS</text>','<text class="st" id="h_lMix" x="196" y="349" fill="var(--r-mix)">COLD LIQUID + FLASH GAS</text>')
  .replace('<text class="st" x="250" y="166" fill="var(--r-suc)">COOL VAPOR, LOW PRESSURE</text>','<text class="st" id="h_lVap" x="250" y="166" fill="var(--r-suc)">COOL VAPOR, LOW PRESSURE</text>'),
 sliders:[
  {k:"set",l:"Thermostat",u:"°F",min:50,max:90,step:1,v:70,n:[65,78],note:"Heat: normal 65–72°F. Cool: normal 70–78°F."},
  {k:"out",l:"Outdoor temperature",u:"°F",min:-10,max:115,step:1,v:35,note:"Heat pumps lose capacity as it gets colder. Frost forms on the outdoor coil below about 40°F."},
  {k:"charge",l:"Refrigerant charge",u:"%",min:0,max:160,step:1,v:100,n:[95,105],note:"Percent of the factory charge"},
  {k:"cfm",l:"Indoor airflow",u:" CFM/ton",min:0,max:700,step:10,v:400,n:[350,450],note:"About 400 CFM per ton (350–450)"},
  {k:"dfi",l:"Defrost interval",u:" min",min:30,max:90,step:30,v:60,note:"Board jumper: 30, 60 or 90 minutes of heating run time with the coil sensor closed (60 is the usual default)",more:1},
  {k:"sh",l:"Indoor TXV superheat setting (cooling)",u:"°F",min:0,max:30,step:1,v:10,n:[8,12],note:"Typical 8–12°F",more:1},
  {k:"hps",l:"High pressure switch opens at",u:" psig",min:300,max:900,step:10,v:650,n:[590,660],note:"R-410A: typically 590–650 psig",more:1},
  {k:"lps",l:"Low pressure switch opens at",u:" psig",min:0,max:150,step:5,v:20,n:[5,50],note:"Heat pumps often use a lower setting or a loss-of-charge switch so they can run in cold weather",more:1},
  {k:"asc",l:"Anti-short-cycle delay",u:" min",min:0,max:10,step:1,v:5,n:[3,5],note:"Typically 3–5 minutes",more:1}],
 faults:[["leak","Refrigerant leak"],["filter","Dirty air filter"],["blower","Indoor blower motor fails"],["dirtyCond","Dirty outdoor coil"],["condFan","Outdoor fan motor fails"],
  ["rvStuck","Reversing valve stuck in the cooling position"],["rvLeak","Reversing valve leaking hot gas to suction"],["dfFail","Defrost board fails (never defrosts)"],["auxFail","Heat strips fail (open element)"],
  ["comp","Worn compressor (leaks internally)"],["cap","Run capacitor fails (compressor side)"],["contactor","Contactor contacts welded shut"],
  ["hpsFail","High pressure switch fails closed"],["lpsFail","Low pressure switch fails closed"],["olFail","Compressor overload fails to open"]],
 hidden:["hpsFail","lpsFail","olFail"],txvOnly:[],
 scenarios:[{l:"Frozen solid: defrost board fails at 30°F outdoors",f:["dfFail"],v:{out:30}},
  {l:"Burnout: blower dead in heat, high pressure switch and overload fail",f:["blower","hpsFail","olFail"],v:{out:40}},
  {l:"Cold air in heat mode: reversing valve stuck",f:["rvStuck"],v:{out:35}}],
 lamps:[["call","Call Y","g"],["aux","Aux heat","a"],["rv","Rev. valve (O)","a"],["defrost","Defrost","a"],["delay","Delay","a"],["comp","Compressor","g"],["fan","Outdoor fan","g"],["blower","Blower","g"],["hps","High press.","r"],["lps","Low press.","r"],["ol","Overload","r"],["lock","Lockout","r"]],
 lampOn:S=>({call:S.calling,aux:S.auxOn,rv:S.rv==="cool"&&S.comp,defrost:S.defrost,delay:S.delay>0&&S.calling,comp:S.comp,fan:S.fanOut,blower:S.blowerOn,hps:S.hps,lps:S.lps,ol:S.ol,lock:S.lock})
});
HP.parts=Object.assign({},SPLIT.parts,{
 condenser:{n:"Outdoor coil",s:"Condenser in cooling, evaporator in heating.",
  w:"Tubes and fins with the outdoor fan pulling air through them.",
  y:"In cooling it rejects heat outdoors like any condenser. In heating the cold refrigerant boils in it and picks up heat from the outdoor air, even air well below freezing. The coil runs colder than the outdoor air, so in heating mode the air leaving the fan is colder than the air going in.",
  f:"Below about 40°F outdoors the coil runs below freezing and frost builds on it. Frost blocks the air, suction pressure drops and capacity falls until a defrost clears it. A dirty coil does the same in both modes.",
  src:["em_hp","dfx"],faults:["dirtyCond"]},
 evap:{n:"Indoor coil",s:"Evaporator in cooling, condenser in heating.",
  w:"The A-coil above the blower.",
  y:"In cooling the refrigerant boils in it and cools the air. In heating hot gas from the compressor condenses in it and heats the air, typically 25–35°F of temperature rise. The vapor line to it carries hot gas in heating mode.",
  f:"Low airflow in heating raises head pressure (the indoor coil is the condenser) and can trip the high pressure switch. In cooling, low airflow can freeze it.",
  src:["em_hp","charge"],faults:[]},
 meter:{n:"Indoor metering device",s:"TXV with a check valve: meters in cooling, bypasses in heating.",
  w:"A TXV at the indoor coil. In heating the flow runs backward, so a built-in check valve lets liquid bypass it.",
  y:"Each coil has its own metering device, and each only meters when its coil is the evaporator.",
  f:"See the split AC trainer for TXV faults.",src:["em_hp","em_txv"],faults:[]},
 ometer:{n:"Outdoor metering device",s:"Piston that meters in heating and bypasses in cooling.",
  w:"A piston in a check-valve body at the outdoor coil. In heating it meters liquid into the outdoor coil; in cooling the piston slides off its seat and liquid flows around it.",
  y:"It sets the outdoor coil's superheat in heating.",f:"A piston stuck open in heating floods the outdoor coil.",src:["em_hp"],faults:[]},
 suction:{n:"Vapor line",s:"Large line: cool vapor in cooling, hot gas in heating.",
  w:"The larger, insulated line of the line set. On a heat pump it is called the vapor line, not the suction line.",
  y:"In cooling it returns vapor from the indoor coil (suction). In heating it carries hot discharge gas to the indoor coil, so it is hot to the touch. Read suction pressure at the common suction port between the reversing valve and the compressor in either mode.",
  f:"A gauge on the vapor line service valve reads high-side pressure in heating mode.",src:["em_hp"],faults:["leak"]},
 liquid:{n:"Liquid line",s:"Small line: liquid flows outdoors-to-indoors in cooling, the other way in heating.",
  w:"The smaller, bare line of the line set.",y:"Liquid always flows away from whichever coil is the condenser.",f:"",src:["em_hp"],faults:["leak"]},
 rv:{n:"Reversing valve",s:"4-way valve that swaps which coil is the condenser.",
  w:"A brass body with a sliding port inside, moved by refrigerant pressure through a small pilot valve. A 24 V solenoid coil works the pilot. D (discharge) comes in alone; E, S and C are on the other side. S always goes to the compressor suction.",
  y:"Cooling: hot gas goes to the outdoor coil (C) and the indoor coil (E) connects to suction. Heating: hot gas goes to the indoor coil and the outdoor coil connects to suction. Most brands energize it in cooling (O terminal); some energize in heating (B). It needs the compressor running and a pressure difference to shift.",
  f:"Stuck in cooling: blows cold air in heating mode. Leaking through: hot gas goes straight to suction, giving high suction, low head, a hot suction line at the compressor and poor capacity in both modes.",
  src:["em_hp","dfx"],faults:["rvStuck","rvLeak"]},
 defrost:{n:"Defrost control",s:"Melts frost off the outdoor coil on a timer.",
  w:"A time-temperature board with a jumper for 30, 60 or 90 minutes and a sensor clipped to the outdoor coil. The sensor closes at about 30°F (±3°F).",
  y:"It counts heating run time while the sensor is closed. At the interval it starts defrost: reversing valve to cooling, outdoor fan off, heat strips on to temper the cold supply air. Hot gas melts the frost. Defrost ends when the coil warms to about 55–65°F, or after about 10–14 minutes at most.",
  f:"A failed board or sensor never defrosts: the coil frosts solid, suction pressure drops and the house gets cold. Steam off the outdoor unit during defrost is normal.",
  src:["dfx","dfb"],faults:["dfFail"]},
 strips:{n:"Heat strips (aux heat)",s:"Electric resistance heat for cold days and defrost.",
  w:"Nichrome elements in the air handler, switched by sequencers or relays with high-limit protection.",
  y:"Second stage (W2) brings them on when the heat pump can't keep up, below the balance point. They also come on during defrost. Emergency heat runs strips only.",
  f:"An open element or tripped limit leaves the house cold on the coldest days.",
  src:["dfx","dfb"],faults:["auxFail"]},
 compressor:Object.assign({},SPLIT.parts.compressor,{faults:["comp","olFail"]})
});
delete HP.parts.drier;
HP.init=function(){const V=this.V;const peq=psat(50)*Math.min(1,V.charge/15);
  return Object.assign(SPLIT.init.call(this),{Troom:66,Ps:peq,Pd:peq,meter:"txv",mode:"heat",rv:"heat",frost:0,coilT:V.out,defrost:false,dfT:0,dfRun:0,auxOn:false,hpCap:0})};
HP.switches=[
  {l:S=>`Disconnect: ${S.svc?"on":"off"}`,on:S=>S.svc,act(sim){sim.S.svc=!sim.S.svc;log(sim,`Outdoor disconnect ${sim.S.svc?"on":"pulled (off)"}.`)}},
  {l:S=>`Thermostat: ${{heat:"heat",cool:"cool",em:"emergency heat",off:"off"}[S.mode]}`,on:S=>S.mode!=="off",act(sim){const S=sim.S;S.mode={heat:"cool",cool:"em",em:"off",off:"heat"}[S.mode];log(sim,`Thermostat set to ${{heat:"heat",cool:"cool",em:"emergency heat (strips only)",off:"off"}[S.mode]}.`)}},
  {l:S=>`Fan: ${S.fan}`,on:S=>S.fan==="on",act(sim){const S=sim.S;S.fan=S.fan==="auto"?"on":"auto";log(sim,`Indoor fan set to ${S.fan}.`)}},
  {l:()=>"Force defrost",on:S=>S.defrost,act(sim){const S=sim.S;if(S.comp&&S.rv==="heat"&&!S.defrost){S.defrost=true;S.dfT=0;log(sim,"Defrost forced (test pins jumped).","w")}else log(sim,"Defrost only runs while the compressor is running in heating.","w")}},
  {l:S=>`Labels: ${S.labels===false?"off":"on"}`,on:S=>S.labels!==false,act(sim){sim.S.labels=sim.S.labels===false;}}];
HP.resets=function(S){const r=SPLIT.resets.call(this,S).filter(x=>!x[0].startsWith("Thaw"));return r};
HP.reads=function(S){const run=S.comp;return [["Suction",`${f0(S.Ps)} psig`],["Head",`${f0(S.Pd)} psig`],["Superheat",run?`${f0(S.sh)}°F`:"—"],["Subcooling",run?`${f0(S.sc)}°F`:"—"],["Supply air",S.blowerOn?`${f0(S.Tsup)}°F`:"—"],["Room",`${S.Troom.toFixed(1)}°F`]]};
// heating-mode targets: outdoor coil is the evaporator, indoor coil is the condenser
HP.heatTargets=function(){const S=this.S,F=this.F,V=this.V,Tamb=V.out,ch=Math.max(0,V.charge/100);
  const afOut=((!S.fanOut||F.condFan)?0.12:(F.dirtyCond?0.45:1))*(1-0.85*S.frost);
  const af=S.cfm/(TONS*400);
  let sst=Tamb-15*(afOut>=1?1:1+1.2*(1-afOut));
  sst-=30*Math.max(0,1-ch);sst+=8*Math.max(0,ch-1);if(F.comp)sst+=8;if(F.rvLeak)sst+=8;
  if(ch<0.25)sst-=(0.25-ch)*120;
  let sct=S.Troom+Math.min(110,30/Math.pow(Math.max(af,0.12),0.8));
  sct+=40*Math.max(0,ch-1)-15*Math.min(0.7,Math.max(0,1-ch));if(F.comp)sct-=10;if(F.rvLeak)sct-=10;
  sst=Math.max(-50,Math.min(sst,Tamb-2));
  const Ps=psat(sst),Pd=psat(sct),ratio=(Pd+ATM)/Math.max(1,Ps+ATM);
  const volEff=clamp(1-0.06*(ratio-3),0.3,1.1);
  const mfrac=Math.max(0,(Ps+ATM)/133.7)*volEff*(F.comp?0.55:1)*(F.rvLeak?0.75:1);
  let sh=8+80*Math.max(0,1-ch)-40*Math.max(0,ch-1)-10*Math.max(0,1-afOut)+(F.rvLeak?6:0)+(F.comp?6:0);
  let sc=10+50*(ch-1)+(F.comp?3:0)-4*Math.max(0,1-af);
  return {sst,sct,Ps,Pd,ratio,mfrac,shRaw:sh,sh:clamp(sh,0,90),sc:clamp(sc,0,45),tsh:0,WB:0}};
HP.targets=function(){const S=this.S;
  if(S.rv==="heat")return this.heatTargets();
  const T=SPLIT.targets.call(this);
  if(this.F.rvLeak){T.Ps=psat(T.sst+8);T.Pd=psat(T.sct-10);T.mfrac*=0.75;T.sst+=8;T.sct-=10}
  if(S.defrost){T.sct=Math.max(S.coilT+20,T.sst+30);T.Pd=psat(T.sct)}
  return T};
HP.step=function(dt){const sim=this,S=this.S,F=this.F,V=this.V;S.t+=dt;const Tamb=V.out;
  if(F.leak&&V.charge>0){const before=V.charge;V.charge=Math.max(0,V.charge-0.006*dt);if(Math.floor(before/10)!==Math.floor(V.charge/10))log(sim,`Refrigerant leaking: charge now ${Math.round(V.charge)}%.`,"w")}
  // thermostat: Y for compressor, W2 for strips
  const was=S.calling;
  if(S.mode==="heat"){if(!S.calling&&S.Troom<V.set-0.75)S.calling=true;else if(S.calling&&S.Troom>V.set+0.75)S.calling=false}
  else if(S.mode==="cool"){if(!S.calling&&S.Troom>V.set+0.75)S.calling=true;else if(S.calling&&S.Troom<V.set-0.75)S.calling=false}
  else S.calling=false;
  if(S.calling!==was)log(sim,S.calling?`Thermostat calls for ${S.mode==="heat"?"heat":"cooling"}.`:"Thermostat satisfied.");
  const emCall=S.mode==="em"&&S.Troom<V.set-0.75||S.mode==="em"&&S.emOn&&S.Troom<V.set+0.75;S.emOn=emCall;
  const w2=(S.mode==="heat"&&S.Troom<V.set-2)||emCall;
  if(w2&&!S.w2Logged){S.w2Logged=true;log(sim,emCall?"Emergency heat: strips only.":"Room 2°F below setpoint. Second stage brings on the heat strips.","w")}if(!w2)S.w2Logged=false;
  S.auxOn=(w2||S.defrost)&&!F.auxFail;
  S.blowerOn=(S.fan==="on"||S.calling||w2||S.defrost)&&!F.blower;
  S.cfm=S.blowerOn?TONS*V.cfm*(F.filter?0.55:1)*(1-0.85*S.ice):0;
  if(S.hps&&S.Pd<=V.hps-200){S.hps=false;log(sim,"High pressure switch reset.")}
  if(S.lps&&S.Ps>=V.lps+40){S.lps=false;log(sim,"Low pressure switch closed again.")}
  if(S.ol&&S.Tm<=170){S.ol=false;log(sim,"Compressor overload reset (motor cooled).")}
  if(S.delay>0)S.delay=Math.max(0,S.delay-dt);
  const ysig=(S.calling||S.defrost)&&!S.hps&&!S.lps&&S.delay<=0&&!S.lock&&S.mode!=="em";
  S.contactor=ysig||F.contactor;
  const power=S.svc&&S.contactor;
  const wasRun=S.comp;
  S.hum=power&&!S.ol&&F.cap;S.comp=power&&!S.ol&&!F.cap;
  if(S.comp&&!wasRun){S.runT=0;log(sim,"Contactor closed. Compressor started.")}
  if(!S.comp&&wasRun){S.delay=V.asc*60;if(S.defrost){S.defrost=false;log(sim,"Defrost cancelled: compressor stopped.","w")}log(sim,`Compressor stopped.${V.asc>0?` ${V.asc}-minute delay before it can restart.`:""}`)}
  if(S.hum&&!S.humLogged){S.humLogged=true;log(sim,"Compressor hums but won't start. Drawing locked-rotor amps.","b")}if(!S.hum)S.humLogged=false;
  // reversing valve: needs the compressor running to shift
  const want=(S.mode==="cool"||S.defrost)?"cool":"heat";
  if(S.comp&&S.runT>3&&S.rv!==want&&(S.Pd-S.Ps)>50){if(F.rvStuck&&want==="heat"){if(!S.rvLogged){S.rvLogged=true;log(sim,"Reversing valve was told to shift to heating, but it is stuck in cooling.","b")}}else{S.rv=want;log(sim,`Reversing valve shifted to ${want==="cool"?"cooling":"heating"}.`)}}
  if(!F.rvStuck)S.rvLogged=false;
  S.fanOut=power&&!F.condFan&&!S.defrost;
  // refrigerant side
  const T=this.targets();
  if(S.comp){S.runT+=dt;const kd=Math.min(1,dt/25),ks=Math.min(1,dt/25);
    S.Ps+=(T.Ps-S.Ps)*ks;S.Pd+=(T.Pd-S.Pd)*kd;S.sh+=(T.sh-S.sh)*Math.min(1,dt/30);S.sc+=(T.sc-S.sc)*Math.min(1,dt/30);S.shRaw=T.shRaw;
    S.mfrac=T.mfrac*clamp(S.runT/20,0,1)}
  else{const peq=psat((Tamb+S.Troom)/2)*Math.min(1,V.charge/15);S.Ps+=(peq-S.Ps)*Math.min(1,dt/120);S.Pd+=(peq-S.Pd)*Math.min(1,dt/120);S.mfrac=0;S.shRaw=10}
  S.sst=tsat(S.Ps);S.sct=tsat(S.Pd);
  // outdoor coil temperature, frost and defrost
  if(S.comp&&S.rv==="heat")S.coilT=S.sst+2;
  else if(S.defrost){if(S.frost>0){S.coilT+=(32-S.coilT)*Math.min(1,dt/20);S.frost=Math.max(0,S.frost-dt/200)}else S.coilT+=dt*0.25}
  else if(S.comp)S.coilT=S.sct-5;
  else S.coilT+=(Tamb-S.coilT)*Math.min(1,dt/300);
  if(S.comp&&S.rv==="heat"&&S.coilT<32&&Tamb<45){S.frost=Math.min(1,S.frost+dt*(32-S.coilT)/40000*clamp((Tamb-5)/30,0.25,1))}
  else if(!S.defrost&&S.frost>0&&S.coilT>34)S.frost=Math.max(0,S.frost-dt/1200);
  if(S.frost>0.2&&!S.frostLogged){S.frostLogged=true;log(sim,"Frost building on the outdoor coil.","w")}if(S.frost<0.05)S.frostLogged=false;
  if(S.frost>0.8&&!S.frost2){S.frost2=true;log(sim,"Outdoor coil is iced over. Little air gets through.","b")}if(S.frost<0.5)S.frost2=false;
  const sensorClosed=S.coilT<=30;
  if(S.comp&&S.rv==="heat"&&!S.defrost&&sensorClosed)S.dfRun+=dt;
  if(!S.defrost&&!F.dfFail&&S.comp&&S.rv==="heat"&&sensorClosed&&S.dfRun>=V.dfi*60){S.defrost=true;S.dfT=0;S.dfRun=0;log(sim,`Defrost started after ${V.dfi} minutes of run time with the coil sensor closed. Valve to cooling, outdoor fan off, strips on.`,"w")}
  if(S.defrost){S.dfT+=dt;if(S.coilT>=60||S.dfT>=600){S.defrost=false;S.dfRun=0;log(sim,S.coilT>=60?`Defrost ended: coil sensor reached ${f0(S.coilT)}°F after ${f0(S.dfT/60*10)/10} min.`:"Defrost ended on the 10-minute limit.","w")}}
  // capacity
  let q=0,sens=0;
  if(S.comp){let qf=(1+0.005*(S.sc-10))*(1-0.012*Math.max(0,S.sh-20));if(S.sc<=0.5&&V.charge<84)qf*=0.85;
    if(S.rv==="heat"){q=CAP*S.mfrac*1.3*Math.max(0,qf);sens=-q}
    else{q=CAP*S.mfrac*Math.max(0,qf)*(1-0.005*(S.sct-115));const airMax=S.cfm>0?1.08*S.cfm*Math.max(0,S.Troom-S.sst)*0.85/0.75:1500;q=Math.min(q,airMax);sens=q*0.75}}
  const aux=S.auxOn?34100:0;
  S.cap=q;S.sens=sens-aux;
  S.Tsup=S.cfm>0?S.Troom-S.sens/(1.08*S.cfm):S.Troom;
  const env=700*(Tamb-S.Troom)+3500;
  S.Troom+=(env-(S.cfm>0?S.sens:S.sens*0.1))/3600/900*dt;
  // indoor coil ice in cooling
  const coil=S.comp&&S.rv==="cool"&&!S.defrost?S.sst+1:S.Troom;
  if(S.comp&&S.rv==="cool"&&!S.defrost&&coil<32)S.ice=Math.min(1,S.ice+dt*(32-coil)/(S.blowerOn?12000:20000));else if(S.ice>0)S.ice=Math.max(0,S.ice-dt*Math.max(0,S.Troom-32)/80000);
  // compressor heat, amps, protection (same as the split AC)
  const ratio=(S.Pd+ATM)/Math.max(1,S.Ps+ATM);
  if(S.comp){S.Tdis=S.sst+S.sh+115*Math.log(Math.max(1.05,ratio))/Math.log(3)+45*Math.max(0,0.6-S.mfrac);
    S.amps=RLA*(0.55+0.45*(S.Pd-S.Ps)/272)*(0.6+0.4*Math.min(1.2,S.mfrac/Math.max(0.05,clamp(S.runT/20,0.05,1))))}
  else{S.Tdis+=(Tamb-S.Tdis)*Math.min(1,dt/600);S.amps=S.hum?LRA:0}
  S.ipr=S.comp&&(S.Pd-S.Ps)>600;
  if(S.ipr&&!S.iprLogged){S.iprLogged=true;log(sim,"Pressure difference over 600 psi. Internal relief valve dumping hot discharge gas into the compressor shell.","b")}if(!S.ipr)S.iprLogged=false;
  if(S.hum)S.Tm+=6*dt;
  else if(S.comp)S.Tm+=((S.Tdis+50*(S.amps/RLA-1)+220*Math.max(0,0.45-S.mfrac)+(S.ipr?120:0))-S.Tm)*Math.min(1,dt/120);
  else S.Tm+=(Tamb-S.Tm)*Math.min(1,dt/900);
  if(!S.ol&&!F.olFail&&S.Tm>=250){S.ol=true;log(sim,S.hum?"Compressor overload tripped from locked-rotor current.":"Compressor motor overheated. Internal overload opened.","b")}
  if(S.Tm>=300){explode(sim,"burn");return}
  if(S.comp&&S.Tdis>225&&!S.hotLogged){S.hotLogged=true;log(sim,`Discharge line ${f0(S.Tdis)}°F, over 225°F. The oil is breaking down.`,"b")}if(S.Tdis<215)S.hotLogged=false;
  if(S.comp&&!S.hps&&!F.hpsFail&&S.Pd>=V.hps){S.hps=true;S.trips++;log(sim,`High pressure switch opened at ${f0(S.Pd)} psig.`,"b")}
  if(S.comp&&!F.lpsFail&&S.Ps<=V.lps){S.lpsT+=dt;if(!S.lps&&S.lpsT>=3){S.lps=true;S.trips++;log(sim,`Low pressure switch opened at ${f0(S.Ps)} psig.`,"b")}}else S.lpsT=0;
  if(S.trips>=3&&!S.lock){S.lock=true;log(sim,"Three pressure-switch trips. Control locked out until reset.","b")}
  if(S.comp&&S.shRaw<0.5){S.flood+=dt*Math.max(0,-S.shRaw)/20;if(!S.wetLogged){S.wetLogged=true;log(sim,"Zero superheat: liquid refrigerant is reaching the compressor.","b")}}else{S.flood=Math.max(0,S.flood-dt*0.5);if(S.shRaw>3)S.wetLogged=false}
  if(S.flood>1800){explode(sim,"slug");return}
};
HP.draw=function(dt){const S=this.S,F=this.F,V=this.V,p="h_";
  const run=S.comp,heat=S.rv==="heat",flow=run?clamp(S.mfrac,0.15,1.3):0;
  S.off-=dt*flow*40;
  // flow direction: in heating the vapor and liquid lines run backward
  const dir=heat?-1:1;
  const fs=$(p+"fSuc"),fl=$(p+"fLiq"),fd=$(p+"fDis"),fS=$(p+"fS");
  if(fs){fs.style.strokeDashoffset=S.off*dir;fl.style.strokeDashoffset=S.off*dir;fd.style.strokeDashoffset=S.off*dir;fS.style.strokeDashoffset=S.off;[fs,fl,fd,fS].forEach(e=>e.style.opacity=run?1:0)}
  // line colors by valve position
  const vap=run&&heat?"var(--r-dis)":"var(--r-suc)",cline=run&&!heat?"var(--r-dis)":"var(--r-suc)";
  at(p+"pSuc","stroke",vap);at(p+"pDis","stroke",cline);
  at(p+"pLiq","stroke",run&&S.sc<=0.5?"#c9a07a":"var(--r-liq)");
  at(p+"pMix","stroke",heat?"var(--r-liq)":"var(--r-mix)");
  at(p+"flash","opacity",run&&S.sc<=0.5?(blink(300)?1:.5):0);
  at(p+"wet","opacity",run&&S.shRaw<0.5?(blink(400)?1:.3):0);
  ["pSuc","pLiq","pDis","pD2","pMix","pS","evapRef"].forEach(id=>{const e=$(p+id);if(e)e.style.opacity=run?1:0.45});
  // coil gradients
  const shF=run?clamp(S.sh/40,0.04,0.75):0.1,scF=run?clamp(S.sc/40,0.02,0.6):0.1;
  const setG=(ids,cols,offs)=>ids.forEach((id,i)=>{at(id,"stop-color",cols[i]);if(offs[i]!=null)at(id,"offset",offs[i].toFixed(3))});
  if(heat){// indoor coil condenses (top hot gas, bottom liquid); outdoor coil evaporates (bottom mix in, top vapor out)
    setG([p+"e0",p+"eS1",p+"eS2",p+"e3"],["var(--r-liq)","var(--r-liq)","#e0662a","var(--r-dis)"],[0,scF,0.88,1]);
    setG([p+"c0",p+"cS1",p+"cS2",p+"c3"],["var(--r-suc)","var(--r-suc)","var(--r-mix)","var(--r-mix)"],[0,shF,shF+0.06,1]);
  }else{
    setG([p+"e0",p+"eS1",p+"eS2",p+"e3"],["var(--r-mix)","var(--r-mix)","var(--r-suc)","var(--r-suc)"],[0,1-shF-0.06,1-shF,1]);
    setG([p+"c0",p+"cS1",p+"cS2",p+"c3"],["var(--r-dis)","#e0662a","var(--r-liq)","var(--r-liq)"],[0,0.12,1-scF,1]);}
  at(p+"slide","x",heat?594:566);
  at(p+"rvLamp","fill",S.rv==="cool"&&run?"var(--warn)":"var(--lamp-off)");
  at(p+"frost","opacity",(S.frost*0.92).toFixed(2));at(p+"frostTxt","opacity",S.frost>0.4?1:0);
  at(p+"ice","opacity",clamp(S.ice*1.3,0,1).toFixed(2));at(p+"iceTxt","opacity",S.ice>0.5?1:0);
  at(p+"strip","stroke",S.auxOn?(blink(500)?"#ff6a1f":"#e0541f"):"var(--line)");
  txt(p+"dfTxt",S.defrost?`DEFROST ${f0(S.dfT)}s`:`${V.dfi}m · ${f0(S.dfRun/60)}m`);at(p+"dfLamp","fill",S.defrost?"var(--warn)":S.coilT<=30?"var(--ok)":"var(--lamp-off)");
  // air
  S.aoff-=dt*30;
  ["aSup","aRet","aOut","aIn"].forEach(id=>{const e=$(p+id);if(e)e.style.strokeDashoffset=S.aoff});
  at(p+"aSup","stroke",acol(S.Tsup));at(p+"aSupH","stroke",acol(S.Tsup));at(p+"aRet","stroke",acol(S.Troom));at(p+"aRetH","stroke",acol(S.Troom));
  at(p+"aSupG","opacity",S.blowerOn?Math.max(0.25,1-S.ice):0);at(p+"aRetG","opacity",S.blowerOn?Math.max(0.25,1-S.ice):0);
  const outT=run?(heat?V.out-clamp((V.out-S.sst)*0.5,0,20):V.out+clamp((S.sct-V.out)*0.5,0,40)):V.out;
  at(p+"aOut","stroke",acol(outT));at(p+"aOutH","stroke",acol(outT));at(p+"aIn","stroke",acol(V.out));
  const fanRun=S.fanOut;at(p+"aOutG","opacity",fanRun?Math.max(0.2,(F.dirtyCond?0.5:1)*(1-S.frost)):0);at(p+"aInG","opacity",fanRun?Math.max(0.2,(F.dirtyCond?0.4:1)*(1-S.frost)):0);
  if(S.blowerOn)S.ang=(S.ang+dt*900)%360;at(p+"blades","transform",`rotate(${S.ang} 240 386)`);
  if(fanRun)S.fang+=dt*14;at(p+"fb1","rx",(fanRun?Math.abs(Math.cos(S.fang))*40+4:40).toFixed(1));
  at(p+"dirt","opacity",F.filter?0.6:0);at(p+"cDirt","opacity",F.dirtyCond?0.55:0);at(p+"capBulge","opacity",F.cap?1:0);
  at(p+"txvG","opacity",1);at(p+"pistonG","opacity",0);
  at(p+"contLamp","fill",S.contactor&&S.svc?"var(--ok)":"var(--lamp-off)");at(p+"contBar","y",S.contactor?322:328);
  at(p+"hpsLamp","fill",S.hps?"var(--bad)":"var(--ok)");at(p+"lpsLamp","fill",S.lps?"var(--bad)":"var(--ok)");
  at(p+"tstatLamp","fill",S.calling?(S.mode==="heat"?"var(--warn)":"var(--cold)"):S.auxOn?"var(--warn)":"var(--lamp-off)");
  at(p+"discH","fill",S.svc?"var(--plate)":"var(--bad)");
  txt(p+"compSt",S.dead?"FAILED":S.hum?(blink(150)?"HUM":"hum"):run?"RUNNING":S.ol?"OVERLOAD":"OFF");txt(p+"amps",`${S.amps.toFixed(1)} A`);
  const nd=(id,cx,v,max)=>{const a=(-135+clamp(v,0,max)/max*270)*Math.PI/180;at(id,"x2",cx+30*Math.sin(a));at(id,"y2",74-30*Math.cos(a))};
  nd(p+"nLo",485,S.Ps,500);nd(p+"nHi",595,S.Pd,800);
  txt(p+"gLoP",`${f0(S.Ps)} psig`);txt(p+"gLoT",`${f0(S.sst)}°F sat`);txt(p+"gHiP",`${f0(S.Pd)} psig`);txt(p+"gHiT",S.sct>158?"above critical":`${f0(S.sct)}°F sat`);
  const slT=run?S.sst+S.sh:(S.Troom+V.out)/2,llT=run?S.sct-S.sc:V.out;
  txt(p+"slTxt",`Suction ${f0(slT)}°F`);txt(p+"llTxt",`Liquid line ${f0(llT)}°F`);
  at(p+"frost","opacity",(S.frost*0.92).toFixed(2));
  txt(p+"dTxt",`Discharge ${f0(S.Tdis)}°F`);at(p+"dTxt","fill",S.Tdis>225?"var(--bad)":"var(--ink)");
  txt(p+"target",heat?"Heating mode":S.defrost?"Defrosting":"Cooling mode");txt(p+"target2",heat?`Outdoor coil ${f0(S.coilT)}°F`:S.defrost?`Outdoor coil ${f0(S.coilT)}°F`:"Target SC 10°F");
  txt(p+"roomTxt",`${S.Troom.toFixed(1)}°F`);txt(p+"outTxt",`${V.out}°F`);txt(p+"tstatTxt",String(V.set));
  txt(p+"supTxt",S.blowerOn?`${f0(S.Tsup)}°F`:"blower off");txt(p+"retTxt",`${f0(S.Troom)}°F`);
  // state labels follow the valve
  at(p+"labels","opacity",S.labels===false?0:1);
  txt(p+"lVap",heat?"HOT GAS TO INDOOR COIL":"COOL VAPOR, LOW PRESSURE");at(p+"lVap","fill",heat?"var(--r-dis)":"var(--r-suc)");
  txt(p+"lMix",heat?"LIQUID LEAVING INDOOR COIL":"COLD LIQUID + FLASH GAS");at(p+"lMix","fill",heat?"var(--r-liq)":"var(--r-mix)");
  txt(p+"lLiq",heat?"WARM LIQUID → OUTDOOR PISTON":"WARM LIQUID, HIGH PRESSURE");
  at(p+"lDis","opacity",S.labels===false?0:1);
};
HP.boom=function(kind){const r=SPLIT.boom.call(this,kind);if(kind==="burn"&&this.F.blower)r.b=r.b.replace("<ul>",`<ul>${li(1,"Indoor blower failed in heating. The indoor coil is the condenser, so head pressure climbed.")}`);return r};
