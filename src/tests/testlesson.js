// Lesson page (chiller evaporator approach): steps, See it, Try it tasks, progress saved, phone width
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
const url='file://'+process.cwd()+'/full-lesson-chill-evap.html';
await p.goto(url);await p.waitForTimeout(300);
ok(!(await p.evaluate(()=>document.getElementById('disc').hidden)),'disclaimer shows on first visit');
await p.click('#discOk');
const bad=()=>p.evaluate(()=>/NaN|undefined|Infinity/.test(document.body.innerText+document.getElementById('lsSvg').innerHTML));
const n=await p.evaluate(()=>__ls.L.steps.length);ok(n>=5,'steps '+n);
for(let i=0;i<n;i++){const r=await p.evaluate(()=>({no:document.getElementById('lsStepNo').textContent,svg:document.getElementById('lsSvg').innerHTML.length,t:document.getElementById('lsStepT').textContent}));
 ok(r.no===`Step ${i+1} of ${n}`,'step label '+r.no);ok(r.svg>300,'step drawn '+i);ok(!(await bad()),'NaN on step '+i);
 if(i<n-1)await p.click('#lsNext')}
ok(await p.evaluate(()=>document.getElementById('lsNext').textContent.includes('Try it')),'last step leads to Try it');
// load slider on the gap step shrinks approach
await p.evaluate(()=>__ls.showStep(2));const g=()=>p.evaluate(()=>+document.getElementById('lsSvg').textContent.match(/APPROACH ([\d.]+)/)[1]);
const g100=await g();await p.fill('#ls_l3','40');await p.dispatchEvent('#ls_l3','input');const g40=await g();ok(g40<g100,`approach falls with load ${g100}->${g40}`);
// See it
await p.click('[data-ltab="see"]');await p.waitForTimeout(100);
const appr=()=>p.evaluate(()=>+document.getElementById('seeReads').textContent.match(/Approach \(panel\)([\d.]+)/)[1]);
const a0=await appr();ok(a0>1&&a0<3,'clean approach '+a0);
await p.fill('#se_foul','80');await p.dispatchEvent('#se_foul','input');const a1=await appr();ok(a1>a0+1,'fouling raises approach '+a1);
await p.click('#seeReset');await p.check('[data-sec="low"]');const a2=await appr();ok(a2>a0+3,'low charge raises approach '+a2);
ok(await p.evaluate(()=>/DRY/.test(document.getElementById('seeSvg').innerHTML)),'low charge shows dry tubes');
await p.click('#seeReset');await p.fill('#se_gpm','400');await p.dispatchEvent('#se_gpm','input');const a3=await appr();ok(a3>a0,'low flow raises approach '+a3);
await p.click('#seeReset');await p.check('[data-sec="sens"]');const a4=await appr();ok(Math.abs(a4-a0-2.5)<0.05,'sensor offset adds 2.5 '+a4);
await p.click('#seeReset');await p.click('#seeLog');ok(await p.evaluate(()=>document.querySelectorAll('#seeLogT tr').length===2),'log row added');
// Try it
await p.click('[data-ltab="try"]');await p.waitForTimeout(100);
await p.click('#lsTB0 .lsB1');ok(await p.evaluate(()=>document.getElementById('lsTk0').classList.contains('ok')),'baseline task done');
const answers=await p.evaluate(()=>['foul','low','sens']);
for(let i=1;i<=3;i++){const sel=`#lsTB${i}`;
 await p.selectOption(sel+' .casePick','oil');await p.click(sel+' .caseCheck');ok(await p.evaluate(s=>document.querySelector(s+' .caseRes').classList.contains('no'),sel),'wrong answer flagged '+i);
 await p.selectOption(sel+' .casePick',answers[i-1]);await p.click(sel+' .caseCheck');ok(await p.evaluate(i=>document.getElementById('lsTk'+i).classList.contains('ok'),i),'case solved '+i)}
await p.click('#lsTB3 .caseTherm');ok(await p.evaluate(()=>/Test thermometer: 44\.0/.test(document.querySelector('#lsTB3 .caseThermR').textContent)),'thermometer reads true 44.0');
// On the job
await p.click('[data-ltab="job"]');ok(await p.evaluate(()=>document.querySelectorAll('#lsJob .lsSrc a').length>=2),'sources listed');
// progress saved
await p.reload();await p.waitForTimeout(300);
ok(await p.evaluate(()=>!document.getElementById('tab-job').hidden&&document.getElementById('disc').hidden),'tab and disclaimer remembered');
await p.click('[data-ltab="try"]');ok(await p.evaluate(()=>document.querySelectorAll('.lsTk.ok').length===4),'task ticks remembered');
// phone: no sideways scroll on any tab
await p.setViewportSize({width:375,height:800});
for(const t of ['learn','see','try','job']){await p.click(`[data-ltab="${t}"]`);await p.waitForTimeout(80);const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(o<=0,`phone overflow on ${t}: ${o}`)}
// feedback opens and names the lesson
await p.click('#feedback');ok(await p.evaluate(()=>!document.getElementById('fb').hidden),'feedback opens');
ok(errs.length===0,'console errors: '+errs.join(' | '));
console.log(fails.length?'FAIL\n'+fails.join('\n'):'testlesson: all passed');await b.close();process.exit(fails.length?1:0)})();
