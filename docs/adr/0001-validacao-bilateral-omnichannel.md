# ADR 0001: Validação Bilateral via Canais de Comunicação (Omnichannel / Adaptive Cards)

*   **Status:** Aprovado
*   **Data:** 2026-07-06

---

## 1. Contexto

A especificação original das features **F-14 (Fluxo de Assinatura Bilateral)** e **F-16 (Painel do Liderado)** previa que a assinatura digital de acordos e a microvalidação da qualidade das reuniões (se saíram com 3 próximos passos claros) aconteceriam dentro da aplicação web principal (SPA React). 

Nesse fluxo clássico (Portal-Centric), o liderado precisaria receber um link de notificação, abrir o navegador, acessar a SPA, alternar o perfil de visualização e preencher a validação na tela. Esse fluxo introduz atrito de uso significativo (login, navegação, carregamento de página), aumentando o risco de baixo engajamento dos colaboradores.

---

## 2. Decisão

Adotar a abordagem **Agent-First (Headless UI / Omnichannel)** para a validação bilateral de atas e coleta de pautas (F-09, F-14 e F-16). 

A interface de formulário e validação será empacotada em formato **Adaptive Cards (JSON)** e enviada diretamente para a conversa de MS Teams ou corpo do E-mail do liderado. A interação ocorre diretamente dentro do fluxo de trabalho existente do usuário, disparando um webhook HTTP POST assinado para o nosso backend (FastAPI), que processa a validação e atualiza o estado in-place no chat.

---

## 3. Comparativo de Alternativas

| Critério | Opção A: Validação Web (SPA React) | Opção B: Validação Omnichannel (Headless Card) |
| :--- | :--- | :--- |
| **Atrito do Usuário** | **Alto** (exige cliques, login e navegação). | **Nulo** (ocorre dentro do Teams/e-mail de trabalho). |
| **Adoção e Engajamento** | **Baixo** (colaboradores evitam abrir portais adicionais). | **Alto** (resposta rápida em menos de 10 segundos). |
| **Esforço de Dev** | **Baixo-Médio** (controlado pelo estado local React). | **Médio-Alto** (requer integração com Bot Framework e Webhooks). |
| **Conformidade LGPD** | **Fácil** (dados isolados no localStorage local). | **Segura** (card trafega apenas caixas de seleção, sem textos confidenciais). |

---

## 4. Consequências

*   **Positivas:**
    *   Fricção operacional de validação de ritos reduzida a quase zero.
    *   Melhoria imediata no índice de clareza do RH devido à facilidade de resposta.
    *   Aderência real ao conceito de "Agent-First", com o agente indo até o usuário.
*   **Negativas/Riscos:**
    *   Aumento do escopo de engenharia (necessidade de registrar o bot de comunicação corporativa na nuvem da Microsoft/Slack).
    *   Exigência de chaves de assinatura e validação HTTPS expostas na API.
