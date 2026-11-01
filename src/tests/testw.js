const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+process.cwd()+'/fullwire.html');await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('discOk').click());
const ev=f=>p.evaluate(f);
const st=()=>ev(()=>{const W=window.__wt;return W.parts.map(x=>x.label+":"+JSON.stringify(Object.fromEntries(Object.entries(x.st).filter(([k,v])=>v!==false&&v!==0&&k!=="ang")))).join(" | ")});
const logs=()=>ev(()=>[...document.querySelectorAll('#log div')].slice(0,5).map(d=>d.textContent));
// example: power on, cool
await ev(()=>{const W=window.__wt;W.loadExample();W.parts.find(p=>p.type==="supply").st.on=true;W.parts.find(p=>p.type==="tstat").st.mode="cool";for(let i=0;i<5;i++)W.simulate(0.1);W.render()});
console.log('EX cool:',await st());
// meter: V across contactor coil, ohms on comp
console.log('meter:',await ev(()=>{const W=window.__wt,m=W.meter;m.on=true;m.mode="V";const ct=W.parts.find(p=>p.type==="contactor"),c=W.parts.find(p=>p.type==="comp");m.red={p:ct.id,t:"A1"};m.black={p:ct.id,t:"A2"};const a=W.readMeter();m.red={p:c.id,t:"C"};m.black={p:c.id,t:"R"};const b=W.readMeter();m.mode="O";const c2=W.readMeter();W.parts.find(p=>p.type==="supply").st.on=false;W.simulate(0.1);const d=W.readMeter();m.red={p:c.id,t:"S"};const e=W.readMeter();m.mode="F";const cp=W.parts.find(p=>p.type==="cap");m.red={p:cp.id,t:"C"};m.black={p:cp.id,t:"HERM"};const f=W.readMeter();return [a,b,c2,d,e,f]}));
await p.waitForTimeout(300);await p.screenshot({path:'w1.png'});
// LPS open drops contactor
await ev(()=>{const W=window.__wt;W.parts.find(p=>p.type==="supply").st.on=true;W.simulate(0.1);W.parts.find(p=>p.type==="lps").st.open=true;W.simulate(0.1)});console.log('lps open:',await st());
// cap fails -> hum -> overload
await ev(()=>{const W=window.__wt;W.parts.find(p=>p.type==="lps").st.open=false;W.parts.find(p=>p.type==="cap").st.bad=true;for(let i=0;i<100;i++)W.simulate(0.1)});console.log('cap bad:',await st(),await logs());
// short L1-L2 behind fuse? add wire from disc T1 to T2 (no fuse on T2 path) -> arc flash
await ev(()=>{const W=window.__wt;W.loadExample();const s=W.parts.find(p=>p.type==="supply");s.st.on=true;W.simulate(0.1);const d=W.parts.find(p=>p.type==="disc");W.termTap(d.id,"T1");W.termTap(d.id,"T2");W.simulate(0.1);W.render()});
console.log('short:',await st(),await logs());await p.waitForTimeout(200);await p.screenshot({path:'w2.png'});
// short after fuse: contactor T1 to T2 with contactor pulled in -> fuse blows
await ev(()=>{document.getElementById('mOk').click();const W=window.__wt;W.loadExample();W.parts.find(p=>p.type==="supply").st.on=true;W.parts.find(p=>p.type==="tstat").st.mode="cool";W.simulate(0.1);W.simulate(0.1);const c=W.parts.find(p=>p.type==="contactor");W.termTap(c.id,"T1");W.termTap(c.id,"T2");W.simulate(0.1)});
console.log('fused short:',await st(),await logs());
// 24V short R to C: with 3A fuse
await ev(()=>{document.getElementById('mOk').click();const W=window.__wt;W.loadExample();W.parts.find(p=>p.type==="supply").st.on=true;W.simulate(0.1);const t=W.parts.find(p=>p.type==="tstat");W.termTap(t.id,"R");W.termTap(t.id,"C");W.simulate(0.1)});
console.log('R-C short:',await st(),await logs());
// contactor coil on 240
await ev(()=>{document.getElementById('mOk').click();const W=window.__wt;W.loadExample();W.parts.find(p=>p.type==="supply").st.on=true;W.simulate(0.1);const c=W.parts.find(p=>p.type==="contactor"),d=W.parts.find(p=>p.type==="disc");W.termTap(d.id,"T1");W.termTap(c.id,"A1");W.termTap(d.id,"T2");W.termTap(c.id,"A2");W.simulate(0.1)});
console.log('coil on 240:',await st(),await logs());
// L1 to ground
await ev(()=>{document.getElementById('mOk').click();const W=window.__wt;W.loadExample();W.parts.find(p=>p.type==="supply").st.on=true;const g=W.addPart("gnd",900,100);W.simulate(0.1);const s=W.parts.find(p=>p.type==="supply");W.termTap(s.id,"L1");W.termTap(g.id,"G");W.simulate(0.1)});
console.log('L1-G:',await logs());
// 120V lamp L1-N works, on L1-L2 burns
await ev(()=>{document.getElementById('mOk').click();const W=window.__wt;W.loadExample();const s=W.parts.find(p=>p.type==="supply");s.st.on=true;const l=W.addPart("lamp120",900,100);W.termTap(s.id,"L1");W.termTap(l.id,"1");W.termTap(s.id,"N");W.termTap(l.id,"2");W.simulate(0.1)});
console.log('lamp120 L1-N:',await ev(()=>window.__wt.parts.find(p=>p.type==="lamp120").st));
console.log('ERR',errs);
await b.close()})();
