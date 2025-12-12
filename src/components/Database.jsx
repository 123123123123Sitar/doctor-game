import { useGame } from '../context/GameContext';
import './Database.css';

const Database = () => {
    const { discoveredClues, actionHistory, currentCase } = useGame();

    const scanComplete = discoveredClues.includes('scan_complete');
    const hasFailed = discoveredClues.includes('treatment_failed');

    if (!currentCase) {
        return (
            <div className="database glass-panel">
                <div className="database-header">
                    <h2>Medical Database</h2>
                </div>
                <div className="database-placeholder">
                    <div className="placeholder-icon">DATABASE</div>
                    <p>Waiting for case assignment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="database glass-panel">
            <div className="database-header">
                <h2>Medical Database</h2>
            </div>

            {scanComplete ? (
                <div className="database-content">
                    <div className="database-intro">
                        <p>Scan Results: Rare disease detected. Review possible diagnoses below.</p>
                        {hasFailed && (
                            <div className="alert-box">
                                WARNING: Treatment failed! Review highlighted diagnosis carefully.
                            </div>
                        )}
                    </div>

                    <div className="diseases-list">
                        {currentCase.databases.map((entry, idx) => (
                            <div
                                key={idx}
                                className={`disease-card ${entry.highlighted && hasFailed ? 'highlighted' : ''}`}
                            >
                                <div className="disease-header">
                                    <h3>{entry.disease}</h3>
                                    <span className="probability">{entry.probability}</span>
                                </div>
                                <div className="disease-symptoms">
                                    <strong>Symptoms:</strong>
                                    <div className="symptoms-tags">
                                        {entry.symptoms.map((symptom, idx) => (
                                            <span key={idx} className="symptom-tag">{symptom}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="disease-cure">
                                    <strong>Recommended:</strong> {entry.cure}
                                </div>
                                <div className="disease-notes">
                                    {entry.notes}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="database-placeholder">
                    <div className="placeholder-icon">DATABASE</div>
                    <p>No scan data available yet.</p>
                    <p className="placeholder-hint">Use "Run Diagnostic Scan" to analyze the patient.</p>
                </div>
            )}

            <div className="action-log">
                <h3>Action History</h3>
                <div className="log-items">
                    {actionHistory.length === 0 ? (
                        <div className="log-empty">No actions taken yet</div>
                    ) : (
                        actionHistory.slice().reverse().map((action, idx) => (
                            <div key={idx} className={`log-item log-${action.type}`}>
                                <div className="log-name">{action.name}</div>
                                <div className="log-result">{action.result}</div>
                                {action.healthChange && (
                                    <div className={`log-health ${action.healthChange > 0 ? 'positive' : 'negative'}`}>
                                        {action.healthChange > 0 ? '+' : ''}{action.healthChange}%
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Database;
