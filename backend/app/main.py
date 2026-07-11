from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
import os
import hashlib  # <--- IMPORTANTE: Importamos a lib de hashing

# 👇 Importando a nossa inteligência encapsulada!
from app.core.gemini import gerar_roteiro_ia

app = FastAPI(title="Smart Leading API - Clear IT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # A porta padrão
        "http://localhost:5174"   # <--- ADICIONE A PORTA NOVA AQUI!
        "https://smart-leading-clear-fwvqopn1o-24-plus-1.vercel.app", # A URL do seu front
        "*"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DADOS ---

class RoteiroRequest(BaseModel):
    perfil_lideranca: str
    senioridade_liderado: str
    tempo_casa: str
    perfil_comportamental: str
    meeting_type: str | None = None
    resumo_entregas: str

class DownloadLogRequest(BaseModel):
    lider: str # O sistema recebe o nome, mas vamos salvar o hash
    senioridade: str
    perfil_comportamental: str

# --- FUNÇÕES AUXILIARES ---

def salvar_linha_log(linha_texto: str):
    pasta_logs = Path("data")
    os.makedirs("data", exist_ok=True)
    filepath = pasta_logs / "telemetry_logs.csv"
    
    if not filepath.exists():
        # Cabeçalho atualizado: Note que mudamos 'Lider' para 'Lider_Hash'
        cabecalho = "Data_Hora;Lider_Hash;Senioridade;Perfil_Comportamental;Baixou_Ata\n"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cabecalho)
            
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(linha_texto)

# --- ROTAS DA API ---

@app.post("/api/gerar-roteiro")
async def gerar_roteiro(dados: RoteiroRequest):
    try:
        payload = dados.model_dump()
        texto_gerado = gerar_roteiro_ia(payload)
        return {"roteiro": texto_gerado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/pauta-templates")
async def pauta_templates():
    templates = {
        "feedback_corretivo": "Modelo SBI:\n- Situação: \n- Comportamento: \n- Impacto: \n\nCo-construção de ações e data de revisão.",
        "reconhecimento": "Template de Reconhecimento:\n- Comportamento observado: \n- Resultado/Impacto: \n- Como compartilhar (público/privado): \n- Sugestão de próximo passo para manter o comportamento.",
        "desenvolvimento": "Template PDI / Desenvolvimento:\n- Objetivo de carreira: \n- Habilidades a desenvolver: \n- Ações (treinamentos/mentoria): \n- Critério de sucesso e data de revisão.",
        "mediado_por_dados": "Template Mediado por Dados:\n- Métrica/Indicador: \n- Valor atual: \n- Meta: \n- Análise de causa-raiz: \n- Ações propostas e responsável."
    }
    return templates

@app.post("/api/registrar-download")
async def registrar_download(dados: DownloadLogRequest):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 🔥 ANONIMIZAÇÃO LGPD ATIVA 🔥
    # Criamos um hash curto de 12 caracteres. Identifica o padrão, não a pessoa.
    lider_hash = hashlib.sha256(dados.lider.encode()).hexdigest()[:12]
    
    # Monta a linha usando o HASH em vez do nome original
    log_line = f"{timestamp};{lider_hash};{dados.senioridade};{dados.perfil_comportamental};Sim\n"
    salvar_linha_log(log_line)
        
    return {"status": "sucesso"}

class TeamsNotificationRequest(BaseModel):
    lider_nome: str
    liderado_nome: str
    data_reuniao: str
    sentimento: str
    pauta_liderado: str
    pdis_ativos: int
    acordos_ativos: int

@app.post("/api/notificar-teams")
async def notificar_teams(dados: TeamsNotificationRequest):
    # Simulação do disparo do Webhook de Adaptive Cards do MS Teams
    print(f"\n================ [INTEGRAÇÃO MS TEAMS] ================")
    print(f"DISPARO: Notificação enviada para o Teams de {dados.liderado_nome}")
    print(f"MENSAGEM: Olá {dados.liderado_nome}, sua 1:1 com o líder {dados.lider_nome} está confirmada!")
    print(f"DATA DO ENCONTRO: {dados.data_reuniao}")
    print(f"RESUMO DOS TÓPICOS DA PAUTA:")
    print(f"  1. Sincronia de Momento (Sentimento): {dados.sentimento or 'Focado nas entregas'}")
    print(f"  2. Tema sugerido por você: '{dados.pauta_liderado or 'Nenhum tema específico proposto.'}'")
    print(f"  3. Carreira: Acompanhamento de {dados.pdis_ativos} PDIs e {dados.acordos_ativos} acordos pendentes.")
    print(f"=======================================================\n")
    return {"status": "sucesso", "mensagem": f"Resumo de pauta enviado para o Teams de {dados.liderado_nome}."}

class TeamsFormTriggerRequest(BaseModel):
    liderado_nome: str
    lider_nome: str
    data_reuniao: str

class TeamsFormResponse(BaseModel):
    liderado_nome: str
    sentimento: str
    pauta_liderado: str

@app.post("/api/disparar-alerta-teams")
async def disparar_alerta_teams(dados: TeamsFormTriggerRequest):
    # Simula o Cron Job rodando 3 dias antes da reunião e disparando o formulário Adaptive Card
    card_json = {
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
            {
                "type": "TextBlock",
                "text": f"📅 Sua 1:1 com {dados.lider_nome} está chegando (em 3 dias - {dados.data_reuniao})!",
                "weight": "Bolder",
                "size": "Medium",
                "color": "Accent"
            },
            {
                "type": "TextBlock",
                "text": "Responda abaixo diretamente no Teams para sincronizar sua pauta de mentoria:",
                "isSubtle": True,
                "wrap": True
            },
            {
                "type": "TextBlock",
                "text": "Como você está se sentindo nesta sprint?",
                "weight": "Bolder",
                "spacing": "Medium"
            },
            {
                "type": "Input.ChoiceSet",
                "id": "sentimento",
                "style": "expanded",
                "value": "Focado nas entregas",
                "choices": [
                    { "title": "🚀 Motivado e Energizado", "value": "Motivado e Energizado" },
                    { "title": "🎯 Focado nas entregas", "value": "Focado nas entregas" },
                    { "title": "🚧 Precisando de ajuda/bloqueado", "value": "Precisando de ajuda/bloqueado" },
                    { "title": "🔋 Sobrecarga/Cansado", "value": "Sobrecarga/Cansado" }
                ]
            },
            {
                "type": "TextBlock",
                "text": "O que você quer garantir que a gente aborde hoje? (Tema sugerido)",
                "weight": "Bolder",
                "spacing": "Medium"
            },
            {
                "type": "Input.Text",
                "id": "pauta_liderado",
                "placeholder": "Ex: Alinhamento de metas de carreira...",
                "isMultiline": True
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Confirmar e Sincronizar Pauta",
                "data": {
                    "action": "sincronizar_pauta",
                    "liderado_nome": dados.liderado_nome
                }
            }
        ]
    }
    
    print(f"\n================ [DISPARO ATIVO MS TEAMS - 3 DIAS ANTES] ================")
    print(f"ENVIADO PARA: {dados.liderado_nome} no Teams")
    print(f"PAYLOAD DO ADAPTIVE CARD COM ENTRADA DE FORMULÁRIO:")
    print(f"  - Card carregado com ChoiceSet (Sentimentos) e Input.Text (Tema).")
    print(f"=========================================================================\n")
    
    return {"status": "sucesso", "card": card_json}

@app.post("/api/receber-resposta-teams")
async def receber_resposta_teams(dados: TeamsFormResponse):
    # Simula o recebimento dos dados enviados pelo colaborador de dentro do próprio Microsoft Teams
    print(f"\n================ [RESPOSTA RECEBIDA DO MS TEAMS] ================")
    print(f"SENDER: Colaborador {dados.liderado_nome} respondeu de dentro do Teams!")
    print(f"DADOS SINCRONIZADOS NO BANCO LOCAL:")
    print(f"  - Sentimento: {dados.sentimento}")
    print(f"  - Tema Escolhido: '{dados.pauta_liderado}'")
    print(f"=================================================================\n")
    return {
        "status": "sucesso",
        "card_resposta": {
            "type": "AdaptiveCard",
            "version": "1.4",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "✅ Pauta Sincronizada com Sucesso!",
                    "weight": "Bolder",
                    "color": "Good"
                },
                {
                    "type": "TextBlock",
                    "text": f"Olá {dados.liderado_nome}, seus sentimentos ({dados.sentimento}) e seu tema ('{dados.pauta_liderado}') foram sincronizados com seu gestor.",
                    "wrap": True
                }
            ]
        }
    }