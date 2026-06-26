# 🛡️ Conformidade com a LGPD (Privacy by Design)

O **Smart Leading V2** foi arquitetado seguindo rigorosamente os princípios de *Privacy by Design* e *Privacy by Default*, garantindo o alinhamento com a **Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)**.

O objetivo da ferramenta é fornecer suporte estrutural para a liderança, sem se tornar um repositório de dados sensíveis ou informações de cunho pessoal (PII - *Personally Identifiable Information*).

## 1. Princípio da Minimização de Dados
O sistema solicita apenas as informações estritamente necessárias para a inteligência artificial formular um roteiro adequado:
- Perfil de Liderança do gestor.
- Senioridade e tempo de empresa do liderado.
- Perfil comportamental predominante.
- Resumo da pauta (foco em desenvolvimento técnico e comportamental).

*Nenhum dado sensível (como informações de saúde, opiniões políticas ou filiações) é solicitado, processado ou armazenado pela plataforma.*

## 2. Processamento Client-Side (PDF)
A geração do documento final (Ata da Reunião 1:1) é realizada de forma **100% Client-Side** (no navegador do usuário), através da biblioteca `html2pdf.js`. 
- O arquivo PDF contendo os detalhes discutidos é baixado diretamente para a máquina local do gestor.
- **O Back-end da aplicação não recebe, não intercepta e não armazena o arquivo PDF gerado.**

## 3. Anonimização e Retenção de Logs
O sistema de auditoria (Back-end) registra o uso da ferramenta para fins de Business Intelligence e Gamificação (apuração de engajamento da liderança). 

**O que é registrado no arquivo `logs/smart_leading_logs.csv`:**
- Data e hora da geração (Timestamp).
- Nome do Líder que utilizou a ferramenta.
- Perfis genéricos selecionados (Senioridade, Comportamento, etc.).
- Confirmação de download (`Baixou_Ata = Sim`).

**O que NÃO é registrado (Descarte imediato):**
- O nome do Liderado.
- O texto preenchido no campo "Pauta" e "Acordos Prévios".
- A resposta integral gerada pela Inteligência Artificial.

## 4. Integração com a LLM (Google Gemini)
O envio de contexto para a API do Google Gemini obedece a um *Prompt System* estrito, que atua como uma barreira lógica de privacidade. A IA é instruída através da seguinte Regra de Ouro em seu núcleo:
> *"DIRETRIZ DE PRIVACIDADE (LGPD): NÃO invente nomes reais. Use termos genéricos."*

Dessa forma, garantimos que a plataforma é uma ferramenta de aceleração de processos, totalmente segura e aderente às políticas de governança de dados da Clear IT.