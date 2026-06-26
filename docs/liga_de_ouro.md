# 🏆 Liga de Ouro - Sistema de Gamificação

Para incentivar a adoção do sistema e garantir a constância nas reuniões de 1:1 (One-on-One), o **Smart Leading** conta com um ecossistema gamificado interno chamado **Liga de Ouro - Liderança**.

O objetivo não é criar competição tóxica, mas sim dar visibilidade e reconhecer os gestores que mantêm uma rotina saudável de acompanhamento e desenvolvimento contínuo de seus liderados.

## 1. Como Funciona a Pontuação (XP)

A moeda de engajamento do sistema é o **XP (Experience Points)**. 

- **Recompensa Padrão:** O líder recebe **+100 XP** a cada Ata de 1:1 oficialmente gerada e baixada (PDF).
- **Validação:** O XP só é contabilizado no momento em que o gestor assina digitalmente a tela (selecionando seu nome e o do liderado) e realiza o download. Apenas gerar o roteiro na IA não confere pontos, garantindo que o acompanhamento foi de fato formalizado.

## 2. Ranking e Títulos (Badges)

O sistema conta com um painel de classificação dinâmico atualizado em tempo real. Os três gestores com o maior nível de engajamento na plataforma recebem destaque visual e títulos honoríficos exclusivos:

* 🥇 **1º Lugar - 👑 Titã das 1:1s:** O líder absoluto em engajamento e constância na gestão de pessoas. Visual destacado em dourado (Amber-500).
* 🥈 **2º Lugar - 🚀 Líder de Impacto:** Gestor com alta cadência de acompanhamento estratégico.
* 🥉 **3º Lugar - ⭐ Gestor Engajado:** Destaque em desenvolvimento contínuo da equipe.

## 3. Armazenamento da Pontuação (Local Storage)
Por se tratar da versão V2 com arquitetura de alta velocidade, a pontuação da *Liga de Ouro* é mantida de forma descentralizada na chave `@clearit-ranking` dentro do `localStorage` do navegador.

- Isso permite que o ranking funcione em tempo real sem sobrecarregar chamadas de banco de dados.
- O histórico de engajamento bruto e seguro (Single Source of Truth) fica registrado nos logs do servidor (`logs/smart_leading_logs.csv`), de onde os dados podem ser exportados mensalmente para o RH via dashboards de Business Intelligence (PowerBI/Metabase) para premiar os vencedores oficiais de cada ciclo.