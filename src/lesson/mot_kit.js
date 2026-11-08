/* ============ Motors + VFD lesson kit: the 10 hp motor and 480 V drive from the Motors + VFD trainer (src/vfd.js), drawings and shared math ============
 Motor data: Marathon 215THFND9026, 10 hp, 460 V, 13.3 A, 1765 rpm, SF 1.15, class F, code H, design B, 215T TEFC, 91.7%, 81 A locked rotor. */
const MK={};
MK.M={hp:10,V:460,FLA:13.3,rpm:1765,poles:4,Hz:60,SF:1.15,ins:"F",code:"H",frame:"215T",eff:0.917,lra:81,design:"B",TFLC:14};
MK.M.Tr=MK.M.hp*745.7/(MK.M.rpm*2*Math.PI/60);           // rated torque, N·m (about 40.3)
MK.MAG=0.35;                                                // magnetizing current as a fraction of FLA (typical 4-pole 10 hp)
/* current at a torque fraction tq (1 = rated) with rated flux: magnetizing and torque parts add at right angles */
MK.amps=(tq,fla=MK.M.FLA)=>fla*Math.sqrt(MK.MAG*MK.MAG+(1-MK.MAG*MK.MAG)*tq*tq);
MK.sync=(f,p)=>120*f/p;
MK.COLS={L1:"#2c3034",L2:"#c0392b",L3:"#2f6fd6",dc:"#c0392b",dcn:"#2c3034",gnd:"#1e9a4a"};
MK.n0=x=>Math.round(x).toLocaleString("en-US");
/* gradients (each drawing defines its own) */
MK.lin=(id,stops,vert=true)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
MK.defs=()=>{const g={st:K.uid("mst"),sh:K.uid("msh"),pl:K.uid("mpl"),pd:K.uid("mpd"),cu:K.uid("mcu"),al:K.uid("mal"),bl:K.uid("mbl"),gr:K.uid("mgr"),lcd:K.uid("mlc")};
 g.d=`<defs>${MK.lin(g.st,[[0,"#f2f4f5"],[.45,"#c9d0d4"],[1,"#8c969c"]])}${MK.lin(g.sh,[[0,"#8c969c"],[.4,"#eef1f3"],[1,"#9aa3a8"]],false)}${MK.lin(g.pl,[[0,"#4a6f8f"],[.5,"#3b5b78"],[1,"#2b4258"]])}${MK.lin(g.pd,[[0,"#454c52"],[1,"#24292d"]])}${MK.lin(g.cu,[[0,"#f0b27a"],[.5,"#c87533"],[1,"#8a4a1c"]])}${MK.lin(g.al,[[0,"#f4f6f7"],[.5,"#dfe3e6"],[1,"#b8c0c5"]])}${MK.lin(g.bl,[[0,"#3f6fa8"],[.5,"#2f5a8c"],[1,"#1f3d61"]],false)}${MK.lin(g.gr,[[0,"#d9dde0"],[1,"#aab2b7"]])}${MK.lin(g.lcd,[[0,"#c8d8b0"],[1,"#a9bd8c"]])}</defs>`;return g};
/* TEFC induction motor, side view. (x,y) = top-left of the frame body, s = scale. body 230 x 120 at s=1. o: {spin, label, box:true} */
MK.motor=(x,y,s=1,o={})=>{const g=MK.defs(),W=230,H=120;let b=g.d+`<g transform="translate(${x} ${y}) scale(${s})">`;
 b+=`<ellipse cx="${W/2}" cy="${H+34}" rx="${W*0.62}" ry="7" fill="#000" opacity=".12"/>`;
 // feet
 b+=`<path d="M30 ${H-6} L18 ${H+28} H92 L80 ${H-6}Z M${W-80} ${H-6} L${W-92} ${H+28} H${W-18} L${W-30} ${H-6}Z" fill="${o.foot||"#4d6a86"}" stroke="#1f2b36"/>`;
 // fan cover (left)
 b+=`<path d="M-46 14 Q-58 ${H/2} -46 ${H-14} L0 ${H-4} V4 Z" fill="url(#${g.st})" stroke="#3a4247"/>`;
 for(let i=0;i<6;i++)b+=`<path d="M${-44+i*2} ${24+i*13} H-6" stroke="#59636a" stroke-width="3" stroke-linecap="round"/>`;
 // frame with cooling fins
 b+=`<rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="url(#${g.pl})" stroke="#1f2b36" stroke-width="1.5"/>`;
 for(let i=1;i<9;i++)b+=`<path d="M6 ${i*H/9} H${W-6}" stroke="#203447" stroke-width="2" opacity=".7"/><path d="M6 ${i*H/9+2} H${W-6}" stroke="#7fa2c2" stroke-width="1" opacity=".55"/>`;
 // end bell (right)
 b+=`<path d="M${W} 8 Q${W+26} 14 ${W+30} ${H/2} Q${W+26} ${H-14} ${W} ${H-8}Z" fill="url(#${g.pl})" stroke="#1f2b36"/>`;
 // shaft and key
 b+=`<rect x="${W+30}" y="${H/2-9}" width="58" height="18" rx="2" fill="url(#${g.st})" stroke="#3a4247"/><rect x="${W+52}" y="${H/2-9}" width="26" height="4" fill="#59636a"/>`;
 // conduit box
 if(o.box!==false)b+=`<rect x="${W/2-26}" y="-30" width="52" height="34" rx="4" fill="url(#${g.pl})" stroke="#1f2b36"/><rect x="${W/2-20}" y="-25" width="40" height="24" rx="2" fill="none" stroke="#7fa2c2" stroke-width="1"/><rect x="${W/2+26}" y="-20" width="20" height="14" fill="url(#${g.st})" stroke="#3a4247"/>`;
 // nameplate on the frame
 b+=`<rect x="${W/2-34}" y="${H/2-22}" width="68" height="44" rx="3" fill="url(#${g.al})" stroke="#59636a"/>`;for(let i=0;i<5;i++)b+=`<path d="M${W/2-26} ${H/2-12+i*7} h${i%2?40:52}" stroke="#59636a" stroke-width="1.6"/>`;
 b+=`</g>`;if(o.label)b+=K.lbl(x+W*s/2,y+(H+52)*s,o.label,{size:13});return b};
/* a nameplate. rows: [[label,value],...] in 2 columns. o: {title, hi:[keys to highlight], w, h} */
MK.plate=(x,y,w,h,rows,o={})=>{const g=MK.defs();let s=g.d+`<rect x="${x+3}" y="${y+4}" width="${w}" height="${h}" rx="8" fill="#000" opacity=".15"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#${g.al})" stroke="#59636a" stroke-width="1.5"/>`;
 [[x+10,y+10],[x+w-10,y+10],[x+10,y+h-10],[x+w-10,y+h-10]].forEach(([a,b])=>{s+=`<circle cx="${a}" cy="${b}" r="4" fill="#9aa3a8" stroke="#59636a"/>`});
 s+=`<rect x="${x+20}" y="${y+12}" width="${w-40}" height="26" rx="3" fill="#2b4258"/><text x="${x+w/2}" y="${y+30}" class="lsGn" style="fill:#eef1f3;font-size:13px;font-weight:600">${o.title||"AC INDUCTION MOTOR · 3 PHASE"}</text>`;
 const cols=2,rh=(h-58)/Math.ceil(rows.length/cols),cw=(w-30)/cols;
 rows.forEach(([k,v],i)=>{const c=i%cols,r=Math.floor(i/cols),cx=x+15+c*cw,cy=y+50+r*rh;const hi=(o.hi||[]).includes(k);
  if(hi)s+=`<rect x="${cx+2}" y="${cy+2}" width="${cw-6}" height="${rh-4}" rx="3" fill="#f1c40f" opacity=".45"/>`;
  s+=`<rect x="${cx+2}" y="${cy+2}" width="${cw-6}" height="${rh-4}" rx="3" fill="none" stroke="#9aa3a8"/><text x="${cx+8}" y="${cy+rh/2+5}" class="lsGn" style="text-anchor:start;font-size:11px">${k}</text><text x="${cx+cw-10}" y="${cy+rh/2+5}" class="lsGn" style="text-anchor:end;font-size:14px;font-weight:600">${v}</text>`});
 return s};
MK.ROWS=[["HP","10"],["VOLTS","230/460"],["AMPS","26.6/13.3"],["RPM","1765"],["HZ","60"],["PHASE","3"],["S.F.","1.15"],["FRAME","215T"],["INSUL","F"],["CODE","H"],["DESIGN","B"],["NEMA EFF","91.7%"],["AMB","40°C"],["ENCL","TEFC"]];
/* a variable frequency drive enclosure with keypad. o: {lcd1, lcd2, fault} */
MK.drive=(x,y,w=150,h=230,o={})=>{const g=MK.defs();let s=g.d+`<rect x="${x+4}" y="${y+5}" width="${w}" height="${h}" rx="8" fill="#000" opacity=".15"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#${g.st})" stroke="#3a4247" stroke-width="1.5"/>`;
 s+=`<rect x="${x+14}" y="${y+16}" width="${w-28}" height="96" rx="6" fill="url(#${g.pd})" stroke="#111"/>`;
 const fl=o.fault;s+=`<rect x="${x+24}" y="${y+26}" width="${w-48}" height="44" rx="3" fill="${fl?"#e8b04a":"#15191c"}" stroke="#3a4247"/><text x="${x+w/2}" y="${y+46}" class="lsLcd" style="font-size:14px${fl?";fill:#2a1a00":""}">${o.lcd1||"45.0 Hz"}</text><text x="${x+w/2}" y="${y+63}" class="lsLcd" style="font-size:11px${fl?";fill:#2a1a00":""}">${o.lcd2||"12.4 A"}</text>`;
 s+=`<circle cx="${x+w/2-26}" cy="${y+90}" r="9" fill="#2fbf5a"/><circle cx="${x+w/2}" cy="${y+90}" r="9" fill="#d23a26"/><rect x="${x+w/2+14}" y="${y+83}" width="24" height="14" rx="3" fill="#59636a"/>`;
 for(let i=0;i<9;i++)s+=`<rect x="${x+20+i*(w-40)/9}" y="${y+130}" width="${(w-40)/9-5}" height="${h-170}" rx="2" fill="#59636a" opacity=".55"/>`;
 s+=`<rect x="${x+20}" y="${y+h-28}" width="${w-40}" height="14" rx="3" fill="#3a4247"/>`;return s};
/* insulation tester (megohmmeter) with a digital display and two leads. o: {v, read, hot} */
MK.megger=(x,y,o={})=>{const g=MK.defs();let s=g.d+`<rect x="${x+4}" y="${y+5}" width="150" height="190" rx="14" fill="#000" opacity=".15"/><rect x="${x}" y="${y}" width="150" height="190" rx="14" fill="#c0392b" stroke="#5a0b07" stroke-width="1.5"/><rect x="${x+8}" y="${y+8}" width="134" height="174" rx="10" fill="url(#${g.pd})"/>`;
 s+=`<rect x="${x+18}" y="${y+18}" width="114" height="54" rx="4" fill="url(#${g.lcd})" stroke="#111"/><text x="${x+75}" y="${y+50}" class="lsGn" style="font-size:20px;font-weight:600">${o.read||"---"}</text><text x="${x+75}" y="${y+66}" class="lsGn" style="font-size:10px">${o.sub||"MΩ"}</text>`;
 s+=`<circle cx="${x+75}" cy="${y+112}" r="24" fill="#59636a" stroke="#111"/><path d="M${x+75} ${y+112} L${x+75} ${y+92}" stroke="#f1c40f" stroke-width="4" stroke-linecap="round" transform="rotate(${o.rot??20} ${x+75} ${y+112})"/>`;
 [["250",-70],["500",-25],["1000",25],["2500",70]].forEach(([t,a])=>{const r=Math.PI*(a-90)/180;s+=`<text x="${x+75+36*Math.cos(r)}" y="${y+116+36*Math.sin(r)}" style="font:600 9px var(--mono);fill:#e9ecee;text-anchor:middle">${t}</text>`});
 s+=`<rect x="${x+40}" y="${y+146}" width="70" height="22" rx="11" fill="${o.hot?"#f1c40f":"#2c3034"}" stroke="#111"/><text x="${x+75}" y="${y+161}" style="font:600 10px var(--mono);fill:${o.hot?"#2a1a00":"#e9ecee"};text-anchor:middle">TEST</text>`;
 s+=`<circle cx="${x+30}" cy="${y+178}" r="6" fill="#c0392b" stroke="#111"/><circle cx="${x+120}" cy="${y+178}" r="6" fill="#111" stroke="#555"/>`;return s};
/* a smooth wire */
MK.wire=(d,c,w=3)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/* small boxed label with value, used for readouts in drawings */
MK.box=(x,y,w,t,v,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${o.h||54}" rx="8" fill="var(--paper)" stroke="${o.st||"var(--panel-edge)"}"/>`+K.lbl(x+w/2,y+20,t,{size:12,fill:o.tc})+`<text x="${x+w/2}" y="${y+(o.h||54)-12}" style="font:600 ${o.vs||17}px var(--mono);fill:${o.vc||"var(--ink)"};text-anchor:middle">${v}</text>`;
/* diode and IGBT symbols for the drive's power section */
MK.dio=(x,y,c="var(--ink)")=>`<path d="M${x-7} ${y+6} L${x+7} ${y+6} L${x} ${y-6} Z" fill="${c}"/><path d="M${x-7} ${y-6} H${x+7}" stroke="${c}" stroke-width="2"/>`;
MK.igbt=(x,y,on)=>`<rect x="${x-11}" y="${y-11}" width="22" height="22" rx="3" fill="${on?"#e8c33a":"#2c3034"}" stroke="#111"/><path d="M${x-4} ${y-6} V${y+6} M${x-4} ${y-2} L${x+5} ${y-7} M${x-4} ${y+2} L${x+5} ${y+7}" stroke="${on?"#2c3034":"#e8c33a"}" stroke-width="1.6" fill="none"/>`;
MK.cap=(x,y,h=46)=>{const g=MK.defs();return g.d+`<rect x="${x-13}" y="${y}" width="26" height="${h}" rx="4" fill="url(#${g.bl})" stroke="#14202c"/><ellipse cx="${x}" cy="${y+1}" rx="13" ry="3.5" fill="#c9d0d4"/><rect x="${x-10}" y="${y+4}" width="3" height="${h-8}" fill="rgba(255,255,255,.25)"/>`};
/* the drive's power section: rectifier, DC bus, inverter. (x,y) top-left, about 520 x 170. o: {vbus, on:[6 bools], lbl:true, dim:"rect"|"bus"|"inv"} */
MK.power=(x,y,o={})=>{let s="";const top=y+20,bot=y+150,X=[x+50,x+90,x+130];const dim=k=>o.dim&&o.dim!==k?' opacity=".35"':"";
 // input lines
 s+=`<g${dim("rect")}>`;["L1","L2","L3"].forEach((n,i)=>{const yy=y+60+i*26;s+=MK.wire(`M${x-20} ${yy} H${X[i]}`,MK.COLS[n],3)+`<circle cx="${X[i]}" cy="${yy}" r="3" fill="var(--ink)"/>`+K.txt(x-24,yy+5,n,{a:"end"})});
 X.forEach(xx=>{s+=MK.wire(`M${xx} ${top} V${bot}`,"var(--ink)",1.6)+MK.dio(xx,top+22)+MK.dio(xx,bot-22)});
 s+=K.lbl(x+90,bot+24,"RECTIFIER",{size:13})+`</g>`;
 // bus
 const bx=x+170,ex=x+330;s+=MK.wire(`M${X[0]} ${top} H${x+500}`,MK.COLS.dc,3.5)+MK.wire(`M${X[0]} ${bot} H${x+500}`,MK.COLS.dcn,3.5);
 s+=`<g${dim("bus")}>`;[bx+40,bx+90].forEach(cx=>{s+=MK.wire(`M${cx} ${top} V${top+26} M${cx} ${bot-26} V${bot}`,"var(--ink)",1.6)+MK.cap(cx,top+28,bot-top-56)});
 s+=K.lbl(bx+65,bot+24,"DC BUS",{size:13})+K.txt(bx+130,top-6,"+",{fill:MK.COLS.dc})+K.txt(bx+130,bot+16,"−");
 if(o.vbus!=null)s+=K.lcd(bx+65,y+90,MK.n0(o.vbus)+" V DC",104);s+=`</g>`;
 // inverter
 const IX=[ex+40,ex+90,ex+140],on=o.on||[0,0,0,0,0,0];s+=`<g${dim("inv")}>`;
 IX.forEach((xx,i)=>{s+=MK.wire(`M${xx} ${top} V${bot}`,"var(--ink)",1.6)+MK.igbt(xx,top+30,on[i])+MK.igbt(xx,bot-30,on[i+3])+`<circle cx="${xx}" cy="${y+85}" r="3" fill="var(--ink)"/>`+MK.wire(`M${xx} ${y+85} H${xx+18}`,"var(--ink)",1.6)+K.txt(xx+22,y+90,"T"+(i+1),{a:"start"})});
 s+=K.lbl(ex+90,bot+24,"INVERTER (IGBTs)",{size:13})+`</g>`;return s};
/* a scope trace path: fn(t) for t in 0..1 */
MK.trace=(x,y,w,h,fn,n=240)=>{let d="";for(let i=0;i<=n;i++){const t=i/n,v=Math.max(-1.05,Math.min(1.05,fn(t)));d+=(i?"L":"M")+(x+t*w).toFixed(1)+" "+(y-v*h).toFixed(1)}return d};
MK.screen=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#0d1a14" stroke="#3a4247"/>`+Array.from({length:9},(_,i)=>`<path d="M${x+w*(i+1)/10} ${y} V${y+h}" stroke="#1e3a2c"/>`).join("")+Array.from({length:5},(_,i)=>`<path d="M${x} ${y+h*(i+1)/6} H${x+w}" stroke="#1e3a2c"/>`).join("");
/* callout line with label */
MK.co=(x1,y1,x2,y2,t,o={})=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="var(--muted)" stroke-width="1.3"/><circle cx="${x1}" cy="${y1}" r="3" fill="var(--muted)"/>`+K.tag(x2+(o.a==="end"?-4:o.a==="start"?4:0),y2+5,t,{a:o.a||"middle",fill:o.fill,w:o.w});
