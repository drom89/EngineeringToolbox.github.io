
import { KQ2_DATA, SHAPE_ICONS } from './lib/kq2_data.js';

document.addEventListener('DOMContentLoaded', () => {
    const shapeContainer = document.getElementById('shape-filters');
    const odSelect = document.getElementById('filter-od');
    const threadSelect = document.getElementById('filter-thread');
    const resultsGrid = document.getElementById('results-grid');
    const resultsCount = document.getElementById('results-count');
    const resetBtn = document.getElementById('btn-reset');

    let currentFilters = {
        shape: null,
        od: 'all',
        thread: 'all'
    };

    // 1. Initialize Filters
    initializeFilters();
    renderResults();

    function initializeFilters() {
        // Shapes
        // Normalize shape names if needed or just take unique ones
        const uniqueShapes = [...new Set(KQ2_DATA.map(item => item.Shape_Type))].sort();

        // Define known shapes order or priority?
        // For now, alphabet or pre-defined list.
        // We have icons for specific keys in SHAPE_ICONS.
        // If data has shapes not in SHAPE_ICONS, we should handle them.

        uniqueShapes.forEach(shape => {
            const btn = document.createElement('div');
            btn.className = 'shape-btn';
            btn.dataset.shape = shape;

            // Icon
            // Try to match exact string, or partial?
            // The data generator uses keys that match SHAPE_ICONS keys exactly for the main ones.
            // Unions might have modified names?
            // In generateData I used: model.name (e.g. "Přímé (KQ2H)")
            // And for unions I modified it to "Přímé Spojka (KQ2H)"? No, I commented that out/kept it generic or modified.
            // Let's check what I actually wrote.
            // I wrote: Shape_Type: model.name.replace(...)
            // So "Přímé (KQ2H)" becomes "Přímé Spojka (KQ2H)" for unions.
            // SHAPE_ICONS has 'Přímé (KQ2H)'.
            // So "Přímé Spojka (KQ2H)" won't find an icon.
            // I should improve icon mapping to use partial match or map specific union names.

            let iconHtml = SHAPE_ICONS[shape];
            if (!iconHtml) {
                // Fallback: try to find a key in SHAPE_ICONS that is a substring of the shape name
                const matchingKey = Object.keys(SHAPE_ICONS).find(key => shape.includes(key.split(' ')[0])); // basic heuristic
                if (matchingKey) iconHtml = SHAPE_ICONS[matchingKey];
                else iconHtml = '<span>?</span>';
            }

            btn.innerHTML = `
                ${iconHtml}
                <span class="shape-label">${shape}</span>
            `;

            btn.addEventListener('click', () => {
                // Toggle active class
                if (currentFilters.shape === shape) {
                    currentFilters.shape = null;
                    btn.classList.remove('active');
                } else {
                    currentFilters.shape = shape;
                    // Remove active from others
                    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
                renderResults();
            });

            shapeContainer.appendChild(btn);
        });

        // Tube ODs
        // Sort naturally (numeric aware?)
        const uniqueODs = [...new Set(KQ2_DATA.map(item => item.Tube_OD))].sort((a, b) => {
             return parseFloat(a) - parseFloat(b);
        });

        uniqueODs.forEach(od => {
            const opt = document.createElement('option');
            opt.value = od;
            opt.textContent = od;
            odSelect.appendChild(opt);
        });

        // Threads
        const uniqueThreads = [...new Set(KQ2_DATA.map(item => item.Thread_Type))].sort();
        uniqueThreads.forEach(th => {
            const opt = document.createElement('option');
            opt.value = th;
            opt.textContent = th;
            threadSelect.appendChild(opt);
        });

        // Event Listeners for Dropdowns
        odSelect.addEventListener('change', (e) => {
            currentFilters.od = e.target.value;
            renderResults();
        });

        threadSelect.addEventListener('change', (e) => {
            currentFilters.thread = e.target.value;
            renderResults();
        });

        resetBtn.addEventListener('click', () => {
            currentFilters = { shape: null, od: 'all', thread: 'all' };
            odSelect.value = 'all';
            threadSelect.value = 'all';
            document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
            renderResults();
        });
    }

    function renderResults() {
        // Filter Data
        const filtered = KQ2_DATA.filter(item => {
            const matchShape = currentFilters.shape ? item.Shape_Type === currentFilters.shape : true;
            const matchOD = currentFilters.od !== 'all' ? item.Tube_OD === currentFilters.od : true;
            const matchThread = currentFilters.thread !== 'all' ? item.Thread_Type === currentFilters.thread : true;
            return matchShape && matchOD && matchThread;
        });

        // Update Count
        resultsCount.textContent = `Nalezeno položek: ${filtered.length}`;

        // Clear Grid
        resultsGrid.innerHTML = '';

        if (filtered.length === 0) {
            resultsGrid.innerHTML = '<div class="no-results">Žádné šroubení neodpovídá vybraným filtrům.</div>';
            return;
        }

        // Limit results for performance if huge (e.g. > 100)
        const displayLimit = 100;
        const itemsToDisplay = filtered.slice(0, displayLimit);

        itemsToDisplay.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';

            // Find Icon (Reuse logic)
            let icon = SHAPE_ICONS[item.Shape_Type];
            if (!icon) {
                 const matchingKey = Object.keys(SHAPE_ICONS).find(key => item.Shape_Type.includes(key.split(' ')[0]));
                 if (matchingKey) icon = SHAPE_ICONS[matchingKey];
            }
            icon = icon || '';

            const iconDiv = document.createElement('div');
            iconDiv.style.marginBottom = '10px';
            iconDiv.style.color = '#888';
            iconDiv.innerHTML = icon;
            if(iconDiv.querySelector('svg')) {
                iconDiv.querySelector('svg').setAttribute('width', '24');
                iconDiv.querySelector('svg').setAttribute('height', '24');
            }

            card.appendChild(iconDiv);

            const pn = document.createElement('span');
            pn.className = 'part-number';
            pn.textContent = item.Part_Number;
            card.appendChild(pn);

            const row1 = document.createElement('div');
            row1.className = 'spec-row';
            row1.innerHTML = `<strong>Hadice:</strong> ${item.Tube_OD}`;
            card.appendChild(row1);

            const row2 = document.createElement('div');
            row2.className = 'spec-row';
            row2.innerHTML = `<strong>Závit:</strong> ${item.Thread_Type}`;
            card.appendChild(row2);

            const row3 = document.createElement('div');
            row3.className = 'spec-row';
            row3.innerHTML = `<em>${item.Shape_Type}</em>`;
            card.appendChild(row3);

            resultsGrid.appendChild(card);
        });

        if (filtered.length > displayLimit) {
            const more = document.createElement('div');
            more.style.gridColumn = '1 / -1';
            more.style.textAlign = 'center';
            more.style.padding = '10px';
            more.style.color = '#666';
            more.textContent = `... a dalších ${filtered.length - displayLimit} položek. Upřesněte filtry.`;
            resultsGrid.appendChild(more);
        }
    }
});
