const fs = require("fs");
const path = require("path");

const DB_FILE = process.env.DB_FILE || "./conversations.json";

/**
 * Inicializa o banco de dados
 */
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          conversations: {},
          pendingApprovals: {},
        },
        null,
        2
      )
    );
  }
}

/**
 * Lê o banco de dados
 */
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler banco de dados:", error);
    return { conversations: {}, pendingApprovals: {} };
  }
}

/**
 * Escreve no banco de dados
 */
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao escrever no banco de dados:", error);
  }
}

/**
 * Registra uma conversa
 */
function saveConversation(senderPhone, recipientPhone, message, status, metadata = {}) {
  const db = readDatabase();
  const conversationKey = [senderPhone, recipientPhone].sort().join("_");

  if (!db.conversations[conversationKey]) {
    db.conversations[conversationKey] = [];
  }

  db.conversations[conversationKey].push({
    timestamp: new Date().toISOString(),
    from: senderPhone,
    to: recipientPhone,
    originalContent: message,
    status, // 'approved', 'filtered', 'blocked', 'pending_approval'
    filteredContent: metadata.filteredContent || null,
    reason: metadata.reason || null,
    messageId: metadata.messageId || null,
  });

  writeDatabase(db);
}

/**
 * Registra uma aprovação pendente
 */
function savePendingApproval(messageId, senderPhone, recipientPhone, originalContent, filteredContent, reason) {
  const db = readDatabase();

  db.pendingApprovals[messageId] = {
    senderPhone,
    recipientPhone,
    originalContent,
    filteredContent,
    reason,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  writeDatabase(db);
}

/**
 * Obtém uma aprovação pendente
 */
function getPendingApproval(messageId) {
  const db = readDatabase();
  return db.pendingApprovals[messageId] || null;
}

/**
 * Remove uma aprovação pendente
 */
function removePendingApproval(messageId) {
  const db = readDatabase();
  delete db.pendingApprovals[messageId];
  writeDatabase(db);
}

/**
 * Obtém histórico de conversa
 */
function getConversationHistory(phone1, phone2) {
  const db = readDatabase();
  const conversationKey = [phone1, phone2].sort().join("_");
  return db.conversations[conversationKey] || [];
}

module.exports = {
  initDatabase,
  saveConversation,
  savePendingApproval,
  getPendingApproval,
  removePendingApproval,
  getConversationHistory,
};
