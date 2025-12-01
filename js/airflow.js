import { calculateAirflow } from './lib/airflow_calc.js';

const form       = document.getElementById('airForm');
const presetOd   = document.getElementById('presetOd');
const presetId   = document.getElementById('presetId');
const odCustom   = document.getElementById('odCustom');
const idCustom   = document.getElementById('idCustom');
const customOdDiv= document.getElementById('customOdDiv');
const customIdDiv= document.getElementById('customIdDiv');
const lengthEl   = document.getElementById('length');
const presetDp   = document.getElementById('presetDp');
const dpCustom   = document.getElementById('dpCustom');
const customDpDiv= document.getElementById('customDpDiv');
const resultDiv  = document.getElementById('airResult');

// Map OD → ID options
const mapId = {
  '3.2': ['2'],
  '4':   ['2.5'],
  '6':   ['4'],
  '8':   ['5','6'],
  '10':  ['8'],
  '12':  ['9'],
  '16':  ['10']
};

// OD change
presetOd.addEventListener('change', () => {
  const od = presetOd.value;
  if (od === 'customOd') {
    presetId.disabled = true;
    presetId.innerHTML = '<option>–</option>';
    customOdDiv.style.display = 'block';
    customIdDiv.style.display = 'block';
    odCustom.required = idCustom.required = true;
  } else {
    customOdDiv.style.display = 'none';
    odCustom.required = false;
    const ids = mapId[od] || [];
    presetId.disabled = false;
    presetId.innerHTML = ids
      .map(i => `<option value="${i}">${i} mm</option>`)
      .join('') + '<option value="customId">Vlastní…</option>';
    presetId.value = ids[0] || '';
    customIdDiv.style.display = 'none';
    idCustom.required = false;
  }
});
presetOd.dispatchEvent(new Event('change'));

// ID change
presetId.addEventListener('change', () => {
  if (presetId.value === 'customId') {
    customIdDiv.style.display = 'block';
    idCustom.required = true;
  } else {
    customIdDiv.style.display = 'none';
    idCustom.required = false;
  }
});

// Δp change
presetDp.addEventListener('change', () => {
  if (presetDp.value === 'customDp') {
    customDpDiv.style.display = 'block';
    dpCustom.required = true;
  } else {
    customDpDiv.style.display = 'none';
    dpCustom.required = false;
  }
});
presetDp.dispatchEvent(new Event('change'));

// submit
form.addEventListener('submit', e => {
  e.preventDefault();

  // Determine ID
  let id_mm;
  if (presetOd.value === 'customOd') {
    id_mm = parseFloat(idCustom.value);
  } else if (presetId.value === 'customId') {
    id_mm = parseFloat(idCustom.value);
  } else {
    id_mm = parseFloat(presetId.value);
  }

  const L_m = parseFloat(lengthEl.value);
  if (isNaN(id_mm) || isNaN(L_m) || L_m <= 0) {
    resultDiv.textContent = 'Zadejte platné kladné hodnoty.';
    return;
  }

  // Δp
  let dp_MPa = parseFloat(presetDp.value);
  if (presetDp.value === 'customDp') {
    const v = parseFloat(dpCustom.value);
    if (isNaN(v) || v <= 0) {
      resultDiv.textContent = 'Zadejte platný vlastní tlakový spád.';
      return;
    }
    dp_MPa = v;
  }

  try {
    const Qnlmin = calculateAirflow(id_mm, L_m, dp_MPa);
    resultDiv.textContent = `Průtok: ${Qnlmin.toFixed(2)} Nl/min`;
  } catch (error) {
    resultDiv.textContent = error.message;
  }
});
