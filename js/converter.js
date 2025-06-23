// js/converter.js
const form      = document.getElementById('convForm');
const fromUnit  = document.getElementById('fromUnit');
const toUnit    = document.getElementById('toUnit');
const valueInput= document.getElementById('value');
const resultDiv = document.getElementById('convResult');

form.addEventListener('submit', e => {
  e.preventDefault();
  const from = fromUnit.value;
  const to   = toUnit.value;
  const val  = parseFloat(valueInput.value);
  if (isNaN(val)) {
    resultDiv.textContent = 'Neplatná hodnota.';
    return;
  }

  // Převod tlaku bar ↔ psi
  if ((from === 'bar' || from === 'psi') && (to === 'bar' || to === 'psi')) {
    let out;
    if (from === 'bar' && to === 'psi') out = val * 14.5038;
    else if (from === 'psi' && to === 'bar') out = val / 14.5038;
    resultDiv.textContent = `${out.toFixed(4)} ${to}`;
    return;
  }

  // Pomocné funkce pro převod přes Qn (Nl/min)
  function toQn(unit, value) {
    switch (unit) {
      case 'Nlmin': return value;
      case 'm3h':   return value * 1000 / 60;
      case 'kv':    return value * Math.sqrt(1);            // Δp=1 bar
      case 'Kv':    return (value * Math.sqrt(1)) * 1000/60; // Δp=1 bar
      case 'C':     return value * 6 * 60;                  // p1abs=6 bar -> l/s => *60 => l/min
      case 'Cv':    return value * Math.sqrt(1/0.07) * 3.78541; // Δp=1 psi (0.07 bar)
      default:      return NaN;
    }
  }

  function fromQn(unit, qn) {
    switch (unit) {
      case 'Nlmin': return qn;
      case 'm3h':   return qn * 60 / 1000;
      case 'kv':    return qn; 
      case 'Kv':    return qn * 60 / 1000;
      case 'C':     return qn / (6 * 60);
      case 'Cv':    return qn / 3.78541 / Math.sqrt(1/0.07);
      default:      return NaN;
    }
  }

  const allUnits = ['Nlmin','m3h','kv','Kv','C','Cv'];
  if (allUnits.includes(from) && allUnits.includes(to)) {
    const qn  = toQn(from, val);
    const out = fromQn(to, qn);
    resultDiv.textContent = `${out.toFixed(4)} ${to}`;
    return;
  }

  resultDiv.textContent = 'Konverze není definována.';
});
