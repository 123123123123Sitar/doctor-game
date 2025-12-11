import { useGame } from '../context/GameContext';
import './PatientView.css';

const PatientView = () => {
    const { patientHealth, patientState } = useGame();

    const getHealthColor = () => {
        if (patientHealth >= 70) return 'var(--color-accent-green)';
        if (patientHealth >= 40) return 'var(--color-accent-orange)';
        return 'var(--color-accent-red)';
    };

    const getStateText = () => {
        if (patientState === 'stable') return 'STABLE';
        if (patientState === 'deteriorating') return 'DETERIORATING';
        return 'CRITICAL';
    };

    return (
        <div className="patient-view">
            <div className="patient-container">
                {/* Image removed for professional text-only interface */}
                <div className="patient-vitals glass-panel">
                    <div className="vital-row">
                        <span className="vital-label">Health:</span>
                        <div className="health-bar-container">
                            <div
                                className="health-bar-fill"
                                style={{
                                    width: `${patientHealth}%`,
                                    backgroundColor: getHealthColor()
                                }}
                            />
                        </div>
                        <span className="vital-value" style={{ color: getHealthColor() }}>
                            {Math.round(patientHealth)}%
                        </span>
                    </div>
                    <div className="patient-status">
                        <span className="status-text">{getStateText()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PatientView;
