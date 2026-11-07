# Lesson pages: one HTML per lesson, sharing lesson.css/lesson.js and the rz drawing defs.
LESSONS=[('chill-evap','Evaporator approach','chiller/evaporator-approach',['lesson/evap.js','lesson/chill_evap.js'])]
if __name__=='__main__':
  css=open('base.css').read()+open('lesson/lesson.css').read()
  body=open('lesson/lesson-body.html').read()
  rz=open('rz.js').read()+open('rz_cards.js').read()+open('real.js').read()+open('real_cards.js').read()
  eng=open('lesson/lesson.js').read()
  for slug,title,path,files in LESSONS:
    js='(()=>{\n'+rz+'\nrzEnsureDefs();\n'+''.join(open(f).read()+'\n' for f in files)+'})();\n'+eng
    hd=f'''<title>{title} FB-Enable</title>
  <meta name="claude:viewport-fit-sides" content="cover">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
  '''
    open(f'dist/lesson-{slug}.html','w').write(hd+'<style>\n'+css+'</style>\n'+body+'<script>\n'+js+'</script>\n')
    open(f'dist/full-lesson-{slug}.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+hd+'<style>\n'+css+'</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'</script>\n</body>\n</html>\n')
    print('built',slug)
