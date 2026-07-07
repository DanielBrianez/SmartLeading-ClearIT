# Análise de Gaps: Engenharia de Prompt (Smart Leading V2)

Este relatório apresenta o diagnóstico técnico e de conformidade da **Engenharia de Prompt** do ecossistema Smart Leading (ClearIT). Mapeamos o estado atual dos prompts implementados, as lacunas em relação ao backlog de produto e as otimizações recomendadas para elevar a maturidade da IA como Staff Prompt Engineer.

---

## 🗺️ 1. O que já temos (Implementado)

Atualmente, o único prompt operacional no sistema é o gerador de roteiros em [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py#L44-L99):

*   **Roteiro em 5 Blocos:** Estrutura o guia confidencial do gestor alinhado com a governança da ClearIT (Check-in, Pauta, Obstáculos, Desenvolvimento, Acordos).
*   **Integração do Framework CRIA:** Incorpora de forma correta o framework CRIA (`[C] Contexto`, `[R] Redirecionamento`, `[I] Impacto`, `[A] Alinhamento`) dentro do *Bloco 4 (Desenvolvimento & Carreira)* para guiar feedbacks técnicos e comportamentais.
*   **Tom de Voz Adaptativo:** Adapta a abordagem às características do líder (`Técnico`, `Em Transição` ou `Engajado`).
*   **Resposta Bipartida (Split Response):** Utiliza a tag divisora `--- ATA OFICIAL ---` para extrair tanto o roteiro do líder quanto a ata de RH em uma única chamada.

---

## 🔍 2. O que está faltando (Gaps / Lacunas no Backlog)

Para suportar todas as features documentadas nos contextos de negócio e tecnologia, faltam implementar os seguintes prompts especializados no backend:

### A. Mapeamento de Risco e Severidade (F-17)
*   **Requisito:** IA precisa ler o texto anonimizado de risco de turnover ou performance escrito pelo líder e classificar o tipo do risco (`Carreira`, `Clima` ou `Performance`) e sua severidade (`Baixa`, `Média`, `Alta`).
*   **Estado Atual:** Não há prompt ou modelo de IA configurado para fazer essa classificação de urgência do RH.

### B. Prompts de Agentes Especializados (F-20)
*   **Requisito:** A arquitetura prevê uma rede multi-agente cooperativa com dois papéis:
    1.  `Agente de Carreira`: Focado no PDI, histórico de entregas e requisitos de promoção do Levels.
    2.  `Agente de Clima`: Focado na evolução emocional e humor obtidos nos check-ins.
*   **Estado Atual:** Não existem os prompts de sistema (*System Instructions*) que definam as personas, responsabilidades e fluxos de diálogo entre esses dois agentes.

### C. Validação de Lacunas da Caixa de Prompt Único (F-21)
*   **Requisito:** A IA precisa ler a intenção de pauta inserida pelo líder e identificar se alguma das **5 partes obrigatórias** da reunião de 1:1 ficou sem contexto ou sem pauta estruturada, retornando um alerta amigável.
*   **Estado Atual:** Falta a lógica de instrução no prompt para que a IA analise a pauta e cuspa os tópicos faltantes (ex: `["Obstáculos", "Desenvolvimento"]`).

### D. Engine do SBI Guard (F-01 / Feedbacks Corretivos)
*   **Requisito:** Recrever fatos brutos observados pelo líder, limpando julgamentos de valor e substituindo adjetivos subjetivos (ex: trocar *"está preguiçoso"* por *"deixou de entregar os cards X e Y nas últimas 2 sprints"*).
*   **Estado Atual:** O prompt em `gemini.py` força o uso do CRIA para qualquer contexto, mas não possui instruções específicas para a técnica SBI (Situation-Behavior-Impact) e purificação semântica de atritos.

---

## 💡 3. O que precisa ser melhorado (Otimizações Recomendadas)

### A. Adotar o JSON Mode (Structured Outputs)
> [!IMPORTANT]
> **Problema:** A divisão de strings por expressões regulares em tags como `--- ATA OFICIAL ---` é frágil. Se a IA cometer um erro de sintaxe, o backend quebra.
> **Solução:** Configurar a API do Gemini com o parâmetro `response_mime_type="application/json"` e instruir o modelo a retornar um JSON estrito.
> **Exemplo de Schema Esperado:**
> ```json
> {
>   "roteiro_lider": "## 1. Check-in...",
>   "ata_oficial": "Resumo executivo da ata...",
>   "lacunas_sinalizadas": ["Obstáculos"],
>   "competencias_clearit_avaliadas": ["Comunicação", "Orientação a Resultado"]
> }
> ```

### B. Ingestão Dinâmica das Competências de Levels (F-11)
> [!NOTE]
> **Problema:** As competências de senioridade estão hardcoded de forma ultra-simplificada no prompt (ex: *"Pleno: foco em autonomia"*).
> **Solução:** O prompt deve conter placeholders dinâmicos para receber a lista exata de competências que o colaborador está buscando desenvolver na sprint atual (ex: *"Para Pleno -> Sênior de Front-end, o Carlos precisa demonstrar competência em Arquitetura Limpa"*).

### C. Reforço Ativo contra Hallucinações de PII (LGPD Protection)
> [!WARNING]
> **Problema:** Embora o prompt instrua para não usar nomes, a IA pode violar a regra se o input de pauta trouxer nomes explícitos.
> **Solução:** Inserir diretrizes no prompt atuando como firewall semântico: *"NUNCA utilize nomes próprios, salários explícitos ou e-mails em qualquer ponto do JSON de saída. Substitua-os imediatamente por tags correspondentes como [COLABORADOR_PROTEGIDO], [LIDER_PROTEGIDO] e [SALÁRIO_OCULTO]"*.

### D. Aprendizado por Exemplos (Few-Shot Prompting)
> [!TIP]
> **Recomendação:** Incluir no prompt do sistema de 1 a 2 exemplos de conversação simulada (uma 1:1 de rotina e um feedback corretivo). Isso treina o modelo para manter a Ata Oficial sempre formal, impessoal e curta, prevenindo que a IA misture o tom confidencial do roteiro do líder com o resumo formal do RH.
