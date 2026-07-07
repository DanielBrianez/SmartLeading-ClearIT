# 🛡️ Governança e Conformidade LGPD (Privacy by Design)

O **Smart Leading V2 (Agent-First Edition)** foi arquitetado seguindo rigorosamente os princípios de *Privacy by Design* e *Privacy by Default*, garantindo o alinhamento total com a **Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)**.

O objetivo da ferramenta é fornecer suporte estrutural e analítico para a liderança e para o RH, sem se tornar um repositório centralizado de dados sensíveis ou informações de cunho pessoal (PII - *Personally Identifiable Information*).

## 1. Princípio da Minimização e Isolamento (Cofre Local)
O sistema opera numa arquitetura de *Sandbox Client-Side*. Toda a persistência de dados (Rascunhos de Atas, PDIs, Histórico de Adiamentos e Avaliações Bilaterais de XP) ocorre de forma isolada no `localStorage` do navegador do próprio usuário. 
- **Sem Banco de Dados Central:** O Back-end não possui tabelas SQL/NoSQL em nuvem hospedando histórico de feedbacks, atas ou metas de colaboradores.
- **Isolamento de Repositório:** Configurações estritas de `.gitignore` garantem que nenhum arquivo de log (`*.csv`), documento (`*.pdf`) ou cache de memória transite para o versionamento do código-fonte.

## 2. Semantic Firewall (Mascaramento Client-Side Ativo)
A primeira e mais robusta barreira de segurança ocorre antes mesmo de qualquer dado cruzar a rede. O sistema conta com um **Semantic Firewall** embutido no Frontend.
- **Filtro por Expressões Regulares (RegEx):** Ao submeter as observações para gerar o roteiro, o navegador intercepta e anonimiza ativamente padrões críticos, substituindo-os por tags inofensivas.
- **Dados interceptados:** CPFs (`[CPF_PROTEGIDO]`), Valores Financeiros/Salariais (`[SALÁRIO_PROTEGIDO]`), E-mails (`[EMAIL_PROTEGIDO]`) e Telefones (`[TELEFONE_PROTEGIDO]`).

## 3. Processamento e Geração Documental Local
A compilação visual e geração dos documentos corporativos finais é realizada **100% no cliente**, através do motor `html2pdf.js`. 
- Isso se aplica tanto à **Ata Oficial de Alinhamento** (gerada pelo líder) quanto ao **Relatório DRE (Demonstrativo de Resultado de Engajamento)** (gerado pelo RH).
- Os arquivos contendo o detalhamento das reuniões e o risco de burnout (termômetro) são baixados localmente para a máquina do usuário logado. A aplicação não intercepta, não trafega e não retém cópias do arquivo PDF gerado em nenhum servidor externo.

## 4. Telemetria e Governança Bilateral (Zero PII Externo)
A plataforma consolida métricas complexas (Termômetro Organizacional, Compliance de Cadência e PDIs Ativos) no Painel de People Analytics **agregando os dados anonimizados localmente**. 

Para fins de auditoria e gamificação (Liga de Ouro e Governança Bilateral), os logs enviados ao Back-end registram **apenas metadados numéricos e de perfil**:
- **O que é registrado:** Timestamp, Nome do Agente (Líder), Senioridade/Momento Comportamental do Liderado e Confirmação de Evento (`Ata Gerada`, `Avaliação Recebida`).
- **O que é bloqueado na raiz:** O nome do Liderado, o detalhamento das "Entregas", as notas confidenciais da 1:1 e o Roteiro gerado pela IA.

## 5. Blindagem de Prompt (Defesa em Profundidade)
Como segunda camada de proteção (caso alguma informação escape do Semantic Firewall), o envio do contexto para a API do Google Gemini obedece a um *Prompt System* restritivo (`AGENTS.md`). 

O motor de Inteligência Artificial opera sob a seguinte Regra de Ouro (LGPD) em todas as requisições:
> *"Seu objetivo é preparar o líder para uma reunião de 1:1 e redigir a Ata Oficial [...] sem usar nomes próprios para manter a conformidade com a LGPD."*

Através dessa arquitetura de múltiplos escudos, o Smart Leading posiciona-se como uma ferramenta de gestão e aceleração cognitiva de padrão enterprise, blindando a corporação contra riscos trabalhistas e vazamentos de informações críticas.