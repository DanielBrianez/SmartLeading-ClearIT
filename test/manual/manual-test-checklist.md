# Checklist de Testes Manuais - Smart Leading V2

## 1. Fluxo de Login
- [x] Login com usuário líder funciona
  > ✅ Sucesso: modo login Líder funciona, sem erro.

- [x] Login com usuário liderado funciona
  > ✅ Sucesso: modo login Liderado funciona, sem erro.

- [x] Login com usuário RH funciona
  > ✅ Sucesso: modo login RH funciona, sem erro.

- [x] Tela de erro/sem sessão é tratada corretamente
  > ✅ Sucesso: Ao colocar e-mail/senha incorretamente, aparece de erro: "E-mail ou senha inválidos".

## 2. Fluxo de 1:1
- [x] O líder consegue selecionar um liderado
  > ✅ Sucesso: Funcionou conforme esperado.

- [x] O campo de entregas aceita texto livre
  > ✅ Sucesso: Funcionou conforme esperado.

- [ ] A geração de roteiro exibe mensagem de sucesso ou erro clara
  > ✅ Parcial: Funcionou conforme esperado, o roteiro aparece na tela após "A IA está analisando o perfil..." (entendo que serve como confirmação visual).
  > ❌ Erro: quando a API falha de verdade, a tela fica travada em "Roteiro em processamento..." indefinidamente, sem avisar o usuário que algo deu errado. (Causa raiz que testei: chave da API mal configurada, já corrigida — mas o problema de não mostrar erro nenhum continua existindo pra qualquer falha futura.)
  > ⚠️ Bug relacionado: a aba "Ata Oficial" deixa gerar o PDF mesmo quando o roteiro não foi gerado direito — deveria avisar ou bloquear.

- [x] O conteúdo gerado é legível e estruturado
  > ✅ Sucesso: Funcionou conforme esperado. Segue o método CRIA corretamente.

## 3. Fluxo de Squad e PDI
- [x] Visualização do squad funciona sem quebrar layout
  > ✅ Sucesso: Funcionou conforme esperado.

- [x] Inclusão de tarefa/PDI funciona sem duplicação
  > ✅ Sucesso: É possível adicionar novas tasks em Meu Squad -> Ver Perfil Completo -> Visão e Acordos. É possível adicionar PDI em Meu Squad -> Ver Perfil -> Plano de Desenvolvimento (PDI).
  > ❌ Bug adicional (fora deste requisito, mas relacionado): Em Meu Squad -> Ver Perfil Completo, existem dois botões: "Criar Metas SMART" e "Gerar Pauta 1:1". Ao clicar em ambos, a página retorna para "Meu Squad", mas não há nenhuma funcionalidade específica através desses botões.

- [x] Edição e exclusão de itens preservam consistência visual
  > ✅ Sucesso: Funcionou conforme esperado. Dá para editar/excluir tasks e PDIs.

## 4. Fluxo de RH e analytics
- [x] Painel exibe métricas principais sem falhas
  > ✅ Sucesso: De fato o painel exibe as métricas principais sem falhas, porém é preciso ir em Sobre -> Rodar até o final da página -> "Injetar Dados Demo" -> Fazer Login novamente como RH.

- [x] Busca e filtros funcionam corretamente
  > ✅ Sucesso: filtros funcionam normalmente.
  > ⚠️ Obs: Em relação à busca no sentido de digitar algo, isso não há. Há apenas a opção de filtro. Para mim, é o suficiente, mas deixei a observação porque esse tópico menciona "busca" além dos filtros.

- [ ] Exportação/visualização de dados é consistente
  > ✅ Visualização: ok, painel exibe métricas e gráficos corretamente.
  > ❌ Exportação: Há como fazer download/exportar em "Home", porém o PDF gerado após o download aparece de forma ilegível/inconsistente, cortando parte do conteúdo.

## 5. LGPD e privacidade
- [x] Dados sensíveis não aparecem em logs em texto claro
  > ✅ Sucesso: só aparecem linhas técnicas tipo POST /api/gerar-roteiro 200 OK. No backend, nada consta de dados sensíveis, como CPF.

- [x] Download e telemetry preservam anonimização
  > ✅ Sucesso: via download do PDF (Ata Oficial). CPF e valores financeiros não apareceram no documento (anonimização ok). Nome do liderado e conteúdo da conversa aparecem normalmente, o que é esperado na ata.

- [ ] Dados salvos no localStorage não expõem informações indevidas
  > ❌ Bug (testado como Líder): abri F12 → Aplicativo → Armazenamento → Armazenamento local → localhost:5173, e vi nome de colaboradores + pontuação de ranking, estado emocional do liderado e conteúdo da pauta de reunião, tudo em texto legível. O resto (squad, PDI) só está codificado (JTVCJTdC...), não criptografado — fácil de reverter.
  > Severidade: Alta — dado pessoal/sensível exposto no navegador.

## 6. Qualidade operacional
- [x] A aplicação carrega sem erros no navegador
  > ✅ Sucesso: Testado via Console do DevTools (F12) navegando pelas telas principais, nenhum erro em vermelho, tudo funcionando normalmente.

- [ ] O build e o lint permanecem estáveis após mudanças
  > ✅ Build: passou sem erros (npm run build)
  > ❌ Lint: 1 erro encontrado (npm run lint). Arquivo: src/views/Meus1a1.jsx, linha 309. Variável 'ataParaRH' foi criada mas nunca usada no código.
  > Severidade: Baixa, não quebra a aplicação, mas indica possível código incompleto ou esquecido.

- [x] O fluxo funciona em modo offline para dados mockados
  > ✅ Sucesso. Testado desligando o Wi-Fi com o sistema já aberto. Telas com dados mockados (Liga de Ouro, Playbook, Meu Squad, etc.) continuaram funcionando normalmente offline. Geração de roteiro com IA não foi testada offline (depende de internet por natureza, não é bug).