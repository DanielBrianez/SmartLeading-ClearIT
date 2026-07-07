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