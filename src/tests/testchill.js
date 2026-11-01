const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullchill.html');await p.waitForTimeout(400);
await p.evaluate(()=>{document.getElementById('discOk')?.click()});
const ev=(f,a)=>p.evaluate(f,a);
const run=sec=>ev(n=>{const s=window.__rt.SIMS.chill;for(let i=0;i<n;i++)s.step(0.5)},Math.round(sec/0.5));
const fresh=(o={})=>ev(o=>{const s=window.__rt.SIMS.chill;s.sliders.forEach(x=>s.V[x.k]=x.v);document.getElementById('restart').click();Object.assign(s.V,o.V||{});Object.assign(s.S,o.S||{});(o.F||[]).forEach(k=>s.F[k]=true)},o);
const logs=(n=3)=>ev(n=>window.__rt.SIMS.chill.logs.slice(0,n).map(l=>l[1]).join(' | '),n);
const R=()=>ev(()=>{const s=window.__rt.SIMS.chill,S=s.S;return {st:s.stText(S),Q:Math.round(S.Qch),kwt:S.Qch>5?+(S.kW/S.Qch).toFixed(2):0,sup:+S.Tsup.toFixed(1),ret:+S.Tret.toFixed(1),ecw:+S.Tb.toFixed(1),lcw:+S.Tlc.toFixed(1),Pe:+S.Pe.toFixed(1),Pc:Math.round(S.Pc),eA:+(S.Tsup-s.ptT(S.Pe)).toFixed(1),cA:+(s.ptT(S.Pc)-S.Tlc).toFixed(1),lift:+S.lift.toFixed(1),lm:+S.liftMax.toFixed(1),fan:Math.round(S.fan*100),lv:Math.round(S.level),coc:+(S.cnd/300).toFixed(1),room:+S.Troom.toFixed(1),sc:+S.scale.toFixed(2)}});
for(const [n,o,sec] of [["base",{},1200],["load100 wb78",{V:{load:100,wb:78}},1500],["load50",{V:{load:50}},1500],["load30 tset85",{V:{load:30,tset:85,wb:72}},1500],["load15",{V:{load:15}},1500],
 ["condFoul",{F:["condFoul"],V:{load:100,wb:78}},1200],["evapFoul",{F:["evapFoul"]},900],["lowCharge",{F:["lowCharge"]},900],["noncond",{F:["noncond"]},900],["vanes",{F:["vanes"],V:{load:90}},1800],["sensor",{F:["sensor"],V:{load:30}},1800],
 ["towerFan",{F:["towerFan"]},1500],["towerFan30",{F:["towerFan"],V:{load:30,wb:68}},1500],["fill",{F:["fill"],V:{load:100,wb:78}},1500],["strainer",{F:["strainer"]},900],["makeup",{F:["makeup"]},7200],["blowdown",{F:["blowdown"]},40000],["chwPump",{F:["chwPump"]},300],
 ["sc1",{F:["condFoul","fill"],V:{load:100,wb:78}},1500]]){
 await fresh(o);await run(sec);console.log(n.padEnd(13),JSON.stringify(await R()));console.log('    ',(await logs(3)).slice(0,330))}
await fresh();await run(900);await p.screenshot({path:'chill.png'});
await p.setViewportSize({width:390,height:800});await p.waitForTimeout(200);console.log('mobile sw',await ev(()=>document.documentElement.scrollWidth));
console.log('ERR',errs);await b.close()})();
