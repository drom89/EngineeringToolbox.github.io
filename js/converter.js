// js/converter.js
const form      = document.getElementById('convForm');
const fromUnit  = document.getElementById('fromUnit');
const toUnit    = document.getElementById('toUnit');
const valueEl   = document.getElementById('value');
const resultDiv = document.getElementById('convResult');

// Přepočet na Qn (Nl/min)
const toQnFactor = {
  Nlmin: 1,             // Qn → Qn
  m3h:   1000/60,        // m³/h → L/min → Qn
  kv:    68.65,          // 1 L/min vody @Δp = 1 bar → Qn
  Kv:    (1000/60)*68.65,// 1 m³/h vody @Δp = 1 bar → Qn
  Cv:    981.5,          // 1 US gal/min @Δp = 1 psi → Qn
  f:     1184.6,         // 1 imp. gal/min @Δp = 1 psi → Qn
  C:     216,            // C = l/(s·bar) při p₁=6 bar → Qn
  S:     54.53           // mm² → Qn (empirický faktor)
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const from = fromUnit.value;
  const to   = toUnit.value;
  const val  = parseFloat(valueEl.value);
  if (isNaN(val)) {
    resultDiv.textContent = 'Zadejte platnou hodnotu.';
    return;
  }

  // Přímý převod bar ↔ psi
  if ((from === 'bar' || from === 'psi') && (to === 'bar' || to === 'psi')) {
    const out = from === 'bar' ? val * 14.5038 : val / 14.5038;
    resultDiv.textContent = `${out.toFixed(4)} ${to}`;
    return;
  }

  // Převod z 'from' na Qn
  if (!(from in toQnFactor)) {
    resultDiv.textContent = `Nepodporovaná vstupní jednotka: ${from}`;
    return;
  }
  const qn = val * toQnFactor[from];

  // Převod z Qn na 'to'
  if (!(to in toQnFactor)) {
    resultDiv.textContent = `Nepodporovaná výstupní jednotka: ${to}`;
    return;
  }
  const out = qn / toQnFactor[to];
  resultDiv.textContent = `${out.toFixed(4)} ${to}`;
});
