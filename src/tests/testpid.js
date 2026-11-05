// Controls: PID tuning lessons (pass/fail logic and UI) and calibration benches + fail-safe pairing
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
await p.goto('file://'+process.cwd()+'/fullctl.html');await p.waitForTimeout(500);
await p.evaluate(()=>{const d=document.getElementById('discOk');if(d)d.click()});
await p.click('#simPid');await p.waitForTimeout(200);
ok(await p.evaluate(()=>!document.getElementById('pidSec').hidden&&document.querySelector('.layout').hidden),'pid shown');
// lesson pass/fail from the model
const runL=async(i,cfg)=>p.evaluate(([i,cfg])=>{__pid.setLesson(i);Object.assign(__pid.ST.cfg,cfg);document.getElementById('pidNow').click();return document.querySelector('.pidRes')?.className+' | '+document.querySelector('.pidRes')?.textContent},[i,cfg]);
let r;
r=await runL(0,{diff:1});ok(/ok/.test(r),'L1 on/off '+r);
r=await runL(1,{pb:2});ok(/no/.test(r),'L2 PB2 should fail '+r);r=await runL(1,{pb:8});ok(/ok/.test(r),'L2 PB8 should pass '+r);
r=await runL(2,{pb:6,ti:2});ok(/no/.test(r),'L3 ti2 should fail '+r);r=await runL(2,{pb:8,ti:15});ok(/ok/.test(r),'L3 pb8 ti15 pass '+r);
r=await runL(3,{pb:4,ti:5,td:0});ok(/no/.test(r),'L4 no D fails '+r);r=await runL(3,{pb:4,ti:5,td:1.5});ok(/ok/.test(r),'L4 with D passes '+r);
r=await runL(4,{mode:'pi',pb:3,ti:3});ok(/no/.test(r),'L5 default fails '+r);r=await runL(4,{mode:'pi',pb:8,ti:15});ok(/ok/.test(r),'L5 tuned passes '+r);
await p.locator('#pidSec').screenshot({path:'pid_l5.png'});
// animated run in a lesson, slider and mode buttons
await p.click('[data-pl="1"]');await p.click('#pidRun');await p.waitForTimeout(1500);ok(await p.evaluate(()=>__pid.Z.t>60),'test animates');await p.click('#pidRun');
await p.click('[data-pl="5"]');await p.click('[data-pmode="pid"]');await p.click('#pidLive');await p.waitForTimeout(800);await p.click('#pidDoor');await p.waitForTimeout(800);
ok(await p.evaluate(()=>__pid.Z.door===1&&__pid.Z.t>100),'free play runs with door');
await p.evaluate(()=>{const i=document.getElementById('pid_pb');i.value=10;i.dispatchEvent(new Event('input',{bubbles:true}))});ok(await p.evaluate(()=>__pid.ST.cfg.pb===10),'pb slider');
await p.locator('#pidSec').screenshot({path:'pid_free.png'});await p.click('#pidLive');
// calibration
await p.click('#simCal');await p.waitForTimeout(200);ok(await p.evaluate(()=>!document.getElementById('calSec').hidden&&document.getElementById('pidSec').hidden),'cal shown');
for(const id of ['tp970','tp971','t4002','th192','tk']){await p.click(`[data-cb="${id}"]`);await p.waitForTimeout(80);
 // do it right through the UI where possible
 const res=await p.evaluate(id=>{const C=__cal.CS,S=C.S,B=__cal.BENCH[id];const $=x=>document.getElementById(x);const set=(k,v)=>{const i=$(k);i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))};
  const fixCal=()=>{let n=0;while(Math.abs(__cal.trueCal(C.S,__cal.BENCH[id].dn&&C.S.main>=15.5)-B.tgt)>B.tol*0.4&&n++<80){const cur=__cal.branchAt(C.S);document.querySelector(`[data-cscrew="${cur>B.tgt?1:-1}"]`).click()}};
  set('cal_sup',B.dn?13:B.sup);$('calCover').click();if(!C.S.gauge)$('calGauge').click();
  for(let i=0;i<12;i++)$('calWait').click();
  set('cal_sens',B.sens);set('cal_dial',Math.round(C.S.room*2)/2);
  // dial resolution 0.5: calibrate to the gauge as a tech would
  fixCal();
  if(B.dn){set('cal_sup',18);set('cal_dial',Math.round(C.S.room*2)/2);fixCal();set('cal_sup',13)}
  const mid=__cal.check(C.S).filter(c=>!c[0]).map(c=>c[1]);
  set('cal_dial',72);if(C.S.gauge)$('calGauge').click();$('calCover').click();$('calCheck').click();
  return {mid,fin:__cal.check(C.S).filter(c=>!c[0]).map(c=>c[1]),ui:document.querySelector('#calRes .pidRes')?.className}},id);
 ok(res.fin.length===0&&/ok/.test(res.ui),`${id} pass ${JSON.stringify(res)}`);
 await p.locator('#calSec').screenshot({path:`cal_${id}.png`});
 // warm bimetal mistake: calibrate right after cover off
 const warm=await p.evaluate(id=>{const C=__cal.CS;C.S=__cal.newBench(id);__cal.render();const S=C.S,B=__cal.BENCH[id];S.sup=B.sup;S.main=13;S.sens=B.sens;S.cover=false;S.warm=1.6;S.gauge=true;S.dial=Math.round(S.room*2)/2;
  let n=0;while(Math.abs(__cal.branchAt(S)-B.tgt)>0.3&&n++<80){S.screw-=(__cal.branchAt(S)>B.tgt?1:-1)*0.5}return __cal.trueCal(S,false)-B.tgt},id);
 ok(Math.abs(warm)>1,`${id} calibrating warm should leave it off: ${warm}`)}
await p.click('[data-cb="tp970"]');await p.screenshot({path:'cal_full.png'});
// pairing
await p.click('[data-csub="pair"]');await p.waitForTimeout(100);
const pr=await p.evaluate(()=>{const out={};for(const app of ['heat','cool','oad'])for(const act of ['DA','RA'])for(const dev of ['NO','NC']){Object.assign(__cal.CS.pair,{app,act,dev});const r=__cal.pairCalc(__cal.CS.pair);if(r.actionOK&&r.failOK)out[app]=(out[app]||[]).concat(act+dev)}return out});
ok(JSON.stringify(pr)==='{"heat":["DANO"],"cool":["DANC"],"oad":["DANC"]}','pairings '+JSON.stringify(pr));
await p.click('[data-papp="heat"]');await p.click('[data-pact="DA"]');await p.click('[data-pdev="NO"]');
const hv=await p.evaluate(()=>{const set=v=>{const i=document.getElementById('pair_T');i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))};set(68);const a=__cal.pairCalc(__cal.CS.pair).open;set(76);const b=__cal.pairCalc(__cal.CS.pair).open;return [a,b]});
ok(hv[0]>hv[1],'heating valve opens when cold '+hv);
await p.check('#pairAir');ok(await p.evaluate(()=>__cal.pairCalc(__cal.CS.pair).open===1),'NO valve fails open');
await p.locator('#calSec').screenshot({path:'cal_pair.png'});
await p.click('[data-sim="pneu"]');await p.waitForTimeout(200);ok(await p.evaluate(()=>document.getElementById('calSec').hidden&&!document.querySelector('.layout').hidden&&document.querySelector('[data-sim="pneu"]').getAttribute('aria-pressed')==='true'),'back to sim');
await p.click('#simPid');await p.setViewportSize({width:390,height:844});await p.waitForTimeout(200);ok(await p.evaluate(()=>document.documentElement.scrollWidth<=392),'phone no overflow pid');
await p.click('#simCal');await p.waitForTimeout(150);ok(await p.evaluate(()=>document.documentElement.scrollWidth<=392),'phone no overflow cal');await p.screenshot({path:'cal_phone.png'});
console.log('FAILS',fails);console.log('ERR',errs);await b.close()})();
