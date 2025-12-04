import { useGame } from '../context/GameContext';
import { useState } from 'react';
import './AccountabilityModal.css';

const AccountabilityModal = () => {
    const { discoveredClues, hasAcknowledgedFailure, acknowledgeFailure, failureReason } = useGame();
    const [reflection, setReflection] = useState('');

    const showModal = failureReason && !hasAcknowledgedFailure;

    if (!showModal) return null;

    const handleSubmit = () => {
        if (reflection.trim().length < 10) {
            alert('Please provide a meaningful reflection (at least 10 characters)');
            return;
        }
        acknowledgeFailure(reflection);
        setReflection(''); // Clear reflection for next time
    };

    return (
        <div className="modal-overlay">
            <div className="accountability-modal glass-panel animate-slide-down">
                <div className="modal-header">
                    <h2>Medical Incident Report Required</h2>
                </div>

                <div className="modal-content">
                    <div className="incident-summary">
                        <p><strong>Incident:</strong> Patient experienced adverse reaction to treatment.</p>
                        <p><strong>Status:</strong> Treatment unsuccessful. Patient condition worsened.</p>
                        {failureReason && (
                            <div className="failure-reason-box">
                                <strong>Root Cause Analysis:</strong>
                                <p>{failureReason}</p>
                            </div>
                        )}
                    </div>

                    <div className="reflection-section">
                        <label htmlFor="reflection">
                            <strong>Your Reflection (Required):</strong>
                            <span className="label-hint">What went wrong? What should you have considered?</span>
                        </label>
                        <textarea
                            id="reflection"
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            placeholder="I should have considered... Before administering treatment, I overlooked..."
                            rows={5}
                        />
                    </div>

                    <div className="accountability-prompt">
                        <p>Taking responsibility is the first step to finding the solution.</p>
                        <p>Acknowledging mistakes helps you make better decisions going forward.</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                        Acknowledge & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountabilityModal;
