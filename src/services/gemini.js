import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Models to try in order of preference
const MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
];

export const generateGameFeedback = async (playerName, caseData, responses, outcome, score) => {
    if (!API_KEY) {
        console.warn("Gemini API Key missing");
        return generateFallbackFeedback(playerName, outcome, score);
    }

    const prompt = `
    You are a Senior Medical Resident Supervisor giving feedback to a junior doctor named ${playerName}.
    
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
    Focus on clinical reasoning. Do not use emojis.
    `;

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Try each model until one works
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            console.log(`Success with model: ${modelName}`);
            return result.response.text();
        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            // Continue to next model
        }
    }

    // All models failed
    console.error("All Gemini models failed");
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
