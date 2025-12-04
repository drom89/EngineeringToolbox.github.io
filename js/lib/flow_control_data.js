
export const FLOW_CONTROL_ICONS = {
    'Přímé (AS-1000, 2000, 3000)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="2" x2="12" y2="22"></line><circle cx="12" cy="12" r="4"></circle><line x1="10" y1="10" x2="14" y2="14"></line><line x1="14" y1="10" x2="10" y2="14"></line></svg>',
    'Úhlové (AS-1000, 2000, 3000, 4000)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4 V16 A4 4 0 0 0 8 20 H20"></path><circle cx="12" cy="12" r="4"></circle><line x1="10" y1="10" x2="14" y2="14"></line><line x1="14" y1="10" x2="10" y2="14"></line></svg>',
    'Univerzální (AS-1000, 2000, 3000, 4000)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="6"></circle><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="10" y1="10" x2="14" y2="14"></line><line x1="14" y1="10" x2="10" y2="14"></line></svg>'
};

// Data Generation Logic for AS Series
// AS1000 (In-line), AS2000 (Elbow), AS3000 (Universal)

const SIZES_METRIC = [
    { od: '2mm', code: '02' },
    { od: '3.2mm', code: '23' },
    { od: '4mm', code: '04' },
    { od: '6mm', code: '06' },
    { od: '8mm', code: '08' },
    { od: '10mm', code: '10' },
    { od: '12mm', code: '12' }
];

const THREADS_METRIC = [
    { type: 'M3', code: 'M3' },
    { type: 'M5', code: 'M5' },
    { type: 'R1/8', code: '01' },
    { type: 'R1/4', code: '02' },
    { type: 'R3/8', code: '03' },
    { type: 'R1/2', code: '04' }
];

const COMPATIBILITY = {
    '02': ['M3', 'M5'],
    '23': ['M3', 'M5'],
    '04': ['M5', '01', '02'],
    '06': ['M5', '01', '02', '03'],
    '08': ['01', '02', '03', '04'],
    '10': ['01', '02', '03', '04'],
    '12': ['02', '03', '04']
};

const MODELS = [
    { series: '1000', code: '1001F', name: 'Přímé (AS-1000, 2000, 3000)', type: 'inline' },
    { series: '2000', code: '2201F', name: 'Úhlové (AS-1000, 2000, 3000, 4000)', type: 'elbow' },
    { series: '3000', code: '3201F', name: 'Univerzální (AS-1000, 2000, 3000, 4000)', type: 'universal' }
];

function generateData() {
    const data = [];

    MODELS.forEach(model => {
        SIZES_METRIC.forEach(size => {
            // In-line (AS1000) often doesn't have thread, just tube-tube.
            // But there are threaded versions too. Let's assume standard elbow/universal has threads.

            if (model.type === 'inline') {
                // Determine body size based on Tube OD
                let body = '1';
                if (['02', '23', '04', '06'].includes(size.code)) body = '1';
                else if (['08'].includes(size.code)) body = '2';
                else if (['10', '12'].includes(size.code)) body = '3';

                // AS1001F, AS2001F, AS3001F
                data.push({
                    Part_Number: `AS${body}001F-${size.code}`,
                    Shape_Type: model.name,
                    Tube_OD: size.od,
                    Thread_Type: 'Žádný (In-line)'
                });
                return;
            }

            const compatibleThreads = COMPATIBILITY[size.code] || [];
            compatibleThreads.forEach(threadCode => {
                const threadObj = THREADS_METRIC.find(t => t.code === threadCode);
                const threadName = threadObj ? threadObj.type : threadCode;

                // Body size estimation based on thread
                let body = '2';
                if (threadCode === 'M3' || threadCode === 'M5') body = '1';
                else if (threadCode === '01') body = '2'; // R1/8
                else if (threadCode === '02') body = '2'; // R1/4 (Standard is 2, but can be 3 for larger tubes)
                else if (threadCode === '03') body = '3'; // R3/8
                else if (threadCode === '04') body = '4'; // R1/2

                // Correction for specific overlaps (Simplified logic for standard catalog)
                // AS3000 covers 1/4 and 3/8. AS2000 covers 1/8 and 1/4.
                // If 1/4 (02) is used with larger tubes (>=8mm) it might be body 3?
                // For simplicity/safety in this generator:
                // 1/4 (02) -> Body 2 (AS2201F-02-...)
                // 3/8 (03) -> Body 3 (AS3201F-03-...)
                // 1/2 (04) -> Body 4 (AS4201F-04-...)

                // Special case: AS3000 can also be 1/4. 
                // Let's stick to the primary mapping for the thread size to body size.

                const typeCode = model.type === 'elbow' ? '201F' : '301F';
                const pn = `AS${body}${typeCode}-${threadCode}-${size.code}A`;

                data.push({
                    Part_Number: pn,
                    Shape_Type: model.name,
                    Tube_OD: size.od,
                    Thread_Type: threadName
                });
            });
        });
    });

    return data;
}

export const FLOW_CONTROL_DATA = generateData();
