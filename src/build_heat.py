exec(open("inline.py").read())
import re
app=open('app.js').read()
head=app[:app.index("const SPLIT_LAMPS")]
glob=app[app.index("let speed=10"):app.index("/* ============ SPLIT AC")]
fw=app[app.index("const SIMS="):]
fur=open('furnace.js').read()+'\n'+open('oil.js').read()+'\n'+open('hyd.js').read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
fw=rep(fw,"const SIMS={split:SPLIT,hp:HP,cooler:COOLER,freezer:FREEZER};","const SIMS={furnace:FURNACE,oil:OIL,ahu:AHU};")
fw=rep(fw,"if(meter&&sim===SPLIT)","if(meter&&sim.id===\"split\")")
fw=rep(fw,'let startSim="split"','let startSim="furnace"')
fw=rep(fw,"cur=SIMS[startSim]||SPLIT","cur=SIMS[startSim]||FURNACE")
fw=fw.replace('"rt-','"ht-')
fw=rep(fw,"function fbContext(){return `Refrigeration trainer (${cur.name}, ${cur.S.meter}), t=${Math.round(cur.S.t)}s, charge ${Math.round(cur.V.charge)}%,","function fbContext(){return `Heating trainer (${cur.name}${cur.S.type?\", \"+cur.S.type+\"%\":\"\"}), t=${Math.round(cur.S.t)}s,")
fw=rep(fw,'"[Refrigeration] "+text','"[Heating] "+text')
fw=rep(fw,'<output id="o_${s.k}">${Math.round(v)}${s.u}</output>','<output id="o_${s.k}">${s.step<1?(+v).toFixed(1):Math.round(v)}${s.u}</output>')
js=head+glob+fur+"\n"+fw
css=open('base.css').read()+open('extra.css').read()
body=open('body_heat.html').read()
hd='''<title>Heating Trainer FB-Enable</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
'''
open('dist/heating-trainer.html','w').write(hd+'<style>\n'+css+'</style>\n'+body+'<script>\n'+js+'</script>\n')
open('dist/fullheat.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+hd+'<style>\n'+css+'</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'</script>\n</body>\n</html>\n')
