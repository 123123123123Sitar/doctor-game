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

    const prompt = `You are a mentor giving simple, encouraging feedback to ${playerName} who just played a doctor simulation game.

Game Result:
- Case: ${caseData.name}
- ${outcome === 'win' ? 'SUCCESS - Patient saved!' : 'FAILURE - Patient lost'}
- Time: ${score.time} seconds
- Mistakes: ${score.errors}

Their actions:
${responses.map(r => `- ${r.action}`).join('\n')}

Give feedback in 2-3 short sentences focusing on these skills:
1. ACCOUNTABILITY - Did they own their decisions and learn from mistakes?
2. ACTION ORIENTED - Did they act quickly and decisively?
3. CRITICAL THINKING - Did they analyze before acting?

Keep it simple, friendly, and educational. No medical jargon. No emojis.`;

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
