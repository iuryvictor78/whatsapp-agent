# 🤖 Agente WhatsApp com Baileys - 100% Gratuito

Um assistente inteligente de WhatsApp que funciona como intermediário entre dois pais divorciados, com filtro de IA local (sem custos de API), usando **Baileys** - uma biblioteca Node.js que se conecta ao WhatsApp Web.

## ✨ Características

- ✅ **100% Gratuito** - Sem custos mensais, sem créditos, sem limites
- ✅ **Filtro de IA Local** - Análise de mensagens sem dependência de API externa
- ✅ **Análise em Tempo Real** - Classifica mensagens instantaneamente
- 📱 **Funciona com Qualquer Número WhatsApp** - Não precisa de número virtual
- 💾 **Histórico Automático** - Mantém registro de todas as conversas
- 🔒 **Privacidade Garantida** - Histórico fica no seu computador
- 🚀 **Sem Configuração Complexa** - Basta escanear QR code

## 📋 Pré-requisitos

- Node.js 14+
- npm ou yarn
- Um número WhatsApp (qualquer um)
- Um computador para rodar o agente 24/7 (ou usar um VPS)

## 🚀 Instalação Rápida

### 1. **Clonar ou baixar o projeto**

```bash
cd /home/ubuntu/whatsapp-agent
```

### 2. **Instalar dependências**

```bash
npm install
```

### 3. **Iniciar o agente**

```bash
npm start
```

### 4. **Escanear QR Code**

Você verá um código QR no terminal. Abra o WhatsApp no seu telefone e:

1. Vá para **Configurações > Dispositivos Conectados > Conectar um Dispositivo**
2. Escaneie o código QR exibido no terminal
3. Aguarde a conexão

Pronto! O agente está online! 🎉

---

## 💬 Como Usar

### **Fluxo Básico**

```
Pessoa A envia mensagem
        ↓
Agente recebe e analisa
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
```

### **Exemplos de Uso**

#### **Mensagem Aprovada ✅**

```
Você: "João precisa de novo uniforme"

Agente: "✅ Sua mensagem está ótima!

"João precisa de novo uniforme"

Qual é o número do destinatário? (ex: +5511999999999)"

Você: "+5511987654321"

Agente: "✅ Sua mensagem foi enviada!"
```

#### **Mensagem Filtrada 🔄**

```
Você: "Você sempre foi negligente! João precisa de novo uniforme!"

Agente: "⚠️ Sua mensagem foi ajustada:

📝 Original:
"Você sempre foi negligente! João precisa de novo uniforme!"

✨ Sugestão:
"João precisa de novo uniforme"

Responda com "SIM" para enviar ou "NÃO" para cancelar."

Você: "SIM"

Agente: "✅ Sua mensagem foi aprovada e enviada!"
```

#### **Mensagem Bloqueada ❌**

```
Você: "Você é incompetente e irresponsável!"

Agente: "🚫 Sua mensagem não pode ser enviada.

❌ Motivo: Contém xingamentos e ataques pessoais

Por favor, reformule sua mensagem de forma mais respeitosa."
```

---

## 📊 Estrutura do Projeto

```
whatsapp-agent/
├── agent-baileys.js           # Agente principal com Baileys
├── messageFilterLocal.js       # Filtro de IA local
├── database.js                # Armazenamento de conversas
├── .env.example               # Template de configuração
├── package.json               # Dependências
├── auth_info_baileys/         # Credenciais WhatsApp (criado automaticamente)
├── conversations.json         # Histórico de conversas
├── GUIA_USUARIO.md            # Guia para usuários finais
└── README_BAILEYS.md          # Este arquivo
```

---

## 🔄 Comandos Disponíveis

| Comando | O que faz |
|---------|-----------|
| Qualquer mensagem | Agente analisa e responde |
| "SIM" ou "APROVAR" | Aprova sugestão de mensagem filtrada |
| "NÃO" ou "CANCELAR" | Rejeita sugestão e cancela envio |
| "HISTÓRICO" | Mostra últimas conversas |

---

## 🎯 Exemplos de Mensagens Aprovadas ✅

```
"João tem dentista segunda às 14h"
"Maria precisa de autorização para a excursão"
"Podemos discutir sobre as férias de julho?"
"João está com febre, levei ao médico"
"Preciso que você busque João na escola hoje"
"Qual é o melhor horário para você buscar?"
"Já comprei o material escolar"
"João quer fazer aulas de natação"
```

---

## 🔄 Exemplos de Mensagens Filtradas

| Original | Sugestão |
|----------|----------|
| "Você sempre esquece das coisas importantes!" | "Preciso que você lembre dos compromissos de João" |
| "Você é tão irresponsável com Maria!" | "Maria precisa de mais atenção com os estudos" |
| "Não consigo acreditar que você fez isso de novo!" | "Podemos conversar sobre isso?" |
| "Você nunca está disponível!" | "Preciso que você esteja mais disponível" |

---

## ❌ Exemplos de Mensagens Bloqueadas

```
"Você é incompetente e irresponsável!"
"Seu filho é tão chato quanto você"
"Vou processar você na justiça, seu miserável!"
"Você não merecia ser pai/mãe"
"Você é um fracasso como responsável"
"Detesto você e tudo que você faz"
```

---

## 🔍 Monitoramento

### **Ver histórico de conversas**

O histórico é armazenado em `conversations.json`:

```bash
cat conversations.json
```

Você verá algo como:

```json
{
  "conversations": {
    "5511987654321_5511912345678": [
      {
        "timestamp": "2026-04-18T14:30:00.000Z",
        "from": "5511987654321",
        "to": "5511912345678",
        "originalContent": "João precisa de novo uniforme",
        "status": "approved",
        "filteredContent": null,
        "reason": null
      }
    ]
  },
  "pendingApprovals": {}
}
```

---

## ⚠️ Troubleshooting

### **Problema: "QR Code não aparece"**

**Solução:**
1. Verifique se o Node.js está instalado: `node --version`
2. Reinstale as dependências: `npm install`
3. Tente novamente: `npm start`

### **Problema: "Conexão perdida"**

**Solução:**
1. O agente reconectará automaticamente
2. Se não reconectar, reinicie: `npm start`
3. Escaneie o QR code novamente

### **Problema: "Mensagens não são recebidas"**

**Solução:**
1. Verifique se o agente está rodando (deve mostrar "✅ Conectado ao WhatsApp")
2. Envie uma mensagem de teste
3. Verifique se o número está correto
4. Reinicie o agente

### **Problema: "Filtro muito rigoroso/leniente"**

**Solução:**
1. Edite `messageFilterLocal.js`
2. Ajuste as palavras-chave em `BLOCKED_KEYWORDS` ou `FILTER_KEYWORDS`
3. Reinicie o agente

---

## 🚀 Deploy em Produção

Para que o agente funcione 24/7, você precisa de um servidor sempre ligado.

### **Opção 1: VPS (Recomendado)**

1. Contrate um VPS (ex: DigitalOcean, Linode, AWS)
2. Instale Node.js
3. Clone o projeto
4. Use `pm2` para manter rodando:

```bash
npm install -g pm2
pm2 start agent-baileys.js --name "whatsapp-agent"
pm2 startup
pm2 save
```

### **Opção 2: Seu Computador**

1. Deixe o computador ligado 24/7
2. Execute `npm start`
3. Não feche o terminal

### **Opção 3: Raspberry Pi**

1. Instale Node.js no Raspberry Pi
2. Clone o projeto
3. Execute `npm start`
4. Deixe ligado permanentemente

---

## 📱 Compartilhando com os Pais

Quando estiver pronto:

1. **Compartilhe seu número WhatsApp** com os dois pais
2. **Envie o `GUIA_USUARIO.md`** para que entendam como usar
3. **Teste com eles** para garantir que funciona

---

## 🔒 Privacidade e Segurança

- ✅ **Histórico local** - Fica no seu computador, não em servidor externo
- ✅ **Sem dados em nuvem** - Tudo armazenado localmente
- ✅ **Sem API externa** - Análise feita localmente
- ✅ **Sem rastreamento** - Ninguém sabe que você está usando o agente
- ✅ **100% privado** - Apenas você tem acesso ao histórico

---

## 📊 Limitações Conhecidas

- **Apenas texto** - Não suporta imagens, áudio ou vídeo (por enquanto)
- **Um computador** - Precisa estar sempre ligado para receber mensagens
- **Sem backup automático** - Faça backup manual de `conversations.json`
- **Sem interface web** - Tudo funciona via WhatsApp

---

## 🎯 Próximas Melhorias

- [ ] Suporte a imagens e áudio
- [ ] Dashboard web para visualizar histórico
- [ ] Backup automático em nuvem
- [ ] Notificações de mensagens importantes
- [ ] Integração com Google Calendar
- [ ] Relatórios de comunicação

---

## 📞 Suporte

Se tiver problemas:

1. Leia o `GUIA_USUARIO.md`
2. Verifique o `Troubleshooting` acima
3. Tente reiniciar o agente
4. Verifique sua conexão de internet

---

## 📄 Licença

MIT

---

## 👨‍💻 Desenvolvido com ❤️

Para facilitar comunicação parental respeitosa, mesmo em situações difíceis.

---

**Versão:** 1.0 (Baileys)  
**Última atualização:** Abril de 2026  
**Status:** ✅ Pronto para uso  
**Custo:** 🆓 Totalmente Gratuito
