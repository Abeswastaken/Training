/* ============ 3-phase motor control lesson kit: starter, overload, motor and ladder drawings plus the shared math ============
 Same terms and numbers as the 3-Phase Motor Control trainer (src/ladder3.js): NEC Table 430.250 FLA (10 hp: 14 A at 460 V),
 480 V wire colors brown / orange / yellow, X1 / X2 control rails, M / F / R / S / D contactor tags, overload contact 95-96. */
const TPK={};
TPK.PC=["#8b5a2b","#e07b1a","#cfae0c"];TPK.PN=["L1","L2","L3"];
TPK.LIVE="#d62828";TPK.DEAD="#8e969b";TPK.SE="#4d555a";
TPK.FLA460={1:2.1,2:3.4,3:4.8,5:7.6,7.5:11,10:14,15:21,20:27,25:34,30:40,40:52,50:65};
/* gradients: every drawing calls TPK.defs() once and passes the result to the part helpers */
TPK.defs=()=>{const u=K.uid("tp");const G={pl:u+"p",pd:u+"d",mo:u+"m",mt:u+"x",cu:u+"c",sh:u+"s"};
 G.s=`<defs><linearGradient id="${G.pl}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9ced1"/><stop offset=".4" stop-color="#eef1f3"/><stop offset="1" stop-color="#b6bcc0"/></linearGradient>
 <linearGradient id="${G.pd}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4b5459"/><stop offset=".45" stop-color="#78838a"/><stop offset="1" stop-color="#3d4549"/></linearGradient>
 <linearGradient id="${G.mo}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f5f7f"/><stop offset=".32" stop-color="#8db0d0"/><stop offset=".55" stop-color="#5c7fa1"/><stop offset="1" stop-color="#2a4057"/></linearGradient>
 <linearGradient id="${G.mt}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f989d"/><stop offset=".5" stop-color="#e2e6e9"/><stop offset="1" stop-color="#737c81"/></linearGradient>
 <linearGradient id="${G.cu}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3a06b"/><stop offset=".5" stop-color="#b8692f"/><stop offset="1" stop-color="#8a4a1e"/></linearGradient>
 <filter id="${G.sh}" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="2" dy="3" stdDeviation="2.5" flood-opacity=".22"/></filter></defs>`;return G};
/* a wire: gray jacket under the phase color; dead wires are dashed and faded */
TPK.wire=(d,col,on=true,w=4)=>`<path d="${d}" fill="none" stroke="#7c8489" stroke-width="${w+2.5}" stroke-linecap="round" stroke-linejoin="round" opacity="${on?1:.35}"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${on?"":' stroke-dasharray="6 5" opacity=".6"'}/>`;
TPK.screw=(x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#c7ccd0" stroke="#5d666c" stroke-width="1.2"/><path d="M${x-r*.6} ${y} H${x+r*.6} M${x} ${y-r*.6} V${y+r*.6}" stroke="#5d666c" stroke-width="1.1"/>`;
TPK.sm=(x,y,t,o={})=>`<text x="${x}" y="${y}" style="font-family:var(--mono);font-size:${o.size||10}px;fill:${o.fill||"#1d2327"};text-anchor:${o.a||"middle"}">${t}</text>`;
/* contactor, front view. x,y = top left, 120 x 150. pole x's at x+24, x+60, x+96. o: {tag, on, aux:"NO"|"NC"|"NO+NC", lbl} */
TPK.cx=x=>[x+24,x+60,x+96];
TPK.contactor=(G,x,y,o={})=>{const xs=TPK.cx(x);let s=`<g filter="url(#${G.sh})"><rect x="${x}" y="${y}" width="120" height="150" rx="7" fill="url(#${G.pl})" stroke="#6b7378" stroke-width="1.4"/></g>`;
 s+=`<rect x="${x+6}" y="${y+4}" width="108" height="22" rx="3" fill="#dfe3e6" stroke="#9aa2a7"/><rect x="${x+6}" y="${y+124}" width="108" height="22" rx="3" fill="#dfe3e6" stroke="#9aa2a7"/>`;
 xs.forEach((cx,k)=>{s+=TPK.screw(cx,y+15)+TPK.screw(cx,y+135)+TPK.sm(cx,y+38,["1/L1","3/L2","5/L3"][k],{size:9})+TPK.sm(cx,y+119,["2/T1","4/T2","6/T3"][k],{size:9})});
 const on=!!o.on;s+=`<rect x="${x+34}" y="${y+50}" width="52" height="46" rx="4" fill="#2b3135" stroke="#15191c"/><rect x="${x+42}" y="${y+(on?66:54)}" width="36" height="22" rx="3" fill="${on?"#3fae5a":"#c9ced1"}" stroke="#15191c"/>`+TPK.sm(x+60,y+(on?81:69),on?"I":"O",{size:13,fill:on?"#fff":"#1d2327"});
 s+=TPK.screw(x+15,y+58,4.5)+TPK.sm(x+15,y+49,"A1",{size:8})+TPK.screw(x+15,y+92,4.5)+TPK.sm(x+15,y+108,"A2",{size:8});
 if(o.aux){s+=`<rect x="${x+92}" y="${y+48}" width="24" height="50" rx="3" fill="#e8ebed" stroke="#8a9297"/>`+TPK.sm(x+104,y+60,o.aux==="NC"?"21":"13",{size:8})+TPK.sm(x+104,y+93,o.aux==="NC"?"22":"14",{size:8})+TPK.sm(x+104,y+77,o.aux==="NO+NC"?"NO":o.aux,{size:8,fill:"#5d666c"})}
 if(o.tag)s+=K.lbl(o.tagA==="start"?x+130:x-10,y+80,o.tag,{a:o.tagA||"end",size:15,fill:on?"var(--ok)":"var(--ink)"});
 return s};
/* overload relay, front view, 120 x 100, mounted under a contactor. o: {fla, lo, hi, cls, trip} */
TPK.olr=(G,x,y,o={})=>{const xs=TPK.cx(x);let s=`<g filter="url(#${G.sh})"><rect x="${x}" y="${y}" width="120" height="100" rx="6" fill="url(#${G.pd})" stroke="#2f363a" stroke-width="1.4"/></g>`;
 s+=`<rect x="${x+6}" y="${y+76}" width="108" height="20" rx="3" fill="#59636a" stroke="#2f363a"/>`;xs.forEach(cx=>{s+=TPK.screw(cx,y+86)});
 const lo=o.lo??(o.fla?o.fla*0.7:9),hi=o.hi??(o.fla?o.fla*1.3:16),f=o.fla?Math.max(0,Math.min(1,(o.fla-lo)/(hi-lo))):0.5,a=(-130+260*f)*Math.PI/180,dx=x+34,dy=y+36;
 s+=`<circle cx="${dx}" cy="${dy}" r="20" fill="#f1f3f4" stroke="#20262a" stroke-width="1.5"/>`;for(let i=0;i<=6;i++){const b=(-130+260*i/6)*Math.PI/180;s+=`<path d="M${dx+Math.sin(b)*15} ${dy-Math.cos(b)*15} L${dx+Math.sin(b)*19} ${dy-Math.cos(b)*19}" stroke="#20262a" stroke-width="1"/>`}
 s+=`<path d="M${dx} ${dy} L${dx+Math.sin(a)*16} ${dy-Math.cos(a)*16}" stroke="#d62828" stroke-width="2.6" stroke-linecap="round"/><circle cx="${dx}" cy="${dy}" r="3" fill="#20262a"/>`;
 s+=`<text x="${dx}" y="${y+70}" style="font-family:var(--mono);font-size:9px;fill:#f1f3f4;text-anchor:middle">${K.f1(lo)}-${K.f1(hi)} A</text>`;
 s+=`<rect x="${x+62}" y="${y+12}" width="50" height="18" rx="3" fill="#20262a"/>`+[10,20,30].map((c,i)=>`<rect x="${x+64+i*16}" y="${y+14}" width="14" height="14" rx="2" fill="${o.cls===c?"#e8c51a":"#59636a"}"/><text x="${x+71+i*16}" y="${y+25}" style="font-family:var(--mono);font-size:8px;fill:${o.cls===c?"#1d2327":"#e2e6e9"};text-anchor:middle">${c}</text>`).join("");
 s+=`<text x="${x+87}" y="${y+41}" style="font-family:var(--mono);font-size:8px;fill:#e2e6e9;text-anchor:middle">CLASS</text>`;
 s+=`<circle cx="${x+75}" cy="${y+58}" r="8" fill="#2f6fd6" stroke="#15191c"/><text x="${x+75}" y="${y+73}" style="font-family:var(--mono);font-size:7px;fill:#e2e6e9;text-anchor:middle">RESET</text>`;
 s+=`<rect x="${x+92}" y="${y+48}" width="20" height="20" rx="2" fill="${o.trip?"#f08a24":"#20262a"}" stroke="#15191c"/><text x="${x+102}" y="${y+73}" style="font-family:var(--mono);font-size:7px;fill:#e2e6e9;text-anchor:middle">${o.trip?"TRIP":"95-96"}</text>`;
 return s};
/* TEFC motor, side view. x,y = top left of the frame, about 250 x 150 overall. o: {dir:1 CW | -1 CCW | 0, hot, lbl, leads:[on,on,on], cols} */
TPK.motor=(G,x,y,o={})=>{let s="";const w=200,h=110;
 s+=`<path d="M${x+24} ${y+h} l-8 26 h48 l-6 -26z M${x+w-50} ${y+h} l-6 26 h48 l-8 -26z" fill="#2a4057" stroke="#1d2b3a"/><rect x="${x}" y="${y+h+24}" width="${w+20}" height="6" rx="2" fill="#5d666c"/>`;
 s+=`<g filter="url(#${G.sh})"><path d="M${x-26} ${y+14} q-14 0 -14 14 v54 q0 14 14 14 h26 v-82z" fill="url(#${G.mt})" stroke="${TPK.SE}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#${G.mo})" stroke="#1d2b3a" stroke-width="1.4"/></g>`;
 for(let i=1;i<14;i++)s+=`<path d="M${x+i*w/14} ${y+3} V${y+h-3}" stroke="#1d2b3a" stroke-width="1.1" opacity=".45"/>`;
 for(let i=0;i<5;i++)s+=`<path d="M${x-34} ${y+26+i*12} h26" stroke="#4d555a" stroke-width="1.6"/>`;
 s+=`<rect x="${x+w}" y="${y+12}" width="18" height="86" rx="5" fill="url(#${G.mo})" stroke="#1d2b3a"/><rect x="${x+w+18}" y="${y+47}" width="44" height="16" rx="2" fill="url(#${G.mt})" stroke="${TPK.SE}"/><rect x="${x+w+40}" y="${y+51}" width="22" height="4" fill="#5d666c"/>`;
 s+=`<rect x="${x+70}" y="${y-30}" width="64" height="32" rx="4" fill="url(#${G.mo})" stroke="#1d2b3a"/><rect x="${x+82}" y="${y+50}" width="52" height="30" rx="2" fill="#d9dde0" stroke="#5d666c"/>`;
 s+=TPK.sm(x+108,y+62,o.np1||"3 PH",{size:8})+TPK.sm(x+108,y+74,o.np2||"60 HZ",{size:8});
 if(o.hot)s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#e0662a" opacity="${Math.min(.55,o.hot)}" class="lsPulse"/>`;
 if(o.dir){const cx=x+w+66,cy=y+55;const d=o.dir>0?`M${cx-6} ${cy-30} A30 30 0 0 1 ${cx+22} ${cy+20}`:`M${cx-6} ${cy+30} A30 30 0 0 0 ${cx+22} ${cy-20}`;s+=K.arrow(d,"var(--ok)",3)}
 if(o.lbl)s+=K.lbl(x+w/2,y+h+52,o.lbl,{size:14,fill:o.lblC});
 return s};
/* motor terminal box top, where the three leads land: returns the x of T1..T3 */
TPK.mT=x=>[x+84,x+102,x+120];
/* ---------- ladder symbols (control circuit). on = energized path ---------- */
TPK.lc=on=>on?TPK.LIVE:"var(--ink)";
TPK.seg=(x1,y,x2,on)=>`<path d="M${x1} ${y} H${x2}" stroke="${TPK.lc(on)}" stroke-width="${on?3:2}"/>`;
/* contact: kind "NO" | "NC"; closed = the contact passes power right now. 44 px wide starting at x */
TPK.ct=(x,y,kind,closed,lbl,on)=>{let s=`<path d="M${x} ${y} H${x+14} M${x+30} ${y} H${x+44} M${x+14} ${y-12} V${y+12} M${x+30} ${y-12} V${y+12}" stroke="${TPK.lc(on)}" stroke-width="2.4" fill="none"/>`;
 if(kind==="NC")s+=`<path d="M${x+10} ${y+12} L${x+34} ${y-12}" stroke="${TPK.lc(on)}" stroke-width="2"/>`;
 if(closed)s+=`<rect x="${x+16}" y="${y-10}" width="12" height="20" fill="${on?TPK.LIVE:"var(--ok)"}" opacity=".25"/>`;
 return s+(lbl?K.txt(x+22,y-18,lbl):"")};
/* pushbutton: kind "NO" (START) or "NC" (STOP) */
TPK.pb=(x,y,kind,closed,lbl,on)=>{const c=TPK.lc(on);const by=kind==="NO"?(closed?y:y-10):(closed?y+4:y+14);
 let s=`<path d="M${x} ${y} H${x+10} M${x+34} ${y} H${x+44}" stroke="${c}" stroke-width="2.4"/><circle cx="${x+10}" cy="${y}" r="3" fill="var(--paper)" stroke="${c}" stroke-width="2"/><circle cx="${x+34}" cy="${y}" r="3" fill="var(--paper)" stroke="${c}" stroke-width="2"/>`;
 s+=`<path d="M${x+6} ${by} H${x+38} M${x+22} ${by} V${by-14} M${x+15} ${by-14} H${x+29}" stroke="${c}" stroke-width="2.4"/>`;
 return s+(lbl?K.txt(x+22,y-32,lbl):"")};
TPK.coil=(x,y,lbl,on)=>`<circle cx="${x+18}" cy="${y}" r="16" fill="${on?"rgba(214,40,40,.14)":"var(--paper)"}" stroke="${TPK.lc(on)}" stroke-width="2.6"/>${K.lbl(x+18,y+6,lbl,{size:15,fill:on?TPK.LIVE:"var(--ink)"})}`;
TPK.olc=(x,y,tripped,on)=>TPK.ct(x,y,"NC",!tripped,tripped?"OL OPEN":"OL 95-96",on)+`<path d="M${x+14} ${y+18} q4 -4 8 0 q4 4 8 0" stroke="${TPK.lc(on)}" fill="none" stroke-width="1.6"/>`;
TPK.rails=(xl,xr,y0,y1,on)=>`<path d="M${xl} ${y0} V${y1}" stroke="${on?TPK.LIVE:"var(--ink)"}" stroke-width="3.5"/><path d="M${xr} ${y0} V${y1}" stroke="var(--ink)" stroke-width="3.5"/>`+K.lbl(xl,y0-8,"X1",{size:13})+K.lbl(xr,y0-8,"X2",{size:13});
TPK.dot=(x,y,on)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="${TPK.lc(on)}"/>`;
/* ---------- overload trip math ----------
 Thermal model of the relay (cold start): t = tau x ln(m^2 / (m^2 - u^2)), m = current / dial setting, u = 1.15 ultimate trip.
 tau is set so the relay trips in exactly CLASS seconds at 600% of the dial (the trip class definition). */
TPK.U=1.15;
TPK.tau=cls=>cls/Math.log(36/(36-TPK.U*TPK.U));
TPK.trip=(m,cls)=>m<=TPK.U?Infinity:TPK.tau(cls)*Math.log(m*m/(m*m-TPK.U*TPK.U));
TPK.tFmt=t=>!isFinite(t)?"never":t<100?K.f1(t)+" s":t<3600?K.f1(t/60)+" min":K.f1(t/3600)+" h";
/* running current vs shaft load (fraction of rated hp): about 40% of FLA at no load, magnetizing current, rising to FLA at full load */
TPK.runI=(fla,load)=>fla*Math.sqrt(0.16+0.84*load*load);
/* ---------- NEMA design B torque and current vs speed (per unit of full load), speed as a fraction of synchronous ---------- */
TPK.TQ=[[0,1.6],[.2,1.5],[.4,1.42],[.6,1.6],[.75,1.95],[.85,2.3],[.9,2.2],[.93,1.85],[.965,1.0],[.985,.45],[1,0]];
TPK.IQ=[[0,6.0],[.3,5.8],[.5,5.5],[.7,5.0],[.85,4.1],[.9,3.5],[.93,2.7],[.965,1.0],[.985,.6],[1,.4]];
TPK.lerp=(T,x)=>{if(x<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(x<=T[i][0]){const a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return T[T.length-1][1]};
/* ---------- complex numbers and symmetrical components ---------- */
TPK.C=(re,im)=>({re,im});TPK.add=(a,b)=>TPK.C(a.re+b.re,a.im+b.im);TPK.mul=(a,b)=>TPK.C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
TPK.pol=(m,deg)=>TPK.C(m*Math.cos(deg*Math.PI/180),m*Math.sin(deg*Math.PI/180));TPK.abs=a=>Math.hypot(a.re,a.im);TPK.ang=a=>Math.atan2(a.im,a.re)*180/Math.PI;
TPK.A1=TPK.pol(1,120);TPK.A2=TPK.pol(1,240);
/* NEMA MG 1 unbalance: largest deviation from the average, divided by the average, x 100 */
TPK.nema=v=>{const avg=(v[0]+v[1]+v[2])/3;const dev=Math.max(...v.map(x=>Math.abs(x-avg)));return {avg,dev,pct:100*dev/avg}};
/* Engineering ToolBox / NEMA MG 1 derating factor vs % voltage unbalance */
TPK.DER=[[0,1],[.5,1],[1.5,.97],[2,.95],[2.5,.93],[3,.89],[3.5,.85],[4,.82],[4.5,.78],[5,.76]];
TPK.derate=p=>p>5?NaN:TPK.lerp(TPK.DER,p);
/* contactor with its overload relay plugged in underneath, drawn at scale sc. Returns {s, top:[x..], yTop, bot:[x..], yBot} in drawing units */
TPK.starter=(G,x,y,sc,o={})=>{let s=`<g transform="translate(${x} ${y}) scale(${sc})">`+TPK.contactor(G,0,0,{on:o.on,aux:o.aux||"NO",tag:o.tag,tagA:o.tagA});
 TPK.cx(0).forEach(cx=>{s+=`<rect x="${cx-4}" y="138" width="8" height="22" fill="url(#${G.cu})" stroke="#6b3a14" stroke-width=".8"/>`});
 s+=TPK.olr(G,0,154,{fla:o.dial,lo:o.lo,hi:o.hi,cls:o.cls,trip:o.trip})+`</g>`;
 return {s,top:TPK.cx(0).map(v=>x+v*sc),yTop:y+15*sc,bot:TPK.cx(0).map(v=>x+v*sc),yBot:y+240*sc}};
/* overload relay current ranges (A) like a catalog: pick the one that holds the dial setting */
TPK.RANGES=[[1.6,2.5],[2.5,4],[4,6.3],[5.5,8],[7,10],[9,13],[12,18],[16,24],[22,32],[28,40],[36,50]];
TPK.range=a=>TPK.RANGES.find(r=>a>=r[0]&&a<=r[1])||(a<1.6?TPK.RANGES[0]:TPK.RANGES[TPK.RANGES.length-1]);
