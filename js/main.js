/* Global chrome: nav scroll state, progress bar, hero parallax, magnetic buttons, scroll reveal, vehicle-experience bar/pulse animations */
(function () {
  "use strict";

/* ---------- NAV SCROLL STATE + PROGRESS ---------- */
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');
function onScroll(){
  nav.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement;
  const pct = (h.scrollTop||document.body.scrollTop) / ((h.scrollHeight||document.body.scrollHeight) - h.clientHeight) * 100;
  progress.style.width = pct + '%';
}
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ---------- HERO MOUSE PARALLAX ---------- */
const hero = document.getElementById('hero');
hero.addEventListener('mousemove', (e)=>{
  const r = hero.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / r.width) * 100;
  const my = ((e.clientY - r.top) / r.height) * 100;
  hero.style.setProperty('--mx', mx + '%');
  hero.style.setProperty('--my', my + '%');
});

/* ---------- MAGNETIC BUTTONS ---------- */
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', (e)=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.18}px, ${y*0.35}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform = 'translate(0,0)'; });
});

/* ---------- SCROLL REVEAL ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('is-in'); }
  });
}, {threshold:0.18});
document.querySelectorAll('.reveal, .tl-row').forEach(el=>io.observe(el));

/* ---------- VEHICLE EXPERIENCE: bars + pulses ---------- */
document.querySelectorAll('.viz-bar .fill').forEach(f=>{
  io.observe(f.closest('.tl-row'));
  const w = f.dataset.w;
  new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ f.style.width = w+'%'; } });
  },{threshold:0.4}).observe(f);
});
function buildPulse(el, seed){
  if(!el) return;
  for(let i=0;i<28;i++){
    const b = document.createElement('i');
    const h = 0.15 + Math.abs(Math.sin(i*0.6+seed))*0.85;
    b.style.setProperty('--h', h.toFixed(2));
    el.appendChild(b);
  }
}
buildPulse(document.getElementById('battPulse'), 1);
buildPulse(document.getElementById('safePulse'), 3);
})();
