// Feedback About picker: options follow the open tab and last part, and the sent text is tagged.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const f of ['full.html','fullctl.html','fullheat.html','fullmotor.html','fullboiler.html','fullwire.html','fullladder.html']){
 const p=await b.newPage();p.on('pageerror',e=>errs.push(f+': '+e.message));
 await p.addInitScript(()=>{window.__sent=[];const of=window.fetch;window.fetch=(u,o)=>{if(String(u).includes('formResponse')){window.__sent.push(o.body.toString());return Promise.resolve(new Response(''))}return of(u,o)}});
 await p.goto('file://'+process.cwd()+'/'+f);await p.waitForTimeout(400);
 const r=await p.evaluate(async()=>{const $=id=>document.getElementById(id);$("discOk")?.click();
  const pb=document.querySelector('[data-part],.part,[data-k]');if($("sheetT")&&pb){pb.dispatchEvent(new MouseEvent('click',{bubbles:true}))}
  await new Promise(r=>setTimeout(r,100));$("feedback").click();await new Promise(r=>setTimeout(r,50));
  const opts=[...$("fbAbout").options].map(o=>o.text);$("fbMsg").value="test note";$("fbSend").click();
  await new Promise(r=>setTimeout(r,300));return {opts,sent:decodeURIComponent((window.__sent[0]||'').replace(/\+/g,' ')).slice(0,140),box:$("fbMsg").value}});
 console.log(f.padEnd(16),JSON.stringify(r));await p.close()}
console.log('ERR',errs);await b.close()})();
