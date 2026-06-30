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

## 3. Telemetria e People Analytics (Zero PII)
O inovador Painel do RH (People Analytics) gera métricas avançadas (Volume de Ritos, eNPS Preditivo, Taxa de Adoção) **agregando dados anonimizados localmente**. 

Para fins de auditoria e gamificação (Liga de Ouro), os logs de telemetria enviados ao Back-end registram **apenas metadados genéricos**:
- **O que é registrado:** Timestamp, Nome do Líder (Agente), Senioridade/Comportamento do liderado selecionado e Confirmação de Evento (`Baixou_Ata = Sim`).
- **O que é bloqueado na raiz:** O nome do Liderado, o detalhamento técnico da "Pauta/Entregas", os acordos firmados no PDI e o Roteiro Confidencial gerado pela IA.

## 4. Blindagem do Motor Paramétrico (Google Gemini)
O envio do contexto da reunião para a API do Google Gemini obedece a um *Prompt System* estrito (`AGENTS.md`), que atua como uma barreira lógica de privacidade. 

O motor é programado com a seguinte Regra de Ouro (LGPD) injetada no payload da requisição:
> *"Seu objetivo é preparar o líder para uma reunião de 1:1 e redigir a Ata Oficial [...] sem usar nomes próprios para manter a conformidade com a LGPD."*

Através dessa premissa de *Zero PII*, o Smart Leading posiciona-se como uma ferramenta de aceleração cognitiva altamente segura, blindando a Clear IT contra riscos trabalhistas e vazamentos de confidencialidade.