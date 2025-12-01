import { calculateAirflow } from '../js/lib/airflow_calc.js';
import assert from 'assert';

console.log('Testing Airflow Calculator...');

// Test case 1: Known values
// ID=10mm, L=10m, dp=0.1MPa, p1=0.6MPa
// Based on formula:
// p1_pa = 600000
// dp_pa = 100000
// rho = 1.225 * (600000 / 101325) ≈ 7.2538
// f = 0.02
// D = 0.01
// L/D = 1000
// V = sqrt(200000 / (7.2538 * 0.02 * 1000)) = sqrt(200000 / 145.076) = sqrt(1378.58) ≈ 37.13 m/s
// A = PI * 0.01^2 / 4 ≈ 0.00007854
// Qact = 0.00007854 * 37.13 ≈ 0.002916 m3/s
// Qstd = 0.002916 * (600000 / 101325) ≈ 0.01726
// Qnlmin = 0.01726 * 60000 ≈ 1035.8

const result1 = calculateAirflow(10, 10, 0.1, 0.6);
console.log(`Test 1 (10mm, 10m, 0.1MPa): ${result1.toFixed(2)} Nl/min`);
// Allow some floating point variance, checking range
assert(result1 > 1030 && result1 < 1040, `Test 1 failed: ${result1}`);

// Test case 2: Error handling
try {
    calculateAirflow(-1, 10, 0.1);
    console.error('Test 2 failed: Should have thrown error for negative ID');
    process.exit(1);
} catch (e) {
    console.log('Test 2 passed: Error handled correctly.');
}

console.log('All Airflow tests passed!');
