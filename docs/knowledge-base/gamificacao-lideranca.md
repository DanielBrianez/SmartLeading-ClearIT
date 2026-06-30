# Base de Conhecimento: Gamificação na Liderança (Smart Leading)

Este documento atua como referência estratégica e técnica de como utilizar técnicas de gamificação para reverter o estigma negativo e a carga burocrática associados aos ritos de feedback e reuniões de 1:1 (Dor 2).

---

## 1. Visão Geral

A gamificação corporativa consiste na aplicação de elementos, dinâmicas e mecânicas de jogos em contextos profissionais para engajar colaboradores e resolver problemas reais. No **Smart Leading**, a gamificação é utilizada para reverter a percepção de que feedbacks e reuniões de 1:1 são tarefas administrativas enfadonhas ou instrumentos de punição.

Ao introduzir metas claras, progresso visual (maestria) e loops de feedback rápido, transformamos o processo de gestão em uma jornada de desenvolvimento contínuo e reconhecimento. O objetivo não é infantilizar o trabalho do líder, mas reduzir sua carga cognitiva e recompensar comportamentos consistentes que promovam a segurança psicológica e a cultura de desenvolvimento de pessoas.

---

## 2. Conceitos-Chave e Benchmarks

### 2.1. Benchmarks de Grandes Empresas

#### **Deloitte (Deloitte Leadership Academy)**
* **O que fazem:** Transformaram o treinamento executivo em uma jornada gamificada com missões de aprendizado estruturadas, badges e "níveis secretos" liberados após grandes conquistas.
* **Resultado:** Aumento de 47% no retorno de usuários semanais à plataforma de desenvolvimento.
* **Aplicação no Smart Leading:** Trilha de crescimento do líder (Levels de Liderança) atrelada ao desenvolvimento de seus liderados e cumprimento de missões específicas de gestão.

#### **Microsoft (Camp Copilot & Incentives)**
* **O que fazem:** Estimulam a adoção de novas ferramentas por meio de desafios práticos semanais (ex: demonstrar um superpoder usando IA), badges e placares amigáveis integrados ao Microsoft Teams.
* **Resultado:** Rápida curva de adoção corporativa e maior engajamento horizontal.
* **Aplicação no Smart Leading:** Campanhas ou "sprints de liderança" periódicas baseadas em datas críticas (ex: ciclo de avaliação ou onboarding de novos colaboradores).

#### **Google (Travel Expense Game)**
* **O que fazem:** Gamificaram a política de despesas de viagem de negócios. Os funcionários que escolhiam opções de voo ou hotel mais econômicas podiam reverter parte da economia em bônus salarial ou direcionar para uma instituição de caridade de sua escolha.
* **Resultado:** Redução de custos e aumento do senso de autonomia e propósito social.
* **Aplicação no Smart Leading:** Conectar as conquistas de liderança a incentivos intangíveis, como orçamento para capacitação do time (T&D) ou visibilidade de prestígio organizacional.

### 2.2. Transposição para a Dor 2 (Smart Leading)

Para mitigar a burocracia e a percepção de punição, a gamificação atua sobre três pilares de motivação intrínseca (Modelo Self-Determination Theory - SDT):

1. **Autonomia (Control):** O líder escolhe ativamente quais missões deseja perseguir no seu dashboard (ex: focar em feedback de reconhecimento ou no plano de carreira de um liderado).
2. **Competência (Mastery):** Acompanhamento visual da evolução da maturidade da liderança (de Iniciante a Líder Referência), gerando orgulho no próprio progresso.
3. **Propósito (Relatedness):** Foco no impacto humano das reuniões por meio do *Termômetro de Segurança Psicológica* e compartilhamento de atas transparentes (assinatura bilateral).

---

## 3. Exemplos Práticos

Abaixo, apresentamos uma modelagem conceitual e lógica do **Motor de Gamificação (Gamification Engine)** para o Smart Leading, calculando XP, Streaks de consistência e avaliando a liberação de badges (Achievements).

### 3.1. Estrutura de Dados do Líder

```json
{
  "leaderId": "L-392",
  "name": "Daniel Brianez",
  "level": "Consistente",
  "experiencePoints": 1450,
  "currentStreak": 4,
  "badges": [
    {
      "badgeId": "CONSISTENT_LEADER",
      "name": "Líder Consistente",
      "unlockedAt": "2026-06-15T10:00:00Z"
    }
  ]
}
```

### 3.2. Motor de Pontuação e Conquistas (Javascript)

```javascript
/**
 * Gamification Engine - Smart Leading
 * Regras de pontuação, multiplicadores de consistência (Streaks) e validação de Badges.
 */

const XP_RULES = {
  RITUAL_COMPLETED: 100,
  DOCUMENT_DOWNLOADED: 50,
  MISSION_COMPLETED: 150
};

const STREAK_MULTIPLIERS = {
  1: 1.0,
  2: 1.0,
  3: 1.1, // 3 ritos consecutivos no prazo
  4: 1.2, // 4 ritos consecutivos no prazo
  5: 1.3  // 5 ou mais ritos consecutivos no prazo (máximo)
};

/**
 * Calcula o ganho de XP aplicando o multiplicador de Streak de consistência.
 */
function calculateXPGain(actionType, currentStreak) {
  const baseXP = XP_RULES[actionType] || 0;
  const multiplier = STREAK_MULTIPLIERS[Math.min(currentStreak, 5)] || 1.0;
  return Math.round(baseXP * multiplier);
}

/**
 * Valida a elegibilidade para novas insígnias baseada nas estatísticas do líder.
 */
function checkBadgeEligibility(ritualsHistory, feedbackHistory, pdiHistory, currentBadges) {
  const newBadges = [];
  const currentBadgeIds = new Set(currentBadges.map(b => b.badgeId));

  // Regra 1: Badge "Líder Consistente" (Completar 4 ritos seguidos sem reagendamentos/atrasos)
  if (!currentBadgeIds.has("CONSISTENT_LEADER")) {
    const onTimeRituals = ritualsHistory.filter(r => r.status === "completed" && !r.rescheduled);
    if (onTimeRituals.length >= 4) {
      newBadges.push({
        badgeId: "CONSISTENT_LEADER",
        name: "Líder Consistente",
        unlockedAt: new Date().toISOString()
      });
    }
  }

  // Regra 2: Badge "Escuta de Ouro" (Completar 5 feedbacks usando a escuta ativa do liderado)
  if (!currentBadgeIds.has("GOLDEN_LISTENING")) {
    const activeListeningFeedbacks = feedbackHistory.filter(f => f.activeListeningChecked === true);
    if (activeListeningFeedbacks.length >= 5) {
      newBadges.push({
        badgeId: "GOLDEN_LISTENING",
        name: "Escuta de Ouro",
        unlockedAt: new Date().toISOString()
      });
    }
  }

  // Regra 3: Badge "Parceiro do Desenvolvimento" (Concluir com sucesso o primeiro PDI de um liderado)
  if (!currentBadgeIds.has("DEVELOPMENT_PARTNER")) {
    const completedPDIs = pdiHistory.filter(p => p.status === "completed");
    if (completedPDIs.length >= 1) {
      newBadges.push({
        badgeId: "DEVELOPMENT_PARTNER",
        name: "Parceiro do Desenvolvimento",
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newBadges;
}

// Exemplo de uso:
const ritualsHistory = [
  { id: "R-1", status: "completed", rescheduled: false },
  { id: "R-2", status: "completed", rescheduled: false },
  { id: "R-3", status: "completed", rescheduled: false },
  { id: "R-4", status: "completed", rescheduled: false }
];
const currentBadges = [];

const newUnlocked = checkBadgeEligibility(ritualsHistory, [], [], currentBadges);
console.log("Insígnias Desbloqueadas:", newUnlocked);
```

### 3.3. Fluxo de Recompensa de Ritos

```mermaid
graph TD
    A[Líder finaliza Rito de 1:1 ou Feedback] --> B[Gera PDF da Ata e executa download]
    B --> C[Registra evento de telemetria]
    C --> D[Verifica Streak de consistência do líder]
    D --> E[Aplica multiplicador de XP correspondente]
    E --> F[Atualiza perfil do líder no banco local]
    F --> G[Checa elegibilidade para novos Badges]
    G --> H[Redireciona para tela "Meu Perfil" com animação de recompensa]
```

---

## 4. Armadilhas (Gotchas)

Ao implementar gamificação para líderes, é crucial evitar os seguintes desvios comportamentais:

| Armadilha | Consequência | Mitigação no Smart Leading |
| :--- | :--- | :--- |
| **Placares Públicos de Piores Líderes** | Constrangimento, perda de engajamento e aumento da percepção punitiva da ferramenta. | O ranking ("Liga de Líderes") exibe apenas os melhores posicionados e foca na comparação amigável por área, sem expor notas privadas ou rankings depreciativos. |
| **"Gaming the System" (Trapaça)** | Líderes geram reuniões falsas ou atas vazias e genéricas apenas para pontuar XP rápido. | Inclusão de travas mínimas de preenchimento (ex: caracteres mínimos nas atas, validação de que os planos de ação/acordos foram preenchidos antes do download). |
| **Efeito Extrínseco Temporário** | A participação cai assim que as insígnias deixam de ser uma novidade visual. | Vincular as insígnias a reconhecimentos intangíveis da empresa (menções em newsletters, credenciamento para programas de mentoria interna ou preferência em cursos de liderança). |
| **Falta de Segurança Psicológica** | Liderados sentirem que suas vulnerabilidades viraram "pontos" de um jogo de gestão do líder. | A pontuação é baseada nas atitudes do *líder* (cadência, preenchimento de atas, planos de ação claras) e nunca na avaliação direta da intimidade ou no conteúdo confidencial do liderado. |
