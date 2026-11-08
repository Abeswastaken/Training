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
 ('wiring','wiring-trainer.html','Wiring Board'),('ladder','ladder-trainer.html','Ladder Builder'),('threephase','threephase-trainer.html','3-Phase Motor Control'),('motors','motors-trainer.html','Motors + VFD'),('boiler-trainer','boiler-trainer.html','Boiler'),('airflow','airflow-trainer.html','Airflow'),('combustion','combustion-trainer.html','Combustion and Gas'),('chiller','chiller-trainer.html','Chiller and Cooling Tower'),('hx','hx-trainer.html','Heat Exchangers')]
for d,f,name in SITES:
    s=open(T+f).read()
    s=s.replace('<small style="font-size:12px;color:var(--muted);letter-spacing:.08em">FB-Enable</small>','')
    s=re.sub(r'<title>(.*?) FB-Enable</title>',r'<title>\1</title>',s,count=1)
    assert '>FB-Enable<' not in s and 'FB-Enable</title>' not in s,f
    head,body=wrap(s)
    page='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+head+'\n'+CRUMB_CSS+'</head>\n<body>\n'+crumb(name)+body+'\n</body>\n</html>\n'
    os.makedirs(f'{OUT}/{d}',exist_ok=True);open(f'{OUT}/{d}/index.html','w').write(page)
# lesson pages (built by build_lessons.py)
from build_lessons import LESSONS,TOOLS
for slug,title,path,files in LESSONS+TOOLS:
    s=open(T+f'lesson-{slug}.html').read()
    s=re.sub(r'<title>(.*?) FB-Enable</title>',r'<title>\1 | HVAC Lessons</title>',s,count=1)
    head,body=wrap(s)
    page='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+head+'\n</head>\n<body>\n'+body+'\n</body>\n</html>\n'
    os.makedirs(f'{OUT}/{path}',exist_ok=True);open(f'{OUT}/{path}/index.html','w').write(page)
# home
h=open('home.html').read()
h=re.sub(r'\s*<div class="mock">.*?</div>\n','\n',h,count=1,flags=re.S)
for d,url in [('refrigeration','LYU9ZjW3aQ8bJqC5Q5iszU'),('heating','Q5JVax7hThLeunQarc1fvT'),('boiler-trainer','4wjw2HSYj2aUenYJB6tzc2'),('controls','DamkVP1NTQ6rKw4SjNqyjo'),('wiring','5Bee3Hzv2vQscFB31JCkiD'),('ladder','VH5NNdtGGCvp2cR1wgf12J'),('threephase','SCKwfycGjKMTrXEVSF9ovd'),('motors','4SWomubu3YxGtYdp8TAWfW'),('airflow','7UT14W2drD8bSnHt5RJZrb'),('combustion','X1A5NuSUnAPLiaQyNFFTo4'),('chiller','FwymfU92pf9g7su4G34psU'),('hx','QHZgqT4nHpHyFkXHjksrNS')]:
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
 'hx':['Live temperature graph along the exchanger','Approach, LMTD, effectiveness and the temperature cross','Steam converter, DHW tank coil, coaxial and finned coils','Faults: scale, air binding, gasket leaks, frost, stuck wheel'],
 'controls':['Pneumatic thermostat, PRV and spring ranges','DDC sensors, 2-10 V and trends','PID tuning: 5 guided lessons on a zone reheat valve, then free play','Calibration benches: Honeywell TP970/TP971, JCI T-4002, Siemens TH 192, TK-1001/1101','Fail-safe check: DA/RA thermostats with NO/NC valves and dampers'],
 'wiring':['Drag-and-wire board with a live multimeter','Examples: condensing unit, furnace, heat pump, walk-in'],
 'ladder':['Build rungs from a searchable parts menu, drag to move','Transformer with a 24 V ladder under the line ladder','Multimeter: volts, ohms, continuity','Service calls: find the failed part','Examples: furnace sequence, heat pump O/B, two-stage, boiler, walk-in pump-down'],
 'threephase':['Colored L1/L2/L3 power circuit: 208/240 V or 480 V','Control transformer, X1 fused, X2 grounded, 120 or 24 V','Start/stop, forward/reverse, jog, timed sequence, wye-delta','Swap two leads, single phasing, overloads, meter'],
 'motors':['Ramps, DC bus, bypass and overloads','Drive fault codes and megger tests'],
 'ph-chart':['<b>Tabs:</b> Chart, Calculator, Property table','R-410A, R-454B, R-32, R-22, R-134a and R-404A','Calculator laid out like the class P/E sheet, with both methods side by side']}
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
# System rows: header, then the simulator card beside its lesson tiles.
def lead_of(files):
    for f in files[::-1]:
        m=re.search(r'lead:"([^"]*)"',open(f).read())
        if m:return m.group(1)
    return ''
NAMES={d:n for d,f,n in SITES}
NAMES['chiller']='Chiller and cooling tower';NAMES['combustion']='Combustion and gas';NAMES['ph-chart']='P-H charts';NAMES['mini-split']='Mini-splits'
def sysblock(d,card):
    ls=[(t,p,fs) for sl,t,p,fs in LESSONS if p.split('/')[0]==d]
    if not ls:return None
    tiles=''.join(f'<a class="ltile" href="/{p}/"><span class="ln">Lesson {i+1}</span><b>{t}</b><p>{lead_of(fs)}</p><em>/{p}</em></a>' for i,(t,p,fs) in enumerate(ls))
    cnt=f'Simulator + {len(ls)} lesson'+('s' if len(ls)!=1 else '')
    return f'      <div class="sys"><div class="sysHead"><h3>{NAMES[d]}</h3><span>{cnt}</span></div><div class="sysRow">\n'+card+f'      <div class="lessons">{tiles}</div></div></div>\n'
def regroup(m):
    cards=re.findall(r'      <a class="card" href="/([a-z-]+)/">.*?</a>\n',m.group(1),flags=re.S)
    full=re.findall(r'(      <a class="card" href="/[a-z-]+/">.*?</a>\n)',m.group(1),flags=re.S)
    assert len(cards)==len(full)
    rows=[];rest=[]
    for d,c in zip(cards,full):
        b=sysblock(d,c);(rows.append(b) if b else rest.append(c))
    out=''
    if rows:out+='<div class="sysList">\n'+''.join(rows)+'    </div>\n'
    if rest:out+=('    ' if rows else '')+'<div class="grid">\n'+''.join(rest)+'    </div>\n'
    return out
h=re.sub(r'<div class="grid">\n(.*?)    </div>\n(?=  </section>)',regroup,h,flags=re.S)
h=h.replace('<!--nlessons-->',str(len(LESSONS)))
h=h.replace('<title>HVAC Trainers Home</title>','<title>HVAC Trainers</title>')
open(f'{OUT}/index.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+h.replace('</style>','</style>\n</head>\n<body>',1)+'\n</body>\n</html>\n')
open(f'{OUT}/CNAME','w').write('training.colvinj.com\n')
open(f'{OUT}/404.html','w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found</title><meta http-equiv="refresh" content="0; url=/"></head><body><p><a href="/">Back to all trainers</a></p></body></html>\n')
print('site written')
