const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:950}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/fullwire.html');await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('discOk').click());
const ev=(f,a)=>p.evaluate(f,a);
const logs=n=>ev(n=>[...document.querySelectorAll('#log div')].slice(0,n).map(d=>d.textContent).reverse(),n);
const run=(sec)=>ev(s=>{for(let i=0;i<s*10;i++)window.__wt.simulate(0.1)},sec);
const P=t=>`window.__wt.parts.find(p=>p.type==="${t}")`;
// furnace
await ev(()=>{const W=window.__wt;W.EXAMPLES.furnace();W.render();W.parts.find(p=>p.type==="supply").st.on=true;W.simulate(0.1);W.parts.find(p=>p.type==="tstat").st.mode="heat"});
await run(40);console.log('FURNACE',await ev(()=>{const W=window.__wt;return ["ifc","inducer","hsi","gasvalve","blower","psw"].map(t=>t+":"+JSON.stringify(W.parts.find(p=>p.type===t).st)).join("\n")}));
await p.screenshot({path:'wf1.png'});
console.log(await logs(16));
await ev(()=>{window.__wt.parts.find(p=>p.type==="tstat").st.mode="off"});await run(30);
console.log('FURN off',await ev(()=>JSON.stringify(window.__wt.parts.find(p=>p.type==="ifc").st)));
await ev(()=>{const W=window.__wt;W.parts.find(p=>p.type==="psw").st.blocked=true;W.parts.find(p=>p.type==="tstat").st.mode="heat"});await run(15);
console.log('blocked',await ev(()=>JSON.stringify(window.__wt.parts.find(p=>p.type==="ifc").st)));
// heat pump
await ev(()=>{const W=window.__wt;W.EXAMPLES.hp();W.render();W.parts.find(p=>p.type==="supply").st.on=true;W.simulate(0.1)});
for(const m of ["cool","heat","em heat","fan"]){await ev(m=>{window.__wt.parts.find(p=>p.type==="tstatHP").st.mode=m},m);await run(1);
 console.log('HP',m,await ev(()=>{const W=window.__wt;return ["contactor","comp","rvcoil","blower","heater","xfmr"].map(t=>t+":"+JSON.stringify(W.parts.find(p=>p.type===t).st)).join(" ")}))}
await ev(()=>{window.__wt.parts.find(p=>p.type==="tstatHP").st.mode="cool"});await run(1);await ev(()=>window.__wt.render());await p.waitForTimeout(200);await p.screenshot({path:'wh1.png'});
// walk-in
await ev(()=>{const W=window.__wt;W.EXAMPLES.walkin();W.render();W.parts.find(p=>p.type==="supply").st.on=true});await run(10);
console.log('WI run',await ev(()=>{const W=window.__wt;return ["lls","lpc","comp","contactor"].map(t=>t+":"+JSON.stringify(W.parts.find(p=>p.type===t).st)).join(" ")}));
await ev(()=>{window.__wt.parts.find(p=>p.type==="tsw").st.closed=false});await run(30);
console.log('WI pumpdown',await ev(()=>{const W=window.__wt;return ["lls","lpc","comp","contactor"].map(t=>t+":"+JSON.stringify(W.parts.find(p=>p.type===t).st)).join(" ")}));
await ev(()=>{window.__wt.parts.find(p=>p.type==="tsw").st.closed=true});await run(10);
console.log('WI restart',await ev(()=>{const W=window.__wt;return ["lpc","comp"].map(t=>t+":"+JSON.stringify(W.parts.find(p=>p.type===t).st)).join(" ")}));
console.log(await logs(8));
await ev(()=>window.__wt.render());await p.screenshot({path:'ww1.png'});
// waypoint drag via UI
await ev(()=>{const W=window.__wt;W.loadExample();W.render()});
const wsel=await p.$('#wires path');const bb=await wsel.boundingBox();
// click on the path: use its midpoint via getPointAtLength
const pt=await ev(()=>{const el=document.querySelector('#wires path');const L=el.getTotalLength();const q=el.getPointAtLength(L/2);const m=el.getScreenCTM();return {x:q.x*m.a+m.e,y:q.y*m.d+m.f}});
await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(100);
const nh=await ev(()=>[document.querySelectorAll('.wh').length,document.querySelectorAll('.wadd').length,document.getElementById('resetRoute').hidden]);console.log('handles',nh);
const hp=await ev(()=>{const el=document.querySelector('.wadd');const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
await p.mouse.move(hp.x,hp.y);await p.mouse.down();await p.mouse.move(hp.x+60,hp.y+80,{steps:5});await p.mouse.up();
console.log('pts',await ev(()=>{const W=window.__wt;return JSON.stringify(W.wires.filter(w=>w.pts).map(w=>w.pts))}));
await p.screenshot({path:'wwp.png'});
await p.click('#resetRoute');console.log('after reset',await ev(()=>window.__wt.wires.filter(w=>w.pts).length));
console.log('ERR',errs);await b.close()})();
