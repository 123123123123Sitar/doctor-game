// Medical case database with 10 different rare diseases
export const MEDICAL_CASES = [
    {
        id: 1,
        name: 'Metallergy Syndrome',
        correctTreatment: 'oral',
        failingTreatments: ['injection'],
        scanClue: 'Severe metal sensitivity. Protocol: Scan -> Oral -> Oral -> Injection A.',
        requiredSequence: ['scan', 'oral', 'oral', 'injection_a'],
        failureMessage: 'Protocol Violation: Desensitization incomplete. Two oral doses required before injection.',
        databases: [
            { disease: 'Kallmann Syndrome', symptoms: ['Fever', 'Fatigue', 'Neurological issues'], cure: 'Injection Therapy', probability: '35%', notes: 'Rare endocrine disorder' },
            { disease: 'Pompe Disease', symptoms: ['Muscle weakness', 'Respiratory issues', 'Fatigue'], cure: 'IV Enzyme Replacement', probability: '28%', notes: 'Genetic disorder affecting muscles' },
            { disease: 'Metallergy Syndrome', symptoms: ['Fever', 'Skin rash', 'Fatigue'], cure: 'Oral Antihistamines', probability: '65%', notes: 'Severe metal allergy - AVOID METAL NEEDLES', highlighted: true },
            { disease: 'Fabry Disease', symptoms: ['Pain in extremities', 'Fever', 'Fatigue'], cure: 'Injection Therapy', probability: '22%', notes: 'Lysosomal storage disorder' }
        ]
    },
    {
        id: 2,
        name: 'Hemophagocytic Lymphohistiocytosis',
        correctTreatment: 'oral',
        failingTreatments: ['injection'],
        scanClue: 'Immune storm. Protocol: Scan -> Oral -> Oral -> IV.',
        requiredSequence: ['scan', 'oral', 'oral', 'iv'],
        failureMessage: 'Sequence Error: Double oral suppression required before IV stabilization.',
        databases: [
            { disease: 'Gaucher Disease', symptoms: ['Enlarged organs', 'Bone pain', 'Fatigue'], cure: 'IV Enzyme Therapy', probability: '30%', notes: 'Enzyme deficiency disorder' },
            { disease: 'Hemophagocytic Lymphohistiocytosis', symptoms: ['High fever', 'Enlarged spleen', 'Fatigue'], cure: 'Oral Immunosuppressants', probability: '70%', notes: 'Requires immediate immunosuppression - IV treatments may trigger cytokine storm', highlighted: true },
            { disease: 'Niemann-Pick Disease', symptoms: ['Neurological decline', 'Enlarged liver', 'Fatigue'], cure: 'Injection Therapy', probability: '25%', notes: 'Lipid storage disorder' },
            { disease: 'Tay-Sachs Disease', symptoms: ['Vision loss', 'Seizures', 'Weakness'], cure: 'Supportive Care', probability: '18%', notes: 'Genetic neurological disorder' }
        ]
    },
    {
        id: 3,
        name: 'Acute Intermittent Porphyria',
        correctTreatment: 'iv',
        failingTreatments: ['oral'],
        scanClue: 'Porphyria attack. Protocol: Scan -> IV -> IV -> IV.',
        requiredSequence: ['scan', 'iv', 'iv', 'iv'],
        failureMessage: 'Treatment Incomplete: Triple IV Hemin flush required to clear porphyrins.',
        databases: [
            { disease: 'Wilson Disease', symptoms: ['Liver problems', 'Tremors', 'Fatigue'], cure: 'Oral Chelation', probability: '28%', notes: 'Copper accumulation disorder' },
            { disease: 'Acute Intermittent Porphyria', symptoms: ['Severe abdominal pain', 'Dark urine', 'Weakness'], cure: 'IV Hemin Infusion', probability: '68%', notes: 'Critical: Oral medications contraindicated - may worsen attacks', highlighted: true },
            { disease: 'Hemochromatosis', symptoms: ['Joint pain', 'Fatigue', 'Liver issues'], cure: 'Phlebotomy', probability: '32%', notes: 'Iron overload disorder' },
            { disease: 'Alpha-1 Antitrypsin', symptoms: ['Breathing issues', 'Liver disease'], cure: 'IV Augmentation', probability: '20%', notes: 'Protein deficiency' }
        ]
    },
    {
        id: 4,
        name: 'Addisonian Crisis',
        correctTreatment: 'injection_a',
        failingTreatments: ['oral'],
        scanClue: 'Cortisol crisis. Protocol: Scan -> Injection A -> Injection A -> IV.',
        requiredSequence: ['scan', 'injection_a', 'injection_a', 'iv'],
        failureMessage: 'Dosage Error: Two steroid injections followed by IV fluids required.',
        databases: [
            { disease: 'Hypothyroidism', symptoms: ['Fatigue', 'Weight gain', 'Cold sensitivity'], cure: 'Oral Levothyroxine', probability: '25%', notes: 'Thyroid hormone deficiency' },
            { disease: 'Addisonian Crisis', symptoms: ['Severe weakness', 'Low blood pressure', 'Confusion'], cure: 'Emergency Hydrocortisone Injection', probability: '72%', notes: 'URGENT: Oral route too slow - patient needs immediate IV/IM steroids', highlighted: true },
            { disease: 'Cushings Syndrome', symptoms: ['Weight gain', 'High blood pressure'], cure: 'Surgery', probability: '30%', notes: 'Excess cortisol production' },
            { disease: 'Diabetes Insipidus', symptoms: ['Extreme thirst', 'Frequent urination'], cure: 'Oral Desmopressin', probability: '22%', notes: 'Vasopressin deficiency' }
        ]
    },
    {
        id: 5,
        name: 'Myasthenia Gravis Crisis',
        correctTreatment: 'iv',
        failingTreatments: ['injection_a', 'injection_b'],
        scanClue: 'NMJ failure. Protocol: Scan -> IV -> IV -> Oral.',
        requiredSequence: ['scan', 'iv', 'iv', 'oral'],
        failureMessage: 'Protocol Violation: Full plasma exchange (2x IV) required before oral maintenance.',
        databases: [
            { disease: 'ALS', symptoms: ['Muscle weakness', 'Difficulty speaking', 'Fatigue'], cure: 'Supportive Care', probability: '28%', notes: 'Progressive motor neuron disease' },
            { disease: 'Myasthenia Gravis Crisis', symptoms: ['Severe muscle weakness', 'Breathing difficulty', 'Drooping eyelids'], cure: 'IV Immunoglobulin Therapy', probability: '66%', notes: 'Critical: Standard injections ineffective - needs IVIG or plasmapheresis', highlighted: true },
            { disease: 'Multiple Sclerosis', symptoms: ['Vision problems', 'Numbness', 'Balance issues'], cure: 'Injection Therapy', probability: '35%', notes: 'Autoimmune demyelination' },
            { disease: 'Guillain-Barre', symptoms: ['Ascending paralysis', 'Weakness'], cure: 'IV Immunoglobulin', probability: '24%', notes: 'Acute polyneuropathy' }
        ]
    },
    {
        id: 6,
        name: 'Warfarin Toxicity',
        correctTreatment: 'injection_a',
        failingTreatments: ['oral', 'iv'],
        scanClue: 'High INR. Protocol: Scan -> Injection A -> Injection A -> Oral.',
        requiredSequence: ['scan', 'injection_a', 'injection_a', 'oral'],
        failureMessage: 'Sequence Error: Two Vitamin K injections required before oral stabilization.',
        databases: [
            { disease: 'Hemophilia', symptoms: ['Easy bruising', 'Prolonged bleeding', 'Joint pain'], cure: 'IV Clotting Factor', probability: '32%', notes: 'Genetic clotting disorder' },
            { disease: 'Warfarin Toxicity', symptoms: ['Bleeding', 'Bruising', 'Blood in urine'], cure: 'Vitamin K Injection', probability: '70%', notes: 'URGENT: Oral vitamin K too slow, IV route may cause anaphylaxis - IM injection required', highlighted: true },
            { disease: 'Von Willebrand Disease', symptoms: ['Nosebleeds', 'Heavy periods', 'Bruising'], cure: 'Desmopressin', probability: '26%', notes: 'Most common bleeding disorder' },
            { disease: 'Thrombocytopenia', symptoms: ['Easy bruising', 'Fatigue', 'Bleeding'], cure: 'Oral Steroids', probability: '18%', notes: 'Low platelet count' }
        ]
    },
    {
        id: 7,
        name: 'Thyroid Storm',
        correctTreatment: 'oral',
        failingTreatments: ['injection_a'],
        scanClue: 'Thyroid Storm. Protocol: Scan -> Oral -> Oral -> Oral.',
        requiredSequence: ['scan', 'oral', 'oral', 'oral'],
        failureMessage: 'Treatment Incomplete: Beta Blockers, PTU, and Steroids (3x Oral) required.',
        databases: [
            { disease: 'Graves Disease', symptoms: ['Weight loss', 'Rapid heartbeat', 'Anxiety'], cure: 'Oral Antithyroid', probability: '30%', notes: 'Autoimmune hyperthyroidism' },
            { disease: 'Thyroid Storm', symptoms: ['Very high fever', 'Confusion', 'Rapid heart rate'], cure: 'Oral PTU + Beta Blockers', probability: '68%', notes: 'Life-threatening: Injections may worsen cardiovascular instability', highlighted: true },
            { disease: 'Toxic Adenoma', symptoms: ['Weight loss', 'Heat intolerance', 'Tremor'], cure: 'Radioiodine', probability: '28%', notes: 'Autonomously functioning nodule' },
            { disease: 'Hashimotos', symptoms: ['Fatigue', 'Weight gain', 'Depression'], cure: 'Oral Levothyroxine', probability: '22%', notes: 'Autoimmune hypothyroidism' }
        ]
    },
    {
        id: 8,
        name: 'Anaphylaxis (IV Contrast Allergy)',
        correctTreatment: 'injection_b',
        failingTreatments: ['oral', 'iv'],
        scanClue: 'Anaphylaxis. Protocol: Scan -> Injection B -> Injection B -> Oral.',
        requiredSequence: ['scan', 'injection_b', 'injection_b', 'oral'],
        failureMessage: 'Protocol Violation: Two Epinephrine doses required before Antihistamine.',
        databases: [
            { disease: 'Food Allergy', symptoms: ['Hives', 'Swelling', 'Nausea'], cure: 'Oral Antihistamine', probability: '25%', notes: 'IgE-mediated reaction' },
            { disease: 'Anaphylaxis', symptoms: ['Difficulty breathing', 'Swelling', 'Rapid pulse'], cure: 'Epinephrine Auto-Injector', probability: '75%', notes: 'CRITICAL: IV route delays treatment, oral ineffective - IM epinephrine only option', highlighted: true },
            { disease: 'Angioedema', symptoms: ['Facial swelling', 'Throat swelling'], cure: 'IV Steroids', probability: '30%', notes: 'Bradykinin-mediated swelling' },
            { disease: 'Urticaria', symptoms: ['Itchy hives', 'Redness'], cure: 'Oral Antihistamine', probability: '20%', notes: 'Chronic hives condition' }
        ]
    },
    {
        id: 9,
        name: 'Severe Hypoglycemia',
        correctTreatment: 'injection_b',
        failingTreatments: ['oral'],
        scanClue: 'Hypoglycemia. Protocol: Scan -> Injection B -> IV -> Oral.',
        requiredSequence: ['scan', 'injection_b', 'iv', 'oral'],
        failureMessage: 'Sequence Error: Glucagon -> IV Dextrose -> Oral snack required.',
        databases: [
            { disease: 'Type 1 Diabetes', symptoms: ['Thirst', 'Frequent urination', 'Fatigue'], cure: 'Insulin Injection', probability: '28%', notes: 'Autoimmune pancreatic failure' },
            { disease: 'Severe Hypoglycemia', symptoms: ['Unconsciousness', 'Seizures', 'Confusion'], cure: 'Glucagon Injection', probability: '72%', notes: 'URGENT: Patient unconscious - oral glucose impossible, needs IM glucagon', highlighted: true },
            { disease: 'Insulinoma', symptoms: ['Low blood sugar', 'Sweating', 'Confusion'], cure: 'Surgery', probability: '24%', notes: 'Insulin-secreting tumor' },
            { disease: 'Reactive Hypoglycemia', symptoms: ['Shakiness', 'Anxiety', 'Hunger'], cure: 'Dietary Changes', probability: '18%', notes: 'Post-meal blood sugar drop' }
        ]
    },
    {
        id: 10,
        name: 'Malignant Hyperthermia',
        correctTreatment: 'iv',
        failingTreatments: ['injection_a', 'oral'],
        scanClue: 'Malignant Hyperthermia. Protocol: Scan -> IV -> IV -> IV.',
        requiredSequence: ['scan', 'iv', 'iv', 'iv'],
        failureMessage: 'Dosage Error: Malignant Hyperthermia requires aggressive high-dose IV Dantrolene (3x).',
        databases: [
            { disease: 'Neuroleptic Malignant', symptoms: ['High fever', 'Muscle rigidity', 'Confusion'], cure: 'IV Dantrolene', probability: '32%', notes: 'Antipsychotic medication reaction' },
            { disease: 'Malignant Hyperthermia', symptoms: ['Extreme fever', 'Muscle rigidity', 'Rapid heart rate'], cure: 'IV Dantrolene Infusion', probability: '70%', notes: 'CRITICAL: Genetic reaction to anesthesia - ONLY IV dantrolene effective', highlighted: true },
            { disease: 'Serotonin Syndrome', symptoms: ['Agitation', 'Fever', 'Tremor'], cure: 'Oral Cyproheptadine', probability: '26%', notes: 'Medication interaction' },
            { disease: 'Heat Stroke', symptoms: ['Very high fever', 'Confusion', 'Seizures'], cure: 'Cooling + IV Fluids', probability: '22%', notes: 'Environmental hyperthermia' }
        ]
    },
];

export const getRandomCase = () => {
    const randomIndex = Math.floor(Math.random() * MEDICAL_CASES.length);
    return MEDICAL_CASES[randomIndex];
};
