/* ============ Lesson: Friction rate and duct sizing (ACCA Manual D method) ============ */
(()=>{
const DEV=[["Supply registers",0.03],["Return grille",0.03],["Balancing dampers",0.03]];const DEVS=0.09;
const mdl=S=>{const asp=S.bsp-S.filt-S.coil-DEVS,tel=S.sup+S.ret+S.fit,fr=asp>0?asp*100/tel:0;
 const lim=S.isRet?700:900,dF=fr>0?AK.dFor(S.q,fr):99,dV=AK.dVel(S.q,lim),use=AK.up(Math.max(dF,S.isRet?dV:0)),byV=S.isRet&&AK.up(dV)>AK.up(dF);
 return {asp,tel,fr,lim,dF,dV,use,byV,v:AK.vel(S.q,use),fUse:AK.fric(S.q,use),wedge:fr<0.06?"below":fr>0.18?"above":"in"}};
const D0={bsp:0.70,filt:0.10,coil:0.20,sup:36,ret:13,fit:375,q:400,isRet:false};
const R0=mdl(D0);
/* static budget, vertical stacked bar. x,y top; h for the blower static */
const budget=(S,R,x,y,h,sh)=>{const sc=h/Math.max(0.3,S.bsp);let s=K.lbl(x,y-14,"STATIC BUDGET",{a:"start",size:13}),yy=y;
 const parts=[["Filter",S.filt,"#b9a578"],["Coil",S.coil,"#7f9fb5"],[sh?"Devices":"Grilles, registers, dampers",DEVS,"#a3a9ad"],[sh?"Left (ASP)":"Left for ducts (ASP)",Math.max(0,R.asp),"#2f8f3a"]];
 parts.forEach(([l,v,c])=>{const hh=v*sc;if(hh>0.5)s+=`<rect x="${x}" y="${yy}" width="56" height="${hh}" fill="${c}" opacity=".85" stroke="var(--paper)"/>`;
  if(hh>13)s+=K.txt(x+64,yy+hh/2+5,l+" "+v.toFixed(2),{a:"start",fill:l[0]==="L"?"#2f8f3a":undefined});yy+=hh});
 s+=`<path d="M${x-8} ${y} V${y+S.bsp*sc}" stroke="var(--ink)" stroke-width="1.5"/>`+`<text transform="translate(${x-14} ${y+S.bsp*sc/2}) rotate(-90)" class="lsG">blower ${S.bsp.toFixed(2)} in. at design CFM</text>`;
 if(R.asp<=0)s+=K.tag(x+28,y+S.bsp*sc+24,"NOTHING LEFT FOR DUCTS",{fill:"var(--bad)",a:"start"});
 return s};
/* Manual D friction rate chart: available static (x) vs total effective length (y), design wedge 0.06 to 0.18 */
const wedge=(R,o)=>{const X=[0,0.5],Y=[0,800];const x0=o.x,y0=o.y,w=o.w,h=o.h;const px=v=>x0+v/X[1]*w,py=v=>y0+h-v/Y[1]*h;
 let s=K.chart({x:x0,y:y0,w,h,X,Y,xt:[0,0.1,0.2,0.3,0.4,0.5],xf:v=>v.toFixed(1),yt:[0,200,400,600,800],xl:o.small?"ASP, in. w.c.":"available static pressure, in. w.c.",yl:"TEL, ft",title:o.title,
  series:[{f:a=>a*100/0.06,c:"#2f6fd6",w:2,lbl:o.small?"0.06":"0.06 PER 100 FT",lblAt:0.46,a:"end",dx:-4,dy:-6},{f:a=>a*100/0.18,c:"#c0392b",w:2,lbl:o.small?"0.18":"0.18 PER 100 FT",lblAt:0.48,a:"end",dx:-2,dy:-6}]});
 const poly=[];for(let a=0;a<=0.5;a+=0.01)poly.push([px(a),py(Math.min(800,a*100/0.06))]);for(let a=0.5;a>=0;a-=0.01)poly.push([px(a),py(a*100/0.18)]);
 s=`<path d="M${poly.map(p=>p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" L")}Z" fill="#2f8f3a" opacity=".12"/>`+s;
 if(!o.small)s+=K.lbl(px(0.40),py(330),"DESIGN AREA",{size:13,fill:"#2f8f3a"});
 if(R)s+=`<circle cx="${px(Math.max(0,Math.min(0.5,R.asp)))}" cy="${py(Math.min(800,R.tel))}" r="6" fill="var(--ink)" stroke="var(--paper)" stroke-width="2"/>`+(o.dot?K.tag(px(Math.max(0,R.asp))+14,py(Math.min(800,R.tel))+6,o.dot,{a:"start"}):"");
 return s};
/* duct plan for TEL */
const plan=()=>{let s="";
 const hot="var(--brass)";
 s+=`<rect x="300" y="250" width="70" height="90" rx="4" fill="url(#zCab)" stroke="${AK.SE}" stroke-width="1.4"/>`+K.lbl(335,360,"FURNACE",{size:12});
 s+=AK.duct("M335 250 V200 H690",22)+AK.duct("M420 200 V120",12)+AK.duct("M540 200 V280",12)+AK.duct("M640 200 V100 H700",12);
 s+=AK.duct("M300 300 H120 V120",22)+AK.duct("M120 120 V60",22);
 s+=`<rect x="98" y="44" width="44" height="18" fill="#e8ebe6" stroke="#555"/><rect x="101" y="47" width="38" height="12" fill="url(#zGrille)"/>`+K.lbl(150,52,"RETURN GRILLE",{a:"start",size:12});
 s+=`<rect x="690" y="90" width="12" height="22" fill="#e8ebe6" stroke="#555"/>`+K.lbl(704,74,"BOOT AND FARTHEST REGISTER",{a:"end",size:12});
 /* critical path highlight */
 s+=`<path d="M120 62 V300 H300 M335 250 V200 H640 V100 H696" fill="none" stroke="${hot}" stroke-width="3" stroke-dasharray="7 5"/>`;
 const fit=(x,y,t,a="start")=>`<circle cx="${x}" cy="${y}" r="5" fill="${hot}"/>`+K.tag(x+(a==="start"?10:-10),y+5,t,{a});
 s+=fit(120,300,"ELBOW","end")+fit(335,200,"PLENUM TAKEOFF","end")+fit(640,200,"","end")+K.tag(630,186,"BRANCH TAKEOFF",{a:"end"})+fit(640,100,"ELBOW","end")+`<circle cx="694" cy="101" r="5" fill="${hot}"/>`;
 s+=`<rect x="420" y="246" width="250" height="110" rx="8" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(436,270,"LONGEST PATH",{a:"start",size:13})+
  K.txt(436,294,"supply: 36 ft straight + 290 ft of fittings",{a:"start"})+K.txt(436,316,"return: 13 ft straight + 85 ft of fittings",{a:"start"})+K.lbl(436,344,"TEL = 326 + 98 = 424 FT",{a:"start",size:14,fill:"var(--brass)"});
 return s};
/* friction chart for round duct, like a duct calculator */
const ductulator=(fr,o={})=>{const sizes=[6,8,10,12,14,16,18];const x0=80,y0=40,w=560,h=270;
 const series=sizes.map((d,i)=>({f:q=>{const v=AK.fric(q,d);return v<=0.25?v:NaN},c:["#8e6fd8","#5c7fe0","#2f8fd6","#2f9f9a","#3a9a52","#9a8a2a","#b0602a"][i],w:2,lbl:d+" in.",lblAt:Math.min(1400,Math.pow(0.235/0.109136*Math.pow(d,5.02),1/1.9)),a:"end",dx:-6,dy:-2,n:200}));
 let s=K.chart({x:x0,y:y0,w,h,X:[0,1400],Y:[0,0.25],xt:[0,200,400,600,800,1000,1200,1400],yt:[0,0.05,0.1,0.15,0.2,0.25],yf:v=>v.toFixed(2),xl:"airflow, CFM",yl:"friction, in. per 100 ft",title:"ROUND METAL DUCT: FRICTION vs AIRFLOW",series,
  dots:(o.dots||[]).map((q,i)=>{const d=AK.up(AK.dFor(q,fr));return {x:q,y:fr,c:"var(--ink)",lbl:q+" CFM → "+d+" in.",a:q>900?"end":"start",dx:q>900?-10:8,dy:q>900?24:24+i*24}})});
 const Y=v=>y0+h-v/0.25*h;s+=`<path d="M${x0} ${Y(fr)} H${x0+w}" stroke="var(--brass)" stroke-width="2.4" stroke-dasharray="7 4"/>`+K.tag(x0+8,Y(fr)-12,"YOUR FRICTION RATE "+fr.toFixed(3),{a:"start",fill:"var(--brass)"});
 return s};
const xsec=(cx,cy,D,q,lim,lab)=>{const r=D*4.2,v=AK.vel(q,D),bad=v>lim;return `<circle cx="${cx}" cy="${cy}" r="${r+4}" fill="#3d4448"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#c3cacf"/><circle cx="${cx}" cy="${cy}" r="${r*0.82}" fill="#e3e7ea"/>`+
 K.lbl(cx,cy-r-34,lab,{size:13})+K.lbl(cx,cy-r-14,D+" IN. ROUND",{size:13})+`<text x="${cx}" y="${cy+6}" class="lsG" style="font-family:var(--mono);font-weight:600;font-size:16px;fill:${bad?"var(--bad)":"var(--ok)"}">${Math.round(v)} fpm</text>`+K.txt(cx,cy+r+26,bad?"over "+lim+" fpm: go bigger":"under "+lim+" fpm",{fill:bad?"var(--bad)":"var(--ok)"})};
const steps=[
 {t:"Start with what the blower has left",body:`<p>Manual D sizes ducts from the pressure the blower can spare for them. Start with the blower's static at the design airflow (from the blower table), then take away everything that isn't duct:</p><ul><li>the filter and the cooling coil (from their data sheets),</li><li>supply registers, the return grille and balancing dampers (often about 0.03 in. each).</li></ul><p>What's left is the <b>available static pressure</b> (ASP) for the duct runs themselves.</p><p class="lsKey">0.70 − 0.10 − 0.20 − 0.09 = 0.31 in. w.c. available</p>`,
  draw:()=>budget(D0,R0,120,40,300)+`<rect x="420" y="70" width="270" height="200" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(436,96,"THIS EXAMPLE",{a:"start",size:13})+
   [["Blower at 1200 CFM","0.70"],["Filter","− 0.10"],["Coil (wet)","− 0.20"],["Registers, grille, dampers","− 0.09"]].map(([a,b],i)=>K.txt(436,124+i*26,a,{a:"start"})+K.txt(674,124+i*26,b,{a:"end"})).join("")+`<path d="M436 220 H674" stroke="var(--muted)"/>`+K.lbl(436,248,"ASP",{a:"start",fill:"#2f8f3a"})+K.lbl(674,248,"0.31 IN.",{a:"end",fill:"#2f8f3a"})},
 {t:"Total effective length",body:`<p>Every fitting resists air like a length of straight duct. That length is its <b>equivalent length</b>. A well-chosen round elbow might count as 10 to 20 ft; a sharp mitered turn can count as 75 ft.</p><p>Find the path from the return grille, through the blower, to the farthest supply register that has the most straight duct plus fittings. That one path is the <b>total effective length</b> (TEL). Don't add up every duct in the house.</p><p>Fittings usually outweigh the straight duct many times over.</p>`,
  draw:plan},
 {t:"Friction rate = available static ÷ TEL",body:`<p>Spread the available static over the critical path. Per 100 ft of duct, that's the <b>friction rate</b>:</p><p class="lsKey">Friction rate = ASP × 100 ÷ TEL = 0.31 × 100 ÷ 424 = 0.073 in. per 100 ft</p><p>Manual D's chart has a design area between about <b>0.06 and 0.18</b>. Below it, the ducts get huge or the blower is too weak: shorten the path, pick a lower-drop filter, or use a stronger blower. Above it, design at 0.18 anyway so the ducts don't get loud.</p><p>The old habit of assuming 0.10 undersizes the ducts whenever the real number is lower.</p>`,
  draw:()=>wedge(R0,{x:110,y:40,w:520,h:270,title:"MANUAL D FRICTION RATE CHART",dot:"0.31 IN., 424 FT: 0.073"})},
 {t:"Size each run at that friction rate",body:`<p>Now every section is sized with the same friction rate (the <b>equal friction</b> method). On a duct calculator, line the friction rate up with the airflow of each section and read the round size.</p><p>At 0.073 in. per 100 ft:</p><ul><li>a 150 CFM bedroom branch needs ${AK.up(AK.dFor(150,0.073))} in.,</li><li>a 400 CFM trunk section needs ${AK.up(AK.dFor(400,0.073))} in. (it works out to ${AK.dFor(400,0.073).toFixed(1)} in., round up),</li><li>the 1200 CFM main trunk needs ${AK.up(AK.dFor(1200,0.073))} in.</li></ul>`,
  math:`<p>Round galvanized duct, standard air (Engineering ToolBox): friction per 100 ft = 0.109136 × CFM<sup>1.9</sup> ÷ D<sup>5.02</sup>, D in inches.</p><p>Solve for D: D = (0.109136 × CFM<sup>1.9</sup> ÷ friction rate)<sup>1/5.02</sup>. For 400 CFM at 0.073: ${AK.dFor(400,0.073).toFixed(2)} in.</p><p>Flex duct has more friction than metal; a duct calculator has a separate scale for it, and it only works if it's pulled tight.</p>`,
  draw:()=>ductulator(0.073,{dots:[150,400,1200]})},
 {t:"Then check the velocity",body:`<p>Air that moves too fast is noisy. Manual D caps velocity at about <b>900 fpm for supply</b> ducts and <b>700 fpm for return</b> ducts.</p><p>Velocity = CFM ÷ area in square feet. The 1200 CFM trunk at 16 in. runs ${Math.round(AK.vel(1200,16))} fpm. Fine for supply. For the return, that's too fast: go to 18 in. (${Math.round(AK.vel(1200,18))} fpm).</p><p>When velocity forces a bigger duct, that section now has less resistance than planned. The balancing dampers take care of the difference.</p>`,
  draw:()=>xsec(190,200,16,1200,900,"SUPPLY TRUNK, 1200 CFM")+xsec(410,200,16,1200,700,"RETURN AT 16 IN.")+xsec(610,200,18,1200,700,"RETURN AT 18 IN.")+K.txt(360,360,"velocity (fpm) = CFM ÷ (π × D² ÷ 4 ÷ 144)")}];
const see=K.see({init:{...D0},
 sliders:[["bsp","Blower static at design CFM",0.4,0.9,0.05,v=>(+v).toFixed(2)+" in."],["filt","Filter drop",0.05,0.3,0.01,v=>(+v).toFixed(2)+" in."],["coil","Coil drop",0.1,0.4,0.01,v=>(+v).toFixed(2)+" in."],
  ["sup","Longest supply, straight duct",10,120,1,v=>v+" ft"],["ret","Longest return, straight duct",5,60,1,v=>v+" ft"],["fit","Fittings on that path",100,500,5,v=>v+" ft"],["q","Section to size",50,1400,10,v=>v+" CFM"]],
 checks:[["isRet","This section is return duct (700 fpm limit)"]],
 model:mdl,
 draw:(R,S)=>{let s=budget(S,R,74,46,280,true)+wedge(R,{x:320,y:46,w:170,h:150,small:true,title:"FRICTION RATE CHART"});
  const fr=R.fr;s+=K.lbl(320,250,"FRICTION RATE",{a:"start",size:13})+`<text x="320" y="282" style="font-family:var(--mono);font-weight:600;font-size:22px;fill:${R.wedge==="in"?"var(--ok)":"var(--bad)"}">${fr.toFixed(3)}</text>`+K.txt(320,304,"in. per 100 ft ("+(R.wedge==="in"?"in the design area":R.wedge+" the design area")+")",{a:"start"});
  const cx=620,cy=150,r=Math.min(64,R.use*2.9);s+=`<circle cx="${cx}" cy="${cy}" r="${r+4}" fill="#3d4448"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#c3cacf"/><circle cx="${cx}" cy="${cy}" r="${r*0.82}" fill="#e3e7ea"/>`+K.lbl(cx,cy+6,R.use+" IN.",{size:16});
  s+=K.lbl(cx,40,S.q+" CFM "+(S.isRet?"RETURN":"SUPPLY"),{size:13})+`<text x="${cx}" y="${cy+r+30}" class="lsG" style="font-family:var(--mono);font-size:15px;fill:${R.v>R.lim?"var(--bad)":"var(--ink)"}">${Math.round(R.v)} fpm</text>`+K.txt(cx,cy+r+52,R.byV?"upsized for velocity":"sized by friction");
  return s},
 reads:R=>[["Available static",R.asp.toFixed(2)+" in.",R.asp<=0],["TEL",R.tel+" ft"],["Friction rate",R.fr.toFixed(3),R.wedge!=="in"],["Size by friction",R.dF>40?"—":R.dF.toFixed(1)+" in."],["Size by velocity",R.dV.toFixed(1)+" in."],["Use",R.use+" in."],["Velocity",Math.round(R.v)+" fpm",R.v>R.lim],["Friction at that size",R.fUse.toFixed(3)]],
 note:R=>R.asp<=0?`<b class="bad">The filter, coil and devices use up all of the blower's static.</b>`:R.wedge==="below"?"Below 0.06: shorten the path, use a lower-drop filter or coil, or pick a stronger blower.":R.wedge==="above"?"Above 0.18: Manual D designs at 0.18 so the ducts aren't loud.":"In the design area. Velocity limit: "+R.lim+" fpm."});
const tasks=[
 K.goal({t:"Make the design fit on a 0.50 in. blower",intro:"The blower table only gives <b>0.50 in.</b> at design airflow. Keep the coil at <b>0.15 in. or more</b>. Get the friction rate into the design area (0.06 to 0.18).",
  check:(S,R)=>Math.abs(S.bsp-0.5)>0.001?"Set the blower static to 0.50 in.":S.coil<0.15?"A real wet coil drops at least 0.15 in. here.":R.wedge==="in"?true:R.asp<=0?"Nothing left for the ducts.":`Friction rate ${R.fr.toFixed(3)}. Lower the filter drop or shorten the path (fittings are the big number).`,
  ok:(S,R)=>`${R.asp.toFixed(2)} in. over ${R.tel} ft: ${R.fr.toFixed(3)} in. per 100 ft. You got there with ${S.filt.toFixed(2)} in. of filter and ${S.fit} ft of fittings.`}),
 K.goal({t:"Size the main return",intro:"Back to the worked example (0.70 blower, 0.10 filter, 0.20 coil, 36 + 13 ft straight, 375 ft of fittings). Size the <b>1200 CFM return trunk</b>.",
  check:(S,R)=>Math.abs(R.fr-0.073)>0.002?"Put the example back (Reset does it).":S.q!==1200?"Set the section to 1200 CFM.":!S.isRet?"It's return duct: tick the return box so the 700 fpm limit applies.":true,
  ok:(S,R)=>`Friction says ${AK.up(R.dF)} in., but that's ${Math.round(AK.vel(1200,AK.up(R.dF)))} fpm. The velocity limit makes it ${R.use} in. (${Math.round(R.v)} fpm).`}),
 K.caseTask({t:"Service call: the back bedroom never cools",intro:"New house. Bed 3 is at the end of a long flex run. The installer sized every branch at the old 0.10 friction rate. The real design numbers are below.",
  state:{bsp:0.5,filt:0.12,coil:0.2,sup:70,ret:20,fit:330,q:150,isRet:false},model:mdl,draw:(R,S)=>wedge(R,{x:110,y:40,w:520,h:270,title:"WHERE THIS HOUSE SITS",dot:"ASP "+R.asp.toFixed(2)+", TEL "+R.tel+" FT"}),
  reads:R=>[["Available static",R.asp.toFixed(2)+" in."],["TEL",R.tel+" ft"],["Real friction rate",R.fr.toFixed(3),true],["Bed 3 at 0.10",AK.up(AK.dFor(150,0.10))+" in."],["Bed 3 at real rate",AK.up(AK.dFor(150,R.fr))+" in."]],
  causes:[["fr","Ducts sized at an assumed 0.10 when the real friction rate is much lower"],["vel","Supply velocity over 900 fpm"],["blower","Blower too big"],["ret","Return velocity too low"]],ans:"fr",
  why:"Only 0.09 in. is left for 420 ft of path: about 0.02 per 100 ft, a fifth of what the installer assumed. Every branch is too small, and the longest one starves first. This design is below Manual D's area: fix the path (fewer fittings, a more central air handler), the filter, or the blower, then resize.",hint:"Work out the friction rate the house really has and compare with 0.10."})];
window.LESSON={id:"air-duct",sec:"Airflow",secHref:"/airflow/",title:"Friction rate and duct sizing",lead:"How Manual D turns the blower's spare static and the longest duct path into a friction rate, and how that sets each duct size and velocity.",
 steps,see,tryIntro:"Two designs in See it, then a service call.",tasks,
 job:K.job({read:["<b>Blower table</b>: external static at design airflow on the tap you'll use.","<b>Pressure drops</b> of the filter and coil from their data sheets (wet coil for cooling).","<b>Longest supply and return</b> lengths and every fitting on that path."],
  table:[["Item","Typical value"],["Most residential blowers","Rated 0.5 in. TESP (some 0.7 to 0.8)"],["Supply registers, return grille, balancing dampers","Often about 0.03 in. each"],["Manual D design area","About 0.06 to 0.18 in. per 100 ft"],["Supply velocity limit","900 fpm"],["Return velocity limit","700 fpm"]],tableT:"Numbers to know",
  steps:["Read the blower's static at design CFM; subtract filter, coil and device drops: ASP.","Trace the longest path (return grille to farthest register). Add straight lengths and fitting equivalent lengths: TEL.","Friction rate = ASP × 100 ÷ TEL. Check it's in the design area.","Size every section at that friction rate from its CFM.","Check velocity; upsize any section over 900 fpm supply or 700 fpm return.","Install balancing dampers on the branches and balance at start-up."],stepsT:"Manual D in six steps",
  safety:["Support flex duct every 4 to 5 ft and pull it tight; sagging flex has many times the friction of what was designed.","Seal every joint with mastic or listed tape; leaks change what each room gets."],
  mistakes:["Assuming a 0.10 friction rate instead of calculating it.","Adding up all the ducts in the house instead of the single longest path.","Forgetting the fittings: they're usually most of the TEL.","Sizing a return by friction alone and ending up with a whistling return grille."]}),
 sources:[["The Engineering Mindset: Ductwork sizing, calculation and design for efficiency","https://theengineeringmindset.com/ductwork-sizing-calculation-and-design-for-efficiency/"],["Energy Vanguard: Duct design 4, calculating friction rate (0.31 in. over 424 ft = 0.073)","https://www.energyvanguard.com/blog/duct-design-4-calculating-friction-rate/"],["Energy Vanguard: Duct design 3, total effective length","https://energyvanguard.com/blog/duct-design-3-total-effective-length"],["Energy Vanguard: Duct design 5, sizing the ducts (900 / 700 fpm)","https://energyvanguard.com/blog/duct-design-5-sizing-ducts"],["HVAC School: The friction rate chart and what it means","https://www.hvacrschool.com/the-friction-rate-chart-and-what-it-means"],["Engineering ToolBox: Duct friction pressure loss","https://engineeringtoolbox.com/duct-friction-pressure-loss-d_444.html"]]};
})();
