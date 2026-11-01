exec(open("inline.py").read())
import re
app=open('app.js').read()
head=app[:app.index("const SPLIT_LAMPS")]
glob=app[app.index("let speed=10"):app.index("/* ============ SPLIT AC")]
fw=app[app.index("const SIMS="):]
fur=open('vfd.js').read()+open('vfd_ill.js').read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
fw=rep(fw,"const SIMS={split:SPLIT,hp:HP,cooler:COOLER,freezer:FREEZER};","const SIMS={vfd:VFD};")
fw=rep(fw,"if(meter&&sim===SPLIT)","if(meter&&sim.id===\"split\")")
fw=rep(fw,'let startSim="split"','let startSim="vfd"')
fw=rep(fw,"cur=SIMS[startSim]||SPLIT","cur=SIMS[startSim]||VFD")
fw=fw.replace('"rt-','"vt-')
fw=rep(fw,"function fbContext(){return `Refrigeration trainer (${cur.name}, ${cur.S.meter}), t=${Math.round(cur.S.t)}s, charge ${Math.round(cur.V.charge)}%,","function fbContext(){return `Motors trainer (${cur.name}, ${cur.S.bypass?\"bypass\":\"drive\"}, ${cur.S.ltype}), t=${Math.round(cur.S.t)}s,")
fw=rep(fw,'"[Refrigeration] "+text','"[Motors] "+text')
fw=rep(fw,'<output id="o_${s.k}">${Math.round(v)}${s.u}</output>','<output id="o_${s.k}">${s.step<1?(+v).toFixed(1):Math.round(v)}${s.u}</output>')
fw=rep(fw,'setSpeed(10);','setSpeed(1);')
fw=rep(fw,'setSpeed(60);running=true','setSpeed(sc.speed||60);running=true')
fw=fw.replace('Runs at 60x.','Runs sped up.')
js=head+glob+fur+"\n"+fw
css=open('base.css').read()+open('extra.css').read()+'.vmeter{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-family:var(--display);letter-spacing:.06em;text-transform:uppercase;font-size:13px}.vmeter select{flex:1;min-width:0;max-width:100%;font:13px var(--body);padding:6px;border-radius:5px;border:1px solid var(--panel-edge);background:var(--paper);color:var(--ink);min-height:36px}.vmeter output{font-family:var(--mono);font-size:17px;background:#b9c7a8;color:#111;padding:4px 10px;border-radius:4px;min-width:120px;text-align:right;text-transform:none;letter-spacing:0}'
body=open('body_vfd.html').read()
hd='''<title>Motors + VFD Trainer FB-Enable</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
'''
open('dist/motors-trainer.html','w').write(hd+'<style>\n'+css+'</style>\n'+body+'<script>\n'+js+'</script>\n')
open('dist/fullmotor.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+hd+'<style>\n'+css+'</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'</script>\n</body>\n</html>\n')
