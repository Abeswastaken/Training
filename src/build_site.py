import re,os,shutil
T='dist/'
OUT='..'  # the repo root is the published site
CRUMB_CSS='<style>.crumb{display:flex;gap:6px;align-items:center;font:600 13px "Barlow Condensed","Arial Narrow",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:8px max(16px,env(safe-area-inset-left,0px)) 0;color:var(--muted,#5b666d)}.crumb a{color:var(--brass,#9a6f1f);text-decoration:none}.crumb a:hover,.crumb a:focus-visible{text-decoration:underline}</style>\n'
def crumb(name):return f'<nav class="crumb" aria-label="Breadcrumb"><a href="/">← All trainers</a><span aria-hidden="true">/</span><span>{name}</span></nav>\n'
def wrap(frag):
    m=re.search(r'<title>.*?</title>',frag)
    i=frag.index('<style>');j=frag.index('</style>',i)+8
    head=frag[:j];body=frag[j:]
    return head,body
SITES=[('refrigeration','refrigeration-trainer.html','Refrigeration'),('heating','heating-trainer.html','Heating'),('controls','controls-trainer.html','Controls'),
 ('wiring','wiring-trainer.html','Wiring Board'),('ladder','ladder-trainer.html','Ladder Builder'),('threephase','threephase-trainer.html','3-Phase Motor Control'),('motors','motors-trainer.html','Motors + VFD'),('boiler-trainer','boiler-trainer.html','Boiler'),('airflow','airflow-trainer.html','Airflow'),('combustion','combustion-trainer.html','Combustion and Gas'),('chiller','chiller-trainer.html','Chiller and Cooling Tower')]
for d,f,name in SITES:
    s=open(T+f).read()
    s=s.replace('<small style="font-size:12px;color:var(--muted);letter-spacing:.08em">FB-Enable</small>','')
    s=re.sub(r'<title>(.*?) FB-Enable</title>',r'<title>\1</title>',s,count=1)
    assert '>FB-Enable<' not in s and 'FB-Enable</title>' not in s,f
    head,body=wrap(s)
    page='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+head+'\n'+CRUMB_CSS+'</head>\n<body>\n'+crumb(name)+body+'\n</body>\n</html>\n'
    os.makedirs(f'{OUT}/{d}',exist_ok=True);open(f'{OUT}/{d}/index.html','w').write(page)
# home
h=open('home.html').read()
h=re.sub(r'\s*<div class="mock">.*?</div>\n','\n',h,count=1,flags=re.S)
for d,url in [('refrigeration','LYU9ZjW3aQ8bJqC5Q5iszU'),('heating','Q5JVax7hThLeunQarc1fvT'),('boiler-trainer','4wjw2HSYj2aUenYJB6tzc2'),('controls','DamkVP1NTQ6rKw4SjNqyjo'),('wiring','5Bee3Hzv2vQscFB31JCkiD'),('ladder','VH5NNdtGGCvp2cR1wgf12J'),('threephase','SCKwfycGjKMTrXEVSF9ovd'),('motors','4SWomubu3YxGtYdp8TAWfW'),('airflow','7UT14W2drD8bSnHt5RJZrb'),('combustion','X1A5NuSUnAPLiaQyNFFTo4'),('chiller','FwymfU92pf9g7su4G34psU')]:
    a=f'href="https://claude.ai/artifact/{url}" target="_blank" rel="noopener"'
    assert a in h,d; h=h.replace(a,f'href="/{d}/"')
assert 'claude.ai' not in h

# "What's inside" bullets on each home card: the trainer's own system tabs, then its main tools.
# Tabs are read from the built page, so new tabs show up here without editing this list.
EXTRA={'refrigeration':['Gauges, PT charts and six refrigerants','Service calls and hidden faults'],
 'heating':['Combustion readings, flame and ignition sequence','Service calls and hidden faults'],
 'boiler-trainer':['Water-level cutaway, LWCOs, relief valve, Hartford loop','One-pipe (parallel flow or counterflow) and two-pipe steam','Steam stations: PRV, trap and drip, in 2D and isometric','Failures and explosion scenarios'],
 'airflow':['Static pressure, fan curves and balancing','Psychrometrics: what the coil does to the air'],
 'combustion':['Combustion analyzer, draft and CAZ testing','CO safety'],
 'chiller':['Approaches, lift and surge','Tower water treatment and safeties'],
 'controls':['Pneumatic thermostat, PRV and spring ranges','DDC sensors, 2-10 V and trends'],
 'wiring':['Drag-and-wire board with a live multimeter','Examples: condensing unit, furnace, heat pump, walk-in'],
 'ladder':['Build rungs from a searchable parts menu, drag to move','Transformer with a 24 V ladder under the line ladder','Multimeter: volts, ohms, continuity','Service calls: find the failed part','Examples: furnace sequence, heat pump O/B, two-stage, boiler, walk-in pump-down'],
 'threephase':['Colored L1/L2/L3 power circuit: 208/240 V or 480 V','Control transformer, X1 fused, X2 grounded, 120 or 24 V','Start/stop, forward/reverse, jog, timed sequence, wye-delta','Swap two leads, single phasing, overloads, meter'],
 'motors':['Ramps, DC bus, bypass and overloads','Drive fault codes and megger tests']}
def tabs_of(d):
    f={'boiler-trainer':'boiler'}.get(d,d)
    try:s=open(f'dist/{f}-trainer.html').read()
    except FileNotFoundError:return []
    t=re.findall(r'data-sim="[a-z0-9_]+"[^>]*>([^<]+)<',s) or re.findall(r'<button id="sim[A-Z][a-z]*"[^>]*>([^<]+)<',s)
    return list(dict.fromkeys(t))
for d in EXTRA:
    t=tabs_of(d)
    li=([f'<li><b>Tabs:</b> {", ".join(t)}</li>'] if len(t)>1 else [])+[f'<li>{x}</li>' for x in EXTRA[d]]
    h=h.replace(f'<!--inside:{d}-->','<ul class="inside">'+''.join(li)+'</ul>')
assert '<!--inside:' not in h
h=h.replace('<title>HVAC Trainers Home</title>','<title>HVAC Trainers</title>')
open(f'{OUT}/index.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+h.replace('</style>','</style>\n</head>\n<body>',1)+'\n</body>\n</html>\n')
open(f'{OUT}/CNAME','w').write('training.colvinj.com\n')
open(f'{OUT}/404.html','w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found</title><meta http-equiv="refresh" content="0; url=/"></head><body><p><a href="/">Back to all trainers</a></p></body></html>\n')
print('site written')
