const express = require('express');
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
const AUTH_DIR = './auth_info_baileys';
const DB_FILE = './conversations.json';

// Logger
const logger = pino({ level: 'error' });

// Estado global
let sock = null;
let qrCodeData = null;
let isConnected = false;
let userSessions = {}; // Rastrear sessões de usuários

// Inicializar banco de dados
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ conversations: [] }, null, 2));
  }
}

// Salvar conversa
function saveConversation(senderPhone, recipientPhone, originalMessage, filteredMessage, status) {
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  data.conversations.push({
    timestamp: new Date().toISOString(),
    sender: senderPhone,
    recipient: recipientPhone,
    original: originalMessage,
    filtered: filteredMessage,
    status: status
  });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Filtro de mensagens (análise local)
function analyzeMessage(text) {
  // Palavras-chave que indicam mensagens agressivas/desrespeitosas
  const blockedKeywords = [
    'incompetente', 'negligente', 'irresponsável', 'idiota', 'burro',
    'xingamento', 'maldição', 'desgraçado', 'miserável', 'lixo',
    'você é', 'você é um', 'você é uma'
  ];

  const filterKeywords = [
    'sempre', 'nunca', 'jamais', 'por sua culpa', 'sua culpa',
    'você não', 'você nunca', 'você sempre'
  ];

  const textLower = text.toLowerCase();

  // Verificar palavras bloqueadas
  for (const keyword of blockedKeywords) {
    if (textLower.includes(keyword)) {
      return {
        status: 'blocked',
        reason: 'Mensagem contém linguagem agressiva ou desrespeitosa',
        suggestion: null
      };
    }
  }

  // Verificar palavras que precisam filtro
  let needsFilter = false;
  for (const keyword of filterKeywords) {
    if (textLower.includes(keyword)) {
      needsFilter = true;
      break;
    }
  }

  // Se a mensagem é muito longa (desabafo emocional)
  if (text.length > 200) {
    needsFilter = true;
  }

  if (needsFilter) {
    // Gerar sugestão de mensagem filtrada
    let suggestion = text
      .replace(/sempre/gi, '')
      .replace(/nunca/gi, '')
      .replace(/jamais/gi, '')
      .replace(/por sua culpa/gi, '')
      .replace(/sua culpa/gi, '')
      .replace(/você não/gi, '')
      .replace(/você nunca/gi, '')
      .replace(/você sempre/gi, '')
      .trim();

    // Limpar espaços extras
    suggestion = suggestion.replace(/\s+/g, ' ');

    // Se ficou muito curto, usar original
    if (suggestion.length < 10) {
      suggestion = text;
    }

    return {
      status: 'filtered',
      reason: 'Mensagem contém linguagem que pode ser melhorada',
      suggestion: suggestion
    };
  }

  return {
    status: 'approved',
    reason: 'Mensagem está apropriada',
    suggestion: null
  };
}

// Conectar ao WhatsApp
async function connectToWhatsApp() {
  console.log('\n🔄 Conectando ao WhatsApp...\n');

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  sock = makeWASocket({
    auth: state,
    logger: logger,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📱 Escaneie este código QR com seu WhatsApp:\n');
      qrcode.generate(qr, { small: true });
      qrCodeData = qr;
    }

    if (connection === 'connecting') {
      console.log('🔄 Conectando...');
    }

    if (connection === 'open') {
      console.log('\n✅ Conectado ao WhatsApp com sucesso!\n');
      console.log('🤖 Agente ativo e aguardando mensagens...\n');
      isConnected = true;
    }

    if (connection === 'close') {
      if (new (require('@hapi/boom')).Boom(lastDisconnect?.error).output.statusCode !== DisconnectReason.loggedOut) {
        connectToWhatsApp();
      } else {
        console.log('❌ Desconectado do WhatsApp');
        isConnected = false;
      }
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];

    if (msg.key.fromMe) return;
    if (msg.key.remoteJid.endsWith('@g.us')) return;

    const senderPhone = msg.key.remoteJid.replace('@s.whatsapp.net', '');
    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

    if (!messageText) return;

    console.log(`\n📱 Mensagem de ${senderPhone}:`);
    console.log(`   "${messageText}"\n`);

    try {
      await handleMessage(senderPhone, messageText);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error.message);
      await sendMessage(senderPhone, '❌ Erro ao processar sua mensagem. Tente novamente.');
    }
  });
}

// Enviar mensagem
async function sendMessage(phone, message) {
  if (!sock || !isConnected) {
    console.error('❌ Socket não está conectado');
    return;
  }

  try {
    await sock.sendMessage(phone + '@s.whatsapp.net', { text: message });
    console.log(`✅ Mensagem enviada para ${phone}`);
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error.message);
  }
}

// Processar mensagem
async function handleMessage(senderPhone, messageText) {
  // Inicializar sessão do usuário se não existir
  if (!userSessions[senderPhone]) {
    userSessions[senderPhone] = {
      step: 'waiting_recipient',
      recipientPhone: null,
      pendingMessage: null,
      pendingAnalysis: null
    };
  }

  const session = userSessions[senderPhone];

  // Passo 1: Aguardando número do destinatário
  if (session.step === 'waiting_recipient') {
    // Verificar se é um número de telefone
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (phoneRegex.test(messageText)) {
      session.recipientPhone = messageText.replace(/\D/g, '');
      session.step = 'waiting_message';
      await sendMessage(senderPhone, `✅ Destinatário registrado: ${messageText}\n\n📝 Agora envie a mensagem que deseja enviar:`);
      return;
    } else {
      await sendMessage(senderPhone, `👋 Bem-vindo ao Agente de Comunicação Parental!\n\n📱 Por favor, envie o número do destinatário (ex: +55 11 98765-4321):`);
      return;
    }
  }

  // Passo 2: Analisar mensagem
  if (session.step === 'waiting_message') {
    const analysis = analyzeMessage(messageText);
    session.pendingMessage = messageText;
    session.pendingAnalysis = analysis;

    if (analysis.status === 'approved') {
      // Mensagem aprovada - enviar direto
      await sendMessage(senderPhone, `✅ Sua mensagem está ótima!\n\n"${messageText}"\n\n📤 Enviando para ${session.recipientPhone}...`);
      await sendMessage(session.recipientPhone + '@s.whatsapp.net', `📨 Mensagem recebida:\n\n"${messageText}"`);
      saveConversation(senderPhone, session.recipientPhone, messageText, messageText, 'approved');
      
      session.step = 'waiting_message';
      await sendMessage(senderPhone, `\n✅ Mensagem entregue com sucesso!\n\n📝 Deseja enviar outra mensagem? (responda com o número do destinatário ou a mensagem)`);
      return;
    }

    if (analysis.status === 'filtered') {
      // Mensagem filtrada - pedir aprovação
      await sendMessage(senderPhone, `⚠️ Sua mensagem foi ajustada para melhorar a comunicação:\n\n"${analysis.suggestion}"\n\n👍 Responda "SIM" para enviar ou "NÃO" para cancelar:`);
      session.step = 'waiting_approval';
      return;
    }

    if (analysis.status === 'blocked') {
      // Mensagem bloqueada
      await sendMessage(senderPhone, `🚫 Sua mensagem não pode ser enviada.\n\n❌ Motivo: ${analysis.reason}\n\n💡 Tente reformular sua mensagem de forma mais respeitosa.`);
      session.step = 'waiting_message';
      await sendMessage(senderPhone, `\n📝 Envie uma nova mensagem:`);
      return;
    }
  }

  // Passo 3: Aguardando aprovação de mensagem filtrada
  if (session.step === 'waiting_approval') {
    if (messageText.toUpperCase() === 'SIM') {
      await sendMessage(senderPhone, `✅ Mensagem aprovada!\n\n"${session.pendingAnalysis.suggestion}"\n\n📤 Enviando para ${session.recipientPhone}...`);
      await sendMessage(session.recipientPhone + '@s.whatsapp.net', `📨 Mensagem recebida:\n\n"${session.pendingAnalysis.suggestion}"`);
      saveConversation(senderPhone, session.recipientPhone, session.pendingMessage, session.pendingAnalysis.suggestion, 'filtered_approved');
      
      session.step = 'waiting_message';
      await sendMessage(senderPhone, `\n✅ Mensagem entregue com sucesso!\n\n📝 Deseja enviar outra mensagem?`);
      return;
    }

    if (messageText.toUpperCase() === 'NÃO') {
      await sendMessage(senderPhone, `❌ Envio cancelado.\n\n📝 Envie uma nova mensagem ou reformule a anterior:`);
      session.step = 'waiting_message';
      return;
    }

    // Se não respondeu SIM ou NÃO
    await sendMessage(senderPhone, `❓ Por favor, responda "SIM" para enviar ou "NÃO" para cancelar:`);
  }
}

// Rotas HTTP
app.get('/', (req, res) => {
  res.json({
    status: isConnected ? '✅ Conectado' : '❌ Desconectado',
    message: 'Agente WhatsApp rodando',
    qrCode: qrCodeData ? 'QR Code disponível' : 'Não há QR Code pendente'
  });
});

app.get('/status', (req, res) => {
  res.json({
    connected: isConnected,
    timestamp: new Date().toISOString(),
    activeSessions: Object.keys(userSessions).length
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}\n`);
  
  initDatabase();
  connectToWhatsApp();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando agente...');
  process.exit(0);
});
