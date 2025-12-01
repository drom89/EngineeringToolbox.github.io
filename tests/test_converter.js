import { convertUnit } from '../js/lib/converter_calc.js';
import assert from 'assert';

console.log('Testing Converter Calculator...');

// Test 1: bar to psi
const res1 = convertUnit('bar', 'psi', 1);
assert(Math.abs(res1 - 14.5038) < 0.0001, `Test 1 failed: ${res1}`);

// Test 2: psi to bar
const res2 = convertUnit('psi', 'bar', 14.5038);
assert(Math.abs(res2 - 1) < 0.0001, `Test 2 failed: ${res2}`);

// Test 3: m3h to Nlmin
// 1 m3/h = 1000 l/h = 1000/60 l/min
const res3 = convertUnit('m3h', 'Nlmin', 1);
assert(Math.abs(res3 - (1000/60)) < 0.0001, `Test 3 failed: ${res3}`);

// Test 4: kv to Kv
// 1 kv = 68.65 Qn
// 1 Kv = (1000/60)*68.65 Qn
// 1 Kv = (1000/60) kv
// So 1 kv should be 60/1000 Kv = 0.06 Kv
const res4 = convertUnit('kv', 'Kv', 1);
// kv -> Qn: 68.65
// Qn -> Kv: 68.65 / ((1000/60)*68.65) = 1 / (1000/60) = 60/1000 = 0.06
assert(Math.abs(res4 - 0.06) < 0.0001, `Test 4 failed: ${res4}`);

console.log('All Converter tests passed!');
