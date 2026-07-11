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

    # Dados do Líder
    perfil_lider = dados.get("perfil_lideranca", "Líder Engajado")
    
    # Dados Base do Liderado
    senioridade = dados.get("senioridade_liderado", "Não especificado")
    tempo_casa = dados.get("tempo_casa", "Não especificado")
    meeting_type = dados.get("meeting_type", "recorrente")
    entregas = dados.get("resumo_entregas", "Nenhuma entrega relatada")

    # NOVOS DADOS: Capturados diretamente da Home do Liderado (Sincronia de Momento)
    sentimento_liderado = dados.get("sentimento_liderado", "Não informou o momento atual.")
    pauta_liderado = dados.get("pauta_liderado", "Não sugeriu pauta prévia.")
    pdis_ativos = dados.get("pdis_ativos", "0")
    tarefas_ativas = dados.get("tarefas_ativas", "0")

    # Instruções específicas por tipo de reunião
    tipo_instrucao = ""
    if meeting_type == 'feedback_corretivo':
        tipo_instrucao = (
            "\n\nIMPORTANTE: Este é um feedback corretivo. Utilize a Comunicação Não-Violenta e o modelo SBI "
            "(Situação, Comportamento, Impacto). Forneça frases de exemplo para iniciar a conversa, perguntas para "
            "escuta ativa e passos de co-construção de solução. Evite rótulos e foque em ações e impactos." 
        )
    elif meeting_type == 'reconhecimento':
        tipo_instrucao = (
            "\n\nIMPORTANTE: Este é um momento de reconhecimento. Gere mensagens curtas e positivas, exemplos de elogios "
            "objetivos e sugestões de como compartilhar o reconhecimento (público/privado)."
        )
    elif meeting_type == 'desenvolvimento':
        tipo_instrucao = (
            "\n\nIMPORTANTE: Esta reunião foca em desenvolvimento de carreira/PDI. Estruture sugestões de objetivos, "
            "atividades de aprendizagem, critérios de sucesso e uma data de revisão. Inclua perguntas para identificar motivação." 
        )
    elif meeting_type == 'mediado_por_dados':
        tipo_instrucao = (
            "\n\nIMPORTANTE: Use dados e métricas. Analise indicadores apresentados, proponha análise de causa-raiz e planos de ação "
            "quantificáveis com responsáveis e prazos. Evite interpretações subjetivas sem números."
        )

    try:
        model = genai.GenerativeModel('gemini-3.1-flash')

        prompt = f"""
        Você é um Mentor Executivo e parceiro de RH estratégico da empresa Clear IT.
        Seu objetivo é preparar o líder para uma reunião de 1:1 e, ao mesmo tempo, redigir a Ata Oficial desse encontro (sem usar nomes próprios para manter a conformidade com a LGPD).

        CONTEXTO DO LÍDER (COMO VOCÊ DEVE SE COMPORTAR):
        - Perfil Mapeado pela IA: {perfil_lider}
        
        REGRAS DE TOM DE VOZ PARA O LÍDER (CRÍTICO):
        - Se o líder for "Líder Técnico": Tem baixa tolerância a burocracia. Crie um roteiro EXTREMAMENTE direto, rápido, em bullet points, focado na resolução prática e evite totalmente jargões de RH.
        - Se o líder for "Líder em Transição": Falta repertório emocional para conversas difíceis. Crie um roteiro ACOLHEDOR, muito detalhado, validando o passo a passo e sugerindo frases exatas (entre aspas) de como ele deve falar para ter empatia.
        - Se o líder for "Líder Engajado": Acredita no processo, mas sofre com falta de tempo. Crie um roteiro ÁGIL, muito bem estruturado para organizar o tempo da reunião e ir direto ao ponto.

        CONTEXTO DO LIDERADO (PREENCHIDO NO APLICATIVO DELE):
        - Senioridade: {senioridade}
        - Tempo de Casa: {tempo_casa}
        - Status Emocional Atual (Sincronia): "{sentimento_liderado}"
        - Pauta sugerida por ele para esta 1:1: "{pauta_liderado}"
        - Engajamento Tático: {pdis_ativos} PDIs ativos e {tarefas_ativas} tarefas/acordos pendentes.
        - Histórico de Entregas Recentes: {entregas}

        ESTRUTURA OBRIGATÓRIA DA SUA RESPOSTA:
        Você deve dividir sua resposta em duas partes, usando formatação Markdown. Separe-as EXATAMENTE por esta tag: --- ATA OFICIAL ---

        ### PARTE 1: ROTEIRO DO LÍDER (Confidencial)
        Você deve estruturar o roteiro seguindo obrigatoriamente os 5 blocos da ClearIT, cruzando o tom de voz do Líder ({perfil_lider}) com as informações trazidas pelo Liderado:

        1. 🌱 **Check-in Humano:** Baseie sua abordagem EXATAMENTE no sentimento reportado ("{sentimento_liderado}"). Se ele estiver sobrecarregado, sugira acolhimento; se estiver motivado, sugira reforço positivo.
        2. 🎯 **Pauta do Liderado:** O colaborador já pediu para falar sobre: "{pauta_liderado}". Oriente o líder sobre como conduzir especificamente esse assunto.
        3. 🚧 **Obstáculos e Impedimentos:** Como o colaborador possui {tarefas_ativas} tarefas pendentes, dê dicas para o líder investigar se há bloqueios técnicos ou sobrecarga.
        4. 🚀 **Desenvolvimento e Carreira - Metodologia CRIA:** Faça um overview conectando as entregas ({entregas}) com os {pdis_ativos} PDIs ativos dele. Aplique a metodologia:
           * **[C] Contexto:** Situação real das entregas.
           * **[R] Redirecionamento:** Ajustes técnicos/comportamentais calibrados para o nível {senioridade}.
           * **[I] Impacto:** Como afeta a Clear IT.
           * **[A] Alinhamento:** Perguntas para pactuar compromissos.
        5. 🤝 **Acordos e Próximos Passos:** Dicas para formalizar combinados.

        --- ATA OFICIAL ---

        RESUMO DO ALINHAMENTO
        - Escreva de forma formal, impessoal e corporativa.
        - Comece OBRIGATORIAMENTE com: "Nesta reunião de alinhamento, conversamos sobre os seguintes tópicos..."
        - Faça o resumo profissional incorporando a pauta trazida por ele ("{pauta_liderado}") e a análise de entregas ({entregas}). Crie sugestões de acordos.

        DIRETRIZ DE FRAMEWORK DE LEVELS (CLEAR IT):
        Ao gerar o roteiro, adapte a cobrança com base na senioridade:
        - Júnior/Trainee: Foco em execução guiada e aprendizado técnico.
        - Pleno: Foco em autonomia, qualidade de entrega e visão de ponta a ponta.
        - Sênior/Especialista: Foco em mentoria, arquitetura, impacto no negócio e liderança técnica.
        {tipo_instrucao}

        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print(f"🚨 Erro interno no motor do Gemini: {str(e)}")
        return f"Roteiro indisponível no momento: {str(e)}"