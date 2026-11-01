const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+process.cwd()+'/full.html');await p.waitForTimeout(500);
const run=async(id,name,setup,hours=6)=>{const r=await p.evaluate(([id,setup,hours])=>{const sim=window.__rt.SIMS[id];
 sim.sliders.forEach(s=>sim.V[s.k]=s.v);sim.faults.forEach(f=>sim.F[f[0]]=false);Object.assign(sim.V,setup.v||{});sim.S=sim.init();sim.logs=[];
 (setup.f||[]).forEach(k=>sim.F[k]=true);if(setup.door)sim.S.doorOpen=true;
 let st={min:1e9,max:-1e9,runs:0,starts:0,defs:0,maxPd:0,minPs:1e9,run:0,snap:null,lowBox:1e9};
 let wasC=false,wasD=0;const n=hours*7200;
 for(let i=0;i<n&&!sim.S.dead;i++){sim.step(0.5);const S=sim.S;
  if(i>7200*1){st.min=Math.min(st.min,S.Tbox);st.max=Math.max(st.max,S.Tbox)}
  if(S.comp&&!wasC)st.starts++;wasC=S.comp;if(S.def===1&&wasD!==1)st.defs++;wasD=S.def;if(S.comp)st.run++;
  st.maxPd=Math.max(st.maxPd,S.Pd);if(S.comp)st.minPs=Math.min(st.minPs,S.Ps);
  if(S.comp&&S.llsOpen&&S.runT>300&&!st.snap)st.snap={Ps:+S.Ps.toFixed(0),Pd:+S.Pd.toFixed(0),sst:+S.sst.toFixed(0),sct:+S.sct.toFixed(0),sh:+S.sh.toFixed(0),sc:+S.sc.toFixed(0),Tdis:+S.Tdis.toFixed(0),A:+S.amps.toFixed(1),Tcoil:+S.Tcoil.toFixed(0),Q:Math.round(S.Q),bub:S.bub}}
 const S=sim.S;return {snap:st.snap,box:[+st.min.toFixed(1),+st.max.toFixed(1)],end:+S.Tbox.toFixed(1),starts:st.starts,runPct:Math.round(st.run/n*100),defs:st.defs,frost:+S.frost.toFixed(2),pan:+S.panIce.toFixed(2),maxPd:Math.round(st.maxPd),minPs:Math.round(st.minPs),Tm:Math.round(S.Tm),dead:S.dead,ol:S.ol,flood:Math.round(S.flood),last:sim.logs.slice(0,3).map(l=>l[1])}},[id,setup,hours]);console.log((id+' '+name).padEnd(30),JSON.stringify(r))};
for(const id of ['cooler','freezer']){
await run(id,'nominal',{},12);
await run(id,'out 105',{v:{out:105}});
await run(id,'out 20',{v:{out:20}});
await run(id,'charge 70',{v:{charge:70}});
await run(id,'charge 130',{v:{charge:130}});
await run(id,'dirtyCond',{f:['dirtyCond']});
await run(id,'condFan',{f:['condFan']},2);
await run(id,'efan',{f:['efan']},3);
await run(id,'door open',{door:1},4);
await run(id,'gasket',{f:['door']},24);
await run(id,'llsStuck',{f:['llsStuck']},3);
await run(id,'llsLeak',{f:['llsLeak']},3);
await run(id,'drier',{f:['drier']},3);
await run(id,'moist',{f:['moist']},3);
await run(id,'txvShut',{f:['txvShut']},2);
await run(id,'txvBulb',{f:['txvBulb']},3);
await run(id,'defTimer',{f:['defTimer']},30);
await run(id,'comp',{f:['comp']},4);
await run(id,'noncond',{f:['noncond']},2);
await run(id,'contactor',{f:['contactor']},2);
await run(id,'cch+leak cold',{f:['cch','llsLeak'],v:{out:20}},8);
if(id==='freezer'){await run(id,'heater',{f:['heater']},30);await run(id,'term',{f:['term']},8);await run(id,'drainH',{f:['drainH']},30)}
await run(id,'scn fan+hps+ol',{f:['condFan','hpsFail','olFail'],v:{out:100}},3);
await run(id,'scn vac',{f:['llsStuck','lpsFail','olFail']},3);
await run(id,'scn flood',{f:['efan','txvBulb']},6);
}
console.log('ERR',errs);
await p.evaluate(()=>document.querySelector('[data-sim=freezer]').click());await p.waitForTimeout(300);await p.screenshot({path:'shotfz.png'});
await b.close()})();
