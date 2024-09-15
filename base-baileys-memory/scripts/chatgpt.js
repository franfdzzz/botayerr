require("dotenv").config();
const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;
let tokenCount = 0;  // Variable global para llevar el conteo de tokens
const TOKEN_LIMIT = 300;  // Límite de tokens

const chat = async (prompt, userMessage) => {
    try {
        if (tokenCount >= TOKEN_LIMIT) {
            return "Límite de tokens alcanzado. No se pueden generar más respuestas.";
        }

        const openai = new OpenAI({
            apiKey: openaiApiKey,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: userMessage }
            ]
        });

        // Sumar tokens utilizados en esta respuesta
        const tokensUsed = completion.usage.total_tokens;  // Obtener tokens utilizados
        tokenCount += tokensUsed;

        const answ = completion.choices[0].message.content;
        return answ;
    } catch (err) {
        console.error("Error al conectar con OpenAI:", err);
        return `Error, no te quedan tokens`;
    }
};

module.exports = { chat };
