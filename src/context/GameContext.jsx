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

        // Check if this treatment fails for the current case
        const isFailing = currentCase.failingTreatments.includes(treatment.type);
        const isCorrect = treatment.type === currentCase.correctTreatment;

        if (isFailing && !hasAcknowledgedFailure) {
            // Wrong treatment - patient reacts badly
            setPatientHealth(prev => Math.max(0, prev - 25));
            addAction({
                type: 'treatment_failed',
                name: treatment.name,
                result: `Treatment failed! ${currentCase.scanClue}`,
                healthChange: -25
            });
            discoverClue('treatment_failed');
            showNotification('Treatment Failed!', -25, 'failure');
            return false;
        } else if (isCorrect && discoveredClues.includes('treatment_failed') && hasAcknowledgedFailure) {
            // Correct treatment after acknowledgment
            setPatientHealth(prev => Math.min(100, prev + 40));
            addAction({
                type: 'treatment_success',
                name: treatment.name,
                result: 'Patient responds well! Symptoms improving.',
                healthChange: 40
            });
            showNotification('Treatment Working!', 40, 'success');

            // Check if patient is saved
            if (patientHealth + 40 >= 95) {
                setTimeout(() => setGameState('win'), 1000);
            }
            return true;
        } else if (treatment.type === 'scan') {
            // Scanning provides clues
            addAction({
                type: 'diagnostic',
                name: treatment.name,
                result: `Scan complete. ${currentCase.scanClue}`
            });
            discoverClue('scan_complete');
            showNotification('Scan Complete', null, 'neutral');
            return true;
        } else {
            // Partial success or neutral
            const healthChange = Math.random() > 0.5 ? 5 : -5;
            setPatientHealth(prev => Math.max(0, Math.min(100, prev + healthChange)));
            addAction({
                type: 'treatment_attempted',
                name: treatment.name,
                result: healthChange > 0 ? 'Slight improvement' : 'No significant change',
                healthChange
            });
            showNotification(
                healthChange > 0 ? 'Minor Improvement' : 'No Effect',
                healthChange,
                healthChange > 0 ? 'success' : 'neutral'
            );
            return healthChange > 0;
        }
    }, [currentCase, hasAcknowledgedFailure, discoveredClues, patientHealth, addAction, discoverClue, showNotification, setGameState]);

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
        acknowledgeFailure
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
