# Checklist de Testes Manuais - Smart Leading V2

## 1. Fluxo de Login
- [ ] Login com usuário líder funciona
- [ ] Login com usuário liderado funciona
- [ ] Login com usuário RH funciona
- [ ] Tela de erro/sem sessão é tratada corretamente

## 2. Fluxo de 1:1
- [ ] O líder consegue selecionar um liderado
- [ ] O campo de entregas aceita texto livre
- [ ] A geração de roteiro exibe mensagem de sucesso ou erro clara
- [ ] O conteúdo gerado é legível e estruturado

## 3. Fluxo de Squad e PDI
- [ ] Visualização do squad funciona sem quebrar layout
- [ ] Inclusão de tarefa/PDI funciona sem duplicação
- [ ] Edição e exclusão de itens preservam consistência visual

## 4. Fluxo de RH e analytics
- [ ] Painel exibe métricas principais sem falhas
- [ ] Busca e filtros funcionam corretamente
- [ ] Exportação/visualização de dados é consistente

## 5. LGPD e privacidade
- [ ] Dados sensíveis não aparecem em logs em texto claro
- [ ] Download e telemetry preservam anonimização
- [ ] Dados salva no localStorage não expõem informações indevidas

## 6. Qualidade operacional
- [ ] A aplicação carrega sem erros no navegador
- [ ] O build e o lint permanecem estáveis após mudanças
- [ ] O fluxo funciona em modo offline para dados mockados
