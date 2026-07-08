/* Procedural sustainability SVG illustrations */
(function () {
  "use strict";
(function(){
  const solar = document.getElementById('solarPanel');
  let s = '<rect x="10" y="20" width="100" height="30" rx="3" fill="none" stroke="var(--accent)" stroke-width="1.5"/>';
  for(let i=0;i<5;i++){ s += `<line x1="${30+i*16}" y1="20" x2="${30+i*16}" y2="50" stroke="var(--line-strong)"/>`; }
  s += '<line x1="60" y1="50" x2="60" y2="58" stroke="var(--accent)" stroke-width="1.5"/>';
  s += '<circle cx="95" cy="12" r="7" fill="none" stroke="var(--accent-2)" stroke-width="1.5"/>';
  for(let i=0;i<8;i++){ const a=i*Math.PI/4; s += `<line x1="${95+Math.cos(a)*10}" y1="${12+Math.sin(a)*10}" x2="${95+Math.cos(a)*13}" y2="${12+Math.sin(a)*13}" stroke="var(--accent-2)" stroke-width="1"/>`; }
  solar.innerHTML = s;

  const carbon = document.getElementById('carbonSvg');
  let c = '';
  const petrolH = 70, evH = 26;
  c += `<rect x="20" y="${100-petrolH}" width="26" height="${petrolH}" rx="3" fill="var(--surface-2)"/>`;
  c += `<rect x="70" y="${100-evH}" width="26" height="${evH}" rx="3" fill="var(--accent)"/>`;
  c += `<text x="33" y="98" font-size="9" fill="var(--text-faint)" text-anchor="middle" font-family="monospace">ICE</text>`;
  c += `<text x="83" y="98" font-size="9" fill="var(--text-faint)" text-anchor="middle" font-family="monospace">ARC</text>`;
  carbon.innerHTML = c;

  const circ = document.getElementById('circularSvg');
  let arr = '';
  const pts = 3;
  for(let i=0;i<pts;i++){
    const a = (i/pts)*Math.PI*2 - Math.PI/2;
    const x = 60+Math.cos(a)*42, y=60+Math.sin(a)*42;
    arr += `<circle cx="${x}" cy="${y}" r="5" fill="var(--accent)" opacity="${0.4+i*0.2}"/>`;
  }
  arr += `<circle cx="60" cy="60" r="42" fill="none" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="4 4"/>`;
  circ.innerHTML = arr;
})();
})();
