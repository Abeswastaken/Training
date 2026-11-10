/* ============ Carlyle 06D kit: compressor model and drawings shared by the 06D page and its lessons ============ */
const C6={};
C6.BORE=2;C6.RPM=1750;
/* [model, hp, cfm at 1750 rpm, cylinders, stroke in., oil pints, weight lb] from the Carlyle service guide, section 3.1 */
C6.MODELS=[["06DM808",3,8.0,2,"1-1/4",3,160],["06DR109",2,8.7,2,"1-3/8",3,null],["06DR013",3,13.0,4,"1",4.5,230],["06DM316 / 06DR316",5,15.9,4,"1-1/4",4.5,235],["06DR718",5,18.3,4,"1-7/16",5.5,250],["06DR820",6.5,20.0,4,"1-9/16",5.5,260]];
C6.cfm=(n,stroke,rpm)=>n*Math.PI/4*C6.BORE*C6.BORE*stroke*(rpm||C6.RPM)/1728;
/* clearance volume (typical for a reed-valve recip, not a Carlyle figure) and the re-expansion exponent */
C6.CL=0.045;C6.NX=1.12;
C6.ve=CR=>Math.max(0.15,(1-C6.CL*(Math.pow(CR,1/C6.NX)-1))*0.97);
/* one cylinder at crank angle th (0 = top dead center). Pressure in units of suction pressure. */
C6.pv=(th,CR)=>{const t=((th%(2*Math.PI))+2*Math.PI)%(2*Math.PI),x=(1-Math.cos(t))/2,V=C6.CL+x;let p,ph;
 if(t<Math.PI){p=CR*Math.pow(C6.CL/V,C6.NX);if(p>1)ph="reexp";else{p=1;ph="suction"}}
 else{p=Math.pow((1+C6.CL)/V,C6.NX);if(p<CR)ph="comp";else{p=CR;ph="disch"}}
 return {x,V,p,ph,f:CR>1?(p-1)/(CR-1):0}};
C6.PHASE={reexp:"Re-expansion: trapped gas expands, both valves shut",suction:"Suction: the suction reed is open, the cylinder fills",comp:"Compression: both valves shut, pressure climbs",disch:"Discharge: the discharge reed is open, gas leaves"};
/* published suction cut-off steps: [capacity, power] as a fraction of full load */
C6.STEP={"4-2":[0.49,0.57],"6-4":[0.67,0.71],"6-2":[0.32,0.46]};
/* running compressor. o: {n, Te (SST °F), Tc (SCT °F), sh (superheat at the compressor), cyl, stroke, loaded (cylinders), flow (0..1 valve health)} */
C6.run=o=>{const n=o.n||"R-404A",cyl=o.cyl||4,stroke=o.stroke||1.25,ld=o.loaded||cyl;
 const c=RF.cycle(n,{Te:o.Te,Tc:o.Tc,sh:o.sh??40,sc:5,eff:0.7});
 const CR=c.Pd/c.Ps,ve=C6.ve(CR),disp=C6.cfm(cyl,stroke),st=ld<cyl?C6.STEP[cyl+"-"+ld]:[1,1];
 const m0=disp*ve*(o.flow??1)/c.v1,m=m0*st[0];           // lb/min
 const cap=m*60*c.NRE,W=m0*60*c.HOC/3.412/0.86*st[1];
 const dTm=0.14*W*3.412/Math.max(1,m*60*0.2);   // motor heat picked up by the suction gas
 return {c,n,CR,ve,disp,act:disp*ve*(o.flow??1)*st[0],m,cap,tons:cap/12000,W,dTm,T2:c.T2+dTm+(1-(o.flow??1))*160,Ps:c.Ps,Pd:c.Pd,psig:c.Ps-14.7,pdig:c.Pd-14.7,ld,cyl}};
/* ---------- shared paint ---------- */
C6.defs=()=>`<defs>
<pattern id="c6h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#9aa3a9"/><path d="M0 0V7" stroke="#7c868c" stroke-width="1.6"/></pattern>
<pattern id="c6h2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="6" height="6" fill="#7d878d"/><path d="M0 0V6" stroke="#636d73" stroke-width="1.4"/></pattern>
<pattern id="c6lam" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#5d666c"/><path d="M0 0V4" stroke="#3f474c" stroke-width="1.2"/></pattern>
<pattern id="c6mesh" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#c9cfd3"/><path d="M0 0H4M0 0V4" stroke="#6c757b" stroke-width=".9"/></pattern>
<linearGradient id="c6shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d767c"/><stop offset=".3" stop-color="#eef1f3"/><stop offset=".55" stop-color="#b9c1c6"/><stop offset="1" stop-color="#565f65"/></linearGradient>
<linearGradient id="c6pis" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d969c"/><stop offset=".28" stop-color="#f1f3f4"/><stop offset=".6" stop-color="#c3cacf"/><stop offset="1" stop-color="#737c82"/></linearGradient>
<linearGradient id="c6rod" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9b9486"/><stop offset=".35" stop-color="#e6e0d2"/><stop offset="1" stop-color="#8a8375"/></linearGradient>
<linearGradient id="c6cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e09a5c"/><stop offset=".5" stop-color="#b8693a"/><stop offset="1" stop-color="#7d4423"/></linearGradient>
<linearGradient id="c6cuH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a4d28"/><stop offset=".35" stop-color="#eaa66a"/><stop offset="1" stop-color="#8a4d28"/></linearGradient>
<linearGradient id="c6rot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#565f65"/><stop offset=".3" stop-color="#c9cfd3"/><stop offset=".6" stop-color="#8e979d"/><stop offset="1" stop-color="#4a5257"/></linearGradient>
<linearGradient id="c6brz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a2a"/><stop offset=".4" stop-color="#e3c173"/><stop offset="1" stop-color="#7b5c20"/></linearGradient>
<linearGradient id="c6oil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5b53a" stop-opacity=".85"/><stop offset="1" stop-color="#9a6a10" stop-opacity=".95"/></linearGradient>
<linearGradient id="c6iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b949a"/><stop offset="1" stop-color="#555e64"/></linearGradient>
<linearGradient id="c6ironH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a7379"/><stop offset=".3" stop-color="#aab2b7"/><stop offset="1" stop-color="#555e64"/></linearGradient>
<linearGradient id="c6box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6dbde"/><stop offset="1" stop-color="#9ea7ad"/></linearGradient>
<radialGradient id="c6glass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#8fa3ad" stop-opacity=".3"/></radialGradient>
</defs>`;
C6.uniq=s=>{const u=K.uid("q");return s.replace(/(id="|url\(#)c6/g,"$1"+u)};
C6.wrap=s=>C6.uniq(C6.defs()+s);
C6.SUC="#2f6fd6";C6.DIS="#d23a26";
C6.mix=f=>{f=Math.max(0,Math.min(1,f));const a=[47,111,214],b=[210,58,38];return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*f)).join(",")})`};
C6.hex=(x,y,w,h)=>`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="1.2" fill="#3f474c"/><rect x="${x-w/2+w*0.3}" y="${y-h/2}" width="${w*0.4}" height="${h}" fill="#7d868c"/>`;
C6.lead=(t,x,y,tx,ty,a)=>`<path d="M${x} ${y} L${tx} ${ty}" stroke="var(--ink)" stroke-width="1"/><circle cx="${x}" cy="${y}" r="2.4" fill="var(--ink)"/>`+K.tag(tx+(a==="end"?-3:a==="start"?3:0),ty+(a==="end"||a==="start"?5:ty<y?-6:17),t,{a:a||"middle"});
/* ---------- the long cutaway: motor end on the left, pump end on the right. 720 x 380 ----------
 o: {th crank angle, CR, gas (color the gas), oil (sight glass fraction 0..1), foam, oilpath, heater, hl (part key), labels:[keys], cut2 (cylinder 2 unloaded), flow (animate dashes)} */
C6.CYL=[{x:400,ph:0,sx:381,dx:419},{x:510,ph:Math.PI,sx:529,dx:491}];
C6.PARTS=[
 ["sucv","Suction service valve",122,122,"Gas comes back from the evaporator here, at the motor end. Front-seat it to isolate the compressor. The gauge port reads crankcase (suction) pressure."],
 ["strainer","Suction strainer",122,164,"A screen sock just inside the suction valve. It catches scale and braze flakes before they reach the motor and cylinders."],
 ["tbox","Terminal box and terminal plate",230,120,"Power comes in through sealed pins in the terminal plate. A burned or leaking plate can be changed in the field."],
 ["stator","Motor stator",210,176,"The fixed windings. Cool suction gas flows over them on its way to the cylinders, which is why low gas flow or high superheat cooks the motor."],
 ["rotor","Motor rotor",210,236,"Keyed to the end of the crankshaft, so motor and compressor share one shaft inside the sealed case. No shaft seal to leak."],
 ["main","Main bearing",338,236,"Carries the crankshaft where it passes from the motor compartment into the crankcase. Fed with oil through the drilled shaft."],
 ["crank","Crankshaft and eccentrics",455,236,"Each offset throw moves a connecting rod up and down. The shaft is drilled so the pump can push oil to every bearing."],
 ["rod","Connecting rod",400,186,"Aluminum rod. The big end rides on the crank throw, the small end on the piston pin. A slug of liquid bends or breaks it."],
 ["piston","Piston and rings",400,140,"2 in. bore on every 06D. Compression rings seal the gas, an oil ring scrapes oil back down."],
 ["sreed","Suction valve (reed)",381,100,"A thin steel reed under the valve plate, located on dowel pins. It opens when cylinder pressure drops below suction pressure."],
 ["dreed","Discharge valve and stop",419,80,"A reed on top of the valve plate with a curved stop over it. It opens when cylinder pressure rises above head pressure."],
 ["plate","Valve plate",455,91,"A steel plate between the cylinders and the head. It carries the ports and the discharge valves. Replaced as an assembly."],
 ["head","Cylinder head",455,50,"Divided inside into a suction side and a discharge side. A blown gasket between the two lets hot gas leak straight back to suction."],
 ["disv","Discharge service valve",470,14,"Hot gas leaves here for the condenser. The gauge port reads head pressure. Never start the compressor with this valve front-seated."],
 ["sump","Oil sump",470,322,"The crankcase holds the oil charge: 3 to 5.5 pints on the two and four cylinder models."],
 ["glass","Oil sight glass",455,304,"Running level should sit between 1/4 and 3/4 of the glass."],
 ["pickup","Oil pickup tube and screen",548,322,"The pump draws oil through this screen. A plugged screen starves the pump."],
 ["pump","Oil pump and pump end bearing head",622,236,"A reversible pump on the end of the crankshaft, built into the pump end bearing head. Pump and bearing are serviced as one assembly."],
 ["heater","Crankcase heater",420,342,"Keeps the oil 15 to 25°F warmer than the rest of the system while the compressor is off, so refrigerant doesn't settle in the oil."]];
C6.part=k=>C6.PARTS.find(p=>p[0]===k);
C6.cut=(o={})=>{const th=o.th??0.9,CR=o.CR||4,r=17.5,Lr=96,cy=235,gas=o.gas!==false;
 const sT=gas?"#cfe0f5":"#e2e7ea",dT=gas?"#f3cbc4":"#e2e7ea",cT="#dde4e9";
 const off=-(th*14)%14;
 let s=C6.defs();
 s+=`<ellipse cx="360" cy="366" rx="312" ry="8" fill="#000" opacity=".13"/>`;
 // mounting feet
 s+=`<path d="M100 330h56v22h-66z M560 346h56l10 6h-76z" fill="url(#c6iron)"/><rect x="86" y="350" width="74" height="6" rx="2" fill="#4a5257"/><rect x="546" y="350" width="84" height="6" rx="2" fill="#4a5257"/>`;
 // suction line + valve
 s+=`<rect x="111" y="56" width="22" height="54" fill="url(#c6cuH)"/><ellipse cx="122" cy="56" rx="11" ry="3.6" fill="${gas?C6.SUC:"#7d4423"}"/><rect x="100" y="106" width="44" height="34" rx="4" fill="url(#c6ironH)"/><rect x="74" y="117" width="28" height="11" rx="2" fill="url(#c6brz)"/><rect x="66" y="114" width="12" height="17" rx="3" fill="#3f474c"/><circle cx="150" cy="122" r="5" fill="url(#c6brz)"/><rect x="112" y="108" width="20" height="44" fill="${sT}"/>`;
 // casting: motor end cover, motor housing, crankcase, cylinder block
 s+=`<path d="M92 138 Q56 140 56 235 Q56 330 92 332 Z" fill="url(#c6h)"/><rect x="88" y="138" width="252" height="194" rx="9" fill="url(#c6h)"/><rect x="338" y="176" width="262" height="172" rx="8" fill="url(#c6h)"/><rect x="340" y="97" width="230" height="86" fill="url(#c6h)"/>`;
 // cavities
 s+=`<path d="M100 150 Q69 152 69 235 Q69 318 100 320 Z" fill="${sT}"/><rect x="98" y="150" width="228" height="170" rx="5" fill="${sT}"/><rect x="112" y="136" width="20" height="18" fill="${sT}"/>`;
 s+=`<rect x="350" y="188" width="238" height="146" rx="4" fill="${cT}"/>`;
 s+=`<rect x="324" y="154" width="38" height="12" fill="${sT}"/><rect x="350" y="97" width="12" height="69" fill="${sT}"/><path d="M548 97h12v44q0 8-6 8t-6-8z" fill="${sT}"/>`;
 // strainer
 s+=`<path d="M110 152h24v22q0 8-12 8t-12-8z" fill="url(#c6mesh)" opacity=".9" stroke="#6c757b" stroke-width=".8"/>`;
 // end cover joint bolts
 s+=C6.hex(92,133,13,7)+C6.hex(92,337,13,7);
 // terminal box
 s+=`<rect x="186" y="100" width="88" height="38" rx="3" fill="url(#c6box)" stroke="#7a848a" stroke-width=".8"/><rect x="196" y="134" width="68" height="8" fill="#3b3024"/>`;
 [212,230,248].forEach(x=>{s+=`<rect x="${x-2.5}" y="116" width="5" height="40" fill="url(#c6brz)"/>`+C6.hex(x,122,10,5)+`<path d="M${x} 156 q0 8 ${x<230?-10:x>230?10:0} 12" stroke="#b8693a" stroke-width="2" fill="none"/>`});
 s+=`<path d="M274 112h22" stroke="#5f686d" stroke-width="7" stroke-linecap="round"/>`;
 // stator: laminations and copper end turns
 [[156,40],[274,40]].forEach(([y,h])=>{s+=`<rect x="110" y="${y+3}" width="28" height="${h-6}" rx="9" fill="url(#c6cu)"/><rect x="282" y="${y+3}" width="28" height="${h-6}" rx="9" fill="url(#c6cu)"/>`;
  for(let i=0;i<5;i++)s+=`<path d="M112 ${y+8+i*6.2}h24M284 ${y+8+i*6.2}h24" stroke="#7d4423" stroke-width=".8" opacity=".7"/>`;
  s+=`<rect x="135" y="${y}" width="150" height="${h}" fill="url(#c6lam)"/><rect x="135" y="${y}" width="150" height="5" fill="#fff" opacity=".12"/>`});
 // shaft, rotor
 s+=`<rect x="118" y="223" width="532" height="24" fill="url(#c6shaft)"/><rect x="138" y="203" width="144" height="64" rx="2" fill="url(#c6rot)"/>`;
 for(let i=0;i<11;i++)s+=`<path d="M${146+i*13} 203v64" stroke="#3f474c" stroke-width=".8" opacity=".5"/>`;
 s+=`<rect x="110" y="225" width="10" height="20" rx="2" fill="#3f474c"/><rect x="104" y="230" width="8" height="10" rx="1" fill="#7d868c"/>`;
 // main bearing in the partition
 s+=`<rect x="326" y="216" width="24" height="7" fill="url(#c6brz)"/><rect x="326" y="247" width="24" height="7" fill="url(#c6brz)"/>`;
 // cylinders, rods, pistons
 C6.CYL.forEach((c,i)=>{const a=th+c.ph,pinY=cy-r*Math.cos(a),wY=pinY-Math.sqrt(Lr*Lr-Math.pow(r*Math.sin(a),2)),top=wY-22,cut=o.cut2&&i===1;
  const P=C6.pv(a,CR),f=cut?0:P.f;
  s+=`<rect x="${c.x-28}" y="97" width="56" height="91" fill="${cT}"/><rect x="${c.x-28}" y="97" width="56" height="${Math.max(0,top-97)}" fill="${gas?C6.mix(f):"#e2e7ea"}" opacity="${gas?0.28+0.5*f:1}"/>`;
  // rod then eccentric
  s+=`<rect x="${c.x-6}" y="${wY}" width="12" height="${pinY-wY-20}" fill="url(#c6rod)"/><rect x="${c.x-14}" y="${pinY-28}" width="28" height="56" rx="6" fill="url(#c6rod)"/><path d="M${c.x-14} ${pinY}h28" stroke="#6f695c" stroke-width="1"/>`+C6.hex(c.x-14,pinY,5,9)+C6.hex(c.x+14,pinY,5,9);
  s+=`<rect x="${c.x-17}" y="${pinY-21}" width="34" height="42" rx="3" fill="url(#c6shaft)"/>`;
  // piston
  s+=`<rect x="${c.x-27}" y="${top}" width="54" height="42" rx="2.5" fill="url(#c6pis)"/><path d="M${c.x-27} ${top+7}h54M${c.x-27} ${top+13}h54" stroke="#40484d" stroke-width="2"/><path d="M${c.x-27} ${top+20}h54" stroke="#40484d" stroke-width="2.6" stroke-dasharray="3 2"/><circle cx="${c.x}" cy="${wY}" r="6.5" fill="#596268"/><circle cx="${c.x}" cy="${wY}" r="3.5" fill="#c3cacf"/>`;
  c._P=P;c._cut=cut});
 // crank web between throws
 s+=`<rect x="430" y="219" width="50" height="32" rx="3" fill="url(#c6shaft)"/>`;
 // oil sump
 const lv=Math.max(0,Math.min(1.25,o.oil??0.5)),oy=319-lv*26;
 s+=`<rect x="350" y="${oy}" width="238" height="${334-oy}" fill="url(#c6oil)"/><path d="M350 ${oy}h238" stroke="#f6dc8a" stroke-width="1.2"/>`;
 if(o.foam){for(let i=0;i<34;i++){const bx=356+((i*97)%226),by=oy-3-((i*i*7+i*3)%Math.max(8,Math.round(o.foam*46)));s+=`<circle cx="${bx}" cy="${by}" r="${2+(i%3)}" fill="#f6e4a8" opacity=".75" stroke="#c99a2a" stroke-width=".5"/>`}}
 // pickup tube + screen
 s+=`<path d="M544 326H570Q578 326 578 318V266H598" stroke="#8d969c" stroke-width="6" fill="none"/><path d="M544 326H570Q578 326 578 318V266H598" stroke="#e3e7e9" stroke-width="1.6" fill="none" transform="translate(-1 -1)"/><rect x="524" y="320" width="26" height="11" rx="2" fill="url(#c6mesh)" stroke="#6c757b" stroke-width=".8"/>`;
 // sight glass on the far wall
 s+=`<circle cx="455" cy="306" r="16" fill="url(#c6ironH)"/><circle cx="455" cy="306" r="12.5" fill="#e9eef1"/><clipPath id="c6sg"><circle cx="455" cy="306" r="12.5"/></clipPath><rect x="440" y="${oy}" width="30" height="40" fill="#d9a520" opacity=".9" clip-path="url(#c6sg)"/><circle cx="455" cy="306" r="12.5" fill="url(#c6glass)"/>`;
 // bottom cover, heater, drain
 s+=`<rect x="346" y="334" width="246" height="13" rx="2" fill="url(#c6iron)"/>`+[362,420,490,576].map(x=>C6.hex(x,349,11,6)).join("")+`<rect x="384" y="337" width="74" height="6" rx="3" fill="${o.heater?"#ff7a3c":"#7a3c2a"}"/>`+(o.heater?`<rect x="380" y="333" width="82" height="14" rx="7" fill="#ff7a3c" opacity=".3"/>`:"");
 // pump end bearing head, pump, cover plate
 s+=`<rect x="588" y="200" width="14" height="76" fill="${cT}"/><rect x="592" y="188" width="50" height="100" rx="5" fill="url(#c6h2)"/><rect x="596" y="216" width="42" height="7" fill="url(#c6brz)"/><rect x="596" y="247" width="42" height="7" fill="url(#c6brz)"/><rect x="596" y="262" width="12" height="8" fill="#b88a1a"/>`;
 s+=C6.hex(646,196,9,10)+C6.hex(646,280,9,10);
 s+=`<rect x="630" y="215" width="20" height="40" rx="2" fill="url(#c6brz)"/><path d="M636 215v40M643 215v40" stroke="#7b5c20" stroke-width="1"/><rect x="650" y="208" width="11" height="54" rx="3" fill="url(#c6iron)"/>`+C6.hex(664,216,7,9)+C6.hex(664,254,7,9);
 // valve plate
 s+=`<rect x="340" y="85" width="230" height="12" fill="#596268"/><rect x="340" y="85" width="230" height="3" fill="#aeb6bb" opacity=".6"/><rect x="350" y="85" width="12" height="12" fill="${sT}"/><rect x="548" y="85" width="12" height="12" fill="${sT}"/>`;
 // cylinder head
 s+=`<rect x="340" y="28" width="230" height="57" rx="7" fill="url(#c6h2)"/><path d="M346 85V46q0-6 6-6h34q6 0 6 6V85z M518 85V46q0-6 6-6h34q6 0 6 6V85z" fill="${sT}"/><path d="M404 85V46q0-6 6-6h90q6 0 6 6V85z" fill="${dT}"/>`;
 for(let i=0;i<9;i++)s+=`<rect x="${352+i*25}" y="22" width="14" height="7" rx="2" fill="#6a7379"/>`;
 s+=`<path d="M398 30V110M512 30V110" stroke="#40484d" stroke-width="3"/>`+C6.hex(398,25,12,8)+C6.hex(512,25,12,8);
 // discharge valve and line
 s+=`<rect x="447" y="14" width="16" height="30" fill="${dT}"/><rect x="438" y="2" width="34" height="26" rx="4" fill="url(#c6ironH)"/><rect x="470" y="9" width="62" height="13" fill="url(#c6cu)"/><ellipse cx="532" cy="15.5" rx="3.4" ry="6.5" fill="${gas?C6.DIS:"#7d4423"}"/><rect x="418" y="10" width="22" height="10" rx="2" fill="url(#c6brz)"/><rect x="410" y="7" width="11" height="16" rx="3" fill="#3f474c"/>`;
 // ports and reeds
 C6.CYL.forEach((c,i)=>{const P=c._P,so=!c._cut&&P.ph==="suction"?1:0,dop=!c._cut&&P.ph==="disch"?1:0,d=i?-1:1;
  s+=`<rect x="${c.sx-6}" y="85" width="12" height="12" fill="${sT}"/><rect x="${c.dx-6}" y="85" width="12" height="12" fill="${dT}"/>`;
  s+=`<path d="M${c.sx-13*d} 98.2 L${c.sx+12*d} ${98.2+so*8}" stroke="#20272b" stroke-width="2.4" stroke-linecap="round"/><circle cx="${c.sx-13*d}" cy="98.2" r="2.2" fill="#20272b"/>`;
  s+=`<path d="M${c.dx+13*d} 74 Q${c.dx} 70 ${c.dx-12*d} 73" stroke="#40484d" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${c.dx+13*d} 83.8 L${c.dx-12*d} ${83.8-dop*8}" stroke="#20272b" stroke-width="2.4" stroke-linecap="round"/><circle cx="${c.dx+13*d}" cy="83.8" r="2.2" fill="#20272b"/>`;
  if(c._cut)s+=`<rect x="544" y="60" width="26" height="12" rx="2" fill="#20272b"/><path d="M548 66h18" stroke="#ff9a8a" stroke-width="2"/>`;
  if(gas&&o.flow!==false){if(so)s+=`<path d="M${c.sx} 72V112" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 5" stroke-dashoffset="${off}" opacity=".9"/>`;if(dop)s+=`<path d="M${c.dx} 106V62" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 5" stroke-dashoffset="${off}" opacity=".9"/>`}});
 // gas flow path over the motor
 if(gas&&o.flow!==false){s+=`<path d="M122 62V186Q122 200 150 200H300Q318 200 318 180V160H356V60H372" stroke="#fff" stroke-width="2.6" fill="none" stroke-dasharray="7 7" stroke-dashoffset="${off}" opacity=".85"/><path d="M455 52V16H520" stroke="#fff" stroke-width="2.6" fill="none" stroke-dasharray="7 7" stroke-dashoffset="${off}" opacity=".85"/>`}
 // oil path
 if(o.oilpath){const oo=-(th*10)%10;s+=`<path d="M536 326H570Q578 326 578 318V266H622V235H338M510 235V${cy-r*Math.cos(th+Math.PI)}M400 235V${cy-r*Math.cos(th)}" stroke="#ffd54a" stroke-width="3" fill="none" stroke-dasharray="6 4" stroke-dashoffset="${oo}"/><path d="M400 ${cy-r*Math.cos(th)-24}V${cy-r*Math.cos(th)-70}" stroke="#ffd54a" stroke-width="2" stroke-dasharray="3 4" stroke-dashoffset="${oo}"/>`}
 // highlight + labels
 if(o.hl){const p=C6.part(o.hl);if(p)s+=`<circle cx="${p[2]}" cy="${p[3]}" r="24" fill="#ffd54a" opacity=".28"/><circle cx="${p[2]}" cy="${p[3]}" r="24" fill="none" stroke="#e0a800" stroke-width="3"/>`}
 (o.labels||[]).forEach(l=>{s+=C6.lead(l[0],l[1],l[2],l[3],l[4],l[5])});
 return C6.uniq(s)};
/* hot spots for the tool page */
C6.spots=()=>C6.PARTS.map(p=>`<circle cx="${p[2]}" cy="${p[3]}" r="17" fill="transparent" data-part="${p[0]}" style="cursor:pointer"><title>${p[1]}</title></circle>`).join("");
/* ---------- end view: how the banks sit. n = 2, 4 or 6 cylinders ---------- */
C6.end=(n,cx,cy,k=1,o={})=>{const ang=n===2?[0]:n===4?[-38,38]:[-58,0,58];let s="";
 ang.forEach((a,i)=>{const un=o.unl&&o.unl.includes(i);s+=`<g transform="translate(${cx} ${cy}) rotate(${a}) scale(${k})"><rect x="-26" y="-118" width="52" height="74" fill="url(#c6ironH)"/><rect x="-20" y="-104" width="40" height="${46+(o.t?10*Math.cos(o.t+i*2.1):0)}" fill="#dde4e9"/><rect x="-19" y="${-98+(o.t?10*Math.cos(o.t+i*2.1):0)+10}" width="38" height="26" rx="2" fill="url(#c6pis)"/><path d="M0 ${-80+(o.t?10*Math.cos(o.t+i*2.1):0)+10}L0 -10" stroke="#a59e90" stroke-width="7"/><rect x="-32" y="-128" width="64" height="9" fill="#596268"/><rect x="-34" y="-152" width="68" height="25" rx="5" fill="${un?"#b9c0c5":"url(#c6iron)"}"/>${[-22,0,22].map(x=>`<rect x="${x-5}" y="-157" width="10" height="6" rx="1" fill="#3f474c"/>`).join("")}${un?`<rect x="34" y="-148" width="16" height="16" rx="2" fill="#20272b"/>`:""}</g>`});
 s+=`<circle cx="${cx}" cy="${cy}" r="${58*k}" fill="url(#c6ironH)"/><circle cx="${cx}" cy="${cy}" r="${44*k}" fill="#dde4e9"/><circle cx="${cx}" cy="${cy}" r="${15*k}" fill="url(#c6shaft)"/><circle cx="${cx+10*k}" cy="${cy-8*k}" r="${17*k}" fill="none" stroke="#a59e90" stroke-width="${6*k}"/>`;
 s+=`<path d="M${cx-52*k} ${cy+50*k}h${104*k}l${10*k} ${16*k}h${-124*k}z" fill="url(#c6iron)"/>`;
 return s};
/* ---------- P-V card for one cylinder ---------- */
C6.card=(x,y,w,h,CR,th,o={})=>{const X=v=>x+v/(1+C6.CL+0.03)*w,Y=p=>y+h-(p-0.4)/(Math.max(CR,o.max||CR)+0.3-0.4)*h;let d="";
 for(let i=0;i<=120;i++){const t=i/120*2*Math.PI,P=C6.pv(t,CR);d+=(i?"L":"M")+X(P.V).toFixed(1)+" "+Y(P.p).toFixed(1)}
 let s=`<path d="M${x} ${y-6}V${y+h}H${x+w+4}" stroke="var(--muted)" fill="none"/><path d="M${x} ${Y(1)}H${x+w}" stroke="${C6.SUC}" stroke-dasharray="4 4"/><path d="M${x} ${Y(CR)}H${x+w}" stroke="${C6.DIS}" stroke-dasharray="4 4"/>`;
 s+=`<path d="${d}Z" fill="rgba(210,162,76,.22)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/>`;
 s+=K.txt(x+w,Y(1)+16,"suction pressure",{a:"end",fill:C6.SUC})+K.txt(x+w,Y(CR)-6,"head pressure",{a:"end",fill:C6.DIS})+K.txt(x+w/2,y+h+18,"cylinder volume (piston going down →)")+`<text transform="translate(${x-10} ${y+h/2}) rotate(-90)" class="lsG">pressure</text>`;
 s+=`<path d="M${X(C6.CL)} ${y+h}v6" stroke="var(--muted)"/>`+K.txt(X(C6.CL)+2,y+h+34,"clearance",{a:"middle"});
 if(th!=null){const P=C6.pv(th,CR);s+=`<circle cx="${X(P.V)}" cy="${Y(P.p)}" r="6" fill="${C6.mix(P.f)}" stroke="var(--paper)" stroke-width="2"/>`}
 return s};
/* ---------- oblique slab helper for the exploded views ---------- */
C6.slab=(x,y,w,d,t,top,front,side)=>{const dx=d*0.62,dy=-d*0.36;return `<path d="M${x} ${y}l${dx} ${dy}h${w}l${-dx} ${-dy}z" fill="${top}"/><path d="M${x} ${y}h${w}v${t}h${-w}z" fill="${front}"/><path d="M${x+w} ${y}l${dx} ${dy}v${t}l${-dx} ${-dy}z" fill="${side}"/>`};
C6.onTop=(x,y,d,u,v)=>[x+u+v*d*0.62,y-v*d*0.36];   // u along the front edge, v 0..1 toward the back
/* valve plate stack. o: {e: explode 0..1, off: number of layers lifted away (0..6), hl: layer index} layers bottom-up: 0 deck, 1 suction valves, 2 plate gasket, 3 valve plate, 4 head gasket, 5 head, 6 bolts */
C6.STACK=["Cylinder deck","Suction valves and positioning springs","Valve plate gasket","Valve plate with discharge valves","Cylinder head gasket","Cylinder head","Head bolts"];
C6.stack=(o={})=>{const e=o.e??1,X=170,W=300,D=170,g=34*e;let s=C6.defs();const hl=o.hl;
 const glow=(i,inner)=>hl===i?`<g style="filter:drop-shadow(0 0 5px #e0a800) drop-shadow(0 0 2px #e0a800)">${inner}</g>`:inner;
 const Y=i=>[300,292,286-g,280-2*g,268-3*g,262-4*g,214-5*g][i];
 const holes=(y,th,fill)=>[[0.06,0.12],[0.5,0.08],[0.94,0.12],[0.06,0.88],[0.5,0.92],[0.94,0.88]].map(([u,v])=>{const [hx,hy]=C6.onTop(X,y,D,u*W,v);return `<ellipse cx="${hx}" cy="${hy}" rx="6" ry="3.2" fill="${fill}"/>`}).join("");
 s+=`<ellipse cx="${X+W/2+50}" cy="358" rx="230" ry="12" fill="#000" opacity=".12"/>`;
 // 0 deck (block)
 let b=C6.slab(X,Y(0),W,D,58,"#a7afb5","url(#c6iron)","#4f585e");
 [[0.27],[0.73]].forEach(([u])=>{const [bx,by]=C6.onTop(X,Y(0),D,u*W,0.5);b+=`<ellipse cx="${bx}" cy="${by}" rx="52" ry="23" fill="#2b3236"/><ellipse cx="${bx}" cy="${by+7}" rx="46" ry="18" fill="url(#c6pis)"/><ellipse cx="${bx}" cy="${by}" rx="52" ry="23" fill="none" stroke="#e3e7e9" stroke-width="1.2"/>`});
 b+=holes(Y(0),0,"#2b3236");
 [[0.05,0.5],[0.95,0.5]].forEach(([u,v])=>{const [px,py]=C6.onTop(X,Y(0),D,u*W,v);b+=`<rect x="${px-2.5}" y="${py-14}" width="5" height="14" fill="url(#c6pis)"/><ellipse cx="${px}" cy="${py-14}" rx="2.5" ry="1.4" fill="#fff"/>`});
 s+=glow(0,b);
 const lay=[];
 // 1 suction reeds
 if((o.off||0)<6){let r="";[[0.27],[0.73]].forEach(([u])=>{const [bx,by]=C6.onTop(X,Y(1)-g*0.5,D,u*W,0.5);r+=`<path d="M${bx-60} ${by+4}q10 -30 62 -30q52 0 60 26q-10 22 -60 24q-50 0 -62 -20z" fill="#c9d0d4" stroke="#5f686d" stroke-width="1"/><ellipse cx="${bx}" cy="${by}" rx="30" ry="12" fill="none" stroke="#8d969c" stroke-width="1"/><path d="M${bx-54} ${by+2}q-6 -12 6 -18" stroke="#b88a1a" stroke-width="2.4" fill="none"/>`});lay.push(glow(1,r))}
 if((o.off||0)<5){let r=C6.slab(X,Y(2),W,D,3,"#3d3a34","#2b2925","#1f1d1a");[[0.27],[0.73]].forEach(([u])=>{const [bx,by]=C6.onTop(X,Y(2),D,u*W,0.5);r+=`<ellipse cx="${bx}" cy="${by}" rx="52" ry="23" fill="var(--paper)" opacity=".85"/>`});lay.push(glow(2,r+holes(Y(2),0,"var(--paper)")))}
 if((o.off||0)<4){let r=C6.slab(X,Y(3),W,D,11,"#aeb6bb","url(#c6iron)","#4f585e");[[0.27,1],[0.73,-1]].forEach(([u,sg])=>{const [bx,by]=C6.onTop(X,Y(3),D,u*W,0.5);
   r+=`<ellipse cx="${bx-22*sg}" cy="${by+4}" rx="12" ry="5" fill="#2b3236"/><path d="M${bx-6} ${by-2}h44l8 -5h-44z" fill="#e3e7e9" stroke="#5f686d" stroke-width=".8"/><path d="M${bx-8} ${by-7}h48l8 -5h-48z" fill="#596268"/><circle cx="${bx-2}" cy="${by-8}" r="3" fill="#20272b"/><circle cx="${bx+44}" cy="${by-11}" r="3" fill="#20272b"/>`});lay.push(glow(3,r+holes(Y(3),0,"#2b3236")))}
 if((o.off||0)<3){let r=C6.slab(X,Y(4),W,D,3,"#4a463e","#2b2925","#1f1d1a");const [a1,b1]=C6.onTop(X,Y(4),D,0.5*W,0.5);r+=`<path d="M${a1-110} ${b1+16}l40 -24h170l-40 24z" fill="var(--paper)" opacity=".8"/>`;lay.push(glow(4,r+holes(Y(4),0,"var(--paper)")))}
 if((o.off||0)<2){let r=C6.slab(X,Y(5),W,D,42,"#8f989e","url(#c6iron)","#4a5257");for(let i=0;i<7;i++){const [fx,fy]=C6.onTop(X,Y(5),D,26+i*41,0.16);r+=`<path d="M${fx} ${fy}l${D*0.42} ${-D*0.245}" stroke="#6a7379" stroke-width="9" stroke-linecap="round"/><path d="M${fx-1} ${fy-2}l${D*0.42} ${-D*0.245}" stroke="#c3cacf" stroke-width="2" stroke-linecap="round"/>`}
   r+=`<rect x="${X+96}" y="${Y(5)+12}" width="108" height="18" rx="2" fill="#3b4449"/><text x="${X+150}" y="${Y(5)+25}" text-anchor="middle" font-size="11" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" fill="#dfe5e8" letter-spacing="2">CARLYLE</text>`;lay.push(glow(5,r+holes(Y(5),0,"#2b3236")))}
 if((o.off||0)<1){let r="";[[0.06,0.88],[0.5,0.92],[0.94,0.88],[0.06,0.12],[0.5,0.08],[0.94,0.12]].forEach(([u,v])=>{const [hx,hy]=C6.onTop(X,Y(6)+48,D,u*W,v);r+=`<rect x="${hx-3.5}" y="${hy-6}" width="7" height="${6+30*e}" fill="url(#c6pis)"/><path d="M${hx-9} ${hy-12}h18v8h-18z" fill="#40484d"/><path d="M${hx-9} ${hy-12}l4 -4h10l4 4z" fill="#7d868c"/>`});lay.push(glow(6,r))}
 return C6.uniq(s+lay.join(""))};
/* ---------- pump end bearing head, exploded along the shaft. o:{e, off (0..5), hl} parts: 0 crankshaft end, 1 bearing head, 2 drive segment, 3 guide vane, 4 vane spring, 5 cover plate + screws ---------- */
C6.PUMP=["Crankshaft end","Pump end bearing head (bearing and oil pump)","Pump drive segment","Oil feed guide vane","Vane spring","Cover plate and cap screws"];
C6.pump=(o={})=>{const e=o.e??1,cy=190,hl=o.hl;let s=C6.defs(),parts0="";
 const glow=(i,inner)=>hl===i?`<g style="filter:drop-shadow(0 0 5px #e0a800) drop-shadow(0 0 2px #e0a800)">${inner}</g>`:inner;
 const cyl=(x,len,r,body,face,ex=0.3)=>`<rect x="${x}" y="${cy-r}" width="${len}" height="${2*r}" fill="${body}"/><ellipse cx="${x}" cy="${cy}" rx="${r*ex}" ry="${r}" fill="${body}"/><ellipse cx="${x+len}" cy="${cy}" rx="${r*ex}" ry="${r}" fill="${face}"/>`;
 const xs=[0,150,150+150*e,150+215*e,150+262*e,150+330*e].map(v=>v+40);
 parts0+=`<ellipse cx="330" cy="330" rx="270" ry="9" fill="#000" opacity=".12"/>`;
 // crankcase end + shaft
 let a=`<path d="M40 60h70l32 20v220l-32 20H40z" fill="url(#c6ironH)"/><ellipse cx="142" cy="190" rx="26" ry="88" fill="#3b4449"/>`+cyl(110,60,20,"url(#c6shaft)","#c9d0d4")+`<circle cx="166" cy="183" r="2.6" fill="#20272b"/><circle cx="166" cy="197" r="2.6" fill="#20272b"/>`;
 [[-74],[-40],[40],[74]].forEach(([dy])=>{a+=`<ellipse cx="${138+(Math.abs(dy)>50?-6:2)}" cy="${190+dy}" rx="2.4" ry="4.6" fill="#15191c"/>`});
 parts0+=glow(0,a);
 const parts=[];
 if((o.off||0)<4){let p=cyl(xs[1]+60,34,84,"url(#c6ironH)","#9ea7ad",0.26)+`<ellipse cx="${xs[1]+94}" cy="190" rx="9" ry="30" fill="url(#c6brz)"/><ellipse cx="${xs[1]+94}" cy="190" rx="5.5" ry="19" fill="#2b3236"/>`;
  for(let i=0;i<8;i++){const t=i/8*2*Math.PI+0.39;p+=`<ellipse cx="${xs[1]+94+Math.cos(t)*18}" cy="${190+Math.sin(t)*70}" rx="2" ry="4.6" fill="#20272b"/>`}
  p+=`<rect x="${xs[1]+70}" y="96" width="14" height="14" rx="2" fill="url(#c6brz)"/>`;parts.push(glow(1,p))}
 if((o.off||0)<3){parts.push(glow(2,cyl(xs[2]+110,10,17,"#8d969c","#d5dadd",0.3)+`<path d="M${xs[2]+120} ${cy-17}a5.1 17 0 0 1 0 34z" fill="#596268"/>`+C6.hex(xs[2]+128,183,9,6)+C6.hex(xs[2]+128,197,9,6)))}
 if((o.off||0)<2){parts.push(glow(3,cyl(xs[3]+120,10,13,"url(#c6brz)","#e3c173",0.3)+cyl(xs[3]+130,18,7,"url(#c6brz)","#e3c173",0.3)));
  let sp="";for(let i=0;i<7;i++)sp+=`<ellipse cx="${xs[4]+128+i*5}" cy="${cy}" rx="3" ry="9" fill="none" stroke="#596268" stroke-width="2"/>`;parts.push(glow(4,sp))}
 if((o.off||0)<1){let c=cyl(xs[5]+110,9,36,"url(#c6ironH)","#aab2b7",0.28);[[-22],[22]].forEach(([dy])=>{c+=`<rect x="${xs[5]+119+20*e}" y="${cy+dy-3}" width="${26}" height="6" fill="url(#c6pis)"/><rect x="${xs[5]+143+20*e}" y="${cy+dy-7}" width="9" height="14" rx="1.5" fill="#40484d"/><ellipse cx="${xs[5]+121}" cy="${cy+dy}" rx="1.8" ry="4" fill="#20272b"/>`});
  [[-10],[10]].forEach(([dy])=>{c+=`<ellipse cx="${xs[5]+121.5}" cy="${cy+dy*0.1}" rx="0" ry="0"/>`});parts.push(glow(5,c))}
 if(e>0.5)parts0+=`<path d="M176 190H${xs[5]+170}" stroke="var(--muted)" stroke-dasharray="3 5"/>`;
 return C6.uniq(s+`<g transform="translate(4 0) scale(1)">`+parts0+parts.join("")+`</g>`)};
/* ---------- suction cut-off unloader, section. o:{loaded, type:"e"|"p", k} drawn in a 330 x 250 box ---------- */
C6.unl=(o={})=>{const L=o.loaded!==false,px=L?0:45,el=o.type!=="p";let s=C6.defs();
 const ch=L?"#f3cbc4":"#cfe0f5";
 s+=`<rect x="0" y="40" width="330" height="210" rx="8" fill="url(#c6h)"/>`;
 // suction manifold (bottom) → port → cylinder pocket (top right)
 s+=`<rect x="212" y="150" width="46" height="100" fill="#cfe0f5"/><rect x="212" y="60" width="110" height="50" rx="4" fill="${L?"#cfe0f5":"#e2e7ea"}"/><rect x="212" y="100" width="46" height="60" fill="${L?"#cfe0f5":"#e2e7ea"}"/>`;
 // bore
 s+=`<rect x="30" y="100" width="182" height="60" fill="${ch}"/><rect x="30" y="100" width="${22+px}" height="60" fill="#cfe0f5"/>`;
 // seal wall
 s+=`<rect x="150" y="100" width="14" height="22" fill="url(#c6h2)"/><rect x="150" y="138" width="14" height="22" fill="url(#c6h2)"/>`;
 // spring
 let sp="";const n=7,sw=(22+px)/n;for(let i=0;i<n;i++)sp+=`<path d="M${30+i*sw} 106L${30+(i+0.5)*sw} 154L${30+(i+1)*sw} 106" stroke="#40484d" stroke-width="2.4" fill="none"/>`;s+=sp;
 // piston + stem + plug (valve body)
 s+=`<rect x="${52+px}" y="101" width="30" height="58" rx="3" fill="url(#c6shaft)"/><path d="M${60+px} 101v58M${72+px} 101v58" stroke="#40484d" stroke-width="1.4"/><rect x="${82+px}" y="122" width="96" height="16" fill="url(#c6shaft)"/><rect x="${172+px}" y="104" width="40" height="52" rx="4" fill="url(#c6brz)"/>`;
 // bleed from discharge
 s+=`<path d="M120 250V176Q120 166 126 166" stroke="${C6.DIS}" stroke-width="5" fill="none"/><rect x="113" y="158" width="14" height="6" fill="#20272b"/><rect x="118.5" y="158" width="3" height="6" fill="${C6.DIS}"/>`;
 // pilot passage up to the solenoid / pressure pilot, and vent to suction
 s+=`<path d="M138 100V52" stroke="${ch}" stroke-width="8"/><path d="M138 52H${L?138:200}" stroke="#cfe0f5" stroke-width="8"/><path d="M200 44V60" stroke="#cfe0f5" stroke-width="8"/>`;
 s+=`<path d="M146 48H212V100" stroke="#cfe0f5" stroke-width="7" fill="none" opacity="${L?0.35:1}"/>`;
 if(el){s+=`<rect x="108" y="-4" width="60" height="44" rx="5" fill="#2b3236"/><rect x="116" y="4" width="44" height="28" rx="3" fill="url(#c6cu)"/><rect x="133" y="${L?30:16}" width="10" height="26" fill="url(#c6shaft)"/><path d="M168 10h26M168 26h26" stroke="${L?"#5f686d":"#e0a800"}" stroke-width="3"/>`+K.lbl(250,22,L?"COIL OFF":"COIL ON",{fill:L?"var(--muted)":"#b07d00"})}
 else{s+=`<rect x="112" y="-4" width="52" height="44" rx="5" fill="url(#c6ironH)"/><path d="M120 6l8 26l8 -26l8 26l8 -26" stroke="#40484d" stroke-width="2.4" fill="none"/><rect x="133" y="${L?32:18}" width="10" height="24" fill="url(#c6shaft)"/><rect x="128" y="-12" width="20" height="9" rx="2" fill="url(#c6brz)"/>`+K.lbl(240,14,"SET POINT SCREW",{size:12})}
 // flow arrows
 if(L)s+=K.arrow("M235 240V128Q235 86 300 86",C6.SUC,3);else s+=K.arrow("M235 240V172",C6.SUC,3)+`<path d="M222 166l26 -20M222 146l26 20" stroke="${C6.DIS}" stroke-width="3"/>`;
 return C6.uniq(s)};
window.C6=C6;
