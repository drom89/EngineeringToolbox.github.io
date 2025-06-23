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

  // Přímý převod bar ↔ psi
  if ((from==='bar'||from==='psi') && (to==='bar'||to==='psi')) {
    const out = from==='bar' ? val * 14.5038 : val / 14.5038;
    resultDiv.textContent = `${out.toFixed(4)} ${to}`;
    return;
  }

  // Funkce pro převod na Qn (Nl/min)
  function toQn(unit, value) {
    switch(unit) {
      case 'Nlmin': return value;
      case 'm3h':   return value * 1000 / 60;
      case 'kv':    return value;                     // kv= l/min při Δp=1 bar → Nl/min
      case 'Kv':    return value * 1000 / 60;         // Kv= m³/h při Δp=1 bar
      case 'Cv':    return value * 3.78541;           // Cv= US gal/min → L/min → Nl/min
      case 'C':     return value * 216;               // 1 C = 216 Nl/min (p₁abs=6 bar, kritický tok)
      default:      return NaN;
    }
  }

  // Funkce pro převod z Qn (Nl/min)
  function fromQn(unit, qn) {
    switch(unit) {
      case 'Nlmin': return qn;
      case 'm3h':   return qn * 60 / 1000;
      case 'kv':    return qn;
      case 'Kv':    return qn * 60 / 1000;
      case 'Cv':    return qn / 3.78541;
      case 'C':     return qn / 216;
      default:      return NaN;
    }
  }

  const all = ['Nlmin','m3h','kv','Kv','Cv','C'];
  if (all.includes(from) && all.includes(to)) {
    const qn  = toQn(from, val);
    const out = fromQn(to,  qn);
    if (isNaN(out)) {
      resultDiv.textContent = 'Konverze nelze provést.';
    } else {
      resultDiv.textContent = `${out.toFixed(4)} ${to}`;
    }
    return;
  }

  resultDiv.textContent = 'Konverze není definována.';
});
