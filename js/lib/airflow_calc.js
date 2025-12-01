/**
 * Calculates airflow based on pressure drop, length, and diameter.
 * @param {number} id_mm - Inner diameter in mm
 * @param {number} L_m - Length in meters
 * @param {number} dp_MPa - Pressure drop in MPa
 * @param {number} p1_MPa - Inlet pressure in MPa (default 0.6)
 * @returns {number} Flow rate in Nl/min
 */
export function calculateAirflow(id_mm, L_m, dp_MPa, p1_MPa = 0.6) {
  if (id_mm <= 0 || L_m <= 0 || dp_MPa <= 0) {
    throw new Error("Invalid input: dimensions and pressure drop must be positive.");
  }

  const D = id_mm / 1000;
  const p1_pa = p1_MPa * 1e6;
  const dp_pa = dp_MPa * 1e6;
  const rho0 = 1.225;
  const rho = rho0 * (p1_pa / 101325);
  const f = 0.02;

  const V = Math.sqrt((2 * dp_pa) / (rho * f * (L_m / D)));
  const A = (Math.PI * D * D) / 4;
  const Qact = A * V;
  const Qstd = Qact * (p1_pa / 101325);
  const Qnlmin = Qstd * 1000 * 60;

  return Qnlmin;
}
