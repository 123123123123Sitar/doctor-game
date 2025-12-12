import { useState } from 'react';
import './Handbook.css';

const TEXTBOOK_DATA = [
    // Main Correct Diagnoses with full protocols
    {
        name: 'Malignant Hyperthermia',
        symptoms: 'Rapid temp spike, Muscle rigidity, High CO2',
        protocol: 'Scan -> IV -> IV -> Oral',
        medications: 'IV Dantrolene (x2), then Oral Cooling agents',
        alert: 'Avoid Volatile Anesthetics'
    },
    {
        name: 'Anaphylaxis',
        symptoms: 'Airway constriction, Hypotension, Hives/Urticaria',
        protocol: 'Scan -> Injection B -> Injection B -> Oral',
        medications: 'Injection B Epinephrine (x2), then Oral Antihistamine',
        alert: 'Time Critical - Airway Risk'
    },
    {
        name: 'Thyroid Storm',
        symptoms: 'HR > 180, High Fever, Delirium/Agitation',
        protocol: 'Scan -> Oral -> IV -> Injection A',
        medications: 'Oral Beta-Blocker, IV Fluids, Injection A Steroids',
        alert: 'Multi-organ Failure Risk'
    },
    {
        name: 'Warfarin Toxicity',
        symptoms: 'Uncontrolled Bleeding, INR > 9.0, Bruising',
        protocol: 'Scan -> Injection A -> Injection A -> Oral',
        medications: 'Injection A Vitamin K (x2), then Oral Plasma',
        alert: 'Hemorrhage Risk'
    },
    {
        name: 'Metallergy Syndrome',
        symptoms: 'Autoimmune reaction to metal, Hives near implants, Systemic reaction',
        protocol: 'Scan -> Oral -> Oral -> IV',
        medications: 'Oral Chelation (x2), then IV Flush',
        alert: 'Do NOT use Injections (metallic needles)'
    },
    // Distractor Diagnoses (for reference)
    {
        name: 'Severe Sepsis',
        symptoms: 'Fever, Low BP, Elevated lactate',
        protocol: 'Not a game case',
        medications: 'IV Antibiotics, Fluids',
        alert: 'Source control critical'
    },
    {
        name: 'Acute Asthma Attack',
        symptoms: 'Wheezing, Shortness of breath, Chest tightness',
        protocol: 'Not a game case',
        medications: 'Bronchodilators, Steroids',
        alert: 'No skin involvement typically'
    },
    {
        name: 'Panic Disorder',
        symptoms: 'Hyperventilation, Palpitations, Dizziness',
        protocol: 'Not a game case',
        medications: 'Reassurance, Anxiolytics',
        alert: 'Diagnosis of exclusion'
    },
    {
        name: 'Stimulant Overdose',
        symptoms: 'Tachycardia, Agitation, Hyperthermia',
        protocol: 'Not a game case',
        medications: 'Benzodiazepines, Supportive care',
        alert: 'Check for drug use history'
    },
    {
        name: 'Heat Stroke',
        symptoms: 'High temp, Altered consciousness, Dry skin',
        protocol: 'Not a game case',
        medications: 'Rapid cooling, IV Fluids',
        alert: 'Environmental exposure history'
    },
    {
        name: 'Liver Failure',
        symptoms: 'Coagulopathy, Jaundice, Encephalopathy',
        protocol: 'Not a game case',
        medications: 'Supportive care, Transplant evaluation',
        alert: 'Check liver function tests'
    },
    {
        name: 'Disseminated Intravascular Coagulation',
        symptoms: 'Bleeding, Clotting, Low platelets',
        protocol: 'Not a game case',
        medications: 'Treat underlying cause, Supportive',
        alert: 'Complex coagulation disorder'
    },
    {
        name: 'Contact Dermatitis',
        symptoms: 'Localized rash, Itching, Redness',
        protocol: 'Not a game case',
        medications: 'Topical steroids, Avoidance',
        alert: 'Usually localized, not systemic'
    },
    {
        name: 'Implant Infection',
        symptoms: 'Fever, Pain at site, Swelling',
        protocol: 'Not a game case',
        medications: 'Antibiotics, Possible removal',
        alert: 'Look for signs of infection'
    }
];

const Handbook = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredData = TEXTBOOK_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="handbook-overlay animate-fade-in" onClick={onClose}>
            <div className="handbook-modal glass-panel" onClick={e => e.stopPropagation()}>
                <div className="handbook-header">
                    <h2>Medical Handbook</h2>
                    <button className="close-btn" onClick={onClose}>X</button>
                </div>

                <div className="handbook-search">
                    <input
                        type="text"
                        placeholder="Search symptoms or disease..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="handbook-content">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, idx) => (
                            <div key={idx} className="handbook-entry">
                                <h3>{item.name}</h3>
                                <p><strong>Symptoms:</strong> {item.symptoms}</p>
                                <p><strong>Protocol:</strong> <span className="protocol-text">{item.protocol}</span></p>
                                <p><strong>Medications:</strong> {item.medications}</p>
                                <p className="handbook-alert">ALERT: {item.alert}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No entry found in medical database.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Handbook;
