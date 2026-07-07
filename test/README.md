# Test Suite - Smart Leading V2

Esta pasta centraliza a estratégia de validação do projeto, incluindo:

- testes automatizados em Python para a API backend
- cenários BDD para comportamento esperado do produto
- checklist de testes manuais para validação exploratória e UX

## Estrutura

- test/automated/backend/: testes automatizados de API e integração
- test/bdd/: cenários em linguagem Gherkin para alinhamento de negócio e engenharia
- test/manual/: checklist profissional de testes manuais

## Como executar

### Backend
```bash
cd backend
pip install -r requirements.txt pytest httpx
pytest ../test/automated/backend -q
```

### Frontend
```bash
cd frontend
npm install
npm run lint
npm run build
```
