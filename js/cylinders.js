import { calculateCylinderForces } from './lib/cylinders_calc.js';
import { HistoryManager } from './lib/history_manager.js';

const form        = document.getElementById('cylForm');
const presetDp    = document.getElementById('presetDp');
const presetDr    = document.getElementById('presetDr');
const customDpDiv = document.getElementById('customDpDiv');
const customDrDiv = document.getElementById('customDrDiv');
const dpCustom    = document.getElementById('dpCustom');
const drCustom    = document.getElementById('drCustom');
const pressure    = document.getElementById('pressure');
const unitP       = document.getElementById('unitP');
const unitF       = document.getElementById('unitF');
const resultDiv   = document.getElementById('cylResult');

const historyManager = new HistoryManager('cylinders_history', 'history-container');

// map: píst → standardní pístnice
const mapDr = {
  '8':'4','10':'4','12':'6','16':'6','20':'8','25':'10',
  '32':'12','40':'16','50':'20','63':'20','80':'25',
  '100':'30','125':'32','160':'40','200':'40','250':'50'
};

// když se změní průměr pístu
presetDp.addEventListener('change', () => {
  const dp = presetDp.value;
  if (dp === 'customDp') {
    // vlastní píst → zadat oba ručně
    customDpDiv.style.display = 'block';
    customDrDiv.style.display = 'block';
    dpCustom.required = drCustom.required = true;
    presetDr.disabled = true;
    presetDr.innerHTML = '<option>–</option>';
  } else {
    // standardní píst
    const dr = mapDr[dp];
    customDpDiv.style.display = 'none';
    dpCustom.required = false;

    // nabídka pístnice: standard & vlastní
    presetDr.disabled = false;
    presetDr.innerHTML = `
      <option value="${dr}">${dr} mm</option>
      <option value="customDr">Vlastní…</option>
    `;
    presetDr.value = dr;
    customDrDiv.style.display = 'none';
    drCustom.required = false;
  }
});
presetDp.dispatchEvent(new Event('change'));

// když se změní volba pístnice
presetDr.addEventListener('change', () => {
  if (presetDr.value === 'customDr') {
    customDrDiv.style.display = 'block';
    drCustom.required = true;
  } else {
    customDrDiv.style.display = 'none';
    drCustom.required = false;
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  // načti průměry
  let dp = presetDp.value==='customDp'
    ? parseFloat(dpCustom.value)
    : parseFloat(presetDp.value);
  let dr = (presetDp.value==='customDp' || presetDr.value==='customDr')
    ? parseFloat(drCustom.value)
    : parseFloat(presetDr.value);

  const pVal = parseFloat(pressure.value);

  try {
    const { Fp, Fr } = calculateCylinderForces(dp, dr, pVal, unitP.value);
    const factor = unitF.value==='kN'?1e-3:1;
    const fpStr = (Fp*factor).toFixed(2);
    const frStr = (Fr*factor).toFixed(2);

    resultDiv.innerHTML = `
        <p>Síla tlačná: <strong>${fpStr} ${unitF.value}</strong></p>
        <p>Síla tažná: <strong>${frStr} ${unitF.value}</strong></p>
    `;

    // Add to history
    historyManager.addEntry(`D: ${dp}mm, d: ${dr}mm, P: ${pVal}${unitP.value}<br>-> <strong>F+: ${fpStr} ${unitF.value}, F-: ${frStr} ${unitF.value}</strong>`);

  } catch (error) {
      resultDiv.textContent = error.message;
  }
});
