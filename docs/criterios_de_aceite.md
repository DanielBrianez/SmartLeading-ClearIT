# ✅ Critérios de Aceite (Acceptance Criteria) - MVP Clear IT
**Status Atualizado:** Em Desenvolvimento (Tracking de MVP)

Este documento rastreia os requisitos técnicos e de negócio definidos para que a versão inicial (MVP) do Assistente de Liderança seja considerada "Pronta" (Done).

---

## 1. Personalização e Segurança (LGPD)
- [x] **✅ Cumprido:** Gerar roteiro de 1:1 adaptado dinamicamente aos perfis de liderança e contexto comportamental.
- [x] **✅ Cumprido:** Comunicação com a IA processada utilizando estritamente contexto comportamental.
- [x] **✅ Cumprido:** Proibição de inserção de dados sensíveis no prompt enviado ao LLM (Privacy by Design).
- [⚠️] **Parcial:** Alimentar um front-end com banco de dados com o nome do liderado (Implementado via Mock local estático, pendente integração com BD real).
- [ ] **Pendente:** Modificação da ata para enviar exclusivamente para o RH com dados para o ciclo de calibração de performance.

## 2. Geração da Ata Oficial (Governança)
- [x] **✅ Cumprido:** Permitir a geração e o download de uma "Ata de Alinhamento" no formato PDF diretamente pelo navegador.
- [x] **✅ Cumprido:** Injeção de dados sensíveis de identificação ocorrendo exclusivamente no front-end.
- [x] **✅ Cumprido:** PDF gerado não é armazenado na nuvem e nem trafegado para os servidores da IA.
- [ ] **Pendente:** Gatilho rápido no front-end para enviar a Ata ao liderado (ex: cliente de e-mail ou cópia de link).
- [ ] **Pendente:** Telemetria registrar evento anônimo ao acionar a ação "Compartilhar Ata com Liderado" (Taxa de Documentação).

## 3. Motor de Gamificação
- [x] **✅ Cumprido:** Métrica de progressão em XP atrelada ao esforço recente (100 XP por Ata baixada).
- [⚠️] **Parcial:** Reconhecimento/Badges visíveis na interface (Implementados no Ranking Geral, mas não atrelados à pauta específica da reunião).
- [ ] **Pendente:** Gerar obrigatoriamente uma “frase motivadora” personalizada via IA no roteiro.
- [ ] **Pendente:** Gerar uma "Missão" clara e acionável para a próxima quinzena dentro do roteiro da IA.

## 4. Jornada em Tela Única (UX e Engajamento)
- [x] **✅ Cumprido:** Fluxo completo do usuário ocorrendo em uma única página contínua (SPA - React).
- [x] **✅ Cumprido:** Sistema não exige navegação para telas secundárias ou abas externas para operar a ferramenta.
- [ ] **Pendente:** Direcionamento automático para a dashboard “Meu perfil” (ou Ranking) logo após a finalização/download da ata.

## 5. Captura de Telemetria (Logs Ocultos)
- [x] **✅ Cumprido:** Registro silencioso em arquivo de log local (`.csv`) contendo metadados estratégicos (Data, Perfis, Senioridade, Download efetuado).
- [x] **✅ Cumprido:** Proibição estrutural de salvar o conteúdo textual das atas no servidor.
- [ ] **Pendente:** Colocar o RH em cópia oculta nos e-mails gerados.
- [ ] **Pendente:** Botão explícito de "Compartilhar Ata" e cópia de sumário pós-geração.
- [ ] **Pendente:** Evento anônimo (`flag_compartilhado = true`) registrado na telemetria ao acionar compartilhamento.
- [ ] **Pendente:** Telemetria para capturar se o líder aceitou ou concluiu as "missões" geradas.
- [ ] **Pendente:** Fluxo de avaliação para o Liderado ("Essa reunião foi útil?") para medir a Relevância Percebida.

---

**Resumo das Próximas Ações (Next Steps):**
1. Implementar botão "Compartilhar Ata" com rotina de `mailto:` abrindo o cliente de e-mail (colocando RH em cópia e anexando resumo).
2. Atualizar o script Python (`main.py`) para capturar eventos de compartilhamento no Log CSV.
3. Atualizar o `gemini.py` para injetar instruções de gamificação (Frase Motivadora + Missão) na saída do LLM.
4. Adicionar redirecionamento automático via React Router ou mudança de estado do `activeTab` ao disparar o download.