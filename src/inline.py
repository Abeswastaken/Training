import re
s=open('app.js').read()
def put(tag,txt):
    global s
    a=s.index('/*%s-BEGIN*/'%tag)+len('/*%s-BEGIN*/'%tag);b=s.index('/*%s-END*/'%tag)
    s=s[:a]+'\n'+txt+'\n'+s[b:]
put('RZ',open('rz.js').read()+open('rz_cards.js').read()+open('real.js').read()+open('real_cards.js').read())
put('AC',open('ac_svg.js').read()+open('rz_rv.js').read()+open('rz_ref.js').read()+open('rz_hose.js').read())
open('app.js','w').write(s)
