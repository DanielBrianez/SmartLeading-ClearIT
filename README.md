# 🚀 Smart Leading V2 - Clear IT

O **Smart Leading** é um ecossistema corporativo de assistência à liderança focado em estruturar, gerenciar e gamificar reuniões de 1:1 (One-on-One). Utilizando inteligência artificial paramétrica, o sistema gera roteiros de alinhamento altamente personalizados baseados no perfil do líder, senioridade do liderado e comportamento recente.

Além de gerar pautas estruturadas, o sistema emite atas automatizadas em PDF, 100% em conformidade com a LGPD (anonimizadas e restritas ao cliente), e conta com um sistema de ranqueamento gamificado e um dashboard analítico para o RH.

---

## ✨ Principais Funcionalidades

- **🧠 Motor de IA (Metodologia CRIA):** Geração de pautas via API do Google Gemini (1.5 Flash) estruturadas nas verticais de Contexto, Redirecionamento, Impacto e Alinhamento.
- **📊 People Analytics (Painel do RH):** Dashboard gerencial interativo (estilo Power BI) para monitoramento em tempo real de adoção da liderança, volume de ritos, PDIs ativos e simulador preditivo de eNPS.
- **🎯 Gestão Ativa de Squad:** Radar de próximas reuniões com sistema inteligente de adiamentos e "Cross-Routing" que preenche dados automaticamente.
- **📄 Atas Seguras (LGPD):** Geração de documentos PDF no lado do cliente (client-side) operando sob a premissa de *Zero PII* no banco de dados.
- **🏆 Motor de Maturidade (Liga de Ouro):** Sistema de ranqueamento dinâmico que classifica líderes em níveis (Iniciante a Referência) com base em drivers reais: XP, Atas, PDIs e Ritos.
- **🌓 UI/UX Premium:** Interface responsiva com suporte nativo a temas Claro/Escuro, notificações em tempo real e nuggets comportamentais dinâmicos.

---

## 🛠️ Stack Tecnológica

### Front-end
- **React (Vite):** Arquitetura base em componentes funcionais.
- **Tailwind CSS:** Estilização utilitária e componentes visuais puros (bar charts/progress bars).
- **Lucide React:** Biblioteca de ícones minimalistas.
- **html2pdf.js:** Geração de relatórios PDF fiéis à interface local.
- **React Markdown:** Renderização segura da saída da IA.

### Back-end
- **Python 3+**
- **FastAPI:** Motor do servidor de altíssima performance.
- **Google Generative AI:** Integração com LLM (Gemini 3.1 Flash Lite).
- **Pydantic:** Validação estrita de dados na API.

---

## 📁 Estrutura de Diretórios (Monorepo)

O projeto segue um padrão arquitetural desacoplado e orientado a domínios:

```text
smart-leading-v2/
├── backend/               # Motor API e integração com a IA
│   ├── app/               # Rotas, controllers e ai_agent.py
│   ├── .env               # Variáveis de ambiente (Chave da IA)
│   └── requirements.txt   # Dependências do Python
│
├── frontend/              # Interface do Usuário (UI/UX)
│   ├── src/               # Código fonte (Views, Components, Routing)
│   ├── package.json       # Dependências do Node.js
│   └── tailwind.config.js # Regras de estilo corporativo
│
├── .agents/               # Diretrizes de comportamento da IA (AGENTS.md)
├── business-context-lite.md  # Documentação de Produto (Dores e Soluções)
└── technical-context-lite.md # Documentação de Engenharia e Diagrama Mermaid

```

---

## 🚀 Como Rodar o Projeto Localmente

Para rodar o Smart Leading, você precisará inicializar o Back-end e o Front-end em terminais separados.

### Passo 1: Inicializando o Back-end (Python/FastAPI)

1. Abra o terminal e navegue até a pasta do servidor:

```bash
cd backend

```

2. Crie e ative um ambiente virtual (Recomendado):

```bash
# No Windows:
python -m venv venv
.\venv\Scripts\activate

```

3. Instale as dependências:

```bash
pip install -r requirements.txt

```

4. Configure as variáveis de ambiente:

* Crie um arquivo chamado `.env` na raiz da pasta `backend/`.
* Adicione sua chave de API do Gemini:
`GEMINI_API_KEY="SUA_CHAVE_AQUI"`

5. Rode o servidor:

```bash
uvicorn app.main:app --reload

```

*A API estará rodando em: `http://localhost:8000*`

### Passo 2: Inicializando o Front-end (React/Vite)

1. Abra um **novo terminal** e navegue até a pasta da interface:

```bash
cd frontend

```

2. Instale as dependências do Node:

```bash
npm install

```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev

```

*O sistema estará disponível em: `http://localhost:5173*`

> **Dica de Desenvolvimento:** Na aba "Sobre o Sistema", utilize o botão **"Injetar Dados Demo"** para autopopular os cofres locais com 18 dados simulados e visualizar o funcionamento completo dos gráficos e ranqueamento imediatamente.

---

## 📜 Licença e Governança

Desenvolvido para uso corporativo interno - **Clear IT**.
As diretrizes de proteção de dados aplicadas neste projeto seguem os padrões rigorosos exigidos pela LGPD (Isolamento Client-Side). Consulte os arquivos `*-context-lite.md` na raiz do projeto para detalhes sobre arquitetura e negócio.