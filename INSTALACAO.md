# 📦 Guia de Instalação - Agente WhatsApp Baileys

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ **Node.js 14+** instalado
- ✅ **npm** (vem com Node.js)
- ✅ **Um número WhatsApp** (qualquer um, não precisa ser especial)
- ✅ **Um computador** (Windows, Mac ou Linux)

### Verificar se tem Node.js instalado

Abra o terminal/prompt de comando e digite:

```bash
node --version
npm --version
```

Se aparecer versões, está tudo certo! Se não, baixe em: https://nodejs.org

---

## 🚀 Instalação Passo a Passo

### **Passo 1: Baixar o Projeto**

#### Opção A: Usando Git (se tiver instalado)

```bash
git clone https://github.com/seu-usuario/whatsapp-agent.git
cd whatsapp-agent
```

#### Opção B: Baixar como ZIP

1. Acesse o repositório
2. Clique em **Code > Download ZIP**
3. Descompacte a pasta
4. Abra o terminal nessa pasta

### **Passo 2: Instalar Dependências**

No terminal, dentro da pasta do projeto, digite:

```bash
npm install
```

Isso vai baixar todas as bibliotecas necessárias. Pode levar alguns minutos.

Você verá algo como:

```
added 171 packages in 4s
```

### **Passo 3: Iniciar o Agente**

```bash
npm start
```

Você verá:

```
╔════════════════════════════════════════╗
║  🤖 AGENTE WHATSAPP - COMUNICAÇÃO     ║
║     PARENTAL MEDIADA POR IA           ║
╚════════════════════════════════════════╝

🔄 Conectando ao WhatsApp...

📱 Escaneie este código QR com seu WhatsApp:

█████████████████████████
█ ▄▄▄▄▄ █▀█▀ █ █ ▄▄▄▄▄ █
█ █   █ █ ▀▀▀  █ █   █ █
█ █▄▄▄█ █▀▀▀▀▀ █ █▄▄▄█ █
█▄▄▄▄▄▄▄█ ▀ ▀ ▀█▄▄▄▄▄▄▄█
█ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█████████████████████████
```

### **Passo 4: Escanear o QR Code**

1. Abra o **WhatsApp** no seu telefone
2. Vá para **Configurações**
3. Procure por **Dispositivos Conectados** ou **Linked Devices**
4. Clique em **Conectar um Dispositivo**
5. Aponte a câmera para o código QR exibido no terminal
6. Aguarde a conexão

Quando conectar, você verá:

```
✅ Conectado ao WhatsApp com sucesso!

🤖 Agente ativo e aguardando mensagens...
```

### **Passo 5: Testar**

1. Abra o WhatsApp
2. Envie uma mensagem para **você mesmo** (seu próprio número)
3. Você deve receber uma resposta do agente

Pronto! 🎉 O agente está funcionando!

---

## 🧪 Teste Rápido

Envie estas mensagens para testar:

### Teste 1: Mensagem Aprovada ✅

```
"João precisa de novo uniforme"
```

Resposta esperada:

```
✅ Sua mensagem está ótima!

"João precisa de novo uniforme"

Qual é o número do destinatário? (ex: +5511999999999)
```

### Teste 2: Mensagem Filtrada 🔄

```
"Você sempre foi negligente! João precisa de novo uniforme!"
```

Resposta esperada:

```
⚠️ Sua mensagem foi ajustada:

📝 Original:
"Você sempre foi negligente! João precisa de novo uniforme!"

✨ Sugestão:
"João precisa de novo uniforme"

Responda com "SIM" para enviar ou "NÃO" para cancelar.
```

### Teste 3: Mensagem Bloqueada ❌

```
"Você é incompetente e irresponsável!"
```

Resposta esperada:

```
🚫 Sua mensagem não pode ser enviada.

❌ Motivo: Contém xingamentos e ataques pessoais

Por favor, reformule sua mensagem de forma mais respeitosa.
```

---

## ⚙️ Configuração (Opcional)

### Editar Arquivo .env

Se quiser customizar, crie um arquivo `.env` na raiz do projeto:

```bash
# Copiar o template
cp .env.example .env

# Editar com seu editor favorito
nano .env
```

Conteúdo do `.env`:

```env
PORT=3001
NODE_ENV=development
DB_FILE=./conversations.json
```

---

## 🔄 Comandos Úteis

### Iniciar o agente

```bash
npm start
```

### Modo desenvolvimento (reinicia automaticamente ao salvar)

```bash
npm run dev
```

### Parar o agente

Pressione **Ctrl + C** no terminal

### Ver histórico de conversas

```bash
cat conversations.json
```

---

## 📁 Estrutura de Arquivos Criados

Após a primeira execução, você verá:

```
whatsapp-agent/
├── node_modules/              # Bibliotecas instaladas
├── auth_info_baileys/         # Credenciais WhatsApp (criado automaticamente)
├── conversations.json         # Histórico de conversas
├── agent-baileys.js           # Agente principal
├── messageFilterLocal.js       # Filtro de IA
├── database.js                # Banco de dados
├── package.json               # Dependências
└── ...outros arquivos
```

---

## ⚠️ Problemas Comuns

### **Erro: "command not found: node"**

**Solução:** Node.js não está instalado. Baixe em https://nodejs.org

### **Erro: "npm ERR! code EACCES"**

**Solução:** Problema de permissão. Tente:

```bash
sudo npm install
```

### **QR Code não aparece**

**Solução:**
1. Verifique se o terminal tem suporte a caracteres especiais
2. Tente em outro terminal
3. Reinstale: `npm install`

### **Conexão perdida após alguns minutos**

**Solução:**
1. Isso é normal em testes
2. O agente reconectará automaticamente
3. Em produção, use `pm2` para manter sempre rodando

### **Mensagens não chegam**

**Solução:**
1. Verifique se o agente está conectado (deve mostrar "✅ Conectado")
2. Verifique se o número está correto
3. Tente enviar uma mensagem de teste
4. Reinicie o agente

---

## 🚀 Próximos Passos

Depois de instalar:

1. ✅ Leia o `GUIA_USUARIO.md` para entender como usar
2. ✅ Teste com as mensagens de exemplo acima
3. ✅ Compartilhe seu número com os dois pais
4. ✅ Deixe o agente rodando 24/7

---

## 🔒 Segurança

- ✅ Suas credenciais WhatsApp ficam em `auth_info_baileys/` (local, não na nuvem)
- ✅ O histórico fica em `conversations.json` (seu computador)
- ✅ Ninguém tem acesso aos seus dados
- ✅ Não há servidor externo envolvido

---

## 💾 Backup

Faça backup regularmente:

```bash
# Copiar arquivo de histórico
cp conversations.json conversations_backup_$(date +%Y%m%d).json
```

---

## 📞 Suporte

Se tiver problemas:

1. Leia este guia novamente
2. Verifique a seção "Problemas Comuns"
3. Tente reiniciar o agente
4. Verifique sua conexão de internet

---

**Versão:** 1.0  
**Última atualização:** Abril de 2026  
**Status:** ✅ Testado e Funcionando
