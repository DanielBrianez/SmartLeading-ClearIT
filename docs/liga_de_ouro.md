# 🏆 Liga de Ouro - Motor de Maturidade e Gamificação

Para incentivar a adoção do sistema e garantir a constância nas reuniões de 1:1, o **Smart Leading** conta com um ecossistema gamificado avançado chamado **Liga de Ouro**.

O objetivo transcende a simples competição: trata-se de um Motor de Maturidade que dá visibilidade, classifica e reconhece os gestores que mantêm uma rotina saudável e documentada de desenvolvimento contínuo de seus liderados.

---

## 1. Como Funciona a Pontuação (XP) e os 3 Drivers

A evolução no ranking é ditada pelo acúmulo de **XP (Experience Points)**, mas a visibilidade do gestor é pautada em três *drivers* reais de engajamento:

*   **Atas Baixadas (Driver Principal):** O líder recebe **+100 XP** a cada Ata de 1:1 oficialmente gerada, assinada digitalmente e baixada (PDF) no sistema. 
*   **Ritos Realizados:** Contagem automática do volume de sessões de acompanhamento estruturadas pela IA.
*   **PDIs Ativos:** Mapeamento de engajamento na aba "Meu Squad" através do acompanhamento de Planos de Desenvolvimento Individual.

## 2. Motor de Maturidade (Níveis)

Em vez de focar apenas em quem está no topo, o sistema classifica automaticamente o momento de carreira de cada líder através de *badges* dinâmicas, baseadas no acúmulo histórico de XP:

*   🌱 **Iniciante:** 0 a 199 XP (Dando os primeiros passos na rotina de feedback).
*   📘 **Em Desenvolvimento:** 200 a 499 XP (Criando cadência de alinhamentos).
*   🚀 **Consistente:** 500 a 799 XP (Líder focado em estrutura e constância).
*   👑 **Referência:** 800+ XP (Gestor de alto impacto, multiplicador de cultura).

## 3. Dinâmica de Ranking, Filtros e Desempate

O painel de classificação é atualizado em tempo real e possui inteligência analítica embutida:

*   **Filtro por Área de Atuação:** Permite visualizar líderes globais ou isolar o ranking por setores específicos (Ex: Engenharia, Produto, Design).
*   **Regra de Desempate Automático:** Caso dois líderes possuam o mesmo XP, o sistema desempata posicionando acima o gestor que possuir a **maior taxa de Atas geradas**.
*   **Títulos Honoríficos (Visão Global):** Os três primeiros colocados no ranking geral recebem destaque visual com medalhas exclusivas:
    *   🥇 1º Lugar - **Titã das 1:1s** (Destaque visual em Amber-500)
    *   🥈 2º Lugar - **Líder de Impacto**
    *   🥉 3º Lugar - **Gestor Engajado**

## 4. Arquitetura e Armazenamento (Local Storage)

Garantindo alta performance e conformidade com a LGPD, a pontuação da *Liga de Ouro* é mantida de forma descentralizada na chave `@clearit-ranking` dentro do `localStorage` do navegador.

- Este design permite que o ranking reaja em milissegundos às ações do usuário.
- Os dados desse cofre local alimentam diretamente a aba **Painel do RH (People Analytics)**, onde os resultados gamificados se transformam em gráficos de adoção, taxa de retenção e eNPS para a tomada de decisão da diretoria.