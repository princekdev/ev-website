/* Station Locator: map rendering, list, search, filters, favorites */
(function () {
  "use strict";
const stations = [
  {name:'Riverfront Supercharge Hub', area:'Downtown', dist:1.2, wait:0, power:250, connectors:'CCS · NACS', open:true, avail:'green', fav:false, x:180, y:120},
  {name:'Northgate Fast Court', area:'Northgate', dist:3.4, wait:8, power:180, connectors:'CCS', open:true, avail:'amber', fav:true, x:340, y:80},
  {name:'Harborline Station', area:'Harbor District', dist:5.1, wait:0, power:250, connectors:'CCS · NACS', open:true, avail:'green', fav:false, x:120, y:300},
  {name:'Old Mill Charge Point', area:'West End', dist:6.8, wait:14, power:60, connectors:'CCS', open:false, avail:'red', fav:false, x:420, y:250},
  {name:'Summit Ridge Hub', area:'Uptown', dist:8.9, wait:2, power:180, connectors:'CCS · NACS', open:true, avail:'green', fav:false, x:460, y:400},
  {name:'Transit Plaza Fast Lane', area:'Central', dist:2.0, wait:5, power:150, connectors:'CCS', open:true, avail:'amber', fav:true, x:250, y:200},
  {name:'Lakeside Green Charge', area:'Lakeside', dist:9.6, wait:0, power:250, connectors:'CCS · NACS', open:true, avail:'green', fav:false, x:500, y:150},
  {name:'Foundry District Point', area:'Foundry', dist:4.4, wait:0, power:120, connectors:'CCS', open:false, avail:'red', fav:false, x:90, y:450},
];

const stationListEl = document.getElementById('stationList');
const mapSvg = document.getElementById('mapSvg');
const mapTooltip = document.getElementById('mapTooltip');
let activeStation = null;
let currentFilter = 'all';
let searchTerm = '';

function drawGrid(){
  let s = '';
  for(let i=0;i<=600;i+=40){ s += `<line class="grid-line" x1="${i}" y1="0" x2="${i}" y2="560"/>`; }
  for(let j=0;j<=560;j+=40){ s += `<line class="grid-line" x1="0" y1="${j}" x2="600" y2="${j}"/>`; }
  return s;
}

function renderMap(){
  let s = drawGrid();
  stations.forEach((st, i)=>{
    const visible = matchesFilter(st) && matchesSearch(st);
    if(!visible) return;
    const busy = st.avail !== 'green' ? 'busy' : '';
    const act = activeStation===i ? 'active' : '';
    s += `<g class="map-pin ${busy} ${act}" data-i="${i}" transform="translate(${st.x},${st.y})">
      <circle class="ripple" r="10"/>
      <circle class="core" r="7"/>
    </g>`;
  });
  mapSvg.innerHTML = s;
  mapSvg.querySelectorAll('.map-pin').forEach(pin=>{
    const i = parseInt(pin.dataset.i);
    pin.addEventListener('mouseenter', (e)=>{
      const st = stations[i];
      mapTooltip.textContent = st.name + ' · ' + st.power + 'kW';
      const rect = mapSvg.getBoundingClientRect();
      const pt = pin.querySelector('.core');
      const bbox = pt.getBoundingClientRect();
      mapTooltip.style.left = (bbox.left - rect.left + 7) + 'px';
      mapTooltip.style.top = (bbox.top - rect.top) + 'px';
      mapTooltip.classList.add('show');
    });
    pin.addEventListener('mouseleave', ()=> mapTooltip.classList.remove('show'));
    pin.addEventListener('click', ()=>{ activeStation = i; renderMap(); renderList(); document.querySelector(`.station[data-i="${i}"]`)?.scrollIntoView({behavior:'smooth',block:'nearest'}); });
  });
}

function matchesFilter(st){
  if(currentFilter==='available') return st.avail==='green';
  if(currentFilter==='open') return st.open;
  if(currentFilter==='fav') return st.fav;
  return true;
}
function matchesSearch(st){
  if(!searchTerm) return true;
  return (st.name+st.area).toLowerCase().includes(searchTerm.toLowerCase());
}

function renderList(){
  stationListEl.innerHTML = '';
  stations.forEach((st,i)=>{
    if(!matchesFilter(st) || !matchesSearch(st)) return;
    const div = document.createElement('div');
    div.className = 'station' + (activeStation===i ? ' active' : '');
    div.dataset.i = i;
    div.innerHTML = `
      <div class="station-top">
        <span class="station-name">${st.name}</span>
        <span class="station-dist">${st.dist} km</span>
      </div>
      <div class="station-meta">
        <span><span class="dot ${st.avail}"></span>${st.avail==='green'?'Available':st.avail==='amber'?'Limited':'Busy'}</span>
        <span>${st.connectors}</span>
        <span>${st.power}kW</span>
        <span>${st.open?'Open now':'Closed'}</span>
        <span>Wait ~${st.wait}min</span>
      </div>
      <button class="fav-star ${st.fav?'active':''}" data-i="${i}" aria-label="Toggle favorite">★</button>
    `;
    div.addEventListener('click', (e)=>{
      if(e.target.classList.contains('fav-star')) return;
      activeStation = i; renderMap(); renderList();
    });
    div.querySelector('.fav-star').addEventListener('click', (e)=>{
      e.stopPropagation();
      st.fav = !st.fav;
      renderList();
    });
    stationListEl.appendChild(div);
  });
}

document.getElementById('stationSearch').addEventListener('input', (e)=>{ searchTerm = e.target.value; renderMap(); renderList(); });
document.querySelectorAll('.loc-filters button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.loc-filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.f;
    renderMap(); renderList();
  });
});
renderMap();
renderList();
})();
