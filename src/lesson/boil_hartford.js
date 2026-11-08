/* ============ Lesson: The Hartford loop and the water line ============ */
(()=>{
/* levels in inches from the normal water line (NWL): close nipple top -2, LWCO cutoff -3.5, crown sheet -6 on this boiler */
const NIP=-2,CUT=-3.5,CROWN=-6,PX=4,NY=250;      // 4 px per inch, NWL drawn at y 250
const model=S=>{const rise=S.drop/16*B.WC,flood=rise>=S.A,margin=S.A-rise;let lvl=0,lost=false;
 if(S.brk){if(S.loop)lvl=NIP-0.4;else{lvl=-12;lost=true}}
 return {rise,flood,margin,lvl,lost,short:S.A<28,lwco:lvl<CUT,dry:lvl<CROWN}};
/* side view of a one-pipe steam boiler with its main, wet return and (optionally) a Hartford loop */
const scene=(R,S,o={})=>{const mY=NY-PX*S.A,X=60,Y=190,W=170,H=150,ly=l=>NY-PX*l;let s=`<path d="M10 350 H710" stroke="#8a7f70" stroke-width="4"/>`;
 const fr=l=>(Y+6+100-ly(l))/100;
 s+=B.boiler(X,Y,W,H,{steam:true,lvl:fr(R.lvl),fire:!R.lwco,lines:{crown:fr(CROWN)},name:"BOILER"});
 /* header and main */
 s+=B.pipe(`M150 ${Y} V${mY-6} H600 V330`,B.STM,10)+B.pipe(`M270 ${mY-6} V320 H${X+W+2}`,B.STM,9);
 /* water in the equalizer and in the end-of-main drop */
 const wTop=Math.max(mY-6,ly(R.lvl)),eTop=ly(R.lvl);
 s+=B.pipe(`M270 ${Math.max(eTop,mY)} V320 H${X+W+2}`,B.COND,9);
 const dTop=R.lost?330:Math.max(mY-6,NY-PX*(R.rise+R.lvl));s+=B.pipe(`M600 330 V${dTop}`,B.COND,10);
 if(R.flood&&!R.lost)s+=B.pipe(`M600 ${mY-6} H${Math.max(300,600-(R.rise-S.A)*12)}`,B.COND,10);
 /* wet return, with or without the loop */
 const ret=S.loop?`M600 330 H320 V${ly(NIP)+3} H276`:`M600 330 H${X+W+2}`;s+=B.pipe(ret,R.lost?"#9fb3c2":B.COND,8);
 if(S.loop)s+=`<rect x="274" y="${ly(NIP)-3}" width="16" height="12" rx="2" fill="url(#zBrass)" stroke="#6a4a12"/>`;
 if(S.brk)s+=`<path d="M440 318 l24 24 M464 318 l-24 24" stroke="var(--bad)" stroke-width="4"/><path d="M452 342 q-6 6 0 12 q6 6 -2 10" stroke="#5d9fd6" stroke-width="4" fill="none" class="lsPulse"/>`;
 /* water line and A dimension */
 s+=`<path d="M40 ${NY} H650" stroke="#5d9fd6" stroke-dasharray="6 4" stroke-width="1.4"/>`+B.L(334,NY+16,"NORMAL WATER LINE",{a:"start",size:11,fill:"#3f7fc0"});
 s+=`<path d="M650 ${NY} V${mY}" stroke="var(--ink)" stroke-width="1.4"/><path d="M642 ${NY} h16 M642 ${mY} h16" stroke="var(--ink)" stroke-width="1.4"/>`+K.tag(684,(NY+mY)/2+6,"A "+S.A+" IN.",{w:72});
 if(!o.noTags){s+=K.tag(520,Math.min(dTop,NY)-16,R.lost?"RETURN DRAINED":"WATER UP "+K.f0(R.rise)+" IN.",{w:150,fill:R.flood?"var(--bad)":B.COND});
  if(S.loop&&!o.noNip)s+=B.co(282,ly(NIP)+12,330,ly(NIP)+50,"CLOSE NIPPLE 2 IN. BELOW",{a:"start",size:11});
  s+=B.L(330,mY-18,R.flood?"WATER IN THE MAIN: HAMMER":"STEAM MAIN",{size:12,fill:R.flood?"var(--bad)":"#6c7a84"})}
 return s};
const steps=[
 {t:"The water line and the wet return",
  body:`<p>Steam leaves the boiler through the <b>header</b>, travels the <b>main</b>, and the condensate drops back down at the end of the main into the <b>wet return</b>: a pipe that runs below the boiler water line and is always full of water.</p><p>The boiler and the wet return are connected, so when the boiler is off the water stands at the <b>same level</b> in both, like two ends of a U-tube.</p>`,
  draw:()=>{const S={drop:0,A:30,loop:true};return scene(model(S),S,{noNip:true})}},
 {t:"Why water rises in the return",
  body:`<p>While it's steaming, the pressure at the far end of the main is a little <b>lower</b> than in the boiler: steam loses some pressure pushing through the pipe. The boiler pressure pushes the water in the return <b>up</b> by that difference.</p><p>Every psi of difference lifts water about <b>28 in.</b> Every ounce lifts it about <b>1.7 in.</b></p><p>A boiler at 2 psi with a well-vented main might only lose a few ounces, so the water rises a few inches. A badly vented or undersized main loses much more.</p>`,
  math:`<p>1 psi = 27.7 in. of water. 1 oz = 1/16 psi = 1.73 in.</p><p>Example: 8 oz drop × 1.73 = 13.9 in. of rise.</p>`,
  draw:()=>{const S={drop:8,A:30,loop:true};return scene(model(S),S,{noNip:true})+B.L(400,80,"8 OZ LOST IN THE MAIN",{size:13})}},
 {t:"The A dimension",
  body:`<p><b>Dimension A</b> is the height from the boiler's water line up to the bottom of the lowest pipe that carries steam: the end of the main or the dry return.</p><p>It has to be bigger than the rise, or water climbs into the main. Then you get <b>water hammer</b>, wet steam, and water stuck out in the pipes while the boiler runs low.</p><p>Boiler makers ask for <b>at least 28 in.</b> in most cases (Peerless), about the rise from 1 psi of difference. On a low ceiling, there may be room only for a pumped return.</p>`,
  draw:()=>{const S={drop:14,A:20,loop:true};return scene(model(S),S,{noNip:true})+B.L(150,120,"14 OZ DROP, ONLY 20 IN. OF A",{size:13,fill:"var(--bad)"})}},
 {t:"The Hartford loop",
  body:`<p>The <b>equalizer</b> pipe runs from the header down into the boiler's return tapping. The wet return doesn't go straight into the boiler; it ties into the equalizer through a <b>close nipple</b> (a very short nipple) whose top is about <b>2 in. below the normal water line</b>.</p><p>That's the <b>Hartford loop</b>. Water returns normally, but if the return breaks or loses pressure, the boiler water can only siphon back out down to the close nipple. Then the siphon breaks and the crown sheet stays covered.</p><p>Check the boiler maker's instructions; some measure from the bottom of the gauge glass.</p>`,
  draw:()=>{const S={drop:4,A:30,loop:true};return scene(model(S),S)+B.co(270,200,330,170,"EQUALIZER",{a:"start",size:12})}},
 {t:"When the return breaks",
  body:`<ul><li><b>No loop</b>, return piped straight into the boiler bottom: a break in the wet return drains the boiler. Only the low-water cutoff stands between that and a dry fire.</li><li><b>With the loop</b>: the water drops to the close nipple and stops. The crown sheet stays covered.</li></ul><p>Set the nipple too <b>high</b> (at the water line) and the level drops below it every time the boiler steams, so steam slams into the return: banging. Too <b>low</b> and it protects less. Two inches below is the usual answer.</p>`,
  draw:()=>{const a={drop:0,A:30,loop:false,brk:true},b={drop:0,A:30,loop:true,brk:true};const m=(S,x,t,c)=>`<g transform="translate(${x} 20) scale(.5)">`+scene(model(S),S,{noTags:true})+`</g>`+B.L(x+170,26,t,{fill:c})+B.L(x+170,220,model(S).lost?"BOILER DRAINS":"WATER STOPS AT THE NIPPLE",{fill:c,size:13});
   return m(a,0,"RETURN BREAKS, NO LOOP","var(--bad)")+m(b,356,"RETURN BREAKS, HARTFORD LOOP","var(--ok)")+B.L(360,280,"Same break in the wet return.",{size:14})+B.L(360,304,"The loop is a backup to the low-water cutoff, not a replacement.",{size:14})}}];
const see=K.see({init:{drop:6,A:24,loop:true,brk:false},
 sliders:[["drop","Pressure lost to the end of the main",0,24,1,v=>v+" oz"],["A","Dimension A",16,48,1,v=>v+" in."]],
 checks:[["loop","Hartford loop installed"],["brk","Wet return broken (leaking)"]],
 model, draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Water rises",K.f1(R.rise)+" in."],["Room left under the main",R.flood?"none":K.f1(R.margin)+" in.",R.flood],["A dimension",S.A+" in.",R.short],["Main",R.flood?"WATER IN IT":"dry",R.flood],["Boiler level",R.lost?"draining":R.lvl<0?K.f1(R.lvl)+" in.":"normal",R.lost],["LWCO",R.lwco?"tripped":"water OK",R.lwco]],
 note:(R,S)=>R.lost?"No Hartford loop: the break drains the boiler. The LWCO is all that's left.":S.brk&&S.loop?"The loop stops the siphon at the close nipple. The crown sheet stays covered.":R.flood?"The return water climbs into the main: banging, wet steam, and water missing from the boiler.":R.short?"Under 28 in. of A: less than most boiler makers ask for.":"",
 log:[["Drop",(R,S)=>S.drop+" oz"],["A",(R,S)=>S.A+" in."],["Loop",(R,S)=>S.loop?"yes":"no"],["Break",(R,S)=>S.brk?"yes":"no"],["Result",R=>R.lost?"drained":R.flood?"main flooded":"OK"]]});
const tasks=[
 K.goal({t:"Give an 8 oz main enough A",intro:"The main loses <b>8 oz</b> or more. Set an A dimension that keeps the water out of the main and meets the <b>28 in.</b> most boiler makers ask for. Loop installed, return intact.",
  check:(S,R)=>!S.loop||S.brk?"Install the loop and fix the return.":S.drop<8?"Set the pressure drop to 8 oz or more.":R.flood?"Water is in the main. More A.":S.A<28?"Meet the 28 in. minimum.":true,ok:(S,R)=>`Water rises ${K.f1(R.rise)} in. with ${K.f1(R.margin)} in. to spare.`}),
 K.goal({t:"Flood the main",intro:"Show what a low boiler room ceiling does: pick a drop and A dimension that put <b>water in the main</b>, then press <b>Log reading</b>.",
  check:(S,R,L)=>L.some(r=>r.R.flood&&!r.R.lost)?true:"Log a reading with water in the main.",ok:"That's the water hammer and the dry boiler on a system that was piped too close to the water line."}),
 K.goal({t:"Break the return, with and without the loop",intro:"Check <b>Wet return broken</b>. Log it with the <b>loop removed</b>, then with the <b>loop installed</b>.",
  check:(S,R,L)=>{const a=L.some(r=>r.S.brk&&!r.S.loop),b=L.some(r=>r.S.brk&&r.S.loop);return a&&b?true:!a?"Log a broken return with the loop removed.":"Now log one with the loop installed."},ok:"Without the loop the boiler drains to the break. With it, the water stops 2 in. below the line."})];
window.LESSON={id:"boil-hartford",sec:"Boiler",secHref:"/boiler-trainer/",title:"The Hartford loop and the water line",lead:"Why water rises in a steam system's return, what the A dimension is, and how the Hartford loop keeps a broken return from draining the boiler.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders and boxes, then press Check.",tasks,
 job:K.job({read:["<b>Normal water line</b> marked on the boiler, and where the gauge glass sits.","<b>Dimension A</b>: tape from the water line to the bottom of the end of the main or the dry return.","<b>Close nipple height</b> on the Hartford loop compared to the water line.","<b>Steam pressure</b> on a low-pressure gauge while running."],
  table:[["Item","Rule of thumb"],["Water rise","About 28 in. per psi (1.7 in. per oz) of pressure lost to the end of the main"],["Dimension A","At least 28 in. in most boiler manuals"],["Close nipple","Top about 2 in. below the normal water line (check the boiler manual)"],["Feeder connection","Into the wet return below the close nipple"]],
  safety:["Don't take apart a wet return on a hot boiler: it's full of hot water and opens the boiler to the floor.","A missing Hartford loop is not a reason to remove an LWCO; it's a reason to add the loop."],
  mistakes:["Replacing a boiler and piping the return straight into it.","Setting the close nipple at the water line: banging every cycle.","Raising the pressuretrol to push heat further, which also pushes water further up the return."]}),
 sources:[["The Engineering Mindset: steam heating system basics","https://theengineeringmindset.com/steam-heating-system-basics/"],["HeatingHelp: a Hartford loop Q and A","https://heatinghelp.com/systems-help-center/a-hartford-loop-q-and-a/"],["Peerless: steam systems guide (Dimension A, close nipple)","https://www.peerlessboilers.com/wp-content/uploads/2018/01/TwoPipeSteam.pdf"]]};
})();
