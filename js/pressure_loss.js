import { calculatePressureLoss } from './lib/pressure_loss_calc.js';
import { HistoryManager } from './lib/history_manager.js';

// Elementy formuláře
const form        = document.getElementById('lossForm');
const flowEl      = document.getElementById('flow');
const flowUnitEl  = document.getElementById('flowUnit');
const presetOdEl  = document.getElementById('presetOd');
const presetIdEl  = document.getElementById('presetId');
const customOdDiv = document.getElementById('customOdDiv');
const customIdDiv = document.getElementById('customIdDiv');
const odCustomEl  = document.getElementById('odCustom');
const idCustomEl  = document.getElementById('idCustom');
const lengthEl    = document.getElementById('length');
const p1El        = document.getElementById('pressureIn');
const p1UnitEl    = document.getElementById('pressureUnitIn');
const p2El        = document.getElementById('pressureOut');
const p2UnitEl    = document.getElementById('pressureUnitOut');
const fMethodEl   = document.getElementById('fMethod');
const resultEl    = document.getElementById('lossResult');

const historyManager = new HistoryManager('pressure_loss_history', 'history-container');

// Mapování OD → možné ID
const mapId = {
  '3.2': ['2'],
  '4':   ['2.5'],
  '6':   ['4'],
  '8':   ['5','6'],
  '10':  ['8'],
  '12':  ['9'],
  '16':  ['10']
};

// Změna volby OD hadice
presetOdEl.addEventListener('change', () => {
  const od = presetOdEl.value;
  if (od === 'customOd') {
    customOdDiv.style.display = 'block';
    customIdDiv.style.display = 'block';
    presetIdEl.disabled = true;
    odCustomEl.required = idCustomEl.required = true;
  } else {
    customOdDiv.style.display = 'none';
    odCustomEl.required = false;
    const ids = mapId[od] || [];
    presetIdEl.disabled = false;
    presetIdEl.innerHTML =
      ids.map(i => `<option value="${i}">${i} mm</option>`).join('') +
      '<option value="customId">Vlastní…</option>';
    presetIdEl.value = ids[0] || '';
    customIdDiv.style.display = 'none';
    idCustomEl.required = false;
  }
});
presetOdEl.dispatchEvent(new Event('change'));

// Změna volby ID hadice
presetIdEl.addEventListener('change', () => {
  if (presetIdEl.value === 'customId') {
    customIdDiv.style.display = 'block';
    idCustomEl.required = true;
  } else {
    customIdDiv.style.display = 'none';
    idCustomEl.required = false;
  }
});

// Odeslání formuláře
form.addEventListener('submit', e => {
  e.preventDefault();

  const flow = parseFloat(flowEl.value);

  // Určení vnitřního průměru hadice D [m]
  let id_mm;
  if (presetOdEl.value === 'customOd')          id_mm = parseFloat(odCustomEl.value);
  else if (presetIdEl.value === 'customId')     id_mm = parseFloat(idCustomEl.value);
  else                                           id_mm = parseFloat(presetIdEl.value);

  const L = parseFloat(lengthEl.value);
  const p1Val = parseFloat(p1El.value);
  const p2Val = parseFloat(p2El.value);

  try {
      const { loss_Pa, nominal_Pa, Re, f } = calculatePressureLoss(
          flow, flowUnitEl.value, id_mm, L, p1Val, p1UnitEl.value, p2Val, p2UnitEl.value, fMethodEl.value
      );

      const lossBar = (loss_Pa / 1e5).toFixed(4);
      resultEl.innerHTML = `
        <h2>Výsledky výpočtu</h2>
        <p><span class="label">Tlaková ztráta:</span> ${lossBar} bar</p>
        <p><span class="label">Tlaková ztráta (Pa, psi):</span>
          ${loss_Pa.toFixed(2)} Pa | ${(loss_Pa / 6894.76).toFixed(2)} psi</p>
        <p><span class="label">Tlakový spád (teoreticky):</span> ${(nominal_Pa / 1e5).toFixed(4)} bar (${nominal_Pa.toFixed(0)} Pa)</p>
        <p><span class="label">Reynoldsovo číslo Re:</span> ${Re.toFixed(0)}</p>
        <p><span class="label">Součinitel tření f:</span> ${f.toFixed(4)}</p>
      `;

      // Add to history
      historyManager.addEntry(`Q: ${flow}${flowUnitEl.value}, ID: ${id_mm}mm, L: ${L}m<br>-> <strong>Δp: ${lossBar} bar</strong>`);

  } catch (error) {
      resultEl.textContent = "Chyba výpočtu: " + error.message;
  }
});
