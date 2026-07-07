# Análise de Gaps: Especificação de Negócio vs. Implementação Real (React & FastAPI) 🔍

Este documento mapeia as divergências entre a especificação ideal do **Onion Portable (Business Context)** e a implementação real no código atual da aplicação (**React + Vite no frontend e FastAPI no backend**). 

---

## 🗺️ 1. Correção de Estrutura: Mapeamento de Arquivos
A análise anterior referenciava arquivos de uma aplicação Streamlit em Python (ex: `src/app.py`, `src/components/ui_forms.py`). A estrutura real do projeto está dividida entre `frontend/` e `backend/`:

| Referência Incorreta (Streamlit) | Caminho Real na Aplicação Atual | Componente / Função |
| :--- | :--- | :--- |
| `src/app.py` | [App.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/App.jsx) e views associadas | Interface do Usuário (SPA) e Roteamento de Abas |
| `src/components/ui_forms.py` | [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx) / [MeuSquad.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/MeuSquad.jsx) | Formulários de entrada, acordos, PDI e pauta da 1:1 |
| `src/services/ai_agent.py` | [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py) | Engine de prompts e inferência do Gemini |
| `src/services/pdf_maker.py` | Import do `html2pdf.js` no cliente frontend | Geração e download do PDF da Ata de 1:1 |
| `src/utils/logger.py` | Rota `/api/registrar-download` em [main.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py) | Registro local de telemetria em formato CSV |

---

## 🔍 2. Gaps por Feature (Especificação vs. Código)

### F-01: Gerar Roteiro Inteligente de 1:1
*   **Especificação Ideal:** O roteiro considera o histórico, os combinados passados, sentimento e o nível do liderado no **Framework de Levels**. O prompt é seguro e no-PII (Privacy by Design).
*   **Código Atual:** 
    *   **Ausência de Histórico de Atas/Tarefas:** A rota `/api/gerar-roteiro` recebe apenas `perfil_lideranca`, `senioridade_liderado`, `tempo_casa`, `perfil_comportamental` e `resumo_entregas`. Os dados de tarefas passadas ou atas anteriores (que existem em `localStorage` e em [dados.js](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/dados.js)) não são transmitidos nem considerados na geração do roteiro.
    *   **Falta do Framework de Levels:** O prompt da IA em [gemini.py](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/core/gemini.py) não possui conhecimento sobre a matriz de habilidades da Clear IT. Ele gera um roteiro comportamental genérico baseado apenas em senioridade abstrata (ex: Pleno, Sênior).
    *   **Versão do Modelo Gemini:** O backend utiliza o modelo `gemini-3.1-flash-lite`, enquanto a especificação técnica prevê `gemini-1.5-flash` ou `gemini-2.5-flash`.

### F-02: Exportar Ata da Reunião em PDF
*   **Especificação Ideal:** PDF gerado no cliente por `html2pdf.js` sem trafegar dados pessoais para o servidor. Deve haver um **gatilho rápido** no front-end para compartilhar a ata com o liderado e enviar cópia ao RH.
*   **Código Atual:**
    *   **Sem Compartilhamento Rápido:** A função `handleDownloadPDF` em [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx) baixa o PDF localmente, registra no log e no localStorage, mas não oferece opção ou gatilho visual para enviar o documento ao e-mail ou Slack do colaborador.
    *   **Sem Envio para o RH:** Não há qualquer fluxo implementado para enviar uma cópia agregada ou ata oficial para o RH.

### F-03: Motor de Maturidade & Liga de Líderes
*   **Especificação Ideal:** Classifica o líder em 4 níveis (Iniciante, Em desenvolvimento, Consistente, Referência) com base estrita nos 3 drivers operacionais: Frequência de Ritos, Taxa de Documentação e Engajamento em PDI.
*   **Código Atual:**
    *   **Cálculo Simplista por XP:** O arquivo [Ranking.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Ranking.jsx) calcula a maturidade baseado estritamente na pontuação de `xpTotal` (Ganho de 100 XP por ata baixada + XP base). Não há avaliação matemática dos drivers de frequência ou engajamento de PDI.
    *   **Divergência de Dados (Ranking Estático):** O ranking define competidores estáticos (`baseCompetidores`) que não correspondem à constante `LEADERBOARD` de [dados.js](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/dados.js). Além disso, o liderado "Carlos Eduardo" é listado incorretamente como um Líder no ranking.
    *   **Sem Redirecionamento Automático:** O redirecionamento planejado do usuário para a tela "Meu Squad" ou "Meu Perfil" após o término e download da ata não está implementado em [Home.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/Home.jsx).

### F-04: Dashboard de Métricas do RH (Painel do RH)
*   **Especificação Ideal:** Painel executivo que exibe conformidade quinzenal, adoção e maturidade agregada através da leitura do arquivo de telemetria `telemetry_logs.csv` gerado no servidor.
*   **Código Atual:**
    *   **Interface 100% Mockada e Local:** O painel [PainelRH.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/PainelRH.jsx) é totalmente executado no lado do cliente. Ele não faz requisições HTTP para buscar as métricas consolidadas do backend.
    *   **Gráficos Estáticos:** O histórico de eNPS, atas e PDIs usa um array estático (`historicoMeses`) que apenas soma os dados atuais do localStorage ao mês de Junho. Não há análise real do arquivo CSV de telemetria.

### F-05: Setup de Banco, Autenticação e IA
*   **Especificação Ideal:** Telemetria centralizada em `data/telemetry_logs.csv` com campos estruturados: Data/Hora, Perfil do Líder, Perfil Comportamental, Senioridade e flag de download.
*   **Código Atual:**
    *   **Incompatibilidade de Caminho de Log:** O backend grava o log em `backend/logs/smart_leading_logs.csv` (caminho local relativo `logs/smart_leading_logs.csv`) em vez do caminho padronizado `data/telemetry_logs.csv` esperado no escopo de conformidade de dados do projeto.

### F-18 a F-22: Omnicanalidade, IA Avançada (Vision/OCR/Multi-Agent) & Validação Omnichannel
*   **Especificação Ideal:** O ecossistema suporta interações headless via MS Teams/E-mail (F-18, F-22), transcrição de áudio e leitura de anotações físicas via visão/OCR do Gemini (F-19), análises orquestradas entre agentes de carreira e clima (F-20), e preenchimento por prompt único com alertas de lacunas nos 5 blocos da 1:1 (F-21).
*   **Código Atual:**
    *   **Não Implementados:** Nenhuma dessas integrações corporativas, fluxos de imagem, orquestradores de rede de agentes ou processamento de prompt reduzido com busca no `localStorage` estão implementados no frontend ou backend. O sistema é baseado em interações e formulários de texto padrão.

### F-23: Autenticação Baseada em Perfis (Role-Based Login)
*   **Especificação Ideal:** Tela de login obrigatória na SPA React exigindo e-mail e senha de teste:
    *   `lider@clearit.com` (Senha: `lider123` / role: `lider`)
    *   `liderado@clearit.com` (Senha: `liderado123` / role: `liderado`)
    *   `rh@clearit.com` (Senha: `rh123` / role: `rh`)
    Isolamento completo das rotas/abas com base no papel através de `AuthContext` no frontend e validações de token no backend FastAPI.
*   **Código Atual:**
    *   **Ausência de Autenticação:** A SPA abre diretamente na página inicial sem bloqueio de login ou tela de credenciais.
    *   **Acoplamento de Usuário Estático:** O perfil do líder `"daniel_nascimento"` é carregado de forma fixa e hardcoded no frontend.
    *   **Sem Proteção de Rotas (RBAC Inexistente):** O menu de navegação exibe todas as abas indistintamente (incluindo o Painel do RH) para qualquer usuário, sem filtros ou bloqueios de URL. Faltam middlewares de validação de papéis no backend FastAPI.

---

## 🎯 3. Resumo de Divergências nas Regras de Negócio

1.  **Formulário de PDI Genérico:** O formulário de PDI em [MeuSquad.jsx](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/frontend/src/views/MeuSquad.jsx) permite a inserção livre de Ações e Prazos sem impor o limite de 2 a 3 metas/objetivos ou a divisão estruturada por prazos (1, 2, 3 e 6 meses) especificados no Product Requirement Document (PRD).
2.  **Guia do Líder Inexistente:** A aba/documento de apoio com diretrizes comportamentais e guia prático para treinamento das lideranças está ausente no código de navegação do frontend.
3.  **Segurança e LGPD Localizada:** Embora a plataforma declare "LGPD Ativa", os dados salvos em `localStorage` não possuem criptografia simples ou isolamento, ficando expostos no console do browser do usuário.
