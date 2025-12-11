import { useState } from 'react';
import './Handbook.css';

const TEXTBOOK_DATA = [
    {
        name: 'Malignant Hyperthermia',
        symptoms: 'Rapid temp spike, Muscle rigidity, High CO2',
        protocol: 'IV (Dantrolene) x2 -> Oral (Cooling)',
        alert: 'Avoid Volatile Anesthetics'
    },
    {
        name: 'Anaphylaxis',
        symptoms: 'Airway constriction, Hypotension, Hives',
        protocol: 'Injection B (Epinephrine) x2 -> Oral (Antihistamine)',
        alert: 'Time Critical - Airway Risk'
    },
    {
        name: 'Thyroid Storm',
        symptoms: 'HR > 180, High Fever, Delirium/Agitation',
        protocol: 'Oral (Beta-Blocker) -> IV (Fluids) -> Injection A (Steroids)',
        alert: 'Multi-organ Failure Risk'
    },
    {
        name: 'Warfarin Toxicity',
        symptoms: 'Uncontrolled Bleeding, INR > 9.0',
        protocol: 'Injection A (Vit K) x2 -> Oral (Plasma)',
        alert: 'Hemorrhage Risk'
    },
    {
        name: 'Metallergy Syndrome',
        symptoms: 'Autoimmune reaction to metal, Hives near implants',
        protocol: 'Oral (Chelation) x2 -> IV (Flush)',
        alert: 'Do NOT use metallic needles (Injections)'
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
                    <h2>📚 Medical Handbook (Standard Issue)</h2>
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
                                <p className="handbook-alert">⚠️ {item.alert}</p>
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
