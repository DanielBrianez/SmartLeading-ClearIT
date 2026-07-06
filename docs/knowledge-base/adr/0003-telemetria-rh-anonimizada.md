# ADR 0003: Telemetria de People Analytics Anonimizada

*   **Status:** Aprovado
*   **Data:** 2026-07-01

---

## 1. Contexto

O RH e a Diretoria da Clear IT necessitam de governança ativa sobre as práticas de liderança. Eles precisam responder a perguntas como: *"Nossos líderes estão fazendo 1:1s?"*, *"Qual a taxa de engajamento nos PDIs?"* e *"Há áreas em risco de clima?"*. 

No entanto, expor as anotações, desabafos e feedbacks individuais dos colaboradores para o RH quebraria a **Segurança Psicológica** do processo, destruindo a confiança entre líder e liderado e resultando em conversas superficiais e autocensuradas.

---

## 2. Decisão

Adotar o modelo de **Telemetria de Metadados e Pseudonimização**.

O RH não possui acesso a nenhuma transcrição, ata de 1:1, anotação ou PDI textual detalhado. As métricas do Painel do RH (People Analytics) consomem logs agregados no servidor que registram exclusivamente metadados operacionais das reuniões:
*   Timestamp da reunião.
*   Identificador do líder.
*   Área, senioridade e perfil comportamental (DISC) abstrato do liderado.
*   Metadados quantitativos de processo (Ex: se a ata foi baixada, se o PDI foi criado e se o rito foi validado pelo colaborador).

Qualquer informação confidencial textual permanece confinada no dispositivo local dos participantes.

---

## 3. Consequências

*   **Positivas:**
    *   **Segurança Psicológica:** Colaboradores sentem-se seguros para debater dores reais sabendo que os detalhes não serão lidos pelo RH.
    *   **Governança Baseada em Dados:** O RH obtém visibilidade estatística avançada (taxa de adesão por diretoria, zonas de risco de cadência, índices de clareza) para calibrar treinamentos.
    *   **Minimização de Dados:** Conformidade perfeita com as diretrizes de minimização e limitação de finalidade da LGPD.
*   **Negativas/Riscos:**
    *   **Falta de Auditoria de Conteúdo:** O RH não pode verificar diretamente se um líder está aplicando feedbacks de maneira abusiva ou inadequada através do sistema, dependendo dos canais tradicionais de compliance.
