// Tool pages (P-H chart, mini-split): every tab renders, no NaN, calculator matches hand-checked values, faults move the cycle, no phone overflow
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
const files=fs.readdirSync('.').filter(f=>/^full-tool-.*\.html$/.test(f));ok(files.length>=1,'tool count');
for(const f of files){const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.addInitScript(()=>{localStorage.clear();localStorage.setItem('ls-disc','1')});await p.goto('file://'+process.cwd()+'/'+f);await p.waitForTimeout(300);
 const tabs=await p.$$eval('[data-ltab]',a=>a.map(x=>x.dataset.ltab));ok(tabs.length>=2,f+' tabs');
 for(const t of tabs){await p.click(`[data-ltab="${t}"]`);await p.waitForTimeout(150);
  ok(!(await p.evaluate(()=>/NaN|undefined|Infinity/.test(document.getElementById('lsMain').innerText+[...document.querySelectorAll('#lsMain svg')].map(s=>s.innerHTML).join('')))),`${f} ${t} NaN`)}
 if(f.includes('ph-tool')){
  // calculator: homework example R-134a 190/112/172 and 35/47 at 14.7
  await p.click('[data-ltab="calc"]');const txt=await p.evaluate(()=>document.getElementById('pcOut').innerText);
  ok(/126\.9°F/.test(txt),'condensing 126.9 '+txt.slice(0,80));ok(/40\.0°F/.test(txt),'suction sat 40.0');ok(/2\.88 : 1/.test(txt),'table COP 2.88');ok(/3\.13 : 1/.test(txt),'sheet COP 3.13');
  // faults change the readings
  await p.click('[data-ltab="chart"]');const r0=await p.evaluate(()=>document.getElementById('phR').innerText);
  for(const k of ['low','over','restr','cond','evap','comp']){await p.selectOption('#phF',k);const r=await p.evaluate(()=>document.getElementById('phR').innerText);ok(r!==r0,'fault '+k+' changes nothing')}
  for(const n of ['R-410A','R-454B','R-32','R-22','R-134a','R-404A']){await p.selectOption('#phN',n);ok(!(await p.evaluate(()=>/NaN|undefined|Infinity/.test(document.getElementById('phSvg').innerHTML+document.getElementById('phR').innerText))),'NaN '+n)}}

 if(f.includes('ms-tool')){
  // model signatures at steady state (no browser timing needed)
  const sig=await p.evaluate(()=>{const M=__ms,o={};for(const f of ['none','low','over','eevC','eevO','dirtyIn','dirtyOut','kink']){const S=M.fresh({mode:'cool',tout:95,sp:74,tin:80,heads:1,fault:f});const R=M.stepN(S,2400);o[f]={sh:R.sh,sc:R.sc,Ps:R.Ps,Pd:R.Pd,Te:R.Te,Hz:S.Hz,code:S.code}}
   const H=M.fresh({mode:'heat',tout:35,sp:70,tin:62,heads:1});for(let i=0;i<3;i++)M.stepN(H,1800);o.heat={frost:H.frost,t:H.tin[0]};
   const Z=M.fresh({mode:'cool',tout:95,sp:74,tin:80,heads:3});M.stepN(Z,1800);o.multi={hz:Z.Hz,t:Z.tin.slice(0,3)};
   o.calls=M.CALLS.map(c=>{const S=M.callSim(c);return S.R&&isFinite(S.R.Ps)?1:0});return o});
  const n=sig.none;ok(n.sh>5&&n.sh<12&&n.sc>5&&n.sc<12,'healthy sh/sc '+JSON.stringify(n));ok(n.Ps-14.7>100&&n.Ps-14.7<170,'healthy suction '+n.Ps);
  ok(sig.low.sh>20&&sig.low.sc<3,'low charge signature');ok(sig.over.sc>15&&sig.over.Pd>n.Pd+20,'overcharge signature');
  ok(sig.eevC.sh>20&&sig.eevC.sc>12,'eev closed signature');ok(sig.eevO.sh<2,'eev open signature');ok(sig.dirtyIn.Te<n.Te-8,'dirty indoor signature');
  ok(sig.dirtyOut.Pd>n.Pd+30,'dirty outdoor signature');ok(sig.kink.sh>12&&sig.kink.sc>12,'kink signature');
  ok(sig.multi.hz>20,'multi-zone runs');ok(sig.calls.every(Boolean),'all service calls solve');
  // UI: changing the fault and mode re-renders without errors
  await p.click('[data-ltab="sim"]');await p.selectOption('#msF','low');await p.selectOption('#msMode','heat');await p.selectOption('#msHeads','4');await p.waitForTimeout(1200);
  ok(!(await p.evaluate(()=>/NaN|undefined|Infinity/.test(document.getElementById('msSvg').innerHTML+document.getElementById('msR').innerText))),'ms sim NaN after changes');
  await p.click('[data-ltab="calls"]');await p.selectOption('#mcPick','low');await p.click('#mcCheck');ok(/Right/.test(await p.evaluate(()=>document.getElementById('mcRes').innerText)),'first call answer');}
 await p.setViewportSize({width:375,height:800});
 for(const t of tabs){await p.click(`[data-ltab="${t}"]`);const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(o<=0,`${f} phone overflow ${t} ${o}`)}
 ok(errs.length===0,`${f} errors: ${errs.join(' | ')}`);await p.close()}
console.log(fails.length?'FAIL\n'+fails.join('\n'):`testtools: all ${files.length} tools passed`);await b.close();process.exit(fails.length?1:0)})();
