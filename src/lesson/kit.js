/* ============ Lesson kit: charts, See it panel, goal tasks and service-call tasks shared by every lesson ============ */
const K={};
K.f0=x=>Math.round(x).toString();K.f1=x=>(+x).toFixed(1);K.f2=x=>(+x).toFixed(2);
K.esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
K.uid=(()=>{let n=0;return p=>(p||"k")+(++n)})();
K.lbl=(x,y,t,o={})=>`<text x="${x}" y="${y}" class="lsL${o.c?" "+o.c:""}" style="text-anchor:${o.a||"middle"}${o.fill?";fill:"+o.fill:""}${o.size?";font-size:"+o.size+"px":""}">${t}</text>`;
K.txt=(x,y,t,o={})=>`<text x="${x}" y="${y}" class="lsG" style="text-anchor:${o.a||"middle"}${o.fill?";fill:"+o.fill:""}">${t}</text>`;
K.tag=(x,y,t,o={})=>{const w=o.w||t.length*8.4+16;const ax=o.a==="start"?x:o.a==="end"?x-w:x-w/2;return `<rect x="${ax}" y="${y-17}" width="${w}" height="24" rx="4" fill="var(--paper)" opacity=".93" stroke="${o.stroke||"none"}"/>`+K.lbl(ax+w/2,y,t,{c:o.c,fill:o.fill})};
K.arrowDef=(id,col)=>`<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${col}"/></marker></defs>`;
K.arrow=(d,col,w=2.4)=>{const id=K.uid("ar");return K.arrowDef(id,col)+`<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" marker-end="url(#${id})"/>`};
/* Keep drawing text readable in both themes. Theme-colored text (light in dark mode) can land on a shape with a fixed light fill, or the reverse.
   For each <text>, find the topmost filled shape under its centre and, if the contrast is poor, switch the text to plain dark or light. */
K.legible=svg=>{if(!svg||svg._lg)return;svg._lg=requestAnimationFrame(()=>{svg._lg=0;try{
 const lum=c=>{const m=(c||"").match(/[\d.]+/g);if(!m||m.length<3)return null;if(m.length>3&&+m[3]<0.6)return null;const [r,g,b]=m.slice(0,3).map(v=>{v=+v/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
 const gl={},grad=id=>{if(id in gl)return gl[id];const g=document.getElementById(id);let v=null;if(g){let h=g,st=[...g.querySelectorAll("stop")];for(let k=0;!st.length&&k<3;k++){const r=(h.getAttribute("href")||h.getAttribute("xlink:href")||"").slice(1);h=r&&document.getElementById(r);if(!h)break;st=[...h.querySelectorAll("stop")]}
   const ls=st.map(x=>{const cs=getComputedStyle(x);return +cs.stopOpacity<0.6?null:lum(cs.stopColor)});if(ls.length&&ls.every(x=>x!=null))v=ls.reduce((a,b)=>a+b,0)/ls.length}return gl[id]=v};
 const all=[...svg.querySelectorAll("*")],geo=[];
 all.forEach((e,i)=>{if(e instanceof SVGGeometryElement&&!e.closest("defs,clipPath,mask,marker,pattern,symbol")){const r=e.getBoundingClientRect();if(r.width>4&&r.height>4)geo.push([i,e,r])}});
 const seeThrough=e=>{for(let n=e;n&&n!==svg;n=n.parentNode){const cs=getComputedStyle(n);if(+cs.opacity<0.6||cs.visibility==="hidden"||cs.display==="none")return true}return false};
 all.forEach((t,i)=>{if(t.tagName!=="text"||t.closest("defs"))return;const r=t.getBoundingClientRect();if(!r.width)return;const cx=r.left+r.width/2,cy=r.top+r.height/2;
  if(t.dataset.lg0!==undefined)t.style.fill=t.dataset.lg0;
  let bl=null;for(let k=geo.length-1;k>=0;k--){const [gi,e,gr]=geo[k];if(gi>i||cx<gr.left||cx>gr.right||cy<gr.top||cy>gr.bottom)continue;
   const cs=getComputedStyle(e);if(cs.fill==="none"||+cs.fillOpacity<0.6)continue;let hit=false;try{hit=e.isPointInFill(new DOMPoint(cx,cy).matrixTransform(e.getScreenCTM().inverse()))}catch(_){}
   if(!hit||seeThrough(e))continue;const u=cs.fill.match(/url\(["']?#([^"')]+)/);const l=u?grad(u[1]):lum(cs.fill);if(l==null)continue;bl=l;break}
  if(bl==null)return;const tl=lum(getComputedStyle(t).fill);if(tl==null)return;
  if((Math.max(tl,bl)+.05)/(Math.min(tl,bl)+.05)<3){if(t.dataset.lg0===undefined)t.dataset.lg0=t.style.fill||"";t.style.fill=bl>0.2?"#1d2327":"#eef1f3"}})}catch(_){}})};
window.KLEG=K.legible;
K.lcd=(x,y,t,w=92,lab)=>`<rect x="${x-w/2}" y="${y-15}" width="${w}" height="26" rx="4" fill="#15191c" stroke="#3a4247"/><text x="${x}" y="${y+4}" class="lsLcd">${t}</text>`+(lab?K.lbl(x,y+30,lab):"");
K.tcol=T=>T<66?`hsl(212,72%,${Math.round(36+Math.max(0,Math.min(1,(T-36)/28))*30)}%)`:`hsl(${Math.round(30-Math.max(0,Math.min(1,(T-75)/30))*22)},78%,${Math.round(62-Math.max(0,Math.min(1,(T-75)/30))*16)}%)`;
/* line chart. o: {x,y,w,h, X:[min,max], Y:[min,max], xt:[...], yt:[...], xf, yf, xl, yl, title, series:[{f|pts, c, dash, w, lbl, lblAt}], bands:[{y0,y1,c,lbl}], vlines:[{x,lbl}], dots:[{x,y,c,lbl,a}]} */
K.chart=o=>{const x0=o.x??60,y0=o.y??30,w=o.w??600,h=o.h??260;const X=v=>x0+(v-o.X[0])/(o.X[1]-o.X[0])*w,Y=v=>y0+h-(v-o.Y[0])/(o.Y[1]-o.Y[0])*h;
 let s="";(o.bands||[]).forEach(b=>{s+=`<rect x="${x0}" y="${Y(b.y1)}" width="${w}" height="${Y(b.y0)-Y(b.y1)}" fill="${b.c}" opacity=".13"/>`+(b.lbl?K.lbl(x0+8,Y(b.y1)-6,b.lbl,{a:"start",fill:b.c}):"")});
 (o.yt||[]).forEach(v=>{s+=`<path d="M${x0} ${Y(v)} H${x0+w}" stroke="var(--panel-edge)" stroke-width=".7"/>`+K.txt(x0-7,Y(v)+5,(o.yf||(a=>a))(v),{a:"end"})});
 (o.xt||[]).forEach(v=>{s+=`<path d="M${X(v)} ${y0+h} v5" stroke="var(--muted)"/>`+K.txt(X(v),y0+h+21,(o.xf||(a=>a))(v))});
 s+=`<path d="M${x0} ${y0} V${y0+h} H${x0+w}" stroke="var(--muted)" fill="none"/>`;
 (o.vlines||[]).forEach(v=>{s+=`<path d="M${X(v.x)} ${y0} V${y0+h}" stroke="${v.c||"var(--muted)"}" stroke-dasharray="4 4"/>`+(v.lbl?K.txt(X(v.x)+6,y0+14,v.lbl,{a:"start",fill:v.c}):"")});
 (o.series||[]).forEach(sr=>{let pts=sr.pts;if(!pts){pts=[];const n=sr.n||60;for(let i=0;i<=n;i++){const xv=o.X[0]+(o.X[1]-o.X[0])*i/n,yv=sr.f(xv);if(isFinite(yv))pts.push([xv,yv])}}
  const cl=pts.map(([a,b])=>[a,Math.max(o.Y[0],Math.min(o.Y[1],b))]);
  s+=`<path d="${cl.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join("")}" stroke="${sr.c}" stroke-width="${sr.w||3}" fill="none" ${sr.dash?`stroke-dasharray="${sr.dash}"`:""}/>`;
  if(sr.lbl){const at=sr.lblAt??(o.X[1]);const p=cl.reduce((b,q)=>Math.abs(q[0]-at)<Math.abs(b[0]-at)?q:b,cl[0]);s+=K.lbl(X(p[0])+(sr.dx??-6),Y(p[1])+(sr.dy??-10),sr.lbl,{a:sr.a||"end",fill:sr.c})}});
 (o.dots||[]).forEach(d=>{s+=`<circle cx="${X(d.x)}" cy="${Y(d.y)}" r="${d.r||6}" fill="${d.c||"var(--hot)"}" stroke="var(--paper)" stroke-width="2"/>`+(d.lbl?K.lbl(X(d.x)+(d.dx??10),Y(d.y)+(d.dy??-10),d.lbl,{a:d.a||"start",fill:d.c}):"")});
 if(o.xl)s+=K.txt(x0+w/2,y0+h+42,o.xl);if(o.yl)s+=`<text transform="translate(${x0-44} ${y0+h/2}) rotate(-90)" class="lsG">${o.yl}</text>`;if(o.title)s+=K.lbl(x0,y0-12,o.title,{a:"start"});
 return s};
K.reads=list=>list.map(([a,b,bad])=>`<div><span>${a}</span><b${bad?' class="bad"':''}>${b}</b></div>`).join("");
/* See it panel. cfg: {vb, init, sliders:[[k,label,min,max,step,fmt]], checks:[[k,label]], model(S), draw(R,S), reads(R,S), note(R,S), log:[[col, (R,S)=>txt]], logHint} */
K.SEE=null;K.LOG=[];K.R=null;
K.see=cfg=>({mount(el){const S={...cfg.init};K.SEE=S;
 el.innerHTML=`<div class="lsSee"><div class="drawing"><div class="scroller"><svg id="seeSvg" viewBox="${cfg.vb||"0 0 720 380"}" role="img" aria-label="Interactive drawing"></svg></div></div>
 <div class="lsSide"><div class="group"><h3>Readings</h3><div class="reads lsReads" id="seeReads"></div><p class="note" id="seeNote"></p></div>
 <div class="group"><h3>Change it</h3>${(cfg.sliders||[]).map(([k,l,a,b,st])=>`<div class="row"><label for="se_${k}">${l}</label><output id="seo_${k}"></output><input type="range" id="se_${k}" data-se="${k}" min="${a}" max="${b}" step="${st}"></div>`).join("")}
 ${(cfg.checks||[]).map(([k,l])=>`<label class="lsChk"><input type="checkbox" data-sec="${k}"> ${l}</label>`).join("")}
 <div class="btns">${cfg.log?`<button class="btn blue" id="seeLog">Log reading</button>`:""}<button class="btn" id="seeReset">Reset</button></div></div>
 ${cfg.log?`<div class="group"><h3>Your log</h3><div id="seeLogT"><p class="note">${cfg.logHint||"Press Log reading to write down what the gauges say, like a daily log sheet."}</p></div></div>`:""}</div></div>`;
 const q=id=>document.getElementById(id);
 const upd=()=>{const R=cfg.model(S);K.R=R;q("seeSvg").innerHTML=cfg.draw(R,S);K.legible(q("seeSvg"));
  (cfg.sliders||[]).forEach(([k,,,,,fmt])=>{q("seo_"+k).textContent=fmt?fmt(S[k]):S[k];q("se_"+k).value=S[k]});
  el.querySelectorAll("[data-sec]").forEach(c=>c.checked=!!S[c.dataset.sec]);
  q("seeReads").innerHTML=K.reads(cfg.reads(R,S));q("seeNote").innerHTML=cfg.note?cfg.note(R,S):""};
 const renderLog=()=>{const t=q("seeLogT");if(!t||!K.LOG.length)return;t.innerHTML=`<table class="lsTbl"><tr><th>#</th>${cfg.log.map(c=>`<th>${c[0]}</th>`).join("")}</tr>${K.LOG.slice(-8).map((r,i)=>`<tr><td>${K.LOG.length-Math.min(8,K.LOG.length)+i+1}</td>${r.cells.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table>`};
 el.addEventListener("input",e=>{const k=e.target.dataset.se;if(k){S[k]=+e.target.value;upd()}});
 el.addEventListener("change",e=>{const k=e.target.dataset.sec;if(k){S[k]=e.target.checked;upd()}});
 el.addEventListener("click",e=>{if(e.target.id==="seeLog"){const R=cfg.model(S);K.LOG.push({S:{...S},R,cells:cfg.log.map(c=>c[1](R,S))});renderLog()}
  if(e.target.id==="seeReset"){Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,cfg.init);upd()}});
 upd();renderLog()}});
/* a task done in See it. check(S,R,LOG) returns true, or a string saying what is still wrong */
K.goal=o=>({t:o.t,intro:o.intro,mount(el,done){el.innerHTML=`<div class="btns"><button class="btn" data-ltab="see">Go to See it</button><button class="btn blue kgo">Check</button></div><p class="kgr"></p>`;
 el.querySelector(".kgo").addEventListener("click",()=>{const p=el.querySelector(".kgr");if(!K.SEE){p.className="kgr lsRes no";p.textContent="Open See it first and set it up there.";return}
  const R=o.model?o.model(K.SEE):K.R;const r=o.check(K.SEE,R,K.LOG);const ok=r===true;p.className="kgr lsRes "+(ok?"ok":"no");p.innerHTML=ok?(typeof o.ok==="function"?o.ok(K.SEE,R):o.ok):(r||o.no||"Not yet.");done(ok)})}});
/* a service call: a fixed machine state to diagnose. o: {t,intro,state, model, draw, reads, slider:[k,label,min,max,step,fmt], hist:{vals,lbls,title,max,unit}, actions:[[label,(R,S)=>html]], causes:[[k,label]], ans, why, hint} */
K.caseTask=o=>({t:o.t,intro:o.intro,ans:o.ans,mount(el,done){const S={...o.state};const id=K.uid("c");
 el.innerHTML=`<div class="lsCase"><div class="drawing"><div class="scroller"><svg class="caseSvg" viewBox="${o.vb||"0 0 720 380"}" role="img" aria-label="The machine on this service call"></svg></div></div>
  <div><div class="reads lsReads caseReads"></div>${o.slider?`<div class="row"><label for="${id}s">${o.slider[1]}</label><output class="caseLo"></output><input type="range" id="${id}s" class="caseLoad" min="${o.slider[2]}" max="${o.slider[3]}" step="${o.slider[4]}"></div>`:""}
  ${o.hist?`<div class="caseHist"></div>`:""}${o.actions?`<div class="btns">${o.actions.map((a,i)=>`<button class="btn caseAct" data-a="${i}">${a[0]}</button>`).join("")}</div><div class="caseActR"></div>`:""}
  <label class="lsPick">What's causing it? <select class="casePick"><option value="">Choose...</option>${o.causes.map(([k,n])=>`<option value="${k}">${n}</option>`).join("")}</select></label>
  <div class="btns"><button class="btn blue caseCheck">Check</button></div><p class="caseRes"></p></div></div>`;
 const q=c=>el.querySelector(c);const done1={};
 const upd=()=>{const R=o.model(S);q(".caseSvg").innerHTML=o.draw(R,S);K.legible(q(".caseSvg"));q(".caseReads").innerHTML=K.reads(o.reads(R,S));
  if(o.slider){q(".caseLo").textContent=o.slider[5]?o.slider[5](S[o.slider[0]]):S[o.slider[0]];q(".caseLoad").value=S[o.slider[0]]}
  if(o.actions)q(".caseActR").innerHTML=Object.keys(done1).map(i=>`<p class="note" style="color:var(--ink)">${o.actions[i][1](R,S)}</p>`).join("")};
 if(o.hist)q(".caseHist").innerHTML=K.hist(o.hist);
 if(o.slider)q(".caseLoad").addEventListener("input",e=>{S[o.slider[0]]=+e.target.value;upd()});
 el.querySelectorAll(".caseAct").forEach(b=>b.addEventListener("click",()=>{done1[b.dataset.a]=1;upd()}));
 q(".caseCheck").addEventListener("click",()=>{const v=q(".casePick").value;const r=q(".caseRes");if(!v){r.className="caseRes";r.textContent="Pick a cause first.";return}const ok=v===o.ans;r.className="caseRes lsRes "+(ok?"ok":"no");r.innerHTML=(ok?"Right. "+o.why:"Not this one. "+o.hint);done(ok)});
 upd()}});
K.hist=h=>{const W=460,H=140,mx=h.max||Math.ceil(Math.max(...h.vals)*1.25),X=i=>44+i*(W-64)/(h.vals.length-1),Y=a=>H-24-a/mx*(H-56);const st=mx/4;
 let s=`<svg viewBox="0 0 ${W} ${H}" class="lsHist" role="img" aria-label="Log history">${K.lbl(8,14,h.title,{a:"start"})}`;
 for(let i=0;i<=4;i++){const a=i*st;s+=`<path d="M44 ${Y(a)} H${W-20}" stroke="var(--panel-edge)" stroke-width=".6"/><text x="38" y="${Y(a)+4}" class="lsG" style="text-anchor:end">${+a.toFixed(1)}${h.unit||""}</text>`}
 s+=`<polyline points="${h.vals.map((a,i)=>`${X(i)},${Y(a)}`).join(" ")}" fill="none" stroke="var(--hot)" stroke-width="2.4"/>`+h.vals.map((a,i)=>`<circle cx="${X(i)}" cy="${Y(a)}" r="3.5" fill="var(--hot)"/><text x="${X(i)}" y="${H-6}" class="lsG">${h.lbls[i]}</text>`).join("");return s+"</svg>"};
/* On the job HTML from parts */
K.job=o=>`<div class="lsJob">${o.read?`<div class="group"><h3>What to read</h3><ul>${o.read.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}
${o.table?`<div class="group"><h3>${o.tableT||"Normal and action points"}</h3><table class="lsTbl"><tr>${o.table[0].map(c=>`<th>${c}</th>`).join("")}</tr>${o.table.slice(1).map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`:""}
${o.steps?`<div class="group"><h3>${o.stepsT||"How to check it"}</h3><ol>${o.steps.map(x=>`<li>${x}</li>`).join("")}</ol></div>`:""}
${o.log?`<div class="group"><h3>Log it</h3><p>${o.log}</p></div>`:""}
${o.safety?`<div class="group"><h3>Safety</h3><ul>${o.safety.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}
${o.mistakes?`<div class="group"><h3>Common mistakes</h3><ul>${o.mistakes.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}</div>`;
/* card grid for a Learn step: cards:[{t, inner(svg at 0..330 x 0..160), note}] in 2 columns */
K.cards=(cards,o={})=>{const cw=o.w||330,ch=o.h||160;return cards.map((c,i)=>`<g transform="translate(${20+(i%2)*(cw+20)} ${10+Math.floor(i/2)*(ch+20)})"><rect width="${cw}" height="${ch}" rx="10" fill="var(--paper)" stroke="var(--panel-edge)"/>${K.lbl(14,24,c.t,{a:"start",fill:c.c})}${c.inner}${c.note?K.txt(14,ch-10,c.note,{a:"start"}):""}</g>`).join("")};
