# ADR 0001: Armazenamento Sandbox Client-Side (Cofre Local)

*   **Status:** Aprovado
*   **Data:** 2026-07-01

---

## 1. Contexto

O ecossistema **Smart Leading** lida com atas de reuniões de 1:1, planos de ação e registros de Planos de Desenvolvimento Individual (PDIs) que contêm feedbacks, avaliações de desempenho e comentários sensíveis sobre colaboradores da companhia. 

Centralizar esse volume de dados textuais e feedbacks de pessoas em um banco de dados relacional comum na nuvem expõe a empresa a:
*   Riscos trabalhistas devido ao compartilhamento inadequado de avaliações subjetivas de caráter.
*   Responsabilidade sob a Lei Geral de Proteção de Dados (LGPD) em caso de ataques cibernéticos e vazamentos (data breaches).
*   Custos adicionais de criptografia e gerenciamento de permissões complexas a nível de banco de dados.

---

## 2. Decisão

Adotar a arquitetura de **Sandbox Client-Side** para armazenamento e persistência de dados textuais confidenciais. 

Toda a digitação, atas consolidadas de 1:1, PDIs detalhados e acordos ficam armazenados exclusivamente no `localStorage` do navegador do próprio gestor responsável. A geração de arquivos para download (PDF) é feita inteiramente no cliente via `html2pdf.js`. O servidor backend (FastAPI) não recebe nem armazena o conteúdo textual das reuniões.

---

## 3. Consequências

*   **Positivas:**
    *   **LGPD Shield:** Segurança jurídica e cibernética inegociável, pois as conversas íntimas e feedbacks nunca saem da máquina do gestor e do liderado (isolamento nativo).
    *   **Performance:** Operação da interface SPA instantânea, pois a leitura do `localStorage` não sofre latência de rede.
    *   **Custo de Infraestrutura:** Eliminação de custos com banco de dados centralizado de alta performance para blobs de texto.
*   **Negativas/Riscos:**
    *   **Perda de Dados:** Se o gestor limpar o cache e os dados do navegador (`localStorage`) ou trocar de máquina, ele perderá o histórico local se não tiver exportado os PDFs das atas.
    *   **Assimetria de Acesso:** Originalmente, o liderado não tinha como visualizar o progresso de forma síncrona sem o líder gerar o PDF (resolvido posteriormente na ADR 0004 com o Painel do Liderado).
