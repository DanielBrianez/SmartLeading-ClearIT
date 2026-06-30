# 🏛️ Arquitetura do Sistema - Smart Leading V2

Este documento detalha as decisões arquiteturais, o fluxo de dados e as tecnologias envolvidas no ecossistema do **Smart Leading**. O projeto utiliza uma arquitetura **Client-Server Desacoplada com Sandbox Local**, separando estritamente a interface (React), a telemetria (FastAPI) e o processamento semântico (Google Gemini).

## 1. Visão Geral dos Componentes

### ⚛️ Front-end (Client & Local Sandbox)
- **Tecnologia:** React.js (via Vite) + Tailwind CSS + Lucide Icons.
- **Responsabilidade:** Renderização responsiva (SPA), Cross-Routing de dados (Navegação contextual), dashboards interativos e compilação Client-Side de HTML para PDF.
- **Cofre Local (Sandbox):** Utiliza a API nativa do navegador (`localStorage`) para persistir o XP dos líderes, Atas geradas, Planos de Desenvolvimento (PDIs), Tasks e Histórico de Reuniões. Isso garante alta performance analítica (Power BI Style no front-end) e isolamento total de dados pessoais sensíveis sem necessidade de um banco SQL em nuvem para operação.

### 🐍 Back-end (API Gateway & Telemetry)
- **Tecnologia:** Python 3 + FastAPI.
- **Responsabilidade:** Atuar como um *Gateway* seguro. Ele recebe requisições anonimizadas do front-end, orquestra a chamada para a IA e registra os logs de auditoria no servidor (Telemetria).
- **Módulo de IA (`gemini.py` / Gemini):** Encapsula a lógica de integração com a API do Google Gemini 1.5 Flash. Opera sob uma malha estrita de *Prompt Engineering* (`agents.md`) que força saídas no formato JSON/Markdown segmentado (Roteiro vs. Ata Oficial).

---

## 2. Fluxo de Dados (Data Flow)

O sistema possui dois fluxos principais, desenhados para mitigar riscos de segurança, otimizar custos de API e garantir telemetria precisa para o RH.

### Fluxo A: Geração Paramétrica (Metodologia CRIA)
1. O líder preenche os parâmetros de contexto (Senioridade, Momento, Entregas) no front-end.
2. O sistema injeta instantaneamente "Nuggets Comportamentais" na interface com base no perfil do líder.
3. O React empacota os dados em `JSON`, **omite nomes próprios**, e faz um `POST` para `/api/gerar-roteiro`.
4. O **FastAPI** recebe o payload e acopla a camada de proteção LGPD (Zero PII) e as instruções da Metodologia CRIA antes de chamar o modelo.
5. O Gemini processa o contexto e devolve um objeto estruturado separando o "Roteiro de Mentoria" (para os olhos do gestor) da "Ata Oficial" (documento final).
6. O FastAPI repassa a resposta para o React, que renderiza a interface utilizando `ReactMarkdown`. Neste momento, **nenhum log é gravado no servidor**.

### Fluxo B: Assinatura, Armazenamento e Telemetria
1. O usuário conduz a 1:1, formaliza os acordos e clica em "Baixar Ata Oficial".
2. O React aciona a biblioteca `html2pdf.js` para capturar a DOM da Ata e renderizar o PDF exclusivamente na máquina do gestor.
3. O front-end salva a Ata, atualiza os PDIs no `localStorage` e credita `+100 XP` no perfil do líder (atualizando a Liga de Ouro e o Painel do RH em tempo real).
4. Em *background*, o React dispara um `POST` para `/api/registrar-download` contendo apenas metadados (Data, Perfil e Status).
5. O **FastAPI** grava uma linha anonimizada no arquivo `logs/smart_leading_logs.csv` (`Baixou_Ata = Sim`), alimentando o ecossistema externo de People Analytics da companhia.

---

## 3. Segurança e "LGPD By Design"

A arquitetura blinda a empresa contra riscos trabalhistas e vazamentos através de três pilares:

- **Geração Client-Side Exclusiva:** O documento PDF (que contém o nome e o histórico do colaborador) nasce e morre no navegador. O Back-end nunca recebe o arquivo compilado, impossibilitando interceptações.
- **Isolamento de Estado (Zero DB):** Como não há banco de dados relacional centralizando as avaliações comportamentais da empresa inteira, anula-se o risco de ataques cibernéticos em massa (Data Breaches) direcionados a informações sensíveis de RH.
- **Blindagem de Prompt (Zero PII):** A instrução base da IA proíbe taxativamente a invenção ou utilização de nomes reais, operando sempre com *placeholders* ou termos genéricos.
- **Isolamento de Credenciais:** A chave do LLM (`GEMINI_API_KEY`) reside apenas no servidor (via arquivo `.env`). O cliente (navegador) jamais acessa tokens sensíveis.