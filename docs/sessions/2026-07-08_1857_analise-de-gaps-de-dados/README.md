# Análise de Gaps de Dados — 2026-07-08

## 🎯 Objetivo
Analisar linha a linha os requisitos de dados descritos no arquivo `Dados para a aplicação.md` e confrontar com o estado atual de implementação do frontend e backend do SmartLeading, mapeando as divergências existentes e as oportunidades de melhoria.

---

## 📊 Relatório de Divergências: Requisitos vs. Implementação (SmartLeading - Clear IT)

Este relatório apresenta uma análise detalhada, linha a linha, confrontando os requisitos de dados descritos no arquivo [Dados para a aplicação.md](file:///c:/Users/Pulse%20Mais/Downloads/Dados%20para%20a%20aplica%C3%A7%C3%A3o.md) com a implementação atual presente no **Frontend** (código React/Vite) e no **Backend** (FastAPI) da aplicação.

### 1. Mapeamento Geral de Arquitetura (Gargalo de Dados)

> [!IMPORTANT]
> **Divergência Sistêmica de Persistência:**
> O **Backend** (`backend/app/main.py`) é completamente *stateless* (sem estado). Ele não possui banco de dados persistente centralizado para armazenar informações críticas.
> Atualmente, todo o armazenamento é feito via **`localStorage` do navegador do usuário** com criptografia/firewall básico no Frontend (`frontend/src/utils/security.js`).
>
> **Impacto:** Se o Líder, o Liderado ou o RH acessarem a plataforma de computadores ou navegadores diferentes, **nenhum dado será compartilhado**. O RH não conseguirá ver dados consolidados reais da empresa, apenas dados mockados estáticos (armazenados em `frontend/src/dados.js`) e as poucas atas/ações salvas no navegador local do gestor de RH.

---

### 2. Análise Detalhada por Perfil de Usuário

#### 👤 2.1. Dados para o Líder

##### 📅 No 1:1 — Antes da Reunião
| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Pauta do liderado** | **Implementado** | Nenhuma | Obtido do `localStorage` sob a chave `@clearit-pauta-previa-${liderado.id}`. |
| **Como ele está se sentindo antes da reunião** | **Implementado** | Nenhuma | Obtido do `localStorage` sob a chave `@clearit-momento-${liderado.id}`. |
| **Histórico da última conversa** | **Não Implementado na View de Reunião** | Divergência de UX / Acesso a Dados | Embora o backend envie o histórico de atas e PDIs para a IA preencher a pauta, o líder **não visualiza** o histórico das últimas atas diretamente na tela de preparação de 1:1 (`Meus1a1.jsx`). Ele precisa ir até a tela "Meu Squad", abrir o modal do liderado e consultar lá. |
| **Status das entregas e projetos em curso** | **Conforme / Informativo** | Nenhuma | O líder não necessita ver o status dos projetos integrados em tela de forma automática, apenas de um lembrete em pauta de que o assunto deve ser abordado (o que é contemplado na estrutura e orientação do Roteiro e da Ata). |
| **Posição no Framework de Levels e progresso de desenvolvimento** | **Não Implementado na View de Reunião** | Divergência de Informação | A view `Meus1a1.jsx` exibe apenas o rótulo de senioridade (Júnior, Pleno, Sênior, Especialista). O radar de competências de levels e o progresso detalhado de desenvolvimento do liderado não são exibidos na preparação do 1:1 (apenas no modal do "Meu Squad"). |
| **Roteiro preenchido pela IA com espaço para anotações** | **Parcialmente Implementado** | Melhoria de UX / Oportunidade | O roteiro da IA é exibido em Markdown estático. Não há espaço para anotações dinâmicas pelo líder na mesma tela durante a reunião. (Ver recomendação de fluxo de rascunho de condução na Seção 5). |

##### 📅 No 1:1 — Durante a Reunião
| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Roteiro da IA com espaço para anotações dos blocos:** (Check-in humano, Pauta do liderado, Status de entregas/obstáculos, Desenvolvimento/carreira, Acordos/próximos passos, Outros pontos) | **Parcialmente Implementado** | Divergência de UX / Interatividade | O roteiro confidencial retornado pela IA é renderizado em HTML estático via `ReactMarkdown` na aba "Roteiro Confidencial" (`Meus1a1.jsx`). O líder não consegue editar ou salvar anotações específicas em cada um dos blocos propostos de forma individual. |

##### 📅 No 1:1 — Depois da Reunião
| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Roteiro preenchido e salvo** | **Conforme / Design de Privacidade** | Nenhuma | A IA gera o Roteiro (base de mentoria focada no Líder) e a Ata (base formal para o Liderado/RH) a partir do mesmo contexto. O Roteiro é de uso exclusivo do gestor durante a conversa e, por regras de privacidade e confidencialidade (Mega-Prompt), não deve ser compartilhado ou armazenado permanentemente no histórico público. Apenas a Ata Oficial contendo as decisões e acordos é salva. |
| **Ata com os acordos** | **Implementado** | Nenhuma | A ata é salva na chave `@clearit-atas-squad` e pode ser baixada como PDF. |

---

#### 👥 2.2. Meu Time (Gestão do Squad)

| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Perfil no DISC** | **Não Implementado** | Ausência Crítica de Dado | O Perfil Comportamental DISC não é coletado em nenhuma tela e não consta nos schemas de liderados. |
| **Nome** | **Implementado** | Nenhuma | Exibido na listagem e perfil do time. |
| **Cargo e Senioridade** | **Implementado** | Nenhuma | Exibido no perfil e nos cartões de squad. |
| **PDI da pessoa dos 6 meses (Objetivo de Carreira, Acordos, Missões/Tasks e datas)** | **Implementado** | Nenhuma | Gerenciado dinamicamente no modal do colaborador (aba "Plano de Desenvolvimento"). |
| **Atas por ordem de mais recente para mais antigas prontas para download** | **Implementado** | Nenhuma | Salvas e listadas em ordem decrescente de data no histórico de atas do modal. |
| **Anotações pessoais do líder sobre o liderado** | **Não Implementado** | Ausência de Funcionalidade | Não há nenhum campo de texto persistente no perfil do liderado para o líder salvar anotações privadas, lembretes ou notas de acompanhamento pessoal fora das atas oficiais. |

---

#### 📖 2.3. Playbook — Caminho do Líder

> [!WARNING]
> A view `Playbook.jsx` é a que apresenta o maior volume de divergências. Todos os dados e mídias presentes na tela são simulações (mocks de demonstração) e os requisitos formais de conteúdo estão ausentes.

| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Resumo de comunicação efetiva** | **Não Implementado** | Conteúdo Ausente | Não há nenhum material ou texto implementado sobre comunicação efetiva. |
| **Roteiro de 1:1 (PRIORIDADE)** | **Não Implementado** | Conteúdo Ausente | O card "O Guia Definitivo da 1:1" é um placeholder vazio que exibe um aviso de simulação ao ser aberto. |
| **Tipos de feedback (PRIORIDADE)** | **Não Implementado** | Conteúdo Ausente | O card "Feedback Corretivo sem causar Burnout" é um placeholder sem texto instrucional ou vídeo real. |
| **Guia para um bom 1:1** | **Não Implementado** | Conteúdo Ausente | Não há materiais didáticos com o guia real implementado. |
| **Frases para não dizer** | **Não Implementado** | Conteúdo Ausente | Conteúdo ausente no código. |
| **Frases para dizer** | **Não Implementado** | Conteúdo Ausente | Conteúdo ausente no código. |
| **Link para o artigo "100 frases para perguntar em uma 1:1"** | **Não Implementado** | Conteúdo Ausente | Não existe nenhum hiperlink ou referência a esse artigo na tela do Playbook. |

---

#### 🏆 2.4. Liga de Ouro (Gamificação)

| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Meu nível de acordo com o RH** | **Implementado** | Nenhuma | Mostra o nível (patente baseada no XP) de acordo com as faixas configuradas no frontend. |
| **Ranking das áreas da empresa com nome do líder e equipe** | **Parcialmente Implementado** | Divergência de UX / Regra de Negócio | O ranking (`Ranking.jsx`) é **estritamente individual dos líderes**. Ele não agrupa dados para exibir um ranking de *áreas* comparadas nem detalha a composição ou os nomes da equipe no próprio ranking. |
| **Missões** | **Não Implementado** | Ausência de Funcionalidade | A tela de ranking não exibe nenhuma missão ativa para ser cumprida, apenas métricas passivas (ritos e atas geradas). |
| **Medalhas** | **Não Implementado** | Ausência de Funcionalidade | Não há sistema de *badging* (medalhas conquistadas por marcos atingidos) implementado na UI ou nos dados. |

---

### 3. Dados do Liderado

A página do Liderado (`HomeLiderado.jsx`) foca no autoatendimento, mas possui falhas importantes na consulta de histórico.

| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **O que vai ser tratado na reunião** | **Implementado** | Nenhuma | Sincronizado através do campo "Tema / Pauta sugerida para a 1:1". |
| **PDI completo dos próximos 6 meses** | **Implementado** | Nenhuma | Visualiza seu objetivo de carreira, focos e plano de ação dinâmico. |
| **Últimos acordos** | **Implementado** | Nenhuma | Exibidos na seção "Acordos e Missões (Tasks)". |
| **Atas** | **Não Implementado** | Ausência de Acesso a Dados | **O liderado não possui um histórico de atas passadas para consulta.** O único momento em que ele vê uma ata é no formulário de feedback de reuniões pendentes. Após avaliar a ata, ela some de sua tela e ele não tem onde consultá-la ou baixá-la novamente. |
| **Radar de Competências de acordo com o Levels** | **Implementado** | Nenhuma | Renderizado graficamente com base nas metas e PDIs entregues. |
| **Minha próxima reunião** | **Implementado** | Nenhuma | Exibe a data da próxima reunião planejada. |
| **Acordos** | **Implementado** | Nenhuma | Lista de tarefas ativas e seus status. |

---

### 4. Dados do RH (Recursos Humanos)

As telas do RH (`HomeRH.jsx` e `PainelRH.jsx`) oferecem uma visão geral dos liderados, mas não cumprem com as exigências estruturais de mapeamento organizacional.

| Dado Requisitado no Relatório | Status de Implementação | Tipo de Divergência | Detalhes Técnicos e Impacto |
| :--- | :---: | :---: | :--- |
| **Padrão de temas do levels por área — o que os times estão sentindo** | **Não Implementado** | Ausência de Agregação de IA | O RH visualiza dados de eNPS de forma genérica e a taxa de adoção por área (Engenharia, Produto, Design). No entanto, **não há consolidação dos temas debatidos nos PDIs ou reuniões por área** (ex: o RH não sabe se Engenharia está focando mais em "Hard Skills" ou se Produto está discutindo mais "Comunicação"). |
| **Perfil de maturidade de cada líder como gestor de pessoas** | **Não Implementado** | Ausência de Métrica | A plataforma lista apenas a "Liderança em Risco" com base na quantidade de 1:1s em atraso. Ela não mapeia a maturidade de gestão do líder. |
| **Lacunas sistêmicas no Framework de Levels** | **Não Implementado** | Ausência de People Analytics | Não há gráficos ou relatórios mostrando o progresso médio das competências organizacionais. O RH não tem visibilidade para saber em quais das 8 competências fundamentais da Clear IT a empresa apresenta lacunas. |

---

### 5. Resumo das Principais Ações de Ajuste Necessárias

Para alinhar completamente o frontend e backend com o documento de requisitos, a equipe de desenvolvimento precisará planejar as seguintes tarefas:

1. **Centralização de Dados:** Implementar um banco de dados no backend e migrar os dados das atas, PDIs e tasks do `localStorage` para a API.
2. **Integração DISC:** Adicionar o campo "Perfil DISC" no cadastro de colaboradores e exibi-lo no perfil do time no Líder.
3. **Histórico de Atas do Liderado:** Criar uma aba ou tela de histórico de atas assinadas/concluídas no portal do Liderado.
4. **Área de Anotações do Líder:** Inserir um campo de anotações privadas no perfil do liderado dentro da gestão do squad.
5. **Carga Real de Playbook:** Substituir os placeholders do Playbook pelos textos reais de comunicação, roteiro de 1:1, tipos de feedback e inserir o link externo.
6. **Mapeamento de Lacunas para o RH:** Criar agrupadores analíticos no backend para fornecer ao RH a média de proficiência das competências do Framework de Levels por área e as principais lacunas.
7. **Gamificação Completa:** Adicionar um painel de Missões ativas e Medalhas (badges conquistados) na Liga de Ouro.
8. **Roteiro de Mentoria Interativo (Rascunho de Condução):** Criar blocos de entrada de texto editáveis para o líder no roteiro confidencial gerado. Durante a 1:1, o líder insere notas rápidas informais. Ao finalizar, o sistema envia essas anotações locais como contexto para a IA gerar a **Ata Oficial** formatada, formal e impessoal, destruindo os rascunhos de anotação após o encerramento do ciclo. Isso preserva a privacidade corporativa (os rascunhos informais do líder não vão para o RH ou Liderado) e poupa tempo do gestor.

---

## 🔗 Links Relacionados
- [Especificação de Dados Origem (Downloads)](file:///c:/Users/Pulse%20Mais/Downloads/Dados%20para%20a%20aplica%C3%A7%C3%A3o.md)
- [Framework Mega-Prompt (AGENTS.md)](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/.agents/AGENTS.md)
- [FastAPI Main Backend Entrypoint](file:///c:/Users/Pulse%20Mais/24+1/SmartLeading-ClearIT/backend/app/main.py)

## ⏱️ Tempo Investido
- 1.5 horas
