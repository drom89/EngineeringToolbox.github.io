import { calculateCylinderForces } from '../js/lib/cylinders_calc.js';
import assert from 'assert';

console.log('Testing Cylinders Calculator...');

// Test 1: Simple calculation
// dp = 100mm = 0.1m
// dr = 20mm = 0.02m
// p = 6 bar = 6e5 Pa
// Ap = PI * 0.1^2 / 4 = 0.00785398
// Ar = PI * 0.02^2 / 4 = 0.000314159
// Fp = 6e5 * 0.00785398 = 4712.388
// Fr = 6e5 * (0.00785398 - 0.000314159) = 6e5 * 0.0075398 = 4523.89
const { Fp, Fr } = calculateCylinderForces(100, 20, 6, 'bar');

console.log(`Test 1: Fp=${Fp.toFixed(2)}, Fr=${Fr.toFixed(2)}`);
assert(Math.abs(Fp - 4712.39) < 0.1, `Test 1 Fp failed: ${Fp}`);
assert(Math.abs(Fr - 4523.89) < 0.1, `Test 1 Fr failed: ${Fr}`);

// Test 2: Invalid inputs
try {
    calculateCylinderForces(10, 20, 6, 'bar');
    console.error('Test 2 failed: Should have thrown error for rod > piston');
    process.exit(1);
} catch (e) {
     console.log('Test 2 passed: Error handled correctly.');
}

console.log('All Cylinders tests passed!');
