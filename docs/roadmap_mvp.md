# 🗺️ Roadmap do Produto - Smart Leading (Clear IT)

Este documento traça a visão de evolução do produto, desde a fundação (MVP) até à sua integração total no ecossistema corporativo da empresa.

## 🚀 Fase 1: MVP (Fundação e Validação) - *Concluído*
O objetivo desta fase foi validar o conceito principal, garantindo a geração de valor imediato com o menor esforço de desenvolvimento possível.
- [x] Estruturação da arquitetura moderna de arquivos (*Clean Code* com React + Python/FastAPI).
- [x] Integração com a API do Google Gemini (Motor de Inteligência Artificial).
- [x] Criação do Mega-Prompt com foco na adaptação comportamental do líder e liderado (Metodologia CRIA).
- [x] Geração de Ata Oficial em PDF (*html2pdf.js*) com formatação visual avançada no front-end.
- [x] Conformidade total com a LGPD (*Privacy by Design* com anonimização ativa e dados processados localmente).

## 🎨 Fase 2: UI/UX e Gestão Inteligente (Aceleração) - *Concluído*
Foco na construção de uma interface *premium*, redução da carga cognitiva do líder e recolha de telemetria baseada no navegador.
- [x] Interface de alto nível com Tailwind CSS (Suporte a *Dark Mode*, navegação fluida, *Modals Backdrop Blur* e *Toasts* de aviso).
- [x] Implementação de sistema de *Telemetria Local* (*LocalStorage*) para rastreio em tempo real de PDIs, Atas, Acordos e XP.
- [x] Refinamento das regras do motor de Gamificação (Liga de Ouro, cálculo automático de XP por geração de ata e níveis de liderança).
- [x] Construção do **Radar de Atenção** (Dashboard proativo com alertas de atrasos e expiração de PDIs em linguagem natural).
- [x] Implementação de **Travas de Produtividade** (Limite estrutural de 3 PDIs e 3 Acordos simultâneos, garantindo foco no essencial).

## 📊 Fase 3: Portal de *People Analytics* (Painel de RH) - *Concluído*
Expansão do produto para atender aos gestores de Recursos Humanos, cruzando os dados da telemetria de forma visual.
- [x] Criação de um dashboard gerencial isolado para a equipa de RH.
- [x] Leitura inteligente e formatação visual dos *logs* guardados na Fase 2.
- [x] Geração de gráficos atualizados em tempo real (ex.: Engajamento por perfil de liderança, funil de conclusão de tarefas, Radar de Competências Dinâmico).
- [x] Sistema *Dev Tools* embutido para autoinjeção e higienização de base de dados para testes em demonstrações.

## 🔌 Fase 4: Integrações Corporativas (Escala) - *Futuro*
Avançar o produto para o ecossistema na Nuvem e integrar diretamente nas ferramentas de comunicação que a equipa já utiliza diariamente.
- [ ] Integração de notificações reais através de *Webhooks* para o Slack ou Microsoft Teams.
- [ ] Integração com a API do Google Calendar / Outlook para sincronização bidirecional e leitura automática da agenda de 1:1s.
- [ ] Migração da base de dados local para uma arquitetura Cloud (ex.: PostgreSQL / MongoDB) com criptografia ponta a ponta.
- [ ] Envio automático (e opcional) da Ata em PDF para o software central de gestão de talentos do RH.