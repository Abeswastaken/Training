# Home page card pictures, drawn from scratch (320x180 each). ART[name] -> svg inner markup, DEFS -> shared defs.
import math
defs={}
def sh(c,f):
    r,g,b=[int(c[i:i+2],16) for i in (1,3,5)]
    if f>=1: r,g,b=[min(255,int(v+(255-v)*(f-1))) for v in (r,g,b)]
    else: r,g,b=[int(v*f) for v in (r,g,b)]
    return '#%02x%02x%02x'%(r,g,b)
def G(c,o='v'):
    i='hc'+c[1:]+o
    if i not in defs:
        xy='x1="0" x2="1" y1="0" y2="0"' if o=='v' else 'x1="0" x2="0" y1="0" y2="1"'
        defs[i]='<linearGradient id="%s" %s><stop offset="0" stop-color="%s"/><stop offset=".2" stop-color="%s"/><stop offset=".42" stop-color="%s"/><stop offset=".8" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'%(i,xy,sh(c,.5),sh(c,1.5),c,sh(c,.62),sh(c,.4))
    return 'url(#%s)'%i
def F(c):
    i='hf'+c[1:]
    if i not in defs:
        defs[i]='<linearGradient id="%s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%s"/><stop offset=".5" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'%(i,sh(c,1.28),c,sh(c,.78))
    return 'url(#%s)'%i
def R(c):
    i='hr'+c[1:]
    if i not in defs:
        defs[i]='<radialGradient id="%s" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="%s"/><stop offset=".55" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient>'%(i,sh(c,1.55),c,sh(c,.45))
    return 'url(#%s)'%i
defs['hcBlur']='<filter id="hcBlur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="2.4"/></filter>'
defs['hcGlow']='<filter id="hcGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>'
n=lambda v:('%.1f'%v).rstrip('0').rstrip('.')
def rect(x,y,w,h,f,r=0,ex=''):return '<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s" %s/>'%(n(x),n(y),n(w),n(h),n(r),f,ex)
def circ(x,y,r,f,ex=''):return '<circle cx="%s" cy="%s" r="%s" fill="%s" %s/>'%(n(x),n(y),n(r),f,ex)
def ell(x,y,rx,ry,f,ex=''):return '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" %s/>'%(n(x),n(y),n(rx),n(ry),f,ex)
def path(d,f='none',ex=''):return '<path d="%s" fill="%s" %s/>'%(d,f,ex)
def line(x1,y1,x2,y2,c,w=1,ex=''):return '<path d="M%s %sL%s %s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round" %s/>'%(n(x1),n(y1),n(x2),n(y2),c,n(w),ex)
def txt(x,y,s,sz=6,c='#1d262c',ex=''):return '<text x="%s" y="%s" font-size="%s" fill="%s" font-family="ui-monospace,Menlo,monospace" font-weight="700" %s>%s</text>'%(n(x),n(y),n(sz),c,ex,s)
def shadow(cx,cy,rx,ry=5,o=.28):return ell(cx,cy,rx,ry,'#10161a','opacity="%s" filter="url(#hcBlur)"'%o)
def bg(wall='#e9edf0',floor='#c9d0d5',fy=148):
    return rect(0,0,320,180,F(wall))+rect(0,fy,320,180-fy,F(floor))+line(0,fy,320,fy,sh(floor,.8),.6)
def box(x,y,w,h,d,c,r=0,top=None,side=None):
    dx,dy=d,-d*.5
    s=path('M%s %sL%s %sL%s %sL%s %sZ'%(n(x),n(y),n(x+dx),n(y+dy),n(x+w+dx),n(y+dy),n(x+w),n(y)),top or F(sh(c,1.3)))
    s+=path('M%s %sL%s %sL%s %sL%s %sZ'%(n(x+w),n(y),n(x+w+dx),n(y+dy),n(x+w+dx),n(y+h+dy),n(x+w),n(y+h)),side or F(sh(c,.62)))
    s+=rect(x,y,w,h,F(c),r)+line(x,y+.4,x+w,y+.4,sh(c,1.6),.7,'opacity=".8"')
    return s
def cylh(x,y,l,h,c,cap=True):
    rx=h*.16
    s=ell(x,y+h/2,rx,h/2,G(c,'h'))+rect(x,y,l,h,G(c,'h'))
    if cap:s+=ell(x+l,y+h/2,rx,h/2,F(sh(c,1.12)),'stroke="%s" stroke-width=".5"'%sh(c,.5))
    return s
def cylv(x,y,w,h,c,cap=True):
    ry=w*.16
    s=ell(x+w/2,y+h,w/2,ry,G(c,'v'))+rect(x,y,w,h,G(c,'v'))
    if cap:s+=ell(x+w/2,y,w/2,ry,F(sh(c,1.25)),'stroke="%s" stroke-width=".5"'%sh(c,.55))
    return s
def pipe(d,w,c):
    b='stroke-linecap="round" stroke-linejoin="round"'
    return path(d,'none','stroke="%s" stroke-width="%s" %s'%(sh(c,.5),n(w),b))+path(d,'none','stroke="%s" stroke-width="%s" %s'%(c,n(w*.68),b))+path(d,'none','stroke="%s" stroke-width="%s" opacity=".75" %s transform="translate(%s %s)"'%(sh(c,1.6),n(w*.2),b,n(-w*.12),n(-w*.14)))
def bolt(x,y,r=1.5):return circ(x,y,r,'#23292d')+circ(x-r*.15,y-r*.15,r*.6,'#aab3b9')
def bolts(pts,r=1.5):return ''.join(bolt(x,y,r) for x,y in pts)
def flange(x,y,w,h,c='#6f787e'):return rect(x,y,w,h,G(c,'v' if h>w else 'h'),.8)
def gauge(x,y,r,a,face='#f7f5ee',ring='#2d3439',red=False,col=None):
    s=shadow(x+1,y+r*.9,r*.9,2.5,.25)+circ(x,y,r,R(ring))+circ(x,y,r*.84,R(face))
    if col:s+=path(arc(x,y,r*.66,-210,30),'none','stroke="%s" stroke-width="%s" opacity=".85"'%(col,n(r*.14)))
    for k in range(9):
        t=math.radians(-210+k*30);s+=line(x+math.cos(t)*r*.6,y+math.sin(t)*r*.6,x+math.cos(t)*r*.76,y+math.sin(t)*r*.76,'#2a3136',.7)
    if red:s+=path(arc(x,y,r*.68,-30,30),'none','stroke="#c8372d" stroke-width="%s"'%n(r*.12))
    t=math.radians(a);s+=line(x-math.cos(t)*r*.18,y-math.sin(t)*r*.18,x+math.cos(t)*r*.66,y+math.sin(t)*r*.66,'#c8372d' if not red else '#1d262c',1.1)+circ(x,y,r*.12,'#2a3136')
    s+=path(arc(x,y,r*.9,-160,-100),'none','stroke="#fff" stroke-width="%s" opacity=".5" stroke-linecap="round"'%n(r*.08))
    return s
def arc(x,y,r,a0,a1):
    p0=(x+r*math.cos(math.radians(a0)),y+r*math.sin(math.radians(a0)));p1=(x+r*math.cos(math.radians(a1)),y+r*math.sin(math.radians(a1)))
    return 'M%s %sA%s %s 0 %d 1 %s %s'%(n(p0[0]),n(p0[1]),n(r),n(r),1 if (a1-a0)%360>180 else 0,n(p1[0]),n(p1[1]))
def fan(x,y,r,ry=None,blades=5,c='#3a4248',grille=True):
    ry=ry or r;k=ry/r
    s='<g transform="translate(%s %s) scale(1 %s)">'%(n(x),n(y),n(k))
    s+=circ(0,0,r,R('#1c2125'))
    for i in range(blades):
        s+='<path d="M0 0C%s %s %s %s %s 0C%s %s %s %s 0 0Z" fill="%s" transform="rotate(%s)"/>'%(n(r*.3),n(-r*.5),n(r*.8),n(-r*.45),n(r*.9),n(r*.7),n(r*.2),n(r*.3),n(r*.18),F(c),n(i*360/blades+12))
    s+=circ(0,0,r*.2,R('#8a949a'))
    if grille:
        for q in (.35,.52,.69,.86):s+=circ(0,0,r*q,'none','stroke="#aeb7bd" stroke-width=".7" opacity=".85"')
        for i in range(8):
            t=math.radians(i*45);s+=line(0,0,math.cos(t)*r,math.sin(t)*r,'#aeb7bd',.6,'opacity=".7"')
    s+=circ(0,0,r,'none','stroke="#596168" stroke-width="1.4"')+'</g>'
    return s
def flame(x,y,w,h,horizontal=False):
    g='<g transform="translate(%s %s)%s">'%(n(x),n(y),' rotate(90)' if horizontal else '')
    g+=ell(0,-h*.45,w*.9,h*.6,'#3d8bff','opacity=".35" filter="url(#hcGlow)"')
    g+=path('M%s 0C%s %s %s %s 0 %sC%s %s %s %s %s 0Z'%(n(-w/2),n(-w*.6),n(-h*.5),n(-w*.15),n(-h*.75),n(-h),n(w*.15),n(-h*.75),n(w*.6),n(-h*.5),n(w/2)),'#2f7df0','opacity=".9"')
    g+=path('M%s 0C%s %s %s %s 0 %sC%s %s %s %s %s 0Z'%(n(-w*.28),n(-w*.34),n(-h*.3),n(-w*.08),n(-h*.5),n(-h*.62),n(w*.08),n(-h*.5),n(w*.34),n(-h*.3),n(w*.28)),'#bfe3ff')
    return g+'</g>'
def louvers(x,y,w,h,k,c='#56606680',lw=.8):return ''.join(line(x,y+h*(i+.5)/k,x+w,y+h*(i+.5)/k,c,lw) for i in range(k))
def vlines(x,y,w,h,k,c,lw=.6):return ''.join(line(x+w*(i+.5)/k,y,x+w*(i+.5)/k,y+h,c,lw) for i in range(k))
def lcd(x,y,w,h,lines,c='#b9d48a',ink='#1f2b16',sz=5.2):
    s=rect(x-1.5,y-1.5,w+3,h+3,'#15191c',2)+rect(x,y,w,h,F(c),1)
    for i,t in enumerate(lines):s+=txt(x+2.5,y+sz+1.2+i*(sz+1.2),t,sz,ink)
    return s
def motor(x,y,l,h,c,box_=True,shaft='l',fins=True):
    # horizontal TEFC motor, body from x to x+l
    s=shadow(x+l/2,y+h+7,l*.62,4)
    s+=rect(x+l*.12,y+h-1,l*.76,6,F('#30363a'),1)+rect(x+l*.06,y+h+4,l*.88,3,F('#262b2f'),1)
    if shaft=='l':s+=cylh(x-l*.2,y+h*.42,l*.22,h*.16,'#b8c0c5',False)+rect(x-l*.2,y+h*.42,1.5,h*.16,'#7d868c')
    else:s+=cylh(x+l,y+h*.42,l*.2,h*.16,'#b8c0c5')
    s+=cylh(x+l*.1,y,l*.74,h,c,False)
    if fins:s+=''.join(line(x+l*.14,y+h*q,x+l*.8,y+h*q,sh(c,.5),.8,'opacity=".7"')+line(x+l*.14,y+h*q+1,x+l*.8,y+h*q+1,sh(c,1.5),.4,'opacity=".5"') for q in (.14,.26,.38,.5,.62,.74,.86))
    s+=cylh(x,y+h*.04,l*.12,h*.92,sh(c,.85),False)+ell(x,y+h/2,h*.15,h*.46,F(sh(c,1.05)),'stroke="%s" stroke-width=".5"'%sh(c,.5))
    s+=bolts([(x-1,y+h*.2),(x-1,y+h*.8),(x+2,y+h*.5)],1.1)
    s+=cylh(x+l*.82,y-h*.02,l*.18,h*1.04,sh(c,.7),True)   # fan cowl
    s+=''.join(line(x+l+q,y+h*.25,x+l+q,y+h*.75,'#14181b',.6,'opacity=".6"') for q in (-1.5,.5,2.5))
    if box_:s+=box(x+l*.34,y-h*.2,l*.26,h*.24,5,sh(c,.9),1)+bolts([(x+l*.37,y-h*.15),(x+l*.57,y-h*.15)],.9)
    s+=rect(x+l*.42,y+h*.52,l*.2,h*.2,F('#cfd5d8'),.6)+line(x+l*.44,y+h*.59,x+l*.6,y+h*.59,'#59626880',.5)+line(x+l*.44,y+h*.65,x+l*.56,y+h*.65,'#59626880',.5)
    return s
def hexnut(x,y,w,h,c='#c9a240'):return rect(x,y,w,h,G(c,'v' if h>=w else 'h'),.6)+line(x+w*.33,y,x+w*.33,y+h,sh(c,.6),.4)+line(x+w*.66,y,x+w*.66,y+h,sh(c,.6),.4) if h>=w else rect(x,y,w,h,G(c,'h'),.6)+line(x,y+h*.33,x+w,y+h*.33,sh(c,.6),.4)+line(x,y+h*.66,x+w,y+h*.66,sh(c,.6),.4)
CU='#c9794a';BR='#c9a240';ST='#9aa3a9';GALV='#b4bcc1';BLK='#2c3237'
ART={}

# ---------- 1 Refrigeration: condensing unit with gauge manifold ----------
def a():
    s=bg('#e6ecf0','#b9c4b4',146)
    s+=rect(120,144,170,7,F('#aeb4b6'),1)+shadow(215,153,95,4)
    x,y,w,h,d=140,58,112,86,34
    s+=box(x,y,w,h,d,'#a9b1b6',2)
    s+=rect(x+5,y+6,w-10,h-14,F('#3a4146'),1.5)+vlines(x+6,y+7,w-12,h-16,44,'#8d979d',.7)+louvers(x+5,y+6,w-10,h-14,9,'#c3cace',1.1)
    s+=rect(x+5,y+h-7,w-10,3,'#7c858b')
    # top fan
    cx,cy=x+w/2+d/2,y-d*.25
    s+=fan(cx,cy,40,6.6,5)
    # side panel: service valves, disconnect
    sx=x+w
    s+=path('M%s %sL%s %sL%s %sL%s %sZ'%(sx+8,y+38,sx+26,y+29,sx+26,y+62,sx+8,y+71),F('#8f989e'))
    s+=hexnut(sx+11,y+44,5,5)+hexnut(sx+11,y+56,4,4)
    # line set
    s+=pipe('M%s %sC%s %s 300 120 318 118'%(sx+14,y+47,sx+30,y+52),5.5,'#22272b')+pipe('M%s %sC%s %s 300 132 318 131'%(sx+13,y+58,sx+28,y+64),2.6,CU)
    # manifold
    s+=shadow(70,153,48,3.5,.2)
    s+=pipe('M40 92C30 130 70 150 150 %s'%(y+70),2.6,'#2f6fd0')+pipe('M100 92C108 122 126 128 %s %s'%(x+20,y+80),2.6,'#c8372d')+pipe('M70 96C70 126 52 142 86 149C104 152 60 156 44 150',2.6,'#e2b93b')
    s+=rect(30,76,80,13,G(BR,'h'),2)+rect(64,88,12,7,G(BR,'v'),1)+hexnut(36,88,8,6)+hexnut(96,88,8,6)
    s+=rect(22,78,10,8,F('#2f6fd0'),2)+rect(108,78,10,8,F('#c8372d'),2)
    s+=rect(66,40,8,10,F('#3a4146'),2)+path('M62 40Q70 28 78 40','none','stroke="#3a4146" stroke-width="3" stroke-linecap="round"')
    s+=gauge(48,58,21,-120,'#eef4fb','#2f6fd0')+gauge(92,58,21,-75,'#fbf0ee','#c8372d')
    return s
ART['refrigeration']=a()

# ---------- 2 P-H chart: chart sheet with refrigerant cylinder ----------
def a():
    s=bg('#e4e9ec','#b98f62',140)
    s+=''.join(line(0,140+q,320,140+q*1.6,'#8a643e',.5,'opacity=".5"') for q in (10,22,34))
    # sheet in perspective
    s+=path('M34 150L22 24L214 16L238 144Z','#10161a','opacity=".22" filter="url(#hcBlur)" transform="translate(4 5)"')
    s+='<g transform="matrix(1 -.04 .08 1 20 22)">'
    s+=rect(0,0,200,124,F('#fbfaf5'),1.5)
    gx,gy,gw,gh=20,10,168,94
    s+=''.join(line(gx+gw*i/12,gy,gx+gw*i/12,gy+gh,'#d9a48a',.35) for i in range(13))+''.join(line(gx,gy+gh*i/8,gx+gw,gy+gh*i/8,'#d9a48a',.35) for i in range(9))
    s+=''.join(path('M%s %sQ%s %s %s %s'%(n(gx+gw*.55+i*14),n(gy+gh),n(gx+gw*.72+i*13),n(gy+gh*.5),n(gx+gw*.74+i*12),n(gy)),'none','stroke="#6aa67a" stroke-width=".45" opacity=".8"') for i in range(5))
    s+=path('M%s %sC%s %s %s %s %s %s'%(gx+8,gy+gh,gx+40,gy+40,gx+62,gy+10,gx+84,gy+8),'none','stroke="#2463c8" stroke-width="1.8"')
    s+=path('M%s %sC%s %s %s %s %s %s'%(gx+84,gy+8,gx+106,gy+8,gx+116,gy+50,gx+120,gy+gh),'none','stroke="#c8372d" stroke-width="1.8"')
    s+=path('M%s %sL%s %sL%s %sL%s %sZ'%(gx+46,gy+26,gx+140,gy+26,gx+120,gy+68,gx+46,gy+68),'#e0903020','stroke="#1d262c" stroke-width="1.5" stroke-linejoin="round"')
    s+=''.join(circ(px,py,2.6,R('#c9902e')) for px,py in ((gx+46,gy+26),(gx+140,gy+26),(gx+120,gy+68),(gx+46,gy+68)))
    s+=line(gx,gy,gx,gy+gh,'#1d262c',.9)+line(gx,gy+gh,gx+gw,gy+gh,'#1d262c',.9)
    s+=txt(gx+50,gy+gh+12,'ENTHALPY  Btu/lb',5,'#59636a')+txt(8,gy+70,'PRESSURE',5,'#59636a','transform="rotate(-90 8 %s)"'%(gy+70))
    s+='</g>'
    # cylinder (R-410A rose)
    s+=shadow(268,160,30,4.5)
    c='#e58aa0'
    s+=cylv(244,70,48,88,c,False)+path('M244 70Q244 46 268 44Q292 46 292 70Z',G(c,'v'))
    s+=path('M252 50Q252 30 268 30Q284 30 284 50','none','stroke="%s" stroke-width="5"'%sh(c,.8))+path('M252 50Q252 30 268 30Q284 30 284 50','none','stroke="%s" stroke-width="1.2" opacity=".7" transform="translate(-1 -1.4)"'%sh(c,1.6))
    s+=rect(264,34,8,12,G(BR,'v'),1)+rect(259,31,18,4,F('#c8372d'),1.5)+rect(272,38,8,4,G(BR,'h'),.8)
    s+=rect(246,92,44,34,'#fbfaf5',1.5,'opacity=".96"')+txt(252,106,'R-410A',8.5,'#1d262c')+line(252,112,284,112,'#8b959b',.6)+line(252,117,276,117,'#8b959b',.6)+path('M278 114l5 6h-10z','#e2b93b')
    return s
ART['ph-chart']=a()

# ---------- 3 Mini-split ----------
def a():
    s=rect(0,0,320,180,F('#e9e2d6'))+rect(170,0,150,180,F('#cfdbe4'))+rect(166,0,8,180,F('#b3a48c'))
    s+=rect(0,150,166,30,F('#b58d63'))+rect(174,156,146,24,F('#9fb08f'))+rect(0,146,166,5,F('#f4f1ea'))
    # window
    s+=rect(18,40,48,62,F('#f4f1ea'),1)+rect(22,44,40,54,F('#bcd9ee'))+line(42,44,42,98,'#f4f1ea',2.4)+line(22,71,62,71,'#f4f1ea',2.4)
    # indoor head
    s+=shadow(104,62,52,4,.22)
    s+=path('M52 22Q52 16 60 16L148 16Q156 16 156 22L156 44Q156 56 144 56L64 56Q52 56 52 44Z',F('#fbfbf9'),'stroke="#c4c9cc" stroke-width=".6"')
    s+=path('M52 22Q52 16 60 16L148 16Q156 16 156 22L156 26L52 26Z',F('#eef0ef'))+louvers(60,17,88,8,3,'#b9bfc3',.6)
    s+=path('M58 47L150 47L146 55Q104 59 62 55Z',F('#d9dde0'),'stroke="#aab1b6" stroke-width=".5"')+line(62,51,146,51,'#8d969c',.7)
    s+=rect(124,33,22,9,'#1b2226',2)+txt(127.5,40.2,'72°',6.5,'#7fe3a1')+circ(118,37.5,1.2,'#5fd487')
    s+=''.join(path('M%s 60q-3 10 -8 20'%q,'none','stroke="#6fb4e8" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="3 3" opacity=".8"') for q in (78,100,122))
    # line set cover
    s+=path('M156 34L176 34L176 100',  'none','stroke="#e8e9e6" stroke-width="7" stroke-linejoin="round"')+path('M176 34L190 34L190 104','none','stroke="#f3f4f1" stroke-width="7" stroke-linejoin="round"')+path('M186.5 34L186.5 104','none','stroke="#c4c9cc" stroke-width=".6"')
    # outdoor unit
    s+=rect(184,152,128,6,F('#b2b6b6'),1)+shadow(250,160,66,3.5)
    x,y,w,h,d=196,84,96,66,20
    s+=pipe('M190 102L190 128L200 128',3.4,'#23292d')+pipe('M186 102L186 136L200 136',2,CU)
    s+=box(x,y,w,h,d,'#eceeec',3)
    s+=fan(x+38,y+34,27,None,3,'#454d53')
    s+=rect(x+72,y+6,19,h-12,F('#dfe2e0'),1.5,'stroke="#b8bec2" stroke-width=".5"')+louvers(x+74,y+10,15,26,7,'#9aa2a8',.7)+rect(x+75,y+44,13,8,F('#3b83c4'),1)
    s+=rect(x+6,y+h,10,4,'#4a5258')+rect(x+w-16,y+h,10,4,'#4a5258')
    s+=hexnut(x+w+6,y+40,5,4)+hexnut(x+w+6,y+50,4,3.4)
    return s
ART['mini-split']=a()

# ---------- 4 Carlyle 06D semi-hermetic compressor ----------
def a():
    s=bg('#e6eaed','#c2c9ce',150)
    c='#7c8891'
    s+=shadow(165,160,118,5)
    # feet
    s+=rect(60,146,36,7,F('#4b545a'),1)+rect(214,146,40,7,F('#4b545a'),1)+bolts([(68,149.5),(88,149.5),(224,149.5),(244,149.5)],1.6)
    # motor barrel
    s+=cylh(52,76,118,72,c,False)
    s+=ell(52,112,11.5,36,F(sh(c,.9)))+''.join(bolt(52+11*math.cos(t)*.72,112+36*math.sin(t)*.86,1.5) for t in [math.radians(q) for q in (100,140,180,220,260)])
    s+=rect(166,72,9,80,G(sh(c,.8),'h'),1)+bolts([(170.5,80),(170.5,96),(170.5,128),(170.5,144)],1.4)
    # crankcase
    s+=box(175,70,84,78,12,c,3)
    # bearing head end + oil pump
    s+=ell(262,112,7,26,F(sh(c,.7)))
    s+=circ(217,116,23,R(sh(c,1.1)))+circ(217,116,17,R(sh(c,.9)),'stroke="%s" stroke-width=".6"'%sh(c,.5))+''.join(bolt(217+20*math.cos(math.radians(q)),116+20*math.sin(math.radians(q)),1.5) for q in range(0,360,45))
    s+=circ(217,116,6,R('#30373c'))+rect(205,140,24,5,G(BR,'h'),1)
    # sight glass
    s+=circ(190,134,6.5,R(BR))+circ(190,134,4.3,R('#e9d9a0'))+path('M185.8 134.6h8.4a4.3 4.3 0 0 1 -8.4 0z','#c98f2a','opacity=".85"')
    # cylinder heads: left bank angled, top bank
    def head(tx,ty,rot):
        g='<g transform="translate(%s %s) rotate(%s)">'%(tx,ty,rot)
        g+=rect(-30,-9,60,9,F(sh(c,.72)),1)+rect(-33,-21,66,13,F(sh(c,1.08)),2.5)+rect(-33,-10,66,3,sh(c,.5))
        g+=line(-31,-20.4,31,-20.4,sh(c,1.7),.7)+bolts([(q,-14.5) for q in (-27,-14,0,14,27)],1.7)
        return g+'</g>'
    s+=head(217,70,0)
    s+=rect(181,74,72,16,F(sh(c,1.12)),2.5,'stroke="%s" stroke-width=".5"'%sh(c,.5))+bolts([(187+i*12,78) for i in range(6)]+[(187+i*12,86) for i in range(6)],1.3)
    # discharge + suction service valves
    s+=rect(121,52,16,24,G(c,'v'),2)+rect(116,48,26,6,G(sh(c,.8),'h'),1.5)+bolts([(120,51),(138,51)],1.2)
    s+=cylv(123,22,12,26,CU)+rect(137,58,14,6,G(BR,'h'),1)+rect(150,56,5,10,F('#23292d'),1.5)
    s+=cylv(250,10,9,30,CU)+rect(246,38,17,9,G(BR,'v'),1.5)+rect(262,40,10,5,G(BR,'h'),1)+rect(271,38,4,9,F('#23292d'),1.2)
    # terminal box
    s+=box(72,58,40,20,8,sh(c,.9),1.5)+bolts([(76,62),(108,62),(76,74),(108,74)],1.1)+rect(84,64,16,8,'#e2b93b',.8)+path('M92 65.2l3 5.4h-6z','#1d262c')
    # nameplate
    s+=rect(84,104,44,20,F('#d6dbde'),1)+txt(88,112,'06D',7,'#2a3136')+line(88,116,122,116,'#6d777d',.5)+line(88,120,112,120,'#6d777d',.5)+bolts([(86,106),(126,106),(86,122),(126,122)],.7)
    return s
ART['carlyle-06d']=a()

# ---------- 5 Heating: gas furnace ----------
def a():
    s=bg('#e8e6e1','#a9a39a',156)
    x,y,w,h,d=104,34,104,122,26
    s+=shadow(170,160,84,4.5)
    # flue
    s+=cylv(142,-6,20,32,GALV,False)+rect(140,8,24,3,G(sh(GALV,.8),'v'))+rect(140,22,24,5,G(sh(GALV,.85),'v'),1)
    s+=box(x,y,w,h,d,'#c3c9cc',2)
    # upper louvered door (burner compartment, door off -> show inside)
    s+=rect(x+5,y+6,w-10,58,F('#23282c'),1.5)
    # heat exchanger tubes back
    s+=''.join(rect(x+12+i*22,y+9,14,22,G('#5d666c','v'),4) for i in range(4))
    # inducer
    s+=circ(x+78,y+22,12,R('#3a4146'))+circ(x+78,y+22,7.5,R('#6f787e'))+circ(x+78,y+22,2.2,'#1b2023')+rect(x+84,y+8,10,7,F('#4c555b'),1)
    # manifold + burners + flames
    s+=rect(x+8,y+52,w-36,5,G('#3d454a','h'),1.5)
    for i in range(4):
        bx=x+19+i*22
        s+=rect(bx-4,y+44,8,9,G('#8d969c','v'),1)+flame(bx,y+44,8,15)
    # gas valve
    s+=box(x+76,y+44,18,14,3,'#6f787e',1.5)+rect(x+79,y+40,8,5,F('#2b6fd0'),1)+circ(x+90,y+51,1.6,'#e2b93b')
    # pressure switch + igniter wire
    s+=circ(x+16,y+36,5,R('#d8d2c0'))+path('M%s %sq8 6 20 2'%(x+20,y+38),'none','stroke="#c8372d" stroke-width=".9"')
    # lower door
    s+=rect(x+5,y+68,w-10,h-74,F('#cfd4d7'),1.5,'stroke="#9aa2a8" stroke-width=".5"')+louvers(x+14,y+76,w-28,16,5,'#7d868c',1)
    s+=rect(x+34,y+100,36,10,F('#e9ecee'),1)+line(x+38,y+104,x+62,y+104,'#7d868c',.6)+line(x+38,y+107,x+56,y+107,'#7d868c',.6)
    s+=circ(x+w-13,y+h-12,2,'#5fd487')+circ(x+w-13,y+h-12,3.4,'#5fd487','opacity=".3"')
    # gas pipe with shutoff and drip leg
    s+=pipe('M40 60L40 150',6,BLK)+pipe('M40 86L%s 86'%(x+2),6,BLK)+rect(36,146,8,8,F('#1d2225'),1)
    s+=rect(62,81,12,10,G(BR,'h'),1.5)+rect(58,74,22,5,F('#e2b93b'),2)+rect(66,78,4,4,'#8c6a1c')+rect(36,82,8,8,F('#3a4146'),1)
    # return duct + filter
    s+=box(x+w,y+78,22,44,26,'#aeb6bb',0)
    # thermostat
    s+=shadow(278,82,14,2,.2)+rect(262,54,32,24,F('#fbfbf9'),3,'stroke="#c4c9cc" stroke-width=".5"')+rect(267,59,22,10,'#20282c',1.5)+txt(270.5,66.8,'70°',6.5,'#ffb35a')+circ(272,73.5,1,'#9aa2a8')+circ(284,73.5,1,'#9aa2a8')
    return s
ART['heating']=a()

# ---------- 6 Boiler ----------
def a():
    s=bg('#e5e3de','#a59f96',156)
    x,y,w,h,d=96,62,92,94,34
    s+=shadow(160,160,84,4.5)
    # flue at back
    s+=cylv(168,-4,22,56,GALV,False)+rect(166,20,26,3,G(sh(GALV,.8),'v'))
    c='#2f6692'
    s+=box(x,y,w,h,d,c,2)
    s+=rect(x+3,y+3,w-6,h-6,'none',1.5,'stroke="%s" stroke-width=".6"'%sh(c,1.5))
    # burner door + sight
    s+=rect(x+18,y+56,56,30,F('#3a4146'),2)+bolts([(x+22,y+60),(x+70,y+60),(x+22,y+82),(x+70,y+82)],1.4)+circ(x+46,y+71,7,R('#1b2023'))+circ(x+46,y+71,4.5,R('#ff9d3c'))+circ(x+46,y+71,2,'#fff2c0')
    # tridicator gauge + aquastat
    s+=gauge(x+26,y+28,13,-60,'#f7f5ee','#b8902e')
    s+=box(x+52,y+14,28,24,4,'#9aa3a9',1.5)+rect(x+56,y+19,14,7,'#e9ecee',.8)+circ(x+74,y+31,2,R('#23292d'))+txt(x+57,y+24.6,'180',5,'#2a3136')
    s+=rect(x+34,y+44,26,7,F('#e9ecee'),.8)+line(x+37,y+47.5,x+56,y+47.5,'#59626880',.6)
    # supply riser with circulator, air sep, expansion tank
    s+=pipe('M%s %sL%s 20L318 20'%(x+20+d/2,y-d*.25+2,x+20+d/2),7,CU)
    px=x+20+d/2
    s+=flange(px-8,34,16,3)+flange(px-8,52,16,3)+circ(px,45,10,R('#c8372d'))+rect(px+6,39,16,12,G('#b32f26','h'),2)+rect(px+20,40,4,10,F('#23292d'),1)+circ(px,45,3.4,R('#e9ecee'))
    s+=pipe('M226 20L226 36',5,CU)+cylv(213,40,26,44,'#8d979e',False)+path('M213 40Q213 30 226 30Q239 30 239 40Z',G('#8d979e','v'))+path('M213 84Q213 94 226 94Q239 94 239 84Z',G('#8d979e','v'))+rect(217,54,18,12,'#e9ecee',.8)+line(220,58,232,58,'#59626880',.6)+line(220,62,229,62,'#59626880',.6)
    s+=rect(196,13,12,14,G('#8a6a2a','v'),2)+rect(199,6,6,8,G(BR,'v'),1)
    # relief valve + discharge pipe
    rx=x+w-4
    s+=rect(rx+10,y-22,9,12,G(BR,'v'),1)+rect(rx+7,y-28,15,7,G(BR,'h'),1.5)+rect(rx+19,y-26,9,3,F('#3a4146'),1)+pipe('M%s %sL%s %sL%s 148'%(rx+14,y-16,rx+44,y-16,rx+44),4,CU)
    # return + gas
    s+=pipe('M0 132L%s 132'%(x+2),7,CU)+hexnut(x-10,127,8,10)
    s+=pipe('M54 60L54 104L%s 104'%(x+2),5,BLK)+rect(48,84,12,9,G(BR,'v'),1.5)+rect(44,78,18,4.5,F('#e2b93b'),2)
    return s
ART['boiler-trainer']=a()

# ---------- 7 Airflow: duct, blower, manometer ----------
def a():
    s=bg('#e7ebee','#bcc4c9',154)
    # trunk duct
    x,y,w,h,d=24,30,236,34,20
    s+=box(x,y,w,h,d,GALV,0)
    s+=''.join(rect(x+q-1.5,y-1,3,h+2,G(sh(GALV,.9),'v'))+line(x+q+d-1,y-d*.5,x+q-1,y,sh(GALV,.7),.7) for q in (58,118,178))
    s+=''.join(line(x+q+8,y+6,x+q+48,y+h-6,sh(GALV,1.35),.6,'opacity=".8"')+line(x+q+48,y+6,x+q+8,y+h-6,sh(GALV,.8),.6,'opacity=".6"') for q in (0,60,120,180))
    # end register
    s+=path('M%s %sL%s %sL%s %sL%s %sZ'%(x+w+2,y+3,x+w+d-2,y-d*.5+5,x+w+d-2,y+h-d*.5-3,x+w+2,y+h-3),'#23292d')+''.join(line(x+w+3,y+7+i*5,x+w+d-3,y-d*.5+9+i*5,'#aab3b9',.9) for i in range(6))
    # blower housing
    s+=shadow(84,160,56,4.5)
    c='#8a949a'
    s+=rect(96,62,40,54,G(c,'v'))
    s+=path('M84 72A44 44 0 1 0 128 116L128 72Z',F(c),'stroke="%s" stroke-width=".8"'%sh(c,.5))+path('M84 72A44 44 0 1 0 128 116','none','stroke="%s" stroke-width="1.2" opacity=".8"'%sh(c,1.6))
    s+=circ(84,116,27,R('#1b2023'))
    s+=''.join('<path d="M%s %sL%s %s" stroke="#aab3b9" stroke-width="1.6" stroke-linecap="round"/>'%(n(84+17*math.cos(t)),n(116+17*math.sin(t)),n(84+26*math.cos(t+.35)),n(116+26*math.sin(t+.35))) for t in [math.radians(q) for q in range(0,360,15)])
    s+=circ(84,116,17,'none','stroke="#6f787e" stroke-width="1"')+circ(84,116,7,R('#59626a'))+circ(84,116,2.4,R('#c2c9ce'))
    s+=rect(52,156,64,4,F('#4b545a'),1)
    # round takeoff with damper to flex
    s+=cylv(186,60,24,16,GALV,False)+rect(184,62,28,3,G(sh(GALV,.8),'v'))+line(212,70,220,70,'#3a4146',1.6)+circ(221,70,2.2,R('#c8372d'))
    s+=''.join(ell(198,80+i*5.2,13,3.6,G('#c9ced2','v'),'stroke="#7d868c" stroke-width=".5"') for i in range(9))
    s+=rect(180,124,36,6,F('#f4f5f3'),1,'stroke="#b3babe" stroke-width=".5"')+louvers(183,125,30,4,2,'#8d969c',.6)
    # manometer
    s+=shadow(276,160,24,3.5)
    s+=pipe('M266 96C262 76 246 80 240 60',2,'#d94b3f')+pipe('M282 96C290 66 276 70 268 52',2,'#3f78d9')
    s+=rect(254,94,42,64,F('#e9b81f'),6)+rect(258,98,34,56,F('#2b3136'),4)+lcd(262,103,26,15,['0.50'],'#b9d48a','#1f2b16',8.5)
    s+=txt(266,124.5,'in. w.c.',4,'#aab3b9')+''.join(circ(266+i*9,134,2.6,R('#59626a')) for i in range(3))+''.join(circ(266+i*9,144,2.6,R('#59626a')) for i in range(3))
    s+=rect(262,90,8,6,G(BR,'v'),1)+rect(278,90,8,6,G(BR,'v'),1)
    return s
ART['airflow']=a()

# ---------- 8 Psychrometrics: sling psychrometer + hygrometer ----------
def a():
    s=bg('#e6ebee','#c3cacf',150)
    # chart paper on wall
    s+=rect(14,14,150,108,'#10161a',1,'opacity=".18" filter="url(#hcBlur)" transform="translate(3 4)"')+rect(14,14,150,108,F('#fbfaf5'),1.5)
    gx,gy,gw,gh=24,22,128,88
    s+=''.join(line(gx+gw*i/10,gy+gh,gx+gw*i/10,gy+gh-(gh*.08+gh*.9*(i/10)**2.2),'#c9cfd3',.4) for i in range(11))
    s+=''.join(line(gx+gw*(1-(1-i/8)**.45),gy+gh-gh*i/8*.98,gx+gw,gy+gh-gh*i/8*.98,'#c9cfd3',.4) for i in range(1,8))
    for k,rh in enumerate((1,.8,.6,.4,.2)):
        pts=' '.join('%s,%s'%(n(gx+gw*t/20),n(gy+gh-(gh*.08+gh*.9*(t/20)**2.2)*rh)) for t in range(21))
        s+='<polyline points="%s" fill="none" stroke="%s" stroke-width="%s"/>'%(pts,'#1d262c' if k==0 else '#5c9a6c',1.4 if k==0 else .6)
    s+=line(gx,gy+gh,gx+gw,gy+gh,'#1d262c',.9)+line(gx+gw,gy,gx+gw,gy+gh,'#1d262c',.9)
    px,py=gx+gw*.68,gy+gh-(gh*.08+gh*.9*.68**2.2)*.5
    s+=line(px,py,px,gy+gh,'#c8372d',.8,'stroke-dasharray="2.5 2"')+line(px,py,gx+gw,py,'#2463c8',.8,'stroke-dasharray="2.5 2"')+circ(px,py,2.6,R('#c8372d'))
    # dial hygrometer
    s+=gauge(250,52,34,-65,'#f7f5ee','#b8902e',False,'#3b83c4')+txt(236,68,'% RH',6,'#59636a')
    # sling psychrometer on bench
    s+=shadow(196,160,96,4)
    s+='<g transform="rotate(-9 190 140)">'
    s+=cylh(60,133,52,13,'#30373c')+''.join(line(66+i*5,134,66+i*5,146,'#14181b',.8,'opacity=".6"') for i in range(9))+circ(114,139.5,4.5,R('#aab3b9'))
    s+=rect(116,124,172,30,F('#d5dade'),3,'stroke="#8d969c" stroke-width=".6"')
    for j,(yy,col) in enumerate(((131,'#c8372d'),(145,'#c8372d'))):
        s+=rect(126,yy-2.6,140,5.2,'#fbfbf9',2.6,'stroke="#aab3b9" stroke-width=".4"')+line(132,yy,214-j*26,yy,col,1.6)+''.join(line(132+i*6,yy-2.6,132+i*6,yy-(1.2 if i%5 else .2),'#59626a',.35) for i in range(22))
        s+=circ(272,yy,4.2,R('#c8372d') if j==0 else R('#f1efe6'))
    s+=rect(266,140,16,10,F('#f4f1e6'),4,'stroke="#c9c2a8" stroke-width=".5"')+''.join(line(268+i*2.5,141,268+i*2.5,149,'#c9c2a8',.4) for i in range(6))
    s+=txt(120,131,'DRY',3.6,'#59636a','transform="rotate(-90 121 131)"')+txt(120,150,'WET',3.6,'#2463c8','transform="rotate(-90 121 150)"')
    s+='</g>'
    s+=path('M296 118q4 6 4 9a4 4 0 0 1 -8 0q0 -3 4 -9z',R('#58a8e8'))
    return s
ART['psychrometrics']=a()

# ---------- 9 Combustion: burner flame, flue, analyzer ----------
def a():
    s=bg('#e6e4df','#aaa49b',154)
    # burner box cutaway
    s+=shadow(92,160,84,4)
    s+=box(14,58,150,96,16,'#8d969c',2)+rect(22,66,134,80,F('#191d20'),2)
    # firing tube + inshot burner
    s+=path('M66 86L150 78L150 134L66 126Z',F('#3a3f43'))+path('M66 86L150 78','none','stroke="#7d868c" stroke-width=".8"')
    s+=ell(100,106,44,16,'#3d8bff','opacity=".28" filter="url(#hcGlow)"')
    s+=path('M60 97C84 84 118 92 142 106C118 120 84 128 60 115Z','#2f7df0','opacity=".88"')+path('M60 101C78 94 98 99 112 106C98 113 78 118 60 111Z','#bfe3ff')+path('M134 106q8 -3 14 0q-6 3 -14 0z','#ffb35a','opacity=".8"')
    s+=cylh(30,95,30,22,'#aab3b9')+''.join(line(36+i*5,97,36+i*5,115,'#59626a',.7) for i in range(5))+rect(24,102,8,8,G(BR,'h'),1)
    s+=pipe('M28 106L28 142L14 142',4.5,BLK)+hexnut(25,126,6,7,'#8d969c')
    # flue pipe with test hole and probe
    s+=cylv(196,-6,30,160,GALV,False)+rect(194,40,34,3,G(sh(GALV,.8),'v'))+rect(194,100,34,3,G(sh(GALV,.8),'v'))+line(204,-6,204,154,sh(GALV,.7),.5,'opacity=".6"')
    s+=circ(214,74,2.4,'#14181b')
    s+=line(216,74,256,90,'#c2c9ce',2.2)+line(216,73.4,256,89.4,'#f4f6f7',.6)+rect(254,86,16,8,F('#2b3136'),2,'transform="rotate(22 262 90)"')
    s+=pipe('M268 94C290 104 296 112 284 122',2.4,'#3a4146')
    # analyzer
    s+=shadow(276,162,30,3.5)
    s+=rect(250,104,52,56,F('#2f6fb8'),7)+rect(254,108,44,48,F('#22282c'),4)
    s+=lcd(258,112,36,24,['O2  6.1','CO   12','EFF 82%'],'#cfe3b0','#1f2b16',4.6)
    s+=''.join(rect(259+i*12,141,9,5,F('#59626a'),1.5) for i in range(3))+''.join(rect(259+i*12,149,9,5,F(c2),1.5) for i,c2 in enumerate(('#3fa565','#59626a','#c8372d')))
    return s
ART['combustion']=a()

# ---------- 10 Chiller and cooling tower ----------
def a():
    s=rect(0,0,320,180,F('#dfe9f1'))+rect(0,150,320,30,F('#b7bdc0'))+line(0,150,320,150,'#8d969c',.6)
    # tower (back right)
    s+=shadow(258,152,56,4,.22)
    x,y,w,h,d=214,44,72,104,28
    s+=box(x,y,w,h,d,'#c9cfd2',1)
    s+=rect(x+5,y+50,w-10,44,F('#343b40'),1)+''.join(path('M%s %sL%s %sL%s %sL%s %sZ'%(x+5,y+52+i*8.5,x+w-5,y+52+i*8.5,x+w-5,y+57+i*8.5,x+5,y+60+i*8.5),F('#aeb6bb')) for i in range(5))
    s+=rect(x,y+98,w,6,F('#3b83c4'),0,'opacity=".85"')+rect(x+8,y+12,w-16,24,F('#e9ecee'),1)+line(x+14,y+20,x+w-20,y+20,'#7d868c',.7)+line(x+14,y+27,x+w-30,y+27,'#7d868c',.7)
    cx,cy=x+w/2+d/2,y-d*.25
    s+=path('M%s %sL%s %sL%s %sL%s %sZ'%(cx-28,cy,cx-24,cy-20,cx+24,cy-20,cx+28,cy),G('#aeb6bb','v'))+ell(cx,cy,28,5,G('#aeb6bb','v'))+fan(cx,cy-20,24,4.6,4)
    s+=''.join(path('M%s %sq-5 -8 0 -15q5 -7 0 -14'%(cx-12+i*12,cy-26),'none','stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55" filter="url(#hcBlur)"') for i in range(3))
    # chiller
    s+=shadow(116,160,104,5)
    ce,cc='#5f7f9a','#6f8ea8'
    s+=rect(34,148,10,8,F('#3a4146'))+rect(168,148,10,8,F('#3a4146'))+rect(26,154,164,4,F('#2b3136'),1)
    # evaporator (bottom) and condenser (top)
    for yy,hh,cl in ((108,40,ce),(66,36,cc)):
        s+=cylh(30,yy,160,hh,cl,False)
        s+=rect(26,yy-2,7,hh+4,G(sh(cl,.75),'h'),1)+rect(186,yy-2,7,hh+4,G(sh(cl,.75),'h'),1)
        s+=cylh(12,yy+2,15,hh-4,sh(cl,.9),False)+ell(12,yy+hh/2,(hh-4)*.16,(hh-4)/2,F(sh(cl,.8)))
        s+=cylh(193,yy+2,12,hh-4,sh(cl,.9),True)
        s+=''.join(bolt(29.5,yy+3+i*(hh-6)/4,1) for i in range(5))+''.join(bolt(189.5,yy+3+i*(hh-6)/4,1) for i in range(5))
    s+=rect(84,118,52,18,F('#e9ecee'),1,'opacity=".92"')+txt(89,130.5,'EVAPORATOR',5.4,'#2a3136')+rect(84,76,52,16,F('#e9ecee'),1,'opacity=".92"')+txt(90,87.5,'CONDENSER',5.4,'#2a3136')
    # compressor + motor on top
    s+=cylh(86,34,62,28,'#4d6a84',False)+ell(86,48,4.5,14,F('#3d566c'))+cylh(146,31,10,34,'#3d566c',False)
    s+=circ(172,46,21,R('#56738d'))+circ(172,46,13,R('#3d566c'),'stroke="#2b3d4d" stroke-width=".6"')+''.join(bolt(172+17*math.cos(math.radians(q)),46+17*math.sin(math.radians(q)),1.2) for q in range(0,360,40))
    s+=path('M172 66L172 70L158 70L158 66',G('#56738d','v'))+pipe('M120 62L120 68',8,'#4d6a84')
    # control panel
    s+=box(38,26,34,40,6,'#d9dde0',2)+rect(42,30,26,16,'#16242e',1.5)+path('M44 42l4 -5l4 3l5 -7l5 4l4 -3','none','stroke="#5fd4ff" stroke-width=".9"')+circ(46,54,2.2,R('#3fa565'))+circ(54,54,2.2,R('#e2b93b'))+circ(62,54,2.2,R('#c8372d'))
    # water pipes
    s+=pipe('M12 78L-4 78',9,'#d9843d')+pipe('M12 92L-4 92',9,'#d9843d')+pipe('M205 120L208 120',9,'#3b83c4')+pipe('M205 136L208 136',9,'#3b83c4')
    s+=pipe('M205 84L214 84',8,'#d9843d')
    return s
ART['chiller']=a()

# ---------- 11 Heat exchanger: shell and tube with cutaway ----------
def a():
    s=bg('#e6eaed','#c0c7cc',152)
    s+=shadow(160,160,128,5)
    c='#3f7a8c'
    # saddles
    s+=''.join(path('M%s 132L%s 154L%s 154L%s 132Z'%(q,q-6,q+30,q+24),F('#4b545a'))+rect(q-10,152,44,4,F('#30373c'),1) for q in (84,206))
    # nozzles shell side (top in right, bottom out left)
    s+=cylv(222,34,18,30,c,False)+flange(216,28,30,6)+bolts([(220,31),(231,31),(242,31)],1)+pipe('M231 28L231 -4',12,'#d9543d')
    s+=cylv(86,128,18,22,c,False)+flange(80,148,30,6)
    # shell
    s+=cylh(60,58,200,76,c,False)
    # cutaway window showing tubes and baffles
    s+=path('M100 68Q150 60 204 70L210 122Q150 132 96 122Z','#14191c')
    s+=''.join(cylh(98,72+i*8.4,112,5,CU,False) for i in range(6))
    s+=''.join(rect(q,70 if k%2==0 else 86,3.5,38,F('#aab3b9')) for k,q in enumerate((118,146,174)))
    s+=path('M100 68Q150 60 204 70L210 122Q150 132 96 122Z','none','stroke="%s" stroke-width="2" stroke-linejoin="round"'%sh(c,1.5))+path('M100 68Q150 60 204 70L210 122Q150 132 96 122Z','none','stroke="%s" stroke-width=".6" transform="translate(.8 1)"'%sh(c,.4))
    # tubesheet flanges + channel head + rear head
    for q in (56,254):
        s+=rect(q,52,9,88,G('#7d868c','h'),1.5)+''.join(bolt(q+4.5,57+i*11.2,1.5) for i in range(8))
    s+=cylh(26,60,30,72,sh(c,.9),False)+path('M26 60Q8 96 26 132Z',G(sh(c,.9),'h'))+ell(26,96,9,36,G(sh(c,.9),'h'))
    s+=cylh(263,60,22,72,sh(c,.9),False)+path('M285 60Q306 96 285 132Z',G(sh(c,.9),'h'))
    # tube side nozzles on channel
    s+=cylv(32,40,14,22,sh(c,.9),False)+flange(27,35,24,5)+pipe('M39 35L39 -4',10,'#3b83c4')
    s+=cylv(32,130,14,16,sh(c,.9),False)+flange(27,144,24,5)+pipe('M39 149L39 176',10,'#7fb4e0')
    # nameplate
    s+=rect(218,92,30,16,F('#d6dbde'),1)+line(222,97,244,97,'#6d777d',.6)+line(222,101,240,101,'#6d777d',.6)+line(222,105,236,105,'#6d777d',.6)
    return s
ART['hx']=a()

# ---------- 12 Controls: pneumatic thermostat, valve actuator, DDC controller ----------
def a():
    s=bg('#e8e9e4','#bdbfb8',156)
    # pipe run with 3-way valve
    s+=pipe('M96 132L236 132',13,'#c8553d')+pipe('M166 138L166 180',13,'#3b83c4')
    s+=flange(118,121,5,22,'#8d969c')+flange(209,121,5,22,'#8d969c')+flange(155,160,22,5,'#8d969c')
    s+=path('M124 122L208 122L208 142L182 142L178 158L154 158L150 142L124 142Z',G(BR,'h'),'stroke="#6a4a12" stroke-width=".6"')+rect(156,112,20,11,G(BR,'v'),1.5)
    # yoke + stem + actuator
    s+=rect(163.5,78,5,36,G('#c2c9ce','v'))+path('M148 112L152 80L158 80L156 112Z',F('#3a4146'))+path('M184 112L180 80L174 80L176 112Z',F('#3a4146'))
    s+=rect(159,92,14,4,F('#e2b93b'),1)
    s+=shadow(166,84,34,3,.2)
    s+=path('M130 70Q130 40 166 38Q202 40 202 70Z',R('#4f6f8e'))+rect(126,68,80,9,G('#3f5a74','h'),3)+bolts([(132+i*11.4,72.5) for i in range(7)],1.3)+path('M136 78Q166 90 196 78Z',F('#3a4f64'))
    s+=rect(160,30,12,9,G(BR,'v'),1.5)
    # air tubing from thermostat to actuator
    s+=path('M56 74C56 20 150 6 166 30','none','stroke="#1d2226" stroke-width="2.6" stroke-linecap="round"')+path('M56 74C56 20 150 6 166 30','none','stroke="#59626a" stroke-width=".7" transform="translate(-.6 -.7)"')
    # pneumatic thermostat
    s+=shadow(58,128,26,2.5,.2)
    s+=rect(32,72,50,54,F('#ece6d6'),5,'stroke="#b9b29c" stroke-width=".6"')+rect(37,77,40,22,F('#f8f5ea'),2,'stroke="#c9c2a8" stroke-width=".4"')
    s+=''.join(line(41+i*4,80,41+i*4,84 if i%2 else 86,'#59626a',.5) for i in range(9))+txt(40,95,'55 65 75 85',3.6,'#59636a')+path('M57 79l2.4 -4h-4.8z','#c8372d')
    s+=rect(37,104,40,16,F('#f8f5ea'),2,'stroke="#c9c2a8" stroke-width=".4"')+line(42,112,72,112,'#c8372d',1.4)+''.join(line(42+i*5,109,42+i*5,115,'#59626a',.4) for i in range(7))
    # branch pressure gauge
    s+=gauge(98,50,13,-100,'#f7f5ee','#2d3439')+rect(95,62,6,5,G(BR,'v'),1)
    # DDC controller
    s+=shadow(268,112,40,3,.22)
    s+=box(232,38,70,68,7,'#2f363b',3)
    s+=rect(236,42,62,9,F('#3fa565'),1)+''.join(rect(238+i*6,43.5,4,6,'#1f5f38',.6)+circ(240+i*6,46.5,1,'#c9d0d4') for i in range(10))
    s+=rect(236,93,62,9,F('#3fa565'),1)+''.join(rect(238+i*6,94.5,4,6,'#1f5f38',.6)+circ(240+i*6,97.5,1,'#c9d0d4') for i in range(10))
    s+=lcd(242,58,34,18,['SP 72.0','VLV 45%'],'#9fd0e6','#12303d',4.4)+''.join(circ(284,60+i*6,1.7,R(c2)) for i,c2 in enumerate(('#5fd487','#5fd487','#e2b93b')))
    s+=rect(242,81,20,6,F('#59626a'),1)+rect(266,81,10,6,F('#59626a'),1)
    s+=path('M246 102C246 122 214 108 196 120','none','stroke="#c8372d" stroke-width="1.3"')+path('M252 102C252 130 220 114 200 126','none','stroke="#1d2226" stroke-width="1.3"')
    return s
ART['controls']=a()

# ---------- 13 Wiring board: contactor, capacitor, transformer, meter ----------
def a():
    s=rect(0,0,320,180,F('#d9c9a8'))
    s+=''.join(circ(10+i*20,10+j*20,1.5,'#8a7650','opacity=".7"') for i in range(16) for j in range(9))
    # wires
    def wire(d,c):return path(d,'none','stroke="#00000030" stroke-width="3.4" stroke-linecap="round" transform="translate(1 2)"')+path(d,'none','stroke="%s" stroke-width="2.6" stroke-linecap="round"'%c)+path(d,'none','stroke="#ffffff70" stroke-width=".6" stroke-linecap="round" transform="translate(-.4 -.6)"')
    s+=wire('M60 34C60 10 150 6 150 30','#1d2226')+wire('M78 34C78 16 172 12 172 30','#c8372d')
    s+=wire('M150 100C150 130 96 110 96 132','#e2b93b')+wire('M172 100C176 140 232 104 236 76','#7a4bc0')+wire('M118 150C140 170 210 172 252 150','#2f6fd0')
    # contactor
    s+=shadow(162,106,40,3.5)
    s+=box(128,30,66,70,8,'#23282c',3)
    s+=rect(132,34,58,12,F('#3a4146'),1)+rect(132,84,58,12,F('#3a4146'),1)
    for i in range(3):
        for yy in (40,90):s+=circ(143+i*18,yy,4.2,R('#c2c9ce'))+line(140.4+i*18,yy,145.6+i*18,yy,'#3a4146',1.1)
    s+=rect(140,52,42,26,F('#e9ecee'),2)+rect(150,58,22,14,F('#2b3136'),1.5)+txt(152,68,'24V',6,'#e9ecee')
    s+=rect(124,58,5,14,G(BR,'v'),1)+rect(193,58,5,14,G(BR,'v'),1)
    # transformer
    s+=shadow(66,70,34,3)
    s+=rect(36,34,60,8,F('#4b545a'),1)+rect(36,62,60,8,F('#4b545a'),1)+''.join(line(36,35.5+i*1.6,96,35.5+i*1.6,'#23292d',.4) for i in range(5))+''.join(line(36,63.5+i*1.6,96,63.5+i*1.6,'#23292d',.4) for i in range(5))
    s+=rect(46,38,40,28,G(CU,'h'),3)+''.join(line(48+i*2.6,39,48+i*2.6,65,'#7a3d1c',.5,'opacity=".7"') for i in range(15))+rect(54,45,24,12,F('#f4e9a8'),1)+txt(56.5,54,'40VA',5,'#2a3136')
    s+=bolts([(40,38),(92,38),(40,66),(92,66)],1.4)
    # run capacitor
    s+=shadow(248,84,24,3)
    s+=cylv(228,32,40,48,'#c2c9ce',False)+ell(248,32,20,6.4,F('#dfe4e7'),'stroke="#8d969c" stroke-width=".5"')
    s+=''.join(rect(q,22,5,10,G(BR,'v'),.8) for q in (236,246,256))+txt(233,56,'45/5',6.5,'#2a3136')+txt(236,66,'µF',6,'#2a3136')
    # multimeter
    s+=shadow(76,166,40,3)
    s+=rect(40,96,72,76,F('#e9b81f'),8)+rect(45,101,62,66,F('#2b3136'),5)+lcd(50,105,52,18,['24.6 V'],'#c7d6b0','#1f2b16',9)
    s+=circ(76,146,15,R('#3a4146'))+circ(76,146,11,R('#1d2226'))+line(76,146,83,137,'#f4f6f7',2)+''.join(circ(76+19*math.cos(math.radians(q)),146+19*math.sin(math.radians(q)),.9,'#e9ecee') for q in range(-180,1,30))
    s+=circ(54,162,2.6,'#c8372d')+circ(98,162,2.6,'#14181b')
    # compressor terminals C S R
    s+=shadow(276,146,30,3)+circ(276,138,26,R('#23282c'))+circ(276,138,17,R('#d9c8a0'))+''.join(circ(px,py,3.4,R(BR))+txt(px-1.8,py+9,t,4.6,'#2a3136') for px,py,t in ((276,129,'C'),(268,141,'S'),(284,141,'R')))
    return s
ART['wiring']=a()

# ---------- 14 Ladder: schematic sheet with start/stop station and relay ----------
def a():
    s=bg('#e6e9ea','#b8a383',150)
    # schematic sheet pinned on wall
    s+=rect(18,12,176,124,'#10161a',1,'opacity=".2" filter="url(#hcBlur)" transform="translate(3 4)"')+rect(18,12,176,124,F('#fbfaf5'),1.5)
    L1,L2=34,178
    s+=line(L1,22,L1,128,'#c8372d',1.8)+line(L2,22,L2,128,'#1d262c',1.8)+txt(30,20,'L1',5,'#c8372d')+txt(174,20,'N',5,'#1d262c')
    def rung(y,parts):
        g=line(L1,y,L2,y,'#1d262c',1)
        for kind,x in parts:
            g+=rect(x-7,y-7,14,14,'#fbfaf5')
            if kind=='no':g+=line(x-7,y,x-3,y,'#1d262c',1)+line(x+3,y,x+7,y,'#1d262c',1)+line(x-3,y-6,x-3,y+6,'#1d262c',1.3)+line(x+3,y-6,x+3,y+6,'#1d262c',1.3)
            if kind=='nc':g+=line(x-7,y,x-3,y,'#1d262c',1)+line(x+3,y,x+7,y,'#1d262c',1)+line(x-3,y-6,x-3,y+6,'#1d262c',1.3)+line(x+3,y-6,x+3,y+6,'#1d262c',1.3)+line(x-6,y+6,x+6,y-6,'#1d262c',1)
            if kind=='coil':g+=circ(x,y,7,'#fbfaf5','stroke="#1d262c" stroke-width="1.3"')+txt(x-3.6,y+2.2,'M',6,'#1d262c')
            if kind=='lamp':g+=circ(x,y,7,'#ffd9a0','stroke="#1d262c" stroke-width="1.3"')+line(x-5,y-5,x+5,y+5,'#1d262c',.9)+line(x-5,y+5,x+5,y-5,'#1d262c',.9)
            if kind=='stop':g+=line(x-7,y,x-4,y,'#1d262c',1)+line(x+4,y,x+7,y,'#1d262c',1)+circ(x-4,y,1.4,'#1d262c')+circ(x+4,y,1.4,'#1d262c')+line(x-6,y+2.6,x+6,y+2.6,'#c8372d',1.3)+line(x,y+2.6,x,y+8,'#c8372d',1.1)
            if kind=='start':g+=line(x-7,y,x-4,y,'#1d262c',1)+line(x+4,y,x+7,y,'#1d262c',1)+circ(x-4,y,1.4,'#1d262c')+circ(x+4,y,1.4,'#1d262c')+line(x-6,y-4,x+6,y-4,'#2e8b57',1.3)+line(x,y-4,x,y-9,'#2e8b57',1.1)
        return g
    s+=rung(42,[('stop',58),('start',88),('nc',122),('coil',156)])
    s+=path('M74 42L74 62L102 62L102 42','none','stroke="#1d262c" stroke-width="1"')+rect(81,55,14,14,'#fbfaf5')+line(74,62,85,62,'#1d262c',1)+line(91,62,102,62,'#1d262c',1)+line(85,56,85,68,'#1d262c',1.3)+line(91,56,91,68,'#1d262c',1.3)
    s+=rung(88,[('no',70),('lamp',156)])+rung(116,[('no',70),('nc',104),('coil',156)])
    s+=''.join(txt(22,y+2,t,4.6,'#8b959b') for y,t in ((42,'1'),(88,'2'),(116,'3')))
    # start/stop station
    s+=shadow(250,104,36,3.5)
    s+=box(218,18,60,84,10,'#e2b21c',4)+bolts([(223,23),(273,23),(223,97),(273,97)],1.3)
    for yy,c2,t in ((42,'#2e9a57','START'),(78,'#c8372d','STOP')):
        s+=circ(248,yy,14,R('#c2c9ce'))+circ(248,yy,10.5,R(c2))+ell(245,yy-4,5,2.6,'#fff','opacity=".35"')+rect(232,yy+15,32,6,'#1d2226',1)+txt(236 if t=='START' else 239,yy+19.8,t,4.4,'#f4f6f7')
    # ice cube relay
    s+=shadow(250,166,34,3)
    s+=rect(222,150,56,12,F('#2b3136'),2)+''.join(circ(229+i*8.4,156,1.8,R('#c2c9ce')) for i in range(6))
    s+=rect(228,112,44,40,'#bfd6e6',2,'opacity=".55" stroke="#8fb0c8" stroke-width=".7"')+rect(236,128,14,20,G(CU,'v'),2)+rect(254,120,3,28,F('#aab3b9'))+rect(260,120,3,28,F('#aab3b9'))+rect(234,116,32,5,F('#59626a'),1)+path('M230 114L236 114L231 122Z','#fff','opacity=".6"')
    return s
ART['ladder']=a()

# ---------- 15 3-phase motor control: disconnect, starter, motor ----------
def a():
    s=bg('#e5e8ea','#b9c0c4',150)
    # conduit
    s+=pipe('M58 96L58 128L112 128',6,'#aab3b9')+pipe('M88 60L112 60',6,'#aab3b9')
    # disconnect
    s+=shadow(58,100,34,3,.22)
    s+=box(26,22,62,74,9,'#8d979e',2)+rect(31,27,52,64,'none',1.5,'stroke="#6b757c" stroke-width=".7"')
    s+=rect(38,34,38,16,F('#f4e9a8'),1)+path('M57 36.5l5 9h-10z','#1d262c')+path('M57.2 39.5l-1.6 3h2l-1.6 3','none','stroke="#f4e9a8" stroke-width=".7"')
    s+=rect(88,40,7,26,F('#4b545a'),1)+rect(93,28,9,22,F('#c8372d'),3)+circ(97.5,31,2.6,R('#e0463a'))
    s+=txt(42,64,'ON',6,'#f4f6f7')+txt(40,80,'OFF',6,'#30373c')+circ(57,84,3,R('#23292d'))
    # starter enclosure open
    s+=shadow(160,136,48,3.5,.22)
    s+=box(112,18,92,114,9,'#aeb6bb',2)+rect(118,24,80,102,F('#d9dde0'),1.5)
    # contactor
    s+=rect(130,30,56,44,F('#23282c'),3)+rect(133,33,50,9,F('#3a4146'),1)+rect(133,63,50,8,F('#3a4146'),1)
    cols=('#6b4a2b','#d9843d','#e2c53b')
    for i in range(3):
        s+=circ(143+i*15,37.5,3.2,R('#c2c9ce'))+circ(143+i*15,67,3.2,R('#c2c9ce'))
        s+=path('M%s 24L%s 34'%(143+i*15,143+i*15),'none','stroke="%s" stroke-width="2.8" stroke-linecap="round"'%cols[i])
    s+=rect(144,46,28,13,F('#e9ecee'),1.5)+txt(149,55.5,'M',8,'#2a3136')+rect(164,49,5,7,F('#2f6fd0'),1)
    # overload relay
    s+=rect(132,78,52,30,F('#d5d0c2'),2,'stroke="#9a9484" stroke-width=".6"')+''.join(path('M%s 70L%s 80'%(143+i*15,143+i*15),'none','stroke="#aab3b9" stroke-width="2.4"') for i in range(3))
    s+=circ(146,92,6,R('#3a4146'))+line(146,92,150,88,'#f4f6f7',1.4)+rect(160,86,9,6,F('#c8372d'),1)+rect(172,86,9,6,F('#2f6fd0'),1)+txt(158,102,'O/L',4.6,'#59636a')
    for i in range(3):
        s+=path('M%s 108C%s %s %s %s %s 120'%(143+i*15,143+i*15,132+i*4,236,96+i*6,246+i*5),'none','stroke="%s" stroke-width="2.8" stroke-linecap="round"'%cols[i])
    # motor
    s+=motor(226,104,76,46,'#2f5f95',True,'r')
    return s
ART['threephase']=a()

# ---------- 16 Motors + VFD ----------
def a():
    s=bg('#e4e8ea','#b5bcc0',152)
    # VFD on wall
    s+=shadow(74,150,48,3.5,.22)
    x,y,w,h=34,12,76,132
    s+=box(x,y,w,h,12,'#3a4248',4)
    s+=rect(x+5,y+5,w-10,16,F('#23292d'),2)+louvers(x+9,y+7,w-18,12,4,'#6f787e',1.2)
    s+=rect(x+5,y+h-22,w-10,17,F('#23292d'),2)+louvers(x+9,y+h-20,w-18,13,4,'#6f787e',1.2)
    # keypad
    s+=rect(x+10,y+28,w-20,66,F('#d9dde0'),3)+lcd(x+15,y+33,w-30,22,['60.0 Hz','12.4 A'],'#9fd0e6','#12303d',6.2)
    s+=circ(x+24,y+68,6,R('#2e9a57'))+circ(x+w-24,y+68,6,R('#c8372d'))+circ(x+w/2,y+70,7.5,R('#59626a'))+circ(x+w/2,y+70,4.5,R('#23292d'))+line(x+w/2,y+70,x+w/2+3,y+66,'#f4f6f7',1.2)
    s+=''.join(rect(x+14+i*13,y+82,9,6,F('#59626a'),1.5) for i in range(4))
    s+=rect(x+12,y+98,w-24,8,F('#e2b93b'),1)+path('M%s %sl3.4 6h-6.8z'%(x+18,y+99),'#1d262c')+line(x+26,y+102,x+w-16,y+102,'#1d262c',.7)
    s+=circ(x+16,y+110,1.6,'#5fd487')+circ(x+23,y+110,1.6,'#3a4146')
    # cables
    s+=pipe('M%s %sL%s 180'%(x+22,y+h,x+22),6,'#23292d')+pipe('M%s %sC%s 176 150 170 176 140'%(x+56,y+h,x+56),6.5,'#e0802e')
    # motor + coupling + fan/pump load
    s+=motor(170,96,86,50,'#6f7a82',True,'r')
    s+=rect(268,112,8,20,G('#c8372d','h'),1.5)
    s+=circ(298,122,24,R('#3f6f9a'))+circ(298,122,16,R('#2f5678'),'stroke="#1f3a52" stroke-width=".6"')+''.join(bolt(298+20*math.cos(math.radians(q)),122+20*math.sin(math.radians(q)),1.2) for q in range(20,360,45))+rect(290,88,16,14,G('#3f6f9a','v'),1)+flange(286,84,24,5)
    # PWM waveform card
    s+=rect(176,22,112,48,'#10161a',2,'opacity=".2" filter="url(#hcBlur)" transform="translate(2 3)"')+rect(176,22,112,48,F('#172026'),3)+''.join(line(176+i*14,22,176+i*14,70,'#2b3a44',.4) for i in range(1,8))+line(176,46,288,46,'#2b3a44',.5)
    d='M180 46';xx=180
    import math as m
    for i in range(36):
        v=m.sin(i/36*2*m.pi);wd=3*(.25+.75*abs(v));up=46-16*(1 if v>=0 else -1)
        d+='L%s 46L%s %sL%s %sL%s 46'%(n(xx+(3-wd)/2),n(xx+(3-wd)/2),n(up),n(xx+(3+wd)/2),n(up),n(xx+(3+wd)/2));xx+=3
    s+=path(d,'none','stroke="#e2b93b" stroke-width=".7" opacity=".9"')
    s+='<polyline points="%s" fill="none" stroke="#5fd4ff" stroke-width="1.5"/>'%' '.join('%s,%s'%(n(180+i*3),n(46-13*m.sin((i-2)/36*2*m.pi))) for i in range(37))
    return s
ART['motors']=a()

ORDER=['refrigeration','ph-chart','mini-split','carlyle-06d','heating','boiler-trainer','airflow','psychrometrics','combustion','chiller','hx','controls','wiring','ladder','threephase','motors']
DEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+''.join(defs.values())+'</defs></svg>'
def svg(k):return '<svg class="art" viewBox="0 0 320 180" aria-hidden="true">'+ART[k]+'</svg>'
if __name__=='__main__':
    import sys
    out=sys.argv[1] if len(sys.argv)>1 else '/tmp/claude-0/s/art.html'
    h='<meta charset="utf-8"><style>body{margin:8px;background:#fff;display:grid;grid-template-columns:repeat(4,480px);gap:8px;font:12px sans-serif}svg.art{width:480px;height:270px;display:block;background:#eef1f3}</style>'+DEFS
    h+=''.join('<div>%s%s</div>'%(svg(k),k) for k in ORDER)
    open(out,'w').write(h);print(len(h))
