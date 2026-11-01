// Oil furnace: normal cycle numbers, then each fault's symptom.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullheat.html');await p.waitForTimeout(400);
await p.evaluate(()=>{document.getElementById('discOk')?.click();document.querySelector('[data-sim=oil]').click()});
const ev=(f,a)=>p.evaluate(f,a);
const R=()=>ev(()=>{const s=window.__rt.SIMS.oil,S=s.S;return {st:s.stText(S),P:Math.round(S.pumpP),vac:+S.vac.toFixed(1),cad:Math.round(S.cadR),gph:+S.gph.toFixed(2),lam:+S.lam.toFixed(2),smoke:+S.smoke.toFixed(1),co2:+S.co2.toFixed(1),o2:+S.o2.toFixed(1),co:Math.round(S.co),net:Math.round(S.net),eff:+S.eff.toFixed(1),br:+S.breech.toFixed(3),of:+S.over.toFixed(3),rise:Math.round(S.Tsup-S.Troom),Tpl:Math.round(S.Tpl),room:+S.Troom.toFixed(1),soot:+S.soot.toFixed(2),pool:+(S.pool*128).toFixed(2),coH:Math.round(S.coHouse),dead:S.dead,lockC:S.lockCount}});
const logs=(n=4)=>ev(n=>window.__rt.SIMS.oil.logs.slice(0,n).map(l=>l[1]),n);
const fresh=(o={})=>ev(o=>{const s=window.__rt.SIMS.oil;s.sliders.forEach(x=>s.V[x.k]=x.v);document.getElementById('restart').click();Object.assign(s.V,o.V||{});s.S.Troom=60;(o.F||[]).forEach(k=>s.F[k]=true);Object.assign(s.S,o.S||{})},o);
const run=(sec)=>ev(n=>window.__rt.step(n,0.5),Math.round(sec/0.5));
await fresh();await run(20);console.log('t20 ',JSON.stringify(await R()));await run(40);console.log('t60 ',JSON.stringify(await R()));await run(600);console.log('t660',JSON.stringify(await R()));
console.log(await logs(8));
for(const [name,o,sec] of [["air34",{V:{air:34}},600],["air80",{V:{air:80}},300],["psi100",{V:{pump:100}},300],["nozzle",{F:["nozzle"]},300],["ofilter",{F:["ofilter"]},400],["leak",{F:["leak"]},400],
 ["coupling",{F:["coupling"]},60],["motorOL",{F:["motorOL"]},60],["igniter",{F:["igniter"]},60],["gap",{F:["gap"]},120],["cad",{F:["cad"]},60],["cadLight",{F:["cadLight"]},30],
 ["water",{F:["water"]},900],["chimney",{F:["chimney"]},600],["baro",{F:["baro"]},300],["soot",{F:["soot"]},400],["blower",{F:["blower"]},600],["empty",{F:["empty"]},80],["drip",{F:["drip"]},1500]]){
 await fresh(o);await run(sec);console.log(name.padEnd(9),JSON.stringify(await R()));console.log('          ',(await logs(3)).join(' | ').slice(0,300))}
// puffback by repeated resets
await fresh({F:["igniter"]});await run(60);
for(let i=0;i<4;i++){await ev(()=>{const s=window.__rt.SIMS.oil;const r=s.resets(s.S);const b=r.find(x=>/reset/i.test(x[0]));if(b)b[1]()});await run(60)}
console.log('resets',JSON.stringify(await R()),(await logs(3)).join(' | ').slice(0,300));
await ev(()=>{const s=window.__rt.SIMS.oil;s.F.igniter=false;const r=s.resets(s.S);r.forEach(x=>{if(/30 s|reset button/i.test(x[0]))x[1]()})});await run(60);
console.log('fixed ',JSON.stringify(await R()),(await logs(3)).join(' | ').slice(0,300));
await fresh();await run(120);await p.screenshot({path:'oil.png'});
console.log('ERR',errs);await b.close()})();
