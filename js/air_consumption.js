import { calculateAirConsumption } from './lib/air_consumption_calc.js';
import { HistoryManager } from './lib/history_manager.js';

const form = document.getElementById('airConsForm');
const diameterInput = document.getElementById('diameter');
const strokeInput = document.getElementById('stroke');
const cyclesInput = document.getElementById('cycles');
const pressureInput = document.getElementById('pressure');
const resultDiv = document.getElementById('result');

const historyManager = new HistoryManager('air_consumption_history', 'history-container');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const diameter = parseFloat(diameterInput.value);
  const stroke = parseFloat(strokeInput.value);
  const cycles = parseFloat(cyclesInput.value);
  const pressure = parseFloat(pressureInput.value);

  if (isNaN(diameter) || isNaN(stroke) || isNaN(cycles) || isNaN(pressure)) {
    resultDiv.textContent = 'Zadejte prosím platná čísla.';
    return;
  }

  try {
    const q_nl_min = calculateAirConsumption(diameter, stroke, cycles, pressure);

    resultDiv.innerHTML = `Spotřeba vzduchu: <strong>${q_nl_min.toFixed(2)} Nl/min</strong>`;

    historyManager.addEntry(
      `D: ${diameter}mm, L: ${stroke}mm, n: ${cycles}/min, P: ${pressure}MPa<br>` +
      `-> <strong>${q_nl_min.toFixed(2)} Nl/min</strong>`
    );

  } catch (error) {
    resultDiv.textContent = `Chyba: ${error.message}`;
  }
});
