/* Cost Savings Simulator logic */
(function () {
  "use strict";
const cEls = {
  dist: document.getElementById('ctlDist'), lblDist: document.getElementById('lblDist'),
  fuel: document.getElementById('ctlFuel'), lblFuel: document.getElementById('lblFuel'),
  elec: document.getElementById('ctlElec'), lblElec: document.getElementById('lblElec'),
  years: document.getElementById('ctlYears'), lblYears: document.getElementById('lblYears'),
  outMonthly: document.getElementById('outMonthly'), outYearly: document.getElementById('outYearly'),
  outTotal: document.getElementById('outTotal'), outCO2: document.getElementById('outCO2'),
  outTrees: document.getElementById('outTrees'), treeRow: document.getElementById('treeRow'),
};
let freqFactor = 1;
document.querySelectorAll('#segFreq button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#segFreq button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    freqFactor = parseFloat(btn.dataset.val);
    computeSavings();
  });
});

function animateText(el,target,prefix,suffix,decimals){
  const startTxt = el.textContent.replace(/[^0-9.]/g,'');
  const start = parseFloat(startTxt)||0;
  const dur=500; const t0=performance.now();
  function step(t){
    const p=Math.min(1,(t-t0)/dur); const eased=1-Math.pow(1-p,3);
    const val = start+(target-start)*eased;
    el.textContent = prefix+val.toLocaleString(undefined,{maximumFractionDigits:decimals||0})+suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function computeSavings(){
  const dist = parseInt(cEls.dist.value);
  const fuelPrice = parseFloat(cEls.fuel.value);
  const elecPrice = parseFloat(cEls.elec.value);
  const years = parseInt(cEls.years.value);

  cEls.lblDist.textContent = dist+' km';
  cEls.lblFuel.textContent = '$'+fuelPrice.toFixed(2)+'/L';
  cEls.lblElec.textContent = '$'+elecPrice.toFixed(2)+'/kWh';
  cEls.lblYears.textContent = years+' years';

  const petrolConsumptionPer100 = 7.8; // L/100km comparable car
  const evConsumptionPer100 = 14.9; // kWh/100km real world

  const dailyKm = dist * freqFactor;
  const costFuelPerDay = (dailyKm/100)*petrolConsumptionPer100*fuelPrice;
  const costElecPerDay = (dailyKm/100)*evConsumptionPer100*elecPrice;
  const savingsPerDay = costFuelPerDay - costElecPerDay;

  const monthly = savingsPerDay*30;
  const yearly = savingsPerDay*365;
  const total = yearly*years;

  const co2PerKmPetrol = 0.12; // kg/km
  const co2PerKmGrid = 0.05; // kg/km equivalent for grid electricity
  const co2SavedYearly = dailyKm*365*(co2PerKmPetrol-co2PerKmGrid);
  const co2Total = co2SavedYearly*years;
  const treesPerYear = co2SavedYearly/21; // ~21kg CO2 absorbed per tree per year

  animateText(cEls.outMonthly, Math.max(0,monthly), '$', '', 0);
  animateText(cEls.outYearly, Math.max(0,yearly), '$', '', 0);
  animateText(cEls.outTotal, Math.max(0,total), '$', '', 0);
  animateText(cEls.outCO2, Math.max(0,co2Total), '', ' kg', 0);
  animateText(cEls.outTrees, Math.max(0,treesPerYear), '', ' trees/yr', 0);

  const treeCount = Math.min(24, Math.round(treesPerYear/4));
  cEls.treeRow.innerHTML = '';
  for(let i=0;i<24;i++){
    const s = document.createElement('span'); s.textContent='🌳';
    if(i<treeCount) s.classList.add('lit');
    cEls.treeRow.appendChild(s);
  }
}
[cEls.dist, cEls.fuel, cEls.elec, cEls.years].forEach(el=>el.addEventListener('input', computeSavings));
computeSavings();
})();
