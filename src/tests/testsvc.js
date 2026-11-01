// Service call: every visible fault has a complaint, and a call runs, scores and repairs for each fault.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const f of ['full.html','fullctl.html','fullheat.html','fullmotor.html','fullboiler.html','fullair.html','fullcomb.html']){
 const p=await b.newPage();p.on('pageerror',e=>errs.push(f+': '+e.message));
 await p.goto('file://'+process.cwd()+'/'+f);await p.waitForTimeout(300);
 const r=await p.evaluate(async()=>{const $=id=>document.getElementById(id);$("discOk")?.click();const R=window.__rt,out=[];
  for(const id of Object.keys(R.SIMS)){(document.querySelector(`[data-sim="${id}"]`)||document.getElementById('sim'+id[0].toUpperCase()+id.slice(1)))?.click();const sim=R.SIMS[id];
   const vis=sim.faults.filter(x=>!sim.hidden.includes(x[0])).map(x=>x[0]);const C=R.svc.C[id]||{};
   const missing=vis.filter(k=>!C[k]),extra=Object.keys(C).filter(k=>!vis.includes(k));
   let bad=[];
   for(const k of vis){R.svc.start(sim,k);if(!sim.F[k]||sim.call.f[0]!==k)bad.push(k+':notset');R.step(400);
    const wrongK=vis.find(x=>x!==k);R.svc.guess(sim,wrongK);R.svc.hint(sim);R.svc.guess(sim,k);
    if(sim.call.done!=="won"||sim.call.score!==60||sim.F[k])bad.push(k+':score'+sim.call.score)}
   // UI path
   $("svcNew").click();const ok=!!$("svcPick")&&$("svcPick").options.length>=vis.length-1;$("svcQuit").click();
   out.push({id,n:vis.length,missing,extra,bad,ui:ok,best:localStorage.getItem("rt-svc-"+id)})}
  return out});
 r.forEach(x=>console.log(f.padEnd(14),JSON.stringify(x)));await p.close()}
console.log('ERR',errs);await b.close()})();
