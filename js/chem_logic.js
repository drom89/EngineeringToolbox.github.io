import { COMPATIBILITY_DATA } from './chem_data_full.js';

const materialSelect = document.getElementById('materialSelect');
const chemicalSelect = document.getElementById('chemicalSelect');
const resultDisplay = document.getElementById('resultDisplay');
const ratingCode = document.getElementById('ratingCode');
const ratingText = document.getElementById('ratingText');

// Populate Dropdowns
function populateDropdowns() {
    // Get Materials (Keys of the main object)
    const materials = Object.keys(COMPATIBILITY_DATA).sort();

    // Get Chemicals (Keys of the first material object - assuming all have same chemicals)
    // If not consistent, we might need to collect all unique chemicals, but our generator ensures consistency.
    const firstMat = materials[0];
    const chemicals = Object.keys(COMPATIBILITY_DATA[firstMat]).sort();

    materials.forEach(mat => {
        const option = document.createElement('option');
        option.value = mat;
        option.textContent = mat;
        materialSelect.appendChild(option);
    });

    chemicals.forEach(chem => {
        const option = document.createElement('option');
        option.value = chem;
        option.textContent = chem;
        chemicalSelect.appendChild(option);
    });
}

function updateResult() {
    const mat = materialSelect.value;
    const chem = chemicalSelect.value;

    if (!mat || !chem) {
        resultDisplay.style.display = 'none';
        return;
    }

    const rating = COMPATIBILITY_DATA[mat][chem];

    resultDisplay.className = 'chem-result'; // Reset classes
    resultDisplay.classList.add(`rating-${rating}`);
    resultDisplay.style.display = 'block';

    ratingCode.textContent = `Hodnocení: ${rating}`;

    let text = "";
    switch (rating) {
        case 'A': text = "Výborná kompatibilita. Materiál je odolný."; break;
        case 'B': text = "Dobrá kompatibilita. Menší vliv, ale obecně použitelné."; break;
        case 'C': text = "Omezená kompatibilita. Vhodné pouze pro krátkodobé použití nebo specifické podmínky."; break;
        case 'D': text = "Nevhodné. Materiál bude chemikálií poškozen."; break;
    }
    ratingText.textContent = text;
}

// Initialize
populateDropdowns();

// Event Listeners
materialSelect.addEventListener('change', updateResult);
chemicalSelect.addEventListener('change', updateResult);
