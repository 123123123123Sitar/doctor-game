import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Using gemini-2.0-flash-exp model (latest available)
const MODEL_NAME = "gemini-2.0-flash-exp";

export const generateGameFeedback = async (playerName, caseData, responses, outcome, score) => {
    if (!API_KEY) {
        console.warn("Gemini API Key missing");
        return "Supervisor Feedback: [System Offline - Key Missing] Great effort, Doctor. Continue to study the protocols.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error);

        // Check for rate limiting
        if (error.message && error.message.includes('429')) {
            return `Supervisor Feedback: The AI feedback system is temporarily busy. Based on your performance: ${outcome === 'win' ? 'Well done, Doctor! You successfully treated the patient.' : 'Unfortunately, the patient was lost. Review the handbook and try again.'} Time: ${score.time}s, Errors: ${score.errors}.`;
        }

        return "Supervisor Feedback: Detailed report unavailable. Please review standard protocols.";
    }
};
