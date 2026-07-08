/* Range Intelligence calculator logic */
(function () {
  "use strict";
const BASE_RANGE = 480; // km, ideal conditions
const BASE_CONSUMPTION = 12.6; // kWh/100km ideal

const els = {
  speed: document.getElementById('ctlSpeed'),
  temp: document.getElementById('ctlTemp'),
  pax: document.getElementById('ctlPax'),
  cargo: document.getElementById('ctlCargo'),
  lblSpeed: document.getElementById('lblSpeed'),
  lblTemp: document.getElementById('lblTemp'),
  lblPax: document.getElementById('lblPax'),
  lblCargo: document.getElementById('lblCargo'),
  outRange: document.getElementById('outRange'),
  outConsume: document.getElementById('outConsume'),
  outEff: document.getElementById('outEff'),
  outBatt: document.getElementById('outBatt'),
  battFill: document.getElementById('battFill'),
  reco: document.getElementById('reco'),
  graphLine: document.getElementById('graphLine'),
  graphArea: document.getElementById('graphArea'),
};

const segState = { mode:1, terrain:1, traffic:1, style:1, wheel:1 };
function wireSeg(id, key){
  const seg = document.getElementById(id);
  seg.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      seg.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      segState[key] = parseFloat(btn.dataset.val);
      computeRange();
    });
  });
}
wireSeg('segMode','mode');
wireSeg('segTerrain','terrain');
wireSeg('segTraffic','traffic');
wireSeg('segStyle','style');
wireSeg('segWheel','wheel');

const toggles = { ac:false, heat:false, regen:true };
function wireToggle(id, key, initial){
  const t = document.getElementById(id);
  if(initial) t.classList.add('on');
  t.addEventListener('click', ()=>{
    toggles[key] = !toggles[key];
    t.classList.toggle('on', toggles[key]);
    computeRange();
  });
}
wireToggle('tgAC','ac',false);
wireToggle('tgHeat','heat',false);
wireToggle('tgRegen','regen',true);

function animateNumber(el, target, decimals){
  const start = parseFloat(el.textContent) || 0;
  const dur = 500; const t0 = performance.now();
  function step(t){
    const p = Math.min(1,(t-t0)/dur);
    const eased = 1 - Math.pow(1-p,3);
    const val = start + (target-start)*eased;
    el.textContent = decimals ? val.toFixed(decimals) : Math.round(val);
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function computeRange(){
  const speed = parseInt(els.speed.value);
  const temp = parseInt(els.temp.value);
  const pax = parseInt(els.pax.value);
  const cargo = parseInt(els.cargo.value);

  els.lblSpeed.textContent = speed + ' km/h';
  els.lblTemp.textContent = temp + '°C';
  els.lblPax.textContent = pax;
  els.lblCargo.textContent = cargo + ' kg';

  // speed factor: aero drag roughly scales with v^2, normalized around 90km/h sweet spot
  const speedFactor = 1 + Math.pow(Math.max(0,speed-90)/90, 2) * 0.55 + (speed<50? (50-speed)/50*0.12 : 0);

  // temperature factor: efficiency drops away from ~21C
  const tempDelta = Math.abs(temp - 21);
  const tempFactor = 1 + (tempDelta*tempDelta)/2600;

  // weight factor from passengers + cargo
  const weightFactor = 1 + (pax-1)*0.025 + (cargo/1000)*0.09;

  // climate control
  const acFactor = toggles.ac ? 1.06 : 1;
  const heatFactor = toggles.heat ? 1 + (temp<15 ? 0.15 : 0.05) : 1;

  // regen
  const regenFactor = toggles.regen ? 0.96 : 1.04;

  const totalFactor = speedFactor * tempFactor * weightFactor * acFactor * heatFactor * regenFactor
                      * segState.mode * segState.terrain * segState.traffic * segState.style * segState.wheel;

  const range = Math.max(60, Math.round(BASE_RANGE / totalFactor));
  const consumption = (BASE_CONSUMPTION * totalFactor);
  const efficiency = Math.max(35, Math.min(99, Math.round(100 / totalFactor)));
  const battRemaining = Math.max(4, Math.min(100, Math.round(100 - (totalFactor-0.75)*22)));

  animateNumber(els.outRange, range, 0);
  els.outConsume.textContent = consumption.toFixed(1) + ' kWh/100km';
  els.outEff.textContent = efficiency + '%';
  els.outBatt.textContent = battRemaining + '%';
  els.battFill.style.width = battRemaining + '%';

  // recommendation logic
  let tip = 'Optimal setup — this is close to peak efficiency.';
  if(speed>130) tip = 'Speed above 130 km/h is the single biggest range cost here — dropping to 110 recovers meaningful distance.';
  else if(toggles.heat && temp<10) tip = 'Cabin heater in cold weather draws heavily — pre-heating while plugged in avoids the battery penalty.';
  else if(segState.mode===1.22) tip = 'Sport mode trims range for throttle response — switch to Normal for longer trips.';
  else if(!toggles.regen) tip = 'Regenerative braking is off — enabling it recovers energy on every deceleration.';
  else if(segState.terrain>1.2) tip = 'Mountain terrain costs range on the way up but recovers a portion on the descent via regen.';
  else if(cargo>120) tip = 'Heavy cargo load — consider removing non-essential weight for longer trips.';
  els.reco.textContent = tip;

  // energy graph: simple curve based on totalFactor shape across a simulated trip
  let d = 'M0 100 '; let dArea = 'M0 110 L0 100 ';
  for(let i=0;i<=20;i++){
    const x = i*20;
    const noise = Math.sin(i*0.9)*6*(totalFactor);
    const y = 100 - (i*2.2)/(totalFactor*0.9) - noise*0.4;
    d += `L${x} ${Math.max(6,y).toFixed(1)} `;
    dArea += `L${x} ${Math.max(6,y).toFixed(1)} `;
  }
  dArea += 'L400 110 Z';
  els.graphLine.setAttribute('d', d);
  els.graphArea.setAttribute('d', dArea);
}
[els.speed, els.temp, els.pax, els.cargo].forEach(el=>el.addEventListener('input', computeRange));
computeRange();
})();
