// Tool pages (P-H chart): every tab renders, no NaN, calculator matches hand-checked values, faults move the cycle, no phone overflow
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
 await p.setViewportSize({width:375,height:800});
 for(const t of tabs){await p.click(`[data-ltab="${t}"]`);const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(o<=0,`${f} phone overflow ${t} ${o}`)}
 ok(errs.length===0,`${f} errors: ${errs.join(' | ')}`);await p.close()}
console.log(fails.length?'FAIL\n'+fails.join('\n'):`testtools: all ${files.length} tools passed`);await b.close();process.exit(fails.length?1:0)})();
