/* ============ STEAM STATIONS TAB: PRV, trap and drip stations in 2D (elevation) and isometric ============ */
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const ST={sta:"prv",view:"2d",sel:null,trap:"ft"};
try{const v=JSON.parse(localStorage.getItem("bt-sta")||"null");if(v)Object.assign(ST,v,{sel:null})}catch(e){}
const saveST=()=>{try{localStorage.setItem("bt-sta",JSON.stringify({sta:ST.sta,view:ST.view,trap:ST.trap}))}catch(e){}};
const K="#2a2f33",SE="#4d555a";
/* ---------- the stations and their parts (same numbers in both views) ---------- */
const TRAPS={ft:{n:"Float and thermostatic (F&T)",w:"A float lifts a valve to drain condensate as fast as it arrives, and a thermostatic element vents air. Drains continuously.",y:"The usual trap on modulating loads: heating coils, heat exchangers with control valves, unit heaters. Handles air well at start-up.",f:"Water hammer or a burst float can leave it stuck shut (equipment floods) or open (steam blows through). It can freeze: protect outdoor ones."},
 ib:{n:"Inverted bucket",w:"An upside-down bucket floats on the steam trapped under it and holds the valve shut. Condensate lets the bucket sink and open the valve. It discharges in bursts.",y:"Rugged and tolerant of dirt and water hammer: the usual choice for drips on steam mains and for higher pressures.",f:"Loses its prime (the water seal) on superheat or sudden pressure drops, then blows steam. Vents air slowly, so it often gets a thermostatic air vent or a vent hole in the bucket."},
 td:{n:"Thermodynamic (disc)",w:"A flat disc is held shut by flash steam above it. When condensate arrives the pressure under it lifts the disc. Short, sharp discharges with a click.",y:"Small, cheap and tough. Common on main drips and tracer lines at medium and high pressure.",f:"Fails open with wear (rapid machine-gun cycling). Not for low pressure (below about 3.5 psig) or for high back pressure. An insulating cap stops rain from making it cycle."}};
const STA={
 prv:{name:"PRV station",flow:"High-pressure steam in on the left, reduced-pressure steam out on the right.",
  parts:[
   {n:"Inlet isolation valve",w:"A full-port gate or ball valve that shuts off the station's inlet.",y:"Lets you isolate the PRV and strainer for service while steam runs through the bypass.",f:"A gate valve left partly open wire-draws (steam erodes the seat). Open it fully or close it fully."},
   {n:"Strainer with blowdown valve",w:"A Y-strainer with a fine screen, installed with its screen leg on the side (horizontal) so condensate doesn't pool in it. A small valve on the cap blows the dirt out.",y:"Pipe scale and dirt are the main cause of PRV seat leaks and pilot failures.",f:"A plugged screen starves the PRV: outlet pressure sags on high demand."},
   {n:"Drip leg and trap ahead of the PRV",w:"A drip pocket (or separator) on the inlet with a trap that drains it to the return.",y:"Keeps slugs of condensate out of the valve. Wet steam wire-draws PRV seats and causes hammer.",f:"A failed-shut trap lets water reach the PRV; failed open wastes steam into the return."},
   {n:"Inlet pressure gauge (on a siphon)",w:"A gauge on a pigtail siphon. Water in the loop keeps live steam off the gauge's tube.",y:"Shows what the PRV has to work with. Compare it with the outlet gauge.",f:"No siphon: steam cooks the gauge and it reads wrong."},
   {n:"Pressure reducing valve (pilot operated)",w:"The main valve opens and closes under a diaphragm. A small pilot with an adjustable spring senses outlet pressure and meters steam to the diaphragm. Turning the pilot's adjusting screw clockwise raises outlet pressure.",y:"Holds a steady low pressure for heating coils, kitchens or a low-pressure main, from a high-pressure supply. Large reductions (more than about 10 to 1) are usually done in two stages.",f:"Seat leak: outlet pressure creeps up when there's no load, until the relief valve lifts. Plugged pilot or torn diaphragm: valve stays shut."},
   {n:"Sensing (control) line",w:"A small line from the pilot to the outlet pipe, tapped into the side or top of a straight run well downstream (often about 10 pipe diameters, per the manufacturer).",y:"The pilot needs to read settled outlet pressure, away from the turbulence right at the valve outlet.",f:"Tapped too close to the valve, or into a fitting: the PRV hunts. A plugged line makes the pilot see no pressure and the valve runs wide open."},
   {n:"Expander (eccentric, flat on the bottom)",w:"The outlet pipe is a size or more larger than the inlet. An eccentric reducer keeps the bottom of the pipe flat.",y:"Steam takes up more room at lower pressure, so the outlet needs a bigger pipe to keep velocity down. A flat bottom lets condensate drain instead of pooling.",f:"Undersized outlet pipe: noise, erosion and a pressure drop the PRV can't make up."},
   {n:"Outlet isolation valve",w:"Gate or ball valve on the outlet.",y:"With the inlet valve, isolates the PRV for service.",f:"Must be fully open in service."},
   {n:"Outlet pressure gauge (on a siphon)",w:"Shows reduced pressure.",y:"This is what you set the pilot to. Watch it at no load and at full load.",f:"Pressure rising at no load means the PRV seat leaks."},
   {n:"Safety relief valve",w:"An ASME-stamped spring-loaded valve on the low-pressure side, set at or below the lowest working pressure rating of the equipment downstream. Its discharge is piped full size to a safe place, with a drip pan elbow or drain so water can't collect on the seat.",y:"If the PRV fails wide open, the full inlet pressure would reach equipment built for low pressure. The relief valve must be sized to pass the PRV's full capacity (and the bypass's).",f:"Never plug or cap it. One that weeps steadily may have a dirty seat or be set too close to the operating pressure."},
   {n:"Bypass with a globe valve",w:"A pipe around the PRV with a globe valve. Globe valves throttle; gate valves don't.",y:"Lets someone hand-throttle steam to the building while the PRV is serviced, watching the outlet gauge the whole time.",f:"A bypass left cracked open overpressures the low side. Size the relief valve for it too."}]},
 trap:{name:"Trap station",flow:"Condensate from the equipment (a coil or heat exchanger) drains in on the left by gravity and leaves to the condensate return on the right.",
  parts:[
   {n:"Inlet isolation valve",w:"Shuts off the trap from the equipment.",y:"Lets you service the trap without shutting down the steam supply to the equipment's neighbors.",f:"Close inlet and outlet, and let it cool, before opening a trap."},
   {n:"Strainer with blowdown",w:"Y-strainer ahead of the trap (many traps have one built in).",y:"Dirt holds trap valves open (blowing steam) or plugs them (flooding).",f:"Blow it down on a schedule."},
   {n:"Unions (or flanges)",w:"A union on each side of the trap.",y:"Lets you swap the trap without cutting pipe.",f:"Leaking union: tighten or replace the seat."},
   {n:"Steam trap",w:"Holds steam in the equipment and lets condensate and air out. Pick the type below the drawing.",y:"Steam only gives up its heat when it condenses. A trap keeps the steam in until it has.",f:"Failed open: steam blows into the return (hot return lines, vents spitting steam, water hammer). Failed shut: the equipment fills with condensate and heats poorly, and a coil can freeze."},
   {n:"Test valve",w:"A small valve just downstream of the trap that opens to the air.",y:"Close the outlet valve and open the test valve to watch what the trap discharges: condensate with a little flash is normal, a steady blue-white jet of live steam is a failed-open trap.",f:"Learn what flash steam looks like (lazy, white) versus live steam (clear right at the outlet, then white)."},
   {n:"Check valve",w:"A swing or spring check valve after the trap.",y:"Stops condensate from flowing back into the trap and equipment when the return is pressurized or the trap lifts condensate to an overhead return.",f:"Stuck open: backflow floods the equipment when steam shuts off."},
   {n:"Outlet isolation valve",w:"Shuts off the trap from the return.",y:"Needed with the inlet valve to isolate the trap.",f:"Leave fully open in service."}]},
 drip:{name:"Drip station",flow:"Steam flows left to right in the main. Condensate collects in the drip leg and the trap drains it to the return below.",
  parts:[
   {n:"Steam main, pitched with the flow",w:"Horizontal steam mains slope down in the direction of steam flow, commonly at least 1 in per 40 ft (about 1/4 in per 10 ft).",y:"Condensate runs with the steam to the next drip point instead of pooling.",f:"A sag or a main pitched the wrong way traps water: slugs of it hit fittings at steam speed (water hammer)."},
   {n:"Drip leg (collecting leg)",w:"A pocket the same size as the main for mains up to 4 in; for larger mains, half the main size but not less than 4 in. Taken off the bottom of the main with a full-size tee.",y:"Condensate rides along the bottom of the main at steam speed. A small tap would let it run past; a full-size pocket catches it.",f:"Too small or too short: water runs past the drip and hammers at the next elbow."},
   {n:"Dirt pocket with blowdown valve",w:"The leg continues below the trap connection and ends in a cap or blowdown valve.",y:"Scale and dirt settle here instead of going into the trap.",f:"Blow it down; a full dirt pocket ends up feeding dirt to the trap."},
   {n:"Inlet isolation valve",w:"Shuts off the trap from the drip leg.",y:"Service without draining the main.",f:"Leave fully open."},
   {n:"Strainer",w:"Y-strainer ahead of the trap, if the trap doesn't have one.",y:"Keeps scale out of the trap's valve.",f:"Plugged: the drip floods and water runs down the main."},
   {n:"Drip trap",w:"Usually an inverted bucket or a thermodynamic trap on main drips. Shown here per the trap type picked.",y:"These handle dirt, water hammer and higher pressures well.",f:"Failed shut: the leg fills and water rides on into the main. Failed open: live steam into the return."},
   {n:"Test valve",w:"Downstream of the trap, opens to air.",y:"Check the trap's discharge.",f:"See the trap station."},
   {n:"Check valve",w:"After the trap.",y:"Keeps return condensate from backing into the drip when steam is off.",f:"Stuck open: the leg floods from the return."},
   {n:"Outlet isolation valve",w:"Shuts off the trap from the return.",y:"Isolation for service.",f:"Leave fully open."},
   {n:"Condensate return",w:"The return line carries condensate back to the receiver or boiler, pitched toward it.",y:"Condensate is hot, treated water: returning it saves fuel and water treatment.",f:"Hot or banging returns usually mean failed-open traps upstream."}]}};
const SPACING="Where drips go: at every low point and the bottom of each riser, at the end of each main, ahead of PRVs and control valves, and every 300 to 500 ft along long horizontal mains. Leg length: at least 28 in from the main to the trap connection when the system warms up automatically (that gives about 1 psi of water head to push condensate through the trap at start-up); at least 1.5 times the main diameter, but not less than 8 in, on a supervised warm-up.";
/* ---------- 2D helpers ---------- */
const hp=(x1,x2,y,r=7)=>`<rect x="${x1}" y="${y-r}" width="${x2-x1}" height="${2*r}" fill="url(#zSteelH)" stroke="${SE}" stroke-width="1"/>`;
const vp=(x,y1,y2,r=7)=>`<rect x="${x-r}" y="${y1}" width="${2*r}" height="${y2-y1}" fill="url(#zSteel)" stroke="${SE}" stroke-width="1"/>`;
const cu=(d)=>`<path d="${d}" fill="none" stroke="#a5582c" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e6a06a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
const wheel=(x,y,rx=13)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx*0.32}" fill="#b8322a" stroke="#5a1410" stroke-width="1"/><ellipse cx="${x}" cy="${y-1}" rx="${rx*0.6}" ry="${rx*0.18}" fill="none" stroke="#e46a5e" stroke-width=".8"/>`;
const gate=(x,y,r=7)=>`<rect x="${x-13}" y="${y-r-5}" width="26" height="${2*r+10}" rx="3" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1"/><rect x="${x-17}" y="${y-r-3}" width="5" height="${2*r+6}" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".7"/><rect x="${x+12}" y="${y-r-3}" width="5" height="${2*r+6}" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".7"/><path d="M${x-8} ${y-r-5} L${x-6} ${y-r-20} H${x+6} L${x+8} ${y-r-5}Z" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".8"/><path d="M${x} ${y-r-20} V${y-r-30}" stroke="#555" stroke-width="2.4"/>`+wheel(x,y-r-31);
const globe=(x,y,r=7)=>`<ellipse cx="${x}" cy="${y}" rx="17" ry="${r+8}" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1"/><rect x="${x-21}" y="${y-r-2}" width="5" height="${2*r+4}" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".7"/><rect x="${x+16}" y="${y-r-2}" width="5" height="${2*r+4}" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".7"/><path d="M${x-7} ${y-r-6} L${x-5} ${y-r-18} H${x+5} L${x+7} ${y-r-6}Z" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".8"/><path d="M${x} ${y-r-18} V${y-r-27}" stroke="#555" stroke-width="2.4"/>`+wheel(x,y-r-28,11);
const strainer=(x,y,r=7)=>`<path d="M${x-14} ${y-r-3} H${x+14} V${y+r+3} H${x-14}Z" fill="url(#zShell)" stroke="${K}" stroke-width="1"/><path d="M${x-6} ${y+r} L${x+16} ${y+r+26} L${x+26} ${y+r+16} L${x+6} ${y-2}Z" fill="url(#zShell)" stroke="${K}" stroke-width="1"/><rect x="${x+15}" y="${y+r+16}" width="14" height="12" transform="rotate(45 ${x+22} ${y+r+22})" fill="#3b4045" stroke="${K}"/><path d="M${x+28} ${y+r+29} l8 8" stroke="${SE}" stroke-width="4"/><rect x="${x+33}" y="${y+r+33}" width="9" height="7" rx="1.5" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".7" transform="rotate(45 ${x+37} ${y+r+36})"/>`;
const gauge=(x,y,r=7,up=1)=>{const t=y-r;return `<path d="M${x} ${t} V${t-8} a6 6 0 1 1 0.1 0 V${t-30}" fill="none" stroke="#7d868c" stroke-width="3"/><circle cx="${x}" cy="${t-44}" r="14" fill="#f4f4ee" stroke="${K}" stroke-width="2"/><path d="M${x-9} ${t-38} A11 11 0 1 1 ${x+9} ${t-38}" fill="none" stroke="#999" stroke-width="1"/><path d="M${x} ${t-44} L${x+7} ${t-51}" stroke="#c22" stroke-width="1.6"/><circle cx="${x}" cy="${t-44}" r="1.6" fill="${K}"/>`};
const union=(x,y,r=7)=>`<rect x="${x-6}" y="${y-r-4}" width="12" height="${2*r+8}" rx="1.5" fill="url(#zSteelH)" stroke="${K}" stroke-width="1"/><path d="M${x} ${y-r-4} V${y+r+4}" stroke="${K}" stroke-width=".8"/>`;
const check=(x,y,r=7)=>`<rect x="${x-18}" y="${y-r-4}" width="36" height="${2*r+8}" rx="4" fill="url(#zBrass)" stroke="#6a4a12" stroke-width="1"/><path d="M${x-10} ${y-r-4} V${y-r-12} H${x+10} V${y-r-4}" fill="url(#zBrassH)" stroke="#6a4a12" stroke-width=".8"/><path d="M${x-8} ${y} H${x+6} m-5 -4 l5 4 l-5 4" fill="none" stroke="#5a3d0c" stroke-width="1.6"/>`;
const testv=(x,y,r=7)=>`<rect x="${x-3}" y="${y+r}" width="6" height="12" fill="url(#zSteel)" stroke="${SE}" stroke-width=".7"/><rect x="${x-7}" y="${y+r+10}" width="14" height="10" rx="2" fill="url(#zBrass)" stroke="#6a4a12" stroke-width=".8"/><path d="M${x+7} ${y+r+15} h8" stroke="#b8322a" stroke-width="3"/><path d="M${x} ${y+r+20} v5" stroke="${SE}" stroke-width="2"/>`;
const trapBody=(t,x,y,r=7)=>t==="ft"?`<rect x="${x-26}" y="${y-22}" width="52" height="42" rx="7" fill="url(#zShell)" stroke="${K}" stroke-width="1.2"/><rect x="${x-20}" y="${y-28}" width="40" height="8" rx="2" fill="#3b4045" stroke="${K}"/>${[-14,0,14].map(d=>`<circle cx="${x+d}" cy="${y-24}" r="1.6" fill="#999"/>`).join("")}<text x="${x}" y="${y+5}" class="stTxt" style="fill:#e8e8e8;font-size:9px">F&amp;T</text>`
 :t==="ib"?`<rect x="${x-17}" y="${y-18}" width="34" height="56" rx="8" fill="url(#zShell)" stroke="${K}" stroke-width="1.2"/><rect x="${x-20}" y="${y-22}" width="40" height="8" rx="2" fill="#3b4045" stroke="${K}"/><text x="${x}" y="${y+14}" class="stTxt" style="fill:#e8e8e8;font-size:9px">IB</text>`
 :`<rect x="${x-14}" y="${y-r-5}" width="28" height="${2*r+10}" rx="3" fill="url(#zSteelH)" stroke="${K}" stroke-width="1.1"/><rect x="${x-10}" y="${y-r-15}" width="20" height="11" rx="3" fill="url(#zAlu)" stroke="${K}" stroke-width="1"/><text x="${x}" y="${y+r+16}" class="stTxt" style="font-size:9px">TD</text>`;
const prv=(x,y,r=8)=>`<path d="M${x-24} ${y-r-6} H${x+24} V${y+r+6} H${x-24}Z" fill="url(#zShell)" stroke="${K}" stroke-width="1.2"/><rect x="${x-29}" y="${y-r-3}" width="6" height="${2*r+6}" fill="#3b4045"/><rect x="${x+23}" y="${y-r-3}" width="6" height="${2*r+6}" fill="#3b4045"/>`+
 `<path d="M${x-6} ${y+r+6} V${y+r+14}" stroke="${K}" stroke-width="5"/><path d="M${x-34} ${y+r+30} Q${x-34} ${y+r+14} ${x-6} ${y+r+14} Q${x+22} ${y+r+14} ${x+22} ${y+r+30}Z" fill="url(#zShell)" stroke="${K}" stroke-width="1.2"/><path d="M${x-36} ${y+r+30} H${x+24}" stroke="#222" stroke-width="3"/><text x="${x-6}" y="${y+r+46}" class="stTxt">DIAPHRAGM</text>`+
 `<rect x="${x-10}" y="${y-r-26}" width="22" height="20" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="${x-6}" y="${y-r-50}" width="14" height="24" rx="3" fill="url(#zAlu)" stroke="${K}" stroke-width=".8"/>${[0,1,2,3].map(i=>`<path d="M${x-4} ${y-r-46+i*5} h10" stroke="#777" stroke-width="1"/>`).join("")}<path d="M${x+1} ${y-r-50} v-8" stroke="#555" stroke-width="2.4"/><rect x="${x-3}" y="${y-r-61}" width="8" height="4" fill="#555"/><text x="${x+18}" y="${y-r-40}" class="stTxt" style="text-anchor:start">PILOT</text>`;
const relief=(x,y,r=8)=>`<rect x="${x-9}" y="${y-r-12}" width="18" height="12" fill="url(#zBrass)" stroke="#6a4a12"/><path d="M${x-13} ${y-r-12} H${x+13} V${y-r-40} H${x-13}Z" fill="url(#zBrass)" stroke="#6a4a12"/><rect x="${x+13}" y="${y-r-36}" width="14" height="14" fill="url(#zBrassH)" stroke="#6a4a12"/><path d="M${x-8} ${y-r-40} L${x-6} ${y-r-74} H${x+6} L${x+8} ${y-r-40}Z" fill="url(#zBrass)" stroke="#6a4a12"/>${[0,1,2,3,4].map(i=>`<path d="M${x-5} ${y-r-46-i*5} l10 2.5" stroke="#6a4a12" stroke-width="1"/>`).join("")}<path d="M${x+2} ${y-r-72} l18 -6" stroke="#555" stroke-width="2.4"/>`;
const arrow=(x,y,dir=1,t="")=>`<path d="M${x} ${y} h${30*dir} m${-8*dir} -6 l${8*dir} 6 l${-8*dir} 6" fill="none" stroke="var(--ink)" stroke-width="2"/>`+(t?`<text x="${x+15*dir}" y="${y-10}" class="stTxt">${esc(t)}</text>`:"");
const co=(n,x,y,tx,ty)=>`<g class="sco${ST.sel===n?" on":""}" data-sn="${n}" tabindex="0" role="button" aria-label="Part ${n}">${tx!=null?`<path d="M${x} ${y} L${tx} ${ty}" stroke="var(--brass)" stroke-width="1.4"/>`:""}<circle cx="${x}" cy="${y}" r="11"/><text x="${x}" y="${y+4}">${n}</text></g>`;
/* ---------- 2D drawings ---------- */
function prv2d(){const y=250;let s="";
 s+=hp(20,400,y,8)+`<path d="M400 ${y-8} L440 ${y-14} V${y+8} H400Z" fill="url(#zSteelH)" stroke="${SE}"/>`+hp(440,770,y,14).replace(`y="${y-14}"`,`y="${y-14}"`);
 // bypass
 s+=vp(70,120,y-8,6)+hp(64,726,120,6)+vp(720,120,y-14,6)+globe(370,120,6);
 s+=gate(120,y,8)+strainer(175,y,8);
 // drip leg + trap ahead of the PRV
 s+=vp(232,y+8,y+126,8)+`<rect x="222" y="${y+126}" width="20" height="6" rx="2" fill="#3b4045"/>`+hp(240,286,y+100,4)+trapBody("td",262,y+100,4)+hp(276,318,y+100,4)+`<text x="322" y="${y+104}" class="stTxt" style="text-anchor:start">TO RETURN</text>`;
 s+=gauge(280,y,8)+prv(340,y,8);
 s+=gate(500,y,14)+gauge(552,y,14);
 // sensing line from the pilot to the outlet, tapped well downstream
 s+=cu(`M347 ${y-50} H360 V${y-62} H600 V${y-14}`)+`<circle cx="600" cy="${y-14}" r="3" fill="#a5582c"/>`;
 s+=relief(640,y,14)+`<path d="M660 ${y-50} V${y-130}" stroke="#7d868c" stroke-width="7"/><text x="668" y="${y-128}" class="stTxt" style="text-anchor:start">TO A SAFE PLACE</text>`;
 s+=arrow(24,y-30,1,"HIGH PRESSURE IN")+arrow(736,y-30,1,"")+`<text x="742" y="${y+40}" class="stTxt">LOW PRESSURE OUT</text>`;
 s+=co(1,120,y+52,120,y+12)+co(2,175,y+70,192,y+40)+co(3,204,y+152,226,y+128)+co(4,262,y-84,276,y-52)+co(5,340,y+82,334,y+56)+co(6,600,y-94,600,y-64)+co(7,420,y+40,420,y+12)+co(8,500,y+52,500,y+20)+co(9,532,y-84,548,y-60)+co(10,612,y-96,630,y-80)+co(11,370,78,370,90);
 return s}
function trap2d(){const y=230,t=ST.trap;let s="";
 s+=`<rect x="20" y="40" width="120" height="70" rx="6" fill="url(#zShell)" stroke="${K}"/><text x="80" y="70" class="stTxt" style="fill:#e8e8e8">COIL OR</text><text x="80" y="84" class="stTxt" style="fill:#e8e8e8">HEAT EXCHANGER</text>`;
 s+=vp(80,110,y-7,7)+hp(73,700,y,7)+`<text x="96" y="160" class="stTxt" style="text-anchor:start">DRAINS BY GRAVITY</text><text x="96" y="172" class="stTxt" style="text-anchor:start">DOWN TO THE TRAP</text>`;
 s+=gate(150,y)+strainer(210,y)+union(262,y)+trapBody(t,320,y)+union(378,y)+testv(415,y)+check(470,y)+gate(540,y);
 s+=arrow(600,y-30,1,"TO CONDENSATE RETURN");
 s+=co(1,150,y+50,150,y+14)+co(2,210,y+80,222,y+50)+co(3,262,y-54,262,y-14)+co(3,378,y-54,378,y-14)+co(4,320,y+80,320,y+40)+co(5,415,y+70,415,y+44)+co(6,470,y+50,470,y+14)+co(7,540,y+50,540,y+14);
 return s}
function drip2d(){const t=ST.trap==="ft"?"ib":ST.trap;let s="";
 // main pitched down in the direction of flow
 s+=`<path d="M20 82 L770 96 L770 120 L20 106Z" fill="url(#zSteelH)" stroke="${SE}"/>`;
 s+=arrow(40,66,1,"STEAM FLOW")+`<text x="560" y="80" class="stTxt">PITCH DOWN 1 IN PER 40 FT (MIN)</text>`;
 const lx=300;s+=`<rect x="${lx-12}" y="108" width="24" height="262" fill="url(#zSteel)" stroke="${SE}"/><rect x="${lx-15}" y="370" width="30" height="10" rx="2" fill="#3b4045"/>`+`<path d="M${lx} 380 v10" stroke="${SE}" stroke-width="4"/><rect x="${lx-7}" y="390" width="14" height="10" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/><path d="M${lx+7} 395 h9" stroke="#b8322a" stroke-width="3"/>`;
 const y=300;s+=hp(lx+12,700,y,5)+gate(350,y,5)+strainer(405,y,5)+trapBody(t,470,y,5)+testv(515,y,5)+check(560,y,5)+gate(615,y,5)+vp(690,y,404,5)+hp(640,780,410,7);
 s+=`<path d="M640 410 H780" stroke="none"/><text x="720" y="436" class="stTxt">CONDENSATE RETURN</text>`;
 // dimensions
 s+=`<path d="M${lx-36} 120 V${y}" stroke="var(--muted)" stroke-width="1" marker-start="url(#stDim)" marker-end="url(#stDim)"/><text x="${lx-42}" y="${(120+y)/2}" class="stTxt" style="text-anchor:end">28 IN MIN</text><text x="${lx-42}" y="${(120+y)/2+12}" class="stTxt" style="text-anchor:end">(AUTOMATIC</text><text x="${lx-42}" y="${(120+y)/2+24}" class="stTxt" style="text-anchor:end">WARM-UP)</text>`;
 s+=`<text x="${lx+18}" y="150" class="stTxt" style="text-anchor:start">LEG = MAIN SIZE TO 4 IN</text><text x="${lx+18}" y="162" class="stTxt" style="text-anchor:start">(HALF THE MAIN ABOVE 4 IN,</text><text x="${lx+18}" y="174" class="stTxt" style="text-anchor:start">NOT LESS THAN 4 IN)</text>`;
 s+=co(1,160,130,160,104)+co(2,lx-30,220,lx-12,220)+co(3,lx-34,372,lx-14,374)+co(4,350,y+44,350,y+10)+co(5,405,y+70,418,y+44)+co(6,470,y+66,470,y+40)+co(7,515,y+64,515,y+40)+co(8,560,y+44,560,y+12)+co(9,615,y-56,615,y-36)+co(10,740,388,740,402);
 return s}
/* ---------- isometric helpers (30° axes; single-line piping with standard symbols) ---------- */
let O=[0,0],SC=1;
const P=(x,y,z)=>{if(BB)Pm(x,y,z);return [O[0]+(x-y)*0.866*SC,O[1]+(x+y)*0.5*SC-z*SC]};
const pt=p=>p[0].toFixed(1)+" "+p[1].toFixed(1);
const L=(a,b,cls="isoP")=>`<path class="${cls}" d="M${pt(P(...a))} L${pt(P(...b))}"/>`;
const PL=(pts,cls="isoP")=>`<path class="${cls}" d="M${pts.map(q=>pt(P(...q))).join(" L")}"/>`;
const dirOf=(a,b)=>{const p=P(...a),q=P(...b);const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1;return [dx/l,dy/l]};
// valve bowtie at point c on a run with screen direction d; n = perpendicular (screen vertical for horizontal runs)
const bow=(c,d,kind="gate",sz=9)=>{const p=P(...c);const n=Math.abs(d[1])>0.9?[1,0]:[0,-1];const A=(k,m)=>[p[0]+d[0]*k*sz+n[0]*m*sz*0.75,p[1]+d[1]*k*sz+n[1]*m*sz*0.75];
 const t1=[A(-1,1),A(-1,-1),A(0,0)],t2=[A(1,1),A(1,-1),A(0,0)];const poly=(t,f)=>`<path d="M${t.map(q=>q[0].toFixed(1)+" "+q[1].toFixed(1)).join(" L")}Z" fill="${f}" stroke="var(--ink)" stroke-width="1.6"/>`;
 let g=`<circle cx="${p[0]}" cy="${p[1]}" r="${sz*1.2}" fill="var(--paper)" stroke="none"/>`+poly(t1,"var(--paper)")+poly(t2,kind==="check"?"var(--ink)":"var(--paper)");
 if(kind==="globe")g+=`<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="var(--ink)"/>`;
 if(kind==="gate"||kind==="globe")g+=`<path d="M${p[0]} ${p[1]} L${p[0]+n[0]*sz*1.6} ${p[1]+n[1]*sz*1.6} M${p[0]+n[0]*sz*1.6-d[0]*6} ${p[1]+n[1]*sz*1.6-d[1]*6} L${p[0]+n[0]*sz*1.6+d[0]*6} ${p[1]+n[1]*sz*1.6+d[1]*6}" stroke="var(--ink)" stroke-width="1.6"/>`;
 if(kind==="ctl"){const q=[p[0]+n[0]*sz*1.9,p[1]+n[1]*sz*1.9];g+=`<path d="M${pt(p)} L${pt(q)}" stroke="var(--ink)" stroke-width="1.6"/><path d="M${q[0]-9} ${q[1]} A9 9 0 0 1 ${q[0]+9} ${q[1]}Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>`}
 return g};
const isoTrap=c=>{const p=P(...c);return `<circle cx="${p[0]}" cy="${p[1]}" r="10" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.8"/><text x="${p[0]}" y="${p[1]+4}" class="isoT">T</text>`};
const isoGauge=c=>{const p=P(...c);return `<path d="M${pt(p)} v-16" stroke="var(--ink)" stroke-width="1.4"/><circle cx="${p[0]}" cy="${p[1]-24}" r="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><text x="${p[0]}" y="${p[1]-21}" class="isoT" style="font-size:7px">PG</text>`};
const isoStr=(c,d)=>{const p=P(...c);const b=[p[0]+d[0]*10-d[1]*0+8,p[1]+d[1]*10+16];return `<path d="M${pt(p)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="var(--ink)" stroke-width="1.8"/><path d="M${b[0]-6} ${b[1]+2} L${b[0]+6} ${b[1]-2}" stroke="var(--ink)" stroke-width="2.4"/><circle cx="${pt(p).split(" ")[0]}" cy="${p[1]}" r="3" fill="var(--ink)"/>`};
const isoUnion=(c,d)=>{const p=P(...c);const n=[0,-1];return `<path d="M${p[0]-d[0]*3+n[0]*7} ${p[1]-d[1]*3+n[1]*7} l${-n[0]*14} ${-n[1]*14} M${p[0]+d[0]*3+n[0]*7} ${p[1]+d[1]*3+n[1]*7} l${-n[0]*14} ${-n[1]*14}" stroke="var(--ink)" stroke-width="1.6"/>`};
const isoRed=(c,d)=>{const p=P(...c);return `<path d="M${p[0]-d[0]*8} ${p[1]-d[1]*8-4} L${p[0]+d[0]*8} ${p[1]+d[1]*8-8} L${p[0]+d[0]*8} ${p[1]+d[1]*8+4} L${p[0]-d[0]*8} ${p[1]-d[1]*8+4}Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/><text x="${p[0]}" y="${p[1]+18}" class="isoT" style="font-size:7px">ECC</text>`};
const isoRelief=c=>{const p=P(...c);return `<path d="M${p[0]} ${p[1]} v-8 l-7 -12 h14 l-7 12 M${p[0]} ${p[1]-14} l14 7 v-14 z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/><path d="M${p[0]} ${p[1]-20} l-5 -3 l10 -4 l-10 -4 l10 -4 l-5 -3" fill="none" stroke="var(--ink)" stroke-width="1.4"/><path d="M${p[0]+14} ${p[1]-14} l8 -4 v-26" stroke="var(--ink)" stroke-width="1.8" fill="none"/>`};
const flowA=(a,b)=>{const p=P(...a),q=P(...b);const m=[(p[0]+q[0])/2,(p[1]+q[1])/2];const d=dirOf(a,b);return `<path d="M${m[0]-d[0]*6-d[1]*5} ${m[1]-d[1]*6+d[0]*5} L${m[0]+d[0]*6} ${m[1]+d[1]*6} L${m[0]-d[0]*6+d[1]*5} ${m[1]-d[1]*6-d[0]*5}Z" fill="var(--ink)"/>`};
const coI=(n,c,dx=-26,dy=-26)=>{const p=P(...c);return co(n,p[0]+dx,p[1]+dy,p[0],p[1])};
const tI=(c,t,dx=0,dy=0,a="middle")=>{const p=P(...c);return `<text x="${p[0]+dx}" y="${p[1]+dy}" class="stTxt" style="text-anchor:${a}">${esc(t)}</text>`};
const legend=(items,x=560,y=300)=>`<g transform="translate(${x} ${y})"><rect x="0" y="0" width="226" height="${items.length*22+26}" rx="6" fill="var(--paper)" stroke="var(--line)"/><text x="10" y="17" class="stTxt" style="text-anchor:start;font-weight:700">ISOMETRIC SYMBOLS</text>${items.map((it,i)=>`<g transform="translate(22 ${36+i*22})">${it[0]}</g><text x="44" y="${40+i*22}" class="stTxt" style="text-anchor:start">${esc(it[1])}</text>`).join("")}</g>`;
const LG={gate:[`<path d="M-9 -6 L-9 6 L0 0Z M9 -6 L9 6 L0 0Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>`,"Gate valve"],
 globe:[`<path d="M-9 -6 L-9 6 L0 0Z M9 -6 L9 6 L0 0Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><circle r="2.6" fill="var(--ink)"/>`,"Globe valve (throttling)"],
 check:[`<path d="M-9 -6 L-9 6 L0 0Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><path d="M9 -6 L9 6 L0 0Z" fill="var(--ink)"/>`,"Check valve (flow toward the filled side)"],
 ctl:[`<path d="M-9 -6 L-9 6 L0 0Z M9 -6 L9 6 L0 0Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><path d="M0 0 V-9 M-6 -9 A6 6 0 0 1 6 -9Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>`,"Pressure reducing valve"],
 trap:[`<circle r="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><text y="3" class="isoT" style="font-size:9px">T</text>`,"Steam trap"],
 str:[`<path d="M-10 0 H10 M0 0 L6 10 M2 12 L10 8" stroke="var(--ink)" stroke-width="1.6"/>`,"Y-strainer"],
 pg:[`<circle r="7" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><text y="3" class="isoT" style="font-size:6px">PG</text>`,"Pressure gauge"],
 rv:[`<path d="M0 8 V2 L-6 -6 H6 L0 2 M0 -2 L10 3 V-7Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.3"/>`,"Safety relief valve"],
 un:[`<path d="M-3 -7 V7 M3 -7 V7 M-12 0 H12" stroke="var(--ink)" stroke-width="1.4"/>`,"Union"],
 ecc:[`<path d="M-9 -4 L9 -8 L9 4 L-9 4Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>`,"Eccentric reducer"],
 flow:[`<path d="M-10 0 H6 M2 -4 L8 0 L2 4Z" stroke="var(--ink)" stroke-width="1.6" fill="var(--ink)"/>`,"Flow direction"]};
// fit an isometric drawing into the box: first pass measures, second pass draws
let BB=null;
const Pm=(x,y,z)=>{const q=[(x-y)*0.866,(x+y)*0.5-z];if(BB){BB[0]=Math.min(BB[0],q[0]);BB[1]=Math.min(BB[1],q[1]);BB[2]=Math.max(BB[2],q[0]);BB[3]=Math.max(BB[3],q[1])}return q};
function isoFit(fn,box=[100,40,540,410]){BB=[1e9,1e9,-1e9,-1e9];O=[0,0];SC=1;fn();const b=BB;BB=null;
 SC=Math.min(1.25,(box[2]-box[0])/(b[2]-b[0]||1),(box[3]-box[1])/(b[3]-b[1]||1));O=[box[0]+((box[2]-box[0])-(b[2]-b[0])*SC)/2-b[0]*SC,box[1]+((box[3]-box[1])-(b[3]-b[1])*SC)/2-b[1]*SC];return fn()}
// callout beside a point on an x-axis run: side 1 = up-right of the line, -1 = down-left
const coX=(n,c,side=1,dist=40,slide=0)=>{const p=P(...c);const ux=0.5*side,uy=-0.866*side;return co(n,p[0]+ux*dist+0.866*slide,p[1]+uy*dist+0.5*slide,p[0],p[1])};
function prvIso(){let s="";const d=dirOf([0,0,0],[100,0,0]);
 // main, bypass above it (+z), drip leg below (-z), relief valve up, sensing line beside (-y)
 s+=L([-40,0,0],[540,0,0])+L([0,0,0],[0,0,100])+L([0,0,100],[480,0,100])+L([480,0,100],[480,0,0]);
 s+=L([130,0,0],[130,0,-80])+L([126,0,-84],[134,0,-84],"isoP thin")+L([130,0,-60],[130,70,-60]);
 s+=L([390,0,0],[390,-50,0],"isoP thin")+`<path class="isoP dash" d="M${pt(P(390,-50,0))} L${pt(P(215,-50,0))} L${pt(P(215,-50,24))} L${pt(P(215,0,24))}"/>`;
 s+=L([435,0,0],[435,0,50])+L([435,0,50],[435,0,80],"isoP thin");
 s+=flowA([-40,0,0],[-5,0,0])+flowA([500,0,0],[540,0,0])+flowA([200,0,100],[300,0,100])+flowA([130,30,-60],[130,70,-60]);
 s+=bow([40,0,0],d,"gate")+isoStr([90,0,0],d)+isoTrap([130,40,-60])+isoGauge([168,0,0])+bow([215,0,0],d,"ctl",10)+isoRed([262,0,0],d)+bow([305,0,0],d,"gate")+isoGauge([345,0,0])+isoRelief([435,0,50])+bow([240,0,100],d,"globe");
 s+=tI([-40,0,0],"HP STEAM IN",-6,-14,"end")+tI([540,0,0],"LP STEAM OUT",8,18,"start")+tI([130,70,-60],"TO RETURN",10,16,"start")+tI([435,0,80],"TO A SAFE PLACE",10,-14,"start")+tI([300,-50,0],"SENSING LINE",-6,-10,"end");
 s+=coX(1,[40,0,0],-1)+coX(2,[90,0,0],-1,48)+coX(3,[130,40,-60],-1,30,-34)+coX(4,[168,0,0],1,56)+coX(5,[215,0,0],-1,44)+coX(6,[330,-50,0],1,30)+coX(7,[262,0,0],1,44)+coX(8,[305,0,0],-1,40)+coX(9,[345,0,0],-1,44)+coX(10,[435,0,50],-1,26,30)+coX(11,[240,0,100],1,40);
 return s}
function trapIso(){let s="";const d=dirOf([0,0,0],[1,0,0]);
 s+=L([0,0,90],[0,0,0])+L([0,0,0],[440,0,0])+L([440,0,0],[440,0,-50])+L([440,0,-50],[520,0,-50])+L([310,0,0],[310,0,-26],"isoP thin");
 {const a=P(-34,0,124),b=P(34,0,124),c=P(34,0,90),e=P(-34,0,90);s+=`<path d="M${pt(a)} L${pt(b)} L${pt(c)} L${pt(e)}Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>`}s+=tI([0,0,107],"COIL",0,4);
 s+=flowA([0,0,70],[0,0,30])+flowA([470,0,-50],[520,0,-50]);
 s+=bow([60,0,0],d,"gate")+isoStr([120,0,0],d)+isoUnion([170,0,0],d)+isoTrap([215,0,0])+isoUnion([260,0,0],d)+bow([310,0,-28],[0,1],"gate",6)+bow([360,0,0],d,"check")+bow([405,0,0],d,"gate");
 s+=tI([520,0,-50],"TO CONDENSATE RETURN",8,18,"start")+tI([310,0,-28],"TEST",14,8,"start");
 s+=coX(1,[60,0,0],-1)+coX(2,[120,0,0],-1,48)+coX(3,[170,0,0],1)+coX(4,[215,0,0],-1,44)+coX(3,[260,0,0],1)+coX(5,[310,0,-28],-1,36)+coX(6,[360,0,0],1)+coX(7,[405,0,0],-1);
 return s}
function dripIso(){let s="";const d=dirOf([0,0,0],[1,0,0]);
 s+=L([-60,0,0],[460,0,-8])+L([120,0,-2],[120,0,-150])+L([116,0,-150],[124,0,-150],"isoP thin")+L([120,0,-100],[380,0,-100])+L([380,0,-100],[380,0,-170])+L([340,0,-170],[520,0,-170])+L([290,0,-100],[290,0,-118],"isoP thin");
 s+=flowA([-60,0,0],[0,0,-1])+flowA([440,0,-170],[520,0,-170]);
 s+=bow([170,0,-100],d,"gate")+isoStr([210,0,-100],d)+isoTrap([250,0,-100])+bow([290,0,-120],[0,1],"gate",6)+bow([325,0,-100],d,"check")+bow([355,0,-100],d,"gate",8);
 s+=tI([460,0,-8],"STEAM MAIN, PITCHED DOWN",8,-10,"start")+tI([520,0,-170],"CONDENSATE RETURN",8,18,"start")+tI([120,0,-150],"BLOWDOWN",-12,10,"end");
 s+=coX(1,[30,0,-1],1)+coX(2,[120,0,-50],-1,36)+coX(3,[120,0,-150],-1,40)+coX(4,[170,0,-100],1,40)+coX(5,[210,0,-100],-1,46)+coX(6,[250,0,-100],1,42)+coX(7,[290,0,-120],-1,36)+coX(8,[325,0,-100],1,40)+coX(9,[355,0,-100],-1,42)+coX(10,[460,0,-170],1,36);
 return s}
/* ---------- render ---------- */
function render(){const box=$("stations");if(!box||box.hidden)return;const S=STA[ST.sta];
 document.querySelectorAll("[data-sta]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sta===ST.sta));
 document.querySelectorAll("[data-stv]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.stv===ST.view));
 document.querySelectorAll("[data-stt]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.stt===ST.trap));
 $("stTrapRow").hidden=ST.sta==="prv";
 const body=ST.view==="2d"?{prv:prv2d,trap:trap2d,drip:drip2d}[ST.sta]():isoFit({prv:prvIso,trap:trapIso,drip:dripIso}[ST.sta])+legend(ST.sta==="prv"?[LG.gate,LG.globe,LG.ctl,LG.str,LG.trap,LG.pg,LG.rv,LG.ecc,LG.flow]:ST.sta==="trap"?[LG.gate,LG.check,LG.str,LG.trap,LG.un,LG.flow]:[LG.gate,LG.check,LG.str,LG.trap,LG.flow],560,14);
 $("stSvg").innerHTML=`<defs><marker id="stDim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="var(--muted)"/></marker></defs>`+body;
 $("stFlow").textContent=S.flow+(ST.view==="iso"?" Isometric: single-line piping on 30° axes, the way piping drawings and spool sheets show it.":" Elevation (side view), drawn from typical manufacturer installation drawings.");
 $("stList").innerHTML=S.parts.map((p,i)=>{const n=i+1,tp=(ST.sta!=="prv"&&/trap$/i.test(p.n))?TRAPS[ST.sta==="drip"&&ST.trap==="ft"?"ib":ST.trap]:null;
  return `<li class="${ST.sel===n?"on":""}" data-sn="${n}"><button class="stItem" data-sn="${n}" aria-expanded="${ST.sel===n}"><b>${n}</b> ${esc(p.n)}${tp?`: ${esc(tp.n)}`:""}</button>${ST.sel===n?`<div class="stDet"><p><b>What:</b> ${esc(tp?tp.w:p.w)}</p><p><b>Why:</b> ${esc(tp?tp.y:p.y)}</p><p><b>Trouble:</b> ${esc(tp?tp.f:p.f)}</p>${tp&&p.w!==tp.w?`<p class="note">${esc(p.w)}</p>`:""}</div>`:""}</li>`}).join("");
 $("stExtra").innerHTML=ST.sta==="drip"?`<p class="note">${esc(SPACING)}</p>`:ST.sta==="trap"?`<p class="note">Trap types: F&amp;T for modulating loads (coils, converters), inverted bucket for drips and high pressure, thermodynamic for drips and tracers above a few psig. On a drip station an F&amp;T is shown as an inverted bucket.</p>`:`<p class="note">Order on the inlet: isolation valve, strainer, drip, gauge, PRV. Outlet: expander, isolation valve, gauge, sensing-line tap, relief valve. The bypass goes around the whole station.</p>`}
function show(on){const box=$("stations"),lay=document.querySelector(".layout");if(!box||!lay)return;box.hidden=!on;lay.hidden=on;$("simSta").setAttribute("aria-pressed",on);
 if(on){$("simHyd").setAttribute("aria-pressed",false);$("simSteam").setAttribute("aria-pressed",false);render()}}
document.addEventListener("click",ev=>{const t=ev.target;
 if(t.closest("#simSta")){show(true);return}
 if(t.closest("#simHyd")||t.closest("#simSteam")){show(false);return}
 const a=t.closest("[data-sta]");if(a){ST.sta=a.dataset.sta;ST.sel=null;saveST();render();return}
 const v=t.closest("[data-stv]");if(v){ST.view=v.dataset.stv;saveST();render();return}
 const tt=t.closest("[data-stt]");if(tt){ST.trap=tt.dataset.stt;saveST();render();return}
 const n=t.closest("[data-sn]");if(n&&n.closest("#stations")){const k=+n.dataset.sn;ST.sel=ST.sel===k?null:k;render();if(ST.sel&&n.closest("svg")){const li=document.querySelector(`#stList li[data-sn="${k}"]`);if(li)li.scrollIntoView({block:"nearest",behavior:"smooth"})}}});
document.addEventListener("keydown",ev=>{if((ev.key==="Enter"||ev.key===" ")&&ev.target.classList&&ev.target.classList.contains("sco")){ev.preventDefault();ev.target.dispatchEvent(new MouseEvent("click",{bubbles:true}))}});
window.__sta={ST,render,show,STA};
})();
