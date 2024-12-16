// Leitor de QR code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const client = new Client();

// Lista de números permitidos para ativar/desativar o bot
const numerosPermitidos = ['']; // Adicione os números que você deseja permitir

// Serviço de leitura do QR code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Após isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa tudo
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

let botAtivo = true; // Variável para controlar se o bot está ativo
let ultimoEnvio = 0; // Variável para armazenar o timestamp da última resposta

// Funil
client.on('message', async msg => {
    const chat = await msg.getChat();

    const agora = Date.now(); // Tempo atual
    const intervalo = 86400000; // Intervalo de 1 dia (24 horas) em milissegundos

    // Verifica se a mensagem é de um número permitido
    const isPermittedUser = numerosPermitidos.includes(msg.from);

    // Comando para desativar o bot
    if (isPermittedUser && msg.body.toLowerCase() === 'desativar bot') {
        botAtivo = false;
        await client.sendMessage(msg.from, 'Bot desativado. Você pode assumir a conversa.');
        return;
    }

    // Comando para ativar o bot
    if (isPermittedUser && msg.body.toLowerCase() === 'ativar bot') {
        botAtivo = true;
        await client.sendMessage(msg.from, 'Bot ativado. Estou aqui para ajudar!');
        return;
    }

    // Verifica se o bot está ativo e se o intervalo de 24 horas foi cumprido
    if (botAtivo && (agora - ultimoEnvio) > intervalo) {
        ultimoEnvio = agora; // Atualiza o timestamp do último envio
        await delay(3000); // Delay de 3 segundos
        await chat.sendStateTyping(); // Simula digitação
        await delay(3000); // Delay de 3 segundos
        const contact = await msg.getContact(); // Pega o contato
        const name = contact.pushname || "amigo(a)";
        await client.sendMessage(msg.from, 'Olá! ' + name.split(" ")[0] + ', meu nome é Alex Maciel e sou colaborador da Brother´s Barbearia.\nComo posso melhorar sua auto-estima hoje?\n\nHorário de funcionamento: Segunda a sábado, das 08:00 às 20:00. Domingo, das 08:00 às 12:00.\n\nServiços e valores: ');
    }
});
