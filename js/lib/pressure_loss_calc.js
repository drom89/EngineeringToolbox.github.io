/**
 * Calculates pressure loss.
 * @param {number} flow_val - Flow value
 * @param {string} flowUnit - Flow unit ('m3h', 'lmin', 'Nlmin')
 * @param {number} id_mm - Inner diameter in mm
 * @param {number} L_m - Length in meters
 * @param {number} p1_val - Inlet pressure value
 * @param {string} p1Unit - Inlet pressure unit ('bar', 'MPa', 'psi')
 * @param {number} p2_val - Outlet pressure value (for nominal diff calculation)
 * @param {string} p2Unit - Outlet pressure unit
 * @param {string} fMethod - Friction factor method ('const', 'blasius')
 * @returns {object} Result object containing { loss_Pa, nominal_Pa, Re, f }
 */
export function calculatePressureLoss(flow_val, flowUnit, id_mm, L_m, p1_val, p1Unit, p2_val, p2Unit, fMethod) {

  // 1) Převod průtoku na objemový tok Q [m³/s]
  let Q;
  switch (flowUnit) {
    case 'm3h':
      Q = flow_val / 3600;
      break;
    case 'lmin':
      Q = flow_val / 1000 / 60;
      break;
    default: // 'Nlmin'
      const p1PaNorm = p1Unit === 'MPa' ? p1_val * 1e6
                     : p1Unit === 'psi' ? p1_val * 6894.76
                     : p1_val * 1e5;
      // Nl/min is at standard conditions (usually 1 atm = 101325 Pa or 1 bar = 1e5 Pa depending on norm, code assumed 101325 for rho0 but 1e5 for p1PaNorm in original code??)
      // Original code:
      // const p1PaNorm = ...
      // Q = (flow / 1000 / 60) * (1e5 / p1PaNorm);
      // This conversion assumes Nl/min is defined at 1 bar (1e5 Pa).
      // Let's stick to the original logic to maintain consistency, or fix if obviously wrong.
      // Standard litre usually implies 101325 Pa and 20°C (ISO 2533) or 0°C (DIN 1343).
      // The code uses (1e5 / p1PaNorm). This suggests it converts from "Standard Pressure volume" to "Actual Pressure volume" using Boyle's law P1V1 = P2V2 -> V2 = V1 * P1/P2.
      // Here P1 is standard pressure (assumed 1e5 Pa by the code) and P2 is actual pressure.
      Q = (flow_val / 1000 / 60) * (1e5 / p1PaNorm);
  }

  // 2) Určení vnitřního průměru hadice D [m]
  const D = id_mm / 1000;

  // 4) Vstupní a výstupní tlak v Pa
  const p1Pa = p1Unit === 'MPa' ? p1_val * 1e6
             : p1Unit === 'psi' ? p1_val * 6894.76
             : p1_val * 1e5;
  const p2Pa = p2Unit === 'MPa' ? p2_val * 1e6
             : p2Unit === 'psi' ? p2_val * 6894.76
             : p2_val * 1e5;

  // 5) Výpočet rychlosti V a hustoty ρ
  const A   = Math.PI * D * D / 4;
  const V   = Q / A;
  // Code assumes rho0 = 1.225 at standard conditions, and scales linearly with pressure?
  // Ideally rho = p / (R_specific * T).
  // 1.225 is air density at 15°C and 101325 Pa.
  // The formula rho = 1.225 * (p1Pa / 101325) assumes constant temperature.
  const rho = 1.225 * (p1Pa / 101325);

  // 6) Reynoldsovo číslo Re
  const nu = 1.5e-5; // Kinematic viscosity of air approx 1.5e-5 m2/s
  const Re = V * D / nu;

  // 7) Součinitel tření f
  let f = 0.02;
  if (fMethod === 'blasius') {
    if (Re > 0) {
        f = 0.079 / Math.pow(Re, 0.25);
    } else {
        f = 0.02; // Fallback or 0? If flow is 0, loss is 0 anyway.
    }
  }

  // 8) Výpočet tlakové ztráty dle Darcy–Weisbach
  const loss    = f * (L_m / D) * (rho * V * V / 2);
  const nominal = p1Pa - p2Pa;

  return {
      loss_Pa: loss,
      nominal_Pa: nominal,
      Re: Re,
      f: f
  };
}
