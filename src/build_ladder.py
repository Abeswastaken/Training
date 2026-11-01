css=open('base.css').read()+open('ladder.css').read()
body=open('ladder-body.html').read();js=open('ladder.js').read()
rz=open('rz.js').read()+open('rz_cards.js').read()+open('real.js').read()+open('real_cards.js').read()
js=js.replace('(()=>{','(()=>{\n'+rz+'\nrzEnsureDefs();\n',1).replace('/* ---------- drawing ---------- */',open('ladder_rz.js').read()+open('ladder_cards.js').read()+'\n/* ---------- drawing ---------- */',1)
hd='''<title>Ladder Builder FB-Enable</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
'''
frag=hd+'<style>\n'+css+'</style>\n'+body+'<script>\n'+js+'</script>\n'
open('dist/ladder-trainer.html','w').write(frag)
open('dist/fullladder.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+hd+'<style>\n'+css+'</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'</script>\n</body>\n</html>\n')
