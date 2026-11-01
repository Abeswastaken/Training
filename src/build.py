exec(open("inline.py").read())
import sys
css=open('base.css').read()+open('extra.css').read()
body=open('body.html').read(); js=open('app.js').read()
head='''<title>Refrigeration Trainer FB-Enable</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
'''
frag=head+'<style>\n'+css+'</style>\n'+body+'<script>\n'+js+'</script>\n'
open('dist/refrigeration-trainer.html','w').write(frag)
full='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+head+'<style>\n'+css+'</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'</script>\n</body>\n</html>\n'
open('dist/full.html','w').write(full)
