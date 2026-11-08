/* ============ Lesson: Draft and vent categories ============ */
(()=>{
const F=0.35;   // share of the theoretical stack draft left at the connector after the draft hood's dilution air and friction (this lesson's simple model)
const model=S=>{const theo=CK.stack(S.h,S.out,S.tv),avail=theo*F*Math.pow(1-S.block/100,2),d=avail-S.caz,min=CK.minDraft(S.out);return {theo,avail,d,min,pass:-d<=min,spill:d<0.5,inwc:-d/CK.PA}};
const fmtD=d=>(d>=0?"−":"+")+Math.abs(d/CK.PA).toFixed(3)+" in. w.c.";
/* house section: water heater with draft hood, connector, masonry chimney */
const scene=(R,S,o={})=>{const CX=585,CY=150,top=CY-10-(S.h-10)*3.6;let s=`<rect x="10" y="120" width="${CX-35}" height="232" fill="#a89a85" opacity=".08" stroke="#a89a85" stroke-width="2"/>`+CK.floor(352,10,710)+`<path d="M${CX+25} 230 H710" stroke="#8a7f70" stroke-width="3"/>`+CK.L(22,142,"BASEMENT (CAZ)",{a:"start",size:12})+CK.L(20,40,"OUTDOORS "+S.out+"°F",{a:"start",size:13});
 s+=`<rect x="${CX-25}" y="${top}" width="50" height="${352-top}" fill="url(#zBrick)" stroke="#6b3a2a"/><rect x="${CX-13}" y="${top}" width="26" height="${352-top-10}" fill="#3a2f2a" opacity=".85"/>`;
 s+=`<rect x="${CX-11}" y="${top+2}" width="22" height="${CY+12-top}" fill="#e0662a" opacity="${.25+.5*Math.min(1,R.avail/10)}"/>`;
 if(S.block>0)s+=`<ellipse cx="${CX}" cy="${top+4}" rx="18" ry="${3+S.block/12}" fill="#7a5b3a"/><path d="M${CX-16} ${top+2} l30 5 M${CX-14} ${top+7} l26 -6" stroke="#4a3520" stroke-width="1.6"/>`;
 s+=CK.wh(290,202,{w:64,h:148,hw:30});
 s+=CK.ventV(322,CY+4,172,10)+CK.ventH(322,CX-13,CY,10)+`<rect x="314" y="${CY-10}" width="16" height="20" fill="url(#r_galvV)"/>`;
 if(!R.spill)s+=CK.arr(`M${CX} ${CY-4} V${top+20}`,CK.FLUE)+CK.arr(`M360 ${CY} H520`,CK.FLUE);
 s+=CK.smoke(322,198,R.spill,30);
 s+=CK.mano(390,186,(R.d>=0?"−":"+")+Math.abs(R.d/CK.PA).toFixed(3),"",{w:100})+rHose(`M440 186 C440 172 446 168 446 ${CY+8}`,"#2a2f33",3)+`<circle cx="446" cy="${CY+8}" r="3" fill="#111"/>`;
 s+=CK.L(440,266,"DRAFT IN THE CONNECTOR",{size:11});
 if(S.caz>0)s+=CK.L(22,166,"HOUSE −"+K.f1(S.caz)+" PA",{a:"start",size:12,fill:"var(--bad)"});
 s+=CK.L(140,330,R.spill?"SPILLING AT THE HOOD":"DRAWING",{size:14,fill:R.spill?"var(--bad)":"#2f8f3a"});
 return s};
const ex={out:30,h:20,tv:250,caz:0,block:0};
const cat=(t,c,a,b,m)=>({t,c,inner:K.txt(14,52,a,{a:"start"})+K.txt(14,76,b,{a:"start"})+CK.L(14,110,m,{a:"start",size:12})});
const steps=[
 {t:"Hot gas rises: that's draft",
  body:`<p>Hot flue gas is lighter than the cold air outside. A column of it in a chimney is pushed up by the heavier air around it, the same way a cork floats. That push is <b>draft</b>: the chimney pulls a slight vacuum on the appliance.</p><p>Draft gets <b>stronger</b> with a <b>taller</b> chimney, <b>hotter</b> flue gas and <b>colder</b> outdoor air. It's tiny: measured in hundredths of an inch of water column, or in <b>pascals</b> (1 in. w.c. = 249 Pa).</p>`,
  math:`<p>Theoretical draft (Pa) ≈ 3465 × height (m) × (1/T<sub>outdoor</sub> − 1/T<sub>flue</sub>), temperatures in kelvin.</p><p>20 ft (6.1 m), 30°F outside, 250°F vent gas: 3465 × 6.1 × (1/272 − 1/394) ≈ 24 Pa (0.10 in. w.c.) before friction and the draft hood's dilution air take their share.</p>`,
  draw:()=>{const S=ex;return scene(model(S),S)+CK.co(592,120,622,80,"WARM GAS",{a:"start",size:12})+CK.L(626,98,"RISES",{a:"start",size:12})}},
 {t:"Natural draft and the draft hood",
  body:`<p>An <b>atmospheric</b> water heater, boiler or older furnace relies on draft alone. On top sits a <b>draft hood</b> (draft diverter): an open skirt where room air joins the flue gas.</p><ul><li>It keeps changing chimney draft from pulling on the burner.</li><li>It lets a downdraft escape instead of blowing out the flame.</li><li>It's where flue gas <b>spills</b> into the room when the vent can't carry it.</li></ul><p>Typical draft in the connector once it's warm: about <b>−0.02 to −0.04 in. w.c.</b></p>`,
  draw:()=>{let s=CK.floor(352)+CK.wh(300,170,{w:90,h:180,hw:40})+CK.ventV(345,40,138,12);
   s+=CK.arr("M345 160 V60",CK.FLUE)+CK.arr("M250 150 C285 150 300 140 318 126",CK.AIR)+CK.arr("M440 150 C405 150 390 140 372 126",CK.AIR);
   s+=CK.co(372,152,520,170,"DRAFT HOOD",{a:"start"})+CK.L(170,140,"ROOM AIR JOINS",{size:12,fill:CK.AIR})+CK.L(170,158,"(DILUTION AIR)",{size:12,fill:CK.AIR})+CK.L(345,30,"FLUE GAS + DILUTION AIR",{size:12,fill:CK.FLUE});
   s+=CK.mano(500,60,"−0.03","",{w:96})+rHose("M500 90 C470 90 380 90 357 90","#2a2f33",3)+CK.L(548,146,"NORMAL: −0.02 TO −0.04",{size:12});return s}},
 {t:"Fan-assisted: the inducer pulls",
  body:`<p>An 80% furnace has an <b>inducer</b> (draft fan). It pulls flue gas through the heat exchanger and pushes it into the vent, so the furnace no longer depends on chimney draft to burn right. There's <b>no draft hood</b>.</p><p>Above the inducer, the vent is still meant to run at <b>neutral or negative</b> pressure: the warm gas rises up a Type B vent or lined chimney like natural draft. That's why an 80% fan-assisted furnace is still <b>Category I</b>, and why its vent must be sized and pitched correctly.</p>`,
  draw:()=>{let s=CK.floor(352)+CK.furnace(270,150,{w:130,h:200,ind:true});s+=CK.ventV(335,26,118,11)+CK.fit(335,124,15);
   s+=CK.arr("M335 110 V36",CK.FLUE)+CK.co(359,132,470,140,"INDUCER: PULLS THROUGH THE HEAT EXCHANGER",{a:"start",size:12})+CK.co(346,60,470,70,"TYPE B VENT: STILL NEGATIVE",{a:"start",size:12})+CK.co(330,206,200,240,"BURNERS",{a:"end"})+CK.L(560,300,"CATEGORY I",{size:18,fill:"#2f6fd6"})+K.txt(560,326,"same venting rules as natural draft");return s}},
 {t:"Four vent categories",
  body:`<p>The fuel gas code sorts vented appliances by two questions:</p><ul><li>Is the vent under <b>positive</b> pressure (pushed by a fan) or <b>not</b>?</li><li>Is the flue gas cool enough to make <b>excessive condensate</b> in the vent?</li></ul><p>The category decides the vent material. Category III and IV vents are under pressure, so they must be <b>gas-tight</b> and are made of what the appliance maker lists. A draft hood only ever appears on Category I.</p>`,
  draw:()=>K.cards([cat("I: NEGATIVE, NON-CONDENSING","#2f6fd6","Atmospheric water heaters, draft-hood","and 80% fan-assisted furnaces","TYPE B VENT, LINED CHIMNEY"),cat("II: NEGATIVE, CONDENSING","#7a5cd0","Rare: some commercial boilers","","MATERIAL BY THE MAKER"),
   cat("III: POSITIVE, NON-CONDENSING","#9a6f1f","Power-vent water heaters,","some unit heaters","GAS-TIGHT STAINLESS (E.G. AL29-4C)"),cat("IV: POSITIVE, CONDENSING","#c0392b","90%+ furnaces, condensing boilers,","most tankless heaters","PVC, CPVC, PP OR STAINLESS PER MAKER")],{h:160})},
 {t:"Measuring draft",
  body:`<p>Drill a small hole in the connector about <b>1 to 2 ft past the draft hood</b> and read it with a digital manometer after the appliance has run several minutes. A cold vent reads weak and often spills briefly at start-up.</p><p>The minimum depends on the weather, because cold days draft better. One state code (Vermont, after BPI) sets the minimum by outdoor temperature, from −2.5 Pa below 10°F to −0.5 Pa above 90°F.</p><p>Category III and IV vents aren't draft-tested this way: you check that they're sealed and terminated as the maker requires.</p>`,
  math:`<p>Minimum draft (Pa) = outdoor °F ÷ 40 − 2.75, between 10 and 90°F. At 30°F: 0.75 − 2.75 = −2.0 Pa = −0.008 in. w.c.</p><p>That's a pass line, not a target. A healthy warm vent usually reads several times stronger.</p>`,
  draw:()=>K.chart({x:100,y:40,w:540,h:250,X:[-10,100],Y:[-12,0],xt:[0,20,40,60,80,100],yt:[-12,-10,-8,-6,-4,-2,0],xf:v=>v+"°F",yf:v=>v,xl:"outdoor temperature",yl:"draft, Pa",title:"DRAFT: MORE NEGATIVE IS STRONGER",
   bands:[{y0:-10,y1:-5,c:"#2f8f3a"}],series:[{f:CK.minDraft,c:"#c0392b",lbl:"MINIMUM (VERMONT RBES)",lblAt:-8,a:"start",dx:6,dy:20},{f:t=>-model({...ex,out:t}).d,c:"#2f6fd6",dash:"6 4",lbl:"THIS LESSON'S 20 FT VENT",lblAt:30,a:"start",dx:6,dy:26}],n:40})+CK.L(636,110,"−0.02 TO −0.04 IN. W.C. (5 TO 10 PA)",{a:"end",size:12,fill:"#2f8f3a"})},
 {t:"What kills draft",
  body:`<p>Draft is weak to begin with, so it doesn't take much to lose it:</p><ul><li><b>Warm weather</b> and a <b>short</b> or <b>cold</b> exterior chimney.</li><li>An <b>oversized</b> chimney after a furnace was removed, leaving a small water heater alone in a big flue.</li><li>A <b>blocked</b> cap, nest or collapsed liner.</li><li>A house pulled <b>negative</b> by exhaust fans and dryers. A few pascals can beat the chimney.</li></ul><p>When draft is lost, flue gas comes out the draft hood into the house.</p>`,
  draw:()=>{const S={...ex,out:80,h:15,caz:5};return scene(model(S),S)}}];
const see=K.see({init:{...ex},
 sliders:[["out","Outdoor temperature",-10,95,5,v=>v+"°F"],["h","Vent height",10,40,1,v=>v+" ft"],["tv","Average vent gas temperature",150,400,10,v=>v+"°F"],["caz","House depressurization",0,10,0.5,v=>v?"−"+K.f1(v)+" Pa":"none"],["block","Chimney cap blocked",0,90,10,v=>v+"%"]],
 model,draw:(R,S)=>scene(R,S),
 reads:R=>[["Draft",fmtD(R.d),!R.pass],["Draft, Pa",(R.d>=0?"−":"+")+K.f1(Math.abs(R.d))+" Pa",!R.pass],["Minimum here",K.f1(R.min)+" Pa"],["Test",R.pass?"passes":"fails",!R.pass],["Hood",R.spill?"spilling":"drawing",R.spill],["Stack, no losses",K.f0(R.theo)+" Pa"]],
 note:(R,S)=>R.spill?"The chimney can't overcome the house and the restriction: flue gas is coming out the draft hood.":!R.pass?"Drawing, but weaker than the minimum for this weather.":R.inwc<=-0.02?"Healthy draft for a draft-hood appliance.":"Passes, but weak. Watch it on warm days or with the fans on.",
 log:[["Out",(R,S)=>S.out+"°F"],["Ht",(R,S)=>S.h],["House",(R,S)=>S.caz?"−"+S.caz:"0"],["Draft",R=>fmtD(R.d).replace(" in. w.c.","")],["Hood",R=>R.spill?"spill":"ok"]]});
const tasks=[
 K.goal({t:"A warm day with a short vent",intro:"Outdoors <b>85°F</b>, <b>15 ft</b> vent, vent gas <b>250°F</b>, cap clear. Raise the house depressurization to the <b>first</b> step where the draft test fails.",
  check:(S,R)=>S.out!==85||S.h!==15||S.tv!==250||S.block!==0?"Set 85°F, 15 ft, 250°F and a clear cap.":R.pass?`Still passes at −${K.f1(S.caz)} Pa. Keep going.`:!model({...S,caz:S.caz-0.5}).pass?"It fails here, but it already failed one step back. Find the first failing step.":true,
  ok:(S,R)=>`Fails at only −${K.f1(S.caz)} Pa of house depressurization: a bath fan and a dryer can do that in a tight house.`}),
 K.goal({t:"Bird's nest",intro:"30°F outside, <b>20 ft</b> vent, 250°F vent gas, no depressurization. Block the cap until the water heater <b>spills</b>, and <b>log</b> it.",
  check:(S,R,L)=>L.some(l=>l.R.spill&&l.S.caz===0&&l.S.out===30&&l.S.h===20&&l.S.tv===250)?true:"Log a spilling reading at 30°F, 20 ft, 250°F with no house depressurization.",
  ok:()=>"A good chimney can still be choked shut at the top. Always look at the cap when draft is weak in cold weather."}),
 K.caseTask({t:"Service call: water heater spills, sometimes",intro:"Atmospheric water heater in a newly air-sealed house. The homeowner smells exhaust in the basement on laundry day.",
  state:{out:45,h:20,tv:250,caz:6,block:0},model,draw:(R,S)=>scene(R,S),
  reads:()=>{const a=model({out:45,h:20,tv:250,caz:0,block:0}),b=model({out:45,h:20,tv:250,caz:6,block:0});return [["Draft, fans off",fmtD(a.d)],["Draft, dryer + hood on",fmtD(b.d),true],["Basement vs outdoors, fans on","−6.0 Pa",true],["Smoke at the hood, fans on","blows out"]]},
  actions:[["Look at the chimney cap",()=>"Clear. Liner intact."],["Clock the water heater",()=>"40,000 Btu/h, matches the plate."]],
  causes:[["caz","Exhaust fans depressurize the basement"],["block","Blocked chimney"],["over","Overfired water heater"],["cold","Cold, oversized chimney"]],ans:"caz",
  why:"Draft is fine with the fans off and lost when the dryer and range hood run. The tighter house can't supply their air, so it comes down the chimney. Add make-up air or reduce the exhaust; the next lesson tests it properly.",hint:"Compare the fans-off and fans-on readings. What changes between them?"})];
window.LESSON={id:"comb-draft",sec:"Combustion and gas",secHref:"/combustion/",title:"Draft and vent categories",lead:"Why hot flue gas rises, how draft hoods and inducers work, what Categories I to IV mean, and how to read draft in inches of water column.",
 steps,see,tryIntro:"Two setups in See it, then a service call.",tasks,
 job:K.job({read:["<b>Draft</b> in the connector 1 to 2 ft past the draft hood, after several minutes of firing.","<b>Outdoor temperature</b> (sets the minimum).","<b>Spillage</b> at the hood relief with smoke or a mirror.","<b>Vent category and material</b> on the rating plate and in the manual."],
  table:[["Appliance","Vent pressure","Typical reading"],["Draft-hood (Category I)","Negative","About −0.02 to −0.04 in. w.c. once warm"],["80% fan-assisted (Category I)","Negative above the inducer","Vent must draw; no hood"],["90%+ condensing (Category IV)","Positive","Vent is pushed; about +0.02 to +0.08 in. w.c."],["Minimum, draft-hood appliance","","−2.0 Pa at 30°F (Vermont / BPI style)"]],tableT:"Draft numbers",
  steps:["Let the vent warm up (5 minutes or more).","Check spillage at the hood relief: it should stop within a minute of firing.","Read draft in the connector with a manometer referenced to the room.","Compare to the minimum for today's outdoor temperature.","Weak: check the cap, liner, connector pitch and size, then house depressurization."],stepsT:"Checking draft",
  safety:["A spilling appliance puts CO into the house. Watch room CO while testing.","Never leave a blocked-vent switch jumpered.","Plug every test hole in the connector when you're done."],
  mistakes:["Reading draft in the first minute while the vent is still cold.","Venting a Category III or IV appliance into a masonry chimney or B-vent.","Leaving a water heater alone in an oversized chimney after the furnace is replaced with a 90%.","Forgetting that warm days and running fans weaken draft."]}),
 sources:[["The Engineering Mindset: density of gases (why warm, light gas rises)","https://theengineeringmindset.com/density-of-gases/"],["HVAC School: what to do with your micro manometer (draft ranges by appliance)","https://hvacrschool.com/what-to-do-with-your-micro-manometer"],["Structure Tech: gas appliance categories I to IV (IFGC definitions)","https://www.structuretech.com/gas-appliance-categories/"],["Vermont RBES Appendix RA: minimum draft by outdoor temperature, where to measure","https://www.efficiencyvermont.com/Media/Default/docs/trade-partners/code-support/2020-RBES-Appendix-RA_CAZ.pdf"],["Appliance categories, vent materials and connectors (exam guide)","https://open-exam-prep.com/study-guides/md-plumber/gas-venting-combustion/md-plumber-appliance-categories-vent-materials"]]};
})();
