import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import PatientView from './components/PatientView';
import ActionPanel from './components/ActionPanel';
import Database from './components/Database';
import AccountabilityModal from './components/AccountabilityModal';
import FloatingNotification from './components/FloatingNotification';
import ProtocolTracker from './components/ProtocolTracker';
import Leaderboard from './components/Leaderboard';
import NameEntry from './components/NameEntry';
import { generateGameFeedback } from './services/gemini';
import './App.css';

const GameScreen = () => {
    const { gameState, startGame, timeLeft, errorCount, currentCase, playerName, playerResponses } = useGame();
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const [aiFeedback, setAiFeedback] = useState('');
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    useEffect(() => {
        if (gameState === 'win' || gameState === 'lose') {
            setLoadingFeedback(true);
            const score = { time: 300 - timeLeft, errors: errorCount };
            generateGameFeedback(playerName, currentCase, playerResponses, gameState, score)
                .then(feedback => {
                    setAiFeedback(feedback);
                    setLoadingFeedback(false);
                });
        } else {
            setAiFeedback('');
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const handleScroll = (e) => {
            const scrollPosition = e.target.scrollTop;
            const viewportHeight = window.innerHeight;

            // Hide indicator if scrolled past halfway through first section
            setShowScrollIndicator(scrollPosition < viewportHeight / 2);
        };

        const gameScreen = document.querySelector('.game-screen');
        if (gameScreen) {
            gameScreen.addEventListener('scroll', handleScroll);
            return () => gameScreen.removeEventListener('scroll', handleScroll);
        }
    }, [gameState]);

    if (gameState === 'start') {
        return (
            <div className="start-screen">
                <div className="start-content glass-panel animate-slide-up">
                    <h1>Emergency Room</h1>
                    <h2>Critical Case</h2>

                    {!playerName ? (
                        <NameEntry />
                    ) : (
                        <>
                            <div className="start-description">
                                <p>Welcome, Dr. {playerName}. A patient has arrived with a rare disease.</p>
                                <p><strong>Your mission:</strong></p>
                                <ul>
                                    <li>Analyze symptoms carefully (Critical Thinking)</li>
                                    <li>Make quick decisions (Action Oriented)</li>
                                    <li>Take responsibility for outcomes (Accountability)</li>
                                </ul>
                            </div>
                            <button className="btn btn-primary btn-large" onClick={startGame}>
                                Start Emergency
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (gameState === 'win' || gameState === 'lose') {
        const score = {
            time: 300 - timeLeft,
            errors: errorCount,
            caseName: currentCase?.name
        };

        const isWin = gameState === 'win';

        return (
            <div className={`end-screen ${isWin ? 'win-screen' : 'lose-screen'}`}>
                <div className="end-content glass-panel animate-fade-in" style={{ maxWidth: '800px' }}>
                    <div className="end-icon">{isWin ? 'SUCCESS' : 'CRITICAL FAILURE'}</div>
                    <h1>{isWin ? 'Patient Stabilized' : 'Patient Lost'}</h1>

                    <div className="feedback-section" style={{ textAlign: 'left', margin: '20px 0', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                        <h3 style={{ color: '#64ffda', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Supervisor Feedback</h3>
                        {loadingFeedback ? (
                            <p className="animate-pulse">Generating performance review...</p>
                        ) : (
                            <p style={{ lineHeight: '1.6' }}>{aiFeedback}</p>
                        )}
                    </div>

                    <div className="log-section" style={{ textAlign: 'left', maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h4 style={{ color: '#ccc', fontSize: '0.9rem' }}>Action Log:</h4>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#aaa' }}>
                            {playerResponses.map((r, i) => (
                                <li key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '4px 0' }}>
                                    <span style={{ color: '#fff' }}>[{r.timestamp}s]</span> {r.action} - {r.result}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isWin && <Leaderboard newScore={score} />}

                    <div className="end-stats">
                        <p>Time Elapsed: {score.time}s</p>
                        <p>Protocol Errors: {score.errors}</p>
                    </div>

                    {!loadingFeedback && (
                        <button className={`btn ${isWin ? 'btn-success' : 'btn-danger'} btn-large`} onClick={startGame}>
                            Next Case
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const scrollToControls = () => {
        const controlsSection = document.querySelector('.controls-section');
        if (controlsSection) {
            controlsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="game-screen">
            <div className="game-layout">
                <section className="game-section patient-section">
                    <div className="patient-section-content">
                        <PatientView />
                    </div>
                    {showScrollIndicator && (
                        <div className="scroll-indicator" onClick={scrollToControls}>
                            <span>Scroll for Controls</span>
                            <span className="scroll-indicator-icon">↓</span>
                        </div>
                    )}
                </section>

                <section className="game-section controls-section">
                    <div className="controls-section-content">
                        <div className="controls-grid-left">
                            <Database />
                        </div>
                        <div className="controls-grid-right">
                            <ProtocolTracker />
                            <ActionPanel />
                        </div>
                    </div>
                </section>
            </div>
            <AccountabilityModal />
            <FloatingNotification />
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <div className="app">
                <GameScreen />
            </div>
        </GameProvider>
    );
}

export default App;
