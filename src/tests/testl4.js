// Ladder presets: furnace sequence, heat pump O/B, two-stage, boiler, walk-in pump-down + defrost
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
await p.addInitScript(()=>{localStorage.setItem('ld-disc','1')});
await p.goto('file://'+process.cwd()+'/fullladder.html');await p.waitForTimeout(400);
const ev=(f,a)=>p.evaluate(f,a);
await ev(()=>{const L=window.__ld;window.__run=s=>{for(let i=0;i<s*10;i++)L.evaluate(0.1)};
 window.__on=t=>{let r=false;L.each(c=>{if(c.tag===t&&L.energized.has(c.id))r=true});return r}});
// furnace
await ev(()=>{const L=window.__ld;L.loadEx('furnace');L.LTS.room=64;window.__run(0.5)});
let s=await ev(()=>({idr:window.__ld.coilOn.IDR,ind:window.__on('IND'),hsi:window.__on('HSI'),gv:window.__on('GV'),bl:window.__on('BLWR')}));
ok(s.idr&&s.ind&&s.hsi&&!s.gv&&!s.bl,'furnace start: inducer + igniter '+JSON.stringify(s));
await ev(()=>window.__run(16));s=await ev(()=>({hsi:window.__on('HSI'),gv:window.__on('GV'),bl:window.__on('BLWR')}));
ok(s.gv&&s.hsi&&!s.bl,'furnace: valve opens, igniter still on '+JSON.stringify(s));
await ev(()=>window.__run(5));s=await ev(()=>({hsi:window.__on('HSI'),gv:window.__on('GV')}));ok(!s.hsi&&s.gv,'furnace: igniter off after trial '+JSON.stringify(s));
await ev(()=>window.__run(30));s=await ev(()=>({bl:window.__on('BLWR'),room:window.__ld.LTS.room}));ok(s.bl,'furnace: blower on after delay '+JSON.stringify(s));
await ev(()=>{const L=window.__ld;L.findEl(Object.keys(L.coilOn).length&&(()=>{let id;L.each(c=>{if(c.k==='motor'&&c.tag==='IND')id=c.id});return id})()).c.f='open';window.__run(1)});
s=await ev(()=>({gv:window.__on('GV')}));ok(!s.gv,'furnace: inducer open drops the gas valve');
// heat pump
await ev(()=>{const L=window.__ld;L.loadEx('hp');L.LTS.room=63;window.__run(0.5)});
s=await ev(()=>({comp:window.__on('COMP'),rv:window.__on('RV'),strips:window.__on('STRIPS'),bl:window.__on('BLWR')}));
ok(s.comp&&!s.rv&&s.strips&&s.bl,'hp heat: compressor, no RV, strips (AUX), blower '+JSON.stringify(s));
await ev(()=>window.__run(20));s=await ev(()=>({room:window.__ld.LTS.room,strips:window.__on('STRIPS')}));ok(s.room>64&&!s.strips,'hp heats the room and drops aux '+JSON.stringify(s));
await ev(()=>{const L=window.__ld;L.LTS.sys='cool';L.LTS.room=78;window.__run(0.5)});s=await ev(()=>({comp:window.__on('COMP'),rv:window.__on('RV')}));ok(s.comp&&s.rv,'hp cool: RV energized '+JSON.stringify(s));
await ev(()=>window.__run(5));s=await ev(()=>window.__ld.LTS.room);ok(s<78,'hp cools in cool mode '+s);
// two-stage
await ev(()=>{const L=window.__ld;L.loadEx('stage2');L.LTS.room=79;window.__run(0.5)});s=await ev(()=>({c:window.__on('COMP'),y2:window.__on('Y2')}));ok(s.c&&s.y2,'two-stage: both stages at +5 '+JSON.stringify(s));
await ev(()=>{window.__ld.LTS.room=74.6;window.__run(0.3)});s=await ev(()=>({c:window.__on('COMP'),y2:window.__on('Y2')}));ok(s.c&&!s.y2,'two-stage: drops to low stage '+JSON.stringify(s));
await ev(()=>{const L=window.__ld;L.LTS.sys='heat';L.LTS.room=64;window.__run(0.3)});s=await ev(()=>({h1:window.__on('HTR1'),h2:window.__on('HTR2'),bl:window.__on('BLWR')}));ok(s.h1&&s.h2&&s.bl,'two-stage heat both banks '+JSON.stringify(s));
await ev(()=>{window.__ld.LTS.room=67.4;window.__run(0.3)});s=await ev(()=>({h1:window.__on('HTR1'),h2:window.__on('HTR2')}));ok(s.h1&&!s.h2,'two-stage heat W1 only '+JSON.stringify(s));
// boiler
await ev(()=>{const L=window.__ld;L.loadEx('boiler');L.LTS.room=64;window.__run(0.5)});s=await ev(()=>({cr:window.__ld.coilOn.CR,circ:window.__on('CIRC'),gv:window.__on('GV')}));ok(s.cr&&s.circ&&s.gv,'boiler: CR, circ, burner '+JSON.stringify(s));
await ev(()=>{const L=window.__ld;L.LTS.room=60;L.LTS.hs=90;window.__run(25)});s=await ev(()=>({wt:window.__ld.SIM.wt,aq:window.__ld.SIM.aq,gv:window.__on('GV')}));ok(s.wt>=160&&s.wt<=185,'boiler water cycles on aquastat '+JSON.stringify(s));
await ev(()=>{const L=window.__ld;L.SIM.wt=150;L.SIM.aq=true;let c;L.each(x=>{if(x.k==='lwco')c=x});c.st.trip=true;window.__run(0.3)});s=await ev(()=>({circ:window.__on('CIRC'),gv:window.__on('GV')}));ok(s.circ&&!s.gv,'LWCO stops burner only '+JSON.stringify(s));
// walk-in
await ev(()=>{window.__ld.loadEx('walkin');window.__run(10)});s=await ev(()=>({S:{...window.__ld.SIM},comp:window.__on('COMP'),lls:window.__on('LLS')}));ok(s.lls&&s.comp,'walk-in: box calls, LLS opens, compressor starts '+JSON.stringify(s));
await ev(()=>window.__run(25));s=await ev(()=>({S:{...window.__ld.SIM},comp:window.__on('COMP'),lls:window.__on('LLS')}));ok(!s.lls&&!s.comp&&s.S.suct<=18,'walk-in: pumped down and off '+JSON.stringify(s));
await ev(()=>{window.__ld.startDefrost();window.__run(1)});s=await ev(()=>({h:window.__on('DEF HTR'),f:window.__on('EFAN'),lls:window.__on('LLS')}));ok(s.h&&!s.f&&!s.lls,'walk-in defrost '+JSON.stringify(s));
await ev(()=>window.__run(21));s=await ev(()=>({h:window.__on('DEF HTR'),f:window.__on('EFAN')}));ok(!s.h&&s.f,'walk-in defrost ends '+JSON.stringify(s));
// every preset loads from the dropdown and service calls set a fault
for(const v of ['furnace','hp','stage2','boiler','walkin']){await p.selectOption('#ex',v);await p.waitForTimeout(200)}
for(let k=0;k<12;k++){await ev(()=>window.__ld.svcStart());await p.waitForTimeout(80);const id=await ev(()=>window.__ld.svc&&window.__ld.svc.id);ok(!!id,'svc '+k);if(id){await ev(()=>window.__ld.svcGuess(window.__ld.svc.id));await ev(()=>document.getElementById('mOk').click())}}
await ev(()=>window.__ld.loadEx('furnace'));await p.waitForTimeout(500);await p.screenshot({path:'l9.png',fullPage:true});
await ev(()=>window.__ld.loadEx('walkin'));await p.waitForTimeout(1500);await p.screenshot({path:'l10.png'});
console.log('FAILS',fails);console.log('ERR',errs);await b.close()})();
