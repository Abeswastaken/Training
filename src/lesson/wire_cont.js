/* ============ Lesson: Contactors and relays ============ */
(()=>{
const C=WK.C,VLINE=240,VCOIL=24,PICK=20.4,DROP=14.4;    // definite purpose coil: operates at 85 to 110% of rated, drops out below 60% (Square D 8910DPA)
const COILR=[18,Infinity,1.5],COILN=["Good (18 Ω)","Open","Shorted (1.5 Ω)"],FUSE=3;
const model=S=>{const rc=S.rc/1000,Rl=VLINE/S.amps;let cv=S.cv,fuse=false;
 if(S.coil===2&&cv/COILR[2]>FUSE){fuse=true;cv=0}
 const state=S.coil!==0||cv<DROP?"out":cv>=PICK?"in":"gray";const closed=state==="in";
 const I=closed?VLINE/(Rl+2*rc):0,drop=I*rc,heat=I*I*rc,comp=I*Rl;
 return {rc,Rl,cv,fuse,state,closed,I,drop,heat,comp,ohm:COILR[S.coil],coil:S.coil,amps:S.amps}};
const ohmTxt=r=>isFinite(r)?r.toFixed(1)+" Ω":"OL";
const scene=(R,S,o={})=>{let s=WK.defs();const cs=1.2,cx=250,cy=80;const P=k=>WK.cpt(cx,cy,cs,k);const L1=P("L1"),L2=P("L2"),T1=P("T1"),T2=P("T2"),A1=P("A1"),A2=P("A2");
 const ks=.9,kx=500,ky=140,KC=WK.kpp(kx,ky,ks,"C"),KR=WK.kpp(kx,ky,ks,"R");const on=R.closed;
 s+=K.lbl(328,22,"240 V FROM THE DISCONNECT",{size:12});
 s+=WK.comp(kx,ky,{s:ks,lab:" "});
 s+=WK.w(`M${L1[0]} 32 V${L1[1]}`,C.blk,6)+WK.w(`M${L2[0]} 32 V${L2[1]}`,C.red,6)+WK.flow(`M${L1[0]} 32 V${L1[1]}`,on,6)+WK.flow(`M${L2[0]} 32 V${L2[1]}`,on,6);
 const t1=`M${T1[0]} ${T1[1]} V304 H650 V${KR[1]} H${KR[0]}`,t2=`M${T2[0]} ${T2[1]} V284 H${KC[0]} V${KC[1]}`;
 s+=WK.w(t1,C.blk,6)+WK.w(t2,C.red,6)+WK.flow(t1,on,6)+WK.flow(t2,on,6);
 /* 24 V control */
 const cOn=R.cv>0;s+=`<rect x="30" y="236" width="140" height="70" rx="6" fill="#2b3236" stroke="#111"/>`+WK.t(100,254,o.hideCoil?"24 V CONTROL":"24 V CONTROL, FUSED 3 A",{size:9,fill:"#e9ecee"})+K.lcd(100,280,R.fuse?"FUSE":R.cv.toFixed(1)+" V",100);
 s+=WK.w(`M170 266 H226 V${A1[1]} H${A1[0]}`,C.yel,3)+WK.w(`M170 296 V340 H420 V${A2[1]} H${A2[0]}`,C.blu,3);
 s+=WK.contactor(cx,cy,{s:cs,in:on||R.state==="gray"&&o.chat,pit:R.rc>0.05});
 if(R.heat>4){const gl=Math.min(1,R.heat/60);[[40,103],[80,103]].forEach(([a,b])=>{s+=`<circle cx="${cx+(a+5)*cs}" cy="${cy+b*cs}" r="${10+gl*10}" fill="#ff6a2a" opacity="${(.25+gl*.5).toFixed(2)}"/>`})}
 /* drop meters */
 const dm=(x,y,a,b,t)=>K.lcd(x,y,t,96);
 s+=dm(186,140,L1,T1,R.drop.toFixed(2)+" V")+K.txt(186,120,"L1 to T1");
 s+=K.lcd(470,110,R.drop.toFixed(2)+" V",96)+K.txt(470,90,"L2 to T2");
 s+=K.lcd(600,356,K.f1(R.comp)+" V",96)+K.txt(506,361,"at compressor",{a:"end"});
 return s};
const steps=[
 {t:"Coil and contacts",body:`<p>A <b>contactor</b> is a switch worked by a magnet. It has two separate circuits:</p><ul><li>The <b>coil</b>: a winding of fine wire on an iron core, usually powered by 24 V from the thermostat circuit.</li><li>The <b>contacts</b>: heavy silver-faced pads that switch line voltage (L1 to T1, L2 to T2) to the compressor and fan.</li></ul><p>With the coil off, a <b>spring</b> holds the contacts apart. Power the coil and its magnet pulls the <b>armature</b> down, slamming the moving contacts onto the fixed ones. A <b>relay</b> works the same way, just smaller, for lighter loads.</p>`,
  draw:()=>{const cut=(on)=>{const d=on?12:0;let g=`<rect x="40" y="44" width="250" height="270" rx="10" fill="#e9eae6" stroke="#8c918f" stroke-width="1.5"/>`;
    g+=`<rect x="56" y="140" width="84" height="16" fill="url(#wkCu)" stroke="#6a3a18"/><rect x="190" y="140" width="84" height="16" fill="url(#wkCu)" stroke="#6a3a18"/>`+WK.screw(72,148,7)+WK.screw(258,148,7)+WK.t(72,132,"L1",{size:12})+WK.t(258,132,"T1",{size:12});
    g+=`<rect x="124" y="134" width="14" height="6" fill="#cfd3d6" stroke="#777"/><rect x="192" y="134" width="14" height="6" fill="#cfd3d6" stroke="#777"/>`;
    g+=`<rect x="110" y="${104+d}" width="110" height="12" rx="2" fill="url(#wkCu)" stroke="#6a3a18"/><rect x="124" y="${116+d}" width="14" height="6" fill="#cfd3d6" stroke="#777"/><rect x="192" y="${116+d}" width="14" height="6" fill="#cfd3d6" stroke="#777"/>`;
    g+=`<rect x="158" y="${116+d}" width="14" height="110" fill="#6b5f4f"/><rect x="110" y="${226+d}" width="110" height="20" rx="2" fill="#7d868c" stroke="#4d555a"/>`;
    let sp="";const sl=(104+d-52)/10;for(let i=0;i<5;i++)sp+=` l8 ${sl} l-8 ${sl}`;g+=`<path d="M161 52${sp}" fill="none" stroke="#3a4146" stroke-width="2"/>`;
    g+=`<path d="M110 258 H220 V300 H110Z M128 258 V300 M202 258 V300" fill="#8f979c" stroke="#4d555a"/><rect x="134" y="250" width="62" height="54" rx="4" fill="url(#wkCu)" stroke="#6a3a18"/>`+WK.t(165,282,"COIL",{size:11,fill:"#fff"});
    if(on)g+=`<path d="M150 244 q15 -10 30 0" stroke="${WK.HOT}" stroke-width="2" fill="none"/><path d="M144 236 q21 -14 42 0" stroke="${WK.HOT}" stroke-width="2" fill="none" opacity=".6"/>`;
    g+=K.txt(165,330,on?"24 V on: armature pulled down, contacts closed":"coil off: spring holds contacts open",{fill:on?WK.HOT:"var(--muted)"});
    return g};
   return K.cards([{t:"COIL OFF",c:"var(--ink)",inner:cut(false)+K.txt(226,262,"armature",{a:"start"})+K.txt(182,76,"spring",{a:"start"})},{t:"COIL ON",c:WK.HOT,inner:cut(true)+K.txt(226,110,"contacts",{a:"start"})+K.txt(226,94,"closed",{a:"start"})}],{h:350})}},
 {t:"Normally open and normally closed",body:`<p>Contacts are named by what they do when the coil is <b>off</b>.</p><ul><li><b>Normally open (NO)</b>: open with the coil off, close when it's powered. A compressor contactor's contacts are NO.</li><li><b>Normally closed (NC)</b>: closed with the coil off, open when it's powered.</li></ul><p>A relay often has both, sharing one <b>common</b> (COM) terminal: COM to NC at rest, COM to NO when pulled in. That's how one coil can turn one thing off and another on at the same time.</p>`,
  draw:()=>{const card=(on)=>{let g=`<circle cx="60" cy="60" r="0"/>`+WK.S.line("M40 70 V250",null,3)+K.lbl(40,62,"COM",{size:12});
    const lamp=(x,y,lit)=>`<circle cx="${x}" cy="${y}" r="18" fill="${lit?"#ffd54a":"var(--paper)"}" stroke="var(--ink)" stroke-width="2"/><path d="M${x-12} ${y-12} L${x+12} ${y+12} M${x+12} ${y-12} L${x-12} ${y+12}" stroke="var(--ink)" stroke-width="1.4"/>`;
    g+=WK.S.line(`M40 110 H98 M142 110 H222 M258 110 H290`)+WK.S.no(120,110,{closed:on,lab:"NO"})+lamp(240,110,on)+K.txt(240,146,on?"on":"off");
    g+=WK.S.line(`M40 210 H98 M142 210 H222 M258 210 H290`)+(on?WK.S.nc(120,210,{open:true,lab:"NC"}):WK.S.nc(120,210,{lab:"NC"}))+lamp(240,210,!on)+K.txt(240,246,on?"off":"on");
    g+=WK.S.line("M290 90 V230",null,3);
    return g+K.txt(165,300,on?"coil powered: NO closes, NC opens":"coil off: NC closed, NO open",{fill:on?WK.HOT:"var(--muted)"})};
   return K.cards([{t:"COIL OFF",c:"var(--ink)",inner:card(false)},{t:"COIL ON",c:WK.HOT,inner:card(true)}],{h:330})}},
 {t:"Pull-in and drop-out",body:`<p>A coil needs enough voltage to pull the armature in against the spring. A definite-purpose HVAC contactor is built to work from <b>85% to 110%</b> of its rated coil voltage: <b>20.4 to 26.4 V</b> for a 24 V coil.</p><p>Once in, it holds on less. It <b>drops out</b> below about <b>60%</b> (14.4 V). Between those, it might not pull in, or it <b>chatters</b>: buzzing in and out, arcing the contacts every time.</p><p>Low coil voltage comes from an overloaded transformer, long or thin thermostat wire, or a loose C wire.</p>`,
  math:`<p><code>0.85 × 24 = 20.4 V</code>, <code>1.10 × 24 = 26.4 V</code>, <code>0.60 × 24 = 14.4 V</code>.</p>`,
  draw:()=>{const X=v=>60+v/30*600;let s="";const z=[[0,DROP,"#8d979c","OUT"],[DROP,PICK,"#c77f0a","CHATTER ZONE"],[PICK,26.4,"#1e9a4a","PULLS IN"],[26.4,30,"#d0312d","TOO HIGH"]];
   z.forEach(([a,b,c,t])=>{s+=`<rect x="${X(a)}" y="140" width="${X(b)-X(a)}" height="60" fill="${c}" opacity=".85"/>`+K.lbl((X(a)+X(b))/2,177,t,{size:t.length>8?12:14,fill:"#fff"})});
   [0,6,12,DROP,PICK,24,26.4,30].forEach(v=>{s+=`<path d="M${X(v)} 200 v8" stroke="var(--muted)"/>`+K.txt(X(v),228,(+v.toFixed(1))+" V")});
   s+=K.lbl(X(24),126,"RATED 24 V",{size:13})+`<path d="M${X(24)} 132 V140" stroke="var(--ink)" stroke-width="2"/>`;
   s+=K.lbl(X(DROP),280,"60%: DROPS OUT",{size:13,fill:"#c77f0a"})+K.lbl(X(PICK)+40,316,"85%: MUST PULL IN",{size:13,fill:"#1e9a4a"})+`<path d="M${X(DROP)} 236 V264 M${X(PICK)} 236 V300" stroke="var(--muted)" stroke-dasharray="3 3"/>`;
   return s+K.lbl(60,60,"24 V CONTACTOR COIL",{a:"start",size:16})+K.txt(60,86,"what the contactor does at each coil voltage",{a:"start"})}},
 {t:"Checking the coil",body:`<p>First read <b>volts across the coil</b> with the thermostat calling. 24 V there and no pull-in points at the coil itself (or a stuck armature).</p><p>Then power off, pull one coil wire and read <b>ohms</b>:</p><ul><li>A good 24 V coil reads a steady value, often somewhere from about 10 to 100 Ω depending on the model. Compare with a new one or the spec.</li><li><b>OL</b>: the winding is open (burned through).</li><li>Near <b>0 Ω</b>: the winding is shorted. It draws far too much current and blows the 3 A fuse on the control board.</li></ul>`,
  math:`<p>Shorted coil on 24 V: <code>I = 24 / 1.5 = 16 A</code>, five times the 3 A fuse rating. A good coil's DC resistance is low, but in service its inductance limits the current to a few tenths of an amp.</p>`,
  draw:()=>{let s=WK.defs();const it=[["GOOD COIL","18.0","steady reading: OK"],["OPEN COIL","OL","burned open: replace"],["SHORTED COIL","1.5","blows the 3 A fuse"]];
   it.forEach(([t,v,d],i)=>{const x=20+i*232;s+=`<rect x="${x}" y="14" width="216" height="350" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>`+K.lbl(x+108,42,t,{size:14,fill:i?"var(--bad)":"var(--ok)"})+WK.meter(x+64,56,{s:.58,mode:"O",txt:v,unit:"Ω"});
    const cs=.62,cx=x+68,cy=228,a=WK.cpt(cx,cy,cs,"A1"),b=WK.cpt(cx,cy,cs,"A2");s+=WK.contactor(cx,cy,{s:cs});
    s+=WK.lead(x+64+75*.58,56+206*.58,a[0]+2,a[1]-2,"blk",{sag:20,k:.5})+WK.lead(x+64+110*.58,56+206*.58,b[0]-2,b[1]-2,"red",{sag:20,k:.5})+K.txt(x+108,352,d)});
   return s}},
 {t:"Pitted contacts and voltage drop",body:`<p>Every time contacts open under load they arc a little. Over years the silver faces <b>pit</b> and burn, and a pitted contact has <b>resistance</b>.</p><p>Current through that resistance drops voltage and makes heat: <b>V = I × R</b>, <b>P = I² × R</b>. The compressor gets less voltage, runs hotter, and the contactor cooks itself.</p><p>Test with the unit <b>running</b>: read volts from <b>L1 to T1</b> and <b>L2 to T2</b>, across each closed pole. Good contacts read near 0 V. Several volts means the contacts are bad: replace the contactor.</p>`,
  math:`<p>At 20 A, clean contacts of about 0.005 Ω drop <code>20 × 0.005 = 0.1 V</code> and make <code>20² × 0.005 = 2 W</code>. Pitted contacts of 0.1 Ω drop <code>2 V</code> per pole (4 V lost over both) and make <code>40 W</code> each, as much as a small light bulb inside a plastic housing.</p>`,
  draw:()=>{const pair=(x,pit,v,w)=>{let g=`<rect x="${x}" y="70" width="300" height="56" rx="4" fill="url(#wkCu)" stroke="#6a3a18"/><rect x="${x}" y="190" width="300" height="56" rx="4" fill="url(#wkCu)" stroke="#6a3a18"/>`;
    g+=`<rect x="${x+110}" y="126" width="80" height="22" rx="4" fill="${pit?"#4a3a2a":"#d6dadd"}" stroke="#555"/><rect x="${x+110}" y="168" width="80" height="22" rx="4" fill="${pit?"#3b2c1e":"#d6dadd"}" stroke="#555"/>`;
    if(pit)g+=`<circle cx="${x+130}" cy="${142}" r="5" fill="#1b130c"/><circle cx="${x+160}" cy="${174}" r="6" fill="#1b130c"/><circle cx="${x+172}" cy="${138}" r="3" fill="#1b130c"/><path d="M${x+150} 150 l-6 8 l8 -2 l-4 10" stroke="#ffb347" stroke-width="2" fill="none"/>`;
    g+=K.lcd(x+150,290,v,110)+K.txt(x+150,322,"across the closed pole")+K.txt(x+150,346,w);return g};
   return pair(30,false,"0.10 V","20 A, 0.005 Ω: 2 W of heat")+pair(390,true,"1.97 V","20 A, 0.1 Ω: 40 W of heat")+K.lbl(180,44,"GOOD",{size:16,fill:"var(--ok)"})+K.lbl(540,44,"PITTED",{size:16,fill:"var(--bad)"})}}];
const see=K.see({init:{cv:24.4,coil:0,rc:5,amps:20},
 sliders:[["cv","Voltage at the coil",0,28,0.2,v=>(+v).toFixed(1)+" V"],["coil","Coil",0,2,1,v=>COILN[v]],["rc","Contact resistance per pole",2,300,1,v=>v+" mΩ"],["amps","Compressor current at 240 V",5,30,1,v=>v+" A"]],
 model,draw:(R,S)=>scene(R,S),
 reads:R=>[["Contactor",R.fuse?"Fuse blown":R.state==="in"?"Pulled in":R.state==="gray"?"Chatter zone":"Open",R.state!=="in"],["Coil ohms (power off)",ohmTxt(R.ohm),R.coil!==0],["Drop L1 to T1",R.drop.toFixed(2)+" V",R.drop>1],["Drop L2 to T2",R.drop.toFixed(2)+" V",R.drop>1],["Compressor volts",K.f1(R.comp)+" V"],["Current",K.f1(R.I)+" A"],["Heat in each pole",K.f1(R.heat)+" W",R.heat>10],["Coil voltage",R.cv.toFixed(1)+" V"]],
 note:R=>R.fuse?"Shorted coil: 24 V across 1.5 Ω would draw 16 A, so the 3 A fuse blows and the coil gets nothing.":R.coil===1?"Open coil: no current can flow through it, so no magnet, whatever voltage it gets.":R.state==="gray"?"Between 60% and 85% of 24 V: the coil may not pull in from rest, or may chatter. Find out why the voltage is low.":R.state==="out"?"Below the drop-out voltage: the spring wins and the contacts stay open.":R.drop>1?`Each pole drops ${R.drop.toFixed(2)} V and makes ${K.f1(R.heat)} W of heat. That's pitted contacts: replace the contactor.`:"Pulled in with clean contacts: almost no voltage lost across them.",
 log:[["Coil V",R=>R.cv.toFixed(1)],["State",R=>R.state],["mΩ",R=>K.f0(R.rc*1000)],["Drop",R=>R.drop.toFixed(2)]]});
const tasks=[
 K.goal({t:"A 2-volt drop",intro:"Leave a 20 A compressor running. Raise the contact resistance until each pole drops <b>2 V</b> (1.85 to 2.15 V).",check:(S,R)=>S.amps!==20?"Set the compressor to 20 A.":!R.closed?"The contactor has to be pulled in.":R.drop<1.85?`Only ${R.drop.toFixed(2)} V. More resistance.`:R.drop>2.15?`${R.drop.toFixed(2)} V is too much. Back it off.`:true,
  ok:(S,R)=>`About ${K.f0(R.rc*1000)} mΩ. V = I × R = ${K.f1(R.I)} × ${R.rc.toFixed(3)} = ${R.drop.toFixed(2)} V, and ${K.f0(R.heat)} W of heat in each pole. A tenth of an ohm is plenty to ruin a contactor.`}),
 K.goal({t:"The lowest sure voltage",intro:"With a good coil, set the coil voltage to the <b>lowest value the contactor is built to pull in at</b> (within 0.4 V).",check:(S,R)=>S.coil!==0?"Use a good coil.":S.cv<PICK-0.01?`At ${S.cv.toFixed(1)} V it isn't guaranteed to pull in.`:S.cv>PICK+0.41?`${S.cv.toFixed(1)} V works, but go lower: what's 85% of 24?`:true,
  ok:"20.4 V, 85% of 24. Below that it may still close on a good day, but you can't count on it. Over a long thermostat run, check the coil voltage with the compressor starting."}),
 K.caseTask({t:"Service call: thermostat calling, contactor won't pull in",intro:"Hot day, thermostat calling for cooling, outdoor unit silent. Take readings and pick the cause.",
  state:{cv:24.6,coil:1,rc:5,amps:18},model,draw:(R,S)=>scene(R,S,{hideCoil:true}),
  reads:()=>[["Thermostat","Calling"],["Contactor","Open"]],
  actions:[["Volts across the coil",()=>"Coil, with the call on: <b>24.6 V</b>."],["Ohms across the coil (power off, one wire off)",()=>"Coil resistance: <b>OL</b>."],["Volts L1 to L2",()=>"L1 to L2: <b>242 V</b>."]],
  causes:[["coil","Coil burned open"],["lv","No 24 V reaching the coil"],["pit","Pitted contacts"],["weld","Contacts welded shut"]],ans:"coil",
  why:"Full 24 V at the coil but OL across it: the winding is broken, so no current, no magnet. Replace the contactor (match coil voltage, poles and amp rating).",hint:"The coil has its voltage. What does OL across a winding mean?"})];
window.LESSON={id:"wire-contactor",sec:"Wiring Board",secHref:"/wiring/",title:"Contactors and relays",lead:"Coil and contacts, normally open and normally closed, pull-in and drop-out voltage, checking the coil, and finding pitted contacts by the voltage drop across them.",
 steps,see,tryIntro:"Two with the contactor, then a call.",tasks,
 job:K.job({read:["Coil voltage and amp rating on the contactor's label (for example 24 VAC coil, 30 FLA, 2-pole).","Volts across the coil with a call on.","Volts across each closed pole (L1 to T1, L2 to T2) with the unit running.","Look at the contacts: dark pitting, welded or burned faces, melted housing, ants or debris in the armature."],
  table:[["Reading","Good","Bad"],["Coil volts, calling","about 24 V (20.4 to 26.4 V)","under 20 V: chatter, no pull-in"],["Coil ohms, power off","steady value per spec","OL (open) or near 0 (shorted)"],["L1 to T1 running","near 0 V","volts: pitted contacts"],["T1 to ground, no call","0 V","about 120 V: contacts welded"]],tableT:"Normal and action points",
  steps:["Thermostat calling: read volts across the coil.","No pull-in with 24 V there: power off, read coil ohms.","Pulled in and running: read volts across each pole.","Unit off with no call: check T1 and T2 to ground. Voltage there means welded contacts."],stepsT:"Checking a contactor",
  safety:["Line side terminals (L1, L2) stay live when the contactor is open. Kill the disconnect before you touch them.","Many single-pole contactors leave one leg always connected: the compressor is live even when the contactor is out.","Never push the armature in by hand with power on to 'test' it."],
  mistakes:["Replacing a contactor without asking why the coil got no voltage (pressure switch, thermostat, wire).","Fitting a contactor with the wrong coil voltage (24 V vs 120 or 240 V).","Missing a welded contactor: the compressor runs with the thermostat satisfied.","Judging contacts only by looks; measure the drop under load."]}),
 sources:[["The Engineering Mindset: How Relays Work","https://theengineeringmindset.com/how-relays-work/"],["Schneider Electric: Coil voltage range for Definite Purpose 8910DPA contactors","https://www.se.com/us/en/faqs/FA101358/"],["HVAC School: How and When to Change a Contactor","https://www.hvacrschool.com/how-and-when-to-change-a-contactor"],["HVAC School: Using your volt meter as a voltage drop detector","https://www.hvacrschool.com/using-your-volt-meter-as-a-voltage-drop-detector"]]};
})();
