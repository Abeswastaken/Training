b=open('bt.orig.html').read()
def B(a,c,cnt=1):
    global b
    assert b.count(a)==cnt,(a[:70],b.count(a));b=b.replace(a,c)
rz=open('../rz.js').read()+open('../rz_cards.js').read()
B("<script>\n(()=>{\nconst $=id=>document.getElementById(id);","<script>\n(()=>{\nconst $=id=>document.getElementById(id);\n"+rz+"\nrzEnsureDefs();\n")
for key in ['const HYD={id:"hyd",p:"h_",name:"Hot water",\n svg:`','const STEAM={id:"steam",p:"s_",name:"Steam",\n svg:`']:
    a=b.index(key);s1=b.index('svg:`',a);e1=b.index('`,\n consts:',s1)
    b=b[:s1]+('svg:HYD_SVG' if 'hyd' in key else 'svg:STEAM_SVG')+b[e1+1:]
B("/* ============ HOT WATER ============ */",open('boiler_rz.js').read()+"\n/* ============ HOT WATER ============ */")
B('function switchSim(id){cur=SIMS[id];$("svg").innerHTML=`<g id="draw-${id}">${cur.svg}</g>`;','function switchSim(id){cur=SIMS[id];$("svg").innerHTML=`<g id="draw-${id}">${cur.svg}</g>`;bzPipes($("svg"));')
B('cur.draw(running?real:0);syncStrip();','cur.draw(running?real:0);bzFollow($("svg"));syncStrip();')
B('function syncFaults(){const sim=cur;document.querySelectorAll("input[data-f]").forEach(i=>{i.checked=!!sim.F[i.dataset.f];i.disabled=!!sim.mystery});',
  'function syncFaults(){const sim=cur;document.querySelectorAll("input[data-f]").forEach(i=>{i.checked=!!sim.F[i.dataset.f]&&!(sim.mystery&&sim.mystery[0]===i.dataset.f);i.disabled=!!sim.mystery});')
B('if(cur.mystery){i.checked=!!cur.F[i.dataset.f];return}','if(cur.mystery){i.checked=!!cur.F[i.dataset.f]&&cur.mystery[0]!==i.dataset.f;return}')
B('''f:"If it stops, heat stays in the boiler: the boiler cycles on its high limit while the room gets cold.",src:["oep","l8148"],faults:["pumpFail"]},''',
'''f:"If it stops, heat stays in the boiler: the boiler cycles on its high limit while the room gets cold. Note: many packaged boilers ship with the circulator on the return, pumping into the boiler. With a small low-head circulator and correct fill pressure that works in most houses; pumping away from the tank is still the preferred layout, especially on taller or larger systems.",src:["oep","l8148"],faults:["pumpFail"]},''')
B('''f:"Stuck shut: air stays trapped, steam reaches the radiators slowly, pressure builds early and the pressuretrol short-cycles the burner while rooms stay cold.",src:["vent"],faults:["mainVent"]},''',
'''f:"Stuck shut: air stays trapped, steam reaches the radiators slowly, pressure builds early and the pressuretrol short-cycles the burner while rooms stay cold. Some small systems skip the main vent and rely on the radiator vents alone, but a main vent is standard on residential one-pipe steam. Two-pipe systems are different: the end of each main drains through a float and thermostatic (F&amp;T) trap into the return, and air leaves through vents on the dry return. That trap comes later with a two-pipe steam sim.",src:["vent"],faults:["mainVent"]},''')
B('''feeder:{n:"Automatic water feeder",s:"Adds water when the level drops.",w:"A valve that adds water when the level drops to its feed point, just above the cutoff.",''',
'''feeder:{n:"Automatic water feeder",s:"Adds water when the level drops.",w:"A valve that adds water when the level drops to its feed point, just above the cutoff. Its outlet is piped into the wet return below the Hartford loop's close nipple, so cold makeup water mixes with returning condensate instead of hitting hot sections directly.",''')
B('''fill:{n:"Fill valve",s:"Adds city water to hold fill pressure.",w:"A pressure-reducing valve. It lowers city water pressure and adds water whenever system pressure drops below its setting.",''',
'''fill:{n:"Fill valve",s:"Adds city water to hold fill pressure.",w:"A pressure-reducing valve. It lowers city water pressure and adds water whenever system pressure drops below its setting. Piping order: city water, backflow preventer, fill valve, then a tee into the expansion tank line under the air separator. That's the point of no pressure change, so the fill valve holds the pressure there.",''')
exec(open('patch_two.py').read())
# tag boiler feedback like the other trainers do
B('body.append(FEEDBACK.entry,text);','body.append(FEEDBACK.entry,"[Boiler] "+text);')
open('../dist/boiler-trainer.html','w').write(b)
full='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
i=b.index('<div class="wrap">')
open('../dist/fullboiler.html','w').write(full+b[:i]+'</head>\n<body>\n'+b[i:]+'\n</body>\n</html>\n')
b=open('../dist/boiler-trainer.html').read()
B('const K="#2a2d30",BR="#c9a24a",BRD="#8a6a22",IR="#4a4f54",ST="#9aa3aa",STL="#c4cacf",','const K="#2a2d30",BR="url(#zBrass)",BRD="#8a6a22",IR="url(#bzIron)",ST="url(#zSteelH)",STL="url(#zSteel)",')
B('const pipeV=(x,y1,y2,w=10,c=ST)=>','const pipeV=(x,y1,y2,w=10,c="url(#zSteel)")=>')
B('const box=(x,y,w,h,c,r=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="${K}" stroke-width="1.2"/>`;','const box=(x,y,w,h,c,r=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="${K}" stroke-width="1.2" filter="url(#zShadow)"/>`;')
import re
a=b.index('const ILL={');e=b.index('const ILL_MAP=')
ill=b[a:e]
for o,n in [('"#7b8e9e"','"url(#bzJacket)"'),('"#8fa2b2"','"url(#zSteelH)"'),('"#22262a"','"url(#zPlasticDk)"'),('"#3a3f44"','"url(#zPlasticDk)"'),('"#2f3337"','"url(#zShell)"'),('"#5a6168"','"url(#zSteelH)"'),('"#3b4045"','"url(#zPlasticDk)"'),('"#5c636a"','"url(#zAlu)"'),('"#9aa1a8"','"url(#zSteelH)"'),('"#c9ced2"','"url(#zAlu)"'),('"#8e969d"','"url(#zSteelH)"'),('"#d8dcdf"','"#eef0ee"'),('"#c23a2c"','"url(#bzRed)"'),('"#a8302a"','"url(#bzRed)"'),('fill="#6b8fb3"','fill="url(#bzTankB)"'),('"#e9e6dd"','"url(#bzBase)"'),('"#8a8f86"','"url(#zShell)"'),('fill="#d9d4c7"','fill="url(#zTan)"'),('stroke="${ST}"','stroke="#9aa3aa"'),('stroke="${STL}"','stroke="#c4cacf"'),('stroke="${BR}"','stroke="#c9a24a"')]:
    ill=ill.replace(o,n)
b=b[:a]+ill+b[e:]
# when the sheet is open the drawing's defs are still in the page, so the gradients resolve
open('../dist/boiler-trainer.html','w').write(b)
full='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
i=b.index('<div class="wrap">')
open('../dist/fullboiler.html','w').write(full+b[:i]+'</head>\n<body>\n'+b[i:]+'\n</body>\n</html>\n')
