// 3-Phase Motor Control page: start/stop, reversing (+ interlock short), jog, sequence, wye-delta, swap leads, single phasing, meter, svc
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
await p.addInitScript(()=>{localStorage.setItem('ld-disc','1')});
await p.goto('file://'+process.cwd()+'/full3ph.html');await p.waitForTimeout(500);
const ev=(f,a)=>p.evaluate(f,a);
await ev(()=>{const L=window.__ld;window.__run=s=>{for(let i=0;i<s*10;i++){L.evaluate(0.1);L.p3Tick(0.1)}};
 window.__press=t=>{L.each(c=>{if((c.k==='pbno'||c.k==='pbnc')&&c.tag===t){c.st.down=true;c.st.t=0}})};window.__f=(k,t)=>{let x=null;L.each(c=>{if(!x&&c.k===k&&(!t||c.tag===t))x=c});return x}});
const M=()=>ev(()=>{const m=window.__ld.P3S.m[0];return {s:+m.s.toFixed(2),I:m.I.map(x=>+x.toFixed(1)),st:m.st,ol:!!window.__ld.motorOL.MTR1}});
// seal
await ev(()=>{window.__ld.loadEx('p3seal');window.__run(0.3);window.__press('START');window.__run(4)});
let m=await M();ok(!m.ol&&m.s>0.95&&Math.abs(m.I[0]-0.85*14)<0.5,'seal runs fwd at ~0.85 FLA '+JSON.stringify(m));
await ev(()=>{window.__ld.P3S.swap=true;window.__run(6)});m=await M();ok(m.s<-0.9,'swap leads reverses '+JSON.stringify(m));
await ev(()=>{window.__ld.P3S.swap=false;window.__run(6)});
// single phasing while running
await ev(()=>{window.__ld.P3S.fuse[2]=true;window.__run(1)});m=await M();ok(m.s>0.5&&m.I[2]===0&&m.I[0]>14&&/SINGLE/.test(m.st),'single phasing running '+JSON.stringify(m));
await ev(()=>window.__run(20));m=await M();ok(m.ol,'single phasing trips the OL '+JSON.stringify(m));
await ev(()=>document.getElementById('mOk').click());
// meter: across blown fuse F3 with contactor dropped
await ev(()=>{const L=window.__ld;L.meter.on=true;L.meter.mode='v';L.meter.red='p:L3';L.meter.black='p:F3'});let r=await ev(()=>window.__ld.meterReading());ok(r.txt==='0.0','blown fuse, contactor open: 0 V (nothing to back-feed) '+r.txt);
await ev(()=>{const L=window.__ld;L.meter.red='p:L1';L.meter.black='p:L2'});r=await ev(()=>window.__ld.meterReading());ok(r.txt==='480.0','L1-L2 480 '+r.txt);
// start single phased: hums
await ev(()=>{const L=window.__ld;L.P3S.m[0].heat=0;L.motorOL.MTR1=false;window.__press('START');window.__run(1)});m=await M();ok(m.s===0&&/humming/.test(m.st),'start single phased hums '+JSON.stringify(m));
await ev(()=>{const L=window.__ld;L.meter.red='p:L3';L.meter.black='p:F3'});r=await ev(()=>window.__ld.meterReading());ok(+r.txt>380&&+r.txt<440,'across blown fuse with motor connected ~0.87V '+r.txt);
await ev(()=>window.__run(8));m=await M();ok(m.ol,'stalled single phase trips OL '+JSON.stringify(m));
await ev(()=>{document.getElementById('mOk').click();document.getElementById('p3fuses').click();document.getElementById('p3olr').click()});
// 208 V colors + amps
await p.click('[data-p3sup="208"]');await ev(()=>{window.__press('START');window.__run(4)});m=await M();ok(Math.abs(m.I[1]-0.85*30.8)<0.6,'208 V FLA 30.8 '+JSON.stringify(m));
await ev(()=>{window.__press('STOP');window.__run(6)});m=await M();ok(Math.abs(m.s)<0.1,'stop coasts down '+JSON.stringify(m));
await p.click('[data-p3sup="480"]');
// reversing
await ev(()=>{window.__ld.loadEx('p3rev');window.__run(0.3);window.__press('FWD');window.__run(4)});m=await M();ok(m.s>0.95,'FWD '+JSON.stringify(m));
await ev(()=>{window.__press('REV');window.__run(0.5)});let co=await ev(()=>({...window.__ld.coilOn}));ok(co.R&&!co.F,'REV button drops F (pushbutton interlock) and pulls R '+JSON.stringify(co));
await ev(()=>window.__run(6));m=await M();ok(m.s<-0.9,'motor reverses '+JSON.stringify(m));
// remove interlocks -> short
await ev(()=>{const L=window.__ld;L.loadEx('p3rev');L.each(c=>{if(c.k==='nc'||(c.k==='pbnc'&&c.tag!=='STOP'))c.k='sw',c.st.on=true});window.__run(0.3);window.__press('FWD');window.__run(0.5);window.__press('REV');window.__run(0.5)});
let f=await ev(()=>window.__ld.P3S.fuse);ok(f[0]&&f[2],'F+R together blows fuses '+f);await ev(()=>{document.getElementById('mOk').click();document.getElementById('p3fuses').click()});
// jog
await ev(()=>{window.__ld.loadEx('p3jog');window.__run(0.3);window.__f('sel').st.on=false;window.__press('START');window.__run(0.3)});co=await ev(()=>window.__ld.coilOn.M);ok(co,'jog runs while held');
await ev(()=>window.__run(1.5));co=await ev(()=>!!window.__ld.coilOn.M);ok(!co,'jog stops on release');
await ev(()=>{window.__f('sel').st.on=true;window.__press('START');window.__run(1.5)});co=await ev(()=>!!window.__ld.coilOn.M);ok(co,'RUN latches');
// sequence
await ev(()=>{window.__ld.loadEx('p3seq');window.__run(0.3);window.__press('START');window.__run(2)});let s2=await ev(()=>[window.__ld.coilOn.M1,!!window.__ld.coilOn.M2]);ok(s2[0]&&!s2[1],'seq M1 first');
await ev(()=>window.__run(8));s2=await ev(()=>[window.__ld.coilOn.M2,+window.__ld.P3S.m[1].s.toFixed(2),window.__ld.P3S.m[1].I[0]]);ok(s2[0]&&s2[1]>0.9&&Math.abs(s2[2]-0.85*7.6)<0.3,'seq M2 runs (5 hp 7.6 A) '+s2);
// wye-delta
await ev(()=>{window.__ld.loadEx('p3yd');window.__run(0.3);window.__press('START');window.__run(0.2)});let yd=await ev(()=>({...window.__ld.coilOn,I:window.__ld.P3S.m[0].I[0]}));ok(yd.M&&yd.S&&!yd.D&&yd.I<2.1*14&&yd.I>1.5*14,'wye start ~2x FLA '+JSON.stringify(yd));
await ev(()=>window.__run(4));m=await M();ok(/wye/i.test(m.st)&&m.s>0.85&&m.s<0.95,'running in wye '+JSON.stringify(m));
await ev(()=>window.__run(3));yd=await ev(()=>({...window.__ld.coilOn}));m=await M();ok(yd.D&&!yd.S,'delta after timer '+JSON.stringify(yd));
await ev(()=>window.__run(3));m=await M();ok(/delta/.test(m.st)&&m.s>0.97&&!m.ol,'running in delta '+JSON.stringify(m));
// control short blows X1 fuse
await ev(()=>{const L=window.__ld;L.loadEx('short')});
await ev(()=>{const L=window.__ld;L.loadEx('p3seal');const r=L.rungs[0];r.br.push({from:0,to:7,cells:Array(14).fill(null)});window.__run(0.3)});
let cf=await ev(()=>({c:window.__ld.P3S.cfuse,p:window.__ld.power}));ok(cf.c&&cf.p,'control short blows control fuse '+JSON.stringify(cf));await ev(()=>{document.getElementById('mOk').click();document.getElementById('p3fuses').click()});
// palette hides HVAC parts; svc calls
const pal=await ev(()=>[...document.querySelectorAll('[data-add]')].map(b=>b.dataset.add));ok(!pal.includes('ty')&&!pal.includes('xfmr')&&pal.includes('sel')&&pal.includes('mcoil'),'palette '+pal);
for(let k=0;k<10;k++){await ev(()=>window.__ld.svcStart());await p.waitForTimeout(60);const id=await ev(()=>window.__ld.svc&&window.__ld.svc.id);ok(!!id,'svc '+k);if(id){await ev(()=>window.__ld.svcGuess(window.__ld.svc.id));await ev(()=>document.getElementById('mOk').click())}}
// screenshots of each circuit
for(const [n,a] of [['p3seal','START'],['p3rev','REV'],['p3seq','START'],['p3yd','START']]){await ev(([n,a])=>{window.__ld.loadEx(n);window.__run(0.2);window.__press(a);window.__run(n==='p3yd'?2:9)},[n,a]);await p.waitForTimeout(300);
 const el=await p.$('.p3pwr');await el.screenshot({path:`p3_${n}.png`})}
await ev(()=>{const L=window.__ld;L.meter.on=true});await p.waitForTimeout(300);await p.screenshot({path:'p3_full.png',fullPage:true});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:'p3_phone.png'});
console.log('FAILS',fails);console.log('ERR',errs);await b.close()})();
