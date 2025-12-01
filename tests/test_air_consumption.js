import { strict as assert } from 'assert';
import { calculateAirConsumption } from '../js/lib/air_consumption_calc.js';

console.log('Running tests for Air Consumption Calculator...');

// Test 1: Simple calculation check
// D=100mm, L=100mm, n=10, P=0.5MPa
// Area = PI * 50^2 = 7853.98 mm^2
// Vol/Cycle = 2 * 7853.98 * 100 = 1,570,796 mm^3
// Vol/Min = 1,570,796 * 10 = 15,707,960 mm^3 = 15.70796 L/min (geom)
// CR = (0.5 + 0.101325) / 0.101325 = 0.601325 / 0.101325 approx 5.9346
// Qn = 15.70796 * 5.9346 approx 93.22 Nl/min
try {
    const q = calculateAirConsumption(100, 100, 10, 0.5);
    // Manual calc:
    // A = PI*2500 = 7853.9816
    // V_cyc = 2 * 7853.9816 * 100 = 1570796.32
    // V_min_L = 15.7079632
    // P_atm = 0.101325
    // CR = 0.601325 / 0.101325 = 5.934616
    // Q = 15.7079632 * 5.934616 = 93.2207

    assert.ok(q > 93.2 && q < 93.3, `Expected approx 93.22, got ${q}`);
    console.log('Test 1 Passed');
} catch (e) {
    console.error('Test 1 Failed:', e);
    process.exit(1);
}

// Test 2: Zero pressure (atmospheric)
// Should result in geometric volume as Normal volume?
// CR = (0 + 0.101325) / 0.101325 = 1
try {
    const q = calculateAirConsumption(10, 100, 100, 0); // small cylinder
    // A = PI*25 = 78.5398
    // V_cyc = 2 * 78.5398 * 100 = 15707.96 mm3
    // V_min_geo = 1570796 mm3 = 1.570796 L
    // Q = 1.570796 * 1
    assert.ok(Math.abs(q - 1.570796) < 0.0001, `Expected approx 1.570796, got ${q}`);
    console.log('Test 2 Passed');
} catch (e) {
    console.error('Test 2 Failed:', e);
    process.exit(1);
}

// Test 3: Invalid Inputs
try {
    calculateAirConsumption(-10, 100, 10, 0.5);
    console.error('Test 3 Failed: Should have thrown error for negative diameter');
    process.exit(1);
} catch (e) {
    console.log('Test 3 Passed');
}

console.log('All tests passed.');
