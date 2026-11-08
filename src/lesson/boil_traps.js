/* ============ Lesson: Steam traps ============ */
(()=>{
const D=[1/8,3/16,1/8,1/8],HRS=4000,PRICE=10;   // stuck-open orifice by trap type (in.), heating-season hours, $ per 1,000 lb of steam
const CONDS=["Working","Failed open (blowing steam)","Failed closed (blocked)"];
const model=S=>{const Ts=B.Tsat(S.P),lp=Math.min(Ts,212);let tin,tout,loss=0;
 if(S.cond===2){tin=120;tout=85}
 else if(S.cond===1){tin=Ts;tout=Ts-0.25*(Ts-212)-1;loss=B.trapLoss(S.P,D[S.k])}
 else{tin=S.k===0?Ts-12:Ts-2;tout=S.k===0?Math.min(Ts-25,lp-8):lp-5}
 const cost=loss*HRS/1000*PRICE;return {Ts,tin,tout,dT:tin-tout,loss,cost,btu:loss*B.hfg(S.P)}};
/* radiator or coil, piping, trap and return; IR readings at the trap inlet and outlet */
const scene=(R,S,o={})=>{let s=`<path d="M10 350 H710" stroke="#8a7f70" stroke-width="4"/>`;const k=S.k,st=["ok","open","closed"][S.cond];
 s+=B.pipe("M30 70 H120 V110",B.STM,10)+B.rad(70,110,8,110,S.cond!==2);
 if(S.cond===2)s+=`<rect x="74" y="150" width="108" height="62" fill="var(--cold)" opacity=".5"/>`+B.L(128,240,"CONDENSATE BACKED UP",{size:11,fill:"var(--cold)"});
 const ty=250,tx=380;s+=B.pipe(`M190 205 H230 V${ty} H${tx-60}`,S.cond===2?B.COND:"#7ea7c9",9)+B.pipe(`M${tx+60} ${ty} H690`,S.cond===1?B.STM:"#7ea7c9",9);
 if(S.cond===1)s+=B.flow(`M${tx+60} ${ty} H690`,true,.5)+`<g class="lsPulse"><path d="M600 ${ty-14} q-8 -16 4 -30" stroke="#b9c3ca" stroke-width="4" fill="none"/><path d="M640 ${ty-14} q-8 -16 4 -30" stroke="#b9c3ca" stroke-width="4" fill="none"/></g>`;
 s+=B.trap(k,tx,ty-(k===2?14:0),1.5,st);
 s+=K.lcd(tx-110,ty-60,K.f0(R.tin)+"°F",86)+B.L(tx-110,ty-84,"INLET",{size:12})+K.lcd(tx+110,ty-60,K.f0(R.tout)+"°F",86)+B.L(tx+110,ty-84,"OUTLET",{size:12});
 s+=B.L(tx,ty+76,B.TRAPS[k].toUpperCase(),{size:13})+B.L(620,ty+30,"TO THE RETURN",{size:12});
 if(!o.noBox)s+=B.box(470,30,230,64,"STEAM "+S.P+" PSIG",K.f1(R.Ts)+"°F",{vs:20})+B.box(470,106,230,64,"LOST THROUGH THE TRAP",R.loss?K.f1(R.loss)+" LB/H":"NONE",{vs:20,vc:R.loss?"var(--bad)":"var(--ok)",st:R.loss?"var(--bad)":null});
 return s};
const steps=[
 {t:"What a steam trap does",
  body:`<p>When steam gives up its heat it turns to water. That <b>condensate</b>, and the air that was in the pipes, have to get out of the radiator or coil. The steam has to stay in until it has given up its heat.</p><p>A <b>steam trap</b> is an automatic valve that does both: it opens for condensate and air and closes on steam.</p><p>If it fails <b>open</b>, live steam blows into the return. If it fails <b>closed</b>, condensate backs up, the coil goes cold, and it can bang.</p>`,
  draw:()=>{const S={k:1,cond:0,P:5};return scene(model(S),S,{noBox:true})+B.L(520,100,"STEAM STAYS IN",{fill:"#6c7a84"})+B.L(520,124,"CONDENSATE AND AIR OUT",{fill:B.COND})}},
 {t:"Thermostatic traps",
  body:`<p>A <b>thermostatic</b> trap works on temperature. A sealed <b>bellows</b> (or a bimetal strip) expands when steam reaches it and pushes the valve shut. When cooler condensate or air surrounds it, it shrinks and opens.</p><ul><li>Great at letting <b>air</b> out, so they're used on radiators in two-pipe systems.</li><li>They hold condensate back until it cools a little, so the outlet runs cooler than steam.</li><li>Bellows wear out in a few years and fail <b>open</b> or <b>closed</b>.</li></ul>`,
  draw:()=>B.trap(0,300,190,3.2,"ok")+B.pipe("M80 190 H188",B.STM,14)+B.pipe("M412 190 V300 H640",B.COND,12)+B.co(300,150,460,80,"BELLOWS: SWELLS ON STEAM",{a:"start"})+B.co(300,252,460,240,"VALVE AND SEAT",{a:"start"})+B.L(120,170,"FROM THE RADIATOR",{size:12})+B.L(560,286,"TO THE DRY RETURN",{size:12,fill:B.COND})},
 {t:"Float and thermostatic (F&T)",
  body:`<p>An <b>F&amp;T trap</b> has a ball <b>float</b> on a lever. As condensate fills the body the float rises and opens the outlet, so water leaves as fast as it arrives. Steam can't lift the float, so the valve stays shut on steam.</p><p>A small <b>thermostatic air vent</b> at the top lets air out at startup.</p><p>It drains continuously, so it's the usual choice for coils, unit heaters and the ends of low-pressure mains.</p>`,
  draw:()=>B.trap(1,330,190,3.4,"ok")+B.pipe("M60 150 H176",B.STM,14)+B.pipe("M484 230 H660",B.COND,12)+B.co(310,210,140,270,"FLOAT RISES WITH WATER",{a:"end"})+B.co(380,240,520,300,"OUTLET VALVE",{a:"start"})+B.co(412,118,520,80,"THERMOSTATIC AIR VENT",{a:"start"})},
 {t:"Inverted bucket and thermodynamic",
  body:`<ul><li><b>Inverted bucket</b>: an upside-down bucket on a lever. Steam fills the bucket and floats it up, closing the valve. When the steam condenses the bucket sinks and opens it. Rugged, handles dirt and high pressure, discharges in bursts.</li><li><b>Thermodynamic (disc)</b>: a flat disc. Fast-moving flash steam under it, and pressure above it, snap it shut; it opens again as the steam above it cools. Small and tough for high-pressure drips, but it clicks and doesn't suit low-pressure heating.</li></ul>`,
  draw:()=>K.cards([{t:"INVERTED BUCKET",inner:B.trap(2,90,96,.85,"ok")+B.L(160,64,"STEAM IN THE",{a:"start",size:12})+B.L(160,82,"BUCKET: CLOSED",{a:"start",size:12})+B.L(160,108,"WATER: SINKS,",{a:"start",size:12})+B.L(160,126,"OPENS",{a:"start",size:12}),note:"process and high pressure"},
   {t:"THERMODYNAMIC DISC",inner:B.trap(3,90,96,1,"ok")+B.L(160,72,"DISC SNAPS SHUT",{a:"start",size:12})+B.L(160,90,"ON FLASH STEAM",{a:"start",size:12})+B.L(160,116,"CLICKS EVERY CYCLE",{a:"start",size:12}),note:"high-pressure main drips"}],{h:180})},
 {t:"Failed open, failed closed: test by temperature",
  body:`<p>Measure the trap's <b>inlet</b> and <b>outlet</b> with an infrared or contact thermometer, and listen to it (a stethoscope or ultrasonic tester):</p><ul><li><b>Working</b>: inlet near steam temperature, outlet clearly cooler, flow on and off or a steady trickle.</li><li><b>Failed open</b>: outlet almost as hot as the inlet and a steady roar. The return gets hot far downstream.</li><li><b>Failed closed</b>: inlet well <b>below</b> steam temperature, outlet cold, equipment cold.</li></ul><p>A 1/8 in. orifice stuck open at 150 psig blows about 76 lb of steam an hour (DOE).</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:260,X:[0,150],Y:[0,3500],xt:[0,25,50,75,100,125,150],xf:v=>v,yt:[0,1000,2000,3000],yf:v=>"$"+v/1000+"k",title:"ONE 1/8 IN. TRAP STUCK OPEN: COST PER HEATING SEASON",xl:"steam pressure, psig ("+HRS+" h, $"+PRICE+" per 1,000 lb)",
   series:[{f:P=>B.trapLoss(P,1/8)*HRS/1000*PRICE,c:"#d0312d",lbl:"steam lost",lblAt:80,dy:-14}],dots:[{x:150,y:B.trapLoss(150,1/8)*HRS/1000*PRICE,c:"#d0312d",lbl:K.f0(B.trapLoss(150,1/8))+" lb/h at 150 psig",a:"end",dx:-12,dy:-16}]})}];
const see=K.see({init:{k:1,cond:0,P:15},
 sliders:[["k","Trap type",0,3,1,v=>B.TRAPS[v]],["cond","Condition",0,2,1,v=>CONDS[v]],["P","Steam pressure",1,150,1,v=>v+" psig"]],
 model, draw:(R,S)=>scene(R,S),
 reads:(R,S)=>[["Steam temperature",K.f1(R.Ts)+"°F"],["Inlet",K.f0(R.tin)+"°F",S.cond===2],["Outlet",K.f0(R.tout)+"°F",S.cond===1],["Inlet minus outlet",K.f0(R.dT)+"°F"],["Steam lost",R.loss?K.f1(R.loss)+" lb/h":"none",R.loss>0],["Cost per season",R.loss?B.money(R.cost):"$0",R.loss>0]],
 note:(R,S)=>S.cond===1?`Outlet almost as hot as the inlet, and steam in the return. At ${S.P} psig a ${D[S.k]===1/8?"1/8":"3/16"} in. orifice blows ${K.f1(R.loss)} lb/h.`:S.cond===2?"Inlet far below steam temperature: condensate is backed up. The radiator or coil goes cold and can bang.":S.k===3&&S.P<15?"Disc traps need a few psi of pressure difference to work well; they're a poor fit for low-pressure heating.":S.k===0&&S.P>50?"Radiator-style thermostatic traps are for low pressure; check the rating.":"",
 log:[["Trap",(R,S)=>["Thermo","F&T","Bucket","Disc"][S.k]],["Condition",(R,S)=>["OK","open","closed"][S.cond]],["psig",(R,S)=>S.P],["In/out",R=>K.f0(R.tin)+" / "+K.f0(R.tout)],["Loss",R=>R.loss?K.f1(R.loss)+" lb/h":"0"]]});
const tasks=[
 K.goal({t:"Compare a good and a failed-open F&T trap",intro:"Set an <b>F&amp;T</b> trap at <b>15 psig</b>. Log it <b>working</b>, then log it <b>failed open</b>, and compare the inlet and outlet.",
  check:(S,R,L)=>{const f=c=>L.some(r=>r.S.k===1&&r.S.P===15&&r.S.cond===c);return f(0)&&f(1)?true:!f(0)?"Log a working F&T trap at 15 psig.":"Now log it failed open."},ok:"Working, the outlet runs well below the inlet. Failed open, the two are close and the return fills with steam."}),
 K.goal({t:"Put a price on a failed trap",intro:"Make a trap that's <b>failed open</b> waste at least <b>$1,000</b> of steam in a heating season.",
  check:(S,R)=>S.cond!==1?"Set the condition to Failed open.":R.cost<1000?`It's wasting ${B.money(R.cost)}. Try a higher pressure.`:true,ok:(S,R)=>`${K.f1(R.loss)} lb/h, ${B.money(R.cost)} a season, from one trap. That's why plants survey their traps every year.`}),
 K.goal({t:"Find a blocked radiator trap",intro:"Set a <b>thermostatic</b> radiator trap at <b>5 psig or less</b>, <b>failed closed</b>, and confirm the inlet reads at least <b>40°F below</b> steam temperature.",
  check:(S,R)=>S.k!==0?"Set the trap type to Thermostatic.":S.P>5?"Set the pressure to 5 psig or less.":S.cond!==2?"Set the condition to Failed closed.":R.Ts-R.tin<40?"Inlet is too close to steam temperature.":true,ok:(S,R)=>`Inlet ${K.f0(R.tin)}°F against ${K.f1(R.Ts)}°F steam: water is sitting in the radiator. Replace the trap element.`})];
window.LESSON={id:"boil-traps",sec:"Boiler",secHref:"/boiler-trainer/",title:"Steam traps",lead:"How thermostatic, float and thermostatic, inverted bucket and disc traps hold steam in, and how to tell failed open from failed closed by temperature.",
 steps,see,tryIntro:"Three setups in See it. Change the sliders, then press Check.",tasks,
 job:K.job({read:["<b>Steam pressure</b> at the trap (and its saturation temperature).","<b>Inlet and outlet temperature</b> right at the trap, IR or contact probe.","<b>Sound</b>: on-off cycling, steady trickle, or a steady roar.","<b>Return line</b>: hot and hammering far downstream means traps blowing through."],
  table:[["Reading","Working","Failed open","Failed closed"],["Inlet","Near steam temp","Steam temp","Well below steam temp"],["Outlet","Clearly cooler than inlet","Nearly as hot as inlet","Cold"],["Sound","Cycles or trickles","Steady roar","Silent"],["Equipment","Heats","Heats, return hot","Cold, may bang"]],
  steps:["Make sure the equipment is calling and steam is on.","Read the steam pressure and look up its temperature.","Read the inlet and outlet temperatures right at the trap body.","Listen to it, then compare against the table.","Tag and record failed traps; repair or replace with the same type and pressure rating."],stepsT:"Testing a trap",
  safety:["Trap bodies and outlets are hotter than 212°F. Use gloves and don't touch with bare hands.","Isolate and depressurize before opening a trap; let it cool.","Never open a trap's test valve toward your face or a walkway."],
  mistakes:["Judging only the outlet: flash steam makes a good trap's outlet look 'steamy' too.","Replacing a trap with a different type or pressure rating.","Ignoring failed-closed traps because they don't waste steam: they cause water hammer and frozen coils."]}),
 sources:[["The Engineering Mindset: thermostatic radiator traps","https://theengineeringmindset.com/thermostatic-radiator-traps/"],["TLV: steam trap varieties and applications","https://tlv.com/global/US/steam-theory/steam-trap-varieties-and-applications.html"],["U.S. DOE Steam Tip Sheet 1: inspect and repair steam traps","https://nrel.gov/docs/fy02osti/31493.pdf"]]};
})();
