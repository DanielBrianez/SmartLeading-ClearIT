import os
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - dependência opcional para ambientes sem API
    genai = None

_configured = False


def _ensure_configured() -> bool:
    global _configured
    if _configured:
        return True
    if not genai:
        return False

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return False

    genai.configure(api_key=api_key)
    _configured = True
    return True


def gerar_roteiro_ia(dados: dict) -> str:
    if not _ensure_configured():
        return "Roteiro indisponível: GEMINI_API_KEY não configurada."

    perfil_lider = dados.get("perfil_lideranca", "Não especificado")
    senioridade = dados.get("senioridade_liderado", "Não especificado")
    tempo_casa = dados.get("tempo_casa", "Não especificado")
    perfil_comportamental = dados.get("perfil_comportamental", "Não especificado")
    entregas = dados.get("resumo_entregas", "Nenhuma entrega relatada")

    try:
        model = genai.GenerativeModel('gemini-3.1-flash-lite')

        prompt = f"""
        Você é um Mentor Executivo e parceiro de RH estratégico da empresa Clear IT.
        Seu objetivo é preparar o líder para uma reunião de 1:1 e, ao mesmo tempo, redigir a Ata Oficial desse encontro (sem usar nomes próprios para manter a conformidade com a LGPD).

        CONTEXTO DA REUNIÃO:
        - Perfil do Líder (quem vai conduzir): {perfil_lider}
        - Senioridade do Liderado: {senioridade}
        - Tempo de Casa: {tempo_casa}
        - Momento / Perfil Comportamental: {perfil_comportamental}
        - Foco / Entregas Recentes: {entregas}

        REGRAS DE TOM DE VOZ PARA O LÍDER (CRÍTICO):
        - Se o líder for "Técnico": Use linguagem ultra-direta, sem jargão de RH, foque em dados e metas.
        - Se o líder for "Em Transição": Dê dicas de empatia, escuta ativa e como conduzir conversas difíceis sem parecer autoritário.
        - Se o líder for "Engajado": Foque em estruturar o tempo, evitar dispersão e definir próximos passos muito práticos.

        ESTRUTURA OBRIGATÓRIA DA SUA RESPOSTA:
        Você deve dividir sua resposta em duas partes, usando formatação Markdown. Separe-as EXATAMENTE por esta tag: --- ATA OFICIAL ---

        ### PARTE 1: ROTEIRO DO LÍDER (Confidencial)
        - OBRIGATÓRIO: O "Desenvolvimento da Pauta" DEVE ser 100% focado neste assunto: "{entregas}".
        - Você DEVE estruturar a abordagem de feedback utilizando a Metodologia CRIA, dividindo em 4 tópicos com bullet points:
          * [C] Contexto: Descreva a situação específica relatada nas entregas, sem generalizar.
          * [R] Redirecionamento: O que precisa mudar ou ser mantido/reforçado na atitude ou entrega técnica.
          * [I] Impacto: Como essa atitude/entrega afeta o projeto, o squad e os resultados da Clear IT.
          * [A] Alinhar: Sugestões de perguntas para o líder fazer ao liderado para construir um acordo ou plano de ação.
        - Dê breves dicas de postura baseadas no perfil do Líder ({perfil_lider}).

        --- ATA OFICIAL ---

        RESUMO DO ALINHAMENTO
        - Escreva de forma formal, impessoal e corporativa.
        - Comece OBRIGATORIAMENTE com: "Nesta reunião de alinhamento, conversamos sobre os seguintes tópicos..."
        - Faça o resumo profissional focado em: {entregas}. Crie sugestões de acordos firmados.

        DIRETRIZ DE FRAMEWORK DE LEVELS (CLEAR IT):
        Ao gerar o roteiro, adapte a cobrança com base na senioridade:

        - Júnior/Trainee: Foco em execução guiada e aprendizado técnico.
        - Pleno: Foco em autonomia, qualidade de entrega e visão de ponta a ponta.
        - Sênior/Especialista: Foco em mentoria, arquitetura, impacto no negócio e liderança técnica.

        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print(f"🚨 Erro interno no motor do Gemini: {str(e)}")
        return f"Roteiro indisponível no momento: {str(e)}"