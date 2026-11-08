/* ============ Lesson: Flame sensing (microamps) ============ */
(()=>{
/* flame circuit: the DC part of the rectified current ~ V / (flame + coating + ground path). Clean rod fully in the flame with a good ground: 4.0 uA, as in the trainer. */
const GND=["good (under 2 Ω)","corroded mount","ground wire off"];
const M=S=>{const imm=S.imm/100,c=S.coat/100;const Rf=10/imm,Rc=80*Math.pow(c,1.6),Rg=[0,40,Infinity][S.gnd];const uA=isFinite(Rg)?40/(Rf+Rc+Rg):0.05;return {uA,proves:uA>=1.0,S}};
const fu=v=>v.toFixed(1);
const scene=(R,o={})=>{const S=R.S;let s="";const tip=300-60*(S.imm/100);
 /* burner box back wall */
 s+=`<rect x="40" y="40" width="440" height="300" rx="4" fill="url(#zInside)" opacity=".22"/>`;
 /* flames */
 [140,260].forEach(x=>{s+=`<path d="M${x-34} 254 Q${x-10} 120 ${x} 70 Q${x+10} 120 ${x+34} 254 Z" fill="#3d7de0" opacity=".82"/><path d="M${x-16} 254 Q${x} 160 ${x+16} 254 Z" fill="#9fd0ff" opacity=".95"/>`});
 /* burners and manifold */
 [140,260].forEach(x=>{s+=`<rect x="${x-34}" y="252" width="68" height="40" rx="6" fill="url(#zSteel)" stroke="#4d555a" stroke-width="1.2"/><ellipse cx="${x}" cy="254" rx="26" ry="5" fill="#1b1f22"/>`});
 s+=`<rect x="60" y="292" width="380" height="20" rx="6" fill="#8d969c" stroke="#4d555a"/>`+[140,260].map(x=>zHex(x,302,7)).join("");
 /* ground wire */
 const g=S.gnd;s+=`<path d="M70 312 V340 H40" stroke="#3a9a4a" stroke-width="4" fill="none"/><path d="M40 340 v14 M28 354 h24 M32 360 h16 M36 366 h8" stroke="var(--ink)" stroke-width="2.4"/>`;
 if(g===1)s+=`<circle cx="70" cy="314" r="9" fill="#a0662a" opacity=".85"/>`;
 if(g===2)s+=`<path d="M70 312 V326" stroke="var(--bad)" stroke-width="0" /><rect x="64" y="318" width="12" height="10" fill="var(--paper)"/><path d="M60 330 l20 -14" stroke="var(--bad)" stroke-width="3"/>`;
 s+=K.lbl(58,376,"BURNER GROUND",{a:"start",size:12});
 /* rod and insulator */
 const coat=S.coat/100;s+=`<path d="M470 200 H${tip}" stroke="#9aa1a8" stroke-width="5" stroke-linecap="round"/>`;
 if(coat>0.02)s+=`<path d="M440 200 H${tip}" stroke="#f2efe6" stroke-width="${(5+4*coat).toFixed(1)}" stroke-linecap="round" opacity="${(0.25+0.7*coat).toFixed(2)}"/>`;
 s+=`<rect x="440" y="188" width="40" height="24" rx="5" fill="#efe9dc" stroke="#8f887a"/><rect x="480" y="196" width="10" height="8" fill="url(#zBrass)"/>`;
 /* meter in series: rod terminal -> meter -> board */
 const v=R.uA;s+=`<path d="M490 200 C530 200 556 204 570 190" stroke="#c0392b" stroke-width="2.4" fill="none"/>`;
 s+=HK.dmm(540,40,fu(v),"DC µA",{dial:16});
 s+=`<path d="M595 190 C598 230 620 250 620 284" stroke="#1d2327" stroke-width="2.4" fill="none"/>`;
 /* board */
 s+=`<rect x="540" y="282" width="160" height="70" rx="3" fill="url(#zGreen)" stroke="#0e2414" filter="url(#zShadow)"/><rect x="630" y="288" width="12" height="8" fill="#111"/><circle cx="560" cy="300" r="5" fill="${R.proves?"var(--ok)":"var(--bad)"}"/>
  <text x="620" y="326" style="font-family:var(--mono);font-size:10px;fill:#e9ecee;text-anchor:middle">${R.proves?"FLAME PROVEN":"NO FLAME SEEN"}</text><text x="620" y="342" style="font-family:var(--display);font-size:8px;fill:#c4cacf;text-anchor:middle">CONTROL BOARD (NEEDS 1.0 µA)</text>`;
 (o.labels||[]).forEach(l=>s+=HK.co(...l));
 return s};
const base={coat:0,imm:100,gnd:0};
const steps=[
 {t:"The board has to see the flame",body:`<p>Once the gas valve opens, the board must know the burners really lit. Unburned gas filling the heat exchanger could explode.</p><p>On most furnaces a metal <b>flame sensor</b> rod sits in the flame of the burner farthest from the igniter. If that burner lit, the flame carried all the way across. The board sends a tiny current through the flame and measures it in <b>microamps (µA)</b>, millionths of an amp.</p><p>Some furnaces use the igniter itself as the sensor. The idea is the same.</p>`,
  draw:()=>scene(M(base),{labels:[[380,200,380,150,"FLAME SENSOR ROD",{a:"start"}],[450,212,420,250,"CERAMIC INSULATOR",{a:"end"}],[100,302,30,276,"MANIFOLD",{a:"start"}]]})},
 {t:"Flame rectification",body:`<p>The board puts <b>AC voltage</b> on the rod, often around 90 to 120 V. A flame is full of charged particles, so it conducts a little.</p><p>The rod is small and the grounded burner is big. Current flows much more easily one way than the other, so the flame acts like a <b>diode</b>: it lets through a small <b>DC</b> current. That is <b>flame rectification</b>.</p><p>The board looks for that DC current. A short to ground would pass AC both ways, so a wet or shorted rod can't fake a flame.</p>`,
  draw:()=>{let s="";const sine=(x,y,w,a,half)=>{let d="";for(let i=0;i<=60;i++){const t=i/60,v=Math.sin(t*4*Math.PI);d+=(i?"L":"M")+(x+t*w).toFixed(1)+" "+(y-a*(half?Math.max(0,v)*1:v)).toFixed(1)}return d};
   s+=K.lbl(110,60,"AC ON THE ROD",{size:14})+`<path d="M30 140 H190" stroke="var(--panel-edge)"/><path d="${sine(30,140,160,50)}" stroke="#c0392b" stroke-width="3" fill="none"/>`;
   s+=`<path d="M290 300 Q330 150 360 80 Q390 150 430 300 Z" fill="#3d7de0" opacity=".85"/><rect x="270" y="300" width="180" height="40" rx="6" fill="url(#zSteel)" stroke="#4d555a"/><path d="M450 170 H370" stroke="#9aa1a8" stroke-width="5" stroke-linecap="round"/>`;
   s+=K.arrow("M378 290 L378 184","#f2f2f2",3.4)+K.arrow("M346 196 L346 282","#f2f2f2",1.2);
   s+=K.lbl(456,200,"SMALL ROD",{a:"start",size:13})+K.lbl(480,330,"BIG GROUNDED BURNER",{a:"start",size:13})+K.txt(360,368,"electrons flow far more easily from the big burner side");
   s+=K.lbl(610,60,"DC THE BOARD READS",{size:14})+`<path d="M530 140 H690" stroke="var(--panel-edge)"/><path d="${sine(530,140,160,50,true)}" stroke="${HK.OK}" stroke-width="3" fill="none"/><path d="M530 124 H690" stroke="${HK.OK}" stroke-dasharray="5 4"/>`+K.txt(610,170,"average: a few µA DC");
   s+=K.arrow("M200 120 L262 160","var(--muted)",2)+K.arrow("M460 150 L520 124","var(--muted)",2);
   return s}},
 {t:"Read it with a meter in series",body:`<p>Set your meter to <b>DC microamps</b>. Pull the wire off the sensor rod and put the meter <b>in series</b>: one lead on the rod terminal, one on the wire to the board. Then run the furnace.</p><ul><li>Typical: <b>2 to 6 µA</b>. Depending on the furnace, anywhere from about 0.5 to 10 can be normal, so check the manual.</li><li>The board needs a minimum, often about <b>0.5 to 1 µA</b>. The trainer's board needs 1.0.</li></ul><p>Many boards also show the flame current in a menu or on a test pin. Use a meter with 0.1 µA resolution.</p>`,
  draw:()=>scene(M(base),{labels:[[556,202,520,262,"METER IN SERIES",{a:"end"}]]})},
 {t:"Dirty rod: the slow fade",body:`<p>Over time the rod gets a white or brown coating. Silica from the air (sprays, drywall dust, some cleaning products) and oxide bake onto it. The coating is an <b>insulator</b>, so the current drops season by season.</p><p>When it falls below the board's minimum, the furnace lights and then shuts off.</p><p>Fix: clean the rod with a fine abrasive pad or very fine steel wool until it's bright, then wipe it. Avoid coarse sandpaper, which scratches and leaves grit. If it comes back fast, look for what is in the combustion air.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:270,X:[0,100],Y:[0,5],xt:[0,25,50,75,100],xf:v=>v+"%",yt:[0,1,2,3,4,5],yf:v=>v+" µA",title:"FLAME SIGNAL vs COATING ON THE ROD",xl:"how much of the rod is coated",
   bands:[{y0:2,y1:5,c:HK.OK}],series:[{f:c=>M({coat:c,imm:100,gnd:0}).uA,c:HK.COLD,lbl:"rod in the flame",lblAt:90,dy:-12}],
   vlines:[],dots:[{x:52,y:1,c:"var(--bad)",lbl:"BOARD MINIMUM",dy:-12}]})+K.txt(560,90,"typical: 2 to 6 µA",{fill:HK.OK})+`<path d="M90 ${40+270-270/5} H650" stroke="var(--bad)" stroke-dasharray="6 4"/>`},
 {t:"Ground and position",body:`<p>The current comes back through the <b>burner ground</b>. If that path is poor, the signal is weak even with a clean rod.</p><ul><li>Rust or a loose screw where the burners or the ground wire mount.</li><li>The rod bent so its tip is barely in the flame.</li><li>A cracked ceramic insulator that leaks current to the bracket.</li><li>On some boards, <b>reversed 120 V polarity</b> or a missing board ground causes flame failures.</li></ul><p>Check: power off, measure ohms from the burner to the chassis ground. A few ohms at most.</p>`,
  draw:()=>{const c=(t,S,n)=>{const r=M({...base,...S});return {t,c:r.proves?HK.OK:"var(--bad)",inner:K.lcd(80,82,fu(r.uA)+" µA",110)+K.lbl(250,88,r.proves?"PROVES":"DROPS OUT",{fill:r.proves?HK.OK:"var(--bad)",size:14}),note:n}};
   return K.cards([c("CLEAN, GOOD GROUND",{},"the baseline"),c("CORRODED BURNER MOUNT",{gnd:1},"clean rod, poor return path"),c("TIP BARELY IN THE FLAME",{imm:35},"bent rod or a lifted burner"),c("GROUND WIRE OFF",{gnd:2},"no return path at all")])}},
 {t:"The symptom: lights, then goes out",body:`<p>A weak flame signal has a classic pattern:</p><ol><li>Normal start. The burners light with a good flame.</li><li>A few seconds later (the end of the trial) the board hasn't seen enough current, so it <b>shuts the gas off</b>.</li><li>It purges, warms the igniter and tries again: here about 39 seconds per try.</li><li>After the last trial: <b>lockout</b>.</li></ol><p>The flame looked fine the whole time. That is your clue: it's the sensing, not the burning.</p>`,
  draw:()=>{const pts=[];for(let t=0;t<=60;t+=0.25){const c=t%39;pts.push([t,c>=1&&c<7?0.6:0])}
   return K.chart({x:90,y:40,w:560,h:250,X:[0,60],Y:[0,3],xt:[0,10,20,30,40,50,60],xf:v=>v+" s",yt:[0,1,2,3],yf:v=>v+" µA",title:"FLAME SIGNAL DURING TWO TRIALS (DIRTY ROD)",xl:"seconds after the gas valve first opens",
    series:[{pts,c:HK.COLD,w:3},{pts:[[0,1],[60,1]],c:"var(--bad)",dash:"6 4",w:2,lbl:"BOARD NEEDS 1.0",lblAt:60,dy:-8}],vlines:[{x:7,lbl:"gas off",c:"var(--bad)"},{x:46,lbl:"gas off",c:"var(--bad)"}]})}}];
const see=K.see({init:{...base},sliders:[["coat","Coating on the rod",0,100,5,v=>v+"%"],["imm","Rod tip in the flame",20,100,5,v=>v+"%"],["gnd","Burner ground",0,2,1,v=>GND[v]]],
 model:S=>M(S),draw:R=>scene(R,{labels:[[380,200,380,140,"ROD",{a:"start"}]]}),
 reads:R=>[["Flame signal",fu(R.uA)+" µA",!R.proves],["Board needs","1.0 µA"],["Typical","2 to 6 µA"],["Furnace",R.proves?"stays lit":"lights, then shuts off",!R.proves]],
 note:R=>R.proves&&R.uA<2?"It holds, but there's little margin. Clean and check it now, before the cold snap.":!R.proves?"Below the minimum: gas off at the end of each trial, then lockout.":"",
 log:[["Coat",(R,S)=>S.coat+"%"],["In flame",(R,S)=>S.imm+"%"],["Ground",(R,S)=>["good","corroded","off"][S.gnd]],["µA",R=>fu(R.uA)]]});
const minCoat=()=>{for(let c=0;c<=100;c+=5)if(!M({coat:c,imm:100,gnd:0}).proves)return c;return 100};
const C=[["rod","Dirty flame sensor rod"],["gnd","Poor burner ground"],["ign","Cracked igniter"],["ps","Pressure switch"],["gv","Bad gas valve"]];
const tasks=[
 K.goal({t:"Where does it drop out?",intro:"With the rod fully in the flame and a good ground, raise the coating until the board just <b>stops proving flame</b>.",
  check:(S,R)=>S.imm!==100||S.gnd!==0?"Set the tip 100% in the flame and a good ground.":R.proves?"Still proving. More coating.":S.coat>minCoat()?"It already dropped out with less coating than that. Back off to the first step where it fails.":true,
  ok:(S,R)=>`It drops out at about ${S.coat}% coated (${R.uA.toFixed(2)} µA). The furnace ran fine until the day it didn't.`}),
 K.caseTask({t:"Service call: lights, then shuts off",intro:"No heat. You watch it: the burners light with a nice blue flame, then go out after about 7 seconds. It tries again. The LED shows a flame-failure code.",state:{coat:60,imm:100,gnd:0},model:M,draw:R=>scene(R),
  reads:R=>[["Flame","lights, blue"],["Flame signal",fu(R.uA)+" µA",true],["Board needs","1.0 µA"]],
  actions:[["Pull the rod and look at it",()=>"A dull white crust covers the rod."],["Ohms, burner to chassis",()=>"0.8 Ω: the ground is good."]],causes:C,ans:"rod",
  why:"Good flame, good ground, low microamps and a crusted rod. Clean it with a fine pad, put it back in the flame, and measure again: expect about 4 µA.",hint:"The flame lit, so ignition is fine. What's left between the flame and the board?"}),
 K.caseTask({t:"Service call: cleaned it last week, still dropping out",intro:"Another tech cleaned the rod last week. It's doing the same thing again. The rod is bright and clean.",state:{coat:0,imm:100,gnd:1},model:M,draw:R=>scene(R),
  reads:R=>[["Rod","clean"],["Flame signal",fu(R.uA)+" µA",true]],
  actions:[["Ohms, burner to chassis",()=>"Jumps between 40 Ω and open as you wiggle the burner assembly. Rust under the mounting screw."],["Check 120 V polarity",()=>"Hot and neutral are correct."]],causes:C,ans:"gnd",
  why:"A clean rod still reads low because the return path through the burners is bad. Clean the mounting point, tighten the screw or add a ground wire, then re-measure.",hint:"The rod is clean. Where does the current go after the flame?"})];
window.LESSON={id:"heat-flame",sec:"Heating",secHref:"/heating/",title:"Flame sensing (microamps)",lead:"How flame rectification proves the flame, what normal microamps look like, and why a dirty rod or poor ground makes a furnace light and then quit.",
 steps,see,tryIntro:"Find the drop-out point, then two calls.",tasks,
 job:K.job({read:["Flame current in <b>DC microamps</b>, meter in series with the sensor wire (or from the board's menu or test pins).","Ohms from the burner assembly to chassis ground, power off.","The rod: coating, position in the flame, cracks in the insulator."],
  table:[["Reading","Meaning"],["2 to 6 µA","Typical healthy flame signal"],["1 to 2 µA","Works, but little margin: clean and check ground"],["Under about 0.5 to 1 µA","Below most boards' minimum: drops out after the trial"],["Burner to ground over a few Ω","Poor ground: fix before blaming the rod"]],tableT:"Flame signal (check the furnace manual)",
  steps:["Power off. Pull the rod; look for coating or cracks.","Clean with a fine abrasive pad or very fine steel wool. Wipe it.","Check burner-to-ground ohms and the board ground.","Reinstall with the tip in the flame. Measure microamps in series while firing.","Write the reading on the service tag for next year."],stepsT:"Cleaning and checking",
  safety:["The rod carries about 90 to 120 V AC from the board. Make meter connections with the power off, then power up.","Don't bend the rod into the burner or igniter. A rod touching ground reads no flame.","A furnace that keeps relighting and shutting off can leave an odor. Make sure the vent and burner box are clear."],
  mistakes:["Measuring with the meter on AC or on milliamps.","Putting the meter in parallel instead of in series.","Replacing the board when the rod is dirty.","Sanding the rod with coarse sandpaper."]}),
 sources:[["The Engineering Mindset: half wave rectifier explained (the diode idea behind flame rectification)","https://theengineeringmindset.com/half-wave-rectifier-explained/"],["HVAC School: flame sensing, the basics","https://hvacrschool.com/flame-sensing-the-basics/"],["Meier Supply Technically Speaking: flame rectification","https://www.MeierSupply.com/customer/docs/Techtips/TechSpeaking%202010%20Issue6%20Flame%20Rectification.pdf"],["PickHVAC: gas furnace sequence of operations (flame signal 2 to 6 µA)","https://www.pickhvac.com/gas-furnace-sequence-operations-step-step-safety-timing/"]]};
})();
