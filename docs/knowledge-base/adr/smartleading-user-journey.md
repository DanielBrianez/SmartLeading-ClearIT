# SmartLeading‑ClearIT – User Journey Documentation

## Visão Geral
**SmartLeading‑ClearIT** é a solução focada em melhorar a gestão de desempenho, desenvolvimento de pessoas e comunicação entre **Líderes**, **Liderados** e **RH**. Ela resolve problemas crônicos das organizações:
- Falta de alinhamento de metas entre líder e colaborador.
- Feedback esporádico e não estruturado.
- Dificuldade de rastrear progresso de desenvolvimento.
- Ausência de métricas de performance consolidadas para RH.
- Processos de 1:1 que se perdem em agendas caóticas.

A seguir está a jornada do usuário detalhada para cada perfil, calibrada exatamente com as features planejadas e implementadas na aplicação.

---

## 1. Personas e Responsabilidades
| Persona | Responsabilidades chave | Principais dores | Objetivo principal |
|---|---|---|---|
| **Líder** | • Conduzir 1:1 regulares<br>• Fornecer feedback estruturado (CRIA)<br>• Definir metas de desenvolvimento (SMART)<br>• Monitorar maturidade e ganhar XP | • Falta de tempo para preparar reuniões<br>• Dificuldade de acompanhar progresso entre ciclos<br>• Incerteza sobre quais métricas usar | Criar um ciclo de desenvolvimento contínuo, de alta governança, gamificado e alinhado ao negócio. |
| **Liderado** | • Registrar seu status (Sincronia de Momento)<br>• Responder e solicitar reuniões<br>• Avaliar a utilidade e relevância das 1:1s<br>• Acompanhar volume de metas | • Não sabe quais habilidades priorizar<br>• Recebe feedback genérico ou tardio<br>• Falta de engajamento contínuo | Participar ativamente da sua trilha de desenvolvimento e avaliar o processo com transparência. |
| **RH** | • Monitorar a cadência e compliance de 1:1s<br>• Consolidar dados de clima organizacional<br>• Identificar líderes ofensores<br>• Gerar logs e relatórios DRE em conformidade com a LGPD | • Dados dispersos em planilhas<br>• Dificuldade de gerar insights estratégicos<br>• Risco de vazamento de dados sensíveis (PII) | Centralizar informações de performance, monitorar alertas de burnout e auditar a liderança com total privacidade. |

---

## 2. Jornada do Usuário – Líder

### Etapas da Jornada
1. **Preparação da 1:1**
   - **Ação:** Acessa o *Radar de Reuniões* (cadência quinzenal) ou a lista de Squad na Home e clica em "Planejar Agora" ou "Fazer 1:1".
   - **Dores resolvidas:** Esquecimento de prazos e preparação complexa.
   - **Resultado:** Abertura automática da tela de preparação com a senioridade, tempo de casa e status ("Sincronia de Momento") do liderado integrados.
2. **Condução e Roteiro de IA**
   - **Ação:** Visualiza a pauta proposta pelo colaborador, insere notas sobre as entregas recentes (as quais passam por um Firewall LGPD automático para limpar PII) e gera o Roteiro Confidencial via Gemini.
   - **Dores resolvidas:** Roteiro sem estrutura e conversas dispersas.
   - **Resultado:** Pauta gerada utilizando a metodologia **CRIA**, calibrada para a senioridade do liderado, o estilo de liderança do gestor e os tópicos sugeridos pelo colaborador.
3. **Envio da Ata (Download e Publicação)**
   - **Ação:** Clica em "Gerar PDF", o que baixa o arquivo físico assinado e aciona a publicação automática da Ata no histórico compartilhado de reuniões do banco local.
   - **Dores resolvidas:** Falta de governança, burocracia no envio de minutas e riscos de compliance.
   - **Resultado:** A ata é enviada dinamicamente ao portal do Liderado (iniciando o ciclo de avaliação de feedback) e registrada para a auditoria do RH, atualizando a próxima 1:1 (+15 dias).
4. **Definição de Plano de Desenvolvimento (PDI)**
   - **Ação:** Cria/atualiza metas SMART de curto (1-2 meses), médio (3 meses) e longo prazo (6 meses) para os liderados, limitando a 3 metas ativas simultâneas.
   - **Dores resolvidas:** Falta de foco e metas inalcançáveis.
   - **Resultado:** Dashboard pessoal do liderado atualizado e metas listadas no perfil do Squad.
5. **Maturidade e Gamificação**
   - **Ação:** Acompanha seus pontos de XP e sua classificação de maturidade (Iniciante, Em desenvolvimento, Consistente, Referência) na Home e no Ranking.
   - **Dores resolvidas:** Falta de incentivo para os líderes cumprirem a rotina de gestão de pessoas.
   - **Resultado:** Classificação na Liga de Ouro melhorada ao cumprir cadência e receber avaliações positivas.

### Pontos de Contato
- **Home do Líder** – painel com KPIs de cadência, squad e pontuação de XP/Patente.
- **Radar de Reuniões (Próximas Reuniões)** – controle de calendário e prorrogações (+7 dias).
- **Gerador de Roteiro 1:1** – input de notas, processamento de IA (CRIA) e download da Ata Oficial.
- **Gestão do Squad & PDI** – perfil completo dos liderados, tarefas de acordos e acompanhamento de metas SMART.
- **Playbook (Guia do Líder)** – biblioteca de metodologias (SBI) e guias práticos de feedback.

---

## 3. Jornada do Usuário – Liderado

### Etapas da Jornada
1. **Acompanhar a Cadência**
   - **Ação:** Visualiza na Home a data agendada para a próxima 1:1. Se a cadência estiver atrasada, clica no botão para enviar uma solicitação ao líder.
   - **Dores resolvidas:** Falta de rotina de alinhamento com a gestão.
   - **Resultado:** Lembrete de mentoria enviado ao painel do gestor.
2. **Sincronia de Momento e Pauta (3 dias antes via Teams)**
   - **Ação:** Recebe um alerta ativo com formulário interativo no Teams 3 dias antes do rito de 1:1. Registra seu sentimento ("Sincronia de Momento") e digita o tema sugerido diretamente de dentro do Teams, sem sair do fluxo de trabalho.
   - **Dores resolvidas:** Atrito de ter que abrir ferramentas web secundárias para responder perguntas simples de preparação.
   - **Resultado:** A pauta é gravada de forma síncrona no banco local, enviando um card de confirmação ao colaborador e populando o painel de mentoria do gestor.
3. **Acompanhamento de Carreira (PDI & Acordos)**
   - **Ação:** Acessa a Home para visualizar os detalhes das suas metas SMART do PDI, o Radar de Competências de Levels e os acordos firmados no encontro anterior.
   - **Dores resolvidas:** Falta de clareza nas metas de desenvolvimento de médio/longo prazo e esquecimento de combinados táticos.
   - **Resultado:** Visualização em duas colunas estruturadas, com atualização dinâmica de competências conforme o cumprimento das tarefas.
4. **Avaliação da Reunião (Feedback Loop)**
   - **Ação:** Avalia a utilidade da 1:1 recebida atribuindo estrelas (1 a 5) e respondendo sobre a relevância da pauta para o PDI.
   - **Dores resolvidas:** Reuniões improdutivas e sem foco.
   - **Resultado:** Envio da avaliação e liberação do XP do líder para o Ranking.

### Pontos de Contato
- **Home do Liderado** – dashboard com contadores de PDIs, tarefas pendentes, seletor de sentimento (Sincronia de Momento), campo de definição de pauta prévia e status da cadência.
- **Painel de Avaliação de 1:1** – formulário para avaliar o rito após a conclusão da ata.

---

## 4. Jornada do Usuário – RH

### Etapas da Jornada
1. **Análise de Compliance e Engajamento (People Analytics)**
   - **Ação:** Monitora a adesão geral da empresa aos ritos quinzenais e a saúde dos PDIs ativos.
   - **Dores resolvidas:** Desperdício de tempo e falta de consistência em processos de 1:1 tradicionais.
   - **Resultado:** Indicadores consolidados de eNPS, atas e adesão de liderança.
2. **Prevenção Proativa de Risco de Sobrecarga (Burnout)**
   - **Ação:** Analisa o Termômetro Organizacional consolidado, que agrupa os sentimentos declarados de forma anônima, identificando o percentual de colaboradores com status "Sobrecarga".
   - **Dores resolvidas:** Detecção tardia de burnout e turnover.
   - **Resultado:** Sinais de alerta visíveis para ações preventivas de bem-estar.
3. **Mapeamento de Ofensores de Liderança**
   - **Ação:** Visualiza a tabela de líderes em risco (com maiores atrasos na cadência) para direcionar treinamentos de gestão de forma assertiva.
   - **Dores resolvidas:** Líderes que negligenciam o desenvolvimento de seus liderados.
   - **Resultado:** Foco de atuação imediata do parceiro de RH.
4. **Extração de Auditoria de Engajamento**
   - **Ação:** Gera e exporta o relatório DRE (Demonstrativo de Resultado de Engajamento) em PDF.
   - **Dores resolvidas:** Dependência de relatórios manuais e compilação de planilhas.
   - **Resultado:** Arquivo PDF consolidado gerado instantaneamente em conformidade com as regras da LGPD (dados de liderança identificados por hashes anonimizados).

### Pontos de Contato
- **Home do RH** – dashboard principal com compliance de 1:1, termômetro organizacional (Burnout), e tabela de líderes ofensores.
- **Painel do RH (Filtros Avançados)** – visão analítica do eNPS, atas e PDIs filtrados por Ano, Semestre ou Quarter.
- **Relatório DRE** – gerador e exportador manual de relatório consolidado em PDF.

---

## 5. Métricas de Sucesso (KPIs)
| Área | KPI | Meta Inicial |
|---|---|---|
| Líder | Taxa de adoção da plataforma (líderes ativos) | ≥ 80 % |
| Líder | Cadência de 1:1 (número médio por mês) | ≥ 4 por mês |
| Líder | Frequência média de feedbacks por colaborador | ≥ 2 por mês |
| RH | Índice de confiança na liderança | ≥ 75 % |
| RH | Taxa de relevância percebida do feedback | ≥ 75 % |
| RH | Taxa de documentação de atas (percentual de reuniões com ata) | ≥ 90 % |
| Líder | Engajamento em missões de desenvolvimento | ≥ 70 % |

---

## 6. Checklist de Implantação da Jornada
- [x] Criar pasta `docs/knowledge-base/adr/`.
- [x] Salvar este documento como `smartleading-user-journey.md`.
- [ ] Habilitar rota global de PDI no **App.jsx** (Resolução de Roteamento).
- [ ] Implementar visualização detalhada de metas na Home do Liderado.
- [ ] Treinar usuários (Líderes, Liderados, RH) na navegação dos fluxos.

---

## 7. Referências Internas
- **business-context-lite.md** – Visão de negócio da solução.
- **technical-context-lite.md** – Stack tecnológico (React/Vite, FastAPI, SQLite/LocalStorage).
- **smart-leading-product-requirements.md** – Requisitos e especificações de features do MVP.
- **smart-leading-briefing.md** – Definição do escopo, regras de privacidade LGPD e gamificação.
