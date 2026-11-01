const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullcomb.html');await p.waitForTimeout(400);
await p.evaluate(()=>{document.getElementById('discOk')?.click()});
const ev=(f,a)=>p.evaluate(f,a);
const sel=k=>ev(k=>document.querySelector(`[data-sim=${k}]`).click(),k);
const run=(id,sec)=>ev(([id,n])=>{for(let i=0;i<n;i++)window.__rt.SIMS[id].step(0.5)},[id,Math.round(sec/0.5)]);
const fresh=(id,o={})=>ev(([id,o])=>{const s=window.__rt.SIMS[id];s.sliders.forEach(x=>s.V[x.k]=x.v);document.getElementById('restart').click();Object.assign(s.V,o.V||{});for(const[k,v] of Object.entries(o.S||{}))s.S[k]=(typeof v==="object"&&!Array.isArray(v))?Object.assign({},s.S[k],v):v;(o.F||[]).forEach(k=>s.F[k]=true)},[id,o]);
const logs=(id,n=3)=>ev(([id,n])=>window.__rt.SIMS[id].logs.slice(0,n).map(l=>l[1]).join(' | '),[id,n]);
const G=()=>ev(()=>{const S=window.__rt.SIMS.gas.S,r={};for(const k in S.pin)r[k]=S.on[k]?+S.pin[k].toFixed(2)+"/"+Math.round(S.inp[k]/1000)+"k":"-";return {q:Math.round(S.qtot),sup:+S.sup.toFixed(2),dM:+S.dMain.toFixed(2),pm:+S.pm.toFixed(2),st:+S.static.toFixed(1),...r}});
const B=()=>ev(()=>{const S=window.__rt.SIMS.burn.S;return {in:Math.round(S.input/1000),pr:+S.pr.toFixed(2),lam:+S.lam.toFixed(2),o2:+S.o2.toFixed(1),co2:+S.co2.toFixed(1),co:Math.round(S.co),coaf:Math.round(S.coaf),ts:Math.round(S.ts),eff:+S.eff.toFixed(1),dr:+(S.draft).toFixed(1),caz:+S.caz.toFixed(1),sp:+S.spill.toFixed(2),rco:Math.round(S.roomCO),pk:Math.round(S.coPk||0),al:S.alarm,st:S.state,roll:S.roll,bv:S.bv}});
await sel('gas');
for(const [n,o] of [["base",{}],["all4",{S:{on:{furn:true,wh:true,dryer:true,range:true}}}],["tl",{V:{msize:0.75},S:{tl:true,on:{furn:true,wh:true,dryer:true,range:true}}}],["tl+1.25",{V:{msize:1.25},S:{tl:true,on:{furn:true,wh:true,dryer:true,range:true}}}],
 ["droop+csst",{F:["svcDroop","csst"],S:{on:{furn:true,wh:false,dryer:false,range:true}}}],["cock",{F:["cock"]}],["screen",{F:["screen"]}],["leakOff",{F:["leak"],S:{on:{furn:false,wh:false,dryer:false,range:false}}}],["lockup",{F:["lockup"],S:{on:{furn:false,wh:false,dryer:false,range:false}}}],
 ["lp",{S:{fuel:"lp"}}],["lpLow",{F:["lpLow"],S:{fuel:"lp",on:{furn:true,wh:true,dryer:true,range:true}}}]]){await fresh('gas',o);await run('gas',400);console.log(n.padEnd(10),JSON.stringify(await G()));console.log('   ',(await logs('gas',2)).slice(0,250))}
await fresh('gas');await run('gas',30);await p.screenshot({path:'gas.png'});
await sel('burn');
for(const [n,o,sec] of [["base",{},300],["cold-10",{V:{out:-10}},300],["sh0",{V:{sh:10}},300],["sh100",{V:{sh:100}},300],["mp2",{V:{mp:2}},300],["worst",{V:{out:75,tight:1400},S:{fans:{k:true,b:true,d:true},doorOff:true}},900],
 ["lp-on-ng",{V:{mp:10},S:{fuel:"lp",orif:"ng"}},300],["ng-on-lp",{V:{mp:3.5},S:{fuel:"ng",orif:"lp"}},300],["lp ok",{V:{mp:10},S:{fuel:"lp",orif:"lp"}},300],["soot+lint",{F:["soot","lint"]},1200],["ventPartial",{F:["ventPartial"],V:{out:60}},600],["ventBlock",{F:["ventBlock"]},600],["vb+jump",{F:["ventBlock","bvssJump"]},3600],["connLoose",{F:["connLoose"]},900],["regHigh",{F:["regHigh"]},300],["bigOrif",{F:["bigOrif"]},300],["coldChim",{F:["coldChim"],V:{out:50}},600]]){
 await fresh('burn',o);await run('burn',sec);console.log(n.padEnd(11),JSON.stringify(await B()));console.log('   ',(await logs('burn',3)).slice(0,300))}
await fresh('burn');await run('burn',200);await p.screenshot({path:'burn.png'});
await p.setViewportSize({width:390,height:800});await p.waitForTimeout(200);console.log('mobile sw',await ev(()=>document.documentElement.scrollWidth));
console.log('ERR',errs);await b.close()})();
