require("dotenv").config();
const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;

const chat = async (prompt, userMessages) => {
    try {
        const openai = new OpenAI({
            apiKey: openaiApiKey,
        });

        const messages = [
            { role: "system", content: prompt },
            ...userMessages.map(msg => ({ role: "user", content: msg.content }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages
        });

        // Obtener y mostrar los tokens utilizados en esta respuesta
        const tokensUsed = completion.usage.total_tokens;
        console.log(`Tokens usados: ${tokensUsed}`);

        const answ = completion.choices[0].message.content;
        return answ;
    } catch (err) {
        console.error("Error al conectar con OpenAI:", err);
        if (err.response && err.response.status === 402) {
            return `Error: No tienes suficientes créditos en tu cuenta de OpenAI.`;
        } else if (err.error && err.error.message) {
            return `Error: ${err.error.message}`;
        } else {
            return `Error: Ha ocurrido un problema con la API de OpenAI. ${err.message}`;
        }
    }
};

module.exports = { chat };
