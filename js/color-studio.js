/* Color Studio theme switching via CSS custom properties */
(function () {
  "use strict";
document.querySelectorAll('.swatch').forEach(sw=>{
  sw.addEventListener('click', ()=>{
    document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
    sw.classList.add('active');
    document.documentElement.style.setProperty('--accent', sw.dataset.accent);
    document.documentElement.style.setProperty('--accent-2', sw.dataset.accent2);
    const hex = sw.dataset.accent.replace('#','');
    const r=parseInt(hex.substr(0,2),16), g=parseInt(hex.substr(2,2),16), b=parseInt(hex.substr(4,2),16);
    document.documentElement.style.setProperty('--accent-rgb', `${r},${g},${b}`);
    document.getElementById('studioFinish').textContent = sw.dataset.name;
  });
});
})();
