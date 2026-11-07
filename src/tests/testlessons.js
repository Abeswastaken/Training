// Every lesson page: steps draw, See it responds, tasks mount, service calls accept their answer, no NaN, no phone overflow
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
const files=fs.readdirSync('.').filter(f=>/^full-lesson-.*\.html$/.test(f));ok(files.length>=10,'lesson count '+files.length);
for(const f of files){const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.addInitScript(()=>{localStorage.setItem('ls-disc','1')});await p.goto('file://'+process.cwd()+'/'+f);await p.waitForTimeout(250);
 const n=await p.evaluate(()=>__ls.L.steps.length);ok(n>=4&&n<=9,`${f}: ${n} steps`);
 for(let i=0;i<n;i++){await p.evaluate(i=>__ls.showStep(i),i);
  const r=await p.evaluate(()=>({svg:document.getElementById('lsSvg').innerHTML.length,bad:/NaN|undefined|Infinity/.test(document.getElementById('lsSvg').innerHTML+document.getElementById('lsStepB').innerText)}));
  ok(r.svg>200,`${f} step ${i} empty`);ok(!r.bad,`${f} step ${i} NaN`);
  const ctl=await p.$('#lsCtl input[type=range]');
  if(ctl){await ctl.evaluate(e=>{e.value=e.min;e.dispatchEvent(new Event('input',{bubbles:true}))});ok(!(await p.evaluate(()=>/NaN|undefined/.test(document.getElementById('lsSvg').innerHTML))),`${f} step ${i} control NaN`)}}
 await p.click('[data-ltab="see"]');await p.waitForTimeout(80);
 const txt=()=>p.evaluate(()=>(document.getElementById('seeReads')||document.getElementById('lsSee')).innerText);
 const before=await txt();const sl=await p.$$('#lsSee input[type=range]');
 for(const s of sl){await s.evaluate(e=>{e.value=e.min;e.dispatchEvent(new Event('input',{bubbles:true}))})}
 const after=await txt();ok(sl.length===0||before!==after,`${f} See it sliders change nothing`);
 for(const c of await p.$$('#lsSee input[type=checkbox]'))await c.check();
 ok(!(await p.evaluate(()=>/NaN|undefined|Infinity/.test(document.getElementById('lsSee').innerText+((document.getElementById('seeSvg')||{}).innerHTML||'')))),`${f} See it NaN`);
 const lg=await p.$('#seeLog');if(lg){await lg.click();ok(await p.evaluate(()=>document.querySelectorAll('#seeLogT tr').length>=2),`${f} log row`)}
 const rs=await p.$('#seeReset');if(rs)await rs.click();
 await p.click('[data-ltab="try"]');await p.waitForTimeout(80);
 const T=await p.evaluate(()=>__ls.L.tasks.map((t,i)=>({i,ans:t.ans||null})));ok(T.length>=2,`${f} tasks ${T.length}`);
 for(const t of T){const sel=`#lsTB${t.i}`;
  if(t.ans){await p.selectOption(sel+' .casePick',t.ans);await p.click(sel+' .caseCheck');
   ok(await p.evaluate(i=>document.getElementById('lsTk'+i).classList.contains('ok'),t.i),`${f} case ${t.i} not solved by its answer`);
   for(const a of await p.$$(sel+' .caseAct'))await a.click();
   ok(!(await p.evaluate(s=>/NaN|undefined/.test(document.querySelector(s).innerText),sel)),`${f} case ${t.i} NaN`)}
  else{const btn=(await p.$(sel+' .kgo'))||(await p.$(sel+' .btn.blue'));if(btn)await btn.click()}}
 await p.click('[data-ltab="job"]');ok(await p.evaluate(()=>document.querySelectorAll('#lsJob .lsSrc a').length>=2),`${f} sources`);
 await p.setViewportSize({width:375,height:800});
 for(const t of ['learn','see','try','job']){await p.click(`[data-ltab="${t}"]`);const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(o<=0,`${f} phone overflow ${t} ${o}`)}
 ok(errs.length===0,`${f} errors: ${errs.join(' | ')}`);await p.close()}
console.log(fails.length?'FAIL\n'+fails.join('\n'):`testlessons: all ${files.length} lessons passed`);await b.close();process.exit(fails.length?1:0)})();
