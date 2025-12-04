import React from 'react';
import { useGame } from '../context/GameContext';
import './ProtocolTracker.css';

const ProtocolTracker = () => {
    const { currentCase, sequenceProgress, discoveredClues } = useGame();

    if (!currentCase || !currentCase.requiredSequence) return null;

    // Only show the tracker if the player has scanned the patient
    // This maintains some difficulty - they have to scan to "unlock" the protocol view
    const hasScanned = discoveredClues.includes('scan_complete');

    if (!hasScanned) {
        return (
            <div className="protocol-tracker glass-panel">
                <h3>Treatment Protocol</h3>
                <div className="protocol-placeholder">
                    <p>⚠️ Run Diagnostic Scan to identify protocol</p>
                </div>
            </div>
        );
    }

    const getStepLabel = (type) => {
        switch (type) {
            case 'scan': return 'Diagnostic Scan';
            case 'oral': return 'Oral Meds';
            case 'iv': return 'IV Drip';
            case 'injection_a': return 'Injection A';
            case 'injection_b': return 'Injection B';
            default: return type;
        }
    };

    return (
        <div className="protocol-tracker glass-panel">
            <h3>Required Protocol</h3>
            <div className="steps-container">
                {currentCase.requiredSequence.map((step, index) => {
                    let status = 'pending';
                    if (index < sequenceProgress) status = 'completed';
                    else if (index === sequenceProgress) status = 'current';

                    return (
                        <div key={index} className={`protocol-step ${status}`}>
                            <div className="step-indicator">
                                {status === 'completed' ? '✓' : index + 1}
                            </div>
                            <div className="step-label">
                                {getStepLabel(step)}
                            </div>
                            {index < currentCase.requiredSequence.length - 1 && (
                                <div className="step-connector" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProtocolTracker;
