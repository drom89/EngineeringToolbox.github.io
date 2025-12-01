import { convertUnit } from './lib/converter_calc.js';

const form      = document.getElementById('convForm');
const fromUnit  = document.getElementById('fromUnit');
const toUnit    = document.getElementById('toUnit');
const valueEl   = document.getElementById('value');
const resultDiv = document.getElementById('convResult');

form.addEventListener('submit', e => {
  e.preventDefault();
  const from = fromUnit.value;
  const to   = toUnit.value;
  const val  = parseFloat(valueEl.value);

  try {
      const out = convertUnit(from, to, val);
      resultDiv.textContent = `${out.toFixed(4)} ${to}`;
  } catch (error) {
      resultDiv.textContent = error.message;
  }
});
