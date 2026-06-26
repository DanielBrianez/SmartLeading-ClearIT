# backend/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path

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

# --- MODELOS DE DADOS ---
class FormConfig1a1(BaseModel):
    perfil_lider: str
    senioridade: str
    tempo_empresa: str
    perfil_comportamental: str
    pauta: str
    acordos: str = ""

class RegistroLogConfig(BaseModel):
    lider_nome: str
    perfil_lider: str
    senioridade: str
    tempo_empresa: str
    perfil_comportamental: str

# --- FUNÇÕES AUXILIARES ---
def salvar_linha_log(linha_texto: str):
    pasta_logs = Path("logs")
    pasta_logs.mkdir(exist_ok=True)
    filepath = pasta_logs / "smart_leading_logs.csv"
    
    if not filepath.exists():
        cabecalho = "Data_Hora;Lider;Perfil_Lideranca;Senioridade;Tempo_Empresa;Perfil_Comportamental;Baixou_Ata\n"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cabecalho)
            
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(linha_texto)

# --- ROTAS DA API ---

@app.post("/api/gerar-roteiro")
async def gerar_roteiro(dados: FormConfig1a1):
    try:
        # A ROTA FICOU LIMPA! Ela só passa o dicionário para o nosso módulo de IA.
        # O model_dump() converte o objeto Pydantic em um dicionário puro.
        texto_gerado = gerar_roteiro_ia(dados.model_dump())
        
        return {"roteiro_gerado": texto_gerado}
        
    except Exception as e:
        print(f"🚨 ERRO NA ROTA DE GERAÇÃO: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/registrar-download")
async def registrar_download(dados: RegistroLogConfig):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    log_line = f"{timestamp};{dados.lider_nome};{dados.perfil_lider};{dados.senioridade};{dados.tempo_empresa};{dados.perfil_comportamental};Sim\n"
    salvar_linha_log(log_line)
        
    return {"status": "sucesso"}