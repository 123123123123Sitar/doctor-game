import { useGame } from '../context/GameContext';
import { useState } from 'react';
import './ActionPanel.css';

const TREATMENTS = [
    {
        id: 'scan',
        name: 'Run Diagnostic Scan',
        type: 'scan',
        icon: 'SCAN',
        description: 'Analyze patient vitals and symptoms'
    },
    {
        id: 'injection_a',
        name: 'Injection A (Standard)',
        type: 'injection_a',
        icon: 'INJ-A',
        description: 'Standard metallic needle delivery'
    },
    {
        id: 'injection_b',
        name: 'Injection B (Epinephrine)',
        type: 'injection_b',
        icon: 'INJ-B',
        description: 'Alternative metallic needle delivery'
    },
    {
        id: 'oral',
        name: 'Administer Oral Treatment',
        type: 'oral',
        icon: 'ORAL',
        description: 'Pill-based delivery method'
    },
    {
        id: 'iv',
        name: 'IV Drip Treatment',
        type: 'iv',
        icon: 'IV',
        description: 'Continuous intravenous delivery'
    }
];

const ActionPanel = () => {
    const { timeLeft, applyTreatment, discoveredClues, logResponse } = useGame();
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = () => {
        if (timeLeft > 180) return 'var(--color-accent-green)';
        if (timeLeft > 60) return 'var(--color-accent-orange)';
        return 'var(--color-accent-red)';
    };

    const handleTreatment = (treatment) => {
        setSelectedTreatment(treatment);
        setTimeout(() => {
            applyTreatment(treatment);
            logResponse(treatment.name, 'Attempted');
            setSelectedTreatment(null);
        }, 500);
    };

    const getClueText = (clue) => {
        switch (clue) {
            case 'allergic_reaction':
                return 'ALERT: Patient shows severe allergic reaction to metal-based treatment!';
            case 'scan_complete':
                return 'Diagnostic scan completed - Database now accessible with possible diagnoses';
            case 'acknowledged_mistake':
                return 'Medical incident report filed and acknowledged';
            default:
                return clue;
        }
    };

    return (
        <div className="action-panel glass-panel">
            <div className="action-header">
                <h2>Quick Actions</h2>
                <div className="timer" style={{ color: getTimeColor() }}>
                    <span className="timer-label">TIME:</span>
                    <span className="timer-value">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="treatments-grid">
                {TREATMENTS.map(treatment => (
                    <button
                        key={treatment.id}
                        className={`treatment-card ${selectedTreatment?.id === treatment.id ? 'selected' : ''}`}
                        onClick={() => handleTreatment(treatment)}
                        disabled={selectedTreatment !== null}
                    >
                        <div className="treatment-icon">{treatment.icon}</div>
                        <div className="treatment-info">
                            <div className="treatment-name">{treatment.name}</div>
                            <div className="treatment-desc">{treatment.description}</div>
                        </div>
                    </button>
                ))}
            </div>

            {discoveredClues.length > 0 && (
                <div className="clues-section">
                    <h3>Discovered Clues</h3>
                    <div className="clues-list">
                        {discoveredClues.map((clue, idx) => (
                            <div key={idx} className="clue-item animate-slide-up">
                                {getClueText(clue)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionPanel;
