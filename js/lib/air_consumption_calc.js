/**
 * Calculates air consumption for a double-acting cylinder.
 *
 * Formula: Qn = 2 * Area * Stroke * Cycles * (P_abs / P_atm)
 *
 * @param {number} diameter_mm - Piston diameter in mm.
 * @param {number} stroke_mm - Stroke length in mm.
 * @param {number} cycles_per_min - Number of cycles per minute.
 * @param {number} pressure_MPa - Operating pressure (gauge) in MPa.
 * @returns {number} Air consumption in Normal Liters per minute (Nl/min).
 */
export function calculateAirConsumption(diameter_mm, stroke_mm, cycles_per_min, pressure_MPa) {
  if (diameter_mm <= 0 || stroke_mm <= 0 || cycles_per_min < 0 || pressure_MPa < 0) {
    throw new Error("Invalid input: dimensions and cycles must be positive, pressure non-negative.");
  }

  // Constants
  const P_atm_MPa = 0.101325; // Standard atmosphere

  // Area calculation (mm^2)
  const radius = diameter_mm / 2;
  const area_mm2 = Math.PI * radius * radius;

  // Geometric volume per cycle (Extension + Retraction)
  // We assume double acting, ignoring rod diameter for estimation (conservative)
  // V_cycle = 2 * Area * Stroke
  const volume_cycle_mm3 = 2 * area_mm2 * stroke_mm;

  // Total Geometric Volume per minute (mm^3/min)
  const volume_geom_min_mm3 = volume_cycle_mm3 * cycles_per_min;

  // Convert to Liters (1 Liter = 1,000,000 mm^3)
  const volume_geom_min_L = volume_geom_min_mm3 / 1e6;

  // Convert to Normal Liters (apply compression ratio)
  // Compression Ratio = P_abs / P_atm
  // P_abs = P_gauge + P_atm
  const compression_ratio = (pressure_MPa + P_atm_MPa) / P_atm_MPa;

  const Q_nl_min = volume_geom_min_L * compression_ratio;

  return Q_nl_min;
}
