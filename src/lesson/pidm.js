/* ============ PID zone model for the PID lesson (same plant as the Controls trainer's PID Tuning tab) ============
 Valve -> 45 s transport delay -> coil (60 s lag) -> room (20 min time constant) -> wall sensor (60 s lag).
 Full valve adds 60°F over outdoor air at steady state; the actuator strokes in 90 s. One step = 1 s. */
const PIDP={tau:1200,G:60,dead:45,coilT:60,sensT:60,stroke:90};
const PMODES=["onoff","p","pi","pid"],PMODEN={onoff:"On/off",p:"P only",pi:"PI",pid:"PID"};
function pidZone(c,T0){const v=Math.max(0,Math.min(1,(T0-c.oat)/PIDP.G));
 return {t:0,T:T0,s:T0,meas:T0,coil:v,v,buf:Array(PIDP.dead).fill(v),I:c.mode==="pi"||c.mode==="pid"?v*100-50:0,prev:T0,u:v*100,on:v>0.5?1:0,sp:T0,door:0,hist:[],rnd:7}}
function pidStep(z,c){const e=z.sp-z.meas,Kc=100/c.pb;let d=0;
 if(c.mode==="onoff"){if(z.meas<z.sp-c.diff/2)z.on=1;else if(z.meas>z.sp+c.diff/2)z.on=0;z.u=z.on*100}
 else{if(c.mode==="pid")d=-Kc*c.td*60*(z.meas-z.prev);
  if(c.mode!=="p"){const ni=z.I+Kc*e/(c.ti*60),ut=50+Kc*e+ni+d;if(ut<=100&&ut>=0)z.I=ni}else z.I=0;
  z.u=Math.max(0,Math.min(100,50+Kc*e+z.I+d))}
 z.prev=z.meas;
 z.v+=Math.max(-1/PIDP.stroke,Math.min(1/PIDP.stroke,z.u/100-z.v));z.buf.push(z.v);const vd=z.buf.shift();
 z.coil+=(vd-z.coil)/PIDP.coilT;const loss=z.door?25:0;z.T+=((c.oat+PIDP.G*z.coil-loss)-z.T)/PIDP.tau;z.s+=(z.T-z.s)/PIDP.sensT;
 if(c.noise){z.rnd=(z.rnd*16807)%2147483647;z.meas=Math.round((z.s+(z.rnd/2147483647-0.5)*0.3)*10)/10}else z.meas=z.s;z.t++;
 if(z.t%20===0)z.hist.push([z.t/60,z.meas,z.sp,z.u,z.door,z.T])}
/* the commissioning test: 68°F steady, setpoint to 72 at minute 5, door open minutes 35-40, ends at minute 70 */
const PID_DEF={mode:"pi",pb:6,ti:10,td:0,diff:1,oat:30,noise:false};
function pidRun(c0,o={}){const c={...PID_DEF,...c0};const end=(o.end||70)*60,door=o.door!==false;const z=pidZone(c,68);
 while(z.t<end){if(z.t===5*60)z.sp=72;z.door=door&&z.t>=35*60&&z.t<40*60?1:0;pidStep(z,c)}
 const H=z.hist;let os=0,ok1=true,ok2=true,chat=0;
 for(const [m,s,sp] of H){if(m>5&&m<35)os=Math.max(os,s-sp);if(m>=20&&m<35&&Math.abs(s-sp)>1)ok1=false;if(door&&m>=50&&Math.abs(s-sp)>1)ok2=false}
 for(let i=2;i<H.length;i++)chat+=Math.abs(H[i][3]-H[i-1][3]);
 const tail=H.filter(r=>r[0]>=(door?60:o.end-10)&&r[0]<(door?70:o.end)).map(r=>r[1]);const mean=tail.reduce((a,b)=>a+b,0)/Math.max(1,tail.length);
 const pre=H.filter(r=>r[0]>=25&&r[0]<35).map(r=>r[1]);
 return {c,H,os:Math.max(0,os),ok1,ok2,pp:Math.max(...tail)-Math.min(...tail),ppPre:Math.max(...pre)-Math.min(...pre),end:mean-72,valveTravel:chat/(H.length/3)}}
