/* ============ Lesson: Sizing gas pipe (longest length method, IFGC Table 402.4(2)) ============ */
(()=>{
const SUP=7.0;
/* one-line plan used by several steps: meter, main with tees A and B, branches to furnace, water heater, range */
const SEG={ma:20,ab:15,br:25,af:8,bw:6};
const plan=(o={})=>{let s=CK.floor(352);
 const M=58,A=270,B=450,E=640,Y=130;
 s+=CK.meter(14,186,{s:0.95,ang:120});s+=CK.pipe(`M${M+46} 186 V${Y} H${E} V246`,9);
 s+=CK.pipe(`M${A} ${Y} V230`,8)+CK.pipe(`M${B} ${Y} V250`,8)+CK.fit(A,Y)+CK.fit(B,Y)+CK.fit(E,Y);
 s+=CK.furnace(A-40,232,{w:80,h:118,ind:false,hood:false})+CK.wh(B-24,252,{w:48,h:98,hood:false});
 s+=rBox(E-36,262,72,88,12,"white",{r:3})+`<rect x="${E-28}" y="290" width="56" height="40" rx="3" fill="#20262b"/>`+CK.L(E,284,"RANGE",{size:11,fill:"#2a3034"})+CK.pipe(`M${E} 246 V262`,6);
 const hl=o.hl?`stroke="#e0a21a" stroke-width="18" stroke-opacity=".35" fill="none" stroke-linejoin="round"`:"";
 if(o.hl)s=`<path d="M${M+46} 186 V${Y} H${E} V262" ${hl}/>`+s;
 const lenT=(x,y,t,c)=>CK.L(x,y,t,{size:12,fill:c||"var(--muted)"});
 s+=lenT((M+46+A)/2,Y-14,SEG.ma+" FT")+lenT((A+B)/2,Y-14,SEG.ab+" FT")+lenT((B+E)/2,Y-14,SEG.br+" FT")+lenT(A-36,Y+56,SEG.af+" FT",null)+lenT(B-22,Y+64,SEG.bw+" FT");
 s+=CK.L(A,Y+5-26-20,"A",{size:14})+CK.L(B,Y-40,"B",{size:14});
 if(o.loads){s+=CK.L(A+46,214,"100 CFH",{a:"start",size:12})+CK.L(B+34,236,"40 CFH",{a:"start",size:12})+CK.L(E-8,236,"65 CFH",{a:"end",size:12})}
 if(o.sizes){const t=(x,y,a,b)=>`<rect x="${x}" y="${y-15}" width="96" height="40" rx="5" fill="var(--paper)" stroke="var(--panel-edge)" opacity=".95"/>`+CK.L(x+48,y,a,{size:12})+CK.L(x+48,y+18,b,{size:12,fill:"#2f8f3a"});
  s+=t(140,74,"205 CFH","1 IN.")+t(312,74,"105 CFH","3/4 IN.")+t(498,74,"65 CFH","1/2 IN.")+t(A+14,160,"100 CFH","3/4 IN.")+t(B+18,184,"40 CFH","1/2 IN.")}
 return s};
/* pressure along a pipe: meter to appliance */
const dropScene=()=>{let s=CK.floor(352)+CK.meter(20,150,{s:0.9,ang:60})+CK.pipe("M105 150 V110 H560 V196",10)+CK.fit(560,110);
 s+=CK.furnace(510,198,{w:100,h:152,hood:false});
 s+=CK.mano(140,182,"7.0","AT THE METER")+CK.mano(390,182,"6.5","AT THE FURNACE")+rHose("M188 182 C188 150 120 140 120 116","#2a2f33",3)+rHose("M438 182 C438 150 520 160 528 230","#2a2f33",3);
 s+=CK.arr("M240 92 H420",CK.GAS)+CK.L(330,80,"FRICTION USES UP PRESSURE",{size:12});
 s+=`<rect x="220" y="270" width="290" height="64" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>`+CK.L(365,294,"DESIGN DROP 0.5 IN. W.C.",{size:13})+K.txt(365,320,"7.0 supply − 0.5 = 6.5 at the appliance");
 return s};
const btuScene=()=>{let s=`<rect x="40" y="70" width="230" height="200" rx="8" fill="#e9e3cf" stroke="#8c6a1c"/>`+`<text x="155" y="104" class="lsGn" style="font-size:14px">RATING PLATE</text><text x="155" y="136" class="lsGn" style="font-size:13px">INPUT 80,000 BTU/HR</text><text x="155" y="162" class="lsGn" style="font-size:13px">OUTPUT 64,000 BTU/HR</text><text x="155" y="188" class="lsGn" style="font-size:13px">NATURAL GAS</text><text x="155" y="214" class="lsGn" style="font-size:13px">MANIFOLD 3.5 IN. W.C.</text>`+CK.L(155,300,"SIZE FROM INPUT, NOT OUTPUT",{size:13,fill:"var(--bad)"});
 const box=(y,t,f,r,c)=>`<rect x="330" y="${y}" width="350" height="110" rx="8" fill="var(--paper)" stroke="${c}" stroke-width="2"/>`+CK.L(350,y+28,t,{a:"start",fill:c})+`<text x="505" y="${y+66}" class="lsBig" style="font-size:22px">${f}</text>`+K.txt(505,y+94,r);
 s+=box(50,"NATURAL GAS, ABOUT 1,000 BTU/FT³","80,000 ÷ 1,000 = 80 CFH","what the pipe table lists","#2f6fd6")+box(190,"PROPANE, ABOUT 2,500 BTU/FT³","80,000 ÷ 2,500 = 32 CFH","propane tables list Btu/h instead","#9a6f1f");
 s+=CK.arr("M272 130 H322","var(--muted)")+CK.arr("M272 220 C300 230 300 245 322 245","var(--muted)");return s};
const tableScene=(o={})=>{const rows=[4,5,6,7],cols=[0,1,2,3,4],X0=50,Y0=60,cw=103,rh=46;let s=`<rect x="${X0}" y="${Y0}" width="${cw*(cols.length+1)}" height="${rh*(rows.length+1)}" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
 s+=CK.L(X0+cw/2,Y0+29,"LENGTH",{size:12});cols.forEach((c,j)=>s+=CK.L(X0+cw*(j+1.5),Y0+29,CK.nps(CK.SIZES[c]),{size:13}));
 rows.forEach((r,i)=>{const y=Y0+rh*(i+1);const on=r===o.row;s+=`<path d="M${X0} ${y} H${X0+cw*(cols.length+1)}" stroke="var(--panel-edge)"/>`;if(on)s+=`<rect x="${X0+2}" y="${y+2}" width="${cw*(cols.length+1)-4}" height="${rh-4}" fill="#e0a21a" opacity=".22"/>`;
  s+=K.txt(X0+cw/2,y+29,CK.LENS[r]+" ft");cols.forEach((c,j)=>{const hit=on&&c===o.col;if(hit)s+=`<rect x="${X0+cw*(j+1)+8}" y="${y+6}" width="${cw-16}" height="${rh-12}" rx="5" fill="none" stroke="#2f8f3a" stroke-width="3"/>`;s+=`<text x="${X0+cw*(j+1.5)}" y="${y+29}" class="lsG" style="${hit?"fill:#2f8f3a;font-weight:600":on?"fill:var(--ink)":""}">${CK.TAB[r][c].toLocaleString("en-US")}</text>`})});
 s+=K.txt(360,Y0+rh*5+30,"Capacity in CFH: Schedule 40, natural gas, 0.5 in. w.c. drop, specific gravity 0.60 (IFGC Table 402.4(2), part)");
 if(o.note)s+=CK.L(360,30,o.note,{size:13,fill:"#2f8f3a"});return s};
const curve=()=>{const pts=[];for(let q=0;q<=260;q+=5)pts.push([q,CK.drop(q,0.75,60)]);
 return K.chart({x:90,y:40,w:560,h:260,X:[0,260],Y:[0,3],xt:[0,50,100,150,200,250],yt:[0,0.5,1,1.5,2,2.5,3],yf:v=>v.toFixed(1),xl:"gas flow, CFH",yl:"pressure drop, in. w.c.",title:"3/4 IN. BLACK IRON, 60 FT",
  bands:[{y0:0,y1:0.5,c:"#2f8f3a",lbl:"WITHIN THE 0.5 IN. DESIGN DROP"}],series:[{pts,c:"#c0392b",lbl:"DROP",lblAt:230,dy:-8}],
  dots:[{x:137,y:0.5,c:"#2f8f3a",lbl:"137 CFH: TABLE VALUE",a:"start",dx:12,dy:24},{x:274/2*1.5,y:CK.drop(205.5,0.75,60),c:"#c0392b",lbl:"1.5 × FLOW: 2.1 × DROP",a:"end",dx:-12,dy:-8}]})};
const steps=[
 {t:"Pipe size decides how much pressure is left",
  body:`<p>Gas leaves the meter at about <b>7 in. w.c.</b> (inches of water column). As it flows down the pipe, friction uses some of that pressure up. More flow, a longer pipe or a smaller pipe means a bigger <b>pressure drop</b>.</p><p>Each appliance needs a minimum <b>inlet pressure</b> while it fires, often 4.5 to 5 in. w.c. on natural gas. The code tables are built so the drop from meter to appliance is no more than <b>0.5 in. w.c.</b> at full load.</p>`,
  draw:dropScene},
 {t:"Turn Btu/h into cubic feet per hour",
  body:`<p>Pipe tables list how much gas a pipe carries, in <b>cubic feet per hour (CFH)</b>. Appliances are rated in <b>Btu/h input</b>. Divide by the gas's <b>heating value</b>:</p><ul><li>Natural gas: about <b>1,000 Btu/ft³</b> (your utility publishes the real number, often 1,000 to 1,050).</li><li>Propane: about <b>2,500 Btu/ft³</b>, so the same appliance needs far less gas.</li></ul><p>Use the <b>input</b> on the rating plate, not the output. Add every appliance on that pipe, including ones planned for later.</p>`,
  math:`<p>CFH = Btu/h input ÷ heating value (Btu/ft³)</p><p>Furnace 100,000 + water heater 40,000 + range 65,000 = 205,000 Btu/h = 205 CFH at 1,000 Btu/ft³.</p>`,
  draw:btuScene},
 {t:"Find the longest length",
  body:`<p>The <b>longest length method</b> (IFGC 402.4.1, NFPA 54) uses one length for the whole system: from the <b>meter outlet to the farthest appliance</b>.</p><p>Here that's meter to range: 20 + 15 + 25 = <b>60 ft</b>. The furnace branch is shorter, but you still size it with the 60 ft row. That's the method's safety margin.</p><p>If your length falls between rows, go <b>up</b> to the next longer row.</p>`,
  draw:()=>plan({hl:true})+`<rect x="480" y="20" width="220" height="34" rx="6" fill="var(--paper)" stroke="#e0a21a"/>`+CK.L(590,43,"LONGEST RUN 60 FT",{size:14})},
 {t:"Read the table",
  body:`<p>Go to the <b>60 ft row</b>. Read across until you find the first number <b>at least as big</b> as the load on that section.</p><p>The pipe from the meter to tee A carries everything: <b>205 CFH</b>. At 60 ft, 3/4 in. carries only 137. <b>1 in.</b> carries 257, so the first section is 1 in.</p><p>The table here is for Schedule 40 black iron with natural gas under 2 psi and a 0.5 in. drop. CSST, copper, propane and 2 psi systems each have their own tables.</p>`,
  draw:()=>tableScene({row:5,col:2,note:"205 CFH AT 60 FT → 1 IN. (257 CFH)"})},
 {t:"Size every section with its own load",
  body:`<p>Work outward from the meter. Each section carries only the appliances <b>downstream</b> of it, but every section uses the same 60 ft row:</p><ul><li>Meter to A: 205 CFH → <b>1 in.</b></li><li>A to B: 105 CFH → <b>3/4 in.</b></li><li>B to range: 65 CFH → <b>1/2 in.</b> (exactly 65)</li><li>Furnace branch: 100 CFH → <b>3/4 in.</b></li><li>Water heater branch: 40 CFH → <b>1/2 in.</b></li></ul>`,
  draw:()=>plan({sizes:true,loads:false})},
 {t:"Undersized pipe starves at full fire",
  body:`<p>Drop doesn't grow in a straight line with flow. It goes up about with the <b>1.85 power</b>: 1.5 times the gas gives about 2.1 times the drop, and double the gas about 3.6 times.</p><p>That's why an undersized system works with one appliance on and starves when everything fires together. The classic case: a 199,000 Btu/h tankless heater put on the old tank heater's pipe.</p>`,
  math:`<p>IFGC 402.4 low-pressure equation: Q = 2313 × D<sup>2.623</sup> × (ΔH ÷ (Cr × L))<sup>0.541</sup></p><p>Q in CFH, D inside diameter in inches, ΔH drop in in. w.c., L in ft, Cr = 0.6094 for natural gas. For 1 in. pipe (1.049 in. ID), 40 ft and 0.5 in.: Q = 320 CFH, the same as the table.</p>`,
  draw:curve}];
const model=S=>{const q=(S.furn+S.wh+S.oth)*1000/S.hv,d=CK.SIZES[S.size],row=CK.row(S.len),cap=CK.capT(d,S.len),need=CK.need(q,S.len),dp=CK.drop(q,d,S.len);return {q,d,row,rowL:CK.LENS[row],cap,need,dp,pend:SUP-dp,ok:cap>=q}};
const seeDraw=(R,S,o={})=>{let s=CK.floor(352)+CK.meter(14,212,{s:1.05,ang:(S.furn+S.wh+S.oth)*1.3});s+=CK.pipe("M114 212 V120 H662 V250",Math.max(5,R.d*9));
 s+=CK.pipe("M490 120 V196 M583 120 V216",7)+CK.fit(490,120)+CK.fit(583,120)+CK.fit(662,120);
 s+=CK.furnace(450,198,{w:80,h:152,hood:false,fire:S.furn>0})+CK.wh(560,218,{w:46,h:132,hood:false,fire:S.wh>0})+rBox(636,250,52,100,10,"white",{r:3})+CK.L(662,276,"OTHER",{size:10,fill:"#2a3034"});
 s+=CK.L(300,104,CK.nps(R.d)+" MAIN, "+S.len+" FT",{size:14,fill:R.ok?"var(--ink)":"var(--bad)"});
 s+=CK.mano(170,196,SUP.toFixed(1),"METER OUTLET")+CK.mano(320,196,o.end||K.f2(R.pend),"FARTHEST APPLIANCE",{});if(o.panel===false)return s;
s+=`<rect x="80" y="20" width="420" height="56" rx="6" fill="#16201a"/><text x="96" y="44" font-family="IBM Plex Mono,monospace" font-size="13" fill="#bfe8c4">Load ${K.f0(R.q)} CFH   Table row ${R.rowL} ft</text><text x="96" y="64" font-family="IBM Plex Mono,monospace" font-size="13" fill="${R.ok?"#bfe8c4":"#ff8a7a"}">${CK.nps(R.d)} carries ${R.cap} CFH: ${R.ok?"OK":"TOO SMALL"}</text>`;
 return s};
const see=K.see({init:{furn:80,wh:40,oth:0,len:40,size:2,hv:1000},
 sliders:[["furn","Furnace input",0,140,10,v=>v?v+",000 Btu/h":"off"],["wh","Water heater input",0,200,5,v=>v?v+",000 Btu/h":"off"],["oth","Range, dryer, other",0,120,5,v=>v?v+",000 Btu/h":"none"],["len","Longest length",10,150,5,v=>v+" ft"],["size","Main pipe size",0,5,1,v=>CK.nps(CK.SIZES[v])],["hv","Heating value",950,1100,10,v=>v.toLocaleString("en-US")+" Btu/ft³"]],
 model,draw:seeDraw,
 reads:R=>[["Total load",K.f0(R.q)+" CFH"],["Table row",R.rowL+" ft"],["Chosen size carries",R.cap+" CFH",!R.ok],["Table says use",R.need?CK.nps(R.need):"over 2 in."],["Drop at this length",K.f2(R.dp)+" in. w.c.",R.dp>0.5],["At farthest appliance",K.f2(R.pend)+" in. w.c.",R.pend<6.5]],
 note:(R,S)=>R.ok?(R.dp<0.5-0.02&&S.len<R.rowL?`Passes. The real drop is a little under 0.5 in. because ${S.len} ft is shorter than the ${R.rowL} ft row you had to use.`:"Passes: the drop stays within the 0.5 in. design."):`Too small: ${K.f0(R.q)} CFH needs ${R.need?CK.nps(R.need):"more than 2 in."} at ${R.rowL} ft. With everything firing, ${K.f2(R.dp)} in. is lost in the main alone.`,
 log:[["Load",R=>K.f0(R.q)],["Length",(R,S)=>S.len],["Size",R=>CK.nps(R.d)],["Drop",R=>K.f2(R.dp)]]});
/* service call: added appliances on an old 3/4 in. main */
const cs={len:50,d:0.75};const caseM=S=>{const qA=120,qB=207;return {alone:SUP-0.03-CK.drop(65,0.75,50)-0.1,all:SUP-0.06-CK.drop(qB,0.75,50)-0.1,qA,qB}};
const tasks=[
 K.goal({t:"Add a tankless heater",intro:"Heating value <b>1,000</b>. Furnace <b>100,000</b>, tankless water heater <b>200,000</b>, nothing else, longest length <b>60 ft</b>. Pick the smallest main that the table allows.",
  check:(S,R)=>S.hv!==1000?"Set the heating value to 1,000 Btu/ft³.":S.furn!==100||S.wh!==200||S.oth!==0?"Set the loads: 100, 200 and 0.":S.len!==60?"Set the length to 60 ft.":!R.ok?`${CK.nps(R.d)} carries only ${R.cap} CFH at 60 ft. Go bigger.`:R.need!==R.d?"That works, but a smaller size also passes. Use the smallest one.":true,
  ok:(S,R)=>`300 CFH at 60 ft: 1 in. carries 257, so ${CK.nps(R.d)} (${R.cap} CFH). A ${CK.nps(0.75)} main that served the old tank heater would carry only 137.`}),
 K.goal({t:"How far can 3/4 in. go?",intro:"Heating value <b>1,000</b>. Furnace <b>80,000</b> and water heater <b>40,000</b>, nothing else, on a <b>3/4 in.</b> main. Find the <b>longest</b> length (a table row) that still passes.",
  check:(S,R)=>S.hv!==1000?"Set the heating value to 1,000 Btu/ft³.":S.furn!==80||S.wh!==40||S.oth!==0?"Set the loads: 80, 40 and 0.":S.size!==1?"Set the main to 3/4 in.":!R.ok?`${R.cap} CFH at ${R.rowL} ft is less than 120. Shorter.`:CK.capT(0.75,R.rowL+1)>=120?"It passes, but it can go farther. Try the next row.":true,
  ok:()=>"70 ft (126 CFH). At 80 ft it carries only 117, under the 120 CFH load."}),
 K.caseTask({t:"Service call: weak range flames since the remodel",intro:"A new 65,000 Btu/h range and a 22,000 dryer were teed onto the old 3/4 in. main (50 ft longest run) that already fed an 80,000 furnace and a 40,000 water heater.",
  state:{},model:caseM,draw:R=>{const S={furn:80,wh:40,oth:87,len:50,size:1,hv:1000};return seeDraw(model(S),S,{panel:false,end:K.f1(R.all)})},
  reads:R=>[["Static at range",SUP.toFixed(1)+" in. w.c."],["Range alone, firing",K.f1(R.alone)+" in. w.c."],["Everything firing",K.f1(R.all)+" in. w.c.",true],["Total load",R.qB+" CFH"]],
  actions:[["Read pressure at the meter outlet, all firing",()=>"6.9 in. w.c.: the service regulator holds fine."],["Check the range's shutoff valve",()=>"Fully open, handle in line with the pipe."]],
  causes:[["main","Main undersized for the added load"],["reg","Service regulator drooping"],["valve","Range shutoff partly closed"],["hv","Low heating value gas"]],ans:"main",
  why:"207 CFH on a 3/4 in. main at 50 ft, where the table allows 151. The meter outlet holds 6.9 in., so the loss is in the pipe, and only when everything runs together. Re-pipe the main to 1 in. (284 CFH at 50 ft).",
  hint:"The meter outlet holds steady and the range is fine when it fires alone. What do all the appliances share?"})];
window.LESSON={id:"comb-pipe",sec:"Combustion and gas",secHref:"/combustion/",title:"Sizing gas pipe",lead:"Turn appliance Btu/h into cubic feet per hour, measure the longest run, and read the code table so every appliance gets its pressure at full fire.",
 steps,see,tryIntro:"Two pipe jobs in See it, then a service call.",tasks,
 job:K.job({read:["<b>Rating plates</b>: input in Btu/h for every appliance, including planned ones.","<b>Heating value</b> from the utility (natural gas) or about 2,500 Btu/ft³ (propane).","<b>Longest length</b> from the meter outlet (or second-stage regulator) to the farthest outlet.","<b>Supply pressure and pipe material</b>, so you pick the right table."],
  table:[["Length","1/2 in.","3/4 in.","1 in.","1-1/4 in."],["20 ft","118","247","466","957"],["40 ft","81","170","320","657"],["60 ft","65","137","257","528"],["80 ft","56","117","220","452"],["100 ft","50","104","195","400"]],tableT:"Schedule 40 capacities, CFH (natural gas, 0.5 in. drop)",
  steps:["Add up the input of everything on the system and convert to CFH.","Measure the longest run; round up to the next table row.","Size each section for the load downstream of it, using that one row.","After installing, pressure test as the code requires, then leak check every joint.","Verify inlet pressure at the farthest appliance with everything firing."],stepsT:"Sizing a system",
  safety:["Gas pipe is pressure tested before it's covered and before appliances are connected. Disconnect or isolate appliance controls from test pressure.","Leak check with soap solution or a gas detector, never a flame.","Install a sediment trap where the appliance needs one and a shutoff within reach of each appliance."],
  mistakes:["Using the branch length instead of the longest run.","Sizing from output instead of input Btu/h.","Using the natural gas table for propane, CSST or a 2 psi system.","Adding a tankless heater or generator without re-checking the main."]}),
 sources:[["The Engineering Mindset: ductwork sizing and the index run (same longest-run idea for air)","https://theengineeringmindset.com/ductwork-sizing-calculation-and-design-for-efficiency/"],["Seattle Fuel Gas Code ch. 4 (IFGC): 402.4 longest length method, sizing equation, Table 402.4(2)","https://www.seattle.gov/documents/departments/sdci/codes/fuelgascode/2012sfgcchapter4.pdf"],["Natural gas and propane fundamentals: heating value, specific gravity, supply pressures","https://open-exam-prep.com/study-guides/nc-hvac-contractor/forced-air-heating-and-furnaces/gas-combustion-fundamentals"]]};
})();
