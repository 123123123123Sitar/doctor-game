// Helper to generate probability based on difficulty
// Easy: Correct 70-90%, Others 10-30%
// Medium: Correct 50-60%, Others 30-40%
// Hard: Correct 30-40% (Ambiguous), Others 20-30%
const generateProbabilities = (isCorrect, difficulty) => {
    if (difficulty === 'easy') {
        return isCorrect ? Math.floor(Math.random() * 20) + 75 : Math.floor(Math.random() * 20) + 10;
    }
    if (difficulty === 'medium') {
        return isCorrect ? Math.floor(Math.random() * 10) + 55 : Math.floor(Math.random() * 20) + 30;
    }
    // Hard
    return isCorrect ? Math.floor(Math.random() * 10) + 35 : Math.floor(Math.random() * 10) + 25;
};

export const getMedicalCases = (difficulty = 'medium') => [
    {
        id: 'malignant_hyperthermia',
        name: 'Malignant Hyperthermia',
        scanClue: 'Patient temperature spiking rapidly. Muscle rigidity observed. CO2 levels critical.',
        requiredSequence: ['iv', 'iv', 'oral'], // IV (Dantrolene) x2, Oral (Cooling)
        failureMessage: 'Protocol deviation. Patient temperature uncontrolled. CONSULT HANDBOOK.',
        databases: [
            { id: 'mh_db', name: 'Malignant Hyperthermia', matchProbability: generateProbabilities(true, difficulty) + '%' },
            { id: 'thyroid_storm', name: 'Thyroid Storm', matchProbability: generateProbabilities(false, difficulty) + '%' },
            { id: 'sepsis', name: 'Severe Sepsis', matchProbability: generateProbabilities(false, difficulty) + '%' }
        ]
    },
    {
        id: 'anaphylaxis',
        name: 'Anaphylaxis',
        scanClue: 'Airway constricting. BP dropping correctly. Skin reaction visible.',
        requiredSequence: ['injection_b', 'injection_b', 'oral'], // Epi x2, Antihistamine
        failureMessage: 'Airway closed completely due to incorrect intervention. CONSULT HANDBOOK.',
        databases: [
            { id: 'anaphylaxis_db', name: 'Severe Anaphylaxis', matchProbability: generateProbabilities(true, difficulty) + '%' },
            { id: 'asthma', name: 'Acute Asthma Attack', matchProbability: generateProbabilities(false, difficulty) + '%' },
            { id: 'panic', name: 'Panic Disorder', matchProbability: generateProbabilities(false, difficulty) + '%' }
        ]
    },
    {
        id: 'thyroid_storm',
        name: 'Thyroid Storm',
        scanClue: 'Heart rate > 180. Fever. Delirium present.',
        requiredSequence: ['oral', 'iv', 'injection_a'], // Beta blocker, Fluids, Steroids
        failureMessage: 'Cardiac failure due to untreated metabolic surge. CONSULT HANDBOOK.',
        databases: [
            { id: 'thyroid_db', name: 'Thyroid Storm', matchProbability: generateProbabilities(true, difficulty) + '%' },
            { id: 'stimulant', name: 'Stimulant Overdose', matchProbability: generateProbabilities(false, difficulty) + '%' },
            { id: 'heat_stroke', name: 'Heat Stroke', matchProbability: generateProbabilities(false, difficulty) + '%' }
        ]
    },
    {
        id: 'warfarin_toxicity',
        name: 'Warfarin Toxicity',
        scanClue: 'Uncontrolled bleeding. INR > 9.0. History of blood thinners.',
        requiredSequence: ['injection_a', 'injection_a', 'oral'], // Vit K x2, Plasma
        failureMessage: 'Hemorrhage fatal. Clotting factors not administered. CONSULT HANDBOOK.',
        databases: [
            { id: 'warfarin_db', name: 'Warfarin Toxicity', matchProbability: generateProbabilities(true, difficulty) + '%' },
            { id: 'liver', name: 'Liver Failure', matchProbability: generateProbabilities(false, difficulty) + '%' },
            { id: 'dic', name: 'Disseminated Intravascular Coagulation', matchProbability: generateProbabilities(false, difficulty) + '%' }
        ]
    },
    {
        id: 'metallergy_syndrome',
        name: 'Metallergy Syndrome',
        scanClue: 'Rare autoimmune reaction to synthetic metals. Hives near implants.',
        requiredSequence: ['oral', 'oral', 'iv'], // Oral x2 (Chelation), IV (Flush)
        failureMessage: 'Systemic shock from metal exposure. Injections worsened condition. CONSULT HANDBOOK.',
        databases: [
            { id: 'metal_db', name: 'Metallergy Syndrome', matchProbability: generateProbabilities(true, difficulty) + '%' },
            { id: 'contact_derm', name: 'Contact Dermatitis', matchProbability: generateProbabilities(false, difficulty) + '%' },
            { id: 'infection', name: 'Implant Infection', matchProbability: generateProbabilities(false, difficulty) + '%' }
        ]
    }
];
