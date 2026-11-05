// Ladder v2: transformer + 24 V ladder, meter, slots, slot menu, move, fuse, service call, old-save migration
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
// old 6-slot save with "branch" must load
await p.addInitScript(()=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('ld-disc','1');
 localStorage.setItem('ld-board',JSON.stringify({rungs:[{cells:[{id:'e1',k:'pbno',st:{}},null,null,null,null,{id:'e2',k:'coil',tag:'CR1',st:{}}],branch:{from:0,to:0,cells:[{id:'e3',k:'no',tag:'CR1',st:{}},null,null,null,null,null]}}],idn:4}))}});
await p.goto('file://'+process.cwd()+'/fullladder.html');await p.waitForTimeout(500);
const ev=(f,a)=>p.evaluate(f,a);
const mig=await ev(()=>{const r=window.__ld.rungs[0];return [r.n,r.cells.length,r.br.length,r.br[0].cells[0].k]});
ok(mig[0]===8&&mig[2]===1&&mig[3]==='no','migrate old save '+mig);
await ev(()=>{window.__f=(k,t)=>{let x=null;window.__ld.each(c=>{if(!x&&c.k===k&&(!t||c.tag===t))x=c});return x}});
// AC with transformer
await ev(()=>window.__ld.loadEx('ac'));await p.waitForTimeout(500);
let s=await ev(()=>({lo:window.__ld.loLive,coil:window.__ld.coilOn,n:window.__ld.rungs.length,secs:window.__ld.rungs.map(r=>r.sec||'hi').join()}));
ok(s.lo&&s.coil.M1&&s.coil.BR,'ac low side live and coils on '+JSON.stringify(s));
// meter volts: across HPS (24 V side) closed = 0, tripped = 24
const hpsPts=await ev(()=>{const L=window.__ld;let ri=-1,i=-1;L.rungs.forEach((r,k)=>r.cells.forEach((c,j)=>{if(c&&c.k==='hps'){ri=k;i=j}}));return [ri+':'+i,ri+':'+(i+1)]});
await ev(p=>{const m=window.__ld.meter;m.on=true;m.mode='v';m.red=p[0];m.black=p[1]},hpsPts);
let r=await ev(()=>window.__ld.meterReading());ok(r.txt==='0.0','closed HPS reads 0 V: '+r.txt);
await ev(()=>{window.__f('hps').st.trip=true});await p.waitForTimeout(400);
r=await ev(()=>window.__ld.meterReading());ok(r.txt==='24.0','open HPS reads 24 V: '+r.txt);
// across the 24 V rails = 24, line rails = 120
await ev(()=>{const m=window.__ld.meter;m.red='lo:L';m.black='lo:R'});r=await ev(()=>window.__ld.meterReading());ok(r.txt==='24.0','R-C 24 V: '+r.txt);
await ev(()=>{const m=window.__ld.meter;m.red='hi:L';m.black='hi:R'});r=await ev(()=>window.__ld.meterReading());ok(r.txt==='120.0','L1-N 120 V: '+r.txt);
await ev(()=>{const m=window.__ld.meter;m.red='hi:L';m.black='lo:R'});r=await ev(()=>window.__ld.meterReading());ok(r.txt==='0.0','cross supply 0: '+r.txt);
// ohms needs power off
await ev(()=>{const m=window.__ld.meter;m.mode='o';m.red='lo:L';m.black='lo:R'});r=await ev(()=>window.__ld.meterReading());ok(r.txt==='Err','ohms with power on refuses');
await ev(()=>window.__ld.setPower(false));await p.waitForTimeout(300);
r=await ev(()=>window.__ld.meterReading());ok(r.txt==='0.8','R-C reads the secondary ~0.8: '+r.txt);
// coil ohms: across the M1 coil
const coilPts=await ev(()=>{const L=window.__ld;let ri=-1;L.rungs.forEach((r,k)=>{if(r.cells[7]&&r.cells[7].tag==='M1'&&r.sec==='lo')ri=k});return [ri+':7','lo:R']});
await ev(()=>{window.__f('xfmr').f='open'});
await ev(p=>{const m=window.__ld.meter;m.red=p[0];m.black=p[1]},coilPts);r=await ev(()=>window.__ld.meterReading());
ok(r.txt==='4.4','24 V contactor coil ~4.4 ohms with secondary open: '+r.txt);
await ev(()=>{window.__f('mcoil','M1').f='open'});r=await ev(()=>window.__ld.meterReading());ok(r.txt==='OL','open coil OL: '+r.txt);
await ev(()=>{delete window.__f('mcoil','M1').f;delete window.__f('xfmr').f;window.__ld.setPower(true)});
// 24 V short blows the transformer fuse, not an arc flash
await ev(()=>{window.__f('hps').st.trip=false;const L=window.__ld;const r=L.rungs.find(r=>r.sec==='lo');r.br.push({from:0,to:7,cells:Array(14).fill(null)})});await p.waitForTimeout(500);
s=await ev(()=>({fuse:window.__f('xfmr').st.fuse,power:window.__ld.power,lo:window.__ld.loLive,t:document.getElementById('mT').textContent}));
ok(s.fuse&&s.power&&!s.lo&&/24 V short/.test(s.t),'24 V short blows fuse '+JSON.stringify(s));
await ev(()=>document.getElementById('mOk').click());
// slots + and -
await ev(()=>window.__ld.loadEx('seal'));await p.waitForTimeout(300);
await p.click('.sbtn[data-slot="2:+"]');await p.click('.sbtn[data-slot="2:+"]');
ok(await ev(()=>window.__ld.rungs[2].n)===10,'plus adds slots');
await p.click('.sbtn[data-slot="2:-"]');ok(await ev(()=>window.__ld.rungs[2].n)===9,'minus removes a slot');
// slot menu with search
await p.click('.cell[data-r="2"][data-w="m"][data-i="3"]');await p.waitForTimeout(200);
ok(await ev(()=>!document.getElementById('slotMenu').hidden),'slot menu opens');
await p.fill('#smSearch','rollout');await p.waitForTimeout(100);
const items=await ev(()=>[...document.querySelectorAll('[data-mput]')].map(b=>b.dataset.mput));ok(items.includes('rollout'),'search finds rollout '+items);
await p.fill('#smSearch','CC');const cc=await ev(()=>[...document.querySelectorAll('[data-mput]')].map(b=>b.dataset.mput));ok(cc.includes('mcoil'),'CC finds contactor '+cc);
await p.click('[data-mput="mcoil"]');await p.waitForTimeout(200);
ok(await ev(()=>window.__ld.rungs[2].cells[3]&&window.__ld.rungs[2].cells[3].k)==='mcoil','menu places part');
// branch via checkbox
await p.click('.cell[data-r="3"][data-w="m"][data-i="2"]');await p.check('#smBr');await p.click('.smCats [data-mcat="Contacts"]');await p.click('[data-mput="no"]');
ok(await ev(()=>window.__ld.rungs[3].br.length===1&&window.__ld.rungs[3].br[0].cells[2].k==='no'),'menu places on a branch');
// move/swap
const ids=await ev(()=>[window.__ld.rungs[0].cells[0].id,window.__ld.rungs[0].cells[1].id]);
await ev(()=>{const L=window.__ld;L.moveTo(L.rungs[0].cells[0].id,0,'m',1)});
const after=await ev(()=>[window.__ld.rungs[0].cells[0].id,window.__ld.rungs[0].cells[1].id]);ok(after[0]===ids[1]&&after[1]===ids[0],'move swaps');
// mouse drag a placed part to an empty slot
await ev(()=>window.__ld.loadEx('seal'));await p.waitForTimeout(300);
const lampId=await ev(()=>window.__ld.rungs[2].cells[7].id);
const elb=await (await p.$(`.el[data-id="${lampId}"]`)).boundingBox();await p.mouse.move(elb.x+elb.width/2,elb.y+elb.height/2);await p.mouse.down();await p.mouse.move(elb.x+30,elb.y+20,{steps:4});await p.waitForTimeout(100);const tgt=await (await p.$('.cell[data-r="2"][data-w="m"][data-i="5"]')).boundingBox();await p.mouse.move(tgt.x+tgt.width/2,tgt.y+tgt.height/2,{steps:8});await p.mouse.up();await p.waitForTimeout(300);
ok(await ev(()=>window.__ld.rungs[2].cells[5]&&window.__ld.rungs[2].cells[5].k)==='lamp','drag moves a placed part');
// fuse on a rung blows instead of arc flash
await ev(()=>{const L=window.__ld;L.loadEx('short');L.place('fuse',0,'m',1);L.rungs[0].cells[0].st.on=true});await p.waitForTimeout(400);
s=await ev(()=>({p:window.__ld.power,f:window.__f('fuse').st.blown}));ok(s.p&&s.f,'fuse blows on short '+JSON.stringify(s));
await ev(()=>document.getElementById('mOk').click());
// service call: start, wrong guess, right guess
for(let k=0;k<6;k++){await ev(()=>window.__ld.svcStart());await p.waitForTimeout(150);const sv=await ev(()=>window.__ld.svc&&window.__ld.svc.id);ok(!!sv,'svc starts');
 const e=await ev(()=>{const f=window.__ld.findEl(window.__ld.svc.id);return f&&f.c.f});ok(e==='open','fault set');
 await ev(()=>window.__ld.svcGuess(window.__ld.svc.id));ok(await ev(()=>window.__ld.svc)===null,'correct guess ends svc');await ev(()=>document.getElementById('mOk').click())}
// screenshots
await ev(()=>window.__ld.loadEx('tstat24'));await p.waitForTimeout(400);await ev(()=>{const m=window.__ld.meter;m.on=true;m.mode='v';m.red='lo:L';m.black='lo:R'});await p.click('#meterBtn');await p.click('#meterBtn');await p.waitForTimeout(300);
await p.screenshot({path:'l6.png',fullPage:true});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:'l7.png'});
await p.click('.cell[data-r="0"][data-w="m"][data-i="3"]',{force:true});await p.waitForTimeout(200);await p.screenshot({path:'l8.png'});
console.log('FAILS',fails);console.log('ERR',errs);await b.close()})();
