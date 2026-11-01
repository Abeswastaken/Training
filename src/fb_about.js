/* Feedback "About" line: says which trainer, tab and part the feedback is about.
   Added to every trainer page by build_all.py. Works with each page's own sender,
   which reads #fbMsg synchronously at the start of its Send click handler. */
(()=>{
const $=id=>document.getElementById(id);
const fb=$("fb"),msg=$("fbMsg");if(!fb||!msg)return;
const TRAINER=(document.title||"Trainer").replace(/\s*FB-Enable\s*$/,"");
let lastPart="";
const watch=id=>{const el=$(id);if(!el)return;
  new MutationObserver(()=>{const t=el.textContent.trim();if(t)lastPart=t}).observe(el,{childList:true,characterData:true,subtree:true})};
["sheetT"].forEach(watch);
// Ladder Builder shows the selected part in #elSheet
const es=$("elSheet");if(es)new MutationObserver(()=>{const h=es.querySelector("h3");if(h&&!es.hidden)lastPart=h.textContent.trim().replace(/\s+/g," ")}).observe(es,{childList:true,subtree:true});
const tabName=()=>{const b=document.querySelector('[data-sim][aria-pressed="true"],#simHyd[aria-pressed="true"],#simSteam[aria-pressed="true"]');return b?b.textContent.trim().replace(/\s+/g," "):""};
// the About picker sits above the message box
const lab=document.createElement("label");lab.htmlFor="fbAbout";lab.textContent="About";
const sel=document.createElement("select");sel.id="fbAbout";
const msgLabel=document.querySelector('label[for="fbMsg"]')||msg;
msgLabel.parentNode.insertBefore(lab,msgLabel);msgLabel.parentNode.insertBefore(sel,msgLabel);
function fill(){
  const opts=[];const tab=tabName();
  if(lastPart)opts.push(["part",`Part: ${lastPart}`+(tab?` (${tab})`:"")]);
  if(tab)opts.push(["tab",`${tab} tab`]);
  opts.push(["page",`The whole ${TRAINER}`]);
  sel.innerHTML=opts.map(([v,t])=>`<option value="${v}">${t.replace(/</g,"&lt;")}</option>`).join("");
}
document.addEventListener("click",e=>{
  const t=e.target.closest&&e.target.closest("button");if(!t)return;
  if(t.id==="feedback")setTimeout(fill,0);
  if(t.id==="fbSend"){
    const orig=msg.value;if(!orig.trim())return;
    const about=sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].text:TRAINER;
    const tagged=`About: ${sel.value==="page"?TRAINER:TRAINER+", "+about}\n${orig}`;
    msg.value=tagged;
    setTimeout(()=>{if(msg.value===tagged)msg.value=orig},0);
  }
},true);
})();
