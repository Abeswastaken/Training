/* ============ Mini-split lesson helpers (on top of MS and RF) ============ */
const MSK={};
MSK.ZONES=["A","B","C","D"];
/* a steady snapshot at a fixed compressor speed */
MSK.at=o=>{const S=MS.init(o);S.fault=o.fault||"none";S.charge=o.charge??(S.fault==="low"?0.7:S.fault==="over"?1.25:1);
 S.Hz=o.Hz??50;S.on=S.on.map((_,i)=>o.on?!!o.on[i]:i<S.heads);if(o.tin!=null)S.tin=S.tin.map(()=>o.tin);if(o.sp!=null)S.sp=S.sp.map(()=>o.sp);
 if(o.frost)S.frost=o.frost;if(o.defrost)S.defrost=o.defrost;if(o.code)S.code=o.code;const R=MS.solve(S);S.R=R;return {S,R}};
MSK.cap=(S,R)=>R.off?0:S.mode==="heat"&&!S.defrost?R.Q+R.W:R.Q;
MSK.maxHz=o=>o.hyper?130:100;
/* find the speed that meets a load (Btu/h); returns {S,R,short} */
MSK.match=(o,load)=>{let lo=10,hi=MSK.maxHz(o),best=null;const top=MSK.at({...o,Hz:hi});if(MSK.cap(top.S,top.R)<=load)return {...top,short:true};
 const bot=MSK.at({...o,Hz:lo});if(MSK.cap(bot.S,bot.R)>=load)return {...bot,cycles:true};
 for(let k=0;k<12;k++){const m=(lo+hi)/2;best=MSK.at({...o,Hz:m});if(MSK.cap(best.S,best.R)<load)lo=m;else hi=m}return best};
MSK.eer=(S,R)=>R.off?0:MSK.cap(S,R)/R.watts;
MSK.port=(S,R)=>S.mode==="heat"&&!S.defrost?R.Pd:R.Ps;
MSK.reads=(S,R,more=[])=>{const cool=S.mode!=="heat";return [["Compressor",R.off?"off":K.f0(S.Hz)+" Hz"],[cool?"Capacity":"Heating capacity",K.f0(MSK.cap(S,R)/100)*100+" Btu/h"],["Power",K.f0(R.watts)+" W"],
 [cool?"EER":"COP",R.off?"--":cool?K.f1(MSK.eer(S,R)):K.f2(MSK.eer(S,R)/3.412)],["Gas line port",K.f0(MSK.port(S,R)-14.7)+" psig"],["Superheat",cool&&!R.off?K.f0(R.sh)+"°F":"--"],["Subcooling",R.off?"--":K.f0(R.sc)+"°F"],["EEV",R.off?"closed":K.f0(R.steps)+" steps"],...more]};
/* 10k NTC thermistor (B = 3950), the common type on mini-split boards */
MSK.ntc=F=>{const Tk=(F-32)*5/9+273.15;return 10000*Math.exp(3950*(1/Tk-1/298.15))};
MSK.ohm=v=>v>=1000?K.f1(v/1000)+" kΩ":K.f0(v)+" Ω";
/* scene sized for a lesson drawing */
MSK.scene=(S,R,therm)=>MS.scene(S,R,{therm});
MSK.VB="0 0 900 520";
/* small labelled box for block diagrams */
MSK.box=(x,y,w,h,t,sub,col)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--paper)" stroke="${col||"var(--ink)"}" stroke-width="2.5"/>`+K.lbl(x+w/2,y+h/2+(sub?-4:6),t,{size:16,fill:col})+(sub?K.txt(x+w/2,y+h/2+18,sub):"");
