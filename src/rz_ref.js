/* ---- refrigerant choice (split AC and heat pump). The physics runs on R-410A saturation
   temperatures; pressures shown and switch settings are converted through the same saturation
   temperature. Sources: Arkema Forane PT chart (R-22, R-134a, R-404A); A2L PT chart from
   Goodman/Chadwell 04-24 (R-32, R-454B liquid/vapor). ---- */
const REFS={
 "R-410A":null,
 "R-22":{n:"R-22",t:[[-40,0.6],[-20,10.2],[0,24.0],[10,32.8],[20,43.1],[30,55.0],[40,68.6],[50,84.1],[60,101.6],[70,121.4],[80,143.6],[90,168.4],[100,195.9],[110,226.4],[120,260.0],[130,296.9],[140,337.4],[150,381.7]]},
 "R-134a":{n:"R-134a",t:[[-40,-7.3],[-20,-1.8],[0,6.5],[10,11.9],[20,18.4],[30,26.1],[40,35.0],[50,45.4],[60,57.4],[70,71.1],[80,86.7],[90,104.3],[100,124.2],[110,146.4],[120,171.2],[130,198.7],[140,229.2],[150,262.9]]},
 "R-404A":{n:"R-404A",t:[[-40,4.9],[-20,16.8],[0,33.7],[10,44.3],[20,56.6],[30,70.7],[40,86.9],[50,105.3],[60,126.0],[70,149.3],[80,175.4],[90,204.5],[100,236.8],[110,272.5],[120,312.1],[130,355.7],[140,403.7],[150,456.8]]},
 "R-32":{n:"R-32",t:[[-38,12.4],[-20,26.8],[0,49.2],[10,63.5],[20,80.0],[30,99.1],[40,121.0],[50,145.8],[60,174.0],[70,205.8],[80,241.5],[90,281.3],[100,325.7],[110,374.9],[120,429.3],[130,489.5],[140,555.8],[150,628.8]]},
 "R-454B":{n:"R-454B",glide:1,t:[[-38,11.2],[-20,24.9],[0,46.1],[10,59.5],[20,75.0],[30,92.9],[40,113.3],[50,136.6],[60,162.9],[70,192.5],[80,225.6],[90,262.5],[100,303.6],[110,348.9],[120,399.1],[130,454.2],[140,514.9],[150,581.4]],
   v:[[-38,10.0],[-20,23.0],[0,43.3],[10,56.1],[20,70.9],[30,88.1],[40,107.7],[50,130.1],[60,155.4],[70,184.0],[80,216.1],[90,251.9],[100,291.6],[110,336.4],[120,385.8],[130,440.5],[140,501.0],[150,568.2]]}};
const REF_ORDER=["R-410A","R-22","R-134a","R-404A","R-32","R-454B"];
function ptI(tab,T){if(T<=tab[0][0])return tab[0][1]+(T-tab[0][0])*(tab[1][1]-tab[0][1])/(tab[1][0]-tab[0][0]);for(let i=1;i<tab.length;i++)if(T<=tab[i][0]){const[a,pa]=tab[i-1],[b,pb]=tab[i];return pa+(pb-pa)*(T-a)/(b-a)}const n=tab.length,[a,pa]=tab[n-2],[b,pb]=tab[n-1];return pb+(T-b)*(pb-pa)/(b-a)}
function ptT(tab,P){if(P<=tab[0][1])return tab[0][0]+(P-tab[0][1])*(tab[1][0]-tab[0][0])/(tab[1][1]-tab[0][1]);for(let i=1;i<tab.length;i++)if(P<=tab[i][1]){const[a,pa]=tab[i-1],[b,pb]=tab[i];return a+(b-a)*(P-pa)/(pb-pa)}const n=tab.length,[a,pa]=tab[n-2],[b,pb]=tab[n-1];return b+(P-pb)*(b-a)/(pb-pa)}
// side "lo" uses the vapor (dew) curve, "hi" the liquid (bubble) curve
const refTab=(r,side)=>side==="lo"&&r.v?r.v:r.t;
function refP(sim,P,side){const r=REFS[sim.ref||"R-410A"];return r?ptI(refTab(r,side),tsat(P)):P}
function refI(sim,P,side){const r=REFS[sim.ref||"R-410A"];return r?psat(ptT(refTab(r,side),P)):P}
function refS(sim,P,side){const v=refP(sim,P,side);return v<0?`${f0(-v/0.491)} inHg`:`${f0(v)} psig`}
function refSet(sim,name){const old=sim.ref||"R-410A";if(old===name)return;
 // keep the switch trip temperatures: convert through the old refrigerant to R-410A, then to the new one
 const hi=refI(sim,sim.V.hps,"hi"),lo=refI(sim,sim.V.lps,"lo");
 sim.ref=name;sim.V.hps=Math.round(refP(sim,hi,"hi")/5)*5;sim.V.lps=Math.max(0,Math.round(refP(sim,lo,"lo")));refSliders(sim);
 try{localStorage.setItem("rt-ref-"+sim.id,name)}catch(e){}}
function refSliders(sim){const name=sim.ref||"R-410A";sim.sliders.forEach(s=>{if(!s.base)s.base={min:s.min,max:s.max,v:s.v,n:s.n&&s.n.slice(),note:s.note};
  if(s.k!=="hps"&&s.k!=="lps")return;const side=s.k==="hps"?"hi":"lo",c=P=>Math.round(refP(sim,P,side));
  if(name==="R-410A"){Object.assign(s,{min:s.base.min,max:s.base.max,v:s.base.v,n:s.base.n,note:s.base.note});return}
  s.min=Math.max(0,Math.floor(c(s.base.min)/10)*10);s.max=Math.ceil(c(s.base.max)/10)*10;s.v=c(s.base.v);s.n=s.base.n.map(c);s.step=s.k==="hps"?5:1;
  s.note=`${name}: about ${s.n[0]}–${s.n[1]} psig here (same trip temperatures as the usual R-410A settings). Check the data plate.`})}
const refSwitch={l:S=>`Refrigerant: ${cur.ref||"R-410A"}`,on:()=>(cur.ref||"R-410A")!=="R-410A",act(sim){const i=REF_ORDER.indexOf(sim.ref||"R-410A");refSet(sim,REF_ORDER[(i+1)%REF_ORDER.length]);
  log(sim,`Refrigerant set to ${sim.ref}. Gauges, switch settings and the PT readings now follow ${sim.ref}.`);if(sim.ref==="R-134a"||sim.ref==="R-404A")log(sim,`${sim.ref} is not used in home AC or heat pumps (R-134a: cars and medium-temp; R-404A: commercial refrigeration). It is here for PT-chart practice.`,"w");renderControls();sim.draw(0)}};
