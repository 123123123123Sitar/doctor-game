// Helper to generate probability based on difficulty
// Easy: Correct 70-90%, Others 10-30%
// Medium: Correct 50-60%, Others 30-40%
// Hard: 30% chance a wrong diagnosis has highest probability (deceptive)
const generateProbabilities = (isCorrect, difficulty, isDeceptiveCase = false) => {
    if (difficulty === 'easy') {
        return isCorrect ? Math.floor(Math.random() * 20) + 75 : Math.floor(Math.random() * 20) + 10;
    }
    if (difficulty === 'medium') {
        return isCorrect ? Math.floor(Math.random() * 10) + 55 : Math.floor(Math.random() * 20) + 30;
    }
    // Hard mode with deception
    if (isDeceptiveCase) {
        // In deceptive cases, WRONG answer gets higher probability
        return isCorrect ? Math.floor(Math.random() * 10) + 25 : Math.floor(Math.random() * 15) + 50;
    }
    // Normal hard mode (ambiguous but correct is still slightly higher)
    return isCorrect ? Math.floor(Math.random() * 10) + 40 : Math.floor(Math.random() * 10) + 30;
};

// 30% chance of deceptive case in hard mode
const isDeceptive = (difficulty) => difficulty === 'hard' && Math.random() < 0.3;

export const getMedicalCases = (difficulty = 'medium') => {
    // Determine if this session has a deceptive case (30% chance in hard mode)
    const deceptive = isDeceptive(difficulty);

    return [
        {
            id: 'malignant_hyperthermia',
            name: 'Malignant Hyperthermia',
            scanClue: 'Patient temperature spiking rapidly. Muscle rigidity observed. CO2 levels critical.',
            requiredSequence: ['scan', 'iv', 'iv', 'oral'],
            failureMessage: 'Protocol deviation. Patient temperature uncontrolled. CONSULT HANDBOOK.',
            databases: [
                {
                    disease: 'Malignant Hyperthermia',
                    probability: generateProbabilities(true, difficulty, deceptive) + '%',
                    symptoms: ['Rapid temp spike', 'Muscle rigidity', 'High CO2'],
                    cure: 'IV Dantrolene x2, then Oral Cooling',
                    notes: 'Genetic disorder triggered by anesthetics.',
                    highlighted: true
                },
                {
                    disease: 'Thyroid Storm',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['High fever', 'Tachycardia', 'Altered mental status'],
                    cure: 'Beta blockers, Fluids, Steroids',
                    notes: 'Consider if history of hyperthyroidism.'
                },
                {
                    disease: 'Severe Sepsis',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Fever', 'Low BP', 'Elevated lactate'],
                    cure: 'IV Antibiotics, Fluids',
                    notes: 'Source control critical.'
                }
            ]
        },
        {
            id: 'anaphylaxis',
            name: 'Anaphylaxis',
            scanClue: 'Airway constricting. BP dropping. Skin reaction visible.',
            requiredSequence: ['scan', 'injection_b', 'injection_b', 'oral'],
            failureMessage: 'Airway closed completely due to incorrect intervention. CONSULT HANDBOOK.',
            databases: [
                {
                    disease: 'Severe Anaphylaxis',
                    probability: generateProbabilities(true, difficulty, deceptive) + '%',
                    symptoms: ['Airway constriction', 'Hypotension', 'Urticaria'],
                    cure: 'Injection B (Epinephrine) x2, then Oral Antihistamine',
                    notes: 'Administer Epi immediately. Time critical.',
                    highlighted: true
                },
                {
                    disease: 'Acute Asthma Attack',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness'],
                    cure: 'Bronchodilators, Steroids',
                    notes: 'No skin involvement typically.'
                },
                {
                    disease: 'Panic Disorder',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Hyperventilation', 'Palpitations', 'Dizziness'],
                    cure: 'Reassurance, Anxiolytics',
                    notes: 'Diagnosis of exclusion.'
                }
            ]
        },
        {
            id: 'thyroid_storm',
            name: 'Thyroid Storm',
            scanClue: 'Heart rate > 180. Fever. Delirium present.',
            requiredSequence: ['scan', 'oral', 'iv', 'injection_a'],
            failureMessage: 'Cardiac failure due to untreated metabolic surge. CONSULT HANDBOOK.',
            databases: [
                {
                    disease: 'Thyroid Storm',
                    probability: generateProbabilities(true, difficulty, deceptive) + '%',
                    symptoms: ['HR > 180', 'High Fever', 'Delirium'],
                    cure: 'Oral Beta-Blocker, IV Fluids, Injection A (Steroids)',
                    notes: 'Multi-organ failure risk. History of hyperthyroidism.',
                    highlighted: true
                },
                {
                    disease: 'Stimulant Overdose',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Tachycardia', 'Agitation', 'Hyperthermia'],
                    cure: 'Benzodiazepines, Supportive care',
                    notes: 'Check for drug use history.'
                },
                {
                    disease: 'Heat Stroke',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['High temp', 'Altered consciousness', 'Dry skin'],
                    cure: 'Rapid cooling, IV Fluids',
                    notes: 'Environmental exposure history.'
                }
            ]
        },
        {
            id: 'warfarin_toxicity',
            name: 'Warfarin Toxicity',
            scanClue: 'Uncontrolled bleeding. INR > 9.0. History of blood thinners.',
            requiredSequence: ['scan', 'injection_a', 'injection_a', 'oral'],
            failureMessage: 'Hemorrhage fatal. Clotting factors not administered. CONSULT HANDBOOK.',
            databases: [
                {
                    disease: 'Warfarin Toxicity',
                    probability: generateProbabilities(true, difficulty, deceptive) + '%',
                    symptoms: ['Uncontrolled Bleeding', 'INR > 9.0', 'Bruising'],
                    cure: 'Injection A (Vitamin K) x2, then Oral Plasma',
                    notes: 'Immediate reversal required for active bleeding.',
                    highlighted: true
                },
                {
                    disease: 'Liver Failure',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Coagulopathy', 'Jaundice', 'Encephalopathy'],
                    cure: 'Supportive care, Transplant evaluation',
                    notes: 'Check liver function tests.'
                },
                {
                    disease: 'Disseminated Intravascular Coagulation',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Bleeding', 'Clotting', 'Low platelets'],
                    cure: 'Treat underlying cause, Supportive',
                    notes: 'Complex coagulation disorder.'
                }
            ]
        },
        {
            id: 'metallergy_syndrome',
            name: 'Metallergy Syndrome',
            scanClue: 'Rare autoimmune reaction to synthetic metals. Hives near implants.',
            requiredSequence: ['scan', 'oral', 'oral', 'iv'],
            failureMessage: 'Systemic shock from metal exposure. Injections worsened condition. CONSULT HANDBOOK.',
            databases: [
                {
                    disease: 'Metallergy Syndrome',
                    probability: generateProbabilities(true, difficulty, deceptive) + '%',
                    symptoms: ['Metal allergy', 'Hives near implants', 'Systemic reaction'],
                    cure: 'Oral Chelation x2, then IV Flush',
                    notes: 'Do NOT use metallic needles (Injections).',
                    highlighted: true
                },
                {
                    disease: 'Contact Dermatitis',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Localized rash', 'Itching', 'Redness'],
                    cure: 'Topical steroids, Avoidance',
                    notes: 'Usually localized, not systemic.'
                },
                {
                    disease: 'Implant Infection',
                    probability: generateProbabilities(false, difficulty, deceptive) + '%',
                    symptoms: ['Fever', 'Pain at site', 'Swelling'],
                    cure: 'Antibiotics, Possible removal',
                    notes: 'Look for signs of infection.'
                }
            ]
        }
    ];
};
