require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const { analyzeMessage } = require("./messageFilter");
const {
  initDatabase,
  saveConversation,
  savePendingApproval,
  getPendingApproval,
  removePendingApproval,
  getConversationHistory,
} = require("./database");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Inicializar banco de dados
initDatabase();

// Twilio Client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/**
 * Envia mensagem via WhatsApp
 */
async function sendWhatsAppMessage(toPhone, message) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${toPhone}`,
    });
    return result.sid;
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    throw error;
  }
}

/**
 * Webhook para receber mensagens do WhatsApp
 */
app.post("/webhook/whatsapp", async (req, res) => {
  const incomingMessage = req.body.Body;
  const senderPhone = req.body.From.replace("whatsapp:", "");
  const messageId = req.body.MessageSid;

  console.log(`\n📱 Mensagem recebida de ${senderPhone}: ${incomingMessage}`);

  try {
    // Verificar se é uma aprovação de mensagem filtrada
    if (incomingMessage.toLowerCase() === "sim" || incomingMessage.toLowerCase() === "aprovar") {
      // Procurar por aprovação pendente deste usuário
      const pendingApprovals = require("./database");
      const approval = Object.values(require("fs").existsSync(process.env.DB_FILE || "./conversations.json")
        ? JSON.parse(require("fs").readFileSync(process.env.DB_FILE || "./conversations.json", "utf-8")).pendingApprovals
        : {}).find((a) => a.senderPhone === senderPhone && a.status === "pending");

      if (approval) {
        console.log(`✅ Aprovação recebida de ${senderPhone}`);

        // Enviar mensagem filtrada para o destinatário
        const recipientPhone = approval.recipientPhone;
        await sendWhatsAppMessage(
          recipientPhone,
          `📨 Mensagem de ${senderPhone}:\n\n${approval.filteredContent}`
        );

        // Registrar como enviada
        saveConversation(senderPhone, recipientPhone, approval.originalContent, "filtered_approved", {
          filteredContent: approval.filteredContent,
          reason: approval.reason,
        });

        // Remover aprovação pendente
        removePendingApproval(Object.keys(require("fs").existsSync(process.env.DB_FILE || "./conversations.json")
          ? JSON.parse(require("fs").readFileSync(process.env.DB_FILE || "./conversations.json", "utf-8")).pendingApprovals
          : {}).find((key) => {
          const db = JSON.parse(require("fs").readFileSync(process.env.DB_FILE || "./conversations.json", "utf-8"));
          return db.pendingApprovals[key]?.senderPhone === senderPhone && db.pendingApprovals[key]?.status === "pending";
        }));

        // Confirmar ao remetente
        await sendWhatsAppMessage(senderPhone, "✅ Sua mensagem foi aprovada e enviada!");

        res.send("<Response></Response>");
        return;
      }
    }

    // Verificar se é um comando de rejeição
    if (incomingMessage.toLowerCase() === "não" || incomingMessage.toLowerCase() === "cancelar") {
      console.log(`❌ Rejeição recebida de ${senderPhone}`);

      // Encontrar e remover aprovação pendente
      const db = JSON.parse(require("fs").readFileSync(process.env.DB_FILE || "./conversations.json", "utf-8"));
      const pendingKey = Object.keys(db.pendingApprovals).find(
        (key) => db.pendingApprovals[key]?.senderPhone === senderPhone && db.pendingApprovals[key]?.status === "pending"
      );

      if (pendingKey) {
        removePendingApproval(pendingKey);
        await sendWhatsAppMessage(senderPhone, "❌ Mensagem cancelada. Você pode tentar novamente com outra mensagem.");
      }

      res.send("<Response></Response>");
      return;
    }

    // Verificar se é um comando de histórico
    if (incomingMessage.toLowerCase() === "histórico" || incomingMessage.toLowerCase() === "historico") {
      // Solicitar número do outro responsável
      await sendWhatsAppMessage(
        senderPhone,
        "📋 Para ver o histórico, qual é o número do outro responsável?\n(Envie apenas o número, ex: +5511999999999)"
      );

      res.send("<Response></Response>");
      return;
    }

    // Analisar mensagem com IA
    console.log("🤖 Analisando mensagem com IA...");
    const analysis = await analyzeMessage(incomingMessage);

    console.log(`📊 Resultado: ${analysis.status}`);
    console.log(`📝 Motivo: ${analysis.reason}`);

    if (analysis.status === "approved") {
      // Mensagem aprovada - solicitar número do destinatário
      await sendWhatsAppMessage(
        senderPhone,
        `✅ Sua mensagem está ótima!\n\n"${incomingMessage}"\n\nQual é o número do destinatário? (ex: +5511999999999)`
      );
    } else if (analysis.status === "filtered") {
      // Mensagem filtrada - sugerir correção
      await sendWhatsAppMessage(
        senderPhone,
        `⚠️ Sua mensagem foi ajustada para ser mais neutra e respeitosa:\n\n📝 Original:\n"${incomingMessage}"\n\n✨ Sugestão:\n"${analysis.filteredContent}"\n\n${analysis.reason}\n\nResponda com "SIM" para enviar a sugestão ou "NÃO" para cancelar.`
      );

      // Registrar aprovação pendente
      savePendingApproval(messageId, senderPhone, null, incomingMessage, analysis.filteredContent, analysis.reason);
    } else if (analysis.status === "blocked") {
      // Mensagem bloqueada
      await sendWhatsAppMessage(
        senderPhone,
        `🚫 Sua mensagem não pode ser enviada.\n\n❌ Motivo: ${analysis.reason}\n\nPor favor, reformule sua mensagem de forma mais respeitosa e focada no bem-estar da criança.`
      );

      saveConversation(senderPhone, "blocked", incomingMessage, "blocked", {
        reason: analysis.reason,
      });
    }

    res.send("<Response></Response>");
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    await sendWhatsAppMessage(senderPhone, "❌ Erro ao processar sua mensagem. Tente novamente.");
    res.send("<Response></Response>");
  }
});

/**
 * Rota de status
 */
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    twilioConfigured: !!process.env.TWILIO_ACCOUNT_SID,
  });
});

/**
 * Iniciar servidor
 */
app.listen(port, () => {
  console.log(`\n🚀 Agente WhatsApp rodando em http://localhost:${port}`);
  console.log(`📱 Número Twilio: ${TWILIO_WHATSAPP_NUMBER}`);
  console.log(`🔗 Webhook: http://localhost:${port}/webhook/whatsapp\n`);
});

module.exports = app;
