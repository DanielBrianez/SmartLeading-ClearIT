# 🚀 Smart Leading V2 - Clear IT

O **Smart Leading** é um sistema corporativo de assistência à liderança focado em estruturar e gamificar reuniões de 1:1 (One-on-One). Utilizando inteligência artificial paramétrica (Google Gemini), o sistema gera roteiros de reuniões altamente personalizados com base no perfil do líder, senioridade do liderado e perfil comportamental.

Além de gerar pautas estruturadas, o sistema emite atas automatizadas em PDF, 100% em conformidade com a LGPD (anonimizadas e focadas em desenvolvimento), e conta com um sistema de ranqueamento gamificado (Liga de Ouro) para incentivar o engajamento da liderança.

---

## ✨ Principais Funcionalidades

- **🧠 Roteiros com IA:** Geração de pautas via API do Gemini 1.5 Flash baseada em parâmetros comportamentais e técnicos.
- **📄 Atas em PDF (LGPD):** Geração de documentos PDF no lado do cliente com assinatura digital dos envolvidos.
- **🏆 Gamificação:** Sistema de XP e ranking local ("Liga de Ouro") com patentes como *Titã das 1:1s* e *Líder de Impacto*.
- **📊 Auditoria e Logs:** Geração de logs automáticos em `.csv` no Back-end a cada ata baixada para consumo em ferramentas de BI.
- **🌓 Dark Mode:** Interface responsiva com suporte nativo a temas Claro/Escuro.

---

## 🛠️ Stack Tecnológica

### Front-end
- **React (Vite):** Arquitetura base em componentes funcionais.
- **Tailwind CSS:** Estilização utilitária e responsiva.
- **Lucide React:** Biblioteca de ícones minimalistas.
- **html2pdf.js:** Geração de relatórios PDF fiéis à interface.
- **React Markdown:** Renderização segura da saída da IA.

### Back-end
- **Python 3+**
- **FastAPI:** Motor do servidor de altíssima performance.
- **Google Generative AI:** Integração com LLM (Gemini).
- **Pydantic:** Validação estrita de dados na API.

---

## 📁 Estrutura de Diretórios (Monorepo)

O projeto segue um padrão arquitetural desacoplado:

```text
smart-leading-v2/
├── backend/               # Motor API e integração com a IA
│   ├── app/               # Rotas e regras de negócio
│   ├── logs/              # Repositório de dados e auditoria
│   ├── .env               # Variáveis de ambiente (Chave da IA)
│   └── requirements.txt   # Dependências do Python
│
├── frontend/              # Interface do Usuário (UI/UX)
│   ├── src/               # Código fonte (Views, Components, Dados)
│   ├── package.json       # Dependências do Node.js
│   └── tailwind.config.js # Regras de estilo corporativo
│
└── docs/                  # Governança e documentação complementar

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

---

## 📜 Licença e Governança

Desenvolvido para uso corporativo interno - **Clear IT**.
As diretrizes de proteção de dados aplicadas neste projeto seguem os padrões exigidos pela LGPD. Consulte a pasta `/docs` para mais detalhes sobre a conformidade de dados e regras da gamificação.

```