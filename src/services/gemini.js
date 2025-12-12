const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Models to try in order of preference with their API versions
const GEMINI_ENDPOINTS = [
    // 2.5 generation
    { version: 'v1beta', model: 'gemini-2.5-flash' },
    { version: 'v1beta', model: 'gemini-2.5-pro' },
    { version: 'v1beta', model: 'gemini-2.5-flash-lite' },
    // 2.0 generation
    { version: 'v1beta', model: 'gemini-2.0-flash' },
    // 1.x generation
    { version: 'v1beta', model: 'gemini-1.5-flash' },
    { version: 'v1beta', model: 'gemini-1.5-pro' },
    { version: 'v1beta', model: 'gemini-1.0-pro' },
    { version: 'v1beta', model: 'gemini-pro' },
    // Mirror the same list on v1 endpoints
    { version: 'v1', model: 'gemini-2.5-flash' },
    { version: 'v1', model: 'gemini-2.5-pro' },
    { version: 'v1', model: 'gemini-2.5-flash-lite' },
    { version: 'v1', model: 'gemini-2.0-flash' },
    { version: 'v1', model: 'gemini-1.5-flash' },
    { version: 'v1', model: 'gemini-1.5-pro' },
    { version: 'v1', model: 'gemini-1.0-pro' },
    { version: 'v1', model: 'gemini-pro' }
];

const callGeminiAPI = async (version, model, prompt) => {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

export const generateGameFeedback = async (playerName, caseData, responses, outcome, score) => {
    if (!API_KEY) {
        console.warn("Gemini API Key missing");
        return generateFallbackFeedback(playerName, outcome, score);
    }

    const prompt = `You are a Senior Medical Resident Supervisor giving feedback to a junior doctor named ${playerName}.

Context:
- Case: ${caseData.name}
- Outcome: ${outcome} (Win/Loss)
- Final Score: ${score.errors} Errors, ${score.time}s Time

Correct Protocol: ${caseData.scanClue}

Player's Actions Log:
${responses.map(r => `- ${r.timestamp}s: ${r.action} (${r.result})`).join('\n')}

Task:
Provide brief, constructive, and professional feedback (max 3 sentences). 
If they won, congratulate them but point out any minor errors if present.
If they lost, explain the critical mistake in a firm but educational tone.
Focus on clinical reasoning. Do not use emojis.`;

    // Try each endpoint until one works
    for (const endpoint of GEMINI_ENDPOINTS) {
        try {
            console.log(`Trying: ${endpoint.version}/${endpoint.model}`);
            const result = await callGeminiAPI(endpoint.version, endpoint.model, prompt);
            if (result) {
                console.log(`Success with: ${endpoint.version}/${endpoint.model}`);
                return result;
            }
        } catch (error) {
            console.warn(`${endpoint.version}/${endpoint.model} failed:`, error.message);
            // Continue to next endpoint
        }
    }

    // All endpoints failed
    console.error("All Gemini endpoints failed");
    return generateFallbackFeedback(playerName, outcome, score);
};

const generateFallbackFeedback = (playerName, outcome, score) => {
    if (outcome === 'win') {
        if (score.errors === 0) {
            return `Excellent work, Dr. ${playerName}. Perfect execution of the protocol in ${score.time} seconds. Your clinical reasoning was flawless.`;
        } else {
            return `Good job, Dr. ${playerName}. You saved the patient in ${score.time} seconds, though ${score.errors} protocol deviation(s) were noted. Review your approach for improvement.`;
        }
    } else {
        return `Dr. ${playerName}, the patient was lost. ${score.errors} critical error(s) led to this outcome. Please review the handbook and study the correct protocols before your next case.`;
    }
};
