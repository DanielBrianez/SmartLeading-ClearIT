import os
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Carrega as variáveis secretas do arquivo .env
load_dotenv()

# 2. Validação de segurança: Verifica se a chave existe antes de tentar rodar
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("⚠️ ALERTA: GEMINI_API_KEY não foi encontrada no arquivo .env!")

# 3. Configura o motor da IA
genai.configure(api_key=api_key)

def gerar_roteiro_ia(dados: dict) -> str:

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

        ROTEIRO DO LÍDER (Confidencial)
        - Crie o roteiro da 1:1 dividido em: Abertura, Desenvolvimento da Pauta e Próximos Passos.
        - OBRIGATÓRIO: O "Desenvolvimento da Pauta" DEVE ser 100% focado neste assunto: "{entregas}". Aborde DIRETAMENTE os problemas, absurdos ou sucessos relatados aqui, preparando o líder para lidar com ESSA situação específica.
        - Dê dicas de postura e correções de tom baseadas no perfil do Líder ({perfil_lider}).
        - Sugira perguntas focadas no momento atual do liderado ({perfil_comportamental}).

        --- ATA OFICIAL ---

        RESUMO DO ALINHAMENTO
        - Escreva de forma formal, impessoal e corporativa (este texto irá para o RH).
        - Comece OBRIGATORIAMENTE com: "Nesta reunião de alinhamento, conversamos sobre os seguintes tópicos..."
        - Faça o resumo profissional focado em: {entregas}. Crie sugestões de acordos firmados.
        """
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        print(f"🚨 Erro interno no motor do Gemini: {str(e)}")
        raise e