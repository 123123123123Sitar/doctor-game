import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import PatientView from './components/PatientView';
import ActionPanel from './components/ActionPanel';
import Database from './components/Database';
import AccountabilityModal from './components/AccountabilityModal';
import FloatingNotification from './components/FloatingNotification';
import ProtocolTracker from './components/ProtocolTracker';
import './App.css';

const GameScreen = () => {
    const { gameState, startGame } = useGame();
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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
                    <div className="start-description">
                        <p>A patient has arrived with a rare disease. You have limited time to diagnose and treat them.</p>
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
                </div>
            </div>
        );
    }

    if (gameState === 'win') {
        return (
            <div className="end-screen win-screen">
                <div className="end-content glass-panel animate-fade-in">
                    <div className="end-icon">SUCCESS</div>
                    <h1>Patient Saved!</h1>
                    <p>You successfully diagnosed and treated the rare condition.</p>
                    <div className="end-stats">
                        <p>Demonstrated critical thinking by analyzing symptoms</p>
                        <p>Took action when needed</p>
                        <p>Acknowledged mistakes and learned from them</p>
                    </div>
                    <button className="btn btn-success btn-large" onClick={startGame}>
                        New Case
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'lose') {
        return (
            <div className="end-screen lose-screen">
                <div className="end-content glass-panel animate-fade-in">
                    <div className="end-icon">FAILED</div>
                    <h1>Patient Lost</h1>
                    <p>Time ran out or the patient's condition deteriorated.</p>
                    <div className="end-stats">
                        <p>Remember: Taking time to analyze is important, but so is acting quickly.</p>
                        <p>Don't be afraid to acknowledge when something isn't working.</p>
                    </div>
                    <button className="btn btn-danger btn-large" onClick={startGame}>
                        Try Again
                    </button>
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
