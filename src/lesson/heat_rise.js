/* ============ Lesson: Temperature rise ============ */
(()=>{
const LO=35,HI=65;
const M=S=>({...HK.rise({man:S.man,cfm:S.cfm,filter:S.filter/100}),S});
const f0=v=>Math.round(v).toLocaleString("en-US");
const plate=(x,y,sc=1)=>{const L=[["GAS FURNACE, CATEGORY I","",1],["INPUT","80,000 BTU/H"],["OUTPUT CAPACITY","64,000 BTU/H"],["AIR TEMP RISE","35 - 65 °F",2],["MANIFOLD (NAT. GAS)","3.5 IN. W.C."],["SUPPLY 120 V 60 HZ","< 12 A"]];
 let s=`<g transform="translate(${x} ${y}) scale(${sc})"><rect width="220" height="170" rx="6" fill="url(#zAlu)" stroke="#5f686d" stroke-width="1.4"/><rect x="6" y="6" width="208" height="158" rx="4" fill="none" stroke="#7d868c"/>`;
 L.forEach(([a,b,k],i)=>{const yy=30+i*24;if(k===1)s+=`<text x="110" y="${yy}" style="font-family:var(--display);font-size:12px;font-weight:700;fill:#1d2327;text-anchor:middle;letter-spacing:.06em">${a}</text>`;
  else s+=(k===2?`<rect x="10" y="${yy-15}" width="200" height="21" rx="3" fill="#e8c33a" opacity=".55"/>`:"")+`<text x="16" y="${yy}" style="font-family:var(--display);font-size:11px;font-weight:600;fill:#1d2327;letter-spacing:.04em">${a}</text><text x="204" y="${yy}" style="font-family:var(--mono);font-size:11px;fill:#1d2327;text-anchor:end">${b}</text>`});
 return s+"</g>"};
/* rise gauge, horizontal: x,y left end, w width, 0..100 deg F */
const gauge=(x,y,w,rise)=>{const X=v=>x+HK.clamp(v,0,100)/100*w;const ok=rise>=LO&&rise<=HI;
 let s=`<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="var(--panel-edge)" opacity=".5"/><rect x="${X(LO)}" y="${y}" width="${X(HI)-X(LO)}" height="16" fill="${HK.OK}" opacity=".45"/>`;
 [0,35,65,100].forEach(v=>s+=K.txt(X(v),y+34,v+"°",{}));
 s+=`<path d="M${X(rise)} ${y-6} V${y+22}" stroke="${ok?"var(--ink)":"var(--bad)"}" stroke-width="3"/>`+K.lbl(x,y-12,"TEMPERATURE RISE",{a:"start",size:12})+K.lbl(x+w,y-12,f0(rise)+"°F",{a:"end",size:14,fill:ok?HK.OK:"var(--bad)"});
 return s};
const scene=(R,o={})=>{let s=HK.furn({ind:true,ps:true,gv:true,flame:Math.sqrt(R.input/HK.INPUT),blower:true,uA:4,draft:1,brd:R.lim?"limit open":"heating",led:R.lim?"warn":"ok",lim:R.lim,ret:68,sup:R.Tsup,dirt:R.S?R.S.filter/100:0,hot:HK.clamp((R.Thx-120)/400,0,1),labels:o.labels||[]});
 s+=HK.thermo(372,34,f0(R.Tsup)+"°F",{len:16})+HK.thermo(180,330,"68°F",{len:16}).replace(/<rect x="146" y="300"/,'<rect x="146" y="300"');
 if(o.gauge!==false)s+=gauge(500,60,200,R.rise);
 if(o.plate)s+=plate(500,120,0.92);
 return s};
const base={cfm:1200,filter:0,man:3.5};
const steps=[
 {t:"What temperature rise is",body:`<p><b>Temperature rise</b> is how much the furnace warms the air: <b>supply air temperature minus return air temperature</b>.</p><p>Here the return is 68°F and the supply is about 117°F, so the rise is about <b>49°F</b>.</p><p>It tells you two things at once: is the burner putting in the right heat, and is the right amount of air going across the heat exchanger?</p>`,
  draw:()=>scene(M(base),{labels:["sup","filter","blower"]})},
 {t:"The range on the rating plate",body:`<p>Every furnace has an <b>air temperature rise range</b> on its rating plate. On the trainer's furnace it is <b>35 to 65°F</b>. Other furnaces have ranges such as 30 to 60 or 40 to 70, so always read the plate.</p><ul><li><b>Above</b> the range: too little air. The heat exchanger runs hot, the limit trips, and over years the steel cracks.</li><li><b>Below</b> the range: too much air or not enough fire. The air feels cool at the registers and an 80% furnace can condense flue gas inside its heat exchanger and vent.</li></ul>`,
  draw:()=>plate(80,60,1.2)+K.lbl(420,110,"RATING PLATE INSIDE THE DOOR",{a:"start",size:13})+K.txt(420,140,"rise range and input are the",{a:"start"})+K.txt(420,160,"numbers you need for this lesson",{a:"start"})+gauge(420,260,260,49)},
 {t:"The airflow formula",body:`<p>Air carries heat. For standard air:</p><p><b>Btu/h = 1.08 × cfm × ΔT</b></p><p>Turn it around to find the airflow from the rise:</p><p><b>cfm = Btu/h output ÷ (1.08 × ΔT)</b></p><p>Use the furnace's <b>output</b>, not the input. 80,000 Btu/h input at 80% is 64,000 Btu/h into the air. At a 49°F rise that is about <b>1,200 cfm</b>.</p>`,
  math:`<p>64,000 ÷ (1.08 × 49) = 1,209 cfm.</p><p>1.08 = 0.075 lb/ft³ (standard air) × 0.24 Btu/lb·°F × 60 min/h.</p><p>Check the input first (clock the meter or read the manifold pressure). If the furnace is underfired, the rise looks fine while the airflow is actually low.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:270,X:[500,2000],Y:[0,140],xt:[500,800,1100,1400,1700,2000],yt:[0,35,65,100,140],yf:v=>v+"°F",title:"RISE vs AIRFLOW AT 64,000 BTU/H OUTPUT",xl:"airflow across the heat exchanger (cfm)",
   bands:[{y0:LO,y1:HI,c:HK.OK}],series:[{f:c=>64000/(1.08*c),c:HK.HOT,lbl:"rise = output / (1.08 x cfm)",lblAt:640,a:"start",dx:6,dy:-10}],dots:[{x:1209,y:49,c:"var(--ink)",lbl:"1,209 CFM, 49°F"}]})+K.lbl(640,236,"PLATE RANGE",{a:"end",fill:HK.OK,size:13})},
 {t:"Rise too high: not enough air",body:`<p>A high rise almost always means <b>low airflow</b>. Look for:</p><ul><li>A <b>dirty filter</b> (the most common cause).</li><li>Closed or blocked supply registers, a crushed or undersized duct.</li><li>The blower on too low a speed tap, or a weak blower capacitor.</li><li>A dirty <b>AC coil</b> sitting on top of the furnace.</li></ul><p>If it gets bad enough, the <b>high limit</b> opens. The gas shuts off, the blower keeps running, and the burner relights when it cools: short cycling.</p>`,
  draw:()=>{const c=(t,S,n)=>{const r=M({...base,...S});const bad=r.rise>HI;return {t,c:bad?"var(--bad)":HK.OK,inner:K.lcd(80,80,f0(r.rise)+"°F",90)+K.txt(80,114,f0(r.cfm)+" cfm")+K.lbl(250,86,r.lim?"LIMIT TRIPS":bad?"TOO HIGH":"IN RANGE",{fill:bad?"var(--bad)":HK.OK,size:14}),note:n}};
   return K.cards([c("CLEAN FILTER, 1,200 CFM",{},"the baseline"),c("FILTER 40% LOADED",{filter:40},"airflow down about a fifth"),c("LOW SPEED TAP, 800 CFM",{cfm:800},"wrong tap after a repair"),c("FILTER PLUGGED",{filter:100},"airflow cut in half")])}},
 {t:"Rise too low: too much air or too little fire",body:`<p>A low rise has two kinds of causes:</p><ul><li><b>Too much air</b>: the blower wired to a high (cooling) speed tap for heat.</li><li><b>Too little fire</b>: low manifold gas pressure, low supply pressure, or the wrong orifices. Input goes with the square root of manifold pressure.</li></ul><p>Customers say the air \"feels cool\". On an 80% furnace, flue gas that is too cool can condense and rust the heat exchanger and vent.</p>`,
  draw:()=>K.chart({x:90,y:40,w:560,h:270,X:[2,4.5],Y:[0,100],xt:[2,2.5,3,3.5,4,4.5],xf:v=>v+'"',yt:[0,35,65,100],yf:v=>v+"°F",title:"RISE vs MANIFOLD PRESSURE",xl:"manifold gas pressure (in. w.c.)",
   bands:[{y0:LO,y1:HI,c:HK.OK,lbl:"PLATE RANGE"}],series:[{f:m=>M({cfm:1200,filter:0,man:m}).rise,c:HK.HOT,lbl:"1,200 cfm",lblAt:4.4,dy:-12},{f:m=>M({cfm:1800,filter:0,man:m}).rise,c:HK.COLD,lbl:"1,800 cfm (cooling tap)",lblAt:4.4,dy:24}],vlines:[{x:3.5,lbl:"3.5 in. w.c. spec"}]})}];
const see=K.see({init:{...base},sliders:[["cfm","Blower airflow (clean filter)",600,2000,25,v=>f0(v)+" cfm"],["filter","Filter loading",0,100,5,v=>v+"%"],["man","Manifold gas pressure",2,4.5,0.1,v=>(+v).toFixed(1)+" in. w.c."]],
 model:S=>M(S),draw:R=>scene(R,{labels:["filter","gv"]})+K.lcd(560,262,(+R.S.man).toFixed(1)+'" w.c.',100,"MANIFOLD"),
 reads:R=>[["Input",f0(R.input)+" Btu/h"],["Output",f0(R.out)+" Btu/h"],["Actual airflow",f0(R.cfm)+" cfm"],["Temperature rise",f0(R.rise)+"°F",R.rise<LO||R.rise>HI],["Supply air",f0(R.Tsup)+"°F"],["High limit",R.lim?"opens":"closed",R.lim]],
 note:R=>R.lim?"The limit opens: gas off, blower on, then it relights. That's short cycling on the limit.":R.rise>HI?"Above the plate range: find the airflow problem.":R.rise<LO?"Below the plate range: too much air or too little fire.":"Inside the plate range.",
 log:[["cfm",R=>f0(R.cfm)],["Filter",(R,S)=>S.filter+"%"],["Man.",(R,S)=>(+S.man).toFixed(1)],["Rise",R=>f0(R.rise)+"°"]]});
const C=[["filter","Dirty filter"],["fast","Blower on the high (cooling) tap"],["gas","Low manifold gas pressure"],["over","Overfired (manifold too high)"],["hx","Cracked heat exchanger"]];
const tasks=[
 K.goal({t:"Set the airflow",intro:"Clean filter, manifold at 3.5 in. w.c. Set the blower so the rise lands in the <b>middle</b> of the plate range: 45 to 55°F.",
  check:(S,R)=>S.filter>0?"Start with a clean filter.":Math.abs(S.man-3.5)>0.05?"Set the manifold to 3.5 in. w.c.":R.rise<45?"Rise is too low: less air.":R.rise>55?"Rise is too high: more air.":true,
  ok:(S,R)=>`${f0(R.rise)}°F at ${f0(R.cfm)} cfm. Check: 64,000 ÷ (1.08 × ${f0(R.rise)}) = ${f0(64000/(1.08*R.rise))} cfm.`}),
 K.caseTask({t:"Service call: it keeps shutting off",intro:"The burners run a few minutes, go out with the blower still running, then relight. The LED shows a limit code.",state:{cfm:1200,filter:90,man:3.5},model:M,draw:R=>scene(R),
  reads:R=>[["Return","68°F"],["Supply",f0(R.Tsup)+"°F"],["Rise",f0(R.rise)+"°F",true],["Manifold","3.5 in. w.c."]],
  actions:[["Pull the filter",()=>"Grey felt, no pleats visible. Hasn't been changed in a year."],["Read the blower tap",()=>"Heat is on the medium tap, as the installer set it."]],causes:C,ans:"filter",
  why:"Rise is far above 65°F with normal gas pressure: the air isn't getting through. Replace the filter and re-measure. If the limit tripped many times, inspect the heat exchanger.",hint:"High rise with normal gas pressure means a problem with the air."}),
 K.caseTask({t:"Service call: the air feels cool",intro:"After an AC install last month the customer says the heat 'blows lukewarm' and runs forever.",state:{cfm:1800,filter:0,man:3.5},model:M,draw:R=>scene(R),
  reads:R=>[["Return","68°F"],["Supply",f0(R.Tsup)+"°F"],["Rise",f0(R.rise)+"°F",true]],
  actions:[["Measure manifold pressure",()=>"3.5 in. w.c., right on spec."],["Look at the blower wiring",()=>"Heat and cool are both wired to the high-speed tap."]],causes:C,ans:"fast",
  why:"Gas input is correct, so the low rise comes from too much air. Move the heat lead back to the tap that puts the rise in the plate range, then measure again.",hint:"Gas pressure is right. What else lowers the rise?"})];
window.LESSON={id:"heat-rise",sec:"Heating",secHref:"/heating/",title:"Temperature rise",lead:"Supply minus return, the range on the rating plate, finding the airflow with cfm = output / (1.08 x rise), and what high and low rise mean.",
 steps,see,tryIntro:"Set it up in See it, then two calls.",tasks,
 job:K.job({read:["Return air temperature, in the return duct before the furnace.","Supply air temperature in the supply trunk, out of sight of the heat exchanger (radiant heat reads high) and after the AC coil.","The rise range, input and output on the rating plate.","Manifold pressure, or clock the gas meter, so you know the input is right."],
  table:[["Rise","Likely"],["Inside the plate range","OK. Write it down"],["Above the range","Low airflow: filter, registers, ducts, blower speed, dirty AC coil"],["Below the range","Too much air (wrong tap) or underfired"],["Limit trips","Rise well above the range, or overfired"]],tableT:"Reading the rise",
  steps:["Run the furnace on high fire for 10 to 20 minutes so it's steady.","Measure return and supply with the same type of probe, in the ducts away from the cabinet (one manufacturer says about 6 feet).","Subtract. Compare to the plate.","If it's off, check gas input first, then airflow.","Optional: cfm = output / (1.08 x rise) to estimate airflow."],stepsT:"How to measure",
  safety:["Supply air above the plate's maximum outlet temperature can crack the heat exchanger. A cracked heat exchanger can put carbon monoxide in the air.","Never jumper a limit that keeps tripping. It is telling you the airflow is wrong.","Turn the power off before changing blower taps."],
  mistakes:["Reading supply air right above the heat exchanger, where radiant heat adds degrees.","Using input instead of output in the formula.","Measuring before the furnace is steady.","Blaming the furnace when the filter is plugged."]}),
 sources:[["The Engineering Mindset: HVAC heat exchangers explained","https://theengineeringmindset.com/hvac-heat-exchangers-explained/"],["York furnace manual: temperature rise and cfm = output / (1.08 x rise)","https://www.manualslib.com/manual/1282748/York-Phg6a24.html?page=25"],["ACHR News: check furnace heating output in four steps","https://www.achrnews.com/articles/144125-check-furnace-heating-output-in-four-steps"],["Trane furnace installer's guide: inlet and manifold gas pressure","https://elibrary.tranetechnologies.com/public/residential-hvac/Literature/Installation/18-CH100D1-1B-EN_07012020.pdf"]]};
})();
