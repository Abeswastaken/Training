const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+process.cwd()+'/fullladder.html');await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('discOk').click());
const ev=f=>p.evaluate(f);const st=()=>ev(()=>JSON.stringify(window.__ld.coilOn)+" energized="+window.__ld.energized.size);
console.log('seal idle:',await st());
// press START via clicking element
await ev(()=>{const L=window.__ld;const r=L.rungs[0];r.cells[1].st.down=true;r.cells[1].st.t=0});await p.waitForTimeout(400);
console.log('start pressed:',await st());await p.waitForTimeout(1200);console.log('after release (seal):',await st());
await p.screenshot({path:'l1.png'});
await ev(()=>{const r=window.__ld.rungs[0];r.cells[0].st.down=true;r.cells[0].st.t=0});await p.waitForTimeout(400);console.log('stop:',await st());
// restart, trip OL
await ev(()=>{const r=window.__ld.rungs[0];r.cells[1].st.down=true;r.cells[1].st.t=0});await p.waitForTimeout(400);
await ev(()=>{window.__ld.motorOL.MTR1=true});await p.waitForTimeout(400);console.log('OL trip:',await st());
await ev(()=>{window.__ld.motorOL.MTR1=false});
// AC
await ev(()=>{window.__ld.loadEx('ac')});await p.waitForTimeout(400);console.log('ac cool:',await st());
await ev(()=>{window.__ld.rungs[0].cells[1].st.trip=true});await p.waitForTimeout(400);console.log('ac hps trip:',await st());
await p.screenshot({path:'l2.png'});
// timer
await ev(()=>{window.__ld.loadEx('td');window.__ld.rungs[0].cells[0].st.on=true});await p.waitForTimeout(2000);console.log('td 2s:',await st());await p.waitForTimeout(3800);console.log('td 5.8s:',await st());
// short
await ev(()=>{window.__ld.loadEx('short');window.__ld.rungs[0].cells[0].st.on=true});await p.waitForTimeout(400);console.log('short power:',await ev(()=>window.__ld.power),await ev(()=>document.getElementById('mT').textContent));
await p.screenshot({path:'l3.png'});
await ev(()=>document.getElementById('mOk').click());
// drag test: add rung and drag motor lamp
await ev(()=>{window.__ld.loadEx('seal')});await p.waitForTimeout(300);
await p.click('#addRung');
const pal=await p.$('[data-add="lamp"]');await pal.scrollIntoViewIfNeeded();const pb=await pal.boundingBox();
const cells=await p.$$('.cell[data-r="4"][data-w="m"]');const cb=await cells[5].boundingBox();
await p.mouse.move(pb.x+10,pb.y+10);await p.mouse.down();await p.mouse.move(pb.x+40,pb.y+40,{steps:5});await p.mouse.move(cb.x+cb.width/2,cb.y+cb.height/2,{steps:10});await p.mouse.up();
await p.waitForTimeout(300);console.log('dragged:',await ev(()=>window.__ld.rungs[4].cells.map(c=>c&&c.k)));
// tap-place
await p.click('[data-add="no"]');const c2=await p.$$('.cell[data-r="4"][data-w="m"]');await c2[0].click();await p.waitForTimeout(400);
console.log('tapped:',await ev(()=>window.__ld.rungs[4].cells.map(c=>c&&(c.k+":"+c.tag))),await st());
await p.screenshot({path:'l4.png'});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:'l5.png',fullPage:true});
console.log('ERR',errs);await b.close()})();
