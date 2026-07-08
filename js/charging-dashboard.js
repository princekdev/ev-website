/* Charging Ecosystem dashboard simulation */
(function () {
  "use strict";
const ringHome = document.getElementById('ringHome');
const ringFast = document.getElementById('ringFast');
const ringHomePct = document.getElementById('ringHomePct');
const ringFastPct = document.getElementById('ringFastPct');
const homeWindow = document.getElementById('homeWindow');
const fastWindow = document.getElementById('fastWindow');
const CIRC = 377;

function buildTimeline(id, count){
  const el = document.getElementById(id);
  for(let i=0;i<count;i++){ const d = document.createElement('div'); d.className='seg-block'; d.innerHTML='<div class="f"></div>'; el.appendChild(d); }
}
buildTimeline('homeTimeline', 24);

let chargeRunning = false;
document.getElementById('btnStartCharge').addEventListener('click', function(){
  if(chargeRunning) return;
  chargeRunning = true;
  this.textContent = 'Charging in progress…';
  let homePct = 20, fastPct = 10, t = 0;
  const homeBlocks = document.querySelectorAll('#homeTimeline .seg-block .f');
  const timer = setInterval(()=>{
    t += 1;
    homePct = Math.min(100, homePct + 3.4);
    fastPct = fastPct < 80 ? Math.min(80, fastPct + 7) : Math.min(100, fastPct + 1.2);
    const homeOff = CIRC - (CIRC*homePct/100);
    const fastOff = CIRC - (CIRC*fastPct/100);
    ringHome.style.strokeDashoffset = homeOff;
    ringFast.style.strokeDashoffset = fastOff;
    ringHomePct.textContent = Math.round(homePct)+'%';
    ringFastPct.textContent = Math.round(fastPct)+'%';
    const hrs = Math.floor(t*0.3); const mins = Math.round((t*0.3 - hrs)*60);
    homeWindow.textContent = hrs+'h '+String(mins).padStart(2,'0')+'m';
    fastWindow.textContent = Math.floor(t*0.9)+'m '+String(Math.round(t*7)%60).padStart(2,'0')+'s';
    const idx = Math.min(homeBlocks.length-1, Math.floor((homePct/100)*homeBlocks.length));
    for(let i=0;i<=idx;i++){ homeBlocks[i].style.width='100%'; }
    if(homePct>=100 && fastPct>=100){
      clearInterval(timer);
      chargeRunning=false;
      document.getElementById('btnStartCharge').textContent = 'Simulate another session ⚡';
    }
  }, 260);
});
})();
