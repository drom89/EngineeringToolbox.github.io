import { convertUnit } from './lib/converter_calc.js';
import { HistoryManager } from './lib/history_manager.js';

const form      = document.getElementById('convForm');
const fromUnit  = document.getElementById('fromUnit');
const toUnit    = document.getElementById('toUnit');
const valueEl   = document.getElementById('value');
const resultDiv = document.getElementById('convResult');

const historyManager = new HistoryManager('converter_history', 'history-container');

form.addEventListener('submit', e => {
  e.preventDefault();
  const from = fromUnit.value;
  const to   = toUnit.value;
  const val  = parseFloat(valueEl.value);

  try {
      const out = convertUnit(from, to, val);
      const resultText = `${out.toFixed(4)} ${to}`;
      resultDiv.textContent = resultText;

      // Add to history
      historyManager.addEntry(`${val} ${from} -> <strong>${resultText}</strong>`);

  } catch (error) {
      resultDiv.textContent = error.message;
  }
});
