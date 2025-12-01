
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

/**
 * Converts a value from one unit to another.
 * @param {string} from - Source unit
 * @param {string} to - Target unit
 * @param {number} val - Value to convert
 * @returns {number} Converted value
 */
export function convertUnit(from, to, val) {
    if (isNaN(val)) {
        throw new Error('Invalid value');
    }

    // Přímý převod bar ↔ psi
    if ((from === 'bar' || from === 'psi') && (to === 'bar' || to === 'psi')) {
        return from === 'bar' ? val * 14.5038 : val / 14.5038;
    }

    // Převod z 'from' na Qn
    if (!(from in toQnFactor)) {
        throw new Error(`Unsupported input unit: ${from}`);
    }
    const qn = val * toQnFactor[from];

    // Převod z Qn na 'to'
    if (!(to in toQnFactor)) {
        throw new Error(`Unsupported output unit: ${to}`);
    }
    return qn / toQnFactor[to];
}
