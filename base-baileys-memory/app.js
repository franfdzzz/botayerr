const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSaludo = addKeyword(['hola', 'hello', 'hi', 'hey', 'ola', 'bonjour', 'ciao'])
    .addAnswer('Hola, para tu turno necesito la siguiente información. Por favor, proporciona estos detalles comenzando tu respuesta con "Acá está la info":\n\n1- Nombre\n2- Ciudad\n3- Idea del tattoo\n4- Foto del lugar de tu cuerpo donde lo querés hacer\n5- Foto de tu idea\n\n🇦🇷\n---\nHello, for your appointment I need the following information. Please provide these details starting your reply with "Here\'s the info":\n\n1- Name\n2- City\n3- Tattoo idea\n4- Photo of the body part where you want to get it\n5- Photo of your idea\n\n🇺🇸')

const flowInfoRecibida = addKeyword(['Acá está la info', 'Aca esta la info', 'Here\'s the info'])
    .addAnswer('Ahora solo esperá a que AYER te responda, asi agendan tu turno! Si necesitas mas info sobre cuidados del tattoo, escribe "cuidados"\n🇦🇷\n---\nNow just wait for AYER to respond to schedule your appointment! If you need more info about tattoo care, write "care"\n🇺🇸')

const flowCuidado = addKeyword(['cuidado', 'cuidados', 'care', 'soin', 'cura'])
    .addAnswer([
        '✨CUIDADOS✨\n🇦🇷',
        '',
        '1. Quitar la protección pasadas las 3 h.',
        '',
        '2. Lavar el tattoo con agua tibia y jabón de glicerina neutro o uno espechaífico para tattoo (3 veces × día durante 15 días).',
        '',
        '3. Secar la zona apoyando una servilleta (no frotar).',
        '',
        '4. A las 48 h (antes en caso de notar el tattoo muy seco) comenzar con la aplicación de la crema específica, masajeando hasta que esta se absorba (2 veces x día durante 15 días).',
        '',
        'Evitar (durante 15 días):',
        '- Exposición al sol.',
        '- Playas, ríos y piletas.',
        '- Roces fuertes en la zona.',
        '- Contacto del tattoo con humo, desodorantes y animales.',
        '',
        '---',
        '',
        '✨CARE✨\n🇺🇸',
        '',
        '1. Remove the protection after 3 hours.',
        '',
        '2. Wash the tattoo with lukewarm water and neutral glycerin soap or a specific tattoo soap (3 times a day for 15 days).',
        '',
        '3. Dry the area by patting with a napkin (do not rub).',
        '',
        '4. After 48 hours (or earlier if you notice the tattoo is very dry), start applying the specific cream, massaging until it\'s absorbed (2 times a day for 15 days).',
        '',
        'Avoid (for 15 days):',
        '- Sun exposure.',
        '- Beaches, rivers, and pools.',
        '- Strong friction in the area.',
        '- Contact of the tattoo with smoke, deodorants, and animals.'
    ])

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido! Escribe "hola" para comenzar o "cuidados" para información sobre cuidados del tattoo.\n🇦🇷\n---\nWelcome! Type "hello" to start or "care" for information about tattoo care.\n🇺🇸');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowSaludo, flowInfoRecibida, flowCuidado, flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
