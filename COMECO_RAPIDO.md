# 🚀 COMEÇO RÁPIDO - Agente WhatsApp em 5 Minutos

## ❓ Perguntas Frequentes

### **P: Para qual número as pessoas mandam mensagem?**

**R:** Para o seu próprio número WhatsApp! O agente funciona no seu WhatsApp.

### **P: Preciso de um número especial?**

**R:** NÃO! Usa o seu número normal.

### **P: Preciso instalar algo no celular?**

**R:** NÃO! Tudo funciona no computador.

### **P: Como funciona?**

**R:** Você deixa um programa rodando no seu computador. Quando alguém manda mensagem para você no WhatsApp, o agente recebe, analisa e responde automaticamente.

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Preparar o Computador**

Você precisa ter instalado:

- **Node.js** (um programa para rodar o agente)

#### Como verificar se tem Node.js:

1. Abra o **Prompt de Comando** (Windows) ou **Terminal** (Mac/Linux)
2. Digite: `node --version`
3. Se aparecer um número (ex: `v18.0.0`), já tem instalado ✅
4. Se não aparecer nada, baixe em: https://nodejs.org

---

### **PASSO 2: Baixar o Agente**

1. Abra a pasta: `/home/ubuntu/whatsapp-agent`
2. Você verá vários arquivos lá

---

### **PASSO 3: Instalar o Agente (1ª vez apenas)**

1. Abra o **Terminal** ou **Prompt de Comando**
2. Digite este comando:

```bash
cd /home/ubuntu/whatsapp-agent
npm install
```

3. Aguarde até aparecer `added XXX packages`
4. Pronto! Instalação concluída ✅

---

### **PASSO 4: Iniciar o Agente**

1. No mesmo terminal, digite:

```bash
npm start
```

2. Você verá aparecer um código QR (aquele quadrado com pontos)

Exemplo:
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

---

### **PASSO 5: Conectar o WhatsApp**

1. Pegue seu **telefone**
2. Abra o **WhatsApp**
3. Vá para **Configurações** (engrenagem)
4. Procure por **"Dispositivos Conectados"** ou **"Linked Devices"**
5. Clique em **"Conectar um Dispositivo"**
6. Aponte a câmera do seu telefone para o código QR do computador
7. Aguarde a conexão (alguns segundos)

Quando conectar, no terminal aparecerá:

```
✅ Conectado ao WhatsApp com sucesso!

🤖 Agente ativo e aguardando mensagens...
```

**Pronto! O agente está online!** 🎉

---

### **PASSO 6: Testar**

Agora você pode testar! Abra o WhatsApp e envie uma mensagem para você mesmo:

1. Abra o WhatsApp
2. Procure por sua conversa com você mesmo (ou crie uma)
3. Envie uma mensagem de teste:

```
"João precisa de novo uniforme"
```

4. Em poucos segundos, o agente responderá:

```
✅ Sua mensagem está ótima!

"João precisa de novo uniforme"

Qual é o número do destinatário? (ex: +5511999999999)
```

**Funcionou!** ✅

---

## 🎯 COMO USAR COM OS DOIS PAIS

Agora que o agente está rodando, os dois pais podem usar:

### **Pessoa A (Pai):**

1. Abre WhatsApp
2. Manda mensagem para **você** (seu número)
3. O agente recebe, analisa e responde

### **Pessoa B (Mãe):**

1. Abre WhatsApp
2. Manda mensagem para **você** (seu número)
3. O agente recebe, analisa e responde

### **Exemplo Real:**

```
PAI A: "João precisa de novo uniforme"
       ↓
AGENTE: "✅ Sua mensagem está ótima! Qual é o número da mãe?"
       ↓
PAI A: "+5511987654321"
       ↓
AGENTE envia para MÃE B: "📨 Mensagem do Pai A: João precisa de novo uniforme"
       ↓
MÃE B recebe a mensagem normalmente no WhatsApp
```

---

## 📱 NÚMEROS QUE USAM

| Pessoa | Para qual número manda mensagem |
|--------|--------------------------------|
| Pai A | Para o seu número (ex: +5511999999999) |
| Mãe B | Para o seu número (ex: +5511999999999) |
| Agente | Seu número (funciona no seu WhatsApp) |

**Todos mandam para o seu número!** O agente fica no seu WhatsApp.

---

## ⏹️ PARAR O AGENTE

Quando quiser parar:

1. Volte ao terminal
2. Pressione **Ctrl + C**
3. Pronto! Agente desligado

---

## ▶️ INICIAR NOVAMENTE

Para iniciar de novo:

1. Abra o terminal
2. Digite:

```bash
cd /home/ubuntu/whatsapp-agent
npm start
```

3. Escaneie o QR code novamente (ou pode ser o mesmo, depende)

---

## ❌ PROBLEMAS COMUNS

### **Problema: "QR Code não aparece"**

**Solução:**
- Feche o terminal
- Abra um novo
- Digite `npm start` novamente

### **Problema: "Conexão perdida"**

**Solução:**
- Isso é normal
- O agente reconectará automaticamente
- Se não reconectar, pressione `Ctrl + C` e digite `npm start` novamente

### **Problema: "Mensagens não chegam"**

**Solução:**
1. Verifique se o terminal mostra "✅ Conectado ao WhatsApp"
2. Tente enviar uma mensagem de teste
3. Reinicie o agente

### **Problema: "Não consigo instalar (npm install)"**

**Solução:**
- Verifique se tem Node.js instalado: `node --version`
- Se não tiver, baixe em: https://nodejs.org
- Tente instalar novamente

---

## 💡 DICAS IMPORTANTES

1. **Deixe rodando 24/7** - Para que receba mensagens a qualquer hora
2. **Não feche o terminal** - Enquanto o terminal estiver aberto, o agente funciona
3. **Seu computador deve estar ligado** - Ou o agente não funciona
4. **Compartilhe seu número** - Com os dois pais para que mandem mensagens
5. **Teste antes** - Envie uma mensagem de teste para garantir que funciona

---

## 📊 RESUMO RÁPIDO

| O que fazer | Comando |
|-------------|---------|
| Instalar (1ª vez) | `npm install` |
| Iniciar o agente | `npm start` |
| Parar o agente | `Ctrl + C` |
| Conectar WhatsApp | Escanear QR code |
| Testar | Enviar mensagem para você |

---

## 🎯 CHECKLIST FINAL

- [ ] Node.js instalado
- [ ] Agente baixado em `/home/ubuntu/whatsapp-agent`
- [ ] `npm install` executado
- [ ] `npm start` rodando
- [ ] QR code escaneado
- [ ] Terminal mostra "✅ Conectado ao WhatsApp"
- [ ] Mensagem de teste enviada
- [ ] Agente respondeu
- [ ] Números dos pais anotados
- [ ] Pronto para usar! 🚀

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Deixe o agente rodando
2. ✅ Compartilhe seu número com os dois pais
3. ✅ Envie o arquivo `GUIA_USUARIO.md` para eles
4. ✅ Deixe-os testar
5. ✅ Monitore o histórico em `conversations.json`

---

**Versão:** 1.0  
**Última atualização:** Abril de 2026  
**Status:** ✅ Pronto para usar
