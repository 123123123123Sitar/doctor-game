import { useState } from 'react';
import { useGame } from '../context/GameContext';
import './NameEntry.css';

const NameEntry = () => {
    const { setPlayerName, startGame, difficulty, setDifficulty } = useGame();
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            setPlayerName(name.trim());
            startGame();
        }
    };

    return (
        <div className="name-entry-container glass-panel animate-slide-up">
            <h2>Identity Verification</h2>
            <p>Please enter your name to begin your shift.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Name"
                    maxLength={20}
                    autoFocus
                    required
                />

                <div className="difficulty-selector">
                    <label>Clearance Level:</label>
                    <div className="difficulty-buttons">
                        {['easy', 'medium', 'hard'].map(level => (
                            <button
                                key={level}
                                type="button"
                                className={`btn-difficulty ${difficulty === level ? 'active' : ''}`}
                                onClick={() => setDifficulty(level)}
                            >
                                {level.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                    Clock In
                </button>
            </form>
        </div>
    );
};

export default NameEntry;
