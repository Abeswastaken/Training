const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullheat.html');await p.waitForTimeout(400);
await p.evaluate(()=>{document.getElementById('discOk')?.click();document.querySelector('[data-sim=ahu]').click()});
const ev=(f,a)=>p.evaluate(f,a);
const R=()=>ev(()=>{const s=window.__rt.SIMS.ahu,S=s.S;return {st:s.stText(S),zv:+S.zv.toFixed(2),es:S.es,fire:S.fire,pump:S.pump,Tb:Math.round(S.Tb),Twc:Math.round(S.Twc),gpm:+S.gpm.toFixed(1),ewt:Math.round(S.ewt),lwt:Math.round(S.lwt),Q:Math.round(S.Q),qa:S.blowerOn?Math.round(1.08*S.cfm*(S.Tsup-S.Troom)):0,sup:Math.round(S.Tsup),room:+S.Troom.toFixed(1),fan:S.blowerOn,air:+S.air.toFixed(2),psi:+S.psi.toFixed(1)}});
const logs=(n=3)=>ev(n=>window.__rt.SIMS.ahu.logs.slice(0,n).map(l=>l[1]).join(' | '),n);
const fresh=(o={})=>ev(o=>{const s=window.__rt.SIMS.ahu;s.sliders.forEach(x=>s.V[x.k]=x.v);document.getElementById('restart').click();Object.assign(s.V,o.V||{});s.S.Troom=62;s.S.Twc=62;(o.F||[]).forEach(k=>s.F[k]=true)},o);
const run=(sec)=>ev(n=>window.__rt.step(n,0.5),Math.round(sec/0.5));
await fresh();for(const t of [10,40,120,600]){await run(t);console.log('t+'+t,JSON.stringify(await R()))}console.log(await logs(6));
// coil check vs First Co: 3 gpm 180F 1200cfm 70F -> 66.3 ; 5 gpm -> 74.3 ; 140F 3gpm -> 42.2
console.log(await ev(()=>[[3,180],[5,180],[7,180],[9,180],[3,140],[3,120]].map(([g,t])=>`${g}gpm ${t}F: ${(window.__rt.SIMS.ahu&&0)||''}`)));
for(const [name,o,sec] of [["zvMotor",{F:["zvMotor"]},120],["endSw",{F:["endSw"]},120],["circ",{F:["circ"],V:{out:5}},600],["air",{F:["air"]},300],["lowP",{F:["lowP"]},900],["strainer",{F:["strainer"]},600],
 ["boiler",{F:["boiler"]},300],["coilDirty",{F:["coilDirty"]},600],["fdelay",{F:["fdelay"]},300],["bset130",{V:{bset:130,gpm:1.5}},900],["freeze",{F:["freeze"]},300]]){
 await fresh(o);await run(sec);console.log(name.padEnd(9),JSON.stringify(await R()));console.log('          ',(await logs(3)).slice(0,280))}
await fresh();await run(300);await p.screenshot({path:'ahu.png'});
console.log('ERR',errs);await b.close()})();
