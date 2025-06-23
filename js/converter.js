const convForm = document.getElementById('convForm');
convForm.addEventListener('submit', e => {
  e.preventDefault();
  const val = parseFloat(document.getElementById('value').value);
  const type = document.getElementById('convType').value;
  if (isNaN(val)) return document.getElementById('convResult').textContent = 'Neplatná hodnota.';
  let out;
  switch(type) {
    case 'bar2psi': out = val*14.5038; break;
    case 'psi2bar': out = val/14.5038; break;
    case 'm3h2lmin': out = val*1000/60; break;
    case 'lmin2m3h': out = val*60/1000; break;
  }
  document.getElementById('convResult').textContent = `Výsledek: ${out.toFixed(4)}`;
});
