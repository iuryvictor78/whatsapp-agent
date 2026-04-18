const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const { analyzeMessageLocal } = require("./messageFilterLocal");
const { initDatabase, saveConversation, savePendingApproval, getPendingApproval, removePendingApproval } = require("./database");

// Configurações
const DB_FILE = process.env.DB_FILE || "./conversations.json";
const AUTH_DIR = "./auth_info_baileys";

// Logger
const logger = pino({ level: "error" });

// Armazenar estado do agente
let sock = null;
let userState = {}; // Rastrear estado de cada usuário

// Inicializar banco de dados
initDatabase();

/**
 * Conectar ao WhatsApp usando Baileys
 */
async function connectToWhatsApp() {
  console.log("\n🔄 Conectando ao WhatsApp...\n");

  // Carregar estado de autenticação
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  // Criar socket
  sock = makeWASocket({
    auth: state,
    logger: logger,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  // Salvar credenciais quando atualizarem
  sock.ev.on("creds.update", saveCreds);

  // Lidar com desconexão
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n📱 Escaneie este código QR com seu WhatsApp:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "connecting") {
      console.log("🔄 Conectando...");
    }

    if (connection === "open") {
      console.log("\n✅ Conectado ao WhatsApp com sucesso!\n");
      console.log("🤖 Agente ativo e aguardando mensagens...\n");
    }

    if (connection === "close") {
      if (new Boom(lastDisconnect?.error).output.statusCode !== DisconnectReason.loggedOut) {
        connectToWhatsApp();
      } else {
        console.log("❌ Desconectado do WhatsApp");
        process.exit(0);
      }
    }
  });

  // Processar mensagens recebidas
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];

    // Ignorar mensagens do próprio agente
    if (msg.key.fromMe) return;

    // Ignorar mensagens de grupo
    if (msg.key.remoteJid.endsWith("@g.us")) return;

    const senderPhone = msg.key.remoteJid.replace("@s.whatsapp.net", "");
    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    if (!messageText) return;

    console.log(`\n📱 Mensagem de ${senderPhone}:`);
    console.log(`   "${messageText}"\n`);

    try {
      await handleMessage(senderPhone, messageText, msg.key.id);
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error.message);
      await sendMessage(senderPhone, "❌ Erro ao processar sua mensagem. Tente novamente.");
    }
  });
}

/**
 * Processar mensagem recebida
 */
async function handleMessage(senderPhone, messageText, messageId) {
  // Inicializar estado do usuário
  if (!userState[senderPhone]) {
    userState[senderPhone] = {
      step: "initial",
      pendingMessage: null,
      recipientPhone: null,
    };
  }

  const state = userState[senderPhone];

  // Verificar se é aprovação de mensagem filtrada
  if (
    messageText.toLowerCase() === "sim" ||
    messageText.toLowerCase() === "aprovar" ||
    messageText.toLowerCase() === "s"
  ) {
    if (state.pendingMessage) {
      console.log(`✅ Aprovação recebida de ${senderPhone}`);

      const recipientPhone = state.pendingMessage.recipientPhone;
      const filteredContent = state.pendingMessage.filteredContent;

      // Enviar para destinatário
      await sendMessage(recipientPhone, `📨 Mensagem de ${senderPhone}:\n\n${filteredContent}`);

      // Registrar como enviada
      saveConversation(senderPhone, recipientPhone, state.pendingMessage.originalContent, "filtered_approved", {
        filteredContent: filteredContent,
        reason: state.pendingMessage.reason,
      });

      // Confirmar ao remetente
      await sendMessage(senderPhone, "✅ Sua mensagem foi aprovada e enviada!");

      // Limpar estado
      state.pendingMessage = null;
      state.step = "initial";
      return;
    }
  }

  // Verificar se é rejeição
  if (
    messageText.toLowerCase() === "não" ||
    messageText.toLowerCase() === "nao" ||
    messageText.toLowerCase() === "cancelar" ||
    messageText.toLowerCase() === "n"
  ) {
    if (state.pendingMessage) {
      console.log(`❌ Rejeição recebida de ${senderPhone}`);
      await sendMessage(senderPhone, "❌ Mensagem cancelada. Você pode tentar novamente com outra mensagem.");
      state.pendingMessage = null;
      state.step = "initial";
      return;
    }
  }

  // Verificar se é comando de histórico
  if (
    messageText.toLowerCase() === "histórico" ||
    messageText.toLowerCase() === "historico" ||
    messageText.toLowerCase() === "h"
  ) {
    await sendMessage(
      senderPhone,
      "📋 Para ver o histórico, qual é o número do outro responsável?\n(Envie apenas o número, ex: +5511999999999)"
    );
    state.step = "waiting_for_history_recipient";
    return;
  }

  // Se está esperando número do outro responsável para histórico
  if (state.step === "waiting_for_history_recipient") {
    const recipientPhone = messageText.replace(/\D/g, "");
    if (recipientPhone.length < 10) {
      await sendMessage(senderPhone, "❌ Número inválido. Tente novamente (ex: +5511999999999)");
      return;
    }

    // Buscar histórico
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const conversationKey = [senderPhone, recipientPhone].sort().join("_");
    const history = db.conversations[conversationKey] || [];

    if (history.length === 0) {
      await sendMessage(senderPhone, "📭 Nenhuma conversa encontrada com este número.");
    } else {
      let historyText = "📋 Histórico de Conversas:\n\n";
      history.slice(-10).forEach((msg, index) => {
        const status =
          msg.status === "approved"
            ? "✅"
            : msg.status === "filtered_approved"
            ? "🔄✅"
            : msg.status === "blocked"
            ? "❌"
            : "⏳";
        historyText += `${status} ${msg.from === senderPhone ? "Você" : "Outro"}:\n"${msg.originalContent}"\n\n`;
      });
      await sendMessage(senderPhone, historyText);
    }

    state.step = "initial";
    return;
  }

  // Se está esperando número do destinatário
  if (state.step === "waiting_for_recipient") {
    const recipientPhone = messageText.replace(/\D/g, "");
    if (recipientPhone.length < 10) {
      await sendMessage(senderPhone, "❌ Número inválido. Tente novamente (ex: +5511999999999)");
      return;
    }

    state.recipientPhone = recipientPhone;
    state.step = "initial";

    // Enviar mensagem aprovada
    const originalMessage = state.pendingMessage?.originalContent || messageText;
    await sendMessage(recipientPhone, `📨 Mensagem de ${senderPhone}:\n\n${originalMessage}`);

    saveConversation(senderPhone, recipientPhone, originalMessage, "approved", {});
    await sendMessage(senderPhone, "✅ Sua mensagem foi enviada!");
    return;
  }

  // Analisar mensagem com IA local
  console.log("🤖 Analisando mensagem com IA...");
  const analysis = await analyzeMessageLocal(messageText);

  console.log(`📊 Resultado: ${analysis.status}`);
  console.log(`📝 Motivo: ${analysis.reason}`);

  if (analysis.status === "approved") {
    // Mensagem aprovada - solicitar número do destinatário
    state.pendingMessage = {
      originalContent: messageText,
      filteredContent: messageText,
      reason: analysis.reason,
    };
    state.step = "waiting_for_recipient";

    await sendMessage(
      senderPhone,
      `✅ Sua mensagem está ótima!\n\n"${messageText}"\n\nQual é o número do destinatário? (ex: +5511999999999)`
    );
  } else if (analysis.status === "filtered") {
    // Mensagem filtrada - sugerir correção
    state.pendingMessage = {
      originalContent: messageText,
      filteredContent: analysis.filteredContent,
      reason: analysis.reason,
      recipientPhone: null,
    };
    state.step = "initial";

    await sendMessage(
      senderPhone,
      `⚠️ Sua mensagem foi ajustada para ser mais neutra e respeitosa:\n\n📝 Original:\n"${messageText}"\n\n✨ Sugestão:\n"${analysis.filteredContent}"\n\n${analysis.reason}\n\nResponda com "SIM" para enviar a sugestão ou "NÃO" para cancelar.`
    );
  } else if (analysis.status === "blocked") {
    // Mensagem bloqueada
    saveConversation(senderPhone, "blocked", messageText, "blocked", {
      reason: analysis.reason,
    });

    await sendMessage(
      senderPhone,
      `🚫 Sua mensagem não pode ser enviada.\n\n❌ Motivo: ${analysis.reason}\n\nPor favor, reformule sua mensagem de forma mais respeitosa e focada no bem-estar da criança.`
    );
  }
}

/**
 * Enviar mensagem
 */
async function sendMessage(phone, text) {
  try {
    const jid = phone.includes("@") ? phone : `${phone}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text });
    console.log(`✉️  Mensagem enviada para ${phone}`);
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para ${phone}:`, error.message);
  }
}

/**
 * Iniciar agente
 */
async function start() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║  🤖 AGENTE WHATSAPP - COMUNICAÇÃO     ║");
  console.log("║     PARENTAL MEDIADA POR IA           ║");
  console.log("╚════════════════════════════════════════╝\n");

  try {
    await connectToWhatsApp();
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
    setTimeout(start, 5000);
  }
}

// Iniciar
start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Desconectando...");
  process.exit(0);
});

module.exports = { sendMessage };
