/* ============ Lesson page engine: Learn / See it / Try it / On the job ============
 A lesson file sets window.LESSON = {id, sec, secHref, title, lead, steps:[{t, body, math?, draw(st), vb?}], see:{mount(el)}, tasks:[{t, intro, mount(el, done)}], job:html, sources:[[name,url]]} */
(()=>{
const $=id=>document.getElementById(id);
const L=window.LESSON;const KEY="ls-"+L.id;
let ST={tab:"learn",step:0,done:{}};
try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(s)ST={...ST,...s}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
document.title=L.title+" | "+L.sec;
$("lsSec").textContent=L.sec;$("lsSec").href=L.secHref||"#";$("lsH1").textContent=L.title;$("lsLead").textContent=L.lead;
/* tool pages (L.tabs = [{id,label,mount(el)}]) replace the four lesson tabs with their own */
if(L.tabs){const nav=document.querySelector(".lsTabs");nav.setAttribute("aria-label","Parts of this tool");nav.innerHTML=L.tabs.map(t=>`<button data-ltab="${t.id}" aria-pressed="false">${t.label}</button>`).join("");
 ["learn","see","try","job"].forEach(k=>$("tab-"+k).hidden=true);
 L.tabs.forEach(t=>{const sc=document.createElement("section");sc.className="lsPanel";sc.id="tab-"+t.id;sc.hidden=true;sc.innerHTML=`<div id="tb-${t.id}"></div>`;$("lsMain").appendChild(sc)});
 if(!L.tabs.some(t=>t.id===ST.tab))ST.tab=L.tabs[0].id}
function showTab(t){if(L.tabs){if(!L.tabs.some(x=>x.id===t))return;ST.tab=t;save();document.querySelectorAll("[data-ltab]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.ltab===t));
  L.tabs.forEach(x=>{$("tab-"+x.id).hidden=x.id!==t;const el=$("tb-"+x.id);if(x.id===t&&!el.dataset.m){el.dataset.m=1;x.mount(el)}});return}
 ST.tab=t;save();document.querySelectorAll("[data-ltab]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.ltab===t));
 ["learn","see","try","job"].forEach(k=>$("tab-"+k).hidden=k!==t);if(t==="see"&&!$("lsSee").dataset.m){$("lsSee").dataset.m=1;L.see.mount($("lsSee"))}
 if(t==="try"&&!$("lsTry").dataset.m){$("lsTry").dataset.m=1;mountTasks()}if(t==="job"&&!$("lsJob").dataset.m){$("lsJob").dataset.m=1;mountJob()}}
let stepState={};
function drawStep(){const s=L.steps[ST.step];$("lsSvg").setAttribute("viewBox",s.vb||"0 0 720 380");$("lsSvg").innerHTML=s.draw(stepState)}
function showStep(i){ST.step=Math.max(0,Math.min(L.steps.length-1,i));save();const s=L.steps[ST.step];stepState={...(s.init||{})};
 $("lsStepNo").textContent=`Step ${ST.step+1} of ${L.steps.length}`;$("lsStepT").textContent=s.t;$("lsStepB").innerHTML=s.body;
 $("lsMath").hidden=!s.math;if(s.math){$("lsMathB").innerHTML=s.math;$("lsMath").open=false}
 $("lsCtl").innerHTML=s.ctl?s.ctl.html:"";$("lsCtl").hidden=!s.ctl;
 $("lsBack").disabled=ST.step===0;$("lsNext").textContent=ST.step===L.steps.length-1?"Try it →":"Next →";
 $("lsDots").innerHTML=L.steps.map((_,k)=>`<button class="lsDot${k===ST.step?" on":""}${k<ST.step?" seen":""}" data-ldot="${k}" aria-label="Step ${k+1}"></button>`).join("");
 drawStep()}
$("lsCtl").addEventListener("input",e=>{const s=L.steps[ST.step];if(s.ctl&&s.ctl.input){s.ctl.input(e.target,stepState);drawStep()}});
function mountTasks(){const el=$("lsTry");el.innerHTML=`<p class="lsIntro">${L.tryIntro||""}</p>`+L.tasks.map((t,i)=>`<div class="group lsTask" id="lsTask${i}"><h3><span class="lsTk${ST.done[i]?" ok":""}" id="lsTk${i}">${ST.done[i]?"✓":i+1}</span> ${t.t}</h3><p>${t.intro}</p><div class="lsTaskBody" id="lsTB${i}"></div></div>`).join("");
 L.tasks.forEach((t,i)=>t.mount($("lsTB"+i),ok=>{if(ok){ST.done[i]=true;save();$("lsTk"+i).textContent="✓";$("lsTk"+i).classList.add("ok")}}))}
function mountJob(){$("lsJob").innerHTML=L.job+`<h3>Sources</h3><ul class="lsSrc">${L.sources.map(([n,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join("")}</ul><p class="note">Drawings are made for this site from manufacturer literature and the sources above. Always follow the equipment manufacturer's manual and your site's procedures.</p>`}
document.addEventListener("click",e=>{const t=e.target;
 const tb=t.closest("[data-ltab]");if(tb){showTab(tb.dataset.ltab);window.scrollTo({top:0});return}
 const d=t.closest("[data-ldot]");if(d){showStep(+d.dataset.ldot);return}
 if(t.id==="lsBack")showStep(ST.step-1);
 if(t.id==="lsNext"){if(ST.step===L.steps.length-1){showTab("try");window.scrollTo({top:0})}else showStep(ST.step+1)}
 if(t.id==="theme"){const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("ls-theme",r.dataset.theme)}catch(_){}}});
document.addEventListener("keydown",e=>{if(ST.tab!=="learn"||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==="ArrowRight")showStep(ST.step+1);if(e.key==="ArrowLeft")showStep(ST.step-1)});
try{const t=localStorage.getItem("ls-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
if(!L.tabs)showStep(ST.step);showTab(ST.tab);
window.__ls={ST,showTab,showStep,L};
/* ---------- disclaimer + feedback (FB-Enable) ---------- */
const FEEDBACK={form:"https://docs.google.com/forms/d/e/1FAIpQLScaqpadGdwDY_CanACDH3X_ZAQ44LzrCwDYcaxIuaxYk6A5UA/viewform",entry:"entry.249128714"};
const DISC_VER="1";let CM=null,cmState="off";
(async()=>{try{if(window.claude&&window.claude.use){CM=await window.claude.use("comments");if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}}}catch(e){CM=null}})();
async function refreshFb(){if(CM){try{cmState=await CM.canSendToClaude()}catch(e){cmState="off"}}const to=CM&&cmState==="available";$("fbTo").textContent=to?"Sends straight to Claude as a comment on this page.":"No sign-in needed.";$("fbSend").textContent=to?"Send to Claude":"Send"}
async function sendFb(){const msg=$("fbMsg").value.trim();if(!msg){$("fbStatus").textContent="Please write something first.";return}
 const where=L.tabs?ST.tab:ST.tab==="learn"?`Learn step ${ST.step+1}`:{see:"See it",try:"Try it",job:"On the job"}[ST.tab];
 const text=`[${$("fbType").value}] ${msg}\n\nFrom: ${$("fbName").value.trim()||"anonymous"}\nContext: Lesson ${L.sec} / ${L.title}, ${where}, ${navigator.userAgent}`;
 $("fbSend").disabled=true;$("fbStatus").textContent="Sending...";
 try{if(CM&&cmState==="available"){try{const anchor=await CM.anchorFor($("lsMain"));await CM.sendToClaude({anchor,text:text.slice(0,3900)});$("fbStatus").textContent="Sent to Claude.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1500);return}
   catch(e){if(e&&e.code==="consent_required"){$("fbStatus").textContent="Not sent: allow comments for this page when asked, then press Send again.";return}
    if(e&&!["claude_unavailable","capability_removed","forbidden"].includes(e.code)){$("fbStatus").textContent=`Couldn't send to Claude (${e.code||"error"}). Press Send again to use the form.`;cmState="off";return}cmState="off"}}
  const body=new URLSearchParams();body.append(FEEDBACK.entry,"[Lessons] "+text);await fetch(FEEDBACK.form.replace(/\/viewform.*$/,"/formResponse"),{method:"POST",mode:"no-cors",body});
  $("fbStatus").textContent="Thanks, it was sent.";$("fbMsg").value="";setTimeout(()=>$("fb").hidden=true,1200)}
 catch(e){$("fbStatus").innerHTML=`Couldn't send from here. <a href="${FEEDBACK.form}" target="_blank" rel="noopener">Open the feedback form</a>.`}finally{$("fbSend").disabled=false}}
document.addEventListener("click",e=>{const id=e.target.id;
 if(id==="discOk"){$("disc").hidden=true;try{localStorage.setItem("ls-disc",DISC_VER)}catch(_){}}
 else if(id==="about")$("disc").hidden=false;
 else if(id==="feedback"){$("fbStatus").textContent="";refreshFb();$("fb").hidden=false;$("fbMsg").focus()}
 else if(id==="fbCancel")$("fb").hidden=true;else if(id==="fbSend")sendFb()});
{let seen=null;try{seen=localStorage.getItem("ls-disc")}catch(_){}if(seen!==DISC_VER)$("disc").hidden=false}
})();
