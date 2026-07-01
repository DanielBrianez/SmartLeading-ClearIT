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

## 3. Segurança e "LGPD By Design" (ADR 02 e ADR 03)

A arquitetura blinda a empresa contra riscos trabalhistas, passivos legais e vazamentos através de quatro pilares estruturais de segurança logicamente definidos:

- **Tokenização Client-Side:** O navegador realiza a varredura e substituição imediata de padrões numéricos como CPF e RG por `[DOCUMENTO]` antes de trafegar os dados.
- **AI Gateway Proxy (LLM Firewall):** Camada intermediária no backend FastAPI que intercepta o texto livre e realiza a higienização semântica de CIDs, sintomas ou menções médicas (ex: *"está com depressão"* vira `[MOTIVO_MÉDICO_REDUZIDO]`), destruindo o texto bruto em memória RAM efêmera.
- **Pseudonimização Assimétrica:** O pipeline de análise de macrotemas e clima do RH preserva a identificação do líder (`ID_do_Líder` e `Diretoria`) para direcionamento de treinamentos, mas descarta permanentemente o `ID_do_Liderado`.
- **Segregação de Dados de Risco (Opt-In):** Para a sinalização de colaboradores em risco crítico (F-17), a associação nominal fica restrita ao banco relacional local seguro da ClearIT. O texto contendo as dores do colaborador é enviado à IA de forma 100% anonimizada (`[COLABORADOR]`) apenas para categorização do risco.
- **Isolamento de Credenciais e Zero-Retention:** A chave do modelo de IA (`GEMINI_API_KEY`) reside apenas nas variáveis secretas do backend, operando em modo corporativo com garantia de não-utilização dos dados para treinamento.