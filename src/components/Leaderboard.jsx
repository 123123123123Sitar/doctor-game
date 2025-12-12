import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import './Leaderboard.css';

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const Leaderboard = ({ newScore }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playerName } = useGame();
    const [name, setName] = useState(playerName || '');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // MOCK DATA for when no URL is provided
    const MOCK_SCORES = [
        { name: "Dr. House", time: 45, errors: 0, caseName: "Malignant Hyperthermia", difficulty: "hard" },
        { name: "Doc Brown", time: 52, errors: 0, caseName: "Anaphylaxis", difficulty: "medium" },
        { name: "Grey", time: 60, errors: 1, caseName: "Thyroid Storm", difficulty: "easy" },
        { name: "Strange", time: 40, errors: 2, caseName: "Metallergy Syndrome", difficulty: "hard" },
        { name: "Who", time: 30, errors: 5, caseName: "Unknown", difficulty: "medium" },
    ];

    useEffect(() => {
        if (playerName) setName(playerName);
    }, [playerName]);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        setLoading(true);
        if (!GOOGLE_SCRIPT_URL) {
            console.warn("No VITE_GOOGLE_SCRIPT_URL found. Using Mock Data.");
            // Simulate network delay
            setTimeout(() => {
                setScores(MOCK_SCORES);
                setLoading(false);
            }, 800);
            return;
        }

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL);
            const data = await response.json();
            if (Array.isArray(data)) {
                setScores(data);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);

        const scoreData = {
            name: name,
            time: newScore.time,
            errors: newScore.errors,
            caseName: newScore.caseName || 'Unknown',
            difficulty: newScore.difficulty || 'medium',
            handbookUsed: newScore.handbookUsed || false
        };

        if (!GOOGLE_SCRIPT_URL) {
            // Mock submission
            setTimeout(() => {
                const newScores = [...scores, scoreData].sort((a, b) => {
                    if (a.errors !== b.errors) return a.errors - b.errors;
                    return a.time - b.time;
                });
                setScores(newScores.slice(0, 10));
                setSubmitted(true);
                setSubmitting(false);
            }, 800);
            return;
        }

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script requirement for simple POSTs
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData)
            });
            // Since no-cors returns opaque response, we assume success or fetch refreshed list
            setSubmitted(true);
            // Refresh scores after short delay to allow sheet to update
            setTimeout(fetchScores, 1000);
        } catch (error) {
            console.error("Error submitting score:", error);
            alert("Failed to submit score. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="leaderboard-container glass-panel animate-fade-in">
            <h2>Global Leaderboard</h2>

            {!submitted && newScore ? (
                <div className="submit-score-section">
                    <h3>Record Your Victory</h3>
                    <div className="score-summary">
                        <span>Time: {newScore.time}s</span>
                        <span>Errors: {newScore.errors}</span>
                    </div>
                    <form onSubmit={handleSubmit} className="submit-form">
                        <input
                            type="text"
                            placeholder="Enter your name (Dr...)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={20}
                            disabled={submitting}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Join the Ranks'}
                        </button>
                    </form>
                </div>
            ) : submitted && (
                <div className="submit-success">
                    <p>Score Submitted Successfully.</p>
                </div>
            )}

            <div className="scores-table-wrapper">
                {loading ? (
                    <div className="loading-spinner">Loading Top Doctors...</div>
                ) : (
                    <table className="scores-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Errors</th>
                                <th>Time</th>
                                <th>Diff</th>
                                <th>Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.length === 0 ? (
                                <tr><td colSpan="6">No records yet. Be the first!</td></tr>
                            ) : (
                                scores.map((score, index) => (
                                    <tr key={index} className={score.name === name ? 'highlight-row' : ''}>
                                        <td>#{index + 1}</td>
                                        <td>{score.name}</td>
                                        <td>
                                            {score.errors === 0 ? <span className="perfect-star">★</span> : ''}
                                            {score.errors}
                                        </td>
                                        <td>{score.time}s</td>
                                        <td>{score.difficulty ? score.difficulty.charAt(0).toUpperCase() : 'M'}</td>
                                        <td className="case-col">{score.caseName}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {!GOOGLE_SCRIPT_URL && (
                <div className="mock-mode-banner">
                    <small>⚠️ Demo Mode (Local Mock Data)</small>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
