// Heat exchangers: every tab and type renders, sliders and faults work, and the physics holds
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
await p.addInitScript(()=>{localStorage.setItem('hx-disc','1')});
await p.goto('file://'+process.cwd()+'/fullhx.html');await p.waitForTimeout(400);
ok(await p.evaluate(()=>document.getElementById('disc').hidden),'disclaimer hidden after seen');
const tabs=await p.evaluate(()=>Object.keys(__hx.TABS));
for(const t of tabs){await p.click(`[data-sim="${t}"]`);await p.waitForTimeout(100);
 const subs=await p.evaluate(t=>__hx.TABS[t].subs,t);
 for(const s of subs){if(subs.length>1){await p.click(`[data-sub="${s}"]`);await p.waitForTimeout(100)}
  const r=await p.evaluate(()=>({svg:document.getElementById('hxSvg').innerHTML.length,g:document.getElementById('graph').innerHTML.length,res:document.getElementById('res').textContent,nan:/NaN|undefined|Infinity/.test(document.body.innerText+document.getElementById('hxSvg').innerHTML+document.getElementById('graph').innerHTML),sl:document.querySelectorAll('[data-hx]').length,f:document.querySelectorAll('[data-hxf]').length}));
  ok(r.svg>500&&r.g>200,`${t}/${s} drawn ${r.svg} ${r.g}`);ok(!r.nan,`${t}/${s} has NaN/undefined`);ok(r.sl>=3,`${t}/${s} sliders ${r.sl}`);ok(r.f>=1,`${t}/${s} faults ${r.f}`);
  // each fault toggles without errors and changes something
  const fs=await p.$$('[data-hxf]');for(const f of fs){const before=await p.evaluate(()=>document.getElementById('res').textContent+document.getElementById('hxSvg').innerHTML.length);await f.check();await p.waitForTimeout(40);const after=await p.evaluate(()=>document.getElementById('res').textContent+document.getElementById('hxSvg').innerHTML.length);ok(before!==after,`${t}/${s} fault ${await f.getAttribute('data-hxf')} changes nothing`);await f.uncheck()}
  // slider moves results
  const before=await p.evaluate(()=>document.getElementById('res').textContent);
  await p.evaluate(()=>{const i=document.querySelector('[data-hx="cF"]');i.value=+i.max;i.dispatchEvent(new Event('input',{bubbles:true}))});
  ok(before!==await p.evaluate(()=>document.getElementById('res').textContent),`${t}/${s} flow slider`);
  await p.click('#reset');
  await p.locator('#drawWrap').screenshot({path:`hx_${t}_${s}.png`})}}
// physics
const ph=await p.evaluate(()=>{const c=__hx.calc('cf'),f=__hx.calc('pf');return {cfQ:c.Q,pfQ:f.Q,pfTco:f.Tco,pfTho:f.Tho,cfTco:c.Tco,cfTho:c.Tho,cross:c.cross,e:c.e}});
ok(ph.cfQ>ph.pfQ,'counterflow beats parallel '+JSON.stringify(ph));ok(ph.pfTco<=ph.pfTho+0.01,'parallel never crosses');ok(ph.cross||ph.cfTco>ph.cfTho||ph.e<0.6,'counterflow can cross');
const conv=await p.evaluate(()=>{const id=Object.keys(__hx.SUBS).find(k=>__hx.SUBS[k].hot.kind==='steam');const R=__hx.calc(id);return {id,Tho:R.Tho,sat:__hx.satF(__hx.ST.v[id]?__hx.ST.v[id].hT:__hx.SUBS[id].hot.T),Tco:R.Tco}});
ok(conv.id&&Math.abs(conv.Tho-conv.sat)<1&&conv.Tco<conv.sat,'steam converter condenses at saturation '+JSON.stringify(conv));
// furnace: the secondary takes the gas below its dew point and lifts efficiency from about 80% into the 90s
const fu=await p.evaluate(()=>{const c=__hx.calc('cfurn'),s=__hx.calc('sfurn');__hx.ST.F.cfurn={fDirtySec:true};const d=__hx.calc('cfurn');__hx.ST.F.cfurn={};__hx.ST.F.sfurn={fLowAir:true};const l=__hx.calc('sfurn');__hx.ST.F.sfurn={};return {ce:c.eff,se:s.eff,T2:c.T2,dew:c.dew,gph:c.gph,sT1:s.T1,dT2:d.T2,dgph:d.gph,lrise:l.rise,srise:s.rise}});
ok(fu.se>0.77&&fu.se<0.84,'80% furnace efficiency '+fu.se);ok(fu.ce>0.90&&fu.ce<0.98,'condensing efficiency '+fu.ce);ok(fu.T2<fu.dew&&fu.T2<140,'vent gas below dew point and PVC limit '+fu.T2);ok(fu.gph>0.3&&fu.gph<1,'condensate '+fu.gph);
ok(fu.sT1>300&&fu.sT1<450,'80% flue temp '+fu.sT1);ok(fu.dT2>fu.T2&&fu.dgph<fu.gph,'dirty secondary: hotter vent, less condensate');ok(fu.lrise>fu.srise+15,'low airflow raises the rise');
await p.click('[data-sim="basics"]');await p.screenshot({path:'hx_full.png'});
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(200);ok(await p.evaluate(()=>document.documentElement.scrollWidth<=392),'no phone overflow');await p.screenshot({path:'hx_phone.png',fullPage:true});
console.log('FAILS',fails);console.log('ERR',errs);await b.close()})();
