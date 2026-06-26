# backend/app/core/gemini.py

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
    """
    Função principal que monta o prompt e conversa com o Gemini.
    Recebe um dicionário com os dados do formulário e retorna o Markdown.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Aja como um sistema especialista de liderança corporativa da Clear IT.
        Gere APENAS o roteiro estruturado da reunião 1:1 em formato Markdown. 
        REGRA DE OURO: NÃO inclua saudações. Vá direto para o conteúdo.
        DIRETRIZ DE PRIVACIDADE (LGPD): NÃO invente nomes reais. Use termos genéricos.

        CONTEXTO:
        - Perfil Líder: {dados['perfil_lider']}
        - Liderado: {dados['senioridade']} | Tempo: {dados['tempo_empresa']}
        - Perfil Comportamental: {dados['perfil_comportamental']}
        - Pauta: {dados['pauta']}
        - Acordos Prévios: {dados.get('acordos', 'Nenhum')}
        """
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        print(f"🚨 Erro interno no motor do Gemini: {str(e)}")
        raise e