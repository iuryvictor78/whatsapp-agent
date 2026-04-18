const axios = require("axios");

/**
 * Analisa mensagem com IA para determinar se é apropriada
 * Retorna: { status: 'approved' | 'filtered' | 'blocked', reason: string, filteredContent?: string }
 */
async function analyzeMessage(content) {
  try {
    const response = await axios.post(
      `${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um moderador de comunicação parental. Analise mensagens entre pais divorciados que precisam se comunicar sobre o bem-estar de uma criança.

Classifique a mensagem em 3 categorias:

1. **APPROVED**: Mensagem neutra, respeitosa e focada no bem-estar da criança
   - Exemplo: "João precisa de novo uniforme para a escola"

2. **FILTERED**: Mensagem com problemas que podem ser corrigidos
   - Contém tom agressivo leve, desabafos emocionais, vitimização
   - Você deve sugerir uma versão neutralizada
   - Exemplo original: "Você sempre foi negligente! João precisa de novo uniforme!"
   - Exemplo filtrado: "João precisa de novo uniforme"

3. **BLOCKED**: Mensagem com conteúdo severo que não deve ser enviada
   - Xingamentos, insultos diretos, ameaças, ataques pessoais severos
   - Exemplo: "Você é incompetente e irresponsável!"

Responda em JSON com a estrutura:
{
  "status": "approved" | "filtered" | "blocked",
  "reason": "Explicação breve do motivo",
  "filteredContent": "Versão neutralizada (apenas se status=filtered)"
}`,
          },
          {
            role: "user",
            content: `Analise esta mensagem: "${content}"`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "message_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["approved", "filtered", "blocked"],
                },
                reason: {
                  type: "string",
                },
                filteredContent: {
                  type: ["string", "null"],
                },
              },
              required: ["status", "reason"],
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Erro ao analisar mensagem com IA:", error.message);
    // Em caso de erro, considera a mensagem como aprovada (fallback seguro)
    return {
      status: "approved",
      reason: "Análise de IA indisponível - mensagem aceita por padrão",
    };
  }
}

module.exports = { analyzeMessage };
