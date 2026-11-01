# ---- service call mode, shared with the framework trainers (code lives in ../app.js) ----
app=open('../app.js').read()
svc=app[app.index('// ---- Service call mode'):app.index('// ---- end service call ----')].replace('"rt-svc-','"bt-svc-')
B('function renderFailures(){const sim=cur;',svc+'function renderFailures(){const sim=cur;')
B('function reset(sim,quiet){sim.F={};sim.faults.forEach(f=>sim.F[f[0]]=false);sim.mystery=null;','function reset(sim,quiet){sim.F={};sim.faults.forEach(f=>sim.F[f[0]]=false);sim.mystery=null;sim.call=null;')
B("""   <div class="group"><h3>Mystery fault</h3><p>Starts one hidden fault. Watch the gauges and the log, then reveal it.</p>
     <div class="btns"><button class="btn" id="mystery">Start mystery fault</button><button class="btn" id="reveal" hidden>Reveal</button></div>
     <div class="mystery" id="mysteryTxt" hidden></div></div>
""","")
B("""   <div class="group"><h3>Catastrophe scenarios</h3>""","""   <div class="group"><h3>Service call</h3><p>A customer calls with a complaint and one hidden fault. Read the gauges and the log, open the parts, then pick your diagnosis. Wrong guesses cost 25 points and hints cost 15.</p>
     <div class="btns"><button class="btn" id="svcNew">${sim.call&&!sim.call.done?"New call (abandons this one)":"Start service call"}</button></div>
     <div id="svcBox">${svcHTML(sim)}</div><p class="svcmeta">Best score on this tab: ${svcBest(sim)}</p></div>
   <div class="group"><h3>Catastrophe scenarios</h3>""")
B("""  const mt=$("mysteryTxt"),rv=$("reveal");if(mt){mt.hidden=!sim.mystery&&!sim.revealed;mt.textContent=sim.mystery?"A hidden fault is running. Watch the gauges.":sim.revealed?`The fault was: ${sim.revealed}.`:"";rv.hidden=!sim.mystery}}""",
  """  const sb=$("svcBox");if(sb)sb.innerHTML=svcHTML(sim);const sn=$("svcNew");if(sn)sn.textContent=sim.call&&!sim.call.done?"New call (abandons this one)":"Start service call"}""")
_a=b.index('    case "mystery":');_e=b.index('    case "clearF":')
b=b[:_a]+"""    case "svcNew":svcStart(cur);break;
    case "svcGo":svcGuess(cur,$("svcPick").value);break;
    case "svcHint":svcHint(cur);break;
    case "svcQuit":svcGiveUp(cur);break;
"""+b[_e:]
B('    case "clearF":cur.mystery=null;','    case "clearF":if(cur.call&&!cur.call.done)svcGiveUp(cur);cur.mystery=null;')
B('.mystery{font-size:14px;color:var(--bad);font-weight:600}',""".mystery{font-size:14px;color:var(--bad);font-weight:600}
.ticket{border:1px solid var(--line);border-left:4px solid var(--brass);border-radius:8px;padding:10px 12px;margin-top:8px;background:var(--paper)}
.ticket p{margin:6px 0}.ticket select{width:100%;margin:4px 0 8px}.ticket .hint{color:var(--warn);font-weight:600}
.ticket .good{color:var(--ok);font-weight:700}.svcmeta{font-size:12px;color:var(--muted)}""")
B('\n})();\n</script>','\nwindow.__rt={SIMS,svc:{start:svcStart,guess:svcGuess,hint:svcHint,quit:svcGiveUp,C:COMPLAINTS},cur:()=>cur,step:(n,dt=0.5)=>{for(let i=0;i<n&&!cur.S.dead;i++)cur.step(dt)}};\n})();\n</script>')
