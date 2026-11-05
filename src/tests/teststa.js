// Boiler: one-pipe counterflow/parallel switch and the Steam stations tab (3 stations x 2 views)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
await p.addInitScript(()=>{localStorage.setItem('bt-disc','1');localStorage.setItem('bt-disclaimer','1')});
await p.goto('file://'+process.cwd()+'/fullboiler.html');await p.waitForTimeout(500);
await p.evaluate(()=>{const d=document.getElementById('discOk');if(d&&!document.getElementById('disc').hidden)d.click()});
await p.click('#simSteam');await p.waitForTimeout(300);
// switch to one-pipe, then counterflow
const btn=async re=>{const h=await p.$$('#p-controls button');for(const x of h){const t=await x.textContent();if(re.test(t))return x}return null};
let pip=await btn(/^Piping/);ok(!!pip,'piping toggle');if(pip&&/two-pipe/.test(await pip.textContent()))await pip.click();await p.waitForTimeout(200);
let cf=await btn(/One-pipe main/);ok(!!cf,'counterflow toggle');await cf.click();await p.waitForTimeout(500);
let st=await p.evaluate(()=>({d:document.getElementById('s_mainPipe').getAttribute('d'),cnt:document.getElementById('s_pitchCnt').getAttribute('opacity'),ret:document.getElementById('s_retA').getAttribute('opacity')}));
ok(st.d==='M370 92 L760 80'&&st.cnt==='1'&&st.ret==='0','counterflow drawn '+JSON.stringify(st));
await p.screenshot({path:'sta_cnt.png'});
cf=await btn(/One-pipe main/);await cf.click();await p.waitForTimeout(400);
st=await p.evaluate(()=>({d:document.getElementById('s_mainPipe').getAttribute('d'),par:document.getElementById('s_pitchPar').getAttribute('opacity')}));ok(st.d==='M370 80 L760 92'&&st.par==='1','parallel drawn '+JSON.stringify(st));
// stations tab
await p.click('#simSta');await p.waitForTimeout(300);
ok(await p.evaluate(()=>!document.getElementById('stations').hidden&&document.querySelector('.layout').hidden),'stations shown, sim hidden');
for(const s of ['prv','trap','drip'])for(const v of ['2d','iso']){await p.click(`[data-sta="${s}"]`);await p.click(`[data-stv="${v}"]`);await p.waitForTimeout(150);
 const n=await p.evaluate(()=>[document.querySelectorAll('#stSvg .sco').length,document.querySelectorAll('#stList li').length]);ok(n[0]>=n[1]&&n[1]>=7,`${s} ${v} callouts ${n}`);
 await p.click('#stSvg .sco[data-sn="2"] circle');await p.waitForTimeout(100);ok(await p.evaluate(()=>!!document.querySelector('#stList li.on .stDet')),`${s} ${v} callout opens detail`);
 const el=await p.$('.stDraw');await el.screenshot({path:`sta_${s}_${v}.png`})}
await p.click('[data-sta="trap"]');await p.click('[data-stt="ib"]');await p.click('#stSvg .sco[data-sn="4"] circle');ok(await p.evaluate(()=>/Inverted bucket/.test(document.getElementById('stList').textContent)),'trap type changes text');
await p.click('#simHyd');await p.waitForTimeout(200);ok(await p.evaluate(()=>document.getElementById('stations').hidden&&!document.querySelector('.layout').hidden),'back to sim');
await p.click('#simSta');await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:'sta_phone.png'});
console.log('FAILS',fails);console.log('ERR',errs);await b.close()})();
