<<<<<<< HEAD
# 🛠️ Contexto Técnico e Arquitetura - Smart Leading V2 (Agent-First)

## 1. Stack Tecnológica
* **Frontend:** React (Vite), Tailwind CSS (Design *Premium* com Glassmorphism e Dark/Light Mode nativos), Lucide Icons (Iconografia corporativa).
* **Segurança (Client-Side):** *Semantic Firewall* (Motor de RegEx local que intercepta e mascara CPFs, salários e contatos antes de qualquer requisição HTTP).
* **Backend:** Python 3 (FastAPI) - Gateway de telemetria leve e orquestração de rotas.
* **Inteligência Artificial:** Google Gemini API (Modelo `gemini-1.5-flash`) operando com engenharia de prompts estrita (Metodologia CRIA) e parsing via `ReactMarkdown`.
* **Persistência e Estado:** `localStorage` (Cofre isolado *Zero PII* no browser para persistência de atas, acordos/tasks ilimitadas, PDIs com Trava SMART e XP de Governança Bilateral).
* **Geração de Documentos:** `html2pdf.js` para renderização corporativa de PDFs no cliente (Atas de 1:1 e Relatórios DRE do RH), eliminando o tráfego de arquivos sensíveis no servidor.

## 2. Diagrama de Arquitetura do Sistema (Mermaid)

O diagrama abaixo ilustra o fluxo de dados unificado da arquitetura *Agent-First*, destacando o isolamento do cofre local, a interceptação do Semantic Firewall e a ponte paramétrica com o motor de IA:

```mermaid
graph TD
    subgraph Client_Browser [Navegador do Usuário - Sandbox Seguro]
        UI[React Frontend App / Dashboards]
        FW[Semantic Firewall: Filtro LGPD Ativo]
        LS[localStorage: Cofre de Atas, PDIs e XP Bilateral]
        PDF[html2pdf.js Client Engine]
    end

    subgraph Backend_Server [Backend Clear IT]
        API[FastAPI Gateway & Telemetria]
        AGENT[ai_agent.py / Metodologia CRIA]
    end

    subgraph External_Services [Google Cloud AI]
        GEMINI[Gemini 1.5 Flash API]
    end

    %% Fluxos de Dados
    UI -->|1. Salva/Lê Estados de Interface| LS
    UI -->|2. Submete Observações Brutas| FW
    FW -->|3. Dispara Payload JSON Anonimizado| API
    API -->|4. Monta Prompt Estruturado CRIA| AGENT
    AGENT -->|5. Inferência Segura Zero-PII| GEMINI
    GEMINI -->|6. Retorna Markdown Estruturado| AGENT
    AGENT -->|7. Payload JSON Roteiro/Ata| UI
    UI -->|8. Dispara Impressão Client-Side| PDF
    PDF -->|9. Gera PDF Privado (Ata ou DRE)| Local_Disk[Disco Local do Usuário]
    UI -.->|10. Liderado Avalia Rito In-App| LS

    classDef browser fill:#eff6ff,stroke:#3b82f6,stroke-width:2px;
    classDef firewall fill:#fee2e2,stroke:#ef4444,stroke-width:2px,stroke-dasharray: 5 5;
    classDef server fill:#f0fdf4,stroke:#10b981,stroke-width:2px;
    classDef external fill:#fff7ed,stroke:#f97316,stroke-width:2px;
    
    class UI,LS,PDF browser;
    class FW firewall;
    class API,AGENT server;
    class GEMINI external;
=======
# 🛠️ Contexto Técnico e Arquitetura - Smart Leading

> Este arquivo é a fonte de verdade para Engenharia. O agente `@engineer` atualizará este arquivo com planos de implementação, especificações técnicas e decisões arquiteturais sob as diretrizes do [Engineer Cycle (@engineer)](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/docs/onion-cycles.md#L29).

## 1. Stack Tecnológica
* **Frontend:** React (Vite), Tailwind CSS (Interface responsiva e gráficos puros nativos), Lucide Icons (Iconografia unificada).
* **Backend:** Python 3 (FastAPI) - Router serverless, telemetria e orquestração.
* **Inteligência Artificial:** Google Gemini API (Modelo `gemini-3.1-flash-lite`) operando com engenharia de prompts estruturada via JSON/Markdown.
* **Persistência e Estado:** 
  - **Client-Side:** `localStorage` (Cofre isolado no browser para persistência de atas locais e rascunhos de PDIs).
  - **Server-Side (Serverless DB):** Banco de Dados **PostgreSQL Serverless** (ex: Neon/Supabase) para persistência segura de logs de telemetria, sinalizações de risco nominais da empresa e status bilateral de validação dos ritos.
* **Geração de Documentos:** `html2pdf.js` para renderização perfeita de PDFs no cliente sem sobrecarregar o servidor.

## 2. Diagrama de Arquitetura do Sistema (Mermaid)

O diagrama abaixo ilustra o fluxo de dados unificado, o isolamento do cofre local e a ponte paramétrica com o motor de IA:

```mermaid
graph TD
    subgraph Client_Browser [Navegador do Líder - Sandbox Seguro]
        UI[React Frontend App]
        LS[localStorage: Atas, Tasks, PDI, Adiamentos]
        PDF[html2pdf.js Client Engine]
    end

    subgraph Backend_Server [Backend Clear IT - Serverless]
        API[FastAPI Router]
        AGENT[ai_agent.py / gemini.py]
        DB[(PostgreSQL Serverless)]
    end

    subgraph External_Services [Google Cloud AI]
        GEMINI[Gemini 3.1 Flash Lite API]
    end

    %% Fluxos de Dados
    UI -->|1. Salva/Lê Estados Completos| LS
    UI -->|2. Dispara Requisição Paramétrica| API
    API -->|3. Monta Prompt Estruturado CRIA| AGENT
    AGENT -->|4. Inferência Seguro No-PII| GEMINI
    GEMINI -->|5. Retorna Markdown Separado| AGENT
    AGENT -->|6. Payload JSON Roteiro/Ata| UI
    UI -->|7. Dispara Impressão Local| PDF
    PDF -->|8. Gera Ficheiro .pdf Privado| Local_Disk[Disco do Utilizador]
    API -->|9. Persiste Dados e Risco| DB

    classDef browser fill:#eff6ff,stroke:#3b82f6,stroke-width:2px;
    classDef server fill:#f0fdf4,stroke:#10b981,stroke-width:2px;
    classDef external fill:#fff7ed,stroke:#f97316,stroke-width:2px;
    
    class UI,LS,PDF browser;
    class API,AGENT,DB server;
    class GEMINI external;
```

---

## 3. Visão Geral dos Componentes e Fluxo de Dados (Data Flow)

### 3.1. Visão Geral dos Componentes
*   **Front-end (Client & Local Sandbox):** React.js (via Vite) + Tailwind CSS + Lucide Icons. Responsável pela renderização responsiva (SPA), Cross-Routing de dados (Navegação contextual), dashboards interativos e compilação Client-Side de HTML para PDF via `html2pdf.js`. O cofre local (`localStorage`) persiste atas detalhadas, rascunhos e PDIs de forma isolada, garantindo privacidade e agilidade nas dashboards.
*   **Back-end (API Gateway & Telemetry):** Python 3 + FastAPI. Atua como gateway seguro de IA (anonimização e higienização semântica), orquestra as inferências e persiste metadados de telemetria, sinalizações de risco nominais da empresa e status bilateral de validação dos ritos no banco PostgreSQL Serverless.
*   **Módulo de IA (`gemini.py`):** Encapsula a integração segura com a API do Google Gemini (utilizando o modelo `gemini-3.1-flash-lite`) operando com engenharia de prompts estruturada via JSON/Markdown (Roteiro vs. Ata Oficial).

### 3.2. Fluxos Principais de Dados (Data Flow)
*   **Fluxo A (Geração Paramétrica - Metodologia CRIA):**
    1. O líder preenche os parâmetros de contexto (Senioridade, Momento, Entregas) no front-end.
    2. O frontend realiza a tokenização de dados sensíveis locais (como CPF/RG) substituindo por `[DOCUMENTO]`.
    3. O React envia o payload anonimizado em `JSON` via `POST` para `/api/gerar-roteiro`.
    4. O **FastAPI** recebe o payload, higieniza termos de saúde sensíveis via gateway de privacidade e anexa as instruções da Metodologia CRIA antes de enviar ao Gemini.
    5. O Gemini processa o contexto parametrizado e retorna o roteiro estruturado.
    6. O FastAPI repassa a resposta para o React, que renderiza a interface reativamente.
*   **Fluxo B (Assinatura, Armazenamento e Telemetria):**
    1. O líder conduz a 1:1, formaliza os acordos e aciona o download da Ata Oficial.
    2. O React aciona a biblioteca `html2pdf.js` para capturar a DOM e compilar o PDF localmente na máquina do gestor.
    3. O front-end salva a Ata e atualiza os PDIs no `localStorage`, creditando XP (preparação e condução) e marcando o XP final de validação como pendente.
    4. Em *background*, o React dispara um `POST` para o backend para registrar o evento e as métricas anonimizadas de telemetria no banco de dados.

### 3.3. Princípios de Segurança e "LGPD By Design"
A arquitetura blinda a empresa contra vazamentos e passivos trabalhistas através de três pilares:
*   **Geração Client-Side Exclusiva:** O arquivo PDF final contendo os feedbacks, conversas e combinados nominais é gerado exclusivamente no navegador. O backend da ClearIT nunca recebe o arquivo compilado com o texto livre, impossibilitando interceptações na rede ou vazamento de dados de texto de feedbacks.
*   **Zero PII no Provedor de IA:** O tráfego para a API do Gemini é feito com dados anonimizados e tokenizados. Além disso, as credenciais operam sob políticas de retenção zero (Zero-Retention Policy) para impedir o treinamento de modelos públicos com os dados da empresa.
*   **Isolamento de Credenciais:** Chaves sensíveis de API (`GEMINI_API_KEY`) residem exclusivamente no servidor backend (via variáveis de ambiente `.env`), nunca expostas ao cliente navegador.

---

## 4. Especificações Técnicas de Implementação (MVP)

### 4.1. Arquitetura do Privacy Shield & AI Gateway (F-13)
Para garantir conformidade inegociável com a LGPD e mitigar passivos trabalhistas, implementamos a segurança em 3 camadas:
1.  **Tokenização Client-Side:** Antes de disparar a requisição de texto à API, scripts no frontend (React) detectam e mascaram padrões regex de documentos (`\d{3}\.\d{3}\.\d{3}-\d{2}` para CPF, etc.) substituindo-os por `[DOCUMENTO]`.
2.  **AI Gateway Proxy (Higienização Semântica):** O backend FastAPI atua como um gateway intermediário filtrando menções a diagnósticos de saúde (como depressão, burnout) ou adjetivos de ataque ao caráter, substituindo-os por termos neutros (ex: *"está com depressão"* vira `[MOTIVO_MÉDICO_REDUZIDO]`).
3.  **Zero-Retention Policy:** As credenciais e contratos de API com o provedor de LLM (Gemini) são configuradas no modo corporativo com retenção zero de dados de entrada para treino de modelos.

### 4.2. Roteamento Dinâmico de Prompts (F-01)
O endpoint `/api/gerar-roteiro` do backend FastAPI aceita o parâmetro `tipo_conversa` para definir dinamicamente o prompt e comportamento da IA:
*   **Parâmetro `11`:** Ativa o prompt estruturado em 5 blocos da ClearIT (Check-in humano, Pauta do liderado, Status/Obstáculos, Desenvolvimento/Levels, Acordos).
*   **Parâmetro `feedback` (SBI Guard):** Ativa o prompt que expurga adjetivos e força o roteiro nas 4 etapas (Contexto, Escuta Ativa, SBI Factual e Co-construção).

### 4.3. UX Scaffolding Dinâmico (F-02)
O Editor Rich Text no frontend carrega cabeçalhos estruturados com base no tipo de rito selecionado. As tags HTML/Markdown dos cabeçalhos (estilizados em Bold grafite/azul-marinho profundo) são marcadas como `contenteditable="false"` para travar a deleção dos títulos, enquanto o conteúdo interno abaixo deles aceita edição normal (`contenteditable="true"`).
Além disso, o campo de anotações do líder carrega guias de rascunho de tom cinza claro (`text-slate-300 / dark:text-slate-700` ou baixa opacidade) com a estrutura dos 5 blocos da ClearIT, agindo como rascunho flutuante que orienta a escrita sem bloquear a edição livre.


### 4.4. Extrator de Acordos Dinâmicos - NER (F-10)
Ao abrir a tela de preparação de uma nova reunião para um liderado, o frontend busca no `localStorage` a ata anterior desse mesmo colaborador. A IA varre o Bloco 4 (`🤝 4. Acordos e Próximos Passos`) utilizando processamento de linguagem natural básico para extrair a estrutura:
*   `[Quem fez]` + `[O que fez]` + `[Prazo]`
O resultado é injetado como um checklist de acompanhamento in-app obrigatório no cabeçalho da preparação atual.

### 4.5. Monitor de Cadência Relacional (F-08)
O card de "Colaboradores Descobertos" no Painel do RH calcula a diferença de dias entre a data atual e a data do último rito registrado localmente no banco para cada funcionário:
*   `Diferenca_Dias = Data_Atual - Data_Ultimo_Rito`
Se `Diferenca_Dias > 30`, o colaborador é adicionado à lista de risco nominal na dashboard do RH, e o botão `[⚡ Disparar Lembrete]` fica disponível. **Esta lógica roda inteiramente no cliente via JavaScript relacional puro (ou consulta de banco sem IA) para assegurar custo zero e precisão de dados.**

### 4.6. Segregação de Dados no Alerta de Risco (F-17)
Ao marcar a checkbox de "Reportar risco crítico de turnover/performance":
*   O nome do colaborador e do líder são gravados exclusivamente na tabela de banco local protegida da empresa.
*   O texto descritivo do motivo é higienizado e tokenizado via AI Gateway antes de ser enviado à IA.
*   A IA analisa o texto anonimizado e retorna apenas o tipo do risco (Carreira/Clima/Performance) e severidade (Alta/Média/Baixa) para alimentar a lista de urgências do BP de RH.

### 4.7. Mecânicas Técnicas de Gamificação Colaborativa (F-03 & F-04)
1.  **Lógica da Validação Bilateral:** Ao finalizar um rito, o backend grava a ata com `status: "pendente"` e gera um hash identificador do rito. O frontend do liderado (**F-16**) consulta os ritos pendentes de validação e expõe as perguntas fechadas (clareza e relevância). Quando o liderado valida, o frontend dispara uma requisição que altera o status do rito para `"concluido"`, gravando as respostas no banco PostgreSQL Serverless, disparando a liberação de XP para ambos os perfis no `localStorage` e a computação no ranking.
2.  **Cálculo do Índice de Clareza do RH:** A microvalidação do colaborador envia ao banco de telemetria a resposta binária (`sentiu_clareza = 1` ou `0`). O painel do RH calcula o índice de clareza pela fórmula:
    $$\text{Indice de Clareza} = \frac{\sum \text{sentiu\_clareza}}{\text{Total de Ritos Validados}} \times 100$$
3.  **Cálculo do Índice de Relevância de Carreira (IRC) do RH:** O endpoint `/api/rh/metricas` lê a resposta binária do liderado (`relevante_carreira = 1` ou `0`) e calcula o IRC agregado pela fórmula:
    $$\text{IRC} = \frac{\sum \text{relevante\_carreira}}{\text{Total de Ritos Validados}} \times 100$$
4.  **Alerta de IRC Crítico e Suporte ao Gestor:** A lógica do backend/frontend monitora o IRC de cada gestor individualmente. Caso o `IRC_do_Gestor < 70%`, o sistema destaca o gestor no painel do RH em cor de alerta/vermelho suave com a indicação `[Apoio Necessário]`, orientando o RH a oferecer mentoria e treinamento em gestão/carreira para esse líder.
5.  **Distribuição de Pontos em 3 Fases (IA Flow):** O XP de um rito é distribuído e persistido em três etapas transacionais no `localStorage`:

    *   `XP_Preparacao` (+30 XP) liberado no callback de sucesso da geração do roteiro com a IA (/api/gerar-roteiro).
    *   `XP_Conducao` (+30 XP) liberado ao preencher todos os blocos obrigatórios da ata no editor.
    *   `XP_Validacao` (+40 XP) liberado apenas após a confirmação digital (microvalidação) do liderado.
4.  **Mapeamento de Níveis no Banco:** O perfil do líder no banco local mantém a chave `xpTotal`. A proficiência comportamental é calculada e renderizada dinamicamente com base nas faixas de XP e no perfil cadastrado, mapeando os rótulos do RH para as trilhas técnicas correspondentes:
    *   `XP < 500` ➔ `Nivel 1: Iniciante` (Trilha: Líder Técnico)
    *   `500 <= XP < 1500` ➔ `Nivel 2: Em Desenvolvimento` (Trilha: Líder em Transição)
    *   `1500 <= XP < 3000` ➔ `Nivel 3: Consistente` (Trilha: Líder Engajado)
    *   `XP >= 3000` ➔ `Nivel 4: Referência` (Trilha: Líder Multiplicador)

### 4.8. Arquitetura de Micro-Interfaces e Omnicanalidade (F-18)
As interações omnichannel com o Smart Leading baseiam-se em Adaptive Cards no padrão JSON, consumidos por clientes como MS Teams e clientes de e-mail compatíveis. A renderização do layout e a captura de dados ocorrem fora da SPA, sendo orquestradas pelo backend FastAPI que monta e entrega os schemas dinâmicos de card.

### 4.9. Reconhecimento Multimodal de Voz/Manuscritos (F-19)
* **Entrada de Imagem (Visão):** O frontend envia imagens convertidas em Base64 ou arquivos multipart para `/api/multimodal/ocr`. O backend consome a API multimodal do Gemini (`gemini-2.5-flash` ou superior) enviando as instruções e a imagem para extração de texto (OCR) e estruturação semântica.
* **Entrada de Voz:** Áudios curtos de até 30 segundos são capturados no frontend e convertidos em texto usando APIs nativas do browser (Web Speech API) ou enviados ao backend para processamento STT (Speech-to-Text).
* **Mapeamento:** O texto extraído é limpo e injetado nos 5 blocos obrigatórios de 1:1.

### 4.10. Rede Cooperativa de Multi-Agentes (F-20)
O backend orquestrará a geração de roteiros através de agentes especializados definidos por papéis (prompts de sistema dedicados):
* **Agente de Carreira (Pessoas):** Análises com foco em Levels e PDI.
* **Agente de Clima (Comportamento):** Análises com foco em sentimentos e bem-estar.
O pipeline executa inferências encadeadas: o Agente de Clima analisa o tom emocional recente, passando insights para o Agente de Carreira, que por sua vez gera o roteiro final equilibrando metas e sensibilidade.

### 4.11. Motor Inteligente de Redução de Formulários (F-21)
Ao receber uma pauta contendo apenas um prompt curto (ex: "Falar sobre promoção do Carlos"), o endpoint `/api/gerar-roteiro` realiza as seguintes operações:
1. Busca no banco de dados e no payload o histórico de atas, PDI e tarefas do liderado selecionado.
2. Valida o prompt e o histórico contra os **5 blocos essenciais** de 1:1 (Check-in Humano, Pauta do Liderado, Obstáculos, Desenvolvimento, Acordos).
3. **Alerta de Lacunas:** Se algum dos blocos obrigatórios não contiver dados contextuais suficientes (ex: nenhuma pauta enviada previamente ou falta de PDI ativo), a API do backend retorna uma lista de avisos em `alertas_blocos` (ex: `["Pauta do Liderado", "Obstáculos"]`) e a interface do gestor exibe um alerta indicando que tais tópicos precisarão ser investigados durante a conversa.

### 4.12. Validação Omnichannel Headless via Webhooks (F-22)
Conforme estabelecido na [ADR 0004](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/docs/knowledge-base/adr/0004-validacao-bilateral-omnichannel.md), a validação bilateral é concluída sem navegação na SPA React:
1. O backend envia um Adaptive Card para o MS Teams ou E-mail com caixas de seleção sobre a clareza do encontro e acordos firmados.
2. A resposta do usuário dispara um payload de ação do tipo `Action.Execute` para o webhook `/api/webhooks/valida-rito` no backend FastAPI.
3. O backend autentica a assinatura do webhook, processa a resposta binária (`sentiu_clareza`), atualiza o status da ata correspondente no banco PostgreSQL Serverless para `"concluido"`, e credita a pontuação de XP final de validação (+40 XP) no `localStorage` por meio de sincronização no próximo carregamento da interface.

### 4.13. Autenticação Baseada em Perfis (Role-Based Login) (F-23)
A aplicação implementa controle de acesso baseado em papéis (RBAC) com três jornadas isoladas:
1. **Mapeamento de Contas de Teste (Mock):**
   - **Líder:** `lider@clearit.com` / Senha: `lider123` (role: `lider`)
   - **Liderado:** `liderado@clearit.com` / Senha: `liderado123` (role: `liderado`)
   - **RH:** `rh@clearit.com` / Senha: `rh123` (role: `rh`)
2. **Segregação de Rotas na SPA:** O frontend React utiliza um contexto de autenticação (`AuthContext`) que armazena os dados do usuário logado e seu papel (`role`: `lider`, `liderado`, `rh`). O roteador da SPA (`App.jsx`) filtra a visibilidade das abas do painel e intercepta qualquer tentativa de acesso a rotas não autorizadas, redirecionando o usuário para sua respectiva home.
2. **Isolamento de API no Backend:** Os endpoints do FastAPI validam o cabeçalho de autorização (Bearer Token contendo o `role` do usuário). Endpoints administrativos/People Analytics (`/api/rh/*`) retornam `403 Forbidden` se acionados por tokens de perfis de líderes ou liderados.
3. **Mapeamento de Acesso:**
   - `lider`: Acessa `/api/gerar-roteiro`, `/api/registrar-download`, e gerencia dados de squads do `localStorage`.
   - `liderado`: Acessa `/api/webhooks/valida-rito` e visualiza histórico de atas e PDIs.
   - `rh`: Acessa `/api/rh/metricas` e `/api/rh/alerta-risco`.

---

## 5. Plano de Implementação por Feature e Checklists

Para sanar todos os gaps listados em `docs/onion-gap-analysis.md` de forma organizada e segura, a implementação do backend (FastAPI) e frontend (React) será dividida em 6 fases de engenharia.

---

### Fase 1: Compliance Guardrails & Privacy Shield (F-13)
*Garante a segurança jurídica (LGPD) e higienização semântica do gateway antes de habilitar novos fluxos de IA.*

#### Arquivos Afetados:
- Backend: [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py)
- Frontend: [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx)

#### Checklist de Ações:
- [ ] **Frontend:** Adicionar função de tokenização regex no payload antes de enviar para `/api/gerar-roteiro` (substituir CPFs, RGs, e-mails por placeholders `[DOCUMENTO]`).
- [ ] **Backend:** Implementar middleware/função no FastAPI para higienização semântica (varrer termos sensíveis de saúde como CIDs, depressão, estresse clínico e substituir por `[MOTIVO_MÉDICO_REDUZIDO]` antes de enviar ao Gemini).
- [ ] **Backend:** Configurar cabeçalho ou metadados de API do Gemini para garantir política de retenção zero (Enterprise Zero-Retention).

---

### Fase 2: Roteamento de Prompts, Levels & Histórico (F-01 + F-11)
*Aprimora a qualidade e contexto dos roteiros gerados pela IA conectando-os ao histórico do liderado e à matriz de Levels.*

#### Arquivos Afetados:
- Backend: [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py), [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py)
- Frontend: [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx)

#### Checklist de Ações:
- [ ] **Backend:** Adicionar novas variáveis de entrada no payload de `/api/gerar-roteiro` (receber o histórico simples da ata anterior e tarefas ativas).
- [ ] **Backend:** Atualizar o prompt no `gemini.py` com a Matriz de Competências e Habilidades oficiais do Levels da ClearIT para adequar a cobrança e dicas ao cargo correspondente.
- [ ] **Frontend:** Alterar o componente de envio de roteiro na aba de preparação para recuperar a ata anterior do `localStorage` e anexar os resumos e metas vigentes no payload enviado ao backend.

---

### Fase 3: Checklist de Acordos Dinâmicos - NER (F-10)
*Força a continuidade e accountability prática resgatando combinados passados de atas anteriores.*

#### Arquivos Afetados:
- Frontend: [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx), [MeuSquad.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/MeuSquad.jsx)

#### Checklist de Ações:
- [ ] **Frontend:** Ao iniciar a preparação de uma nova reunião para um liderado, buscar a última ata no `localStorage`.
- [ ] **Frontend:** Desenvolver algoritmo de parsing em JavaScript para varrer a seção `🤝 4. Acordos e Próximos Passos` e extrair checklists no padrão `[Quem] + [O que] + [Prazo]`.
- [ ] **Frontend:** Renderizar no cabeçalho de preparação da nova reunião os combinados anteriores com checkboxes interativos de conclusão obrigatória.

---

### Fase 4: Gamificação & Painel do Liderado (F-03 + F-16 + F-23)
*Implementa a validação bilateral dos ritos, visualização do colaborador e segregação de acesso baseada em perfis.*

#### Arquivos Afetados:
- Frontend: [App.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/App.jsx), [Ranking.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Ranking.jsx), [MeuSquad.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/MeuSquad.jsx), [dados.js](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/dados.js)
- Backend: [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py)

#### Checklist de Ações:
- [ ] **Frontend:** Desenvolver tela de login na SPA React vinculada aos perfis de usuários de teste e salvando o estado em `AuthContext`.
- [ ] **Frontend:** Implementar rotas e menus de navegação privados, ocultando abas indisponíveis para o perfil autenticado.
- [ ] **Frontend/SPA:** Adicionar chave seletora no Header para alternar entre "Visão: Líder" e "Visão: Liderado" (simulando troca de contexto pelo `localStorage`).
- [ ] **Frontend:** Criar a visualização do liderado contendo: histórico pessoal de atas, badges conquistadas e checklist de metas ativas no PDI.
- [ ] **Frontend:** Implementar fluxo de microvalidação de atas pendentes no Painel do Liderado. O líder ganha XP parcial (+30 XP no preparo, +30 XP no registro) e o XP final de validação (+40 XP) só é liberado para ambos após o liderado responder às perguntas obrigatórias (clareza de próximos passos e relevância da 1:1 para a carreira).
- [ ] **Backend:** Adaptar as tabelas e endpoints de banco de dados para salvar a resposta de relevância (`relevante_carreira`).
- [ ] **Backend:** Criar endpoint de webhook `/api/webhooks/valida-rito` para receber requisições de validação de canais corporativos (MS Teams / E-mail Actionable Messages) e processar as respostas (clareza e relevância) e a liberação de XP correspondente.
- [ ] **Frontend:** Corrigir os dados estáticos do `Ranking.jsx` (associar ao `LEADERBOARD` do `dados.js` e ajustar papel de "Carlos Eduardo" para liderado).

---

### Fase 5: Dashboard do RH Integrada, Cadência & Alertas de Risco (F-04 + F-08 + F-17)
*Conecta o painel executivo de People Analytics ao arquivo de telemetria física do backend e implementa alarmes críticos.*

#### Arquivos Afetados:
- Backend: [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py)
- Frontend: [PainelRH.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/PainelRH.jsx), [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx)

#### Checklist de Ações:
- [ ] **Backend:** Criar endpoint `/api/rh/metricas` que lê o banco de dados e arquivos de telemetria, consolidando indicadores de cadência, eNPS, índice de clareza e o Índice de Relevância de Carreira (IRC) geral e por área.
- [ ] **Backend/IA:** Adicionar rota `/api/rh/alerta-risco` que recebe o motivo do risco reportado pelo gestor de forma 100% anonimizada (PII substituído por `[COLABORADOR]`), classifica-o via Gemini (Carreira, Clima ou Performance) e avalia sua gravidade (Baixa, Média, Alta).
- [ ] **Frontend:** Integrar o painel `PainelRH.jsx` para carregar dados via chamadas de API reais ao backend FastAPI, exibindo o IRC geral, gráfico de evolução do IRC e destacando líderes com pontuação crítica (<70%) em cor vermelha suave/alerta.

- [ ] **Frontend:** Adicionar o checkbox voluntário de "Reportar colaborador em risco" no fechamento da ata, salvando a associação nominal no `localStorage` privado e enviando o motivo mascarado para classificação na API de IA.
- [ ] **Frontend:** Implementar cálculo de "Colaboradores Descobertos" (>30 dias sem ata) comparando timestamps diretamente na Dashboard do RH e disponibilizar gatilho de lembrete.

---

### Fase 6: Compartilhamento Rápido & Ajustes de UX (F-02)
*Facilita a exportação e notificação de atas pós-rito e refina transições de tela.*

#### Arquivos Afetados:
- Frontend: [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx)

#### Checklist de Ações:
- [ ] **Frontend:** Integrar botão e gatilho visual para compartilhamento rápido por e-mail ou link de Teams contendo a ata gerada após o download do PDF.
- [ ] **Frontend:** Implementar placeholders/guias editáveis com os 5 blocks da ClearIT em marca d'água cinza clara (`text-slate-300 / dark:text-slate-700`) no campo de anotações do líder (`Home.jsx` / `Meus1a1.jsx`).
- [ ] **Frontend:** Implementar redirecionamento automático do usuário após a conclusão da ata para a tela "Meu Squad" ou "Meu Perfil", garantindo um fluxo fluído de UX.


---

### Fase 7: Evolução Agent-First (F-18, F-19, F-20, F-21, F-22, F-23)
*Garante a transição do portal reativo para um ecossistema ativo de orquestração proativa e interações headless com autenticação baseada em perfis.*

#### Arquivos Afetados:
- Backend: [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py), [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py)
- Frontend: [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx), [Meus1a1.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Meus1a1.jsx)

#### Checklist de Ações:
- [ ] **Backend (F-18):** Desenvolver gerador de schemas Adaptive Cards (JSON) no FastAPI para interações no Teams/E-mail.
- [ ] **Backend (F-19):** Criar rota `/api/multimodal/ocr` integrando a API de visão do Gemini para transcrever imagens de anotações físicas de reuniões.
- [ ] **Backend (F-20):** Implementar arquitetura multi-agente em [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py) dividindo o raciocínio entre o Agente de Carreira e o Agente de Clima.
- [ ] **Backend & Frontend (F-21):** Substituir campos de entrada da SPA por uma caixa de prompt único. No backend, validar os insumos contra os 5 blocos obrigatórios de 1:1 e expor a lista de `alertas_blocos` para lacunas não preenchidas.
- [ ] **Backend (F-22):** Implementar webhook `/api/webhooks/valida-rito` para processar a validação bilateral sem exigir acesso à SPA React, alterando os registros no PostgreSQL.
- [ ] **Backend (F-23):** Implementar middleware de autenticação (JWT / Role Validation) nos endpoints do FastAPI, impedindo acesso cruzado de APIs (ex: liderados acessando rotas de RH).

>>>>>>> bcfdf4b4e9d462e1b79eb4d48e42a6344b972635
