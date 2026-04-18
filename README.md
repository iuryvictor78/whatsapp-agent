# 🤖 Agente WhatsApp - Comunicação Parental Mediada por IA

Um assistente inteligente de WhatsApp que funciona como intermediário entre dois pais divorciados, analisando mensagens com IA para garantir comunicação respeitosa e neutra.

## ✨ Características

- ✅ **Análise de IA em tempo real**: Classifica mensagens em 3 categorias (aprovada, filtrada, bloqueada)
- 🔄 **Sugestões inteligentes**: Propõe versões neutralizadas de mensagens problemáticas
- 📱 **Integração WhatsApp**: Funciona nativamente no WhatsApp via Twilio
- 💾 **Histórico automático**: Mantém registro de todas as conversas
- 🔒 **Privacidade garantida**: Histórico fica no WhatsApp de cada pessoa
- 🚀 **Número virtual gratuito**: Usa Twilio com crédito grátis

## 📋 Pré-requisitos

- Node.js 14+
- npm ou yarn
- Conta Twilio (grátis)
- Chave de API Manus (para IA)

## 🚀 Instalação Rápida

### 1. **Clone ou baixe o projeto**

```bash
cd /home/ubuntu/whatsapp-agent
```

### 2. **Instale as dependências**

```bash
npm install
```

### 3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Twilio (obtenha em https://www.twilio.com/console)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Manus API (para análise de IA)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_manus_api_key

# Server
PORT=3001
NODE_ENV=development
```

### 4. **Inicie o servidor**

```bash
npm start
```

Você verá:

```
🚀 Agente WhatsApp rodando em http://localhost:3001
📱 Número Twilio: whatsapp:+1234567890
🔗 Webhook: http://localhost:3001/webhook/whatsapp
```

---

## 🔧 Configuração Twilio

### **Passo 1: Criar Conta Twilio**

1. Acesse https://www.twilio.com/console
2. Crie uma conta (grátis, sem cartão de crédito necessário)
3. Vá para **Messaging > Try it out > Send a WhatsApp message**
4. Clique em "Get a Sandbox Number"
5. Copie seu número (ex: `whatsapp:+1234567890`)

### **Passo 2: Obter Credenciais**

1. No console Twilio, vá para **Account > API keys & tokens**
2. Copie seu `Account SID` e `Auth Token`
3. Cole no arquivo `.env`

### **Passo 3: Configurar Webhook**

1. No console Twilio, vá para **Messaging > Settings > WhatsApp Sandbox Settings**
2. Em "When a message comes in", defina:
   ```
   http://seu-dominio-publico.com/webhook/whatsapp
   ```
3. Selecione **POST**

### **Passo 4: Conectar seu Número**

1. Envie uma mensagem para o número Twilio com o texto: `join quick-silver` (ou o código fornecido)
2. Pronto! Agora você pode conversar com o agente

---

## 🔐 Configuração Manus API

1. Acesse sua conta Manus
2. Gere uma chave de API
3. Cole em `BUILT_IN_FORGE_API_KEY` no `.env`

---

## 📚 Estrutura do Projeto

```
whatsapp-agent/
├── server.js              # Servidor Express + Webhook Twilio
├── messageFilter.js       # Análise de IA
├── database.js            # Armazenamento de conversas
├── .env.example           # Template de configuração
├── package.json           # Dependências
├── GUIA_USUARIO.md        # Guia para usuários finais
└── README.md              # Este arquivo
```

---

## 🎯 Fluxo de Funcionamento

```
Pessoa A envia mensagem
        ↓
Agente recebe
        ↓
IA analisa conteúdo
        ↓
┌─────────────────────────────────┐
│ Resultado:                      │
├─────────────────────────────────┤
│ ✅ APROVADA → Pede número B    │
│ 🔄 FILTRADA → Sugere correção   │
│ ❌ BLOQUEADA → Explica motivo   │
└─────────────────────────────────┘
        ↓
Se aprovada/filtrada+aprovada:
        ↓
Agente encaminha para Pessoa B
        ↓
Pessoa B recebe mensagem
```

---

## 🧪 Testando Localmente

### **Usando ngrok para expor o servidor**

```bash
# Em outro terminal
ngrok http 3001
```

Você receberá uma URL pública como: `https://abc123.ngrok.io`

Configure isso no Twilio Webhook:
```
https://abc123.ngrok.io/webhook/whatsapp
```

---

## 📊 Exemplos de Análise

### **Mensagem Aprovada ✅**

```
Entrada: "João precisa de novo uniforme"
Resultado: APROVADA
Motivo: Mensagem neutra e focada na criança
```

### **Mensagem Filtrada 🔄**

```
Entrada: "Você sempre foi negligente! João precisa de novo uniforme!"
Resultado: FILTRADA
Motivo: Contém tom agressivo e vitimização
Sugestão: "João precisa de novo uniforme"
```

### **Mensagem Bloqueada ❌**

```
Entrada: "Você é incompetente e irresponsável!"
Resultado: BLOQUEADA
Motivo: Xingamentos e ataques pessoais diretos
```

---

## 🔍 Monitoramento

### **Ver status do servidor**

```bash
curl http://localhost:3001/status
```

Resposta:

```json
{
  "status": "online",
  "timestamp": "2026-04-18T14:30:00Z",
  "twilioConfigured": true
}
```

### **Ver histórico de conversas**

O histórico é armazenado em `conversations.json`:

```bash
cat conversations.json
```

---

## 🐛 Troubleshooting

### **Erro: "Twilio credentials not found"**

- Verifique se o arquivo `.env` existe
- Confirme que `TWILIO_ACCOUNT_SID` e `TWILIO_AUTH_TOKEN` estão preenchidos

### **Erro: "Webhook not receiving messages"**

- Confirme que o webhook está configurado corretamente no Twilio
- Use ngrok para testar localmente
- Verifique se o servidor está rodando (`npm start`)

### **Erro: "IA analysis failed"**

- Confirme que `BUILT_IN_FORGE_API_KEY` está correto
- Verifique conexão com internet
- Tente novamente em alguns segundos

---

## 📱 Como Usar (Para Usuários Finais)

Veja o arquivo `GUIA_USUARIO.md` para instruções completas.

**Resumo rápido:**

1. Salve o número do agente
2. Envie uma mensagem
3. Agente analisa e responde
4. Se aprovada, fornece número do destinatário
5. Se filtrada, aprove a sugestão
6. Mensagem é encaminhada

---

## 🚀 Deploy em Produção

### **Opção 1: Railway**

```bash
railway login
railway init
railway up
```

### **Opção 2: Heroku**

```bash
heroku create seu-agente-whatsapp
git push heroku main
```

### **Opção 3: Manus Hosting**

Use o painel de controle Manus para fazer deploy automático.

---

## 📈 Próximas Melhorias

- [ ] Suporte a imagens e áudio
- [ ] Dashboard de estatísticas
- [ ] Múltiplos casos familiares
- [ ] Notificações em tempo real
- [ ] Integração com Google Calendar
- [ ] Relatórios de comunicação

---

## 📄 Licença

MIT

---

## 👨‍💻 Desenvolvido por

Manus AI - Comunicação Parental Segura

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através da plataforma Manus.

---

**Versão:** 1.0  
**Última atualização:** Abril de 2026  
**Status:** ✅ Pronto para uso
