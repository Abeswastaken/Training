import sys,re
sys.path.insert(0,'/home/user/training/src')
import home_art as A
p='/home/user/training/src/home.html';s=open(p).read()
hrefs=re.findall(r'<a class="card" href="/([^/"]+)/"',s)
assert hrefs==['ph-chart','mini-split','carlyle-06d','psychrometrics'],hrefs
i=0
def rep(m):
    global i
    k=A.ORDER[i];i+=1;return A.svg(k)
s=re.sub(r'<svg class="art" viewBox="0 0 320 180" aria-hidden="true">.*?</svg>',rep,s,flags=re.S)
assert i==16,i
s=re.sub(r'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>.*?</defs></svg>\n?','',s,flags=re.S)
k=s.index('  <header class="plate">')
s=s[:k]+A.DEFS+'\n'+s[k:]
open(p,'w').write(s);print(len(s))
