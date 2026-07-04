# 🗺️ Roadmap do Produto - Assistente de Liderança Clear IT

Este documento traça a visão de evolução do produto, desde a fundação (MVP) até à sua integração total no ecossistema corporativo da empresa.

## 🚀 Fase 1: MVP (Fundação e Validação) - *Concluído*
O objetivo desta fase foi validar o conceito principal, garantindo a geração de valor imediato com o menor esforço de desenvolvimento possível.
- [x] Estruturação da arquitetura de ficheiros (*Clean Code*).
- [x] Integração com a API do Google Gemini (Motor de Inteligência Artificial).
- [x] Criação do Mega-Prompt com foco na adaptação comportamental do líder e liderado.
- [x] Geração de Ata Oficial em PDF via frontend (*html2pdf.js*) com privacidade e injeção local de dados.
- [x] Conformidade total com a LGPD (*Privacy by Design* / Tokenização local).

## 🎨 Fase 2: UI/UX e Telemetria (Ajustes Finos) - *Em Progresso*
Foco na melhoria da experiência do utilizador (líderes) e na recolha de métricas silenciosas para o departamento de Recursos Humanos.
- [x] Melhoria visual da interface em React/Vite (Customização visual, cores da marca e logótipo).
- [x] Implementação de sistema de telemetria integrada via banco de dados **PostgreSQL Serverless** (com suporte inicial a `.csv` local) para rastreio de perfis de liderança e volumes de uso.
- [x] Implementação das regras do motor de Gamificação e classificação da Liga de Líderes com **Validação Bilateral** de XP entre líder e liderado.

## 📊 Fase 3: Portal de *People Analytics* (Painel de RH) - *Em Planeamento*
Expansão do produto para atender também aos gestores de Recursos Humanos, dando visibilidade aos dados recolhidos.
- [x] Criação de um segundo ecrã (Dashboard restrito para RH).
- [ ] Leitura e formatação visual dos *logs* guardados na Fase 2.
- [x] Geração de gráficos (ex.: percentagem de uso por perfil de liderança, frequência de reuniões 1:1 na empresa).

## 🔌 Fase 4: Integrações Corporativas (Escala) - *Futuro*
Integrar o Assistente de Liderança diretamente nas ferramentas de comunicação que a equipa já utiliza diariamente.
- [x] Integração de notificações de Missões/XP através de *Webhooks* para o Slack ou Microsoft Teams.
- [x] Integração com a API do Google Calendar / Outlook para leitura automática da agenda de 1:1s e preparação prévia.
- [ ] Envio automático (e opcional) da Ata de PDF encriptada para a base de dados central do RH.