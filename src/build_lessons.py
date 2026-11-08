# Lesson pages: one HTML per lesson, sharing lesson.css/lesson.js and the rz drawing defs.
PL=['lesson/kit.js','lesson/plant.js']
LESSONS=[('chill-how','How a centrifugal chiller works','chiller/how-it-works',PL+['lesson/chill_how.js']),
 ('chill-evap','Evaporator approach','chiller/evaporator-approach',['lesson/evap.js','lesson/chill_evap.js']),
 ('chill-cond','Condenser approach','chiller/condenser-approach',PL+['lesson/chill_cond.js']),
 ('chill-lift','Lift','chiller/lift',PL+['lesson/chill_lift.js']),
 ('chill-surge','Surge','chiller/surge',PL+['lesson/chill_surge.js']),
 ('chill-kwt','kW per ton','chiller/kw-per-ton',PL+['lesson/chill_kwt.js']),
 ('chill-tower','Cooling tower range and approach','chiller/cooling-tower',PL+['lesson/chill_tower.js']),
 ('chill-water','Tower water treatment','chiller/water-treatment',PL+['lesson/chill_water.js']),
 ('chill-safe','Chiller safeties','chiller/safeties',PL+['lesson/chill_safe.js']),
 ('chill-purge','Purge unit and non-condensables','chiller/purge',PL+['lesson/chill_purge.js']),
 ('ctl-pid','PID control loops','controls/pid',['lesson/kit.js','lesson/pidm.js','lesson/ctl_pid_learn.js'])]
RF=['lesson/kit.js','lesson/refdata.js','lesson/ref.js','lesson/ph_kit.js']
# tool pages use the lesson shell with their own tabs (not counted as lessons)
PH=[('ph-read','Reading the P-H chart','ph-chart/reading-the-chart',RF+['lesson/ph_read.js']),
 ('ph-plot','Plotting a cycle from gauge readings','ph-chart/plotting-a-cycle',RF+['lesson/ph_plot.js']),
 ('ph-energy','NRE, HOC, heat of rejection and COP','ph-chart/nre-hoc-cop',RF+['lesson/ph_energy.js']),
 ('ph-flow','Mass flow and capacity','ph-chart/mass-flow',RF+['lesson/ph_flow.js']),
 ('ph-faults','What faults look like on the chart','ph-chart/faults',RF+['lesson/ph_faults.js']),
 ('ph-compare','Comparing refrigerants','ph-chart/comparing-refrigerants',RF+['lesson/ph_compare.js'])]
LESSONS+=PH
TOOLS=[('ph-tool','Pressure-enthalpy chart','ph-chart',RF+['lesson/ph_tool.js'])]
if __name__=='__main__':
  css=open('base.css').read()+open('lesson/lesson.css').read()
  body=open('lesson/lesson-body.html').read()
  rz=open('rz.js').read()+open('rz_cards.js').read()+open('real.js').read()+open('real_cards.js').read()
  eng=open('lesson/lesson.js').read()
  for slug,title,path,files in LESSONS+TOOLS:
    js='(()=>{\n'+rz+'\nrzEnsureDefs();\n'+''.join(open(f).read()+'\n' for f in files)+'})();\n'+eng
    hd=f'''<title>{title} FB-Enable</title>
  <meta name="claude:viewport-fit-sides" content="cover">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
  '''
    open(f'dist/lesson-{slug}.html','w').write(hd+'<style>\n'+css+'</style>\n'+body+'<script>\n'+js+'</script>\n')
    open(f'dist/full-{"tool" if (slug,title,path,files) in TOOLS else "lesson"}-{slug}.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+hd+'<style>\n'+css+'</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'</script>\n</body>\n</html>\n')
    print('built',slug)
