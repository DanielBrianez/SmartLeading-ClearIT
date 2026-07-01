# 🛡️ Governança e Conformidade LGPD (Privacy by Design)

O **Smart Leading V2** foi arquitetado seguindo rigorosamente os princípios de *Privacy by Design* e *Privacy by Default*, garantindo o alinhamento total com a **Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)**.

O objetivo da ferramenta é fornecer suporte estrutural e analítico para a liderança, sem se tornar um repositório centralizado de dados sensíveis ou informações de cunho pessoal (PII - *Personally Identifiable Information*).

## 1. Princípio da Minimização e Isolamento (Cofre Local)
O sistema opera numa arquitetura de *Sandbox Client-Side*. Toda a persistência de dados sensíveis (Rascunhos de Atas, Planos de Desenvolvimento Individual - PDIs, e Histórico de Adiamentos) ocorre de forma criptografada no `localStorage` do navegador do próprio gestor. 
- **Sem Banco de Dados Central:** O Back-end não possui tabelas de usuários, atas ou feedbacks em banco de dados relacional na nuvem.
- **Isolamento de Repositório:** Configurações estritas de `.gitignore` garantem que nenhum arquivo de log (`*.csv`), documento (`*.pdf`) ou cache de memória transite para o versionamento do código-fonte (GitHub/GitLab).

## 2. Processamento Client-Side (Geração de PDFs)
A compilação e geração do documento final (Ata Oficial de Alinhamento) é realizada **100% no cliente**, através do motor `html2pdf.js`. 
- O arquivo contendo os detalhes discutidos é baixado localmente para a máquina do líder.
- A aplicação não intercepta, não trafega e não retém cópias do arquivo PDF gerado.

## 3. Telemetria e People Analytics (Pseudonimização Assimétrica - ADR 03)
O Painel de RH (People Analytics) do Smart Leading gera métricas de engajamento, cadência e temas baseando-se no modelo de **Pseudonimização Assimétrica**:
- **Preservação de Dados de Liderança:** Para viabilizar a Liga de Ouro, o ranking e o acompanhamento de PDL pelo RH, registramos o `ID_do_Líder` e a `Diretoria`. Isso permite descobrir qual líder precisa de suporte sem violar a privacidade de quem foi avaliado.
- **Descarte Permanente do Liderado:** O `ID_do_Liderado` (colaborador) é deletado no pipeline de telemetria de clima e macrotemas.
- **N-Size Masking:** Equipes/squads com menos de 5 liderados têm seus dados temáticos consolidados em grupos genéricos no Heatmap para impossibilitar a re-identificação acidental.
- **Segregação do Alerta de Risco (F-17):** O checkbox de risco nominal grava as identidades localmente no banco corporativo seguro. O texto explicativo contendo a causa-raiz passa por mascaramento completo (substituindo nomes por `[COLABORADOR]`) via AI Gateway antes de ser enviado à IA.

## 4. Blindagem do Motor de IA e AI Gateway (ADR 02)
O fluxo de envio de dados para a API do Gemini é interceptado por um **LLM Firewall** (AI Gateway Proxy) e uma camada client-side:
- **Tokenização Local (Navegador):** Varre o texto e substitui padrões de CPF e RG por `[DOCUMENTO]`.
- **Gateway Proxy FastAPI:** Intercepta menções a doenças, atestados ou problemas médicos substituindo por placeholders padronizados (ex: `[MOTIVO_MÉDICO_REDUZIDO]`).
- **Zero-Retention:** Os dados de ata e roteiros não são armazenados pelo provedor de LLM nem utilizados para treinamento de modelos públicos.