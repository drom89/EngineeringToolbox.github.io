
export const SHAPE_ICONS = {
    'Přímé (KQ2H)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="8" y1="2" x2="16" y2="2"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>',
    'Úhlové (KQ2L)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4 V16 A4 4 0 0 0 8 20 H20"></path></svg>',
    'T-kus (KQ2T)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>',
    'Y-kus (KQ2U)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="20" x2="12" y2="12"></line><line x1="12" y1="12" x2="6" y2="4"></line><line x1="12" y1="12" x2="18" y2="4"></line></svg>',
    'Přepážkové (KQ2E)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="2" y1="12" x2="22" y2="12"></line><rect x="10" y="4" width="4" height="16"></rect></svg>',
    'Úhlové 45° (KQ2K)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 20 L12 12 L20 12"></path></svg>',
    'Univerzální (KQ2V)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="6"></circle><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="6" x2="12" y2="2"></line></svg>'
};

// Data Generation Logic
// Defines standard combinations found in SMC catalogs.
// This generates a large dataset to simulate a full catalog.

const SIZES_METRIC = [
    { od: '2mm', code: '02' },
    { od: '3.2mm', code: '23' },
    { od: '4mm', code: '04' },
    { od: '6mm', code: '06' },
    { od: '8mm', code: '08' },
    { od: '10mm', code: '10' },
    { od: '12mm', code: '12' },
    { od: '16mm', code: '16' }
];

const THREADS_METRIC = [
    { type: 'M3', code: 'M3' },
    { type: 'M5', code: 'M5' },
    { type: 'M6', code: 'M6' },
    { type: 'R1/8', code: '01' },
    { type: 'R1/4', code: '02' },
    { type: 'R3/8', code: '03' },
    { type: 'R1/2', code: '04' }
];

// Simplified compatibility map (not exhaustive, but representative)
// Smaller tubes -> Smaller threads
const COMPATIBILITY = {
    '02': ['M3', 'M5'],
    '23': ['M3', 'M5', 'M6'],
    '04': ['M5', 'M6', '01', '02'],
    '06': ['M5', 'M6', '01', '02', '03'],
    '08': ['01', '02', '03'],
    '10': ['01', '02', '03', '04'],
    '12': ['02', '03', '04'],
    '16': ['03', '04']
};

const MODELS = [
    { code: 'H', name: 'Přímé (KQ2H)', suffix: 'A' }, // Male Connector
    { code: 'L', name: 'Úhlové (KQ2L)', suffix: 'A' }, // Male Elbow
    { code: 'T', name: 'T-kus (KQ2T)', suffix: 'A' }, // Male Branch Tee
    { code: 'U', name: 'Y-kus (KQ2U)', suffix: 'A' }, // Male Branch Y
    { code: 'E', name: 'Přepážkové (KQ2E)', suffix: 'A', no_thread: true }, // Bulkhead Union (usually tube-tube, but represented here for completeness)
    { code: 'K', name: 'Úhlové 45° (KQ2K)', suffix: 'A' }, // 45 deg Elbow
    { code: 'V', name: 'Univerzální (KQ2V)', suffix: 'A' } // Universal Elbow
];

function generateData() {
    const data = [];

    // 1. Threaded fittings
    MODELS.forEach(model => {
        if (model.no_thread) return; // Skip non-threaded for this loop

        SIZES_METRIC.forEach(size => {
            const compatibleThreads = COMPATIBILITY[size.code] || [];
            compatibleThreads.forEach(threadCode => {
                // Find thread display name
                const threadObj = THREADS_METRIC.find(t => t.code === threadCode);
                const threadName = threadObj ? threadObj.type : threadCode;

                // Part Number Construction: KQ2[Model][Tube]-[Thread][Suffix]
                // Example: KQ2H06-01AS (S for seal is common, A is new standard style)
                // Using 'A' suffix as standard new series or 'S' if seal required?
                // SMC New KQ2 often uses just 'A' at end for standard.
                // Or 'S' for seal. Let's stick to a generic format.
                // Standard part: KQ2H06-01A

                // M threads usually don't have R-style numbers in code in same way?
                // M5 is KQ2H04-M5A.
                // R1/8 is KQ2H04-01A.

                const pn = `KQ2${model.code}${size.code}-${threadCode}${model.suffix}`;

                data.push({
                    Part_Number: pn,
                    Shape_Type: model.name,
                    Tube_OD: size.od,
                    Thread_Type: threadName
                });
            });
        });
    });

    // 2. Tube-Tube connections (Unions)
    // KQ2H (Straight Union), KQ2T (Union Tee), KQ2E (Bulkhead)
    // These typically have code '00' or differ in structure (e.g. KQ2H06-00A).

    const UNION_MODELS = [
        { code: 'H', name: 'Přímé (KQ2H)', suffix: '00A' },
        { code: 'L', name: 'Úhlové (KQ2L)', suffix: '00A' }, // Union Elbow
        { code: 'T', name: 'T-kus (KQ2T)', suffix: '00A' }, // Union Tee
        { code: 'E', name: 'Přepážkové (KQ2E)', suffix: '00A' }
    ];

    UNION_MODELS.forEach(model => {
        SIZES_METRIC.forEach(size => {
             const pn = `KQ2${model.code}${size.code}-${model.suffix}`;
             data.push({
                Part_Number: pn,
                Shape_Type: model.name.replace(' (KQ2H)', ' Spojka (KQ2H)').replace(' (KQ2L)', ' Spojka (KQ2L)').replace(' (KQ2T)', ' Spojka (KQ2T)'), // Modify name slightly to indicate union? Or keep generic?
                // Keeping generic Shape_Type to match filter buttons is better.
                // But user might want to distinguish Threaded vs Union.
                // For now, let's map them to the same Shape Category but Thread Type is "Žádný".
                Tube_OD: size.od,
                Thread_Type: 'Žádný (Spojka)'
             });
        });
    });

    return data;
}

export const KQ2_DATA = generateData();
