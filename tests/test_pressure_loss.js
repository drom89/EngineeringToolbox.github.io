import { calculatePressureLoss } from '../js/lib/pressure_loss_calc.js';
import assert from 'assert';

console.log('Testing Pressure Loss Calculator...');

// Test 1: Simple calculation
// flow = 100 Nl/min
// id = 10mm
// L = 10m
// p1 = 6 bar
// p2 = 5 bar
// fMethod = const
//
// Q calculation:
// p1PaNorm = 600000 Pa (since input is 6 bar)
// Q = (100 / 60000) * (1e5 / 600000) = (1/600) * (1/6) = 1/3600 m3/s = 0.00027777 m3/s
//
// D = 0.01 m
// p1Pa = 600000
// A = PI * 0.01^2 / 4 = 7.85398e-5
// V = (1/3600) / 7.85398e-5 = 3.53677 m/s
// rho = 1.225 * (600000 / 101325) = 7.25389
//
// f = 0.02
// loss = 0.02 * (10 / 0.01) * (7.25389 * 3.53677^2 / 2)
// loss = 20 * (7.25389 * 12.5087 / 2) = 20 * 45.367 = 907.34 Pa

const result1 = calculatePressureLoss(100, 'Nlmin', 10, 10, 6, 'bar', 5, 'bar', 'const');

console.log(`Test 1: Loss=${result1.loss_Pa.toFixed(2)} Pa`);
assert(Math.abs(result1.loss_Pa - 907.34) < 1, `Test 1 failed: ${result1.loss_Pa}`);

// Test 2: Blasius method
// Re = V * D / nu
// Re = 3.53677 * 0.01 / 1.5e-5 = 0.0353677 / 0.000015 = 2357.85
// f = 0.079 / (2357.85^0.25)
// 2357.85^0.25 = 6.968
// f = 0.079 / 6.968 = 0.01133
//
// loss = 0.01133 * 1000 * (7.25389 * 12.5087 / 2)
// loss = 11.33 * 45.367 = 514.00 Pa

const result2 = calculatePressureLoss(100, 'Nlmin', 10, 10, 6, 'bar', 5, 'bar', 'blasius');
console.log(`Test 2 (Blasius): Loss=${result2.loss_Pa.toFixed(2)} Pa, f=${result2.f}`);
// Allow some variance
assert(Math.abs(result2.loss_Pa - 514.00) < 1, `Test 2 failed: ${result2.loss_Pa}`);

console.log('All Pressure Loss tests passed!');
