
import { strict as assert } from 'assert';
import { calculateCylinderRequirements, calculateTubingCheck, recommendValve } from '../js/lib/pneumatic_simulator.js';

console.log("Starting Pneumatic Simulator Tests...");

// --- Test 1: Cylinder Calculation ---
console.log("Test 1: Cylinder Calculation");
try {
    // Inputs: Force 500N, Stroke 100mm, Speed 200mm/s, Pressure 6 bar
    // Theoretical Area = 500 / (6 * 10^5) = 500 / 600000 = 0.000833 m^2 = 833 mm^2
    // Diameter = sqrt(4 * 833 / PI) = 32.57 mm
    // Nearest standard should be 40mm
    const cylResult = calculateCylinderRequirements(500, 100, 200, 6);

    assert.ok(cylResult.selected_diameter_mm >= 32.57, "Diameter should be sufficient");
    assert.equal(cylResult.selected_diameter_mm, 40, "Should select 40mm standard cylinder");
    assert.ok(cylResult.flow_anr_lpm > 0, "Flow ANR should be positive");

    console.log("  Cylinder selection OK: Selected " + cylResult.selected_diameter_mm + "mm");
} catch (e) {
    console.error("  Test 1 Failed:", e);
    process.exit(1);
}

// --- Test 2: Tubing Calculation ---
console.log("Test 2: Tubing Calculation");
try {
    // Flow 500 L/min, Length 10m, ID 8mm, P 6 bar
    const tubingResult = calculateTubingCheck(500, 10, 8, 6);

    assert.ok(typeof tubingResult.pressure_drop_bar === 'number', "Pressure drop should be a number");
    assert.ok(tubingResult.pressure_drop_bar > 0, "Pressure drop should be positive");

    // Check warning logic
    // If we use a tiny tube, drop should be huge and warn
    const badTube = calculateTubingCheck(1000, 20, 4, 6);
    assert.equal(badTube.is_exceeded, true, "Should warn for excessive pressure drop");

    console.log("  Tubing Check OK");
} catch (e) {
    console.error("  Test 2 Failed:", e);
    process.exit(1);
}

// --- Test 3: Valve Recommendation ---
console.log("Test 3: Valve Recommendation");
try {
    // Flow 200 L/min -> Should fit SY3000 (max 350)
    const valve1 = recommendValve(200, "5/2", "24V");
    assert.equal(valve1.series, 'SY3000', "Should recommend SY3000 for low flow");

    // Flow 600 L/min -> Should fit SY5000 (max 800)
    const valve2 = recommendValve(600, "5/2", "24V");
    assert.equal(valve2.series, 'SY5000', "Should recommend SY5000 for medium flow");

    // Huge flow
    const valveHuge = recommendValve(5000, "5/2", "24V");
    assert.equal(valveHuge.recommended, false, "Should fail for huge flow");

    console.log("  Valve Recommendation OK");
} catch (e) {
    console.error("  Test 3 Failed:", e);
    process.exit(1);
}

console.log("All Pneumatic Simulator tests passed!");
