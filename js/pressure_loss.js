const lossForm = document.getElementById('lossForm');
lossForm.addEventListener('submit', e => {
  e.preventDefault();
  const Qh = parseFloat(document.getElementById('flow').value);
  const d = parseFloat(document.getElementById('diameter').value);
  const L = parseFloat(document.getElementById('length').value);
  if (Qh<=0 || d<=0 || L<=0) return document.getElementById('lossResult').textContent = 'Neplatné hodnoty.';
  // převod Q (m3/h → m3/s)
  const Q = Qh/3600;
  const D = d/1000;
  const A = Math.PI*D*D/4;
  const V = Q/A;
  const f = 0.02; // předpoklad stálé
  const rho = 1.225; // kg/m3
  const deltaP = f*(L/D)*(rho*V*V/2); // Pa
  const deltaPbar = deltaP/100000;
  document.getElementById('lossResult').textContent =
    `Tlaková ztráta: ${deltaP.toFixed(2)} Pa (${deltaPbar.toFixed(4)} bar)`;
});
