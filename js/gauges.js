/* Performance telemetry gauges */
(function () {
  "use strict";
const gaugeData = [
  {label:'Battery', val:82, unit:'%', max:100},
  {label:'Torque', val:71, unit:'%', max:100},
  {label:'Acceleration', val:88, unit:'%', max:100},
  {label:'Efficiency', val:91, unit:'%', max:100},
  {label:'Power output', val:64, unit:'%', max:100},
  {label:'Battery temp', val:35, unit:'°C', max:60},
];
const gaugeGrid = document.getElementById('gaugeGrid');
const R = 50, C = 2*Math.PI*R;
gaugeData.forEach((g,i)=>{
  const card = document.createElement('div');
  card.className = 'gauge-card';
  card.innerHTML = `
    <svg viewBox="0 0 120 120">
      <circle class="g-track" cx="60" cy="60" r="${R}"/>
      <circle class="g-val" cx="60" cy="60" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 60 60)" id="gauge${i}"/>
      <text x="60" y="66" text-anchor="middle" class="g-num" fill="var(--text)" id="gaugeNum${i}">0${g.unit}</text>
    </svg>
    <div class="g-label">${g.label}</div>
  `;
  gaugeGrid.appendChild(card);
});
const gaugeIO = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      gaugeData.forEach((g,i)=>{
        const circle = document.getElementById('gauge'+i);
        const num = document.getElementById('gaugeNum'+i);
        const pct = g.val/g.max;
        const offset = C - C*pct;
        circle.style.strokeDashoffset = offset;
        let start=0; const t0=performance.now();
        function step(t){
          const p=Math.min(1,(t-t0)/1200); const eased=1-Math.pow(1-p,3);
          num.textContent = Math.round(start+(g.val-start)*eased)+g.unit;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      gaugeIO.disconnect();
    }
  });
},{threshold:0.3});
gaugeIO.observe(gaugeGrid);
})();
