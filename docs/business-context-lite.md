# Business Context - Smart Leading (ClearIT)

> Este arquivo é a fonte de verdade para Produto. O agente `@product` atualizará este arquivo quando houver novas descobertas.

## 1. Visão Geral (Product Vision)
O **Smart Leading** é um ecossistema ativo de liderança voltado para a ClearIT. A solução opera como uma aplicação web de página única (*Single Page Application*) que permite que líderes realizem reuniões 1:1 assistidas por Inteligência Artificial (copiloto *human-in-the-loop*), acompanha o desenvolvimento de liderados com base no Framework de Levels e mensura a maturidade da liderança através de telemetria de engajamento, fornecendo visibilidade direta para o RH.

A plataforma automatiza a carga cognitiva de planejamento, customiza as abordagens com base em perfis comportamentais e resolve a falta de governança, padronização e engajamento prático nos ritos de gestão de pessoas.

### 1.1. Linha do Tempo e Fases do Produto (Roadmap)

*   **🚀 Fase 1: MVP (Fundação e Validação) - *Concluído***
    *   Estruturação da arquitetura moderna de arquivos (*Clean Code* com React + Python/FastAPI).
    *   Integração com a API do Google Gemini (Motor de Inteligência Artificial).
    *   Criação do Mega-Prompt com foco na adaptação comportamental do líder e liderado (Metodologia CRIA).
    *   Geração de Ata Oficial em PDF (`html2pdf.js`) com formatação visual avançada no front-end.
    *   Conformidade total com a LGPD (*Privacy by Design* com anonimização ativa e dados processados localmente).

*   **🎨 Fase 2: UI/UX e Gestão Inteligente (Aceleração) - *Concluído***
    *   Interface de alto nível com Tailwind CSS (Suporte a *Dark Mode*, navegação fluida, *Modals Backdrop Blur* e *Toasts* de aviso).
    *   Implementação de sistema de *Telemetria Local* (`localStorage`) para rascunhos de atas, PDIs e XP.
    *   Implementação de **Travas de Produtividade** (Limite estrutural de 3 PDIs e 3 Acordos simultâneos, garantindo foco no essencial).

*   **📊 Fase 3: Portal de People Analytics & Gamificação Bilateral (Sprint 2 - MVP) - *Em Progresso***
    *   Criação de um dashboard gerencial de RH e radar de saúde sistêmica (Heatmap).
    *   Implementação do motor de maturidade bilateral (XP condicionado à validação pelo liderado).
    *   Mapeamento de Levels e âncora de habilidades oficiais da ClearIT nos roteiros de IA.
    *   Sistema *Dev Tools* embutido para autoinjeção e higienização de base de dados para testes em demonstrações.

*   **🔌 Fase 4: Integrações Corporativas (Escala) - *Futuro***
    *   Integração de notificações reais através de *Webhooks* para o Slack ou Microsoft Teams.
    *   Integração com a API do Google Calendar / Outlook para sincronização de 1:1s.
    *   Migração da base de dados local para uma arquitetura Cloud corporativa com criptografia ponta a ponta.
    *   Envio automático (e opcional) da Ata em PDF para o software central de gestão de talentos do RH.

---

## 2. Dores do Cliente (Problemas que resolvemos)
- **Falta de Estrutura e Preparo da Liderança:** Os líderes não têm "a faca e o queijo na mão". Eles estão sobrecarregados, sem processos claros e sem ferramentas de apoio, o que os impede de exercerem a gestão de forma consistente.
- **Efeito Caixa-Preta e Estigma da Punição:** A cultura de feedback na empresa sofre com a falta de transparência e o estigma da punição. Líderes e colaboradores enxergam as conversas de 1:1 e feedback como processos burocráticos, desgastantes ou puramente corretivos, em vez de alavancas de crescimento. A ausência de um fechamento formalizado, acordado e visível para as duas partes (uma ata compartilhada) faz com que o que foi discutido se perca na ambiguidade ou no esquecimento, destruindo a segurança psicológica e a confiança na liderança.
- **PDIs Genéricos:** Planos de Desenvolvimento Individual que não se conectam às reais necessidades do nível do colaborador no Framework de Levels.
- **Sobrecarga de Preparação:** Líderes gastam muito tempo (cerca de 30 a 40 minutos) preparando pautas de liderança e antecipando reações antes de cada conversa.
- **Apagão de Dados e Governança no RH:** O departamento de Recursos Humanos não possui visibilidade em tempo real sobre a frequência, qualidade ou adoção das reuniões de 1:1.

---

## 3. Backlog de Épicos e Features (Sprint 2 - MVP)
| ID | Título | Status | Notas |
|---|---|---|---|
| F-01 | Co-Pilot de Roteiro de 1:1 e Feedback (SBI Guard) | Pronto para Dev | Roteiro de IA reescreve entrada bruta expurgando adjetivos de caráter (SBI) e obriga a 4 etapas (Contexto, Escuta, SBI e Co-construção). |
| F-02 | Editor de Ata Inteligente (UX Scaffolding & PDF) | Concluído / Ajustes | Editor WYSIWYG de campo único com cabeçalhos travados por tipo de rito e exportação em PDF local. |
| F-03 | Motor de Maturidade & Liga de Líderes | Em Progresso | Classificação em 4 níveis por drivers operacionais. Ranking individual e por equipes, missões, badges e streak de XP. |
| F-04 | Dashboard de Métricas do RH & Radar de Saúde (Heatmap) | Em Progresso | Tela executiva de RH mostrando adoção e Heatmap Temático por área com N-Size Masking (>5 liderados). |
| F-05 | Setup de Banco, Autenticação e IA | Concluído | Infraestrutura local com banco CSV (`data/telemetry_logs.csv`) e API do Gemini |
| F-06 | Guia Interativo do Líder (Playbook) | Pronto para Dev | Nova aba integrada com diretrizes da Metodologia CRIA, perfis DISC e icebreakers |
| F-07 | [Fundida na Feature F-01] | - | O rito de Feedback Estruturado foi incorporado à Feature F-01 (Co-Pilot Único parametrizado). |
| F-08 | Motor de Cadência e Alerta de Descobertos (>30 dias) | Pronto para Dev | Regras de frequência e card relacional do RH mostrando inatividades nominais (>30 dias) com gatilho de lembrete (Sem IA). |
| F-09 | Integração com MS Teams & E-mail | Pronto para Dev | Envio automatizado de Adaptive Cards no MS Teams e e-mails com links mágicos para coleta de pauta |
| F-10 | PDI Padronizado & Extrator de Acordos (NER) | Pronto para Dev | Modelo com ciclo anual de 1 ano, metas vinculadas ao Levels e checklist dinâmico extraído da ata anterior via IA. |
| F-11 | Mapeamento de Levels & Âncora de IA | Pronto para Dev | IA ancorada nas competências oficiais de cada nível e trilha de carreira da ClearIT |
| F-12 | [Descontinuada] | - | Feature de Biblioteca Colaborativa de Temas descontinuada devido à redundância com o Heatmap Temático por IA. |
| F-13 | Compliance Guardrails & Privacy Shield (AI Gateway) | Pronto para Dev | Tokenização local (CPF/RG) e AI Gateway Proxy intermediário para higienização semântica (doenças/subjetividades). |
| F-14 | Fluxo de Assinatura Bilateral (Sign-off) | Pronto para Dev | Envio automático da ata e painel do liderado para confirmação digital de acordos |
| F-15 | Termômetro de Segurança Psicológica | Pronto para Dev | Envio de escala de humor no Teams 2 dias antes e ajuste dinâmico do prompt do roteiro da IA |
| F-16 | Painel do Liderado & Trilha de Levels | Pronto para Dev | Espaço centralizado para o colaborador ver conquistas, progresso do PDI, acordos e trilha de levels |
| F-17 | Módulo de Alerta de Risco de Colaborador (Opt-In) | Pronto para Dev | Checkbox na ata para reportar risco ao RH. Segregação nominal local e classificação semântica de risco/severidade via IA anônima. |

---

## 4. Especificações Ativas (Em Detalhe)

### Feature F-01: Co-Pilot de Roteiro de 1:1 e Feedback (SBI Guard) (Story 1)
*   **User Story:** Como líder, quero gerar um roteiro de reunião personalizado e bilateral para conduzir conversas de 1:1 geral ou feedbacks estruturados (reconhecimento, desenvolvimento ou corretivo), com suporte da IA para expurgar julgamentos de caráter e garantir a escuta ativa da perspectiva do liderado.
*   **Contexto:** Unificação do motor de IA. O líder seleciona a tipologia da conversa na SPA. Se selecionar feedback, insere o fato bruto observável e a IA processa o texto aplicando o **SBI Guard**, reescrevendo adjetivos de caráter (ex: "desorganizado" ou "preguiçoso") em dados factuais objetivos (SBI), e fornecendo dicas com base no perfil comportamental do gestor.
*   **Critérios de Aceite:**
    - A IA gera o roteiro em até 10 segundos adaptando-se ao tipo de rito selecionado.
    - **Para Feedbacks (SBI Guard):** Estruturação obrigatória do roteiro em 4 etapas:
      1. **Contexto Técnico:** O líder esclarece a intenção de desenvolvimento.
      2. **Pergunta de Escuta Ativa:** Pergunta inegociável para ouvir o liderado antes de expor o feedback (*"Como você está vendo essa situação?"*).
      3. **Estrutura SBI Limpa:** Apresentação da Situação, Comportamento observado e Impacto sem termos subjetivos ou ofensivos.
      4. **Espaço de Co-construção:** Pergunta aberta para formular o próximo passo cooperativo.
    - **Para 1:1 Geral:** Estruturação em 5 blocos da ClearIT (Bem-estar, Pauta do Colaborador, Obstáculos, Desenvolvimento/Levels, Acordos e PDI).
    - O prompt enviado à API do Gemini utiliza contexto abstrato e é totalmente livre de PII (Zero PII).

### Feature F-02: Editor de Ata Inteligente (UX Scaffolding & PDF) (Story 2)
*   **User Story:** Como líder, quero registrar os combinados de 1:1s e feedbacks em um editor de ata que carregue a estrutura de títulos fixa correspondente à conversa e exportar o PDF localmente em um clique.
*   **Contexto:** O editor WYSIWYG possui campos de cabeçalho estilizados em **Bold** na cor **grafite azulado / azul-marinho profundo** com espaçamento confortável de respiro.
*   **Critérios de Aceite:**
    - O editor carrega cabeçalhos específicos do rito selecionado e bloqueia a deleção deles, permitindo editar apenas o conteúdo interno.
    - **Para 1:1 Geral (5 Blocos):**
      1. `🌱 1. Check-in Humano`
      2. `🎯 2. Pauta do Liderado & Obstáculos`
      3. `🚀 3. Desenvolvimento & Carreira`
      4. `🤝 4. Acordos e Próximos Passos`
      5. `📎 5. Outros Assuntos`
    - **Para Feedbacks (4 Blocos - Escuta Ativa obrigatoriamente como Bloco 1):**
      - *Reconhecimento:* `👂 1. Entendimento dos Fatos & Escuta Ativa` | `🌟 2. Comportamento Destaque` | `💥 3. Impacto Positivo` | `🤝 4. Acordos de Próximos Passos`
      - *Desenvolvimento:* `👂 1. Entendimento dos Fatos & Escuta Ativa` | `🛠️ 2. Ponto de Melhoria / Gap` | `🎯 3. Comportamento Esperado & Ações` | `🤝 4. Acordo e Prazo de Revisão`
      - *Corretivo Urgente:* `👂 1. Entendimento dos Fatos & Escuta Ativa` | `⚠️ 2. Fato Crítico e Evidência` | `🚨 3. Plano de Correção Imediata` | `🤝 4. Compromissos e Data Limite`
      - *Feedback em 1:1:* `👂 1. Entendimento dos Fatos & Escuta Ativa` | `💬 2. Ponto de Alinhamento` | `💡 3. Combinado Rápido` | `🤝 4. Apoio do Gestor`
    - Exportação do PDF de forma 100% local no cliente via `html2pdf.js`, sem envio de dados pessoais dos funcionários ao servidor externo.

### Feature F-03: Motor de Maturidade & Liga de Líderes (Story 3)
*   **User Story:** Como líder, quero acompanhar minha classificação de maturidade, ver meu posicionamento no ranking individual e por equipes da minha área, e conquistar insígnias de boas práticas baseadas na condução e alinhamento real dos ritos.
*   **Contexto:** Transforma a rotina de registros em um ecossistema de autodesenvolvimento de liderança. O XP e os níveis combinam os rótulos do RH com trilhas dinâmicas de proficiência, exigindo validação mútua da qualidade da conversa.
*   **Critérios de Aceite:**
    - **Trilhas de Proficiência de Liderança:** Os 4 níveis de maturidade exigidos pelo RH são estruturados em focos de trilha comportamental:
      - *Nível 1: Iniciante ➔ Trilha: Líder Técnico (Foco Operacional):* Desbloqueio básico de ritos. Missões focam em iniciar o hábito de preparar e realizar as primeiras 1:1s estruturadas.
      - *Nível 2: Em Desenvolvimento ➔ Trilha: Líder em Transição (Foco em Desenvolvimento):* Feedbacks estruturados. Missões focam na condução de conversas complexas via modelo SBI e na co-construção de PDIs.
      - *Nível 3: Consistente ➔ Trilha: Líder Engajado (Foco em Cadência):* Consistência e alinhamento. Missões exigem manter o *Streak* de cadência quinzenal e alta taxa de alinhamento bilateral.
      - *Nível 4: Referência ➔ Trilha: Líder Multiplicador (Foco em Mentoria/Cultura):* Disseminar boas práticas. Missões envolvem ajudar pares, compartilhar temas de pauta valiosos e liderar desafios de equipe.
    - **Bilateralidade da Pontuação (Validação de Qualidade):** Quando o líder finaliza a ata, os pontos de progresso entram em modo pendente. O colaborador recebe uma notificação na plataforma para responder a uma **microvalidação** de que saiu do rito com pelo menos 3 próximos passos claros. O XP só é efetivamente liberado para ambos no ranking se as duas partes validarem o alinhamento.
    - **Pontuação por Fases do Fluxo de IA (Fracionada):** A pontuação do rito é distribuída ao longo das interações de IA:
      - *Fase 1 (Antes - Preparação):* XP ganho ao acessar o Co-Pilot de IA para organizar a pauta com antecedência.
      - *Fase 2 (Durante - Condução):* XP ganho ao seguir a estrutura recomendada de IA (escuta ativa e SBI factual).
      - *Fase 3 (Depois - Registro):* XP ganho ao registrar a ata no editor travado e os combinados do PDI.
    - **Mecânicas da Liga de Líderes:**
      - *Ranking Individual e de Equipes (Aba de Departamentos):* Mantém a ordenação e a média aritmética de XP do setor com filtros por Área de Atuação.
      - *Regra de Desempate Automático:* Caso dois líderes possuam o mesmo XP, o sistema desempata posicionando acima o gestor com o maior volume de atas geradas/baixadas.
      - *Mecanismo de Streak (Multiplicador de Consistência):* Mantém o bônus de 1.2x XP caso ritos ocorram no prazo ideal sem adiamentos.
      - *Títulos Honoríficos (Visão Global):* Destaque visual e medalhas para os três primeiros colocados no ranking geral:
        - 🥇 1º Lugar: **Titã das 1:1s** (destaque em Amber-500)
        - 🥈 2º Lugar: **Líder de Impacto**
        - 🥉 3º Lugar: **Gestor Engajado**
      - *Badges (Conquistas):* Insígnias de progresso (ex: *Líder Consistente*, *Escuta de Ouro*, *Parceiro do PDI*).
      - *Sistema de Notificações In-App (Sininho):* Alertas visuais comunicando ganho de XP e status de validação de atividades em tempo real.

### Feature F-04: Dashboard de Métricas do RH & Radar de Saúde (Heatmap) (Story 4)
*   **User Story:** Como profissional de RH, quero visualizar indicadores das reuniões, conformidade de cadência e tendências temáticas em um painel agregador para mapear a saúde sistêmica das equipes.
*   **Contexto:** Painel executivo que exibe métricas de adoção agregadas e o heatmap temático de atas.
*   **Critérios de Aceite:**
    - **Novas Métricas de People Analytics:** O painel exibe:
      - A taxa de conformidade geral das 1:1s e ritos.
      - **Índice de Clareza dos Times:** Média de próximos passos claros identificados pelos colaboradores nas microvalidações de ritos.
      - A evolução do índice de maturidade de liderança de cada gestor e sua área.
    - **Radar de Saúde Sistêmica (Heatmap Temático):** Matriz que cruza as Diretorias/Líderes versus Macrotemas da ClearIT. O gráfico renderiza intensidades estatísticas usando: **cinza-claro** (normalidade), **âmbar suave** (atenção) e **crimson profundo/magenta vibrante** (anomalia crítica).
    - **Regra de Ouro do Anonimato (N-Size Masking):** Permite drill-down por ID de líder. O `ID_do_Liderado` é descartado. Caso uma equipe tenha menos de 5 liderados, seus dados temáticos são consolidados em um grupo genérico para impedir quebras acidentais de sigilo.

### Feature F-05: Setup de Infraestrutura & APIs (Story 5)
*   **Technical Enabler:** Como equipe de desenvolvimento, necessitamos configurar a infraestrutura básica e conexões de API para sustentar as transações do MVP de forma estável.
*   **Critérios de Aceite:**
    - Banco local CSV (`data/telemetry_logs.csv`) configurado e gravando metadados de telemetria (sem PII).
    - Serviço de IA integrado via API do Gemini (`gemini-2.5-flash` ou `gemini-3.1-flash-lite`) respondendo com formatação estruturada.
    - Variáveis de ambiente configuradas no arquivo `.env.example`.

### Feature F-06: Guia Interativo do Líder (Story 6)
*   **User Story:** Como líder, quero acessar um guia interativo de boas práticas e diretrizes comportamentais diretamente na plataforma para me preparar melhor e conduzir reuniões 1:1 de forma estruturada.
*   **Critérios de Aceite:**
    - Acesso direto na barra de navegação da SPA como uma nova aba chamada "Guia do Líder".
    - Explicação da Metodologia CRIA com comparativo de "Antes/Depois".
    - Guia prático simplificado para lidar com os 4 perfis DISC (Dominante, Influente, Estável, Analítico).
    - Lista/carrossel interativo com pelo menos 5 icebreakers prontos para uso.

### Feature F-08: Motor de Cadência e Alerta de Descobertos (>30 dias) (Story 8)
*   **User Story:** Como profissional de RH, quero acompanhar se as cadências de reuniões dos gestores estão ocorrendo no ritmo ideal e identificar colaboradores sem reuniões registradas há mais de 30 dias para enviar alertas.
*   **Contexto:** Motor que monitora ritos a partir do banco de dados local.
*   **Critérios de Aceite:**
    - **Alerta de Descobertos (>30 dias):** Painel do RH exibe card destacando funcionários sem atas nos últimos 30 dias e seus respectivos líderes, com botão `[⚡ Disparar Lembrete]` para notificação de cobrança.
    - **Lógica SQL/JS Relacional Pura:** Este cálculo de prazos e o painel de descobertos rodam 100% sobre lógica de banco relacional local, com custo zero de processamento e sem consumo de IA/tokens.
    - Sinaliza prazos de cadências (quinzenal, mensal, experiência de 45/90 dias e trimestral).

### Feature F-09: Integração com MS Teams & E-mail (Story 9)
*   **User Story:** Como liderado, quero receber um convite automático no MS Teams ou e-mail 2 dias antes da minha 1:1 para preencher minha pauta, enviando notificação ao meu líder.
*   **Critérios de Aceite:**
    - Disparo de Adaptive Cards no Teams com campos de temas e comentários.
    - Respostas persistidas localmente e integradas ao painel de preparação do gestor.
    - Alternativa de e-mail com link mágico transacional que abre página simplificada na SPA.

### Feature F-10: PDI Padronizado & Extrator de Acordos (NER) (Story 10)
*   **User Story:** Como líder, quero gerenciar o Plano de Desenvolvimento Individual do meu liderado de forma padronizada e contar com o checklist dos compromissos anteriores integrado à preparação para garantir a continuidade.
*   **Contexto:** PDI organizacional associado às competências de Levels com ciclo de 1 ano.
*   **Critérios de Aceite:**
    - PDI limitado a no máximo 2 ou 3 objetivos de desenvolvimento ativos por ciclo.
    - Metas estruturadas pelos marcos de 1, 2, 3 e 6 meses.
    - **Extrator e Rastreador de Acordos (NER):** A IA varre o Bloco 4 (Acordos) da ata anterior e extrai compromissos (*Quem + O que + Prazo*), injetando-os automaticamente como um checklist in-app de acompanhamento na preparação da reunião seguinte.

### Feature F-11: Mapeamento de Levels e Âncora de Habilidades (Story 11)
*   **User Story:** Como líder, quero visualizar a matriz de competências do nível atual e do próximo nível do meu liderado para direcionar as 1:1s e o PDI, ancorando os prompts da IA nas habilidades oficiais.
*   **Critérios de Aceite:**
    - Perfil do colaborador exibe sua matriz e trilha de carreira da ClearIT.
    - IA (F-01) recebe a matriz de competências correspondente ao cargo e nível do liderado, gerando roteiros focados na transição de nível sem criar competências externas.

### Feature F-13: Compliance Guardrails & Privacy Shield (AI Gateway) (Story 13)
*   **User Story:** Como profissional de compliance, quero garantir que nenhuma informação pessoal sensível ou diagnóstico de saúde transite de forma identificável para serviços de nuvem ou IA externa.
*   **Contexto:** Sistema de segurança estilo firewall de texto.
*   **Critérios de Aceite:**
    - **Tokenização Local (Client-Side):** Algoritmos filtram CPF/RG no navegador substituindo por `[DOCUMENTO]` antes de trafegar.
    - **AI Gateway Proxy (Privacy Shield):** Camada intermediária detecta menções de saúde ou doenças e reescreve sentenças em tom neutro e corporativo (ex: *"está com depressão"* vira `[MOTIVO_MÉDICO_REDUZIDO]`).
    - Integração de IA via Enterprise Zero-Retention para evitar uso de dados para treino.

### Feature F-14: Fluxo de Assinatura Bilateral (Sign-off) (Story 14)
*   **User Story:** Como liderado, quero visualizar a ata consolidada da minha reunião e registrar meu "Aceite" nos acordos firmados de forma a formalizar os próximos passos.
*   **Critérios de Aceite:**
    - Liderado tem acesso a um painel simples e seguro para visualizar seu histórico de atas e pendências.
    - Botão "Confirmar Acordo" (Sign-off) na ata, atualizando as métricas de governança visíveis ao gestor.

### Feature F-15: Termômetro de Segurança Psicológica Pré-Reunião (Story 15)
*   **User Story:** Como líder, quero saber o estado emocional/energia do meu liderado antes da 1:1 para calibrar minha abordagem e conduzir a reunião de forma empática.
*   **Critérios de Aceite:**
    - Coleta de humor/energia por escala de emojis 2 dias antes no Teams/e-mail.
    - Exibe nuggets informativos no painel do líder e ajusta o prompt da IA se o liderado indicar sobrecarga/estresse.

### Feature F-16: Painel do Liderado & Trilha de Habilidades (Story 16)
*   **User Story:** Como liderado, quero ter um espaço centralizado para visualizar minhas conquistas, insígnias, a evolução das minhas habilidades do Framework de Levels, o progresso dos meus PDIs e acordos, e realizar a microvalidação do valor dos meus ritos.
*   **Critérios de Aceite:**
    - Alternância transparente no header da SPA entre "Visão: Líder" e "Visão: Liderado".
    - Exibição de conquistas, badges, trilha de habilidades e o checklist de acordos ativos.
    - **Microvalidação do Alinhamento:** Interface simples com card para ritos recém-concluídos pelo líder. O colaborador confirma por meio de checkbox se saiu do rito com pelo menos **3 próximos passos claros** e se a reunião gerou valor, desbloqueando a pontuação bilateral de XP no ranking e atualizando o índice de clareza do RH.

### Feature F-17: Módulo de Alerta de Risco de Colaborador (Opt-In) (Story 17)
*   **User Story:** Como líder, quero reportar voluntariamente um colaborador em risco de saída ou baixo desempenho para que o RH possa intervir de forma imediata e proativa.
*   **Contexto:** Mecanismo de socorro ao líder para retenção de talentos chaves.
*   **Critérios de Aceite:**
    - A interface possui o checkbox voluntário `[ ] Desejo reportar este colaborador em risco crítico ao RH`.
    - **Segregação de Dados Seguro:** O nome do colaborador e do líder ficam restritos ao banco de dados relacional local da empresa. O texto descritivo com o motivo do risco é enviado à IA de forma **100% anonimizada** via AI Gateway.
    - A IA analisa e categoriza o risco (Carreira, Clima ou Performance) e sua severidade (Baixa, Média, Alta) para exibição no painel de urgências do BP de RH.

---

## 5. Contexto Organizacional de Referência (ClearIT)
*   **Áreas Cadastradas (10 áreas):** Diretoria, RH, Financeiro, Comercial, Pré-vendas, Pós-vendas, Alianças e Parcerias, Licitações e Contratos, Precificação e Suprimentos, e Marketing.
*   **Headcount de Referência (Total 68 colaboradores):**
    - Diretoria: 6 | Comercial: 16 | Pré-vendas: 5 | Pós-vendas: 20 | Alianças e Parcerias: 4 | Contratos e Licitações: 2 | Precificação e Suprimentos: 3 | Financeiro: 6 | RH: 4 | Marketing: 2.
*   **Mapeamento de Maturidade Cultural:** A ClearIT possui uma cultura de feedback implantada há 5 meses baseada em treinamentos das lideranças. O primeiro Comitê de Calibração ocorrerá entre Outubro e Dezembro, e a primeira rodada da AvD anual iniciará em Setembro de 2026.

