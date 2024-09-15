const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { chat } = require('./scripts/chatgpt')

const flowSaludo = addKeyword(['hola', 'hello', 'hi', 'hey', 'ola', 'bonjour', 'ciao'])
    .addAction(async (ctx, ctxFn) => {
        // Primer prompt para responder con el saludo en el idioma correcto
        const promptSaludo = "Eres un asistente que determina el idioma del saludo y responde con el siguiente mensaje en el mismo idioma: 'Hola, como estas? para tu turno necesito que me digas esta info:\n\n1- Nombre\n2- Ciudad/País\n3- Idea y lugar del tattoo\n4- Lugar del tattoo (+foto tuya de donde es ese lugar)\n5- Foto de tu idea'";
        const text = ctx.body;

        // Llamada a la API de ChatGPT
        const responseSaludo = await chat(promptSaludo, [{ role: "user", content: text }]);

        // Enviar la primera respuesta al usuario
        await ctxFn.flowDynamic(responseSaludo);

        // Segundo prompt para agradecer la información proporcionada por el usuario
        const promptAgradecimiento = "Traduce el siguiente mensaje al idioma del usuario: 'Muchas Gracias! Ahora esperá a que AYER te responda para arreglar día y fecha! Si necesitas saber como tenés que cuidar el tattoo, solo escribe \"Cuidado\"'";
        
        // Llamada a la API para obtener la traducción del agradecimiento
        const responseAgradecimiento = await chat(promptAgradecimiento, [{ role: "user", content: ctx.body }]);

        // Enviar el agradecimiento al usuario
        return await ctxFn.flowDynamic(responseAgradecimiento);
    });

const flowEsperaRespuesta = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { gotoFlow }) => {
        // Verificar si el usuario quiere información sobre cuidados
        if (ctx.body.toLowerCase() === 'cuidado') {
            return gotoFlow(flowCuidado);
        }
        // Si no es "cuidado", no hacer nada
        return;
    });

const flowCuidado = addKeyword(['cuidado', 'care', 'soin', 'cura'])
    .addAction(async (ctx, { flowDynamic }) => {
        // Prompt para enviar información sobre cuidados del tattoo
        const promptCuidado = "Traduce el siguiente mensaje al idioma del usuario: 'Aquí tienes la información sobre el cuidado del tattoo:'";
        
        const responseCuidado = await chat(promptCuidado, [{ role: "user", content: ctx.body }]);

        // Enviar la respuesta al usuario
        await flowDynamic(responseCuidado);

        // Aquí podés añadir la lógica para enviar el archivo PDF
        // Ejemplo: await ctx.sendFile('ruta/al/archivo/cuidado_tattoo.pdf');
    });

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        // No hacemos nada aquí, esperamos las palabras clave
    });

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowSaludo, flowCuidado, flowPrincipal, flowEsperaRespuesta]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
