# ADR 0002: Blindagem do Motor de IA via AI Gateway (Zero PII)

*   **Status:** Aprovado
*   **Data:** 2026-07-01

---

## 1. Contexto

A geração de pautas inteligentes de 1:1 e a análise semântica de tópicos utilizam serviços de Inteligência Artificial externa (Google Gemini API via nuvem). 

Enviar dados que permitam identificar diretamente o colaborador (nomes, CPFs, e-mails) ou dados sensíveis sobre seu estado de saúde física e mental (menções a depressão, atestados, burnout) para servidores de terceiros fere os termos de conformidade e viola as regras básicas de proteção de dados sensíveis da LGPD.

---

## 2. Decisão

Implementar um pipeline de segurança em duas camadas (Privacy Shield / AI Gateway) para higienizar e blindar todo o fluxo que sai para o modelo de linguagem:

1.  **Tokenização Client-Side (React):** O frontend filtra o payload antes da requisição, identificando e substituindo por regex documentos (CPF/RG) por placeholders `[DOCUMENTO]`.
2.  **AI Gateway Proxy (FastAPI):** O backend substitui nomes próprios de liderados por senioridades ou placeholders abstratos (ex: `[COLABORADOR]`). Um filtro semântico de segurança intercepta relatos de condições de saúde e os substitui por termos neutros (ex: `[MOTIVO_MÉDICO_REDUZIDO]`).
3.  **Contratos de Retenção Zero:** Utilizar credenciais corporativas que assegurem políticas de *Zero-Retention* (não utilização dos inputs para treinamento de modelos públicos).

---

## 3. Consequências

*   **Positivas:**
    *   **Mitigação de Risco Legal:** Conformidade total com a LGPD e políticas de governança da Clear IT.
    *   **Isolamento de Credenciais:** As chaves de API do Gemini residem apenas no backend (`.env`), eliminando vazamentos de tokens pelo navegador.
    *   **Estabilidade nos Prompts:** Evita alucinações do LLM causadas por nomes próprios.
*   **Negativas/Riscos:**
    *   **Abstração no Roteiro:** Os roteiros sugeridos pela IA usam termos genéricos (ex: *"Pergunte ao colaborador sobre..."*), exigindo que o líder complete mentalmente os nomes e referências específicas dos liderados.
