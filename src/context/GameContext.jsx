import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getRandomCase } from '../data/medicalCases';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, win, lose
    const [currentCase, setCurrentCase] = useState(null);
    const [patientHealth, setPatientHealth] = useState(100);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [actionHistory, setActionHistory] = useState([]);
    const [discoveredClues, setDiscoveredClues] = useState([]);
    const [hasAcknowledgedFailure, setHasAcknowledgedFailure] = useState(false);
    const [treatmentAttempts, setTreatmentAttempts] = useState(0);
    const [patientState, setPatientState] = useState('stable'); // stable, deteriorating, critical
    const [notifications, setNotifications] = useState([]);
    const [sequenceProgress, setSequenceProgress] = useState(0);
    const [failureReason, setFailureReason] = useState(null);

    const showNotification = useCallback((message, healthChange, type) => {
        const id = Date.now() + Math.random();
        const notification = { id, message, healthChange, type };

        setNotifications(prev => [...prev, notification]);

        // Remove notification after animation completes
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 2000);
    }, []);

    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('lose');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // Health monitoring
    useEffect(() => {
        if (patientHealth <= 0) {
            setGameState('lose');
        } else if (patientHealth >= 90) {
            setPatientState('stable');
        } else if (patientHealth >= 50) {
            setPatientState('deteriorating');
        } else {
            setPatientState('critical');
        }
    }, [patientHealth]);

    const startGame = useCallback(() => {
        const newCase = getRandomCase();
        setCurrentCase(newCase);
        setGameState('playing');
        setPatientHealth(100);
        setTimeLeft(300);
        setActionHistory([]);
        setDiscoveredClues([]);
        setHasAcknowledgedFailure(false);
        setTreatmentAttempts(0);
        setPatientState('stable');
        setNotifications([]);
        setSequenceProgress(0);
        setFailureReason(null);
    }, []);

    const addAction = useCallback((action) => {
        setActionHistory(prev => [...prev, {
            ...action,
            timestamp: Date.now()
        }]);
    }, []);

    const discoverClue = useCallback((clue) => {
        setDiscoveredClues(prev => {
            if (prev.includes(clue)) return prev;
            return [...prev, clue];
        });
    }, []);

    const applyTreatment = useCallback((treatment) => {
        if (!currentCase) return false;

        setTreatmentAttempts(prev => prev + 1);

        // STICT SEQUENCE LOGIC
        // The game now relies entirely on the requiredSequence defined in the case.
        const expectedAction = currentCase.requiredSequence[sequenceProgress];

        console.log('Sequence Check:', {
            treatmentType: treatment.type,
            expectedAction,
            sequenceProgress,
            sequence: currentCase.requiredSequence
        });

        if (treatment.type !== expectedAction) {
            // WRONG STEP
            if (!hasAcknowledgedFailure) {
                // First time failing this step
                setPatientHealth(prev => Math.max(0, prev - 30));

                let reason = currentCase.failureMessage || "Incorrect procedure followed.";
                if (sequenceProgress === 0 && treatment.type !== 'scan') {
                    reason = "Protocol Violation: You must run a diagnostic scan before administering any treatment.";
                } else {
                    // Friendly hint about what was expected
                    const expectedName = expectedAction === 'injection_a' ? 'Injection A' :
                        expectedAction === 'injection_b' ? 'Injection B' :
                            expectedAction === 'iv' ? 'IV Drip' :
                                expectedAction === 'oral' ? 'Oral Meds' :
                                    expectedAction === 'scan' ? 'Diagnostic Scan' : expectedAction;
                    reason += ` (Expected step: ${expectedName})`;
                }

                setFailureReason(reason);

                addAction({
                    type: 'treatment_failed',
                    name: treatment.name,
                    result: `Protocol violation! ${reason}`,
                    healthChange: -30
                });
                discoverClue('treatment_failed');
                showNotification('Protocol Violation!', -30, 'failure');
                return false;
            } else {
                // Already acknowledged failure, just penalize
                showNotification('Incorrect Action', -5, 'failure');
                setPatientHealth(prev => Math.max(0, prev - 5));
                return false;
            }
        } else {
            // CORRECT STEP
            setSequenceProgress(prev => prev + 1);
            setHasAcknowledgedFailure(false);
            setFailureReason(null);

            // Check if this was the FINAL step
            if (sequenceProgress === currentCase.requiredSequence.length - 1) {
                // VICTORY
                setPatientHealth(100);
                addAction({
                    type: 'treatment_success',
                    name: treatment.name,
                    result: 'Protocol complete! Patient cured and stabilizing.',
                    healthChange: 40
                });
                showNotification('Patient Cured!', 40, 'success');
                setTimeout(() => setGameState('win'), 1500);
                return true;
            } else {
                // INTERMEDIATE STEP SUCCESS
                setPatientHealth(prev => Math.min(100, prev + 10)); // Reward helpful steps

                let resultMsg = 'Protocol step verified.';
                if (treatment.type === 'scan') {
                    resultMsg = `Scan complete. ${currentCase.scanClue}`;
                    discoverClue('scan_complete');
                    showNotification('Scan Complete', null, 'neutral');
                } else {
                    showNotification('Step Verified', 10, 'success');
                }

                addAction({
                    type: 'step_complete',
                    name: treatment.name,
                    result: resultMsg,
                    healthChange: 10
                });
                return true;
            }
        }
    }, [currentCase, hasAcknowledgedFailure, sequenceProgress, addAction, discoverClue, showNotification]);

    const acknowledgeFailure = useCallback((reflection) => {
        setHasAcknowledgedFailure(true);
        addAction({
            type: 'accountability',
            name: 'Medical Report',
            result: reflection
        });
        discoverClue('acknowledged_mistake');
    }, [addAction, discoverClue]);

    const value = {
        gameState,
        currentCase,
        patientHealth,
        timeLeft,
        actionHistory,
        discoveredClues,
        hasAcknowledgedFailure,
        treatmentAttempts,
        patientState,
        notifications,
        startGame,
        addAction,
        discoverClue,
        applyTreatment,
        acknowledgeFailure,
        failureReason
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
