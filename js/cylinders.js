const cylForm = document.getElementById('cylinderForm');
cylForm.addEventListener('submit', e => {
  e.preventDefault();
  const d = parseFloat(document.getElementById('diameter').value);
  const p = parseFloat(document.getElementById('pressure').value);
  const type = document.getElementById('cylinderType').value;
  if (d <= 0 || p <= 0) return document.getElementById('result').textContent = 'Neplatné hodnoty.';
  const r = d/1000/2;
  const area = Math.PI * r*r;
  const F = p*100000 * area;
  document.getElementById('result').textContent =
    `Síla ${type==='pneumatic'?'pneumatického':'hydraulického'} válce: ${F.toFixed(2)} N`;
});
