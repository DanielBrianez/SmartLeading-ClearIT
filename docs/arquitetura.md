# 🏛️ Arquitetura do Sistema - Smart Leading V2

Este documento detalha as decisões arquiteturais, o fluxo de dados e as tecnologias envolvidas no ecossistema do **Smart Leading**. O projeto utiliza uma arquitetura **Client-Server Desacoplada**, separando claramente as responsabilidades de interface (Front-end) e integrações (Back-end).

## 1. Visão Geral dos Componentes

### ⚛️ Front-end (Aplicação Cliente)
- **Tecnologia:** React.js (via Vite) + Tailwind CSS.
- **Responsabilidade:** Renderizar a interface, gerenciar o estado da sessão do usuário, compilar os dados do formulário e converter HTML para PDF.
- **Gamificação Local:** Utiliza a API nativa do navegador (`localStorage`) para gerenciar e persistir o XP dos líderes, garantindo alta performance sem necessidade de um banco de dados relacional (SQL) apenas para o ranking.

### 🐍 Back-end (API Server)
- **Tecnologia:** Python 3 + FastAPI.
- **Responsabilidade:** Atuar como um *Gateway* seguro, receber as requisições do front-end, orquestrar a chamada para a IA e registrar logs de auditoria no servidor.
- **Módulo de IA (`core/gemini.py`):** Encapsula a lógica de integração com a API do Google Gemini, isolando as regras de *Prompt Engineering* do restante das rotas do servidor.

---

## 2. Fluxo de Dados (Data Flow)

O sistema possui dois fluxos principais, desenhados para otimizar o uso da API da inteligência artificial e garantir que os logs de auditoria reflitam o uso real da plataforma.

### Fluxo A: Geração do Roteiro (Botão "Gerar")
1. O usuário preenche os parâmetros e clica em "Gerar".
2. O React empacota os dados em `JSON` e faz um `POST` para a rota `/api/gerar-roteiro`.
3. O **FastAPI** recebe a requisição e envia os parâmetros como um dicionário para o módulo isolado do Gemini.
4. O Gemini processa o contexto (sem saudações, focado em diretrizes) e devolve o texto estruturado em formato Markdown.
5. O FastAPI devolve a resposta para o React, que a renderiza na tela utilizando o `ReactMarkdown`. Neste momento, **nenhum log é gravado**.

### Fluxo B: Confirmação e Auditoria (Botão "Baixar")
1. O usuário confere o roteiro, assina a ata selecionando seu nome na caixa de "Líder Responsável" e escolhe o nome do liderado.
2. O React aciona a biblioteca `html2pdf.js` para capturar a DOM (elemento de ID `conteudo-ata`) e renderiza o arquivo PDF no próprio navegador.
3. Simultaneamente, o React envia um `POST` em segundo plano para `/api/registrar-download` contendo as configurações daquela reunião.
4. O **FastAPI** cria uma linha no arquivo `logs/smart_leading_logs.csv` validando que a ata foi formalmente baixada (`Baixou_Ata = Sim`).
5. O React credita `+100 XP` no perfil do líder assinante e atualiza a "Liga de Ouro".

---

## 3. Segurança e "LGPD By Design"

A arquitetura foi pensada desde a concepção para respeitar os princípios da **Lei Geral de Proteção de Dados (LGPD)** e garantir a segurança corporativa:

- **Geração Client-Side:** A compilação do documento PDF ocorre integralmente no navegador do usuário. O Back-end nunca recebe, trafega ou armazena o arquivo final, eliminando o risco de vazamento de documentos.
- **Logs de Auditoria Anonimizados:** O arquivo `smart_leading_logs.csv` grava parâmetros técnicos (perfil comportamental, senioridade, nome da liderança) estritamente para consumo de ferramentas de BI (Business Intelligence) e estatísticas de uso. O conteúdo sensível discutido na "Pauta" não é registrado no servidor.
- **Isolamento de Credenciais:** A chave de acesso à IA (`GEMINI_API_KEY`) fica isolada no ambiente do servidor (via arquivo `.env`). O Front-end não possui nenhum acesso às chaves, bloqueando roubos de credencial pelo painel do navegador.