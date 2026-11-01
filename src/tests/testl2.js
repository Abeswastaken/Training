const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullladder.html');await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('discOk').click());
const ev=(f,a)=>p.evaluate(f,a);
const st=()=>ev(()=>{const L=window.__ld;return JSON.stringify(L.coilOn)+" room="+L.LTS.room.toFixed(1)+" C="+L.LTS.callC+" H="+L.LTS.callH});
await p.selectOption('#ex','tstat24');await p.waitForTimeout(300);
console.log('cool 77:',await st());
await p.click('[data-adj="room:2"]');await p.waitForTimeout(400);console.log('room 79:',await st());
await p.screenshot({path:'lt1.png',fullPage:true});
await p.waitForTimeout(14000);console.log('after 14s:',await st());
await p.click('[data-fan="on"]');await p.waitForTimeout(400);console.log('fan on:',await st());
await p.click('[data-fan="auto"]');await p.click('[data-sys="heat"]');await ev(()=>{window.__ld.LTS.room=64});await p.waitForTimeout(500);console.log('heat 64:',await st());
await p.click('[data-sys="auto"]');await ev(()=>{window.__ld.LTS.room=80});await p.waitForTimeout(500);console.log('auto 80:',await st());
console.log(await ev(()=>[...document.querySelectorAll('#log div')].slice(0,6).map(d=>d.textContent)));
// tap parts for cards
for(const k of ["tfa","mcoil","hps","tterm","motor","heat"]){
 const ok=await ev(k=>{const L=window.__ld;let id=null;L.rungs.forEach(r=>{[...r.cells,...(r.branch?r.branch.cells:[])].forEach(c=>{if(c&&c.k===k&&!id)id=c.id})});if(!id)return false;document.querySelector(`.el[data-id="${id}"]`).dispatchEvent(new MouseEvent("click",{bubbles:true}));return true},k);
 if(!ok){await ev(k=>window.__ld.loadEx(k==="hps"?"ac":"seal"),k);continue}
 await p.waitForTimeout(250);const el=await p.$('#elSheet');await el.screenshot({path:'lc_'+k+'.png'});}
await ev(()=>window.__ld.loadEx('ac'));await p.waitForTimeout(300);
await ev(()=>{const L=window.__ld;const c=L.rungs[0].cells[1];document.querySelector(`.el[data-id="${c.id}"]`).dispatchEvent(new MouseEvent("click",{bubbles:true}))});await p.waitForTimeout(250);await (await p.$('#elSheet')).screenshot({path:'lc_hps.png'});
console.log('ERR',errs);await b.close()})();
