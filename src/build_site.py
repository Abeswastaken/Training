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
 ('wiring','wiring-trainer.html','Wiring Board'),('ladder','ladder-trainer.html','Ladder Builder'),('motors','motors-trainer.html','Motors + VFD'),('boiler-trainer','boiler-trainer.html','Boiler'),('airflow','airflow-trainer.html','Airflow')]
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
for d,url in [('refrigeration','LYU9ZjW3aQ8bJqC5Q5iszU'),('heating','Q5JVax7hThLeunQarc1fvT'),('boiler-trainer','4wjw2HSYj2aUenYJB6tzc2'),('controls','DamkVP1NTQ6rKw4SjNqyjo'),('wiring','5Bee3Hzv2vQscFB31JCkiD'),('ladder','VH5NNdtGGCvp2cR1wgf12J'),('motors','4SWomubu3YxGtYdp8TAWfW'),('airflow','7UT14W2drD8bSnHt5RJZrb')]:
    a=f'href="https://claude.ai/artifact/{url}" target="_blank" rel="noopener"'
    assert a in h,d; h=h.replace(a,f'href="/{d}/"')
assert 'claude.ai' not in h
h=h.replace('<title>HVAC Trainers Home</title>','<title>HVAC Trainers</title>')
open(f'{OUT}/index.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+h.replace('</style>','</style>\n</head>\n<body>',1)+'\n</body>\n</html>\n')
open(f'{OUT}/CNAME','w').write('training.colvinj.com\n')
open(f'{OUT}/404.html','w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found</title><meta http-equiv="refresh" content="0; url=/"></head><body><p><a href="/">Back to all trainers</a></p></body></html>\n')
print('site written')
