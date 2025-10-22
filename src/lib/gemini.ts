import { GoogleGenAI } from "@google/genai";
import { property } from "zod";

export async function generateLessonPlan(prompt: string) {
    const systemInstruction = "Você é um especialista em pedagogia e Base Nacional Comum Curricular (BNCC). Sua tarefa é gerar um Plano de Aula. A sua resposta DEVE ser estritamente em formato JSON, contendo as chaves: introdution_ludic, bncc_learning_objectives, activity_step_by_step, e assessment_rubric. NÃO inclua nenhum texto ou formatação fora do objeto JSON.";
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    introdution_ludic: { type: "string" },
                    bncc_learning_objectives: { type: "string" },
                    activity_step_by_step: { type: "string" },
                    assessment_rubric: { type: "string" }
                },
                required: [
                    "introdution_ludic",
                    "bncc_learning_objectives",
                    "activity_step_by_step",
                    "assessment_rubric"
                ]
            },
            systemInstruction: {parts: [{text: systemInstruction}]}
        }
    });
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log(responseText);

    return responseText;
}