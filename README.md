# 🚀 Smart Leading V2 - Clear IT (Agent-First Edition)

O **Smart Leading** é um ecossistema corporativo de assistência à liderança focado em estruturar, gerenciar e gamificar reuniões de 1:1 (One-on-One) sob o paradigma **Agent-First**. Em vez de ser apenas um sistema passivo de registros (System of Record), a plataforma atua como um "Guardião de Carreira" inteligente.

Utilizando inteligência artificial paramétrica aliada a um **Semantic Firewall** (LGPD by Design), o sistema gera roteiros de alinhamento altamente personalizados. A plataforma fecha o "Ciclo de Ouro" da governança corporativa: o Líder planeja com IA, o Liderado avalia o rito, o sistema distribui XP automaticamente e o RH monitora a saúde organizacional em tempo real.

---

## ✨ Principais Funcionalidades (O Ciclo de Ouro)

*   **🛡️ Semantic Firewall (LGPD by Design):** Antes de qualquer dado ser enviado à API de Inteligência Artificial, o motor Client-Side varre e anonimiza CPFs, Valores Financeiros (Salários), Telefones e E-mails, trocando-os por tags seguras (Ex: `[SALÁRIO_PROTEGIDO]`).
*   **🧠 Motor de IA (Metodologia CRIA):** Geração de pautas via API do Google Gemini estruturadas nas verticais de Contexto, Redirecionamento, Impacto e Alinhamento, com "Nuggets" de mentoria ocultos baseados no perfil do líder.
*   **🔄 Governança Bilateral de XP:** O Líder não ganha pontos apenas por gerar a ata. O XP só é liberado após o Liderado acessar seu próprio portal e avaliar a 1:1 (Nota de 1 a 5 e Relevância), garantindo qualidade real e evitando o microgerenciamento fantasma.
*   **🎯 PDI SMART & Trava de Foco:** O sistema força a criação de metas em horizontes de tempo específicos (Sprint, Quarter, Semestre) e **limita a 3 PDIs ativos por pessoa**, garantindo foco real. Já as missões táticas (Tasks/Acordos) são ilimitadas.
*   **🏆 Liga de Ouro (Gamificação Global):** Ranking de liderança dinâmico e gamificado. Os líderes competem por XP e evoluem em patentes (Bronze, Prata, Ouro e Diamante) baseados na consistência das suas 1:1s e na nota dos liderados.
*   **📊 People Analytics & Relatório DRE:** O RH possui um painel "Visão de Deus" que monitora o Compliance de Cadência (1:1s em atraso) e calcula o Risco de Burnout cruzando o "Termômetro de Sentimento" de toda a empresa. Gera o **DRE (Demonstrativo de Resultado de Engajamento)** em PDF formato executivo com apenas 1 clique.
*   **📚 Playbook do Líder:** Uma central de microlearning imersiva (estilo Netflix) com guias rápidos e frameworks para o líder consultar em situações difíceis (ex: Como aplicar um PIP, Sinais de Burnout).
*   **🌓 UI/UX Premium (Glassmorphism):** Interface responsiva, moderna, com suporte nativo a temas Claro/Escuro, modais interativos, "Toasts" de notificação e barras de progresso dinâmicas.

---

## 🛠️ Stack Tecnológica

### Front-end
*   **React (Vite):** Arquitetura base em componentes funcionais e hooks.
*   **Tailwind CSS:** Estilização utilitária e componentes visuais avançados (Glassmorphism, progress bars dinâmicos, gradients).
*   **Lucide React:** Biblioteca de ícones minimalistas.
*   **html2pdf.js:** Geração de relatórios PDF fiéis à interface (Client-Side) para Atas e Relatórios DRE do RH.
*   **React Markdown:** Renderização segura e padronizada da saída da IA.

### Back-end
*   **Python 3+**
*   **FastAPI:** Motor do servidor de altíssima performance.
*   **Google Generative AI:** Integração com LLM (Gemini 1.5 Flash).
*   **Pydantic:** Validação estrita de dados na API.

---

## 📁 Estrutura de Diretórios (Monorepo)

O projeto segue um padrão arquitetural desacoplado e orientado a domínios:

```text
smart-leading-v2/
├── backend/                     # API e integração com IA
│   ├── app/
│   │   ├── main.py              # Endpoints FastAPI
│   │   └── core/gemini.py      # Integração com Gemini
│   ├── .env                     # Variáveis de ambiente locais
│   ├── .env.example             # Exemplo de configuração
│   └── requirements.txt         # Dependências do Python
│
├── frontend/                    # Interface do usuário
│   ├── src/                     # Views, components, utilidades e rotas
│   ├── package.json             # Dependências do Node.js
│   └── vite.config.js           # Configuração do Vite
│
├── docs/                        # Contexto de produto, engenharia e ciclos Onion
│   ├── business-context-lite.md
│   ├── technical-context-lite.md
│   ├── onion-cycles.md
│   └── knowledge-base/
│
├── .agents/                     # Regras e comportamento do Onion para IDEs
│   └── rules/onion.md
│
└── onion-portable/              # Versão portátil do framework Onion
```

## 🚀 Como Rodar o Projeto Localmente

Para rodar o Smart Leading, você precisará inicializar o back-end e o front-end em terminais separados.

### Passo 1: Back-end (Python/FastAPI)

Abra um terminal e navegue até a pasta do servidor:

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Crie um arquivo chamado `.env` na pasta `backend/` e adicione sua chave da API do Gemini:

```env
GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

Inicie o servidor:

```bash
uvicorn app.main:app --reload
```

A API estará disponível em: http://localhost:8000

### Passo 2: Front-end (React/Vite)

Abra um novo terminal e navegue até a pasta da interface:

```bash
cd frontend
npm install
npm run dev
```

O sistema estará disponível em: http://localhost:5173

##💡 Dica de Demonstração (Demo Hack):
Na visão do Liderado (HomeLiderado.jsx), existe um atalho oculto no rodapé para simular o recebimento de uma ata de 1:1, permitindo demonstrar o fluxo de Feedback e ganho de XP (Governança Bilateral) instantaneamente para bancas avaliadoras.

## 📜 Licença e Governança
Desenvolvido para uso corporativo interno - Clear IT.
As diretrizes de proteção de dados aplicadas neste projeto seguem os padrões rigorosos exigidos pela LGPD, utilizando mascaramento por RegEx (Semantic Firewall) no lado do cliente (Client-Side) antes de qualquer transmissão externa. Consulte os arquivos *-context-lite.md na raiz do projeto para detalhes profundos sobre a arquitetura e visão de negócio.