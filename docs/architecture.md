# 🏛️ Arquitetura do Sistema - Smart Leading V2 (Agent-First Edition)

Este documento detalha as decisões arquiteturais, o fluxo de dados e as tecnologias envolvidas no ecossistema do **Smart Leading**. O projeto utiliza uma arquitetura **Client-Server Desacoplada com Sandbox Local**, separando estritamente a interface interativa (React), a telemetria (FastAPI) e o processamento semântico de Inteligência Artificial (Google Gemini).

## 1. Visão Geral dos Componentes

### ⚛️ Front-end (Client, Agent-First & Local Sandbox)
- **Tecnologia:** React.js (via Vite) + Tailwind CSS + Lucide Icons + html2pdf.js.
- **Responsabilidade:** Renderização responsiva (SPA), Cross-Routing de dados (Navegação contextual), dashboards interativos (DRE e Liga de Ouro) e compilação Client-Side de HTML para PDF.
- **Semantic Firewall:** Motor de Expressões Regulares (RegEx) executado diretamente no navegador do usuário para mascarar e anonimizar dados sensíveis (CPFs, Salários, Telefones e E-mails) antes de qualquer requisição de rede.
- **Cofre Local (Sandbox):** Utiliza a API nativa do navegador (`localStorage`) para persistir o XP dos líderes, Atas geradas, Planos de Desenvolvimento (PDIs), Tasks e Histórico de Reuniões. Isso garante alta performance analítica (Power BI Style no front-end) e isolamento total de dados pessoais sem necessidade de um banco SQL em nuvem para operação.

### 🐍 Back-end (API Gateway & Telemetry)
- **Tecnologia:** Python 3 + FastAPI.
- **Responsabilidade:** Atuar como um *Gateway* seguro. Ele recebe requisições anonimizadas do front-end, orquestra a chamada para a IA e registra os logs de auditoria no servidor (Telemetria).
- **Módulo de IA (`gemini.py` / Gemini):** Encapsula a lógica de integração com a API do Google Gemini 1.5 Flash. Opera sob uma malha estrita de *Prompt Engineering* (`agents.md`) que força saídas no formato JSON/Markdown segmentado (Roteiro vs. Ata Oficial).

---

## 2. Fluxos de Dados (Data Flow)

O sistema possui fluxos principais desenhados para mitigar riscos de segurança, otimizar custos de API e garantir uma governança de RH 100% à prova de microgerenciamento fantasma.

### Fluxo A: Geração Paramétrica com Semantic Firewall (Metodologia CRIA)
1. O líder preenche os parâmetros de contexto (Senioridade, Momento, Entregas) no front-end.
2. O **Semantic Firewall** intercepta o texto de observações e substitui padrões de PII (Personally Identifiable Information) por tags de segurança (Ex: `[SALÁRIO_PROTEGIDO]`, `[CPF_PROTEGIDO]`).
3. O sistema injeta instantaneamente "Nuggets Comportamentais" na interface e empacota os dados em `JSON`, fazendo um `POST` para `/api/gerar-roteiro`.
4. O **FastAPI** recebe o payload e acopla as instruções de malha fina (Metodologia CRIA) antes de chamar o LLM.
5. O Gemini processa o contexto e devolve um objeto estruturado separando o "Roteiro Confidencial de Mentoria" da "Ata Oficial" (documento final para o RH).
6. O React renderiza a interface utilizando `ReactMarkdown`. Neste momento, **nenhum log de texto é gravado no servidor**.

### Fluxo B: Gamificação e Governança Bilateral (XP)
1. O líder conduz a 1:1, formaliza os acordos e clica em "Gerar PDF e Aguardar Avaliação".
2. O React aciona a biblioteca `html2pdf.js` para capturar a DOM e baixar o PDF exclusivamente na máquina do gestor.
3. O front-end salva a Ata no `localStorage` com a flag `feedbackPendente: true` e emite uma notificação in-app para o liderado. *Nota: Nenhum XP é creditado neste momento.*
4. **Governança Bilateral:** O liderado acessa seu portal (`HomeLiderado.jsx`), visualiza a ata pendente e realiza a avaliação (Nota de 1 a 5 estrelas e Relevância do PDI).
5. O sistema calcula dinamicamente o XP com base na nota do liderado e credita na carteira do líder, atualizando a "Liga de Ouro" (Ranking Global) em tempo real.
6. Em *background*, o React dispara um `POST` para `/api/registrar-download` contendo apenas metadados de telemetria para o RH.

---

## 3. Segurança e "LGPD By Design"

A arquitetura blinda a empresa contra riscos trabalhistas e vazamentos através de quatro pilares intransponíveis:

- **Filtro Ativo (Semantic Firewall):** Nenhum dado financeiro ou identificador pessoal óbvio (CPF, e-mail) cruza a rede. O mascaramento ocorre na máquina do usuário antes da requisição HTTP ser formada.
- **Geração Client-Side Exclusiva:** O documento PDF (que contém o nome e o histórico do colaborador) nasce e morre no navegador de quem clicou no botão. O Back-end nunca recebe ou transita o arquivo compilado, impossibilitando interceptações em trânsito.
- **Isolamento de Estado (Zero DB):** Como não há banco de dados relacional centralizando as avaliações comportamentais da empresa inteira em nuvem, anula-se o risco de ataques cibernéticos em massa (*Data Breaches*) direcionados a informações sensíveis de RH.
- **Isolamento de Credenciais:** A chave do LLM (`GEMINI_API_KEY`) reside apenas no servidor local (via arquivo `.env`). O cliente (navegador/SPA) jamais acessa tokens ou chaves de API externas.