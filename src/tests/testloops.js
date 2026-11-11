// Controls > More loops: every Try it task can be completed, loops settle, nothing throws.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[],fails=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullctl.html');await p.waitForTimeout(500);await p.locator('text=I understand').first().click({timeout:800}).catch(()=>{});
await p.click('#simLoops');await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const L=window.__lp,out={};const done=s=>s.tasks.map((t,i)=>!!s.done[i]);
 // hot water
 L.setSys('hw');let s=L.cur;s.V.oat=0;L.run(1800);const hw1=[s.loops[0].sp,s.S.TsS];
 s.V.oat=30;s.V.D=30;L.run(1200);const hw2=[s.S.dpS,s.S.n];
 s.loops[1].auto=false;s.loops[1].hand=100;L.run(300);const hw3=s.S.dpS;s.loops[1].auto=true;
 s.F.oatOpen=true;L.run(1500);out.hw={done:done(s),hw1,hw2,hw3,ts:s.S.TsS};
 // makeup air
 L.setSys('mau');s=L.cur;L.run(400);s.V.oat=-10;L.run(400);const m2=[s.S.gv,s.S.TdS];
 s.loops[0].pb=8;L.run(200);const hunt=(()=>{const H=L.hist.mau[0].slice(-40).map(q=>q[1]);return Math.max(...H)-Math.min(...H)})();s.loops[0].pb=60;L.run(500);
 s.V.oat=-10;s.F.filter=true;s.F.gas=true;L.run(400);out.mau={done:done(s),m2,hunt,st:s.S.st,lock:s.S.lock,out:s.loops[0].out,td:s.S.TdS};
 // relief fan
 L.setSys('rel');s=L.cur;const p0=s.S.P;s.V.oa=100;L.run(1500);const r1=[s.S.on,s.S.n,s.S.Ps];
 s.loops[0].ti=2;L.run(1800);const r3=s.S.Ps;s.loops[0].ti=0;s.V.oa=20;L.run(1500);const off=s.S.on;s.F.tube=true;L.run(1500);out.rel={done:done(s),p0,r1,r3,off,P:s.S.P,on:s.S.on};
 return out});
console.log(JSON.stringify(r));
for(const k of Object.keys(r))r[k].done.forEach((d,i)=>{if(!d)fails.push(k+' task '+(i+1))});
if(r.mau.hunt<3)fails.push('mau did not hunt with a narrow band');
console.log('FAILS',fails);console.log('ERR',errs);await b.close();process.exit(fails.length||errs.length?1:0)})();
