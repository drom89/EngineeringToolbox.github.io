/**
 * Calculates cylinder forces.
 * @param {number} dp_mm - Piston diameter in mm
 * @param {number} dr_mm - Rod diameter in mm
 * @param {number} pressure_val - Pressure value
 * @param {string} unitP - Pressure unit ('bar' or 'psi')
 * @returns {object} Object containing { Fp_N, Fr_N } (Push force, Pull force in Newtons)
 */
export function calculateCylinderForces(dp_mm, dr_mm, pressure_val, unitP) {
    if ([dp_mm, dr_mm, pressure_val].some(v => isNaN(v) || v <= 0)) {
        throw new Error('Invalid input values');
    }
    if (dr_mm >= dp_mm) {
         throw new Error('Rod diameter must be smaller than piston diameter');
    }

    // tlak na Pa
    const pPa = unitP === 'bar'
        ? pressure_val * 1e5
        : pressure_val * 6894.76;

    // plochy v m²
    const Ap = Math.PI * (dp_mm / 1000) ** 2 / 4;
    const Ar = Math.PI * (dr_mm / 1000) ** 2 / 4;

    // síly
    const Fp = pPa * Ap;
    const Fr = pPa * (Ap - Ar);

    return { Fp: Fp, Fr: Fr };
}
