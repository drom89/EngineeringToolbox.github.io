const airForm = document.getElementById('airForm');
airForm.addEventListener('submit', e => {
  e.preventDefault();
  const d = parseFloat(document.getElementById('diameter').value);
  const L = parseFloat(document.getElementById('length').value);
  const dP = parseFloat(document.getElementById('dp').value);
  if (d<=0||L<=0||dP<=0) return document.getElementById('airResult').textContent = 'Neplatné hodnoty.';
  const D = d/1000;
  const area = Math.PI*D*D/4;
  const f = 0.02;
  const rho = 1.225;
  const dpPa = dP*100000;
  // Q = A * sqrt(2*dp/(rho * f * L/D))
  const Q = area * Math.sqrt(2*dpPa/(rho * f * L/D)); // m3/s
  const Qh = Q*3600;
  document.getElementById('airResult').textContent =
    `Průtok: ${Qh.toFixed(2)} m³/h`;
});
