/* ============ Lesson: Control transformers ============ */
(()=>{
const SUP=[120,208,240],VAS=[20,40,50,75],FUSE=3;
/* nameplate amps at 24 V: relay 0.3 A and contactor 0.5 A (ACHR News); gas valve about 0.5 A (typical, read the valve's label) */
const LOADS=[["con","Contactor coil","C",0.5],["r1","Relay 1","R1",0.3],["r2","Relay 2","R2",0.3],["gv","Gas valve","GV",0.5]];
/* small Class 2 transformers sag with load: about 15% above 24 V with nothing on, 24 V at full rated load */
const model=S=>{const sup=SUP[S.sup],tap=SUP[S.tap],va=VAS[S.va];const ratio=tap/24,k=sup/ratio;
 const A=LOADS.reduce((a,l)=>a+(S[l[0]]?l[3]:0),0);const need=A*24,Ir=va/24,frac=need/va;
 const fuse=S.short||A*(k/24)>FUSE||S.blown;/* a short (R to C, or R to the grounded cabinet) pulls far more than 3 A */
 const Vsec=k*(1.15-0.15*Math.min(frac,1.6));const Vout=fuse?0:Vsec;const I=fuse?0:A*Vout/24;
 const Ip=Vout*I/sup;/* ideal transformer: VA in = VA out (real ones lose a little more) */
 const pct=fuse?0:100*need/va,over=k>24*1.25,low=!fuse&&A>0&&Vout<21;
 return {sup,tap,va,ratio,k,A,need,Ir,frac,Vsec,Vout,I,Ip,pct,fuse,over,low,overload:!fuse&&need>va}};
const wireNut=(x,y)=>`<path d="M${x-6} ${y} l2 -12 h8 l2 12 z" fill="#f2b632" stroke="#8a6a00"/>`;
const scene=(R,S,o={})=>{let s="";const tx=[124,158,192,226],tl=["COM","120","208","240"];
 /* supply */
 s+=rBox(10,82,84,96,10,"paint")+LD.L(52,72,"SUPPLY",{size:12})+K.lcd(50,108,R.sup+" V",64)+`<circle cx="80" cy="140" r="5" fill="url(#r_brassV)"/><circle cx="80" cy="164" r="5" fill="url(#r_brassV)"/>`+LD.T(64,144,"L1",{size:10,fill:"#e9ecee",a:"end"})+LD.T(64,168,"L2",{size:10,fill:"#e9ecee",a:"end"});
 /* terminal strip for the primary taps */
 s+=rBox(110,50,130,22,6,"black");tx.forEach((x,i)=>{s+=`<circle cx="${x}" cy="61" r="5" fill="url(#r_brassV)"/>`+LD.T(x,44,tl[i],{size:10.5,fill:i===S.tap+1||i===0?"var(--ink)":"var(--muted)"})});
 const tapX=tx[S.tap+1];
 s+=LD.lead(`M80 164 C104 164 112 96 ${tx[0]} 64`,"#e9ecee",3.4)+LD.lead(`M80 140 C100 140 ${tapX-20} 96 ${tapX} 64`,"#1d2124",3.4);
 /* transformer */
 s+=LD.xfmrReal(110,120,{va:R.va});
 tx.forEach((x,i)=>{const used=i===0||i===S.tap+1;s+=LD.lead(`M${x} 66 C${x} 96 ${150+i*14} 100 ${150+i*14} 124`,["#1d2124","#e9ecee","#c0281c","#e8892b"][i],3);if(!used)s+=wireNut(x,61)});
 /* secondary leads to the 24 V ladder through the fuse */
 const X1=420,X2=690;
 s+=LD.lead(`M290 150 C340 150 330 74 352 74`,"#f2b632",3.4)+LD.lead(`M290 200 C340 200 330 372 380 372 H${X2}`,"#2f6fd6",3.4);
 s+=LD.sym({k:"fuse",closed:!R.fuse,on:!R.fuse&&R.Vsec>0,on2:!R.fuse,lbl:R.fuse?"3 A BLOWN":"3 A FUSE"},352,68,74);
 s+=`<path d="M420 74 V340" stroke="${R.Vout>0?LD.HOT:"var(--muted)"}" stroke-width="5"/><path d="M${X2} 60 V372" stroke="var(--ink)" stroke-width="5"/>`+LD.T(X1-6,52,"R",{size:12,fill:R.Vout>0?LD.HOT:"var(--muted)"})+LD.T(X2,52,"C",{size:12});
 s+=`<path d="M${X2} 372 h14 v6 m-9 0 h18 m-14 5 h10 m-6 5 h2" stroke="var(--ok)" stroke-width="2" fill="none"/>`+LD.T(X2-10,392,"C GROUNDED",{size:10,a:"end",fill:"var(--ok)"});
 LOADS.forEach((l,i)=>{const y=108+i*52,on=!!S[l[0]];s+=LD.rung({x1:X1,x2:X2,y,parts:[{k:"sw",lbl:l[1].toUpperCase(),closed:on},{k:l[0]==="gv"?"valve":"coil",tag:l[2],lbl:" "}],live:R.Vout>0,sw:110,lw:70}).s+LD.T(X2-80,y-8,`${l[3]} A`,{size:10.5,a:"end",fill:"var(--muted)"})});
 { const y=316;s+=LD.rung({x1:X1,x2:X2,y,parts:[{k:"sw",lbl:S.short?"CHAFED WIRE: SHORT":"T'STAT WIRE OK",closed:!!S.short,bad:S.short}],live:R.Vout>0,sw:150}).s}
 /* readings on the transformer */
 if(!o.noLcd)s+=K.lcd(200,300,R.fuse?"0.0 V":K.f1(R.Vout)+" V",90,"SECONDARY")+K.lcd(310,300,K.f2(R.I)+" A",80,"LOAD");
 return s};
/* ---------- Learn ---------- */
const steps=[
 {t:"What a control transformer does",
  body:`<p>The <b>control transformer</b> takes line voltage and steps it down to <b>24 V AC</b> for the thermostat, safeties, relay coils and gas valve.</p><ul><li>The <b>primary</b> coil connects to line voltage.</li><li>The <b>secondary</b> coil feeds the 24 V side: <b>R</b> and <b>C</b>.</li></ul><p>The two coils share an iron core but no wire. Power crosses by magnetism. The voltage steps down by the <b>turns ratio</b>: a 240 to 24 V transformer has 10 times more turns on the primary.</p>`,
  math:`<p>V<sub>sec</sub> = V<sub>pri</sub> × (N<sub>sec</sub> / N<sub>pri</sub>)</p><p>240 V × (1/10) = 24 V. 120 V × (1/5) = 24 V.</p>`,
  draw:()=>{let s=LD.xfmrReal(260,120,{va:40});
   s+=LD.lead("M290 128 C290 60 200 60 140 60","#1d2124",4)+LD.lead("M330 128 C330 80 200 90 140 90","#e8892b",4)+LD.lead("M440 170 C520 170 540 120 600 120","#f2b632",4)+LD.lead("M440 220 C520 220 540 260 600 260","#2f6fd6",4);
   s+=K.tag(110,64,"240 V IN",{a:"end",w:90})+K.tag(640,124,"R",{w:40})+K.tag(640,264,"C",{w:40})+K.tag(620,194,"24 V",{fill:LD.HOT,w:60});
   s+=LD.co(300,150,170,180,"PRIMARY (MORE TURNS)",{a:"end"})+LD.co(420,230,500,330,"SECONDARY",{a:"start"})+LD.co(270,140,170,240,"IRON CORE",{a:"end"});return s}},
 {t:"Multi-tap primaries: use the right lead",
  body:`<p>Most replacement transformers have a <b>multi-tap</b> primary: a <b>common</b> lead plus one lead for each supply voltage, often 120, 208 and 240 V.</p><ul><li>Measure the supply, then connect common and the matching tap.</li><li>Cap the unused leads separately.</li></ul><p>Use the wrong tap and the 24 V side is wrong too. A 208 V supply on the 240 V tap gives only about 21 V, low enough for contactors to chatter. 240 V on the 120 V tap roughly doubles it and burns things up.</p>`,
  draw:()=>{const S={sup:1,tap:1,va:1,con:true,r1:false,r2:false,gv:false};return scene(model(S),S)}},
 {t:"VA rating and current",
  body:`<p>Transformers are rated in <b>VA</b> (volt-amps), not watts. The rating is the most the secondary can deliver without overheating.</p><p>To find the current: <b>I = VA / V</b>.</p><ul><li>40 VA at 24 V: 40 / 24 = <b>1.67 A</b> on the secondary.</li><li>The same 40 VA on a 240 V primary: 40 / 240 = <b>0.17 A</b>.</li></ul><p>Low voltage side, high current. High voltage side, low current. The VA is the same on both sides (a little more on the primary for losses).</p>`,
  math:`<p>VA = V × I, so I = VA / V.</p><p>Secondary: 40 VA / 24 V = 1.67 A. Primary at 240 V: 40 / 240 = 0.167 A. At 120 V: 40 / 120 = 0.33 A.</p>`,
  draw:()=>{let s=LD.xfmrReal(260,110,{va:40});const bar=(x,y,w,h,f,c,t,v)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="var(--paper)" stroke="var(--panel-edge)"/><rect x="${x}" y="${y+h-h*f}" width="${w}" height="${h*f}" rx="4" fill="${c}" opacity=".8"/>`+LD.L(x+w/2,y+h+20,t,{size:12})+K.lcd(x+w/2,y-24,v,80);
   s+=bar(90,100,60,200,40/240/1.67,"var(--cold)","PRIMARY 240 V","0.17 A")+bar(570,100,60,200,1,LD.HOT,"SECONDARY 24 V","1.67 A");
   s+=K.tag(360,320,"40 VA = 240 V × 0.17 A = 24 V × 1.67 A",{w:340});return s}},
 {t:"Sizing: add up the loads",
  body:`<p>Add the current of every 24 V load that can be on at once, then multiply by 24.</p><ul><li>Two relays at 0.3 A and a contactor at 0.5 A: 1.1 A.</li><li>1.1 A × 24 V = <b>26.4 VA</b>.</li></ul><p>Round up to the next size (30 VA), or to 40 VA to leave room for a zone board or humidifier added later. An undersized transformer runs hot, sags, and fails early.</p>`,
  draw:()=>{const L=[["RELAY",0.3,"#7a5cd0"],["RELAY",0.3,"#9a7be0"],["CONTACTOR",0.5,"#2f6fd6"]];let s="",x=80;const W=560/(40/24);
   s+=`<rect x="80" y="150" width="560" height="60" rx="6" fill="var(--paper)" stroke="var(--panel-edge)"/>`;
   L.forEach(([n,a,c])=>{s+=`<rect x="${x}" y="150" width="${a*W}" height="60" fill="${c}" opacity=".85"/>`+LD.L(x+a*W/2,186,`${a} A`,{size:13,fill:"#fff"})+LD.L(x+a*W/2,236,n,{size:12});x+=a*W});
   [[30,"30 VA"],[40,"40 VA"]].forEach(([va,t])=>{const xx=80+va/24*W;s+=`<path d="M${xx} 120 V220" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>`+LD.L(xx,112,t,{size:12})});
   s+=`<path d="M${80+1.1*W} 140 V220" stroke="${LD.HOT}" stroke-width="3"/>`+K.tag(80+1.1*W,280,"1.1 A × 24 V = 26.4 VA",{fill:LD.HOT,w:220})+LD.L(80,112,"0 A",{size:12,a:"start"});return s}},
 {t:"Fuse the secondary",
  body:`<p>A rubbed-through thermostat wire or a shorted coil connects R straight to C. With nothing to limit it, the current jumps far past the transformer's rating.</p><p>That's why the 24 V side has a <b>fuse</b>, often a <b>3 A automotive fuse</b> on the furnace control board. It blows before the transformer cooks.</p><p>A blown fuse is a symptom, not the problem. Find the short before you put a new fuse in, or the new one blows too.</p>`,
  draw:()=>{const S={sup:0,tap:0,va:1,con:true,r1:true,r2:false,gv:false,short:true};return scene(model(S),S)}},
 {t:"The common side is grounded",
  body:`<p>On most furnaces the <b>C</b> side of the 24 V secondary is tied to the cabinet ground. The flame sensor needs that: it proves flame by sending a small current through the flame to ground.</p><p>What that means for you:</p><ul><li>Any <b>R</b> wire touching sheet metal is a short. That's the usual way fuses blow.</li><li>You can measure 24 V from R to the cabinet.</li><li>Don't swap R and C: the board then sees a grounded R.</li></ul>`,
  draw:()=>{let s=rBox(40,60,380,280,14,"cab");s+=`<rect x="60" y="80" width="340" height="240" fill="url(#zInside)" opacity=".5"/>`;
   s+=LD.xfmrReal(110,110,{va:40,pri:"120"});
   s+=LD.lead("M290 140 C340 140 360 100 470 100","#f2b632",4)+LD.lead("M290 190 C350 190 360 220 470 220","#2f6fd6",4);
   s+=LD.lead("M330 200 C330 250 300 300 260 318","#2e8b3e",3.4)+zScrew(258,318,5);
   s+=LD.co(258,318,300,362,"C BONDED TO THE CABINET",{a:"start"});
   s+=K.tag(500,82,"R (24 V)",{w:90})+K.tag(500,250,"C",{w:40});
   s+=LD.lead("M470 100 C560 100 560 150 600 160","#f2b632",4)+`<path d="M598 156 l12 4 l-8 8" fill="none" stroke="${LD.HOT}" stroke-width="2"/><circle cx="610" cy="172" r="12" fill="#ffd34d" opacity=".7" class="lsPulse"/>`;
   s+=`<rect x="590" y="176" width="110" height="10" fill="url(#r_galvH)"/>`+LD.L(645,210,"R RUBS METAL",{size:12,fill:"var(--bad)"})+LD.L(645,228,"= SHORT TO C",{size:12,fill:"var(--bad)"});return s}}];
/* ---------- See it ---------- */
const see=K.see({vb:"0 0 720 400",init:{sup:2,tap:2,va:1,con:true,r1:false,r2:false,gv:false,short:false},
 sliders:[["sup","Supply voltage",0,2,1,v=>SUP[v]+" V"],["tap","Primary tap used",0,2,1,v=>SUP[v]+" V tap"],["va","Transformer size",0,3,1,v=>VAS[v]+" VA"]],
 checks:[["con","Contactor coil on (0.5 A)"],["r1","Relay 1 on (0.3 A)"],["r2","Relay 2 on (0.3 A)"],["gv","Gas valve on (0.5 A)"],["short","Short R to C (chafed wire)"]],
 model,draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Turns ratio",K.f1(R.ratio)+" : 1"],["Secondary",R.fuse?"0 V (fuse open)":K.f1(R.Vout)+" V",R.fuse||R.low||R.over],["Load needs",K.f1(R.need)+" VA"],["Rated current",K.f2(R.Ir)+" A"],["Load",R.fuse?"-":K.f0(R.pct)+"%",R.overload],["Primary current",K.f2(R.Ip)+" A"]],
 note:(R,S)=>R.fuse?"The fuse is open: a short (or more than 3 A) blew it. Everything on the 24 V side is dead. Clear the short, then replace the fuse with the same rating.":R.over?`${R.sup} V on the ${R.tap} V tap: the secondary is about ${K.f0(R.Vout)} V. Coils, the board and the transformer will overheat. Move the supply to the matching tap.`:R.low?`Only ${K.f1(R.Vout)} V on the secondary. Most coils need roughly 80 to 85% of their rating to pull in solidly, so contactors may chatter. Check the tap and the transformer size.`:R.overload?`The loads need ${K.f1(R.need)} VA from a ${R.va} VA transformer. It will run hot and fail early. Go up a size.`:R.A===0?"No load: a small transformer reads above 24 V (often 26 to 28 V) with nothing on. That's normal.":"",
 log:[["Sup/tap",(R,S)=>R.sup+"/"+R.tap],["VA",R=>R.va],["Need",R=>K.f1(R.need)],["Sec V",R=>R.fuse?"0":K.f1(R.Vout)],["Fuse",R=>R.fuse?"open":"ok"]]});
/* ---------- Try it ---------- */
const causes=[["tap","Primary wired to the wrong tap"],["small","Transformer too small for the loads"],["short","Shorted wire blew the fuse"],["dead","Transformer primary burnt open"]];
const cs=o=>K.caseTask({t:o.t,intro:o.intro,state:o.state,model,draw:(R,S)=>scene(R,S,{noLcd:true}),reads:(R,S)=>[["Supply measured",R.sup+" V"],["Transformer",R.va+" VA"]],actions:o.act,causes,ans:o.ans,why:o.why,hint:o.hint});
const tasks=[
 K.goal({t:"Size the transformer",intro:"Turn on the <b>contactor, both relays and the gas valve</b> (all can run at once on this unit). Pick the <b>smallest</b> transformer that carries them at 100% or less.",
  check:(S,R)=>!(S.con&&S.r1&&S.r2&&S.gv)?"Turn on all four loads.":S.short?"Clear the short.":R.overload?"That size is overloaded. Go up.":S.va>0&&R.need<=VAS[S.va-1]?"A smaller one would still carry it. Go down.":S.sup!==S.tap?"Match the tap to the supply first.":true,
  ok:(S,R)=>`1.6 A × 24 V = ${K.f1(R.need)} VA, so 40 VA is the smallest standard size that works. Loaded to ${K.f0(R.pct)}%.`}),
 K.goal({t:"Wire it on a 208 V building",intro:"Set the supply to <b>208 V</b> and connect the tap so the secondary reads a normal 24 to 28 V with the contactor on.",
  check:(S,R)=>S.sup!==1?"Set the supply to 208 V.":!S.con?"Turn on the contactor.":R.fuse?"The fuse is open.":S.tap!==1?`On the ${SUP[S.tap]} V tap the secondary reads ${K.f1(R.Vout)} V. Try another tap.`:true,ok:(S,R)=>`208 V on the 208 V tap: ${K.f1(R.Vout)} V on the secondary.`}),
 K.goal({t:"Blow the fuse, and log it",intro:"With power on and a load running, make a <b>short</b> from R to C. See what's left on the 24 V side, then press <b>Log reading</b>.",
  check:(S,R,L)=>L.some(r=>r.R.fuse&&r.S.short)?true:"Log a reading with the short on and the fuse open.",ok:"The 3 A fuse opened and saved the transformer. On a real call: find the chafed wire before replacing the fuse."}),
 cs({t:"Service call: contactor buzzes and chatters",intro:"New 40 VA transformer installed last week in a 208 V building. When everything on the 24 V side is on at once, the outdoor contactor buzzes and the compressor short-cycles.",state:{sup:1,tap:2,va:1,con:true,r1:true,r2:true,gv:true},
  act:[["Measure the secondary with the contactor on",(R)=>`${K.f1(R.Vout)} V from R to C.`],["Look at the primary leads",()=>"Supply on common and the orange 240 V lead. The red 208 V lead is capped."]],
  ans:"tap",why:"208 V on the 240 V tap gives about 21 V under load: too low for the contactor to hold in solidly. Move the supply lead to the 208 V tap.",hint:"The transformer isn't overloaded. Compare the supply with the tap it's on."}),
 cs({t:"Service call: no 24 V after a contactor swap",intro:"Another tech replaced the outdoor contactor yesterday. Today the thermostat is blank and nothing runs.",state:{sup:0,tap:0,va:1,con:true,r1:false,r2:false,gv:false,short:true},
  act:[["Measure the primary",()=>"120 V on the primary leads."],["Measure the transformer secondary, before the fuse",()=>"26 V right at the transformer leads."],["Look at the board fuse",()=>"The 3 A fuse is open. The new contactor's coil wire is pinched under a cover screw."]],
  ans:"short",why:"The transformer puts out 26 V, but the fuse is open. The pinched wire shorted R to the grounded cabinet. Fix the wire, then replace the fuse.",hint:"There's voltage at the transformer. Where does it stop?"})];
window.LESSON={id:"lad-xfmr",sec:"Ladder Builder",secHref:"/ladder/",title:"Control transformers",lead:"How the control transformer turns line voltage into 24 V, how to read its VA rating, size it, fuse it, and why C is grounded.",
 steps,see,tryIntro:"Three setups in See it, then two service calls.",tasks,
 job:K.job({read:["<b>Primary voltage</b> at the transformer leads, and which tap is used.","<b>Secondary voltage</b> R to C, with the loads on.","<b>Nameplate VA</b> and the primary voltages it's rated for.","<b>The fuse</b> on the board or in the R lead."],
  table:[["Reading","Normal","Look into it"],["Secondary, no load","About 26 to 28 V","Under 24 V or over 30 V"],["Secondary, loads on","About 24 to 26 V","Under about 20 V: chattering contactors"],["Fuse","Closed","Open: find the short first"],["Transformer case","Warm","Too hot to touch: overloaded or shorted"],["Load VA vs rating","Under 100%","Over: go up a size"]],
  steps:["Measure the supply voltage at the unit before you wire anything.","Connect common and the tap that matches. Cap unused taps one by one.","Add up the 24 V loads that can run together and check the VA.","Power up and measure R to C with the loads running.","If the fuse blows, unhook the thermostat wires one at a time to find the short."],stepsT:"Replacing a transformer",
  safety:["The primary is line voltage. Lock out and verify dead before you touch the leads.","A transformer that cooked will be hot. Let it cool.","Never replace a blown fuse with a bigger one or a jumper."],
  mistakes:["Putting a 208 V supply on the 240 V tap because \"it's close\".","Replacing the fuse three times without looking for the short.","Adding a humidifier or zone board without checking the VA.","Swapping R and C on a furnace with a grounded common."]}),
 sources:[["The Engineering Mindset: basic transformer calculations","https://theengineeringmindset.com/basic-transformer-calculations/"],["ACHR News: transformer sizing and calculating VA capacity","https://www.achrnews.com/articles/123688-ice-breaker-transformer-sizing-and-calculating-va-capacity"],["Daikin/Goodman 80% furnace service manual RS6621301 (40 VA transformer, grounded common)","https://mobile.goodmanmfg.com/mobileapp/stellent/pdf/infoPdf/Lit/RS6621301.pdf"],["Payne PG92ESA furnace instructions: 3 A fuse on the control (ManualsLib)","https://www.manualslib.com/manual/2322410/Payne-Pg92esa.html?page=37"]]};
})();
