const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const roles=["AI CONTENT","AI VIDEO","VIDEO EDITING","GRAPHIC DESIGN","E-COMMERCE","SOCIAL MEDIA","FRONT-END","CREATIVE TECH"];
let ri=0; setInterval(()=>{ri=(ri+1)%roles.length;const el=$("#roleText");if(!el)return;el.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:300});el.textContent=roles[ri]},1900);
const saved=localStorage.getItem("reycinth-theme")||"dark";document.body.dataset.theme=saved;
let soundEnabled=false,audioCtx=null;
function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}
function uiSound(type="click"){if(!soundEnabled)return;initAudio();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=type==='hover'?520:type==='open'?260:390;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.025,audioCtx.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.09);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.1)}
$("#themeToggle")?.addEventListener("click",()=>{const t=document.body.dataset.theme==="dark"?"light":"dark";document.body.dataset.theme=t;localStorage.setItem("reycinth-theme",t);uiSound("click")});
$("#soundToggle")?.addEventListener("click",()=>{soundEnabled=!soundEnabled;$("#soundToggle span").textContent=soundEnabled?"ON":"OFF";if(soundEnabled){initAudio();uiSound('open')}else if(modalVideo)modalVideo.muted=true;});
$("#menuToggle")?.addEventListener("click",()=>{const nav=document.querySelector(".site-header nav");if(!nav)return;const open=nav.dataset.open==='1';nav.dataset.open=open?'0':'1';nav.classList.toggle("mobile-open",!open);nav.setAttribute("aria-hidden",open?"true":"false");uiSound('click')});
document.querySelectorAll(".site-header nav a").forEach(a=>a.addEventListener("click",()=>{const nav=document.querySelector(".site-header nav");if(window.innerWidth<=800){nav?.classList.remove("mobile-open");if(nav)nav.dataset.open="0"}}));
window.addEventListener("resize",()=>{const nav=document.querySelector(".site-header nav");if(window.innerWidth>800&&nav){nav.classList.remove("mobile-open");nav.dataset.open="0";nav.removeAttribute("aria-hidden")}});
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;$$('.project').forEach(p=>{const show=f==='all'||p.dataset.cat.split(' ').includes(f);p.style.display=show?'block':'none'});uiSound('click')}));
const modal=$("#projectModal"),modalVideo=$("#modalVideo"),modalTitle=$("#modalTitle"),modalRole=$("#modalRole"),modalRatio=$("#modalRatio");
function openProject(p){modalTitle.textContent=p.dataset.title;modalRole.textContent=p.dataset.role;modalRatio.textContent=p.dataset.ratio+" / VIDEO AD";modalVideo.src=p.dataset.video;modalVideo.poster=p.dataset.poster;modalVideo.muted=false;soundEnabled=true;$("#soundToggle span").textContent="ON";modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';initAudio();modalVideo.currentTime=0;const playPromise=modalVideo.play();if(playPromise)playPromise.catch(()=>{modalVideo.muted=true;modalVideo.play().catch(()=>{});});}
$$('.project').forEach(p=>{p.addEventListener('click',e=>{if(e.target.closest('.project-play')||e.currentTarget){openProject(p);uiSound('open')}})});
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';modalVideo.pause();modalVideo.removeAttribute('src');modalVideo.load();}
$("#modalClose")?.addEventListener('click',closeModal);$('.modal-backdrop')?.addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()});
$("#modalSoundBtn")?.addEventListener('click',()=>{soundEnabled=!soundEnabled;modalVideo.muted=!soundEnabled;$("#modalSoundBtn").innerHTML=soundEnabled?'SOUND ON <span>↗</span>':'SOUND OFF <span>↗</span>';$("#soundToggle span").textContent=soundEnabled?'ON':'OFF';if(soundEnabled){initAudio();modalVideo.play().catch(()=>{});}});
// Fast interactive cursor: direct position, no lagging interpolation.
const dot=$('.cursor-dot'),ring=$('.cursor-ring');window.addEventListener('pointermove',e=>{const x=e.clientX,y=e.clientY;if(dot){dot.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;dot.style.left='0';dot.style.top='0'}if(ring){ring.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;ring.style.left='0';ring.style.top='0'}} ,{passive:true});
function bindCursor(){document.querySelectorAll('[data-cursor],.project,.tool,.btn,.filter,.icon-btn,.modal-close,.resume-download').forEach(el=>{if(el.dataset.cursorBound)return;el.dataset.cursorBound='1';el.addEventListener('mouseenter',()=>{ring?.classList.add('active');uiSound('hover')});el.addEventListener('mouseleave',()=>ring?.classList.remove('active'))})}bindCursor();
// 3-second silent hover previews on desktop; tap-to-preview is disabled on touch so cards stay lightweight.
const previewTimers=new Map();
if(window.matchMedia("(hover: hover) and (pointer: fine)").matches){
  $$('.project-video').forEach(p=>{const media=p.querySelector('.media-ratio');const img=p.querySelector('img');const v=document.createElement('video');v.className='hover-video';v.src=p.dataset.video;v.poster=p.dataset.poster;v.muted=true;v.playsInline=true;v.preload='metadata';media.appendChild(v);p.addEventListener('mouseenter',()=>{clearTimeout(previewTimers.get(p));img.style.opacity='0';v.currentTime=0;v.play().catch(()=>{});previewTimers.set(p,setTimeout(()=>{v.pause();img.style.opacity='1'},3000));});p.addEventListener('mouseleave',()=>{clearTimeout(previewTimers.get(p));v.pause();v.currentTime=0;img.style.opacity='1';});});
}
const wall=$('#toolWall');wall?.querySelectorAll('.tool').forEach((el,i)=>{el.addEventListener('click',()=>{wall.querySelectorAll('.tool').forEach(t=>t.classList.remove('tool-selected'));el.classList.add('tool-selected');uiSound('click')});el.style.setProperty('--dur',(4+i%5)+'s');el.style.setProperty('--x',((i%3)-1)*8+'px');el.style.setProperty('--y',((i%4)-2)*6+'px');el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`translate(${x*18}px,${y*18}px) rotate(${x*2}deg) scale(1.04)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));

// Interactive hero: pointer-driven parallax, tilt, glow and depth layers.
const heroStage=document.querySelector('#heroStage');
if(heroStage){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let raf=0, target={x:0,y:0}, current={x:0,y:0};
  const applyHeroMotion=()=>{
    raf=0;
    current.x += (target.x-current.x)*.12;
    current.y += (target.y-current.y)*.12;
    heroStage.style.setProperty('--mx',`${current.x.toFixed(2)}px`);
    heroStage.style.setProperty('--my',`${current.y.toFixed(2)}px`);
    heroStage.style.setProperty('--rx',`${(-current.y*.055).toFixed(2)}deg`);
    heroStage.style.setProperty('--ry',`${(current.x*.055).toFixed(2)}deg`);
    if(Math.abs(target.x-current.x)>.05||Math.abs(target.y-current.y)>.05) raf=requestAnimationFrame(applyHeroMotion);
  };
  if(finePointer&&!reduceMotion){
    heroStage.addEventListener('pointermove',e=>{
      const r=heroStage.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
      target.x=px*42; target.y=py*42;
      heroStage.classList.add('is-hovering');
      if(!raf) raf=requestAnimationFrame(applyHeroMotion);
    },{passive:true});
    heroStage.addEventListener('pointerenter',()=>heroStage.classList.add('is-hovering'));
    heroStage.addEventListener('pointerleave',()=>{
      target.x=0; target.y=0; heroStage.classList.remove('is-hovering');
      if(!raf) raf=requestAnimationFrame(applyHeroMotion);
    });
  }
}

// Hidden easter egg: the hover label reveals PLAY, and clicking plays the supplied music file.
const egg=document.querySelector('#easterEgg');
if(egg){
  const eggAudio=new Audio('assets/audio/easter-egg-music.mp3');
  eggAudio.preload='auto';
  eggAudio.loop=false;

  function stopEggMusic(reset=true){
    eggAudio.pause();
    if(reset) eggAudio.currentTime=0;
    egg.classList.remove('is-playing');
    egg.setAttribute('aria-label','Play hidden music');
  }

  eggAudio.addEventListener('ended',()=>stopEggMusic(false));

  egg.addEventListener('click',()=>{
    if(!eggAudio.paused){
      stopEggMusic(true);
      return;
    }
    eggAudio.currentTime=0;
    eggAudio.play().then(()=>{
      egg.classList.add('is-playing');
      egg.setAttribute('aria-label','Stop hidden music');
    }).catch(()=>{
      egg.classList.remove('is-playing');
      egg.setAttribute('aria-label','Play hidden music');
    });
  });
}
