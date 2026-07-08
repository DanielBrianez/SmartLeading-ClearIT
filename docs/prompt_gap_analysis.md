# Análise Avançada de Gaps: Engenharia de Prompt (Smart Leading V2)

**Autor:** Staff Prompt Engineer  
**Status:** Revisado & Aprovado  
**Objetivo:** Analisar a arquitetura de IA, o fluxo de dados entre frontend/backend, examinar a qualidade dos prompts ativos e propor o plano de ação técnico para as features pendentes.

---

## 1. Auditoria do Fluxo de Prompts Atual

### A. O Fluxo de Dados (React ➔ FastAPI ➔ Gemini)
Ao auditar o arquivo [Meus1a1.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Meus1a1.jsx#L162-L187) no frontend e o [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py#L24-L30) no backend, identificamos uma vulnerabilidade estrutural de Engenharia de Prompt (comumente chamada de **"React Context Hack"**):

1.  **O Hack do Frontend:** Para suprir a falta de campos estruturados no modelo do Pydantic no backend (`RoteiroRequest`), o frontend mescla instruções de sistema e dados históricos em uma única string gigante no parâmetro `resumo_entregas`:
    ```javascript
    const historicoOculto = `
    [INFORMAÇÃO DE SISTEMA PARA A IA - CONTEXTO OBRIGATÓRIO DA MENTORIA]:
    Abaixo está o histórico real do liderado extraído do banco de dados. Use essas informações para personalizar a pauta:
    >> Histórico de PDIs: ${resumoPdis}
    >> Histórico de Acordos e Tarefas: ${resumoTasks}
    [OBSERVAÇÕES DO LÍDER PARA ESSA REUNIÃO]: ${textoLimpo}
    `;
    ```
2.  **A Ingestão no Backend:** O FastAPI simplesmente recebe essa string e a repassa diretamente ao prompt do Gemini:
    ```python
    - Foco / Entregas Recentes: {entregas}
    ```

#### 🚨 Riscos Técnicos Dessa Abordagem:
*   **Prompt Injection:** O usuário (líder), ao digitar no campo livre `textoLimpo`, pode inadvertidamente (ou intencionalmente) anular as instruções do sistema, já que seu texto é anexado diretamente ao final de um bloco de instruções de sistema injetado.
*   **Poluição de Contexto:** A IA recebe metadados e instruções de formatação misturados na mesma variável que deveria conter apenas o foco/entregas. Isso reduz a precisão da IA ao gerar o roteiro e a ata oficial.
*   **Dificuldade de Validação de Lacunas (F-21):** Como o backend não recebe as variáveis de histórico de forma estruturada (como arrays JSON), torna-se impossível programar uma lógica determinística ou um prompt limpo de validação para checar se os 5 blocos obrigatórios de 1:1 foram contemplados.

---

## 2. Gaps de Prompt por Feature (Especificação vs. Código)

### F-01: Co-Pilot de Roteiro de 1:1 e Feedback (SBI Guard)
*   **O que a Especificação exige:** O Co-pilot deve reescrever feedbacks adjetivados em dados factuais baseados na metodologia SBI (Situação-Comportamento-Impacto), limpando termos subjetivos.
*   **O que o Código faz:** O prompt em [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py#L44-L99) é monolítico e focado apenas no formato geral de 1:1 (com o framework CRIA). Não há lógica no backend para alternar o prompt ou o comportamento da IA caso o líder selecione um rito do tipo "Feedback Corretivo" ou "Feedback de Reconhecimento".
*   **Prompt de SBI Inexistente:** O motor do SBI Guard (sanitizador de atritos) não está implementado na camada de prompts.

### F-17: Módulo de Alerta de Risco de Colaborador (Opt-In)
*   **O que a Especificação exige:** A IA deve analisar o texto descritivo do risco (100% anonimizado) e retornar a classificação do risco (`Carreira`, `Clima` ou `Performance`) e sua severidade (`Baixa`, `Média`, `Alta`).
*   **O que o Código faz:** Genuinamente não implementado. Não existe nenhum prompt de classificação semântica ou endpoint associado no backend.

### F-20: Orquestração Multi-Agente (Collaborative Networks)
*   **O que a Especificação exige:** Divisão do processamento da IA em dois agentes especialistas (`Agente de Carreira` e `Agente de Clima`) que discutem o caso antes de consolidar a resposta do roteiro e do PDI.
*   **O que o Código faz:** O backend executa apenas uma chamada direta de modelo único (`gemini-3.1-flash-lite`) com um prompt contendo diretrizes estáticas. Não há prompts de sistema para os papéis de cada agente, nem histórico de interações multi-agente.

### F-21: Redução de Formulários & Feedback de Lacunas
*   **O que a Especificação exige:** O líder insere apenas um direcionamento em prompt único. A IA analisa se há informações contextuais suficientes para preencher os **5 blocos obrigatórios** de 1:1 da ClearIT e avisa o gestor sobre os blocos incompletos.
*   **O que o Código faz:** O backend não possui instruções de prompt para avaliar a cobertura dos 5 blocos, aceitando qualquer string como entrada e gerando o roteiro sem fornecer o feedback de lacunas.

---

## 3. Plano de Ação de Engenharia de Prompt (Recomendações Staff)

Para alinhar os prompts à arquitetura de produção e corrigir os gaps identificados, devemos seguir estas quatro diretrizes de engenharia:

### Diretriz 1: Migração Completa para JSON Mode
Devemos descontinuar o separador textual `--- ATA OFICIAL ---` (que quebra se o modelo oscilar na formatação) e configurar a chamada da API para retornar JSON estruturado.

#### Schema JSON de Saída Recomendado para a Rota `/api/gerar-roteiro`:
```json
{
  "roteiro_lider": {
    "check_in": "Markdown...",
    "pauta_liderado": "Markdown...",
    "obstaculos": "Markdown...",
    "desenvolvimento_cria": {
      "contexto": "Markdown...",
      "redirecionamento": "Markdown...",
      "impacto": "Markdown...",
      "alinhamento": "Markdown..."
    },
    "acordos_proximos_passos": "Markdown..."
  },
  "ata_rh": {
    "resumo_alinhamento": "Ata formal e impessoal em formato corporativo...",
    "acordos_firmados": ["Acordo 1", "Acordo 2"]
  },
  "alertas_lacunas": ["Obstáculos", "Pauta do Liderado"]
}
```

### Diretriz 2: Refatoração do Payload (Desacoplamento de Sistema e Dados)
O modelo `RoteiroRequest` no [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py) deve ser reestruturado para receber o contexto de forma limpa, eliminando a injeção de texto do React:
```python
class RoteiroRequest(BaseModel):
    perfil_lideranca: str
    senioridade_liderado: str
    tempo_casa: str
    perfil_comportamental: str
    direcionamento_lider: str
    acordos_anteriores: list[dict]  # Histórico estruturado
    pdis_ativos: list[dict]         # Histórico estruturado
```

### Diretriz 3: Implementação de Few-Shot Prompts para SBI Guard (F-01)
Devemos incluir no prompt do SBI Guard exemplos de higienização de feedback para forçar o modelo a converter adjetivos em comportamentos factuais:

*   *Exemplo de Entrada:* "O colaborador é desorganizado e sempre atrasa as reuniões de squad."
*   *Exemplo de Saída Esperada (SBI Factual):* "Observou-se que o colaborador não compareceu no horário das últimas 3 reuniões diárias do squad (Situação/Comportamento), o que gerou atraso na sincronização das atividades do restante da equipe (Impacto)."

### Diretriz 4: Firewall Semântico de LGPD no System Prompt
Inserir uma instrução inegociável de sistema no prompt do Gemini para atuar como segunda camada de proteção de dados:
```text
[CRITICAL PRIVACY DIRECTIVE]
NUNCA utilize nomes próprios, salários explícitos ou dados pessoais (PII) nas chaves "ata_rh" do JSON de saída. 
Qualquer menção a pessoas físicas contida nos dados de entrada deve ser obrigatoriamente higienizada e substituída por tokens genéricos como [COLABORADOR] e [LIDER].
```
