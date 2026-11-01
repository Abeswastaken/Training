const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+process.cwd()+'/fullmotor.html');await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('discOk').click());
const ev=(f,a)=>p.evaluate(f,a);
const R=()=>ev(()=>{const s=window.__rt.SIMS.vfd,S=s.S;return `f=${S.f.toFixed(1)} n=${S.n.toFixed(0)} I=${S.I.toFixed(1)} [${S.Ia.map(x=>x.toFixed(1))}] bus=${S.bus.toFixed(0)} V=${S.Vout.toFixed(0)} hs=${S.hs.toFixed(0)} mt=${S.mt.toFixed(0)} th=${S.th.toFixed(2)} fault=${S.fault} st=${s.stText(S)}`});
const run=(sec)=>ev(n=>{window.__rt.step(n,0.5)},Math.round(sec/0.5));
const set=(o)=>ev(o=>{const s=window.__rt.SIMS.vfd;Object.assign(s.V,o.V||{});Object.assign(s.S,o.S||{});(o.F||[]).forEach(k=>s.F[k]=true)},o);
const reset=()=>ev(()=>{const s=window.__rt.SIMS.vfd;document.getElementById('restart').click()});
const logs=(n=4)=>ev(n=>window.__rt.SIMS.vfd.logs.slice(0,n).map(l=>l[1]),n);
await run(3);console.log('idle',await R());
await set({S:{cmd:true}});await run(3);console.log('accel 3s',await R());await run(30);console.log('45Hz fan 80%',await R());
await set({V:{fref:60}});await run(30);console.log('60Hz',await R());
await set({V:{fref:75}});await run(30);console.log('75Hz',await R());
await set({V:{fref:60,dec:2}});await run(15);await set({S:{cmd:false}});await run(4);console.log('fast decel stall on',await R(),await logs(3));
await run(40);
await reset();await run(2);await set({V:{dec:2},S:{cmd:true,stall:false}});await run(40);await set({S:{cmd:false}});await run(5);console.log('fast decel stall off',await R(),await logs(2));
await reset();await run(2);await set({V:{acc:1},S:{cmd:true}});await run(2);console.log('fast accel',await R());await run(20);console.log('later',await R());
await reset();await run(2);await set({S:{cmd:true},F:['fuse']});await run(30);console.log('phase loss',await R(),await logs(2));
await reset();await run(2);await set({S:{cmd:true},F:['hsfan'],V:{load:100}});await run(400);console.log('hsfan',await R(),await logs(2));
await reset();await run(2);await set({S:{cmd:true},F:['gnd']});await run(1);console.log('gnd',await R());
await reset();await run(2);await set({S:{cmd:true},F:['lead']});await run(1);console.log('lead',await R());
await reset();await run(2);await set({S:{cmd:true},F:['jam']});await run(120);console.log('jam',await R(),await logs(2));
await reset();await run(2);await set({S:{cmd:true},F:['turn']});await run(30);console.log('turn',await R());
await reset();await run(2);await set({S:{cmd:true},F:['brown'],V:{fref:60}});await run(60);console.log('brownout',await R());
// bypass
await reset();await run(2);await set({S:{bypass:true,cmd:true}});await ev(()=>window.__rt.step(5,0.02));console.log('byp 0.1s',await R());await run(15);console.log('byp run',await R());
await reset();await run(2);await set({S:{bypass:true,cmd:true},F:['fuse']});await run(20);console.log('byp single phase',await R(),await logs(3));
// disc off: bus decay & cover
await reset();await run(2);await set({S:{disc:false}});await run(60);console.log('disc off 60s',await R());await run(240);console.log('disc off 300s',await R());
// meter
console.log(await ev(()=>{const s=document.getElementById('mpt');return [...s.options].map((o,i)=>{s.value=i;window.__rt.SIMS.vfd.draw(0);return o.text+' = '+document.getElementById('mread').textContent})}));
// scenarios
for(const i of [0,1]){await ev(i=>document.querySelector(`[data-sc="${i}"]`).click(),i);await run(i?3000:120);console.log('scenario',i,await R(),await ev(()=>window.__rt.SIMS.vfd.S.dead),await logs(4))}
await ev(()=>document.getElementById('boomReset').click());
await set({S:{cmd:true}});await run(25);await p.waitForTimeout(500);await p.screenshot({path:'v1.png'});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:'v2.png',fullPage:true});
console.log('ERR',errs);await b.close()})();
