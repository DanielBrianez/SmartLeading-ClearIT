# Business Context - Smart Leading (ClearIT)

> Este arquivo é a fonte de verdade para Produto. O agente `@product` atualizará este arquivo quando houver novas descobertas.

## 1. Visão Geral (Product Vision)
O **Smart Leading** é um ecossistema ativo de liderança voltado para a ClearIT. A solução opera como uma aplicação web de página única (*Single Page Application*) que permite que líderes realizem reuniões 1:1 assistidas por Inteligência Artificial (copiloto *human-in-the-loop*), acompanha o desenvolvimento de liderados com base no Framework de Levels e mensura a maturidade da liderança através de telemetria de engajamento, fornecendo visibilidade direta para o RH.

A plataforma automatiza a carga cognitiva de planejamento, customiza as abordagens com base em perfis comportamentais e resolve a falta de governança, padronização e engajamento prático nos ritos de gestão de pessoas.

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
| F-01 | Gerar Roteiro Inteligente de 1:1 | Pronto para Dev | Atualizado com a estrutura de 5 etapas da ClearIT, pauta do liderado e perguntas de desenvolvimento |
| F-02 | Exportar Ata da Reunião em PDF | Concluído | Geração de PDF (FPDF) e download com registro na telemetria |
| F-03 | Motor de Maturidade & Liga de Líderes | Em Progresso | Classificação em 4 níveis por drivers operacionais. *Implementada apenas versão básica no código.* |
| F-04 | Dashboard de Métricas do RH | Em Progresso | Tela executiva de RH mostrando adoção e maturidade. *Pendente de implementação no código.* |
| F-05 | Setup de Banco, Autenticação e IA | Concluído | Infraestrutura local com banco CSV (`data/telemetry_logs.csv`) e API do Gemini |
| F-06 | Guia Interativo do Líder (Playbook) | Pronto para Dev | Nova aba integrada com diretrizes da Metodologia CRIA, perfis DISC e icebreakers |
| F-07 | Gerar Roteiro de Feedback Estruturado | Pronto para Dev | Novo rito baseado no modelo SBI, escuta ativa obrigatória (Fase 2) e 4 modelos de feedback |
| F-08 | Motor de Cadência e Alertas de Frequência | Pronto para Dev | Regras de frequência mínima (quinzenal/mensal, experiência 45/90 dias, colaborador em risco e trimestrais) |
| F-09 | Integração com MS Teams & E-mail | Pronto para Dev | Envio automatizado de Adaptive Cards no MS Teams e e-mails com links mágicos para coleta de pauta |
| F-10 | PDI Padronizado e Acompanhamento | Pronto para Dev | Modelo organizacional único com ciclo anual de 1 ano, metas vinculadas ao Levels e entregáveis periódicos |
| F-11 | Mapeamento de Levels & Âncora de IA | Pronto para Dev | IA ancorada nas competências oficiais de cada nível e trilha de carreira da ClearIT |
| F-12 | Biblioteca Colaborativa de Temas | Pronto para Dev | Compartilhamento de temas de pauta customizados entre líderes da mesma área |
| F-13 | Compliance Guardrails & RH Analytics | Pronto para Dev | Definição de metadados agregados para o RH e bloqueio de PII na IA, permitindo nome e e-mail locais |
| F-14 | Fluxo de Assinatura Bilateral (Sign-off) | Pronto para Dev | Envio automático da ata e painel do liderado para confirmação digital de acordos |
| F-15 | Termômetro de Segurança Psicológica | Pronto para Dev | Envio de escala de humor no Teams 2 dias antes e ajuste dinâmico do prompt do roteiro da IA |
| F-16 | Painel do Liderado & Trilha de Levels | Pronto para Dev | Espaço centralizado para o colaborador ver conquistas, progresso do PDI, acordos e trilha de levels |

---

## 4. Especificações Ativas (Em Detalhe)

### Feature F-01: Gerar roteiro inteligente de 1:1 (Story 1)
*   **User Story:** Como líder, quero gerar um roteiro de reunião 1:1 personalizado e bilateral para conduzir conversas de relacionamento e desenvolvimento contínuo focadas no liderado.
*   **Contexto:** O roteiro de 1:1 pertence ao liderado e cobre múltiplos temas (bem-estar, entregas, carreira, desenvolvimento). O sistema deve estruturar a geração com base em parâmetros, histórico local e no repositório de perguntas recomendadas.
*   **Critérios de Aceite:**
    - A IA gera o roteiro em até 10 segundos seguindo estritamente a estrutura de 5 blocos da ClearIT:
      1. **Check-in humano:** Entender o estado do colaborador e calibrar o tom antes de começar. Deve usar perguntas como: *"Como você está?"* (check-in genuíno, não protocolar) ou *"Como você está se sentindo em relação ao time e ao ambiente?"*.
      2. **Pauta do liderado:** Espaço prioritário para o liderado trazer seus temas (*"O que você quer garantir que a gente aborde hoje?"*).
      3. **Status de entregas e obstáculos:** Remoção de bloqueios por meio de perguntas abertas, como: *"O que está fluindo bem desde a nossa última conversa?"* e *"O que está te travando ou consumindo mais energia?"*. Evitar perguntas de sim ou não e cobrança puramente operacional.
      4. **Desenvolvimento, carreira e feedback:** Foco estratégico (PDI, competências no Framework de Levels, carreira). O prompt deve estimular a IA a propor obrigatoriamente de 1 a 2 perguntas de desenvolvimento específicas (ex: *"Em qual competência você sente que mais evoluiu ultimamente?"*, *"Onde você quer chegar nos próximos 6 meses?"*, *"O que você precisaria para se sentir mais confiante no seu papel?"*, ou *"Tem algum desafio que você gostaria de assumir e ainda não teve a chance?"*).
      5. **Acordos e próximos passos:** Definição clara de combinados, prazos e responsáveis. A IA deve usar a pergunta: *"Como está o progresso dos acordos que fizemos na última reunião?"* e ajudar o líder a consolidar novos acordos com data definida. O bloco de acordos nunca deve ser pulado.
    - **Perguntas de Apoio (Referência):** A IA deve poder recorrer a perguntas adicionais baseadas no guia clássico de 1:1s (https://jasonevanish.com/2014/05/29/101-questions-to-ask-in-1-on-1s/).
    - **Temas Obrigatórios no Roteiro:** O roteiro final gerado deve contemplar obrigatoriamente: bem-estar e energia, status de entregas sem microgestão, remoção de obstáculos, pelo menos 1 ponto de desenvolvimento, revisão de acordos passados e novos acordos com prazo.
    - Antes de gerar, o sistema exibe a pergunta de preparo ao gestor: *"Existe algo que o liderado mencionou que deveria entrar na pauta hoje?"*, incluindo o input como contexto da geração.
    - O prompt enviado à API do Gemini (`gemini-2.5-flash`) utiliza contexto comportamental abstrato e proíbe o envio de PII (dados pessoais sensíveis).
*   **Fora do Escopo:** Edição colaborativa em tempo real entre líder e liderado na mesma tela.

### Feature F-02: Exportar ata da reunião em PDF (Story 2)
*   **User Story:** Como líder, quero exportar a ata da reunião em PDF para compartilhar e registrar oficialmente o encontro.
*   **Contexto:** Ao finalizar o rito de 1:1, gera-se um PDF consolidando check-in, pautas, entregas, impedimentos, PDI e plano de ação.
*   **Critérios de Aceite:**
    - O download do PDF é feito em um único clique após a finalização da reunião.
    - A injeção de dados sensíveis de identificação (nome do líder, liderado e área) ocorre exclusivamente no *front-end* no momento da geração do arquivo final.
    - O PDF gerado não é armazenado na nuvem da aplicação ou trafegado para os servidores da IA.
    - O PDF remove marcações brutas da IA (ex: `--- ATA OFICIAL ---`).
    - A ata contém obrigatoriamente a assinatura do rito e o plano de ação (acordos, datas e responsáveis).
    - Cada download realizado dispara um evento de telemetria para computar a "Taxa de Documentação" do líder.
    - **Pendente:** O sistema deve disponibilizar um gatilho rápido no front-end para que o líder envie a Ata de Alinhamento diretamente ao liderado assim que gerada.
*   **Fora do Escopo:** Assinatura digital com certificados ICP-Brasil; versionamento físico de atas anteriores.

### Feature F-03: Motor de Maturidade & Liga de Líderes (Story 3)
*   **User Story:** Como líder, quero acompanhar minha classificação de maturidade, ver meu posicionamento no ranking individual e por equipes da minha área, e conquistar insígnias de boas práticas para me engajar ativamente nos ritos como ferramentas do meu próprio crescimento e do meu time.
*   **Contexto:** Transforma a rotina burocrática em um ciclo estimulante de autodesenvolvimento de liderança. Classifica o líder em 4 níveis (Iniciante, Em desenvolvimento, Consistente, Referência) baseando-se no acúmulo de XP através de ritos, atas e metas do PDI.
*   **Critérios de Aceite:**
    - O cálculo de maturidade baseia-se nos drivers: Frequência de Ritos, Taxa de Documentação e Engajamento em PDI.
    - **Ranking Bilateral (Liga de Líderes):** O sistema exibe um ranking com duas abas de visualização no frontend:
      - **Aba Individual:** Segmenta e ordena os líderes individuais de acordo com o XP acumulado.
      - **Aba por Equipes (Departamentos):** Exibe o ranking das equipes baseado na **média aritmética de XP** acumulada por todos os líderes ativos de cada respectiva área (ex: Engenharia, Produto, Design), incentivando a cooperação e a responsabilidade compartilhada sem expor notas ou rankings punitivos.
    - **Desafios e Missões Semanais:** O sistema exibe desafios periódicos na dashboard para impulsionar a constância e quebrar o estigma punitivo (ex: *Missão "Reconhecimento Ativo"*: gerar e baixar pelo menos 1 feedback de Reconhecimento no ciclo (+100 XP); *Missão "Foco no Futuro"*: manter todos os PDIs ativos sem atrasos no mês (+150 XP)).
    - **Desafios de Equipe (Bônus Coletivo):** Se todos os líderes de um mesmo departamento mantiverem seus Streaks ativos durante a sprint, a equipe inteira ganha um bônus adicional de +200 XP por membro.
    - **Badges de Conquista de Liderança (Achievements):** Desbloqueio visual de insígnias na dashboard do líder para demonstrar seu crescimento pessoal em gestão:
      - *Badge "Líder Consistente":* Completar ritos quinzenais por 2 meses sem reagendamentos.
      - *Badge "Escuta de Ouro":* Completar 5 roteiros de feedback executando todas as fases de escuta ativa do liderado.
      - *Badge "Parceiro do Desenvolvimento":* Concluir com sucesso o primeiro PDI de um liderado.
    - **Streak (Multiplicador de Consistência):** Manter reuniões na cadência ideal sem adiamentos gera um multiplicador temporário (ex: 1.2x XP acumulado) para manter o hábito estimulante.
    - Exibição de nuggets motivacionais e empáticos inline.
    - Após o download da ata, o líder é automaticamente redirecionado para a tela "Meu Perfil" para visualizar seu ganho de XP, novo ranking e insígnias.
*   **Fora do Escopo:** Recompensas financeiras integradas; badges de competição direta visíveis aos liderados.

### Feature F-04: Dashboard de Métricas do RH (Story 4)
*   **User Story:** Como profissional de RH, quero visualizar indicadores das reuniões 1:1 para acompanhar o engajamento dos líderes.
*   **Contexto:** Painel centralizado do RH consolidando a adoção do rito e a evolução da maturidade na ClearIT.
*   **Critérios de Aceite:**
    - Exibe o número de reuniões concluídas na sprint.
    - Exibe a porcentagem de conformidade de ritos quinzenais/mensais.
    - Exibe a distribuição de maturidade (ex: 20% Referência, 40% Consistente).
    - Permite visualização dos dados consolidados sem exposição direta de anotações privadas de 1:1.
*   **Fora do Escopo:** Exportação de planilhas customizadas; criação de gráficos ad-hoc pelo usuário.

### Feature F-05: Setup de Infraestrutura & APIs (Story 5)
*   **Technical Enabler:** Como equipe de desenvolvimento, necessitamos configurar a infraestrutura básica e conexões de API para sustentar as transações do MVP de forma estável.
*   **Critérios de Aceite:**
    - Banco local CSV (`data/telemetry_logs.csv`) configurado e gravando metadados de telemetria.
    - O log deve conter: Data/Hora, Perfil do Líder, Perfil Comportamental, Senioridade e flag se a Ata em PDF foi baixada.
    - Serviço de IA integrado via API do Gemini (`gemini-2.5-flash`) respondendo com formatação de texto estruturado.
    - Variáveis de ambiente configuradas no arquivo `.env.example`.
*   **Fora do Escopo:** Infraestrutura de alta disponibilidade em produção; logs e monitoramento de carga.

---
 
### Feature F-06: Guia Interativo do Líder (Story 6)
*   **User Story:** Como líder, quero acessar um guia interativo de boas práticas e diretrizes comportamentais diretamente na plataforma para me preparar melhor e conduzir reuniões 1:1 de forma estruturada.
*   **Contexto:** Aba integrada no frontend com suporte metodológico (CRIA), modelos de comunicação (DISC) e perguntas para quebra-gelo, servindo como ferramenta de apoio em tempo real.
*   **Critérios de Aceite:**
    - Acesso direto na barra de navegação da SPA como uma nova aba chamada "Guia do Líder".
    - Explicação interativa da Metodologia CRIA, com exemplo comparativo de "Antes/Depois" para feedbacks.
    - Guia comportamental simplificado contendo orientações práticas para lidar com os 4 perfis básicos (Dominante, Influente, Estável, Analítico).
    - Lista/carrossel interativa com pelo menos 5 perguntas quebra-gelo (icebreakers) prontas para uso.
    - Componentização estilizada e responsiva com Tailwind CSS e Lucide Icons, alinhada ao design premium da plataforma.
*   **Fora do Escopo:** Customização de perfis comportamentais por liderado; persistência ou edição das dicas pelo usuário.

---

### Feature F-07: Gerar Roteiro de Feedback Estruturado (Story 7)
*   **User Story:** Como líder, quero gerar um roteiro de feedback pontual e dirigido a um comportamento específico para reconhecer ou desenvolver um liderado de forma assertiva.
*   **Contexto:** A sessão de feedback é pontual e com propósito único de discutir um comportamento e seu impacto. O sistema deve guiar o líder pelos 4 modelos de feedback (reconhecimento, desenvolvimento, corretivo urgente, feedback em 1:1).
*   **Critérios de Aceite:**
    - A interface permite selecionar o tipo de feedback e solicita que o líder insira a situação, o comportamento observado e o impacto gerado.
    - A IA gera o roteiro de feedback seguindo estritamente as 4 etapas da ClearIT:
      1. **Contexto e intenção:** O gestor esclarece que o objetivo da conversa é desenvolvimento e não punição.
      2. **Escuta ativa (Fase 2 - INEGOCIÁVEL):** O roteiro obriga o gestor a perguntar a perspectiva do liderado antes de expor o feedback (*"Como você está vendo essa situação?"*).
      3. **Feedback estruturado (Modelo SBI):** Situação (quando e onde), Comportamento (fato observado sem julgamento) e Impacto (efeito concreto no time, cliente ou resultado).
      4. **Acordo e próximo passo:** Co-construção do próximo passo com data de revisão definida.
    - A estrutura da Fase 2 (escuta da perspectiva do liderado) é demarcada visualmente de forma inegociável na tela e no roteiro gerado pela IA.
*   **Fora do Escopo:** Armazenamento centralizado na nuvem das notas confidenciais de feedback.

---

### Feature F-08: Motor de Cadência e Alertas de Frequência (Story 8)
*   **User Story:** Como líder, quero receber alertas visuais de cadência baseados no momento e perfil dos meus liderados para manter o ritmo ideal de 1:1 e feedbacks.
*   **Contexto:** O sistema calcula e sinaliza alertas na aba "Meu Squad" com base nas regras de frequência ideal da ClearIT.
*   **Critérios de Aceite:**
    - O sistema monitora a data do último rito no `localStorage` e sinaliza atrasos ou pendências na aba "Meu Squad".
    - Exibe alertas de cadência seguindo as diretrizes de frequência da ClearIT:
      - **1:1 Geral:** Frequência quinzenal ou mensal.
      - **Colaborador Novo (Experiência):** Alertas para ritos específicos nos primeiros 45 dias e nos 90 dias de contratação.
      - **Colaborador em Risco de Desligamento:** Acompanhamento quinzenal obrigatório.
      - **Desenvolvimento/Progresso:** Estímulo bimensal ou trimestral para ritos dedicados ao Framework de Levels e PDI.
    - Os alertas são discretos e motivacionais, integrados ao Radar de Reuniões da interface do usuário.
*   **Fora do Escopo:** Disparo automático de e-mails para o RH notificando atrasos individuais de cadência.

---

### Feature F-09: Integração com MS Teams & E-mail (Story 9)
*   **User Story:** Como liderado, quero receber um convite automático no Microsoft Teams ou e-mail 2 dias antes da minha 1:1 para sugerir meus temas e pautas, e quero que meu líder seja notificado assim que eu escolher para que ele possa se preparar.
*   **Contexto:** Um motor de background em FastAPI dispara Adaptive Cards no Teams ou e-mails transacionais. As respostas alimentam a preparação do rito e disparam notificações de confirmação para o líder.
*   **Critérios de Aceite:**
    - Um agendador local (ex: `APScheduler` no backend FastAPI) roda periodicamente para identificar reuniões que ocorrerão em exatamente 2 dias.
    - Se o canal principal for o Microsoft Teams, o sistema envia uma mensagem automatizada contendo um **Adaptive Card** com campos para seleção de temas (Carreira, Entregas, Clima, etc.) e comentário livre.
    - O liderado preenche e submete os dados de pauta diretamente no Teams. A resposta é capturada por uma rota do backend (*webhook*) e gravada em `data/pautas_liderados.json`.
    - Se o colaborador preferir e-mail (ou em caso de contingência), o sistema envia um e-mail transacional automático com um **Link Mágico** (`/sugerir-pauta?token=...`) que abre uma página simplificada e sem senha na SPA do Smart Leading para preenchimento.
    - Assim que a resposta do liderado for persistida, o sistema envia automaticamente uma mensagem/notificação de confirmação no Microsoft Teams (ou e-mail) do Líder informando que a pauta da 1:1 foi preenchida, exibindo o tema selecionado.
    - When o líder inicia a preparação daquela 1:1 na SPA, o formulário já carrega os inputs do liderado no campo "Tema do Colaborador".
*   **Fora do Escopo:** Integração de chat bidirecional contínuo no Teams; sincronização de chats anteriores.

---

### Feature F-10: PDI Padronizado e Acompanhamento de Prazos (Story 10)
*   **User Story:** Como líder, quero criar e gerenciar um Plano de Desenvolvimento Individual (PDI) padronizado para meu liderado, com metas claras e revisões periódicas de prazos, para garantir consistência e comparabilidade de crescimento.
*   **Contexto:** O PDI segue um modelo único organizacional para garantir consistência entre líderes, liderados e RH. O ciclo padrão de PDI na ClearIT dura exatamente **1 ano (ciclo anual)**.
*   **Critérios de Aceite:**
    - O PDI de cada colaborador é limitado a **no máximo 2 ou 3 objetivos de desenvolvimento** ativos por ciclo.
    - Cada objetivo deve conter obrigatoriamente: Competência (vinculada ao Framework de Levels), Ações Concretas, Prazo, Evidências de Progresso e Suporte do Gestor.
    - O sistema deve estruturar e registrar os entregáveis e planos de ação divididos por períodos específicos: **1 mês, 2 meses, 3 meses e 6 meses**.
    - Permite que o líder faça anotações textuais sobre o andamento de cada etapa e realize ajustes fáceis de rota diretamente na aba "Meu Squad".
*   **Fora do Escopo:** Avaliação de desempenho formal de fim de ano dentro do formulário do PDI.

---

### Feature F-11: Mapeamento de Levels e Âncora de Habilidades (Story 11)
*   **User Story:** Como líder, quero visualizar a matriz de competências (técnicas e comportamentais) do nível atual e do próximo nível do meu liderado para direcionar conversas de 1:1 e PDI sem criar competências fora da matriz.
*   **Contexto:** O Framework de Levels é a **principal âncora** de inteligência artificial do sistema. Os ritos de 1:1 e PDI devem ser sempre referenciados ao perfil de habilidades.
*   **Critérios de Aceite:**
    - O perfil de cada liderado exibe a trilha de carreira, habilidades técnicas e comportamentais atuais.
    - O sistema utiliza a matriz de competências correspondente ao cargo e nível da ClearIT (Júnior, Pleno, Sênior, Especialista) no prompt enviado ao Gemini.
    - O roteiro de 1:1 gerado deve cruzar os gaps atuais com as competências necessárias para a transição para o próximo nível.
*   **Regra de Negócio:** É proibido que o sistema ou o LLM crie competências novas que não façam parte do Framework de Levels oficial da ClearIT.

---

### Feature F-12: Biblioteca Colaborativa de Temas por Área (Story 12)
*   **User Story:** Como líder, quero adicionar temas customizados à pauta de 1:1 e compartilhar essas ideias com outros líderes da mesma área para cocriar melhores práticas de gestão.
*   **Contexto:** Uma biblioteca de temas de pauta compartilhada entre líderes do mesmo setor que estimula a colaboração e a troca de boas práticas.
*   **Critérios de Aceite:**
    - Ao cadastrar um tema extra/customizado em uma pauta de 1:1, o líder pode marcar a opção "Compartilhar com outros líderes da minha área".
    - O sistema grava esse tema em um repositório central no backend (`data/shared_topics.json`), indexando-o pela área de atuação do líder.
    - Quando outros líderes da mesma área vão preparar suas 1:1s, o sistema exibe os temas colaborativos sugeridos por seus pares como opções rápidas de preenchimento.
*   **Regra de Negócio:** A visibilidade dos temas compartilhados é restrita a líderes da mesma área de atuação.

---

### Feature F-13: Compliance Guardrails & RH Analytics (Story 13)
*   **User Story:** Como profissional de RH, quero que o sistema registre metadados operacionais agregados sobre ritos e PDIs para análise estratégica, sem violar a privacidade e confidencialidade dos feedbacks.
*   **Contexto:** Estrutura de People Analytics que consome logs e metadados agregados para monitorar a saúde da liderança e alimentar o primeiro Comitê de Calibração (previsto para Outubro-Dezembro).
*   **Critérios de Aceite:**
    - **Registro Seguro:** O sistema grava no banco local de telemetria apenas: data, duração, temas abordados, flags de feedbacks no modelo SBI, acordos, responsáveis e prazos.
    - **Isolamento de PII na IA (Privacy by Design):** É expressamente proibido enviar dados pessoais identificáveis (nomes reais, CPF, etc.) nos prompts enviados à API do Gemini. A interação com a IA utiliza termos comportamentais e abstratos.
    - **Tratamento de Dados Locais:** O sistema pode armazenar e utilizar nome e e-mail corporativo dos líderes e liderados na base local de dados (localStorage/JSON) apenas para viabilizar as notificações automáticas do MS Teams e o funcionamento da interface.
    - O painel de RH Analytics exibe gráficos consolidados agregados pelas **10 áreas oficiais da empresa**, cruzando os dados de frequência ideal para as rodadas da Avaliação de Desempenho (AvD) que iniciará em Setembro.
*   **Fora do Escopo:** Registro de anotações privadas, conversas íntimas, julgamentos ou opiniões subjetivas de 1:1 no log do servidor.

---

### Feature F-14: Fluxo de Assinatura Bilateral (Sign-off) (Story 14)
*   **User Story:** Como liderado, quero visualizar de forma transparente a ata consolidada das minhas 1:1s e registrar meu "Aceite" nos acordos firmados, para eliminar o efeito caixa-preta e garantir o alinhamento de expectativas.
*   **Contexto:** Quebra a assimetria de informações e o "Efeito Caixa-Preta" dando visibilidade direta e online do que foi acordado ao colaborador.
*   **Critérios de Aceite:**
    - Ao finalizar a reunião, o sistema envia automaticamente a Ata em PDF para o Teams ou e-mail do liderado.
    - O liderado tem acesso a um painel simples e seguro na plataforma contendo o histórico de suas atas e a lista de seus acordos pendentes.
    - O liderado pode clicar em um botão **"Confirmar Acordo" (Sign-off)** em cada ata, atestando o alinhamento mútuo e a transparência do rito.
    - O status da assinatura bilateral é exibido no painel do líder e computado para métricas de governança.
*   **Fora do Escopo:** Fluxo de assinatura digital com certificados externos (ex: ICP-Brasil).

---

### Feature F-15: Termômetro de Segurança Psicológica Pré-Reunião (Story 15)
*   **User Story:** Como líder, quero saber o estado emocional/energia do meu liderado antes da 1:1 para calibrar minha abordagem, garantir a segurança psicológica e conduzir a reunião de forma humana.
*   **Contexto:** Um termômetro preventivo de clima integrado à pauta que adapta a experiência e a postura da liderança antes do início da conversa.
*   **Critérios de Aceite:**
    - O Adaptive Card enviado ao Teams (ou o Link Mágico no e-mail) 2 dias antes (F-09) includes uma escala simples de emojis para o liderado indicar seu nível de humor/energia (ex: Energizado, Estável, Sobrecarregado, Estressado).
    - A resposta do liderado é exibida de forma destacada no painel de preparação do líder.
    - Se o colaborador sinalizar "Sobrecarregado" ou "Estressado", o sistema dispara um nugget contextual na tela de preparação do gestor e adapta dinamicamente o prompt do Gemini para priorizar escuta empática e suporte, ativando caminhos de acolhimento.
*   **Fora do Escopo:** Compartilhamento individual de avaliações psicológicas detalhadas; acompanhamento clínico.

---

### Feature F-16: Painel do Liderado & Trilha de Habilidades (Story 16)
*   **User Story:** Como liderado, quero ter um espaço centralizado para visualizar minhas conquistas, a evolução das minhas habilidades conforme o Framework de Levels e o progresso do meu PDI e acordos, para acompanhar meu desenvolvimento de forma autônoma e transparente.
*   **Contexto:** Essa funcionalidade adiciona uma alternância de perfil (Líder vs. Liderado) na barra de navegação superior da SPA. Ao selecionar a visão de liderado, a interface exibe as conquistas dele, sua trilha de levels correspondente e o progresso de seus combinados/PDI ativos.
*   **Critérios de Aceite:**
    - O menu do header permite alternar de forma transparente entre "Visão: Líder" e "Visão: Liderado" para alternar o escopo da SPA localmente.
    - O painel do liderado exibe um cabeçalho personalizado com o nome, cargo e nível do colaborador logado.
    - Exibição das insígnias (badges) conquistadas e pendentes (ex: *Alinhamento Perfeito*, *Protagonista do PDI*, *Voz Ativa*).
    - Exibição visual e direta das competências do Framework de Levels vinculadas ao nível atual e as necessárias para promoção ao próximo nível, destacando quais estão ativas sob o PDI.
    - Listagem de acordos das atas de 1:1 e das ações de PDI ativas no ciclo com status visual e de progresso.
*   **Regras de Negócio:**
    - O isolamento dos dados de atas e PDIs deve garantir que o colaborador visualize apenas suas próprias informações, respeitando as regras de privacidade (No-PII nos servidores externos e acesso restrito no front-end).
    - A troca de visão simula a alternância de perfis usando o estado local da aplicação (React/localStorage) sem requisições de controle de acesso complexo nesta fase de MVP.
*   **Fora do Escopo:** Controle de permissões e autenticação avançada (Active Directory / OAuth) para liderados nesta fase de MVP; edição de PDIs e atas pelo próprio liderado (apenas leitura e aceite).

---

## 5. Contexto Organizacional de Referência (ClearIT)
*   **Áreas Cadastradas (10 áreas):** Diretoria, RH, Financeiro, Comercial, Pré-vendas, Pós-vendas, Alianças e Parcerias, Licitações e Contratos, Precificação e Suprimentos, e Marketing.
*   **Headcount de Referência (Total 68 colaboradores):**
    - Diretoria: 6 | Comercial: 16 | Pré-vendas: 5 | Pós-vendas: 20 | Alianças e Parcerias: 4 | Contratos e Licitações: 2 | Precificação e Suprimentos: 3 | Financeiro: 6 | RH: 4 | Marketing: 2.
*   **Mapeamento de Maturidade Cultural:** A ClearIT possui uma cultura de feedback implantada há 5 meses baseada em treinamentos das lideranças. O primeiro Comitê de Calibração ocorrerá entre Outubro e Dezembro, e a primeira rodada da AvD anual iniciará em Setembro de 2026.

