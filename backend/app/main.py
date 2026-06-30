from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
import os

# 👇 Importando a nossa inteligência encapsulada!
from app.core.gemini import gerar_roteiro_ia

app = FastAPI(title="Smart Leading API - Clear IT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DADOS (LGPD COMPLIANT) ---

# 1. Molde para a geração do roteiro (Sem dados sensíveis)
class RoteiroRequest(BaseModel):
    perfil_lideranca: str
    senioridade_liderado: str
    tempo_casa: str
    perfil_comportamental: str
    resumo_entregas: str

# 2. Molde para o log de auditoria (Somente Metadados)
class DownloadLogRequest(BaseModel):
    lider: str
    senioridade: str
    perfil_comportamental: str


# --- FUNÇÕES AUXILIARES ---
def salvar_linha_log(linha_texto: str):
    pasta_logs = Path("data")
    os.makedirs("data", exist_ok=True)
    filepath = pasta_logs / "telemetry_logs.csv"
    
    if not filepath.exists():
        # Cabeçalho atualizado
        cabecalho = "Data_Hora;Lider;Senioridade;Perfil_Comportamental;Baixou_Ata\n"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cabecalho)
            
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(linha_texto)


# --- ROTAS DA API ---

@app.post("/api/gerar-roteiro")
async def gerar_roteiro(dados: RoteiroRequest):
    try:
        # Passa o dicionário puro para o módulo de IA
        texto_gerado = gerar_roteiro_ia(dados.model_dump())
        
        # O Front-end agora espera a chave "roteiro"
        return {"roteiro": texto_gerado}
        
    except Exception as e:
        print(f"🚨 ERRO NA ROTA DE GERAÇÃO: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/registrar-download")
async def registrar_download(dados: DownloadLogRequest):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Monta a linha do CSV com os novos dados
    log_line = f"{timestamp};{dados.lider};{dados.senioridade};{dados.perfil_comportamental};Sim\n"
    salvar_linha_log(log_line)
        
    return {"status": "sucesso"}