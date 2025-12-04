import { COMPATIBILITY_DATA } from './chem_data_full.js';

const materialSelect = document.getElementById('materialSelect');
const chemicalSelect = document.getElementById('chemicalSelect');
const resultDisplay = document.getElementById('resultDisplay');
const ratingCode = document.getElementById('ratingCode');
const ratingText = document.getElementById('ratingText');

const MATERIAL_NAMES_CS = {
    "Carbon Steel": "Uhlíková ocel",
    "Steel 1018": "Ocel 1018",
    "Cast Iron": "Litina",
    "Stainless Steel 304": "Nerezová ocel 304",
    "Stainless Steel 304L": "Nerezová ocel 304L",
    "Stainless Steel 316": "Nerezová ocel 316",
    "Stainless Steel 316L": "Nerezová ocel 316L",
    "Stainless Steel 904L": "Nerezová ocel 904L",
    "Aluminum 1100": "Hliník 1100",
    "Aluminum 6061": "Hliník 6061",
    "Aluminum 7075": "Hliník 7075",
    "Brass": "Mosaz",
    "Naval Brass": "Námořní mosaz",
    "Admiralty Brass": "Admirálská mosaz",
    "Viton A": "Viton A (FKM)",
    "Viton B": "Viton B (FKM)",
    "Viton GF": "Viton GF (FKM)",
    "Viton Extreme": "Viton Extreme (FKM)",
    "Nitrile (Buna-N)": "Nitril (Buna-N)",
    "Hydrogenated Nitrile (HNBR)": "Hydrogenovaný Nitril (HNBR)",
    "EPDM (Peroxide Cured)": "EPDM (Peroxidicky vulkanizovaný)",
    "EPDM (Sulfur Cured)": "EPDM (Sirně vulkanizovaný)",
    "PVC Type 1": "PVC Typ 1",
    "PVC Type 2": "PVC Typ 2",
    "CPVC": "CPVC",
    "Polypropylene (Homopolymer)": "Polypropylen (Homopolymer)",
    "Polypropylene (Copolymer)": "Polypropylen (Kopolymer)",
    "LDPE": "LDPE (Nízkohustotní PE)",
    "HDPE": "HDPE (Vysokohustotní PE)",
    "UHMWPE": "UHMWPE (Ultra-vysokomolekulární PE)",
    "XLPE": "XLPE (Síťovaný PE)",
    "PTFE (Virgin)": "PTFE (Čistý)",
    "PTFE (Glass Filled)": "PTFE (Plněný sklem)",
    "PTFE (Carbon Filled)": "PTFE (Plněný uhlíkem)",
    "Nylon 6": "Nylon 6",
    "Nylon 6/6": "Nylon 6/6",
    "Nylon 11": "Nylon 11",
    "Nylon 12": "Nylon 12",
    "PVDF (Homopolymer)": "PVDF (Homopolymer)",
    "PVDF (Copolymer)": "PVDF (Kopolymer)",
    "Acetal (Homopolymer)": "Acetal (Homopolymer)",
    "Acetal (Copolymer)": "Acetal (Kopolymer)",
    "PEEK (Virgin)": "PEEK (Čistý)",
    "PEEK (Glass Filled)": "PEEK (Plněný sklem)",
    "PEEK (Carbon Filled)": "PEEK (Plněný uhlíkem)",
    "Silicone (General Purpose)": "Silikon (Obecný)",
    "Silicone (Fluorosilicone)": "Fluorosilikon",
    "Silicone (Platinum Cured)": "Silikon (Platinou vulkanizovaný)",
    "Neoprene": "Neopren",
    "Hypalon (CSM)": "Hypalon (CSM)",
    "Kalrez 4079": "Kalrez 4079",
    "Kalrez 6375": "Kalrez 6375",
    "Kalrez 7075": "Kalrez 7075",
    "Chemraz 505": "Chemraz 505",
    "Chemraz 510": "Chemraz 510",
    "Titanium Grade 2": "Titan Grade 2",
    "Titanium Grade 5": "Titan Grade 5",
    "Hastelloy C-276": "Hastelloy C-276",
    "Hastelloy B-3": "Hastelloy B-3",
    "Hastelloy C-22": "Hastelloy C-22",
    "Monel 400": "Monel 400",
    "Monel K-500": "Monel K-500",
    "Inconel 600": "Inconel 600",
    "Inconel 625": "Inconel 625",
    "Inconel 718": "Inconel 718",
    "Bronze": "Bronz",
    "Aluminum Bronze": "Hliníkový bronz",
    "Phosphor Bronze": "Fosforový bronz",
    "Copper": "Měď",
    "Tantalum": "Tantal",
    "Zirconium": "Zirkonium",
    "Nickel 200": "Nikl 200",
    "Nickel 201": "Nikl 201",
    "Natural Rubber (Gum)": "Přírodní kaučuk (Gum)",
    "Natural Rubber (Black)": "Přírodní kaučuk (Černý)",
    "Polyurethane (Ether Based)": "Polyuretan (Ether)",
    "Polyurethane (Ester Based)": "Polyuretan (Ester)",
    "ABS": "ABS",
    "Polycarbonate": "Polykarbonát",
    "Acrylic": "Akrylát (PMMA)",
    "PET": "PET",
    "Polyurethane (Ether)": "Polyuretan (Ether)",
    "Polyurethane (Ester)": "Polyuretan (Ester)",
    "Borosilicate Glass": "Borosilikátové sklo",
    "Soda Lime Glass": "Sodno-vápenaté sklo",
    "Alumina 99.5%": "Korund (Alumina) 99.5%",
    "Zirconia": "Zirkonoxid",
    "Graphite": "Grafit",
    "Concrete": "Beton",
    "Wood": "Dřevo",
    "Epoxy": "Epoxid",
    "Fiberglass (Polyester Resin)": "Sklolaminát (Polyester)",
    "Fiberglass (Vinyl Ester Resin)": "Sklolaminát (Vinyl Ester)",
    "Fiberglass (Epoxy Resin)": "Sklolaminát (Epoxid)"
};

// Populate Dropdowns
function populateDropdowns() {
    // Get Materials (Keys of the main object)
    const materials = Object.keys(COMPATIBILITY_DATA).sort();

    // Get Chemicals (Keys of the first material object - assuming all have same chemicals)
    const firstMat = materials[0];
    const chemicals = Object.keys(COMPATIBILITY_DATA[firstMat]).sort();

    materials.forEach(mat => {
        const option = document.createElement('option');
        option.value = mat;
        // Use Czech name if available, otherwise original
        option.textContent = MATERIAL_NAMES_CS[mat] || mat;
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
