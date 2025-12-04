
export const SHAPE_ICONS = {
    'Přímé': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="8" y1="2" x2="16" y2="2"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>',
    'Úhlové (Koleno)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4 V16 A4 4 0 0 0 8 20 H20"></path></svg>',
    'T-kus': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>',
    'Spojka (Hadice-Hadice)': '<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none"><line x1="2" y1="12" x2="22" y2="12"></line><circle cx="12" cy="12" r="3"></circle></svg>'
};

export const KQ2_DATA = [
    // Přímé (Male Connector) - KQ2H
    { Part_Number: 'KQ2H04-M5A', Shape_Type: 'Přímé', Tube_OD: '4mm', Thread_Type: 'M5' },
    { Part_Number: 'KQ2H04-01AS', Shape_Type: 'Přímé', Tube_OD: '4mm', Thread_Type: 'R1/8' },
    { Part_Number: 'KQ2H06-01AS', Shape_Type: 'Přímé', Tube_OD: '6mm', Thread_Type: 'R1/8' },
    { Part_Number: 'KQ2H06-02AS', Shape_Type: 'Přímé', Tube_OD: '6mm', Thread_Type: 'R1/4' },
    { Part_Number: 'KQ2H08-01AS', Shape_Type: 'Přímé', Tube_OD: '8mm', Thread_Type: 'R1/8' },
    { Part_Number: 'KQ2H08-02AS', Shape_Type: 'Přímé', Tube_OD: '8mm', Thread_Type: 'R1/4' },
    { Part_Number: 'KQ2H10-02AS', Shape_Type: 'Přímé', Tube_OD: '10mm', Thread_Type: 'R1/4' },
    { Part_Number: 'KQ2H10-03AS', Shape_Type: 'Přímé', Tube_OD: '10mm', Thread_Type: 'R3/8' },

    // Úhlové (Male Elbow) - KQ2L
    { Part_Number: 'KQ2L04-M5A', Shape_Type: 'Úhlové (Koleno)', Tube_OD: '4mm', Thread_Type: 'M5' },
    { Part_Number: 'KQ2L06-01AS', Shape_Type: 'Úhlové (Koleno)', Tube_OD: '6mm', Thread_Type: 'R1/8' },
    { Part_Number: 'KQ2L06-02AS', Shape_Type: 'Úhlové (Koleno)', Tube_OD: '6mm', Thread_Type: 'R1/4' },
    { Part_Number: 'KQ2L08-01AS', Shape_Type: 'Úhlové (Koleno)', Tube_OD: '8mm', Thread_Type: 'R1/8' },
    { Part_Number: 'KQ2L08-02AS', Shape_Type: 'Úhlové (Koleno)', Tube_OD: '8mm', Thread_Type: 'R1/4' },

    // T-kus (Union Tee / Male Branch Tee) - KQ2T
    { Part_Number: 'KQ2T06-00A', Shape_Type: 'T-kus', Tube_OD: '6mm', Thread_Type: 'Žádný (Spojka)' },
    { Part_Number: 'KQ2T06-01AS', Shape_Type: 'T-kus', Tube_OD: '6mm', Thread_Type: 'R1/8' },
    { Part_Number: 'KQ2T08-00A', Shape_Type: 'T-kus', Tube_OD: '8mm', Thread_Type: 'Žádný (Spojka)' },
    { Part_Number: 'KQ2T08-02AS', Shape_Type: 'T-kus', Tube_OD: '8mm', Thread_Type: 'R1/4' },

    // Spojka Přímá (Straight Union) - KQ2H (Tube-Tube)
    { Part_Number: 'KQ2H06-00A', Shape_Type: 'Spojka (Hadice-Hadice)', Tube_OD: '6mm', Thread_Type: 'Žádný (Spojka)' },
    { Part_Number: 'KQ2H08-00A', Shape_Type: 'Spojka (Hadice-Hadice)', Tube_OD: '8mm', Thread_Type: 'Žádný (Spojka)' }
];
