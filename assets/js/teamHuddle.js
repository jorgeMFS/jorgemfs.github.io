(function(){
const anchor=document.querySelector('[data-team-huddle]');
if(!anchor)return;
const wrap=document.createElement('div');wrap.className='hd-wrap';wrap.setAttribute('aria-hidden','true');anchor.after(wrap);
if(matchMedia('(prefers-reduced-motion: reduce)').matches){wrap.dataset.still='1';}
const NS='http://www.w3.org/2000/svg';
const svg=document.createElementNS(NS,'svg');wrap.appendChild(svg);
const mk=(tag,attrs,parent=svg)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);parent.appendChild(e);return e;};
function bleed(){wrap.style.marginRight='0px';const r=wrap.getBoundingClientRect();wrap.style.marginRight=-(document.documentElement.clientWidth-r.right)+'px';}
bleed();addEventListener('resize',bleed);
const G=100;
mk('line',{class:'trk',x1:0,y1:G+1,x2:2000,y2:G+1});
const cnt=mk('text',{class:'cnt',x:0,y:22,opacity:0});
const CX=110;
const defs=[{x:CX-15,dir:1,back:true},{x:CX+15,dir:-1,back:true},{x:CX-28,dir:1,back:false},{x:CX+28,dir:-1,back:false}];
const F=defs.map(d=>{const g=mk('g',{opacity:d.back?.45:1});return{...d,home:d.x,g,
  legs:[mk('polyline',{class:'lim'},g),mk('polyline',{class:'lim'},g)],
  body:mk('line',{class:'lim'},g),
  arms:[mk('polyline',{class:'lim'},g),mk('polyline',{class:'lim'},g)],
  head:mk('circle',{class:'hd',r:5.4},g),y:0,phase:Math.random()*6,v:0};});
let mode='huddle',handDip=0,busy=false;
const S=Math.sin,C=Math.cos;
const pt=a=>a.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
function draw(){
  for(const f of F){
    const d=f.dir,lift=f.y;
    const lean=mode==='huddle'?.26:mode==='run'?.22:0;
    const hip=[f.x,G-23-lift];
    const sh=[hip[0]+18*S(lean)*d,hip[1]-18*C(lean)];
    const hd=[hip[0]+25*S(lean)*d,hip[1]-25*C(lean)];
    f.body.setAttribute('x1',hip[0]);f.body.setAttribute('y1',hip[1]);
    f.body.setAttribute('x2',sh[0]);f.body.setAttribute('y2',sh[1]);
    f.head.setAttribute('cx',hd[0]);f.head.setAttribute('cy',hd[1]);
    for(let k=0;k<2;k++){
      const a=mode==='run'?S(f.phase+k*Math.PI)*.75:(k?.16:-.16);
      const knee=[hip[0]+11.5*S(a)*d+(mode==='run'?2.5*d:0),hip[1]+11.5*C(a)];
      const back=mode==='run'?Math.max(0,-S(f.phase+k*Math.PI))*.9:0;
      const foot=[knee[0]+11.5*S(a-back)*d,knee[1]+11.5*C(a-back)];
      f.legs[k].setAttribute('points',pt([hip,knee,foot]));
    }
    for(let k=0;k<2;k++){
      let hand,elbow;
      if(mode==='huddle'&&k===0){
        hand=[CX-2*d,G-40+handDip+(f.back?-3:0)];
        elbow=[(sh[0]+hand[0])/2,(sh[1]+hand[1])/2+4];
      }else if(mode==='go'||mode==='win'){
        const s=k?1:-1;elbow=[sh[0]+5*s,sh[1]-9];hand=[sh[0]+8*s,sh[1]-18];
      }else if(mode==='run'){
        const a=-S(f.phase+k*Math.PI)*.9;
        elbow=[sh[0]+7*S(a)*d,sh[1]+7*C(a)];hand=[elbow[0]+7*S(a+.9)*d,elbow[1]+7*C(a+.9)-3];
      }else{elbow=[sh[0]+d,sh[1]+8];hand=[sh[0]+3*d,sh[1]+16];}
      f.arms[k].setAttribute('points',pt([sh,elbow,hand]));
    }
  }
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function dip(){const s=performance.now();(function anim(n){const u=Math.min(1,(n-s)/360);handDip=8*S(u*Math.PI);draw();if(u<1)requestAnimationFrame(anim);})(s);}
function showCount(t){cnt.textContent=t;cnt.setAttribute('x',CX);cnt.setAttribute('opacity',1);}
async function play(){
  if(busy)return;busy=true;
  bleed(); // o AOS desloca a coluna enquanto anima: volta a medir até onde vai a margem da janela
  mode='huddle';F.forEach(f=>{f.x=f.home;f.dir=f.home<CX?1:-1;f.y=0;f.v=0;f.done=false;f.goal=null;});draw();
  await sleep(500);
  for(const t of['1','2','3']){showCount(t);dip();await sleep(620);cnt.setAttribute('opacity',0);await sleep(140);}
  showCount('GO!');mode='go';
  const s=performance.now();
  await new Promise(res=>(function jump(n){const u=Math.min(1,(n-s)/420);F.forEach(f=>f.y=9*S(u*Math.PI));draw();u<1?requestAnimationFrame(jump):res();})(s));
  await sleep(150);cnt.setAttribute('opacity',0);
  mode='run';
  const order=[...F].sort((a,b)=>b.x-a.x);
  F.forEach(f=>{f.dir=1;f.y=0;f.delay=order.indexOf(f)*.12;f.vmax=200+Math.random()*70;});
  bleed(); // já passou o AOS: a pista chega mesmo à borda direita
  const exitX=wrap.clientWidth+40;
  let last=performance.now(),clock=0;
  await new Promise(res=>(function run(n){
    const dt=Math.min(.033,(n-last)/1000);last=n;clock+=dt;let moving=0;
    for(const f of F){
      if(f.x>exitX)continue;moving++;
      if(clock<f.delay)continue;
      f.v=Math.min(f.vmax,f.v+420*dt);f.x+=f.v*dt;f.phase+=f.v*dt*.085;
    }
    draw();moving?requestAnimationFrame(run):res();
  })(last));
  await sleep(1200);
  // voltam a aparecer na roda, devagar
  mode='huddle';F.forEach(f=>{f.x=f.home;f.dir=f.home<CX?1:-1;f.g.style.transition='none';f.g.style.opacity=0;});draw();
  await sleep(30);
  F.forEach(f=>{f.g.style.transition='opacity .8s';f.g.style.opacity=f.back?.45:1;});
  await sleep(900);busy=false;
}
draw();
wrap.addEventListener('click',play);
if(!wrap.dataset.still)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)play();}),{threshold:.9}).observe(wrap);
})();
