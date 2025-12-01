
import { calculatePressureLoss } from './pressure_loss_calc.js';

// Standard ISO Cylinder Diameters (mm)
const STANDARD_DIAMETERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 140, 160, 200];

// SMC SY Valve Series Data (Approximate max flow capabilities in L/min ANR for selection)
const VALVE_DATA = [
    { series: 'SY3000', max_flow: 350, cv: 0.35, connection: 'M5/1/8"' },
    { series: 'SY5000', max_flow: 800, cv: 0.8, connection: '1/8"/1/4"' },
    { series: 'SY7000', max_flow: 1500, cv: 1.5, connection: '1/4"/3/8"' },
    { series: 'SY9000', max_flow: 2800, cv: 2.8, connection: '3/8"/1/2"' }
];

/**
 * Step 1: Calculate Cylinder Dimensions
 * @param {number} required_force_N - Required force in Newtons
 * @param {number} stroke_mm - Stroke length in mm
 * @param {number} speed_mm_s - Required speed in mm/s
 * @param {number} pressure_bar - Operating pressure in bar
 * @returns {object} Result containing diameter, flow rates, and theoretical force
 */
export function calculateCylinderRequirements(required_force_N, stroke_mm, speed_mm_s, pressure_bar) {
    if ([required_force_N, stroke_mm, speed_mm_s, pressure_bar].some(v => v <= 0)) {
        throw new Error("All inputs must be positive numbers.");
    }

    // 1. Calculate Minimum Piston Area required
    // F = P * A => A = F / P
    // P in Pascals = bar * 100000
    const pressure_Pa = pressure_bar * 100000;

    // Theoretical Area (m^2) = Force (N) / Pressure (Pa)
    const min_area_m2 = required_force_N / pressure_Pa;
    const min_area_mm2 = min_area_m2 * 1e6;

    // 2. Find nearest standard diameter
    // Area = PI * (D/2)^2 => D = sqrt(4 * Area / PI)
    const min_diameter_mm = Math.sqrt((4 * min_area_mm2) / Math.PI);

    const selected_diameter = STANDARD_DIAMETERS.find(d => d >= min_diameter_mm);

    if (!selected_diameter) {
        throw new Error("Required force exceeds capacity of standard cylinders (up to 200mm).");
    }

    // 3. Calculate Actual Force and Flow for selected cylinder
    const actual_area_mm2 = (Math.PI * Math.pow(selected_diameter, 2)) / 4;
    const actual_area_m2 = actual_area_mm2 / 1e6;
    const theoretical_force = pressure_Pa * actual_area_m2;

    // 4. Calculate Flow
    // Speed in m/s
    const speed_m_s = speed_mm_s / 1000;

    // Compressed Flow (m^3/s) = Area (m^2) * Speed (m/s)
    const q_compressed_m3s = actual_area_m2 * speed_m_s;
    const q_compressed_lpm = q_compressed_m3s * 60000; // L/min (compressed)

    // ANR Flow (Free Air)
    // Q_anr = Q_comp * (P_abs / P_atm)
    const p_atm = 1.013;
    const p_abs = pressure_bar + p_atm;
    const q_anr_lpm = q_compressed_lpm * (p_abs / p_atm);

    return {
        min_diameter_mm: min_diameter_mm,
        selected_diameter_mm: selected_diameter,
        theoretical_force_N: theoretical_force,
        flow_compressed_lpm: q_compressed_lpm,
        flow_anr_lpm: q_anr_lpm,
        load_ratio: required_force_N / theoretical_force // useful for validation
    };
}

/**
 * Step 2: Calculate Tubing Pressure Loss
 * @param {number} flow_anr_lpm - Flow in L/min (ANR)
 * @param {number} length_m - Tubing length in meters
 * @param {number} diameter_mm - Tubing Inner Diameter in mm
 * @param {number} inlet_pressure_bar - Inlet pressure (gauge) in bar
 * @returns {object} Pressure drop and warning status
 */
export function calculateTubingCheck(flow_anr_lpm, length_m, diameter_mm, inlet_pressure_bar) {
    if ([flow_anr_lpm, length_m, diameter_mm, inlet_pressure_bar].some(v => v <= 0)) {
        throw new Error("All inputs must be positive.");
    }

    // Adapt to calculatePressureLoss(flow_val, flowUnit, id_mm, L_m, p1_val, p1Unit, p2_val, p2Unit, fMethod)
    // We don't have p2, but the function returns loss_Pa independent of p2 if we ignore nominal.
    // However, it uses p1 to determine density.
    // flowUnit: 'Nlmin' (Standard liters) vs 'lmin' (Actual liters).
    // calculateCylinderRequirements returns `flow_anr_lpm` which is roughly Nlmin (Standard conditions).
    // So we pass 'Nlmin'.

    const lossResult = calculatePressureLoss(
        flow_anr_lpm,
        'Nlmin',
        diameter_mm,
        length_m,
        inlet_pressure_bar,
        'bar',
        0, // P2 irrelevant for loss calculation itself in that function?
        'bar',
        'blasius' // Use Blasius for smooth pipes
    );

    const drop_bar = lossResult.loss_Pa / 100000; // Pa to bar

    const limit = inlet_pressure_bar * 0.10; // 10% tolerance
    const warning = drop_bar > limit;

    return {
        pressure_drop_bar: drop_bar,
        pressure_drop_percent: (drop_bar / inlet_pressure_bar) * 100,
        limit_bar: limit,
        is_exceeded: warning
    };
}

/**
 * Step 3: Recommend Valve
 * @param {number} flow_anr_lpm - Required flow in L/min (ANR)
 * @param {string} function_type - e.g., "5/2", "5/3"
 * @param {string} voltage - e.g., "24V DC"
 * @returns {object} Recommended valve details
 */
export function recommendValve(flow_anr_lpm, function_type, voltage) {
    const safety_factor = 1.2;
    const target_flow = flow_anr_lpm * safety_factor;

    const recommended = VALVE_DATA.find(v => v.max_flow >= target_flow);

    if (!recommended) {
        return {
            recommended: false,
            message: "Požadovaný průtok překračuje kapacity standardní řady SY (SMC)."
        };
    }

    return {
        recommended: true,
        series: recommended.series,
        model_details: `SMC ${recommended.series} (${function_type}, ${voltage})`,
        spec: `Cv: ${recommended.cv}, Porty: ${recommended.connection}`,
        max_flow: recommended.max_flow
    };
}
