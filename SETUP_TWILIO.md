# 🔧 Guia de Configuração Twilio - Passo a Passo

Este guia mostra exatamente como configurar o Twilio para o agente WhatsApp funcionar.

## 📋 O que você vai fazer

1. Criar conta Twilio (grátis)
2. Obter número WhatsApp virtual
3. Configurar credenciais
4. Conectar o webhook
5. Testar a conexão

---

## ✅ Passo 1: Criar Conta Twilio

### 1.1 Acesse o site

Abra seu navegador e vá para: **https://www.twilio.com/console**

### 1.2 Crie uma conta

- Clique em **"Create a free account"**
- Preencha seus dados:
  - Email
  - Senha
  - Nome completo
  - País
  - Número de telefone (para verificação)
- Clique em **"Create Account"**

### 1.3 Verifique seu email

Twilio enviará um email de confirmação. Clique no link para verificar.

### 1.4 Responda as perguntas

Twilio fará perguntas sobre seu uso. Responda algo como:

- **What are you building?** → "Parental communication app"
- **Which Twilio product?** → "WhatsApp"
- **How will you use it?** → "Send and receive messages"

---

## 📱 Passo 2: Obter Número WhatsApp

### 2.1 Acesse o Sandbox

No console Twilio:

1. Vá para **Messaging** (menu esquerdo)
2. Clique em **Try it out**
3. Selecione **Send a WhatsApp message**

### 2.2 Ative o Sandbox

Você verá uma página com:

```
WhatsApp Sandbox
Your sandbox number: whatsapp:+1234567890
```

Copie este número! Você vai precisar dele.

### 2.3 Conecte seu WhatsApp

1. Abra o WhatsApp no seu telefone
2. Envie uma mensagem para o número Twilio com o código fornecido
3. Exemplo: `join quick-silver` (o código varia)

Você receberá uma confirmação de que está conectado.

---

## 🔑 Passo 3: Obter Credenciais

### 3.1 Account SID

1. No console Twilio, vá para **Account > API keys & tokens**
2. Procure por **Account SID**
3. Clique no ícone de copiar
4. Cole em um arquivo de texto temporário

### 3.2 Auth Token

Na mesma página:

1. Procure por **Auth Token**
2. Clique em **Show** (se estiver oculto)
3. Clique no ícone de copiar
4. Cole em um arquivo de texto temporário

### 3.3 Salve no .env

Agora edite o arquivo `.env` do projeto:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

---

## 🔗 Passo 4: Configurar Webhook

### 4.1 O que é um Webhook?

Um webhook é um URL que Twilio chama quando recebe uma mensagem. Ele avisa ao seu servidor que uma mensagem chegou.

### 4.2 Obter URL Pública

Se você está testando localmente, use **ngrok**:

```bash
# Em outro terminal
ngrok http 3001
```

Você verá algo como:

```
Forwarding                    https://abc123.ngrok.io -> http://localhost:3001
```

Copie a URL: `https://abc123.ngrok.io`

### 4.3 Configurar no Twilio

1. No console Twilio, vá para **Messaging > Settings > WhatsApp Sandbox Settings**
2. Em **"When a message comes in"**, preencha:
   ```
   https://abc123.ngrok.io/webhook/whatsapp
   ```
3. Selecione **POST** no dropdown
4. Clique em **Save**

---

## 🧪 Passo 5: Testar a Conexão

### 5.1 Inicie o servidor

```bash
npm start
```

Você verá:

```
🚀 Agente WhatsApp rodando em http://localhost:3001
📱 Número Twilio: whatsapp:+1234567890
🔗 Webhook: https://abc123.ngrok.io/webhook/whatsapp
```

### 5.2 Envie uma mensagem de teste

1. Abra o WhatsApp
2. Envie uma mensagem para o número Twilio
3. Exemplo: `"Olá, teste"`

### 5.3 Verifique a resposta

O agente deve responder com algo como:

```
✅ Sua mensagem está ótima!

"Olá, teste"

Qual é o número do destinatário? (ex: +5511999999999)
```

Se recebeu a resposta, **parabéns! 🎉 Está funcionando!**

---

## ⚠️ Problemas Comuns

### **Problema: "Webhook not receiving messages"**

**Solução:**
1. Verifique se o ngrok está rodando
2. Confirme a URL no Twilio (deve ser exatamente igual)
3. Verifique se o servidor Node está rodando (`npm start`)
4. Tente novamente em 30 segundos

### **Problema: "Twilio credentials not found"**

**Solução:**
1. Verifique se o arquivo `.env` existe
2. Confirme que `TWILIO_ACCOUNT_SID` está preenchido
3. Confirme que `TWILIO_AUTH_TOKEN` está preenchido
4. Reinicie o servidor

### **Problema: "Message not being analyzed"**

**Solução:**
1. Verifique se `BUILT_IN_FORGE_API_KEY` está preenchido
2. Confirme que a chave é válida
3. Verifique conexão com internet
4. Tente novamente

---

## 🎯 Próximos Passos

Após configurar o Twilio:

1. ✅ Leia o `GUIA_USUARIO.md` para entender como usar
2. ✅ Compartilhe o número com os dois pais
3. ✅ Deixe-os testar a comunicação
4. ✅ Monitore o histórico em `conversations.json`

---

## 📊 Verificar Status

Para verificar se tudo está funcionando:

```bash
curl http://localhost:3001/status
```

Resposta esperada:

```json
{
  "status": "online",
  "timestamp": "2026-04-18T14:30:00Z",
  "twilioConfigured": true
}
```

---

## 🚀 Deploy em Produção

Quando estiver pronto para usar em produção:

1. **Obtenha um número WhatsApp permanente** (não sandbox)
   - Vá para **Phone Numbers > Manage > Buy a Number**
   - Escolha um número
   - Ative WhatsApp nele

2. **Configure em um servidor público**
   - Use Railway, Heroku, ou Manus Hosting
   - Atualize o webhook URL

3. **Atualize as credenciais**
   - Use o novo número em `TWILIO_WHATSAPP_NUMBER`

---

## 📞 Suporte Twilio

Se tiver dúvidas sobre Twilio:

- **Documentação**: https://www.twilio.com/docs/whatsapp
- **Console**: https://www.twilio.com/console
- **Suporte**: https://support.twilio.com

---

**Versão:** 1.0  
**Última atualização:** Abril de 2026  
**Status:** ✅ Testado e funcionando
