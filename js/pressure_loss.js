// js/pressure_loss.js

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

  // 1) Převod průtoku na objemový tok Q [m³/s]
  let Q;
  const flow = parseFloat(flowEl.value);
  switch (flowUnitEl.value) {
    case 'm3h':
      Q = flow / 3600;
      break;
    case 'lmin':
      Q = flow / 1000 / 60;
      break;
    default: // 'Nlmin'
      const p1PaNorm = p1UnitEl.value === 'MPa' ? p1El.value * 1e6
                     : p1UnitEl.value === 'psi' ? p1El.value * 6894.76
                     : p1El.value * 1e5;
      Q = (flow / 1000 / 60) * (1e5 / p1PaNorm);
  }

  // 2) Určení vnitřního průměru hadice D [m]
  let id_mm;
  if (presetOdEl.value === 'customOd')          id_mm = parseFloat(odCustomEl.value);
  else if (presetIdEl.value === 'customId')     id_mm = parseFloat(idCustomEl.value);
  else                                           id_mm = parseFloat(presetIdEl.value);
  const D = id_mm / 1000;

  // 3) Délka potrubí L [m]
  const L = parseFloat(lengthEl.value);

  // 4) Vstupní a výstupní tlak v Pa
  const p1Pa = p1UnitEl.value === 'MPa' ? p1El.value * 1e6
             : p1UnitEl.value === 'psi' ? p1El.value * 6894.76
             : p1El.value * 1e5;
  const p2Pa = p2UnitEl.value === 'MPa' ? p2El.value * 1e6
             : p2UnitEl.value === 'psi' ? p2El.value * 6894.76
             : p2El.value * 1e5;

  // 5) Výpočet rychlosti V a hustoty ρ
  const A   = Math.PI * D * D / 4;
  const V   = Q / A;
  const rho = 1.225 * (p1Pa / 101325);

  // 6) Reynoldsovo číslo Re
  const nu = 1.5e-5;
  const Re = V * D / nu;

  // 7) Součinitel tření f
  let f = 0.02;
  if (fMethodEl.value === 'blasius') {
    f = 0.079 / Math.pow(Re, 0.25);
  }

  // 8) Výpočet tlakové ztráty dle Darcy–Weisbach
  const loss    = f * (L / D) * (rho * V * V / 2);
  const nominal = p1Pa - p2Pa;

  // 9) Výstup výsledků: nejprve tlaková ztráta v barech, pak ostatní
  resultEl.innerHTML = `
    <h2>Výsledky výpočtu</h2>
    <p><span class="label">Tlaková ztráta:</span> ${(loss / 1e5).toFixed(4)} bar</p>
    <p><span class="label">Tlaková ztráta (Pa, psi):</span>
      ${loss.toFixed(2)} Pa | ${(loss / 6894.76).toFixed(2)} psi</p>
    <p><span class="label">Tlakový spád (teoreticky):</span> ${(nominal / 1e5).toFixed(4)} bar (${nominal.toFixed(0)} Pa)</p>
    <p><span class="label">Reynoldsovo číslo Re:</span> ${Re.toFixed(0)}</p>
    <p><span class="label">Součinitel tření f:</span> ${f.toFixed(4)}</p>
  `;
});
