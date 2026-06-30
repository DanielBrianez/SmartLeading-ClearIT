# 🛠️ Contexto Técnico e Arquitetura - Smart Leading

## 1. Stack Tecnológica
* **Frontend:** React (Vite), Tailwind CSS (Interface responsiva e gráficos puros nativos), Lucide Icons (Iconografia unificada).
* **Backend:** Python 3 (FastAPI) - Engine de telemetria local e orquestração.
* **Inteligência Artificial:** Google Gemini API (Modelo `gemini-1.5-flash`) operando com engenharia de prompts estruturada via JSON/Markdown.
* **Persistência e Estado:** `localStorage` (Cofre isolado no browser para persistência de atas, acordos/tasks e PDIs dinâmicos).
* **Geração de Documentos:** `html2pdf.js` para renderização perfeita de PDFs no cliente sem sobrecarga do servidor.

## 2. Diagrama de Arquitetura do Sistema (Mermaid)

O diagrama abaixo ilustra o fluxo de dados unificado, o isolamento do cofre local e a ponte paramétrica com o motor de IA:

```mermaid
graph TD
    subgraph Client_Browser [Navegador do Líder - Sandbox Seguro]
        UI[React Frontend App]
        LS[localStorage: Atas, Tasks, PDI, Adiamentos]
        PDF[html2pdf.js Client Engine]
    end

    subgraph Backend_Server [Backend Clear IT]
        API[FastAPI Router]
        AGENT[ai_agent.py / gemini.py]
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

    classDef browser fill:#eff6ff,stroke:#3b82f6,stroke-width:2px;
    classDef server fill:#f0fdf4,stroke:#10b981,stroke-width:2px;
    classDef external fill:#fff7ed,stroke:#f97316,stroke-width:2px;
    
    class UI,LS,PDF browser;
    class API,AGENT server;
    class GEMINI external;