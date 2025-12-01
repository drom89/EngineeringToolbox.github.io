
import { calculateCylinderRequirements, calculateTubingCheck, recommendValve } from './lib/pneumatic_simulator.js';
import { HistoryManager } from './lib/history_manager.js';

const historyManager = new HistoryManager('pneumatic_simulator_history');

// State to hold data between steps
let currentState = {
    step1: null,
    step2: null
};

document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    const btnStep1 = document.getElementById('btn-calc-step1');
    const btnStep2 = document.getElementById('btn-calc-step2');
    const btnGotoStep3 = document.getElementById('btn-goto-step3');
    const btnStep3 = document.getElementById('btn-calc-step3');
    const btnClearHistory = document.getElementById('clear-history');

    // Step 1: Cylinder Calculation
    btnStep1.addEventListener('click', () => {
        try {
            const force = parseFloat(document.getElementById('force').value);
            const stroke = parseFloat(document.getElementById('stroke').value);
            const speed = parseFloat(document.getElementById('speed').value);
            const pressure = parseFloat(document.getElementById('pressure').value);

            if ([force, stroke, speed, pressure].some(isNaN)) {
                alert("Prosím vyplňte všechna pole v Kroku 1.");
                return;
            }

            const result = calculateCylinderRequirements(force, stroke, speed, pressure);
            currentState.step1 = { ...result, pressure_bar: pressure };

            // Display Results
            document.getElementById('res-min-dia').textContent = result.min_diameter_mm.toFixed(2);
            document.getElementById('res-sel-dia').textContent = result.selected_diameter_mm;
            document.getElementById('res-force').textContent = result.theoretical_force_N.toFixed(0);
            document.getElementById('res-flow').textContent = result.flow_anr_lpm.toFixed(1);

            document.getElementById('result-step1').classList.remove('hidden');

            // Setup Step 2
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('flow-ref-s2').textContent = result.flow_anr_lpm.toFixed(1);

            // Scroll to Step 2
            document.getElementById('step2').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            alert("Chyba: " + error.message);
        }
    });

    // Step 2: Tubing Check
    btnStep2.addEventListener('click', () => {
        if (!currentState.step1) {
            alert("Nejprve dokončete Krok 1.");
            return;
        }

        try {
            const length = parseFloat(document.getElementById('tubing-len').value);
            const diameter = parseFloat(document.getElementById('tubing-id').value);
            const flow = currentState.step1.flow_anr_lpm;
            const pressure = currentState.step1.pressure_bar;

            if (isNaN(length)) {
                alert("Zadejte délku hadice.");
                return;
            }

            const result = calculateTubingCheck(flow, length, diameter, pressure);
            currentState.step2 = result;

            document.getElementById('res-drop-bar').textContent = result.pressure_drop_bar.toFixed(3);
            document.getElementById('res-drop-perc').textContent = result.pressure_drop_percent.toFixed(1);

            const warningBox = document.getElementById('tubing-warning');
            const btnNext = document.getElementById('btn-goto-step3');

            if (result.is_exceeded) {
                warningBox.classList.remove('hidden');
                // Optional: Disable next step if critical?
                // The prompt says "warn user", implies soft block or just warning.
                // We'll allow proceeding but with warning visible.
            } else {
                warningBox.classList.add('hidden');
            }

            document.getElementById('result-step2').classList.remove('hidden');
            btnNext.classList.remove('hidden');

        } catch (error) {
            alert("Chyba: " + error.message);
        }
    });

    // Go to Step 3
    btnGotoStep3.addEventListener('click', () => {
        if (!currentState.step1) return;

        document.getElementById('step3').classList.remove('hidden');
        document.getElementById('flow-ref-s3').textContent = currentState.step1.flow_anr_lpm.toFixed(1);
        document.getElementById('step3').scrollIntoView({ behavior: 'smooth' });
    });

    // Step 3: Valve Recommendation
    btnStep3.addEventListener('click', () => {
        if (!currentState.step1) return;

        try {
            const flow = currentState.step1.flow_anr_lpm;
            const func = document.getElementById('valve-func').value;
            const volt = document.getElementById('valve-volt').value;

            const result = recommendValve(flow, func, volt);

            const resultBox = document.getElementById('result-step3');
            const errorBox = document.getElementById('valve-error');

            if (result.recommended) {
                document.getElementById('res-valve-series').textContent = result.series;
                document.getElementById('res-valve-model').textContent = result.model_details;
                document.getElementById('res-valve-spec').textContent = result.spec;

                resultBox.classList.remove('hidden');
                errorBox.classList.add('hidden');

                // Add to History
                addToHistory(currentState, result);

            } else {
                resultBox.classList.add('hidden');
                errorBox.textContent = result.message;
                errorBox.classList.remove('hidden');
            }

        } catch (error) {
            alert("Chyba: " + error.message);
        }
    });

    // History Handling
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            historyManager.clearHistory();
            renderHistory();
        });
    }

    renderHistory();
});

function addToHistory(state, valveResult) {
    const item = {
        timestamp: new Date().toISOString(),
        summary: `Válec D${state.step1.selected_diameter_mm}, Q=${state.step1.flow_anr_lpm.toFixed(1)} L/min -> ${valveResult.series}`
    };
    historyManager.addEntry(item);
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    if (list) {
        list.innerHTML = '';
        historyManager.getHistory().forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${new Date(entry.timestamp).toLocaleTimeString()} - ${entry.summary}`;
            list.appendChild(li);
        });
    }
}
